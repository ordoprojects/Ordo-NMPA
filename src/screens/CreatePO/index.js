import React, {
  useState,
  useContext,
  useRef,
  useEffect,
  useCallback,
  useMemo,

} from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Keyboard,
  Pressable,
  TouchableOpacity,
  ActivityIndicator,
  Text,
  Image,
  Alert,
  KeyboardAvoidingView,
  Modal,
  SafeAreaView,
  FlatList,
  ScrollView,
} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Colors from "../../constants/Colors";
import { AuthContext } from "../../Context/AuthContext";
import globalStyles from "../../styles/globalStyles";
import Entypo from "react-native-vector-icons/Entypo";
import {
  Searchbar,
  Checkbox,
  RadioButton,
  TextInput as TextInput1,
} from "react-native-paper";
import LinearGradient from "react-native-linear-gradient";
import { Fold, Wave } from "react-native-animated-spinkit";
import { searchItem } from "../../utils/Search";
import { debounce } from "../../utils/Search";
import  Ionicons  from 'react-native-vector-icons/Ionicons';
import { LoadingView } from "../../components/LoadingView";
import { Dropdown } from 'react-native-element-dropdown';

const CreatePO = ({ navigation, route }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { userData, token } = useContext(AuthContext);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const queryParams = useRef({ limit: 10, offset: 0 });
  const [searching, setSearching] = useState(false);
  const [expandedSubCategory, setExpandedSubCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [originalCategories, setOriginalCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [productSearch, setProductSearch] = useState("");
  const [productsBySubCategory, setProductsBySubCategory] = useState({});
  const [dropdownItems, setDropdownItems] = useState([]);
  const { item } = route.params;
  const [selectedCompany, setSelectedCompany] = useState(item?.company_id);
  const [companyOptions, setCompanyOptions] = useState([]);
  const [baseUOM, setBaseUOM] = useState('');
  const { ORDERID, screen } = route?.params;

  console.log('===============baseUOM=====================');
  console.log(JSON.stringify(item,null,2));
  console.log('===========================================');

  const [selectedItem, setselectedItems] = useState(
  screen === 'edit' 
    ? item?.product_list.map(product => ({
        ...product,
        stock_array: product.stock_array.map(stockItem => ({
          ...stockItem,
          price: (stockItem.price).toString(),
          total_weight: (stockItem.total_weight).toString(),
          unit_of_measure:product?.unit_of_measure
        }))
      }))
    : []
);

  const [totalPrice, setTotalPrice] = useState(item?.total_price);
  const [vehicleNo, setVehicleNo] = useState(item?.vehicle_no);
  const [driverName, setDriverName] = useState(item?.driver_name);
  const [refNum, setRefNum] = useState(item?.name);
  const [modalVisible1, setModalVisible1] = useState(false);

  const [selectedOptions, setSelectedOptions] = useState([]);
  const [rows, setRows] = useState([{ uom: null, price: '', total_weight: '', pieces: '',qty: '',batch_code:'' }]);
  const [selectedItemName, setSelectedItemName] = useState('');
  const [selectedItemUOM, setSelectedItemUOM] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(null);

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

 const addRow = () => {
    setRows([...rows, { uom: 4, price: '', total_weight: baseUOM ==='NOS'? '1' : '', pieces: '',qty: '',batch_code:'' }]);
  };

   const deleteRow = (index, rowMap) => {

    // Update the rows state
    const newRows = [...rows];
    newRows.splice(index, 1);
    setRows(newRows);

    // Update the selected options state
    const newSelectedOptions = [...selectedOptions];
    newSelectedOptions.splice(index, 1);
    setSelectedOptions(newSelectedOptions);
  };

  const handleDropdownChangeAdd = (item, index) => {
    const newRows = [...rows];
    newRows[index].uom = item.id;
    setRows(newRows);

    const newSelectedOptions = [...selectedOptions];
    newSelectedOptions[index] = item.id;
    setSelectedOptions(newSelectedOptions);
  };

  const formatValue = (value) => {
  // Convert to number and divide by 100, then format to 2 decimal places
  return (parseFloat(value) / 100).toFixed(2);
};


const validateRows = (rows) => {
  const missingFields = [];
  
  rows.forEach((row, index) => {
    // Check if UOM is present
    if (!row.uom) missingFields.push(`Row ${index + 1}: UOM`);
    
    // Validation based on UOM type
    switch (row.uom) {

      case 1: // nos
      case 4: // kgs
      case 3: // tons
      case 5: // mtr
      case 7: // Feet
         if (!row.qty || row.qty === '' || row.qty === "NaN") 
          missingFields.push(`Row ${index + 1}: Quantity`);
        if (!row.price || row.price === '' || row.price === "NaN") 
          missingFields.push(`Row ${index + 1}: Price`);
        if (!row.total_weight || row.total_weight === '' || row.total_weight === "NaN") 
          missingFields.push(`Row ${index + 1}: Total Weight`);
        if (!row.batch_code || row.batch_code === '' || row.batch_code === "NaN") 
          missingFields.push(`Row ${index + 1}: Batch code`);
        break;

      case 2: // bundle
      case 6: // packet
         if (!row.qty || row.qty === '' || row.qty === "NaN") 
          missingFields.push(`Row ${index + 1}: Quantity`);
        if (!row.price || row.price === '' || row.price === "NaN") 
          missingFields.push(`Row ${index + 1}: Price`);
        if (!row.total_weight || row.total_weight === '' || row.total_weight === "NaN") 
          missingFields.push(`Row ${index + 1}: Total Weight`);
        if (!row.pieces || row.pieces === '' || row.pieces === "NaN") 
          missingFields.push(`Row ${index + 1}: Pieces`);
        if (!row.batch_code || row.batch_code === '' || row.batch_code === "NaN") 
          missingFields.push(`Row ${index + 1}: Batch code`);
        break;
        
      default:

        break;
    }
    
  });
  
  return missingFields;
};

const saveRowsToSelectedItem = () => {
  // Format price and total_weight values
  const formattedRows = rows.map(row => ({
    ...row,
    price: row?.price,
    total_weight: row?.total_weight,
  }));


  console.log("formattedRows",formattedRows);

  // Validate formatted rows
  const missingFields = validateRows(formattedRows);

  if (missingFields.length > 0) {
    // Show alert and prevent modal from closing
    Alert.alert("Warning", `Please enter the following details:\n${missingFields.join('\n')}`, [{ text: "OK" }]);
    return;
  }

  // Update selected items with validated and formatted data
  setselectedItems((prevItems) => {
    return prevItems.map(item => {
      if (item.product_id === selectedItemId) {
        return { ...item, stock_array: formattedRows };
      }
      return item;
    });
  });
setModalVisible1(false); // Close the modal

  // If you have code that closes the modal here, ensure it only runs if validation passes
};


 useEffect(() => {
    if (modalVisible1 && rows.length === 0) {
      const selectedItemm = selectedItem.find(item => item.product_id === selectedItemId);
      if (selectedItemm && Array.isArray(selectedItemm.stock_array)) {
        console.log("dcjhkdhckjdhekf",selectedItemm.stock_array)
        setRows(selectedItemm.stock_array);
      } else {
        addRow();
      }
    } else if (!modalVisible1) {
      setRows([]);
      setSelectedOptions([]);
    }
  }, [modalVisible1, selectedItemId]);


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
      console.log("🚀 ~ .then ~ result:", result)
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
    console.log("bvbn",categoryId)
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
    console.log("pressed")
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
                      onPress={() => {
                        handleCheckboxChange(item);
                      }}
                      // onPress={() => navigation.navigate('ProductDetails', { item: item })}
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
                          {item.product_image &&
                          item.product_image.length > 0 ? (
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
                                fontFamily: "AvenirNextCyr-Medium",
                                flexWrap: "wrap",
                                flex: 2,
                                // marginBottom: 2,
                              }}
                            >
                              {item.name}
                            </Text>
                            <Checkbox.Android
                              color={Colors.primary}
                              status={
                                selectedItem.some(
                                  (product) => product.product_id === item.id
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
                            UOM : {item?.unit_of_measure}
                          </Text>
                  
                        </View>
                      </View>
                    </Pressable>
                  </View>
  );
}, [selectedItem]); 


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
      (product) => product.product_id !== item.product_id
    );
    setselectedItems(updatedProducts);
  };


  const handleCheckboxChange = (item) => {
    console.log("🚀 ~ handleCheckboxChange ~ item:", item)
    if (selectedItem.find((product) => product.product_id === item.id)) {
      // Remove the product from selectedItem
      setselectedItems((prevselectedItems) =>
        prevselectedItems.filter((product) => product.product_id !== item.id)
      );
    } else {
      // Add the product to selectedItem
      setselectedItems((prevselectedItems) => [
        ...prevselectedItems,
        {
          brand: item.brand,
              // price: '',
              product_id: item.id,
              // qty:'',
              // total_weight:'',
              uom_list:item.uom_list,
              id: item.id,
              name: item.name,
              unit_of_measure:item.unit_of_measure
          },
      ]);
    }
  };


  const handleSubmit = async () => {

    if (!refNum || !vehicleNo || !driverName || !totalPrice || !selectedCompany) {
      Alert.alert("Warning", "Please enter all details", [{ text: "OK" }]);
      return;
    }
  
    if (item) {
      const missingFields = [];

      selectedItem.forEach((item, index) => {
        // if (!item?.qty) missingFields.push(`Item ${index + 1}: Quantity`);
        // if (!item?.price) missingFields.push(`Item ${index + 1}: Price`);
        // if (!item?.uom) missingFields.push(`Item ${index + 1}: UOM`);
        // if (!item?.total_weight) missingFields.push(`Item ${index + 1}: Total Weight`);
      });
  
      if (missingFields.length > 0) {
        Alert.alert("Warning", `Please enter the following details:\n${missingFields.join('\n')}`, [{ text: "OK" }]);
        return;
      }
      setLoading(true);
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${userData.token}`);
  
  const lineItemsArray = selectedItem.map(item => {

  // Initialize an array to hold the split line items if the screen is in edit mode
  const splitLineItems = [];

  const transformedStockArray = item.stock_array.map(stockItem => {
    // Convert to number and check if it needs to be converted
    const priceAsNumber = parseFloat(stockItem.price);
    const weightAsNumber = parseFloat(stockItem.total_weight);

    console.log('Original price:', stockItem.price, 'as number:', priceAsNumber);
    console.log('Original total_weight:', stockItem.total_weight, 'as number:', weightAsNumber);

    // Check if the original string contains a decimal
    const formattedPrice = 
      stockItem.price.includes('.') 
        ? stockItem.price 
        : priceAsNumber;

    const formattedWeight = 
      isNaN(weightAsNumber) 
        ? '0.00' 
        : stockItem.total_weight.includes('.') 
          ? stockItem.total_weight 
          : weightAsNumber;

    console.log('Formatted price:', formattedPrice);
    console.log('Formatted total_weight:', formattedWeight);

    return {
      ...stockItem,
      price: formattedPrice,
      total_weight: formattedWeight,
    };
  });

  // Check if the screen is in edit mode
  if (screen==="edit") {
    // Separate objects with and without 'id'
    const withId = transformedStockArray.filter(stockItem => stockItem.id);
    const withoutId = transformedStockArray.filter(stockItem => !stockItem.id);

    // Add the stock arrays with 'id' to the main array
    if (withId.length > 0) {
      splitLineItems.push({
        product_id: item.id,
        stock_array: withId,
      });
    }

        // Add the stock arrays without 'id' as a separate item
         if (withoutId.length > 0) {
           splitLineItems.push({
             product_id: item.product_id,
             stock_array: withoutId,
           });
         }
       } else {
         // If not in edit mode, simply return the transformed stock array as is
         splitLineItems.push({
           product_id: item.id,
           stock_array: transformedStockArray,
         });
       }

       return splitLineItems;
     }).flat(); // Flatten the array if it contains split items

      const Supp = [];
      Supp.push(screen === 'edit' ? item.supplier_id : item.id );

      var raw = JSON.stringify({
        po_name: refNum,
        vehicle_no: vehicleNo,
        driver_name: driverName,
        types: "PO",
        company: selectedCompany.value? selectedCompany.value : item?.company_id,
        supplier_id: Supp,
        products: lineItemsArray,
        user: userData.id,
        rfq_flag: screen === 'edit' ? '' : "false",
        total_price:totalPrice
      });
  
      console.log("Raw------------>", raw, userData.token,ORDERID);
  
      var requestOptions = {
        method: screen === 'edit' ? 'PUT' : "POST" ,
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      await fetch( screen === 'edit' ? `https://gsidev.ordosolution.com/api/edit_purchase_order/${ORDERID}/` : `https://gsidev.ordosolution.com/api/rfq/`, requestOptions)
        .then((response) => response.json())
        .then(async (result) => {
          console.log("result of rfq", result);
  
          Alert.alert("Success",  screen === 'edit'?  "PO edited successfully": "PO created successfully", [
            { text: "OK", onPress: () => navigation.pop(2) },
          ]);
        })
        .catch((error) => console.log("error", error));
      setLoading(false);
    } else {
      Alert.alert("Warning", "Please select the supplier before submitting");
    }
  };
  
  return (
     <LinearGradient
                colors={Colors.linearColors}
                start={Colors.start} end={Colors.end}
                locations={Colors.location}
                style={{ flex: 1, }}
            >
    
    
        <View style={styles.headercontainer}>
          <View style={{ flexDirection: "row", alignItems: "center" ,justifyContent:'space-between',flex:1}}>
                            <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingLeft: 10 }}>
                                <Image source={require('../../assets/images/Refund_back.png')} style={{ height: 30, width: 30 }} />
                            </TouchableOpacity>
            <Text style={styles.headerTitle}>{screen === 'edit' ?'Edit PO' : 'Create PO' }</Text>
            <TouchableOpacity >
            <AntDesign name="arrowleft" size={25} color={Colors.primary} />

            </TouchableOpacity>
          </View>
        </View>

               <View style={{ flex: 1, borderTopLeftRadius: 20, borderTopRightRadius: 20, backgroundColor: '#F1F1F1' ,padding:10}}>

        <View style={styles.recoredbuttonStyle}>
          <Text
            style={{
              color: Colors.primary,
              fontFamily: "AvenirNextCyr-Bold",
              fontSize: 16,
              marginBottom: 3,
            }}
          >
            {item?.full_name ? item?.full_name : item?.supplier_name} - {item?.id }
          </Text>
          <Text
            style={{
              color: "black",
              fontFamily: "AvenirNextCyr-Medium",
              fontSize: 13,
              marginBottom: 3,
            }}
          >
            {item?.address}
          </Text>
          <Text
            style={{
              color: "black",
              fontFamily: "AvenirNextCyr-Medium",
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            {item?.phone}
          </Text>
        </View>

           <Dropdown
              style={{
                width: '100%',
                borderColor: 'black',
                borderWidth: 1,
                borderRadius: 5,
                paddingHorizontal: 10,
                color: "black",
                marginTop:'3%',
                backgroundColor:'#FFFBFB',
                height:'5%',
                marginHorizontal: "1%",
              }}
              data={companyOptions}
              labelField="label"
              valueField="value"
              placeholder="Select a company"
              placeholderStyle={{ fontSize: 15, color: 'black' }}
              selectedTextStyle={{ fontSize: 15 ,color:'black'}}
              itemTextStyle={{ fontSize: 15 ,color:'black'}}
              inputSearchStyle={{ height: 30, fontSize: 14 ,color:'black'}}
              value={selectedCompany}
              onChange={handleCompanySelect}
            />

       <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap:3
          }}
        >
      
          <View style={{ marginHorizontal: "1%", marginTop: "1%" ,flex:1}}>
          <TextInput1
            style={{height:40}}
            value={driverName}
            autoCapitalize="none"
            theme={{ colors: { onSurfaceVariant: Colors.black} }}
            activeOutlineColor={Colors.black}
            outlineColor={Colors.black}
            textColor={Colors.black}
            mode="outlined"
            label="Driver Name"
            onChangeText={(val) => {
              setDriverName(val);
            }}
            returnKeyType="done"
            // onChangeText={text => updateName(text)}
          />
        </View>


        <View style={{ marginHorizontal: "1%", marginTop: "1%",flex:1 }}>
          <TextInput1
            style={{height:40}}
            value={refNum}
            autoCapitalize="none"
            theme={{ colors: { onSurfaceVariant: Colors.black} }}
            activeOutlineColor={Colors.black}
            outlineColor={Colors.black}
            textColor={Colors.black}
            mode="outlined"
            label="Ref Number"
            onChangeText={(val) => {
              setRefNum(val);
            }}
            returnKeyType="done"
            // onChangeText={text => updateName(text)}
          />
        </View>

        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={{ marginHorizontal: "1%", marginVertical: "1%",flex:1  }}>
          <TextInput1
            style={{height:40}}
            value={vehicleNo}
            autoCapitalize="none"
            theme={{ colors: { onSurfaceVariant: Colors.black} }}
            activeOutlineColor={Colors.black}
            outlineColor={Colors.black}
            textColor={Colors.black}
            mode="outlined"
            label="Vehicle Number"
            onChangeText={(val) => {
              setVehicleNo(val);
            }}
            returnKeyType="done"
          />
        </View>

        <View style={{ marginHorizontal: "1%", marginVertical: "1%" ,flex:1  }}>
          <TextInput1
             style={{height:40}}
            value={totalPrice}
            autoCapitalize="none"
            theme={{ colors: { onSurfaceVariant: Colors.black} }}
            activeOutlineColor={Colors.black}
            outlineColor={Colors.black}
            textColor={Colors.black}
            mode="outlined"
            label="Total Price"
            onChangeText={(val) => {
              setTotalPrice(val);
            }}
            returnKeyType="done"
          />
        </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontFamily: "AvenirNextCyr-Medium",
              color: "black",
              fontSize: 19,
            }}
          >
            Products
          </Text>
          <TouchableOpacity
            onPress={() => {
              setModalVisible(true);
            }}
            style={{
              paddingVertical: "2%",
              paddingHorizontal: "5%",
              backgroundColor: Colors.primary,
              borderRadius: 10,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{ color: "white", fontFamily: "AvenirNextCyr-Medium" }}
            >
              ADD +
            </Text>
          </TouchableOpacity>
        </View>
        <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
{/* 
      // ORDO GSI APP_832 | 04-Apr-2025 | Sahana 
      // Fixed an issue  based on the product you select, it fetches the UOM (Unit of Measurement) options specific to that product from API and displays in the dropdown option*/}
        <View style={styles.ProductListContainer}>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={selectedItem}
            removeClippedSubviews={false} 
            keyboardShouldPersistTaps="handled"
            key={(item) => {
              item.id.toString();
            }}   
            renderItem={({ item }) => (            
              <TouchableOpacity 
                style={styles.elementsView}
                onPress={() => {
                  setModalVisible1(true);
                  setSelectedItemName(item?.name);
                  setSelectedItemId(item?.product_id);
                  setBaseUOM(item?.unit_of_measure);
                  setSelectedItemUOM(item?.uom_list)
                 }}
              >
                <View
                  style={{ flexDirection: "row", justifyContent: "center" }}
                >
                  <Pressable>
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
                      marginLeft: 10,
                    
                    }}
                  >
                     <View
                      style={{
                        flexDirection: "column",
                        justifyContent: "space-between",
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
                          flex: 2,
                          flexWrap: "wrap",
                        }}
                      >
                        {item.name}
                      </Text>
                      <TouchableOpacity
                        onPress={() => removeProductFromCart(item)}
                      >
                        <FontAwesome name="trash" size={20} color={"tomato"} />
                      </TouchableOpacity>
                    </View>
 
                  </View>
                    <Text
                        style={{
                          color: 'black',
                          fontSize: 14,
                          fontFamily: "AvenirNextCyr-Medium",
                          marginTop: 5,
                          flex: 2,
                          flexWrap: "wrap",
                        }}
                      >
                        Products :{item?.stock_array?.length ? item?.stock_array?.length : 0}
                      </Text>
                </View>
                </View>
                </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id?.toString()}
            ListEmptyComponent={() => (
              <View style={styles.noProductsContainer}>
                <Text style={styles.noProductsText}>No Products</Text>
              </View>
            )}
          />
        </View>
       
