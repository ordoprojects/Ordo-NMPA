import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { PieChart } from "react-native-gifted-charts";
const Donut = () => {
    const pieData = [
        { value: 54, color: '#177AD5', text: '54%' },
        { value: 40, color: '#79D2DE', text: '30%' },
        { value: 20, color: '#ED6665', text: '26%' },
    ];
    return (
        <View style={{ flex: 1 }}>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <PieChart
                    donut
                    //isThreeD
                    showText
                    textColor="black"
                    //textSize={16}
                    //radius={170}
                    radius={50}
                    fontStyle={'oblique'}
                    //showTextBackground
                    //textBackgroundRadius={26}
                    data={pieData}
                />
            </View>

        </View>
    )
}

export default Donut

