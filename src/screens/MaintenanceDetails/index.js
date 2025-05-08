import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";

const MaintenanceDetails = ({ route, navigation }) => {
  // Extract data from the route params
  const { item,key } = route.params;


  console.log("🚀 ~ MaintenanceDetails ~ item:", item,key)

  const formatTime = (timeString) => {
    if (!timeString) return "";
    const [hour, minute] = timeString.split(":");
    const date = new Date();
    date.setHours(hour);
    date.setMinutes(minute);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };
  

  return (
    <View style={styles.container}>
      <View style={{flexDirection:'row',justifyContent:'space-between'}}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{ marginBottom: "5%" }}
      >
        <AntDesign name="arrowleft" size={25} color="black" />
      </TouchableOpacity>
      <TouchableOpacity
  style={styles.historyBtn}
  onPress={() => {
    let screenName;

    if (key === "tyre") {
      screenName = "Tire";
    } else if (key === "trip") {
      screenName = "Trip";
    } else if (item?.maintainance_type) {
      screenName = "Maintenance";
    } else {
      screenName = "FuelUsage";
    }

    navigation.navigate(screenName, { screen: 'edit', details: item }); // Pass item as details
  }}
>
  <AntDesign name="edit" size={22} color="black" />
</TouchableOpacity>

                  </View>
      <View style={styles.header}>
     <Text style={styles.title}>
  {key === "tyre"
    ? "Tyre"
    : key === "trip"
    ? "Trip"
    : item?.maintainance_type
    ? "Maintenance"
    : "Fuel"} Details
</Text>

      </View>
      {key !== "tyre" && key !== "trip" && (
  <>
    <View style={styles.detailsContainer}>
      <Text style={styles.label}>
        {item?.maintainance_type ? "Maintenance Type" : "Fuel Type"}:
      </Text>
      <Text style={styles.value}>
        {item?.maintainance_type ? item?.maintainance_type.join(", ") : item?.fuel_type}
      </Text>
    </View>

    <View style={styles.detailsContainer}>
      <Text style={styles.label}>
        {item?.maintainance_date ? "Maintenance Date" : "Fuel Date"}:
      </Text>
      <Text style={styles.value}>
        {item?.maintainance_date?.split("-").reverse().join("-") 
|| item?.fuel_date?.split("-").reverse().join("-") }
      </Text>
    </View>
  </>
)}

      {item?.maintainance_type && key !== "tyre" && key !== "trip" &&(
        <>
          <View style={styles.detailsContainer}>
            <Text style={styles.label}>Cost:</Text>
            <Text style={styles.value}>₹{item?.cost}</Text>
          </View>
          <View style={styles.detailsContainer}>
            <Text style={styles.label}>Notes:</Text>
            <Text style={styles.value}>{item?.notes}</Text>
          </View>
          <View style={styles.detailsContainer}>
            <Text style={styles.label}>KM:</Text>
            <Text style={styles.value}>{item?.km} Km</Text>
          </View>
          <View style={styles.detailsContainer}>
            <Text style={styles.label}>Particulars:</Text>
            <Text style={styles.value}>{item?.particulars}</Text>
          </View>
          <View style={styles.detailsContainer}>
            <Text style={styles.label}>Quantity:</Text>
            <Text style={styles.value}>{item?.qty}</Text>
          </View>
          <View style={styles.detailsContainer}>
            <Text style={styles.label}>Tyre No.:</Text>
            <Text style={styles.value}>{item?.tyres_no?.name}</Text>
          </View>
          <View style={styles.detailsContainer}>
            <Text style={styles.label}>Party Name:</Text>
            <Text style={styles.value}>{item?.party_name}</Text>
          </View>
          <View style={styles.detailsContainer}>
            <Text style={styles.label}> Bill No.:</Text>
            <Text style={styles.value}>{item?.bill_number}</Text>
          </View>
          <View style={styles.detailsContainer}>
            <Text style={styles.label}>Location:</Text>
            <Text style={styles.value}>{item?.location}</Text>
          </View>
          <View style={styles.detailsContainer}>
            <Text style={styles.label}>Driver Name:</Text>
            <Text style={styles.value}>{item?.driver_no?.name}</Text>
          </View>

          <View style={styles.detailsContainer}>
            <Text style={styles.label}>Vehicle No.:</Text>
            <Text style={styles.value}>{item?.vehicle_no?.name}</Text>
          </View>
        </>
      )}
      {!item?.maintainance_type && key !== "tyre" && key !== "trip" &&(
        <>
          <View style={styles.detailsContainer}>
            <Text style={styles.label}>Quantity:</Text>
            <Text style={styles.value}>{item?.quantity}</Text>
          </View>
          <View style={styles.detailsContainer}>
            <Text style={styles.label}>Cost per Unit:</Text>
            <Text style={styles.value}>₹{item?.cost_per_unit}</Text>
          </View>

          <View style={styles.detailsContainer}>
            <Text style={styles.label}>Fuel Station:</Text>
            <Text style={styles.value}>{item?.fuel_station}</Text>
          </View>

          <View style={styles.detailsContainer}>
            <Text style={styles.label}> Bill No.:</Text>
            <Text style={styles.value}>{item?.invoice_no}</Text>
          </View>

          <View style={styles.detailsContainer}>
            <Text style={styles.label}> Odometer:</Text>
            <Text style={styles.value}>{item?.odometer1}</Text>
          </View>

          <View style={styles.detailsContainer}>
            <Text style={styles.label}> KM:</Text>
            <Text style={styles.value}>{item?.km}</Text>
          </View>

          <View style={styles.detailsContainer}>
            <Text style={styles.label}> Unit:</Text>
            <Text style={styles.value}>{item?.unit}</Text>
          </View>

          <View style={styles.detailsContainer}>
            <Text style={styles.label}> Rate:</Text>
            <Text style={styles.value}>{item?.rate}</Text>
          </View>

          <View style={styles.detailsContainer}>
            <Text style={styles.label}> Pump Name:</Text>
            <Text style={styles.value}>{item?.pump_name}</Text>
          </View>

          <View style={styles.detailsContainer}>
            <Text style={styles.label}> Location:</Text>
            <Text style={styles.value}>{item?.location}</Text>
          </View>

          <View style={styles.detailsContainer}>
            <Text style={styles.label}> Mileage:</Text>
            <Text style={styles.value}>{item?.mileage}</Text>
          </View>

          <View style={styles.detailsContainer}>
            <Text style={styles.label}>Date:</Text>
            <Text style={styles.value}>
  {item?.fuel_date ? item.fuel_date.split("-").reverse().join("-") : ""}
</Text>

          </View>
          <View style={styles.detailsContainer}>
            <Text style={styles.label}>Vehicle No.:</Text>
            <Text style={styles.value}>{item?.vehicle_registration_no}</Text>
          </View>

          <View style={styles.detailsContainer}>
            <Text style={styles.label}>Driver:</Text>
            <Text style={styles.value}>{item?.driver_name}</Text>
          </View>



          
          <View style={styles.separator} />
          <View style={styles.detailsContainer}>
            <Text style={styles.label}>Total Cost:</Text>
            <Text style={styles.value}>₹{item?.total_cost}</Text>
          </View>
        </>
      )}


{key==="tyre" && (
        <>
          <View style={styles.detailsContainer}>
            <Text style={styles.label}>Tyre No.:</Text>
            <Text style={styles.value}>{item?.tyre_number}</Text>
          </View>
          <View style={styles.detailsContainer}>
            <Text style={styles.label}>Inspection Date:</Text>
            <Text style={styles.value}>{item?.inspection_date}</Text>
          </View>

          <View style={styles.detailsContainer}>
            <Text style={styles.label}>Powdering Date:</Text>
            <Text style={styles.value}>{item?.powdering_date}</Text>
          </View>

          <View style={styles.detailsContainer}>
            <Text style={styles.label}>KM.:</Text>
            <Text style={styles.value}>{item?.km} Km</Text>
          </View>
          <View style={styles.detailsContainer}>
            <Text style={styles.label}>Brand:</Text>
            <Text style={styles.value}>{item?.brand}</Text>
          </View>

          <View style={styles.detailsContainer}>
            <Text style={styles.label}>Position:</Text>
            <Text style={styles.value}>{item?.position}</Text>
          </View>

          <View style={styles.detailsContainer}>
            <Text style={styles.label}>Date:</Text>
            <Text style={styles.value}>
  {item?.date ? item.date.split("-").reverse().join("-") : ""}
</Text>

          </View>
          <View style={styles.detailsContainer}>
            <Text style={styles.label}>Vehicle No.:</Text>
            <Text style={styles.value}>{item?.vehicle?.name}</Text>
          </View>

          <View style={styles.detailsContainer}>
            <Text style={styles.label}>Driver:</Text>
            <Text style={styles.value}>{item?.driver_no?.name}</Text>
          </View>



          
          {/* <View style={styles.separator} /> */}
          <View style={styles.detailsContainer}>
            <Text style={styles.label}>Life Percentage:</Text>
            <Text style={styles.value}>{item?.life_percentage}</Text>
          </View>
        </>
      )}


{key==="trip" && (
        <>
          <View style={styles.detailsContainer}>
            <Text style={styles.label}>Bill No.:</Text>
            <Text style={styles.value}>{item?.bill_no}</Text>
          </View>
          <View style={styles.detailsContainer}>
            <Text style={styles.label}>Billed To:</Text>
            <Text style={styles.value}>{item?.billed_to?.name} - {item?.billed_to?.['Customer name']} - {item?.billed_to?.user}</Text>
          </View>

          <View style={styles.detailsContainer}>
            <Text style={styles.label}>Dispatch From:</Text>
            <Text style={styles.value}>{item?.dispatch_from}</Text>
          </View>

          <View style={styles.detailsContainer}>
            <Text style={styles.label}>Dispatch To:</Text>
            <Text style={styles.value}>{item?.dispatch_to}</Text>
          </View>
          <View style={styles.detailsContainer}>
            <Text style={styles.label}>Opening KM:</Text>
            <Text style={styles.value}>{item?.opening_km} Km</Text>
          </View>

          <View style={styles.detailsContainer}>
            <Text style={styles.label}>Closing KM:</Text>
            <Text style={styles.value}>{item?.closing_km} Km</Text>
          </View>

          <View style={styles.detailsContainer}>
            <Text style={styles.label}>Freight Collected:</Text>
            <Text style={styles.value}>{item?.freight_collected}</Text>
          </View>
          <View style={styles.detailsContainer}>
            <Text style={styles.label}>Trip Incentive:</Text>
            <Text style={styles.value}>{item?.trip_incentive}</Text>
          </View>

          <View style={styles.detailsContainer}>
            <Text style={styles.label}>Start Time:</Text>
            <Text style={styles.value}>{formatTime(item?.start_time)}</Text>
          </View>

          <View style={styles.detailsContainer}>
            <Text style={styles.label}>End Time:</Text>
            <Text style={styles.value}>{formatTime(item?.end_time)}</Text>
          </View>


          <View style={styles.detailsContainer}>
            <Text style={styles.label}>Date:</Text>
            <Text style={styles.value}>
  {item?.date ? item.date.split("-").reverse().join("-") : ""}
</Text>

          </View>
          <View style={styles.detailsContainer}>
            <Text style={styles.label}>Vehicle No.:</Text>
            <Text style={styles.value}>{item?.vehicle?.name}</Text>
          </View>

          <View style={styles.detailsContainer}>
            <Text style={styles.label}>Driver:</Text>
            <Text style={styles.value}>{item?.driver?.name}</Text>
          </View>

          <View style={styles.detailsContainer}>
            <Text style={styles.label}>Total Running KM:</Text>
            <Text style={styles.value}>{item?.total_running} Km</Text>
          </View>
          
      {/* <View style={styles.separator} /> */}
          <View style={styles.detailsContainer}>
            <Text style={styles.label}>Fuel Consumed:</Text>
            <Text style={styles.value}>{item?.fuel_consumed}</Text>
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
