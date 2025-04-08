import React, { useContext, useEffect, useState,useRef, useCallback,
  useMemo, } from "react";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { AuthContext } from "../../Context/AuthContext";
import {
  View,
  Dimensions,
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
  ActivityIndicator,
  KeyboardAvoidingView
} from "react-native";
import { BarChart } from "react-native-gifted-charts";
import Colors from "../../constants/Colors";
import uniqolor from "uniqolor";
import { useFocusEffect } from "@react-navigation/native";
import { Image } from "react-native-animatable";
import { MapView } from "@rnmapbox/maps";
import PercentageCircle from "react-native-percentage-circle";
import { PieChart } from "react-native-gifted-charts";
import globalStyles from "../../styles/globalStyles";
import style from "../AddShelfDisplay/style";
import { cameraPermission } from "../../utils/Helper";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import ImageResizer from "@bam.tech/react-native-image-resizer";
import RNFS from "react-native-fs";
import AntDesign from "react-native-vector-icons/AntDesign";
import Entypo from "react-native-vector-icons/Entypo";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";
import moment from "moment";
import ConvertDateTime from "../../utils/ConvertDateTime";
import LinearGradient from "react-native-linear-gradient";
import { Checkbox,Searchbar } from "react-native-paper";
import { TextInput as TextInput1 } from "react-native-paper";
import { ProgressDialog } from "react-native-simple-dialogs";
import Toast from "react-native-simple-toast";
import { SegmentedButtons } from "react-native-paper";
import { searchItem } from "../../utils/Search";
import { debounce } from "../../utils/Search";
import  Ionicons  from 'react-native-vector-icons/Ionicons';
import { LoadingView } from "../../components/LoadingView";
import { MaskedTextInput } from "react-native-mask-text";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Dropdown } from 'react-native-element-dropdown';
import { SwipeListView } from 'react-native-swipe-list-view';
import { AnimatedFAB } from "react-native-paper";
import Comments from '../../components/Comments';
import { WebView } from 'react-native-webview';


const DispatchOrderDetails = ({ navigation, route }) => {

  const orderDetail = route.params?.orderDetails;
  console.log("🚀 ~ OrderRevStockDetails ~ orderDetail:", orderDetail)
  const [orderDetails, setOrderDetails] = useState(orderDetail);
  const screen = route.params?.screen;
  const [expanded, setExpanded] = useState(false);
  const [expanded1, setExpanded1] = useState(false);
  const [products1, setProducts1] = useState(
    route?.params?.orderDetails?.product_list
  );
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0); 
  const { userData } = useContext(AuthContext);
  const [visible, setVisible] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAnyProductUnavailable, setIsAnyProductUnavailable] = useState(false);
  const [error, setError] = useState("");
  const [value, setValue] = useState("1");
  const [conRemarks, setConRemarks] = useState("");
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
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState(null);
  const [rowData, setRowData] = useState([]);
  const [productSearch, setProductSearch] = useState("");
  const [productsBySubCategory, setProductsBySubCategory] = useState({});
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [dropdownItems, setDropdownItems] = useState([]);
  const [dropdownItemsAdd, setDropdownItemsAdd] = useState([]);

  const [modalVisible1, setModalVisible1] = useState(false);
  const [driverName, setDriverName] = useState('');
  const [vehicleNo, setVehicleNo] = useState('');
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [rows, setRows] = useState([]);
  const [selectedItemName, setSelectedItemName] = useState('');
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUpdating1, setIsUpdating1] = useState(false);
  const [checkedItems, setCheckedItems] = useState(rows.map(() => true));
  const [stockTotalQty, setStockTotalQty] = useState(0);
  const [selectedItemRemain, setSelectedItemRemain] = useState('');
  const [expandedOrder, setExpandedOrder] = useState(null); 
  const [isCommentsModalVisible, setIsCommentsModalVisible] = useState(false);
  const [modalVisibleBill, setModalVisibleBill] = useState(false);
  const [DispatchRemarks, setDispatchRemarks] = useState("");
  const [visible1, setVisible1] = useState(false);


const toggleExpand = (orderId) => {
    setExpandedOrder(orderId === expandedOrder ? null : orderId); 
  };

  const deleteRow = (index) => {
    const newRows = [...rows];
    newRows.splice(index, 1);
    setRows(newRows);
    
    const newSelectedOptions = [...selectedOptions];
    newSelectedOptions.splice(index, 1);
    setSelectedOptions(newSelectedOptions);
  };

  const handleDropdownChangeAdd = (item, index) => {
    const newRows = [...rows];
    newRows[index].dropdownValue = item.value;
    setRows(newRows);

    const newSelectedOptions = [...selectedOptions];
    newSelectedOptions[index] = item.value;
    setSelectedOptions(newSelectedOptions);
  };

 const updateQty = (index, newQty) => {
  // Allow decimal input directly, without trimming during input
  const trimmedQty = newQty.trim();

  setRows(prevRows => {
    const updatedRows = prevRows.map((item, idx) => {
      if (idx === index) {
        return {  ...item, 
          qty: trimmedQty, 
          isSelected: trimmedQty ? true : false 
        };
      }
      return item;
    });
    return updatedRows;
  });

  // Now perform validation after the user has entered the value
  const parsedQty = parseFloat(trimmedQty);

  // If the value is invalid or empty, reset it
  if (trimmedQty === '' || isNaN(parsedQty)) {
    setRows(prevRows => {
      const updatedRows = prevRows.map((item, idx) =>
        idx === index ? { ...item, qty: '' } : item
      );
      updateStockTotalQty(updatedRows); // Update total quantity
      return updatedRows;
    });
    return;
  }

  // Check for negative or zero values
  // if (parsedQty <= 0) {
  //   Alert.alert("Invalid Quantity", "Quantity must be greater than 0.");
  //   return;
  // }

  // Perform originalQty validation
  setRows(prevRows => {
    const updatedRows = prevRows.map((item, idx) => {
      if (idx === index) {
        if (parsedQty > item.originalQty) {
          Alert.alert("Invalid Quantity", `Quantity cannot exceed ${item.originalQty}.`);
          return { ...item, qty: item.originalQty.toString() }; // Ensure string formatting
        }
        return { ...item, qty: trimmedQty }; // Keep the float as string
      }
      return item;
    });

    updateStockTotalQty(updatedRows); // Update total quantity after changing qty
    return updatedRows;
  });
};

