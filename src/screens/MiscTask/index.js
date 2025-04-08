import {
  Alert,
  Text,
  View,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  FlatList,
  BackHandler,
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
import { TextInput as TextInput1, Button as Button1 } from "react-native-paper";
import { hs, vs, ms } from "../../utils/Metrics";
import LinearGradient from "react-native-linear-gradient";
import { AnimatedFAB } from "react-native-paper";

const MiscTask = ({ navigation, extended, label, animateFrom, visible }) => {
  const { token, dealerData, tourPlanId, userData, checkInDocId } = useContext(AuthContext);
  const [data, setData] = useState(false);
  const [noData, setNoData] = useState(false);
  const [isExtended, setIsExtended] = useState(true);

  const [selectedTask, setSelectedTask] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  console.log("toue plan id", tourPlanId, dealerData?.id, token);

  const onScroll = ({ nativeEvent }) => {
    const currentScrollPosition =
      Math.floor(nativeEvent?.contentOffset?.y) ?? 0;

    setIsExtended(currentScrollPosition <= 0);
  };

  const getData = () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${userData.token}`);

    var raw = "";

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(
      `https://gsidev.ordosolution.com/api/miscellaneous-task/?user=${userData.id}&account_id=${dealerData.account_id}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log("Misc details", result);
        setData(result);
      })
      .catch((error) => console.log("get misk task api error", error));
  };

  useFocusEffect(
    React.useCallback(() => {
      getData();
    }, [])
  );

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => {
          setSelectedTask(item);
          setModalVisible(true);
        }}
        activeOpacity={0.5}
      >
        <View style={styles.orderDataContainer}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              // marginRight: "3%",
              flex: 0.25,
            }}
          >
            <View
              style={{
                height: 70,
                width: 75,
                backgroundColor: "#F0EFF4",
                borderRadius: 10,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                source={require("../../assets/images/MiscTask.png")}
                style={{ height: 30, width: 30 }}
              />
            </View>
          </View>

          <View
            style={{
              flexDirection: "column",
              // alignItems: "center",
              marginTop: "1%",
              flex: 0.7,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontFamily: "AvenirNextCyr-Medium",
                color: "black",
                // textAlign: "left",
              }}
            >
              {item?.name}
            </Text>

            <Text
              style={{
                fontSize: 15,
                fontFamily: "AvenirNextCyr-Medium",
                color: "gray",
                flexWrap: "wrap",

                // textAlign: "left",
              }}
              numberOfLines={2}
            >
              {item?.purpose_of_visit}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  //no data found
  const noDataFound = () => {
    // return (
    //     <View style={styles.noReport}>
    //         <Text style={styles.noReportText}>No data found</Text>
    //     </View>
    // )
  };

  //Add misc Task values
  //miscellaneous task hooks value
  const [mtask, setMTask] = useState("");
  const [name, setName] = useState("");
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

  const clearModalValue = () => {
    setMTask("");
    setName("");
    setMRemarks("");
    setBase64img("");
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
          setBase64img(`data:${type};base64,${res}`);
        });
      })
      .catch((err) => {
        console.log(" img resize error", err);
      });
  };

  //Miscellaneous task
  const saveMiscellaneous = () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${userData.token}`);

    var raw = JSON.stringify({
      name: name,
      user: userData.id,
      purpose_of_visit: mtask,
      image: base64img,
      remarks: mRemarks,
      account: dealerData?.account_id,
      tour_plan: null,
      sales_checkin: checkInDocId,
    });

    console.log("rawwwww", raw);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch("https://gsidev.ordosolution.com/api/miscellaneous-task/", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log("resulttt222t", result);
        getData();
        setModalVisible2(false);
        clearModalValue();
      })
      .catch((error) => {
        console.log("misc task api erro", error);
      });
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={Colors.linearColors}
        start={Colors.start}
        end={Colors.end}
        locations={Colors.location}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={require("../../assets/images/Refund_back.png")}
              style={{ height: 30, width: 30 }}
            />
          </TouchableOpacity>
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text
              style={{
                fontSize: 20,
                color: "white",
                fontFamily: "AvenirNextCyr-Bold",
              }}
            >
              Misc. Task
            </Text>
          </View>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => {
              toggleModal();
            }}
          >
            <Text
              style={{
                fontSize: 10,
                color: "white",
                fontFamily: "AvenirNextCyr-Medium",
                marginLeft: 5,
              }}
            >
              {" "}
            </Text>
          </TouchableOpacity>
        </View>
        {noData && noDataFound()}
        <View
          style={{
            flex: 1,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            backgroundColor: "#F5F5F5",
          }}
        >
          <FlatList
            data={data}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
          />
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(false);
            setSelectedTask(null);
          }}
        >
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
              <Text
                style={[
                  styles.text2,
                  { textAlign: "center", marginVertical: "5%" },
                ]}
              >
                Misc. Task Details
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  // justifyContent: "space-between",
                  borderBottomColor: "#D9D9D9",
                  borderBottomWidth: 1,
                  paddingBottom: "5%",
                }}
              >
                <Text style={{ ...styles.text, flex: 0.3 }}>Name :</Text>

                <Text style={{ ...styles.text, flex: 0.7 }}>
                  {" "}
                  {selectedTask?.name}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  borderBottomColor: "#D9D9D9",
                  borderBottomWidth: 1,
                  paddingVertical: "5%",
                }}
              >
                <Text style={{ ...styles.text, flex: 0.3 }}>
                  Purpose Of Visit :
                </Text>

                <Text style={{ ...styles.text, flex: 0.7 }}>
                  {" "}
                  {selectedTask?.purpose_of_visit}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  borderBottomColor: "#D9D9D9",
                  borderBottomWidth: 1,
                  paddingVertical: "5%",
                }}
              >
                <Text style={{ ...styles.text, flex: 0.3 }}>Remarks :</Text>

                <Text style={{ ...styles.text, flex: 0.7 }}>
                  {" "}
                  {selectedTask?.remarks}
                </Text>
              </View>

              <Image
                source={{ uri: selectedTask?.image }}
                style={styles.imgStyle}
              />

              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  setSelectedTask(null);
                }}
                style={[styles.closeButton, styles.circleButton]}
              >
                <AntDesign name="close" size={20} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal
          visible={isModalVisible2}
          animationType="fade"
          transparent={true}
        >
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
                  <TextInput1
                    mode="outlined"
                    label="Name"
                    theme={{ colors: { onSurfaceVariant: "black" } }}
                    activeOutlineColor="#4b0482"
                    // placeholder="Enter User Name"
                    outlineColor="#B6B4B4"
                    textColor="black"
                    onChangeText={(text) => setName(text)}
                    autoCapitalize="none"
                    blurOnSubmit={false}
                    value={name}
                    // keyboardType="number-pad"
                    returnKeyType="done"
                    outlineStyle={{ borderRadius: ms(10) }}
                    style={{
                      marginBottom: "2%",
                      height: 50,
                      backgroundColor: "white",
                    }}
                  />
                </View>
              </View>
              <View style={{ flexDirection: "row" }}>
                <View style={{ flex: 1 }}>
                  <TextInput1
                    mode="outlined"
                    label="Type of Task"
                    theme={{ colors: { onSurfaceVariant: "black" } }}
                    activeOutlineColor="#4b0482"
                    // placeholder="Enter User Name"
                    outlineColor="#B6B4B4"
                    textColor="black"
                    onChangeText={(text) => setMTask(text)}
                    autoCapitalize="none"
                    blurOnSubmit={false}
                    value={mtask}
                    // keyboardType="number-pad"
                    returnKeyType="done"
                    outlineStyle={{ borderRadius: ms(10) }}
                    style={{
                      marginBottom: "2%",
                      height: 50,
                      backgroundColor: "white",
                    }}
                  />
                </View>
              </View>
              <View>
                <Text
                  style={{
                    ...styles.modalTitle,
                    color: Colors.primary,
                    marginTop: "3%",
                  }}
                >
                  Upload Image
                </Text>
                <View
                  style={{
                    ...styles.buttonview,
                    alignItems: "center",
                    marginTop: "2%",
                  }}
                >
                  <LinearGradient
                    colors={Colors.linearColors}
                    start={Colors.start}
                    end={Colors.end}
                    locations={Colors.ButtonsLocation}
                    style={{ borderRadius: 8 }}
                  >
                    <TouchableOpacity
                      style={{ ...styles.photosContainer, paddingTop: 8 }}
                      onPress={checkPermission}
                    >
                      <AntDesign name="camera" size={25} color={Colors.white} />
                    </TouchableOpacity>
                  </LinearGradient>

                  <LinearGradient
                    colors={Colors.linearColors}
                    start={Colors.start}
                    end={Colors.end}
                    locations={Colors.ButtonsLocation}
                    style={{ borderRadius: 8, marginHorizontal: "5%" }}
                  >
                    <TouchableOpacity
                      style={styles.photosContainer}
                      onPress={handleGallery}
                    >
                      <Text style={styles.buttonText}>Gallery</Text>
                    </TouchableOpacity>
                  </LinearGradient>
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

              <TextInput1
                mode="outlined"
                label="Remarks"
                theme={{ colors: { onSurfaceVariant: "black" } }}
                activeOutlineColor="#4b0482"
                outlineColor="#B6B4B4"
                textColor="black"
                onChangeText={(text) => setMRemarks(text)}
                autoCapitalize="none"
                blurOnSubmit={false}
                value={mRemarks}
                returnKeyType="done"
                outlineStyle={{ borderRadius: ms(10) }}
                style={{
                  marginBottom: "2%",
                  height: 50,
                  backgroundColor: "white",
                }}
              />

              <View style={styles.buttonview}>
                <LinearGradient
                  colors={Colors.linearColors}
                  start={Colors.start}
                  end={Colors.end}
                  locations={Colors.ButtonsLocation}
                  style={{ borderRadius: 10, flex: 1 }}
                >
                  <TouchableOpacity
                    style={styles.buttonContainer}
                    onPress={saveMiscellaneous}
                  >
                    <Text style={styles.buttonText}>Submit</Text>
                  </TouchableOpacity>
                </LinearGradient>
              </View>
            </View>
          </View>
        </Modal>
        <AnimatedFAB
          label={"Misc. Task "}
          color={"white"}
          style={styles.fabStyle}
          fontFamily={"AvenirNextCyr-Medium"}
          extended={isExtended}
          visible={visible}
          animateFrom={"right"}
          iconMode={"static"}
          onPress={() => {
            setModalVisible2(true);
          }}
        />
      </LinearGradient>
    </View>
  );
};

export default MiscTask;
