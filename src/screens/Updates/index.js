import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import Colors from "../../constants/Colors";
import Icon from "react-native-vector-icons/FontAwesome";
import { Image } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";


const Updates = ({ navigation }) => {
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
        <View style={{ ...styles.headercontainer }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ marginLeft: 5 }}
          >
            <Image
              source={require("../../assets/images/Refund_back.png")}
              style={{ height: 30, width: 30 }}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Tasks</Text>
        </View>
      </View>

      <View
        style={{
          flex: 1,
          backgroundColor: "#F3F5F8",
          borderTopLeftRadius: 35,
          borderTopRightRadius: 35,
          width: "100%",
        }}
      >
        <View style={{ marginTop: 4 }}>
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={() => navigation.navigate("Attendance")}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                source={require("../../assets/images/check.png")}
                style={{ height: 30, width: 25, tintColor: Colors.primary }}
              />

              <View style={{ paddingLeft: 10 }}>
                <Text style={styles.btnText}>Attendance</Text>
                <Text
                  style={{
                    fontSize: 10,
                    fontFamily: "AvenirNextCyr-Medium",
                    color: "gray",
                  }}
                >
                  {" "}
                  Recording of employees' presence or absence.
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={() => navigation.navigate("MerchDashboard")}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MaterialCommunityIcons name="clipboard-check-outline" size={25} color="#6B1594" />
              <View style={{ paddingLeft: 10 }}>
                <Text style={styles.btnText}>Approve Tour Plan</Text>
                <Text
                  style={{
                    fontSize: 10,
                    fontFamily: "AvenirNextCyr-Medium",
                    color: "gray",
                  }}
                >Record of tour plan that can be approved or viewed </Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={() => navigation.navigate("ReturnsHistory")}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Icon name="history" size={23} color="#6B1594" />
              <View style={{ paddingLeft: 10 }}>
                <Text style={styles.btnText}>Return History</Text>
                <Text
                  style={{
                    fontSize: 10,
                    fontFamily: "AvenirNextCyr-Medium",
                    color: "gray",
                  }}
                >
                  Record of customer product returns.
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={() => navigation.navigate("AllPlans")}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Icon name="tasks" size={23} color="#6B1594" />
              <View style={{ paddingLeft: 10 }}>
                <Text style={styles.btnText}>Tour Plans</Text>
                <Text
                  style={{
                    fontSize: 10,
                    fontFamily: "AvenirNextCyr-Medium",
                    color: "gray",
                  }}
                >Record of all tour plans.</Text>
              </View>
            </View>
          </TouchableOpacity>


        </View>
      </View>
    </LinearGradient>
  );
};

export default Updates;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    flex: 1,
    backgroundColor: Colors.white,
  },
  button: {
    borderRadius: 8,
    backgroundColor: Colors.white,
    marginTop: 10,
    padding: "5%",
    marginHorizontal: "5%",
  },
  btnText: {
    fontFamily: "AvenirNextCyr-Medium",
    color: "#000",
    fontSize: 16,
    color: "#6B1594",
  },
  headercontainer: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: "AvenirNextCyr-Medium",
    color: Colors.white,
    textAlign: "center",
    flex: 1,
    marginRight: "5%",
  },
});
