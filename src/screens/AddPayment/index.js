import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useCallback, useContext, useState } from "react";
import styles from "./style";
import AntDesign from "react-native-vector-icons/AntDesign";
import Colors from "../../constants/Colors";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { cameraPermission } from "../../utils/Helper";
import { AuthContext } from "../../Context/AuthContext";
import ImageResizer from "@bam.tech/react-native-image-resizer";
import { ProgressDialog } from "react-native-simple-dialogs";
import { Dropdown } from "react-native-element-dropdown";
import RNFS from "react-native-fs";
import moment from "moment";
import { BASE_SERVER_URL } from "../../utils/Helper";
import LinearGradient from "react-native-linear-gradient";
import { TextInput as TextInput1, Button as Button1 } from "react-native-paper";
import { hs, vs, ms } from "../../utils/Metrics";

const AddPayment = ({ navigation, route }) => {
  const { token, dealerData, tourPlanId, userData } = useContext(AuthContext);
  console.log("tour plan id", tourPlanId);

  //add payment value hooks
  const [amount, setAmount] = useState("");
  const [modeOfPayment, setModeOfPayment] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const optionData = [
    { label: "Cash", value: "Cash" },
    { label: "Cheque", value: "Cheque" },
    {
      label: "Wire Transfer/ Bank Transfer",
      value: "Wire Transfer/ Bank Transfer",
    },
  ];
  const [transactionId, setTransactionId] = useState("");
  const [base64img, setBase64img] = useState("");

  const checkPermission = async () => {
    let PermissionDenied = await cameraPermission();
    if (PermissionDenied) {
      console.log("camera permssion granted");
      handleCamera();
    } else {
      console.log("camera permssion denied");
    }
  };

  const handleCamera = async () => {
    const res = await launchCamera({
      mediaType: "photo",
    });
    console.log("response", res.assets[0].uri);
    imageResize(res.assets[0].uri, res.assets[0].type);
  };

  const handleGallery = async () => {
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

  const addPayment = () => {
    if (amount && modeOfPayment) {
      if (modeOfPayment == "Wire Transfer/ Bank Transfer" && !transactionId) {
        Alert.alert("Warning", "Please fill trascation id details");
        return;
      }
      //cheque payment
      if (modeOfPayment == "Cheque" && !base64img) {
        Alert.alert("Warning", "Please upload cheque images");
        return;
      } else {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${userData.token}`);

        var raw = {
          user: userData.id,
          amount: amount,
          account: dealerData?.account_id,
          status: "Paid",
          payment_date: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
          transaction_id: transactionId,
          mode_of_payment: modeOfPayment,
          tour_plan: tourPlanId,
        };

        if (base64img) {
          raw["check_image"] = base64img;
        }

        var jsonString = JSON.stringify(raw);
        console.log("rawwwww", jsonString);

        var requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: jsonString,
          redirect: "follow",
        };

        fetch("https://gsidev.ordosolution.com/api//payment/", requestOptions)
          .then((response) => response.json())
          .then((result) => {
            console.log("resultttt", result);
            if (response?.success == true) {
              Alert.alert("Add Payment", "Data saved successfully", [
                { text: "OK", onPress: () => navigation.goBack() },
              ]);
            }
          })
          .catch((error) => {
            console.log("add payment api erro", error);
          });
      }
    } else {
      Alert.alert("Warning", "Please enter all the details");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <View style={{ ...styles.headercontainer }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ marginLeft: 5 }}
          >
            <AntDesign name="arrowleft" size={25} color={Colors.black} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Payment</Text>
        </View>
        <View style={{ paddingHorizontal: 16, flex: 1 }}>
          <TextInput1
            mode="outlined"
            label="Amount (AED)"
            theme={{ colors: { onSurfaceVariant: "black" } }}
            activeOutlineColor="#4b0482"
            outlineColor="#B6B4B4"
            textColor="black"
            onChangeText={(text) => setAmount(text)}
            autoCapitalize="none"
            blurOnSubmit={false}
            value={amount}
            returnKeyType="done"
            outlineStyle={{ borderRadius: ms(10) }}
            style={{ marginBottom: "2%", height: 50, backgroundColor: "white" }}
          />

          <View style={styles.dropDownContainer}>
            <Dropdown
              style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              itemTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={optionData}
              maxHeight={400}
              labelField="label"
              valueField="value"
              placeholder={!isFocus ? "Mode Of Payment" : "..."}
              value={modeOfPayment}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={(item) => {
                setModeOfPayment(item.value);
                setIsFocus(false);
              }}
            />
          </View>
          {modeOfPayment == "Wire Transfer/ Bank Transfer" && (
            <View>
              <TextInput1
                value={transactionId}
                onChangeText={(text) => setTransactionId(text)}
                mode="outlined"
                label="Transaction Id"
                theme={{ colors: { onSurfaceVariant: "black" } }}
                activeOutlineColor="#4b0482"
                outlineColor="#B6B4B4"
                textColor="black"
                autoCapitalize="none"
                blurOnSubmit={false}
                returnKeyType="done"
                outlineStyle={{ borderRadius: ms(10) }}
                style={{
                  marginBottom: "2%",
                  height: 50,
                  backgroundColor: "white",
                }}
              />
            </View>
          )}
          {modeOfPayment == "Cash" && (
            <View>
              <TextInput1
                value={transactionId}
                onChangeText={(text) => setTransactionId(text)}
                mode="outlined"
                label="Receipt Number"
                theme={{ colors: { onSurfaceVariant: "black" } }}
                activeOutlineColor="#4b0482"
                outlineColor="#B6B4B4"
                textColor="black"
                autoCapitalize="none"
                blurOnSubmit={false}
                returnKeyType="done"
                outlineStyle={{ borderRadius: ms(10) }}
                style={{
                  marginBottom: "2%",
                  height: 50,
                  backgroundColor: "white",
                }}
              />
            </View>
          )}
          {modeOfPayment == "Cheque" && (
            <View>
              <Text style={styles.modalTitle}>Upload Cheque Image</Text>
              <View style={styles.buttonview}>
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
                {base64img && modeOfPayment == "Cheque" && (
                  <Image source={{ uri: base64img }} style={styles.imgStyle} />
                )}
                {base64img && modeOfPayment == "Cheque" && (
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
          )}
        </View>
        <View style={{ justifyContent: "flex-end", padding: 16 }}>
          <View style={styles.buttonview}>
            <LinearGradient
              colors={Colors.linearColors}
              start={{ x: 1, y: 1 }}
              end={Colors.end}
              locations={Colors.location}
              style={{ borderRadius: 8, flex: 1 }}
            >
              <TouchableOpacity
                style={styles.buttonContainer}
                onPress={addPayment}
              >
                <Text style={styles.buttonText}>Add</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default AddPayment;
