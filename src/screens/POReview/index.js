import {
  StyleSheet, Text, View, Image, TextInput, RefreshControl,TouchableOpacity, FlatList, Alert, Pressable,
  ToastAndroid, Modal,
  ScrollView
} from 'react-native'
import Toast from "react-native-simple-toast";
import LinearGradient from 'react-native-linear-gradient';

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
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { checkVersion } from "react-native-check-version";
import { Searchbar, RadioButton, Button,ActivityIndicator} from "react-native-paper";
import OrdersSkeleton from '../Skeleton/OrdersSkeleton';
import { useFocusEffect } from "@react-navigation/native";
import { fetchDataForRFQ } from '../PurchaseOrder/helper';
import { AnimatedFAB } from "react-native-paper";

const Tab = createMaterialTopTabNavigator();
 
const Pending = ({ fetchData, pendingOrders, loading, renderItem,handleLoadMore,LoadingMore}) => {  //CONFIRMED

  if (loading) {
    // Render loading indicator or other loading state
    return (
      <OrdersSkeleton />
    );
  }

  const { userData ,} = useContext(AuthContext);

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>

      <FlatList
        showsVerticalScrollIndicator={false}
        data={pendingOrders}
        keyboardShouldPersistTaps='handled'
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={() => (
          <View style={styles.noProductsContainer}>
            <Text style={styles.noProductsText}>No Pending Orders</Text>
          </View>
        )}
        onEndReachedThreshold={0.3}
      //keyExtractor={(item) => item.id.toString()}
      ListFooterComponent={pendingOrders?.length < 10 ? null : ( LoadingMore ? (
    <ActivityIndicator style={{ paddingVertical: 5 }} /> ) : ( <Button onPress={()=>handleLoadMore("Confirmed")}>Load More</Button>)
    )}
      />
    </View>
  );
}

