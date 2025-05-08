import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, Image, Modal, TextInput, PermissionsAndroid, FlatList } from 'react-native'
import React, { useState, useContext, useEffect, useRef } from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';

import Entypo from 'react-native-vector-icons/Entypo';
import { AnimatedFAB } from "react-native-paper";

import Icon from 'react-native-vector-icons/FontAwesome';
import { Table, TableWrapper, Row, Cell } from 'react-native-reanimated-table';

import Colors from '../../constants/Colors';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { cameraPermission } from '../../utils/Helper';
import { AuthContext } from '../../Context/AuthContext';
import ImageResizer from '@bam.tech/react-native-image-resizer'
import RNFS from 'react-native-fs';
import globalStyles from '../../styles/globalStyles';
import { TextInput as TextInput1, Button as Button1 } from "react-native-paper";
import { hs, vs, ms } from "../../utils/Metrics";
import LinearGradient from "react-native-linear-gradient";

const CompetitorIntelligence = ({ navigation, route, visible, extended, label, animateFrom }) => {

    const { item } = route.params;
    //console.log("dealer data", dealerData);
    // console.log("product data", item);

    const { token, dealerData, userData, tourPlanId, checkInDocId } = useContext(AuthContext);
    const [isExtended, setIsExtended] = useState(true);

    const [isModalVisible, setModalVisible] = useState(false);
    const [cmpdata, setCmpData] = useState([]);
    const [modelNo, setModelNo] = useState('');
    const [companyName, setCompanyName] = useState('');

    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [packs, setPacks] = useState('');
    const [desc, setDesc] = useState('')
    const [base64img, setBase64img] = useState('');
    const [selectedRowData, setSelectedRowData] = useState(null);
    const [tableHeight, setTableHeight] = useState(0);
    const [selectedValue1, setSelectedValue1] = useState(null);


    const clearModalValue = () => {
        setModelNo('');
        setPrice('');
        setQuantity('');
        setPacks('');
        setDesc('');
        setBase64img('');
        setCompanyName("");
    }

    const onScroll = ({ nativeEvent }) => {
        const currentScrollPosition =
            Math.floor(nativeEvent?.contentOffset?.y) ?? 0;

        setIsExtended(currentScrollPosition <= 0);
    };

    const widthArr = [120, 100, 100, 100, 100, 100, 100];
    const widthArr1 = [50];

    const refRBSheet1 = useRef();
    const refRBSheet2 = useRef();

    const onTableLayout = event => {
        const { height } = event.nativeEvent.layout;
        setTableHeight(height);
    };

    const handleSelect1 = value => {
        setSelectedValue1(value);
        refRBSheet1.current.close();
    };

    const formatDate = (dateTimeString) => {
        const date = new Date(dateTimeString);
        // Format the date and time as desired, excluding seconds
        const formattedDateTime = `${date.toLocaleDateString()} `;
        return formattedDateTime;
    };

    // const getProductCmpRecordId = async () => {
    //     console.log("loading cmp product");
    //     var myHeaders = new Headers();
    //     myHeaders.append("Content-Type", "application/json");

    //     var raw = JSON.stringify({
    //         "__userid__": token,
    //         "__account_id__": dealerData?.account_id_c,

    //     });

    //     var requestOptions = {
    //         method: 'POST',
    //         headers: myHeaders,
    //         body: raw,
    //         redirect: 'follow'
    //     };

    //     fetch("https://dev.ordo.primesophic.com/get_competitor_analysis_product_id.php", requestOptions)
    //         .then(response => response.json())
    //         .then(result => {
    //             console.log("get cmp record id res", result);
    //             result.forEach(itm => {
    //                 if (itm.product_id == item?.id) {
    //                     loadCmpProduct(itm.id);
    //                     return;
    //                 }

    //             });

    //         })
    //         .catch(error => console.log('error', error));
    // }

    const loadCmpProduct = async (id) => {

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${userData.token}`);




        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch(`https://gsidev.ordosolution.com/api/competitor/?account_id=${dealerData.account_id}&product=${item.id}&ordo_user=${userData.id}`, requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log("product cmp res", result);
                setCmpData(result)
            })
            .catch(error => console.log('error', error));

    }

    useEffect(() => {
        loadCmpProduct();
    }, [])

    const handleAdd = () => {
        if (companyName && price && quantity && packs && desc) {
            setModalVisible(false);
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", `Bearer ${userData.token}`);


            var raw = JSON.stringify({
                "account_id": dealerData?.account_id,
                "name": companyName,
                "price": price,
                "quantity_sold": quantity,
                "pack_of": packs,
                "remarks": desc,
                "product": item.id,
                "ordo_user": userData.id,
                "comp_image": base64img,
                "model": modelNo,
                "plan": null,
                "sales_checkin": checkInDocId
            });



            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            console.log("rawwwww", raw)

            fetch("https://gsidev.ordosolution.com/api/competitor/", requestOptions)
                .then(response => response.json())
                .then(result => {
                    console.log('add ompetetor item  res', result);
                    // const newItem = {
                    //     id: modelNo,
                    //     model: modelNo,
                    //     price: price,
                    //     quantity_sold: quantity,
                    //     pack_of: packs,
                    //     remarks: desc,
                    //     image_url: base64img
                    // };
                    // setCmpData(prevData => [...prevData, newItem]);
                    loadCmpProduct();
                    clearModalValue();

                })
                .catch(error => console.log('error', error));


        }
        else {
            Alert.alert('Error', 'Please fill all the details')
        }



    };

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
                        console.log('base64', res);
                        setBase64img(`data:${type};base64,${res}`);
                    });
            })
            .catch((err) => {
                console.log(" img resize error", err)
            });
    }
    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <LinearGradient
                colors={Colors.linearColors}
                start={Colors.start} end={Colors.end}
                locations={Colors.location}
                style={{ flex: 1 }}

            >

                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Image
                            source={require("../../assets/images/Refund_back.png")}
                            style={{ height: 30, width: 30 }}
                        />
                    </TouchableOpacity>
                    <View
                        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
                    >
                        <Text
                            style={{
                                fontSize: 20,
                                color: 'white',
                                fontFamily: "AvenirNextCyr-Bold",
                            }}
                        >
                            Competitor Analysis
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={styles.filterButton}
                        onPress={() => {
                            toggleModal();
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 10,
                                color: 'white',
                                fontFamily: "AvenirNextCyr-Medium",
                                marginLeft: 5,
                            }}
                        >       </Text>
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1, borderTopLeftRadius: 20, borderTopRightRadius: 20, backgroundColor: '#F5F5F5' }}>
                    <View style={styles.elementsView}>
                        <View style={{ flex: 0.35, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderRadius: 5, borderColor: '#4b0482', margin: 0 }}>
                            {/* <Image source={ {uri:productData[0].product_image}}/> */}
                            {/* <Image source={{uri: item.product_image.startsWith("http")
          ? item.product_image
          : `https://gsidev.ordosolution.com${item.product_image}`,
      }} style={{ width: 60, height: 80, resizeMode: 'contain' }} />
                             */}
                            {item.product_image && item.product_image.length > 0 ? (
                                <Image
                                    source={{uri: item.product_image.startsWith("http")
          ? item.product_image
          : `https://gsidev.ordosolution.com${item.product_image}`,
      }} // Use the first image
                                    style={{ width: 60, height: 80, resizeMode: 'contain' }}
                                />
                            ) : (
                                <Image
                                    source={require("../../assets/images/noImagee.png")} // Use default image
                                    style={{ width: 60, height: 80, resizeMode: 'contain' }}
                                />
                            )}
                        </View>

                        <View style={{ flex: 0.5, marginLeft: '7%' }}>
                            <Text style={{ ...styles.text, fontFamily: "AvenirNextCyr-Medium", color: '#4b0482', fontSize: 16, marginLeft: '3%' }}>{item.name}</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Entypo name='dot-single' size={20} color={'#4b0482'} />

                                <Text style={{ ...styles.text, color: 'black', fontSize: 14 }}>{item.brand?.brand_name}</Text>
                            </View>

                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Entypo name='dot-single' size={20} color={'#4b0482'} />

                                <Text style={{ ...styles.text, color: 'black', fontSize: 14 }}>{item.supplier?.supplier_name}</Text>
                            </View>

                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Entypo name='dot-single' size={20} color={'#4b0482'} />

                                <Text style={{ ...styles.text, color: 'black', fontSize: 14 }}>{item.currency}  {Number(item.product_price)}</Text>
                            </View>
                            {/* <Text style={styles.text}>{item.description}</Text> */}
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
                        fontFamily: "AvenirNextCyr-Medium",
                        color: '#4b0482',
                        paddingLeft: 15,
                        marginBottom: 5
                    }}>Competitor Items History</Text>}

                    <ScrollView>
                        <View style={{ flexDirection: 'row', marginBottom: '5%', marginTop: '2%' }}>
                            <ScrollView horizontal={true}>
                                <View style={styles.container6} onLayout={onTableLayout}>
                                    <ScrollView style={styles.dataWrapper}>
                                        <Table borderStyle={{}}>
                                            <Row
                                                data={[
                                                    'Product',
                                                    'SKU No',
                                                    'Name',
                                                    'Pack Size',
                                                    'Price',
                                                    'Created Date',
                                                    'Qty Sold',

                                                ]}
                                                widthArr={widthArr}
                                                style={styles.tableHeader}
                                                textStyle={styles.headerText2}
                                            />
                                            {cmpdata.map((rowData, index) => (
                                                <TableWrapper key={index} style={styles.row}>

                                                    <Cell
                                                        data={rowData.comp_image && <Image source={{ uri: rowData.comp_image }} style={{ width: 40, height: 40, resizeMode: 'cover', borderRadius: 8 }} />}
                                                        width={widthArr[1]}
                                                        textStyle={styles.text}
                                                    />
                                                    <Cell
                                                        data={rowData.model}
                                                        width={widthArr[2]}
                                                        textStyle={styles.text2}

                                                    />
                                                    <Cell
                                                        data={rowData.name}
                                                        width={widthArr[2]}
                                                        textStyle={styles.text2}

                                                    />
                                                    <Cell
                                                        data={rowData.pack_of}
                                                        width={widthArr[3]}
                                                        textStyle={styles.text3}
                                                    />
                                                    <Cell
                                                        data={rowData.price}
                                                        width={widthArr[4]}
                                                        textStyle={styles.text3}
                                                    />

                                                    <Cell
                                                        data={formatDate(rowData.created_at)}
                                                        width={widthArr[0]}
                                                        textStyle={styles.text3}
                                                    />
                                                    <Cell
                                                        data={rowData.quantity_sold}
                                                        width={widthArr[3]}
                                                        textStyle={styles.text3}
                                                    />
                                                </TableWrapper>
                                            ))}
                                        </Table>
                                    </ScrollView>
                                </View>
                            </ScrollView>
                            {/* <View
 style={{
 backgroundColor: Colors.lightGrey,
 height: tableHeight,
 width: 50,
 borderRadius: 9,
 justifyContent: 'center',
 alignItems: 'center',
 }}> */}
                            {/* <Table borderStyle={{}}>
 <Row
 data={[
 <TouchableOpacity
 onPress={() => refRBSheet2.current.open()}>
 <Feather
 name="settings"
 size={23}
 color="black"
 style={{alignSelf: 'center'}}
 />
 </TouchableOpacity>,
 ]}
 widthArr={widthArr1}
 style={styles.tableHeader1}
 />
 {cmpdata.map((rowData, index) => (
 <TableWrapper key={index} style={styles.row2}>
 <Cell
 data={rowData.product_name}
 width={widthArr1[0]}
 />
 </TableWrapper>
 ))}
 </Table> */}
                            {/* </View> */}
                        </View>
                    </ScrollView>
                    {/* <FlatList
                        data={cmpdata}
                        onScroll={onScroll}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => {
                            //repalcing ' and " values 
                            let sQuote = item.remarks.replaceAll('&#039;', `'`)
                            let dQuote = sQuote.replaceAll('&quot;', `"`)

                            return (
                           

                                <View style={{
                                    flex: 1, backgroundColor: "white",
                                    margin: 5,
                                    flexDirection: 'row',
                                    marginBottom: 16,
                                    borderRadius: 8,
                                    elevation: 5,
                                    ...globalStyles.border,
                                    padding: 8
                                }}>

                                    <View style={{ flex: 0.4, justifyContent: 'center', alignItems: 'center' }}>
                                        <Image source={{ uri: item.comp_image }} style={{ width: 60, height: 80, resizeMode: 'contain' }} />
                                    </View>

                                    <View style={{ flex: 0.8 }}>


                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Text style={{ ...styles.text,  fontFamily: "AvenirNextCyr-Medium", color: Colors.primary }}>{item.name}</Text>
                                            <Text style={styles.text}>INR  {Number(item.price)}</Text>


                                        </View>


                                        <Text style={styles.text}>Pack Size : {item.pack_of}</Text>
                                        <Text style={styles.text}>Qty Sold : {item.quantity_sold}</Text>

                                        <Text style={{ ...styles.text, color: 'grey', fontFamily: 'Poppins-Italic' }}>{dQuote}</Text>

                                    </View>
                                </View>

                            )
                        }

                        }
                    /> */}


                    <Modal
                        visible={isModalVisible}
                        animationType="slide"
                        transparent={true}
                    >
                        {/* Modal content */}
                        <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 10, }}>
                                <View style={{ backgroundColor: 'white', padding: 20, width: '90%', marginHorizontal: 10, borderRadius: 10, borderColor: 'black', borderWidth: 1 }}>
                                    {/* new */}
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                                        <Text style={{ ...styles.modalTitle, color: Colors.primary }}>Competitor Details</Text>
                                        <TouchableOpacity onPress={() => {
                                            setModalVisible(false);
                                            clearModalValue();
                                        }}>
                                            <AntDesign name='close' size={20} color={`black`} />
                                        </TouchableOpacity>

                                    </View>


                                    <TextInput1
                                        mode="outlined"
                                        label="Company/Product"
                                        theme={{ colors: { onSurfaceVariant: "black" } }}
                                        activeOutlineColor="#4b0482"
                                        // placeholder="Enter User Name"
                                        outlineColor="#B6B4B4"
                                        textColor="black"
                                        onChangeText={(text) => setCompanyName(text)}
                                        autoCapitalize="none"
                                        blurOnSubmit={false}
                                        value={companyName}
                                        // keyboardType="number-pad"
                                        returnKeyType="done"
                                        outlineStyle={{ borderRadius: ms(10) }}
                                        style={{ marginBottom: "2%", height: 50, backgroundColor: "white" }}
                                    />





                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{ flex: 1 }}>

                                            <TextInput1
                                                mode="outlined"
                                                label="Model/SKU#"
                                                theme={{ colors: { onSurfaceVariant: "black" } }}
                                                activeOutlineColor="#4b0482"
                                                // placeholder="Enter User Name"
                                                outlineColor="#B6B4B4"
                                                textColor="black"
                                                onChangeText={(text) => setModelNo(text)}
                                                autoCapitalize="none"
                                                blurOnSubmit={false}
                                                value={modelNo}
                                                // keyboardType="number-pad"
                                                returnKeyType="done"
                                                outlineStyle={{ borderRadius: ms(10) }}
                                                style={{ marginBottom: "2%", height: 50, backgroundColor: "white" }}
                                            />


                                        </View>



                                        <View style={{ flex: 1, marginLeft: 5 }}>
                                            {/* <Text style={styles.modalTitle}>Price</Text>
                                            <TextInput style={styles.cNameTextInput} placeholder='Enter Price' value={price}
                                                onChangeText={text => setPrice(text)} keyboardType='numeric' /> */}

                                            <TextInput1
                                                mode="outlined"
                                                label="Pack Size"
                                                theme={{ colors: { onSurfaceVariant: "black" } }}
                                                activeOutlineColor="#4b0482"
                                                // placeholder="Enter User Name"
                                                outlineColor="#B6B4B4"
                                                textColor="black"
                                                onChangeText={(text) => setPacks(text)}
                                                autoCapitalize="none"
                                                blurOnSubmit={false}
                                                value={packs}
                                                keyboardType="number-pad"
                                                returnKeyType="done"
                                                outlineStyle={{ borderRadius: ms(10) }}
                                                style={{ marginBottom: "2%", height: 50, backgroundColor: "white" }}
                                            />
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{ flex: 1 }}>

                                            <TextInput1
                                                mode="outlined"
                                                label="Qty Sold/Month"
                                                theme={{ colors: { onSurfaceVariant: "black" } }}
                                                activeOutlineColor="#4b0482"
                                                // placeholder="Enter User Name"
                                                outlineColor="#B6B4B4"
                                                textColor="black"
                                                onChangeText={(text) => setQuantity(text)}
                                                autoCapitalize="none"
                                                blurOnSubmit={false}
                                                value={quantity}
                                                keyboardType="number-pad"
                                                returnKeyType="done"
                                                outlineStyle={{ borderRadius: ms(10) }}
                                                style={{ marginBottom: "2%", height: 50, backgroundColor: "white" }}
                                            />
                                        </View>
                                        <View style={{ flex: 1, marginLeft: 5 }}>

                                            {/* new */}
                                            <TextInput1
                                                mode="outlined"
                                                label="Price"
                                                theme={{ colors: { onSurfaceVariant: "black" } }}
                                                activeOutlineColor="#4b0482"
                                                // placeholder="Enter User Name"
                                                outlineColor="#B6B4B4"
                                                textColor="black"
                                                onChangeText={(text) => setPrice(text)}
                                                autoCapitalize="none"
                                                blurOnSubmit={false}
                                                value={price}
                                                keyboardType="number-pad"
                                                returnKeyType="done"
                                                outlineStyle={{ borderRadius: ms(10) }}
                                                style={{ marginBottom: "2%", height: 50, backgroundColor: "white" }}
                                            />
                                        </View>
                                    </View>


                                    <TextInput1
                                        mode="outlined"
                                        label="Remarks"
                                        // multiline={true}
                                        // numberOfLines={5}
                                        theme={{ colors: { onSurfaceVariant: "black" } }}
                                        activeOutlineColor="#4b0482"
                                        // placeholder="Enter User Name"
                                        outlineColor="#B6B4B4"
                                        textColor="black"
                                        onChangeText={(text) => setDesc(text)}
                                        autoCapitalize="none"
                                        blurOnSubmit={false}
                                        value={desc}
                                        // keyboardType="number-pad"
                                        returnKeyType="done"
                                        outlineStyle={{ borderRadius: ms(10) }}
                                        style={{ marginBottom: "2%", height: 50, backgroundColor: "white" }}
                                    />
                                    {/* <Text style={styles.modalTitle}>Remarks</Text>
                <TextInput
                  multiline={true}
                  numberOfLines={8}
                  placeholder="Enter Text..."
                  style={styles.textarea}
                  onChangeText={(val) => { setDesc(val) }}
                  //onChangeText={(text) => this.setState({ text })}
                  value={desc}
                />
                 */}


                                    <Text style={{ ...styles.modalTitle, color: Colors.primary, marginTop: '3%' }}>Upload Photo</Text>
                                    <View style={styles.buttonview}>
                                        <LinearGradient
                                            colors={Colors.linearColors}
                                            start={Colors.start}
                                            end={Colors.end}
                                            locations={Colors.ButtonsLocation}
                                            style={{ borderRadius: 8 }}
                                        >
                                            <TouchableOpacity
                                                style={{ ...styles.photosContainer, paddingTop: 8 }}
                                                onPress={checkPermission}
                                            >
                                                <AntDesign
                                                    name="camera"
                                                    size={25}
                                                    color={Colors.white}
                                                />
                                            </TouchableOpacity>
                                        </LinearGradient>



                                        <LinearGradient
                                            colors={Colors.linearColors}
                                            start={Colors.start}
                                            end={Colors.end}
                                            locations={Colors.ButtonsLocation}
                                            style={{ borderRadius: 8, marginHorizontal: "5%" }}
                                        >
                                            <TouchableOpacity
                                                style={styles.photosContainer}
                                                onPress={handleGallery}
                                            >
                                                <Text style={styles.buttonText}>Gallery</Text>
                                            </TouchableOpacity>
                                        </LinearGradient>
                                        {/* <View style={styles.closeView}>
                        <Button title="Close" onPress={() => setModalVisible1(false)} />
                      </View> */}
                                    </View>
                                    {base64img && <Image source={{ uri: base64img }} style={{ width: 90, height: 90, resizeMode: 'cover', borderRadius: 8 }} />}

                                    <View style={styles.buttonview}>
                                        <LinearGradient
                                            colors={Colors.linearColors}
                                            start={Colors.start}
                                            end={Colors.end}
                                            locations={Colors.ButtonsLocation}
                                            style={{ borderRadius: 10, flex: 1 }}
                                        >
                                            <TouchableOpacity style={styles.buttonContainer} onPress={handleAdd} >
                                                <Text style={styles.buttonText}>Submit</Text>
                                            </TouchableOpacity>
                                        </LinearGradient>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </Modal>
                </View>
                <AnimatedFAB
                    label={"Competitor  "}
                    icon={(name = "plus")}
                    color={"white"}
                    style={styles.fabStyle}
                    fontFamily={"AvenirNextCyr-Medium"}
                    extended={isExtended}
                    // onPress={() => console.log('Pressed')}
                    visible={visible}
                    animateFrom={"right"}
                    iconMode={"static"}
                    onPress={() => setModalVisible(true)}
                />
            </LinearGradient>
        </View>
    )
}

