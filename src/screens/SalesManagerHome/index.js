import { StyleSheet, Text, View, TouchableOpacity, Image, Modal, FlatList, Alert } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign';
import Colors from '../../constants/Colors';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { AuthContext } from '../../Context/AuthContext';
import { useFocusEffect } from '@react-navigation/native';
import moment from 'moment';
import { Dropdown } from 'react-native-element-dropdown';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ActionButton from 'react-native-action-button';
import Ionicons from 'react-native-vector-icons/Ionicons';
import VersionModel from '../../components/versionModel';



const ApprovedPlans = ({ navigation, approvedArray }) => {

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <FlatList
                // data={dealerArray}
                data={approvedArray}
                renderItem={({ item }) => {

                    return (
                        <TouchableOpacity
                            style={styles.itemContainer}
                            key={item.id}
                            onPress={() => navigation.navigate('SMApprovedPlanDetails', { item: item })}
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
                                            alignItems: 'center'
                                        }}>
                                            <Image
                                                style={{ marginRight: 10, height: 15, width: 15, resizeMode: 'contain' }}
                                                source={require('../../assets/images/document2.png')} />
                                            <Text style={{ ...styles.title, color: Colors.black }}>{item?.username}</Text>
                                        </View>

                                    </View>


                                    <View style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        marginTop: 3,
                                    }}>
                                        <Image
                                            style={{ marginRight: 10, height: 15, width: 15, resizeMode: 'contain' }}
                                            source={require('../../assets/images/tick.png')} />
                                        <Text style={{ ...styles.text, color: Colors.primary, fontFamily: 'AvenirNextCyr-Medium' }}>{item?.name} </Text>
                                    </View>


                                    {/* <View style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        marginTop: 3,
                                    }}>
                                        <Image
                                            style={{ marginRight: 10, height: 15, width: 15, resizeMode: 'contain' }}
                                            source={require('../../assets/images/tick.png')} />
                                        <Text style={{ ...styles.text, color: color, fontFamily: 'AvenirNextCyr-Medium' }}>{item.status == 'PendingApproval' ? 'Pending Approval' : item.status} </Text>
                                    </View> */}
                                    <View style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        marginTop: 3,
                                    }}>
                                        <Image
                                            style={{ marginRight: 10, height: 15, width: 15, resizeMode: 'contain' }}
                                            source={require('../../assets/images/duration.png')} />
                                        <Text style={{ ...styles.text, fontWeight: '500' }}>{moment(item.start_date).format('DD-MM-YYYY')} To {moment(item.end_date).format('DD-MM-YYYY')}</Text>
                                    </View>

                                    <View style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        {/* <TouchableOpacity style={{
                                            height: 35,
                                            width: 120,
                                            backgroundColor: Colors.primary,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            borderRadius: 5,
                                            padding: 5,
                                            marginVertical: 10
                                        }}
                                            onPress={() => handlePlan(item)}
                                        >
                                            <Text style={{ fontSize: 14, color: Colors.white, fontFamily: 'AvenirNextCyr-Thin', color: '#fff' }}>Details</Text>
                                        </TouchableOpacity> */}
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

