import {
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    TouchableOpacity,
    FlatList,
    Modal,
    Pressable,
    Alert,
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import Colors from "../../constants/Colors";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import AntDesign from "react-native-vector-icons/AntDesign";
import Feather from "react-native-vector-icons/Feather";
import { useFocusEffect } from "@react-navigation/native";
import Entypo from "react-native-vector-icons/Entypo";
import { AuthContext } from "../../Context/AuthContext";
import LinearGradient from "react-native-linear-gradient";
import { Searchbar, RadioButton,Button, ActivityIndicator , Menu, Divider, Provider} from "react-native-paper";
import moment from "moment";
import DatePicker from "react-native-date-picker";
import Toast from "react-native-simple-toast";
import OrdersSkeleton from "../Skeleton/OrdersSkeleton";
import ConvertDateTime from "../../utils/ConvertDateTime";
import { fetchDataForTeam } from "./helper";


const Tab = createMaterialTopTabNavigator();

const Pending = ({ pendingArray, navigation, fetchData, ordersLoading, renderItem,loading,handleLoadMore }) => {
    if (ordersLoading) {
        return <OrdersSkeleton />;
    }
    return (
        <View style={{ flex: 1, backgroundColor: "white" }}>
            {pendingArray?.length === 0 ? (
                <View style={{
                    marginTop: '30%',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Text style={{
                        fontSize: 18,
                        color: 'grey',
                    }}>No Invoice</Text>
                </View>
            ) : (
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={pendingArray}
                    keyboardShouldPersistTaps="handled"
                    renderItem={renderItem}
                    keyExtractor={(item, index) => `${item.id}-${index}`}
                    onRefresh={fetchData}
                    refreshing={ordersLoading}
                    ListFooterComponent={pendingArray?.length < 10 ? null : ( loading ? (
                    <ActivityIndicator style={{ paddingVertical: 5 }} /> ) : ( <Button onPress={handleLoadMore}>Load More</Button>))}
                />
            )}
        </View>
    );
};

const Delivered = ({ completedArray, navigation, ordersLoading, renderItem,loading,handleLoadMore}) => {
    if (ordersLoading) {
        return <OrdersSkeleton />;
    }

    return (
        <View style={{ flex: 1, backgroundColor: "white" }}>
            {completedArray?.length === 0 ? (
                <View style={{
                    marginTop: '30%',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Text style={{
                        fontSize: 18,
                        color: 'grey',
                    }}>No Invoice</Text>
                </View>
            ) : (
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={completedArray}
                    keyboardShouldPersistTaps="handled"
                    renderItem={renderItem}
                    keyExtractor={(item, index) => `${item.id}-${index}`}
                    ListFooterComponent={completedArray?.length < 10 ? null : ( loading ? (
                    <ActivityIndicator style={{ paddingVertical: 5 }} /> ) : ( <Button onPress={handleLoadMore}>Load More</Button>))}
                />
            )}
        </View>
    );
};

const Canceled = ({ cancelledArray, navigation, ordersLoading, renderItem ,loading,handleLoadMore}) => {
    if (ordersLoading) {
        return <OrdersSkeleton />;
    }
    return (
        <View style={{ flex: 1, backgroundColor: "white" }}>
            {cancelledArray?.length === 0 ? (
                <View style={{
                    marginTop: '30%',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Text style={{
                        fontSize: 18,
                        color: 'grey',
                    }}>No Invoice</Text>
                </View>
            ) : (
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={cancelledArray}
                    keyboardShouldPersistTaps="handled"
                    renderItem={renderItem}
                    keyExtractor={(item, index) => `${item.id}-${index}`}
                    ListFooterComponent={cancelledArray?.length <10 ? null : ( loading ? (
                    <ActivityIndicator style={{ paddingVertical: 5 }} /> ) : ( <Button onPress={handleLoadMore}>Load More</Button>))}
                />
            )}
        </View>
    );
};


const CollInvoice = ({ navigation }) => {
    const { ordersLoading, setOrdersLoading, userData, dealerData, logout, token,setToken } =
        useContext(AuthContext);

    const [search, setSearch] = useState("");
    const onChangeSearch = (query) => setSearchQuery(query);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedOption, setSelectedOption] = useState("all");
    const [searchQuery, setSearchQuery] = React.useState("");
    const [isDatePickerVisible, setDatePickerVisible] = useState(false);
    const [date, setDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split("T")[0]);
    const [loading, setLoading] = useState(false);
    const [pendingArray, setPendingArray] = useState([]);
    const [completedArray, setCompletedArray] = useState([]);
    const [cancelledArray, setCancelledArray] = useState([]);
    const [filteredPendingArray, setFilteredPendingArray] = useState([]);
    const [filteredCompletedArray, setFilteredCompletedArray] = useState([]);
    const [filteredCancelledArray, setFilteredCancelledArray] = useState([]);
    const [limit, setLimit] = useState(10); 
    const [pendingOffset, setPendingOffset] = useState(10);
    const [completedOffset, setCompletedOffset] = useState(10);
    const [cancelledOffset, setCancelledOffset] = useState(10);
    const [screenName, setScreenName] = useState('Approved');
    const [noDay, setnoDay] = useState('');
    const [visible, setVisible] = useState(false);
    const [selectedDay, setSelectedDay] = useState(''); 

    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    useFocusEffect(
        React.useCallback(() => {
            fetchData();
        }, [userData ,noDay])
    );

    const logoutAlert = () => {

        Alert.alert("Confirmation", "Are you sure, You want to logout?", [
            {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel",
            },
            {
                text: "OK",
                onPress: () => {
                    logout();
                },
            },
        ]);
    };

    useEffect(() => {
        const fetchPendingData = async () => {
            try {
                    const PendingData = await fetchDataForTeam('Paid', 10, 0, userData, search,noDay);
                    setPendingArray(PendingData);
                    setFilteredPendingArray(PendingData);
        
                    const CompletedData = await fetchDataForTeam('UnPaid', 10, 0, userData, search,noDay);
                    setCompletedArray(CompletedData);
                    setFilteredCompletedArray(CompletedData);

                    const cancelledData = await fetchDataForTeam('Partially Paid', 10, 0, userData, search,noDay);
                    setCancelledArray(cancelledData);
                    setFilteredCancelledArray(cancelledData);
                    
            } catch (error) {
                console.error('Error fetching pending data:', error);
            }
        };
        fetchPendingData(); 
    }, [search, userData ,noDay]); 


    const fetchData = async () => {
        
        setOrdersLoading(true);
        setSearch('')

        try {
            if (userData) {
                const pendingData = await fetchDataForTeam('Paid', 10, 0, userData, '',noDay);
                const completedData = await fetchDataForTeam('UnPaid', 10, 0, userData, '',noDay);
                const cancelledData = await fetchDataForTeam('Partially Paid', 10, 0, userData, '',noDay);

                    setPendingArray(pendingData);
                    setCompletedArray(completedData);
                    setCancelledArray(cancelledData);
        
                    setFilteredPendingArray(pendingData);
                    setFilteredCompletedArray(completedData);
                    setFilteredCancelledArray(cancelledData);
            }
            
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setOrdersLoading(false);
        }
    };


    const handleLoadMore = async ()=>{
        setLoading(true);
        setSearch('')
        try {
            if (screenName === 'Pending'){
                console.log("FROM PENDINGGGG")
            const newPendingData = await fetchDataForTeam('Paid', 10, pendingOffset, userData, '',noDay);
            if(newPendingData?.length<=0){
                Toast.show("Reached End", Toast.LONG);
            }else{
              setPendingArray((prevPendingArray) => [...prevPendingArray, ...newPendingData]);
              setFilteredPendingArray((prevPendingArray) => [...prevPendingArray, ...newPendingData]);
              setPendingOffset((prevOffset) => prevOffset + 10);
            }
            }
            else if(screenName === 'Approved'){
                console.log("FROM APPROVEDDD")
            const newCompletedData = await fetchDataForTeam('UnPaid', 10, completedOffset, userData, '',noDay);
            if(newCompletedData?.length<=0){
                Toast.show("Reached End", Toast.LONG);
            }else{
              setCompletedArray((prevCompletedArray) => [...prevCompletedArray, ...newCompletedData]);
              setFilteredCompletedArray((prevCompletedArray) => [...prevCompletedArray, ...newCompletedData]);
              setCompletedOffset((prevOffset) => prevOffset + 10);
            }
            }
        else {
            const newCancelledData = await fetchDataForTeam('Partially Paid', 10, cancelledOffset, userData, search,noDay);
            console.log("FROM REJECTEDDDD")
            if(newCancelledData?.length<=0){
                Toast.show("Reached End", Toast.LONG);
            }else{
            setCancelledArray((prevCancelledArray) => [...prevCancelledArray, ...newCancelledData]);
            setFilteredCancelledArray((prevCancelledArray) => [...prevCancelledArray, ...newCancelledData]);
            setCancelledOffset((prevOffset) => prevOffset + 10);
            }
        }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }
    
    const renderItem = ({ item }, type) => {
        
        return (
            <TouchableOpacity
                onPress={() => navigation.navigate("CollInvoiceDetails", { details: item, screen: type })}
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
                            <Text
                                style={{
                                    color: "black",
                                    fontSize: 12,
                                    fontFamily: "AvenirNextCyr-Medium",
                                }}
                            >
                                {item?.customer_name || item?.supplier_name}
                            </Text>
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
    {item?.amount ? 
        new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(item.amount) : 
        '₹0'}
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

    const handleSelect = (option) => {
        setSelectedOption(option);
    };

    const handleFilter = () => {
        if (selectedOption === "all") {
            setFilteredCompletedArray(completedArray);
            setFilteredPendingArray(pendingArray);
            setFilteredCancelledArray(cancelledArray);
        } else if (selectedOption === "custom") {
            const filteredpendingarray = pendingArray.filter((order) => {
                const orderDate = moment(order.created_at).format("YYYY-MM-DD");
                return orderDate === selectedDate;
            });
            setFilteredPendingArray(filteredpendingarray);

            const filteredcompletedarray = completedArray.filter((order) => {
                const orderDate = moment(order.created_at).format("YYYY-MM-DD");
                return orderDate === selectedDate;
            });
            setFilteredCompletedArray(filteredcompletedarray);

            const filteredreturnarray = cancelledArray.filter((order) => {
                const orderDate = moment(order.created_at).format("YYYY-MM-DD");
                return orderDate === selectedDate;
            });

            setFilteredCancelledArray(filteredreturnarray);
        }
        setModalVisible(false);
    };

    const clearFilters = () => {
        setSelectedOption("all");
        setFilteredCompletedArray(completedArray);
        setFilteredPendingArray(pendingArray);
        setFilteredCancelledArray(cancelledArray);
    };

    const InputWithLabel = ({ title, value, onPress }) => {
        return (
            <View>
                <Pressable style={{ ...styles.inputContainer1 }} onPress={onPress}>
                    <Image
                        style={{ width: 20, height: 20, marginLeft: 10 }}
                        source={require("../../assets/images/calendar.png")}
                    ></Image>
                    <Text style={styles.input2}>
                        {value ? moment(value).format("DD-MM-YYYY") : "Select date"}
                    </Text>
                </Pressable>
            </View>
        );
    };

    return (
        <Provider>
        <LinearGradient
            colors={Colors.linearColors}
            start={Colors.start}
            end={Colors.end}
            locations={Colors.location}
            style={{ flex: 1 }}
        >
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: '6%',
      }}
    >
      <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingLeft: '4%' }}>
        <Image
          source={require('../../assets/images/Refund_back.png')}
          style={{ height: 30, width: 30 }}
        />
      </TouchableOpacity>
      <Text
        style={{
          fontFamily: 'AvenirNextCyr-Medium',
          fontSize: 19,
          color: 'white',
          marginLeft:'8%'
        }}
      >
        Invoice
      </Text>

      {screenName !== 'Pending' ? (
        <View style={{ flexDirection: 'column', alignItems: 'center',gap:5 ,marginTop:'2%'}}>
          <Menu
            visible={visible}
            onDismiss={closeMenu}
            anchor={
              <TouchableOpacity onPress={openMenu} style={{ width: '100%',marginRight:'3%' }}>
                  <Entypo name="dots-three-vertical" size={22} color="white" />
              </TouchableOpacity>
            }>
            <Menu.Item onPress={() => { console.log('15 days selected'); setnoDay(15); closeMenu(); setSelectedDay(15);}} title="15 days" />
            <Divider />
            <Menu.Item onPress={() => { console.log('30 days selected'); setnoDay(30); closeMenu();  setSelectedDay(30);}} title="30 days" />
            <Divider />
            <Menu.Item onPress={() => { console.log('60 days selected'); setnoDay(60); closeMenu(); setSelectedDay(60); }} title="60 days" />
            <Divider />
            <Menu.Item onPress={() => { console.log('All days selected'); setnoDay(''); closeMenu(); setSelectedDay(''); }} title="All days" />
          </Menu>
          <Text
            style={{
              fontFamily: 'AvenirNextCyr-Medium',
              fontSize: 14,
              color: 'white',
              marginRight: 10,
            }}
          >
            {selectedDay ? `${selectedDay} Days` : 'All Days'}
          </Text>
        </View>
      ) : (
        <TouchableOpacity style={{ width: '4%' }} />
      )}
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
                inputStyle={{
                    fontFamily: "AvenirNextCyr-Medium",
                    color: 'black',
                }}
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
                    }}>
                    <Text
                        style={{
                            color: "white",
                            fontFamily: "AvenirNextCyr-Medium",
                            fontSize: 16,
                        }}>
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
                            }}>
                            {selectedDate}
                        </Text>

                        <TouchableOpacity onPress={clearFilters}>
                            <AntDesign name="close" size={20} color={`white`} />
                        </TouchableOpacity>
                    </View>
                </View>
            )}
            <Tab.Navigator
                    screenOptions={{
                        tabBarActiveTintColor: Colors.primary,
                        tabBarInactiveTintColor: "gray",
                        tabBarLabelStyle: { fontSize: 12, fontWeight: "bold" },
                        tabBarIndicatorStyle: {
                            backgroundColor: Colors.primary,
                        },
                    }}
                    swipeEnabled={false}
                >

                    <Tab.Screen name="Un Paid" listeners={{
                     tabPress: () => {setScreenName('Approved'); fetchData()},
                     swipeStart: () => {setScreenName('Rejected');fetchData();console.log("approved---->rejected")},
                    swipeEnd: () => {setScreenName('Approved');fetchData();console.log("back to approved")}
                      }}>
                        {() => <Delivered completedArray={completedArray} navigation={navigation} ordersLoading={ordersLoading} renderItem={renderItem} loading={loading} handleLoadMore={handleLoadMore}/>}
                    </Tab.Screen>
                    <Tab.Screen name="Partially Paid" listeners={{
                     tabPress: () => {setScreenName('Rejected'); fetchData();},
                     swipeEnd: () => {setScreenName('Rejected');fetchData();console.log("back to rejected")}
                      }}>
                        {() => <Canceled cancelledArray={cancelledArray} navigation={navigation} ordersLoading={ordersLoading} renderItem={renderItem} loading={loading} handleLoadMore={handleLoadMore}/>}
                    </Tab.Screen>
                    <Tab.Screen name="Paid" 
                    listeners={{
                     tabPress: () => {setScreenName('Pending');fetchData(); setnoDay('');},
                     swipeStart: () => {setScreenName('Approved');fetchData();console.log("pending---->approved")},
                     swipeEnd: () =>{setScreenName('Pending');fetchData();console.log("back to pending"); setnoDay(''); }
                      }}>
                        {() => <Pending pendingArray={pendingArray} navigation={navigation} fetchData={fetchData} ordersLoading={ordersLoading} renderItem={renderItem} loading={loading} handleLoadMore={handleLoadMore}/>}
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
                                justifyContent: "space-between",
                                paddingHorizontal: "4%",
                            }}
                        >
                            <Text></Text>
                            <Text
                                style={{
                                    fontSize: 20,
                                    color: "black",
                                    fontFamily: "AvenirNextCyr-Medium",
                                }}
                            >
                                Filter Orders
                            </Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <AntDesign name='close' size={20} color={`black`} />
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
                                locations={Colors.ButtonsLocation}
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
        </Provider>
    );
};

export default CollInvoice;

const styles = StyleSheet.create({
    modalSearchContainer: {
        flex: 0.8,
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "lightgray",
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
        marginRight: 10,
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
        padding: 20,
    },
    imageView: {
        width: 40,
        height: 40,
    },
    activityIndicator: {
        flex: 1,
        alignSelf: "center",
        height: 100,
        position: "absolute",
        top: "30%",
    },

    inputContainer1: {
        borderColor: "#b3b3b3",
        color: "gray",
        borderWidth: 1,
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 8,
        padding: 5,
    },
    input2: {
        fontFamily: "AvenirNextCyr-Medium",
        padding: 8,
        marginLeft: "4%",
    },

    button: {
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 50,
        width: "100%",
        height: 50,
    },
    btnText: {
        fontFamily: "AvenirNextCyr-Medium",
        color: "#fff",
        fontSize: 16,
    },
});
