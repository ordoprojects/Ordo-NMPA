import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ImageBackground, TextInput, Modal, ActivityIndicator, Alert, Modal as RNModal, FlatList } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '../../constants/Colors';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../../navigation/Config';
import Toast from 'react-native-simple-toast';
import { getToken } from '../../navigation/auth';
import { WebView } from 'react-native-webview';
import ImageViewer from 'react-native-image-zoom-viewer';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRole } from '../../Context/RoleContext';

const MedicineReview = ({ navigation, route }) => {
  const { t } = useTranslation();
  const { request } = route.params;
  const [isApproved, setIsApproved] = useState(false);
  const [isRejected, setIsRejected] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [approvalNote, setApprovalNote] = useState('');
  const [rejectionNote, setRejectionNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [pastRequests, setPastRequests] = useState([]);
  const [loadingPastRequests, setLoadingPastRequests] = useState(true);
  const [fileUrls, setFileUrls] = useState([]);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [isImageViewVisible, setIsImageViewVisible] = useState(false);
  const [visibleCount, setVisibleCount] = useState(4);
  const { role } = useRole();

  console.log("request", request);
  console.log("past requests", JSON.stringify(pastRequests, null, 2));

  // Process file_urls from response
  useEffect(() => {
    if (request.file_urls && request.file_urls.length > 0) {
      const formattedUrls = request.file_urls.map(fileUrl => {
        let formattedUrl = fileUrl.startsWith('/api') 
          ? fileUrl.substring(4) 
          : fileUrl;
        return `${BASE_URL}${formattedUrl}`;
      });
      setFileUrls(formattedUrls);
    }
  }, [request.file_urls]);

  useEffect(() => {
    const fetchPastRequests = async () => {
      try {
        const token = await getToken();
        if (!token) {
          throw new Error(t('medicine_review.auth_error'));
        }

        const response = await fetch(`${BASE_URL}/medicine-requests/past?user_id=${request.user_id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const responseData = await response.json();

        console.log("Response data", JSON.stringify(responseData, null, 2));

        if (!response.ok) {
          throw new Error(responseData.message || t('medicine_review.past_requests_fetch_failed'));
        }

        const filteredRequests = responseData.medicine_requests.filter(
          req => req.id !== request.id
        );
        setPastRequests(filteredRequests);
      } catch (error) {
        console.error(t('medicine_review.past_requests_error'), error);
        Alert.alert(t('error'), t('medicine_review.past_requests_load_error'));
      } finally {
        setLoadingPastRequests(false);
      }
    };

    fetchPastRequests();
  }, [request.id, request.user_id]);

  const formatDuration = (duration) => {
    if (!duration) return t('medicine_request_list.not_available');
    if (duration.days) return t('medicine_request_list.days', { count: duration.days });
    if (duration.months) return t('medicine_request_list.months', { count: duration.months });
    return t('medicine_request_list.not_available');
  };

  // Check if file is PDF
  const isPdf = (url) => {
    return url.toLowerCase().endsWith('.pdf');
  };

  // Render single file item in carousel
  const renderFileItem = ({ item, index }) => {
    const isPdfFile = isPdf(item);
    
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          setCurrentFileIndex(index);
          if (!isPdfFile) {
            setIsImageViewVisible(true);
          }
        }}
        style={styles.fileCard}
      >
        {isPdfFile ? (
          <View style={styles.pdfCard}>
            <Ionicons name="document-text" size={50} color={Colors.darkBlue} />
            <Text style={styles.pdfFileName}>PDF Document {index + 1}</Text>
            <Text style={styles.viewText}>{t('view_pdf')}</Text>
          </View>
        ) : (
          <Image
            source={{ uri: item }}
            style={styles.fileThumbnail}
            resizeMode="cover"
          />
        )}
        <Text style={styles.fileIndex}>{t('medicine_review.file_number', { number: index + 1 })}</Text>
      </TouchableOpacity>
    );
  };

  // Render PDF viewer for current file
  const renderFileViewer = () => {
    const currentUrl = fileUrls[currentFileIndex];
    const isPdfFile = isPdf(currentUrl);

    if (isPdfFile) {
      return (
        <View style={styles.pdfViewerContainer}>
          <WebView
            source={{ uri: `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(currentUrl)}` }}
            style={styles.pdfViewer}
            scalesPageToFit={true}
          />
        </View>
      );
    } else {
      return (
        <RNModal visible={isImageViewVisible} transparent={true}>
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
        </RNModal>
      );
    }
  };

  const renderPastRequests = () => {
    if (loadingPastRequests) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={Colors.darkBlue} />
        </View>
      );
    }

    if (pastRequests.length === 0) {
      return (
        <Text style={styles.noPastRequestsText}>{t('medicine_review.no_past_requests')}</Text>
      );
    }

    return (
      <View style={styles.pastRequestsContainer}>
        {pastRequests.slice(0, visibleCount).map((req, index) => {
          const duration = formatDuration(req.medicine_duration);

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
              text: t('medicine_review.status_assigned_to_you'),
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

          const currentStatus = statusMap[req.status] || {
            text: t('medicine_review.status_unknown'),
            color: 'gray',
          };

          const status = currentStatus.text;
          const statusColor = currentStatus.color;

          return (
            <View key={`past-req-${index}`} style={styles.pastRequestItem}>
              <View style={styles.pastRequestRow}>
                <Text style={styles.pastRequestLabel}>
                  {t('medicine_review.issued_date')}:
                </Text>
                <Text style={styles.pastRequestValue}>
                  {req?.requested_at
                    ? moment(req?.requested_at).format('MMM D, YYYY')
                    : t('medicine_review.not_available')}
                </Text>
              </View>

              <View style={styles.pastRequestRow}>
                <Text style={styles.pastRequestLabel}>{t('medicine_review.duration')}:</Text>
                <Text style={styles.pastRequestValue}>{duration}</Text>
              </View>

              <View style={styles.pastRequestRow}>
                <Text style={styles.pastRequestLabel}>{t('status')}:</Text>
                <Text style={[styles.pastRequestValue, { color: statusColor }]}>{status}</Text>
              </View>

              <View style={styles.pastRequestRow}>
                <Text style={styles.pastRequestLabel}>{t('medicine_review.doctor')}:</Text>
                <Text style={styles.pastRequestValue}>
                  {req.doctor_name || t('medicine_review.not_available')}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  const handleApprove = () => {
    setShowApproveModal(true);
  };

  const handleReject = () => {
    setShowRejectModal(true);
  };

  const confirmApproval = async () => {
    try {
      if (!approvalNote.trim()) {
        Alert.alert(t('error'), t('medicine_review.approval_notes_error'));
        return;
      }

      setLoading(true);
      const token = await getToken();
      if (!token) {
        throw new Error(t('medicine_review.auth_error'));
      }

      const payload = {
        request_id: request.id.toString(),
        doctor_approval_notes: approvalNote
      };

      const response = await fetch(`${BASE_URL}/medicine-requests/approve/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || t('medicine_review.approval_failed'));
      }

      Toast.show(t('medicine_review.approval_success'), Toast.LONG);
      setIsApproved(true);
      setIsRejected(false);
      setShowApproveModal(false);
      navigation.goBack();
    } catch (error) {
      console.error(t('medicine_review.approval_error'), error);
      Alert.alert(t('error'), error.message || t('medicine_review.approval_failed'));
    } finally {
      setLoading(false);
    }
  };

  const confirmRejection = async () => {
    try {
      if (!rejectionNote.trim()) {
        Alert.alert(t('error'), t('medicine_review.rejection_reason_error'));
        return;
      }

      setLoading(true);
      const token = await getToken();
      if (!token) {
        throw new Error(t('medicine_review.auth_error'));
      }

      const payload = {
        request_id: request.id.toString(),
        rejection_reason: rejectionNote
      };

      console.log("payload", payload);

      const response = await fetch(`${BASE_URL}/medicine-requests/reject/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || t('medicine_review.rejection_failed'));
      }

      Toast.show(t('medicine_review.rejection_success'), Toast.LONG);
      setIsRejected(true);
      setIsApproved(false);
      setShowRejectModal(false);
      navigation.goBack();
    } catch (error) {
      console.error(t('medicine_review.rejection_error'), error);
      Alert.alert(t('error'), error.message || t('medicine_review.rejection_failed'));
    } finally {
      setLoading(false);
    }
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
      {/* Header */}
      <SafeAreaView edges={['top']} style={{ backgroundColor: '#f8fafc' }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#0d141c" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('medicine_review.title')}</Text>
          <View style={{ width: 24 }} />
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Patient Information */}
        <Text style={styles.sectionTitle}>{t('medicine_review.patient_info')}</Text>
        <View style={styles.patientInfoContainer}>
          {request?.photo_url ? (
            <ImageBackground
              source={{ 
                uri: `${BASE_URL}${request?.photo_url.replace(/^\/api/, '')}`
              }} 
              resizeMode='contain'
              style={styles.patientImage}
              imageStyle={{ borderRadius: 28 }}
            />
          ) : (
            <ImageBackground
              source={require('../../assets/images/profile.png')}
              resizeMode='contain'
              style={styles.patientImage}
              imageStyle={{ borderRadius: 28 }}
            />
          )}
          <View style={styles.patientTextContainer}>
            <Text style={styles.patientName}>{request.user_name}</Text>
            <Text style={styles.patientAge}>{t('medicine_review.age', { years: 35 })}</Text>
          </View>
        </View>

        {/* Prescription Files Section */}
        <Text style={styles.sectionTitle}>{t('medicine_review.prescription_files')}</Text>
        {fileUrls.length > 0 ? (
          <>
            <FlatList
              data={fileUrls}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={renderFileItem}
              keyExtractor={(item, index) => `file-${index}`}
              contentContainerStyle={styles.filesList}
            />
            {renderFileViewer()}
          </>
        ) : (
          <Text style={styles.noFilesText}>{t('medicine_review.no_prescription')}</Text>
        )}

        {/* Prescription Details */}
        <Text style={styles.sectionTitle}>{t('medicine_review.prescription_details')}</Text>
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{t('medicine_review.issued_date')}</Text>
            <Text style={styles.detailValue}>{moment(request.requested_at.split('T')[0]).format("MMMM D, YYYY")}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{t('medicine_review.requested_duration')}</Text>
            <Text style={styles.detailValue}>{formatDuration(request.medicine_duration)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{t('medicine_review.delivery_address')}</Text>
            <Text style={styles.detailValue}>{request?.delivery_address}</Text>
          </View>
        </View>

        {/* Past Requests */}
        <Text style={styles.sectionTitle}>{t('medicine_review.past_requests')}</Text>
        {renderPastRequests()}
        {visibleCount < pastRequests.length && (
          <TouchableOpacity 
            style={{ padding: 4, alignItems: 'center' }} 
            onPress={() => setVisibleCount(prev => prev + 4)}
          >
            <Text style={{ color: Colors.darkBlue, fontWeight: '600' }}>
              {t('medicine_review.load_more')}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {request?.status === "assigned_to_doctor" && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.rejectButton, isRejected && styles.activeButton]}
            onPress={handleReject}
          >
            <Text style={[styles.buttonText, styles.rejectButtonText]}>{t('medicine_review.reject')}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, styles.approveButton, isApproved && styles.activeButton]}
            onPress={handleApprove}
          >
            <Text style={[styles.buttonText, styles.approveButtonText]}>{t('medicine_review.approve')}</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Approval Modal */}
      <Modal
        visible={showApproveModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowApproveModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity 
              style={styles.modalCloseButton}
              onPress={() => setShowApproveModal(false)}
            >
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
            
            <Text style={styles.modalTitle}>{t('medicine_review.approval_notes_title')}</Text>
            <TextInput
              style={styles.modalNotesInput}
              placeholder={t('medicine_review.approval_notes_placeholder')}
              multiline
              numberOfLines={4}
              value={approvalNote}
              onChangeText={setApprovalNote}
            />
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowApproveModal(false)}
              >
                <Text style={styles.modalButtonText}>{t('cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]}
                onPress={confirmApproval}
                disabled={!approvalNote.trim()}
              >
                <Text style={{...styles.modalButtonText, color: 'white'}}>{t('confirm')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Rejection Modal */}
      <Modal
        visible={showRejectModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowRejectModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity 
              style={styles.modalCloseButton}
              onPress={() => setShowRejectModal(false)}
            >
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
            
            <Text style={styles.modalTitle}>{t('medicine_review.rejection_reason_title')}</Text>
            <TextInput
              style={styles.modalNotesInput}
              placeholder={t('medicine_review.rejection_reason_placeholder')}
              multiline
              numberOfLines={4}
              value={rejectionNote}
              onChangeText={setRejectionNote}
            />
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowRejectModal(false)}
              >
                <Text style={styles.modalButtonText}>{t('cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]}
                onPress={confirmRejection}
                disabled={!rejectionNote.trim()}
              >
                <Text style={{...styles.modalButtonText, color: 'white'}}>{t('confirm')}</Text>
              </TouchableOpacity>
            </View>
          </View>
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
  patientInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f8fafc',
  },
  patientImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 16,
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
  patientAge: {
    fontSize: 14,
    color: '#49739c',
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
  pdfViewerContainer: {
    height: 500,
    width: '100%',
    marginVertical: 8,
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
    paddingVertical: 20,
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
  },
  pastRequestsContainer: {
    paddingHorizontal: 16,
  },
  pastRequestItem: {
    borderTopWidth: 1,
    borderTopColor: '#cedbe8',
    paddingVertical: 12,
    marginBottom: 8,
  },
  pastRequestRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  pastRequestLabel: {
    fontSize: 14,
    color: '#49739c',
    width: '30%',
  },
  pastRequestValue: {
    fontSize: 14,
    color: '#0d141c',
    width: '70%',
    textAlign: 'right',
  },
  noPastRequestsText: {
    textAlign: 'center',
    padding: 16,
    color: '#666',
  },
  noFilesText: {
    textAlign: 'center',
    padding: 16,
    color: '#666',
  },
  loadingContainer: {
    padding: 16,
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#f8fafc',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  button: {
    flex: 1,
    borderRadius: 8,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  approveButton: {
    backgroundColor: Colors.darkBlue,
    marginLeft: 8,
  },
  rejectButton: {
    backgroundColor: '#e7edf4',
    marginRight: 8,
  },
  activeButton: {
    borderWidth: 2,
    borderColor: '#0d141c',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  approveButtonText: {
    color: 'white',
  },
  rejectButtonText: {
    color: '#0d141c',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: Colors.darkBlue,
  },
  modalNotesInput: {
    borderWidth: 1,
    borderColor: '#cedbe8',
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 15,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#e7edf4',
  },
  confirmButton: {
    backgroundColor: Colors.darkBlue,
  },
  modalButtonText: {
    fontWeight: 'bold',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
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

export default MedicineReview;