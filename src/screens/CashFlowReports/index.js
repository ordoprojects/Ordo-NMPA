import React, { useState, useEffect, useContext } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    FlatList,
    ScrollView,
    Modal,
    Button,
    ActivityIndicator,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { AuthContext } from "../../Context/AuthContext";
import DatePicker from "react-native-date-picker";
import Foundation from "react-native-vector-icons/Foundation";
import Colors from "../../constants/Colors";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import DarkLoading from "../../styles/DarkLoading";
import { AnimatedFAB } from "react-native-paper";
import AntDesign from 'react-native-vector-icons/AntDesign';
import { LoadingView } from "../../components/LoadingView";
import { LineChart, LineChartBicolor } from "react-native-gifted-charts";
import { opacity } from "react-native-reanimated/lib/typescript/reanimated2/Colors";



const CashFlowReports = ({ navigation }) => {
    const [selectedSegment, setSelectedSegment] = useState("Maintenance");
    const [maintenanceData, setMaintenanceData] = useState([]);
    const [fuelData, setFuelData] = useState([]);
    const { userData } = useContext(AuthContext);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [originalMaintenanceData, setOriginalMaintenanceData] = useState([]);
    const [originalFuelData, setOriginalFuelData] = useState([]);
    const [isFiltered, setIsFiltered] = useState(false);
    const [loading, setLoading] = useState(true);
    const [masterData, setMasterData] = useState([]);
    const [quarterlyRevenue, setQuarterlyRevenue] = useState([]);
    const [quarterlyExpense, setQuarterlyExpense] = useState([]);



    useEffect(() => {
        // FetchFuelData();
        FetchProfitAndLoss();
    }, []);


    const lineData = [
        { value: 0 },
        { value: 10 },
        { value: 8 },
        { value: 58 },
        { value: 56 },
        { value: 78 },
        { value: 74 },
        { value: 98 },
    ];

    const lineData2 = [
        { value: 0 },
        { value: 20 },
        { value: 18 },
        { value: 40 },
        { value: 36 },
        { value: 60 },
        { value: 54 },
        { value: 85 },
    ];



    const FetchProfitAndLoss = async () => {
        setLoading(true);
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${userData.token}`);

        var raw = "";
        var requestOptions = {
            method: "GET",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
        };

        await fetch("https://gsidev.ordosolution.com/api/profit_loss/", requestOptions)
            .then((response) => response.json())
            .then(async (result) => {
                setMasterData(result);

                const quarterlyReports = result.quarterly_reports;

                // Initialize expense and revenue arrays
                const expenseArray = [];
                const revenueArray = [];

                // Iterate through quarterly reports
                quarterlyReports.forEach(quarterReport => {
                    const label = `Quarter ${quarterReport.quarter}`;
                    const expenses = quarterReport.profit_loss.expenses;
                    const revenue = quarterReport.profit_loss.revenue;
                    const profit = quarterReport.profit_loss.net_profit;

                    // Add data to expense array
                    expenseArray.push({ label, value: expenses, profit: profit });

                    // Add data to revenue array
                    revenueArray.push({ label, value: revenue, profit: profit });
                });

                console.log("quarterly expense", expenseArray)
                console.log("quarterly revenue", revenueArray)


                setQuarterlyExpense(expenseArray);
                setQuarterlyRevenue(revenueArray)

            })
            .catch((error) => {
                setLoading(false);
                console.log("error", error);
            });

        setLoading(false);

    };

    const handleSegmentChange = (segment) => {
        setSelectedSegment(segment);
    };

    const handleCellPress = (item) => {
        navigation.navigate("AddAccount", { screen: 'edit', details: item });
    };

    const filterByDate = () => {
        setIsModalVisible(true);
    };

    const resetFilter = () => {
        setSelectedDate(new Date());
        setMaintenanceData(originalMaintenanceData);
        setFuelData(originalFuelData);
        setIsFiltered(false);
    };

    const applyFilter = () => {
        setIsModalVisible(false);
        setIsFiltered(true);

        const formattedSelectedDate = selectedDate.toISOString().split("T")[0];
        const filteredMaintenanceData = originalMaintenanceData.filter(
            (item) => item.maintainance_date === formattedSelectedDate
        );
        const filteredFuelData = originalFuelData.filter(
            (item) => item.fuel_date === formattedSelectedDate
        );

        setMaintenanceData(filteredMaintenanceData);
        setFuelData(filteredFuelData);
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => { navigation.navigate("AddAccount", { screen: 'edit', details: item }) }}>
            <View style={styles.item}>

                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: 'center' }}>
                    <Text
                        style={{ fontSize: 18, fontFamily: "AvenirNextCyr-Bold", color: Colors.primary }}
                    >
                        INVOICE - {item?.invoice_id}
                    </Text>
                    <Text
                        style={{ fontSize: 16, fontFamily: "AvenirNextCyr-Medium", color: Colors.primary }}
                    >
                        Due: {item.due_date}
                    </Text>
                </View>
                <Text
                    style={{ fontSize: 16, fontFamily: "AvenirNextCyr-Medium", color: Colors.primary }}
                >
                    {item.amount}
                </Text>
                {/* <View style={{ flexDirection: "row", justifyContent: "space-between", }}>
                    <Text
                        style={{
                            fontSize: 18,
                            color: "orange",
                            fontFamily: "AvenirNextCyr-Bold",
                        }}
                    >
                        {item.branch}
                    </Text>
                    <View style={styles.itemDetails}>
                        <MaterialIcons
                            name="navigate-next"
                            size={35}
                            color={Colors.primary}
                        />
                    </View>
                </View> */}
            </View>
        </TouchableOpacity>
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
                    style={{ paddingLeft: "5%" }}
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
                        marginLeft: 8,
                        color: "white",
                    }}
                >
                    Cashflow Reports
                </Text>
                <TouchableOpacity >
                    <Text>{"             "}</Text>
                </TouchableOpacity>
            </View>


            <View style={styles.whiteView}>


                <View style={{ marginTop: '5%', paddingHorizontal: '5%' }}>


                    <LineChart
                        thickness={2}
                        isAnimated
                        data={quarterlyRevenue}
                        data2={quarterlyExpense}
                        height={200}
                        maxValue={5000000}
                        noOfSections={4}
                        rulesType="solid"
                        endSpacing={30}
                        initialSpacing={30}
                        spacing={80}
                        color1="green"
                        color2="tomato"
                        startFillColor1={'#77DD77'}
                        endFillColor1={'#77DD77'}
                        startOpacity1={0.4}
                        endOpacity1={0.1}
                        startFillColor2={'tomato'}
                        endFillColor2={'tomato'}
                        startOpacity2={0.4}
                        endOpacity2={0.1}
                        xAxisLabelTextStyle={{ fontSize: 12, textAlign: 'center', fontFamily: 'AvenirNextCyr-Medium' ,color:'black'}}
                        yAxisTextStyle={{ fontSize: 12, fontFamily: 'AvenirNextCyr-Medium',color:'black' }}
                        textColor1="green"
                        dataPointsHeight={6}
                        dataPointsWidth={6}
                        dataPointsColor1="green"
                        dataPointsColor2="tomato"
                        textShiftY={-20}
                        textShiftX={-50}
                        areaChart
                        adjustToWidth={true}
                        yAxisColor="lightgray"
                        xAxisColor="lightgray"
                        hideDataPoints
                        textFontSize={13}

                        pointerConfig={{
                            pointerStripHeight: 160,
                            pointerStripColor: 'white',
                            pointerStripWidth: 2,
                            pointerColor: 'white',
                            radius: 6,
                            pointerLabelWidth: 100,
                            pointerLabelHeight: 90,
                            // activatePointersOnLongPress: true,
                            autoAdjustPointerLabelPosition: false,
                            pointerLabelComponent: items => {
                                let color = items[0].profit > 0 ? 'green' : 'tomato'
                                return (
                                    <View
                                        style={{
                                            height: 90,
                                            // width: 100,
                                            justifyContent: 'center',
                                            backgroundColor: Colors.primary,
                                            padding: '5%',
                                            // marginTop: -30,
                                            // marginLeft: -40,
                                        }}>
                                        <Text
                                            style={{
                                                color: 'white',
                                                fontSize: 14,
                                                marginBottom: 6,
                                                textAlign: 'center',
                                            }}>
                                            {items[0].label}
                                        </Text>

                                        <View
                                            style={{
                                                // paddingHorizontal: 14,
                                                paddingVertical: 6,
                                                borderRadius: 16,
                                                backgroundColor: 'white',
                                            }}>
                                            <Text style={{ fontWeight: 'bold', textAlign: 'center', color: color }}>
                                                {'₹' + items[0].profit + '.0'}
                                            </Text>
                                        </View>
                                    </View>
                                );
                            },
                        }}
                    />

                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: '10%', justifyContent: 'center', gap: 30 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                            <View style={{ backgroundColor: 'green', height: 15, width: 15, borderRadius: 15 }} />
                            <Text style={{ fontFamily: 'AvenirNextCyr-Medium', fontSize: 15 ,color: 'black' }}>Revenue</Text>
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                            <View style={{ backgroundColor: 'tomato', height: 15, width: 15, borderRadius: 15 }} />
                            <Text style={{ fontFamily: 'AvenirNextCyr-Medium', fontSize: 15,color: 'black'  }}>Expense</Text>

                        </View>
                    </View>

                </View>
                {/* <LineChartBicolor
                    data={lineData}
                    areaChart
                    color="green"
                    colorNegative="red"
                    startFillColor="green"
                    startFillColorNegative="red"
                    showXAxisIndices
                /> */}

                {/* <LineChart
                    isAnimated
                    thickness={2}
                    color={Colors.primary}
                    // maxValue={600}
                    noOfSections={4}
                    // animateOnDataChange
                    // animationDuration={100}
                    // onDataChangeAnimationDuration={100}
                    areaChart
                    xAxisLabelTextStyle={{ fontSize: 7, textAlign: 'center', fontFamily: 'AvenirNextCyr-Medium' }}
                    yAxisTextStyle={{ fontSize: 8, fontFamily: 'AvenirNextCyr-Medium' }}
                    data={lineData}
                    // data2={lineData2}
                    hideDataPoints
                    startFillColor={'#011A90'}
                    endFillColor={'#011A90'}
                    startOpacity={0.4}
                    endOpacity={0.1}
                    // spacing={50}
                    // backgroundColor="#414141"
                    // rulesColor="gray"
                    rulesType="solid"
                    // initialSpacing={30}
                    yAxisColor="lightgray"
                    xAxisColor="lightgray"
                    // width={300}

                /> */}
                {/* <View style={{ flex: 1, paddingHorizontal: '4%', marginTop: '3%' }}>
                    <Text style={{ fontFamily: 'AvenirNextCyr-Medium', fontSize: 16, marginBottom: '1%' }}>Aged Payables</Text>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={masterData.aged_payable}
                        keyboardShouldPersistTaps="handled"
                        renderItem={renderItem}
                    />
                </View>

                <View style={{ flex: 1, paddingHorizontal: '4%' }}>
                    <Text style={{ fontFamily: 'AvenirNextCyr-Medium', fontSize: 16, marginBottom: '1%' }}>Aged Receivable</Text>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={masterData.aged_receivable}
                        keyboardShouldPersistTaps="handled"
                        renderItem={renderItem}
                    />
                </View> */}
            </View>


            {/* <AnimatedFAB
                label={'Add Account'}
                icon={() => <AntDesign name="addfile" size={24} color="white" />}
                color={"white"}
                style={styles.fabStyle}
                // borderWidth={50}
                borderRadius={60}

                fontFamily={'AvenirNextCyr-Medium'}
                extended={true}

                // onPress={() => console˝.log('Pressed')}
                visible={true}
                animateFrom={'right'}
                // iconMode={'static'}
                onPress={() => {
                    navigation.navigate("AddAccount", { screen: 'add' });
                }}
            /> */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => {
                    setIsModalVisible(false);
                }}
            >
                <View style={styles.modalView}>
                    <View style={styles.datePickerContainer}>
                        <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                            <FontAwesome
                                name="close"
                                size={30}
                                color={Colors.primary}
                                onPress={() => setIsModalVisible(false)}
                                style={{ justifyContent: "flex-end" }}
                            />
                        </View>
                        <DatePicker
                            date={selectedDate}
                            onDateChange={setSelectedDate}
                            mode="date"
                            textColor="#000"
                            style={{
                                backgroundColor: "white",
                                padding: 20,
                                borderRadius: 10,
                            }}
                        />
                        <LinearGradient
                            colors={Colors.linearColors}
                            start={Colors.start}
                            end={Colors.end}
                            locations={Colors.location}
                            style={{
                                borderRadius: 50,
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <TouchableOpacity
                                style={styles.button}
                                activeOpacity={0.8}
                                onPress={applyFilter}
                            >
                                <Text style={styles.btnText}>Apply Filter</Text>
                            </TouchableOpacity>
                        </LinearGradient>
                    </View>
                </View>
            </Modal>
        </LinearGradient>
    );
};

export default CashFlowReports;

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
    },
    whiteView: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        marginTop: "4%",
    },
    item: {
        backgroundColor: "white",
        padding: "4%",
        // marginVertical: "2%",
        // marginHorizontal: "4%",
        // borderTopEndRadius: 13,
        // borderBottomLeftRadius: 13,
        // elevation: 5,
        gap: 3
    },
    modalView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        backgroundColor: "#fff",
        width: "80%",
        alignItems: "center",
    },
    datePickerContainer: {
        backgroundColor: "white",
        padding: "5%",
        borderRadius: 10,
    },
    button: {
        justifyContent: "center",
        borderRadius: 50,
        height: 50,
    },
    btnText: {
        fontFamily: "AvenirNextCyr-Medium",
        color: "#fff",
        fontSize: 16,
    },
    filteredTextView: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: "2%",
        backgroundColor: "#fff",
        elevation: 5,
        gap: 10,
        flexDirection: "row",
    },
    filteredText: {
        fontFamily: "AvenirNextCyr-Thin",
        fontSize: 16,
        color: Colors.primary,
    },
    resetText: {
        fontSize: 16,
        color: Colors.white,
        fontWeight: "500",
    },
    moreDetailsButton: {
        backgroundColor: Colors.primary,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 5,
    },
    moreDetailsButtonText: {
        color: "white",
        fontSize: 14,
        fontWeight: "bold",
    },
    itemDetails: {
        flexDirection: "row",
        justifyContent: "flex-end",
    },

    fabStyle: {
        position: 'absolute',
        // marginBottom: 35,
        right: '4%',
        bottom: '5%',
        backgroundColor: Colors.primary,
        borderRadius: 30,
        // marginRight:'3%'

    },
});
