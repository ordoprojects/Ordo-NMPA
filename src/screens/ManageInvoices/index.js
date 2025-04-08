import {
    StyleSheet, Text, View, Image, TextInput, RefreshControl,
    ActivityIndicator, TouchableOpacity, FlatList, Alert, Pressable,
    ToastAndroid, Modal,
    ScrollView
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import { AnimatedFAB } from 'react-native-paper';
import React, { useState, useEffect, useContext } from 'react'
import Colors from '../../constants/Colors';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer, useIsFocused, useRoute } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { AuthContext } from '../../Context/AuthContext';
import globalStyles from '../../styles/globalStyles';
import moment from 'moment';
import DatePicker from 'react-native-date-picker'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { checkVersion } from "react-native-check-version";
import { Searchbar, RadioButton } from "react-native-paper";
import OrdersSkeleton from '../Skeleton/OrdersSkeleton';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useFocusEffect } from "@react-navigation/native";

const Tab = createMaterialTopTabNavigator();

const Drivers = ({ fetchData, pendingOrders, loading, renderItem, navigation ,onEndReached}) => {

    if (loading) {
        return (
            <OrdersSkeleton />
        );
    }

    const { userData } = useContext(AuthContext);
    const [isExtended, setIsExtended] = useState(true);

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>

            <FlatList
                showsVerticalScrollIndicator={false}
                data={pendingOrders}
                keyboardShouldPersistTaps='handled'
                renderItem={(item) => renderItem(item, 'SO')}
                ListEmptyComponent={() => (
                    <View style={styles.noProductsContainer}>
                        <Text style={styles.noProductsText}>No Sales Invoices</Text>
                    </View>
                )}
            //keyExtractor={(item) => item.id.toString()}
                onEndReached={onEndReached} // Added onEndReached
                onEndReachedThreshold={0.5}
            />
        </View>
    );
}