const updateStockTotalQty = (rows) => {
  console.log("🚀 ~ updateStockTotalQty ~ rows:", rows)
  const totalQty = rows
    .filter(item => item.isSelected)
    .reduce((sum, item) => sum + (parseFloat(item.qty) || 0), 0);

  setStockTotalQty(totalQty);
};

const saveRowsToSelectedItem = () => {
 // Filter selected rows first and check if any of the selected rows have empty qty
const isAnySelected = rows.some(row => row.isSelected);

if (!isAnySelected) {
  // If no rows are selected, check for empty qty in all rows
  const hasEmptyQty = rows.some(row => row.qty === '' || row.qty === null || row.qty === undefined);
  
  if (hasEmptyQty) {
    Alert.alert("Warning", "Quantity cannot be empty. Please fill in all quantities.");
    return; // Exit early if any qty is empty and no rows are selected
  }
} else {
  // If some rows are selected, check only those selected rows for empty qty
  const hasEmptyQtyInSelected = rows
    .filter(row => row.isSelected)
    .some(row => row.qty === '' || row.qty === null || row.qty === undefined);

  if (hasEmptyQtyInSelected) {
    Alert.alert("Warning", "Quantity cannot be empty. Please fill in all quantities for selected rows.");
    return; // Exit early if any qty in the selected rows is empty
  }
}


  // Check if the total quantity exceeds the required quantity
  if (stockTotalQty > selectedItemRemain) {
    Alert.alert("Warning", "You have ordered more than the required quantity.");
    return; // Exit early if the warning is triggered
  }

  if (stockTotalQty < selectedItemRemain) {
    Alert.alert("Warning", "The ordered quantity is less than the required minimum.");
    return;
  }

  // Save the updated rows with the entered qty
  setselectedItems((prevItems) => {
    return prevItems.map(item => {
      if (item.id === selectedItemId) {
        return { ...item, product_array: rows };
      }
      return item;
    });
  });

  // Close the modal if no warning is triggered
  setModalVisible1(false);
};


const toggleCheckbox = (index) => {

  setRows(prevRows => {
    const updatedRows = prevRows.map((item, idx) => {
      if (idx === index) {
        return { ...item, isSelected: !item.isSelected };
      }
      return item;
    });

    // Update stockTotalQty
    updateStockTotalQty(updatedRows);

    return updatedRows;
  });
};


  
  // renderHiddenItem function to include the checkbox logic
  const renderHiddenItem = (data, rowMap) => (
    <View style={styles.rowBack}>
      <View style={styles.backRightBtn1}>
        {/* <Checkbox.Android
          status={data.item.isSelected ? 'checked' : 'unchecked'}
          onPress={() => toggleCheckbox(data.index)}
        /> */}
      </View>
    </View>
  );

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

  const ModelVisible = (uom, id ,name,remain) => {
    setSelectedItemId(id)
    const selectedItem = dropdownItems.find(item => item?.label === uom);
    FetchData(id,selectedItem?.id)
    setSelectedItemName(name)
    setSelectedItemRemain(remain);
  };


  const FetchData = async (id, uom) => {
  console.log("🚀 ~ FetchData ~ id:", id)

    
  setIsUpdating(prevState => ({ ...prevState, [id]: true }));
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", `Bearer ${userData.token}`);

  const raw = "";
  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };
  console.log("🚀 ~ FetchData ~ requestOptions:", requestOptions)

  fetch(`https://gsidev.ordosolution.com/api/product-stock/?product_id=${id}&uom=${uom}`, requestOptions)
    .then((response) => {
      return response.json()
    })
    
    .then(async (result) => {
      console.log("🚀 ~ .then ~ result:", result)
      if (result.error) {
        Alert.alert("Sorry", "No Products Available");
        setIsUpdating(prevState => ({ ...prevState, [id]: false }));
      } else {
        setModalVisible1(true);
        setIsUpdating(prevState => ({ ...prevState, [id]: false }));

        const initializedRows = result?.map(item => ({
          ...item,
          isSelected: false,
          originalQty: item.qty ,
          stock: item.qty,
          qty:'',
          batch_code:item.batch_code
        }));
        setRows(initializedRows);
       
      }
    })
    .catch((error) => {
      setIsUpdating(prevState => ({ ...prevState, [id]: false }));
      Alert.alert("Sorry", "No Products Available");
      console.log("error", error);
    });
};


    const getLabelById = (id) => {
      const item = dropdownItems.find((dropdownItem) => dropdownItem.id === id);
      return item ? item.label : '';
    };
    

   useEffect(() => {
    const checkIfAnyProductUnavailable = () => {
      setIsAnyProductUnavailable(
        selectedItem.some((product) => !product?.is_available)
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

    const result = await response.json(); 

    if (offset === 0) {
      setCategories(result);
      setOriginalCategories(result); 
    } else {
      setCategories((prevData) => [...prevData, ...result]);
      setOriginalCategories((prevData) => [...prevData, ...result]); 
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
        <Entypo name={expandedSubCategory === subcategoryId ? 'chevron-up' : 'chevron-down'} size={20} color='black' />
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
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <Text
                                style={{
                                    color: Colors.primary,
                                    fontSize: 12,
                                    fontFamily: "AvenirNextCyr-Medium",
                                }}
                            >
                                Stock: {item.stock}{" "}
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
                    loaded_uom:item?.unit_of_measure,
                    thickness:item?.thickness,
                    weight:item?.weight,
                    width:item?.width,
                    bundle_piece:item?.bundle_piece,
                    length:item?.length
                },
            ];
        }
    });
};


