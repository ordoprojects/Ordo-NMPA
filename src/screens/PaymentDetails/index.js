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
const PaymentDetails = ({ navigation, route }) => {
    const { id ,data} = route.params;
    // const [data, setData] = useState('');

    //getting details
    const getDetails = (img) => {


        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "text/plain");
        //changed
        //.var raw = "{\n    \"__note_file__\": \"" + signBase64 + "\",\n    \"__note_filename__\": \"" + "OrderReciept" + returnId  + "\"\n    }\n";
        var raw = JSON.stringify({
            "__id__": id
        })
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("https://gsi.ordosolution.com/get_payment_detail.php", requestOptions)
            .then(response => response.json())
            .then(res => {
                console.log("res", res?.payment);
                setData(res?.payment)
            })
            .catch(error => console.log('error', error));

    }

    // useEffect(() => {
    //     getDetails();
    // }, [])



    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>

            <View style={{ ...styles.headercontainer }}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 5 }}>
                    <AntDesign name='arrowleft' size={25} color={Colors.black} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Payment Details</Text>
            </View>
            <View style={{ paddingHorizontal: 16, flex: 1 }}>
                <View>
                    <Text style={styles.label}>Name</Text>
                    <Text style={{ ...styles.text, fontFamily: 'AvenirNextCyr-Medium', color: Colors.primary }}>PY-{data?.id}</Text>
                </View>
                <View style={{ marginTop: 10 }}>
                    <Text style={styles.label}>Mode of Payment</Text>
                    <Text style={styles.text}>{data?.mode_of_payment}</Text>
                </View>
                <View style={{ marginTop: 10 }}>
                    <Text style={styles.label}>Amount</Text>
                    <Text style={styles.text}>{Number(data?.amount)}</Text>
                </View>
                {data?.mode_of_payment == 'Cash' && <View style={{ marginTop: 10 }}>
                    <Text style={styles.label}>Receipt Number</Text>
                    <Text style={styles.text}>{data?.transaction_id}</Text>
                </View>}
                {data?.mode_of_payment == 'Wire Transfer/ Bank Transfer' && <View style={{ marginTop: 10 }}>
                    <Text style={styles.label}>Transaction Id</Text>
                    <Text style={styles.text}>{data?.transaction_id}</Text>
                </View>}

                {data?.mode_of_payment == 'Cheque' && <View style={{ marginTop: 10 }}>
                    <Text style={styles.label}>Cheque Image</Text>
                    <Image source={{ uri: data?.check_image }} style={styles.imgStyle} />
                </View>}
                <View style={{ marginTop: 10 }}>
                    <Text style={styles.label}>Payment Date</Text>
                    <Text style={styles.text}>{moment(data?.payment_date).format('DD-MM-YYYY HH:mm:ss')}</Text>
                </View>

            </View>

        </View>

    )
}

export default PaymentDetails

