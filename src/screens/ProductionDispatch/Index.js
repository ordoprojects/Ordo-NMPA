import React from "react";
import {
  StyleSheet,
  Text,
  View,
  BackHandler,
  Alert,
  TouchableOpacity,
  Image,
  Modal,
  TextInput as TextInput2,
  ScrollView, Pressable,
  FlatList,
  SafeAreaView,
  Keyboard,
  ActivityIndicator,
  KeyboardAvoidingView,
  Dimensions
} from "react-native";
import globalStyles from "../../styles/globalStyles";
import LinearGradient from "react-native-linear-gradient";
import Colors from "../../constants/Colors";
import { useState, useContext, useRef, useEffect, useCallback } from "react";
import { AuthContext } from "../../Context/AuthContext";
import { DatePickerModal, DatePickerInput } from "react-native-paper-dates";
import { Dropdown } from "react-native-element-dropdown";
import moment from "moment";
import Toast from 'react-native-simple-toast';
import { LoadingView } from "../../components/LoadingView";
import { RadioButton, TextInput as TextInput1,Button } from "react-native-paper";
import { ms, hs, vs } from "../../utils/Metrics";
import AntDesign from "react-native-vector-icons/AntDesign";
import { Checkbox } from "react-native-paper";
import { AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Autocomplete from 'react-native-autocomplete-input';
import DarkLoading from "../../styles/DarkLoading";
import { useFocusEffect } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import RNFetchBlob from 'rn-fetch-blob';


const ProductionDispatch = ({ navigation, route }) => {

  const { routeId, screen, orders, routeData } = route?.params
  const { width: windowWidth } = Dimensions.get('window');
  const [driverDrop, setDriverDrop] = useState([]);
  const [locationDrop, setLocationDrop] = useState([]);
  const [locationDrop1, setLocationDrop1] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [vehicleDrop, setVehicleDrop] = useState([]);
  const [visible2, setVisible2] = React.useState(false);
  const [visible1, setVisible1] = React.useState(false);
  const { token, userData } = useContext(AuthContext);
  const [selectedDepDate, setSelectedDepDate] = useState(undefined);
  const [selectedArrDate, setSelectedArrDate] = useState(undefined);
  const [DepDate, setDepDate] = useState(moment(new Date()).format('DD/MM/YYYY'))
  const [arrDate, setArrDate] = useState(moment(new Date()).format('DD/MM/YYYY'));
  const [source, setSource] = useState("");
  const [dest, setDest] = useState("");
  const [via, setVia] = useState("");
  const [allOrders, setAllOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible1, setModalVisible1] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Delivery");
  const [driverName, setDriverName] = useState("");
  const [vehicleNo, setVehicleNo] = useState("");

  //Prepared checked loaded
  const [search, setSearch] = useState("");
  const [checkBy, setCheckBy] = useState('');
  const [preparedBy, setPreparedBy] = useState('');
  const [loadedBy, setLoadedBy] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [driverType, setdriverType] = useState([]);
  const [isFocus1, setIsFocus1] = useState(false);
  const [isFocus2, setIsFocus2] = useState(false);
  const [isFocus3, setIsFocus3] = useState(false);
  const [isFocus4, setIsFocus4] = useState(false);
  const [isFocus5, setIsFocus5] = useState(false);
  const [vehicleID, setVehicleId] = useState('');
  const [loading, setLoading] = useState(false);
  const [vehicleCapacity, setVehicleCapacity] = useState('');
  const [customSource, setCustomSource] = useState("");
  const [customDest, setCustomDest] = useState("");
  const [loadcustomData, setLoadCustomData] = useState(true);
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [recentlyDeleted, setRecentlyDeleted] = useState(null);
  const [undoTimeout, setUndoTimeout] = useState(null);
  const [modalVisibleBill, setModalVisibleBill] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null)
  const [dropdownItems, setDropdownItems] = useState([]);
  const [dropdownItemsAdd, setDropdownItemsAdd] = useState([]);
  const [hasError, setHasError] = useState(false);
  const [totalLoadedWeight, setTotalLoadedWeight] = useState(0);
  const [recentlyDeletedDimension, setRecentlyDeletedDimension] = useState(null);
const [offset, setOffset] = useState(0);
    const [loadingMore, setLoadingMore] = useState(false);

  const downloadImage = async (imageUri) => {
    // Define the path where you want to save the file
    const { config, fs } = RNFetchBlob;
    const downloads = fs.dirs.DownloadDir;
    const path = `${downloads}/image_${Date.now()}.jpg`;
  
    // Start downloading the image
    config({
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path: path,
        description: "Downloading image",
      },
    })
      .fetch("GET", imageUri)
      .then((res) => {
        console.log("The file is saved to:", res.path());
        Alert.alert('Completed',`Image downloaded successfully`);
      })
      .catch((error) => {
        console.error("Error downloading image:", error);
        Alert.alert(`Failed to download image due to: ${error}`);
      });
  };

  const handleSelect = (option) => {
    setSelectedOption(option);
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchRouteData()
    }, [userData, selectedOption,offset,search])
  );

  useEffect(() => {
    // Check for any price errors in the cart
    const error = selectedOrders.some(item => Number(item?.checkWeight) > (vehicleCapacity));

    setHasError(error);
  }, [selectedOrders]);


  useEffect(() => {
    if (screen == "edit") {
      getRouteDetails();
    }
  }, [userData.token])

  useEffect(() => {
    driverDropdown();
    locationDropdown();
    VehicleDropdown();

  }, []);


  const addCharges = async (chargeTypes, itemId, chargeId) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${userData.token}`);

    const secondApiUrl = 'https://gsidev.ordosolution.com/api/so_order_charges/';

    const raw = JSON.stringify({
      so_id: itemId,
      charges: chargeTypes,
      operation: "delete",
      chargeIds: chargeId
    });

    console.log("raw for removing charges---------->", raw);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    setLoading(true);

    try {
      const response = await fetch(secondApiUrl, requestOptions);
      if (response.ok) {
        console.log("Second API call succeeded");
        // Call the second API if screen === "edit"
        if (screen === "edit") {
          const thirdApiUrl = 'https://gsidev.ordosolution.com/api/dispatch_item_list/';

          const dispatchBody = JSON.stringify({
            "route_id": routeId,
            "sales_order_ids": [itemId]
          });

          const myHeaders = new Headers();
          myHeaders.append("Content-Type", "application/json");
          myHeaders.append("Authorization", `Bearer ${userData.token}`);

          const dispatchRequestOptions = {
            method: "PUT",
            headers: myHeaders,
            body: dispatchBody,
            redirect: "follow",
          };

          try {
            const dispatchResponse = await fetch(thirdApiUrl, dispatchRequestOptions);
            if (dispatchResponse.ok) {
              console.log("Third API call succeeded");
            } else {
              const errorText = await dispatchResponse.text();
              console.log("Third API call failed", dispatchResponse.status, dispatchResponse.statusText, errorText);
            }
          } catch (error) {
            console.log("API error:", error);
          }
        }
        setModalVisible(false);
        // getRouteDetails();
        //navigation.goBack();
      } else {
        const errorText = await response.text();
        console.log("Second API call failed", response.status, response.statusText, errorText);
      }
    } catch (error) {
      console.log("API error:", error);
    } finally {
      setLoading(false); // Set loading to false after the API call
    }
  };


  const searchProduct = (text) => {
    if (text) {
      const textData = text.toUpperCase();
      const newData = allOrders.filter((item) => {
        const itemData = `${item?.assignee_name ?? ''}${item?.name ?? ''}${item?.sales_order_name ?? ''}`.toUpperCase();
        return itemData.includes(textData);
      });
      setFilteredOrders(newData);
      setSearch(text);
    } else {
      setFilteredOrders(allOrders);
      setSearch(text);
    }
  };

 

  const fetchRouteData = async () => {
    offset > 0 ? setLoadingMore(true) : setLoadCustomData(true);


    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${userData.token}`);

    let url = screen === "edit"
      ? `https://gsidev.ordosolution.com/api/production_item_list/?route_id=${routeId}`
      : `https://gsidev.ordosolution.com/api/production_item_list/?transportation_type=${selectedOption}&limit=10&offset=${offset}&search=${search}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      });

      const result = await response.json();

      if (offset === 0) {
        setFilteredOrders(result.sales_orders);
    } else {
      setFilteredOrders((prevData) => [...prevData, ...result.sales_orders]);
    }

    if (offset === 0) {
      setAllOrders(result.sales_orders);
  } else {
    setAllOrders((prevData) => [...prevData, ...result.sales_orders]);
  }

      // setAllOrders(result.sales_orders);
      // setFilteredOrders(result.sales_orders);
      setLoadCustomData(false);
      setLoadingMore(false);

    } catch (error) {

      console.error(error);
      setLoadCustomData(false);
      setLoadingMore(false);

    }
  };

  const handleLoadMore = async ()  =>{
    setOffset((prevOffset)=>prevOffset+10)
 }

  const getRouteDetails = async () => {
    setLoading(true);

    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${userData.token}`);
    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    try {
      const response = await fetch(
        `https://gsidev.ordosolution.com/api/get_route_details/${routeId}`, requestOptions
      );

      const result = await response.json();

      setSource(routeData?.source)
      setDest(routeData?.destination)
      setVehicleId(routeData?.vehicle_details?.id)
      setdriverType(routeData?.driver_details?.id)
      setVia(routeData?.via)
      setDepDate(moment.utc(routeData?.estimated_departure).format('DD/MM/YYYY'))
      setArrDate(moment.utc(routeData?.estimated_arrival).format('DD/MM/YYYY'))
      setSelectedOrders(orders.map(item => ({

        name: item.name,
        id: item.id,
        assignee_name: item.assignee_name,
        product_weight: item.total_tonnage,
        product_category: item.product_category,
        qty: item.qty,
        product_id: item.product_id,
        soorder_id: item.sales_order,
        quantity: item.quantity,
        checkWeight: item.product_weight,
        remain: item.remaining_qty,
        company: item?.company?.name,
        product_list: item?.product_list?.map(product => ({
          ...product,
          loaded_kg: product.loaded_qty * 100,
        }))
      })));

      setVehicleCapacity(result?.capacity)
    } catch (error) {
      console.log("error", error);
    }
    setLoading(false);
  }


  const toggleModal = () => {
      setOffset(0);             // reset pagination
      setSearch('');            // reset search
      setAllOrders([]);         // clear previous data
      fetchRouteData();         // fetch fresh data
      setModalVisible(true);    // open modal
    
  };

  const onDismiss1 = React.useCallback(() => {
    setVisible1(false);
  }, [setVisible1]);

  const parseDate = (dateStr) => {
    const [day, month, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day);
  };


  const handleBack = () => {
    const missingFields = [];

    if (selectedOption === 'Delivery') {
      if (!driverType) missingFields.push('Driver Type');
      if (!vehicleID) missingFields.push('Vehicle ID');

    } else if (selectedOption === 'Pick-Up') {
      if (!driverName) missingFields.push('Driver Name');
      if (!vehicleNo) missingFields.push('Vehicle Number');
    }

    if (!DepDate) missingFields.push("Departure Date");
    if (!arrDate) missingFields.push("Arrival Date");
    if (!source) missingFields.push("Source");
    if (!dest) missingFields.push("Destination");

    if (missingFields.length > 0) {
      Alert.alert('Error', `Please fill in the following required fields: ${missingFields.join(', ')}`);
      return;
    }
    setCurrentView("Orders")
  }

  const handlePress = () => {
    const missingFields = [];

    if (selectedOption === 'Delivery') {

      if (!driverType) missingFields.push('Driver Type');
      if (!vehicleID) missingFields.push('Vehicle ID');
    } else if (selectedOption === 'Pick-Up') {
      if (!driverName) missingFields.push('Driver Name');
      if (!vehicleNo) missingFields.push('Vehicle Number');
    }

    if (!DepDate) missingFields.push("Departure Date");
    if (!arrDate) missingFields.push("Arrival Date");
    if (!source) missingFields.push("Source");
    if (!dest) missingFields.push("Destination");

    if (missingFields.length > 0) {
      Alert.alert('Error', `Please fill in the following required fields: ${missingFields.join(', ')}`);
      return;
    }
    const arrivalDate = parseDate(arrDate);
    const departureDate = parseDate(DepDate);

    if (departureDate <= arrivalDate) {
      setCurrentView("Orders");
    } else {
      Alert.alert("Error", "Departure date cannot be later than arrival date.");
    }
  };

  const onChange1 = React.useCallback(({ date }) => {
    if (selectedArrDate && date > selectedArrDate) {
      Alert.alert('Error', 'Departure date cannot be later than arrival date');
      return;
    }

    // console.log(date);
    setSelectedDepDate(date);
    setVisible1(false);
    const formattedDate = moment(date).format('DD/MM/YYYY');
    setDepDate(formattedDate);
  }, [selectedArrDate, setSelectedDepDate, setVisible1, setDepDate]);

  const onDismiss2 = React.useCallback(() => {
    setVisible2(false);
  }, [setVisible2]);

  const onChange2 = React.useCallback(({ date }) => {

    if (selectedDepDate && date < selectedDepDate) {
      Alert.alert('Error', 'Arrival date cannot be earlier than departure date');
      return;
    }
    setSelectedArrDate(date);
    setVisible2(false);
    const formattedDate = moment(date).format('DD/MM/YYYY');
    setArrDate(formattedDate);
  }, [selectedDepDate, setSelectedArrDate, setVisible2, setArrDate]);


  const InputWithLabel2 = ({ title, value, onPress }) => {
    // const textColor = !value ? "#cecece" : "black";
    const textColor = Colors.primary

    return (
      <View>
        {/* <Text style={styles.labelText}>{title}</Text> */}
        {renderLabel(title, isFocus1, value)}

        <Pressable style={{ ...styles.inputContainer }} onPress={onPress}>
          <Text style={{ ...styles.input2, color: textColor }}>
            {value ? value : title}
          </Text>
          <Image
            style={{ width: 20, height: 20, marginRight: 15 }}
            source={require("../../assets/images/calendar.png")}
          ></Image>
        </Pressable>
      </View>
    );
  };

  const driverDropdown = async (id) => {
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
        "https://gsidev.ordosolution.com/api/driverlist/",
        requestOptions
      );
      const result = await response.json();
      const driverType = result.driver.map((brand) => {
        return {
          label: brand.label,
          value: brand.value,
        };
      });
      
      setDriverDrop(driverType);

    } catch (error) {
      console.log("error", error);
    }
  };

  const locationDropdown = async (id) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${userData.token}`);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    try {
      const response = await fetch(
        "https://gsidev.ordosolution.com/api/locationlist/",
        requestOptions
      );
      const result = await response.json();

      const transformedLocationDrop = result.locations.map(item => ({
        name: item.label,
        id: item.value, // Assuming the id needs to be a string
      }));
      setLocationDrop(transformedLocationDrop);
      setLocationDrop1(transformedLocationDrop);

    } catch (error) {
      console.log("error", error);
    }
  };


  const VehicleDropdown = async (id) => {

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
        "https://gsidev.ordosolution.com/api/vehiclelist/",
        requestOptions
      );
      const result = await response.json();
      // Extract label and value from the data
      const vehicleDrop = Object.values(result).flatMap((items) =>
        items.map((item) => ({
          label: `${item.label}  (${item.capacity ? item.capacity + " tons" : "No Capacity"})`,
          value: item.value,
          capacity: item?.capacity
        }))
      );

      setVehicleDrop(vehicleDrop);

    } catch (error) {
      console.log("error", error);
    }
  };

  const [totalCheckWeight, setTotalCheckWeight] = useState(0);

  useEffect(() => {
    const total = selectedOrders.reduce((sum, order) => sum + (order.checkWeight || 0), 0);
    setTotalCheckWeight(total);
  }, [selectedOrders]);

  useEffect(() => {
    selectedOrders.forEach(order => {
    });
  }, [selectedOrders]);

  const hasQuantityField = selectedOrders.some(order => order.hasOwnProperty('quantity'));

  useEffect(() => {
    selectedOrders.forEach(order => {
      order.remainingQty = order.qty - order.quantity;
    });
  }, [selectedOrders]);


  const checkMissingAndExcessProducts = () => {
    let missingDataFound = false;
    let alertMessage = '';
  
    const transformedOrders = selectedOrders?.map(order => ({
      order_id: order.id,
      product_list: order.product_list?.map(product => ({
        product_id: product.id,
        product_name: product.name,
        loaded_weight: parseFloat(product.loaded_weight) || 0,
        dimension: product?.dimension
          ?.map(dim => ({
            production_id: dim.production_id,
            loaded_qty: parseFloat(dim.loaded_qty) || 0,
            loaded_weight: parseFloat(dim.loaded_weight) || 0,
          }))
          ?.filter(dim => dim.production_id && !isNaN(dim.loaded_qty)),
      })),
    }));
  
    console.log('================transformedOrders====================');
    console.log(JSON.stringify(transformedOrders, null, 2));
    console.log('=====================================================');
  
    // Check for 'BASE PLATE' and validate loaded_qty and loaded_weight
    transformedOrders?.forEach(order => {
      order.product_list?.forEach(product => {
        if (product.product_name === 'BASE PLATE') {
          product.dimension?.forEach(dim => {
            if (dim.loaded_qty === 0 && dim.loaded_weight === 0) {
              alertMessage = 'BASE PLATE Dimension Weight Or Qty is Missing';
              missingDataFound = true;
            }
          });
        } else {
          // When product name is not "BASE PLATE"
          if (product.loaded_weight === 0 && !missingDataFound) {
            alertMessage = `${product.product_name} Product Loaded Weight is Missing`;
            missingDataFound = true;
          }
  
          product.dimension?.forEach(dim => {
            if (dim.loaded_qty === 0 && !missingDataFound) {
              alertMessage = `${product.product_name} Dimension Qty is Missing`;
              missingDataFound = true;
            }
          });
        }
        if (missingDataFound) return; // Exit loop if missing data found
      });
      if (missingDataFound) return; // Exit loop if missing data found
    });
  
    // Show alert only once if missing data is found
    if (missingDataFound) {
      Alert.alert('Missing data', alertMessage);
    } else {
      setModalVisible1(true); // Open the modal if no missing data was found
    }
  };
  

  const handleSubmit = async () => {

    const transformedOrders = selectedOrders?.map(order => ({
      order_id: order.id, 
      product_list: order.product_list?.map(product => ({
        product_id: product.id, 
        loaded_weight: parseFloat(product.loaded_weight) || 0,
        dimension: product?.dimension
          ?.map(dim => ({
            production_id: dim.production_id,
            loaded_qty: parseFloat(dim.loaded_qty),
            loaded_weight: parseFloat(dim.loaded_weight) || 0,
          }))
          ?.filter(dim => dim.production_id && !isNaN(dim.loaded_qty)) 
      }))
    }));

    const chargeIds = selectedOrders.flatMap(item =>
      item?.charges ? item?.charges.map(charge => charge?.id) : []
    );

    setIsUpdating(true);

    const raw = JSON.stringify({
      ...(selectedOption === 'Pick-Up' ? { pickup_driver: driverName } : { driver: driverType }),
      ...(selectedOption === 'Pick-Up' ? { pickup_vehicle: vehicleNo } : { vehicle: vehicleID }),
      estimated_arrival: moment(arrDate, "DD/MM/YYYY").format("YYYY-MM-DD"),
      estimated_departure: moment(DepDate, "DD/MM/YYYY").format("YYYY-MM-DD"),
      destination: dest,
      source: source,
      sales_order: transformedOrders,
      route_status: "Pending",
      prepared_by: preparedBy,
      checked_by: checkBy,
      loaded_by: loadedBy,
      chargeIds: chargeIds,
      ...(selectedOption === 'Pick-Up' ? { transportation_type: "Pick-Up" } : {})
    });

    console.log('==============Raw============================');
    console.log(raw);
    console.log('=============================================');

    const url = selectedOption === 'Pick-Up'
      ? `https://gsidev.ordosolution.com/api/production_pickup_route/`
      : `https://gsidev.ordosolution.com/api/production_route/`;

    const message = selectedOption === 'Pick-Up'
      ? `Route added successfully`
      : `Route added successfully`;

    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${userData.token}`);
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    try {
      const response = await fetch(url, requestOptions);
      const result = await response.json();
      if (result.error) {
        Alert.alert("Warning", result.error);
        setLoading(false);
        setIsUpdating(false);
        return;
      }
      Toast.show(message, Toast.LONG);
      if (screen === "edit") {
        navigation.pop(2);
      }
      navigation.pop(1);
    } catch (error) {
      console.log("error", error);
    }
    setLoading(false);
    setIsUpdating(false);
  };

  const renderLabel = (label, value) => {
    if ((Array.isArray(value) && value.length > 0) || (!Array.isArray(value) && value)) {
      return (
        <Text style={[styles.labelll]}>
          {label}
        </Text>
      );
    }
    return null;
  };

  const filterData = (text, setCustomData) => {
    if (text) {
      const filteredData = locationDrop.filter(item =>
        item.name.toLowerCase().includes(text.toLowerCase())
      );
      setCustomData(filteredData);
    } else {
      setCustomData([]);
    }
  };

  const handleSelectItem = (item, setQuery, setCustomData) => {
    setQuery(item.name);
    setCustomData([]);
  };

  useEffect(() => {
    getDropdown();
  }, [])

  const getDropdown = async () => {
    setLoading(true);
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${userData.token}`);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `https://gsidev.ordosolution.com/api/uom_list/`,
      requestOptions
    )
      .then((response) => response.json())
      .then(async (result) => {
        if (result.error) {
        } else {
          setDropdownItems(result || []);
          setDropdownItemsAdd(result || [])
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  };


  const renderRouteDetails = () => {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView showsHorizontalScrollIndicator={false}>
          <View style={{ flex: 1, padding: 16 }}>
            <View style={{ marginBottom: '5%', flex: 1, borderWidth: 1, borderRadius: 11, borderColor: 'lightgray' }}>
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
                    width: "43%",
                    paddingVertical: "1%",
                    backgroundColor:
                      selectedOption === "Delivery" ? Colors.primary : "white",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 10,
                  }}
                >
                  <RadioButton.Android
                    color={"white"}
                    status={selectedOption === "Delivery" ? "checked" : "unchecked"}
                    onPress={() => handleSelect("Delivery")}
                  />
                  <TouchableOpacity onPress={() => handleSelect("Delivery")}>
                    <Text
                      style={{
                        fontFamily: "AvenirNextCyr-Medium",
                        fontSize: 15,
                        color: selectedOption === "Delivery" ? "white" : "black",
                      }}
                    >
                      Delivery
                    </Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    paddingVertical: "1%",
                    backgroundColor:
                      selectedOption === "Pick-Up" ? Colors.primary : "white",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 10,
                    width: "43%",
                  }}>
                  <RadioButton.Android
                    color={"white"}
                    status={selectedOption === "Pick-Up" ? "checked" : "unchecked"}
                    onPress={() => handleSelect("Pick-Up")}
                  />
                  <TouchableOpacity onPress={() => handleSelect("Pick-Up")}>
                    <Text
                      style={{
                        fontFamily: "AvenirNextCyr-Medium",
                        fontSize: 15,
                        color: selectedOption === "Pick-Up" ? "white" : "black",
                      }}
                    >
                      Pick-Up
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={{ flex: 1 }}>

              {renderLabel("Source", isFocus2, source)}
              <Autocomplete
                data={customSource}
                value={source}
                onChangeText={text => {
                  setSource(text);
                  filterData(text, setCustomSource);
                }}
                placeholder="Enter Source"
                placeholderTextColor={Colors.primary}
                style={{ color: 'black' }}
                inputContainerStyle={{
                  borderWidth: 0.5,
                  padding: 8,
                  backgroundColor: '#ffffff',
                  borderRadius: 10,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                }}

                flatListProps={{
                  keyExtractor: item => item.id.toString(),
                  renderItem: ({ item, index }) => (
                    <TouchableOpacity onPress={() => handleSelectItem(item, setSource, setCustomSource)}
                      style={[
                        styles.item,
                        index === customSource.length - 1 && styles.lastItem,
                      ]}
                    >
                      <Text style={{ color: 'black' }}>{item.name}</Text>
                    </TouchableOpacity>
                  ),
                  style: styles.list,
                }}
              />
            </View>

            <View style={{ flex: 1, marginVertical: '4%' }}>
              {renderLabel("Destination", isFocus3, dest)}

              <Autocomplete
                data={customDest}
                value={dest}
                style={{ color: 'black' }}
                onChangeText={text => {
                  setDest(text);
                  filterData(text, setCustomDest);
                }}
                placeholder="Enter Destination"
                placeholderTextColor={Colors.primary}
                inputContainerStyle={{
                  borderWidth: 0.5,
                  padding: 8,
                  backgroundColor: '#ffffff',
                  borderRadius: 10,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                }}

                flatListProps={{
                  keyExtractor: item => item.id.toString(),
                  renderItem: ({ item, index }) => (
                    <TouchableOpacity
                      onPress={() => handleSelectItem(item, setDest, setCustomDest)}
                      style={[
                        styles.item,
                        index === customDest.length - 1 && styles.lastItem,
                      ]}
                    >
                      <Text style={{ color: 'black' }}>{item.name}</Text>
                    </TouchableOpacity>
                  ),
                  style: styles.list,
                }}
              />
            </View>

            {
              selectedOption !== "Delivery" ?
                <View style={{ flex: 1, marginBottom: '4%' }}>
                  <TextInput1
                    style={styles.inputText}
                    value={driverName}
                    autoCapitalize="none"
                    mode="outlined"
                    theme={{ colors: { onSurfaceVariant: "#4b0482" } }}
                    activeOutlineColor="#4b0482"
                    outlineColor="#B6B4B4"
                    textColor="#4b0482"
                    label="Driver Name"
                    onChangeText={(val) => {
                      setDriverName(val);
                    }}
                  />
                </View>
                :
                <View style={{ flex: 1 }}>
                  {renderLabel("Vehicle", isFocus4, vehicleID)}
                  <Dropdown
                    style={[styles.dropdown]}
                    containerStyle={styles.dropdownContainer}
                    placeholderStyle={styles.placeholderStyle}
                    searchPlaceholder="Search"
                    selectedTextStyle={styles.selectedTextStyle}
                    itemTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                    data={vehicleDrop}
                    search
                    maxHeight={400}
                    labelField="label"
                    valueField="value"
                    placeholder={!isFocus4 ? "Select vehicle" : "..."}
                    value={vehicleID}
                    onFocus={() => setIsFocus4(true)}
                    onBlur={() => setIsFocus4(false)}
                    onChange={(item) => {
                      setVehicleId(item.value);
                      setVehicleCapacity(item.capacity)
                      setIsFocus4(false);
                    }}
                  />
                </View>
            }
            {
              selectedOption !== "Delivery" ?
                <View style={{ flex: 1, marginBottom: '7%' }}>
                  <TextInput1
                    style={styles.inputText}
                    value={vehicleNo}
                    autoCapitalize="none"
                    mode="outlined"
                    theme={{ colors: { onSurfaceVariant: "#4b0482" } }}
                    activeOutlineColor="#4b0482"
                    outlineColor="#B6B4B4"
                    textColor="#4b0482"
                    label="Enter Vehicle Name"
                    onChangeText={(val) => {
                      setVehicleNo(val);
                    }}
                  />
                </View>
                :
                <View style={{ flex: 1 }}>
                  {renderLabel("Driver", isFocus5, driverType)}
                  <Dropdown
                    style={[styles.dropdown]}
                    containerStyle={styles.dropdownContainer}
                    placeholderStyle={styles.placeholderStyle}
                    searchPlaceholder="Search"
                    selectedTextStyle={styles.selectedTextStyle}
                    itemTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                    data={driverDrop}
                    maxHeight={400}
                    labelField="label"
                    search
                    valueField="value"
                    placeholder={!isFocus5 ? "Select driver" : "..."}
                    value={driverType}
                    onFocus={() => setIsFocus5(true)}
                    onBlur={() => setIsFocus5(false)}
                    onChange={(item) => {
                      setdriverType(item.value);
                      setIsFocus5(false);
                    }}
                  />
                </View>
            }

            <View style={{}}>
              <InputWithLabel2
                title="Estimated departure"
                value={DepDate}
                onPress={() => setVisible1(true)}
              />

              <DatePickerModal
                mode="single"
                visible={visible1}
                onDismiss={onDismiss1}
                date={selectedDepDate}
                presentationStyle="pageSheet"
                onConfirm={onChange1}
                saveLabel="Save" // optional
                label="Select date" // optional
                animationType="slide" // optional, default is 'slide' on ios/android and 'none' on web
                validRange={{
                  startDate: new Date()
                }}
              />
            </View>

            <View style={{ marginTop: '2%' }}>
              <InputWithLabel2
                title="Estimated Arrival"
                value={arrDate}
                onPress={() => setVisible2(true)}
              />

              <DatePickerModal
                mode="single"
                visible={visible2}
                onDismiss={onDismiss2}
                date={selectedArrDate}
                onConfirm={onChange2}
                presentationStyle="pageSheet"
                saveLabel="Save" // optional
                label="Select date" // optional
                animationType="slide" // optional, default is 'slide' on ios/android and 'none' on web
                validRange={{
                  startDate: new Date()
                }}
              />
            </View>
          </View>

        </ScrollView>
        <View style={styles.rowContainer}>
          <View></View>
          <LinearGradient
            colors={Colors.linearColors}
            start={Colors.start}
            end={Colors.end}
            locations={Colors.ButtonsLocation}
            style={{
              borderRadius: 5,
              paddingHorizontal: "3 %",
              paddingVertical: "2%",

            }}
          >
            <TouchableOpacity
              style={styles.NextPrevBtn}
              onPress={() => handlePress()}
            >
              <Text style={styles.tabButtonText}>
                <AntDesign name="right" size={20} color={`white`} />

              </Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </View>
    )
  }


  const handleCheckboxChange = (item) => {
    const isSelected = selectedOrders.find((customer) => customer.id === item.id);

    if (isSelected) {
      setSelectedOrders((prevselectedItems) =>
        prevselectedItems.filter((customer) => customer.id !== item.id)
      );
    } else {
      setSelectedOrderId(item.id);
      setSelectedOrders((prevselectedItems) => [
        ...prevselectedItems,
        {
          ...item,
          name: item.name,
          id: item.id,
          assignee_name: item.assignee_name,
          product_weight: item?.total_tonnage,
          product_category: item.product_category,
          qty: item.qty,
          product_id: item.product_id,
          soorder_id: item.soorder_id,
          quantity: 1,
          checkWeight: item.product_weight,
          remain: item.remaining_qty,
          company: item?.company?.name,
          charges: item?.charges,
          product_list: screen === "edit"
            ? item?.product_list.map(product => ({
              ...product,
              loaded_weight: product.loaded_weight || 0,
              loaded_bundle: 0,
            }))
            : item?.product_list
              ?.filter(product => product?.remaining_qty !== null && product?.remaining_qty !== '0.0')
              .map(product => ({
                ...product,
                loaded_weight: product.loaded_weight || 0,
                loaded_bundle: 0,
              })),
        },
      ]);
    }
  };

  const handleDimensionChange = (orderId, productId, productionId, key, value) => {
    setSelectedOrders((prevOrders) => {
  
      // Create a copy of the orders for immutability
      const updatedOrders = prevOrders.map((order) => {
        if (order.id === orderId) {
          return {
            ...order,
            product_list: order.product_list.map((product) => {
              if (product.id === productId) {
                return {
                  ...product,
                  dimension: product.dimension.map((dim) => {
                    if (dim.production_id === productionId) {
                      // Check if the loaded_qty exceeds remaining_nos
                      if (key === 'loaded_qty' && parseFloat(value) > dim.remaining_nos) {
                        // Show an alert but allow updating the state
                        Alert.alert(
                          'Alert',`Loaded quantity is greater than Required quantity`
                        );
                      }
                      return { ...dim, [key]: value }; // Update the dimension even if it exceeds
                    }
                    return dim; // Return other dimensions unchanged
                  }),
                };
              }
              return product; // Return other products unchanged
            }),
          };
        }
        return order; // Return other orders unchanged
      });
      return updatedOrders;
    });
  };
  

  const handleDimensionChange1 = (orderId, productId, productionId, key, value) => {
    setSelectedOrders((prevOrders) => {
      // Create a copy of the orders for immutability
      const updatedOrders = prevOrders.map((order) => {
        if (order.id === orderId) {
          return {
            ...order,
            product_list: order.product_list.map((product) => {
              if (product.id === productId) {
                return {
                  ...product,
                  dimension: product.dimension.map((dim) => {
                    if (dim.production_id === productionId) {
                      return { ...dim, [key]: value }; // Update the dimension
                    }
                    return dim; // Return other dimensions unchanged
                  }),
                };
              }
              return product; // Return other products unchanged
            }),
          };
        }
        return order; // Return other orders unchanged
      });
      return updatedOrders;
    });
  };


  const handleAddCharges = (item) => {
    console.log("item", item)
    const chargeTypes = item.charges?.map(charge => ({ type: charge.type })) || [];
    const chargeId = item.charges?.map(charge => (charge.type)) || [];

    if (chargeTypes.length > 0) {
      addCharges(chargeTypes, item.id, chargeId);
    } else {
      Alert.alert(
        "Add Charges",
        "Would you like to add charges?",
        [
          {
            text: "Cancel",
            onPress: () => { },
            style: "cancel",
          },
          {
            text: "Yes",
            onPress: () => {
              setModalVisible(false);
              navigation.navigate("ManageDelDetails", { orderDetails: item, screen: 'SO', ScreenName: 'fleet' });
            },
          },
        ]
      );
    }
  };


  const [expandedOrder1, setExpandedOrder1] = useState(null);

  const toggleExpand1 = (orderId) => {
    setExpandedOrder1(orderId === expandedOrder1 ? null : orderId);
  };

  const toggleExpand = (orderId) => {
    setExpandedOrder(orderId === expandedOrder ? null : orderId);
  };

  const removeProductFromCart = (item) => {
    // Filter out the item to remove it from the array
    const updatedProducts = selectedOrders.filter((product) => product.id !== item.id);
    // console.log("Updated products after removal:", updatedProducts);
    setSelectedOrders(updatedProducts); // Update the state with the new array

    const hasCharges = item.charges && item.charges.length > 0;
    if (hasCharges) {
      // Extract charge types
      const chargeTypes = item.charges.map(charge => ({ type: charge.type }));
      const chargeId = item.charges.map(charge => (charge.id));

      console.log("🚀 ~ removeProductFromCart ~ chargeTypes:---------->", chargeId)

      // Show confirmation alert for removing charges
      Alert.alert(
        "Remove Charges",
        "Deselecting this order will remove any additional charges associated with it. Are you sure you want to proceed?",
        [
          {
            text: "Cancel",
            onPress: () => { },
            style: "cancel",
          },
          {
            text: "Yes",
            onPress: () => {
              // Call your function to handle removing charges with charge types and screen
              addCharges(chargeTypes, item.id, chargeId); // Assuming routeId is available in scope
            },
          },
        ]
      );
    }
  };

  const groupBySalesOrderName = (orders) => {
    return orders.reduce((groups, item) => {
      const group = groups.find(g => g.sales_order_name === item.sales_order_name);
      if (group) {
        group.items.push(item);
      } else {
        groups.push({ sales_order_name: item.sales_order_name, items: [item] });
      }
      return groups;
    }, []);
  };

  const groupedOrders = groupBySalesOrderName(filteredOrders);

  const handleLoadedWeightChange = (orderId, productId, text) => {

    const updatedOrders = selectedOrders.map(order => {
      if (order.id === orderId) {

        return {
          ...order,
          product_list: order.product_list.map(product => {
            if (product.id === productId) {
              return {
                ...product,
                loaded_weight: text,
              };
            }
            return product;
          })
        };
      }
      return order;
    });
    setSelectedOrders(updatedOrders);
  };


  const calculateTotalLoadedWeight = () => {
    const totalWeight = selectedOrders?.reduce((total, order) => {
      return total + order?.product_list?.reduce((productTotal, product) => {
        // Sum loaded_weight from product and dimensions
        const productWeight = parseFloat(product?.loaded_weight) || 0;
        const dimensionWeight = product?.dimension?.reduce((dimensionTotal, dimension) => {
          return dimensionTotal + (parseFloat(dimension?.loaded_weight) || 0);
        }, 0);
        return productTotal + productWeight + dimensionWeight;
      }, 0);
    }, 0);

    setTotalLoadedWeight(totalWeight);
  };
  

  useEffect(() => {
    calculateTotalLoadedWeight()
  }, [selectedOrders])

  const removeProductFromList = (orderId, productId) => {
    const orderToUpdate = selectedOrders.find(order => order.id === orderId);
    const productToDelete = orderToUpdate.product_list.find(product => product.id === productId);

    setRecentlyDeleted({ orderId, product: productToDelete });

    // Remove the product from the list
    setSelectedOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId
          ? {
            ...order,
            product_list: order.product_list.filter(product => product.id !== productId)
          }
          : order
      ).filter(order => order.product_list.length > 0)
    );

    // Set up undo functionality
    if (undoTimeout) clearTimeout(undoTimeout);

    setUndoTimeout(setTimeout(() => {
      setRecentlyDeleted(null);
    }, 10000));
  };

  const undoDelete = () => {
    if (recentlyDeleted) {
      const { orderId, product } = recentlyDeleted;
      setSelectedOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId
            ? { ...order, product_list: [...order.product_list, product] }
            : order
        )
      );
      setRecentlyDeleted(null);
    }
  };

  filteredOrders.forEach(filteredOrder => {
    if (filteredOrder.charges && filteredOrder?.charges?.length > 0) {
      const matchingOrder = selectedOrders.find(order => order.so_id === filteredOrder?.so_id);

      if (matchingOrder) {
        const existingCharges = new Set(matchingOrder.charges.map(charge => charge.type));
        filteredOrder.charges.forEach(charge => {
          if (!existingCharges.has(charge.type)) {
            matchingOrder.charges.push(charge);
          }
        });
      }
    }
  });

  const removeDimensionFromProduct = (orderId, productId, productionId) => {
    const orderToUpdate = selectedOrders.find(order => order.id === orderId);
    const productToUpdate = orderToUpdate.product_list.find(product => product.id === productId);
    const dimensionToDelete = productToUpdate.dimension.find(dim => dim.production_id === productionId);
  
    setRecentlyDeletedDimension({ orderId, productId, dimension: dimensionToDelete });
  
    // Remove the dimension from the list
    setSelectedOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId
          ? {
            ...order,
            product_list: order.product_list.map(product =>
              product.id === productId
                ? {
                  ...product,
                  dimension: product.dimension.filter(dim => dim.production_id !== productionId),
                }
                : product
            ),
          }
          : order
      )
    );
  
    // Set up undo functionality for dimension
    if (undoTimeout) clearTimeout(undoTimeout);
  
    setUndoTimeout(setTimeout(() => {
      setRecentlyDeletedDimension(null);
    }, 10000));
  };
  
  const undoDeleteDimension = () => {
    if (recentlyDeletedDimension) {
      const { orderId, productId, dimension } = recentlyDeletedDimension;
      setSelectedOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId
            ? {
              ...order,
              product_list: order.product_list.map(product =>
                product.id === productId
                  ? {
                    ...product,
                    dimension: [...product.dimension, dimension],
                  }
                  : product
              ),
            }
            : order
        )
      );
      setRecentlyDeletedDimension(null);
    }
  };
  

  console.log("search",search)

  const renderProductSection = () => {
    return (

      <View style={{ marginTop: 5, paddingHorizontal: '1%', flex: 1 }} >
        <View style={styles.card}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={styles.cardTitle}><AntDesign name='shoppingcart' size={22} color={`black`} />  Orders</Text>
            <LinearGradient
              colors={Colors.linearColors}
              start={Colors.start}
              end={Colors.end}
              locations={Colors.ButtonsLocation}
              style={{
                borderRadius: 8,
              }}
            >
              <TouchableOpacity style={{ ...styles.submitButton1 }}
                onPress={toggleModal}
              >
                <Text style={styles.submitButtonText}>Add</Text>
              </TouchableOpacity>
            </LinearGradient>
            {/* <FontAwesome name='angle-down' size={20} color={`black`} /> */}
          </View>
          {/* {expanded1 && ( */}
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
          >

            <View style={styles.expandedContent}>

              <View style={styles.ProductListContainer}>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                  <FlatList
                    showsVerticalScrollIndicator={false}
                    data={selectedOrders}
                    keyboardShouldPersistTaps='handled'
                    renderItem={({ item }) => (
                      <View style={styles.elementsView}>
                        {item?.charges?.length === 0 &&
                          <TouchableOpacity
                            style={styles.addButton}
                            onPress={() => handleAddCharges(item)}
                          >
                            <FontAwesome name="rupee" size={20} color="white" />
                          </TouchableOpacity>
                        }

                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                          <View style={{
                            flex: 1,
                            marginLeft: 5,
                          }}>
                            <View style={{ flexDirection: 'column', justifyContent: 'space-between', marginTop: '2%' }}>
                              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>

                                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', gap: 4 }}>
                                  <Text style={{ color: Colors.primary, fontSize: 14, fontFamily: 'AvenirNextCyr-Medium', marginTop: 5, }}>{item.name ? item.name : item.product_name}</Text>
                                  <TouchableOpacity onPress={() => {
                                    setSelectedItem(item);
                                    setModalVisibleBill(true);
                                  }}>

                                    <MaterialCommunityIcons name='information-outline' size={20} color={Colors.black} />
                                  </TouchableOpacity>
                                </View>

                                <TouchableOpacity onPress={() => removeProductFromCart(item)}>
                                  <MaterialCommunityIcons name='trash-can' size={20} color={Colors.black} />
                                </TouchableOpacity>
                              </View>
                              <Text style={{ color: Colors.black, fontSize: 13, fontFamily: 'AvenirNextCyr-Medium', marginTop: 3 }}><Text style={{ fontFamily: 'AvenirNextCyr-Bold' }}>Company: </Text>{item?.company_name ? item?.company_name : item?.company_name}</Text>
                              {item.charges.map((charge, index) => (
                                <Text key={index} style={{ color: Colors.black, fontSize: 13, fontFamily: 'AvenirNextCyr-Medium' }}>
                                  <Text style={{ color: 'black', fontSize: 13, fontFamily: 'AvenirNextCyr-Bold' }}>{charge.type} : </Text> ₹{parseFloat(charge.charges).toFixed(2)}
                                </Text>
                              ))}
                              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>

                                <Text style={{ color: Colors.black, fontSize: 13, fontFamily: 'AvenirNextCyr-Medium', marginTop: 3 }}></Text>
                                <Pressable onPress={() => toggleExpand1(item.id)}>
                                  <Text style={{ color: Colors.primary, fontSize: 13, fontFamily: 'AvenirNextCyr-Bold', marginTop: 3 }}>Load Weight</Text>
                                </Pressable>
                              </View>
                              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 3 }}>
                                <Text style={{ color: 'black', fontSize: 14, fontFamily: 'AvenirNextCyr-Medium', }}>{item.assignee_name}</Text>
                                <Pressable onPress={() => toggleExpand1(item.id)}>
                                  <AntDesign name={expandedOrder1 === item.id ? 'up' : 'down'} size={20} color={Colors.primary} />
                                </Pressable>
                              </View>
                              {/* Additional row data to expand/collapse */}
                              {expandedOrder1 === item.id && (

                                <View style={{ marginTop: 3 }}>
                                  <View>
                                    <Text style={{
                                      color: Colors.black,
                                      fontSize: 14,
                                      fontFamily: 'AvenirNextCyr-Bold', marginBottom: 3
                                    }}>Products</Text>
                                  </View>
                                  {/* Map over the product list */}

                                  {item?.product_list.map((product, index) => (
                                    <View key={product?.id}>
                                      <View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                                          <View style={{ flexDirection: 'column', width: '90%' }}>
                                            <Text style={styles.productName}>{product?.name} ({product.id})</Text>
                                            {
                                              product.product_remarks &&
                                              <Text style={{ color: 'green' }}>{product.product_remarks}</Text>
                                            }
                                             {
                                               product.stock_comments &&
                                              <Text style={{color:'black',fontFamily: 'AvenirNextCyr-Bold'}}>Stock:<Text style={{color:'black',fontFamily: 'AvenirNextCyr-Medium' }}>{product.stock_comments}</Text></Text>
                                              }
                                          </View>
                                          <TouchableOpacity onPress={() => removeProductFromList(item?.id, product?.id)}>
                                            <MaterialCommunityIcons name="trash-can" size={20} color={Colors.black} />
                                          </TouchableOpacity>
                                        </View>
                                        {product?.name !== 'BASE PLATE' && (
                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: '2%' }}>
                                          <View style={{ flexDirection: 'column' }}>
                                            <Text style={styles.productQty}><Text style={{ color: Colors.black, fontSize: 13, fontFamily: 'AvenirNextCyr-Bold' }}>Actual Weight: </Text>{product?.production_weight} kg</Text>
                                            <Text style={{ color: Colors.black, fontSize: 13, fontFamily: 'AvenirNextCyr-Bold', marginBottom: '3%' }}>Loaded Weight(in kgs):</Text>
                                          </View>

                                          <TextInput2
                                            style={{ borderWidth: 1, borderColor: '#ccc', padding: 6, backgroundColor: '#fff', color: 'black', width: 80 }}
                                            value={product.loaded_weight ? product.loaded_weight.toString() : ''}
                                            placeholder="00.00"
                                            placeholderTextColor="gray"
                                            onChangeText={(text, rawText) => handleLoadedWeightChange(item.id, product.id, text)}
                                            keyboardShouldPersistTaps='always'
                                            returnKeyType="done"
                                            keyboardType="decimal-pad"
                                          />
                                        </View>
                                        )}
                                        <Text style={{ color: Colors.black, fontSize: 16, fontFamily: 'AvenirNextCyr-Bold', marginBottom: 3, marginTop: '4%' }}>Dimensions</Text>
                                        {product.dimension.map((dim) => (
                                          <View style={{ flexDirection: 'column'}}>
                                           <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: '2%' }}>
                                           <TouchableOpacity
                                              onPress={() => removeDimensionFromProduct(item.id, product.id, dim.production_id)}
                                            >
                                              <MaterialCommunityIcons name="trash-can" size={20} color={Colors.black} />
                                            </TouchableOpacity>
                                              {product?.name === 'BASE PLATE' ? (
                                                <Text
                                                  style={{
                                                    color: Colors.black,
                                                    fontSize: 14,
                                                    fontFamily: 'AvenirNextCyr-Bold',
                                                    marginBottom: '3%',
                                                    flex:1,
                                                  }}
                                                  numberOfLines={2}
                                                >
                                                  {dim?.height_inch} X {dim?.width_ft} X {dim?.thickness ? dim?.thickness : '-'} MM -{' '}
                                                  <Text style={{ fontFamily: 'AvenirNextCyr-Medium' }}>{dim?.remaining_nos}</Text>
                                                </Text>
                                              ) : (
                                                <Text
                                                  style={{
                                                    color: Colors.black,
                                                    fontSize: 14,
                                                    fontFamily: 'AvenirNextCyr-Bold',
                                                    marginBottom: '3%',
                                                  }}
                                                >
                                                  {dim?.width_ft}' {dim?.height_inch} '' -{' '}
                                                  <Text style={{ fontFamily: 'AvenirNextCyr-Medium' }}>{dim?.remaining_nos}</Text>
                                                </Text>
                                              )}

                                            <TextInput2
                                              style={{
                                                borderWidth: 1,
                                                borderColor: '#ccc',
                                                padding: 6,
                                                backgroundColor: '#fff',
                                                color: 'black',
                                                width: 80
                                              }}
                                              value={dim?.loaded_qty ? dim?.loaded_qty.toString() : ''}
                                              placeholder="00.00"
                                              placeholderTextColor="gray"
                                              onChangeText={(text) => handleDimensionChange(item.id, product.id, dim.production_id, 'loaded_qty', text)}
                                              returnKeyType="done"
                                              keyboardType="decimal-pad"
                                            />
                                            
                                            </View>
                                            {product?.name === 'BASE PLATE' && (
                                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: '2%' }}>
                                                  <Text
                                                    style={{
                                                      color: Colors.black,
                                                      fontSize: 13,
                                                      fontFamily: 'AvenirNextCyr-Bold',
                                                      marginBottom: '3%',
                                                    }}>
                                                    Loaded Weight - ({dim?.weight} Kg)
                                                  </Text>
                                              
                                                  <TextInput2
                                                    style={{
                                                      borderWidth: 1,
                                                      borderColor: '#ccc',
                                                      padding: 6,
                                                      backgroundColor: '#fff',
                                                      color: 'black',
                                                      width: 80
                                                    }}
                                                    value={dim?.loaded_weight ? dim?.loaded_weight.toString() : ''}
                                                    placeholder="00.00"
                                                    placeholderTextColor="gray"
                                                    onChangeText={(text) => handleDimensionChange1(item.id, product.id, dim.production_id, 'loaded_weight', text)}
                                                    returnKeyType="done"
                                                    keyboardType="decimal-pad"
                                                  />
                                                </View>
                                              )}
                                          </View>
                                        ))}
                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: '2%' }}>
                                          <View style={{ flexDirection: 'column' }}>
                                            <Text style={{ color: Colors.black, fontSize: 13, fontFamily: 'AvenirNextCyr-Bold', marginBottom: '3%' }}></Text>
                                          </View>

                                        </View>
                                      </View>
                                      {index < item.product_list.length - 1 && <View style={styles.productSeparator} />}
                                    </View>
                                  ))}
                                </View>
                              )}
                            </View>
                          </View>
                        </View>
                      </View>
                    )}
                    keyExtractor={(item) => item.id ? item.id.toString() : Math.random().toString()}
                    ListEmptyComponent={() => (
                      <View style={styles.noProductsContainer}>
                        <Text style={styles.noProductsText}>No Orders</Text>
                      </View>
                    )}
                  />
                </ScrollView>

              </View>

              <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
              >

                <SafeAreaView style={{ flex: 1, backgroundColor: 'grey', justifyContent: 'center', paddingHorizontal: 10 }}>
                  <View style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: 5, borderRadius: 8 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                      <View>

                      </View>
                      <Text style={{ alignSelf: 'center', fontSize: 20, color: 'black', fontFamily: 'AvenirNextCyr-Medium', marginVertical: 10 }}>Select Orders</Text>
                      <TouchableOpacity style={{ marginRight: 10 }} onPress={() => {
                     setSearch('');
                     setOffset(0);
                     setModalVisible(false);
                     setFilteredOrders([]); // reset to prevent stale/duplicated display
                     setAllOrders([]);
                      }}>
                        <AntDesign name='close' size={20} color={`black`} />
                      </TouchableOpacity>
                    </View>



                    <View style={{ flexDirection: 'row' }}>
                      <View style={styles.modalSearchContainer}>
                        <TextInput2
                          style={styles.input}
                          value={search}
                          placeholder="Search order"
                          placeholderTextColor="gray"
                          onChangeText={(val) => {
                            setOffset(0); // ✅ Reset offset
                            setSearch(val); // ✅ Update search term
                          }}
                          keyboardShouldPersistTaps='always'
                        />
                        <TouchableOpacity style={styles.searchButton}>
                          <AntDesign name="search1" size={20} color="black" />
                        </TouchableOpacity>
                      </View>
                      <TouchableOpacity
  style={{
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 16,
    elevation: 5,
    flex: 0.2,
    marginLeft: 10,
    ...globalStyles.border
  }}
  onPress={() => {
    if (search != '') {
      setSearch('');
      setOffset(0);
      setFilteredOrders([]);
    }else{
      console.log("hy")
    }
  }}
