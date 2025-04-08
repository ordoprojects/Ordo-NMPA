import React, { useContext, useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { AuthContext } from "../../Context/AuthContext";
import moment from "moment";
import LinearGradient from "react-native-linear-gradient";
import Colors from "../../constants/Colors";
import { ms, hs, vs } from "../../utils/Metrics";
import { Searchbar } from "react-native-paper";
import DarkLoading from "../../styles/DarkLoading";
import Toast from "react-native-simple-toast";
import { Button ,ActivityIndicator } from "react-native-paper";

const Incentives = ({ navigation }) => {
  const { tourPlanId, userData } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [noData, setNoData] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

   useFocusEffect(
      useCallback(() => {
         FetchFuelData();
     }, [userData, offset, search])
  );

  const FetchFuelData = async () => {
    // Reset noData state when fetching new data
    if (offset === 0) {
      setNoData(false);
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${userData.token}`);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    try {
      const response = await fetch(
        `https://gsidev.ordosolution.com/api/salesman_incentives/?ordo_user=${userData?.id}&limit=10&offset=${offset}&search_name=${search}`,
        requestOptions
      );
      const result = await response.json();

      if (result.results.length > 0) {
        if (offset === 0) {
          setData(result.results);
          setTotal(result?.total_incentive);
          setLoading(false);
        } else {
          setData((prevData) => [...prevData, ...result.results]);
          setLoadingMore(false);
        }
        // Check if more data is available
        if (result.results.length < 10) {
          setHasMoreData(false);
        } else {
          setHasMoreData(true);
        }
      } else {
        Toast.show("No incentives found.", Toast.LONG);
        if (offset === 0) {
          setNoData(true);
          setLoading(false);
        } else {
          setHasMoreData(false);
          setLoadingMore(false);
        }
      }
    } catch (error) {
      setLoading(false);
      setLoadingMore(false);
      console.log("error", error);
      Toast.show("An error occurred while fetching data.", Toast.LONG);
    }
  };

  const handleLoadMore = async () => {
    setOffset((prevOffset) => prevOffset + 10);
  };



  const renderItem = ({ item, index }) => {
    let paymentImage, backgroundColor, borderColor, textColor;

    switch (item?.mode_of_payment) {
      case "Cash":
        paymentImage = require("../../assets/images/CashPay.png");
        backgroundColor = "#EDFDF0";
        break;
      case "Wire Transfer/ Bank Transfer":
        paymentImage = require("../../assets/images/onlinePay.png");
        backgroundColor = "#FFF9E5";
        break;
      case "Cheque":
        paymentImage = require("../../assets/images/ChequePay.png");
        backgroundColor = "#E3EDFC";
        break;
      default:
        paymentImage = require("../../assets/images/CashPay.png");
        backgroundColor = "#EDFDF0";
        break;
    }

    return (
      <TouchableOpacity
        style={{ ...styles.itemContainer, borderColor: borderColor }}
        onPress={() => {
          setSelectedPayment(item);
          setModalVisible(true);
        }}
        activeOpacity={0.5}
      >
        <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
          <View
            style={{
              height: 70,
              width: 75,
              backgroundColor: backgroundColor,
              borderRadius: 10,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image source={paymentImage} style={{ height: 45, width: 45 }} />
          </View>
          <View style={styles.orderDataContainer}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={styles.title}>{item?.sales_order_name}</Text>
              <Text
                style={{
                  ...styles.text,
                  fontFamily: "AvenirNextCyr-Medium",
                  color: "green",
                  fontSize: 18,
                }}
              >
                                                             {item?.incentive? 
         new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(item?.incentive)) : 
         new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(0)
       }
              </Text>
            </View>
            <Text style={{ ...styles.text, fontSize: 14 }}>
              {item?.customer_name}
            </Text>
            <Text style={{ ...styles.text }}>
              {moment(item?.created_at).format("DD-MM-YYYY HH:mm")}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const noDataFound = () => {
    return (
      <View style={styles.noReport}>
        <Text style={styles.noReportText}>No data found</Text>
      </View>
    );
  };

  const loadMoreData = () => {
    if (!loading && hasMoreData) { 
      setOffset((prevOffset) => prevOffset + 10);
    }
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
        <View style={styles.rowContainer}>
          <View style={{ ...styles.headercontainer }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image
                source={require("../../assets/images/Refund_back.png")}
                style={{ height: 30, width: 30 }}
              />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Incentives</Text>
            <Text style={styles.headerTitle}> </Text>
          </View>
        </View>

        <Searchbar
          style={{
            marginHorizontal: "3%",
            marginVertical: "1%",
            backgroundColor: "white",
          }}
          placeholder="Search Incentives"
          onChangeText={(val) => {
            setSearch(val);
            setOffset(0); 
          }}
          value={search}
          // onSubmitEditing={fetchIncentives} 
        />

        <View
          style={{
            backgroundColor: "#F3F5F8",
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            flex: 1,
            padding: 10,
            elevation: 5,
            marginTop: vs(10),
          }}
        >
{loading ? (
            <DarkLoading />
          ) : noData ? (
            noDataFound()
          ) : (
            <FlatList
              data={data}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
              style={{ marginTop: "2%" }}
              ListFooterComponent={
                hasMoreData ? (
                  loadingMore ? (
                    <ActivityIndicator style={{ paddingVertical: 5 }} />
                  ) : (
                    <Button onPress={handleLoadMore}>Load More</Button>
                  )
                ) : null
              }
            />
          )}
        </View>

        <View
          style={{
            backgroundColor: "white",
            paddingHorizontal: "4%",
            flexDirection: "row",
            justifyContent: "space-between",
            paddingVertical: "5%",
          }}
        >
          <Text
            style={{
              fontFamily: "AvenirNextCyr-Medium",
              fontSize: 22,
              color: "black",
            }}
          >
            Total Incentives
          </Text>
          <Text
            style={{
              fontFamily: "AvenirNextCyr-Bold",
              fontSize: 20,
              color: "green",
            }}
          >
                                                 {total ? 
         new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format((total ?? 0).toFixed(2)) : 
         new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(0)
       }


          </Text>
        </View>
      </LinearGradient>
    </View>
  );
};

export default Incentives;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headercontainer: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginVertical: vs(8),
    paddingHorizontal: hs(8),
    alignItems: "center",
    marginHorizontal: ms(5),
  },
  headerTitle: {
    fontFamily: "AvenirNextCyr-Bold",
    fontSize: 24,
    color: "white",
  },
  rowContainer: {
    backgroundColor: Colors.primaryColor,
    height: vs(50),
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "black",
  },
  itemContainer: {
    paddingHorizontal: ms(20),
    paddingVertical: vs(15),
    borderRadius: 10,
    elevation: 2,
    marginVertical: vs(5),
    borderWidth: 1,
    backgroundColor: "#fff",
  },
  orderDataContainer: {
    marginLeft: ms(10),
    flex: 1,
  },
  title: {
    fontFamily: "AvenirNextCyr-Bold",
    color: "black",
    fontSize: 16,
  },
  text: {
    fontFamily: "AvenirNextCyr-Medium",
    color: "#808080",
    fontSize: 16,
  },
  noReport: {
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  noReportText: {
    fontFamily: "AvenirNextCyr-Bold",
    color: "#808080",
  },
});
