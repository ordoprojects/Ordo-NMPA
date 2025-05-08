import React, { useContext, useEffect, useState,useRef, useCallback,
  useMemo, } from "react";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { AuthContext } from "../../Context/AuthContext";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  FlatList,
  Pressable,
  Linking,
  SafeAreaView,
  KeyboardAvoidingView
} from "react-native";
import Colors from "../../constants/Colors";
import { useFocusEffect } from "@react-navigation/native";
import { Image } from "react-native-animatable";
import globalStyles from "../../styles/globalStyles";
import AntDesign from "react-native-vector-icons/AntDesign";
import Entypo from "react-native-vector-icons/Entypo";
import ConvertDateTime from "../../utils/ConvertDateTime";
import { Checkbox,Searchbar } from "react-native-paper";
import { TextInput as TextInput1 ,ActivityIndicator } from "react-native-paper";
import { searchItem } from "../../utils/Search";
import { debounce } from "../../utils/Search";
import  Ionicons  from 'react-native-vector-icons/Ionicons';
import { LoadingView } from "../../components/LoadingView";
import { MaskedTextInput } from "react-native-mask-text";
import { Dropdown } from 'react-native-element-dropdown';
import RNFetchBlob from 'rn-fetch-blob';
import { WebView } from 'react-native-webview';

