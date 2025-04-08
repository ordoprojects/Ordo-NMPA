import React, { useContext, useState, useRef, useEffect } from 'react'
import { AuthContext } from '../../Context/AuthContext'
import { StyleSheet, Text, Modal, View, TouchableOpacity, Alert, Image, TextInput, LogBox, ScrollView, Button, PermissionsAndroid } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useFocusEffect } from '@react-navigation/native';
import Geolocation from 'react-native-geolocation-service';
import firestore from '@react-native-firebase/firestore';
import { Pressable } from 'react-native';
import Colors from '../../constants/Colors';
import FaceSDK, { Enum, FaceCaptureResponse, MatchFacesResponse, MatchFacesRequest, MatchFacesImage, MatchFacesSimilarityThresholdSplit, RNFaceApi } from '@regulaforensics/react-native-face-api'
import { locationPermission, } from '../../utils/Helper'
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import ActionButton from 'react-native-action-button';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Dimensions } from "react-native";
import ClockIn from './clockIn';
import { MultiSelect } from 'react-native-element-dropdown';

import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { cameraPermission } from '../../utils/Helper';
import ImageResizer from '@bam.tech/react-native-image-resizer'
import RNFS from 'react-native-fs';
import {
    LineChart
} from "react-native-chart-kit";
import AntDesign from 'react-native-vector-icons/AntDesign'
import globalStyles from '../../styles/globalStyles';
const screenWidth = Dimensions.get("window").width;
import messaging from '@react-native-firebase/messaging';
import DeviceInfo from 'react-native-device-info';
LogBox.ignoreAllLogs();

