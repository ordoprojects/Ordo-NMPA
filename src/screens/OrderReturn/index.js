
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
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { AnimatedFAB, TextInput } from 'react-native-paper';
import globalStyles from '../../styles/globalStyles';
import { Fold, Wave } from 'react-native-animated-spinkit';



const OrderReturn = ({ navigation, route, animatedValue, visible }) => {
    const { userData } = useContext(AuthContext);
    const [isExtended, setIsExtended] = useState(true);
    const [total, setTotal] = useState(0);
    // const screenid = route.params.screenid;

    const [signBase64, setSignBase64] = useState('')
    const [base64img, setBase64img] = useState('');
    const [loading, setLoading] = useState(false);
    const [osName, setOSName] = useState('');
    const [deviceId, setDeviceId] = useState('');
    const [OSVersion, setOSVersion] = useState('');
    const [lattitude, setLattitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [isModalVisible2, setModalVisible2] = useState('');
    const [returnNote, setReturnNote] = useState('');






    const { checkedItems, orderId } = route.params;

    useEffect(() => {
        // Calculate total by adding all product_price values
        const calculatedTotal = checkedItems.reduce((acc, item) => {
            // Assuming product_price is a string, convert it to a number for addition
            const price = parseFloat(item.price) * parseFloat(item.returnQty);
            return acc + price;
        }, 0);

        setTotal(calculatedTotal);
    }, [checkedItems]);

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



    const createOrder = async () => {

        setLoading(true)
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${userData.token}`);

        const lineItemsArray = checkedItems.map(item => ({
            qty: Number(item.returnQty),
            product_id: item.id,
            price: item.price,

        }));


        console.log("line", lineItemsArray)
        var raw = {
            "sales_order": orderId,
            "status": "P",
            "return_type": "IR",
            "reference_document_type": "Invoice",
            "product_list": lineItemsArray,
            "return_reason": returnNote,
        };

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(raw),
            redirect: 'follow'
        };

        console.log("raw for sending order", raw);


        await fetch("https://gsidev.ordosolution.com/api/invoice_return/", requestOptions)
            .then(response => response.json())
            .then(res => {
                console.log("return order res", res);
                if (res.data) {
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

                    <TextInput
                        style={[styles.inputText, styles.addressInput]}
                        multiline={true}
                        value={returnNote}
                        mode='outlined'
                        label='Return note'
                        numberOfLines={4}
                        onChangeText={(val) => { setReturnNote(val) }}
                    />

                </View>
                <Text style={{ color: Colors.primary, fontFamily: 'AvenirNextCyr-Medium', fontSize: 17, marginTop: '2%' }}>Order Summary</Text>

                <View style={styles.descriptionView}>

                    <Text style={{ ...styles.content, flex: 1 }}>  Product</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1, }}>
                        <Text style={{ ...styles.content }}>Qty</Text>
                        <Text style={{ ...styles.content }}>Return</Text>
                        <Text style={{ ...styles.content }}>Price(INR)  </Text>
                    </View>
                </View>

                <FlatList
                    data={checkedItems}
                    keyExtractor={({ id }) => id}
                    renderItem={({ item }) =>
                        <View style={styles.descriptionContentView}>
                            <Text style={{ ...styles.content, flex: 1, color: Colors.primary, fontSize: 12 }}>{item.name}</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1, }}>
                                <Text style={{ ...styles.content, color: Colors.primary, fontSize: 13, flex: 1, marginLeft: '5%' }}>{Number(item.qty)}</Text>
                                <Text style={{ ...styles.content, color: Colors.primary, fontSize: 13, flex: 1 }}>{item.returnQty}</Text>
                                <Text style={{ ...styles.content, color: Colors.primary, fontSize: 13, flex: 1, marginLeft: '5%' }}>{Number(item.price)}</Text>
                            </View>
                        </View>
                    }
                />

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
                icon={() => <FontAwesome5 name="file-signature" size={26} color="white" />}
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


}

export default OrderReturn

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