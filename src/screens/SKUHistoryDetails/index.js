import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, Image, Modal, TextInput, PermissionsAndroid, FlatList } from 'react-native'
import React, { useState, useContext, useEffect } from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign';
import Colors from '../../constants/Colors';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { cameraPermission } from '../../utils/Helper';
import { AuthContext } from '../../Context/AuthContext';
import ImageResizer from '@bam.tech/react-native-image-resizer'
import RNFS from 'react-native-fs';
import moment from 'moment';
const SKUHistoryDetails = ({ navigation, route }) => {

    const { item } = route.params;
    //console.log("dealer data", dealerData);
    console.log("product data", item);

    const { token, } = useContext(AuthContext);

    const [isModalVisible, setModalVisible] = useState(false);
    const [cmpdata, setCmpData] = useState([]);
    const [modelNo, setModelNo] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [packs, setPacks] = useState('');
    const [desc, setDesc] = useState('')
    const [base64img, setBase64img] = useState('');





    const loadCmpProduct = async (id) => {

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "__userid__": token,
            "__products_id__": item?.aos_products_id_c
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("https://dev.ordo.primesophic.com/get_marketintelligence_detail.php", requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log("mi  res detail", result.marketintelligence_array);
                setCmpData(result?.marketintelligence_array)
            })
            .catch(error => console.log('error', error));

    }

    useEffect(() => {
        loadCmpProduct();
    }, [])


    return (
        <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>

            <View style={{ ...styles.headercontainer }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <AntDesign name='arrowleft' size={25} color={Colors.black} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>SKU History Details</Text>
            </View>

            <View style={styles.container}>
                <View style={{ flex: 1 }}>
                    <View style={{ flex: 0.4, flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 0.4, justifyContent: 'center', alignItems: 'center' }}>
                            {/* <Image source={ {uri:productData[0].product_image}}/> */}
                            <Image source={{uri: item.product_image.startsWith("http")
          ? item.product_image
          : `https://gsidev.ordosolution.com${item.product_image}`,
      }} style={{ width: 60, height: 80, resizeMode: 'contain' }} />
                        </View>

                        <View style={{ flex: 0.8 }}>
                            <Text style={{ ...styles.text, fontFamily: 'AvenirNextCyr-Medium', color: Colors.primary }}>{item.name}</Text>
                            <Text style={styles.text}>#{item.sku}</Text>
                            <Text style={styles.text}>INR  {Number(item.price)}</Text>
                            {/* <Text style={styles.text}>SKU Price : 4567</Text> */}
                        </View>
                    </View>

                    {/* <View style={styles.checkOutView}>
                        <TouchableOpacity style={styles.createPlanBtn}
                            onPress={() => setModalVisible(true)}
                        >
                            <Text style={styles.buttonTextStyle}>Add Competitor</Text>
                        </TouchableOpacity>
                    </View> */}
                    {cmpdata.length > 0 && <Text style={{
                        fontSize: 16,
                        fontFamily: 'AvenirNextCyr-Medium',
                        color: Colors.black,
                        marginTop:10,
                        marginLeft:5,
                    }}>SKU Report </Text>}
                    <FlatList
                        data={cmpdata}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => {
                            //repalcing ' and " values 
                            let sQuote = item?.summary_of_visit.replaceAll('&#039;', `'`)
                            let dQuote = sQuote.replaceAll('&quot;', `"`)

                            return (
                                // <View>
                                //   <Text>{item.modalNo}</Text>
                                //   <Text>{item.price}</Text>
                                //   <Text>{item.quantity}</Text>
                                // </View>

                                <View style={{
                                    flex: 1, backgroundColor: "white",
                                    margin: 5,
                                    flexDirection: 'row',
                                    marginBottom: 16,
                                    borderRadius: 8,
                                    elevation: 5,
                                    padding: 8
                                }}>

                                    {/* <View style={{ flex: 0.4, justifyContent: 'center', alignItems: 'center' }}>
                                        {/* <Image source={ {uri:productData[0].product_image}}/> 
                                        <Image source={{ uri: item.image_url }} style={{ width: 60, height: 80, resizeMode: 'cover' }} />
                                    </View> */}

                                    <View style={{ flex: 1 }}>
                                        {/* <Text style={styles.text}>Packs : {item.pack_of}</Text> */}
                                        <Text style={styles.text}>Retail price :  INR {Number(item?.retail_price)}</Text>
                                        <View style={{flexDirection:'row'}}>
                                        
                                        <Text style={{...styles.text,flex:0.4}}>Stock : {item.stock_on_hand}</Text>
                                        <Text style={{...styles.text,flex:0.6}}>Last Ordered Qty : {item?.last_ordered_qty}</Text>
                                        
                                        </View>
                                        
                                        <View style={{flexDirection:'row'}}>
                                        
                                        <Text style={{...styles.text,flex:0.4}}>Qty Sold : {item?.sold_qty}</Text>
                                        <Text style={{...styles.text,flex:0.6}}>No packs# : {item?.pack_of}</Text>
                                        </View>
                                       
                                      
                                        <Text style={{...styles.text,flex:0.7}}>Last Ordered Date : {moment(item?.last_ordered_date).format('DD-MM-YYYY')}</Text>
                                        <Text style={styles.text}>Duration : {moment(item?.start_date).format('DD-MM-YYYY')} to {moment(item?.end_date).format('DD-MM-YYYY')}</Text>
                                        <Text style={{ ...styles.text, color: 'grey', fontFamily: 'Poppins-Italic' }}>{dQuote}</Text>

                                        {/* <Text style={styles.text}>Name : {item.description}</Text>
                                    <Text style={styles.text}>manufacturer : {item.manufacturer}</Text> */}

                                        {/* <Text style={styles.text}>SKU Price : 4567</Text> */}
                                    </View>
                                </View>

                            )
                        }

                        }
                    />



                </View>
            </View>

        </ScrollView>
    )
}

