import React, { useState, useContext, useEffect, useRef } from "react";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
  LogBox,
  NativeEventEmitter,
  Modal,
  FlatList,
} from "react-native";
import styles from "./style";
import SampleData from "../../utils/SampleData";
import moment from "moment";
import { AuthContext } from "../../Context/AuthContext";
import firestore from "@react-native-firebase/firestore";
import { locationPermission, getAddress } from "../../utils/Helper";
import Geolocation from "react-native-geolocation-service";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import LinearGradient from "react-native-linear-gradient";

import { useFocusEffect } from "@react-navigation/native";
import FaceSDK, {
  Enum,
  FaceCaptureResponse,
  MatchFacesResponse,
  MatchFacesRequest,
  MatchFacesImage,
  MatchFacesSimilarityThresholdSplit,
  RNFaceApi,
} from "@regulaforensics/react-native-face-api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Colors from "../../constants/Colors";
import Icon from "react-native-vector-icons/FontAwesome";
import { Dropdown } from "react-native-element-dropdown";
import { ScrollView } from "react-native-gesture-handler";
import RNFetchBlob from 'rn-fetch-blob';

const eventManager = new NativeEventEmitter(RNFaceApi);

LogBox.ignoreLogs(["new NativeEventEmitter"]);
const Attendance = ({ navigation }) => {
  const [data, setData] = useState([]);
  const { logout, userData, userToken } = useContext(AuthContext);
  const [clockInPressed, setClockInPressed] = useState(false);
  const [docId, setdocId] = useState("");
  const place = useRef("");
  // const [noData, setNodata] = useState(false);
  const [attendanceMarked, setAttendanceMarked] = useState(false);

  const { token, salesManager } = useContext(AuthContext);
  const [userCordinates, setUserCordinates] = useState([74.8446, 12.8794]);

  const [isModalVisible, setModalVisible] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]);
  const [masterData, setMasterData] = useState([]);
  const [attendId, setAttendId] = useState('');
  const [clockedIn, setClockedIn] = useState(null);

  const [isFocus, setIsFocus] = useState(false);
  const profile = useRef("");

  const [filterVal, setFilterVal] = useState("");

  const [sortLabelArray, setSortLabelArray] = useState([]);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const getLocation = async () => {
    let locPermissionDenied = await locationPermission();
    if (locPermissionDenied) {
      Geolocation.getCurrentPosition(
        async (res) => {
          console.log("GET LOCATION CALLED");
          console.log(res);
          //getting user location
          console.log("lattitude", res.coords.latitude);
          console.log("longitude", res.coords.longitude);
          setUserCordinates[(res.coords.latitude, res.coords.longitude)];
        },
        (error) => {
          console.log("get location error", error);
          console.log("please enable location ");
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
          accuracy: {
            android: "high",
            ios: "bestForNavigation",
          },
        }
      );
    } else {
      console.log("location permssion denied");
    }
  };


  const getCurrentTime = () => {
    const currentDate = new Date();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const seconds = currentDate.getSeconds();

    // Formatting to ensure two digits
    const formattedHours = hours < 10 ? '0' + hours : hours;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    const formattedSeconds = seconds < 10 ? '0' + seconds : seconds;

    // Construct the time string
    const currentTime = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;

    return currentTime;
  };

  // Usage
  const currentTime = getCurrentTime();
  console.log("Current time:", currentTime, userCordinates[0]);



  const saveCheckOut = async () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append('Authorization', `Bearer ${userData.token}`);

    var raw = JSON.stringify({
      "user": userData.id,
      "type": "present",
      "location": "",
      "latitude": userCordinates[0],
      "longitude": userCordinates[1],
      "attendance_id": attendId,
      "login_time": "",
      "logged_out": currentTime,
    });
    console.log("rawww", raw)
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch("https://gsidev.ordosolution.com/api/clocked_in/", requestOptions)
      .then(response => response.json())
      .then(async result => {
        console.log("akjscbshmcbzj", result);
        if (result.Status == "200") {
          Alert.alert('Clock out ', `Clocked out successfully`);
          navigation.goBack();
        }

      })
      .catch(error => console.log('clock out api error', error));

  };




  const getProfile = async () => {
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', `Bearer ${userData.token}`);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };

    await fetch(`https://gsidev.ordosolution.com/api/ordo_users/${userData.id}/`, requestOptions)
      .then((response) => response.json())
      .then(async (result) => {
        let imageUrl = result.compare_image;
        // console.log("#######@@@@@@", imageUrl)
        if (imageUrl) {
          try {
            const response = await RNFetchBlob.config({
              fileCache: true
            }).fetch('GET', imageUrl);

            // Convert image data to base64
            const base64Data = await response.base64();

            // Now you have the base64Data, you can use it as needed
            // console.log("Base64 image data:", base64Data);
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
        setLoading(false);
        console.error('Error in get supplier', error);
      });
  }


  useFocusEffect(
    React.useCallback(() => {
      clockIncheck();
      getAttendance();
      getProfile();
      getLocation();

      //fetchAttendaceData();
      //setNodata(false);
      //getting location
      //getLocation();
      FaceSDK.init(
        (json) => {
          response = JSON.parse(json);
          // console.log(response);
          if (!response["success"]) {
            console.log("Init failed: ");
            // console.log(json);
          }
        },
        (e) => { }
      );
    }, [])
  );


  const clockIncheck = () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append('Authorization', `Bearer ${userData.token}`);

    var raw = JSON.stringify({
      "__user_id__": token,
      "__type__": "clockin"
    });

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      // body: raw,
      redirect: 'follow'
    };

    fetch(`https://gsidev.ordosolution.com/api/get_clockin/${userData.id}/`, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log("res*********r", result, result.data.id)
        const attendanceid = result.data.id;
        setAttendId(attendanceid)
        if (result.Status == 200) {
          setClockedIn(false);
          getProfile();

        } else if (result.Status == 201) {
          setClockedIn(true);
          console.log("*******************")
        }
      })
      .catch(error => console.log('error', error));
  }

  console.log("hgmj", attendId)

  function convertUTCDateToLocalDate(date) {
    var newDate = new Date(
      date.getTime() + date.getTimezoneOffset() * 60 * 1000
    );

    var offset = date.getTimezoneOffset() / 60;
    var hours = date.getHours();

    newDate.setHours(hours - offset);

    return newDate;
  }

  //to return unqiue user label
  const getUniqueLabels = (attendanceArray) => {
    const uniqueLabels = [];
    attendanceArray.forEach((entry) => {
      if (!uniqueLabels.includes(entry.name)) {
        uniqueLabels.push(entry.name);
      }
    });

    return uniqueLabels;
  };
  console.log("userData", userData)


  const getAttendance = async () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append('Authorization', `Bearer ${userData.token}`);

    const raw = "";

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      // body: raw,
      redirect: "follow"
    };

    fetch(`https://gsidev.ordosolution.com/api/user_attendance?user=${userData?.id}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        // console.log("udhs",result)
        setAttendanceData(result)
      })
      .catch((error) => console.error(error));
  };

  // console.log("FSGgvsagasf", attendanceData);

  //user face recognisation
  const faceRecognise = async () => {
    console.log("inside");
    FaceSDK.presentFaceCaptureActivity(
      (result) => {
        let res = JSON.parse(result);
        //checking user cancle image picker
        if (res.exception) {
          console.log("User Canceled Face capture option");
          return;
        }
        //console.log("image uri", FaceCaptureResponse.fromJson(JSON.parse(result)).image.bitmap);
        let base64Img = FaceCaptureResponse.fromJson(JSON.parse(result)).image
          .bitmap;
        const firstImage = new MatchFacesImage();
        firstImage.imageType = Enum.ImageType.PRINTED; //captured image
        firstImage.bitmap = profile.current;
        const secondImage = new MatchFacesImage();
        secondImage.imageType = Enum.ImageType.LIVE; //live image
        secondImage.bitmap = base64Img;
        request = new MatchFacesRequest();
        request.images = [firstImage, secondImage];
        // console.log("start compare", profile);
        //comparing two images
        FaceSDK.matchFaces(
          JSON.stringify(request),
          (response) => {
            response = MatchFacesResponse.fromJson(JSON.parse(response));
            // console.log("ggg", response);
            FaceSDK.matchFacesSimilarityThresholdSplit(
              JSON.stringify(response.results),
              0.75,
              (str) => {
                var split = MatchFacesSimilarityThresholdSplit.fromJson(
                  JSON.parse(str)
                );
                // console.log("res", split.length);
                if (split?.matchedFaces.length > 0) {
                  //face matched
                  let faceMatchPercentage =
                    split.matchedFaces[0].similarity * 100;
                  console.log(
                    "match percentage",
                    faceMatchPercentage.toFixed(2)
                  );
                  saveCheckOut();
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

  const renderItem = ({ item, index }) => {

    return (
      <View style={styles.attendanceView}>
        <View style={styles.dateViewContainer}>
          {/* Format date using moment.js */}
          <Text style={styles.month}>{moment(item.date).format("MMM")}</Text>
          <Text style={styles.dateValStyle}>
            {moment(item.date).format("DD")}
          </Text>
        </View>
        <View style={styles.infoViewContainer}>
          <Text style={styles.weekNameTextStyle}>
            {/* Format login and logout times using moment.js */}
            {moment(item.login_time).format("ddd yy, hh:mm a")} to{" "}
            {moment(item.logout_time).format("hh:mm a")}
          </Text>
          <Text style={styles.place}>
            {item.location}
          </Text>
          <Text style={styles.name}>{item.user_name}</Text>
        </View>
      </View>
    );
  };



  const filterData = () => {
    setModalVisible(false);
    setData(masterData.filter((entry) => entry.name == filterVal));
  };






  return (
    <View style={styles.container}>
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
          flex: 1,
        }}
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

          }}
        >
          <View style={{ ...styles.headercontainer }}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ marginLeft: 5 }}
            >
              <Image
                source={require("../../assets/images/Refund_back.png")}
                style={{ height: 30, width: 30 }}
              />
            </TouchableOpacity>
            <Text style={{ color: 'white', fontSize: 18, fontFamily: "AvenirNextCyr-Bold", textAlign: 'center', marginLeft: '29%' }}>Attendance</Text>
          </View>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => {
              toggleModal();
            }}
          >
            {/* <Icon name="filter" size={25} color="white" /> */}
            <Text
              style={{
                fontSize: 13,
                color: Colors.white,
                marginRight: '8%',
                fontWeight: '400'
              }}
            >

            </Text>
          </TouchableOpacity>

        </View>

        <View
          style={{
            flex: 1,
            backgroundColor: "white",
            borderTopLeftRadius: 35,
            borderTopRightRadius: 35,
            width: '100%'
          }}
        >
          {/* {!salesManager && ( */}
          <View style={styles.clockInContainer}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.headerTitle}>Let's get to work</Text>
              <Image
                source={{
                  uri: "https://cdn.shopify.com/s/files/1/1061/1924/products/Writing_Hand_Emoji_Icon_ios10_grande.png?v=1571606092",
                }}
                style={{ height: 20, width: 20, marginLeft: 5 }}
              />
            </View>
            <TouchableOpacity
              style={{
                ...styles.buttonStyle,
                backgroundColor: attendanceMarked ? "grey" : Colors.primary,
              }}
              onPress={faceRecognise}
              disabled={attendanceMarked}
            >
              <Text style={styles.buttonTextStyle}>Clock Out</Text>
            </TouchableOpacity>
          </View>
          {/* )} */}

          <Text style={styles.title}>Attendance History</Text>
          <FlatList
            data={attendanceData}
            renderItem={({ item }) => (
              <View style={styles.attendanceView}>
                <View style={styles.dateViewContainer}>
                  {/* Format date using moment.js */}
                  <Text style={styles.month}>{moment(item.date).format("MMM")}</Text>
                  <Text style={styles.dateValStyle}>
                    {moment(item.date).format("DD")}
                  </Text>
                </View>
                <View style={styles.infoViewContainer}>
                  <Text style={styles.weekNameTextStyle}>
                    {/* Format login and logout times using moment.js */}
                    {moment(item.login_time, "HH:mm:ss").format("hh:mm a")} to{" "}
                    {item.logout_time ? moment(item.logout_time, "HH:mm:ss").format("hh:mm a") : "present"}
                  </Text>
                  <Text style={styles.place}>
                    {item.location}
                  </Text>
                  <Text style={styles.name}>{item.user_name}</Text>
                </View>
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
          />
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
              <View style={styles.container1}>
                <Text style={styles.ModalText1}>Select User</Text>

                {/* {renderLabel()} */}
                <Dropdown
                  style={[
                    styles.dropdown,
                    isFocus && { borderColor: Colors.primary },
                  ]}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  itemTextStyle={styles.selectedTextStyle}
                  iconStyle={styles.iconStyle}
                  data={sortLabelArray.map((item) => ({
                    label: item,
                    value: item,
                    attendanceData: 1,
                  }))}
                  search
                  maxHeight={400}
                  labelField="label"
                  valueField="value"
                  placeholder={!isFocus ? "Select item" : "..."}
                  searchPlaceholder="Search..."
                  value={filterVal}
                  onFocus={() => setIsFocus(true)}
                  onBlur={() => setIsFocus(false)}
                  onChange={(item) => {
                    // setCategoryData(item.value)
                    setIsFocus(false);
                    setFilterVal(item.value);
                  }}
                />
              </View>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={filterData}
              >
                <Text style={styles.submitButtonText}>Apply Filter</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default Attendance;
