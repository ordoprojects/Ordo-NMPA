import { StyleSheet, Text, View, BackHandler, Alert, FlatList, TouchableOpacity, Image, Dimensions, Modal, TextInput, ScrollView } from 'react-native'
import React, { useState, useContext, useEffect } from 'react'
import Colors from '../../constants/Colors'
import AntDesign from 'react-native-vector-icons/AntDesign';
import Icon from 'react-native-vector-icons/FontAwesome';

import { Dropdown } from 'react-native-element-dropdown';
import { AuthContext } from '../../Context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import { mt } from 'date-fns/locale';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { cameraPermission } from '../../utils/Helper';
import ImageResizer from '@bam.tech/react-native-image-resizer'
import RNFS from 'react-native-fs';
import { MultipleSelectList } from 'react-native-dropdown-select-list'
import { useFocusEffect } from '@react-navigation/native';
import globalStyles from '../../styles/globalStyles';
import { ms, hs, vs } from '../../utils/Metrics';
import LinearGradient from 'react-native-linear-gradient';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { TextInput as TextInput1, Button as Button1 } from "react-native-paper";
import { Svg, Circle, LinearGradient as LinearGradient1, Stop } from 'react-native-svg';

const CheckOut = ({ navigation, route }) => {

  let showCustomerImage = true;


  const backAction = () => {
    //checking screen is focused
    if (!navigation.isFocused()) {
      return false;
    }
    Alert.alert('Hold on!', 'Are you sure you want to go back?\nIf you leave before checkout, your data will be lost.', [
      {
        text: 'Cancel',
        onPress: () => null,
        style: 'cancel',
      },
      { text: 'YES', onPress: () => deleteCheckin() },
    ]);
    return true;
  };

  //disable back button logic
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, []);

  const { width, height } = Dimensions.get('screen');
  const [isModalVisible, setModalVisible] = useState(false);



  const backIcon = route.params?.backIcon;
  const external = route.params?.external;
  const checkin_id = route.params?.checkin_id;
  const visit_id = route.params?.visit_id;
  const dealerInfo = route.params?.dealerInfo;

  console.log("checkin_id", checkin_id)

  const visitDateKey = route.params?.visitDateKey
  const tour_plan_id = route.params?.tour_plan_id


  console.log("fjgjghg tour plan", tour_plan_id)


  const { token, checkInDocId, dealerData, changeDocId, userData, tourPlanId } = useContext(AuthContext);
  console.log("near by dealer data", dealerData);
  console.log("chakci in id", tour_plan_id);
  console.log("visit date key", visitDateKey);

  useFocusEffect(
    React.useCallback(() => {
      console.log("visit date key", visitDateKey);
    }, []))


  const [desc, setDesc] = useState('')


  //new
  const [value, setValue] = useState([]);
  const [isFocus, setIsFocus] = useState(false);
  //miscellaneous task hooks value
  const [mValue, setMvalue] = useState('');
  const [mtask, setMTask] = useState('');
  const [mRemarks, setMRemarks] = useState('');
  const [isModalVisible2, setModalVisible2] = useState('');
  const [cmpdata, setCmpData] = useState([]);
  const [base64img, setBase64img] = useState('');






  const [price, setPrice] = useState('');
  const [orderBooked, setOrderBooked] = useState('');


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

  const clearModalValue = () => {
    setMvalue('');
    setMRemarks('');
    setBase64img('');
    setValue([]);
    setPrice('');
    setDesc('')


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


  const data = [
    { value: 'Secondary Offtake', key: 'Secondary Offtake', selected: false },
    { value: 'Competitor Analysis', key: 'CompetitorAnalysis', selected: false },
    { value: 'Return', key: 'Return', selected: false },
    { value: 'Misc. Task', key: 'MiscTask', selected: false },
    { value: 'Payment Collection', key: 'PaymentCollection', selected: false },
    { value: 'Shelf Display', key: 'ShelfDisplay', selected: false },
  ];




  const saveCheckOut = async () => {
    if (cmpdata.length > 0 && desc && price) {

      //formnationg purpose of visit array
      const formattedString = cmpdata.map((item) => `${item}`).join(',');


      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${userData.token}`);


      var raw = JSON.stringify({
        // "visit_id": visit_id,
        "sales_checkin": checkin_id,
        "purpose_of_visit": formattedString,
        "last_amount_paid": price,
        "check_out": moment(new Date()).format('YYYY-MM-DD'),
        "report": desc
      });

      console.log("checkout raw", raw)

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };

      await fetch("https://gsidev.ordosolution.com/api/sales_checkin/checkout/", requestOptions)
        .then(response => response.json())
        .then(async result => {
          changeDocId('');
          console.log('checkout save res', result);
          // setModalVisible(false);
          navigation.navigate('Visits')

        })
        .catch(error => console.log('error', error));

    }
    else {
      alert('Please fill all the details');
    }

  }

  const deleteCheckin = async (id) => {

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${userData.token}`);

    raw = {}

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    let url = `https://gsidev.ordosolution.com/api/delete_sales_checkin/?sales_checkin=${checkInDocId}`


    console.log("url", url)

    await fetch(url, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log("delete checkin result", result);
        navigation.goBack();

      })
      .catch(error => console.log('error', error));

  }

  const loadCmpProduct = async (id) => {

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${userData.token}`);




    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };


    // let url=`https://gsidev.ordosolution.com/api/tp_checkinout/?tourplan_id=${tourPlanId}&account_id=${dealerData.account_id}`
    let url = `https://gsidev.ordosolution.com/api/sales_tp_checkinout/?sales_checkin=${checkInDocId}&account_id=${dealerData.account_id}`

    // console.log("lijdlkwjdf", url)
    // console.log("urllll", `https://gsidev.ordosolution.com/api/sales_tp_checkinout/?sales_checkin=${checkInDocId}&account_id=${dealerData.account_id}`)
    fetch(url, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log("product cmp res", result);
        setCmpData(result.sections_with_data)
      })
      .catch(error => console.log('error', error));

  }

  // useEffect(() => {




  //   const selectedItems = data.filter(item => cmpdata[item.key] === 1).map(item => item.key);
  //   console.log(selectedItems);
  //   setValue(selectedItems);
  // }, [userData])

  console.log("purpose visit", cmpdata, value)




  return (
    <View style={styles.container}>
      <LinearGradient
        colors={Colors.linearColors}
        start={Colors.start} end={Colors.end}
        locations={Colors.location}
        style={{ flex: 1 }}

      >
        <View style={styles.header}>
          <TouchableOpacity onPress={backAction}>
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
              Customer Details
            </Text>
          </View>
          <View
            style={styles.filterButton}
            onPress={() => {
              toggleModal();
            }}
          >
            <Text>     </Text>
          </View>
          {/* <Icon name="filter" size={20} color={'white'} />
            <Text
              style={{
                fontSize: 10,
                color: 'white',
                fontFamily: "AvenirNextCyr-Medium",
                marginLeft: 5,
              }}
            >
              Filter
            </Text> */}

        </View>

        {/* <View>
          <Text style={{fontSize:18,fontFamily:'AvenirNextCyr-Medium',marginLeft:10,marginBottom:5}}>Customers Details</Text>
        </View> */}
        {/* <View style={styles.row1View}>
        <View style={styles.orderView}>
          <Button title="Market" color={Colors.primary} />
        </View>
        <Button title="Order" color={Colors.primary} />
      </View>
      <View style={styles.row2View}>
        <View style={styles.orderView}>
          <Button title="Return" color={Colors.primary} />
        </View>
        <Button title="Shelf Display" color={Colors.primary} />
      </View> */}
        {/* <Text style={styles.title}>Select your options</Text> */}


        <View style={{ backgroundColor: '#ecf0f1', borderTopLeftRadius: 30, borderTopRightRadius: 30, flex: 1, padding: 10, elevation: 5, marginTop: vs(10) }}>

          <View style={{}}>
            <ScrollView>

              <View style={styles.elementsView}>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>

                  <View >
                    <Svg
                      height="80"
                      width="80"
                      style={styles.progress}
                    >
                      {/* Circular progress */}
                      <Circle
                        cx="50%"
                        cy="50%"
                        r="43%"
                        stroke='url(#gradient)'
                        strokeWidth="6"
                        fill="transparent"
                      />
                      {/* Linear gradient */}
                      {/* {frequency !== "1/1" && (  */}
                      <LinearGradient1 id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <Stop offset="0%" stopColor='#6F40AC' />
                        <Stop offset="100%" stopColor='#CD4855' />
                        {/* colors={['#011A90', '#851E71']} */}
                      </LinearGradient1>
                      {/* )} */}
                      {/* <View style={{ backgroundColor: '#6F40AC', width: '45%', borderWidth: 1.5, borderColor: 'white', position: 'relative', alignItems: 'center', top: 65, left: '30%' }}>
                        <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>{dealerData?.id}</Text>
                      </View> */}
                    </Svg>
                    {dealerData?.profile_picture ? (
                      <Image
                        source={{ uri: dealerData?.profile_picture }}
                        style={{ ...styles.avatar }}
                      />
                    ) : (
                      <Image
                        source={require('../../assets/images/doctor.jpg')}
                        style={{ ...styles.avatar }}
                      />
                    )}

                    {/* <Text style={styles.name}>{item.name}</Text> */}

                  </View>
                  <View style={{
                    // flex: 1,
                    // marginLeft: 8,
                    // borderLeftWidth: 1.5,
                    paddingLeft: 20,
                    // marginLeft: 20,
                    // borderStyle: 'dotted',
                    borderColor: 'grey',
                    // alignItems:'center'
                    justifyContent: 'center',
                    // backgroundColor:'red'
                  }}>

                    <Text style={{ ...styles.contentView, color: Colors.primary, fontSize: 18, fontFamily: "AvenirNextCyr-Bold" }}>{dealerData?.name}-{dealerData?.account_id}</Text>
                    {/* <Text style={{ ...styles.contentView, fontFamily: "AvenirNextCyr-Medium", fontWeight: "500" }}>#{dealerData?.storeid_c}</Text> */}
                    <Text style={styles.contentView}>{dealerData?.client_address}</Text>
                    {/* <Text style={styles.contentView}>{dealerData?.street}</Text> */}
                    {/* {dealerData?.client_address != '' && <Text style={styles.contentView}>{dealerData?.client_address}</Text>} */}
                    {/* <Text style={styles.contentView}>{dealerData?.shipping_address_state}</Text> */}
                    {/* <Text style={styles.contentView}>{dealerData?.region} - {dealerData?.postal_code}</Text> */}
                  </View>
                </View>
              </View>


              <TouchableOpacity activeOpacity={0.6} style={styles.recoredbuttonStyle} onPress={() => navigation.navigate('SalesOrder', { screen: 'SalesMgmt' })}>
                <Image transition={false} source={require('../../assets/images/order.png')} style={{ width: 38, height: 38, resizeMode: 'cover', alignSelf: 'center', marginRight: 4 }} >
                </Image>
                <View style={{ padding: 10, flex: 1 }}>
                  <Text style={{ fontFamily: "AvenirNextCyr-Medium", fontSize: 15, color: 'black' }}>Secondary Sales</Text>
                  <Text
                    numberOfLines={2}
                    style={{ fontFamily: "AvenirNextCyr-Medium", fontSize: 12, color: 'gray', flexWrap: 'wrap' }}>Resale of products by a retailer to an end consumer.</Text>
                </View>
                <AntDesign name='right' size={20} color={`#6B1594`} />
              </TouchableOpacity>

              <TouchableOpacity activeOpacity={0.6} style={styles.recoredbuttonStyle} onPress={() => { navigation.navigate('CheckInInventory', { screen: 'CompetitorIntelligence' }) }} >
                <Image transition={false} source={require('../../assets/images/market.png')} style={{ width: 35, height: 35, resizeMode: 'cover', alignSelf: 'center', marginRight: 4 }} >
                </Image>

                <View style={{ padding: 10, flex: 1 }}>
                  <Text style={{ fontFamily: "AvenirNextCyr-Medium", fontSize: ms(15), color: 'black' }}>Competitor Analysis</Text>
                  <Text style={{ fontFamily: "AvenirNextCyr-Medium", fontSize: ms(12), color: 'gray', flexWrap: 'wrap', flexDirection: 'row' }}>Evaluating industry peers for strategic insights.</Text>
                </View>
                <AntDesign name='right' size={20} color={`#6B1594`} />
              </TouchableOpacity>

              <TouchableOpacity activeOpacity={0.6} style={styles.recoredbuttonStyle} onPress={() => { navigation.navigate('SalesReturn') }}>
                <Image transition={false} source={require('../../assets/images/returnOrder.png')} style={{ width: 35, height: 35, resizeMode: 'cover', alignSelf: 'center', marginRight: 4 }}  >
                </Image>
                <View style={{ padding: 10, flex: 1 }}>
                  <Text style={{ fontFamily: "AvenirNextCyr-Medium", fontSize: 15, color: 'black' }}>Return</Text>
                  <Text style={{ fontFamily: "AvenirNextCyr-Medium", fontSize: 12, color: 'gray', flexWrap: 'wrap' }}>Product sent back to seller for refund/exchange..</Text>
                </View>
                <AntDesign name='right' size={20} color={`#6B1594`} />
              </TouchableOpacity>




              <TouchableOpacity activeOpacity={0.6} style={styles.recoredbuttonStyle}
                onPress={() => {
                  //clearModalValue();
                  navigation.navigate('Payment')

                  //setModalVisible2(true)
                }} >
                <Image transition={false} source={require('../../assets/images/payment.png')} style={{ width: 35, height: 35, resizeMode: 'cover', alignSelf: 'center', marginRight: 4 }} >
                </Image>
                <View style={{ padding: 10, flex: 1 }}>
                  <Text style={{ fontFamily: "AvenirNextCyr-Medium", fontSize: 15, color: 'black' }}>Payment Collection</Text>
                  <Text style={{ fontFamily: "AvenirNextCyr-Medium", fontSize: 12, color: 'gray', flexWrap: 'wrap' }}>Collecting funds for products or services.</Text>
                </View>
                <AntDesign name='right' size={20} color={`#6B1594`} />
              </TouchableOpacity>


              <TouchableOpacity activeOpacity={0.6} style={styles.recoredbuttonStyle}
                onPress={() => {
                  //clearModalValue();
                  navigation.navigate('MiscTask')

                  //setModalVisible2(true)
                }} >
                <Image transition={false} source={require('../../assets/images/clipboardd.png')} style={{ width: 35, height: 35, resizeMode: 'cover', alignSelf: 'center', marginRight: 4 }} >
                </Image>
                <View style={{ padding: 10, flex: 1 }}>
                  <Text style={{ fontFamily: "AvenirNextCyr-Medium", fontSize: 15, color: 'black' }}>Miscellaneous Task</Text>
                  <Text style={{ fontFamily: "AvenirNextCyr-Medium", fontSize: 12, color: 'gray', flexWrap: 'wrap' }}>Organize your task  based on urgency and importance.</Text>
                </View>
                <AntDesign name='right' size={20} color={`#6B1594`} />
              </TouchableOpacity>


              <TouchableOpacity activeOpacity={0.6} style={{ ...styles.recoredbuttonStyle, marginBottom: '15%' }}
                onPress={() => {
                  //clearModalValue();
                  navigation.navigate('ListShelfDisplay')

                  //setModalVisible2(true)
                }} >
                <Image transition={false} source={require('../../assets/images/shelfDisplay1.png')} style={{ width: 35, height: 35, resizeMode: 'cover', alignSelf: 'center', marginRight: 4 }} >
                </Image>
                <View style={{ padding: 10, flex: 1 }}>
                  <Text style={{ fontFamily: "AvenirNextCyr-Medium", fontSize: 15, color: 'black' }}>Shelf Display</Text>
                  <Text style={{ fontFamily: "AvenirNextCyr-Medium", fontSize: 12, color: 'gray', flexWrap: 'wrap' }}>Arrangement of items on a shelf for easy customer access.</Text>
                </View>
                <AntDesign name='right' size={20} color={`#6B1594`} />
              </TouchableOpacity>

            </ScrollView>

          </View>




          <View style={{ justifyContent: 'flex-end', flex: 1 }}>
            <LinearGradient
              colors={Colors.linearColors}
              start={Colors.start} end={Colors.end}
              locations={Colors.ButtonsLocation}
              style={{
                height: 50,
                margin: 5,
                // backgroundColor:'red',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 30,
              }}
            >
              <TouchableOpacity style={styles.checkOutButton} onPress={() => {
                clearModalValue()
                loadCmpProduct()
                setModalVisible(true)

              }} activeOpacity={0.8}>
                <Text style={styles.checkOutText}>CheckOut</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
          {/* Check in Modal */}

          <Modal
            visible={isModalVisible}
            animationType="slide"
            transparent={true}

          >

            <KeyboardAwareScrollView contentContainerStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
              <View style={{ backgroundColor: 'white', padding: 20, width: '90%', marginHorizontal: 10, borderRadius: 10, elevation: 5, ...globalStyles.border, }}>
                <ScrollView>

                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                    <Text style={styles.modalTitle}></Text>
                    <TouchableOpacity onPress={() => setModalVisible(false)}>
                      <AntDesign name='close' size={20} color={`black`} />
                    </TouchableOpacity>

                  </View>
                  <View style={styles.dropDownContainer}>
                    <Text style={{ color: 'black', fontSize: 16 }}>Purpose Of Visit</Text>
                    <View style={styles.cmpContainer}>
                      <FlatList
                        data={cmpdata}
                        renderItem={({ item }) => (
                          <View style={styles.cmpItem}>
                            <Text style={{ color: 'white', fontFamily: "AvenirNextCyr-Medium", marginTop: '5%' }}>{item}</Text>
                          </View>
                        )}
                        keyExtractor={(item, index) => index.toString()}
                      // horizontal
                      />
                    </View>
                    {/* <MultipleSelectList
        setSelected={(val) => setValue(val)}
        data={data}
        save="key"
        placeholder="Select purpose of visit"
        placeholderTextColor="gray" // Change the placeholder text color if needed
        label="Purpose of Visit"
        labelStyles={styles.modalTitle}
        fontFamily='AvenirNextCyr-Medium'
        fontSize={16} // Change the font size as needed
        badgeStyles={{ backgroundColor: Colors.primary }}
        maxHeight={330}
        closeicon={<AntDesign name='close' size={20} color={`black`} />}
        // selectedValues={selectedValues}
        value={value}
      /> */}


                  </View>
                  <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 1 }}>

                      <TextInput1
                        mode="outlined"
                        label="Order Value (AED)"
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
                        style={{ marginBottom: "2%", height: 50, backgroundColor: "white", fontSize: 16 }}
                      />
                    </View>

                  </View>



                  <TextInput1
                    mode="outlined"
                    label="Report"
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


                  <View style={styles.buttonview}>
                    <LinearGradient
                      colors={Colors.linearColors}
                      start={Colors.start}
                      end={Colors.end}
                      locations={Colors.ButtonsLocation}
                      style={{ borderRadius: 8, flex: 1, marginTop: '3%' }}
                    >
                      <TouchableOpacity style={styles.buttonContainer} onPress={saveCheckOut}>
                        <Text style={styles.buttonText}>Submit</Text>
                      </TouchableOpacity>
                    </LinearGradient>
                  </View>
                </ScrollView>

              </View>
            </KeyboardAwareScrollView>


          </Modal>


        </View>
      </LinearGradient>
    </View>
  )
}

