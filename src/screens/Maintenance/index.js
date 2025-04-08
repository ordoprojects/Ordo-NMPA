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
import { DatePickerModal, DatePickerInput } from "react-native-paper-dates";
import { Dropdown, MultiSelect } from "react-native-element-dropdown";
import moment from "moment";
import Toast from 'react-native-simple-toast';
import { TextInput as TextInput1 } from "react-native-paper";
import AntDesign from "react-native-vector-icons/AntDesign"
import { LoadingView } from "../../components/LoadingView";
import { ms, hs, vs } from "../../utils/Metrics";


const Maintenance = ({ navigation, route }) => {
  // const {vehicleID}=route?.params
  const { token, userData } = useContext(AuthContext);
  const [typeDrop, setTypeDrop] = useState([]);
  const [vehicleDrop, setVehicleDrop] = useState([]);

  const [typeDrop1, setTypeDrop1] = useState([]);
  const [isFocus, setIsFocus] = useState(false);
  const [isFocus1, setIsFocus1] = useState(false);
  const [visible2, setVisible2] = React.useState(false);

  const [vehicleID, setVehicleId] = useState([]);
  const [maintainanceType, setMaintainancetype] = useState([]);
  const [maintainanceDate, setMaintainanceDate] = useState("");
  const [cost, setcost] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    //getting all predefined drop down values
    MaintenanceDropdown();
    VehicleDropdown();
  }, []);

  const onDismiss2 = React.useCallback(() => {
    setVisible2(false);
  }, [setVisible2]);

  const onChange2 = React.useCallback(({ date }) => {
    setVisible2(false);
    const EmStart = moment(date).format("DD/MM/YYYY");
    setMaintainanceDate(EmStart);
  }, []);

  const renderItem = item => {
    return (
      <View style={styles.item}>
        <Text style={styles.selectedTextStyle}>{item.label}</Text>
        <AntDesign style={styles.icon} color="black" name="Safety" size={20} />
      </View>
    );
  };


  const InputWithLabel2 = ({ title, value, onPress }) => {
    const textColor = Colors.primary;
    return (
      <View>
        {/* <Text style={styles.labelText}>{title}</Text> */}
        <Pressable style={{ ...styles.inputContainer }} onPress={onPress}>
          <Text style={{ ...styles.input2, color: textColor }}>
            {value ? value : "Select Maintainance Date"}
          </Text>
          <Image
            style={{ width: 20, height: 20, marginRight: 15 }}
            source={require("../../assets/images/calendar.png")}
          ></Image>
        </Pressable>
      </View>
    );
  };

  const handleSubmit = async () => {
    // console.log(maintainanceType)
    // Check if required fields are filled
    if (!vehicleID || !maintainanceType || !maintainanceDate || !cost || !notes) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);


    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${userData.token}`);
    myHeaders.append("Content-Type", "application/json");
    console.log("gfghgfgfgf", userData.token)

    var raw = JSON.stringify({
      vehicle: vehicleID,
      maintainance_type: maintainanceType,
      maintainance_date: moment(maintainanceDate, "DD/MM/YYYY").format(
        "YYYY-MM-DD"
      ),
      notes: notes, // This field can be empty
      cost: cost,
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
        "https://gsidev.ordosolution.com/api/maintainance/",
        requestOptions
      );
      const result = await response.json();

      console.log("Maintenance Result:", result);
      Toast.show("Maintenance data saved successfully", Toast.LONG);

      navigation.goBack();
    } catch (error) {
      console.log("error", error);
    }
    setLoading(false);

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
        "https://gsidev.ordosolution.com/api/maintenance-types/",
        requestOptions
      );
      const result = await response.json();
      console.log("hkdgjhahsgfhjsf", result);
      const typeDrop = result.map((brand) => {
        return {
          label: brand.label,
          value: brand.value,
        };
      });

      setTypeDrop(typeDrop);

      // const typeDrop1 = result.vehicle_types.map((types) => {
      //   return {
      //     label: types.label,
      //     value: types.value,
      //   };
      // });
      // console.log("mhh", typeDrop1);

      // setTypeDrop1(typeDrop1);
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
            placeholder={"Please select the vehicle"}
            //searchPlaceholder="Search..."
            value={vehicleID}

            onChange={(item) => {
              setVehicleId(item.value);
            }}
          />


          {/* <Text style={styles.label}>Maintenance Type</Text> */}
          <MultiSelect
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            search
            data={typeDrop}
            labelField="label"
            valueField="value"
            placeholder="Select Maintainance type"
            searchPlaceholder="Search..."
            value={maintainanceType}
            onChange={item => {
              setMaintainancetype(item);
            }}
            renderItem={renderItem}
            renderSelectedItem={(item, unSelect) => (
              <TouchableOpacity onPress={() => unSelect && unSelect(item)}>
                <View style={styles.selectedStyle}>
                  <Text style={styles.textSelectedStyle}>{item.label}</Text>
                  <AntDesign color="black" name="delete" size={17} />
                </View>
              </TouchableOpacity>
            )}
            renderLeftIcon={() => (
              <AntDesign
                style={styles.icon}
                color="black"
                name="Safety"
                size={20}
              />
            )}
            selectedStyle={styles.selectedStyle}
          />
          {/* <Dropdown
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
            //searchPlaceholder="Search..."
            value={maintainanceType}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={(item) => {
              setMaintainancetype(item.value);
              setIsFocus(false);
            }}
          /> */}
          <View style={{}}>
            <InputWithLabel2
              title="Maintenance Date"
              value={maintainanceDate}
              onPress={() => setVisible2(true)}
            />

            <DatePickerModal
              mode="single"
              visible={visible2}
              onDismiss={onDismiss2}
              // date={date}
              onConfirm={onChange2}
              saveLabel="Save"
              label="Select date"
              animationType="slide"
              maximumDate={new Date()}
                 validRange={{
          // startDate: new Date(2021, 1, 2),
          endDate: new Date(), // optional
          // disabledDates: [new Date()] // optional
        }}
            />
          </View>
          {/* <Text style={styles.label}>Cost</Text> */}
          {/* <TextInput
            style={styles.textInput}
            value={cost}
            onChangeText={(text) => setcost(text)}
            placeholder="Please enter the cost"
            placeholderTextColor="#cecece"
          /> */}

          <TextInput1
            mode="outlined"
            label="Cost"
            value={cost}
            theme={{ colors: { onSurfaceVariant: "#4b0482" } }}
            activeOutlineColor="#4b0482"
            outlineColor="#B6B4B4"
            textColor="#4b0482"
            onChangeText={(text) => setcost(text)}
            returnKeyType="done"
            keyboardType="number-pad"
            blurOnSubmit={false}
            outlineStyle={{ borderRadius: 10 }}
            style={{ marginBottom: "5%", height: 55, backgroundColor: "white" }}
          />

          {/* <Text style={styles.label}>Note</Text> */}
          {/* <TextInput
            style={{ backgroundColor: 'white' }}
            value={notes}
            onChangeText={(text) => setNotes(text)}
            placeholder="Please enter the note"
            placeholderTextColor="#cecece"
            multiline={true}
            numberOfLines={6}
          /> */}
          <TextInput1
            mode="outlined"
            label="Notes"
            value={notes}
            theme={{ colors: { onSurfaceVariant: "#4b0482" } }}
            activeOutlineColor="#4b0482"
            outlineColor="#B6B4B4"
            textColor="#4b0482"
            multiline={true}
            numberOfLines={4}
            onChangeText={(text) => setNotes(text)}
            returnKeyType="next"
            outlineStyle={{ borderRadius: 10 }}
          // style={{ marginBottom: "5%", height: 55, backgroundColor: "white" }}
          />
        </View>
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
    // height: 50,
    // borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: "4%",
    width:'100%'
    // backgroundColor: Colors.primary,
  },
  buttonText: {
    fontFamily: "AvenirNextCyr-Medium",
    color: "white",
    fontSize: 17,
    fontWeight: "500",
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
    borderColor: "#cecece",
    borderWidth: 1,
    backgroundColor: "white",
    height: 50,
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


  selectedStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
    backgroundColor: 'white',
    shadowColor: '#000',
    marginTop: 8,
    marginRight: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,

    shadowOpacity: 0.2,
    shadowRadius: 1.41,

  },
  textSelectedStyle: {
    marginRight: 5,
    fontSize: 16,
  },

  item: {
    padding: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default Maintenance;
