import React, { useState, useContext, useRef, useEffect } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Pressable, Text, Image, Alert, TouchableNativeFeedback, ScrollView } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import globalStyles from '../../styles/globalStyles'
import Toast from 'react-native-simple-toast';

import Colors from '../../constants/Colors';
import { AuthContext } from '../../Context/AuthContext';
import ImageResizer from '@bam.tech/react-native-image-resizer'
import RNFS from 'react-native-fs';
import { cameraPermission } from '../../utils/Helper';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Dropdown } from 'react-native-element-dropdown';
import DatePicker from 'react-native-date-picker'
import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient';
import { LinearTextGradient } from "react-native-text-gradient";
import { ms, hs, vs } from '../../utils/Metrics'
import { PieChart } from 'react-native-gifted-charts'
import Animated, { FadeIn, FadeInLeft } from 'react-native-reanimated';


const Space = ({ navigation }) => {




    //drop down hooks
    const [categoryOption, setCategoryOption] = useState([]);
    const [currencyOption, setCurrencyOption] = useState([]);
    const [taxOption, setTaxOption] = useState([]);
    const [unitOption, setUnitOption] = useState([]);

    const vehicleType = [
        { label: 'Manager 1 ', value: 'B1' },
        { label: 'Manager 2 ', value: 'B2' },
        { label: 'Manager 3 ', value: 'B3' },

    ];

    const { userData } = useContext(AuthContext);




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
                // console.log("category option", categoryArray);
                setCategoryOption(categoryArray);

                //currency dropdown
                const currencyArray = Object.keys(res?.currencies_array).map((key) => ({
                    label: res?.currencies_array[key],
                    value: key,
                }));
                console.log("currency option", currencyArray);
                // setCurrencyOption(currencyArray);

                //tax dropdown
                const taxArray = Object.keys(res?.tax).map((key) => ({
                    label: res?.tax[key],
                    value: key,
                }));
                console.log("tax option", taxArray);
                setTaxOption(taxArray);

                //unit of measure  dropdown
                const unitArray = Object.keys(res?.unitofmeasure).map((key) => ({
                    label: res?.unitofmeasure[key],
                    value: key,
                }));
                console.log("unit of measure option", unitArray);
                setUnitOption(unitArray);


            })
            .catch(error => {
                // Handle the error here
                console.log(error);
            });

    }



    const [base64img, setBase64img] = useState('');
    const { token } = useContext(AuthContext);
    const [name, setName] = useState('');

    const [address, setAddress] = useState('');
    const [street, setStreet] = useState('');
    const [state, setState] = useState('');
    const [city, setCity] = useState('');
    const [zipcode, setZipcode] = useState('');
    const [shelf, setShelf] = useState('');
    const [bin, setBin] = useState('');
    const [room, setRoom] = useState('');


    const imgName = useRef('');



    //cateogry drop down hooks
    const [currency, setCurrency] = useState(null);
    const [isFocus, setIsFocus] = useState(false);
    const [isFocus2, setIsFocus2] = useState(false);
    const [isFocus3, setIsFocus3] = useState(false);
    const [isFocus4, setIsFocus4] = useState(false);





    const optionData = [
        { label: 'Quarterly', value: 'Quarterly' },
        { label: 'Monthly', value: 'Monthly' },
        { label: 'Weekly', value: 'Weekly' },
    ]

    //date picker hooks
    const [mnfdDate, setMnfdDate] = useState("")
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState(new Date())


    // new
    const InputWithLabel = ({ title, value, onPress }) => {
        return (
            <View>
                <Text style={styles.labelText}>{title}</Text>
                <Pressable style={{ ...styles.inputContainer }} onPress={onPress} >
                    <Text style={styles.input2}>{value ? value : 'Select date'}</Text>
                    <Image style={{ width: 20, height: 20, marginRight: 15 }} source={require("../../assets/images/calendar.png")}></Image>
                </Pressable>
            </View>
        )

    }






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
                console.log('name', res.name);
                imgName.current = res.name;

                RNFS.readFile(res.path, 'base64')
                    .then(res => {
                        //console.log('base64', res);
                        setBase64img(`data:${type};base64,${res}`);

                        //setBase64img(res)
                    });
            })
            .catch((err) => {
                console.log(" img resize error", err)
            });
    }



    useEffect(() => {
        //getting all predefined drop down values
        getDropDown();

    }, [])






    const handleSubmit = async () => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${userData.token}`);
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "name": name,
            "street": street,
            "city": city,
            "state": state,
            "zipcode": zipcode,
            "number_of_room": room,
            "number_of_shelf": shelf,
            "number_of_bin": bin,

        });


        console.log("raw", raw)

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        try {
            const response = await fetch("https://gsidev.ordosolution.com/api/warehouse/", requestOptions);
            const result = await response.json();

            console.log("Warehouse Result:", result);
            clearFields();
            Toast.show('Warehouse added successfully', Toast.LONG);

            navigation.goBack()

        } catch (error) {
            console.log('error', error);
        }
    }

    const clearFields = () => {

        setName("");
        setStreet("");
        setCity("");
        setState("");
        setZipcode("");
        setRoom("");
        setShelf("");
        setBin("");
    };





    return (
        <View style={styles.rootContainer}>

            <View style={{ height: '35%', }}>
                <LinearGradient
                    colors={Colors.linearColors}
                    start={Colors.start}end={Colors.end}
                    locations={Colors.location}
                    style={{ borderBottomRightRadius: ms(50), borderBottomLeftRadius: ms(50), paddingHorizontal: '5%', paddingTop: '5%', height: '70%' }}
                >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                        {/* <View style={{ flexDirection: 'row', gap: hs(60) }}> */}


                        <TouchableOpacity onPress={() => { navigation.goBack() }}>
                            <Image source={require('../../assets/images/Refund_back.png')} style={{ height: 30, width: 30 }} />


                        </TouchableOpacity>

                        <View>
                            <Text style={{ color: 'white', fontSize: ms(20), fontFamily: 'AvenirNextCyr-Medium' }}>Space Management</Text>
                            <Text style={{ color: 'white', fontSize: ms(12), fontFamily: 'AvenirNextCyr-Medium' }}>  </Text>

                        </View>
                        <View>
                            <Text style={{ color: 'white', fontSize: ms(20), fontFamily: 'AvenirNextCyr-Medium' }}>     </Text>

                        </View>
                        {/* </View> */}


                    </View>

                    <View style={styles.graphContainer}>
                        <Animated.Image
                            entering={FadeInLeft}
                            style={{ marginRight: 10, height: '130%', width: '130%', resizeMode: 'contain' }}
                            source={require('../../assets/images/warehouse.png')}
                        />
                    </View>


                </LinearGradient>
            </View>

            <ScrollView style={{ paddingHorizontal: 20 }}>


                {/* 
               <Text style={{ ...styles.label, marginTop: '5%' }}>Address</Text>
              <TextInput
                     style={styles.textarea}
                    placeholder="Please enter your Address"
                    value={address}
                    placeholderTextColor="#cecece" 
                    onChangeText={text => setAddress(text)}
                    multiline={true}
                    numberOfLines={5}
                /> */}
   

                <Text style={styles.label}>No. of Floor</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder="Please enter no. of Floor"
                    value={room}
                    placeholderTextColor="#cecece"
                    onChangeText={text => setRoom(text)}
                    keyboardType='numeric'


                />

            

                <Text style={styles.label}>No. of Shelf</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder="Please enter no. of Shelf"
                    placeholderTextColor="#cecece"

                    value={shelf}
                    onChangeText={text => setShelf(text)}
                    keyboardType='numeric'
                />
                <Text style={styles.label}>No. of Bin</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder="Please enter no. of Bin"
                    placeholderTextColor="#cecece"
                    value={bin}
                    onChangeText={text => setBin(text)}
                    keyboardType='numeric'

                />




            </ScrollView>


            <View style={{ paddingHorizontal: 20 }} >
                <LinearGradient colors={Colors.linearColors}
                    start={Colors.start}end={Colors.end}
                    locations={Colors.location}
                    style={{ backgroundColor: Colors.primary, borderColor: Colors.primary, borderRadius: ms(25), justifyContent: 'center', alignItems: 'center', flexDirection: 'row', marginTop: '8%', marginBottom: '5%' }}
                >
                    <TouchableOpacity style={styles.button} onPress={handleSubmit} activeOpacity={0.8}>
                        <Text style={styles.btnText}>Submit</Text>
                    </TouchableOpacity>
                </LinearGradient>
            </View>





        </View>
    )

    // return (
    //     <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
    //         <View style={styles.container}>
    //             <View style={styles.headercontainer}>


    //                 <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    //                     <TouchableOpacity onPress={() => navigation.goBack()}>
    //                         <AntDesign name="arrowleft" size={25} color={Colors.black} />
    //                     </TouchableOpacity>
    //                     <Text style={styles.headerTitle}>Add Vehicle</Text>
    //                 </View>


    //                 {/* <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.primary , borderRadius:10, paddingVertical:'2%', paddingHorizontal:'4%', gap:10}}>

    //                     <MaterialCommunityIcons name="truck-plus-outline" size={25} color='white' />

    //                     <Text style={{fontFamily:'AvenirNextCyr-Medium', color:'white'}}>ADD</Text>


    //                 </TouchableOpacity> */}



    //             </View>





    //             <Text style={{ ...styles.label, marginTop: '5%' }}>Vehicle Number</Text>
    //             <TextInput
    //                 style={styles.textInput}
    //                 placeholder="vehicle number"
    //                 value={partNumber}
    //                 onChangeText={text => setPartNumber(text)}

    //             />

    //             <Text style={styles.label}>Vehicle Type</Text>
    //             <Dropdown
    //                 style={[styles.dropdown]}
    //                 placeholderStyle={styles.placeholderStyle}
    //                 searchPlaceholder='Search'
    //                 selectedTextStyle={styles.selectedTextStyle}
    //                 itemTextStyle={styles.selectedTextStyle}
    //                 inputSearchStyle={styles.inputSearchStyle}
    //                 iconStyle={styles.iconStyle}
    //                 data={vehicleType}
    //                 maxHeight={400}
    //                 labelField="label"
    //                 valueField="value"
    //                 placeholder={!isFocus4 ? 'vehicle type' : '...'}
    //                 //searchPlaceholder="Search..."
    //                 value={currency}
    //                 onFocus={() => setIsFocus4(true)}
    //                 onBlur={() => setIsFocus4(false)}
    //                 onChange={item => {
    //                     setCurrency(item.value);
    //                     setIsFocus4(false);
    //                 }}
    //             />
    //             <Text style={styles.label}>Transport Name</Text>
    //             <TextInput
    //                 style={styles.textInput}
    //                 placeholder="transport name"
    //                 value={name}
    //                 onChangeText={text => setName(text)}
    //             />
    //             <Text style={styles.label}>Transport ID</Text>
    //             <TextInput
    //                 style={styles.textInput}
    //                 placeholder="transport id"
    //                 value={description}
    //                 onChangeText={text => setDescription(text)}
    //             />








    //             {base64img && <Image source={{ uri: base64img }} style={{ width: 90, height: 90, resizeMode: 'cover', borderRadius: 8, marginLeft: 10, marginBottom: 10 }} />}
    //             <TouchableOpacity style={styles.button} onPress={handleSubmit} activeOpacity={0.8}>
    //                 <Text style={styles.btnText}>Submit</Text>
    //             </TouchableOpacity>


    //         </View>
    //     </ScrollView>
    // );
};

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        backgroundColor: '#F2EFEF'

    },
    container: {
        paddingHorizontal: '5%',
        paddingTop: 10,
        backgroundColor: 'white',
        flex: 1,
    },

    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    halfTextInput: {
        flex: 1
    },
    headercontainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: 'AvenirNextCyr-Medium',
        color: Colors.black,
        marginLeft: 10,
        marginTop: 3,
    },
    button: {
        height: vs(30),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: ms(5),
        // backgroundColor: Colors.primary,
        marginBottom: '3%',
        marginTop: '3%',
        borderRadius: 50
    },
    btnText: {
        fontFamily: 'AvenirNextCyr-Medium',
        color: '#fff',
        fontSize: 16,
    },
    buttonview: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    modalTitle: {
        fontSize: 16,
        color: 'black',
        fontFamily: 'AvenirNextCyr-Medium'
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
        fontFamily: 'AvenirNextCyr-Medium',
        color: 'white'
    },
    label: {
        fontSize: 16,
        color: Colors.primary,
        fontFamily: 'AvenirNextCyr-Medium',
        marginTop:5
    },
    dropdown: {
        height: 50,
        borderColor: '#dedede',
        borderWidth: 1,
        //borderRadius: 8,
        paddingHorizontal: 8,
        marginBottom: '5%',
        borderRadius: 10,
        backgroundColor: 'white'
    },
    icon: {
        marginRight: 5,
    },
    // label: {
    //   position: 'absolute',
    //   backgroundColor: 'white',
    //   left: 22,
    //   top: 8,
    //   zIndex: 999,
    //   paddingHorizontal: 8,
    //   fontSize: 14,
    // },
    placeholderStyle: {
        fontSize: 14,
        fontFamily: 'AvenirNextCyr-Medium',
        color: '#cecece',
        // backgroundColor:'white'
    },
    dropdownContainer: {
        backgroundColor: 'white',
        // color:'white'

    },
    selectedTextStyle: {
        fontSize: 16,
        fontFamily: 'AvenirNextCyr-Medium'
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
    labelText: {
        fontFamily: 'AvenirNextCyr-Medium',
        color: Colors.black,
        fontSize: 16,
    },
    inputContainer: {
        borderColor: 'grey',
        borderWidth: 1,
        backgroundColor: 'white',
        height: 40,
        marginBottom: 5,
        //padding:5,
        fontFamily: 'AvenirNextCyr-Medium',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

    },
    input2: {
        fontFamily: 'AvenirNextCyr-Medium',
        padding: 8,
        flex: 1,
    },
    graphContainer: {
        // backgroundColor: 'white',
        borderRadius: 30,
        paddingVertical: '2%',
        paddingHorizontal: '2%',
        position: 'relative',
        bottom: '23%',
        // elevation: 8,
        ...globalStyles.border,

        alignItems: 'center',
    },
    header: {
        // display:'flex',
        // flex: 0.4, // 40% of the parent
        paddingVertical: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        // backgroundColor:'yellow',
        paddingHorizontal: 10,
    },
    textInput: {
        borderColor: '#dedede',
        borderWidth: 1,
        backgroundColor: 'white',
        height: 50,
        marginBottom: '3%',
        padding: 5,
        paddingLeft: 8,


        fontFamily: 'AvenirNextCyr-Medium',
        borderRadius: 10
    },
    textarea: {
        borderColor: '#dedede',
        borderWidth: 1,
        backgroundColor: 'white',
        //margin: 15,
        marginTop: 2,
        borderRadius: 10,
        padding: 10,
        marginBottom: '3%',
        fontSize: 14,
        fontFamily: 'AvenirNextCyr-Medium',
        textAlignVertical: 'top',
        color: '#000',

    },


});

export default Space;
