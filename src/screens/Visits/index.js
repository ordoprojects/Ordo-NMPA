import React, { useState, useEffect, useContext, useRef } from "react";
import {
  StyleSheet,
  Modal,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Image,
  FlatList,
  LogBox,
  ScrollView,
  Settings,
  PermissionsAndroid,
  Linking,
  RefreshControl,
  Platform,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useFocusEffect } from "@react-navigation/native";
import Geolocation from "react-native-geolocation-service";
import firestore from "@react-native-firebase/firestore";
import { Pressable } from "react-native";
import { AuthContext } from "../../Context/AuthContext";
import Colors from "../../constants/Colors";
import FaceSDK, {
  Enum,
  FaceCaptureResponse,
  MatchFacesResponse,
  MatchFacesRequest,
  MatchFacesImage,
  MatchFacesSimilarityThresholdSplit,
  RNFaceApi,
} from "@regulaforensics/react-native-face-api";
import { locationPermission } from "../../utils/Helper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import ActionButton from "react-native-action-button";
import Ionicons from "react-native-vector-icons/Ionicons";
import Entypo from "react-native-vector-icons/Entypo";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import {
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import {
  GestureHandlerRootView,
  PanGestureHandler,
  State,
} from "react-native-gesture-handler";
import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions";
import DeviceInfo from "react-native-device-info";
import {
  getTrackingStatus,
  requestTrackingPermission,
} from "react-native-tracking-transparency";
import ProgressCircle from "react-native-progress-circle";
import LinearGradient from "react-native-linear-gradient";
import Feather from "react-native-vector-icons/Feather";
import { Dimensions } from "react-native";
import ClockIn from "./clockIn";
import AwesomeAlert from "react-native-awesome-alerts";
import { SegmentedButtons } from "react-native-paper";
import ConfettiCannon from "react-native-confetti-cannon";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Foundation from "react-native-vector-icons/Foundation";
import RNFetchBlob from "rn-fetch-blob";

import {
  LineChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from "react-native-chart-kit";
const screenWidth = Dimensions.get("window").width;
import { BarChart } from "react-native-gifted-charts";
import globalStyles from "../../styles/globalStyles";
import * as RootNavigation from "../../navigation/RootNavigation.js";
LogBox.ignoreAllLogs();
import messaging from "@react-native-firebase/messaging";
import Carousel from "react-native-snap-carousel";
import PercentageCircle from "react-native-percentage-circle";
import { set } from "date-fns";
import { Menu, MenuItem, MenuDivider } from "react-native-material-menu";
import { Dropdown } from "react-native-element-dropdown";
import {
  Card,
  Title,
  Paragraph,
  Button,
  Checkbox,
  Switch,
  Modal as LoadingModal,
} from "react-native-paper";
import CircularProgress from "react-native-circular-progress-indicator";
import { appVersion } from "../../constants/Const";
import {
  Svg,
  Circle,
  LinearGradient as LinearGradient1,
  Stop,
} from "react-native-svg";
import MapboxGL, { Callout, Logger } from "@rnmapbox/maps";
import { lineString as makeLineString } from "@turf/helpers";
const accessToken =
  "sk.eyJ1IjoibmlzaGFudGh1amlyZSIsImEiOiJjbGliY3dxN2MwOG9qM2N1azg2dTBsMHQ1In0.ROqFtNqa1Qecr4ZpmT0b2Q";
MapboxGL.setWellKnownTileServer("Mapbox");
MapboxGL.setAccessToken(accessToken);
// MapboxGL.setConnected(true);
MapboxGL.setTelemetryEnabled(false);
Geolocation.setRNConfiguration({
  skipPermissionRequests: false,
  authorizationLevel: "auto",
});

Logger.setLogCallback((log) => {
  const { message } = log;

  if (
    message.match("Request failed due to a permanent error: Canceled") ||
    message.match("Request failed due to a permanent error: Socket Closed")
  ) {
    return true;
  }
  return false;
});
import { LoadingView } from "../../components/LoadingView";
import BottomSheetComponent from '../BottomSheetComponent';
import { Item } from "react-native-paper/lib/typescript/components/Drawer/Drawer";
import ExternalModal from "./ExternalModal";

const Visits = ({ navigation }) => {
  const [isSwitchOn, setIsSwitchOn] = React.useState(false);

  const [routeDirections, setRouteDirections] = useState(null);
  const [selectedCustomer, setSelectedCustomers] = useState([]);

  const linearGradient = "linear-gradient(45deg, #ff7e5f, #feb47b)";
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [creditData, setCreditData] = useState([]);
  const [quote, setQuote] = useState([]);
  const [visible, setVisible] = useState(false);
  const [clockedOut, setClockedOut] = useState(false);
  const [value, setValue] = useState("RBM");
  //request pdf hooks
  const [isModalVisible, setModalVisible] = useState(false);
  const [reportValue, setReportValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isModalVisibleComp, setModalVisibleComp] = useState(false);
  const [isModalVisibleComp1, setModalVisibleComp1] = useState(false);
  const [isModalVisibleComp2, setModalVisibleComp2] = useState(false);
  const [pendingArray, setPendingArray] = useState([]);
  const [approvedArray, setApprovedArray] = useState([]);
  const [todaysDealers, setTodaysDealer] = useState([]);
  const [allDealers, setAllDealer] = useState([]);
  const [isFocusComp, setIsFocusComp] = useState(false);
  const [quarter, setQuarter] = useState("Q1");
  const [insightsData, setInsightsData] = useState([]);
  const [base64Image, setbase64Image] = useState("");
  const [optimizedPaths, setoptimizedPaths] = useState([]);
  const [allCustomers, setAllCustomers] = useState([]);

  // const todaysDealersWithAdd = [{ id: 'add', type: 'add' }, ...todaysDealers];
  const [externalModal, setExternalModal] = useState(false);







  const {
    token,
    userData,
    changeDealerData,
    logout,
    salesManager,
    changeDocId,
    changeTourPlanId,
    selectedItem,
    setSelectedItem
  } = useContext(AuthContext);

  const [attendId, setAttendId] = useState("");
  const [currentSales1, setCurrentSales1] = useState("");



  useEffect(() => {
    getTourPlanStat();
  }, [selectedItem]);

  const getTourPlanStat = async () => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${userData.token}`);
    // console.log("selected", selectedItem?.id);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `https://gsidev.ordosolution.com/api/sales_tp_dashboard/?plan_id=${selectedItem?.id}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log("fgdgtfhghf", result);
        setCurrentSales1(result);
      })
      .catch((error) => console.error("error in api/tp_dashboard", error));
  };

  const onToggleSwitch = () => {
    setIsSwitchOn(!isSwitchOn);
  };

  // Determine which sales data to display based on the state of the switch
  const currentSalesData = isSwitchOn
    ? currentSales1.sales_statistics
    : currentSales1.todays_sales;
  // console.log("current", currentSales1);

  // const onClickLabel = () => {
  //   setCurrentSales(currentSales === 'sales1' ? 'sales2' : 'sales1');
  // };

  // useEffect(() => {
  //   // Set the default selected item to the first item of the approvedArray
  //   if (approvedArray.length > 0) {
  //     setSelectedItem(approvedArray[0]);
  //   }
  // }, [approvedArray]);

  const handleItemPress = (item) => {
    setSelectedItem(item.id === selectedItem?.id ? null : item);
    getTourPlanDetails(item);
  };

  const UpdateLocation = async (item) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      __type__: "0",
      __longitude__: userCordinates[0],
      __latitude__: userCordinates[1],
      __account_id__: item.id,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    await fetch(
      "https://gsi.ordosolution.com/set_account_details.php",
      requestOptions
    )
      .then((response) => response.json())
      .then(async (result) => { })
      .catch((error) => console.log("error updating location", error));
  };

  const getLocation = async () => {
    let status = await locationPermission();

    if (status === "granted") {
      Geolocation.getCurrentPosition(
        (res) => {
          console.log("Longitude:", res.coords.longitude);
          console.log("Latitude:", res.coords.latitude);
          setUserCordinates([res.coords.longitude, res.coords.latitude]);
        },
        (error) => {
          console.log("get location error", error);
          console.log("please enable location ");
          // setLocationEnabled(false);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    }
  };

  //optimized-trip API
  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        if (userCordinates && value === "map") {
          if (optimizedPaths) {
            const userCoordinatesObject = {
              latitude: userCordinates[1],
              longitude: userCordinates[0],
            };

            const validCustomerArray = optimizedPaths.filter(
              (account) =>
                account.latitude !== null && account.longitude !== null
            );

            const modifiedTodaysAccountsArray = [
              userCoordinatesObject,
              ...validCustomerArray.map((account) => ({
                id: account.id,
                name: account.name,
                latitude: account.latitude,
                longitude: account.longitude,
                account_profile_pic: account.account_profile_pic,
                status: "Pending",
              })),

              //uncomment the following lines if you need deviated dealers to be shown in map, dont forget to add deviatedDelaers in the dependency array and in if condition above
              // ...deviatedDealers.map(deviatedAccount => ({
              //     id: deviatedAccount.id,
              //     name: deviatedAccount.name,
              //     latitude: deviatedAccount.latitude,
              //     longitude: deviatedAccount.longitude,
              //     account_profile_pic: deviatedAccount.account_profile_pic,
              //     status: "Pending" // You can modify the status as needed
              // })),
            ];

            const modifiedTodaysAccountsArrayWithoutLast =
              modifiedTodaysAccountsArray.slice(0, -1);

            const trimmedArray = modifiedTodaysAccountsArrayWithoutLast.slice(
              0,
              9
            );

            const coordinates = trimmedArray
              .map((coord) => `${coord.longitude},${coord.latitude}`)
              .join(";");
            const geometries = "geojson";

            const url = `https://api.mapbox.com/optimized-trips/v1/mapbox/${selectedRouteProfile}/${coordinates}?geometries=${geometries}&source=first&destination=last&roundtrip=false&access_token=${accessToken}`;

            try {
              let response = await fetch(url);
              let json = await response.json();

              const data = json.trips[0];
              // const waypoints = json.waypoints;

              // if (waypoints && waypoints.length > 0) {
              //     const sortedWaypoints = waypoints.sort((a, b) => a.waypoint_index - b.waypoint_index);

              // }

              setRouteDirections(makeRouterFeature(data.geometry.coordinates));
            } catch (e) {
              console.error(e);
            }

            setAllCustomers(modifiedTodaysAccountsArray);
          }
        }
      };

      fetchData(); // Call the async function immediately

      // No need to return anything from the callback
    }, [userCordinates, optimizedPaths, accessToken, value])
  );


  const manualCheckIn = async (avatarUrl) => {
    var myHeaders = new Headers();

    console.log("checkin raw", avatarUrl)


    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${userData.token}`);


    var raw = JSON.stringify({
      sales_plan: selectedItem?.id,
      ordo_user: userData.id,
      account: avatarUrl?.account_id,
      visit_date: moment(new Date()).format("YYYYMMDD"),
      check_in: moment(new Date()).format("YYYY-MM-DD"),
      checkin_type: "Internal",
      checkin_location: "Premise",
      prev_checkin: avatarUrl?.sales_checkin
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };


    console.log("checkin raw", raw)

    await fetch("https://gsidev.ordosolution.com/api/sales_checkin/", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log("testttt", result)
        changeTourPlanId(selectedItem?.id);
        changeDealerData(avatarUrl);
        changeDocId(result.data[0].sales_checkin_id);
        setModalVisibleComp2(false);
        navigation.navigate("CheckOut", {
          tour_plan_id: selectedItem?.id,
          backIcon: true,
          external: selectedItem.id ? true : false,
          deviatedPlanId: selectedItem.id,
          checkin_id: result.data[0].sales_checkin_id,
          visit_id: avatarUrl.id,
          dealerInfo: selectedItem,
        });
      })
      .catch((error) => {
        console.log("manual check in api error", error);
      });
  };


  const bottomSheetModalRef = useRef(null);

  const openBottomSheet = () => {
    bottomSheetModalRef.current?.present();
  };

  const closeBottomSheet = () => {
    bottomSheetModalRef.current?.dismiss();
  };

  const bottomSheetModalRef1 = useRef(null);

  const openExternalBottomSheet = () => {
    bottomSheetModalRef1.current?.present();
    setIsBottomSheetOpen(true);
  };

  const closeExternalBottomSheet = () => {
    bottomSheetModalRef1.current?.dismiss();
    setIsBottomSheetOpen(false);
  };

  const toggleBottomSheet = () => {
    if (isBottomSheetOpen) {
      closeExternalBottomSheet();
    } else {
      openExternalBottomSheet();
    }
  };

  //screenshot disable in ios

  //   useEffect(() => {
  //     async function fetchDeviceInfo() {

  //         DeviceInfo.getUniqueId().then((uniqueId) => {
  //             console.log("deviceis", uniqueId);
  //             setDeviceId(uniqueId);
  //         });

  //         const os_version = DeviceInfo.getSystemVersion();
  //         const name = DeviceInfo.getSystemName();

  //         setOSName(name);
  //         setOSVersion(os_version)

  //         console.log("oS_NAME", name )
  //         console.log("os version", os_version )
  //     }
  //     fetchDeviceInfo();
  // }, []);

  useEffect(() => {
    const currentMonth = new Date().getMonth() + 1; // JavaScript months are zero-based, so we add 1
    let newQuarter;

    if (currentMonth >= 4 && currentMonth <= 6) {
      newQuarter = "Q1";
    } else if (currentMonth >= 7 && currentMonth <= 9) {
      newQuarter = "Q2";
    } else if (currentMonth >= 10 && currentMonth <= 12) {
      newQuarter = "Q3";
    } else {
      newQuarter = "Q4";
    }

    setQuarter(newQuarter);
  }, []);
  // const [currentPos, setCurrentPos] = useState(0);

  // const onScroll = (e) => {

  //   const currentOffset = e.nativeEvent.contentOffset.y;
  //   // console.log(currentOffset);

  //   if (currentOffset <= 0) {
  //     // If the scroll position is at the top, show the tab bar
  //     navigation.setOptions({ tabBarStyle: { display: 'flex', animated: true } });
  //   } else {
  //     const scrollDirection = currentOffset > currentPos ? 'up' : 'down';
  //     // console.log("directions",scrollDirection)

  //     if (scrollDirection === 'up') {
  //       // If scrolling up, hide the tab bar
  //       navigation.setOptions({ tabBarStyle: { display: 'none', animated: true } });
  //     } else {
  //       // If scrolling down, show the tab bar
  //       navigation.setOptions({ tabBarStyle: { display: 'flex', animated: true } });
  //     }
  //   }

  //   setCurrentPos(currentOffset);
  // };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getInsights();
    getPlans();
    setRefreshing(false);
    getTourPlanStat();
    clockIncheck();
  }, [userData]);

  useEffect(() => {
    getInsights();
  }, []);

  const getInsights = async () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "text/plain");
    var raw = JSON.stringify({
      __user_id__: token,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    await fetch(
      "https://als.ordosolution.com/get_insights_report.php",
      requestOptions
    )
      .then((response) => response.json())
      .then((res) => {
        //console.log("Signature Uploaded", result);

        setInsightsData(
          res.sales_performa.quarterly_sales_performa_report
            .sales_performa_quarterly
        );
        setVisitsData(res.Visits.quarterly_visits_report.visits_quarterly);
      })
      .catch((error) => console.log("live location save error", error));
  };

  const phoneNumber = "011-42404463";
  const email = "info@assurelifescience.com";

  const handlePhonePress = () => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleEmailPress = () => {
    Linking.openURL(`mailto:${email}`);
  };

  const optionData = [
    // { label: 'Daily', value: 'Daily' },
    // { label: 'Weekly', value: 'Weekly' },
    { label: "Monthly", value: "Monthly" },
    // { label: 'Quarterly', value: 'Quarterly' },
  ];

  const requestPDF = () => {
    if (!reportValue) {
      Alert.alert("Warning", "Please select report type option");
      return;
    }
    let task = "pdf";
    if (reportValue == "Monthly" || reportValue == "Quarterly") {
      task = "emailpdf";
    }
    setModalVisible(false);
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "text/plain");
    var raw = JSON.stringify({
      __user_id__: token,
      __duration__: reportValue,
      __task__: task,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    fetch(
      "https://als.ordosolution.com/send_checkin_pdf_mail.php",
      requestOptions
    )
      .then((response) => response.json())
      .then((res) => {
        //console.log("Signature Uploaded", result);
        if (reportValue == "Monthly" || reportValue == "Quarterly") {
          //seding only emails
          Alert.alert(
            "Report Sent",
            "The report will be sent to your email. Please check your inbox after few minutes."
          );
        } else {
          //sending pdf
          navigation.navigate("PDFViewer", { title: reportValue, url: res });
        }
      })
      .catch((error) => console.log("pdf api error", error));
  };

  const hideMenu = () => setVisible(false);

  const showMenu = () => setVisible(true);

  const showAlertFunction = () => {
    setShowAlert(true);

    // Show confetti for a few seconds when the alert is displayed
    setShowConfetti(true);
    setTimeout(() => {
      setShowConfetti(false);
    }, 5000); // Adjust the duration as needed
  };

  const hideAlertFunction = () => {
    setShowAlert(false);
  };
  useEffect(() => {
    AskTrackingpermission();
  }, []);

  const AskTrackingpermission = async () => {
    const trackingStatus = await getTrackingStatus();
    if (trackingStatus === "authorized" || trackingStatus === "unavailable") {
    } else {
      requestTrackingPermission();
    }
  };

  const ConfettiComponent = ({ active }) => {
    if (active) {
      return (
        <ConfettiCannon
          count={200}
          explosionSpeed={300}
          origin={{ x: -10, y: 0 }}
          autoStart={true}
          fadeOut
        />
      );
    }
    return null;
  };

  const images = [
    require("../../assets/images/lake.jpeg"),
    require("../../assets/images/lake1.jpeg"),
    require("../../assets/images/lake2.jpeg"),
    require("../../assets/images/lake1.jpeg"),
  ];

  //sales man live location logic starts
  useEffect(() => {
    const interval = setInterval(() => {
      checkPermission();
    }, 90000);
    return () => clearInterval(interval);
  }, []);

  // const checkPermission = async () => {
  //   const status = await locationPermission();

  //   if (status==="granted") {
  //     console.log("location permission granted");
  //     getLiveLocation();
  //   }
  //   else {
  //     console.log("asking permission");

  //   }
  // }

  const checkPermission = async () => {
    const status = await locationPermission();

    if (status === "granted") {
      console.log("Location permission granted");
      getLiveLocation();
    } else {
      console.log("Asking permission");
      showPermissionAlert();
    }
  };

  const showPermissionAlert = () => {
    Alert.alert(
      "Location Permission Required",
      "This app needs location permission. Please enable it in by pressing ALLOW or by opening App settings",
      [
        {
          text: "Allow",
          onPress: () => {
            checkPermission(); // Ask permission again
          },
        },
        {
          text: "Open Settings",
          onPress: () => {
            openAppSettings();
          },
        },
      ],
      { cancelable: false }
    );
  };

  const openAppSettings = async () => {
    try {
      await Linking.openSettings();
      // Add a delay to wait for the user to come back from settings
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Check the permission status after the delay
      const status = await locationPermission();

      if (status === "granted") {
        console.log("Location permission granted");
        getLiveLocation();
      } else {
        console.log("Asking permission");
        showPermissionAlert();
      }
    } catch (error) {
      console.error("Error opening app settings:", error);
    }
  };

  //Location Permission
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
        getLiveLocation();
        //setEnableLocationModalOpen(true);
      } else {
        console.log("location permission denied");
      }
    } catch (err) {
      console.warn("location permission error", err);
    }
  };

  const saveLocation = (
    lattitude,
    longitude,
    battery,
    os_version,
    os_name,
    unique_id
  ) => {
    if (!token) {
      console.debug.LOG("NO TOKEN RETURNING");
      return;
    }
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "text/plain");
    var raw = JSON.stringify({
      __user_id__: token,
      __longitude__: lattitude,
      __latitude__: longitude,
      __battery__: battery,
      __app_version__: appVersion,
      __os_name__: os_name,
      __os_version__: os_version,
      __device_id__: unique_id,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };


    fetch(
      "https://als.ordosolution.com/set_check_in_location.php",
      requestOptions
    )
      .then((response) => response.json())
      .then((res) => {
        console.log("location updated successfully", res);
      })
      .catch((error) => console.log("live location save error", error));
  };

  const getLiveLocation = async () => {
    let battery = 0;
    let unique_id = "";

    DeviceInfo.getBatteryLevel().then((batteryLevel) => {
      // 0.759999
      battery = batteryLevel * 100;
    });

    DeviceInfo.getUniqueId().then((uniqueId) => {
      unique_id = uniqueId;
    });

    const os_version = DeviceInfo.getSystemVersion();
    const os_name = DeviceInfo.getSystemName();

    Geolocation.getCurrentPosition(
      (res) => {
        saveLocation(
          res.coords.latitude,
          res.coords.longitude,
          battery,
          os_version,
          os_name,
          unique_id
        );
        setUserCordinates([res.coords.longitude, res.coords.latitude]);
      },
      (error) => {
        console.log("get location error", error);
        console.log("please enable location ");
        // setLocationEnabled(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  //---------------------------------------------
  //push notification hadndle logic
  // useEffect(() => {

  //   //navigation.navigate('UserList')
  //   messaging().onNotificationOpenedApp(remoteMessage => {
  //     console.log(
  //       'Notification caused app to open from background state:',
  //       remoteMessage.notification,
  //     );
  //     //checking it is chat notification
  //     if (remoteMessage?.data?.convo_id) {
  //       navigation.navigate('UserList');
  //     }
  //   });

  //   // Check whether an initial notification is available
  //   messaging()
  //     .getInitialNotification()
  //     .then(remoteMessage => {
  //       if (remoteMessage) {
  //         console.log(
  //           'Notification caused app to open from quit state:',
  //           remoteMessage.notification,
  //         );
  //         //setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
  //         console.log("notification type", remoteMessage.data.convo_id)
  //         //checking it is chat notification
  //         if (remoteMessage?.data?.convo_id) {
  //           navigation.navigate('UserList');
  //         }
  //       }
  //       // setLoading(false);
  //     });
  // }, []);

  useEffect(() => {
    // Handle notifications when the app is in the foreground
    const unsubscribeOnMessage = messaging().onMessage(
      async (remoteMessage) => {
        // Handle the notification payload

        Alert.alert(
          remoteMessage.notification.title,
          remoteMessage.notification.body,
          [
            {
              text: "Close",
              style: "cancel",
            },
            {
              text: "View",
              onPress: () => {
                // Navigate to the target screen
                navigation.navigate(remoteMessage.data?.targetScreen);
              },
            },
          ],
          { cancelable: false }
        );
      }
    );

    //notification handler when the app is in background
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log(
            "Notification caused app to open from quit state:",
            remoteMessage.notification
          );
          navigation.navigate(remoteMessage.data?.targetScreen);
        }
        // setLoading(false);
      });

    return () => {
      unsubscribeOnMessage();
    };
  }, []);

  //plans hooks
  //const [aprrovedPlans, setApprovedPlans] = useState('');
  const [pendingPlans, setPendingPlans] = useState("");
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(true);

  const [otherPlans, setOtherPlans] = useState("");
  const [completedPlans, setCompletedPlans] = useState("");
  const [collaboratedPlans, setCollaboratedPlans] = useState("");

  const [clockedIn, setClockedIn] = useState("");
  const profile = useRef("");
  const profileOut = useRef("");

  const [userCordinates, setUserCordinates] = useState([]);


  useFocusEffect(
    React.useCallback(() => {
      getLocation();
    }, [])
  );


  // const getLocation = async () => {
  //   let locPermissionDenied = await locationPermission();
  //   if (locPermissionDenied) {
  //     Geolocation.getCurrentPosition(
  //       async (res) => {
  //         setUserCordinates([res.coords.latitude, res.coords.longitude])
  //       },
  //       (error) => {
  //         console.log("get location error", error);
  //         console.log("please enable location ")
  //       },
  //       {
  //         enableHighAccuracy: true, timeout: 15000, maximumAge: 10000, accuracy: {
  //           android: 'high',
  //           ios: 'bestForNavigation',
  //         }
  //       }

  //     );

  //   }
  //   else {
  //     console.log("location permssion denied")
  //   }
  // }




  const getTourPlanDetails = async (plan) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${userData.token}`);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    let url = `https://gsidev.ordosolution.com/api/sales_tourplan/${plan.id}/?user_id=${userData.id}`

    await fetch(url, requestOptions)
      .then(response => response.json())
      .then(result => {
        // Get today's date in the required format (e.g., "20240604")
        console.log("tour plan details", result.activity[0])
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // getMonth() returns 0-based month, so add 1
        const day = String(today.getDate()).padStart(2, '0');
        const todayKey = `${year}${month}${day}`;

        // Extract today's dealers from the response
        const todaysDealers = result.activity[0][todayKey] || [];

        setAllDealer(todaysDealers);
        const todaysDealersWithAdd = [{ id: 'add', type: 'add' }, ...todaysDealers];

        // Store today's dealers with the added object in setTodaysDealer variable
        setTodaysDealer(todaysDealersWithAdd);


        // Set the selected item
        setSelectedItem(result);
      })
      .catch(error => console.log('api error', error));
  }


  useFocusEffect(
    React.useCallback(() => {
      getPlans();
    }, [userData])
  );

  useFocusEffect(
    React.useCallback(() => {
      clockIncheck();
      // getProfile();

      // clockOutcheck();
      getTourPlanGrahpData();

      // getLocation();
      checkPermission();
      FaceSDK.init(
        (json) => {
          response = JSON.parse(json);
          if (!response["success"]) {
            console.log("Init failed: ");
          }
        },
        (e) => { }
      );
    }, [userData])
  );

  const getPlans = async () => {
    setLoading1(true);
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${userData.token}`);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

console.log("user id", userData.id)


    await fetch(
      `https://gsidev.ordosolution.com/api/sales_tourplan/?user_id=${userData.id}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {

        // console.log("rwerer", result)

        let approved = []; //approved plans
        let pending = []; //reject,pending plans  all are other plans
        let inactive = [];
        result?.forEach((tourPlan) => {

          const endDate = new Date(tourPlan.end_date).toISOString().split("T")[0];
          const currentDate = new Date(); // Get the current date
          const currentDateFormatted = currentDate.toISOString().split("T")[0]; // Format to "YYYY-MM-DD"


          //approved
          if ((tourPlan?.status === "Approved" || tourPlan?.status == "Completed") && tourPlan?.end_date >= currentDateFormatted) {
            approved.push(tourPlan);
          } else if (tourPlan?.status == "Pending") {
            pending.push(tourPlan);
            // }else{
            //   inactive.push(tourplan)
          }

        });

        console.log("aprroved of 0", approved[0])
        getTourPlanDetails(approved[0])

        setPendingArray(pending);
        setApprovedArray(approved);


      })

      .catch((error) => console.log("error in sales_tourplan API", error));
    setLoading1(false);
  };

  // console.log("approved",approvedArray)
  // console.log("pending",pendingArray)


  //user face recognisation
  const faceRecogniseOut = async () => {
    hideMenu();
    FaceSDK.presentFaceCaptureActivity(
      (result) => {
        let res = JSON.parse(result);
        //checking user cancle image picker
        // if (res.exception) {
        //   return;
        // }
        //console.log("image uri", FaceCaptureResponse.fromJson(JSON.parse(result)).image.bitmap);
        let base64Img = FaceCaptureResponse.fromJson(JSON.parse(result)).image
          .bitmap;
        const firstImage = new MatchFacesImage();
        firstImage.imageType = Enum.ImageType.PRINTED; //captured image
        firstImage.bitmap = profileOut.current;
        const secondImage = new MatchFacesImage();
        secondImage.imageType = Enum.ImageType.LIVE; //live image
        secondImage.bitmap = base64Img;
        request = new MatchFacesRequest();
        request.images = [firstImage, secondImage];

        //comparing two images
        FaceSDK.matchFaces(
          JSON.stringify(request),
          (response) => {
            response = MatchFacesResponse.fromJson(JSON.parse(response));
            FaceSDK.matchFacesSimilarityThresholdSplit(
              JSON.stringify(response.results),
              0.75,
              (str) => {
                var split = MatchFacesSimilarityThresholdSplit.fromJson(
                  JSON.parse(str)
                );
                if (split?.matchedFaces.length > 0) {
                  //face matched
                  let faceMatchPercentage =
                    split.matchedFaces[0].similarity * 100;
                  saveClockOut();
                } else {
                  //face doe not match
                  alert("Face not recognised please try again.");
                }
              },
              (e) => {
                console.log("error");
              }
            );
          },
          (e) => {
            console.log("error");
          }
        );
      },
      (e) => {
        console.log("error", e);
      }
    );
  };

  const clockIncheck = () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${userData.token}`);

    var raw = JSON.stringify({
      __user_id__: token,
      __type__: "clockin",
    });

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      // body: raw,
      redirect: "follow",
    };

    fetch(
      `https://gsidev.ordosolution.com/api/get_clockin/${userData.id}/`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        const attendanceid = data.id;
        setAttendId(attendanceid);

        if (result.Status == 200) {
          setClockedIn(false);
          getProfile();
        } else if (result.Status == 201) {
          setClockedIn(true);
          console.log("*******************");
        }
      })
      .catch((error) => console.log("error", error));
  };

  const getProfile = async () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${userData.token}`);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    await fetch(
      `https://gsidev.ordosolution.com/api/ordo_users/${userData.id}/`,
      requestOptions
    )
      .then((response) => response.json())
      .then(async (result) => {
        let imageUrl = result.user_details?.compare_image;
        if (imageUrl) {
          try {
            const response = await RNFetchBlob.config({
              fileCache: true,
            }).fetch("GET", imageUrl);

            // Convert image data to base64
            const base64Data = await response.base64();

            // Now you have the base64Data, you can use it as needed
            console.log("Base64 image data:----------->", base64Data);
            // Logging profile.current after updating it

            // Perform any further processing here before updating the state
            // For example, you might want to set the base64Data to a state variable
            // setbase64Image(base64Data);
            profile.current = base64Data;
            // console.log( profile.current, "base665656565654");// Updating profile.current
            // console.log("base64:", profile.current); // Logging the base64 value
            // setClockedIn(false);
          } catch (error) {
            console.error("Error converting image to base64:", error);
          }
        }
      })
      .catch((error) => {
        // setLoading(false);
        console.error("Error in get supplier", error);
      });
  };


  // console.log("base64",base64Image)

  const logoutAlert = () => {
    hideMenu();
    Alert.alert("Confirmation", "Are you sure, You want to logout?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => {
          logout();
        },
      },
    ]);
  };

  const clockoutAlert = () => {
    hideMenu();
    Alert.alert("Confirmation", "Do you wish to clockout?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => {
          saveClockOut();
        },
      },
    ]);
  };

  const getCurrentTime = () => {
    const currentDate = new Date();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const seconds = currentDate.getSeconds();

    // Formatting to ensure two digits
    const formattedHours = hours < 10 ? "0" + hours : hours;
    const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
    const formattedSeconds = seconds < 10 ? "0" + seconds : seconds;

    // Construct the time string
    const currentTime = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;

    return currentTime;
  };

  // Usage
  const currentTime = getCurrentTime();

  const saveClockIn = async () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${userData.token}`);

    const raw = JSON.stringify({
      user: userData.id,
      type: "present",
      location: "",
      latitude: userCordinates[0],
      longitude: userCordinates[1],
      login_time: currentTime,
      logged_out: "",
    });
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    await fetch("https://gsidev.ordosolution.com/api/clocked_in/", requestOptions)
      .then(async (result) => {
        if (result?.status == "200") {
          Alert.alert("Clock in ", `Clocked in successfully`);
          setClockedIn(true);
        }
      })
      .catch((error) => console.log("set attendance error", error));
    setLoading(false);

    // .finally(() => setLoading(false));
  };

  const saveClockOut = async () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${userData.token}`);

    var raw = JSON.stringify({
      user: userData.ID,
      type: "present",
      location: "",
      latitude: userCordinates[0],
      longitude: userCordinates[1],
      attendance_id: attendId,
      login_time: "",
      logged_out: currentTime,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch("https://gsidev.ordosolution.com/api/clocked_in", requestOptions)
      .then((response) => response.json())
      .then(async (result) => {
        if (result.status == "201") {
          Alert.alert("Clock out ", `Clocked out successfully`);
          clockOutcheck();
        }
      })
      .catch((error) => console.log("clock out api error", error));
  };

  const clockOutcheck = () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      __user_id__: token,
      __type__: "clockout",
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(
      "https://als.ordosolution.com/get_check_user_clockin.php",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        if (result.status == "200") {
          setClockedOut(true);
        } else if (result.status == "201") {
          setClockedOut(false);
        }
      })
      .catch((error) => console.log("clock out check error", error));
  };

  //user face recognisation
  const faceRecognise = async () => {
    FaceSDK.presentFaceCaptureActivity(
      (result) => {
        let res = JSON.parse(result);
        //checking user cancle image picker
        if (Platform.OS === "android") {
          if (res.exception) {
            return;
          }
        }
        setLoading(true);
        //console.log("image uri", FaceCaptureResponse.fromJson(JSON.parse(result)).image.bitmap);
        let base64Img = FaceCaptureResponse.fromJson(JSON.parse(result)).image
          .bitmap;
        const firstImage = new MatchFacesImage();
        firstImage.imageType = Enum.ImageType.PRINTED; //captured image
        firstImage.bitmap = profile.current;
        const secondImage = new MatchFacesImage();
        secondImage.imageType = Enum.ImageType.LIVE; //live image
        secondImage.bitmap = base64Img;
        request1 = new MatchFacesRequest();
        request1.images = [firstImage, secondImage];
        //comparing two images
        FaceSDK.matchFaces(
          JSON.stringify(request1),
          (response) => {
            response = MatchFacesResponse.fromJson(JSON.parse(response));
            FaceSDK.matchFacesSimilarityThresholdSplit(
              JSON.stringify(response.results),
              0.75,
              (str) => {
                var split = MatchFacesSimilarityThresholdSplit.fromJson(
                  JSON.parse(str)
                );
                if (split?.matchedFaces.length > 0) {
                  //face matched
                  let faceMatchPercentage =
                    split.matchedFaces[0].similarity * 100;
                  saveClockIn();
                } else {
                  setLoading(false);
                  Alert.alert(
                    "Failed",
                    "Face not recognised please try again."
                  );
                }
              },
              (e) => {
                console.log("error");
              }
            );
          },
          (e) => {
            console.log("error");
          }
        );
      },
      (e) => {
        console.log("error", e);
      }
    );
  };

  const handlePlan = (item) => {
    const endDate = new Date(item.end_date).toISOString().split("T")[0];
    const startDate = new Date(item.start_date).toISOString().split("T")[0];

    const currentDate = new Date(); // Get the current date
    const currentDateFormatted = currentDate.toISOString().split("T")[0];

    let active = "no";

    if (
      item?.status === "Approved" &&
      endDate >= currentDateFormatted &&
      startDate <= currentDateFormatted
    ) {
      active = "yes";
    }

    // navigation.navigate('PlanDetails', { item: item, clockedOut: clockedOut, active: active })
  };

  const [weeklyData, setWeeklyData] = useState([]);
  const [monthData, setMonthData] = useState([]);
  //graph options
  const [wSelected, setWSelected] = useState(true);
  const [mSelected, setMSelected] = useState(false);

  // Function to convert monthly data to the desired format
  const convertMonthlyData = (data) => {
    return Object.keys(data).map((month) => {
      return {
        value: parseInt(data[month]),
        label: month,
      };
    });
  };

  // Function to convert weekly data to the desired format
  const convertWeeklyData = (data) => {
    const weeks = Object.keys(data);
    return weeks.map((week) => {
      return {
        value: parseInt(data[week]),
        label: week,
      };
    });
  };

  //getting tour pland grahh data
  const getTourPlanGrahpData = async () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      __user_id__: token,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(
      "https://als.ordosolution.com/get_tp_completed_visits_quarterly_weekly.php",
      requestOptions
    )
      .then((response) => response.json())
      .then(async (res) => {
        // Extracting and converting monthly data
        const monthlyData = await res.monthly_completed_visits.map((item) =>
          convertMonthlyData(item)
        )[0];

        // Extracting and converting weekly data
        const weeklyData = await res.monthly_completed_visits_with_weekly.map(
          (item) => convertWeeklyData(item[Object.keys(item)[0]])
        )[0];

        setMonthData(monthlyData);
        setWeeklyData(weeklyData);
      })
      .catch((error) => console.log("error", error));
  };

  //line chart data
  // const data = {
  //   labels: labels,
  //   datasets: [
  //     {
  //       data: graphVal,
  //       color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
  //       strokeWidth: 2, // optional

  //     }
  //   ],
  //   //legend: ["visits"] // optional
  // };
  //
  //
  //-------------------------------------------
  //progress ring data logic
  // const [progressData, setProgressData] = useState('');
  // const getProgressData = () => {
  //   var myHeaders = new Headers();
  //   myHeaders.append("Content-Type", "application/json");

  //   var raw = JSON.stringify({
  //     "__user_id__": token,
  //     "__id__": aprrovedPlans[0]?.id
  //   });

  //   var requestOptions = {
  //     method: 'POST',
  //     headers: myHeaders,
  //     body: raw,
  //     redirect: 'follow'
  //   };

  //   fetch("https://167.71.230.177:8000/get_tour_plan_detail.php", requestOptions)
  //     .then(response => response.json())
  //     .then(async result => {
  //       console.log('plan details', result?.status[0]?.dealer_array);
  //       if (result?.status[0]?.dealer_array.length > 0) {
  //         let label = [];
  //         let value = [];
  //         let totalVisits = 4;
  //         result?.status[0]?.dealer_array.forEach((item) => {
  //           label.push(item?.name);
  //           value.push((Number(item?.no_of_visit) / totalVisits) * 100)
  //         })

  //       }
  //     })
  //     .catch(error => console.log('error', error));
  // }

  // const data = {
  //   labels: ["Walmart", "E G india"], // optional
  //   data: [0.25, 0.75]
  // };

  const data = [
    {
      id: "1",
      name: "John",
      freq: "1/1",
      avatarUrl:
        "https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    {
      id: "2",
      name: "Alice",
      freq: "0/1",
      avatarUrl:
        "https://www.befunky.com/images/wp/wp-2021-01-linkedin-profile-picture-after.jpg?auto=avif,webp&format=jpg&width=944",
    },
    {
      id: "3",
      name: "Kat",
      freq: "0/1",
      avatarUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR47eGNB4uktvhbGIeWWDPNl-0L1EBWByWRkg&usqp=CAU",
    },
    {
      id: "4",
      name: "Eve",
      freq: "0/1",
      avatarUrl: "https://cdn.wallpapersafari.com/13/50/xeNjrU.jpg",
    },
    {
      id: "5",
      name: "Alan",
      freq: "0/1",
      avatarUrl:
        "https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    {
      id: "6",
      name: "Jace",
      freq: "0/1",
      avatarUrl:
        "https://www.befunky.com/images/wp/wp-2021-01-linkedin-profile-picture-after.jpg?auto=avif,webp&format=jpg&width=944",
    },
    {
      id: "7",
      name: "Phoebe",
      freq: "0/1",
      avatarUrl: "https://cdn.wallpapersafari.com/13/50/xeNjrU.jpg",
    },
  ];


  const getBirthday = async () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "text/plain");

    var raw = JSON.stringify({
      __user_id__: token,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch("https://als.ordosolution.com/get_creditholders.php", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setCreditData(result);
      })
      .catch((error) => console.log("get attendnace error", error));
  };

  const renderItem = ({ item }) => (
    <View style={styles.carouselItem}>
      <Image source={item} style={styles.carouselimage} />
    </View>
  );

  const renderItem1 = ({ item }) => (
    <View style={styles.item}>
      {item?.account_profile_pic ? (
        <Image
          //source={require('../../assets/images/account.png')}
          source={{ uri: item?.account_profile_pic }}
          style={{ ...styles.avatar }}
        />
      ) : (
        <Image
          source={require("../../assets/images/doctor.jpg")}
          style={{ ...styles.avatar }}
        />
      )}
      <Text style={styles.name}>{item.name}</Text>
      <Text
        style={{
          color: "#D11A2A",
          fontFamily: "AvenirNextCyr-Medium",
          fontSize: 12,
        }}
      >
        <Text>Due Amt : </Text>
        {item.due_amount}
      </Text>
    </View>
  );

  const [selectedAvatar, setSelectedAvatar] = useState(null);

  const getdayvalue = () => {
    // Get the current date
    const currentDate = new Date();
    // Get the day of the week (0 for Sunday, 1 for Monday, ..., 6 for Saturday)
    const dayOfWeek = currentDate.getDay();

    // Map the day of the week to the corresponding numeric value
    switch (dayOfWeek) {
      case 0:
        return 7; // Sunday mapped to 7
      case 1:
        return 1; // Monday mapped to 1
      case 2:
        return 2; // Tuesday mapped to 2
      case 3:
        return 3; // Wednesday mapped to 3
      case 4:
        return 4; // Thursday mapped to 4
      case 5:
        return 5; // Friday mapped to 5
      case 6:
        return 6; // Saturday mapped to 6
      default:
        return -1; // Error case
    }
  };

  const handleAvatarPress = (item) => {
    console.log("iteemmm", item)
    setSelectedAvatar(item);
    setModalVisibleComp2(true);
  };
  // console.log("avatarurl",selectedAvatar)

  // const convertedSelectedItem = selectedItem
  //   ? Object.values(selectedItem.activity).flatMap(
  //     (customerArray) => customerArray
  //   )
  //   : [];

  // const convertedSelectedItem = selectedItem
  //   ? Object.values(selectedItem.activity).flatMap((customerArray) =>
  //     customerArray.filter((item) => item.day === getdayvalue())
  //   )
  //   : [];

  // console.log("convertedSelectedItem", convertedSelectedItem);

  // console.log("convertedSelectedItem", convertedSelectedItem);

  const renderItem2 = ({ item }) => {


    if (item.type === 'add') {
      return (
        <TouchableOpacity
          style={styles.item}
          onPress={() => { setExternalModal(true) }}
        >
          <View style={{ alignItems: 'center', justifyContent: 'center', height: 80, width: 80, borderRadius: 40, backgroundColor: '#f0f0f0' }}>
            <AntDesign name="addusergroup" size={28} />
          </View>

          <View>
            <Text style={[styles.name, { fontSize: 12 }]}>External Visit</Text>
          </View>
        </TouchableOpacity>
      );
    }

    // Calculate color based on frequency
    const frequency = item.no_of_visit || 0; // Assuming frequency is provided in item
    const color = item.status === "Completed" ? "green" : "url(#gradient)";


    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => handleAvatarPress(item)}
      >

        <View style={{}}>
          <Svg height="80" width="80" style={styles.progress}>
            {item?.type == "External" && <View style={{ backgroundColor: 'orange', position: 'absolute', right: 0, padding: '5%', justifyContent: 'center', alignItems: 'center', borderRadius: 25, width: 25, height: 25 }}><Text style={{ fontFamily: 'AvenirNextCyr-Bold', color: 'white' }}>E</Text></View>}
            {/* Circular progress */}
            <Circle
              cx="50%"
              cy="50%"
              r="43%"
              stroke={color}
              strokeWidth="6"
              fill="transparent"
            />
            {/* Linear gradient */}
            {frequency !== "1/1" && (
              <LinearGradient1 id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#6F40AC" />
                <Stop offset="100%" stopColor="#CD4855" />
                {/* colors={['#011A90', '#851E71']} */}
              </LinearGradient1>
            )}

          </Svg>
          {item?.profile_picture ? (
            <Image
              source={{ uri: item.profile_picture }}
              style={{ ...styles.avatar }}
            />
          ) : (
            <Image
              source={require("../../assets/images/doctor.jpg")}
              style={{ ...styles.avatar }}
            />
          )}
        </View>

        <Text
          style={styles.name}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };


  return (
    <GestureHandlerRootView style={{ flex: 1 ,backgroundColor:'white' }}>
      <BottomSheetModalProvider>
        <View style={styles.container}>
          {clockedIn == false ? (
            <ClockIn
              faceRecognise={faceRecognise}
              logoutAlert={logoutAlert}
              loading={loading}
            />
          ) : (
            <View style={{ flex: 1 }}>
              {showConfetti && (
                <View style={styles.confettiContainer}>
                  <ConfettiCannon
                    count={100} // Adjust the number of confetti pieces
                    origin={{ x: -10, y: 0 }} // Adjust the starting point of confetti
                    autoStart={showConfetti}
                  />
                </View>
              )}
              <AwesomeAlert
                show={showAlert}
                showProgress={false}
                title="Awesome Alert"
                message="This is an example of Awesome Alert!"
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={false}
                showCancelButton={false}
                showConfirmButton={true}
                confirmText="Thank You"
                confirmButtonColor="#DD6B55"
                onConfirmPressed={hideAlertFunction}
                alertContainerStyle={{ ...styles.alertContainer }}
              />
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingHorizontal: 10,
                  alignItems: "center",
                  marginTop: 10,
                  marginBottom: "2%",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      setModalVisibleComp1(true);
                    }}
                  >
                    <Image
                      source={require("../../assets/images/ordologo-bg.png")}
                      style={{ height: 50, width: 45, marginRight: 5 }}
                    />
                  </TouchableOpacity>
                  {/* <TouchableOpacity onPress={() => {
                setModalVisibleComp(true);

              }
              } >
                <Image source={require('../../assets/images/assure-logo.png')} style={{ height: 45, width: 50, }} />
              </TouchableOpacity> */}
                  <View style={{ flexDirection: "column" }}>
                    <Text
                      style={{ fontSize: 19, fontFamily: "AvenirNextCyr-Bold" , color: Colors.primary,}}
                    >
                      Welcome
                    </Text>
                    <Text
                      style={{
                        color: "gray",
                        fontFamily: "AvenirNextCyr-Medium",
                      }}
                    >
                      {userData?.name}
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    gap: 15,
                  }}
                >
                  {/* <Feather name="shopping-cart" color={`black`} size={30} /> */}
                  <Menu
                    visible={visible}
                    anchor={
                      <TouchableOpacity onPress={showMenu}>
                        <Image
                          source={require("../../assets/images/UserMgmt.png")}
                          style={{
                            height: 40,
                            width: 40,
                            tintColor: Colors.primary,
                            marginRight: 10,
                          }}
                        />
                        {/* <Text style={{ fontSize: 10, color: Colors.primary, fontFamily: 'AvenirNextCyr-Thin' }}>{userData?.name}</Text> */}
                      </TouchableOpacity>
                    }
                    onRequestClose={hideMenu}
                    tyle={{ paddingBottom: 10, marginRight: 10 }}
                  >
                    <MenuItem style={{ fontSize: 14 }}>
                      <MaterialCommunityIcons
                        name="account-edit-outline"
                        size={23}
                        color="black"
                      />{" "}
                      <Text
                        style={{
                          fontFamily: "AvenirNextCyr-Medium",
                          fontSize: 13.5,
                        }}
                      >
                        Edit Profile
                      </Text>
                    </MenuItem>
                    <MenuDivider color="gray" />
                    <MenuItem style={{ fontSize: 12 }}>
                      <MaterialCommunityIcons
                        name="shield-check-outline"
                        size={18}
                        color="black"
                      />{" "}
                      <Text
                        style={{
                          fontFamily: "AvenirNextCyr-Medium",
                          fontSize: 13.5,
                        }}
                      >
                        Change Password
                      </Text>
                    </MenuItem>
                    <MenuDivider color="gray" />

                    <MenuItem onPress={logoutAlert} style={{ fontSize: 14 }}>
                      <MaterialCommunityIcons
                        name="logout"
                        size={17}
                        color="black"
                      />{" "}
                      <Text
                        style={{
                          fontFamily: "AvenirNextCyr-Medium",
                          fontSize: 13.5,
                        }}
                      >
                        Log Out
                      </Text>
                    </MenuItem>

                    {/* {!clockedOut && <MenuDivider />} */}
                    {/* {!clockedOut && <MenuItem onPress={clockoutAlert}>Clock Out</MenuItem>} */}
                  </Menu>
                  {/* <Entypo name="menu" size={30} color="black" /> */}
                </View>
              </View>

              {(!approvedArray || approvedArray.length === 0) &&
                (!pendingArray || pendingArray.length === 0) ? (
                <View style={{ flex: 1, justifyContent: 'space-around' }}>

                  <View>
                    <Image
                      source={require("../../assets/images/empty.jpg")} // Replace with the actual path to your image
                      style={{
                        width: "100%",
                        height: "35%",
                        resizeMode: "contain",
                        marginTop: "25%",
                      }}
                    />
                    <View>
                      <Text
                        style={{
                          textAlign: "center",
                          fontFamily: "AvenirNextCyr-Medium",
                          fontSize: 23,
                          color: "rgba(101, 2, 49, 0.25)",
                        }}
                      >
                        No Active Tour Plan
                      </Text>
                      <Text
                        style={{
                          textAlign: "center",
                          fontFamily: "AvenirNextCyr-Medium",
                          fontSize: 14,
                          color: "rgba(101, 2, 49, 0.45)",
                        }}
                      >
                        Create a Tour Plan
                      </Text>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "center",
                          marginTop: "4%",
                        }}
                      >
                        <LinearGradient
                          colors={Colors.linearColors}
                          start={Colors.start}
                          end={Colors.end}
                          locations={Colors.ButtonsLocation}
                          style={{ borderRadius: 30 }}
                        >
                          <TouchableOpacity
                            style={{
                              paddingHorizontal: "5%",
                              flexDirection: "row",
                              alignItems: "center",
                              borderRadius: 30,
                              justifyContent: "center",
                              paddingVertical: "5%",
                              // backgroundColor:'red'
                            }}
                            onPress={() => {
                              navigation.navigate("CreatePlan", { screen: "create" });
                            }}
                          >

                            <Text
                              style={{
                                fontFamily: "AvenirNextCyr-Medium",
                                color: "white",
                                fontSize: 18,
                              }}
                            >
                              Create Plan
                            </Text>
                          </TouchableOpacity>
                        </LinearGradient>
                      </View>
                    </View>
                  </View>


                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-around",
                      paddingHorizontal: 18,
                      gap: 20,
                      marginTop: 8,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate("Customer");
                      }}
                      style={{
                        flexDirection: "column",
                        justifyContent: "center",
                        paddingVertical: "4%",
                        backgroundColor: "#F4F6FF",
                        borderRadius: 10,
                        flex: 1,
                        paddingHorizontal: "1%",
                        alignItems: "center",
                      }}
                    >
                      <Feather name="users" size={28} color={"#577FF4"} />

                      <Text
                        style={{
                          fontFamily: "AvenirNextCyr-Medium",
                          fontSize: 12,
                          color: "#577FF4",
                          textAlign: "center",
                          marginTop: 5,
                        }}
                      >
                        Customers
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate("Insights");
                      }}
                      style={{
                        flexDirection: "column",
                        justifyContent: "center",
                        paddingVertical: "4%",
                        backgroundColor: "#FFF9E5",
                        borderRadius: 10,
                        flex: 1,
                        paddingHorizontal: "1%",
                        alignItems: "center",
                      }}
                    >
                      <Foundation
                        name="graph-trend"
                        size={30}
                        color={"#CCA10E"}
                      />

                      <Text
                        style={{
                          fontFamily: "AvenirNextCyr-Medium",
                          fontSize: 12,
                          color: "#CCA10E",
                          textAlign: "center",
                          marginTop: 5,
                        }}
                      >
                        Insights
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate("Products");
                      }}
                      style={{
                        flexDirection: "column",
                        justifyContent: "center",
                        paddingVertical: "4%",
                        backgroundColor: "#EDFDF0",
                        borderRadius: 10,
                        flex: 1,
                        paddingHorizontal: "1%",
                        alignItems: "center",
                      }}
                    >
                      <Feather name="package" size={28} color={"green"} />

                      <Text
                        style={{
                          fontFamily: "AvenirNextCyr-Medium",
                          fontSize: 12,
                          color: "green",
                          textAlign: "center",
                          marginTop: 5,
                        }}
                      >
                        Products
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate("Updates");
                      }}
                      style={{
                        flexDirection: "column",
                        justifyContent: "center",
                        paddingVertical: "4%",
                        backgroundColor: "#F0EFF4",
                        borderRadius: 10,
                        flex: 1,
                        paddingHorizontal: "1%",
                        alignItems: "center",
                      }}
                    >
                      <AntDesign name="filetext1" size={26} color={"#323090"} />

                      <Text
                        style={{
                          fontFamily: "AvenirNextCyr-Medium",
                          fontSize: 12,
                          color: "#323090",
                          textAlign: "center",
                          marginTop: 5,
                        }}
                      >
                        Tasks
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <ScrollView
                  style={{ paddingBottom: "15%" }}
                  // onScroll={onScroll}
                  refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                    />
                  }
                >
                  <View
                    style={{
                      flexDirection: "row",
                      flex: 1,
                      marginHorizontal: 16,
                      gap: 16,
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: "#F6F6F6",
                        borderRadius: 6,
                        flex: 0.75,
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      {selectedItem && (
                        <TouchableOpacity
                          style={{ flex: 0.5 }}
                          onPress={() => {
                            navigation.navigate("PlanDetails", {
                              item: selectedItem, planId: selectedItem.id
                            });
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 13,
                              fontFamily: "AvenirNextCyr-Medium",
                              paddingLeft: 10,
                              paddingRight: 5,
                              flexWrap: "wrap",
                            }}
                          >
                            {selectedItem.name}
                          </Text>
                        </TouchableOpacity>
                      )}
                      <View style={{ flex: 0.1, marginBottom: 3 }}>
                        <TouchableOpacity
                          // onPress={ navigation.navigate('PlanDetails', { item: selectedItem })}
                          onPress={() => {
                            navigation.navigate("PlanDetails", {
                              item: selectedItem, planId: selectedItem.id
                            });
                          }}
                        >
                          <AntDesign
                            name="infocirlceo"
                            size={14}
                            color={Colors.black}
                          />
                        </TouchableOpacity>
                      </View>

                      <View
                        style={{
                          flex: 0.4,
                          alignItems: "center",
                          paddingHorizontal: "3%",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 12,

                            fontFamily: "AvenirNextCyr-Medium",
                            marginLeft: 10,
                            paddingHorizontal: 6,
                            paddingTop: 1,
                            backgroundColor:
                              approvedArray.length > 0 ? "#E6E6E6" : "orange",
                            borderRadius: 50,
                            color: approvedArray.length > 0 ? "green" : "white",
                            borderWidth: 0.5,
                            borderColor:
                              approvedArray.length > 0 ? "green" : "orange",
                            alignItems: "center",
                          }}
                        >
                          {/* {approvedArray.length > 0 ? "Active" : "Pending"} */}
                          {selectedItem?.status}
                        </Text>
                      </View>


                      <View style={{ marginLeft: "8%", flex: 0.1 }}>
                        <TouchableOpacity onPress={toggleBottomSheet}>
                          <AntDesign
                            name={
                              isBottomSheetOpen ? "upcircleo" : "downcircleo"
                            }
                            size={18}
                            color={"gray"}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>

                    <View style={{ flex: 0.25 }}>
                      <LinearGradient
                        colors={Colors.linearColors}
                        start={Colors.start}
                        end={Colors.end}
                        locations={Colors.ButtonsLocation}
                        style={{ borderRadius: 8 }}
                      >
                        {!clockedOut && (
                          <TouchableOpacity
                            style={styles.createPlanBtn}
                            onPress={() => {
                              navigation.navigate("CreatePlan", { screen: "create" });
                              // { salesManager ? navigation.navigate('SMCreatePlan') : navigation.navigate('CreatePlan') }
                            }}
                          >
                            <Text style={styles.buttonTextStyle}>
                              Create Plan
                            </Text>
                          </TouchableOpacity>
                        )}
                      </LinearGradient>
                    </View>
                  </View>


                  {selectedItem?.status !== "Pending" && selectedItem?.status !== "Completed" && <View style={{}}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: "AvenirNextCyr-Medium",
                        paddingHorizontal: 16,
                        paddingVertical: 8,
                      }}
                    >
                      Customer Visits
                    </Text>
                    <View style={{ marginBottom: 0, paddingHorizontal: 8 }}>
                      <FlatList
                        data={todaysDealers}
                        renderItem={renderItem2}
                        keyExtractor={(item) => item.id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                      />
                    </View>
                  </View>}


                  <View style={{ marginTop: "2%" }}>
                    <LinearGradient
                      colors={Colors.linearColors}
                      start={Colors.start}
                      end={Colors.end}
                      locations={Colors.ButtonsLocation}
                      style={{
                        borderRadius: 20,
                        alignItems: "center",
                        flex: 1,
                        marginHorizontal: 16,
                        padding: "3%",
                        elevation: 10,
                        ...globalStyles.border,
                      }}
                    >
                      {/* <Text style={styles.label}>Target Vs Achievement</Text> */}
                      {/* <Text style={styles.label}>Sales Performace</Text> */}
                      <View
                        style={{
                          flexDirection: "row-reverse",
                          marginTop: "1%",
                          gap: 50,
                          // justifyContent:'space-between'
                        }}
                      >
                        {/* <Text style={{ ...styles.label, fontSize: 16, color: Colors.black, marginVertical: 5, fontFamily: 'AvenirNextCyr-Medium' }}>Sales</Text> */}

                        <CircularProgress
                          value={
                            selectedItem?.total_visits !== 0 &&
                              selectedItem?.total_visits !== undefined
                              ? (selectedItem?.completed_visits /
                                selectedItem?.total_visits) *
                              100
                              : 0
                          }
                          activeStrokeColor={"white"}
                          activeStrokeWidth={7}
                          //   activeStrokeSecondaryColor={'#851E71'}
                          inActiveStrokeColor={"#FFFFFF"}
                          inActiveStrokeOpacity={0.2}
                          inActiveStrokeWidth={7}
                          progressValueColor={"white"}
                          valueSuffix={"%"}
                          radius={70}
                        />

                        {/* </View> */}

                        <View style={{ marginTop: 0 }}>
                          <Text style={styles.subHeading}>Visit Status </Text>
                          {/* <Text style={styles.subHeading1}>4 more days left !! </Text> */}
                          <View
                            style={{
                              flexDirection: "row",
                              alignContent: "center",
                              marginTop: 4,
                              gap: 7,
                            }}
                          >
                            <Feather
                              name="check-circle"
                              color={`white`}
                              size={18}
                            />
                            <Text
                              style={{
                                color: "white",
                                fontFamily: "AvenirNextCyr-Medium",
                                fontSize: 13,
                              }}
                            >
                              Total Visits {selectedItem?.total_visits}
                            </Text>
                          </View>
                          <View
                            style={{
                              flexDirection: "row",
                              alignContent: "center",
                              marginTop: 5,
                              gap: 5,
                            }}
                          >
                            <Ionicons
                              name="checkmark-done"
                              color={`white`}
                              size={20}
                            />
                            <Text
                              style={{
                                color: "white",
                                fontFamily: "AvenirNextCyr-Medium",
                                fontSize: 13,
                              }}
                            >
                              Completed Visits {selectedItem?.completed_visits}
                            </Text>
                          </View>
                          <View
                            style={{
                              flexDirection: "row",
                              alignContent: "center",
                              marginTop: 4,
                              gap: 5,
                            }}
                          >
                            <Ionicons
                              name="checkmark-outline"
                              color={`white`}
                              size={20}
                            />
                            <Text
                              style={{
                                color: "white",
                                fontFamily: "AvenirNextCyr-Medium",
                                fontSize: 13,
                              }}
                            >
                              Pending Visits {selectedItem?.pending_visits}
                            </Text>
                          </View>
                          <View
                            style={{
                              flexDirection: "row",
                              alignContent: "center",
                              marginTop: 4,
                              gap: 5,
                            }}
                          >
                            <MaterialCommunityIcons
                              name="calendar-blank"
                              color={`white`}
                              size={20}
                            />
                            <Text
                              style={{
                                color: "white",
                                fontFamily: "AvenirNextCyr-Medium",
                                fontSize: 13,
                              }}
                            >
                              Remaining Days {selectedItem?.remaining_days}
                            </Text>
                          </View>
                          {/* <Text style={{color:'white',marginTop:'5%',fontFamily:'AvenirNextCyr-Medium',fontSize:16}}>Almost There !!</Text> */}
                        </View>
                      </View>
                    </LinearGradient>
                  </View>

                  {/* </View> */}

                  {/* {creditData.length !== 0 && */}
                  {/* <View style={{ paddingHorizontal: 16, paddingVertical: 5 }}>
              <Text style={{
                fontSize: 18,
                fontFamily: 'AvenirNextCyr-Medium',
              }}>Credit Holders</Text>
            </View> */}
                  {/* } */}

                  {/* <View style={{ marginBottom: 5 }}>
              <FlatList
                data={data}
                renderItem={renderItem2}
                keyExtractor={(item) => item.id}
                horizontal
              />
            </View> */}
                  <View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          color: "#011A90",
                          fontFamily: "AvenirNextCyr-Bold",
                          fontSize: 18,
                          marginTop: "3%",
                          marginHorizontal: 16,
                          marginBottom: "3%",
                        }}
                      >
                        Tour Plan Statistics
                      </Text>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          textAlign: "center",
                          justifyContent: "flex-end",
                        }}
                      >
                        <View>
                          <Text
                            style={{
                              // color:isSwitchOn ? 'green' : 'tomato',
                              fontSize: 14,
                              fontFamily: "AvenirNextCyr-Medium",
                            }}
                          >
                            {isSwitchOn ? "Annually" : "Daily"}
                          </Text>
                        </View>
                        <View>
                          <Switch
                            value={isSwitchOn}
                            onValueChange={onToggleSwitch}
                          // color="green"
                          />
                        </View>
                      </View>
                    </View>

                    <View style={styles.rowContainer}>
                      <View style={styles.MgmtContainer}>
                        <View style={styles.MgmtImageContainer}>
                          <Image
                            source={require("../../assets/images/Mask-group.png")}
                          />
                        </View>
                        <View style={styles.MgmtTextContainer}>
                          <Text
                            style={{
                              ...styles.MgmtText,
                              fontSize: 16,
                              fontFamily: "AvenirNextCyr-Bold",
                            }}
                          >
                            {currentSalesData?.total_sales} AED
                          </Text>
                          <Text style={styles.MgmtText}>Sales</Text>
                        </View>
                      </View>

                      <View style={styles.MgmtContainer}>
                        <View style={styles.MgmtImageContainer}>
                          <Image
                            source={require("../../assets/images/Mask-group1.png")}
                          />
                        </View>
                        <View style={styles.MgmtTextContainer}>
                          <Text
                            style={{
                              fontSize: 18,
                              textAlign: "center",
                              fontFamily: "AvenirNextCyr-Bold",
                            }}
                          >
                            {currentSalesData?.total_returns}
                          </Text>
                          <Text style={styles.MgmtText}>Returns</Text>
                        </View>
                      </View>
                    </View>

                    <View style={styles.rowContainer}>
                      <View style={styles.MgmtContainer}>
                        <View style={styles.MgmtImageContainer}>
                          <Image
                            source={require("../../assets/images/Mask-group2.png")}
                          />
                        </View>
                        <View style={styles.MgmtTextContainer}>
                          <Text
                            style={{
                              fontSize: 18,
                              textAlign: "center",
                              fontFamily: "AvenirNextCyr-Bold",
                            }}
                          >
                            {currentSalesData?.total_payments}
                          </Text>
                          <Text style={styles.MgmtText}>Payments</Text>
                        </View>
                      </View>

                      <View style={styles.MgmtContainer}>
                        <View style={styles.MgmtImageContainer}>
                          <Image
                            source={require("../../assets/images/Mask-group3.png")}
                          />
                        </View>
                        <View style={styles.MgmtTextContainer}>
                          <Text
                            style={{
                              fontSize: 18,
                              textAlign: "center",
                              fontFamily: "AvenirNextCyr-Bold",
                            }}
                          >
                            {currentSalesData?.completed_visits}
                          </Text>
                          <Text style={styles.MgmtText}>Visits</Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-around",
                      paddingHorizontal: 18,
                      gap: 20,
                      marginTop: 8,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate("Customer");
                      }}
                      style={{
                        flexDirection: "column",
                        justifyContent: "center",
                        paddingVertical: "4%",
                        backgroundColor: "#F4F6FF",
                        borderRadius: 10,
                        flex: 1,
                        paddingHorizontal: "1%",
                        alignItems: "center",
                      }}
                    >
                      <Feather name="users" size={28} color={"#577FF4"} />

                      <Text
                        style={{
                          fontFamily: "AvenirNextCyr-Medium",
                          fontSize: 12,
                          color: "#577FF4",
                          textAlign: "center",
                          marginTop: 5,
                        }}
                      >
                        Customers
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate("Insights");
                      }}
                      style={{
                        flexDirection: "column",
                        justifyContent: "center",
                        paddingVertical: "4%",
                        backgroundColor: "#FFF9E5",
                        borderRadius: 10,
                        flex: 1,
                        paddingHorizontal: "1%",
                        alignItems: "center",
                      }}
                    >
                      <Foundation
                        name="graph-trend"
                        size={30}
                        color={"#CCA10E"}
                      />

                      <Text
                        style={{
                          fontFamily: "AvenirNextCyr-Medium",
                          fontSize: 12,
                          color: "#CCA10E",
                          textAlign: "center",
                          marginTop: 5,
                        }}
                      >
                        Insights
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate("Products");
                      }}
                      style={{
                        flexDirection: "column",
                        justifyContent: "center",
                        paddingVertical: "4%",
                        backgroundColor: "#EDFDF0",
                        borderRadius: 10,
                        flex: 1,
                        paddingHorizontal: "1%",
                        alignItems: "center",
                      }}
                    >
                      <Feather name="package" size={28} color={"green"} />

                      <Text
                        style={{
                          fontFamily: "AvenirNextCyr-Medium",
                          fontSize: 12,
                          color: "green",
                          textAlign: "center",
                          marginTop: 5,
                        }}
                      >
                        Products
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate("Updates");
                      }}
                      style={{
                        flexDirection: "column",
                        justifyContent: "center",
                        paddingVertical: "4%",
                        backgroundColor: "#F0EFF4",
                        borderRadius: 10,
                        flex: 1,
                        paddingHorizontal: "1%",
                        alignItems: "center",
                      }}
                    >
                      <AntDesign name="filetext1" size={26} color={"#323090"} />

                      <Text
                        style={{
                          fontFamily: "AvenirNextCyr-Medium",
                          fontSize: 12,
                          color: "#323090",
                          textAlign: "center",
                          marginTop: 5,
                        }}
                      >
                        Tasks
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {/* </View> */}

                  {/* <View style={{marginTop:'2%',alignItems:'center'}}>
                      <Text style={{color:`#B3B3B3`,fontSize:12 ,elevation: 10, ...globalStyles.border}}>

                      <AntDesign name='copyright' style={{  paddingLeft: '10%',elevation: 5, ...globalStyles.border}} color={`#B3B3B3`} size={10} />
                        2024 PrimeSophic Technology. All rights reserved
                      </Text>
                      </View> */}
                </ScrollView>
              )}
            </View>
          )}

          {/* {(clockedIn == true || salesManager) &&
        <ActionButton
          buttonColor={Colors.primary}
          renderIcon={() => <Ionicons name='chatbox' color='#fff' size={20} />}
          onPress={() => { navigation.navigate('UserList') }}
        />} */}

          <Modal
            visible={isModalVisible}
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
                }}
              >
                {/* new */}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 10,
                  }}
                >
                  <Text style={styles.modalTitle}>Request Report</Text>
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <AntDesign name="close" size={20} color={`black`} />
                  </TouchableOpacity>
                </View>
                <View style={styles.dropDownContainer}>
                  <Dropdown
                    style={[
                      styles.dropdown,
                      isFocus && { borderColor: "blue" },
                    ]}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    itemTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                    data={optionData}
                    //search
                    maxHeight={400}
                    labelField="label"
                    valueField="value"
                    placeholder={!isFocus ? "Select report type" : "..."}
                    //searchPlaceholder="Search..."
                    value={reportValue}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    onChange={(item) => {
                      setReportValue(item.value);
                      setIsFocus(false);
                    }}

                  // renderLeftIcon={() => (
                  //   <AntDesign
                  //     style={styles.icon}
                  //     color={isFocus ? 'blue' : 'black'}
                  //     name="Safety"
                  //     size={20}
                  //   />
                  // )}
                  />
                </View>
                <View style={styles.buttonview}>
                  <TouchableOpacity
                    style={styles.buttonContainer}
                    onPress={() => {
                      requestPDF();
                      //navigation.navigate('PDFViewer', { title: value });
                      //navigation.navigate('PDFViewer', { title: value });
                      // Alert.alert('Report Request', 'Check your email report sent sucessfully', [
                      //     { text: 'OK',onPress: () => navigation.navigate('PDFViewer') },
                      // ]);
                    }}
                  >
                    <Text style={styles.buttonText}>Submit</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          <Modal
            visible={isModalVisibleComp}
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
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 10,
                  }}
                >
                  <TouchableOpacity
                    style={{
                      alignContent: "center",
                      flex: 1,
                      justifyContent: "center",
                      flexDirection: "row",
                    }}
                    onPress={() => {
                      setModalVisibleComp(true);
                    }}
                  >
                    <Image
                      source={require("../../assets/images/assure-logo.png")}
                      style={{ height: 80, width: 80 }}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setModalVisibleComp(false)}>
                    <AntDesign name="close" size={20} color={`black`} />
                  </TouchableOpacity>
                </View>
                <Card style={styles.card}>
                  <Card.Content>
                    <Title style={styles.title1}>Company Information</Title>
                    <View style={styles.infoRow}>
                      <Text style={styles.label1}>Company Name :</Text>
                      <Paragraph style={styles.info}>
                        Assure Lifescience Pvt. Ltd.
                      </Paragraph>
                    </View>
                    {/* <View style={styles.infoRow}>
                  <Text style={styles.label1}>Additional Business : </Text>
                  <Paragraph style={styles.info}>Trader, Supplier</Paragraph>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label1}>Year of Establishment : </Text>
                  <Paragraph style={styles.info}>2008</Paragraph>
                </View> */}
                  </Card.Content>
                  <Card.Content>
                    {/* <Title style={styles.title1}>Statutory Profile</Title> */}
                    <View style={styles.infoRow}>
                      <Text style={styles.label1}>GST No.: </Text>
                      <Paragraph style={styles.info}>07AAHCA0400E1ZH</Paragraph>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.label1}>DL No.: </Text>
                      <Paragraph style={styles.info}>
                        DL-SDB-103821(20B),103822(21B)
                      </Paragraph>
                    </View>
                  </Card.Content>
                  <Card.Content>
                    <Title style={styles.title}>Contact Us</Title>
                    <Button
                      mode="contained"
                      onPress={handlePhonePress}
                      style={styles.contactButton}
                      labelStyle={styles.buttonLabel}
                    >
                      Call: {phoneNumber}
                    </Button>
                    <Button
                      mode="contained"
                      onPress={handleEmailPress}
                      style={styles.contactButton}
                      labelStyle={styles.buttonLabel}
                    >
                      Email: {email}
                    </Button>
                  </Card.Content>
                </Card>
              </View>
            </View>
          </Modal>

          <Modal
            visible={isModalVisibleComp1}
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
                    }}
                  >
                    <Image
                      source={require("../../assets/images/ordologo-bg.png")}
                      style={{ height: 80, width: 80 }}
                    />
                  </View>
                  <TouchableOpacity onPress={() => setModalVisibleComp1(false)}>
                    <AntDesign name="close" size={20} color={`black`} />
                  </TouchableOpacity>
                </View>
                <Card style={styles.card}>
                  <Card.Content>
                    <Title
                      style={{
                        textAlign: "center",
                        fontSize: 13,
                        fontFamily: "AvenirNextCyr-Medium",
                        color: "black",
                      }}
                    >
                      OrDo - Version {appVersion}
                    </Title>
                    <Title
                      style={{
                        textAlign: "center",
                        fontSize: 10,
                        fontFamily: "AvenirNextCyr-Medium",
                      }}
                    >
                      © 2024 PrimeSophic Technologies. All rights Reserved
                    </Title>
                    {/* <View style={styles.infoRow}>
                  <Text style={styles.label1}>Company Name :</Text>
                  <Paragraph style={styles.info}>Assure Lifescience Pvt. Ltd.</Paragraph>
                </View> */}
                    {/* <View style={styles.infoRow}>
                  <Text style={styles.label1}>Additional Business : </Text>
                  <Paragraph style={styles.info}>Trader, Supplier</Paragraph>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label1}>Year of Establishment : </Text>
                  <Paragraph style={styles.info}>2008</Paragraph>
                </View> */}
                  </Card.Content>
                </Card>
              </View>
            </View>
          </Modal>

          <Modal
            visible={isModalVisibleComp2}
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
                    {/* Conditionally render the selected avatar's image */}

                    <View style={{}}>
                      <Svg height="80" width="80" style={styles.progress}>
                        {/* Circular progress */}
                        <Circle
                          cx="50%"
                          cy="50%"
                          r="43%"
                          stroke={Colors.primary}
                          strokeWidth="6"
                          fill="transparent"
                        />

                      </Svg>
                      {selectedAvatar?.profile_picture ? (
                        <Image
                          source={{ uri: selectedAvatar.profile_picture }}
                          style={{ ...styles.avatar }}
                        />
                      ) : (
                        <Image
                          source={require("../../assets/images/doctor.jpg")}
                          style={{ ...styles.avatar }}
                        />
                      )}
                    </View>

                    {/* {selectedAvatar && <Image source={{ uri: selectedAvatar.avatarUrl }} style={{ height: 80, width: 80 }} />} */}
                  </View>
                  <TouchableOpacity onPress={() => setModalVisibleComp2(false)}>
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
                  <View style={{ marginLeft: 10, flex: 1 }}>
                    {selectedAvatar ? (
                      <View style={{ width: "100%", height: "100%" }}>
                        <MapboxGL.MapView
                          styleURL={MapboxGL.StyleURL.Street}
                          zoomLevel={12}
                          zoomEnabled={true}
                          rotateEnabled={true}
                          style={{ width: "100%", height: "100%" }}
                        >
                          <MapboxGL.Camera
                            zoomLevel={12}
                            centerCoordinate={
                              selectedAvatar?.longitude && selectedAvatar?.latitude
                                ? [selectedAvatar.longitude, selectedAvatar.latitude]
                                : userCordinates
                            }
                            animationMode={"flyTo"}
                            animationDuration={0}
                            pitch={60}
                          />

                          {userCordinates && (
                            <MapboxGL.PointAnnotation
                              id="pointAnnotation"
                              key={"UserLocation"}
                              coordinate={
                                selectedAvatar?.longitude && selectedAvatar?.latitude
                                  ? [selectedAvatar.longitude, selectedAvatar.latitude]
                                  : userCordinates
                              }
                            >
                              {/* <View
                                style={{
                                  height: 30,
                                  width: 30,
                                  backgroundColor: "#3f6de7",
                                  borderRadius: 50,
                                  borderColor: "#fff",
                                  borderWidth: 3,
                                }}
                              /> */}
                              <Callout
                                title={selectedAvatar?.name}
                                textStyle={{
                                  fontFamily: "AvenirNextCyr-Thin",
                                  fontSize: 12,
                                }}
                                selected={true}
                              ></Callout>
                            </MapboxGL.PointAnnotation>
                          )}

                          {routeDirections && (
                            <MapboxGL.ShapeSource
                              id="line1"
                              shape={routeDirections}
                            >
                              <MapboxGL.LineLayer
                                id="routerLine01"
                                style={{
                                  lineColor: "blue",
                                  lineWidth: 4,
                                }}
                              />
                            </MapboxGL.ShapeSource>
                          )}

                          {/* {allCustomers.slice(1).map((account, index) => (
                            <MapboxGL.PointAnnotation
                              key={index}
                              id={`destinationPoint${index}`}
                              coordinate={[
                                parseFloat(account.longitude),
                                parseFloat(account.latitude),
                              ]}
                            >
                              <Callout
                                title={account?.name}
                                textStyle={{
                                  fontFamily: "AvenirNextCyr-Thin",
                                  fontSize: 12,
                                }}
                                selected={true}
                              ></Callout>
                            </MapboxGL.PointAnnotation>
                          ))} */}
                        </MapboxGL.MapView>
                      </View>
                    ) : (
                      <View
                        style={{
                          flex: 1,
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: "rgba(0, 0, 0, 0.5)",
                        }}
                      >
                        <ActivityIndicator
                          size="large"
                          color={Colors.primary}
                        />
                      </View>
                    )}
                  </View>
                  {/* Vertical Line */}
                  <View style={{ width: 1, backgroundColor: "black" }} />

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
                      {selectedAvatar?.name}
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
                      {selectedAvatar?.client_address}
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
                      {selectedAvatar?.postal_code}
                    </Text>
                  </View>
                </View>

                {approvedArray.length > 0 && // Check if approvedArray length is greater than or equal to 0
                  (selectedAvatar?.status === "Completed" ? (
                    <View
                      style={{
                        height: 40,
                        backgroundColor: "green",
                        marginHorizontal: "15%",
                        borderRadius: 20,
                        alignItems: "center",
                        justifyContent: "center",
                        elevation: 5,
                        ...globalStyles.border,
                        marginTop: 10,
                      }}
                    >
                      <Text
                        style={{
                          color: "white",
                          fontFamily: "AvenirNextCyr-Bold",
                          fontSize: 14,
                        }}
                      >
                        Completed
                      </Text>
                    </View>
                  ) : (
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
                      }}
                    >
                      <TouchableOpacity
                        style={{
                          flexDirection: "row",
                          width: "100%",
                          justifyContent: "space-around",
                        }}
                        onPress={() => manualCheckIn(selectedAvatar)}
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
                  ))}
              </View>
            </View>
          </Modal>

          <View>
            <TouchableOpacity
              activeOpacity={1}
              onPress={openBottomSheet}
              style={{
                borderRadius: 50,
                backgroundColor: "white",
                zIndex: 1,
                position: "absolute",
                left: "46%",
                bottom: "50%",
              }}
            >
              <Text
                style={{
                  color: "white",
                  backgroundColor: Colors.primary,
                  borderRadius: 50,
                  paddingVertical: "1%",
                  paddingLeft: "1%",
                  paddingRight: "1.3%",
                }}
              >
                {" "}
                <MaterialCommunityIcons
                  name="dots-grid"
                  size={25}
                  color="white"
                />
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={1}
              onPress={openBottomSheet}
              style={{
                backgroundColor: Colors.primary,
                paddingTop: "3.5%",
                paddingBottom: "1%",
                alignItems: "center",
                borderTopEndRadius: 20,
                borderTopStartRadius: 20,
              }}
            >
              <Text
                style={{
                  fontFamily: "AvenirNextCyr-Medium",
                  fontSize: 12,
                  color: "white",
                }}
              >
                Change Service
              </Text>
            </TouchableOpacity>
            <BottomSheetComponent navigation={navigation} closeBottomSheet={closeBottomSheet} bottomSheetModalRef={bottomSheetModalRef} />


            {/* active plan bottom sheet */}

            <BottomSheetModal
              ref={bottomSheetModalRef1}
              snapPoints={[600, 600]} // Define snap points here
              // color="red"
              index={0}
              zIndex={100}
            >
              <BottomSheetScrollView backgroundColor="#F1F1F1">
                <View style={{ flex: 1, backgroundColor: "white" }}>
                  <Text
                    style={{
                      fontFamily: "AvenirNextCyr-Bold",
                      fontSize: 15,
                      marginLeft: "5%",
                    }}
                  >
                    {approvedArray.length > 0
                      ? "Select Active Tour Plan"
                      : "Select Pending Tour Plan"}
                  </Text>

                  <FlatList
                    // data={dealerArray}
                    data={
                      approvedArray.length > 0 ? approvedArray : pendingArray
                    }
                    
                    renderItem={({ item }) => {
                      return (
                        <TouchableOpacity
                          style={styles.itemContainer}
                          key={item.id}
                          onPress={() => handleItemPress(item)}
                        >
                          <View style={styles.orderDataContainer}>
                            <View>
                              {/* <View style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between'
                                    }}>
                                        <View style={{
                                            flexDirection: 'row',
                                            alignItems: 'center'
                                        }}>
                                            <Image
                                                style={{ marginRight: 10, height: 15, width: 15, resizeMode: 'contain' }}
                                                source={require('../../assets/images/document2.png')} />
                                            <Text style={{ ...styles.title, color: Colors.black }}>{item?.username}</Text>
                                        </View>

                                    </View> */}

                              <View
                                style={{
                                  flexDirection: "row",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                }}
                              >
                                <View
                                  style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    marginTop: 3,
                                  }}
                                >
                                  <Image
                                    style={{
                                      marginRight: 10,
                                      height: 15,
                                      width: 15,
                                      resizeMode: "contain",
                                    }}
                                    source={require("../../assets/images/tick.png")}
                                  />
                                  <Text
                                    style={{
                                      ...styles.text,
                                      color: Colors.primary,
                                      fontFamily: "AvenirNextCyr-Medium",
                                    }}
                                  >
                                    {item?.name}{" "}
                                  </Text>
                                </View>
                                <Checkbox.Android
                                  status={
                                    selectedItem?.id === item.id
                                      ? "checked"
                                      : "unchecked"
                                  }
                                  onPress={() => handleItemPress(item)}
                                />
                              </View>

                              {/* <View style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        marginTop: 3,
                                    }}>
                                        <Image
                                            style={{ marginRight: 10, height: 15, width: 15, resizeMode: 'contain' }}
                                            source={require('../../assets/images/tick.png')} />
                                        <Text style={{ ...styles.text, color: color, fontFamily:'AvenirNextCyr-Medium' }}>{item.status == 'PendingApproval' ? 'Pending Approval' : item.status} </Text>
                                    </View> */}


                              <View
                                style={{
                                  flexDirection: "row",
                                  alignItems: "center",
                                  marginTop: 3,
                                }}
                              >
                                <Image
                                  style={{
                                    marginRight: 10, 
                                    height: 15,
                                    width: 15,
                                    resizeMode: "contain",
                                  }}
                                  source={require("../../assets/images/duration.png")}
                                />
                                <Text
                                  style={{ ...styles.text, fontWeight: "500" }}
                                >
                                  {moment(item.start_date).format("DD-MM-YYYY")}{" "}
                                  To{" "}
                                  {moment(item.end_date).format("DD-MM-YYYY")}
                                </Text>
                              </View>

                              <View
                                style={{
                                  flexDirection: "row",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                }}
                              >
                                {/* <TouchableOpacity style={{
                                            height: 35,
                                            width: 120,
                                            backgroundColor: Colors.primary,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            borderRadius: 5,
                                            padding: 5,
                                            marginVertical: 10
                                        }}
                                            onPress={() => handlePlan(item)}
                                        >
                                            <Text style={{ fontSize: 14, color: Colors.white, fontFamily: 'AvenirNextCyr-Thin', color: '#fff' }}>Details</Text>
                                        </TouchableOpacity> */}
                              </View>
                            </View>
                          </View>
                        </TouchableOpacity>

                        // <TouchableOpacity
                        //     style={styles.itemContainer}
                        //     onPress={() => navigation.navigate('SMApprovedPlanDetails', { item: item })}
                        //     // key={item.id}
                        //     activeOpacity={0.5}
                        // >
                        //     <View style={{ paddingHorizontal: 15, }}>
                        //         <View style={{ marginVertical: 3 }}>
                        //             {/* <Text style={styles.heading}>Plan Name : {item.name} </Text>
                        //     <Text style={styles.value}>Approved By : {item.approved_by}</Text>
                        //     <Text style={styles.heading}>No. of Visit : {item?.dealer_count} </Text>
                        //     <Text style={styles.heading}>Start Date : {item.start_date} </Text>
                        //     <Text style={styles.heading}>End Date : {item.end_date} </Text>
                        //     <Text style={styles.heading}>Status : {item.status} </Text> */}

                        //             {/* <Text style={styles.heading}>Salesman Name : {item?.ordo_user_name}</Text>
                        //             <Text style={styles.heading}>Plan Name : {item?.name}</Text>
                        //             <Text style={styles.heading}>No. of Visit : {item?.dealer_count}</Text>
                        //             <Text style={styles.heading}>Start Date : {item?.start_date}</Text>
                        //             <Text style={styles.heading}>End Date : {item.end_date}</Text> */}
                        //             <View style={{ flexDirection: 'row', }}>
                        //                 <View style={{ flex: 1 }}>
                        //                     <Text style={styles.heading}>Name:</Text>
                        //                     <Text style={{ ...styles.heading, fontFamily:'AvenirNextCyr-Medium' }}>{item.ordo_user_name}</Text>
                        //                 </View>
                        //                 <View style={{ flex: 1.6, marginLeft: 5 }}>
                        //                     <Text style={styles.heading}>Plan Name :</Text>
                        //                     <Text style={{ ...styles.heading, color: Colors.primary, fontFamily:'AvenirNextCyr-Medium' }}>{item.name} </Text>
                        //                 </View>
                        //             </View>
                        //             <View style={{ flexDirection: 'row', marginTop: 5 }}>
                        //                 <View style={{ flex: 1 }}>
                        //                     {/* <Text style={{ ...styles.heading, fontFamily: 'AvenirNextCyr-Thin' }}>Status :</Text>
                        //                     <Text style={{ ...styles.heading, color: color, fontFamily:'AvenirNextCyr-Medium' }}>{item.status == 'PendingApproval' ? 'In Progress' : item.status} </Text> */}
                        //                     <Text style={{ ...styles.heading, color: 'black' }}>No. of Visits :</Text>
                        //                     <Text style={{ ...styles.heading, color: 'black' }}>#{item?.dealer_count}</Text>
                        //                 </View>
                        //                 <View style={{ flex: 1.6, marginLeft: 5 }}>
                        //                     <Text style={styles.heading}>Plan Duration :</Text>
                        //                     <Text style={{ ...styles.heading, color: 'grey' }}>{moment(item.start_date).format('DD-MM-YYYY')} To {moment(item.end_date).format('DD-MM-YYYY')}  </Text>
                        //                 </View>
                        //             </View>
                        //         </View>
                        //     </View>

                        // </TouchableOpacity>
                      );
                    }}
                  />
                </View>
              </BottomSheetScrollView>
            </BottomSheetModal>
          </View>
        </View>
        <LoadingView visible={loading1} message="Please wait..." />
        <ExternalModal visible={externalModal} setExternalModal={setExternalModal} todaysDealers={allDealers} userCordinates={userCordinates} navigation={navigation} />
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export default Visits;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  itemContainer: {
    marginTop: 10,
    marginLeft: 16,
    marginRight: 16,
    borderRadius: 8,
    backgroundColor: Colors.white,
    borderWidth: 1,
    padding: 10,
    borderColor: Colors.white,
    elevation: 5,
    marginBottom: 5,
  },
  orderDataContainer: {
    paddingHorizontal: 10,
  },
  rowContainer: {
    //flexDirection: 'row',
    marginVertical: 3,
  },
  heading: {
    color: "#000",
    fontFamily: "AvenirNextCyr-Medium",
    fontSize: 14,
  },
  value: {
    color: "black",
    fontFamily: "AvenirNextCyr-Medium",
  },
  activityIndicator: {
    flex: 1,
    alignSelf: "center",
    height: 100,
    position: "absolute",
    top: "30%",
  },
  headerView: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginLeft: 16,
    marginTop: 10,
    marginRight: 5,
  },
  planView: {
    marginLeft: 20,
    marginTop: 10,
  },
  planText: {
    color: "black",
    fontSize: 16,
    fontFamily: "AvenirNextCyr-Medium",
  },

  createPlanBtn: {
    height: 40,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: Colors.primary,
    borderRadius: 8,
    //marginRight: 10
  },
  buttonTextStyle: {
    color: "#fff",
    fontFamily: "AvenirNextCyr-Medium",
    fontSize: 10,
  },
  button: {
    height: 40,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    padding: 10,
  },
  logout: {
    marginRight: 10,
  },
  title: {
    fontSize: 14,
    color: Colors.primary,
    fontFamily: "AvenirNextCyr-Medium",
    textTransform: "capitalize",
  },
  text: {
    fontSize: 14,
    color: Colors.black,
    fontFamily: "AvenirNextCyr-Medium",
  },
  planHeading: {
    color: "black",
    fontSize: 16,
    fontFamily: "AvenirNextCyr-Medium",
    marginVertical: 3,
  },
  carouselItem: {
    width: 270,
    height: 190,
    alignItems: "center",
    justifyContent: "center",
  },
  carouselimage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  container1: {
    marginTop: 15,
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  item: {
    flexDirection: "column",
    alignItems: "center",
    marginVertical: 10,
    // justifyContent: "center",
    width: 100

  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 50,
    borderWidth: 0.5,
    borderColor: "white",
    resizeMode: "contain",
    position: 'absolute',
    top: 10,
    left: 10
  },
  // name: {
  //   fontSize: 16,
  // },
  progress: {
    position: "relative",
    zIndex: 1,
    // bottom: 20,
    // right: 0,
    //  paddingRight: 30,
  },
  name: {

    fontSize: 12,
    textAlign: 'center'

  },
  alertContainer: {
    position: "absolute",
    zIndex: 2, // Ensure the alert is above the confetti
  },
  confettiContainer: {
    position: "absolute",
    zIndex: 1, // Ensure the confetti is below the AwesomeAlert
    width: "100%",
    height: "100%",
  },
  performanceContainer: {
    marginHorizontal: 16,
    padding: 10,
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    marginVertical: 10,
    elevation: 5,
    ...globalStyles.border,
    borderRadius: 5,
  },
  value: {
    fontSize: 20,
    color: Colors.primary,
    fontFamily: "AvenirNextCyr-Medium",
  },
  subHeading: {
    fontSize: 20,
    color: "white",
    fontFamily: "AvenirNextCyr-Bold",
    marginBottom: 5,
  },
  subHeading1: {
    fontSize: 13,
    color: "#D9D9D9",
    fontFamily: "AvenirNextCyr-Medium",
    marginBottom: "2%",
    marginTop: "-5%",
  },

  dropdown: {
    flex: 1,
    position: "absolute",
    top: 30, // Adjust the top position as needed
    backgroundColor: "white",
    padding: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
  },
  contentContainer: {
    marginTop: 20,
    // alignItems: 'center',
    // flex:1
  },
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },

  placeholderStyle: {
    fontSize: 14,
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
  modalTitle: {
    fontSize: 16,
    color: "black",
    fontFamily: "AvenirNextCyr-Medium",
  },
  buttonview: {
    flexDirection: "row",
  },
  buttonContainer: {
    height: 40,
    padding: 10,
    borderRadius: 10,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    //marginRight: 10,
    marginVertical: 10,
    backgroundColor: Colors.primary,
  },
  buttonText: {
    fontFamily: "AvenirNextCyr-Medium",
    color: "white",
  },
  card: {
    margin: 5,
    padding: 10,
    elevation: 4,
  },
  title1: {
    fontSize: 20,
    marginBottom: 10,
    fontFamily: "AvenirNextCyr-Medium",
    color: Colors.primary,
    // fontWeight: 'bold',
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 5,
    // flex:1
  },
  label1: {
    flex: 0.45,
    fontWeight: "bold",
    fontFamily: "AvenirNextCyr-Medium",
  },
  info: {
    flex: 0.55,
    fontFamily: "AvenirNextCyr-Medium",
  },
  contactButton: {
    marginVertical: 5,
    backgroundColor: "#6B1594", // Customize the button background color
  },
  buttonLabel: {
    color: "white",
    flex: 1, // Customize the button text color
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: "5%",
    marginBottom: "4.3%",
    flex: 1,
    gap: 20,
  },
  MgmtContainer: {
    paddingHorizontal: "3%",
    borderRadius: 10,
    elevation: 6,
    backgroundColor: "white",
    ...globalStyles.border,
    paddingVertical: "5%",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  MgmtTextContainer: {
    // marginTop: -15,
    // paddingHorizontal: '2%',
    flex: 0.65,
  },
  MgmtText: {
    fontFamily: "AvenirNextCyr-Medium",
    fontSize: 13,
    color: "#011A90",
    textAlign: "center",
  },
  MgmtImageContainer: {
    flexDirection: "row",
    flex: 0.35,

    // justifyContent: 'flex-end'
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "white",
    // marginRight: 16,
  },
  row1View: {
    //marginHorizontal: 50,
    // paddingHorizontal: 30,
    // marginLeft:30,
    marginTop: 10,
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "space-around",
    gap: 10,
  },
  recoredbuttonStyle: {
    borderRadius: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    marginHorizontal: 5,
    // shadowRadius: 2,
    // elevation: 5,
    height: 90,
    width: 110,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
});
