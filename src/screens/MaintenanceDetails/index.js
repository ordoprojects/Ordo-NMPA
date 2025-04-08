import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";

const MaintenanceDetails = ({ route, navigation }) => {
  // Extract data from the route params
  const { item } = route.params;


  console.log("🚀 ~ MaintenanceDetails ~ item:", item)


  

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{ marginBottom: "5%" }}
      >
        <AntDesign name="arrowleft" size={25} color="black" />
      </TouchableOpacity>
      <View style={styles.header}>
        <Text style={styles.title}>
          {item.maintainance_type ? "Maintenance" : "Fuel"} Details
        </Text>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.label}>
          {item.maintainance_type ? "Maintenance Type" : "Fuel Type"}:
        </Text>
        <Text style={styles.value}>
          {item.maintainance_type ? item.maintainance_type.join(", ") : item.fuel_type}
        </Text>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.label}>
          {item.maintainance_atype ? "Maintenance Date" : "Fuel Date"}:
        </Text>
        <Text style={styles.value}>
          {item.maintainance_date || item.fuel_date}
        </Text>
      </View>
      {item.maintainance_type && (
        <>
          <View style={styles.detailsContainer}>
            <Text style={styles.label}>Cost:</Text>
            <Text style={styles.value}>${item.cost}</Text>
          </View>
          <View style={styles.detailsContainer}>
            <Text style={styles.label}>Notes:</Text>
            <Text style={styles.value}>{item.notes}</Text>
          </View>
        </>
      )}
      {!item.maintainance_type && (
        <>
          <View style={styles.detailsContainer}>
            <Text style={styles.label}>Quantity:</Text>
            <Text style={styles.value}>{item.quantity}</Text>
          </View>
          <View style={styles.detailsContainer}>
            <Text style={styles.label}>Cost per Unit:</Text>
            <Text style={styles.value}>${item.cost_per_unit}</Text>
          </View>

          <View style={styles.detailsContainer}>
            <Text style={styles.label}>Fuel Station:</Text>
            <Text style={styles.value}>{item.fuel_station}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.detailsContainer}>
            <Text style={styles.label}>Total Cost:</Text>
            <Text style={styles.value}>${item.total_cost}</Text>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    borderBottomWidth: 1,
    paddingBottom: 10,
    marginBottom: 20,
    borderColor: "#ccc",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color:'black'
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 10,
  },
  label: {
    fontWeight: "bold",
    fontSize: 15,
    flex:0.4
  },
  value: {
    flexShrink: 1,
    fontSize: 15,
    flex:0.6

  },
  separator: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
  },
});

export default MaintenanceDetails;
