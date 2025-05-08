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
  ScrollView
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
  const { details, screen } = route?.params || {};

  console.log("detailsss",details,screen)


  const { token, userData } = useContext(AuthContext);
  const [typeDrop, setTypeDrop] = useState([]);
  const [vehicleDrop, setVehicleDrop] = useState([]);
  const [driverDrop, setDriverDrop] = useState([]);
  const [tyreDrop, setTyreDrop] = useState([]);


  const [isFocus2, setIsFocus2] = useState(false);
  const [isFocus1, setIsFocus1] = useState(false);
  const [visible2, setVisible2] = React.useState(false);
  const [isFocus3, setIsFocus3] = useState(false);
  const [driverType, setdriverType] = useState([]);
  const [km, setKm] = useState("");
    const [tyreNumber, setTyreNumber] = useState("");
  

  const [vehicleID, setVehicleId] = useState([]);
  const [maintainanceType, setMaintainancetype] = useState([]);
  const [maintainanceDate, setMaintainanceDate] = useState("");
  const [cost, setcost] = useState("");
  const [particulars, setParticulars] = useState("");
  const [quantity, setQuantity] = useState("");
  const [partyName, setPartyName] = useState("");
  const [location, setLocation] = useState("");
  const [billNo, setBillNo] = useState("");
const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    driverDropdown();
    //getting all predefined drop down values
    MaintenanceDropdown();
    VehicleDropdown();
    tyreDropdown();
  }, []);

  useEffect(() => {
    if (details) {
      setVehicleId(details?. vehicle_no?.id || '');
      setMaintainancetype(details?.maintainance_type_detail?.map(item => item.id) || []);
      setMaintainanceDate(formatDate(details?.maintainance_date));
      setcost(details.cost?.toString() || "");
      setParticulars(details.particulars || "");
      setQuantity(details.qty?.toString() || "");
      setPartyName(details.party_name || "");
      setLocation(details.location || "");
      setBillNo(details.bill_number || "");
      setNotes(details.notes || "");
      setKm(details.km?.toString() || "");
      setTyreNumber(details.tyre_no || "");
      setdriverType(details?.driver_no?.id);
    }
  }, [details]);
  
