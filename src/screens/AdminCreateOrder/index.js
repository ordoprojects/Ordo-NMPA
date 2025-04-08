import { StyleSheet, Text, View, Button, TouchableOpacity, Image, Dimensions, Modal, TextInput } from 'react-native'
import React, { useState, useContext, useEffect } from 'react'
import Colors from '../../constants/Colors'
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Dropdown } from 'react-native-element-dropdown';
import { AuthContext } from '../../Context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import globalStyles from '../../styles/globalStyles';
const AdminCreateOrder = ({ navigation, route }) => {
    //new
    const currentDate = new Date().toLocaleString();
    //new
    const { width, height } = Dimensions.get('screen');
    const { item } = route.params;

    console.log("item", item)



    const { token } = useContext(AuthContext);




    useEffect(() => {
        //getDealerData();

    }, [])


    // const getDealerData = async () => {
    //   var myHeaders = new Headers();
    //   myHeaders.append("Content-Type", "application/json");
    //   var raw = JSON.stringify({
    //     "__module_code__": "PO_19",
    //     "__query__": `accounts.id='${dealerData.account_id_c}'`,
    //     "__orderby__": "",
    //     "__offset__": 0,
    //     "__select _fields__": [
    //       "id",
    //       "name"
    //     ],  
    //     "__max_result__": 500,
    //     "__delete__": 0
    //   });

    //   var requestOptions = {
    //     method: 'POST',
    //     headers: myHeaders,
    //     body: raw,
    //     redirect: 'follow'
    //   };

    //   fetch("https://dev.ordo.primesophic.com/get_data_s.php", requestOptions)
    //     .then(response => response.json())
    //     .then(async result => {
    //       console.log('customer details ', result);
    //       let tempArray = await result?.entry_list.map(object => {
    //         console.log("customer res", object.name_value_list)
    //         return {
    //           'addressline1': object.name_value_list.billing_address_street.value,
    //           'addressline2': object.name_value_list.billing_address_street_2.value,
    //           'country': object.name_value_list.billing_address_country.value,
    //           'state': object.name_value_list.billing_address_state.value,
    //           'name': object.name_value_list.name.value,
    //           'postalcode': object.name_value_list.billing_address_postalcode.value,
    //           'creditlimit': object.name_value_list.creditlimit_c.value,
    //           // "credit_note": object.name_value_list.credit_note.value,
    //           'image': "https://dev.ordo.primesophic.com/upload/" + object.name_value_list.id.value + "_img_src_c",
    //           // 'lastsaleamount': "0",
    //           // 'lastpaymentdate': "",
    //           // 'lastsaledate': "",
    //           //'lastsaledate': object.name_value_list.lastsaledate.value,
    //           'due_amount_c': object.name_value_list.due_amount_c.value,
    //           'ispaymentdue': object.name_value_list.payment_due_c.value,
    //           // 'id': object.name_value_list.id.value,
    //           // 'email': object.name_value_list.email.value,
    //           // 'owner': object.name_value_list.ownership.value,
    //           'storeid': object.name_value_list.storeid_c.value,



    //         }
    //       })

    //       setcustomerData(tempArray[0]);


    //     })
    //     .catch(error => console.log('error', error));
    // }














    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10 }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <AntDesign name='arrowleft' size={25} color={Colors.black} />
                </TouchableOpacity>
                <Text style={{ fontSize: 20, color: Colors.primary, fontFamily: 'AvenirNextCyr-Medium', marginVertical: 5 }}>Create Order</Text>
                <Text />

            </View>
            {/* <View style={{
                ...styles.checkOutView,
                flexDirection: 'row',
                alignSelf: 'center',
            }}>

                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <AntDesign name='arrowleft' size={25} color={Colors.black} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.createPlanBtn}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.buttonTextStyle}>Checkout</Text>
        </TouchableOpacity>
            </View> */}
            {/* <View style={styles.row1View}>
        <View style={styles.orderView}>
          <Button title="Market" color={Colors.primary} />
        </View>
        <Button title="Order" color={Colors.primary} />
      </View>
      <View style={styles.row2View}>
        <View style={styles.orderView}>
          <Button title="Return" color={Colors.primary} />
        </View>
        <Button title="Shelf Display" color={Colors.primary} />
      </View> */}
            {/* <Text style={styles.title}>Select your options</Text> */}
            <View style={{ backgroundColor: 'white', flex: 0.6, margin: 10, marginBottom: 16, padding: 8 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'center', flex: 1 }}>
                    <View style={{ flex: 0.5, justifyContent: 'center', alignItems: 'center' }}>
                        <Image
                            source={{ uri: `https://dev.ordo.primesophic.com/upload/${item?.id}_img_src_c` }}
                            style={{ width: 100, height: 100 }}
                        />
                    </View>
                    <View style={{
                        flex: 0.5,
                        marginLeft: 8,
                        borderLeftWidth: 1.5,
                        paddingLeft: 10,
                        // marginLeft: 20,
                        borderStyle: 'dotted',
                        borderColor: 'grey',
                        // alignItems:'center'
                        justifyContent: 'center',
                        // backgroundColor:'red'
                    }}>
                        <Text style={styles.contentView}>{item?.storeid_c}</Text>
                        <Text style={{ ...styles.contentView, color: Colors.primary }}>{item?.name}</Text>
                        <Text style={styles.contentView}>{item?.shipping_address_street}</Text>
                        {item?.billing_address_city != '' && <Text style={styles.contentView}>{item?.billing_address_city}</Text>}
                        <Text style={styles.contentView}>{item?.shipping_address_state}</Text>
                        <Text style={styles.contentView}>{item?.shipping_address_country} - {item?.shipping_address_postalcode}</Text>
                    </View>
                </View>
            </View>


            {/* <TouchableOpacity activeOpacity={0.6} style={styles.recoredbuttonStyle} onPress={() => { navigation.navigate('MIList', { dealerData: dealerData }) }}>
          <Image transition={false} source={require('../../assets/images/market.png')} style={{ width: 25, height: 25, resizeMode: 'cover', alignSelf: 'center', marginTop: -1,tintColor:'blue' }} >
          </Image>
          <Text style={{ fontFamily: "AvenirNextCyr-Medium", fontSize: 12, color: 'black', textAlign: 'center', marginTop: 12 }}>Market Intelligence</Text>
        </TouchableOpacity> */}
            <View style={{ margin: 10, elevation: 1, borderRadius: 5, backgroundColor: 'white' }}>
                <View style={{ paddingHorizontal: 16, margin: 10 }}>
                    <Text style={{ fontFamily: 'AvenirNextCyr-Thin', fontSize: 12, color: 'black', textAlign: 'center' }}>Last 3 Transaction Details </Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#F1F2F1' }}>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontFamily: 'AvenirNextCyr-Thin', fontSize: 12, color: 'black', textAlign: 'center' }}>Transaction Id </Text>
                        <Text style={{ fontFamily: 'AvenirNextCyr-Thin', fontSize: 10, color: 'black', textAlign: 'center' }}>(Ordered Date) </Text>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <Text style={{ fontFamily: 'AvenirNextCyr-Thin', fontSize: 12, color: 'black', textAlign: 'center' }}>Amount($) </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontFamily: 'AvenirNextCyr-Thin', fontSize: 12, color: 'black', textAlign: 'center' }}>XXXX28833fe</Text>
                        <Text style={{ fontFamily: 'AvenirNextCyr-Thin', fontSize: 9, color: 'black', textAlign: 'center' }}>{currentDate}</Text>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <Text style={{ fontFamily: 'AvenirNextCyr-Thin', fontSize: 12, color: 'black', textAlign: 'center' }}>$60.20</Text>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <Text style={{
                            fontFamily: 'AvenirNextCyr-Thin',
                            fontSize: 12,
                            textAlign: 'center',
                            textDecorationLine: 'underline',
                            textDecorationColor: 'blue',
                            color: 'blue',
                        }}>Repeat</Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontFamily: 'AvenirNextCyr-Thin', fontSize: 12, color: 'black', textAlign: 'center' }}>XXXX28833fe</Text>
                        <Text style={{ fontFamily: 'AvenirNextCyr-Thin', fontSize: 9, color: 'black', textAlign: 'center' }}>{currentDate}</Text>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <Text style={{ fontFamily: 'AvenirNextCyr-Thin', fontSize: 12, color: 'black', textAlign: 'center' }}>$60.20</Text>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <Text style={{
                            fontFamily: 'AvenirNextCyr-Thin',
                            fontSize: 12,
                            textAlign: 'center',
                            textDecorationLine: 'underline',
                            textDecorationColor: 'blue',
                            color: 'blue',
                        }}>Repeat</Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontFamily: 'AvenirNextCyr-Thin', fontSize: 12, color: 'black', textAlign: 'center' }}>XXXX28833fe</Text>
                        <Text style={{ fontFamily: 'AvenirNextCyr-Thin', fontSize: 9, color: 'black', textAlign: 'center' }}>{currentDate}</Text>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <Text style={{ fontFamily: 'AvenirNextCyr-Thin', fontSize: 12, color: 'black', textAlign: 'center' }}>$60.20</Text>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <Text style={{
                            fontFamily: 'AvenirNextCyr-Thin',
                            fontSize: 12,
                            textAlign: 'center',
                            textDecorationLine: 'underline',
                            textDecorationColor: 'blue',
                            color: 'blue',
                        }}>Repeat</Text>
                    </View>
                </View>
            </View>

            <View style={{ margin: 10, elevation: 1, borderRadius: 5, backgroundColor: 'white', padding: 10 }}>
                <View style={{ paddingHorizontal: 16 }}>
                    <Text style={{ fontFamily: 'AvenirNextCyr-Thin', fontSize: 12, color: 'black' }}>Last payment Date: {item.last_paid_date}</Text>
                    <Text style={{ fontFamily: 'AvenirNextCyr-Thin', fontSize: 12, color: 'black' }}>Credit Limit: {item?.creditlimit_c} </Text>
                    <Text style={{ fontFamily: 'AvenirNextCyr-Thin', fontSize: 12, color: 'black' }}>Last Due Amount: $60.20</Text>
                </View>
                {item?.payment_due_c == '1' && <View style={{ marginLeft: 8 }}>
                    <Text style={{ fontSize: 9, color: 'red' }}>"Alert : You have crossed the credit limit. Please make the payment to continue."</Text>
                </View>}
            </View>
            <View style={styles.btnContainer}>
                <TouchableOpacity
                    style={styles.button}
                    disabled={item?.payment_due_c == '1' ? true : false}
                    onPress={() => { navigation.navigate('AdminOrderCart',{dealerInfo:item}) }}
                >
                    <Text style={{ ...styles.buttonText, color: item?.payment_due_c == '1' ? 'grey' : Colors.primary }}>Create Order</Text>
                </TouchableOpacity>
            </View>

        </View >
    )
}

