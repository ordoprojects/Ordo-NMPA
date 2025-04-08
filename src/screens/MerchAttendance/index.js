import React, { useState, useContext, useEffect, useRef } from 'react'
import { Text, View, Image, TouchableOpacity, Alert, LogBox, NativeEventEmitter, FlatList } from 'react-native'
import styles from './style'
import SampleData from '../../utils/SampleData'
import moment from 'moment'
import { AuthContext } from '../../Context/AuthContext'
import firestore from '@react-native-firebase/firestore';
import { locationPermission, getAddress } from '../../utils/Helper'
import Geolocation from 'react-native-geolocation-service';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useFocusEffect } from '@react-navigation/native';
import FaceSDK, { Enum, FaceCaptureResponse, MatchFacesResponse, MatchFacesRequest, MatchFacesImage, MatchFacesSimilarityThresholdSplit, RNFaceApi } from '@regulaforensics/react-native-face-api'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Colors from '../../constants/Colors'
import AntDesign from 'react-native-vector-icons/AntDesign';

const eventManager = new NativeEventEmitter(RNFaceApi)


LogBox.ignoreLogs(['new NativeEventEmitter'])
const MerchAttendance = ({navigation}) => {
    const [data, setData] = useState([]);
    //const { logout, userData, userToken } = useContext(AuthContext);
    const [clockInPressed, setClockInPressed] = useState(false);
    const [docId, setdocId] = useState('');
    const place = useRef('');
    // const [noData, setNodata] = useState(false);
    const [attendanceMarked, setAttendanceMarked] = useState(false);

    const { token } = useContext(AuthContext);
    const [userCordinates, setUserCordinates] = useState([]);
    const profile = useRef('');

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
                    setUserCordinates[res.coords.latitude, res.coords.longitude]

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

    const saveCheckOut = async () => {

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        var raw = JSON.stringify({
            "__user_id__": token,
            "__type__": "clockout"
        });
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("https://dev.ordo.primesophic.com/set_user_attendance.php", requestOptions)
            .then(response => response.json())
            .then(async result => {
                console.log('clock out save data', result);
                if (result.status == "200") {
                    Alert.alert('Clock out ', `Clocked out in successfully`);
                    clockOutcheck();
                }

            })
            .catch(error => console.log('clock out api error', error));


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
                //console.log('profile', result);
                let data = result.image_base64;
                let base64 = data.split(",");
                //console.log('profile url', base64[1]);
                profile.current = base64[1];


            })
            .catch(error => console.log('error', error));
    }

    const clockOutcheck = () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "__user_id__": token,
            "__type__": "clockout"
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
                if (result.status == "200") {
                    setAttendanceMarked(true);
                }
                else if (result.status == "201") {
                    setAttendanceMarked(false);
                }

            })
            .catch(error => console.log('clock out check error', error));
    }






    useFocusEffect(

        React.useCallback(() => {
            clockOutcheck();
            getAttendance();
            getProfile();
            getLocation();

            //fetchAttendaceData();
            //setNodata(false);
            //getting location
            //getLocation();
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

    function convertUTCDateToLocalDate(date) {
        var newDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);

        var offset = date.getTimezoneOffset() / 60;
        var hours = date.getHours();

        newDate.setHours(hours - offset);

        return newDate;
    }

    const getAttendance = async () => {
        var myHeaders = new Headers();
        console.log("token", token)
        myHeaders.append("Content-Type", "text/plain");

        var raw = JSON.stringify({
            "__user_id__": token
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("https://dev.ordo.primesophic.com/get_user_attendance.php", requestOptions)
            .then(response => response.json())
            .then(result => {
                let tempArray = [];
                console.log("get attendance data", result);
                result?.attendance_array.forEach(item => {
                    console.log('date item', item);
                    tempArray.push({
                        id: item.id,
                        clockIn: new Date(item?.date_entered),
                        clockOut: new Date(item?.logout_time),
                        location: item?.location,
                        name: item?.name
                    });
                    // console.log("clock in ", new Date("2023-05-31 12:43:52"));
                    // console.log("clock out ", item?.name_value_list.logout_time);
                })
                let sortedarray = tempArray.sort((a, b) => (a.clockIn < b.clockIn) ? 1 : -1)
                setData(sortedarray);
            })
            .catch(error => console.log('get attendnace error', error));

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
                        saveCheckOut();
                    }
                    else {
                        //face doe not match
                        alert('Face not recognised please try again.')
                    }
                }, e => { console.log("error") })
            }, e => { console.log("error") })


        }, e => { console.log("error", e) })



    }







    const renderItem = ({ item, index }) => {
        return (
            <View style={styles.attendanceView}>

                <View style={styles.dateViewContainer}>
                    <Text style={styles.month} >{moment(item.clockIn).format("MMM")}</Text>
                    <Text style={styles.dateValStyle}>{moment(item.clockIn).format("DD")}</Text>
                </View>
                <View style={styles.infoViewContainer}>

                    <Text style={styles.weekNameTextStyle}>{moment(item.clockIn).format("ddd yy, hh:mm a")} to {moment(item.clockOut).format("hh:mm a")}</Text>
                    <Text style={styles.place}>{/*{item.place.slice(0, 30) + '\n' + item.Place.slice(30)} */}{item.location}</Text>
                    <Text style={styles.name}>{item?.name}</Text>
                </View>

            </View>
        )

    }

    // const logoutAlert = () => {
    //     Alert.alert('Logout', 'Are you sure to logout?', [
    //         {
    //             text: 'Cancel',
    //             style: 'cancel',
    //         },
    //         { text: 'OK', onPress: () => logout() },
    //     ]);
    // }
    return (
        <View style={styles.container}>
            {/* <View style={styles.headerContainer}>
                <View style={{ flexDirection: 'row' }}>
                    <Image
                        source={{ uri: `data:image/jpeg;base64,${userData?.Profile}` }}
                        //source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQEZrATmgHOi5ls0YCCQBTkocia_atSw0X-Q&usqp=CAU' }}
                        style={{ height: 50, width: 50, borderRadius: 25, marginRight: 10,resizeMode:'stretch' }}
                    />
                    <View>
                        <Text style={styles.nameText}>Hello, {userData?.Name}</Text>
                        <Text style={styles.dateText}>{moment(new Date()).format("D MMM YYYY")}</Text>
                    </View>
                </View>
                <TouchableOpacity onPress={logoutAlert}>
                    <MaterialIcons name='logout' size={30} color='black' />
                </TouchableOpacity>


            </View> */}
            <View style={{ ...styles.headercontainer2 }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <AntDesign name='arrowleft' size={25} color={Colors.black} />
                </TouchableOpacity>
                <Text style={styles.headerTitle2}>Attendance</Text>
            </View>
            <View style={styles.clockInContainer}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.headerTitle}>Let's get to work</Text>
                    <Image
                        source={{ uri: 'https://cdn.shopify.com/s/files/1/1061/1924/products/Writing_Hand_Emoji_Icon_ios10_grande.png?v=1571606092' }}
                        style={{ height: 20, width: 20, marginLeft: 5 }}
                    />
                </View>
                <TouchableOpacity style={{ ...styles.buttonStyle, backgroundColor: attendanceMarked ? 'grey' : Colors.primary }} onPress={faceRecognise} disabled={attendanceMarked}>
                    <Text style={styles.buttonTextStyle}>Clock Out</Text>
                </TouchableOpacity>

            </View>

            <Text style={styles.title}>Attendance History</Text>
            <FlatList
                data={data}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}

            />




        </View>
    )
}

export default MerchAttendance


