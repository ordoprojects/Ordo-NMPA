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

const Payment = ({ navigation }) => {
  const { token, dealerData, tourPlanId, userData, checkInDocId } = useContext(AuthContext);
  console.log("tour plan id", tourPlanId);
  const [data, setData] = useState(false);
  const [noData, setNoData] = useState(false);

  const [selectedPayment, setSelectedPayment] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);


  //add payment value hooks
  const [amount, setAmount] = useState("");
  const [modeOfPayment, setModeOfPayment] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
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

  const addPayment = () => {
    if (amount && modeOfPayment) {
      if (modeOfPayment === "Wire Transfer/ Bank Transfer" && !transactionId) {
        Alert.alert("Warning", "Please fill trascation id details");
        return;
      }

      if (modeOfPayment === "Cash" && !transactionId) {
        Alert.alert("Warning", "Please fill trascation id details");
        return;
      }


      //cheque payment
      if (modeOfPayment == "Cheque" && !base64img) {
        Alert.alert("Warning", "Please upload cheque images");
        return;
      } else {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${userData.token}`);

        var raw = {
          user: userData.id,
          amount: amount,
          account: dealerData?.account_id,
          status: "Paid",
          payment_date: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
          transaction_id: transactionId,
          mode_of_payment: modeOfPayment,
          tour_plan: null,
          sales_checkin: checkInDocId,
        };

        if (base64img) {
          raw["check_image"] = base64img;
        }

        var jsonString = JSON.stringify(raw);
        console.log("rawwwww", jsonString);

        var requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: jsonString,
          redirect: "follow",
        };

        fetch("https://gsidev.ordosolution.com/api/payment/", requestOptions)
          .then((response) => response.json())
          .then((result) => {
            console.log("resultttt", result);
            if (response?.success == true) {
              Alert.alert("Add Payment", "Data saved successfully", [
                {
                  text: "OK", onPress: () => {
                    setAddModalVisible(false); setAmount("");
                    setModeOfPayment(null);
                    setTransactionId("");
                    setBase64img(""); getReturnHistory();
                  }
                },
              ]);
            }
          })
          .catch((error) => {
            console.log("add payment api erro", error);
          });
      }
    } else {
      Alert.alert("Warning", "Please enter all the details");
    }
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
      `https://gsidev.ordosolution.com/api/payment/?user=${userData.id}&account_id=${dealerData.account_id}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log("payment details", result);
        setData(result);
      })
      .catch((error) => console.log("get tour plan error", error));
  };

  useFocusEffect(
    React.useCallback(() => {
      getReturnHistory();
    }, [])
  );

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
              <Text style={styles.title}>PY-{item?.id}</Text>
              <Text
                style={{
                  ...styles.text,
                  fontFamily: "AvenirNextCyr-Medium",
                  color: "green",
                  fontSize: 18,
                }}
              >
                ₹ {Number(item?.amount)}
              </Text>
            </View>
            <Text style={{ ...styles.text, fontSize: 14 }}>
              {item?.mode_of_payment}
            </Text>
            <Text style={{ ...styles.text }}>
              {moment(item.payment_date).format("DD-MM-YYYY HH:mm:ss")}
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
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Image
                  source={require("../../assets/images/Refund_back.png")}
                  style={{ height: 30, width: 30 }}
                />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Payment Collection</Text>
            </View>

            <LinearGradient
              colors={Colors.linearColors}
              start={Colors.start}
              end={Colors.end}
              locations={Colors.location}
              style={{ borderRadius: 5 }}
            ></LinearGradient>
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
                    height: 85,
                    width: 85,
                    alignSelf: "center",
                    marginBottom: "2%",
                  }}
                />
                <Text style={styles.MPriceText}>
                  ₹{Number(selectedPayment?.amount)}
                </Text>
                <Text style={styles.title}>PY-{selectedPayment?.id}</Text>

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
                        selectedPayment?.mode_of_payment === "Cash"
                          ? "#EDFDF0"
                          : selectedPayment?.mode_of_payment ===
                            "Wire Transfer/ Bank Transfer"
                            ? "#FFF9E5"
                            : selectedPayment?.mode_of_payment === "Cheque"
                              ? "#E3EDFC"
                              : "#FFFFFF",
                      borderColor:
                        selectedPayment?.mode_of_payment === "Cash"
                          ? "#4DE365"
                          : selectedPayment?.mode_of_payment ===
                            "Wire Transfer/ Bank Transfer"
                            ? "#FFC912"
                            : selectedPayment?.mode_of_payment === "Cheque"
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
                            selectedPayment?.mode_of_payment === "Cash"
                              ? "#4DE365"
                              : selectedPayment?.mode_of_payment ===
                                "Wire Transfer/ Bank Transfer"
                                ? "#FFC912"
                                : selectedPayment?.mode_of_payment === "Cheque"
                                  ? "#577FF4"
                                  : "#FFFFFF",
                        },
                      ]}
                    >
                      {selectedPayment?.mode_of_payment}
                    </Text>
                  </View>
                </View>
                {selectedPayment?.mode_of_payment ===
                  "Wire Transfer/ Bank Transfer"

                  && <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      borderBottomColor: "#D9D9D9",
                      borderBottomWidth: 1,
                      paddingBottom: "5%",
                    }}
                  >
                    <Text style={styles.text}>Transaction ID</Text>

                    <Text style={styles.text}>
                      {selectedPayment?.transaction_id}
                    </Text>
                  </View>
                }

                {selectedPayment?.mode_of_payment ===
                  "Cash"

                  && <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      borderBottomColor: "#D9D9D9",
                      borderBottomWidth: 1,
                      paddingBottom: "5%",
                    }}
                  >
                    <Text style={styles.text}>Receipt Number</Text>

                    <Text style={styles.text}>
                      {selectedPayment?.transaction_id}
                    </Text>
                  </View>
                }

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
                  <Text style={styles.text}>Date & Time</Text>

                  <Text style={styles.text}>
                    {moment(selectedPayment?.payment_date).format(
                      "DD-MM-YYYY HH:mm:ss"
                    )}
                  </Text>
                </View>

                <Image
                  source={{ uri: selectedPayment?.check_image }}
                  style={styles.imgStyle}
                />
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
          <View style={[styles.modalView, { height: 470 }]}>
            <View style={{ flex: 1, backgroundColor: "white" }}>
              <View style={{ ...styles.headercontainer }}>
                <Text style={[styles.headerTitle, { color: Colors.primary, marginVertical: '4%', marginLeft: '29%' }]}>Add Payment</Text>
              </View>
              <View style={{ paddingHorizontal: 16, flex: 1 }}>
                <TextInput1
                  mode="outlined"
                  label="Amount (AED)"
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
                    data={optionData}
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
                {modeOfPayment == "Wire Transfer/ Bank Transfer" && (
                  <View>
                    <TextInput1
                      value={transactionId}
                      onChangeText={(text) => setTransactionId(text)}
                      mode="outlined"
                      label="Transaction Id"
                      theme={{ colors: { onSurfaceVariant: "black" } }}
                      activeOutlineColor="#4b0482"
                      outlineColor="#B6B4B4"
                      textColor="black"
                      autoCapitalize="none"
                      blurOnSubmit={false}
                      returnKeyType="done"
                      outlineStyle={{ borderRadius: ms(10) }}
                      style={{
                        marginBottom: "2%",
                        height: 50,
                        backgroundColor: "white",
                      }}
                    />
                  </View>
                )}
                {modeOfPayment == "Cash" && (
                  <View>
                    <TextInput1
                      value={transactionId}
                      onChangeText={(text) => setTransactionId(text)}
                      mode="outlined"
                      label="Receipt Number"
                      theme={{ colors: { onSurfaceVariant: "black" } }}
                      activeOutlineColor="#4b0482"
                      outlineColor="#B6B4B4"
                      textColor="black"
                      autoCapitalize="none"
                      blurOnSubmit={false}
                      returnKeyType="done"
                      outlineStyle={{ borderRadius: ms(10) }}
                      style={{
                        marginBottom: "2%",
                        height: 50,
                        backgroundColor: "white",
                      }}
                    />
                  </View>
                )}
                {modeOfPayment == "Cheque" && (
                  <View>
                    <Text style={styles.modalTitle}>Upload Cheque Image</Text>
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
                      {base64img && modeOfPayment == "Cheque" && (
                        <Image
                          source={{ uri: base64img }}
                          style={styles.imgStyle}
                        />
                      )}
                      {base64img && modeOfPayment == "Cheque" && (
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
                )}
              </View>
              <View style={{ padding: 16, marginTop: '10%' }}>
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
    fontSize: 20,
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
    fontSize: 29,
    fontFamily: "AvenirNextCyr-Medium",
    color: Colors.black,
    marginVertical: "3%",
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

export default Payment;