>
  <Text style={{ color: '#6B1594', fontFamily: 'AvenirNextCyr-Medium', fontSize: 14 }}>
    Clear
  </Text>
</TouchableOpacity>

                    </View>

                    {
                      loadcustomData ? <DarkLoading /> :

                        <FlatList
                          showsVerticalScrollIndicator={false}
                          data={groupedOrders}
                          keyboardShouldPersistTaps='handled'
                          renderItem={({ item }) => (
                            <View style={styles.groupContainer}>
                              {item.items.map(order => (
                                <Pressable style={styles.elementsView}
                                  key={order?.id}
                                  onPress={() => handleCheckboxChange(order)}
                                >
                                  <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                    <View style={{
                                      flex: 1
                                    }}>
                                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Text style={{ color: Colors.primary, fontSize: 15, fontFamily: 'AvenirNextCyr-Bold' }}>{order?.name}</Text>
                                        <Checkbox.Android
                                          color={Colors.primary}
                                          status={
                                            selectedOrders.some((customer) => customer?.id === order?.id) ? 'checked' : 'unchecked'
                                          }
                                        />
                                      </View>
                                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: '1%' }}>
                                        <Text style={{ color: 'black', fontSize: 13, fontFamily: 'AvenirNextCyr-Bold', width: '85%', marginBottom: '1%' }}>{order.assignee_name}</Text>
                                      </View>
                                      {
                                        order.company?.name && (
                                          <Text style={{ color: Colors.black, fontSize: 15, fontFamily: 'AvenirNextCyr-Medium', marginTop: 4 }}>{order.company?.name}</Text>
                                        )
                                      }
                                      {order.charges.map((charge, index) => (
                                        <Text key={index} style={{ color: Colors.black, fontSize: 13, fontFamily: 'AvenirNextCyr-Medium' }}>
                                          <Text style={{ color: 'black', fontSize: 13, fontFamily: 'AvenirNextCyr-Bold' }}>{charge.type} : </Text> ₹{parseFloat(charge.charges).toFixed(2)}
                                        </Text>
                                      ))}

                                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Text style={{ color: Colors.black, fontSize: 13, fontFamily: 'AvenirNextCyr-Medium', fontStyle: 'italic', width: '85%' }}>{order.assigne_to_address?.address}, {order.assigne_to_address?.state} - {order.assigne_to_address?.postal_code}</Text>
                                        {/* Ant Design arrow down icon */}
                                        <Pressable onPress={() => toggleExpand(order.id)} style={{ width: 30, height: 30 }}>
                                          <AntDesign name={expandedOrder === order.id ? 'up' : 'down'} size={25} color={Colors.primary} />
                                        </Pressable>
                                      </View>
                                      {/* Additional row data to expand/collapse */}
                                      {expandedOrder === order.id && (
                                        <View style={{ marginTop: 8 }}>
                                          <View>
                                            <Text style={{
                                              color: Colors.black,
                                              fontSize: 14,
                                              fontFamily: 'AvenirNextCyr-Bold'
                                            }}>Products</Text>

                                          </View>
                                          {/* Map over the product list */}
                                          {order.product_list.map((product, index) => (
                                            <View key={product.id}>
                                              <View style={styles.productContainer}>
                                                <Text style={styles.productName}>{product?.name} ({product?.id})</Text>
                                                <Text style={styles.productQty}>{product?.remaining_qty} {product?.loaded_uom}</Text>
                                              </View>
                                              {product.dimension?.map((dim, index) => (
                                                <View key={index}>
                                                 {product?.name === 'BASE PLATE' ? (
                                                <Text
                                                  style={{
                                                    color: Colors.black,
                                                    fontSize: 13,
                                                    fontFamily: 'AvenirNextCyr-Bold',
                                                    marginBottom: '3%',
                                                  }}
                                                >
                                                  {dim?.height_inch} X {dim?.width_ft} X {dim?.thickness ? dim?.thickness : '-'} MM -{' '}
                                                  <Text style={{ fontFamily: 'AvenirNextCyr-Medium', color: Colors.black, }}>{dim?.remaining_nos} NOS</Text>
                                                </Text>
                                              ) : (
                                                <Text
                                                  style={{
                                                    color: Colors.black,
                                                    fontSize: 14,
                                                    fontFamily: 'AvenirNextCyr-Bold',
                                                    marginBottom: '3%',
                                                  }}
                                                >
                                                  {dim?.width_ft}' {dim?.height_inch}'' -{' '}
                                                  <Text style={{ fontFamily: 'AvenirNextCyr-Medium' }}>{dim?.remaining_nos}</Text>
                                                </Text>
                                              )}
                                                </View>
                                              ))}
                                              
                                              {product?.product_remarks &&
                                                <Text style={{
                                                  color: 'green',
                                                  fontSize: 14,
                                                  fontFamily: 'AvenirNextCyr-Medium'
                                                }}>{product?.product_remarks}</Text>
                                              }
                                              {product?.stock_comments && product?.stock_comments != "None" &&

                                                <Text style={{
                                                  color: Colors.black,
                                                  fontSize: 14,
                                                  fontFamily: 'AvenirNextCyr-Bold'
                                                }}>Stock Remarks: <Text style={styles.productQty}>{product?.stock_comments}</Text></Text>
                                              }
                                              {/* Line between products except the last one */}
                                              {index < order?.product_list?.length - 1 && <View style={styles.productSeparator} />}
                                            </View>
                                          ))}
                                        </View>
                                      )}
                                    </View>
                                  </View>
                                </Pressable>
                              ))}
                            </View>
                          )}

                          keyExtractor={(item) => item.id ? item.id.toString() : Math.random().toString()}
                          ListEmptyComponent={() => (
                            <View style={styles.noProductsContainer}>
                              <Text style={styles.noProductsText}>No Orders Available</Text>
                            </View>
                          )}
                                ListFooterComponent={
                                  groupedOrders?.length < 1
                                      ? null
                                      : loadingMore ? <ActivityIndicator style={{ paddingVertical: 5 }} /> : <Button onPress={handleLoadMore}>Load More</Button>
                              }
                        />
                    }
                  </View>
                </SafeAreaView>
              </Modal>

            </View>
          </KeyboardAvoidingView>

        </View>
        <View style={{ marginTop: 10 }}>
          {recentlyDeleted && (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ffe6df', padding: '4%', borderRadius: 15 }}>
              <View style={{ flexDirection: 'row', gap: 5 }}>
                <FontAwesome name='warning' size={20} color={'#f38e62'} />
                <Text style={{ color: Colors.black, fontSize: 16 }}>Product removed. <Text style={{ color: Colors.black, fontSize: 16 }}>Undo?</Text></Text>
              </View>
              <TouchableOpacity onPress={undoDelete}>
                <Text style={{ color: Colors.black, fontSize: 16, fontWeight: 'bold', }}>Undo</Text>
              </TouchableOpacity>
            </View>
          )}

          {recentlyDeletedDimension && (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ffe6df', padding: '4%', borderRadius: 15 }}>
            <View style={{ flexDirection: 'row', gap: 5 }}>
              <FontAwesome name='warning' size={20} color={'#f38e62'} />
              <Text style={{ color: Colors.black, fontSize: 16 }}>Dimension removed. <Text style={{ color: Colors.black, fontSize: 16 }}>Undo?</Text></Text>
            </View>
            <TouchableOpacity onPress={undoDeleteDimension}>
              <Text style={{ color: Colors.black, fontSize: 16, fontWeight: 'bold', }}>Undo</Text>
            </TouchableOpacity>
          </View>
          )}
        </View>

        <View style={styles.rowContainer}>
          <LinearGradient
            colors={Colors.linearColors}
            start={Colors.start}
            end={Colors.end}
            locations={Colors.ButtonsLocation}
            style={{
              borderRadius: 5,
              paddingHorizontal: "3%",
              paddingVertical: "2%",
            }}
          >
            <TouchableOpacity
              style={styles.NextPrevBtn}
              onPress={() => setCurrentView("Route")}
            >
              <Text style={styles.tabButtonText}>
                <AntDesign name="left" size={20} color={`white`} />
              </Text>
            </TouchableOpacity>
          </LinearGradient>
          
          <Text style={{
  fontSize: 14,
  color: "gray",
  fontFamily: "AvenirNextCyr-Medium",
  textAlign: "center"
}}>
  Total Weight Loaded : 
  <Text style={{
    fontSize: 16,
    color: "black",
    fontFamily: "AvenirNextCyr-Bold",
    textAlign: "center"
  }}>
    {parseFloat(totalLoadedWeight).toFixed(3)}Kg
  </Text>
