import React, { useState, useContext, useRef, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  Text,
  Image,
  Alert,
  Modal,
  ScrollView,
  BackHandler,
  Keyboard
} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import Colors from "../../constants/Colors";
import { AuthContext } from "../../Context/AuthContext";
import ImageResizer from "@bam.tech/react-native-image-resizer";
import RNFS from "react-native-fs";
import { cameraPermission } from "../../utils/Helper";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Dropdown } from "react-native-element-dropdown";
import DatePicker from "react-native-date-picker";
import moment from "moment";
import Toast from "react-native-simple-toast";
import RNFetchBlob from "rn-fetch-blob";
import { TextInput as TextInput1, Button as Button1 } from "react-native-paper";
import { hs, vs, ms } from "../../utils/Metrics";
import LinearGradient from 'react-native-linear-gradient'
import { Fold, Wave } from 'react-native-animated-spinkit';
import { DatePickerModal, DatePickerInput } from "react-native-paper-dates";
import AddFloating from "../../components/AddFloating";

const MerchAddProduct = ({ navigation, route }) => {
  //drop down hooks
  const [categoryOption, setCategoryOption] = useState([]);
  const [currencyOption, setCurrencyOption] = useState([]);
  const [taxOption, setTaxOption] = useState([]);
  const [unitOption, setUnitOption] = useState([]);
  const [showSecondModal, setShowSecondModal] = useState(false);
  const [isFocus1, setIsFocus1] = useState(false);
  const [fileFormat, setFileFormat] = useState(false);
  const [manufactureDate, setManufactureDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [noofdays, setNoofdays] = useState("");
  const [weight, setWeight] = useState("");
  const [company, setCompany] = useState("");
  const [companyOpt, setCompanyOpt] = useState([]);




  const [visible1, setVisible1] = React.useState(false);
  const [visible2, setVisible2] = React.useState(false);

  const { item,check } = route.params || {};

  // console.log("item",item)

  useEffect(() => {
    const backAction = () => {
      Alert.alert(
        "Hold on!",
        "If you go back, your data will be lost. Are you sure you want to go back?",
        [
          {
            text: "Cancel",
            onPress: () => null,
            style: "cancel"
          },
          { text: "YES", onPress: () => navigation.goBack() }
        ]
      );
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);


   
  const handleBackPress = () => {
    Alert.alert(
      "Hold on!",
      "If you go back, your data will be lost. Are you sure you want to go back?",
      [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel"
        },
        { text: "YES", onPress: () => navigation.goBack() }
      ]
    );
  };


  const onDismiss1 = React.useCallback(() => {
    setVisible1(false);
  }, [setVisible1]);

  const onChange1 = React.useCallback(({ date }) => {
    setVisible1(false);
    const EmStart = moment(date).format("DD/MM/YYYY");
    setManufactureDate(EmStart);
  }, []);

  const onDismiss2 = React.useCallback(() => {
    setVisible2(false);
  }, [setVisible2]);

  const onChange2 = React.useCallback(({ date }) => {
    setVisible2(false);
    const EmStart = moment(date).format("DD/MM/YYYY");
    setExpiryDate(EmStart);
  }, []);

  useEffect(() => {
    getBrand();
  }, []);

  const getBrand = async (userId) => {
    // Fetch category list API
    var myHeaders = new Headers();

    myHeaders.append("Authorization", `Bearer ${userData.token}`);

    var raw = "";

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    try {
      const response = await fetch(
        "https://gsidev.ordosolution.com/api/company/",
        requestOptions
      );
      const result = await response.json();

      // console.log("brand", result);
      // setCompanyResponse(result);
      
      const allOption = { label: 'All', value: 'all' };
    const transformedData = result.map((item) => ({
      label: item?.name,
      value: item?.id,
    }));

    // Filter out duplicate labels and remove "All" if already present
    const uniqueData = transformedData.filter((item, index, array) => {
      return array.findIndex((i) => i.label === item.label) === index;
    });

      // console.log("dhalfahljfahfaiiq", uniqueData);
      setCompanyOpt(uniqueData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };


  const InputWithLabel1 = ({ title, value, onPress }) => {
    const textColor = Colors.black;
    return (
      <View>
        {/* <Text style={styles.labelText}>{title}</Text> */}
        <Pressable style={{ ...styles.inputContainer }} onPress={onPress}>
          <Text style={{ ...styles.input2, color: textColor }}>
            {value ? value : "Select Manufacture Date"}
          </Text>
          <Image
            style={{ width: 20, height: 20, marginRight: 15 }}
            source={require("../../assets/images/calendar.png")}
          ></Image>
        </Pressable>
      </View>
    );
  };

  const InputWithLabel2 = ({ title, value, onPress }) => {
    const textColor = Colors.black;
    return (
      <View>
        {/* <Text style={styles.labelText}>{title}</Text> */}
        <Pressable style={{ ...styles.inputContainer }} onPress={onPress}>
          <Text style={{ ...styles.input2, color: textColor }}>
            {value ? value : "Select Expiry Date"}
          </Text>
          <Image
            style={{ width: 20, height: 20, marginRight: 15 }}
            source={require("../../assets/images/calendar.png")}
          ></Image>
        </Pressable>
      </View>
    );
  };


  useEffect(() => {
    if (item?.id) {
      console.log("supplier there, ", item.id);
      getProductDetails();
    }
  }, [item?.id]);

  const getDropDown = () => {
    fetch("https://dev.ordo.primesophic.com/get_dropdownfields.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        __module_name__: "AOS_Products",
      }),
    })
      .then((response) => response.json())
      .then(async (res) => {
        // console.log("drop down api res", res);
        //Category dropdown
        const categoryArray = Object.keys(res?.product_categories_array).map(
          (key) => ({
            label: res?.product_categories_array[key],
            value: key,
          })
        );

        categoryArray.push({
          label: "Other",
          value: "other",
        });

        // console.log("category option", categoryArray);
        // setCategoryOption(categoryArray);

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
      .catch((error) => {
        // Handle the error here
        console.log(error);
      });
  };

  const [currentView, setCurrentView] = useState("Basic Info");
  const [base64img, setBase64img] = useState([]);
  const [convertedBase64img, setConvertedBase64img] = useState(null);
  const { token, userData } = useContext(AuthContext);
  const [partNumber, setPartNumber] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [composition, setComposition] = useState("");
  const [loading, setLoading] = useState(false);

  const [upcC, setUpcC] = useState("");
  const [priceC, setPriceC] = useState("");
  const [category, setCategory] = useState("");
  const [subcategoryC, setSubcategoryC] = useState("");
  const [unitofmeasureC, setUnitofmeasureC] = useState("");
  const [manufacturerC, setManufacturerC] = useState("");
  const [classC, setClassC] = useState("");
  const [packC, setPackC] = useState("");
  const [sizeC, setSizeC] = useState("");
  const [tax, setTax] = useState("");
  const [hsn, setHsn] = useState("");
  const [unitPack, setUnitPack] = useState("");
  const [type, setType] = useState("");
  const [ptr, setPtr] = useState("");
  const [pts, setPts] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [customBrand, setCustomBrand] = useState("");
  const [brandData, setBrandData] = useState([]);
  const [supplierDrop, setSupplierDrop] = useState([]);

  const [stockC, setStockC] = useState("");
  const [baseCode, setBaseCode] = useState('');
  const imgName = useRef("");

  //cateogry drop down hooks
  const [currency, setCurrency] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [isFocus2, setIsFocus2] = useState(false);
  const [isFocus3, setIsFocus3] = useState(false);
  const [isFocus4, setIsFocus4] = useState(false);
  const [isFocus5, setIsFocus5] = useState(false);

  const optionData = [
    { label: "Quarterly", value: "Quarterly" },
    { label: "Monthly", value: "Monthly" },
    { label: "Weekly", value: "Weekly" },
  ];

  //date picker hooks
  const [mnfdDate, setMnfdDate] = useState("");
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date());

  // new
  const InputWithLabel = ({ title, value, onPress }) => {
    return (
      <View>
        <Text style={styles.labelText}>{title}</Text>
        <Pressable style={{ ...styles.inputContainer }} onPress={onPress}>
          <Text style={styles.input2}>{value ? value : "Select date"}</Text>
          <Image
            style={{ width: 20, height: 20, marginRight: 15 }}
            source={require("../../assets/images/calendar.png")}
          ></Image>
        </Pressable>
      </View>
    );
  };

  const getProductDetails = () => {
    setLoading(true);
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${userData.token}`);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(`https://gsidev.ordosolution.com/api/product/${item.id}/`, requestOptions)
      .then((response) => response.json())
      .then(async (result) => {
        if (result) {
          console.log("supp details", result);

          setName(result.name);
          setCategory(result.product_category?.product_category_name);
          setCustomCategory(result.customCategory);
          setHsn(result.hsc_code);
          setCurrency(result.currency);
          setPriceC(result.product_price);
          setUnitPack(result.product_unit_pack);
          setPackC(result.box_pack);
          setBase64img(result.product_image.map(imageUrl => `data:${type};base64,${imageUrl}`));
          setTax(result.product_tax);
          setUnitofmeasureC(result.unit_of_measure);
          setPtr(result.ptr);
          setPts(result.pts);
          setStockC(result.stock);
          setComposition(result.composition);
          setClassC(result.product_class);
          setDescription(result.description);
          setManufacturerC(result.supplier.id);
          setSubcategoryC(result.brand.brand_name);
          setWeight(result.product_weight);
          setExpiryDate(moment(result.expiry_date).format("DD/MM/YYYY"));
          setManufactureDate(moment(result.mfd).format("DD/MM/YYYY"));
          setCompany(result.company.id);
          // setNoofdays(result?.no_of_days_remaining);
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error in get product", error);
      });
  };

  const checkPermission = async () => {
    console.log("checking camera permission");
    let permissionGranted = await cameraPermission();
    if (permissionGranted) {
        console.log("camera permission granted");
        handleCamera();
    } else {
        console.log("camera permission denied");
        // Optionally handle what happens when permission is denied
    }
};


  const handleCamera = async () => {
    const res = await launchCamera({
      mediaType: "photo",
      multiple: true, // Allow multiple selection
    });
    const imageUris = res.assets.map(asset => asset.uri);
    imageResize(imageUris);
  };
  
  const handleGallery = async () => {
    const res = await launchImageLibrary({
      mediaType: "photo",
      multiple: true, // Allow multiple selection
    });
    const imageUris = res.assets.map(asset => asset.uri);
    imageResize(imageUris);
  };
  

  const imageResize = async (images) => {
    const resizedImages = await Promise.all(
      images.map(async (img) => {
        try {
          const resizedImage = await ImageResizer.createResizedImage(img, 300, 300, "JPEG", 50);
          const base64 = await RNFS.readFile(resizedImage.uri, "base64");
          return { uri: resizedImage.uri, base64 };
        } catch (err) {
          console.log("Error resizing image:", err);
          return null;
        }
      })
    );
  
    // Append the new resized images to the existing array of images
    setBase64img(prevImages => [...prevImages, ...resizedImages.filter(img => img !== null)]);
  };
  


// console.log("base 64 multi", base64img)

  const handleDropdownChange = (item) => {
    if (item.value === "other") {
      setCategory("");
      setIsFocus(true);
    } else {
      setCategory(item.label);
      setIsFocus(false);
    }
  };

  const BrandDropdown = async (id) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${userData.token}`);

    var raw = "";

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    try {
      const response = await fetch(
        "https://gsidev.ordosolution.com/api/brand-and-category-list/",
        requestOptions
      );
      const result = await response.json();

      const brands = result.brands.map((brand) => {
        return {
          label: brand.name,
          value: brand.name,
        };
      });

      brands.push({
        label: "Other",
        value: "other",
      });

      console.log("brand",brands)

      setBrandData(brands);

      const category = result.product_categories.map((category) => {
        return {
          label: category.name,
          value: category.name,
        };
      });

      category.push({
        label: "Other",
        value: "other",
      });
      

      setCategoryOption(category);

      const supplier = result.supplier.map((supplier) => {
        return {
          label: supplier.full_name,
          value: supplier.id,
        };
      });

      setSupplierDrop(supplier);

      // console.log("Brand Data:", supplierDrop);
    } catch (error) {
      console.log("error", error);
    }
  };

  // const formattedBase64Img = base64img.map(obj => `data:image/jpeg;base64,${obj.base64}`);

  // console.log("formattedBase64Img",formattedBase64Img);

  const handleNext = () => {
    if (!name || !description || !composition || !currency || !company || !category || !subcategoryC || !unitofmeasureC || !manufacturerC) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!base64img || base64img.length === 0){
      Alert.alert('Error', 'Please Upload Prodcut Image');
      return;
    }

    setCurrentView('Price & Stock');
  };

  const handleAdditionalNext = () => {
    
    if (!stockC || !priceC || !tax || !packC || !hsn || !unitPack || !manufactureDate || !expiryDate || !noofdays) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setCurrentView("Additional Details");
  };

  const handleSubmit = async () => {
    if (!weight || !classC ) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    setLoading(true);


    if (name && currency && description && company) {
      // Check if base64img is an array and has elements
      if (Array.isArray(base64img) && base64img.length > 0) {
        const formattedBase64Img = base64img.map(obj => `data:image/jpeg;base64,${obj.base64}`);
  
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${userData.token}`);
        myHeaders.append("Content-Type", "application/json");
  
        var raw = JSON.stringify({
          name: name,
          product_category: customCategory ? customCategory : category,
          hsc_code: hsn,
          currency: currency,
          product_price: priceC,
          product_unit_pack: unitPack,
          box_pack: packC,
          product_image: formattedBase64Img ? formattedBase64Img : [],
          product_tax: tax,
          unit_of_measure: unitofmeasureC,
          ptr: ptr,
          pts: pts,
          stock: stockC,
          composition: composition,
          product_class: classC,
          description: description,
          brand: customBrand ? customBrand : subcategoryC,
          supplier: manufacturerC,
          is_stock: true,
          mfd:moment(manufactureDate, "DD/MM/YYYY").format(
            "YYYY-MM-DD"
          ),
          expiry_date:moment(expiryDate, "DD/MM/YYYY").format(
            "YYYY-MM-DD"
          ),
          no_of_days_remaining :noofdays,
          product_weight:weight,
          company:company,

        });

        console.log('check raw while submitting',raw)
  
        var requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow",
        };
  
        try {
          const response = await fetch(
            "https://gsidev.ordosolution.com/api/product/",
            requestOptions
          );
          const result = await response.json();
  
          clearFields();
          Toast.show("Product added successfully", Toast.LONG);
  
          navigation.goBack();
        } catch (error) {
          console.log("Error:", error);
      setLoading(false);

          // Handle error response
          // For example, show an alert or log the error
        }
      } else {
        console.log("base64img is not a valid array or is empty");
        // Handle the case when base64img is not valid
        // For example, show an alert or log a message
      }
    } else {
      Alert.alert("Warning", "Please enter all details");
    }
  };
  

  const clearFields = () => {
    setName("");
    setCategory("");
    setCustomCategory("");
    setHsn("");
    setCurrency("");
    setPriceC("");
    setUnitPack("");
    setPackC("");
    setBase64img("");
    setTax("");
    setUnitofmeasureC("");
    setPtr("");
    setPts("");
    setStockC("");
    setComposition("");
    setClassC("");
    setDescription("");
    setManufacturerC("");
    setSubcategoryC("");
    setWeight("");
    setCompany("");
  };


