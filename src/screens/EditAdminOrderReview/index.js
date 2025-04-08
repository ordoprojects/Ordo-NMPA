import { StyleSheet, Text, View, SafeAreaView, TouchableHighlight, TouchableOpacity, Image, ScrollView, Alert, Modal, FlatList } from 'react-native'
import React, { useState, createRef, useContext, useRef, useEffect } from 'react';
import Colors from '../../constants/Colors';
import moment from 'moment';
import RNFS from 'react-native-fs';
import { AuthContext } from '../../Context/AuthContext';
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
import SignatureScreen from "react-native-signature-canvas";
import Toast from 'react-native-simple-toast';
import RNFetchBlob from 'rn-fetch-blob';

const EditAdminOrderReview = ({ navigation, route, animatedValue,text,
    visible,
    extended,
    label,
    animateFrom,
    iconMode }) => {
    const { token, dealerData, userData, tourPlanId, checkInDocId, salesManager } = useContext(AuthContext);
    const [total, setTotal] = useState(0);
    const screenid = route.params.screenid;
    const transportationType = route.params.transportationType
    const siteAddress = route.params.siteAddress
    const image = route.params.image
    const salesType =route.params.salesType
    const transportationRemarks = route.params.transportationRemarks
    const [expanded, setExpanded] = React.useState(true);
    const [hasError, setHasError] = useState(false);
    const [grandTotal, setGrandTotal] = useState(0);
    const paymentTerms =route.params.paymentTerms
    const [totalKg, setTotalKg] = useState(0);
    const [signatureBase64, setSignatureBase64] = useState(null);

    const style = `.m-signature-pad--footer {display: none; margin: 0px;} .m-signature-pad--body {border: none; background-color: 'white'; border-radius: 20px;}`;
    const refYou = useRef();

  const convertImageToBase64 = async (image) => {
    let Photo = '';
  
    // Check if the image is already in base64 format
    const isBase64Format = image && image.startsWith('data:');
    const isFilePath = image && image.startsWith('file://');
    
    if (isBase64Format) {
      console.log('Image is already in base64 format:', image);
      Photo = image; // Directly use the base64 image
    } else if (isFilePath) {
      console.log('Image is a local file path, converting to base64:', image);
      
      try {
        // Read the file from the local storage and convert to base64
        const base64Data = await RNFS.readFile(image, 'base64');
        Photo = `data:image/jpeg;base64,${base64Data}`; // Adjust image type if necessary
        console.log('Converted local image to base64:', Photo);
      } catch (error) {
        console.error('Error converting local image to base64:', error);
        throw error;
      }
    } else {
      console.log('Image is a URL, converting to base64:', image);
      
      try {
        const response = await RNFetchBlob.fetch('GET', image);
        const base64Data = response.base64();
        
        // Get image type from URL if possible
        const fileType = image.endsWith('.png') ? 'png' : 'jpeg';
        Photo = `data:image/${fileType};base64,${base64Data}`;
        
        console.log('Converted URL image to base64:', Photo);
      } catch (error) {
        console.error('Error converting image URL to base64:', error);
        throw error;
      }
    }
  
    return Photo;
  };


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


    useEffect(() => {
        // Calculate total by adding all product_price values
        const calculatedTotal = cartData.reduce((acc, item) => {
            const weight = parseFloat(item?.total_weight) || 0; 
            return acc + weight;
        }, 0);
    
        setTotalKg(calculatedTotal);
    }, [cartData]);


    const orderType = screenid == 1 || screenid == 2 ? 'PS' : 'SS';
    const stages = screenid == 2 ? 'QS' : 'SOP';
    const status = screenid == 2 ? 'P' : 'P';

    console.log("ordeType", orderType, stages, status, transportationType)

    const {cartData, ORDERID, screenName,editDetails } = route?.params;
    const companyy =route.params.company

    if (cartData) {
    cartData.forEach((item) => {
    if (item.product_tax === null) {
      item.product_tax = 1;
      }
    });
  }

    console.log("cartData11ß------------------------>", companyy);
    console.log("🚀 ~ userData:--------------------->", cartData)

    useEffect(() => {
        // Calculate total by adding all product_price values
        const calculatedTotal = cartData.reduce((acc, item) => {
            // Assuming product_price is a string, convert it to a number for addition
            const price = parseFloat(item?.list_price?.replace(/[^0-9.-]+/g, "")) * parseFloat(item.qty) * (parseFloat(item.product_tax) / 100) + parseFloat(item?.list_price?.replace(/[^0-9.-]+/g, "")) * parseFloat(item.qty);
            console.log("jchsckjdj", price)
            return acc + price;
        }, 0);
        console.log("jchsckjdj", calculatedTotal)

        setTotal(calculatedTotal);
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

    const [loading, setLoading] = useState(false);
    const [osName, setOSName] = useState('');
    const [deviceId, setDeviceId] = useState('');
    const [OSVersion, setOSVersion] = useState('');
    const [lattitude, setLattitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [isModalVisible2, setModalVisible2] = useState('');

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

    const convertImagesToArray = async (images) => {
        const base64ImagesArray = await Promise.all(
          images.map(async (image) => {
            const base64Data = await convertImageToBase64(image);
            return { image_data: base64Data };
          })
        );
        return base64ImagesArray;
      };


const createOrder = async () => {
    if (loading) return;
    setLoading(true);

 if (!signatureBase64) { 
    setLoading(false);
    Alert.alert(
      "Missing Signature",
      "Please provide a signature before proceeding with the order.",
      [{ text: "OK" }]
    );
    return; 
  }

const alertTitle = hasError
    ? 'Sent for Approval'
    : 'Quotation sent';

const alertMessage = hasError
    ? 'The order has been sent for manager approval.'
    : 'Quotation sent successfully';

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${userData.token}`);

        const lineItemsArray = cartData.map(item => ({
            product_id: item.isNew ? item.id : item.product_id,
            qty: item.qty.toString(),
            price: parseFloat(item?.list_price.replace(/[^0-9.-]+/g, "")).toFixed(2),
            route_product_status: "Pending",
            remarks: parseFloat(item?.list_price.replace(/[^0-9.-]+/g, "")).toFixed(2) < item.lower_price_cap ? `Asked Price is ${parseFloat(item?.list_price.replace(/[^0-9.-]+/g, "")).toFixed(2)}` : "",
            product_remarks: item?.product_remarks ? item?.product_remarks : "",
            loaded_uom : item?.loaded_uom ? item?.loaded_uom : "",
            total_weight:  item.total_weight ? parseFloat(item.total_weight).toFixed(2) : 0,
            edit_flag : item?.isNew ? 0 : 1
        }));

        var raw = {
            "assigne_to": editDetails?.assigne_to,
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
            "company":companyy[0]?.value,
            "bill_img":await convertImagesToArray(image),
            "site_address":siteAddress,
            "payment_term":paymentTerms
        };

        var requestOptions = {
            method: screenName == "Edit" ? "PUT" : "POST",
            headers: myHeaders,
            body: JSON.stringify(raw),
            redirect: 'follow'
        };

        console.log("Raw for sending order---------->", raw );

        let url = screenName == "Edit" ? `https://gsidev.ordosolution.com/api/soorder_edit_v2/${ORDERID}/` : `https://gsidev.ordosolution.com/api/sales_order/`

        await fetch(url, requestOptions)
            .then(response => {
                console.log("Entered")
                if (response.status === 201 || response.status === 200) {
                    if(hasError){
                    // Order created successfully
                    Alert.alert(alertTitle, alertMessage, [
                        {
                            text: 'OK',
                            onPress: () => {navigation.pop(3)}
                        }
                    ]);}
                    else{ navigation.pop(3) }
                } else {
                    // Handle other status codes or errors
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
        //   if (item?.loaded_uom === "FT") {
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
    
      console.log("Grand Total:", grandTotal);

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
                    <Text style={{ ...styles.content, color: Colors.primary, fontSize: 13, flex: 1 }}>{parseFloat(item?.qty)} {item?.loaded_uom}</Text>
                    <Text style={{ ...styles.content, color: Colors.primary, fontSize: 13 }}>
                        {parseFloat(item?.list_price?.replace(/[^0-9.-]+/g, "")) ? new Intl.NumberFormat('en-IN', {}).format(formattedPrice) : '0.00'}
                    </Text>
                </View>
            </View>
    
              <View style={styles.descriptionContentView}>
                <Text style={{ ...styles.content, flex: 0.8, color: 'green', fontSize: 12 }}></Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
                  {item?.sub_category === 'CR SHEET' || item?.sub_category === 'GP SHEET' || item?.sub_category === 'HR SHEET' || item?.sub_category === 'COIL' ? 
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
                      <Text style={{ ...styles.content, color: Colors.primary, fontSize: 13, flex: 1 }}>
                        {numberOfPieces} {item?.sub_category === 'CR SHEET' || item?.sub_category === 'GP SHEET' ? "Pieces" : "Feet"}
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
                    <Text style={{ ...styles.content, color: Colors.primary, fontSize: 13, fontFamily: 'AvenirNextCyr-Bold'}}> {parseFloat(item?.list_price?.replace(/[^0-9.-]+/g, "")) ? new Intl.NumberFormat('en-IN', {}).format(totalPriceIncludingTax) : '0.00'}</Text>
                </View>
            </View>
        </View>
        );
    };

    const groupBy = (array, key) => {
        return array.reduce((result, currentValue) => {
            const companyId = currentValue?.company?.id; 
            const companyName = companyy[0]?.label; 
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
                        <Text style={{ ...styles.content, flex: 1 }}>  Product Name</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
                            <Text style={{ ...styles.content, }}>Qty</Text>
                            <Text style={{ ...styles.content }}>Price (₹)  </Text>
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
                {/* Misc Task Modal */}
                <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', paddingHorizontal: 1 }}>
                    <View style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: 20, borderRadius: 8, position: 'absolute', bottom: 0, width: '100%', height: '45%', paddingVertical: 8 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: '2%' }}>
                            <Text style={{ ...styles.modalTitle, color: Colors.primary }}>Signature</Text>
                            {
                       loading ? null :
                            <TouchableOpacity
                                onPress={() => setModalVisible2(false)}>
                                <AntDesign name='close' size={20} color={`black`} />
                            </TouchableOpacity>
                           }
                        </View>
                        <View style={{ borderColor: 'grey', borderWidth: 1, height: '50%', borderRadius: 10, flex: 1, padding: '1%' }} pointerEvents={loading ? "none" : "auto"}>
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
                            <Text style={{ color: 'gray', fontFamily: 'AvenirNextCyr-Medium' }}>Date: {moment(new Date()).format('DD-MM-YYYY hh:mm a')}</Text>

                             {/* Hide Clear Signature button when loading is true */}
        {!loading && (
          <TouchableOpacity>
            <Text style={{ ...styles.content, color: 'tomato' }} onPress={resetSign}>
              Clear Signature
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* LinearGradient wrapper */}
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
        {/* Conditional button rendering based on hasError */}
        {hasError ? (
          <TouchableOpacity 
            style={styles.button} 
            activeOpacity={loading ? 1 : 0.8} // Prevent click effect if loading
            onPress={createOrder}
            disabled={loading} // Disable button when loading
          >
            {loading ? (
              <Wave size={30} color={"white"} /> // Show loader if loading
            ) : (
              <Text style={[styles.btnText, { color: loading ? '#999999' : 'white' }]}>Send for Manager Approval</Text>
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={styles.button} 
            activeOpacity={loading ? 1 : 0.8} // Prevent click effect if loading
            onPress={createOrder}
            disabled={loading} // Disable button when loading
          >
            {loading ? (
              <Wave size={30} color={"white"} /> // Show loader if loading
            ) : (
              <Text style={[styles.btnText, { color: loading ? '#999999' : 'white' }]}>{screenid == 2 ? "Send Quotation" : "Confirm Order"}</Text>
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

export default EditAdminOrderReview

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
        // height:40
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
        right: '4%',
        bottom: '9%',
        backgroundColor: Colors.primary,
        borderRadius: 30,
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
       descriptionContentView1: {
        flexDirection: 'column',
        marginBottom: 10,
        paddingHorizontal: 10,
        backgroundColor: 'rgba(22, 1, 66, 0.09)',
        borderRadius: 5,
        paddingRight: 10,
        flex: 1,


    },


})