</Text>


        </View>

        { selectedOrders.length > 0 && selectedOrders?.product_list?.length !== 0 && !hasError && hasQuantityField && (

          <LinearGradient
            colors={Colors.linearColors}
            start={Colors.start}
            end={Colors.end}
            locations={Colors.ButtonsLocation}
            style={{
              borderRadius: ms(15),
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
              marginTop: "8%",
            }}
          >
            <TouchableOpacity style={styles.buttonContainer1} onPress={() => { checkMissingAndExcessProducts() }}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </LinearGradient>
        )}
      </View>
    )
  }

  const [currentView, setCurrentView] = useState("Route");

  return (

    <AutocompleteDropdownContextProvider>
      <LinearGradient
        colors={Colors.linearColors}
        start={Colors.start}
        end={Colors.end}
        locations={Colors.location}
        style={{
          backgroundColor: Colors.primary,
          borderColor: Colors.primary,
          justifyContent: "center",
          alignItems: "center",

        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
            height: "10%",
            alignItems: "center",
            paddingHorizontal: "5%",

          }}
        >
          <TouchableOpacity onPress={() => navigation.pop(2)}>
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
            Add Route
          </Text>
          <View style={{ width: "6%" }} />
        </View>

        <View
          style={{
            height: "90%",
            backgroundColor: "white",
            width: "100%",
            borderTopEndRadius: 20,
            borderTopStartRadius: 20,
            padding: "3%",
            paddingTop: "6%",
            justifyContent: "space-between",
          }}
        >

          <View style={styles.buttonContainer}>

            <TouchableOpacity
              style={
                currentView === "Route"
                  ? [styles.tabButton, styles.activeTabButton]
                  : styles.tabButton
              }
              onPress={() =>
                setCurrentView("Route") && styles.activeTabButton
              }>
            </TouchableOpacity>

            <TouchableOpacity
              style={
                currentView === "Orders"
                  ? [styles.tabButton, styles.activeTabButton]
                  : styles.tabButton
              }
              onPress={() =>
                handleBack() && styles.activeTabButton
              }
            >
            </TouchableOpacity>
          </View>
          <Text style={styles.pageIndicator}>
            {currentView === "Route" ? "Page 1 of 2" : "Page 2 of 2"}
          </Text>

          {currentView === "Route" && renderRouteDetails()}
          {currentView === "Orders" && renderProductSection()}
        </View>

        <LoadingView visible={loading} message="Please Wait ..." />

      </LinearGradient>
      <Modal visible={modalVisible1} transparent>
        <View style={styles.modalContainer1}>
          <View style={styles.modalContent1}>
            <TouchableOpacity
              style={styles.closeIcon}
              onPress={() => setModalVisible1(false)}>
              <AntDesign name="close" color="black" size={25} />
            </TouchableOpacity>
            <Text style={styles.ModalText1}>Dispatch Details:</Text>

            <View style={{ marginHorizontal: '1%', marginTop: '3%', gap: 10 }}>
              <TextInput1
                style={styles.inputText}
                value={checkBy}
                autoCapitalize="none"
                mode="outlined"
                theme={{ colors: { onSurfaceVariant: "#4b0482" } }}
                activeOutlineColor="#4b0482"
                outlineColor="#B6B4B4"
                textColor="#4b0482"
                label="Checked By"
                onChangeText={val => {
                  setCheckBy(val);
                }}
              />

              <TextInput1
                style={styles.inputText}
                value={preparedBy}
                autoCapitalize="none"
                theme={{ colors: { onSurfaceVariant: "#4b0482" } }}
                activeOutlineColor="#4b0482"
                outlineColor="#B6B4B4"
                textColor="#4b0482"
                mode="outlined"
                label="Prepared By"
                onChangeText={val => {
                  setPreparedBy(val);
                }}
              />

              <TextInput1
                style={styles.inputText}
                value={loadedBy}
                autoCapitalize="none"
                theme={{ colors: { onSurfaceVariant: "#4b0482" } }}
                activeOutlineColor="#4b0482"
                outlineColor="#B6B4B4"
                textColor="#4b0482"
                mode="outlined"
                label="loaded By"
                onChangeText={val => {
                  setLoadedBy(val);
                }}
              />

              <LinearGradient
                colors={Colors.linearColors}
                start={Colors.start}
                end={Colors.end}
                locations={Colors.ButtonsLocation}
                style={{
                  borderRadius: 20,
                  marginTop: "4%",
                }}
              >
                <TouchableOpacity
                  onPress={() => { handleSubmit() }}
                  style={{
                    paddingVertical: "4%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {isUpdating ? (
                    <ActivityIndicator size={28} color={Colors.white} />
                  ) : (
                    <Text
                      style={{ fontFamily: "AvenirNextCyr-Bold", color: "white" }}
                    >
                      Submit
                    </Text>
                  )}
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal to display the Order Image */}
      <Modal visible={modalVisibleBill} transparent={true}>
        <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', flex: 1, justifyContent: 'center' }}>
          <View style={{ backgroundColor: 'white', padding: '2%', borderRadius: 15, flex: 0.6, marginHorizontal: '3%' }}>
            {/* Header with close button */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 5 }}>
              <Text style={{ fontFamily: 'AvenirNextCyr-Bold', fontSize: 18, textAlign: 'center' }}></Text>

              <Text style={{ fontFamily: 'AvenirNextCyr-Bold', fontSize: 18, textAlign: 'center', color: Colors.primary }}>SO Details</Text>
              <TouchableOpacity onPress={() => { setModalVisibleBill(false) }}>
                <AntDesign name="close" color="black" size={25} />
              </TouchableOpacity>
            </View>
            <View style={{ ...styles.row, marginVertical: 8 }}>
              <Text style={{ ...styles.title }}>Site Address : </Text>
              <Text style={{ ...styles.value }} numberOfLines={2}>{selectedItem?.site_address}</Text>
            </View>
            <Text style={{ fontFamily: 'AvenirNextCyr-Bold', fontSize: 16 }}>Order Image : </Text>

            {/* Image section right after the header */}
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ alignItems: 'center' }}
              style={{ flex: 1 }} >
              {selectedItem?.order_images?.length > 0 ? (
                selectedItem.order_images.map((imageUri, index) => (
                  <View>
            <View key={index} style={{ width: windowWidth -40, height: '100%', paddingHorizontal: 10 }}>
              <WebView
                source={{ uri: imageUri }}
                style={{ flex: 1}}
                scalesPageToFit={true}
                scrollEnabled={true}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                startInLoadingState={true}
                automaticallyAdjustContentInsets={false}
                useWebKit={true}
                mixedContentMode="compatibility"
                onLoadStart={() => console.log("Loading image...")}
                onLoadEnd={() => console.log("Image loaded")}
                androidHardwareAccelerationDisabled={true}
                allowFileAccess={true}
                allowsFullscreenVideo={true}
                allowsInlineMediaPlayback={true}
                allowsAirPlayForMediaPlayback={true}
                allowsBackForwardNavigationGestures={true}
              />
            </View>
            <TouchableOpacity onPress={() => downloadImage(imageUri)}  style={{
              backgroundColor: "#0077c0",
              padding: "3%",
              borderRadius: 10,
              marginHorizontal: "3%",
              flexDirection:'row',
              marginTop:'2%',
              alignItems:'center',
              justifyContent:'center',
              gap:9,
              marginBottom:'20%'
            }}>
          <AntDesign name="download" color="white" size={20} />
          <Text 
            style={{
              fontFamily: 'AvenirNextCyr-Medium',
              fontSize: 16,
              color: 'white',
            }}>Download</Text>
        </TouchableOpacity>
        </View>
                ))
              ) : (
                <View style={{ alignSelf: 'center', }}>
                  <Text
                    style={{
                      fontFamily: 'AvenirNextCyr-Medium',
                      fontSize: 16,
                      color: 'black',
                    }}>                                  No Image</Text>
                </View>

              )}
            </ScrollView>
          </View>
        </View>
      </Modal>


    </AutocompleteDropdownContextProvider>
  );
};

