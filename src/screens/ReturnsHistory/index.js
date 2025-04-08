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
import { Searchbar, RadioButton,Button, ActivityIndicator} from "react-native-paper";
import moment from "moment";
import DatePicker from "react-native-date-picker";
import Toast from "react-native-simple-toast";
import OrdersSkeleton from "../Skeleton/OrdersSkeleton";
import ConvertDateTime from "../../utils/ConvertDateTime";
import { fetchDataForReturn } from "./helper";

const Tab = createMaterialTopTabNavigator();

const Pending = ({ pendingArray, fetchData, ordersLoading, renderItem,loading,handleLoadMore }) => {
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
                  }}>No Pending Returns</Text>
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

const Delivered = ({ completedArray, ordersLoading, renderItem,loading,handleLoadMore}) => {
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
                  }}>No Approved Returns</Text>
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



const ReturnsHistory = ({ navigation }) => {
  const { ordersLoading, setOrdersLoading, userData} = useContext(AuthContext);
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
  const [screenName, setScreenName] = useState('Pending');

//   useFocusEffect(
//       React.useCallback(() => {
//           fetchData();
//       }, [userData])
//   );


  useEffect(() => {
    if ( search !==''){
      fetchPendingData(); 
    }else{
      fetchData();
    }
  }, [search]); 

  const fetchPendingData = async () => {
    try {
        console.log('Calling---------------fetchPendingData------------->')
            const PendingData = await fetchDataForReturn('Pending', 10, 0, userData, search,"RT");
            setPendingArray(PendingData.results);
            setFilteredPendingArray(PendingData.results);

            const CompletedData = await fetchDataForReturn('Confirmed', 10, 0, userData, search,"RT");
            setCompletedArray(CompletedData.results);
            setFilteredCompletedArray(CompletedData.results);
            
    } catch (error) {
        console.error('Error fetching pending data:', error);
    }
};


  const fetchData = async () => {
      setOrdersLoading(true);
      setSearch('');
      try {
          if (userData) {
            console.log('Calling---------------fetchData------------->')
              const pendingData = await fetchDataForReturn('Pending', 10, 0, userData, search,"RT");
              const completedData = await fetchDataForReturn('Confirmed', 10, 0, userData, search,"RT");

                  setPendingArray(pendingData.results);
                  setFilteredPendingArray(pendingData.results);
      
                  setFilteredCompletedArray(completedData.results);
                  setCompletedArray(completedData.results);
          }
          
      } catch (error) {
          console.error('Error fetching data:', error);
      } finally {
          setOrdersLoading(false);
      }
  };


  const handleLoadMore = async ()=>{
    console.log('Calling---------------handleLoadMore------------->')
      setLoading(true);
      setSearch('')
      try {
          if (screenName === 'Pending'){
          const newPendingData = await fetchDataForReturn('Pending', 10, pendingOffset, userData, search,"RT");
          if(newPendingData.results.length<=0){
              Toast.show("Reached End", Toast.LONG);
          }else{
            setPendingArray((prevPendingArray) => [...prevPendingArray, ...newPendingData.results]);
            setFilteredPendingArray((prevPendingArray) => [...prevPendingArray, ...newPendingData.results]);
            setPendingOffset((prevOffset) => prevOffset + 10);
          }
          }
          else {
          const newCompletedData = await fetchDataForReturn('Confirmed', 10, completedOffset, userData, search,"RT");
          if(newCompletedData.results.length<=0){
              Toast.show("Reached End", Toast.LONG);
          }else{
            setCompletedArray((prevCompletedArray) => [...prevCompletedArray, ...newCompletedData.results]);
            setFilteredCompletedArray((prevCompletedArray) => [...prevCompletedArray, ...newCompletedData.results]);
            setCompletedOffset((prevOffset) => prevOffset + 10);
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

      <TouchableOpacity style={styles.elementsView} activeOpacity={0.8} onPress={() => { navigation.navigate('POReviewDetails', { orderDetails: item ,screen :'Returns'}) }}>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <View style={{ justifyContent: 'center', alignItems: 'center', paddingRight: '5%', }}>
            {item?.status === "Pending" && <Entypo name='back-in-time' size={40} color={Colors.primary} />}
            {item?.status === "Confirmed" && <AntDesign name='checkcircleo' size={40} color='green' />}
            {item?.status === "Rejected" && <AntDesign name='closecircleo' size={40} color='tomato' />}
            {item?.status === "Partially Approved" && <AntDesign name='check' size={40} color='green' />}
          </View>

          <View style={{
            flex: 1,
            paddingHorizontal: '2%',
            borderColor: 'grey',
          }}>
            <View style={{ flexDirection: "row", justifyContent: 'space-between', alignItems:'center' }}>
              <Text
                style={{
                  color: Colors.primary,
                  fontSize: 16,
                  fontFamily: "AvenirNextCyr-Bold",
                  borderBottomColor: "grey",
                  // flex:1
                }}
              >
                {item?.name} ({item?.customer_name}-{item?.customer_id})
              </Text>

            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
            <Text style={{ color: 'black', fontSize: 12, fontFamily: "AvenirNextCyr-Medium" }}>Created :{item?.created_by}</Text>
            </View>

            <View style={{ justifyContent: 'space-between', flexDirection: 'row', marginTop: 10 }}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}>Total SKUs: </Text>
                <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}>{Number(item?.product_list?.length)}</Text>
              </View>
              <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}>{ConvertDateTime(item?.created_at).formattedDate} {ConvertDateTime(item?.created_at).formattedTime}</Text>

            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }


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
    console.log('Calling---------------handleSelect------------->')
      setSelectedOption(option);
  };

  // const handleFilter = () => {
  //     if (selectedOption === "all") {
  //         setFilteredCompletedArray(completedArray);
  //         setFilteredPendingArray(pendingArray);
  //         setFilteredCancelledArray(cancelledArray);
  //     } else if (selectedOption === "custom") {
  //         const filteredpendingarray = pendingArray.filter((order) => {
  //             const orderDate = moment(order.created_at).format("YYYY-MM-DD");
  //             return orderDate === selectedDate;
  //         });
  //         setFilteredPendingArray(filteredpendingarray);

  //         const filteredcompletedarray = completedArray.filter((order) => {
  //             const orderDate = moment(order.created_at).format("YYYY-MM-DD");
  //             return orderDate === selectedDate;
  //         });
  //         setFilteredCompletedArray(filteredcompletedarray);

  //         const filteredreturnarray = cancelledArray.filter((order) => {
  //             const orderDate = moment(order.created_at).format("YYYY-MM-DD");
  //             return orderDate === selectedDate;
  //         });

  //         setFilteredCancelledArray(filteredreturnarray);
  //     }
  //     setModalVisible(false);
  // };

  const clearFilters = () => {
      setSelectedOption("all");
      setFilteredCompletedArray(completedArray);
      setFilteredPendingArray(pendingArray);
      setFilteredCancelledArray(cancelledArray);
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
        Return Orders Review 
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
                                  // onPress={handleFilter}
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

export default ReturnsHistory;

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
