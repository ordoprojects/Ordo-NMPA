import React, { useState, useContext, useRef, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  Text,
  Image,
  Alert,
  ScrollView,
  Modal,
  KeyboardAvoidingView
} from "react-native";
import Colors from "../../constants/Colors";
import { AuthContext } from "../../Context/AuthContext";
import LinearGradient from "react-native-linear-gradient";
import { ms, hs, vs } from "../../utils/Metrics";
import globalStyles from "../../styles/globalStyles";
import { Switch, Button, TextInput as TextInput1 } from "react-native-paper";
import { ProgressBar } from "react-native-paper";
import startOfYesterday from "date-fns/startOfYesterday/index.js";
import Toast from "react-native-simple-toast";
import { forModalPresentationIOS } from "@react-navigation/stack/lib/typescript/src/TransitionConfigs/CardStyleInterpolators";
import { LoadingView } from "../../components/LoadingView";

const AddDriver = ({ navigation, route }) => {
  //drop down hooks
  const [categoryOption, setCategoryOption] = useState([]);
  const [currencyOption, setCurrencyOption] = useState([]);
  const [taxOption, setTaxOption] = useState([]);
  const [unitOption, setUnitOption] = useState([]);
  const { screen, details } = route?.params;
  const [isSwitchOn, setIsSwitchOn] = React.useState(true);
  const [status, setStatus] = useState("");

  const [drivingLicenseModalVisible, setDrivingLicenseModalVisible] =
    useState(false);
  const [panCardModalVisible, setPanCardModalVisible] = useState(false);
  const [bankChequeModalVisible, setBankChequeModalVisible] = useState(false);
  const [addressProofModalVisible, setAddressProofModalVisible] =
    useState(false);

  const [selectedDrivingLicenseImage, setSelectedDrivingLicenseImage] =
    useState(null);
  const [selectedPanCardImage, setSelectedPanCardImage] = useState(null);
  const [selectedBankChequeImage, setSelectedBankChequeImage] = useState(null);
  const [selectedAddressProofImage, setSelectedAddressProofImage] =
    useState(null);

  const selectDrivingLicenseFromGallery = () => {
    launchImageLibrary({ mediaType: "photo" }, (response) => {
      if (!response.didCancel) {
        setDrivingLicenseModalVisible(false);
        setSelectedDrivingLicenseImage(response.assets[0]);
      }
    });
  };

  const captureDrivingLicenseFromCamera = () => {
    launchCamera({ mediaType: "photo" }, (response) => {
      if (!response.didCancel) {
        setDrivingLicenseModalVisible(false);
        setSelectedDrivingLicenseImage(response.assets[0]);
      }
    });
  };

  const selectPanCardFromGallery = () => {
    launchImageLibrary({ mediaType: "photo" }, (response) => {
      if (!response.didCancel) {
        setPanCardModalVisible(false);
        setSelectedPanCardImage(response.assets[0]);
      }
    });
  };

  const capturePanCardFromCamera = () => {
    launchCamera({ mediaType: "photo" }, (response) => {
      if (!response.didCancel) {
        setPanCardModalVisible(false);
        setSelectedPanCardImage(response.assets[0]);
      }
    });
  };

  const selectBankChequeFromGallery = () => {
    launchImageLibrary({ mediaType: "photo" }, (response) => {
      if (!response.didCancel) {
        setBankChequeModalVisible(false);
        setSelectedBankChequeImage(response.assets[0]);
      }
    });
  };

  const captureBankChequeFromCamera = () => {
    launchCamera({ mediaType: "photo" }, (response) => {
      if (!response.didCancel) {
        setBankChequeModalVisible(false);
        setSelectedBankChequeImage(response.assets[0]);
      }
    });
  };

  const selectAddressProofFromGallery = () => {
    launchImageLibrary({ mediaType: "photo" }, (response) => {
      if (!response.didCancel) {
        setAddressProofModalVisible(false);
        setSelectedAddressProofImage(response.assets[0]);
      }
    });
  };

  const captureAddressProofFromCamera = () => {
    launchCamera({ mediaType: "photo" }, (response) => {
      if (!response.didCancel) {
        setAddressProofModalVisible(false);
        setSelectedAddressProofImage(response.assets[0]);
      }
    });
  };

  // Render the selected images
  const renderSelectedDrivingLicenseImage = () => {
    if (selectedDrivingLicenseImage) {
      return (
        <Image
          source={{ uri: selectedDrivingLicenseImage.uri }}
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

  const renderSelectedPanCardImage = () => {
    if (selectedPanCardImage) {
      return (
        <Image
          source={{ uri: selectedPanCardImage.uri }}
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

  const renderSelectedBankChequeImage = () => {
    if (selectedBankChequeImage) {
      return (
        <Image
          source={{ uri: selectedBankChequeImage.uri }}
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

  const renderSelectedAddressProofImage = () => {
    if (selectedAddressProofImage) {
      return (
        <Image
          source={{ uri: selectedAddressProofImage.uri }}
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

  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);

  useEffect(() => {
    // This effect runs after the component has rendered or when isSwitchOn changes
    if (isSwitchOn === true) {
      setStatus("Active");
    } else {
      setStatus("InActive");
    }
    //   console.log('Status:', status);
  }, [isSwitchOn]);

  const getDropDown = () => {
    fetch("https://dev.ordo.primesophic.com/get_dropdownfields.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        __module_name__: "AOS_Products",
      }),
    })
      .then((response) => response.json())
      .then(async (res) => {
        console.log("drop down api res", res);
        //Category dropdown
        const categoryArray = Object.keys(res?.product_categories_array).map(
          (key) => ({
            label: res?.product_categories_array[key],
            value: key,
          })
        );
        console.log("category option", categoryArray);
        setCategoryOption(categoryArray);

        //currency dropdown
        const currencyArray = Object.keys(res?.currencies_array).map((key) => ({
          label: res?.currencies_array[key],
          value: key,
        }));
        console.log("currency option", currencyArray);
        setCurrencyOption(currencyArray);

        //tax dropdown
        const taxArray = Object.keys(res?.tax).map((key) => ({
          label: res?.tax[key],
          value: key,
        }));
        console.log("tax option", taxArray);
        setTaxOption(taxArray);

        //unit of measure  dropdown
        const unitArray = Object.keys(res?.unitofmeasure).map((key) => ({
          label: res?.unitofmeasure[key],
          value: key,
        }));
        console.log("unit of measure option", unitArray);
        setUnitOption(unitArray);
      })
      .catch((error) => {
        // Handle the error here
        console.log(error);
      });
  };

  const { token, userData } = useContext(AuthContext);
  const [contact, setContact] = useState(details?.phone);
  const [name, setName] = useState(details?.first_name);
  const [lastName, setLastName] = useState(details?.last_name);
  const [email, setEmail] = useState(details?.email);
  const [licence, setLicence] = useState(details?.license_number);
  const [address, setAddress] = useState(details?.address);
  const [city, setCity] = useState(details?.city);
  const [state, setState] = useState(details?.state);
  const [country, setCountry] = useState(details?.country);
  const [loading, setloading] = useState(false);

  const input1Ref = useRef(null);
  const input2Ref = useRef(null);
  const input3Ref = useRef(null);
  const input4Ref = useRef(null);
  const input5Ref = useRef(null);
  const input6Ref = useRef(null);
  const input7Ref = useRef(null);
  const input8Ref = useRef(null);
  const input9Ref = useRef(null);

  const isValidEmail = (email) => {
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.(com|org|net|edu|gov|mil|biz|info|mobi|name|aero|jobs|in)$/;
    return emailRegex.test(email);
  };

  const isValidLicense = (licence) => {
    const licenceRegex = /^[A-Z]{2}\d{2}\d{4}\d{7}$/;
    return licenceRegex.test(licence);
  };

  const handleSubmit = async () => {
    if (
      !name ||
      !lastName ||
      !licence ||
      !contact ||
      !email ||
      !address ||
      !state ||
      !country
    ) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert("Error", "Invalid email address", [
        { text: "OK", onPress: () => console.log("OK Pressed") },
      ]);
      return;
    }

    if (!isValidLicense(licence)) {
      Alert.alert(
        "Error",
        "Invalid license number. The correct format is: AA##DDDD#######",
        [{ text: "OK", onPress: () => console.log("OK Pressed") }]
      );
      return;
    }

    setloading(true);

    let url =
      screen === "add"
        ? "https://gsidev.ordosolution.com/api/driver/"
        : `https://gsidev.ordosolution.com/api/driver/${details.id}/`;

    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${userData.token}`);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      first_name: name,
      last_name: lastName,
      license_number: licence,
      phone: contact,
      email: email,
      status: status,
      address: address,
      city: city,
      state: state,
      country: country,
    });

    var requestOptions = {
      method: screen === "add" ? "POST" : "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    try {
      const response = await fetch(url, requestOptions);
      console.log("resss", response);
      const result = await response.json();
      if (response.status === 201 || response.status === 200) {
        if (screen === "add") {
          Toast.show("Driver added successfully", Toast.LONG);
          navigation.goBack();
        } else {
          Toast.show("Details updated successfully", Toast.LONG);
          navigation.pop(2);
        }
      } else {
        // Display alert with the result message
        Alert.alert("Error",result.msg);
      }
    } catch (error) {
      console.log("error", error);
    }
    setloading(false);
  };

  useEffect(() => {
    getDropDown();
  }, []);

  const handlePhoneNumberChange = (text) => {
    // Remove non-digit characters from input
    const formattedPhoneNumber = text.replace(/[^\d]/g, "");

    // Limit the length of the phone number to 10 digits
    if (formattedPhoneNumber.length <= 10) {
      setContact(formattedPhoneNumber);
    }
  };

  return (
    
    <View style={styles.rootContainer}>
              <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
      <View style={{ height: "18%" }}>
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
            height: "100%",
          }}
        >
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            {/* <View style={{ flexDirection: 'row', gap: hs(60) }}> */}

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

            <Text
              style={{
                color: "white",
                fontSize: ms(20),
                fontFamily: "AvenirNextCyr-Medium",
              }}
            >
              {screen === "add" ? "Add" : "Edit"} Driver
            </Text>
            <Text
              style={{
                color: "white",
                fontSize: ms(12),
                fontFamily: "AvenirNextCyr-Thin",
              }}
            >
              {" "}
            </Text>
          </View>
        </LinearGradient>
        <Image
          style={{
            height: "100%",
            width: "100%",
            resizeMode: "contain",
            position: "absolute",
            marginTop: "15%",
          }}
          source={require("../../assets/images/AddDriver.png")}
        />
      </View>

      <View style={{ padding: 20, flex: 1, marginTop: "10%" }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            textAlign: "center",
            justifyContent: "flex-end",
          }}
        >
          <View>
            <Text
              style={{
                color: isSwitchOn ? "green" : "tomato",
                fontSize: ms(14),
                fontFamily: "AvenirNextCyr-Bold",
              }}
            >
              {isSwitchOn ? "Active" : "Inactive"}
            </Text>
          </View>
          <View>
            <Switch
              value={isSwitchOn}
              onValueChange={onToggleSwitch}
              color="green"
            />
          </View>
        </View>
        <ScrollView>
          <TextInput1
            mode="outlined"
            label="First Name"
            theme={{ colors: { onSurfaceVariant: "#4b0482" } }}
            activeOutlineColor="#4b0482"
            outlineColor="#B6B4B4"
            textColor="#4b0482"
            onChangeText={(text) => setName(text)}
            value={name}
            ref={input1Ref}
            returnKeyType="next"
            onSubmitEditing={() => input2Ref.current.focus()}
            blurOnSubmit={false}
            outlineStyle={{ borderRadius: ms(10) }}
            style={{ marginBottom: "5%", height: 0, backgroundColor: "white" }}
          />

          <TextInput1
            mode="outlined"
            label="Last Name"
            theme={{ colors: { onSurfaceVariant: "#4b0482" } }}
            activeOutlineColor="#4b0482"
            outlineColor="#B6B4B4"
            textColor="#4b0482"
            onChangeText={(text) => setLastName(text)}
            value={lastName}
            ref={input2Ref}
            returnKeyType="next"
            onSubmitEditing={() => input3Ref.current.focus()}
            blurOnSubmit={false}
            outlineStyle={{ borderRadius: ms(10) }}
            style={{ marginBottom: "5%", height: 0, backgroundColor: "white" }}
          />

          <TextInput1
            mode="outlined"
            label="Email"
            value={email}
            theme={{ colors: { onSurfaceVariant: "#4b0482" } }}
            activeOutlineColor="#4b0482"
            outlineColor="#B6B4B4"
            textColor="#4b0482"
            onChangeText={(text) => setEmail(text)}
            ref={input3Ref}
            returnKeyType="next"
            onSubmitEditing={() => input4Ref.current.focus()}
            blurOnSubmit={false}
            outlineStyle={{ borderRadius: ms(10) }}
            style={{ marginBottom: "5%", height: 0, backgroundColor: "white" }}
          />

          <TextInput1
            mode="outlined"
            label="Phone"
            value={contact}
            theme={{ colors: { onSurfaceVariant: "#4b0482" } }}
            activeOutlineColor="#4b0482"
            outlineColor="#B6B4B4"
            textColor="#4b0482"
            onChangeText={handlePhoneNumberChange}
            keyboardType="numeric"
            ref={input4Ref}
            returnKeyType="next"
            onSubmitEditing={() => input5Ref.current.focus()}
            blurOnSubmit={false}
            outlineStyle={{ borderRadius: ms(10) }}
            style={{ marginBottom: "5%", height: 0, backgroundColor: "white" }}
          />

          <TextInput1
            mode="outlined"
            label="License"
            value={licence}
            theme={{ colors: { onSurfaceVariant: "#4b0482" } }}
            activeOutlineColor="#4b0482"
            outlineColor="#B6B4B4"
            textColor="#4b0482"
            onChangeText={(text) => setLicence(text)}
            ref={input5Ref}
            returnKeyType="next"
            onSubmitEditing={() => input6Ref.current.focus()}
            blurOnSubmit={false}
            multiline={false}
            outlineStyle={{ borderRadius: ms(10) }}
            style={{ marginBottom: "5%", height: 0, backgroundColor: "white" }}
          />

          <TextInput1
            mode="outlined"
            label="City"
            value={city}
            theme={{ colors: { onSurfaceVariant: "#4b0482" } }}
            activeOutlineColor="#4b0482"
            outlineColor="#B6B4B4"
            textColor="#4b0482"
            onChangeText={(text) => setCity(text)}
            ref={input6Ref}
            onSubmitEditing={() => input7Ref.current.focus()}
            returnKeyType="next"
            blurOnSubmit={false}
            outlineStyle={{ borderRadius: ms(10) }}
            style={{ marginBottom: "5%", height: 0, backgroundColor: "white" }}
          />

          <TextInput1
            mode="outlined"
            label="State"
            value={state}
            theme={{ colors: { onSurfaceVariant: "#4b0482" } }}
            activeOutlineColor="#4b0482"
            outlineColor="#B6B4B4"
            textColor="#4b0482"
            onChangeText={(text) => setState(text)}
            ref={input7Ref}
            onSubmitEditing={() => input8Ref.current.focus()}
            returnKeyType="next"
            blurOnSubmit={false}
            outlineStyle={{ borderRadius: ms(10) }}
            style={{ marginBottom: "5%", height: 0, backgroundColor: "white" }}
          />

          <TextInput1
            mode="outlined"
            label="Country"
            value={country}
            theme={{ colors: { onSurfaceVariant: "#4b0482" } }}
            activeOutlineColor="#4b0482"
            outlineColor="#B6B4B4"
            textColor="#4b0482"
            onChangeText={(text) => setCountry(text)}
            ref={input8Ref}
            onSubmitEditing={() => input9Ref.current.focus()}
            returnKeyType="done"
            blurOnSubmit={false}
            outlineStyle={{ borderRadius: ms(10) }}
            style={{ marginBottom: "5%", height: 0, backgroundColor: "white" }}
          />

          <TextInput1
            mode="outlined"
            label="Address"
            value={address}
            theme={{ colors: { onSurfaceVariant: "#4b0482" } }}
            activeOutlineColor="#4b0482"
            outlineColor="#B6B4B4"
            textColor="#4b0482"
            multiline={true}
            numberOfLines={4}
            onChangeText={(text) => setAddress(text)}
            ref={input9Ref}
            // onSubmitEditing={() => input9Ref.current.focus()}
            returnKeyType="next"
            blurOnSubmit={false}
            outlineStyle={{ borderRadius: ms(10) }}
            // style={{ marginBottom: "5%", height: 0, backgroundColor: "white" }}
          />

          {/* <Text style={[styles.label, { marginTop: "4%" }]}>
            Upload Driving License
          </Text>
          <TouchableOpacity
            style={styles.ContainerBox4}
            onPress={() => setDrivingLicenseModalVisible(true)}
          >
            <View>{renderSelectedDrivingLicenseImage()}</View>

            <View style={{ flex: 1 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={styles.texts}>
                  {selectedDrivingLicenseImage ? "Uploaded" : "Click to upload"}
                </Text>
                {selectedDrivingLicenseImage && (
                  <TouchableOpacity
                    onPress={() => setSelectedDrivingLicenseImage(null)}
                  >
                    <AntDesign name="delete" size={19} color={Colors.primary} />
                  </TouchableOpacity>
                )}
              </View>

              <ProgressBar
                progress={selectedDrivingLicenseImage ? 1 : 0.1}
                color={Colors.primary}
                style={{ height: 7, borderRadius: 5, marginTop: "3%" }}
              />
            </View>
          </TouchableOpacity> */}

          {/* <Text style={[styles.label, { marginTop: "4%" }]}>
            Upload PAN Card
          </Text>
          <TouchableOpacity
            style={styles.ContainerBox4}
            onPress={() => setPanCardModalVisible(true)}
          >
            <View>{renderSelectedPanCardImage()}</View>

            <View style={{ flex: 1 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={styles.texts}>
                  {selectedPanCardImage ? "Uploaded" : "Click to upload"}
                </Text>
                {selectedPanCardImage && (
                  <TouchableOpacity
                    onPress={() => setSelectedPanCardImage(null)}
                  >
                    <AntDesign name="delete" size={19} color={Colors.primary} />
                  </TouchableOpacity>
                )}
              </View>

              <ProgressBar
                progress={selectedPanCardImage ? 1 : 0.1}
                color={Colors.primary}
                style={{ height: 7, borderRadius: 5, marginTop: "3%" }}
              />
            </View>
          </TouchableOpacity> */}
          {/* 
          <Text style={[styles.label, { marginTop: "4%" }]}>
            Upload Bank Cheque
          </Text>
          <TouchableOpacity
            style={styles.ContainerBox4}
            onPress={() => setBankChequeModalVisible(true)}
          >
            <View>{renderSelectedBankChequeImage()}</View>

            <View style={{ flex: 1 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={styles.texts}>
                  {selectedBankChequeImage ? "Uploaded" : "Click to upload"}
                </Text>
                {selectedBankChequeImage && (
                  <TouchableOpacity
                    onPress={() => setSelectedBankChequeImage(null)}
                  >
                    <AntDesign name="delete" size={19} color={Colors.primary} />
                  </TouchableOpacity>
                )}
              </View>

              <ProgressBar
                progress={selectedBankChequeImage ? 1 : 0.1}
                color={Colors.primary}
                style={{ height: 7, borderRadius: 5, marginTop: "3%" }}
              />
            </View>
          </TouchableOpacity> */}

          {/* <Text style={[styles.label, { marginTop: "4%" }]}>
            Upload Address Proof
          </Text>
          <TouchableOpacity
            style={styles.ContainerBox4}
            onPress={() => setAddressProofModalVisible(true)}
          >
            <View>{renderSelectedAddressProofImage()}</View>

            <View style={{ flex: 1 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={styles.texts}>
                  {selectedAddressProofImage ? "Uploaded" : "Click to upload"}
                </Text>
                {selectedAddressProofImage && (
                  <TouchableOpacity
                    onPress={() => setSelectedAddressProofImage(null)}
                  >
                    <AntDesign name="delete" size={19} color={Colors.primary} />
                  </TouchableOpacity>
                )}
              </View>

              <ProgressBar
                progress={selectedAddressProofImage ? 1 : 0.1}
                color={Colors.primary}
                style={{ height: 7, borderRadius: 5, marginTop: "3%" }}
              />
            </View>
          </TouchableOpacity>

          <Text style={[styles.label, { marginTop: "4%" }]}>
            Upload Bank Cheque
          </Text>
          <TouchableOpacity
            style={styles.ContainerBox4}
            onPress={() => setBankChequeModalVisible(true)}
          >
            <View>{renderSelectedBankChequeImage()}</View>

            <View style={{ flex: 1 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={styles.texts}>
                  {selectedBankChequeImage ? "Uploaded" : "Click to upload"}
                </Text>
                {selectedBankChequeImage && (
                  <TouchableOpacity onPress={() => setSelectedBankChequeImage(null)}>
                    <AntDesign name="delete" size={19} color={Colors.primary} />
                  </TouchableOpacity>
                )}
              </View>

              <ProgressBar
                progress={selectedBankChequeImage ? 1 : 0.1}
                color={Colors.primary}
                style={{ height: 7, borderRadius: 5, marginTop: "3%" }}
              />
            </View>
          </TouchableOpacity>

          <Text style={[styles.label, { marginTop: "4%" }]}>
            Upload Address Proof
          </Text>
          <TouchableOpacity
            style={[styles.ContainerBox4, { marginBottom: '15%' }]}
            onPress={() => setAddressProofModalVisible(true)}
          >
            <View>{renderSelectedAddressProofImage()}</View>

            <View style={{ flex: 1 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={styles.texts}>
                  {selectedAddressProofImage ? "Uploaded" : "Click to upload"}
                </Text>
                {selectedAddressProofImage && (
                  <TouchableOpacity onPress={() => setSelectedAddressProofImage(null)}>
                    <AntDesign name="delete" size={19} color={Colors.primary} />
                  </TouchableOpacity>
                )}
              </View>

              <ProgressBar
                progress={selectedAddressProofImage ? 1 : 0.1}
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
            marginTop: "4%",
          }}
        >
          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit}
            activeOpacity={0.8}
          >
            <Text style={styles.btnText}>
              {screen === "add" ? "Submit" : "Edit"}
            </Text>
          </TouchableOpacity>
        </LinearGradient>

        <LoadingView message={"Please Wait ..."} visible={loading} />
      </View>
      </KeyboardAvoidingView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={drivingLicenseModalVisible}
        onRequestClose={() => setDrivingLicenseModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Upload Driving License</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={selectDrivingLicenseFromGallery}
            >
              <Text style={styles.modalButtonText}>Select from Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={captureDrivingLicenseFromCamera}
            >
              <Text style={styles.modalButtonText}>Capture from Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setDrivingLicenseModalVisible(false)}
            >
              <Text style={styles.modalCancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={panCardModalVisible}
        onRequestClose={() => setPanCardModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Upload PAN Card</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={selectPanCardFromGallery}
            >
              <Text style={styles.modalButtonText}>Select from Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={capturePanCardFromCamera}
            >
              <Text style={styles.modalButtonText}>Capture from Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setPanCardModalVisible(false)}
            >
              <Text style={styles.modalCancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={bankChequeModalVisible}
        onRequestClose={() => setBankChequeModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Upload Bank Cheque</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={selectBankChequeFromGallery}
            >
              <Text style={styles.modalButtonText}>Select from Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={captureBankChequeFromCamera}
            >
              <Text style={styles.modalButtonText}>Capture from Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setBankChequeModalVisible(false)}
            >
              <Text style={styles.modalCancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={addressProofModalVisible}
        onRequestClose={() => setAddressProofModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Upload Address Proof</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={selectAddressProofFromGallery}
            >
              <Text style={styles.modalButtonText}>Select from Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={captureAddressProofFromCamera}
            >
              <Text style={styles.modalButtonText}>Capture from Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setAddressProofModalVisible(false)}
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
    backgroundColor: "#F2EFEF",
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
    borderRadius: 10,
    fontFamily: "AvenirNextCyr-Thin",
  },
  textInput1: {
    borderColor: "#dedede",
    borderWidth: 1,
    backgroundColor: "white",
    height: "10%",
    marginBottom: "5%",
    padding: 5,
    paddingLeft: 8,
    borderRadius: 10,
    fontFamily: "AvenirNextCyr-Thin",
    textAlignVertical: "top",
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  halfTextInput: {
    flex: 1,
  },
  headercontainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "AvenirNextCyr-Medium",
    color: Colors.black,
    marginLeft: 10,
    marginTop: 3,
  },
  button: {
    height: vs(35),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: ms(5),
    marginBottom: "2%",
    marginTop: "2%",
    borderRadius: 50,
    width: "100%",
  },
  btnText: {
    fontFamily: "AvenirNextCyr-Medium",
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
    fontFamily: "AvenirNextCyr-Medium",
  },
  photosContainer: {
    height: 40,
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
    backgroundColor: Colors.primary,
    marginRight: 10,
  },
  buttonText: {
    fontFamily: "AvenirNextCyr-Thin",
    color: "white",
  },
  label: {
    fontSize: 16,
    color: Colors.primary,
    fontFamily: "AvenirNextCyr-Bold",
  },
  dropdown: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 14,
    fontFamily: "AvenirNextCyr-Thin",
    color: "grey",
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
    color: Colors.black,
    fontSize: 16,
  },
  inputContainer: {
    borderColor: "grey",
    borderWidth: 1,
    backgroundColor: "white",
    height: 40,
    marginBottom: 5,
    fontFamily: "AvenirNextCyr-Thin",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  input2: {
    fontFamily: "AvenirNextCyr-Thin",
    padding: 8,
    flex: 1,
  },
  graphContainer: {
    borderRadius: 30,
    position: "relative",
    alignItems: "center",
    width: 300,
    height: 160,
  },
  header: {
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
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
    color: Colors.primary,
    marginTop: "4%",
    fontFamily: "AvenirNextCyr-Thin",
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
    height: 0,
    width: 45,
    paddingVertical: "7%",
  },
});

export default AddDriver;
