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
  TextInput,
  Alert,
  FlatList,
  Pressable,
  Linking,
  Touchable,
} from "react-native";
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
import Entypo from "react-native-vector-icons/Entypo";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import moment from "moment";
import ConvertDateTime from "../../utils/ConvertDateTime";
import LinearGradient from "react-native-linear-gradient";
import { Checkbox } from "react-native-paper";
import { TextInput as TextInput1 ,ActivityIndicator} from "react-native-paper";
import { ProgressDialog } from "react-native-simple-dialogs";
import Toast from "react-native-simple-toast";
import { AnimatedFAB } from "react-native-paper";
import Ionicons from "react-native-vector-icons/Ionicons";
import Comments from '../../components/Comments';
import { WebView } from 'react-native-webview';
import RNFetchBlob from 'rn-fetch-blob';


const OrderReviewDetails = ({ navigation, route }) => {
  const orderDetail = route.params?.orderDetails;
  const [orderDetails, setOrderDetails] = useState(orderDetail);
  const screen = route.params?.screen;
  const [products, setProducts] = useState([]);
  const { userData } = useContext(AuthContext);
  const [visible, setVisible] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [pendingData, setPendingData] = useState([]);
  const [status, setStatus] = useState('');
  const [isCommentsModalVisible, setIsCommentsModalVisible] = useState(false);
  const [modalVisibleBill, setModalVisibleBill] = useState(false);
  const { width: windowWidth } = Dimensions.get('window');


  const downloadImage = async (imageUri) => {
    // Define the path where you want to save the file
    const { config, fs } = RNFetchBlob;
    const downloads = fs.dirs.DownloadDir;
    const path = `${downloads}/image_${Date.now()}.jpg`;
  
    // Start downloading the image
    config({
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path: path,
        description: "Downloading image",
      },
    })
      .fetch("GET", imageUri)
      .then((res) => {
        console.log("The file is saved to:", res.path());
        Alert.alert('Completed',`Image downloaded successfully`);
      })
      .catch((error) => {
        console.error("Error downloading image:", error);
        Alert.alert(`Failed to download image due to: ${error}`);
      });
  };

  useEffect(() => {
    if (
      route.params &&
      route.params.orderDetails &&
      route.params.orderDetails.product_list
    ) {
      const initializedProducts = route.params.orderDetails.product_list.map(
        (product) => ({
          ...product,
          checked: false,
          returnQty: 1,
          stockError: false,
          errorMessage: "",
        })
      );
      setProducts(initializedProducts);
    }
  }, []);

  useEffect(() => {
    fetchPendingInvoice();
  }, []);

  console.log(userData.token);

  const changeStatus = async (status) => {
    // Display a confirmation dialog
    Alert.alert(
      status === "Pending Balance" ? "Confirm Rejection" : "Approve",
      status === "Pending Balance"
        ? "Are you sure you want to notify the sales rep about the rejection?"
        : "Approving would move this order to stock team . Please confirm if you would like to approve?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            let url = `https://gsidev.ordosolution.com/api/sales_order/${orderDetails?.id}/`;
            setLoading(true);
            setIsUpdating(true);
            var myHeaders = new Headers();
            
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", `Bearer ${userData.token}`);

            var so_raw = JSON.stringify({
              status: status,
              company:orderDetail?.company,
              collection_remarks : remarks,
              collection_approve_by: userData?.id
            });

            console.log("so raw------------------->", so_raw);

            var requestOptions = {
              method: "PUT",
              headers: myHeaders,
              body: so_raw,
              redirect: "follow",
            };

            await fetch(url, requestOptions)
              .then((response) => {
                console.log("responseee", response);
                if (response.status === 200) {
                  Toast.show("Order updated successfully", Toast.LONG);
                  setVisible(false);
                  setIsUpdating(false);
                  getOrderDetails();
                  navigation.goBack();
                }
                setIsUpdating(false);
              })
              .catch((error) => console.log("api error", error));
            setLoading(false);
            setIsUpdating(false);
          },
        },
      ]
    );
  };

  const getOrderDetails = async () => {
    setLoading(true);
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "text/plain");
    myHeaders.append("Authorization", `Bearer ${userData.token}`);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    await fetch(
      `https://gsidev.ordosolution.com/api/sales_order/${orderDetails.id}/`,
      requestOptions
    )
      .then((response) => response.json())
      .then(async (result) => {
        setOrderDetails(result);
      })
      .catch((error) => console.log("getOrderDetails api error", error));
    setLoading(false);
  };

  const fetchPendingInvoice = async () => {
    setLoading(true);
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "text/plain");
    myHeaders.append("Authorization", `Bearer ${userData.token}`);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    await fetch(
      `https://gsidev.ordosolution.com/api/customer_pending_invoices/?customer_id=${orderDetails.assigne_to}`,
      requestOptions
    )
      .then((response) => response.json())
      .then(async (result) => {
        setPendingData(result);
      })
      .catch((error) => console.log("Pending Invoice Api error", error));
    setLoading(false);
  };


  const handleReject = () => {
    if (!remarks.trim()) {
      // If remarks are not present, show alert asking to fill the remarks
      Alert.alert(
        "Missing Remarks",
        "Please fill in the remarks",
        [{ text: "OK" }]
      );
    } else {
      changeStatus(status);
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
              {item.invoice_id}
            </Text>
          </View>

          <View style={{ flexDirection: "column", flex: 1 }}>
            <Text style={styles.stepText1}>Order Id: {item.order_name}</Text>

            <Text style={styles.stepDate}>
              Invoice date: {item.invoice_date}
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
                Due Date: {item.due_date}
              </Text>
              <Text style={styles.amount}>
       {
  item.amount
    ? new Intl.NumberFormat('en-IN', { 
        style: 'currency', 
        currency: 'INR',
        minimumFractionDigits: 0,  // No decimal places
        maximumFractionDigits: 0   // No decimal places
      }).format(Number(item.amount))
    : new Intl.NumberFormat('en-IN', { 
        style: 'currency', 
        currency: 'INR',
        minimumFractionDigits: 0,  // No decimal places
        maximumFractionDigits: 0   // No decimal places
      }).format(0)
}
           </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, padding: 24, backgroundColor: "white" }}>
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
          {screen === "PO" ? (
            <Text
              style={{
                fontSize: 20,
                color: Colors.primary,
                fontFamily: "AvenirNextCyr-Medium",
              }}
            >
              {orderDetails.name} ({orderDetails.supplier_name}-
              {orderDetails.supplier_id})
            </Text>
          ) : (
            <Text
              style={{
                fontSize: 20,
                color: Colors.primary,
                fontFamily: "AvenirNextCyr-Medium",
                textAlign: "center",
              }}
            >
              {orderDetails.name} ({orderDetails.assignee_name}-
              {orderDetails.assigne_to})
            </Text>
          )}
        </View>

        {(orderDetails.status == "Pending" || orderDetails.status == "Pending Balance") && (
          <TouchableOpacity
            style={{
              width: 40,
              height: 40,
              backgroundColor: "#dff6ec",
              borderRadius: 10,
              alignItems: "center",
              justifyContent: "center",
              borderColor: "#2abf7d",
              borderWidth: 1,
            }}
            onPress={() => setModalVisible(true)}
          >
            <MaterialIcons
              name="account-balance-wallet"
              color="#2abf7d"
              size={25}
            />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.card}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: "5%",
            paddingTop: "5%",
            alignItems: "center",
          }}
        >
          <Text style={styles.cardTitle}>Order Details</Text>
          <View
            style={{
              paddingHorizontal: "4%",
              paddingVertical: "2%",
              backgroundColor:
                orderDetails.status === "Pending"
                  ? "orange"
                  : orderDetails.status === "Pending Balance"
                  ? "tomato"
                  : "green",
              borderRadius: 20,
            }}
          >
            <Text
              style={{
                fontFamily: "AvenirNextCyr-Medium",
                fontSize: 14,
                color: "white",
              }}
            >
              {orderDetails.status === "Cancel"
                ? "Canceled"
                : orderDetails.status === "In Transit"
                ? "In Transit"
                : orderDetails.status}
            </Text>
          </View>
        </View>

        <View style={styles.expandedContent}>
          <View style={{ paddingHorizontal: "5%", paddingBottom: "2%" }}>
          <View style={styles.row}>
              <Text style={styles.title}>
                Bill to
              </Text>
              <Text style={[styles.value,{textAlign:'right',width:'72%'}]}>
                {orderDetails?.company_name}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.title}>Order ID</Text>
              <Text style={styles.value}>{orderDetails.name}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.title}>
                {screen === "PO" ? "Supplier" : "Customer"}
              </Text>
              <Text style={[styles.value, { width: "65%", textAlign: "right" }]} >
                {screen === "PO"
                  ? orderDetails.supplier_name
                  : orderDetails.assignee_name}
              </Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.title}>Order Placed</Text>
              <Text style={styles.value}>
                {ConvertDateTime(orderDetails?.created_at).formattedDate}{" "}
                {ConvertDateTime(orderDetails?.created_at).formattedTime}
              </Text>
            </View>

           <View style={styles.row}>
              <Text style={styles.title}>Payment Terms</Text>
              <Text style={styles.value}>
                {orderDetails?.payment_term}
              </Text>
            </View>
             <View style={{ ...styles.row }}>
                <Text style={{ ...styles.title }}>Order Image</Text>
                <TouchableOpacity onPress={() => setModalVisibleBill(true)}>
                    <Text style={{ ...styles.value,color:'blue' }}>
                        View
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.row}>
              <Text style={styles.title}>Total Price</Text>
              <Text style={styles.value}>
        {orderDetails?.total_price? 
         new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(orderDetails?.total_price)) : 
         new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(0)
       }
              </Text>
            </View>

