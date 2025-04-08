import React, { useState, useContext, useEffect, useRef } from 'react'
import { Text, View, Image, TouchableOpacity, Alert, LogBox, NativeEventEmitter , FlatList} from 'react-native'
import styles from './style'
import SampleData from '../../utils/SampleData'
import moment from 'moment'
import { AuthContext } from '../../Context/AuthContext'
import { useFocusEffect } from '@react-navigation/native';

import AntDesign from 'react-native-vector-icons/AntDesign';
import Colors from '../../constants/Colors'



const PreviousVisits = ({ navigation }) => {

    const [data, setData] = useState([]);
    const { token, dealerData } = useContext(AuthContext);
    console.log("dealer data", dealerData);
    useFocusEffect(

        React.useCallback(() => {

            getAttendance();


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
        myHeaders.append("Content-Type", "text/plain");

        var raw = JSON.stringify({
            "__module_code__": "PO_37",
            "__query__": `po_ordousers_id_c ='${token}' AND account_id_c='${dealerData?.id}'`,
            "__orderby__": "",
            "__offset__": 0,
            "__select _fields__": [
                "id",
                "name"
            ],
            "__max_result__": 500,
            "__delete__": 0
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("https://dev.ordo.primesophic.com/get_data_s.php", requestOptions)
            .then(response => response.json())
            .then(result => {
                let tempArray = [];

                console.log("get attendance data", result?.entry_list);
                result?.entry_list.forEach(item => {
                    //console.log('date item', item);
                    if (item.name_value_list.check_in.value && item.name_value_list.check_out.value) {
                        tempArray.push({
                            id: item.id,
                            clockIn: new Date(item.name_value_list.check_in.value),
                            clockOut: new Date(item.name_value_list.check_out.value),
                            name: item.name_value_list.dealer_id.value
                        });
                    }
                    //console.log("clock in ", new Date(item.name_value_list.check_in.value));
                    //console.log("clock out ", item.name_value_list.check_out.value);
                })
                let sortedarray = tempArray.sort((a, b) => (a.clockIn < b.clockIn) ? 1 : -1)
                //console.log("sorted array", sortedarray);
                setData(sortedarray);


            })
            .catch(error => console.log('get attendnace error', error));

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
                    <Text style={styles.place}>{/*{item.place.slice(0, 30) + '\n' + item.Place.slice(30)} */}{item.name}</Text>
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
            <View style={{ ...styles.headercontainer }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <AntDesign name='arrowleft' size={25} color={Colors.black} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Previous Visits</Text>
            </View>

            <FlatList
                data={data}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}

            />




        </View>
    )
}

export default PreviousVisits


