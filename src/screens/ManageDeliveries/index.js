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
import React, { useState, useEffect, useContext,useMemo } from "react";
import Colors from "../../constants/Colors";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import {
    NavigationContainer,
    useIsFocused,
    useRoute,
} from "@react-navigation/native";
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Entypo from "react-native-vector-icons/Entypo";
import { AuthContext } from "../../Context/AuthContext";
import globalStyles from "../../styles/globalStyles";
import LinearGradient from "react-native-linear-gradient";
import { Searchbar, RadioButton ,Button, ActivityIndicator,} from "react-native-paper";
import moment from "moment";
import DatePicker from "react-native-date-picker";
import Toast from "react-native-simple-toast";
import OrdersSkeleton from "../Skeleton/OrdersSkeleton";
import { useFocusEffect } from "@react-navigation/native";
import { MaskedTextInput } from 'react-native-masked-text';
import { fetchDataForManageStatus } from "./helper";
import Ionicons from "react-native-vector-icons/Ionicons";


const ManageDeliveries = ({ navigation,route }) => {
    const { Screen ,screenNameP ,typeP ,type1P,type2P} = route.params;
    const { ordersLoading, setOrdersLoading, userData, dealerData } =
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
    const [pickUp, setPickUp] = useState([]);

    const [filteredPendingArray, setFilteredPendingArray] = useState([]);
    const [filteredCompletedArray, setFilteredCompletedArray] = useState([]);
    const [filteredCancelledArray, setFilteredCancelledArray] = useState([]);
    const [filteredPickUp, setFilteredPickUp] = useState([]);
    const [screenName, setScreenName] = useState(screenNameP);
    const [type, setType] = useState(typeP);
    const [type1, setType1] = useState(type1P);
    const [type2, setType2] = useState(type2P);

    const [loadingMore, setLoadingMore] = useState(false);
    const[ConfirmedOffset,setConfirmedOffset]=useState(10);
    const[Delivery_AssignedOffset,setDelivery_AssignedOffset]=useState(10);
    const[TransitOffset,setTransitOffset]=useState(10);
    const[DeliveredOffset,setDeliveredOffset]=useState(10);
    const [loadingPickUp, setLoadingPickUp] = useState(false);
    const [loadingPending, setLoadingPending] = useState(false);
    const [loadingCompleted, setLoadingCompleted] = useState(false);
    const [loadingCancelled, setLoadingCancelled] = useState(false);
    const [debouncedSearch, setDebouncedSearch] = useState(search);


    useEffect(() => {
      const timer = setTimeout(() => {
        setDebouncedSearch(search);
      }, 10); // Delay API call until user stops typing

      return () => clearTimeout(timer);
    }, [search]);
    
    useEffect(() => {
        if (type === 'Canceled') {
          if (debouncedSearch !== '') {
            fetchcancleSearch(); // Call API when searching
          } else {
            fetchcancle(); // Reset when search is cleared
          }
        }
      }, [debouncedSearch, type]); 
      

    useFocusEffect(
        React.useCallback(() => {
            console.log('============A========================');
          fetchData(screenName);
        }, [userData ,screenNameP,typeP,type1P,type2P])
      );

      const Tab = createMaterialTopTabNavigator();

      const handleStatusPress2 = (status) => {
        setType2(status);
        setSearch('');
      };

const Pending = ({ pendingArray, loadingPending, fetchData, renderItem,loadingMore,handleLoadMore}) => {
    const { ordersLoading, setOrdersLoading, userData } = useContext(AuthContext);

    if (loadingPending) {
        console.log("loadingPending",loadingPending);
        return (
          <OrdersSkeleton />
        );
      }

    return (
        <View style={{ flex: 1, backgroundColor: "white" }}>

           <View style={{ flexDirection: 'row', justifyContent: 'space-even/ly', paddingHorizontal: '5%', paddingVertical: '3%',gap:5}}>
             {['Delivery', 'Pick-Up'].map(status => (
            <TouchableOpacity
              key={status}
              style={[
                styles.statusButton,
                { backgroundColor: type2 === status ? Colors.primary : '#fff' } 
              ]}
              onPress={() => handleStatusPress2(status)}
            >
              <Text style={{ fontFamily: 'AvenirNextCyr-Medium', color: type2 === status ? 'white' : 'black' }}>{status}</Text>
            </TouchableOpacity>
          ))}
        </View>
            <FlatList
                showsVerticalScrollIndicator={false}
                data={pendingArray}
                keyboardShouldPersistTaps="handled"
                renderItem={renderItem}
                ListEmptyComponent={() => (
          <View style={styles.noProductsContainer}>
            <Text style={styles.noProductsText}>No Assigned Orders</Text>
          </View>
        )}
         ListFooterComponent={pendingArray?.length<10?null:(loadingMore?<ActivityIndicator style={{paddingVertical:5}}/>:<Button onPress={handleLoadMore}>Load More</Button>)}/>
        </View>
    );
};


const Delivered = ({ completedArray, loadingCompleted, ordersLoading, renderItem,loadingMore,handleLoadMore }) => {

    if (loadingCompleted) {
        return (
          <OrdersSkeleton />
        );
      }

    return (
        <View style={{ flex: 1, backgroundColor: "white" }}>
            <FlatList
                showsVerticalScrollIndicator={false}
                data={completedArray}
                keyboardShouldPersistTaps="handled"
                renderItem={renderItem}
                ListEmptyComponent={() => (
          <View style={styles.noProductsContainer}>
            <Text style={styles.noProductsText}>No In Transit Orders</Text>
          </View>
        )}
        ListFooterComponent={completedArray?.length<10?null:(loadingMore?<ActivityIndicator style={{paddingVertical:5}}/>:<Button onPress={handleLoadMore}>Load More</Button>)}
            />
        </View>
    );
};


const fetchcancle = async () => {

    setLoadingPickUp(true);
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
            `https://gsidev.ordosolution.com/api/dispatch_cancel_order/?limit=100&offset=0&search_name=&user=${userData.id}&status=Cancel`,
            requestOptions
        );
        const result = await response.json();
        console.log("🚀 ~ fetchcancle ~ result:", result)
        setPickUp(result.results);
        setFilteredPickUp(result.results);
        setLoadingPickUp(false);

    } catch (error) {
        setLoadingPickUp(false);
        console.log("error", error);
    }
};