const OrderRevStockDetailsEdit = ({ navigation, route }) => {
  const orderDetail = route.params?.orderDetails;
  const [orderDetails, setOrderDetails] = useState(orderDetail);
  const screen = route.params?.screen;
  const [products1, setProducts1] = useState(
    route?.params?.orderDetails?.product_list
  );
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0); 
  const { userData } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [isAnyProductUnavailable, setIsAnyProductUnavailable] = useState(false);
  const [addedItems, setAddedItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setselectedItems] = useState([]);
  const queryParams = useRef({ limit: 10, offset: 0 });
  const [searching, setSearching] = useState(false);
  const [expandedSubCategory, setExpandedSubCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [originalCategories, setOriginalCategories] = useState([]);
  const [productSearch, setProductSearch] = useState("");
  const [productsBySubCategory, setProductsBySubCategory] = useState({});
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [dropdownItems, setDropdownItems] = useState([]);
  const [dropdownItemsAdd, setDropdownItemsAdd] = useState([]);
  const [modalVisible1, setModalVisible1] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [rows, setRows] = useState([{ dropdownValue: null, price: '00.00', weight: '00.00', pieces: '' }]);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [companyOptions, setCompanyOptions] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [modalVisibleBill, setModalVisibleBill] = useState(false);
  const [siteAddress, setSiteAddress] = useState(orderDetails?.site_address);
  const [paymentTerms, setPaymentTerms] = useState(orderDetails?.payment_term); 
  const [base64img, setBase64img] = useState(orderDetails?.bill_img);
  const [isUpdating, setIsUpdating] = useState(false);

  console.log('====================================');
  console.log(userData);
  console.log('====================================');


  useEffect(()=>{
    getDropdownCompany();
  },[])


  const convertImageToBase64 = async (image) => {
  let Photo = '';

  // Check if the image is already in base64 format
  const isFileFormat = image && image.startsWith('data:');

  if (isFileFormat) {
    console.log('Image is already in base64 format:', image);
    Photo = image; // Directly use the base64 image
  } else {
    console.log('Image is in URL format, converting to base64:', image);

    try {
      const response = await RNFetchBlob.fetch('GET', image);
      const base64Data = response.base64();

      // Add the prefix to make it a valid base64 string
      const formattedBase64Data = `data:image/jpeg;base64,${base64Data}`;
      Photo = formattedBase64Data;

      console.log('Converted image to base64:', Photo);
    } catch (error) {
      console.error('Error converting image URL to base64:', error);
      throw error;
    }
  }

  return Photo;
};


useEffect(() => {
  const handleImageConversion = async () => {
    try {
      const base64Image = await convertImageToBase64(base64img);
      setBase64img(base64Image); // Save it to your state if needed
    } catch (error) {
      console.error('Error during image conversion:', error);
    }
  };

  if (base64img) {
    handleImageConversion();
  }
}, [base64img]);


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
    if (companyOptions.length > 0) {
      // Find the initial company by matching company_name
      const initialCompany = companyOptions.find(
        option => option.label === orderDetail?.company_name
      );
      if (initialCompany) {
        setSelectedCompany(initialCompany.value);
        setSelectedCompanyId(initialCompany.value);
      }
    }
  }, [companyOptions, orderDetail?.company_name]);
  
  const handleCompanyChange = (item) => {
    setSelectedCompany(item.value);
    setSelectedCompanyId(item.value);
  };


  const addRow = () => {
    setRows([...rows, { dropdownValue: null, price: '00.00', weight: '00.00', pieces: '' }]);
  };


 useEffect(() => {
    if (modalVisible1 && rows.length === 0) {
      const selectedItemm = selectedItem.find(item => item.id === selectedItemId);
      if (selectedItemm && Array.isArray(selectedItemm.product_array)) {
        setRows(selectedItemm.product_array);
      } else {
        addRow();
      }
    } else if (!modalVisible1) {
      setRows([]);
      setSelectedOptions([]);
    }
  }, [modalVisible1, selectedItemId]);



   useEffect(() => {
        if (products1) {
            const transformedItems = products1.map(item => ({
                ...item,
                quantity: item.qty,        
                cust_price: item.price*100,
                id:item.product_id,
                idd:item.id
            }));
            setselectedItems(transformedItems);
        }
    }, [products1]);



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
          setDropdownItemsAdd(result || [])
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  };


   useEffect(() => {
    const checkIfAnyProductUnavailable = () => {
      setIsAnyProductUnavailable(
        selectedItem.some((product) => !product.is_available)
      );
    };
    checkIfAnyProductUnavailable();
  }, [selectedItem]);

  const [availableCount, setAvailableCount] = useState(0);
  const [unavailableCount, setUnavailableCount] = useState(0);

  useFocusEffect(
    React.useCallback(() => {
      const availableProducts = selectedItem.filter(
        (product) => product.is_available
      ).length;
      const unavailableProducts = selectedItem.filter(
        (product) => !product.is_available
      ).length;

      setAvailableCount(availableProducts);
      setUnavailableCount(unavailableProducts);
    }, [selectedItem])
  );


  const [currentProduct, setCurrentProduct] = useState(null);

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
  const filtered = originalCategories.filter(category =>
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
    setProductSearch('');
    loadProducts(selectedCategory, expandedSubCategory);
  } else {
    setSearch('');
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
    console.log("result", result);
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

  console.log('==================item==================');
  console.log(JSON.stringify(item,null,2));
  console.log('====================================');

    return (
        <View
            style={{
                backgroundColor: "#f2f2f2",
                marginHorizontal: "1%",
                marginTop: 5,
                marginBottom: "3%",
                elevation: 5,
                ...globalStyles.border,
                borderTopLeftRadius: 20,
                borderBottomRightRadius: 20,
            }}
        >
            <Pressable
                style={{ padding: 10 }}
                onPress={() => handleCheckboxChange(item)}
            >
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "center",
                    }}
                >
                    <View
                        style={{
                            backgroundColor: "white",
                            elevation: 5,
                            ...globalStyles.border,
                            borderRadius: 20,
                            padding: "3%",
                        }}
                    >
                        {item.product_image && item.product_image.length > 0 ? (
                            <Image
                                source={{uri: item.product_image.startsWith("http")
          ? item.product_image
          : `https://gsidev.ordosolution.com${item.product_image}`,
      }} 
                                style={styles.imageView}
                            />
                        ) : (
                            <Image
                                source={require("../../assets/images/noImagee.png")} 
                                style={styles.imageView}
                            />
                        )}
                    </View>
                    <View
                        style={{
                            flex: 1,
                            marginLeft: 10,
                        }}
                    >
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 12,
                                    color: Colors.primary,
                                    fontFamily: "AvenirNextCyr-Bold",
                                    flexWrap: "wrap",
                                    flex: 2,
                                }}
                            >
                                {item.name}
                            </Text>
                            <Checkbox.Android
                                color={Colors.primary}
                                status={
                                    selectedItem.some(
                                        (product) => product.id === item.id
                                    )
                                        ? "checked"
                                        : "unchecked"
                                }
                            />
                        </View>
                        <Text
                            style={{
                                color: "black",
                                fontSize: 12,
                                fontFamily: "AvenirNextCyr-Medium",
                                marginTop: 1,
                            }}
                        >
                            UOM : {item.unit_of_measure}
                        </Text>
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
                    </View>
                </View>
            </Pressable>
        </View>
    );
}, [selectedItem]);


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

