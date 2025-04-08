import React, { useState, useContext, useRef, useEffect } from 'react';
import { View, TextInput, StyleSheet, Pressable, TouchableOpacity, Text, Image, Alert, ScrollView} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
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

const AddBrand = ({ navigation }) => {

  //drop down hooks
  const [categoryOption, setCategoryOption] = useState([]);
  const [currencyOption, setCurrencyOption] = useState([]);
  const [taxOption, setTaxOption] = useState([]);
  const [unitOption, setUnitOption] = useState([]);




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
        // console.log("drop down api res", res);
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
        // console.log("currency option", currencyArray);
        setCurrencyOption(currencyArray);

        //tax dropdown
        const taxArray = Object.keys(res?.tax).map((key) => ({
          label: res?.tax[key],
          value: key,
        }));
        // console.log("tax option", taxArray);
        setTaxOption(taxArray);

        //unit of measure  dropdown
        const unitArray = Object.keys(res?.unitofmeasure).map((key) => ({
          label: res?.unitofmeasure[key],
          value: key,
        }));
        // console.log("unit of measure option", unitArray);
        setUnitOption(unitArray);


      })
      .catch(error => {
        // Handle the error here
        console.log(error);
      });

  }



  const [base64img, setBase64img] = useState('');
  const { token } = useContext(AuthContext);
  const [partNumber, setPartNumber] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [upcC, setUpcC] = useState('');
  const [priceC, setPriceC] = useState('');
  const [category, setCategory] = useState('');
  const [subcategoryC, setSubcategoryC] = useState('');
  const [unitofmeasureC, setUnitofmeasureC] = useState('');
  const [manufacturerC, setManufacturerC] = useState('');
  const [classC, setClassC] = useState('');
  const [packC, setPackC] = useState('');
  const [sizeC, setSizeC] = useState('');
  const [tax, setTax] = useState('');
  const [hsn, setHsn] = useState('');
  const [weightC, setWeightC] = useState('');

  const [stockC, setStockC] = useState('');
  const [retailPrice, setRetailPrice] = useState('');
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
    // console.log("response", res.assets[0].uri);
    imageResize(res.assets[0].uri, res.assets[0].type);
  }
  const handleGallery = async () => {
    // setModalVisible1(false);
    const res = await launchImageLibrary({
      mediaType: 'photo',

    });
    // console.log("response", res.assets[0].uri);
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
        // console.log('image resize', res);
        // console.log('name', res.name);
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

  const handleSubmit = () => {
    if (partNumber && name && description && currency && priceC && upcC && category
      && subcategoryC && unitofmeasureC && manufacturerC && classC
      && packC && sizeC && tax && hsn && weightC && mnfdDate && stockC
      && retailPrice && base64img) {
      // console.log("name", imgName.current)
      const payload = {
        __ordouser_id__: token,
        __part_number__: partNumber,
        __name__: name,
        __currency__:currency,
        __description__: description,
        __upc_c__: upcC,
        __price_c__: priceC,
        __category__: category,
        __subcategory_c__: subcategoryC,
        __unitofmeasure_c__: unitofmeasureC,
        __manufacturer_c__: manufacturerC,
        __class_c__: classC,
        __pack_c__: packC,
        __size_c__: sizeC,
        __tax__: tax,
        __hsn__: hsn,
        __weight_c__: weightC,
        __manufactured_date_c__: moment(date).format('YYYY-MM-DD'),
        __stock_c__: stockC,
        __retail_price__: retailPrice,
        __product_image__: base64img,
        __image_name__: imgName.current
      };

      // console.log("data", payload)

      fetch('https://dev.ordo.primesophic.com/set_merchandiser_products.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
        .then(response => response.json())
        .then(res => {
          // console.log(res);
          if (res.status == "200") {
            Alert.alert('Add Brand', 'Brand added successfully', [
              { text: 'OK', onPress: () => navigation.goBack() }
            ])
          }
        })
        .catch(error => {
          // Handle the error here
          console.log(error);
        });
    }
    else {
      Alert.alert('Warning', 'Please fill all the details');
    }
  };

  useEffect(() => {
    //getting all predefined drop down values
    getDropDown();

  }, [])

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.headercontainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <AntDesign name="arrowleft" size={25} color={Colors.black} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Brand</Text>
        </View>
        <Text style={{ ...styles.label, marginTop: 3 }}>Part Number</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Part Number"
          value={partNumber}
          onChangeText={text => setPartNumber(text)}

        />
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Name"
          value={name}
          onChangeText={text => setName(text)}
        />
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Description"
          value={description}
          onChangeText={text => setDescription(text)}
        />

        <Text style={styles.label}>Currency</Text>
        <Dropdown
          style={[styles.dropdown]}
          placeholderStyle={styles.placeholderStyle}
          searchPlaceholder='Search'
          selectedTextStyle={styles.selectedTextStyle}
          itemTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={currencyOption}
          maxHeight={400}
          labelField="label"
          valueField="value"
          placeholder={!isFocus4 ? 'Currency' : '...'}
          //searchPlaceholder="Search..."
          value={currency}
          onFocus={() => setIsFocus4(true)}
          onBlur={() => setIsFocus4(false)}
          onChange={item => {
            setCurrency(item.value);
            setIsFocus4(false);
          }}
        />
        <View style={{ ...styles.rowContainer, marginTop: 8 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ ...styles.label }}>Upc</Text>
            <TextInput
              style={[styles.textInput, styles.halfTextInput]}
              placeholder="Upc"
              value={upcC}
              onChangeText={text => setUpcC(text)}
            />
          </View>
          <View style={{ flex: 1, marginLeft: 8 }}>
            <Text style={styles.label}>Price</Text>
            <TextInput
              style={[styles.textInput, styles.halfTextInput]}
              placeholder="Price"
              value={priceC}
              keyboardType='numeric'
              onChangeText={text => setPriceC(text)}
            />
          </View>
        </View>

        <Text style={styles.label}>Category</Text>
        <Dropdown
          style={[styles.dropdown]}
          placeholderStyle={styles.placeholderStyle}
          searchPlaceholder='Search'
          selectedTextStyle={styles.selectedTextStyle}
          itemTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={categoryOption}
          search
          maxHeight={400}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? 'Category' : '...'}
          //searchPlaceholder="Search..."
          value={category}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            setCategory(item.value);
            setIsFocus(false);
          }}
        />
        <Text style={{ ...styles.label, marginTop: 5 }} >Sub Category</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Subcategory"
          value={subcategoryC}
          onChangeText={text => setSubcategoryC(text)}
        />
        <Text style={{ ...styles.label }}>Unit of Measure</Text>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          itemTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={unitOption}
          //search
          maxHeight={400}
          labelField="label"
          valueField="value"
          placeholder={!isFocus2 ? 'Unit of Measure' : '...'}
          //searchPlaceholder="Search..."
          value={unitofmeasureC}
          onFocus={() => setIsFocus2(true)}
          onBlur={() => setIsFocus2(false)}
          onChange={item => {
            setUnitofmeasureC(item.value);
            setIsFocus2(false);
          }}
        />
        <Text style={{ ...styles.label, marginTop: 5 }} >Manufacturer</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Manufacturer"
          value={manufacturerC}
          onChangeText={text => setManufacturerC(text)}
        />
        <Text style={styles.label}>Class</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Class"
          value={classC}
          onChangeText={text => setClassC(text)}
        />
        <View style={styles.rowContainer}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Pack</Text>
            <TextInput
              style={[styles.textInput, styles.halfTextInput]}
              placeholder="Pack"
              value={packC}
              keyboardType='numeric'
              onChangeText={text => setPackC(text)}
            />
          </View>
          <View style={{ flex: 1, marginLeft: 8 }}>
            <Text style={styles.label}>Size</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Size"
              value={sizeC}
              onChangeText={text => setSizeC(text)}
            />
          </View>
        </View>

        <Text style={{ ...styles.label }}>Tax</Text>
        <Dropdown
          style={[styles.dropdown]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          itemTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={taxOption}
          //search
          maxHeight={400}
          labelField="label"
          valueField="value"
          placeholder={!isFocus3 ? 'Select tax' : '...'}
          //searchPlaceholder="Search..."
          value={tax}
          onFocus={() => setIsFocus3(true)}
          onBlur={() => setIsFocus3(false)}
          onChange={item => {
            setTax(item.value);
            setIsFocus3(false);
          }}
        />
        <Text style={{ ...styles.label, marginTop: 5 }}>Hsn</Text>
        <TextInput
          style={[styles.textInput, styles.halfTextInput]}
          placeholder="Hsn"
          value={hsn}
          onChangeText={text => setHsn(text)}
        />


        <View style={styles.rowContainer}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Weight</Text>
            <TextInput
              style={[styles.textInput, styles.halfTextInput]}
              placeholder="Weight"
              value={weightC}
              onChangeText={text => setWeightC(text)}
              keyboardType='numeric'
            />
          </View>
          {/* Date modal */}
          {open == true ?
            <DatePicker
              modal
              theme='light'
              mode={'date'}
              open={open}
              date={date}
              format="YYYY-MM-DD"
              minDate="2022-01-01"
              maximumDate={new Date()}
              onConfirm={(date) => {
                const dateString = date.toLocaleDateString();
                // console.log(dateString);
                setOpen(false)
                setDate(date)
                setMnfdDate(dateString);
              }}
              onCancel={() => {
                setOpen(false)
              }}
            /> : null}
          <View style={{ flex: 1, marginLeft: 8 }}>
            <InputWithLabel
              title='Mfg Date'
              value={mnfdDate}
              onPress={() => setOpen(true)}
            />
          </View>
        </View>
        <View style={styles.rowContainer}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Stock</Text>
            <TextInput
              style={[styles.textInput, styles.halfTextInput]}
              placeholder="Stock"
              value={stockC}
              onChangeText={text => setStockC(text)}
              keyboardType='numeric'
            />
          </View>
          <View style={{ flex: 1, marginLeft: 8 }}>
            <Text style={styles.label}>Retail Price (INR)</Text>
            <TextInput
              style={[styles.textInput, styles.halfTextInput]}
              placeholder="Retail Price"
              value={retailPrice}
              keyboardType='numeric'
              onChangeText={text => setRetailPrice(text)}
            />
          </View>
        </View>
        <Text style={styles.modalTitle}>Upload Photo</Text>
        <View style={styles.buttonview}>
          <TouchableOpacity style={styles.photosContainer} onPress={checkPermission}>
            <Text style={styles.buttonText}>Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.photosContainer} onPress={handleGallery}>
            <Text style={styles.buttonText}>Gallery</Text>
          </TouchableOpacity>
          {/* <View style={styles.closeView}>
                        <Button title="Close" onPress={() => setModalVisible1(false)} />
                      </View> */}
        </View>
        {base64img && <Image source={{ uri: base64img }} style={{ width: 90, height: 90, resizeMode: 'cover', borderRadius: 8, marginLeft: 10, marginBottom: 10 }} />}
        <TouchableOpacity style={styles.button} onPress={handleSubmit} activeOpacity={0.8}>
          <Text style={styles.btnText}>Submit</Text>
        </TouchableOpacity>


      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingTop: 10,
    backgroundColor: 'white',
    flex: 1,
  },
  textInput: {
    borderColor: 'grey',
    borderWidth: 1,
    backgroundColor: 'white',
    height: 40,
    marginBottom: 5,
    padding: 5,
    paddingLeft: 8,

    fontFamily: 'AvenirNextCyr-Thin',
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
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'AvenirNextCyr-Medium',
    color: Colors.black,
    marginLeft: 10,
    marginTop: 3,
  },
  button: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: Colors.primary,
    marginBottom: 10
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
    fontFamily: 'AvenirNextCyr-Thin',
    color: 'white'
  },
  label: {
    fontSize: 16,
    color: Colors.black,
    fontFamily: 'AvenirNextCyr-Medium',
    //marginTop:5
  },
  dropdown: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    //borderRadius: 8,
    paddingHorizontal: 8,
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
    fontFamily: 'AvenirNextCyr-Thin',
    color: 'grey'
  },
  selectedTextStyle: {
    fontSize: 16,
    fontFamily: 'AvenirNextCyr-Thin'
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
    fontFamily: 'AvenirNextCyr-Thin',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

  },
  input2: {
    fontFamily: 'AvenirNextCyr-Thin',
    padding: 8,
    flex: 1,
  },
});

export default AddBrand;
