import React, { useState, useEffect, useContext, } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    FlatList

} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { AuthContext } from "../../Context/AuthContext";
import Colors from "../../constants/Colors";
import Graphs from "../Graphs";
import { SelectCountry } from 'react-native-element-dropdown';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { BarChart, PieChart, LineChart } from 'react-native-gifted-charts'
import CircularProgress from "react-native-circular-progress-indicator";
import globalStyles from "../../styles/globalStyles";
import Feather from "react-native-vector-icons/Feather";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";


//    This is for Ability to stock of the day - integrate with SAP.
import { Dropdown } from 'react-native-element-dropdown';
import { LineChart as LineChart1 } from 'react-native-chart-kit';
// -----------------------------------------------------------------------

const Insides = ({ navigation }) => {
    const { userData } = useContext(AuthContext)
    const [barType, setBarType] = useState('total_paid_amount')
    const [areaType, setAreaType] = useState('account_sales')
    const [pieType, setPieType] = useState('status_counts')
    const [barMode, setBarMode] = useState('quarterly_graph_values')
    const [areaMode, setAreaMode] = useState('monthly_credit_amount')
    const [pos, setPos] = useState([])
    const [loading, setLoading] = useState(false)
    const [areaChartData, setAreaChartData] = useState([{"label": "Apr", "value": 10}, {"label": "May", "value": 30}, {"label": "Jun", "value": 15}, {"label": "Jul", "value": 30}, {"label": "Aug", "value": 0}, {"label": "Sep", "value": 0}, {"label": "Oct", "value": 0}, {"label": "Nov", "value": 0}, {"label": "Dec", "value": 0}, {"label": "Jan", "value": 0}, {"label": "Feb", "value": 0}, {"label": "Mar", "value": 0}]);
    const [filteredAreaData, setFilteredAreaData] = useState([]);
    const [pieChartData, setPieChartData] = useState([]);
    const [data, setData] = useState([]);
    const [tabIndex, setTabIndex] = React.useState(0);





    // This is for Ability to stock of the day - integrate with SAP.

    const [selectedDealer, setSelectedDealer] = useState('dealer1');
    const [stockData, setStockData] = useState([]);
    const [viewMode, setViewMode] = useState('daily'); 
    const [selectedSlice, setSelectedSlice] = useState(null);

    const pieChartDataOptions = {
        daily: [
            { label: 'Opening Stock', value: 40, color: '#a375ff' },
            { label: 'Closing Stock', value: 60, color: '#d1b3ff' },
        ],
        monthly: [
            { label: 'Opening Stock', value: 35, color: '#a375ff' },
            { label: 'Closing Stock', value: 65, color: '#d1b3ff' },
        ],
        yearly: [
            { label: 'Opening Stock', value: 50, color: '#a375ff' },
            { label: 'Closing Stock', value: 50, color: '#d1b3ff' },
        ],
    };

    // Get the PieChart data based on selected view mode
    const pieChartDataa = pieChartDataOptions[viewMode];

    // Sample Data (Replace with SAP API Integration)
    const dealerStockData = {
        dealer1: [500, 600, 450, 400], // Stock Levels
        dealer2: [700, 800, 750, 600],
    };
    
    const dealerSellOutData = {
        dealer1: [100, 200, 250, 300], // Sell-Out Figures
        dealer2: [150, 250, 200, 350],
    };

    useEffect(() => {
        // Fetch Data from API (SAP Integration)
        setStockData(
            dealerStockData[selectedDealer].map((stock, index) => ({
                month: ['Apr', 'May', 'Jun', 'Jul'][index],
                stock,
                sellOut: dealerSellOutData[selectedDealer][index],
            }))
        );
    }, [selectedDealer]);


// -----------------------------------------------------------------------

    console.log('areaChartData------->', areaChartData);


    const getRandomColor = () => {
        // Generating random values for RGB, but keeping them in the higher range to ensure lighter colors
        const r = Math.floor(Math.random() * 100) + 155; // Red component
        const g = Math.floor(Math.random() * 100) + 155; // Green component
        const b = Math.floor(Math.random() * 100) + 155; // Blue component
        const color = `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
        return color;
    };

    useEffect(() => {
        fetchData()
    }, [userData?.token])

    
    const CustomSwitch = () => {
        return (
            <View>
                <View
                    style={{ flexDirection: 'row', alignItems: 'center', }}
                >
                    <TouchableOpacity
                        onPress={() => { setAreaMode('quarterly_credit_amount') }}
                        style={[styles.switchView, { backgroundColor: areaMode == "quarterly_credit_amount" ? Colors.primary : 'white', borderTopLeftRadius: 10, borderBottomLeftRadius: 10 }]}>
                        <Text style={{ color: areaMode == "quarterly_credit_amount" ? 'white' : 'black', fontFamily: 'AvenirNextCyr-Medium' }}>Q</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => { setAreaMode('monthly_credit_amount') }}
                        style={[styles.switchView, { backgroundColor: areaMode == "monthly_credit_amount" ? Colors.primary : 'white', borderTopRightRadius: 10, borderBottomRightRadius: 10 }]}>
                        <Text style={{ color: areaMode == "monthly_credit_amount" ? 'white' : 'black', fontFamily: 'AvenirNextCyr-Medium' }}>M</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    };


    // useEffect(() => {
    //     if (data) {
    //         if (areaMode === 'quarterly_credit_amount') {
    //             setAreaChartData(data?.areachart?.account_sales?.quarterly_credit_amount);
    //         } else {
    //             setAreaChartData(data?.areachart?.account_sales?.monthly_credit_amount);
    //         }
    //     }
    //     // Update chart data based on areaMode
    // }, [areaMode]);


    
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
            const response = await fetch(`https://gsidev.ordosolution.com/api/sales_insights_list/?user_id=${userData?.id}`, requestOptions);
            const data = await response.json();

            const po_data = data.piechart.status_counts.map((item) => ({
                label: item.status,
                value: item.count, // Replace some_property with the property containing the value
                color: getRandomColor(),
            }));

            setPieChartData(po_data)
            // setPos(po_data);
            // setRfqs(rfq_data);
            // setBarChartData(data.purchase.total_paid_amount.monthly_graph_values)
            // setBarChartData(data.barchart.maintenance)
            // setAreaChartData(data?.areachart?.account_sales?.monthly_credit_amount)
            setData(data)
            console.log("rwrferferf", data)

        } catch (error) {
            console.log("error", error);
        } finally {
            setLoading(false);
        }
    };


    const InsightsTab = React.memo(() => {

        return (
            <View style={{ flex: 1 }}>
                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: '3%', flex: 1 }}> 

                   {/* View Mode Selection Buttons */}
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 10 }}>
                {['daily', 'monthly', 'yearly'].map((mode) => (
                    <TouchableOpacity
                        key={mode}
                        onPress={() => setViewMode(mode)}
                        style={{
                            paddingVertical: 8,
                            paddingHorizontal: 15,
                            marginHorizontal: 5,
                            backgroundColor: viewMode === mode ? '#4b0482' : '#ddd',
                            borderRadius: 5,
                        }}
                    >
                        <Text style={{ color: viewMode === mode ? '#fff' : '#000' }}>
                            {mode.charAt(0).toUpperCase() + mode.slice(1)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* PieChart for Opening and Closing Stock */}
                  <PieChart
                data={pieChartDataa.map((item) => ({
                    ...item,
                    onPress: () => setSelectedSlice(item),
                }))}
                donut
                showValuesAsLabels
                textSize={14}
                textColor="#000"
                innerRadius={45}
                radius={100}
            />
            

              <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 10, paddingHorizontal: '5%', justifyContent: 'center' }}>
                        {pieChartDataa.map((item, index) => (
                            <View key={index} style={{ flexDirection: 'row', alignItems: 'center', margin: '2%', }}>
                                <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: item.color, marginRight: 5 }} />
                                <Text style={{ fontFamily: 'AvenirNextCyr-Medium' }}>{item.label} : {item.value}</Text>
                            </View>
                        ))}
                    </View>
                    {/* <PieChart
                        radius={100}
                        strokeColor="white"
                        strokeWidth={4}
                        donut
                        data={pieChartData}
                        innerCircleBorderWidth={4}
                        innerCircleBorderColor={'white'}
                        showValuesAsLabels={true}
                        showText
                        textSize={14}
                        textColor='#000'
                        font='AvenirNextCyr-Medium'
                        textBackgroundRadius={10}
                    /> */}


                    {/* <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 10, paddingHorizontal: '5%', justifyContent: 'center' }}>
                        {pieChartData.map((item, index) => (
                            <View key={index} style={{ flexDirection: 'row', alignItems: 'center', margin: '2%', }}>
                                <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: item.color, marginRight: 5 }} />
                                <Text style={{ fontFamily: 'AvenirNextCyr-Medium' }}>{item.label}</Text>
                            </View>
                        ))}
                    </View> */}
             </View> 
   {/* This is for Ability to stock of the day - integrate with SAP. */}
   
                <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: '4%', marginVertical: '4%', marginBottom: '8%' }}>
                        <Text style={{ fontFamily: 'AvenirNextCyr-Medium', color: 'black', fontSize: 17 }}>Dealer Stock & Sell-Out Trend</Text>
                    </View>
                                     {/* Dealer Selection Dropdown */}
            <Dropdown
                style={{ height: 50, borderWidth: 1, borderColor: '#ddd', borderRadius: 5, paddingHorizontal: 10, marginBottom: 10,marginHorizontal:'3%' }}
                data={[{ label: 'Dealer 1', value: 'dealer1' }, { label: 'Dealer 2', value: 'dealer2' }]}
                labelField="label"
                valueField="value"
                value={selectedDealer}
                onChange={(item) => setSelectedDealer(item.value)}
                placeholder="Select Dealer"
            />
                    <View style={{ flex: 1, paddingVertical: '4%',marginHorizontal:'3%'  }}>
         
            
            {/* Line Chart */}
            <LineChart1
                data={{
                    labels: ['Apr', 'May', 'Jun', 'Jul'],
                    datasets: [
                        {
                            data: dealerStockData[selectedDealer],
                            color: (opacity = 1) => `rgba(34, 150, 243, ${opacity})`, // Blue
                            strokeWidth: 1,
                        },
                        {
                            data: dealerSellOutData[selectedDealer],
                            color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`, // Red
                            strokeWidth: 1,
                        },
                    ],
                }}
                width={Dimensions.get('window').width - 40}
                height={220}
                yAxisSuffix=" units"
                chartConfig={{
                    backgroundGradientFrom: '#fff',
                    backgroundGradientTo: '#fff',
                    decimalPlaces: 0,
                    color: (opacity = 1) => Colors.primary,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
                bezier
            />

            {/* Detailed Stock Data */}
            <FlatList
                data={stockData}
                keyExtractor={(item) => item.month}
                renderItem={({ item }) => (
                    <View style={{ padding: 10, borderBottomWidth: 1, borderColor: '#ddd' }}>
                        <Text style={{ fontWeight: 'bold' }}>{item.month}</Text>
                        <Text>Stock Level: {item.stock}</Text>
                        <Text>Sell-Out: {item.sellOut}</Text>
                    </View>
                )}
            />
                        </View>
                    </View>

 {/* ---------------------------------------------------------------------------- */}

                {/* <View style={{ flex: 1 }}>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: '4%', marginVertical: '4%', marginBottom: '8%' }}>
                        <Text style={{ fontFamily: 'AvenirNextCyr-Medium', color: 'black', fontSize: 17 }}>Sales performance</Text>
                        <CustomSwitch />
                    </View>

                    <View style={{ flex: 1, paddingVertical: '4%' }}>
                    {areaChartData && areaChartData.length > 0 && (
    <LineChart
        thickness={2}
        isAnimated
        data={areaChartData}
        height={200}
        noOfSections={4}
        rulesType="solid"
        endSpacing={30}
        initialSpacing={30}
        spacing={80}
        color={Colors.primary}
        startFillColor={Colors.primary}
        endFillColor={Colors.primary}
        startOpacity={0.4}
        endOpacity={0.1}
        xAxisLabelTextStyle={{ fontSize: 12, textAlign: 'center', fontFamily: 'AvenirNextCyr-Medium' }}
        yAxisTextStyle={{ fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}
        textColor="green"
        dataPointsHeight={6}
        dataPointsWidth={6}
        dataPointsColor="green"
        areaChart
        yAxisColor="lightgray"
        xAxisColor="lightgray"
        hideDataPoints
        textFontSize={13}
    />
)}

                    </View>

                </View> */}
            </View>
        )
    })


    // const TargetsTab = React.memo(() => {

    //     console.log("rerendered")

    //     return (
    //         <View style={{ flex: 1 }}>
    //             {/* <Text>targets</Text> */}
    //             {Object.keys(data?.customer_order_totals).map((customer, index) => {

    //                 const customerData = data.customer_order_totals[customer];
    //                 const achievedTarget = customerData.achieved_target;
    //                 const customerTarget = customerData.customer_target || 100000; // Assuming a default target value if not provided
    //                 const progressValue = (achievedTarget / customerTarget) * 100;
    //                 // const achievedTarget = data[customer].achieved_target;
    //                 // const customerTarget = data[customer].customer_target || 100000; // Assuming a default target value if not provided
    //                 // const progressValue = (achievedTarget / customerTarget) * 100;

    //                 return (
    //                 <View

    //                     style={{
    //                         borderRadius: 20,
    //                         alignItems: "center",
    //                         flex: 1,
    //                         marginHorizontal: '4%',
    //                         padding: "3%",
    //                         elevation: 8,
    //                         backgroundColor: 'white',
    //                         marginVertical: '3%',
    //                         ...globalStyles.border,
    //                     }}
    //                 >

    //                     <View
    //                         style={{
    //                             flexDirection: "row-reverse",
    //                             marginTop: "1%",

    //                         }}
    //                     >
    //                         {/* <Text style={{ ...styles.label, fontSize: 16, color: Colors.black, marginVertical: 5, fontFamily: 'AvenirNextCyr-Medium' }}>Sales</Text> */}

    //                         <CircularProgress
    //                             value={progressValue}
    //                             activeStrokeColor={Colors.primary}
    //                             activeStrokeWidth={7}
    //                             //   activeStrokeSecondaryColor={'#851E71'}
    //                             inActiveStrokeColor={"grey"}
    //                             inActiveStrokeOpacity={0.2}
    //                             inActiveStrokeWidth={7}
    //                             progressValueColor={Colors.primary}
    //                             valueSuffix={"%"}
    //                             radius={40}
    //                         />

    //                         {/* </View> */}

    //                         <View style={{ flex: 2 }}>
    //                             <Text style={styles.subHeading}>{customer}</Text>
    //                             {/* <Text style={styles.subHeading1}>4 more days left !! </Text> */}
    //                             <View
    //                                 style={{
    //                                     flexDirection: "row",
    //                                     alignContent: "center",
    //                                     marginTop: 4,
    //                                     gap: 7,
    //                                 }}
    //                             >
    //                                 <MaterialCommunityIcons
    //                                     name="bullseye-arrow"
    //                                     color={`black`}
    //                                     size={18}
    //                                 />
    //                                 <Text
    //                                     style={{
    //                                         color: "black",
    //                                         fontFamily: "AvenirNextCyr-Medium",
    //                                         fontSize: 13,
    //                                     }}
    //                                 >
    //                                     Target: {customerTarget.toLocaleString()}
    //                                 </Text>
    //                             </View>

    //                             <View
    //                                 style={{
    //                                     flexDirection: "row",
    //                                     alignContent: "center",
    //                                     marginTop: 4,
    //                                     gap: 7,
    //                                 }}
    //                             >
    //                                 <Feather
    //                                     name="check-circle"
    //                                     color={`black`}
    //                                     size={18}
    //                                 />
    //                                 <Text
    //                                     style={{
    //                                         color: "black",
    //                                         fontFamily: "AvenirNextCyr-Medium",
    //                                         fontSize: 13,
    //                                     }}
    //                                 >
    //                                     Achieved: {achievedTarget.toLocaleString()}
    //                                 </Text>
    //                             </View>
    //                             {/* <Text style={{color:'white',marginTop:'5%',fontFamily:'AvenirNextCyr-Medium',fontSize:16}}>Almost There !!</Text> */}
    //                         </View>
    //                     </View>
    //                 </View>)

    //             })}
    //         </View>
    //     );
    // })


// Target in the system and system can be pickup from SAP. Month to date, YTD

    const TargetsTab = React.memo(() => {
  console.log("rerendered");

  const renderTargetSection = (title, targetData) => (
    <View style={{ marginBottom: 15 }}>
      {/* Section Header */}
      <Text style={{ fontSize: 18, fontWeight: "bold", marginLeft: 15, marginBottom: 8 }}>
        {title}
      </Text>


      {Object.keys(data?.customer_order_totals).map((customer, index) => {
        const customerData = data?.customer_order_totals[customer];
        const achievedTarget = customerData.achieved_target;
        const customerTarget = customerData.customer_target || 100000;
        const progressValue = (achievedTarget / customerTarget) * 100;

        // Determine progress color
        let progressColor = "red"; // Below 50% → Red
        if (progressValue >= 50) progressColor = "orange"; // 50-80% → Orange
        if (progressValue >= 80) progressColor = "green"; // Above 80% → Green

        return (
          <View
            key={customer}
            style={{
              borderRadius: 20,
              alignItems: "center",
              marginHorizontal: "4%",
              padding: "3%",
              elevation: 8,
              backgroundColor: "white",
              marginVertical: "2%",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <CircularProgress
                value={progressValue}
                activeStrokeColor={progressColor}
                activeStrokeWidth={8}
                inActiveStrokeColor={"grey"}
                inActiveStrokeOpacity={0.2}
                inActiveStrokeWidth={8}
                progressValueColor={progressColor}
                valueSuffix={"%"}
                radius={40}
              />

              {/* Customer Details */}
              <View style={{ flex: 1, marginLeft: 15 }}>
                <Text style={{ fontSize: 16, fontWeight: "bold", color: "#333" }}>
                  {customer}
                </Text>

                {/* Target Row */}
                <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
                  <MaterialCommunityIcons name="bullseye-arrow" color="black" size={18} />
                  <Text style={{ fontSize: 13, marginLeft: 6 }}>
                    Target: {customerTarget.toLocaleString()}
                  </Text>
                </View>

                {/* Achieved Row */}
                <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
                  <Feather name="check-circle" color="black" size={18} />
                  <Text style={{ fontSize: 13, marginLeft: 6 }}>
                    Achieved: {achievedTarget.toLocaleString()}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );

  return (
    <View style={{ flex: 1, paddingTop: 10 }}>
      {renderTargetSection("Month-To-Date (MTD)", data?.customer_order_totals_mtd)}
      {renderTargetSection("Year-To-Date (YTD)", data?.customer_order_totals_ytd)}
    </View>
  );
});

// -----------------------------------------------------------------------------



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
                    Insights
                </Text>
                <Text> </Text>
            </View>


            <ScrollView style={styles.whiteView}>


                <SegmentedControl
                    values={['Insights', 'Targets']}
                    selectedIndex={tabIndex}
                    onChange={(event) => {
                        setTabIndex(event.nativeEvent.selectedSegmentIndex)
                    }}
                    // onValueChange={(value) => { console.log("testing", value) }}
                    segmentedControlBackgroundColor="black"
                    tintColor={Colors.primary}
                    activeSegmentBackgroundColor={Colors.primary}
                    appearance='light'
                    activeTextColor='white'
                    textColor='black'
                    paddingVertical={20}
                    style={{ marginHorizontal: '4%', marginVertical: '1%', }}
                    fontStyle={{ fontFamily: 'AvenirNextCyr-Medium', color: 'black' }}
                    activeFontStyle={{ fontFamily: 'AvenirNextCyr-Medium', color: 'white' }}
                />
                {tabIndex === 0 &&
                    <InsightsTab />
                }

                {tabIndex === 1 &&
                    <TargetsTab />
                }


            </ScrollView>
        </LinearGradient>
    );
};

export default Insides;

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
    },
    selectedTextStyle: {
        fontSize: 16,
        marginLeft: 8,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    subHeading: {
        fontSize: 17,
        color: "black",
        fontFamily: "AvenirNextCyr-Bold",
        marginBottom: 5,
    },
});
