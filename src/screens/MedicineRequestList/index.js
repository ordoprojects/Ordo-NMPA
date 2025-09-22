import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../../constants/Colors';
import moment from 'moment';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { BASE_URL } from '../../navigation/Config';
import { getToken } from '../../navigation/auth';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';

const MedicineRequestList = ({ navigation }) => {
  const { t } = useTranslation();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

useEffect(() => {
  const delayDebounce = setTimeout(() => {
    fetchMedicineRequests(1, searchQuery);
  }, 400);
  return () => clearTimeout(delayDebounce);
}, [searchQuery]);



  const fetchMedicineRequests = async (page = 1, search = '') => {
    try {
      setLoading(true);
      const token = await getToken();
      const response = await fetch(`${BASE_URL}/medicine-requests/list/?page=${page}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
if (response.ok) {
  let meds = data.medicine_requests || [];

  // 🔍 Local filter by prescription_id
  if (search) {
    meds = meds.filter(r =>
      r.prescription_id?.toString().includes(search.trim())
    );
  }

  setRequests(meds);
  setTotalPages(data.pagination?.totalPages || 1);
  setCurrentPage(data.pagination?.currentPage || 1);
} else {
  console.error(t('medicine_request_list.fetch_failed'), data);
}


    } catch (error) {
      console.error(t('medicine_request_list.fetch_error'), error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchMedicineRequests();
      return () => {};
    }, [])
  );

  const handleSearch = () => {
    setCurrentPage(1);
    fetchMedicineRequests(1, searchQuery);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchMedicineRequests(currentPage, searchQuery);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      fetchMedicineRequests(newPage, searchQuery);
    }
  };

  const navigateToDetail = (request) => {
    navigation.navigate('MedicineReview', { request });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return Colors.success;
      case 'assigned_to_doctor':
        return Colors.warning;
      case 'pending':
        return Colors.info;
      default:
        return Colors.gray;
    }
  };

  const formatDuration = (duration) => {
    if (!duration) return t('medicine_request_list.not_available');
    if (duration.days) return t('medicine_request_list.days', { count: duration.days });
    if (duration.months) return t('medicine_request_list.months', { count: duration.months });
    return t('medicine_request_list.not_available');
  };

const getStatusTranslation = (status) => {
  const statusMap = {
    'completed': t('medicine_request_list.status_completed'),
    'assigned_to_doctor': t('medicine_request_list.status_assigned'),
    'pending': t('medicine_request_list.status_pending'),
    'rejected': t('medicine_request_list.status_rejected'),
    'approved': t('medicine_request_list.status_approved'),
    'dispatched': t('medicine_request_list.status_dispatched') // added
  };
  return statusMap[status] || status.replace(/_/g, ' ');
};


  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#0e161b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('medicine_request_list.title')}</Text>
        <View style={styles.headerIconPlaceholder}>
          <TouchableOpacity>
            <Icon name="info-outline" size={24} color="#f0f3f5ff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder={t('medicine_request_list.search_placeholder')}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Ionicons name="search" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.darkBlue} />
        </View>
      ) : (
        <ScrollView 
          contentContainerStyle={styles.content}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[Colors.darkBlue]}
              tintColor={Colors.darkBlue}
            />
          }
        >
          {requests.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="medical-outline" size={48} color="#cedbe8" />
              <Text style={styles.emptyText}>{t('medicine_request_list.no_requests')}</Text>
            </View>
          ) : (
            <>
              {requests.map((request) => (
                <TouchableOpacity 
                  key={request.id} 
                  style={styles.card}
                  onPress={() => navigateToDetail(request)}
                >
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>
                      {t('medicine_request_list.prescription_id', { id: request.prescription_id })}
                    </Text>
                    <Text style={[styles.cardStatus, { color: getStatusColor(request.status), borderColor: getStatusColor(request.status) }]}>
                      {getStatusTranslation(request.status)}
                    </Text>
                  </View>
                  <View style={styles.cardBody}>
                    <View style={styles.cardRow}>
                      <Ionicons name="calendar-outline" size={16} color="#49739c" />
                      <Text style={styles.cardText}>
                        {moment(request.issue_date).format('DD MMM YYYY')}
                      </Text>
                    </View>
                    <View style={styles.cardRow}>
                      <Ionicons name="time-outline" size={16} color="#49739c" />
                      <Text style={styles.cardText}>
                        {formatDuration(request.medicine_duration)}
                      </Text>
                    </View>
                    {request.doctor_name && (
                      <View style={styles.cardRow}>
                        <Ionicons name="person-outline" size={16} color="#49739c" />
                        <Text style={styles.cardText}>
                          {t('medicine_request_list.doctor_prefix')} {request.doctor_name}
                        </Text>
                      </View>
                    )}
                    <View style={styles.cardRow}>
                      <Ionicons name="document-outline" size={16} color="#49739c" />
                      <Text style={styles.cardText} numberOfLines={1} ellipsizeMode="tail">
                        {t('medicine_request_list.prescription_label')}: {request.file_url ? t('medicine_request_list.available') : t('medicine_request_list.not_available')}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}

              {/* Pagination */}
              <View style={styles.pagination}>
                <TouchableOpacity 
                  style={[styles.pageButton, currentPage === 1 && styles.disabledButton]}
                  onPress={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <Text style={styles.pageButtonText}>{t('medicine_request_list.previous')}</Text>
                </TouchableOpacity>
                
                <Text style={styles.pageText}>
                  {t('medicine_request_list.page_info', { current: currentPage, total: totalPages })}
                </Text>
                
                <TouchableOpacity 
                  style={[styles.pageButton, currentPage === totalPages && styles.disabledButton]}
                  onPress={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <Text style={styles.pageButtonText}>{t('medicine_request_list.next')}</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </ScrollView>
      )}
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
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    paddingTop: 8,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#cedbe8',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
  },
  searchButton: {
    backgroundColor: Colors.darkBlue,
    borderRadius: 8,
    padding: 12,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    marginTop: 16,
    color: '#49739c',
    fontSize: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0d141c',
  },
  cardStatus: {
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'capitalize',
    borderWidth:1,
    borderRadius:10,
    padding:10
  },
  cardBody: {
    marginBottom: 8,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardText: {
    marginLeft: 8,
    color: '#0d141c',
    fontSize: 14,
    flex: 1,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 16,
  },
  pageButton: {
    backgroundColor: Colors.darkBlue,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  disabledButton: {
    backgroundColor: '#cedbe8',
  },
  pageButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  pageText: {
    color: '#0d141c',
    fontSize: 14,
  },
});

export default MedicineRequestList;