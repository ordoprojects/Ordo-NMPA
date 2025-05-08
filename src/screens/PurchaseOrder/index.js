import {
  StyleSheet, Text, View, Image, TextInput, RefreshControl,
  ActivityIndicator, TouchableOpacity, FlatList, Alert, Pressable,
  ToastAndroid, Modal,
  ScrollView
} from 'react-native'
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
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { checkVersion } from "react-native-check-version";
import { Searchbar, RadioButton } from "react-native-paper";
import OrdersSkeleton from '../Skeleton/OrdersSkeleton';
import { useFocusEffect } from "@react-navigation/native";
import { fetchDataForRFQ } from './helper';

const Tab = createMaterialTopTabNavigator();

const Pending = ({ fetchData, pendingOrders, loading, renderItem }) => {
  
  const { userData } = useContext(AuthContext);


  if (loading) {
    return (
      <OrdersSkeleton />
    );
  }

  const handleEndReached = () => {
    console.log('End of the list reached');
    // You can call fetchData or any other function here if needed
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={pendingOrders}
        keyboardShouldPersistTaps='handled'
        renderItem={renderItem}
        ListEmptyComponent={() => (
          <View style={styles.noProductsContainer}>
            <Text style={styles.noProductsText}>No Confirmed Orders</Text>
          </View>
        )}
        onEndReached={handleEndReached} 
        onEndReachedThreshold={0.3}
      //keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}

const Shipped = ({ navigation, route, fetchData, transitOrders, renderItem, loading }) => {

  if (loading) {
    return (
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
        ListEmptyComponent={() => (
          <View style={styles.noProductsContainer}>
            <Text style={styles.noProductsText}>No Pending Orders</Text>
          </View>
        )}
      //keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}


const Delivered = ({ navigation, route, deliveredOrders, renderItem, loading }) => {

  if (loading) {
    return (
      <OrdersSkeleton />
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>

      <FlatList
        showsVerticalScrollIndicator={false}
        data={deliveredOrders}
        keyboardShouldPersistTaps='handled'
        renderItem={renderItem}
        ListEmptyComponent={() => (
          <View style={styles.noProductsContainer}>
            <Text style={styles.noProductsText}>No Delivered Orders</Text>
          </View>
        )}
      //keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}


const Cancelled = ({ navigation, route, cancelledOrders, renderItem, loading }) => {

  if (loading) {
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
        ListEmptyComponent={() => (
          <View style={styles.noProductsContainer}>
            <Text style={styles.noProductsText}>No Cancelled Orders</Text>
          </View>
        )}
      />
    </View>
  );
}

const PurchaseOrder = ({ navigation ,route}) => {
  const { types } = route.params;
console.log("types",types)

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

  const [confirmedOrders, setConfirmedOrders] = useState([]);
  const [filteredConfirmedOrders, setFilteredConfirmedOrders] = useState([]);

  const [transitOrders, setTransitOrders] = useState([]);
  const [filteredTransitOrders, setFilteredTransitOrders] = useState([]);

  const [deliveredOrders, setDeliveredOrders] = useState([]);
  const [filteredDeliveredOrders, setFilteredDeliveredOrders] = useState([]);

  const [cancelledOrders, setCancelledOrders] = useState([]);
  const [filteredCancelledOrders, setFilteredCancelledOrders] = useState([]);
  const [screenName, setScreenName] = useState('In Transit');

  console.log("screenName on mount", screenName);


  const {
    userData,setOrdersLoading,ordersLoading
  } = useContext(AuthContext);


  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [userData])
  );

  useEffect(() => {
    const fetchPendingData = async () => {
        try {
            if (screenName === 'Confirmed'){
                const Data = await fetchDataForRFQ('Confirmed', 30, 0, userData, search,types);
                setConfirmedOrders(Data.results);

            }else if (screenName === 'In Transit'){
                const Data = await fetchDataForRFQ('Pending', 30, 0, userData, search,types);
                setTransitOrders(Data.results);
    
            }else if (screenName === 'Delivered'){
                const Data = await fetchDataForRFQ('Delivered', 30, 0, userData, search,types);
                 setDeliveredOrders(Data.results);
            }else{
                const Data = await fetchDataForRFQ('Cancel', 30, 0, userData, search,types);
                setCancelledOrders(Data.results);
            }
           
        } catch (error) {
            console.error('Error fetching pending data:', error);
        }
    };
    fetchPendingData(); 
}, [search, userData]); 


const fetchData = async () => {
  setSearch('');
  setOrdersLoading(true);
  try {
    let Data;
    switch (screenName) {
      case 'Confirmed':
        Data = await fetchDataForRFQ('Confirmed', 30, 0, userData, search,types);
        setConfirmedOrders(Data.results);
        break;
      case 'In Transit':
        Data = await fetchDataForRFQ('Pending', 30, 0, userData, search,types);
        setTransitOrders(Data.results);
        break;
      case 'Delivered':
        Data = await fetchDataForRFQ('Delivered', 30, 0, userData, search,types);
        setDeliveredOrders(Data.results);
        break;
      case 'Cancel':
        Data = await fetchDataForRFQ('Cancel', 30, 0, userData, search,types);
        setCancelledOrders(Data.results);
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

console.log("Transit Orders",transitOrders)
// Call fetchData whenever screenName changes
useEffect(() => {
  fetchData();
}, [screenName, userData]);


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

  useEffect(() => {
    const applySearchFilter = (dataArray, setFilteredArray) => {
      // If there's a search query, filter the dataArray
      if (search) {
        const newData = dataArray.filter(item => {
          const itemData = (item.name ? item.name.toUpperCase() : '') + (item.supplier_name ? item.supplier_name.toUpperCase() : '');
          const queryData = search.toUpperCase();
          return itemData.indexOf(queryData) > -1;
        });

        setFilteredArray(newData);
      } else {
        // If there's no search query, setFilteredArray to the full dataArray
        setFilteredArray(dataArray);
      }
    };

    applySearchFilter(confirmedOrders, setFilteredConfirmedOrders);
    applySearchFilter(transitOrders, setFilteredTransitOrders);
    applySearchFilter(deliveredOrders, setFilteredDeliveredOrders);
    applySearchFilter(cancelledOrders, setFilteredCancelledOrders);

  }, [confirmedOrders, transitOrders, deliveredOrders, cancelledOrders, search]);

  const clearFilters = () => {
    setSelectedOption("all");
    setFilteredConfirmedOrders(confirmedOrders);
    setFilteredTransitOrders(transitOrders);
    setFilteredDeliveredOrders(deliveredOrders);
    setFilteredCancelledOrders(cancelledOrders);

  };


  const changeStatus = async (orderId) => {
    // Display a confirmation dialog
    Alert.alert("Cancel Order", "Are you sure you want to cancel this order?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "Yes",
        onPress: async () => {
          var myHeaders = new Headers();
          myHeaders.append("Content-Type", "application/json");
          myHeaders.append("Authorization", `Bearer ${userData.token}`);

          // console.log(userData.token);

          var raw = JSON.stringify({
            "id": orderId,
            "stages": "POC",
            "status": "CL"
          });

          var requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
          };

          await fetch(
            `https://gsidev.ordosolution.com/api/rfq/update_rfq_details/`,
            requestOptions
          )
            .then((response) => {
              if (response.status === 200) {
                Toast.show("Order cancelled successfully", Toast.LONG);
                fetchData();
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
        onPress={() => { navigation.navigate('SalesOrderDetails', { orderDetails: item, screen: 'PO' }) }}
        style={styles.elementsView} activeOpacity={0.8}>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            {item.status === 'Cancel' ? (
              <AntDesign name='closecircleo' size={30} color='red' />
            ) :
              item.status === 'Pending' ? (
                <MaterialIcons
                  name="access-time"
                  color='#CC5500'
                  size={30}

                />
              ) :
                item.status === 'Delivered' ? (
                  <AntDesign
                    name="checkcircleo"
                    color='#004600'
                    size={30}

                  />
                )
                  : (
                    <AntDesign name="checkcircleo" size={30} color='#004600' />
                  )}
            <Text style={[{ fontSize: 12, color: 'black', fontFamily: "AvenirNextCyr-Medium", marginTop: 5 }, { color: item.status === 'Cancel' ? 'red' : (item.status === 'Pending' ? '#CC5500' : (item.status === 'Delivered' ? '#004600' : '#004600')) }]}>
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
                {item?.name} ({item?.supplier_name}-{item?.supplier_id})
              </Text>

              {/* {item.status === "Confirmed" && <TouchableOpacity
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
              </TouchableOpacity>} */}
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
                  {Number(item?.total_price)}
                </Text>
              </View>
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
          Purchase Orders
        </Text>
        <TouchableOpacity
          onPress={() => {
            setModalVisible(true);
          }}
        >
          <AntDesign name="filter" size={22} color="white" />
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
            tabPress: () => {setScreenName('In Transit');fetchData()}
             }}
          options={{ title: 'Pending', tabBarLabelStyle: { fontFamily: "AvenirNextCyr-Bold", textTransform: 'capitalize' } }}
        >
          {(props) => <Shipped {...props} fetchData={fetchData} transitOrders={filteredTransitOrders} renderItem={renderItem} loading={ordersLoading} />}
        </Tab.Screen>

        <Tab.Screen
          name="Pending"
          listeners={{
            tabPress: () => {setScreenName('Confirmed');fetchData()}
             }}
          options={{ title: 'Confirmed', tabBarLabelStyle: { fontFamily: "AvenirNextCyr-Bold", textTransform: 'capitalize' } }}
        >
          {(props) => <Pending {...props} fetchData={fetchData} pendingOrders={filteredConfirmedOrders} renderItem={renderItem} loading={ordersLoading} />}
        </Tab.Screen>



       


{/* 
        <Tab.Screen
          name="Delivered"
          listeners={{
            tabPress: () => {setScreenName('Delivered');fetchData()}
             }}
          options={{ title: 'Delivered', tabBarLabelStyle: { fontFamily: "AvenirNextCyr-Bold", textTransform: 'capitalize' } }}
        >
          {(props) => <Delivered {...props} fetchData={fetchData} deliveredOrders={filteredDeliveredOrders} renderItem={renderItem} loading={ordersLoading} />}
        </Tab.Screen> */}



        <Tab.Screen
          name="Cancelled"
          listeners={{
            tabPress: () => {setScreenName('Cancel');fetchData()}
             }}
          options={{ title: 'Cancelled', tabBarLabelStyle: { fontFamily: "AvenirNextCyr-Bold", textTransform: 'capitalize' } }}
        >
          {(props) => <Cancelled {...props} fetchData={fetchData} cancelledOrders={filteredCancelledOrders} renderItem={renderItem} loading={ordersLoading} />}
        </Tab.Screen>
      </Tab.Navigator>

      {/* {isDatePickerVisible == true ?
        <DatePicker
          modal
          // androidVariant='iosClone'
          theme='light'
          mode={'date'}
          open={isDatePickerVisible}
          date={date}
          locale='en-GB'
          // format="DD-MM-YYYY"
          // minDate="2022-01-01"
          // maximumDate={new Date()}
          onConfirm={(date) => {
            const dateString = moment(date).format('MM/DD/YYYY');
            // const dateString = date.toLocaleDateString();
            console.log("date string", dateString);
            setDatePickerVisible(false);
            setSelectedDate(dateString);
            setDate(date)
          }}
          onCancel={() => {
            setDatePickerVisible(false)
          }}
        /> : null} */}


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
    // </View>
  )
}

export default PurchaseOrder

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
})