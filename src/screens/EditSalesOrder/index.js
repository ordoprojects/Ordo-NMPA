import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  Keyboard,
  TouchableOpacity,
  TextInput,
  Modal,
  Pressable,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ImageBackground,
} from "react-native";
import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useMemo,
  useRef,
} from "react";
import AntDesign from "react-native-vector-icons/AntDesign";
import Colors from "../../constants/Colors";
import { cameraPermission } from "../../utils/Helper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Entypo from "react-native-vector-icons/Entypo";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Searchbar, Checkbox, RadioButton , TextInput as TextInput1 } from "react-native-paper";
import { AuthContext } from "../../Context/AuthContext";
import globalStyles from "../../styles/globalStyles";
import LinearGradient from "react-native-linear-gradient";
import { Dimensions } from "react-native";
import { CameraScreen } from "react-native-camera-kit";
import { MaskedTextInput } from "react-native-mask-text";
import { LoadingView } from "../../components/LoadingView";
import { searchItem } from "../../utils/Search";
import { debounce } from "../../utils/Search";
import Toast from "react-native-simple-toast";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Dropdown } from "react-native-element-dropdown";
import { ms, hs, vs } from "../../utils/Metrics";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";

// Get the screen height
const screenHeight = Dimensions.get("window").height;
// Calculate the card height dynamically

