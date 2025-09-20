import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ImageBackground, Modal, ActivityIndicator, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '../../constants/Colors';
import moment from 'moment';
import { BASE_URL } from '../../navigation/Config';
import { WebView } from 'react-native-webview';
import ImageViewer from 'react-native-image-zoom-viewer';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';

const MedicineDetails = ({ navigation, route }) => {
  const { t } = useTranslation();
  const { medicine } = route.params;
  const [isPdf, setIsPdf] = useState(false);
  const [isImageViewVisible, setIsImageViewVisible] = useState(false);
  const [fileUrl, setFileUrl] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (medicine.file_url) {
      let formattedUrl = medicine.file_url.startsWith('/api') 
        ? medicine.file_url.substring(4) 
        : medicine.file_url;
      formattedUrl = `${BASE_URL}${formattedUrl}`;
      
      setFileUrl(formattedUrl);
      setIsPdf(formattedUrl.toLowerCase().endsWith('.pdf'));
    }
  }, [medicine.file_url]);

  console.log("medicine",JSON.stringify(medicine,null,2))

  const getStatusText = (status) => {
    switch(status) {
      case 'assigned_to_doctor':
        return t('medicine_details.status_assigned_to_doctor');
      case 'completed':
        return t('medicine_details.status_completed');
      default:
        return status;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'assigned_to_doctor':
        return '#FFA500'; // Orange
      case 'completed':
        return 'green'; // Blue
      default:
        return '#666';
    }
  };

  const getDurationText = (duration) => {
    if (duration.months) {
      return t('medicine_details.months_duration', { count: duration.months });
    } else if (duration.days) {
      return t('medicine_details.days_duration', { count: duration.days });
    }
    return t('medicine_details.not_available');
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={Colors.darkBlue} />
      </View>
    );
  }

  const statusMap = {
  approved: {
    text: t('medicine_review.status_approved'),
    color: 'green',
  },
  rejected: {
    text: t('medicine_review.status_rejected'),
    color: 'red',
  },
  pending: {
    text: t('medicine_review.status_pending'),
    color: '#FFA500', // orange
  },
  assigned_to_doctor: {
    text: t('medicine_review.status_assigned_to_doctor'),
    color: '#FFA500', // orange
  },
  completed: {
    text: t('medicine_review.status_completed'),
    color: 'green',
  },
  dispatched: {
    text: t('medicine_review.status_dispatched'),
    color: 'blue',
  }
};


const currentStatus = statusMap[medicine.status] || {
  text: t('medicine_review.status_unknown'),
  color: 'gray',
};

const status = currentStatus.text;
const statusColor = currentStatus.color;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#0d141c" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('medicine_details.title')}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Status */}
        {/* <View style={styles.statusContainer}>
          <Text style={[styles.statusText, { color: getStatusColor(medicine.status) }]}>
            {getStatusText(medicine.status)}
          </Text>
        </View> */}

        {/* Prescription */}
        <Text style={styles.sectionTitle}>{t('medicine_details.prescription')}</Text>
        {fileUrl ? (
          isPdf ? (
            <View style={styles.pdfContainer}>
              <WebView
                source={{ uri: `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(fileUrl)}` }}
                style={styles.pdfView}
                scalesPageToFit={true}
              />
            </View>
          ) : (
            <>
              <TouchableOpacity 
                activeOpacity={0.8}
                onPress={() => setIsImageViewVisible(true)}
              >
                <ImageBackground
                  source={{ uri: fileUrl }}
                  style={styles.prescriptionImage}
                  resizeMode="contain"
                />
              </TouchableOpacity>

              <Modal visible={isImageViewVisible} transparent={true}>
                <ImageViewer
                  imageUrls={[{ url: fileUrl }]}
                  enableSwipeDown={true}
                  onSwipeDown={() => setIsImageViewVisible(false)}
                  enableImageZoom={true}
                  renderHeader={() => (
                    <TouchableOpacity 
                      style={styles.closeButton}
                      onPress={() => setIsImageViewVisible(false)}
                    >
                      <Ionicons name="close" size={30} color="white" />
                    </TouchableOpacity>
                  )}
                />
              </Modal>
            </>
          )
        ) : (
          <Text style={styles.noFileText}>{t('medicine_details.no_prescription')}</Text>
        )}

        {/* Medicine Details */}
        <Text style={styles.sectionTitle}>{t('medicine_details.medicine_details')}</Text>
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{t('medicine_details.request_id')}</Text>
            <Text style={styles.detailValue}>{medicine.id}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{t('medicine_details.issue_date')}</Text>
            <Text style={styles.detailValue}>
              {medicine.issue_date ? moment(medicine.issue_date.split('T')[0]).format("MMMM D, YYYY") : t('medicine_details.not_available')}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{t('medicine_details.duration')}</Text>
            <Text style={styles.detailValue}>{getDurationText(medicine.medicine_duration)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{t('medicine_details.requested_at')}</Text>
            <Text style={styles.detailValue}>
              {medicine.requested_at ? moment(medicine.requested_at).format("MMMM D, YYYY h:mm A") : t('medicine_details.not_available')}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{t('medicine_details.updated_at')}</Text>
            <Text style={styles.detailValue}>
              {medicine.updated_at ? moment(medicine.updated_at).format("MMMM D, YYYY h:mm A") : t('medicine_details.not_available')}
            </Text>
          </View>
        </View>

        {/* Doctor Information */}
        <Text style={styles.sectionTitle}>{t('medicine_details.doctor_info')}</Text>
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{t('medicine_details.assigned_doctor')}</Text>
            <Text style={styles.detailValue}>
              {medicine.doctor_name || t('medicine_details.not_available')}
            </Text>
          </View>
          <View style={styles.detailRow}>
               <Text style={styles.detailLabel}>{t('status')}</Text>
                   <Text style={[styles.detailValue, { color: statusColor }]}>{status}</Text>
          </View>
          {medicine.approval_notes && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>{t('medicine_details.approval_notes')}</Text>
              <Text style={styles.detailValue}>{medicine.approval_notes}</Text>
            </View>
          )}
        </View>

        {/* Delivery Information */}
        {medicine.delivery_tracking_id && (
          <>
            <Text style={styles.sectionTitle}>{t('medicine_details.delivery_info')}</Text>
            <View style={styles.detailsContainer}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>{t('medicine_details.approved_at')}</Text>
                <Text style={styles.detailValue}>
                  {medicine.approved_at ? moment(medicine.approved_at).format("MMMM D, YYYY h:mm A") : t('medicine_details.not_available')}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>{t('medicine_details.tracking_id')}</Text>
                <Text style={styles.detailValue}>
                  {medicine.delivery_tracking_id || t('medicine_details.not_available')}
                </Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>
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
    backgroundColor: '#f8fafc',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0d141c',
    textAlign: 'center',
    flex: 1,
  },
  content: {
    paddingBottom: 20,
  },
  statusContainer: {
    padding: 16,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0d141c',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  prescriptionImage: {
    width: '100%',
    aspectRatio: 3/2,
    marginVertical: 8,
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
  noFileText: {
    textAlign: 'center',
    padding: 16,
    color: '#666',
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

export default MedicineDetails;