const MerchHome = ({ navigation }) => {

    const { logout, userData, dealerData, token, changeTourPlanId } = useContext(AuthContext);
    //sales man live location logic starts
    useEffect(() => {

        const interval = setInterval(() => {
            // if (!navigation.isFocused()) {
            //     //screen is not focused
            //     console.log("clearing get location")
            //     clearInterval(interval);
            //     return false;
            // }
            //checkPermission called after every 10 seconds
            checkPermission2();
        }, 900000);
        return () => clearInterval(interval)
    }, [])

    const checkPermission2 = async () => {
        const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);

        if (granted) {
            console.log("location permission granted");
            getLiveLocation();
        }
        else {
            console.log("asking permission");
            requestLocationPermission();
        }
    }

    //Location Permission
    const requestLocationPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: "App Location Permission",
                    message:
                        "App needs access location",
                    buttonNeutral: "Ask Me Later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK"
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("You can use location ride");
                getLiveLocation();
                //setEnableLocationModalOpen(true);
            } else {
                console.log("location permission denied");
            }
        } catch (err) {
            console.warn("location permission error", err);
        }
    };

    const saveLocation = (lattitude, longitude, battery) => {
        if (!token) {
            console.debug.LOG("NO TOKEN RETURNING")
            return;
        }
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "text/plain");
        var raw = JSON.stringify({
            "__user_id__": token,
            "__longitude__": lattitude,
            "__latitude__": longitude,
            "__battery__": battery,

        })

        console.log("location raw", raw)
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
        fetch("https://dev.ordo.primesophic.com/set_check_in_location.php", requestOptions)
            .then(response => response.json())
            .then(res => {
                //console.log("Signature Uploaded", result);
                console.log('live locatrion save api res', res);
            })
            .catch(error => console.log('live location save error', error));

    }

    const getLiveLocation = async () => {
        let battery = 0;
        DeviceInfo.getBatteryLevel().then((batteryLevel) => {
            // 0.759999
            battery = batteryLevel * 100
            console.log("battery percentage", battery, '%');

        });

        Geolocation.getCurrentPosition(
            (res) => {
                console.log("app js location called")
                console.log(res);
                //getting user location
                console.log("lattitude", res.coords.latitude);
                console.log("longitude", res.coords.longitude);
                saveLocation(res.coords.latitude, res.coords.longitude, battery)
                //setUserCordinates([res.coords.longitude, res.coords.latitude]);
                //calculateDistances([res.coords.longitude, res.coords.latitude]);
            },
            (error) => {
                console.log("get location error", error);
                console.log("please enable location ")
                setLocationEnabled(false);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }

        );

    }


    //push notification
    //push notification hadndle logic
    useEffect(() => {


        //navigation.navigate('UserList')

        // Assume a message-notification contains a "type" property in the data payload of the screen to open

        messaging().onNotificationOpenedApp(remoteMessage => {
            console.log(
                'Notification caused app to open from background state:',
                remoteMessage.notification,
            );
            //checking it is chat notification
            if (remoteMessage?.data?.convo_id) {
                navigation.navigate('UserList');
            }

            //navigation.navigate(remoteMessage.data.type);
        });

        // Check whether an initial notification is available
        messaging()
            .getInitialNotification()
            .then(remoteMessage => {
                if (remoteMessage) {
                    console.log(
                        'Notification caused app to open from quit state:',
                        remoteMessage.notification,
                    );
                    //setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
                    console.log("notification type", remoteMessage.data.convo_id)
                    //checking it is chat notification
                    if (remoteMessage?.data?.convo_id) {
                        navigation.navigate('UserList');
                    }
                }
                // setLoading(false);
            });
    }, []);

    
    console.log('Dealer data existssss : ', userData);
    console.log('merch user data : ', userData);

    const [clockedIn, setClockedIn] = useState(null);
    const profile = useRef('');
    const [userCordinates, setUserCordinates] = useState([]);
    const [approvedPlans, setApprovedPlans] = useState('');
    const [otherPlans, setOtherPlans] = useState('');
    const [loading, setLoading] = useState(false);


    const getPlans = () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");


        var raw = JSON.stringify({
            "__user_id__": token,
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("https://dev.ordo.primesophic.com/get_merchandiser_tour_plan.php", requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log('get plans data \n', result.merchandiser_tour_plan)
                let approved = [];  //approved plans
                let completed = []
                let other = [];  //reject,pending plans  all are other plans

                result?.merchandiser_tour_plan.forEach((item) => {
                    console.log("item", item)
                    //approved
                    if (item?.status == 'Approved') {
                        changeTourPlanId(item?.id);
                        approved.push(item);
                    }
                    //completed
                    else if (item?.status == 'Completed') {
                        completed.push(item)
                    }
                    //other
                    else {
                        other.push(item)
                    }

                })
                console.log("approved", approved)
                //sorting approved plans array
                setApprovedPlans(approved)

                // //sorting completed  plans array
                // let sortedarray2 = completed.sort((a, b) => (a.start_date < b.start_date) ? 1 : -1)
                // setCompletedPlans(sortedarray2)

                //sorting other  plans array
                //let sortedarray3 = other.sort((a, b) => (a.start_date < b.start_date) ? 1 : -1)
                setOtherPlans(other)
            })
            .catch(error => console.log('get tour plan error', error));
        // var myHeaders = new Headers();
        // myHeaders.append("Content-Type", "application/json");

        // var raw = JSON.stringify({
        //   "__user_id__": "1878e60a-fe1c-0d00-e8b6-63119c1882aa",
        //   "__id__": "87cc5a45-c1fe-858c-1bca-647441f70493"
        // });

        // var requestOptions = {
        //   method: 'GET',
        //   headers: myHeaders,
        //   body: raw,
        //   redirect: 'follow'
        // };

        // fetch("https://dev.ordo.primesophic.com/get_tour_plan_detail.php", requestOptions)
        //   .then(response => response.json())
        //   .then(result => console.log(result))
        //   .catch(error => console.log('error', error));


    }


    const getLocation = async () => {
        let locPermissionDenied = await locationPermission();
        if (locPermissionDenied) {
            Geolocation.getCurrentPosition(
                async (res) => {
                    console.log('GET LOCATION CALLED');
                    console.log(res);
                    //getting user location
                    console.log("lattitude", res.coords.latitude);
                    console.log("longitude", res.coords.longitude);
                    setUserCordinates([res.coords.latitude, res.coords.longitude])

                },
                (error) => {
                    console.log("get location error", error);
                    console.log("please enable location ")
                },
                {
                    enableHighAccuracy: true, timeout: 15000, maximumAge: 10000, accuracy: {
                        android: 'high',
                        ios: 'bestForNavigation',
                    }
                }

            );

        }
        else {
            console.log("location permssion denied")
        }
    }


    const logoutAlert = () => {
        Alert.alert('Confirmation', 'Are you sure, You want to logout?', [
            {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            { text: 'OK', onPress: () => { logout() } },
        ]);
    }


    const clockIncheck = () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "__user_id__": token,
            "__type__": "clockin"
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("https://dev.ordo.primesophic.com/get_check_user_clockin.php", requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log('clockin check data', result);
                if (result.status == 200) {
                    setClockedIn(true)
                }
                else if (result.status == 201) {
                    setClockedIn(false);
                    getProfile();
                }
            })
            .catch(error => console.log('error', error));
    }
    const getProfile = () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "__user_id__": token
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("https://dev.ordo.primesophic.com/get_ordouser_image.php", requestOptions)
            .then(response => response.json())
            .then(result => {
                // console.log('profile', result);
                let data = result.image_base64;
                let base64 = data.split(",");
                // console.log('profile url', base64[1]);
                profile.current = base64[1];
                //faceRecognise();

            })
            .catch(error => console.log('error', error));
    }











    useFocusEffect(
        React.useCallback(() => {
            //getTourPlanGrahpData();
            //getPlans();
            getPlans();
            clockIncheck();
            getLocation();
            FaceSDK.init(json => {
                response = JSON.parse(json)
                console.log(response);
                if (!response["success"]) {
                    console.log("Init failed: ");
                    console.log(json);
                }
            }, e => { })

        }, [])
    );

    const saveClockIn = () => {
        console.log("location", userCordinates);
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        var raw = JSON.stringify({
            "__user_id__": token,
            "__type__": "clockin",
            "__location__": "",
            "__latitude__": userCordinates[0],
            "__longitude__": userCordinates[1],
        });

        console.log(JSON.stringify({
            "__user_id__": token,
            "__type__": "clockin",
            "__location__": "",
            "__latitude__": userCordinates[0],
            "__longitude__": userCordinates[1],
        }))



        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("https://dev.ordo.primesophic.com/set_user_attendance.php", requestOptions)
            .then(response => response.json())
            .then(async result => {
                console.log('clock in save data', result);
                if (result?.status == "200") {
                    Alert.alert('Clock in ', `Clocked in successfully`);
                    setClockedIn(true);
                }
            })
            .catch(error => console.log('set attendance error', error))
            .finally(() => setLoading(false));
        ;
    }


    //user face recognisation
    const faceRecognise = async () => {

        console.log("inside");
        FaceSDK.presentFaceCaptureActivity(result => {
            let res = JSON.parse(result)
            //checking user cancle image picker
            if (res.exception) {
                console.log("User Canceled Face capture option");
                return;
            }
            setLoading(true);
            //console.log("image uri", FaceCaptureResponse.fromJson(JSON.parse(result)).image.bitmap);
            let base64Img = FaceCaptureResponse.fromJson(JSON.parse(result)).image.bitmap;
            const firstImage = new MatchFacesImage();
            firstImage.imageType = Enum.ImageType.PRINTED; //captured image
            firstImage.bitmap = profile.current
            const secondImage = new MatchFacesImage();
            secondImage.imageType = Enum.ImageType.LIVE; //live image
            secondImage.bitmap = base64Img;
            request = new MatchFacesRequest()
            request.images = [firstImage, secondImage]
            console.log("start compare", profile);
            //comparing two images
            FaceSDK.matchFaces(JSON.stringify(request), response => {
                response = MatchFacesResponse.fromJson(JSON.parse(response))
                console.log("ggg", response);
                FaceSDK.matchFacesSimilarityThresholdSplit(JSON.stringify(response.results), 0.75, str => {
                    var split = MatchFacesSimilarityThresholdSplit.fromJson(JSON.parse(str))
                    console.log("res", split.length);
                    if (split?.matchedFaces.length > 0) {
                        //face matched
                        let faceMatchPercentage = split.matchedFaces[0].similarity * 100
                        console.log("match percentage", faceMatchPercentage.toFixed(2));
                        saveClockIn();
                    }
                    else {
                        setLoading(false);
                        Alert.alert('Failed', 'Face not recognised please try again.')
                        //face doe not match
                        //alert('Face not recognised please try again.')

                    }
                }, e => { console.log("error") })
            }, e => { console.log("error") })


        }, e => { console.log("error", e) })



    }

    //miscellaneous task hooks value
    const [mValue, setMvalue] = useState('');
    const [mRemarks, setMRemarks] = useState('');
    const [isModalVisible2, setModalVisible2] = useState('');
    const [isFocus2, setIsFocus2] = useState(false);
    const [mtask, setMTask] = useState('');
    const [base64img, setBase64img] = useState('');


    const data = [
        { label: 'Secondary Offtake', value: 'Secondary Offtake' },
        { label: 'Competitor Analysis', value: 'Competitor Analysis' },
        { label: 'Return', value: 'Return' },
        { label: 'Shelf Display', value: 'Shelf Display' },

    ];

    const clearModalValue = () => {
        setMvalue('');
        setMRemarks('');
        setBase64img('');

    }

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
    const handleGallery = async () => {
        // setModalVisible1(false);
        const res = await launchImageLibrary({
            mediaType: 'photo',

        });
        console.log("response", res.assets[0].uri);
        imageResize(res.assets[0].uri, res.assets[0].type);
    }


    const imageResize = async (img, type) => {
        ImageResizer.createResizedImage(
            img,
            300,
            300,
            'JPEG',
            50,

        )
            .then(async (res) => {
                console.log('image resize', res);
                RNFS.readFile(res.path, 'base64')
                    .then(res => {
                        //console.log('base64', res);
                        //uploadImage(res)
                        setBase64img(`data:${type};base64,${res}`);
                    });
            })
            .catch((err) => {
                console.log(" img resize error", err)
            });
    }

    //Miscellaneous task
    const saveMiscellaneous = () => {
        if (mtask && mRemarks) {
            setModalVisible2(false);
            console.log("data is valid")
            //console.log("m type of task", mtask)
            //console.log("m remarks", mRemarks)
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "text/plain");
            var raw = JSON.stringify({
                "__user_id__": token,
                "__purpose_of_visit__": mtask,
                " __remarks__": mRemarks,
                "__account_id_c__": userData?.id
            })
            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };
            fetch("https://dev.ordo.primesophic.com/set_miscellaneous.php", requestOptions)
                .then(response => response.json())
                .then(res => {
                    console.log("api res 1234", res);
                    if (res?.status == 'success') {
                        Alert.alert('Miscellaneous Task', 'Miscellaneous Task data saved successfully', [
                            { text: 'OK' }
                        ])
                    }

                })
                .catch(error => console.log('add image error', error));
        }
        else {
            Alert.alert('Warning', 'Please fill all the details')
        }
    }


