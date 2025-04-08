import {
    StyleSheet, Text, View, Image, TextInput,
    ActivityIndicator, TouchableOpacity, FlatList,Alert
} from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import Colors from '../../constants/Colors';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer, useIsFocused, useRoute } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { AuthContext } from '../../Context/AuthContext';
import globalStyles from '../../styles/globalStyles';
const Tab = createMaterialTopTabNavigator();



function Pending({navigation}) {
    const [loading, setLoading] = useState(false);
    const {
        pendingArray,
        setPendingArray,
        completedArray,
        setCompletedArray,
        returnArray,
        setReturnArray,


    } = useContext(AuthContext);
    useEffect(() => {
        fetchData();
    }, []);
    const fetchData = () => {
        setLoading(true);
        fetch('https://dev.ordo.primesophic.com/get_data_s.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "__module_code__": "PO_17",
                "__query__": "",
                "__orderby__": "",
                "__offset__": 0,
                "__select _fields__": [
                    "id",
                    "name"
                ],
                "__max_result__": 500,
                "__delete__": 0
            }),
        })
            .then(response => response.json())
            .then(res => {
                // console.log('pendingData', data.result_count);
                // setData(data);
                let tPendingArray = []
                let tCmpArray = []
                let tReturnArray = []

                res?.entry_list.forEach((object) => {
                    // console.log("item",object)
                    let type = object.name_value_list.stage.value;
                    let item = {
                        'orderid': object.name_value_list.id.value,
                        'id': object.name_value_list.number.value,
                        'name': object.name_value_list.name.value,
                        'record': object.name_value_list.name.value,
                        'orderstatus': object.name_value_list.approval_status.value,
                        'type': object.name_value_list.stage.value,
                        'totalvalue': object.name_value_list.total_amount.value,
                        'date_modified': object.name_value_list.date_modified.value,
                        'aknowledgementnumber': object.name_value_list.number.value,
                        'customerid': object.name_value_list.billing_account.value,
                        'po_number': object.name_value_list.number.value,
                        'comments': object.name_value_list.approval_issue.value,
                        'location': object.name_value_list.shipping_address_state.value,
                        'totalitems': object.name_value_list.totalitems_c.value,
                        'notes_id': object.name_value_list.notes_id.value,
                        'total_amount': object.name_value_list.total_amount.value,
                        'address': object.name_value_list.shipping_address_street.value,
                        'customername': object.name_value_list.billing_account.value,
                        'subtotal_amount': object.name_value_list.subtotal_amount.value,
                        'discount_amount': object.name_value_list.discount_amount.value,
                        'tax_amount': object.name_value_list.tax_amount.value,
                        'shipping_amount': object.name_value_list.shipping_amount.value,
                        'total_amount_word': object.name_value_list.total_amount_word.value,
                        'delivered_date': object.name_value_list.delivered_date.value,
                        'last_modified': object.name_value_list.date_modified.value
                    }
                    //pending
                    if (type == 'Confirmed' || type == 'Pending') {
                        tPendingArray.push(item)
                    }
                    //completed

                    if (type == 'Cancel' || type == 'Delivered') {
                        tCmpArray.push(item)
                    }

                    //return
                    if (type == 'Return') {
                        tReturnArray.push(item)
                    }

                });
                console.log('pending array', tPendingArray);
                console.log('completed array', tCmpArray);
                console.log('Return array', tReturnArray);


                setPendingArray(tPendingArray)
                setCompletedArray(tCmpArray)
                setReturnArray(tReturnArray)
                setLoading(false);

            })
            .catch(error => {
                // Handle any errors that occurred during the request
                console.error(error);
            });
    };

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>

            <ActivityIndicator
                animating={loading}
                color={Colors.primary}
                size="large"
                style={styles.activityIndicator}

            />

            <FlatList
                showsVerticalScrollIndicator={false}
                data={pendingArray}
                keyboardShouldPersistTaps='handled'
                renderItem={({ item }) =>

                    <TouchableOpacity style={styles.elementsView} activeOpacity={0.8} onPress={() => navigation.navigate('Invoice')}>
                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Image
                                    source={require('../../assets/images/confirmed.png')}
                                    style={{ ...styles.imageView }}
                                />
                                <Text style={{ fontSize: 12, color: 'black', fontFamily: 'AvenirNextCyr-Thin', marginTop: 5 }}>{item?.type}</Text>
                            </View>
                            <View style={{
                                flex: 1,
                                marginLeft: 8,
                                borderLeftWidth: 1.5,
                                paddingLeft: 10,
                                marginLeft: 20,
                                borderStyle: 'dotted',
                                borderColor: 'grey',
                                // justifyContent: 'space-around'
                            }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ color: Colors.primary, fontSize: 16, fontFamily: 'AvenirNextCyr-Medium', borderBottomColor: 'grey', borderBottomWidth: 0.5 }}>{item?.name}</Text>
                                </View>

                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                                    <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Thin' }}>{item?.date_modified}</Text>
                                    <Text style={{ color: Colors.primary, fontSize: 12, fontFamily: 'AvenirNextCyr-Medium', textDecorationLine: 'underline', textDecorationColor: Colors.primary, marginRight: 10 }}>Cancel</Text>
                                </View>

                                <View style={{ justifyContent: 'space-between', flexDirection: 'row', marginTop: 10 }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Thin' }}>Total SKUs: </Text>
                                        <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Thin' }}>{Number(item?.totalitems)}</Text>
                                    </View>

                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Thin' }}>Total Price: </Text>
                                        <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Thin' }}>{Number(item?.total_amount)}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        {/* <Text style={{ fontSize: 12, color: 'black', fontFamily: 'AvenirNextCyr-Thin', marginTop: 5 }}>Confirmed</Text> */}
                    </TouchableOpacity>
                }
            //keyExtractor={(item) => item.id.toString()}
            />
        </View>
    );
}