const EditSalesOrder = ({ navigation, route }) => {
  const [itemPrices, setItemPrices] = useState({});
  const [cartCount, setCartCount] = useState(0);
  const [addedItems, setAddedItems] = useState([]);
  const [cartSearch, setCartSearch] = useState();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [expandedSubCategory, setExpandedSubCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [originalCategories, setOriginalCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [searching, setSearching] = useState(false);
  const [productSearch, setProductSearch] = useState("");
  const [productsBySubCategory, setProductsBySubCategory] = useState({});
  const [dropdownItems, setDropdownItems] = useState([]);
  const [modalVisibleOpen, setModalVisibleOpen] = useState(true);
  const [companyOptions, setCompanyOptions] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [filteredCompanies, setFilteredCompanies] = useState([]);

  const queryParams = useRef({ limit: 10, offset: 0 });
  const { ORDERID, editDetails, screen } = route?.params;
  const editProd = route.params?.cartData;
  const [selectedOption, setSelectedOption] = useState(editDetails?.transportation_type ? editDetails?.transportation_type : "Delivery");
  const [selectedOrderType, setSelectedOrderType] = useState(editDetails?.sales_type ? editDetails?.sales_type : "Project");
  const [inputTransportValue, setInputTransportValue] = useState(editDetails?.transportation_remarks);
  const [siteAddress, setSiteAddress] = useState(editDetails?.site_address);
  const [paymentTerms, setPaymentTerms] = useState(editDetails?.payment_term); 
  const [base64img, setBase64img] = useState(editDetails?.order_images);
  const input8Ref = useRef(null);
  const input9Ref = useRef(null);
  const input10Ref = useRef(null);

  useEffect(() => {
    const filtered = companyOptions.filter(company => 
      company.value === selectedCompany
    );
    setFilteredCompanies(filtered);
  }, [selectedCompany, companyOptions]);

  const handleSelect = (option) => {
    setSelectedOption(option);
  };

  const handleOrderTypeSelect = (option) => {
    setSelectedOrderType(option);
  };

  useEffect(()=>{
    getDropdownCompany();
  },[])

  const getDropdownCompany = async () => {
    setLoading(true);
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${userData.token}`);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `https://gsidev.ordosolution.com/api/company_list/`,
      requestOptions
    )
      .then((response) => response.json())
      .then(async (result) => {
        console.log("🚀 ~ .then ~ result:", result)
        
        if (result.error) {
        } else {
          setCompanyOptions(Array.isArray(result) ? result : []);
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  };


  useEffect(() => {
    const EditselectedCompany = companyOptions.find(
      company => company.value === editDetails.company
    );
    setSelectedCompany(EditselectedCompany?.value); 
  }, [companyOptions, editDetails.company]);


const handleCompanySelect = (value) => {
  setSelectedCompany(value.value);
};

 const handleSubmit = () => {
  if (selectedCompany) {
    // Perform any necessary actions with the selected company
    console.log('Selected Company:', selectedCompany);
    setModalVisibleOpen(false); // Close the modal after submission
  } else {
    // Optionally, show a warning if no company is selected
    Alert.alert('Warning', 'Please select a company before submitting.');
  }
};

useEffect(() => {
  // Trigger the modal as soon as the page loads
  setModalVisibleOpen(true);
}, []);

  useEffect(() => {
    if (editProd) {
      const ids = editProd.map((item) => item.product_id);
      setAddedItems(ids);
    }
  }, [editProd]);

  const screenid =
    route.params?.screenid !== undefined ? route.params.screenid : 0;

  useEffect(() => {
    // Initialize itemPrices with lower_price_cap if list_price is 0 or not set
    const initialPrices = {};
    cartData.forEach((item) => {
      if (!itemPrices[item.id] && item.list_price === 0) {
        initialPrices[item.id] = item.lower_price_cap;
      } else {
        initialPrices[item.id] = item.list_price;
      }
    });
    setItemPrices(initialPrices);
  }, [cartData]);

  const updatePrice = (itemId, newPrice) => {
    console.log("newPrice", newPrice);

    // Calculate the new price based on the quantity
    const adjustedPrice = newPrice || 0; // If newPrice is falsy, set it to 0
    console.log("cgrec", newPrice);

    // Update cartData with the new price for the particular itemId
    setCartData((prevData) =>
      prevData.map((item) =>
        item.id === itemId
          ? { ...item, list_price: adjustedPrice } // Ensure list_price is updated correctly
          : item
      )
    );

    // Update itemPrices state
    setItemPrices((prevPrices) => ({
      ...prevPrices,
      [itemId]: adjustedPrice,
    }));
  };

  // Calculate total price by summing up item prices
  useEffect(() => {
    const totalPrice = Object.values(itemPrices).reduce(
      (total, price) => total + parseFloat(price || 0),
      0
    );
    setTotalAmt(totalPrice.toFixed(2));
  }, [itemPrices, cartData]);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisiblePop, setModalVisiblePop] = useState(false);

  const handlePress = () => {
    setFilteredData(masterData);
    setModalVisible(true);
  };

  const [totalAmt, setTotalAmt] = useState(0);
  const [totalQty, setTotalQty] = useState(0);
  const [cartData, setCartData] = useState(editProd);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const error = cartData.some(
      (item) =>
        parseFloat(item?.list_price?.replace(/[^0-9.-]+/g, "")) <
        item.lower_price_cap
    );

    setHasError(error);
  }, [itemPrices, cartData]);

  const calOrderStat = (array) => {
    let tempTotalAmt = 0;
    let tempQty = 0;
    //calculating total price and total quantity
    array.forEach((item) => {
      let amt = Number(itemPrices[item?.id]) * Number(item?.qty);
      tempTotalAmt = tempTotalAmt + amt;
      tempQty = tempQty + Number(item?.qty);
    });
    setTotalAmt(tempTotalAmt);
    setTotalQty(tempQty);
  };

  const addProduct = (item) => {
    console.log("🚀 ~ addProduct ~ item:----------->", item)
    
    setCartData((prevCartData) => {
      const tempData = [...prevCartData];
      const existingItem = tempData.find((itm) => itm.id === item.id);

      if (existingItem) {
        existingItem.qty += 1;
        existingItem.isNew = false;
      } else {
        handleDropdownChange(item?.id ,item?.uom_list[0]?.value)
        handleRemarksChange(item?.id ,'')
        tempData.push({ ...item, qty: 1, tonnage: 1 ,total_weight: 0 ,isNew: true,});
        setCartCount((prevCount) => (prevCount || 0) + 1);
        item.added = true;
        setAddedItems((prevAddedItems) => [...prevAddedItems, item.id]);
      }

      calOrderStat(tempData);
      return tempData;
    });
  };

  const handleRemarksChange = (id, text) => {
    setCartData(prevCartData =>
      prevCartData.map(item =>
        item.id === id ? { ...item, product_remarks: text } : item
      )
    );
  };

  const handleDropdownChange = (id, loaded_uom) => {
    setCartData((prevCartData) => {
      const updatedCartData = prevCartData.map((item) => {
        if (item.id === id) {
          return { ...item, loaded_uom };
        }
        return item;
      });
      return updatedCartData;
    });
  };

  const calculateTotalWeight = (item) => {

    if (item?.loaded_uom === 'TONS') {
      return item?.qty * 1000;
    } else if (item.loaded_uom === 'KGS') {
      return item?.qty;
    } else if (item.loaded_uom === 'FT') {
      return (item?.qty * item?.weight);
    }else if (item.loaded_uom === 'MTONS') {
      return item?.qty * 0.907185 *1000 ;
    } else if (item.loaded_uom === 'BUNDLE' || item?.loaded_uom === 'PACKET') {
      return item?.qty * item?.bundle_piece * item?.weight;
    } else if (item.loaded_uom === 'NOS') {
      return item?.qty * item?.weight;
    } else if (item.loaded_uom === 'MTR') {
      return item?.thickness * item?.length * item.width * item?.qty;
    }
    return 0;
  };
  

  useEffect(() => {
    getDropdown();
  }, []);

  const getDropdown = async () => {
    setLoading(true);
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${userData.token}`);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(`https://gsidev.ordosolution.com/api/uom_list/`, requestOptions)
      .then((response) => response.json())
      .then(async (result) => {
        if (result.error) {
        } else {
          setDropdownItems(result || []);
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  useEffect(() => {
    setFilteredCartData(cartData);
  }, [cartData]);

  const deleteProduct = (item) => {
    // Find the index of the item in the cartData
    const index = cartData.findIndex((cartItem) => cartItem.id === item);

    if (index !== -1) {
      // If item exists in cartData
      let tempCart = [...cartData];
      tempCart.splice(index, 1);
      setCartData(tempCart);
      calOrderStat(tempCart);
    }

    // Filter out the item from addedItems
    const updatedAddedItems = addedItems.filter((itemId) => itemId !== item);
    setAddedItems(updatedAddedItems);
  };

  //Modal Hooks
  const [masterData, setMasterData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const { token, dealerData, userData, salesManager } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      var myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${userData.token}`);

      // var raw = "";
      var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      console.log("Request Headers: ", requestOptions);

      try {
        const productResponse = await fetch(
          "https://gsidev.ordosolution.com/api/product/",
          requestOptions
        );
        // console.log("responseeeee", productResponse);
        const productResult = await productResponse.json();
        // console.log("customer Data", productResult);
        setMasterData(productResult);
        setFilteredData(productResult);

        setLoading(false);
      } catch (error) {
        console.log("Error", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [userData]);

  const [filteredCartData, setFilteredCartData] = useState([]);

  useEffect(() => {
    // If there's a search query, filter the cartData
    // console.log(cartSearch);
    if (cartSearch) {
      const newData = cartData.filter(function (item) {
        const itemData = item.name
          ? item.name?.toUpperCase()
          : "".toUpperCase();
        const queryData = cartSearch.toUpperCase();
        return itemData.indexOf(queryData) > -1;
      });

      setFilteredCartData(newData);
    } else {
      setFilteredCartData(cartData);
    }
  }, [cartData, cartSearch]);

  const handleFilter = () => {
    if(paymentTerms){

    let productArray = cartData.map((item) => {
      // Remove the last two digits from the list_price
      const adjustedPrice = Math.floor(itemPrices[item.id] / 100) || 0;
      const total_weight = calculateTotalWeight(item);
      console.log("🚀 ~ productArray ~ total_weight:", total_weight)

      return {
        productid: item.id,
        qty: item.tonnage,
        list_price: adjustedPrice,
        total_weight,
      };
    });
    // console.log("check price and quantity", productArray);
    setModalVisiblePop(false);
    navigation.navigate("EditAdminOrderReview", {
      productsArray: productArray,
      dealerInfo: dealerData,
      cartData: cartData.map(item => ({
        ...item,
        total_weight: calculateTotalWeight(item),
      })),
      total: totalAmt,
      screenid: screenid,
      transportationType: selectedOption,
      salesType: selectedOrderType,
      transportationRemarks: inputTransportValue,
      screenName: "Edit",
      ORDERID: ORDERID,
      editDetails: editDetails,
      company:filteredCompanies,
      siteAddress:siteAddress,
      image:base64img,
      paymentTerms:paymentTerms,      
    });
      }else{
      Alert.alert(
            "Warning",
            `Please enter payment terms`
          );
  }
  };


  const orderItems = async () => {
    if (cartData.length > 0) {
      // Check if all items have a price
      for (let item of cartData) {
        if (!itemPrices[item.id]) {
          Alert.alert(
            "Warning",
            `Please enter a price for the item: ${item.name}`
          );
          return; // Exit the function to prevent navigation
        }

        console.log("cjhdskchkds", item.qty);
        if (
          item.qty === undefined ||
          item.qty === "" ||
          isNaN(item.qty) ||
          item.qty === 0 ||
          item.qty === "0"
        ) {
          Alert.alert(
            "Warning",
            `Please enter a valid quantity(tons) for the item: ${item.name}`
          );
          return; // Exit the function to prevent navigation
        }
      }
      setModalVisiblePop(true);
    } else {
      Alert.alert("Sorry, no products to order");
    }
  };

  const handleProductPress = (item, itemAdded) => {
    if (item.stock > 0) {
      if (itemAdded) {
        setAddedItems((prev) => prev.filter((id) => id !== item.id));
        deleteProduct(item.id);
      } else {
        setAddedItems((prev) => [...prev, item.id]);
        addProduct(item);
      }
    } else {
      if (itemAdded) {
        setAddedItems((prev) => prev.filter((id) => id !== item.id));
        deleteProduct(item.id);
      } else {
        setAddedItems((prev) => [...prev, item.id]);
        addProduct(item);
      }
    }
  };

  const handleInputChange = (productId, inputValue) => {
    console.log("Product ID and Input Value:", productId, inputValue);

    // Find the index of the product in cartData, checking for product_id first and falling back to id
    const index = cartData.findIndex(
      (item) => item.product_id === productId || item.id === productId
    );
    console.log("Index found:", index);

    if (index !== -1) {
      // Update the qty field of the product
      const updatedItem = {
        ...cartData[index],
        qty: inputValue,
        tonnage: inputValue,
      };
      // Update cartData with the updated item
      const updatedData = [...cartData];
      updatedData[index] = updatedItem;
      setCartData(updatedData);
    }
  };

  const [openScanner, setOpenScanner] = useState(false);
  const [cameraPermissionGranted, setCameraPermissionGranted] = useState(false);
  const searchbarRef = useRef(null);

  const handleBarcodeChange = (text) => {
    if (text.endsWith("<")) {
      const scannedBarcode = text.replace("<", "").trim();
      console.log(scannedBarcode);
      onBarcodeScan1(scannedBarcode);
    }
  };

  const increaseProductQuantity = (productId) => {
    const index = cartData.findIndex((item) => item.id === productId);
    if (index !== -1) {
      const updatedItem = {
        ...cartData[index],
        tonnage: (parseFloat(cartData[index].tonnage) + 1).toString(),
      };
      const updatedData = [...cartData];
      updatedData[index] = updatedItem;
      setCartData(updatedData);
    }
  };

  const fetchProductData = async (productId) => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${userData.token}`);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    console.log("Request Headers: ", requestOptions);

    try {
      const response = await fetch(
        `https://gsidev.ordosolution.com/api/test_product/?limit=20&offset=0&search_name=${productId}`,
        requestOptions
      );
      const data = await response.json();
      if (data && data.products && data.products.length > 0) {
        return data.products[0]; // Assuming the product data is in the first result
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error fetching product data:", error);
      return null;
    }
  };

  // Device
  const onBarcodeScan1 = async (qrvalue) => {
    const barcodeData = qrvalue;
    const matchedProduct = await fetchProductData(barcodeData);

    if (matchedProduct) {
      if (matchedProduct.stock > 0) {
        if (!addedItems.includes(matchedProduct.id)) {
          addProduct(matchedProduct);
        } else {
          increaseProductQuantity(matchedProduct.id);
        }
        setCartSearch("");
      } else {
        setCartSearch("");
        Toast.show("Product out of stock.", Toast.SHORT);
      }
    } else {
      setCartSearch("");
      Toast.show("No product found.", Toast.SHORT);
    }
  };

  // Mobile
  const onBarcodeScan = async (qrvalue) => {

    const barcodeData = qrvalue;
    const matchedProduct = await fetchProductData(barcodeData);

    if (matchedProduct) {
      if (!addedItems.includes(matchedProduct.id)) {
        addProduct(matchedProduct);
        toggleBarcodeScanner();
      } else {
        Toast.show("Product is already added.", Toast.SHORT);
        toggleBarcodeScanner();
      }
    } else {
      toggleBarcodeScanner();
      Toast.show("No product found.", Toast.SHORT);
    }
  };

   const checkPermission = async () => {
    let PermissionDenied = await cameraPermission();
    if (PermissionDenied) {
   
      console.log("camera permssion granted");
      handleCamera();
    } else {
      console.log("camera permssion denied");
      Alert.alert(
        'Camera Permission Required',
        'This app needs access to your camera. Please enable camera permission in your device settings.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleCamera = async () => {
    const res = await launchCamera({
      mediaType: "photo",
    });
    if (res.assets && res.assets[0]) {
      setBase64img((prev) => [...prev, res.assets[0].uri]); // Add new image URI to the array
      console.log("image URI from camera", res.assets[0].uri);
    }
  };
  
  // Function to handle gallery selection
  const handleGallery = async () => {
    const res = await launchImageLibrary({
      mediaType: "photo",
    });
    if (res.assets && res.assets[0]) {
      setBase64img((prev) => [...prev, res.assets[0].uri]); // Add new image URI to the array
      console.log("image URI from gallery", res.assets[0].uri);
    }
  };
  

  const handleCameraPermission = async () => {
    const granted = await cameraPermission();
    if (!granted) {
      Alert.alert(
        "Camera Permission Required",
        "This app needs access to your camera to scan barcodes. Please enable camera permission in your device settings.",
        [{ text: "OK" }]
      );
    }
    setCameraPermissionGranted(granted);
  };

  const toggleBarcodeScanner = async () => {
    if (!cameraPermissionGranted) {
      await handleCameraPermission();
    }
    if (cameraPermissionGranted) {
      setOpenScanner(!openScanner);
    }
  };

  useEffect(() => {
    if (openScanner && cameraPermissionGranted) {
      setTimeout(() => {
        setOpenScanner(true);
      }, 100);
    }
  }, [openScanner, cameraPermissionGranted]);

  const loadAllCategory = async (limit, offset) => {
    setLoading(true);
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${userData.token}`);
    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    try {
      const response = await fetch(
        `https://gsidev.ordosolution.com/api/product_categories/?limit=${limit}&offset=${offset}`,
        requestOptions
      );

      // Check if the response is OK and log it
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log(result); // Log the result

      if (offset === 0) {
        setCategories(result);
        setOriginalCategories(result); // Store the original categories
      } else {
        setCategories((prevData) => [...prevData, ...result]);
        setOriginalCategories((prevData) => [...prevData, ...result]); // Update original categories
      }

      setLoading(false);
    } catch (error) {
      console.log("Error", error);
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadAllCategory(queryParams.current.limit, queryParams.current.offset);
  }, []);

  // Function to filter categories based on search input
  const filterCategories = (val) => {
    const filtered = originalCategories.filter((category) =>
      category?.name?.toLowerCase().includes(val.toLowerCase())
    );
    setCategories(filtered);
  };

  const handleCategorySearch = (val) => {
    setSearch(val);
    filterCategories(val);
  };

  useEffect(() => {
    loadAllCategory(queryParams.current.limit, queryParams.current.offset);
  }, [userData]);

  const handleModalClose = () => {
    setModalVisible(false);
    // loadAllCategory();
  };

  const handleCategorySelect = async (categoryId) => {
    console.log("bvbn", categoryId);
    setSearch("");
    setProductSearch("");
    setSelectedCategory(categoryId);
    await loadSubCategories(categoryId);
  };

  const loadSubCategories = async (categoryId) => {
    setLoading(true);
    const response = await fetch(
      `https://gsidev.ordosolution.com/api/product_categories/?limit=10&offset=0&cate_id=${categoryId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData.token}`,
        },
      }
    );
    const result = await response.json();
    setSubCategories(result);
    setLoading(false);
  };

  const handleSubCategorySelect = async (subCategoryId) => {
    setExpandedSubCategory(subCategoryId);
    await loadProducts(selectedCategory, subCategoryId);
  };

  const loadProducts = async (categoryId, subCategoryId) => {
    setLoading(true);
    const response = await fetch(
      `https://gsidev.ordosolution.com/api/test_product/?limit=10&offset=0&cate_id=${categoryId}&sub_cate_id=${subCategoryId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData.token}`,
        },
      }
    );
    const result = await response.json();
    setProducts(result.products);
    // Update productsBySubCategory based on fetched products
    const updatedProductsBySubCategory = {};
    result.products.forEach((product) => {
      const subcategoryId = product.sub_category_id.id;
      if (!updatedProductsBySubCategory[subcategoryId]) {
        updatedProductsBySubCategory[subcategoryId] = [];
      }
      updatedProductsBySubCategory[subcategoryId].push(product);
    });

    setProductsBySubCategory(updatedProductsBySubCategory);
    setLoading(false);
  };

  const handleSearch = async (val) => {
    const baseUrl =
      "https://gsidev.ordosolution.com/api/test_product/?limit=5&offset=0";
    setSearching(true);
    const result = await searchItem(baseUrl, val, userData.token);
    setSearching(false);

    if (result) {
      const updatedProductsBySubCategory = {};

      result.products.forEach((product) => {
        const subcategoryId = product.sub_category_id.id;
        if (!updatedProductsBySubCategory[subcategoryId]) {
          updatedProductsBySubCategory[subcategoryId] = [];
        }
        updatedProductsBySubCategory[subcategoryId].push(product);
      });

      setProductsBySubCategory(updatedProductsBySubCategory);
    }
  };

  const debouncedSearch = useCallback(debounce(handleSearch, 500), [
    userData.token,
  ]);

  useEffect(() => {
    if (search.trim()) {
      debouncedSearch(search);
      console.log("!3");
    } else {
      if (expandedSubCategory) {
        loadProducts(selectedCategory, expandedSubCategory);
      }
    }
  }, [search, expandedSubCategory]);

  const handleProductSearch = (val) => {
    setProductSearch(val);
    debouncedProductSearch(val);
  };

  // Clear search function
  const handleSearchClear = () => {
    if (expandedSubCategory) {
      console.log("pressed");
      setProductSearch("");
      loadProducts(selectedCategory, expandedSubCategory);
    } else {
      setSearch("");
      setCategories(originalCategories);
    }
  };

  // Define debounced product search function
  const debouncedProductSearch = useCallback(
    debounce(async (val) => {
      const baseUrl = `https://gsidev.ordosolution.com/api/product_categories/?limit=10&offset=0&cate_id=${selectedCategory}&search=${val}`;
      setSearching(true);
      const result = await searchItem(baseUrl, val, userData.token);
      setSearching(false);

      if (result) {
        console.log("result", result);
        setSubCategories(result);
      }
    }, 500),
    [userData.token, selectedCategory]
  );

  const handleBackToCategory = () => {
    setSelectedCategory(null);
    setSearch("");
    setProductSearch("");
    setCategories(originalCategories);
    loadSubCategories(selectedCategory);
    loadProducts(selectedCategory, expandedSubCategory); 
  };

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      key={item.id}
      style={styles.categoryItem}
      onPress={() => handleCategorySelect(item.id)}
    >
      {item.category_image ? (
        <Image
          source={{ uri: item.category_image }} 
          style={styles.categoryImage}
        />
      ) : (
        <Image
          source={require("../../assets/images/noImagee.png")}
          style={styles.categoryImage}
        />
      )}
      <Text style={styles.categoryTitle}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderSubCategoryItem = ({ item }) => {
    const subcategoryId = item.id;
    const productsForSubCategory = productsBySubCategory[subcategoryId] || [];

    return (
      <View key={subcategoryId} style={styles.subCategoryContainer}>
        <TouchableOpacity
          style={styles.subCategoryHeader}
          onPress={() =>
            setExpandedSubCategory(
              expandedSubCategory === subcategoryId ? null : subcategoryId
            )
          }
        >
          <Text style={styles.subCategoryTitle}>{item.name}</Text>
          <Entypo
            name={
              expandedSubCategory === subcategoryId
                ? "chevron-up"
                : "chevron-down"
            }
            size={20}
            color='black'
          />
        </TouchableOpacity>
        {expandedSubCategory === subcategoryId && (
          <View style={styles.productsContainer}>
            <FlatList
              data={productsForSubCategory}
              renderItem={renderProductItem}
              contentContainerStyle={{ paddingBottom: "20%" }}
              keyExtractor={(item) => item.id.toString()}
              onEndReachedThreshold={0.5}
              onEndReached={() =>
                onEndReached(selectedCategory, expandedSubCategory)
              }
              ListEmptyComponent={
                <Text style={styles.noDataText}>No Data Available</Text>
              }
            />
          </View>
        )}
      </View>
    );
  };

  const renderProductItem = useCallback(
    ({ item }) => {
      const itemAdded = addedItems.includes(item.id);
      return (
        <View
          style={{
            backgroundColor: itemAdded ? Colors.primary : "#f2f2f2",
            marginHorizontal: "1%",
            marginTop: 5,
            marginBottom: 8,
            elevation: 5,
            borderTopLeftRadius: 20,
            borderBottomRightRadius: 20,
          }}
        >
          <Pressable style={{ padding: 10 }}>
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
              <View
                style={{
                  backgroundColor: "white",
                  elevation: 5,
                  borderRadius: 10,
                  padding: "1%",
                }}
              >
                {item.product_image && item.product_image.length > 0 ? (
                  <Image
                    source={{ uri: item.product_image[0] }}
                    style={styles.imageView}
                  />
                ) : (
                  <Image
                    source={require("../../assets/images/noImagee.png")}
                    style={styles.imageView}
                  />
                )}
              </View>
              <View style={{ flex: 1, paddingLeft: 15, marginLeft: 10 }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      color: itemAdded ? "white" : Colors.primary,
                      fontSize: 12,
                      fontFamily: "AvenirNextCyr-Bold",
                      marginTop: 1,
                      width: "70%",
                    }}
                  >
                    {item.name}
                  </Text>
                  <Text
                    style={{
                      color: itemAdded ? "white" : Colors.primary,
                      fontSize: 12,
                      fontFamily: "AvenirNextCyr-Medium",
                      marginTop: 1,
                      width: "30%",
                      textAlign: "right",
                    }}
                  >
                                             {item?.product_price ? 
         new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(item?.product_price) : 
         new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(0)
       }

                  </Text>
                </View>
                <Text
                  style={{
                    color: itemAdded ? "white" : "gray",
                    fontSize: 12,
                    fontFamily: "AvenirNextCyr-Medium",
                    marginTop: 1,
                  }}
                >
                  {item?.brand?.brand_name}
                </Text>
                <Text
                  style={{
                    color: itemAdded ? "white" : "gray",
                    fontSize: 12,
                    fontFamily: "AvenirNextCyr-Medium",
                  }}
                >
                  UOM : {item.unit_of_measure}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                         {userData?.user_type !== "Admin" ? (

                          <View>
                            <Text
                            style={{
                              color: item.stock <= 0  ? "tomato" : "#15b315",
                              fontSize: 12.5,
                              fontFamily: "AvenirNextCyr-Bold",
                              marginTop: "0%",
                            }}
                          >
                          {item?.stock <= 0  ? "Low Stock" : "Stock Available"}
                          </Text>
                          </View>
                          ) : (

                            <View>
                            <Text
                            style={{
                              color: itemAdded ? "white" : "gray",
                              fontSize: 12.5,
                              fontFamily: "AvenirNextCyr-Medium",
                              marginTop: "0%",
                            }}
                          >
                          Stock: {item?.stock}
                          </Text>
                          </View>

                          )}
                </View>
              </View>
            </View>
          </Pressable>
          <View
            style={{
              width: "100%",
              justifyContent: "flex-end",
              flexDirection: "row",
              position: "absolute",
              bottom: 0,
            }}
          >
 <TouchableOpacity
          style={{
            width: "29%",
            height: 37,
            borderBottomRightRadius: 20,
            backgroundColor: itemAdded
              ? "#f2f2f2"
             
              : Colors.primary,
            elevation: 5,
            borderTopLeftRadius: 10,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 1,
          }}
        onPress={() => handleProductPress(item, itemAdded)}
        >
          <MaterialCommunityIcons
            name="cart-variant"
            size={18}
            color={itemAdded ? "#50001D" : "white"}
          />
          <Text
            style={{
              color: itemAdded ? "#50001D" : "white",
              fontSize: 12,
              fontFamily: "AvenirNextCyr-Demi",
            }}
          >
            {itemAdded ? "Remove cart" : "Add to cart"}
          </Text>
        </TouchableOpacity>
          </View>
        </View>
      );
    },
    [addedItems]
  );

  const onEndReached = (categoryId, subCategoryId) => {
    if (search.trim()) {
      return;
    }
    if (!loading) {
      queryParams.current.offset += queryParams.current.limit;
      setLoading(true);

      if (selectedCategory) {
        loadProducts(categoryId, subCategoryId);
      } else {
        loadAllCategory(queryParams.current.limit, queryParams.current.offset);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <LinearGradient
        colors={Colors.linearColors}
        start={Colors.start}
        end={Colors.end}
        locations={Colors.location}
        style={{
          backgroundColor: Colors.primary,
          borderColor: Colors.primary,
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
            height: "10%",
            alignItems: "center",
            alignContent: "center",
            textAlign: "center",
            paddingHorizontal: "4%",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Image
              source={require("../../assets/images/Refund_back.png")}
              style={{ height: 40, width: 40, resizeMode: "contain" }}
            />
          </TouchableOpacity>
          <Text
            style={{
              fontFamily: "AvenirNextCyr-Bold",
              fontSize: 19,
              marginLeft: 8,
              color: "white",
            }}
          >
            My Carts
          </Text>

          <TouchableOpacity onPress={toggleBarcodeScanner}>
            <MaterialCommunityIcons
              name="barcode-scan"
              size={29}
              color={"white"}
            />
          </TouchableOpacity>
        </View>

        <View
          style={{
            backgroundColor: "#F3F5F9",
            width: "100%",
            borderTopEndRadius: 20,
            borderTopStartRadius: 20,
            paddingVertical: 10,
            paddingHorizontal: 20,
            flex: 1,
          }}
        >
          <ScrollView>
            {/* {cartData.length > 0 && ( */}
            <>
              <View
                style={{
                  gap: 10,
                  flexDirection: "row",
                  paddingVertical: "2%",
                  paddingHorizontal: "1%",
                  alignItems: "center",
                }}
              >
                <Searchbar
                  style={{
                    flex: 1,
                    backgroundColor: "white",
                    borderRadius: 7,
                    fontFamily: "AvenirNextCyr-Medium",
                    height: 50,
                  }}
                  ref={searchbarRef}
                  inputStyle={{ minHeight: 0 }}
                  placeholder="Search Product"
                  onChangeText={(val) => {
                    setCartSearch(val);
                    handleBarcodeChange(val);
                  }}
                  onSubmitEditing={() => Keyboard.dismiss()}
                  value={cartSearch}
                />
                <TouchableOpacity
                  style={{
                    paddingVertical: 14,
                    paddingHorizontal: "7%",
                    borderRadius: 5,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "white",
                  }}
                  onPress={handlePress}
                >
                  <Text
                    style={{
                      color: Colors.primary,
                      fontFamily: "AvenirNextCyr-Medium",
                    }}
                  >
                    Add
                  </Text>
                </TouchableOpacity>
              </View>
            </>

            <Modal
              visible={modalVisible}
              onRequestClose={handleModalClose}
              animationType="slide"
              transparent
            >
              <SafeAreaView style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <View style={styles.modalHeader}>
                    {selectedCategory ? (
                      <TouchableOpacity onPress={handleBackToCategory}>
                        <Ionicons name="arrow-back" size={24} color="grey" />
                      </TouchableOpacity>
                    ) : (
                      <Text> </Text>
                    )}

                    <Text style={styles.modalTitle}>Add Products</Text>
                    <TouchableOpacity
                      style={{
                        marginRight: 10,
                        backgroundColor: "#F1F1F1",
                        paddingVertical: 5,
                        paddingHorizontal: 5,
                        borderRadius: 30,
                      }}
                      onPress={handleModalClose}
                    >
                      <Entypo name="cross" size={16} color="grey" />
                    </TouchableOpacity>
                  </View>

                  {selectedCategory ? (
                    <>
                      {expandedSubCategory ? (
                        <Searchbar
                          placeholder="Search Products"
                          onChangeText={(val) => setSearch(val)}
                          value={search}
                          loading={searching}
                          onIconPress={handleSearchClear}
                        />
                      ) : (
                        <Searchbar
                          placeholder="Search Subcategory Products"
                          onChangeText={handleProductSearch}
                          value={productSearch}
                          loading={searching}
                          onIconPress={handleSearchClear}
                        />
                      )}
                    </>
                  ) : (
                    <Searchbar
                      placeholder="Search Categories"
                      onChangeText={handleCategorySearch}
                      value={search}
                      loading={searching}
                      onIconPress={handleSearchClear}
                    />
                  )}

                  {selectedCategory ? (
                    <FlatList
                      data={subCategories}
                      renderItem={renderSubCategoryItem}
                      keyExtractor={(item) => item.id.toString()}
                      ListEmptyComponent={
                        <Text style={styles.noDataText}>
                          No Subcategories Available
                        </Text>
                      }
                    />
                  ) : (
                    <FlatList
                      data={categories}
                      renderItem={renderCategoryItem}
                      keyExtractor={(item) => item.id.toString()}
                      numColumns={2}
                      key={"_"}
                      columnWrapperStyle={{ justifyContent: "space-around" }}
                      onEndReached={onEndReached}
                      onEndReachedThreshold={0.5}
                      ListEmptyComponent={
                        <Text style={styles.noDataText}>
                          No Categories Available
                        </Text>
                      }
                    />
                  )}
                </View>
              </SafeAreaView>
            </Modal>

            {filteredCartData.length === 0 ? (
              <View style={{ flex: 1, justifyContent: "center" }}>
                 <Image
                  source={require("../../assets/images/CartEmpty1.png")}
                  style={{
                    resizeMode: "contain",
                    marginTop: "20%",
                    alignSelf: 'center',
                    width:'100%',
                    height:300
                  }}
                />
                <View style={{ marginTop: "5%" }}>
                  <Text
                    style={{
                      textAlign: "center",
                      fontFamily: "AvenirNextCyr-Medium",
                      fontSize: 23,
                      color: "#571A9B",  marginBottom:'2%'
                    }}
                  >
                    Your Cart is Empty
                  </Text>
                  <Text
                    style={{
                      textAlign: "center",
                      fontFamily: "AvenirNextCyr-Medium",
                      fontSize: 14,
                      color: "#7A4AB0",
                    }}
                  >
                    Looks like you haven’t added {"\n"} anything to your cart
                    yet{" "}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      marginTop: "4%",
                    }}
                  >
                    <LinearGradient
                      colors={Colors.linearColors}
                      start={Colors.start}
                      end={Colors.end}
                      locations={Colors.ButtonsLocation}
                      style={{ borderRadius: 30 }}
                    >
                      <TouchableOpacity
                        style={{
                          paddingHorizontal: "5%",
                          flexDirection: "row",
                          alignItems: "center",
                          borderRadius: 30,
                          justifyContent: "center",
                          paddingVertical: "1%",
                          // backgroundColor:'red'
                        }}
                        onPress={handlePress}
                      >
                        <MaterialCommunityIcons
                          style={{
                            color: "white",
                            fontFamily: "AvenirNextCyr-Medium",
                          }}
                          name="cart-variant"
                          size={30}
                          color="black"
                        />
                        <Text
                          style={{
                            fontFamily: "AvenirNextCyr-Medium",
                            color: "white",
                            fontSize: 18,
                          }}
                        >
                          Add
                        </Text>
                      </TouchableOpacity>
                    </LinearGradient>
                  </View>
                </View>
              </View>
            ) : (
              <FlatList
                showsVerticalScrollIndicator={false}
                data={filteredCartData}
                keyboardShouldPersistTaps="handled"
                renderItem={({ item, index }) => (
                  <View
                    style={{
                      backgroundColor: "white",
                      marginTop: 5,
                      marginBottom: 5,
                      elevation: 5,
                      ...globalStyles.border,
                      borderRadius: 5,
                      flex: 1,
                    }}
                  >
                    <Pressable style={{ padding: 10 }}>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "center",
                        }}
                      >
                        <View
                          style={{
                            backgroundColor: "white",
                            // elevation: 5,
                            ...globalStyles.border,
                            borderRadius: 5,
                            padding: "1%",
                          }}
                        >
                          {item.product_image &&
                          item.product_image.length > 0 ? (
                            <Image
                              source={{ uri: item.product_image[0] }} // Use the first image
                              style={styles.imageView}
                            />
                          ) : (
                            <Image
                              source={require("../../assets/images/noImagee.png")} // Use default image
                              style={styles.imageView}
                            />
                          )}
                        </View>

                        <View
                          style={{
                            flex: 1,
                            paddingLeft: 15,
                            marginLeft: 10,
                          }}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "space-between",
                              marginBottom: 2,
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 14,
                                color: Colors.primary,
                                fontFamily: "AvenirNextCyr-Bold",
                                width: "90%",
                              }}
                            >
                              {item.name}
                            </Text>
                            <TouchableOpacity
                              onPress={() => deleteProduct(item.id)}
                            >
                              <AntDesign
                                name="delete"
                                size={20}
                                color={"tomato"}
                              />
                            </TouchableOpacity>
                          </View>

                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "space-between",
                              marginBottom: 2,
                            }}
                          >

                            {userData?.user_type !== "Admin" ? (
                              <View>
                                <Text
                                  style={{
                                    color: item.stock <= 0 ? "tomato" : "green",
                                    fontSize: 12.5,
                                    fontFamily: "AvenirNextCyr-Bold",
                                    marginTop: "0%",
                                  }}
                                >
                                  {item?.stock <= 0
                                    ? "Low Stock"
                                    : "Stock Available"}
                                </Text>
                              </View>
                            ) : (
                              <View>
                                <Text
                                  style={{
                                    color: "black",
                                    fontSize: 12.5,
                                    fontFamily: "AvenirNextCyr-Medium",
                                    marginTop: "0%",
                                  }}
                                >
                                  Stock: {item?.stock}
                                </Text>
                              </View>
                            )}
                            <Text
                              style={{
                                color: "black",
                                fontSize: 12,
                                fontFamily: "AvenirNextCyr-Medium",
                                marginTop: "2%",
                                width: "50%",
                                textAlign: "right",
                              }}
                            >
                              Cap Price : {item.lower_price_cap}
                            </Text>
                          </View>

                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                              alignItems: "center",
                              marginVertical: "1%",
                            }}
                          ></View>
                        </View>
                      </View>

                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 10,
                          justifyContent: "space-between",
                        }}
                      >
                        <View
                          style={{
                            paddingHorizontal: 10,
                            borderColor: "#cccccc",
                            borderWidth: 1,
                            height: 30,
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <MaskedTextInput
                            type="currency"
                            options={{
                              prefix: "₹ ",
                              decimalSeparator: ".",
                              groupSeparator: ",",
                              precision: 2,
                            }}
                            onChangeText={(text, rawText) => {
                              console.log(text);
                              console.log(rawText);
                              updatePrice(item.id, text);
                            }}
                            value={
                              item.product_price
                                ? (item.product_price * 100).toString()
                                : (item.price * 100).toString()
                            }
                            style={{ height: 40,color: 'black' }}
                            keyboardType="numeric"
                          />
                        </View>

                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 10,
                            justifyContent: "space-between",
                          }}
                        >
                          <TextInput
                            style={{
                              fontSize: 14,
                              borderWidth: 1,
                              borderColor: "black",
                              fontFamily: "AvenirNextCyr-Medium",
                              width: 45,
                              textAlign: "center",
                              height: 28,
                              padding: 1,
                              color: "black",
                            }}
                            onChangeText={(text) =>
                              handleInputChange(item.id, text)
                            }
                            value={
                              item.qty !== undefined && item.qty !== ""
                                ? item.qty.toString()
                                : item.tonnage !== undefined &&
                                  item.tonnage !== ""
                                ? item.tonnage.toString()
                                : " "
                            }
                            keyboardType="decimal-pad"
                            returnKeyType="done"
                            onBlur={() => {
                              if (!item.qty || item.qty === "") {
                                handleInputChange(item.id, "1");
                              }
                            }}
                            onSubmitEditing={() => Keyboard.dismiss()}
                          />

                          <Dropdown
                            style={{
                              height: 30,
                              backgroundColor: "white",
                              marginVertical: 5,
                              borderWidth: 0.5,
                              borderColor: "gray",
                              paddingLeft: 3,
                              width: 80,
                            }}
                            placeholderStyle={{ fontSize: 13, color: "#888" }}
                            selectedTextStyle={{ fontSize: 13 ,color:'black'}}
                            inputSearchStyle={{ height: 30, fontSize: 13 ,color:'black'}}
                            containerStyle={{ marginVertical: 5 }}
                            data={item?.uom_list}
                            search
                            itemTextStyle={{ fontSize: 11,color:'black'}}
                            maxHeight={400}
                            labelField="label"
                            valueField="value"
                            placeholder="UOM"
                            value={ screen === 'edit' ? item?.loaded_uom :item.customUOM}
                            onChange={(selectedItem) =>
                              handleDropdownChange(item.id, selectedItem.value)
                            }
                          />
                        </View>
                      </View>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: '#cccccc',
              borderRadius: 5,
              padding: 5,
              marginTop: 5,
              marginBottom: 5,
              fontFamily: 'AvenirNextCyr-Medium',
              fontSize: 14,
              color:'black'
            }}
            placeholder="Enter remarks..."
            placeholderTextColor={'gray'}
            onChangeText={(text) => handleRemarksChange(item.id, text)}
            value={item.product_remarks || ''}
          />

                      {parseFloat(item?.list_price?.replace(/[^0-9.-]+/g, "")) <
                        item.lower_price_cap &&
                        !salesManager && (
                          <View
                            style={{
                              justifyContent: "space-between",
                              flexDirection: "row",
                              alignItems: "center",
                              marginTop: "1%",
                            }}
                          >
                            <Text
                              style={{
                                fontFamily: "AvenirNextCyr-Medium",
                                color: "tomato",
                              }}
                            >
                              {screenid === 2
                                ? "Entered price cannot be lower than the minimum allowed price."
                                : "Entered price is lower than the minimum allowed price. It will be sent for manager approval."}
                            </Text>
                          </View>
                        )}
                    </Pressable>
                  </View>
                )}
                keyExtractor={(item) => item.id.toString()}
              />
            )}
          </ScrollView>

          {cartData.length > 0 &&
            screenid === 2 &&
            (!hasError || salesManager) && (
              <LinearGradient
                colors={Colors.linearColors}
                start={Colors.start}
                end={Colors.end}
                locations={Colors.ButtonsLocation}
                style={{
                  backgroundColor: Colors.primary,
                  borderColor: Colors.primary,
                  borderRadius: 50,
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                  paddingVertical: "4%",
                  marginTop: "3%",
                }}
              >
                <TouchableOpacity
                  style={styles.button}
                  onPress={orderItems}
                  activeOpacity={0.8}
                >
                  <Text style={styles.btnText}>
                    {" "}
                    {screenid == 2 ? "Send Quotation" : "Check Out"}
                  </Text>
                </TouchableOpacity>
              </LinearGradient>
            )}

          {cartData.length > 0 && filteredCartData.length !== 0 && (
            <LinearGradient
              colors={Colors.linearColors}
              start={Colors.start}
              end={Colors.end}
              locations={Colors.ButtonsLocation}
              style={{
                backgroundColor: Colors.primary,
                borderColor: Colors.primary,
                borderRadius: 50,
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
                paddingVertical: "4%",
                marginTop: "3%",
              }}
            >
              <TouchableOpacity
                style={styles.button}
                onPress={orderItems}
                activeOpacity={0.8}
              >
                <Text style={styles.btnText}> {"Check Out"}</Text>
              </TouchableOpacity>
            </LinearGradient>
          )}
        </View>

        {/* Barcode scanner modal */}
        <Modal visible={openScanner} animationType="slide" transparent={true}>
          <View style={{ flex: 1, backgroundColor: "black" }}>
            {openScanner && cameraPermissionGranted && (
              <CameraScreen
                showFrame
                scanBarcode
                laserColor={"blue"}
                frameColor={"yellow"}
                onReadCode={(event) =>
                  onBarcodeScan(event.nativeEvent.codeStringValue)
                }
              />
            )}
            {/* Add any UI elements you want to display along with the barcode scanner */}
            <TouchableOpacity
              onPress={toggleBarcodeScanner}
              style={{
                backgroundColor: "white",
                width: 200,
                height: 50,
                alignItems: "center",
                justifyContent: "center",
                alignSelf: "center",
                marginBottom: "15%",
                borderRadius: 12,
              }}
            >
              <Text style={{ color: "black", fontSize: 16, fontWeight: "500" }}>
                Close Barcode Scanner
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>

    {/* ************** transportaion type ***************** */}
        <Modal visible={modalVisiblePop} transparent={true}
        onRequestClose={() => setModalVisiblePop(false)}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              justifyContent: "center",
              paddingHorizontal: 10,
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                paddingHorizontal: 5,
                borderRadius: 8,
                paddingVertical: "4%",
                flex:0.55
              }}
            >
             


                <ScrollView
        style={{
          paddingHorizontal: 5,
          paddingBottom: 20, // Add padding to avoid overlap with the submit button
        }}
      >
              <View
                style={{
                  flexDirection: "row",
                  paddingHorizontal: "4%",
                }}
              >
                <Text
                  style={{
                    fontSize: 19,
                    color: "black",
                    fontFamily: "AvenirNextCyr-Bold",
                  }}
                >
                  Select Transportation Type
                </Text>
              </View>
            
              <View
                style={{
                  flexDirection: "row",
                  gap: 20,
                  justifyContent: "center",
                  marginVertical: "4%",
                }}
              >

                <View
                  style={{
                    flexDirection: "row",
                    width: "40%",
                    paddingVertical: "1%",
                    backgroundColor:
                    selectedOption === "Delivery" ? Colors.primary : "white",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 30,
                  }}
                >
                  <RadioButton.Android
                    color={"white"}
                    status={selectedOption === "Delivery" ? "checked" : "unchecked"}
                    onPress={() => handleSelect("Delivery")}
                  />
                  <TouchableOpacity onPress={() => handleSelect("Delivery")}>
                    <Text
                      style={{
                        fontFamily: "AvenirNextCyr-Medium",
                        fontSize: 15,
                        color: selectedOption === "Delivery" ? "white" : "black",
                      }}
                    >
                      Delivery
                    </Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    paddingVertical: "1%",
                    backgroundColor:
                    selectedOption === "Pick-Up" ? Colors.primary : "white",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 30,
                    width: "40%",
                  }}
                >
                  <RadioButton.Android
                    color={"white"}
                    status={selectedOption === "Pick-Up" ? "checked" : "unchecked"}
                    onPress={() => handleSelect("Pick-Up")}
                  />
                  <TouchableOpacity onPress={() => handleSelect("Pick-Up")}>
                    <Text
                      style={{
                        fontFamily: "AvenirNextCyr-Medium",
                        fontSize: 15,
                        color: selectedOption === "Pick-Up" ? "white" : "black",
                      }}
                    >
                      Pick-Up
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

                 <Text
                  style={{
                  fontSize: 19,
                  color: "black",
                  fontFamily: "AvenirNextCyr-Bold",
                  paddingHorizontal: "4%",
                  }}
                >
                  Select Order Type
                </Text>

              <View
                style={{
                  flexDirection: "row",
                  gap: 20,
                  justifyContent: "center",
                  marginVertical: "4%",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    width: "40%",
                    paddingVertical: "1%",
                    backgroundColor:
                    selectedOrderType === "Project" ? Colors.primary : "white",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 30,
                  }}
                >
                  <RadioButton.Android
                    color={"white"}
                    status={selectedOrderType === "Project" ? "checked" : "unchecked"}
                    onPress={() => handleOrderTypeSelect("Project")}
                  />
                  <TouchableOpacity onPress={() => handleOrderTypeSelect("Project")}>
                    <Text
                      style={{
                        fontFamily: "AvenirNextCyr-Medium",
                        fontSize: 15,
                        color: selectedOrderType === "Project" ? "white" : "black",
                      }}
                    >
                      Project
                    </Text>
                  </TouchableOpacity>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    paddingVertical: "1%",
                    backgroundColor:
                    selectedOrderType === "Retailer" ? Colors.primary : "white",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 30,
                    width: "40%",
                  }}
                >
                  <RadioButton.Android
                    color={"white"}
                    status={selectedOrderType === "Retailer" ? "checked" : "unchecked"}
                    onPress={() => handleOrderTypeSelect("Retailer")}
                  />
                  <TouchableOpacity onPress={() => handleOrderTypeSelect("Retailer")}>
                    <Text
                      style={{
                        fontFamily: "AvenirNextCyr-Medium",
                        fontSize: 15,
                        color: selectedOrderType === "Retailer" ? "white" : "black",
                      }}
                    >
                      Retail
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <TextInput1
            mode="outlined"
            label="Remarks"
            theme={{ colors: { onSurfaceVariant: "#4b0482" } }}
            activeOutlineColor="#4b0482"
            outlineColor="#B6B4B4"
            textColor="#4b0482"
            value={inputTransportValue}
            onChangeText={text => setInputTransportValue(text)}
            ref={input8Ref}
            onSubmitEditing={() => input9Ref.current.focus()}
            returnKeyType="done"
            blurOnSubmit={false}
            outlineStyle={{ borderRadius: ms(10) }}
            style={{ marginBottom: "5%", height: 0, backgroundColor: "white",marginHorizontal:'2%' }}
          />

                <TextInput1
            mode="outlined"
            label="Payment Terms"
            theme={{ colors: { onSurfaceVariant: "#4b0482" } }}
            activeOutlineColor="#4b0482"
            outlineColor="#B6B4B4"
            textColor="#4b0482"
            value={paymentTerms}
            onChangeText={text => setPaymentTerms(text)}
            ref={input10Ref}
            onSubmitEditing={() => input10Ref.current.focus()}
            returnKeyType="done"
            blurOnSubmit={false}
            outlineStyle={{ borderRadius: ms(10) }}
            style={{ marginBottom: "5%", height: 0, backgroundColor: "white",marginHorizontal:'2%' }}
          />
          
          <TextInput1
            mode="outlined"
            label="Site Address"
            value={siteAddress}
            theme={{ colors: { onSurfaceVariant: "#4b0482" } }}
            activeOutlineColor="#4b0482"
            outlineColor="#B6B4B4"
            textColor="#4b0482"
            multiline={true}
            numberOfLines={4}
            onChangeText={(text) => setSiteAddress(text)}
            ref={input9Ref}
            returnKeyType="done"
            blurOnSubmit={false}
            outlineStyle={{ borderRadius: ms(10) }}
            style={{ marginBottom: "5%", height: 0, backgroundColor: "white",marginHorizontal:'2%' }}
          />

             <View>
              <Text
                  style={{
                  fontSize: 19,
                  color: "black",
                  fontFamily: "AvenirNextCyr-Bold",
                  paddingHorizontal: "4%",
                  }}
                >
                 Order Image
                </Text>

            <View style={styles.buttonview}>
           
                <TouchableOpacity
                  style={{ ...styles.photosContainer, paddingTop: 8 ,backgroundColor:Colors.primary}}
                  onPress={checkPermission}
                >
                  <AntDesign name="camera" size={25} color={Colors.white} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={{...styles.photosContainer,backgroundColor:Colors.primary}}
                  onPress={handleGallery}
                >
                  <Text style={styles.buttonText}>Gallery</Text>
                </TouchableOpacity>
            </View>
            <View style={{ flexDirection: "row", alignItems: "flex-end", flexWrap: "wrap", paddingLeft: '5%' }}
