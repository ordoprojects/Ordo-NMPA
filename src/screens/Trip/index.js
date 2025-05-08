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
import { TimePickerModal } from "react-native-paper-dates";
import AntDesign from "react-native-vector-icons/AntDesign";
import Entypo from "react-native-vector-icons/Entypo";



const Trip = ({ navigation, route }) => {

  // const { vehicleID } = route?.params
  const { details, screen } = route?.params || {};

  console.log("detailsss",details,screen)

  const [driverDrop, setDriverDrop] = useState([]);
 

  const [vehicleDrop, setVehicleDrop] = useState([]);
  const [BillToDrop, setBillToDrop] = useState([]);


  const [visible2, setVisible2] = React.useState(false);
  const [visible1, setVisible1] = React.useState(false);
  const [visible, setVisible] = React.useState(false);

 

  const { token, userData } = useContext(AuthContext);
  const [date, setDate] = useState("");
  const [inspectionDate, setInspectionDate] = useState("");
  const [powderingDate, setPowderingDate] = useState("");

  const [billNo, setBillNo] = useState("");
  const [billedTo, setBilledTo] = useState('');
  const [dispatchFrom, setDispatchFrom] = useState("");
  const [dispatchTo, setDispatchTo] = useState('');
  const [openingKm,setOpeningKm ] = useState('');
  const [closingKm,setClosingKm ] = useState('');
  const [totalRunningKm, setTotalRunningKm] = useState('');
  const [freightCollected,setFreightCollected ] = useState('');
  const [tripIncentive,setTripIncentive ] = useState('');

  const [driverType, setdriverType] = useState('');
  const [isFocus1, setIsFocus1] = useState(false);

  const [isFocus3, setIsFocus3] = useState(false);
  const [isFocus2, setIsFocus2] = useState(false);


  const [vehicleID, setVehicleId] = useState('');
  const [loading, setLoading] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [fuelConsumed,setFuelConsumed ] = useState('');



   useEffect(() => {
    if (screen === "edit" && details) {
      setVehicleId(details?.vehicle?.id || '');
      setDate(formatDate(details?.date));                      // "YYYY-MM-DD" to "DD/MM/YYYY"

      setBillNo(details.bill_no || '');
      setBilledTo(details.billed_to || '');
      setDispatchFrom(details.dispatch_from || '');
      setDispatchTo(details.dispatch_to || '');
      setOpeningKm(details.opening_km?.toString() || '');
      setClosingKm(details.closing_km?.toString() || '');
      setTotalRunningKm(details.total_running?.toString() || '');
      setFreightCollected(details.freight_collected?.toString() || '');
      setTripIncentive(details.trip_incentive?.toString() || '');
      setStartTime(details.start_time || '');
      setEndTime(details.end_time || '');
      setFuelConsumed(details.fuel_consumed?.toString() || '');
      // Also set driver ID if available
      setdriverType(details?.driver?.id || '');
    }
    }, [details]);

// console.log("check",vehicleID,driverType)


  const formatDate = (isoString) => {
    return isoString ? moment(isoString).format("DD/MM/YYYY") : '';
  };
  
    useEffect(() => {
      driverDropdown();
      VehicleDropdown();
      BillToDropdown();
    }, []);


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



     // format time
     const formatTime = (hours, minutes) => {
      const ampm = hours >= 12 ? "PM" : "AM";
      const hour12 = hours % 12 === 0 ? 12 : hours % 12;
      const min = minutes < 10 ? `0${minutes}` : minutes;
      return `${hour12}:${min} ${ampm}`;
    };

 //   input label

  const InputWithLabel = ({ title, value, onPress }) => {
    const textColor = !value ? "#cecece" : "black";
    return (
      <View>
        {/* <Text style={styles.labelText}>{title}</Text> */}
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
        {/* <Text style={styles.labelText}>{title}</Text> */}
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



//   date
  const onDismiss2 = React.useCallback(() => {
    setVisible2(false);
  }, [setVisible2]);

  const onChange2 = React.useCallback(({ date }) => {
    setVisible2(false);
    const EmStart = moment(date).format("DD/MM/YYYY");
    setDate(EmStart);
  }, []);



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


  const BillToDropdown = async (id) => {
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
        "https://gsidev.ordosolution.com/api/delivered-orders/",
        requestOptions
      );
      const result = await response.json();
      // console.log("hkdgjhahsgfhjsf", userData.token,result)
      const bill = result.map((brand) => {
        return {
          label: `${brand.name} - ${brand.customer_name} - ${brand.user_name}`,
          value: brand.id,
        };
      });
      

      setBillToDrop(bill);

    } catch (error) {
      console.log("error", error);
    }
  };
// console.log("bill",BillToDrop)


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

  console.log("driver",driverDrop,driverType)

 
  

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

    if (!driverType || !date || !billNo || !billedTo || !dispatchTo || !dispatchFrom || !openingKm || !closingKm || !totalRunningKm || !freightCollected || !tripIncentive || !fuelConsumed ||  !startTime ||
        !endTime )  {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }


    setLoading(true);
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${userData.token}`);
    myHeaders.append("Content-Type", "application/json");
    console.log("gfghgfgfgf", userData.token);

    var raw = JSON.stringify({
        driverid: driverType,
        vehicleid: vehicleID,
      date: moment(date, "DD/MM/YYYY").format("YYYY-MM-DD"),
      bill_no: billNo,
      billed_to: billedTo,
      dispatch_from: dispatchFrom,
      dispatch_to: dispatchTo,
      opening_km: openingKm,
      closing_km: closingKm,
      total_running: totalRunningKm,
      freight_collected: freightCollected,
      trip_incentive: tripIncentive,
      fuel_consumed:fuelConsumed,
     start_time: startTime.replace(/ (AM|PM)/i, ''),
     end_time: endTime.replace(/ (AM|PM)/i, ''),
    });

    // console.log("base 64", base64img);
    console.log("raw", raw);

    let url = "https://gsidev.ordosolution.com/api/trip/";
       let method = "POST"; // Default is POST for creating a new tyre
     
       // If in "edit" mode, update the tyre using PUT
       if (screen === "edit" && details?.id) {
         url = `https://gsidev.ordosolution.com/api/trip/${details?.id}/`; // Update URL with the specific tyre id
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
     
         console.log("Trip Result:", result);
     
         // Show a success message
         Toast.show(`Trip data ${screen === "edit" ? "updated" : "added"} successfully`, Toast.LONG);
     
          // Navigate back accordingly
     if (screen === "edit") {
       navigation.pop(2); // Go back two screens if editing
     } else {
       navigation.goBack(); // Or just one screen if adding
     }
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
          Trip
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
          <View style={{marginTop:'3%'}}>

            {/* <Text style={styles.label}>Vehicle</Text> */}
                       <View>
                            {(!isFocus1 && !vehicleID) ? (
                          <Text style={styles.label1}>
                            Vehicle No.
                          </Text>
                        ) : (
                          <Text style={[styles.label1, isFocus1 && { color: Colors.primary }]}>
                            Vehicle No. 
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

            {/* <Text style={styles.label}>Driver Id</Text> */}
            <View style={{marginTop:'3%'}}>
                   
                   {(!isFocus3 && !driverType) ? (
             <Text style={styles.label1}>
               Driver Name <Text style={{ color: 'red' }}>*</Text>
             </Text>
           ) : (
             <Text style={[styles.label1, isFocus3 && { color: Colors.primary }]}>
               Driver Name <Text style={{ color: 'red' }}>*</Text>
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

            <View style={{ flexDirection: "row", flex: 0.95, gap: 5 ,marginTop:'3%'}}>


              <View style={{ flex: 0.5 }}>
                          {(!startTime) ? (
                          <Text style={styles.label1}>
                            Start Time <Text style={{ color: 'red' }}>*</Text>
                          </Text>
                        ) : (
                          <Text style={[styles.label1, { color: Colors.primary }]}>
                            Start Time <Text style={{ color: 'red' }}>*</Text>
                          </Text>
                        )}
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
              {(!endTime) ? (
                          <Text style={styles.label1}>
                            End Time <Text style={{ color: 'red' }}>*</Text>
                          </Text>
                        ) : (
                          <Text style={[styles.label1, { color: Colors.primary }]}>
                            End Time <Text style={{ color: 'red' }}>*</Text>
                          </Text>
                        )}
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
                                              Bill No. <Text style={{ color: 'red' }}>*</Text>
                                            </Text>
                                          }
              value={billNo}
              theme={{
                colors: { onSurfaceVariant: "#4b0482" },
                fonts: { labelLarge: { fontSize: 12 } }, // set label font size smaller
              }}
              activeOutlineColor="#4b0482"
              outlineColor="#B6B4B4"
              textColor="#4b0482"
              onChangeText={(text) => setBillNo(text)}
              returnKeyType="done"
              blurOnSubmit={false}
              outlineStyle={{ borderRadius: 10 }}
              style={{ marginBottom: "5%", height: 55, backgroundColor: "white" }}
            />


<TextInput1
              mode="outlined"
                label={
                                            <Text>
                                              Fuel Consumed <Text style={{ color: 'red' }}>*</Text>
                                            </Text>
                                          }
              value={fuelConsumed}
              theme={{
                colors: { onSurfaceVariant: "#4b0482" },
                fonts: { labelLarge: { fontSize: 12 } }, // set label font size smaller
              }}
              activeOutlineColor="#4b0482"
              outlineColor="#B6B4B4"
              textColor="#4b0482"
              onChangeText={(text) => setFuelConsumed(text)}
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
                          <View>
                            {(!isFocus2 && !billedTo) ? (
                          <Text style={styles.label1}>
                            Billed To (Party) <Text style={{ color: 'red' }}>*</Text>
                          </Text>
                        ) : (
                          <Text style={[styles.label1, isFocus2 && { color: Colors.primary }]}>
                                                       Billed To (Party) <Text style={{ color: 'red' }}>*</Text>

                          </Text>
                        )}
                                {/* <Text style={styles.label}>Vehicle</Text> */}
                                 <Dropdown
                               
                                             style={[styles.dropdown, isFocus2 && { borderColor: Colors.primary}]}
              containerStyle={styles.dropdownContainer}
              placeholderStyle={styles.placeholderStyle}
              searchPlaceholder="Search"
              selectedTextStyle={styles.selectedTextStyle}
              itemTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={BillToDrop}
              maxHeight={400}
              labelField="label"
              valueField="value"
              placeholder={!isFocus2 ? "Please select the bill to" : "..."}
              //searchPlaceholder="Search..."
              value={billedTo}
              onFocus={() => setIsFocus2(true)}
              onBlur={() => setIsFocus2(false)}
              onChange={(item) => {
                setBilledTo(item.value);
                setIsFocus2(false);
              }}
            />
</View>


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
                                              Dispatch To <Text style={{ color: 'red' }}>*</Text>
                                            </Text>
                                          }
              value={dispatchTo}
              theme={{ colors: { onSurfaceVariant: "#4b0482" } }}
              activeOutlineColor="#4b0482"
              outlineColor="#B6B4B4"
              textColor="#4b0482"
              onChangeText={(text) => setDispatchTo(text)}
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
                                              Dispatch From <Text style={{ color: 'red' }}>*</Text>
                                            </Text>
                                          }
              value={dispatchFrom}
              theme={{ colors: { onSurfaceVariant: "#4b0482" } }}
              activeOutlineColor="#4b0482"
              outlineColor="#B6B4B4"
              textColor="#4b0482"
              onChangeText={(text) => setDispatchFrom(text)}
              returnKeyType="done"
              blurOnSubmit={false}
              outlineStyle={{ borderRadius: 10 }}
              style={{ marginBottom: "5%", height: 55, backgroundColor: "white" }}
            />



<TextInput1
              mode="outlined"
                label={
                                          <Text>
                                              Opening Km <Text style={{ color: 'red' }}>*</Text>
                                            </Text>
                                          }
              value={openingKm}
              theme={{ colors: { onSurfaceVariant: "#4b0482" } }}
              activeOutlineColor="#4b0482"
              outlineColor="#B6B4B4"
              textColor="#4b0482"
              onChangeText={(text) => setOpeningKm(text)}
              returnKeyType="done"
              blurOnSubmit={false}
              outlineStyle={{ borderRadius: 10 }}
              style={{ marginBottom: "5%", height: 55, backgroundColor: "white" }}
            />
                 <TextInput1
              mode="outlined"
                label={
                                            <Text>
                                              Closing Km <Text style={{ color: 'red' }}>*</Text>
                                            </Text>
                                          }
              value={closingKm}
              theme={{ colors: { onSurfaceVariant: "#4b0482" } }}
              activeOutlineColor="#4b0482"
              outlineColor="#B6B4B4"
              textColor="#4b0482"
              onChangeText={(text) => setClosingKm(text)}
              returnKeyType="done"
              blurOnSubmit={false}
              outlineStyle={{ borderRadius: 10 }}
              style={{ marginBottom: "5%", height: 55, backgroundColor: "white" }}
            />
                 <TextInput1
              mode="outlined"
                label={
                                            <Text>
                                              Total Running Km <Text style={{ color: 'red' }}>*</Text>
                                            </Text>
                                          }
              value={totalRunningKm}
              theme={{ colors: { onSurfaceVariant: "#4b0482" } }}
              activeOutlineColor="#4b0482"
              outlineColor="#B6B4B4"
              textColor="#4b0482"
              onChangeText={(text) => setTotalRunningKm(text)}
              returnKeyType="done"
              blurOnSubmit={false}
              outlineStyle={{ borderRadius: 10 }}
              style={{ marginBottom: "5%", height: 55, backgroundColor: "white" }}
            />
                 <TextInput1
              mode="outlined"
                label={
                                            <Text>
                                              Freight Collected <Text style={{ color: 'red' }}>*</Text>
                                            </Text>
                                          }
              value={freightCollected}
              theme={{ colors: { onSurfaceVariant: "#4b0482" } }}
              activeOutlineColor="#4b0482"
              outlineColor="#B6B4B4"
              textColor="#4b0482"
              onChangeText={(text) => setFreightCollected(text)}
              returnKeyType="done"
              blurOnSubmit={false}
              outlineStyle={{ borderRadius: 10 }}
              style={{ marginBottom: "5%", height: 55, backgroundColor: "white" }}
            />
                 <TextInput1
              mode="outlined"
                label={
                                            <Text>
                                              Trip Incentive <Text style={{ color: 'red' }}>*</Text>
                                            </Text>
                                          }
              value={tripIncentive}
              theme={{ colors: { onSurfaceVariant: "#4b0482" } }}
              activeOutlineColor="#4b0482"
              outlineColor="#B6B4B4"
              textColor="#4b0482"
              onChangeText={(text) => setTripIncentive(text)}
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

export default Trip;
