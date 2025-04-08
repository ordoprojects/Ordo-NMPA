import React, { useState, useContext, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Text,
  Image,
  ScrollView,
  Modal,
  Alert,
  Keyboard
} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import globalStyles from "../../styles/globalStyles";
import Toast from "react-native-simple-toast";
import { ProgressBar } from "react-native-paper";
import Colors from "../../constants/Colors";
import { AuthContext } from "../../Context/AuthContext";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { Dropdown, MultiSelect } from "react-native-element-dropdown";
import moment from "moment";
import LinearGradient from "react-native-linear-gradient";
import { ms, hs, vs } from "../../utils/Metrics";
import { Switch, Button, TextInput as FloatingInput } from "react-native-paper";
import { DatePickerModal, DatePickerInput } from "react-native-paper-dates";
import { LoadingView } from "../../components/LoadingView";

const AddVehicle = ({ navigation, route }) => {
  const { screen, details } = route?.params

  const [visible, setVisible] = React.useState(false);
  const [visible1, setVisible1] = React.useState(false);
  const [visible2, setVisible2] = React.useState(false);

  const [rcModalVisible, setRcModalVisible] = useState(false);
  const [insuranceModalVisible, setInsuranceModalVisible] = useState(false);
  const [selectedRcImage, setSelectedRcImage] = useState(null);
  const [selectedInsuranceImage, setSelectedInsuranceImage] = useState(null);

  const selectRcFromGallery = () => {
    launchImageLibrary({ mediaType: "photo" }, (response) => {
      if (!response.didCancel) {
        setRcModalVisible(false);
        setSelectedRcImage(response.assets[0]);
      }
    });
  };

  const captureRcFromCamera = () => {
    launchCamera({ mediaType: "photo" }, (response) => {
      if (!response.didCancel) {
        setRcModalVisible(false);
        setSelectedRcImage(response.assets[0]);
      }
    });
  };

  const selectInsuranceFromGallery = () => {
    launchImageLibrary({ mediaType: "photo" }, (response) => {
      if (!response.didCancel) {
        setInsuranceModalVisible(false);
        setSelectedInsuranceImage(response.assets[0]);
      }
    });
  };

  const captureInsuranceFromCamera = () => {
    launchCamera({ mediaType: "photo" }, (response) => {
      if (!response.didCancel) {
        setInsuranceModalVisible(false);
        setSelectedInsuranceImage(response.assets[0]);
      }
    });
  };

  // Render the selected images
  const renderSelectedRcImage = () => {
    if (selectedRcImage) {
      return (
        <Image source={{ uri: selectedRcImage.uri }} style={styles.DocsImg} />
      );
    } else {
      return (
        <Image
          source={require("../../assets/images/Page.png")}
          style={styles.DocsImg}
        />
      );
    }
  };

  const renderSelectedInsuranceImage = () => {
    if (selectedInsuranceImage) {
      return (
        <Image
          source={{ uri: selectedInsuranceImage.uri }}
          style={styles.DocsImg}
        />
      );
    } else {
      return (
        <Image
          source={require("../../assets/images/Page.png")}
          style={styles.DocsImg}
        />
      );
    }
  };

  const onDismiss = React.useCallback(() => {
    setVisible(false);
  }, [setVisible]);

  const onDismiss1 = React.useCallback(() => {
    setVisible1(false);
  }, [setVisible1]);

  const onDismiss2 = React.useCallback(() => {
    setVisible2(false);
  }, [setVisible2]);

  const onChange = React.useCallback(({ startDate, endDate }) => {
    setVisible(false);
    console.log("dates", { startDate, endDate });

    const EmStart = moment(startDate).format("DD/MM/YYYY");
    const EmEnd = endDate ? moment(endDate).format("DD/MM/YYYY") : EmStart;

    setEmissionsStartDate(EmStart);
    setEmissionEndDate(EmEnd);
  }, []);

  const onChange1 = React.useCallback(({ startDate, endDate }) => {
    setVisible1(false);

    const EmStart = moment(startDate).format("DD/MM/YYYY");
    const EmEnd = endDate ? moment(endDate).format("DD/MM/YYYY") : EmStart;

    setInsuranceStartDate(EmStart);
    setInsuranceEndDate(EmEnd);
  }, []);

  const onChange2 = React.useCallback(({ date }) => {
    setVisible2(false);
    const EmStart = moment(date).format("DD/MM/YYYY");

    console.log("last date", { date });
    setLastModDate(EmStart);
  }, []);

  const [isSwitchOn, setIsSwitchOn] = React.useState(true);

  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);

  useEffect(() => {
    if (isSwitchOn === true) {
      setStatus("Active");
    } else {
      setStatus("InActive");
    }
  }, [isSwitchOn]);

  const { token, userData } = useContext(AuthContext);
  const [vehicleNumber, setVehicleNumber] = useState(details?.registration_no);
  const [vehicleName, setVehicleName] = useState(details?.vehicle_type);
  const [chassisNumber, setchassisNumber] = useState(details?.chassis_number);
  const [model, setModel] = useState(details?.model);
  const [make, setMake] = useState(details?.make);
  const [fuelType, setFuelType] = useState(details?.fuel_type);
  const [year, setYear] = useState(details?.year.toString());
  const [odometer, setOdometer] = useState(details?.current_odometer ? details.current_odometer.toString() : '');
  const [emissionsStartDate, setEmissionsStartDate] = useState("");
  const [emissionEndDate, setEmissionEndDate] = useState("");
  const [insuranceStartDate, setInsuranceStartDate] = useState("");
  const [insuranceEndDate, setInsuranceEndDate] = useState("");
  const [lastModDate, setLastModDate] = useState("");
  const [driver, setDriver] = useState(details?.driver_id);
  const [typeDrop, setTypeDrop] = useState([]);
  const [makeDrop, setMakeDrop] = useState([]);
  const [fuelDrop, setFuelDrop] = useState([]);
  const [driverDrop, setDriverDrop] = useState([]);
  const [vehicleCat, setVehicleCat] = useState([]);
  const [capacity, setCapacity] = useState(details?.vehicle_capacity);
  const [categoryOption, setCategoryOption] = useState([]);
  const [company, setCompany] = useState(details?.company);
  const [companyOpt, setCompanyOpt] = useState([]);




  const [status, setStatus] = useState("");

  //cateogry drop down hooks
  const [isFocus, setIsFocus] = useState(false);
  const [isFocus2, setIsFocus2] = useState(false);
  const [isFocus3, setIsFocus3] = useState(false);
  const [isFocus4, setIsFocus4] = useState(false);
  const [isFocus5, setIsFocus5] = useState(false);

  const [loading, setLoading] = useState(false);


  // moment(details?.emission_start_date, "YYYY-MM-DD").format(
  //   "DD/MM/YYYY"
  // )

  console.log("details", vehicleCat)

  useEffect(() => {
    if (details) {
      loadDate();
    }
  }, [details])
  const loadDate = () => {
    setEmissionsStartDate(moment(details?.emission_start_date, "YYYY-MM-DD").format("DD/MM/YYYY"))
    setEmissionEndDate(moment(details?.emission_end_date, "YYYY-MM-DD").format("DD/MM/YYYY"));
    setInsuranceStartDate(moment(details?.insurance_start_date, "YYYY-MM-DD").format("DD/MM/YYYY"));
    setInsuranceEndDate(moment(details?.insurance_end_date, "YYYY-MM-DD").format("DD/MM/YYYY"));
    setLastModDate(moment(details?.last_maintenance_date, "YYYY-MM-DD").format("DD/MM/YYYY"))
  }

  useEffect(() => {
    getBrand();
  }, []);

  const getBrand = async (userId) => {
    // Fetch category list API
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
        "https://gsidev.ordosolution.com/api/company/",
        requestOptions
      );
      const result = await response.json();

      console.log("brand", result);
      // setCompanyResponse(result);
      
      const allOption = { label: 'All', value: 'all' };
    const transformedData = result.map((item) => ({
      label: item?.name,
      value: item?.id,
    }));

    // Filter out duplicate labels and remove "All" if already present
    const uniqueData = transformedData.filter((item, index, array) => {
      return array.findIndex((i) => i.label === item.label) === index;
    });

      console.log("dhalfahljfahfaiiq", uniqueData);
      setCompanyOpt(uniqueData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

// console.log("jchksd",company)

  useEffect(() => {
    CatDropdown();
    VehicleDropdown();
    driverDropdown();
  }, []);

  const CatDropdown = async (id) => {
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
        "https://gsidev.ordosolution.com/api/brand-and-category-list/",
        requestOptions
      );
      const result = await response.json();


      const category = result.product_categories.map((category) => {
        return {
          label: category.name,
          value: category.id,
        };
      });

    

      setCategoryOption(category);


      console.log("Brand Data:", category);
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
        "https://gsidev.ordosolution.com/api/driverlist/",
        requestOptions
      );
      const result = await response.json();
      const type = result.driver.map((brand) => {
        return {
          label: brand.label,
          value: brand.value,
        };
      });

      setDriverDrop(type);
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
        "https://gsidev.ordosolution.com/api/choices/",
        requestOptions
      );
      const result = await response.json();
      const type = result.truck_type_choices.map((brand) => {
        return {
          label: brand.label,
          value: brand.value,
        };
      });
      setTypeDrop(type);

      const makes = result.makes.map((category) => {
        return {
          label: category.label,
          value: category.value,
        };
      });

      setMakeDrop(makes);

      const fuelDrop = result.fuel_types.map((fuel_types) => {
        return {
          label: fuel_types.label,
          value: fuel_types.value,
        };
      });

      setFuelDrop(fuelDrop);
    } catch (error) {
      console.log("error", error);
    }
  };

  const InputWithLabel = ({ title, value, onPress }) => {
    const textColor =
      displayValue === "Select Start Date - End Date" ? "#cecece" : "black";
    return (
      <View>
        <Text style={styles.labelText}>{title}</Text>
        <Pressable style={{ ...styles.inputContainer }} onPress={onPress}>
          <Text style={{ ...styles.input2, color: textColor }}>
            {displayValue}
          </Text>
          <Image
            style={{ width: 20, height: 20, marginRight: 15 }}
            source={require("../../assets/images/calendar.png")}
          ></Image>
        </Pressable>
      </View>
    );
  };

  const InputWithLabel1 = ({ title, value, onPress }) => {
    const textColor =
      displayValue1 === "Select Start Date - End Date" ? "#cecece" : "black";
    return (
      <View>
        <Text style={styles.labelText}>{title}</Text>
        <Pressable style={{ ...styles.inputContainer }} onPress={onPress}>
          <Text style={{ ...styles.input2, color: textColor }}>
            {displayValue1}
          </Text>
          <Image
            style={{ width: 20, height: 20, marginRight: 15 }}
            source={require("../../assets/images/calendar.png")}
          ></Image>
        </Pressable>
      </View>
    );
  };

  const InputWithLabel2 = ({ title, value, onPress }) => {
    const textColor = !value ? "#cecece" : "black";
    return (
      <View>
        <Text style={styles.labelText}>{title}</Text>
        <Pressable style={{ ...styles.inputContainer }} onPress={onPress}>
          <Text style={{ ...styles.input2, color: textColor }}>
            {value ? value : "Select Last Modified Date"}
          </Text>
          <Image
            style={{ width: 20, height: 20, marginRight: 15 }}
            source={require("../../assets/images/calendar.png")}
          ></Image>
        </Pressable>
      </View>
    );
  };

  const optionData = [
    { label: "Quarterly", value: "Quarterly" },
    { label: "Monthly", value: "Monthly" },
    { label: "Weekly", value: "Weekly" },
  ];

  //date picker hooks
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    if (details && details.vehicle_category) {
      setVehicleCat(details.vehicle_category);
    }
  }, [details]);

  const handleSubmit = async () => {

    const requiredFields = [
      { key: 'Driver', value: driver },
      { key: 'Chassis Number', value: chassisNumber },
      { key: 'Emissions Start Date', value: emissionsStartDate },
      { key: 'Emissions End Date', value: emissionEndDate },
      { key: 'Insurance Start Date', value: insuranceStartDate },
      { key: 'Insurance End Date', value: insuranceEndDate },
      { key: 'Vehicle Type', value: vehicleName },
      { key: 'Year', value: year },
      { key: 'Fuel Type', value: fuelType },
      { key: 'Registration Number', value: vehicleNumber },
      { key: 'Make', value: make },
      { key: 'Model', value: model },
      { key: 'Current Odometer', value: odometer },
      { key: 'Vehicle Category', value: vehicleCat },
      { key: 'Vehicle Capacity', value: capacity },
      { key: 'Company', value: company },
      { key: 'Last Maintenance Date', value: lastModDate }
    ];
  
    const missingFields = requiredFields.filter(field => !field.value).map(field => field.key);
  
    if (missingFields.length > 0) {
      Alert.alert("Error", `The following fields are required: ${missingFields.join(', ')}`);
      return;
    }

    setLoading(true);

    let url = screen === "add" ? 'https://gsidev.ordosolution.com/api/vehicle/' : `https://gsidev.ordosolution.com/api/vehicle/${details.id}/`

    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${userData.token}`);
    myHeaders.append("Content-Type", "application/json");

    let driverArray = []
    driverArray.push(driver)

    var raw = JSON.stringify({
      driver_id: driver,
      chassis_number: chassisNumber,
      emission_start_date: moment(emissionsStartDate, "DD/MM/YYYY").format(
        "YYYY-MM-DD"
      ),
      emission_end_date: moment(emissionEndDate, "DD/MM/YYYY").format(
        "YYYY-MM-DD"
      ),
      insurance_start_date: moment(insuranceStartDate, "DD/MM/YYYY").format(
        "YYYY-MM-DD"
      ),
      insurance_end_date: moment(insuranceEndDate, "DD/MM/YYYY").format(
        "YYYY-MM-DD"
      ),
      vehicle_type: vehicleName,
      year: year,
      fuel_type: fuelType,
      registration_no: vehicleNumber,
      make: make,
      model: model,
      current_odometer: odometer,
      status: status,
      vehicle_category:vehicleCat,
      vehicle_capacity:capacity,
      company:company,
      last_maintenance_date: moment(lastModDate, "DD/MM/YYYY").format(
        "YYYY-MM-DD"
      ),
    });

    // console.log("base 64", base64img);
    console.log("raw", raw);

    var requestOptions = {
      method: screen === "add" ? "POST" : "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };


    try {
      const response = await fetch(
        url,
        requestOptions
      );
      // console.log("resss", response)
      const result = await response.json();
      console.log("response", result)
      if (response.status === 201 || response.status === 200) {
        if (screen === "add") {
          Toast.show("Vehicle added successfully", Toast.LONG);
          navigation.goBack();

        } else {
          Toast.show("Details updated successfully", Toast.LONG);
          navigation.pop(2);

        }
      }
      else {
        // Display alert with the result message
        Alert.alert("Error", "Something went wrong");
      }


    } catch (error) {
      console.log("error", error);
    }


    setLoading(false);

  };


  const displayValue = 
    emissionsStartDate && emissionEndDate
      ? `${emissionsStartDate} - ${emissionEndDate}`
      : "Select Start Date - End Date";

  const displayValue1 =
    insuranceStartDate && insuranceEndDate
      ? `${insuranceStartDate} - ${insuranceEndDate}`
      : "Select Start Date - End Date";

      const renderLabel = (label, focus, value) => {
        if ((Array.isArray(value) && value.length > 0) || (!Array.isArray(value) && value)) {
            return (
                <Text style={[styles.labelll, (label == "Source" || label == "Destination") && { top: 8 }]}>
                    {label}
                </Text>
            );
        }
        return null;
      };

  return (
    <View style={styles.rootContainer}>
      <View style={{ height: "35%" }}>
        <LinearGradient
          colors={Colors.linearColors}
          start={Colors.start}
          end={Colors.end}
          locations={Colors.ButtonsLocation}
          style={{
            borderBottomRightRadius: ms(50),
            borderBottomLeftRadius: ms(50),
            paddingHorizontal: "5%",
            paddingTop: "5%",
            height: "70%",
          }}
        >
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}
            >
              <Image
                source={require("../../assets/images/Refund_back.png")}
                style={{ height: 30, width: 30 }}
              />
            </TouchableOpacity>

            <View>
              <Text
                style={{
                  color: "white",
                  fontSize: ms(20),
                  fontFamily: "AvenirNextCyr-Medium",
                }}
              >
                Add Vehicle
              </Text>
              <Text
                style={{
                  color: "white",
                  fontSize: ms(12),
                  fontFamily: "AvenirNextCyr-Medium",
                }}
              >
              </Text>
            </View>

         <Text>   </Text>
          </View>

        </LinearGradient>
          <Image
              style={{
                height: "100%",
                width: "100%",
                resizeMode: "contain",
                position: "absolute",
                marginTop: "9%",
              }}
              source={require("../../assets/images/box_truck.png")}
            />
      </View>

      <View style={{ padding: 20, flex: 1 }}>
      <View style={{flexDirection:'row',alignItems:'center',textAlign:'center',justifyContent:'flex-end'}}>
     <View>
     <Text style={{
                  color:isSwitchOn ? 'green' : 'tomato',
                  fontSize: ms(14),
                  fontFamily: "AvenirNextCyr-Bold",
                }}>{isSwitchOn ? 'Active' : 'Inactive'}</Text>
     </View> 
     <View>
              <Switch
                value={isSwitchOn}
                onValueChange={onToggleSwitch}
                color="green"
              />
              </View>
            </View>
        <ScrollView style={{}}>
          <FloatingInput
            mode="outlined"
            label={<Text style={styles.placeholderStyle}>Vehicle Number</Text>}
            theme={{ colors: { onSurfaceVariant: "#4b0482" } }}
            style={{ backgroundColor: "white", marginBottom: '4%',fontFamily: "AvenirNextCyr-Medium",}}
            activeOutlineColor="#4b0482"
            outlineColor="#B6B4B4"
            textColor='#4b0482'
            onChangeText={(text) => setVehicleNumber(text)}
            autoCapitalize="none"
            blurOnSubmit={false}
            // keyboardType="number-pad"
            returnKeyType="done"
            value={vehicleNumber}
            onSubmitEditing={() => Keyboard.dismiss()}
            maxLength={10}
          />

          {/* <Text style={styles.label}>Vehicle Type</Text> */}
          <View style={{marginVertical:'0%'}}>
{renderLabel("Truck Type", isFocus4, vehicleName)}
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
            placeholder={!isFocus4 ? "Select Truck Type" : "..."}
            value={vehicleName}
            onFocus={() => setIsFocus4(true)}
            onBlur={() => setIsFocus4(false)}
            onChange={(item) => {
              setVehicleName(item.value);
              setIsFocus4(false);
            }}
          />
          </View>

          {/* <Text style={styles.label}>Driver</Text> */}
          <View style={{marginVertical:'0%'}}>
          {renderLabel("Driver", isFocus3, driver)}
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
            placeholder={!isFocus3 ? "Select Driver" : "..."}
            value={driver}
            onFocus={() => setIsFocus3(true)}
            onBlur={() => setIsFocus3(false)}
            onChange={(item) => {
              setDriver(item.value);
              setIsFocus3(false);
            }}
          />
</View>


<View style={{marginVertical:'1%'}}>
{renderLabel("Categories", isFocus4, vehicleCat)}
<MultiSelect
                style={[styles.dropdown]}
                containerStyle={styles.dropdownContainer}
                placeholderStyle={styles.placeholderStyle}
                searchPlaceholder="Search"
                selectedTextStyle={styles.selectedTextStyle}
                itemTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                search
                data={categoryOption}
                labelField="label"
                valueField="value"
                placeholder={vehicleCat.length > 0 ? '...' : "Select Categories"}
                value={vehicleCat}
                onChange={item => {
                    setVehicleCat(item);

                }}
                renderSelectedItem={(item, unSelect) => (
                    <TouchableOpacity onPress={() => unSelect && unSelect(item)}>
                        <View style={styles.selectedStyle}>
                            <Text style={styles.textSelectedStyle}>{item.label}</Text>
                            <AntDesign color="black" name="closecircleo" size={17} />
                        </View>
                    </TouchableOpacity>
                )}
            />
            </View>

        <FloatingInput
            mode="outlined"
            label={<Text style={styles.placeholderStyle}>Capacity</Text>}
            theme={{ colors: { onSurfaceVariant: "#4b0482" } }}
            style={{ backgroundColor: "white", marginBottom: '4%' }}
            activeOutlineColor="#4b0482"
            outlineColor="#B6B4B4"
            textColor="#4b0482"
            onChangeText={(text) => setCapacity(text)}
            autoCapitalize="none"
            blurOnSubmit={false}
            onSubmitEditing={() => Keyboard.dismiss()}
            keyboardType="number-pad"
            returnKeyType="done"
            value={capacity}
          />

          <FloatingInput
            mode="outlined"
            label={<Text style={styles.placeholderStyle}>Chassis No.</Text>}
            theme={{ colors: { onSurfaceVariant: "#4b0482" } }}
            style={{ backgroundColor: "white", marginBottom: '4%' }}
            activeOutlineColor="#4b0482"
            outlineColor="#B6B4B4"
            textColor="#4b0482"
            onChangeText={(text) => setchassisNumber(text)}
            autoCapitalize="none"
            blurOnSubmit={false}
            // keyboardType="number-pad"
            onSubmitEditing={() => Keyboard.dismiss()}
            returnKeyType="done"
            value={chassisNumber}
            maxLength={17}
          />

          <FloatingInput
            mode="outlined"
            label={<Text style={styles.placeholderStyle}>Model</Text>}
            theme={{ colors: { onSurfaceVariant: "#4b0482" } }}
            style={{ backgroundColor: "white", marginBottom: '4%' }}
            activeOutlineColor="#4b0482"
            outlineColor="#B6B4B4"
            textColor="#4b0482"
            onChangeText={(text) => setModel(text)}
            autoCapitalize="none"
            blurOnSubmit={false}
            onSubmitEditing={() => Keyboard.dismiss()}
            // keyboardType="number-pad"
            returnKeyType="done"
            value={model}
          />

          {/* <Text style={styles.label}>Make</Text> */}
          <Dropdown
            style={[styles.dropdown]}
            containerStyle={styles.dropdownContainer}
            placeholderStyle={styles.placeholderStyle}
            searchPlaceholder="Search"
            selectedTextStyle={styles.selectedTextStyle}
            itemTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={makeDrop}
            maxHeight={400}
            labelField="label"
            valueField="value"
            placeholder={!isFocus ? "Select Make" : "..."}
            value={make}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={(item) => {
              setMake(item.value);
              setIsFocus(false);
            }}
          />

<Dropdown
            style={[styles.dropdown]}
            containerStyle={styles.dropdownContainer}
            placeholderStyle={styles.placeholderStyle}
            searchPlaceholder="Search"
            selectedTextStyle={styles.selectedTextStyle}
            itemTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={companyOpt}
            maxHeight={400}
            labelField="label"
            valueField="value"
            placeholder={!isFocus5 ? "Select Company" : "..."}
            value={company}
            onFocus={() => setIsFocus5(true)}
            onBlur={() => setIsFocus5(false)}
            onChange={(item) => {
              setCompany(item.value);
              setIsFocus5(false);
            }}
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
            placeholder={!isFocus2 ? "Select Fuel Type" : "..."}
            value={fuelType}
            onFocus={() => setIsFocus2(true)}
            onBlur={() => setIsFocus2(false)}
            onChange={(item) => {
              setFuelType(item.value);
              setIsFocus2(false);
            }}
          />

          <FloatingInput
            mode="outlined"
            label={<Text style={styles.placeholderStyle}>Odometer</Text>}
            theme={{ colors: { onSurfaceVariant: "#4b0482" } }}
            style={{ backgroundColor: "white", marginBottom: '4%' }}
            activeOutlineColor="#4b0482"
            outlineColor="#B6B4B4"
            textColor="#4b0482"
            onChangeText={(text) => setOdometer(text)}
            autoCapitalize="none"
            blurOnSubmit={false}
            onSubmitEditing={() => Keyboard.dismiss()}
            keyboardType="number-pad"
            returnKeyType="done"
            value={odometer}
          />

          <FloatingInput
            mode="outlined"
            label={<Text style={styles.placeholderStyle}>Year</Text>}
            theme={{ colors: { onSurfaceVariant: "#4b0482" } }}
            style={{ backgroundColor: "white", marginBottom: '4%'}}
            activeOutlineColor="#4b0482"
            outlineColor="#B6B4B4"
            textColor="#4b0482"
            onChangeText={(text) => setYear(text)}
            autoCapitalize="none"
            blurOnSubmit={false}
            keyboardType="number-pad"
            onSubmitEditing={() => Keyboard.dismiss()}
            returnKeyType="done"
            value={year}
          />

          <View
            style={{ justifyContent: "center", flex: 1, alignItems: "center" }}
          >
            <InputWithLabel
              title="Emission Date"
              value={displayValue}
              onPress={() => setVisible(true)}
            />

            <DatePickerModal
              mode="range"
              visible={visible}
              onDismiss={onDismiss}
              startDate={undefined}
              endDate={undefined}
              onConfirm={onChange}
              saveLabel="Save"
              label="Select Period"
              startLabel="From"
              endLabel="To"
              animationType="slide"
              presentationStyle="pageSheet"
              
            />
          </View>

          <View
            style={{
              justifyContent: "center",
              flex: 1,
              alignItems: "center",
              marginTop: "5%",
            }}
          >
            <InputWithLabel1
              title="Insurance Date"
              value={displayValue1}
              onPress={() => setVisible1(true)}
            />

            <DatePickerModal
              mode="range"
              visible={visible1}
              onDismiss={onDismiss1}
              startDate={undefined}
              endDate={undefined}
              onConfirm={onChange1}
              saveLabel="Save"
              label="Select Period"
              startLabel="From"
              endLabel="To"
              animationType="slide"
              presentationStyle="pageSheet"
            />
          </View>

          <View
            style={{
              justifyContent: "center",
              flex: 1,
              alignItems: "center",
              marginTop: "5%",
              marginBottom:'3%'
            }}
          >
            <InputWithLabel2
              title="Last Maintenance Date"
              value={lastModDate}
              onPress={() => setVisible2(true)}
            />

            <DatePickerModal
              mode="single"
              visible={visible2}
              onDismiss={onDismiss2}
              date={date}
              onConfirm={onChange2}
              saveLabel="Save"
              label="Select date"
              animationType="slide"
              presentationStyle="pageSheet"
            />
          </View>
          {/* 
          <Text style={[styles.label, { marginTop: "4%" }]}>
            Upload Insurance
          </Text>

          <TouchableOpacity
            style={styles.ContainerBox4}
            onPress={() => setInsuranceModalVisible(true)}
          >
            <View>{renderSelectedInsuranceImage()}</View>

            <View style={{ flex: 1 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={styles.texts}>
                  {selectedInsuranceImage ? "Uploaded" : "Click to upload"}
                </Text>
                {selectedInsuranceImage && (
                  <TouchableOpacity
                    onPress={() => setSelectedInsuranceImage(null)}
                  >
                    <AntDesign name="delete" size={19} color={Colors.primary} />
                  </TouchableOpacity>
                )}
              </View>

              <ProgressBar
                progress={selectedInsuranceImage ? 1 : 0.1}
                color={Colors.primary}
                style={{ height: 7, borderRadius: 5, marginTop: "3%" }}
              />
            </View>
          </TouchableOpacity> */}

          {/* <Text style={[styles.label, { marginTop: "4%" }]}>Upload RC</Text>
          <TouchableOpacity
            style={styles.ContainerBox4}
            onPress={() => setRcModalVisible(true)}
          >
            <View>{renderSelectedRcImage()}</View>

            <View style={{ flex: 1 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.texts}>
                  {selectedRcImage ? "Uploaded" : "Click to upload"}
                </Text>
                {selectedRcImage && (
                  <TouchableOpacity onPress={() => setSelectedRcImage(null)}>
                    <AntDesign name="delete" size={19} color={Colors.primary} />
                  </TouchableOpacity>
                )}
              </View>

              <ProgressBar
                progress={selectedRcImage ? 1 : 0.1}
                color={Colors.primary}
                style={{ height: 7, borderRadius: 5, marginTop: "3%" }}
              />
            </View>
          </TouchableOpacity> */}
        </ScrollView>

        <LinearGradient
          colors={Colors.linearColors}
          start={Colors.start}
          end={Colors.end}
          locations={Colors.ButtonsLocation}
          style={{
            backgroundColor: Colors.primary,
            borderColor: Colors.primary,
            borderRadius: ms(25),
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            marginTop: "5%",
          }}
        >
          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit}
            activeOpacity={0.8}
          >
            <Text style={styles.btnText}>Submit</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>

      <LoadingView visible={loading} message="Please wait..." />

      <Modal
        animationType="slide"
        transparent={true}
        visible={rcModalVisible}
        onRequestClose={() => setRcModalVisible(false)}
      ></Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={insuranceModalVisible}
        onRequestClose={() => setRcModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Upload Insurance</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={selectInsuranceFromGallery}
            >
              <Text style={styles.modalButtonText}>Select from Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={captureInsuranceFromCamera}
            >
              <Text style={styles.modalButtonText}>Capture from Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setInsuranceModalVisible(false)}
            >
              <Text style={styles.modalCancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={rcModalVisible}
        onRequestClose={() => setRcModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Upload RC</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={selectRcFromGallery}
            >
              <Text style={styles.modalButtonText}>Select from Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={captureRcFromCamera}
            >
              <Text style={styles.modalButtonText}>Capture from Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setRcModalVisible(false)}
            >
              <Text style={styles.modalCancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  container: {
    paddingHorizontal: "5%",
    paddingTop: 10,
    backgroundColor: "white",
    flex: 1,
  },
  textInput: {
    borderColor: "#dedede",
    borderWidth: 1,
    backgroundColor: "white",
    height: 50,
    marginBottom: "5%",
    padding: 5,
    paddingLeft: 8,
    fontFamily: "AvenirNextCyr-Medium",
    borderRadius: 10,
  },
  button: {
    height: vs(30),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: ms(5),
    marginBottom: "3%",
    marginTop: "3%",
    borderRadius: 50,
    width: "100%",
  },
  btnText: {
    fontFamily: "AvenirNextCyr-Bold",
    color: "#fff",
    fontSize: 16,
  },
  buttonview: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 16,
    color: "black",
    fontFamily: "AvenirNextCyr-Bold",
  },
  buttonText: {
    fontFamily: "AvenirNextCyr-Medium",
    color: "white",
  },
  label: {
    fontSize: 16,
    color: Colors.primary,
    fontFamily: "AvenirNextCyr-Bold",
  },
  dropdown: {
    height: 50,
    borderColor: "#a5a5a5",
    borderWidth: 1,
    paddingHorizontal: 8,
    marginBottom: "5%",
    borderRadius: 5,
    backgroundColor: "white",
  },
  icon: {
    marginRight: 5,
  },

  placeholderStyle: {
    fontSize: 16,
    fontFamily: "AvenirNextCyr-Medium",
    color: Colors.primary
  },
  dropdownContainer: {
    backgroundColor: "white",
  },
  selectedTextStyle: {
    fontSize: 16,
    fontFamily: "AvenirNextCyr-Medium",
    color: 'black'
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
    marginBottom: 5,
    fontFamily: "AvenirNextCyr-Medium",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 7,
    height: "72%",
    width: "100%",
  },
  input2: {
    fontFamily: "AvenirNextCyr-Medium",
    padding: 8,
    flex: 1,
  },
  graphContainer: {
    borderRadius: 30,
    paddingVertical: "2%",
    paddingHorizontal: "2%",
    position: "relative",
    bottom: "23%",
    ...globalStyles.border,
    alignItems: "center",
    // backgroundColor:'yellow',
    marginTop:'6%'
  },

  header: {
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  iocnView: {
    backgroundColor: "#FAF7F9",
    borderWidth: 1,
    borderColor: "lightgray",
    borderRadius: 6,
    paddingHorizontal: "2%",
    paddingVertical: "2%",
  },
  ContainerBox4: {
    paddingHorizontal: "4%",
    paddingVertical: "3%",
    borderColor: "lightgray",
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 9,
    borderWidth: 1,
    gap: 10,
  },
  DocsImg: {
    height: 55,
    width: 45,
    paddingVertical: "7%",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 19,
    fontWeight: "bold",
    marginBottom: "8%",
  },
  modalButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
    width: "90%",
    elevation: 8,
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
  modalCancelButton: {
    backgroundColor: "red",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: "4%",
    elevation: 8,
  },
  modalCancelButtonText: {
    color: "white",
    fontSize: 16,
  },
  texts: {
    color: 'black',
    marginTop: "4%",
    fontFamily: "AvenirNextCyr-Medium",
  },
  selectedStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
    backgroundColor: 'white',
    marginTop: 8,
    marginRight: 12,
    paddingHorizontal: '3%',
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'black'

},
textSelectedStyle: {
    marginRight: 5,
    fontSize: 16,
    color:'black'
},
labelll: {
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

export default AddVehicle;