const handleQuantityChange = (item, action) => {
    let numericValue = parseInt(item.quantity);

    if (action === 'increment') {
        // Increment quantity by 1 and reset stockError
        item.quantity = numericValue + 1;
        item.stockError = false;
        setselectedItems([...selectedItem]); // Trigger state update by creating a new reference
    } else if (action === 'decrement' && numericValue > 1) {
        // Decrement quantity by 1 and reset stockError
        item.quantity = numericValue - 1;
        item.stockError = false;
        setselectedItems([...selectedItem]); // Trigger state update by creating a new reference
    } else if (action === '') {
        // Handle the case when the input field is cleared
        item.quantity = '';
        setselectedItems([...selectedItem]); // Trigger state update by creating a new reference
    } else if (!isNaN(action) && action >= 0) {
        // Update quantity to the entered value and reset stockError
        item.quantity = parseInt(action);
        item.stockError = false;
        setselectedItems([...selectedItem]); // Trigger state update by creating a new reference
    } else if (isNaN(numericValue) || numericValue < 1) {
        // Set quantity to 1 and reset stockError
        item.quantity = 1;
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

  const handleToggleCheckbox = (item) => {
  console.log("🚀 ~ handleToggleCheckbox ~ item:", item)

    
    if (item.is_available && orderDetails?.status === "Stock Approved") {
      setVisible(true);
      setCurrentProduct(item);
    } else if (item.is_available && orderDetails?.status === "Missing Product"){
      updateProductAvailability(item, false, "");
    }else {
      updateProductAvailability(item, true, "");
    }
  };

  const updateProductAvailability = (item, isAvailable, remarks) => {
  if(orderDetails?.status === "Stock Approved"){
       setselectedItems((prevProducts) => {
      return prevProducts.map((product) =>
        product.id === item.id
          ? { ...product, is_available: isAvailable, remarks: remarks }
          : product
      );
    });
     }else{
      setselectedItems((prevProducts) => {
        return prevProducts.map((product) =>
          product.id === item.id
            ? { ...product, is_available: isAvailable, remarks: remarks }
            : product
        );
    });
     }
  };


  const checkEmpty = () => {
    let allStockLoaded = true;
  
    for (const item of selectedItem) {
      if (!item.product_array || item.product_array.length === 0) {
        allStockLoaded = false;
        alert("Stock is not loaded for product: " + item.name);
        return;
      }
    }
  
    if (allStockLoaded) {
      changeStatus("Confirmed");
    }
  };
  

  const changeStatus = async (status) => {
    // Display a confirmation dialog
    Alert.alert(
      status === "Missing Product" ? "Confirm Rejection" : "Confirm Approve",
      status === "Missing Product"
        ? `You have marked ${unavailableCount} products missing. Confirming would notify sales team. Do you wish to proceed?`
        : "Are you sure want to Confirm this Order. Please note order cannot be edited further",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            let url = `https://gsidev.ordosolution.com/api/sales_order/${orderDetails?.id}/`;
            setLoading(true);
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", `Bearer ${userData.token}`);
          
            if (status === "Missing Product") {
              so_raw = JSON.stringify({
                status: status,
                company:orderDetail?.company,
                product_status: selectedItem.map((product) => ({
                  id: product.idd,
                  is_available: product.is_available,
                  remarks: product.is_available ? "" : product.remarks,
                })),
              });
            } else {
    so_raw = JSON.stringify({
    status: status,
    stock_approve_by :userData.id,
    company:orderDetail?.company,
    product_status: selectedItem.map(product => ({
      id: product.idd ? product.idd : product.id,
      is_available: true,
      stock_comments: product?.remarks,
      stock_array: product?.product_array
        ? product?.product_array
            .filter(item => item?.isSelected) 
            .map(item => ({
              id: item?.stock_id, 
              qty: parseInt(item?.qty)
            }))
        : []
    })),
  });
            }

            var requestOptions = {
              method: "PUT",
              headers: myHeaders,
              body: so_raw,
              redirect: "follow",
            };

            console.log("Rawwww------------->",so_raw)

            await fetch(url, requestOptions)
              .then((response) => {
                if (response.status === 200) {
                  Toast.show("Order updated successfully", Toast.LONG);
                  setVisible(false);
                  getOrderDetails();
                  navigation.goBack();
                }
              })

              .catch((error) => console.log("api error", error));
            setLoading(false);
          },
        },
      ]
    );
  };

  console.log("dis",DispatchRemarks)


  const moveToCollection = () => {
     if (!DispatchRemarks.trim()) {
      // If remarks are not present, show alert asking to fill the remarks
      Alert.alert(
        "Missing Remarks",
        "Please fill in the remarks",
        [{ text: "OK" }]
      );
      return;
    }
    setVisible1(false);
        // Display a confirmation dialog
        Alert.alert("Release Stock", "The stock is released from this Sales Order. Could you please confirm this action?", [
            {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed",orderDetails?.id),
                style: "cancel",
            },
            {
                text: "Yes",
                onPress: () => {
                  setIsUpdating1(true);
                    var myHeaders = new Headers();
                    myHeaders.append("Content-Type", "application/json");
                    myHeaders.append("Authorization", `Bearer ${userData.token}`);
                    var raw = JSON.stringify({
                         sales_order_id:orderDetails?.id,
                         status:"Collection Approved",
                         dispatch_remarks: DispatchRemarks
                    });
                    var requestOptions = {
                        method: "POST",
                        headers: myHeaders,
                        body: raw,
                        redirect: "follow",
                    };
                    fetch(
                        `https://gsidev.ordosolution.com/api/stock_to_collection/`,
                        requestOptions
                    )
                        .then((response) => {
                            console.log("🚀 ~ .then ~ response:", response)
                            if (response.status === 200) {
                                Toast.show("Order moved to Stock team", Toast.LONG);
                                setIsUpdating1(false);
                                navigation.goBack();
                            }else{
                               setIsUpdating1(false);
                            }
                        })
                        .catch((error) => {console.log("api error", error); setIsUpdating1(false);});
                },
            },
        ]);
    };


  const EditOrderDetails = async () => {

    // setLoading(true);
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${userData.token}`);

    const lineItemsArray = selectedItem.map(item => {
      const totalWeight = calculateTotalWeight(item, item.quantity || 0);
      return {
        product_id: item.id ? item.id : item.id,
        qty: item.quantity.toString(),
        price: parseFloat(item?.price.replace(/[^0-9.-]+/g, "")).toFixed(2),
        route_product_status: "Pending",
        remarks: " ",
        product_remarks: item?.product_remarks ? item?.product_remarks : "",
        loaded_uom: item?.loaded_uom ? item?.loaded_uom : "",
        total_weight: parseFloat(totalWeight).toFixed(2)
      };
    });

  
  var raw = {
    status: 'CA',
    product_list: lineItemsArray,
  };


    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: JSON.stringify(raw),
      redirect: "follow",
    };

    await fetch(
      `https://gsidev.ordosolution.com/api/soorder-edit/${orderDetails.id}/`,
      requestOptions
    )
      .then((response) => response.json())
      .then(async (result) => {

      })
      .catch((error) => console.log("Edit Order Api error", error));
    // setLoading(false);
  };
  

  const calculateTotalWeight = (item, tonnage) => {
    let totalWeight = 0;
    const widthMM = item.width / 1000;
    
    if (item?.loaded_uom === 'TONS') {
      totalWeight = tonnage * 1000;
    } else if (item?.loaded_uom === 'KGS') {
      totalWeight = tonnage;
    }else if (item.loaded_uom === 'MTONS') {
      return tonnage * 0.907185 *1000 ;
    } else if (item.loaded_uom === 'FT') {
      return (tonnage * item.weight);
    }else if (item?.loaded_uom === 'BUNDLE' || item?.loaded_uom === 'PACKET') {
      totalWeight = tonnage * item.bundle_piece * item.weight;
    } else if (item?.loaded_uom === 'NOS') {
      totalWeight = tonnage * item.weight;
    } else if (item?.loaded_uom === 'MTR') {
      totalWeight = item.thickness * item.length * item.width * tonnage;
    }
    console.log(`Item ID: ${item.id}, Unit of Measure: ${item?.loaded_uom}, Calculated Weight: ${totalWeight}`);
    return totalWeight;
  };

  const getOrderDetails = async () => {
    setLoading(true);
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "text/plain");
    myHeaders.append("Authorization", `Bearer ${userData.token}`);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    await fetch(
      `https://gsidev.ordosolution.com/api/sales_order/${orderDetails.id}/`,
      requestOptions
    )
      .then((response) => response.json())
      .then(async (result) => {
        setOrderDetails(result);
      })
      .catch((error) => console.log("getOrderDetails api error", error));
    setLoading(false);
  };

  const handleReject = () => {
    changeStatus("Missing Product");
  };

  const handleSubmit = () => {
    if (value === "1" && remarks.trim() === "") {
      setError("Please enter remarks");
    } else if (value === "2" && conRemarks.trim() === "") {
      setError("Please enter remarks");
    } else if (currentProduct) {
      if (value === "1") {
        updateProductAvailability(currentProduct, false, remarks);
        setRemarks("");
      } else if (value === "2") {
        updateProductAvailability(currentProduct, true, conRemarks);
        setConRemarks("");
      }
      setVisible(false);
      setError("");
    }
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

 if (loaded_uom === 'BUNDLE' || loaded_uom === 'PACKET') {
      setSelectedItemId(id); // Store the selected item's id
      setSelectedItemName(name); // Set the selected item's name
      setModalVisible1(true);
    }
};



  const requestPDF = () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "text/plain");

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(orderDetails.invoice_file, requestOptions)
      .then((response) => {
        const url = response.url; // Get the direct URL from the response
        console.log("pdf api res", url);
        // Navigate to PDFViewer and pass the URL
        navigation.navigate("PDFViewer", { title: "Dummy PDF", url: url });
      })
      .catch((error) => console.log("pdf api error", error));
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
          style={{ flex: 1, justifyContent: "center", alignItems: "center"}}
        >
          {screen === "PO" ? (
            <Text
              style={{
                fontSize: 20,
                color: Colors.primary,
                fontFamily: "AvenirNextCyr-Medium",
                 flex:1,
                textAlign:'center'
               
              }}
              numberOfLines={2}
              
            >
              {orderDetails?.name} ({orderDetails?.supplier_name}-
              {orderDetails?.supplier_id})
            </Text>
          ) : (
            <View
          style={{ flexDirection:'row' }}
        >
            <Text
              style={{
                fontSize: 20,
                color: Colors.primary,
                fontFamily: "AvenirNextCyr-Medium",
                flex:1,
                textAlign:'center'
              }}
              numberOfLines={2}
            >
              {orderDetails?.name} ({orderDetails?.assignee_name}-
              {orderDetails?.assigne_to})
            </Text>
         

            </View>
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
                orderDetails?.status === "Stock Approved"
                  ? "orange"
                  : orderDetails?.status === "Missing Product"
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
              {orderDetails?.status === "Cancel"
                ? "Canceled"
                : orderDetails?.status === "In Transit"
                ? "In Transit"
                : orderDetails?.status}
            </Text>
          </View>
        </View>

        <View style={styles.expandedContent}>
          <View style={{ paddingHorizontal: "5%", paddingBottom: "2%" }}>
          <View style={styles.row}>
              <Text style={styles.title}>
                Bill to
              </Text>
              <Text style={[styles.value,{textAlign:'right',width:'72%'}]}>
                {orderDetails?.company_name}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.title}>Order ID</Text>
              <Text style={styles.value}>{orderDetails?.name}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.title}>
                {screen === "PO" ? "Supplier" : "Customer"}
              </Text>
              <Text style={[styles.value,{textAlign:'right',width:'72%'}]}>
                {screen === "PO"
                  ? orderDetails?.supplier_name
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

            {/* <View style={styles.row}>
              <Text style={styles.title}>Total Qty</Text>
              <Text style={styles.value}>{totalQuantity}</Text>
            </View> */}

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


            {orderDetails.status == "Confirmed" &&
            <View style={styles.row}>
              <Text style={styles.title}>Approved By</Text>
               <Text style={styles.value}>{orderDetails?.stock_approve_name}</Text> 
            </View>
           }

<View style={styles.row}>
              <Text style={styles.title}>Total Price</Text>
               <Text style={styles.value}>{orderDetails?.total_price?
         new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(orderDetails?.total_price)) :
         new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(0)
       }</Text> 
            </View>

            {/* <TouchableOpacity style={{backgroundColor:'red',width:40,height:40}} onPress={()=>{EditOrderDetails()}}> </TouchableOpacity> */}

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

            {/* {orderDetails.status === "Confirmed" && (
              <View style={styles.row}>
                <Text style={styles.title}> </Text>
                <TouchableOpacity
                  onPress={() => requestPDF()}
                  style={{
                    ...styles.value,
                    marginTop: "1%",
                    flexDirection: "row",
                    gap: 5,
                  }}
                >
                  <AntDesign name="filetext1" color="#000C66" size={20} />
                  <Text
                    style={{
                      fontSize: 18,
                      color: "#000C66",
                      fontFamily: "AvenirNextCyr-Bold",
                    }}
                  >
                    Invoice
                  </Text>
                </TouchableOpacity>
              </View>
            )} */}
          </View>
        </View>
      </View>

      <View
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
        
          <TouchableOpacity
                        onPress={() => {
                          setIsCommentsModalVisible(true);
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
                            Comments
                        </Text>
                    </TouchableOpacity>
                   
        </View>

        <View style={styles.ProductListContainer}>
         {orderDetails.status === "Stock Approved" || orderDetails.status === "Missing Product"  ?

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
    {/* <TouchableOpacity style={{  position: 'absolute',
  top: -5,
  left: 0,
  zIndex: 1}}
  onPress={() => removeProductFromCart(item)}
  >
      <AntDesign
        name="closecircle"
        size={20}
        color="tomato"
        onPress={() => removeProductFromCart(item)}
      />
    </TouchableOpacity> */}
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

                     {/* <Text
                      style={{
                        color: 'black',
                        fontSize: 12,
                        fontFamily: "AvenirNextCyr-Medium",
                        marginTop: 1,
                      }}
                    >
                     Loaded UOM : {item?.loaded_uom}
                    </Text> */}

                  {orderDetails.status == "Confirmed" && item.stock_comments && (
                     <View style={{ marginTop: "1%" }}>
                     <Text
                       style={{
                         color: "black",
                         fontSize: 13,
                         fontFamily: "AvenirNextCyr-Medium",
                       }}
                     >
                       Remarks: {item.stock_comments}
                     </Text>
                   </View>
                    )}
                  {item.remarks &&
                    <View style={{ marginTop: "1%" }}>
                      <Text
                        style={{
                          color: "black",
                          fontSize: 13,
                          fontFamily: "AvenirNextCyr-Medium",
                        }}
                      >
                        Remarks: {item.remarks}
                      </Text>
                    </View>
                 }
                </View>
              </View>
              <View
                                          style={{
                                              flexDirection: "row",
                                              justifyContent: "space-between",
                                              alignItems: "center",
                                          }}
                                      >
                                          <View  style={{
                                                  flexDirection: "row",
                                                  alignItems:"center",
                                                  gap: 2,
                                              }}>
  
                                              <Text style={{color: "black", fontSize: 14,}}>Required Qty:</Text>
                                              <TextInput
                                                  style={{
                                                      fontSize: 14,
                                                      fontFamily: "AvenirNextCyr-Medium",
                                                      textAlign: "center",
                                                      height: 26,
                                                      justifyContent: "center",
                                                      padding: 1,
                                                      color: "black",
                                                  }}
                                                  value={item.quantity !== '' ? item.quantity.toString() : "0"}
                                                  onChangeText={(text) =>
                                                      handleQuantityChange(item, text)
                                                  }
                                                  keyboardType="numeric"
                                                  editable={false}
                                              />
                     <Text
                      style={{
                        color: 'black',
                        fontSize: 12,
                        fontFamily: "AvenirNextCyr-Medium",
                      }}
                    >
                     {item?.loaded_uom}
                    </Text>

                            </View>
                              <TouchableOpacity style={{ height: 32,
                                paddingHorizontal: 5,
                                borderRadius: 10,
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor: item?.product_array?.length > 0 ? 'rgba(0, 128, 0, 0.6)'  :Colors.primary ,
                                flexDirection:'row',
                                gap:3}}  onPress={()=>{ModelVisible(item?.loaded_uom ,item?.product_id,item?.name,item?.quantity)}}  disabled={isUpdating[item?.product_id]}>
                                 {isUpdating[item.product_id] ? (
                                   <ActivityIndicator size="small" color="#fff" />
                                 ) : (
                                  <Text style={{color:'white', fontSize:11, fontFamily: "AvenirNextCyr-Bold"}}>{item?.product_array?.length > 0 ? 'Stock Added' :'Add Stock'}</Text>
                                 )}
                               </TouchableOpacity>
                             </View>

                             {item?.product_array && item?.product_array?.some(items => items?.isSelected) &&                              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' ,marginTop:2}}>
                <Text style={{ color: Colors.black, fontSize: 14, fontFamily: 'AvenirNextCyr-Bold',width:'85%' ,fontStyle: 'italic'}}>Products</Text>
                    {/* Ant Design arrow down icon */}
                    <Pressable onPress={() => toggleExpand(item.id)}>
                      <AntDesign name={expandedOrder === item.id ? 'up' : 'down'} size={20} color='black' />
                    </Pressable>
                  </View>
}


{ expandedOrder === item.id && (
                      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
  <View style={{ width: 500 }}>
    <View style={{ marginTop: 8 }}>
      {/* Heading Row */}
      <View style={{ ...styles.productContainer, borderBottomWidth: 0.7, borderColor: 'black', paddingVertical: 8 }}>
        <Text style={styles.productHeading}>Qty</Text>
        <Text style={styles.productHeading}>UOM</Text>
        <Text style={styles.productHeading}>Price</Text>
        {/* <Text style={styles.productHeading}>Weight</Text> */}
        <Text style={styles.productHeading}>Pieces</Text>
        <Text style={styles.productHeading}>Batch Code</Text>
      </View>

      {/* Product Rows */}
      {item?.product_array
          .filter(items => items?.isSelected) 
          .map((itemm, index) => (
            <View key={item.stock_id}>
          <View style={styles.productContainer}>
            <Text style={styles.productName}>{itemm?.qty}</Text>
            <Text style={styles.productName}>{getLabelById(itemm?.uom)}</Text>
            <Text style={styles.productName}>{itemm?.price}</Text>
            {/* <Text style={styles.productName}>{itemm?.total_weight}</Text> */}
            <Text style={styles.productName}>{itemm?.pieces}</Text>
            <Text style={styles.productName}>{itemm?.batch_code}</Text>
          </View>

          {/* Line between products except the last one */}
          {index < item?.product_array?.filter(itemm => itemm.isSelected).length - 1 && (
                <View style={styles.separator} />
              )}
        </View>
      ))}
    </View>
  </View>
</ScrollView>
                  )}

            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
        />
          :
          <FlatList
          showsVerticalScrollIndicator={false}
          data={products1}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <View style={styles.elementsView}>
              <View
                style={{ flexDirection: "row", justifyContent: "center" }}
              >
                <Pressable>
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
                </Pressable>
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
                      
                    {orderDetails.status !== "Confirmed" && (
                      <Checkbox.Android
                        color={Colors.primary}
                        status={item.is_available ? "checked" : "unchecked"}
                        onPress={() => handleToggleCheckbox(item)}
                      />
                    )}
                  </View>
                      <Text
                        style={{
                          color: "gray",
                          fontSize: 11,
                          fontFamily: "AvenirNextCyr-Medium",
                          marginTop:2
                        }}
                      >
                        {item?.product_category} 
                      </Text>
                   <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: "3%",
                      justifyContent: "space-between",
                    }}
                  >
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Text
                        style={{
                          color: "black",
                          fontSize: 12,
                          fontFamily: "AvenirNextCyr-Medium",
                        }}
                      >
                        Qty :{" "}
                      </Text>
                      <Text
                        style={{
                          color: "black",
                          fontSize: 12,
                          fontFamily: "AvenirNextCyr-Medium",
                        }}
                      >
                        {item?.qty} {item?.loaded_uom}
                      </Text>
                    </View>

                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Text
                        style={{
                          color: "black",
                          fontSize: 12,
                          fontFamily: "AvenirNextCyr-Medium",
                        }}
                      >
                        Price :{" "}
                      </Text>
                      <Text
                        style={{
                          color: "black",
                          fontSize: 12,
                          fontFamily: "AvenirNextCyr-Medium",
                        }}
                      >
                        {item.price}
                      </Text>
                    </View>
                  </View>

                  {orderDetails.status == "Confirmed" && item?.stock_comments && (
                     <View style={{ marginTop: "1%" }}>
                     <Text
                       style={{
                         color: "black",
                         fontSize: 13,
                         fontFamily: "AvenirNextCyr-Medium",
                       }}
                     >
                       Stock Remarks: {item?.stock_comments}
                     </Text>
                   </View>
                    )}
                </View>
              </View>
            </View>
          )}
          // keyExtractor={(item) => item.id.toString()}
        /> 
        }
        </View>
      </View>

    {orderDetails.status == "Stock Approved" && (
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <TouchableOpacity
            onPress={() => {
              setVisible1(true);
            }}

            style={[
              styles.TwoButtons,
              { backgroundColor: "orange" },
            ]}
          >
            {
              isUpdating1 ?
            <ActivityIndicator size="small" color="#fff" /> :
            <Text style={styles.Btext}>Release Stock</Text>
          }
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              checkEmpty();
            }}
            style={[
              styles.TwoButtons,
              { backgroundColor: !isAnyProductUnavailable ? "green" : "green" },
            ]}
          >
            <Text style={styles.Btext}>Confirm Order</Text>
          </TouchableOpacity>
        </View>
      )}

      {orderDetails.status == "Missing Product" && (
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            onPress={() => {
              if (!isAnyProductUnavailable) checkEmpty();
            }}
            style={{
              backgroundColor: !isAnyProductUnavailable ? "green" : "green",
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              paddingVertical: "3%",
              borderRadius: 20,
            }}
            disabled={isAnyProductUnavailable}
          >
            <Text style={styles.Btext}>Approve</Text>
          </TouchableOpacity>
        </View>
      )}

      <Modal visible={visible} transparent={true}>
        <View
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            flex: 1,
            justifyContent: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              padding: "4%",
              borderRadius: 15,
              marginHorizontal: "4%",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: "3%",
              }}
            >
              <Text></Text>
              <TouchableOpacity
                onPress={() => {
                  setVisible(false), setRemarks(" "), setError("");
                }}
              >
                <AntDesign name="close" color="black" size={20} />
              </TouchableOpacity>
            </View>
            <SegmentedButtons
              value={value}
              onValueChange={setValue}
              buttons={[
                {
                  value: "1",
                  label: "Reject Remarks",
                  style: value === "1" ? styles.selectedButton : styles.button,
                  labelStyle:
                    value === "1" ? styles.selectedLabel : styles.label,
                },
                {
                  value: "2",
                  label: "Stock Remarks",
                  style: value === "2" ? styles.selectedButton : styles.button,
                  labelStyle:
                    value === "2" ? styles.selectedLabel : styles.label,
                },
              ]}
            />

            <View style={{ marginVertical: "4%" }}>
              <TextInput1
                mode="outlined"
                label="Remarks"
                value={value === "1" ? remarks : conRemarks}
                theme={{ colors: { onSurfaceVariant: "#4b0482" } }}
                activeOutlineColor="#4b0482"
                outlineColor="#B6B4B4"
                textColor="#4b0482"
                multiline={true}
                numberOfLines={4}
                onChangeText={(text) => {
                  value === "1" ? setRemarks(text) : setConRemarks(text);
                }}
                returnKeyType="next"
                blurOnSubmit={false}
                outlineStyle={{ borderRadius: 10 }}
              />
              {error ? <Text style={{ color: "red" }}>{error}</Text> : null}
              <Text style={styles.description}>
                {value === "1"
                  ? "( Please provide detailed remarks for rejecting the product.)"
                  : "( Please provide detailed remarks about the product.)"}
              </Text>
            </View>
            <LinearGradient
              colors={Colors.linearColors}
              start={Colors.start}
              end={Colors.end}
              locations={Colors.ButtonsLocation}
              style={{
                borderRadius: 20,
              }}
            >
              <TouchableOpacity
                // onPress={() => { navigation.navigate('OrderReturn', { orderDetails: orderDetails }) }}
                onPress={handleSubmit}
                style={{
                  paddingVertical: "4%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ fontFamily: "AvenirNextCyr-Bold", color: "white" }}
                >
                  Submit
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>
      </Modal>

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

  <Modal visible={modalVisible1} transparent
  >
   <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  >
 
  <View style={styles.modalContainer1}>
    <View style={styles.modalContent1}>
      <TouchableOpacity
        style={styles.closeIcon}
        onPress={() => setModalVisible1(false)}
      >
        <AntDesign name="close" color="black" size={25} />
      </TouchableOpacity>

      <Text style={styles.ModalText1} numberOfLines={2}>{selectedItemName}</Text>
      <Text style={{color: 'green', fontSize: 14, fontWeight: '600'}}>Required Qty: {selectedItemRemain}</Text>

  <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ marginHorizontal: 5, marginTop: '3%', height: 200 }} vertical>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          // paddingLeft: '5%',
          alignItems: 'center',
          borderBottomWidth: 1,
          borderBottomColor: '#D3D3D3',
          marginTop: '2%',
        }}>
        </View>

         <ScrollView
              horizontal
  showsHorizontalScrollIndicator={false}
  contentContainerStyle={{ width:500}}
                >

        <View style={{ marginHorizontal: '1%', marginTop: '3%', gap: 1 }}>
          <View style={{
            flexDirection: 'row',
            marginBottom: 1,
            alignItems: 'center',
            gap: 5,
            // justifyContent: "space-between"
          }}>
            <Text style={{ fontSize: 13, fontWeight: 'bold', textAlign: 'center', color: 'black',width:"18%" }}>Req. Qty</Text>
            <Text style={{ fontSize: 13, fontWeight: 'bold', textAlign: 'center', color: 'black',width:"15%"}}>Stock</Text>
            <Text style={{ fontSize: 13, fontWeight: 'bold', textAlign: 'center', color: 'black',width:"15%"}}>UOM</Text>
            <Text style={{ fontSize: 13, fontWeight: 'bold', textAlign: 'center', color: 'black',width:"17%" }}>Pieces</Text>
            <Text style={{ fontSize: 13, fontWeight: 'bold', textAlign: 'center', color: 'black' ,width:"22%" }}>Batch code</Text>
          </View>

          {/* <ScrollView horizontal showsHorizontalScrollIndicator={false}> */}
            <View style={{ flexDirection: 'row', marginBottom: 10, alignItems: 'center', width: '100%', gap: 1}}>
             
             <FlatList
                data={rows}
                renderItem={({ item, index }) => (
                  <View key={index} style={{ flexDirection: 'row', marginBottom: 10, alignItems: 'center', width: '100%', gap: 1,}}>
                    <TextInput
                      style={{ width: 70, borderWidth: 1, borderColor: '#ccc', padding: 5, backgroundColor: '#fff', color: 'black', marginHorizontal: 3 }}
                      placeholder="Qty"
                      placeholderTextColor={'gray'}
                      keyboardType="numeric"
                      value={item?.qty?.toString() || ''}
                      onChangeText={(text) => updateQty(index, text)}
                      returnKeyType="done"
                    />

                    <TextInput
                      style={{ width: 60, borderWidth: 1, borderColor: '#ccc', padding: 5, backgroundColor: '#fff', color: 'black', marginHorizontal: 3 }}
                      placeholder="Stock"
                      placeholderTextColor={'gray'}
                      keyboardType="numeric"
                      value={item?.stock?.toString() || ''}
                      editable={false}
                    />

                    <TextInput
                      style={{ width: 67, borderWidth: 1, borderColor: '#ccc', padding: 5, backgroundColor: '#fff', color: 'black', marginHorizontal: 3 }}
                      placeholder="Uom"
                      placeholderTextColor={'gray'}
                      value={getLabelById(item?.uom)}
                      editable={false}
                    />

                    <TextInput
                      style={{ width: 63, borderWidth: 1, borderColor: '#ccc', padding: 5, backgroundColor: '#fff', color: 'black', marginHorizontal: 3 }}
                      placeholder="Pieces"
                      placeholderTextColor={'gray'}
                      keyboardType="numeric"
                      value={item?.pieces?.toString() || ''}
                      editable={false}
                    />

                    <TextInput
                      style={{ width: 90, borderWidth: 1, borderColor: '#ccc', padding: 5, backgroundColor: '#fff', color: 'black', marginHorizontal: 3 }}
                      placeholder="batch_code"
                      placeholderTextColor={'gray'}
                      keyboardType="numeric"
                      value={item?.batch_code?.toString() || ''}
                      editable={false}
                    />

                    <Checkbox.Android
                      status={item?.isSelected ? 'checked' : 'unchecked'}
                      onPress={() => toggleCheckbox(index)}
                    />
                  </View>
                )}
                // renderHiddenItem={renderHiddenItem}
                // rightOpenValue={-40}
                // previewRowKey={'0'}
                // previewOpenValue={-40}
                // previewOpenDelay={3000}
              />
            </View>
          {/* </ScrollView> */}
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
              marginTop: "4%",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                saveRowsToSelectedItem();
              }}
              style={{ paddingVertical: "4%", justifyContent: "center", alignItems: "center" }}
            >
              <Text style={{ fontFamily: "AvenirNextCyr-Bold", color: "white" }}>Submit</Text>
            </TouchableOpacity>
          </LinearGradient>
    </View>
  </View>
  </KeyboardAvoidingView>
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
          <Text style={{ fontFamily: 'AvenirNextCyr-Medium', fontSize: 16, marginTop: '30%', color: 'black',textAlign:'center' }}>No Image</Text>
        )}
      </View>
    </View>
  </View>
