import React from "react";
import { View, Dimensions, Text, TouchableOpacity, Image, Alert, PermissionsAndroid, ActivityIndicator, FlatList, Pressable, Modal, BackHandler, ToastAndroid, ScrollView, TextInput } from 'react-native';
import styles from "./style";
import AntDesign from 'react-native-vector-icons/AntDesign';
import Colors from '../../constants/Colors'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
// import { CameraScreen } from 'react-native-camera-kit';
import { SafeAreaView } from "react-native-safe-area-context";
import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome';
import SignatureCapture from 'react-native-signature-capture';
import { useState, useEffect, useContext, useRef, createRef } from "react";
import RNFS from 'react-native-fs';
import { AuthContext } from '../../Context/AuthContext';
// import { Table, Row, Rows, Col, Cols, TableWrapper } from "react-native-table-component";
// import Signature from "react-native-signature-canvas";
import DeviceInfo from 'react-native-device-info';
import Geolocation from 'react-native-geolocation-service';
import { format } from 'date-fns';
import { locationPermission } from '../../utils/Helper';
import { v4 as uuidv4 } from 'uuid';
import { useFocusEffect } from '@react-navigation/native';
import { getUniqueId, getManufacturer } from 'react-native-device-info';
import { perPlatformTypes } from "react-native-document-picker/lib/typescript/fileTypes";
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


