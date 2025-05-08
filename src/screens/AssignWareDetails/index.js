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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import Toast from "react-native-simple-toast";
import AwesomeAlert from 'react-native-awesome-alerts';
import { Dropdown, MultiSelect } from "react-native-element-dropdown";
import LinearGradient from 'react-native-linear-gradient';
import { LoadingView } from "../../components/LoadingView";


import moment from 'moment';
import { ProgressDialog } from 'react-native-simple-dialogs';
import ConvertDateTime from '../../utils/ConvertDateTime';


const AssignWareDetails = ({ navigation, route }) => {

    // const orderID = route.params?.orderId;
    // const product_list = route.params?.orderDetails.product_list;
    const orderDetails = route.params?.orderDetails;
    const screen = route.params?.screen;
    const floorId=route.params?.floorId
    const [expanded, setExpanded] = useState(true);
    const [expanded1, setExpanded1] = useState(true);
    const [products, setProducts] = useState(route.params?.orderDetails.product_list);
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0); // Initialize totalQuantity with 0
    // Initialize totalQuantity with 0
    const { userData } = useContext(AuthContext);
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(false)
    const [vehicleDrop, setVehicleDrop] = useState([]);
    const [vehicleName, setVehicleName] = useState([]);
    const [loading1, setLoading1] = useState(true);
// console.log("floorId",floorId)

const [selectedProductId, setSelectedProductId] = useState(null);

