import { StyleSheet, Text, View, SafeAreaView, TouchableHighlight, TouchableOpacity, Image, ScrollView, Alert, FlatList } from 'react-native'
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
// import { useStripe } from '@stripe/stripe-react-native';

const Invoice = ({ navigation, route }) => {
    // const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const { token, dealerData ,userData} = useContext(AuthContext);

    const fetchPaymentSheetParams = async () => {
        const response = await fetch(`https://dev.ordo.primesophic.com/get_payment_intent2.php`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const { paymentIntent,clientSecret, ephemeralKey, customer,id} = await response.json();
        console.log("iddddd",clientSecret)
    
        return {
          paymentIntent,
          ephemeralKey,
          customer,
          clientSecret,
          id,
        };
      };
    
      const initializePaymentSheet = async () => {
        const {
          paymentIntent,
          ephemeralKey,
          customer,
          publishableKey,
          clientSecret,
          id,
        } = await fetchPaymentSheetParams();
        console.log("idddddddd",id)
        console.log("client_secret",clientSecret)

    
        const { paymentIntent1,error } = await initPaymentSheet({
          merchantDisplayName: "OrDo Inc.",
          customerId: customer,
          customerEphemeralKeySecret: ephemeralKey,
          paymentIntentClientSecret: clientSecret,
          // Set `allowsDelayedPaymentMethods` tro true if your business can handle payment
          //methods that complete payment after a delay, like SEPA Debit and Sofort.
          allowsDelayedPaymentMethods: true,
          defaultBillingDetails: {
            name: 'Jane Doe',
          }
        });
        
        if (error) {
          console.log("dgxfhcgjvhbkjnsetdxfchgvjhb",error)
        }else{
            setLoading(true); 
            console.log("paymentIntent1   ygy",paymentIntent1)
        }
      };
    
      const openPaymentSheet = async () => {
        const { error } = await presentPaymentSheet();
        // navigation.goBack();
        if (error) {
          Alert.alert(`Error code: ${error.code}`, error.message);
        } else {
            navigate.goBack();
          Alert.alert('Success', 'Your order is confirmed!');
        }
      };
    
      useEffect(() => {
        initializePaymentSheet();
      }, []);
    // const { productsArray, dealerInfo, cartData, total } = route.params;
    // console.log("productArray", productsArray);
    // console.log("cartData", cartData);
    // console.log("dealerInfo", dealerData);

    useEffect(() => {
        async function fetchDeviceInfo() {
            const name = DeviceInfo.getSystemName();
            // const d_id = DeviceInfo.getDeviceId(); 
            DeviceInfo.getUniqueId().then((uniqueId) => {
                console.log("deviceis", uniqueId);
                setDeviceId(uniqueId);
            });
            const os_version = DeviceInfo.getSystemVersion();
            setOSName(name);
            setDeviceId(d_id);
        }
        fetchDeviceInfo();
        checkPermission();
    }, []);

    const [signBase64, setSignBase64] = useState('')
    const [base64img, setBase64img] = useState('');
    const [loading, setLoading] = useState(false);
    const [osName, setOSName] = useState('');
    const [deviceId, setDeviceId] = useState('');
    const [OSVersion] = useState('');
    const [lattitude, setLattitude] = useState('');
    const [longitude, setLongitude] = useState('');

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

    const sign = createRef();

    const ref = useRef();

    const takesnapshot = () => {
        ref.current.capture().then(uri => {
            console.log("screen shot uri ", uri);
            RNFS.readFile(uri, 'base64')
                .then(res => {
                    console.log("screen shot base64", res)
                    createOrder(res);
                });
        });
    }

    // const saveSign = () => {
    //     sign.current.saveImage();
    // };
    const resetSign = () => {
        sign.current.resetImage();
        setSignBase64('');
    };
    const _onSaveEvent = (result) => {
        setSignBase64(result.encoded);
    };
    const _onDragEvent = () => {
        // sign.current.saveImage();
        console.log('dragged');
    };
    const data = [
        {
            id: '1',
            title: 'Kaju katli',
            quantity: 1,
            cost: 35.7
        },
        {
            id: '2',
            title: 'Gulab Jamun',
            quantity: 1,
            cost: 60.2
        },
        {
            id: '3',
            title: 'Horlicks',
            quantity: 1,
            cost: 270.25
        },
    ];
    const DATA = [
        { label: 'Shipped wrong product or size', value: 'Shipped wrong product or size' },
        { label: 'The product was damaged or defective', value: 'The product was damaged or defective' },
        { label: 'The product arrived too late', value: 'The product arrived too late' },
        { label: 'The product did not match the description', value: 'The product did not match the description' },
        { label: 'Other', value: 'Other' },
    ];
    const [isFocus, setIsFocus] = useState(false);
    const [value, setValue] = useState(null);

    // const checkPermission = async () => {
    //     let PermissionDenied = await cameraPermission();
    //     if (PermissionDenied) {
    //         console.log("camera permssion granted");
    //         handleCamera();
    //     }
    //     else {
    //         console.log("camera permssion denied");
    //     }
    // }

    // const handleCamera = async () => {
    //     const res = await launchCamera({
    //         mediaType: 'photo',
    //     });
    //     console.log("response", res.assets[0].uri);
    //     imageResize(res.assets[0].uri, res.assets[0].type);
    // }
    // const handleGallery = async () => {
    //     const res = await launchImageLibrary({
    //         mediaType: 'photo',

    //     });
    //     console.log("response", res.assets[0].uri);
    //     imageResize(res.assets[0].uri, res.assets[0].type);
    // }

    // const imageResize = async (img, type) => {
    //     ImageResizer.createResizedImage(
    //         img,
    //         300,
    //         300,
    //         'JPEG',
    //         50,
    //     )
    //         .then(async (res) => {
    //             console.log('image resize', res);
    //             RNFS.readFile(res.path, 'base64')
    //                 .then(res => {
    //                     setBase64img(res)
    //                 });
    //         })
    //         .catch((err) => {
    //             console.log(" img resize error", err)
    //         });
    // }

    // const uploadSignature = (snap) => {
    //     console.log("sing base64", snap)
    //     var myHeaders = new Headers();
    //     myHeaders.append("Content-Type", "text/plain");


    //     var raw = JSON.stringify({
    //         "__note_file__": snap,
    //         "__note_filename__": `OrderReciept ${returnId}.png`

    //     })



    //     var requestOptions = {
    //         method: 'POST',
    //         headers: myHeaders,
    //         body: raw,
    //         redirect: 'follow'
    //     };

    //     fetch("https://gsidev.ordosolution.com/uploadFile.php", requestOptions)
    //         .then(response => response.json())
    //         .then(result => {

    //             console.log('Signature uploaded', result)
    //         })
    //         .catch(error => console.log('error', error));

    // }

    // console.log("dealer iddddd", dealerInfo)
    // console.log("productsArray", productsArray)
    console.log("gcxgfdgfdngfhdfnh",userData)


    const createOrder = async () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var productarray = [];
        let url = 'https://dev.ordo.primesophic.com/set_create_order.php'
        // var type = "New";
        const type = userData.type; // Assuming you have a variable called userData.type

// Determine the value for __type__ based on the condition
const typeValue = (type === '6' || type === '7' || type === '8') ? 'primary' : 'secondary';
const accountId = (type === '6' || type === '7' || type === '8') ? userData.account_id : dealerData.id;

        var raw = {
            "__title__": "",
            "__account_id__":accountId ,
            "__created_userval_c__": userData.id,
            "__line_items__": productsArray.length,
            "__device_id__": deviceId,
            "__os_name__": osName,
            "__osversion_c__": "10.7",
            "__longitude__": longitude,
            "__latitude__": lattitude,
            "__price__": total,
            "__line_items_array__": productsArray,
            "__type__": typeValue
        }

    

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(raw),
            redirect: 'follow'
        }

        console.log("raw for sending ordererrrrrrrr", raw)


        fetch(url, requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log(result);
            })
            .catch(error => {
                console.log(error);
            })

            // setTimeout(() => {
            //     if (navigation.isFocused() && navigation.goBack()) {
            //         // If 'MerchHome' is present, navigate there
            //         navigation.navigate('MerchHome');
            //     } else {
            //         // If 'MerchHome' is not present, navigate to 'BottomTab'
            //         navigation.navigate('BottomTab');
            //     }
            // }, 1000);
            setTimeout(() => {
                Alert.alert('Alert', 'Order created successfully', [
                    {
                        text: 'OK',
                        onPress: () => {
                            if (userData.type === '6' || userData.type === '7' || userData.type === '8') {
                                navigation.navigate('MerchHome');
                            } else {
                                navigation.navigate('BottomTab');
                            }
                        }
                    }
                ]);
            }, 1000);
            
            

    }
    // console.log("priceeee", price)


    return (
        <ViewShot style={{ flex: 1 }} ref={ref} options={{ fileName: "returnfile", format: "png", quality: 0.5 }}>
            <ScrollView style={styles.container}>
                {/* <ProgressDialog
                    visible={loading}
                    title="Sending return request"
                    message="Please, wait..."
                /> */}

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={styles.title}>Order Receipt</Text>
                    <Image style={styles.subimage} source={require('../../assets/images/ordologo-bg.png')} />
                </View>
                <View style={{ marginLeft: 10 }}>
                    <Text style={styles.content}>{userData?.name}</Text>
                    <Text style={styles.content}>{userData?.shipping_address_street} {userData?.billing_address_city} {userData?.shipping_address_state}</Text>
                    <Text style={styles.content}>{userData?.shipping_address_country} - {userData?.shipping_address_postalcode}</Text>
                    {/* <Text style={styles.content}>GSTIN: {dealerInfo?.gst_number != null ? dealerInfo?.gst_number : '1000786'}</Text> */}
                    <View style={styles.descriptionView}>
                        <Text style={{ ...styles.content, flex: 1, marginLeft: 10 }}>Description</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1, marginRight: 10 }}>
                            <Text style={styles.content}>Qty</Text>
                            <Text style={styles.content}>Price</Text>
                        </View>
                    </View>

                    {/* <FlatList
                        // data={cartData}
                        keyExtractor={({ id }) => id}
                        renderItem={({ item }) => */}
                            <View style={styles.descriptionContentView}>
                                <Text style={{ ...styles.content, flex: 1 }}>Product 1</Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1, marginLeft: 10 }}>
                                    <Text style={styles.content}>2</Text>
                                    <Text style={styles.content}>INR 50</Text>
                                </View>
                            </View>
                        {/* }
                    /> */}

                    <View style={styles.dropDownContainer}>
                        <Text style={styles.content}>Sub-Total : INR 100</Text>
                        <Text style={styles.content}>GST : INR 25</Text>
                        <Text style={styles.content}>Saving : INR 20</Text>
                        <Text style={{ ...styles.content, fontFamily: 'AvenirNextCyr-Medium' }}>Grand Total : INR 125</Text>


                        {/* <Dropdown
                            style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            iconStyle={styles.iconStyle}
                            data={DATA}

                            maxHeight={400}
                            labelField="label"
                            valueField="value"
                            placeholder={!isFocus ? 'Reason for Return' : '...'}

                            value={value}
                            onFocus={() => setIsFocus(true)}
                            onBlur={() => setIsFocus(false)}
                            onChange={item => {
                                setValue(item.value);
                                setIsFocus(false);
                            }}
                        /> */}
                    </View>
                    {/* <Text style={styles.modalTitle}>Upload Photo</Text>
                    <View style={styles.buttonview}>
                        <TouchableOpacity style={styles.photosContainer} onPress={checkPermission}>
                            <Text style={styles.buttonText}>Camera</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.photosContainer} onPress={handleGallery}>
                            <Text style={styles.buttonText}>Gallery</Text>
                        </TouchableOpacity>

                    </View> */}
                </View>
                {/* {base64img && <Image source={{ uri: `data:jpeg;base64,${base64img}` }} style={{ width: 90, height: 90, resizeMode: 'cover', borderRadius: 8, marginLeft: 10 }} />} */}
                <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 15 }}>
                    {base64img && <Image source={{ uri: `data:jpeg;base64,${base64img}` }} style={{ width: 90, height: 90, resizeMode: 'cover', borderRadius: 8, marginLeft: 10 }} />}
                    {base64img && <TouchableOpacity style={{ marginRight: 10, marginBottom: 5 }} onPress={() => {
                        setBase64img('')
                    }}>
                        <AntDesign name='delete' size={20} color={`black`} />
                    </TouchableOpacity>}
                </View>
                <View style={{ height: 110, width: "100%", marginTop: 10 }}>
                    <View style={{ marginLeft: 10 }}>
                        <Text style={styles.modalTitle}>
                            SIGN BELOW
                        </Text>
                        <View style={{ borderColor: 'grey', borderWidth: 1, height: 75, width: '100%' }}>
                            <SignatureCapture
                                style={styles.signature}
                                ref={sign}
                                onSaveEvent={_onSaveEvent}
                                onDragEvent={_onDragEvent}
                                showNativeButtons={false}
                                showTitleLabel={false}
                                viewMode={'portrait'}
                                minStrokeWidth={2}
                                maxStrokeWidth={6}
                            />
                        </View>
                    </View>

                </View>

                <View style={{ flexDirection: 'row', marginLeft: 10, justifyContent: 'space-between' }}>
                    <Text style={{ ...styles.content, }}>Date: {moment(new Date()).format('DD-MM-YYYY hh:mm a')}</Text>

                    <TouchableOpacity>
                        <Text style={{ ...styles.content, color: 'red' }}
                            onPress={() => {
                                resetSign();
                            }}>Clear Signature
                        </Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.sendButtonView} onPress={openPaymentSheet} disabled={!loading}>
                    <Text style={styles.sendButton}>Make Stripe Payment</Text>
                </TouchableOpacity>

            </ScrollView>
        </ViewShot>
    )
}

export default Invoice

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
        fontSize: 13,
        fontFamily: 'AvenirNextCyr-Thin',
        color: 'black',
    },
    descriptionView: {
        marginVertical: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#D3D3D3'
    },
    descriptionContentView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
        paddingHorizontal: 20
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
        borderColor: '#00003',
        borderWidth: 1,

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
        borderWidth: 1.5,
        borderColor: Colors.primary,
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
        fontFamily: 'AvenirNextCyr-Medium'
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
})