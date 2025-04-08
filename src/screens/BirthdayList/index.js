import React, { useState, useContext, useEffect, useRef } from 'react'
import { Text, View, Image, TouchableOpacity, Alert, LogBox, NativeEventEmitter, Modal, FlatList } from 'react-native'
import styles from './style'
import SampleData from '../../utils/SampleData'
import moment from 'moment'
import { AuthContext } from '../../Context/AuthContext'
import firestore from '@react-native-firebase/firestore';
import { locationPermission, getAddress } from '../../utils/Helper'
import Geolocation from 'react-native-geolocation-service';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';

import { useFocusEffect } from '@react-navigation/native';
import FaceSDK, { Enum, FaceCaptureResponse, MatchFacesResponse, MatchFacesRequest, MatchFacesImage, MatchFacesSimilarityThresholdSplit, RNFaceApi } from '@regulaforensics/react-native-face-api'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Colors from '../../constants/Colors'
import Icon from 'react-native-vector-icons/FontAwesome';
import { Dropdown } from 'react-native-element-dropdown';
import FontAwesome from 'react-native-vector-icons/FontAwesome';


const eventManager = new NativeEventEmitter(RNFaceApi)


LogBox.ignoreLogs(['new NativeEventEmitter'])

const BirthdayList = ({ navigation }) => {
    const [data, setData] = useState([]);
    //const { logout, userData, userToken } = useContext(AuthContext);
    const [clockInPressed, setClockInPressed] = useState(false);
    const [docId, setdocId] = useState('');
    const place = useRef('');
    // const [noData, setNodata] = useState(false);
    const [attendanceMarked, setAttendanceMarked] = useState(false);

    const { token, salesManager } = useContext(AuthContext);
    const [userCordinates, setUserCordinates] = useState([]);
    const [isModalVisible, setModalVisible] = useState(false);
    const [attendanceData, setAttendanceData] = useState([]);
    const [masterData, setMasterData] = useState([]);

    const [isFocus, setIsFocus] = useState(false);
    const profile = useRef('');

    const [filterVal, setFilterVal] = useState('')

    const [sortLabelArray, setSortLabelArray] = useState([]);

    useEffect(() => {
        //getting active dealer list for the particular user
        getBirthday();
    }, [])


    const getBirthday = async () => {
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

        fetch("https://dev.ordo.primesophic.com/get_todays_dob.php", requestOptions)
            .then(response => response.json())
            .then(result => {
              
                console.log("label array",result)
                setData(result);
                setMasterData(result);

            })
            .catch(error => console.log('get attendnace error', error));

    }


    console.log("FSGgvsagasf",attendanceData)



    const renderItem = ({ item, index }) => {
        return (
            <View style={styles.attendanceView}>

                <View style={styles.dateViewContainer}>
                <Image
          source={{uri:item.account_profile_pic}}
          style={styles.avatar}
        />
                </View>
                <View style={styles.infoViewContainer}>

                    {/* <Text style={styles.place}>{item.place.slice(0, 30) + '\n' + item.Place.slice(30)}{item.location}</Text> */}
                    <Text style={styles.name}>{item?.name}</Text>
                    <Text style={{fontSize:12 , fontFamily:'AvenirNextCyr-Medium',flex:1}}>{item?.birthday_message}</Text>

                    {/* birthday_message */}
                </View>

            </View>
        )

    }

    const filterData = () => {
        setModalVisible(false);
        setData(masterData.filter((entry) => entry.name == filterVal))
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

            <View style={{ ...styles.headercontainer }}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 5 }}>
                    <AntDesign name='arrowleft' size={25} color={Colors.black} />
                </TouchableOpacity>
                <Text style={{ fontSize:20, fontFamily:'AvenirNextCyr-Medium',marginLeft: 10 }}>Birthday/ Anniversary</Text>
                <TouchableOpacity style={styles.filterButton} onPress={() => {


                    toggleModal();
                }
                }
                >
                    {/* <Icon name="filter" size={20} color="#6B1594" />
                    <Text style={{ fontSize: 10, color: Colors.primary, fontFamily: 'AvenirNextCyr-Thin', marginLeft: 5 }}>Filter</Text> */}
                </TouchableOpacity>
            </View>
          

            <FlatList
                data={data}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}

            />
       




        </View>
    )
}

export default BirthdayList