function Completed() {
    const { completedArray } = useContext(AuthContext);

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>

            <FlatList
                showsVerticalScrollIndicator={false}
                data={completedArray}
                keyboardShouldPersistTaps='handled'
                renderItem={({ item }) =>

                    <TouchableOpacity style={styles.elementsView} activeOpacity={0.8}>
                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Image
                                    source={require('../../assets/images/confirmed.png')}
                                    style={{ ...styles.imageView }}
                                />
                                <Text style={{ fontSize: 12, color: 'black', fontFamily: 'AvenirNextCyr-Thin', marginTop: 5 }}>{item?.type}</Text>
                            </View>
                            <View style={{
                                flex: 1,
                                marginLeft: 8,
                                borderLeftWidth: 1.5,
                                paddingLeft: 10,
                                marginLeft: 20,
                                borderStyle: 'dotted',
                                borderColor: 'grey',
                                // justifyContent: 'space-around'
                            }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ color: Colors.primary, fontSize: 16, fontFamily: 'AvenirNextCyr-Medium', borderBottomColor: 'grey', borderBottomWidth: 0.5 }}>{item?.name}</Text>
                                </View>

                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                                    <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Thin' }}>{item?.date_modified}</Text>
                                    <Text style={{ color: Colors.primary, fontSize: 12, fontFamily: 'AvenirNextCyr-Medium', textDecorationLine: 'underline', textDecorationColor: Colors.primary, marginRight: 10 }}>Cancel</Text>
                                </View>

                                <View style={{ justifyContent: 'space-between', flexDirection: 'row', marginTop: 10 }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Thin' }}>Total SKUs: </Text>
                                        <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Thin' }}>{Number(item?.totalitems)}</Text>
                                    </View>

                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Thin' }}>Total Price: </Text>
                                        <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Thin' }}>{Number(item?.total_amount)}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        {/* <Text style={{ fontSize: 12, color: 'black', fontFamily: 'AvenirNextCyr-Thin', marginTop: 5 }}>Confirmed</Text> */}
                    </TouchableOpacity>
                }
            //keyExtractor={(item) => item.id.toString()}
            />
        </View>
    );
}
function Return() {
    const { returnArray } = useContext(AuthContext);

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>

            <FlatList
                showsVerticalScrollIndicator={false}
                data={returnArray}
                keyboardShouldPersistTaps='handled'
                renderItem={({ item }) =>

                    <TouchableOpacity style={styles.elementsView} activeOpacity={0.8}>
                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Image
                                    source={require('../../assets/images/confirmed.png')}
                                    style={{ ...styles.imageView }}
                                />
                                <Text style={{ fontSize: 12, color: 'black', fontFamily: 'AvenirNextCyr-Thin', marginTop: 5 }}>{item?.type}</Text>
                            </View>
                            <View style={{
                                flex: 1,
                                marginLeft: 8,
                                borderLeftWidth: 1.5,
                                paddingLeft: 10,
                                marginLeft: 20,
                                borderStyle: 'dotted',
                                borderColor: 'grey',
                                // justifyContent: 'space-around'
                            }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ color: Colors.primary, fontSize: 16, fontFamily: 'AvenirNextCyr-Medium', borderBottomColor: 'grey', borderBottomWidth: 0.5 }}>{item?.name}</Text>
                                </View>

                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                                    <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Thin' }}>{item?.date_modified}</Text>
                                    <Text style={{ color: Colors.primary, fontSize: 12, fontFamily: 'AvenirNextCyr-Medium', textDecorationLine: 'underline', textDecorationColor: Colors.primary, marginRight: 10 }}>Cancel</Text>
                                </View>

                                <View style={{ justifyContent: 'space-between', flexDirection: 'row', marginTop: 10 }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Thin' }}>Total SKUs: </Text>
                                        <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Thin' }}>{Number(item?.totalitems)}</Text>
                                    </View>

                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Thin' }}>Total Price: </Text>
                                        <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Thin' }}>{Number(item?.total_amount)}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        {/* <Text style={{ fontSize: 12, color: 'black', fontFamily: 'AvenirNextCyr-Thin', marginTop: 5 }}>Confirmed</Text> */}
                    </TouchableOpacity>
                }
            //keyExtractor={(item) => item.id.toString()}
            />
        </View>
    );
}

