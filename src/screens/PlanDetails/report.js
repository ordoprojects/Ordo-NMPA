import { StyleSheet, Text, View, TouchableOpacity, Dimensions, FlatList, Image, TextInput, ScrollView, Alert } from 'react-native'
import React, { useContext, useState } from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign';
import Colors from '../../constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../../Context/AuthContext';
import Timeline from 'react-native-timeline-flatlist'
import moment from 'moment';

const Report = ({ navigation, route }) => {

    const { item } = route.params;

  const { token, userData } = useContext(AuthContext);
    

    useFocusEffect(
        React.useCallback(() => {
            getReportData();

        }, [])
    );

    const [reportData, setReportData] = useState([]);
    const [noReport, setNoReport] = useState(false);

    // console.log("hfdskfjhsdkjghsjkghskjzg",item)

    const getReportData = async () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${userData.token}`);

        var raw = JSON.stringify({
            "__name__": item?.id
        });
        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            // body: raw,
            redirect: 'follow'
        };
        fetch(`https://gsidev.ordosolution.com/api/tp_activities/?tourplan_id=${item?.id}`, requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log('graph data', result,item?.id);
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
                                    description: ele?.report
                                })

                            });
                        }
                    }
                }
                console.log("temp array", tmpData)
                if (tmpData.length > 0) {
                    setReportData(tmpData);
                }
                else {
                    setNoReport(true);
                }




            })
            .catch(error => console.log('error', error));
    }



    const renderDetail = (rowData, sectionID, rowID) => {
        let sQuote = rowData.description ? rowData.description.replaceAll('&#039;', `'`) : "";
        let dQuote = sQuote ? sQuote.replaceAll('&quot;', `"`) : "";
        let title = <Text style={[styles.title]}>{rowData.title}</Text>;
        
        var desc = null
        if (rowData.purpose)
            desc = (
                <View style={styles.descriptionContainer}>
                    <Text style={{ fontSize: 13, fontFamily: 'AvenirNextCyr-Medium' }}>{rowData.purpose}</Text>
                    <Text style={{ fontSize: 12, fontFamily: 'Poppins-Italic', color: 'grey' }}>{dQuote}</Text>
                </View>
            )

        return (
            <View style={{ flex: 1 }}>
                {title}
                {desc}
            </View>
        )
    }

    const noReportFound = () => {
        return (
            <View style={styles.noReport}>
                <Text style={styles.noReportText}>No report found</Text>
            </View>
        )
    }



    return (
        <View style={styles.container}>

            <View style={{ ...styles.headercontainer }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <AntDesign name='arrowleft' size={25} color={Colors.black} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Report</Text>
            </View>
            {noReport && noReportFound()}
            {reportData.length > 0 && <Timeline
                style={styles.list}
                data={reportData}
                circleSize={35}
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
                iconDefault={require('../../assets/images/ordologo-bg.png')}
            />}


        </View>
    )
}

export default Report

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 12,
        backgroundColor: '#fff'
    },
    contentContainer: {
        //marginLeft: 10,
        marginVertical: 10
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
        marginBottom: 10
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
        color:'black'
        //fontWeight:'500'
    },
    descriptionContainer: {
        flexDirection: 'column',
        paddingRight: 50,
        marginTop:5
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
    noReport: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    noReportText: {
        fontSize: 16,
        color: Colors.black,
        fontFamily: 'AvenirNextCyr-Medium'
    }

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