console.log("company",company)

  useEffect(() => {
    //getting all predefined drop down values
    getDropDown();
    BrandDropdown();
  }, []);

  const clearCustomCategory = () => {
    setCustomCategory("");
    setCategory("");
  };

  const clearCustomBrand = () => {
    setCustomBrand("");
    setSubcategoryC("");
  };

  useEffect(() => {
    console.log("from useEffect", convertedBase64img);
  }, [convertedBase64img]);

  // console.log("category",stockC)

  const renderBrandDropdown = () => {
    if (subcategoryC === "other") {
      return (
        <View>
       
               <TextInput1
            // placeholder="Enter Custom category"
            value={customBrand}
            onChangeText={(text) => setCustomBrand(text)}
            mode="outlined"
            label="Enter Custom Brand"
            theme={{ colors: { onSurfaceVariant: "black" } }}
            activeOutlineColor="#4b0482"
            // placeholder="Enter User Name"
            outlineColor="#B6B4B4"
            textColor="black"
            autoCapitalize="none"
            blurOnSubmit={false}
            // keyboardType="number-pad"
            onSubmitEditing={() => Keyboard.dismiss()}
            returnKeyType="done"
            outlineStyle={{ borderRadius: ms(10) }}
            style={{ marginBottom: "2%", height: 50, backgroundColor: "white"  }}
          />
          <TouchableOpacity
            onPress={() => clearCustomBrand()}
            style={{
              position: "absolute",
              right: "2%",
              top: "30%",
              paddingLeft: 10,
            }}
          >
            <AntDesign name="close" size={20} color="#000" />
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <Dropdown
          style={{ ...styles.dropdown }}
          placeholderStyle={styles.placeholderStyle}
          searchPlaceholder="Search"
          selectedTextStyle={styles.selectedTextStyle}
          itemTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={brandData}
          search
          maxHeight={400}
          labelField="label"
          valueField="value"
          placeholder={!isFocus5 ? "Brand" : "..."}
          //searchPlaceholder="Search..."
          value={subcategoryC}
          onFocus={() => setIsFocus5(true)}
          onBlur={() => setIsFocus5(false)}
          onChange={(item) => {
            setSubcategoryC(item.value);
            setIsFocus5(false);
          }}
        />
      );
    }
  };

  const renderDropdown = () => {
    if (category === "other") {
      return (
        <View>
          <TextInput1
            // placeholder="Enter Custom category"
            value={customCategory}
            onChangeText={(text) => setCustomCategory(text)}
            mode="outlined"
            label="Enter Custom category"
            theme={{ colors: { onSurfaceVariant: "black" } }}
            activeOutlineColor="#4b0482"
            // placeholder="Enter User Name"
            outlineColor="#B6B4B4"
            textColor="black"
            autoCapitalize="none"
            blurOnSubmit={false}
            // keyboardType="number-pad"
            onSubmitEditing={() => Keyboard.dismiss()}
            returnKeyType="done"
            outlineStyle={{ borderRadius: ms(10) }}
            style={{ marginBottom: "2%", height: 50, backgroundColor: "white"  }}
          />
          <TouchableOpacity
            onPress={() => clearCustomCategory()}
            style={{
              position: "absolute",
              right: "2%",
              top: "30%",
              paddingLeft: 10,
            }}
          >
            <AntDesign name="close" size={20} color="#000" />
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <Dropdown
          style={{ ...styles.dropdown,marginBottom: "2%"}}
          placeholderStyle={styles.placeholderStyle}
          searchPlaceholder="Search"
          selectedTextStyle={styles.selectedTextStyle}
          itemTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={categoryOption}
          search
          maxHeight={400}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? "Product Category" : "..."}
          //searchPlaceholder="Search..."
          value={category}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={(item) => {
            setCategory(item.value);
            setIsFocus(false);
          }}
        />
      );
    }
  };




  const imageUrlToBase64 = async (imageUrl) => {
    try {
      const response = await RNFetchBlob.fetch('GET', imageUrl);
      const base64Data = response.base64();
      return base64Data;
    } catch (error) {
      console.error('Error converting image URL to base64:', error);
      throw error;
    }
  };
  
  // Function to convert array of image URLs to base64
  const urlsToBase64 = async (urls) => {
    const base64Array = [];
    for (const url of urls) {
      try {
        const base64Data = await imageUrlToBase64(url);
        base64Array.push(`data:image/jpeg;base64,${base64Data}`); // Append with data:image/jpeg;base64,
      } catch (error) {
        console.error('Error converting image URL to base64:', error);
      }
    }
    return base64Array;
  };
  
  // Usage
  // const trimmedArray = [
  //   'https://ordoo-bucket-1.s3.us-east-2.amazonaws.com/41E36aSguPL._SX300_SY300_QL70_FMwebp_.webp',
  //   'https://ordoo-bucket-1.s3.us-east-2.amazonaws.com/71F8kKbNiJL._SX679_.jpg',
  //   'https://ordoo-bucket-1.s3.us-east-2.amazonaws.com/81GroOXFESL._SX679_.jpg'
  // ];
  
 


  const handleEdit = async (id) => {

    if (!weight || !classC ) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);

    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${userData.token}`);
    myHeaders.append("Content-Type", "application/json");
    let basea=""
    // const trimmedString = base64img.substring("data:;base64,".length);
    const trimmedArray = base64img.map(str => str.replace(/^data:;base64,/, ""));
    let updatedImages = trimmedArray; // Initialize with existing images

    console.log("trimmedArray",trimmedArray);
    // Check if new images were selected
    // const isFileFormat = base64img[0] && base64img[0].startsWith("data:");
    // if (!isFileFormat) {
    //   // New images selected, convert them to base64
    //   updatedImages = await Promise.all(
    //     trimmedArray.map(async (img) => {
    //       try {
    //         const response = await RNFetchBlob.fetch("GET", img);
    //         const base64Data = response.base64();
    //         return `data:image/jpeg;base64,${base64Data}`;
    //       } catch (error) {
    //         console.error("Error converting image URL to base64:", error);
    //         throw error;
    //       }
    //     })
    //   );
    // }
    
    urlsToBase64(updatedImages)
    .then((base64Array) => {
      // Now you have an array of base64 encoded images
      setBaseCode(base64Array)
      // Send this array to wherever you need
    })
    .catch((error) => {
      console.error('Error converting image URLs to base64:', error);
    });

    // console.log("base64Array1",baseCode);
    
    var raw = JSON.stringify({
      name: name,
      product_category: customCategory ? customCategory : category,
      hsc_code: hsn,
      currency: currency,
      product_price: priceC,
      product_unit_pack: unitPack,
      box_pack: packC,
      product_image: baseCode,
      product_tax: tax,
      unit_of_measure: unitofmeasureC,
      ptr: ptr,
      pts: pts,
      stock: stockC,
      composition: composition,
      product_class: classC,
      description: description,
      brand: customBrand ? customBrand : subcategoryC,
      supplier: manufacturerC,
      is_stock: true,
      company:company,
      no_of_days_remaining :noofdays,
      product_weight:weight,
      mfd:moment(manufactureDate, "DD/MM/YYYY").format(
        "YYYY-MM-DD"
      ),
      expiry_date:moment(expiryDate, "DD/MM/YYYY").format(
        "YYYY-MM-DD"
      )

    });


    // console.log("base64Array2",baseCode);
  
    console.log("raw", raw);
  
    var requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
  
    try {
      const response = await fetch(
        `https://gsidev.ordosolution.com/api/product/${id}/`,
        requestOptions
      );
      const result = await response.json();
  
      console.log("Product Result:", result);
      clearFields();
      Toast.show("Product edited successfully", Toast.LONG);
  
      navigation.goBack();
    } catch (error) {
      console.log("error", error);
      setLoading(false);

      // Handle error response
      // For example, show an alert or log the error
    }
  };
  