export default CompetitorIntelligence

const styles = StyleSheet.create({
    header: {
        paddingHorizontal: 10,
        paddingVertical: 15,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 5,
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: "AvenirNextCyr-Medium",
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
        fontFamily: "AvenirNextCyr-Medium",
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
        fontFamily: "AvenirNextCyr-Medium",
    },
    modalTitle: {
        fontSize: 16,
        color: 'black',
        fontFamily: "AvenirNextCyr-Medium"
    },
    cNameTextInput: {
        height: 40,
        borderWidth: 1,
        borderColor: '#B3B6B7',
        padding: 5,
        fontFamily: "AvenirNextCyr-Medium",
        marginBottom: 10
    },
    buttonview: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: '2%',
        marginBottom: '2%'
    },
    buttonContainer: {
        height: 50,
        padding: 10,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    photosContainer: {
        height: 40,
        padding: 10,
        borderRadius: 10,
    },
    buttonText: {
        fontFamily: "AvenirNextCyr-Medium",
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
        fontFamily: "AvenirNextCyr-Medium",


    },
    text: {
        fontFamily: "AvenirNextCyr-Medium",
    },
    elementsView: {
        backgroundColor: "white",
        margin: '5%',
        marginBottom: 16,
        borderRadius: 8,
        elevation: 5,
        ...globalStyles.border,
        padding: 10,
        flexDirection: 'row',
        flex: 0.2,
    },
    fabStyle: {
        borderRadius: 50,
        position: "absolute",
        margin: 10,
        right: 0,
        bottom: 0,
        backgroundColor: Colors.primary,
    },
    headerText2: {
        fontSize: 14,
        color: Colors.white,
        fontFamily: "AvenirNextCyr-Medium",
    },
    textStyle: {
        fontSize: 17,
        fontWeight: '500',
        color: Colors.black,
    },
    graycircle1: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-end',
    },
    modelBtn: {
        backgroundColor: Colors.lightgreen,
        padding: 6,
        borderRadius: 10,
        elevation: 2,
    },
    container6: {
        flexDirection: 'column',
        borderColor: '#000',
        borderRadius: 5
    },




    cell: {
        flex: 1,
        textAlign: 'center',
        paddingVertical: '1%',
        color: 'gray',
        marginHorizontal: 10

    },
    tableHeader: {
        height: 60,
        paddingHorizontal: 20,
        backgroundColor: '#4b0482',
        borderRadius: 10,
        borderBottomColor: 'white',
        borderBottomWidth: 10,
        borderBottomLeftRadius: 10,
        marginHorizontal: 18
    },

    tableHeader1: {
        height: 59,
        backgroundColor: '#F3F5F8',
        // borderBottomColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        width: 70,
        borderBottomWidth: 10,
        marginHorizontal: 18,

    },
    text: { fontFamily: "AvenirNextCyr-Medium", color: '#4b0482', fontSize: 15 },
    text2: { fontFamily: "AvenirNextCyr-Medium", color: '#4b0482', fontSize: 15, paddingLeft: 10 },
    text3: { fontFamily: "AvenirNextCyr-Medium", color: '#4b0482', fontSize: 15, paddingLeft: 15 },

    dataWrapper: { marginTop: -1 },
    paddingHorizontal: 10,

    row: {
        height: 60,
        borderBottomColor: '#f5f5f5',
        borderBottomWidth: 8,
        paddingHorizontal: 25,
        flexDirection: 'row',
        borderRadius: 10,
        backgroundColor: '#FBFBFB',
        marginTop: 10,
        marginLeft: 16,
        marginRight: 16,
        width: 720


    },

    inCommingLeadBox: {
        flexDirection: 'column',
        backgroundColor: 'white',
        borderTopLeftRadius: 29,
        borderTopRightRadius: 29,
        paddingHorizontal: '1%',
    },
    searchBox: {
        paddingHorizontal: '2%',
        marginVertical: '5%',
        flexDirection: 'column',
        height: 60,
        borderColor: Colors.lightGrey,
        borderWidth: 1,
        borderRadius: 15,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
        color: 'gray',
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
    headerText: {
        fontSize: 13,
        color: Colors.darkgrey,
        width: '60%',
        fontFamily: "AvenirNextCyr-Medium",
    },
    title5: {
        fontSize: 16,
        color: Colors.black,
        fontFamily: "AvenirNextCyr-Medium",
    },
    dropdown: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 15,
        paddingHorizontal: '6%',
        marginBottom: '5%',
    },


    closeButton2: {
        backgroundColor: Colors.lightgreen,
        borderRadius: 11,
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    VideoImage2: {
        height: 200,
        width: '100%',
    },
    VideoBackg: {
        paddingHorizontal: '5%',
        paddingVertical: '4%',
        backgroundColor: Colors.white,
        borderRadius: 20,
        marginTop: '2%',
        marginHorizontal: '5%',
    },
    dropdownHead: {
        fontFamily: "AvenirNextCyr-Medium",
        color: Colors.black,
        fontSize: 20,
        textAlign: 'center',
        fontFamily: "AvenirNextCyr-Medium",
    },
    dowpDownView: {
        height: 5,
        width: '17%',
        backgroundColor: Colors.darkgrey,
        marginVertical: '3%',
        borderRadius: 10,
        alignSelf: 'center',
    },
    sortBtn: {
        backgroundColor: '#DBE4FB',
        alignItems: 'flex-end',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: '4%',
        borderRadius: 15,
        height: 60,
    },
    dowpDownText: {
        color: Colors.black,
        fontFamily: "AvenirNextCyr-Medium",
        fontSize: 17,
    },
    dropdownBox: {
        padding: 10,
        marginBottom: '1%',
        marginHorizontal: '5%',
    },
    nameText: {
        fontSize: 23,
        color: Colors.black,
        fontFamily: "AvenirNextCyr-Medium",
        marginBottom: '5%',
    },
    dataText: {
        fontSize: 15,
        marginBottom: 10,
        color: Colors.black,
        fontFamily: "AvenirNextCyr-Medium",
    },
})