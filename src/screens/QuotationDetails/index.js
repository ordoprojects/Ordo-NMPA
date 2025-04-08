import React, { useContext, useEffect, useState,useRef } from 'react'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { AuthContext } from '../../Context/AuthContext';
import { View, Dimensions, Text, ScrollView, StyleSheet, TouchableOpacity, Modal, TextInput, Alert, FlatList, Pressable, Linking } from 'react-native'
import { BarChart } from "react-native-gifted-charts";
import Colors from '../../constants/Colors';
import uniqolor from 'uniqolor';
import { useFocusEffect } from '@react-navigation/native';
import { Image } from 'react-native-animatable';
import { MapView } from '@rnmapbox/maps';
import PercentageCircle from 'react-native-percentage-circle';
import { PieChart } from "react-native-gifted-charts";
import globalStyles from '../../styles/globalStyles';
import style from '../AddShelfDisplay/style';
import { cameraPermission } from '../../utils/Helper';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import ImageResizer from '@bam.tech/react-native-image-resizer'
import RNFS from 'react-native-fs';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import moment from 'moment';
import ConvertDateTime from '../../utils/ConvertDateTime';
import LinearGradient from 'react-native-linear-gradient';
import { Checkbox,RadioButton,ActivityIndicator , TextInput as TextInput1} from "react-native-paper";
import { ProgressDialog } from 'react-native-simple-dialogs';
import Toast from "react-native-simple-toast";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { CameraScreen } from "react-native-camera-kit";
import RNFetchBlob from 'rn-fetch-blob';
import { ms, hs, vs } from "../../utils/Metrics";


