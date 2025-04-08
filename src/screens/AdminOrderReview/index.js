import { StyleSheet, Text, View, SafeAreaView, TouchableHighlight, TouchableOpacity, Image, ScrollView, Alert, Modal, FlatList } from 'react-native'
import React, { useState, createRef, useContext, useRef, useEffect } from 'react';
import SignatureCapture from 'react-native-signature-capture';
import { Dropdown } from 'react-native-element-dropdown';
import Colors from '../../constants/Colors';
import moment from 'moment';
import uuid from 'react-native-uuid';
import ImageResizer from '@bam.tech/react-native-image-resizer'
import RNFS from 'react-native-fs';
import { cameraPermission } from '../../utils/Helper';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { AuthContext } from '../../Context/AuthContext';
import ViewShot from "react-native-view-shot";
import { ProgressDialog } from 'react-native-simple-dialogs';
import DeviceInfo from 'react-native-device-info';
import Geolocation from 'react-native-geolocation-service';
import { locationPermission } from '../../utils/Helper';
import LinearGradient from 'react-native-linear-gradient'
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { AnimatedFAB } from 'react-native-paper';
import globalStyles from '../../styles/globalStyles';
import { Fold, Wave } from 'react-native-animated-spinkit';
import { List, Provider as PaperProvider ,DefaultTheme} from 'react-native-paper';
import { parse } from 'date-fns';
import Toast from 'react-native-simple-toast';
import SignatureScreen from "react-native-signature-canvas";

