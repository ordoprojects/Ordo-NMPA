import {
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  Pressable,
  Alert,
} from "react-native";
import styles from "./style";
import React, { useContext, useState, useEffect } from "react";
import AntDesign from "react-native-vector-icons/AntDesign";
import Colors from "../../constants/Colors";
import { AuthContext } from "../../Context/AuthContext";
import { Dropdown } from "react-native-element-dropdown";
import LinearGradient from "react-native-linear-gradient";
import { Dimensions } from "react-native";
import { ms, hs, vs } from "../../utils/Metrics";
import Entypo from "react-native-vector-icons/Entypo";
import { TimePickerModal } from "react-native-paper-dates";
import Toast from "react-native-simple-toast";

// Get the screen height
const screenHeight = Dimensions.get("window").height;

const AssignRoutes = ({ navigation }) => {
  const { userData } = useContext(AuthContext);
  const [isFocus, setIsFocus] = useState(false);
  const [driver, setDriver] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [distance, setDistance] = useState("");
  const [fuelConsumed, setFuelConsumed] = useState("");

  const [driverDrop, setDriverDrop] = useState([]);
  const [vehicleDrop, setVehicleDrop] = useState([]);
  const [sourceDrop, setSourceDrop] = useState([]);
  const [destinationDrop, setDestinationDrop] = useState([]);

  const [visible, setVisible] = React.useState(false);
  const [visible1, setVisible1] = React.useState(false);
  const [isFocus3, setIsFocus3] = useState(false);

  const onDismiss = React.useCallback(() => {
    setVisible(false);
  }, [setVisible]);

  const onDismiss1 = React.useCallback(() => {
    setVisible1(false);
  }, [setVisible1]);

  const onConfirm = React.useCallback(
    ({ hours, minutes }) => {
      setVisible(false);
      const StartTime = formatTime(hours, minutes);
      setStartTime(StartTime);
    },
    [setVisible]
  );

  const onConfirm1 = React.useCallback(
    ({ hours, minutes }) => {
      setVisible1(false);
      const EndTime = formatTime(hours, minutes);
      setEndTime(EndTime);
    },
    [setVisible1]
  );

  useEffect(() => {
    driverDropdown();
    VehicleDropdown();
    RoutesDropdown();
  }, []);

  // format time
  const formatTime = (hours, minutes, seconds = 0) => {
    const date = new Date(0, 0, 0, hours, minutes, seconds);
    date.setUTCHours(hours);
    date.setUTCMinutes(minutes);
    date.setUTCSeconds(seconds);

    return date.toTimeString().slice(0, 8);
  };

  //   input label

  const InputWithLabel = ({ title, value, onPress }) => {
    const textColor = !value ? "#cecece" : "black";
    return (
      <View>
        <Text style={styles.labelText}>{title}</Text>
        <Pressable style={{ ...styles.inputContainer }} onPress={onPress}>
          <Text style={{ ...styles.input2, color: textColor }}>
            {value ? value : "Start Time"}
          </Text>
          <AntDesign
            name="clockcircleo"
            size={20}
            color={Colors.primary}
            style={{ marginRight: 10 }}
          />
        </Pressable>
      </View>
    );
  };

  const InputWithLabel1 = ({ title, value, onPress }) => {
    const textColor = !value ? "#cecece" : "black";
    return (
      <View>
        <Text style={styles.labelText}>{title}</Text>
        <Pressable style={{ ...styles.inputContainer }} onPress={onPress}>
          <Text style={{ ...styles.input2, color: textColor }}>
            {value ? value : "End Time"}
          </Text>
          <AntDesign
            name="clockcircleo"
            size={20}
            color={Colors.primary}
            style={{ marginRight: 10 }}
          />
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
      // console.log("hkdgjhahsgfhjsf",result)

      const driver = result.driver.map((brand) => {
        return {
          label: brand.label,
          value: brand.value,
        };
      });

      setDriverDrop(driver);
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

      const vehicle = result.vehicles.map((types) => {
        return {
          label: types.label,
          value: types.value,
        };
      });

      // console.log("vehiiiii", result);

      setVehicleDrop(vehicle);
    } catch (error) {
      console.log("error", error);
    }
  };

  const RoutesDropdown = async (id) => {
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
        "https://gsidev.ordosolution.com/api/locationlist/",
        requestOptions
      );
      const result = await response.json();
      const source = result.locations.map((brand) => {
        return {
          label: brand.label,
          value: brand.value,
        };
      });

      setSourceDrop(source);

      const destination = result.locations.map((brand) => {
        return {
          label: brand.label,
          value: brand.value,
        };
      });

      setDestinationDrop(destination);
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleSubmit = async () => {
    if (
      !source ||
      !destination ||
      !startTime ||
      !endTime ||
      !distance ||
      !fuelConsumed ||
      !driver ||
      !vehicle
    ) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${userData.token}`);
    myHeaders.append("Content-Type", "application/json");
    console.log("gfghgfgfgf", userData.token);

    var raw = JSON.stringify({
      start_location: source,
      end_location: destination,
      start_time: startTime,
      end_time: endTime,
      distance_traveled: distance,
      fuel_consumed: fuelConsumed,
      driverid: driver,
      vehicleid: vehicle,
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
        "https://gsidev.ordosolution.com/api/trip/",
        requestOptions
      );
      const result = await response.json();

      console.log("Assign Routes:", result);
      Toast.show("sign Routes added successfully", Toast.LONG);

      navigation.goBack();
    } catch (error) {
      console.log("error", error);
    }
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
          height: "12%",
          alignItems: "center",
          alignContent: "center",
          textAlign: "center",
        }}
      >
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
          Assign Routes
        </Text>
        <View>
          <Text> </Text>
        </View>
      </View>
      <View
        style={{
          height: "88%",
          backgroundColor: "#f5f5f5",
          width: "100%",
          borderTopEndRadius: 50,
          borderTopStartRadius: 50,
          padding: "5%",
          flexDirection: "column",
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <View style={{ flex: 0.2 }}>
            <Image
              style={{
                marginRight: 1,
                height: "88%",
                width: "70%",
                resizeMode: "contain",
                marginTop: 10,
              }}
              source={require("../../assets/images/assign.png")}
            />
          </View>

          <View style={{ flex: 0.9, marginTop: "3%" }}>
            {driver && (
              <TouchableOpacity
                onPress={() => setDriver(null)}
                style={{ position: "absolute", left: "-20%", top: "0%" }}
              >
                <Entypo name="check" size={32} color="green" />
              </TouchableOpacity>
            )}
            <Text style={{ ...styles.label1 }}>Select Driver</Text>

            <Dropdown
              //    isFocus && { borderColor: 'blue' }
              style={[styles.dropdown]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              placeholderTextColor="#cecece"
              data={driverDrop}
              search
              maxHeight={400}
              labelField="label"
              valueField="value"
              placeholder={!isFocus3 ? "Select Driver" : "..."}
              searchPlaceholder="Search..."
              value={driver}
              onFocus={() => setIsFocus3(true)}
              onBlur={() => setIsFocus3(false)}
              onChange={(item) => {
                setDriver(item.value);
                setIsFocus3(false);
              }}
              renderLeftIcon={() => (
                <AntDesign
                  style={styles.icon}
                  // color={isFocus ? 'blue' : '#c3c3c3'}
                  color="#c3c3c3"
                  name="Safety"
                  size={20}
                />
              )}
            />

            <View style={{ top: "0.5%" }}>
              {vehicle && (
                <TouchableOpacity
                  onPress={() => setVehicle(null)}
                  style={{ position: "absolute", left: "-20%", top: "0%" }}
                >
                  <Entypo name="check" size={32} color="green" />
                </TouchableOpacity>
              )}
            </View>

            <Text style={{ ...styles.label1 }}>Select Vehicle</Text>

            <Dropdown
              style={[styles.dropdown]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              placeholderTextColor="#cecece"
              iconStyle={styles.iconStyle}
              data={vehicleDrop}
              search
              maxHeight={400}
              labelField="label"
              valueField="value"
              placeholder={!isFocus ? "Select Vehicle" : "..."}
              searchPlaceholder="Search..."
              value={vehicle}
              onChange={(item) => {
                setVehicle(item.value);
              }}
              renderLeftIcon={() => (
                <AntDesign
                  style={styles.icon}
                  color="#c3c3c3"
                  name="Safety"
                  size={20}
                />
              )}
            />

            <View style={{ top: "0.5%" }}>
              {source && destination && (
                <TouchableOpacity
                  onPress={() => {
                    setSource(null), setDestination(null);
                  }}
                  style={{ position: "absolute", left: "-20%", top: "0%" }}
                >
                  <Entypo name="check" size={32} color="green" />
                </TouchableOpacity>
              )}
            </View>

            <Text style={{ ...styles.label1 }}>Select Routes</Text>

            <Dropdown
              style={[styles.dropdownSD]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              placeholderTextColor="#cecece"
              iconStyle={styles.iconStyle}
              data={sourceDrop}
              search
              maxHeight={400}
              labelField="label"
              valueField="value"
              placeholder={!isFocus ? "Select Source" : "..."}
              searchPlaceholder="Search..."
              value={source}
              onChange={(item) => {
                setSource(item.value);
              }}
              renderLeftIcon={() => (
                <AntDesign
                  style={styles.icon}
                  color="#c3c3c3"
                  name="Safety"
                  size={20}
                />
              )}
            />

            <Dropdown
              style={{ ...styles.dropdownSD, marginBottom: "6%" }}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              placeholderTextColor="#cecece"
              iconStyle={styles.iconStyle}
              data={destinationDrop}
              search
              maxHeight={400}
              labelField="label"
              valueField="value"
              placeholder={!isFocus ? "Select Destination" : "..."}
              searchPlaceholder="Search..."
              value={destination}
              onChange={(item) => {
                setDestination(item.value);
              }}
              renderLeftIcon={() => (
                <AntDesign
                  style={styles.icon}
                  color="#c3c3c3"
                  name="Safety"
                  size={20}
                />
              )}
            />

            <View style={{ top: "-1%" }}>
              {startTime && endTime && (
                <TouchableOpacity
                  onPress={() => {
                    setStartTime(null), setEndTime(null);
                  }}
                  style={{ position: "absolute", left: "-20%", top: "10%" }}
                >
                  <Entypo name="check" size={32} color="green" />
                </TouchableOpacity>
              )}
            </View>

            <View style={{ flexDirection: "row", flex: 0.95, gap: 5 }}>
              <View style={{ flex: 0.5 }}>
                <InputWithLabel
                  title="Start Time"
                  value={startTime}
                  onPress={() => setVisible(true)}
                />

                <TimePickerModal
                  visible={visible}
                  onDismiss={onDismiss}
                  onConfirm={onConfirm}
                  hours={12} // default: current hours
                  minutes={14} // default: current minutes
                  label="Select time" // optional, default 'Select time'
                  cancelLabel="Cancel" // optional, default: 'Cancel'
                  confirmLabel="Ok" // optional, default: 'Ok'
                  animationType="fade" // optional, default is 'none'
                  inputFontSize={50}
                />
              </View>

              <View style={{ flex: 0.5 }}>
                <InputWithLabel1
                  title="End Time"
                  value={endTime}
                  onPress={() => setVisible1(true)}
                />

                <TimePickerModal
                  visible={visible1}
                  onDismiss={onDismiss1}
                  onConfirm={onConfirm1}
                  cancelLabel="Cancel" // optional, default: 'Cancel'
                  confirmLabel="Ok" // optional, default: 'Ok'
                  animationType="fade" // optional, default is 'none'
                  inputFontSize={50}
                />
              </View>
            </View>

            <View style={{ top: "-1%" }}>
              {distance && (
                <TouchableOpacity
                  onPress={() => setDistance(null)}
                  style={{ position: "absolute", left: "-20%", top: "0%" }}
                >
                  <Entypo name="check" size={32} color="green" />
                </TouchableOpacity>
              )}
            </View>

            <Text style={{ ...styles.label1 }}>Distance Traveled</Text>
            <TextInput
              style={{ ...styles.textInput }}
              placeholder="Please enter distance traveled"
              placeholderTextColor="#cecece"
              value={distance}
              keyboardType="numeric"
              onChangeText={(text) => setDistance(text)}
            />
            <View style={{ top: "-1%" }}>
              {fuelConsumed && (
                <TouchableOpacity
                  onPress={() => setFuelConsumed(null)}
                  style={{ position: "absolute", left: "-20%", top: "0%" }}
                >
                  <Entypo name="check" size={32} color="green" />
                </TouchableOpacity>
              )}
            </View>

            <Text style={{ ...styles.label1 }}>Fuel Consumed</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Please enter fuel consumed"
              placeholderTextColor="#cecece"
              value={fuelConsumed}
              keyboardType="numeric"
              onChangeText={(text) => setFuelConsumed(text)}
            />
          </View>
        </View>

        <LinearGradient
          colors={Colors.linearColors}
          start={{ x: 1, y: 1 }}
         end={Colors.end}
          locations={Colors.location}
          style={{
            backgroundColor: Colors.primary,
            borderColor: Colors.primary,
            borderRadius: ms(25),
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            marginTop: "8%",
          }}
        >
          <TouchableOpacity
            style={styles.button1}
            onPress={handleSubmit}
            activeOpacity={0.8}
          >
            <Text style={styles.btnText1}>Assign</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </LinearGradient>
  );
};

export default AssignRoutes;
