import {
    StyleSheet, Text, View, Image, ActivityIndicator,
    FlatList, TouchableOpacity, Keyboard, TextInput, Modal, Pressable, Alert, Button
} from 'react-native'
import React, { useState, useEffect, useContext, useRef } from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign';
import Colors from '../../constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../../Context/AuthContext';
import { TabRouter, useFocusEffect } from "@react-navigation/native";
import ImageResizer from '@bam.tech/react-native-image-resizer'
import Geolocation from 'react-native-geolocation-service';
import { locationPermission } from '../../utils/Helper';
import moment from 'moment';
import { ProgressDialog } from 'react-native-simple-dialogs';
import globalStyles from '../../styles/globalStyles';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { cameraPermission } from '../../utils/Helper';
import RNFS from 'react-native-fs';
import Icon from 'react-native-vector-icons/FontAwesome';
import CustomerDetail from '../CustomerDetail';

const CustomerFinance = ({ navigation }) => {
    const { token, changeDealerData, tourPlanName, changeDocId, tourPlanId } = useContext(AuthContext);
    const [masterData, setMasterData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [search, setSearch] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [loading2, setLoading2] = useState(false);


    const handleImagePress = (id) => {
        //saveProfilePictureToApi(id)
        setSelectedId(id);
        setShowPopup(true);
    };

    console.log("tour plan name", token)

    //active dealer hooks
    const dealerArray = useRef([])
    const [loading, setLoading] = useState(false);
    const [checkInLoading, setCheckInLoading] = useState(false);
    const [base64img, setBase64img] = useState('');

    //selected customer id
    const [selectedId, setSelectedId] = useState(null);

    const checkPermissionCam = async () => {
        let PermissionDenied = await cameraPermission();
        if (PermissionDenied) {
            console.log("camera permssion granted");
            handleCamera();
        }
        else {
            console.log("camera permssion denied");
            //requestStoragePermission();
        }
    }

    // console.log("cdhwckch",dealerData)

    const handleCamera = async () => {
        // setModalVisible1(false);
        const res = await launchCamera({
            mediaType: 'photo',
        });
        console.log("response", res.assets[0].uri);
        imageResize(res.assets[0].uri, res.assets[0].type);
        // if (base64img) {
        //     await saveProfilePictureToApi(base64img);
        //     console.log("Profile picture saved");
        // }
        setShowPopup(false);
    }
    const handleGallery = async () => {
        // setModalVisible1(false);
        const res = await launchImageLibrary({
            mediaType: 'photo',

        });
        console.log("response", res.assets[0].uri);
        imageResize(res.assets[0].uri, res.assets[0].type);
        // if (base64img) {
        //     await saveProfilePictureToApi(base64img);
        //     console.log("Profile picture saved ");
        // }
        setShowPopup(false);
    }



    const imageResize = async (img, type) => {
        setLoading2(true);
        ImageResizer.createResizedImage(
            img,
            300,
            300,
            'JPEG',
            50,

        )
            .then(async (res) => {
                console.log('image resize', res);
                RNFS.readFile(res.path, 'base64')
                    .then(res => {
                        console.log('base64', res);
                        //uploadImage(res)
                        setBase64img(`data:${type};base64,${res}`);
                        saveProfilePictureToApi(`data:${type};base64,${res}`);
                    });
            })
            .catch((err) => {
                console.log(" img resize error", err)
            })
            .finally(() => setLoading2(false));
    }

    const saveProfilePictureToApi = async (imgbase64) => {
        const apiUrl = 'https://dev.ordo.primesophic.com/set_account_details.php';
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const requestData = {

            __img_src_c__: `${Date.now()}.png`,
            __image_base64__: imgbase64,
            __type__: "1",
            __account_id__: selectedId

            // Add any other necessary data to the request body
        };

        console.log("save image api body", requestData)

        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(requestData),
            redirect: 'follow'
        };

        try {
            const response = await fetch(apiUrl, requestOptions);
            const result = await response.json();
            console.log("Profile picture saved to API:", result);
            //refreshing list
            getActiveDealerList();
        } catch (error) {
            console.error("Error saving profile picture:", error);
        }
    }


    const checkPermission = async () => {
        let PermissionDenied = await locationPermission();
        if (PermissionDenied) {
            console.log("location permssion granted");
            //getting location
            Geolocation.getCurrentPosition(
                (res) => {
                    getTodayPlan(res.coords.latitude.toString(), res.coords.longitude.toString())
                    console.log("lattitude", res.coords.latitude);
                    console.log("longitude", res.coords.longitude);
                },
                (error) => {
                    console.log("get location error", error);
                    console.log("please enable location ")

                },
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }

            );
        }
        else {
            console.log("location permssion denied");

        }
    }


    useFocusEffect(
        React.useCallback(() => {
            checkPermission();
        }, [])
    );

    //getting todays plan
    const getTodayPlan = async (latitude, longitude) => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "text/plain");

        var raw = JSON.stringify(
            {
                "__user_id__": token,
                "__latitude__": latitude,
                "__longitude__": longitude
            }
        )

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("https://dev.ordo.primesophic.com/get_today_visit.php", requestOptions)
            .then(response => response.json())
            .then(async result => {
                console.log("GET TODAY PLaN API RESPONSE", result)
                if (Array.isArray(result?.accounts)) {
                    dealerArray.current = result?.accounts;
                    console.log("dealer Array", dealerArray.current);
                }
                // else {
                //     Alert.alert('Warning', `You don't have an active plan`);
                // }
            })
            .catch(error => console.log('get today plan api error', error));
    }


    useEffect(() => {
        //getting active dealer list for the particular user
        getActiveDealerList();
    }, [])


    const getActiveDealerList = async () => {
        setLoading(true)
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "__user_id__": token
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("https://dev.ordo.primesophic.com/get_accounts_for_dealer.php", requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log('active dealer api  res', result);

                setMasterData(result)
                setFilteredData(result);
                setLoading(false);

            })
            .catch(error => {
                setLoading(false);
                console.log('error', error)
            });

    }

    // const [cartData, setCartData] = useState([]);

    // const loadAllProduct = async (dealerArray) => {
    //     console.log("loading all product");
    //     var myHeaders = new Headers();
    //     myHeaders.append("Content-Type", "application/json");

    //     var raw = JSON.stringify({
    //         "__module_code__": "PO_19",
    //         "__query__": "",
    //         "__orderby__": "",
    //         "__offset__": 0,
    //         "__select _fields__": ["id", "name"],
    //         "__max_result__": 500,
    //         "__delete__": 0
    //     });

    //     var requestOptions = {
    //         method: 'POST',
    //         headers: myHeaders,
    //         body: raw,
    //         redirect: 'follow'
    //     };

    //     fetch("https://dev.ordo.primesophic.com/get_data_s.php", requestOptions)
    //         .then(response => response.json())
    //         .then(async result => {
    //             console.log('all product data fetched', result);
    //             let tempArray = []
    //             result?.entry_list.forEach(object => {
    //                 //console.log("customer res", object.name_value_list)
    //                 dealerArray.forEach(itm => {
    //                     if (itm.id == object.name_value_list.id.value) {
    //                         console.log("inside dealer id ", itm.id);
    //                         console.log("allccustomer  id ", object.name_value_list.id.value);

    //                         //matchedCustomers.push(customer);
    //                         tempArray.push({
    //                             'addressline1': object.name_value_list.billing_address_street.value,
    //                             'addressline2': object.name_value_list.billing_address_street_2.value,
    //                             'country': object.name_value_list.billing_address_country.value,
    //                             'state': object.name_value_list.billing_address_state.value,
    //                             'name': object.name_value_list.name.value,
    //                             'postalcode': object.name_value_list.billing_address_postalcode.value,
    //                             'creditlimit': object.name_value_list.creditlimit_c.value,
    //                             "credit_note": object.name_value_list.credit_note.value,
    //                             'image': "https://dev.ordo.primesophic.com/upload/" + object.name_value_list.id.value + "_img_src_c",
    //                             'lastsaleamount': "0",
    //                             'lastpaymentdate': "",
    //                             'lastsaledate': "",
    //                             // 'lastsaledate':object[i].name_value_list.lastsaledate.value,
    //                             'due_amount_c': object.name_value_list.due_amount_c.value,
    //                             'ispaymentdue': object.name_value_list.payment_due_c.value,
    //                             'id': object.name_value_list.id.value,
    //                             'email': object.name_value_list.email.value,
    //                             'owner': object.name_value_list.ownership.value,

    //                             'storeid': object.name_value_list.storeid_c.value


    //                         })
    //                     }

    //                 });
    //                 //checking if dealer is in active dealers array




    //             });
    //             console.log("product data", tempArray);
    //             setMasterData(tempArray)
    //             setFilteredData(tempArray);


    //         })
    //         .catch(error => console.log('error', error));
    // }

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
                    return itemData.indexOf(textData) > -1;
                });
            setFilteredData(newData);
            setSearch(text);
        } else {
            // Inserted text is blank
            // Update FilteredDataSource with masterDataSource
            setFilteredData(masterData);
            setSearch(text);
        }
    };



    // const getDealerArray = async () => {
    //     try {
    //         const tempDealerarray = await AsyncStorage.getItem('activePlan');
    //         if (tempDealerarray !== null) {
    //             // We have data!!
    //             let arr = JSON.parse(tempDealerarray);
    //             setDealerArray(arr);

    //             console.log("customer dealer array", arr)

    //         }
    //     }
    //     catch (error) {
    //         console.log("get active plan error", error)
    //     }

    // }
    //manual check-in save
    const saveCheckIn = (item, visit_date_key, type) => {
        console.log("type", type)
        setCheckInLoading(true);
        console.log("active dealer", visit_date_key);
        console.log("visit date key", visit_date_key);
        console.log("tour plan id", tourPlanId);
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        // var raw = JSON.stringify({
        //     "__module_code__": "PO_37",
        //     "__query__": "",
        //     "__name_value_list__":
        //     {
        //         "name": item?.name,
        //         "po_ordousers_id_c": token,
        //         "account_id_c": item?.id,
        //         "dealer_id": item?.name,
        //         "check_in": moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
        //         "tour_plan_id": tourPlanId,
        //         "visit_date_key": visit_date_key




        //     }
        // });

        var raw = JSON.stringify({
            "__name__": tourPlanName,
            "__po_ordousers_id_c__": token,
            "__account_id_c__": item?.id,
            "__check_in__": moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
            "__tour_plan_id__": tourPlanId,
            "__visit_date_key__": visit_date_key,
            "__type__": type ? 'External' : ''
            // "name": , //nearByDealer?.name, //tour plan name
            // "po_ordousers_id_c": token,
            // "account_id_c": nearByDealer?.id,
            // "dealer_id": nearByDealer?.name,
            // "check_in": moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
            // "tour_plan_id": tour_plan_id,
            // "visit_date_key": visitDateKey
        });



        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("https://dev.ordo.primesophic.com/set_check_in.php", requestOptions)
            .then(response => response.json())
            .then(result => {
                setCheckInLoading(false);
                changeDealerData(item)
                console.log('manual checkin save res', result);
                console.log('inserted id', result.id);
                changeDocId(result.id);
                navigation.navigate('CheckIn', { visitDateKey: visit_date_key, tour_plan_id: tourPlanId, backIcon: true, external: true })



            })
            .catch(error => {
                setCheckInLoading(true);
                console.log('api error', error);
            });

    }

    const checkActivePlan = async (item, id) => {
        //user have active plan
        if (Array.isArray(dealerArray.current) && dealerArray.current.length > 0) {
            console.log("inside")
            //checking user started active plan
            let res = await AsyncStorage.getItem(tourPlanId)
            console.log("res", res)
            //user started active plan
            if (res) {
                console.log("user started active  plan ");
                var interalVisit = false;
                //internal visit
                dealerArray.current.forEach(async itm => {
                    console.log("given id", id);
                    console.log("dealer array id", itm.id);
                    console.log("dealer item", itm);

                    if (itm.id == id) {
                        console.log("internal visit")
                        console.log("user have active plan");
                        console.log("current  item id ", tourPlanId)
                        interalVisit = true;
                        //saving check in (internal)
                        saveCheckIn(item, itm?.visit_date_key);
                        return;
                    }

                });
                //external visit
                if (!interalVisit) {
                    //saving check in (external)
                    console.log("external  visit")
                    Alert.alert('Check In', 'Selected customer is not in your route. Do you wish to continue', [
                        {
                            text: 'Cancel',
                            onPress: () => console.log('Cancel Pressed'),
                            style: 'cancel',
                        },
                        { text: 'OK', onPress: () => { saveCheckIn(item, null, 'external') } },
                    ]);

                }

            }

            //user dont started active plan
            else {
                Alert.alert('Warning', `You haven't started an active plan`, [
                    { text: 'OK' },
                ]);
                console.log("user dont started active plan")
            }


            // let externalVisit = false;
            // //user have active plan
            // dealerArray.current.forEach(async itm => {
            //     console.log("given id", id);
            //     console.log("dealer array id", itm.id);
            //     if (itm.id == id) {
            //         console.log("user have active plan");
            //         console.log("current  item id ", tourPlanId)
            //         let res = await AsyncStorage.getItem(tourPlanId)
            //         console.log("res", res)
            //         //user started active plan
            //         if (res) {
            //             console.log("user started plan ");
            //             externalVisit = true;
            //             //saving check in (internal)
            //             saveCheckIn(item, itm?.visit_date_key);

            //         }
            //         //user dont started active plan
            //         else {
            //             Alert.alert('Warning', `You don't started an active plan`, [
            //                 { text: 'OK', onPress: () => { navigation.goBack() } },
            //             ]);
            //             console.log("user dont started active plan")
            //         }
            //         return;
            //     }

            // });
            // if (!externalVisit) {
            //     //checking user has started ative plan
            //     console.log("current  item id ", tourPlanId)
            //     let res = await AsyncStorage.getItem(tourPlanId)
            //     console.log("res", res)
            //     //user started active plan
            //     if (res) {
            //         console.log("user started plan ")
            //         Alert.alert('Check In', 'Selected customer is not in the list do you want to continue', [
            //             {
            //                 text: 'Cancel',
            //                 onPress: () => console.log('Cancel Pressed'),
            //                 style: 'cancel',
            //             },
            //             { text: 'OK', onPress: () => { saveCheckIn(item, null, 'external') } },
            //         ]);

            //     }
            //     //user dont started active plan
            //     else {
            //         Alert.alert('Warning', `You don't started an active plan`, [
            //             { text: 'OK', onPress: () => { navigation.goBack() } },
            //         ]);
            //         console.log("user dont started active plan")

            //     }

            //     // console.log("user have does not  active plan");
            // }
        }
        //user dont have active plan
        else {
            Alert.alert('Warning', `You don't have an active plan`, [
                { text: 'OK' },
            ]);

        }
    }

