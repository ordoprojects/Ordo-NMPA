import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Colors from "../../constants/Colors";
import AntDesign from "react-native-vector-icons/AntDesign"

const VehicleDetails = ({ navigation, route }) => {

  const { vehicle } = route.params;
console.log("vehicle details", vehicle)

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>


      <LinearGradient
        colors={Colors.linearColors}
        start={Colors.start} end={Colors.end}
        locations={Colors.ButtonsLocation}
        style={{
          flex: 6,
          // borderBottomLeftRadius: 40,
          // borderBottomRightRadius: 40,
        }}
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
            Vehicle Details
          </Text>
          <View>
            <TouchableOpacity style={styles.historyBtn}
              //  onPress={() => navigation.navigate("MaintenanceHistory")}
              onPress={() => navigation.navigate("AddVehicle", { screen: 'edit', details: vehicle })}

            >
              {/* <Image
                source={require("../../assets/images/history2.png")}
                style={{ height: 30, width: 30 }}
              /> */}
              <AntDesign name="edit" size={22} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        <Image
          style={{
            height: "25%",
            width: "70%",
            resizeMode: "contain",
            alignSelf: "center",
          }}
          source={require("../../assets/images/box_truck.png")}
        />
        <View style={{ alignItems: "center", marginTop: 10 }}>
          <View
            style={{
              width: "80%",
              height: 1,
              backgroundColor: "#C3B3C3",
              marginBottom: "2%",
            }}
          />
        </View>
                <ScrollView style={{}}>
        

        <View style={styles.rowView}>
          <View style={styles.column}>
            <Text style={styles.label}>Registration No</Text>
            <Text style={styles.value}>{vehicle.registration_no}</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Vehicle type</Text>
            <Text style={styles.value}>{vehicle.vehicle_type}</Text>
          </View>

          <View style={styles.column}>
            <Text style={styles.label}>Vehicle Model</Text>
            <Text style={styles.value}>{vehicle.model}</Text>
          </View>
        </View>

        <View style={styles.rowView}>
          <View style={styles.column}>
            <Text style={styles.label}>Chassis No</Text>
            <Text style={styles.value}>{vehicle.chassis_number}</Text>
          </View>

          <View style={styles.column}>
            <Text style={styles.label}>Fuel type</Text>
            <Text style={styles.value}>{vehicle.fuel_type}</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Year</Text>
            <Text style={styles.value}>{vehicle.year}</Text>
          </View>
        </View>

        <View style={styles.rowView}>
          <View style={styles.column}>
            <Text style={styles.label}>Emission start</Text>
            <Text style={styles.value}>{vehicle.emission_start_date}</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Emission end </Text>
            <Text style={styles.value}>{vehicle.emission_end_date}</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Company</Text>
            <Text style={styles.value}>{vehicle.company_name}</Text>
          </View>
        </View>

        <View style={styles.rowView}>
          <View style={styles.column}>
            <Text style={styles.label}>Insurance start</Text>
            <Text style={styles.value}>{vehicle.insurance_start_date}</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Insurance end</Text>
            <Text style={styles.value}>{vehicle.insurance_end_date}</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Status</Text>
            <Text style={styles.value}>{vehicle.status}</Text>
          </View>
        </View>

        <View style={styles.rowView}>
          <View style={styles.column}>
            <Text style={styles.label}>FC start</Text>
            <Text style={styles.value}>{vehicle.fc_start_date}</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>FC end</Text>
            <Text style={styles.value}>{vehicle.fc_end_date}</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Engine No.</Text>
            <Text style={styles.value}>{vehicle.engine_number}</Text>
          </View>
        </View>

        <View style={styles.rowView}>
          <View style={styles.column}>
            <Text style={styles.label}>Permit start</Text>
            <Text style={styles.value}>{vehicle.permit_start_date}</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Permit end</Text>
            <Text style={styles.value}>{vehicle.permit_end_date}</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Truck Type</Text>
            <Text style={styles.value}>{vehicle.truck_type}</Text>
          </View>
        </View>

        <View style={styles.rowView}>
          <View style={styles.column}>
            <Text style={styles.label}>Tax start</Text>
            <Text style={styles.value}>{vehicle.tax_start_date}</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Tax end</Text>
            <Text style={styles.value}>{vehicle.tax_end_date}</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Vehicle Capacity</Text>
            <Text style={styles.value}>{vehicle.vehicle_capacity}</Text>
          </View>
        </View>
        
        <View style={styles.rowView}>
          <View style={styles.column}>
            <Text style={styles.label}>Last maintenance date</Text>
            <Text style={styles.value}>{vehicle.last_maintenance_date}</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Current odometer</Text>
            <Text style={styles.value}>{vehicle.current_odometer}</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>GVW</Text>
            <Text style={styles.value}>{vehicle.gvw}</Text>
          </View>
          
        </View>

        <View style={styles.rowView}>
          <View style={styles.column}>
            <Text style={styles.label}>Driver </Text>
            <Text style={styles.value}>{vehicle.driver?.name}</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Vehicle Make</Text>
            <Text style={styles.value}>{vehicle?.make}</Text>
          </View>
        
          
        </View>

        </ScrollView>
      </LinearGradient>

   
    </View>
  );
};

export default VehicleDetails;

const styles = StyleSheet.create({
  bottomBtn: {
    flex: 1,
    backgroundColor: "#050537",
    borderRadius: 10,
    marginHorizontal: "3%",
    marginVertical: "6%",
    marginBottom: "3%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
  },
  bottomBtnTxt: {
    color: "white",
    fontSize: 19,
    fontWeight: "600",
  },
  headerView: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    height: "10%",
    alignItems: "center",
    alignContent: "center",
    textAlign: "center",
  },
  historyBtn: {
    paddingVertical: 5,
    paddingHorizontal: "3%",
    borderRadius: 5,
    marginRight: 7,
  },
  rowView: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginHorizontal: "1%",
    marginVertical: "4%",
  },
  column: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
  },
  label: {
    color: "#C3B3C3",
    textAlign: "center",
    fontWeight: "500",
  },
  value: {
    color: "white",
    fontWeight: "600",
    fontSize: 15,
    textAlign: "center",
  },
});