const removeProductFromCart = (item) => {
    // Filter out the item to remove it from the array
    const updatedProducts = selectedItem.filter(
        (product) => product.id !== item.id
    );
    setselectedItems(updatedProducts); 
};


const handleCheckboxChange = (item) => {

    setselectedItems((prevselectedItems) => {
        const isSelected = prevselectedItems.some((product) => product.id === item.id);
        if (isSelected) {
            // Remove the product from selectedItem
            return prevselectedItems.filter((product) => product.id !== item.id);
        } else {
            // Add the product to selectedItem
            return [
                ...prevselectedItems,
                {
                    brand: item.brand,
                    cust_price: '',
                    hsc_code: item.hsc_code,
                    id: item.id,
                    is_available: true,
                    loaded_qty: 1,
                    lower_price_cap: item.lower_price_cap,
                    mfd: item.mfd,
                    name: item.name,
                    cust_price: item.product_price * 100,
                    price: item.product_price,
                    product_category: item.product_category,
                    product_id: item.id,
                    product_image: item.product_image,
                    product_tax: item.product_tax,
                    product_weight: item.product_weight,
                    remaining_qty: '',
                    remarks: '',
                    route_product_status: "Pending",
                    stock: item.stock,
                    stock_comments: '',
                    quantity:1,
                    total_weight:0,
                    loaded_uom:item?.uom_list[0]?.value,
                    thickness:item?.thickness,
                    weight:item?.weight,
                    width:item?.width,
                    bundle_piece:item?.bundle_piece,
                    length:item?.length,
                    uom_list:item?.uom_list,
                    is_new:true
                },
            ];
        }
    });
};

