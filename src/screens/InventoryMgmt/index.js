import {
  Alert,
  Text,
  View,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
  ScrollView,
  FlatList,
} from "react-native";
import styles from "./style";
import React, { useContext, useState, useEffect } from "react";
import AntDesign from "react-native-vector-icons/AntDesign";
import Colors from "../../constants/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { AuthContext } from "../../Context/AuthContext";
import moment from "moment";
import { ProgressDialog } from "react-native-simple-dialogs";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { cameraPermission } from "../../utils/Helper";
import ImageResizer from "@bam.tech/react-native-image-resizer";
import RNFS from "react-native-fs";
import LinearGradient from "react-native-linear-gradient";
import { Screen } from "react-native-screens";

const InventoryMgmt = ({ navigation }) => {
  const { token, dealerData, tourPlanId } = useContext(AuthContext);
  const [data, setData] = useState(false);
  const [noData, setNoData] = useState(false);

  console.log("tour plan id", tourPlanId, dealerData?.id, token);

  const dataaa = [
    // { key: 'Brand', image: require('../../assets/images/Brand.png'), screen: 'BrandInventory' },
    {
      key: "Product",
      image: require("../../assets/images/ProducT.png"),
      screen: "Inventory",
    },
    {
      key: "Space Management",
      image: require("../../assets/images/Space.png"),
      screen: "AddProduct",
    },
    {
      key: "Inventory Aging",
      image: require("../../assets/images/Inventory.png"),
      screen: "InventoryAging",
    },
    {
      key: "Warehouse",
      image: require("../../assets/images/Misc.png"),
      screen: "Warehouse",
    },
  ];

  const getData = () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      __user_id__: token,
      __account_id__: dealerData?.id,
      __tour_plan_id__: tourPlanId,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(
      "https://dev.ordo.primesophic.com/get_miscellaneous.php",
      requestOptions
    )
      .then((response) => response.json())
      .then((res) => {
        console.log("payment history details", res);
        if (
          Array.isArray(res?.miscellaneous_array) &&
          res?.miscellaneous_array.length > 0
        ) {
          setNoData(false);
          setData(res?.miscellaneous_array);
        } else {
          setNoData(true);
        }
      })
      .catch((error) => console.log("api error", error));
  };
  useFocusEffect(
    React.useCallback(() => {
      getData();
    }, [])
  );

  //miscellaneous task hooks value
  const [mtask, setMTask] = useState("");
  const [mRemarks, setMRemarks] = useState("");
  const [isModalVisible2, setModalVisible2] = useState("");
  const [base64img, setBase64img] = useState("");

  const checkPermission = async () => {
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
    // setModalVisible1(false);
    const res = await launchCamera({
      mediaType: "photo",
    });
    console.log("response", res.assets[0].uri);
    imageResize(res.assets[0].uri, res.assets[0].type);
  };
  const handleGallery = async () => {
    // setModalVisible1(false);
    const res = await launchImageLibrary({
      mediaType: "photo",
    });
    console.log("response", res.assets[0].uri);
    imageResize(res.assets[0].uri, res.assets[0].type);
  };

  const imageResize = async (img, type) => {
    ImageResizer.createResizedImage(img, 300, 300, "JPEG", 50)
      .then(async (res) => {
        console.log("image resize", res);
        RNFS.readFile(res.path, "base64").then((res) => {
          //console.log('base64', res);
          //uploadImage(res)
          setBase64img(`data:${type};base64,${res}`);
        });
      })
      .catch((err) => {
        console.log(" img resize error", err);
      });
  };

  //Miscellaneous task
  const saveMiscellaneous = () => {
    if (mtask) {
      setModalVisible2(false);
      console.log("data is valid");
      //console.log("m type of task", mtask)
      //console.log("m remarks", mRemarks)
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "text/plain");

      let raw = {
        __user_id__: token,
        __purpose_of_visit__: mtask,
        __remarks__: mRemarks,
        __account_id_c__: dealerData?.id,
        __tour_plan_id__: tourPlanId,
      };

      if (base64img) {
        raw = {
          ...raw,
          __miscellaneous_image__: base64img,
          __image_name__: `${Date.now()}.png`,
        };
      }

      console.log("body", raw);

      console.log(raw);
      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(raw),
        redirect: "follow",
      };
      fetch(
        "https://dev.ordo.primesophic.com/set_miscellaneous.php",
        requestOptions
      )
        .then((response) => response.json())
        .then((res) => {
          console.log("api res 1234", res);
          getData();
        })
        .catch((error) => console.log("misc task api error", error));
    } else {
      Alert.alert("Warning", "Please fill all the details");
    }
  };

  return (
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
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          style={{ paddingLeft: "5%" }}
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
            color: "white",
            marginRight:'7%'
          }}
        >
          Inventory Management
        </Text>
        <View>
          <Text> </Text>
        </View>
      </View>

      <View
        style={{
          height: "88%",
          backgroundColor: "#f5f5f5",
          width: "100%",
          borderTopEndRadius: 50,
          borderTopStartRadius: 50,
          padding: 25,
        }}
      >
        {dataaa.map((item) => (
          <TouchableOpacity
            activeOpacity={0.6}
            style={styles.recoredbuttonStyle}
            onPress={() => {
              navigation.navigate(item.screen);
            }}
          >
            <Image
              style={{
                marginRight: 10,
                height: 50,
                width: 50,
                resizeMode: "contain",
              }}
              source={item.image}
            />

            <View style={{ padding: 10, flex: 1 }}>
              <Text
                style={{
                  fontFamily: "AvenirNextCyr-Medium",
                  fontSize: 18,
                  color: "#50001D",
                }}
              >
                {item.key}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <Modal visible={isModalVisible2} animationType="fade" transparent={true}>
        {/* Misc Task Modal */}
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
                }}
              >
                <Text style={{ ...styles.modalTitle, color: Colors.primary }}>
                  Misc. Task
                </Text>
                <TouchableOpacity onPress={() => setModalVisible2(false)}>
                  <AntDesign name="close" size={20} color={`black`} />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 10,
                }}
              ></View>
              <View style={{ flexDirection: "row" }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ ...styles.modalTitle, marginBottom: 5 }}>
                    Type of Task
                  </Text>
                  <TextInput
                    style={styles.cNameTextInput}
                    placeholder="Type of Task"
                    onChangeText={(text) => setMTask(text)}
                    keyboardShouldPersistTaps="always"
                  />
                </View>
              </View>
              <View>
                <Text style={styles.modalTitle}>Upload Image</Text>
                <View style={{ ...styles.buttonview, alignItems: "center" }}>
                  <TouchableOpacity
                    style={{ ...styles.photosContainer, paddingTop: 8 }}
                    onPress={checkPermission}
                  >
                    <AntDesign name="camera" size={25} color={Colors.white} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.photosContainer}
                    onPress={handleGallery}
                  >
                    <Text style={styles.buttonText}>Gallery</Text>
                  </TouchableOpacity>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "flex-end",
                    gap: 15,
                  }}
                >
                  {base64img && (
                    <Image
                      source={{ uri: base64img }}
                      style={styles.imgStyle}
                    />
                  )}
                  {base64img && (
                    <TouchableOpacity
                      style={{ marginRight: 10, marginBottom: 5 }}
                      onPress={() => {
                        setBase64img("");
                      }}
                    >
                      <AntDesign name="delete" size={20} color={`black`} />
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              <Text style={styles.modalTitle}>Remarks</Text>
              {/* new */}
              <TextInput
                multiline={true}
                numberOfLines={10}
                placeholder="Enter Text..."
                style={styles.textarea}
                onChangeText={(val) => {
                  setMRemarks(val);
                }}
                value={mRemarks}
                keyboardShouldPersistTaps="always"
              />

              <View style={styles.buttonview}>
                <TouchableOpacity
                  style={styles.buttonContainer}
                  onPress={saveMiscellaneous}
                >
                  <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </LinearGradient>
  );
};

export default InventoryMgmt;