console.log("merch data for user",userData)
console.log("merch data for Dealer",userData)


    return (
        <View style={styles.container}>
            {/* {
                clockedIn == false ? (
                    <ClockIn
                        faceRecognise={faceRecognise}
                        logoutAlert={logoutAlert}
                        loading={loading}

                    />
                ) : ( */}
                    <View style={{ flex: 1, backgroundColor: 'white' }}>


                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 30, marginTop: 10 }}>

                            <Image source={require('../../assets/images/ordologo-bg.png')} style={{ height: 60, width: 70 }} />

                            <View style={{ alignItems: 'center', flexDirection: 'row', }}>

                                {/* <TouchableOpacity onPress={logoutAlert}>
                                    <Image source={require('../../assets/images/tourplan.png')} style={{ height: 20, width: 20, tintColor: Colors.primary, marginLeft: 20, marginRight: 10 }} />
                                </TouchableOpacity> */}

                                <TouchableOpacity onPress={logoutAlert}>
                                    <Image source={require('../../assets/images/power-off.png')} style={{ height: 20, width: 20, tintColor: Colors.primary }} />
                                    <Text style={{ fontSize: 10, color: Colors.primary, fontFamily: 'AvenirNextCyr-Thin', marginLeft: -5 }}>LogOut</Text>

                                </TouchableOpacity>

                            </View>
                        </View>
                        <View style={styles.elementsView}>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-start',alignItems:'center' }}>
                          <TouchableOpacity
                              disabled={userData?.account_profile_pic ? true : false}
                              // style={{paddingHorizontal:25}}
                              >
                              <Image
                                  //source={require('../../assets/images/account.png')}
                                  source={{ uri: userData?.account_profile_pic }}
                                  style={{ ...styles.avatar }}
                              />
                          </TouchableOpacity>
                        
                              <View style={{ flexDirection: 'column' ,marginLeft:25}}>
                                  <Text style={{ color: Colors.primary, fontSize: 14, fontFamily: 'AvenirNextCyr-Medium', borderBottomColor: 'grey' }}>{userData?.name}</Text>
                              {/* </View> */}
                              <Text style={{ color: 'black', fontSize: 13, fontFamily: 'AvenirNextCyr-Thin' }}>{userData?.shipping_address_street}</Text>
                              {/* <View style={{flexDirection:'row', justifyContent:'space-between'}}> */}
                              {/* <Text style={{ color: 'black', fontSize: 13, fontFamily: 'AvenirNextCyr-Thin' }}>{userData?.shipping_address_city}</Text> */}
                              <Text style={{ color: 'black', fontSize: 13, fontFamily: 'AvenirNextCyr-Thin' }}>{userData?.shipping_address_city} - {userData?.shipping_address_postalcode}</Text>

                              {/* <TouchableOpacity onPress={()=>{navigation.navigate('CustomerDetail',{ item: item })}}>
                              <Text style={{ color: 'orange', fontSize: 12, fontFamily: 'AvenirNextCyr-Thin' }}>See details</Text>
                              </TouchableOpacity> */}
                              </View>


                              {/* <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Thin' }}>{item?.street} {item?.city} {item?.shipping_address_state}</Text> */}
                              {/* <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Thin' }}>{item?.country} - {item?.postal_code}</Text> */}
                      </View>
