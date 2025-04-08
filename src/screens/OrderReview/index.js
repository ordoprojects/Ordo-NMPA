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
import { useFocusEffect } from "@react-navigation/native";
import Entypo from "react-native-vector-icons/Entypo";
import Ionicons from "react-native-vector-icons/Ionicons";
import { AuthContext } from "../../Context/AuthContext";
import LinearGradient from "react-native-linear-gradient";
import { Searchbar, RadioButton,Button, ActivityIndicator} from "react-native-paper";
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
                    }}>No Pending orders</Text>
                </View>
            ) : (
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={pendingArray}
                    keyboardShouldPersistTaps="handled"
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
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
                    }}>No Approved orders</Text>
                </View>
            ) : (
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={completedArray}
                    keyboardShouldPersistTaps="handled"
                    renderItem={renderItem}
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
                    }}>No Rejected orders</Text>
                </View>
            ) : (
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={cancelledArray}
                    keyboardShouldPersistTaps="handled"
                    renderItem={renderItem}
                    ListFooterComponent={cancelledArray?.length <10 ? null : ( loading ? (
                    <ActivityIndicator style={{ paddingVertical: 5 }} /> ) : ( <Button onPress={handleLoadMore}>Load More</Button>))}
                />
            )}
        </View>
    );
};


