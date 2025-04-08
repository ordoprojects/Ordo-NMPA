import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  PureComponent,
  useCallback,
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
  Modal
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";

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
import Icon from "react-native-vector-icons/FontAwesome";
import { LoadingView } from "../../components/LoadingView";
import { searchItem } from "../../utils/Search";
import { debounce } from "../../utils/Search";

const CustomerList = ({ navigation, route }) => {

  const { token, userData, changeDealerData } = useContext(AuthContext);
  const [search, setSearch] = React.useState("");
  const [masterData, setMasterData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = React.useState(false);
  const [selectedCustomer, setSelectedCustomers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [company, setCompany] = useState('');
  const [selectedBrand, setSelectedBrand] = useState("");
  const [isFocus3, setIsFocus3] = useState(false);
  const [brandData, setBrandData] = useState([]);
  const [companyResponse, setCompanyResponse] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);

  const screenToNavigate = route.params.screen;
  const screenid = route.params.screenId;
  console.log("🚀 ~ screenid:", screenid)

  const [searching, setSearching] = useState(false);
  const queryParams = useRef({ limit: 10, offset: 0 });


  const loadAllCustomer = async (limit, offset) => {

    setLoading(true);
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${userData.token}`);
    
    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    try {
      const customerResponse = await fetch(`https://gsidev.ordosolution.com/api/customer/?limit=${limit}&offset=${offset}`, requestOptions);
      const customerResult = await customerResponse.json();
      
      if (offset === 0) {
        setMasterData(customerResult);
        setFilteredData(customerResult);
      } else {
        setMasterData((prevData) => [...prevData, ...customerResult]);
        setFilteredData((prevData) => [...prevData, ...customerResult]);
      }

      setLoading(false);
    } catch (error) {
      console.log("Error", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllCustomer(queryParams.current.limit, queryParams.current.offset);
  }, [userData]);


  useEffect(() => {
    getBrand();
  }, []);

  const getBrand = async (userId) => {
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
        "https://gsidev.ordosolution.com/api/company/",
        requestOptions
      );
      const result = await response.json();

      setCompanyResponse(result);

      const allOption = { label: 'All', value: 'all' };
      const transformedData = result.map((item) => ({
        label: item?.name,
        value: item?.id,
      }));

      // Filter out duplicate labels and remove "All" if already present
      const uniqueData = [allOption, ...transformedData].filter((item, index, array) => {
        return array.findIndex((i) => i.label === item.label) === index;
      });

      // console.log("dhalfahljfahfaiiq", uniqueData);
      setCompany(uniqueData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
    setSelectedBrand("");
    // setSelectedCategory("");
    // setSubSelectedCategory("");
  };

  const handleSubmit = async () => {
    try {
      // Your asynchronous code here
      const filteredObjects = selectedBrand === 'all'
        ? masterData
        : masterData.filter((obj) => obj.company.id === selectedBrand);

      console.log("filtered response:", filteredObjects);
      setFilteredData(filteredObjects);
    } catch (error) {
      console.error("Error in handleSubmit:", error);
    }
    setSelectedBrand("");
    toggleModal();
  };

  // const searchCustomer = (text) => {
  //   if (text) {
  //     // Inserted text is not blank
  //     // Filter the masterDataSource
  //     // Update FilteredDataSource
  //     const newData = masterData.filter(function (item) {
  //       const itemName = item.name ? item.name.toUpperCase() : "".toUpperCase();
  //       const itemAccountId = item.account_id ? item.account_id.toString().toUpperCase() : "".toUpperCase();
  //       const textData = text.toUpperCase();
  //       return itemName.indexOf(textData) > -1 || itemAccountId.indexOf(textData) > -1;
  //     });
  //     setFilteredData(newData);
  //     setSearch(text);
  //   } else {
  //     // Inserted text is blank
  //     // Update FilteredDataSource with masterDataSource
  //     setFilteredData(masterData);
  //     setSearch(text);
  //   }
  // };


  const handleCheckboxChange = (item) => {
    console.log("jashsdjhsjfs",item)
    changeDealerData(item);
    navigation.navigate(screenToNavigate, { data: item, screenid: screenid })
  };

  const handleSearch = async (val) => {

    const baseUrl = "https://gsidev.ordosolution.com/api/customer/?limit=5&offset=0";
    setSearching(true);
    const result = await searchItem(baseUrl, val, userData.token);
    setSearching(false);

    if (result) {
      setFilteredData(result);
      // setProductCount(result.length);
    }
  };

  const onEndReached = () => {
    if (search.trim()) {
      return;
    }
    if (!loading) {
      queryParams.current.offset += queryParams.current.limit;
      setLoading(true);
      loadAllCustomer(queryParams.current.limit, queryParams.current.offset);
    }
  };
  
  const debouncedSearch = useCallback(debounce(handleSearch, 500), [userData.token]);

  useEffect(() => {
    if (search.trim()) {
      debouncedSearch(search);
    } else {
      setFilteredData(masterData);
      // setProductCount(masterData.length);
    }
  }, [search]);


  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={styles.elementsView}
        activeOpacity={0.8}
        onPress={() => {
          handleCheckboxChange(item);
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View>
            {item?.profile_pic ? (
              <Image
                source={{ uri: item?.profile_pic }}
                style={{ ...styles.avatar }}

              />
            ) : (
              <Image
                source={require('../../assets/images/doctor.jpg')}
                style={{ ...styles.avatar }}
              />
            )}
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
              {item.name} - {item.id}
            </Text>
            <Text
              style={{
                color: "#a3a3a3",
                fontSize: 12,
                fontFamily: "AvenirNextCyr-Medium",
              }}
            >
              {item.company?.name}
            </Text>
            <Text
              style={{
                color: "black",
                fontSize: 12,
                fontFamily: "AvenirNextCyr-Medium",
              }}
            >
              {item.client_address} , {item.city}

            </Text>
            <Text
              style={{
                color: "black",
                fontSize: 12,
                fontFamily: "AvenirNextCyr-Medium",
              }}
            >
              {item.state}  - {item.postal_code}
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
          <Text style={styles.headerTitle}>Select Customer</Text>
          <TouchableOpacity
            style={styles.filterButton}
            // onPress={() => {
            //   toggleModal();
            // }}
          >
            {/* <Icon name="filter" size={20} color={Colors.white} /> */}
            {/* <Text
            style={{
              fontSize: 10,
              color: Colors.white,
              fontFamily: "AvenirNextCyr-Medium",
              marginLeft: 5,
            }}
          >
            Filter
          </Text> */}
          </TouchableOpacity>
        </View>

        <Searchbar
          style={{
            marginHorizontal: "4%",
            marginVertical: "3%",
            backgroundColor: "white",
          }}
          placeholder="Search Customer"
          onChangeText={(val) => { setSearch(val)}}
          value={search}
          loading={searching}
          
        />


        <View style={{ flex: 1, borderTopLeftRadius: 20, borderTopRightRadius: 20, backgroundColor: '#F5F5F5' }}>


  <View style={styles.customerMainContainer}>
  { loading ? (
    <LoadingView visible={loading} message="Please Wait ..." />
  ) : (
    <>
      {filteredData.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text
            style={{
              color: "black",
              fontSize: 16,
              fontFamily: "AvenirNextCyr-Medium",
            }}
          >
            No customers available
          </Text>
        </View>
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={filteredData}
          keyboardShouldPersistTaps="handled"
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.5}
        />
      )}
    </>
  )}
</View>

        </View>

      </LinearGradient>
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={toggleModal}
      >
        <TouchableOpacity
          style={styles.modalContainer}
          activeOpacity={1}
        // onPressOut={closeModal}
        >
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeIcon} onPress={toggleModal}>
              <Icon name="times" size={20} color="#000" />
            </TouchableOpacity>
            <View style={styles.modalInnerContent}>
              {/* {userData && userData.dealer_name === 'Nikai Electronics' && ( */}
              <View style={styles.container1}>
                <Text style={styles.ModalText1}>Select Company</Text>
                <Dropdown
                  style={[
                    styles.dropdown,
                    isFocus3 && { borderColor: Colors.primary },
                  ]}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  itemTextStyle={styles.selectedTextStyle}
                  iconStyle={styles.iconStyle}
                  data={company}
                  search
                  maxHeight={400}
                  labelField="label"
                  valueField="value"
                  placeholder={!isFocus3 ? "Select Company" : "..."}
                  searchPlaceholder="Search..."
                  value={selectedBrand}
                  onFocus={() => setIsFocus3(true)}
                  onBlur={() => setIsFocus3(false)}
                  onChange={(item) => {
                    setSelectedBrand(item.value);
                    // getCategory(item.value)
                    setIsFocus3(false);
                  }}
                />
              </View>
              <LinearGradient
                colors={Colors.linearColors}
                start={Colors.start}
                end={Colors.end}
                locations={Colors.ButtonsLocation}
                style={{ borderRadius: 8, marginHorizontal: '2.5%' }}
              >
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleSubmit}
                >
                  <Text style={styles.submitButtonText}>Apply Filter</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
      {/* <LoadingView visible={loading} message="Please Wait ..." /> */}
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
    // ...globalStyles.border,
    borderRadius: 20,
    paddingHorizontal: "1%",
  },
  imageView: {
    width: 70,
    height: 70,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 50,
    borderWidth: 0.5,
    borderColor: "gray",
    marginLeft: '7%'
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    width: "90%", // Adjust the width as needed, for example '90%'
    alignSelf: "center", // Center the modal content horizontally
  },

  closeIcon: {
    position: "absolute",
    top: 0, // Set the top offset to 0 (right above the modal content)
    right: 5,
    padding: 10,
  },
  modalInnerContent: {
    marginTop: 15, // Add a margin to separate the icon from the modal content
  },
  ModalText1: {
    color: "#000000",
    textAlign: "left",
    fontSize: 15,
    fontFamily: "AvenirNextCyr-Bold",
    marginLeft: 1,
  },
  container1: {
    backgroundColor: "white",
    padding: 16,
    width: "100%", // Adjust the width as needed, for example '90%'
    alignSelf: "center", // Center the container horizontally within the modal
  },

  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    width: "100%", // Set the desired width for the dropdown, for example '100%' to match the parent container
  },

  icon1: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
    fontFamily: "AvenirNextCyr-Medium",
  },
  selectedTextStyle: {
    fontSize: 16,
    fontFamily: "AvenirNextCyr-Medium",
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    fontFamily: "AvenirNextCyr-Medium",
  },
  submitButton: {

    // backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    // marginTop: 8,
    // marginLeft: 15,
    // marginRight: 15,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "AvenirNextCyr-Bold",
  },
});

export default CustomerList;
