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
import React, { useState, useEffect, useContext, useMemo } from "react";
import Colors from "../../constants/Colors";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import {
    NavigationContainer,
    useIsFocused,
    useRoute,
    useNavigation
} from "@react-navigation/native";
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { AuthContext } from "../../Context/AuthContext";
import globalStyles from "../../styles/globalStyles";
import LinearGradient from "react-native-linear-gradient";
import { Searchbar, RadioButton, Button, ActivityIndicator } from "react-native-paper";
import moment from "moment";
import DatePicker from "react-native-date-picker";
import Toast from "react-native-simple-toast";
import OrdersSkeleton from "../Skeleton/OrdersSkeleton";
import ConvertDateTime from "../../utils/ConvertDateTime";
import { useFocusEffect } from "@react-navigation/native";
import { fetchDataForTeam } from "./helper";
import ProductionReviewDetails from "../ProductionReviewDetails";




const Tab = createMaterialTopTabNavigator();

const Pending = React.memo(({ pendingArray,pendingLoading, navigation, fetchData, renderItem,handleLoadMore,loading}) => {
    const { ordersLoading, setOrdersLoading, userData } = useContext(AuthContext);
    if (pendingLoading) {
        return (
            <OrdersSkeleton />
        );
    }

    const handleEndReached = () => {
        console.log('End of the list reached');
       
      };
      
    return (
        <View style={{ flex: 1, backgroundColor: "white" }}>
              {pendingArray?.length === 0 ? (
              <View style={{
                    marginTop:'30%',
        justifyContent: 'center',
        alignItems: 'center'}}>
                    <Text style={{ fontSize: 18,
        color: 'grey',}}>No Pending orders</Text>
                </View>
            ) : (
            <FlatList
                showsVerticalScrollIndicator={false}
                data={pendingArray}
                keyboardShouldPersistTaps="handled"
                renderItem={renderItem}
                onEndReached={handleEndReached}
                onEndReachedThreshold={0.5}
                ListFooterComponent={pendingArray?.length<10?null:(loading?<ActivityIndicator style={{paddingVertical:5}}/>:<Button onPress={handleLoadMore}>Load More</Button>)}//
            />
            )}
        </View>
        
    );
});

const Delivered = React.memo(({ completedArray,completedLoading, navigation, ordersLoading, renderItem,handleLoadMore,loading }) => {
    if (completedLoading) {
        return (
            <OrdersSkeleton />
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: "white" }}>
            {completedArray?.length === 0 ? (
              <View style={{
                    marginTop:'30%',
        justifyContent: 'center',
        alignItems: 'center'}}>
                    <Text style={{ fontSize: 18,
        color: 'grey',}}>No In Production orders</Text>
                </View>
            ) : (
            <FlatList
                showsVerticalScrollIndicator={false}
                data={completedArray}
                keyboardShouldPersistTaps="handled"
                renderItem={renderItem}
                ListFooterComponent={completedArray?.length<10?null:(loading?<ActivityIndicator style={{paddingVertical:5}}/>:<Button onPress={handleLoadMore}>Load More</Button>)}
            //keyExtractor={(item) => item.id.toString()}

            />
            )}
        </View>
    );
});
const Canceled = React.memo(({ cancelledArray,cancelledLoading, navigation, renderItem,handleLoadMore,loading }) => {
    const { ordersLoading, setOrdersLoading } = useContext(AuthContext);
    if (cancelledLoading) {
        return (
            <OrdersSkeleton />
        );
    }
    return (
        <View style={{ flex: 1, backgroundColor: "white" }}>
         {cancelledArray?.length === 0 ? (
              <View style={{
                    marginTop:'30%',
        justifyContent: 'center',
        alignItems: 'center'}}>
                    <Text style={{ fontSize: 18,
        color: 'grey',}}>No Rejected orders</Text>
                </View>
            ) : (
            <FlatList
                showsVerticalScrollIndicator={false}
                data={cancelledArray}
                keyboardShouldPersistTaps="handled"
                renderItem={renderItem}
                ListFooterComponent={cancelledArray?.length<10?null:(loading?<ActivityIndicator style={{paddingVertical:5}}/>:<Button onPress={handleLoadMore}>Load More</Button>)}
            //keyExtractor={(item) => item.id.toString()}
            />
            )}
        </View>
    );
});

