import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Colors from "../constants/Colors";

const DarkLoading = () => (
  <View style={styles.container}>
    <View style={styles.activityIndicatorContainer}>
      <ActivityIndicator
        size={70}
        color={Colors.white}
      />
      <FontAwesome5 name="truck" size={18} color="white" style={styles.truckIcon} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  activityIndicatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  truckIcon: {
    position: 'absolute',
    zIndex: 1,
  },
});

export default DarkLoading;