const handleSelectProduct = async (productId) => {

  setSelectedProductId(productId);
  console.log("kshbAS",productId)
  await AssignFloor(productId)

};
console.log("kshbAS",products)





    const handlePhonePress = () => {
        Linking.openURL(`tel:${orderDetails?.mobile_number}`);
    };


    const toggleDetails = () => {
        setExpanded(!expanded);
    };

    const toggleExpansion1 = () => {
        setExpanded1(!expanded1);
    };

    // useEffect(() => {
    //     // Calculate the sum of quantities when cartData changes
    //     const sumQuantity = products.reduce((accumulator, item) => {
    //         // Parse item.quantity as an integer; if it's NaN or less than 1, use 1
    //         const quantity = parseInt(item.qty);
    //         const validQuantity = isNaN(quantity) || quantity < 1 ? 1 : quantity;

    //         return accumulator + validQuantity;
    //     }, 0);

    //     // Update the totalQuantity state with the calculated sum
    //     setTotalQuantity(sumQuantity);
    // }, [products]);

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


    useEffect(() => {
        VehicleDropdown();
    }, [])

    const VehicleDropdown = async (id) => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${userData.token}`);

        var raw = "";
        var requestOptions = {
            method: "GET",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
        };

        try {
            const response = await fetch(
                "https://gsidev.ordosolution.com/api/vehiclelist/",
                requestOptions
            );
            const result = await response.json();
            const type = result.vehicles.map((brand) => {
                return {
                    label: brand.label,
                    value: brand.value,
                    driver: brand.driver?.name
                };
            });


            setVehicleDrop(type);
        } catch (error) {
            console.log("error", error);
        }
    };


    const renderItem = item => {
        return (
            <View style={styles.item}>
                <Text style={styles.selectedTextStyle}>{item.label}</Text>
                <AntDesign style={styles.icon} color="black" name="Safety" size={20} />
            </View>
        );
    };


    const changeStatus = async (status) => {
        // Display a confirmation dialog
        Alert.alert(
            status === 'CL' ? 'Cancel Order' : 'Mark as Assigned',
            status === 'CL' ? 'Are you sure you want to reject this order?' : 'Do you wish to mark this as assigned?',
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel",
                },
                {
                    text: "Yes",
                    onPress: async () => {
                        let url = screen === "PO" ? `https://gsidev.ordosolution.com/api/rfq/update_rfq_details/` : `https://gsidev.ordosolution.com/api/sales_order/${orderDetails.id}/`
                            setLoading(true);
                            var myHeaders = new Headers();
                            myHeaders.append("Content-Type", "application/json");
                            myHeaders.append("Authorization", `Bearer ${userData.token}`);

                            // console.log(userData.token);

                            var po_raw = JSON.stringify({
                                "id": orderDetails.id,
                                "stages": "POC",
                                "status": status === "DA" ? 'D' : status,
                            });

                            var so_raw = JSON.stringify({
                                status: status == "DA" ? "Delivery Assigned" : 'Cancelled',
                                vehicle: vehicleName
                            });


                            console.log("vehciles", vehicleName)

                            console.log("raw", so_raw)


                            var requestOptions = {
                                method: screen == "PO" ? "POST" : "PUT",
                                headers: myHeaders,
                                body: screen == "PO" ? po_raw : so_raw,
                                redirect: "follow",
                            };




                            console.log(`https://gsidev.ordosolution.com/api/rfq/update_rfq_details/`)

                            await fetch(
                            url,
                            requestOptions
                        )
                            .then((response) => {
                                console.log("responseee", response)
                                if (response.status === 200) {

                                    Toast.show("Record updated successfully", Toast.LONG);

                                    setSaved(true);
                                }
                            })

                            .catch((error) => console.log("api error", error));
                        setLoading(false);
                    },
                },
            ]);
    };

    const AssignFloor = async(id) => {
      console.log("Asssign prod id",id,floorId)
      Alert.alert(
        "Assign Product",
        "Are you sure you want to assign this Product?",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
          {
            text: "Yes",
            onPress: () => {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${userData.token}`);
      
      const raw = JSON.stringify({
        "rfq_products": [
          id
        ]
      });
      
      const requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };
      
      fetch(`https://gsidev.ordosolution.com/api/floor/${floorId}/update_rfq_products/`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if (result) {
                // Alert.alert('Approved Plan', 'Plan Approved successfully', [
                //   // { text: 'OK', onPress: () => navigation.navigate('Visits') }
                // ]);
                Toast.show('Product Assigned successfully', Toast.LONG);
                navigation.goBack();

              }
        })
        .catch((error) => console.error(error));
        
    }
}
]
);
};




    return (
        <View style={{ flex: 1, backgroundColor: 'white', padding: 24, }}>

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



            <View style={[styles.card, { flex: 0 }]}>
                <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', paddingLeft: '5%', paddingVertical: '5%', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#D3D3D3' }} onPress={toggleDetails}>
                    <Text style={styles.cardTitle}>Order Details</Text>


                    <View style={{ flexDirection: 'row', gap: 15 }}>
                        <View style={{
                            paddingHorizontal: '4%',
                            // paddingVertical: '2%',
                            backgroundColor: orderDetails.status === 'Cancel' || orderDetails.status === 'Cancelled' ? '#d11a2a' : (orderDetails.status === 'Pending' || orderDetails.status === 'Confirmed' ? 'orange' : (orderDetails.status === 'In Transit' ? '#005000' : 'green')),
                            borderRadius: 20
                        }}>
                            <Text style={{ fontFamily: 'AvenirNextCyr-Medium', fontSize: 14, color: 'white' }}>
                                {orderDetails.status === 'Cancel' ? 'Canceled' : (orderDetails.status === 'In Transit' ? 'In Transit' : orderDetails.status)}
                            </Text>


                        </View>
                        <AntDesign name="down" color="black" size={20} />
                    </View>


                </TouchableOpacity>

                {expanded && <View style={styles.expandedContent}>
                    <View style={{ paddingHorizontal: '5%', paddingBottom: '2%' }}>
                        <View style={styles.row}>
                            <Text style={styles.title}>Order ID</Text>
                            <Text style={styles.value}>{orderDetails.name}</Text>
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.title}>{screen === "PO" ? 'Supplier' : 'Customer'}</Text>
                            <Text style={styles.value}>{screen === "PO" ? orderDetails.supplier_name : orderDetails.assignee_name}</Text>
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.title}>Order Placed</Text>
                            {/* <Text style={styles.value}>{moment(orderDetails?.created_at).format('DD-MM-YYYY')}</Text> */}
                            <Text style={styles.value}>{ConvertDateTime(orderDetails?.created_at).formattedDate} {ConvertDateTime(orderDetails?.created_at).formattedTime}</Text>

                        </View>

                        {/* <View style={styles.row}>
                            <Text style={styles.title}>Total Qty</Text>
                            <Text style={styles.value}>{totalQuantity}</Text>
                        </View> */}

                        <View style={styles.row}>
                            <Text style={styles.title}>Total Price</Text>
                            {/* <Text style={styles.value}>{parseFloat(orderDetails.total_price).toFixed(2)}</Text> */}
                            <Text style={styles.value}>{parseFloat(totalPrice).toFixed(2)}</Text>

                        </View>

                    </View>
                </View>}
            </View>


            <View style={[styles.card, { marginTop: '1%', flex: expanded1 ? 1 : 0 }]}>
                <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: '5%', paddingVertical: '3%', borderBottomWidth: 1, borderBottomColor: 'grey' }} onPress={toggleExpansion1}>
                    <Text style={styles.cardTitle}>Products</Text>
                    <View style={{ flexDirection: 'row', gap: 10 }}>
                        <View><Text  style={styles.cardTitle}>#{products?.length}</Text></View>

                        <AntDesign name="down" color="black" size={20} />

                    </View>
                </TouchableOpacity>



                {expanded1 && <View style={styles.ProductListContainer}>
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
                                        {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Text style={{ color: 'red', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium', borderBottomColor: 'grey', borderBottomWidth: 0.5, }}>{item.part_number}</Text>


                                        </View> */}
                                        <Text style={{ color: Colors.primary, fontSize: 14, fontFamily: 'AvenirNextCyr-Medium', marginTop: 5, }}>{item.name}</Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: '1%' }}>
                                                <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}>Qty :  </Text>
                                                <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}>{item.qty}

                                                </Text>

                                                
                                            </View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: '0%', justifyContent: 'space-between' }}>
                                

                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}>Price :  </Text>
                                                <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}>{parseFloat(item.price).toFixed(2)} </Text>
                                            </View>

                                            {/* <LinearGradient
              colors={Colors.linearColors}
          start={Colors.start}
          end={Colors.end}
          locations={Colors.ButtonsLocation}
              style={{ borderRadius: 10 ,paddingHorizontal:'5%',paddingVertical:'2%'}}
            > */}
            <TouchableOpacity
  style={{
    ...styles.button,
    backgroundColor: item.is_assigned ? "rgba(142, 67, 144, 0.5)" : "#4b0482" // Lighter color when selected
  }}
  disabled={item.is_assigned}
  onPress={() => AssignFloor(item.id)}
  activeOpacity={0.8}
