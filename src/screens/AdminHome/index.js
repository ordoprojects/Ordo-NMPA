import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  FlatList,
  ToastAndroid,
  ActivityIndicator,
  Pressable,
  ScrollView,
  Button,
  Modal,
} from "react-native";
import React, { useContext, useState, useEffect, useRef } from "react";
import { Image } from "react-native-animatable";
import Colors from "../../constants/Colors";
import { AuthContext } from "../../Context/AuthContext";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import globalStyles from "../../styles/globalStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RNFS from "react-native-fs";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Octicons from "react-native-vector-icons/Octicons";
import Ionicons from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";
import { LinearTextGradient } from "react-native-text-gradient";
import { ms, hs, vs } from "../../utils/Metrics";
import { PieChart } from "react-native-gifted-charts";
import Carousel, { Pagination } from "react-native-snap-carousel";

const AdminHome = ({ navigation }) => {
  const [refillData, setRefilldata] = useState([]);
  const [activeSlide, setActiveSlide] = useState(0);

  const pieData = [
    { value: 54, color: "#4b0482", name: "Total Orders" },
    { value: 30, color: "#E76CA7", name: "Product 2" },
    { value: 26, color: "#ECB5CF", name: "Product 3" },
  ];

  useEffect(() => {
    getStockRefill();
  }, [userData]);

  const getStockRefill = async () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${userData.token}`);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch("https://gsidev.ordosolution.com/api/refill-stock-report/", requestOptions)
      .then((response) => response.json())
      .then(async (result) => {
        // console.log("dss", result)
        const modifiedResult = result.map((item) => {
          const mfdDate = new Date(item.mfd);
          const expiryDate = new Date(
            mfdDate.setDate(mfdDate.getDate() + item.no_of_days_remaining)
          );

          // Format the expiryDate as DD-MM-YYYY
          const formattedExpiryDate = expiryDate.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });

          return {
            ...item,
            expiry_date: formattedExpiryDate,
          };
        });

        // Set the modified data
        setRefilldata(modifiedResult);
      })
      .catch((error) => {
        setLoading(false);
        console.log("error in stock refill api", error);
      });
  };

  useEffect(() => {
    getPie();
  }, []);

  const getPie = async () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${userData.token}`);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      "https://gsidev.ordosolution.com/api/top-fast-moving-products/",
      requestOptions
    )
      .then((response) => response.json())
      .then(async (result) => {
        // console.log('pie graph', result);
      })
      .catch((error) => {
        setLoading(false);
        console.log("error", error);
      });
  };

  const { logout } = useContext(AuthContext);
  const { token, userData, cartData, setCartData, orderID, dealerData } =
    useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [recommended, setRecommended] = useState([]);

  useEffect(() => {
    getRecommened();
  }, []);

  const getRecommened = () => {
    var raw = "";

    var requestOptions = {
      method: "POST",
      body: raw,
      redirect: "follow",
    };

    fetch("https://gsidev.ordosolution.com/get_recommended.php", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        const { product_list } = result;
        setRecommended(product_list);
      })
      .catch((error) => console.log("error", error));
  };

  const logoutAlert = () => {
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

  const renderLegends = (pieData) => {
    return pieData.map((item, index) => (
      <View
        key={index}
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 10,
          marginLeft: "5%",
        }}
      >
        <View
          style={{
            height: 10,
            width: 10,
            borderRadius: 5,
            backgroundColor: item.color,
            marginRight: 5,
          }}
        />
        <Text
          style={{
            marginLeft: 5,
            fontFamily: "AvenirNextCyr-Bold",
            color: " #50001D",
            fontSize: 16,
          }}
        >
          {item.name}
        </Text>
      </View>
    ));
  };

  const renderItemCarousel = ({ item }) => (
    <View
      style={{
        width: "100%",
        backgroundColor: Colors.primary,
        borderRadius: 20,
        padding: "4%",
        marginTop: "1%",
      }}
    >
      <View style={{ flexDirection: "row", gap: 10 }}>
        {item.product_image ? (
          <Image
            source={{uri: item.product_image.startsWith("http")
          ? item.product_image
          : `https://gsidev.ordosolution.com${item.product_image}`,
      }}
            style={{ ...styles.image }}
          />
        ) : (
          <Image
            source={require("../../assets/images/noImagee.png")}
            style={{ ...styles.image }}
          />
        )}

        <View style={{ marginLeft: "3%" }}>
          <Text
            style={{ fontFamily: "Poppins-Bold", color: "white", fontSize: 16 }}
          >
            {item.name}
          </Text>
          <Text
            style={{
              fontFamily: "AvenirNextCyr-Thin",
              color: "white",
              fontFamily: "Poppins-Bold",
            }}
          >
            {item.stock <= 0 ? (
              <Text
                style={{
                  color: "red",
                  fontFamily: "Poppins-Bold",
                  fontSize: 14,
                }}
              >
                Out of stock
              </Text>
            ) : (
              `Stock remaining: ${item.stock}`
            )}
          </Text>
          <Text
            style={{
              fontFamily: "AvenirNextCyr-Thin",
              color: "white",
              marginTop: "5%",
            }}
          >
            Expiry date: {item.expiry_date}
          </Text>
        </View>
      </View>
      <View
        style={{
          borderTopWidth: 1,
          borderTopColor: "white",
          width: "100%",
          paddingTop: "3%",
          marginTop: "3%",
          flexDirection: "row",
          justifyContent: "flex-end",
        }}
      >
        <TouchableOpacity
          style={{ flexDirection: "row" }}
          onPress={() => {
            navigation.navigate("ProductDetails", { item: item });
          }}
        >
          <Text
            style={{
              fontFamily: "AvenirNextCyr-Thin",
              color: "white",
              fontSize: 18,
            }}
          >
            View
          </Text>
          <MaterialIcons name="keyboard-arrow-right" size={28} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.rootContainer}>
      <View style={{ height: "35%" }}>
        <LinearGradient
          colors={Colors.linearColors}
          start={{ x: 1, y: 1 }}
         end={Colors.end}
          locations={Colors.location}
          style={{
            borderBottomRightRadius: ms(50),
            borderBottomLeftRadius: ms(50),
            paddingHorizontal: "5%",
            paddingTop: "5%",
            height: "70%",
          }}
        >
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={{ flexDirection: "row", gap: hs(10) }}>
              <View>
                <Text
                  style={{
                    color: "white",
                    fontSize: ms(20),
                    fontFamily: "AvenirNextCyr-Medium",
                    color: Colors.primary,
                  }}
                >
                  Welcome
                </Text>
                <Text
                  style={{
                    color: "white",
                    fontSize: ms(12),
                    fontFamily: "AvenirNextCyr-Thin",
                  }}
                >
                  {userData?.name}
                </Text>
              </View>
            </View>

            <TouchableOpacity onPress={logoutAlert}>
              <Image
                source={require("../../assets/images/power-off.png")}
                style={{
                  height: 25,
                  width: 25,
                  tintColor: "white",
                  marginLeft: 20,
                  marginRight: 10,
                }}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.graphContainer}>
            <View>{renderLegends(pieData)}</View>
            <PieChart
              donut
              showValuesAsLabels
              font="AvenirNextCyr-Medium"
              focusOnPress={true}
              showText
              textColor="white"
              innerRadius={40}
              showTextBackground
              data={pieData}
              radius={80}
              textBackgroundColor="transparent"
              centerLabelComponent={() => {
                return (
                  <Text
                    style={{
                      fontSize: 20,
                      color: "#4b0482",
                      fontFamily: "AvenirNextCyr-Medium",
                    }}
                  >
                    70%
                  </Text>
                );
              }}
            />
          </View>
        </LinearGradient>
      </View>

      <Text
        style={{
          fontSize: 22,
          marginLeft: "5%",
          fontFamily: "AvenirNextCyr-Bold",
        }}
      >
        Services
      </Text>

      <View style={styles.whiteBack}>
        <View style={styles.rowContainer}>
          <TouchableOpacity
            style={styles.MgmtContainer}
            onPress={() => {
              navigation.navigate("OrderMgmt");
            }}
          >
            <View style={styles.MgmtImageContainer}>
              <MaterialCommunityIcons
                name="cart-variant"
                size={30}
                color="#72022F"
              />
            </View>

            <View style={styles.MgmtTextContainer}>
              <Text style={styles.MgmtText}>Order</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.MgmtContainer}
            onPress={() => {
              navigation.navigate("Visits");
            }}
          >
            <View style={styles.MgmtImageContainer}>
              <Octicons name="checklist" size={28} color="#72022F" />
            </View>
            <View style={styles.MgmtTextContainer}>
              <Text style={styles.MgmtText}>Sales</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.MgmtContainer}
            onPress={() => {
              navigation.navigate("SupplierMgmt");
            }}
          >
            <View style={styles.MgmtImageContainer}>
              <View style={styles.MgmtImageContainer}>
                <FontAwesome5 name="boxes" size={28} color="#72022F" />
              </View>
            </View>
            <View style={styles.MgmtTextContainer}>
              <Text style={styles.MgmtText}>Supplier</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.rowContainer}>
          <TouchableOpacity
            style={styles.MgmtContainer}
            onPress={() => {
              navigation.navigate("InventoryMgmt");
            }}
          >
            <View style={styles.MgmtImageContainer}>
              <View style={styles.MgmtImageContainer}>
                <Ionicons name="cart" size={33} color="#72022F" />
              </View>
            </View>
            <View style={styles.MgmtTextContainer}>
              <Text style={styles.MgmtText}>Inventory</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.MgmtContainer}
            onPress={() => {
              navigation.navigate("CheckIn");
            }}
          >
            <View style={styles.MgmtImageContainer}>
              <View style={styles.MgmtImageContainer}>
                <MaterialCommunityIcons
                  name="truck"
                  size={35}
                  color="#72022F"
                />
              </View>
            </View>
            <View style={styles.MgmtTextContainer}>
              <Text style={[styles.MgmtText, { fontSize: 14 }]}>Fleet</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.MgmtContainer}
            onPress={() => {
              navigation.navigate("RequestCredit");
            }}
          >
            <View style={styles.MgmtImageContainer}>
              <FontAwesome name="credit-card" size={27} color="#72022F" />
            </View>
            <View style={styles.MgmtTextContainer}>
              <Text style={styles.MgmtText}>Financial</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View>
        <Text
          style={{
            fontFamily: "AvenirNextCyr-Bold",
            fontSize: 19,
            paddingHorizontal: "5%",
          }}
        >
          Stock refill
        </Text>

        <Carousel
          data={refillData}
          renderItem={renderItemCarousel}
          sliderWidth={400}
          itemWidth={350}
          layout={"default"}
          loop={true}
          autoplay={true}
          autoplayInterval={3000}
          onSnapToItem={(index) => setActiveSlide(index)}
        />
      </View>
    </View>
  );
};

export default AdminHome;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  graphContainer: {
    backgroundColor: "white",
    borderRadius: 15,
    paddingVertical: "2%",
    paddingHorizontal: "2%",
    position: "relative",
    top: "5%",
    elevation: 8,
    ...globalStyles.border,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rowContainer: {
    flexDirection: "row",
    marginBottom: "3%",
    gap: 10,
    justifyContent: "center",
  },
  MgmtContainer: {
    paddingHorizontal: "2%",
    borderRadius: 20,
    backgroundColor: "#F4EDF1",
    ...globalStyles.border,
    width: "30%",
    height: 90,
    paddingVertical: "2%",
    alignItems: "center",
    justifyContent: "center",
  },
  MgmtTextContainer: {
    paddingHorizontal: "2%",
  },
  MgmtText: {
    fontSize: 15,
    // fontWeight: "500",
    color: "#72022F",
    marginTop: "5%",
    fontFamily: "AvenirNextCyr-Bold",
  },
  MgmtImageContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: "5%",
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "white",
  },
  whiteBack: {
    marginHorizontal: "4%",
    padding: "1%",
    backgroundColor: "white",
    borderRadius: 15,
    elevation: 3,
    marginBottom: "4%",
    paddingTop: "4%",
  },
});