>
  {base64img.map((img, index) => (
    <View key={index} style={{ alignItems: "center", marginRight: 10, marginBottom: 10 }}>
      <Image source={{ uri: img }} style={styles.imgStyle} />
      <TouchableOpacity
        style={{ marginTop: 5 }}
        onPress={() => {
          setBase64img(base64img.filter((_, i) => i !== index)); 
        }}
      >
        <AntDesign name="delete" size={20} color="black" />
      </TouchableOpacity>
    </View>
  ))}
</View>
      </View>

      </ScrollView>
      <TouchableOpacity
                style={{ position: "absolute", top: 10, right: 10,padding:5,backgroundColor:'lightgray' ,borderRadius:25}}
                onPress={() => setModalVisiblePop(false)}
              >
                <MaterialIcons name="close" size={26} color="black" />
              </TouchableOpacity>
              <View style={{ flexDirection: "row", justifyContent: "center" }}>
                <LinearGradient
                  colors={Colors.linearColors}
                  start={Colors.start}
                  end={Colors.end}
                  locations={Colors.ButtonsLocation}
                  style={{
                    backgroundColor: Colors.primary,
                    borderColor: Colors.primary,
                    borderRadius: 50,
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                  }}
                >
                  <TouchableOpacity
                    style={{
                      width: '95%', justifyContent: "center",
                      paddingVertical: "4%",
                      alignItems: "center",
                    }}
                    activeOpacity={0.8}
                    onPress={handleFilter}
                  >
                    <Text style={{
                      fontFamily: "AvenirNextCyr-Medium",
                      color: "#fff",
                      fontSize: 16,
                    }}>Submit</Text>
                  </TouchableOpacity>
                </LinearGradient>
              </View>
            </View>
          </View>
        </Modal>


        <Modal
        transparent={true}
        visible={modalVisibleOpen}
        animationType="slide"
        onRequestClose={() => setModalVisibleOpen(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)', 
          }}
        >
          <View
            style={{
              width: '80%',
              backgroundColor: 'white',
              borderRadius: 10,
              padding: 20,
              alignItems: 'center',
            }}
          >
            <Text  style={{
              color: Colors.primary,
              margin: 10,
              fontFamily: 'AvenirNextCyr-Medium',
              fontSize: 18,
            }}>Select a company for billing
            </Text>

            <Dropdown
              style={{
                width: '100%',
                height: 50,
                borderColor: '#ccc',
                borderWidth: 1,
                borderRadius: 8,
                paddingHorizontal: 10,
                color: "black",

              }}
              data={companyOptions}
              labelField="label"
              valueField="value"
              placeholder="Select a company"
              placeholderStyle={{ fontSize: 15, color: '#888' }}
              selectedTextStyle={{ fontSize: 15 ,color:'black'}}
              itemTextStyle={{ fontSize: 15 ,color:'black'}}
              inputSearchStyle={{ height: 30, fontSize: 14 ,color:'black'}}
              value={selectedCompany}
              onChange={handleCompanySelect}
            />
            <LinearGradient
                  colors={Colors.linearColors}
                  start={Colors.start}
                  end={Colors.end}
                  locations={Colors.ButtonsLocation}
                  style={{
                    backgroundColor: Colors.primary,
                    borderColor: Colors.primary,
                    borderRadius: 10,
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                    marginTop:'5%'
                  }}
                >
                  <TouchableOpacity
                    style={{
                      width: '100%', justifyContent: "center",
                      paddingVertical: "4%",
                      alignItems: "center",
                    }}
                    activeOpacity={0.8}
                     onPress={handleSubmit}
                  >
                    <Text style={{
                      fontFamily: "AvenirNextCyr-Medium",
                      color: "#fff",
                      fontSize: 16,
                    }}>Submit</Text>
                  </TouchableOpacity>
                </LinearGradient>
          </View>
        </View>
      </Modal>

        <LoadingView visible={loading} message="Please Wait ..." />
      </LinearGradient>
      {/* </ScrollView> */}
    </KeyboardAvoidingView>
  );
};

