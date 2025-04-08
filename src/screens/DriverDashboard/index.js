import React, { useState, useContext, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Alert,
  ScrollView,
  Dimensions,
  Modal,
  TextInput,
  Button
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Colors from "../../constants/Colors";
import Feather from "react-native-vector-icons/Feather";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import { AuthContext } from "../../Context/AuthContext";
import DarkLoading from "../../styles/DarkLoading";
import { useFocusEffect } from "@react-navigation/native";
import SwipeButton from "rn-swipe-button";
import Toast from "react-native-simple-toast";
import MapboxGL from "@rnmapbox/maps";
import { AnimatedFAB } from "react-native-paper";
import { locationPermission } from "../../utils/Helper";
import Geolocation from "react-native-geolocation-service";
import VersionModel from '../../components/versionModel';
import { cameraPermission } from "../../utils/Helper";
import { launchCamera } from "react-native-image-picker";
import RNFS from 'react-native-fs';
import { Searchbar ,ActivityIndicator } from "react-native-paper";

const DriverDashboard = ({ navigation }) => {
  const { userData, logout ,setToken} = useContext(AuthContext);
  const [vehicleData, setVehicleData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  let deviceWidth = Dimensions.get("window").width;
  const [screenWidth, setScreenWidth] = useState(deviceWidth - 26);
  const [isExpand, setIsExpand] = useState(false);
  const [zoom, setZoom] = useState(500);
  const [currentPage, setCurrentPage] = useState(0);
  const scrollViewRef = useRef(null);
  const [routeDirections, setRouteDirections] = useState(null);
  const [pitch, setPitch] = useState(0);
  const [loadingEndImage, setLoadingEndImage] = useState(false);
  
  const accessToken =
    "sk.eyJ1IjoibmlzaGFudGh1amlyZSIsImEiOiJjbGliY3dxN2MwOG9qM2N1azg2dTBsMHQ1In0.ROqFtNqa1Qecr4ZpmT0b2Q";
  MapboxGL.setAccessToken(accessToken);
  const [userCoordinates, setUserCoordinates] = useState([
    74.8430082, 12.8698101,
  ]);

  const [locations, setLocations] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [lattitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [image, setImage] = useState(null);
  const [image1, setImage1] = useState(null);
  const [textOdo, setTextOdo] = useState('');
  let forceResetLastButton = null;


  useEffect(() => {
    const interval = setInterval(() => {
      // checkPermission1();
    }, 15000); 

    return () => clearInterval(interval);
  }, []);

  const checkPermission1 = async () => {
    let permissionGranted = await locationPermission();
    if (permissionGranted) {
      console.log("Location permission granted");
      Geolocation.getCurrentPosition(
        (res) => {
          const newLatitude = res.coords.latitude;
          const newLongitude = res.coords.longitude;
  
          setLatitude(newLatitude);
          setLongitude(newLongitude);
  
          console.log("Updated Latitude:", newLatitude);
          console.log("Updated Longitude:", newLongitude);

          // sendCurrentLocation();
        },
        (error) => {
          console.log("Error getting location:", error);
          requestLocationPermission();
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    } else {
      console.log("Location permission denied");
    }
  };


  const sendCurrentLocation = () => {

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${userData?.token}`);

    var raw = JSON.stringify({
      user_id: userData?.id,
      latitude: lattitude,
      longitude: longitude,
      
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(
      "https://gsidev.ordosolution.com/api/ordo_users/update_ordouser_loaction_details/",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        if (result.error) {
          console.log("Location Error");
        } else {
          console.log("Location Sent");
        }
      })
      .catch((error) => {
        console.log("Location Error ",error);;
      });
  };


  const handlePress = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };


  useEffect(() => {
    if (vehicleData.length > 0) {
      const newLocations = vehicleData[0]?.sales_order_details
        .filter((order) => order.longitude && order.latitude)
        .map((order) => ({
          name: order.customer_name,
          coordinate: [parseFloat(order.longitude), parseFloat(order.latitude)],
          id: Math.floor(Math.random() * 1000).toString(),
        }));
      setLocations(newLocations);
    }
  }, [vehicleData]);


  useEffect(() => {
    const timer = setTimeout(() => {
      checkPermission();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const togglePitch = () => {
    setPitch((prevPitch) => (prevPitch === 0 ? 60 : 0));
  };


  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "App Location Permission",
          message: "App needs access location",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use location ride");
      } else {
        console.log("location permission denied");
      }
    } catch (err) {
      console.warn("location permission error", err);
    }
  };

  const checkPermission = async () => {
    let PermissionGranted = await locationPermission();
    if (PermissionGranted) {
      console.log("location permssion granted");
      Geolocation.getCurrentPosition(
        (res) => {
          setUserCoordinates([res.coords.longitude, res.coords.latitude]);
        },
        (error) => {
          console.log("get location error", error);
          console.log("please enable location ");
          requestLocationPermission();
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    } else {
      console.log("location permssion denied");
    }
  };

  const fetchRoute = async () => {
    const coordinates = [
      userCoordinates,
      ...locations.map((location) => location.coordinate),
    ];
    const coordinatesString = coordinates
      .map((coord) => `${coord[0]},${coord[1]}`)
      .join(";");

    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinatesString}?alternatives=false&geometries=geojson&overview=full&access_token=${accessToken}`;

    try {
      const response = await fetch(url);
      const json = await response.json();
      const data = json.routes[0];
      setRouteDirections({
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: data.geometry,
            properties: {},
          },
        ],
      });
    } catch (error) {
      console.error("------->", error);
    }
  };

  const IconRight = () => (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      <MaterialCommunityIcons
        name="truck-delivery"
        size={30}
        color={Colors.primary}
      />
    </View>
  );

  const confirmLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Logout Cancelled"),
          style: "cancel",
        },
        { text: "OK", onPress: () => logout() },
      ],
      { cancelable: false }
    );
  };

  useFocusEffect(
    React.useCallback(() => {
      if (userData) { 
        GetDriverDetails();
        checkToken();
      }
    }, [userData])
  );


  const checkToken = async () => {
    
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${userData?.token}`);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `https://gsidev.ordosolution.com/api/route-manifests/driver/${userData?.driver_id}/`,
      requestOptions
    )
      .then((response) => response.json())
      .then(async (result) => {
        if (result.detail === 'Token not given.' || result.detail === 'Invalid token.' || result.detail === 'Token has expired.') {
          Alert.alert("Sorry", "Your session is expired. You will be automatically signed out", [
            {
              text: "OK",
              onPress: () => {
                setToken(null)
              },
            },
          ])};
       
      })
      .catch((error) => {
       
        console.log("error in get Driver Details", error);
      });
  };


  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const currentPage = Math.round(contentOffsetX / screenWidth);
    setCurrentPage(currentPage);
  };

  const handleDotPress = (pageIndex) => {
    setCurrentPage(pageIndex);
    scrollViewRef.current.scrollTo({
      x: pageIndex * screenWidth,
      animated: true,
    });
  };


  const UpdateRoutStatus = () => {

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${userData?.token}`);

    var raw = JSON.stringify({
      id: vehicleData[0]?.id,
      route_status: "In Transit",
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(
      "https://gsidev.ordosolution.com/api/route_manifest/update_route_details/",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        if (result.error) {
          Toast.show("Please try again", Toast.LONG);
          forceResetLastButton && forceResetLastButton()
        } else {
          GetDriverDetails();
          setImage(null);
          setImage1(null);
          setTextOdo('')
          Toast.show("Routes Started Successfully", Toast.LONG);
        }
      })
      .catch((error) => {
        Toast.show("Please try again", Toast.LONG);
        forceResetLastButton && forceResetLastButton()
      });
  };

  const GetDriverDetails = async () => {
    setLoading(true);
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${userData?.token}`);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `https://gsidev.ordosolution.com/api/route-manifests/driver/${userData?.driver_id}/`,
      requestOptions
    )
      .then((response) => response.json())
      .then(async (result) => {
        if (result.error) {
          setIsEmpty(true);
        } else {
          setIsEmpty(false);
          // Group sales_order_details by assignee_name
          const groupedSalesOrderDetails = result[0].sales_order_details.reduce(
            (acc, order) => {
              const assignee = order.assignee_name;
              if (!acc[assignee]) {
                acc[assignee] = [];
              }
              acc[assignee].push(order);
              return acc;
            },
            {}
          );

          // Convert the grouped object to the expected format
          const formattedSalesOrderDetails = Object.entries(
            groupedSalesOrderDetails
          ).map(([key, value]) => ({
            [key]: value,
          }));

          result.sales_order_details = formattedSalesOrderDetails;
          console.log("grouped", formattedSalesOrderDetails);

          setVehicleData(result);
          forceResetLastButton && forceResetLastButton()
        }
        setLoading(false);
      })
      .catch((error) => {
        setIsEmpty(true);
        setLoading(false);
        console.log("error in get Driver Details", error);
        console.log('=================2===================');
        forceResetLastButton && forceResetLastButton()
      });
  };

  const groupByAssigneeName = (data) => {
    return data.reduce((acc, item) => {
      const assignee = item.assignee_name;
      if (!acc[assignee]) {
        acc[assignee] = [];
      }
      acc[assignee].push(item);
      return acc;
    }, {});
  };

  const groupedData = groupByAssigneeName(
    vehicleData[0]?.sales_order_details || []
  );

  const assigneeData = Object.keys(groupedData).map((assignee) => ({
    assignee_name: assignee,
    total_orders: groupedData[assignee].length,
    orders: groupedData[assignee],
  }));

  const NextScreen = (item) => {
    if (vehicleData[0]?.route_status === "Pending") {
      Toast.show("Please Swipe Right to Start the Routes", Toast.LONG);
    } else {
      navigation.navigate("DriverOrderDetails", {
        order: item.orders,
        id: vehicleData[0]?.id,
      });
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const checkCamPermission = async () => {
    let PermissionDenied = await cameraPermission();
    if (PermissionDenied) {
      console.log("camera permssion granted");
      handleCamera();
    } else {
      console.log("camera permssion denied");
      //requestStoragePermission();
    }
  };

  const handleCamera = async () => {
    try {
      const res = await launchCamera({
        mediaType: "photo",
      });
      
      if (res.assets && res.assets.length > 0) {
        const { uri, type } = res.assets[0];
        
        // Convert image to Base64
        const base64Image = await RNFS.readFile(uri, 'base64');
        setImage1(`data:${type};base64,${base64Image}`)
        setImage({ uri, type});
        console.log("response", uri);
      }
    } catch (error) {
      console.error("Error capturing image: ", error);
    }
  };

  const handleSave = () => {
    if (image && textOdo) {
      // forceResetLastButton && forceResetLastButton()
      UploadOdoMeter();
    } else {
      alert('Please capture an image and enter the text before saving.');
    }
  };

  const handleDeleteImage = () => {
    setImage(null);
    setImage1(null);
  };

  const UploadOdoMeter = () => {
    setLoadingEndImage(true)

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${userData?.token}`);

    var raw = JSON.stringify({
     route_id: vehicleData[0]?.id,
     start_odometer: textOdo,
     start_odometer_img: image1,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(
      "https://gsidev.ordosolution.com/api/start_odometer/",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        if (result.error) {
          Toast.show("Please try again", Toast.LONG);
          forceResetLastButton && forceResetLastButton()
         setLoadingEndImage(false)

        } else {
          UpdateRoutStatus();
          setIsModalVisible(false);
          Toast.show("Image Saved", Toast.LONG);
          setLoadingEndImage(false)
        }
      })
      .catch((error) => {
        Toast.show("Please try again", Toast.LONG);
        forceResetLastButton && forceResetLastButton()
        setLoadingEndImage(false)
      });
  };


  const renderItem = ({ item }) => {
    return (
      <View
        style={{
          flexDirection: "row",
          marginHorizontal: "4%",
        }}
      >
        <View
          style={{
            flexDirection: "column",
            alignItems: "center",
            marginRight: "2%",
          }}
        >
          <View
            style={[
              styles.verticalCircle,
              {
                backgroundColor:
                  item.orders[0]?.customer_status === "Completed"
                    ? "#50C878"
                    : "lightgray",
              },
            ]}
          >
            {item.orders[0]?.customer_status === "Completed" ? (
              <AntDesign name="checkcircleo" size={24} color="white" />
            ) : (
              <MaterialIcons
                name="radio-button-unchecked"
                size={26}
                color="white"
              />
            )}
          </View>
          <View
            style={[
              styles.verticalProgressBar,
              {
                backgroundColor:
                  item.orders[0]?.customer_status === "Completed"
                    ? "#50C878"
                    : "lightgray",
              },
            ]}
          ></View>
        </View>
        {item.orders[0]?.customer_status !== "Completed" ? (
          <TouchableOpacity
            onPress={() => {
              NextScreen(item);
            }}
            style={{ flex: 1 }}
          >
            <View
              style={[
                styles.item,
                {
                  backgroundColor:
                    vehicleData[0]?.route_status === "Pending"
                      ? "white"
                      : vehicleData[0]?.route_status === "In Transit"
                      ? "#fbefd8"
                      : "white",
                },
              ]}
            >
              {item.orders[0]?.customer_status === "Completed" ? (
                <Text style={styles.completeText}>Completed</Text>
              ) : null}

              <Image
                source={require("../../assets/images/Union.png")}
                style={{ position: "absolute", left: 0, bottom: 0 }}
                resizeMode="contain"
              />
              <Image
                source={require("../../assets/images/Union3.png")}
                style={{
                  position: "absolute",
                  right: 0,
                  top: 0,
                  opacity: 0.7,
                }}
                resizeMode="contain"
              />
              <Text style={styles.customerName}>{item?.assignee_name}</Text>
              <Text style={styles.customerLoc}>
                {item.orders[0]?.assigne_to_address?.address}{" "}
                {item.orders[0]?.assigne_to_address?.state}{" "}
                {item.orders[0]?.assigne_to_address?.postal_code}
              </Text>

              {item.customer_status !== "Completed" ? (
                <View style={styles.detailsBox}>
                  <View style={{ flexDirection: "row", gap: 7 }}>
                    <View style={styles.box1}>
                      <MaterialCommunityIcons
                        name="package-up"
                        size={22}
                        color="#9981df"
                      />
                    </View>
                    <View style={{ flexDirection: "column" }}>
                      <Text style={styles.location12}>Total Orders</Text>
                      <Text style={styles.location11}>
                        {item?.total_orders}
                      </Text>
                    </View>
                  </View>
                  <AntDesign name="right" size={22} color="gray" />
                </View>
              ) : null}
            </View>
          </TouchableOpacity>
        ) : (
          <View
            style={[
              styles.item,
              {
                backgroundColor:
                  item.orders[0]?.customer_status === "Completed"
                    ? "#50C878"
                    : "white",
              },
            ]}
          >
            {item.orders[0]?.customer_status === "Completed" ? (
              <Text style={styles.completeText}>Completed</Text>
            ) : null}

            <Image
              source={require("../../assets/images/Union.png")}
              style={{ position: "absolute", left: 0, bottom: 0 }}
              resizeMode="contain"
            />
            <Image
              source={require("../../assets/images/Union3.png")}
              style={{
                position: "absolute",
                right: 0,
                top: 0,
                opacity: 0.7,
              }}
              resizeMode="contain"
            />
            <Text
              style={[
                styles.customerName,
                {
                  color:
                    item.orders[0]?.customer_status === "Completed"
                      ? Colors.white
                      : Colors.primary,
                      marginTop:10
                },
              ]}
            >
              {item?.orders[0]?.assignee_name}
            </Text>
            <Text
              style={[
                styles.customerLoc,
                {
                  color:
                    item.orders[0]?.customer_status === "Completed"
                      ? Colors.white
                      : Colors.black,
                },
              ]}
            >
              {item?.orders[0]?.assigne_to_address?.address}{" "}
              {item?.orders[0]?.assigne_to_address?.state}{" "}
              {item?.orders[0]?.assigne_to_address?.postal_code}
            </Text>
            {item.orders[0]?.customer_status !== "Completed" ? (
              <View style={styles.detailsBox}>
                <View style={{ flexDirection: "row", gap: 7 }}>
                  <View style={styles.box1}>
                    <MaterialCommunityIcons
                      name="package-up"
                      size={22}
                      color="#9981df"
                    />
                  </View>
                  <View style={{ flexDirection: "column" }}>
                    <Text style={styles.location12}>Total Products</Text>
                    <Text style={styles.location11}>
                      {item?.products?.length}
                    </Text>
                  </View>
                </View>
                <AntDesign name="right" size={22} color="gray" />
              </View>
            ) : null}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.whiteView}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginHorizontal: "5%",
        }}
      >
        <TouchableOpacity style={styles.whiteBackg} onPress={handlePress}>
          <Image
            source={require("../../assets/images/GSILogo.png")}
            style={styles.LogoImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 10,
          }}
        >
          <TouchableOpacity
            style={[styles.bellIconContainer, { paddingHorizontal: 17 }]}
            onPress={() => {
              navigation.navigate("DriverNotification", {
                DriverID: userData?.driver_id,
              });
            }}
          >
            <FontAwesome name="bell-o" size={26} color={Colors.black} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.bellIconContainer}
            onPress={() => {
              navigation.navigate("DriverDeliveryHistory", {
                DriverID: userData?.driver_id,
              });
            }}
          >
            <MaterialIcons name="history" size={32} color={Colors.black} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.bellIconContainer1}
            onPress={confirmLogout}
          >
            <Ionicons name="power" size={26} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.container}>
        <ScrollView
          horizontal
          pagingEnabled
          onScroll={handleScroll}
          showsHorizontalScrollIndicator={false}
          style={{ flexDirection: "row", flex: 1, paddingBottom: "1%" }}
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
          ref={scrollViewRef}
        >
          <LinearGradient
            colors={Colors.linearColors}
            start={Colors.start}
            end={Colors.end}
            locations={[0.003, 1, 1]}
            style={[styles.card, { width: screenWidth }]}
          >
            <Image
              source={require("../../assets/images/Union.png")}
              style={{ position: "absolute", left: 0, bottom: 0 }}
              resizeMode="contain"
            />
            <Image
              source={require("../../assets/images/Union.png")}
              style={{
                position: "absolute",
                right: 0,
                top: 0,
                transform: [{ rotate: "180deg" }],
              }}
              resizeMode="contain"
            />
            <Text
              style={{
                fontFamily: "AvenirNextCyr-Bold",
                fontSize: 22,
                color: Colors.white,
                marginHorizontal: 5,
              }}
            >
              Hello, {userData?.name}
            </Text>
            <View
              style={{
                flexDirection: "row",
                gap: 20,
                alignItems: "center",
                marginVertical: 6,
                flex: 1,
                justifyContent: "space-between",
                marginHorizontal: 5,
              }}
            >
              <View style={{ flexDirection: "column" }}>
                <Text style={styles.location1}>Start location</Text>
                <Text style={styles.location}>{vehicleData[0]?.source ? vehicleData[0]?.source :'-'}</Text>
              </View>

              <Feather name="arrow-right-circle" size={15} color="white" />

              <View style={{ flexDirection: "column" }}>
                <Text style={styles.location1}>End location</Text>
                <Text style={styles.location}>
                  {vehicleData[0]?.destination ? vehicleData[0]?.destination :'-'}
                </Text>
              </View>
            </View>

            <View style={styles.detailsBox1}>
              <View
                style={{
                  flexDirection: "row",
                  gap: 10,
                  alignItems: "center",
                }}
              >
                <View style={styles.box}>
                  <MaterialCommunityIcons
                    name="weight"
                    size={22}
                    color="#e79a4a"
                  />
                </View>
                <View style={{ flexDirection: "column" }}>
                  <Text style={styles.location12}>Total Weight</Text>
                  <Text style={styles.location11}>
                    { 
                      vehicleData[0]?.sales_order_details[0]?.is_production 
                        ? (
                               vehicleData[0]?.sum_of_route_production_weight
                          )
                        : (
                              vehicleData[0]?.total_weight_loaded_route 
                          )
                    } KG
                  </Text>
                </View>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  gap: 10,
                  alignItems: "center",
                }}
              >
                <View style={styles.box2}>
                  <MaterialCommunityIcons
                    name="package-variant"
                    size={22}
                    color="#f99ea7"
                  />
                </View>
                <View style={{ flexDirection: "column" }}>
                  <Text style={styles.location12}>No.of Orders</Text>
                  <Text style={styles.location11}>
                    {vehicleData[0]?.sales_order_details.length ? vehicleData[0]?.sales_order_details.length:'0'}
                  </Text>
                </View>
              </View>
            </View>
          </LinearGradient>

          <View style={[styles.mapContainer, { width: screenWidth }]}>
            <MapboxGL.MapView
              style={styles.card1}
              styleURL={MapboxGL.StyleURL.Street}
            >
              <MapboxGL.Camera
                zoomLevel={12}
                centerCoordinate={userCoordinates}
                animationMode={"flyTo"}
                animationDuration={0}
                pitch={60}
              />
              {userCoordinates && (
                <MapboxGL.PointAnnotation
                  id="userLocation"
                  coordinate={userCoordinates}
                >
                  <View style={styles.userMarker} />
                  {/* <View>
                  <MaterialCommunityIcons name="truck-fast" size={30} color="red" />
                  </View> */}
                </MapboxGL.PointAnnotation>
              )}
              {routeDirections && (
                <MapboxGL.ShapeSource id="routeSource" shape={routeDirections}>
                  <MapboxGL.LineLayer id="routeLine" style={styles.routeLine} />
                </MapboxGL.ShapeSource>
              )}
              {locations.length > 0 &&
                locations.map((location) => (
                  <MapboxGL.PointAnnotation
                    key={location.id}
                    id={location.id}
                    coordinate={location.coordinate}
                  >
                    {Platform.OS == "android" && (
                      <MapboxGL.Callout title={location.name} />
                    )}
                    <View>
                      <FontAwesome name="map-marker" size={30} color="red" />
                      <Text>{location.name}</Text>
                    </View>
                  </MapboxGL.PointAnnotation>
                ))}
            </MapboxGL.MapView>

            <View style={styles.mapButtonsContainer}>
              <TouchableOpacity
                style={styles.mapButton}
                onPress={() => {
                  setIsExpand(true);
                }}
              >
                <MaterialIcons
                  name="fullscreen"
                  size={24}
                  color={Colors.white}
                />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
        <View style={styles.paginationContainer}>
          <TouchableOpacity
            onPress={() => handleDotPress(0)}
            style={[
              styles.dot,
              {
                backgroundColor:
                  currentPage === 0 ? Colors.primary : "lightgray",
              },
            ]}
          />
          <TouchableOpacity
            onPress={() => handleDotPress(1)}
            style={[
              styles.dot,
              {
                backgroundColor:
                  currentPage === 1 ? Colors.primary : "lightgray",
              },
            ]}
          />
        </View>
      </View>

      <View
        style={{
          height: 1,
          width: "100%",
          backgroundColor: "lightgray",
          marginTop: "3%",
        }}
      ></View>

      <View style={{ flex: 2.7 }}>
        <View style={styles.view}>
          <Text style={styles.title}>Ongoing Delivery</Text>
          {/* <Text style={styles.title1}>
            {vehicleData[0]?.sales_order_details
              ? vehicleData[0]?.sales_order_details.filter(
                  (order) => order.customer_status === "complete"
                ).length
              : "0"}
            /{!isEmpty ? vehicleData[0]?.sales_order_details.length : "0"}
          </Text> */}
        </View>
        {loading ? (
          <DarkLoading />
        ) : vehicleData[0]?.sales_order_details.length === 0 || isEmpty ? (
          <View
            style={{
              flex: 1,
              resizeMode: "contain",
              justifyContent: "center",
              alignItems: "center",
              alignSelf: "center",
            }}
          >
            <Image
              source={require("../../assets/images/EmptyC.png")}
              style={styles.placeholderImage}
            />
            <Text
              style={{
                fontFamily: "AvenirNextCyr-Bold",
                fontSize: 18,
                color: "lightgray",
                marginVertical: "1%"}}>
              No Orders
            </Text>
            <Text
              style={{
                fontFamily: "AvenirNextCyr-Medium",
                fontSize: 16,
                color: "lightgray",
                marginHorizontal: "10%",
                textAlign: "center"}}>
              There is no Orders to show you right now
            </Text>
          </View>
        ) : (
          <>
            <FlatList
              data={assigneeData}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
              style={{ marginTop: "3%" }}
            />
            {vehicleData[0]?.route_status === "Pending" && (
              <SwipeButton
                disableResetOnTap
                forceReset={(reset) => {
                  forceResetLastButton = reset;
                }}
                railBackgroundColor={Colors.primary}
                railStyles={{
                  backgroundColor: Colors.white,
                  borderColor: "white",
                }}
                thumbIconBackgroundColor="#FFFFFF"
                thumbIconBorderColor="white"
                thumbIconComponent={IconRight}
                disabledThumbIconBorderColor={true}
                title=" Swipe to start route"
                titleColor="white"
                onSwipeSuccess={showModal}
              />
            )}
          </>
        )}
      </View>

      <Modal visible={isExpand} animationType="slide" transparent={true}>
        <View style={{ flex: 1, position: "relative" }}>
          <MapboxGL.MapView
            style={styles.card1}
            styleURL={MapboxGL.StyleURL.Street}
          >
            <MapboxGL.Camera
              zoomLevel={12}
              centerCoordinate={userCoordinates}
              animationMode={"flyTo"}
              animationDuration={500}
              pitch={pitch}
            />
            {userCoordinates && (
              <MapboxGL.PointAnnotation
                id="userLocation"
                coordinate={userCoordinates}
              >
                <View style={styles.userMarker}></View>
              </MapboxGL.PointAnnotation>
            )}
            {routeDirections && (
              <MapboxGL.ShapeSource id="routeSource" shape={routeDirections}>
                <MapboxGL.LineLayer id="routeLine" style={styles.routeLine} />
              </MapboxGL.ShapeSource>
            )}
            {locations.length > 0 &&
              locations.map((location) => (
                <MapboxGL.PointAnnotation
                  key={location.id}
                  id={location.id}
                  coordinate={location.coordinate}
                >
                  {Platform.OS == "android" && (
                    <MapboxGL.Callout title={location.name} />
                  )}
                  <View>
                    <FontAwesome name="map-marker" size={35} color="red" />
                  </View>
                </MapboxGL.PointAnnotation>
              ))}
          </MapboxGL.MapView>

          <View style={styles.mapButtonsContainer}>
            {/* <TouchableOpacity
              style={styles.mapButton1}
              onPress={() => {
                RefreshLocation();
              }}
            >
              <MaterialIcons name="refresh" size={26} color={Colors.white} />
            </TouchableOpacity> */}
            <TouchableOpacity
              style={styles.mapButton1}
              onPress={() => {
                togglePitch();
              }}
            >
              <MaterialCommunityIcons
                name={pitch === 0 ? "compass-off-outline" : "compass-outline"}
                size={26}
                color={Colors.white}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.mapButton1}
              onPress={() => {
                setIsExpand(false);
              }}
            >
              <MaterialIcons
                name="fullscreen-exit"
                size={26}
                color={Colors.white}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* <AnimatedFAB
        icon={() => (
          <Ionicons name="chatbox-ellipses-outline" size={36} color="white" />
        )}
        color={"white"}
        style={styles.fabStyle}
        fontFamily={"AvenirNextCyr-Medium"}
        visible={true}
        animateFrom={"right"}
        onPress={() => {
          navigation.navigate("ChatUserList");
        }}
      /> */}

      {/* Modal for capturing image and entering text */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
          <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() =>{setIsModalVisible(false); forceResetLastButton && forceResetLastButton()}}
            >
              <AntDesign name="close" size={24} color="gray" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Capture Image and Enter Value</Text>

            {!image && (
              <TouchableOpacity onPress={checkCamPermission} style={styles.captureButton}>
                <Text style={styles.captureButtonText}>Capture Image</Text>
              </TouchableOpacity>
            )}

            {image && (
              <>
               <Image source={{ uri: image?.uri }} style={styles.imagePreview} />
                <TouchableOpacity onPress={handleDeleteImage} style={styles.deleteButton}>
                  <Text style={{ color:'white'}}>Delete Image</Text>
                </TouchableOpacity>
              </>
            )}

            <TextInput
              style={styles.textInput}
              placeholder="Enter Mileage on Odometer"
              value={textOdo}
              onChangeText={setTextOdo}
              keyboardType="number-pad"
              returnKeyType="done"
            />

            <TouchableOpacity onPress={handleSave} style={{backgroundColor:Colors.primary,height:40,alignItems:'center',justifyContent:"center",width:"50%",borderRadius:5}}>
            {loadingEndImage ? <ActivityIndicator size="small" color="white" />
                :
                  <Text style={{ color:'white',fontSize:17}}>Save</Text>
                }  
                </TouchableOpacity>
          </View>
        </View>
      </Modal>
        <VersionModel modalVisible={modalVisible} closeModal={closeModal} />
    </View>
  );
};

export default DriverDashboard;

const styles = StyleSheet.create({
  headerView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 60,
    paddingHorizontal: "4%",
  },
  whiteView: {
    backgroundColor: "#f2f3f9",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: "4%",
    flex: 2,
  },
  item: {
    backgroundColor: "white",
    padding: "4%",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 9,
    flex: 1,
    marginBottom: "2%",
  },
  customerName: {
    fontSize: 16,
    fontFamily: "AvenirNextCyr-Bold",
    color: Colors.primary,
  },
  customerLoc: {
    fontSize: 14,
    color: Colors.black,
    fontFamily: "AvenirNextCyr-Medium",
  },
  location: {
    fontSize: 14,
    color: Colors.white,
    textAlign: "left",
    fontFamily: "AvenirNextCyr-Bold",
  },
  location1: {
    fontSize: 13,
    color: Colors.white,
    textAlign: "left",
    fontFamily: "AvenirNextCyr-Medium",
  },
  location11: {
    fontSize: 14,
    color: Colors.black,
    textAlign: "left",
    fontFamily: "AvenirNextCyr-Medium",
  },
  location12: {
    fontSize: 13,
    color: Colors.black,
    textAlign: "left",
    fontFamily: "AvenirNextCyr-Bold",
  },
  order: {
    flexDirection: "row",
    marginTop: "3%",
  },
  image: {
    width: "20%",
    height: "100%",
    borderRadius: 5,
    marginRight: "3%",
  },
  orderDetails: {
    justifyContent: "center",
  },
  productName: {
    fontSize: 16,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
  },
  filteredTextView: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: "2%",
    backgroundColor: "#fff",
    elevation: 5,
    gap: 10,
    flexDirection: "row",
  },
  filteredText: {
    fontFamily: "AvenirNextCyr-Thin",
    fontSize: 16,
    color: Colors.primary,
  },
  resetText: {
    fontSize: 16,
    color: Colors.white,
    fontWeight: "500",
  },
  verticalProgressBar: {
    height: "100%",
    width: 8,
    backgroundColor: "#ccc",
    flexDirection: "row",
    backgroundColor: Colors.primary,
    marginTop: "-10%",
    flex: 1,
  },
  verticalCircle: {
    width: 35,
    height: 35,
    borderRadius: 25,
    backgroundColor: "#ccc",
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  detailsBox: {
    backgroundColor: "#f8f8f8",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
    marginVertical: "2%",
    padding: "3%",
    borderRadius: 10,
    justifyContent: "space-between",
    flex: 1,
  },
  detailsBox1: {
    backgroundColor: "#f8f8f8",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
    marginVertical: 5,
    padding: 9,
    borderRadius: 10,
    justifyContent: "space-between",
  },
  box: {
    backgroundColor: "#fbefd8",
    padding: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#e79a4a",
  },
  box2: {
    backgroundColor: "#fde4e7",
    padding: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#f99ea7",
  },
  box1: {
    backgroundColor: "#ebe5fd",
    padding: 5,
    borderRadius: 5,
  },
  card: {
    backgroundColor: Colors.primary,
    marginTop: 15,
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 15,
  },
  card1: {
    flex: 1,
    borderRadius: 10,
  },
  mapContainer: {
    marginTop: 15,
    marginVertical: 5,
    borderRadius: 10,
    marginHorizontal: 15,
    backgroundColor: Colors.primary,
    position: "relative",
    paddingHorizontal: 3,
    paddingVertical: 10,
  },
  imageView: {
    width: 60,
    height: 50,
    backgroundColor: "white",
    padding: "4%",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  whiteBackg: {
    paddingVertical: "1%",
    backgroundColor: Colors.white,
    borderRadius: 18,
    alignSelf: "center",
  },
  bottomTab: {
    paddingHorizontal: "5%",
    paddingVertical: "4%",
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: "11%",
    elevation: 54,
  },
  bellIconContainer: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  bellIconContainer1: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingHorizontal: 15,
    paddingVertical: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  LogoImage: {
    height: 50,
    width: 75,
  },
  title: {
    fontFamily: "AvenirNextCyr-Bold",
    fontSize: 17,
    color: Colors.primary,
  },
  title1: {
    fontFamily: "AvenirNextCyr-Medium",
    fontSize: 20,
    color: Colors.primary,
  },
  Status: {
    backgroundColor: "#dcfce8",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#3bd856",
    position: "absolute",
    right: 0,
    padding: "1%",
    justifyContent: "center",
    alignItems: "center",
  },
  view: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    marginHorizontal: "5%",
    marginTop: "3%",
    justifyContent: "space-between",
  },
  completeText: {
    color: "white",
    right: "3%",
    position: "absolute",
    top: "10%",
    fontFamily: "AvenirNextCyr-Bold",
  },
  placeholderImage: {
    height: 130,
    width: 160,
    resizeMode: "contain",
    marginBottom: "2%",
  },
  fabStyle: {
    position: "absolute",
    right: "5%",
    bottom: "7%",
    backgroundColor: Colors.primary,
  },
  mapButtonsContainer: {
    position: "absolute",
    bottom: 13,
    right: 10,
    flexDirection: "column",
    gap: 10,
  },
  mapButton: {
    backgroundColor: Colors.primary,
    borderRadius: 15,
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  mapButton1: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  mapButton2: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
  },
  paginationContainer: {
    flexDirection: "row",
    alignSelf: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 5,
  },
  userMarker: {
    height: 30,
    width: 30,
    backgroundColor: "#3f6de7",
    borderRadius: 50,
    borderColor: "#fff",
    borderWidth: 3,
  },
  routeLine: {
    lineColor: "blue",
    lineWidth: 4,
  },
  container1: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  captureButton: {
    backgroundColor: '#FF6347',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  captureButtonText: {
    color: 'white',
  },
  imagePreview: {
    width: 150,
    height: 150,
    marginBottom: 10,
  },
  textInput: {
    width: '100%',
    borderColor: '#CCC',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },deleteButton:{
    backgroundColor:'tomato',
    padding:'2%',
    borderRadius:10,
    marginBottom:'3%',
   
  },modalCloseButton:{
    position:'absolute',
    right:10,
    top:10
  }
});
