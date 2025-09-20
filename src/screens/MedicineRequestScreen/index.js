import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  Alert,
  Platform,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DocumentPicker from 'react-native-document-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import Colors from '../../constants/Colors';
import { getToken } from '../../navigation/auth';
import { BASE_URL } from '../../navigation/Config';
import RNFS from 'react-native-fs';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';

const MedicineRequestScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [selectedFile, setSelectedFile] = useState(null);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [duration, setDuration] = useState('');
  const [showDurationPicker, setShowDurationPicker] = useState(false);
  const [address, setAddress] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const durationOptions = ['7 days', '14 days', '1 month', '2 months'];

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [
          DocumentPicker.types.images,
          DocumentPicker.types.pdf,
        ],
      });
      
      if (result && result.length > 0) {
        const file = result[0];
        
        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
        if (!validTypes.includes(file.type)) {
          Alert.alert('Error', 'Only JPG, PNG, or PDF files are allowed');
          return;
        }
        
        // Validate file size (20MB max)
        if (file.size > 20 * 1024 * 1024) {
          Alert.alert('Error', 'File size must be less than 20MB');
          return;
        }
        
        setSelectedFile(file);
      }
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        Alert.alert('Error', 'Failed to pick document');
      }
    }
  };

  const handleDragEnter = () => setIsDragging(true);
  const handleDragLeave = () => setIsDragging(false);

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
  };