>
  <Text style={styles.btnText}>{item.is_assigned ? "Assigned" : "Assign"}</Text>
</TouchableOpacity>

 
            {/* </LinearGradient> */}




                                        </View>
                                    </View>

                                </View>
                                <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', marginTop: '2%' }}>
                                </View>
                            </View>

                        }
                    // keyExtractor={(item) => item.id.toString()}

                    />
                </View>}
            </View>


            {screen == "SO" && <View style={{ flex: 1 }}>

                <Text style={{ fontFamily: 'AvenirNextCyr-Medium', fontSize: 17, marginBottom: '3%' }}>Select Vehicle</Text>
                <MultiSelect
                    style={styles.dropdown}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                    search
                    data={vehicleDrop}
                    labelField="label"
                    valueField="value"
                    placeholder="Select Vehicle"
                    searchPlaceholder="Search..."
                    value={vehicleName}
                    onChange={item => {
                        setVehicleName(item);
                    }}
                    renderItem={renderItem}
                    renderSelectedItem={(item, unSelect) => (
                        <TouchableOpacity onPress={() => unSelect && unSelect(item)} style={{ width: '100%' }}>
                            <View style={styles.selectedStyle}>

                                <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}>
                                    <MaterialCommunityIcons color="black" name="truck-outline" size={17} />
                                    <Text style={styles.textSelectedStyle}>{item.label} - {item.driver}</Text>
                                </View>
                                <AntDesign color="black" name="close" size={17} />
                            </View>
                        </TouchableOpacity>
                    )}
                    renderLeftIcon={() => (
                        <AntDesign
                            style={styles.icon}
                            color="black"
                            name="Safety"
                            size={20}
                        />
                    )}
                    selectedStyle={styles.selectedStyle}
                />



            </View>}


          



            <ProgressDialog
                visible={loading}
                // title="Uploading file"
                dialogStyle={{ width: '50%', alignSelf: 'center' }}
                message="Please wait..."
                titleStyle={{ fontFamily: 'AvenirNextCyr-Medium', fontSize: 16 }}
                messageStyle={{ fontFamily: 'AvenirNextCyr-Medium', fontSize: 14 }}
            />


        </View>
    )
}

export default AssignWareDetails;
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





    selectedTextStyle: {
        fontSize: 16,
        fontFamily: "AvenirNextCyr-Medium",
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
        marginVertical: '6%',
        backgroundColor: '#F5F5F5',
        flex: 1

    },
    button: {
        // height: '30%',
        //marginTop: 20,
        // backgroundColor:'red',
        justifyContent: 'center',
        alignItems: 'center',
        // borderRadius: 8,
        backgroundColor: Colors.primary,
        borderRadius: 10,
        paddingHorizontal:'5%',
        paddingVertical:'3%'
      },
    btnText: {
        fontFamily:'AvenirNextCyr-Medium',
        color: '#fff',
        fontSize: 14
      },
    cardTitle: {
        fontSize: 15,
        fontFamily: 'AvenirNextCyr-Medium',
        color:Colors.black
    },
    expandedContent: {
        marginTop: 10,
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

    // ProductListContainer: {
    //     flex: 1
    // },
    TwoButtons: {
        width: '48%',
        paddingVertical: '4%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30
    },
    Btext: {
        color: 'white',
        fontFamily: 'AvenirNextCyr-Bold',
        fontSize: 17

    },

    textSelectedStyle: {
        marginRight: 5,
        fontSize: 16,
    },

    item: {
        padding: 17,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dropdown: {
        height: 50,
        borderColor: "#dedede",
        borderWidth: 1,
        //borderRadius: 8,
        paddingHorizontal: 8,
        // marginBottom: "5%",
        borderRadius: 10,
        backgroundColor: "white",
    },
    placeholderStyle: {
        fontSize: 14,
        fontFamily: "AvenirNextCyr-Medium",
        // backgroundColor:'white'
    },

    selectedStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 14,
        backgroundColor: '#F3F3F9',
        shadowColor: '#000',
        marginTop: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderColor: 'black',
        borderWidth: 0.5


    },
})
