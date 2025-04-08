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
  Keyboard
} from "react-native";
import { TextInput,Button } from "react-native-paper";
import { DatePickerModal} from "react-native-paper-dates";
import Colors from "../../constants/Colors";
import { Image } from "react-native-animatable";
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import moment from "moment";
import { Dropdown } from "react-native-element-dropdown";
import Toast from "react-native-simple-toast";

const CollInvoiceDetails = ({ navigation, route }) => {
  const invoiceDetails = route.params?.details;
  console.log("🚀 ~ CollInvoiceDetails ~ invoiceDetails:", invoiceDetails)
  
  const { userData } = useContext(AuthContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [modal2Visible, setModal2Visible] = useState(false);
  const [amount, setAmount] = useState("");
  const [remarks, setRemarks] = useState("");
  // const [date, setDate] = useState();
  const [open, setOpen] = React.useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const [paymentType, setPaymentType] = useState('');
  const [modeOfPayment, setModeOfPayment] = useState(null);
  const [transactionNumber,settransactionNumber]=useState("");
  const [label,setLabel]=useState("");
  const [paymentDrop, setPaymentDrop] = useState([{ label: 'Cash', value: 'Cash' },
                                                  { label: 'Cheque', value: 'Cheque' },
                                                  { label: 'Bank Transaction', value: 'Bank Transaction' }]);


const [selectedDepDate, setSelectedDepDate] = useState(undefined);
const [visible1, setVisible1] = React.useState(false);
const [DepDate, setDepDate] = useState(moment(new Date()).format('DD/MM/YYYY'))



useEffect(()=>{
  const departureDate = parseDate(DepDate);
  console.log("🚀 ~ useEffect ~ departureDate:", departureDate)

  
},[DepDate])

    const onChange1 = React.useCallback(({ date }) => {

        // console.log(date);
        setSelectedDepDate(date);
        setVisible1(false);
        const formattedDate = moment(date).format('DD/MM/YYYY');
        setDepDate(formattedDate);
    }, [ setSelectedDepDate, setVisible1, setDepDate]);


    const onDismiss1 = React.useCallback(() => {
      setVisible1(false);
  }, [setVisible1]);

  const parseDate = (dateStr) => {
      const [day, month, year] = dateStr.split('/').map(Number);
      return new Date(year, month - 1, day);
  };

  const sanitizeNumber=(numberString)=> {
    return numberString.replace(/,/g, '');
}

const PayInvoiceAmount = (paymentType) => {

  if (!amount) {
    alert('Please enter an amount');
    return;
}

if (!modeOfPayment) {
    alert('Please enter an Mode Of Payment');
    return;
}

if (modeOfPayment==='Cheque' &&!transactionNumber ) {
    alert('Please enter Cheque No');
    return;
}

if (modeOfPayment==='Bank Transaction' &&!transactionNumber ) {
    alert('Please enter Transaction ID');
    return;
}

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${userData?.token}`);

    var raw = JSON.stringify({
        status: paymentType <= 0 ? 'Paid' : 'Partially Paid',
        payment_date: moment(DepDate, "DD/MM/YYYY").format("YYYY-MM-DD"),
        payment_amount: sanitizeNumber(amount),
        payment_mode: modeOfPayment,
        payment_remarks: remarks,
        cheque_no: transactionNumber,
        bank_transaction_no: transactionNumber,
    });

    console.log('Raw------------------->',raw);

    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(
      `https://gsidev.ordosolution.com/api/account_sales/${invoiceDetails?.id}/update/`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        if (result.error) {
           Toast.show("Somthing went wrong", Toast.LONG);
        } else {
           Toast.show("Amount Added successfully", Toast.LONG);
           navigation.goBack();
           setModal2Visible(false)
        }
      })
      .catch((error) => {
        Toast.show("Somthing went wrong", Toast.LONG);
      });
  };


  return (
    <View style={{ flex: 1, backgroundColor: "white"}}>
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
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
            <TouchableOpacity onPress={() => navigation.goBack()}>
          </TouchableOpacity>
          </View>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(true);
              }}
              style={{ justifyContent: "center", alignItems: "center" }}
            >
              <MaterialCommunityIcons
                name="file-document-edit-outline"
                size={30}
                color={Colors.primary}
              />
            </TouchableOpacity>
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
            marginHorizontal:'4%',
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
              style={{ color: "black",width:'70%',textAlign:'right'}}
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
  {invoiceDetails?.amount ? 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(invoiceDetails.amount) : 
    '₹0'}
