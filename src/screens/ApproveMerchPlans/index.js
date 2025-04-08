import { ScrollView, Text, View, TouchableOpacity, Image, FlatList, TextInput, Alert } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import styles from './style'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Colors from '../../constants/Colors'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { cameraPermission } from '../../utils/Helper';
import { AuthContext } from '../../Context/AuthContext';
import ImageResizer from '@bam.tech/react-native-image-resizer'
import { ProgressDialog } from 'react-native-simple-dialogs';
import { Dropdown } from 'react-native-element-dropdown'
import RNFS from 'react-native-fs';
import moment from 'moment'
import { useFocusEffect } from '@react-navigation/native';
const ApproveMerchPlans = ({ navigation, route }) => {

    const { token, dealerData } = useContext(AuthContext);

    const [approvedPlans, setApprovedPlans] = useState('');
    const [otherPlans, setOtherPlans] = useState('');


    const getPlans = () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");


        var raw = JSON.stringify({
            "__user_id__": token,
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("https://dev.ordo.primesophic.com/get_merchandiser_tour_plan.php", requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log('get plans data \n', result.merchandiser_tour_plan)
                let approved = [];  //approved plans
                let completed = []
                let other = [];  //reject,pending plans  all are other plans

                result?.merchandiser_tour_plan.forEach((item) => {
                    console.log("item", item)
                    //approved
                    if (item?.status == 'Approved') {
                        approved.push(item);
                    }
                    //completed
                    else if (item?.status == 'Completed') {
                        completed.push(item)
                    }
                    //other
                    else {
                        other.push(item)
                    }

                })
                console.log("approved", approved)
                //sorting approved plans array
                setApprovedPlans(approved)

                // //sorting completed  plans array
                // let sortedarray2 = completed.sort((a, b) => (a.start_date < b.start_date) ? 1 : -1)
                // setCompletedPlans(sortedarray2)

                //sorting other  plans array
                //let sortedarray3 = other.sort((a, b) => (a.start_date < b.start_date) ? 1 : -1)
                setOtherPlans(other)
            })
            .catch(error => console.log('get tour plan error', error));
        // var myHeaders = new Headers();
        // myHeaders.append("Content-Type", "application/json");

        // var raw = JSON.stringify({
        //   "__user_id__": "1878e60a-fe1c-0d00-e8b6-63119c1882aa",
        //   "__id__": "87cc5a45-c1fe-858c-1bca-647441f70493"
        // });

        // var requestOptions = {
        //   method: 'GET',
        //   headers: myHeaders,
        //   body: raw,
        //   redirect: 'follow'
        // };

        // fetch("https://dev.ordo.primesophic.com/get_tour_plan_detail.php", requestOptions)
        //   .then(response => response.json())
        //   .then(result => console.log(result))
        //   .catch(error => console.log('error', error));


    }


    useFocusEffect(
        React.useCallback(() => {
            getPlans();
        }, [])
    );








    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={{ ...styles.headercontainer }}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 5 }}>
                    <AntDesign name='arrowleft' size={25} color={Colors.black} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Approve Merchant Plans</Text>
            </View>
            <ScrollView>
                {/* <View style={styles.planView} activeOpacity={0.5}>
                    <Text style={styles.planText}>Pending Plans</Text>
                </View> */}
                {otherPlans.length > 0 && otherPlans.map(item => {
                    return (
                        <TouchableOpacity
                            onPress={() => navigation.navigate('MerchPlanDetails', { item: item })}
                            style={styles.itemContainer}
                        >
                            <View style={styles.orderDataContainer}>

                                <View>
                                    {/* <Text style={styles.planHeading}>Active Tour Plans</Text> */}

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
                                            <Text style={{ ...styles.title2, color: Colors.black }}>{item?.name} </Text>
                                        </View>


                                    </View>

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
                                                source={require('../../assets/images/user.png')} />
                                            <Text style={{ ...styles.title3, color: 'grey' }}>{item.ordo_user_name} </Text>
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
                                        <Text style={{ ...styles.title2, color: Colors.primary }}>{item?.account_name} </Text>
                                    </View>



                                    <View style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        marginTop: 3,
                                    }}>
                                        <Image
                                            style={{ marginRight: 10, height: 15, width: 15, resizeMode: 'contain' }}
                                            source={require('../../assets/images/duration.png')} />
                                        <Text style={{ ...styles.text, color: 'black', fontFamily: 'AvenirNextCyr-Thin' }}>{moment(item.start_date).format('DD-MM-YYYY')} To {moment(item.end_date).format('DD-MM-YYYY')}</Text>
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
                                        //onPress={() => handlePlan(item)}
                                        >
                                            <Text style={{ fontSize: 14, color: Colors.white, fontFamily: 'AvenirNextCyr-Thin', color: '#fff' }}>Details</Text>
                                        </TouchableOpacity> */}
                                    </View>

                                </View>
                            </View>

                        </TouchableOpacity>)
                })
                }
            </ScrollView>

        </View>


    )
}

export default ApproveMerchPlans