const DeliveryHome = ({ navigation }) => {
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const { logout } = useContext(AuthContext);
    const { token, userData, cartData, setCartData, orderID, dealerData } = useContext(AuthContext);

    const logoutAlert = () => {
        Alert.alert('Confirmation', 'Are you sure, You want to logout?', [
            {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            { text: 'OK', onPress: () => { logout() } },
        ]);
    }

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
                <View style={{ backgroundColor: '#D7BDE2', paddingBottom: '5%', borderRadius: 10 }}>

<View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: '5%', paddingTop: '2%', backgroundColor: '#D7BDE2', alignItems: 'center' }}>

    <View style={{ justifyContent: 'center', backgroundColor: '#D7BDE2', borderTopRightRadius: 30, borderBottomRightRadius: 30, alignItems: 'center' }}>
        <Image source={require('../../assets/images/ordologo-bg.png')} style={{ height: 70, width: 90 }} />
    </View>
    <ActivityIndicator
        animating={loading}
        color={Colors.primary}
        size="large"
        style={styles.activityIndicator}

    />
    <View style={{ alignItems: 'center', flexDirection: 'row', paddingBottom: 10, flex: 1, justifyContent: 'flex-end' }}>
        {/* <TouchableOpacity onPress={()=>{navigation.navigate('MyCart')}}>
        <ShoppingCart size={18} stroke={Colors.primary} style={{marginRight:20}}/>
    </TouchableOpacity> */}
        {/* <Image source={require('../../assets/images/reload.png')} style={{ height: 25, width: 25, tintColor: '#6B1594' }} /> */}
        <TouchableOpacity onPress={logoutAlert}>
            <Image source={require('../../assets/images/power-off.png')} style={{ height: 25, width: 25, tintColor: '#6B1594', marginLeft: 20, marginRight: 10 }} />
        </TouchableOpacity>
    </View>
</View>
<View>
     <View style={{ paddingHorizontal: '4%', marginTop: 10,marginBottom:5,alignItems:'center' }}>
        <Text style={{ color: '#6B1594', fontSize: 22, fontFamily: 'AvenirNextCyr-Medium' }}>Welcome {userData?.name}</Text>
    </View>

</View>
</View>
            {/* <View style={{ flexDirection: 'row', marginHorizontal: 30, marginTop: 10 }}>
                <View style={styles.modalSearchContainer}>
                    <TextInput
                        style={styles.input}
                        value={search}
                        placeholder="Enter Order"
                        placeholderTextColor="gray"
                        onChangeText={(val) => setSearch(val)}
                    />
                    <TouchableOpacity style={styles.searchButton} >
                        <AntDesign name="search1" size={20} color="black" />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    style={{ height: 45, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', borderRadius: 8, paddingHorizontal: 16, elevation: 5, ...globalStyles.border, flex: 0.2 }}
                    onPress={() => {
                        setSearch('');
                    }
                    }
                >
                    <Text style={{ color: 'blue', fontFamily: 'AvenirNextCyr-Thin', fontSize: 14 }}>Clear</Text>
                </TouchableOpacity>
            </View> */}
            {/* <Text style={{ marginLeft: 50 }}> {topBarData?.count} Results</Text> */}
            <Tab.Navigator


            >
                <Tab.Screen name="Pending" options={{ title: 'Assigned', tabBarLabelStyle: { fontFamily: 'AvenirNextCyr-Medium', textTransform: 'capitalize' } }} component={Pending} />
                <Tab.Screen name="Completed" options={{ title: 'Completed', tabBarLabelStyle: { fontFamily: 'AvenirNextCyr-Medium', textTransform: 'capitalize' } }} component={Completed} />
                {/* <Tab.Screen name="Return" options={{ title: 'Return', tabBarLabelStyle: { fontFamily: 'AvenirNextCyr-Medium', textTransform: 'capitalize' } }} component={Return} /> */}
            </Tab.Navigator>
        </View>
    )
}

export default DeliveryHome

const styles = StyleSheet.create({
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
    input: {
        flex: 1,
        fontSize: 16,
        marginRight: 10,
    },
    searchButton: {
        padding: 5,
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
        ...globalStyles.border,
        padding: 20
        //borderColor: '#fff',
        //borderWidth: 0.5
    },
    imageView: {
        width: 40,
        height: 40
    },
    activityIndicator: {
        flex: 1,
        alignSelf: 'center',
        height: 100,
        position: 'absolute',
        top: '30%',

    },
})