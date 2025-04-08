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
        value: 'total_sales',
        lable: 'Sales',

    },
    {
        value: 'total_order',
        lable: 'Count',

    },
];

const pie_data = [
    {
        value: 'order_report',
        lable: 'Orders',

    },
    {
        value: 'return_report',
        lable: 'Returns',

    },
];


const OrderReports = ({ navigation }) => {
    const { userData } = useContext(AuthContext)
    const [orders, setOrders] = useState([])
    const [barType, setBarType] = useState('total_order')
    const [pieType, setPieType] = useState('order_report')
    const [barMode, setBarMode] = useState('quarterly_graph_values')
    const [returns, setReturns] = useState([]);
    const [loading, setLoading] = useState(false)
    const [totalOrders, setTotalOrders] = useState([])

    const [barChartData, setBarChartData] = useState([]);
    const [pieChartData, setPieChartData] = useState([]);






    const getRandomColor = () => {
        // Generating random values for RGB, but keeping them in the higher range to ensure lighter colors
        const r = Math.floor(Math.random() * 100) + 155; // Red component
        const g = Math.floor(Math.random() * 100) + 155; // Green component
        const b = Math.floor(Math.random() * 100) + 155; // Blue component
        // Converting RGB to HEX
        const color = `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
        return color;
    };


    useEffect(() => {
        fetchPieData();
        fetchBardata();
    }, [userData.token])

    useEffect(() => {
        if (totalOrders && Object.keys(totalOrders).length > 0 && barType && barMode) {
            console.log("test", totalOrders)
            const data = totalOrders[barType][barMode];
            setBarChartData(data);
        }
    }, [totalOrders, barType, barMode]);

    useEffect(() => {
        if (orders && returns && pieType) {
            if (pieType == "order_report") {
                setPieChartData(orders)
            } else {
                setPieChartData(returns)

            }
        }
    }, [orders, pieType]);

    const fetchPieData = async () => {
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
            const response = await fetch("https://gsidev.ordosolution.com/api/order_manage_dashboard/", requestOptions);
            const data = await response.json();

            const ordersData = data.order_report.graph_values.map((item) => ({
                label: item.label,
                value: item.value, // Replace some_property with the property containing the value
                color: getRandomColor(),
            }));

            const returnsData = data.return_report.graph_values.map((item) => ({
                label: item.label,
                value: item.value,// Replace some_property with the property containing the value
                color: getRandomColor(),
            }));

            setOrders(ordersData);
            setReturns(returnsData);
        } catch (error) {
            console.log("error", error);
        } finally {
            setLoading(false);
        }
    };



    const fetchBardata = async () => {
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
            const response = await fetch("https://gsidev.ordosolution.com/api/order_manage_dashboard2/", requestOptions);
            const data = await response.json();
            setTotalOrders(data);
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
                    style={styles.dropdown}
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

    const CustomPieHeading = ({ selected }) => {
        return (

            <View>
                <SelectCountry
                    style={styles.dropdown}
                    selectedTextStyle={styles.selectedTextStyle}
                    placeholderStyle={styles.placeholderStyle}
                    iconStyle={styles.iconStyle}
                    maxHeight={200}
                    value={pieType}
                    data={pie_data}
                    valueField="value"
                    labelField="lable"
                    searchPlaceholder="Search..."
                    onChange={e => {
                        setPieType(e.value);
                    }}
                />
            </View>

        );
    };

    const CustomSwitch = () => (
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
                    Order Reports
                </Text>
                <Text> </Text>

            </View>

            <ScrollView style={styles.whiteView}>

                <Graphs pieData={pieChartData} pieChart={true} pieChartHeading="Orders" barChart={true} barData={barChartData} moduleName="Orders" navigation={navigation}>
                    {/* Custom component as children */}
                    {{
                        barHeading: <CustomBarHeading selected={barType} />,
                        pieHeading: <CustomPieHeading selected={pieType} />,
                        customBarSwitch: <CustomSwitch />
                    }}
                </Graphs>

            </ScrollView>
        </LinearGradient>
    );
};

export default OrderReports;

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
        color:'black'
    },
    selectedTextStyle: {
        fontSize: 16,
        marginLeft: 8,
        color:'black'
    },
    iconStyle: {
        width: 20,
        height: 20,
        color:'black'
    },
});
