import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign';
import Colors from '../../constants/Colors';
import globalStyles from '../../styles/globalStyles';

const AdminPromotions = ({navigation}) => {
    return (
        <View style={{ flex: 1 }}>
            <View style={{ padding: 8, marginTop: 8, marginLeft: 8, flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <AntDesign name='arrowleft' size={25} color={Colors.black} />
                </TouchableOpacity>
                <View style={{flex:1}}>
                    <View style={{alignSelf: 'center' }}>
                        <Text style={{ fontSize: 18, fontFamily: 'AvenirNextCyr-Medium' }}>AdminPromotions</Text>
                    </View>
                </View>
            </View>
            <View style={styles.row1View}>
                <TouchableOpacity activeOpacity={0.6} style={styles.recoredbuttonStyle} >
                    <Image transition={false} source={require('../../assets/images/order.png')} style={{ width: 25, height: 25, resizeMode: 'cover', marginTop: -1, alignSelf: 'center', tintColor: 'blue' }} >
                    </Image>
                    <Text style={{ fontFamily: "AvenirNextCyr-Thin", fontSize: 12, color: 'grey', textAlign: 'center', marginTop: 12 }}>New Order</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.6} style={styles.recoredbuttonStyle} >
                    <Image transition={false} source={require('../../assets/images/return.png')} style={{ width: 25, height: 25, resizeMode: 'cover', marginTop: -1, alignSelf: 'center', tintColor: 'blue' }} >
                    </Image>
                    <Text style={{ fontFamily: "AvenirNextCyr-Thin", fontSize: 12, color: 'grey', textAlign: 'center', marginTop: 12 }}>Sales Return</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default AdminPromotions

const styles = StyleSheet.create({
    row1View: {
        //marginHorizontal: 50,
        paddingHorizontal: 10,
        marginTop: 10,
        flexDirection: 'row',
        // alignContent: 'center',
        justifyContent: 'space-between',
    },
    recoredbuttonStyle: {
        borderRadius: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        marginHorizontal: 5,
        shadowRadius: 2,
        elevation: 5,
        ...globalStyles.border,
        height: 150,
        width: 150,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10
    },
})