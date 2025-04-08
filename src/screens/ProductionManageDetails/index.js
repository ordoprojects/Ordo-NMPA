import React, { useContext, useEffect, useState } from "react";
import Entypo from "react-native-vector-icons/Entypo";
import { AuthContext } from "../../Context/AuthContext";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  FlatList,
  Pressable,
  Dimensions,
  KeyboardAvoidingView,
  ActivityIndicator
} from "react-native";
import Colors from "../../constants/Colors";
import { useFocusEffect } from "@react-navigation/native";
import { Image } from "react-native-animatable";
import globalStyles from "../../styles/globalStyles";
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import ConvertDateTime from "../../utils/ConvertDateTime";
import { Dropdown } from "react-native-element-dropdown";
import { ProgressDialog } from "react-native-simple-dialogs";
import { MaskedTextInput } from "react-native-mask-text";
import { TextInput as TextInput1 ,RadioButton } from "react-native-paper";
import LinearGradient from "react-native-linear-gradient";
import Toast from "react-native-simple-toast";
import { WebView } from 'react-native-webview';
import Comments from '../../components/Comments';
import RNFetchBlob from 'rn-fetch-blob';

const ProductionManageDetails = ({ navigation, route }) => {
  const {screen,screenNameP ,typeP ,type1P,type2P} = route?.params;
  const ScreenName = route.params?.ScreenName;
  const [details, setDetails] = useState(route.params?.orderDetails);
  const [expanded, setExpanded] = useState(true);
  const [expanded1, setExpanded1] = useState(true);
  const [expanded2, setExpanded2] = useState(true);
  const [products, setProducts] = useState(route.params?.orderDetails.product_list);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const { userData } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [pickDrop, setPickDrop] = useState([]);
  const [delDrop, setDelDrop] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [driverName, setDriverName] = useState("");
  const [vehicleNo, setVehicleNo] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [showSingnature, setShowSingnature] = useState(false);
  const [SelectedSign, setSelectedSign] = useState("");
  const [modalVisibleBill, setModalVisibleBill] = useState(false);
  const [visible, setVisible] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [remarks1, setRemarks1] = useState("");
  const [isUpdating1, setIsUpdating1] = useState(false);
  const [visible1, setVisible1] = useState(false);
  const [isCommentsModalVisible, setIsCommentsModalVisible] = useState(false);
  const [modalVisible1, setModalVisible1] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [DispatchRemarks, setDispatchRemarks] = useState("");
  const [selectedOption, setSelectedOption] = useState(details?.transportation_type || '-');
  const { width: windowWidth } = Dimensions.get('window');
  const [visible3, setVisible3] = useState(false);
  const [selectedItemName, setSelectedItemName] = useState('');
  const [productionViewData, setProductionViewData] = useState('');

  const hideModal11 = () => setVisible3(false);

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

  const handleSave = () => {
    handleChnageTransport();
  };

  const handleSelect = (option) => {
    setSelectedOption(option);
  };

  useFocusEffect(
    React.useCallback(() => {
      getDelPickUpDrop();
    }, [userData])
  );

  const openModel =(item) => {
    setProductionViewData(item);
    setVisible3(true);
  }

  const [rows, setRows] = useState([
    { dropdownValue: null, textInputValue: "00.00", otherChargesValue: "" },
  ]);

  const addRow = () => {
    setRows([...rows, { dropdownValue: null, textInputValue: "" }]);
  };

  const deleteRow = (index) => {

    const newRows = [...rows];
    newRows.splice(index, 1);
    setRows(newRows);

    const newSelectedOptions = [...selectedOptions];
    newSelectedOptions.splice(index, 1);
    setSelectedOptions(newSelectedOptions);

  };

  const toggleDetails = () => {
    setExpanded(!expanded);
  };

  const toggleExpansion1 = () => {
    setExpanded1(!expanded1);
  };

  const toggleExpansion2 = () => {
    setExpanded2(!expanded2);
  };

  console.log('===================productionView Data =================');
  console.log(productionViewData);
  console.log('======================================================');

  const renderItem = ({ item }) => (

    <View style={styles.card1}>
      {details?.product_list[0]?.name === "BASE PLATE" ? (
        <Text
          style={{
            color: Colors.primary,
            fontFamily: "AvenirNextCyr-Bold",
            fontSize: 17 }} >
            {item?.height_inch} X {item?.width_ft} X {item?.thickness}
        </Text>
      ) : (
        <Text
          style={{
            color: Colors.primary,
            fontFamily: "AvenirNextCyr-Bold",
            fontSize: 17 }} >
            Dimensions: {item?.width_ft}' {item?.height_inch}"
        </Text>
      )}
  
      {item?.remaining_nos !== '0.0' && item?.remaining_nos && (
        <Text
          style={{
            color: Colors.black,
            fontFamily: "AvenirNextCyr-Medium",
            fontSize: 15 }} >
            Remaining Qty: {item?.remaining_nos} NOS
        </Text>
      )}
  
      { item?.loaded_qty !== 0 && 
        <Text
          style={{
            color: Colors.black,
            fontFamily: "AvenirNextCyr-Medium",
            fontSize: 15 }}>
            Loaded Qty: {item?.loaded_qty} NOS
        </Text>
     } 
  
      { details?.product_list[0]?.name === "BASE PLATE" && (
          <Text
            style={{
              color: Colors.black,
              fontFamily: "AvenirNextCyr-Medium",
              fontSize: 15 }}>
               { details?.status === "Production Completed" ?  'Consumed Weight : ' : " Loaded Weight : "}{ details?.status === "Production Completed" ? item?.base_consumed_weight : item?.base_loaded_weight} Kg
          </Text>
       )} 
    </View>
  );
  

  useEffect(() => {
    // Calculate the total quantity
    const sumQuantity = products?.reduce((accumulator, item) => {
      // Parse item.quantity as an integer; if it's NaN or less than 1, use 1
      const quantity = parseInt(item.qty);
      const validQuantity = isNaN(quantity) || quantity < 1 ? 1 : quantity;

      return accumulator + validQuantity;
    }, 0);

    // Update the totalQuantity state with the calculated sum
    setTotalQuantity(sumQuantity);

    // Calculate the total price
    const totalPrice = products?.reduce((accumulator, item) => {
      // Parse item.quantity and item.price as floats; if they're NaN or less than 0, use 0
      const quantity = parseFloat(item.qty);
      const price = parseFloat(item.price);
      const validQuantity = isNaN(quantity) || quantity < 1 ? 1 : quantity;
      const validPrice = isNaN(price) || price < 0 ? 0 : price;

      return accumulator + validQuantity * validPrice;
    }, 0);

    // Update the totalPrice state with the calculated sum
    setTotalPrice(totalPrice);
  }, [products]);

  const getDelPickUpDrop = async () => {
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
      // First API call1
      let deliveryUrl =
        "https://gsidev.ordosolution.com/api/charges-dropdown-values/?charge_type=Delivery";
      let deliveryResponse = await fetch(deliveryUrl, requestOptions);
      let deliveryData = await deliveryResponse.json();
      setDelDrop(deliveryData.charges_type_values);

      // Second API call
      let pickUpUrl =
        "https://gsidev.ordosolution.com/api/charges-dropdown-values/?charge_type=pick-up";
      let pickUpResponse = await fetch(pickUpUrl, requestOptions);
      let pickUpData = await pickUpResponse.json();
      setPickDrop(pickUpData.charges_type_values);
    } catch (error) {
      console.log("api error", error);
    }

    setLoading(false);
  };

  const handleChnageTransport = async () => {

    // Display a confirmation dialog
    Alert.alert("Confirm Transportation type", "Are you sure you want to Change Transportation types?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "Yes",
        onPress: async () => {
          var myHeaders = new Headers();
          myHeaders.append("Content-Type", "application/json");
          myHeaders.append("Authorization", `Bearer ${userData.token}`);

          var raw = JSON.stringify({
            transportation_type: selectedOption,
            tcc_remark:remarks1
          });

          var requestOptions = {
            method: "PUT",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
          };

          await fetch(
            `https://gsidev.ordosolution.com/api/trans_type_update/${details.id}/`,
            requestOptions
          )
            .then((response) => {
              if (response.status === 200) {
                Toast.show("Transportation type changed successfully", Toast.LONG);
                setModalVisible1(false)
                navigation.navigate('ProductionManage',{screenNameP : screenNameP,typeP :typeP ,type1P :type1P,type2P : type2P })
              }else{
                Toast.show("Server loading please try again", Toast.LONG);
              }
            })
            .catch((error) => console.log("api error", error));
        },
      },
    ]);
  };

  const moveToCollection = () => {
    if (!DispatchRemarks.trim()) {
     // If remarks are not present, show alert asking to fill the remarks
     Alert.alert(
       "Missing Remarks",
       "Please fill in the remarks",
       [{ text: "OK" }]
     );
     return;
   }
   setVisible1(false);
       // Display a confirmation dialog
       Alert.alert("Release Stock", "The stock is released from this Sales Order. Could you please confirm this action?", [
           {
               text: "Cancel",
               onPress: () => console.log("Cancel Pressed",details?.id),
               style: "cancel",
           },
           {
               text: "Yes",
               onPress: () => {

                 setIsUpdating1(true);
                 var myHeaders = new Headers();

                   myHeaders.append("Content-Type", "application/json");
                   myHeaders.append("Authorization", `Bearer ${userData.token}`);

                   var raw = JSON.stringify({
                        sales_order_id:details?.id,
                        status:"Collection Approved",
                        dispatch_remarks: DispatchRemarks
                   });

                   var requestOptions = {
                       method: "POST",
                       headers: myHeaders,
                       body: raw,
                       redirect: "follow",
                   };

                   fetch(
                       `https://gsidev.ordosolution.com/api/stock_to_collection/`,
                       requestOptions
                   )
                       .then((response) => {
                           console.log("🚀 ~ .then ~ response:", response)
                           if (response.status === 200) {
                               Toast.show("Order moved to Stock team", Toast.LONG);
                               setIsUpdating1(false);
                               navigation.goBack();
                           }else{
                               setIsUpdating1(false);
                           }
                       })
                       .catch((error) => {console.log("api error", error); setIsUpdating1(false);});
               },
           },
       ]);
   };


  const handleCancel = async () => {

    // Display a confirmation dialog
    Alert.alert("Confirm Cancel Order", "Are you sure you want to Cancel this order?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "Yes",
        onPress: async () => {
          setIsUpdating(true);
          var myHeaders = new Headers();
          myHeaders.append("Content-Type", "application/json");
          myHeaders.append("Authorization", `Bearer ${userData.token}`);

          var raw = JSON.stringify({
            so_id:details?.id,
            status:"Cancel",
            dispatch_cancel_order:remarks,
            stock_data: details?.stock_data
          });

          var requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
          };

          await fetch(
            `https://gsidev.ordosolution.com/api/dispatch_cancel/`,
            requestOptions
          )
            .then((response) => {
              if (response.status === 200) {
                setModalVisible2(false);
                Toast.show("Order Canceled successfully", Toast.LONG);
                setIsUpdating(false);
                navigation.navigate('ProductionManage',{screenNameP : screenNameP,typeP :typeP ,type1P :type1P,type2P : type2P })
              }else{
                Toast.show("Server loading please try again", Toast.LONG);
                setIsUpdating(false);

              }
            })
              .catch((error) =>{ console.log("api error", error);  setIsUpdating(false); });
        },
      },
    ]);
  };


  const handleDropdownChange = (item, index) => {
    const newRows = [...rows];
    newRows[index].dropdownValue = item.value;
    setRows(newRows);

    const newSelectedOptions = [...selectedOptions];
    newSelectedOptions[index] = item.value;
    setSelectedOptions(newSelectedOptions);
  };

  const handleOtherChargesChange = (value, index) => {
    const newRows = [...rows];
    newRows[index].otherChargesValue = value;
    setRows(newRows);
  };

  const getDropdownData = (index) => {
    const data1 =
      details.transportation_type === "Pick-Up" ? pickDrop : delDrop;
    console.log("consoled", data1);
    return data1.filter(
      (option) =>
        !selectedOptions.includes(option.value) ||
        selectedOptions[index] === option.value
    );
  };

  const addCharges = async () => {
    // Display a confirmation dialog
    Alert.alert("Add Charges", "Do you wish to add charges?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "Yes",
        onPress: async () => {
          // setLoading(true);
          var myHeaders = new Headers();
          myHeaders.append("Content-Type", "application/json");
          myHeaders.append("Authorization", `Bearer ${userData.token}`);

          const formattedCharges = rows.map((row) => ({
            type: row.dropdownValue,
            charges: (Number(row.textInputValue) / 100).toFixed(2),
            otherChargesValue: row.otherChargesValue,
          }));

          const raw = JSON.stringify({
            so_id: details.id,
            charges: formattedCharges,
            operation: "create",
          });

          console.log("raw charges",raw)

          var requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
          };

          await fetch(
            `https://gsidev.ordosolution.com/api/so_order_charges/`,
            requestOptions
          )
            .then((response) => response.json())
            .then((res) => {
              setLoading(false);
              console.log("🚀 ~ .then ~ response:---------->", res);
              Toast.show("Charges Added successfully", Toast.LONG);
              navigation.goBack();
            })

            .catch((error) => console.log("api error", error));
        },
      },
    ]);
  };



  const CloseSalesOder= async () => {

    // Display a confirmation dialog
    Alert.alert("Close Order", "Are you sure you want to Close this Order", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "Yes",
        onPress: async () => {
          setIsUpdating(true);
          var myHeaders = new Headers();
          myHeaders.append("Content-Type", "application/json");
          myHeaders.append("Authorization", `Bearer ${userData.token}`);

          const raw = JSON.stringify({
            status: "Delivered",
            do_close: "TRUE",
            closing_reason:remarks1
          });

          console.log("Raw Charges ----------------------->",raw);

          var requestOptions = {
            method: "PUT",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
          };

          await fetch(
            `https://gsidev.ordosolution.com/api/sales_order/${details.id}/`,
            requestOptions
          )
            .then((response) => response.json())
            .then((res) => {
              setIsUpdating(false);
              setRemarks1('');
              setModalVisible2(false);
              Toast.show("Order Closed successfully", Toast.LONG);
              navigation.navigate('ProductionManage',{screenNameP : screenNameP,typeP :typeP ,type1P :type1P,type2P : type2P })
            })
            .catch((error) => {console.log("api error", error);  setIsUpdating(false);});
        },
      },
    ]);
  };

  const CheckEmpty = () => {
    if (ScreenName !== "fleet") {
      for (let product of products) {
        if (!product.loaded_weight || parseFloat(product.loaded_weight) === 0) {
          Alert.alert(
            "Validation Error",
            `Please enter the loaded weight for ${product.name}.`
          );
          return;
        }
      }

      setModalVisible(true);

    } else {
      addCharges();
    }
  };


  const changeStatus = async (status) => {

    if (!vehicleNo || !driverName) {
      Alert.alert("Warning", "Please fill the Dispatch Details");
      return;
    }

    Alert.alert(
      status === "P" ? "Dispatch Orer" : "Complete Delivery",
      status === "P"
        ? "Are you sure you want to dispatch this order ?"
        : "Do you wish to mark this as completed ?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            const handleApiCalls = async () => {
              setLoading(true);
              const myHeaders = new Headers();

              myHeaders.append("Content-Type", "application/json");
              myHeaders.append("Authorization", `Bearer ${userData.token}`);

              // Call the so_order_charges API first
              const formattedCharges = rows.map((row) => ({
                type: row.dropdownValue,
                charges: (Number(row.textInputValue) / 100).toFixed(2),
                otherChargesValue: row.otherChargesValue,
              }));

              console.log("FormattedCharges", formattedCharges);

              const secondApiUrl = "https://gsidev.ordosolution.com/api/so_order_charges/";
              
              const raw = JSON.stringify({
                so_id: details.id,
                charges: formattedCharges,
                operation: "create",
              });

              console.log("Raw Charges-------------->",raw)

              const secondRequestOptions = {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow",
              };

              try {
                const secondResponse = await fetch(
                  secondApiUrl,
                  secondRequestOptions
                );

                console.log("🚀 ~ handleApiCalls ~ secondResponse:", secondResponse );

                if (secondResponse.ok) { 
                  setModalVisible(false);
                  console.log( "First API call succeeded, now calling the sales_order API");

                  // Call the sales_order API after successful so_order_charges API call
                  let url = `https://gsidev.ordosolution.com/api/sales_dispatch_save/${details.id}/`;

                  const filteredData = products.map((product) => ({
                    id: product.id,
                    pickup_loaded_weight: parseFloat(product.loaded_weight),
                    loaded_bundle:product?.loaded_bundle ? product?.loaded_bundle : 0
                  }));

                  const so_raw = JSON.stringify({
                    status:"Delivery Assigned",
                    product_weight: filteredData,
                    pickup_vehicle_no: vehicleNo,
                    pickup_driver_name: driverName,
                  });

                  const requestOptions = {
                    method: "PUT",
                    headers: myHeaders,
                    body: so_raw,
                    redirect: "follow",
                  };

                  const response = await fetch(url, requestOptions);

                  if (response.status === 200) {
                    console.log("Second API call succeeded");
                    navigation.navigate('ProductionManage',{screenNameP : screenNameP,typeP :typeP ,type1P :type1P,type2P : type2P })
                    setModalVisible(false);
                  } else {
                    console.log(
                      "Second API call failed",
                      response.status,
                      response.statusText
                    );
                    navigation.navigate('ProductionManage',{screenNameP : screenNameP,typeP :typeP ,type1P :type1P,type2P : type2P })
                    setModalVisible(false);
                  }
                } else {
                  const errorText = await secondResponse.text();
                  console.log(
                    "First API call failed",
                    secondResponse.status,
                    secondResponse.statusText,
                    errorText
                  );
                }
              } catch (error) {
                console.log("API error:", error);
              } finally {
                setLoading(false);
              }
            };
            await handleApiCalls();
          },
        },
      ]
    );
  };



  return (
    <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 0} 
  >
    <View style={{ flex: 1, backgroundColor: "white", padding: 24 }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => ScreenName === 'fleet'? navigation.goBack() : navigation.navigate('ProductionManage',{screenNameP : screenNameP,typeP :typeP ,type1P :type1P,type2P : type2P })}>
          {/* <AntDesign name='arrowleft' size={25} color={Colors.primary} /> */}
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
              {details.name} ({details.supplier_name}-{details.supplier_id})
            </Text>
          ) : (
            <Text
              style={{
                fontSize: 20,
                color: Colors.primary,
                fontFamily: "AvenirNextCyr-Medium",
              }}
            >
              {details.name} ({details.assignee_name}-{details.assigne_to})
            </Text>
          )}
        </View>
        {(details.status === "Delivered" || details?.status === "Partially Delivered") && details?.transportation_type === "Delivery" && 
        <TouchableOpacity
            style={
              {
                backgroundColor: Colors.primary,
                alignItems: "center",
                justifyContent: "center",
                padding: 10,
                borderRadius: 6,
              }
            }
            onPress={() => {
              setSelectedSign(details?.customer_signatures[0]?.customer_sign);

              setShowSingnature(true);
            }}
          >
            <FontAwesome
              name="pencil-square-o"
              size={20}
              color={"white"}
            />
          </TouchableOpacity>
        }

        <View></View>
      </View>

      <ScrollView>
        <View style={[styles.card, { flex: 0 }]}>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingLeft: "5%",
              paddingVertical: "5%",
              alignItems: "center",
              borderBottomWidth: 1,
              borderBottomColor: "#D3D3D3",
            }}
            onPress={toggleDetails}
          >
            <Text style={styles.cardTitle}>Order Details</Text>

            <View style={{ flexDirection: "row", gap: 15 }}>
              <View
                style={{
                  paddingHorizontal: "4%",
                  backgroundColor:
                    details.status === "Cancel" ||
                    details.status === "Cancelled"
                      ? "#d11a2a"
                      : details.status === "Pending" ||
                        details.status === "Production Completed"
                      ? "orange"
                      : details.status === "In Transit"
                      ? "#005000"
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
                  {details.status === "Cancel"
                    ? "Canceled"
                    : details.status === "In Transit"
                    ? "In Transit"
                    : details.status}
                </Text>
              </View>
              <AntDesign name="down" color="black" size={20} />
            </View>
          </TouchableOpacity>

          {expanded && (
            <View style={styles.expandedContent}>
              <View style={{ paddingHorizontal: "5%", paddingBottom: "2%" }}>
                <View style={styles.row}>
                  <Text style={styles.title}>Bill To</Text>
                  <Text style={styles.value}>{details?.company_name}</Text>
                </View>

                <View style={styles.row}>
                  <Text style={styles.title}>Order ID</Text>
                  <Text style={styles.value}>{details?.name}</Text>
                </View>

                <View style={styles.row}>
                  <Text style={styles.title}>
                    {screen === "PO" ? "Supplier" : "Customer"}
                  </Text>
                  <Text
                    style={[styles.value, { textAlign: "right", width: "72%" }]}
                  >
                    {screen === "PO"
                      ? details.supplier_name
                      : details.assignee_name}
                  </Text>
                </View>

                <View style={styles.row}>
                  <Text style={styles.title}>Order Placed</Text>
                  <Text style={styles.value}>
                    {ConvertDateTime(details?.created_at).formattedDate}{" "}
                    {ConvertDateTime(details?.created_at).formattedTime}
                  </Text>
                </View>

                <View style={styles.row}>
                  <Text style={styles.title}>Created By</Text>
                  <Text style={styles.value}>
                    {details?.created_by}
                  </Text>
                </View>
                  <View style={{...styles.row}}>
                    <Text style={{...styles.title}}>Site Address</Text>
                    <Text style={{...styles.value,flex:1, textAlign: 'right'}} numberOfLines={2}>{details?.site_address}</Text>
                </View>

                        <View style={{ ...styles.row }}>
                <Text style={{ ...styles.title }}>Order Image</Text>
                <TouchableOpacity onPress={() => setModalVisibleBill(true)}>
                    <Text style={{ ...styles.value,color:'blue' }}>
                        View
                    </Text>
                </TouchableOpacity>
            </View>
            {details?.transportation_type === "Pick-Up" && (
  <>
    <View style={styles.row}>
      <Text style={styles.title}>Transportation types</Text>
      <View style={{ flexDirection: 'row', marginTop: 3 }}>
        <Text style={styles.value}>{details?.transportation_type}</Text>
        {details?.status === "Production Completed" && ScreenName !== "fleet" && (
          <TouchableOpacity onPress={() => setModalVisible1(true)}>
            <AntDesign name="edit" color="black" size={20} />
          </TouchableOpacity>
        )}
      </View>
    </View>

    <View style={styles.row}>
      <Text style={styles.title}>Driver Name</Text>
      <Text style={styles.value}>
        {details?.driver_name ? details.driver_name : '-'}
      </Text>
    </View>

    <View style={styles.row}>
      <Text style={styles.title}>Vehicle No</Text>
      <Text style={styles.value}>
        {details?.vehicle_no ? details.vehicle_no : '-'}
      </Text>
    </View>
  </>
)}
                  {details?.transportation_type === "Delivery" && (
                  <>
                  <View style={styles.row}>
                    <Text style={styles.title}>Transportation type</Text>
                    <View style={{ flexDirection: 'row', marginTop: 3 }}>
        <Text style={styles.value}>{details?.transportation_type}</Text>
        {details?.status === "Production Completed" && ScreenName !== "fleet" && (
          <TouchableOpacity onPress={() => setModalVisible1(true)}>
            <AntDesign name="edit" color="black" size={20} />
          </TouchableOpacity>
        )}
      </View>
    </View>
                <View style={styles.row}>
                  <Text style={styles.title}>Driver Name</Text>
                  <Text style={styles.value}>
                  {details?.driver_name ? details.driver_name : '-'}
                  </Text>
                </View>
                   <View style={styles.row}>
                   <Text style={styles.title}>Vehicle No</Text>
                   <Text style={styles.value}>
                   {details?.vehicle_no ? details.vehicle_no : '-'}
                   </Text>
                 </View>
                </>
                )}
                <View style={styles.row}>
                  <Text style={styles.title}>Total Price</Text>
                  <Text style={styles.value}>
                  { Number(details?.total_price)? 
                    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(details?.total_price)) : 
                    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(0)
                  }
                  </Text>
                </View>
                {details.status === "Cancel" && details?.dispatch_cancel_order ?
                 <Text style={[styles.value,{color:'red'}]}>
                    Remarks: {details?.dispatch_cancel_order}
                  </Text> :null
                }
              </View>
            </View>
          )}
        </View>

        {details?.transportation_type !== "Pick-Up" &&
          details?.transportation_type !== "Delivery" && (
            <View
              style={[
                styles.card,
                { marginTop: "1%", flex: expanded2 ? 1 : 0 }
              ]}
            >
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingHorizontal: "5%",
                  paddingVertical: "3%",
                  borderBottomWidth: 1,
                  borderBottomColor: "grey" }}
                  onPress={toggleExpansion2}
              >
                <Text style={styles.cardTitle}>Delivery Details</Text>
                <View style={{ flexDirection: "row", gap: 10 }}>
                  <AntDesign name="down" color="black" size={20} />
                </View>
              </TouchableOpacity>

              {expanded2 && (
                <View style={styles.ProductListContainer}>
                  <FlatList
                    showsVerticalScrollIndicator={false}
                    data={details?.vehicle}
                    keyboardShouldPersistTaps="handled"
                    renderItem={({ item }) => (
                      <View style={styles.elementsView}>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              gap: 4
                            }}
                          >
                            <FontAwesome5 name="truck" color="grey" size={20} />
                            <Text
                              style={{
                                color: "black",
                                fontSize: 14,
                                fontFamily: "AvenirNextCyr-Bold",
                                marginTop: 5,
                              }}
                            >
                              {item.registration_number}
                            </Text>
                          </View>

                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              gap: 4,
                            }}
                          >
                            <FontAwesome5 name="user" color="grey" size={20} />
                            <Text
                              style={{
                                color: "black",
                                fontSize: 14,
                                fontFamily: "AvenirNextCyr-Bold",
                                marginTop: 5,
                              }}
                            >
                              {item.driver_name}
                            </Text>
                          </View>
                        </View>
                      </View>
                    )}
                  />
                </View>
              )}
            </View>
          )}

        {( ScreenName === "fleet" ) && (
          <View style={[styles.card, { flex: 0 }]}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingLeft: "5%",
                paddingVertical: "3%",
                alignItems: "center",
                borderBottomWidth: 1,
                borderBottomColor: "#D3D3D3",
              }}
            >
              <Text style={styles.cardTitle}>Add Charges</Text>
              {/* { ScreenName ==='fleet'|| details.status !== "Delivered" && details.charges.length <= 0 && ( */}
              <TouchableOpacity style={styles.buttonContainer} onPress={addRow}>
                <Text style={styles.buttonText}>Add</Text>
                <Entypo name="plus" color="white" size={20} />
              </TouchableOpacity>
              {/* )} */}
            </View>

            <View style={{ flex: 1, padding: 20, backgroundColor: "#f8f8f8" }}>
              {/* Render prepopulated charges */}
              {details.charges.map((charge, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: "row",
                    marginBottom: 10,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      flex: 1,
                      marginRight: 10,
                      padding: 8,
                      borderWidth: 1,
                      borderColor: "#ccc",
                      backgroundColor: "#f0f0f0",
                      color: "black",
                    }}
                  >
                    {charge.type}
                  </Text>
                  <Text
                    style={{
                      flex: 1,
                      borderWidth: 1,
                      borderColor: "#ccc",
                      padding: 10,
                      backgroundColor: "#f0f0f0",
                      color: "black",
                    }}
                  >
                    ₹ {charge.charges.toFixed(2)}
                  </Text>
                </View>
              ))}

              {/* Render new/additional charges only if status is not Delivered */}
              {details.status !== "Delivered" &&
                details.charges.length <= 0 &&
                rows.map((row, index) => (
                  <View>
                    <View
                      key={index}
                      style={{
                        flexDirection: "row",
                        marginBottom: 10,
                        alignItems: "center",
                      }}
                    >
                      <Dropdown
                        style={{
                          flex: 1,
                          marginRight: 10,
                          borderWidth: 1,
                          borderColor: "#ccc",
                          backgroundColor: "#fff",
                          padding: 8,
                        }}
                        data={getDropdownData(index)}
                        placeholderStyle={{ fontSize: 14, color: "#888" }}
                        selectedTextStyle={{ fontSize: 14, color: "black" }}
                        inputSearchStyle={{
                          height: 30,
                          fontSize: 14,
                          color: "black",
                        }}
                        itemTextStyle={{ fontSize: 15, color: "black" }}
                        labelField="label"
                        valueField="value"
                        placeholder="Select option"
                        value={row.dropdownValue}
                        onChange={(item) => handleDropdownChange(item, index)}
                      />
                      <MaskedTextInput
                        type="currency"
                        options={{
                          prefix: "₹ ",
                          decimalSeparator: ".",
                          groupSeparator: ",",
                          precision: 2,
                        }}
                        value={row.textInputValue}
                        onChangeText={(text, rawText) => {
                          const newRows = [...rows];
                          newRows[index].textInputValue = rawText;
                          setRows(newRows);
                        }}
                        style={{
                          flex: 1,
                          borderWidth: 1,
                          borderColor: "#ccc",
                          padding: 10,
                          backgroundColor: "#fff",
                          color: "black",
                        }}
                        keyboardType="numeric"
                      />
                      <TouchableOpacity
                        onPress={() => deleteRow(index)}
                        style={{ marginLeft: "1%" }}
                      >
                        <AntDesign name="delete" color="black" size={20} />
                      </TouchableOpacity>
                    </View>
                    {row.dropdownValue === "Other Charges" && (
                      <TextInput
                        style={{
                          borderWidth: 1,
                          borderColor: "#cccccc",
                          borderRadius: 5,
                          padding: 5,
                          marginTop: 5,
                          marginBottom: 5,
                          fontFamily: "AvenirNextCyr-Medium",
                          fontSize: 14,
                          backgroundColor: "white",
                          color: "black",
                        }}
                        placeholder="Enter Others..."
                        placeholderTextColor={"gray"}
                        onChangeText={(text) =>
                          handleOtherChargesChange(text, index)
                        }
                        value={row.otherChargesValue}
                      />
                    )}
                  </View>
                ))}

              {/* Total Payable Section */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 20,
                }}
              >
                <Text
                  style={{
                    fontFamily: "AvenirNextCyr-Bold",
                    fontSize: 16,
                    color: Colors.black,
                  }}
                >
                  Total Payable :
                </Text>
                {details.status !== "Delivered" &&
                  (details.transportation_type === "Delivery" &&
                  details.status === "Production Completed" &&
                  details.charges.length > 0 ? (
                    <Text
                      style={{
                        fontFamily: "AvenirNextCyr-Bold",
                        fontSize: 16,
                        color: Colors.black,
                      }}
                    >
                      {parseFloat(details?.total_price).toFixed(2)}
                    </Text>
                  ) : (
                    <Text
                      style={{
                        fontFamily: "AvenirNextCyr-Bold",
                        fontSize: 16,
                        color: Colors.black,
                      }}
                    >
                      ₹{" "}
                      {(
                        details.charges.reduce(
                          (total, charge) => total + parseFloat(charge.charges),
                          0
                        ) +
                        parseFloat(details?.total_price) + // Add total_price only once
                        rows.reduce(
                          (total, row) =>
                            total + parseFloat(row.textInputValue || 0) / 100,
                          0
                        )
                      ).toFixed(2)}
                    </Text>
                  ))}

                {details.status === "Delivered" && (
                  <Text
                    style={{ fontFamily: "AvenirNextCyr-Bold", fontSize: 16 }}
                  >
                    {parseFloat(details?.total_price).toFixed(2)}
                  </Text>
                )}
              </View>
            </View>
          </View>
        )}

        {details.charges.length !== 0 && (
          <View style={[styles.card]}>
            <Text
              style={[styles.cardTitle, { marginTop: "4%", marginLeft: "3%" }]}
            >
              Added Charges
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottomWidth: 1,
                borderBottomColor: "#D3D3D3",
              }}
            >
              <View
                style={{ flex: 1, padding: 20, backgroundColor: "#f8f8f8" }}
              >
                {/* Render prepopulated charges */}
                {details.charges.map((charge, index) => (
                  <View
                    key={index}
                    style={{
                      flexDirection: "row",
                      marginBottom: 10,
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        flex: 1,
                        marginRight: 10,
                        padding: 8,
                        borderWidth: 1,
                        borderColor: "#ccc",
                        backgroundColor: "#f0f0f0",
                        color: "black",
                      }}
                    >
                      {charge.type}
                    </Text>
                    <Text
                      style={{
                        flex: 1,
                        borderWidth: 1,
                        borderColor: "#ccc",
                        padding: 10,
                        backgroundColor: "#f0f0f0",
                        color: "black",
                      }}
                    >
                      ₹ {charge.charges.toFixed(2)}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        <View
          style={[styles.card, { marginTop: "1%", flex: expanded1 ? 1 : 0 }]}
        >
          <TouchableOpacity
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: "5%",
              paddingVertical: "3%",
              borderBottomWidth: 1,
              borderBottomColor: "grey",
            }}
            onPress={toggleExpansion1}
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
          </TouchableOpacity>

          {expanded1 && (
            <View style={styles.ProductListContainer}>
              <FlatList
                showsVerticalScrollIndicator={false}
                data={products}
                keyboardShouldPersistTaps="handled"
                renderItem={({ item, index }) => (
                  <View style={styles.elementsView}>
                    <View style={{ flexDirection: "row", justifyContent: "center" }} >
                      <Pressable>
                        {item.product_image && item.product_image.length > 0 ? (
                          <Image
                            source={{ uri: item.product_image[0] }} 
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
                          flexDirection:'column'
                        }} >
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }} >
                        <View
                          style={{
                            flexDirection: "column",
                            justifyContent: "space-between",
                            width:"70%"}} >
                        <Text
                          style={{
                            color: Colors.primary,
                            fontSize: 14,
                            fontFamily: "AvenirNextCyr-Medium",
                            marginTop: 5 }} >
                          {item?.name}
                        </Text>
                        <Text
                          style={{
                            color: "gray",
                            fontSize: 11,
                            fontFamily: "AvenirNextCyr-Medium",
                          }}
                        >
                          {item?.product_category}{" "}
                        </Text>
                      </View>
                       
                     <TouchableOpacity 
                        style={{ height: 32,
                          paddingHorizontal: 5,
                          borderRadius: 10,
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: item?.availableStock ? 'rgba(0, 128, 0, 0.6)':Colors.primary ,
                          flexDirection:'row',
                          gap:3 }}
                          onPress={()=>{ setSelectedItemName(item?.name);  openModel(item?.production_order);}}>
                        <Text style={{color:'white', fontSize:11, fontFamily: "AvenirNextCyr-Bold"}}>View</Text>
                     </TouchableOpacity>
                     </View>
                     {
                          details?.product_list[0]?.name === "BASE PLATE" &&
                          <View style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent:"space-between"
                          }}>

                          <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                          }}
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
                            {item?.qty}{" "}
                            {item?.loaded_uom ? item?.loaded_uom : item?.umo}
                          </Text>
                        </View>
                             
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center" }} >
                            <Text
                              style={{
                                color: "black",
                                fontSize: 12,
                                fontFamily: "AvenirNextCyr-Medium" }} >
                              Price :{" "}
                            </Text>
                            <Text
                              style={{
                                color: "black",
                                fontSize: 12,
                                fontFamily: "AvenirNextCyr-Medium",
                              }}
                            >
                              {parseFloat(item?.price).toFixed(2)}{" "}
                            </Text>
                          </View>
                          </View>
                     }
                     {
                          details?.product_list[0]?.name !== "BASE PLATE" &&
                        <View
                          style={{
                            flexDirection: "column",
                            marginTop: "3%",
                          }}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              }} >
                            <Text
                              style={{
                                color: "black",
                                fontSize: 12,
                                fontFamily: "AvenirNextCyr-Medium" }} >
                              {details?.status === "Production Completed" ? "Consumed Weight : " : "Loaded Weight : " }
                            </Text>
                            <Text
                              style={{ color: "black", fontSize: 12, fontFamily: "AvenirNextCyr-Medium",width:'36%'}} >
                             {details?.status === "Production Completed"  ? item?.roofing_consumed_weight : item?.roofing_production_weight}Kg
                            </Text>
                          </View>
                         
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center" ,

                              }} >
                            <Text
                              style={{
                                color: "black",
                                fontSize: 12,
                                fontFamily: "AvenirNextCyr-Medium",
                                }} >
                              Price :{" "}
                            </Text>
                            <Text
                              style={{
                                color: "black",
                                fontSize: 12,
                                fontFamily: "AvenirNextCyr-Medium",
                              }}
                            >
                              {parseFloat(item?.price).toFixed(2)}{" "}
                            </Text>
                          </View>
                        </View>
                }
                {
                      item?.product_remarks && (
                      <View style={{ flexDirection: 'row',justifyContent:'space-between'}}>
                      <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}>Product Remark :</Text>
                      <Text style={{ color: 'green', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium',width:'55%'}}>{item?.product_remarks}</Text>
                      </View>
                      )
                  }
                       
                         </View>
                      </View>
                      
                  </View>
                )}
                // keyExtractor={(item) => item.id.toString()}
              />
            </View>
          )}
        </View>

        <View></View>

        <ProgressDialog
          visible={loading}
          // title="Uploading file"
          dialogStyle={{ width: "50%", alignSelf: "center" }}
          message="Please wait..."
          titleStyle={{ fontFamily: "AvenirNextCyr-Medium", fontSize: 16 }}
          messageStyle={{ fontFamily: "AvenirNextCyr-Medium", fontSize: 14 }}
        />
      </ScrollView>

      { ScreenName === "fleet" && (
        <View style={{ flexDirection: "row", justifyContent: "space-between",gap:5 }}>
          <TouchableOpacity
            onPress={() => {
              CheckEmpty();
            }}
            style={[
              styles.TwoButtons,
              { backgroundColor: "green", marginTop: "2%" },
            ]}
          >
            <Text style={styles.Btext}>
              Add Charges
            </Text>
          </TouchableOpacity>
        </View>
      )}


      <Modal visible={modalVisible} transparent>
        <View style={styles.modalContainer1}>
          <View style={styles.modalContent11}>
            <TouchableOpacity
              style={styles.closeIcon}
              onPress={() => setModalVisible(false)}
            >
              <AntDesign name="close" color="black" size={25} />
            </TouchableOpacity>
            <Text style={styles.ModalText1}>Dispatch Details:</Text>

            <View style={{ marginHorizontal: "1%", marginTop: "3%", gap: 10 }}>
              <TextInput1
                style={styles.inputText}
                value={driverName}
                autoCapitalize="none"
                mode="outlined"
                theme={{ colors: { onSurfaceVariant: "#4b0482" } }}
                activeOutlineColor="#4b0482"
                outlineColor="#B6B4B4"
                textColor="#4b0482"
                label="Driver Name"
                onChangeText={(val) => {
                  setDriverName(val);
                }}
              />

              <TextInput1
                style={styles.inputText}
                value={vehicleNo}
                autoCapitalize="none"
                theme={{ colors: { onSurfaceVariant: "#4b0482" } }}
                activeOutlineColor="#4b0482"
                outlineColor="#B6B4B4"
                textColor="#4b0482"
                mode="outlined"
                label="Vehicle No"
                onChangeText={(val) => {
                  setVehicleNo(val);
                }}
              />

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
                    changeStatus("P");
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
                      style={{
                        fontFamily: "AvenirNextCyr-Bold",
                        color: "white",
                      }}
                    >
                      Submit
                    </Text>
                  )}
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={visible1} transparent={true}>
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
                  setVisible1(false);
                }}
              >
                <AntDesign name="close" color="black" size={20} />
              </TouchableOpacity>
            </View>
            <View style={{ marginVertical: "4%" }}>
              <TextInput1
                mode="outlined"
                label="Remarks"
                value={DispatchRemarks}
                theme={{ colors: { onSurfaceVariant: "#4b0482" } }}
                activeOutlineColor="#4b0482"
                outlineColor="#B6B4B4"
                textColor="#4b0482"
                multiline={true}
                numberOfLines={4}
                onChangeText={(text) => setDispatchRemarks(text)}
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
                onPress={()=>moveToCollection()}
                style={{
                  paddingVertical: "4%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                 
            
                  <Text
                    style={{ fontFamily: "AvenirNextCyr-Bold", color: "white" }}
                  >
                    Submit
                  </Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>
      </Modal>

<Modal visible={showSingnature} transparent animationType="slide">
  <View style={styles.modalContainer}>
    <View style={styles.modalContent1}>
      <TouchableOpacity
        style={styles.modalCloseButton}
        onPress={() => setShowSingnature(false)}
      >
        <AntDesign name="close" size={24} color="gray" />
      </TouchableOpacity>
      <Text style={styles.modalHeader}>Customer Signature</Text>
      
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 16 }}>
      {details?.customer_signatures?.length > 0 ? (
          details?.customer_signatures?.map((signature, index) => (
          <View key={signature.route_id} style={{ flex: 1, marginVertical: 8 }}>
            {/* Signature Details */}
            <View
              style={{
                flex: 1,
                borderWidth: 3,
                borderStyle: "dotted",
                borderColor: "#F2F2F2",
                margin: 3,
                borderRadius: 5,
              }}
            >
              <Text
                style={{
                  fontFamily: "AvenirNextCyr-Medium",
                  fontSize: 16,
                  color: Colors.black,
                  padding: '2%',
                }}
              >
              <Text
                style={{
                  fontFamily: "AvenirNextCyr-Bold",
                  fontSize: 16,
                  color: Colors.black,
                  padding: '2%',
                }}
              >  Route Id :</Text> {signature.route_id}
              </Text>

              {/* Signature Image */}
              <Image
                source={{ uri: signature.customer_sign }}
                style={{ width: '100%', height: 200, resizeMode: 'contain' }} 
              />

              {/* Signature Date and Time */}
              <Text
                style={{
                  fontFamily: "AvenirNextCyr-Medium",
                  fontSize: 14,
                  color: Colors.gray,
                  padding: '2%',
                }}
              >
                 <Text
                style={{
                  fontFamily: "AvenirNextCyr-Bold",
                  fontSize: 16,
                  color: Colors.black,
                  padding: '2%',
                }}
              > Created at : </Text>{new Date(signature.created_at).toLocaleDateString()}  {new Date(signature.created_at).toLocaleTimeString()}
              </Text>
            </View>

            {/* Add a divider between signatures, except for the last one */}
            {index !== details.customer_signatures.length - 1 && (
              <View
                style={{
                  height: 1,
                  backgroundColor: 'gray',
                  marginVertical: 8,
                }}
              />
            )}
          </View>
          ))
          ) : (
               <View
              style={{
                flex: 1,
                borderWidth: 3,
                borderStyle: "dotted",
                borderColor: "#F2F2F2",
                margin: 3,
                borderRadius: 5,
              }}
            >
          <Text
            style={{
              fontFamily: "AvenirNextCyr-Medium",
              fontSize: 16,
              color: '#b3b3b3',
              textAlign: 'center',
              marginTop: '40%',
            }}
          >
            No signature
          </Text>
          </View>

        )}
      </ScrollView>
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
        {details?.order_images?.length > 0 ? (
          details.order_images.map((imageUri, index) => (
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
                style={{ fontFamily: "AvenirNextCyr-Medium", fontSize: 16,color:Colors.black }}
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
                onPress={handleCancel}
                style={{
                  paddingVertical: "4%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >


            {isUpdating ? (
                    <ActivityIndicator size={28} color={Colors.white} />
                  ) : 
                <Text
                  style={{ fontFamily: "AvenirNextCyr-Bold", color: "white" }}
                >
                  Submit
                </Text>
              }
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>
      </Modal>

      <Modal
        transparent={true}
        visible={modalVisible1}
        onRequestClose={() => setModalVisible1(false)}
      >
        <View style={styles.modalContainer}>
          <View  style={{
                backgroundColor: "white",
                paddingHorizontal: 5,
                borderRadius: 8,
                paddingVertical: "4%",
                // flex:0.3
                width:'90%'
              }}>
            <Text  style={{
                    fontSize: 19,
                    color: "black",
                    fontFamily: "AvenirNextCyr-Bold",
                    marginLeft:'4%'
                  }}>Select Transportation Type</Text>

            <View
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
                    width: "40%",
                    paddingVertical: "1%",
                    backgroundColor:
                    selectedOption === "Delivery" ? Colors.primary : "white",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 30,
                  }}
                >
                  <RadioButton.Android
                    color={"white"}
                    status={selectedOption === "Delivery" ? "checked" : "unchecked"}
                    onPress={() => handleSelect("Delivery")}
                  />
                  <TouchableOpacity onPress={() => handleSelect("Delivery")}>
                    <Text
                      style={{
                        fontFamily: "AvenirNextCyr-Medium",
                        fontSize: 15,
                        color: selectedOption === "Delivery" ? "white" : "black",
                      }}
                    >
                      Delivery
                    </Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    paddingVertical: "1%",
                    backgroundColor:
                    selectedOption === "Pick-Up" ? Colors.primary : "white",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 30,
                    width: "40%",
                  }}
                >
                  <RadioButton.Android
                    color={"white"}
                    status={selectedOption === "Pick-Up" ? "checked" : "unchecked"}
                    onPress={() => handleSelect("Pick-Up")}
                  />
                  <TouchableOpacity onPress={() => handleSelect("Pick-Up")}>
                    <Text
                      style={{
                        fontFamily: "AvenirNextCyr-Medium",
                        fontSize: 15,
                        color: selectedOption === "Pick-Up" ? "white" : "black",
                      }}
                    >
                      Pick-Up
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <TextInput1
                mode="outlined"
                label="Remarks"
                value={remarks1}
                theme={{ colors: { onSurfaceVariant: "#4b0482" } }}
                activeOutlineColor="#4b0482"
                outlineColor="#B6B4B4"
                textColor="#4b0482"
                multiline={true}
                numberOfLines={4}
                onChangeText={(text) => setRemarks1(text)}
                returnKeyType="next"
                blurOnSubmit={false}
                outlineStyle={{ borderRadius: 10 }}
                style={{ height: 60 ,marginHorizontal:'3%'}}
              />

              <TouchableOpacity
                style={{ position: "absolute", top: 10, right: 10 }}
                onPress={() => setModalVisible1(false)}
              >
                <MaterialIcons name="close" size={24} color="black" />
              </TouchableOpacity>

              <LinearGradient
                  colors={Colors.linearColors}
                  start={Colors.start}
                  end={Colors.end}
                  locations={Colors.ButtonsLocation}
                  style={{
                    backgroundColor: Colors.primary,
                    borderColor: Colors.primary,
                    borderRadius: 50,
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                    marginHorizontal:'10%',
                    marginVertical:'4%'
                  }}
                >
                  <TouchableOpacity
                    style={{
                      width: '45%', justifyContent: "center",
                      paddingVertical: "4%",
                      alignItems: "center",
                    }}
                    onPress={handleSave}
                  >
                    <Text style={{
                      fontFamily: "AvenirNextCyr-Medium",
                      color: "#fff",
                      fontSize: 16,
                    }}>Save Changes</Text>
                  </TouchableOpacity>
                </LinearGradient>
          </View>
        </View>
      </Modal>

<Modal
  transparent={true}
  visible={modalVisible2}
  onRequestClose={() => setModalVisible2(false)}
>
  <View style={styles.modalContainer}>
    <View
      style={{
        backgroundColor: "white",
        paddingHorizontal: 5,
        borderRadius: 8,
        paddingVertical: "4%",
        width: '95%',
        marginVertical: '15%',
      }}
    >
      <>
        <TextInput1
          mode="outlined"
          label="Remarks"
          value={remarks1}
          theme={{ colors: { onSurfaceVariant: "#4b0482" } }}
          activeOutlineColor="#4b0482"
          outlineColor="#B6B4B4"
          textColor="#4b0482"
          multiline={true}
          numberOfLines={4}
          onChangeText={(text) => setRemarks1(text)}
          returnKeyType="next"
          blurOnSubmit={false}
          outlineStyle={{ borderRadius: 10 }}
          style={{ height: 70, marginHorizontal: '3%', paddingVertical: "4%", marginTop: '5%' }}
        />

        <TouchableOpacity
          style={{ position: "absolute", top: 8, right: 10 }}
          onPress={() => setModalVisible2(false)}>
          <MaterialIcons name="close" size={24} color="black" />
        </TouchableOpacity>

        <LinearGradient
          colors={Colors.linearColors}
          start={Colors.start}
          end={Colors.end}
          locations={Colors.ButtonsLocation}

          style={{
            backgroundColor: Colors.primary,
            borderColor: Colors.primary,
            borderRadius: 9,
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            marginHorizontal: '3%',
            marginVertical: '4%'
          }}

        >
          <TouchableOpacity
            style={{
              width: '45%',
              justifyContent: "center",
              paddingVertical: "4%",
              alignItems: "center"
            }}
            onPress={CloseSalesOder}>

           {isUpdating ? (
                    <ActivityIndicator size={28} color={Colors.white} />
                  ) : 
            <Text
              style={{
                fontFamily: "AvenirNextCyr-Medium",
                color: "#fff",
                fontSize: 16
              }}
            >
              Save Changes
            </Text>
           }
          </TouchableOpacity>
        </LinearGradient>
      </>
    </View>
  </View>
</Modal>

<Modal visible={visible3} transparent animationType="slide">
  <View style={styles.modalContainer}>
    <View style={[styles.modalContent1,{flex:1}]}>
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <TouchableOpacity
            style={styles.closeIcon}
            onPress={() => {
              hideModal11();
            }}
          >
            <AntDesign name="close" color="black" size={28} />
          </TouchableOpacity>

          <View style={{ marginHorizontal: '1%', marginTop: '3%', gap: 1 }}>
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 5 }} >
                <Text style={[styles.ModalText2,{width:'65%'}]} >
                  {selectedItemName}
                </Text>
              </View>
            </View>

            <FlatList
            data={productionViewData}
            renderItem={renderItem}
            // keyExtractor={(item ,index) => item.production_id.toString()}
          />

          </View>
      </KeyboardAvoidingView>
    </View>
  </View>
