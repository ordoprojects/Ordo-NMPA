import React, { useEffect, useRef, useState, useContext } from "react";
import { View, Text, StyleSheet, Modal, TouchableOpacity, Image, Alert, ScrollView, Dimensions, FlatList, PermissionsAndroid, ActivityIndicator, Platform } from 'react-native';
import MapboxGL, { Logger } from '@rnmapbox/maps';
import { lineString as makeLineString } from '@turf/helpers';
import Geolocation from 'react-native-geolocation-service';
const accessToken = 'sk.eyJ1IjoibmlzaGFudGh1amlyZSIsImEiOiJjbGliY3dxN2MwOG9qM2N1azg2dTBsMHQ1In0.ROqFtNqa1Qecr4ZpmT0b2Q';
import { AuthContext } from '../../Context/AuthContext';
MapboxGL.setWellKnownTileServer('Mapbox');
MapboxGL.setAccessToken(accessToken);
// MapboxGL.setConnected(true);
MapboxGL.setTelemetryEnabled(false);
Geolocation.setRNConfiguration({
    skipPermissionRequests: false,
    authorizationLevel: 'auto',
});
import moment, { updateLocale } from "moment";
import { useFocusEffect } from "@react-navigation/native";
import Colors from "../../constants/Colors";
import { Callout } from '@rnmapbox/maps';
import AntDesign from 'react-native-vector-icons/AntDesign'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { locationPermission } from '../../utils/Helper';
import ActionButton from 'react-native-action-button';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Searchbar, RadioButton, Checkbox } from "react-native-paper";
import LinearGradient from 'react-native-linear-gradient';
import { SegmentedButtons } from 'react-native-paper';
Logger.setLogCallback(log => {
    const { message } = log;

    if (
        message.match('Request failed due to a permanent error: Canceled') ||
        message.match('Request failed due to a permanent error: Socket Closed')
    ) {
        return true;
    }
    return false;
});



