import { Alert, Text, View, TouchableOpacity, Image, Modal, TextInput, FlatList } from 'react-native'
import styles from './style'
import React, { useContext, useState, useEffect } from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign';
import Colors from '../../constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../../Context/AuthContext';
import moment from 'moment';
import { ProgressDialog } from 'react-native-simple-dialogs';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { cameraPermission } from '../../utils/Helper';
import ImageResizer from '@bam.tech/react-native-image-resizer'
import RNFS from 'react-native-fs';
import { Dropdown } from 'react-native-element-dropdown';
import globalStyles from '../../styles/globalStyles';

const MerchIntake = ({ navigation }) => {

    const { token, dealerData, tourPlanId,userData } = useContext(AuthContext);
    const [data, setData] = useState(false);
    const [noData, setNoData] = useState(false);

    console.log("token", token);
    console.log("dealer id", dealerData);

    const getData = () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "__user_id__": token,
            "__account_id__": dealerData?.id,
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
      
        fetch("https://dev.ordo.primesophic.com/get_intake.php", requestOptions)
            .then(response => response.json())
            .then(res => {
                console.log("intake details", res);
                // if (Array.isArray(res?.miscellaneous_array) && res?.miscellaneous_array.length > 0) {
                    // setNoData(false)
                    setData(res);
                // }
                // else {
                //     setNoData(true)
                // }
            })
            .catch(error => console.log('api error', error));
    }
    useFocusEffect(
        React.useCallback(() => {
            getData();

        }, [])
    );


    const renderItem = ({ item, index }) => {
        //let color = item.status == 'Approved' ? 'green' : item.status == 'Pending' ? 'orange' : 'red';
        return (
            <TouchableOpacity
                style={styles.itemContainer}
                onPress={() => navigation.navigate('MerchIntakeDetails', { item: item })}
                activeOpacity={0.5}
            >
{/* first view */}
                <View style={{flexDirection:'row',flex:1,paddingHorizontal:15}}>
                <View style={{flex:0.5,marginLeft:10}}>
                <View style={{ flexDirection: 'row' }}>
            {/* <Image
                style={{ marginRight: 10, height: 15, width: 15, resizeMode: 'contain',marginTop:3 }}
                source={require('../../assets/images/document2.png')} /> */}
        <View style={{ flexDirection: 'column', alignItems: 'center' }}>

            {/* <Text style={{ color: 'black', fontFamily: 'AvenirNextCyr-Thin' }}>Name</Text> */}
            <Text style={styles.title}>{item?.name}</Text>
        </View>

    </View>

    



    <View style={{ flexDirection: 'row', marginTop: 3 }}>
                {/* <Image
                    style={{ marginRight: 10, height: 15, width: 15, resizeMode: 'contain',marginTop:3}}
                    source={require('../../assets/images/invoice2.png')} /> */}
            <View style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                <Text style={{ color: 'black', fontFamily: 'AvenirNextCyr-Thin' }}>Invoice#</Text>
            <Text style={{ ...styles.text, fontFamily: 'AvenirNextCyr-Thin' }}>{item?.invoice_id}</Text>
            </View>

    </View>
                    </View>


{/* 2nd view */}
<View style={{flex:0.5,alignItems:'flex-start',marginLeft:20}}>
                  
   
    <View style={{ flexDirection: 'row', marginTop: 3 }}>
                {/* <Image
                    style={{ marginRight: 10, height: 15, width: 15, resizeMode: 'contain' ,marginTop:3}}
                    source={require('../../assets/images/exam.png')} /> */}
            <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                {/* <Text style={{ color: 'black', fontFamily: 'AvenirNextCyr-Thin' }}>Intake Type</Text> */}
  <Text style={{ ...styles.text, fontFamily: 'AvenirNextCyr-Medium' , color: item?.intake_type === 'Fresh' ? 'green' : 'orange' }}>{item?.intake_type}</Text>
            </View>

    </View>
    <View style={{ flexDirection: 'row', marginTop: 3 }}>
                {/* <Image
                    style={{ marginRight: 10, height: 15, width: 15, resizeMode: 'contain',marginTop:3 }}
                    source={require('../../assets/images/duration.png')} /> */}
            <View style={{ flexDirection: 'column', alignItems:'flex-start' }}>
                <Text style={{ color: 'black', fontFamily: 'AvenirNextCyr-Thin' }}>Delivery Order#</Text>
            <Text style={{ ...styles.text, fontFamily: 'AvenirNextCyr-Thin' }}>{item?.order_id}</Text>
            </View>

    </View>

                  

                    </View>
                    {/* <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 3,
                    }}>
                        <Image
                            style={{ marginRight: 10, height: 15, width: 15, resizeMode: 'contain' }}
                            source={require('../../assets/images/amount.png')} />
                        <Text style={{ ...styles.text, fontFamily: 'AvenirNextCyr-Medium' }}>{Number(item?.amount)} INR</Text>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 3,
                    }}>
                        <Image
                            style={{ marginRight: 10, height: 15, width: 15, resizeMode: 'contain' }}
                            source={require('../../assets/images/duration.png')} />
                        <Text style={{ ...styles.text, fontWeight: '500' }}>{moment(item.sortedarray).format('DD-MM-YYYY')}</Text>
                    </View> */}
                </View>
            </TouchableOpacity>

        )

    }

    //no data found
    const noDataFound = () => {
        // return (
        //     <View style={styles.noReport}>
        //         <Text style={styles.noReportText}>No data found</Text>
        //     </View>
        // )
    }

    //Add misc Task values
    //intake task hooks value
    const [order, setOrder] = useState('');
    const [invoice, setInvoice] = useState('');
    const [value, setValue] = useState(null);
    const [remarks, setRemarks] = useState('');
    const [isModalVisible2, setModalVisible2] = useState('');


    const [isFocus, setIsFocus] = useState(false);

    const optionData = [
        { label: 'Fresh', value: 'Fresh' },
        { label: 'Rearrange', value: 'Rearrange' },

    ]
    //const [base64img, setBase64img] = useState('');



    // const checkPermission = async () => {
    //     let PermissionDenied = await cameraPermission();
    //     if (PermissionDenied) {
    //         console.log("camera permssion granted");
    //         handleCamera();
    //     }
    //     else {
    //         console.log("camera permssion denied");
    //         //requestStoragePermission();
    //     }
    // }

    const clearModalValue = () => {
        setOrder('');
        setInvoice('');
        setRemarks('');
        setValue(null);
    }


    // const handleCamera = async () => {
    //     // setModalVisible1(false);
    //     const res = await launchCamera({
    //         mediaType: 'photo',
    //     });
    //     console.log("response", res.assets[0].uri);
    //     imageResize(res.assets[0].uri, res.assets[0].type);
    // }
    // const handleGallery = async () => {
    //     // setModalVisible1(false);
    //     const res = await launchImageLibrary({
    //         mediaType: 'photo',

    //     });
    //     console.log("response", res.assets[0].uri);
    //     imageResize(res.assets[0].uri, res.assets[0].type);
    // }


    // const imageResize = async (img, type) => {
    //     ImageResizer.createResizedImage(
    //         img,
    //         300,
    //         300,
    //         'JPEG',
    //         50,

    //     )
    //         .then(async (res) => {
    //             console.log('image resize', res);
    //             RNFS.readFile(res.path, 'base64')
    //                 .then(res => {
    //                     //console.log('base64', res);
    //                     //uploadImage(res)
    //                     setBase64img(`data:${type};base64,${res}`);
    //                 });
    //         })
    //         .catch((err) => {
    //             console.log(" img resize error", err)
    //         });
    // }


    //Miscellaneous task
    const saveData = () => {
        if (order && invoice && remarks && value) {
            setModalVisible2(false);
            console.log("data is valid",)
            //console.log("m type of task", mtask)
            //console.log("m remarks", mRemarks)
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "text/plain");


            var raw = JSON.stringify({
                    "__order_id__":order,
                    "__invoice_id__":invoice,
                    "__intake_type__":value,
                    "__description__":remarks,
                    "__ordo_user_id__":token,
                    "__account_id__":dealerData.id

                    })


            
            // if (base64img) {
            //     raw = {
            //         ...raw,
            //         "__miscellaneous_image__": base64img,
            //         "__image_name__": `${Date.now()}.png`
            //     }
            // }

            //console.log("body", raw)

            // console.log(raw)
            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };
            fetch("https://dev.ordo.primesophic.com/set_intake.php", requestOptions)
                .then(response => response.json())
                .then(res => {
                    console.log("intake api res", res);
                    getData();
                    // if (res?.status == 'success') {
                        // Alert.alert('Intake', 'Data saved successfully', [
                            // { text: 'OK',onPress: () => getData()  }
                        // ])
                    // }

                })
                .catch(error => console.log('intake api error', error));
        }
        else {
            Alert.alert('Warning', 'Please fill all the details')
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.rowContainer}>
                <View style={{ ...styles.headercontainer }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <AntDesign name='arrowleft' size={25} color={Colors.black} />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Intake</Text>
                    </View>
                    <TouchableOpacity onPress={() => {
                        clearModalValue();
                        setModalVisible2(true);
                    }} >
                        <AntDesign name='plus' size={20} color={Colors.primary} />

                        <Text style={{ fontSize: 10, fontFamily: 'AvenirNextCyr-Thin', color: Colors.primary }}>Add</Text>
                    </TouchableOpacity>


                </View>


            </View>
            {noData && noDataFound()}
            <FlatList
                data={data}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
            />


            <Modal
                visible={isModalVisible2}
                animationType="slide"
                transparent={true}

            >
                {/* Misc Task Modal */}
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 10, }}>
                    <View style={{ backgroundColor: 'white', padding: 20, width: '90%', marginHorizontal: 10, borderRadius: 10, elevation: 5, ...globalStyles.border, }}>
                        {/* new */}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                            <Text style={{ ...styles.modalTitle, color: Colors.primary }}>Intake</Text>
                            <TouchableOpacity onPress={() => setModalVisible2(false)}>
                                <AntDesign name='close' size={20} color={`black`} />
                            </TouchableOpacity>
                        </View>

                        <View>
                            <Text style={{ ...styles.modalTitle }}>Delivery Order#</Text>
                            <TextInput style={styles.cNameTextInput} placeholder='Order'
                                onChangeText={text => setOrder(text)}
                            />
                        </View>


                        <View>
                            <Text style={{ ...styles.modalTitle }}>Invoice#</Text>
                            <TextInput style={styles.cNameTextInput} placeholder='Invoice'
                                onChangeText={text => setInvoice(text)}
                            />
                        </View>

                        <View>
                            <Text style={styles.modalTitle}>Intake Type</Text>
                            <Dropdown
                                style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                itemTextStyle={styles.selectedTextStyle}
                                inputSearchStyle={styles.inputSearchStyle}
                                iconStyle={styles.iconStyle}
                                data={optionData}
                                //search
                                maxHeight={400}
                                labelField="label"
                                valueField="value"
                                placeholder={!isFocus ? 'Select Intake type' : '...'}
                                //searchPlaceholder="Search..."
                                value={value}
                                onFocus={() => setIsFocus(true)}
                                onBlur={() => setIsFocus(false)}
                                onChange={item => {
                                    setValue(item.value);
                                    setIsFocus(false);
                                }}

                            // renderLeftIcon={() => (
                            //   <AntDesign
                            //     style={styles.icon}
                            //     color={isFocus ? 'blue' : 'black'}
                            //     name="Safety"
                            //     size={20}
                            //   />
                            // )}
                            />
                        </View>
                        {/* <View>
                            <Text style={styles.modalTitle}>Upload Image</Text>
                            <View style={{ ...styles.buttonview, alignItems: 'center' }}>
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
                        </View> */}

                        <Text style={styles.modalTitle}>Remarks</Text>
                        {/* new */}
                        <TextInput
                            multiline={true}
                            numberOfLines={3}
                            placeholder="Enter Text..."
                            style={styles.textarea}
                            onChangeText={(val) => { setRemarks(val) }}
                            //onChangeText={(text) => this.setState({ text })}
                            value={remarks}
                        />


                        <View style={styles.buttonview}>
                            <TouchableOpacity style={styles.buttonContainer} onPress={saveData}>
                                <Text style={styles.buttonText}>Submit</Text>
                            </TouchableOpacity>
                            {/* <TouchableOpacity style={styles.buttonContainer} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity> */}
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

export default MerchIntake