const Shipped = ({ navigation, route, fetchData, transitOrders, renderItem, loading, handleLoadMore,LoadingMore}) => {  //PENDING

  if (loading) {
    // Render loading indicator or other loading state
    return (
      // <ActivityIndicator
      //   size="large"
      //   color={Colors.primary}
      //   style={{ flex: 1 }}
      // />
      <OrdersSkeleton />
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>

      <FlatList
        showsVerticalScrollIndicator={false}
        data={transitOrders}
        keyboardShouldPersistTaps='handled'
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={() => (
          <View style={styles.noProductsContainer}>
            <Text style={styles.noProductsText}>No Shipped Orders</Text>
          </View>
        )}
        ListFooterComponent={transitOrders?.length < 10 ? null : ( LoadingMore ? (
    <ActivityIndicator style={{ paddingVertical: 5 }} /> ) : ( <Button onPress={()=>handleLoadMore("Pending")}>Load More</Button>)
    )}
      //keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}




const Cancelled = ({ navigation, route, cancelledOrders, renderItem, loading, handleLoadMore,LoadingMore}) => {  //CANCELLED


  if (loading) {
    // Render loading indicator or other loading state
    return (
      <OrdersSkeleton />
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>


      <FlatList
        showsVerticalScrollIndicator={false}
        data={cancelledOrders}
        keyboardShouldPersistTaps='handled'
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={() => (
          <View style={styles.noProductsContainer}>
            <Text style={styles.noProductsText}>No Cancelled Orders</Text>
          </View>
        )}
        ListFooterComponent={cancelledOrders?.length < 10 ? null : ( LoadingMore ? (
    <ActivityIndicator style={{ paddingVertical: 5 }} /> ) : ( <Button onPress={handleLoadMore}>Load More</Button>)
    )}
      />
    </View>
  );
}

const POReview = ({ navigation }) => {
  const [selectedOption, setSelectedOption] = useState("all");
  const [modalVisible, setModalVisible] = useState(false);

  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [LoadingMore,setLoadingMore]=useState(false)
  const [refreshing, setRefreshing] = React.useState(false);
  const [date, setDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  const [confirmedOrders, setConfirmedOrders] = useState([]);
  const [filteredConfirmedOrders, setFilteredConfirmedOrders] = useState([]);

  const [transitOrders, setTransitOrders] = useState([]);
  const [filteredTransitOrders, setFilteredTransitOrders] = useState([]);

  const [deliveredOrders, setDeliveredOrders] = useState([]);
  const [filteredDeliveredOrders, setFilteredDeliveredOrders] = useState([]);

  const [cancelledOrders, setCancelledOrders] = useState([]);
  const [filteredCancelledOrders, setFilteredCancelledOrders] = useState([]);

  const [screenName, setScreenName] = useState('Pending');
  const [type, setType] = useState('PT');
  const [status, setStatus] = useState('Pending');

  const [pendingOffset,setPendingOffset]=useState(10);
  const [confirmedOffset,setConfirmedOffset]=useState(10);
  const [deliveredOffset,setDeliveredOffset]=useState(10);
  const [cancelledOffset,setcancelledOffset]=useState(10);

  const {
    userData,setOrdersLoading,ordersLoading
  } = useContext(AuthContext);


  useFocusEffect(
    React.useCallback(() => {

      if (userData.token){
        fetchData('Pending');
      }
    }, [userData])
  );

  const handleStatusPress = (statusss) => {

    setStatus(statusss);
    setSearch('');
    fetchData("Delivered",statusss);
  };

    
const Delivered = ({ navigation, route, deliveredOrders, renderItem, loading, handleLoadMore,LoadingMore }) => {  //RETURNED

  if (loading) {
    return (
      <OrdersSkeleton />
    );
  }
  return (

    <View style={{ flex: 1, backgroundColor: "white" }}>
    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', paddingHorizontal: '5%', paddingVertical: '3%' }}>
    {['Pending', 'Confirmed'].map((item) => (
<TouchableOpacity
  key={item}
  style={[
    styles.statusButton,
    { backgroundColor: item === status ? Colors.primary : '#fff' }
  ]}
  onPress={() => handleStatusPress(item)}
>
  <Text style={{ fontFamily: 'AvenirNextCyr-Medium', color: item === status ? 'white' : 'black' }}>
    {item}
  </Text>
</TouchableOpacity>
))}
    </View>
    <FlatList
      showsVerticalScrollIndicator={false}
      data={deliveredOrders}
      //data={staticData}
      keyboardShouldPersistTaps="handled"
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      //renderItem={({ item }) => <Text>{item.name}</Text>}
      ListEmptyComponent={() => (
        <View style={styles.noProductsContainer}>
          <Text style={styles.noProductsText}>No Orders</Text>
        </View>
      )}
      ListFooterComponent={deliveredOrders?.length<10?null:( LoadingMore ? (
    <ActivityIndicator style={{ paddingVertical: 5 }} /> ) : ( <Button onPress={()=>handleLoadMore("Delivered")}>Load More</Button>))
    }
    />
  </View>
  );
}


// useEffect(() => {
  const fetchPendingData = async () => {
      try {
          if (screenName === 'Confirmed'){
              const cData = await fetchDataForRFQ('Confirmed', 10, 0, userData, search, 'PO');
              console.log('Calling---------------2------------->')
              setConfirmedOrders(cData.results);
              setFilteredConfirmedOrders(cData.results);

          }else if (screenName === 'Pending'){
              const tData = await fetchDataForRFQ('Pending', 10, 0, userData, search,'PO');
              console.log('Calling---------------3------------->')
              setTransitOrders(tData.results);
              setFilteredTransitOrders(tData.results);
  
          }else if (screenName === 'Delivered'){
              const dData = await fetchDataForRFQ(status, 10, 0, userData, search,'RT');
              console.log('Calling---------------4------------->')
               setDeliveredOrders(dData.results);
               setFilteredDeliveredOrders(dData.results);
          }else{
              const ccData = await fetchDataForRFQ('Cancel', 10, 0, userData, search,'PO');
              console.log('Calling---------------5------------->')
              setCancelledOrders(ccData.results);
              setFilteredCancelledOrders(ccData.results);
          }
         
      } catch (error) {
          console.error('Error fetching pending data:', error);
      }
  };
 


useEffect(()=>{
  if (search!== ''){
    fetchPendingData(); 
  }
},[search])


const fetchData = async (screenName,statusz ) => {

setSearch('');
setPendingOffset(10)
setConfirmedOffset(10)
setDeliveredOffset(10)
setcancelledOffset(10)
setOrdersLoading(true);

try {
  let Data;
  switch (screenName) {
    case 'Confirmed':
      Data = await fetchDataForRFQ('Confirmed', 10, 0, userData, search,'PO');
      console.log('Calling---------------6------------->')
      setConfirmedOrders(Data.results);
      setFilteredConfirmedOrders(Data.results);
      break;
    case 'Pending':
      Data = await fetchDataForRFQ('Pending', 10, 0, userData, search,'PO');
      console.log('Calling---------------7------------->')
      setTransitOrders(Data.results);
      setFilteredTransitOrders(Data.results);
      break;
    case 'Delivered':
     //console.log("STATUSSSSS======>>>>>",status);
      Data = await fetchDataForRFQ(statusz, 10, 0, userData, search, 'RT');
      console.log('Calling---------------8------------->')
      setDeliveredOrders(Data.results);
      setFilteredDeliveredOrders(Data.results);
      break;
    case 'Cancel':
      Data = await fetchDataForRFQ('Cancel', 10, 0, userData, search,'PO');
      console.log('Calling---------------9------------->')
      setCancelledOrders(Data.results);
      setFilteredCancelledOrders(Data.results);
      break;
    default:
      break;
  }
} catch (error) {
  console.error(error);
  setOrdersLoading(false);
} finally {
  setOrdersLoading(false);
}
};


  const handleLoadMore = async (screenName) => {
    setLoadingMore(true);
    setSearch('')
    console.log("SCREEN NAME IS ==========>>>",screenName)
    try {
        if (screenName === 'Pending'){
        const newPendingData = await fetchDataForRFQ('Pending', 10, pendingOffset, userData,
           search,'PO');
           console.log('Calling---------------10------------->')
        if(newPendingData.results.length<=0){
            Toast.show("Reached End", Toast.LONG);
        }else{
          setTransitOrders((prevPendingArray) => [...prevPendingArray, ...newPendingData.results]);
          setFilteredTransitOrders((prevPendingArray) => [...prevPendingArray, ...newPendingData.results]);
          setPendingOffset((prevOffset) => prevOffset + 10);
        }
        }
        else if(screenName === 'Confirmed'){
        const newCompletedData = await fetchDataForRFQ('Confirmed', 10, confirmedOffset, userData, search,'PO');
        console.log('Calling---------------11------------->')
        if(newCompletedData.results.length<=0){
            Toast.show("Reached End", Toast.LONG);
        }else{
          setConfirmedOrders((prevCompletedArray) => [...prevCompletedArray, ...newCompletedData.results]);
          setFilteredConfirmedOrders((prevCompletedArray) => [...prevCompletedArray, ...newCompletedData.results]);
          setConfirmedOffset((prevOffset) => prevOffset + 10);
        }
        }
        else if(screenName==="Delivered"){ 
          console.log("DELIVERED OFFSET============>>>>",deliveredOffset)
          console.log("STATUS IS ==========>>>",status)
          console.log("EXISTING DATA LENGTH IS ==========>>>",deliveredOrders.length)
          console.log("FilteredDeliveredOrders length IS ==========>>>",filteredDeliveredOrders.length)
        const newDeliveredData = await fetchDataForRFQ(status, 10, deliveredOffset, userData, search,'RT');
        console.log('Calling---------------12------------->')
        if(newDeliveredData && newDeliveredData.results && newDeliveredData.results.length<=0){
            Toast.show("Reached End", Toast.LONG);
        }else{
         setDeliveredOrders((prevDeliveredArray) => [...prevDeliveredArray, ...newDeliveredData.results]);
         setFilteredDeliveredOrders((prevDeliveredArray) => [...prevDeliveredArray, ...newDeliveredData.results]);
         setDeliveredOffset((prevOffset) => prevOffset + 10);
        }
    }
    else{
      const newCancelledData = await fetchDataForRFQ('Cancel', 10, cancelledOffset, userData, search,'PO');
      console.log('Calling---------------13------------->')
      if(newCancelledData.results.length<=0){
          Toast.show("Reached End", Toast.LONG);
      }else{
       setCancelledOrders((prevCancelledArray) => [...prevCancelledArray, ...newCancelledData.results]);
       setFilteredCancelledOrders((prevCancelledArray) => [...prevCancelledArray, ...newCancelledData.results]);
       setcancelledOffset((prevOffset) => prevOffset + 10);
      }

    }

    } catch (error) {
        console.error(error);
    } finally {
        setLoading(false);
        setLoadingMore(false);
    }
}

  const formattedPickerDate = moment(selectedDate, 'MM/DD/YYYY').format('YYYY-MM-DD');

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
    console.log(option);
    setSelectedOption(option)
  };


  const handleFilter = () => {
    if (selectedOption === "all") {
      setFilteredConfirmedOrders(confirmedOrders);
      setFilteredTransitOrders(transitOrders);
      setFilteredDeliveredOrders(deliveredOrders);
      setFilteredCancelledOrders(cancelledOrders);

    } else if (selectedOption === "custom") {
      const filteredconfirmedorders = confirmedOrders.filter((order) => {
        const orderDate = moment(order.created_at).format("YYYY-MM-DD");
        return orderDate === selectedDate;
      });
      setFilteredConfirmedOrders(filteredconfirmedorders);

      const filteredtransitorders = transitOrders.filter((order) => {
        const orderDate = moment(order.created_at).format("YYYY-MM-DD");
        return orderDate === selectedDate;
      });
      setFilteredTransitOrders(filteredtransitorders);

      const filtereddeliveredorders = deliveredOrders.filter((order) => {
        const orderDate = moment(order.created_at).format("YYYY-MM-DD");
        return orderDate === selectedDate;
      });

      setFilteredDeliveredOrders(filtereddeliveredorders);

      const filteredcancelledorders = cancelledOrders.filter((order) => {
        const orderDate = moment(order.created_at).format("YYYY-MM-DD");
        return orderDate === selectedDate;
      });

      setFilteredCancelledOrders(filteredcancelledorders);
    }
    setModalVisible(false);
  };


  const clearFilters = () => {
    setSelectedOption("all");
    setFilteredConfirmedOrders(confirmedOrders);
    setFilteredTransitOrders(transitOrders);
    setFilteredDeliveredOrders(deliveredOrders);
    setFilteredCancelledOrders(cancelledOrders);
  };


  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => { navigation.navigate('POReviewDetails', { orderDetails: item, screen: 'PO', status: type }) }}
        style={styles.elementsView} activeOpacity={0.8}>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            {item.status === 'Cancelled' ? (
              <AntDesign name='closecircleo' size={30} color='red' />
            ) :
              item.status === 'Confirmed' ? (
                  <AntDesign
                    name="checkcircleo"
                  color='#004600'
                  size={30}

                />
              ) :
                item.status === 'Delivered' ? (
                   <MaterialCommunityIcons
                  name="truck-fast-outline"
                    color='#004600'
                    size={30}

                  />
                )
                  : (
                    <MaterialIcons name="access-time" size={30} color='#CC5500' />
                  )}
            <Text style={[{ fontSize: 12, color: 'black', fontFamily: "AvenirNextCyr-Medium", marginTop: 5 }, { color: item.status === 'Cancelled' ? 'red' : (item.status === 'Confirmed' ? '#004600' : (item.status === 'Delivered' ? '#004600' : '#CC5500')) }]}>
              {item.status}
            </Text>
          </View>
          <View style={{
            flex: 1,
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
               {item.name.startsWith("RT")
    ? `${item?.name} (${item?.customer_name} - ${item?.customer_id})`
    : `${item?.name} (${item?.supplier_name} - ${item?.supplier_id})`}
              </Text>

            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
              <Text style={{ color: 'black', fontSize: 12, fontFamily: "AvenirNextCyr-Medium" }}>Created :{item?.created_by}</Text>
              <Text style={{ color: 'black', fontSize: 12, fontFamily: "AvenirNextCyr-Medium" }}>{moment(item?.updated_date).format('DD-MM-YYYY')} {item?.updated_date.split(' ')[1]}</Text>
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

              {
                item?.total_price !== "0.00" &&

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
                                          {Number(item?.total_price)? 
         new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(item?.total_price)) : 
         new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(0)
       }
                </Text>
              </View>
              }
            </View>

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
          Purchase Order Review
        </Text>
        <TouchableOpacity
          // onPress={() => {
          //   setModalVisible(true);
          // }}
        >
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


<Tab.Navigator
style={{ borderTopLeftRadius: 20, borderTopRightRadius: 20 }}
screenOptions={{ tabBarIndicatorStyle: { backgroundColor: Colors.primary } }}>
<Tab.Screen
  name="Shipped"
  listeners={{
    tabPress: () => { setScreenName('Pending'); fetchData('Pending');  setType ('PT')},
  }}
  options={{ title: 'Pending', tabBarLabelStyle: { fontFamily: "AvenirNextCyr-Bold", textTransform: 'capitalize' } }}
>
  {(props) => <Shipped {...props} fetchData={fetchData} transitOrders={filteredTransitOrders} renderItem={renderItem} loading={ordersLoading} handleLoadMore={handleLoadMore} LoadingMore={LoadingMore}/>}
</Tab.Screen>
<Tab.Screen
  name="Pending"
  listeners={{
    tabPress: () => { setScreenName('Confirmed'); fetchData('Confirmed'); setType ('PT')},
  }}
  options={{ title: 'Confirmed', tabBarLabelStyle: { fontFamily: "AvenirNextCyr-Bold", textTransform: 'capitalize' } }}
>
  {(props) => <Pending {...props} fetchData={fetchData} pendingOrders={filteredConfirmedOrders} renderItem={renderItem} loading={ordersLoading} handleLoadMore={handleLoadMore} LoadingMore={LoadingMore}/>}
</Tab.Screen>
 <Tab.Screen
  name="Delivered"
  listeners={{
    tabPress: () => { setScreenName('Delivered'); fetchData('Delivered','Pending'); setType ('RT');setStatus(status)},
  }}
  options={{ title: 'Returned', tabBarLabelStyle: { fontFamily: "AvenirNextCyr-Bold", textTransform: 'capitalize' } }}
>
  {(props) => <Delivered {...props} fetchData={fetchData} deliveredOrders={filteredDeliveredOrders} renderItem={renderItem} loading={ordersLoading} handleLoadMore={handleLoadMore} LoadingMore={LoadingMore}/>}
</Tab.Screen> 
<Tab.Screen
  name="Cancelled"
  listeners={{
    tabPress: () => { setScreenName('Cancel'); fetchData('Cancel'); setType ('PT')},
  }}
  options={{ title: 'Cancelled', tabBarLabelStyle: { fontFamily: "AvenirNextCyr-Bold", textTransform: 'capitalize' } }}
>
  {(props) => <Cancelled {...props} fetchData={fetchData} cancelledOrders={filteredCancelledOrders} renderItem={renderItem} loading={ordersLoading} handleLoadMore={handleLoadMore} LoadingMore={LoadingMore}/>}
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
                    onConfirm={(date) => {
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

<AnimatedFAB
icon={() => (
  <Fontisto name="shopping-basket-add" size={23} color="white" />
)}
label={'Create PO'}
style={styles.fabStyle}
borderRadius={60}
fontFamily={'AvenirNextCyr-Medium'}
extended={true}
color={"white"} // Corrected from 'olor' to 'color'
animateFrom={'right'}
onPress={() => {
  navigation.navigate("ViewSupplier", { screen: "CreatePO", screenId: 1 });
}}
/>


    </LinearGradient>
    // </View>
  )
}

export default POReview

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
    marginTop: '3%',
    marginHorizontal: 15,
    paddingTop: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 5,
    ...globalStyles.border,
    backgroundColor: 'white',

  },
  orderContent: {
    flexDirection: 'row',
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
  fabStyle: {
    position: 'absolute',
      right: '4%',
      bottom: '5%',
      backgroundColor: Colors.primary,
      borderRadius: 30,

  },statusButton:
  {
    borderWidth: 1,
    borderColor: 'black',
    paddingVertical: '1%',
    paddingHorizontal: '2%',
    borderRadius: 20,
    flex:1,
    alignItems:'center'
  }
})