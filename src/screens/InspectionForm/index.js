import React, { Component } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';
import Colors from '../../constants/Colors';
import Toast from "react-native-simple-toast";

// ...
const InspectionForm = ({ route, navigation }) => {

    const { InspectionURL } = route?.params

    const handlePaymentSuccess = event => {
        const data = JSON.parse(event.nativeEvent.data);
    
        if (data.message === 'successfully') {
          Toast.show('Inspection Form Successful', Toast.LONG);
          navigation.goBack();
        }
      };


    return (
        <View style={{ flex: 1 }}>
            <View style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                height: 60,
                paddingHorizontal: "4%",
            }}>
                <TouchableOpacity
                    onPress={() => {
                        navigation.goBack();
                    }}
                    style={{ paddingLeft: "5%" }}
                >
                    <Image
                        source={require("../../assets/images/Refund_back.png")}
                        style={{ height: 30, width: 30, tintColor: Colors.primary }}
                    />
                </TouchableOpacity>
                <Text
                    style={{
                        fontFamily: "AvenirNextCyr-Medium",
                        fontSize: 19,
                        marginLeft: 8,
                        color: Colors.primary,
                    }}
                >
                    Inspection Form
                </Text>
                <Text>{" "}</Text>
            </View>
            <WebView source={{ uri: InspectionURL }} style={{ flex: 1 }}  onMessage={handlePaymentSuccess} />
        </View>
    );
}


export default InspectionForm;