//  console.log("base 64 Multi",manufacturerC)
const deleteImage = (index) => {
  // Create a copy of the base64img array
  const updatedImages = [...base64img];
  // Remove the image at the specified index
  updatedImages.splice(index, 1);
  // Update the state with the new array
  setBase64img(updatedImages);
};


console.log("check mfd, expiry, no of days",manufactureDate,expiryDate,noofdays)

useEffect(() => {
  calculateDaysDifference();
}, [manufactureDate, expiryDate]);


const calculateDaysDifference = () => {
  const manufactureDateParts = manufactureDate.split("/");
  const expiryDateParts = expiryDate.split("/");

  const manufactureDateTime = new Date(manufactureDateParts[2], manufactureDateParts[1] - 1, manufactureDateParts[0]);
  const expiryDateTime = new Date(expiryDateParts[2], expiryDateParts[1] - 1, expiryDateParts[0]);

  const oneDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day
  let diffDays = Math.round((expiryDateTime - manufactureDateTime) / oneDay);

  // Check if diffDays is NaN, if so, set it to 0
  if (isNaN(diffDays)) {
    diffDays = 0;
  }

  setNoofdays(diffDays.toString());
};



const convertToDateObject = (dateString) => {
  const [day, month, year] = dateString.split("/");
  return new Date(year, month - 1, day); // Month - 1 because month is zero-based in JavaScript Date
};

