import React, { useState, useEffect, useRef, useContext, PureComponent } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Dimensions, ScrollView, FlatList, Pressable, Alert, TouchableOpacity } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import DatePicker from 'react-native-date-picker'
import { Image } from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import Colors from '../../constants/Colors';
import AntDesign from 'react-native-vector-icons/AntDesign';
// import { RadioButton } from 'react-native-paper';
import moment from 'moment';
import { format, lastDayOfMonth, getDay, addDays } from 'date-fns';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../../Context/AuthContext';
import SwitchSelector from 'react-native-switch-selector';
import { Searchbar, Checkbox, RadioButton } from 'react-native-paper';



// ({ item }) =>

//     <TouchableOpacity style={styles.elementsView} activeOpacity={0.8} onPress={() => {

//         handleCheckboxChange(item)
//         //changeDealerData(item);
//         //navigation.navigate('CheckIn', { hideCheckOut: true })
//     }
//     }
//     >
//         <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
//             <TouchableOpacity
//                 disabled={item?.account_profile_pic ? true : false}
//                 onPress={() => handleImagePress(item.id)}>
//                 <Image
//                     //source={require('../../assets/images/account.png')}
//                     source={{ uri: item?.account_profile_pic }}
//                     style={{ ...styles.avatar }}
//                 />
//             </TouchableOpacity>
//             <View style={{
//                 flex: 1,
//                 marginLeft: 8,
//                 // borderLeftWidth: 1.5,
//                 paddingLeft: 10,
//                 marginLeft: 20,
//                 // borderStyle: 'dotted',
//                 // borderColor: 'grey',
//                 justifyContent: 'space-around'
//             }}>
//                 {/* <View style={{ flexDirection: 'row' }}> */}
//                 <Text style={{ color: Colors.primary, fontSize: 12, fontFamily: 'AvenirNextCyr-Medium', borderBottomColor: 'grey' }}>{item?.name}</Text>
//                 {/* </View> */}
//                 <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Thin' }}>{item?.industry}</Text>
//                 <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
//                     <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Thin' }}>{item?.account_type}</Text>


//                     <Checkbox
//                         color={Colors.primary}
//                         status={
//                             selectedCustomer.some((customer) => customer.id === item.id) ? 'checked' : 'unchecked'
//                         }
//                     />

//                 </View>

//             </View>
//         </View>


//     </TouchableOpacity>


const DeviateCustomers = ({ navigation, route }) => {

    const { planName, tourPlanId } = route.params;

    const { token } = useContext(AuthContext);

    const [searchQuery, setSearchQuery] = React.useState('');
    const [masterData, setMasterData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [checked, setChecked] = React.useState(false);
    const [selectedCustomer, setSelectedCustomers] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    const onChangeSearch = query => setSearchQuery(query);






    useEffect(() => {
        //getting active dealer list for the particular user
        getActiveDealerList();
    }, [])


    const getActiveDealerList = async () => {
        setLoading(true)
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "__tourplan_id__": tourPlanId
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            // body: raw,
            redirect: 'follow'
        };

        fetch("https://dev.ordo.primesophic.com/get_available_deviation.php", requestOptions)
            .then(response => response.json())
            .then(async result => {
                // console.log('active dealer api  res', result);


                // let tempArray = await result.map((item) => {
                //     // setAccountsArray1(item);
                //     if (item.visit > 0) {  //checking if visiit is zero
                //         let wVisit = 1;  //default weekly visit value
                //         //checking company visit is > 4
                //         if (item?.visit > 4) {
                //             wVisit = Math.floor(item?.visit / 4) //integer division
                //         }
                //         return {
                //             ...item,
                //             // checked: false,
                //             monthlyVisit: item?.visit,
                //             weeklyVisit: wVisit.toString()
                //         }
                //     }
                // })




                // setMasterData(tempArray)
                // setFilteredData(tempArray);
                // setLoading(false);


                setMasterData(result)
                setFilteredData(result);
                setLoading(false);

            })
            .catch(error => {
                setLoading(false);
                console.log('error', error)
            });

    }



    useEffect(() => {
        // Initialize with all customers selected when the component mounts
        console.log("selected customer", selectedCustomer)
    }, [selectedCustomer]);


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


    const requestApprovalPressed = () => {

        if (planName && selectedCustomer.length > 0) {
            //console.log("dealer array",accountsarray)
            let dealerArray = []
            selectedCustomer.forEach((item) => {
                //push only if no of visit count > 0

                dealerArray.push({
                    __account_id__: item?.id,
                    // __no_of_visit__: type === 'Weekly' ? item?.weeklyVisit : item?.monthlyVisit

                })

                console.log("id", item.id)
                console.log("count", item.name)
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
                "__tourplan_id__": tourPlanId
            });

            console.log("deviate raww", raw);



            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            fetch("https://dev.ordo.primesophic.com/set_deviate_plan.php", requestOptions)
                .then(response => response.json())
                .then(result => {
                    console.log("tour detail", result);
                    if (result.status == '203') {
                        Alert.alert('Warning', 'Plan name already exists', [
                            { text: 'OK', onPress: () => { } }

                        ])
                    }
                    else {
                        Alert.alert('Deviate Plan', 'Plan sent for approval', [
                            { text: 'OK', onPress: () => navigation.navigate('Visits') }
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






    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>

            <View style={{ ...styles.headercontainer }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <AntDesign name='arrowleft' size={25} color={Colors.black} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Select Customers</Text>
                <Text></Text>
            </View>
            <Searchbar
                style={{ marginHorizontal: '4%', marginVertical: '3%', backgroundColor: '#F3F3F3' }}
                placeholder="Search Customer"
                onChangeText={onChangeSearch}
                value={searchQuery}
            />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: '5%', alignItems: 'center' }}>

                <View><Text style={{ fontFamily: 'AvenirNextCyr-Medium', fontSize: 13 }}>Select the customers</Text></View>

                <View style={{ flexDirection: 'row', paddingLeft: '3%', paddingVertical: '1%', backgroundColor: isAllCustomersSelected() ? Colors.primary : 'white', alignItems: 'center', justifyContent: 'center', borderRadius: 30 }}>
                    <TouchableOpacity >
                        <Text style={{ fontFamily: 'AvenirNextCyr-Medium', fontSize: 12, color: isAllCustomersSelected() ? 'white' : 'black' }}>SELECT ALL</Text>
                    </TouchableOpacity>
                    <RadioButton
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

                />

                {/* <Text>Selected Customers: {selectedCustomer.join(', ')}</Text> */}


            </View>

            <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                <TouchableOpacity style={styles.button}
                    //  onPress={checkActivePlanExist} 
                    onPress={requestApprovalPressed}
                    activeOpacity={0.8}>
                    <Text style={styles.btnText}>Request Approval</Text>
                </TouchableOpacity>
            </View>

        </SafeAreaView>
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
        marginHorizontal: '5%'
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
        backgroundColor: Colors.primary,
        margin: '5%',
        borderRadius: 30
    },
    btnText: {
        fontFamily: 'AvenirNextCyr-Medium',
        color: '#fff',
        fontSize: 16
    },

});

export default DeviateCustomers;