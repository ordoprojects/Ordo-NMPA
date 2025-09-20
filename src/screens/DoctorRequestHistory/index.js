import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal, TouchableOpacity, Image, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialIcons'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../../navigation/Config';
import moment from 'moment';
import Colors from '../../constants/Colors';
import { useRole } from '../../Context/RoleContext';
import { recognizePrefixSuffix } from 'react-native-reanimated/lib/typescript/animation/util';
import Toast from 'react-native-simple-toast';
import { getToken } from '../../navigation/auth';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next'; 
import { WebView } from 'react-native-webview';import Pdf from 'react-native-pdf';
import { SafeAreaView } from 'react-native-safe-area-context';


const DoctorRequestHistory = ({ navigation }) => {
const { role } = useRole();
const { t } = useTranslation();

 const [pdfModalVisible, setPdfModalVisible] = useState(false);
 const [currentPdfUrl, setCurrentPdfUrl] = useState('');
 const [pdfPassword, setPdfPassword] = useState('');
 const [inputPassword, setInputPassword] = useState('');
 const [showPasswordInput, setShowPasswordInput] = useState(false);
 const [currentToken, setCurrentToken] = useState('');
 const [activeMainTab, setActiveMainTab] = useState('Referral'); 
 const [activeStatusFilter, setActiveStatusFilter] = useState('All');
  
  // Data states
const [referrals, setReferrals] = useState([]);
const [medicineRequests, setMedicineRequests] = useState([]);
const [loading, setLoading] = useState(false);
const [refreshing, setRefreshing] = useState(false);
const[user,setUser]=useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

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
      // console.log("Raw API data:", JSON.stringify(data, null, 2));
setUser(data);
      if (response.ok) {
      console.log("got user")
      } else {
        console.error('Failed to fetch referrals:', data);
      }
    } catch (error) {
      console.error('Error fetching referrals:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  
  useFocusEffect(
    React.useCallback(() => {
      fetchUser();
      return () => {};
    }, [])
  );


// console.log("user",user)

  // Fetch data based on active tab
  // Update your useEffect to handle initial load
  useFocusEffect(
    React.useCallback(() => {
      // Reset to first page and refresh
      setCurrentPage(1);
      if (activeMainTab === 'Referral') {
        fetchReferrals(1);
      } else {
        fetchMedicineRequests(1);
      }
      
      return () => {};
    }, [activeMainTab])
  );


    // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
    setTotalPages(1);
    setHasMore(true);
  }, [activeMainTab, activeStatusFilter]);