const Pending = ({ navigation, pendingArray }) => {

    // console.log("from peniendsjfnls", pendingArray)

    const {
        tourPlanArray,
    } = useContext(AuthContext)
    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <FlatList
                // data={dealerArray}
                data={pendingArray}
                renderItem={({ item }) => {
                    let color = item.status == 'Approved' ? 'green' : item.status == 'PendingApproval' ? 'orange' : 'red';
                    return (
                        <TouchableOpacity
                            style={styles.itemContainer}
                            key={item.id}
                            onPress={() => navigation.navigate('SMTourPlanDetails', { item: item })}
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
                                            alignItems: 'center'
                                        }}>
                                            <Image
                                                style={{ marginRight: 10, height: 15, width: 15, resizeMode: 'contain' }}
                                                source={require('../../assets/images/document2.png')} />
                                            <Text style={{ ...styles.title, color: Colors.black }}>{item?.username}</Text>
                                        </View>

                                    </View>


                                    <View style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        marginTop: 3,
                                    }}>
                                        <Image
                                            style={{ marginRight: 10, height: 15, width: 15, resizeMode: 'contain' }}
                                            source={require('../../assets/images/tick.png')} />
                                        <Text style={{ ...styles.text, color: Colors.primary, fontFamily: 'AvenirNextCyr-Medium' }}>{item?.name} </Text>
                                    </View>



                                    <View style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        marginTop: 3,
                                    }}>
                                        <Image
                                            style={{ marginRight: 10, height: 15, width: 15, resizeMode: 'contain' }}
                                            source={require('../../assets/images/duration.png')} />
                                        <Text style={{ ...styles.text, fontWeight: '500' }}>{moment(item.start_date).format('DD-MM-YYYY')} To {moment(item.end_date).format('DD-MM-YYYY')}</Text>
                                    </View>

                                    <View style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        {/* <TouchableOpacity style={{
                                            height: 35,
                                            width: 120,
                                            backgroundColor: Colors.primary,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            borderRadius: 5,
                                            padding: 5,
                                            marginVertical: 10
                                        }}
                                            onPress={() => handlePlan(item)}
                                        >
                                            <Text style={{ fontSize: 14, color: Colors.white, fontFamily: 'AvenirNextCyr-Thin', color: '#fff' }}>Details</Text>
                                        </TouchableOpacity> */}
                                    </View>

                                </View>
                            </View>

                        </TouchableOpacity>




                        // <TouchableOpacity
                        //     style={styles.itemContainer}
                        //     onPress={() => navigation.navigate('SMTourPlanDetails', { item: item })}
                        //     // key={item.id}
                        //     activeOpacity={0.5}
                        // >
                        //     <View style={{ paddingHorizontal: 15, }}>
                        //         <View style={{ marginVertical: 3 }}>
                        //             {/* <Text style={styles.heading}>Plan Name : {item.name} </Text>
                        // <Text style={styles.value}>Approved By : {item.approved_by}</Text>
                        // <Text style={styles.heading}>No. of Visit : {item?.dealer_count} </Text>
                        // <Text style={styles.heading}>Start Date : {item.start_date} </Text>
                        // <Text style={styles.heading}>End Date : {item.end_date} </Text>
                        // <Text style={styles.heading}>Status : {item.status} </Text> */}


                        //             {/* <Text style={styles.heading}>Salesman Name : {item?.ordo_user_name}</Text>
                        //         <Text style={styles.heading}>Plan Name : {item?.name}</Text>
                        //         <Text style={styles.heading}>No. of Visit : {item?.dealer_count}</Text>
                        //         <Text style={styles.heading}>Start Date : {item?.start_date}</Text>
                        //         <Text style={styles.heading}>End Date : {item.end_date}</Text> */}
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
                        //                 <Text style={{ ...styles.heading, color: color, fontFamily: 'AvenirNextCyr-Medium' }}>{item.status == 'PendingApproval' ? 'In Progress' : item.status} </Text> */}
                        //                     <Text style={{ ...styles.heading, color: 'black' }}>No. of Visits :</Text>
                        //                     <Text style={{ ...styles.heading, color: 'black' }}>#{item?.dealer_count}</Text>
                        //                 </View>
                        //                 <View style={{ flex: 1.6, marginLeft: 5 }}>
                        //                     <Text style={styles.heading}>Plan Duration :</Text>
                        //                     <Text style={{ ...styles.heading, color: 'grey' }}>{moment(item.start_date).format('DD-MM-YYYY')} To {moment(item.end_date).format('DD-MM-YYYY')}   </Text>
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