{
  orderDetails?.status !== 'Pending' &&
  <View style={styles.row}>
              <Text style={styles.title}>Approved By</Text>
              <Text style={styles.value}>
                {orderDetails?.collection_approve_name ? orderDetails?.collection_approve_name :'-'}
              </Text>
            </View>
}
            
            { 
              orderDetails.collection_remarks && (
                <View style={styles.row}>
                  <Text style={styles.title}>Remark :</Text>
                  <Text
                    style={[
                      styles.value,
                      { color: "red", width: "80%", textAlign: "right" },
                    ]}
                  >
                    {orderDetails.collection_remarks}
                  </Text>
                </View>
              )}
          </View>
        </View>
      </View>

      <View
        style={[styles.card1, { marginBottom: "10%", paddingHorizontal: "3%" }]}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: "1%",
            paddingVertical: "3%",
            borderBottomWidth: 1,
            borderBottomColor: "grey",
          }}
        >
          <Text style={styles.cardTitle}>Products</Text>
          <TouchableOpacity
                        onPress={() => {
                          setIsCommentsModalVisible(true);
                        }}
                        style={{
                            paddingVertical: "2%",
                            paddingHorizontal: "3%",
                            backgroundColor: '#65A765',
                            borderRadius: 10,
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Text style={{ color: "white", fontFamily: "AvenirNextCyr-Bold" }}>
                            Comments
                        </Text>
                    </TouchableOpacity>
        </View>

        <View style={styles.ProductListContainer}>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={products}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <View style={styles.elementsView}>
                <View
                  style={{ flexDirection: "row", justifyContent: "center" }}
                >
                  <Pressable>
                    {item.product_image && item.product_image.length > 0 ? (
                      <Image
                        source={{uri: item.product_image.startsWith("http")
          ? item.product_image
          : `https://gsidev.ordosolution.com${item.product_image}`,
      }} 
                        style={styles.imageView}
                      />
                    ) : (
                      <Image
                        source={require("../../assets/images/noImagee.png")} 
                        style={styles.imageView}
                      />
                    )}
                  </Pressable>
                  <View
                    style={{
                      flex: 1,
                      paddingLeft: 15,
                      marginLeft: 10,
                    }}
                  >
                    <Text
                      style={{
                        color: Colors.primary,
                        fontSize: 14,
                        fontFamily: "AvenirNextCyr-Medium",
                        marginTop: 5,
                      }}
                    >
                      {item.name}
                    </Text>

                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginTop: "3%",
                        justifyContent: "space-between",
                      }}
                    >
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <Text
                          style={{
                            color: "black",
                            fontSize: 12,
                            fontFamily: "AvenirNextCyr-Medium",
                          }}
                        >
                          Qty :{" "}
                        </Text>
                        <Text
                          style={{
                            color: "black",
                            fontSize: 12,
                            fontFamily: "AvenirNextCyr-Medium",
                          }}
                        >
                          {item.qty} {item.loaded_uom}
                        </Text>
                      </View>

                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <Text
                          style={{
                            color: "black",
                            fontSize: 12,
                            fontFamily: "AvenirNextCyr-Medium",
                          }}
                        >
                          Price :{" "}
                        </Text>
                        <Text
                          style={{
                            color: "black",
                            fontSize: 12,
                            fontFamily: "AvenirNextCyr-Medium",
                          }}
                        >
                          {parseFloat(item.price).toFixed(2)}{" "}
                        </Text>
                      </View>
                    </View>
                    

                    {
                        item?.product_remarks && (
                                            <View style={{ flexDirection: 'row',justifyContent:'space-between'}}>
                                                <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}>Product Remark :  </Text>
                                                <Text style={{ color: 'green', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium',width:'55%'}}>{item?.product_remarks}</Text>
                                            </View>
                                         )
                                        }

            {item.remarks ? (
                      <View style={{ marginTop: "1%" }}>
                        <Text
                          style={{
                            color: "black",
                            fontSize: 13,
                            fontFamily: "AvenirNextCyr-Medium",
                          }}
                        >
                          Remarks: {item.remarks}
                        </Text>
                      </View>
                    ) : null}

                  </View>
                </View>
                <View
                  style={{
                    justifyContent: "space-between",
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: "2%",
                  }}
                ></View>
              </View>
            )}
            // keyExtractor={(item) => item.id.toString()}
          />
        </View>
      </View>

      {orderDetails.status == "Pending" && (
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <TouchableOpacity
            onPress={() => {
              setVisible(true); setStatus('Pending Balance')
            }}
            style={[styles.TwoButtons, { backgroundColor: "tomato" }]}
          >
            <Text style={styles.Btext}>Notify Sales</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setVisible(true); setStatus("Collection Approved");
            }}
            style={[styles.TwoButtons, { backgroundColor: "green" }]}
          >
            <Text style={styles.Btext}>Approve</Text>
          </TouchableOpacity>
        </View>
      )}

      {orderDetails.status == "Pending Balance" && (
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            onPress={() => {
              setVisible(true); setStatus("Collection Approved");
            }}
            style={{
              backgroundColor: "green",
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              paddingVertical: "3%",
              borderRadius: 20,
            }}
          >
            <Text style={styles.Btext}>Approve</Text>
          </TouchableOpacity>
        </View>
      )}

      <Modal visible={visible} transparent={true}>
        <View
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            flex: 1,
            justifyContent: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              padding: "4%",
              borderRadius: 15,
              marginHorizontal: "4%",
            }}
          >
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text
                style={{ fontFamily: "AvenirNextCyr-Medium", fontSize: 16 ,color:Colors.black}}
              >
                Add Remarks
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setVisible(false);
                }}
              >
                <AntDesign name="close" color="black" size={20} />
              </TouchableOpacity>
            </View>
            <View style={{ marginVertical: "4%" }}>
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
              />
            </View>
            <LinearGradient
              colors={Colors.linearColors}
              start={Colors.start}
              end={Colors.end}
              locations={Colors.ButtonsLocation}
              style={{
                borderRadius: 20,
              }}
            >
              <TouchableOpacity
                onPress={handleReject}
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

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalContainer1}>
          <View style={styles.modalView}>
            <Text style={[styles.transitionTitle, { marginBottom: "3%" }]}>
              Invoice Details
            </Text>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <View style={styles.detailsBox1}>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 8,
                    alignItems: "center",
                  }}
                >
                  <View style={styles.box}>
                    <AntDesign name="shoppingcart" size={30} color="#e79a4a" />
                  </View>
                  <View style={{ flexDirection: "column" }}>
                    <Text style={styles.Balance}>Total Balance</Text>
                    <Text style={styles.Balance1}>
                      { pendingData?.due_amount? 
                        new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(pendingData?.due_amount)) : 
                        new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(0)
                      }
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
                    <AntDesign name="calendar" size={30} color="#4abfbd" />
                  </View>
                  <View style={{ flexDirection: "column" }}>
                    <Text style={styles.Balance}>Last Payment</Text>
                    <Text style={styles.Balance1}>
                      {pendingData?.last_payment_date
                        ? pendingData?.last_payment_date
                        : "N/A"}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <View
              style={{
                height: 2,
                width: "100%",
                backgroundColor: "#F2F2F2",
                marginTop: "5%",
              }}
            ></View>
            {pendingData?.pending_invoices?.length !== 0 && (
              <Text
                style={{
                  fontSize: 20,
                  color: "black",
                  fontFamily: "AvenirNextCyr-Medium",
                  marginTop: "3%",
                }}
              >
                Pending Invoice
              </Text>
            )}
            <ScrollView>
              <View style={styles.transitionHistoryContainer}>
                {pendingData?.pending_invoices?.length === 0 ? (
                  <Text style={{textAlign:'center',color:'black',marginTop:'30%'}}>No Pending Invoice</Text>
                ) : (
                  <FlatList
                    data={pendingData?.pending_invoices}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                  />
                )}
              </View>
            </ScrollView>
            <TouchableOpacity
              style={{
                height: 40,
                borderColor: Colors.primary,
                borderWidth: 1,
                width: "80%",
                justifyContent: "center",
                alignItems: "center",
                alignSelf: "center",
                borderRadius: 14,
                marginTop: "3%",
              }}
              onPress={() => {
                setModalVisible(false);
              }}
            >
              <Text
                style={{
                  fontSize: 17,
                  color: Colors.primary,
                  fontFamily: "AvenirNextCyr-Medium",
                }}
              >
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

 <Modal visible={modalVisibleBill} transparent={true}>
  <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', flex: 1, justifyContent: 'center' }}>
    <View style={{ backgroundColor: 'white', padding: '2%', borderRadius: 15, flex: 0.8, marginHorizontal: '3%' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ fontFamily: 'AvenirNextCyr-Medium', fontSize: 16 }}>Order Images</Text>
        <TouchableOpacity onPress={() => setModalVisibleBill(false)}>
          <AntDesign name="close" color="black" size={25} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        horizontal 
        pagingEnabled 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ alignItems: 'center' }}
        style={{ flex: 1 }} >
        {orderDetails?.order_images?.length > 0 ? (
          orderDetails.order_images.map((imageUri, index) => (
            <View>
            <View key={index} style={{ width: windowWidth -40, height: '100%', paddingHorizontal: 10 }}>
              <WebView
                source={{ uri: imageUri }}
                style={{ flex: 1}}
                scalesPageToFit={true}
                scrollEnabled={true}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                startInLoadingState={true}
                automaticallyAdjustContentInsets={false}
                useWebKit={true}
                mixedContentMode="compatibility"
                onLoadStart={() => console.log("Loading image...")}
                onLoadEnd={() => console.log("Image loaded")}
                androidHardwareAccelerationDisabled={true}
                allowFileAccess={true}
                allowsFullscreenVideo={true}
                allowsInlineMediaPlayback={true}
                allowsAirPlayForMediaPlayback={true}
                allowsBackForwardNavigationGestures={true}
              />
            </View>
            <TouchableOpacity onPress={() => downloadImage(imageUri)}  style={{
              backgroundColor: "#0077c0",
              padding: "3%",
              borderRadius: 10,
              marginHorizontal: "3%",
              flexDirection:'row',
              marginTop:'2%',
              alignItems:'center',
              justifyContent:'center',
              gap:9,
              marginBottom:'20%'
            }}>
          <AntDesign name="download" color="white" size={20} />
          <Text 
            style={{
              fontFamily: 'AvenirNextCyr-Medium',
              fontSize: 16,
              color: 'white',
            }}>Download</Text>
        </TouchableOpacity>
        </View>
          ))
        ) : (
          <View style={{alignSelf:'center',}}>
          <Text 
            style={{
              fontFamily: 'AvenirNextCyr-Medium',
              fontSize: 16,
              color: 'black',
            }}>                                  No Image</Text>
        </View>
        
        )}
      </ScrollView>
    </View>
  </View>
