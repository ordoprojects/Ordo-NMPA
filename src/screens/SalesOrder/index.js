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
  ActivityIndicator
} from "react-native";
import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useMemo,
  useRef
} from "react";
import AntDesign from "react-native-vector-icons/AntDesign";
import Colors from "../../constants/Colors";
import { cameraPermission } from "../../utils/Helper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Entypo from "react-native-vector-icons/Entypo";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Searchbar, Checkbox, RadioButton,Menu , TextInput as TextInput1 ,Modal as PaperModal ,Portal,PaperProvider} from "react-native-paper";
import { AuthContext } from "../../Context/AuthContext";
import globalStyles from "../../styles/globalStyles";
import LinearGradient from "react-native-linear-gradient";
import { Dimensions } from "react-native";
import { Fold, Wave } from "react-native-animated-spinkit";
import GradientText from "../../styles/GradientText";
import { CameraScreen } from "react-native-camera-kit";
import { MaskedTextInput } from "react-native-mask-text";
import { LoadingView } from "../../components/LoadingView";
import  Ionicons  from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-simple-toast';
import { searchItem } from "../../utils/Search";
import { debounce } from "../../utils/Search";
import { ms, hs, vs } from "../../utils/Metrics";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";

// Get the screen height
const screenHeight = Dimensions.get("window").height;
import { Dropdown } from 'react-native-element-dropdown';