const Vehicles = ({ navigation, route, fetchData, purchaseInvoices, renderItem, loading ,onEndReached}) => {

    const [isExtended, setIsExtended] = useState(true);

    if (loading) {
        return (
            <OrdersSkeleton />
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>

            <FlatList
                showsVerticalScrollIndicator={false}
                data={purchaseInvoices}
                keyboardShouldPersistTaps='handled'
                renderItem={(item) => renderItem(item, 'PO')}
                ListEmptyComponent={() => (
                    <View style={styles.noProductsContainer}>
                        <Text style={styles.noProductsText}>No Purchase Invoice</Text>
                    </View>
                )}
                onEndReached={onEndReached} 
                onEndReachedThreshold={0.5}
            />

        </View>
    );
}


const ManageInvoices = ({ navigation }) => {
    const [selectedOption, setSelectedOption] = useState("all");
    const [modalVisible, setModalVisible] = useState(false);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = React.useState(false);
    const [date, setDate] = useState(new Date())
    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split("T")[0]
    );
    const [isDatePickerVisible, setDatePickerVisible] = useState(false);
    const [salesInvoices, setSalesInvoices] = useState([]);
    const [filteredSalesInvoices, setFilteredSalesInvoices] = useState([]);
    const [purchaseInvoices, setPurchaseInvoices] = useState([]);
    const [filteredPurchaseInvoices, setFilteredPurchaseInvoices] = useState([]);
    const [offset, setOffset] = useState(0);
    const [fetchingMore, setFetchingMore] = useState(false);
    const [screenName, setScreenName] = useState('Sales');

    const {
        userData,
    } = useContext(AuthContext);


    useFocusEffect(
        React.useCallback(() => {
            fetchData();
        }, [])
      );


    useEffect(() => {
        fetchData();
    }, [userData]);

    useEffect(() => {
        const fetchDataSearch = async () => {
            setLoading(true);
            const myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${userData.token}`);
            const requestOptions = {
                method: "GET",
                headers: myHeaders,
                redirect: "follow",
            };
    
            try {
                let response;
                if (screenName === 'Sales') { // Fixed the condition syntax
                    response = await fetch(`https://gsidev.ordosolution.com/api/acc_sales/?limit=30&offset=0&search_name=${search}`, requestOptions);
                    const result = await response.json();
                    setSalesInvoices(result);
                    setFilteredSalesInvoices(result);
                } else {
                    response = await fetch(`https://gsidev.ordosolution.com/api/acc_purchase/?limit=30&offset=0&search_name=${search}`, requestOptions);
                    const result = await response.json();
                    setPurchaseInvoices(result);
                    setFilteredPurchaseInvoices(result);
                }
    
                setLoading(false);
            } catch (error) {
                console.log("Error", error);
                setLoading(false);
            }
        };
    
        fetchDataSearch();
    }, [search]);
    

    const fetchData = async () => {
        setLoading(true);
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${userData.token}`);
        var raw = "";
        var requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow",
        };

        try {
            const customerResponse = await fetch("https://gsidev.ordosolution.com/api/acc_sales/?limit=30&offset=0&search_name=", requestOptions);
            const customerResult = await customerResponse.json();
            setSalesInvoices(customerResult);
            setFilteredSalesInvoices(customerResult);

            const vendorResponse = await fetch("https://gsidev.ordosolution.com/api/acc_purchase/?limit=30&offset=0&search_name=", requestOptions);
            const vendorResult = await vendorResponse.json();
            setPurchaseInvoices(vendorResult);
            setFilteredPurchaseInvoices(vendorResult);

            setLoading(false);
        } catch (error) {
            console.log("Error", error);
            setLoading(false);
        }
    };

    const fetchMoreData = async (newOffset = 0) => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${userData.token}`);
        var raw = "";
        var requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow",
        };

        try {
            const customerResponse = await fetch(`https://gsidev.ordosolution.com/api/acc_sales/?limit=30&offset=${offset}&search_name=`, requestOptions);
            const customerResult = await customerResponse.json();
            if (offset > 0) {
                setSalesInvoices((prevInvoices) => [...prevInvoices, ...customerResult]);
                setFilteredSalesInvoices((prevInvoices) => [...prevInvoices, ...customerResult]);
            } else {
                setSalesInvoices(customerResult);
                setFilteredSalesInvoices(customerResult);
            }

            const vendorResponse = await fetch(`https://gsidev.ordosolution.com/api/acc_purchase/?limit=30&offset=${offset}&search_name=`, requestOptions);
            const vendorResult = await vendorResponse.json();
            if (offset > 0) {
                setPurchaseInvoices((prevInvoices) => [...prevInvoices, ...vendorResult]);
                setFilteredPurchaseInvoices((prevInvoices) => [...prevInvoices, ...vendorResult]);
            } else {
                setPurchaseInvoices(vendorResult);
                setFilteredPurchaseInvoices(vendorResult);
            }

        } catch (error) {
            console.log("Error", error);
        }
    };
    

    const handleEndReached = () => {
        setOffset((prevOffset) => {
            const newOffset = prevOffset + 10;
            fetchMoreData(newOffset);
            return newOffset;
        });
    };

    const InputWithLabel = ({ title, value, onPress }) => {
        return (
            <View>
                <Pressable style={{ ...styles.inputContainer1 }} onPress={onPress} >
                    <Image style={{ width: 20, height: 20, marginLeft: 10 }} source={require("../../assets/images/calendar.png")}></Image>
                    <Text style={styles.input2}>{value ? moment(value).format('DD-MM-YYYY') : 'Select date'}</Text>

                </Pressable>
            </View>
        );
    }

    const handleSelect = (option) => {
        setSelectedOption(option)
    };


    const handleFilter = () => {
        if (selectedOption === "all") {
            setFilteredSalesInvoices(salesInvoices);
            setFilteredPurchaseInvoices(purchaseInvoices);


        } else if (selectedOption === "custom") {
            const filteredconfirmedorders = salesInvoices.filter((order) => {
                const orderDate = moment(order.created_at).format("YYYY-MM-DD");
                return orderDate === selectedDate;
            });
            setFilteredSalesInvoices(filteredconfirmedorders);

            const filteredtransitorders = purchaseInvoices.filter((order) => {
                const orderDate = moment(order.created_at).format("YYYY-MM-DD");
                return orderDate === selectedDate;
            });
            setFilteredPurchaseInvoices(filteredtransitorders);
        }
        setModalVisible(false);
    };

    const clearFilters = () => {
        setSelectedOption("all");
        setFilteredSalesInvoices(salesInvoices);
        setFilteredPurchaseInvoices(purchaseInvoices);
    };


    const renderItem = ({ item }, type) => {
        
        return (
            <TouchableOpacity
                onPress={() => navigation.navigate("InvoiceDetails", { details: item, screen: type })}
                style={styles.elementsView} activeOpacity={0.8}>
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1, gap: 6 }}>
                        {item?.status == "Paid" ?
                            (
                                <AntDesign name="checkcircleo" color={Colors.primary} size={35} />
                            ) :
                            (
                                <AntDesign name="exclamationcircleo" color={Colors.primary} size={35} />
                            )
                        }
                        <Text
                            style={{
                                color: "black",
                                fontSize: 12,
                                fontFamily: "AvenirNextCyr-Medium",
                            }}
                        >
                            {item?.status}
                        </Text>
                    </View>
                    <View style={{
                        flex: 6,
                        marginLeft: 25,
                    }}>
                        <View style={{ flexDirection: "row", justifyContent: 'space-between' }}>
                            <Text
                                style={{
                                    color: Colors.primary,
                                    fontSize: 16,
                                    fontFamily: "AvenirNextCyr-Bold",
                                    borderBottomColor: "grey",
                                    borderBottomWidth: 0.5,
                                }}
                            >
                                INVOICE - {item?.invoice}
                            </Text>

                            <Text
                                style={{
                                    color: "black",
                                    fontSize: 12,
                                    fontFamily: "AvenirNextCyr-Medium",
                                }}
                            >
                                {item?.invoice_date && item?.invoice_date.split('-').reverse().join('/')}
                            </Text>

                        </View>

                        <View
                            style={{
                                justifyContent: "space-between",
                                flexDirection: "row",
                                marginTop: 5,
                            }}
                        >
                            {/* <View style={{ flexDirection: "row", justifyContent: 'space-between' }}> */}
                            <Text
                                style={{
                                    color: "black",
                                    fontSize: 12,
                                    fontFamily: "AvenirNextCyr-Medium",
                                }}
                            >
                                {item?.customer_name || item?.supplier_name}
                            </Text>

                            {/* </View> */}
                        </View>

                        <View
                            style={{
                                justifyContent: "space-between",
                                flexDirection: "row",
                                marginTop: 5,
                            }}
                        >
                            <Text
                                style={{
                                    color: "green",
                                    fontSize: 17,
                                    fontFamily: "AvenirNextCyr-Medium",
                                }}
                            >
                                ₹{item?.amount}
                            </Text>
                            <AntDesign name="right" color="black" size={20} />


                        </View>

                        {
                            item?.payment_date !== null && (
                                <View style={{ flexDirection: "row", marginTop: 5 }}>
                                    <Text
                                        style={{
                                            color: "black",
                                            fontSize: 12,
                                            fontFamily: "AvenirNextCyr-Medium",
                                        }}
                                    >
                                       Payment date: {item?.payment_date && item?.payment_date.split('-').reverse().join('/')}
                                    </Text>
                                </View>
                            )
                        }
                    </View>
                </View>
            </TouchableOpacity>

        )
    }

    return (

        <LinearGradient
            colors={Colors.linearColors}
            start={Colors.start}
            end={Colors.end}
            locations={Colors.location}
            style={{ flex: 1 }}
        >

            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: "100%",
                    height: "10%",
                    alignItems: "center",
                    alignContent: "center",
                    textAlign: "center",
                    paddingHorizontal: "4%",
                }}
            >
                <TouchableOpacity
                    onPress={() => {
                        navigation.goBack();
                    }}
                >
                    <Image
                        source={require("../../assets/images/Refund_back.png")}
                        style={{ height: 30, width: 30 }}
                    />
                </TouchableOpacity>
                <Text
                    style={{
                        fontFamily: "AvenirNextCyr-Medium",
                        fontSize: 19,
                        marginLeft: 8,
                        color: "white",
                    }}
                >
                    Invoices
                </Text>

                <Text>{"    "}</Text>

            </View>

            <Searchbar
                style={{
                    marginHorizontal: "4%",
                    marginBottom: "4%",
                    backgroundColor: "#F3F3F3",
                    fontFamily: "AvenirNextCyr-Medium",
                }}
                placeholder="Search Invoice"
                placeholderTextColor="grey"
                onChangeText={(val) => setSearch(val)}
                value={search}
            />

            {selectedOption === "custom" && (
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingHorizontal: "5%",
                        backgroundColor: "rgba(158, 78, 126, 0.61)",
                        paddingVertical: "2%",
                    }}
                >
                    <Text
                        style={{
                            color: "white",
                            fontFamily: "AvenirNextCyr-Medium",
                            fontSize: 16,
                        }}
                    >
                        Filter
                    </Text>

                    <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
                        <Text
                            style={{
                                color: "white",
                                fontFamily: "AvenirNextCyr-Medium",
                                borderWidth: 1,
                                borderColor: "white",
                                paddingHorizontal: "2%",
                                borderRadius: 20,
                                paddingVertical: "1%",
                            }}
                        >
                            {selectedDate}
                        </Text>

                        <TouchableOpacity onPress={clearFilters}>
                            <AntDesign name="close" size={20} color={`white`} />
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            <Tab.Navigator
                style={{ borderTopLeftRadius: 20, borderTopRightRadius: 20 }}
                screenOptions={{ tabBarIndicatorStyle: { backgroundColor: Colors.primary } }}>


                <Tab.Screen
                    name="Drivers"
                    listeners={{
                        tabPress: () => {setScreenName('Sales');fetchData()}
                         }}
                    options={{ title: 'Sales', tabBarLabelStyle: { fontFamily: "AvenirNextCyr-Bold", textTransform: 'capitalize' } }}
                >
                    {(props) => <Drivers {...props} pendingOrders={filteredSalesInvoices} renderItem={renderItem} loading={loading} navigation={navigation}  onEndReached={handleEndReached} />}
                </Tab.Screen>



                <Tab.Screen
                    name="Vehicles"
                    listeners={{
                        tabPress: () => {setScreenName('Purchases');fetchData()}
                         }}
                    options={{ title: 'Purchases', tabBarLabelStyle: { fontFamily: "AvenirNextCyr-Bold", textTransform: 'capitalize' } }}
                >
                    {(props) => <Vehicles {...props} purchaseInvoices={filteredPurchaseInvoices} renderItem={renderItem} loading={loading} navigation={navigation} onEndReached={handleEndReached} />}
                </Tab.Screen>
            </Tab.Navigator>

            <Modal visible={modalVisible} transparent={true}>
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
                        }}
                    >
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "center",
                                paddingHorizontal: "4%",
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 20,
                                    color: "black",
                                    fontFamily: "AvenirNextCyr-Medium",
                                }}
                            >
                                Filter Orders
                            </Text>
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
                                    // paddingHorizontal: '3%',
                                    paddingVertical: "1%",
                                    backgroundColor:
                                        selectedOption === "all" ? Colors.primary : "white",
                                    color: selectedOption === "all" ? "white" : "black",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    borderRadius: 30,
                                    width: "40%",
                                }}
                            >
                                <RadioButton.Android
                                    color={"white"}
                                    status={selectedOption === "all" ? "checked" : "unchecked"}
                                    onPress={() => handleSelect("all")}
                                />
                                <TouchableOpacity onPress={() => handleSelect("all")}>
                                    <Text
                                        style={{
                                            fontFamily: "AvenirNextCyr-Medium",
                                            fontSize: 12,
                                            color: selectedOption === "all" ? "white" : "black",
                                        }}
                                    >
                                        ALL{" "}
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <View
                                style={{
                                    flexDirection: "row",
                                    // paddingHorizontal: '3%',
                                    width: "40%",
                                    paddingVertical: "1%",
                                    backgroundColor:
                                        selectedOption === "custom" ? Colors.primary : "white",
                                    color: selectedOption === "custom" ? "white" : "black",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    borderRadius: 30,
                                }}
                            >
                                <RadioButton.Android
                                    color={"white"}
                                    status={selectedOption === "custom" ? "checked" : "unchecked"}
                                    onPress={() => handleSelect("custom")}
                                />
                                <TouchableOpacity onPress={() => handleSelect("custom")}>
                                    <Text
                                        style={{
                                            fontFamily: "AvenirNextCyr-Medium",
                                            fontSize: 12,
                                            color: selectedOption === "custom" ? "white" : "black",
                                        }}
                                    >
                                        CUSTOM{" "}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {selectedOption === "custom" && (
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    backgroundColor: "#F4F4F4",
                                    paddingVertical: "3%",
                                    paddingHorizontal: "6%",
                                }}
                            >
                                <View>
                                    <Text
                                        style={{
                                            fontFamily: "AvenirNextCyr-Medium",
                                            fontSize: 18,
                                            color: "black",
                                        }}
                                    >
                                        Select Date
                                    </Text>
                                </View>

                                <View>
                                    <InputWithLabel
                                        value={date}
                                        onPress={() => {
                                            setDatePickerVisible(true);
                                        }}
                                    />
                                </View>
                                {isDatePickerVisible == true ? (
                                    <DatePicker
                                        modal
                                        theme="light"
                                        mode={"date"}
                                        open={isDatePickerVisible}
                                        date={date}
                                        format="DD-MM-YYYY"
                                        locale="en-GB"
                                        // minDate="2022-01-01"
                                        // maximumDate={new Date()}
                                        onConfirm={(date) => {
                                            // const dateString = date.toLocaleDateString();
                                            const dateString = moment(date).format("YYYY-MM-DD");
                                            setDatePickerVisible(false);
                                            setSelectedDate(dateString);
                                            setDate(date);
                                        }}
                                        onCancel={() => {
                                            setDatePickerVisible(false);
                                        }}
                                    />
                                ) : null}
                            </View>
                        )}

                        <View style={{ flexDirection: "row", justifyContent: "center" }}>
                            <LinearGradient
                                colors={Colors.linearColors}
                                start={Colors.start}
                                end={Colors.end}
                                locations={Colors.location}
                                style={{
                                    borderRadius: 50,
                                    alignItems: "center",
                                    marginTop: "3%",
                                    width: "70%",
                                    height: 50,
                                }}
                            >
                                <TouchableOpacity
                                    style={styles.button}
                                    activeOpacity={0.8}
                                    onPress={handleFilter}
                                >
                                    <Text style={styles.btnText}>Apply</Text>
                                </TouchableOpacity>
                            </LinearGradient>
                        </View>
                    </View>
                </View>
            </Modal>
        </LinearGradient>
        // </View>
    )
}