</Modal>





      <ProgressDialog
        visible={loading}
        dialogStyle={{ alignSelf: "center" }}
        message="Please wait..."
        titleStyle={{ fontFamily: "AvenirNextCyr-Medium", fontSize: 16 }}
        messageStyle={{ fontFamily: "AvenirNextCyr-Medium", fontSize: 14 }}
      />

          {isCommentsModalVisible && (
           <Comments
             route={{ params: { orderId: orderDetails?.id } }}
             isModal={true}
             onClose={() => setIsCommentsModalVisible(false)}
           />
          )}
    </View>
  );
};

export default OrderReviewDetails;
const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
  stepDetails: {
    flex: 1,
    marginBottom: "3%",
  },
  amount: {
    fontSize: 14,
    color: "green",
    fontFamily: "AvenirNextCyr-Medium",
  },
  exceededDueDate: {
    fontSize: 14,
    color: "#FA5F55",
    fontFamily: "AvenirNextCyr-Medium",
  },
  stepDate: {
    fontSize: 14,
    color: "#666",
    fontFamily: "AvenirNextCyr-Medium",
  },
  stepText: {
    fontSize: 14,
    fontFamily: "AvenirNextCyr-Medium",
    color: Colors.black,
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
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    fontFamily: "AvenirNextCyr-Medium",
    fontSize: 14,
    color:Colors.black
  },
  value: {
    fontFamily: "AvenirNextCyr-Medium",
    fontSize: 15,
    color:Colors.black
  },
  imageView: {
    width: 80,
    height: 80,
  },
  elementsView: {
    paddingVertical: "4%",
    borderBottomColor: "grey",
    borderBottomWidth: 0.5,
  },
  ProductListContainer: {
    flex: 1,
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
    ...globalStyles.border,
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
    ...globalStyles.border,
    borderRadius: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
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
  transitionTitle: {
    fontSize: 20,
    color: "black",
    fontFamily: "AvenirNextCyr-Medium",
    textAlign: "center",
  },
  card1: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#F5F5F5",
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontFamily: "AvenirNextCyr-Bold",
    color:Colors.black
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
  modalContent: {
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
  addressInput: {},
  TwoButtons: {
    width: "48%",
    paddingVertical: "4%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
  },
  Btext: {
    color: "white",
    fontFamily: "AvenirNextCyr-Bold",
    fontSize: 17,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: "5%",
    marginHorizontal: "3%",
    marginVertical: "15%",
    flex: 1,
    width: "95%",
  },
  buttonClose: {
    backgroundColor: "#f194ff",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  }, 
  fabStyle: {
    position: "absolute",
    right: "5%",
    bottom: "10%",
    backgroundColor: Colors.primary,
  },
});
