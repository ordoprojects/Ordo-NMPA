import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import Colors from "../constants/Colors";
import { ScrollView } from "react-native-gesture-handler";

const Comments = ({ route, isModal, onClose }) => {
  const { userData } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [remarks, setRemarks] = useState({});
  const { orderId } = route.params;

  const getComments = async () => {
    setLoading(true);
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${userData.token}`);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    try {
      const response = await fetch(
        `https://gsidev.ordosolution.com/api/soorder_remarks/${orderId}/`,
        requestOptions
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log("🚀 ~ getComments ~ result:", result);
      setRemarks(result);
    } catch (error) {
      console.error("Fetch error: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getComments();
  }, []);

  const content = (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View>
          <Text style={styles.title}>Comments</Text>
          <View style={styles.remarksContainer}>
            <Text style={styles.label}>Sales Order Remarks:</Text>
            <Text
              style={{
                fontSize: 14,
                color: remarks.transportation_remarks ? "green" : "lightgray",
              }}
            >
              {remarks.transportation_remarks
                ? remarks.transportation_remarks
                : "No Sales Order remarks available."}
            </Text>
          </View>
          <View style={styles.remarksContainer}>
            <Text style={styles.label}>Manager Remarks:</Text>
            <Text
              style={{
                fontSize: 14,
                color: remarks.manager_remarks ? "green" : "lightgray",
              }}
            >
              {remarks.manager_remarks
                ? remarks.manager_remarks
                : "No manager remarks available."}
            </Text>
          </View>
          <View style={styles.remarksContainer}>
            <Text style={styles.label}>Collection Remarks:</Text>
            <Text
              style={{
                fontSize: 14,
                color: remarks.collection_remarks ? "green" : "lightgray",
              }}
            >
              {remarks.collection_remarks
                ? remarks.collection_remarks
                : "No collection remarks available."}
            </Text>
          </View>
          <View style={styles.remarksContainer}>
            <Text style={styles.label}>General Remarks:</Text>
            <Text
              style={{ fontSize: 14, color: remarks.remarks ? "green" : "lightgray" }}
            >
              {remarks?.remarks
                ? remarks?.remarks
                : "No general remarks available."}
            </Text>
          </View>

          <View style={styles.remarksContainer}>
            <Text style={styles.label}>Transportation Change Remarks:</Text>
            <Text
              style={{ fontSize: 14, color: remarks.tcc_remark ? "green" : "lightgray" }}
            >
              {remarks?.tcc_remark
                ? remarks?.tcc_remark
                : "No Transportation remarks available."}
            </Text>
          </View>

          <View style={styles.remarksContainer}>
            <Text style={styles.label}>Dispatch Cancel Remarks:</Text>
            <Text
              style={{ fontSize: 14, color: remarks.dispatch_cancel_order ? "green" : "lightgray" }}
            >
              {remarks?.dispatch_cancel_order
                ? remarks?.dispatch_cancel_order
                : "No Cancel remarks available."}
            </Text>
          </View>
          <View style={styles.remarksContainer}>
            <Text style={styles.label}>Closing Remarks:</Text>
            <Text
              style={{ fontSize: 14, color: remarks.closing_reason ? "green" : "lightgray" }}
            >
              {remarks?.closing_reason
                ? remarks?.closing_reason
                : "No Closing remarks available."}
            </Text>
          </View>
          <View style={styles.remarksContainer}>
            <Text style={styles.label}>Production Remarks:</Text>
            <Text
              style={{ fontSize: 14, color: remarks.production_remarks ? "green" : "lightgray" }}
            >
              {remarks?.production_remarks
                ? remarks?.production_remarks
                : "No Production remarks available."}
            </Text>
          </View>
            {userData?.user_type !== "Sales Executive" && (
            <View style={styles.remarksContainer}>
            <Text style={styles.label}>Release Stock Remarks:</Text>
            <Text
              style={{ fontSize: 14, color: remarks.dispatch_remarks ? "green" : "lightgray" }}
            >
              {remarks?.dispatch_remarks
                ? remarks?.dispatch_remarks
                : "No release stock remarks available."}
            </Text>
          </View>
           )}
        </View>
        
      )}
    </View>
  );

  if (isModal) {
    return (
      <Modal visible={true} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView>{content}</ScrollView>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>CLOSE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  } else {
    return content;
  }
};

export default Comments;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
    color: "black",
  },
  remarksContainer: {
    marginBottom: 12,
  },
  label: {
    fontWeight: "bold",
    fontSize: 16,
    color: "black",
  },
  text: {
    fontSize: 14,
    color: "#555",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 16,
    elevation: 5,
    marginHorizontal: "10%",
  },
  closeButton: {
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});
