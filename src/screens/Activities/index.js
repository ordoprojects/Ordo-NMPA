import { StyleSheet, Text, View, TouchableOpacity, FlatList, Pressable, Modal } from 'react-native'
import React, { useEffect, useState } from 'react'
import Colors from '../../constants/Colors'
import Icon from 'react-native-vector-icons/FontAwesome';
import { Image } from 'react-native';
import globalStyles from '../../styles/globalStyles';
import DatePicker from 'react-native-date-picker'
import is from 'date-fns/esm/locale/is/index.js';
import AntDesign from 'react-native-vector-icons/AntDesign'
import { BASE_SERVER_URL } from '../../utils/Helper';


const Activities = ({ navigation, route }) => {
    const { userId, userName } = route.params;
    const [activities, setActivities] = useState([]);
    const [date, setDate] = useState(new Date())
    // const [selectedDate, setSelectedDate] = useState(new Date())
    const [isDatePickerVisible, setDatePickerVisible] = useState(false);
    // console.log("userID", userId);

    const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });


    useEffect(() => {
        loadActivities();
    }, [date,userId]);

    const InputWithLabel = ({ title, value, onPress }) => {
        return (
            <View>
                <Pressable style={{ ...styles.inputContainer }} onPress={onPress} >
                    <Image style={{ width: 20, height: 20, marginLeft: 10 }} source={require("../../assets/images/calendar.png")}></Image>
                    <Text style={styles.input2}>{value ? value.toLocaleDateString() : 'Select date'}</Text>

                </Pressable>
            </View>
        );
    }


    const loadActivities = () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        var raw = JSON.stringify({
            "__users_array__": [
                userId,
            ],
            // "__date__": date,
            "__date__": formattedDate,
        });
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
        // fetch("https://gsi.ordosolution.com/get_activities.php", requestOptions)
        fetch(`https://dev.ordo.primesophic.com/get_activities.php`, requestOptions)
            .then(response => response.json())
            .then(result => {

                // Extract and format the time from the "date_entered" field
                const formattedActivities = result.activities_array.map(item => {
                    const dateEntered = new Date(item.date_entered);
                    const time = dateEntered.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    return { ...item, time };
                });
                // Sort the activities by time in descending order
                formattedActivities.sort((a, b) => new Date(b.date_entered) - new Date(a.date_entered));
                // console.log("formated actiiitit",formattedActivities)
                setActivities(formattedActivities);
            })
            .catch(error => console.log('error', error));
    };

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ marginTop: 12, marginLeft: 5, flexDirection:'row' }}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <AntDesign name='arrowleft' size={25} color={Colors.black} />
                    </TouchableOpacity>
                    <Text style={{ fontFamily: 'AvenirNextCyr-Medium', fontSize: 18,marginLeft:8 }}>Sales Activities</Text>
                </View>
                <View style={{ marginTop: 12, marginLeft: 5 }}>
                    <InputWithLabel
                        value={date}
                        onPress={() => {
                            setDatePickerVisible(true);
                        }}

                    />
                </View>
            </View>
            <View style={{ marginVertical: '5%' }}>
             <Text style={{textAlign:'center', fontFamily:'AvenirNextCyr-Medium', fontSize:18, color:Colors.primary}}>{userName}</Text>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={activities}
                    keyboardShouldPersistTaps='handled'
                    renderItem={({ item }) => (
                        <Pressable
                            style={styles.elementsView}
                            onPress={() => {
                                // Navigate to the ActivityDetails screen with the selected activity
                                navigation.navigate('ActivityDetails', { activity: item });
                            }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ backgroundColor: Colors.primary, alignItems: 'center', paddingVertical: '2%', width: 80, borderRadius: 8 }}>
                                    <Text style={{
                                        color: 'white',
                                        fontSize: 12,
                                        fontFamily: 'AvenirNextCyr-Thin',
                                    }}>{item.time}</Text>
                                </View>
                                <View style={{
                                    flex: 1,
                                    borderLeftWidth: 1.5,
                                    paddingLeft: 15,
                                    marginLeft: 10,
                                    borderStyle: 'dotted',
                                    borderColor: 'grey',
                                }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text style={{
                                            color: 'grey',
                                            fontSize: 12,
                                            fontFamily: 'AvenirNextCyr-Thin',
                                            borderBottomColor: 'grey',
                                            borderBottomWidth: 0.5,
                                        }}>{item.module}</Text>
                                    </View>
                                    <Text style={{
                                        color: Colors.primary,
                                        fontSize: 12,
                                        fontFamily: 'AvenirNextCyr-Medium',
                                        marginTop: 5,
                                    }}>{item.account_name}</Text>
                                    {/* <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Thin' }}>Test</Text> */}
                                </View>
                            </View>
                        </Pressable>
                    )}
                    keyExtractor={(item) => item.id.toString()}
                    ListEmptyComponent={() => (
                        <View style={styles.noProductsContainer}>
                            <Text style={styles.noProductsText}>No Data for this day</Text>
                        </View>
                    )}
                />

            </View>
            {isDatePickerVisible == true ?
                <DatePicker
                    modal
                    theme='light'
                    mode={'date'}
                    open={isDatePickerVisible}
                    date={date}
                    format="DD-MM-YYYY"
                    // minDate="2022-01-01"
                    maximumDate={new Date()}
                    onConfirm={(date) => {
                        const dateString = date.toLocaleDateString();
                        // console.log("date string",dateString);
                        setDatePickerVisible(false)
                        setDate(date)
                    }}
                    onCancel={() => {
                        setDatePickerVisible(false)
                    }}
                /> : null}

        </View>
    );
};

export default Activities

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        flex: 1,
        backgroundColor: Colors.white
    },
    noProductsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    noProductsText: {
        fontSize: 16,
        color: 'gray',
        fontFamily: 'AvenirNextCyr-Thin',
        textAlign: 'center',
        marginTop: 80,
    },
    elementsView: {
        backgroundColor: "white",
        margin: 5,
        //borderColor: 'black',
        //flexDirection: 'row',
        //justifyContent: 'space-between',
        //alignItems: 'center',
        marginBottom: 16,
        borderRadius: 8,
        elevation: 5,
        ...globalStyles.border,
        padding: 16
        //borderColor: '#fff',
        //borderWidth: 0.5
    },
    imageView: {
        width: 80,
        height: 80,
        // borderRadius: 40,
        // marginTop: 20,
        // marginBottom: 10
    },
    input2: {
        fontFamily: 'AvenirNextCyr-Thin',
        padding: 8,

    },

    inputContainer: {
        borderColor: 'grey',
        color: 'black',
        borderWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },


})