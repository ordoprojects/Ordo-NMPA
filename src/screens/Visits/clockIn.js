import React, { useCallback, useContext } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { AuthContext } from '../../Context/AuthContext';
import Spinner from 'react-native-loading-spinner-overlay';
import { ProgressDialog } from 'react-native-simple-dialogs';
import Colors from '../../constants/Colors';
import LinearGradient from "react-native-linear-gradient";
import globalStyles from "../../styles/globalStyles";


const ClockIn = ({ faceRecognise, logoutAlert, loading }) => {



    return (
        <View style={styles.container}>
            <View style={{ flex: 1 }}>
                <ProgressDialog
                    visible={loading}
                    title="Processing Image"
                    message="Please wait..."
                    titleStyle={{ fontFamily: 'AvenirNextCyr-Medium' }}
                    messageStyle={{ fontFamily: 'AvenirNextCyr-Thin' }}
                    activityIndicatorColor={Colors.primary}
                />
                <View style={{ alignItems: 'flex-end', marginRight: 10, marginTop: 10 }}>
                    <TouchableOpacity onPress={logoutAlert}>
                        <Image
                            source={require('../../assets/images/clockInPowerOff.png')}
                            style={{ height: 30, width: 30, tintColor: '#4b0482' }}
                        />
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1, alignSelf: 'center', justifyContent: 'flex-end' }}>

                    <Image
                        source={require('../../assets/images/clockin.png')}
                        style={styles.icon}
                    />

                </View>
            </View>
            <View style={{ flex: 1, alignItems: 'center' }}>
                <LinearGradient
                    colors={Colors.linearColors}
                    start={Colors.start}
                    end={Colors.end}
                    locations={Colors.ButtonsLocation}
                    style={{
                        // height: 40,
                        // backgroundColor: "#011A90",
                        // marginHorizontal: "15%",
                        // borderRadius: 20,
                        alignItems: "center",
                        justifyContent: "center",
                        elevation: 5,
                        ...globalStyles.border,
                        marginTop: 5,
                        padding: 10,
                        borderRadius: 5,
                        marginBottom: 10,
                    }}
                >
                    <TouchableOpacity style={styles.button} onPress={faceRecognise}>
                        <Text style={styles.buttonText}>Clock In</Text>
                    </TouchableOpacity>
                </LinearGradient>
                <Text style={styles.text}>Clock In to proceed</Text>
            </View>

        </View>
    );
};



const styles = StyleSheet.create({
    container: {
        flex: 1,
        // alignItems: 'center',
        // justifyContent: 'center',
        backgroundColor: 'white',
    },
    backgroundContainer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        opacity: 0.5,
    },
    button: {
        // backgroundColor: '#3F51B5',
        // padding: 10,
        borderRadius: 5,
        // marginBottom: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    text: {
        fontSize: 16,
        marginBottom: 10,
        color: 'white',
    },
    icon: {
        width: 150,
        height: 150,
    },

});

export default ClockIn;