const OrderReview = ({ navigation }) => {
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
        new Date().toISOString().split("T")[0]
    );
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
    const [screenName, setScreenName] = useState('Pending');


    useFocusEffect(
        React.useCallback(() => {
            fetchData();
        }, [userData])
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
                    const PendingData = await fetchDataForTeam('Pending', 10, 0, userData, search);
                    setPendingArray(PendingData.results);
                    setFilteredPendingArray(PendingData.results);
        
                    const CompletedData = await fetchDataForTeam('Collection Approved', 10, 0, userData, search);
                    setCompletedArray(CompletedData.results);
                    setFilteredCompletedArray(CompletedData.results);

                    const cancelledData = await fetchDataForTeam('Pending Balance', 10, 0, userData, search);
                    setCancelledArray(cancelledData.results);
                    setFilteredCancelledArray(cancelledData.results);
                    
            } catch (error) {
                console.error('Error fetching pending data:', error);
            }
        };
        fetchPendingData(); 
    }, [search, userData]); 


    const fetchData = async () => {
        setOrdersLoading(true);
        setSearch('')

        console.log("SCREEN NAME IS =======>>>>>>>>>",screenName)

        try {
            if (userData) {
                const pendingData = await fetchDataForTeam('Pending', 10, 0, userData, '');
                const completedData = await fetchDataForTeam('Collection Approved', 10, 0, userData, '');
                const cancelledData = await fetchDataForTeam('Pending Balance', 10, 0, userData, '');
                
                    setPendingArray(pendingData.results);
                    setCompletedArray(completedData.results);
                    setCancelledArray(cancelledData.results);
        
                    setFilteredPendingArray(pendingData.results);
                    setFilteredCompletedArray(completedData.results);
                    setFilteredCancelledArray(cancelledData.results);
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
            const newPendingData = await fetchDataForTeam('Pending', 10, pendingOffset, userData, '');
            if(newPendingData.results.length<=0){
                Toast.show("Reached End", Toast.LONG);
            }else{
              setPendingArray((prevPendingArray) => [...prevPendingArray, ...newPendingData.results]);
              setFilteredPendingArray((prevPendingArray) => [...prevPendingArray, ...newPendingData.results]);
              setPendingOffset((prevOffset) => prevOffset + 10);
            }
            }
            else if(screenName === 'Approved'){
                console.log("FROM APPROVEDDD")
            const newCompletedData = await fetchDataForTeam('Collection Approved', 10, completedOffset, userData, '');
            if(newCompletedData.results.length<=0){
                Toast.show("Reached End", Toast.LONG);
            }else{
              setCompletedArray((prevCompletedArray) => [...prevCompletedArray, ...newCompletedData.results]);
              setFilteredCompletedArray((prevCompletedArray) => [...prevCompletedArray, ...newCompletedData.results]);
              setCompletedOffset((prevOffset) => prevOffset + 10);
            }
            }
        else {
            const newCancelledData = await fetchDataForTeam('Pending Balance', 10, cancelledOffset, userData, search);
            console.log("FROM REJECTEDDDD")
            if(newCancelledData.results.length<=0){
                Toast.show("Reached End", Toast.LONG);
            }else{
            setCancelledArray((prevCancelledArray) => [...prevCancelledArray, ...newCancelledData.results]);
            setFilteredCancelledArray((prevCancelledArray) => [...prevCancelledArray, ...newCancelledData.results]);
            setCancelledOffset((prevOffset) => prevOffset + 10);
            }
        }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }
    
    const renderItem = ({ item }) => {

        return (
            <TouchableOpacity
                style={styles.elementsView}
                activeOpacity={0.8}
                onPress={() => {
                    navigation.navigate("OrderReviewDetails", { orderDetails: item, screen: 'SO' });
                    setSelectedOption("all");
                }}
            >
                <View style={{ flexDirection: "row", justifyContent: "center" }}>
                <View style={{ justifyContent: "center", alignItems: "center", paddingRight: '5%' }}>
  {item?.is_production === true ? (
    <Ionicons name="settings-outline" size={43} color={Colors.primary} />
  ) : item?.status === "Pending" ? (
    <Entypo name="back-in-time" size={40} color={Colors.primary} />
  ) : item?.status === "Collection Approved" ? (
    <AntDesign name="checkcircleo" size={40} color="green" />
  ) : (
    <AntDesign name="closecircleo" size={40} color="tomato" />
  )}
</View>


                    <View
                        style={{
                            flex: 1,
                            paddingHorizontal: '2%',
                            borderColor: 'grey',
                        }}
                    >
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
                                {item?.name} ({item?.assignee_name}-{item?.assigne_to})
                            </Text>

                        </View>

                        <View style={{ flexDirection: "row",marginTop:'1%' ,flex:1}}>
                                <Text
                                    style={{
                                        color: "black",
                                        fontSize: 13,
                                        fontFamily: "AvenirNextCyr-Bold",
                                    }}
                                >
                                    Company :
                                </Text>
                                <Text
                                    style={{
                                        color: "black",
                                        fontSize: 13,
                                        fontFamily: "AvenirNextCyr-Bold",
                                        flex:1
                                    }}
                                    numberOfLines={2}
                                > {item?.company_name}</Text>
                            </View>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                marginTop: 5,
                            }}
                        >
             <Text style={{ color: 'black', fontSize: 12, fontFamily: "AvenirNextCyr-Medium" }}>Created :{item?.created_by}</Text>

                            <Text
                                style={{
                                    color: "black",
                                    fontSize: 12,
                                    fontFamily: "AvenirNextCyr-Medium",
                                }}
                            >
                                {/* {item?.created_at.split("T")[0]} */}
                                {ConvertDateTime(item?.created_at).formattedDate} {ConvertDateTime(item?.created_at).formattedTime}
                            </Text>
                        </View>

                        <View
                            style={{
                                justifyContent: "space-between",
                                flexDirection: "row",
                                marginTop: 5,
                            }}
                        >
                            <View style={{ flexDirection: "row" }}>
                                
                                <Text
                                    style={{
                                        color: "black",
                                        fontSize: 12,
                                        fontFamily: "AvenirNextCyr-Medium",
                                    }}
                                >
                                    Total SKUs:{" "}
                                </Text>
                                <Text
                                    style={{
                                        color: "black",
                                        fontSize: 12,
                                        fontFamily: "AvenirNextCyr-Medium",
                                    }}
                                >
                                    {Number(item?.product_list?.length)}
                                </Text>
                            </View>

                         

                            <View style={{ flexDirection: "row" }}>
                                <Text
                                    style={{
                                        color: "black",
                                        fontSize: 12,
                                        fontFamily: "AvenirNextCyr-Medium",
                                    }}
                                >
                                    Total Price:{" "}
                                </Text>
                                <Text
                                    style={{
                                        color: "black",
                                        fontSize: 12,
                                        fontFamily: "AvenirNextCyr-Medium",
                                    }}
                                >
                                                              {item?.total_price? 
         new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(item?.total_price)) : 
         new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(0)
       }
                                </Text>
                            </View>
                        </View>
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
        <LinearGradient
            colors={Colors.linearColors}
            start={Colors.start}
            end={Colors.end}
            locations={Colors.location}
            style={{ flex: 1 }}
        >
      <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginVertical:'6%'}}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ paddingLeft: "4%" }}
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
            color: "white",
          }}
        >
          Sales Order Review
        </Text>
        <TouchableOpacity style={{ width: "15%" }}></TouchableOpacity>
      </View>

            <Searchbar
                style={{
                    marginHorizontal: "4%",
                    marginBottom: "4%",
                    backgroundColor: "#F3F3F3",
                    fontFamily: "AvenirNextCyr-Medium",
                }}
                placeholder="Search Order"
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
                    screenOptions={{
                        tabBarActiveTintColor: Colors.primary,
                        tabBarInactiveTintColor: "gray",
                        tabBarLabelStyle: { fontSize: 12, fontWeight: "bold" },
                        tabBarIndicatorStyle: {
                            backgroundColor: Colors.primary,
                        },
                    }}
                >
                    <Tab.Screen name="Pending" 
                    listeners={{
                     tabPress: () => {setScreenName('Pending');fetchData()},
                     swipeStart: () => {setScreenName('Approved');fetchData();console.log("pending---->approved")},
                     swipeEnd: () =>{setScreenName('Pending');fetchData();console.log("back to pending")}
                      }}>
                        {() => <Pending pendingArray={pendingArray} navigation={navigation} fetchData={fetchData} ordersLoading={ordersLoading} renderItem={renderItem} loading={loading} handleLoadMore={handleLoadMore}/>}
                    </Tab.Screen>
                    <Tab.Screen name="Approved" listeners={{
                     tabPress: () => {setScreenName('Approved'); fetchData()},
                     swipeStart: () => {setScreenName('Rejected');fetchData();console.log("approved---->rejected")},
                    swipeEnd: () => {setScreenName('Approved');fetchData();console.log("back to approved")}
                      }}>
                        {() => <Delivered completedArray={completedArray} navigation={navigation} ordersLoading={ordersLoading} renderItem={renderItem} loading={loading} handleLoadMore={handleLoadMore}/>}
                    </Tab.Screen>
                    <Tab.Screen name="Rejected" listeners={{
                     tabPress: () => {setScreenName('Rejected'); fetchData();},
                     swipeEnd: () => {setScreenName('Rejected');fetchData();console.log("back to rejected")}
                      }}>
                        {() => <Canceled cancelledArray={cancelledArray} navigation={navigation} ordersLoading={ordersLoading} renderItem={renderItem} loading={loading} handleLoadMore={handleLoadMore}/>}
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
    );
};

export default OrderReview;

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