const SalesOrder = ({ navigation, route }) => {
  const [itemPrices, setItemPrices] = useState({});
  const [cartCount, setCartCount] = useState(0);
  const [addedItems, setAddedItems] = useState([]);
  const [dimensionModal, setDimensionModal] = useState(false);
  const [cartSearch, setCartSearch] = useState("");
  const [selectedOption, setSelectedOption] = useState("Delivery");
  const [selectedOrderType, setSelectedOrderType] = useState("Project");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [expandedSubCategory, setExpandedSubCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [originalCategories, setOriginalCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [searching, setSearching] = useState(false);
  const [productSearch, setProductSearch] = useState("");
  const [search, setSearch] = useState("");
  const [productsBySubCategory, setProductsBySubCategory] = useState({});
  const [inputTransportValue, setInputTransportValue] = useState('');
  const queryParams = useRef({ limit: 10, offset: 0 });
  const [dropdownItems, setDropdownItems] = useState([]);
  const { dealerData, userData, salesManager } = useContext(AuthContext);
  const [modalVisibleOpen, setModalVisibleOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companyOptions, setCompanyOptions] = useState([]);
  const [siteAddress, setSiteAddress] = useState(''); 
  const [paymentTerms, setPaymentTerms] = useState(''); 
  const [base64Images, setBase64Images] = useState([]);

    const [selectedItemName, setSelectedItemName] = useState('');
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [rows1, setRows1] = useState([
      { width_ft: "", height_inch: "", thickness: "", nos: "" }
    ]);
  
    const containerStyle = { flex:1, height:'100%', width:'100%' };
  
    const hideModal = () => setDimensionModal(false);
  
    const addRow1 = () => {
      setRows1([...rows1, { width_ft: '', height_inch: '', thickness: '' , nos: ''}]);
    };
  
    const deleteRow1 = (index) => {
      setRows1((prevRows) => {
        const updatedRows = prevRows.filter((_, i) => i !== index);
    
        // Update cartData by removing the corresponding row from dimensions
        setCartData((prevCartData) =>
          prevCartData.map((item) =>
            item.id === selectedItemId
              ? { ...item, dimensions: updatedRows } // Update dimensions
              : item
          )
        );
    
        return updatedRows;
      });
    };
    
  

  const input8Ref = useRef(null);
  const input9Ref = useRef(null);
  const input10Ref = useRef(null);

  useEffect(()=>{
    if (userData.token){
      getDropdownCompany();
    }
  },[userData])


  const getDropdownCompany = async () => {
    
    setLoading(true);
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${userData.token}`);
    const raw = "";

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    console.log("🚀 ~ getDropdownCompany ~ requestOptions:", requestOptions)

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


 const handleCompanySelect = (value) => {
    setSelectedCompany(value);
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


  useEffect(()=>{
    getDropdown();
  },[])

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

    fetch(
      `https://gsidev.ordosolution.com/api/uom_list/`,
      requestOptions
    )
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
  

const handleProductPress = (item, itemAdded) => {
  
  console.log(item,"**************************");

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
    const response = await fetch(`https://gsidev.ordosolution.com/api/product_categories/?limit=${limit}&offset=${offset}`, requestOptions);

    // Check if the response is OK and log it
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json(); // Attempt to parse the response as JSON
    console.log("🚀 ~ loadAllCategory ~ s:---------------->", result);

    if (offset === 0) {
      setCategories(result);
      setOriginalCategories(result); // Store the original categories
    } else {
      setCategories((prevData) => [...prevData, ...result]);
      setOriginalCategories((prevData) => [...prevData, ...result]); // Update original categories
    }

    setLoading(false);
  } catch (error) {
    setLoading(false);
  }
};

// Initial load
useEffect(() => {
  loadAllCategory(queryParams.current.limit, queryParams.current.offset);
}, []);


// Function to filter categories based on search input
const filterCategories = (val) => {
  const filtered = originalCategories.filter(category =>
    category.name.toLowerCase().includes(val.toLowerCase())
  );


  console.log('=================filtered===================');
  console.log(filtered);
  console.log('====================================');
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
     setSearch("");
     setProductSearch("");
    setSelectedCategory(categoryId);
    await loadSubCategories(categoryId);
  };

  const loadSubCategories = async (categoryId) => {
    setLoading(true);
    const response = await fetch(`https://gsidev.ordosolution.com/api/product_categories/?limit=10&offset=0&cate_id=${categoryId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userData.token}`,
      },
    });
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
    const response = await fetch(`https://gsidev.ordosolution.com/api/test_product/?limit=10&offset=0&cate_id=${categoryId}&sub_cate_id=${subCategoryId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userData.token}`,
      },
    });

    const result = await response.json();
    setProducts(result.products);
      // Update productsBySubCategory based on fetched products
    const updatedProductsBySubCategory = {};
    result.products.forEach(product => {
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
  const baseUrl = "https://gsidev.ordosolution.com/api/test_product/?limit=5&offset=0";
  setSearching(true);
  const result = await searchItem(baseUrl, val, userData.token);
  setSearching(false);

  if (result) {
    const updatedProductsBySubCategory = {};

    result.products.forEach(product => {
      const subcategoryId = product.sub_category_id.id;
      if (!updatedProductsBySubCategory[subcategoryId]) {
        updatedProductsBySubCategory[subcategoryId] = [];
      }
      updatedProductsBySubCategory[subcategoryId].push(product);
    });

    setProductsBySubCategory(updatedProductsBySubCategory);
  }
};


  const debouncedSearch = useCallback(debounce(handleSearch, 500), [userData.token]);

  useEffect(() => {
    if (search.trim()) {
      debouncedSearch(search);

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
    setProductSearch('');
    loadProducts(selectedCategory, expandedSubCategory);
  } else {
    setSearch('');
    console.log('================originalCategories====================');
    console.log(originalCategories);
    console.log('====================================');
    setCategories(originalCategories);
  }
};

// Define debounced product search function
const debouncedProductSearch = useCallback(debounce(async (val) => {
  const baseUrl = `https://gsidev.ordosolution.com/api/product_categories/?limit=10&offset=0&cate_id=${selectedCategory}&search=${val}`;
  setSearching(true);
  const result = await searchItem(baseUrl, val, userData.token);
  setSearching(false);

  if (result) {
    setSubCategories(result);
  }
}, 500), [userData.token, selectedCategory]);



const handleBackToCategory = () => {
  setSelectedCategory(null);
  setSearch("");
  setProductSearch("");
  setCategories(originalCategories);
  loadSubCategories(selectedCategory);
  loadProducts(selectedCategory, expandedSubCategory);
};

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity key={item.id} style={styles.categoryItem} onPress={() => handleCategorySelect(item.id)}>
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
        onPress={() => setExpandedSubCategory(expandedSubCategory === subcategoryId ? null : subcategoryId)}
      >
        <Text style={styles.subCategoryTitle}>{item.name}</Text>
        <Entypo name={expandedSubCategory === subcategoryId ? 'chevron-up' : 'chevron-down'} size={20} color='black'/>
      </TouchableOpacity>
      {expandedSubCategory === subcategoryId && (
        <View style={styles.productsContainer}>
            <FlatList
      data={productsForSubCategory}
      renderItem={renderProductItem}
      contentContainerStyle={{ paddingBottom: "20%" }}
      keyExtractor={(item) => item.id.toString()}
      onEndReachedThreshold={0.5}
      onEndReached={() => onEndReached(selectedCategory, expandedSubCategory)}
      ListEmptyComponent={<Text style={styles.noDataText}>No Data Available</Text>}
    />
        </View>
      )}
    </View>
  );
};


