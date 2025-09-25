import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, ImageBackground, Image,Alert ,Dimensions, Modal, Pressable ,ActivityIndicator} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Fontisto from 'react-native-vector-icons/Fontisto'
import Colors from '../../constants/Colors';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useRole } from '../../Context/RoleContext';
import LinearGradient from 'react-native-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { getToken,clearAuthData } from '../../navigation/auth';
import { BASE_URL } from '../../navigation/Config';
import Toast from 'react-native-simple-toast';
import { setupNotifications, setupNotificationHandlers ,registerFCMToken} from '../../services/notificationService';
import { useTranslation } from 'react-i18next'; 
import QRCode from 'react-native-qrcode-styled';

const { width } = Dimensions.get('window');
const isSmallDevice = width < 375; 

const HomeScreen = () => {
  const navigation = useNavigation();
  const { role } = useRole();
  const [user, setUser] = useState([]);
  const [referrals, setReferrals] = useState([]);
  const [medicineRequests, setMedicineRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const [qrData, setQrData] = useState('');
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [qrLoading, setQrLoading] = useState(false); // Add this state for QR loading
  const [pageLoading, setPageLoading] = useState(true);

    const translateStatus = (status) => {
    const statusTranslations = {
      'pending': t('pending'),
      'approved': t('approved'),
      'rejected': t('rejected'),
      'assigned': t('assigned'),
      'dispatched': t('dispatched'),
      'completed': t('completed'),
      'assigned_to_doctor':t('medicine_request_list.status_assigned')

    };
    
    return statusTranslations[status] || status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Function to translate status with special handling for "assigned to doctor"
  const translateStatusWithContext = (status, context = '') => {
    if (status === 'assigned' && context === 'doctor') {
      return t('status_assigned');
    }
    
    return translateStatus(status);
  };

// Replace your useEffect for QR data generation with this:
useEffect(() => {
  if (user && user.first_name) {
    const formattedData =
      `${t('card.title1')}\n` +
      `${t('card.title2')}\n` +
      `------------------------------------------------------\n` +
      `${t('card.header')}\n` +
      `------------------------------------------------------\n` +
      `◉ ${t('card.name')}: ${user.first_name} ${user.last_name}\n` +
      `◉ ${t('card.ecno')}: ${user.ecno}\n` +
      `◉ ${t('card.class')}: ${user.class}\n` +
      `◉ ${t('card.mobile')}: ${user.phone_number}\n` +
      `◉ ${t('card.eligibility')}: ${t('card.eligibility_yes')}\n` +
      `◉ ${t('card.blood_group')}: ${user.blood_group}`;

    setQrData(formattedData);
  }
}, [user, t]);

  console.log("user",user)
// In HomeScreen.js - REMOVE this entire useEffect
useEffect(() => {
  // Register FCM token when component mounts
  registerFCMToken();
  
  // Setup notification handlers  // <-- THIS IS THE DUPLICATE
  const cleanupHandlers = setupNotificationHandlers(navigation);
  
  return () => {
    cleanupHandlers();
  };
}, [navigation]);

   // Update your fetchUser function to handle loading
  const fetchUser = async () => {
    try {
      setPageLoading(true); // Start loading
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
      setPageLoading(false); // Stop loading
    }
  };

  // Update your useFocusEffect to handle initial loading


  // Add this function to handle QR code modal opening
  const handleQrCodePress = () => {
    setQrModalVisible(true);
    setQrLoading(true); // Start QR loading
    
    // Simulate QR code generation delay (remove this if not needed)
    setTimeout(() => {
      setQrLoading(false);
    }, 500);
  };

  
  const fetchReferrals = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const response = await fetch(`${BASE_URL}/appointments/list/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      console.log("dataaaaa",data)
      if (response.ok) {
           const pendingAppointments = data.appointments.filter(
          appointment => appointment
        );
        setReferrals(pendingAppointments);
      } else {
        console.error('Failed to fetch referrals:', data);
      }
    } catch (error) {
      console.error('Error fetching referrals:', error);
    } finally {
      setLoading(false);
    }
  };




  const fetchMedicineRequests = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const response = await fetch(`${BASE_URL}/medicine-requests/list/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (response.ok) {
        setMedicineRequests(data.medicine_requests);
      } else {
        console.error('Failed to fetch medicine requests:', data);
      }
    } catch (error) {
      console.error('Error fetching medicine requests:', error);
    } finally {
      setLoading(false);
    }
  };

console.log("medice",JSON.stringify(medicineRequests,null,2))
console.log("referral",JSON.stringify(referrals,null,2))


  useFocusEffect(
    React.useCallback(() => {
      setPageLoading(true); // Show loading when screen comes into focus
      fetchUser();
      if (role === 'user') {
        fetchReferrals();
        fetchMedicineRequests();
      } else if (role === 'doctor') {
        fetchReferrals();
        fetchMedicineRequests();
      }
      return () => {};
    }, [role])
  );


  const handleReferralPress = () => {
    if (role === "user") {
      navigation.navigate('AppStack', { 
        screen: 'ReferralRequest' 
      });
    } else {
      navigation.navigate('AppStack', { 
        screen: 'ReferralList' 
      });
    }
  };

  const handleReviewPress = () => {
    if (role === "user") {
      navigation.navigate('AppStack', { 
        screen: 'MedicineRequest' 
      });
    } else {
      navigation.navigate('AppStack', { 
        screen: 'MedicineRequestList' 
      });
    }
  };

  const handleViewReferral = (referral) => {
    navigation.navigate('AppStack', {
      screen: 'ReferralReview',
      params: { appointment: referral  }
    });
  };

  const handleViewMedicineRequest = (request) => {
    navigation.navigate('AppStack', {
      screen: 'MedicineReview',
      params: { request }
    });
  };

 const handleLogout = async () => {
  Alert.alert(
    t('logout'),
    t('logout_confirmation'),
    [
      {
        text: t('cancel'),
        style: 'cancel',
      },
      {
        text: t('logout'),
        onPress: async () => {
          try {
            const token = await getToken();
            let logoutSuccessful = false;

            // Try with Authorization header (works for most setups)
            try {
              const response = await fetch(`${BASE_URL}/auth/logout`, {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
              });
              
              if (response.ok) {
                logoutSuccessful = true;
                console.log('Logout successful with Authorization header');
              }
            } catch (authError) {
              console.log('Authorization header method failed:', authError);
            }

            // If Authorization header failed, try with Cookie (for Android/legacy setups)
            if (!logoutSuccessful) {
              try {
                const response = await fetch(`${BASE_URL}/auth/logout`, {
                  method: 'POST',
                  headers: {
                    'Cookie': `access_token=${token}`,
                    'Content-Type': 'application/json',
                  },
                  credentials: 'include', // Important for cookies
                });
                
                if (response.ok) {
                  logoutSuccessful = true;
                  console.log('Logout successful with Cookie header');
                }
              } catch (cookieError) {
                console.log('Cookie header method failed:', cookieError);
              }
            }

            // If both methods failed, try GET requests
            if (!logoutSuccessful) {
              try {
                // Try GET with Authorization
                const response = await fetch(`${BASE_URL}/auth/logout`, {
                  method: 'GET',
                  headers: {
                    'Authorization': `Bearer ${token}`,
                  },
                });
                
                if (response.ok) {
                  logoutSuccessful = true;
                  console.log('Logout successful with GET + Authorization');
                }
              } catch (getAuthError) {
                console.log('GET with Authorization failed:', getAuthError);
              }

              if (!logoutSuccessful) {
                try {
                  // Try GET with Cookie
                  const response = await fetch(`${BASE_URL}/auth/logout`, {
                    method: 'GET',
                    headers: {
                      'Cookie': `access_token=${token}`,
                    },
                    credentials: 'include',
                  });
                  
                  if (response.ok) {
                    logoutSuccessful = true;
                    console.log('Logout successful with GET + Cookie');
                  }
                } catch (getCookieError) {
                  console.log('GET with Cookie failed:', getCookieError);
                }
              }
            }

            // Always clear local data regardless of API response
            await clearAuthData();
            Toast.show(t('logged_out_success'), Toast.LONG);
            navigation.navigate('Login');

          } catch (error) {
            console.error('Logout error:', error);
            // Still clear data and navigate even if there's an error
            await clearAuthData();
            Toast.show(t('logged_out_success'), Toast.LONG);
            navigation.navigate('Login');
          }
        },
      },
    ],
    { cancelable: false }
  );
};



  // Get recent 3 referrals sorted by appointment_time
// Get recent 2 referrals sorted by created_at
const getRecentReferrals = () => {
  return [...referrals]
    .filter(r => r.status !== 'cancelled')   // 🚫 remove cancelled
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 2);
};

  // Get recent 3 medicine requests sorted by requested_at
// Get recent 2 medicine requests sorted by requested_at
const getRecentMedicineRequests = () => {
  return [...medicineRequests]
    .sort((a, b) => new Date(b.requested_at) - new Date(a.requested_at))
    .slice(0, 2);
};

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Format time for display
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
          {pageLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={Colors.darkBlue} />
          <Text style={styles.loadingText}>Loading medical card...</Text>
        </View>
      )}
      <View style={styles.header}>
        <Image style={styles.subimage} source={require('../../assets/images/LogoNmpa.png')} />
        <Text style={styles.appName}>NMPA</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <MaterialIcons name='logout' size={25} color={Colors.black} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Greeting */}
        <Text style={styles.greeting}>
          {t('hello', { name: user?.first_name })}
        </Text>

        {/* Medical Card - UPDATED LAYOUT */}
        <View style={styles.cardContainer}>
          {/* Yellow Header */}
          <View style={styles.cardYellowHeader}>
            <View style={styles.cardHeaderContent}>
              <Image
                style={styles.govLogo}
                source={require('../../assets/images/gov.png')}
                resizeMode='contain'
              />
              <View style={styles.cardHeaderText}>
                <Text style={[styles.cardTitle, isSmallDevice && styles.smallCardTitle]}>
                  {t('new_mangalore_port_authority')}
                </Text>
                <Text style={[styles.cardSubtitle, isSmallDevice && styles.smallCardSubtitle]}>
                  {t('govt_of_india')}
                </Text>
              </View>
              <Image
                style={[styles.nmpaLogo, isSmallDevice && styles.smallNmpaLogo]}
                source={require('../../assets/images/Nmpa.png')}
              />
            </View>
          </View>

          {/* Blue Title */}
          <View style={styles.cardBlueTitle}>
            <Text style={[styles.cardBlueTitleText, isSmallDevice && styles.smallCardBlueTitleText]}>
              {t('employees_medical_card')}
            </Text>
          </View>

          {/* Card Content - UPDATED FOR SMALL DEVICES */}
          <View style={[styles.cardContent, isSmallDevice && styles.smallCardContent]}>
            <View style={[styles.cardMainContent, isSmallDevice && styles.smallCardMainContent]}>
              <Text style={[styles.cardName, isSmallDevice && styles.smallCardName]}>
                {user?.first_name} {user?.last_name}
              </Text>

              <View style={styles.cardDetails}>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, isSmallDevice && styles.smallDetailLabel]}>
                    {t('ec_no')}
                  </Text>
                  <Text style={[styles.detailValue, isSmallDevice && styles.smallDetailValue]}>
                    : {user?.ecno}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, isSmallDevice && styles.smallDetailLabel]}>
                    {t('class')}
                  </Text>
                  <Text style={[styles.detailValue, isSmallDevice && styles.smallDetailValue]}>
                    : {user?.class}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, isSmallDevice && styles.smallDetailLabel]}>
                    {t('mobile_no')}
                  </Text>
                  <Text style={[styles.detailValue, isSmallDevice && styles.smallDetailValue]}>
                    : {user?.phone_number}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, isSmallDevice && styles.smallDetailLabel]}>
                    {t('medical_eligibility')}
                  </Text>
                  <Text style={[styles.detailValue, isSmallDevice && styles.smallDetailValue]}>
                    : {t('yes')}
                  </Text>
                </View>
              </View>
            </View>

            <View style={[styles.cardSideContent, isSmallDevice && styles.smallCardSideContent]}>
              <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
              <Image
                style={[styles.profileImage, isSmallDevice && styles.smallProfileImage]}
                source={{
                  uri: user?.photo_url
                    ? `${BASE_URL}${user.photo_url.replace(/^\/api/, '')}`
                    : 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6iCqF0CKSARpJEMpI54q4W7czcfALHbNpBWTrRDz-Vwtoozz8Wn6wta1rIBmfy6wAM_5G52PkYydwL3T52x8IXfD8V_noYfr5Eamzd8nfGhRX5Z--UM_QMVjPmtivJjWHyCoZVDWklaAvR17aKdLSAghbeKHUoCyQ0sbEbKXVWd2VJj0aSvoZ_HU0dx-u7H0QKc8FhHiA4lgTgYZRbxSUpf1VudZvjIhTPtGOg7-Gangk-55GxD_mOulCKItluIvJrnPhcAXCDHoW'
                }}
                resizeMode='contain'
              />
              <View style={[styles.bloodTypeContainer, isSmallDevice && styles.smallBloodTypeContainer]}>
                <Image
                  style={[styles.bloodIcon, isSmallDevice && styles.smallBloodIcon]}
                  source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCCGguCGfShWeboGLMlQaExSSbn8fY0Hl19KnZdnmb9IGWRkq4xD0ca9N-94ODBSl16zPHLv8gLr0j6kxpErEdHb7hNIEpNcTgxyfAeOGJKVTIWeXoBSwjZIAsAUHJe7XE4ji6kVufc41DtjLJ0kvBDMbaLbWh3UNvTlLJOyj8oVGgkjli9-3Vf7QHAI3MXT-CWRG0ELvJ6IhrybXCkCr3oEtMkDKzrE79pefrxxpZBln_0UETXJZAfAj2-DqepdDbvS6pHaTt5zQTY' }}
                />
                <Text style={[styles.bloodType, isSmallDevice && styles.smallBloodType]}>
                  {user?.blood_group}
                </Text>
              </View>