export default CheckOut

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#f1f1f2'
    backgroundColor: 'white'

  },
  row1View: {
    //marginHorizontal: 50,
    paddingHorizontal: 30,
    //marginTop: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
  },
  row2View: {
    paddingHorizontal: 30,
    // marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  orderView: {
    marginRight: 20
  },
  checkOutView: {
    flexDirection: 'row',
    //justifyContent: 'space-between',
    marginRight: 10,
    //paddingHorizontal: 10,
    alignItems: 'center',
    //backgroundColor:'red',
    marginLeft: 3
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
  buttonview: {
    flexDirection: 'row'
  },
  buttonContainer: {
    heigh: 40,
    padding: 10,
    borderRadius: 10,
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    //marginRight: 10,
    // marginVertical: 10,
    // backgroundColor: Colors.primary
  },
  buttonText: {
    fontFamily: "AvenirNextCyr-Medium",
    color: 'white'
  },
  modalTitle: {
    fontSize: 16,
    color: 'black',
    fontFamily: "AvenirNextCyr-Medium"
  },
  textarea: {
    borderWidth: 0.5,
    borderColor: 'black',
    //margin: 15,
    marginTop: 5,
    borderRadius: 5,
    padding: 10,
    fontSize: 14,
    fontFamily: "AvenirNextCyr-Medium",
    textAlignVertical: 'top',
    color: '#000'
  },
  dropDownContainer: {
    backgroundColor: 'white',
    marginBottom: 10,
    padding: 14,
    borderWidth: 0.6,
    borderColor: 'gray',
    borderRadius: 10
    //backgroundColor:'red'
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  photosContainer: {
    height: 40,
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
    backgroundColor: Colors.primary,
    marginRight: 10
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },

  selectedTextStyle: {
    fontSize: 16,
    fontFamily: "AvenirNextCyr-Medium"
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  title: {
    marginVertical: 10,
    paddingHorizontal: 36,
    fontSize: 18,
    fontFamily: "AvenirNextCyr-Medium",
    color: 'black'
  },
  contentView: {
    color: 'black',
    fontSize: 12,
    fontFamily: "AvenirNextCyr-Medium",
    //fontStyle:'italic'
  },
  checkOutButton: {
    height: 50,
    marginHorizontal: 10,
    width: '100%',
    // backgroundColor:'red',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    // backgroundColor: Colors.primary,
  },
  checkOutText: {
    fontFamily: "AvenirNextCyr-Medium",
    color: '#fff',
    fontSize: 16
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
  imgStyle: {
    width: 90,
    height: 90,
    resizeMode: 'cover',
    borderRadius: 8,
    //marginRight: 8, muliplr img style
    marginTop: 5,
    marginBottom: 5

  },
  placeholderStyle: {
    fontSize: 16,

    fontFamily: "AvenirNextCyr-Medium"
  },
  recoredbuttonStyle: {
    // flex:1,
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    marginHorizontal: 5,
    shadowRadius: 2,
    // elevation: 5,
    ...globalStyles.border,
    height: vs(100),
    // width: 118,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: ms(10),
    marginBottom: vs(10),
    marginTop: vs(8),
    flexDirection: 'row',
    paddingHorizontal: hs(10),
    paddingVertical: vs(10)

  },
  elementsView: {
    paddingVertical: vs(10),
    // paddingHorizontal:15,
    // backgroundColor: "white",
    margin: 10,
    //borderColor: 'black',
    //flexDirection: 'row',
    //justifyContent: 'space-between',
    //alignItems: 'center',
    marginBottom: 5,
    // borderRadius: 15,
    // elevation: 5,
    padding: 8
    //borderColor: '#fff',
    //borderWidth: 0.5
  },
  gradientBadge: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  header: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 5,
  },
  filterButton: {
    flexDirection: "column",
    alignItems: "center",
  },
  progress: {
    position: 'absolute',
    zIndex: 1,
    bottom: 0,
    right: 0,
    //  paddingRight: 30,

  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 50,
    marginRight: 10,
    marginLeft: 10,
    borderWidth: 0.5,
    borderColor: 'white',
    resizeMode: 'contain',
    marginBottom: 10

  },
  cmpContainer: {
    flexDirection: 'column',
    width: '55%',
    marginTop: 7,
    justifyContent: 'center'


  },
  cmpItem: {
    backgroundColor: '#4b0482',
    borderRadius: 50,
    paddingBottom: 5,
    marginRight: 10,
    marginBottom: 5,
    alignItems: 'center',
    paddingHorizontal: 2
  },

})