const QuotationDetails = ({ navigation, route }) => {

    // const orderID = route.params?.orderId;
    // const product_list = route.params?.orderDetails.product_list;
    const orderDetail = route.params?.orderDetails;
    const selectedCompany = route.params?.selectedCompany;

    const [orderDetails, setOrderDetails] = useState(orderDetail);
    // console.log("order details", orderDetails)
    const screen = route.params?.screen;
    const [expanded, setExpanded] = useState(false);
    const [expanded1, setExpanded1] = useState(false);
    const [products, setProducts] = useState([]);
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const { userData } = useContext(AuthContext);
    const [visible, setVisible] = useState(false)
    const [loading, setLoading] = useState(false)
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [modalVisiblePop, setModalVisiblePop] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectedOption, setSelectedOption] = useState("Delivery");
    const [selectedOrderType, setSelectedOrderType] = useState("Project");
    const [inputTransportValue, setInputTransportValue] = useState('');
    const [siteAddress, setSiteAddress] = useState('');
    const [paymentTerms, setPaymentTerms] = useState(''); 
  const [loadingEndImage, setLoadingEndImage] = useState(false);


    const [base64img, setBase64img] = useState('');
    const [base64Images, setBase64Images] = useState([]);
  const input8Ref = useRef(null);
  const input9Ref = useRef(null);
  const input10Ref = useRef(null);



  console.log('====================================');
  console.log(JSON.stringify(orderDetail?.is_production,null,2));
  console.log('====================================');


  const checkPermission = async () => {
    let PermissionDenied = await cameraPermission();
    if (PermissionDenied) {
   
      console.log("camera permssion granted");
      handleCamera();
    } else {
      console.log("camera permssion denied");
      Alert.alert(
        'Camera Permission Required',
        'This app needs access to your camera. Please enable camera permission in your device settings.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleCamera = async () => {
    const res = await launchCamera({ mediaType: "photo" });
    if (res?.assets?.[0]?.uri) {
      processImage(res.assets[0].uri, res.assets[0].type);
    }
  };

  const handleGallery = async () => {
    const res = await launchImageLibrary({ mediaType: "photo" });
    if (res?.assets?.[0]?.uri) {
      processImage(res.assets[0].uri, res.assets[0].type);
    }
  };
  
  const processImage = async (img, type) => {
    try {
      const base64Data = await RNFS.readFile(img, "base64");
      const newImage = `data:${type};base64,${base64Data}`;
      setBase64Images((prevImages) => [...prevImages, newImage]);
    } catch (err) {
      console.log("Image processing error:", err);
    }
  };

  const removeImage = (index) => {
    setBase64Images((prevImages) => prevImages.filter((_, i) => i !== index));
  };


    const handleSelect = (option) => {
      setSelectedOption(option);
     };

       const handleOrderTypeSelect = (option) => {
    setSelectedOrderType(option);
  };

    useEffect(() => {
        // Initialize products when the component mounts
        if (route.params && route.params.orderDetails && route.params.orderDetails.product_list) {
            const initializedProducts = route.params.orderDetails.product_list.map(product => ({
                ...product,
                checked: false,
                returnQty: 1,
                stockError: false,
                errorMessage: ""
            }));
            setProducts(initializedProducts);
        }
    }, []);

    const [availableCount, setAvailableCount] = useState(0);
    const [unavailableCount, setUnavailableCount] = useState(0);

    useFocusEffect(
        React.useCallback(() => {
            const availableProducts = products.filter(product => product.is_available).length;
            const unavailableProducts = products.filter(product => !product.is_available).length;

            setAvailableCount(availableProducts);
            setUnavailableCount(unavailableProducts);
        }, [products])
    );

    console.log("check available", unavailableCount, availableCount);

    console.log("id",orderDetails.id);

    const changeStatus = async () => {
        if(paymentTerms){
        // Display a confirmation dialog
        Alert.alert( orderDetail?.is_production ? "Manager Approve" : "Create Order",
        orderDetail?.is_production 
          ? "Are you sure you want the manager to approve this order?" 
          : "Are you sure you want to create this order?", [
            {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel",
            },
            {
                text: "Yes",
                onPress: async () => {
                  setLoadingEndImage(true)
                    var myHeaders = new Headers();
                    myHeaders.append("Content-Type", "application/json");
                    myHeaders.append("Authorization", `Bearer ${userData.token}`);

                    var raw = JSON.stringify({
                        status: orderDetail?.is_production ? "Manager Approve":"Pending",
                        stages: "Sales Order Placed",
                        transportation_type: selectedOption,
                        salesType: selectedOrderType,
                        transportationRemarks: inputTransportValue,
                        bill_img: base64Images.map((image) => ({
                          image_data: image,
                        })),
                        site_address:siteAddress,
                        payment_term:paymentTerms

                    });

                    console.log("raw----------------->", raw)

                    var requestOptions = {
                        method: "PUT",
                        headers: myHeaders,
                        body: raw,
                        redirect: "follow",
                    };

                    await fetch(
                        `https://gsidev.ordosolution.com/api/qs_to_so/${orderDetails?.id}/`,
                        requestOptions
                    )
                        .then((response) => {
                            console.log(response);

                            if (response.status === 200) {
                                Toast.show("Order Created successfully", Toast.LONG);
                                setLoadingEndImage(false)
                                setModalVisiblePop(false);
                                getOrderDetails();
                                navigation.goBack();
                            }else{
                              setLoadingEndImage(false)
                            }
                              setLoadingEndImage(false)
                        })
                        // .then((result) => {
                        //     console.log("result", result)
                        // })
                        .catch((error) => {console.log("api error", error);   setLoadingEndImage(false);});
                },
            },
        ]);
    }else{
      Alert.alert(
            "Warning",
            `Please enter payment terms`
          );
  }
    };


    const toggleSelectedProduct = (item) => {
        const productId = item.id;
        const updatedProducts = products.map(product => {
            if (product.id === productId) {
                return { ...product, checked: !product.checked, stockError: false, returnQty: 1 };
            }
            return product;
        });
        setProducts(updatedProducts);

        const isSelected = selectedItems.some(selectedItem => selectedItem.id === productId);

        if (isSelected && !updatedProducts.find(product => product.id === productId)?.checked) {
            const updatedSelectedItems = selectedItems.filter(selectedItem => selectedItem.id !== productId);
            setSelectedItems(updatedSelectedItems);
        } else if (!isSelected && updatedProducts.find(product => product.id === productId)?.checked) {
            const selectedItem = updatedProducts.find(product => product.id === productId);
            setSelectedItems([...selectedItems, selectedItem]);
        }
    }

    const handleQuantityChange = (item, action) => {
        let orderedQty = parseInt(item.qty);
        let returnQty = parseInt(item.returnQty);

        console.log("ordered Qty", orderedQty)
        console.log("return qty", returnQty)

        if (isNaN(returnQty) || returnQty < 1) {
            const updatedProducts = products.map((product) =>
                product.id === item.id
                    ? { ...product, returnQty: 1, stockError: false }
                    : product
            );
            setProducts(updatedProducts);
        }

        if (action === "increment") {
            // Increment returnQty by 1
            const updatedProducts = products.map((product) =>
                product.id === item.id
                    ? { ...product, returnQty: returnQty + 1, stockError: false }
                    : product
            );
            setProducts(updatedProducts);
        } else if (action === "decrement" && returnQty > 0) {
            // Decrement returnQty by 1
            const updatedProducts = products.map((product) =>
                product.id === item.id
                    ? { ...product, returnQty: returnQty - 1, stockError: false }
                    : product
            );
            setProducts(updatedProducts);
        } else if (!isNaN(action) && action >= 0) {
            // Set returnQty to the entered value
            const updatedProducts = products.map((product) =>
                product.id === item.id
                    ? { ...product, returnQty: parseInt(action), stockError: false }
                    : product
            );
            setProducts(updatedProducts);
        }

    };


    const renderItem = ({ item }) => {

        return (
            <TouchableOpacity style={styles.elementsView} onPress={() => { toggleSelectedProduct(item) }}>

                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <Checkbox.Android
                        color={Colors.primary}
                        status={item.checked ? 'checked' : 'unchecked'}
                    />
                    <View >
                        {item.product_image && item.product_image.length > 0 ? (
                            <Image
                                source={{ uri: item.product_image[0] }} // Use the first image
                                style={styles.imageView}
                            />
                        ) : (
                            <Image
                                source={require("../../assets/images/noImagee.png")} // Use default image
                                style={styles.imageView}
                            />
                        )}

                    </View>
                    <View style={{
                        flex: 1,
                        paddingLeft: 15,
                        marginLeft: 10,
                    }}>

                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text style={{ color: Colors.primary, fontSize: 14, fontFamily: 'AvenirNextCyr-Medium', marginTop: 5, }}>{item.name}</Text>


                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}>Price :  </Text>
                                <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}>{parseFloat(item.price).toFixed(2)} </Text>
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: '3%', justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}>Qty :  </Text>
                                <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}>{item.qty} {item?.loaded_uom}</Text>
                            </View>

                        </View>

                        {item?.checked && <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', marginTop: '2%' }}>
                            <Text style={{ color: 'black', fontSize: 14, fontFamily: 'AvenirNextCyr-Medium' }}>Return Qty</Text>

                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: 10,
                                }}
                            >
                                <TouchableOpacity
                                    onPress={() =>
                                        handleQuantityChange(item, "decrement")
                                    }
                                    style={{}}
                                >
                                    <Entypo
                                        name="squared-minus"
                                        size={20}
                                        color="black"
                                    />
                                </TouchableOpacity>
                                <TextInput
                                    style={{
                                        fontSize: 14,
                                        borderWidth: 1,
                                        borderColor: "black",
                                        fontFamily: "AvenirNextCyr-Medium",
                                        width: 40,
                                        textAlign: "center",
                                        height: 26,
                                        justifyContent: "center",
                                        padding: 1,
                                        color: "black",
                                    }}
                                    value={item.returnQty > 0 ? item.returnQty.toString() : 1}
                                    onChangeText={(text) =>
                                        handleQuantityChange(item, text)
                                    }
                                    keyboardType="numeric"
                                />
                                <TouchableOpacity
                                    onPress={() =>
                                        handleQuantityChange(item, "increment")
                                    }
                                    style={{
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    <Entypo
                                        name="squared-plus"
                                        size={20}
                                        color="black"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>}



                    </View>

                </View>
                {item.stockError && <View style={{ marginTop: '2%' }}>
                    <Text style={{ textAlign: 'center', fontFamily: 'AvenirNextCyr-Medium', color: 'red' }}>{item.errorMessage}</Text>
                </View>}
            </TouchableOpacity>
        )
    }



    const handlePhonePress = () => {
        Linking.openURL(`tel:${orderDetails?.mobile_number}`);
    };


    const toggleExpansion = () => {
        setExpanded(!expanded);
    };

    const toggleExpansion1 = () => {
        setExpanded1(!expanded1);
    };


    const getOrderDetails = async () => {
        setLoading(true);
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "text/plain");
        myHeaders.append("Authorization", `Bearer ${userData.token}`);

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        // console.log(`https://gsidev.ordosolution.com/api/sales_order/${orderDetails.id}`)

        await fetch(`https://gsidev.ordosolution.com/api/sales_order/${orderDetails.id}/`, requestOptions)
            .then(response => response.json())
            .then(async result => {
                setOrderDetails(result)
                setProducts(result?.product_list);
                // console.log("testttt", result)
            })
            .catch(error => console.log('getOrderDetails api error', error));
        setLoading(false);

    }


    const requestPDF = () => {

        navigation.navigate("PDFViewer", { title: "Quotation", url: orderDetails?.invoice_quotation });

    };


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





    return (
        <View style={{ flex: 1, padding: 24, backgroundColor: 'white' }}>

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    {/* <AntDesign name='arrowleft' size={25} color={Colors.primary} /> */}
                    <Image
                        source={require("../../assets/images/Refund_back.png")}
                        style={{ height: 30, width: 30, tintColor: Colors.primary }}
                    />
                </TouchableOpacity>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    {screen === "PO" ? (<Text style={{ fontSize: 20, color: Colors.primary, fontFamily: 'AvenirNextCyr-Medium' }}>{orderDetails.name} ({orderDetails.supplier_name}-{orderDetails.supplier_id})</Text>) :
                        (<Text style={{ fontSize: 20, color: Colors.primary, fontFamily: 'AvenirNextCyr-Medium' }}>{orderDetails.name} ({orderDetails.assignee_name}-{orderDetails.assigne_to})</Text>)}
                </View>


                <View>

                </View>
            </View>



            <View style={styles.card}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: '5%', paddingTop: '5%', alignItems: 'center' }}>
                    <Text style={styles.cardTitle}>Quotation</Text>
                    <View style={{
                        paddingHorizontal: '4%',
                        paddingVertical: '2%',
                        backgroundColor: orderDetails.status === 'Cancel' || orderDetails.status === 'Cancelled' || orderDetails.status === 'Pending Balance' || orderDetails.status === 'Missing Product'
                            ? '#d11a2a'
                            : (orderDetails.status === 'Pending'
                                ? 'orange'
                                : (orderDetails.status === 'In Transit'
                                    ? '#005000'
                                    : (orderDetails.status === 'On Hold'
                                        ? 'rgba(255, 165, 0, 0.8)'
                                        : 'green'
                                    )
                                )
                            )
                        ,
                        borderRadius: 20
                    }}>
                        <Text style={{ fontFamily: 'AvenirNextCyr-Medium', fontSize: 14, color: 'white' }}>
                            {orderDetails.status}
                        </Text>
                    </View>

                </View>

                <View style={styles.expandedContent}>
                    <View style={{ paddingHorizontal: '5%', paddingBottom: '2%' }}>
                        <View style={styles.row}>
                            <Text style={styles.title}>Quotation ID</Text>
                            <Text style={styles.value}>{orderDetails.name}</Text>
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.title}>{screen === "PO" ? 'Supplier' : 'Customer'}</Text>
                            <Text style={[styles.value, { textAlign: 'right', width: '72%' }]}>{screen === "PO" ? orderDetails.supplier_name : orderDetails.assignee_name}</Text>
                        </View>

                        <View style={styles.row}>
              <Text style={styles.title}>
                Bill to
              </Text>
              <Text style={[styles.value,{textAlign:'right',width:'72%'}]}>
                {orderDetails?.company_name}
              </Text>
            </View>

                        <View style={styles.row}>
                            <Text style={styles.title}>Quotation Created</Text>
                            <Text style={styles.value}>{ConvertDateTime(orderDetails?.created_at).formattedDate} {ConvertDateTime(orderDetails?.created_at).formattedTime}</Text>
                        </View>

                        {/* <View style={styles.row}>
                            <Text style={styles.title}>Total Qty</Text>
                            <Text style={styles.value}>{totalQuantity}</Text>
                        </View> */}