</View>
<View style={{backgroundColor:'#ecf0f1',borderTopLeftRadius:30,borderTopRightRadius:30, flex:1, padding:10, elevation:5,marginTop:10}}>
      <TouchableOpacity activeOpacity={0.6} style={styles.recoredbuttonStyle} onPress={() => { navigation.navigate('SecondarySales') }} >
        <AntDesign name='shoppingcart' size={30} color={`#6B1594`} />

        <View style={{padding:10,flex:1}}>
          <Text style={{ fontFamily: "AvenirNextCyr-Medium", fontSize: 15, color: 'black'}}>Sales Order</Text>
          <Text style={{ fontFamily: "AvenirNextCyr-Thin", fontSize: 12, color: 'gray',flexWrap:'wrap',flexDirection:'row'}}>Resale of products by a retailer to an end consumer.</Text>
          </View>
          <AntDesign name='right' size={20} color={`#6B1594`} />
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.6} style={styles.recoredbuttonStyle}  onPress={() => navigation.navigate('CheckInInventory', { screen: 'MIListDetail', data: 'gifts' })}>
        <AntDesign name='gift' size={30} color={`#6B1594`} />
        <View style={{padding:10,flex:1}}>
          <Text style={{ fontFamily: "AvenirNextCyr-Medium", fontSize: 15, color: 'black'}}>Gifts</Text>
          <Text style={{ fontFamily: "AvenirNextCyr-Thin", fontSize: 12, color: 'gray',flexWrap:'wrap'}}> Express your appreciation with thoughtful presents.</Text>
