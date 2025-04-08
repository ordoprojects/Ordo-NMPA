import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
  Modal,
  Pressable,
  Alert,
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import Colors from "../../constants/Colors";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import {
  NavigationContainer,
  useIsFocused,
  useRoute,
} from "@react-navigation/native";
import AntDesign from "react-native-vector-icons/AntDesign";
import Entypo from "react-native-vector-icons/Entypo";
import { AuthContext } from "../../Context/AuthContext";
import globalStyles from "../../styles/globalStyles";
import LinearGradient from "react-native-linear-gradient";
import { Searchbar, RadioButton } from "react-native-paper";
import moment from "moment";
import DatePicker from "react-native-date-picker";
import Toast from "react-native-simple-toast";
import OrdersSkeleton from "../Skeleton/OrdersSkeleton";
import { AnimatedFAB } from "react-native-paper";


const Tab = createMaterialTopTabNavigator();

const New = ({ newProducts, navigation, fetchData, onScroll, renderItem }) => {
  const { ordersLoading, setOrdersLoading, userData } = useContext(AuthContext);

  if (ordersLoading) {
    // Render loading indicator or other loading state
    return (

      <OrdersSkeleton />
    );
  }


  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={newProducts}
        onScroll={onScroll}
        keyboardShouldPersistTaps="handled"
        renderItem={(item) => renderItem(item, 'New')}
      />
    </View>
  );
};

const FastMoving = ({ fastMoving, navigation, ordersLoading, onScroll, renderItem }) => {
  if (ordersLoading) {
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
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={fastMoving}
        onScroll={onScroll}
        keyboardShouldPersistTaps="handled"
        renderItem={(item) => renderItem(item, 'FastMoving')}
        ListEmptyComponent={() => (
                  <View style={styles.noProductsContainer}>
                    <Text style={styles.noProductsText}>No Data Available</Text>
                  </View>
                )}
      />
    </View>
  );
};

const SlowMoving = ({ slowMoving, navigation, onScroll, renderItem }) => {
  // const { fastMoving } = useContext(AuthContext);
  const { ordersLoading, setOrdersLoading } = useContext(AuthContext);

  if (ordersLoading) {
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
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={slowMoving}
        onScroll={onScroll}

        keyboardShouldPersistTaps="handled"
        renderItem={(item) => renderItem(item, 'SlowMoving')}
      //keyExtractor={(item) => item.id.toString()}
      ListEmptyComponent={() => (
                  <View style={styles.noProductsContainer}>
                    <Text style={styles.noProductsText}>No Data Available</Text>
                  </View>
                )}
      />
    </View>
  );
};


const Obsolete = ({ obsolete, navigation, onScroll, renderItem }) => {
  // const { fastMoving } = useContext(AuthContext);
  const { ordersLoading, setOrdersLoading } = useContext(AuthContext);

  if (ordersLoading) {
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
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={obsolete}
        onScroll={onScroll}

        keyboardShouldPersistTaps="handled"
        renderItem={(item) => renderItem(item, 'Obsolete')}
      //keyExtractor={(item) => item.id.toString()}
      ListEmptyComponent={() => (
                  <View style={styles.noProductsContainer}>
                    <Text style={styles.noProductsText}>No Data Available</Text>
                  </View>
                )}
      />
    </View>
  );
};