const renderProductItem = useCallback(({ item }) => {
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
}, [addedItems]); 


  const MemoizedFlatList = useMemo(() => {
  return (
    <FlatList
      data={products}
      renderItem={renderProductItem}
      contentContainerStyle={{ paddingBottom: "20%" }}
      keyExtractor={(item) => item.id.toString()}
      onEndReachedThreshold={0.5}
      onEndReached={() => onEndReached(selectedCategory, expandedSubCategory)}
      ListEmptyComponent={<Text style={styles.noDataText}>No Data Available</Text>}
    />
  );
}, [products, loading,addedItems]);



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

  const handleSelect = (option) => {
    setSelectedOption(option);
  };

   const handleOrderTypeSelect = (option) => {
    setSelectedOrderType(option);
  };


  const screenid =
    route.params?.screenid !== undefined ? route.params.screenid : 0;


  useEffect(() => {
    // Initialize itemPrices with lower_price_cap if list_price is 0 or not set
    const initialPrices = {};
    cartData.forEach(item => {
      if (!itemPrices[item.id] && item.list_price === 0) {
        initialPrices[item.id] = item.lower_price_cap;
      } else {
        initialPrices[item.id] = item.list_price;
      }
    });
    setItemPrices(initialPrices);
  }, [cartData]);

  const updatePrice = (itemId, newPrice) => {
    // Calculate the new price based on the quantity
    const adjustedPrice = newPrice || 0; // If newPrice is falsy, set it to 0

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
        setCartSearch('');
        if(selectedCompany){
        setModalVisible(true);

        }else{
          setModalVisibleOpen(true);
        }
    };


  const productsArray = [];
  const [totalAmt, setTotalAmt] = useState(0);
  const [totalQty, setTotalQty] = useState(0);
  const [cartData, setCartData] = useState([]);
  const [hasError, setHasError] = useState(false);


  console.log('============cartData========================');
  console.log(JSON.stringify(cartData[0]?.name,null,2));
  console.log('====================================');

  useEffect(() => {
    // Check for any price errors in the cart
    const error = cartData.some(
      (item) => parseFloat(item?.list_price?.replace(/[^0-9.-]+/g, "")) < item.lower_price_cap
    );

    setHasError(error);
  }, [itemPrices, cartData]);


  const calOrderStat = (array) => {
    let tempTotalAmt = 0;
    let tempQty = 0;

    array.forEach((item) => {
      let amt = Number(itemPrices[item?.id]) * Number(item?.qty);
      tempTotalAmt = tempTotalAmt + amt;
      tempQty = tempQty + Number(item?.qty);
    });
    setTotalAmt(tempTotalAmt);
    setTotalQty(tempQty);
  };

  const addProduct = (item) => {
    setCartData((prevCartData) => {
      const tempData = [...prevCartData];
      const existingItem = tempData.find((itm) => itm.id === item.id);
      if (existingItem) {
        existingItem.qty += 1;
        existingItem.tonnage += 1;
        handleDropdownChange(item.id, existingItem.customUOM);
        handleInputChange(item.id, existingItem.tonnage);
      } else {
        handleDropdownChange(item.id, item?.uom_list[0]?.value);
        tempData.push({ ...item, qty: 1, tonnage: 1 });
        setCartCount((prevCount) => (prevCount || 0) + 1);
        item.added = true;
        setAddedItems((prevAddedItems) => [...prevAddedItems, item.id]);
      }
      Toast.show(
        "Product Added Successfully to your cart",
        Toast.SHORT
      );
      calOrderStat(tempData);
      return tempData;
    });
  };
  
  const handleInputChange = (id, tonnage) => {
    setCartData((prevCartData) => {
      const updatedCartData = prevCartData.map((item) => {
        if (item.id === id) {
          const newTonnage = tonnage;
          return { ...item, tonnage: newTonnage };
        }
        return item;
      });
      return updatedCartData;
    });
  };
  
  const handleDropdownChange = (id, customUOM) => {
    setCartData((prevCartData) => {
      const updatedCartData = prevCartData.map((item) => {
        if (item.id === id) {
          return { ...item, customUOM };
        }
        return item;
      });
      return updatedCartData;
    });
  };

  const calculateTotalWeight = (item, tonnage) => {

    const widthMM = item.width / 1000;

    if (item.customUOM === 'TONS') {
      return tonnage * 1000;
    } else if (item.customUOM === 'KGS') {
      return tonnage;
    }else if (item.customUOM === 'FT') {
      return (tonnage * item.weight);
    }else if (item.customUOM === 'MTONS') {
      return tonnage * 0.907185 *1000 ;
    } else if (item.customUOM === 'BUNDLE' || item.customUOM === 'PACKET') {
      return tonnage * item.bundle_piece * item.weight;
    } else if (item.customUOM === 'NOS') {
      return tonnage * item.weight;
    } else if (item.customUOM === 'MTR') {
      return item.thickness * item.length * item.width * tonnage;
    }
    return 0;
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
  const [filteredCartData, setFilteredCartData] = useState([]);



  useEffect(() => {
    // If there's a search query, filter the cartData
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
      const total_weight = calculateTotalWeight(item, item.tonnage);
      return {
        productid: item.id,
        qty: item.tonnage,
        list_price: adjustedPrice,
        total_weight,
      };
    });
    setModalVisiblePop(false);
    navigation.navigate("AdminOrderReview", {
      productsArray: productArray,
      dealerInfo: dealerData,
      cartData: cartData.map(item => ({
        ...item,
        total_weight: calculateTotalWeight(item, item.tonnage),
      })),
      total: totalAmt,
      screenid: screenid,
      transportationType: selectedOption,
      salesType: selectedOrderType,
      transportationRemarks: inputTransportValue,
      company:selectedCompany,
      siteAddress: siteAddress,
      paymentTerms:paymentTerms,
      image:base64Images
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
      // Check if all items have a price and quantity
      for (let item of cartData) {
        console.log("guy",item)
        const itemPrice = parseFloat(itemPrices[item.id]?.replace(/[^0-9.-]+/g, ""));
        if (!itemPrice) {
          Alert.alert(
            "Warning",
            `Please enter a price for the item: ${item.name}`
          );
          return; // Exit the function to prevent navigation
        }
        if (item.tonnage === undefined || item.tonnage === "" || isNaN(item.tonnage) || item.tonnage === 0 || item.tonnage === '0') {
          Alert.alert(
            "Warning",
            `Please enter a valid quantity(tons) for the item: ${item.name}`
          );
          return; // Exit the function to prevent navigation
        }

        if (item.customUOM === "") {
          Alert.alert(
            "Warning",
            `Please Select a UOM for the item: ${item.name}`
          );
          return; // Exit the function to prevent navigation
        }
        // if (itemPrice< item.max_lower_cap_price) {
        //   Alert.alert(
        //     "Warning",
        //     `The price for the item: ${item.name} is lower than the allowed maximum lower cap price.`,
        //     [{ text: "OK" }]
        //   );
        //   return; // Exit the function to prevent navigation
        // }
      }
      
      if (screenid === 2) {
        let productArray = cartData.map((item) => {
          const adjustedPrice = Math.floor(itemPrices[item.id] / 100) || 0;
          const total_weight = calculateTotalWeight(item, item.tonnage);

          return {
            productid: item.id,
            qty: item.tonnage,
            list_price: adjustedPrice,
            total_weight,
          };
        });
        navigation.navigate("AdminOrderReview", {
          productsArray: productArray,
          dealerInfo: dealerData,
          cartData: cartData.map(item => ({
            ...item,
            total_weight: calculateTotalWeight(item, item.tonnage),
          })),
          total: totalAmt,
          screenid: screenid,
          transportationType: selectedOption,
          company:selectedCompany,
          transportationRemarks: inputTransportValue,
        });
      } else {
        setModalVisiblePop(true);
      }

    } else {
      Alert.alert("Sorry, no products to order");
    }
  };


  const [openScanner, setOpenScanner] = useState(false);
  const [cameraPermissionGranted, setCameraPermissionGranted] = useState(false);
  const [isProcessingScan, setIsProcessingScan] = useState(false);
  const searchbarRef = useRef(null);

  const handleBarcodeChange = (text) => {
    if (text.endsWith('<')) {
      const scannedBarcode = text.replace('<', '').trim();
      onBarcodeScan1(scannedBarcode);
    }
  };
  
  const increaseProductQuantity = (productId) => {
    const index = cartData.findIndex(item => item.id === productId);
    if (index !== -1) {
      const updatedItem = { ...cartData[index], tonnage: (parseFloat(cartData[index].tonnage) + 1).toString() };
      const updatedData = [...cartData];
      updatedData[index] = updatedItem;
      setCartData(updatedData);
    }
  };
  

  const fetchProductData = async (productId) => {
    console.log("🚀 ~ fetchProductData ~ productId:", productId)
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${userData.token}`);
  
    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
  
    try {
      const response = await fetch(`https://gsidev.ordosolution.com/api/test_product/?limit=20&offset=0&search_name=${productId}`, requestOptions);
      const data = await response.json();
      if (data && data.products && data.products.length > 0) {
        return data.products[0]; 
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error fetching product data:', error);
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
        setCartSearch('');
      } else {
        setCartSearch('');
        Toast.show("Product out of stock.", Toast.SHORT);
      }
    } else {
      setCartSearch('');
      Toast.show("No product found.", Toast.SHORT);
    }
  };
  
  // Mobile
  const onBarcodeScan = async (qrvalue) => {
    console.log("🚀 ~ onBarcodeScan ~ qrvalue:", qrvalue)

    if (isProcessingScan) {
      return; 
    }
  
    setIsProcessingScan(true);

    const barcodeData = qrvalue;
    const matchedProduct = await fetchProductData(barcodeData);
  
    if (matchedProduct) {
      if (!addedItems.includes(matchedProduct.id)) {
        addProduct(matchedProduct);
        toggleBarcodeScanner();
        setIsProcessingScan(false); 
      } else {
        Toast.show("Product is Qty added.", Toast.SHORT);
        increaseProductQuantity(matchedProduct.id);
        toggleBarcodeScanner();
        setIsProcessingScan(false); 
      }
    } else {
      toggleBarcodeScanner();
      setIsProcessingScan(false); 
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
    const res = await launchCamera({ mediaType: "photo" });
    if (res.assets) {
      saveImageData(res.assets[0].uri, res.assets[0].type);
    }
  };
  
  const handleGallery = async () => {
    const res = await launchImageLibrary({ mediaType: "photo" });
    if (res.assets) {
      saveImageData(res.assets[0].uri, res.assets[0].type);
    }
  };
  
  const saveImageData = (uri, type) => {
    setBase64Images((prevImages) => [...prevImages, { uri, type }]);  
  
    console.log('===============base64Images=====================');
    console.log(base64Images); 
    console.log('====================================');
  };
  

  // const handleCamera = async () => {
  //   const res = await launchCamera({
  //     mediaType: "photo",
  //   });
  //   console.log("response", res.assets[0].uri);
  //   processImage(res.assets[0].uri, res.assets[0].type);
  // };
  
  // const handleGallery = async () => {
  //   const res = await launchImageLibrary({
  //     mediaType: "photo",
  //   });
  //   console.log("response", res.assets[0].uri);
  //   processImage(res.assets[0].uri, res.assets[0].type);
  // };
  
  // const processImage = async (img, type) => {
  //   try {
  //     const base64Data = await RNFS.readFile(img, "base64");
  //     const newImage = {
  //       image_data: `data:${type};base64,${base64Data}`,
  //     };
    
  //     setBase64Images((prevImages) => [...prevImages, newImage]);
  //     console.log("image processed", base64Data);
  //   } catch (err) {
  //     console.log("image processing error", err);
  //   }
  // };
  
  const handleCameraPermission = async () => {
    const granted = await cameraPermission();
    if (!granted) {
      Alert.alert(
        'Camera Permission Required',
        'This app needs access to your camera to scan barcodes. Please enable camera permission in your device settings.',
        [{ text: 'OK' }]
      );
    }
    setCameraPermissionGranted(granted);
  };


  const toggleBarcodeScanner = async () => {
    if (!cameraPermissionGranted) {
      await handleCameraPermission();
    }
     if(selectedCompany && cameraPermissionGranted){
      setOpenScanner(!openScanner);
        }else {
          setModalVisibleOpen(true);
        }
  };

  
  useEffect(() => {
    if (openScanner && cameraPermissionGranted) {
      setTimeout(() => {
        setOpenScanner(true);
      }, 100);
    }
  }, [openScanner, cameraPermissionGranted]);
  
  const handleRemarksChange = (id, text) => {
    setCartData(prevCartData =>
      prevCartData.map(item =>
        item.id === id ? { ...item, product_remarks: text } : item
      )
    );
  };

    
  const handleInputChange1 = (index, field, value) => {

    // Update the row data
    const updatedRows = [...rows1];
    updatedRows[index][field] = value;
  
    setRows1(updatedRows);
  };

  const saveRowsToSelectedItemBasePlate = () => {
console.log("rows1",rows1)
       // Find the selected item in cartData
       const selectedItem = cartData.find(item => item.id === selectedItemId);
       const isBasePlate = selectedItem?.name === "BASE PLATE"; 
   
       console.log("Selected Item:", selectedItem);
       console.log("isBasePlate:", isBasePlate);
   
       // Validate rows before updating cartData
       const isValid = rows1.every(row => {
           if (isBasePlate) {
               // If BASE PLATE, all 4 values must be entered
               return row.height_inch && row.width_ft && row.thickness && row.nos;
           } else {
               // If not BASE PLATE, thickness can be ignored, but other 3 must be entered
               return row.height_inch && row.width_ft && row.nos;
           }
       });
   
       if (!isValid) {
           Alert.alert(
               "Missing Fields", 
               isBasePlate 
                   ? "Please enter all values: height, width, thickness, and nos."
                   : "Please enter height, width, and nos.",
               [{ text: "OK" }]
           );
           return;
       }
    
    const updatedCartData = cartData.map((item) => {
      if (item.id === selectedItemId) {
        const updatedBasePlateData = rows1.map((row) => ({
          height_inch: row.height_inch,
          width_ft: row.width_ft,
          thickness: row.thickness,
          nos: row.nos,
        }));
  
        return {
          ...item,
          dimensions: updatedBasePlateData, 
        };
      }
      return item;
    });
  
    setCartData(updatedCartData);
  
    console.log("Data saved to cartData for the selected item.");
    setDimensionModal(false); 
  };
  

  return (
    <PaperProvider>
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
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
            flex: 1
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
                  onChangeText={(val) => { setCartSearch(val); handleBarcodeChange(val) }}
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
                {/* </LinearGradient> */}
              </View>
            </>

  <Modal visible={modalVisible} onRequestClose={handleModalClose} animationType="slide" transparent>
    <SafeAreaView style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
         {selectedCategory ? (
  <TouchableOpacity
   onPress={handleBackToCategory}    

  >
    <Ionicons name="arrow-back" size={24} color="grey" />
  </TouchableOpacity>
) : <Text> </Text>}

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
            ListEmptyComponent={<Text style={styles.noDataText}>No Subcategories Available</Text>}
          />
        ) : (
          <FlatList
            data={categories}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            key={'_'}
            columnWrapperStyle={{ justifyContent: 'space-around' }}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.5}
            ListEmptyComponent={<Text style={styles.noDataText}>No Categories Available</Text>}
          />
        )}
      </View>
    </SafeAreaView>
  </Modal>
            {filteredCartData.length === 0 ? (
              <View style={{ flex: 1, justifyContent: 'center' }}>
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
                <View style={{ marginTop: "5%", }}>
                  <Text
                    style={{
                      textAlign: "center",
                      fontFamily: "AvenirNextCyr-Medium",
                      fontSize: 23,
                      color: "#571A9B",
                      marginBottom:'2%'
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
                    Looks like you haven’t added {"\n"} anything to your cart yet{" "}
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
                      //   marginHorizontal: "4%",
                      marginTop: 5,
                      marginBottom: 5,
                      elevation: 5,
                      ...globalStyles.border,
                      borderRadius: 5,
                      flex: 1
                    }}
                  >
                    <Pressable style={{ padding: 10 }}>
                      <View
                        style={{ flexDirection: "row", justifyContent: "center" }}
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
                          {item.product_image && item.product_image.length > 0 ? (
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
                                width: "60%",
                              }}
                            >
                              {item.name}
                            </Text>


{ item.name === "BASE PLATE" 
    
     &&                     

<TouchableOpacity
// onPress={()=>{setDimensionModal(true); setSelectedItemId(item?.id); setSelectedItemName(item?.name)}}
onPress={() => {
  setSelectedItemId(item?.id);
  setSelectedItemName(item?.name);
  
  // Find selected item from cartData
  const selectedItem = cartData.find(cartItem => cartItem.id === item?.id);
  
  if (selectedItem?.dimensions?.length > 0) {
    // Prepopulate rows1 with existing dimensions
    setRows1(selectedItem.dimensions.map(dim => ({
      width_ft: dim.width_ft || '',
      height_inch: dim.height_inch || '',
      thickness: dim.thickness || '',
      nos: dim.nos || '',
    })));
  } else {
    // If no dimensions exist, initialize an empty row
    setRows1([{ width_ft: '', height_inch: '', thickness: '', nos: '' }]);
  }
  
  setDimensionModal(true);
}}

                          style={{borderRadius:5,padding:7,backgroundColor:'green',alignItems:'center', justifyContent:'center'}}  >
      <Text style={{ fontFamily: "AvenirNextCyr-Bold", color: "white" ,alignItems: "center", fontSize: 11 }}>Add Size</Text>

  </TouchableOpacity>
                }


{
     (item.product_category?.product_category_name === "ROOFING" && item?.customUOM === "FT")
     &&                     

<TouchableOpacity
// onPress={()=>{setDimensionModal(true); setSelectedItemId(item?.id); setSelectedItemName(item?.name)}}
onPress={() => {
  setSelectedItemId(item?.id);
  setSelectedItemName(item?.name);
  
  // Find selected item from cartData
  const selectedItem = cartData.find(cartItem => cartItem.id === item?.id);
  
  if (selectedItem?.dimensions?.length > 0) {
    // Prepopulate rows1 with existing dimensions
    setRows1(selectedItem.dimensions.map(dim => ({
      width_ft: dim.width_ft || '',
      height_inch: dim.height_inch || '',
      thickness: dim.thickness || '',
      nos: dim.nos || '',
    })));
  } else {
    // If no dimensions exist, initialize an empty row
    setRows1([{ width_ft: '', height_inch: '', thickness: '', nos: '' }]);
  }
  
  setDimensionModal(true);
}}

                          style={{borderRadius:5,padding:7,backgroundColor:'green',alignItems:'center', justifyContent:'center'}}  >
      <Text style={{ fontFamily: "AvenirNextCyr-Bold", color: "white" ,alignItems: "center", fontSize: 11 }}>Add Size</Text>

  </TouchableOpacity>
                }


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
                              color: item.stock <= 0  ? "tomato" : "green",
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
                        </View>
                      </View>
  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", }}>
  <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
    <View style={{ paddingHorizontal: 10, borderColor: "#cccccc", borderWidth: 1, height: 30, flexDirection: "row", alignItems: "center", justifyContent: "center", minWidth: 100, marginRight: 20 }}>
      <MaskedTextInput
        type="currency"
        options={{
          prefix: "₹ ",
          decimalSeparator: ".",
          groupSeparator: ",",
          precision: 2,
        }}
        onChangeText={(text) => {
          updatePrice(item.id, text);
        }}
          value={item.product_price
                                ? (item.product_price * 100).toString()
                                : (item.lower_price_cap * 100).toString()
                            }
        style={{ height: 40, width: "100%" ,color: 'black'}}
        keyboardType="numeric"
      />
    </View>
  </View>

  <View style={{ flexDirection: "row", alignItems: "center", flex: 1, justifyContent: "flex-end", marginRight: 10 }}>
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
      onChangeText={(text) => handleInputChange(item.id, text)}
      value={item.tonnage !== undefined && item.tonnage !== '' ? item.tonnage.toString() : ''}
      keyboardType="decimal-pad"
      returnKeyType="done"
      onBlur={() => {
        if (!item.tonnage || item.tonnage === '') {
          handleInputChange(item.id, '1');
        }
      }}
      onSubmitEditing={() => Keyboard.dismiss()}
    />
  </View>

  <View style={{ width: '27%' }}>
    <Dropdown
    style={{ height: 30, backgroundColor: 'white', marginVertical: 5, borderWidth: 0.5, borderColor: "gray", paddingLeft: 3 }}
    placeholderStyle={{ fontSize: 14, color: '#888' }}
    selectedTextStyle={{ fontSize: 14 ,color:'black'}}
    inputSearchStyle={{ height: 30, fontSize: 14 ,color:'black'}}
    itemTextStyle={{ fontSize: 12 ,color:'black'}}
    containerStyle={{ marginVertical: 5 }}
    data={item?.uom_list}
    search
    maxHeight={400}
    labelField="label"
    valueField="value"
    placeholder="UOM"
    value={item?.customUOM || item?.unit_of_measure}
    onChange={(selectedItem) => handleDropdownChange(item.id, selectedItem.value)}
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
                            item.lower_price_cap && !salesManager && (
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

          {cartData.length > 0 && screenid === 2 && (!hasError || salesManager) && (
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

          {cartData.length > 0 && (screenid == 1 || screenid == 0) && filteredCartData.length !== 0 && (
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
        </View>

        {/* Barcode scanner modal */}
        <Modal visible={openScanner} animationType="slide" transparent={true}>
          <View style={{ flex: 1, backgroundColor: 'black' }}>
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
          paddingBottom: 20,
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
            onSubmitEditing={() => {input9Ref.current.focus();  Keyboard.dismiss();}}
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
            onSubmitEditing={() => {input10Ref.current.focus(); Keyboard.dismiss();}}
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
            onSubmitEditing={() => Keyboard.dismiss()}
            returnKeyType="next"
            blurOnSubmit={false}
            outlineStyle={{ borderRadius: ms(10) }}
            style={{ marginBottom: "5%", height: 0, backgroundColor: "white",marginHorizontal:'2%' }}
            // style={{ marginBottom: "5%", height: 0, backgroundColor: "white" }}
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
                  onPress={checkPermission}>
                  <AntDesign name="camera" size={25} color={Colors.white} />
                </TouchableOpacity>
            
                <TouchableOpacity
                  style={{...styles.photosContainer,backgroundColor:Colors.primary}}
                  onPress={handleGallery}>
                  <Text style={styles.buttonText}>Gallery</Text>
                </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingVertical: '5%' }}>
  <View style={{ flexDirection: "row", alignItems: "center", gap: 15 }}>
    {base64Images.map((img, index) => (
      <View key={index} style={{ flexDirection: "row", alignItems: "center" }}>
        <Image source={{ uri: img.uri }} style={styles.imgStyle} /> 
        <TouchableOpacity
          style={{ marginRight: 10, marginBottom: 5 }}
          onPress={() => {
            setBase64Images((prevImages) => prevImages.filter((_, i) => i !== index)); 
          }}
        >
          <AntDesign name="delete" size={20} color="black" />
        </TouchableOpacity>
      </View>
    ))}
  </View>
</ScrollView>

          </View>
      </ScrollView>

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
                  }}
                >
                  <TouchableOpacity
                    style={{
                      justifyContent: "center",
                      paddingVertical: "4%",
                      alignItems: "center",
                      width: "100%",
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




      <Portal>
<PaperModal visible={dimensionModal} onDismiss={hideModal} contentContainerStyle={containerStyle}>
<KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
  <View style={styles.modalContainer2}>
  <View style={styles.modalContent2}>

  <TouchableOpacity
  style={{ ...styles.closeIcon, marginTop: '2%' }}
  onPress={() => {
    console.log("Close button pressed"); 
    setDimensionModal(false); 
  }}
>
  <AntDesign name="close" color="black" size={25} />
</TouchableOpacity>



<View style={{ marginHorizontal: '1%', marginTop: '3%', gap: 1}}>
<View>

    <View  style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap:5 }}>
      <Text style={styles.ModalText2} numberOfLines={4}>{selectedItemName}</Text>
     
      <TouchableOpacity onPress={addRow1} style={{ padding: 10, backgroundColor: 'green', marginVertical: 10, alignItems: 'center', borderRadius: 10 }}>
      <Text style={{ color: 'white' }}>Add Row</Text>
      </TouchableOpacity>

      </View>
      <View style={{
          alignItems: 'center',
          borderBottomWidth: 1,
          borderBottomColor: '#D3D3D3',
          marginTop: '3%'}}>
        </View>
     </View>

     <ScrollView 
    style={{ flex: 1 }} 
    contentContainerStyle={{ flexGrow: 1 }} 
    keyboardShouldPersistTaps="handled"
  >

    <ScrollView 
      horizontal 
      contentContainerStyle={{ minWidth: 520 }}
      keyboardShouldPersistTaps="handled"
    >

          <View style={{ marginHorizontal: '1%', marginTop: '3%', gap: 1}}>
          <View style={{ flexDirection: 'row', marginBottom: 10, alignItems: 'center', width: '100%', gap: 1}}>
  
          <View style={{ marginHorizontal: '1%', gap: 1 }}>
  {/* Header Row */}
  <View style={{
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
    gap: 10,
  }}>
   
    {/* ORDO GSI APP B_418 | 08-Apr-2025 | Sahana  */}
    {/* Fixed issues by adding ft and inches for ppgl */}
    <Text style={{
      fontSize: 14,
      fontWeight: 'bold',
      textAlign: 'center',
      textAlignVertical: 'center',
      color: 'black',
      width: 100, // Same as TextInput width
    }}>{selectedItemName === "BASE PLATE" ? "LENGTH": "FT"}</Text>

    <Text style={{
      fontSize: 14,
      fontWeight: 'bold',
      textAlign: 'center',
      textAlignVertical: 'center',
      color: 'black',
      width: 100, // Same as TextInput width
    }}>{selectedItemName === "BASE PLATE" ? "WIDTH": "INCHES"}</Text>



    {selectedItemName === "BASE PLATE" && (
      <Text style={{
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
        textAlignVertical: 'center',
        color: 'black',
        width: 100, // Same as TextInput width
      }}>THICKNESS</Text>
    )}

    <Text style={{
      fontSize: 14,
      fontWeight: 'bold',
      textAlign: 'center',
      textAlignVertical: 'center',
      color: 'black',
      width: 90, // Same as TextInput width
    }}>NOS</Text>
  </View>

  {/* Data Rows */}
  <FlatList
    data={rows1}
    renderItem={({ item, index }) => (
      <View key={index} style={{
        flexDirection: 'row',
        marginBottom: 10,
        alignItems: 'center',
        width: '100%',
        gap: 10,
      }}>

     <TextInput
          style={{ borderWidth: 1, padding: 5, width: 100, textAlign: 'center' }}
          value={selectedItemName === "BASE PLATE" ? item?.height_inch :item?.width_ft}
          placeholder="0.00"
          onChangeText={(text) => handleInputChange1(index, 'width_ft', text)}
          keyboardType="number-pad"
          returnKeyType="done"
        />

        <TextInput
          style={{ borderWidth: 1, padding: 5, width: 100, textAlign: 'center' }}
          value={selectedItemName === "BASE PLATE" ? item?.width_ft :item?.height_inch}
          placeholder="0.00"
          onChangeText={(text) => handleInputChange1(index, 'height_inch', text)}
          keyboardType="number-pad"
          returnKeyType="done"
        />

     

        {selectedItemName === "BASE PLATE" && (
          <TextInput
            style={{ borderWidth: 1, padding: 5, width: 100, textAlign: 'center' }}
            value={item?.thickness}
            placeholder="0.00"
            onChangeText={(text) => handleInputChange1(index, 'thickness', text)}
            keyboardType="number-pad"
            returnKeyType="done"
          />
        )}

        <TextInput
          style={{ borderWidth: 1, padding: 5, width: 90, textAlign: 'center' }}
          value={item?.nos}
          placeholder="0.00"
          onChangeText={(text) => handleInputChange1(index, 'nos', text)}
          keyboardType="number-pad"
          returnKeyType="done"
        />

        <TouchableOpacity onPress={() => deleteRow1(index)} style={{ padding: 5 }}>
          <AntDesign name="delete" size={20} color="tomato" />
        </TouchableOpacity>
      </View>
    )}
  />
</View>

            </View>
           </View>
         </ScrollView> 
        </ScrollView> 
          
  <LinearGradient
  colors={Colors.linearColors}
  start={Colors.start}
  end={Colors.end}
  locations={Colors.ButtonsLocation}
  style={{
    borderRadius: 20,
    height: 45,
  }}
>
  <TouchableOpacity
    onPress={() => {
      saveRowsToSelectedItemBasePlate();
    }}
    style={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    }}
  >
      <Text style={{ fontFamily: "AvenirNextCyr-Bold", color: "white" ,alignItems: "center", fontSize: 16 }}>Submit</Text>

  </TouchableOpacity>
</LinearGradient>
    </View>
  </View>
  </View>
  </KeyboardAvoidingView>
  </PaperModal>
  </Portal>

 <LoadingView visible={loading} message="Please Wait ..." />
      </LinearGradient>
    </KeyboardAvoidingView>
    </PaperProvider>
  );
};

