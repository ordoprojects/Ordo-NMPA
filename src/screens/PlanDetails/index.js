import { StyleSheet, Text, View, TouchableOpacity, Dimensions, FlatList, Image, TextInput, ScrollView, Alert, Modal, Platform } from 'react-native'
import React, { useContext, useState, useEffect, useRef, useCallback } from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign';
import Colors from '../../constants/Colors';
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../../Context/AuthContext';
import moment from 'moment';
import FaceSDK, { Enum, FaceCaptureResponse, MatchFacesResponse, MatchFacesRequest, MatchFacesImage, MatchFacesSimilarityThresholdSplit, RNFaceApi } from '@regulaforensics/react-native-face-api'
import globalStyles from '../../styles/globalStyles';
import Geolocation from 'react-native-geolocation-service';
import { locationPermission } from '../../utils/Helper';
import { ExpandableCalendar, AgendaList, CalendarProvider, WeekCalendar } from 'react-native-calendars';
import ExpandableCalendarScreen from './ExpandableCalendarScreen';
import LinearGradient from 'react-native-linear-gradient';
import * as Progress from 'react-native-progress';
import Toast from 'react-native-simple-toast';



const PlanDetails = ({ navigation, route }) => {

    const { token, userData } = useContext(AuthContext);
    const { item, planId, screen } = route?.params;
    // new
    const width = Dimensions.get('window').width
    const [dealerArray, setDealerArray] = useState([]);
    const [externalVisit, setExternalVisit] = useState([]);
    const [clockedIn, setClockedIn] = useState(null);
    const [loading, setLoading] = useState(false);
    const profile = useRef('');
    const [userCordinates, setUserCordinates] = useState([]);
    const [region, setRegion] = useState('');
    const [isModalVisible, setModalVisible] = useState(false);
    const [desc, setDesc] = useState('')
    const [price, setPrice] = useState('');
    const [value, setValue] = useState([]);
    const [isFocus, setIsFocus] = useState(false);
    const [modeOfPayment, setModeOfPayment] = useState(null);
    const [quote, setquote] = useState('');
    const [deviateModal, setDeviateModal] = useState(false);
    const [deviatedCustomers, setDeviatedCustomers] = useState([]);
    const [data, setData] = useState('');






    const getLocation = async () => {
        let locPermissionDenied = await locationPermission();
        if (locPermissionDenied) {
            Geolocation.getCurrentPosition(
                async (res) => {

                    //getting user location
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





    useFocusEffect(
        React.useCallback(() => {
            getPlanDetails();
        }, [])
    );


    const getPlanDetails = async () => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${userData.token}`);
        // myHeaders.append("Cookie", "csrftoken=RK01uE9J0xQQMWCjMG7ZfcSnMMQJI9Yl");

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            body: null,
            redirect: 'follow'
        };


        // console.log(`https://gsidev.ordosolution.com/api/sales_tourplan/${planId}/`)

        await fetch(`https://gsidev.ordosolution.com/api/sales_tourplan/${planId}/`, requestOptions)
            .then(response => response.json())
            .then(result => {
                // console.log("result", result.activity);

                // Transform the activity array
                const newActivityArray = Object.keys(result.activity[0]).map(date => {
                    return {
                        title: date.slice(0, 4) + '-' + date.slice(4, 6) + '-' + date.slice(6, 8), // Convert date to 'YYYY-MM-DD' format
                        data: result.activity[0][date].map(activity => ({
                            account_id: parseInt(activity.account_id),
                            status: activity.status,
                            account_profile_pic: activity.profile_picture,
                            account_name: activity.name,
                            client_address: activity.client_address,
                            sales_checkin: activity.sales_checkin
                        }))
                    };
                });


                console.log("sdfsdfsfd", newActivityArray[0])

                const progress = result.completed_visits / result.total_visits;

                // Add progress to the result object
                const newData = { ...result, progress };

                setData(newData);
                setDealerArray(newActivityArray);
            })
            .catch(error => console.log('api error', error));
    }




    // const getPlanDetails = async () => {
    //     var myHeaders = new Headers();
    //     myHeaders.append("Authorization", `Bearer ${userData.token}`);
    //     // myHeaders.append("Cookie", "csrftoken=RK01uE9J0xQQMWCjMG7ZfcSnMMQJI9Yl");

    //     var raw = "";

    //     var requestOptions = {
    //         method: 'GET',
    //         headers: myHeaders,
    //         body: raw,
    //         redirect: 'follow'
    //     };

    //     await fetch(`https://gsidev.ordosolution.com/api/sales_tourplan/${planId}/?user_id=${userData.id}`, requestOptions)
    //         .then(response => response.json())
    //         .then(result => {
    //             console.log("result", result)
    //             setData(result);
    //             setDealerArray(result?.activity);
    //         })
    //         .catch(error => console.log('api error', error));
    // }

    // console.log("data",data)


    useFocusEffect(
        React.useCallback(() => {
            getLocation();
            FaceSDK.init(json => {
                response = JSON.parse(json)
                if (!response["success"]) {
                    console.log("Init failed: ");
                    console.log(json);
                }
            }, e => { })

        }, [])
    );


    const approvePlan = async () => {

        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${userData.token}`);
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "plan_id": planId,
            "status": "Approved",
            "approved_by": userData.name
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow',
        };

        console.log("rawwwwww", userData);

        await fetch(`https://gsidev.ordosolution.com/api/sales_tourplan/update_status/`, requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log("resulltttt", result)
                // console.log("Edit detail", result.data.id);
                if (result.status == 200) {
                    Toast.show('Plan Approved successfully', Toast.LONG);
                    getPlanDetails();
                }
            })
            .catch(error => console.log('error', error));
    };





    return (


        <View style={styles.container}>

            <View style={styles.rowContainer}>
                {/* <View style={{ ...styles.headercontainer }}> */}
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <AntDesign name='arrowleft' size={25} color={Colors.black} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Plan Details</Text>

                <View />
            </View>



            <LinearGradient
                colors={Colors.linearColors}
                start={Colors.start}
                end={Colors.end}
                locations={Colors.ButtonsLocation}
                style={{ borderRadius: 8, padding: '4%', marginTop: '2%' }}
            >


                <View style={{ marginBottom: 10 }}>
                    {/* <Text style={{ ...styles.planText,color:'grey',fontFamily:'AvenirNextCyr-Medium' }}>Plan Name  </Text> */}
                    <View style={{ flexDirection: 'row', gap: 10, marginBottom: '2%' }}>
                        <Text style={{ ...styles.value, fontSize: 16, color: 'white', fontFamily: 'AvenirNextCyr-Bold', textTransform: 'capitalize' }}>{data?.name}</Text>
                    </View>

                    <Text style={styles.value}>{moment(data.start_date).format('DD/MM/YYYY')}  - {moment(data.end_date).format('DD/MM/YYYY')}  </Text>
                </View>

                <View style={{ ...styles.contentContainer, flexDirection: 'row' }}>
                    <View style={{ flex: 1 }}>
                        <Text style={{ ...styles.planText }}>Created Date  </Text>
                        <Text style={styles.value} >{moment(data?.created_at).format('DD MMM YY')}</Text>
                    </View>
                    <View style={{ flex: 1, marginLeft: 10 }}>
                        <Text style={styles.planText}>No. of Customers  </Text>
                        <Text style={styles.value}>#2</Text>
                    </View>
                </View>


                {(data?.status == 'Approved' || data?.status == 'Completed') && <View style={{ ...styles.contentContainer, flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>


                    <View style={{ flex: 1, }}>
                        <Text style={styles.planText}>Approved By</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.value}>{data?.approved_by}</Text>
                        </View>
                    </View>
                    <View style={{ flex: 1, marginLeft: 10 }}>
                        <Text style={styles.planText}>Approved Date </Text>
                        <Text style={styles.value} >{moment(data?.updated_at).format('DD MMM YY')}</Text>
                    </View>

                </View>}
            </LinearGradient>


            <View>
                <Text style={{ ...styles.planText1, marginVertical: '2%' }}>Customer Visits</Text>

                <View style={{ elevation: 8, backgroundColor: 'white', marginBottom: '2%' }}>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: '3%' }}>
                        <View style={{ flexDirection: 'row', gap: 10 }}>
                            {(data?.status == "Approved" || data?.status == "Completed") && <Text style={{ fontFamily: 'AvenirNextCyr-Bold' }}>{Math.round(data.progress * 100)}%</Text>}
                            <Text style={{ fontFamily: 'AvenirNextCyr-Bold', color: data?.status == "Pending" ? 'orange' : 'black' }}>{(data?.status == "Approved" || data?.status == "Completed") ? 'In Progress...' : 'Pending Approval'}</Text>
                        </View>
                        <View>
                            {(data?.status == "Approved" || data?.status == "Completed") && <Text style={{ fontFamily: 'AvenirNextCyr-Bold' }}>{data?.completed_visits}/{data?.total_visits}</Text>}
                            {(data?.status == "Pending") && <Text style={{ fontFamily: 'AvenirNextCyr-Bold' }}>Assigned Visits {data?.total_visits}</Text>}

                        </View>
                    </View>

                    {(data?.status == "Approved" || data?.status == "Completed") && < Progress.Bar progress={data?.progress} width={null} borderRadius={0} color={Colors.primary} unfilledColor='rgba(142, 67, 144, 0.3)' borderWidth={0} />}
                </View>
            </View>
            <View style={{ flex: 1 }}>
                {dealerArray && dealerArray.length > 0 && <ExpandableCalendarScreen dealerArray={dealerArray} navigation={navigation}/>}
            </View>

            {screen == "approve" && data?.status !== "Approved" &&
                <TouchableOpacity style={{ backgroundColor: 'green', justifyContent: 'center', alignItems: 'center', borderRadius: 8, paddingVertical: '3%', marginBottom: '2%' }}
                    onPress={approvePlan}
                >
                    <Text style={{ color: 'white', fontFamily: 'AvenirNextCyr-Medium' }}>Approve</Text>
                </TouchableOpacity>}

        </View>

    )
}