</Modal>


      <Modal visible={visible1} transparent={true}>
        <View
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            flex: 1,
            justifyContent: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              padding: "4%",
              borderRadius: 15,
              marginHorizontal: "4%",
            }}
          >
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text
                style={{ fontFamily: "AvenirNextCyr-Medium", fontSize: 16 ,color:Colors.black}}
              >
                Add Remarks
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setVisible1(false);
                }}
              >
                <AntDesign name="close" color="black" size={20} />
              </TouchableOpacity>
            </View>
            <View style={{ marginVertical: "4%" }}>
              <TextInput1
                mode="outlined"
                label="Remarks"
                value={DispatchRemarks}
                theme={{ colors: { onSurfaceVariant: "#4b0482" } }}
                activeOutlineColor="#4b0482"
                outlineColor="#B6B4B4"
                textColor="#4b0482"
                multiline={true}
                numberOfLines={4}
                onChangeText={(text) => setDispatchRemarks(text)}
                returnKeyType="next"
                blurOnSubmit={false}
                outlineStyle={{ borderRadius: 10 }}
              />
            </View>
            <LinearGradient
              colors={Colors.linearColors}
              start={Colors.start}
              end={Colors.end}
              locations={Colors.ButtonsLocation}
              style={{
                borderRadius: 20,
              }}
            >
              <TouchableOpacity
                onPress={()=>moveToCollection()}
                style={{
                  paddingVertical: "4%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                
                  <Text
                    style={{ fontFamily: "AvenirNextCyr-Bold", color: "white" }}
                  >
                    Submit
                  </Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>
      </Modal>

    <LoadingView visible={loading} message="Please Wait ..." />

          {isCommentsModalVisible && (
           <Comments
             route={{ params: { orderId: orderDetails?.id } }}
             isModal={true}
             onClose={() => setIsCommentsModalVisible(false)}
           />
          )}
    </View>
  );
};

