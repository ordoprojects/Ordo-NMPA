import { StyleSheet, Text, View, TouchableOpacity, Dimensions, FlatList, Image, TextInput, ScrollView, Alert } from 'react-native'
import React, { useContext, useState } from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign';
import Colors from '../../constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../../Context/AuthContext';
import moment from 'moment';
const MerchPlanDetails = ({ navigation, route }) => {


    const width = Dimensions.get('window').width
    const [dealerArray, setDealerArray] = useState([]);

    //new
    const { item } = route.params;
    const [data, setData] = useState('');
    //const [dealerArray, setDealerArray] = useState([]);
    const { token } = useContext(AuthContext);

    // console.log("item", item)
    // const getPlanDetails = () => {
    //     var myHeaders = new Headers();
    //     myHeaders.append("Content-Type", "application/json");

    //     var raw = JSON.stringify({
    //         "__user_id__": token,
    //         "__id__": item?.id
    //     });

    //     console.log(JSON.stringify({
    //         "__user_id__": token,
    //         "__id__": item?.id
    //     }))

    //     var requestOptions = {
    //         method: 'POST',
    //         headers: myHeaders,
    //         body: raw,
    //         redirect: 'follow'
    //     };

    //     fetch("https://dev.ordo.primesophic.com/get_tour_plan_detail.php", requestOptions)
    //         .then(response => response.json())
    //         .then(result => {
    //             console.log('plan details data 123 ', result)
    //             setData(result?.status[0]);
    //             console.log('gg', data);
    //             result?.status[0].dealer_array.forEach(item => {
    //                 console.log("item", item)
    //             });
    //             setDealerArray(result?.status[0].dealer_array)
    //         })
    //         .catch(error => console.log('api error', error));
    // }

    const approvedPlanAccepted = () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "__id__": item?.id,
            "__ordo_user_full_name__": "Sales Manager",
            "__status__": "Approved"
        });

        // console.log(JSON.stringify({
        //     "__id__": item?.id,
        //     "__ordo_user_full_name__ ": "Sales Manager",
        //     "__status__": status
        // }))

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("https://dev.ordo.primesophic.com/set_approve_merchandisertourplan.php", requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log('Accepted Data', result)
                // console.log(result.status)
                if (result.status == "200") {
                    Alert.alert('Approve Plan', `Plan approved sucessfully`, [
                        { text: 'OK', onPress: () => { navigation.goBack() } },
                    ]);

                }

                // setData(result?.status[0]);
                // console.log('gg', data);
                // result?.status[0].dealer_array.forEach(item => {
                //     console.log("item", item)
                // });
                // setDealerArray(result?.status[0].dealer_array)
            })
            .catch(error => console.log('api error', error));
    }

    return (

        <View style={styles.container}>
            <View style={{ ...styles.headercontainer }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <AntDesign name='arrowleft' size={25} color={Colors.black} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Plan Details</Text>
            </View>
            <View style={{ ...styles.contentContainer, flexDirection: 'row', marginBottom: 10 }}>
                <View style={{ flex: 1 }}>
                    <Text style={{ ...styles.planText }}>Merchandiser Name</Text>
                    <Text style={{ ...styles.value, color: Colors.black }} >Merchandiser 1</Text>
                </View>

            </View>

            <View >
                <Text style={styles.planText}>Plan Name  </Text>
                <Text style={{ ...styles.value, color: Colors.primary, fontFamily: 'AvenirNextCyr-Medium', textTransform: 'capitalize' }}>{item?.name}</Text>
            </View>

            <View style={{ marginTop: 10 }}>
                <Text style={styles.planText}>Dealer Name  </Text>
                <Text style={{ ...styles.value, color: Colors.primary, fontFamily: 'AvenirNextCyr-Medium', textTransform: 'capitalize' }}>{item?.account_name}</Text>
            </View>
            <View style={{ marginTop: 10 }}>
                <Text style={styles.planText}>Duration  </Text>
                <Text style={styles.value}>{moment(item?.start_date).format('DD-MM-YY')} To {moment(item?.end_date).format('DD-MM-YY')} </Text>
            </View>


            <View style={{ ...styles.contentContainer, flexDirection: 'row', marginBottom: 10 }}>



                {/* <View style={{ flex: 0.8, marginLeft: 10 }}>
                    <Text style={styles.planText}>Duration  </Text>
                    <Text style={styles.value}>{moment(data.start_date).format('DD-MM-YY')} To {moment(data.end_date).format('DD-MM-YY')}  </Text>
                </View> */}
            </View>
            {/* <View>
                <Text style={styles.planText}>Duration  </Text>
                <Text style={styles.value}>{moment(item.start_date).format('DD-MM-YY')} To {moment(item.end_date).format('DD-MM-YY')}  </Text>
            </View> */}
            {/* {item.status == 'Approved' && <View style={{ ...styles.contentContainer, flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.planText}>Approved Date  </Text>
                    <Text style={styles.value} >{moment(data?.approved_date).format('DD-MM-YY')}</Text>
                </View>
                <View style={{ flex: 0.8, marginLeft: 10 }}>
                    <Text style={styles.planText}>Approved By</Text>
                    <Text style={styles.value}>{data?.approved_by}</Text>
                </View>
            </View>} */}
            {/* <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.planText}>Name:</Text>
                    <Text style={styles.planText}>{item.ordo_user_name}</Text>
                </View>
                <View style={{ flex: 1.7, marginLeft: 5 }}>
                    <Text style={styles.planText}>Plan Name :</Text>
                    <Text style={{ ...styles.planText, color: Colors.primary }}>{item.name} </Text>
                </View>
            </View>
            <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                <View style={{ flex: 1 }}>
                    {/* <Text style={{ ...styles.heading, fontFamily: 'AvenirNextCyr-Thin' }}>Status :</Text>
                                        <Text style={{ ...styles.heading, color: color, fontFamily: 'AvenirNextCyr-Medium' }}>{item.status == 'PendingApproval' ? 'In Progress' : item.status} </Text> 
                    <Text style={styles.planText}>No. of Dealers :</Text>
                    <Text style={{ ...styles.planText, fontFamily: 'AvenirNextCyr-Thin' }}>#{item?.dealer_count}</Text>
                </View>
                <View style={{ flex: 1.7, marginLeft: 5 }}>
                    <Text style={styles.planText}>Duration :</Text>
                    <Text style={{ ...styles.planText, fontFamily: 'AvenirNextCyr-Thin', color: 'grey' }}>{moment(item.start_date).format('DD-MM-YY')} To {moment(item.end_date).format('DD-MM-YY')}  </Text>
                </View>
            </View> */}

            {/* {item.status == 'Approved' && <View style={styles.contentContainer}>
                    <Text style={styles.planText}>Approved By : </Text>
                    <Text style={styles.value}>{data.approved_by}</Text>
                </View>} */}

            {/* new */}
            {/* {dealerArray.length > 0 && <Text style={styles.planText}>Dealer List
                </Text>} */}


            <View style={{ flex: 1, justifyContent: 'flex-end', marginBottom: 40 }}>
                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                    {/* <TouchableOpacity style={{ backgroundColor: 'red', borderRadius: 30, flex: 1, paddingVertical: 10 }} onPress={() => navigation.navigate('EditPlan', { id: item.id, manager: true })}>
                        <Text style={{ color: 'white', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium', textAlign: 'center' }}>Edit</Text>
                    </TouchableOpacity> */}
                    {item?.status==='Pending'&&
                    <TouchableOpacity style={{ backgroundColor: Colors.primary, borderRadius: 30, flex: 1, paddingVertical: 15, marginLeft: 10, }} onPress={() => approvedPlanAccepted()}>
                        <Text style={{ color: 'white', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium', textAlign: 'center' }}>Approve</Text>
                    </TouchableOpacity>
                    }
                </View>
            </View>
            {/* } */}
            {/* new */}
        </View>

    )
}

export default MerchPlanDetails

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 12,
        backgroundColor: '#fff'
    },
    contentContainer: {
        //marginLeft: 10,
        mariginTop: 5
    },
    planText: {
        color: 'black',
        fontSize: 16,
        ////ontWeight: '600',
        fontFamily: 'AvenirNextCyr-Medium',
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
        marginTop: 40,
        marginBottom: 10
    },
    startPlanView: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    headercontainer: {
        //padding: 10,
        paddingTop: 6,
        //backgroundColor:'red',
        flexDirection: 'row',
        alignItems: 'center',
        //marginBottom: 10
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: 'AvenirNextCyr-Medium',
        color: Colors.black,
        marginLeft: 10,
        marginTop: 3
    },
    value: {
        fontFamily: 'AvenirNextCyr-Thin',
        color: 'grey'

    }
})