const SupplierCart = ({ navigation, route }) => {
    const { token, checkInDocId, dealerData, userData, tempCartData, changeTempCartData, setTempCartData, orderID, changeOrderID, cartData, setCartData } = useContext(AuthContext);

    const [currentUniqueOrderId, setCurrentUniqueOrderId] = useState('');
    const [signBase64, setSignBase64] = useState('')

    // const { uniqueOrderId } = route.params;
    // const SavedOrderfromFile = route.params?.orderData;
    const [selectedProducts, setSelectedProducts] = useState(route.params?.selectedProducts);
    const [totalQuantity, setTotalQuantity] = useState(0); // Initialize totalQuantity with 0




    // useEffect(() => {
    //     setFilteredData(selectedProducts);
    // }, [selectedProducts])

    // useEffect(() => {
    //     setCartData([])
    // }, [])

    const backAction = () => {

        //checking screen is focused
        if (!navigation.isFocused()) {
            return false;
        }

        setOpneScanner(false);

        navigation.goBack();
        return true;
    };

    //disable back button logic
    useEffect(() => {
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction,
        );
        return () => backHandler.remove();
    }, []);

    const handleOrderSubmit = () => {
        // Submit the order or perform any necessary actions here

        // Display an alert message
        Alert.alert(
            'Success',
            'Order placed successfully',
            [
                {
                    text: 'OK',
                    onPress: () => {
                        navigation.navigate('AdminHome')
                    },
                },
            ]
        );
    };

    const [osName, setOSName] = useState('');
    const [deviceId, setDeviceId] = useState('');
    const [OSVersion] = useState('');

    useEffect(() => {
        async function fetchDeviceInfo() {
            const name = DeviceInfo.getSystemName();
            const d_id = DeviceInfo.getDeviceId();
            const os_version = DeviceInfo.getSystemVersion();

            setOSName(name);
            setDeviceId(d_id);
            // setUserName(userData);


        }

        fetchDeviceInfo();
        checkPermission();
    }, []);


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
                },
                (error) => {
                    console.log("get location error", error);
                    console.log("please enable location ")

                },
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
            );
        }
        else {
            console.log("location permssion denied");

        }
    }

    const calculateHaversineDistance = (lat1, lon1, lat2, lon2) => {
        const radius = 6371000; // Radius of the Earth in meters

        const radiansLat1 = (lat1 * Math.PI) / 180;
        const radiansLat2 = (lat2 * Math.PI) / 180;
        const latDifference = radiansLat2 - radiansLat1;
        const lonDifference = ((lon2 - lon1) * Math.PI) / 180;

        const a = Math.sin(latDifference / 2) ** 2 + Math.cos(radiansLat1) * Math.cos(radiansLat2) * Math.sin(lonDifference / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        const distance = radius * c;
        return distance;
    };


    // const sendOrder = () => {

    //     if (selectedProducts.length > 0) {
    //         const lineItemsArray = selectedProducts.map(item => ({
    //             productid: item.id,
    //             qty: item.quantity.toString()
    //         }));

    //         const requestData = {
    //             "__title__": "",
    //             "__account_id__": dealerData?.id,
    //             "__created_userval_c__": created_userval_c,
    //             "__line_items__": selectedProducts.length,
    //             "__device_id__": deviceId,
    //             "__os_name__": osName,
    //             "__osversion_c__": "10.7",
    //             "__longitude__": longitude,
    //             "__latitude__": lattitude,
    //             "__line_items_array__": lineItemsArray,
    //             "__ordo_user_id__": token
    //         };

    //         console.log("requestdata", requestData);

    //         var myHeaders = new Headers();
    //         myHeaders.append("Content-Type", "application/json");

    //         var requestOptions = {
    //             method: 'POST',
    //             headers: myHeaders,
    //             body: JSON.stringify(requestData),
    //             redirect: 'follow'
    //         };

    //         // fetch("https://dev.ordo.primesophic.com/ordotile/set_create_order.php", requestOptions)
    //         //     .then(response => response.json())
    //         //     .then(result => {
    //         //         console.log('Order sent successfully:', result);
    //         //         setModalVisible(false);
    //         //     })
    //         //     .catch(error => {
    //         //         console.log('Error sending order:', error);
    //         //         // Handle error here
    //         //     });
    //         const dealerLatitude = parseFloat(dealerData.latitude);
    //         const dealerLongitude = parseFloat(dealerData.longitude);

    //         const userLatitude = parseFloat(lattitude);
    //         const userLongitude = parseFloat(longitude);

    //         // Calculate the distance using the Haversine formula
    //         const distance = calculateHaversineDistance(dealerLatitude, dealerLongitude, userLatitude, userLongitude);

    //         if (distance > 20) {
    //             // Display an alert message if the distance is more than 20 meters
    //             Alert.alert('Out of Radius', 'You are more than 20 meters away from the dealer. Please move closer before sending the order.');
    //         } else {
    //             // Send the order if the distance is within 20 meters
    //             Alert.alert('Order Placed Successfully');
    //         }
    //     } else {
    //         alert('Please add products to the cart before sending the order.');
    //     }
    // }

    const sendOrder = () => {
        if (selectedProducts.length > 0) {
            const lineItemsArray = selectedProducts.map(item => ({
                productid: item.id,
                qty: item.quantity > 0 ? item.quantity.toString() : '1'
                // qty: item.quantity.toString(),
            }));

            const requestData = {
                "__title__": "",
                "__account_id__": dealerData?.account_id,
                "__created_userval_c__": userData?.name,
                "__line_items__": selectedProducts.length,
                "__device_id__": deviceId,
                "__os_name__": osName,
                "__osversion_c__": "10.7",
                "__longitude__": longitude,
                "__latitude__": lattitude,
                "__line_items_array__": lineItemsArray,
                "__ordo_user_id__": token
            };

            console.log("requestdata for create order", requestData);

            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify(requestData),
                redirect: 'follow'
            };

            const dealerLatitude = parseFloat(dealerData.latitude);
            const dealerLongitude = parseFloat(dealerData.longitude);

            const userLatitude = parseFloat(lattitude);
            const userLongitude = parseFloat(longitude);

            // Calculate the distance using the Haversine formula
            const distance = calculateHaversineDistance(dealerLatitude, dealerLongitude, userLatitude, userLongitude);

            if (distance > 20) {
                // Display an alert message if the distance is more than 20 meters
                Alert.alert(
                    'Out of Radius',
                    'You are more than 20 meters away from the customer. Are you sure you want to continue?',
                    [
                        {
                            text: 'Cancel',
                            style: 'cancel',
                        },
                        {
                            text: 'Yes',
                            onPress: () => {
                                // Send the order if the user presses "Okay"
                                fetch("https://dev.ordo.primesophic.com/ordotile/set_create_order.php", requestOptions)
                                    .then(response => response.json())
                                    .then(result => {
                                        console.log('Order sent successfully:', result);
                                        setModalVisible(false);
                                        Alert.alert('Success !', 'Order Placed Successfully');
                                        setCartData([]);
                                        navigation.navigate('AdminHome')
                                        changeOrderID('');
                                        setSearchText('');

                                    })
                                    .catch(error => {
                                        console.log('Error sending order:', error);
                                        // Handle error here
                                    });
                            },
                        },
                    ]
                );
            } else {
                // Send the order directly if the distance is within 20 meters
                fetch("https://dev.ordo.primesophic.com/ordotile/set_create_order.php", requestOptions)
                    .then(response => response.json())
                    .then(result => {
                        console.log('Order sent successfully:', result);
                        setModalVisible(false);
                        Alert.alert('Success !', 'Your order has been placed Successfully');
                        setCartData([]);
                        navigation.navigate('AdminHome')
                        changeOrderID('');
                        setSearchText('');

                    })
                    .catch(error => {
                        console.log('Error sending order:', error);
                        // Handle error here
                    });
            }
        } else {
            alert('Please add products to the cart before sending the order.');
        }
    }







    const handleEmpty = () => {
        console.log("Empty");
    };

    const stylee = `
    .m-signature-pad--body {height: 90%;
    align-items:center;
    justify-content:center;}
 `;

    const tableHead = ["Description", "Quantity"];


    const [quantity, setQuantity] = useState(0);
    const [isModalVisible, setModalVisible] = useState(false);
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    // const renderTableData = () => {
    //     let totalPrice = 0;
    //     let totalTax = 0;

    //     const tableData = selectedProducts.map(item => {
    //         totalPrice += item.price * item.quantity;
    //         totalTax += item.tax;

    //         return [
    //             item.description,
    //             item.quantity.toString(),
    //             `AED ${(item.price + (item.tax/100)) * item.quantity}`
    //         ];
    //     });

    //     return { tableData, totalPrice, totalTax };
    // };

    const renderTableData = () => {
        let totalProductCost = 0;
        let totalTaxCost = 0;
        let totalCostWithoutTax = 0;


        const tableData = selectedProducts.map(item => {
            const costWithouttax = (item.price * item.quantity);
            const productCost = (item.price * item.quantity) + ((item.price * item.quantity) * (item.tax / 100));
            const taxCost = ((item.price * item.quantity) * (item.tax / 100));
            totalCostWithoutTax += costWithouttax;
            totalProductCost += productCost;
            totalTaxCost += taxCost;


            return [
                item.name,
                item.quantity > 0 ? item.quantity.toString() : 1,
                // item.quantity.toString(),
                // `AED ${productCost.toFixed(2)}`,
                // `AED ${taxCost.toFixed(2)}`
            ];
        });

        return { tableData, totalProductCost, totalTaxCost, totalCostWithoutTax };
    };

    // const handleQuantityChange = (item, action) => {
    //     let numericValue = parseInt(item.quantity);
    //     console.log("numeric Valuee", numericValue)
    //     if (isNaN(numericValue) || numericValue < 1) {
    //         const updatedCartData = selectedProducts.map(product =>
    //             product.id === item.id ? { ...product, quantity: 1 } : product
    //         );
    //         setCartData(updatedCartData);
    //     }

    //     if (action === 'increment') {
    //         const updatedCartData = selectedProducts.map(product =>
    //             product.id === item.id ? { ...product, quantity: numericValue + 1 } : product
    //         );
    //         setCartData(updatedCartData);
    //     } else if (action === 'decrement' && numericValue > 0) {
    //         const updatedCartData = selectedProducts.map(product =>
    //             product.id === item.id ? { ...product, quantity: numericValue - 1 } : product
    //         );

    //         // Remove the product from the selectedProducts if quantity becomes 0
    //         if (numericValue === 1) {
    //             const filteredCartData = updatedCartData.filter(product => product.quantity > 0);
    //             setCartData(filteredCartData);
    //         } else {
    //             setCartData(updatedCartData);
    //         }
    //     } else if (!isNaN(action) && action >= 0) {
    //         const updatedCartData = selectedProducts.map(product =>
    //             product.id === item.id ? { ...product, quantity: parseInt(action) } : product
    //         );
    //         // setCartData(updatedCartData);
    //     }

    // };


    const handleQuantityChange = (item, text) => {
        console.log(item, text)
        // Parse the text to an integer
        const newQuantity = parseInt(text, 10);

        if (!isNaN(newQuantity)) {
            // Update the item's quantity
            item.quantity = newQuantity;

            // Here you can update your state or re-render the component
            // based on your app's architecture.
        }
    };



    const handleDecrement = (item) => {
        if (item.quantity > 0) {
            const updatedCartData = selectedProducts.map(product =>
                product.id === item.id ? { ...product, quantity: product.quantity - 1 } : product
            );

            // Remove the product from the selectedProducts if quantity becomes 0
            if (item.quantity === 1) {
                const filteredCartData = updatedCartData.filter(product => product.quantity > 0);
                setCartData(filteredCartData);

            } else {
                setCartData(updatedCartData);

            }
        }
    };

    const handleIncrement = (item) => {
        const updatedCartData = [...selectedProducts];
        const updatedItem = { ...item, quantity: item.quantity + 1 };
        const itemIndex = updatedCartData.findIndex(product => product.id === item.id);
        updatedCartData[itemIndex] = updatedItem;
        setCartData(updatedCartData);


    };

    // const removeProductFromCart = (item) => {
    //     const updatedCartData = selectedProducts.map(product =>
    //         product.id === item.id ? { ...product, quantity: 0 } : product
    //     );

    //     const filteredCartData = updatedCartData.filter(product => product.quantity > 0);
    //     setCartData(filteredCartData);

    // };


    const removeProductFromCart = (item) => {
        // Filter out the item to remove it from the array
        const updatedProducts = selectedProducts.filter((product) => product.id !== item.id);
        setSelectedProducts(updatedProducts); // Update the state with the new array
    };


    const addProductToCart = async (identifier) => {
        const cleanedIdentifier = identifier.toUpperCase();
        const matchedProduct = fileData.find(product => product.id === cleanedIdentifier || product.hsn === cleanedIdentifier);



        if (matchedProduct) {
            const existingProductIndex = selectedProducts.findIndex(product => product.id === matchedProduct.id);

            if (existingProductIndex !== -1) {
                const updatedCartData = [...selectedProducts];
                updatedCartData[existingProductIndex].quantity += 1;
                setCartData(updatedCartData);
                setSearchText('')

            } else {
                setCartData(prevCartData => [...prevCartData, { ...matchedProduct, quantity: 1, timestamp: new Date().getTime(), }]);
                setSearchText('')
            }
        } else {
            alert("Product not found in the Inventory");
        }
    };

    const searchProduct = (text) => {
        setSearchText(text);
    };

    const searchTextHandler = () => {
        setSearchText('');
        setFilteredData(selectedProducts);
    };

    // const [selectedProducts, setCartData] = useState([]);

    const [loading, setLoading] = useState(false)


    useEffect(() => {
        loadAllProduct();

    }, [])

    const loadAllProduct = async (id) => {

        setLoading(true);
        const filePath = RNFS.DocumentDirectoryPath + '/productData.json';
        RNFS.readFile(filePath, 'utf8')
            .then(fileData => {
                const parsedData = JSON.parse(fileData);

                // const hsnArray = parsedData.map(item => item.hsn).filter(Boolean);
                const itemIdArray = parsedData.map(item => item.id).filter(Boolean);
                // setSavedHSN(hsnArray);
                setSavedItemId(itemIdArray);
                setFileData(parsedData)


                setLoading(false);
                console.log('Data read from file successfully:');

            })
            .catch(error => {
                setLoading(false);
                console.log('Error reading file:', error);
            });

    }

    const splitLongText = (text) => {
        const maxLengthPerLine = 8; // Adjust this value as needed

        if (text.length <= maxLengthPerLine) {
            return text;
        }

        let splitText = '';
        for (let i = 0; i < text.length; i += maxLengthPerLine) {
            splitText += text.substr(i, maxLengthPerLine) + '\n';
        }

        return splitText;
    };

    const resetSign = () => {
        sign.current.resetImage();
        setSignBase64('');
    };
    const _onSaveEvent = (result) => {
        setSignBase64(result.encoded);


    };
    const _onDragEvent = () => {
        sign.current.saveImage()
        console.log('dragged');
    };



    //bar code scanner
    const [qrvalue, setQrvalue] = useState('');
    const [opneScanner, setOpneScanner] = useState(false);

    const [fileData, setFileData] = useState([]);
    const [savedHSN, setSavedHSN] = useState([]);
    const [savedItemId, setSavedItemId] = useState([]);
    const [searchText, setSearchText] = useState('');

    const onOpenlink = () => {
        // If scanned then function to open URL in Browser
        Linking.openURL(qrvalue);
    };

    const sign = createRef();

    const ref = useRef();


    const onBarcodeScan = (qrvalue) => {
        // Called after te successful scanning of QRCode/Barcode
        setQrvalue(qrvalue);
        setOpneScanner(false);

        const matchingHSN = savedHSN.find(hsn => hsn === qrvalue);
        const matchingItemID = savedItemId.find(id => id === qrvalue);

        if (matchingHSN) {
            setSearchText(qrvalue); // Update the search text
        } else if (matchingItemID) {
            setSearchText(qrvalue); // Update the search text
        }
        else {
            // Neither matching HSN nor matching Item ID found
            alert("The item is not in the inventory");
        }
    };



    const onOpneScanner = () => {
        // To Start Scanning
        if (Platform.OS === 'android') {
            async function requestCameraPermission() {
                try {
                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.CAMERA,
                        {
                            title: 'Camera Permission',
                            message: 'App needs permission for camera access',
                        },
                    );
                    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                        // If CAMERA Permission is granted
                        setQrvalue('');
                        setOpneScanner(true);
                    } else {
                        alert('CAMERA permission denied');
                    }
                } catch (err) {
                    alert('Camera permission err', err);
                    console.warn(err);
                }
            }
            // Calling the camera permission function
            requestCameraPermission();
        } else {
            setQrvalue('');
            setOpneScanner(true);
        }
    };




    const [filteredData, setFilteredData] = useState([]);

    const searchProductInCart = (text) => {
        // Check if searched text is not blank
        if (text) {
            // Inserted text is not blank
            // Filter the masterDataSource
            // Update FilteredDataSource
            const newData = selectedProducts.filter(
                function (item) {
                    const itemData = item?.name && item?.id
                        ? item?.name.toUpperCase() + item?.id.toUpperCase()
                        : ''.toUpperCase();
                    const textData = text.toUpperCase();
                    return itemData.indexOf(textData) > -1;
                });
            setFilteredData(newData);
            setSearchText(text);
        } else {
            // Inserted text is blank
            // Update FilteredDataSource with masterDataSource
            setFilteredData(selectedProducts);
            setSearchText(text);
        }
    };


    // const backIcon = route.params?.backIcon;


    const handleDeleteOrder = async () => {
        await setCartData([]);

        changeOrderID('')
        navigation.navigate('AdminHome')


    }


    return (

        <View style={styles.rootContainer}>


            {opneScanner ? (
                <View style={{ flex: 1 }}>
                    <CameraScreen
                        showFrame={true}
                        // Show/hide scan frame
                        scanBarcode={true}
                        // Can restrict for the QR Code only
                        laserColor={'blue'}
                        // Color can be of your choice
                        frameColor={'yellow'}
                        // If frame is visible then frame color
                        colorForScannerFrame={'black'}
                        // Scanner Frame color
                        onReadCode={(event) =>
                            onBarcodeScan(event.nativeEvent.codeStringValue)
                        }

                    />
                </View>) :
                (
                    <View style={styles.container}>


                        <View style={{
                            ...styles.checkOutView,

                        }}>


                            <Image style={{ height: 50, width: 60 }} source={require('../../assets/images/ordologo-bg.png')} />

                            <Text style={{ fontSize: 18, fontFamily: 'AvenirNextCyr-Medium', marginRight: '15%' }}>Cart</Text>


                            <View></View>

                        </View>


                        {/* <View style={styles.ButtonRow}>


                            <View style={styles.ButtonContainer}>
                                <TouchableOpacity onPress={() => {
                                    if (selectedProducts.length > 0) {
                                        toggleModal();
                                    } else {

                                        alert('Please add products to the cart before sending.');
                                    }
                                }}>
                                    <Text style={{ color: 'green' }}>SEND</Text>
                                </TouchableOpacity>

                            </View>

                            <View style={styles.ButtonContainer}>
                                <TouchableOpacity onPress={saveOrder}>
                                    <Text style={{ color: 'purple' }}>SAVE</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.ButtonContainer}>
                                <TouchableOpacity onPress={handleDeleteOrder}>


                                    <Text style={{ color: 'red' }}>DELETE</Text>
                                </TouchableOpacity>
                            </View>
                        </View> */}
                        {/* 
                        <View style={styles.ProductRow}>
                            
                            <View style={styles.ProductContainer}>
                                <TouchableOpacity onPress={onOpneScanner}>
                                    <MaterialCommunityIcons
                                        name={'barcode-scan'}
                                        size={30}
                                    />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.SearchContainer}>
                                <TextInput style={styles.SearchBox} placeholder="Search Product"
                                    value={searchText}
                                    autoCapitalize="characters"
                                    onChangeText={(val) => searchProductInCart(val)} />
                                <TouchableOpacity onPress={searchTextHandler}>
                                    <AntDesign
                                        name={'close'}
                                        size={20}
                                    />
                                </TouchableOpacity>

                            </View>

                            <View style={styles.ButtonContainer1}>
                                <TouchableOpacity onPress={() => addProductToCart(searchText)}>
                                    <Text style={{ color: '#6B1594' }}>+ADD</Text>
                                </TouchableOpacity>
                            </View>

                        </View> */}


                        <View style={styles.ProductListContainer}>
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                data={selectedProducts}
                                keyboardShouldPersistTaps='handled'
                                renderItem={({ item }) =>

                                    <View style={styles.elementsView} >

                                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                            <Pressable >
                                                {item.product_image ? (
                                                    <Image
                                                        source={{ uri: item.product_image }}
                                                        style={{ ...styles.imageView }}
                                                    // onLoadStart={()=>{setLoading3(true)}}
                                                    // onLoad={()=>{setLoading3(false)}}
                                                    />
                                                ) : (
                                                    <Image
                                                        source={require('../../assets/images/noImagee.png')}
                                                        style={{ ...styles.imageView }}
                                                    />
                                                )}

                                            </Pressable>
                                            <View style={{
                                                flex: 1,
                                                // borderLeftWidth: 1.5,
                                                paddingLeft: 15,
                                                marginLeft: 10,
                                                // borderStyle: 'dotted',
                                                // borderColor: 'grey',
                                            }}>
                                                {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                    <Text style={{ color: 'grey', fontSize: 12, fontFamily: 'AvenirNextCyr-Thin', borderBottomColor: 'grey', borderBottomWidth: 0.5, }}>Size: {item.sq_feet}</Text>


                                                </View> */}
                                                <Text style={{ color: Colors.primary, fontSize: 14, fontFamily: 'AvenirNextCyr-Medium', marginTop: 5, }}>{item.name}</Text>

                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: '3%' }}>
                                                    {/* <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Thin' }}>{item.brand_name} </Text> */}

                                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                                        {/* <TouchableOpacity onPress={() => handleQuantityChange(item, 'decrement')} style={{}}>
                                                            <AntDesign name="minuscircle" size={20} color="grey" />
                                                        </TouchableOpacity> */}
                                                        <TextInput
                                                            style={{
                                                                fontSize: 14, borderWidth: 1, borderColor: 'black', fontFamily: 'AvenirNextCyr-Thin', width: '60%', textAlign: 'center',
                                                                height: 33,
                                                                justifyContent: "center",
                                                                padding: 0
                                                            }}
                                                            placeholder="quantity"

                                                            // value={item.quantity.toString()}
                                                            onChangeText={(text) => handleQuantityChange(item, text)}
                                                            keyboardType="numeric"
                                                        />
                                                        {/* <TouchableOpacity onPress={() => handleQuantityChange(item, 'increment')} style={{ justifyContent: 'center', alignItems: 'center' }}>
                                                            <AntDesign name="pluscircle" size={20} color="grey" />
                                                        </TouchableOpacity> */}
                                                    </View>


                                                    <TouchableOpacity onPress={() => removeProductFromCart(item)}>
                                                        <FontAwesome5 name='trash-alt' size={20} color={Colors.black} />
                                                    </TouchableOpacity>

                                                </View>
                                            </View>

                                        </View>
                                        <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', marginTop: '2%' }}>


                                        </View>
                                    </View>

                                }
                                keyExtractor={(item) => item.id.toString()}
                                ListEmptyComponent={() => (
                                    <View style={styles.noProductsContainer}>
                                        <Text style={styles.noProductsText}>No Products in the Cart</Text>
                                    </View>
                                )}
                            />
                        </View>


                        <View style={{ backgroundColor: '#F2F2F2', borderTopStartRadius: 30, borderTopEndRadius: 30, borderBottomColor: 'grey', borderBottomWidth: 0.5 }}>
                            < View
                                style={{
                                    paddingHorizontal: '5%',
                                    paddingVertical: '2%',
                                    marginVertical: 10,

                                }}>
                                <Text
                                    style={{
                                        fontSize: 16,
                                        color: 'black',
                                        fontWeight: '500',
                                        fontFamily: 'AvenirNextCyr-Medium',
                                        marginBottom: 10,
                                    }}>
                                    Warehouse Location
                                </Text>
                                <TouchableOpacity onPress={() => navigation.navigate('UserAddressList')}>

                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                        }}>
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                width: '80%',
                                                alignItems: 'center',
                                            }}>
                                            <View
                                                style={{
                                                    color: 'blue',
                                                    backgroundColor: '#E4E4E4',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    padding: 12,
                                                    borderRadius: 10,
                                                    marginRight: 18,
                                                }}>
                                                <MaterialCommunityIcons
                                                    name="truck-delivery-outline"
                                                    style={{
                                                        fontSize: 30,
                                                        color: 'blue',
                                                    }}
                                                />
                                            </View>
                                            <View>
                                                {/* <Text
                                                    numberOfLines={1}
                                                    style={{
                                                        fontSize: 14,
                                                        color: 'black',
                                                        fontWeight: '500',
                                                    }}>
                                                    'test'
                                                </Text> */}
                                                <Text
                                                    numberOfLines={1}
                                                    style={{
                                                        fontSize: 14,
                                                        color: 'black',
                                                        fontWeight: '500',
                                                    }}>
                                                    Plama Center
                                                </Text>

                                                <Text
                                                    style={{
                                                        fontSize: 12,
                                                        color: 'black',
                                                        fontWeight: '400',
                                                        lineHeight: 20,
                                                        opacity: 0.5,
                                                    }}>
                                                    Bejai, Mangalore - 575004
                                                </Text>
                                                <Text
                                                    style={{
                                                        fontSize: 12,
                                                        color: 'black',
                                                        fontWeight: '400',
                                                        lineHeight: 20,
                                                        opacity: 0.5,
                                                    }}>
                                                    Phone number: 9086468975
                                                </Text>
                                            </View>
                                        </View>
                                        <MaterialCommunityIcons
                                            name="chevron-right"
                                            style={{ fontSize: 22, color: 'black' }}
                                        />

                                    </View>
                                </TouchableOpacity>
                            </View >
                        </View>
                        <View style={styles.checkOutContainer}>

                            {/* <View>
                                <Text style={{ fontFamily: 'AvenirNextCyr-Medium', color: 'black', fontSize: 16 }}>Total Qty: {totalQuantity}</Text>
                            </View> */}

                            {/* <TouchableOpacity style={styles.checkOutBtn}> */}
                            <TouchableOpacity
                                style={styles.checkOutBtn}
                                onPress={handleOrderSubmit}
                            >
                                <Text style={{ fontFamily: 'AvenirNextCyr-Medium', color: 'white', fontSize: 16 }}>Submit Purchase Request</Text>
                            </TouchableOpacity>
                        </View>










                        {/* 
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={isModalVisible}
                            onRequestClose={() => setModalVisible(false)}

                        >
                            <View style={styles.modalContainer}>

                                <View style={styles.modalContent}>
                                    <View style={styles.ModalHeader}>
                                        <View><Text style={styles.modalText}>Order Review</Text></View>

                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', gap: 20 }}>
                                            <View style={{ paddingTop: 6 }}><Image style={{ height: 50, width: 60, }} source={require('../../assets/images/ordologo.png')} /></View>

                                            <TouchableOpacity style={styles.closeIcon} onPress={toggleModal}>
                                                <Icon name="times" size={20} color="#000" />
                                            </TouchableOpacity>

                                        </View>
                                    </View>
                                    <View style={styles.ModalBody}>
                                        <View style={styles.ModalCustomerDetails}>
                                            <Text>Name: {dealerData?.name}</Text>
                                            <Text>Company: {dealerData?.account_name}</Text>
                                            <Text>Address:
                                                {dealerData?.city}
                                            </Text>


                                        </View>
                                        <View style={styles.ModalOrderDetails}>

                                            <View style={{ marginTop: 10, height: windowHeight * 0.3 }}  >
                                                <ScrollView >
                                                    <Table borderStyle={{ borderColor: "gray" }}>
                                                        <Row
                                                            data={tableHead}
                                                            style={{ height: 40, backgroundColor: "#f1f8ff" }}
                                                            textStyle={{ textAlign: "center", fontWeight: "bold" }}
                                                            flexArr={[4, 1, 1]}
                                                        />
                                                        <TableWrapper style={{ flexDirection: 'row' }}>
                                                            <Rows data={renderTableData().tableData} flexArr={[4, 1, 1]} textStyle={{ textAlign: "center", fontSize: 10 }} style={{ paddingVertical: 10 }} />
                                                        </TableWrapper>
                                                    </Table>
                                                </ScrollView>
                                            </View>
                                           
                                        </View>
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

                                    <View style={styles.modalButtons}>
                                        <Pressable
                                            style={[styles.modalButton, styles.modalSendButton]}
                                            onPress={sendOrder}
                                        >
                                            <Text style={styles.modalButtonText}>Send</Text>
                                        </Pressable>
                                    </View>
                                </View>
                            </View>
                        </Modal> */}




                    </View>
                )}
        </View>

    );
}

export default SupplierCart




