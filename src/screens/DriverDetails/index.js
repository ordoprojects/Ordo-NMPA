import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import Ionicons from "react-native-vector-icons/Ionicons";
import Colors from "../../constants/Colors";
import LinearGradient from "react-native-linear-gradient";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Feather from "react-native-vector-icons/Feather";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Entypo from "react-native-vector-icons/Entypo";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";


const DriverDetails = ({ route, navigation }) => {
  const { item } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <AntDesign name="arrowleft" size={27} color="#333333" />
        </TouchableOpacity>
        <Text style={styles.title}>Driver Details</Text>
        <TouchableOpacity
          style={styles.backButton}
        >
        </TouchableOpacity>
      </View>
      <LinearGradient
        colors={Colors.linearColors}
        start={Colors.start} end={Colors.end}
        locations={Colors.ButtonsLocation}
        style={styles.gradientContainer}
      >
        <View style={styles.detailsContainer}>
          <Ionicons
            name="person-circle-outline"
            size={124}
            color={Colors.white}
          />
          <Text
            style={styles.nameText}
          >{`${item?.first_name} ${item?.last_name}`}</Text>

          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="email" size={20} color="white" />
            <Text style={styles.label}>Email </Text>
            <Text style={styles.value}>{item?.email}</Text>
          </View>

          <View style={styles.infoRow}>
            <Feather name="phone" size={20} color="white" />
            <Text style={styles.label}>Phone</Text>
            <Text style={styles.value}>{item?.phone}</Text>
          </View>
          <View style={styles.infoRow}>
            <FontAwesome name="drivers-license" size={20} color="white" />
            <Text style={styles.label}>License Number</Text>
            <Text style={styles.value}>{item?.license_number}</Text>
          </View>
          {/* <View style={styles.infoRow}>
            <FontAwesome name="drivers-license-o" size={20} color="white" />
            <Text style={styles.label}>License Expiry</Text>
            <Text style={styles.value}>{item?.license_expiry}</Text>
          </View> */}
          <View style={styles.infoRow}>
            <Entypo name="address" size={20} color="white" />
            <Text style={styles.label}>Address</Text>
            <Text style={styles.value}>{item?.address}</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="home-city" size={20} color="white" />
            <Text style={styles.label}>City</Text>
            <Text style={styles.value}>{item?.city}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="location-sharp" size={20} color={Colors.white} />
            <Text style={styles.label}>State</Text>
            <Text style={styles.value}>{item?.state}</Text>
          </View>
          <View style={styles.infoRow}>
            <FontAwesome5 name="map-marked-alt" size={20} color="white" />
            <Text style={styles.label}>Country</Text>
            <Text style={styles.value}>{item?.country}</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialIcons name="online-prediction" size={20} color={Colors.white} />
            <Text style={styles.label}>Status</Text>
            <Text style={styles.value}>{item?.status}</Text>
          </View>

        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 20,
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    fontSize: 23,
    fontWeight: "600",
    textAlign: "center",
    color: Colors.primary
  },

  gradientContainer: {
    flex: 1,
    borderRadius: 40,
    padding: 20,
    marginTop: '3%',
  },
  detailsContainer: {
    flex: 1,
    alignItems: "center",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
    marginBottom: '3%',
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    flex: 1,
    marginLeft: '3%'
  },
  value: {
    fontSize: 16,
    color: "white",
    flex: 1,
    marginLeft: '3%',
  },
  nameText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: '3%',
    color: "white",
    textAlign: "center",
  },
});

export default DriverDetails;
