import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, ActivityIndicator, Alert, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '../../constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';
import { BASE_URL } from '../../navigation/Config';
import { getToken } from '../../navigation/auth';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import RNPickerSelect from 'react-native-picker-select';

const ReferralReview = ({ navigation, route }) => {
  const { t } = useTranslation();
  const { appointment } = route.params;
  const [specialization, setSpecialization] = useState('');
  const [hospital, setHospital] = useState(appointment.hospital_name);
  const [notes, setNotes] = useState('');
  const [isHospitalChanged, setIsHospitalChanged] = useState(false);
  const [hospitals, setHospitals] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [tempHospital, setTempHospital] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionNote, setRejectionNote] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getToken();
        if (!token) {
          Alert.alert(t('error'), t('referral_review.auth_error'));
          return;
        }

        // Fetch hospitals
        const hospitalsResponse = await fetch(`${BASE_URL}/hospital/`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const hospitalsData = await hospitalsResponse.json();
        setHospitals(hospitalsData.hospitals || []);

        // Fetch specialties
        const specialtiesResponse = await fetch(`${BASE_URL}/specialties/`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const specialtiesData = await specialtiesResponse.json();
        setSpecialties(specialtiesData.specialties || []);
      } catch (error) {
        console.error(t('referral_review.data_fetch_error'), error);
        Alert.alert(t('error'), t('referral_review.data_load_error'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleHospitalChange = (itemValue) => {
    const currentHospitalId = Number(appointment.hospital_id);
    const selectedHospital = hospitals.find(h => h.name === itemValue);
    
    if (selectedHospital && Number(selectedHospital.id) !== currentHospitalId) {
      setTempHospital(itemValue);
      setShowNotesModal(true);
    }
  };

  const confirmHospitalChange = async () => {
    if (!notes.trim()) {
      Alert.alert(t('error'), t('referral_review.hospital_change_reason_error'));
      return;
    }

    setHospital(tempHospital);
    setIsHospitalChanged(true);
    setShowNotesModal(false);

    try {
      const token = await getToken();
      const selectedHospital = hospitals.find(h => h.name === tempHospital);
      if (!selectedHospital) {
        throw new Error(t('referral_review.hospital_not_found'));
      }

      const updatePayload = {
        appointmentId: appointment.id,
        newHospitalId: selectedHospital.id,
        changeNote: notes
      };

      Alert.alert(
        t('referral_review.confirm_hospital_change_title'),
        t('referral_review.confirm_hospital_change_message'),
        [
          {
            text: t('cancel'),
            style: 'cancel',
            onPress: () => {
              setHospital(appointment.hospital_name);
              setIsHospitalChanged(false);
            }
          },
          { 
            text: t('yes'), 
            onPress: async () => {
              try {
                const updateResponse = await fetch(`${BASE_URL}/appointments/updatehospital/`, {
                  method: 'POST',
                  headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(updatePayload)
                });

                const responseBody = await updateResponse.json().catch(() => ({}));

                if (!updateResponse.ok) {
                  throw new Error(responseBody.message || t('referral_review.hospital_update_failed'));
                }

                Toast.show(t('referral_review.hospital_update_success'), Toast.LONG);
                navigation.goBack();
              } catch (error) {
                console.error(t('referral_review.hospital_change_api_error'), error);
                Alert.alert(t('error'), error.message || t('referral_review.hospital_update_failed'));
                setHospital(appointment.hospital_name);
                setIsHospitalChanged(false);
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error(t('referral_review.hospital_change_error'), error);
      Alert.alert(t('error'), error.message || t('referral_review.hospital_update_failed'));
      setHospital(appointment.hospital_name);
      setIsHospitalChanged(false);
    }
  };

  const handleApprove = async () => {
    try {
      if (!specialization) {
        Alert.alert(t('error'), t('referral_review.no_specialization_error'));
        return;
      }

      const token = await getToken();
      
      const approvalPayload = {
        appointment_id: appointment.id.toString(),
        doctor_approval: true,
        doctor_signature: true,
        specialty_id: specialization
      };


      console.log("approvalPayload",approvalPayload)

      const approveResponse = await fetch(`${BASE_URL}/appointments/approve/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(approvalPayload)
      });

      const responseBody = await approveResponse.json().catch(() => null);

      if (!approveResponse.ok) {
        throw new Error(responseBody?.message || t('referral_review.approval_failed'));
      }
      
      Toast.show(t('referral_review.approval_success'), Toast.LONG);
      navigation.goBack();
      
    } catch (error) {
      console.error(t('error'), error);
      Alert.alert(t('error'), error.message || t('referral_review.request_failed'));
    }
  };

  const handleReject = async () => {
    setShowRejectModal(true);
  };

  const confirmRejection = async () => {
    try {
      if (!rejectionNote.trim()) {
        Alert.alert(t('error'), t('referral_review.rejection_reason_error'));
        return;
      }

      const token = await getToken();
      
      const rejectionPayload = {
        appointment_id: appointment.id.toString(),
        rejection_reason: rejectionNote
      };

      const rejectResponse = await fetch(`${BASE_URL}/appointments/reject/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(rejectionPayload)
      });

      const responseBody = await rejectResponse.json().catch(() => null);

      if (!rejectResponse.ok) {
        throw new Error(responseBody?.message || t('referral_review.rejection_failed'));
      }

      Toast.show(t('referral_review.rejection_success'), Toast.LONG);
      setShowRejectModal(false);
      navigation.goBack();
      
    } catch (error) {
      console.error(t('error'), error);
      Alert.alert(t('error'), error.message || t('referral_review.rejection_failed'));
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={Colors.darkBlue} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
  {/* Header */}
<View style={styles.header}>
  <TouchableOpacity onPress={() => navigation.goBack()}>
    <Ionicons name="arrow-back" size={24} color="#0d141c" />
  </TouchableOpacity>
  <Text style={styles.headerTitle}>{t('referral_review.title')}</Text>
  <View style={{ width: 24 }} />
</View>


      <ScrollView contentContainerStyle={styles.content}>
        {/* Patient Info */}
        <View style={styles.patientInfoContainer}>
          <View style={styles.patientTextInfo}>
            <Text style={styles.patientLabel}>{t('referral_review.patient')}</Text>
            <Text style={styles.patientName}>{appointment.patient_name}</Text>
            <Text style={styles.patientDetails}>
              {t('referral_review.ec_number')}: {appointment.patient_ecno}
            </Text>
          </View>
           <Image 
                    style={styles.patientImage} 
                    source={{ 
                      uri: appointment.patient_photo_url
                        ? `${BASE_URL}${appointment.patient_photo_url.replace(/^\/api/, '')}`
                        : 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6iCqF0CKSARpJEMpI54q4W7czcfALHbNpBWTrRDz-Vwtoozz8Wn6wta1rIBmfy6wAM_5G52PkYydwL3T52x8IXfD8V_noYfr5Eamzd8nfGhRX5Z--UM_QMVjPmtivJjWHyCoZVDWklaAvR17aKdLSAghbeKHUoCyQ0sbEbKXVWd2VJj0aSvoZ_HU0dx-u7H0QKc8FhHiA4lgTgYZRbxSUpf1VudZvjIhTPtGOg7-Gangk-55GxD_mOulCKItluIvJrnPhcAXCDHoW' 
                    }} 
                    resizeMethod='contain'
                  />
        </View>

        {/* Treatment Details */}
        <Text style={styles.sectionTitle}>{t('referral_review.treatment_details')}</Text>
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{t('referral_review.treatment_description')}</Text>
            <Text style={styles.detailValue}>{appointment.consultation_reason}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{t('referral_review.requested_hospital')}</Text>
            <Text style={styles.detailValue}>{appointment.hospital_name}</Text>
          </View>
        </View>

        {/* Assignment */}
        <Text style={styles.sectionTitle}>{t('referral_review.assignment')}</Text>
        
        {/* Specialization Picker */}
    <View style={styles.pickerContainer}>
  <Text style={styles.pickerLabel}>{t('referral_review.assign_specialization')}</Text>
  <RNPickerSelect
    onValueChange={(value) => setSpecialization(value)}
    items={specialties.map(spec => ({
      label: spec.name,
      value: spec.id,
    }))}
    placeholder={{
      label: t('referral_review.select_specialization'),
      value: '',
    }}
    value={specialization}
    style={{
      inputIOS: styles.pickerInputIOS,
      inputAndroid: styles.pickerInputAndroid,
    }}
    useNativeAndroidPickerStyle={false}
  />
</View>

        {/* Hospital Picker */}
   <View style={styles.pickerContainer}>
  <Text style={styles.pickerLabel}>{t('referral_review.change_hospital')}</Text>
  <RNPickerSelect
    onValueChange={handleHospitalChange}
    items={[
      {
        label: appointment.hospital_name,
        value: appointment.hospital_name,
      },
      ...hospitals
        .filter(h => h.id !== appointment.hospital_id)
        .map(h => ({
          label: h.name,
          value: h.name,
        })),
    ]}
    placeholder={{
      label: t('referral_review.select_hospital'),
      value: '',
    }}
    value={hospital}
    style={{
      inputIOS: styles.pickerInputIOS,
      inputAndroid: styles.pickerInputAndroid,
    }}
    useNativeAndroidPickerStyle={false}
  />
</View>

      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.rejectButton} 
          onPress={handleReject}
        >
          <Text style={styles.rejectButtonText}>{t('referral_review.reject')}</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[
            styles.approveButton,
            !specialization && styles.disabledButton
          ]} 
          onPress={handleApprove}
          disabled={!specialization}
        >
          <Text style={styles.approveButtonText}>{t('referral_review.approve')}</Text>
        </TouchableOpacity>
      </View>

      {/* Hospital Change Notes Modal */}
      <Modal
        visible={showNotesModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {
          setShowNotesModal(false);
          setHospital(appointment.hospital_name);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity 
              style={styles.modalCloseButton}
              onPress={() => {
                setShowNotesModal(false);
                setHospital(appointment.hospital_name);
              }}
            >
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
            
            <Text style={styles.modalTitle}>{t('referral_review.hospital_change_reason_title')}</Text>
            <TextInput
              style={styles.modalNotesInput}
              placeholder={t('referral_review.hospital_change_placeholder')}
              multiline
              numberOfLines={4}
              value={notes}
              onChangeText={setNotes}
            />
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowNotesModal(false);
                  setHospital(appointment.hospital_name);
                }}
              >
                <Text style={styles.modalButtonText}>{t('cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]}
                onPress={confirmHospitalChange}
                disabled={!notes.trim()}
              >
                <Text style={{...styles.modalButtonText, color: 'white'}}>{t('confirm')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Rejection Notes Modal */}
      <Modal
        visible={showRejectModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowRejectModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity 
              style={styles.modalCloseButton}
              onPress={() => setShowRejectModal(false)}
            >
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
            
            <Text style={styles.modalTitle}>{t('referral_review.rejection_reason_title')}</Text>
            <TextInput
              style={styles.modalNotesInput}
              placeholder={t('referral_review.rejection_placeholder')}
              multiline
              numberOfLines={4}
              value={rejectionNote}
              onChangeText={setRejectionNote}
            />
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowRejectModal(false)}
              >
                <Text style={styles.modalButtonText}>{t('cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]}
                onPress={confirmRejection}
                disabled={!rejectionNote.trim()}
              >
                <Text style={{...styles.modalButtonText, color: 'white'}}>{t('confirm')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
   container: {
    flex: 1,
    backgroundColor: '#f8fafc',
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0d141c',
    textAlign: 'center',
    flex: 1,
  },
  content: {
    paddingBottom: 80,
  },
  patientInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  patientTextInfo: {
    flex: 2,
  },
  patientLabel: {
    fontSize: 14,
    color: '#49739c',
    marginBottom: 4,
  },
  patientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0d141c',
    marginBottom: 4,
  },
  patientDetails: {
    fontSize: 14,
    color: '#49739c',
  },
  patientImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0d141c',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  detailsContainer: {
    paddingHorizontal: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#cedbe8',
    paddingVertical: 20,
  },
  detailLabel: {
    fontSize: 14,
    color: '#49739c',
    width: '40%',
  },
  detailValue: {
    fontSize: 14,
    color: '#0d141c',
    width: '60%',
  },
  pickerContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  pickerLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0d141c',
    marginBottom: 8,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#cedbe8',
    borderRadius: 8,
    backgroundColor: '#f8fafc',
  },
  picker: {
    height: 56,
    color: '#0d141c',
  },
  notesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  notesLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0d141c',
    marginBottom: 8,
  },
  notesInput: {
    borderWidth: 1,
    borderColor: '#cedbe8',
    borderRadius: 8,
    backgroundColor: '#f8fafc',
    minHeight: 120,
    padding: 16,
    textAlignVertical: 'top',
    color: '#0d141c',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#f8fafc',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  approveButton: {
    flex: 1,
    backgroundColor: Colors.darkBlue,
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  approveButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  rejectButton: {
    flex: 1,
    backgroundColor: '#e7edf4',
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  rejectButtonText: {
    color: '#0d141c',
    fontSize: 14,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: Colors.lightBlue,
    opacity: 0.6,
  },
   modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: Colors.darkBlue,
  },
  modalNotesInput: {
    borderWidth: 1,
    borderColor: '#cedbe8',
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 15,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#e7edf4',
  },
  confirmButton: {
    backgroundColor: Colors.darkBlue,
  },
  modalButtonText: {
    fontWeight: 'bold',
  },
  modalCloseButton: {
  position: 'absolute',
  top: 10,
  right: 10,
  zIndex: 1,
},
pickerInputIOS: {
  fontSize: 16,
  paddingVertical: 12,
  paddingHorizontal: 10,
  borderWidth: 1,
  borderColor: '#cedbe8',
  borderRadius: 8,
  backgroundColor: '#f8fafc',
  color: '#0d141c',
},
pickerInputAndroid: {
  fontSize: 16,
  paddingHorizontal: 10,
  paddingVertical: 8,
  borderWidth: 1,
  borderColor: '#cedbe8',
  borderRadius: 8,
  backgroundColor: '#f8fafc',
  color: '#0d141c',
},
});

export default ReferralReview;