export default PlanDetails

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 12,
        backgroundColor: '#fff'
    },
    contentContainer: {
        //marginLeft: 10,

        marginTop: 5
    },
    planText: {
        color: 'white',
        fontSize: 14,
        ////ontWeight: '600',
        fontFamily: 'AvenirNextCyr-Medium',
    },
    planText1: {
        // color: Colors.primary,
        fontSize: 16,
        ////ontWeight: '600',
        fontFamily: 'AvenirNextCyr-Medium',
    },
    loginText: {
        color: 'white',
        fontFamily: 'AvenirNextCyr-Medium',
    },
    loginBtn: {
        width: "100%",
        // backgroundColor: "#6B1594",
        borderRadius: 30,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: '2%'

    },
    startPlanView: {
        alignItems: 'center',
        // flex: 1,
        justifyContent: 'flex-end',
        marginBottom: 20
    },
    headercontainer: {
        //padding: 10,
        paddingTop: 6,
        //backgroundColor:'red',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'


    },
    headerTitle: {
        fontSize: 18,
        fontFamily: 'AvenirNextCyr-Medium',
        color: Colors.black,
        marginLeft: 10,
        marginTop: 3
    },
    value: {
        fontFamily: 'AvenirNextCyr-Medium',
        color: 'white'

    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 5
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
        width: '100%',        // padding: 10,
        borderRadius: 10,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        //marginRight: 10,
        marginVertical: 10,
        // backgroundColor: Colors.primary
    },
    buttonText: {
        fontFamily: 'AvenirNextCyr-Medium',
        color: 'white'
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
        marginTop: 5,
        borderRadius: 5,
        padding: 10,
        fontSize: 14,
        fontFamily: 'AvenirNextCyr-Medium',
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
    modalTitle: {
        fontSize: 16,
        color: 'black',
        fontFamily: 'AvenirNextCyr-Medium'
    },
    cNameTextInput: {
        height: 50,
        borderWidth: 1,
        borderColor: '#B3B6B7',
        padding: 5,
        fontFamily: 'AvenirNextCyr-Medium',
        marginBottom: 10,
        borderRadius: 5,
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
    modalContainer1: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent1: {
        backgroundColor: 'white',
        width: 300,
        borderRadius: 10,
        padding: 30,
    },
    centeredContent: {
        flex: 1, // Make the content take up all available vertical space
        justifyContent: 'center', // Center vertically
        alignItems: 'center', // Center horizontally
    },
    itemContainer: {
        marginTop: 10,
        marginHorizontal: '5%',
        borderRadius: 8,
        backgroundColor: Colors.white,
        borderWidth: 1,
        padding: 10,
        borderColor: Colors.white,
        elevation: 3,
        marginBottom: 5,
        ...globalStyles.border,

    },
})
