import {
  StyleSheet,
  Text,
  View,
  BackHandler,
  Alert,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
} from "react-native";
import React, { useState, useContext, useEffect } from "react";
import Colors from "../../constants/Colors";
import AntDesign from "react-native-vector-icons/AntDesign";
import Feather from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import { Dropdown } from "react-native-element-dropdown";
import { AuthContext } from "../../Context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import { mt } from "date-fns/locale";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { cameraPermission } from "../../utils/Helper";
import ImageResizer from "@bam.tech/react-native-image-resizer";
import RNFS from "react-native-fs";
import { MultipleSelectList } from "react-native-dropdown-select-list";
import { useFocusEffect } from "@react-navigation/native";
import globalStyles from "../../styles/globalStyles";
import LinearGradient from "react-native-linear-gradient";
import { Dimensions } from "react-native";

// Get the screen height
const screenHeight = Dimensions.get("window").height;

// Calculate the card height dynamically
const cardHeight = screenHeight * 0.13;

const OrderMgmt = ({ navigation, route }) => {
  let showCustomerImage = true;

  const dataaa = [
    {
      key: "Create Order",
      image: require("../../assets/images/order2png.png"),
      screen: "SalesOrder",
      id:1
    },
    // {
    //   key: "Dispatch Order",
    //   image: require("../../assets/images/COrder.png"),
    //   screen: "DispatchVehicleList",
    // },
    {
      key: "Send Quotation",
      image: require("../../assets/images/COrder.png"),
      screen: "SalesOrder",
      id:2
    },
    {
      key: "Create Return",
      image: require("../../assets/images/CReturn.png"),
      screen: "SalesReturn",
      id:3
    },
    {
      key: "Order History",
      image: require("../../assets/images/OHistory.png"),
      screen: "AdminOrders",
      id:4
    },
    {
      key: "Return History",
      image: require("../../assets/images/RHistory.png"),
      screen: "ReturnsHistory",
      id:5
    },
  ];


  const backAction = () => {
    //checking screen is focused
    if (!navigation.isFocused()) {
      return false;
    }
    Alert.alert(
      "Hold on!",
      "Are you sure you want to go back?\nIf you leave before checkout, your data will be lost.",
      [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel",
        },
        { text: "YES", onPress: () => navigation.goBack() },
      ]
    );
    return true;
  };

  //disable back button logic
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, []);

  const { width, height } = Dimensions.get("screen");
  const [isModalVisible, setModalVisible] = useState(false);

  const backIcon = route.params?.backIcon;
  const external = route.params?.external;

  const visitDateKey = route.params?.visitDateKey;
  const tour_plan_id = route.params?.tour_plan_id;
  const Deviated_Plan_Id = route.params?.deviatedPlanId;

  const { token, checkInDocId, dealerData, changeDocId } =
    useContext(AuthContext);
  console.log("near by dealer data", dealerData);
  console.log("chakci in id", checkInDocId);
  console.log("visit date key", visitDateKey);

  useFocusEffect(
    React.useCallback(() => {
      console.log("visit date key", visitDateKey);
    }, [])
  );

  const [desc, setDesc] = useState("");

  //new
  const [value, setValue] = useState([]);
  const [isFocus, setIsFocus] = useState(false);
  //miscellaneous task hooks value
  const [mValue, setMvalue] = useState("");
  const [mtask, setMTask] = useState("");
  const [mRemarks, setMRemarks] = useState("");
  const [isModalVisible2, setModalVisible2] = useState("");
  const [isFocus2, setIsFocus2] = useState(false);
  const [base64img, setBase64img] = useState("");
  const [price, setPrice] = useState("");
  const [orderBooked, setOrderBooked] = useState("");

  const checkPermission = async () => {
    let PermissionDenied = await cameraPermission();
    if (PermissionDenied) {
      console.log("camera permssion granted");
      handleCamera();
    } else {
      console.log("camera permssion denied");
      //requestStoragePermission();
    }
  };

  const clearModalValue = () => {
    setMvalue("");
    setMRemarks("");
    setBase64img("");
    setValue([]);
    setPrice("");
    setDesc("");
  };

  const handleCamera = async () => {
    // setModalVisible1(false);
    const res = await launchCamera({
      mediaType: "photo",
    });
    console.log("response", res.assets[0].uri);
    imageResize(res.assets[0].uri, res.assets[0].type);
  };
  const handleGallery = async () => {
    // setModalVisible1(false);
    const res = await launchImageLibrary({
      mediaType: "photo",
    });
    console.log("response", res.assets[0].uri);
    imageResize(res.assets[0].uri, res.assets[0].type);
  };

  const imageResize = async (img, type) => {
    ImageResizer.createResizedImage(img, 300, 300, "JPEG", 50)
      .then(async (res) => {
        console.log("image resize", res);
        RNFS.readFile(res.path, "base64").then((res) => {
          //console.log('base64', res);
          //uploadImage(res)
          setBase64img(`data:${type};base64,${res}`);
        });
      })
      .catch((err) => {
        console.log(" img resize error", err);
      });
  };

  useEffect(() => {
    //getDealerData();
  }, []);


  const data = [
    { value: "Secondary Sales", key: "SecondarySales" },
    { value: "Gifts", key: "Gifts" },
    { value: "Sampling", key: "Sampling" },
    { value: "Misc. Task", key: "MiscTask" },
  ];

  const saveCheckOut = async () => {
    if (value.length > 0 && desc && price) {
      console.log("price", price);
      console.log("booked", orderBooked);
      console.log("custom date key", moment(new Date()).format("YYYYMMDD"));
      //formnationg purpose of visit array
      const formattedString = value.map((item) => `^${item}^`).join(",");
      console.log("formated \n ", formattedString);

      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      var raw = JSON.stringify({
        __module_code__: "PO_37",
        __query__: "",
        __name_value_list__: {
          purpose_of_visit: formattedString,
          description: desc,
          id: checkInDocId,
          check_out: moment(new Date()).format("YYYY-MM-DD hh:mm:ss"),
          tour_plan_id: tour_plan_id,
          visit_date_key: visitDateKey,
          ordered_product: orderBooked,
          last_amount_paid: price,
          order_date: moment(new Date()).format("YYYY-MM-DD hh:mm:ss"),
          external_visit: Deviated_Plan_Id ? "1" : null,
          external_visit_date_key: moment(new Date()).format("YYYYMMDD"),
        },
      });

      console.log("checkout raw", raw);

      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      await fetch(
        "https://dev.ordo.primesophic.com/set_data_s.php",
        requestOptions
      )
        .then((response) => response.json())
        .then(async (result) => {
          changeDocId("");
          console.log("checkout save res", result);
          setModalVisible(false);
          //await AsyncStorage.removeItem('activePlan')
          navigation.navigate("BottomTab");
        })
        .catch((error) => console.log("error", error));

      if (Deviated_Plan_Id) {
        var StatusRaw = JSON.stringify({
          __tp_id__: Deviated_Plan_Id,
          __status__: "1",
        });

        console.log("set deviated statuus raw", StatusRaw);

        var requestOptionsStatus = {
          method: "POST",
          headers: myHeaders,
          body: StatusRaw,
          redirect: "follow",
        };

        await fetch(
          "https://dev.ordo.primesophic.com/set_deviateplan_status.php",
          requestOptionsStatus
        )
          .then((response) => response.json())
          .then(async (res) => {
            console.log("set deviated plans result", res);
          })
          .catch((error) => console.log("error", error));
      }
    } else {
      alert("Please fill all the details");
    }
  };

 
  return (
    <LinearGradient
      colors={Colors.linearColors}
      start={Colors.start}
 end={Colors.end}
      locations={Colors.location}
      style={{
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
          height: "10%",
          alignItems: "center",
          alignContent: "center",
          textAlign: "center",
        }}
      >
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          style={{ paddingLeft: "5%" }}
        >
          <Image
            source={require("../../assets/images/Refund_back.png")}
            style={{ height: 30, width: 30 }}
          />
        </TouchableOpacity>
        <Text
          style={{
            fontFamily: "AvenirNextCyr-Medium",
            fontSize: 19,
            color: "white",
            marginRight:'7%'
          }}
        >
          Order Management
        </Text>
        <View>
          <Text> </Text>
        </View>
      </View>

      <View
        style={{
          height: "88%",
          backgroundColor: "#f5f5f5",
          width: "100%",
          borderTopEndRadius: 50,
          borderTopStartRadius: 50,
          padding: 25,
        }}
      >
        {dataaa.map((item) => (
          <TouchableOpacity
            activeOpacity={0.6}
            style={styles.recoredbuttonStyle}
            onPress={() => {
              if (item.screen !== "DispatchVehicleList") {
                navigation.navigate("CustomerList", { screen: item.screen,screenId :item.id });
              } else {
                navigation.navigate(item.screen);
              }
            }}
          >
            <Image
              style={{
                marginRight: 10,
                height: 50,
                width: 50,
                resizeMode: "contain",
              }}
              source={item.image}
            />

            <View style={{ padding: 10, flex: 1 }}>
              <Text
                style={{
                  fontFamily: "AvenirNextCyr-Medium",
                  fontSize: 18,
                  color: "#50001D",
                }}
              >
                {item.key}
              </Text>
            </View>
            {/* <AntDesign name="right" size={20} color={`#50001D`} /> */}
          </TouchableOpacity>
        ))}
        {/* </ScrollView> */}
      </View>

      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        {/* Modal content */}
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              padding: 20,
              width: "90%",
              marginHorizontal: 10,
              borderRadius: 10,
              elevation: 5,
              ...globalStyles.border,
            }}
          >
            {/* new */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <Text style={styles.modalTitle}></Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <AntDesign name="close" size={20} color={`black`} />
              </TouchableOpacity>
            </View>
            <View style={styles.dropDownContainer}>

              <MultipleSelectList
                setSelected={(val) => setValue(val)}
                data={data}
                save="key"
                placeholder="Select purpose of visit"
                label="Purpose of Visit"
                labelStyles={styles.modalTitle}
                fontFamily="AvenirNextCyr-Thin"
                badgeStyles={{ backgroundColor: Colors.primary }}
                maxHeight={250}
                closeicon={<AntDesign name="close" size={20} color={`black`} />}
              />
            </View>
            <View style={{ flexDirection: "row" }}>
              <View style={{ flex: 1 }}>
                <Text style={styles.modalTitle}>Ordered Amount (INR)</Text>
                <TextInput
                  style={styles.cNameTextInput}
                  placeholder="Ordered amount"
                  onChangeText={(text) => setPrice(text)}
                  keyboardType="numeric"
                />
              </View>

            </View>

            <Text style={styles.modalTitle}>Report</Text>
            {/* new */}
            <TextInput
              multiline={true}
              numberOfLines={10}
              placeholder="Enter Text..."
              style={styles.textarea}
              onChangeText={(val) => {
                setDesc(val);
              }}
              //onChangeText={(text) => this.setState({ text })}
              value={desc}
            />

            <View style={styles.buttonview}>
              <TouchableOpacity
                style={styles.buttonContainer}
                onPress={saveCheckOut}
              >
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>

            </View>
          </View>
        </View>
      </Modal>

      {/* miscellaneous Task  Modal */}
      <Modal visible={isModalVisible2} animationType="slide" transparent={true}>
        {/* Modal content */}
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              padding: 20,
              width: "90%",
              marginHorizontal: 10,
              borderRadius: 10,
              elevation: 5,
              ...globalStyles.border,
            }}
          >
            {/* new */}
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={{ ...styles.modalTitle, color: Colors.primary }}>
                Misc. Task
              </Text>
              <TouchableOpacity onPress={() => setModalVisible2(false)}>
                <AntDesign name="close" size={20} color={`black`} />
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            ></View>

            <View style={{ flexDirection: "row" }}>
              <View style={{ flex: 1 }}>
                <Text style={{ ...styles.modalTitle, marginBottom: 5 }}>
                  Type of Task
                </Text>
                <TextInput
                  style={styles.cNameTextInput}
                  placeholder="Type of Task"
                  onChangeText={(text) => setMTask(text)}
                />
              </View>
   
            </View>

            <View>
              <Text style={styles.modalTitle}>Upload Image</Text>
              <View style={{ ...styles.buttonview, alignItems: "center" }}>
                <TouchableOpacity
                  style={styles.photosContainer}
                  onPress={checkPermission}
                >
                  <Text style={styles.buttonText}>Camera</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.photosContainer}
                  onPress={handleGallery}
                >
                  <Text style={styles.buttonText}>Gallery</Text>
                </TouchableOpacity>
              </View>

              {base64img && (
                <Image source={{ uri: base64img }} style={styles.imgStyle} />
              )}
            </View>

            <Text style={styles.modalTitle}>Remarks</Text>
            {/* new */}
            <TextInput
              multiline={true}
              numberOfLines={10}
              placeholder="Enter Text..."
              style={styles.textarea}
              onChangeText={(val) => {
                setMRemarks(val);
              }}
              //onChangeText={(text) => this.setState({ text })}
              value={mRemarks}
            />

            <View style={styles.buttonview}>
              <TouchableOpacity style={styles.buttonContainer}>
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

