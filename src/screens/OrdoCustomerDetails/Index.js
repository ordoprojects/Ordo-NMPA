import React, { useRef, useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  FlatList,
  ActivityIndicator,
  Linking
} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import Ionicons from "react-native-vector-icons/Ionicons";
import Octicons from "react-native-vector-icons/Octicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Colors from "../../constants/Colors";
import LinearGradient from "react-native-linear-gradient";
import { TextInput as TextInput1 } from "react-native-paper";
import { AuthContext } from "../../Context/AuthContext";
import Toast from "react-native-simple-toast";
import { locationPermission } from "../../utils/Helper";
import Geolocation from "react-native-geolocation-service";
import { ProgressBar } from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";
import moment from "moment";

const OrdoCustomerDetails = ({ navigation, route }) => {
  const { data } = route.params;
  const { screenid } = route.params;
  console.log("🚀 ~ OrdoCustomerDetails ~ screenid:", screenid)

  const [modelVisible, setModelVisible] = useState(false);
  const [remarks, setRemarks] = useState("");
  const { userData } = useContext(AuthContext);
  const [lattitude, setLattitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [error, setError] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [color, setColor] = useState("#4b0482");
  const [progress, setProgress] = useState(0.1);

  useEffect(() => {
    checkPermission();
    getProgressAndColor(data?.due_amount, 10000);
  }, []);

  const makePhoneCall = (phoneNumber) => {
    if (phoneNumber) {
      Linking.openURL(`tel:${phoneNumber}`);
    } else {
      Toast.show("Phone number is not available", Toast.LONG);
    }
  };

  console.log("data---->",data)

  const getProgressAndColor = (dueAmount, creditLimit) => {
    const LOW = creditLimit / 3;
    const MID = creditLimit / 2;
    const HIGH = creditLimit;

    if (dueAmount <= LOW) {
      setProgress(0.2);
      setColor("green");
    } else if (dueAmount <= MID) {
      setProgress(0.5);
      setColor("green");
    } else if (dueAmount <= HIGH) {
      setProgress(0.7);
      setColor("orange");
    } else {
      setProgress(1);
      setColor("#FA5F55");
    }
  };


  const renderItem = ({ item }) => {
    const currentDate = moment();
    const dueDate = moment(item.due_date, "DD-MM-YYYY");
    const isDueDateExceeded = currentDate.isAfter(dueDate);

    return (
      <View style={styles.stepDetails}>
        <View
          style={{
            backgroundColor: Colors.white,
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            borderRadius: 9,
          }}
        >
          <View style={styles.box23}>
            <Text
              style={{
                fontFamily: "AvenirNextCyr-Medium",
                color: "white",
                fontSize: 15,
              }}
            >
              INVOICE
            </Text>
            <Text
              style={{
                fontFamily: "AvenirNextCyr-Bold",
                color: "white",
                fontSize: 15,
              }}
            >
            {item?.order_name?.replace("SO-", "")}
            </Text>
          </View>

          <View style={{ flexDirection: "column", flex: 1 }}>
            <Text style={styles.stepText1}>Order ID: {item?.order_name}</Text>

            <Text style={styles.stepDate}>
              Invoice date: {item?.invoice_date}
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginRight: "4%",
              }}
            >
              <Text
                style={[
                  styles.stepDate,
                  isDueDateExceeded && styles.exceededDueDate,
                ]}
              >
                Due Date: {item?.due_date}
              </Text>
              <Text style={styles?.amount}>
                     {item?.pending_amount ? 
                     new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(item?.pending_amount) : 
                     new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(0)
                     }
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "App Location Permission",
          message: "App needs access location",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use location ride");
      } else {
        console.log("location permission denied");
      }
    } catch (err) {
      console.warn("location permission error", err);
    }
  };

  const checkPermission = async () => {
    let PermissionGranted = await locationPermission();
    if (PermissionGranted) {
      console.log("location permssion granted");
      Geolocation.getCurrentPosition(
        (res) => {
          setLattitude(res.coords.latitude);
          setLongitude(res.coords.longitude);
        },
        (error) => {
          console.log("get location error", error);
          console.log("please enable location ");
          requestLocationPermission();
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    } else {
      console.log("location permssion denied");
    }
  };

  const RecordVisit = async () => {
    if (!remarks) {
      setError("Please enter the remarks");
      return;
    }

    if (!lattitude && !longitude) {
      setError("Location permission is required to record a visit.");
      return;
    }

    setIsUpdating(true);
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${userData?.token}`);

    var raw = JSON.stringify({
      remarks: remarks,
      latitude: lattitude,
      longitude: longitude,
      ordo_user: userData.id,
      customer: data.account_id,
    });

    console.log("raw", raw);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    try {
      const response = await fetch(
        "https://gsidev.ordosolution.com/api/customer_record_visit/",
        requestOptions
      );
      const result = await response.json();
      Toast.show("Record Saved successfully", Toast.LONG);
      setModelVisible(false);
      setIsUpdating(false);
      setRemarks("");
      setError("");
    } catch (error) {
      setIsUpdating(false);
      console.log("error", error);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={Colors.linearColors}
        start={Colors.start}
        end={Colors.end}
        locations={[0.003, 0.9, 0.9]}
        style={{
          flex: 1,
          position: "absolute",
          height: "20%",
          top: 0,
          width: "100%",
          borderBottomLeftRadius: 50,
        }}
      ></LinearGradient>

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ paddingLeft: 10 }}
        >
          <Image
            source={require("../../assets/images/Refund_back.png")}
            style={{ height: 30, width: 30 }}
          />
        </TouchableOpacity>
        <Text style={styles.title}>Customer Details</Text>
        <TouchableOpacity
          style={{
            backgroundColor: Colors.white,
            padding: "1.5%",
            marginRight: "3%",
            borderRadius: 8,
          }}
          onPress={() => {
            navigation.navigate("VisitRecord", {
              CustomerId: data?.account_id,
            });
          }}
        >
          <Octicons name="history" size={23} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <View
        style={{
          backgroundColor: Colors.white,
          elevation: 5,
          marginHorizontal: "3%",
          padding: "3%",
          borderRadius: 15,
          marginTop: "4%",
        }}
      >
        <View style={{ flexDirection: "row", gap: 10 }}>
          <View style={styles.profileContainer}>
            {data?.profile_picture ? (
              <Image
                source={{ uri: data?.profile_picture }}
                style={{ ...styles.profileImage }}
              />
            ) : (
              <Image
                source={require("../../assets/images/doctor.jpg")}
                style={{ ...styles.profileImage }}
              />
            )}
          </View>
          <View style={{ flexDirection: "column", width: "75%" }}>
            <View style={{ flexDirection: "row",justifyContent:'space-between'}}>
             <Text style={styles.text2}>{data.name}</Text>
            </View>
            {data?.gst &&
            <Text style={styles.text1}>GST:{data?.gst}</Text>
            }
          </View>
        </View>

        <View
          style={{ flexDirection: "column", width: "90%", marginTop: "3%" }}
        >
          {data?.alternative_number && (
            <TouchableOpacity
              style={{ flexDirection: "row", gap: 3, alignItems: "center" }}
              onPress={() => makePhoneCall(data?.alternative_number)}
            >
              <Ionicons name="call-sharp" size={18} color={Colors.primary} />
              <Text style={styles.text}>{data?.alternative_number}</Text>
            </TouchableOpacity>
          )}
            {data?.phone_number && (
            <TouchableOpacity
              style={{ flexDirection: "row", gap: 3, alignItems: "center" }}
              onPress={() => makePhoneCall(data?.phone_number)}
            >
              <Ionicons name="call-sharp" size={18} color={Colors.primary} />
              <Text style={styles.text}>{data?.phone_number}</Text>
            </TouchableOpacity>
          )}
          {data.email && (
            <View
              style={{ flexDirection: "row", gap: 4, alignItems: "center" }}
            >
              <Ionicons name="mail" size={17} color={Colors.primary} />
              <Text style={styles.text}>{data.email}</Text>
            </View>
          )}
          <View
            style={{
              flexDirection: "row",
              gap: 3,
              alignItems: "center",
              marginLeft: "-0.6%",
            }}
          >
            <Ionicons name="location-sharp" size={21} color={Colors.primary} />
            <Text style={styles.text22}>
              {data.client_address}, {data.country} {data.state} -{" "}
              {data.postal_code}
            </Text>
          </View>
        </View>

        <View
          style={{
            height: 1,
            width: "100%",
            marginVertical: "3%",
            backgroundColor: "#F2F2F2",
          }}
        ></View>

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={styles.detailsBox1}>
            <View
              style={{
                flexDirection: "row",
                gap: 8,
                alignItems: "center",
              }}
            >
              <View style={styles.box}>
                <AntDesign name="calendar" size={30} color="#e79a4a" />
              </View>
              <View style={{ flexDirection: "column" }}>
                <Text style={styles.Balance}>Last Payment</Text>
                <Text style={styles.Balance1}>
                  {data.last_payment_date ? data.last_payment_date : "N/A"}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.detailsBox1}>
            <View
              style={{
                flexDirection: "row",
                gap: 8,
                alignItems: "center",
              }}
            >
              <View style={styles.box1}>
                <AntDesign name="shoppingcart" size={30} color="#4abfbd" />
              </View>
              <View style={{ flexDirection: "column" }}>
                <Text style={styles.Balance}>Last Order</Text>
                <Text style={styles.Balance1}>
                  {data.last_order_date ? data.last_order_date : "N/A"}
                </Text>
              </View>
            </View>
          </View>
        </View>
        { data.due_amount !== "0.00"  && (
          <>
            <ProgressBar
              progress={progress}
              color={color}
              style={{ height: 8, borderRadius: 5, marginTop: "5%" }}
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: "1%",
              }}
            >
              <Text style={{ color: progress === 1 ? "#FA5F55" : "black" }}>
                {progress === 1
                  ? "Customer Credit Limit is Exceeded"
                  : "Total Payment Due Amount"}
              </Text>
              <Text style={{ color: progress === 1 ? "#FA5F55" : "black" }}>
                {data.due_amount ? 
         new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(data.due_amount) : 
         new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(0)
       }
              </Text>
            </View>
          </>
        )}
      </View>

      <View
        style={{
          height: 1.5,
          width: "100%",
          backgroundColor: "white",
          marginTop: "4%",
        }}
      ></View>

      {data?.pending_invoices.length > 0 && (
        <Text style={styles.transitionTitle}>Pending Invoice</Text>
      )}
      <ScrollView>
        <View style={styles.transitionHistoryContainer}>
          {data?.pending_invoices.length > 0 ? (
            <FlatList
              data={data?.pending_invoices}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
            />
          ) : (
            <Text
              style={{
                alignSelf: "center",
                justifyContent: "center",
                marginTop: "10%",
                color:Colors.black
              }}
            >
              No Pending Invoice
            </Text>
          )}
        </View>
      </ScrollView>

      <View
        style={{
          flexDirection: "row",
          backgroundColor: Colors.white,
          paddingHorizontal: "3%",
          paddingVertical: "4%",
          justifyContent: "center",
          elevation: 10,
          gap: 8,
        }}
      >
        <TouchableOpacity
          style={styles.Visit}
          onPress={() => {
            setModelVisible(true);
          }}
        >
          <Text style={styles.btnText1}>Record Visit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.Order}
          onPress={() => {
            navigation.navigate("SalesOrder", {
              screen: "SalesOrder",
              screenid: screenid,
            });
          }}
        >
          <Text style={styles.btnText}>Create Order</Text>
        </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modelVisible}
        onRequestClose={() => {
          setModelVisible(false);
        }}
      >
        <View
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            flex: 1,
            justifyContent: "center",
          }}
        >
          <View style={styles.view1}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text
                style={{ fontFamily: "AvenirNextCyr-Medium", fontSize: 19,  color:Colors.black }}
              >
                Add Remarks
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setModelVisible(false);
                  setError("");
                }}
                style={styles.close}
              >
                <AntDesign name="close" color="black" size={20} />
              </TouchableOpacity>
            </View>
            <View>
              <TextInput1
                mode="outlined"
                label="Remarks"
                value={remarks}
                theme={{ colors: { onSurfaceVariant: "#4b0482" } }}
                activeOutlineColor="#4b0482"
                outlineColor="#B6B4B4"
                textColor="#4b0482"
                multiline={true}
                numberOfLines={4}
                onChangeText={(text) => setRemarks(text)}
                returnKeyType="next"
                blurOnSubmit={false}
                outlineStyle={{ borderRadius: 10 }}
                style={{ height: 150 }}
              />
            </View>
            {error && <Text style={{ color: "red" }}>{error}</Text>}
            <LinearGradient
              colors={Colors.linearColors}
              start={Colors.start}
              end={Colors.end}
              locations={Colors.ButtonsLocation}
              style={{
                borderRadius: 20,
                marginTop: "4%",
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  RecordVisit();
                }}
                style={{
                  paddingVertical: "4%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {isUpdating ? (
                  <ActivityIndicator size={28} color={Colors.white} />
                ) : (
                  <Text
                    style={{ fontFamily: "AvenirNextCyr-Bold", color: "white" }}
                  >
                    Submit
                  </Text>
                )}
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f3f9",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    marginLeft: "3%",
    marginTop: "5%",
    justifyContent: "space-between",
  },
  backButton: {
    justifyContent: "center",
    alignItems: "center",
    padding: "1.5%",
    backgroundColor: Colors.white,
    borderRadius: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.white,
  },
  profileContainer: {
    aligndatas: "center",
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 15,
    backgroundColor: "lightgray",
    paddingHorizontal: "3%",
    paddingVertical: "3%",
    borderWidth: 1,
    borderColor: "gray",
    resizeMode: "contain",
  },
  profileText: {
    marginTop: "3%",
    fontSize: 23,
    fontWeight: "bold",
    marginVertical: "3%",
    color: Colors.primary,
  },
  detailContainer: {
    flexDirection: "row",
    aligndatas: "center",
    paddingHorizontal: "6%",
    paddingVertical: "3%",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  label: {
    fontSize: 17,
    fontWeight: "bold",
    color: Colors.primary,
  },
  text: {
    fontSize: 15,
    color: "#636a89",
    fontFamily: "AvenirNextCyr-Medium",
    marginBottom: "1%",
  },
  text22: {
    fontSize: 15,
    color: "#636a89",
    fontFamily: "AvenirNextCyr-Medium",
  },
  text1: {
    fontSize: 15,
    color: Colors.black,
    fontFamily: "AvenirNextCyr-Medium",
  },
  text2: {
    fontSize: 18,
    color: Colors.primary,
    fontFamily: "AvenirNextCyr-Bold",
    marginBottom: "1%",
  },
  box: {
    backgroundColor: "#fbefd8",
    padding: "5%",
    borderRadius: 5,
  },
  box23: {
    backgroundColor: "#4b0482CC",
    paddingVertical: "3%",
    paddingHorizontal: "3%",
    margin: "2%",
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
  },
  box1: {
    backgroundColor: "#dbf1f1",
    padding: "5%",
    borderRadius: 5,
  },
  detailsBox1: {
    flexDirection: "row",
  },
  Balance: {
    fontSize: 13,
    color: Colors.ExtraDarkgrey,
    fontFamily: "AvenirNextCyr-Medium",
  },
  Balance1: {
    fontSize: 16,
    color: Colors.black,
    fontFamily: "AvenirNextCyr-Medium",
  },
  Visit: {
    alignItems: "center",
    height: 50,
    borderColor: Colors.primary,
    borderRadius: 17,
    padding: 5,
    width: "48%",
    justifyContent: "center",
    borderWidth: 2,
    backgroundColor: Colors.white,
  },
  Order: {
    alignItems: "center",
    height: 50,
    backgroundColor: Colors.primary,
    borderRadius: 17,
    padding: 5,
    width: "48%",
    justifyContent: "center",
  },
  btnText: {
    fontSize: 18,
    color: Colors.white,
    fontFamily: "AvenirNextCyr-Bold",
  },
  btnText1: {
    fontSize: 18,
    color: Colors.primary,
    fontFamily: "AvenirNextCyr-Bold",
  },
  close: {
    backgroundColor: "#F2F2F2",
    borderRadius: 19,
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "2%",
  },
  view1: {
    backgroundColor: "white",
    padding: "4%",
    borderRadius: 15,
    marginHorizontal: "4%",
  },
  transitionHistoryContainer: {
    paddingHorizontal: "4%",
    borderRadius: 10,
  },
  transitionTitle: {
    fontSize: 19,
    fontFamily: "AvenirNextCyr-Medium",
    marginLeft: "4%",
    marginTop: "2%",
    marginBottom: "2%",
    color: Colors.primary,
  },
  stepContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  stepIndicator: {
    alignItems: "center",
    marginRight: "3%",
  },
  stepCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#ccc",
    backgroundColor: "#ccc",
  },
  stepCircleCompleted: {
    backgroundColor: "#ccc",
  },
  verticalLine: {
    width: 3,
    height: 40,
    backgroundColor: "#ccc",
    marginTop: 2,
  },
  stepDetails: {
    flex: 1,
    marginBottom: "3%",
  },
  stepText: {
    fontSize: 14,
    fontFamily: "AvenirNextCyr-Medium",
    color: Colors.black,
  },
  stepText1: {
    fontSize: 15,
    fontFamily: "AvenirNextCyr-Medium",
    color: Colors.black,
  },
  stepDate: {
    fontSize: 14,
    color: "#666",
    fontFamily: "AvenirNextCyr-Medium",
  },
  exceededDueDate: {
    fontSize: 14,
    color: "#FA5F55",
    fontFamily: "AvenirNextCyr-Medium",
  },
  amount: {
    fontSize: 14,
    color: "green",
    fontFamily: "AvenirNextCyr-Medium",
  },
});

export default OrdoCustomerDetails;