const fetchReferrals = async (page = 1, isLoadMore = false) => {
  try {
    if (isLoadMore) {
      setIsLoadingMore(true);
    } else {
      setLoading(true);
    }
    
    const token = await getToken();
    
    // Build query parameters
    const params = new URLSearchParams();
    params.append('page', page.toString());
    
    // Only add status parameter if not "All"
    if (activeStatusFilter !== 'All') {
      params.append('status', activeStatusFilter.toLowerCase());
    }
    
    const response = await fetch(
      `${BASE_URL}/appointments/list/?${params.toString()}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();
    if (response.ok) {
      if (isLoadMore) {
        setReferrals(prev => [...prev, ...data.appointments]);
      } else {
        setReferrals(data.appointments);
      }
      
      // Update pagination info
      setCurrentPage(data.pagination?.currentPage || 1);
      setTotalPages(data.pagination?.totalPages || 1);
      setHasMore((data.pagination?.currentPage || 1) < (data.pagination?.totalPages || 1));
    } else {
      console.error('Failed to fetch referrals:', data);
    }
  } catch (error) {
    console.error('Error fetching referrals:', error);
  } finally {
    setLoading(false);
    setIsLoadingMore(false);
    setRefreshing(false);
  }
};

const fetchMedicineRequests = async (page = 1, isLoadMore = false) => {
  try {
    if (isLoadMore) {
      setIsLoadingMore(true);
    } else {
      setLoading(true);
    }
    
    const token = await getToken();
    
    // Build query parameters
    const params = new URLSearchParams();
    params.append('page', page.toString());
    
    // Only add status parameter if not "All"
    if (activeStatusFilter !== 'All') {
      // Map the filter name to the actual API status value
      let statusValue = activeStatusFilter.toLowerCase();
      
      if (activeStatusFilter === 'Assigned') {
        statusValue = 'assigned_to_doctor'; // Map "Assigned" to "assigned_to_doctor"
      }
      
      params.append('status', statusValue);
    }
    
    const response = await fetch(
      `${BASE_URL}/medicine-requests/list/?${params.toString()}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();
    console.log("Raw API data:", JSON.stringify(data, null, 2));

    if (response.ok) {
      if (isLoadMore) {
        setMedicineRequests(prev => [...prev, ...data.medicine_requests]);
      } else {
        setMedicineRequests(data.medicine_requests);
      }
      
      // Update pagination info
      setCurrentPage(data.pagination?.currentPage || 1);
      setTotalPages(data.pagination?.totalPages || 1);
      setHasMore((data.pagination?.currentPage || 1) < (data.pagination?.totalPages || 1));
    } else {
      console.error('Failed to fetch medicine requests:', data);
    }
  } catch (error) {
    console.error('Error fetching medicine requests:', error);
  } finally {
    setLoading(false);
    setIsLoadingMore(false);
    setRefreshing(false);
  }
};

  const loadMore = () => {
    if (!isLoadingMore && hasMore) {
      const nextPage = currentPage + 1;
      if (activeMainTab === 'Referral') {
        fetchReferrals(nextPage, true);
      } else {
        fetchMedicineRequests(nextPage, true);
      }
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setCurrentPage(1);
    if (activeMainTab === 'Referral') {
      fetchReferrals(1);
    } else {
      fetchMedicineRequests(1);
    }
  };


  const renderFooter = () => {
    if (!hasMore) return null;
    
    return (
      <View style={styles.footerContainer}>
        {isLoadingMore ? (
          <ActivityIndicator size="small" color="#101518" />
        ) : (
          <TouchableOpacity 
            style={styles.loadMoreButton}
            onPress={loadMore}
          >
            <Text style={styles.loadMoreText}>{t('load_more')}</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const handleCancelAppointment = async (referral) => {
    try {
      const token = await getToken();
      const response = await fetch(`${BASE_URL}/appointments/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          appointmentId: referral.id
        }),
      });

      const data = await response.json();
      if (response.ok) {
        Toast.show(t('appointment_cancelled'), Toast.LONG);
        // Refresh the referrals list after successful cancellation
        fetchReferrals();
      } else {
        console.error('Failed to cancel appointment:', data);
        Toast.show(t('cancellation_failed'), Toast.LONG);
      }
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      Toast.show(t('cancellation_error'), Toast.LONG);
    }
  };

const getStatusColor = (status, isMedicine = false) => {
  if (isMedicine) {
    switch(status.toLowerCase()) {
      case 'approved':
      case 'completed': return '#4CAF50B3'; // Green
      case 'pending':
      case 'assigned_to_doctor': return '#e3ad0ab3'; // Amber
      case 'rejected': 
      case 'cancelled': return '#F44336B3'; // Red
      case 'dispatched': return '#2196F3B3'; // Blue
      default: return '#9E9E9EB3'; // Gray
    }
  } else {
    switch(status.toLowerCase()) {
      case 'approved': return '#4CAF50B3'; // Green
      case 'pending': return '#e3ad0ab3'; // Amber
      case 'rejected': 
      case 'cancelled': return '#F44336B3'; // Red
      default: return '#9E9E9EB3'; // Gray
    }
  }
};

const getStatusText = (status, isMedicine = false) => {
  if (isMedicine) {
    switch(status.toLowerCase()) {
      case 'assigned_to_doctor': return t('assigned');
      case 'completed': return t('completed');
      default: return t(status.toLowerCase());
    }
  }
  return t(status.toLowerCase());
};

 const handleViewPdf = async (fileUrl) => {
        try {
            const token = await getToken();
            setCurrentToken(token);
            
            // Remove /api prefix if it exists
            let formattedUrl = fileUrl;
            if (formattedUrl?.startsWith('/api')) {
                formattedUrl = formattedUrl.substring(4);
            }
            
            // Construct full URL
            const pdfUrl = `${BASE_URL}${formattedUrl}`;
            setCurrentPdfUrl(pdfUrl);
            
            // Show password input first
            setShowPasswordInput(true);
            setPdfModalVisible(true);
            setPdfPassword('');
            setInputPassword('');
            
        } catch (error) {
            console.error('Error preparing PDF:', error);
            Toast.show(t('pdf_prepare_error'), Toast.LONG);
        }
    };

    const handlePdfError = (error) => {
        console.log('PDF error:', error);
        if (error.toString().includes('Password') || error.toString().includes('password')) {
            setShowPasswordInput(true);
            Toast.show(t('incorrect_password'), Toast.LONG);
        } else {
            Toast.show(t('pdf_load_error'), Toast.LONG);
        }
    };

    const submitPassword = () => {
        setPdfPassword(inputPassword);
        setShowPasswordInput(false);
    };

    const closePdfModal = () => {
        setPdfModalVisible(false);
        setShowPasswordInput(false);
        setPdfPassword('');
        setInputPassword('');
    };


  const renderReferralItem = (item) => {
      let fileUrl = item.patient_photo_url;
  if (fileUrl?.startsWith('/api')) {
    fileUrl = fileUrl.substring(4); // Remove '/api' prefix
  }
  const fullUrl = fileUrl ? `${BASE_URL}${fileUrl}` : null;
// console.log("full url",fullUrl);

 return (

       <TouchableOpacity
    key={item.id}
    style={styles.requestCard}
    activeOpacity={0.8}
    onPress={() =>
      navigation.navigate('AppStack', {
        screen: 'ReferralDetails',
        params: { referral: item },
      })
    }
  >
    <Image 
      source={{  uri:fullUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCtma6w49IRV8te_Igaeh6FMRrgUHV48JHCAIYzg0S0_-3alEA8I-nD82DptCQgDsIxI8wy_Jif7uQ7zZHLwPS1B_yhX9oKzq-DtvBLAZwAIHKv248iLSGJxS7rlcWwm0syyPJB9_xJMpAGx3CMX5WONE-sv5PFYK-gb7Axvk3oqvP1xtvVJx3ipQXf_Le496CaFZEkUuVKbB76kx1WgQsb-4VuuvC0XwCI61rbWb_OIjuFeB89QdepYJg7nkjpBxmqXRX8MbzLr1vc' }} 
      style={styles.patientImage} 
          resizeMode='contain'

    />
    <View style={styles.requestInfo}>
      <Text style={styles.patientName}>
        {item.patient_name ? item.patient_name : `${user?.first_name} ${user?.last_name}`}
      </Text>

      <View style={styles.requestMeta}>
        <Text style={styles.requestType}>{t('ec_no')}: {item.patient_ecno}</Text>
        <Text style={styles.requestDate}>
          {moment(item.appointment_time).format('MMM D, YYYY h:mm A')}
        </Text>
      </View>

      <View style={styles.statusAndButtonContainer}>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor: getStatusColor(
                item.doctor_approval ? 'approved' : item.status
              ),
            },
          ]}
        >
          <Text style={styles.statusText}>
            {getStatusText(item.doctor_approval ? 'approved' : item.status)}
          </Text>
        </View>

        {role === 'user' && !item.doctor_approval && item.status === 'pending' && (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => {
              Alert.alert(
                t('confirm_cancellation'),
                t('cancel_appointment_confirmation'),
                [
                  { text: t('no'), style: 'cancel' },
                  { text: t('yes'), onPress: () => handleCancelAppointment(item) },
                ]
              );
            }}
          >
            <Text style={styles.cancelButtonText}>{t('cancel')}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  </TouchableOpacity>
 )
};


const renderMedicineItem = (item) => {
  // Check if file is PDF
  const isPDF = item.file_url?.toLowerCase().endsWith('.pdf');
  
  // Construct proper URL by removing /api prefix if it exists
  let fileUrl = item.file_url;
  if (fileUrl?.startsWith('/api')) {
    fileUrl = fileUrl.substring(4); // Remove '/api' prefix
  }
  const fullUrl = fileUrl ? `${BASE_URL}${fileUrl}` : null;

 return (
    <TouchableOpacity 
      key={item.id} 
      style={styles.requestCard}
      activeOpacity={0.8}
onPress={() => navigation.navigate('AppStack', { 
  screen: 'MedicineDetails', 
  params: { medicine: item }
})}
 >
      {isPDF ? (
        <View style={[styles.patientImage, styles.pdfIconContainer]}>
          <Icon name="picture-as-pdf" size={25} color="#E53935" />
          <Text style={styles.pdfText}>PDF</Text>
        </View>
      ) : (
        <Image 
          source={{ uri: fullUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCtma6w49IRV8te_Igaeh6FMRrgUHV48JHCAIYzg0S0_-3alEA8I-nD82DptCQgDsIxI8wy_Jif7uQ7zZHLwPS1B_yhX9oKzq-DtvBLAZwAIHKv248iLSGJxS7rlcWwm0syyPJB9_xJMpAGx3CMX5WONE-sv5PFYK-gb7Axvk3oqvP1xtvVJx3ipQXf_Le496CaFZEkUuVKbB76kx1WgQsb-4VuuvC0XwCI61rbWb_OIjuFeB89QdepYJg7nkjpBxmqXRX8MbzLr1vc' }} 
          style={styles.patientImage} 
          resizeMode='contain'
        />
      )}
      <View style={styles.requestInfo}>
        <Text style={styles.patientName}>
          {t('prescription', { id: item.prescription_id })}
        </Text>
        <View style={styles.requestMeta}>
          <Text style={styles.requestType}>
            {t('duration')}: {item.medicine_duration?.months ? `${item.medicine_duration.months} ${t('month')}(s)` : 
                     item.medicine_duration?.days ? `${item.medicine_duration.days} ${t('day')}(s)` : 'N/A'}
          </Text>
          <Text style={styles.requestDate}>
            {moment(item.issue_date).format('MMM D, YYYY')}
          </Text>
        </View>
        
        <View style={[styles.statusBadge, { 
          backgroundColor: getStatusColor(item.status, true) 
        }]}>
          <Text style={styles.statusText}>
            {getStatusText(item.status, true)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
  };


const getStatusFilters = () => {
  if (activeMainTab === 'Referral') {
    return ['All', 'Pending', 'Approved', 'Rejected', 'Cancelled'];
  } else {
    return ['All', 'Pending', 'Assigned', 'Approved', 'Dispatched', 'Completed', 'Rejected'];
  }
};

  return (
 <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#101518" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('request_history')}</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Main Tabs */}
      <View style={styles.mainTabContainer}>
        {[t('referral'), t('medicine')].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.mainTab,
              activeMainTab === (tab === t('referral') ? 'Referral' : 'Medicine') && styles.activeMainTab
            ]}
            onPress={() => setActiveMainTab(tab === t('referral') ? 'Referral' : 'Medicine')}
          >
            <Text style={[
              styles.mainTabText,
              activeMainTab === (tab === t('referral') ? 'Referral' : 'Medicine') && styles.activeMainTabText
            ]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Status Filter tabs */}
      <View style={styles.filterOuterContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.filterContainer}
        >
          {getStatusFilters().map((filter) => (
            <TouchableOpacity 
              key={filter}
              style={[
                styles.filterTab,
                activeStatusFilter === filter && styles.activeFilterTab
              ]}
              onPress={() => setActiveStatusFilter(filter)}
            >
              <Text style={[
                styles.filterText,
                activeStatusFilter === filter && styles.activeFilterText
              ]}>
                {t(filter.toLowerCase())}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#101518" />
          </View>
        ) : (
   <ScrollView 
    style={styles.requestsContainer}
    refreshControl={
      <RefreshControl
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    }
    onScroll={({nativeEvent}) => {
      // Optional: Auto load more when scrolling near bottom
      const {layoutMeasurement, contentOffset, contentSize} = nativeEvent;
      const paddingToBottom = 20;
      if (layoutMeasurement.height + contentOffset.y >= 
          contentSize.height - paddingToBottom && 
          !isLoadingMore && hasMore) {
        loadMore();
      }
    }}
    scrollEventThrottle={400}
  >
    {activeMainTab === 'Referral' ? (
      referrals.length > 0 ? (
        referrals.map(renderReferralItem)
      ) : (
        <Text style={styles.emptyText}>{t('no_referrals_found')}</Text>
      )
    ) : (
      medicineRequests.length > 0 ? (
        medicineRequests.map(renderMedicineItem)
      ) : (
        <Text style={styles.emptyText}>{t('no_medicine_requests_found')}</Text>
      )
    )}
    {renderFooter()}
  </ScrollView>


        )}
      </View>
           {/* PDF Modal */}
            <Modal
                visible={pdfModalVisible}
                animationType="slide"
                onRequestClose={() => setPdfModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <TouchableOpacity 
                            onPress={() => setPdfModalVisible(false)}
                            style={styles.closeButton}
                        >
                            <Ionicons name="close" size={24} color="#101518" />
                        </TouchableOpacity>
                        <Text style={styles.modalTitle}>{t('referral_document')}</Text>
                        <View style={{ width: 24 }} />
                    </View>
                    
                    <WebView
                        source={{ 
                            uri: currentPdfUrl,
                            headers: {
                                // If your PDFs require authentication, you'll need to pass the token
                                // This might require additional server-side configuration
                            }
                        }}
                        style={styles.webview}
                        onError={(syntheticEvent) => {
                            const { nativeEvent } = syntheticEvent;
                            console.error('WebView error: ', nativeEvent);
                            Toast.show(t('pdf_load_error'), Toast.LONG);
                        }}
                        onHttpError={(syntheticEvent) => {
                            const { nativeEvent } = syntheticEvent;
                            console.error('WebView HTTP error: ', nativeEvent);
                            Toast.show(t('pdf_load_error'), Toast.LONG);
                        }}
                    />
                </View>
            </Modal>
</SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#101518',
    textAlign: 'center',
    flex: 1,
  },
  mainTabContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: '#eaedf1',
    overflow: 'hidden',
  },
  mainTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeMainTab: {
    backgroundColor: Colors.darkBlue,
  },
  mainTabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#101518',
  },
  activeMainTabText: {
    color: '#ffffff',
  },
  filterScrollView: {
    backgroundColor:'yellow',
    flex:1
  },
filterOuterContainer: {
  paddingVertical: 8,
  paddingHorizontal: 4,
},
filterContainer: {
  paddingHorizontal: 16,
  alignItems: 'center',
},
filterTab: {
  backgroundColor: '#f1f1f1',
  paddingVertical: 10,
  paddingHorizontal: 16,
  borderRadius: 16,
  marginHorizontal: 4,
  justifyContent: 'center',
  // ❌ remove height: 50
},

    activeFilterTab: {
    backgroundColor: Colors.darkBlue,
    borderColor:  Colors.darkBlue,
  },
  filterText: {
    fontSize: 14, // Slightly smaller text
    color: '#555',
    fontWeight: '500',
  },
 
    activeFilterText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1, // Takes remaining space
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  requestsContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  requestCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  patientImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  requestInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  patientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#101518',
    marginBottom: 4,
  },
  requestMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  requestType: {
    fontSize: 14,
    color: '#5c748a',
  },
  requestDate: {
    fontSize: 14,
    color: '#5c748a',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
    textTransform: 'uppercase',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#5c748a',
  },
  statusAndButtonContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: 8,
},
cancelButton: {
  backgroundColor: '#F44336',
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: 6,
},
cancelButtonText: {
  color: '#ffffff',
  fontSize: 12,
  fontWeight: '600',
},
  pdfIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  pdfText: {
    marginTop: 5,
    color: '#E53935',
    fontWeight: 'bold',
  },
      // PDF View Button
    viewPdfButton: {
        backgroundColor: Colors.darkBlue,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
        marginLeft: 8,
    },
    viewPdfButtonText: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: '600',
    },
    
    // Modal Styles
    modalContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eaeaea',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#101518',
    },
    closeButton: {
        padding: 4,
    },
    webview: {
        flex: 1,
    },
      footerContainer: {
      padding: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    loadMoreButton: {
      backgroundColor: Colors.darkBlue,
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 8,
    },
    loadMoreText: {
      color: '#ffffff',
      fontWeight: '600',
    },
});

export default DoctorRequestHistory;