</Text>

          </View>
          <View style={[styles.row]}>
            <Text
              style={{
                color: "black",
                fontSize: 15,
                fontFamily: "AvenirNextCyr-Medium",
              }}
            >
               Outstanding
            </Text>
            <Text
            style={{
              color: "black",
              fontSize: 15,
              fontFamily: "AvenirNextCyr-Medium",
            }}
             >
  {invoiceDetails?.customer_due_amount ? 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(invoiceDetails.customer_due_amount) : 
    '₹0'} 
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
            marginHorizontal:'4%',
          }}
        >
          <Text style={{ color: "white", fontSize: 16, fontWeight: 600 }}>
            View Order Details
          </Text>
          <AntDesign name="arrowright" size={25} color={Colors.white} />
        </TouchableOpacity>

      </ScrollView>

      {invoiceDetails.status !== "Paid" && (
      <View style={{ padding: 10,flexDirection:'row',justifyContent:"space-between",gap:10,marginBottom:'3%'}}>
      {/* <TouchableOpacity style={[styles.buttonContainer,{ backgroundColor:'tomato'}]} onPress={()=> {setModal2Visible(true); setPaymentType('Partially Paid');}}>
        <Text style={styles.buttonText}>Partially Paid</Text>
      </TouchableOpacity> */}
      <TouchableOpacity style={styles.buttonContainer} onPress={()=> {setModal2Visible(true);}}>
        <Text style={styles.buttonText}>Mark as Paid</Text>
      </TouchableOpacity>
    </View>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modal2Visible}
        onRequestClose={() => {
          setModal2Visible(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={{ ...styles.modalView1, flex: 0.8 }}>
            <View style={{ flex: 1, backgroundColor: "white" }}>
           
              <View style={{ ...styles.headercontainer,marginTop:'3%' }}>
              <View style={[styles.row]}>
            <Text
              style={{
                color: "black",
                fontSize: 15,
                fontFamily: "AvenirNextCyr-Bold",
              }}
            >
             Balance Amount
            </Text>
            <Text
  style={{
    color: "black",
    fontSize: 15,
    fontFamily: "AvenirNextCyr-Bold",
  }}
>
  {invoiceDetails?.pending_amount ? 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(invoiceDetails.pending_amount) : 
    '₹0'}
</Text>

          </View>
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
                  onSubmitEditing={() => Keyboard.dismiss()}
                  blurOnSubmit={true}
                  value={amount}
                  returnKeyType="done"
                  keyboardType="decimal-pad" 
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
                  onSubmitEditing={() => Keyboard.dismiss()}
                  blurOnSubmit={true}
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
                      item.value === "Cash" ? setLabel("Enter Cash Amount") : item.value === "Cheque" ? setLabel("Enter Cheque Number") : item.value === "Bank Transaction" ? setLabel("Enter Transaction ID") : setLabel("");

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
                  onSubmitEditing={() => Keyboard.dismiss()}
                  blurOnSubmit={true}
                  value={DepDate}
                  returnKeyType="done"
                  outlineStyle={{ borderRadius: 10 }}
                  style={{
                    marginVertical: "4%",
                    height: 50,
                    backgroundColor: "white",
                  }}
                />
               <Button style={{alignSelf:'center'}} 
               onPress={()=>setVisible1(true)}
               mode="outlined">
               SELECT DATE 
               </Button>

               <DatePickerModal
                                mode="single"
                                visible={visible1}
                                onDismiss={onDismiss1}
                                date={selectedDepDate}
                                presentationStyle="pageSheet"
                                onConfirm={onChange1}
                                saveLabel="Save" // optional
                                label="Select date" // optional
                                animationType="slide" // optional, default is 'slide' on ios/android and 'none' on web
                                // validRange={{
                                //     startDate: new Date()
                                // }}
                            />

                {
                  modeOfPayment === null || modeOfPayment ==='Cash' ? null :
                <TextInput
                  mode="outlined"
                  label={label}
                  theme={{ colors: { onSurfaceVariant: "black" } }}
                  activeOutlineColor="#4b0482"
                  outlineColor="#B6B4B4"
                  textColor="black"
                  onChangeText={(text) => settransactionNumber(text)}
                  autoCapitalize="none"
                  value={transactionNumber}
                  returnKeyType="done"
                  keyboardType="numeric"
                  onSubmitEditing={() => Keyboard.dismiss()}
                  blurOnSubmit={true}
                  outlineStyle={{ borderRadius: 10 }}
                  style={{
                    marginVertical: "4%",
                    height: 50,
                    backgroundColor: "white",
                  }}
                />
                  }
              </ScrollView>
              <View style={{ padding: 10,flexDirection:'row',justifyContent:"space-between",gap:10}}>
                    <TouchableOpacity style={[styles.buttonContainer,{backgroundColor:'tomato'}]} onPress={()=> PayInvoiceAmount('Partially Paid')}>
                      <Text style={styles.buttonText}>Partially Paid</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonContainer} onPress={()=> PayInvoiceAmount('Paid')}>
                      <Text style={styles.buttonText}>Paid</Text>
                    </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => {
                setModal2Visible(false);
              }}
              style={[styles.closeButton, styles.circleButton]}
            >
              <AntDesign name="close" size={25} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <ScrollView style={{ flex: 1,width:'100%'}}>
              <Text style={styles.modalTitle1}>Payment Details</Text>
              {invoiceDetails?.payment_details && invoiceDetails.payment_details.length > 0 ? (
                invoiceDetails.payment_details.map((payment, index) => (
                  <View key={index} style={styles.paymentDetail}>
                    <Text style={styles.paymentText}>
  Amount: {payment?.payment_amount ? 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(payment.payment_amount) : 
    '₹0'}
</Text>

                    <Text style={styles.paymentText}>Date: {moment(payment?.payment_date).format('DD-MM-YYYY')}</Text>
                    <Text style={styles.paymentText}>Mode: {payment?.payment_mode}</Text>
                    <Text style={styles.paymentText}>Remarks: {payment?.payment_remarks}</Text>
                    {payment?.bank_transaction_no &&
                    <Text style={styles.paymentText}>ID: {payment?.bank_transaction_no}</Text>
                    }
                     {payment?.cheque_no &&
                    <Text style={styles.paymentText}>Cheque No: {payment?.cheque_no}</Text>
                    }
                  </View>
                ))
              ) : (
                <Text style={styles.noPaymentText}>No payment details available</Text>
              )}
            </ScrollView>
            <Text style={styles.modalTitle}>
  Pending Amount: {invoiceDetails?.pending_amount ? 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(invoiceDetails.pending_amount) : 
    '₹0'}
</Text>

            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
              }}
              style={styles.closeButton}
            >
              <AntDesign name="close" size={20} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
};

export default CollInvoiceDetails;
const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal:'4%',
    marginTop:'7%'
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
  },
  elementsView: {
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
    borderRadius: 40, 
    borderWidth: 1, 
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
  },
  addressInput: {
  },
  imageView: {
    width: 80,
    height: 80,
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
  modalView1: {
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
  },
  buttonContainer: {
    height: 50,
    padding: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    flex:1,
    backgroundColor:Colors.primary
  },
  buttonText: {
    fontFamily: "AvenirNextCyr-Medium",
    color: "white",
    fontSize: 16,
  }, 
   modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal:'5%',
    paddingVertical:'5%',
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width:'90%',
    flex:1,
    marginVertical:'15%'
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 15,
  },
  modalTitle1: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom:'3%',
    textAlign:'center'
  },
  paymentDetail: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    flex:1,
    width:'90%',
  },
  paymentText: {
    fontSize: 16,
    color: "#333",
  },
  noPaymentText: {
    fontSize: 16,
    color: "#666",
  },
});