export default React.memo(EditSalesOrder);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "white",
  },
  elementsView: {
    backgroundColor: "#f2f2f2",
    marginHorizontal: "2%",
    marginTop: 5,
    marginBottom: 16,
    elevation: 5,
    ...globalStyles.border,
    // padding: 16,
    borderTopLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  imageView: {
    width: 70,
    height: 70,
    borderRadius: 10,
  },
  elementText: {
    fontSize: 15,
    fontFamily: "AvenirNextCyr-Medium",
    color: "black",
  },
  minusButton: {
    width: 45,
    height: 30,
    borderColor: "grey",
    borderWidth: 0.5,
    borderRadius: 5,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
    marginTop: 30,
    marginLeft: 10,
  },
  modalMinusButton: {
    width: 35,
    height: 20,
    borderColor: "grey",
    borderWidth: 0.5,
    borderRadius: 5,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
    marginTop: 40,
    marginLeft: 10,
  },
  quantityCount: {
    width: 45,
    height: 30,
    borderColor: "grey",
    borderWidth: 0.5,
    borderRadius: 5,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
    marginTop: 30,
    marginLeft: 1,
  },
  modalQuantityCount: {
    width: 35,
    height: 20,
    borderColor: "grey",
    borderWidth: 0.5,
    borderRadius: 5,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
    marginTop: 40,
    marginLeft: 1,
  },
  orderCloseView: {
    height: 15,
    width: 15,
    //marginTop: 30
  },
  imageText: {
    fontSize: 15,
    fontFamily: "AvenirNextCyr-Medium",
    color: "black",
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "lightgray",
    borderRadius: 5,

    //paddingVertical: 5,
    paddingHorizontal: 10,
    marginLeft: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    marginRight: 10,
  },
  input11: {
    flex: 1,
    fontSize: 16,
    marginRight: 10,
    backgroundColor: "white",
  },
  searchButton: {
    padding: 5,
  },
  sendButtonView: {
    borderRadius: 5,
    backgroundColor: "green",
    paddingVertical: 10,
    paddingHorizontal: 20,

    height: 40,
    marginLeft: 10,
  },
  saveButtonView: {
    borderRadius: 5,
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    height: 40,
    marginLeft: 10,
  },
  deleteButtonView: {
    borderRadius: 5,
    backgroundColor: "red",
    paddingVertical: 10,
    paddingHorizontal: 20,
    height: 40,
    marginLeft: 10,
  },
  addButtonView: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "grey",
    backgroundColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 20,
    height: 40,
    marginLeft: 10,
    alignSelf: "center",
  },
  modalAddButtonView: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "grey",
    backgroundColor: "white",
    paddingVertical: 5,
    paddingHorizontal: 15,
    height: 35,
  },
  buttonText: {
    color: "blue",
    fontFamily: "AvenirNextCyr-Medium",
  },
  sendButton: {
    color: "white",
    fontFamily: "AvenirNextCyr-Medium",
  },
  deleteButton: {
    color: "red",
  },
  saveButton: {
    color: "purple",
  },
  textColor: {
    color: "black",
    fontFamily: "AvenirNextCyr-Medium",
  },
  textValue: {
    color: "black",
    fontFamily: "AvenirNextCyr-Medium",
  },
  searchModal: {
    backgroundColor: "white",
    padding: 20,
    width: "90%",
    marginHorizontal: 10,
    borderRadius: 10,
    elevation: 5,
    ...globalStyles.border,
    marginVertical: 100,
  },
  modalSearchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "lightgray",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    flex: 1,
    height: 45,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    paddingHorizontal: 1,
  },
  modalContent: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 10,
    borderRadius: 8,
    marginTop: "16%",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modalTitle: {
    alignSelf: "center",
    fontSize: 20,
    color: Colors.primary,
    marginVertical: 10,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: "blue",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: "flex-end",
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
  },
  cartCountContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    backgroundColor: "red",
    borderRadius: 10,
    width: "70%",
    height: "70%",
  },
  cartCountText: {
    marginLeft: 6,
    color: "white",
    fontSize: 10,
    fontFamily: "AvenirNextCyr-Medium",
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    width: "100%",
  },
  btnText: {
    fontFamily: "AvenirNextCyr-Medium",
    color: "#fff",
    fontSize: 16,
  },
  emptyListComponent: {
    marginTop: "30%",
    alignItems: "center",
  },
  subCategoryContainer: {
    marginBottom: 5,
    marginTop: 10,
  },
  subCategoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f1f1f1",
    padding: 10,
    borderRadius: 4,
  },
  subCategoryTitle: {
    fontSize: 16,
    color:Colors.black
  },
  productsContainer: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  categoryList: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  categoryItem: {
    width: "40%",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 15,
    marginTop: "3%",
  },
  categoryImage: {
    width: '90%',
    height: 100,
    resizeMode: 'stretch',
    borderRadius:15,
   },
  categoryTitle: {
    marginVertical: 8,
    textAlign: "center",
    fontFamily: "AvenirNextCyr-Bold",
    fontSize: 14,
    color:Colors.black
  },
  noDataText: {
    textAlign: "center",
    marginTop: 20,
    color: "grey",
    fontSize: 16,
  },
    buttonview: {
    flexDirection: "row",
    alignItems: "center",
    gap:10,
    padding: 12,

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
    color: "white",
  },
   imgStyle: {
    width: 90,
    height: 90,
    resizeMode: "cover",
    borderRadius: 8,
    marginTop: 5,
    marginBottom: 5,
  },
});
