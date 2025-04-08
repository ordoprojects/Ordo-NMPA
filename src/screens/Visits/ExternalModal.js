import React, { useContext, useEffect, useState } from 'react'
import { Text, Modal, View, StyleSheet, Touchable, TouchableOpacity, FlatList, Image, Alert } from 'react-native'
import AntDesign from "react-native-vector-icons/AntDesign";
import globalStyles from '../../styles/globalStyles';
import { AuthContext } from '../../Context/AuthContext';
import Colors from '../../constants/Colors';
import LinearGradient from 'react-native-linear-gradient';
import { Modal as Modal1 } from 'react-native-paper';
import {
    Svg,
    Circle,
    LinearGradient as LinearGradient1,
    Stop,
} from "react-native-svg";




const ExternalModal = ({ visible, setExternalModal, todaysDealers, userCordinates, navigation }) => {
    const { token, userData, changeDealerData,
        changeDocId,
        changeTourPlanId, selectedItem } = useContext(AuthContext);
    // console.log("incoming data", userCordinates)
    const [loading, setLoading] = useState(false);
    const [checkinVisible, setCheckinVisible] = useState(false);
    const [selectedCustomers, setSelectedCustomers] = useState([]);


    const [allCustomers, setAllCustomers] = useState([]);
    const [excludedCustomers, setExcludedCustomers] = useState([]);



    const calculateHaversineDistance = (lat1, lon1, lat2, lon2) => {
        const radius = 6371000; // Radius of the Earth in meters

        const radiansLat1 = (lat1 * Math.PI) / 180;
        const radiansLat2 = (lat2 * Math.PI) / 180;
        const latDifference = radiansLat2 - radiansLat1;
        const lonDifference = ((lon2 - lon1) * Math.PI) / 180;

        const a = Math.sin(latDifference / 2) ** 2 + Math.cos(radiansLat1) * Math.cos(radiansLat2) * Math.sin(lonDifference / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        const distance = radius * c;
        return distance;
    };


    const checkDistance = (item) => {
        const distance = calculateHaversineDistance(parseFloat(item.latitude), parseFloat(item.longitude), parseFloat(userCordinates[1]), parseFloat(userCordinates[0]));

        console.log("distamce", distance)
        if (distance > 20) {
            // Show alert
            Alert.alert(
                'Location Mismatch',
                'You are more than 20 meters away from the customer. Are you sure you want to continue?',
                [
                    {
                        text: 'Cancel',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                    },
                    {
                        text: 'Proceed',
                        onPress: () => {
                            const updatedItem = { ...item, checkinLoc: "Remote" };
                            setSelectedCustomers(updatedItem);
                            setCheckinVisible(true);
                        }
                    },
                ],
                { cancelable: false }
            );
            return;
        }
        const updatedItem = { ...item, checkinLoc: "Premise" };
        setSelectedCustomers(updatedItem);
        setCheckinVisible(true);
    }


    useEffect(() => {
        if (visible) {
            getActiveDealerList();
        }
    }, [visible])

    const getActiveDealerList = async () => {
        setLoading(true);
        console.log("called");
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${userData.token}`);

        var requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow",
        };

        try {
            const response = await fetch("https://gsidev.ordosolution.com/api/assigned-customers/", requestOptions);
            const result = await response.json();
            // console.log("esult", result)
            // Extract account_ids of todaysDealers
            const todaysDealersIds = todaysDealers.map(dealer => dealer.account_id.toString());
            // Filter out customers already in todaysDealers
            const filteredCustomers = result.filter(customer => !todaysDealersIds.includes(customer.account_id.toString()));
            // Set the filtered list to excludedCustomers
            setExcludedCustomers(filteredCustomers);
            setAllCustomers(result);
        } catch (error) {
            console.log("error", error);
        } finally {
            setLoading(false);
        }
    };


    const MakeExternalVisit = async (selectedCustomer) => {


        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const formattedDate = `${year}${month}${day}`;
        const checkInDate = today.toISOString().split('T')[0];


        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${userData.token}`);

        var raw = JSON.stringify({
            [formattedDate]: {
                account_id: selectedCustomer.id,
                status: "Pending",
                type: "External",
            },
            plan_id: selectedItem?.id,
            ordo_user: userData?.id,
            check_in: checkInDate,
            checkin_location: selectedCustomer.checkinLoc
        });

        var requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
        };

        console.log("checkin raw", raw);

        await fetch("https://gsidev.ordosolution.com/api/sales_external_checkin/", requestOptions)
            .then((response) => response.json())
            .then((result) => {
                console.log("testttt", result);
                // Uncomment and adapt the following lines if needed
                changeTourPlanId(selectedItem?.id);
                changeDealerData(selectedCustomer);
                changeDocId(result.data[0].sales_checkin_id);
                setCheckinVisible(false);
                setExternalModal(false);
                navigation.navigate("CheckOut", {
                    tour_plan_id: selectedItem?.id,
                    backIcon: true,
                    external: true,
                    checkin_id: result.data[0].sales_checkin_id,
                    dealerInfo: selectedCustomer,
                });
            })
            .catch((error) => {
                console.log("external check in api error", error);
            });
    }

    const renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity
                style={styles.elementsView}
                activeOpacity={0.8}
                // onPress={() => { navigation.navigate('CustomerDetail', { item: item }) }}
                onPress={() => {
                    checkDistance(item);
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <View>
                        <Image
                            source={{
                                uri: item.profile_picture,
                            }}
                            style={{ ...styles.avatar }}
                        />
                    </View>
                    <View
                        style={{
                            flex: 1,
                            marginLeft: '3%',
                        }}
                    >
                        <Text
                            style={{
                                color: Colors.primary,
                                fontSize: 13,
                                fontFamily: "AvenirNextCyr-Bold",
                                borderBottomColor: "grey",
                            }}
                        >
                            {item.name}
                        </Text>
                        {/* </View> */}
                        <Text
                            style={{
                                color: "black",
                                fontSize: 12,
                                fontFamily: "AvenirNextCyr-Medium",
                            }}
                        >
                            {item.state}
                        </Text>
                        <Text
                            style={{
                                color: "black",
                                fontSize: 12,
                                fontFamily: "AvenirNextCyr-Medium",
                            }}
                        >
                            {item.region} - {item.postal_code}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (

        <View >
            <Modal
                visible={visible}
                animationType="fade"
                transparent={true}
            >
                {/* Modal content */}
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                    }}
                >
                    <View
                        style={{

                            backgroundColor: "white",
                            borderRadius: 10,
                            elevation: 5,
                            flex: 1,
                            width: '100%',
                        }}
                    >

                        <View style={styles.headerContainer}>
                            <Text>{" "}</Text>
                            <Text style={styles.text}>External Visit</Text>

                            <TouchableOpacity onPress={() => { setExternalModal(false) }}>
                                <AntDesign name="close" size={20} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.customerMainContainer}>
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                data={excludedCustomers}
                                keyboardShouldPersistTaps="handled"
                                renderItem={renderItem}
                                keyExtractor={(item) => item.id.toString()}
                            />
                        </View>


                    </View>
                </View>
            </Modal>






            < Modal
                visible={checkinVisible}
                animationType="fade"
                transparent={true}
            >
                {/* Modal content */}
                < View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                    }}
                >
                    <View
                        style={{
                            backgroundColor: "white",
                            padding: 20,
                            width: "90%",
                            marginHorizontal: 10,
                            borderRadius: 10,
                            elevation: 5,
                            alignItems: 'center'
                            // height: "40%",
                        }}
                    >
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                marginBottom: 10,
                            }}
                        >
                            <View
                                style={{
                                    alignContent: "center",
                                    flex: 1,
                                    justifyContent: "center",
                                    flexDirection: "row",
                                    // marginLeft: 15,
                                }}
                            >
                                <Text
                                    style={{
                                        color: "black",
                                        fontFamily: "AvenirNextCyr-Bold",
                                        fontSize: 17,

                                    }}
                                >
                                    External Visit
                                </Text>


                            </View>
                            <TouchableOpacity onPress={() => setCheckinVisible(false)}>
                                <AntDesign name="close" size={20} color={`black`} />
                            </TouchableOpacity>
                        </View>

                        <View>
                            <Svg height="80" width="80" style={styles.progress}>
                                {/* Circular progress */}
                                <Circle
                                    cx="50%"
                                    cy="50%"
                                    r="43%"
                                    stroke={Colors.primary}
                                    strokeWidth="6"
                                    fill="transparent"
                                />

                            </Svg>
                            {selectedCustomers?.profile_picture ? (
                                <Image
                                    source={{ uri: selectedCustomers.profile_picture }}
                                    style={{ ...styles.avatar1 }}
                                />
                            ) : (
                                <Image
                                    source={require("../../assets/images/doctor.jpg")}
                                    style={{ ...styles.avatar1 }}
                                />
                            )}
                        </View>

                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "center",
                                marginVertical: 15,
                            }}
                        >



                            <View
                                style={{
                                    marginLeft: 10,
                                    flex: 1,
                                    justifyContent: "center",
                                }}
                            >
                                <Text
                                    style={{
                                        color: "black",
                                        fontSize: 15,
                                        marginTop: "4%",
                                        textAlign: "center",
                                        fontFamily: "AvenirNextCyr-Bold",
                                    }}
                                >
                                    {selectedCustomers?.name}
                                </Text>
                                <Text
                                    style={{
                                        color: "black",
                                        fontSize: 13,
                                        marginTop: "2%",
                                        textAlign: "center",
                                        fontFamily: "AvenirNextCyr-Medium",
                                    }}
                                >
                                    {selectedCustomers?.client_address}
                                </Text>
                                <Text
                                    style={{
                                        color: "black",
                                        fontSize: 13,
                                        marginTop: "1%",
                                        textAlign: "center",
                                        fontFamily: "AvenirNextCyr-Medium",
                                    }}
                                >
                                    {selectedCustomers?.postal_code}
                                </Text>
                            </View>
                        </View>


                        <LinearGradient
                            colors={Colors.linearColors}
                            start={Colors.start}
                            end={Colors.end}
                            locations={Colors.ButtonsLocation}
                            style={{
                                height: 40,
                                backgroundColor: "#011A90",
                                marginHorizontal: "15%",
                                borderRadius: 20,
                                alignItems: "center",
                                justifyContent: "center",
                                elevation: 5,
                                ...globalStyles.border,
                                marginTop: 10,
                            }}
                        >
                            <TouchableOpacity
                                style={{
                                    flexDirection: "row",
                                    width: "100%",
                                    justifyContent: "space-around",
                                }}
                                onPress={() => MakeExternalVisit(selectedCustomers)}
                            >
                                <View></View>
                                <Text
                                    style={{
                                        color: "white",
                                        justifyContent: "center",
                                        fontFamily: "AvenirNextCyr-Bold",
                                        fontSize: 14,
                                        paddingLeft: "10%",
                                    }}
                                >
                                    Check-In
                                </Text>
                                <AntDesign
                                    name="arrowright"
                                    style={{ paddingLeft: "10%" }}
                                    color={`white`}
                                    size={20}
                                />
                            </TouchableOpacity>
                        </LinearGradient>

                    </View>
                </View >
            </Modal >
        </View>

    )
}

export default ExternalModal

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '4%'

    },

    text: {
        fontFamily: 'AvenirNextCyr-Bold',
        fontSize: 17
    },

    customerMainContainer: {
        flex: 1,

    },
    elementsView: {
        paddingVertical: 15,
        // backgroundColor: "rgba(158, 78, 126, 0.61)",
        backgroundColor: "white",
        marginVertical: "2%",
        marginHorizontal: '3%',
        ...globalStyles.border,
        borderRadius: 20,
        paddingHorizontal: "1%",
        elevation: 8
    },
    imageView: {
        width: 70,
        height: 70,
        resizeMode: 'contain'
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 50,
        borderWidth: 0.5,
        borderColor: "gray",
        marginLeft: '7%',
        resizeMode: 'contain'


    },



    avatar1: {
        width: 60,
        height: 60,
        borderRadius: 50,
        borderWidth: 0.5,
        borderColor: "white",
        resizeMode: "contain",
        position: 'absolute',
        top: 10,
        left: 10
    },
})





