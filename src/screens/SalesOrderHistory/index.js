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
import React, { useState, useEffect, useContext, useRef } from "react";
import Colors from "../../constants/Colors";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Entypo from "react-native-vector-icons/Entypo";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { AuthContext } from "../../Context/AuthContext";
import LinearGradient from "react-native-linear-gradient";
import { Searchbar, RadioButton, Button,ActivityIndicator,} from "react-native-paper";
import moment from "moment";
import DatePicker from "react-native-date-picker";
import Toast from "react-native-simple-toast";
import OrdersSkeleton from "../Skeleton/OrdersSkeleton";
import ConvertDateTime from "../../utils/ConvertDateTime";
import { useFocusEffect } from '@react-navigation/native';
import { fetchDataForStatus } from "./helper";

const Tab = createMaterialTopTabNavigator();


const ManagerApp = ({ managerAarry, managerLoading, renderItem, handleLoadMore, loading }) => {
  if (managerLoading) {
    return <OrdersSkeleton />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={managerAarry}
        keyboardShouldPersistTaps="handled"
        renderItem={renderItem}
        keyExtractor={(item) => item?.id.toString()}
        ListEmptyComponent={() =>
          <View style={styles.noProductsContainer}>
            <Text style={styles.noProductsText}>No Manager Approve</Text>
          </View>
        }
        ListFooterComponent={managerAarry?.length < 10 ? null : (
          loading ? (
            <ActivityIndicator style={{ paddingVertical: 5 }} />
          ) : (
            <Button onPress={handleLoadMore}>Load More</Button>
          )
        )}
      />
    </View>
  );
};



const Canceled = ({ cancelledArray,cancelledLoading, fetchDataMain, renderItem, total_count,loading,handleLoadMore }) => {
  // const { cancelledArray } = useContext(AuthContext);
  const { ordersLoading, setOrdersLoading } = useContext(AuthContext);
  const CancelledParams = useRef({ limit: 10, offset: 0 });


  if (cancelledLoading) {
    // Render loading indicator or other loading state
    return (
      <OrdersSkeleton />
    );
  }


  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={cancelledArray}
        keyboardShouldPersistTaps="handled"
        renderItem={renderItem}
        //onEndReached={onEndReached}
        keyExtractor={(item) => item?.id.toString()}
        ListEmptyComponent={() => (
          <View style={styles.noProductsContainer}>
            <Text style={styles.noProductsText}>No Cancelled Orders</Text>
          </View>
        )}
        ListFooterComponent={cancelledArray?.length < 10 ? null : ( loading ? (
          <ActivityIndicator style={{ paddingVertical: 5 }} /> ) : ( <Button onPress={handleLoadMore}>Load More</Button>))}
      />
    </View>
  );
};

