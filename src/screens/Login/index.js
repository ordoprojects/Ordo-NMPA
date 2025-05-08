import { useRef } from "react";
import React, { useEffect, useState, useContext } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  ImageBackground,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { AuthContext } from "../../Context/AuthContext";
import messaging from "@react-native-firebase/messaging";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ProgressDialog } from "react-native-simple-dialogs";
import { cameraPermission } from "../../utils/Helper";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import ImageResizer from "@bam.tech/react-native-image-resizer";
import RNFS from "react-native-fs";
import { TextInput as TextInput1, Button as Button1 } from "react-native-paper";
import LinearGradient from "react-native-linear-gradient";
import Colors from "../../constants/Colors";
import { hs, vs, ms } from "../../utils/Metrics";
import DeviceInfo from 'react-native-device-info';

const Login = ({ navigation }) => {
  const [base64img, setBase64img] = useState("");
  const [userId, setUserId] = useState(null);
  const [hasToken, setHasToken] = useState(null);
  const [hidePass, setHidePass] = useState(true);
  const loginResponse = useRef(0);
  const [loading, setLoading] = useState(false);

  const version = DeviceInfo.getVersion();

  const {
    token,
    changeToken,
    admin,
    changeAdmin,
    salesManager,
    setSalesManager,
    userData,
    setUserData,
    merch,
    delivery,
    changeDelivery,
    setMerch,
    collectionTeam,
    setCollectionTeam,
    dispatchTeam,
    setDispatchTeam,
    stockTeam,
    setStockTeam,
    driver,
    setDriver,
    salesEx,
    setSalesEx,
    production,
    setProduction,
  } = useContext(AuthContext);

  const checkPermission = async () => {
    let PermissionDenied = await cameraPermission();
    if (PermissionDenied) {
      console.log("camera permssion granted");
      handleCamera();
    } else {
      console.log("camera permssion denied");
      //requestStoragePermission();
    }
  };

  const handleCamera = async () => {
    // setModalVisible1(false);
    const res = await launchCamera({
      mediaType: "photo",
    });
    console.log("response", res.assets[0].uri);
    imageResize(res.assets[0].uri, res.assets[0].type);
  };

  const imageResize = async (img, type) => {
    try {
      const res = await ImageResizer.createResizedImage(
        img,
        300,
        300,
        "JPEG",
        50
      );

      const base64Data = await RNFS.readFile(res.path, "base64");
      const base64img1 = `data:${type};base64,${base64Data}`;

      setBase64img(base64img1);
      // console.log("base64img", hasToken);
      // console.log("base64img1111", base64img);

      uploadImage(loginResponse.current.id, base64img1);
      //onPressLogin(base64img1);
      // Now you can use base64img as needed (e.g., uploadImage)
    } catch (error) {
      console.log("img resize error", error);
    }
  };

  // console.log("ahsdajfs", base64img);

  const { changeDealerData } = useContext(AuthContext);
  useEffect(() => {
    getAcessToken();
  }, []);



  const procedLogin = async (result) => {

    console.log("result", result)

    //admin
    if (result?.user_type == "Admin") {
      changeAdmin(true);
      console.log("admin is ", admin);
      await AsyncStorage.setItem("isAdmin", result?.id);

      await AsyncStorage.setItem("token", result?.token);
      changeToken(result?.token);

      await AsyncStorage.setItem("userData", JSON.stringify(result));
      setUserData(result);
    }


    else if (result?.user_type == "Collection Team") {
      console.log("isCollectionTeam is ");
      setCollectionTeam(true);
      await AsyncStorage.setItem("isCollectionTeam", result?.id);

      await AsyncStorage.setItem("token", result?.token);
      changeToken(result?.token);

      await AsyncStorage.setItem("userData", JSON.stringify(result));
      setUserData(result);
    }

    //stock team
    else if (result?.user_type == "Stock Team") {
      setStockTeam(true);
      console.log("stock is ");
      await AsyncStorage.setItem("isStockTeam", result?.id);

      await AsyncStorage.setItem("token", result?.token);
      changeToken(result?.token);

      await AsyncStorage.setItem("userData", JSON.stringify(result));
      setUserData(result);
    }

    //sales Executive
    else if (result?.user_type == "Sales Executive") {
      setSalesEx(true);
      console.log("sales executive is ");
      await AsyncStorage.setItem("isSalesEx", result?.id);

      await AsyncStorage.setItem("token", result?.token);
      changeToken(result?.token);

      await AsyncStorage.setItem("userData", JSON.stringify(result));
      setUserData(result);

    }

    // Driver login
    else if (result?.user_type == "Driver") {
      setDriver(true);
      console.log("driver is ");
      await AsyncStorage.setItem("isDriver", result?.id);

      await AsyncStorage.setItem("token", result?.token);
      changeToken(result?.token);

      await AsyncStorage.setItem("userData", JSON.stringify(result));
      setUserData(result);

    }


    // Dispatch login
    else if (result?.user_type == "Dispatch Team") {
      setDispatchTeam(true);
      console.log("dispatch is ");
      await AsyncStorage.setItem("isDispatchTeam", result?.id);

      await AsyncStorage.setItem("token", result?.token);
      changeToken(result?.token);

      await AsyncStorage.setItem("userData", JSON.stringify(result));
      setUserData(result);

    }


       // production login
       else if (result?.user_type == "Production") {
        setProduction(true);
        console.log("production is ");
        await AsyncStorage.setItem("isProduction", result?.id);
  
        await AsyncStorage.setItem("token", result?.token);
        changeToken(result?.token);
  
        await AsyncStorage.setItem("userData", JSON.stringify(result));
        setUserData(result);
  
      }


    else if (result?.user_type == "Sales Manager") {
      setSalesManager(true);
      console.log("Sales Manager is ");
      await AsyncStorage.setItem("isSalesManager", result?.id);

      await AsyncStorage.setItem("token", result?.token);
      changeToken(result?.token);

      await AsyncStorage.setItem("userData", JSON.stringify(result));
      setUserData(result);

    }

    // console.log("testttt", result)
  };


  const onPressLogin = async () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const deviceId = await DeviceInfo.getUniqueId();
    console.log("🚀 ~ onPressLogin ~ deviceId:", deviceId)

    var raw = JSON.stringify({
      username: state.username,
      password: state.password,
      firebase_token: state.token,
      device_id :deviceId
    });

    console.log("login rawwww", raw);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    try {
      const response = await fetch(
        "https://gsidev.ordosolution.com/api/login/",
        requestOptions
      );
      const result = await response.json();

      if (result.ErrorCode === "200") {
        Keyboard.dismiss()
        // Set the userId state with the id value
        setUserId(result.id);
        // setHasToken(result?.token);
        loginResponse.current = result;

        if (result.compare_image === "Y") {
          console.log("Profile picture is available. Logging in...");
          procedLogin(result);
        } else if (result.compare_image === "N") {
          console.log("Profile picture is not available. Opening camera...");
          checkPermission();
        }
        // changeName(result?.name)
      } else if (result.ErrorCode == "201") {
        Alert.alert(
          "Warning",
          "Your account has been deactivated kindly contact the administrator"
        );
      } else if (result.ErrorCode == "107") {
        Alert.alert(
          "Warning",
          "You are already logged in on another device. Please log out of the previous device."
        );
      } else {
        Alert.alert("Warning", "Invalid Credentials");
      }
    } catch (error) {
      console.log("login error", error);
    }
  };

  const [state, setState] = useState({
    username: "",
    password: "",
    token: "",
  });

  const updateusername = (text) => {
    setState({ ...state, username: text });
  };
  const updatePassword = (text) => {
    setState({ ...state, password: text });
  };
  const getAcessToken = async () => {
    await messaging().registerDeviceForRemoteMessages();
    const token = await messaging().getToken();
    console.log("token", token);
    setState({ ...state, token: token });
  };

  // console.log("check token", loginResponse.current.token);

  const uploadImage = async (userid, base64img1) => {
    console.log("user iddddd", userid, loginResponse.current.token);

    setLoading(true);
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', `Bearer ${loginResponse.current.token}`);

    var raw = JSON.stringify({
      "profile_image": base64img1,
      "compare_image": base64img1,
    });

    var requestOptions = {
      method: 'PATCH',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    await fetch(`https://gsidev.ordosolution.com/api/ordo_users/${userid}/`, requestOptions)
      .then((response) => {
        console.log("response", response)
        if (response.status === 200) {
          // Handle the API response here
          // console.log("sales man image saved sucessfully", result);
          setLoading(false);
          procedLogin(loginResponse.current);

        } else if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        } else {
          return response.json();
        }
      })

      .catch((error) => {
        console.error("Image upload error:", error);
        setLoading(false);
        Alert.alert("Error", "Profile image upload error occured");
      });
  };


  return (
    <TouchableWithoutFeedback style={{ flex: 1 }} onPress={Keyboard.dismiss}>
      <View style={styles.container}>

        <ImageBackground
          source={require("../../assets/images/wave1.png")}
          style={styles.backgroundImage}
        />
        <Image
          source={require("../../assets/images/RoundGsi.png")}
          style={styles.Image}
        />

        <ProgressDialog
          visible={loading}
          title="Uploading Profile image"
          message="Please wait..."
          titleStyle={{ fontFamily: "AvenirNextCyr-Medium" }}
          messageStyle={{ fontFamily: "AvenirNextCyr-Medium" }}
        />

      <View style={styles.formContainer}>
        <Text style={styles.subTitle}>Login</Text>
        <TextInput1
          mode="outlined"
          label="Username"
          theme={{ colors: { onSurfaceVariant: "#4b0482" } }}
          activeOutlineColor="#4b0482"
          outlineColor="#B6B4B4"
          textColor="#4b0482"
          onChangeText={(text) => updateusername(text)}
          autoCapitalize="none"
          blurOnSubmit={false}
          // keyboardType="number-pad"
          onSubmitEditing={() => Keyboard.dismiss()}
          returnKeyType="done"
          outlineStyle={{ borderRadius: ms(10) }}
          style={{ marginBottom: "5%", height: 55, backgroundColor: "white" }}
        />

        <TextInput1
          mode="outlined"
          label="Password"
          theme={{ colors: { onSurfaceVariant: "#4b0482" } }}
          activeOutlineColor="#4b0482"
          // placeholder="Enter Password"
          outlineColor="#B6B4B4"
          textColor="#4b0482"
          onChangeText={(text) => updatePassword(text)}
          autoCapitalize="none"
          blurOnSubmit={false}
          secureTextEntry={hidePass ? true : false}
          right={<TextInput1.Icon icon="eye" color={'#4b0482'} onPress={() => setHidePass(!hidePass)}/>}
          onSubmitEditing={() => Keyboard.dismiss()}
          returnKeyType="done"
          outlineStyle={{ borderRadius: ms(10) }}
          style={{ marginBottom: "5%", height: 55, backgroundColor: "white" }}
        />

          <View style={{ marginBottom: 15 }}>
            <Text
              style={{
                fontFamily: "AvenirNextCyr-Medium",
                fontSize: ms(10),
                color: "grey",
                textAlign: "center",
              }}
            >
              By clicking Login You Agree to the Ordo
            </Text>
            <Text style={styles.agreementColor}>
              User Agreement, Privacy Policy and Cookie Policy
            </Text>
          </View>
          <LinearGradient
            colors={Colors.linearColors}
            start={Colors.start}
            end={Colors.end}
            locations={Colors.ButtonsLocation}
            style={{
              backgroundColor: Colors.primary,
              borderColor: Colors.primary,
              borderRadius: ms(20),
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <TouchableOpacity onPress={onPressLogin} style={styles.loginBtn}>
              <Text style={styles.loginText}>LOGIN </Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
        <View
          style={{
            position: "absolute",
            bottom: "2%",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <Text
            style={{
              textAlign: "center",
              fontSize: ms(13),
              fontFamily: "AvenirNextCyr-Medium",
              color: "black",
            }}
          >
            OrDo - Version 1.10.10
          </Text>
          <Text
            style={{
              textAlign: "center",
              fontSize: ms(10),
              fontFamily: "AvenirNextCyr-Medium",
              color: "black",
            }}
          >
            © 2025 inteliTech Solutions. All rights Reserved
          </Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};
const styles = StyleSheet.create({
  backgroundImage: {
    flex: 0.25,
    resizeMode: "contain",
    justifyContent: "center",
  },
  Image: {
    resizeMode: "contain",
    justifyContent: "center",
    position: 'absolute',
    height: '13%',
    top: '12%',
    left: '0%',
    width: '100%'
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  input: {
    backgroundColor: "white",
    marginBottom: 20,
  },
  loginBtn: {
    width: "100%",
    borderRadius: 10,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "AvenirNextCyr-Medium",
  },
  loginText: {
    color: "white",
    fontFamily: "AvenirNextCyr-Medium",
    fontSize: ms(16),
  },
  formContainer: {
    marginTop: 10,
    flex: 0.7,
    width: "80%",
    alignSelf: "center",
  },
  subTitle: {
    fontFamily: "AvenirNextCyr-Medium",
    fontSize: ms(24),
    color:Colors.primary,
    marginBottom: 10,
    textAlign: "center",
  },
  agreementColor: {
    color: "grey",
    fontFamily: "AvenirNextCyr-Medium",
    fontSize: ms(10),
    textAlign: "center",
  },
});
export default Login;
