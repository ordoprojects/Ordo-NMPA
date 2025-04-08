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
const ShelfDisplayDetails = ({ navigation, route }) => {
    const { item } = route.params;
     //repalcing ' and " values 
     console.log("shsh",item.remarks)
     let sQuote = item.remarks.replaceAll('&#039;', `'`)
     let dQuote = sQuote.replaceAll('&quot;', `"`)
    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>

            <View style={{ ...styles.headercontainer }}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 5 }}>
                    <AntDesign name='arrowleft' size={25} color={Colors.black} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Shelf Display Details</Text>
            </View>
            <ScrollView style={{flex:1}}>
            <View style={{ paddingHorizontal: 16, flex: 1 }}>
            <View style={{ marginTop:5 }}>
                    <Text style={styles.label}>Account Name</Text>
                    <Text style={styles.text}>{item?.account_name}</Text>
                </View>
                <View style={{ marginTop: 10 }}>
                    <Text style={styles.label}>Category Name</Text>
                    <Text style={{ ...styles.text, fontFamily: 'AvenirNextCyr-Medium', color: Colors.primary }}>{item?.category}</Text>
                </View>
                <View style={{ marginTop: 10 }}>
                    <Text style={styles.label}>Shelf Details</Text>
                    <Text style={styles.text}>{item?.shelf_id}</Text>
                </View>

                 <View style={{ marginTop: 10 }}> 
                    <Text style={styles.label}>Shelf Image</Text>
                    <Image source={{ uri: item?.shelf_image }} style={styles.imgStyle} />
                </View>
                <View style={{ marginTop: 10 }}>
                    <Text style={styles.label}>Remarks</Text>
                    <Text style={styles.text}>{dQuote}</Text>
                </View>

            </View>
            </ScrollView>

        </View>

    )
}

export default ShelfDisplayDetails

