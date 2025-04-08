import { StyleSheet, Text, View, TouchableOpacity, Image, Modal, FlatList, Alert } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';

import Colors from '../../constants/Colors';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { AuthContext } from '../../Context/AuthContext';
import { useFocusEffect } from '@react-navigation/native';
import moment from 'moment';
import { Dropdown } from 'react-native-element-dropdown';
import ActionButton from 'react-native-action-button';
import Ionicons from 'react-native-vector-icons/Ionicons';



const DeviatedPlans = ({ navigation }) => {


    const {
        approvedArray, token
    } = useContext(AuthContext)


    const [deviatedPlans, setDeviatedPlans] = useState([]);




    useEffect(() => {
        getDeviatedPlans();
    }, [])


    const getDeviatedPlans = () => {

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


        fetch("https://dev.ordo.primesophic.com/get_deviated_plan.php", requestOptions)
            .then(response => response.json())
            .then(async res => {
                console.log("deviated plans array", res)
                setDeviatedPlans(res.deviated_plan);
                
            })
            .catch(error => console.log('error', error));
    }


    const ApproveDeviated = (item) => {
        console.log("pressed plan", item.name);
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "__tp_id__": item.id,
            "__status__": "0"
        });


        console.log("set deviated statuus raw", raw);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };


        fetch("https://dev.ordo.primesophic.com/set_deviateplan_status.php", requestOptions)
            .then(response => response.json())
            .then(async res => {
                console.log("set deviated plans result", res)
                Alert.alert('Deviated Plan', 'Plan Approved successfully', [
                    { text: 'OK', onPress: () => navigation.navigate('Visits') }
                ])
    })
            .catch(error => console.log('error', error));
    }



    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>


            <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: '3%', paddingHorizontal: '5%', gap: 10, elevation: 8, backgroundColor: 'white' }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <AntDesign name='arrowleft' size={25} color={Colors.black} />
                </TouchableOpacity>

                <Text style={{ fontFamily: 'AvenirNextCyr-Medium', fontSize: 17 }}>Deviated Plans</Text>
            </View>


            <FlatList
                // data={dealerArray}
                data={deviatedPlans}
                renderItem={({ item }) => {

                    return (
                        <TouchableOpacity
                            style={styles.itemContainer}
                            key={item.id}
                        // onPress={() => navigation.navigate('SMApprovedPlanDetails', { item: item })}
                        // activeOpacity={0.5}
                        >
                            <View style={styles.orderDataContainer}>

                                <View>


                                    <View style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between'
                                    }}>
                                        <View style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            gap: 10
                                        }}>
                                            {/* <Image
                                                style={{ marginRight: 10, height: 15, width: 15, resizeMode: 'contain' }}
                                                source={require('../../assets/images/document2.png')} /> */}
                                            <AntDesign name="user" color="black" size={20} />
                                            <Text style={{ ...styles.title, color: Colors.black }}>{item?.username}</Text>
                                        </View>

                                    </View>

                                    <View style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        marginTop: 3,
                                        gap: 10,
                                        justifyContent: 'space-between'
                                    }}>


                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                gap: 10,
                                            }}>
                                            <Entypo name='text-document' size={20} color={Colors.black} />
                                            <Text style={{ ...styles.text, color: 'black', fontFamily: 'AvenirNextCyr-Thin' }}>{item?.name} </Text>
                                        </View>
                                        {/* <Image
                                            style={{ marginRight: 10, height: 15, width: 15, resizeMode: 'contain' }}
                                            source={require('../../assets/images/document2.png')} /> */}

                                        <TouchableOpacity
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                gap: 10,
                                                backgroundColor: Colors.primary,
                                                borderRadius: 10,
                                                padding: '2%'
                                            }}

                                            onPress={() => ApproveDeviated(item)}

                                        >

                                            <Text style={{ ...styles.text, color: 'white', fontFamily: 'AvenirNextCyr-Thin' }}>Approve </Text>
                                        </TouchableOpacity>

                                    </View>


                                    {/* <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginTop: 3,
                                }}>
                                    <Image
                                        style={{ marginRight: 10, height: 15, width: 15, resizeMo                                                                                                         vc                                                                                           fgh                               de: 'contain' }}
                                        source={require('../../assets/images/tick.png')} />
                                    <Text style={{ ...styles.text, color: color, fontFamily: 'AvenirNextCyr-Medium' }}>{item.status == 'PendingApproval' ? 'Pending Approval' : item.status} </Text>
                                </View> */}
                                    {/* <View style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        marginTop: 3,
                                    }}>
                                        <Image
                                            style={{ marginRight: 10, height: 15, width: 15, resizeMode: 'contain' }}
                                            source={require('../../assets/images/duration.png')} />
                                        <Text style={{ ...styles.text, fontWeight: '500' }}>{moment(item.start_date).format('DD-MM-YYYY')} To {moment(item.end_date).format('DD-MM-YYYY')}</Text>
                                    </View> */}


                                    <View style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        marginTop: 3,
                                        gap: 10
                                    }}>
                                        {/* <Image
                                            style={{ marginRight: 10, height: 15, width: 15, resizeMode: 'contain' }}
                                            source={require('../../assets/images/document2.png')} /> */}
                                        <Feather name='users' size={20} color={Colors.black} />
                                        <Text style={{ ...styles.text, color: Colors.primary, fontFamily: 'AvenirNextCyr-Medium' }}>{item?.account_name} </Text>
                                    </View>



                                </View>
                            </View>

                        </TouchableOpacity>

                        // <TouchableOpacity
                        //     style={styles.itemContainer}
                        //     onPress={() => navigation.navigate('SMApprovedPlanDetails', { item: item })}
                        //     // key={item.id}
                        //     activeOpacity={0.5}
                        // >
                        //     <View style={{ paddingHorizontal: 15, }}>
                        //         <View style={{ marginVertical: 3 }}>
                        //             {/* <Text style={styles.heading}>Plan Name : {item.name} </Text>
                        //     <Text style={styles.value}>Approved By : {item.approved_by}</Text>
                        //     <Text style={styles.heading}>No. of Visit : {item?.dealer_count} </Text>
                        //     <Text style={styles.heading}>Start Date : {item.start_date} </Text>
                        //     <Text style={styles.heading}>End Date : {item.end_date} </Text>
                        //     <Text style={styles.heading}>Status : {item.status} </Text> */}


                        //             {/* <Text style={styles.heading}>Salesman Name : {item?.ordo_user_name}</Text>
                        //             <Text style={styles.heading}>Plan Name : {item?.name}</Text>
                        //             <Text style={styles.heading}>No. of Visit : {item?.dealer_count}</Text>
                        //             <Text style={styles.heading}>Start Date : {item?.start_date}</Text>
                        //             <Text style={styles.heading}>End Date : {item.end_date}</Text> */}
                        //             <View style={{ flexDirection: 'row', }}>
                        //                 <View style={{ flex: 1 }}>
                        //                     <Text style={styles.heading}>Name:</Text>
                        //                     <Text style={{ ...styles.heading, fontFamily: 'AvenirNextCyr-Medium' }}>{item.ordo_user_name}</Text>
                        //                 </View>
                        //                 <View style={{ flex: 1.6, marginLeft: 5 }}>
                        //                     <Text style={styles.heading}>Plan Name :</Text>
                        //                     <Text style={{ ...styles.heading, color: Colors.primary, fontFamily: 'AvenirNextCyr-Medium' }}>{item.name} </Text>
                        //                 </View>
                        //             </View>
                        //             <View style={{ flexDirection: 'row', marginTop: 5 }}>
                        //                 <View style={{ flex: 1 }}>
                        //                     {/* <Text style={{ ...styles.heading, fontFamily: 'AvenirNextCyr-Thin' }}>Status :</Text>
                        //                     <Text style={{ ...styles.heading, color: color, fontFamily: 'AvenirNextCyr-Medium' }}>{item.status == 'PendingApproval' ? 'In Progress' : item.status} </Text> */}
                        //                     <Text style={{ ...styles.heading, color: 'black' }}>No. of Visits :</Text>
                        //                     <Text style={{ ...styles.heading, color: 'black' }}>#{item?.dealer_count}</Text>
                        //                 </View>
                        //                 <View style={{ flex: 1.6, marginLeft: 5 }}>
                        //                     <Text style={styles.heading}>Plan Duration :</Text>
                        //                     <Text style={{ ...styles.heading, color: 'grey' }}>{moment(item.start_date).format('DD-MM-YYYY')} To {moment(item.end_date).format('DD-MM-YYYY')}  </Text>
                        //                 </View>
                        //             </View>
                        //         </View>
                        //     </View>

                        // </TouchableOpacity>
                    )
                }}
            />
        </View>
    );
}


export default DeviatedPlans;


const styles = StyleSheet.create({
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
    },
    heading: {
        color: '#000',
        fontFamily: 'AvenirNextCyr-Thin',
        fontSize: 14,
    },
    value: {
        color: 'black',
        fontFamily: 'AvenirNextCyr-Thin',
        color:Colors.black
    },
    buttonTextStyle: {
        fontSize: 18,
        fontFamily: 'AvenirNextCyr-Medium',
    },

    modalTitle: {
        fontSize: 16,
        color: 'black',
        fontFamily: 'AvenirNextCyr-Medium'
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
    // title: {
    //     marginVertical: 10,
    //     paddingHorizontal: 36,
    //     fontSize: 18,
    //     fontFamily: 'AvenirNextCyr-Medium',
    //     color: 'black'
    // },
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
    modalTitle: {
        fontSize: 16,
        color: 'black',
        fontFamily: 'AvenirNextCyr-Medium'
    },
    cNameTextInput: {
        height: 40,
        borderWidth: 1,
        borderColor: '#B3B6B7',
        padding: 5,
        fontFamily: 'AvenirNextCyr-Thin',
        marginBottom: 10
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
    orderDataContainer: {
        paddingHorizontal: 10
    },
    title: {
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
    }


})