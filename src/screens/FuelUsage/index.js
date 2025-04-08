import React from "react";
import {
  StyleSheet,
  Text,
  View,
  BackHandler,
  Alert,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  ScrollView, Pressable
} from "react-native";
import globalStyles from "../../styles/globalStyles";
import LinearGradient from "react-native-linear-gradient";
import Colors from "../../constants/Colors";
import { useState, useContext, useRef, useEffect } from "react";
import { AuthContext } from "../../Context/AuthContext";
import { DatePickerModal, DatePickerInput } from "react-native-paper-dates";
import { Dropdown } from "react-native-element-dropdown";
import moment from "moment";
import Toast from 'react-native-simple-toast';
import { LoadingView } from "../../components/LoadingView";
import { TextInput as TextInput1 } from "react-native-paper";
import { ms, hs, vs } from "../../utils/Metrics";



const FuelUsage = ({ navigation, route }) => {

  // const { vehicleID } = route?.params

  const [driverDrop, setDriverDrop] = useState([]);
  const [fuelDrop, setFuelDrop] = useState([]);
  const [vehicleDrop, setVehicleDrop] = useState([]);

  const [visible2, setVisible2] = React.useState(false);
  const { token, userData } = useContext(AuthContext);
  const [fuelDate, setFuelDate] = useState("");
  const [fuelStation, setFuelStation] = useState("");
  const [costPerUnit, setCostPerUnit] = useState("");
  const [quantity, setQuantity] = useState("");
  const [totalCost, setTotalCost] = useState("");
  const [fuelType, setFuelType] = useState([]);
  const [driverType, setdriverType] = useState([]);
  const [isFocus2, setIsFocus2] = useState(false);
  const [isFocus3, setIsFocus3] = useState(false);
  const [vehicleID, setVehicleId] = useState('');
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    driverDropdown();
    fuelDropdown();
    VehicleDropdown();
  }, []);

  const onDismiss2 = React.useCallback(() => {
    setVisible2(false);
  }, [setVisible2]);

  const onChange2 = React.useCallback(({ date }) => {
    setVisible2(false);
    const EmStart = moment(date).format("DD/MM/YYYY");
    setFuelDate(EmStart);
  }, []);

  useEffect(() => {
    if (quantity && costPerUnit && !isNaN(quantity) && !isNaN(costPerUnit)) {
      const calculatedTotalCost = parseFloat(quantity) * parseFloat(costPerUnit);
      setTotalCost(calculatedTotalCost.toFixed(2)); 
    } else {
      setTotalCost("");
    }
  }, [quantity, costPerUnit]);

  const InputWithLabel2 = ({ title, value, onPress }) => {
    // const textColor = !value ? "#cecece" : "black";
    const textColor = Colors.primary
    return (
      <View>
        {/* <Text style={styles.labelText}>{title}</Text> */}
        <Pressable style={{ ...styles.inputContainer }} onPress={onPress}>
          <Text style={{ ...styles.input2, color: textColor }}>
            {value ? value : "Select Maintenance Date"}
          </Text>
          <Image
            style={{ width: 20, height: 20, marginRight: 15 }}
            source={require("../../assets/images/calendar.png")}
          ></Image>
        </Pressable>
      </View>
    );
  };

  const driverDropdown = async (id) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${userData.token}`);

    var raw = "";

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    try {
      const response = await fetch(
        "https://gsidev.ordosolution.com/api/driverlist/",
        requestOptions
      );
      const result = await response.json();
      console.log("hkdgjhahsgfhjsf", userData.token)
      const driverType = result.driver.map((brand) => {
        return {
          label: brand.label,
          value: brand.value,
        };
      });

      setDriverDrop(driverType);

    } catch (error) {
      console.log("error", error);
    }
  };

  const fuelDropdown = async (id) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${userData.token}`);

    var raw = "";

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    try {
      const response = await fetch(
        "https://gsidev.ordosolution.com/api/choices/",
        requestOptions
      );
      const result = await response.json();
      // console.log("hkdgjhahsgfhjsf",result)
      const fuelDrop = result.fuel_types.map((types) => {
        return {
          label: types.label,
          value: types.value,
        };
      });

      setFuelDrop(fuelDrop);
      // console.log(result)

    } catch (error) {
      console.log("error", error);
    }
  };

  const VehicleDropdown = async (id) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${userData.token}`);

    var raw = "";

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    try {
      const response = await fetch(
        "https://gsidev.ordosolution.com/api/vehiclelist/",
        requestOptions
      );
      const result = await response.json();
      // console.log("hkdgjhahsgfhjsf",result)
      const vehicleDrop = result.vehicles.map((types) => {
        return {
          label: types.label,
          value: types.value,
        };
      });

      setVehicleDrop(vehicleDrop);
      // console.log(result)

    } catch (error) {
      console.log("error", error);
    }
  };

  const handleSubmit = async () => {

    if (!driverType || !vehicleID || !fuelDate || !fuelStation || !quantity || !costPerUnit || !totalCost || !fuelType) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }


    setLoading(true);
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${userData.token}`);
    myHeaders.append("Content-Type", "application/json");
    console.log("gfghgfgfgf", userData.token);

    var raw = JSON.stringify({
      dri_id: driverType,
      veh_id: vehicleID,
      fuel_date: moment(fuelDate, "DD/MM/YYYY").format("YYYY-MM-DD"),
      fuel_station: fuelStation,
      quantity: quantity,
      cost_per_unit: costPerUnit,
      total_cost: totalCost,
      fuel_type: fuelType
    });

    // console.log("base 64", base64img);
    console.log("raw", raw);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    try {
      const response = await fetch(
        "https://gsidev.ordosolution.com/api/fuelusage/",
        requestOptions
      );
      const result = await response.json();

      console.log("Maintenance Result:", result);
      Toast.show("Fuel usage data added successfully", Toast.LONG);

      navigation.goBack();
    } catch (error) {
      console.log("error", error);
    }
    setLoading(false);

  };


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
          paddingHorizontal: "5%",
          flex: 1,
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require("../../assets/images/Refund_back.png")}
            style={{ height: 30, width: 30 }}
          />
        </TouchableOpacity>
        <Text
          style={{
            fontFamily: "AvenirNextCyr-Medium",
            fontSize: 19,
            color: "white",
          }}
        >
          Fuel Usage
        </Text>
        <View style={{ width: "6%" }} />
      </View>

      <View
        style={{
          height: "90%",
          backgroundColor: "#f5f5f5",
          width: "100%",
          borderTopEndRadius: 20,
          borderTopStartRadius: 20,
          padding: "6%",
          paddingTop: "6%",
          justifyContent: "space-between",
        }}
      >
        <ScrollView showsHorizontalScrollIndicator={false}>
          <View>

            {/* <Text style={styles.label}>Vehicle</Text> */}
            <Dropdown
              style={[styles.dropdown]}
              containerStyle={styles.dropdownContainer}
              placeholderStyle={styles.placeholderStyle}
              searchPlaceholder="Search"
              selectedTextStyle={styles.selectedTextStyle}
              itemTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={vehicleDrop}
              maxHeight={400}
              labelField="label"
              valueField="value"
              placeholder={!isFocus3 ? "Please select the vehicle" : "..."}
              //searchPlaceholder="Search..."
              value={vehicleID}
              onFocus={() => setIsFocus3(true)}
              onBlur={() => setIsFocus3(false)}
              onChange={(item) => {
                setVehicleId(item.value);
                setIsFocus3(false);
              }}
            />


            {/* <Text style={styles.label}>Driver Id</Text> */}
            <Dropdown
              style={[styles.dropdown]}
              containerStyle={styles.dropdownContainer}
              placeholderStyle={styles.placeholderStyle}
              searchPlaceholder="Search"
              selectedTextStyle={styles.selectedTextStyle}
              itemTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={driverDrop}
              maxHeight={400}
              labelField="label"
              valueField="value"
              placeholder={!isFocus3 ? "Please select the driver" : "..."}
              //searchPlaceholder="Search..."
              value={driverType}
              onFocus={() => setIsFocus3(true)}
              onBlur={() => setIsFocus3(false)}
              onChange={(item) => {
                setdriverType(item.value);
                setIsFocus3(false);
              }}
            />
            <View style={{}}>
              <InputWithLabel2
                title="Maintenance Date"
                value={fuelDate}
                onPress={() => setVisible2(true)}
              />

              <DatePickerModal
                mode="single"
                visible={visible2}
                onDismiss={onDismiss2}
                // date={date}
                onConfirm={onChange2}
                saveLabel="Save" // optional
                label="Select date" // optional
                animationType="slide" // optional, default is 'slide' on ios/android and 'none' on web
              />
            </View>
            {/* <Text style={styles.label}>Fuel Station</Text> */}
            {/* <TextInput
              style={styles.textInput}
              placeholder="Please enter the fuel station"
              placeholderTextColor={Colors.primary}
              value={fuelStation}
              onChangeText={(text) => setFuelStation(text)}
            /> */}
            <TextInput1
              mode="outlined"
              label="Fuel Station"
              value={fuelStation}
              theme={{ colors: { onSurfaceVariant: "#4b0482" } }}
              activeOutlineColor="#4b0482"
              outlineColor="#B6B4B4"
              textColor="#4b0482"
              onChangeText={(text) => setFuelStation(text)}
              returnKeyType="done"
              blurOnSubmit={false}
              outlineStyle={{ borderRadius: 10 }}
              style={{ marginBottom: "5%", height: 55, backgroundColor: "white" }}
            />
            {/* <Text style={styles.label}>Fuel Type</Text> */}
            <Dropdown
              style={[styles.dropdown]}
              containerStyle={styles.dropdownContainer}
              placeholderStyle={styles.placeholderStyle}
              searchPlaceholder="Search"
              selectedTextStyle={styles.selectedTextStyle}
              itemTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={fuelDrop}
              maxHeight={400}
              labelField="label"
              valueField="value"
              placeholder={!isFocus2 ? "Please select your fuel type" : "..."}
              //searchPlaceholder="Search..."
              value={fuelType}
              onFocus={() => setIsFocus2(true)}
              onBlur={() => setIsFocus2(false)}
              onChange={(item) => {
                setFuelType(item.value);
                setIsFocus2(false);
              }}
            />

            {/* <Text style={styles.label}>Quantity</Text> */}
            {/* <TextInput
              style={styles.textInput}
              placeholder="Please enter the quantity"
              placeholderTextColor={Colors.primary}
              value={quantity}
              onChangeText={(text) => setQuantity(text)}
            /> */}
            <TextInput1
              mode="outlined"
              label="Quantity"
              value={quantity}
              theme={{ colors: { onSurfaceVariant: "#4b0482" } }}
              activeOutlineColor="#4b0482"
              outlineColor="#B6B4B4"
              textColor="#4b0482"
              onChangeText={(text) => setQuantity(text)}
              returnKeyType="done"
              blurOnSubmit={false}
              outlineStyle={{ borderRadius: 10 }}
              style={{ marginBottom: "5%", height: 55, backgroundColor: "white" }}
            />

            {/* <Text style={styles.label}>Cost Per Unit</Text> */}
            {/* <TextInput
              style={styles.textInput}
              placeholder="Please enter the cost per unit"
              placeholderTextColor={Colors.primary}
              value={costPerUnit}
              onChangeText={(text) => setCostPerUnit(text)}
            /> */}
            <TextInput1
              mode="outlined"
              label="Cost Per Unit"
              value={costPerUnit}
              theme={{ colors: { onSurfaceVariant: "#4b0482" } }}
              activeOutlineColor="#4b0482"
              outlineColor="#B6B4B4"
              textColor="#4b0482"
              onChangeText={(text) => setCostPerUnit(text)}
              returnKeyType="done"
              blurOnSubmit={false}
              outlineStyle={{ borderRadius: 10 }}
              style={{ marginBottom: "5%", height: 55, backgroundColor: "white" }}
            />

            {/* <Text style={styles.label}>Total Cost</Text> */}
            {/* <TextInput
              style={styles.textInput}
              placeholder="Please enter the total cost"
              placeholderTextColor={Colors.primary}
              value={totalCost}
              onChangeText={(text) => setTotalCost(text)}
            /> */}
            <TextInput1
              mode="outlined"
              label="Total Cost"
              value={totalCost}
              theme={{ colors: { onSurfaceVariant: "#4b0482" } }}
              activeOutlineColor="#4b0482"
              outlineColor="#B6B4B4"
              textColor="#4b0482"
              onChangeText={(text) => setTotalCost(text)}
              returnKeyType="done"
              blurOnSubmit={false}
              outlineStyle={{ borderRadius: 10 }}
              style={{ marginBottom: "5%", height: 55, backgroundColor: "white" }}
            />
          </View>
        </ScrollView>
        <LinearGradient
                    colors={Colors.linearColors}
                    start={Colors.start}
                    end={Colors.end}
                    locations={Colors.ButtonsLocation}
                    style={{
                
                        borderRadius: ms(15),
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "row",
                        marginTop: "8%",
                    }}
                >
        <TouchableOpacity style={styles.buttonContainer} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
        </LinearGradient>
      </View>

      <LoadingView visible={loading} message="Please Wait ..." />

    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  textInput: {
    borderColor: "#dedede",
    borderWidth: 1,
    backgroundColor: "white",
    height: 50,
    marginBottom: "5%",
    padding: "2%",
    paddingLeft: "2%",

    fontFamily: "AvenirNextCyr-Medium",
    borderRadius: 10,
  },
  label: {
    fontSize: 16,
    color: Colors.primary,
    fontFamily: "AvenirNextCyr-Medium",
  },
  buttonContainer: {
    height: 50,
    // borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    width:'100%'
    // backgroundColor: Colors.primary,
  },
  buttonText: {
    fontFamily: "AvenirNextCyr-Medium",
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  scrollViewContent: {
    flexGrow: 1,
    backgroundColor: "#f5f5f5",
    borderTopEndRadius: 50,
    borderTopStartRadius: 50,
    padding: 20,
    paddingTop: 20,
    paddingBottom: 60,
  },
  placeholderStyle: {
    fontSize: 14,
    fontFamily: "AvenirNextCyr-Medium",
    color: Colors.primary,
    // backgroundColor:'white'
  },
  dropdownContainer: {
    backgroundColor: "white",
    // color:'white'
  },
  selectedTextStyle: {
    fontSize: 16,
    fontFamily: "AvenirNextCyr-Medium",
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  labelText: {
    fontFamily: "AvenirNextCyr-Medium",
    color: Colors.primary,
    fontSize: 16,
  },
  inputContainer: {
    borderColor: "#B6B4B4",
    borderWidth: 1,
    backgroundColor: "white",
    height: 55,
    marginBottom: 15,
    fontFamily: "AvenirNextCyr-Medium",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 10,
    // height: "60%",
    width: "100%",
  },
  dropdown: {
    height: 55,
    borderColor: "#B6B4B4",
    borderWidth: 1,
    //borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: "5%",
    borderRadius: 10,
    backgroundColor: "white",
  },
  input2: {
    fontFamily: "AvenirNextCyr-Medium",
    padding: 8,
    flex: 1,
  },
});

export default FuelUsage;
