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



const Tire = ({ navigation, route }) => {
  const { details, screen } = route?.params || {};

  console.log("details",details,screen)

  const [driverDrop, setDriverDrop] = useState([]);
  const [statusDrop, setStatusDrop] = useState([]);
  const [positionDrop, setPositionDrop] = useState([]);

  const [vehicleDrop, setVehicleDrop] = useState([]);

  const [visible2, setVisible2] = React.useState(false);
  const [visible3, setVisible3] = React.useState(false);
  const [visible4, setVisible4] = React.useState(false);

  const { token, userData } = useContext(AuthContext);
  const [date, setDate] = useState("");
  const [inspectionDate, setInspectionDate] = useState("");
  const [powderingDate, setPowderingDate] = useState("");

  const [tyreNumber, setTyreNumber] = useState("");
  const [brand, setBrand] = useState("");
  const [km, setKm] = useState("");
  const [lifePercentage, setLifePercentage] = useState('');
  const [position,setPosition ] = useState('');
  const [status,setStatus ] = useState('');

  const [driverType, setdriverType] = useState([]);
  const [isFocus2, setIsFocus2] = useState(false);
  const [isFocus1, setIsFocus1] = useState(false);

  const [isFocus3, setIsFocus3] = useState(false);
  const [isFocus4, setIsFocus4] = useState(false);

  const [vehicleID, setVehicleId] = useState('');
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    if (details) {
      // Dropdowns (set with IDs)
      setdriverType(details?.driver_no?.id);          // Driver dropdown (value = ID)
      setVehicleId(details?.vehicle?.id);        // Vehicle dropdown (value = ID)
      setPosition(details?.position);                  // Position dropdown (value = string or ID depending on your data)
      setStatus(details?.status);                      // Status dropdown (value = string or ID)
  
      // Text Inputs
      setTyreNumber(details?.tyre_number || '');
      setBrand(details?.brand || '');
      setKm(details?.km?.toString() || '');
      setLifePercentage(details?.life_percentage?.toString() || '');
  
      // Dates
      setDate(formatDate(details?.date));                      // "YYYY-MM-DD" to "DD/MM/YYYY"
      setInspectionDate(details?.inspection_date?.replace(/-/g, '/'));
setPowderingDate(details?.powdering_date?.replace(/-/g, '/'));// Already in "DD-MM-YYYY"
    }
  }, [details]);
  


  const formatDate = (isoString) => {
    return isoString ? moment(isoString).format("DD/MM/YYYY") : '';
  };

  useEffect(() => {
    driverDropdown();
    tyreDropdown();
    VehicleDropdown();
  }, []);


//   date
  const onDismiss2 = React.useCallback(() => {
    setVisible2(false);
  }, [setVisible2]);

  const onChange2 = React.useCallback(({ date }) => {
    setVisible2(false);
    const EmStart = moment(date).format("DD/MM/YYYY");
    setDate(EmStart);
  }, []);


// inspection date
  const onDismiss3 = React.useCallback(() => {
    setVisible3(false);
  }, [setVisible3]);

  const onChange3 = React.useCallback(({ date }) => {
    setVisible3(false);
    const EmStart = moment(date).format("DD/MM/YYYY");
    setInspectionDate(EmStart);
  }, []);

// powdering date
  const onDismiss4 = React.useCallback(() => {
    setVisible4(false);
  }, [setVisible4]);

  const onChange4 = React.useCallback(({ date }) => {
    setVisible4(false);
    const EmStart = moment(date).format("DD/MM/YYYY");
    setPowderingDate(EmStart);
  }, []);

//   useEffect(() => {
//     if (quantity && costPerUnit && !isNaN(quantity) && !isNaN(costPerUnit)) {
//       const calculatedTotalCost = parseFloat(quantity) * parseFloat(costPerUnit);
//       setTotalCost(calculatedTotalCost.toFixed(2)); 
//     } else {
//       setTotalCost("");
//     }
//   }, [quantity, costPerUnit]);

  const InputWithLabel2 = ({ title, value, onPress }) => {
    // const textColor = !value ? "#cecece" : "black";
    const textColor = Colors.primary
    return (
      <View>
        {/* <Text style={styles.labelText}>{title}</Text> */}
        <Pressable style={{ ...styles.inputContainer }} onPress={onPress}>
          <Text style={{ ...styles.input2, color: textColor }}>
            {value ? value : "Select Date"}
          </Text>
          <Image
            style={{ width: 20, height: 20, marginRight: 15 }}
            source={require("../../assets/images/calendar.png")}
          ></Image>
        </Pressable>
      </View>
    );
  };

