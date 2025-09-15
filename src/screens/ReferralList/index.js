import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, ActivityIndicator,RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../../constants/Colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { BASE_URL } from '../../navigation/Config';
import { getToken } from '../../navigation/auth';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';

const ReferralList = ({ navigation }) => {
  const { t } = useTranslation();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

const fetchReferrals = async (page = 1, search = '') => {
  try {
    setLoading(true);
    const token = await getToken();
    
    // Build URL with query parameters
    const url = new URL(`${BASE_URL}/appointments/list/`);
    url.searchParams.append('status', 'assigned');
    if (page > 1) {
      
      url.searchParams.append('page', page);
    }
    if (search) {
      url.searchParams.append('search', search);
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (response.ok) {
      // Now the server should only return pending appointments
      setAppointments(data.appointments);
      setTotalPages(data.pagination.totalPages);
      setCurrentPage(data.pagination.currentPage);
    } else {
      console.error(t('referral_list.fetch_failed'), data);
    }
  } catch (error) {
    console.error(t('referral_list.fetch_error'), error);
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
};

  useFocusEffect(
    React.useCallback(() => {
      fetchReferrals();
      return () => {};
    }, [])
  );

  console.log("appp",JSON.stringify(appointments,null,2))

  const handleSearch = () => {
    setCurrentPage(1);
    fetchReferrals(1, searchQuery);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchReferrals(currentPage, searchQuery);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      fetchReferrals(newPage, searchQuery);
    }
  };

  const navigateToReview = (appointment) => {
    navigation.navigate('ReferralReview', { 
      appointment: appointment 
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
<SafeAreaView edges={['top']} style={styles.header}>
  <TouchableOpacity onPress={() => navigation.goBack()}>
    <Icon name="arrow-back" size={24} color="#0e161b" />
  </TouchableOpacity>
  <Text style={styles.headerTitle}>{t('referral_list.title')}</Text>
  <View style={styles.headerIconPlaceholder}>
    <TouchableOpacity>
      <Icon name="info-outline" size={24} color="#f0f3f5ff" />
    </TouchableOpacity>
  </View>
</SafeAreaView>


      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder={t('referral_list.search_placeholder')}
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
          {appointments.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="document-text-outline" size={48} color="#cedbe8" />
              <Text style={styles.emptyText}>{t('referral_list.no_requests')}</Text>
            </View>
          ) : (
            <>
              {appointments.map((appointment) => (
                <TouchableOpacity 
                  key={appointment.id} 
                  style={styles.card}
                  onPress={() => navigateToReview(appointment)}
                >
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>{appointment.patient_name}</Text>
                    <Text style={styles.cardStatus}>{t('referral_list.status_pending')}</Text>
                  </View>
                  <View style={styles.cardBody}>
                    <View style={styles.cardRow}>
                      <Ionicons name="person-outline" size={16} color="#49739c" />
                      <Text style={styles.cardText}>
                        {t('referral_list.ec_number')}: {appointment.patient_ecno}
                      </Text>
                    </View>
                    <View style={styles.cardRow}>
                      <Ionicons name="calendar-outline" size={16} color="#49739c" />
                      <Text style={styles.cardText}>
                        {formatDate(appointment.appointment_time)}
                      </Text>
                    </View>
                    <View style={styles.cardRow}>
                      <Ionicons name="medical-outline" size={16} color="#49739c" />
                      <Text style={styles.cardText}>{appointment.consultation_reason}</Text>
                    </View>
                    <View style={styles.cardRow}>
                      <Ionicons name="location-outline" size={16} color="#49739c" />
                      <Text style={styles.cardText}>{appointment.hospital_name}</Text>
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
                  <Text style={styles.pageButtonText}>{t('referral_list.previous')}</Text>
                </TouchableOpacity>
                
                <Text style={styles.pageText}>
                  {t('referral_list.page_info', { current: currentPage, total: totalPages })}
                </Text>
                
                <TouchableOpacity 
                  style={[styles.pageButton, currentPage === totalPages && styles.disabledButton]}
                  onPress={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <Text style={styles.pageButtonText}>{t('referral_list.next')}</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffffff',
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
    color: Colors.darkBlue,
    fontWeight: '500',
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

export default ReferralList;