const handleQuantityChange = (item, action) => {
  let numericValue = parseFloat(item.quantity);

  if (action === 'increment') {
      // Increment quantity by 1 and reset stockError
      item.quantity = (numericValue + 1).toString();
      item.stockError = false;
      setselectedItems([...selectedItem]); // Trigger state update by creating a new reference
  } else if (action === 'decrement' && numericValue > 1) {
      // Decrement quantity by 1 and reset stockError
      item.quantity = (numericValue - 1).toString();
      item.stockError = false;
      setselectedItems([...selectedItem]); // Trigger state update by creating a new reference
  } else if (action === '') {
      // Handle the case when the input field is cleared
      item.quantity = '';
      setselectedItems([...selectedItem]); // Trigger state update by creating a new reference
  } else if (!isNaN(action) && action >= 0) {
      // Update quantity to the entered value and reset stockError
      item.quantity = action; // Keep as string to allow decimal points
      item.stockError = false;
      setselectedItems([...selectedItem]); // Trigger state update by creating a new reference
  } else if (isNaN(numericValue) || numericValue < 1) {
      // Set quantity to 1 and reset stockError
      item.quantity = '1';
      item.stockError = false;
      setselectedItems([...selectedItem]); // Trigger state update by creating a new reference
  }
};


    useEffect(() => {
        // Calculate the total quantity
        const sumQuantity = products?.reduce((accumulator, item) => {
            // Parse item.quantity as an integer; if it's NaN or less than 1, use 1
            const quantity = parseInt(item.qty);
            const validQuantity = isNaN(quantity) || quantity < 1 ? 1 : quantity;

            return accumulator + validQuantity;
        }, 0);

        // Update the totalQuantity state with the calculated sum
        setTotalQuantity(sumQuantity);

        // Calculate the total price
        const totalPrice = products?.reduce((accumulator, item) => {
            // Parse item.quantity and item.price as floats; if they're NaN or less than 0, use 0
            const quantity = parseFloat(item.qty);
            const price = parseFloat(item.price);
            const validQuantity = isNaN(quantity) || quantity < 1 ? 1 : quantity;
            const validPrice = isNaN(price) || price < 0 ? 0 : price;

            return accumulator + validQuantity * validPrice;
        }, 0);

        // Update the totalPrice state with the calculated sum
        setTotalPrice(totalPrice);
    }, [products]);

    const updatePrice = async (itemId, newPrice) => {
        // Calculate the new price based on the quantity
        const adjustedPrice = newPrice || 0; // If newPrice is falsy, set it to 0

        // Update cartData with the new price for the particular itemId
        setselectedItems((prevData) =>
            prevData.map((item) =>
                item.id === itemId
                    ? { ...item, price: adjustedPrice } // Ensure list_price is updated correctly
                    : item
            )
        );
    };


  const EditOrderDetails = async () => {
    try {
      console.log('EditOrderDetails function started');
      setIsUpdating(true);
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${userData.token}`);
  
      const lineItemsArray = selectedItem.map(item => {
        const totalWeight = calculateTotalWeight(item, item.quantity || 0);
        console.log(`Calculated total weight for item ${item.id}: ${totalWeight}`);
  
        // Check if price is defined and is a string or number
        const price = item?.price;
        const formattedPrice = typeof price === 'string'
          ? parseFloat(price.replace(/[^0-9.-]+/g, "")).toFixed(2)
          : typeof price === 'number'
          ? price.toFixed(2)
          : '0.00';
  
        return {
          product_id: item.id ? item.id : item.id,
          qty: item.quantity,
          price: formattedPrice,
          route_product_status: "Pending",
          remarks: " ",
          product_remarks: item?.product_remarks ? item?.product_remarks : "",
          loaded_uom: item?.loaded_uom ? item?.loaded_uom : "",
          total_weight: parseFloat(totalWeight).toFixed(2),
          edit_flag: item?.is_new ? 0 : 1
        };
      });
  
      var raw = {
        status: orderDetails?.status === "Collection Approved" ? 'CA' : 'MP',
        company: selectedCompanyId,
        product_list: lineItemsArray,
        bill_img:base64img ? base64img : [],
        site_address:siteAddress,
        payment_term:paymentTerms
      };
  
      console.log('Raw data before API call:', JSON.stringify(raw, null, 2));

      var requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: JSON.stringify(raw),
        redirect: "follow",
      };
  
      const response = await fetch(
        `https://gsidev.ordosolution.com/api/soorder_edit_v2/${orderDetails.id}/`,
        requestOptions
      );

      console.log("orderDetails.id",orderDetails.id)
      
      const result = await response.json();
      console.log("🚀 ~ EditOrderDetails ~ result:", result)
  
      if (result.error) {
        console.log('Error response from API:', result);
        setIsUpdating(false);
      } else {
        console.log('Success response from API:', result);
        Alert.alert("Successful", `Order ${orderDetails.name} Edited Successfully`, [
          {
            text: 'OK',
            onPress: () => {
              navigation.pop(2);
            }
          }
        ]);
      }
  
    } catch (error) {
      console.log("Edit Order API error", error);
      setIsUpdating(false);
    } finally {
      setLoading(false);
      setIsUpdating(false);
    }
  };
  

  const calculateTotalWeight = (item, tonnage) => {
    let totalWeight = 0;
    const length = parseFloat(item?.length || 0);
    const width = parseFloat(item?.width || 0);
    const thickness = parseFloat(item?.thickness || 0);
    const weight = parseFloat(item?.weight || 0);

    if (item?.loaded_uom === 'TONS') {
      totalWeight = tonnage * 1000;
    } else if (item?.loaded_uom === 'KGS') {
      totalWeight = tonnage;
    }else if (item.loaded_uom === 'FT') {
      return (tonnage * weight);
    }else if (item.loaded_uom === 'MTONS') {
      return tonnage * 0.907185 *1000 ;
    } else if (item?.loaded_uom === 'BUNDLE' ||item?.loaded_uom === 'PACKET') {
      totalWeight = tonnage * item.bundle_piece * weight;
    } else if (item?.loaded_uom === 'NOS') {
      totalWeight = tonnage * weight;
    } else if (item?.loaded_uom === 'MTR') {
      totalWeight = thickness * length * width * tonnage;
    }
    console.log(`Item ID: ${item.id}, Unit of Measure: ${item?.loaded_uom}, Calculated Weight: ${totalWeight}`);
    return totalWeight;
  };