const fetchcancleSearch = async () => {
    console.log('================Fetch Cancel====================');
    
    setLoading(true); // Start loading but don't clear pickUp immediately

    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${userData.token}`);

    var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
    };

    try {
        const response = await fetch(
            `https://gsidev.ordosolution.com/api/dispatch_cancel_order/?limit=10&offset=0&search_name=${search}&user=${userData.id}&status=Cancel`,
            requestOptions
        );
        const result = await response.json();
        console.log("🚀 ~ fetchcancle ~ result:", result);

        setPickUp(result.results); // Update state AFTER fetching data
        setFilteredPickUp(result.results);
    } catch (error) {
        console.log("error", error);
    } finally {
        setLoading(false); // Stop loading AFTER setting data
    }
};

console.log("load",loading)




   useFocusEffect(
     React.useCallback(() => {
        console.log('============C========================');
       setType('Delivery');
     }, [])
   );

   console.log("check type",type)

    useEffect(() => {
      if (type ==='Canceled'&& search === ''){
        console.log('============CHECK========================');

          fetchcancle();
      }else{ 
          fetchDatastatus(type); 
      }
    }, [type]);
    const handleStatusPress = async (status) => {
        setType(status);
      
        if (status !== 'Canceled') {
          setLoadingPickUp(true);  // Show skeleton loader only for "Delivery" & "Pick-Up"
          await fetchDatastatus(status); // Fetch new data
          setLoadingPickUp(false);  // Hide skeleton after data is loaded
        }
      };
      
  const fetchDatastatus = async (statusType) => {
    setOrdersLoading(true);
    const Data = await fetchDataForManageStatus('Stock Approved', 10, 0, userData, search, statusType);
    setPickUp(Data.results);
    setFilteredPickUp(Data.results);
    setOrdersLoading(false);
  };

  const PickUp = ({ pickUp, loadingPickUp, fetchData, renderItem ,loadingMore,handleLoadMore}) => {
    if (loadingPickUp) {
        return (
          <OrdersSkeleton />
        );
      }

    return (
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', paddingHorizontal: '5%', paddingVertical: '3%',gap:5}}>
          {[ 'Delivery','Pick-Up','Canceled'].map(status => (
            <TouchableOpacity
              key={status}
              style={[
                styles.statusButton,
                { backgroundColor: type === status ? Colors.primary : '#fff' } 
              ]}
              onPress={() => handleStatusPress(status)}
            >
              <Text style={{ fontFamily: 'AvenirNextCyr-Medium', color: type === status ? 'white' : 'black' }}>{status}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {loading ? (
  <OrdersSkeleton />
) : (
  <FlatList
    showsVerticalScrollIndicator={false}
    data={pickUp}
    keyboardShouldPersistTaps="handled"
    renderItem={renderItem}
    ListEmptyComponent={() =>
      <View style={styles.noProductsContainer}>
        <Text style={styles.noProductsText}>No Orders</Text>
      </View>
    }
    ListFooterComponent={
      pickUp?.length < 10
        ? null
        : loadingMore ? (
            <ActivityIndicator style={{ paddingVertical: 5 }} />
          ) : (
            <Button onPress={handleLoadMore}>Load More</Button>
          )
    }
  />
)}

      </View>
    );
  };
  

  const handleStatusPress1 = (status) => {
    setType1(status);
    setSearch('');
    fetchData(status); 
  };

  useEffect(() => {
    console.log('============E========================');
    fetchData('Delivery Assigned');
  }, [type2]);


  useEffect(() => {
    console.log('============F=======================');
    fetchData('Delivered');
  }, [type1]);



  const Canceled = ({ cancelledArray, renderItem, loadingCancelled,loading,loadingMore,handleLoadMore }) => {  

    if (loadingCancelled) {
        return (
          <OrdersSkeleton />
        );
      }



    return (
        <View style={{ flex: 1, backgroundColor: "white" }}>
             <View style={{ flexDirection: 'row', justifyContent: 'space-even/ly', paddingHorizontal: '5%', paddingVertical: '3%',gap:5}}>
             {['Delivered', 'Partially Delivered'].map(status => (
            <TouchableOpacity
              key={status}
              style={[
                styles.statusButton,
                { backgroundColor: type1 === status ? Colors.primary : '#fff' } 
              ]}
              onPress={() => handleStatusPress1(status)}
            >
              <Text style={{ fontFamily: 'AvenirNextCyr-Medium', color: type1 === status ? 'white' : 'black' }}>{status}</Text>
            </TouchableOpacity>
          ))}
        </View>
            <FlatList
                showsVerticalScrollIndicator={false}
                data={cancelledArray}
                keyboardShouldPersistTaps="handled"
                renderItem={renderItem}
                ListEmptyComponent={() => (
          <View style={styles.noProductsContainer}>
            <Text style={styles.noProductsText}>No Delivered Orders</Text>
          </View>
        )}
        ListFooterComponent={cancelledArray?.length < 10?null:(loadingMore?<ActivityIndicator style={{paddingVertical:5}}/>:<Button onPress={handleLoadMore}>Load More</Button>)}
            //keyExtractor={(item) => item.id.toString()}
            />
        </View>
    );
};

console.log('=================search==================');
console.log(search);
console.log('=================type2===================');
console.log(type2);
console.log('=================type1===================');
console.log(type1);
console.log('=================screenName==============');
console.log(screenName);
console.log('=========================================');


    useEffect(() => {
        const fetchPendingData = async () => {
            try {
                if (screenName === 'Confirmed'){
                  Data = await fetchDataForManageStatus('Stock Approved', 10, 0, userData, search,type);
                  console.log("lengthi===========>>>>",Data.results.length);
                  setPickUp(Data.results);
                  setFilteredPickUp(Data.results)
    
                }else if (screenName === 'Delivery Assigned'){
                    console.log('==============Delivery Assigned======================');
                  Data = await fetchDataForManageStatus('Delivery Assigned', 10, 0, userData, search,type2);
                  setPendingArray(Data.results);
                  setFilteredPendingArray(Data.results)
        
                }else if (screenName === 'In Transit'){
                  Data = await fetchDataForManageStatus('In Transit', 10, 0, userData, search,'');
                  setCompletedArray(Data.results);
                  setFilteredCompletedArray(Data.results)
                }else{
                    console.log("fetchPendingData Running");
                  Data = await fetchDataForManageStatus(type1, 10, 0, userData, search,'');
                  setCancelledArray(Data.results);
                  ~setFilteredCancelledArray(Data.results)
                }
               
            } catch (error) {
                console.error('Error fetching pending data:', error);
            }
        };
            fetchPendingData(); 
    }, [search]);



    const fetchData = async (screenName) => {
        console.log("🚀 ~ fetchData ~ screenName:", screenName);
        
        setSearch('');
        try {
          let Data;
    
          switch (screenName) {
            case 'Confirmed':
              setLoadingPickUp(true);
              Data = await fetchDataForManageStatus('Stock Approved', 10, 0, userData, search, type);
              setPickUp(Data.results);
              setFilteredPickUp(Data.results);
              setLoadingPickUp(false);
              break;
    
            case 'Delivery Assigned':
              setLoadingPending(true);
              Data = await fetchDataForManageStatus('Delivery Assigned', 10, 0, userData, search, type2);
              setPendingArray(Data.results);
              setFilteredPendingArray(Data.results);
              setLoadingPending(false);
              break;
    
            case 'In Transit':
              setLoadingCompleted(true);
              Data = await fetchDataForManageStatus('In Transit', 10, 0, userData, search, '');
              setCompletedArray(Data.results);
              setFilteredCompletedArray(Data.results);
              setLoadingCompleted(false);
              break;
    
            case 'Delivered':
              setLoadingCancelled(true);
              console.log("fetchData Running");
              Data = await fetchDataForManageStatus(type1, 10, 0, userData, search, '');
              setCancelledArray(Data.results);
              setFilteredCancelledArray(Data.results);
              setLoadingCancelled(false);
              break;
    
            default:
              break;
          }
        } catch (error) {
          console.error(error);
          // Ensure loading is stopped even if there's an error
          setLoadingPickUp(false);
          setLoadingPending(false);
          setLoadingCompleted(false);
          setLoadingCancelled(false);
        }
    };
    

      const handleLoadMore = async () => {
        setSearch('')
        setLoadingMore(true);

        console.log("SCREEN NAME IS ======>>>>",screenName);
        
            try {
                let Data;
                switch (screenName) {
                  case 'Confirmed':
                    Data = await fetchDataForManageStatus('Stock Approved', 10, ConfirmedOffset, userData, search,type);
                    if(Data.results.length>0){
                    setPickUp((prevData)=>[...prevData,...Data.results]);
                    setFilteredPickUp((prevData)=>[...prevData,...Data.results])
                    setConfirmedOffset((PrevOfset)=>PrevOfset+10)
                    } else{ Toast.show("Reached End",Toast.LONG) }
                    break;
                  case 'Delivery Assigned':
                    Data = await fetchDataForManageStatus('Delivery Assigned', 10, Delivery_AssignedOffset, userData, search,type2);
                    if(Data.results.length>0){
                    setPendingArray((prevData)=>[...prevData,...Data.results]);
                    setFilteredPendingArray((prevData)=>[...prevData,...Data.results])
                    setDelivery_AssignedOffset((PrevOfset)=>PrevOfset+10)
                } else{ Toast.show("Reached End",Toast.LONG) }
                    break;
                  case 'In Transit':
                    Data = await fetchDataForManageStatus('In Transit', 10, TransitOffset, userData, search,'');
                    if(Data.results.length>0){
                    setCompletedArray((prevData)=>[...prevData,...Data.results]);
                    setFilteredCompletedArray((prevData)=>[...prevData,...Data.results])
                    setTransitOffset((PrevOfset)=>PrevOfset+10);
                } else{ Toast.show("Reached End",Toast.LONG) }
                    break;
                  case 'Delivered':
                    console.log("handleLoadMore Running");
                    Data = await fetchDataForManageStatus(type1, 10, DeliveredOffset, userData, search,'');
                    if(Data.results.length>0){
                    setCancelledArray((prevData)=>[...prevData,...Data.results]);
                    setFilteredCancelledArray((prevData)=>[...prevData,...Data.results])
                    setDeliveredOffset((PrevOfset)=>PrevOfset+10);
                } else{ Toast.show("Reached End",Toast.LONG) }
                    break;
                  default:
                    break;
                }
          }
      catch (error) {
          console.error('Error fetching data:', error);
      } finally {
            setLoadingMore(false);
        }
    }
    

    const handleSelect = (option) => {
        setSelectedOption(option);
    };


  
    const handleFilter = () => {
        if (selectedOption === "all") {
            setFilteredCompletedArray(completedArray);
            setFilteredPendingArray(pendingArray);
            setFilteredCancelledArray(cancelledArray);
            setFilteredPickUp(pickUp);

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

            const filteredpickUparray = pickUp.filter((order) => {
                const orderDate = moment(order.created_at).format("YYYY-MM-DD");
                return orderDate === selectedDate;
            });

            setFilteredPickUp(filteredpickUparray);
        }
        setModalVisible(false);
    };

    const clearFilters = () => {
        setSelectedOption("all");
        setFilteredCompletedArray(completedArray);
        setFilteredPendingArray(pendingArray);
        setFilteredCancelledArray(cancelledArray);
        setFilteredPickUp(pickUp);
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


    const renderItem = ({ item }) => {

        return (
            <TouchableOpacity
                style={styles.elementsView}
                activeOpacity={0.8}
                onPress={() => {
                    navigation.navigate(Screen ==='Stock' ? "ManageDelDetailsStock" :"ManageDelDetails", { orderDetails: item, screen: 'SO',screenNameP : screenName,typeP :type ,type1P :type1,type2P : type2 });
                }}
            >
                <View style={{ flexDirection: "row", justifyContent: "center" }}>
                    <View style={{ justifyContent: "center", alignItems: "center", paddingRight: '3%', flex: 1}}>

                          { item?.is_production === true ? (
                                <Ionicons name='settings-outline' size={40} color={Colors.primary} />
                            ) :
                            item?.status === "Delivery Assigned" ? (
                                <MaterialIcons name='assignment-ind' size={35} color={Colors.primary} />
                            ) : item?.status === "In Transit" ? (
                                <MaterialCommunityIcons name='truck-delivery-outline' size={35} color={Colors.primary} />
                            ) :  item?.status === "Partially Delivered" ? (
                                <AntDesign name='checkcircleo' size={40} color='green' />
                            )  :  item?.status === "Delivered" ? (
                                <Ionicons name='checkmark-done-circle-outline' size={50} color='green' />
                            ):  item?.status === "Cancel" ? (
                                <AntDesign name='closecircleo' size={40} color='tomato' />
                            ):  (
                                <AntDesign name='clockcircleo' size={35} color={Colors.primary} />
                            )
                          }

                        <Text
                            style={{
                                color: item?.status === "Delivered" || item?.status === "Partially Delivered" ? 'green' :   item?.status === "Cancel" ? 'tomato' :Colors.primary,
                                fontSize: 12,
                                fontFamily: "AvenirNextCyr-Medium",
                                textAlign: 'center'
                            }}
                        >
                            {item?.status === "Cancel" ? "Canceled" :item?.status}
                        </Text>
                    </View>

                    <View
                        style={{
                            flex: 4,
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

                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                marginTop: 5,
                            }}
                        >
                        {item?.status === "Stock Approved" ||  item?.status == "Cancel" ||  item?.status == "Pending Production" ||  item?.status == "In Production" ||  item?.status == "Production Completed"  ? (
                             <Text style={{ color: 'black', fontSize: 12, fontFamily: "AvenirNextCyr-Medium" }}>Created :{item?.created_by}</Text>
                            ):(
                             <Text style={{ color: 'black', fontSize: 12, fontFamily: "AvenirNextCyr-Medium" }}>Total SKUs :{Number(item?.product_list?.length)}</Text>

                             )}
                            <Text
                                style={{
                                    color: "black",
                                    fontSize: 12,
                                    fontFamily: "AvenirNextCyr-Medium",
                                }}
                            >
                               {new Date(item?.created_at).toLocaleDateString('en-GB')}
                            </Text>
                        </View>

                        <View
                            style={{
                                justifyContent: "space-between",
                                flexDirection: "row",
                                marginTop: 5,
                            }}
                        >

                         {item?.status == "Stock Approved" || item?.status == "Cancel" ||  item?.status == "Pending Production" ||  item?.status == "In Production" ||  item?.status == "Production Completed" ? (
                            <View style={{ flexDirection: "row" }}>
                                <Text
                                    style={{
                                        color: "black",
                                        fontSize: 12,
                                        fontFamily: "AvenirNextCyr-Medium",
                                    }}>
                                    Total SKUs:{" "}
                                </Text>
                                <Text
                                    style={{
                                        color: "black",
                                        fontSize: 12,
                                        fontFamily: "AvenirNextCyr-Medium",
                                    }}>
                                    {Number(item?.product_list?.length)}
                                </Text>
                            </View>
                             ):(
                            <View style={{ flexDirection: "row" }}>
                                <Text
                                    style={{
                                        color: "black",
                                        fontSize: 12,
                                        fontFamily: "AvenirNextCyr-Medium",
                                    }}>
                                    Driver:{" "}
                                </Text>
                                <Text
                                    style={{
                                        color: "black",
                                        fontSize: 12,
                                        fontFamily: "AvenirNextCyr-Medium",
                                    }}>
                                   {item?.transportation_type === "Delivery" 
                                     ? item?.vehicle?.[0]?.driver_name 
                                     : item?.route_driver_name}
                                </Text>
                            </View>
                            )}
                           
                        {item?.status == "Stock Approved"  || item?.status == "Cancel" ||  item?.status == "Pending Production" ||  item?.status == "In Production" ||  item?.status == "Production Completed" ? (    
                            <View style={{ flexDirection: "row" }}>
                                <Text
                                    style={{
                                        color: "black",
                                        fontSize: 12,
                                        fontFamily: "AvenirNextCyr-Medium",
                                    }}>
                                    Total Price:{" "}
                                </Text>
                                <Text
                                    style={{
                                        color: "black",
                                        fontSize: 12,
                                        fontFamily: "AvenirNextCyr-Medium",
                                    }}>
                                    {Number(item?.total_price)? 
                                      new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(item?.total_price)) : 
                                      new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(0)
                                    }
                                </Text>
                            </View>
                          ):(
                       <View style={{ flexDirection: "row" }}>

                                <Text
                                    style={{
                                        color: "black",
                                        fontSize: 12,
                                        fontFamily: "AvenirNextCyr-Medium",
                                    }}>
                                    Vehicle :
                                </Text>
                                <Text
                                    style={{
                                        color: "black",
                                        fontSize: 12,
                                        fontFamily: "AvenirNextCyr-Medium",
                                    }}>
                                      {item?.transportation_type === "Delivery" 
        ? item?.vehicle?.[0]?.registration_number 
        : item?.route_vehicle_no}
                                </Text>
                            </View>

                            )}
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

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
                   {Screen==='Stock' ? 'Dispatch Details': 'Manage Deliveries'}
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
                    name="PickUp"
                    listeners={{
                        tabPress: async () => {
                            setLoadingPickUp(true); // Start loading before fetching
                            setScreenName('Confirmed');
                            await fetchData('Confirmed'); 
                            await fetchcancle(); // Ensure data is fetched before removing loader
                            setLoadingPickUp(false); // Stop loading
                        }
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
                        <PickUp
                            pickUp={filteredPickUp}
                            navigation={navigation}
                            fetchData={fetchData}
                            renderItem={renderItem}
                            loading={ordersLoading}
                            loadingMore={loadingMore}
                            handleLoadMore={handleLoadMore}
                            loadingPickUp={loadingPickUp}
                        />
                    )}
                </Tab.Screen>

                 <Tab.Screen
                    name="Pending"
                    listeners={{
                        tabPress: () => {setScreenName('Delivery Assigned');fetchData('Delivery Assigned')}
                         }}
                    options={{
                        title: "Assigned",
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
                            loading={ordersLoading}
                            loadingMore={loadingMore}
                            handleLoadMore={handleLoadMore}
                            loadingPending={loadingPending}
                        />
                    )}
                </Tab.Screen>
                {/* Pass 'pendingArray' as a prop to the Pending component */}

                {/* Pass 'completedArray' as a prop to the Delivered component */}
                <Tab.Screen
                    name="Delivered"
                    listeners={{
                        tabPress: () => {setScreenName('In Transit');fetchData('In Transit')}
                         }}
                    options={{
                        title: "In Transit",
                        tabBarLabelStyle: {
                            fontFamily: "AvenirNextCyr-Medium",
                            fontWeight: 'bold',
                            textTransform: "capitalize",
                        },
                    }}
                >
                    {() => <Delivered completedArray={filteredCompletedArray} navigation={navigation} renderItem={renderItem} loading={ordersLoading}  loadingMore={loadingMore} handleLoadMore={handleLoadMore}
                    loadingCompleted={loadingCompleted}/>}
                </Tab.Screen>

                {/* Pass 'cancelledArray' as a prop to the Canceled component */}
                <Tab.Screen
                    name="Canceled"
                    listeners={{
                        tabPress: () => {setScreenName('Delivered');fetchData('Delivered')}
                         }}
                    options={{
                        title: "Delivered",
                        tabBarLabelStyle: {
                            fontFamily: "AvenirNextCyr-Medium",
                            fontWeight: 'bold',
                            textTransform: "capitalize",
                        },

                    }}
                >
                    {() => <Canceled cancelledArray={filteredCancelledArray} navigation={navigation} renderItem={renderItem}  loading={ordersLoading}  loadingMore={loadingMore} handleLoadMore={handleLoadMore}
                    loadingCancelled={loadingCancelled}/>}
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
                                    height: 50
                                }}>
                                <TouchableOpacity
                                    style={styles.button}
                                    activeOpacity={0.8}
                                    onPress={handleFilter}>
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

export default ManageDeliveries;

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
        padding: 18,
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
    noProductsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
      },
      noProductsText: {
        fontSize: 16,
        color: 'gray',
        fontFamily: "AvenirNextCyr-Medium",
        textAlign: 'center',
        marginTop: '25%',
      },
      statusButton:
      {
        borderWidth: 1,
        borderColor: 'black',
        paddingVertical: '1%',
        paddingHorizontal: '2%',
        borderRadius: 20,
        flex:1,
        alignItems:'center'
      }
});