</Modal>

</View>

    {isCommentsModalVisible && (
           <Comments
             route={{ params: { orderId: details?.id } }}
             isModal={true}
             onClose={() => setIsCommentsModalVisible(false)}
           />
          )}
    </KeyboardAvoidingView>
  );
};

export default ProductionManageDetails;
const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
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
    width: 60,
    height: 60,
  },
  elementsView: {
    paddingHorizontal: "4%",
    borderBottomColor: "grey",
    borderBottomWidth: 0.5,
    paddingVertical: "2%",
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
    backgroundColor: "rgba(0, 0, 0, 0.5)"
  },
  heading: {
    fontSize: 22,
    color: Colors.primary,
    fontFamily: "AvenirNextCyr-Medium"
  },
  subHeading: {
    fontSize: 13,
    color: "grey",
    fontFamily: "AvenirNextCyr-Medium"
  },
  card: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginVertical: "4%",
    backgroundColor: "#F5F5F5",
    flex: 1
  },
  cardTitle: {
    fontSize: 15,
    fontFamily: "AvenirNextCyr-Medium",
    color: Colors.black
  },
  expandedContent: {
    marginTop: 10,
  },
  avatarImageContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderColor: "grey",
    borderWidth: 1,
    width: 80,
    height: 80,
    borderRadius: 50
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: "grey",
    overflow: "hidden"
  },
  modalContainer1: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center"
  },
  modalContent11: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 30,
    width: "90%"
  },
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 8,
    marginLeft: 15,
    marginRight: 15
  },
  submitButton1: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center"
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "AvenirNextCyr-Medium"
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1
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
  modalContent1: {
    width: "93%",
    height: "50%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: "2%",
    elevation: 10,
    marginVertical: "5%"
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
    fontFamily: "AvenirNextCyr-Medium"
  },
  inputText1: {
    fontFamily: "AvenirNextCyr-Medium",
    color: "black"
  },
  TwoButtons: {
    paddingVertical: "4%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    flex:1
  },
  Btext: {
    color: "white",
    fontFamily: "AvenirNextCyr-Bold",
    fontSize: 17,
  },
  buttonContainer: {
    height: 40,
    padding: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#65A765",
    marginRight: "5%",
    width: "20%",
    flexDirection: "row",
    gap: 3,
  },
  buttonText: {
    fontFamily: "AvenirNextCyr-Bold",
    color: "white",
  },
  ModalText1: {
    fontSize: 18,
    fontFamily: "AvenirNextCyr-Bold",
    paddingBottom: 5,
    color: Colors.black,
  },
  closeIcon: {
    position: "absolute",
    top: 5,
    right: 5,
    // padding: 5,
  },
  input: {
    borderColor: "gray",
    borderWidth: 0.5,
    height: "75%",
    color: "black",
    width:'35%'
  },modalCloseButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
    backgroundColor: "#F2F2F2",
    padding: 3,
    borderRadius: 20,
  },modalHeader: {
    fontSize: 20,
    fontFamily: "AvenirNextCyr-Bold",
    marginBottom: "2%",
    textAlign: "center",
    color: Colors.primary,
  },dropdown: {
    height: 40,
    borderColor: "#B6B4B4",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    margin:'3%',
    flex:1
  },labelText: {
    color: "red",
    fontSize: 12,
    fontFamily: "AvenirNextCyr-Medium",
  },
  valueText: {
    color: "red",
    fontSize: 12,
    fontFamily: "AvenirNextCyr-Medium",
  },
  dropdownContainer: {
    marginTop: 10,
  },
  dropdownLabel: {
    fontSize: 12,
    fontFamily: "AvenirNextCyr-Medium",
    color: "#4b0482",
    marginBottom: 5,
  }, ModalText2: {
    fontSize: 15,
    fontFamily: 'AvenirNextCyr-Bold',
    paddingBottom: 5,
    color:Colors.primary,
  }, card1: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    borderWidth:0.6,
  }
});
