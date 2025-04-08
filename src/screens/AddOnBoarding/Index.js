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
} from "react-native";
import Colors from "../../constants/Colors";
import { AuthContext } from "../../Context/AuthContext";
import LinearGradient from "react-native-linear-gradient";
import { ms, hs, vs } from "../../utils/Metrics";
import globalStyles from "../../styles/globalStyles";
import { ProgressBar } from "react-native-paper";

const AddOnBoarding = ({ navigation }) => {
  //drop down hooks
  const [bankChequeModalVisible, setBankChequeModalVisible] = useState(false);
  const [selectedBankChequeImage, setSelectedBankChequeImage] = useState(null);

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


  const { token, userData } = useContext(AuthContext);
  const [contact, setContact] = useState("");
  const [name, setName] = useState("");
  const [vendorType, setVendorType] = useState("");
  const [GSTno, setGSTno] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");

  const input1Ref = useRef(null);
  const input2Ref = useRef(null);
  const input3Ref = useRef(null);
  const input4Ref = useRef(null);
  const input5Ref = useRef(null);
  const input6Ref = useRef(null);
  const input7Ref = useRef(null);
  const input8Ref = useRef(null);
  const input9Ref = useRef(null);
  const input10Ref = useRef(null);

  const handleSubmit = async () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${userData.token}`);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      first_name: name,
      license_number: licence,
      phone: contact,
      email: email,
      status: status,
      address: address,
    });

    console.log("raw", raw);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
  };


  return (
    <View style={styles.rootContainer}>
      <View style={{ height: "30%" }}>
        <LinearGradient
          colors={Colors.linearColors}
          start={{ x: 1, y: 1 }}
     end={Colors.end}
          locations={Colors.location}
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
                navigation.navigate('OnBoarding');
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
                Add Vendor
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
            <View></View>
          </View>

          <View style={styles.graphContainer}>
            <Image
              style={{
                height: "150%",
                width: "100%",
                resizeMode: "contain",
              }}
              source={require("../../assets/images/stor2e.png")}
            />
          </View>
        </LinearGradient>
      </View>
      <View style={{ padding: 20, height: "70%" }}>
        <ScrollView>
          <Text style={{ ...styles.label, marginTop: "5%" }}>Vendor Name</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Vendor Name"
            value={name}
            placeholderTextColor="#cecece"
            onChangeText={(text) => setName(text)}
            ref={input1Ref}
            returnKeyType="next"
            onSubmitEditing={() => input2Ref.current.focus()}
          />
          <Text style={styles.label}>Vendor Type</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Vendor Type"
            value={vendorType}
            placeholderTextColor="#cecece"
            onChangeText={(text) => setVendorType(text)}
            ref={input2Ref}
            returnKeyType="next"
            onSubmitEditing={() => input3Ref.current.focus()}
          />

          <Text style={{ ...styles.label, marginTop: 5 }}>
            GST Registration Number
          </Text>
          <TextInput
            style={styles.textInput}
            placeholder="phone"
            value={GSTno}
            placeholderTextColor="#cecece"
            onChangeText={(text) => setGSTno(text)}
            keyboardType="numeric"
            ref={input3Ref}
            returnKeyType="next"
            onSubmitEditing={() => input4Ref.current.focus()}
          />

          <Text style={{ ...styles.label, marginTop: 5 }}>State/Province</Text>
          <TextInput
            style={styles.textInput}
            placeholder="License number"
            value={state}
            placeholderTextColor="#cecece"
            onChangeText={(text) => setState(text)}
            ref={input4Ref}
            returnKeyType="next"
            onSubmitEditing={() => input5Ref.current.focus()}
          />

          <View style={{ flexDirection: "row", marginBottom: "3%" }}>
            <View style={{ flexDirection: "column" }}>
              <Text style={{ ...styles.label, marginTop: 5 }}>City</Text>
              <TextInput
                style={[styles.textInput2, { width: "450%" }]}
                placeholder="State"
                value={city}
                placeholderTextColor="#cecece"
                onChangeText={(text) => setCity(text)}
                ref={input6Ref}
                returnKeyType="next"
                onSubmitEditing={() => input7Ref.current.focus()}
              />
            </View>
            <View style={{ flexDirection: "column", marginLeft: "50%" }}>
              <Text style={{ ...styles.label, marginTop: 5 }}>Zip Code</Text>
              <TextInput
                style={[styles.textInput2, { width: "190%" }]}
                placeholder="Zip Code"
                value={zip}
                placeholderTextColor="#cecece"
                onChangeText={(text) => setZip(text)}
                ref={input8Ref}
                returnKeyType="next"
                onSubmitEditing={() => input9Ref.current.focus()}
              />
            </View>
          </View>

          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Phone Number"
            value={phone}
            placeholderTextColor="#cecece"
            numberOfLines={4}
            keyboardType="numeric"
            onChangeText={(text) => setPhone(text)}
            ref={input10Ref}
          />

          <Text style={[styles.label, { marginBottom: "1%" }]}>
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
          </TouchableOpacity>
        </ScrollView>

        <LinearGradient
          colors={Colors.linearColors}
          start={Colors.start}
          end={Colors.end}
          locations={Colors.location}
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
            <Text style={styles.btnText}>Submit</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>

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
  textInput2: {
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
    paddingVertical: "2%",
    paddingHorizontal: "2%",
    position: "relative",
    bottom: "43%",
    ...globalStyles.border,
    alignItems: "center",
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
    height: 55,
    width: 45,
    paddingVertical: "7%",
  },
});

export default AddOnBoarding;
