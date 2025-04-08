import React, { useState, useContext, useEffect } from "react";

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  Modal,
  Alert
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import AntDesign from "react-native-vector-icons/AntDesign";
import { AnimatedFAB } from "react-native-paper";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { AuthContext } from "../../Context/AuthContext";
import firestore from "@react-native-firebase/firestore";
import RBSheet from "react-native-raw-bottom-sheet";
import RadioButton from "react-native-radio-button";
import { useFocusEffect } from "@react-navigation/native";
import Colors from "../../constants/Colors";
import globalStyles from "../../styles/globalStyles";
import LinearGradient from "react-native-linear-gradient";
import { Dropdown } from "react-native-element-dropdown";
import { TextInput as TextInput1, Button as Button1 } from "react-native-paper";
import { hs, vs, ms } from "../../utils/Metrics";
import { cameraPermission } from "../../utils/Helper";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import ImageResizer from "@bam.tech/react-native-image-resizer";
import RNFS from "react-native-fs";



const ListShelfDisplay = ({
  navigation,
  extended,
  label,
  animateFrom,
  visible,
}) => {
  const { token, dealerData, userData, tourPlanId, checkInDocId } = useContext(AuthContext);
  const refRBSheet = React.useRef();
  const [priceLowtoHigh, setPriceLowtoHigh] = useState(false);
  const [priceHightoLow, setPriceHightoLow] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [isExtended, setIsExtended] = useState(true);
  const [isModalVisible2, setModalVisible2] = useState("");
  const [selectedItemId, setSelectedItemId] = useState("");

  const [categoryOption, setCategoryOption] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [addModalVisible, setAddModalVisible] = useState(false);

  const onScroll = ({ nativeEvent }) => {
    const currentScrollPosition =
      Math.floor(nativeEvent?.contentOffset?.y) ?? 0;
    setIsExtended(currentScrollPosition <= 0);
  };

  useFocusEffect(
    React.useCallback(() => {
      loadShelfDetail();
      BrandDropdown();
    }, [])
  );

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
        plan: null,
        sales_checkin: checkInDocId,

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

  const loadShelfDetail = () => {
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
      `https://gsidev.ordosolution.com/api/shelf-display/?user=${userData.id}&account_id=${dealerData.account_id}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log("shelf details", result);
        setFilteredData(result);
      })
      .catch((error) => console.log("get tour plan error", error));
  };

  const openModal = (itemId) => {
    setSelectedItemId(itemId);
    setModalVisible2(true);
  };

  const renderItem = ({ item, index }) => {
    return (
      <View style={{ flex: 1 }}>
        <TouchableOpacity
          style={{ ...styles.card }}
          activeOpacity={0.8}
          onPress={() => openModal(item)}
        >
          <View
            style={{
              alignItems: "center",
              flex: 1,
            }}
          >
            <Image
              source={{ uri: item.shelf_image }}
              style={{
                resizeMode: "contain",
                height: 100,
                width: 150,
                borderRadius: 8,
              }}
            />
          </View>

          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View>
              <Text
                numberOfLines={1}
                style={{
                  fontSize: 14,
                  color: "black",
                  fontWeight: "500",
                  fontFamily: "AvenirNextCyr-Medium",
                  flexDirection: "row",
                  textAlign: "left",
                  paddingLeft: 8,
                  marginTop: 3,
                }}
              >
                {item.category}
              </Text>
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: "500",
                  color: "gray",
                  fontFamily: "Poppins-Italic",
                  flexDirection: "row",
                  textAlign: "left",
                  paddingLeft: 8,
                  marginTop: 1,
                }}
                numberOfLines={1}
              >
                {item.remarks}
              </Text>
            </View>
            <TouchableOpacity
              style={{
                backgroundColor: "#D3B2CF",
                justifyContent: "flex-end",
                borderRadius: 50,
                marginTop: "10%",
                padding: 5,
              }}
              onPress={() => openModal(item)}
            >
              <AntDesign name="right" size={15} color={`white`} />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const deleteImage = (index) => {
    // Create a copy of the base64img array
    const updatedImages = [...base64img];
    // Remove the image at the specified index
    updatedImages.splice(index, 1);
    // Update the state with the new array
    setBase64img(updatedImages);
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
              Shelf Display
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
        <View
          style={{
            flex: 1,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            backgroundColor: "#F5F5F5",
          }}
        >
          <FlatList
            showsVerticalScrollIndicator={false}
            numColumns={2}
            data={filteredData}
            renderItem={renderItem}
          />

          <RBSheet
            ref={refRBSheet}
            closeOnDragDown={true}
            closeOnPressMask={true}
            customStyles={{
              wrapper: {
                backgroundColor: "transparent",
              },
              draggableIcon: {
                backgroundColor: "#000",
              },
            }}
            height={200}
          >
            <View style={styles.sortContainer}>
              <Text style={styles.sortText}>Sort By</Text>

              <View style={styles.sortRadioButtonContainer}>
                <RadioButton
                  animation={"bounceIn"}
                  isSelected={priceLowtoHigh}
                  onPress={() => {
                    setPriceLowtoHigh(true);
                    setPriceHightoLow(false);
                    refRBSheet.current.close();
                  }}
                  size={10}
                />
                <Text style={styles.radiobuttonText}>Price -- Low to High</Text>
              </View>

              <View style={styles.sortRadioButtonContainer}>
                <RadioButton
                  animation={"bounceIn"}
                  isSelected={priceHightoLow}
                  size={10}
                  onPress={() => {
                    setPriceHightoLow(true);
                    setPriceLowtoHigh(false);
                    refRBSheet.current.close();
                  }}
                />
                <Text style={styles.radiobuttonText}>Price -- High to Low</Text>
              </View>
            </View>
          </RBSheet>
        </View>

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
                padding: 15,
                width: "80%",
                marginHorizontal: 10,
                borderRadius: 10,
                elevation: 5,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  marginBottom: 5,
                  backgroundColor: "#D3B2CF",
                  width: "12%",
                  alignContent: "flex-end",
                  borderRadius: 50,
                  position: "absolute",
                  zIndex: 1,
                  right: 10,
                  top: 5,
                  borderWidth: 8,
                  borderColor: "white",
                }}
              >
                <TouchableOpacity onPress={() => setModalVisible2(false)}>
                  <AntDesign name="close" size={20} color={`white`} />
                </TouchableOpacity>
              </View>
              <View key={selectedItemId.id} style={{ flexDirection: "column" }}>
                <View
                  style={{
                    alignItems: "center",
                  }}
                >
                  <Image
                    source={{ uri: selectedItemId.shelf_image }}
                    style={{
                      resizeMode: "contain",
                      height: 180,
                      width: 290,
                      borderRadius: 8,
                    }}
                  />
                </View>
                <View
                  style={{
                    marginTop: 10,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingHorizontal: 10,
                  }}
                >
                  <Text style={styles.label}>Account Name</Text>
                  <Text style={styles.text}>
                    {selectedItemId?.account_name}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 0.5,
                    borderBottomColor: "grey",
                    marginTop: 5,
                  }}
                />
                <View
                  style={{
                    marginTop: 10,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingHorizontal: 10,
                  }}
                >
                  <Text style={styles.label}>Category Name</Text>
                  <Text
                    style={{
                      ...styles.text,
                      fontFamily: "AvenirNextCyr-Medium",
                      color: Colors.primary,
                    }}
                  >
                    {selectedItemId?.category}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 0.5,
                    borderBottomColor: "grey",
                    marginTop: 5,
                  }}
                />

                <View
                  style={{
                    marginTop: 10,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingHorizontal: 10,
                  }}
                >
                  <Text style={styles.label}>Shelf Details</Text>
                  <Text style={styles.text}>{selectedItemId?.shelf_id}</Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 0.5,
                    borderBottomColor: "grey",
                    marginTop: 5,
                  }}
                />
                <View
                  style={{
                    marginTop: 10,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingHorizontal: 10,
                  }}
                >
                  <Text style={styles.label}>Remarks</Text>
                  <Text style={styles.text}>{selectedItemId?.remarks}</Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 0.5,
                    borderBottomColor: "grey",
                    marginTop: 5,
                  }}
                />
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={addModalVisible}
          onRequestClose={() => {
            setAddModalVisible(false);
          }}
        >
          <View style={styles.centeredView}>
            <View style={[styles.modalView, { height: 520 }]}>
              <View style={{ flex: 1, backgroundColor: "white" }}>
                <View style={{ ...styles.headercontainer }}>
                  <Text style={styles.headerTitle}>Add Shelf List</Text>
                </View>
                <View style={{ paddingHorizontal: 16, flex: 1 }}>
                  <View style={styles.dropDownContainer}>
                    <Dropdown
                      style={[
                        styles.dropdown,
                        isFocus1 && { borderColor: "blue" },
                      ]}
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
                    <Text style={{ marginBottom: '3%', color: Colors.primary, fontSize: 14, marginTop: '2%' }}>Shelf Image</Text>
                    <View style={styles.buttonview}>
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
                          <AntDesign
                            name="camera"
                            size={25}
                            color={Colors.white}
                          />
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
                    onChangeText={(text) => setRemarks(text)}
                    autoCapitalize="none"
                    blurOnSubmit={false}
                    value={remarks}
                    returnKeyType="done"
                    outlineStyle={{ borderRadius: ms(10) }}
                    style={{
                      marginBottom: "2%",
                      height: 50,
                      backgroundColor: "white",
                    }}
                  />
                </View>
                <View style={{ justifyContent: "flex-end", padding: 16 }}>
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
                        onPress={addShelfDisplay}
                      >
                        <Text style={styles.buttonText}>Add</Text>
                      </TouchableOpacity>
                    </LinearGradient>
                  </View>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => {
                  setAddModalVisible(false);
                }}
                style={[styles.closeButton, styles.circleButton]}
              >
                <AntDesign name="close" size={20} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <AnimatedFAB
          label={"Shelf Display "}
          icon={(name = "plus")}
          color={"white"}
          style={styles.fabStyle}
          fontFamily={"AvenirNextCyr-Medium"}
          extended={isExtended}
          visible={visible}
          animateFrom={"right"}
          iconMode={"static"}
          onPress={() => {
            setAddModalVisible(true);
          }}
        />
      </LinearGradient>
    </View>
  );
};

export default ListShelfDisplay;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    height: 50,
    padding: 15,
    paddingBottom: 5,
    marginVertical: 5,
    justifyContent: "space-between",
  },
  title: {
    fontWeight: "600",
    color: "#000",
    fontSize: 16,
    textAlign: "center",
    fontFamily: "AvenirNextCyr-Medium",
  },
  iconStyle: {
    marginHorizontal: 10,
  },
  card: {
    backgroundColor: "#fff",
    marginLeft: "6%",
    borderRadius: 10,
    marginBottom: 15,
    padding: 10,
    elevation: 5,
    ...globalStyles.border,
    marginTop: "6%",
    marginRight: "6%",
  },
  cartItemCountContainer: {
    height: 16,
    width: 16,
    borderRadius: 8,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    right: 4,
    top: -5,
  },
  sortContainer: {
    paddingHorizontal: 16,
  },
  sortText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
  },
  sortRadioButtonContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  radiobuttonText: {
    marginLeft: 10,
    color: "#000",
    fontSize: 14,
    fontWeight: "600",
  },
  fabStyle: {
    borderRadius: 50,
    position: "absolute",
    margin: 10,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.primary,
  },
  header: {
    paddingHorizontal: 10,
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 5,
  },
  text: {
    fontFamily: "AvenirNextCyr-Thin",
    fontSize: 14,
    color: Colors.black,
  },
  label: {
    fontSize: 16,
    color: "black",
    fontFamily: "AvenirNextCyr-Medium",
  },
  dropDownContainer: {
    backgroundColor: "white",
    marginBottom: 10,
  },
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  buttonview: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: '3%'
  },
  buttonContainer: {
    height: 50,
    padding: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  photosContainer: {
    height: 40,
    padding: 10,
    borderRadius: 10,
  },
  buttonText: {
    fontFamily: "AvenirNextCyr-Medium",
    color: "white",
  },
  closeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "lightgray",
    borderRadius: 20,
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#EFF1F5",
  },
  textStyle: {
    marginLeft: 10,
  },
  circleButton: {
    width: 35,
    height: 35,
  },
  circle: {
    width: 50,
    height: 50,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: "5%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    justifyContent: "center",
    width: "90%",
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "AvenirNextCyr-Medium",
    color: Colors.primary,
    marginLeft: 10,
    marginTop: 3,
    textAlign: 'center',
    marginVertical: '5%'
  },
  imgStyle: {
    width: 80,
    height: 80,
    resizeMode: 'cover',
    borderRadius: 8,
    marginTop: 5,
    marginBottom: 5
  },
});