const Map = ({ navigation, route }) => {

    const { tour_plan_id, planName, existingCustomers } = route.params;
    const [routeDirections, setRouteDirections] = useState(null);
    const dealerArray = useRef([]);
    const [loading, setLoading] = useState(false);
    const [customerArray, setCustomerArray] = useState([]);
    const [deviatedDealers, setDeviatedDealers] = useState([]);
    const [selectedCustomer, setSelectedCustomers] = useState([]);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [masterData, setMasterData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [value, setValue] = React.useState('customer');
    const [selectedRouteProfile, setselectedRouteProfile] = useState('walking');
    const [optimizedPaths, setoptimizedPaths] = useState([])


    const [userCordinates, setUserCordinates] = useState(null);
    const [isModalVisible, setModalVisible] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [nearByDealer, setNearByDealer] = useState('');
    const [DeviateModalVisible, setDeviateModalVisible] = useState(false)
    const [coords, setCoords] = useState([]);
    const [allCustomers, setAllCustomers] = useState([]);

    const { token, changeDocId, changeDealerData, dealerData, userData } = useContext(AuthContext);
    const activeDealer = useRef([])
    const [visitDateKey, setVisitDateKey] = useState('');
    const [expanded, setExpanded] = useState(false);
    const [expanded1, setExpanded1] = useState(false);

    const [destinationCoords, setDestinationCoords] = useState([
        [74.84101, 12.88641], // Dummy Location 1
        [74.84644, 12.88455], // Dummy Location 2
        [74.83484, 12.89132], // Dummy Location 3
    ]);



    useFocusEffect(
        React.useCallback(() => {
            getLocation();
        }, [])
    );



    useFocusEffect(
        React.useCallback(() => {
            getActiveDealer();
        }, [])
    );


    //optimized-trip API
    useFocusEffect(
        React.useCallback(() => {
            const fetchData = async () => {
                if (userCordinates && value === "map") {

                    if (optimizedPaths) {
                        const userCoordinatesObject = {
                            latitude: userCordinates[1],
                            longitude: userCordinates[0],
                        };


                        const validCustomerArray = optimizedPaths.filter(account => account.latitude !== null && account.longitude !== null);

                        const modifiedTodaysAccountsArray = [
                            userCoordinatesObject,
                            ...validCustomerArray.map(account => ({
                                id: account.id,
                                name: account.name,
                                latitude: account.latitude,
                                longitude: account.longitude,
                                account_profile_pic: account.account_profile_pic,
                                status: "Pending"
                            })),


                        ];

                        const modifiedTodaysAccountsArrayWithoutLast = modifiedTodaysAccountsArray.slice(0, -1);
                        const trimmedArray = modifiedTodaysAccountsArrayWithoutLast.slice(0, 9);
                        const coordinates = trimmedArray.map(coord => `${coord.longitude},${coord.latitude}`).join(';');
                        const geometries = 'geojson';

                        const url = `https://api.mapbox.com/optimized-trips/v1/mapbox/${selectedRouteProfile}/${coordinates}?geometries=${geometries}&source=first&destination=last&roundtrip=false&access_token=${accessToken}`;

                        try {
                            let response = await fetch(url);
                            let json = await response.json();

                            const data = json.trips[0];

                            setRouteDirections(makeRouterFeature(data.geometry.coordinates));
                        } catch (e) {
                            console.error(e);
                        }

                        setAllCustomers(modifiedTodaysAccountsArray);
                    }
                }
            };

            fetchData(); // Call the async function immediately

            // No need to return anything from the callback
        }, [userCordinates, optimizedPaths, accessToken, value])
    );


    const handleSelectAll = () => {
        if (isAllCustomersSelected()) {
            setSelectedCustomers([]);
            setSelectAll(false);
        } else {
            const selectedCustomersDetails = masterData.map((item) => ({
                id: item.id,
                name: item.name,
                weeklyVisit: item.weeklyVisit,
                monthlyVisit: item.monthlyVisit,
            }));
            setSelectedCustomers(selectedCustomersDetails);
            setSelectAll(true);
        }
    };

    const isAllCustomersSelected = () => {
        return selectedCustomer.length === masterData.length;
    }


    const handleCheckboxChange = (item) => {
        if (selectedCustomer.find((customer) => customer.id === item.id)) {
            // Remove the customer from selectedCustomer
            setSelectedCustomers((prevSelectedCustomers) =>
                prevSelectedCustomers.filter((customer) => customer.id !== item.id)
            );
        } else {
            // Add the customer to selectedCustomer
            setSelectedCustomers((prevSelectedCustomers) => [
                ...prevSelectedCustomers,
                {
                    name: item.name,
                    id: item.id,
                    weeklyVisit: item.weeklyVisit,
                    monthlyVisit: item.monthlyVisit,
                },
            ]);
        }

    };


    const searchProduct = (text) => {
        // Check if searched text is not blank
        if (text) {
            // Inserted text is not blank
            // Filter the masterDataSource
            // Update FilteredDataSource
            const newData = masterData.filter(
                function (item) {
                    const itemData = item.name
                        ? item.name.toUpperCase()
                        : ''.toUpperCase();
                    const textData = text.toUpperCase();

                    const regionData = item.region
                        ? item.region.toUpperCase()
                        : ''.toUpperCase();
                    const regionText = text.toUpperCase();

                    return (
                        itemData.indexOf(textData) > -1 ||
                        regionData.indexOf(regionText) > -1
                    );
                }
            );
            setFilteredData(newData);
            setSearchQuery(text);
        } else {

            setFilteredData(masterData);
            setSearchQuery(text);
        }
    };


    const UpdateLocation = async (item) => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify(
            {
                "__type__": "0",
                "__longitude__": userCordinates[0],
                "__latitude__": userCordinates[1],
                "__account_id__": item.id,
            }
        )

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        await fetch("https://gsidev.ordosolution.com/set_account_details.php", requestOptions)
            .then(response => response.json())
            .then(async result => {


            })
            .catch(error => console.log('error updating location', error));
    }


    useEffect(() => {
        getDeviatedDealers();
    }, [])


    const getTodayPlan = async () => {
        setLoading(true);
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "text/plain");
        myHeaders.append("Authorization", `Bearer ${userData.token}`);




        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        try {
            const response = await fetch(`https://gsidev.ordosolution.com/api/today-visit/${tour_plan_id}/`, requestOptions);
            const result = await response.json();

            setCustomerArray(result)
            // setMasterData(result);
            // setFilteredData(result);

        } catch (error) {
            console.log('get today plan API error', error);
        }

        setLoading(false);
    };





    const toggleExpansion = () => {
        setExpanded(!expanded);
    };

    const toggleExpansion1 = () => {
        setExpanded1(!expanded1);
    };


    const dealerCords = useRef([]);




    const getDeviatedDealers = async () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "text/plain");

        var raw = JSON.stringify(
            {
                "__tourplan_id__": tour_plan_id
            }
        )



        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("https://gsidev.ordosolution.com/get_approved_deviations.php", requestOptions)
            .then(response => response.json())
            .then(async result => {
                setDeviatedDealers(result);

                // activeDealer.current = result;

            })
            .catch(error => console.log('get active dealer api error', error));
    }

    const getActiveDealer = async () => {


        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "text/plain");

        var raw = JSON.stringify(
            {
                "__user_id__": token
            }
        )

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("https://gsidev.ordosolution.com/get_accounts_for_dealer.php", requestOptions)
            .then(response => response.json())
            .then(async result => {
                activeDealer.current = result;
            })
            .catch(error => console.log('get active dealer api error', error));
    }

    useFocusEffect(
        React.useCallback(() => {
            getTodayPlan();
        }, [userCordinates])
    );




    const getLocation = async () => {

        let status = await locationPermission();

        if (status === 'granted') {
            Geolocation.getCurrentPosition(
                (res) => {
                    setUserCordinates([res.coords.longitude, res.coords.latitude]);

                },
                (error) => {
                    console.log("get location error", error);
                    console.log("please enable location ")
                    // setLocationEnabled(false);
                },
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }

            );

        }


    }



    const checkCustomerLocation = (item) => {
        if (item.latitude === null || item.longitude === null) {
            // Show alert and ask for user confirmation
            Alert.alert(
                `Location not available for ${item.name}`,
                `Do you want to set ${item.name}'s location as your current location?`,
                [
                    {
                        text: 'Cancel',
                        style: 'cancel',
                    },
                    {
                        text: 'OK',
                        onPress: () => {
                            UpdateLocation(item)
                            manualCheckIn(item);
                        },
                    },
                ]
            );
        }
        else {
            manualCheckIn(item);
        }
    }

    const loc1 = [74.84101, 12.88641] // bharat mall
    const loc2 = [74.84644, 12.88455]  //bejai ch hll
    const loc3 = [74.83484, 12.89132]  //lady hill


    const manualCheckIn = (item) => {

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${userData.token}`);



        var raw = JSON.stringify({
            "plan_id": tour_plan_id,
            "ordo_user": userData.id,
            "account": item?.account_id,
            "check_in": moment(new Date()).format('YYYY-MM-DD'),
            "type": "Internal"
        });



        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };



        fetch("https://gsidev.ordosolution.com/api/checkin/", requestOptions)
            .then(response => response.json())
            .then(result => {

                changeDealerData(item);
                changeDocId(result.data[0].checkin_id);
                navigation.navigate('CheckOut', { tour_plan_id: tour_plan_id, backIcon: true, external: item.d_id ? true : false, deviatedPlanId: item.d_id, checkin_id: result.data[0].checkin_id, visit_id: item.id })
            })
            .catch(error => {
                console.log('manual check in api error', error);
            });


    }

    const splitLongText = (text) => {
        const maxLengthPerLine = 20; // Adjust this value as needed

        if (text.length <= maxLengthPerLine) {
            return text;
        }

        let splitText = '';
        for (let i = 0; i < text.length; i += maxLengthPerLine) {
            splitText += text.substr(i, maxLengthPerLine) + '\n';
        }

        return splitText;
    };


    const requestApprovalPressed = () => {

        if (planName && selectedCustomer.length > 0) {
            let dealerArray = []
            selectedCustomer.forEach((item) => {
                //push only if no of visit count > 0

                dealerArray.push({
                    __account_id__: item?.id,
                    // __no_of_visit__: type === 'Weekly' ? item?.weeklyVisit : item?.monthlyVisit

                })

              
            })



            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "text/plain");



            var raw = JSON.stringify({
                // "__name__": planName,
                // "__start_date__": moment(startDate).format('YYYY-MM-DD'),
                // "__end_date__": moment(endDate).format('YYYY-MM-DD'),
                // "__user_id__": token,
                // "__dealer_array__": dealerArray,
                // "__type__": type

                "__name__": planName,
                "__user_id__": token,
                "__dealer_array__": dealerArray,
                "__tourplan_id__": tour_plan_id
            });




            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            fetch("https://gsidev.ordosolution.com/set_deviate_plan.php", requestOptions)
                .then(response => response.json())
                .then(result => {
                    if (result.status == '203') {
                        Alert.alert('Warning', 'Plan name already exists', [
                            { text: 'OK', onPress: () => { } }

                        ])
                    }
                    else {
                        Alert.alert('Deviate Plan', 'Customer added successfully', [
                            {
                                text: 'OK', onPress: () => {
                                    setDeviateModalVisible(false)
                                    getDeviatedDealers()
                                }
                            }
                        ])
                    }
                })
                .catch(error => console.log('error', error));
        }
        else {
            Alert.alert('Warning', 'Please select one or more customers')
        }

    }



    const renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity style={styles.elementsView} activeOpacity={0.8} onPress={() => {

                handleCheckboxChange(item)

            }
            }
            >
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <TouchableOpacity
                        disabled={item?.account_profile_pic ? true : false}
                        onPress={() => handleImagePress(item.id)}>
                        <Image
                            //source={require('../../assets/images/account.png')}
                            source={{ uri: item?.account_profile_pic }}
                            style={{ ...styles.avatar }}
                        />
                    </TouchableOpacity>
                    <View style={{
                        flex: 1,
                        marginLeft: 8,
                        // borderLeftWidth: 1.5,
                        paddingLeft: 10,
                        marginLeft: 20,
                        // borderStyle: 'dotted',
                        // borderColor: 'grey',
                        justifyContent: 'space-around'
                    }}>
                        {/* <View style={{ flexDirection: 'row' }}> */}
                        <Text style={{ color: Colors.primary, fontSize: 12, fontFamily: 'AvenirNextCyr-Medium', borderBottomColor: 'grey' }}>{item?.name}</Text>
                        {/* </View> */}
                        <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Thin' }}>{item?.industry}</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Thin' }}>{item?.account_type}</Text>


                            <Checkbox.Android
                                color={Colors.primary}
                                status={
                                    selectedCustomer.some((customer) => customer.id === item.id) ? 'checked' : 'unchecked'
                                }
                            />

                        </View>


                        {/* <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Thin' }}>{item?.street} {item?.city} {item?.shipping_address_state}</Text> */}
                        {/* <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Thin' }}>{item?.country} - {item?.postal_code}</Text> */}
                    </View>
                </View>
                {/* <Text style={{ fontSize: 12, color: 'black', fontFamily: 'AvenirNextCyr-Thin', marginTop: 5, paddingLeft: 16 }}>{item?.storeid_c}</Text> */}

            </TouchableOpacity>
        )

    }



    function makeRouterFeature(coordinates) {
        let routerFeature = {
            type: 'FeatureCollection',
            features: [
                {
                    type: 'Feature',
                    properties: {},
                    geometry: {
                        type: 'LineString',
                        coordinates: coordinates,
                    },
                },
            ],
        };
        return routerFeature;
    }








    return (
        <View style={{ flex: 1 }}>
            {/* <View style={{ flex: 0.4 }}> */}


            <View style={{ flexDirection: 'row', backgroundColor: '#fff', justifyContent: 'space-between', alignItems: 'center' }}>
                <TouchableOpacity style={{ marginLeft: 5 }} onPress={() => navigation.goBack()}>
                    <AntDesign name='arrowleft' size={25} color={Colors.black} />
                </TouchableOpacity>

                <View style={{ marginLeft: 5, padding: 10 }}>
                    <Text style={styles.modalTitle}>Customer List</Text>
                </View>
                <View>
                    <Text>     </Text>
                </View>
            </View>


            <View style={{ flex: 1 }}>
                <View style={{ paddingBottom: 10, paddingHorizontal: '10%' }}>
                    <SegmentedButtons
                        value={value}
                        onValueChange={setValue}
                        buttons={[

                            {
                                value: 'customer',
                                label: 'Customer View',
                                labelStyle: { color: value === 'customer' ? 'white' : Colors.primary },
                                style: {
                                    backgroundColor: value === 'customer' ? Colors.primary : 'white',
                                    borderColor: Colors.primary,
                                    marginTop: 10

                                },
                            },
                            {
                                value: 'map',
                                label: 'Map View',
                                labelStyle: { color: value === 'map' ? 'white' : Colors.primary },
                                style: {
                                    backgroundColor: value === 'map' ? Colors.primary : 'white',
                                    borderColor: Colors.primary,
                                    marginTop: 10

                                },
                            },

                        ]}
                    />
                </View>
                {value === 'customer' ? (
                    <View style={{ flex: 1 }} >
                        {/* <ScrollView > */}

                        <View style={{ flex: 1, paddingHorizontal: 10, marginTop: '2%' }}>
                            <View style={styles.cardContainer}>
                                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                    <Text style={{ ...styles.modalTitle, color: Colors.primary }}>Planned Customer Visit</Text>
                                    {/* <FontAwesome name='angle-down' size={20} color={`black`} /> */}
                                </View>


                                <FlatList
                                    data={customerArray}
                                    renderItem={({ item, index }) => (

                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, justifyContent: 'space-between', marginRight: 10, borderBottomColor: 'grey', borderBottomWidth: 0.7, paddingVertical: 15 }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                                                <Image style={{ height: 20, width: 20, resizeMode: 'contain', marginRight: 10, marginTop: 2 }} source={{ uri: item?.account_profile_pic }} />
                                                <View>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                        <Text style={{ fontSize: 14, color: 'black', fontFamily: 'AvenirNextCyr-Medium' }} numberOfLines={2}> {(item.name)}</Text>
                                                    </View>
                                                    <Text style={{ marginLeft: 5, fontSize: 14, fontFamily: 'AvenirNextCyr-Thin', color: item.status == 'Completed' ? 'green' : 'red' }}>{item.status}</Text>

                                                </View>
                                            </View>


                                            <View>
                                                {item.status == 'Pending' && <TouchableOpacity
                                                    onPress={() => manualCheckIn(item)}
                                                >
                                                    <Text style={{ marginLeft: 10, fontSize: 14, fontFamily: 'AvenirNextCyr-Medium', color: Colors.primary }}>Check-in</Text>
                                                </TouchableOpacity>}
                                            </View>
                                        </View>
                                    )}


                                    ListEmptyComponent={() => (
                                        <View style={styles.noProductsContainer}>
                                            <Text style={styles.noProductsText}>No Planned Customer to visit today</Text>
                                        </View>
                                    )}
                                />


                            </View>


                        </View>



{/* 
                        <View style={{ flex: 1, paddingHorizontal: 10, marginTop: '1%' }}>
                            <View style={styles.cardContainer}>
                                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                    <Text style={{ ...styles.modalTitle, color: Colors.primary }}>Deviated Customer Visit</Text>
                                </View>

                                <FlatList
                                    data={deviatedDealers}
                                    renderItem={({ item, index }) => (

                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, justifyContent: 'space-between', marginRight: 10 }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                                                <Image style={{ height: 20, width: 20, resizeMode: 'contain', marginRight: 10, marginTop: 2 }} source={{ uri: item?.account_profile_pic }} />
                                                <View>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                        <Text style={{ fontSize: 14, color: 'black', fontFamily: 'AvenirNextCyr-Medium' }} numberOfLines={2}> {splitLongText(item.name)}</Text>
                                                    </View>
                                                    <Text style={{ marginLeft: 5, fontSize: 14, fontFamily: 'AvenirNextCyr-Thin', color: item.status == 'Completed' ? 'green' : 'red' }}>{item.status}</Text>

                                                </View>
                                            </View>


                                            <View>
                                                {item.status == 'Pending' && <TouchableOpacity
                                                    onPress={() => checkCustomerLocation(item)}
                                                >
                                                    <Text style={{ marginLeft: 10, fontSize: 14, fontFamily: 'AvenirNextCyr-Medium', color: Colors.primary }}>Check-in</Text>
                                                </TouchableOpacity>}
                                            </View>
                                        </View>
                                    )}

                                    ListEmptyComponent={() => (
                                        <View style={styles.noProductsContainer}>
                                            <Text style={styles.noProductsText}>No Deviated customer to visit today</Text>
                                        </View>
                                    )}
                                />


                            </View>


                        </View> */}
                        {/* </ScrollView> */}

                    </View>
                    //---------------------------------------------------------------------
                    //---------------------------------------------------------------------

                    //---------------------------------------------------------------------

                    //---------------------------------------------------------------------

                    //---------------------------------------------------------------------

                    //---------------------------------------------------------------------

                    //---------------------------------------------------------------------

                    //---------------------------------------------------------------------

                    //---------------------------------------------------------------------

                    //---------------------------------------------------------------------

                ) : (
                    <View style={{ width: '100%', height: '100%' }}>
                        <MapboxGL.MapView
                            styleURL={MapboxGL.StyleURL.Street}
                            zoomLevel={12}
                            zoomEnabled={true}
                            rotateEnabled={true}
                            style={{ width: '100%', height: '100%' }}>

                            <MapboxGL.Camera
                                zoomLevel={12}
                                centerCoordinate={userCordinates}
                                animationMode={'flyTo'}
                                animationDuration={0}
                                pitch={60}
                            />

                            {userCordinates &&
                                <MapboxGL.PointAnnotation
                                    id="pointAnnotation"
                                    key={'UserLocation'}
                                    coordinate={userCordinates}>
                                    <View style={{
                                        height: 30,
                                        width: 30,
                                        backgroundColor: '#3f6de7',
                                        borderRadius: 50,
                                        borderColor: '#fff',
                                        borderWidth: 3
                                    }}
                                    />
                                </MapboxGL.PointAnnotation>
                            }

                            {routeDirections && (
                                <MapboxGL.ShapeSource id="line1" shape={routeDirections}>
                                    <MapboxGL.LineLayer
                                        id="routerLine01"
                                        style={{
                                            lineColor: 'blue',
                                            lineWidth: 4,
                                        }}
                                    />
                                </MapboxGL.ShapeSource>
                            )}




                            {allCustomers.slice(1).map((account, index) => (
                                <MapboxGL.PointAnnotation key={index} id={`destinationPoint${index}`} coordinate={[parseFloat(account.longitude), parseFloat(account.latitude)]}>
                                    <Callout
                                        title={account?.name}
                                        textStyle={{ fontFamily: 'AvenirNextCyr-Thin', fontSize: 12 }}
                                        selected={true}
                                    >
                                    </Callout>
                                </MapboxGL.PointAnnotation>
                            ))}






                        </MapboxGL.MapView>
                    </View>
                )}

            </View>



            {loading && (
                <ActivityIndicator
                    animating={loading}
                    color={Colors.primary}
                    size="large"
                    style={styles.activityIndicator}
                />
            )}

            <Modal
                visible={DeviateModalVisible}
                animationType="slide"
                transparent={true}
            >


                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <View style={{ backgroundColor: 'white', padding: 20, width: '100%', height: '100%', marginHorizontal: 10, borderRadius: 10, elevation: 5, flex: 1 }}>

                        <View style={{ ...styles.headercontainer }}>
                            <Text></Text>
                            <Text style={styles.headerTitle}>Select Customers</Text>

                            <TouchableOpacity onPress={() => setDeviateModalVisible(false)}>
                                <AntDesign name='close' size={25} color={Colors.black} />
                            </TouchableOpacity>
                        </View>
                        <Searchbar
                            style={{ marginVertical: '3%', backgroundColor: '#F3F3F3' }}
                            placeholder="Search Customer"
                            onChangeText={(val) => searchProduct(val)}
                            value={searchQuery}
                        />

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

                            <View><Text style={{ fontFamily: 'AvenirNextCyr-Medium', fontSize: 13 }}>Select the customers</Text></View>

                            <View style={{ flexDirection: 'row', paddingLeft: '3%', paddingVertical: '1%', backgroundColor: isAllCustomersSelected() ? Colors.primary : 'white', alignItems: 'center', justifyContent: 'center', borderRadius: 30 }}>
                                <TouchableOpacity
                                    onPress={handleSelectAll}
                                >
                                    <Text style={{ fontFamily: 'AvenirNextCyr-Medium', fontSize: 12, color: isAllCustomersSelected() ? 'white' : 'black' }}>SELECT ALL</Text>
                                </TouchableOpacity>
                                <RadioButton.Android
                                    color={isAllCustomersSelected() ? 'white' : 'black'}
                                    status={isAllCustomersSelected() ? 'checked' : 'unchecked'}
                                    onPress={handleSelectAll}
                                />
                            </View>
                        </View>


                        <View style={styles.customerMainContainer}>
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                data={filteredData}
                                keyboardShouldPersistTaps='handled'
                                renderItem={renderItem}
                                keyExtractor={(item) => item.id.toString()}
                                ListEmptyComponent={() => (
                                    <View style={styles.emptyListComponent}>
                                        <Text style={{ fontFamily: 'AvenirNextCyr-Medium', fontSize: 16, color: '#bcbcbc' }}>No Deviated Customers.</Text>
                                    </View>
                                )}

                            />

                        </View>


                        <View style={{ justifyContent: 'flex-end' }}>
                            <LinearGradient
                                colors={Colors.linearColors}
                                start={Colors.start}end={Colors.end}
                                locations={Colors.location}
                                style={{
                                    //  paddingVertical: '3%',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: 8,
                                    margin: '5%',
                                    borderRadius: 30
                                }}
                            >
                                <TouchableOpacity style={styles.button}
                                    //  onPress={checkActivePlanExist} 
                                    onPress={requestApprovalPressed}
                                    activeOpacity={0.8}>
                                    <Text style={styles.btnText}>Proceed</Text>
                                </TouchableOpacity>
                            </LinearGradient>
                        </View>





                    </View>
                </View>
            </Modal>


            {/* <ActionButton
                buttonColor={Colors.primary}
                renderIcon={() => <AntDesign name='plus' color='#fff' size={20} />}
                onPress={() => { setDeviateModalVisible(true) }}
            /> */}
        </View>


    )
}

export default Map

const styles = StyleSheet.create({
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
        marginRight: 10,
        marginVertical: 10,
        backgroundColor: Colors.primary
    },
    buttonText: {
        fontFamily: 'AvenirNextCyr-Thin',
        color: 'white'
    },
    modalTitle: {
        fontSize: 16,
        color: Colors.primary,
        fontFamily: 'AvenirNextCyr-Medium',

    },
    markerContainer: {
        alignItems: "center",
        width: 60,
        backgroundColor: "transparent",
        height: 70,
    },
    textContainer: {
        backgroundColor: "white",
        borderRadius: 10,
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
    },
    text: {
        textAlign: "center",
        paddingHorizontal: 5,
        flex: 1,
    },
    customer: {
        position: 'absolute',
        top: 5,
        right: 15,
        height: 40,
        width: 100,
        backgroundColor: Colors.primary,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center'
    },
    customerText: {
        fontSize: 14,
        color: Colors.white,
        fontFamily: 'AvenirNextCyr-Medium'
    },
    activityIndicator: {
        flex: 1,
        alignSelf: 'center',
        height: 100,
        position: 'absolute',
        top: '50%',

    },
    card: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
    },

    expandedContent: {
        marginTop: 20,
    },
    noProductsContainer: {
        // backgroundColor:'red',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: '10%',
        paddingVertical: '20%',

        alignContent: 'center'
    },
    noProductsText: {
        fontSize: 16,
        color: 'gray',
        fontFamily: 'AvenirNextCyr-Thin',
        textAlign: 'center',

    },

    headercontainer: {
        paddingHorizontal: 10,
        paddingVertical: 10,
        //backgroundColor:'red',
        flexDirection: 'row',
        alignItems: 'center',
        //backgroundColor:'red'
        justifyContent: 'space-between',
        marginTop: Platform.OS === "ios" ? '6%' : 0

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

    button: {
        paddingVertical: '3%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        // backgroundColor: Colors.primary,
        // margin: '5%',
        borderRadius: 30,
        width: '100%'
    },
    btnText: {
        fontFamily: 'AvenirNextCyr-Medium',
        color: '#fff',
        fontSize: 16
    },
    cardContainer: {
        backgroundColor: 'white',
        borderRadius: 10,
        // borderWidth: 1,
        // borderColor: Colors.primary, // You can replace this with the desired border color
        padding: 15,
        marginVertical: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        // height:'100%',
        flex: 1
    },
    emptyListComponent: {
        marginTop: '50%',
        alignItems: 'center',



    }

})

