import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ImageBackground, Modal, ActivityIndicator, Alert, FlatList } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '../../constants/Colors';
import moment from 'moment';
import { BASE_URL } from '../../navigation/Config';
import { WebView } from 'react-native-webview';
import ImageViewer from 'react-native-image-zoom-viewer';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRole } from '../../Context/RoleContext';

const MedicineDetails = ({ navigation, route }) => {
  const { t } = useTranslation();
  const { medicine } = route.params;
  const [fileUrls, setFileUrls] = useState([]);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [isImageViewVisible, setIsImageViewVisible] = useState(false);
  const [isPdfViewVisible, setIsPdfViewVisible] = useState(false); // ✅ New state for PDF modal
  const [loading, setLoading] = useState(false);
  const { role } = useRole();

  console.log("role", role);

  // Process file_urls from response (supports both single and multiple files)
  useEffect(() => {
    if (medicine.file_urls && medicine.file_urls.length > 0) {
      // Handle multiple files
      const formattedUrls = medicine.file_urls.map(fileUrl => {
        let formattedUrl = fileUrl.startsWith('/api') 
          ? fileUrl.substring(4) 
          : fileUrl;
        return `${BASE_URL}${formattedUrl}`;
      });
      setFileUrls(formattedUrls);
    } else if (medicine.file_url) {
      // Handle single file (backward compatibility)
      let formattedUrl = medicine.file_url.startsWith('/api') 
        ? medicine.file_url.substring(4) 
        : medicine.file_url;
      formattedUrl = `${BASE_URL}${formattedUrl}`;
      setFileUrls([formattedUrl]);
    }
  }, [medicine.file_url, medicine.file_urls]);

  console.log("medicine", JSON.stringify(medicine, null, 2));

  // Check if file is PDF
  const isPdf = (url) => {
    return url && url.toLowerCase().endsWith('.pdf');
  };

  // Handle file press
  const handleFilePress = (index) => {
    setCurrentFileIndex(index);
    const currentUrl = fileUrls[index];
    if (isPdf(currentUrl)) {
      setIsPdfViewVisible(true); // ✅ Open PDF modal
    } else {
      setIsImageViewVisible(true); // ✅ Open image viewer
    }
  };

  // Render single file item in carousel
  const renderFileItem = ({ item, index }) => {
    const isPdfFile = isPdf(item);
    
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => handleFilePress(index)} // ✅ Use the new handler
        style={styles.fileCard}
      >
        {isPdfFile ? (
          <View style={styles.pdfCard}>
            <Ionicons name="document-text" size={50} color={Colors.darkBlue} />
            <Text style={styles.pdfFileName} numberOfLines={2}>
              {t('medicine_details.file_name', { number: index + 1 })}
            </Text>
            <Text style={styles.viewText}>{t('view_pdf')}</Text>
          </View>
        ) : (
          <Image
            source={{ uri: item }}
            style={styles.fileThumbnail}
            resizeMode="cover"
          />
        )}
        <Text style={styles.fileIndex}>
          {t('medicine_details.file_number', { number: index + 1 })}
        </Text>
      </TouchableOpacity>
    );
  };

  // Render PDF viewer for current file
  const renderPdfViewer = () => {
    const currentUrl = fileUrls[currentFileIndex];
    
    return (
      <Modal visible={isPdfViewVisible} transparent={false} animationType="slide">
        <SafeAreaView style={styles.pdfModalContainer}>
          <View style={styles.pdfModalHeader}>
            <TouchableOpacity onPress={() => setIsPdfViewVisible(false)}>
              <Ionicons name="arrow-back" size={24} color="#0d141c" />
            </TouchableOpacity>
            <Text style={styles.pdfModalTitle}>
              {t('medicine_details.prescription')} {currentFileIndex + 1} / {fileUrls.length}
            </Text>
            <TouchableOpacity onPress={() => setIsPdfViewVisible(false)}>
              <Ionicons name="close" size={24} color="#0d141c" />
            </TouchableOpacity>
          </View>
          <WebView
            source={{ uri: `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(currentUrl)}` }}
            style={styles.pdfViewer}
            scalesPageToFit={true}
            startInLoadingState={true}
            renderLoading={() => (
              <View style={styles.loadingIndicator}>
                <ActivityIndicator size="large" color={Colors.darkBlue} />
              </View>
            )}
          />
        </SafeAreaView>
      </Modal>
    );
  };

  // Render Image viewer
  const renderImageViewer = () => {
    return (
      <Modal visible={isImageViewVisible} transparent={true}>
        <ImageViewer
          imageUrls={fileUrls.map(url => ({ url }))}
          index={currentFileIndex}
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
          renderFooter={() => (
            <View style={styles.imageFooter}>
              <Text style={styles.imageCounter}>
                {currentFileIndex + 1} / {fileUrls.length}
              </Text>
            </View>
          )}
        />
      </Modal>
    );
  };

  const getDurationText = (duration) => {
    if (duration?.months) {
      return t('medicine_details.months_duration', { count: duration.months });
    } else if (duration?.days) {
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
      color: '#FFA500',
    },
    assigned_to_doctor: {
      text: t('medicine_review.status_assigned_to_doctor'),
      color: '#FFA500',
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

  let currentStatus = statusMap[medicine.status] || {
    text: t('medicine_review.status_unknown'),
    color: 'gray',
  };

  if (role === 'doctor' && medicine.status === 'assigned_to_doctor') {
    currentStatus = {
      ...currentStatus,
      text: t('medicine_review.status_assigned_to_you'),
    };
  }

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
        {/* Prescription Files Section */}
        <Text style={styles.sectionTitle}>{t('medicine_details.prescription')}</Text>
        {fileUrls.length > 0 ? (
          <FlatList
            data={fileUrls}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={renderFileItem}
            keyExtractor={(item, index) => `file-${index}`}
            contentContainerStyle={styles.filesList}
          />
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

      {/* ✅ Render modals outside the ScrollView */}
      {renderPdfViewer()}
      {renderImageViewer()}
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0d141c',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  filesList: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  fileCard: {
    width: 150,
    marginRight: 12,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  fileThumbnail: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  pdfCard: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    marginBottom: 8,
  },
  pdfFileName: {
    fontSize: 12,
    color: '#0d141c',
    marginTop: 8,
    textAlign: 'center',
  },
  viewText: {
    fontSize: 12,
    color: Colors.darkBlue,
    marginTop: 4,
    textDecorationLine: 'underline',
  },
  fileIndex: {
    fontSize: 11,
    color: '#666',
    marginTop: 4,
  },
  pdfModalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  pdfModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#f8fafc',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  pdfModalTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0d141c',
  },
  pdfViewer: {
    flex: 1,
  },
  imageFooter: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  imageCounter: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
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
  loadingIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
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