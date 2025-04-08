import {
    StyleSheet, Text, View, Image, ActivityIndicator,
    FlatList, TouchableOpacity, Keyboard, TextInput, Modal, Pressable, Alert
} from 'react-native'
import React, { useState, useEffect, useContext, useRef } from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign';
import Colors from '../../constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../../Context/AuthContext';
import { TabRouter, useFocusEffect } from "@react-navigation/native";
import Geolocation from 'react-native-geolocation-service';
import { locationPermission } from '../../utils/Helper';
import moment from 'moment';
import { ProgressDialog } from 'react-native-simple-dialogs';
import globalStyles from '../../styles/globalStyles';
const AdminStores = ({ navigation ,route}) => {
    const {newOrder,newReturn} = route.params
    const { token } = useContext(AuthContext);
    const [masterData, setMasterData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        //getting active dealer list for the particular user
        getActiveDealerList();
    }, [])


    const getActiveDealerList = async () => {
        setLoading(true)
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "__user_id__": token  
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("https://dev.ordo.primesophic.com/get_accounts.php", requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log('active dealer api  res', result);
                setMasterData(result)
                setFilteredData(result);
                setLoading(false);

            })
            .catch(error => {
                setLoading(false);
                console.log('error', error)
            });

    }

    // const [cartData, setCartData] = useState([]);

    // const loadAllProduct = async (dealerArray) => {
    //     console.log("loading all product");
    //     var myHeaders = new Headers();
    //     myHeaders.append("Content-Type", "application/json");

    //     var raw = JSON.stringify({
    //         "__module_code__": "PO_19",
    //         "__query__": "",
    //         "__orderby__": "",
    //         "__offset__": 0,
    //         "__select _fields__": ["id", "name"],
    //         "__max_result__": 500,
    //         "__delete__": 0
    //     });

    //     var requestOptions = {
    //         method: 'POST',
    //         headers: myHeaders,
    //         body: raw,
    //         redirect: 'follow'
    //     };

    //     fetch("https://dev.ordo.primesophic.com/get_data_s.php", requestOptions)
    //         .then(response => response.json())
    //         .then(async result => {
    //             console.log('all product data fetched', result);
    //             let tempArray = []
    //             result?.entry_list.forEach(object => {
    //                 //console.log("customer res", object.name_value_list)
    //                 dealerArray.forEach(itm => {
    //                     if (itm.id == object.name_value_list.id.value) {
    //                         console.log("inside dealer id ", itm.id);
    //                         console.log("allccustomer  id ", object.name_value_list.id.value);

    //                         //matchedCustomers.push(customer);
    //                         tempArray.push({
    //                             'addressline1': object.name_value_list.billing_address_street.value,
    //                             'addressline2': object.name_value_list.billing_address_street_2.value,
    //                             'country': object.name_value_list.billing_address_country.value,
    //                             'state': object.name_value_list.billing_address_state.value,
    //                             'name': object.name_value_list.name.value,
    //                             'postalcode': object.name_value_list.billing_address_postalcode.value,
    //                             'creditlimit': object.name_value_list.creditlimit_c.value,
    //                             "credit_note": object.name_value_list.credit_note.value,
    //                             'image': "https://dev.ordo.primesophic.com/upload/" + object.name_value_list.id.value + "_img_src_c",
    //                             'lastsaleamount': "0",
    //                             'lastpaymentdate': "",
    //                             'lastsaledate': "",
    //                             // 'lastsaledate':object[i].name_value_list.lastsaledate.value,
    //                             'due_amount_c': object.name_value_list.due_amount_c.value,
    //                             'ispaymentdue': object.name_value_list.payment_due_c.value,
    //                             'id': object.name_value_list.id.value,
    //                             'email': object.name_value_list.email.value,
    //                             'owner': object.name_value_list.ownership.value,

    //                             'storeid': object.name_value_list.storeid_c.value


    //                         })
    //                     }

    //                 });
    //                 //checking if dealer is in active dealers array




    //             });
    //             console.log("product data", tempArray);
    //             setMasterData(tempArray)
    //             setFilteredData(tempArray);


    //         })
    //         .catch(error => console.log('error', error));
    // }

    const searchProduct = (text) => {
        // Check if searched text is not blank
        if (text) {
            // Inserted text is not blank
            // Filter the masterDataSource
            // Update FilteredDataSource
            const newData = masterData.filter(
                function (item) {
                    const itemData = item.name
                        ? item.name.toUpperCase() + item.storeid_c.toUpperCase()
                        : ''.toUpperCase();
                    const textData = text.toUpperCase();
                    return itemData.indexOf(textData) > -1;
                });
            setFilteredData(newData);
            setSearch(text);
        } else {
            // Inserted text is blank
            // Update FilteredDataSource with masterDataSource
            setFilteredData(masterData);
            setSearch(text);
        }
    };


    return (

        <View style={styles.container} >

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <AntDesign name='arrowleft' size={25} color={Colors.black} />
                </TouchableOpacity>
                <Text style={{ fontSize: 20, color: Colors.primary, fontFamily: 'AvenirNextCyr-Medium', marginVertical: 5 }}>Stores</Text>
                <Text />

            </View>
            <ActivityIndicator
                animating={loading}
                color={Colors.primary}
                size="large"
                style={styles.activityIndicator}

            />
            <View style={{ flexDirection: 'row' }}>
                <View style={styles.modalSearchContainer}>
                    <TextInput
                        style={styles.input}
                        value={search}
                        placeholder="Search dealer"
                        placeholderTextColor="gray"
                        onChangeText={(val) => searchProduct(val)}

                    />
                    <TouchableOpacity style={styles.searchButton} >
                        <AntDesign name="search1" size={20} color="black" />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    style={{ height: 45, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', borderRadius: 8, paddingHorizontal: 16, elevation: 5, ...globalStyles.border, flex: 0.2 }}
                    onPress={() => {
                        setSearch('');
                        setFilteredData(masterData)
                        Keyboard.dismiss();
                    }
                    }
                >
                    <Text style={{ color: 'blue', fontFamily: 'AvenirNextCyr-Thin', fontSize: 14 }}>Clear</Text>

                </TouchableOpacity>
            </View>
            <Text style={{ color: '#000', fontFamily: 'AvenirNextCyr-Thin', fontSize: 13 }}>Select your store to place the order</Text>
            <FlatList
                showsVerticalScrollIndicator={false}
                data={filteredData}
                keyboardShouldPersistTaps='handled'
                renderItem={({ item }) =>

                    <TouchableOpacity style={styles.elementsView} activeOpacity={0.8} onPress={() => {
                        //navigation.navigate('CheckIn', { hideCheckOut: true })
                        if (newOrder) {
                            navigation.navigate('AdminCreateOrder',{item:item});
                          } else if (newReturn) {
                            navigation.navigate('Invoice',{item:item});
                          }
                    }
                    }
                    >
                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                            <Image
                                source={{ uri: `https://dev.ordo.primesophic.com/upload/${item?.id}_img_src_c` }}
                                style={{ ...styles.imageView }}
                            />
                            <View style={{
                                flex: 1,
                                marginLeft: 8,
                                borderLeftWidth: 1.5,
                                paddingLeft: 10,
                                marginLeft: 20,
                                borderStyle: 'dotted',
                                borderColor: 'grey',
                                justifyContent: 'space-around'
                            }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ color: Colors.primary, fontSize: 12, fontFamily: 'AvenirNextCyr-Medium', borderBottomColor: 'grey', borderBottomWidth: 0.5 }}>{item?.name}</Text>
                                </View>
                                <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Thin', marginTop: 5 }}>{item?.shipping_address_street} {item?.billing_address_city} {item?.shipping_address_state}</Text>
                                <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Thin' }}>{item?.shipping_address_country} - {item?.shipping_address_postalcode}</Text>
                            </View>







                        </View>
                        <Text style={{ fontSize: 12, color: 'black', fontFamily: 'AvenirNextCyr-Thin', marginTop: 5, paddingLeft: 16 }}>{item?.storeid_c}</Text>

                    </TouchableOpacity>


                }
            //keyExtractor={(item) => item.id.toString()}
            />

        </View >



    )
}