export default SKUHistoryDetails

const styles = StyleSheet.create({
    headercontainer: {
        padding: 10,
        //backgroundColor:'red',
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: 'AvenirNextCyr-Medium',
        color: Colors.black,
        marginLeft: 10,
        marginTop: 3
    },
    container: {
        backgroundColor: 'white',
        padding: 16,
        flex: 0.9
    },
    text: {
        fontFamily: 'AvenirNextCyr-Thin',
    },
    checkOutView: {
        marginTop: 20,
        alignSelf: 'flex-start',
        marginBottom: 20
    },
    createPlanBtn: {
        height: 40,
        //width:40,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.primary,
        borderRadius: 10
    },
    buttonTextStyle: {
        color: '#fff',
        fontFamily: 'AvenirNextCyr-Medium',
    },
    modalTitle: {
        fontSize: 16,
        color: 'black',
        fontFamily: 'AvenirNextCyr-Medium'
    },
    cNameTextInput: {
        height: 40,
        borderWidth: 1,
        borderColor: '#B3B6B7',
        padding: 5,
        fontFamily: 'AvenirNextCyr-Thin',
        marginBottom: 10
    },
    buttonview: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    buttonContainer: {
        height: 40,
        padding: 10,
        borderRadius: 10,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        //marginRight: 10,
        marginVertical: 10,
        backgroundColor: Colors.primary
    },
    photosContainer: {
        height: 40,
        padding: 10,
        borderRadius: 10,
        marginVertical: 10,
        backgroundColor: Colors.primary,
        marginRight: 10
    },
    buttonText: {
        fontFamily: 'AvenirNextCyr-Thin',
        color: 'white'
    },
    textarea: {
        borderWidth: 0.5,
        borderColor: 'black',
        marginBottom: 10,
        borderRadius: 5,
        padding: 10,
        //fontSize: 13,
        textAlignVertical: 'top',
        color: '#000',
        fontFamily: 'AvenirNextCyr-Thin',


    },
    text: {
        fontFamily: 'AvenirNextCyr-Thin',
    },
})