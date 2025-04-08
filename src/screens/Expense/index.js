import React, { useContext, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  ScrollView
} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useFocusEffect } from "@react-navigation/native";
import { AuthContext } from "../../Context/AuthContext";
import moment from "moment";
import { ProgressDialog } from "react-native-simple-dialogs";
import LinearGradient from "react-native-linear-gradient";
import Colors from "../../constants/Colors";
import { ms, hs, vs } from "../../utils/Metrics";
import { AnimatedFAB } from "react-native-paper";
import { TextInput as TextInput1, Button as Button1 } from "react-native-paper";
import { Dropdown } from "react-native-element-dropdown";
import ImageResizer from "@bam.tech/react-native-image-resizer";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { cameraPermission } from "../../utils/Helper";
import RNFS from "react-native-fs";

const Expense = ({ navigation }) => {
  const { token, dealerData, tourPlanId, userData } = useContext(AuthContext);
  console.log("tour plan id", tourPlanId);
  const [data, setData] = useState(false);
  const [noData, setNoData] = useState(false);

  const [selectedPayment, setSelectedPayment] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);


  //add payment value hooks
  const [amount, setAmount] = useState("");
  const [modeOfPayment, setModeOfPayment] = useState(null);
  const [category, setCategory] = useState(null);
  const [approvalStatus, setApprovalStatus] = useState(null);
  const [notes, setNotes] = useState("");
  const [receipt, setReceipt] = useState("");
  const [department, setDepartment] = useState("");
  const [description, setDescription] = useState("");
  const [client, setClient] = useState("");
  const [categoryDrop, setCategoryDrop] = useState([]);
  const [paymentDrop, setPaymentDrop] = useState([]);
  const [statusDrop, setStatusDrop] = useState([]);


  const [isFocus, setIsFocus] = useState(false);
  const [isFocus1, setIsFocus1] = useState(false);
  const [isFocus2, setIsFocus2] = useState(false);

  const optionData = [
    { label: "Cash", value: "Cash" },
    { label: "Cheque", value: "Cheque" },
    {
      label: "Wire Transfer/ Bank Transfer",
      value: "Wire Transfer/ Bank Transfer",
    },
  ];
  const [transactionId, setTransactionId] = useState("");
  const [base64img, setBase64img] = useState("");

  const checkPermission = async () => {
    let PermissionDenied = await cameraPermission();
    if (PermissionDenied) {
      console.log("camera permssion granted");
      handleCamera();
    } else {
      console.log("camera permssion denied");
    }
  };

  const handleCamera = async () => {
    const res = await launchCamera({
      mediaType: "photo",
    });
    console.log("response", res.assets[0].uri);
    imageResize(res.assets[0].uri, res.assets[0].type);
  };

  const handleGallery = async () => {
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
          setBase64img(`data:${type};base64,${res}`);
        });
      })
      .catch((err) => {
        console.log(" img resize error", err);
      });
  };

  const dropdownValues = async (id) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${userData.token}`);

    var raw = "";
    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    try {
      const response = await fetch(
        "https://gsidev.ordosolution.com/api/expense_list/",
        requestOptions
      );
      const result = await response.json();
      // console.log("drop res",result)
      const status = result.approval_status_values.map((brand) => {
        return {
          label: brand.label,
          value: brand.value,
        };
      });

      setStatusDrop(status);

      const payment = result.payment_method_values.map((brand) => {
        return {
          label: brand.label,
          value: brand.value,
        };
      });

      setPaymentDrop(payment);

      const category = result.category_values.map((brand) => {
        return {
          label: brand.label,
          value: brand.value,
        };
      });

      setCategoryDrop(category);


    } catch (error) {
      console.log("error", error);
    }
  };




  const addPayment = async() => {
    if (amount && modeOfPayment) {
    
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${userData.token}`);

        var raw = {
          Amount: amount,
          Category: category,
          Description: description,
          Date: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
          // Receipt: receipt,
          payment_method: modeOfPayment,
          Department: department,
          client:client,
          approval_status:approvalStatus,
          Notes:notes
        };

        if (base64img) {
          raw["Receipt"] = base64img;
        }

        var jsonString = JSON.stringify(raw);
        console.log("rawwwww", jsonString);

        var requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: jsonString,
          redirect: "follow",
        };

       await fetch("https://gsidev.ordosolution.com/api/expenses/", requestOptions)
          .then((response) => response.json())
          .then((result) => {
            console.log("resultttt", result);
              Alert.alert("Add Expense", "Data saved successfully", [
                { text: "OK", onPress: () => {setAddModalVisible(false);  getReturnHistory();} },
              ]);
          })
          .catch((error) => {
            console.log("add expense api erro", error);
          });
    } else {
      Alert.alert("Warning", "Please enter all the details");
    }
    setAmount('');
    setDescription('');
    setModeOfPayment('');
    setBase64img('');
    setCategory('');
    setDepartment('');
    setClient('');
    setApprovalStatus('');
    setNotes('');
  };

  const getReturnHistory = () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${userData.token}`);

    var raw = "";

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(
      `https://gsidev.ordosolution.com/api/expenses/`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log("expense details", result);
        setData(result);
      })
      .catch((error) => console.log("get tour plan error", error));
  };

  useFocusEffect(
    React.useCallback(() => {
      getReturnHistory();
      dropdownValues();
    }, [])
  );

  const category_values = [
    {
        "label": "Travel",
        "value": "Travel",
    },
    {
        "label": "Office",
        "value": "Office",
    },
    {
        "label": "Supplies",
        "value": "Supplies",
    },
    {
        "label": "Utilities",
        "value": "Utilities",
    }
]