export default AdminCreateOrder

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f1f1f2'
    },
    row1View: {
        //marginHorizontal: 50,
        paddingHorizontal: 30,
        //marginTop: 10,
        marginBottom: 10,
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'center',
    },
    row2View: {
        paddingHorizontal: 30,
        // marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    orderView: {
        marginRight: 20
    },
    checkOutView: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginRight: 10,
        marginBottom: 20,
        paddingHorizontal: 10,
        alignItems: 'center'
    },
    recoredbuttonStyle: {
        borderRadius: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5, marginHorizontal: 5,
        shadowRadius: 2,
        elevation: 5,
        ...globalStyles.border,
        height: 118,
        width: 118,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10
    },
    createPlanBtn: {
        height: 40,
        //width:40,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.primary,
        borderRadius: 10
    },
    buttonTextStyle: {
        color: '#fff',
        fontFamily: 'AvenirNextCyr-Medium',
    },
    buttonview: {
        flexDirection: 'row'
    },
    buttonContainer: {
        heigh: 40,
        padding: 10,
        borderRadius: 10,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        //marginRight: 10,
        marginVertical: 10,
        backgroundColor: Colors.primary
    },

    modalTitle: {
        fontSize: 16,
        color: 'black',
        fontFamily: 'AvenirNextCyr-Medium'
    },
    textarea: {
        borderWidth: 0.5,
        borderColor: 'black',
        //margin: 15,
        marginTop: 8,
        borderRadius: 5,
        padding: 10,
        fontSize: 14,
        fontFamily: 'AvenirNextCyr-Thin',
        textAlignVertical: 'top',
        color: '#000'
    },
    dropDownContainer: {
        backgroundColor: 'white',
        marginBottom: 10
        //padding: 16,
        //backgroundColor:'red'
    },
    dropdown: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
    },
    icon: {
        marginRight: 5,
    },
    label: {
        position: 'absolute',
        backgroundColor: 'white',
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
    },
    placeholderStyle: {
        fontSize: 14,
        fontFamily: 'AvenirNextCyr-Thin'
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
    title: {
        marginVertical: 10,
        paddingHorizontal: 36,
        fontSize: 18,
        fontFamily: 'AvenirNextCyr-Medium',
        color: 'black'
    },
    contentView: {
        color: 'black',
        fontSize: 12,
        fontFamily: 'AvenirNextCyr-Thin'
    },
    btnContainer: {
        margin: 10

    },
    button: {
        borderRadius: 5,
        borderWidth: 0.5,
        borderColor: 'blue',
        paddingVertical: 10,
        paddingHorizontal: 100,
        backgroundColor: '#F1F2F1'
    },
    buttonText: {
        color: Colors.primary,
        fontSize: 14,
        fontFamily: 'AvenirNextCyr-Medium',
        textAlign: 'center',
    },

})