const formatDate = (isoString) => {
    return isoString ? moment(isoString).format("DD/MM/YYYY") : '';
  };
  
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
    if (!vehicleID || !maintainanceType || !maintainanceDate || !cost || !notes || !km || !particulars) {
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
      driver_name:driverType,
      km:km,
      particulars:particulars,
      qty:quantity,
      tyre_no:tyreNumber,
      party_name:partyName,
      bill_number:billNo,
      location:location,

    });

    // console.log("base 64", base64img);
    console.log("raw", raw);

    let url = "https://gsidev.ordosolution.com/api/maintainance/";
       let method = "POST"; // Default is POST for creating a new tyre
     
       // If in "edit" mode, update the tyre using PUT
       if (screen === "edit" && details?.id) {
         url = `https://gsidev.ordosolution.com/api/maintainance/${details?.id}/`; // Update URL with the specific tyre id
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
     
         console.log("Maintainance Result:", result);
     
         // Show a success message
         Toast.show(`Maintainance data ${screen === "edit" ? "updated" : "added"} successfully`, Toast.LONG);
     
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
        "https://gsidev.ordosolution.com/api/tyrelist/",
        requestOptions
      );
      const result = await response.json();
      console.log("tyre", result);
  
      const positionDrop = result?.tyre.map((item) => ({
        label: item.label,
        value: item.value,
      }));
  
   
  
      setTyreDrop(positionDrop);
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
          <View style={{marginTop:'3%'}}>
          
            
          {(!isFocus1 && !vehicleID) ? (
    <Text style={styles.label1}>
      Vehicle No.<Text style={{ color: 'red' }}>*</Text>
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
                       placeholder={!isFocus1 ? "Please select the vehicle": "..."}
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

  {
    (!maintainanceType || maintainanceType.length === 0) ? (
      <Text style={styles.label1}>
        Maintenance Type <Text style={{ color: 'red' }}>*</Text>
      </Text>
    ) : (
      <Text style={[styles.label1, { color: Colors.primary }]}>
        Maintenance Type <Text style={{ color: 'red' }}>*</Text>
      </Text>
    )
  }

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
                <View style={{...styles.selectedStyle}}>
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

</View>

<View style={{marginTop:'3%'}}>

            
            {(!isFocus2 && !tyreNumber) ? (
      <Text style={styles.label1}>
        Tyre No.
      </Text>
    ) : (
      <Text style={[styles.label1, isFocus2 && { color: Colors.primary }]}>
        Tyre No.
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
                        data={tyreDrop}
                        maxHeight={400}
                        labelField="label"
                        valueField="value"
                        placeholder={!isFocus2 ? "Please select your Tyre no." : "..."}
                        //searchPlaceholder="Search..."
                        value={tyreNumber}
                        onFocus={() => setIsFocus2(true)}
                        onBlur={() => setIsFocus2(false)}
                        onChange={(item) => {
                          setTyreNumber(item.value);
                          setIsFocus2(false);
                        }}
                      />
                      </View>
          
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
         <View style={{marginTop:'3%'}}>
         
          {(!maintainanceDate) ? (
    <Text style={styles.label1}>
      Maintenance Date <Text style={{ color: 'red' }}>*</Text>
    </Text>
  ) : (
    <Text style={[styles.label1, { color: Colors.primary }]}>
      Maintenance Date <Text style={{ color: 'red' }}>*</Text>
    </Text>
  )}
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

          <TextInput1
            mode="outlined"
            label={
              <Text>
                Amount <Text style={{ color: 'red' }}>*</Text>
              </Text>
            }
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

<TextInput1
            mode="outlined"
            label={
              <Text>
                Particulars <Text style={{ color: 'red' }}>*</Text>
              </Text>
            }
            value={particulars}
            theme={{ colors: { onSurfaceVariant: "#4b0482" } }}
            activeOutlineColor="#4b0482"
            outlineColor="#B6B4B4"
            textColor="#4b0482"
            onChangeText={(text) => setParticulars(text)}
            returnKeyType="done"
            // keyboardType="number-pad"
            blurOnSubmit={false}
            outlineStyle={{ borderRadius: 10 }}
            style={{ marginBottom: "5%", height: 55, backgroundColor: "white" }}
          />

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
            keyboardType="number-pad"
            blurOnSubmit={false}
            outlineStyle={{ borderRadius: 10 }}
            style={{ marginBottom: "5%", height: 55, backgroundColor: "white" }}
          />

<TextInput1
            mode="outlined"
            label="Party Name"
            value={partyName}
            theme={{ colors: { onSurfaceVariant: "#4b0482" } }}
            activeOutlineColor="#4b0482"
            outlineColor="#B6B4B4"
            textColor="#4b0482"
            onChangeText={(text) => setPartyName(text)}
            returnKeyType="done"
            // keyboardType="number-pad"
            blurOnSubmit={false}
            outlineStyle={{ borderRadius: 10 }}
            style={{ marginBottom: "5%", height: 55, backgroundColor: "white" }}
          />

<TextInput1
            mode="outlined"
            label="Bill No."
            value={billNo}
            theme={{ colors: { onSurfaceVariant: "#4b0482" } }}
            activeOutlineColor="#4b0482"
            outlineColor="#B6B4B4"
            textColor="#4b0482"
            onChangeText={(text) => setBillNo(text)}
            returnKeyType="done"
            // keyboardType="number-pad"
            blurOnSubmit={false}
            outlineStyle={{ borderRadius: 10 }}
            style={{ marginBottom: "5%", height: 55, backgroundColor: "white" }}
          />

<TextInput1
            mode="outlined"
            label="Location"
            value={location}
            theme={{ colors: { onSurfaceVariant: "#4b0482" } }}
            activeOutlineColor="#4b0482"
            outlineColor="#B6B4B4"
            textColor="#4b0482"
            onChangeText={(text) => setLocation(text)}
            returnKeyType="done"
            // keyboardType="number-pad"
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
            label={
              <Text>
                Notes <Text style={{ color: 'red' }}>*</Text>
              </Text>
            }
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
    // marginTop:10
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
    height: 60,
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
    height: 60,
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
  


  selectedStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
    backgroundColor: 'white',
    shadowColor: '#000',
    marginRight: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
marginBottom:8,
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
