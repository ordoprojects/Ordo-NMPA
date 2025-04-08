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



const Drivers = ({ fetchData, pendingOrders, loading, renderItem, navigation }) => {



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

  const { userData } = useContext(AuthContext);
  const [isExtended, setIsExtended] = useState(true);



  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>


      <FlatList
        showsVerticalScrollIndicator={false}
        data={pendingOrders}
        keyboardShouldPersistTaps='handled'
        renderItem={renderItem}
        ListEmptyComponent={() => (
          <View style={styles.noProductsContainer}>
            <Text style={styles.noProductsText}>No Driver found</Text>
          </View>
        )}
      //keyExtractor={(item) => item.id.toString()}
      />


    </View>
  );
}

const Vehicles = ({ navigation, route, fetchData, vehicles, renderItem, loading }) => {


  const [isExtended, setIsExtended] = useState(true);


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
        data={vehicles}
        keyboardShouldPersistTaps='handled'
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.elementsView}
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate("VehicleDetails", { vehicle: item })
            }
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                disabled={item?.account_profile_pic ? true : false}
                onPress={() => handleImagePress(item.id)}
              >
                {item?.account_profile_pic ? (
                  <Image
                    //source={require('../../assets/images/account.png')}
                    source={{ uri: item?.account_profile_pic }}
                    style={{ ...styles.avatar }}
                  />
                ) : (
                  <Image
                    source={require("../../assets/images/car.jpg")}
                    style={{ ...styles.avatar }}
                  />
                )}
              </View>
              <View
                style={{
                  flex: 1,
                  marginLeft: 8,
                  // borderLeftWidth: 1.5,
                  paddingLeft: 10,
                  marginLeft: 20,
                  // borderStyle: 'dotted',
                  // borderColor: 'grey',
                  justifyContent: "space-around",
                }}
              >
                {/* <View style={{ flexDirection: 'row' }}> */}
                <Text
                  style={{
                    color: Colors.primary,
                    fontSize: 12,
                    fontFamily: "AvenirNextCyr-Bold",
                    borderBottomColor: "grey",
                  }}
                >
                  {item?.registration_no}
                </Text>
                <Text
                  style={{
                    color: "black",
                    fontSize: 12,
                    fontFamily: "AvenirNextCyr-Medium",
                    borderBottomColor: "grey",
                  }}
                >
                  {item?.vehicle_type}
                </Text>
                <Text
                  style={{
                    color: "black",
                    fontSize: 12,
                    fontFamily: "AvenirNextCyr-Medium",
                    borderBottomColor: "grey",
                  }}
                >
                  {item?.make}
                </Text>

              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
          <View style={styles.noProductsContainer}>
            <Text style={styles.noProductsText}>No Vehicle found</Text>
          </View>
        )}
      //keyExtractor={(item) => item.id.toString()}
      />


      <AnimatedFAB
        label={'Add Vehicle'}
        icon={() => <MaterialCommunityIcons name="truck-outline" size={24} color="white" />}
        color={"white"}
        style={styles.fabStyle}
        // borderWidth={50}
        borderRadius={60}

        fontFamily={'AvenirNextCyr-Medium'}
        extended={isExtended}

        // onPress={() => console.log('Pressed')}
        visible={true}
        animateFrom={'right'}
        // iconMode={'static'}
        onPress={() => {
          navigation.navigate("AddVehicle", { screen: 'add' });
        }}
      />
    </View>
  );
}



