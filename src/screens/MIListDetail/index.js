import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, TextInput, Image, Text, StyleSheet, Dimensions, ScrollView, PermissionsAndroid, Pressable, Alert, Modal, Touchable, TouchableOpacity, Button } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Colors from '../../constants/Colors';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { requestStoragePermission } from '../../utils/Helper';
import Geolocation from 'react-native-geolocation-service';
import { AuthContext } from '../../Context/AuthContext';
import DatePicker from 'react-native-date-picker'
import ProgressCircle from 'react-native-progress-circle'
import moment from 'moment';
const MIListDetail = ({ navigation, route }) => {

  const { item } = route.params;

  console.log("product data", item);

  const [date, setDate] = useState(new Date())
  const [enddate, setEndDate] = useState(new Date())
  const [orderDate, setOrderDate] = useState(new Date())

  const { token, dealerData, merch,userData } = useContext(AuthContext);
  //new
  const [quantitySold, setQuantitySold] = useState('');
  const [packs, setPacks] = useState('');
  const [modalVisible1, setModalVisible1] = useState(false);
  const [base64img, setBase64img] = useState('');
  const [userCordinates, setUserCordinates] = useState('');
  const [desc, setDesc] = useState('')

  const today = moment(value).format('DD/MM/YYYY');
  //console.log("today", today)

  const [startDate, setStartDate] = useState(merch ? today : "")
  const [StopDate, setStopDate] = useState(merch ? today : "")
  const [lastOrderDate, setLastOrderDate] = useState("");

  //new data
  const [stock, setStock] = useState("");
  const [lastOrderQty, setLastOrderQty] = useState('');
  const [retailPrice, setRetailPrice] = useState("");

  const handleDateChange = (value, index) => {
    if (index == 1) {
      const formattedDate = moment(value).format('DD/MM/YYYY');
      setStartDate(formattedDate);
    } else if (index == 2) {
      const formattedDate = moment(value).format('DD/MM/YYYY');
      setStopDate(formattedDate);
    } else if (index == 3) {
      const formattedDate = moment(value).format('DD/MM/YYYY');
      setLastOrderDate(formattedDate);
    }
  }

  console.log("userdata",userData.dealer_name)

  const createSKU = () => {
    console.log("called");
    if (item && quantitySold && desc && startDate && StopDate &&
      stock && lastOrderQty && retailPrice && lastOrderDate) {
      console.log("product data", productData);
      console.log("last order date", lastOrderDate);
      console.log("stock in hand", stock);
      console.log("last order qunrartity", lastOrderQty);
      console.log("qty sold", quantitySold);
      console.log("packs", packs);
      console.log("retail price", retailPrice);
      // console.log("from", moment(date).format('YYYY-MM-DD'));
      console.log("from1", startDate);
      console.log("to", StopDate);
      console.log("desc", desc);








      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      var raw = JSON.stringify({
        "__module_code__": "PO_35",
        "__query__": "",
        "__name__": item?.description,
        "__price__": item?.price,
        "__user_id__": token,
        "__dealer_id__": dealerData?.id,
        "__product_id__": item?.id,
        "__sold_qty__": quantitySold,
        "__location__": userCordinates,
        "__assigned_user_id__": token,
        "__latitude__": userCordinates[1],
        "__longitude__": userCordinates[0],
        "__summary_of_visit__": desc,
        "__product_image__": item?.imgsrc,
        // "__product_base64__": base64img,
        "__pack_of__": packs,
        "__start_date__": moment(date).format('YYYY-MM-DD'),
        "__end_date__": moment(enddate).format('YYYY-MM-DD'),   //new value
        "__stock_on_hand__": stock,
        "__last_ordered_date__": moment(orderDate).format('YYYY-MM-DD'),
        "__last_ordered_qty__": lastOrderQty,
        "__retail_price__": retailPrice,
      });

      console.log(raw)

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };

      fetch("https://gsi.ordosolution.com/set_marketintelligence.php", requestOptions)
        .then(response => response.json())
        .then(result => {
          console.log('seconday movemnt save res', result);
          Alert.alert('Secondary Offtake', 'Data saved successfully', [
            { text: 'OK', onPress: () => navigation.goBack() },
          ]);

        })
        .catch(error => console.log('error', error));
    }
    else {
      Alert.alert('Error', 'Please fill all the details')
    }

  }


  const getLocation = async () => {

    Geolocation.getCurrentPosition(
      (res) => {
        console.log("route called")
        console.log(res);
        //getting user location
        console.log("lattitude", res.coords.latitude);
        console.log("longitude", res.coords.longitude);
        setUserCordinates([res.coords.longitude, res.coords.latitude]);

      },
      (error) => {
        console.log("get location error", error);
        console.log("please enable location ")

      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }

    );

  }


  //check permssiosaon 
  const checkPermission = async () => {
    const granted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.CAMERA);
    if (granted) {
      console.log("camera permssion granted");
      handleCamera();
    }
    else {
      console.log("asking permission");
      requestStoragePermission();
    }
  }

  const handleCamera = async () => {
    setModalVisible1(false);
    const res = await launchCamera({
      mediaType: 'photo',
      includeBase64: true
    });
    console.log("response", res.assets[0].uri);
    setBase64img(`data:${res.assets[0].type};base64,${res.assets[0].base64}`)
  }
  const handleGallery = async () => {
    setModalVisible1(false);
    const res = await launchImageLibrary({
      mediaType: 'photo',
      includeBase64: true
    });
    console.log("response", res.assets[0].uri);
    setBase64img(`data:${res.assets[0].type};base64,${res.assets[0].base64}`)
  }
  //new
  const width = Dimensions.get('window').width
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [planName, setPlanName] = useState("");
  const [productsArray, setProducts] = useState([])
  const [productimage, setProductImage] = useState("");
  const [productData, setProductData] = useState([]);
  useEffect(() => {
    getLocation();
    // updateProducts = () => {
    //   var { products } = route.params;
    //   var dataproducts = []
    //   for (var i = 0; i < products.length; i++) {
    //     dataproducts.push(
    //       { label: products[i].name_value_list.name.value, value: products[i].name_value_list.id.value })
    //   }
    //   setProducts(dataproducts);
    // }

    //updateProducts();
  }, []);

  const getproductdetails = (value) => {
    var { products } = route.params;
    var filteredProduct = []
    const filtered = products.filter(item =>
      item.name_value_list.id.value.includes(value)
    );
    if (filtered.length > 0) {
      filteredProduct.push({ name: filtered[0].name_value_list.name.value, product_image: filtered[0].name_value_list.product_image.value, part_number: filtered[0].name_value_list.part_number.value, price: filtered[0].name_value_list.price.value, id: filtered[0].name_value_list.id.value })
      setProductData(filteredProduct);
      console.log("product data", filteredProduct);
    }
  }
  const renderLabel = () => {
    if (value || isFocus) {
      return (
        <Text style={[styles.label, isFocus && { color: 'blue' }]}>
          Choose your Product
        </Text>
      );
    }
    return null;
  }
  const createPlanPressed = () => {



  }
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



  const [open, setOpen] = useState(false)
  const [stopopen, setStopOpen] = useState(false);
  const [orderOpen, setOrderOpen] = useState(false);




  // new

  return (
    <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
      {/* <View style={{ flex: 0.1, backgroundColor: 'white', alignContent: 'center', justifyContent: 'center', width: width, flexDirection: 'row', height: 30 }}>
        <TouchableOpacity style={{ width: 30, height: 30, marginTop: 20 }} onPress={() => { navigation.goBack() }}>
          <Image source={require('../../assets/images/arrow-left.png')} style={{ width: 30, height: 30, resizeMode: 'contain' }}></Image>
        </TouchableOpacity>
        <Text style={{ alignSelf: 'center', fontSize: 20, fontWeight: "500", width: width - 40, marginHorizontal: 0, height: 30, textAlign: 'left', marginTop: 15 }}>   Create SKU MI</Text>

      </View>
      <Text style={{ alignSelf: 'center', fontSize: 20, fontWeight: "500", width: width - 40, marginHorizontal: 0, height: 30, textAlign: 'center' }}></Text> */}

      <View style={{ flex: 1 }}>
        <View style={{ ...styles.headercontainer }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <AntDesign name='arrowleft' size={25} color={Colors.black} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Secondary Offtake</Text>
        </View>
        {/* <FloatingLabelInput
        label="Enter the Title"
        value={planName}
        onChangeText={setPlanName}
      />     */}
        <View style={styles.container}>
          {/* {renderLabel()}
        <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={productsArray}
          search
          maxHeight={400}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? 'Choose Product' : '...'}
          searchPlaceholder="Search..."
          value={value}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            setValue(item.value);
            setIsFocus(false);
            getproductdetails(item.value);
          }}
        /> */}
          <View style={{ flex: 0.9 }}>

            <View style={{ flex: 0.4, flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ flex: 0.4 }}>
                {/* <Image source={ {uri:productData[0].product_image}}/> */}
                <Image source={{ uri: item.imgsrc }} style={{
                  width: 80,
                  height: 80,
                }} />

              </View>
              <View style={{ flex: 0.8 }}>
              <Text style={{...styles.text,color:'red'}}>{item.itemid}</Text>
                <Text style={{ ...styles.text, color: Colors.primary, fontFamily: 'AvenirNextCyr-Medium' }}>{item.description}</Text>
                {/* <Text style={styles.text}>AED  {Number(item.price)}</Text> */}
              </View>
            </View>
            <View >
              {/* new */}
              <View>

                <View style={{ flexDirection: 'row' }}>
                  <View style={{ flex: 1 }}>
                    <View style={styles.cNameView}>
                      <Text style={styles.modalTitle}>
                        Stock On Hand
                      </Text>
                    </View>

                    <View style={styles.cNameTextInputView}>
                      <TextInput style={styles.cNameTextInput} placeholder='Stock On Hand' value={stock}
                        onChangeText={text => setStock(text)} keyboardType='numeric' 
                        keyboardShouldPersistTaps='always'/>
                    </View>
                    <View>
                    </View>
                  </View>
                  <View style={{ flex: 1, marginLeft: 5 }}>

                    <View style={styles.cNameView}>
                      <Text style={styles.modalTitle}>
                        Qty Sold
                      </Text>
                    </View>

                    <View style={styles.cNameTextInputView}>
                      <TextInput style={styles.cNameTextInput} placeholder='Qty Sold' value={quantitySold}
                        onChangeText={text => setQuantitySold(text)} keyboardType='numeric' 
                        keyboardShouldPersistTaps='always'/>
                    </View>
                    {/* <InputWithLabel
                      title='Last Ordered Date'
                      value={lastOrderDate}
                      onPress={() => setOrderOpen(true)}
                    /> */}
                  </View>
                </View>

                <View style={{ flexDirection: 'row' }}>
                  <View style={{ flex: 1 }}>
                    <View style={{ ...styles.cNameView, marginTop: 8 }}>
                      <Text style={styles.modalTitle}>
                        Last Ordered Qty
                      </Text>
                    </View>

                    <View style={{ ...styles.cNameTextInputView, marginTop: 0 }}>
                      <TextInput style={styles.cNameTextInput} placeholder='Last Ordered Qty' value={lastOrderQty}
                        onChangeText={text => setLastOrderQty(text)} keyboardType='numeric'
                        keyboardShouldPersistTaps='always' />
                    </View>
                  </View>



                  <View style={{ flex: 1, marginLeft: 5 }}>

                    {/* <View style={styles.cNameView}>
                      <Text style={styles.modalTitle}>
                        Qty Sold
                      </Text>
                    </View>

                    <View style={styles.cNameTextInputView}>
                      <TextInput style={styles.cNameTextInput} placeholder='Qty Sold' value={quantitySold}
                        onChangeText={text => setQuantitySold(text)} keyboardType='numeric' />
                    </View> */}
                    <InputWithLabel
                      title='Last Ordered Date'
                      value={lastOrderDate}
                      onPress={() => setOrderOpen(true)}
                    />
                  </View>
                </View>

      

                <View style={{ flexDirection: 'row' }}>
                  <View style={{ flex: 1 }}>
                    <InputWithLabel
                      title='From'
                      value={startDate}
                      onPress={() => !merch ? setOpen(true) : null} //merchandiser have from and to today's fixed date

                    />
                  </View>
                  <View style={{ flex: 1, marginLeft: 5 }}>
                    <InputWithLabel
                      title='To'
                      value={StopDate}
                      onPress={() => !merch ? setStopOpen(true) : null}

                    />
                  </View>
                </View>
                <View >
                  {open == true ?
                    <DatePicker
                      modal
                      theme='light'
                      mode={'date'}
                      open={open}
                      date={date}
                      format="DD-MM-YYYY"
                      minDate="01-01-2022"
                      maximumDate={new Date()}
                      onConfirm={(date) => {
                        const dateString = date.toLocaleDateString();
                        console.log(dateString);
                        setDate(date)
                        setOpen(false)
                        handleDateChange(date, 1)
                      }}
                      onCancel={() => {
                        setOpen(false)
                      }}
                    /> : null}
                  {/* </View>
        <View style={styles.inputView}>
          <Text style={{ width: width - 50, flex: 0.9 }}>{StopDate}</Text>
          <TouchableOpacity onPress={() => setStopOpen(true)}><Image style={{ width: 20, height: 20 }} source={require("../../assets/images/calendar.png")}></Image></TouchableOpacity> */}
                  {stopopen == true ?
                    <DatePicker
                      modal
                      theme='light'
                      mode={'date'}
                      open={stopopen}
                      date={enddate}
                      format="DD-MM-YYYY"
                      maximumDate={new Date()}

                      onConfirm={(date) => {
                        const dateString = date.toLocaleDateString();
                        console.log(dateString);
                        setStopOpen(false)
                        setEndDate(date)
                        handleDateChange(date, 2)
                      }}
                      onCancel={() => {
                        setStopOpen(false)
                      }}
                    /> : null}

                  {orderOpen == true ?
                    <DatePicker
                      modal
                      theme='light'
                      mode={'date'}
                      open={orderOpen}
                      date={orderDate}
                      format="DD-MM-YYYY"
                      // minDate="2022-01-01"
                      maximumDate={new Date()}
                      onConfirm={(date) => {
                        const dateString = date.toLocaleDateString();
                        console.log(dateString);
                        setOrderOpen(false)
                        setOrderDate(date)
                        handleDateChange(date, 3)
                      }}
                      onCancel={() => {
                        setOrderOpen(false)
                      }}
                    /> : null}
                </View>

                <View style={{ flexDirection: 'row' }}>
  {!userData.dealer_name || userData.dealer_name !== 'Nikai Electronics' ? (
    <View style={{ flex: 0.5 }}>
      <View style={{ ...styles.cNameView, flex: 1 }}>
        <Text style={styles.modalTitle}>
          Pack Size#
        </Text>
      </View>

      <View style={{ ...styles.cNameTextInputView }}>
        <TextInput
          style={styles.cNameTextInput}
          placeholder='Pack Size'
          value={packs}
          onChangeText={text => setPacks(text)}
          keyboardType='numeric'
          keyboardShouldPersistTaps='always'
        />
      </View>
    </View>
  ) : null}

  <View style={{ flex: 0.5, marginLeft:5 }}>
    <View style={styles.cNameView}>
      <Text style={styles.modalTitle}>
        Retail Price
      </Text>
    </View>

    <View style={{
                      height: 40,
                      borderWidth: 1,
                      borderColor: '#B3B6B7',
                      flexDirection: 'row',
                      fontFamily: 'AvenirNextCyr-Thin',
                      alignItems: 'center',
                      marginTop: 5
                    }}>

                      <View style={{
                        height: 50,
                        fontFamily: 'AvenirNextCyr-Thin',
                        width: '80%',
                        justifyContent: 'center'
                      }}>
                        <TextInput


                          placeholder='Retail price'
                          value={retailPrice}
                          onChangeText={text => setRetailPrice(text)}
                          keyboardType='numeric'
                          keyboardShouldPersistTaps='always'
                        />

                      </View>
   

                      <View><Text>AED</Text></View>

                    </View>
                 
    <View>
    </View>
  </View>
</View>

                <Text style={{ ...styles.modalTitle, marginTop: 5 }}>Remarks</Text>


                <TextInput
                  multiline={true}
                  numberOfLines={5}
                  keyboardShouldPersistTaps='always'
                  placeholder="Enter Text..."
                  style={styles.textarea}
                  onChangeText={(val) => { setDesc(val) }}
                //onChangeText={(text) => this.setState({ text })}
                // value={desc}
                />
                {/* <View style={styles.buttonview} >
                  <TouchableOpacity style={styles.buttonContainer} onPress={createSKU}>
                    <Text style={styles.buttonText}>Submit</Text>
                  </TouchableOpacity>
                </View> */}
                {/* <View>
                <Text style={{ ...styles.modalTitle, marginTop: 5 }}>Upload Photo</Text>
              </View>
              <TouchableOpacity onPress={() => setModalVisible1(true)}>
                <Image source={base64img ? { uri: base64img } : require('../../assets/images/plus.png')} style={styles.plusIcon} />
              </TouchableOpacity> */}
                {/* <Modal visible={props.visible} close={props.close}
                transparent={true}
                onRequestClose={() => { this.modalIsVisible(false); }}
            > */}

              </View>
              {/* new */}
            </View>
            {/* <View style={{ alignSelf: 'center', flex: 0.1, marginTop: 40 }}>
            <TouchableOpacity
              onPress={createSKU}>
              <LinearGradient
                colors={['#F5904B', '#F5904B']}
                style={styles.signIn}>
                <Text style={styles.textSign}>Submit</Text>
              </LinearGradient>
            </TouchableOpacity> 
          </View> */ }
          </View>

        </View>
      </View>
      <View style={{ marginBottom: 20, justifyContent: 'flex-end' }}>
      <LinearGradient
                colors={Colors.linearColors}
                start={Colors.start}end={Colors.end}
                locations={Colors.location}
                style={{    borderRadius: 8, marginHorizontal:'5%'}}
            >
        <TouchableOpacity style={styles.buttonContainer} onPress={createSKU}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
        </LinearGradient>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 16,
    flex: 0.9
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
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  inputView: {
    width: "100%",
    backgroundColor: "#ffffff",
    height: 40,
    borderWidth: 0.5,
    borderColor: 'grey',
    flexDirection: 'row',
    justifyContent: "center",
    alignItems: 'center',
    marginTop: 5

  },
  textinputView: {
    width: "20%",
    backgroundColor: "#ffffff",
    height: 20,
    borderWidth: 0.5,
    borderColor: 'grey',
    flexDirection: 'row',
    justifyContent: "center",
    alignItems: 'center',
    marginTop: 5

  },
  planinputView: {
    width: "100%",
    backgroundColor: "#ffffff",
    height: 40,
    borderWidth: 0.5,
    borderColor: 'grey',
    flexDirection: 'row',
    justifyContent: "flex-start",
    marginTop: 5

  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  signIn: {
    width: "90%",
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    flexDirection: 'row',
    // fontFamily:'Lato-Bold'
  },
  textSign: {
    color: 'white',
    fontWeight: 'bold',
    // fontFamily:'Lato-Bold'
  },
  modalView: {
    marginTop: 350,
    marginHorizontal: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  closeView: {
    marginTop: 25
  },
  photosButton: {
    marginTop: 10,
    width: 90,
    height: 50,
    marginLeft: 20
  },
  buttonview: {
    flexDirection: 'row'
  },
  buttonContainer: {
    heigh: 40,
    //width:'90%',
    padding: 10,
    borderRadius: 10,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    //marginRight: 10,
    // marginVertical: 10,
    // marginHorizontal: 10,
    // backgroundColor: Colors.primary
  },
  buttonText: {
    fontFamily: 'AvenirNextCyr-Thin',
    color: 'white'
  },
  modalTitle: {
    fontSize: 16,
    color: 'black',
    fontFamily: 'AvenirNextCyr-Medium',
  },
  uploadButton: {
    marginTop: 10,
    marginRight: 300,
    backgroundColor: Colors.primary
  },
  plusIcon: {
    marginTop: 3,
    height: 40,
    width: 40
  },

  cNameView: {
    marginTop: 10,
  },
  cNameText: {
    fontSize: 12,
    color: '#472F06',
  },
  cNameTextInputView: {
    marginTop: 5,
  },
  cNameTextInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#B3B6B7',
    padding: 5,
    fontFamily: 'AvenirNextCyr-Thin',
  },
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
  text: {
    fontFamily: 'AvenirNextCyr-Thin',
  },
  // new
  labelText: {
    fontFamily: 'AvenirNextCyr-Medium',
    color: Colors.black,
    fontSize: 16,
    marginTop: 5,
  },
  inputContainer: {

    marginVertical: 3,
    borderColor: 'grey',
    color: 'black',
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  input2: {
    fontFamily: 'AvenirNextCyr-Thin',
    padding: 8,
    flex: 1,
  },
  textarea: {
    borderWidth: 0.5,
    borderColor: 'black',
    //margin: 15,
    marginTop: 8,
    borderRadius: 5,
    padding: 10,
    //fontSize: 13,
    textAlignVertical: 'top',
    color: '#000',
    fontFamily: 'AvenirNextCyr-Thin'
  },
});

export default MIListDetail;