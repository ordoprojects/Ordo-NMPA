import { useRef } from 'react';
import React, { useEffect, useState, useContext } from 'react';
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
    Image
} from 'react-native';
import { AuthContext } from '../../Context/AuthContext';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProgressDialog } from 'react-native-simple-dialogs';
import { cameraPermission } from '../../utils/Helper';
const Login = ({ navigation }) => {
    const [base64img, setBase64img] = useState('');
    const [userId, setUserId] = useState(null);
    const loginResponse = useRef(0);
    const [loading, setLoading] = useState(false);


    const checkPermission = async () => {
        let PermissionDenied = await cameraPermission();
        if (PermissionDenied) {
            console.log("camera permssion granted");
            handleCamera();
        }
        else {
            console.log("camera permssion denied");
            //requestStoragePermission();
        }
    }


    const handleCamera = async () => {
        // setModalVisible1(false);
        const res = await launchCamera({
            mediaType: 'photo',
        });
        console.log("response", res.assets[0].uri);
        imageResize(res.assets[0].uri, res.assets[0].type);
    }

    const imageResize = async (img, type) => {
        try {
            const res = await ImageResizer.createResizedImage(
                img,
                300,
                300,
                'JPEG',
                50,
            );

            console.log('image resize', res);

            const base64Data = await RNFS.readFile(res.path, 'base64');

            const base64img1 = `data:${type};base64,${base64Data}`;

            setBase64img(base64img1);
            console.log("base64img", base64img1);
            // console.log("base64img1111", base64img);

            uploadImage(loginResponse.current.id, base64img1);
            //onPressLogin(base64img1);
            // Now you can use base64img as needed (e.g., uploadImage)
        } catch (error) {
            console.log("img resize error", error);
        }
    };


    console.log("ahsdajfs", base64img)




    const { changeDealerData } = useContext(AuthContext)
    useEffect(() => {
        getAcessToken();
    }, [])

    const { token, changeToken, admin, changeAdmin, salesManager,
        setSalesManager, userData,
        setUserData, merch,
        setMerch } = useContext(AuthContext)


    const procedLogin = async (result) => {
        //admin
        if (result?.type == "99") {
            changeAdmin(true);
            console.log("admin is ", admin);
            await AsyncStorage.setItem("isAdmin", result?.id);
        }
        //salesmanager
        else if (result?.type == "5") {
            setSalesManager(true);
            console.log("sales manager is ", salesManager);
            await AsyncStorage.setItem("isSalesManager", result?.id);
        }
        //merchandiser
        else if (result?.type == "6" || result?.type == "7") {
            setMerch(true);
            console.log("merchandiser is ", merch);
            await AsyncStorage.setItem("isMerch", result?.id);
            changeDealerData({ id: result?.account_id })
        }
        //salesman
        else {
            await AsyncStorage.setItem("token", result?.id);
            console.log("tokennnn", result?.id);
        }
        changeToken(result?.id);

        //uploadImage(result?.id)

        //saving user data
        await AsyncStorage.setItem("userData", JSON.stringify(result));
        setUserData(result)

    }

    const onPressLogin = async () => {
        // Do something about login operation
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "text/plain");
        var raw = "{\n    \"__module_code__\":\"PO_12\",\n    \"__uname__\":\"" + state.username + "\",      \n    \"__pass__\":\"" + state.password + "\",      \n    \"__token__\":\"" + state.token + "\"\n}";
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("https://dev.ordo.primesophic.com/log_in_ordo.php", requestOptions)
            .then(response => response.json())
            .then(async result => {
                console.log("detail", result);
                if (result.ErrorCode === "200") {
                    // ...
                    // Set the userId state with the id value
                    setUserId(result.id);
                    loginResponse.current = result;
                    // uploadImage(result.id); 
                    // Check the profilepic field
                    if (result.compare_image === "Y") {
                        // Profile picture is available, proceed with the login process
                        console.log("Profile picture is available. Logging in...");
                        procedLogin(result)

                    } else if (result.compare_image === "N") {
                        // Profile picture is not available, open the camera
                        console.log("Profile picture is not available. Opening camera...");
                        checkPermission(); // Make sure to await checkPermission if needed
                    }



                    //changeName(result?.name)
                    //navigation.navigate('BottomTab')

                }
                else if (result.ErrorCode == "201") {
                    Alert.alert("Warning", "Your account has been deactivated kindly contact the administrator")
                }
                else {
                    Alert.alert("Warning", "Invalid Credentials")
                }
            })
            .catch(error => console.log("login error", error));

    };

    const [state, setState] = useState({
        username: '',
        password: '',
        token: ''
    })
    const updateusername = text => {
        setState({ ...state, username: text });
    };
    const updatePassword = text => {
        setState({ ...state, password: text });
    };
    const getAcessToken = async () => {
        await messaging().registerDeviceForRemoteMessages();
        const token = await messaging().getToken();
        console.log("token", token)
        setState({ ...state, token: token });
    }

    console.log("asdfafas", userId)

    const uploadImage = (base64img1, userid) => {
        setLoading(true);
        // const apiEndpoint = "https://dev.ordo.primesophic.com/set_profile_pic.php"; 
        console.log("pleaseeeeeeeeeeeee", base64img1)
        console.log("user iddddd", userid)

        const requestBody = {
            "__image_base64__": userid,
            "__user_id__": base64img1,
            "__profile_image__": `${Date.now()}.png`,
        };

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        };

        fetch("https://dev.ordo.primesophic.com/set_profile_pic.php", requestOptions)
            .then(response => response.json())
            .then(result => {
                // Handle the API response here
                console.log("sales man image saved sucessfully", result);
                setLoading(false);
                procedLogin(loginResponse.current)
            })
            .catch(error => {
                console.error("Image upload error:", error);
                setLoading(false);
                Alert.alert('Error', 'Profile image upload error occured');

            })

    }

    return (
        <View style={styles.container}>
            <ProgressDialog
                visible={loading}
                title="Uploading Profile image"
                message="Please wait..."
                titleStyle={{ fontFamily: 'AvenirNextCyr-Medium' }}
                messageStyle={{ fontFamily: 'AvenirNextCyr-Thin' }}
            />
            <View style={styles.titleView}>
                {/* <Text style={styles.title}>OrdoApp</Text> */}
                <Image style={styles.subimage} source={require('../../assets/images/ordologo-bg.png')} />
            </View>
            <Text style={styles.subTitle}>Join OrdoAssure App</Text>
            <View style={styles.contentContainer}>
                <View style={styles.inputView}>
                    <TextInput
                        style={styles.inputText}
                        placeholder="Username"
                        autoCapitalize='none'
                        placeholderTextColor="#003f5c"
                        onChangeText={text => updateusername(text)}
                    />
                </View>
                <View style={styles.inputView}>
                    <TextInput
                        style={styles.inputText}
                        secureTextEntry
                        placeholder="Password"
                        placeholderTextColor="#003f5c"
                        onChangeText={text => updatePassword(text)}
                        autoCapitalize='none'
                    />
                </View>

            </View>
            <View style={{ marginLeft: 41, marginRight: 40 }}>
                <Text style={{
                    fontFamily: 'AvenirNextCyr-Thin',
                    fontSize: 12,
                    color: 'grey'
                }}>
                    By clicking Login You Agree to the OrdoAssure
                </Text>
                <Text style={styles.agreementColor}>
                    User Agreement, Privacy Policy and  Cookie Policy
                </Text>
            </View>
            <TouchableOpacity
                onPress={onPressLogin}
                style={styles.loginBtn}>
                <Text style={styles.loginText}>LOGIN</Text>
            </TouchableOpacity>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        // backgroundColor: 'yellow',
        // alignItems: 'center',
        // justifyContent: 'center',
    },
    contentContainer: {
        // backgroundColor: 'green',
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        marginTop: 10,
        // justifyContent: 'center',
    },
    titleView: {
        justifyContent: "center",
        marginLeft: 32,
    },
    title: {
        fontWeight: "bold",
        fontSize: 20,
        color: "#6B1594",
        marginBottom: 40,
        marginLeft: 20
    },
    subTitle: {
        //fontWeight: "400",
        fontFamily: 'AvenirNextCyr-Medium',
        fontSize: 24,
        color: "black",
        marginBottom: 10,
        marginLeft: 38
    },
    inputView: {
        width: "80%",
        borderWidth: 1,
        backgroundColor: "white",
        borderRadius: 1,
        height: 50,
        marginBottom: 20,
        justifyContent: "center",
        padding: 20,
        paddingLeft: 5,

    },
    inputText: {
        height: 50,
        color: "black",
        fontFamily: 'AvenirNextCyr-Thin',
    },
    forgotAndSignUpText: {
        color: "black",
        fontSize: 14,
        fontFamily: 'AvenirNextCyr-Thin',
    },
    loginText: {
        color: 'white',
        fontFamily: 'AvenirNextCyr-Medium',

    },
    loginBtn: {
        width: "80%",
        backgroundColor: "#6B1594",
        borderRadius: 30,
        height: 60,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
        marginBottom: 10,
        marginLeft: 41
    },
    agreementColor: {
        color: "grey",
        fontFamily: 'AvenirNextCyr-Thin',
        fontSize: 12
    },
    subimage: {
        width: 100,
        height: 80
    },

});
export default Login;