const AdminOrderReview = ({ navigation, route, animatedValue,text,
    visible,
    extended,
    label,
    animateFrom,
    iconMode }) => {
    const { token, dealerData, userData, tourPlanId, checkInDocId, salesManager } = useContext(AuthContext);
    const screenid = route.params.screenid;
    const transportationType = route.params.transportationType
    const salesType =route.params.salesType
    const companyy =route.params.company
    const paymentTerms =route.params.paymentTerms
    const transportationRemarks = route.params.transportationRemarks
    const siteAddress = route.params.siteAddress
    const image = route.params.image
    const [expanded, setExpanded] = React.useState(true);
    const [hasError, setHasError] = useState(false);
    const [alertShown, setAlertShown] = useState(false);
    const [grandTotal, setGrandTotal] = useState(0);
    const [totalKg, setTotalKg] = useState(0);
    const [total, setTotal] = useState(0);
    const [signatureBase64, setSignatureBase64] = useState(null);
    const style = `.m-signature-pad--footer {display: none; margin: 0px;} .m-signature-pad--body {border: none; background-color: 'white'; border-radius: 20px;}`;
    const refYou = useRef();


  const resetSign = () => {
    if (refYou.current) {
      setSignatureBase64("");
      refYou.current.clearSignature();
    }
  };

  const handleOK = (signature) => {
    setSignatureBase64(signature);
  };

  const handleEmpty = () => {
    console.log("Empty");
  };

  const handleClear = () => {
    console.log("clear success!");
  };

  const handleEnd = () => {
    refYou.current.readSignature();
  };

  const handleBegin = () => {};

  const handleData = (data) => {
    setScrollEnabled(true);
  };


    const handlePress = (name) => {
        setExpanded((prevExpanded) => (prevExpanded === name ? null : name)); // Toggle accordion state
    };

    useEffect(() => {
        // Check for any price errors in the cart
        const error = cartData.some(
            (item) => parseFloat(item?.list_price?.replace(/[^0-9.-]+/g, "")) < item.lower_price_cap
        );

        if (!salesManager) {
            setHasError(error);
        }
    }, [cartData]);


    const orderType = screenid == 1 || screenid == 2 ? 'PS' : 'SS';
    const stages = screenid == 2 ? 'QS' : 'SOP';
    const status = screenid == 2 ? 'P' : 'P';

    const { productsArray, dealerInfo, cartData, ORDERID, screenName,editDetails } = route?.params;

    // Check conditions in cartData
    const hasBasePlateOrRoofingFT = cartData?.some(product => 
     product.name === "BASE PLATE" || 
     (product.product_category?.product_category_name === "ROOFING" && product?.customUOM === "FT")
     );
    
    if (cartData) {
     cartData.forEach((item) => {
    if (item.product_tax === null) {
      item.product_tax = 1;
    }
  });
}
    // console.log("productArray", productsArray);
    console.log("cartData11-------------------->", userData);
    // console.log("dealerInf00o", editDetails);

    useEffect(() => {
        // Calculate total by adding all product_price values
        const calculatedTotal = cartData.reduce((acc, item) => {
            // Assuming product_price is a string, convert it to a number for addition
            const price = parseFloat(item?.list_price?.replace(/[^0-9.-]+/g, "")) * parseFloat(item.tonnage) * (parseFloat(item.product_tax) / 100) + parseFloat(item?.list_price?.replace(/[^0-9.-]+/g, "")) * parseFloat(item.tonnage);
            console.log("jchsckjdj", price)
            return acc + price;
        }, 0);
        console.log("jchsckjdj", calculatedTotal)

        setTotal(calculatedTotal);
    }, [cartData]);

    useEffect(() => {
        // Calculate total by adding all product_price values
        const calculatedTotal = cartData.reduce((acc, item) => {
            const weight = parseFloat(item?.total_weight) || 0; 
            return acc + weight;
        }, 0);
    
        setTotalKg(calculatedTotal);
    }, [cartData]);
    


    useEffect(() => {
        async function fetchDeviceInfo() {
            const name = DeviceInfo.getSystemName();
            const d_id = DeviceInfo.getDeviceId();
            const os_version = DeviceInfo.getSystemVersion();

            setOSName(name);
            setDeviceId(d_id);
            setOSVersion(os_version)
            // setUserName(userData);
        }

        fetchDeviceInfo();
        checkPermission();
    }, []);

    const [signBase64, setSignBase64] = useState('')
    const [base64img, setBase64img] = useState('');
    const [loading, setLoading] = useState(false);
    const [osName, setOSName] = useState('');
    const [deviceId, setDeviceId] = useState('');
    const [OSVersion, setOSVersion] = useState('');
    const [lattitude, setLattitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [isModalVisible2, setModalVisible2] = useState('');


    const convertImagesToBase64 = async (imageArray) => {
      // Return an empty array if there are no images
      if (!imageArray || imageArray.length === 0) {
        return [];
      }
    
      const base64Array = [];
    
      for (const image of imageArray) {
        try {
          const base64Data = await RNFS.readFile(image.uri, "base64");
          base64Array.push({ image_data: `data:${image.type};base64,${base64Data}` });
        } catch (error) {
          console.error("Error converting image to base64:", error);
        }
      }
    
      return base64Array;
    };
    


    const checkPermission = async () => {
        let PermissionGranted = await locationPermission();
        if (PermissionGranted) {
            console.log("location permssion granted");
            Geolocation.getCurrentPosition(
                (res) => {
                    console.log("lattitude", res.coords.latitude);
                    console.log("longitude", res.coords.longitude);

                    setLattitude(res.coords.latitude);
                    setLongitude(res.coords.longitude);
                }, (error) => {
                    console.log("get location error", error);
                    console.log("please enable location ")
                },
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 });
        }
        else {
            console.log("location permssion denied");
        }
    }

const createOrder = async () => {
     // Prevent multiple calls if already loading
        if (loading) return;

    setLoading(true); // Set loading to true when starting the order creation

 if (!signatureBase64) {  // Replace 'signature' with the actual state/variable that holds the signature data
    setLoading(false);
    Alert.alert(
      "Missing Signature",
      "Please provide a signature before proceeding with the order.",
      [{ text: "OK" }]
    );
    return; // Exit the function if signature is missing
  }

    // Check for low stock items
  let lowStock = false;
  for (let item of cartData) {
    if (item.stock === 0) {
      lowStock = true;
      break; // Exit the loop once a low stock item is found
    }
  }
  // If low stock items are detected
  if (lowStock) {
    // Check if alert has already been shown
    if (!alertShown) {
      setAlertShown(true);
      Alert.alert(
        "Warning",
        "There are products in the order with low stock. Delivery might take time. Please notify the customer.",
        [{ text: "OK", onPress: () => {
            setAlertShown(false); // Reset the alertShown state
            proceedWithOrderCreation(); // Proceed with order creation
          }
        }]
      );
    } else {
      // If alert has already been shown, proceed with order creation
      proceedWithOrderCreation();
    }
  } else {
    // If no low stock items, proceed with order creation
    proceedWithOrderCreation();
  }


};


const proceedWithOrderCreation = async () => {
  console.log("Proceeding with order creation");

  console.log('==================1==================');


  // Determine the alert title and message based on the screen name and error state
  const alertTitle = screenName === "Edit"
    ? 'Order Edited'
    : (hasError
      ? 'Sent for Approval'
      : (screenid === 2 ? 'Quotation sent' : 'Order Created'));

  const alertMessage = screenName === "Edit"
    ? 'Order edited successfully'
    : (hasError
      ? 'The order has been sent for manager approval.'
      : (screenid === 2 ? 'Quotation sent successfully' : 'Order created successfully'));
      console.log('==================2==================');
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", `Bearer ${userData.token}`);

  console.log('==================3==================');

  // Prepare the list of line items for the order
  const lineItemsArray = cartData.map(item => ({
    product_id: item.product_id ? item.product_id : item.id,
    qty: parseFloat(item.tonnage).toFixed(3),
    price: parseFloat(item?.list_price.replace(/[^0-9.-]+/g, "")).toFixed(2),
    route_product_status: "Pending",
    remarks: parseFloat(item?.list_price.replace(/[^0-9.-]+/g, "")).toFixed(2) < item.lower_price_cap ? `Asked Price is ${parseFloat(item?.list_price.replace(/[^0-9.-]+/g, "")).toFixed(2)}` : "",
    product_remarks: item?.product_remarks ? item?.product_remarks : "",
    loaded_uom : item?.customUOM ? item?.customUOM : "",
    total_weight:  item.total_weight ? parseFloat(item.total_weight).toFixed(2) : 0,
    dimensions:item?.dimensions
  }));


  var raw = {
    "assigne_to": dealerData.account_id,
    "status": hasError ? "MA" : status,
    "stages": stages,
    "device_id": deviceId,
    "os_name": osName,
    "os_version": OSVersion,
    "user": userData.id,
    "product_list": lineItemsArray,
    "order_type": orderType,
    "sales_checkin": orderType == "SS" ? checkInDocId : '',
    "transportation_type": transportationType,
    "latitude": lattitude,
    "longitude": longitude,
    "transportation_remarks": transportationRemarks,
    "sales_type":salesType,
    "company":companyy.value,
    "bill_img": await convertImagesToBase64(image),
    "site_address":siteAddress,
    "payment_term":paymentTerms
  };

  console.log('=================raw===================');
  console.log(JSON.stringify(raw,null,2));
  console.log('====================================');

  var requestOptions = {
    method: screenName == "Edit" ? "PUT" : "POST",
    headers: myHeaders,
    body: JSON.stringify(raw),
    redirect: 'follow'
  };

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
  let url = screenName == "Edit" ? `https://gsidev.ordosolution.com/api/soorder_edit_v2/${ORDERID}/` : `https://gsidev.ordosolution.com/api/sales_order_v2/`;

  await fetch(url, requestOptions)
    .then(response => {
      console.log("Entered");

      if (response.status === 201 || response.status === 200) {
        Alert.alert(alertTitle, alertMessage, [
          {
            text: 'OK',
            onPress: () => {
              navigation.pop(3);
            }
          }
        ]);
      } else {
        console.log('Order creation failed. Status code:', response.status);
      }
      return response.json();
    })
    .catch(error => {
      console.log('Error:', error);
      Toast.show(
        "Server is busy due to load. Please try again shortly.",
        Toast.SHORT
      );
    });

  setLoading(false);
};

  useEffect(() => {
    const calculatedTotal = cartData.reduce((acc, item) => {
      let formattedPrice;

      // Check if the item has a custom UOM of "FT" and calculate accordingly
    //   if (item?.customUOM === "FT") {
    //     formattedPrice = 
    //       (parseFloat(item?.total_weight) * 
    //        parseFloat(item?.list_price?.replace(/[^0-9.-]+/g, ""))) / 
    //       parseFloat(item?.weight);
    //   } else {
        formattedPrice = 
          parseFloat(item?.list_price?.replace(/[^0-9.-]+/g, "")) * 
          parseFloat(item?.total_weight);
    //   }
      const taxAmount = (formattedPrice * parseFloat(item?.product_tax || 0)) / 100;
      const totalPriceIncludingTax = formattedPrice + taxAmount;

      // Accumulate the total price including tax
      return acc + totalPriceIncludingTax;
    }, 0);

    console.log("Calculated Total:", calculatedTotal);
    setGrandTotal(calculatedTotal.toFixed(2));
  }, [cartData]);

   const formattedPricee = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(grandTotal);

  console.log("Grand Total:", formattedPricee.toLocaleString('en-US'),grandTotal);


const renderItem = ({ item }) => {

    let formattedPrice;
    // if (item?.customUOM === "FT") {
        // formattedPrice = (parseFloat(item?.total_weight) * parseFloat(item?.list_price?.replace(/[^0-9.-]+/g, ""))) / parseFloat(item?.weight);
    // } else {
        formattedPrice = parseFloat(item?.list_price?.replace(/[^0-9.-]+/g, "")) * parseFloat(item?.total_weight);
    // }

    const taxAmount = (formattedPrice * parseFloat(item?.product_tax)) / 100;
    const totalPriceIncludingTax = (formattedPrice + taxAmount).toFixed(2);

    console.log("Formatted Price:", formattedPrice);
    console.log("Total Price Including Tax:", totalPriceIncludingTax);

    const totalWeightKg = parseFloat(item?.total_weight);
    const weightPerPieceKg = parseFloat(item?.weight);

    let numberOfPieces = null;

    if (!isNaN(totalWeightKg) && !isNaN(weightPerPieceKg) && weightPerPieceKg !== 0) {
        numberOfPieces = (totalWeightKg / weightPerPieceKg).toFixed(0);
    }


    return (
    <View style={styles.descriptionContentView1}>
        <View style={[styles.descriptionContentView,{marginBottom:'-6%'}]}>
            <Text style={{ ...styles.content, flex: 0.8, color: Colors.primary, fontSize: 12}}>{item?.name}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
                <Text style={{ ...styles.content, color: Colors.primary, fontSize: 13, flex: 1 }}>{parseFloat(item?.tonnage)} {item?.customUOM}</Text>
                <Text style={{ ...styles.content, color: Colors.primary, fontSize: 13 }}>
                    {parseFloat(item?.list_price?.replace(/[^0-9.-]+/g, "")) ? new Intl.NumberFormat('en-IN', {}).format(formattedPrice) : '0.00'}
                </Text>
            </View>
        </View>

          <View style={styles.descriptionContentView}>
            <Text style={{ ...styles.content, flex: 0.8, color: 'green', fontSize: 12 }}></Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
              {item?.sub_category_id?.name === 'CR SHEET' || item?.sub_category_id?.name === 'GP SHEET' || item?.sub_category_id?.name === 'HR SHEET' || item?.sub_category_id?.name === 'COIL' ? 
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
                  <Text style={{ ...styles.content, color: Colors.primary, fontSize: 13, flex: 1 }}>
                    {numberOfPieces} {item?.sub_category_id?.name === 'CR SHEET' || item?.sub_category_id?.name === 'GP SHEET' ? "Pieces" : "Feet"}
                  </Text>
                </View>
                :<View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
                </View>
              }
                  <Text style={{ ...styles.content, color: Colors.primary, fontSize: 13 }}>
                    {parseFloat(item?.list_price?.replace(/[^0-9.-]+/g, "")) ? new Intl.NumberFormat('en-IN', {}).format(taxAmount) : '0.00'}
                    <Text style={{ color: Colors.primary, fontSize: 10, fontWeight: 'normal' }}> ({`${parseFloat(item?.product_tax)}%`})</Text>
                  </Text>
            </View>
          </View>

        <View style={styles.descriptionContentView}>
        {item?.product_remarks? 
            <Text style={{ ...styles.content, flex: 0.8, color: 'green', fontSize: 12}}>Remark: {item?.product_remarks}</Text>:
            <Text style={{ ...styles.content, flex: 0.8, color: 'green', fontSize: 12}}></Text>
        }
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
                <View style={{flexDirection:'column'}}>
                <Text style={{ ...styles.content, color: Colors.primary, fontSize: 13, flex: 1 }}>{parseFloat(item?.total_weight).toFixed(2)} Kg</Text>
                </View>
                <Text style={{ ...styles.content, color: Colors.primary, fontSize: 13, fontFamily: 'AvenirNextCyr-Bold', }}> {parseFloat(item?.list_price?.replace(/[^0-9.-]+/g, "")) ? new Intl.NumberFormat('en-IN', {}).format(totalPriceIncludingTax) : '0.00'}</Text>
            </View>
        </View>
    </View>
    );
};


    const groupBy = (array, key) => {
        return array.reduce((result, currentValue) => {
            const companyId = currentValue?.company?.id; 
            const companyName = companyy?.label; 
            const groupKey = `${companyName}`;
            (result[groupKey] = result[groupKey] || []).push(currentValue);
            return result;
        }, {});
    };

    const groupedData = groupBy(cartData, 'company');

    return (
        <LinearGradient colors={Colors.linearColors}
            start={Colors.start} end={Colors.end}
            locations={Colors.location}
            style={{ backgroundColor: Colors.primary, borderColor: Colors.primary, justifyContent: 'center', alignItems: 'center', flex: 1 }}
        >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', height: '10%', alignItems: 'center', alignContent: 'center', textAlign: 'center' }}>
                <TouchableOpacity onPress={() => { navigation.goBack() }} style={{ paddingLeft: '5%' }}>
                    <Image source={require('../../assets/images/Refund_back.png')} style={{ height: 30, width: 30 }} />
                </TouchableOpacity>
                <Text style={{ fontFamily: 'AvenirNextCyr-Medium', fontSize: 19, marginLeft: 8, color: 'white' }}>Order Review</Text>
                <View><Text>          </Text></View>
            </View>

            <View style={{ height: '90%', backgroundColor: '#f5f5f5', width: '100%', borderTopEndRadius: 20, borderTopStartRadius: 20 }}>
            <View style={styles.recoredbuttonStyle}>
    {screenName !== "Edit"? (
        <>
            <Text style={{ color: Colors.primary, fontFamily: 'AvenirNextCyr-Medium', fontSize: 18 }}>{dealerData?.name}</Text>
            <Text style={{ color: 'rgba(101, 2, 49, 0.63)', fontFamily: 'AvenirNextCyr-Medium', fontSize: 13 }}>
                {dealerData?.client_address}{dealerData?.city},{'\n'}{dealerData?.state} {dealerData?.country} - {dealerData?.postal_code}
            </Text>
            <Text style={{ color: 'rgba(101, 2, 49, 0.68)', fontFamily: 'AvenirNextCyr-Medium', fontSize: 13, fontWeight: 700 }}>{dealerData?.phone_number}</Text>
        </>
    ) : (
        <>
            <Text style={{ color: Colors.primary, fontFamily: 'AvenirNextCyr-Medium', fontSize: 18 }}>{editDetails?.assignee_name}</Text>
            <Text style={{ color: 'rgba(101, 2, 49, 0.63)', fontFamily: 'AvenirNextCyr-Medium', fontSize: 13 }}>
                {editDetails?.assigne_to_address?.address}{'\n'}{editDetails?.assigne_to_address?.state} {editDetails?.country} - {editDetails?.assigne_to_address?.postal_code}
            </Text>
            <Text style={{ color: 'rgba(101, 2, 49, 0.68)', fontFamily: 'AvenirNextCyr-Medium', fontSize: 13, fontWeight: 700 }}>{editDetails?.phone_number}</Text>
        </>
    )}
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ color: 'rgba(101, 2, 49, 0.63)', fontFamily: 'AvenirNextCyr-Medium', fontSize: 13 }}></Text>
        <Text style={{ color: 'rgba(101, 2, 49, 0.63)', fontFamily: 'AvenirNextCyr-Medium', fontSize: 11 }}>
            Booking Details <Ionicons name='checkmark-circle' color="green" size={15} />
        </Text>
     </View>
   </View>
                <Text style={{ color: Colors.primary, fontFamily: 'AvenirNextCyr-Medium', fontSize: 17, marginTop: '2%', marginHorizontal: '4%' }}>Order Summary</Text>
                <View style={{ flex: 1, marginHorizontal: '4%' }}>
                    <View style={styles.descriptionView}>

                        <Text style={{ ...styles.content, flex: 1 }}> Product Name</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
                            <Text style={{ ...styles.content, }}>Qty</Text>
                            <Text style={{ ...styles.content,marginRight:'5%' }}>Price(₹)</Text>
                        </View>
                    </View>

                    <PaperProvider
                        settings={{
                            rippleEffectEnabled: false
                        }}
                        theme={DefaultTheme}
                    >
                        {Object.keys(groupedData).map((name) => (
                            <View key={name} style={{ marginBottom: 10 }}>
                                <List.Accordion
                                    key={name}
                                    title={name}
                                    expanded={expanded === name}
                                    onPress={() => handlePress(name)}
                                >
                                    <View style={{ marginBottom: '50%' }}>
                                        <FlatList
                                            data={groupedData[name]}
                                            keyExtractor={(item) => item.id.toString()}
                                            renderItem={renderItem}
                                        />
                                    </View>
                                </List.Accordion>
                            </View>
                        ))}
                    </PaperProvider>
                </View>
          <View>

       </View>
       <View style={{ backgroundColor: 'white', flexDirection: 'column' }}>
       <View style={{ justifyContent: "center", height: 40, width: '100%', flexDirection: 'column' , borderTopWidth: 1, borderTopColor: Colors.primary,}}>
       
       <Text style={{ color: Colors.primary, fontFamily: 'AvenirNextCyr-Medium', fontSize: 14, fontWeight: 'bold',paddingLeft:'5%'}}>
           Approx. Total Weight: {parseFloat(totalKg).toFixed(2)} Kg
       </Text>
   </View>
    <View style={{ height: 60, borderTopWidth: 1, borderTopColor: Colors.primary, justifyContent: 'space-between', flexDirection: 'row', backgroundColor: 'white' }}>
        <View style={{ justifyContent: "center", height: '100%', width: '60%', flexDirection: 'column' }}>
            <Text style={{ color: Colors.primary, fontFamily: 'AvenirNextCyr-Medium', fontSize: 17, fontWeight: 'bold', textAlign: 'center' }}>
            Approx. Grand Total
            </Text>
            <Text style={{ color: Colors.primary, fontFamily: 'AvenirNextCyr-Medium', fontSize: 17, fontWeight: 'bold', textAlign: 'center' }}>
                {isNaN(formattedPricee) ? formattedPricee : '0.00'}
            </Text>
        </View>
        <TouchableOpacity style={{ backgroundColor: Colors.primary, height: '100%', width: '40%', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', borderTopLeftRadius: 20 }} onPress={() => {
            setModalVisible2(true);
        }}>
            <MaterialCommunityIcons name="draw-pen" size={25} color="white" />
            <Text style={{ color: Colors.white, fontFamily: 'AvenirNextCyr-Bold' }}>{screenid == 2 ? "Send Quotation" : "Confirm Order"}</Text>
        </TouchableOpacity>
    </View>
   
