import { ScrollView, Text, View, TouchableOpacity, Image, FlatList, TextInput, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import styles from './style'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Colors from '../../constants/Colors'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { cameraPermission } from '../../utils/Helper';
import { AuthContext } from '../../Context/AuthContext';
import ImageResizer from '@bam.tech/react-native-image-resizer'
import { ProgressDialog } from 'react-native-simple-dialogs';
import RNFS from 'react-native-fs';
import moment from 'moment'
const MerchIntakeDetails = ({ navigation, route }) => {
    const { item } = route.params;
    let sQuote = item.description.replaceAll('&#039;', `'`)
    let dQuote = sQuote.replaceAll('&quot;', `"`)
    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>

            <View style={{ ...styles.headercontainer }}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 5 }}>
                    <AntDesign name='arrowleft' size={25} color={Colors.black} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Intake Details</Text>
            </View>
            <ScrollView style={{flex:1}}>
            <View style={{ paddingHorizontal: 20, flex: 1 }}>

                <View style={{flex:1,flexDirection:'row'}}>
            <View style={{ marginTop:5 ,flex:0.5}}>
                    <Text style={styles.label}>Name</Text>
                    <Text style={styles.text}>{item?.name}</Text>
                </View>
            <View style={{ marginTop:5,flex:0.5 }}>
                    <Text style={styles.label}>Delivery Order#</Text>
                    <Text style={styles.text}>{item?.order_id}</Text>
                </View>
                </View>

                <View style={{flex:1,flexDirection:'row'}}>
                <View style={{ marginTop: 10 ,flex:0.5}}>
                    <Text style={styles.label}>Invoice#</Text>
                    <Text style={{ ...styles.text, fontFamily: 'AvenirNextCyr-Medium', color: Colors.primary }}>{item?.invoice_id}</Text>
                </View>
                <View style={{ marginTop: 10 ,flex:0.5}}>
                    <Text style={styles.label}>Intake Type</Text>
                    <Text style={styles.text}>Intake {item?.intake_type}</Text>
                </View>
                </View>
                {/* <View style={{ marginTop: 10 }}>
                    <Text style={styles.label}>Name</Text>
                    <Text style={styles.text}>{item?.name}</Text>
                </View> */}
              
                <View style={{ marginTop: 10 }}>
                    <Text style={styles.label}>Remarks</Text>
                    <Text style={styles.text}>{dQuote}</Text>
                </View>

            </View>
            </ScrollView>

        </View>

    )
}

export default MerchIntakeDetails