// inspection date

  const InputWithLabel3 = ({ title, value, onPress }) => {
    // const textColor = !value ? "#cecece" : "black";
    const textColor = Colors.primary
    return (
      <View>
        {/* <Text style={styles.labelText}>{title}</Text> */}
        <Pressable style={{ ...styles.inputContainer }} onPress={onPress}>
          <Text style={{ ...styles.input2, color: textColor }}>
            {value ? value : "Select Inspection Date"}
          </Text>
          <Image
            style={{ width: 20, height: 20, marginRight: 15 }}
            source={require("../../assets/images/calendar.png")}
          ></Image>
        </Pressable>
      </View>
    );
  };


//   powdering date 
  const InputWithLabel4 = ({ title, value, onPress }) => {
    // const textColor = !value ? "#cecece" : "black";
    const textColor = Colors.primary
    return (
      <View>
        {/* <Text style={styles.labelText}>{title}</Text> */}
        <Pressable style={{ ...styles.inputContainer }} onPress={onPress}>
          <Text style={{ ...styles.input2, color: textColor }}>
            {value ? value : "Select Powdering Date"}
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
        "https://gsidev.ordosolution.com/api/alldrivers/",
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

  const tyreDropdown = async (id) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${userData.token}`);
  
    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
  
    try {
      const response = await fetch(
        "https://gsidev.ordosolution.com/api/tyre_choices/",
        requestOptions
      );
      const result = await response.json();
      console.log("tyre", result);
  
      const positionDrop = result.position_choices.map((item) => ({
        label: item.label,
        value: item.value,
      }));
  
      const statusDrop = result.status_choices.map((item) => ({
        label: item.label,
        value: item.value,
      }));
  
      setPositionDrop(positionDrop);
      setStatusDrop(statusDrop);
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
        "https://gsidev.ordosolution.com/api/allvehiclelist/",
        requestOptions
      );
      const result = await response.json();
    //   console.log("vehicle",result)
      const vehicleDrop = Object.values(result).flatMap((items) =>
        items.map((item) => ({
            label: `${item.label}  (${item.capacity ? item.capacity + " tons" : "No Capacity"})`,
            value: item.value,
            capacity: item?.capacity
        }))
    );

      setVehicleDrop(vehicleDrop);
      // console.log(result)

    } catch (error) {
      console.log("error", error);
    }
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (  !vehicleID || !date || !inspectionDate ||!position || !km || !brand || !lifePercentage || !status || !tyreNumber) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
  
    setLoading(true);
    
    // Prepare the headers for the request
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${userData.token}`);
    myHeaders.append("Content-Type", "application/json");
  
    // Prepare the request body with the form data
    var raw = JSON.stringify({
      driver: driverType,
      vehicle_no: vehicleID,
      date: moment(date, "DD/MM/YYYY").format("YYYY-MM-DD"),
      inspection_date: moment(inspectionDate, "DD/MM/YYYY").format("YYYY-MM-DD"),
      powdering_date: moment(powderingDate, "DD/MM/YYYY").format("YYYY-MM-DD"),
      tyre_number: tyreNumber,
      km: km,
      brand: brand,
      life_percentage: lifePercentage,
      status: status,
      position: position,
    });
  
    console.log("raw",raw,details?.id)
    // Determine the URL and request method based on whether it's "edit" mode or not
    let url = "https://gsidev.ordosolution.com/api/tyre/";
    let method = "POST"; // Default is POST for creating a new tyre
  
    // If in "edit" mode, update the tyre using PUT
    if (screen === "edit" && details?.id) {
      url = `https://gsidev.ordosolution.com/api/tyre/${details?.id}/`; // Update URL with the specific tyre id
      method = "PUT"; // Change method to PUT for updating
    }
  
    // Request options
    var requestOptions = {
      method: method,
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
  
    try {
      const response = await fetch(url, requestOptions);
      const result = await response.json();
  
      console.log("Tyre Result:", result);
  
      // Show a success message
      Toast.show(`Tyre data ${screen === "edit" ? "updated" : "added"} successfully`, Toast.LONG);
  
       // Navigate back accordingly
  if (screen === "edit") {
    navigation.pop(2); // Go back two screens if editing
  } else {
    navigation.goBack(); // Or just one screen if adding
  }
    } catch (error) {
      console.log("Error:", error);
      // Handle the error gracefully, e.g., show an error message
      Alert.alert('Error', 'Something went wrong, please try again later');
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
          Tyre
        </Text>
        <View style={{ width: "6%" }} />
      </View>

      <View
        style={{
          height: "90%",
          backgroundColor: "white",
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
            <View style={{marginTop:'3%'}}>

                                      {(!isFocus1 && !vehicleID) ? (
                                    <Text style={styles.label1}>
                                      Vehicle No. <Text style={{ color: 'red' }}>*</Text>
                                    </Text>
                                  ) : (
                                    <Text style={[styles.label1, isFocus1 && { color: Colors.primary }]}>
                                      Vehicle No. <Text style={{ color: 'red' }}>*</Text>
                                    </Text>
                                  )}
                                          {/* <Text style={styles.label}>Vehicle</Text> */}
                                           <Dropdown
                                         
                                                       style={[styles.dropdown, isFocus1 && { borderColor: Colors.primary}]}
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
              placeholder={!isFocus1 ? "Please select the vehicle" : "..."}
              //searchPlaceholder="Search..."
              value={vehicleID}
              onFocus={() => setIsFocus1(true)}
              onBlur={() => setIsFocus1(false)}
              onChange={(item) => {
                setVehicleId(item.value);
                setIsFocus1(false);
              }}
            />
</View>

<View style={{marginTop:'3%'}}>

            {/* <Text style={styles.label}>Driver Id</Text> */}
                            {(!isFocus3 && !driverType) ? (
                      <Text style={styles.label1}>
                        Driver Name 
                      </Text>
                    ) : (
                      <Text style={[styles.label1, isFocus3 && { color: Colors.primary }]}>
                        Driver Name 
                      </Text>
                    )}
                          <Dropdown
                                         style={[styles.dropdown, isFocus3 && { borderColor: Colors.primary}]}
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
</View>

<View style={{marginTop:'3%'}}>

                     {(!date) ? (
                                 <Text style={styles.label1}>
                                   Date <Text style={{ color: 'red' }}>*</Text>
                                 </Text>
                               ) : (
                                 <Text style={[styles.label1, { color: Colors.primary }]}>
                                   Date <Text style={{ color: 'red' }}>*</Text>
                                 </Text>
                               )}
              <InputWithLabel2
                title="Date"
                value={date}
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


            <View style={{marginTop:'3%'}}>

                     {(!inspectionDate) ? (
                                 <Text style={styles.label1}>
                                   Inspection Date <Text style={{ color: 'red' }}>*</Text>
                                 </Text>
                               ) : (
                                 <Text style={[styles.label1, { color: Colors.primary }]}>
                                   Inspection Date <Text style={{ color: 'red' }}>*</Text>
                                 </Text>
                               )}
              <InputWithLabel3
                title="Inspection Date"
                value={inspectionDate}
                onPress={() => setVisible3(true)}
              />

              <DatePickerModal
                mode="single"
                visible={visible3}
                onDismiss={onDismiss3}
                // date={date}
                onConfirm={onChange3}
                saveLabel="Save" // optional
                label="Select Inspection date" // optional
                animationType="slide" // optional, default is 'slide' on ios/android and 'none' on web
              />


            </View>


            <View style={{marginTop:'3%'}}>

            {(!powderingDate) ? (
                                 <Text style={styles.label1}>
                                   Powdering Date 
                                 </Text>
                               ) : (
                                 <Text style={[styles.label1, { color: Colors.primary }]}>
                                   Powdering Date 
                                 </Text>
                               )}
              <InputWithLabel4
                title="Powdering Date"
                value={powderingDate}
                onPress={() => setVisible4(true)}
              />

              <DatePickerModal
                mode="single"
                visible={visible4}
                onDismiss={onDismiss4}
                // date={date}
                onConfirm={onChange4}
                saveLabel="Save" // optional
                label="Select Powdering date" // optional
                animationType="slide" // optional, default is 'slide' on ios/android and 'none' on web
              />


            </View>



            <View style={{marginTop:'3%'}}>

                   
                   {(!isFocus2 && !position) ? (
             <Text style={styles.label1}>
               Position <Text style={{ color: 'red' }}>*</Text>
             </Text>
           ) : (
             <Text style={[styles.label1, isFocus2 && { color: Colors.primary }]}>
               Position <Text style={{ color: 'red' }}>*</Text>
             </Text>
           )}
                 <Dropdown
                                style={[styles.dropdown, isFocus2 && { borderColor: Colors.primary}]}
              containerStyle={styles.dropdownContainer}
              placeholderStyle={styles.placeholderStyle}
              searchPlaceholder="Search"
              selectedTextStyle={styles.selectedTextStyle}
              itemTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={positionDrop}
              maxHeight={400}
              labelField="label"
              valueField="value"
              placeholder={!isFocus2 ? "Please select your position" : "..."}
              //searchPlaceholder="Search..."
              value={position}
              onFocus={() => setIsFocus2(true)}
              onBlur={() => setIsFocus2(false)}
              onChange={(item) => {
                setPosition(item.value);
                setIsFocus2(false);
              }}
            />
</View>



<View style={{marginTop:'3%'}}>
                   
                   {(!isFocus4 && !status) ? (
             <Text style={styles.label1}>
               Status <Text style={{ color: 'red' }}>*</Text>
             </Text>
           ) : (
             <Text style={[styles.label1, isFocus4 && { color: Colors.primary }]}>
               Status <Text style={{ color: 'red' }}>*</Text>
             </Text>
           )}
                 <Dropdown
              style={[styles.dropdown, isFocus4 && { borderColor: Colors.primary}]}
              containerStyle={styles.dropdownContainer}
              placeholderStyle={styles.placeholderStyle}
              searchPlaceholder="Search"
              selectedTextStyle={styles.selectedTextStyle}
              itemTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={statusDrop}
              maxHeight={400}
              labelField="label"
              valueField="value"
              placeholder={!isFocus4 ? "Please select your status" : "..."}
              //searchPlaceholder="Search..."
              value={status}
              onFocus={() => setIsFocus4(true)}
              onBlur={() => setIsFocus4(false)}
              onChange={(item) => {
                setStatus(item.value);
                setIsFocus4(false);
              }}
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
                   label={
                            <Text>
                            Tyre Number <Text style={{ color: 'red' }}>*</Text>
                            </Text>
                           }
              value={tyreNumber}
              theme={{
                colors: { onSurfaceVariant: "#4b0482" },
                fonts: { labelLarge: { fontSize: 12 } }, // set label font size smaller
              }}
              activeOutlineColor="#4b0482"
              outlineColor="#B6B4B4"
              textColor="#4b0482"
              onChangeText={(text) => setTyreNumber(text)}
              returnKeyType="done"
              blurOnSubmit={false}
              outlineStyle={{ borderRadius: 10 }}
              style={{ marginBottom: "5%", height: 55, backgroundColor: "white" }}
            />
            {/* <Text style={styles.label}>Fuel Type</Text> */}
 
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
              label={
                <Text>
                KM <Text style={{ color: 'red' }}>*</Text>
                </Text>
               }
              value={km}
              theme={{ colors: { onSurfaceVariant: "#4b0482" } }}
              activeOutlineColor="#4b0482"
              outlineColor="#B6B4B4"
              textColor="#4b0482"
              onChangeText={(text) => setKm(text)}
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
              label={
                <Text>
                Brand <Text style={{ color: 'red' }}>*</Text>
                </Text>
               }
              value={brand}
              theme={{ colors: { onSurfaceVariant: "#4b0482" } }}
              activeOutlineColor="#4b0482"
              outlineColor="#B6B4B4"
              textColor="#4b0482"
              onChangeText={(text) => setBrand(text)}
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
              label={
                <Text>
                Life Percentage <Text style={{ color: 'red' }}>*</Text>
                </Text>
               }
              value={lifePercentage}
              theme={{ colors: { onSurfaceVariant: "#4b0482" } }}
              activeOutlineColor="#4b0482"
              outlineColor="#B6B4B4"
              textColor="#4b0482"
              onChangeText={(text) => setLifePercentage(text)}
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
     label1: {
       position: 'absolute',
       backgroundColor: 'white',
       left: 4,
       top: -10,
       zIndex: 999,
       paddingHorizontal: 8,
       fontSize: 14,
       fontFamily: 'AvenirNextCyr-Medium',
       color: Colors.primary
     },
});

export default Tire;