const SalesOrderHistory = ({ navigation ,route}) => {
  const { ordersLoading, setOrdersLoading, userData, dealerData } =
    useContext(AuthContext);
  const { screen } = route?.params
  const [search, setSearch] = useState("");
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
  const [managerAarry, setManagerAaary] = useState([]);
  const [filteredPendingArray, setFilteredPendingArray] = useState([]);
  const [filteredCompletedArray, setFilteredCompletedArray] = useState([]);
  const [filteredCancelledArray, setFilteredCancelledArray] = useState([]);
  const [filteredManagerArray, setFilteredManagerArray] = useState([]);
  const [pendingTotalCount, setPendingTotalCount] = useState(0);
  const [completedTotalCount, setCompletedTotalCount] = useState(0);
  const [cancelledTotalCount, setCancelledTotalCount] = useState(0);
  const [managerTotalCount, setManagerTotalCount] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState('Pending');
  const [selectedStatus1, setSelectedStatus1] = useState('Delivered');
  const [filteredData, setFilteredData] = useState([]);
  const [filteredData1, setFilteredData1] = useState([]);

  const [Pendingoffset, setPendingOffset] = useState(10);
  const [Deliveredoffset, setDeliveredOffset] = useState(10);
  const [Cancelledoffset, setCancelledoffset] = useState(10);
  const [ManagerOffset, setManagerOffset] = useState(10);
  const [offset, setOffset] = useState(0);
  const [screenName,setScreenName]=useState("Pending");
  const [pendingLoading,setPendingLoading]=useState("");
  const [managerLoading,setManagerLoading]=useState("");
  const [completedLoading,setCompletedLoading]=useState("");
  const [cancelledLoading,setCancelledLoading]=useState("");



  useFocusEffect(
    React.useCallback(() => {
      setSelectedStatus('Pending')
      setSelectedStatus1('Delivered')
      fetchDataMain(10, 0);
      // console.log("USE FOCUS EFFECT IS RUNNINGGG")
    }, [])
);

  const handleStatusPress = async (status) => {
    setSelectedStatus(status);
    setSearch('');
    setOrdersLoading(true);
    const pendingResult = await fetchDataForStatus(status, 10, 0, userData, '');
    // console.log("STATUS IS ======>>>",selectedStatus);
    setFilteredData(pendingResult.results);
    setPendingArray(pendingResult.results);
    setFilteredPendingArray(pendingResult.results);
    setOffset(10); 
    // console.log("handleStatusPress IS RUNNINGGG")
    setOrdersLoading(false);
  };


  useEffect(()=>{
    const searchData = async () => {
      // console.log("fetchDataMain IS RUNNINGGG");
      setOrdersLoading(true);
      try {
        let pendingResult, deliveredResult, cancelResult, managerApp;
    
        if (screenName === "Pending") {
          pendingResult = await fetchDataForStatus(selectedStatus, 10, 0, userData, search);
          setPendingArray(pendingResult.results);
          setFilteredPendingArray(pendingResult.results);
          setPendingTotalCount(pendingResult.total_count);
        } else if (screenName === "Delivered") {
          deliveredResult = await fetchDataForStatus(selectedStatus1, 10, 0, userData, search);
          setCompletedArray(deliveredResult.results);
          setFilteredCompletedArray(deliveredResult.results);
          setCompletedTotalCount(deliveredResult.total_count);
        } else if (screenName === "Cancel") {
          cancelResult = await fetchDataForStatus("Cancel", 10, 0, userData, search);
          setCancelledArray(cancelResult.results);
          setFilteredCancelledArray(cancelResult.results);
          setCancelledTotalCount(cancelResult.total_count);
        } else if (screenName === "Manager Approve") {
          managerApp = await fetchDataForStatus("Manager Approve", 10, 0, userData, search);
          setManagerAaary(managerApp.results);
          setFilteredManagerArray(managerApp.results);
          setManagerTotalCount(managerApp.total_count);
        }
    
        setOrdersLoading(false);
      } catch (error) {
        console.error("Error fetching sales orders in main:", error);
        setOrdersLoading(false);
      }
    };
    searchData();

  },[search])
  
  
  useEffect(() => {
    setFilteredData(pendingArray);
    setOffset(10); 
    // console.log("useEffect 2 IS RUNNINGGG")
  }, [pendingArray]);


  const Pending = ({ pendingArray, navigation, selectedStatus, filteredData, fetchMoreData, renderItem ,loading,handleLoadMore}) => {
    const { ordersLoading } = useContext(AuthContext);
  
    if (ordersLoading) {
      return <OrdersSkeleton />;
    }
  

    return (
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: '1%', paddingVertical: '2%' ,gap:2}}>
          {['Pending', 'Pending Balance', 'Missing Product','Approved'].map(status => (
            <TouchableOpacity
              key={status}
              style={[
                styles.statusButton,
                { backgroundColor: selectedStatus === status ? Colors.primary : '#fff' ,flex: 1,alignItems:"center",justifyContent:'center',fontSize:10}
              ]}
              onPress={() =>{ handleStatusPress(status); setFilteredData([])}}
            >
              <Text style={{ fontFamily: 'AvenirNextCyr-Medium', color: selectedStatus === status ? 'white' : 'black' }}>{status}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={filteredData}
          keyboardShouldPersistTaps="handled"
          renderItem={renderItem}
          ListEmptyComponent={() => (
            <View style={styles.noProductsContainer}>
              <Text style={styles.noProductsText}>No Orders</Text>
            </View>
          )}
          ListFooterComponent={filteredData?.length < 10 ? null : ( loading ? (
            <ActivityIndicator style={{ paddingVertical: 5 }} /> ) : ( <Button onPress={handleLoadMore}>Load More</Button>))}
        />
      </View>
    );
  };

  const handleStatusPress1 = async (status) => {
    setSearch('');
    setSelectedStatus1(status);
    // console.log("DELIVERED STATUS IS ======>>>",selectedStatus1)
    // console.log("handleStatusPress1 is running")
    const Delivered = await fetchDataForStatus(status, 10, 0, userData, '');
    setFilteredData1(Delivered.results);
    setCompletedArray(Delivered.results); 
    setFilteredCompletedArray(Delivered.results);
    setOffset(10); 
  };

  const Delivered = ({ completedArray, renderItem,completedLoading, total_count,selectedStatus1,loading,handleLoadMore}) => {
    const { ordersLoading } = useContext(AuthContext);
    //console.log("🚀 ~ Delivered ~ ordersLoading:", ordersLoading)
  
    if (completedLoading) {
      // Render loading indicator or other loading state
      return (
        <OrdersSkeleton />
      );
    }
  
  
    return (
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: '1%', paddingVertical: '3%' ,gap:4}}>

          {['Delivered', 'Partially Delivered'].map(status => (
            <TouchableOpacity
              key={status}
              style={[
                styles.statusButton,
                { backgroundColor: selectedStatus1 === status ? Colors.primary : '#fff' ,flex: 1,alignItems:"center",justifyContent:'center'}
              ]}
              onPress={() =>{ handleStatusPress1(status); setFilteredData1([])}}
            >
              <Text style={{ fontFamily: 'AvenirNextCyr-Medium', color: selectedStatus1 === status ? 'white' : 'black' }}>{status}</Text>
            </TouchableOpacity>
          ))}
            </View>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={completedArray}
          keyboardShouldPersistTaps="handled"
          renderItem={renderItem}
          keyExtractor={(item) => item?.id.toString()}
          ListEmptyComponent={() => (
            <View style={styles.noProductsContainer}>
              <Text style={styles.noProductsText}>No Orders</Text>
            </View>
          )}
          ListFooterComponent={completedArray?.length < 10 ? null : ( loading ? (
          <ActivityIndicator style={{ paddingVertical: 5 }} /> ) : ( <Button onPress={handleLoadMore}>Load More</Button>))}
        />
      </View>
    );
  };


  useEffect(() => {
    if (userData && userData.token) {
      fetchDataMain();
      // console.log("useEffect 3 IS RUNNINGGG")
    }
  }, [userData]);

  const fetchDataMain = async () => {
    setOrdersLoading(true); // Set global loading before starting

    try {
        // Set individual loading states
        setPendingLoading(true);
        setManagerLoading(true);
        setCompletedLoading(true);
        setCancelledLoading(true);

        // Fetch data for each status separately
        const [pendingResult, deliveredResult, cancelResult, managerApp] = await Promise.all([
            fetchDataForStatus("Pending", 10, 0, userData, search),
            fetchDataForStatus("Delivered", 10, 0, userData, search),
            fetchDataForStatus("Cancel", 10, 0, userData, search),
            fetchDataForStatus("Manager Approve", 10, 0, userData, search),
        ]);

        // Update states after fetching
        setPendingArray(pendingResult.results);
        setFilteredPendingArray(pendingResult.results);
        setPendingTotalCount(pendingResult.total_count);
        setPendingLoading(false); // Stop loading for pending

        setManagerAaary(managerApp.results);
        setFilteredManagerArray(managerApp.results);
        setManagerTotalCount(managerApp.total_count);
        setManagerLoading(false); // Stop loading for manager approval

        setCompletedArray(deliveredResult.results);
        setFilteredCompletedArray(deliveredResult.results);
        setCompletedTotalCount(deliveredResult.total_count);
        setCompletedLoading(false); // Stop loading for completed

        setCancelledArray(cancelResult.results);
        setFilteredCancelledArray(cancelResult.results);
        setCancelledTotalCount(cancelResult.total_count);
        setCancelledLoading(false); // Stop loading for cancelled

    } catch (error) {
        console.error("Error fetching sales orders:", error);
    }

    setOrdersLoading(false); // Set global loading to false after everything
};



  const handleLoadMore = async () => {
    try{
      console.log("SETTING LOADING TO TRUE");
    setLoading(true);
    console.log("SCREEN IS ======>>>",screenName)
   if(screenName==="Pending"){
      const pendingResult = await fetchDataForStatus(selectedStatus, 10, Pendingoffset, userData,search);
      if(pendingResult.results.length<=0){
        Toast.show("Reached End", Toast.LONG);
      }else{
        setPendingArray((prevResults)=>[...prevResults,...pendingResult.results]);
        setFilteredPendingArray((prevResults)=>[...prevResults,...pendingResult.results]);
        setPendingOffset((prevOffset)=>prevOffset+10);
      }
    }

   else if(screenName==="Delivered"){
    //console.log("DELIVERED STATUS IS ======>>>",selectedStatus1)
      const deliveredResult = await fetchDataForStatus(selectedStatus1, 10, Deliveredoffset, userData,search);
      if(deliveredResult.results.length<=0){
        Toast.show("Reached End", Toast.LONG);
      }else{
          setCompletedArray((prevResults)=>[...prevResults,...deliveredResult.results]);
          setFilteredPendingArray((prevResults)=>[...prevResults,...deliveredResult.results]);
          setDeliveredOffset((prevOffset)=>prevOffset+10);
        }
      }
      else if(screenName==="Canceled"){
      const cancelResult = await fetchDataForStatus("Cancel", 10, Cancelledoffset, userData,search);
      if(cancelResult.results.length<=0){
      Toast.show("Reached End", Toast.LONG);
      }else{
        setCancelledArray((prevResults)=>[...prevResults,...cancelResult.results]);
        setFilteredCancelledArray((prevResults)=>[...prevResults,...cancelResult.results]);
        setCancelledoffset((prevOffset)=>prevOffset+10);
      }
      }
      else if(screenName==="Manager Approve"){
      const managerApp = await fetchDataForStatus("Manager Approve", 10, ManagerOffset, userData,search);
      if(managerApp.results.length<=0){
      Toast.show("Reached End", Toast.LONG);
      }else{
        setManagerAaary((prevResults)=>[...prevResults,...managerApp.results]);
        setFilteredManagerArray((prevResults)=>[...prevResults,...managerApp.results]);
        setManagerOffset((prevOffset)=>prevOffset+10);
      }
  }}
    catch(err){
      console.error(err);
    }
    finally{
      console.log("SETTING LOADING TO FALSE");
      setLoading(false);
    }
}


  const changeStatus = (orderId) => {
    // Display a confirmation dialog
    Alert.alert("Cancel Order", "Are you sure you want to cancel this order?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "Yes",
        onPress: () => {

          var myHeaders = new Headers();
          myHeaders.append("Content-Type", "application/json");
          myHeaders.append("Authorization", `Bearer ${userData.token}`);

          var raw = JSON.stringify({
            status: "Cancel",
            stages: "Cancelled"
          });

          var requestOptions = {
            method: "PUT",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
          };

          fetch(
            `https://gsidev.ordosolution.com/api/sales_order/${orderId}/`,
            requestOptions
          )
            .then((response) => {
              if (response.status === 200) {
                clearFilters();
                Toast.show("Order cancelled successfully", Toast.LONG);
                fetchDataMain(10, 0);
              }
            })

            .catch((error) => console.log("api error", error));
        },
      },
    ]);
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.elementsView}
        activeOpacity={0.8}
        onPress={() => { navigation.navigate("SalesOrderDetails", { orderDetails: item, screen: 'SO' ,screen2:screen });}}>
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <View style={{ justifyContent: "center", alignItems: "center", paddingRight: '5%' }}>

             { item.status === "Pending Production" ? (
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
            ) : item.status === "Production Complete" ? (
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
             ): item?.is_production === true ? (
                <Ionicons name='settings-outline' size={40} color={Colors.primary} />
             ) :item?.status === "Pending"  ? (
               <Entypo name='back-in-time' size={40} color={Colors.primary} />
             ) : item.status === "Delivered" || item?.status === "Confirmed"? (
               <Ionicons name='checkmark-done-circle-outline' size={50} color='green' />
             ) : item.status === "Manager Approve" ? (
               <MaterialIcons name='pending-actions' size={40} color={Colors.primary} />
             ) : item.status === "Partially Delivered" || item?.status === "Collection Approved"? (
               <AntDesign name='checkcircleo' size={40} color='green' />
             ) : item.status === "Delivery Assigned"? (
               <View style={{borderWidth:2,borderRadius:50 ,borderColor:'#E67E00'}}>
               <MaterialCommunityIcons name='truck' size={30} color='#E67E00' padding={5}/>
               </View>
             ): item.status === "Stock Approved"? (
               <View style={{borderWidth:2,borderRadius:50 ,borderColor:'green'}}>
               <MaterialCommunityIcons name='checkbox-multiple-marked-circle' size={30} color='green' padding={5}/>
               </View>
             ) : item.status === "In Transit"? (
               <View style={{borderWidth:2,borderRadius:50 ,borderColor:'#E67E00'}}>
               <MaterialCommunityIcons name='truck-fast' size={30} color='#E67E00' padding={5}/>
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
            <View style={{ flexDirection: "row", justifyContent: 'space-between', alignItems: 'center' }}>
              <Text
                style={{
                  color: Colors.primary,
                  fontSize: 16,
                  fontFamily: "AvenirNextCyr-Bold",
                  flex: 2,
                  flexWrap: 'wrap',
                }}
              >
                {item?.name} ({item?.assignee_name}-{item?.assigne_to})
              </Text>
              {item?.status !== 'Pending' &&
            
  
   <View style={{
    alignItems: 'center',
    padding: 8,
    borderRadius: 10,
    borderWidth:0.7,
    borderColor:item?.status === 'Pending Production' ? 'purple' :
    item?.status === 'In Production' ? '#fec53d' :
    item?.status === 'Production Completed' ? 'green' :
    item?.status === 'Delivered' ? 'lightyellow' :
    item?.status === 'Manager Approve' ? 'green' :
    item?.status === 'Partially Delivered' ? 'purple' :
    item?.status === 'Delivery Assigned' ? '#318f7d' :
    item?.status === 'Stock Approved' ? 'goldenrod' :
    item?.status === 'In Transit' ? '#1ebbd8' :
    item?.status === 'Manager Reject' ? 'red' :
    item?.status === 'Collection Approved' ? 'orange' :
    '#4a4a57',  // default text color
    backgroundColor: 
        item?.status === 'Pending Production' ? '#e5e4ff' :
        item?.status === 'In Production' ? '#fff3d6' :
        item?.status === 'Production Completed' ? '#d9f7e8' :
        item?.status === 'Delivered' ? 'orange' :
        item?.status === 'Manager Approve' ? '#d9f7e8' :
        item?.status === 'Partially Delivered' ? 'lightpink' :
        item?.status === 'Delivery Assigned' ? '#c9faec' :
        item?.status === 'Stock Approved' ? 'lightgoldenrodyellow' :
        item?.status === 'In Transit' ? '#e4fcfc' :
        item?.status === 'Manager Reject' ? '#fcebef' :
        item?.status === 'Collection Approved' ? 'lightyellow' :
        '#eff2f2'  // default background color
}}>
    <Text style={{
        color: 
            item?.status === 'Pending Production' ? 'purple' :
            item?.status === 'In Production' ? '#fec53d' :
            item?.status === 'Production Completed' ? 'green' :
            item?.status === 'Delivered' ? 'lightyellow' :
            item?.status === 'Manager Approve' ? 'green' :
            item?.status === 'Partially Delivered' ? 'purple' :
            item?.status === 'Delivery Assigned' ? '#318f7d' :
            item?.status === 'Stock Approved' ? 'goldenrod' :
            item?.status === 'In Transit' ? '#1ebbd8' :
            item?.status === 'Manager Reject' ? 'red' :
            item?.status === 'Collection Approved' ? 'orange' :
            '#4a4a57',  // default text color
        fontSize: 12,
        fontFamily: "AvenirNextCyr-Medium"
    }}>
        {item?.status === 'Cancel' ? 'Canceled' : item?.status}
    </Text>
</View>
  }

               {(item?.status === 'Pending' && screen !=='other') && <TouchableOpacity
                style={{ borderColor: 'tomato', borderWidth: 1, borderRadius: 20, paddingHorizontal: '4%', paddingVertical: '1%' }}
                onPress={() => {
                  changeStatus(item.id);
                }}
              >
                <Text
                  style={{
                    color: 'tomato',
                    fontSize: 12,
                    fontFamily: "AvenirNextCyr-Medium",
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>} 
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
                     {item?.total_price ? 
                     new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(item.total_price) : 
                     '₹0'}
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
    setFilteredManagerArray(managerAarry)
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
          Order Logs
        </Text>
        <TouchableOpacity
          // onPress={() => {
          //   setModalVisible(true);
          // }}
        >
          {/* <AntDesign name="filter" size={22} color="white" /> */}
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
        {/* Pass 'pendingArray' as a prop to the Pending component */}
        <Tab.Screen
          name="Pending"
          options={{
            title: "Pending",
            tabBarLabelStyle: {
              fontFamily: "AvenirNextCyr-Medium",
              fontWeight: 'bold',
              textTransform: "capitalize",
            },
          }}
          listeners={{
            tabPress: () => {setScreenName('Pending'); console.log("SCREEN IS SET TO PENDING")},
             }}
        >
          {() => (
           <Pending
           pendingArray={filteredPendingArray}
           navigation={navigation}
           renderItem={renderItem}
           selectedStatus={selectedStatus}
           filteredData={filteredData}
           loading={loading}
           handleLoadMore={handleLoadMore}
          //  fetchMoreData={fetchMoreData}
         />
          )}
        </Tab.Screen>

        {/* Pass 'completedArray' as a prop to the Delivered component */}
        <Tab.Screen
          name="Delivered"
          options={{
            title: "Delivered",
            tabBarLabelStyle: {
              fontFamily: "AvenirNextCyr-Medium",
              fontWeight: 'bold',

              textTransform: "capitalize",
            },
          }}
          listeners={{
            tabPress: () => {setScreenName('Delivered');console.log("SCREEN IS SET TO Delivered")},
             }}
        >
          {() => <Delivered
            completedArray={filteredCompletedArray}
            navigation={navigation}
            renderItem={renderItem}
            total_count={completedTotalCount}
            selectedStatus1={selectedStatus1}
            fetchDataMain={fetchDataMain}
            loading={loading}
            completedLoading={completedLoading}

            handleLoadMore={handleLoadMore}
          />}
        </Tab.Screen>

        {/* Pass 'cancelledArray' as a prop to the Canceled component */}
        <Tab.Screen
          name="Canceled"
          options={{
            title: "Canceled",
            tabBarLabelStyle: {
              fontFamily: "AvenirNextCyr-Medium",
              fontWeight: 'bold',
              textTransform: "capitalize",
            },
          }}
          listeners={{
            tabPress: () => {setScreenName('Canceled');console.log("SCREEN IS SET TO Canceled")},
             }}
        >
          {() =>
            <Canceled
              cancelledArray={filteredCancelledArray}
              navigation={navigation}
              renderItem={renderItem}
              total_count={cancelledTotalCount}
              fetchDataMain={fetchDataMain}
              cancelledLoading={cancelledLoading}

              loading={loading}
              handleLoadMore={handleLoadMore} />
              }
        </Tab.Screen>

        <Tab.Screen
          name="Manager Approve"
          options={{
            title: "Manager Approve",
            tabBarLabelStyle: {
              fontFamily: "AvenirNextCyr-Medium",
              fontWeight: 'bold',
              textTransform: "capitalize",
            },
          }}
          listeners={{
            tabPress: () => {setScreenName('Manager Approve');console.log("SCREEN IS SET TO Approve")},
             }}
        >
          {() =>
            <ManagerApp
              managerAarry={filteredManagerArray}
              navigation={navigation}
              renderItem={renderItem}
              total_count={managerTotalCount}
              fetchDataMain={fetchDataMain}
              loading={loading}
              managerLoading={managerLoading}
              handleLoadMore={handleLoadMore} />}
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

export default SalesOrderHistory;

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
  statusButton:
  {
    borderWidth: 1,
    borderColor: 'black',
    paddingVertical: '1%',
    paddingHorizontal: '1%',
    borderRadius: 20,
  },    noProductsContainer: {
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
});