</View>
          <AntDesign name='right' size={20} color={`#6B1594`} />
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.6} style={styles.recoredbuttonStyle} onPress={() => { navigation.navigate('CheckInInventory', { screen: 'CompetitorIntelligence',data: 'samples'  }) }}>
        <AntDesign name='CodeSandbox' size={30} color={`#6B1594`} />
        <View style={{padding:10,flex:1}}>
          <Text style={{ fontFamily: "AvenirNextCyr-Medium", fontSize: 15, color: 'black'}}>Sampling</Text>
          <Text style={{ fontFamily: "AvenirNextCyr-Thin", fontSize: 12, color: 'gray',flexWrap:'wrap'}}> Select a representative specimen or drug for testing.</Text>
</View>
          <AntDesign name='right' size={20} color={`#6B1594`} />
        </TouchableOpacity>

        {/* <TouchableOpacity activeOpacity={0.6} style={styles.recoredbuttonStyle} onPress={() => navigation.navigate('ReturnsCart')}>
          <Image transition={false} source={require('../../assets/images/returnOrder.png')} style={{ width: 30, height: 30, resizeMode: 'cover', alignSelf: 'center', marginTop: -1, tintColor: Colors.primary }}  >
          </Image>
          <Text style={{ fontFamily: "AvenirNextCyr-Medium", fontSize: 12, color: 'black', textAlign: 'center', marginTop: 12 }}>Return</Text>
        </TouchableOpacity> */}


      