const paymentMethod= [
    {
        "label": "Cash",
        "value": "Cash",
    },
    {
        "label": "Credit Card",
        "value": "Credit Card",
    },
    {
        "label": "Bank Transfer",
        "value": "Bank Transfer",
    }
];


const approval_status_values = [
    {
        "label": "Pending",
        "value": "Pending",
    },
    {
        "label": "Approved",
        "value": "Approved",
    },
    {
        "label": "Rejected",
        "value": "Rejected",
    }
]

  const renderItem = ({ item, index }) => {
    let paymentImage, backgroundColor, borderColor, textColor;

    switch (item?.mode_of_payment) {
      case "Cash":
        paymentImage = require("../../assets/images/CashPay.png");
        backgroundColor = "#EDFDF0";
        break;
      case "Wire Transfer/ Bank Transfer":
        paymentImage = require("../../assets/images/onlinePay.png");
        backgroundColor = "#FFF9E5";
        break;
      case "Cheque":
        paymentImage = require("../../assets/images/ChequePay.png");
        backgroundColor = "#E3EDFC";
        break;
      default:
        paymentImage = require("../../assets/images/CashPay.png");
        backgroundColor = "#EDFDF0";
        break;
    }


    return (
      <TouchableOpacity
        style={{ ...styles.itemContainer, borderColor: borderColor }}
        onPress={() => {
          setSelectedPayment(item);
          setModalVisible(true);
        }}
        activeOpacity={0.5}
      >
        <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
          <View
            style={{
              height: 70,
              width: 75,
              backgroundColor: backgroundColor,
              borderRadius: 10,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image source={paymentImage} style={{ height: 45, width: 45 }} />
          </View>
          <View style={styles.orderDataContainer}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={styles.title}>EXP-{item?.id}</Text>
              <Text
                style={{
                  ...styles.text,
                  fontFamily: "AvenirNextCyr-Medium",
                  color: "green",
                  fontSize: 18,
                }}
              >
                ₹ {Number(item?.Amount)}
              </Text>
            </View>
            <Text style={{ ...styles.text, fontSize: 14 }}>
              {item?.payment_method}
            </Text>
            <Text style={{ ...styles.text }}>
              {moment(item?.Date).format("DD-MM-YYYY HH:mm")}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const noDataFound = () => {
    return (
      <View style={styles.noReport}>
        <Text style={styles.noReportText}>No data found</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
         colors={Colors.linearColors}
          start={Colors.start}
          end={Colors.end}
          locations={Colors.location}
        style={{ flex: 1 }}
      >
        <View style={styles.rowContainer}>
          <View style={{ ...styles.headercontainer }}>
            {/* <View style={{ flexDirection: "row", alignItems: "center" }}> */}
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Image
                  source={require("../../assets/images/Refund_back.png")}
                  style={{ height: 30, width: 30 }}
                />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Expenses</Text>
              <Text style={styles.headerTitle}>   </Text>

            {/* </View> */}

            {/* <LinearGradient
              colors={Colors.linearColors}
              start={Colors.start}
              end={Colors.end}
              locations={Colors.location}
              style={{ borderRadius: 5 }}
            ></LinearGradient> */}
          </View>
        </View>
        <View
          style={{
            backgroundColor: "#F3F5F8",
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            flex: 1,
            padding: 10,
            elevation: 5,
            marginTop: vs(10),
          }}
        >
          {noData && noDataFound()}
          <FlatList
            data={data}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </LinearGradient>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          setSelectedPayment(null);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {selectedPayment && (
              <>
                <Image
                  source={require("../../assets/images/checkGreen.png")}
                  style={{
                    height: 65,
                    width: 65,
                    alignSelf: "center",
                    marginBottom: "0%",
                  }}
                />
                <Text style={styles.MPriceText}>
                  ₹{Number(selectedPayment?.Amount)}
                </Text>
                <Text style={styles.title}>EXP-{selectedPayment?.id}</Text>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    borderBottomColor: "#D9D9D9",
                    borderBottomWidth: 1,
                    paddingVertical: "3%",
                    marginBottom: "5%",
                    borderTopColor: "#D9D9D9",
                    borderTopWidth: 1,
                    alignItems: "center",
                    marginTop: "3%",
                  }}
                >
                  <Text style={[styles.text]}>Mode of Payment:</Text>

                  <View
                    style={{
                      backgroundColor:
                        selectedPayment?.payment_method === "Cash"
                          ? "#EDFDF0"
                          : selectedPayment?.payment_method ===
                            "Bank Transfer"
                          ? "#FFF9E5"
                          : selectedPayment?.payment_method === "Credit Card"
                          ? "#E3EDFC"
                          : "#FFFFFF",
                      borderColor:
                        selectedPayment?.payment_method === "Cash"
                          ? "#4DE365"
                          : selectedPayment?.payment_method ===
                            "Bank Transfer"
                          ? "#FFC912"
                          : selectedPayment?.payment_method === "Credit Card"
                          ? "#577FF4"
                          : "#FFFFFF",
                      borderWidth: 1,
                      borderRadius: 20,
                      paddingHorizontal: "2%",
                      paddingVertical: "2%",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={[
                        styles.text,
                        {
                          textAlign: "right",
                          color:
                            selectedPayment?.payment_method === "Cash"
                              ? "#4DE365"
                              : selectedPayment?.payment_method ===
                                "Bank Transfer"
                              ? "#FFC912"
                              : selectedPayment?.payment_method === "Credit Card"
                              ? "#577FF4"
                              : "#FFFFFF",
                        },
                      ]}
                    >
                      {selectedPayment?.payment_method}
                    </Text>
                  </View>
                </View>
        

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    borderBottomColor: "#D9D9D9",
                    borderBottomWidth: 1,
                    paddingBottom: "5%",
                    paddingVertical: "1%",
                  }}
                >
                  <Text style={styles.text}>Date & Time</Text>

                  <Text style={styles.text}>
                    {moment(selectedPayment?.Date).format(
                      "DD-MM-YYYY HH:mm:ss"
                    )}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    borderBottomColor: "#D9D9D9",
                    borderBottomWidth: 1,
                    paddingBottom: "5%",
                    paddingVertical: "3%",
                  }}
                >
                  <Text style={styles.text}>Description</Text>

                  <Text style={styles.text}>
                    {selectedPayment?.Description}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    borderBottomColor: "#D9D9D9",
                    borderBottomWidth: 1,
                    paddingBottom: "5%",
                    paddingVertical: "3%",
                  }}
                >
                  <Text style={styles.text}>Category</Text>

                  <Text style={styles.text}>
                  {selectedPayment?.Category}

                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    borderBottomColor: "#D9D9D9",
                    borderBottomWidth: 1,
                    paddingBottom: "5%",
                    paddingVertical: "3%",
                  }}
                >
                  <Text style={styles.text}>Client</Text>

                  <Text style={styles.text}>
                  {selectedPayment?.client}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    borderBottomColor: "#D9D9D9",
                    borderBottomWidth: 1,
                    paddingBottom: "5%",
                    paddingVertical: "3%",
                  }}
                >
                  <Text style={styles.text}>Department</Text>

                
                  <Text style={styles.text}>
                  {selectedPayment?.Department}
                  </Text>
                </View>


                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    borderBottomColor: "#D9D9D9",
                    borderBottomWidth: 1,
                    paddingBottom: "5%",
                    paddingVertical: "3%",
                  }}
                >
                  <Text style={styles.text}>Notes</Text>

                
                  <Text style={styles.text}>
                  {selectedPayment?.Notes}
                  </Text>
                </View>


                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    borderBottomColor: "#D9D9D9",
                    borderBottomWidth: 1,
                    paddingBottom: "5%",
                    paddingVertical: "3%",
                  }}
                >
                  <Text style={styles.text}>Status</Text>

                
                  <Text style={styles.text}>
                  {selectedPayment?.approval_status}
                  </Text>
                </View>



                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    borderBottomColor: "#D9D9D9",
                    borderBottomWidth: 1,
                    paddingBottom: "5%",
                    paddingVertical: "3%",
                  }}
                >
                  <Text style={styles.text}>Receipt</Text>

                  <Image
                  source={{ uri: selectedPayment?.Receipt }}
                  style={styles.imgStyle}
                />
                </View>

               
              </>
            )}
            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
                setSelectedPayment(null);
              }}
              style={[styles.closeButton, styles.circleButton]}
            >
              <AntDesign name="close" size={20} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={addModalVisible}
        onRequestClose={() => {
          setAddModalVisible(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={{...styles.modalView,flex:0.8}}>
              <View style={{ flex: 1, backgroundColor: "white" }}>
                <View style={{ ...styles.headercontainer }}>
                  <Text style={[styles.headerTitle,{color:Colors.primary,marginVertical:'4%',marginLeft:'29%'}]}>Add Expense</Text>
                </View>
                <ScrollView style={{ paddingHorizontal: 10 ,flex:1}}>
                  <TextInput1
                    mode="outlined"
                    label="Amount"
                    theme={{ colors: { onSurfaceVariant: "black" } }}
                    activeOutlineColor="#4b0482"
                    outlineColor="#B6B4B4"
                    textColor="black"
                    onChangeText={(text) => setAmount(text)}
                    autoCapitalize="none"
                    blurOnSubmit={false}
                    value={amount}
                    returnKeyType="done"
                    keyboardType="numeric"
                    outlineStyle={{ borderRadius: ms(10) }}
                    style={{
                      marginBottom: "2%",
                      height: 50,
                      backgroundColor: "white",
                    }}
                  />

<TextInput1
                    mode="outlined"
                    label="Description"
                    theme={{ colors: { onSurfaceVariant: "black" } }}
                    activeOutlineColor="#4b0482"
                    outlineColor="#B6B4B4"
                    textColor="black"
                    onChangeText={(text) => setDescription(text)}
                    autoCapitalize="none"
                    blurOnSubmit={false}
                    value={description}
                    returnKeyType="done"
                    multiline={true}
                    // keyboardType="numeric"
                    outlineStyle={{ borderRadius: ms(10) }}
                    style={{
                      marginBottom: "2%",
                      height: 80,
                      backgroundColor: "white",
                    }}
                  />

                  <View style={styles.dropDownContainer}>
                    <Dropdown
                      style={[
                        styles.dropdown,
                        isFocus && { borderColor: "blue" },
                      ]}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      itemTextStyle={styles.selectedTextStyle}
                      inputSearchStyle={styles.inputSearchStyle}
                      iconStyle={styles.iconStyle}
                      data={paymentDrop}
                      maxHeight={400}
                      labelField="label"
                      valueField="value"
                      placeholder={!isFocus ? "Mode Of Payment" : "..."}
                      value={modeOfPayment}
                      onFocus={() => setIsFocus(true)}
                      onBlur={() => setIsFocus(false)}
                      onChange={(item) => {
                        setModeOfPayment(item.value);
                        setIsFocus(false);
                      }}
                    />
                  </View>
               
                  <View style={{paddingLeft:'1%',marginBottom:'2%'}}>
                      <Text style={{fontFamily:"AvenirNextCyr-Medium",fontSize:16,marginBottom:'1%'}}>Receipt</Text>
                      <View style={styles.buttonview}>
                      <LinearGradient
                       colors={Colors.linearColors}
                    start={Colors.start}
                    end={Colors.end}
                    locations={Colors.ButtonsLocation}
                      style={{ borderRadius: 8}}
                    >
                        <TouchableOpacity
                          style={{ ...styles.photosContainer, paddingTop: 8 }}
                          onPress={checkPermission}
                        >
                          <AntDesign
                            name="camera"
                            size={25}
                            color={Colors.white}
                          />
                        </TouchableOpacity>
                        </LinearGradient>

                        <LinearGradient
                       colors={Colors.linearColors}
                    start={Colors.start}
                    end={Colors.end}
                    locations={Colors.ButtonsLocation}
                      style={{ borderRadius: 8 }}
                    >
                        <TouchableOpacity
                          style={styles.photosContainer}
                          onPress={handleGallery}
                        >
                          <Text style={styles.buttonText}>Gallery</Text>
                        </TouchableOpacity>
                        </LinearGradient>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "flex-end",
                          gap: 15,
                        }}
                      >
                        {base64img && modeOfPayment && (
                          <Image
                            source={{ uri: base64img }}
                            style={styles.imgStyle}
                          />
                        )}
                        {base64img && modeOfPayment && (
                          <TouchableOpacity
                            style={{ marginRight: 10, marginBottom: 5 }}
                            onPress={() => {
                              setBase64img("");
                            }}
                          >
                            <AntDesign
                              name="delete"
                              size={20}
                              color={`black`}
                            />
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>

<View style={styles.dropDownContainer}>
                    <Dropdown
                      style={[
                        styles.dropdown,
                        isFocus1 && { borderColor: "blue" },
                      ]}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      itemTextStyle={styles.selectedTextStyle}
                      inputSearchStyle={styles.inputSearchStyle}
                      iconStyle={styles.iconStyle}
                      data={categoryDrop}
                      maxHeight={400}
                      labelField="label"
                      valueField="value"
                      placeholder={!isFocus1 ? "Category" : "..."}
                      value={category}
                      onFocus={() => setIsFocus1(true)}
                      onBlur={() => setIsFocus1(false)}
                      onChange={(item) => {
                        setCategory(item.value);
                        setIsFocus1(false);
                      }}
                    />
                  </View>

                  <TextInput1
                    mode="outlined"
                    label="Department"
                    theme={{ colors: { onSurfaceVariant: "black" } }}
                    activeOutlineColor="#4b0482"
                    outlineColor="#B6B4B4"
                    textColor="black"
                    onChangeText={(text) => setDepartment(text)}
                    autoCapitalize="none"
                    blurOnSubmit={false}
                    value={department}
                    returnKeyType="done"
                    // keyboardType="numeric"
                    outlineStyle={{ borderRadius: ms(10) }}
                    style={{
                      marginBottom: "2%",
                      height: 50,
                      backgroundColor: "white",
                    }}
                  />

<TextInput1
                    mode="outlined"
                    label="Client"
                    theme={{ colors: { onSurfaceVariant: "black" } }}
                    activeOutlineColor="#4b0482"
                    outlineColor="#B6B4B4"
                    textColor="black"
                    onChangeText={(text) => setClient(text)}
                    autoCapitalize="none"
                    blurOnSubmit={false}
                    value={client}
                    returnKeyType="done"
                    // keyboardType="numeric"
                    outlineStyle={{ borderRadius: ms(10) }}
                    style={{
                      marginBottom: "2%",
                      height: 50,
                      backgroundColor: "white",
                    }}
                  />
<View style={styles.dropDownContainer}>
                    <Dropdown
                      style={[
                        styles.dropdown,
                        isFocus2 && { borderColor: "blue" },
                      ]}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      itemTextStyle={styles.selectedTextStyle}
                      inputSearchStyle={styles.inputSearchStyle}
                      iconStyle={styles.iconStyle}
                      data={statusDrop}
                      maxHeight={400}
                      labelField="label"
                      valueField="value"
                      placeholder={!isFocus2 ? "Status" : "..."}
                      value={approvalStatus}
                      onFocus={() => setIsFocus2(true)}
                      onBlur={() => setIsFocus2(false)}
                      onChange={(item) => {
                        setApprovalStatus(item.value);
                        setIsFocus2(false);
                      }}
                    />
                  </View>


<TextInput1
  mode="outlined"
  label="Notes"
  theme={{ colors: { onSurfaceVariant: "black" } }}
  activeOutlineColor="#4b0482"
  outlineColor="#B6B4B4"
  textColor="black"
  onChangeText={(text) => setNotes(text)}
  autoCapitalize="none"
  blurOnSubmit={false}
  value={notes}
  returnKeyType="done"
  textAlignVertical="top" // Set text alignment to top
  // numberOfLines={5} // Remove or set to null for multiline
  // keyboardType="numeric"
  multiline={true}
  outlineStyle={{ borderRadius: ms(10) }}
  style={{
    marginBottom: "2%",
    height: 80,
    backgroundColor: "white",
  }}
/>

               
                 
                </ScrollView>
                <View style={{ padding: 10 ,marginTop:'5%'}}>
                  <View style={styles.buttonview}>
                    <LinearGradient
                       colors={Colors.linearColors}
                    start={Colors.start}
                    end={Colors.end}
                    locations={Colors.ButtonsLocation}
                      style={{ borderRadius: 8, flex: 1 }}
                    >
                      <TouchableOpacity
                        style={styles.buttonContainer}
                        onPress={addPayment}
                      >
                        <Text style={styles.buttonText}>Add</Text>
                      </TouchableOpacity>
                    </LinearGradient>
                  </View>
                </View>
              </View>
            <TouchableOpacity
              onPress={() => {
                setAddModalVisible(false);
                setAmount('');
                setBase64img('');
                setTransactionId('');
                setModeOfPayment('');
              }}
              style={[styles.closeButton, styles.circleButton]}
            >
              <AntDesign name="close" size={20} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <AnimatedFAB
        label={"Add"}
        icon={(name = "plus")}
        color={"white"}
        style={styles.fabStyle}
        fontFamily={"AvenirNextCyr-Medium"}
        animateFrom={"right"}
        visible={true}
        onPress={() => {
          setAddModalVisible(true);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    marginHorizontal: "5%",
    marginVertical: "4%",
  },
  headercontainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "400",
    color: Colors.white,
    fontFamily: "AvenirNextCyr-Medium",
    marginLeft: "18%",
  },
  itemContainer: {
    backgroundColor: Colors.white,
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    marginHorizontal: "2%",
  },
  title: {
    fontSize: 18,
    fontFamily: "AvenirNextCyr-Medium",
    alignSelf: "center",
    color:'black'
  },
  text: {
    fontSize: 15,
    color: "#837D7D",
  },
  noReport: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noReportText: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.black,
  },
  orderDataContainer: {
    width: "73%",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: "5%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    justifyContent: "center",
    width: "90%",
  },

  MPriceText: {
    fontSize: 25,
    fontFamily: "AvenirNextCyr-Medium",
    color: Colors.black,
    marginVertical: "2%",
    alignSelf: "center",
  },
  imgStyle: {
    width: 90,
    height: 90,
    resizeMode: "cover",
    borderRadius: 8,
    marginTop: 5,
    marginBottom: 5,
  },
  closeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "lightgray",
    borderRadius: 20,
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#EFF1F5",
  },
  textStyle: {
    marginLeft: 10,
  },
  circleButton: {
    width: 35,
    height: 35,
  },
  circle: {
    width: 50,
    height: 50,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  fabStyle: {
    borderRadius: 50,
    position: "absolute",
    margin: 10,
    right: 10,
    bottom: 10,
    backgroundColor: Colors.primary,
  },
  icon: {
    marginRight: 5,
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
    fontSize: 16,
    fontFamily: "AvenirNextCyr-Medium",
    color:'black'
  },
  selectedTextStyle: {
    fontSize: 16,
    fontFamily: "AvenirNextCyr-Medium",
    color:'black'
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    color:'black'
  },
  dropDownContainer: {
    backgroundColor: "white",
    marginBottom: 10,
    marginTop: 5,
  },
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  buttonview: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap:6,
    marginTop:'2%'
  },
  buttonContainer: {
    height: 50,
    padding: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontFamily: "AvenirNextCyr-Medium",
    color: "white",
    fontSize: 16,
  },  photosContainer: {
    height: 40,
    padding: 10,
    borderRadius: 10,
    // marginVertical: 10,
    // backgroundColor: Colors.primary,
    // marginRight: 10,
  },
});

export default Expense;
