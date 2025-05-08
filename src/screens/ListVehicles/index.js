import {
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Keyboard,
  TextInput,
  Modal,
  Pressable,
  Alert,
  Button,
} from "react-native";
import React, { useState, useEffect, useContext, useRef } from "react";
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import Colors from "../../constants/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../../Context/AuthContext";
import { TabRouter, useFocusEffect } from "@react-navigation/native";
import ImageResizer from "@bam.tech/react-native-image-resizer";
import Geolocation from "react-native-geolocation-service";
import { locationPermission } from "../../utils/Helper";
import moment from "moment";
import { ProgressDialog } from "react-native-simple-dialogs";
import globalStyles from "../../styles/globalStyles";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { cameraPermission } from "../../utils/Helper";
import RNFS from "react-native-fs";
import Icon from "react-native-vector-icons/FontAwesome";

const ListVehicles = ({ navigation }) => {
  const {
    token,
    userData,
    changeDealerData,
    tourPlanName,
    changeDocId,
    tourPlanId,
  } = useContext(AuthContext);
  const [masterData, setMasterData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const handleImagePress = (id) => {
    //saveProfilePictureToApi(id)
    setSelectedId(id);
    setShowPopup(true);
  };

  console.log("tour plan name", token);

  //active dealer hooks
  const dealerArray = useRef([]);
  const [loading, setLoading] = useState(false);
  const [checkInLoading, setCheckInLoading] = useState(false);
  const [base64img, setBase64img] = useState("");

  //selected customer id
  const [selectedId, setSelectedId] = useState(null);

  const checkPermissionCam = async () => {
    let PermissionDenied = await cameraPermission();
    if (PermissionDenied) {
      console.log("camera permssion granted");
      handleCamera();
    } else {
      console.log("camera permssion denied");
      //requestStoragePermission();
    }
  };

  // console.log("cdhwckch",dealerData)

  const handleCamera = async () => {
    // setModalVisible1(false);
    const res = await launchCamera({
      mediaType: "photo",
    });
    console.log("response", res.assets[0].uri);
    imageResize(res.assets[0].uri, res.assets[0].type);
    // if (base64img) {
    //     await saveProfilePictureToApi(base64img);
    //     console.log("Profile picture saved");
    // }
    setShowPopup(false);
  };
  const handleGallery = async () => {
    // setModalVisible1(false);
    const res = await launchImageLibrary({
      mediaType: "photo",
    });
    console.log("response", res.assets[0].uri);
    imageResize(res.assets[0].uri, res.assets[0].type);
    // if (base64img) {
    //     await saveProfilePictureToApi(base64img);
    //     console.log("Profile picture saved ");
    // }
    setShowPopup(false);
  };

  const imageResize = async (img, type) => {
    setLoading2(true);
    ImageResizer.createResizedImage(img, 300, 300, "JPEG", 50)
      .then(async (res) => {
        console.log("image resize", res);
        RNFS.readFile(res.path, "base64").then((res) => {
          console.log("base64", res);
          //uploadImage(res)
          setBase64img(`data:${type};base64,${res}`);
          saveProfilePictureToApi(`data:${type};base64,${res}`);
        });
      })
      .catch((err) => {
        console.log(" img resize error", err);
      })
      .finally(() => setLoading2(false));
  };

  const saveProfilePictureToApi = async (imgbase64) => {
    const apiUrl = "https://gsidev.ordosolution.com/set_account_details.php";
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const requestData = {
      __img_src_c__: `${Date.now()}.png`,
      __image_base64__: imgbase64,
      __type__: "1",
      __account_id__: selectedId,

      // Add any other necessary data to the request body
    };

    console.log("save image api body", requestData);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(requestData),
      redirect: "follow",
    };

    try {
      const response = await fetch(apiUrl, requestOptions);
      const result = await response.json();
      console.log("Profile picture saved to API:", result);
      //refreshing list
    } catch (error) {
      console.error("Error saving profile picture:", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      // Fetch data here
      listVehicle();
    }, [])
  );

  useEffect(() => {
    listVehicle();
  }, [userData]);

  const listVehicle = async (id) => {
    setLoading(true);
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
        "https://gsidev.ordosolution.com/api/vehicle/",
        requestOptions
      );
      const result = await response.json();
      console.log("ifugif", result);

      // Update state variables
      setMasterData(result);
      setFilteredData(result);
      setLoading(false);

      setLoading(false);
    } catch (error) {
      console.log("error", error);
    }
  };

  const searchProduct = (text) => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource
      // Update FilteredDataSource
      const newData = masterData.filter(function (item) {
        const itemData = item.vehicle_type
          ? item.vehicle_type.toUpperCase()
          : "".toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredData(newData);
      setSearch(text);
    } else {
      // Inserted text is blank
      // Update FilteredDataSource with masterDataSource
      setFilteredData(masterData);
      setSearch(text);
    }
  };

  return (
    <View style={styles.container}>
      {/* manaul check in request loader  */}

      <View style={styles.headercontainer}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <AntDesign name="arrowleft" size={25} color={Colors.black} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Vehicles</Text>
        </View>

        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: Colors.primary,
            borderRadius: 10,
            paddingVertical: "2%",
            paddingHorizontal: "4%",
            gap: 10,
          }}
          onPress={() => {
            navigation.navigate("AddVehicle");
          }}
        >
          <MaterialCommunityIcons
            name="truck-plus-outline"
            size={25}
            color="white"
          />

          <Text style={{ fontFamily: "AvenirNextCyr-Medium", color: "white" }}>
            ADD
          </Text>
        </TouchableOpacity>
      </View>

      <ActivityIndicator
        animating={loading}
        color={Colors.primary}
        size="large"
        style={styles.activityIndicator}
      />
      <View style={{ flexDirection: "row", marginTop: "5%" }}>
        <View style={styles.modalSearchContainer}>
          <TextInput
            style={styles.input}
            value={search}
            placeholder="Search vehicle"
            placeholderTextColor="gray"
            onChangeText={(val) => searchProduct(val)}
          />
          <TouchableOpacity style={styles.searchButton}>
            <AntDesign name="search1" size={20} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        showsVerticalScrollIndicator={false}
        data={filteredData}
        keyboardShouldPersistTaps="handled"
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
                    fontFamily: "AvenirNextCyr-Medium",
                    borderBottomColor: "grey",
                  }}
                >
                  {item?.registration_no}
                </Text>
                <Text
                  style={{
                    color: "black",
                    fontSize: 12,
                    fontFamily: "AvenirNextCyr-Thin",
                    borderBottomColor: "grey",
                  }}
                >
                  {item?.vehicle_type}
                </Text>
                <Text
                  style={{
                    color: "black",
                    fontSize: 12,
                    fontFamily: "AvenirNextCyr-Thin",
                    borderBottomColor: "grey",
                  }}
                >
                  {item?.make}
                </Text>

              </View>
            </View>
          </TouchableOpacity>
        )}
      />
      <Modal
        animationType="fade"
        transparent={true}
        visible={showPopup}
        onRequestClose={() => setShowPopup(false)}
      >
        <TouchableOpacity
          style={styles.modalContainer}
          activeOpacity={1}
        >
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeIcon}
              onPress={() => setShowPopup(false)}
            >
              <Icon name="times" size={20} color="#000" />
            </TouchableOpacity>
            <View style={styles.modalInnerContent}>
              <View style={styles.container1}>{/* {renderLabel()} */}</View>
              <TouchableOpacity
                onPress={checkPermissionCam}
                style={styles.submitButton}
              >
                <Text style={styles.submitButtonText}>Take Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleGallery}
                style={styles.submitButton}
              >
                <Text style={styles.submitButtonText}>Choose from Gallery</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default ListVehicles;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "white",
  },
  activityIndicator: {
    flex: 1,
    alignSelf: "center",
    height: 100,
    position: "absolute",
    top: "30%",
  },
  headercontainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerTitle: {
    fontSize: 18,
    fontFamily: "AvenirNextCyr-Medium",
    color: Colors.black,
    marginLeft: 10,
    marginTop: 3,
  },
  elementsView: {
    paddingVertical: 20,
    paddingHorizontal: 15,

    backgroundColor: "white",
    borderBottomColor: "grey",
    borderBottomWidth: 1,
    padding: 8,
  },
  imageView: {
    width: 70,
    height: 70,
  },
  elementText: {
    fontSize: 15,
    fontFamily: "AvenirNextCyr-Medium",
    color: "black",
  },
  minusButton: {
    width: 45,
    height: 30,
    borderColor: "grey",
    borderWidth: 0.5,
    borderRadius: 5,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
    marginTop: 30,
    marginLeft: 10,
  },
  modalMinusButton: {
    width: 35,
    height: 20,
    borderColor: "grey",
    borderWidth: 0.5,
    borderRadius: 5,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
    marginTop: 40,
    marginLeft: 10,
  },
  quantityCount: {
    width: 45,
    height: 30,
    borderColor: "grey",
    borderWidth: 0.5,
    borderRadius: 5,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
    marginTop: 30,
    marginLeft: 1,
  },
  modalQuantityCount: {
    width: 35,
    height: 20,
    borderColor: "grey",
    borderWidth: 0.5,
    borderRadius: 5,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
    marginTop: 40,
    marginLeft: 1,
  },
  orderCloseView: {
    height: 15,
    width: 15,
    //marginTop: 30
  },
  imageText: {
    fontSize: 15,
    fontFamily: "AvenirNextCyr-Thin",
    color: "black",
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "lightgray",
    borderRadius: 5,

    //paddingVertical: 5,
    paddingHorizontal: 10,
    marginLeft: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    marginRight: 10,
  },
  searchButton: {
    padding: 5,
  },
  sendButtonView: {
    borderRadius: 5,
    // borderWidth: 1,
    // borderColor: 'grey',
    backgroundColor: "green",
    paddingVertical: 10,
    paddingHorizontal: 20,

    height: 40,
    marginLeft: 10,
  },
  saveButtonView: {
    borderRadius: 5,
    // borderWidth: 1,
    // borderColor: 'grey',
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    height: 40,
    marginLeft: 10,
  },
  deleteButtonView: {
    borderRadius: 5,
    // borderWidth: 1,
    // borderColor: 'grey',
    backgroundColor: "red",
    paddingVertical: 10,
    paddingHorizontal: 20,
    height: 40,
    marginLeft: 10,
  },
  addButtonView: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "grey",
    backgroundColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 20,
    height: 40,
    marginLeft: 10,
    alignSelf: "center",
  },
  modalAddButtonView: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "grey",
    backgroundColor: "white",
    paddingVertical: 5,
    paddingHorizontal: 15,
    height: 35,
    //alignSelf: 'flex-end',
    //marginLeft: 30,
    //marginTop: 60
  },
  buttonText: {
    color: "blue",
    fontFamily: "AvenirNextCyr-Thin",
  },
  sendButton: {
    color: "white",
    fontFamily: "AvenirNextCyr-Thin",
  },
  deleteButton: {
    color: "red",
  },
  saveButton: {
    color: "purple",
  },
  textColor: {
    color: "black",
    fontFamily: "AvenirNextCyr-Thin",
  },
  searchModal: {
    backgroundColor: "white",
    padding: 20,
    width: "90%",
    marginHorizontal: 10,
    borderRadius: 10,
    elevation: 5,
    marginVertical: 100,
  },
  modalSearchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "lightgray",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
    marginRight: 10,
  },
  modalTitle: {
    fontSize: 16,
    color: "black",
    fontFamily: "AvenirNextCyr-Medium",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 8,
    width: "90%", // Adjust the width as needed, for example '90%'
    alignSelf: "center", // Center the modal content horizontally
  },

  closeIcon: {
    position: "absolute",
    top: 0,
    right: 5,
    padding: 10,
  },
  modalInnerContent: {
    marginTop: 8, 
  },
  ModalText1: {
    color: "#000000",
    textAlign: "left",
    fontSize: 15,
    fontFamily: "AvenirNextCyr-Medium",
    marginLeft: 1,
  },
  container1: {
    backgroundColor: "white",
    paddingTop: 5,
    width: "100%",
    alignSelf: "center", 
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
    fontFamily: "AvenirNextCyr-Thin",
  },
  selectedTextStyle: {
    fontSize: 16,
    fontFamily: "AvenirNextCyr-Thin",
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    fontFamily: "AvenirNextCyr-Thin",
  },
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 8,
    marginLeft: 15,
    marginRight: 15,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "AvenirNextCyr-Medium",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "gray",
  },
});
