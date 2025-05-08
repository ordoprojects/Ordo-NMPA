import React, { useContext, useEffect, useState } from "react";
import Entypo from "react-native-vector-icons/Entypo";
import { AuthContext } from "../../Context/AuthContext";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
  Pressable,
  KeyboardAvoidingView,
  Dimensions
} from "react-native";
import Colors from "../../constants/Colors";
import { useFocusEffect } from "@react-navigation/native";
import { Image } from "react-native-animatable";
import globalStyles from "../../styles/globalStyles";
import AntDesign from "react-native-vector-icons/AntDesign";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";
import ConvertDateTime from "../../utils/ConvertDateTime";
import { Dropdown } from "react-native-element-dropdown";
import moment from "moment";
import { ProgressDialog } from "react-native-simple-dialogs";
import { MaskedTextInput } from "react-native-mask-text";
import Toast from "react-native-simple-toast";
import { WebView } from 'react-native-webview';
import Comments from '../../components/Comments';
import RNFetchBlob from 'rn-fetch-blob';

const ManageDelDetailsStock = ({ navigation, route }) => {
  const screen = route.params?.screen;
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
  const [showSingnature, setShowSingnature] = useState(false);
  const [SelectedSign, setSelectedSign] = useState("");
  const [modalVisibleBill, setModalVisibleBill] = useState(false);
  const [isCommentsModalVisible, setIsCommentsModalVisible] = useState(false);
  const [dimensionData, setDimensionData] = useState('');
  const [menuVisible1, setMenuVisible1] = useState(false);
  const [menuVisible2, setMenuVisible2] = useState(false);
  const { width: windowWidth } = Dimensions.get('window');

  useFocusEffect(
    React.useCallback(() => {
      getDelPickUpDrop();
    }, [userData])
  );

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

  const OpenDimention = (data) => {
    console.log("🚀 ~ OpenDimention ~ data:", data)
    setDimensionData(data);
    setMenuVisible1(true)
  };

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

  const renderItem = ({ item }) => (
    <View style={styles.card1}>
      {details?.product_list[0]?.name === "BASE PLATE" ? <Text style={{color:Colors.primary ,fontFamily: "AvenirNextCyr-Bold",
      fontSize: 17}}>{item.height_inch} X {item.width_ft} X {item.thickness} </Text>  :
      <Text style={{color:Colors.primary ,fontFamily: "AvenirNextCyr-Bold",
      fontSize: 17}}>Dimensions: {item.width_ft}' {item.height_inch}"</Text> }
      <Text style={{color:Colors.black ,fontFamily: "AvenirNextCyr-Medium",
      fontSize: 15}}>Remaining Qty: {item.remaining_nos} NOS</Text>
       <Text style={{color:Colors.black ,fontFamily: "AvenirNextCyr-Medium",
      fontSize: 15}}>Loaded Qty: {item.loaded_qty} NOS</Text>
       {details?.product_list[0]?.name === "BASE PLATE" &&
       <Text style={{color:Colors.black ,fontFamily: "AvenirNextCyr-Medium",
      fontSize: 15}}>Loaded Weight: {item.base_loaded_weight} Kg</Text>
       }
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
    console.log("inside");
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


  return (
    <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 0} 
  >
    <View style={{ flex: 1, backgroundColor: "white", padding: 24 }}>
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
        {(details.status === "Delivered" || details?.status === "Partially Delivered")  && details?.transportation_type === "Delivery" && 
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
                        details.status === "Stock Approved"
                      ? "orange"
                      : details.status === "In Transit"
                      ? "#005000"
                      : "green",
                  borderRadius: 20}}
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
                    style={[styles.value, { textAlign: "right", width: "72%" }]}>
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
                    <TouchableOpacity onPress={() =>  setMenuVisible2(true)}>
                      <Text style={{ ...styles.value,color:'blue' }}>View</Text>
                   </TouchableOpacity>
                </View>
            {details?.transportation_type === "Pick-Up" && (
               <>
                 <View style={styles.row}>
                   <Text style={styles.title}>Transportation types</Text>
                   <View style={{ flexDirection: 'row', marginTop: 3 }}>
                     <Text style={styles.value}>{details?.transportation_type}</Text>
                   </View>
                 </View>
             
                 <View style={styles.row}>
                   <Text style={styles.title}>Driver Name</Text>
                   <Text style={styles.value}>
                     {details?.route_driver_name ? details.route_driver_name : '-'}
                   </Text>
                 </View>
             
                 <View style={styles.row}>
                   <Text style={styles.title}>Vehicle No</Text>
                   <Text style={styles.value}>
                     {details?.route_vehicle_no ? details.route_vehicle_no : '-'}
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
      </View>
                  </View>
                  <View style={styles.row}>
                  <Text style={styles.title}>Driver Name</Text>
                  <Text style={styles.value}>
                  {details?.vehicle?.[0]?.driver_name ? details?.vehicle[0].driver_name : '-'}
                  </Text>
                </View>
                   <View style={styles.row}>
                   <Text style={styles.title}>Vehicle No</Text>
                   <Text style={styles.value}>
                   {details?.vehicle?.[0]?.registration_number ? details?.vehicle[0].registration_number : '-'}
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
                { marginTop: "1%", flex: expanded2 ? 1 : 0 },
              ]}
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
                    renderItem={({ item, index }) => (
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
                              gap: 4,
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
                    // keyExtractor={(item) => item.id.toString()}
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
                  details.status === "Stock Approved" &&
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
                        style={{flex: 1,
                          paddingLeft: 15,
                          marginLeft: 10}}>
                       <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <View
                          style={{
                            flexDirection: "column",
                            justifyContent: "space-between",
                            width:'70%'
                          }}
                        >
                        <Text
                          style={{
                            color: Colors.primary,
                            fontSize: 14,
                            fontFamily: "AvenirNextCyr-Medium",
                            marginTop: 5,
                          }}
                        >{item?.name}
                        </Text>
                        <Text
                          style={{
                            color: "gray",
                            fontSize: 11,
                            fontFamily: "AvenirNextCyr-Medium",
                          }}
                        >{item?.product_category}
                        </Text>
                        </View>
                        { details?.is_production === true &&
                              
                              <TouchableOpacity style={{
                                backgroundColor: Colors.primary,
                                padding:4,
                                borderRadius:4
                              }}  onPress={() =>
                                OpenDimention(item.production_order)
                              }>
                                <Text style={{fontFamily: "AvenirNextCyr-Bold",fontSize: 13,color: "white"}}>View</Text>
                              </TouchableOpacity>
                        }
                        </View>
                        { details?.is_production !== true &&
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginTop: "3%",
                            justifyContent: "space-between",
                          }}
                        >
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

                        {details?.is_production === true && item?.roofing_production_weight ? (
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
      Loaded Weight:{" "}
    </Text>
    <Text
      style={{
        color: "black",
        fontSize: 12,
        fontFamily: "AvenirNextCyr-Medium",
      }}
    >
      {details.transportation_type === "Delivery"
        ? item.roofing_production_weight
        : item.roofing_production_weight}{" "}
      kg
    </Text>
  </View>
) : null}


                        { details?.is_production !== true &&
                        <>
                        {details.status !== "Stock Approved"&& (
                          <View>
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                             {details.status !== "Cancel"&& (
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
                              Loaded Weight :{" "}
                            </Text>
                            
                              <Text
                              style={{
                                color: "black",
                                fontSize: 12,
                                fontFamily: "AvenirNextCyr-Medium",
                              }}
                            >
                             {details.transportation_type == "Delivery" ? item?.actual_loaded_weight : item?.route_loaded_weight} kg
                            </Text>
                          </View>
                             )}
                            
                          </View>
                          {
                            details.status !== 'Stock Approved' && item?.loaded_qty !=='0'&&
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
                                Loaded Qty :{" "}
                              </Text>
                              
                                <Text
                                style={{
                                  color: "black",
                                  fontSize: 12,
                                  fontFamily: "AvenirNextCyr-Medium",
                                }}
                              >
                               {details.transportation_type === "Delivery" ?  parseFloat(item?.loaded_qty).toFixed(3) : parseFloat(item?.route_loaded_qty).toFixed(3)} {item?.loaded_uom}
                              </Text>
                            </View>
                             }
            {
              details?.status !== 'Stock Approved' &&
              details?.status !== 'Cancel' &&
              details?.remaining_qty !== '0' && (
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
                    Remaining Qty:{" "}
                  </Text>
                  <Text
                    style={{
                      color: "black",
                      fontSize: 12,
                      fontFamily: "AvenirNextCyr-Medium",
                    }}
                  >
                    {parseFloat(item?.remaining_qty).toFixed(3)} {item?.loaded_uom}
                  </Text>
                </View>
              )}
           </View>
      )}

       {details?.transportation_type === "Delivery" && item?.loaded_bundle ? (
               <View style={{ flexDirection: "row", alignItems: "center" }}>
                 <Text style={{ color: "black", fontSize: 12 }}>Bundle/Packets: </Text>
                 <Text style={{ color: "black", fontSize: 12 }}>
                   {String(item.loaded_bundle)}
                 </Text>
               </View>
             ) : null}
       
             {details?.transportation_type === "Pick-Up" && item?.route_loaded_bundle ? (
               <View style={{ flexDirection: "row", alignItems: "center" }}>
                 <Text style={{ color: "black", fontSize: 12 }}>Bundle/Packets: </Text>
                 <Text style={{ color: "black", fontSize: 12 }}>
                   {String(item.route_loaded_bundle)}
                 </Text>
               </View>
             ) : null}
             </>
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

</View>

<Modal visible={menuVisible1} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
      <View style={styles.modalContainer1}>
        <Text style={{fontSize: 20,color: Colors.black,fontFamily: "AvenirNextCyr-Medium",marginBottom:'2%'}}>Dimensions</Text>
          <FlatList
            data={dimensionData}
            renderItem={renderItem}
            // keyExtractor={(item ,index) => item.production_id.toString()}
          />
        <TouchableOpacity style={{position:'absolute',top:20 ,right:10}} onPress={()=>{setMenuVisible1(false);}}>
          <AntDesign name='close' size={28} color={`black`} />
        </TouchableOpacity>
      </View>
      </View>
    </Modal>

    <Modal visible={menuVisible2} transparent={true}>
  <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', flex: 1, justifyContent: 'center' }}>
    <View style={{ backgroundColor: 'white', padding: '2%', borderRadius: 15, flex: 0.8, marginHorizontal: '3%' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ fontFamily: 'AvenirNextCyr-Medium', fontSize: 16 }}>Order Images</Text>
        <TouchableOpacity onPress={() => setMenuVisible2(false)}>
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

export default ManageDelDetailsStock;
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
    marginVertical: "4%",
    backgroundColor: "#F5F5F5",
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontFamily: "AvenirNextCyr-Medium",
    color: Colors.black,
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
  modalContent11: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 30,
    width: "90%",
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
  modalContent1: {
    width: "90%",
    height: "50%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: "2%",
    elevation: 10,
    marginVertical: "5%",
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
    right: 10,
    padding: 5,
  },
  input: {
    borderColor: "gray",
    borderWidth: 0.5,
    height: "75%",
    color: "black",
    width:'35%'
  },  modalCloseButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
    backgroundColor: "#F2F2F2",
    padding: 3,
    borderRadius: 20,
  },  modalHeader: {
    fontSize: 20,
    fontFamily: "AvenirNextCyr-Bold",
    marginBottom: "2%",
    textAlign: "center",
    color: Colors.primary,
  },modalContainer1: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: "center",
    padding: 20,
    marginVertical:'5%',
    borderRadius:10,
    width:'90%',
    paddingTop:20
  },
  card1: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    borderWidth:0.6,
  },
  stockDataContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
  },
  closeButton: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  }, modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: "4%",
    borderRadius: 10,
    width: "90%",
    height: "40%",
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: "AvenirNextCyr-Medium",
    marginBottom: "3%",
    color: Colors.primary,
  },
});
