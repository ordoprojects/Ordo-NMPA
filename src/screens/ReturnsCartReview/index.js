
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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { AnimatedFAB } from 'react-native-paper';
import globalStyles from '../../styles/globalStyles';
import { Fold, Wave } from 'react-native-animated-spinkit';



const ReturnsCartReview = ({ navigation, route, animatedValue,
    visible,
    extended,
    label,
    animateFrom,
    style,
    iconMode, }) => {
    const { token, dealerData, userData, tourPlanId, checkInDocId } = useContext(AuthContext);
    const [isExtended, setIsExtended] = useState(true);
    const [total, setTotal] = useState(0);
    // const screenid = route.params.screenid;



    const onScroll = ({ nativeEvent }) => {
        const currentScrollPosition =
            Math.floor(nativeEvent?.contentOffset?.y) ?? 0;

        setIsExtended(currentScrollPosition <= 0);
    };


    const { productsArray, dealerInfo, cartData } = route.params;
    // console.log("productArray 11", productsArray);
    // console.log("cartData", cartData);
    // console.log("dealerInfo", dealerData);


    useEffect(() => {
        // Calculate total by adding all product_price values
        const calculatedTotal = cartData.reduce((acc, item) => {
            // Assuming product_price is a string, convert it to a number for addition
            const price = parseFloat(item.product_price) * parseFloat(item.qty);
            return acc + price;
        }, 0);

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

    const [signBase64, setSignBase64] = useState('')
    const [base64img, setBase64img] = useState('');
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
    // console.log("gcxgfdgfdngfhdfnh", userData)


    const returnOrder = () => {
        setModalVisible2(false);
        if (cartData.length > 0) {
            let returnArray = cartData.map((item) => {
                return {
                    product_id: item.product_id,
                    product_status: "Pending",
                    qty: item.qty,
                    ret_product_image: item.base64img
                    // remarks: item.remarks,
                    // product_name: item.product_name,
                }
            })
            // console.log("return array", returnArray);

            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", `Bearer ${userData.token}`);

            var raw = JSON.stringify({
                "assigne_to": dealerData.account_id,
                "status": "P",
                "user": userData.id,
                "product_list": returnArray
            });

            console.log(",jdsc,sdcscsd", raw)
            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            fetch("https://gsidev.ordosolution.com/api/return_order/", requestOptions)
                .then(response => response.json())
                .then(res => {
                    console.log("return order res", res);
                    if (res.data.id) {
                        Alert.alert('Alert', "Return Order placed Successfully", [
                            { text: 'OK', onPress: () => navigation.goBack() },
                        ]);
                    } else {
                        console.log('Unexpected response:', res);
                    }


                })
                .catch(error => console.log('error', error));
        }
        else {
            Alert.alert('Add Product', 'Please add product to return')
        }
    }

    const createOrder = async () => {

        setLoading(true)
        console.log(dealerData);
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${userData.token}`);

        const lineItemsArray = cartData.map(item => ({
            qty: Number(item.qty),
            // price: Number(item.product_price),
            product_id: item.id,
            product_status: "Pending",
            ret_product_image: item.base64img
        }));


        console.log("line", lineItemsArray)
        var raw = {
            "assigne_to": dealerData.account_id,
            "status": "P",
            "user": userData.id,
            "product_list": lineItemsArray,
            "plan": null,
            "sales_checkin": checkInDocId,

        };

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(raw),
            redirect: 'follow'
        };

        console.log("raw for sending order", raw);

        await fetch("https://gsidev.ordosolution.com/api/return_order/", requestOptions)
            .then(response => response.json())
            .then(res => {
                console.log("return order res", res);
                if (res.data.id) {
                    Alert.alert('Alert', "Return Order placed Successfully", [
                        {
                            text: 'OK',
                            onPress: () => {
                                navigation.pop(2);
                            }
                        }
                    ]);
                } else {
                    // Handle other status codes or errors
                    console.log('Unexpected response:', res);
                }
            })
            .catch(error => {
                console.log('Error:', error);
            });
        setLoading(false)
    };

    // console.log("priceeee", price)
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

            <View style={{ height: '88%', backgroundColor: '#f5f5f5', width: '100%', borderTopEndRadius: 20, borderTopStartRadius: 20, padding: 18 }}>
                <View style={styles.recoredbuttonStyle}>
           <Text style={{ color: Colors.primary, fontFamily: 'AvenirNextCyr-Medium', fontSize: 18 }}>{dealerData?.name}</Text>
            <Text style={{ color: 'rgba(101, 2, 49, 0.63)', fontFamily: 'AvenirNextCyr-Medium', fontSize: 13 }}>
                {dealerData?.client_address}{dealerData?.city},{'\n'}{dealerData?.state} {dealerData?.country} - {dealerData?.postal_code}
            </Text>
            <Text style={{ color: 'rgba(101, 2, 49, 0.68)', fontFamily: 'AvenirNextCyr-Medium', fontSize: 13, fontWeight: 700 }}>{dealerData?.phone_number}</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ color: 'rgba(101, 2, 49, 0.63)', fontFamily: 'AvenirNextCyr-Medium', fontSize: 13 }}></Text>
                        <Text style={{ color: 'rgba(101, 2, 49, 0.63)', fontFamily: 'AvenirNextCyr-Medium', fontSize: 11 }}>Order Details <Ionicons name='checkmark-circle' color="green" size={15} /></Text>
                    </View>

                </View>
                <Text style={{ color: Colors.primary, fontFamily: 'AvenirNextCyr-Medium', fontSize: 17, marginTop: '2%' }}>Order Summary</Text>

                {/* <Text style={styles.content}>GSTIN: {dealerInfo?.gst_number != null ? dealerInfo?.gst_number : '1000786'}</Text> */}
                <View style={styles.descriptionView}>

                    <Text style={{ ...styles.content, flex: 1 }}>  Product</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1, }}>
                        <Text style={{ ...styles.content }}>Qty</Text>
                        <Text style={{ ...styles.content }}>Uom</Text>
                        <Text style={{ ...styles.content }}>Price(₹)  </Text>
                    </View>
                </View>

                <FlatList
                    data={cartData}
                    keyExtractor={({ id }) => id}
                    renderItem={({ item }) =>
                        <View style={styles.descriptionContentView}>
                            <Text style={{ ...styles.content, flex: 1, color: Colors.primary, fontSize: 12 }}>{item.name}</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1, }}>
                                <Text style={{ ...styles.content, color: Colors.primary, fontSize: 13, flex: 1, marginLeft: '5%' }}>{Number(item.qty)}</Text>
                                <Text style={{ ...styles.content, color: Colors.primary, fontSize: 13, flex: 1 }}>{item.unit_of_measure}</Text>
                                <Text style={{ ...styles.content, color: Colors.primary, fontSize: 13, flex: 1, marginLeft: '5%' }}>{Number(item.product_price)}</Text>
                            </View>
                        </View>
                    }
                />

                {/* <View style={styles.dropDownContainer}>
                        <Text style={styles.content}>Sub-Total : INR {Number(total)}</Text>
                        <Text style={styles.content}>GST : INR {0}</Text>
                        <Text style={styles.content}>Saving : INR {0}</Text>
                        <Text style={{ ...styles.content, fontFamily: 'AvenirNextCyr-Medium' }}>Grand Total : INR {Number(total)}</Text> */}


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
                {/* </View> */}
                {/* <Text style={styles.modalTitle}>Upload Photo</Text>
                    <View style={styles.buttonview}>
                        <TouchableOpacity style={styles.photosContainer} onPress={checkPermission}>
                            <Text style={styles.buttonText}>Camera</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.photosContainer} onPress={handleGallery}>
                            <Text style={styles.buttonText}>Gallery</Text>
                        </TouchableOpacity>

                    </View> */}
                <View style={{ height: '6%', borderTopWidth: 1, borderTopColor: Colors.primary, justifyContent: 'flex-end', flexDirection: 'row' }}>
                    <Text style={{ color: Colors.primary, fontFamily: 'AvenirNextCyr-Medium', fontSize: 17, marginTop: '5%', fontWeight: 'bold' }}>
                        Grand Total : INR {isNaN(total) ? 0 : Number(total)}
                    </Text>
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
                            <TouchableOpacity
                                onPress={() => setModalVisible2(false)}>
                                <AntDesign name='close' size={20} color={`black`} />
                            </TouchableOpacity>
                        </View>
                        <View style={{ borderColor: 'grey', borderWidth: 1, height: '50%', borderRadius: 10, flex: 1, padding: '1%' }}>
                            <SignatureCapture
                                style={styles.signature}
                                ref={sign}
                                onSaveEvent={_onSaveEvent}
                                onDragEvent={_onDragEvent}
                                showNativeButtons={false}
                                showTitleLabel={false}
                                viewMode={'portrait'}
                                minStrokeWidth={2}
                                maxStrokeWidth={8}

                            />
                        </View>
                        <View style={{ flexDirection: 'row', marginLeft: 10, justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={{ color: 'gray', fontFamily: 'AvenirNextCyr-Medium' }}>Date: {moment(new Date()).format('DD-MM-YYYY hh:mm a')}</Text>

                            <TouchableOpacity>
                                <Text style={{ ...styles.content, color: 'tomato' }}
                                    onPress={() => {
                                        resetSign();
                                    }}>Clear Signature
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <LinearGradient colors={Colors.linearColors}
                            start={Colors.start} end={Colors.end}
                            locations={Colors.ButtonsLocation}
                            style={{ backgroundColor: Colors.primary, borderColor: Colors.primary, borderRadius: 10, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', paddingVertical: '4%', marginTop: '3%', marginBottom: '4%' }}
                        >
                            <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={createOrder}>
                                {loading ? (<Wave size={30} color={"white"} />) : (<Text style={styles.btnText}>Confirm Return</Text>)}
                            </TouchableOpacity>
                        </LinearGradient>
                    </View>
                </View>
            </Modal>

            <AnimatedFAB
                label={"Confirm Return"}
                icon={() => <MaterialCommunityIcons name="draw-pen" size={28} color="white" />}
                color={"white"}
                style={styles.fabStyle}
                // borderWidth={50}
                borderRadius={60}

                fontFamily={'AvenirNextCyr-Medium'}
                extended={isExtended}

                // onPress={() => console.log('Pressed')}
                visible={visible}
                animateFrom={'right'}
                // iconMode={'static'}
                onPress={() => {
                    //   setAddingUser(true);
                    setModalVisible2(true);

                }}
            />





        </LinearGradient>
    )

    return (
        <ViewShot style={{ flex: 1 }} ref={ref} options={{ fileName: "returnfile", format: "png", quality: 0.5 }}>
            <ScrollView style={styles.container}>
                <ProgressDialog
                    visible={loading}
                    title="Sending return request"
                    message="Please, wait..."
                />

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={styles.title}>Order Review</Text>
                    <Image style={styles.subimage} source={require('../../assets/images/ordologo-bg.png')} />
                </View>
                <View style={{ marginLeft: 10 }}>
                    <Text style={styles.content}>{dealerInfo?.name}</Text>
                    <Text style={styles.content}>{dealerInfo?.shipping_address_street} {dealerInfo?.billing_address_city} {dealerInfo?.shipping_address_state}</Text>
                    <Text style={styles.content}>{dealerInfo?.shipping_address_country} - {dealerInfo?.shipping_address_postalcode}</Text>
                    {/* <Text style={styles.content}>GSTIN: {dealerInfo?.gst_number != null ? dealerInfo?.gst_number : '1000786'}</Text> */}
                    <View style={styles.descriptionView}>
                        <Text style={{ ...styles.content, flex: 1, marginLeft: 10 }}>Description</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1, marginRight: 10 }}>
                            <Text style={styles.content}>Qty</Text>
                            <Text style={styles.content}>Price</Text>
                        </View>
                    </View>

                    <FlatList
                        data={cartData}
                        keyExtractor={({ id }) => id}
                        renderItem={({ item }) =>
                            <View style={styles.descriptionContentView}>
                                <Text style={{ ...styles.content, flex: 1 }}>{item.description}</Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1, marginLeft: 10 }}>
                                    <Text style={styles.content}>{Number(item.qty)}</Text>
                                    <Text style={styles.content}>INR {Number(item.price)}</Text>
                                </View>
                            </View>
                        }
                    />

                    <View style={styles.dropDownContainer}>
                        <Text style={styles.content}>Sub-Total : INR {Number(total)}</Text>
                        <Text style={styles.content}>GST : INR {0}</Text>
                        <Text style={styles.content}>Saving : INR {0}</Text>
                        <Text style={{ ...styles.content, fontFamily: 'AvenirNextCyr-Medium' }}>Grand Total : INR {Number(total)}</Text>


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

                <TouchableOpacity style={styles.sendButtonView} onPress={createOrder}>
                    <Text style={styles.sendButton}>Place your Order</Text>
                </TouchableOpacity>

            </ScrollView>
        </ViewShot>
    )
}

export default ReturnsCartReview

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
        paddingVertical: 10
        // height:40
    },
    descriptionView: {
        marginVertical: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: Colors.primary,
        borderRadius: 5

    },
    descriptionContentView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
        paddingHorizontal: 10,
        backgroundColor: 'rgba(22, 1, 66, 0.09)',
        borderRadius: 5,
        paddingRight: 20
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
        // borderColor: '#00003',
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
        padding: '4%'

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


})