import React, { useContext, useEffect, useState } from "react";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { AuthContext } from "../../Context/AuthContext";
import {
  View,
  Dimensions,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
  FlatList,
  Pressable,
  Linking,
  KeyboardAvoidingView,
} from "react-native";
import { TextInput,Button } from "react-native-paper";
import { DatePickerModal} from "react-native-paper-dates";
import LinearGradient from "react-native-linear-gradient";
import { BarChart } from "react-native-gifted-charts";
import Colors from "../../constants/Colors";
import uniqolor from "uniqolor";
import { useFocusEffect } from "@react-navigation/native";
import { Image } from "react-native-animatable";
import { MapView } from "@rnmapbox/maps";
import PercentageCircle from "react-native-percentage-circle";
import { PieChart } from "react-native-gifted-charts";
import globalStyles from "../../styles/globalStyles";
import style from "../AddShelfDisplay/style";
import { cameraPermission } from "../../utils/Helper";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import ImageResizer from "@bam.tech/react-native-image-resizer";
import RNFS from "react-native-fs";
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";
import moment from "moment";
import Toast from "react-native-simple-toast";
import { LoadingView } from "../../components/LoadingView";
import { Dropdown } from "react-native-element-dropdown";

const InvoiceDetails = ({ navigation, route }) => {
  const invoiceDetails = route.params?.details;
  const screen = route.params?.screen;
  console.log("screeeen------------------->", invoiceDetails);
  const [products, setProducts] = useState(route.params?.details.product_list);
  const [expanded, setExpanded] = useState(false);
  const [expanded1, setExpanded1] = useState(false);
  const [loading, setLoading] = useState(false);
  const { userData } = useContext(AuthContext);
  const [selectedPayment, setSelectedPayment] = useState(
    route.params?.details.credit_notes
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [modal2Visible, setModal2Visible] = useState(false);

  const [amount, setAmount] = useState("");
  const [remarks, setRemarks] = useState("");
  const [date, setDate] = React.useState(undefined);
  const [open, setOpen] = React.useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const [modeOfPayment, setModeOfPayment] = useState(null);
  const [transactionNumber,settransactionNumber]=useState("");
  const [label,setLabel]=useState("");
  const [paymentDrop, setPaymentDrop] = useState([{ label: 'Cash', value: 'Cash' },
                                                  { label: 'Cheque', value: 'Cheque' },
                                                  { label: 'Bank Transaction', value: 'Bank' },]);

  const onDismissSingle = React.useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const onConfirmSingle = React.useCallback(
    (params) => {
      setOpen(false);
      setDate(params.date);
    },
    [setOpen, setDate]
  );

  console.log("amount====>>",amount);
  console.log("remarks====>>",remarks);
  console.log("date====>>",date);
  console.log("modeOfPayment====>>",modeOfPayment);
  console.log("transactionNumber====>>",transactionNumber);

  const handleSubmit = async () => {
    setModal2Visible(true);
    // let url = screen === "SO" ? `https://gsidev.ordosolution.com/api/acc_sales/${invoiceDetails.id}/` : `https://gsidev.ordosolution.com/api/acc_purchase/${invoiceDetails.id}/`
    // setLoading(true);
    // var myHeaders = new Headers();
    // myHeaders.append("Content-Type", "application/json");
    // myHeaders.append("Authorization", `Bearer ${userData.token}`);

    // let todays_date = new Date();

    // var raw = JSON.stringify({
    //     status: "Paid",
    //     payment_date: todays_date.toISOString().split('T')[0]
    // });

    // console.log('--------------->',raw);

    // var requestOptions = {
    //     method: "PUT",
    //     headers: myHeaders,
    //     body: raw,
    //     redirect: "follow",
    // };

    // await fetch(
    //     url,
    //     requestOptions
    // )
    //     .then((response) => {
    //         // console.log("responseee", response)
    //         if (response.status === 200) {
    //             Toast.show("Record updated successfully", Toast.LONG);
    //             navigation.goBack();
    //         }
    //     })

    //     .catch((error) => console.log("api error", error));
    // setLoading(false);
  };



  // useEffect(()=>{
  //   setPaymentDrop();
  // },[])
 

  return (
    <View style={{ flex: 1, backgroundColor: "white", padding: 24 }}>
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            {/* <AntDesign name='arrowleft' size={25} color={Colors.primary} /> */}
            <Image
              source={require("../../assets/images/Refund_back.png")}
              style={{ height: 30, width: 30, tintColor: Colors.primary }}
            />
          </TouchableOpacity>
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text
              style={{
                fontSize: 20,
                color: Colors.primary,
                fontFamily: "AvenirNextCyr-Medium",
              }}
            >
              {" "}
              Invoice Details
            </Text>
          </View>

          {selectedPayment?.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                //   setSelectedPayment(item);
                setModalVisible(true);
              }}
              style={{ justifyContent: "center", alignItems: "center" }}
            >
              <MaterialCommunityIcons
                name="file-document-edit-outline"
                size={20}
                color={Colors.primary}
              />

              <Text
                style={{
                  fontSize: 10,
                  color: Colors.primary,
                  fontFamily: "AvenirNextCyr-Medium",
                }}
              >
                Credit Notes
              </Text>
            </TouchableOpacity>
          )}
          <View></View>
        </View>

        <View
          style={{
            backgroundColor: "#F3F5F9",
            marginTop: "5%",
            borderTopEndRadius: 20,
            paddingHorizontal: "4%",
            paddingVertical: "3%",
            borderTopStartRadius: 20,
          }}
        >
          <View style={styles.row}>
            <View style={{ flexDirection: "row", gap: 10 }}>
              <Text
                style={{
                  fontSize: 18,
                  color: Colors.primary,
                  fontFamily: "AvenirNextCyr-Bold",
                }}
              >
                Invoice - {invoiceDetails?.invoice}
              </Text>
            </View>

            <View
              style={{
                backgroundColor:
                  invoiceDetails?.status === "Paid" ? "green" : "orange",
                paddingHorizontal: "4%",
                paddingVertical: "2%",
                borderRadius: 20,
              }}
            >
              <Text style={{ color: "white" }}>{invoiceDetails?.status}</Text>
            </View>
          </View>

          <View style={{ ...styles.row }}>
            <Text style={{ color: "black", flex: 1 }}>
              {invoiceDetails?.customer_name
                ? "Customer Name"
                : "Supplier Name"}
            </Text>

            <Text
              style={{ color: "black", flex: 1 }}
              numberOfLines={3}
              ellipsizeMode="tail"
            >
              {invoiceDetails?.customer_name
                ? invoiceDetails?.customer_name
                : invoiceDetails?.supplier_name}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={{ color: "black" }}>Invoice Date</Text>

            <Text style={{ color: "black" }}>
              {" "}
              {invoiceDetails?.invoice_date &&
                invoiceDetails.invoice_date.split("-").reverse().join("/")}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={{ color: "black" }}>Due Date</Text>
            <Text style={{ color: "black" }}>
              {invoiceDetails?.due_date &&
                invoiceDetails.due_date.split("-").reverse().join("/")}
            </Text>
          </View>

          {invoiceDetails.payment_date != null && (
            <View style={styles.row}>
              <Text style={{ color: "black" }}>Payment Date</Text>

              <Text style={{ color: "black" }}>
                {invoiceDetails?.payment_date &&
                  invoiceDetails.payment_date.split("-").reverse().join("/")}
              </Text>
            </View>
          )}

          <View style={[styles.row]}>
            <Text
              style={{
                color: "green",
                fontSize: 18,
                fontFamily: "AvenirNextCyr-Bold",
              }}
            >
              Amount
            </Text>
            <Text
              style={{
                color: "green",
                fontSize: 18,
                fontFamily: "AvenirNextCyr-Bold",
              }}
            >
              {invoiceDetails?.amount}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("SalesOrderDetails", {
              orderDetails: invoiceDetails,
              screen: "invoice",
            });
          }}
          style={{
            backgroundColor: Colors.primary,
            borderBottomEndRadius: 20,
            paddingHorizontal: "4%",
            paddingVertical: "3%",
            position: "relative",
            borderBottomStartRadius: 20,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontSize: 16, fontWeight: 600 }}>
            View Order Details
          </Text>
          <AntDesign name="arrowright" size={25} color={Colors.white} />
        </TouchableOpacity>

        {/* <View style={[styles.ProductListContainer, { flex: 1.5 }]}>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={products}
                    keyboardShouldPersistTaps='handled'
                    renderItem={({ item }) =>

                        <View style={styles.elementsView} >

                            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                <Pressable >
                                    {item.product_image && item.product_image.length > 0 ? (
                                        <Image
                                            source={{ uri: item.product_image[0] }} // Use the first image
                                            style={styles.imageView}
                                        />
                                    ) : (
                                        <Image
                                            source={require("../../assets/images/noImagee.png")} // Use default image
                                            style={styles.imageView}
                                        />
                                    )}

                                </Pressable>
                                <View style={{
                                    flex: 1,
                                    paddingLeft: 15,
                                    marginLeft: 10,
                                }}>

                                    <Text style={{ color: Colors.primary, fontSize: 14, fontFamily: 'AvenirNextCyr-Medium', marginTop: 5, }}>{item.name}</Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: '3%', justifyContent: 'space-between' }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}>Qty :  </Text>
                                            <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}>{item.qty}

                                            </Text>
                                        </View>

                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}>Price :  </Text>
                                            <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}>{parseFloat(item.price).toFixed(2)} </Text>
                                        </View>

                                    </View>
                                </View>

                            </View>
                            <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', marginTop: '2%' }}>
                            </View>
                        </View>

                    }
                // keyExtractor={(item) => item.id.toString()}

                />
            </View> */}
      </ScrollView>

      {invoiceDetails.status !== "Paid" && (
        <TouchableOpacity
          onPress={handleSubmit}
          style={{
            marginVertical: "5%",
            backgroundColor: Colors.primary,
            borderRadius: 20,
            paddingVertical: "4%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontFamily: "AvenirNextCyr-Bold", color: "white" }}>
            Mark Paid
          </Text>
        </TouchableOpacity>
      )}

      <LoadingView visible={loading} message="Please wait..." />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          //   setSelectedPayment(null);
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
                <Text style={{ ...styles.title1 }}>Credit Notes Details</Text>
                <FlatList
                  showsVerticalScrollIndicator={false}
                  data={selectedPayment}
                  keyboardShouldPersistTaps="handled"
                  renderItem={({ item }) => (
                    <View style={{}}>
                      <View
                        style={{
                          flexDirection: "row",
                          // justifyContent: "space-between",
                          // borderBottomColor: "#D9D9D9",
                          // borderBottomWidth: 1,
                          paddingVertical: "1%",
                          marginTop: "5%",
                          borderTopColor: "#D9D9D9",
                          // borderTopWidth: 1,
                          alignItems: "center",
                          marginTop: "3%",
                        }}
                      >
                        <Text style={{ ...styles.text, fontWeight: 500 }}>
                          Amount :{" "}
                        </Text>

                        <Text style={[styles.text]}>{item?.amount}</Text>
                      </View>

                      <View
                        style={{
                          flexDirection: "row",
                          // justifyContent: "flex-start",
                          // borderBottomColor: "#D9D9D9",
                          // borderBottomWidth: 1,
                          paddingBottom: "1%",
                          // paddingVertical: "3%",
                        }}
                      >
                        <Text
                          style={{
                            ...styles.text,
                            width: "20%",
                            fontWeight: 500,
                          }}
                        >
                          Reason :
                        </Text>

                        <Text style={{ ...styles.text, width: "85%" }}>
                          {item?.reason}
                        </Text>
                      </View>

                      <View
                        style={{
                          flexDirection: "row",
                          // justifyContent: "flex-start",
                          // borderBottomColor: "#D9D9D9",
                          // borderBottomWidth: 1,
                          paddingBottom: "1%",
                          // paddingVertical: "3%",
                        }}
                      >
                        <Text
                          style={{
                            ...styles.text,
                            width: "20%",
                            fontWeight: 500,
                          }}
                        >
                          Status :
                        </Text>

                        <Text style={{ ...styles.text, width: "85%" }}>
                          {item?.status}
                        </Text>
                      </View>

                      <View
                        style={{
                          flexDirection: "row",
                          // justifyContent: "flex-start",
                          borderBottomColor: "#D9D9D9",
                          borderBottomWidth: 1,
                          paddingBottom: "5%",
                          // paddingVertical: "3%",
                        }}
                      >
                        <Text style={{ ...styles.text, fontWeight: 500 }}>
                          Transaction Date :{" "}
                        </Text>

                        <Text style={{ ...styles.text }}>
                          {item?.transaction_date}
                        </Text>
                      </View>
                    </View>
                  )}
                  // keyExtractor={(item) => item.id.toString()}
                />
              </>
            )}
            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
                // setSelectedPayment(null);
              }}
              style={[styles.closeButton1, styles.circleButton]}
            >
              <AntDesign name="close" size={20} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>



      <Modal
        animationType="slide"
        transparent={true}
        visible={modal2Visible}
        onRequestClose={() => {
          setModal2Visible(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={{ ...styles.modalView, flex: 0.8 }}>
            <View style={{ flex: 1, backgroundColor: "white" }}>
              <View style={{ ...styles.headercontainer }}>
                <Text
                  style={[
                    styles.headerTitle,
                    {
                      color: Colors.primary,
                      marginVertical: "1%",
                      marginLeft: "29%",
                    },
                  ]}
                >
                {" "}
                </Text>
              </View>
              <ScrollView style={{ paddingHorizontal: 10, flex: 1 }}>
                <TextInput
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
                  outlineStyle={{ borderRadius: 10 }}
                  style={{
                    marginBottom: "2%",
                    height: 50,
                    backgroundColor: "white",
                  }}
                />

                <TextInput
                  mode="outlined"
                  label="Description"
                  theme={{ colors: { onSurfaceVariant: "black" } }}
                  activeOutlineColor="#4b0482"
                  outlineColor="#B6B4B4"
                  textColor="black"
                  onChangeText={(text) => setRemarks(text)}
                  autoCapitalize="none"
                  blurOnSubmit={false}
                  value={remarks}
                  returnKeyType="done"
                  multiline={true}
                  // keyboardType="numeric"
                  outlineStyle={{ borderRadius: 10 }}
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
                      item.value === "Cash" ? setLabel("Enter Cash Amount") : item.value === "Cheque" ? setLabel("Enter Cheque Number") : item.value === "Bank" ? setLabel("Enter Transaction ID") : setLabel("");

                    }}
                  />
                </View>
        <TextInput
                  mode="outlined"
                  label={""}
                  disabled
                  theme={{ colors: { onSurfaceVariant: "black" } }}
                  activeOutlineColor="#4b0482"
                  outlineColor="#B6B4B4"
                  textColor="black"
                  autoCapitalize="none"
                  blurOnSubmit={false}
                  value={moment(date).format("LL")}
                  returnKeyType="done"
                  outlineStyle={{ borderRadius: 10 }}
                  style={{
                    marginVertical: "4%",
                    height: 50,
                    backgroundColor: "white",
                  }}
                />
               <Button style={{alignSelf:'center'}} 
               onPress={()=>setOpen(true)}
               mode="outlined">
               SELECT DATE 
               </Button>
                <DatePickerModal
          locale="en"
          mode="single"
          visible={open}
          onDismiss={onDismissSingle}
          date={date}
          onConfirm={onConfirmSingle}
        />
                {
                  modeOfPayment==null ? "" : (
                <TextInput
                  mode="outlined"
                  label={label}
                  theme={{ colors: { onSurfaceVariant: "black" } }}
                  activeOutlineColor="#4b0482"
                  outlineColor="#B6B4B4"
                  textColor="black"
                  onChangeText={(text) => settransactionNumber(text)}
                  autoCapitalize="none"
                  blurOnSubmit={false}
                  value={transactionNumber}
                  returnKeyType="done"
                  keyboardType="numeric"
                  outlineStyle={{ borderRadius: 10 }}
                  style={{
                    marginVertical: "4%",
                    height: 50,
                    backgroundColor: "white",
                  }}
                />)
                  }
              </ScrollView>
              <View style={{ padding: 10}}>
                <View style={styles.buttonview}>
                  <LinearGradient
                    colors={Colors.linearColors}
                    start={Colors.start}
                    end={Colors.end}
                    locations={Colors.ButtonsLocation}
                    style={{ borderRadius: 8, flex: 1 }}
                  >
                    <TouchableOpacity style={styles.buttonContainer} onPress={()=> setModal2Visible(false)}>
                      <Text style={styles.buttonText}>Add</Text>
                    </TouchableOpacity>
                  </LinearGradient>
                </View>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => {
                setModal2Visible(false);
              }}
              style={[styles.closeButton, styles.circleButton]}
            >
              <AntDesign name="close" size={20} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default InvoiceDetails;