</View>
                 {/* Add Styled QR Code */}
 {qrData ? (
  <TouchableOpacity 
          style={styles.qrCodeContainer}
          onPress={handleQrCodePress}
        >
    <QRCode
      data={qrData}
      // style={styles.qrCode}
      size={60} 
      padding={1}
      pieceSize={2}
      color={Colors.darkBlue}
      backgroundColor="transparent"
      outerEyesOptions={{
        topLeft: {
          color: Colors.darkBlue,
        },
        topRight: {
          color: Colors.darkBlue,
        },
        bottomLeft: {
          color: Colors.darkBlue,
        },
         bottomRight: {
          color: Colors.darkBlue,
        },
      }}
      innerEyesOptions={{
        topLeft: {
          color: '#0a7eb8',
        },
        topRight: {
          color: '#0a7eb8',
        },
        bottomLeft: {
          color: '#0a7eb8',
        },
         bottomRight: {
          color: '#0a7eb8',
        },
      }}
      logo={{
        href: require('../../assets/images/Nmpa.png'),
        scale: 0.5,
        padding: 0,
      }}
    />
  </TouchableOpacity>
) : null}
          </View>
        </View>
            </View>

        {/* Action Buttons */}
        <Text style={styles.sectionTitle}>{t('quick_actions')}</Text>

        <View style={styles.fullCardContainer}>
          {/* Medicine Request Card */}
          <TouchableOpacity
            style={styles.fullCard}
            onPress={handleReviewPress}
          >
            <LinearGradient
              colors={['#05375a', '#085a8c']}
              style={styles.gradientBackground}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Fontisto name='pills' size={25} color={Colors.white} marginBottom={10} />
              {role === "user" ? (
                <>
                  <Text style={styles.cardTitle1}>{t('request_medicine')}</Text>
                  <Text style={styles.cardDescription}>{t('get_prescriptions_approved')}</Text>
                </>
              ) : (
                <>
                  <Text style={styles.cardTitle1}>{t('review_medicine')}</Text>
                  <Text style={styles.cardDescription}>{t('get_specialist_approved')}</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Referral Request Card */}
          <TouchableOpacity
            style={styles.fullCard}
            onPress={handleReferralPress}
          >
            <LinearGradient
              colors={['#05375a', '#0a7eb8']}
              style={styles.gradientBackground}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name='person-add' size={25} color={Colors.white} marginBottom={10} />
              {role === "user" ? (
                <>
                  <Text style={styles.cardTitle1}>{t('request_referral')}</Text>
                  <Text style={styles.cardDescription}>{t('get_specialist_approved')}</Text>
                </>
              ) : (
                <>
                  <Text style={styles.cardTitle1}>{t('review_referral')}</Text>
                  <Text style={styles.cardDescription}>{t('approve_specialist_requests')}</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>

   {role === "user" && (
  <>
    <Text style={styles.sectionTitle}>{t('active_requests')}</Text>

    {/* Show recent referrals (max 2) */}
    {getRecentReferrals().length > 0 ? (
      getRecentReferrals().map((referral) => (
        <View key={`referral-${referral.id}`} style={styles.requestCard}>
          <View style={styles.requestContent}>
            <Text style={styles.requestType}>{t('referral')}</Text>
            <Text style={[
              styles.requestStatus,
              referral.status === 'approved' && styles.approvedStatus,
              referral.status === 'rejected' && styles.rejectedStatus,
              referral.status === 'assigned' && styles.assignedStatus
            ]}>
              {translateStatus(referral.status)}
            </Text>
            <Text style={styles.requestDetail}>
              {t('appointment')}: {formatDate(referral.appointment_time)} at {formatTime(referral.appointment_time)}
            </Text>
            <Text style={styles.requestDetail}>
              {t('created_at')}: {formatDate(referral.created_at)}
            </Text>
          </View>
          <ImageBackground
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBBnhmf0zUAiq6Ow-bwhB2iYbgkFdaskkiB_-uCJ1hcAXNLkCY_STqidee2Z85sJPNWP1lx_hIIVuud3ciHgtiAomgpGzHMuA-Crh83ZCwhTWGd-s5WeS-aAoDdRVMSIh-5F60wCQLIhA7SL9zQdQa5iDeE1KAnuB5PFm2W-NlrswYUHZI4PvzZVLjmLxMtpDq2k0z6edqQrQsic5ImzZRqXYfHLXZt2mj_341kTewMb77aj9wVZxI85S9zNCdik8a_1dmx4Kfw_4o' }}
            style={styles.requestImage}
            imageStyle={styles.requestImageStyle}
          />
        </View>
      ))
    ) : (
      <Text style={styles.noRequestsText}>{t('no_referral_requests')}</Text>
    )}

    {/* Show recent medicine requests (max 2) */}
    {getRecentMedicineRequests().length > 0 ? (
      getRecentMedicineRequests().map((request) => (
        <View key={`medicine-${request.id}`} style={styles.requestCard}>
          <View style={styles.requestContent}>
            <Text style={styles.requestType}>{t('medicine')}</Text>
            <Text style={[
              styles.requestStatus,
              request.status === 'approved' && styles.approvedStatus,
              request.status === 'rejected' && styles.rejectedStatus,
              request.status === 'assigned_to_doctor' && styles.assignedStatus
            ]}>
              {translateStatus(request.status)}
            </Text>
            <Text style={styles.requestDetail}>
              {t('requested')}: {formatDate(request.requested_at)}
            </Text>
            {request.medicine_duration && (
              <Text style={styles.requestDetail}>
                {t('duration')}: {request.medicine_duration.months ?
                  `${request.medicine_duration.months} ${t('month')}(s)` :
                  `${request.medicine_duration.days} ${t('day')}(s)`}
              </Text>
            )}
          </View>
          <ImageBackground
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDtAs5x3xejc5W-Ce2QOFfKPx6mDUiPt_LR_UoNtHXCXjIELQZlvv1gva57m8ZufJRbxVwi7M0bFpHz3QOLcj-dMqDFdUO2_yCJrL7i5AKOPkag1MOAxjpx_CycT1EzbOiN0iH_ZDGVEr3RlGj_zG6K6czDU0K8r1s9TQ9WmoiZd8vEzx2MWAltursxY_IUoeE5bWzLGmz_GW1qkof1a58c9r7aL7EmXgdglSXjmIYxpIe8y5NkvsVt8guutcVBI2SbZDnUlOQ95NE' }}
            style={styles.requestImage}
            imageStyle={styles.requestImageStyle}
          />
        </View>
      ))
    ) : (
      <Text style={styles.noRequestsText}>{t('no_medicine_requests')}</Text>
    )}
  </>
)}

    {role === "doctor" && (
  <>
    <Text style={styles.sectionTitle}>{t('recent_referral_requests')}</Text>

    {getRecentReferrals().length > 0 ? (
      getRecentReferrals().map((referral) => (
        <View key={`doctor-referral-${referral.id}`} style={styles.requestItem}>
          <View style={styles.requestInfo}>
            <Text style={styles.patientName}>
              {referral.patient_name} {referral.patient_last_name}
            </Text>
            <Text style={styles.requestDetail}>
              {t('appointment')}: {formatDate(referral.appointment_time)} at {formatTime(referral.appointment_time)}
            </Text>
            <Text style={styles.requestDetail}>
              {t('created')}: {formatDate(referral.created_at)}
            </Text>
            <Text style={[
              styles.requestDetail,
              referral.status === 'approved' && {color: '#4CAF50'},
              referral.status === 'rejected' && {color: '#F44336'},
              referral.status === 'assigned' && {color: '#FFA500'}
            ]}>
              {t('status')}: {translateStatus(referral.status)}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.viewButton}
            onPress={() => handleViewReferral(referral)}
          >
            <Text style={styles.viewButtonText}>{t('view')}</Text>
          </TouchableOpacity>
        </View>
      ))
    ) : (
      <Text style={styles.noRequestsText}>{t('no_referral_requests')}</Text>
    )}

    {/* Optional: Add recent medicine requests for doctors too if needed */}
    <Text style={[styles.sectionTitle, {marginTop: 20}]}>{t('recent_medicine_requests')}</Text>
    
    {getRecentMedicineRequests().length > 0 ? (
      getRecentMedicineRequests().map((request) => (
        <View key={`doctor-medicine-${request.id}`} style={styles.requestItem}>
          <View style={styles.requestInfo}>
            <Text style={styles.patientName}>
              {request.user_name}
            </Text>
            <Text style={styles.requestDetail}>
              {t('requested')}: {formatDate(request.requested_at)}
            </Text>
            <Text style={[
              styles.requestDetail,
              request.status === 'approved' && {color: '#4CAF50'},
              request.status === 'rejected' && {color: '#F44336'},
              request.status === 'assigned_to_doctor' && {color: '#FFA500'}
            ]}>
              {t('status')}: {translateStatus(request.status)}
            </Text>
            {request.medicine_duration && (
              <Text style={styles.requestDetail}>
             {request.medicine_duration.months
  ? `${request.medicine_duration.months} ${t(request.medicine_duration.months > 1 ? 'month_plural' : 'month')}`
  : `${request.medicine_duration.days} ${t(request.medicine_duration.days > 1 ? 'day_plural' : 'day')}`}

              </Text>
            )}
          </View>
          <TouchableOpacity
            style={styles.viewButton}
            onPress={() => handleViewMedicineRequest(request)}
          >
            <Text style={styles.viewButtonText}>{t('view')}</Text>
          </TouchableOpacity>
        </View>
      ))
    ) : (
      <Text style={styles.noRequestsText}>{t('no_medicine_requests')}</Text>
    )}
  </>
)}
      </ScrollView>
          {/* QR Code Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={qrModalVisible}
        onRequestClose={() => setQrModalVisible(false)}
      >
        <View style={styles.modalCenteredView}>
          <View style={styles.modalView}>
           <Text style={styles.modalTitle}>{t('medical_card_qr_title')}</Text>

{qrLoading ? (
  <View style={styles.qrLoadingContainer}>
    <ActivityIndicator size="large" color={Colors.darkBlue} />
    <Text style={styles.qrLoadingText}>{t('qr_generating')}</Text>
  </View>
) : (
  qrData && (
    <QRCode
      data={qrData}
      size={200}
      padding={2}
      pieceSize={8}
      color={Colors.darkBlue}
      backgroundColor="white"
      outerEyesOptions={{
        topLeft: { color: Colors.darkBlue },
        topRight: { color: Colors.darkBlue },
        bottomLeft: { color: Colors.darkBlue },
        bottomRight: { color: Colors.darkBlue },
      }}
      innerEyesOptions={{
        topLeft: { color: '#0a7eb8' },
        topRight: { color: '#0a7eb8' },
        bottomLeft: { color: '#0a7eb8' },
        bottomRight: { color: '#0a7eb8' },
      }}
      logo={{
        href: require('../../assets/images/Nmpa.png'),
        scale: 0.5,
        padding: 2,
      }}
    />
  )
)}

<Text style={styles.modalSubtitle}>{t('qr_scan_subtitle')}</Text>

<Pressable
  style={[styles.modalButton, styles.modalButtonClose]}
  onPress={() => setQrModalVisible(false)}
>
  <Text style={styles.modalButtonText}>{t('close')}</Text>
</Pressable>

          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
    paddingBottom: 70, // Space for bottom tabs
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 5,
  },
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111518',
    textAlign: 'center',
    flex: 1,
    marginRight: 24,
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111518',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 15,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginBottom: 24,
    marginTop: 20,
  },
  actionButton: {
    flex: 1,
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 3,
    gap:8,
    flexDirection:'row'
  },
  primaryButton: {
    backgroundColor: Colors.darkBlue,
  },
  secondaryButton: {
    backgroundColor: '#f0f3f4',
    borderColor:'#a1aaadff',
    borderWidth:0.5
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButtonText: {
    color: Colors.darkBlue,
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111518',
    paddingHorizontal: 20,
    paddingBottom: 16,
    paddingTop: 5,
  },
  requestCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  requestContent: {
    flex: 2,
    gap: 4,
  },
  requestType: {
    fontSize: 14,
    color: '#637988',
  },
  requestStatus: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111518',
  },
  approvedStatus: {
    color: '#4CAF50',
  },
  rejectedStatus: {
    color: '#F44336',
  },
  requestDetail: {
    fontSize: 14,
    color: '#637988',
  },
  requestImage: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  requestImageStyle: {
    resizeMode: 'cover',
  },
  subimage: {
    height: 55,
    width: 55
  },
  
  // Medical Card Styles
  cardContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardYellowHeader: {
    backgroundColor: '#FFD700', // Yellow color
    padding: 16,
  },
  cardHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  govLogo: {
    width: 45,
    height: 45,
    marginRight: 8,
    borderRadius:50
  },
  cardHeaderText: {
    flex: 1,
    marginRight: 8,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#111518',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#111518',
  },
  nmpaLogo: {
    width: 48,
    height: 48,
    borderRadius:50
  },
  cardBlueTitle: {
    backgroundColor: '#1E88E5', // Blue color
    paddingVertical: 8,
    alignItems: 'center',
  },
  cardBlueTitleText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  cardContent: {
    padding: 16,
    backgroundColor: '#F8F9FA',
    flexDirection: 'row',
  },
  cardMainContent: {
    flex: 2,
  },
  cardName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#111518',
    marginBottom: 16,
  },
  cardDetails: {
    gap: 9,
  },
  detailRow: {
    flexDirection: 'row',
  },
  detailLabel: {
    width: 120,
    fontSize: 12,
    color: '#637988',
    fontWeight: '900',
  },
  detailValue: {
    fontSize: 12,
    color: '#111518',
  },
  cardSideContent: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    gap: 4,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  bloodTypeContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 8,
    marginLeft:5
  },
  bloodIcon: {
    width: 20,
    height: 20,
    marginRight: 4,
  },
  bloodType: {
    color: '#F44336',
    fontWeight: 'bold',
  },
 
    requestItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8fafc', // slate-50 equivalent
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e7edf4',
  },
  requestInfo: {
    flex: 1,
  },
  patientName: {
    color: '#0d151c',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
    viewButton: {
    backgroundColor: '#e7edf4',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minWidth: 84,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewButtonText: {
    color: '#0d151c',
    fontSize: 14,
    fontWeight: '500',
  },


  cardActionsContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  paddingHorizontal: 16,
  marginBottom: 24,
  marginTop: 20,
  gap: 16,
},
cardAction: {
  flex: 1,
  borderRadius: 12,
  padding: 20,
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 160,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
},
primaryCardAction: {
  backgroundColor: Colors.darkBlue,
},
secondaryCardAction: {
  backgroundColor: '#f0f3f4',
  borderColor: '#a1aaadff',
  borderWidth: 0.5,
},
cardActionImage: {
  width: '100%',
  height: '100%',
  // marginBottom: 16,
},
primaryCardActionText: {
  color: 'white',
  fontSize: 16,
  fontWeight: 'bold',
  textAlign: 'center',
  marginTop: 8,
},
secondaryCardActionText: {
  color: Colors.darkBlue,
  fontSize: 16,
  fontWeight: 'bold',
  textAlign: 'center',
  marginTop: 8,
},
  fullCardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 20,
    gap: 12, // Adds space between cards
  },
  fullCard: {
    flex: 1,
    height: 140,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  gradientBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  cardTitle1: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 6,
    textAlign: 'center',
  },
  cardDescription: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 20,
  },
  medicineCard: {
    backgroundColor: '#4a90e2', // fallback color
  },
  referralCard: {
    backgroundColor: '#ff7e5f', // fallback color
  },
fullCardBackground: {
  flex: 1,
  justifyContent: 'flex-end',
},
fullCardImageStyle: {
  resizeMode: 'cover',
},
fullCardOverlay: {
  ...StyleSheet.absoluteFillObject,
  backgroundColor: 'rgba(0,0,0,0.4)',
},
fullCardText: {
  color: 'white',
  fontSize: 18,
  fontWeight: 'bold',
  padding: 16,
  zIndex: 1,
  textShadowColor: 'rgba(0, 0, 0, 0.75)',
  textShadowOffset: { width: 1, height: 1 },
  textShadowRadius: 10,
},
  smallCardTitle: {
    fontSize: 11,
  },
  smallCardSubtitle: {
    fontSize: 10,
  },
  smallNmpaLogo: {
    width: 40,
    height: 40,
  },
  smallCardBlueTitleText: {
    fontSize: 11,
  },
  smallCardContent: {
    padding: 12,
    flexDirection: isSmallDevice ? 'column' : 'row',
  },
  smallCardMainContent: {
    flex: isSmallDevice ? 1 : 2,
    marginBottom: isSmallDevice ? 12 : 0,
  },
  smallCardName: {
    fontSize: 12,
    marginBottom: 12,
  },
  smallDetailLabel: {
    width: 100,
    fontSize: 11,
  },
  smallDetailValue: {
    fontSize: 11,
  },
 smallCardSideContent: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  smallQrCode: {
    width: 35,
    height: 35,
  },
  smallQrText: {
    fontSize: 7,
  },
  smallProfileImage: {
    width: 80,
    height: 80,
  },
  smallBloodTypeContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginLeft: isSmallDevice ? 0 : 5,
  },
  smallBloodIcon: {
    width: 16,
    height: 16,
  },
  smallBloodType: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  qrCodeContainer: {
    marginTop: 0,
    padding: 2,
    borderRadius: 2,
    alignSelf: 'flex-start',
    marginLeft: '7%',
  },
  qrCode: {
    width: 40,
    height: 40,
  },
  
  qrText: {
    fontSize: 8,
    color: Colors.darkBlue,
    marginTop: 4,
    fontWeight: 'bold',
  },
    modalCenteredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: Colors.darkBlue,
  },
  modalSubtitle: {
    fontSize: 14,
    marginTop: 15,
    marginBottom: 20,
    textAlign: 'center',
    color: '#637988',
  },
  modalButton: {
    borderRadius: 10,
    padding: 12,
    elevation: 2,
    minWidth: 100,
  },
  modalButtonClose: {
    backgroundColor: Colors.darkBlue,
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },

  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.darkBlue,
  },
  qrLoadingContainer: {
    height: 200,
    width: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrLoadingText: {
    marginTop: 16,
    fontSize: 14,
    color: Colors.darkBlue,
  },
  noRequestsText:{
    textAlign:'center',
    paddingVertical:'5%'
  }
});

export default HomeScreen;