{/* 
        <TouchableOpacity activeOpacity={0.6} style={styles.recoredbuttonStyle} onPress={() => { navigation.navigate('Payment') }}>
          <Image transition={false} source={require('../../assets/images/payment.png')} style={{ width: 30, height: 30, resizeMode: 'cover', alignSelf: 'center', marginTop: -1, tintColor: Colors.primary }} >
          </Image>
          <Text style={{ fontFamily: "AvenirNextCyr-Medium", fontSize: 12, color: 'black', textAlign: 'center', marginTop: 12 }}>Payment Collection</Text>
        </TouchableOpacity> */}

     

        {/* <TouchableOpacity activeOpacity={0.6} style={styles.recoredbuttonStyle}
          onPress={() => {
            //clearModalValue();
            navigation.navigate('MiscTask')

            //setModalVisible2(true)
          }} >
          <Image transition={false} source={require('../../assets/images/clipboard.png')} style={{ width: 30, height: 30, resizeMode: 'cover', alignSelf: 'center', marginTop: -1, tintColor: Colors.primary }} >
          </Image>
          <View style={{padding:10,flex:1}}>
          <Text style={{ fontFamily: "AvenirNextCyr-Medium", fontSize: 15, color: 'black'}}>Miscellaneous Task</Text>
          <Text style={{ fontFamily: "AvenirNextCyr-Thin", fontSize: 12, color: 'gray',flexWrap:'wrap'}}>Organize your task  based on urgency and importance.</Text>
          </View>
          <AntDesign name='right' size={20} color={`#6B1594`} />
        </TouchableOpacity> */}



        

      </View>
                {/* )} */}





            <Modal
                visible={isModalVisible2}
                animationType="slide"
                transparent={true}

            >
                {/* Modal content */}
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 10, }}>
                    <View style={{ backgroundColor: 'white', padding: 20, width: '90%', marginHorizontal: 10, borderRadius: 10, elevation: 5 }}>
                        {/* new */}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                            <Text style={{ ...styles.modalTitle, color: Colors.primary }}>Misc. Task</Text>
                            <TouchableOpacity onPress={() => { setModalVisible2(false) }}>
                                <AntDesign name='close' size={20} color={`black`} />
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>


                        </View>
                        {/* <View style={styles.dropDownContainer}>
              <Dropdown
                style={[styles.dropdown, isFocus2 && { borderColor: 'blue' }]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                itemTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={data}
                //search
                maxHeight={400}
                labelField="label"
                valueField="value"
                placeholder={!isFocus2 ? 'Select item' : '...'}
                //searchPlaceholder="Search..."
                value={mValue}
                onFocus={() => setIsFocus2(true)}
                onBlur={() => setIsFocus2(false)}
                onChange={item => {
                  setMvalue(item.value);
                  setIsFocus2(false);
                }}



              // renderLeftIcon={() => (
              //   <AntDesign
              //     style={styles.icon}
              //     color={isFocus ? 'blue' : 'black'}
              //     name="Safety"
              //     size={20}
              //   />
              // )}
              />
            </View> */}
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 1 }}>
                                <Text style={{ ...styles.modalTitle, marginBottom: 5 }}>Type of Task</Text>
                                <TextInput style={styles.cNameTextInput} placeholder='Type of Task'
                                    onChangeText={text => setMTask(text)}
                                />
                            </View>
                            {/* <View style={{ flex: 1, marginLeft: 5 }}>
                <Text style={styles.modalTitle}>Orders booked</Text>
                <TextInput style={styles.cNameTextInput} placeholder='Ordered booked'
                  onChangeText={text => setOrderBooked(text)}
                  keyboardType='numeric' />
                {/* new 
              </View> */}
                        </View>

                        <View>
                            <Text style={styles.modalTitle}>Upload Image</Text>
                            <View style={{ ...styles.buttonview, alignItems: 'center' }}>
                                <TouchableOpacity style={styles.photosContainer}
                                    onPress={checkPermission}
                                >
                                    <Text style={styles.buttonText}>Camera</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.photosContainer}
                                    onPress={handleGallery}
                                >
                                    <Text style={styles.buttonText}>Gallery</Text>
                                </TouchableOpacity>
                            </View>

                            {base64img && <Image source={{ uri: base64img }} style={styles.imgStyle} />}
                        </View>

                        <Text style={styles.modalTitle}>Remarks</Text>
                        {/* new */}
                        <TextInput
                            multiline={true}
                            numberOfLines={10}
                            placeholder="Enter Text..."
                            style={styles.textarea}
                            onChangeText={(val) => { setMRemarks(val) }}
                            //onChangeText={(text) => this.setState({ text })}
                            value={mRemarks}
                        />


                        <View style={styles.buttonview}>
                            <TouchableOpacity style={styles.buttonContainer} onPress={saveMiscellaneous}>
                                <Text style={styles.buttonText}>Submit</Text>
                            </TouchableOpacity>
                            {/* <TouchableOpacity style={styles.buttonContainer} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity> */}
                        </View>
                    </View>
                </View>
            </Modal>

            {clockedIn == true &&
                <ActionButton
                    buttonColor={Colors.primary}
                    renderIcon={() => <Ionicons name='chatbox' color='#fff' size={20} />}
                    onPress={() => { navigation.navigate('UserList') }}
                />}

        </View>
        </View>
    )
}