const SeeDetail=()=>{
    navigation.navigate('CustomerDetail',{ item: item })
}



    return (

        <View style={styles.container} >
            {/* manaul check in request loader  */}
            <ProgressDialog
                visible={checkInLoading}
                title="Sending checkin request"
                message="Please, wait..."
            />

            <ProgressDialog
                visible={loading2}
                title="Uploading image"
                message="Please wait..."
                titleStyle={{ fontFamily: 'AvenirNextCyr-Medium' }}
                messageStyle={{ fontFamily: 'AvenirNextCyr-Thin' }}
            />



            <Text style={{ alignSelf: 'center', fontSize: 20, color: Colors.primary, fontFamily: 'AvenirNextCyr-Medium', marginVertical: 5 }}>Customers</Text>
            <ActivityIndicator
                animating={loading}
                color={Colors.primary}
                size="large"
                style={styles.activityIndicator}

            />
            <View style={{ flexDirection: 'row' }}>
                <View style={styles.modalSearchContainer}>
                    <TextInput
                        style={styles.input}
                        value={search}
                        placeholder="Search dealer"
                        placeholderTextColor="gray"
                        onChangeText={(val) => searchProduct(val)}

                    />
                    <TouchableOpacity style={styles.searchButton} >
                        <AntDesign name="search1" size={20} color="black" />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    style={{ height: 50, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', borderRadius: 10, paddingHorizontal: 16, elevation: 5, ...globalStyles.border, flex: 0.2 }}
                    onPress={() => {
                        setSearch('');
                        setFilteredData(masterData)
                        Keyboard.dismiss();
                    }
                    }
                >
                    <Text style={{ color: Colors.primary, fontFamily: 'AvenirNextCyr-Thin', fontSize: 14 }}>Clear</Text>

                </TouchableOpacity>
            </View>
            <Text style={{ color: '#000', fontFamily: 'AvenirNextCyr-Medium',marginLeft:5, marginVertical:5, fontSize: 15 , }}>All Customers List</Text>


            <FlatList
                showsVerticalScrollIndicator={false}
                data={filteredData}
                keyboardShouldPersistTaps='handled'
                renderItem={({ item }) =>

                    <View style={styles.elementsView}  
                    
                    >
                        <View style={{ flexDirection: 'row', justifyContent: 'center',alignItems:'center' }}>
                          <TouchableOpacity
                              disabled={item?.account_profile_pic ? true : false}
                            //   onPress={() => handleImagePress(item.id)}
                            >
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
                              <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                              <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Thin' }}>{item?.account_type}</Text>
                              <TouchableOpacity onPress={()=>{navigation.navigate('CustomerDetail',{ item: item })}}>
                              <Text style={{ color: 'orange', fontSize: 13, fontFamily: 'AvenirNextCyr-Thin' }}>See details</Text>
                              </TouchableOpacity>
                              </View>


                              {/* <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Thin' }}>{item?.street} {item?.city} {item?.shipping_address_state}</Text> */}
                              {/* <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Thin' }}>{item?.country} - {item?.postal_code}</Text> */}
                          </View>
                      </View>
                        {/* <Text style={{ fontSize: 12, color: 'black', fontFamily: 'AvenirNextCyr-Thin', marginTop: 5, paddingLeft: 16 }}>{item?.storeid_c}</Text> */}

                    </View>


                }

            />
            <Modal
                animationType="fade"
                transparent={true}
                visible={showPopup}
                onRequestClose={() => setShowPopup(false)}
            >
                <TouchableOpacity
                    style={styles.modalContainer}
                    activeOpacity={1}
                // onPressOut={toggleModal}
                >
                    <View style={styles.modalContent}>
                        <TouchableOpacity style={styles.closeIcon} onPress={() => setShowPopup(false)}>
                            <Icon name="times" size={20} color="#000" />
                        </TouchableOpacity>
                        <View style={styles.modalInnerContent}>
                            <View style={styles.container1}>


                                {/* {renderLabel()} */}

                            </View>
                            <TouchableOpacity onPress={checkPermissionCam} style={styles.submitButton}>
                                <Text style={styles.submitButtonText}>Take Photo</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleGallery} style={styles.submitButton}>
                                <Text style={styles.submitButtonText}>Choose from Gallery</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableOpacity>
            </Modal>



        </View>



    )
}