export default React.memo(SalesOrder);

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
    backgroundColor: 'white'
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    paddingHorizontal: 1,
  },
  modalContent: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 10,
    borderRadius: 8,
    marginTop: '16%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalTitle: {
    alignSelf: 'center',
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
    marginTop: '30%',
    alignItems: 'center',
  },
    subCategoryContainer: {
    marginBottom: 5,
    marginTop:10
  },
  subCategoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f1f1f1',
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryItem: {
    width: '40%',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth:1,
    borderColor:'gray',
    borderRadius:15,
    marginTop:'3%'
  },
  categoryImage: {
    width: '90%',
    height: 100,
    resizeMode: 'stretch',
    borderRadius:15,
   },
  categoryTitle: {
    marginVertical: 8,
    textAlign: 'center',
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
  
  modalContainer2: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent2: {
    backgroundColor: "white",
    borderRadius: 10,
    paddingVertical: 30,
    paddingHorizontal: 10,
    flex:1,
    marginHorizontal:'3%',
    marginVertical:'5%',
  },  ModalText2: {
    fontSize: 14,
    fontFamily: 'AvenirNextCyr-Bold',
    paddingBottom: 5,
    color:Colors.primary,
    width:'50%'
  },  closeIcon: {
    position: 'absolute',
    top: 5,
    right: 10,
    padding: 5,
  },
});