const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // marginBottom: 7
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomColor: "grey",
    borderBottomWidth: 0.5,
    paddingVertical: "4%",
  },

  title: {
    fontFamily: "AvenirNextCyr-Medium",
    fontSize: 14,
    color: Colors.black,
  },

  value: {
    fontFamily: "AvenirNextCyr-Medium",
    fontSize: 15,
    color: Colors.black,
  },

  imageView: {
    width: 80,
    height: 80,
    // borderRadius: 40,
    // marginTop: 20,
    // marginBottom: 10
  },
  elementsView: {
    // ...globalStyles.border,
    padding: "5%",
    borderBottomColor: "grey",
    borderBottomWidth: 0.5,
  },
  ProductListContainer: {
    marginVertical: "4%",
  },

  salesContainer: {
    marginHorizontal: 16,
    padding: 10,
    backgroundColor: Colors.white,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginVertical: 10,
    elevation: 5,
    // ...globalStyles.border,
    borderRadius: 5,
    marginTop: 20,
  },
  total: {
    fontSize: 18,
    color: Colors.primary,
    fontFamily: "AvenirNextCyr-Medium",
  },
  label: {
    fontSize: 16,
    color: Colors.black,
    fontFamily: "AvenirNextCyr-Medium",
  },
  performanceContainer: {
    marginHorizontal: 16,
    padding: 10,
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    marginVertical: 10,
    elevation: 5,
    // ...globalStyles.border,
    borderRadius: 5,
  },
  heading: {
    fontSize: 22,
    color: Colors.primary,
    fontFamily: "AvenirNextCyr-Medium",
  },
  subHeading: {
    fontSize: 13,
    color: "grey",
    fontFamily: "AvenirNextCyr-Medium",
  },
  card: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginVertical: "5%",
    backgroundColor: "#F5F5F5",
    // flex:1
  },
  cardTitle: {
    fontSize: 15,
    fontFamily: "AvenirNextCyr-Medium",
    color: Colors.black,
  },
  expandedContent: {
    marginTop: 20,
  },
  avatarImageContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderColor: "grey",
    borderWidth: 1,
    width: 80,
    height: 80,
    borderRadius: 50,
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40, // Half of the width/height to make it circular
    borderWidth: 1, // Border styles
    borderColor: "grey",
    overflow: "hidden",
  },
  modalContainer1: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent1: {
    backgroundColor: "white",
    width: 300,
    borderRadius: 10,
    padding: 30,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 8,
    marginLeft: 15,
    marginRight: 15,
  },
  submitButton1: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    // marginTop: 2,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "AvenirNextCyr-Medium",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
  },
  inputView: {
    width: "100%",
    borderWidth: 1,
    backgroundColor: "white",
    borderRadius: 8,
    height: "2%",
    marginBottom: 20,
    justifyContent: "center",
    padding: 20,
    paddingLeft: 5,
  },
  inputView1: {
    width: "100%",
    borderWidth: 1,
    backgroundColor: "white",
    borderRadius: 8,
    height: 100,
    // marginBottom: 20,
    // justifyContent: "center",
    // padding: 20,
    paddingLeft: 5,
  },
  inputText: {
    height: 50,
    color: "black",
    fontFamily: "AvenirNextCyr-Medium",
  },
  inputText1: {
    fontFamily: "AvenirNextCyr-Medium",
    color: "black",
    // height: 500,
  },
  addressInput: {
    // height: 100, // Adjust the height as needed for your design
  },

  imageView: {
    width: 80,
    height: 80,
    // borderRadius: 40,
    // marginTop: 20,
    // marginBottom: 10
  },

  ProductListContainer: {
    backgroundColor: "#F3F5F9",
    borderRadius: 20,
    marginVertical: "4%",
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
    flex: 0.4,
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
  closeButton1: {
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
  title1: {
    fontSize: 18,
    fontFamily: "AvenirNextCyr-Bold",
    alignSelf: "center",
    marginBottom: "2%",
    // fontWeight:700
  },
  placeholderStyle: {
    fontSize: 16,
    fontFamily: "AvenirNextCyr-Medium",
    color: "black",
  },
  selectedTextStyle: {
    fontSize: 16,
    fontFamily: "AvenirNextCyr-Medium",
    color: "black",
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    color: "black",
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
    marginTop: "2%",
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
  },
});