const handleDropdownChange = (id, loaded_uom, name) => {
  setselectedItems((prevCartData) => {
    const updatedCartData = prevCartData.map((item) => {
      if (item.id === id) {
        return { ...item, loaded_uom };
      }
      return item;
    });
    return updatedCartData;
  });

};


  return (
    <View style={{ flex: 1, padding: 24, backgroundColor: "white" }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          {/* <AntDesign name='arrowleft' size={25} color={Colors.primary} /> */}
          <Image
            source={require("../../assets/images/Refund_back.png")}
            style={{ height: 30, width: 30, tintColor: Colors.primary }}
          />
        </TouchableOpacity>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          {screen === "PO" ? (
            <Text
              style={{
                fontSize: 20,
                color: Colors.primary,
                fontFamily: "AvenirNextCyr-Medium",
              }}
            >
              {orderDetails.name} ({orderDetails.supplier_name}-
              {orderDetails.supplier_id})
            </Text>
          ) : (
            <Text
              style={{
                fontSize: 20,
                color: Colors.primary,
                fontFamily: "AvenirNextCyr-Medium",
              }}
            >
              {orderDetails.name} ({orderDetails.assignee_name}-
              {orderDetails.assigne_to})
            </Text>
          )}
        </View>

        <View></View>
      </View>
      

      <View style={styles.card}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: "5%",
            paddingTop: "5%",
            alignItems: "center",
          }}
        >
          <Text style={styles.cardTitle}>Order Details</Text>
          <View
            style={{
              paddingHorizontal: "4%",
              paddingVertical: "2%",
              backgroundColor:
                orderDetails.status === "Collection Approved"
                  ? "orange"
                  : orderDetails.status === "Missing Product"
                  ? "tomato"
                  : "green",
              borderRadius: 20,
            }}
          >
            <Text
              style={{
                fontFamily: "AvenirNextCyr-Medium",
                fontSize: 14,
                color: "white",
              }}
            >
              {orderDetails.status === "Cancel"
                ? "Canceled"
                : orderDetails.status === "In Transit"
                ? "In Transit"
                : orderDetails.status}
            </Text>
          </View>
        </View>
 

        <View style={styles.expandedContent}>
          <View style={{ paddingHorizontal: "5%", paddingBottom: "2%" }}>
          <View style={[styles.row,{alignItems:'center'}]}>
              <Text style={[styles.title,{textAlign:"center"}]}>
                Bill To
              </Text>
            </View>
            <Dropdown
  style={{
    // width: '78%',
    height: 26,
    borderColor: 'black',
    borderBottomWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    color: "black",
    marginBottom:'3%'
  }}
  data={companyOptions}
  labelField="label"
  valueField="value"
  placeholder="Select a company"
  placeholderStyle={{ fontSize: 15, color: '#888' }}
  selectedTextStyle={{ fontSize: 15, color: 'black' }}
  itemTextStyle={{ fontSize: 15, color: 'black' }}
  inputSearchStyle={{ height: 30, fontSize: 14, color: 'black' }}
  value={selectedCompany}
  onChange={handleCompanyChange}