const validateDuration = (text) => {
  // Allow any input while typing, but validate on submit
  setDuration(text);
};
  const handleSubmit = async () => {
    // Required fields
    if (!selectedFile) {
      Alert.alert(t('error'), t('medicine_request.no_file_error'));
      return;
    }

    if (!date) {
      Alert.alert(t('error'), t('medicine_request.no_date_error'));
      return;
    }

    if (!duration) {
      Alert.alert(t('error'), t('medicine_request.no_duration_error'));
      return;
    }

    // Validate duration format
    if (!/^\d+\s*(days?|months?)$/i.test(duration)) {
      Alert.alert(t('error'), t('medicine_request.duration_format_error'));
      return;
    }

    // Validate date is within last 6 days
    const sixDaysAgo = moment().subtract(6, 'days');
    if (moment(date).isBefore(sixDaysAgo)) {
      Alert.alert(t('error'), t('medicine_request.old_prescription_error'));
      return;
    }

    // Validate not in future
    if (moment(date).isAfter(moment())) {
      Alert.alert(t('error'), t('medicine_request.future_date_error'));
      return;
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!validTypes.includes(selectedFile.type)) {
      Alert.alert(t('error'), t('medicine_request.invalid_file_type_error'));
      return;
    }

    // Validate file size (max 20MB)
    if (selectedFile.size > 20 * 1024 * 1024) {
      Alert.alert(t('error'), t('medicine_request.large_file_error'));
      return;
    }

    try {
      setIsSubmitting(true);

      // Read file as base64
      const fileContent = await RNFS.readFile(selectedFile.uri, 'base64');
      const base64String = `data:${selectedFile.type};base64,${fileContent}`;

      // Prepare request body
      const requestBody = {
        file_base64: base64String,
        file_name: selectedFile.name || `prescription_${Date.now()}.${getFileExtension(selectedFile.type)}`,
        file_type: selectedFile.type || 'application/octet-stream',
        issue_date: moment(date).format('YYYY-MM-DD HH:mm:ss'),
        duration: duration.toLowerCase()
      };

      const token = await getToken();

      const response = await fetch(`${BASE_URL}/medicine-requests`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const responseData = await response.json();

  if (!response.ok) {
  throw new Error(responseData.message || t('medicine_request.submission_failed'));
}

Alert.alert(t('success'), t('prescription_upload_success'));
navigation.goBack();

    } catch (error) {
      console.error('Submission error:', error);
      let errorMessage = error.message || t('medicine_request.submission_failed');
      
      // Enhanced error messages
      if (error.message.includes('Duplicate')) {
        errorMessage = t('medicine_request.duplicate_error');
      } else if (error.message.includes('Invalid file')) {
        errorMessage = t('medicine_request.corrupted_file_error');
      } else if (error.message.includes('File too large')) {
        errorMessage = t('medicine_request.large_file_error');
      }
      
      Alert.alert(t('error'), errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFileExtension = (mimeType) => {
    if (!mimeType) return 'pdf';
    if (mimeType.includes('jpeg')) return 'jpg';
    if (mimeType.includes('png')) return 'png';
    if (mimeType.includes('pdf')) return 'pdf';
    return mimeType.split('/')[1] || 'pdf';
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#0e161b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('medicine_request.title')}</Text>
        <View style={styles.headerIconPlaceholder}>
          <TouchableOpacity>
            <Icon name="info-outline" size={24} color="#f0f3f5ff" />
          </TouchableOpacity>
        </View>
      </View>
      
      <ScrollView style={styles.scrollView}>
        {/* Prescription Section */}
        <Text style={styles.sectionTitle}>{t('medicine_request.prescription')}</Text>
      
        {/* Drag and Drop Area */}
        <TouchableOpacity 
          style={[styles.uploadArea, isDragging && styles.uploadAreaDragging]}
          onPress={pickDocument}
          activeOpacity={0.7}
          onPressIn={handleDragEnter}
          onPressOut={handleDragLeave}
        >
          <View style={styles.uploadContent}>
            <Text style={styles.uploadTitle}>{t('medicine_request.drag_drop')}</Text>
            <Text style={styles.uploadSubtitle}>{t('medicine_request.file_types')}</Text>
          </View>
          <TouchableOpacity 
            style={styles.browseButton}
            onPress={pickDocument}
          >
            <Text style={styles.browseButtonText}>{t('medicine_request.browse_files')}</Text>
          </TouchableOpacity>
        </TouchableOpacity>

        {selectedFile && (
          <View style={styles.selectedFileContainer}>
            <Text style={styles.selectedFileText}>
              {t('medicine_request.selected_file')}: {selectedFile.name}
              {selectedFile.size && ` (${Math.round(selectedFile.size / 1024)} KB)`}
            </Text>
          </View>
        )}

        {/* Prescription Details */}
        <Text style={styles.sectionTitle}>{t('medicine_request.prescription_details')}</Text>
        
        {/* Date Picker */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>{t('medicine_request.issue_date')}</Text>
          <TouchableOpacity 
            style={styles.dateInput}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateText}>
              {date ? moment(date).format('DD/MM/YYYY') : 'DD/MM/YYYY'}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={onChangeDate}
              maximumDate={new Date()}
            />
          )}
        </View>

        {/* Medicine Duration */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>{t('medicine_request.medicine_duration')}</Text>
          <TextInput
            style={styles.durationInput}
            placeholder={t('medicine_request.duration_placeholder')}
            value={duration}
            onChangeText={validateDuration}
          />
          <Text style={styles.hintText}>{t('medicine_request.duration_hint')}</Text>
        </View>

        {/* Delivery Address */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>{t('delivery_address')}</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder={t('medicine_request.address_placeholder')}
            multiline
            numberOfLines={4}
            value={address}
            onChangeText={setAddress}
          />
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.submitButtonContainer}>
        <TouchableOpacity 
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.submitButtonText}>{t('medicine_request.submit_request')}</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffffff',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingBottom: 8,
    backgroundColor: '#ffffffff',
  },
  headerTitle: {
    color: '#0e161b',
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 24,
    letterSpacing: -0.015,
    textAlign: 'center',
    flex: 1,
    marginRight: 24,
  },
  headerIconPlaceholder: {
    width: 24,
  },
  sectionTitle: {
    color: '#0e161b',
    fontSize: 17,
    fontWeight: 'bold',
    lineHeight: 24,
    letterSpacing: -0.015,
    paddingHorizontal: 16,
    paddingTop: '10%',
    paddingBottom: 8,
  },
  uploadArea: {
    borderWidth: 2,
    borderColor: '#d0dee7',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 24,
    margin: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  uploadAreaDragging: {
    borderColor: '#1993e5',
    backgroundColor: '#f0f9ff',
  },
  uploadContent: {
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
  },
  uploadTitle: {
    color: '#0e161b',
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 24,
    letterSpacing: -0.015,
    textAlign: 'center',
  },
  uploadSubtitle: {
    color: '#0e161b',
    fontSize: 14,
    fontWeight: 'normal',
    lineHeight: 20,
    textAlign: 'center',
  },
  browseButton: {
    minWidth: 84,
    height: 40,
    paddingHorizontal: 16,
    backgroundColor: '#e7eef3',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  browseButtonText: {
    color: '#0e161b',
    fontSize: 14,
    fontWeight: 'bold',
    lineHeight: 20,
    letterSpacing: 0.015,
  },
  selectedFileContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  selectedFileText: {
    color: '#0e161b',
    fontSize: 14,
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
  input: {
    width: '100%',
    minHeight: 56,
    borderWidth: 1,
    borderColor: '#d0dee7',
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    padding: 15,
    fontSize: 16,
    fontWeight: 'normal',
    lineHeight: 24,
    color: '#0e161b',
    justifyContent: 'center',
  },
  inputText: {
    fontSize: 16,
    color: '#0e161b',
  },
  placeholderText: {
    fontSize: 16,
    color: '#a0aec0',
  },
  textArea: {
    minHeight: 144,
    textAlignVertical: 'top',
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
  submitButtonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f8fafc',
  },
  submitButton: {
    height: 48,
    paddingHorizontal: 20,
    backgroundColor: Colors.darkBlue,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 24,
    letterSpacing: 0.015,
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
  optionButton: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  optionText: {
    fontSize: 16,
    textAlign: 'center',
  },
  cancelButton: {
    padding: 15,
    marginTop: 10,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    textAlign: 'center',
    color: Colors.darkBlue,
    fontWeight: 'bold',
  },
    hintText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
  },
    durationInput: {
    width: '100%',
    minHeight: 56,
    borderWidth: 1,
    borderColor: '#d0dee7',
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    padding: 15,
    fontSize: 16,
    fontWeight: 'normal',
    lineHeight: 24,
    color: '#0e161b',
  },
});

export default MedicineRequestScreen;