const ProductionReview = ({ navigation,route}) => {
    const { ordersLoading, setOrdersLoading, userData, dealerData, token, logout } =
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
    const [screenName, setScreenName] = useState("Pending");
    const [pendingOffset,setPendingOffset]=useState(10);
    const [fromScreen, setFromScreen] = useState('');
    const [approvedOffset,setApprovedOffset]=useState(10);
    const [rejectedOffset,setRejectedOffset]=useState(10);
    const [pendingLoading, setPendingLoading] = useState(false);
    const [completedLoading, setCompletedLoading] = useState(false);
    const [cancelledLoading, setCancelledLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, [screenName]);

    
    useFocusEffect(
        React.useCallback(() => {
            if (userData) {
                fetchPendingData();
            }
        }, [token])
    );


    useEffect(() => {
        fetchPendingData(); 
    }, [search, userData,screenName]);
    const fetchPendingData = async () => {
        console.log("FROM SCREEEN NAME IS ========>>>>>>",fromScreen)
        try {
            // if (screenName === 'Pending'){
                const PData = await fetchDataForTeam('Pending Production', 10, 0, userData, search);
                setPendingArray(PData);
                setFilteredPendingArray(PData);

            // }else if (screenName === 'Delivered'){
                const CData = await fetchDataForTeam('In Production', 10, 0, userData, search);
                setCompletedArray(CData);
                setFilteredCompletedArray(CData);
    
            // }else{
                const CCData = await fetchDataForTeam('Production Completed', 10, 0, userData, search);
                setCancelledArray(CCData);
                setFilteredCancelledArray(CCData);
            //}
           
        } catch (error) {
            console.error('Error fetching pending data:', error);
        }
    };


    const fetchData = async () => {
        setPendingOffset(10);
        setApprovedOffset(10);
        setRejectedOffset(10);
    
        console.log("FROM SCREEN NAME IS ========>>>>>>", fromScreen);
    
        try {
            if (screenName === 'Pending') {
                setPendingLoading(true);
                const pendingData = await fetchDataForTeam('Pending Production', 10, 0, userData, search);
                console.log("🚀 ~ fetchData ~ pendingData:", pendingData);
                setPendingArray(pendingData);
                setFilteredPendingArray(pendingData);
            } 
            else if (screenName === 'Delivered') {
                setCompletedLoading(true);
                const completedData = await fetchDataForTeam('In Production', 10, 0, userData, search);
                console.log("🚀 ~ fetchData ~ completedData:", completedData);
                setCompletedArray(completedData);
                setFilteredCompletedArray(completedData);
            } 
            else {
                setCancelledLoading(true);
                const cancelledData = await fetchDataForTeam('Production Completed', 10, 0, userData, search);
                console.log("🚀 ~ fetchData ~ cancelledData:", cancelledData);
                setCancelledArray(cancelledData);
                setFilteredCancelledArray(cancelledData);
            }
        } catch (error) {
            console.error(error);
        } finally {
            if (screenName === 'Pending') setPendingLoading(false);
            if (screenName === 'Delivered') setCompletedLoading(false);
            if (screenName !== 'Pending' && screenName !== 'Delivered') setCancelledLoading(false);
        }
    };

    
    const handleLoadMore = async ()=>{
        setLoading(true);
        setSearch('')
        try {
            if (screenName === 'Pending'){
            const newPendingData = await fetchDataForTeam('Pending Production', 10, pendingOffset, userData, '');
            if(newPendingData.length<=0){
                Toast.show("Reached End", Toast.LONG);
            }else{
                setPendingArray((prevPendingArray) => [...prevPendingArray, ...newPendingData]);
                setFilteredPendingArray((prevPendingArray) => [...prevPendingArray, ...newPendingData]);
                setPendingOffset((prevOffset) => prevOffset + 10);
            }
            }
            else if(screenName === 'Delivered'){
            const newCompletedData = await fetchDataForTeam('In Production', 10, approvedOffset, userData, '');
            if(newCompletedData.length<=0){
                Toast.show("Reached End", Toast.LONG);
            }else{
            setCompletedArray((prevCompletedArray) => [...prevCompletedArray, ...newCompletedData]);
            setFilteredCompletedArray((prevCompletedArray) => [...prevCompletedArray, ...newCompletedData]);
            setApprovedOffset((prevOffset) => prevOffset + 10);
            }
            }
            else{
            const newCancelledData = await fetchDataForTeam('Production Completed', 10, rejectedOffset, userData, '');
            if(newCancelledData.length<=0){
                Toast.show("Reached End", Toast.LONG);
            }else{
            setCancelledArray((prevCancelledArray) => [...prevCancelledArray, ...newCancelledData]);
            setFilteredCancelledArray((prevCancelledArray) => [...prevCancelledArray, ...newCancelledData]);
            setRejectedOffset((prevOffset) => prevOffset + 10);
            }
        }
        } catch (error) {///
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

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


    const renderItem = ({ item }) => {

        return (
            <TouchableOpacity
                style={styles.elementsView}
                activeOpacity={0.8}
                onPress={() => {
                    navigation.navigate("ProductionReviewDetails", { orderDetails: item, screen: 'SO' });
                    setSelectedOption("all");
                }}
            >
                <View style={{ flexDirection: "row", justifyContent: "center" }}>
                <View style={{ justifyContent: "center", alignItems: "center", paddingRight: '5%' }}>
    {item.status === "Pending Production" ? (
              <View
              style={{
                width: 50,
                height: 50,
                borderRadius: 50, 
                backgroundColor: Colors.lightBackground || 'transparent',
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth:2,
                borderColor:Colors.primary
              }} >
               <FontAwesome name='hourglass-o' size={25} color={Colors.primary} />
               </View>
             ): item.status === "In Production" ? (
              <View
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 50, 
                  backgroundColor: Colors.lightBackground || 'transparent', 
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth:2,
                  borderColor:Colors.primary
                }}
              >
                <FontAwesome name="hourglass-half" size={25} color={Colors.primary} />
              </View>
            ) : item.status === "Production Completed" ? (
              <View
              style={{
                width: 50,
                height: 50,
                borderRadius: 50, 
                backgroundColor: Colors.lightBackground || 'transparent', 
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth:2,
                borderColor:Colors.primary
              }}
            >
              <FontAwesome name='hourglass' size={25} color={Colors.primary} />
              </View>
    ) : (
        <AntDesign name='closecircleo' size={40} color='tomato' />
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

                        <View style={{ flexDirection: "row",marginTop:'1%',}}>
                                <Text
                                    style={{
                                        color: "black",
                                        fontSize: 13,
                                        fontFamily: "AvenirNextCyr-Bold"}}>
                                    Company :
                                </Text>
                                <Text
                                    style={{
                                        color: "black",
                                        fontSize: 13,
                                        fontFamily: "AvenirNextCyr-Bold",
                                        width:'83%',
                                    }}
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
                                    Total SKU:{" "}
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
                                                                   {item.total_price? 
         new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(item.total_price)) : 
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

    const handleFilter = useMemo(() => {
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
    }, [pendingArray, cancelledArray, completedArray,selectedDate,selectedOption]);

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
        // <View style={{ flex: 1, backgroundColor: 'red' }}>
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
                    Sales Order Review
                </Text>
                <TouchableOpacity
              style={{
                flexDirection: "row",
                gap: 15,
              }}
            //   onPress={logoutAlert}
            >
            {/* <MaterialCommunityIcons
                  name="logout"
                  size={30}
                  color={Colors.white}
                />  */}
            </TouchableOpacity>
             

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
            {/* <Text style={{ marginLeft: 50 }}> {topBarData?.count} Results</Text> */}
            <Tab.Navigator
                screenOptions={{
                    tabBarIndicatorStyle: { backgroundColor: Colors.primary }
                }
                }
                style={{ borderTopLeftRadius: 20, borderTopRightRadius: 20 }}
            >
                <Tab.Screen
                    name="Pending"
                    listeners={{
                        tabPress: () => setScreenName('Pending'),
                        // swipeStart: ()=>{setScreenName("Delivered");fetchData();},
                        // swipeEnd: () =>{setScreenName('Pending');fetchData();}
                         }}
                    options={{
                        title: "Pending",
                        tabBarLabelStyle: {
                            fontFamily: "AvenirNextCyr-Medium",
                            fontWeight: 'bold',
                            textTransform: "capitalize",
                        },
                    }}
                >
                    {() => (
                        <Pending
                            pendingArray={filteredPendingArray}
                            navigation={navigation}
                            fetchData={fetchData}
                            renderItem={renderItem}
                            handleLoadMore={handleLoadMore}
                            loading={loading}
                            pendingLoading={pendingLoading}
                        />
                    )}
                </Tab.Screen>

                {/* Pass 'completedArray' as a prop to the Delivered component */}
                <Tab.Screen
                    name="Delivered"
                    listeners={{
                        tabPress: () => setScreenName('Delivered'),
                        //swipeStart: ()=>{setScreenName("Canceled");fetchData();},
                        //swipeEnd: () =>{setScreenName('Delivered');fetchData();}
                         }}
                    options={{
                        title: "In Production",
                        tabBarLabelStyle: {
                            fontFamily: "AvenirNextCyr-Medium",
                            fontWeight: 'bold',

                            textTransform: "capitalize",
                        },
                    }}
                >
                    {() => <Delivered completedArray={filteredCompletedArray} navigation={navigation} renderItem={renderItem} handleLoadMore={handleLoadMore}
                            completedLoading={completedLoading}
                            loading={loading}/>}
                </Tab.Screen>


                <Tab.Screen
                    name="Canceled"
                    listeners={{
                        tabPress: () => setScreenName('Canceled'),
                        //swipeStart: ()=>{setScreenName("Canceled");fetchData();},
                        //swipeEnd: () =>{setScreenName('Delivered');fetchData();}
                         }}
                    options={{
                        title: "Completed",
                        tabBarLabelStyle: {
                            fontFamily: "AvenirNextCyr-Medium",
                            fontWeight: 'bold',

                            textTransform: "capitalize",
                        },
                    }}
                >
                    {() => <Canceled cancelledArray={filteredCancelledArray} navigation={navigation} renderItem={renderItem} handleLoadMore={handleLoadMore}
                           cancelledLoading={cancelledLoading} 
                           loading={loading}/>}
                </Tab.Screen>

                {/* Pass 'cancelledArray' as a prop to the Canceled component */}
             
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

export default ProductionReview;

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
        // elevation: 5,
        // ...globalStyles.border,
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
        // justifyContent: 'space-between',
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