const Delivered = ({ navigation, route, deliveredOrders, renderItem, loading }) => {


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
        data={deliveredOrders}
        keyboardShouldPersistTaps='handled'
        renderItem={renderItem}
        ListEmptyComponent={() => (
          <View style={styles.noProductsContainer}>
            <Text style={styles.noProductsText}>No Driver found with the given name</Text>
          </View>
        )}
      //keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}


const Cancelled = ({ navigation, route, cancelledOrders, renderItem, loading }) => {


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

const DriversAndVehicles = ({ navigation }) => {
  const [selectedOption, setSelectedOption] = useState("all");


  const [modalVisible, setModalVisible] = useState(false);
  // const [filteredData, setFilteredData] = useState([]);
  // const [masterData, setMasterData] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [date, setDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  const [drivers, setDrivers] = useState([]);
  const [filteredDrivers, setFilteredDrivers] = useState([]);

  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);







  const {
    userData,
  } = useContext(AuthContext);




  useFocusEffect(
    React.useCallback(() => {
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
        const vehicleResponse = await fetch("https://gsidev.ordosolution.com/api/vehicle/", requestOptions);
        const vehicleResult = await vehicleResponse.json();
        console.log("Vehicle Data", vehicleResult);
        setVehicles(vehicleResult);
        setFilteredVehicles(vehicleResult);

        const driverResponse = await fetch("https://gsidev.ordosolution.com/api/driver/", requestOptions);
        const driverResult = await driverResponse.json();
        console.log("Driver Data", driverResult);
        setDrivers(driverResult);
        setFilteredDrivers(driverResult);

        setLoading(false);
      } catch (error) {
        console.log("Error", error);
        setLoading(false);
      }
    };

    fetchData();
 }, [userData])
  );



  // console.log("chcsuac",pendingArray)


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
      setFilteredDrivers(drivers);
      setFilteredVehicles(vehicles);


    } else if (selectedOption === "custom") {
      const filteredconfirmedorders = drivers.filter((order) => {
        const orderDate = moment(order.created_at).format("YYYY-MM-DD");
        return orderDate === selectedDate;
      });
      setFilteredDrivers(filteredconfirmedorders);

      const filteredtransitorders = vehicles.filter((order) => {
        const orderDate = moment(order.created_at).format("YYYY-MM-DD");
        return orderDate === selectedDate;
      });
      setFilteredVehicles(filteredtransitorders);





    }
    setModalVisible(false);
  };

  useEffect(() => {
    const applySearchFilter = (dataArray, setFilteredArray) => {
      // If there's a search query, filter the dataArray
      if (search) {
        const newData = dataArray.filter(item => {
          const itemData = (item.first_name ? item.first_name.toUpperCase() : '') + (item.registration_no ? item.registration_no.toUpperCase() : '')+(item.last_name ? item.last_name.toUpperCase() : '');
          const queryData = search.toUpperCase();
          return itemData.indexOf(queryData) > -1;
        });

        setFilteredArray(newData);
      } else {
        // If there's no search query, setFilteredArray to the full dataArray
        setFilteredArray(dataArray);
      }
    };

    applySearchFilter(drivers, setFilteredDrivers);
    applySearchFilter(vehicles, setFilteredVehicles);
 

  }, [drivers, vehicles, search]);



  const clearFilters = () => {
    setSelectedOption("all");
    setFilteredDrivers(drivers);
    setFilteredVehicles(vehicles);


  };




  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("DriverDetails", { item })}
        style={styles.elementsView} activeOpacity={0.8}>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
            {item.status === 'Active' ? (
              <AntDesign name='checkcircleo' size={30} color='green' />
            ) :
              (
                <AntDesign
                  name="exclamationcircleo"
                  color='tomato'
                  size={30}

                />
              )}
            <Text style={{ fontSize: 12, fontFamily: "AvenirNextCyr-Medium", marginTop: 5, color: item.status === 'InActive' ? 'tomato' : 'green' }}>
              {item.status}
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
                {item?.first_name}{" "}{item?.last_name}
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
                  License : {item?.license_number}
                </Text>
              </View>
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
                  Phone : {item?.phone}
                </Text>
              </View>
{/* 
              <View style={{ flexDirection: "row" }}>
                <Text
                  style={{
                    color: "black",
                    fontSize: 12,
                    fontFamily: "AvenirNextCyr-Medium",
                  }}
                >
                  {item?.email}
                </Text>
              </View> */}
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
          Onboarding
        </Text>

        <Text>{"    "}</Text>
        {/* <TouchableOpacity
  
        >
          <AntDesign name="filter" size={22} color="white" />
        </TouchableOpacity> */}
      </View>

      <Searchbar
        style={{
          marginHorizontal: "4%",
          marginBottom: "4%",
          backgroundColor: "#F3F3F3",
          fontFamily: "AvenirNextCyr-Medium",
        }}
        placeholder="Search Driver/Vehicle"
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
          options={{ title: 'Drivers', tabBarLabelStyle: { fontFamily: "AvenirNextCyr-Bold", textTransform: 'capitalize' } }}
        >
          {(props) => <Drivers {...props} pendingOrders={filteredDrivers} renderItem={renderItem} loading={loading} navigation={navigation} />}
        </Tab.Screen>



        <Tab.Screen
          name="Vehicles"
          options={{ title: 'Vehicles', tabBarLabelStyle: { fontFamily: "AvenirNextCyr-Bold", textTransform: 'capitalize' } }}
        >
          {(props) => <Vehicles {...props} vehicles={filteredVehicles} renderItem={renderItem} loading={loading} navigation={navigation} />}
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

export default DriversAndVehicles

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