<View style={styles.row}>
    <Text style={styles.title}>Total Price</Text>
    <Text style={styles.value}>
        {orderDetails?.total_price ? 
            new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(orderDetails.total_price) : 
            '₹0'}
    </Text>
</View>


                        <View style={styles.row}>
                            <Text style={styles.title}>Download PDF </Text>
                            {/* <Text style={styles.value}>{parseFloat(orderDetails.total_price).toFixed(2)}</Text> */}
                            <TouchableOpacity
                                onPress={() => requestPDF()}
                                style={{
                                    ...styles.value,
                                    marginTop: "1%",
                                    flexDirection: "row",
                                    gap: 5,
                                }}
                            >
                                <AntDesign name="filetext1" color="#000C66" size={20} />
                                <Text
                                    style={{
                                        fontSize: 18,
                                        color: "#000C66",
                                        fontFamily: "AvenirNextCyr-Bold",
                                    }}
                                >
                                    Quotation
                                </Text>
                            </TouchableOpacity>
                        </View>

                    </View>

                    {/* <TouchableOpacity style={{ borderTopWidth: 1, paddingHorizontal: '5%', paddingVertical: '4%', borderTopColor: 'grey', flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#F5F5F5' }}
                        onPress={toggleExpansion}
                    >
                        <Text style={{ fontFamily: 'AvenirNextCyr-Medium' }}>Shipping Details</Text>
                        {expanded ? (<FontAwesome name='angle-up' size={20} color={`black`} />) : (<FontAwesome name='angle-down' size={20} color={`black`} />)}
                    </TouchableOpacity>

                    {expanded && <View style={{ paddingHorizontal: '5%', paddingBottom: '4%' }}>
                        <Text style={{ fontFamily: 'AvenirNextCyr-Medium', fontSize: 15 }}><Text style={{ fontFamily: 'AvenirNextCyr-Medium', fontSize: 14 }}>Name :</Text> {orderDetails?.ordered_by}</Text>
                        <View style={{ flexDirection: 'row', marginVertical: '4%' }}>
                            <Text style={{ fontFamily: 'AvenirNextCyr-Medium', fontSize: 15 }}>Address : </Text>
                            <Text style={{ fontFamily: 'AvenirNextCyr-Medium', fontSize: 15 }}> {orderDetails?.address}</Text>
                        </View>


                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={{ fontFamily: 'AvenirNextCyr-Medium', fontSize: 15 }}><Text style={{ fontFamily: 'AvenirNextCyr-Medium', fontSize: 14 }}>Contact No : </Text>{orderDetails?.mobile_number}</Text>
                            {userData.type === '99' && <TouchableOpacity onPress={handlePhonePress}><Feather name='phone-call' size={20} color={Colors.primary} /></TouchableOpacity>}
                        </View>

                    </View>} */}

                </View>
            </View>


            <View style={[styles.card1, { marginBottom: '10%', paddingHorizontal: '3%' }]}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: '5%', paddingVertical: '3%', borderBottomWidth: 1, borderBottomColor: 'grey' }}>
                    <Text style={styles.cardTitle}>Products</Text>
                    <View><Text style={styles.cardTitle}>#{products?.length}</Text></View>
                </View>




                <View style={styles.ProductListContainer}>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={products}
                        keyboardShouldPersistTaps='handled'
                        renderItem={({ item }) =>

                            <View style={{ ...styles.elementsView, backgroundColor: (!item.is_available ? "#fbd9d3" : " ") }} >


                                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                    <Pressable >
                                        {item.product_image && item.product_image.length > 0 ? (
                                            <Image
                                                source={{ uri: item.product_image[0] }} // Use the first image
                                                style={styles.imageView}
                                            />
                                        ) : (
                                            <Image
                                                source={require("../../assets/images/noImagee.png")} // Use default image
                                                style={styles.imageView}
                                            />
                                        )}

                                    </Pressable>
                                    <View style={{
                                        flex: 1,
                                        paddingLeft: 15,
                                        marginLeft: 10,
                                    }}>
                                        <Text style={{ color: Colors.primary, fontSize: 14, fontFamily: 'AvenirNextCyr-Medium', marginTop: 5, }}>{item.name}</Text>

                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: '3%', justifyContent: 'space-between' }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}>Qty :  </Text>
                                                <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}>{item.qty}{item?.loaded_uom}

                                                </Text>
                                            </View>


                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}>Price :  </Text>
                                                <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}>{parseFloat(item.price).toFixed(2)} </Text>
                                            </View>

                                        </View>

                                        {!item.is_available && <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', marginTop: '2%' }}>
                                            <Text style={{ fontFamily: 'AvenirNextCyr-Bold', color: 'tomato' }}>Unavailable</Text>
                                        </View>}
                                    </View>
                                </View>
                            </View>
                        }
                    />
                </View>
            </View>

            {orderDetails.status == 'Pending' && orderDetails.stages == "Quotation Sent" &&
                <LinearGradient
                    colors={Colors.linearColors}
                    start={Colors.start}
                    end={Colors.end}
                    locations={Colors.ButtonsLocation}
                    style={{ borderRadius: 20 }}
                >
                    <TouchableOpacity
                        onPress={()=>{setModalVisiblePop(true)}}
                        style={{ paddingVertical: '4%', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontFamily: 'AvenirNextCyr-Bold', color: 'white' }}> {orderDetail?.is_production ? 'Send for Manager Approval':'Create Sales Order'}</Text>
                    </TouchableOpacity>
                </LinearGradient>
            }

            <ProgressDialog
                visible={loading}
                // title="Uploading file"
                dialogStyle={{ width: '50%', alignSelf: 'center' }}
                message="Please wait..."
                titleStyle={{ fontFamily: 'AvenirNextCyr-Medium', fontSize: 16 }}
                messageStyle={{ fontFamily: 'AvenirNextCyr-Medium', fontSize: 14 }}
            />


    {/* ************** transportaion type ***************** */}
  <Modal visible={modalVisiblePop} transparent={true}
        onRequestClose={() => setModalVisiblePop(false)}
  >
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              justifyContent: "center",
              paddingHorizontal: 10,
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                paddingHorizontal: 5,
                borderRadius: 8,
                paddingVertical: "4%",
                flex:0.55
              }}
            >
             

 <ScrollView
        style={{
          paddingHorizontal: 5,
          paddingBottom: 20, // Add padding to avoid overlap with the submit button
        }}
      >
              <View
                style={{
                  flexDirection: "row",
                  paddingHorizontal: "4%",
                }}
              >
                <Text
                  style={{
                    fontSize: 19,
                    color: "black",
                    fontFamily: "AvenirNextCyr-Bold",
                  }}
                >
                  Select Transportation Type
                </Text>
                 <TouchableOpacity
                style={{ position: "absolute", top: 0, right: 10 }}
                onPress={() => setModalVisiblePop(false)}
              >
                <MaterialIcons name="close" size={24} color="black" />
              </TouchableOpacity>
              </View>
            
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

                 <Text
                  style={{
                  fontSize: 19,
                  color: "black",
                  fontFamily: "AvenirNextCyr-Bold",
                  paddingHorizontal: "4%",
                  }}
                >
                  Select Order Type
                </Text>

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
                    selectedOrderType === "Project" ? Colors.primary : "white",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 30,
                  }}
                >
                  <RadioButton.Android
                    color={"white"}
                    status={selectedOrderType === "Project" ? "checked" : "unchecked"}
                    onPress={() => handleOrderTypeSelect("Project")}
                  />
                  <TouchableOpacity onPress={() => handleOrderTypeSelect("Project")}>
                    <Text
                      style={{
                        fontFamily: "AvenirNextCyr-Medium",
                        fontSize: 15,
                        color: selectedOrderType === "Project" ? "white" : "black",
                      }}
                    >
                      Project
                    </Text>
                  </TouchableOpacity>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    paddingVertical: "1%",
                    backgroundColor:
                    selectedOrderType === "Retailer" ? Colors.primary : "white",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 30,
                    width: "40%",
                  }}
                >
                  <RadioButton.Android
                    color={"white"}
                    status={selectedOrderType === "Retailer" ? "checked" : "unchecked"}
                    onPress={() => handleOrderTypeSelect("Retailer")}
                  />
                  <TouchableOpacity onPress={() => handleOrderTypeSelect("Retailer")}>
                    <Text
                      style={{
                        fontFamily: "AvenirNextCyr-Medium",
                        fontSize: 15,
                        color: selectedOrderType === "Retailer" ? "white" : "black",
                      }}
                    >
                      Retail
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <TextInput1
            mode="outlined"
            label="Remarks"
            theme={{ colors: { onSurfaceVariant: "#4b0482" } }}
            activeOutlineColor="#4b0482"
            outlineColor="#B6B4B4"
            textColor="#4b0482"
            value={inputTransportValue}
            onChangeText={text => setInputTransportValue(text)}
            ref={input8Ref}
            onSubmitEditing={() => input10Ref.current.focus()}
            returnKeyType="done"
            blurOnSubmit={false}
            outlineStyle={{ borderRadius: ms(10) }}
            style={{ marginBottom: "5%", height: 0, backgroundColor: "white",marginHorizontal:'2%' }}
          />

                <TextInput1
            mode="outlined"
            label="Payment Terms"
            theme={{ colors: { onSurfaceVariant: "#4b0482" } }}
            activeOutlineColor="#4b0482"
            outlineColor="#B6B4B4"
            textColor="#4b0482"
            value={paymentTerms}
            onChangeText={text => setPaymentTerms(text)}
            ref={input10Ref}
            onSubmitEditing={() => input9Ref.current.focus()}
            returnKeyType="done"
            blurOnSubmit={false}
            outlineStyle={{ borderRadius: ms(10) }}
            style={{ marginBottom: "5%", height: 0, backgroundColor: "white",marginHorizontal:'2%' }}
          />

          <TextInput1
            mode="outlined"
            label="Site Address"
            value={siteAddress}
            theme={{ colors: { onSurfaceVariant: "#4b0482" } }}
            activeOutlineColor="#4b0482"
            outlineColor="#B6B4B4"
            textColor="#4b0482"
            multiline={true}
            numberOfLines={4}
            onChangeText={(text) => setSiteAddress(text)}
            ref={input9Ref}
            // onSubmitEditing={() => input9Ref.current.focus()}
            returnKeyType="next"
            blurOnSubmit={false}
            outlineStyle={{ borderRadius: ms(10) }}
            style={{ marginBottom: "5%", height: 0, backgroundColor: "white",marginHorizontal:'2%' }}

            // style={{ marginBottom: "5%", height: 0, backgroundColor: "white" }}
          />

             <View>
              <Text
                  style={{
                  fontSize: 19,
                  color: "black",
                  fontFamily: "AvenirNextCyr-Bold",
                  paddingHorizontal: "4%",
                  }}
                >
                 Order Image
                </Text>

            <View style={styles.buttonview}>
           
                <TouchableOpacity
                  style={{ ...styles.photosContainer, paddingTop: 8 ,backgroundColor:Colors.primary}}
                  onPress={checkPermission}
                >
                  <AntDesign name="camera" size={25} color={Colors.white} />
                </TouchableOpacity>

            
                <TouchableOpacity
                  style={{...styles.photosContainer,backgroundColor:Colors.primary}}
                  onPress={handleGallery}
                >
                  <Text style={styles.buttonText}>Gallery</Text>
                </TouchableOpacity>
            </View>
            <View
              style={{ flexDirection: "row", alignItems: "flex-end", gap: 15 ,paddingLeft:'5%'}}
            >
{base64Images.map((image, index) => (
          <View key={index} style={styles.imageWrapper}>
            <Image source={{ uri: image }} style={styles.imgStyle} />
            <TouchableOpacity
              onPress={() => removeImage(index)}
              style={styles.deleteButton}
            >
              <AntDesign name="delete" size={20} color="black" />
            </TouchableOpacity>
          </View>
        ))}
            </View>
          </View>

        
      </ScrollView>

              <View style={{ flexDirection: "row", justifyContent: "center" }}>
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
                  }}
                >
                  <TouchableOpacity
                    style={{
                      width: '70%', justifyContent: "center",
                      paddingVertical: "4%",
                      alignItems: "center",
                    }}
                    activeOpacity={0.8}
                    onPress={changeStatus}
                  >
                    {loadingEndImage ? <ActivityIndicator size="small" color="white" />
                :
                <Text style={{
                  fontFamily: "AvenirNextCyr-Medium",
                  color: "#fff",
                  fontSize: 16,
                }}>Submit</Text>
                } 
                   
                  </TouchableOpacity>
                </LinearGradient>
              </View>
            </View>
          </View>
        </Modal>




        </View>
    )
}

