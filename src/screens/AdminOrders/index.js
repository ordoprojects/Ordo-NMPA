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
  import { AuthContext } from "../../Context/AuthContext";
  import globalStyles from "../../styles/globalStyles";
  import LinearGradient from "react-native-linear-gradient";
  import { Searchbar, RadioButton } from "react-native-paper";
  import moment from "moment";
  import DatePicker from "react-native-date-picker";
  import Toast from "react-native-simple-toast";
  
  const Tab = createMaterialTopTabNavigator();
  
  const Pending = ({ pendingArray, navigation, fetchData }) => {
    const { ordersLoading, setOrdersLoading, userData } = useContext(AuthContext);
  
    if (ordersLoading) {
      // Render loading indicator or other loading state
      return (
        <ActivityIndicator
          size="large"
          color={Colors.primary}
          style={{ flex: 1 }}
        />
      );
    }
  
    // console.log("gfk,ead", pendingArray)
  
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
  
            console.log(userData.token);
  
            var raw = JSON.stringify({
              status: "Cancel",
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
                  Toast.show("Order cancelled successfully", Toast.LONG);
                  fetchData();
                }
              })
  
              .catch((error) => console.log("api error", error));
          },
        },
      ]);
    };
  
    return (
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={pendingArray}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.elementsView}
              activeOpacity={0.8}
              onPress={() => {
                navigation.navigate("SalesOrderDetails", { orderDetails: item });
              }}
            >
              <View style={{ flexDirection: "row", justifyContent: "center" }}>
                <View style={{ justifyContent: "center", alignItems: "center" }}>
                  <Image
                    source={require("../../assets/images/confirmed.png")}
                    style={{ ...styles.imageView }}
                  />
                  <Text
                    style={{
                      fontSize: 12,
                      color: "black",
                      fontFamily: "AvenirNextCyr-Thin",
                      marginTop: 5,
                    }}
                  >
                    {item?.type}
                  </Text>
                </View>
  
                <View
                  style={{
                    flex: 1,
                    marginLeft: 8,
                    borderLeftWidth: 1.5,
                    paddingLeft: 10,
                    marginLeft: 20,
                    borderStyle: "dotted",
                    borderColor: "grey",
                    // justifyContent: 'space-around'
                  }}
                >
                  <View style={{ flexDirection: "row" }}>
                    <Text
                      style={{
                        color: Colors.primary,
                        fontSize: 16,
                        fontFamily: "AvenirNextCyr-Medium",
                        borderBottomColor: "grey",
                        borderBottomWidth: 0.5,
                      }}
                    >
                      {item?.name}
                    </Text>
                  </View>
  
                  <View
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
                        fontFamily: "AvenirNextCyr-Thin",
                      }}
                    >
                      {item?.created_at.split("T")[0]}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        changeStatus(item.id);
                      }}
                    >
                      <Text
                        style={{
                          color: Colors.primary,
                          fontSize: 12,
                          fontFamily: "AvenirNextCyr-Medium",
                          textDecorationLine: "underline",
                          textDecorationColor: Colors.primary,
                          marginRight: 10,
                        }}
                      >
                        Cancel
                      </Text>
                    </TouchableOpacity>
                  </View>
  
                  <View
                    style={{
                      justifyContent: "space-between",
                      flexDirection: "row",
                      marginTop: 10,
                    }}
                  >
                    <View style={{ flexDirection: "row" }}>
                      <Text
                        style={{
                          color: "black",
                          fontSize: 12,
                          fontFamily: "AvenirNextCyr-Thin",
                        }}
                      >
                        Total SKUs:{" "}
                      </Text>
                      <Text
                        style={{
                          color: "black",
                          fontSize: 12,
                          fontFamily: "AvenirNextCyr-Thin",
                        }}
                      >
                        {Number(item?.product_list.length)}
                      </Text>
                    </View>
  
                    <View style={{ flexDirection: "row" }}>
                      <Text
                        style={{
                          color: "black",
                          fontSize: 12,
                          fontFamily: "AvenirNextCyr-Thin",
                        }}
                      >
                        Total Price:{" "}
                      </Text>
                      <Text
                        style={{
                          color: "black",
                          fontSize: 12,
                          fontFamily: "AvenirNextCyr-Thin",
                        }}
                      >
                        {Number(item?.total_price)}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              {/* <Text style={{ fontSize: 12, color: 'black', fontFamily: 'AvenirNextCyr-Thin', marginTop: 5 }}>Confirmed</Text> */}
            </TouchableOpacity>
          )}
        />
      </View>
    );
  };
  
  const Delivered = ({ completedArray }) => {
    return (
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={completedArray}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.elementsView} activeOpacity={0.8}>
              <View style={{ flexDirection: "row", justifyContent: "center" }}>
                <View style={{ justifyContent: "center", alignItems: "center" }}>
                  <Image
                    source={require("../../assets/images/confirmed.png")}
                    style={{ ...styles.imageView }}
                  />
                  <Text
                    style={{
                      fontSize: 12,
                      color: "black",
                      fontFamily: "AvenirNextCyr-Thin",
                      marginTop: 5,
                    }}
                  >
                    {item?.type}
                  </Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    marginLeft: 8,
                    borderLeftWidth: 1.5,
                    paddingLeft: 10,
                    marginLeft: 20,
                    borderStyle: "dotted",
                    borderColor: "grey",
                    // justifyContent: 'space-around'
                  }}
                >
                  <View style={{ flexDirection: "row" }}>
                    <Text
                      style={{
                        color: Colors.primary,
                        fontSize: 16,
                        fontFamily: "AvenirNextCyr-Medium",
                        borderBottomColor: "grey",
                        borderBottomWidth: 0.5,
                      }}
                    >
                      {item?.name}
                    </Text>
                  </View>
  
                  <View
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
                        fontFamily: "AvenirNextCyr-Thin",
                      }}
                    >
                      {item?.created_at.split("T")[0]}
                    </Text>
                    {/* <Text style={{ color: Colors.primary, fontSize: 12, fontFamily: 'AvenirNextCyr-Medium', textDecorationLine: 'underline', textDecorationColor: Colors.primary, marginRight: 10 }}>Cancel</Text> */}
                  </View>
  
                  <View
                    style={{
                      justifyContent: "space-between",
                      flexDirection: "row",
                      marginTop: 10,
                    }}
                  >
                    <View style={{ flexDirection: "row" }}>
                      <Text
                        style={{
                          color: "black",
                          fontSize: 12,
                          fontFamily: "AvenirNextCyr-Thin",
                        }}
                      >
                        Total SKUs:{" "}
                      </Text>
                      <Text
                        style={{
                          color: "black",
                          fontSize: 12,
                          fontFamily: "AvenirNextCyr-Thin",
                        }}
                      >
                        {Number(item?.product_list.length)}
                      </Text>
                    </View>
  
                    <View style={{ flexDirection: "row" }}>
                      <Text
                        style={{
                          color: "black",
                          fontSize: 12,
                          fontFamily: "AvenirNextCyr-Thin",
                        }}
                      >
                        Total Price:{" "}
                      </Text>
                      <Text
                        style={{
                          color: "black",
                          fontSize: 12,
                          fontFamily: "AvenirNextCyr-Thin",
                        }}
                      >
                        {Number(item?.total_price)}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              {/* <Text style={{ fontSize: 12, color: 'black', fontFamily: 'AvenirNextCyr-Thin', marginTop: 5 }}>Confirmed</Text> */}
            </TouchableOpacity>
          )}
        //keyExtractor={(item) => item.id.toString()}
        />
      </View>
    );
  };
  const Canceled = ({ cancelledArray }) => {
    // const { cancelledArray } = useContext(AuthContext);
    const { ordersLoading, setOrdersLoading } = useContext(AuthContext);
  
    return (
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={cancelledArray}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.elementsView} activeOpacity={0.8}>
              <View style={{ flexDirection: "row", justifyContent: "center" }}>
                <View style={{ justifyContent: "center", alignItems: "center" }}>
                  <Image
                    source={require("../../assets/images/confirmed.png")}
                    style={{ ...styles.imageView }}
                  />
                  <Text
                    style={{
                      fontSize: 12,
                      color: "black",
                      fontFamily: "AvenirNextCyr-Thin",
                      marginTop: 5,
                    }}
                  >
                    {item?.type}
                  </Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    marginLeft: 8,
                    borderLeftWidth: 1.5,
                    paddingLeft: 10,
                    marginLeft: 20,
                    borderStyle: "dotted",
                    borderColor: "grey",
                    // justifyContent: 'space-around'
                  }}
                >
                  <View style={{ flexDirection: "row" }}>
                    <Text
                      style={{
                        color: Colors.primary,
                        fontSize: 16,
                        fontFamily: "AvenirNextCyr-Medium",
                        borderBottomColor: "grey",
                        borderBottomWidth: 0.5,
                      }}
                    >
                      {item?.name}
                    </Text>
                  </View>
  
                  <View
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
                        fontFamily: "AvenirNextCyr-Thin",
                      }}
                    >
                      {item?.created_at.split("T")[0]}
                    </Text>
                    {/* <Text style={{ color: Colors.primary, fontSize: 12, fontFamily: 'AvenirNextCyr-Medium', textDecorationLine: 'underline', textDecorationColor: Colors.primary, marginRight: 10 }}>Cancel</Text> */}
                  </View>
  
                  <View
                    style={{
                      justifyContent: "space-between",
                      flexDirection: "row",
                      marginTop: 10,
                    }}
                  >
                    <View style={{ flexDirection: "row" }}>
                      <Text
                        style={{
                          color: "black",
                          fontSize: 12,
                          fontFamily: "AvenirNextCyr-Thin",
                        }}
                      >
                        Total SKUs:{" "}
                      </Text>
                      <Text
                        style={{
                          color: "black",
                          fontSize: 12,
                          fontFamily: "AvenirNextCyr-Thin",
                        }}
                      >
                        {Number(item?.product_list.length)}
                      </Text>
                    </View>
  
                    <View style={{ flexDirection: "row" }}>
                      <Text
                        style={{
                          color: "black",
                          fontSize: 12,
                          fontFamily: "AvenirNextCyr-Thin",
                        }}
                      >
                        Total Price:{" "}
                      </Text>
                      <Text
                        style={{
                          color: "black",
                          fontSize: 12,
                          fontFamily: "AvenirNextCyr-Thin",
                        }}
                      >
                        {Number(item?.total_price)}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              {/* <Text style={{ fontSize: 12, color: 'black', fontFamily: 'AvenirNextCyr-Thin', marginTop: 5 }}>Confirmed</Text> */}
            </TouchableOpacity>
          )}
        //keyExtractor={(item) => item.id.toString()}
        />
      </View>
    );
  };
  
  const AdminOrders = ({ navigation }) => {
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
  
    const [filteredPendingArray, setFilteredPendingArray] = useState([]);
    const [filteredCompletedArray, setFilteredCompletedArray] = useState([]);
    const [filteredCancelledArray, setFilteredCancelledArray] = useState([]);
  
    useEffect(() => {
      fetchData();
    }, [userData]);
  
    const fetchData = async () => {
      setOrdersLoading(true);
  
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${userData.token}`);

    //   console.log("dsfsdfsdf", userData.token)
  
      await fetch(
        `https://gsidev.ordosolution.com/api/sales_order/?user=${userData.id}&assigne_to=${dealerData.account_id}`,
        {
          method: "GET",
          headers: myHeaders,
        }
      )
        .then((response) => response.json())
        .then((res) => {
          console.log("ersult", res)
          // setData(data);
          let tPendingArray = [];
          let tCmpArray = [];
          let tCancelledArray = [];
  
          res.forEach((object) => {
            if (object.status == "Confirmed" || object.status == "Pending") {
              tPendingArray.push(object);
            }
  
            if (object.status == "Delivered") {
              tCmpArray.push(object);
            }
  
            //return
            if (object.status == "Cancel") {
              tCancelledArray.push(object);
            }
          });
  
          setPendingArray(tPendingArray);
          setCompletedArray(tCmpArray);
          setCancelledArray(tCancelledArray);
  
          setFilteredPendingArray(tPendingArray);
          setFilteredCompletedArray(tCmpArray);
          setFilteredCancelledArray(tCancelledArray);
  
          setOrdersLoading(false);
        })
        .catch((error) => {
          // Handle any errors that occurred during the request
          console.error(error);
        });
    };
  
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
            fontFamily: "AvenirNextCyr-Thin",
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
          style={{ borderTopLeftRadius: 30, borderTopRightRadius: 30 }}
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
          >
            {() => (
              <Pending
                pendingArray={filteredPendingArray}
                navigation={navigation}
                fetchData={fetchData}
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
          >
            {() => <Delivered completedArray={filteredCompletedArray} />}
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
          >
            {() => <Canceled cancelledArray={filteredCancelledArray} />}
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
          Select Delivery Method
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
            paddingVertical: "1%",
            backgroundColor:
              selectedOption === "pick-up" ? Colors.primary : "white",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 30,
            width: "40%",
          }}
        >
          <RadioButton.Android
            color={"white"}
            status={selectedOption === "pick-up" ? "checked" : "unchecked"}
            onPress={() => handleSelect("pick-up")}
          />
          <TouchableOpacity onPress={() => handleSelect("pick-up")}>
            <Text
              style={{
                fontFamily: "AvenirNextCyr-Medium",
                fontSize: 12,
                color: selectedOption === "pick-up" ? "white" : "black",
              }}
            >
              Pick-Up
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: "row",
            width: "40%",
            paddingVertical: "1%",
            backgroundColor:
              selectedOption === "delivery" ? Colors.primary : "white",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 30,
          }}
        >
          <RadioButton.Android
            color={"white"}
            status={selectedOption === "delivery" ? "checked" : "unchecked"}
            onPress={() => handleSelect("delivery")}
          />
          <TouchableOpacity onPress={() => handleSelect("delivery")}>
            <Text
              style={{
                fontFamily: "AvenirNextCyr-Medium",
                fontSize: 12,
                color: selectedOption === "delivery" ? "white" : "black",
              }}
            >
              Delivery
            </Text>
          </TouchableOpacity>
        </View>
      </View>

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
    );
  };
  
  export default AdminOrders;
  
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
      margin: 5,
      //borderColor: 'black',
      //flexDirection: 'row',
      //justifyContent: 'space-between',
      //alignItems: 'center',
      marginBottom: 16,
      borderRadius: 8,
      elevation: 5,
      ...globalStyles.border,
      padding: 20,
      //borderColor: '#fff',
      //borderWidth: 0.5
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
      fontFamily: "AvenirNextCyr-Thin",
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
  