const InventoryAging = ({ navigation, visible, extended, label, animateFrom }) => {
  const { ordersLoading, setOrdersLoading, userData, dealerData } =
    useContext(AuthContext);

  const [search, setSearch] = useState("");
  const onChangeSearch = (query) => setSearchQuery(query);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [date, setDate] = useState(new Date());
  const [isExtended, setIsExtended] = useState(true);

  const onScroll = ({ nativeEvent }) => {
    const currentScrollPosition =
      Math.floor(nativeEvent?.contentOffset?.y) ?? 0;

    setIsExtended(currentScrollPosition <= 0);
  };

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [loading, setLoading] = useState(false);

  const [newProducts, setNewProducts] = useState([]);
  const [slowMoving, setSlowMoving] = useState([]);
  const [fastMoving, setFastMoving] = useState([]);
  const [obsolete, setObsolete] = useState([]);
  const [expired, setExpired] = useState([]);



  const [filteredNewproducts, setFilteredNewproducts] = useState([]);
  const [filteredSM, setFilteredSM] = useState([]);
  const [filteredFM, setFilteredFM] = useState([]);
  const [filteredObsolete, setFilteredObsolete] = useState([]);
  const [filteredExpired, setFilteredExpired] = useState([]);



  useEffect(() => {
    fetchData();
  }, [userData]);

  //   useEffect(() => {
  //     // If there's a search query, filter the cartData
  //     console.log(search)
  //     if (search) {
  //         const newData = newProducts.filter(
  //             function (item) {
  //                 const itemData = item.name
  //                     ? item.name?.toUpperCase() + item.assignee_name?.toUpperCase()
  //                     : ''.toUpperCase();
  //                 const queryData = search.toUpperCase();
  //                 return itemData.indexOf(queryData) > -1;
  //             });

  //         setFilteredNewproducts(newData);
  //     } else {
  //         // If there's no search query, setFilteredCartData to the full cartData
  //         setFilteredNewproducts(newProducts);
  //     }
  // }, [newProducts, search]);

  useEffect(() => {
    const applySearchFilter = (dataArray, setFilteredArray) => {
      // If there's a search query, filter the dataArray
      if (search) {
        const newData = dataArray.filter(item => {
          const itemData = (item.name ? item.name.toUpperCase() : '') + (item.assignee_name ? item.assignee_name.toUpperCase() : '');
          const queryData = search.toUpperCase();
          return itemData.indexOf(queryData) > -1;
        });

        setFilteredArray(newData);
      } else {
        // If there's no search query, setFilteredArray to the full dataArray
        setFilteredArray(dataArray);
      }
    };

    applySearchFilter(newProducts, setFilteredNewproducts);
    applySearchFilter(slowMoving, setFilteredSM);
    applySearchFilter(fastMoving, setFilteredFM);
    applySearchFilter(expired, setFilteredExpired);

  }, [newProducts, slowMoving, fastMoving,expired, search]);


  const fetchData = async () => {
    setOrdersLoading(true);

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${userData.token}`);


    await fetch(`https://gsidev.ordosolution.com/api/inventory/calculate_inventory_aging/`, {
      method: 'GET',
      headers: myHeaders,
    })
      .then(response => response.json())
      .then(res => {




        // setNewProducts(res);
        setSlowMoving(res?.slow_moving_products);
        setFastMoving(res?.fast_moving_products);
        setExpired(res?.expired_products);



        // setFilteredNewproducts(tPendingArray);
        setFilteredSM(res?.slow_moving_products);
        setFilteredFM(res?.fast_moving_products);
        setFilteredExpired(res?.expired_products);


        setOrdersLoading(false);
      })
      .catch((error) => {
        // Handle any errors that occurred during the request
        console.error("error in get api", error);
      });
  };


  const renderItem = ({ item }, type) => {

    return (<TouchableOpacity
      style={styles.elementsView}
      activeOpacity={0.8}
      onPress={() => {
        navigation.navigate("ProductDetails", { item: item });
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <View style={{ justifyContent: "center", alignItems: "center", paddingRight: '5%', }}>

          {type == 'FastMoving' ? (<Entypo name='back-in-time' size={40} color={Colors.primary} />) : (<AntDesign name='checkcircleo' size={40} color={Colors.primary} />)}

        </View>

        <View
          style={{
            flex: 1,
            // marginLeft: 25,
            paddingHorizontal: '2%',
            // borderLeftWidth: 1.5,
            // paddingLeft: 20,
            // borderStyle: 'dotted',
            borderColor: 'grey',
            gap: 5
            // justifyContent: 'space-around'
          }}
        >
          <View style={{ flexDirection: "row", justifyContent: 'space-between' }}>
            <Text
              style={{
                color: Colors.primary,
                fontSize: 16,
                fontFamily: "AvenirNextCyr-Medium",
                borderBottomColor: "grey",
                borderBottomWidth: 0.5,
              }}
            >
              {item?.product_name} - ({item?.supplier})
            </Text>

            {/* <TouchableOpacity
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
            </TouchableOpacity> */}
          </View>

          {/* <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
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

            </Text>

          </View> */}

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",

            }}
          >
            {/* <Text
              style={{
                color: "black",
                fontSize: 12,
                fontFamily: "AvenirNextCyr-Medium",
              }}
            >
              {item?.created_at.split("T")[0]}
            </Text> */}

          </View>

          <View
            style={{
              justifyContent: "space-between",
              flexDirection: "row",

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
                Inventory Aging :{" "}
              </Text>
              <Text
                style={{
                  color: "black",
                  fontSize: 12,
                  fontFamily: "AvenirNextCyr-Medium",
                }}
              >
                {Number(item?.inventory_id)}
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
                Price:{" "}
              </Text>
              <Text
                style={{
                  color: "black",
                  fontSize: 12,
                  fontFamily: "AvenirNextCyr-Medium",
                }}
              >
                {Number(item?.price)}
              </Text>
            </View>




          </View>


          <View style={{ flexDirection: "row" }}>
            <Text
              style={{
                color: "black",
                fontSize: 12,
                fontFamily: "AvenirNextCyr-Medium",
              }}
            >
              {item.is_stock ? (<Text style={{ color: 'green' }}>In stock</Text>) : (<Text style={{ color: 'tomato' }}>Out of stock</Text>)}
            </Text>
          </View>
        </View>


      </View>
      {/* <Text style={{ fontSize: 12, color: 'black', fontFamily: 'AvenirNextCyr-Medium', marginTop: 5 }}>Confirmed</Text> */}
    </TouchableOpacity>
    );
  }


  const handleSelect = (option) => {
    setSelectedOption(option);
  };

  const handleFilter = () => {
    if (selectedOption === "all") {
      setFilteredSM(slowMoving);
      setFilteredNewproducts(newProducts);
      setFilteredFM(fastMoving);
      setFilteredExpired(expired);
    } else if (selectedOption === "custom") {
      const filteredpendingarray = newProducts.filter((order) => {
        const orderDate = moment(order.created_at).format("YYYY-MM-DD");
        return orderDate === selectedDate;
      });
      setFilteredNewproducts(filteredpendingarray);

      const filteredcompletedarray = slowMoving.filter((order) => {
        const orderDate = moment(order.created_at).format("YYYY-MM-DD");
        return orderDate === selectedDate;
      });
      setFilteredSM(filteredcompletedarray);

      const filteredreturnarray = fastMoving.filter((order) => {
        const orderDate = moment(order.created_at).format("YYYY-MM-DD");
        return orderDate === selectedDate;
      });

      setFilteredFM(filteredreturnarray);

      const filteredexpiredarray = expired.filter((order) => {
        const orderDate = moment(order.created_at).format("YYYY-MM-DD");
        return orderDate === selectedDate;
      });

      setFilteredExpired(filteredexpiredarray);
    }
    setModalVisible(false);
  };

  const clearFilters = () => {
    setSelectedOption("all");
    setFilteredSM(slowMoving);
    setFilteredNewproducts(newProducts);
    setFilteredFM(fastMoving);
    setFilteredExpired(expired);

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
        >Inventory Aging Analysis</Text>
        <TouchableOpacity
          onPress={() => {
            setModalVisible(true);
          }}
        >
          <AntDesign name="filter" size={0} color="white" />
        </TouchableOpacity>
      </View>

      {/* <Searchbar
        style={{
          marginHorizontal: "4%",
          marginBottom: "4%",
          backgroundColor: "#F3F3F3",
          fontFamily: "AvenirNextCyr-Medium",
        }}
        placeholder="Search Record"
        placeholderTextColor="grey"
        onChangeText={(val) => setSearch(val)}
        value={search}
      /> */}

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
        tabBarOptions={{
          // indicatorStyle: { backgroundColor: 'transparent' },

        }}
        screenOptions={{
          tabBarIndicatorStyle: { backgroundColor: Colors.primary, borderRadius: 2, },
          tabBarStyle: { borderTopLeftRadius: 20, borderTopRightRadius: 20 },

        }
        }
        style={{ borderTopLeftRadius: 20, borderTopRightRadius: 20 }}

      >
        {/* Pass 'newProducts' as a prop to the Pending component */}
        {/* <Tab.Screen
          name="New"
          options={{
            title: "New",
            tabBarLabelStyle: {
              fontFamily: "AvenirNextCyr-Medium",
              fontWeight: 'bold',
              textTransform: "capitalize",
            },
          }}
        >
          {() => (
            <New
              newProducts={filteredNewproducts}
              navigation={navigation}
              fetchData={fetchData}
              onScroll={onScroll}
              renderItem={renderItem}
            />
          )}
        </Tab.Screen> */}

        {/* Pass 'slowMoving' as a prop to the Delivered component */}
        <Tab.Screen
          name="FastMoving"
          options={{
            title: "FastMoving",
            tabBarLabelStyle: {
              fontFamily: "AvenirNextCyr-Medium",
              fontWeight: 'bold',
              textTransform: "capitalize",
            },
          }}
        >
          {() => <FastMoving fastMoving={filteredFM} navigation={navigation} onScroll={onScroll}
            renderItem={renderItem}

          />}
        </Tab.Screen>

        {/* Pass 'fastMoving' as a prop to the Canceled component */}
        <Tab.Screen
          name="SlowMoving"
          options={{
            title: "SlowMoving",
            tabBarLabelStyle: {
              fontFamily: "AvenirNextCyr-Medium",
              fontWeight: 'bold',

              textTransform: "capitalize",
            },

          }}
        >
          {() => <SlowMoving slowMoving={filteredSM} navigation={navigation}
            renderItem={renderItem}

            onScroll={onScroll}

          />}
        </Tab.Screen>

        <Tab.Screen
          name="Obsolete"
          options={{
            title: "Expired",
            tabBarLabelStyle: {
              fontFamily: "AvenirNextCyr-Medium",
              fontWeight: 'bold',

              textTransform: "capitalize",
            },

          }}
        >
          {() => <Obsolete obsolete={filteredExpired} navigation={navigation}
            renderItem={renderItem}

            onScroll={onScroll}

          />}
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
      {/* <AnimatedFAB
      label={"Log"}
      icon={(name = "history")}
      color={"white"}
      style={styles.fabStyle}
      fontFamily={"AvenirNextCyr-Medium"}
      extended={isExtended}
      // onPress={() => console.log('Pressed')}
      visible={visible}
      animateFrom={"right"}
      // iconMode={"static"}
      onPress={() => navigation.navigate("InventoryLog")}
    /> */}
    </LinearGradient>
  );
};

export default InventoryAging;

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
  fab: {
    position: "absolute",
    margin: 20,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.primary,
    fontFamily: "AvenirNextCyr-Medium",
  },
  fabStyle: {
    borderRadius: 50,
    position: "absolute",
    margin: 10,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.primary,
  },
  noProductsContainer: {
    justifyContent: "center",
    alignItems: "center",
    // padding: 10,
  },
  noProductsText: {
    fontSize: 16,
    color: "gray",
    fontFamily: "AvenirNextCyr-Medium",
    textAlign: "center",
    marginTop: '25%',
  },
});