const styles = StyleSheet.create({
  textInput: {
    borderColor: "#dedede",
    borderWidth: 1,
    backgroundColor: "white",
    height: 50,
    marginBottom: "5%",
    padding: "2%",
    paddingLeft: "2%",
    fontFamily: "AvenirNextCyr-Medium",
    borderRadius: 10,
  },
  label: {
    fontSize: 16,
    color: Colors.primary,
    fontFamily: "AvenirNextCyr-Medium",
  },
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: '100%',
  },
  buttonText: {
    fontFamily: "AvenirNextCyr-Medium",
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  scrollViewContent: {
    flexGrow: 1,
    backgroundColor: "#f5f5f5",
    borderTopEndRadius: 50,
    borderTopStartRadius: 50,
    padding: 20,
    paddingTop: 20,
    paddingBottom: 60,
  },
  placeholderStyle: {
    fontSize: 14,
    fontFamily: "AvenirNextCyr-Medium",
    color: Colors.primary,
  },
  dropdownContainer: {
    backgroundColor: "white",
  },
  selectedTextStyle: {
    fontSize: 16,
    fontFamily: "AvenirNextCyr-Medium",
    color: 'black'
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    color: 'black'
  },
  labelText: {
    fontFamily: "AvenirNextCyr-Medium",
    color: Colors.primary,
    fontSize: 16,
  },
  inputContainer: {
    borderColor: "#cecece",
    borderWidth: 1,
    backgroundColor: "white",
    height: 50,
    marginBottom: 15,
    fontFamily: "AvenirNextCyr-Medium",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 10,
    width: "100%",
  },
  dropdown: {
    height: 50,
    borderColor: "#dedede",
    borderWidth: 1,
    paddingHorizontal: 8,
    marginBottom: "5%",
    borderRadius: 10,
    backgroundColor: "white",
  },
  input2: {
    fontFamily: "AvenirNextCyr-Medium",
    padding: 8,
    flex: 1,
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
    paddingVertical: "2%",
    borderRadius: 5,
    height: 0.5
  },
  buttonContainer1: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
    paddingVertical: "2%",
    borderRadius: 5,
    width: '100%'
  },
  tabButton: {
    paddingHorizontal: "2%",
    borderRadius: 5,
    fontSize: 10,
    backgroundColor: "lightgray",
    height: 10,
    width: '48%'

  },
  tabButtonText: {
    color: "white",
    fontFamily: "AvenirNextCyr-Medium",
  },
  activeTabButton: {
    backgroundColor: Colors.primary,
    height: 10,
    borderRadius: 5,
    width: '48%'

  },
  NextPrevBtn: {
    width: '100%'
  },
  progress1: {
    height: 7,
    borderRadius: 9,
    backgroundColor: Colors.primary,
    width: '20%',
    marginRight: '2%',
    marginTop: '5%'
  },
  progress2: {
    height: 7,
    borderRadius: 9,
    backgroundColor: Colors.lightGrey,
    width: '20%',
    marginRight: '2%',
    marginTop: '5%'
  },
  progress3: {
    height: 7,
    borderRadius: 9,
    backgroundColor: 'lightgrey',
    width: '20%',
    marginRight: '2%',
    marginTop: '5%'
  },
  pageIndicator: {
    // textAlign: 'flex-end',
    marginBottom: 1,
    fontSize: 14,
    fontFamily: "AvenirNextCyr-Medium",
    textAlign: 'right',
    paddingRight: 5
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
    marginTop: 20,
  },

  input: {
    flex: 1,
    fontSize: 16,
    marginRight: 10,
  },
  searchButton: {
    padding: 5,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2%",
  },
  card: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    flex: 1
  },
  cardTitle: {
    fontSize: 15,
    fontFamily: "AvenirNextCyr-Medium",
    color: Colors.black
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 12,
    fontFamily: "AvenirNextCyr-Medium",
  },
  elementsView: {
    backgroundColor: "white",
    margin: 5,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 5,
    ...globalStyles.border,
    padding: 16,
  },
  ProductListContainer: {
  },
  imageView: {
    width: 80,
    height: 80,
    // borderRadius: 40,
    // marginTop: 20,
    // marginBottom: 10
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
    marginTop: 20,
  },
  modalSearchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "lightgray",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    flex: 1,
    height: 45,
  },

  searchButton: {
    padding: 5,
  },
  groupContainer: {
    marginBottom: '1%',
  },
  groupTitle: {
    fontSize: 18,
    marginBottom: '1%',
    marginLeft: '3%',
    fontFamily: "AvenirNextCyr-Bold",

  },
  labelll: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 4,
    top: -10,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
    fontFamily: 'AvenirNextCyr-Medium',
    color: Colors.primary
  },
  list: {
    backgroundColor: '#ffffff',
    // borderRadius: 10,
    marginHorizontal: '0%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
    padding: '1%',
    // paddingHorizontal:'2%'

  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',

  },
  lastItem: {
    borderBottomWidth: 0,
  },
  productContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
    // borderBottomWidth: 0.7,
    // borderBottomColor: '#A9A9A9',
  },
  productName: {
    color: Colors.primary,
    fontSize: 13,
    fontFamily: 'AvenirNextCyr-Bold',
    flex: 1,
    flexWrap: 'wrap'
  },
  productQty: {
    color: Colors.black,
    fontSize: 13,
    fontFamily: 'AvenirNextCyr-bold'
  },
  productSeparator: {
    borderBottomWidth: 0.7,
    borderBottomColor: '#A9A9A9',
    marginVertical: '3%'
  }, modalContainer1: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContent1: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 30,
    width: '90%'
  },
  modalContent2: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    width: '95%'
  },
  ModalText1: {
    fontSize: 18,
    fontFamily: 'AvenirNextCyr-Bold',
    paddingBottom: 5,
    color: Colors.black,
    width: '90%'
  },
  closeIcon: {
    position: 'absolute',
    top: 5,
    right: 10,
    padding: 5,
  },
  addButton: {
    position: 'absolute',
    top: -5, // Adjust according to your need
    left: -5, // Adjust according to your need
    backgroundColor: 'green',
    borderRadius: 30,
    width: 26, // Adjust size
    height: 26, // Adjust size
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    padding: 2
  },
  submitButton1: {
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
    padding: '7%',
  },
  row: {
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  title: {
    fontFamily: 'AvenirNextCyr-Bold',
    fontSize: 16,
    color: Colors.black
  },
  value: {
    fontFamily: 'AvenirNextCyr-Medium',
    fontSize: 15,
    color: Colors.black

  }, inputText: {
    color: "black",
    fontFamily: "AvenirNextCyr-Medium",
    backgroundColor: 'white',
    borderRadius: 11
  },
  dimensionInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 6,
    marginHorizontal: 5,
    backgroundColor: '#fff',
    color: 'black',
    width: 80,
  },
});

export default ProductionDispatch;
