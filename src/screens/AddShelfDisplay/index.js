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
import React, { useCallback, useContext, useEffect, useState } from "react";
import styles from "./style";
import AntDesign from "react-native-vector-icons/AntDesign";
import Colors from "../../constants/Colors";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { cameraPermission } from "../../utils/Helper";
import ImageResizer from "@bam.tech/react-native-image-resizer";
import { AuthContext } from "../../Context/AuthContext";

import { ProgressDialog } from "react-native-simple-dialogs";
import { Dropdown } from "react-native-element-dropdown";
import RNFS from "react-native-fs";
import moment from "moment";
import LinearGradient from "react-native-linear-gradient";
import { TextInput as TextInput1, Button as Button1 } from "react-native-paper";
import { hs, vs, ms } from "../../utils/Metrics";
import ShelfDisplayDetails from "../ShelfDisplayDetails";

const AddShelfDisplay = ({ navigation, route }) => {
  const { token, dealerData, userData, tourPlanId } = useContext(AuthContext);
  //drop down hooks
  const [categoryOption, setCategoryOption] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  console.log("tourplan",tourPlanId)

  const BrandDropdown = async (id) => {
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
        "https://gsidev.ordosolution.com/api/brand-and-category-list/",
        requestOptions
      );
      const result = await response.json();

      const brands = result.brands.map((brand) => {
        return {
          label: brand.name,
          value: brand.name,
        };
      });
      setSelectedBrand(brands);

      const category = result.product_categories.map((category) => {
        return {
          label: category.name,
          value: category.name,
        };
      });
      setCategoryOption(category);
    } catch (error) {
      console.log("error", error);
    }
  };


  useEffect(() => {
    BrandDropdown();
  }, []);

  const [isFocus1, setIsFocus1] = useState(false);

  const optionData = [
    { label: "Cash", value: "Cash" },
    { label: "Cheque", value: "Cheque" },
    {
      label: "Wire Transfer/ Bank Transfer",
      value: "Wire Transfer/ Bank Transfer",
    },
  ];
  const [shelfId, setShelfId] = useState("");
  const [base64img, setBase64img] = useState("");
  const [remarks, setRemarks] = useState("");

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

  const addShelfDisplay = (item) => {
    if (base64img) {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${userData.token}`);

      var raw = JSON.stringify({
        shelf_id: shelfId,
        category: selectedCategory,
        remarks: remarks,
        shelf_image: base64img,
        user: userData.id,
        account_id: dealerData.account_id,
        plan: tourPlanId,
      });

      console.log("rawwwww", raw);

      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      fetch("https://gsidev.ordosolution.com/api/shelf-display/", requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log("resultttt", result);
          if (response?.success == true) {
            Alert.alert("Shelf Display", "Data saved successfully", [
              { text: "OK", onPress: () => navigation.goBack() },
            ]);
          }
        })
        .catch((error) => {
          console.log("shelf display  api error", error);
        });
    } else {
      alert("Please fill all the details");
    }
  };

  console.log("base 64",base64img)

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
          <Text style={styles.headerTitle}>Add Shelf Display</Text>
        </View>
        <View style={{ paddingHorizontal: 16, flex: 1 }}>
          <View style={styles.dropDownContainer}>
            <Dropdown
              style={[styles.dropdown, isFocus1 && { borderColor: "blue" }]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              itemTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={categoryOption}
              maxHeight={400}
              labelField="label"
              valueField="value"
              placeholder={!isFocus1 ? "Category" : "..."}
              value={selectedCategory}
              onFocus={() => setIsFocus1(true)}
              onBlur={() => setIsFocus1(false)}
              onChange={(item) => {
                setSelectedCategory(item.value);
                setIsFocus1(false);
              }}
            />
          </View>
          <View>
            <TextInput1
              mode="outlined"
              label="Shelf ID"
              theme={{ colors: { onSurfaceVariant: "black" } }}
              activeOutlineColor="#4b0482"
              outlineColor="#B6B4B4"
              textColor="black"
              onChangeText={(text) => setShelfId(text)}
              autoCapitalize="none"
              blurOnSubmit={false}
              value={shelfId}
              returnKeyType="done"
              outlineStyle={{ borderRadius: ms(10) }}
              style={{
                marginBottom: "2%",
                height: 50,
                backgroundColor: "white",
              }}
            />
          </View>
          <View>
            <Text style={styles.modalTitle}>Shelf Image</Text>
            <View style={styles.buttonview}>
              <LinearGradient
                colors={Colors.linearColors}
                start={Colors.start}
                end={Colors.end}
                locations={Colors.location}
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
                locations={Colors.location}
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
              style={{ flexDirection: "row", alignItems: "flex-end", gap: 15 }}
            >
              {base64img && (
                <Image source={{ uri: base64img }} style={styles.imgStyle} />
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
            onChangeText={(text) => setRemarks(text)}
            autoCapitalize="none"
            blurOnSubmit={false}
            value={remarks}
            returnKeyType="done"
            outlineStyle={{ borderRadius: ms(10) }}
            style={{ marginBottom: "2%", height: 50, backgroundColor: "white" }}
          />
        </View>
        <View style={{ justifyContent: "flex-end", padding: 16 }}>
          <View style={styles.buttonview}>
            <LinearGradient
              colors={Colors.linearColors}
              start={Colors.start}
              end={Colors.end}
              locations={Colors.location}
              style={{ borderRadius: 10, flex: 1 }}
            >
              <TouchableOpacity
                style={styles.buttonContainer}
                onPress={addShelfDisplay}
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

export default AddShelfDisplay;
