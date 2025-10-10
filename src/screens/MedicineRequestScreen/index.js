import React, { useState, useEffect } from 'react';
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
  FlatList
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
  
  // Prescription states
  const [selectedFile, setSelectedFile] = useState(null);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [duration, setDuration] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // User data state
  const [user, setUser] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  
  // Address states - Manual input
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');

  // Address states - Selection from saved addresses
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [newAddressModalVisible, setNewAddressModalVisible] = useState(false);
  
  // New address form
  const [newAddress, setNewAddress] = useState({
    full_name: '',
    phone_number: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',
  });

  const durationOptions = ['7 days', '14 days', '1 month', '2 months'];

  // Fetch user data and addresses on component mount
  useEffect(() => {
    fetchUser();
    fetchAddresses();
  }, []);

  const fetchUser = async () => {
    try {
      setPageLoading(true);
      const token = await getToken();
      
      const response = await fetch(`${BASE_URL}/me/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      setUser(data);

      if (response.ok) {
        console.log("User data fetched successfully");
      } else {
        console.error('Failed to fetch user:', data);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setPageLoading(false);
    }
  };

  // ✅ Fetch saved addresses
  const fetchAddresses = async () => {
    try {
      const token = await getToken();
      const response = await fetch(`${BASE_URL}/medicine-requests/delivery-address`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setAddresses(data.addresses || []);
      
      // Set default address if available
      const defaultAddress = data.addresses?.find(addr => addr.is_default);
      if (defaultAddress) {
        setSelectedAddress(defaultAddress);
        populateAddressFields(defaultAddress);
      }
    } catch (err) {
      console.error('Error fetching addresses:', err);
    }
  };

  // Populate address fields when selecting from saved addresses
  const populateAddressFields = (address) => {
    setAddressLine1(address.address_line1);
    setAddressLine2(address.address_line2 || '');
    setCity(address.city);
    setState(address.state);
    setPostalCode(address.postal_code);
    setCountry(address.country);
  };

  // ✅ Handle address selection
  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    populateAddressFields(address);
    setAddressModalVisible(false);
  };

  // ✅ Add new address
const handleAddAddress = async () => {
  try {
    const token = await getToken();
    const addressData = {
      ...newAddress,
      full_name: newAddress.full_name || user?.full_name || '',
      phone_number: newAddress.phone_number || user?.phone_number || '',
    };

    const response = await fetch(`${BASE_URL}/medicine-requests/delivery-address`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(addressData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Address save failed');
    }

    // ✅ Fetch the updated address list
    const updatedAddressesResponse = await fetch(`${BASE_URL}/medicine-requests/delivery-address`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const updatedData = await updatedAddressesResponse.json();
    const updatedAddresses = updatedData.addresses || [];
    setAddresses(updatedAddresses);

    // ✅ Select the newly added address
    const newlyAdded = updatedAddresses.find(addr =>
      addr.address_line1 === addressData.address_line1 &&
      addr.postal_code === addressData.postal_code
    );
    if (newlyAdded) {
      handleAddressSelect(newlyAdded);
    }

    setNewAddressModalVisible(false);
    setNewAddress({
      full_name: '',
      phone_number: '',
      address_line1: '',
      address_line2: '',
      city: '',
      state: '',
      postal_code: '',
      country: '',
    });

    Alert.alert(t('success'), t('medicine_request.address_saved'));

  } catch (err) {
    console.error('Error adding address:', err);
    Alert.alert(t('error'), t('medicine_request.address_save_failed'));
  }
};


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
          Alert.alert(t('error'), 'Only JPG, PNG, or PDF files are allowed');
          return;
        }
        
        // Validate file size (20MB max)
        if (file.size > 20 * 1024 * 1024) {
          Alert.alert(t('error'), 'File size must be less than 20MB');
          return;
        }
        
        setSelectedFile(file);
      }
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        Alert.alert(t('error'), 'Failed to pick document');
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
    setDuration(text);
  };

  const validateAddressFields = () => {
    if (!addressLine1.trim()) {
      Alert.alert(t('error'), t('medicine_request.address_line1_required'));
      return false;
    }
    if (!city.trim()) {
      Alert.alert(t('error'), t('medicine_request.city_required'));
      return false;
    }
    if (!state.trim()) {
      Alert.alert(t('error'), t('medicine_request.state_required'));
      return false;
    }
    if (!postalCode.trim()) {
      Alert.alert(t('error'), t('medicine_request.postal_code_required'));
      return false;
    }
    if (!country.trim()) {
      Alert.alert(t('error'), t('medicine_request.country_required'));
      return false;
    }
    return true;
  };

    console.log('==============5678987=================',selectedAddress?.id);


  const handleSubmit = async () => {
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

  if (!/^\d+\s*(days?|months?)$/i.test(duration)) {
    Alert.alert(t('error'), t('medicine_request.duration_format_error'));
    return;
  }

  const sixDaysAgo = moment().subtract(6, 'days');
  if (moment(date).isBefore(sixDaysAgo)) {
    Alert.alert(t('error'), t('medicine_request.old_prescription_error'));
    return;
  }

  if (moment(date).isAfter(moment())) {
    Alert.alert(t('error'), t('medicine_request.future_date_error'));
    return;
  }

  if (!validateAddressFields()) {
    return;
  }

  const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
  if (!validTypes.includes(selectedFile.type)) {
    Alert.alert(t('error'), t('medicine_request.invalid_file_type_error'));
    return;
  }

  if (selectedFile.size > 20 * 1024 * 1024) {
    Alert.alert(t('error'), t('medicine_request.large_file_error'));
    return;
  }

  try {
    setIsSubmitting(true);

    const fileContent = await RNFS.readFile(selectedFile.uri, 'base64');
    const base64String = `data:${selectedFile.type};base64,${fileContent}`;

    // Combine medicine request + delivery address
    const medicineRequestBody = {
      file_base64: base64String,
      file_name: selectedFile.name || `prescription_${Date.now()}.${getFileExtension(selectedFile.type)}`,
      file_type: selectedFile.type || 'application/octet-stream',
      issue_date: moment(date).format('YYYY-MM-DD HH:mm:ss'),
      duration: duration.toLowerCase(),
     delivery_address_id: selectedAddress.id
    };

    console.log('=== MEDICINE REQUEST PAYLOAD ===');
    console.log('URL:', `${BASE_URL}/medicine-requests`);
    console.log('Payload:', {
      ...medicineRequestBody,
      file_base64: `${medicineRequestBody.file_base64.substring(0, 100)}...`
    });
    console.log('===============================',selectedAddress.id);

    const token = await getToken();

    const medicineResponse = await fetch(`${BASE_URL}/medicine-requests`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(medicineRequestBody),
    });

    const medicineResponseData = await medicineResponse.json();

    console.log('=== MEDICINE REQUEST RESPONSE ===');
    console.log('Status:', medicineResponse.status);
    console.log('Response:', medicineResponseData);
    console.log('===============================');

    if (!medicineResponse.ok) {
      throw new Error(medicineResponseData.message || t('medicine_request.submission_failed'));
    }

    Alert.alert(t('success'), t('prescription_upload_success'));
    navigation.goBack();

  } catch (error) {
    console.error('Submission error:', error);
    let errorMessage = error.message || t('medicine_request.submission_failed');

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

  // ✅ Render address card for modal
  const renderAddressItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.addressCard,
        selectedAddress?.id === item.id && styles.selectedAddressCard,
      ]}
      onPress={() => handleAddressSelect(item)}
    >
      <View style={{ flex: 1 }}>
        <Text style={styles.addressName}>{item.full_name}</Text>
        <Text style={styles.addressPhone}>{item.phone_number}</Text>
        <Text style={styles.addressLine}>
          {item.address_line1}
          {item.address_line2 ? `, ${item.address_line2}` : ''}
        </Text>
        <Text style={styles.addressLine}>
          {item.city}, {item.state} - {item.postal_code}
        </Text>
        <Text style={styles.addressCountry}>{item.country}</Text>

        {item.is_default && (
          <Text style={styles.defaultBadge}>Default</Text>
        )}
      </View>
      <Icon
        name={
          selectedAddress?.id === item.id
            ? 'radio-button-checked'
            : 'radio-button-unchecked'
        }
        size={24}
        color={selectedAddress?.id === item.id ? Colors.darkBlue : '#ccc'}
      />
    </TouchableOpacity>
  );

  if (pageLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.darkBlue} />
          <Text style={styles.loadingText}>{t('loading')}</Text>
        </View>
      </SafeAreaView>
    );
  }

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

        {/* Delivery Address Section */}
        <Text style={styles.sectionTitle}>{t('medicine_request.delivery_address')}</Text>

        {/* Address Selection Options */}
     <View style={styles.addressOptionsContainer}>
  <TouchableOpacity 
    style={styles.addressOptionButton}
    onPress={() => setAddressModalVisible(true)}
  >
    <Icon name="location-on" size={20} color={Colors.darkBlue} />
    <Text style={styles.addressOptionText}>{t('medicine_request.choose_address')}</Text>
  </TouchableOpacity>

  <TouchableOpacity 
    style={styles.addressOptionButton}
    onPress={() => setNewAddressModalVisible(true)}
  >
    <Icon name="add-location" size={20} color={Colors.darkBlue} />
    <Text style={styles.addressOptionText}>{t('medicine_request.add_new_address')}</Text>
  </TouchableOpacity>
</View>

{/* Selected Address Display */}
{selectedAddress && (
  <View style={styles.selectedAddressContainer}>
    <Text style={styles.selectedAddressTitle}>{t('medicine_request.selected_address')}:</Text>
    <Text style={styles.selectedAddressText}>{selectedAddress.full_name}</Text>
    <Text style={styles.selectedAddressText}>{selectedAddress.phone_number}</Text>
    <Text style={styles.selectedAddressText}>
      {selectedAddress.address_line1}
      {selectedAddress.address_line2 ? `, ${selectedAddress.address_line2}` : ''}
    </Text>
    <Text style={styles.selectedAddressText}>
      {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.postal_code}
    </Text>
    <Text style={styles.selectedAddressText}>{selectedAddress.country}</Text>
  </View>
)}

  
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

      {/* ✅ Address Selection Modal */}
      <Modal visible={addressModalVisible} animationType="slide">
        <View style={{ flex: 1, padding: 16 }}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setAddressModalVisible(false)}>
              <Icon name="arrow-back" size={24} color="#0e161b" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
  {t('medicine_request.modal.select_address_title')}
</Text>
            <View style={{ width: 24 }} />
          </View>

          {addresses.length > 0 ? (
            <FlatList
              data={addresses}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderAddressItem}
            />
          ) : (
           <Text style={styles.noAddressesText}>
  {t('medicine_request.modal.no_addresses_text')}
</Text>
          )}

          <TouchableOpacity
            style={styles.addNewAddressButton}
            onPress={() => {
              setAddressModalVisible(false);
              setNewAddressModalVisible(true);
            }}
          >
          <Text style={styles.addNewAddressText}>
  {t('medicine_request.modal.add_new_address_button')}
</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* ✅ Add New Address Modal */}
      <Modal visible={newAddressModalVisible} animationType="slide">
        <View style={{ flex: 1, padding: 16 }}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setNewAddressModalVisible(false)}>
              <Icon name="arrow-back" size={24} color="#0e161b" />
            </TouchableOpacity>
           <Text style={styles.modalTitle}>
  {t('medicine_request.modal.add_new_address_title')}
</Text>
            <View style={{ width: 24 }} />
          </View>

          <TextInput
            style={styles.modalInput}
            placeholder="Full Name"
            value={newAddress.full_name || user?.full_name || ''}
            onChangeText={(text) => setNewAddress({ ...newAddress, full_name: text })}
          />
          <TextInput
            style={styles.modalInput}
            placeholder="Phone Number"
            value={newAddress.phone_number || user?.phone_number || ''}
            onChangeText={(text) => setNewAddress({ ...newAddress, phone_number: text })}
          />
          <TextInput
            style={styles.modalInput}
            placeholder="Address Line 1"
            value={newAddress.address_line1}
            onChangeText={(text) => setNewAddress({ ...newAddress, address_line1: text })}
          />
          <TextInput
            style={styles.modalInput}
            placeholder="Address Line 2"
            value={newAddress.address_line2}
            onChangeText={(text) => setNewAddress({ ...newAddress, address_line2: text })}
          />
          <TextInput
            style={styles.modalInput}
            placeholder="City"
            value={newAddress.city}
            onChangeText={(text) => setNewAddress({ ...newAddress, city: text })}
          />
          <TextInput
            style={styles.modalInput}
            placeholder="State"
            value={newAddress.state}
            onChangeText={(text) => setNewAddress({ ...newAddress, state: text })}
          />
          <TextInput
            style={styles.modalInput}
            placeholder="Postal Code"
            value={newAddress.postal_code}
            onChangeText={(text) => setNewAddress({ ...newAddress, postal_code: text })}
          />
          <TextInput
            style={styles.modalInput}
            placeholder="Country"
            value={newAddress.country}
            onChangeText={(text) => setNewAddress({ ...newAddress, country: text })}
          />

          <View style={{ flexDirection: 'row', marginTop: 16, gap: 12 }}>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: '#ccc', flex: 1 }]}
              onPress={() => setNewAddressModalVisible(false)}
            >
             <Text style={{ color: '#000' }}>
    {t('medicine_request.modal.cancel_button')}
  </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: Colors.darkBlue, flex: 1 }]}
              onPress={handleAddAddress}
            >
              <Text style={{ color: '#fff' }}>
    {t('medicine_request.modal.save_address_button')}
  </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  sectionSubtitle: {
    color: '#666',
    fontSize: 14,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
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
  hintText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  // Address Selection Styles
  addressOptionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 16,
  },
  addressOptionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.darkBlue,
    borderRadius: 8,
    gap: 8,
  },
  addressOptionText: {
    color: Colors.darkBlue,
    fontWeight: '600',
    fontSize: 14,
  },
  selectedAddressContainer: {
    padding: 16,
    margin: 16,
    backgroundColor: '#f0f9ff',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: Colors.darkBlue,
  },
  selectedAddressTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.darkBlue,
    marginBottom: 8,
  },
  selectedAddressText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 2,
  },
  // Modal Styles
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0e161b',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
  },
  modalButton: {
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  // Address Card Styles
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  selectedAddressCard: {
    borderColor: Colors.darkBlue,
    backgroundColor: '#f0f9ff',
  },
  addressName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0e161b',
  },
  addressPhone: {
    fontSize: 14,
    color: '#444',
    marginBottom: 4,
  },
  addressLine: {
    fontSize: 14,
    color: '#666',
  },
  addressCountry: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginTop: 4,
  },
  defaultBadge: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
    backgroundColor: Colors.darkBlue,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  noAddressesText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    marginVertical: 20,
  },
  addNewAddressButton: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.darkBlue,
    alignItems: 'center',
  },
  addNewAddressText: {
    color: Colors.darkBlue,
    fontWeight: '600',
  },
});

export default MedicineRequestScreen;