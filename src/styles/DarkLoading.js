import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Colors from "../constants/Colors";

const DarkLoading = () => (
  <View style={styles.container}>
    <View style={styles.activityIndicatorContainer}>
      <ActivityIndicator
        size={70}
        color={Colors.primary}
      />
      <MaterialCommunityIcons name="truck-fast-outline" size={18} color= {Colors.primary} style={styles.truckIcon} />
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
