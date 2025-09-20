import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  Modal,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import Colors from '../../constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';
import { BASE_URL } from '../../navigation/Config';
import { getToken } from '../../navigation/auth';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';

const ReferralRequestScreen = ({route}) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [treatmentDescription, setTreatmentDescription] = useState('');
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [showPatientPicker, setShowPatientPicker] = useState(false);
  const [showHospitalPicker, setShowHospitalPicker] = useState(false);
  const [hospitals, setHospitals] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [patientType, setPatientType] = useState('self');
  const [inOutPatient, setInOutPatient] = useState('in');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState(new Date());
  const { referral } = route.params || {};
  const [isEditMode, setIsEditMode] = useState(false);
  const [originalHospitalId, setOriginalHospitalId] = useState(null);

  console.log("referral data",JSON.stringify(referral,null,2))

  // Check if we're in edit mode (received referral data)
  useEffect(() => {
    if (referral) {
      setIsEditMode(true);
      setPatientType(referral.relation);
      
      // Set original hospital ID
      if (referral.hospital_id) {
        setOriginalHospitalId(referral.hospital_id);
        setSelectedHospital({
          id: referral.hospital_id,
          name: referral.hospital_name
        });
      }
      
      // Set appointment date from referral data
      if (referral.appointment_time) {
        setAppointmentDate(new Date(referral.appointment_time));
      }
      
      // Set treatment description from referral data
      if (referral.consultation_reason) {
        setTreatmentDescription(referral.consultation_reason);
      }
      
      // Set in/out patient status
      if (referral.inoutpatient) {
        setInOutPatient(referral.inoutpatient);
      }
    }
  }, [referral]);

  // Fetch hospitals for selection
  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        setLoading(true);
        const token = await getToken();
        
        if (!token) {
          Alert.alert(t('error'), t('referral_request.auth_error'));
          return;
        }

        const response = await fetch(`${BASE_URL}/hospital/`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(t('referral_request.hospitals_fetch_error'));
        }

        const data = await response.json();
        
        if (data.hospitals && Array.isArray(data.hospitals)) {
          setHospitals(data.hospitals);
          
          // If in edit mode and we have a hospital ID, find and set the hospital
          if (isEditMode && referral?.hospital_id) {
            const currentHospital = data.hospitals.find(h => h.id === referral.hospital_id);
            if (currentHospital) {
              setSelectedHospital(currentHospital);
            }
          }
        } else {
          throw new Error(t('referral_request.invalid_hospitals_data'));
        }
      } catch (error) {
        console.error('Error fetching hospitals:', error);
        Alert.alert(t('error'), t('referral_request.hospitals_load_error'));
      } finally {
        setLoading(false);
      }
    };

    fetchHospitals();
  }, [isEditMode, referral]);

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || appointmentDate;
    setShowDatePicker(Platform.OS === 'ios');
    setAppointmentDate(currentDate);
  };

  // Function to change hospital
  const changeHospital = async (newHospitalId) => {
    try {
      const token = await getToken();
      const payload = {
        appointmentId: referral?.id,
        newHospitalId: newHospitalId,
      };
      console.log("📦 Request payload:", payload);

      const response = await fetch(`${BASE_URL}/appointments/modify-hospital`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log("response", response);
      
      if (!response.ok) {
        throw new Error(t('referral_request.hospital_change_failed'));
      }

      Toast.show(t('referral_request.hospital_change_success'), Toast.LONG);
      // Update the selected hospital and original hospital ID
      const newHospital = hospitals.find(h => h.id === newHospitalId);
      if (newHospital) {
        setSelectedHospital(newHospital);
        setOriginalHospitalId(newHospitalId); // Update original hospital ID after successful change
      }
     navigation.navigate('History');

    } catch (error) {
      console.error('Error changing hospital:', error);
      Toast.show(t('referral_request.hospital_change_error'), Toast.LONG);
    }
  };

  // Check if a different hospital is selected
  const isDifferentHospitalSelected = () => {
    return selectedHospital && selectedHospital.id !== originalHospitalId;
  };

  const handleSubmit = async () => {
    if (!isEditMode) {
      // Original submission logic for new referrals
      if (!treatmentDescription) {
        Toast.show(t('referral_request.no_treatment_error'), Toast.LONG);
        return;
      }
      if (!selectedHospital) {
        Toast.show(t('referral_request.no_hospital_error'), Toast.LONG);
        return;
      }
      if (patientType === 'family' && !selectedPatient) {
        Toast.show(t('referral_request.no_patient_error'), Toast.LONG);
        return;
      }

      const referralData = {
        patient_dependent_id: patientType === 'family' ? selectedPatient.id : null,
        relation: patientType,
        hospital_id: selectedHospital.id,
        consultation_reason: treatmentDescription,
        appointment_time: appointmentDate.toISOString(),
        inoutpatient: inOutPatient
      };

      try {
        const token = await getToken();
        const response = await fetch(`${BASE_URL}/appointments/create`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(referralData),
        });

        if (!response.ok) {
          throw new Error(t('referral_request.submission_failed'));
        }

        const responseData = await response.json();
        Toast.show(t('referral_request.submission_success'), Toast.LONG);
        navigation.goBack();
      } catch (error) {
        console.error('Error submitting referral:', error);
        Toast.show(t('referral_request.submission_error'), Toast.LONG);
      }
    } else {
      // In edit mode, we only allow changing the hospital
      if (!selectedHospital) {
        Toast.show(t('referral_request.no_hospital_error'), Toast.LONG);
        return;
      }
      
      // Check if a different hospital is selected
      if (!isDifferentHospitalSelected()) {
        Toast.show(t('referral_request.same_hospital_error'), Toast.LONG);
        return;
      }
      
      // Call the API to change hospital
      await changeHospital(selectedHospital.id);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <SafeAreaView edges={['top']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#0e161b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEditMode ? t('referral_request.edit_title') : t('referral_request.title')}
        </Text>
      </SafeAreaView>

      <ScrollView style={styles.scrollView}>
        {/* Patient Type Toggle - Disabled in edit mode */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>{t('referral_request.patient_type')}</Text>
          <View style={[styles.toggleContainer, isEditMode && styles.disabledContainer]}>
            <TouchableOpacity
              style={[styles.toggleButton, patientType === 'self' && styles.toggleButtonActive]}
              onPress={() => !isEditMode && setPatientType('self')}
              disabled={isEditMode}
            >
              <Text style={[styles.toggleButtonText, patientType === 'self' && styles.toggleButtonTextActive]}>
                {t('referral_request.self')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleButton, patientType === 'family' && styles.toggleButtonActive]}
              onPress={() => !isEditMode && setPatientType('family')}
              disabled={isEditMode}
            >
              <Text style={[styles.toggleButtonText, patientType === 'family' && styles.toggleButtonTextActive]}>
                {t('referral_request.family')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Select Patient (only shown for family) - Disabled in edit mode */}
        {patientType === 'family' && (
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>{t('referral_request.select_patient')}</Text>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={Colors.darkBlue} />
                <Text style={styles.loadingText}>{t('referral_request.loading_patients')}</Text>
              </View>
            ) : (
              <TouchableOpacity 
                style={[styles.selectInput, isEditMode && styles.disabledContainer]}
                onPress={() => !isEditMode && setShowPatientPicker(true)}
                disabled={isEditMode}
              >
                <Text style={selectedPatient ? styles.selectText : styles.placeholderText}>
                  {selectedPatient ? selectedPatient.full_name : t('referral_request.choose_patient')}
                </Text>
                {!isEditMode && <Icon name="keyboard-arrow-down" size={24} color="#4e7a97" />}
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Select Hospital */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>{t('referral_request.select_hospital')}</Text>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={Colors.darkBlue} />
              <Text style={styles.loadingText}>{t('referral_request.loading_hospitals')}</Text>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.selectInput}
              onPress={() => setShowHospitalPicker(true)}
            >
              <Text style={selectedHospital ? styles.selectText : styles.placeholderText}>
                {selectedHospital ? selectedHospital.name : t('referral_request.choose_hospital')}
              </Text>
              <Icon name="keyboard-arrow-down" size={24} color="#4e7a97" />
            </TouchableOpacity>
          )}
        </View>

        {/* In/Out Patient Radio Buttons - Disabled in edit mode */}
        {selectedHospital && (
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>{t('referral_request.patient_status')}</Text>
            <View style={[styles.radioContainer, isEditMode && styles.disabledContainer]}>
              <TouchableOpacity
                style={styles.radioButton}
                onPress={() => !isEditMode && setInOutPatient('in')}
                disabled={isEditMode}
              >
                <View style={styles.radioCircle}>
                  {inOutPatient === 'in' && <View style={styles.selectedRb} />}
                </View>
                <Text style={styles.radioText}>{t('referral_request.in_patient')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.radioButton}
                onPress={() => !isEditMode && setInOutPatient('out')}
                disabled={isEditMode}
              >
                <View style={styles.radioCircle}>
                  {inOutPatient === 'out' && <View style={styles.selectedRb} />}
                </View>
                <Text style={styles.radioText}>{t('referral_request.out_patient')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Treatment Description - Hidden in edit mode */}
        {!isEditMode && (
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>{t('referral_request.treatment_description')}</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder={t('referral_request.treatment_placeholder')}
              multiline
              numberOfLines={4}
              maxLength={200}
              value={treatmentDescription}
              onChangeText={setTreatmentDescription}
            />
            <Text style={styles.charLimit}>
              {t('referral_request.char_limit', { count: 200 - treatmentDescription.length })}
            </Text>
          </View>
        )}

        {/* Appointment Date - Hidden in edit mode */}
        {!isEditMode && (
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>{t('referral_request.appointment_date')}</Text>
            <TouchableOpacity 
              style={styles.dateInput}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateText}>
                {appointmentDate ? moment(appointmentDate).format('DD/MM/YYYY') : 'DD/MM/YYYY'}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={appointmentDate}
                mode="date"
                display="default"
                onChange={onChangeDate}
                minimumDate={new Date()}
              />
            )}
          </View>
        )}
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.submitButtonContainer}>
        <TouchableOpacity 
          style={[
            styles.submitButton, 
            isEditMode && !isDifferentHospitalSelected() && styles.submitButtonDisabled
          ]}
          onPress={handleSubmit}
          disabled={isEditMode && !isDifferentHospitalSelected()}
        >
          <Text style={styles.submitButtonText}>
            {isEditMode ? t('referral_request.update_hospital') : t('referral_request.submit_referral')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Hospital Picker Modal */}
      <Modal
        visible={showHospitalPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowHospitalPicker(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableWithoutFeedback onPress={() => setShowHospitalPicker(false)}>
            <View style={styles.modalOverlay} />
          </TouchableWithoutFeedback>
          <View style={styles.pickerContainer}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>{t('referral_request.select_hospital')}</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowHospitalPicker(false)}
              >
                <Icon name="close" size={24} color="#0e161b" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.pickerScrollView}>
              {hospitals.map(hospital => (
                <TouchableOpacity
                  key={hospital.id}
                  style={styles.pickerItem}
                  onPress={() => {
                    setSelectedHospital(hospital);
                    setShowHospitalPicker(false);
                  }}
                >
                  <Text style={styles.pickerItemText}>{hospital.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingBottom: 8,
    backgroundColor: '#f8fafc',
  },
  headerTitle: {
    color: '#0e161b',
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 24,
    letterSpacing: -0.015,
    textAlign: 'center',
    flex: 1,
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputLabel: {
    color: '#0e161b',
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
    paddingBottom: 8,
  },
  toggleContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#d0dee7',
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    overflow: 'hidden',
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleButtonActive: {
    backgroundColor: Colors.darkBlue,
  },
  toggleButtonText: {
    fontSize: 16,
    color: '#4e7a97',
  },
  toggleButtonTextActive: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  radioContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.darkBlue,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  selectedRb: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.darkBlue,
  },
  radioText: {
    fontSize: 16,
    color: '#0e161b',
  },
  selectInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    minHeight: 56,
    borderWidth: 1,
    borderColor: '#d0dee7',
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    paddingHorizontal: 15,
  },
  selectText: {
    fontSize: 16,
    color: '#0e161b',
  },
  placeholderText: {
    fontSize: 16,
    color: '#4e7a97',
  },
  input: {
    width: '100%',
    minHeight: 56,
    borderWidth: 1,
    borderColor: '#d0dee7',
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    padding: 15,
    fontSize: 16,
    color: '#0e161b',
  },
  textArea: {
    minHeight: 144,
    textAlignVertical: 'top',
  },
  charLimit: {
    color: '#4e7a97',
    fontSize: 14,
    paddingLeft: 16,
    paddingTop: 4,
  },
  submitButtonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f8fafc',
  },
  submitButton: {
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.darkBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#cccccc',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
  },
  pickerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '70%',
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f3f4',
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0e161b',
  },
  closeButton: {
    padding: 8,
  },
  pickerScrollView: {
    maxHeight: '100%',
  },
  pickerItem: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f3f4',
  },
  pickerItemText: {
    fontSize: 16,
    color: '#0e161b',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderWidth: 1,
    borderColor: '#d0dee7',
    borderRadius: 12,
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    marginLeft: 10,
    color: '#4e7a97',
  },
  dateInput: {
    width: '100%',
    minHeight: 56,
    borderWidth: 1,
    borderColor: '#d0dee7',
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    padding: 15,
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'normal',
    lineHeight: 24,
    color: '#0e161b',
  },
  disabledContainer: {
    opacity: 0.6,
  },
});

export default ReferralRequestScreen;