const SalesManagerHome = ({ navigation }) => {

    const [masterData1, setMasterData1] = useState([]);
    const [masterData2, setMasterData2] = useState([]);
    const [isModalVisible1, setModalVisible1] = useState(false);
    const [filterData, setFilterData] = useState([]);
    const [isFocus1, setIsFocus1] = useState(false);
    const [value1, setValue1] = useState(null);
    //request pdf hooks
    const [isModalVisible, setModalVisible] = useState(false);
    const [value, setValue] = useState(null);
    const [isFocus, setIsFocus] = useState(false);
    const [pendingArray, setPendingArray] = useState([]);
    const [approvedArray, setApprovedArray] = useState([]);


    const Tab = createMaterialTopTabNavigator();




    const {
        token,
        tourPlanArray,
        setTourPlanArray,
        userData,
        logout } = useContext(AuthContext)


    const allOption = { label: 'All', value: 'all' };
    const transformedData = [allOption];
    const processedValues = new Set();

    const toggleModal = () => {
        setModalVisible1(!isModalVisible1);
    };

    const applyFilter = () => {
        if (value1 == 'all') {
            // If "All" is selected, show all the products
            setApprovedArray(masterData1);
            setTourPlanArray(masterData2);
        } else
            if (value1) {
                const filteredApproveData = masterData1.filter(item => item.ordo_user_name === value1);
                const filteredPendingData = masterData2.filter(item => item.ordo_user_name === value1);

                setApprovedArray(filteredApproveData);
                setTourPlanArray(filteredPendingData);
            }

        setValue1(null);
        toggleModal();
    };

    useFocusEffect(
        React.useCallback(() => {
            getPlans();

        }, []))




    const getPlans = () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${userData.token}`);




        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch("https://gsidev.ordosolution.com/api/tourplans/", requestOptions)
            .then(response => response.json())
            .then(result => {

                // const allOption = { label: 'All', value: 'all' };
                // const transformedData = [allOption, ...jsonData.sub_category_list.map((item) => ({
                //   label: item.name,
                //   value: item.id,
                // }))];

                let approved = [];  //approved plans
                let pending = [];  //reject,pending plans  all are other plans
                result?.data.forEach((user) => {
                    user_tour_plans = user.tour_plans
                    user_tour_plans.forEach((tourPlan) => {
                        if (tourPlan.status === "Pending") {
                            pending.push(tourPlan)

                        }
                        else {
                            approved.push(tourPlan)
                        }

                    })


                    //     if (!processedValues.has(item.ordo_user_name)) {
                    //         transformedData.push({
                    //             label: item.ordo_user_name,
                    //             value: item.ordo_user_name,
                    //         });

                    //         processedValues.add(item.ordo_user_name);
                    //     }

                    //     setFilterData(transformedData)
                    //     //   console.log("xdcfghjkl",transformedData)
                    //     //approved plans 
                    //     console.log("item", item)
                    //     if (item?.status == 'Approved') {
                    //         approved.push(item);
                    //     }
                    //     //tour plans
                    //     else if (item?.status == 'PendingApproval') {
                    //         tourPlans.push(item)
                    //     }

                })
                setPendingArray(pending)
                setApprovedArray(approved)
                // let sortedarray = approved.sort((a, b) => (a.start_date < b.start_date) ? 1 : -1)
                // setApprovedArray(sortedarray)
                // setMasterData1(sortedarray)
                // let sortedarray2 = tourPlans.sort((a, b) => (a.start_date < b.start_date) ? 1 : -1)
                // setTourPlanArray(sortedarray2);
                // setMasterData2(sortedarray2);
                // console.log("approved plan", sortedarray);
                // console.log("tour plan", sortedarray2);
            })
            .catch(error => console.log('error', error));



    }

 

    const logoutAlert = () => {
        Alert.alert('Confirmation', 'Are you sure, You want to logout?', [
            {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            { text: 'OK', onPress: () => { logout() } },
        ]);
    }



    const optionData = [
        // { label: 'Daily', value: 'Daily' },
        // { label: 'Weekly', value: 'Weekly' },
        { label: 'Monthly', value: 'Monthly' },
        // { label: 'Quarterly', value: 'Quarterly' },
    ]


    const requestPDF = () => {
        if (!value) {
            Alert.alert('Warning', 'Please select report type option');
            return;
        }
        let task = 'pdf'
        if (value == 'Monthly' || value == 'Quarterly') {
            task = 'emailpdf'
        }
        setModalVisible(false);
        console.log("inside pdf")
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "text/plain");
        var raw = JSON.stringify({
            "__user_id__": token,
            "__duration__": value,
            "__task__": task
        })

        console.log("values", raw)
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
        fetch("https://dev.ordo.primesophic.com/send_checkin_pdf_mail.php", requestOptions)
            .then(response => response.json())
            .then(res => {
                //console.log("Signature Uploaded", result);
                console.log('pdf api res', res);
                if (value == 'Monthly' || value == 'Quarterly') {
                    //seding only emails
                    Alert.alert('Report Sent', 'The report will be sent to your email. Please check your inbox after few minutes.')

                }
                else {
                    //sending pdf
                    navigation.navigate('PDFViewer', { title: value, url: res });

                }
            })
            .catch(error => console.log('pdf api error', error));
    }


    //.............filter............ 








    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginLeft: 15, marginTop: 10, alignItems: 'center' }}>

                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity style={{ marginBottom: 7 }} onPress={() => navigation.goBack()}>
                        <AntDesign name='arrowleft' size={25} color={Colors.black} />
                    </TouchableOpacity>

                    <Image source={require('../../assets/images/ordologo-bg.png')} style={{ height: 50, width: 60 }} />
                </View>
                <TouchableOpacity
                    onPress={() => navigation.navigate('DeviatedPlans')}
                    style={{ marginRight: 10, alignItems: 'center' }}
                >
                    <MaterialIcons name='edit-road' size={22} color={Colors.primary} />
                    <Text style={{ fontSize: 8, color: Colors.primary, fontFamily: 'AvenirNextCyr-Thin', marginLeft: 3 }}>Deviated</Text>

                </TouchableOpacity>

                {/* <TouchableOpacity onPress={() => {
                    setValue1(null);
                    setModalVisible1(true)

                }
                }
                    style={{ marginRight: 10 }}
                >
                    <AntDesign name='filter' size={22} color={Colors.primary} />
                    <Text style={{ fontSize: 8, color: Colors.primary, fontFamily: 'AvenirNextCyr-Thin', marginLeft: 3 }}>Filter</Text>

                </TouchableOpacity> */}
                <TouchableOpacity onPress={() => {
                    setValue(null);
                    setModalVisible(true)

                }
                }
                    style={{ marginRight: 20 }}
                >
                    <AntDesign name='pdffile1' size={22} color={Colors.primary} />
                    <Text style={{ fontSize: 8, color: Colors.primary, fontFamily: 'AvenirNextCyr-Thin' }}>Report</Text>

                </TouchableOpacity>




            </View>
            {/* <View style={{ paddingHorizontal: 17, marginTop: 10 }}>
                <Text style={styles.buttonTextStyle}>Welcome Sales Manager</Text>
            </View> */}
            <View style={{ flex: 1 }} >
                <Tab.Navigator

                    screenOptions={{
                        tabBarActiveTintColor: 'black',
                        tabBarLabelStyle: { fontSize: 12 },
                        tabBarStyle: { backgroundColor: 'white' },
                    }}
                >

                    <Tab.Screen
                        name="Pending"
                        options={{ title: 'Pending', tabBarLabelStyle: { fontFamily: 'AvenirNextCyr-Medium', textTransform: 'capitalize' } }}
                    >
                        {() => <Pending pendingArray={pendingArray} navigation={navigation} />}
                    </Tab.Screen>


                    {/* <Tab.Screen
                        name="TourPlans"
                        component={TourPlans}
                        options={{ title: 'Pending Approval', tabBarLabelStyle: { fontFamily: 'AvenirNextCyr-Medium', textTransform: 'capitalize' } }}
                    /> */}
                    <Tab.Screen
                        name="Approved"
                        options={{ title: 'Approved', tabBarLabelStyle: { fontFamily: 'AvenirNextCyr-Medium', textTransform: 'capitalize' } }}
                    >
                        {() => <ApprovedPlans approvedArray={approvedArray} navigation={navigation} />}
                    </Tab.Screen>

                    {/* <Tab.Screen
                        name="ApprovedPlans"
                        component={ApprovedPlans}
                        options={{ title: 'Approved', tabBarLabelStyle: { fontFamily: 'AvenirNextCyr-Medium', textTransform: 'capitalize' } }}
                    /> */}

                </Tab.Navigator>
            </View>

            <Modal
                visible={isModalVisible}
                animationType="slide"
                transparent={true}

            >

                {/* Modal content */}
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 10, }}>
                    <View style={{ backgroundColor: 'white', padding: 20, width: '90%', marginHorizontal: 10, borderRadius: 10, elevation: 5 }}>
                        {/* new */}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                            <Text style={styles.modalTitle}>Request Report</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <AntDesign name='close' size={20} color={`black`} />
                            </TouchableOpacity>

                        </View>
                        <View style={styles.dropDownContainer}>
                            <Dropdown
                                style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                itemTextStyle={styles.selectedTextStyle}
                                inputSearchStyle={styles.inputSearchStyle}
                                iconStyle={styles.iconStyle}
                                data={optionData}
                                //search
                                maxHeight={400}
                                labelField="label"
                                valueField="value"
                                placeholder={!isFocus ? 'Select report type' : '...'}
                                //searchPlaceholder="Search..."
                                value={value}
                                onFocus={() => setIsFocus(true)}
                                onBlur={() => setIsFocus(false)}
                                onChange={item => {
                                    setValue(item.value);
                                    setIsFocus(false);
                                }}



                            // renderLeftIcon={() => (
                            //   <AntDesign
                            //     style={styles.icon}
                            //     color={isFocus ? 'blue' : 'black'}
                            //     name="Safety"
                            //     size={20}
                            //   />
                            // )}
                            />
                        </View>
                        <View style={styles.buttonview}>
                            <TouchableOpacity style={styles.buttonContainer} onPress={() => {


                                requestPDF();
                                //navigation.navigate('PDFViewer', { title: value });
                                //navigation.navigate('PDFViewer', { title: value });
                                // Alert.alert('Report Request', 'Check your email report sent sucessfully', [
                                //     { text: 'OK',onPress: () => navigation.navigate('PDFViewer') },
                                // ]);
                            }}>
                                <Text style={styles.buttonText}>Submit</Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                </View>
            </Modal>


            <Modal
                visible={isModalVisible1}
                animationType="slide"
                transparent={true}

            >

                {/* Modal content */}
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 10, }}>
                    <View style={{ backgroundColor: 'white', padding: 20, width: '90%', marginHorizontal: 10, borderRadius: 10, elevation: 5 }}>
                        {/* new */}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                            <Text style={styles.modalTitle}>Select User</Text>
                            <TouchableOpacity onPress={() => setModalVisible1(false)}>
                                <AntDesign name='close' size={20} color={`black`} />
                            </TouchableOpacity>

                        </View>
                        <View style={styles.dropDownContainer}>
                            <Dropdown
                                style={[styles.dropdown, isFocus1 && { borderColor: 'blue' }]}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                itemTextStyle={styles.selectedTextStyle}
                                inputSearchStyle={styles.inputSearchStyle}
                                iconStyle={styles.iconStyle}
                                data={filterData}
                                //search
                                maxHeight={400}
                                labelField="label"
                                valueField="value"
                                placeholder={!isFocus1 ? 'Select User type' : '...'}
                                //searchPlaceholder="Search..."
                                value={value1}
                                onFocus={() => setIsFocus1(true)}
                                onBlur={() => setIsFocus1(false)}
                                onChange={item => {
                                    setValue1(item.value);
                                    setIsFocus1(false);
                                }}



                            // renderLeftIcon={() => (
                            //   <AntDesign
                            //     style={styles.icon}
                            //     color={isFocus ? 'blue' : 'black'}
                            //     name="Safety"
                            //     size={20}
                            //   />
                            // )}
                            />
                        </View>
                        <View style={styles.buttonview}>
                            <TouchableOpacity style={styles.buttonContainer} onPress={applyFilter}>
                                <Text style={styles.buttonText}>Submit</Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                </View>
            </Modal>



            {/* <ActionButton
                    buttonColor={Colors.primary}
                    renderIcon={() => <Ionicons name='chatbox' color='#fff' size={20} />}
                    onPress={() => { navigation.navigate('UserList') }}
                    style={{ marginTop: 10 }}
                /> */}
        </View>
    )
}

export default SalesManagerHome

const styles = StyleSheet.create({
    itemContainer: {
        marginTop: 10,
        marginLeft: 16,
        marginRight: 16,
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
        fontFamily: 'AvenirNextCyr-Thin'
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