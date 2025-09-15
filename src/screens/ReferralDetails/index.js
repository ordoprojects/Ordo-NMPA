import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ImageBackground, Modal, ActivityIndicator, Alert, TextInput, Button, Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '../../constants/Colors';
import moment from 'moment';
import { BASE_URL } from '../../navigation/Config';
import { WebView } from 'react-native-webview';
import ImageViewer from 'react-native-image-zoom-viewer';
import { useTranslation } from 'react-i18next';
import { useRole } from '../../Context/RoleContext';
import { getToken } from '../../navigation/auth';
import Pdf from 'react-native-pdf';
import { SafeAreaView } from 'react-native-safe-area-context';

const ReferralDetails = ({ navigation, route }) => {
  const { t } = useTranslation();
  const { referral } = route.params;
  const [isPdf, setIsPdf] = useState(false);
  const [isImageViewVisible, setIsImageViewVisible] = useState(false);
  const [fileUrl, setFileUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const { role } = useRole();
  const [user, setUser] = useState(null);
  const [isPdfFullScreen, setIsPdfFullScreen] = useState(false);

  // Password state for PDF
  const [password, setPassword] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [pdfError, setPdfError] = useState(null);

  useEffect(() => {
    fetchUser();
    // Check if file is PDF and set up password input if needed
    if (referral.file_url && referral.file_url.toLowerCase().endsWith('.pdf')) {
      setIsPdf(true);
      setShowPasswordInput(true);
    }
  }, []);

  const fetchUser = async () => {
    try {
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
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const handlePdfError = (error) => {
    console.log('PDF Error:', error);
    if (error.message.includes('Password') || error.message.includes('password')) {
      setPdfError('Incorrect password. Please try again.');
      setShowPasswordInput(true);
    } else {
      setPdfError('Failed to load PDF. Please try again.');
    }
  };

  const submitPassword = () => {
    setPassword(inputPassword);
    setShowPasswordInput(false);
    setPdfError(null);
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'pending':
        return t('referral_details.status_pending');
      case 'approved':
        return t('referral_details.status_approved');
      case 'rejected':
        return t('referral_details.status_rejected');
      default:
        return status;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending':
        return '#FFA500';
      case 'approved':
        return Colors.darkBlue;
      case 'rejected':
        return '#FF3B30';
      default:
        return '#666';
    }
  };

  const getStatusBadgeStyle = (status) => {
    return {
      backgroundColor: status === 'approved' ? 'rgba(25, 118, 210, 0.1)' : 
                       status === 'pending' ? 'rgba(255, 165, 0, 0.1)' : 'rgba(255, 59, 48, 0.1)',
      borderColor: getStatusColor(status),
    };
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={Colors.darkBlue} />
      </View>
    );
  }



  return (
    <View style={styles.container}>
      {/* Header with status badge */}
    <SafeAreaView edges={['top']} style={styles.header}>
  <TouchableOpacity onPress={() => navigation.goBack()}>
    <Ionicons name="arrow-back" size={24} color="#0d141c" />
  </TouchableOpacity>
  <View style={styles.headerTitleContainer}>
    <Text style={styles.headerTitle}>{t('referral_details.title')}</Text>
  </View>
  <View style={{ width: 24 }} />
</SafeAreaView>


      <ScrollView contentContainerStyle={styles.content}>
        {/* Patient Information */}
        {/* {role==='user' && ( */}
          <>
            <Text style={styles.sectionTitle}>{t('referral_details.patient_info')}</Text>
            <View style={styles.patientInfoContainer}>
              {user?.photo_url ? (
                <ImageBackground
                  source={{ 
                    uri: user?.photo_url 
                      ? `${BASE_URL}${user?.photo_url?.replace(/^\/api/, '')}`
                      : 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6iCqF0CKSARpJEMpI54q4W7czcfALHbNpBWTrRDz-Vwtoozz8Wn6wta1rIBmfy6wAM_5G52PkYydwL3T52x8IXfD8V_noYfr5Eamzd8nfGhRX5Z--UM_QMVjPmtivJjWHyCoZVDWklaAvR17aKdLSAghbeKHUoCyQ0sbEbKXVWd2VJj0aSvoZ_HU0dx-u7H0QKc8FhHiA4lgTgYZRbxSUpf1VudZvjIhTPtGOg7-Gangk-55GxD_mOulCKItluIvJrnPhcAXCDHoW' 
                  }} 
                  style={styles.patientImage}
                  imageStyle={{ borderRadius: 28 }}
                />
              ) : (
                <View style={[styles.patientImage, styles.patientImagePlaceholder]}>
                  <Ionicons name="person" size={24} color="#666" />
                </View>
              )}
              <View style={styles.patientTextContainer}>
                <Text style={styles.patientName}>{ referral?.patient_name || t('N/A')}</Text>
                <Text style={styles.patientEmail}>{ referral.patient_email || t('N/A') }</Text>
                <Text style={styles.patientPhone}>{referral.patient_phone || t('N/A') }</Text>
              </View>
            </View>
          </>
        {/* )} */}

        {/* Referral Details */}
        <Text style={styles.sectionTitle}>{t('referral_details.appointment_info')}</Text>
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{t('referral_details.referral_id')}</Text>
            <Text style={styles.detailValue}>{referral.id}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{t('referral_details.hospital')}</Text>
            <Text style={styles.detailValue}>
              {referral.hospital_name || t('referral_details.not_available')}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{t('referral_details.appointment_time')}</Text>
            <Text style={styles.detailValue}>
              {referral.appointment_time ? moment(referral.appointment_time).format("MMMM D, YYYY h:mm A") : t('referral_details.not_available')}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{t('referral_details.consultation_reason')}</Text>
            <Text style={styles.detailValue}>
              {referral.consultation_reason || t('referral_details.not_available')}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{t('referral_details.created_at')}</Text>
            <Text style={styles.detailValue}>
              {referral.created_at ? moment(referral.created_at).format("MMMM D, YYYY h:mm A") : t('referral_details.not_available')}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{t('referral_details.updated_at')}</Text>
            <Text style={styles.detailValue}>
              {referral.updated_at ? moment(referral.updated_at).format("MMMM D, YYYY h:mm A") : t('referral_details.not_available')}
            </Text>
          </View>
        </View>

        {/* Doctor Approval Status */}
        <Text style={styles.sectionTitle}>{t('referral_details.approval_status')}</Text>
        <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{t('duty_doctor')}</Text>
            <Text style={styles.detailValue}>
              {`${referral?.duty_doctor_first_name} ${referral?.duty_doctor_last_name}`|| t('referral_details.not_available')}
            </Text>
          </View>
              <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{t('doctor_ec_no')}</Text>
            <Text style={[styles.detailValue, { 
              color: 'black',
              // fontWeight: '500'
            }]}>
              <Text>{referral.duty_doctor_ecno ? referral.duty_doctor_ecno : t('N/A')}</Text>
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{t('referral_details.doctor_approval')}</Text>
            <Text style={[styles.detailValue, { 
              color: referral.doctor_approval ? Colors.darkBlue : '#FFA500',
              fontWeight: '500'
            }]}>
              {referral.doctor_approval ? t('referral_details.approved') : t('referral_details.pending')}
            </Text>
          </View>
        </View>

        {/* Referral File (PDF with password protection) */}
        {referral.file_url && isPdf && (
          <>
            <Text style={styles.sectionTitle}>{t('referral_details.referral_document')}</Text>
          <View style={styles.pdfContainer}>
  {showPasswordInput && (
    <View style={styles.passwordContainer}>
      <Text style={styles.passwordTitle}>{t('referral_details.pdf_password_protected')}</Text>
      <TextInput
        style={styles.input}
         placeholder={t('referral_details.enter_pdf_password')}
        value={inputPassword}
        onChangeText={setInputPassword}
        secureTextEntry
                autoCapitalize="none"                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
      />
      {pdfError && <Text style={styles.errorText}>{pdfError}</Text>}
      <TouchableOpacity 
        style={{
          backgroundColor: Colors.darkBlue,
          paddingVertical: 12,
          paddingHorizontal: 20,
          borderRadius: 8,
          alignItems: 'center',
          marginTop: 10
        }}
        onPress={submitPassword}
      >
       <Text style={{ color: 'white', fontWeight: '600' }}>{t('common.submit')}</Text>
      </TouchableOpacity>
    </View>
  )}

  {/* Show fullscreen open button only after password is correct */}
{/* PDF Preview with overlay button */}
{!showPasswordInput && !pdfError && (
  <View style={{ height: 500, position: 'relative' }}>
    {/* Background PDF with reduced opacity */}
<Pdf
  trustAllCerts={false} // Add this line
  source={{
    uri: `${BASE_URL}${referral.file_url.replace(/^\/api/, '')}`,
    cache: true,
  }}
  password={password}
  onError={handlePdfError}
  style={{ flex: 1, width: '100%', height: '100%', opacity: 0.7 }}
/>

    {/* Overlay Button */}
    <View style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <TouchableOpacity 
        style={{
          backgroundColor: Colors.darkBlue,
          paddingVertical: 12,
          paddingHorizontal: 24,
          borderRadius: 8,
        }}
        onPress={() => setIsPdfFullScreen(true)}
      >
     <Text style={{ color: 'white', fontWeight: '600' }}>{t('referral_details.view_pdf_fullscreen')}</Text>
      </TouchableOpacity>
    </View>
  </View>
)}

</View>

          </>
        )}

        {/* For non-PDF files */}
        {referral.file_url && !isPdf && (
          <>
            <Text style={styles.sectionTitle}>{t('referral_details.referral_document')}</Text>
            <View style={styles.pdfContainer}>
              <WebView
                source={{ uri: `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(`${BASE_URL}${referral.file_url.replace(/^\/api/, '')}`)}` }}
                style={styles.pdfView}
                scalesPageToFit={true}
              />
            </View>
          </>
        )}
      </ScrollView>
      {/* Fullscreen PDF Viewer */}
<Modal visible={isPdfFullScreen} transparent={false} animationType="slide">
  <View style={{ flex: 1, backgroundColor: 'black' }}>
    <TouchableOpacity 
      style={styles.closeButton} 
      onPress={() => setIsPdfFullScreen(false)}
    >
      <Ionicons name="close" size={24} color="white" />
    </TouchableOpacity>

    {!showPasswordInput && referral?.file_url && (
      <Pdf
        source={{ uri: `${BASE_URL}${referral?.file_url.replace(/^\/api/, '')}`, cache: true }}
        password={password}
        onError={handlePdfError}
        style={{ flex: 1, width: '100%', height: '100%' }}
      />
    )}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingBottom: 12,
    backgroundColor: '#f8fafc',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0d141c',
    marginBottom: 4,
  },
  content: {
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0d141c',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  patientInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    marginHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  patientImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  patientImagePlaceholder: {
    backgroundColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  patientTextContainer: {
    flex: 1,
  },
  patientName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0d141c',
    marginBottom: 4,
  },
  patientEmail: {
    fontSize: 14,
    color: '#49739c',
    marginBottom: 2,
  },
  patientPhone: {
    fontSize: 14,
    color: '#49739c',
  },
  detailsContainer: {
    paddingHorizontal: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#cedbe8',
    paddingVertical: 12,
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
    textAlign: 'right',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  pdfContainer: {
    flex: 1,
    height: 500,
    width: '100%',
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  pdfView: {
    flex: 1,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: 500,
  },
  passwordContainer: {
    padding: 20,
    backgroundColor: 'white',
    zIndex: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  passwordTitle: {
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: '500',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 15,
    padding: 5,
  },
});

export default ReferralDetails;