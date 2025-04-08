import { ScrollView, Text, View, TouchableOpacity, Image, FlatList, TextInput, Alert } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import styles from './style'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Colors from '../../constants/Colors'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { cameraPermission } from '../../utils/Helper';
import { AuthContext } from '../../Context/AuthContext';
import ImageResizer from '@bam.tech/react-native-image-resizer'
import { ProgressDialog } from 'react-native-simple-dialogs';
import { Dropdown } from 'react-native-element-dropdown'
import RNFS from 'react-native-fs';
import moment from 'moment'
const AddInventory = ({ navigation, route }) => {

    const { token, dealerData } = useContext(AuthContext);
    //drop down hooks
    const [categoryOption, setCategoryOption] = useState([]);
    const getDropDown = () => {
        fetch('https://dev.ordo.primesophic.com/get_dropdownfields.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "__module_name__": "AOS_Products"
            }),
        })
            .then(response => response.json())
            .then(async res => {
                console.log("drop down api res", res);
                //Category dropdown
                const categoryArray = Object.keys(res?.product_categories_array).map((key) => ({
                    label: res?.product_categories_array[key],
                    value: key,
                }));
                console.log("category option", categoryArray);
                setCategoryOption(categoryArray);

                // //currency dropdown
                // const currencyArray = Object.keys(res?.currencies_array).map((key) => ({
                //     label: res?.currencies_array[key],
                //     value: key,
                // }));
                // console.log("currency option", currencyArray);
                // setCurrencyOption(currencyArray);

                // //tax dropdown
                // const taxArray = Object.keys(res?.tax).map((key) => ({
                //     label: res?.tax[key],
                //     value: key,
                // }));
                // console.log("tax option", taxArray);
                // setTaxOption(taxArray);

                // //unit of measure  dropdown
                // const unitArray = Object.keys(res?.unitofmeasure).map((key) => ({
                //     label: res?.unitofmeasure[key],
                //     value: key,
                // }));
                // console.log("unit of measure option", unitArray);
                // setUnitOption(unitArray);


            })
            .catch(error => {
                // Handle the error here
                console.log(error);
            });

    }

    useEffect(() => {
        //getting all predefined drop down values
        getDropDown();

    }, [])
    //add shelf display  value hooks
    //const [amount, setAmount] = useState('');
    const [category, setCategory] = useState(null);
    const [isFocus, setIsFocus] = useState(false);
    const optionData = [
        { label: 'Cash', value: 'Cash' },
        { label: 'Cheque', value: 'Cheque' },
        { label: 'Wire Transfer/ Bank Transfer', value: 'Wire Transfer/ Bank Transfer' },
    ];
    const [shelfId, setShelfId] = useState('');
    const [base64img, setBase64img] = useState('');
    const [remarks, setRemarks] = useState('');

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
                        //uploadImage(res)
                        setBase64img(`data:${type};base64,${res}`);
                    });
            })
            .catch((err) => {
                console.log(" img resize error", err)
            });
    }


    

    const addShelfDisplay = () => {
        if (category && shelfId && base64img && remarks) {
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "text/plain");
            var raw = JSON.stringify({
                "__shelf_id__": shelfId,
                "__name__": shelfId,
                "__shelf_image__": `${Date.now()}.png`,
                "__product_categories_id__": category,
                "__remarks__": remarks,
                "__shelf_image_base64__": base64img,
                "__ordousers_id__": token,
                "__account_id__": dealerData.id

            })
            console.log(raw)
            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };
            fetch("https://dev.ordo.primesophic.com/set_shelf_display.php", requestOptions)
                .then(response => response.json())
                .then(res => {
                    //console.log("Signature Uploaded", result);
                    console.log('add payment res', res);
                    if (res?.status == 'success') {
                        Alert.alert('Shelf Display', 'Data saved successfully', [
                            { text: 'OK', onPress: () => navigation.goBack() }
                        ])
                    }
                })
                .catch(error => console.log('add image error', error));
        }

        else {
            Alert.alert('Warning', 'Please enter all the details')
        }
    }




    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={{ ...styles.headercontainer }}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 5 }}>
                    <AntDesign name='arrowleft' size={25} color={Colors.black} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Add Product Details</Text>
            </View>
            <View style={{ paddingHorizontal: 16, flex: 1 }}>
                {/* <Text style={styles.modalTitle}>Amount (INR)</Text>
                <TextInput style={styles.cNameTextInput} placeholder='Amount'
                    onChangeText={text => setAmount(text)}
                    keyboardType='numeric' /> */}

                {/* <Text style={styles.modalTitle}>Category</Text>
                <View style={styles.dropDownContainer}>
                    <Dropdown
                        style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        itemTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        iconStyle={styles.iconStyle}
                        data={categoryOption}
                        //search
                        maxHeight={400}
                        labelField="label"
                        valueField="value"
                        placeholder={!isFocus ? 'Select category' : '...'}
                        //searchPlaceholder="Search..."
                        value={category}
                        onFocus={() => setIsFocus(true)}
                        onBlur={() => setIsFocus(false)}
                        onChange={item => {
                            setCategory(item.value);
                            setIsFocus(false);
                        }}
                  
                    />
                </View> */}
                <View>
                    <Text style={styles.modalTitle}>HSN</Text>
                    <TextInput style={styles.cNameTextInput} placeholder='HSN'
                        onChangeText={text => setShelfId(text)}
                        autoCapitalize='none'
                    />
                </View>
                <View>
                    <Text style={styles.modalTitle}>Product Image</Text>
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
                    </View>
                    {base64img && <Image source={{ uri: base64img }} style={styles.imgStyle} />}
                </View>
                <View>
                    <Text style={styles.modalTitle}>Packing size</Text>
                    <TextInput style={styles.cNameTextInput} placeholder='Packing size'
                        onChangeText={text => setShelfId(text)}
                        autoCapitalize='none'
                    />
                </View>
                <View>
                    <Text style={styles.modalTitle}>MRP</Text>
                    <TextInput style={styles.cNameTextInput} placeholder='MRP'
                        onChangeText={text => setShelfId(text)}
                        autoCapitalize='none'
                    />
                </View>
                <View>
                    <Text style={styles.modalTitle}>GST (%)</Text>
                    <TextInput style={styles.cNameTextInput} placeholder='GST '
                        onChangeText={text => setShelfId(text)}
                        autoCapitalize='none'
                    />
                </View>

              
            </View>
            <View style={{ justifyContent: 'flex-end', padding: 16 }}>
                <View style={styles.buttonview}>
                    <TouchableOpacity style={styles.buttonContainer}
                        onPress={addShelfDisplay}
                    >
                        <Text style={styles.buttonText}>Add</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>


    )
}

export default AddInventory

