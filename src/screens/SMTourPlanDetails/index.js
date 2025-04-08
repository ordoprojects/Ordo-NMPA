import { StyleSheet, Text, View, TouchableOpacity, Dimensions, FlatList, Image, TextInput, ScrollView, Alert } from 'react-native'
import React, { useContext, useState } from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign';
import Colors from '../../constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../../Context/AuthContext';
import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient';
import { List } from 'react-native-paper';


const SMTourPlanDetails = ({ navigation, route }) => {




    const { item } = route.params;
    // console.log("jhsdbkjshd", item.activity)
    const [data, setData] = useState('');
    const { token, userData } = useContext(AuthContext);
    const [quote, setquote] = useState('');
    const [region, setRegion] = useState('');

    const [dealerArray, setDealerArray] = useState(item.activity);



    const getFullDayName = (abbreviatedName) => {
        const dayMappings = {
            1: 'Monday',
            2: 'Tuesday',
            3: 'Wednesday',
            4: 'Thursday',
            5: 'Friday',
            6: 'Saturday',
            7: 'Sunday',
        };
        return dayMappings[abbreviatedName] || abbreviatedName;
    };



    const AccordionComponent = ({ day, data }) => (
        <List.Accordion
            title={day}
            left={props => <List.Icon {...props} icon="calendar" />}
        >
            {data.map((item, index) => (
                <List.Item
                    key={index}
                    title={item.name}
                    right={() => (
                        item.status === 'Completed' && <List.Icon icon="check-decagram" color='green' />
                    )}
                    left={() => (
                        <Image
                            source={require('../../assets/images/doctor.jpg')}
                            style={{
                                height: 30,
                                width: 30,
                                borderRadius: 30 / 2,
                                resizeMode: 'contain',
                                borderWidth: 1,
                                borderColor: 'gray',
                                marginTop: '2%',
                            }}
                        />
                    )}
                    style={{ paddingHorizontal: '7%' }}
                />
            ))}
        </List.Accordion>
    );



    const ApproveTourPlan = () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${userData.token}`);

        console.log(userData.token)

        var raw = JSON.stringify({
            "status": "Approved"
        });


        var requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(`https://gsidev.ordosolution.com/api/tourplans/${item.id}/`, requestOptions)
            .then((response) => {
                if (response.status === 200) {

                    Alert.alert('Approve Plan', `Plan Approved sucessfully`, [
                        { text: 'OK', onPress: () => { navigation.goBack() } },
                    ]);


                }
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


            <View style={{ ...styles.cardContainer1 }}>

                <View style={{ ...styles.contentContainer, flexDirection: 'row', marginBottom: 5, marginTop: 5 }}>
                    <View style={{ flex: 1 }}>
                        <Text style={{ ...styles.planText }}>Name  </Text>
                        <Text style={{ ...styles.value, color: Colors.black }} >{item.username}</Text>
                    </View>
                    <View style={{ flex: 0.8, marginLeft: 10 }}>
                        <Text style={styles.planText}>Plane Name  </Text>
                        <Text style={{ ...styles.value, color: Colors.primary, fontFamily: 'AvenirNextCyr-Medium', textTransform: 'capitalize' }}>{item?.name}</Text>
                    </View>
                </View>
                <View style={{ ...styles.contentContainer, flexDirection: 'row', marginBottom: 5 }}>
                    <View style={{ flex: 1, }}>
                        <Text style={{ ...styles.planText }}>Created Date  </Text>
                        <Text style={styles.value} >{moment(data?.date_entered).format('DD-MM-YY')}</Text>
                    </View>
                    <View style={{ flex: 0.8, marginLeft: 10 }}>
                        <Text style={styles.planText}>No. of Dealers  </Text>
                        <Text style={styles.value}>#{data?.dealer_count}</Text>
                    </View>
                </View>
                <View style={{ ...styles.contentContainer, flexDirection: 'row', marginBottom: 5 }}>
                    <View style={{ flex: 1, }}>
                        <Text style={{ ...styles.planText }}>Region  </Text>
                        <Text style={styles.value} >{data?.region}</Text>
                    </View>
                    <View style={{ flex: 0.8, marginLeft: 10 }}>
                        <Text style={styles.planText}>Duration  </Text>
                        <Text style={styles.value}>{moment(data.start_date).format('DD-MM-YY')} To {moment(data.end_date).format('DD-MM-YY')}  </Text>
                    </View>
                </View>
            </View>

            <Text style={styles.planText1}>Customer List</Text>


            <View style={{ flex: 1 }}>
                <FlatList
                    data={Object.keys(dealerArray)}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <AccordionComponent day={getFullDayName(item)} data={dealerArray[item]} />
                    )}
                />
            </View>


            <View style={{ flex: 0.2, justifyContent: 'flex-end', marginBottom: 40 }}>
                <View style={{ flexDirection: 'row', marginTop: 10, gap: 10 }}>
                    <TouchableOpacity style={{ backgroundColor: 'tomato', borderRadius: 30, flex: 1, paddingVertical: 10 }} onPress={() => navigation.navigate('EditPlan', { id: item.id, po_ordousers_id_c: item.po_ordousers_id_c, manager: true })}>
                        <Text style={{ color: 'white', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium', textAlign: 'center' }}>Edit</Text>
                    </TouchableOpacity>
                    <LinearGradient
                        colors={['#011A90', '#851E71']}
                        start={Colors.start}end={Colors.end}
                        locations={Colors.location}
                        style={{ flex: 1, borderRadius: 30, }}
                    >
                        <TouchableOpacity style={{ borderRadius: 30, flex: 1, paddingVertical: 10 }} onPress={() => ApproveTourPlan()}>
                            <Text style={{ color: 'white', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium', textAlign: 'center' }}>Approve</Text>
                        </TouchableOpacity>
                    </LinearGradient>
                </View>
            </View>

        </View>

    )
}

export default SMTourPlanDetails

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
    planText1: {
        color: 'black',
        fontSize: 16,
        ////ontWeight: '600',
        fontFamily: 'AvenirNextCyr-Medium',
        marginLeft: 2,
        marginBottom: 5
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
        flex: 0.1
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

    },
    cardContainer: {
        backgroundColor: 'white',
        borderRadius: 10,
        // borderWidth: 1,
        // borderColor: Colors.primary, // You can replace this with the desired border color
        padding: 10,
        // marginVertical: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        flex: 0.4
    },

    cardContainer1: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 12,
        marginVertical: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,

    },
})