export default CustomerFinance

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: 'white'
    },
    activityIndicator: {
        flex: 1,
        alignSelf: 'center',
        height: 100,
        position: 'absolute',
        top: '30%',

    },
    elementsView: {
        paddingVertical:15,
        paddingHorizontal:15,
  
        backgroundColor: "white",
        margin: 5,
        //borderColor: 'black',
        //flexDirection: 'row',
        //justifyContent: 'space-between',
        //alignItems: 'center',
        marginBottom: 15,
        borderRadius: 15,
        elevation: 5,
  
        padding: 8
        //borderColor: '#fff',
        //borderWidth: 0.5
    },
    imageView: {
        width: 70,
        height: 70,
        // borderRadius: 40,
        // marginTop: 20,
        // marginBottom: 10
    },
    elementText: {
        fontSize: 15,
        fontFamily: 'AvenirNextCyr-Medium',
        color: 'black'
    },
    minusButton: {
        width: 45,
        height: 30,
        borderColor: 'grey',
        borderWidth: 0.5,
        borderRadius: 5,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
        marginTop: 30,
        marginLeft: 10
    },
    modalMinusButton: {
        width: 35,
        height: 20,
        borderColor: 'grey',
        borderWidth: 0.5,
        borderRadius: 5,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
        marginTop: 40,
        marginLeft: 10
    },
    quantityCount: {
        width: 45,
        height: 30,
        borderColor: 'grey',
        borderWidth: 0.5,
        borderRadius: 5,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
        marginTop: 30,
        marginLeft: 1
    },
    modalQuantityCount: {
        width: 35,
        height: 20,
        borderColor: 'grey',
        borderWidth: 0.5,
        borderRadius: 5,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
        marginTop: 40,
        marginLeft: 1
    },
    orderCloseView: {
        height: 15,
        width: 15,
        //marginTop: 30
    },
    imageText: {
        fontSize: 15,
        fontFamily: 'AvenirNextCyr-Thin',
        color: 'black',
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'lightgray',
        borderRadius: 5,

        //paddingVertical: 5,
        paddingHorizontal: 10,
        marginLeft: 10
    },
    input: {
        flex: 1,
        fontSize: 16,
        marginRight: 10,
    },
    searchButton: {
        padding: 5,
    },
    sendButtonView: {
        borderRadius: 5,
        // borderWidth: 1,
        // borderColor: 'grey',
        backgroundColor: 'green',
        paddingVertical: 10,
        paddingHorizontal: 20,

        height: 40,
        marginLeft: 10
    },
    saveButtonView: {
        borderRadius: 5,
        // borderWidth: 1,
        // borderColor: 'grey',
        backgroundColor: Colors.primary,
        paddingVertical: 10,
        paddingHorizontal: 20,
        height: 40,
        marginLeft: 10
    },
    deleteButtonView: {
        borderRadius: 5,
        // borderWidth: 1,
        // borderColor: 'grey',
        backgroundColor: 'red',
        paddingVertical: 10,
        paddingHorizontal: 20,
        height: 40,
        marginLeft: 10
    },
    addButtonView: {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'grey',
        backgroundColor: 'white',
        paddingVertical: 10,
        paddingHorizontal: 20,
        height: 40,
        marginLeft: 10,
        alignSelf: 'center'
    },
    modalAddButtonView: {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'grey',
        backgroundColor: 'white',
        paddingVertical: 5,
        paddingHorizontal: 15,
        height: 35,
        //alignSelf: 'flex-end',
        //marginLeft: 30,
        //marginTop: 60
    },
    buttonText: {
        color: 'blue',
        fontFamily: 'AvenirNextCyr-Thin'
    },
    sendButton: {
        color: 'white',
        fontFamily: 'AvenirNextCyr-Thin'
    },
    deleteButton: {
        color: 'red'
    },
    saveButton: {
        color: 'purple'
    },
    textColor: {
        color: 'black',
        fontFamily: 'AvenirNextCyr-Thin',

    },
    searchModal: {
        backgroundColor: 'white',
        padding: 20,
        width: '90%',
        marginHorizontal: 10,
        borderRadius: 10,
        elevation: 5,
        //borderColor: 'black',
        //borderWidth: 1,
        marginVertical: 100
        // flexDirection:'row'
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
        fontSize: 16,
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
        fontFamily: 'AvenirNextCyr-Thin',

    },
    selectedTextStyle: {
        fontSize: 16,
        fontFamily: 'AvenirNextCyr-Thin',
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
        fontFamily: 'AvenirNextCyr-Thin',

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
        color: '#fff',
        fontSize: 16,
        fontFamily: 'AvenirNextCyr-Medium'
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 50,
        borderWidth:1,
        borderColor:'gray',
      },
    

})