export default DispatchOrderDetails;

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
    color:"black"
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
  },
  card1: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
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


  },itButton: {
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
      },  rowBack: {
        alignItems: 'center',
        flex: 1,
        // flexDirection: 'row',
        // justifyContent: 'space-between',
        // paddingLeft: 15,
      },
      backRightBtn: {
        alignItems: 'center',
        bottom: 10,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        // width: 75,
        right: 40,
      },backRightBtn1: {
        alignItems: 'center',
        bottom: 10,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        // width: 75,
        right: 0,
      }, closeIcon: {
        position: 'absolute',
        top: 5,
        right: 10,
        padding: 5,
      },checkboxContainer: {
        justifyContent: 'center', 
        alignItems: 'center', 
        flex: 1, 
      },
        productName: {
    color: Colors.black,
    fontSize: 13,
    fontFamily: 'AvenirNextCyr-Medium',
    flex: 1,
    flexWrap: 'wrap'
  },
  productQty: {
      flex: 1,
    textAlign: 'center',
    color: Colors.black,
    fontSize: 13,
    fontFamily: 'AvenirNextCyr-Medium',
    marginRight:10
  },
    productSeparator: {
    borderBottomWidth: 0.7,
    borderBottomColor: '#A9A9A9',
    marginVertical:'3%'
  },
   productValue: {
    flex: 1,
    textAlign: 'center',
     color: Colors.black,
    fontSize: 13,
    fontFamily: 'AvenirNextCyr-Medium',
    flexWrap: 'wrap'

  },
    productContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  productHeading: {
    color: Colors.black,
    fontSize: 13,
    fontFamily: 'AvenirNextCyr-Bold',
    flex:1
  }, fabStyle: {
    position: "absolute",
    right: "5%",
    bottom: "10%",
    backgroundColor: Colors.primary,
  },
});