</View>

            </View>

  <Modal
  visible={isModalVisible2}
  animationType="slide"
  transparent={true}
>
  <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', paddingHorizontal: 1 }}>
    <View style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: 20, borderRadius: 8, position: 'absolute', bottom: 0, width: '100%', height: '45%', paddingVertical: 8 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: '2%' }}>
        <Text style={{ ...styles.modalTitle, color: Colors.primary }}>Signature</Text>
        {
          loading ? null :
        <TouchableOpacity onPress={() => setModalVisible2(false)}>
          <AntDesign name='close' size={20} color={`black`} />
        </TouchableOpacity>
        }
      </View>
      
      <View style={{ borderColor: 'grey', borderWidth: 1, height: '50%', borderRadius: 10, flex: 1, padding: '1%' }}>
        <SignatureScreen
          ref={refYou}
          onEnd={handleEnd}
          onBegin={handleBegin}
          onOK={handleOK}
          onEmpty={handleEmpty}
          onClear={handleClear}
          onGetData={handleData}
          autoClear={false}
          webStyle={style}
          descriptionText={text}
        />
      </View>
      
      <View style={{ flexDirection: 'row', marginLeft: 10, justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ color: 'gray', fontFamily: 'AvenirNextCyr-Medium' }}>
          Date: {moment(new Date()).format('DD-MM-YYYY hh:mm a')}
        </Text>
        
        {!loading && (
          <TouchableOpacity>
            <Text style={{ ...styles.content, color: 'tomato' }} onPress={resetSign}>
              Clear Signature
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <LinearGradient
        colors={loading ? ['#cccccc', '#cccccc'] : Colors.linearColors} 
        start={Colors.start}
        end={Colors.end}
        locations={Colors.ButtonsLocation}
        style={{ 
          backgroundColor: loading ? '#cccccc' : Colors.primary, 
          borderColor: Colors.primary, 
          borderRadius: 10, 
          justifyContent: 'center', 
          alignItems: 'center', 
          flexDirection: 'row', 
          paddingVertical: '4%', 
          marginTop: '3%', 
          marginBottom: '4%',
          opacity: loading ? 0.7 : 1, 
        }}
        pointerEvents={loading ? 'none' : 'auto'} 
      >
        {hasError ? (
          <TouchableOpacity 
            style={styles.button} 
            activeOpacity={loading ? 1 : 0.8} 
            onPress={createOrder}
            disabled={loading} 
          >
            {loading ? (
              <Wave size={30} color={"white"} /> 
            ) : (
              <Text style={[styles.btnText, { color: loading ? '#999999' : 'white' }]}>Send for Manager Approval</Text>
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
          style={styles.button} 
          activeOpacity={loading ? 1 : 0.8} 
          onPress={createOrder}
          disabled={loading} 
        >
          {loading ? (
            <Wave size={30} color={"white"} /> 
          ) : (
            <Text style={[styles.btnText, { color: loading ? '#999999' : 'white' }]}>
              { screenid === 2 
                ? "Create Quotation"
                : userData.user_type === "Sales Manager" 
                ? "Confirm Order" 
                : hasBasePlateOrRoofingFT 
                ? "Send for Manager Approval" 
                : "Confirm Order"}
            </Text>
          )}
        </TouchableOpacity>
        )}
      </LinearGradient>
    </View>
  </View>
</Modal>

        </LinearGradient>
    )

}

export default AdminOrderReview

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: 'white'
    },
    title: {
        marginVertical: 5,
        fontSize: 18,
        fontFamily: 'AvenirNextCyr-Medium',
        color: 'black',
        marginLeft: 10
    },
    content: {
        fontSize: 14,
        fontFamily: 'AvenirNextCyr-Medium',
        color: 'white',
        paddingVertical: 10,
    },
    descriptionView: {
        marginVertical: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: Colors.primary,
        borderRadius: 5,
    },
    descriptionContentView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderRadius: 5,
        flex: 1,
    },
      descriptionContentView1: {
        flexDirection: 'column',
        marginBottom: 10,
        paddingHorizontal: 10,
        backgroundColor: 'rgba(22, 1, 66, 0.09)',
        borderRadius: 5,
        paddingRight: 10,
        flex: 1,
    },
    grandTotalView: {
        fontSize: 15,
        fontFamily: 'AvenirNextCyr-Thin',
        color: 'black',
        alignSelf: 'flex-end'
    },
    titleStyle: {
        fontSize: 10,
        textAlign: 'left',
        marginTop: 10,
        fontFamily: 'AvenirNextCyr-Medium',
        color: 'black'
    },
    signature: {
        flex: 1,
        // borderWidth: 1,
    },
    buttonStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 37,
        backgroundColor: '#eeeeee',
        margin: 20,
    },
    sendButtonView: {
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'grey',
        backgroundColor: 'white',
        paddingVertical: '3%',
        // height: 40,
        alignItems: "center",
        marginTop: 10,
        marginHorizontal: 10,
        marginBottom: 20,

    },
    sendButton: {
        color: Colors.primary,
        fontFamily: 'AvenirNextCyr-Thin'
    },
    subimage: {
        height: 80,
        width: 80
    },
    dropDownContainer: {
        backgroundColor: 'white',
        marginBottom: 10,
        marginTop: 10,
        alignItems: 'flex-end',

    },
    dropdown: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
    },
    placeholderStyle: {
        fontSize: 14,
        fontFamily: 'AvenirNextCyr-Thin'
    },
    selectedTextStyle: {
        fontSize: 14,
        fontFamily: 'AvenirNextCyr-Thin'
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    modalTitle: {
        fontSize: 16,
        color: 'black',
        fontFamily: 'AvenirNextCyr-Medium'
    },
    buttonview: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    photosContainer: {
        height: 40,
        padding: 10,
        borderRadius: 10,
        marginVertical: 10,
        backgroundColor: Colors.primary,
        marginRight: 10
    },
    buttonText: {
        fontFamily: 'AvenirNextCyr-Thin',
        color: 'white'
    },
    recoredbuttonStyle: {
        borderRadius: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        marginHorizontal: 5,
        shadowRadius: 2,
        elevation: 5,
        ...globalStyles.border,
        backgroundColor: 'white',
        justifyContent: 'space-between',
        borderRadius: 20,
        marginBottom: 10,
        marginTop: 8,
        padding: '4%',
        marginHorizontal: '4%'

    },
    fabStyle: {
        position: 'absolute',
        // marginBottom: 35,
        right: '4%',
        bottom: '9%',
        backgroundColor: Colors.primary,
        borderRadius: 30,
        // marginRight:'3%'

    },
    btnText: {
        fontFamily: 'AvenirNextCyr-Medium',
        color: '#fff',
        fontSize: 16,
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        width: '100%'
    },
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00000080', // Transparent black background
  },
  loaderContainer: {
    backgroundColor: '#000000',
    borderRadius: 10,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },

})