/>
            <View style={styles.row}>
              <Text style={styles.title}>Order ID</Text>
              <Text style={styles.value}>{orderDetails.name}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.title}>
                {screen === "PO" ? "Supplier" : "Customer"}
              </Text>
              <Text style={[styles.value,{textAlign:'right',width:'72%'}]}>
                {screen === "PO"
                  ? orderDetails.supplier_name
                  : orderDetails.assignee_name}
              </Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.title}>Order Placed</Text>
              <Text style={styles.value}>
                {ConvertDateTime(orderDetails?.created_at).formattedDate}{" "}
                {ConvertDateTime(orderDetails?.created_at).formattedTime}
              </Text>
            </View>
            <View style={{...styles.row}}>
                            <Text style={{...styles.title}}>Site Address</Text>
                            <Text style={{...styles.value,flex:1, textAlign: 'right'}} numberOfLines={2}>{orderDetails?.site_address}</Text>
                        </View>

                        <View style={{ ...styles.row }}>
                <Text style={{ ...styles.title }}>Order Image</Text>
                <TouchableOpacity onPress={() => setModalVisibleBill(true)}>
                    <Text style={{ ...styles.value,color:'blue' }}>
                        View
                    </Text>
                </TouchableOpacity>
            </View>

             <View style={styles.row}>
                         <Text style={styles.title}>Transportation type</Text>
                         <Text style={styles.value}>{orderDetails?.transportation_type}</Text>
                     </View>

            <View style={styles.row}>
              <Text style={styles.title}>Total Price</Text>
               <Text style={styles.value}>
                                         {parseFloat(orderDetails?.total_price).toFixed(2)? 
         new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(parseFloat(orderDetails?.total_price).toFixed(2)) : 
         new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(0)
       }</Text> 
            </View>

            {orderDetails.status == "Missing Product" && orderDetails?.remarks &&(
              <View style={styles.row}>
                <Text style={styles.title}>Remark :</Text>
                <Text
                  style={[
                    styles.value,
                    { color: "red", width: "80%", textAlign: "right" },
                  ]}
                >
                  {orderDetails.remarks}
                </Text>
              </View>
            )}

          </View>
        </View>
      </View>
      <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    // keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0} // Adjust this value as needed
    >

      <ScrollView
        style={[styles.card1, { marginBottom: "10%", paddingHorizontal: "3%" }]}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: "5%",
            paddingVertical: "3%",
            borderBottomWidth: 1,
            borderBottomColor: "grey",
          }}
        >
          <Text style={styles.cardTitle}>Products</Text>
          {(orderDetails.status === "Collection Approved" || orderDetails.status === "Missing Product") && 
          <TouchableOpacity
                        onPress={() => {
                             setModalVisible(true);
                        }}
                        style={{
                            paddingVertical: "2%",
                            paddingHorizontal: "3%",
                            backgroundColor: '#65A765',
                            borderRadius: 10,
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Text style={{ color: "white", fontFamily: "AvenirNextCyr-Bold" }}>
                            ADD  <FontAwesome5 name="plus" color="white" size={12} />
                        </Text>
                    </TouchableOpacity>}
                </View>

        <View style={styles.ProductListContainer}>
       
          <FlatList
            showsVerticalScrollIndicator={false}
            data={selectedItem}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <View style={styles.elementsView}>
                <View
                  style={{ flexDirection: "row", justifyContent: "center" }}
                >
      <Pressable style={{}}>
      <TouchableOpacity style={{  position: 'absolute',
    top: -5,
    left: 0,
    zIndex: 1,
    display: selectedItem.length === 1 ? 'none' : 'flex',}}
    onPress={() => removeProductFromCart(item)}
    >
        <AntDesign
          name="closecircle"
          size={20}
          color="tomato"
          onPress={() => removeProductFromCart(item)}
        />
      </TouchableOpacity>
      {item.product_image && item.product_image.length > 0 ? (
        <Image
          source={{uri: item.product_image.startsWith("http")
          ? item.product_image
          : `https://gsidev.ordosolution.com${item.product_image}`,
      }}
          style={styles.imageView}
        />
      ) : (
        <Image
          source={require("../../assets/images/noImagee.png")} 
          style={styles.imageView}
        />
      )}
    </Pressable>
                  <View
                    style={{
                      flex: 1,
                      paddingLeft: 15,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      
                      }}
                    >
                      <Text
                        style={{
                          color: Colors.primary,
                          fontSize: 14,
                          fontFamily: "AvenirNextCyr-Medium",
                          marginTop: 5,
                          width: "80%",
                        }}
                      >
                        {item.name}
                      </Text>
                    </View>

                                        {
                                            item?.product_remarks && (
                                            <View style={{ flexDirection: 'row',justifyContent:'space-between'}}>
                                                <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}>Product Remark :  </Text>
                                                <Text style={{ color: 'green', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium',width:'55%'}}>{item?.product_remarks}</Text>
                                            </View>
                                         )
                                        }

                                          <Text
                        style={{
                          color: 'black',
                          fontSize: 12,
                          fontFamily: "AvenirNextCyr-Medium",
                          marginTop: 1,
                        }}
                      >
                       Base UOM : {item.loaded_uom}
                      </Text>
                  </View>
                </View>
                <View
                                            style={{
                                                flexDirection: "row",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                marginTop: "4%",
                                               
                                            }}
                                        >
                                            <View>
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
                                                            // Log the formatted and raw text for debugging
                                                            // Call updatePrice with the integer part
                                                            updatePrice(item.id, text);
                                                        }}
                                                        // value={((item.price) * 100).toString()}
                                                        value={item?.cust_price?.toString()}
                                                        style={{ height: 40 ,color:'black'}}
                                                        keyboardType="numeric"
                                                        editable={false}
                                                    />
                                                    </View>
                                            </View>
                                            <View  style={{
                                                    flexDirection: "row",
                                                    alignItems: "center",
                                                    gap: 10,
                                                }}>
                                            <View
                                                style={{
                                                    flexDirection: "row",
                                                    alignItems: "center",
                                                    gap: 10,

                                                    
                                                }}
                                            >
                                                <TouchableOpacity
                                                    onPress={() => handleQuantityChange(item, 'decrement')} style={{}}
                                                >
                                                    <Entypo name="squared-minus" size={20} color="tomato" />
                                                </TouchableOpacity>
                                                <TextInput
                                                    style={{
                                                        fontSize: 14,
                                                        borderWidth: 1,
                                                        borderColor: "black",
                                                        fontFamily: "AvenirNextCyr-Medium",
                                                        width: 50,
                                                        textAlign: "center",
                                                        height: 26,
                                                        justifyContent: "center",
                                                        padding: 1,
                                                        color: "black",
                                                    }}
                                                    returnKeyType="done"
                                                    value={item.quantity !== '' ? item.quantity.toString() : ''}
                                                    onChangeText={(text) =>
                                                        handleQuantityChange(item, text)
                                                    }
                                                    keyboardType="decimal-pad" 
                                                />
                                                <TouchableOpacity
                                                    onPress={() => handleQuantityChange(item, 'increment')} style={{ justifyContent: 'center', alignItems: 'center' }}
                                                >
                                                    <Entypo name="squared-plus" size={20} color="green" />
                                                </TouchableOpacity>
                                            </View>
  
   
      <Dropdown
      style={{ height: 30, backgroundColor: 'white', marginVertical: 5, borderWidth: 0.5, borderColor: "gray", paddingLeft: 3 ,width:90}}
      placeholderStyle={{ fontSize: 14, color: 'black' }}
      selectedTextStyle={{ fontSize: 14 ,color:'black'}}
      inputSearchStyle={{ height: 30, fontSize: 14 ,color:'black'}}
      containerStyle={{ marginVertical: 5 }}
      data={item?.uom_list}
      search
      itemTextStyle={{ fontSize: 12,color:'black' }}
      maxHeight={400}
      labelField="label"
      valueField="value"
      placeholder="UOM"
      value={item.loaded_uom }
      onChange={(selectedItem) => handleDropdownChange(item.id, selectedItem.value,item?.name)}
    />
                     </View>
                    </View>
              </View>
            )}
            // keyExtractor={(item) => item.id.toString()}
          />
        </View>
      </ScrollView>

      </KeyboardAvoidingView>
      {(orderDetails.status === "Collection Approved" || orderDetails.status === "Missing Product") &&  (
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            onPress={() => {
              EditOrderDetails()
            }}
            style={{
              backgroundColor: "green" ,
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              paddingVertical: "3%",
              borderRadius: 20,
            }}
          >
             {isUpdating ? (
                  <ActivityIndicator size={28} color={Colors.white} />
                ) : (
             <Text style={styles.Btext}>Submit Changes</Text>
                )}
          </TouchableOpacity>
        </View>
      )}


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


      <Modal visible={modalVisibleBill} transparent={true}>
  <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', flex: 1, justifyContent: 'center' }}>
    <View style={{ backgroundColor: 'white', padding: '2%', borderRadius: 15, flex: 0.4, marginHorizontal: '3%' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ fontFamily: 'AvenirNextCyr-Medium', fontSize: 16 }}> </Text>
        <TouchableOpacity onPress={() => { setModalVisibleBill(false) }}>
          <AntDesign name="close" color="black" size={25} />
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1 }}>
        {orderDetails?.bill_img ? (
          <WebView
            source={{ uri: orderDetails?.bill_img }}
            style={{ flex: 1, borderRadius: 10 }}
            scalesPageToFit={true} 
            scrollEnabled={true} 
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            automaticallyAdjustContentInsets={false}
            useWebKit={true}
            mixedContentMode="compatibility"
            onLoadStart={() => console.log("Loading image...")}
            onLoadEnd={() => console.log("Image loaded")}
            androidHardwareAccelerationDisabled={true}
            allowFileAccess={true}
            allowsFullscreenVideo={true}
            allowsInlineMediaPlayback={true}
            allowsAirPlayForMediaPlayback={true}
            allowsBackForwardNavigationGestures={true}
          />
        ) : (
          <Text style={{ fontFamily: 'AvenirNextCyr-Medium', fontSize: 16, marginTop: '30%', color: 'black' ,textAlign:'center'}}>No Image</Text>
        )}
      </View>
    </View>
  </View>
