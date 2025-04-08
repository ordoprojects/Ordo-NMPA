import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Modal,
} from "react-native";
import { AuthContext } from "../../Context/AuthContext";
import LinearGradient from "react-native-linear-gradient";
import Colors from "../../constants/Colors";
import Ionicons from "react-native-vector-icons/Ionicons";
import AntDesign from "react-native-vector-icons/AntDesign";
import DatePicker from "react-native-date-picker";

const VisitRecord = ({ navigation, route }) => {
  const { CustomerId } = route.params;
  const [visit, setVisit] = useState([]);
  const [loading, setLoading] = useState(false);
  const { userData } = useContext(AuthContext);
  const [isSearching, setIsSearching] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    getVisitRecord();
  }, []);

  console.log(filteredData);

  const getVisitRecord = async () => {
    setLoading(true);
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${userData.token}`);

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      const response = await fetch(
        `https://gsidev.ordosolution.com/api/customer_record_visit/?customer=${CustomerId}`,
        requestOptions
      );

      if (!response.ok) {
        throw new Error("Error fetching data");
      }

      const result = await response.json();
      const sortedData = result.sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        return dateB - dateA;
      });
      setVisit(result);
      setFilteredData(sortedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearFilter = () => {
    setFilteredData(visit);
    setIsSearching(false);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleConfirm = () => {
    setShowDatePicker(false);
    filterData(visit, selectedDate);
    setIsSearching(true);
  };

  const filterData = (data, date) => {
    if (data.length === 0) return;

    const selectedDateStr = date.toISOString().split("T")[0];
    console.log("Selected Date:", selectedDateStr);

    const filteredData = data.filter((item) => {
      const itemDate = new Date(item.created_at).toISOString().split("T")[0];
      console.log("Item Date:", itemDate);
      return itemDate === selectedDateStr;
    });

    console.log("Filtered Data:", filteredData);
    setFilteredData(filteredData);
  };

  const renderVisitItem = ({ item }) => {
    const date = new Date(item.created_at);
    const formattedDate = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const hours = date.getHours() % 12 || 12;
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = date.getHours() >= 12 ? "PM" : "AM";
    const time = `${hours}:${minutes} ${ampm}`;

    return (
      <View style={{ flexDirection: "row", marginHorizontal: "3%" }}>
        <View style={styles.visitItem}></View>
        <View style={styles.visitItem1}>
          <View style={styles.dateContainer}>
            <Text style={styles.date}>{formattedDate}</Text>
            <Text style={styles.remarks}>{time}</Text>
          </View>
          <Text style={styles.time}>Remark: {item.remarks}</Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <LinearGradient
      colors={Colors.linearColors}
      start={Colors.start}
      end={Colors.end}
      locations={Colors.location}
      style={{ flex: 1 }}
    >
      <View style={styles.headerView}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ paddingLeft: "4%" }}
        >
          <Image
            source={require("../../assets/images/Refund_back.png")}
            style={{ height: 30, width: 30 }}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>Visit History</Text>

        <View style={{ flexDirection: "row", gap: 10, marginTop: "2%" }}>
          {!isSearching ? (
            <TouchableOpacity
              style={styles.styleBtn}
              onPress={() => {
                setShowDatePicker(true);
              }}
            >
              <Ionicons name="search" size={25} color={Colors.primary} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.styleBtn}
              onPress={() => {
                clearFilter();
              }}
            >
              <AntDesign name="close" size={25} color={Colors.primary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.whiteView}>
        {filteredData.length === 0 ? (
          <View style={styles.emptyList}>
            <Text>No visit records found.</Text>
          </View>
        ) : (
          <FlatList
            data={filteredData}
            renderItem={renderVisitItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContainer}
          />
        )}
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showDatePicker}
        onRequestClose={() => setShowDatePicker(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent1}>
            <TouchableOpacity
              style={{ alignSelf: "flex-end" }}
              onPress={() => {
                setShowDatePicker(false);
              }}
            >
              <AntDesign name="close" size={26} color="black" />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Search by Date</Text>
            <DatePicker
              date={selectedDate}
              onDateChange={handleDateChange}
              mode="date"
              textColor={Colors.primary}
            />
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={handleConfirm}
            >
              <Text style={styles.modalCancelButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: "2%",
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: "2%",
    textAlign: "center",
  },
  visitItem: {
    backgroundColor: Colors.primary,
    marginBottom: "2%",
    width: "3%",
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  visitItem1: {
    padding: "2%",
    gap: 5,
    backgroundColor: "#f2f3f9",
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    flex: 1,
    marginBottom: "2%",
  },
  date: {
    fontSize: 19,
    fontWeight: "bold",
    color: Colors.primary,
  },
  time: {
    fontSize: 16,
    marginTop: 5,
    color: "black",
  },
  remarks: {
    fontSize: 16,
    marginTop: 5,
    color: "#666",
  },
  emptyList: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  listContainer: {
    flexGrow: 1,
  },
  headerView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 60,
    paddingHorizontal: "4%",
  },
  whiteView: {
    flex: 1,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: "4%",
    paddingTop: "3%",
  },
  headerText: {
    fontFamily: "AvenirNextCyr-Bold",
    fontSize: 19,
    color: "white",
  },
  styleBtn: {
    height: 30,
    width: 30,
    backgroundColor: Colors.white,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "94%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: "2%",
    elevation: 10,
    flex: 1,
    marginVertical: "5%",
  },
  modalContent1: {
    width: "90%",
    height: "50%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: "2%",
    elevation: 10,
    marginVertical: "5%",
  },
  modalCloseButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
    backgroundColor: "#F2F2F2",
    padding: 3,
    borderRadius: 20,
  },
  modalHeader: {
    fontSize: 20,
    fontFamily: "AvenirNextCyr-Bold",
    marginBottom: "2%",
    textAlign: "center",
    color: Colors.primary,
  },
  modalContentContainer: {
    paddingBottom: "5%",
  },
  modalCancelButtonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "AvenirNextCyr-Bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalCancelButton: {
    backgroundColor: Colors.primary,
    paddingVertical: "4%",
    paddingHorizontal: "14%",
    borderRadius: 5,
    marginTop: "4%",
    elevation: 8,
  },
  modalContent1: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: "5%",
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 22,
    fontFamily: "AvenirNextCyr-Medium",
    marginTop: "-5%",
    color: Colors.primary,
    alignItems: "center",
    marginBottom: "3%",
  },
  dateContainer: {
    flexDirection: "row",
    gap: 5,
  },
  date: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.primary,
  },
  dayTime: {
    fontSize: 14,
    color: "#555",
  },
  remarks: {
    flex: 1,
    textAlign: "right",
    fontSize: 14,
    color: "#333",
  },
});

export default VisitRecord;