{selectedItem?.length > 0 && selectedItem.every(item => item?.stock_array && item.stock_array.length > 0) && (
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
              marginBottom:'2%'
            }}
          >
            <TouchableOpacity
              style={{
                paddingVertical: "4%",
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
                
              }}
              onPress={handleSubmit}
              activeOpacity={0.8}
            >
              {loading ? (
                <Wave size={30} color={"white"} />
              ) : (
                <Text style={styles.btnText}>{screen === 'edit' ? 'Edit Purchase Order' : 'Submit PO'}</Text>
              )}
            </TouchableOpacity>
          </LinearGradient>
        )}
        </KeyboardAvoidingView>


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

 <Modal visible={modalVisible1} transparent>
        <View style={styles.modalContainer1}>
          <View style={styles.modalContent1}>
            <TouchableOpacity
              style={styles.closeIcon}
              onPress={() => setModalVisible1(false)}>
              <AntDesign name="close" color="black" size={25} />
            </TouchableOpacity>

    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingLeft: '5%', paddingVertical: '3%', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#D3D3D3',gap:5 }} >

              <Text style={styles.ModalText1} numberOfLines={2}>{selectedItemName}</Text>
                 <TouchableOpacity
          style={styles.buttonContainer}
          onPress={addRow}
        >
          <Text style={styles.buttonText}>Add</Text>
          <Entypo name="plus" color="white" size={20} />
        </TouchableOpacity>
        </View>

              <View style={{marginHorizontal: '1%', marginTop: '3%',gap:1}}>

                 <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ marginHorizontal: 5, marginTop: '3%', height: 200 }} vertical>
        {rows.map((item, index) => (
      <ScrollView
       key={index}
       horizontal
       showsHorizontalScrollIndicator={false}
       contentContainerStyle={{ width:500}}
                >
        <View key={index} style={{width:'100%'}}>
          {/* Heading Row */}
          {index === 0 || rows[index - 1].uom !== item.uom ? (
            <View style={{ flexDirection: 'row', marginBottom: 10 }}>
              {(item.uom === 4 || item.uom === 5 || item.uom === 3 || item.uom === 7) ? (
                <>
                  <Text style={{ flex: 1, fontSize: 13, fontWeight: 'bold', textAlign: 'center',color:'black' }}>Qty</Text>
                  <Text style={{ flex: 1.5, fontSize: 13, fontWeight: 'bold', textAlign: 'center' ,color:'black'}}>UOM</Text>
                  <Text style={{ flex: 1, fontSize: 13, fontWeight: 'bold', textAlign: 'center' ,color:'black'}}>Price</Text>
                  <Text style={{ flex: 1.3, fontSize: 13, fontWeight: 'bold', textAlign: 'center',color:'black' }}>Weight</Text>
                  <Text style={{ flex:1.9, fontSize: 13, fontWeight: 'bold', textAlign: 'center',color:'black' }}>Batch Code</Text>
                </>
              ) : (item.uom === 2 || item.uom === 6 ) ? (
                <>
                  <Text style={{ flex: 1, fontSize: 13, fontWeight: 'bold', textAlign: 'center',color:'black' }}>Qty</Text>
                  <Text style={{ flex: 1.5, fontSize: 13, fontWeight: 'bold', textAlign: 'center',color:'black' }}>UOM</Text>
                  <Text style={{ flex: 2.3, fontSize: 13, fontWeight: 'bold', textAlign: 'center',color:'black' }}>Price</Text>
                  <Text style={{ flex: 1, fontSize: 13, fontWeight: 'bold', textAlign: 'center',color:'black' }}>Weight</Text>
                  <Text style={{ flex: 1.8, fontSize: 13, fontWeight: 'bold', textAlign: 'center' ,color:'black'}}>Pieces</Text>
                  <Text style={{ flex: 2.5, fontSize: 13, fontWeight: 'bold', textAlign: 'center',color:'black' }}>Batch Code</Text>
                </>
              ) : (item.uom === 1) && (
                <>
                  <Text style={{ flex: 1, fontSize: 13, fontWeight: 'bold', textAlign: 'center',color:'black' }}>Qty</Text>
                  <Text style={{ flex: 2, fontSize: 13, fontWeight: 'bold', textAlign: 'center',color:'black' }}>UOM</Text>
                  <Text style={{ flex: 2, fontSize: 13, fontWeight: 'bold', textAlign: 'center' ,color:'black'}}>Price</Text>
                  <Text style={{ flex: 1.8, fontSize: 13, fontWeight: 'bold', textAlign: 'center',color:'black' }}>Weight</Text>
                  <Text style={{ flex: 2.5, fontSize: 13, fontWeight: 'bold', textAlign: 'center',color:'black' }}>Batch Code</Text>
                </>
              )}
            </View>
          ) : null}

          {/* Data Row */}
          <View style={{ flexDirection: 'row', marginBottom: 10, alignItems: 'center', gap: 1 }}>
            <TextInput
              style={{ flex:1.5, borderWidth: 1, borderColor: '#ccc', padding: 5, backgroundColor: '#fff', color: 'black', marginHorizontal: 3 ,height:38}}
              placeholder="Qty"
              placeholderTextColor={'gray'}
              keyboardType="numeric"
              value={item?.qty}
              onChangeText={(text) => {
                const newRows = [...rows];
                newRows[index].qty = text;
                setRows(newRows);
              }}
              returnKeyType="done"
            />

            <Dropdown
              style={{flex:2, marginRight: 5, borderWidth: 1, borderColor: '#ccc', backgroundColor: '#fff', padding: 2 ,height:38}}
              data={selectedItemUOM}
              placeholderStyle={{ fontSize: 14, color: '#888' }}
              selectedTextStyle={{ fontSize: 14 ,color:'black'}}
              itemTextStyle={{ fontSize: 14 ,color:'black'}}
              inputSearchStyle={{ height: 30, fontSize: 14 ,color:'black'}}
              labelField="label"
              valueField="id"
              placeholder="Select option"
              value={item?.uom}
              onChange={(dropdownItem) => handleDropdownChangeAdd(dropdownItem, index)}
            />
            
            <TextInput
              style={{ flex:1.5, borderWidth: 1, borderColor: '#ccc', padding: 5, backgroundColor: '#fff', color: 'black', marginHorizontal: 3 ,height:38}}
              placeholder="Price"
              placeholderTextColor={'gray'}
              keyboardType="numeric"
              value={item?.price}
              onChangeText={(text) => {
                const newRows = [...rows];
                newRows[index].price = text;
                setRows(newRows);
              }}
              returnKeyType="done"
            />

        <TextInput
              style={{ flex:1.5, borderWidth: 1, borderColor: '#ccc', padding: 5, backgroundColor: '#fff', color: 'black', marginHorizontal: 3 ,height:38}}
              placeholder="weight"
              placeholderTextColor={'gray'}
              keyboardType="numeric"
              value={item?.total_weight}
              onChangeText={(text) => {
                const newRows = [...rows];
                newRows[index].total_weight = text;
                setRows(newRows);
              }}
              returnKeyType="done"
            />

            {item.uom === 2 || item.uom === 6 ? (
              <TextInput
                style={{ flex: 1.5, borderWidth: 1, borderColor: '#ccc', padding: 5, backgroundColor: '#fff', color: 'black', marginHorizontal: 3,height:38 }}
                placeholder="Pieces"
                placeholderTextColor={'gray'}
                keyboardType="numeric"
                value={item?.pieces}
                onChangeText={(text) => {
                  const newRows = [...rows];
                  newRows[index].pieces = text;
                  setRows(newRows);
                }}
                returnKeyType="done"
              />
            ) : null}
             <TextInput
                style={{ flex: 2, borderWidth: 1, borderColor: '#ccc', padding: 5, backgroundColor: '#fff', color: 'black', marginHorizontal: 3 ,height:38}}
                placeholder="Batch Code"
                placeholderTextColor={'gray'}
                value={item.batch_code}
                onChangeText={(text) => {
                  const newRows = [...rows];
                  newRows[index].batch_code = text;
                  setRows(newRows);
                }}
                returnKeyType="done"
              />

                <TouchableOpacity style={styles.deleteIconContainer}
                 onPress={() => deleteRow(index)}>
               <AntDesign name="delete" color="black" size={20} />
               </TouchableOpacity>
          </View>
        </View>
  </ScrollView>
  ))}

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
                  <Text
                    style={{ fontFamily: "AvenirNextCyr-Bold", color: "white" }}
                  >
                    Submit
                  </Text>
              </TouchableOpacity>
              </LinearGradient>
              </View>
          </View>
        </View>
      </Modal>



  </View>
    <LoadingView visible={loading} message="Please Wait ..." />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: "5%",
    paddingTop: 10,
    backgroundColor: "white",
    flex: 1,
  },
  textInput: {
    borderColor: "grey",
    borderWidth: 1,
    backgroundColor: "white",
    height: 50,
    marginBottom: "5%",
    padding: 5,
    paddingLeft: 8,

    fontFamily: "AvenirNextCyr-Thin",
    borderRadius: 10,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  halfTextInput: {
    flex: 1,
  },

  headercontainer: {
    paddingHorizontal: 10,
    paddingVertical: 15,
    //backgroundColor:'red',
    flexDirection: 'row',
    alignItems: 'center',
    //backgroundColor:'red'
    justifyContent: 'space-between',
    marginTop: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "AvenirNextCyr-Medium",
    color: Colors.white,
    marginLeft: 10,
    marginTop: 3,
  },
  button: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    backgroundColor: Colors.primary,
    marginBottom: 10,
    marginTop: "5%",
    borderRadius: 20,
  },
  btnText: {
    fontFamily: "AvenirNextCyr-Medium",
    color: "#fff",
    fontSize: 16,
  },
  buttonview: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
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
    marginVertical: 10,
    backgroundColor: Colors.primary,
    marginRight: 10,
  },
  buttonText: {
    fontFamily: "AvenirNextCyr-Thin",
    color: "white",
  },
  label: {
    fontSize: 16,
    color: Colors.black,
    fontFamily: "AvenirNextCyr-Medium",
  },
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 8,
    marginBottom: "5%",
    borderRadius: 10,
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 14,
    fontFamily: "AvenirNextCyr-Thin",
    color: "grey",
  },
  selectedTextStyle: {
    fontSize: 16,
    fontFamily: "AvenirNextCyr-Thin",
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
    borderColor: "grey",
    borderWidth: 1,
    backgroundColor: "white",
    height: 40,
    marginBottom: 5,
    fontFamily: "AvenirNextCyr-Thin",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  input2: {
    fontFamily: "AvenirNextCyr-Thin",
    padding: 8,
    flex: 1,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "AvenirNextCyr-Medium",
  },
  submitButton1: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    // marginTop: 2,
  },
  elementsView: {
    backgroundColor: "white",
    margin: 5,
    marginBottom: 16,
    borderRadius: 8,
    elevation: 5,
    ...globalStyles.border,
    padding: 16,
  },
  ProductListContainer: {
    flex: 1,
    marginVertical: "4%",
  },
  imageView: {
    width: 50,
    height: 50,
  },
  noProductsContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  noProductsText: {
    fontSize: 16,
    color: "gray",
    fontFamily: "AvenirNextCyr-Thin",
    textAlign: "center",
    marginTop: 80,
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
  input: {
    flex: 1,
    fontSize: 16,
    marginRight: 10,
  },
  searchButton: {
    padding: 5,
  },
  selectedStyle: {
    marginBottom: "5%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 14,
    backgroundColor: "white",
    shadowColor: "#000",
    marginTop: "2%",
    marginRight: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  textSelectedStyle: {
    marginRight: 5,
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  item: {
    padding: 17,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  recoredbuttonStyle: {
    borderRadius: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    marginHorizontal: 4,
    shadowRadius: 2,
    elevation: 5,
    ...globalStyles.border,
    backgroundColor: "white",
    justifyContent: "space-between",
    borderRadius: 10,
    marginTop: "5%",
    padding: "4%",
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
    ModalText1: {
    fontSize: 14,
    fontFamily: 'AvenirNextCyr-Bold',
    paddingBottom: 5,
    color:Colors.primary,
    flex:1,

  },
      buttonContainer: {
        height: 40,
        padding: 5,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor:'#65A765',
        marginRight:'5%',
        width:'20%',
        flexDirection:'row',
        gap:3
      },
      buttonText: {
        fontFamily: "AvenirNextCyr-Bold",
        color: "white",
      },
         closeIcon: {
    position: 'absolute',
    top: 5,
    right: 10,
    padding: 5,
  },
  rowBack: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    paddingLeft: 15,
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
    right: 0,
  },
    deleteIconContainer: {
    marginLeft: 10,
  },
});

export default CreatePO;
