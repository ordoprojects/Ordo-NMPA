import React, { useState, useEffect, useContext, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, TouchableOpacity, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Colors from '../../constants/Colors';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { AuthContext } from '../../Context/AuthContext';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { DatePickerModal } from 'react-native-paper-dates';
import DateTags from './DateTags';
import moment from 'moment';



const ReviewPlan = ({ navigation, route }) => {




    const { chosenCustomers, screen, planId } = route?.params;
    console.log("screeen", screen)

    const [loading, setLoading] = useState(false);
    const { token, userData, planName, setPlanName, date, setDate, enddate, setEndDate } = useContext(AuthContext);

    const createPlan = async () => {
        setLoading(true);
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${userData.token}`);

        // console.log(userData.token)

        const formatDateString = (dateString) => {
            const date = new Date(dateString);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };


        const formatActivityDate = (dateString) => {
            const date = new Date(dateString);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}${month}${day}`;
        };

        const activity = chosenCustomers.reduce((acc, customer) => {
            customer.chosenDates.forEach(date => {
                const formattedDate = formatActivityDate(date);

                if (!acc[formattedDate]) {
                    acc[formattedDate] = [];
                }
                acc[formattedDate].push({ account_id: customer.account_id.toString(), status: "Pending", type: "Internal" });
            });
            return acc;
        }, {});


        var raw = JSON.stringify({
            name: planName,
            user: userData.id,
            // status: "Pending",
            start_date: formatDateString(date),
            end_date: formatDateString(enddate),
            remarks: "Testing",
            activity: [activity]
        });

        var requestOptions = {
            method: screen == "edit" ? "PUT" : "POST",
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        console.log("raw", raw)


        let alertMessage = screen == "edit" ? `Plan edited successfully` : `Plan created successfully`


        let url = screen == "edit" ? `https://gsidev.ordosolution.com/api/sales_tourplan/${planId}/` : `https://gsidev.ordosolution.com/api/sales_tourplan/`

        try {
            const response = await fetch(url, requestOptions);
            const result = await response.json();

            // console.log("result of create tour plan", result);

            if (response.status == 201 || response.status == 200) {
                Alert.alert(
                    "Success",
                    alertMessage,
                    [
                        {
                            text: "OK",
                            onPress: () => {
                                // assuming you're using a navigation library like react-navigation
                                navigation.pop(2);
                            }
                        }
                    ]
                );
            } else {
                console.log('Unexpected response status:', response.status);
            }
        } catch (error) {
            console.log('error in api sales_tourplan create', error);
        }
    };




    const renderItem = ({ item }) => {

        return (
            <TouchableOpacity
                style={styles.elementsView}
                activeOpacity={0.8}

            >
                <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                    <View disabled={item?.account_profile_pic ? true : false}>
                        {item.account_profile_pic ? (
                            <Image
                                source={{ uri: item.account_profile_pic }}
                                style={styles.avatar}
                            />
                        ) : (
                            <Image
                                source={require('../../assets/images/doctor.jpg')}
                                style={styles.avatar}
                            />
                        )}
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={{ color: Colors.primary, fontSize: 16, fontFamily: 'AvenirNextCyr-Bold', borderBottomColor: 'grey' }}>{item?.name}-{item?.account_id}</Text>
                        <Text style={{ color: 'black', fontSize: 14, fontFamily: 'AvenirNextCyr-Medium' }}>{item?.client_address}</Text>
                        <DateTags dates={item.chosenDates} />
                    </View>
                </View>
            </TouchableOpacity>
        );
    };





    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={styles.headercontainer}>
                <TouchableOpacity onPress={() => { navigation.goBack() }}>
                    <AntDesign name='arrowleft' size={25} color={Colors.black} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>
                    Review
                </Text>
                <View>
                </View>
            </View>




            <View style={{ margin: '4%', elevation: 8, backgroundColor: 'white', padding: '4%', gap: 15, }}>


                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>

                    <View style={{ flex: 1, alignItems: 'center' }}>
                        <Text style={{ ...styles.planText, color: 'black', fontFamily: 'AvenirNextCyr-Medium' }}>Plan Name </Text>
                        <Text style={{ ...styles.value, fontSize: 16, color: Colors.primary, fontFamily: 'AvenirNextCyr-Bold', textTransform: 'capitalize' }}>{planName}</Text>
                    </View>



                    <View style={{ flex: 1, alignItems: 'center' }}>
                        <Text style={{ ...styles.planText, color: 'black', fontFamily: 'AvenirNextCyr-Medium' }}>No. of customers</Text>
                        <Text style={{ ...styles.value, fontSize: 16, color: Colors.primary, fontFamily: 'AvenirNextCyr-Bold', textTransform: 'capitalize' }}>#{chosenCustomers.length}</Text>
                    </View>
                </View>


                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

                    <View style={{ flex: 1, alignItems: 'center' }}>
                        <Text style={{ ...styles.planText, color: 'black', fontFamily: 'AvenirNextCyr-Medium' }}>Start date </Text>
                        <Text style={{ ...styles.value, fontSize: 16, color: Colors.primary, fontFamily: 'AvenirNextCyr-Bold', textTransform: 'capitalize' }}>{moment(date).format('DD/MM/YYYY')} </Text>
                    </View>



                    <View style={{ flex: 1, alignItems: 'center' }}>
                        <Text style={{ ...styles.planText, color: 'black', fontFamily: 'AvenirNextCyr-Medium' }}>End date</Text>
                        <Text style={{ ...styles.value, fontSize: 16, color: Colors.primary, fontFamily: 'AvenirNextCyr-Bold', textTransform: 'capitalize' }}>{moment(enddate).format('DD/MM/YYYY')}</Text>
                    </View>
                </View>



                {/* <Text style={styles.value}>{moment(date).format('DD/MM/YYYY')}  - {moment(enddate).format('DD/MM/YYYY')}  </Text> */}

            </View>







            <View style={{ flex: 1 }}>

                <Text style={[styles.value, { marginHorizontal: '4%', fontSize: 16 }]}>Customers</Text>

                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={chosenCustomers}
                    keyboardShouldPersistTaps='handled'
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                />
            </View>

            <View style={{ justifyContent: 'flex-end' }}>
                <LinearGradient
                    colors={Colors.linearColors}
                    start={Colors.start}
                    end={Colors.end}
                    locations={Colors.ButtonsLocation}
                    style={{
                        paddingVertical: '3%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 8,
                        margin: '5%',
                        borderRadius: 8
                    }}
                >
                    <TouchableOpacity
                        style={styles.button}
                        onPress={createPlan}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.btnText}>
                            Create Plan
                        </Text>
                    </TouchableOpacity>
                </LinearGradient>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({




    headercontainer: {
        paddingHorizontal: 10,
        paddingVertical: 10,
        //backgroundColor:'red',
        flexDirection: 'row',
        alignItems: 'center',
        //backgroundColor:'red'
        justifyContent: 'space-between',
        // marginTop: 5,

    },
    headerTitle: {
        fontSize: 18,
        fontFamily: 'AvenirNextCyr-Medium',
        color: Colors.black,
        // marginLeft: 10,
        marginTop: 3
    },

    customerMainContainer: {
        // marginHorizontal: '5%',
        flex: 1
    },

    elementsView: {
        paddingVertical: 15,
        // paddingHorizontal: 10,
        borderBottomColor: 'grey',
        borderBottomWidth: 0.7,
        backgroundColor: "white",
        paddingHorizontal: '4%'
    },
    imageView: {
        width: 70,
        height: 70,

    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: 'gray',
    },
    avatar1: {
        width: 40,
        height: 40,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: 'gray',
    },

    button: {
        width: '100%',
        // paddingVertical: '3%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        // backgroundColor: Colors.primary,
        // margin: '5%',
        borderRadius: 30,
    },
    btnText: {
        fontFamily: 'AvenirNextCyr-Medium',
        color: '#fff',
        fontSize: 16
    },
    modalSearchContainer: {
        flex: 0.8,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'lightgray',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
        marginRight: 10
    },
    modalTitle: {
        fontSize: 17,
        color: 'black',
        fontFamily: 'AvenirNextCyr-Medium'
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 30,
        borderRadius: 8,
        width: '90%', // Adjust the width as needed, for example '90%'
        alignSelf: 'center', // Center the modal content horizontally
    },

    closeIcon: {
        position: 'absolute',
        top: 0,
        right: 5,
        padding: 10,
    },
    modalInnerContent: {
        marginTop: 8, // Add a margin to separate the icon from the modal content
    },
    ModalText1: {
        color: '#000000',
        textAlign: 'left',
        fontSize: 15,
        fontFamily: 'AvenirNextCyr-Medium',
        marginLeft: 1,

    },
    container1: {
        backgroundColor: 'white',
        paddingTop: 5,
        width: '100%', // Adjust the width as needed, for example '90%'
        alignSelf: 'center', // Center the container horizontally within the modal
    },

    dropdown: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
        width: '100%', // Set the desired width for the dropdown, for example '100%' to match the parent container
    },

    icon1: {
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
        fontSize: 16,
        fontFamily: 'AvenirNextCyr-Medium',

    },
    selectedTextStyle: {
        fontSize: 16,
        fontFamily: 'AvenirNextCyr-Medium',
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
        fontFamily: 'AvenirNextCyr-Medium',

    },
    submitButton: {
        backgroundColor: Colors.primary,
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
        marginTop: 8,
        marginLeft: 15,
        marginRight: 15,
    },
    submitButtonText: {
        color: 'grey',
        fontSize: 14,
        fontFamily: 'AvenirNextCyr-Medium'
    },
    filterButton: {
        flexDirection: 'column',
        alignItems: 'center',
        //marginTop:3
    },
    submitButton1: {
        // backgroundColor: Colors.primary,
        borderRadius: 8,
        // paddingVertical: 12,
        alignContent: 'center',
        marginBottom: '5%',
        marginLeft: 7,
        width: '90%'
    },
    ProductListContainer: {

        // flex: 1,
        // marginVertical: '4%',
    },
    noProductsContainer: {

        justifyContent: 'center',
        alignItems: 'center',
        // padding: 10,
    },
    noProductsText: {
        fontSize: 16,
        color: 'gray',
        fontFamily: 'AvenirNextCyr-Medium',
        textAlign: 'center',
        marginTop: 20,
    },
    elementsView1: {
        backgroundColor: "white",
        margin: 5,
        //borderColor: 'black',
        //flexDirection: 'row',
        //justifyContent: 'space-between',
        //alignItems: 'center',
        marginBottom: 10,
        // borderRadius: 8,
        // elevation: 5,
        // ...globalStyles.border,
        padding: 12,
        width: '95%',
        borderBottomColor: '#dfdfdf',
        borderBottomWidth: 1,

        //borderColor: '#fff',
        //borderWidth: 0.5
    },
    selectedStyle: {
        borderRadius: 20,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center'
    },
    selectedTextStyle: {
        fontSize: 14,
        color: 'white',
        fontFamily: 'AvenirNextCyr-Medium'
    },

    selectedCollaboratorsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },

    value: {
        fontFamily: 'AvenirNextCyr-Medium',
        color: 'black'

    }


});

export default ReviewPlan;