</Modal>


    <LoadingView visible={loading} message="Please Wait ..." />
    </View>
  );
};

export default OrderRevStockDetailsEdit;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // marginBottom: 7
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  title: {
    fontFamily: "AvenirNextCyr-Medium",
    fontSize: 14,
    color:"black"
  },

  value: {
    fontFamily: "AvenirNextCyr-Medium",
    fontSize: 15,
    color:"black"
  },

  imageView: {
    width: 70,
    height: 70,
  },
  elementsView: {
    paddingVertical: "3%",
    borderBottomColor: "grey",
    borderBottomWidth: 0.5,
  },

  ProductListContainer: {
    flex: 1,
    marginVertical: "4%",
  },

  salesContainer: {
    marginHorizontal: 16,
    padding: 10,
    backgroundColor: Colors.white,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginVertical: 10,
    elevation: 5,
    ...globalStyles.border,
    borderRadius: 5,
    marginTop: 20,
  },
  total: {
    fontSize: 18,
    color: Colors.primary,
    fontFamily: "AvenirNextCyr-Medium",
  },
  label: {
    fontSize: 16,
    color: Colors.black,
    fontFamily: "AvenirNextCyr-Medium",
  },
  performanceContainer: {
    marginHorizontal: 16,
    padding: 10,
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    marginVertical: 10,
    elevation: 5,
    ...globalStyles.border,
    borderRadius: 5,
  },
  heading: {
    fontSize: 22,
    color: Colors.primary,
    fontFamily: "AvenirNextCyr-Medium",
  },
  subHeading: {
    fontSize: 13,
    color: "grey",
    fontFamily: "AvenirNextCyr-Medium",
  },
  card: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginVertical: "5%",
    backgroundColor: "#F5F5F5",

    // flex:0.5
  },

  card1: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    // marginVertical: '5%',
    backgroundColor: "#F5F5F5",

    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontFamily: "AvenirNextCyr-Bold",
    color:"black"

  },
  expandedContent: {
    marginTop: 20,
  },
  avatarImageContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderColor: "grey",
    borderWidth: 1,
    width: 80,
    height: 80,
    borderRadius: 50,
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40, 
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
    width:'95%',
    backgroundColor: "white",
    borderRadius: 10,
    paddingVertical: 30,
    paddingHorizontal: 10,

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
  inputView: {
    width: "100%",
    borderWidth: 1,
    backgroundColor: "white",
    borderRadius: 8,
    height: "2%",
    marginBottom: 20,
    justifyContent: "center",
    padding: 20,
    paddingLeft: 5,
  },
  inputView1: {
    width: "100%",
    borderWidth: 1,
    backgroundColor: "white",
    borderRadius: 8,
    height: 100,
    // marginBottom: 20,
    // justifyContent: "center",
    // padding: 20,
    paddingLeft: 5,
  },
  inputText: {
    height: 50,
    color: "black",
    fontFamily: "AvenirNextCyr-Medium",
  },
  inputText1: {
    fontFamily: "AvenirNextCyr-Medium",
    color: "black",
    // height: 500,
  },
  addressInput: {
    // height: 100, // Adjust the height as needed for your design
  },
  TwoButtons: {
    width: "48%",
    paddingVertical: "4%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
  },
  Btext: {
    color: "white",
    fontFamily: "AvenirNextCyr-Bold",
    fontSize: 17,
  },
  button: {
    backgroundColor: "transparent",
  },
  selectedButton: {
    backgroundColor: Colors.primary,
  },
  label: {
    fontSize: 13,
    color: Colors.black,
    fontFamily: "AvenirNextCyr-Medium",
  },
  selectedLabel: {
    fontSize: 13,
    color: "white",
    fontFamily: "AvenirNextCyr-Medium",
  },
  description: {
    marginTop: 10,
    color: "#6C757D",
    fontSize: 14,
    marginHorizontal: "1%",
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
    color:'black'
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
    color: "black",
  },
    noDataText: {
    textAlign: "center",
    marginTop: 20,
    color: "grey",
    fontSize: 16,
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
    ModalText1: {
    fontSize: 14,
    fontFamily: 'AvenirNextCyr-Bold',
    paddingBottom: 5,
    color:Colors.primary,
    flex:1
  },
    closeIcon: {
    position: 'absolute',
    top: 5,
    right: 10,
    padding: 5,
  },
       buttonContainer: {
        height: 40,
        padding: 10,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor:'#65A765',
        marginRight:'5%',
        width:'30%',
        flexDirection:'row',
        gap:3
      },
      buttonText: {
        fontFamily: "AvenirNextCyr-Bold",
        color: "white",
      },
});
