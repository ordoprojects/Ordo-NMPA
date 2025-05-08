import React, { useContext, useEffect, useState } from 'react'
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
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import moment from 'moment';


const OrderDetails = ({ navigation, route }) => {

    const orderID = route.params?.orderId;
    const orderDetails = route.params?.orderDetails;
    const [expanded, setExpanded] = useState(false);
    const [expanded1, setExpanded1] = useState(false);
    const [products, setProducts] = useState([]);
    const [totalQuantity, setTotalQuantity] = useState(0); // Initialize totalQuantity with 0
    const { userData } = useContext(AuthContext);




    const handlePhonePress = () => {
        Linking.openURL(`tel:${orderDetails?.mobile_number}`);
    };


    const toggleExpansion = () => {
        setExpanded(!expanded);
    };

    const toggleExpansion1 = () => {
        setExpanded1(!expanded1);
    };


    


    const getOrderDetails = async (latitude, longitude) => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "text/plain");

        var raw = JSON.stringify(
            {
                "__order_id__": orderID,
            }
        )

        console.log("details_raw", raw)

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        await fetch("https://tilewholesaler.ordosolution.com/get_order_details.php", requestOptions)
            .then(response => response.json())
            .then(async result => {
                setProducts(result.orders_details)
                // console.log("testttt", result.orders_details)
            })
            .catch(error => console.log('get today plan api error', error));
    }


    useEffect(() => {
        getOrderDetails();
    }, [])



    useEffect(() => {
        // Calculate the sum of quantities when cartData changes
        const sumQuantity = products.reduce((accumulator, item) => {
            // Parse item.quantity as an integer; if it's NaN or less than 1, use 1
            const quantity = parseInt(item.product_qty);
            const validQuantity = isNaN(quantity) || quantity < 1 ? 1 : quantity;

            return accumulator + validQuantity;
        }, 0);

        // Update the totalQuantity state with the calculated sum
        setTotalQuantity(sumQuantity);
    }, [products]);








    return (
        <ScrollView style={{ flex: 1, backgroundColor: 'white', padding: 24, }}>

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <AntDesign name='arrowleft' size={25} color={Colors.primary} />
                </TouchableOpacity>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 20, color: Colors.primary, fontFamily: 'AvenirNextCyr-Medium' }}>{orderDetails.name}</Text>
                </View>


                <View>

                </View>
            </View>



            <View style={styles.card}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: '5%', paddingTop: '5%', alignItems: 'center' }}>
                    <Text style={styles.cardTitle}>Order Details</Text>
                    <View style={{
                        paddingHorizontal: '4%',
                        paddingVertical: '2%',
                        backgroundColor: orderDetails.type === 'Cancel' ? '#d11a2a' : (orderDetails.status === 'Confirmed' ? 'orange' : (orderDetails.status === 'In Transit' ? '#005000' : 'green')),
                        borderRadius: 20
                    }}>
                        <Text style={{ fontFamily: 'AvenirNextCyr-Medium', fontSize: 14, color: 'white' }}>
                            {orderDetails.type === 'Cancel' ? 'Canceled' : (orderDetails.status === 'In Transit' ? 'Shipped' : orderDetails.status)}
                        </Text>
                    </View>

                </View>

                <View style={styles.expandedContent}>
                    <View style={{ paddingHorizontal: '5%', paddingBottom: '2%' }}>
                        <View style={styles.row}>
                            <Text style={styles.title}>Order ID</Text>
                            <Text style={styles.value}>{orderDetails.name}</Text>
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.title}>Order Placed</Text>
                            <Text style={styles.value}>{moment(orderDetails?.date_modified).format('DD-MM-YYYY')}</Text>
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.title}>Total Quantity</Text>
                            <Text style={styles.value}>{orderDetails.products.length}</Text>
                        </View>

                    </View>

                    {/* <TouchableOpacity style={{ borderTopWidth: 1, paddingHorizontal: '5%', paddingVertical: '4%', borderTopColor: 'grey', flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#F5F5F5' }}
                        onPress={toggleExpansion}
                    >
                        <Text style={{ fontFamily: 'AvenirNextCyr-Medium' }}>Shipping Details</Text>
                        {expanded ? (<FontAwesome name='angle-up' size={20} color={`black`} />) : (<FontAwesome name='angle-down' size={20} color={`black`} />)}
                    </TouchableOpacity> */}

                    {expanded && <View style={{ paddingHorizontal: '5%', paddingBottom: '4%' }}>
                        <Text style={{ fontFamily: 'AvenirNextCyr-Medium', fontSize: 15 }}><Text style={{ fontFamily: 'AvenirNextCyr-Medium', fontSize: 14 }}>Name :</Text> {orderDetails?.ordered_by}</Text>
                        <View style={{ flexDirection: 'row', marginVertical: '4%', flexWrap: 'wrap' }}>
                            <Text style={{ fontFamily: 'AvenirNextCyr-Medium', fontSize: 15 }}>Address : </Text>
                            <Text style={{ fontFamily: 'AvenirNextCyr-Medium', fontSize: 15, flex: 1 }}>{orderDetails?.address}</Text>
                        </View>



                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={{ fontFamily: 'AvenirNextCyr-Medium', fontSize: 15 }}><Text style={{ fontFamily: 'AvenirNextCyr-Medium', fontSize: 14 }}>Contact No : </Text>{orderDetails?.mobile_number}</Text>
                            {userData.type === '99' && <TouchableOpacity onPress={handlePhonePress}><Feather name='phone-call' size={20} color={Colors.primary} /></TouchableOpacity>}
                        </View>

                    </View>}

                </View>
            </View>


            <View style={[styles.card, { marginBottom: '10%' }]}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: '5%', paddingVertical: '3%', borderBottomWidth: 1, borderBottomColor: 'grey' }}>
                    <Text style={styles.cardTitle}>Products</Text>
                    <View style={styles.cardTitle}><Text>#{products.length}</Text></View>
                </View>



                <View style={styles.ProductListContainer}>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={products}
                        keyboardShouldPersistTaps='handled'
                        renderItem={({ item }) =>

                            <View style={styles.elementsView} >

                                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                    <Pressable >
                                        {item.product_image ? (
                                            <Image
                                                source={{uri: item.product_image.startsWith("http")
          ? item.product_image
          : `https://gsidev.ordosolution.com${item.product_image}`,
      }}
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
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Text style={{ color: 'grey', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium', borderBottomColor: 'grey', borderBottomWidth: 0.5, }}>Size: {item.size_mm}</Text>


                                        </View>
                                        <Text style={{ color: Colors.primary, fontSize: 14, fontFamily: 'AvenirNextCyr-Medium', marginTop: 5, }}>{item.name}</Text>

                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: '3%' }}>
                                            <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}>Quantity :  </Text>
                                            <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}>{item.product_qty} </Text>

                                        </View>
                                    </View>

                                </View>
                                <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', marginTop: '2%' }}>
                                </View>
                            </View>

                        }
                        keyExtractor={(item) => item.product_id.toString()}

                    />
                </View>


            </View>



            {/* <TouchableOpacity style={{ marginTop: 5 }} onPress={toggleExpansion1}>
                <View style={styles.card}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={styles.cardTitle}><AntDesign name='lock1' size={22} color={`black`} />   Change Password</Text>
                        <FontAwesome name='angle-down' size={20} color={`black`} />
                    </View>
                    {expanded1 && (
                        <View style={styles.expandedContent}>
                            <View style={styles.inputView}>
                                <TextInput
                                    style={styles.inputText}
                                    placeholder="Password"
                                    secureTextEntry={true}
                                    autoCapitalize='none'
                                    placeholderTextColor="#003f5c"
                                    onChangeText={(val) => { setResetPass(val) }}
                                // onChangeText={text => updateName(text)}
                                />
                            </View>

                   
                       






                        </View>
                    )}
                </View>
            </TouchableOpacity> */}




        </ScrollView>
    )
}

export default OrderDetails;
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
        width: 80,
        height: 80,
        // borderRadius: 40,
        // marginTop: 20,
        // marginBottom: 10
    },
    elementsView: {

        // ...globalStyles.border,
        padding: '5%',
        borderBottomColor: 'grey',
        borderBottomWidth: 0.5

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
        fontFamily: 'Poppins-Bold',

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
        // flex:1

    },
    cardTitle: {
        fontSize: 15,
        fontFamily: 'AvenirNextCyr-Medium',
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

})