import { StyleSheet, Text, View, SafeAreaView, TouchableHighlight, TouchableOpacity, Image, ScrollView, Alert, FlatList } from 'react-native'
import React, { useState, createRef, useContext, useRef } from 'react';
import SignatureCapture from 'react-native-signature-capture';
import { Dropdown } from 'react-native-element-dropdown';
import Colors from '../../constants/Colors';
import moment from 'moment';
import ImageResizer from '@bam.tech/react-native-image-resizer'
import RNFS from 'react-native-fs';
import { cameraPermission } from '../../utils/Helper';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { AuthContext } from '../../Context/AuthContext';
import ViewShot from "react-native-view-shot";
import { ProgressDialog } from 'react-native-simple-dialogs';
const ReturnOrderDetails = ({ navigation, route }) => {

    const { token, dealerData } = useContext(AuthContext);
    const { productsArray, returnId, returnArray,dealerInfo } = route.params;
    console.log("return screen id", returnId)
    const [signBase64, setSignBase64] = useState('')
    const [base64img, setBase64img] = useState('');
    const [loading, setLoading] = useState(false);

    const sign = createRef();

    //screen shot hooks
    const ref = useRef();

    const takesnapshot = () => {
        // on mount
        ref.current.capture().then(uri => {
            console.log("screen shot uri ", uri);
            RNFS.readFile(uri, 'base64')
                .then(res => {
                    //console.log('base64', res);
                    //setBase64img(`data:${type};base64,${res}`);
                    console.log("screen shot base64", res)
                    updateReturnDetails(res);
                });
        });
    }

    const saveSign = () => {
        sign.current.saveImage();
    };
    const resetSign = () => {
        sign.current.resetImage();
        setSignBase64('');
    };
    const _onSaveEvent = (result) => {
        //result.encoded - for the base64 encoded png
        //result.pathName - for the file path name
        //alert('Signature Captured Successfully');
        //console.log(result.encoded);
        setSignBase64(result.encoded);


    };
    const _onDragEvent = () => {
        sign.current.saveImage()
        // This callback will be called when the user enters signature
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

    //check permssiosaon 
    const checkPermission = async () => {
        let PermissionDenied = await cameraPermission();
        if (PermissionDenied) {
            console.log("camera permssion granted");
            handleCamera();
        }
        else {
            console.log("camera permssion denied");
            //requestStoragePermission();
        }
    }

    const handleCamera = async () => {
        // setModalVisible1(false);
        const res = await launchCamera({
            mediaType: 'photo',
        });
        console.log("response", res.assets[0].uri);
        imageResize(res.assets[0].uri, res.assets[0].type);
    }
    const handleGallery = async () => {
        // setModalVisible1(false);
        const res = await launchImageLibrary({
            mediaType: 'photo',

        });
        console.log("response", res.assets[0].uri);
        imageResize(res.assets[0].uri, res.assets[0].type);
    }

    const imageResize = async (img, type) => {
        ImageResizer.createResizedImage(
            img,
            300,
            300,
            'JPEG',
            50,

        )
            .then(async (res) => {
                console.log('image resize', res);
                RNFS.readFile(res.path, 'base64')
                    .then(res => {
                        //console.log('base64', res);
                        setBase64img(res)
                    });
            })
            .catch((err) => {
                console.log(" img resize error", err)
            });
    }

    const uploadSignature = (snap) => {
        console.log("sing base64", snap)
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "text/plain");
        //changed
        //.var raw = "{\n    \"__note_file__\": \"" + signBase64 + "\",\n    \"__note_filename__\": \"" + "OrderReciept" + returnId  + "\"\n    }\n";

        var raw = JSON.stringify({
            "__note_file__": snap,
            "__note_filename__": `OrderReciept ${returnId}.png`

        })

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("https://dev.ordo.primesophic.com/uploadFile.php", requestOptions)
            .then(response => response.json())
            .then(result => {
                //console.log("Signature Uploaded", result);
                console.log('Signature uploaded', result)
            })
            .catch(error => console.log('error', error));

    }

    const updateReturnDetails = async (snap) => {
        if (value && signBase64 && base64img) {
            setLoading(true);
            console.log("image base64", base64img);
            console.log("signature base64", signBase64);

            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            var raw = JSON.stringify({
                "__return_products_quotes_id_array__": returnArray,
                "__quotes_id__": returnId, //order id 
                "reason_for_return": value,
                "__return_image__": 'product test image' + new Date(),
                "__return_base64__": base64img
            })

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            fetch("https://dev.ordo.primesophic.com/set_return_order.php", requestOptions)
                .then(response => response.json())
                .then(result => {
                    uploadSignature(snap);
                    setLoading(false);
                    console.log("update return Details api res", result);
                    Alert.alert('Alert', 'Return request sent successfully', [
                        { text: 'OK', onPress: () => navigation.navigate('CheckIn') },
                    ]);

                })
                .catch(error => console.log('error', error));
        }
        else {
            alert('Please fill all the details.')
        }

    }

    // //Updating Return Details
    // const updateReturnDetails = () => {
    //     if (value && signBase64 && base64img) {
    //         //uploading signature and defect product image
    //         // uploadImage(signBase64);
    //         // uploadImage(base64img);
    //         var myHeaders = new Headers();
    //         myHeaders.append("Content-Type", "application/json");
    //         var raw = JSON.stringify({
    //             "__module_code__": "PO_17",
    //             "query": "id='" + returnId + "'",
    //             "__name_value_list__": {
    //                 "id": returnId,
    //                 "returned_c": token,
    //                 "reason_for_return": value,
    //                 "__return_image__": base64img,
    //                 "__return_base64__": signBase64

    //             }
    //         });
    //         var requestOptions = {
    //             method: 'POST',
    //             headers: myHeaders,
    //             body: raw,
    //             redirect: 'follow'
    //         };

    //         fetch("https://dev.ordo.primesophic.com/set_data_s.php", requestOptions)
    //             .then(response => response.json())
    //             .then(result => {
    //                 console.log("update return Details api res", result);
    //                 Alert.alert('Alert', 'Return request sent sucessfully', [
    //                     { text: 'OK', onPress: () => navigation.navigate('CheckIn') },
    //                 ]);

    //                 //navigation.navigate('ReturnOrderDetails',{productsArray:masterData,returnId:returnId})

    //             })
    //             .catch(error => console.log('error', error));
    //     }
    //     else {
    //         alert('Please fill all the details.')
    //     }
    // }

    return (
        <ViewShot style={{ flex: 1 }} ref={ref} options={{ fileName: "returnfile", format: "png", quality: 0.5 }}>
            <ScrollView style={styles.container}>
                <ProgressDialog
                    visible={loading}
                    title="Sending return request"
                    message="Please, wait..."
                />

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={styles.title}>Return Order Review</Text>
                    <Image style={styles.subimage} source={require('../../assets/images/ordologo-bg.png')} />
                </View>
                <View style={{ marginLeft: 10 }}>
                    <Text style={styles.content}>{dealerInfo?dealerInfo.name:dealerData?.name}</Text>
                    <Text style={styles.content}>{dealerInfo?dealerInfo.shipping_address_street:dealerData?.shipping_address_street} {dealerInfo?dealerInfo.billing_address_city:dealerData?.billing_address_city} {dealerInfo?dealerInfo.shipping_address_state:dealerData?.shipping_address_state}</Text>
                    <Text style={styles.content}>{dealerInfo?dealerInfo.shipping_address_country:dealerData?.shipping_address_country} - {dealerInfo?dealerInfo.shipping_address_postalcode:dealerData?.shipping_address_postalcode}</Text>
                    <Text style={styles.content}>GSTIN: {dealerData?.gst_number != null ? dealerData?.gst_number : '1000786'}</Text>
                    <View style={styles.descriptionView}>
                        <Text style={{ ...styles.content, flex: 1, marginLeft: 10 }}>Description</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1, marginRight: 10 }}>
                            <Text style={styles.content}>Qty</Text>
                            <Text style={styles.content}>Price</Text>
                        </View>
                    </View>

                    <FlatList
                        data={productsArray}
                        keyExtractor={({ id }) => id}
                        renderItem={({ item }) =>
                            <View style={styles.descriptionContentView}>
                                <Text style={{ ...styles.content, flex: 1 }}>{item.name}</Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1, marginLeft: 10 }}>
                                    <Text style={styles.content}>{Number(item.product_qty)}</Text>
                                    <Text style={styles.content}>INR {Number(item.product_total_price)}</Text>
                                </View>
                            </View>
                        }
                    />

                    <View style={styles.dropDownContainer}>
                        <Dropdown
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
                        />
                    </View>
                    <Text style={styles.modalTitle}>Upload Photo</Text>
                    <View style={styles.buttonview}>
                        <TouchableOpacity style={styles.photosContainer} onPress={checkPermission}>
                            <Text style={styles.buttonText}>Camera</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.photosContainer} onPress={handleGallery}>
                            <Text style={styles.buttonText}>Gallery</Text>
                        </TouchableOpacity>
                        
                    </View>
                </View>
                {base64img && <Image source={{ uri: `data:jpeg;base64,${base64img}` }} style={{ width: 90, height: 90, resizeMode: 'cover', borderRadius: 8, marginLeft: 10 }} />}
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
                {/* <Image source={{ uri: base64 }} style={{ height: 50, width: 50 }} /> */}
                <View style={{ flexDirection: 'row', marginLeft: 10, justifyContent: 'space-between' }}>
                    <Text style={{ ...styles.content, }}>Date: {moment(new Date()).format('YYYY-MM-DD hh:mm a')}</Text>

                    <TouchableOpacity>
                        <Text style={{ ...styles.content, color: 'red' }}
                            onPress={() => {
                                resetSign();
                            }}>Clear Signature
                        </Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.sendButtonView} onPress={takesnapshot}>
                    <Text style={styles.sendButton}>Place your Return</Text>
                </TouchableOpacity>

            </ScrollView >
        </ViewShot>
    )
}

export default ReturnOrderDetails

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
        fontSize: 12,
        fontFamily: 'AvenirNextCyr-Thin',
        color: 'black',
    },
    descriptionView: {
        marginVertical: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'grey'
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
        borderWidth: 1,
        borderColor: 'grey',
        backgroundColor: 'white',
        paddingVertical: 10,
        height: 40,
        alignItems: "center",
        marginTop: 10,
        marginHorizontal: 10,
        marginBottom: 20
    },
    sendButton: {
        color: 'blue',
        fontFamily: 'AvenirNextCyr-Thin'
    },
    subimage: {
        height: 80,
        width: 80
    },
    dropDownContainer: {
        backgroundColor: 'white',
        marginBottom: 10,
        marginTop: 10
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
        fontFamily:'AvenirNextCyr-Medium'
    },
    selectedTextStyle: {
        fontSize: 14,
        fontFamily:'AvenirNextCyr-Medium'
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