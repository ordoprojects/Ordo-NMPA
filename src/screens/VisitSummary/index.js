import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Colors from '../../constants/Colors';
import { AuthContext } from '../../Context/AuthContext';
import { FlatList } from 'react-native-gesture-handler';
import { renderPaymentItem, renderMiscTaskItem, renderShelfDisplayItem, renderSalesOrderItem, renderCompAnalysisItem } from './renderFunctions';


const boxesInfo = [
    {
        "competitor_analysis": { backgroundColor: 'red', textColor: 'black', displayName: "Comp. Analysis" },
        "payments": { backgroundColor: 'green', textColor: 'black', displayName: "Payments" },
        "miscellaneous_tasks": { backgroundColor: 'orange', textColor: 'black', displayName: "Misc. Tasks" },
        "return_orders": { backgroundColor: 'orange', textColor: 'black', displayName: "Return Orders" },
        "shelf_displays": { backgroundColor: 'orange', textColor: 'black', displayName: "Shelf Displays" },
        "so_orders": { backgroundColor: 'orange', textColor: 'black', displayName: "Sales Orders" }

    }
];

const VisitSummary = ({ route, navigation }) => {

    const { item } = route?.params;
    console.log("item", item)
    const boxKeys = Object.keys(boxesInfo[0]);
    const boxValues = Object.values(boxesInfo[0]);
    const [selectedBox, setSelectedBox] = useState(boxKeys[0]);
    const [visitsData, setVisitsData] = useState(boxKeys[0]);
    const [selectedData, setSelectedData] = useState([]);

    const { token, userData } = useContext(AuthContext);

    console.log(selectedBox)


    const getVisitSummary = async () => {

        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${userData.token}`);
        // myHeaders.append("Cookie", "csrftoken=RK01uE9J0xQQMWCjMG7ZfcSnMMQJI9Yl");

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            body: null,
            redirect: 'follow'
        };

        await fetch(`https://gsidev.ordosolution.com/api/sales_tp_checkinout/?sales_checkin=${item?.sales_checkin}&account_id=${item?.account_id}/`, requestOptions)
            .then(response => response.json())
            .then(result => {
                // console.log("result", result);
                setVisitsData(result)
            })
            .catch(error => console.log('api error', error));
    }

    useEffect(() => {
        getVisitSummary()
    }, [])


    const handleBoxPress = (key) => {
        setSelectedBox(key);
        setSelectedData(visitsData[key] || []);
    }

    const getRenderItemFunction = () => {
        switch (selectedBox) {
            case 'payments':
                return renderPaymentItem;
            case 'shelf_displays':
                return renderShelfDisplayItem;
            case 'miscellaneous_tasks':
                return renderMiscTaskItem;
            case 'so_orders':
                return renderSalesOrderItem;
            case 'competitor_analysis':
                return renderCompAnalysisItem;
            case 'return_orders':
                return renderSalesOrderItem;



            default:
                return ({ item }) => (
                    <View style={styles.dataContainer}>
                        <Text>No specific renderer for this box type.</Text>
                        <Text>{JSON.stringify(item)}</Text>
                    </View>
                );
        }
    }

    return (
        <View style={styles.rootContainer}>

            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <AntDesign name='arrowleft' size={25} color="black" />

                </TouchableOpacity>
                <Text style={styles.headerText}>Visit summary</Text>
            </View>

            <View style={styles.contentContainer}>
                {boxKeys.map((key, index) => {
                    const isSelected = selectedBox === key;
                    return (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.boxContainer,
                                { backgroundColor: isSelected ? Colors.primary : "#F3F5F9" }
                            ]}
                            onPress={() => handleBoxPress(key)}
                        >
                            {visitsData[key]?.length > 0 && <View style={[styles.badge, { backgroundColor: isSelected ? '#F3F5F9' : Colors.primary, borderWidth: 1, borderColor: Colors.primary }]}>
                                <Text style={{ fontFamily: 'AvenirNextCyr-Bold', color: isSelected ? Colors.primary : 'white' }}>{visitsData[key]?.length}</Text>
                            </View>}
                            <Image transition={false} source={require('../../assets/images/order.png')} style={{ width: 38, height: 38, resizeMode: 'cover', alignSelf: 'center', marginRight: 4, tintColor: isSelected ? 'white' : Colors.primary }} />
                            <Text style={[
                                styles.boxText,
                                { color: isSelected ? 'white' : Colors.primary }
                            ]}>
                                {boxValues[index].displayName}
                            </Text>
                        </TouchableOpacity>
                    )
                })}
            </View>
            <View style={{ flex: 1, marginTop: '4%' }}>
                <Text style={{ fontFamily: 'AvenirNextCyr-Medium', fontSize: 16, paddingHorizontal: '4%' }}>{boxesInfo[0][selectedBox].displayName}</Text>
                <View style={{ flex: 1 }}>
                    <FlatList
                        data={selectedData}
                        renderItem={getRenderItemFunction()}
                        key={(item) => item.id.toString()}
                    />
                </View>
            </View>
        </View>
    );
}

export default VisitSummary;

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        backgroundColor: '#F3F5F9',
    },
    headerContainer: {
        flexDirection: 'row',
        gap: 5,
        alignItems: 'center',
        padding: '4%',
    },
    headerText: {
        fontFamily: "AvenirNextCyr-Bold",
        fontSize: 18,
    },
    contentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: '4%',
        justifyContent: 'center',
        gap: 20,
        flexWrap: 'wrap',
    },
    boxContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '25%',
        borderWidth: 1,
        borderColor: Colors.primary,
        height: 85,
        padding: '4%',
        borderRadius: 15,
        position: 'relative'

    },
    boxText: {
        fontFamily: 'AvenirNextCyr-Medium',
        textAlign: 'center',
        color: Colors.primary,
        fontSize: 12
    },
    badge: {
        backgroundColor: 'orange',
        position: 'absolute',
        top: -5,
        right: -5,
        padding: '5%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
        width: 25,
        height: 25
    },
    elementsView: {
        backgroundColor: 'white',
        elevation: 10,
        borderRadius: 15,
        marginVertical: '4%',
        padding: '4%',
        marginHorizontal: '4%'
    }
});
