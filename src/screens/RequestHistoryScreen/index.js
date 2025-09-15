// src/screens/RequestHistoryScreen.js
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const RequestHistoryScreen = () => {
  const navigation = useNavigation();

  // Sample request history data
  const recentRequests = [
    {
      id: '1',
      type: 'Medicine Request',
      date: '2024-01-15',
      icon: 'pill',
      status: 'completed'
    }
  ];

  const previousRequests = [
    {
      id: '2',
      type: 'Referral Request',
      date: '2023-12-20',
      icon: 'stethoscope',
      status: 'completed'
    },
    {
      id: '3',
      type: 'Medicine Request',
      date: '2023-11-05',
      icon: 'pill',
      status: 'completed'
    },
    {
      id: '4',
      type: 'Referral Request',
      date: '2023-10-12',
      icon: 'stethoscope',
      status: 'completed'
    },
    {
      id: '5',
      type: 'Medicine Request',
      date: '2023-09-28',
      icon: 'pill',
      status: 'completed'
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#111518" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Request History</Text>
  
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Last 7 Days Section */}
        <Text style={styles.sectionTitle}>Last 7 Days</Text>
        
        {recentRequests.map(request => (
          <View key={request.id} style={styles.requestItem}>
            <View style={styles.requestIconContainer}>
              <Icon name={request.icon} size={24} color="#111518" />
            </View>
            <View style={styles.requestDetails}>
              <Text style={styles.requestType}>{request.type}</Text>
              <Text style={styles.requestDate}>Submitted on {request.date}</Text>
            </View>
            <View style={styles.statusIndicator}>
              <View style={[styles.statusDot, { backgroundColor: '#078838' }]} />
            </View>
          </View>
        ))}

        {/* Previous Section */}
        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Previous</Text>
        
        {previousRequests.map(request => (
          <View key={request.id} style={styles.requestItem}>
            <View style={styles.requestIconContainer}>
              <Icon name={request.icon} size={24} color="#111518" />
            </View>
            <View style={styles.requestDetails}>
              <Text style={styles.requestType}>{request.type}</Text>
              <Text style={styles.requestDate}>Submitted on {request.date}</Text>
            </View>
            <View style={styles.statusIndicator}>
              <View style={[styles.statusDot, { backgroundColor: '#078838' }]} />
            </View>
          </View>
        ))}
      </ScrollView>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollView: {
    flex: 1,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingBottom: 8,
    backgroundColor: '#ffffff',
  },
  headerTitle: {
    color: '#111518',
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 24,
    letterSpacing: -0.015,
    textAlign: 'center',
    flex: 1,
  },
  sectionTitle: {
    color: '#111518',
    fontSize: 17,
    fontWeight: 'bold',
    lineHeight: 24,
    letterSpacing: -0.015,
    paddingHorizontal: 16,
    paddingBottom: 12,
    paddingTop: 20,
  },
  requestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 72,
    backgroundColor: '#ffffff',
  },
  requestIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#f0f2f5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  requestDetails: {
    flex: 1,
  },
  requestType: {
    color: '#111518',
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
  },
  requestDate: {
    color: '#60768a',
    fontSize: 14,
    lineHeight: 20,
  },
  statusIndicator: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  bottomNav: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f0f2f5',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
  },
  activeNavItem: {
    // Styles for active item
  },
  navText: {
    color: '#60768a',
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.015,
  },
  activeNavText: {
    color: '#111518',
  },
});

export default RequestHistoryScreen;