export default MerchHome

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    recoredbuttonStyle: {
        borderRadius: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        marginHorizontal: 5,
        shadowRadius: 2,
        elevation: 5,
        ...globalStyles.border,
        height: 100,
        width: 100,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10
    },
    row1View: {
        //marginHorizontal: 50,
        // paddingHorizontal: 30,
        // marginLeft:30,
        marginTop: 10,
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'center',
    },
    buttonTextStyle: {
        fontSize: 18,
        fontFamily: 'AvenirNextCyr-Medium',
    },
    activeOrder: {
        marginTop: 25,
        // backgroundColor: 'grey',
        marginHorizontal: 15,
        // alignItems:'center',
        paddingTop: 10,
        borderRadius: 20,
        // flex:1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 5,
        ...globalStyles.border,
        backgroundColor: 'white',

    },
    orderContent: {
        flexDirection: 'row',
        // backgroundColor: 'red',
        justifyContent: 'space-between',
        paddingHorizontal: 30,
        marginTop: 10,
        margin: 10,
    },
    createOrder: {
        borderRadius: 0,
        marginBottom: 20,
        elevation: 5,
        ...globalStyles.border,
        paddingVertical: 10,
        marginHorizontal: 30,
        backgroundColor: 'white',
        marginTop: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    elementsView: {
        backgroundColor: "white",
        marginHorizontal: 37,
        //borderColor: 'black',
        //flexDirection: 'row',
        //justifyContent: 'space-between',
        //alignItems: 'center',
        marginBottom: 16,
        borderRadius: 8,
        elevation: 5,
        ...globalStyles.border,
        padding: 8
        //borderColor: '#fff',
        //borderWidth: 0.5
    },
    modalTitle: {
        fontSize: 16,
        color: 'black',
        fontFamily: 'AvenirNextCyr-Medium'
    },
    textarea: {
        borderWidth: 0.5,
        borderColor: 'black',
        //margin: 15,
        marginTop: 8,
        borderRadius: 5,
        padding: 10,
        fontSize: 14,
        fontFamily: 'AvenirNextCyr-Thin',
        textAlignVertical: 'top',
        color: '#000'
    },
    dropDownContainer: {
        backgroundColor: 'white',
        marginBottom: 10
        //padding: 16,
        //backgroundColor:'red'
    },
    dropdown: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
    },
    icon: {
        marginRight: 5,
    },
    label: {
        position: 'absolute',
        backgroundColor: 'white',
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
    },
    placeholderStyle: {
        fontSize: 14,
        fontFamily: 'AvenirNextCyr-Thin'
    },
    selectedTextStyle: {
        fontSize: 16,
        fontFamily: 'AvenirNextCyr-Thin'
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
    title: {
        marginVertical: 10,
        paddingHorizontal: 36,
        fontSize: 18,
        fontFamily: 'AvenirNextCyr-Medium',
        color: 'black'
    },
    contentView: {
        color: 'black',
        fontSize: 12,
        fontFamily: 'Poppins-Italic',
        //fontStyle:'italic'
    },
    checkOutButton: {
        height: 50,
        margin: 10,
        // backgroundColor:'red',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
        backgroundColor: Colors.primary,
    },
    checkOutText: {
        fontFamily: 'AvenirNextCyr-Medium',
        color: '#fff',
        fontSize: 16
    },
    buttonTextStyle: {
        color: '#fff',
        fontFamily: 'AvenirNextCyr-Medium',
    },
    buttonview: {
        flexDirection: 'row'
    },
    buttonContainer: {
        heigh: 40,
        padding: 10,
        borderRadius: 10,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        //marginRight: 10,
        marginVertical: 10,
        backgroundColor: Colors.primary
    },
    buttonText: {
        fontFamily: 'AvenirNextCyr-Thin',
        color: 'white'
    },
    cNameTextInput: {
        height: 40,
        borderWidth: 1,
        borderColor: '#B3B6B7',
        padding: 5,
        fontFamily: 'AvenirNextCyr-Thin',
        marginBottom: 10
    },
    itemContainer: {
        marginTop: 10,
        marginLeft: 16,
        marginRight: 16,
        borderRadius: 8,
        backgroundColor: Colors.white,
        borderWidth: 1,
        padding: 10,
        borderColor: Colors.white,
        elevation: 3,
        ...globalStyles.border,
        marginBottom: 5,

    },
    orderDataContainer: {
        paddingHorizontal: 10
    },
    rowContainer: {
        //flexDirection: 'row',
        marginVertical: 3
    },
    heading: {
        color: '#000',
        fontFamily: 'AvenirNextCyr-Thin',
        fontSize: 14,
    },
    value: {
        color: 'black',
        fontFamily: 'AvenirNextCyr-Thin'
    },

    title2: {
        fontSize: 14,
        color: Colors.primary,
        fontFamily: 'AvenirNextCyr-Medium',
        textTransform: 'capitalize'

    },
    text: {
        fontSize: 14,
        color: Colors.black,
        fontFamily: 'AvenirNextCyr-Thin',
    },
    planHeading: {
        color: 'black',
        fontSize: 16,
        fontFamily: 'AvenirNextCyr-Medium',
        marginVertical: 3
    },
    planView: {
        marginLeft: 20,
        marginTop: 10
    },
    planText: {
        color: 'black',
        fontSize: 16,
        fontFamily: 'AvenirNextCyr-Medium'
    },

    createPlanBtn: {
        height: 40,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.primary,
        borderRadius: 8,
        //marginRight: 10
    },
    buttonTextStyle: {
        color: '#fff',
        fontFamily: 'AvenirNextCyr-Medium',
    },
    button: {
        height: 40,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        padding: 10

    },
    imgStyle: {
        width: 90,
        height: 90,
        resizeMode: 'cover',
        borderRadius: 8,
        //marginRight: 8, muliplr img style
        marginTop: 5,
        marginBottom: 5

    },
    photosContainer: {
        height: 40,
        padding: 10,
        borderRadius: 10,
        marginVertical: 10,
        backgroundColor: Colors.primary,
        marginRight: 10
    },
    disabledButtonStyle: {
        backgroundColor: '#ececec',
    },
    elementsView: {
        paddingVertical:10,
        // paddingHorizontal:15,
    
        backgroundColor: "white",
        margin: 20,
        //borderColor: 'black',
        //flexDirection: 'row',
        //justifyContent: 'space-between',
        //alignItems: 'center',
        marginBottom: 15,
        // borderRadius: 15,
        // elevation: 5,
    
        padding: 8
        //borderColor: '#fff',
        //borderWidth: 0.5
    },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: 50,
      borderWidth:1,
      borderColor:'gray',
    },
     recoredbuttonStyle: {
    // flex:1,
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5, marginHorizontal: 5,
    shadowRadius: 2,
    elevation: 5,
    ...globalStyles.border,
    height: 100,
    // width: 118,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent:'space-between',
    borderRadius: 10,
    marginBottom:10,
    marginTop:8,
    flexDirection:'row',
    padding:20

  
  },
})