export default ManageInvoices

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
        borderBottomColor: 'black',
        borderBottomWidth: 0.5,
        // elevation: 5,
        // ...globalStyles.border,
        padding: 20,
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
    activeOrder: {

        // backgroundColor: 'grey',
        marginTop: '3%',
        marginHorizontal: 15,
        // alignItems:'center',
        paddingTop: 10,
        borderRadius: 20,
        // flex:1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 5,
        ...globalStyles.border,
        backgroundColor: 'white',
        // position: 'relative',
        // top: 50

    },
    orderContent: {
        flexDirection: 'row',
        // backgroundColor: 'red',
        justifyContent: 'space-around',
        paddingHorizontal: 30,
        marginTop: 10,
        margin: 10,
    },
    createOrder: {
        borderRadius: 0,
        marginBottom: 20,
        elevation: 5,
        ...globalStyles.border,
        paddingVertical: 10,
        marginHorizontal: 30,
        backgroundColor: 'white',
        marginTop: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    input2: {
        fontFamily: "AvenirNextCyr-Medium",
        padding: 8,
        color: 'black'


    },

    inputContainer1: {
        borderColor: 'grey',
        color: 'black',
        borderWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 10


    },
    noProductsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        // backgroundColor:"red"
    },
    noProductsText: {
        fontSize: 16,
        color: 'gray',
        fontFamily: "AvenirNextCyr-Medium",
        textAlign: 'center',
        marginTop: '25%',
    },
    button: {
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 50,
        width: "100%",
        height: 50,
    },
    btnText: {
        fontFamily: "AvenirNextCyr-Bold",
        color: "#fff",
        fontSize: 16,
    },

    avatar: {
        width: 60,
        height: 60,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: "gray",
    },

    fabStyle: {
        position: 'absolute',
        // marginBottom: 35,
        right: '4%',
        bottom: '5%',
        backgroundColor: Colors.primary,
        borderRadius: 30,
        // marginRight:'3%'

    },
})