const renderLabel = (label, focus, value) => {
  if ((Array.isArray(value) && value.length > 0) || (!Array.isArray(value) && value)) {
      return (
          <Text style={[styles.labelll, (label == "Source" || label == "Destination") && { top: 8 }]}>
              {label}
          </Text>
      );
  }
  return null;
};

  const renderBasicInformation = () => {
    return (
      <View style={{ flex: 1 }}>
       <Text style={styles.tabButtonText}>Basic Info</Text>
        <ScrollView>
        
              <TextInput1
            mode="outlined"
            label="Name"
            theme={{ colors: { onSurfaceVariant: "black" } }}
            activeOutlineColor="#4b0482"
            // placeholder="Enter User Name"
            outlineColor="#B6B4B4"
            textColor="black"
            onChangeText={(text) => setName(text)}
            autoCapitalize="none"
            blurOnSubmit={false}
            onSubmitEditing={() => Keyboard.dismiss()}
            value={name}
            // keyboardType="number-pad"
            returnKeyType="done"
            outlineStyle={{ borderRadius: ms(10) }}
            style={{ marginBottom: "2%", height: 50, backgroundColor: "white"  }}
          />

<TextInput1
            mode="outlined"
            label="Description"
            theme={{ colors: { onSurfaceVariant: "black" } }}
            activeOutlineColor="#4b0482"
            // placeholder="Enter User Name"
            outlineColor="#B6B4B4"
            textColor="black"
            onChangeText={(text) => setDescription(text)}
            autoCapitalize="none"
            blurOnSubmit={false}
            onSubmitEditing={() => Keyboard.dismiss()}
            value={description}
            // keyboardType="number-pad"
            returnKeyType="done"
            outlineStyle={{ borderRadius: ms(10) }}
            style={{ marginBottom: "2%", height: 50, backgroundColor: "white"  }}
          />

<TextInput1
            mode="outlined"
            label="Composition"
            theme={{ colors: { onSurfaceVariant: "black" } }}
            activeOutlineColor="#4b0482"
            // placeholder="Enter User Name"
            outlineColor="#B6B4B4"
            textColor="black"
            onChangeText={(text) => setComposition(text)}
            autoCapitalize="none"
            blurOnSubmit={false}
            onSubmitEditing={() => Keyboard.dismiss()}
            value={composition}
            // keyboardType="number-pad"
            returnKeyType="done"
            outlineStyle={{ borderRadius: ms(10) }}
            style={{ marginBottom: "2%", height: 50, backgroundColor: "white"  }}
          />

<TextInput1
            mode="outlined"
            label="Currency"
            theme={{ colors: { onSurfaceVariant: "black" } }}
            activeOutlineColor="#4b0482"
            // placeholder="Enter User Name"
            outlineColor="#B6B4B4"
            textColor="black"
            onChangeText={(text) => setCurrency(text)}
            autoCapitalize="none"
            blurOnSubmit={false}
            value={currency}
            onSubmitEditing={() => Keyboard.dismiss()}
            // keyboardType="number-pad"
            returnKeyType="done"
            outlineStyle={{ borderRadius: ms(10) }}
            style={{ marginBottom: "2%", height: 50, backgroundColor: "white"  }}
          />

<View style={{marginVertical:'1%'}}>
{renderLabel("Company", isFocus2, company)}

<Dropdown
            style={{ ...styles.dropdown, marginBottom: "3%" }}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            itemTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={companyOpt}
            maxHeight={400}
            labelField="label"
            valueField="value"
            placeholder={!isFocus2 ? "Company" : "..."}
            value={company}
            onFocus={() => setIsFocus2(true)}
            onBlur={() => setIsFocus2(false)}
            onChange={(item) => {
              setCompany(item.value);
              setIsFocus2(false);
            }}
          />
          </View>
{/* 
          <Text style={styles.label}>Product Category</Text> */}
          <View style={{marginVertical:'0%'}}>
{renderLabel("Product Category", isFocus, category)}
          {renderDropdown()}
          </View>

          {/* <Text style={{ ...styles.label, marginTop: 5 }}>Brand</Text> */}
          <View style={{marginVertical:'2%'}}>
            {
              subcategoryC !== "other" &&(
                <>
                {renderLabel("Brand", isFocus5, subcategoryC)}
                </>
              )
            }
          {renderBrandDropdown()}
</View>


          <View style={{ flex: 1 }}>
      
            <TextInput1
            mode="outlined"
            label="Unit of Measure"
            onSubmitEditing={() => Keyboard.dismiss()}
            theme={{ colors: { onSurfaceVariant: "black" } }}
            activeOutlineColor="#4b0482"
            // placeholder="Enter User Name"
            outlineColor="#B6B4B4"
            textColor="black"
            onChangeText={(text) => setUnitofmeasureC(text)}
            autoCapitalize="none"
            blurOnSubmit={false}
            value={unitofmeasureC}
            // keyboardType="number-pad"
            returnKeyType="done"
            outlineStyle={{ borderRadius: ms(10) }}
            style={{ marginBottom: "2%", height: 50, backgroundColor: "white"  }}
          />
          </View>

       

          {/* <Text style={{ ...styles.label }}>Supplier</Text> */}
          <View style={{marginVertical:'1%'}}>
          {renderLabel("Supplier", isFocus3, manufacturerC)}
          <Dropdown
            style={{ ...styles.dropdown, marginBottom: "3%" }}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            itemTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={supplierDrop}
            //search
            maxHeight={400}
            labelField="label"
            valueField="value"
            placeholder={!isFocus3 ? "Select Supplier" : "..."}
            //searchPlaceholder="Search..."
            value={manufacturerC}
            onFocus={() => setIsFocus3(true)}
            onBlur={() => setIsFocus3(false)}
            onChange={(item) => {
              setManufacturerC(item.value);
              setIsFocus3(false);
            }}
          />
          </View>

{!check && 
<View>
          <Text style={styles.modalTitle}>Upload Photo</Text>
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


                                </View>
                                <View style={{ flexDirection: 'row' , flexWrap: 'wrap' }}>
                                {base64img.map((imageData, index) => {
    console.log("Rendering Image", index);
    return (
      <View key={index} style={{ marginRight: 0, marginBottom: '4%' ,flexDirection: 'row'}}>
          <Image
            source={{ uri: `data:image/jpeg;base64,${imageData.base64}` }}
            style={{
              width: 90,
              height: 90,
              resizeMode: "cover",
              borderRadius: 8,
              marginLeft: 10,
              // marginBottom: 10,
            }}
          />
        <TouchableOpacity style={{justifyContent:'flex-end',marginLeft:'2%'}} onPress={() => deleteImage(index)}>
          <AntDesign name="delete" size={20} color={`black`} />
        </TouchableOpacity>
      </View>
    );
  })}


</View>
</View>
}
        </ScrollView>
        <View style={[styles.rowContainer, { justifyContent: "flex-end" }]}>
        <LinearGradient
                    colors={Colors.linearColors}
                    start={Colors.start}
                    end={Colors.end}
                    locations={Colors.ButtonsLocation}
                    style={{
                      // padding: 5,
    borderRadius: 5,
    backgroundColor: Colors.primary,
    paddingHorizontal: "2%",
    paddingVertical: "1%",

    

                    }}
                >
          <TouchableOpacity
            style={styles.NextPrevBtn}
            onPress={() => handleNext()}
          >
            <Text style={styles.tabButtonText1}>
            <AntDesign name="right" size={20} color="white" />

            </Text>
          </TouchableOpacity>
          </LinearGradient>
        </View>
      </View>
    );
  };



  const renderPricingAndInventory = () => {
    return (
      <View style={{ flex: 1 }}>
            <Text style={styles.tabButtonText}>Price & Stock</Text>

        <ScrollView>
        <View style={{ flex: 1 }}>
     
     <TextInput1
                 mode="outlined"
                 label="Stock"
                 theme={{ colors: { onSurfaceVariant: "black" } }}
                 activeOutlineColor="#4b0482"
                 // placeholder="Enter User Name"
                 outlineColor="#B6B4B4"
                 textColor="black"
                 onChangeText={(text) => setStockC(text)}
                 autoCapitalize="none"
                 blurOnSubmit={false}
                 onSubmitEditing={() => Keyboard.dismiss()}
                 value={stockC.toString()}
                 keyboardType="number-pad"
                 returnKeyType="done"
                 outlineStyle={{ borderRadius: ms(10) }}
                 style={{ marginBottom: "2%", height: 50, backgroundColor: "white"  }}
               />
               </View>
          <View style={{ flex: 1 }}>
        

<TextInput1
            mode="outlined"
            label="Price"
            onSubmitEditing={() => Keyboard.dismiss()}
            theme={{ colors: { onSurfaceVariant: "black" } }}
            activeOutlineColor="#4b0482"
            // placeholder="Enter User Name"
            outlineColor="#B6B4B4"
            textColor="black"
            onChangeText={(text) => setPriceC(text)}
            autoCapitalize="none"
            blurOnSubmit={false}
            value={priceC}
            keyboardType="number-pad"
            returnKeyType="done"
            outlineStyle={{ borderRadius: ms(10) }}
            style={{ marginBottom: "2%", height: 50, backgroundColor: "white"  }}
          />
          </View>

          <View style={{ flex: 1 }}>
                  <TextInput1
            mode="outlined"
            onSubmitEditing={() => Keyboard.dismiss()}
            label="Tax"
            theme={{ colors: { onSurfaceVariant: "black" } }}
            activeOutlineColor="#4b0482"
            // placeholder="Enter User Name"
            outlineColor="#B6B4B4"
            textColor="black"
            onChangeText={(text) => setTax(text)}
            autoCapitalize="none"
            blurOnSubmit={false}
            value={tax}
            keyboardType="number-pad"
            returnKeyType="done"
            outlineStyle={{ borderRadius: ms(10) }}
            style={{ marginBottom: "2%", height: 50, backgroundColor: "white"  }}
          />
          </View>

    



          <View style={{ flex: 1 }}>
          

<TextInput1
            mode="outlined"
            label="Box Pack"
            onSubmitEditing={() => Keyboard.dismiss()}
            theme={{ colors: { onSurfaceVariant: "black" } }}
            activeOutlineColor="#4b0482"
            // placeholder="Enter User Name"
            outlineColor="#B6B4B4"
            textColor="black"
            onChangeText={(text) => setPackC(text)}
            autoCapitalize="none"
            blurOnSubmit={false}
            value={packC}
            keyboardType="number-pad"
            returnKeyType="done"
            outlineStyle={{ borderRadius: ms(10) }}
            style={{ marginBottom: "2%", height: 50, backgroundColor: "white"  }}
          />
          </View>


 

          <View style={{ flex: 1 }}>
      
<TextInput1
            mode="outlined"
            label="HSN"
            onSubmitEditing={() => Keyboard.dismiss()}
            theme={{ colors: { onSurfaceVariant: "black" } }}
            activeOutlineColor="#4b0482"
            // placeholder="Enter User Name"
            outlineColor="#B6B4B4"
            textColor="black"
            onChangeText={(text) => setHsn(text)}
            autoCapitalize="none"
            blurOnSubmit={false}
            value={hsn}
            // keyboardType="number-pad"
            returnKeyType="done"
            outlineStyle={{ borderRadius: ms(10) }}
            style={{ marginBottom: "2%", height: 50, backgroundColor: "white"  }}
          />
          </View>

          <View style={{ flex: 1 }}>
            <TextInput1
            mode="outlined"
            label="Unit Pack"
            onSubmitEditing={() => Keyboard.dismiss()}
            theme={{ colors: { onSurfaceVariant: "black" } }}
            activeOutlineColor="#4b0482"
            // placeholder="Enter User Name"
            outlineColor="#B6B4B4"
            textColor="black"
            onChangeText={(text) => setUnitPack(text)}
            autoCapitalize="none"
            blurOnSubmit={false}
            value={unitPack}
            keyboardType="number-pad"
            returnKeyType="done"
            outlineStyle={{ borderRadius: ms(10) }}
            style={{ marginBottom: "2%", height: 50, backgroundColor: "white"  }}
          />
          </View>


          <View style={{}}>
{renderLabel("Manufacture Date", visible1, manufactureDate)}

            <InputWithLabel1
              title="Manufacture Date"
              value={manufactureDate}
              onPress={() => setVisible1(true)
              }
            />

            <DatePickerModal
              mode="single"
              visible={visible1}
              onDismiss={onDismiss1}
              // date={date}
              onConfirm={onChange1}
              presentationStyle="pageSheet"
              saveLabel="Save"
              label="Select date"
              animationType="slide"
              maximumDate={new Date()}
                 validRange={{
          // startDate: new Date(2021, 1, 2),
          endDate: new Date(), // optional
          // disabledDates: [new Date()] // optional
        }}
            />
          </View>

          <View style={{}}>
{renderLabel("Expiry Date", visible2, expiryDate)}
            <InputWithLabel2
              title="Expiry Date"
              value={expiryDate}
              onPress={() => {
            if (!manufactureDate) {
              Alert.alert("Select Manufacture Date", "Please select the manufacture date first.");
              return;
            }
            setVisible2(true);
          }}

            />

            <DatePickerModal
              mode="single"
              visible={visible2}
              onDismiss={onDismiss2}
              // date={date}
              onConfirm={onChange2}
              saveLabel="Save"
              label="Select date"
              animationType="slide"
              presentationStyle="pageSheet"
              // maximumDate={new Date()}
                 validRange={{
                  startDate: convertToDateObject(manufactureDate),
          // endDate: new Date(), // optional
          // disabledDates: [new Date()] // optional
        }}
            />
          </View>



          <View style={{ flex: 1 }}>
          

          <TextInput1
      mode="outlined"
      label="No. of Days Remaining"
      theme={{ colors: { onSurfaceVariant: "black" } }}
      activeOutlineColor="#4b0482"
      outlineColor="#B6B4B4"
      textColor="black"
      editable={false}
      value={noofdays}
      onSubmitEditing={() => Keyboard.dismiss()}
      keyboardType="number-pad"
      outlineStyle={{ borderRadius: 10 }}
      style={{ marginBottom: "2%", height: 50, backgroundColor: "white" }}
    />
          </View>

        </ScrollView>
        {/* <View style={{ flex: 1, justifyContent: "flex-end" }}>
          <View style={styles.rowContainer}>
          <LinearGradient
                    colors={Colors.linearColors}
                    start={Colors.start}
                    end={Colors.end}
                    locations={Colors.ButtonsLocation}
                    style={{
                      padding: 5,
    borderRadius: 5,
    // backgroundColor: Colors.primary,
    paddingHorizontal: "6%",
    

                    }}
                >
            <TouchableOpacity
              style={styles.NextPrevBtn}
              onPress={() => setCurrentView("Basic Info")}
            >
              <Text style={styles.tabButtonText1}>Prev</Text>
            </TouchableOpacity>
            </LinearGradient>

            <LinearGradient
                    colors={Colors.linearColors}
                    start={Colors.start}
                    end={Colors.end}
                    locations={Colors.ButtonsLocation}
                    style={{
                      padding: 5,
    borderRadius: 5,
    // backgroundColor: Colors.primary,
    paddingHorizontal: "6%",
    

                    }}
                >
            <TouchableOpacity
              style={styles.NextPrevBtn}
              onPress={() => setCurrentView("Additional Details")}
            >
              <Text style={styles.tabButtonText1}>Next</Text>
            </TouchableOpacity>
            </LinearGradient>
          </View>
        </View> */}

        <View style={styles.rowContainer}>
        <LinearGradient
                    colors={Colors.linearColors}
                    start={Colors.start}
                    end={Colors.end}
                    locations={Colors.ButtonsLocation}
                    style={{
                      borderRadius: 5,
    backgroundColor: Colors.primary,
    paddingHorizontal: "2%",
    paddingVertical: "1%",
    

                    }}
                >
          <TouchableOpacity
            style={styles.NextPrevBtn}
            onPress={() => setCurrentView("Basic Info")}
          >
            <Text style={styles.tabButtonText1}>
            <AntDesign name="left" size={20} color={Colors.white} />

            </Text>
          </TouchableOpacity>
          </LinearGradient>
          <LinearGradient
                    colors={Colors.linearColors}
                    start={Colors.start}
                    end={Colors.end}
                    locations={Colors.ButtonsLocation}
                    style={{
                      // padding: 5,
    borderRadius: 5,
    backgroundColor: Colors.primary,
    paddingHorizontal: "2%",
    paddingVertical: "1%",

    

                    }}
                >
          <TouchableOpacity
            style={styles.NextPrevBtn}
            onPress={() => handleAdditionalNext()}
          >
            <Text style={styles.tabButtonText1}>
            <AntDesign name="right" size={20} color="white" />

            </Text>
          </TouchableOpacity>
          </LinearGradient>
        </View>
      
      </View>
    );
  };

  const renderAdditionalDetails = () => {
    return (
      <View style={{ flex: 1 }}>
            <Text style={styles.tabButtonText}>Additional Info</Text>

        <ScrollView>
          <View style={{ flex: 1 }}>
        
                        <TextInput1
            mode="outlined"
            label="Product Weight"
            onSubmitEditing={() => Keyboard.dismiss()}
            theme={{ colors: { onSurfaceVariant: "black" } }}
            activeOutlineColor="#4b0482"
            // placeholder="Enter User Name"
            outlineColor="#B6B4B4"
            textColor="black"
            onChangeText={(text) => setWeight(text)}
            autoCapitalize="none"
            blurOnSubmit={false}
            value={weight}
            keyboardType="number-pad"
            returnKeyType="done"
            outlineStyle={{ borderRadius: ms(10) }}
            style={{ marginBottom: "2%", height: 50, backgroundColor: "white"  }}
          />
          </View>


          <TextInput1
            mode="outlined"
            label="Product Class"
            onSubmitEditing={() => Keyboard.dismiss()}
            theme={{ colors: { onSurfaceVariant: "black" } }}
            activeOutlineColor="#4b0482"
            // placeholder="Enter User Name"
            outlineColor="#B6B4B4"
            textColor="black"
            onChangeText={(text) => setClassC(text)}
            autoCapitalize="none"
            blurOnSubmit={false}
            value={classC}
            // keyboardType="number-pad"
            returnKeyType="done"
            outlineStyle={{ borderRadius: ms(10) }}
            style={{ marginBottom: "2%", height: 50, backgroundColor: "white"  }}
          />
          {/* <View style={{ flex: 1 }}>
       
                               <TextInput1
            mode="outlined"
            label="PTS"
            theme={{ colors: { onSurfaceVariant: "black" } }}
            activeOutlineColor="#4b0482"
            // placeholder="Enter User Name"
            outlineColor="#B6B4B4"
            textColor="black"
            onChangeText={(text) => setPts(text)}
            autoCapitalize="none"
            blurOnSubmit={false}
            value={pts}
            keyboardType="number-pad"
            returnKeyType="done"
            outlineStyle={{ borderRadius: ms(10) }}
            style={{ marginBottom: "2%", height: 50, backgroundColor: "white"  }}
          />
            

          </View> */}
        </ScrollView>
        <View style={styles.rowContainer}>
        <LinearGradient
                    colors={Colors.linearColors}
                    start={Colors.start}
                    end={Colors.end}
                    locations={Colors.ButtonsLocation}
                    style={{
                      borderRadius: 5,
    backgroundColor: Colors.primary,
    paddingHorizontal: "2%",
    paddingVertical: "1%",
    

                    }}
                >
          <TouchableOpacity
            style={styles.NextPrevBtn}
            onPress={() => setCurrentView("Price & Stock")}
          >
            <Text style={styles.tabButtonText1}>
            <AntDesign name="left" size={20} color={Colors.white} />

            </Text>
          </TouchableOpacity>
          </LinearGradient>
        </View>
        <LinearGradient
                    colors={Colors.linearColors}
                    start={Colors.start}
                    end={Colors.end}
                    locations={Colors.ButtonsLocation}
                    style={{
                      padding: 5,
    borderRadius: 5,
    // backgroundColor: Colors.primary,
    paddingHorizontal: "6%",
    

                    }}
                >
        <TouchableOpacity
          style={styles.button}
          onPress={item?.id ? () => handleEdit(item.id) : handleSubmit}
          activeOpacity={0.8}
        >
          {loading ? (<Wave size={30} color={"white"} />) : ( <Text style={styles.btnText}>Submit</Text>)}
         
        </TouchableOpacity>
        </LinearGradient>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.headercontainer}>
          <TouchableOpacity onPress={()=>handleBackPress()}>
            <AntDesign name="arrowleft" size={25} color={Colors.black} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Product</Text>
          <Text> </Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={
              currentView === "Basic Info"
                ? [styles.tabButton, styles.activeTabButton]
                : styles.tabButton
            }
            onPress={() =>
              setCurrentView("Basic Info") && styles.activeTabButton
            }
          >
            {/* <Text style={styles.tabButtonText}>Basic Info</Text> */}
          </TouchableOpacity>

          <TouchableOpacity
            style={
              currentView === "Price & Stock"
                ? [styles.tabButton, styles.activeTabButton]
                : styles.tabButton
            }
            onPress={() =>
              setCurrentView("Price & Stock") && styles.activeTabButton
            }
          >
            {/* <Text style={styles.tabButtonText}>Price & Stock</Text> */}
          </TouchableOpacity>

          <TouchableOpacity
            style={
              currentView === "Additional Details"
                ? [styles.tabButton, styles.activeTabButton]
                : styles.tabButton
            }
            onPress={() =>
              setCurrentView("Additional Details") && styles.activeTabButton
            }
          >
          </TouchableOpacity>
        </View>
        <Text style={styles.pageIndicator}>
        {currentView === "Basic Info" ? "Page 1 of 2" : currentView === "Price & Stock" ? "Page 2 of 3" : "Page 3 of 3"}
        {/* {currentView === "Basic Info" ? "Page 1 of 2" : "Page 2 of 2"} */}

      </Text>

        <View style={{ alignItems: "center", marginTop: 6 }}></View>

        {currentView === "Basic Info" && renderBasicInformation()}
        {currentView === "Price & Stock" && renderPricingAndInventory()}
        {currentView === "Additional Details" && renderAdditionalDetails()}
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={showSecondModal}
        onRequestClose={() => setShowSecondModal(false)}
      >
        <TouchableOpacity
          style={styles.modalContainer1}
          activeOpacity={1}
          onPress={() => setShowSecondModal(false)}
        >
          <View style={styles.modalContent1}>
            <TouchableOpacity
              onPress={() => setShowSecondModal(false)}
              style={styles.closeButton}
            >
              <AntDesign name="close" size={20} color={`black`} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={checkPermission}
              style={styles.submitButton}
            >
              <Text style={styles.submitButtonText}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleGallery}
              style={styles.submitButton}
            >
              <Text style={styles.submitButtonText}>Choose from Gallery</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: "4%",
    padding: 10,
    backgroundColor: "white",
    flex: 1,
  },
  textInput: {
    borderColor: "grey",
    borderWidth: 1,
    backgroundColor: "white",
    height: 40,
    marginBottom: "3%",
    padding: 5,
    paddingLeft: 8,
    borderRadius: 5,
    fontFamily: "AvenirNextCyr-Medium",
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2%",
  },
  halfTextInput: {
    flex: 1,
  },
  headercontainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "3%",
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "AvenirNextCyr-Medium",
    color: Colors.black,
    // marginLeft: 10,
    marginTop: 3,
  },
  button: {
    // height: "10%",
    justifyContent: 'center',
    alignItems: 'center',
    // borderRadius: 5,
    // backgroundColor: Colors.primary,
    // marginBottom: '3%',
    // marginTop: '3%',
    borderRadius: 50,
    width: '100%',
    padding:'2%'
  },
  btnText: {
    fontFamily: "AvenirNextCyr-Medium",
    color: "#fff",
    fontSize: 16,
  },
  buttonview: {
    flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop:'1%',
        marginBottom:'3%'
  },
  modalTitle: {
    fontSize: 16,
    color: "black",
    fontFamily: "AvenirNextCyr-Medium",
  },
  photosContainer: {
    height: 40,
    padding: 10,
    borderRadius: 10,
    // marginVertical: 10,
    // backgroundColor: Colors.primary,
    // marginRight: 10,
  },
  buttonText: {
    fontFamily: "AvenirNextCyr-Medium",
    color: "white",
  },
  label: {
    fontSize: 16,
    color: Colors.black,
    fontFamily: "AvenirNextCyr-Medium",
    //marginTop:5
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.7,
    borderRadius: 10,
    paddingHorizontal: 8,
    // marginVertical: '2%'
},
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
    fontFamily: "AvenirNextCyr-Medium",
    // color: "#50001D",
  },
  selectedTextStyle: {
    fontSize: 16,
    fontFamily: "AvenirNextCyr-Medium",
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
    fontFamily: "AvenirNextCyr-Medium",
    color: Colors.black,
    fontSize: 16,
  },
  inputContainer: {
    borderColor: "#b3b3b3",
    borderWidth: 1,
    backgroundColor: "white",
    height: 50,
    marginBottom: 15,
    fontFamily: "AvenirNextCyr-Medium",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 10,
    // height: "60%",
    width: "100%",
    // marginTop:'2%'
  },
  input2: {
    fontFamily: "AvenirNextCyr-Medium",
    padding: 8,
    flex: 1,
    fontSize:16
  },
  avatarImageContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    borderColor: "grey",
    borderWidth: 1,
    width: 80,
    height: 80,
    borderRadius: 50,
  },
  avatarImage: {
    width: 100,
    height: 80,
    borderRadius: 0,
    borderWidth: 1,
    borderColor: "grey",
    overflow: "hidden",
  },
  modalContainer1: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent1: {
    backgroundColor: "white",
    width: 300,
    borderRadius: 10,
    padding: 30,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 8,
    marginLeft: 15,
    marginRight: 15,
  },
  submitButton1: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    // marginTop: 2,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "AvenirNextCyr-Medium",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
  },
  customCategoryContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  textInputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
    // backgroundColor: "lightgray",
    paddingVertical: "2%",
    borderRadius: 5,
    height:0.5
  },
  tabButton: {
    paddingHorizontal: "2%",
    // paddingVertical: "2%",
    borderRadius: 5,
    fontSize: 10,
    backgroundColor: "lightgray",
    height:10,
    width:'30%'
  },
  tabButtonText: {
    color: "black",
    fontFamily: "AvenirNextCyr-Bold",
    fontSize:18,
    marginBottom:5
  },
  tabButtonText1: {
    color: "white",
    fontFamily: "AvenirNextCyr-Medium",
    paddingVertical:3
    // fontSize:18,
    // marginBottom:5
  },
  activeTabButton: {
    backgroundColor: Colors.primary,
    height:10,

    // paddingVertical: '2%',
    borderRadius: 5,
    // fontSize: 10,
    width:'35%'
  },
  NextPrevBtn: {
    // padding: 3,
    // borderRadius: 5,
    width:'100%'
  },
  pageIndicator: {
    // textAlign: 'flex-end',
    marginBottom: 1,
    fontSize: 14,
    fontFamily: "AvenirNextCyr-Medium",
    textAlign:'right',
    paddingRight:5
  },
  labelll: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 4,
    top: -10,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
    fontFamily: 'AvenirNextCyr-Medium',
    color: 'black'
},
});

export default MerchAddProduct;
