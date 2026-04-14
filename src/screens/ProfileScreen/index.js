// src/screens/ProfileScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
  Alert,
  TextInput,
  ActivityIndicator,
  Linking,
  Modal,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useFocusEffect } from '@react-navigation/native';
import { getToken } from '../../navigation/auth';
import { BASE_URL } from '../../navigation/Config';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../../components/LanguageSelector';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [editing, setEditing] = useState(false);
  const [emailModalVisible, setEmailModalVisible] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [updatingEmail, setUpdatingEmail] = useState(false);
  
  const [profile, setProfile] = useState({
    name: 'Sophia Carter',
    ecNumber: '1234567890',
    email: 'sophia.carter@email.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main St, Anytown, USA'
  });

  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const [patients, setPatients] = useState([]);
  const [showDependents, setShowDependents] = useState(true);

  const handleABHARegistration = () => {
    Linking.openURL('https://abha.abdm.gov.in/abha/v3/register')
      .catch(err => console.error('Failed to open URL:', err));
  };

  const fetchPatients = async () => {
    try {
      const token = await getToken();
      if (!token) {
        Alert.alert(t('error'), t('referral_request.auth_error'));
        return;
      }

      const response = await fetch(`${BASE_URL}/dependents/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      console.log("response status:", response.status);
      
      if (!response.ok) {
        if (response.status === 404) {
          console.log("Dependents endpoint not found - feature may not be available");
          setShowDependents(false);
          return;
        }
        if (response.status === 403) {
          setShowDependents(false);
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.log("Non-JSON response received - dependents feature may not be available");
        setShowDependents(false);
        return;
      }

      const data = await response.json();
      console.log("data", data);
      
      if (data.dependents && Array.isArray(data.dependents)) {
        setPatients(data.dependents);
        setShowDependents(true);
      } else {
        console.log("Invalid dependents data format");
        setShowDependents(false);
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
      setShowDependents(false);
    }
  };

  const fetchUser = async () => {
    try {
      setLoading(true);
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
      setNewEmail(data.email || '');
      if (response.ok) {
        console.log("got user");
      } else {
        console.error('Failed to fetch user:', data);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailUpdate = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      Alert.alert(t('error'), t('please_enter_valid_email'));
      return;
    }

    setUpdatingEmail(true);
    try {
      const token = await getToken();
      if (!token) {
        Alert.alert(t('error'), t('referral_request.auth_error'));
        return;
      }
      
      console.log("Attempting to update email to:", newEmail);
      console.log("Using endpoint:", `${BASE_URL}/me/update-email`);
      
      const response = await fetch(`${BASE_URL}/me/update-email/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: newEmail
        }),
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('text/html')) {
          const text = await response.text();
          console.error("Received HTML response instead of JSON:", text.substring(0, 200));
          
          if (response.status === 404) {
            Alert.alert(
              t('error'), 
              "Email update endpoint not found. Please check API configuration."
            );
          } else {
            Alert.alert(
              t('error'), 
              `Server error (${response.status}). Please try again later.`
            );
          }
          return;
        }
        
        try {
          const errorData = await response.json();
          console.error("Error response:", errorData);
          
          if (errorData.message === "Email already registered to another user") {
            Alert.alert(t('error'), t('email_already_registered'));
          } else if (errorData.message === "Invalid email format") {
            Alert.alert(t('error'), t('please_enter_valid_email'));
          } else if (response.status === 404) {
            Alert.alert(t('error'), "User not found");
          } else {
            Alert.alert(t('error'), errorData.message || t('email_update_failed'));
          }
        } catch (parseError) {
          console.error("Could not parse error response:", parseError);
          Alert.alert(t('error'), `Server error (${response.status})`);
        }
        return;
      }

      const data = await response.json();
      console.log("Email update success:", data);
      
      Alert.alert(t('success'), data.message || t('email_updated_successfully'));
      setEmailModalVisible(false);
      await fetchUser();
      
    } catch (error) {
      console.error('Error updating email:', error);
      Alert.alert(
        t('error'), 
        error.message || t('network_error')
      );
    } finally {
      setUpdatingEmail(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchUser();
      fetchPatients();
      return () => {};
    }, [])
  );

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleSave = () => {
    setEditing(false);
    Alert.alert(t('success'), t('profile_updated'));
  };

  const openEmailEditModal = () => {
    setNewEmail(user.email || '');
    setEmailModalVisible(true);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="#0d131c" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('profile')}</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0d131c" />
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
          <Icon name="arrow-back" size={24} color="#0d131c" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('profile')}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={true}
        contentContainerStyle={styles.scrollViewContent}
        // Important: This allows the dropdown to overflow the ScrollView
        removeClippedSubviews={false}
      >
        {/* Profile Picture and Basic Info */}
        <View style={styles.profileHeader}>
          {user?.photo_url ? (
            <Image 
              style={styles.profileImage} 
              source={{ 
                uri: `${BASE_URL}${user.photo_url.replace(/^\/api/, '')}`
              }} 
              resizeMethod='contain'
            />
          ) : (
            <Image 
              style={styles.profileImage} 
              source={require('../../assets/images/profile.png')} 
              resizeMethod='contain'
            />
          )}
          <Text style={styles.profileName}>{user.full_name}</Text>
          <Text style={styles.profileEc}>
            {t('ec_number', { ecno: user.ecno })}
          </Text>
          
          {/* Language Selector - Wrapped in a View with higher zIndex */}
          <View style={styles.languageSelectorWrapper}>
            <LanguageSelector 
              style={styles.languageSelector} 
              dropdownStyle={styles.languageDropdown}
            />
          </View>
        </View>

        {/* Profile Details Section */}
        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>{t('profile_details')}</Text>
          
          {/* Email with Edit Icon */}
          <View style={styles.detailItem}>
            <View style={styles.detailHeader}>
              <Text style={styles.detailLabel}>{t('email_address')}</Text>
              <TouchableOpacity onPress={openEmailEditModal} style={styles.editIconButton}>
                <Icon name="edit" size={20} color="#496a9c" />
              </TouchableOpacity>
            </View>
            <Text style={styles.detailValue}>
              {user.email && user.email.trim() !== '' ? user.email : t('not_provided')}
            </Text>
          </View>

          {/* Phone */}
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>{t('phone_number')}</Text>
            {editing ? (
              <TextInput
                style={styles.input}
                value={user.phone}
                onChangeText={(text) => setProfile({...profile, phone: text})}
              />
            ) : (
              <Text style={styles.detailValue}>{user.phone_number}</Text>
            )}
          </View>

          {/* Date of Birth */}
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>{t('date_of_birth')}</Text>
            <Text style={styles.detailValue}>
              {formatDate(user.date_of_birth)}
            </Text>
          </View>

          {/* Address */}
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>{t('delivery_address')}</Text>
            {editing ? (
              <TextInput
                style={styles.input}
                value={user.address}
                onChangeText={(text) => setProfile({...profile, address: text})}
              />
            ) : (
              <Text style={styles.detailValue}>{user.address}</Text>
            )}
          </View>
        </View>

        {/* ABHA Registration Section - FIXED */}
        <View style={styles.abhaContainer}>
          <Text style={styles.abhaText}>
            <Text>{t('dont_have_abha')}</Text>
            <Text> </Text>
            <Text style={styles.abhaLink} onPress={handleABHARegistration}>
              {t('click_here_to_register')}
            </Text>
          </Text>
        </View>

        {/* Dependents Section */}
        {showDependents && (
          <View style={styles.dependentsSection}>
            <Text style={styles.sectionTitle}>{t('dependents')}</Text>
            
            {patients.length > 0 ? (
              <View style={styles.dependentsContainer}>
                {patients.map((patient, index) => (
                  <View key={patient.id} style={styles.dependentCard}>
                    {patient.photo_url ? (
                      <Image 
                        style={styles.dependentImage} 
                        source={{ 
                          uri: `${BASE_URL}${patient.photo_url.replace(/^\/api/, '')}`
                        }} 
                      />
                    ) : (
                      <Image 
                        style={styles.dependentImage} 
                        source={require('../../assets/images/profile.png')} 
                      />
                    )}
                    
                    <View style={styles.dependentInfo}>
                      <Text style={styles.dependentName}>{patient.full_name}</Text>
                      
                      <View style={styles.dependentDetails}>
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabelSmall}>{t('mec_number')}:</Text>
                          <Text style={styles.detailValueSmall}>{patient.mec_no}</Text>
                        </View>
                        
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabelSmall}>{t('date_of_birth')}:</Text>
                          <Text style={styles.detailValueSmall}>{formatDate(patient.date_of_birth)}</Text>
                        </View>
                        
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabelSmall}>{t('blood_group')}:</Text>
                          <Text style={[styles.detailValueSmall, styles.bloodGroup]}>
                            {patient.blood_group}
                          </Text>
                        </View>
                        
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabelSmall}>{t('gender')}:</Text>
                          <Text style={styles.detailValueSmall}>
                            {patient.gender === 'male' ? t('male') : t('female')}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.noDependents}>
                <Icon name="people-outline" size={40} color="#ccc" />
                <Text style={styles.noDependentsText}>{t('no_dependents')}</Text>
              </View>
            )}
          </View>
        )}

        {/* Add bottom padding for better scrolling experience */}
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Email Edit Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={emailModalVisible}
        onRequestClose={() => setEmailModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('edit_email_address')}</Text>
              <TouchableOpacity onPress={() => setEmailModalVisible(false)}>
                <Icon name="close" size={24} color="#0d131c" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.modalInput}
              value={newEmail}
              onChangeText={setNewEmail}
              placeholder={t('enter_new_email')}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={() => setEmailModalVisible(false)}
              >
                <Text style={styles.modalCancelButtonText}>{t('cancel')}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.modalSaveButton]}
                onPress={handleEmailUpdate}
                disabled={updatingEmail}
              >
                {updatingEmail ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text style={styles.modalSaveButtonText}>{t('save')}</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Action Buttons */}
      {editing && (
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.saveButton]}
            onPress={handleSave}
          >
            <Text style={styles.saveButtonText}>{t('save_changes')}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.cancelButton]}
            onPress={() => setEditing(false)}
          >
            <Text style={styles.cancelButtonText}>{t('cancel')}</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: '#0d131c',
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f8fafc',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    marginTop:'8%'
  },
  headerTitle: {
    color: '#0d131c',
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 24,
    letterSpacing: -0.015,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    backgroundColor: '#f8fafc',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    // Important: Allow dropdown to overflow
    overflow: 'visible',
    zIndex: 10,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  profileName: {
    color: '#0d131c',
    fontSize: 22,
    fontWeight: 'bold',
    lineHeight: 28,
    letterSpacing: -0.015,
    marginBottom: 4,
    textAlign: 'center',
  },
  profileEc: {
    color: '#496a9c',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12,
    textAlign: 'center',
  },
  languageSelectorWrapper: {
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
    // Important: Allow dropdown to overflow
    overflow: 'visible',
    zIndex: 20,
  },
  languageSelector: {
    width: 200,
    // Important: Allow dropdown to overflow
    overflow: 'visible',
  },
  languageDropdown: {
    // This ensures dropdown appears above other content
    position: 'absolute',
    top: 40,
    zIndex: 999,
    elevation: 999,
  },
  detailsSection: {
    backgroundColor: '#ffffff',
    marginTop: 12,
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionTitle: {
    color: '#0d131c',
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 24,
    letterSpacing: -0.015,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#f8fafc',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  detailItem: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  editIconButton: {
    padding: 4,
  },
  detailLabel: {
    color: '#64748b',
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailValue: {
    color: '#0f172a',
    fontSize: 15,
    lineHeight: 22,
  },
  input: {
    color: '#0f172a',
    fontSize: 15,
    lineHeight: 22,
    borderBottomWidth: 1,
    borderBottomColor: '#cbd5e1',
    paddingVertical: 4,
  },
  abhaContainer: {
    marginTop: 20,
    marginHorizontal: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#eef2ff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#c7d2fe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  abhaText: {
    textAlign: 'center',
    color: '#1e40af',
    fontSize: 14,
    lineHeight: 20,
  },
  abhaLink: {
    color: '#2563eb',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  dependentsSection: {
    marginTop: 20,
    marginBottom: 8,
  },
  dependentsContainer: {
    paddingHorizontal: 16,
  },
  dependentCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  dependentImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  dependentInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  dependentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0d131c',
    marginBottom: 8,
  },
  dependentDetails: {
    gap: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  detailLabelSmall: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
    width: 85,
  },
  detailValueSmall: {
    fontSize: 12,
    color: '#0f172a',
    flex: 1,
  },
  bloodGroup: {
    fontWeight: 'bold',
    color: '#ef4444',
  },
  noDependents: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginHorizontal: 16,
  },
  noDependentsText: {
    marginTop: 12,
    color: '#94a3b8',
    fontSize: 14,
    textAlign: 'center',
  },
  bottomPadding: {
    height: 30,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0d131c',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    color: '#0d131c',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalCancelButton: {
    backgroundColor: '#f1f5f9',
  },
  modalCancelButtonText: {
    color: '#475569',
    fontSize: 16,
    fontWeight: '500',
  },
  modalSaveButton: {
    backgroundColor: '#2563eb',
  },
  modalSaveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  actionButton: {
    flex: 1,
    borderRadius: 8,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  saveButton: {
    backgroundColor: '#2563eb',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#f1f5f9',
  },
  cancelButtonText: {
    color: '#475569',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ProfileScreen;