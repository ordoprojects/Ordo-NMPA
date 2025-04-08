import React, { useState } from 'react'
import { View, Text, TouchableOpacity, Switch } from 'react-native'
import { BarChart, PieChart, LineChart } from 'react-native-gifted-charts'
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import Colors from '../../constants/Colors';
import CustomReports from '../CustomReports';



const Insights = ({ pieData, pieChart, pieChartHeading, barData, barChart, barGraphHeading, children, navigation, moduleName, areaGraphHeading, areaChart, areaChartData }) => {

    console.log('=============pieData=======================');
    console.log(pieData);
    console.log('====================================');
    return (
        <View style={{ flex: 1 }}>

            <View style={{ marginTop: '5%', paddingHorizontal: '5%', }}>
                {/* <Text style={{ fontFamily: 'AvenirNextCyr-Medium', fontSize: 17, color: 'black', marginBottom: '3%' }}>{pieChartHeading}</Text> */}
                {children && children.pieHeading ? children.pieHeading : <Text style={{ fontFamily: 'AvenirNextCyr-Medium', fontSize: 17, color: 'black', marginBottom: '3%', textAlign: 'center' }}>{pieChartHeading}</Text>}
                <View style={{ alignItems: 'center' }}>
                    {pieChart && <PieChart
                        radius={100}
                        strokeColor="white"
                        strokeWidth={4}
                        donut
                        data={pieData}
                        innerCircleBorderWidth={4}
                        innerCircleBorderColor={'white'}
                        showValuesAsLabels={true}
                        showText
                        textSize={14}
                        textColor='black'
                        legendFontColor= "red"
                        font='AvenirNextCyr-Medium'
                        textBackgroundRadius={10}
                    />}
                </View>


                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 10, paddingHorizontal: '5%', justifyContent: 'center' }}>
                    {pieData.map((item, index) => (
                        <View key={index} style={{ flexDirection: 'row', alignItems: 'center', margin: '2%', }}>
                            <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: item.color, marginRight: 5 }} />
                            <Text style={{ fontFamily: 'AvenirNextCyr-Medium' ,color:'black'}}>{item.label}</Text>
                        </View>
                    ))}
                </View>
            </View>





            {barChart && <View style={{ paddingHorizontal: '5%', marginTop: '5%' }}>

                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
                    {!barGraphHeading && children && children.barHeading ? children.barHeading : <Text style={{ fontFamily: 'AvenirNextCyr-Medium', fontSize: 17, color: 'black', marginBottom: '3%', }}>{barGraphHeading}</Text>}
                    {children && children.customBarSwitch && children.customBarSwitch}
                </View>
                <View style={{ marginVertical: '8%' }}>
                    <BarChart
                        barWidth={25}
                        noOfSections={3}
                        barBorderRadius={4}
                        frontColor="#177AD5"
                        // frontColor={Colors.primary}
                        data={barData}
                        yAxisThickness={0}
                        xAxisThickness={0}
                        xAxisLabelTextStyle={{ color: 'black' }}
                        yAxisTextStyle={{ color: 'black' }}
                        
                    // scrollToEnd={true}

                    />
                    
                </View>

            </View>}

            {areaChart && <View style={{ paddingHorizontal: '5%', marginTop: '5%' }}>

                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
                    {/* {children && children.barHeading ? children.barHeading : <Text style={{ fontFamily: 'AvenirNextCyr-Medium', fontSize: 17, color: 'black', marginBottom: '3%', }}>{barGraphHeading}</Text>}
                {children && children.customSwitch} */}
                    {!areaGraphHeading && children && children.areaHeading ? children.areaHeading : <Text style={{ fontFamily: 'AvenirNextCyr-Medium', fontSize: 17, color: 'black', marginBottom: '3%', }}>{areaHeading}</Text>}
                    {!areaGraphHeading && children && children.customAreaSwitch && children.customAreaSwitch}
                </View>
                <View style={{ marginVertical: '8%' }}>
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
                        // width={300}
                        // textShiftY={-20}
                        // textShiftX={-50}
                        areaChart
                        // adjustToWidth={true}
                        yAxisColor="lightgray"
                        xAxisColor="lightgray"
                        hideDataPoints
                        textFontSize={13}
                    // pointerConfig={{
                    //     pointerStripHeight: 160,
                    //     pointerStripColor: 'white',
                    //     pointerStripWidth: 2,
                    //     pointerColor: 'white',
                    //     radius: 6,
                    //     pointerLabelWidth: 100,
                    //     pointerLabelHeight: 90,
                    //     // activatePointersOnLongPress: true,
                    //     autoAdjustPointerLabelPosition: false,

                    // }}
                    />
                </View>

            </View>}


        </View>
    )

}

const Custom = ({ navigation, moduleName }) => {
    return (
        <CustomReports navigation={navigation} module={moduleName} />
    )
}

const Graphs = ({ pieData, pieChart, pieChartHeading, barData, barChart, barGraphHeading, children, navigation, moduleName, areaGraphHeading, areaChart, areaChartData }) => {
    const [tabIndex, setTabIndex] = React.useState(0);

    return (

        <View style={{ flex: 1, }}>
            <View style={{ marginTop: '2%' }}>
                <SegmentedControl
                    values={['Insights', 'Reports']}
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
            </View>


            <View>
                {tabIndex === 0 &&
                    <Insights
                        pieData={pieData}
                        pieChart={pieChart}
                        pieChartHeading={pieChartHeading}
                        barData={barData}
                        barChart={barChart}
                        barGraphHeading={barGraphHeading}
                        children={children}
                        navigation={navigation}
                        moduleName={moduleName}
                        areaGraphHeading={areaGraphHeading}
                        areaChart={areaChart}
                        areaChartData={areaChartData}
                    />}
                {tabIndex === 1 &&
                    <Custom
                        navigation={navigation}
                        moduleName={moduleName} />}
            </View>
        </View>






    )
}

export default Graphs