export default QuotationDetails;
const styles = StyleSheet.create({


    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        // marginBottom: 7
    },

    row: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    title: {
        fontFamily: 'AvenirNextCyr-Medium',
        fontSize: 14,
        color:Colors.black
    },

    value: {
        fontFamily: 'AvenirNextCyr-Medium',
        fontSize: 15,
        color:Colors.black
    },

    imageView: {
        width: 65,
        height:65,
        // borderRadius: 40,
        // marginTop: 20,
        // marginBottom: 10
    },
    elementsView: {

        // ...globalStyles.border,
        paddingVertical: '4%',
        borderBottomColor: 'grey',
        borderBottomWidth: 0.5,
        paddingHorizontal: '2%'

    },
    ProductListContainer: {
        flex: 1,
        marginVertical: '4%',
    },

















    salesContainer: {
        marginHorizontal: 16,
        padding: 10,
        backgroundColor: Colors.white,
        flexDirection: 'row',
        alignItems: 'center',
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
        fontFamily: 'AvenirNextCyr-Medium',

    },
    label: {
        fontSize: 16,
        color: Colors.black,
        fontFamily: 'AvenirNextCyr-Medium',
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
    heading: {
        fontSize: 22,
        color: Colors.primary,
        fontFamily: 'AvenirNextCyr-Medium',
    },
    subHeading: {
        fontSize: 13,
        color: 'grey',
        fontFamily: 'AvenirNextCyr-Medium',
    },
    card: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginVertical: '5%',
        backgroundColor: '#F5F5F5',

        // flex:0.5

    },

    card1: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        // marginVertical: '5%',
        backgroundColor: '#F5F5F5',

        flex: 1

    },
    cardTitle: {
        fontSize: 15,
        fontFamily: 'AvenirNextCyr-Bold',
        color:Colors.black
    },
    expandedContent: {
        marginTop: 20,
    },
    avatarImageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        borderColor: 'grey',
        borderWidth: 1,
        width: 80,
        height: 80,
        borderRadius: 50,
    },
    avatarImage: {
        width: 80,
        height: 80,
        borderRadius: 40, // Half of the width/height to make it circular
        borderWidth: 1,   // Border styles
        borderColor: 'grey',
        overflow: 'hidden',
    },
    modalContainer1: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent1: {
        backgroundColor: 'white',
        width: 300,
        borderRadius: 10,
        padding: 30,
    },
    submitButton: {
        backgroundColor: Colors.primary,
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
        marginTop: 8,
        marginLeft: 15,
        marginRight: 15,
    },
    submitButton1: {
        backgroundColor: Colors.primary,
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
        // marginTop: 2,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'AvenirNextCyr-Medium'
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 1,
    },
    inputView: {
        width: "100%",
        borderWidth: 1,
        backgroundColor: "white",
        borderRadius: 8,
        height: '2%',
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
        // marginBottom: 20,
        // justifyContent: "center",
        // padding: 20,
        paddingLeft: 5,

    },
    inputText: {
        height: 50,
        color: "black",
        fontFamily: 'AvenirNextCyr-Medium',
    },
    inputText1: {
        fontFamily: 'AvenirNextCyr-Medium',
        color: "black",
        // height: 500,
    },
    addressInput: {
        // height: 100, // Adjust the height as needed for your design
    },
    Btext: {
        color: 'white',
        fontFamily: 'AvenirNextCyr-Bold',
        fontSize: 17

    },
       buttonview: {
    flexDirection: "row",
    alignItems: "center",
    gap:10,
    padding: 12,

  },
  buttonContainer: {
    height: 50,
    padding: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  photosContainer: {
    height: 40,
    padding: 10,
    borderRadius: 10,
  },
  buttonText: {
    fontFamily: "AvenirNextCyr-Medium",
    color: "white",
  },
   imgStyle: {
    width: 90,
    height: 90,
    resizeMode: "cover",
    borderRadius: 8,
    marginTop: 5,
    marginBottom: 5,
  },

})