export default AdminStores

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: 'white'
    },
    activityIndicator: {
        flex: 1,
        alignSelf: 'center',
        height: 100,
        position: 'absolute',
        top: '30%',

    },
    elementsView: {
        backgroundColor: "white",
        margin: 5,
        //borderColor: 'black',
        //flexDirection: 'row',
        //justifyContent: 'space-between',
        //alignItems: 'center',
        marginBottom: 16,
        borderRadius: 8,
        elevation: 5,
        padding: 8,
        ...globalStyles.border,

        //borderColor: '#fff',
        //borderWidth: 0.5
    },
    imageView: {
        width: 80,
        height: 80,
        // borderRadius: 40,
        // marginTop: 20,
        // marginBottom: 10
    },
    elementText: {
        fontSize: 15,
        fontFamily: 'AvenirNextCyr-Medium',
        color: 'black'
    },
    minusButton: {
        width: 45,
        height: 30,
        borderColor: 'grey',
        borderWidth: 0.5,
        borderRadius: 5,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
        marginTop: 30,
        marginLeft: 10
    },
    modalMinusButton: {
        width: 35,
        height: 20,
        borderColor: 'grey',
        borderWidth: 0.5,
        borderRadius: 5,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
        marginTop: 40,
        marginLeft: 10
    },
    quantityCount: {
        width: 45,
        height: 30,
        borderColor: 'grey',
        borderWidth: 0.5,
        borderRadius: 5,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
        marginTop: 30,
        marginLeft: 1
    },
    modalQuantityCount: {
        width: 35,
        height: 20,
        borderColor: 'grey',
        borderWidth: 0.5,
        borderRadius: 5,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
        marginTop: 40,
        marginLeft: 1
    },
    orderCloseView: {
        height: 15,
        width: 15,
        //marginTop: 30
    },
    imageText: {
        fontSize: 15,
        fontFamily: 'AvenirNextCyr-Thin',
        color: 'black',
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'lightgray',
        borderRadius: 5,

        //paddingVertical: 5,
        paddingHorizontal: 10,
        marginLeft: 10
    },
    input: {
        flex: 1,
        fontSize: 16,
        marginRight: 10,
    },
    searchButton: {
        padding: 5,
    },
    sendButtonView: {
        borderRadius: 5,
        // borderWidth: 1,
        // borderColor: 'grey',
        backgroundColor: 'green',
        paddingVertical: 10,
        paddingHorizontal: 20,

        height: 40,
        marginLeft: 10
    },
    saveButtonView: {
        borderRadius: 5,
        // borderWidth: 1,
        // borderColor: 'grey',
        backgroundColor: Colors.primary,
        paddingVertical: 10,
        paddingHorizontal: 20,
        height: 40,
        marginLeft: 10
    },
    deleteButtonView: {
        borderRadius: 5,
        // borderWidth: 1,
        // borderColor: 'grey',
        backgroundColor: 'red',
        paddingVertical: 10,
        paddingHorizontal: 20,
        height: 40,
        marginLeft: 10
    },
    addButtonView: {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'grey',
        backgroundColor: 'white',
        paddingVertical: 10,
        paddingHorizontal: 20,
        height: 40,
        marginLeft: 10,
        alignSelf: 'center'
    },
    modalAddButtonView: {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'grey',
        backgroundColor: 'white',
        paddingVertical: 5,
        paddingHorizontal: 15,
        height: 35,
        //alignSelf: 'flex-end',
        //marginLeft: 30,
        //marginTop: 60
    },
    buttonText: {
        color: 'blue',
        fontFamily: 'AvenirNextCyr-Thin'
    },
    sendButton: {
        color: 'white',
        fontFamily: 'AvenirNextCyr-Thin'
    },
    deleteButton: {
        color: 'red'
    },
    saveButton: {
        color: 'purple'
    },
    textColor: {
        color: 'black',
        fontFamily: 'AvenirNextCyr-Thin',

    },
    searchModal: {
        backgroundColor: 'white',
        padding: 20,
        width: '90%',
        marginHorizontal: 10,
        borderRadius: 10,
        elevation: 5,
        ...globalStyles.border,
        //borderColor: 'black',
        //borderWidth: 1,
        marginVertical: 100
        // flexDirection:'row'
    },
    modalSearchContainer: {
        flex: 0.8,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'lightgray',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
        marginRight: 10
    },
    modalTitle: {
        fontSize: 16,
        color: 'black',
        fontFamily: 'AvenirNextCyr-Medium'
    },
})