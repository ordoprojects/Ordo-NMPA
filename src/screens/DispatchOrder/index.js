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
  Pressable,
} from "react-native";
import globalStyles from "../../styles/globalStyles";
import LinearGradient from "react-native-linear-gradient";
import Colors from "../../constants/Colors";
import { useState, useContext, useRef, useEffect } from "react";
import { AuthContext } from "../../Context/AuthContext";
import { Dropdown } from "react-native-element-dropdown";
import moment from "moment";
import Toast from "react-native-simple-toast";

const DispatchOrder = ({ navigation, route }) => {
  const { userData } = useContext(AuthContext);
  const [typeDrop, setTypeDrop] = useState([]);
  const [typeDrop1, setTypeDrop1] = useState([]);
  const [isFocus, setIsFocus] = useState(false);

  const [maintainanceType, setMaintainancetype] = useState([]);
  const [maintainanceDate, setMaintainanceDate] = useState("");
  const [cost, setcost] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    MaintenanceDropdown();
  }, []);


  const handleSubmit = async () => {
    // Check if required fields are filled
    if (!maintainanceType || !maintainanceDate || !cost || !notes) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${userData.token}`);
    myHeaders.append("Content-Type", "application/json");
    console.log("gfghgfgfgf", userData.token);

    var raw = JSON.stringify({
      maintainance_type: maintainanceType,
      maintainance_date: moment(maintainanceDate, "DD/MM/YYYY").format(
        "YYYY-MM-DD"
      ),
      notes: notes,
      cost: cost,
    });

    console.log("raw", raw);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    try {
      const response = await fetch(
        "https://gsidev.ordosolution.com/api/maintainance/",
        requestOptions
      );
      const result = await response.json();

      console.log("Maintenance Result:", result);
      Toast.show("Maintenance data successfully", Toast.LONG);

      navigation.goBack();
    } catch (error) {
      console.log("error", error);
    }
  };

  const MaintenanceDropdown = async (id) => {
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
      console.log("hkdgjhahsgfhjsf", result);
      const typeDrop = result.maintainance_type.map((brand) => {
        return {
          label: brand.label,
          value: brand.value,
        };
      });

      setTypeDrop(typeDrop);

      const typeDrop1 = result.vehicle_types.map((types) => {
        return {
          label: types.label,
          value: types.value,
        };
      });
      console.log("mhh", typeDrop1);
      setTypeDrop1(typeDrop1);
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
          Maintenance
        </Text>
        <View style={{ width: "6%" }} />
      </View>
      <View
        style={{
          height: "88%",
          backgroundColor: "#f5f5f5",
          width: "100%",
          borderTopEndRadius: 50,
          borderTopStartRadius: 50,
          padding: "6%",
          paddingTop: "6%",
          justifyContent: "space-between",
        }}
      >
        <View>
          <Text style={styles.label}>Maintenance Type</Text>
          <Dropdown
            style={[styles.dropdown]}
            containerStyle={styles.dropdownContainer}
            placeholderStyle={styles.placeholderStyle}
            searchPlaceholder="Search"
            selectedTextStyle={styles.selectedTextStyle}
            itemTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={typeDrop}
            maxHeight={400}
            labelField="label"
            valueField="value"
            placeholder={!isFocus ? "Please select your vehicle type" : "..."}
            value={maintainanceType}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={(item) => { setMaintainancetype(item.value); setIsFocus(false);
            }}
          />
          <Text style={styles.label}>Cost</Text>
          <TextInput
            style={styles.textInput}
            value={cost}
            onChangeText={(text) => setcost(text)}
            placeholder="Please enter the cost"
            placeholderTextColor="#cecece"
          />
          <Text style={styles.label}>Note</Text>
          <TextInput
            style={styles.textInput}
            value={notes}
            onChangeText={(text) => setNotes(text)}
            placeholder="Please enter the note"
            placeholderTextColor="#cecece"
          />
        </View>

        <TouchableOpacity style={styles.buttonContainer} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
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

    fontFamily: "AvenirNextCyr-Thin",
    borderRadius: 10,
  },
  label: {
    fontSize: 16,
    color: Colors.primary,
    fontFamily: "AvenirNextCyr-Medium",
  },
  buttonContainer: {
    height: 50,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: "5%",
    backgroundColor: Colors.primary,
  },
  buttonText: {
    fontFamily: "AvenirNextCyr-Thin",
    color: "white",
    fontSize: 17,
    fontWeight: "500",
  },
  placeholderStyle: {
    fontSize: 14,
    fontFamily: "AvenirNextCyr-Thin",
    color: "#cecece",
  },
  dropdownContainer: {
    backgroundColor: "white",
  },
  selectedTextStyle: {
    fontSize: 16,
    fontFamily: "AvenirNextCyr-Thin",
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
    borderColor: "#cecece",
    borderWidth: 1,
    backgroundColor: "white",
    marginBottom: 5,
    fontFamily: "AvenirNextCyr-Thin",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 10,
    width: "100%",
  },
  dropdown: {
    height: 50,
    borderColor: "#dedede",
    borderWidth: 1,
    paddingHorizontal: 8,
    marginBottom: "5%",
    borderRadius: 10,
    backgroundColor: "white",
  },
  input2: {
    fontFamily: "AvenirNextCyr-Thin",
    padding: 8,
    flex: 1,
  },
});

export default DispatchOrder;