export default OrderMgmt;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#f1f1f2'
    backgroundColor: "white",
  },
  row1View: {
    //marginHorizontal: 50,
    paddingHorizontal: 15,
    marginTop: 10,
    marginBottom: 10,
    flexDirection: "column",
    alignContent: "center",
    justifyContent: "center",
  },
  row2View: {
    paddingHorizontal: 30,
    // marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  orderView: {
    marginRight: 20,
  },
  checkOutView: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginRight: 10,
    //paddingHorizontal: 10,
    alignItems: "center",
    //backgroundColor:'red',
    marginLeft: 3,
    marginTop: 10,
  },
  recoredbuttonStyle: {
    // flex:1,
    borderRadius: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    marginHorizontal: 5,
    shadowRadius: 2,
    elevation: 5,
    ...globalStyles.border,
    height: 100,
    // width: 118,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 10,
    marginBottom: 10,
    marginTop: 8,
    flexDirection: "row",
    padding: 20,
  },
  createPlanBtn: {
    height: 40,
    //width:40,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary,
    borderRadius: 10,
  },
  buttonTextStyle: {
    color: "#fff",
    fontFamily: "AvenirNextCyr-Medium",
  },
  buttonview: {
    flexDirection: "row",
  },
  buttonContainer: {
    heigh: 40,
    padding: 10,
    borderRadius: 10,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    //marginRight: 10,
    marginVertical: 10,
    backgroundColor: Colors.primary,
  },
  buttonText: {
    fontFamily: "AvenirNextCyr-Thin",
    color: "white",
  },
  modalTitle: {
    fontSize: 16,
    color: "black",
    fontFamily: "AvenirNextCyr-Medium",
  },
  textarea: {
    borderWidth: 0.5,
    borderColor: "black",
    //margin: 15,
    marginTop: 5,
    borderRadius: 5,
    padding: 10,
    fontSize: 14,
    fontFamily: "AvenirNextCyr-Thin",
    textAlignVertical: "top",
    color: "#000",
  },
  dropDownContainer: {
    backgroundColor: "white",
    marginBottom: 10,
    //padding: 16,
    //backgroundColor:'red'
  },
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  photosContainer: {
    height: 40,
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
    backgroundColor: Colors.primary,
    marginRight: 10,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 14,
    fontFamily: "AvenirNextCyr-Thin",
  },
  selectedTextStyle: {
    fontSize: 16,
    fontFamily: "AvenirNextCyr-Thin",
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  title: {
    marginVertical: 10,
    paddingHorizontal: 36,
    fontSize: 18,
    fontFamily: "AvenirNextCyr-Medium",
    color: "black",
  },
  contentView: {
    color: "black",
    fontSize: 12,
    fontFamily: "Poppins-Italic",
    //fontStyle:'italic'
  },
  checkOutButton: {
    height: 50,
    margin: 10,
    // backgroundColor:'red',
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    backgroundColor: Colors.primary,
  },
  checkOutText: {
    fontFamily: "AvenirNextCyr-Medium",
    color: "#fff",
    fontSize: 16,
  },
  modalTitle: {
    fontSize: 16,
    color: "black",
    fontFamily: "AvenirNextCyr-Medium",
  },
  cNameTextInput: {
    height: 40,
    borderWidth: 1,
    borderColor: "#B3B6B7",
    padding: 5,
    fontFamily: "AvenirNextCyr-Thin",
    marginBottom: 10,
  },
  imgStyle: {
    width: 90,
    height: 90,
    resizeMode: "cover",
    borderRadius: 8,
    marginTop: 5,
    marginBottom: 5,
  },
  elementsView: {
    paddingVertical: 10,
    backgroundColor: "white",
    margin: 20,
    marginBottom: 15,
    padding: 8,

  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "gray",
  },
  recoredbuttonStyle: {
    // flex:1,
    borderBottomStartRadius: 25,
    borderTopEndRadius: 25,
    // borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    //  marginHorizontal: 5,
    shadowRadius: 2,
    elevation: 5,
    ...globalStyles.border,
    height: cardHeight,
    // width: 118,
    // flex:1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 25,
    // marginTop: 5,
    flexDirection: "row",
    padding: 20,
  },
});
