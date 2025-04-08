import React, { useState, useEffect, useContext } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView

} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { AuthContext } from "../../Context/AuthContext";
import Colors from "../../constants/Colors";
import Graphs from "../Graphs";
import { SelectCountry } from 'react-native-element-dropdown';


const bar_data = [
    {
        value: 'total_unpaid_amount',
        lable: 'Unpaid Purchases',

    },
    {
        value: 'total_paid_amount',
        lable: 'Paid Purchases',

    },
];


const area_data = [
    {
        value: 'total_unpaid_amount',
        lable: 'Unpaid Sales ',

    },
    {
        value: 'total_paid_amount',
        lable: 'Paid Sales ',

    },
];



const FinReports = ({ navigation }) => {
    const { userData } = useContext(AuthContext)

    const [barType, setBarType] = useState('total_paid_amount')
    const [areaType, setAreaType] = useState('total_paid_amount')
    const [pieType, setPieType] = useState('purchase_orders')


    const [barMode, setBarMode] = useState('quarterly_graph_values')
    const [areaMode, setAreaMode] = useState('quarterly_graph_values')

    const [pos, setPos] = useState([])
    const [loading, setLoading] = useState(false)
    const [areaChartData, setAreaChartData] = useState([]);
    const [filteredAreaData, setFilteredAreaData] = useState([]);

    const [barChartData, setBarChartData] = useState([]);
    const [filteredBarData, setFilteredBarData] = useState([]);
    const [pieChartData, setPieChartData] = useState([]);


    const getRandomColor = () => {
        // Generating random values for RGB, but keeping them in the higher range to ensure lighter colors
        const r = Math.floor(Math.random() * 100) + 155; // Red component
        const g = Math.floor(Math.random() * 100) + 155; // Green component
        const b = Math.floor(Math.random() * 100) + 155; // Blue component
        const color = `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
        return color;
    };


    useEffect(() => {
        fetchData();
    }, [userData.token])


    //forAreaChart
    useEffect(() => {
        if (areaChartData && Object.keys(areaChartData).length > 0 && areaType && areaMode) {
            const data = areaChartData[areaType][areaMode];
            setFilteredAreaData(data);
        }
    }, [areaChartData, areaType, areaMode]);


    //forBarChart
    useEffect(() => {
        if (barChartData && Object.keys(barChartData).length > 0 && barType && barMode) {
            const data = barChartData[barType][barMode];
            setFilteredBarData(data);
        }
    }, [barChartData, barType, barMode]);



    useEffect(() => {
        if (pos && pieType) {
            setPieChartData(pos)
        }

    }, [pieType, pos]);

    const fetchData = async () => {
        setLoading(true);
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${userData.token}`);

        var requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow",
        };

        try {
            const response = await fetch("https://gsidev.ordosolution.com/api/finance_dashboard/", requestOptions);
            const data = await response.json();

            const po_data = data.piechart.count.map((item) => ({
                label: item.label,
                value: item.value,
                color: getRandomColor(),
            }));

            setPos(po_data);
            setBarChartData(data.purchase)
            setAreaChartData(data.sales)
        } catch (error) {
            console.log("error", error);
        } finally {
            setLoading(false);
        }
    };


    const CustomBarHeading = ({ selected }) => {
        return (

            <View>
                <SelectCountry
                      style={[styles.dropdown,{width:180}]}
                    selectedTextStyle={styles.selectedTextStyle}
                    placeholderStyle={styles.placeholderStyle}
                    iconStyle={styles.iconStyle}
                    maxHeight={200}
                    value={barType}
                    data={bar_data}
                    valueField="value"
                    labelField="lable"
                    searchPlaceholder="Search..."
                    onChange={e => {
                        setBarType(e.value);
                    }}
                />
            </View>

        );
    };

    const CustomAreaHeading = ({ selected }) => {
        return (

            <View>
                <SelectCountry
                    style={styles.dropdown}
                    selectedTextStyle={styles.selectedTextStyle}
                    placeholderStyle={styles.placeholderStyle}
                    iconStyle={styles.iconStyle}
                    maxHeight={200}
                    value={areaType}
                    data={area_data}
                    valueField="value"
                    labelField="lable"
                    searchPlaceholder="Search..."
                    onChange={e => {
                        setAreaType(e.value);
                    }}
                />
            </View>

        );
    };


    const CustomBarSwitch = () => (
        <View>
            <View
                style={{ flexDirection: 'row', alignItems: 'center', }}
            >
                <TouchableOpacity
                    onPress={() => { setBarMode('quarterly_graph_values') }}
                    style={[styles.switchView, { backgroundColor: barMode == "quarterly_graph_values" ? Colors.primary : 'white', borderTopLeftRadius: 10, borderBottomLeftRadius: 10 }]}>
                    <Text style={{ color: barMode == "quarterly_graph_values" ? 'white' : 'black', fontFamily: 'AvenirNextCyr-Medium' }}>Q</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => { setBarMode('monthly_graph_values') }}
                    style={[styles.switchView, { backgroundColor: barMode == "monthly_graph_values" ? Colors.primary : 'white', borderTopRightRadius: 10, borderBottomRightRadius: 10 }]}>
                    <Text style={{ color: barMode == "monthly_graph_values" ? 'white' : 'black', fontFamily: 'AvenirNextCyr-Medium' }}>M</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const CustomAreaSwitch = () => (
        <View>
            <View
                style={{ flexDirection: 'row', alignItems: 'center', }}
            >
                <TouchableOpacity
                    onPress={() => { setAreaMode('quarterly_graph_values') }}
                    style={[styles.switchView, { backgroundColor: areaMode == "quarterly_graph_values" ? Colors.primary : 'white', borderTopLeftRadius: 10, borderBottomLeftRadius: 10 }]}>
                    <Text style={{ color: areaMode == "quarterly_graph_values" ? 'white' : 'black', fontFamily: 'AvenirNextCyr-Medium' }}>Q</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => { setAreaMode('monthly_graph_values') }}
                    style={[styles.switchView, { backgroundColor: areaMode == "monthly_graph_values" ? Colors.primary : 'white', borderTopRightRadius: 10, borderBottomRightRadius: 10 }]}>
                    <Text style={{ color: areaMode == "monthly_graph_values" ? 'white' : 'black', fontFamily: 'AvenirNextCyr-Medium' }}>M</Text>
                </TouchableOpacity>
            </View>
        </View>
    );


    return (
        <LinearGradient
            colors={Colors.linearColors}
            start={Colors.start}
            end={Colors.end}
            locations={Colors.location}
            style={{
                flex: 1,
            }}
        >
            <View style={styles.headerView}>
                <TouchableOpacity
                    onPress={() => {
                        navigation.goBack();
                    }}
                >
                    <Image
                        source={require("../../assets/images/Refund_back.png")}
                        style={{ height: 30, width: 30 }}
                    />
                </TouchableOpacity>
                <Text
                    style={{
                        fontFamily: "AvenirNextCyr-Medium",
                        fontSize: 19,
                        color: "white",
                    }}
                >
                    Finance Reports
                </Text>
                <Text> </Text>
            </View>


            <ScrollView style={styles.whiteView}>
                <Graphs pieData={pieChartData} pieChart={true} barChart={true} barData={filteredBarData} navigation={navigation} moduleName="Finance" areaChart={true} areaChartData={filteredAreaData}  >
                    {{
                        barHeading: <CustomBarHeading selected={barType} />,
                        areaHeading: <CustomAreaHeading selected={areaType} />,
                        customAreaSwitch: <CustomAreaSwitch />,
                        customBarSwitch: <CustomBarSwitch />
                    }}
                </Graphs>
            </ScrollView>
        </LinearGradient>
    );
};

export default FinReports;

const styles = StyleSheet.create({
    segmentView: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderRadius: 20,
        borderColor: "#fff",
        marginHorizontal: "9%",
    },
    segmentButton: {
        flex: 1,
        paddingVertical: "3%",
        borderRadius: 19,
        backgroundColor: "transparent",
    },
    selectedSegment: {
        backgroundColor: "#fff",
    },
    segmentButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
        textAlign: "center",
    },
    selectedText: {
        color: Colors.primary,
    },
    headerView: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        height: 60,
        paddingHorizontal: "4%",
        gap: 10
    },
    whiteView: {
        flex: 1,
        backgroundColor: "white",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        marginTop: "4%",
    },
    switchView: {
        borderWidth: 0.5,
        borderColor: 'black',
        paddingHorizontal: 16,
        paddingVertical: 2
    },
    dropdown: {
        height: 40,
        width: 150,
        backgroundColor: '#EEEEEE',
        borderRadius: 22,
        paddingHorizontal: 8,
    },

    placeholderStyle: {
        fontSize: 16,
        color: "red",
    },
    selectedTextStyle: {
        fontSize: 16,
        marginLeft: 8,
        color: "red",
    },
    iconStyle: {
        width: 20,
        height: 20,

    },
});
