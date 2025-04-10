import React, { useContext, useState, useEffect, useCallback } from "react";
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
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { useFocusEffect } from "@react-navigation/native";
import { AuthContext } from "../../Context/AuthContext";
import moment from "moment";
import { ProgressDialog } from "react-native-simple-dialogs";
import LinearGradient from "react-native-linear-gradient";
import Colors from "../../constants/Colors";
import { ms, hs, vs } from "../../utils/Metrics";
import { AnimatedFAB } from "react-native-paper";
import { TextInput as TextInput1, Button as Button1, RadioButton } from "react-native-paper";
import { Dropdown } from "react-native-element-dropdown";
import ImageResizer from "@bam.tech/react-native-image-resizer";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { cameraPermission } from "../../utils/Helper";
import RNFS from "react-native-fs";
import Credit from "./Credit";
import Debit from "./Debit";

const MemoizedCredit = React.memo(Credit);
const MemoizedDebit = React.memo(Debit);

const CreditNotes = ({ navigation }) => {
  const { token, dealerData, tourPlanId, userData } = useContext(AuthContext);
  console.log("tour plan id", tourPlanId);
  const [loading, setLoading] = useState(false);
  const [creditNotes, setCreditNotes] = useState(false);
  const [debitNotes, setDebitNotes] = useState(false);

  const [noData, setNoData] = useState(false);

  const [selectedPayment, setSelectedPayment] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState("sales");


  //add payment value hooks
  const [amount, setAmount] = useState("");
  const [invoiceId, setInvoiceId] = useState('');

  const [description, setDescription] = useState("");
  const [client, setClient] = useState("");

  const [isFocus, setIsFocus] = useState(false);

  const [tabIndex, setTabIndex] = React.useState(0);

  const [base64img, setBase64img] = useState("");

  const [accSalesDrop, setAccSalesDrop] = useState([]);
  const [accPurchaseDrop, setAccPurchaseDrop] = useState([]);


  const handleSelect = (option) => {
    setSelectedOption(option);
  };



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

  const getDropdownList = async (id) => {
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
      // First API call
      const salesResponse = await fetch(
        "https://gsidev.ordosolution.com/api/acc_sales/",
        requestOptions
      );
      const salesResult = await salesResponse.json();
      const salesStatus = salesResult.map((sales) => {
        return {
          label: `Invoice - ${sales.invoice}`,
          value: sales.id,
        };
      });

      // Second API call
      const purchasesResponse = await fetch(
        "https://gsidev.ordosolution.com/api/acc_purchase/",
        requestOptions
      );
      const purchasesResult = await purchasesResponse.json();
      const purchasesStatus = purchasesResult.map((purchase) => {
        return {
          label: `Invoice - ${purchase.invoice}`,
          value: purchase.id,
        };
      });

      // Combine the results from both APIs if needed
      // const combinedStatus = [...salesStatus, ...purchasesStatus];

      // Update the state with the combined results
      setAccSalesDrop(salesStatus);
      setAccPurchaseDrop(purchasesStatus);

      // Optionally log the combined results
      // console.log("drop res", combinedStatus);

    } catch (error) {
      console.log("error", error);
    }
  };


  // const dropdownPurchaseValues = async (id) => {
  //   var myHeaders = new Headers();
  //   myHeaders.append("Authorization", `Bearer ${userData.token}`);

  //   var raw = "";
  //   var requestOptions = {
  //     method: "GET",
  //     headers: myHeaders,
  //     body: raw,
  //     redirect: "follow",
  //   };

  //   try {
  //     const response = await fetch(
  //       "https://gsidev.ordosolution.com/api/acc_purchase/",
  //       requestOptions
  //     );
  //     const result = await response.json();
  //     const status = result.map((brand) => {
  //       return {
  //         label: `Invoice - ${brand.invoice}`,
  //         value: brand.id,
  //       };
  //     });

  //     setPurchaseDrop(status);
  //     // console.log("drop pur res",status)

  //   } catch (error) {
  //     console.log("error", error);
  //   }
  // };




  const addNote = async () => {

    if (description && invoiceId && amount) {

      let url = tabIndex == 0 ? `https://gsidev.ordosolution.com/api/creditnotes/` : `https://gsidev.ordosolution.com/api/debitnotes/`
      let AlertTitle = tabIndex == 0 ? `Credit Note` : `Debit Note  `
      let AlertMessage = tabIndex == 0 ? `Credit note added succesfully` : `Debit note added succesfully`

      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${userData.token}`);

      var raw = {
        transaction_date: new Date().toISOString().split("T")[0],
        invoice_id: invoiceId,
        amount: amount,
        reason: description
      };

      if (base64img) {
        raw["reference_document_id"] = base64img;
      }

      var jsonString = JSON.stringify(raw);
      console.log("rawwwww-------->", jsonString);

      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: jsonString,
        redirect: "follow",
      };

      await fetch(url, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log("resultttt", result);
          Alert.alert(AlertTitle, AlertMessage, [
            { text: "OK", onPress: () => { setAddModalVisible(false); getAllNotes(); } },
          ]);
        })
        .catch((error) => {
          console.log("add credit api erro", error);
        });
    } else {
      Alert.alert("Warning", "Please enter all the details");
    }
    setAmount('');
    setDescription('');
    setInvoiceId('');
  };

  const getAllNotes = async () => {
    setLoading(true);
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${userData.token}`);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      body: null,
      redirect: "follow",
    };

    try {
      // Fetch both credit notes and debit notes concurrently
      const [creditNotesResponse, debitNotesResponse] = await Promise.all([
        fetch(`https://gsidev.ordosolution.com/api/creditnotes/`, requestOptions),
        fetch(`https://gsidev.ordosolution.com/api/debitnotes/`, requestOptions),
      ]);

      // Parse both responses as JSON
      const [creditNotesResult, debitNotesResult] = await Promise.all([
        creditNotesResponse.json(),
        debitNotesResponse.json(),
      ]);

      // Update the state with the results
      setCreditNotes(creditNotesResult);
      setDebitNotes(debitNotesResult);

    } catch (error) {
      console.log("Error fetching notes", error);
    }
    setLoading(false);

  };


  useFocusEffect(
    React.useCallback(() => {
      getAllNotes();
      getDropdownList();
    }, [])
  );


  const renderItem = useCallback(({ item, index }) => {
    let paymentImage, backgroundColor;

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
        style={{ ...styles.itemContainer, }}
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
            <MaterialCommunityIcons name="file-document-edit-outline" size={35} color="#1fd655" />
          </View>
          <View style={styles.orderDataContainer}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={styles.title}>{tabIndex == 0 ? 'CN' : 'DN'}-{item?.id}</Text>
            </View>
            <Text style={{ ...styles.text, fontSize: 14 }}>
              INVOICE-{item?.invoice_id}
            </Text>
            <Text style={{ ...styles.text, fontSize: 14 }} numberOfLines={1}>
              Reason: {item?.reason}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }, [tabIndex]);

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
            <Text style={styles.headerTitle}>Credit/Debit Notes</Text>
            <Text style={styles.headerTitle}>   </Text>
          </View>
        </View>
        <View
          style={{
            backgroundColor: "#F3F5F8",
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            flex: 1,
            // padding: 10,
            elevation: 5,
            marginTop: vs(10),
          }}
        >
          <SegmentedControl
            values={['Credit', 'Debit']}
            selectedIndex={tabIndex}
            onChange={(event) => {
              setTabIndex(event.nativeEvent.selectedSegmentIndex)
            }}
            // onValueChange={(value) => { console.log("testing", value) }}
            segmentedControlBackgroundColor="black"
            tintColor={Colors.primary}
            activeSegmentBackgroundColor={Colors.primary}
            appearance='light'
            activeTextColor='white'
            textColor='black'
            paddingVertical={20}
            style={{ marginHorizontal: '4%', marginVertical: '3%', }}
            fontStyle={{ fontFamily: 'AvenirNextCyr-Medium', color: 'black' }}
            activeFontStyle={{ fontFamily: 'AvenirNextCyr-Medium', color: 'white' }}
          />
          {/* {noData && noDataFound()} */}
          {tabIndex === 0 &&
            <MemoizedCredit creditNotes={creditNotes} renderItem={renderItem} loading={loading} />}
          {tabIndex === 1 &&
            <MemoizedDebit debitNotes={debitNotes} renderItem={renderItem} loading={loading} />}
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
                {/* <Image
                  source={require("../../assets/images/checkGreen.png")}
                  style={{
                    height: 65,
                    width: 65,
                    alignSelf: "center",
                    marginBottom: "0%",
                  }}
                /> */}
                {/* <Text style={styles.MPriceText}>
                  ₹{Number(selectedPayment?.Amount)}
                </Text> */}
                <Text style={styles.title}>Credit Notes Details</Text>
                <View style={{}}>
                  <View
                    style={{
                      flexDirection: "row",
                      // justifyContent: "space-between",
                      borderBottomColor: "#D9D9D9",
                      borderBottomWidth: 1,
                      paddingVertical: "3%",
                      marginBottom: "5%",
                      borderTopColor: "#D9D9D9",
                      // borderTopWidth: 1,
                      alignItems: "center",
                      marginTop: "3%",
                    }}
                  >
                    <Text style={[styles.text]}>Invoice : </Text>


                    <Text
                      style={[
                        styles.text,

                      ]}
                    >
                      INVOICE-{selectedPayment?.invoice_id}
                    </Text>
                  </View>


                  <View
                    style={{
                      flexDirection: "row",
                      // justifyContent: "flex-start",
                      borderBottomColor: "#D9D9D9",
                      borderBottomWidth: 1,
                      paddingBottom: "5%",
                      paddingVertical: "3%",
                    }}
                  >
                    <Text style={{ ...styles.text, width: '20%' }}>Reason : </Text>

                    <Text style={{ ...styles.text, width: '80%' }}>
                      {selectedPayment?.reason}
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      // justifyContent: "flex-start",
                      borderBottomColor: "#D9D9D9",
                      borderBottomWidth: 1,
                      paddingBottom: "5%",
                      paddingVertical: "3%",
                    }}
                  >
                    <Text style={{ ...styles.text, width: '20%' }}>Amount : </Text>

                    <Text style={{ ...styles.text, width: '80%' }}>
                      {selectedPayment?.amount}
                    </Text>
                  </View>





                  {/* <View
                    style={{
                      flexDirection: "row",
                      // justifyContent: "space-between",
                      borderBottomColor: "#D9D9D9",
                      borderBottomWidth: 1,
                      paddingBottom: "5%",
                      paddingVertical: "3%",
                    }}
                  >
                    <Text style={styles.text}>Document : </Text>

                    <Image
                      source={{ uri: selectedPayment?.reference_document_id }}
                      style={styles.imgStyle}
                    />
                  </View> */}
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
          <View style={{ ...styles.modalView }}>

            <View >
              <Text style={[{ color: Colors.primary, marginVertical: '2%', textAlign: 'center', fontFamily: 'AvenirNextCyr-Medium', fontSize: 20 }]}>{tabIndex == 0 ? 'Add Credit Notes' : 'Add Debit Notes'}</Text>
            </View>

            {/* <View
                  style={{
                    flexDirection: "row",
                    gap: 20,
                    justifyContent: "center",
                    marginVertical: "4%",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      // paddingHorizontal: '3%',
                      paddingVertical: "1%",
                      backgroundColor:
                        selectedOption === "sales" ? Colors.primary : "white",
                      color: selectedOption === "sales" ? "white" : "black",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 30,
                      width: "30%",
                    }}
                  >
                    <RadioButton.Android
                      color={"white"}
                      status={selectedOption === "sales" ? "checked" : "unchecked"}
                      onPress={() => handleSelect("sales")}
                    />
                    <TouchableOpacity onPress={() => handleSelect("sales")}>
                      <Text
                        style={{
                          fontFamily: "AvenirNextCyr-Medium",
                          fontSize: 12,
                          color: selectedOption === "sales" ? "white" : "black",
                        }}
                      >
                        SALES{" "}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      paddingHorizontal: '3%',
                      // width: "30%",
                      paddingVertical: "1%",
                      backgroundColor:
                        selectedOption === "purchase" ? Colors.primary : "white",
                      color: selectedOption === "purchase" ? "white" : "black",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 30,
                    }}
                  >
                    <RadioButton.Android
                      color={"white"}
                      status={selectedOption === "purchase" ? "checked" : "unchecked"}
                      onPress={() => handleSelect("purchase")}
                    />
                    <TouchableOpacity onPress={() => handleSelect("purchase")}>
                      <Text
                        style={{
                          fontFamily: "AvenirNextCyr-Medium",
                          fontSize: 12,
                          color: selectedOption === "purchase" ? "white" : "black",
                        }}
                      >
                        PURCHASE{" "}
                      </Text>
                    </TouchableOpacity>

                  </View>


                </View> */}

            <View>
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
                  data={tabIndex == 0 ? accSalesDrop : accPurchaseDrop}
                  maxHeight={400}
                  labelField="label"
                  search
                  searchPlaceholder="Search"
                  valueField="value"
                  placeholder={!isFocus ? "Invoice" : "..."}
                  value={invoiceId}
                  onFocus={() => setIsFocus(true)}
                  onBlur={() => setIsFocus(false)}
                  onChange={(item) => {
                    setInvoiceId(item.value);
                  }}
                />
              </View>

              <TextInput1
                mode="outlined"
                label="Amount"
                theme={{ colors: { onSurfaceVariant: "black" } }}
                activeOutlineColor="#4b0482"
                outlineColor="#B6B4B4"
                textColor="#4b0482"
                onChangeText={(text) => setAmount(text)}
                value={amount}
                returnKeyType="next"
                blurOnSubmit={false}
                keyboardType={'decimal-pad'}
                outlineStyle={{ borderRadius: ms(10) }}
                style={{ backgroundColor: "white", marginBottom: '3%' }}
              />

              <TextInput1
                mode="outlined"
                label="Reason"
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
                  // marginBottom: "2%",
                  height: 100,
                  backgroundColor: "white",
                  marginBottom: '3%'
                }}
              />

              {/* <View style={{ paddingLeft: '1%', marginBottom: '2%' }}>
                      <Text style={{ fontFamily: "AvenirNextCyr-Medium", fontSize: 16, marginBottom: '1%' }}>Document</Text>
                      <View style={styles.buttonview}>
                        <LinearGradient
                          colors={Colors.linearColors}
                          start={Colors.start}
                          end={Colors.end}
                          locations={Colors.ButtonsLocation}
                          style={{ borderRadius: 8 }}
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
                    </View> */}
            </View>


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
                  onPress={addNote}
                >
                  <Text style={styles.buttonText}>Add</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>


            <TouchableOpacity
              onPress={() => {
                setAddModalVisible(false);
                setAmount('')
                setDescription('');
                setInvoiceId('');
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
  },
  selectedTextStyle: {
    fontSize: 16,
    fontFamily: "AvenirNextCyr-Medium",
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
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
    gap: 6,
    marginTop: '2%'
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
  }, photosContainer: {
    height: 40,
    padding: 10,
    borderRadius: 10,
    // marginVertical: 10,
    // backgroundColor: Colors.primary,
    // marginRight: 10,
  },
});

export default CreditNotes;
