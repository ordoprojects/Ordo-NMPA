import { ScrollView, Text, View, TouchableOpacity, Image, FlatList, TextInput, Alert } from 'react-native'
import React, { useState } from 'react'
import styles from './style'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Colors from '../../constants/Colors'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { cameraPermission } from '../../utils/Helper';
import { AuthContext } from '../../Context/AuthContext';
import ImageResizer from '@bam.tech/react-native-image-resizer'
import { ProgressDialog } from 'react-native-simple-dialogs';
import RNFS from 'react-native-fs';
const ReturnAddProduct = ({ navigation, route }) => {
    const { item } = route.params;
    console.log("item", item)
    const [remarks, setRemarks] = useState('');
    const [imgId, setImgId] = useState('');
    const [base64img, setBase64img] = useState('');
    const [loading, setLoading] = useState(false);
    const [qty, setQty] = useState(false);


    const checkPermission = async () => {
        let PermissionDenied = await cameraPermission();
        if (PermissionDenied) {
            console.log("camera permssion granted");
            handleCamera();
        }
        else {
            console.log("camera permssion denied");
            //requestStoragePermission();
        }
    }


    const handleCamera = async () => {
        // setModalVisible1(false);
        const res = await launchCamera({
            mediaType: 'photo',
        });
        console.log("response", res.assets[0].uri);
        imageResize(res.assets[0].uri, res.assets[0].type);
    }
    const handleGallery = async () => {
        // setModalVisible1(false);
        const res = await launchImageLibrary({
            mediaType: 'photo',

        });
        console.log("response", res.assets[0].uri);
        imageResize(res.assets[0].uri, res.assets[0].type);
    }

    //upload image
    const uploadImage = (img) => {
        setLoading(true)

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "text/plain");
        //changed
        //.var raw = "{\n    \"__note_file__\": \"" + signBase64 + "\",\n    \"__note_filename__\": \"" + "OrderReciept" + returnId  + "\"\n    }\n";
        var raw = JSON.stringify({
            "__note_file__": img,
            "__note_filename__": `${Date.now()}.png`

        })
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("https://dev.ordo.primesophic.com/uploadFile.php", requestOptions)
            .then(response => response.json())
            .then(res => {
                //console.log("Signature Uploaded", result);
                console.log('product image uploaded', res);
                setImgId(res?.document_id)
                setLoading(false)
            })
            .catch(error => console.log('error', error));

    }
    const imageResize = async (img, type) => {
        ImageResizer.createResizedImage(
            img,
            300,
            300,
            'JPEG',
            50,

        )
            .then(async (res) => {
                console.log('image resize', res);
                RNFS.readFile(res.path, 'base64')
                    .then(res => {
                        //console.log('base64', res);
                        uploadImage(res)
                        setBase64img(`data:${type};base64,${res}`);
                    });
            })
            .catch((err) => {
                console.log(" img resize error", err)
            });
    }

    // const addProduct = () => {
    //     if (remarks  && qty) {
    //         navigation.navigate('ReturnsCart', { returnItem: { ...item, product_id: item?.id, document_id: imgId, remarks: remarks, product_name: item?.description, qty: qty } })
    //     }
    //     else {
    //         Alert.alert('Warning', 'Please enter all the details')
    //     }
    // }

    const addProduct = () => {
        if (remarks && qty) {
            navigation.navigate('SalesReturn', { returnItem: { ...item, product_id: item?.id, document_id: imgId, remarks: remarks, qty: qty, base64img: base64img } })

        } else {
            Alert.alert('Warning', 'Please enter all the details');
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            {/* upload image loader */}
            <ProgressDialog
                visible={loading}
                title="Uploading image"
                message="Please wait..."
                titleStyle={{ fontFamily: 'AvenirNextCyr-Medium' }}
                messageStyle={{ fontFamily: 'AvenirNextCyr-Thin' }}
            />


            <View style={{ ...styles.headercontainer }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <AntDesign name='arrowleft' size={25} color={Colors.black} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Add Product</Text>
            </View>



            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flex: 0.4, justifyContent: 'center', alignItems: 'center' }}>
                    {/* <Image source={ {uri:productData[0].product_image}}/> */}
                    <Image source={{ uri: item.imgsrc }} style={{ width: 60, height: 80, resizeMode: 'contain' }} />
                </View>

                <View style={{ flex: 0.8 }}>
                    <Text style={{ ...styles.text, fontFamily: 'AvenirNextCyr-Medium', color: Colors.primary }}>{item.name}</Text>
                    <Text style={styles.text}>#{item.brand.brand_name}</Text>
                    {/* <Text style={styles.text}>{item.manufacturer}</Text> */}
                    <Text style={styles.text}>INR  {Number(item.product_price)}</Text>
                    {/* <Text style={styles.text}>SKU Price : 4567</Text> */}
                </View>
            </View>

            <View style={{ padding: 16, flex: 1 }}>
                <Text style={styles.modalTitle}>Quantity</Text>
                <TextInput style={styles.cNameTextInput} placeholder='Quantity'
                    onChangeText={text => setQty(text)}
                    autoCapitalize='none'
                    keyboardType='numeric'
                />
                <Text style={styles.label}>Upload Photo</Text>
                <View style={styles.buttonview}>
                    <TouchableOpacity style={styles.photosContainer}
                        onPress={checkPermission}
                    >
                        <Text style={styles.buttonText}>Camera</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.photosContainer}
                        onPress={handleGallery}
                    >
                        <Text style={styles.buttonText}>Gallery</Text>
                    </TouchableOpacity>

                    {/* <View style={styles.closeView}>
                        <Button title="Close" onPress={() => setModalVisible1(false)} />
                      </View> */}
                </View>
                {base64img && <Image source={{ uri: base64img }} style={styles.imgStyle} />}
                {/* multile image support */}
                {/* <View style={{ height: 100, marginBottom: 10 }}>
                    <FlatList
                        data={[1, 2, 3, 4]}
                        renderItem={({ item, index }) => <Image source={{ uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRv4UK-VacVrppny4aGjzhWStSrcsP_6A1UdFvRLCMg&s" }} style={styles.imgStyle} />}
                        horizontal
                        showsHorizontalScrollIndicator={false}

                    />
                </View> */}

                <Text style={styles.label}>Remarks</Text>
                <TextInput
                    multiline={true}
                    numberOfLines={5}
                    placeholder="Enter Text..."
                    style={styles.textarea}
                    onChangeText={(val) => { setRemarks(val) }}
                    value={remarks}
                />


            </View>

            <View style={{ justifyContent: 'flex-end', padding: 16 }}>
                <View style={styles.buttonview}>
                    <TouchableOpacity style={styles.buttonContainer}
                        onPress={addProduct}
                    >
                        <Text style={styles.buttonText}>Add</Text>
                    </TouchableOpacity>
                </View>
            </View>




        </View >

    )
}

export default ReturnAddProduct

