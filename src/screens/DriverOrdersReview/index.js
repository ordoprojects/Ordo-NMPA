import React, {
  useState,
  createRef,
  useContext,
  useEffect,
  useRef,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  ScrollView
} from "react-native";
import Colors from "../../constants/Colors";
import AntDesign from "react-native-vector-icons/AntDesign";
import LinearGradient from "react-native-linear-gradient";
import { AnimatedFAB } from "react-native-paper";
import Ionicons from "react-native-vector-icons/Ionicons";
import moment from "moment";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Entypo from "react-native-vector-icons/Entypo";
import Toast from "react-native-simple-toast";
import { AuthContext } from "../../Context/AuthContext";
import { locationPermission } from "../../utils/Helper";
import Geolocation from "react-native-geolocation-service";
import SignatureScreen from "react-native-signature-canvas";
import { List, FAB } from "react-native-paper";
import { useFocusEffect } from '@react-navigation/native';

const DriverOrdersReview = ({ route, text, navigation }) => {
  const { Details, remarks, id } = route.params;
  const [isModalVisible2, setModalVisible2] = useState("");
  const [isExtended, setIsExtended] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [completedDropdownVisible, setCompletedDropdownVisible] =
    useState(true);
  const { userData, logout } = useContext(AuthContext);
  const [lattitude, setLattitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [signatureBase64, setSignatureBase64] = useState(null);


  console.log('=================Details===================');
  console.log(Details[0]?.is_production);
  console.log('====================================');

  const style = `.m-signature-pad--footer {display: none; margin: 0px;} .m-signature-pad--body {border: none; background-color: #F3F5F8; border-radius: 20px;}`;
  const refYou = useRef();

  const totalProducts = Details.reduce((acc, item) => acc + (item.product_list?.length || 0), 0);

  const resetSign = () => {
    if (refYou.current) {
      setSignatureBase64("");
      refYou.current.clearSignature();
    }
  };

  const handleOK = (signature) => {
    setSignatureBase64(signature);
  };

  const handleEmpty = () => {
    console.log("Empty");
  };

  const handleClear = () => {
    console.log("clear success!");
  };

  const handleEnd = () => {
    refYou.current.readSignature();
  };

  const handleBegin = () => {};

  const handleData = (data) => {
    setScrollEnabled(true);
  };


  useFocusEffect(
    React.useCallback(() => {
      checkPermission();
    }, [])
);

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
          setLattitude(res.coords.latitude);
          setLongitude(res.coords.longitude);
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

  console.log('------------>',lattitude,longitude);
  console.log('------------>',lattitude,longitude);

  const UpdateRemarks = () => {

    if (!signatureBase64) {
      Alert.alert("Warning","Please add the Signature");
      return;
    }

    setIsSaving(true);
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${userData?.token}`);

    var raw = JSON.stringify({
      route: id,
      update_remarks: remarks,
      latitude: lattitude ? lattitude : '37.4220936',
      longitude: longitude ? longitude : '-122.083922' ,
      customer_sign: signatureBase64,
      customer_id: Details[0]?.assigne_to,
    });
    
    console.log('=====================raw===============');
    console.log(raw);
    console.log('======================================');

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };


    fetch( Details[0]?.is_production ? 'https://gsidev.ordosolution.com/api/production_driver/' :"https://gsidev.ordosolution.com/api/update_remarks/", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.error) {
          console.log("Error", result.error);
        } else {
          Toast.show("Delivered successfully", Toast.LONG);
          navigation.navigate("DriverDashboard");
        }
        setIsSaving(false);
      })
      .catch((error) => {
        setIsSaving(false);
        Toast.show("Something went wrong", Toast.LONG);
      });
  };

  const allProducts = Details.flatMap((order) => order?.product_list);
  console.log(remarks);

  const completedProducts = allProducts.filter((product) =>
    remarks.some(
      (remark) =>
        remark?.product_id === product.id &&
        remark?.route_product_status === "Completed"
    )
  );

  const rejectedProducts = allProducts.filter((product) =>
    remarks.some(
      (remark) =>
        remark?.product_id === product.id &&
        remark?.route_product_status !== "Completed"
    )
  );

  return (
    <LinearGradient
      colors={Colors.linearColors}
      start={Colors.start}
      end={Colors.end}
      locations={Colors.location}
      style={{ flex: 1 }}
    >
      <View style={styles.headerView}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ paddingLeft: "4%" }}
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
          }}
        >
          Review Selected Orders
        </Text>
        <TouchableOpacity style={{ width: "15%" }}></TouchableOpacity>
      </View>

      <View style={styles.container}>
        <LinearGradient
          colors={Colors.linearColors}
          start={Colors.start}
          end={Colors.end}
          locations={[0.003, 1, 1]}
          style={styles.detailsBox}
        >
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
          <View style={styles.view1}>
            <MaterialCommunityIcons
              name="office-building-marker"
              size={22}
              color={Colors.white}
            />

            <Text style={styles.title}>{Details[0]?.assignee_name}</Text>
          </View>
          <View style={styles.view1}>
            <Entypo name="location-pin" size={24} color={Colors.white} />
            <Text style={styles.title1}>
              {Details[0]?.assigne_to_address?.address}{"\n"}
              {Details[0]?.assigne_to_address?.state}{" "}
              {Details[0]?.assigne_to_address?.postal_code}
            </Text>
          </View>
          <View style={[styles.view1, { marginLeft: "1%" }]}>
            <Ionicons name="document-text" size={20} color={Colors.white} />
            <Text style={styles.title1}>{Details[0]?.name}</Text>
          </View>
          <View
            style={{
              height: 1,
              width: "100%",
              backgroundColor: Colors.white,
              marginVertical: "3%",
            }}
          ></View>
          <View
            style={{ flexDirectio: "row", justifyContent: "space-between" }}
          >
            <Text style={styles.location}>
              Total Products :{totalProducts}
            </Text>
          </View>
        </LinearGradient>

        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <List.Section>
          <List.Accordion
            title="Delivering Products"
            expanded={completedDropdownVisible}
            style={styles.accordionItem}
            onPress={() =>
              setCompletedDropdownVisible(!completedDropdownVisible)
            }
          >
            {completedProducts.length === 0 ? (
              <Text style={styles.noProductsText}>No Products</Text>
            ) : (
              completedProducts.map((product) => (
                <View
                  style={{
                    backgroundColor: "white",
                    borderWidth: 1,
                    borderColor: "lightgray",
                  }}
                  key={product.id}
                >
                  <View style={styles.product}>
                    {product?.product_image ? (
                      <Image
                        source={{ uri: product?.product_image }}
                        style={styles.image}
                      />
                    ) : (
                      <Image
                        source={require("../../assets/images/noImagee.png")}
                        style={styles.image}
                      />
                    )}
                    <View style={styles.productDetails}>
                      <View style={{ flexDirection: "column" }}>
                        <Text style={styles.productName}>{product?.name}</Text>
                        <Text style={styles.qty}>
                          Weight: { Details[0]?.is_production === true  ? product?.sum_of_roofing_base_production_weight : product?.actual_loaded_weight} Kg
                        </Text>
                        {Details[0]?.is_production === false && 
                        <Text style={styles.qty}>Qty: {product?.actual_loaded_qty} {product?.loaded_uom}</Text>
                         }
                      </View>
                    </View>
                  </View>
                </View>
              ))
            )}
          </List.Accordion>

        </List.Section>
        </ScrollView>

        <Modal
          visible={isModalVisible2}
          animationType="slide"
          transparent={true}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              justifyContent: "center",
              paddingHorizontal: 1,
            }}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: "white",
                paddingHorizontal: 20,
                borderRadius: 8,
                position: "absolute",
                bottom: 0,
                width: "100%",
                height: "45%",
                paddingVertical: 8,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  padding: "2%",
                }}
              >
                <Text style={styles.modalTitle}>Signature</Text>
                <TouchableOpacity onPress={() => setModalVisible2(false)}>
                  <AntDesign name="close" size={20} color={`black`} />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  borderColor: "grey",
                  borderWidth: 1,
                  height: "50%",
                  borderRadius: 10,
                  flex: 1,
                  padding: "1%",
                }}
                pointerEvents={isSaving ? "none" : "auto"}
              >
                <SignatureScreen
                  ref={refYou}
                  onEnd={handleEnd}
                  onBegin={handleBegin}
                  onOK={handleOK}
                  onEmpty={handleEmpty}
                  onClear={handleClear}
                  onGetData={handleData}
                  autoClear={false}
                  webStyle={style}
                  descriptionText={text}
                />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  marginLeft: 10,
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ color: "gray", fontFamily: "AvenirNextCyr-Medium" }}
                >
                  Date: {moment(new Date()).format("DD-MM-YYYY hh:mm a")}
                </Text>
               {!isSaving && (
                <TouchableOpacity>
                  <Text
                    style={{ ...styles.content, color: "tomato" }}
                    onPress={() => {
                      resetSign();
                    }}
                  >
                    Clear Signature
                  </Text>
                </TouchableOpacity>

                )}
              </View>
              <LinearGradient
                colors={Colors.linearColors}
                start={Colors.start}
                end={Colors.end}
                locations={Colors.ButtonsLocation}
                style={styles.gradi}
              >
                <TouchableOpacity
                  style={styles.button}
                  activeOpacity={isSaving ? 1 : 0.8}
                  onPress={() => {
                    UpdateRemarks();
                  }}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <ActivityIndicator size={25} color={Colors.white} />
                  ) : (
                    <Text style={styles.btnText}>Confirm Delivery</Text>
                  )}
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>
        </Modal>

        <AnimatedFAB
          label={"Confirm Delivery"}
          icon={() => (
            <MaterialCommunityIcons name="draw-pen" size={30} color="white" />
          )}
          color={"white"}
          style={styles.fabStyle}
          borderRadius={60}
          fontFamily={"AvenirNextCyr-Medium"}
          extended={isExtended}
          visible={true}
          animateFrom={"right"}
          onPress={() => {
            setModalVisible2(true);
          }}
        />
      </View>
    </LinearGradient>
  );
};

export default DriverOrdersReview;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: "3%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: "1%",
  },
  product: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    padding: "1%",
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: "lightgray",
    marginBottom: "3%",
  },
  image: {
    width: 50,
    height: 50,
    marginRight: "2%",
    borderRadius: 5,
  },
  productDetails: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: "4%",
  },
  productName: {
    fontSize: 16,
    fontFamily: "AvenirNextCyr-Bold",
    color: Colors.primary,
  },
  qty: {
    fontSize: 14,
    color: Colors.black,
    fontFamily: "AvenirNextCyr-Medium",
  },
  price: {
    fontSize: 16,
    fontFamily: "AvenirNextCyr-Bold",
    color: "green",
  },
  totalView: {
    borderTopWidth: 1,
    borderTopColor: Colors.primary,
    paddingHorizontal: "3%",
    paddingVertical: "3%",
    backgroundColor: "#f2f3f9",
  },
  fabStyle: {
    position: "absolute",
    right: "4%",
    bottom: "7%",
    backgroundColor: Colors.primary,
    borderRadius: 30,
  },
  btnText: {
    fontFamily: "AvenirNextCyr-Medium",
    color: "#fff",
    fontSize: 16,
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    width: "100%",
    paddingVertical: "4%",
  },
  signature: {
    flex: 1,
  },
  totalAmountInWords: {
    color: Colors.black,
    fontFamily: "AvenirNextCyr-Medium",
    fontSize: 14,
    fontStyle: "italic",
  },
  totalAmount: {
    color: Colors.primary,
    fontFamily: "AvenirNextCyr-Bold",
    fontSize: 19,
  },
  headerView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 60,
    paddingHorizontal: "4%",
  },
  detailsBox: {
    backgroundColor: "#f8f8f8",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    padding: "3%",
    borderRadius: 10,
    justifyContent: "space-between",
    marginBottom: "3%",
  },
  title: {
    color: Colors.white,
    fontFamily: "AvenirNextCyr-Medium",
    fontSize: 19,
    fontFamily: "AvenirNextCyr-Bold",
  },
  title1: {
    color: "#FAF9F6",
    fontFamily: "AvenirNextCyr-Medium",
    fontSize: 16,
  },
  location: {
    fontSize: 15,
    color: Colors.white,
    textAlign: "left",
    fontFamily: "AvenirNextCyr-Medium",
  },
  location1: {
    fontSize: 14,
    color: Colors.white,
    textAlign: "left",
    fontFamily: "AvenirNextCyr-Medium",
  },
  modalTitle: {
    fontSize: 16,
    fontFamily: "AvenirNextCyr-Bold",
    color: Colors.primary,
  },
  view1: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  gradi: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginTop: "3%",
    marginBottom: "4%",
  },
  remarkText: {
    fontFamily: "AvenirNextCyr-Medium",
    color: "red",
    fontSize: 14,
  },
  dropdownHeader: {
    backgroundColor: Colors.white,
    paddingHorizontal: "5%",
    paddingVertical: "4%",
    marginBottom: "3%",
    borderRadius: 7,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dropdownHeaderText: {
    fontFamily: "AvenirNextCyr-Medium",
    color: Colors.primary,
    fontSize: 18,
  },
  dropdownContent: {
    backgroundColor: Colors.white,
    paddingHorizontal: "5%",
    marginBottom: "3%",
    borderRadius: 7,
    paddingTop: "3%",
  },
  noProductsText: {
    textAlign: "center",
    paddingBottom: "3%",
  },
  accordionItem: {
    marginBottom: "2%",
    backgroundColor: "#f2f3f9",
    borderRadius: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "lightgray",
  },
});
