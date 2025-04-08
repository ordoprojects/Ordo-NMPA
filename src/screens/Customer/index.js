import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  PureComponent,
} from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  FlatList,
  Pressable,
  Alert,
  TouchableOpacity,
  Modal,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import DatePicker from "react-native-date-picker";
import { Image } from "react-native-animatable";
import LinearGradient from "react-native-linear-gradient";
import Colors from "../../constants/Colors";
import AntDesign from "react-native-vector-icons/AntDesign";
import moment from "moment";
import { format, lastDayOfMonth, getDay, addDays } from "date-fns";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../../Context/AuthContext";
import SwitchSelector from "react-native-switch-selector";
import { Searchbar, Checkbox, RadioButton } from "react-native-paper";
import { ms, hs, vs } from "../../utils/Metrics";
import globalStyles from "../../styles/globalStyles";

const Customer = ({ navigation, route }) => {

  const { token, userData, changeDealerData,
    changeDocId,
    changeTourPlanId, selectedItem } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [masterData, setMasterData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = React.useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // const screenToNavigate = route.params.screen;
  // const screenid = route.params.screenId;

  // console.log("screenid", screenid)


  const MakeExternalVisit = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}${month}${day}`;
    const checkInDate = today.toISOString().split('T')[0];


    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${userData.token}`);

    var raw = JSON.stringify({
      [formattedDate]: {
        account_id: selectedCustomer.id,
        status: "Pending",
        type: "External",
      },
      plan_id: selectedItem?.id,
      ordo_user: userData?.id,
      check_in: checkInDate,
      checkin_location: "Premise"
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    console.log("checkin raw", raw);

    fetch("https://gsidev.ordosolution.com/api/sales_external_checkin/", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log("testttt", result);
        // Uncomment and adapt the following lines if needed
        changeTourPlanId(selectedItem?.id);
        changeDealerData(selectedCustomer);
        changeDocId(result.data[0].sales_checkin_id);
        setModalVisible(false);
        navigation.navigate("CheckOut", {
          tour_plan_id: selectedItem?.id,
          backIcon: true,
          external: true,
          checkin_id: result.data[0].sales_checkin_id,
          dealerInfo: selectedCustomer,
        });
      })
      .catch((error) => {
        console.log("external check in api error", error);
      });
  };



  useEffect(() => {
    //getting active dealer list for the particular user
    getActiveDealerList();
  }, [userData]);

  const getActiveDealerList = async () => {
    setLoading(true);
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${userData.token}`);


    // var raw = JSON.stringify({
    //   __user_id__: "2bb36b96-2bcb--2ee1-64a54b69ddcf",
    // });


    console.log("assigned token", userData.token)

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      // body: raw,
      redirect: "follow",
    };

    await fetch("https://gsidev.ordosolution.com/api/assigned-customers/", requestOptions)
      .then((response) => response.json())
      .then(async (result) => {
        console.log("active dealer api res", result);

        // Get the first 5 items from the API response

        setMasterData(result);
        setFilteredData(result);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.log("error", error);
      });
  };


  const searchCustomer = (text) => {
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource
      // Update FilteredDataSource
      const newData = masterData.filter(function (item) {
        const itemData = item.name
          ? item.name.toUpperCase()
          : "".toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredData(newData);
      setSearchQuery(text);
    } else {
      // Inserted text is blank
      // Update FilteredDataSource with masterDataSource
      setFilteredData(masterData);
      setSearchQuery(text);
    }
  }


  const handleCheckboxChange = (item) => {
    changeDealerData(item);

    //   navigation.navigate(screenToNavigate, { data: item, screenid: screenid })

    // console.log("selected", item.id);
    // Alert.alert(
    //   "Confirmation",
    //   `Are you sure you want to proceed with ${filteredData.name}?`,
    //   [
    //     {
    //       text: "Cancel",
    //       onPress: () => console.log("Cancel Pressed"),
    //       style: "cancel",
    //     },
    //     {
    //       text: "OK",
    //       onPress: () => navigation.navigate(screenToNavigate, { data: item }),
    //     },
    //   ]
    // );
  };


  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={styles.elementsView}
        activeOpacity={0.8}
      // onPress={() => { navigation.navigate('CustomerDetail', { item: item }) }}
      // onPress={() => {
      //   setSelectedCustomer(item);
      //   setModalVisible(true)
      // }}


      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View>
            <Image
              source={{
                uri: item.profile_picture,
              }}
              style={{ ...styles.avatar }}
            />
          </View>
          <View
            style={{
              flex: 1,
              marginLeft: '3%',
            }}
          >
            <Text
              style={{
                color: Colors.primary,
                fontSize: 13,
                fontFamily: "AvenirNextCyr-Bold",
                borderBottomColor: "grey",
              }}
            >
              {item.name}
            </Text>
            {/* </View> */}
            <Text
              style={{
                color: "black",
                fontSize: 12,
                fontFamily: "AvenirNextCyr-Medium",
              }}
            >
              {item.state}
            </Text>
            <Text
              style={{
                color: "black",
                fontSize: 12,
                fontFamily: "AvenirNextCyr-Medium",
              }}
            >
              {item.region} - {item.postal_code}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (

    <View style={{ flex: 1 }}>


      <LinearGradient
        colors={Colors.linearColors}
        start={Colors.start} end={Colors.end}
        locations={Colors.location}
        style={{ flex: 1 }}

      >
        <View style={{ ...styles.headercontainer }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ paddingLeft: 10 }}
          >
            <Image
              source={require("../../assets/images/Refund_back.png")}
              style={{ height: 30, width: 30 }}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Customers</Text>
          <Text>        </Text>
        </View>

        <Searchbar
          style={{
            marginHorizontal: "4%",
            marginVertical: "3%",
            backgroundColor: "white",
          }}
          placeholder="Search Customer"
          onChangeText={(val) => { searchCustomer(val) }}
          value={searchQuery}
        />



        <View style={{ flex: 1, borderTopLeftRadius: 20, borderTopRightRadius: 20, backgroundColor: '#F5F5F5' }}>






          <View style={styles.customerMainContainer}>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={filteredData}
              keyboardShouldPersistTaps="handled"
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
            />
          </View>

        </View>

      </LinearGradient>





      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent={true}
      >
        {/* Modal content */}
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              padding: 20,
              width: "90%",
              marginHorizontal: 10,
              borderRadius: 10,
              elevation: 5,
              height: "40%",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <View
                style={{
                  alignContent: "center",
                  flex: 1,
                  justifyContent: "center",
                  flexDirection: "row",
                  marginLeft: 15,
                }}
              >
                <Text
                  style={{
                    color: "black",
                    fontFamily: "AvenirNextCyr-Bold",
                    fontSize: 17,

                  }}
                >
                  External Visit
                </Text>
                {/* {selectedAvatar?.profile_picture ? (
                  <Image
                    source={{
                      uri:
                        selectedAvatar?.profile_picture,
                    }}
                    style={{ ...styles.avatar }}
                  />
                ) : (
                  <Image
                    source={require("../../assets/images/doctor.jpg")}
                    style={{ ...styles.avatar }}
                  />
                )} */}

                {/* {selectedAvatar && <Image source={{ uri: selectedAvatar.avatarUrl }} style={{ height: 80, width: 80 }} />} */}
              </View>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <AntDesign name="close" size={20} color={`black`} />
              </TouchableOpacity>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                height: "50%",
                marginVertical: 15,
              }}
            >
              {/* <View style={{ marginLeft: 10, flex: 1 }}>
                <Text>External Visit</Text>
              </View> */}
              {/* Vertical Line */}


              <View
                style={{
                  marginLeft: 10,
                  flex: 1,
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    color: "black",
                    fontSize: 15,
                    marginTop: "4%",
                    textAlign: "center",
                    fontFamily: "AvenirNextCyr-Bold",
                  }}
                >
                  {selectedCustomer?.name}
                </Text>
                <Text
                  style={{
                    color: "black",
                    fontSize: 13,
                    marginTop: "2%",
                    textAlign: "center",
                    fontFamily: "AvenirNextCyr-Medium",
                  }}
                >
                  {selectedCustomer?.client_address}
                </Text>
                <Text
                  style={{
                    color: "black",
                    fontSize: 13,
                    marginTop: "1%",
                    textAlign: "center",
                    fontFamily: "AvenirNextCyr-Medium",
                  }}
                >
                  {selectedCustomer?.postal_code}
                </Text>
              </View>
            </View>


            <LinearGradient
              colors={Colors.linearColors}
              start={Colors.start}
              end={Colors.end}
              locations={Colors.ButtonsLocation}
              style={{
                height: 40,
                backgroundColor: "#011A90",
                marginHorizontal: "15%",
                borderRadius: 20,
                alignItems: "center",
                justifyContent: "center",
                elevation: 5,
                ...globalStyles.border,
                marginTop: 10,
              }}
            >
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  width: "100%",
                  justifyContent: "space-around",
                }}
                onPress={() => MakeExternalVisit(selectedCustomer)}
              >
                <View></View>
                <Text
                  style={{
                    color: "white",
                    justifyContent: "center",
                    fontFamily: "AvenirNextCyr-Bold",
                    fontSize: 14,
                    paddingLeft: "10%",
                  }}
                >
                  Check-In
                </Text>
                <AntDesign
                  name="arrowright"
                  style={{ paddingLeft: "10%" }}
                  color={`white`}
                  size={20}
                />
              </TouchableOpacity>
            </LinearGradient>

          </View>
        </View>
      </Modal>

    </View>

  );
};

const styles = StyleSheet.create({
  headercontainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "AvenirNextCyr-Bold",
    color: "white",
    marginTop: 3,
  },

  customerMainContainer: {
    margin: "4%",
    flex: 1,
  },

  elementsView: {
    paddingVertical: 15,
    // backgroundColor: "rgba(158, 78, 126, 0.61)",
    backgroundColor: "white",
    marginVertical: "2%",
    ...globalStyles.border,
    borderRadius: 20,
    paddingHorizontal: "1%",
  },
  imageView: {
    width: 70,
    height: 70,
    resizeMode: 'contain'
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 50,
    borderWidth: 0.5,
    borderColor: "gray",
    marginLeft: '7%',
    resizeMode: 'contain'


  },

  button: {
    paddingVertical: "3%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: Colors.primary,
    margin: "5%",
    borderRadius: 30,
  },
  btnText: {
    fontFamily: "AvenirNextCyr-Bold",
    color: "#fff",
    fontSize: 16,
  },
});

export default Customer;
