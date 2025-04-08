import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Modal,
  Button,
  TouchableWithoutFeedback,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { AuthContext } from "../../Context/AuthContext";
import Colors from "../../constants/Colors";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Searchbar, Checkbox, RadioButton } from "react-native-paper";

const MaintenanceHistory = ({ navigation }) => {
  const [vehicleData, setVehicleData] = useState([]);
  const { userData } = useContext(AuthContext);

  useEffect(() => {
    // FetchVehicleList();
  }, []);

  const handleCellPress = () => {
    // Navigate to DispatchOrder screen
    navigation.navigate("CreateDispatchOrder");
  };


  const data = [
    {
      vehicle: {
        license_number: "KA 19 8908742",
        tons_capacity: 10,
        status: "Active",
      },
      destination: "Udupi - Mangalore",
      number_of_delivery_places: 2,
      verified: true,
    },
    {
      vehicle: {
        license_number: "KA 19 8908744",
        tons_capacity: 8,
        status: "In transit",
      },
      destination: "Udupi - Madikeri",
      number_of_delivery_places: 1,
      verified: true,
    },
    {
      vehicle: {
        license_number: "KA 19 8908745",
        tons_capacity: 12,
        status: "Active",
      },
      destination: "Mangalore - Goa",
      number_of_delivery_places: 3,
      verified: true,
    },
    {
      vehicle: {
        license_number: "KA 19 8908746",
        tons_capacity: 15,
        status: "In transit",
      },
      destination: "Madikeri - Mangalore",
      number_of_delivery_places: 1,
      verified: true,
    },
    {
      vehicle: {
        license_number: "KA 19 8908747",
        tons_capacity: 10,
        status: "In transit",
      },
      destination: "Mangalore - Madikeri",
      number_of_delivery_places: 2,
      verified: true,
    },
  ];

  const renderVehicleItem = ({ item }) => (

    <TouchableOpacity onPress={() => handleCellPress()}>
      <View style={styles.item}>
        <View
          style={[
            styles.statusContainer,
            item.vehicle.status === "In transit"
              ? { backgroundColor: "#fef7dc" }
              : null,
          ]}
        >
          <Text
            style={[
              styles.statusText,
              item.vehicle.status === "In transit"
                ? { color: "#eed058" }
                : null,
            ]}
          >
            {item.vehicle.status}
          </Text>
        </View>

        <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
          <Image
            style={styles.truckImage}
            source={require("../../assets/images/box_truck.png")}
          />

          <View style={{ flexDirection: "column" }}>
            <Text style={styles.orderTitle}>{item.vehicle.license_number}</Text>

            <View
              style={{ flexDirection: "row", gap: 1, alignItems: "center" }}
            >
              <MaterialIcons name="location-pin" size={20} color="gray" />

              <Text style={styles.orderTitl3}>{item.destination}</Text>
            </View>
          </View>
        </View>
        <View style={styles.line}></View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
           
          }}
        >
          <View style={{ flex: 1 }}>
            <View
              style={{ flexDirection: "row", gap: 10, alignItems: "center" }}
            >
              <MaterialCommunityIcons name="weight" size={20} color="gray" />
              <Text style={styles.orderTitl2}>
                {item.vehicle.tons_capacity}.00 Tonne(s)
              </Text>
            </View>
            <View
              style={{ flexDirection: "row", gap: 11, alignItems: "center" }}
            >
              <MaterialIcons name="alt-route" size={20} color="gray" />
              <Text style={styles.orderTitl2}>
                {item.number_of_delivery_places} Routes
              </Text>
            </View>
          </View>

          <View
            style={{
              borderRadius: 29,
              backgroundColor: "#F1E8EC",
              padding: 10,
            }}
          >
            <Ionicons name="call" size={19} color="#9B5B79" />
          </View>
          <View
            style={{
              borderRadius: 29,
              backgroundColor: "#F1E8EC",
              padding: 10,
              marginLeft: "2%",
            }}
          >
            <MaterialIcons name="navigate-next" size={20} color="#9B5B79" />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={Colors.linearColors}
      start={Colors.start}
      end={{ x: 1, y: 0.5 }}
      locations={Colors.location}
      style={{ flex: 1 }}
    >
      <View style={styles.headerView}>
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
            marginLeft: 8,
            color: "white",
          }}
        >
          Select Dispatch Vehicle
        </Text>
        <TouchableOpacity>
          <AntDesign name="filter" size={22} color="white" />
        </TouchableOpacity>
      </View>
      <View style={styles.whiteView}>
        <Searchbar
          style={{
            marginHorizontal: "4%",
            marginVertical: "3%",
            backgroundColor: "white",
          }}
          placeholder="Search Vehicle"
          // onChangeText={onChangeSearch}
          // value={searchQuery}
        />

        <FlatList
          data={data}
          renderItem={renderVehicleItem}
          keyExtractor={(item) => item.id}
        />
      </View>
    </LinearGradient>
  );
};

export default MaintenanceHistory;

const styles = StyleSheet.create({
  headerView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 60,
    paddingHorizontal: "4%",
  },
  whiteView: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: "4%",
  },
  item: {
    backgroundColor: "white",
    paddingHorizontal: "4%",
    paddingVertical: "3%",
    marginHorizontal: "4%",
    elevation: 5,
    alignItems: "flex-start",
    marginBottom: "3%",
    borderRadius: 9,
  },
  button: {
    justifyContent: "center",
    borderRadius: 50,
    height: 50,
  },
  filteredText: {
    fontFamily: "AvenirNextCyr-Thin",
    fontSize: 16,
    color: Colors.primary,
  },
  moreDetailsButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 5,
  },
  itemDetails: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  orderTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft:4
    // fontFamily: "AvenirNextCyr-Medium",
  },
  orderTitl2: {
    fontSize: 13,
    fontWeight: "600",
  },
  orderTitl3: {
    fontSize: 14,
    fontWeight: "500",
    color: "gray",
  },
  statusContainer: {
    backgroundColor: "#e7f9f1",
    borderRadius: 8,
    marginBottom: 8,
  },
  statusText: {
    color: "#14c76d",
    fontSize: 13,
    fontFamily: "AvenirNextCyr-Medium",
    paddingHorizontal: "3%",
  },
  truckImage: {
    height: 50,
    width: 50,
  },
  line: {
    height: 1,
    backgroundColor: "lightgray",
    width: "100%",
    marginVertical: '2%',
  },
});
