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
  Linking
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
    // Open the ABHA registration website
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
      
      if (response.status === 403) {
        setShowDependents(false);
        return;
      }
      
      if (!response.ok) {
        throw new Error(t('referral_request.patients_fetch_error'));
      }

      const data = await response.json();
      console.log("data", data);
      
      if (data.dependents && Array.isArray(data.dependents)) {
        setPatients(data.dependents);
        setShowDependents(true);
      } else {
        throw new Error(t('referral_request.invalid_patients_data'));
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

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="#0d131c" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('profile')}</Text>
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
      </View>


      <ScrollView style={styles.scrollView}>
        {/* Profile Picture and Name */}
        <View style={styles.profileHeader}>
          <Image 
            style={styles.profileImage} 
            source={{ 
              uri: user?.photo_url 
                ? `${BASE_URL}${user.photo_url.replace(/^\/api/, '')}`
                : 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6iCqF0CKSARpJEMpI54q4W7czcfALHbNpBWTrRDz-Vwtoozz8Wn6wta1rIBmfy6wAM_5G52PkYydwL3T52x8IXfD8V_noYfr5Eamzd8nfGhRX5Z--UM_QMVjPmtivJjWHyCoZVDWklaAvR17aKdLSAghbeKHUoCyQ0sbEbKXVWd2VJj0aSvoZ_HU0dx-u7H0QKc8FhHiA4lgTgYZRbxSUpf1VudZvjIhTPtGOg7-Gangk-55GxD_mOulCKItluIvJrnPhcAXCDHoW' 
            }} 
            resizeMethod='contain'
          />
          <Text style={styles.profileName}>{user.first_name} {user.last_name}</Text>
          <Text style={styles.profileEc}>
            {t('ec_number', { ecno: user.ecno })}
          </Text>
          <View style={styles.languageSelectorContainer}>
            <LanguageSelector 
              style={styles.languageSelector} 
              dropdownStyle={styles.languageDropdown}
            />
          </View>
          
          <View style={{flexDirection:'column',justifyContent:'flex-start',flex:1, alignSelf:'flex-start'}}>
            {/* Profile Details */}
            <Text style={styles.sectionTitle} numberOfLines={1}>{t('profile_details')}</Text>
            
            {/* Email */}
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>{t('email_address')}</Text>
              {editing ? (
                <TextInput
                  style={styles.input}
                  value={user.email}
                  onChangeText={(text) => setProfile({...profile, email: text})}
                />
              ) : (
                <Text style={styles.detailValue}>{user.email}</Text>
              )}
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
            <View style={[styles.detailItem, styles.addressItem]}>
              <View>
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
          </View>

{/* ABHA Registration Link - Centered in the middle */}
<View style={styles.abhaContainer}>
  <Text style={styles.abhaText}>
    {t('dont_have_abha')}{'\n'}
    <Text style={styles.abhaLink} onPress={handleABHARegistration}>
      {t('click_here_to_register')}
    </Text>
  </Text>
</View>



        </View>

        {showDependents && (
          <>
            <Text style={styles.sectionTitle}>{t('dependents')}</Text>
            
            {patients.length > 0 ? (
              <View style={styles.dependentsContainer}>
                {patients.map((patient, index) => (
                  <View key={patient.id} style={[
                    styles.dependentCard,
                    index === patients.length - 1 && styles.lastDependentCard
                  ]}>
                    <Image 
                      style={styles.dependentImage} 
                      source={{ 
                        uri: patient.photo_url 
                          ? `${BASE_URL}${patient.photo_url.replace(/^\/api/, '')}`
                          : 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6iCqF0CKSARpJEMpI54q4W7czcfALHbNpBWTrRDz-Vwtoozz8Wn6wta1rIBmfy6wAM_5G52PkYydwL3T52x8IXfD8V_noYfr5Eamzd8nfGhRX5Z--UM_QMVjPmtivJjWHyCoZVDWklaAvR17aKdLSAghbeKHUoCyQ0sbEbKXVWd2VJj0aSvoZ_HU0dx-u7H0QKc8FhHiA4lgTgYZRbxSUpf1VudZvjIhTPtGOg7-Gangk-55GxD_mOulCKItluIvJrnPhcAXCDHoW' 
                      }} 
                    />
                    
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
          </>
        )}
      </ScrollView>

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
  scrollView: {
    flex: 1,
    paddingBottom: 20,
    marginTop: 20
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
    color: '#0d131c',
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 24,
    letterSpacing: -0.015,
    textAlign: 'center',
    flex: 1,
    marginLeft: '0%'
  },
  languageSelectorContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
    zIndex: 1000,
  },
  languageSelector: {
    width: 200,
  },
  languageDropdown: {
    marginTop: Platform.OS === 'ios' ? 40 : 0,
  },
  profileHeader: {
    alignItems: 'center',
    padding: 16,
    marginTop: Platform.OS === 'ios' ? 0 : 0,
  },
  profileImage: {
    width: 128,
    height: 128,
    borderRadius: 64,
    marginBottom: 16,
    borderWidth: 0.5,
    borderColor: 'gray'
  },
  profileName: {
    color: '#0d131c',
    fontSize: 22,
    fontWeight: 'bold',
    lineHeight: 24,
    letterSpacing: -0.015,
    marginBottom: 4,
  },
  profileEc: {
    color: '#496a9c',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 8,
  },
  sectionTitle: {
    color: '#0d131c',
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 24,
    letterSpacing: -0.015,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    flexShrink: 1,
  },
  detailItem: {
    minHeight: 72,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
  },
  addressItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    color: '#0d131c',
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
  },
  detailValue: {
    color: '#496a9c',
    fontSize: 14,
    lineHeight: 20,
  },
  input: {
    color: '#496a9c',
    fontSize: 14,
    lineHeight: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#d0dee7',
    paddingVertical: 4,
  },
  // ABHA Registration Styles
abhaContainer: {
  marginTop: 20,
  paddingHorizontal: 16,
  paddingVertical: 16,
  backgroundColor: '#e8f4fd',
  borderRadius: 8,
  borderWidth: 1,
  borderColor: '#b8d9f3',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',      // 🔑 this makes the box full width
},


abhaText: {
  textAlign: 'center',
  color: '#2c5282',
  fontSize: 16,
  lineHeight: 24,
},
abhaLink: {
  color: '#3182ce',
  fontWeight: '600',
  textDecorationLine: 'underline',
  fontSize: 16,
  textAlign: 'center',    // Ensure centered link
},

  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f8fafc',
  },
  actionButton: {
    flex: 1,
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  saveButton: {
    backgroundColor: '#2175f2',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 0.015,
  },
  cancelButton: {
    backgroundColor: '#e7ecf4',
  },
  cancelButtonText: {
    color: '#0d131c',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 0.015,
  },
  dependentsContainer: {
    paddingHorizontal: 12,
    marginBottom: 20,
  },
  dependentCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  lastDependentCard: {
    marginBottom: 0,
  },
  dependentImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  dependentInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  dependentName: {
    fontSize: 18,
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
  },
  detailLabelSmall: {
    fontSize: 12,
    color: '#637988',
    fontWeight: '500',
    width: 90,
  },
  detailValueSmall: {
    fontSize: 12,
    color: '#0d131c',
    flex: 1,
  },
  bloodGroup: {
    fontWeight: 'bold',
    color: '#e53935',
  },
  noDependents: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: 'white',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 20,
  },
  noDependentsText: {
    marginTop: 12,
    color: '#999',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default ProfileScreen;