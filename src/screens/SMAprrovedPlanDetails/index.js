import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Modal, Image, TextInput, ScrollView, Alert } from 'react-native'
import React, { useContext, useState } from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign';
import Colors from '../../constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../../Context/AuthContext';
import Timeline from 'react-native-timeline-flatlist'
import moment from 'moment';
import { Dropdown } from 'react-native-element-dropdown';
import { ProgressDialog } from 'react-native-simple-dialogs';
const SMApprovedPlanDetails = ({ navigation, route }) => {

    // const rejectAlert = () => {
    //     Alert.alert('Confirmation', 'Are you sure, You want to Reject?', [
    //         {
    //             text: 'Cancel',
    //             onPress: () => console.log('Cancel Pressed'),
    //             style: 'cancel',
    //         },
    //         { text: 'OK', onPress: () => { reject() } },
    //     ]);
    // }
    // new
    const width = Dimensions.get('window').width
    const [dealerArray, setDealerArray] = useState([]);
    const flData = [
        {
            image: 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aHVtYW58ZW58MHx8MHx8fDA%3D&w=1000&q=80',
            name: 'Walmart',
            frequencyNumber: 1,
            visitedNumber: 1
        },
        {
            image: 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aHVtYW58ZW58MHx8MHx8fDA%3D&w=1000&q=80',
            name: 'Fantasy Light Bookstore',
            frequencyNumber: 1,
            visitedNumber: 1
        },
        {
            image: 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aHVtYW58ZW58MHx8MHx8fDA%3D&w=1000&q=80',
            name: 'E G India',
            frequencyNumber: 1,
            visitedNumber: 1
        },
        {
            image: 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aHVtYW58ZW58MHx8MHx8fDA%3D&w=1000&q=80',
            name: 'Silicon Electronics',
            frequencyNumber: 1,
            visitedNumber: 1
        },
        {
            image: 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aHVtYW58ZW58MHx8MHx8fDA%3D&w=1000&q=80',
            name: 'E G India',
            frequencyNumber: 1,
            visitedNumber: 1
        },
        {
            image: 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aHVtYW58ZW58MHx8MHx8fDA%3D&w=1000&q=80',
            name: 'Silicon Electronics',
            frequencyNumber: 1,
            visitedNumber: 1
        },
        {
            image: 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aHVtYW58ZW58MHx8MHx8fDA%3D&w=1000&q=80',
            name: 'E G India',
            frequencyNumber: 1,
            visitedNumber: 1
        },
        {
            image: 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aHVtYW58ZW58MHx8MHx8fDA%3D&w=1000&q=80',
            name: 'Silicon Electronics',
            frequencyNumber: 1,
            visitedNumber: 1
        },
        {
            image: 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aHVtYW58ZW58MHx8MHx8fDA%3D&w=1000&q=80',
            name: 'E G India',
            frequencyNumber: 1,
            visitedNumber: 1
        },
        {
            image: 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aHVtYW58ZW58MHx8MHx8fDA%3D&w=1000&q=80',
            name: 'Silicon Electronics',
            frequencyNumber: 1,
            visitedNumber: 1
        },
        {
            image: 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aHVtYW58ZW58MHx8MHx8fDA%3D&w=1000&q=80',
            name: 'E G India',
            frequencyNumber: 1,
            visitedNumber: 1
        },
        {
            image: 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aHVtYW58ZW58MHx8MHx8fDA%3D&w=1000&q=80',
            name: 'Silicon Electronics',
            frequencyNumber: 1,
            visitedNumber: 1
        },
        {
            image: 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aHVtYW58ZW58MHx8MHx8fDA%3D&w=1000&q=80',
            name: 'E G India',
            frequencyNumber: 1,
            visitedNumber: 1
        },
        {
            image: 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aHVtYW58ZW58MHx8MHx8fDA%3D&w=1000&q=80',
            name: 'Silicon Electronics',
            frequencyNumber: 1,
            visitedNumber: 1
        },
        {
            image: 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aHVtYW58ZW58MHx8MHx8fDA%3D&w=1000&q=80',
            name: 'E G India',
            frequencyNumber: 1,
            visitedNumber: 1
        },
        {
            image: 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aHVtYW58ZW58MHx8MHx8fDA%3D&w=1000&q=80',
            name: 'Silicon Electronics',
            frequencyNumber: 1,
            visitedNumber: 1
        }, {
            image: 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aHVtYW58ZW58MHx8MHx8fDA%3D&w=1000&q=80',
            name: 'E G India',
            frequencyNumber: 1,
            visitedNumber: 1
        },
        {
            image: 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aHVtYW58ZW58MHx8MHx8fDA%3D&w=1000&q=80',
            name: 'Silicon Electronics',
            frequencyNumber: 1,
            visitedNumber: 1
        },
    ]
    //new
    const { item } = route.params;
    const [data, setData] = useState('');
    //const [dealerArray, setDealerArray] = useState([]);
    const { token } = useContext(AuthContext);

    //console.log("item", item)
    const getPlanDetails = () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "__user_id__": token,
            "__id__": item?.id
        });

        console.log(JSON.stringify({
            "__user_id__": token,
            "__id__": item?.id
        }))

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("https://dev.ordo.primesophic.com/get_tour_plan_detail.php", requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log('plan details data 123 ', result)
                setData(result?.status[0]);
                console.log('gg', data);
                result?.status[0].dealer_array.forEach(item => {
                    console.log("item", item)
                });
                setDealerArray(result?.status[0].dealer_array)
            })
            .catch(error => console.log('api error', error));
    }

    const approvedPlanAccepted = (status) => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "__id__": item?.id,
            "__ordo_user_full_name__ ": item?.ordo_user_name,
            "__status__": status
        });

        console.log(JSON.stringify({
            "__id__": item?.id,
            "__ordo_user_full_name__ ": item?.ordo_user_name
        }))

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("https://dev.ordo.primesophic.com/set_approve_tourplan.php", requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log('Accepted Data', result)
                console.log(result.status)
                if (result.status == "200") {
                    Alert.alert('Confirmation', `Plan ${status} sucessfully`, [
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
    useFocusEffect(
        React.useCallback(() => {
            getPlanDetails();
            getReportData();

        }, [])
    );

    const [reportData, setReportData] = useState([]);


    const getReportData = async () => {

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "__name__": item?.name
        });
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
        fetch("https://dev.ordo.primesophic.com/get_clock_in_for_tourplan.php", requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log('graph data', result);
                //temp label & value array
                let tmpData = [];

                for (var key in result) {
                    console.log(key, result[key]);
                    //checking value is not mepty
                    if (result[key] != null) {
                        let valArray = result[key];
                        console.log("val", valArray)
                        if (valArray.length > 0) {
                            valArray.forEach(ele => {
                                tmpData.push({
                                    time: moment(ele?.check_in_time).format("DD-MM-YYYY"),
                                    title: ele?.account_name,
                                    purpose: ele?.purpose_of_visit,
                                    description: ele?.description
                                })

                            });
                        }
                    }
                }
                console.log("temp array", tmpData)
                if (tmpData.length > 0) {
                    setReportData(tmpData);
                }
            })
            // .then(result => {
            //     console.log('graph data', result);
            //     //temp label & value array
            //     let tmpData = [];
            //     for (var key in result) {
            //         console.log(key, result[key]);
            //         //checking value is not mepty
            //         if (result[key] != null) {
            //             let val = result[key];
            //             console.log("val", val)
            //             tmpData.push({
            //                 time: moment(val[0]?.check_in_time).format("DD-MM-YYYY"),
            //                 title: val[0]?.account_name,
            //                 purpose: val[0]?.purpose_of_visit,
            //                 description: val[0]?.description
            //             })
            //         }

            //     }
            //     console.log("temp array", tmpData)
            //     setReportData(tmpData);



            // })
            .catch(error => console.log('error', error));
    }



    //______________________________________________________
    //Report logic
    const [data2, setData2] = useState([
        {
            time: '07-07-23',
            title: 'Walmart',
            purpose: 'Secondary Offtake',
            description: 'Testing abc  jdfjvifdjvifdjidufh ui uiefhubh. ',
        },
        {
            time: '07-07-23',
            title: 'EG',
            purpose: 'Competitor analysis',
            description: 'hfih ih iguh uirgh ugrih iugh uirgh g  ',

        },
        {
            time: '07-07-23',
            title: 'Fanatasy Book Store',
            purpose: 'Return',
            description: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit..',
        },
        {
            time: '07-07-23',
            title: 'Silicon Electronics',
            purpose: 'Return',
            description: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.',
        },
        // {
        //     time: '07-07-2023',
        //     title: 'Watch Soccer',
        //     purpose: 'Market Intelligence',
        //     description: 'Team sport played between two teams of eleven players with a spherical ball. ',

        // },
        // {
        //     time: '07-07-2023',
        //     title: 'Watch Soccer',
        //     purpose: 'Market Intelligence',
        //     description: 'Team sport played between two teams of eleven players with a spherical ball. ',

        // },
        // {
        //     time: '07-07-2023',
        //     title: 'Watch Soccer',
        //     purpose: 'Market Intelligence',
        //     description: 'Team sport played between two teams of eleven players with a spherical ball. ',

        // },


    ])

    const renderDetail = (rowData, sectionID, rowID) => {
        let title = <Text style={[styles.title]}>{rowData.title}</Text>
        var desc = null
        if (rowData.description)
            desc = (
                <View style={styles.descriptionContainer}>
                    <Text style={{ fontSize: 13, fontFamily: 'AvenirNextCyr-Thin' }}>{rowData.purpose.replace(/\^/g, '').split(',').join(',')}</Text>
                    <Text style={{ fontSize: 12, fontFamily: 'Poppins-Italic', color: 'grey' }}>{rowData.description}</Text>
                </View>
            )

        return (
            <View style={{ flex: 1 }}>
                {title}
                {desc}
            </View>
        )
    }

    //request pdf hooks
    const [isModalVisible, setModalVisible] = useState(false);
    const [value, setValue] = useState(null);
    const [isFocus, setIsFocus] = useState(false);

    const optionData = [
        { label: 'Daily', value: 'Daily' },
        { label: 'Weekly', value: 'Weekly' },
        { label: 'Monthly', value: 'Monthly' },
        { label: 'Quarterly', value: 'Quarterly' },
    ]
    const [loading, setLoading] = useState(false);

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




    return (
        <View style={styles.container}>

            <View style={styles.container}>
                <View style={{ ...styles.headercontainer }}>
                    <View style={{ flex: 0.9, flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <AntDesign name='arrowleft' size={25} color={Colors.black} />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Plan Details</Text>
                    </View>
                    {/* <TouchableOpacity style={{ flex: 0.1 }} onPress={() => {
                        setValue(null);
                        setModalVisible(true)
                    }
                    }>
                        <AntDesign name='pdffile1' size={25} color={Colors.black} />

                    </TouchableOpacity> */}
                </View>


                <View style={{ ...styles.contentContainer, flexDirection: 'row' }}>
                    <View style={{ flex: 1, }}>
                        <Text style={{ ...styles.planText }}>Name  </Text>
                        <Text style={{ ...styles.value, color: Colors.black }} >{item.ordo_user_name}</Text>
                    </View>
                    <View style={{ flex: 1, marginLeft: 10 }}>
                        <Text style={styles.planText}>Plan Name </Text>
                        <Text style={{ ...styles.value, color: Colors.primary, fontFamily: 'AvenirNextCyr-Medium', textTransform: 'capitalize' }}>{data?.name}</Text>
                    </View>
                </View>
                <View style={{ ...styles.contentContainer, flexDirection: 'row' }}>
                    <View style={{ flex: 1, }}>
                        <Text style={{ ...styles.planText }}>Created Date  </Text>
                        <Text style={styles.value} >{moment(data?.date_entered).format('DD-MM-YY')}</Text>
                    </View>
                    <View style={{ flex: 1, marginLeft: 10 }}>
                        <Text style={styles.planText}>No. of Dealers  </Text>
                        <Text style={styles.value}>#{data?.dealer_count}</Text>
                    </View>
                </View>
                <View style={{ ...styles.contentContainer, flexDirection: 'row', marginBottom: 10 }}>
                    <View style={{ flex: 1, }}>
                        <Text style={{ ...styles.planText }}>Region  </Text>
                        <Text style={styles.value} >{data?.region}</Text>
                    </View>
                    <View style={{ flex: 0.95}}>
                        <Text style={styles.planText}>Duration  </Text>
                        <Text style={styles.value}>{moment(data.start_date).format('DD-MM-YY')} To {moment(data.end_date).format('DD-MM-YY')}  </Text>
                    </View>
                </View>

                {item.status == 'Approved' && <View style={{ ...styles.contentContainer, flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                    <View style={{ flex: 1, }}>
                        <Text style={styles.planText}>Approved By</Text>
                        <Text style={styles.value}>{data?.approved_by}</Text>
                    </View>
                    <View style={{ flex: 1, marginLeft: 10 }}>
                        <Text style={styles.planText}>Approved Date  </Text>
                        <Text style={styles.value} >{moment(data?.approved_date).format('DD-MM-YY')}</Text>
                    </View>
                </View>}


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
                <Text style={styles.planText}>Client List</Text>
                {/* {dealerArray.length > 0 &&  */}
                <View>
                    <View style={{ flexDirection: "row", backgroundColor: '#F1F2F1', borderColor: 'grey', borderBottomWidth: 1, alignItems: 'center', justifyContent: 'center' }} >
                        <View style={{ flex: 2.4 }}>
                            <Text style={{ fontFamily: 'AvenirNextCyr-Medium', color: '#000', fontSize: 12, textAlign: 'center' }}>Dealer Name</Text>
                        </View>
                        <View style={{ flex: 1, alignItems: 'center' }}>
                            <Text style={{ fontFamily: 'AvenirNextCyr-Medium', color: '#000', fontSize: 12 }}>Freq.</Text>
                        </View>
                        <View style={{ flex: 1, alignItems: 'center' }}>
                            <Text style={{ fontFamily: 'AvenirNextCyr-Medium', color: '#000', fontSize: 12 }}>    Visits Completed</Text>
                        </View>
                    </View>

                    {
                        dealerArray.length > 0 && dealerArray.map(item => {
                            return (
                                <View style={{ flexDirection: 'row', }}>
                                    <View style={{ flex: 2.4 }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            {/* <Image source={{ uri: item?.account_profile_pic }} style={{ height: 20, width: 20, marginVertical: 5, marginLeft: 10 }} /> */}
                                            <Image source={{ uri: item?.account_profile_pic }} style={{ height: 20, width: 20, marginVertical: 5, marginLeft: 10 }} />
                                            <Text style={{ fontFamily: 'AvenirNextCyr-Medium', fontSize: 12, color: '#000', marginLeft: 14 }}> {item.name}</Text>
                                        </View>
                                    </View>
                                    <View style={{ flex: 0.4, alignItems: 'flex-start', marginTop: 2 }}>
                                        <Text style={{ fontFamily: 'AvenirNextCyr-Thin', fontSize: 12, color: '#000' }}>{item.no_of_visit}</Text>
                                        {/* <Text style={{ fontFamily: 'AvenirNextCyr-Thin', fontSize: 12, color: '#000' }}>{item.frequencyNumber}</Text> */}
                                    </View>
                                    <View style={{ flex: 1, alignItems: 'center' }}>
                                        <Text style={{ fontFamily: 'AvenirNextCyr-Thin', fontSize: 12, color: '#000' }}>{item.completed_visit}</Text>
                                        {/* <Text style={{ fontFamily: 'AvenirNextCyr-Thin', fontSize: 12, color: '#000' }}>{item.visitedNumber}</Text>  */}
                                    </View>
                                </View>
                            )
                        })
                    }


                    {/* <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity style={{ backgroundColor: 'red', borderRadius: 30, flex: 1, paddingVertical: 10 }} onPress={() => approvedPlanAccepted('Rejected')}>
                            <Text style={{ color: 'white', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium', textAlign: 'center' }}>Reject</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ backgroundColor: Colors.primary, borderRadius: 30, flex: 1, paddingVertical: 10, marginLeft: 10 }} onPress={() => approvedPlanAccepted('Approved')}>
                            <Text style={{ color: 'white', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium', textAlign: 'center' }}>Accept</Text>
                        </TouchableOpacity>
                    </View> */}
                </View>
                {reportData.length > 0 && <Text style={{...styles.planText,marginTop:10}}>Reports</Text>}
                {reportData.length > 0 && <Timeline
                    style={styles.list}
                    data={reportData}
                    circleSize={20}
                    circleColor='rgba(0,0,0,0)'
                    lineColor={Colors.primary}
                    timeContainerStyle={{ minWidth: 80, }}
                    timeStyle={{ textAlign: 'center', backgroundColor: Colors.primary, color: 'white', padding: 5, borderRadius: 4 }}
                    options={{
                        style: { paddingTop: 5 },
                        showsVerticalScrollIndicator: false
                    }}
                    innerCircle={'icon'}
                    renderDetail={renderDetail}
                    iconDefault={require('../../assets/images/ordologo.png')}
                />}
                {/* } */}
                {/* new */}
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
        </View>


    )
}

export default SMApprovedPlanDetails

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 12,
        backgroundColor: '#fff'
    },
    contentContainer: {
        //marginLeft: 10,
        //marginTop: 5
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

    },
    list: {
        flex: 1,
        //marginTop: 20,
    },
    title: {
        marginTop: -10,
        fontSize: 14,
        fontFamily: 'AvenirNextCyr-Medium',
        //fontWeight:'500'
    },
    descriptionContainer: {
        //flexDirection: 'row',
        //paddingRight: 50
        //marginTop:5
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 25
    },
    textDescription: {
        marginLeft: 10,
        color: 'gray'
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
    buttonTextStyle: {
        color: '#fff',
        fontFamily: 'AvenirNextCyr-Medium',
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

})







// import React, { useState } from 'react';
// import {
//     StyleSheet,
//     Text,
//     View,
//     Image
// } from 'react-native';
// import Timeline from 'react-native-timeline-flatlist'
// import Colors from '../../constants/Colors';

// const SMApprovedPlanDetails = () => {
//     const [data, setData] = useState([
//         {
//             time: '07-07-2023',
//             title: 'Walmart',
//             purpose: 'Market Intelgience',
//             description: 'Testing abc  jdfjvifdjvifdjidufh ui uiefhubh. ',
//         },
//         {
//             time: '07-08-2023',
//             title: 'EG',
//             purpose: 'Competitor analysis',
//             description: 'hfih ih iguh uirgh ugrih iugh uirgh g  ',

//         },
//         {
//             time: '07-09-2023',
//             title: 'Fanatasy Book Store',
//             purpose: 'Return',
//             description: 'Badminton is a racquet sport played using racquets to hit a shuttlecock across a net.',
//         },
//         {
//             time: '07-12-2023',
//             title: 'Watch Soccer',
//             purpose: 'Market Intelgience',
//             description: 'Team sport played between two teams of eleven players with a spherical ball. ',

//         },


//     ])

//     const renderDetail = (rowData, sectionID, rowID) => {
//         let title = <Text style={[styles.title]}>{rowData.title}</Text>
//         var desc = null
//         if (rowData.description)
//             desc = (
//                 <View style={styles.descriptionContainer}>
//                     <Text style={{ fontSize: 13, fontFamily: 'AvenirNextCyr-Thin' }}>{rowData.purpose}</Text>
//                     <Text style={{ fontSize: 12, fontFamily: 'Poppins-Italic', color: 'grey' }}>{rowData.description}</Text>
//                 </View>
//             )

//         return (
//             <View style={{ flex: 1 }}>
//                 {title}
//                 {desc}
//             </View>
//         )
//     }

//     return (
//         <View style={styles.container}>
//             <Timeline
//                 style={styles.list}
//                 data={data}
//                 circleSize={20}
//                 circleColor='rgba(0,0,0,0)'
//                 lineColor={Colors.primary}
//                 timeContainerStyle={{ minWidth: 80, }}
//                 timeStyle={{ textAlign: 'center', backgroundColor: Colors.primary, color: 'white', padding: 5, borderRadius: 4 }}
//                 options={{
//                     style: { paddingTop: 5 }
//                 }}
//                 innerCircle={'icon'}
//                 renderDetail={renderDetail}
//                 iconDefault={require('../../assets/images/ordologo.png')}
//             />
//         </View>

//     )
// }

// export default SMApprovedPlanDetails

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         padding: 20,
//         paddingTop: 65,
//         backgroundColor: 'white'
//     },
//     list: {
//         flex: 1,
//         marginTop: 20,
//     },
//     title: {
//         marginTop: -10,
//         fontSize: 14,
//         fontFamily: 'AvenirNextCyr-Medium',
//         //fontWeight:'500'
//     },
//     descriptionContainer: {
//         //flexDirection: 'row',
//         //paddingRight: 50
//         //marginTop:5
//     },
//     image: {
//         width: 50,
//         height: 50,
//         borderRadius: 25
//     },
//     textDescription: {
//         marginLeft: 10,
//         color: 'gray'
//     }
// });