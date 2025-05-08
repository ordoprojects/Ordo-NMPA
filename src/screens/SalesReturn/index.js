import { StyleSheet, Text, View, Image, FlatList, Keyboard, TouchableOpacity, Platform, TextInput, Modal, Pressable, KeyboardAvoidingView, Alert, ScrollView,BackHandler } from 'react-native'
import React, { useState, useEffect, useRef, useContext, useCallback ,
  useMemo
} from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign';
import Colors from '../../constants/Colors';
import { cameraPermission } from '../../utils/Helper';
import { AuthContext } from '../../Context/AuthContext';
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient'
import globalStyles from '../../styles/globalStyles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo'
import { Searchbar, PaperProvider, Portal ,Modal as Modal1,DefaultTheme } from 'react-native-paper';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import ImageResizer from '@bam.tech/react-native-image-resizer'
import RNFS from 'react-native-fs';
import { ProgressDialog } from 'react-native-simple-dialogs';
import { searchItem } from "../../utils/Search";
import { debounce } from "../../utils/Search";
import  Ionicons  from 'react-native-vector-icons/Ionicons';
import { LoadingView } from "../../components/LoadingView";
import { Dropdown } from 'react-native-element-dropdown';
import Toast from 'react-native-simple-toast';
import { MaskedTextInput } from "react-native-mask-text";
import { SwipeListView } from 'react-native-swipe-list-view';
import FontAwesome from "react-native-vector-icons/FontAwesome";

const SalesReturn = ({ navigation, route }) => {

    const { token, userData, dealerData } = useContext(AuthContext);
    // const { dealerInfo } = route.params;
    //bacr code permission
    //check permssiosaon 
    // useEffect(() => {
    //     openModal(); // Show the modal when the component mounts
    // }, []);
 const [modalVisibleOpen, setModalVisibleOpen] = useState(false);

    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisible2, setModalVisible2] = useState(false);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalVisible1, setIsModalVisible1] = useState(false);
    const [totalCount, setTotalCount] = useState('');
    const [cartCount, setCartCount] = useState(0);
    const [addedItems, setAddedItems] = useState([]);

  const [selectedItem, setselectedItems]= useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [expandedSubCategory, setExpandedSubCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [originalCategories, setOriginalCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [imgId, setImgId] = useState('');
  const [base64img, setBase64img] = useState('');
  const [qty, setQty] = useState('');
  const [detailsModal, setDetailsModal] = useState(false)
  const [productsBySubCategory, setProductsBySubCategory] = useState({});
    const [searching, setSearching] = useState(false);
    const [productSearch, setProductSearch] = useState('');
   const [masterData, setMasterData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState('');
    const queryParams = useRef({ limit: 10, offset: 0 });
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companyOptions, setCompanyOptions] = useState([]);
 const [dropdownItems, setDropdownItems] = useState([]);
  const [customUOM, setCustomUOM] = useState(''); 
  const [totalPrice, setTotalPrice] = useState('');
  const [vehicleNo, setVehicleNo] = useState('');
  const [refNum, setRefNum] = useState('');
   const [modalVisible1, setModalVisible1] = useState(false);

  const [selectedOptions, setSelectedOptions] = useState([]);
  const [rows, setRows] = useState([{ uom: null, price: '', total_weight: '', pieces: '',qty: '' }]);
  const [selectedItemName, setSelectedItemName] = useState('');
  const [selectedItemId, setSelectedItemId] = useState(null);
  const searchbarRef = useRef(null);
  const [cartSearch, setCartSearch] = useState("");
  const [screen, setScreen] = useState("");
  const [selectedItemUOM, setSelectedItemUOM] = useState([]);
  const [baseUOM, setBaseUOM] = useState('');




  const [openScanner, setOpenScanner] = useState(false);
  const [cameraPermissionGranted, setCameraPermissionGranted] = useState(false);
  const [isProcessingScan, setIsProcessingScan] = useState(false);


  

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

const getDropdownData = (index) => {
      
      return dropdownItems
    };

 const addRow = () => {
    setRows([...rows, { uom: 4, price: '', total_weight: '', pieces: '',qty: ''  }]);
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
      // case 1: // nos
      //   if (!row.price || row.price === '' || row.price === "NaN") 
      //     missingFields.push(`Row ${index + 1}: Price`);
      //   if (!row.qty || row.qty === '' || row.qty === "NaN") 
      //     missingFields.push(`Row ${index + 1}: Quantity`);
      //     if (!row.total_weight || row.total_weight === '' || row.total_weight === "NaN") 
      //     missingFields.push(`Row ${index + 1}: Total Weight`);
      //   break;

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
        // if (!row.batch_code || row.batch_code === '' || row.batch_code === "NaN") 
        //   missingFields.push(`Row ${index + 1}: Batch code`);
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
        // if (!row.batch_code || row.batch_code === '' || row.batch_code === "NaN") 
        //   missingFields.push(`Row ${index + 1}: Batch code`);
        break;
        
      default:

        break;
    }
    
    // Optional: Add validation for qty if necessary
    // if (!row.qty) missingFields.push(`Row ${index + 1}: Quantity`);
  });
  
  return missingFields;
};

const saveRowsToSelectedItem = () => {
  // Format price and total_weight values
  const formattedRows = rows.map(row => ({
    ...row,
    price: formatValue(row.price),
    total_weight: formatValue(row.total_weight),
  }));


  console.log("formattedRows",formattedRows)

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
      if (item.id === selectedItemId) {
        return { ...item, stock_array: formattedRows };
      }
      return item;
    });
  });
setModalVisible1(false); // Close the modal

  // If you have code that closes the modal here, ensure it only runs if validation passes
};

const removeProductFromCart = (item) => {
    // Filter out the item to remove it from the array
    const updatedProducts = selectedItem.filter(
      (product) => product.id !== item.id
    );
    setselectedItems(updatedProducts);
  };




  const renderHiddenItem = (data, rowMap) => (
    <View style={styles.rowBack}>
      <TouchableOpacity
        style={styles.backRightBtn}
        onPress={() => deleteRow(rowMap, data.index)}
      >
      <AntDesign name="delete" color="black" size={20} />
      </TouchableOpacity>
    </View>
  );


 useEffect(() => {
    if (modalVisible1 && rows.length === 0) {
      const selectedItemm = selectedItem.find(item => item.id === selectedItemId);
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



    const handlePress = () => {
        setFilteredData(masterData);
        setCartSearch('');
        if(selectedCompany){
        setModalVisible(true);

        }else{
          setModalVisibleOpen(true);
        }
    };


    const handleClose = () => {
        setDetailsModal(false);
        setRemarks('')
        setBase64img('')
        setQty('')
    };


    const handlePress1 = () => {
        setFilteredData(masterData);
        setModalVisible(true);
    };
    const handleClose1 = () => {
        setModalVisible(false);
    };

    const handlePress2 = () => {
        // setFilteredData(masterData);
        setModalVisible2(true);
    };
    const handleClose2 = () => {
        setModalVisible2(false);
    };


    // const openModal = () => {
    //     setIsModalVisible(true);
    //     // console.log("remember to remove this log and add openModal")
    // };


    const productsArray = [];

    const [totalAmt, setTotalAmt] = useState(0);
    const [totalQty, setTotalQty] = useState(0);
    const [cartData, setCartData] = useState([]);

    const calOrderStat = (array) => {
        let tempTotalAmt = 0;
        let tempQty = 0;
        //calculating total price and total quantity
        array.forEach(item => {
            let amt = Number(item?.price) * Number(item?.qty);
            tempTotalAmt = tempTotalAmt + amt;
            tempQty = tempQty + Number(item?.qty);

        });
        console.log("updated amt ", tempTotalAmt);
        setTotalAmt(tempTotalAmt);
        setTotalQty(tempQty);
    }

    console.log("dealer iddddddddd", dealerData.id)
    // storeQty = async () => {
    //     let newProductArray = await productsArray.map((item) => {
    //         return {
    //             ...item,
    //             Ordered_Product_Qty: item?.product_qty
    //         }

    //     })
    //     setMasterData(newProductArray);
    //     setFilteredData(newProductArray);

    // }


    // useEffect(() => {
    //     storeQty();
    //     calOrderStat(productsArray);
    // }, [])

    //new
    // const [isModalVisible, setModalVisible] = useState(false)
    //new
    // const orders = [
    //     {
    //         id: 1,
    //         netWt: 250,
    //         name: 'Soap',
    //         imageSource: 'https://m.media-amazon.com/images/I/61KBJrvYy3L._AC_UF1000,1000_QL80_.jpg',
    //         quantity: 0,
    //         rupees: '₹76',
    //         imageNumber: 58578
    //     },
    //     {
    //         id: 2,
    //         netWt: 568,
    //         name: 'Pot',
    //         imageSource: 'https://m.media-amazon.com/images/I/81UY6IfHNHL._AC_UF894,1000_QL80_.jpg',
    //         quantity: 0,
    //         rupees: '₹60',
    //         imageNumber: 76467
    //     },
    //     {
    //         id: 3,
    //         netWt: 574,
    //         name: 'Pillow',
    //         imageSource: 'https://m.media-amazon.com/images/I/611LBf4W5TL._AC_UY1100_.jpg',
    //         quantity: 0,
    //         rupees: '₹34',
    //         imageNumber: 74574
    //     },
    //     {
    //         id: 4,
    //         netWt: 765,
    //         name: 'Ring Box',
    //         imageSource: 'https://m.media-amazon.com/images/I/51cmW4qRqdL._AC_SS300_.jpg',
    //         quantity: 0,
    //         rupees: '₹18',
    //         imageNumber: 65685
    //     }
    // ]

    // const searchProduct = (text) => {
    //     // Check if searched text is not blank
    //     if (text) {
    //         // Inserted text is not blank
    //         // Filter the masterDataSource
    //         // Update FilteredDataSource
    //         const newData = filteredData.filter(
    //             function (item) {
    //                 const itemData = item.name
    //                     ? item.name.toUpperCase() + item.part_number.toUpperCase()
    //                     : ''.toUpperCase();
    //                 const textData = text.toUpperCase();
    //                 return itemData.indexOf(textData) > -1;
    //             });
    //         setFilteredData(newData);
    //         setSearch(text);
    //     } else {
    //         // Inserted text is blank
    //         // Update FilteredDataSource with masterDataSource
    //         setFilteredData(masterData);
    //         setSearch(text);
    //     }
    // };

    const cancelReturn = () => {
        setModalVisible2(false);
    }

    useEffect(() => {
        setSelectedItemName(cartData)
    }, [cartData])

     const addProduct = (item) => {
      console.log('Selected item:', item);
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
              // uom:'',
              unit_of_measure:item.unit_of_measure,
              uom_list:item.uom_list,
              id: item.id,
              name: item.name,
          },
      ]);
    }   
       Toast.show(
        "Product Added Successfully to your cart",
        Toast.SHORT
      );
     setFilteredCartData(selectedItem);  
  };



  const handleInputChange = (id, tonnage) => {
    setCartData((prevCartData) => {
      const updatedCartData = prevCartData.map((item) => {
        if (item.id === id) {
          const newTonnage = tonnage || 0;
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

    const updateQuantity = (item, type, index) => {
        let tempCart = [];
        tempCart = [...cartData];
        tempCart.map((itm) => {
            if (itm.id == item.id) {
                //increment
                if (type == 'add') {
                    //checking sales man cannot ordered quantity valu
                    ++itm.qty;
                    setCartData(tempCart);
                    calOrderStat(tempCart);
                }
                //decrement
                else {
                    if (itm.qty > 1) {
                        --itm.qty;
                        setCartData(tempCart);
                        calOrderStat(tempCart);
                    }
                    else {
                        deleteProduct(index)
                    }
                }


            }
        })

    }

    const deleteProduct = (item) => {
        // Find the index of the item in the cartData
        const index = selectedItem.findIndex((cartItem) => cartItem.id === item);

        if (index !== -1) { // If item exists in cartData
            let tempCart = [...selectedItem];
            tempCart.splice(index, 1);
            setselectedItems(tempCart);
            setFilteredCartData(tempCart);
            calOrderStat(tempCart);
        }

        // Filter out the item from addedItems
        const updatedAddedItems = addedItems.filter((itemId) => itemId !== item);
        setAddedItems(updatedAddedItems);
    };

    // const editProduct = (item) => {

    //     console.log("🚀 ~ editProduct ~ item:", item.qty)


    //     setSelectedItem(item);
    //     setQty(item.qty);
    //     setRemarks(item.remarks);
    //     setBase64img(item.base64img);
    //     setDetailsModal(true);
    // }

    // const returnItems = async () => {
    //     let returnArray = await masterData.map((item) => {
    //         return {
    //             id: item.id,
    //             qty: item.product_qty
    //         }
    //     })
    //     console.log("return array", returnArray);
    //     var myHeaders = new Headers();
    //     myHeaders.append("Content-Type", "application/json");
    //     var raw = JSON.stringify({
    //         "__return_products_quotes_id_array__": returnArray,
    //         "__quotes_id__": returnId
    //     }
    //     );
    //     var requestOptions = {
    //         method: 'POST',
    //         headers: myHeaders,
    //         body: raw,
    //         redirect: 'follow'
    //     };

    //     fetch("https://gsidev.ordosolution.com/set_return_order.php", requestOptions)
    //         .then(response => response.json())
    //         .then(result => {
    //             console.log("returen order res", result);

    //         })
    //         .catch(error => console.log('error', error));

    // }


    //Modal Hooks
 


  

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


// console.log("fjkdsjghds",originalCategories);


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

// const handleSearchClear = () => {
//   setSearch("");
//   Keyboard.dismiss();
//   setCategories(originalCategories); // Reset categories to original data
// };


  // console.log("category",categories)

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


console.log("hekc",search);

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
  loadProducts(selectedCategory, expandedSubCategory);// Ensure loading state is false
};




  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity key={item.id} style={styles.categoryItem} onPress={() => handleCategorySelect(item.id)}>
          {item.category_image ? (
                <Image
                  source={{ uri: item.category_image }} // Use the first image
                  style={styles.categoryImage}
                />
              ) : (
                <Image
                  source={require("../../assets/images/noImagee.png")} // Use default image
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





console.log("prod",selectedItem)

const renderProductItem = useCallback(({ item }) => {
    
    return (
<View style={{
                                        backgroundColor: addedItems.includes(item.id) ? Colors.primary : "#f2f2f2",
                                        marginHorizontal: "1%",
                                        marginTop: 5,
                                        marginBottom: 8,
                                        elevation: 5,
                                        ...globalStyles.border,
                                        borderTopLeftRadius: 20,
                                        borderBottomRightRadius: 20,
                                    }}>
                                        <Pressable style={{ padding: 10 }}
                                        // onPress={() => navigation.navigate('ProductDetails', { item: item })}
                                        // onPress={() => action ? navigation.navigate(screen, { item: item }) : navigation.navigate('ProductDetails', { item: item })}
                                        >
                                            <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 20 }}>
                                                <View style={{ backgroundColor: 'white', elevation: 5, ...globalStyles.border, borderRadius: 5, padding: '1%' }}>
                                                    {item.product_image && item.product_image.length > 0 ? (
                                                        <Image
                                                            source={{uri: item.product_image.startsWith("http")
          ? item.product_image
          : `https://gsidev.ordosolution.com${item.product_image}`,
      }} // Use the first image
                                                            style={styles.imageView}
                                                        />
                                                    ) : (
                                                        <Image
                                                            source={require("../../assets/images/noImagee.png")} // Use default image
                                                            style={styles.imageView}
                                                        />
                                                    )}
                                                </View>
                                                <View style={{
                                                    flex: 1,
                                                }}>

                                                    <Text style={{ color: addedItems.includes(item.id) ? 'white' : Colors.primary, fontFamily: 'AvenirNextCyr-Medium', }} >{item?.name}</Text>
                                                    <Text style={{ color: addedItems.includes(item.id) ? 'white' : "gray", fontSize: 12, fontFamily: 'AvenirNextCyr-Thin', }}>{item?.brand?.brand_name}</Text>
                                                    {/* <Text style={{ color: 'green', fontSize: 12, fontFamily: 'AvenirNextCyr-Thin' }}>{Number(item.stock) > 0 ? `Current Stock - ${item.stock}` : <Text style={{ color: 'red', fontSize: 12, fontFamily: 'AvenirNextCyr-Thin' }} >Out of stock</Text>}</Text> */}
                                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <Text style={{ color: addedItems.includes(item.id) ? 'white' : Colors.primary, fontSize: 12, fontFamily: 'AvenirNextCyr-Medium', }}>{item.product_price}</Text>


                                                    </View>

                                                </View>

                                            </View>

                                        </Pressable>
                                        <View style={{ width: '100%', justifyContent: 'flex-end', flexDirection: 'row', position: 'absolute', bottom: 0, }}>

                                            <TouchableOpacity
                                                style={{
                                                    width: '24%',
                                                    padding: 10,
                                                    paddingHorizontal: 10,
                                                    borderBottomRightRadius: 20,
                                                    backgroundColor: addedItems.includes(item.id) ? "#f2f2f2" : Colors.primary,
                                                    elevation: 5,
                                                    borderTopLeftRadius: 10,
                                                    flexDirection: 'row'
                                                }}
                                                   
                                                 onPress={() => handleProductPress(item, addedItems.includes(item.id))}
                                                    

                                            // disabled={addedItems.includes(item.id)}
                                            >
                                                <MaterialCommunityIcons name="cart-variant" size={20} color={addedItems.includes(item.id) ? "#50001D" : 'white'} />
                                                <Text
                                                    style={{
                                                        color: addedItems.includes(item.id)
                                                            ? Colors.primary
                                                            : "white",
                                                        fontSize: 12,
                                                        fontFamily: "AvenirNextCyr-Medium",
                                                    }}
                                                >
                                                    {addedItems.includes(item.id) ? "Remove " : "Add"}
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
)
                        
}); 

  console.log("vjhg",loading)

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


    const searchProduct = (text) => {
        // Check if searched text is not blank
        if (text) {
            // Inserted text is not blank
            // Filter the masterDataSource
            // Update FilteredDataSource
            const newData = masterData.filter(
                function (item) {
                    const itemData = item.name
                        ? item.name.toUpperCase()
                        : ''.toUpperCase();
                    const textData = text.toUpperCase();
                    return itemData.indexOf(textData) > -1;
                });
            setFilteredData(newData);
            setSearch(text);
        } else {
            // Inserted text is blank
            // Update FilteredDataSource with masterDataSource
            setFilteredData(masterData);
            setSearch(text);
        }
    };

    const [filteredCartData, setFilteredCartData] = useState([]);



    const searchProductInCart = (text) => {
        // Check if searched text is not blank
        if (text) {
            // Inserted text is not blank
            // Filter the masterDataSource
            // Update FilteredDataSource
            const newData = selectedItem.filter(
                function (item) {
                    const itemData = item.name
                        ? item.name.toUpperCase()
                        : ''.toUpperCase();
                    const textData = text.toUpperCase();
                    return itemData.indexOf(textData) > -1;
                });
            setselectedItems(newData);
            setSearch(text);
        } else {
            // Inserted text is blank
            // Update FilteredDataSource with masterDataSource
            setselectedItems(cartData);
            setSearch(text);
        }
    };

    const clearCartData = () => {
        // Display a confirmation popup
        Alert.alert(
            "Confirmation",
            "Are you sure you want to delete all items from the cart?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: "OK",
                    onPress: () => {
                        // Proceed with clearing the cart data
                        setCartData([]);
                        calOrderStat([]);
                        setAddedItems([]);
                    }
                }
            ]
        );
    }

const handleProductPress = (item, itemAdded) => {
    console.log("item added",itemAdded)
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

    //add return product previous  screen data
    // useEffect(() => {
    //     if (route.params?.returnItem) {
    //         let item = route.params?.returnItem;
    //         console.log("return item data ", item)
    //         //adding product to cart
    //         addProduct(item)

    //         navigation.setParams({ returnItem: null });

    //     }
    // }, [route.params?.returnItem]);

    // const AlertForOrder = () => {
    //     console.log("user idddddddddddddd", token)

    //     // Fetch total count before showing the modal
    //     if (cartData.length > 0) {
    //         var myHeaders = new Headers();
    //         myHeaders.append("Content-Type", "application/json");
    //         var raw = JSON.stringify({
    //             __user_id__: token,
    //             __account_id__: dealerData.id
    //             // __return_array__: returnArray

    //         }
    //         );
    //         var requestOptions = {
    //             method: 'POST',
    //             headers: myHeaders,
    //             body: raw,
    //             redirect: 'follow'
    //         };
    //         fetch("https://dev.ordo.primesophic.com/get_returnorder_count.php", requestOptions)
    //             .then(response => response.json())
    //             .then(res => {
    //                 console.log("count", res.message)
    //                 setTotalCount(res.message);
    //                 setModalVisible2(true);
    //             })
    //             .catch(error => console.log('error', error));
    //     } else {
    //         Alert.alert('Add Product', 'Please add product to return')
    //     }
    // }


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

    //upload image
    const uploadImage = (img) => {
        setLoading(true)

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "text/plain");
        //changed
        //.var raw = "{\n    \"__note_file__\": \"" + signBase64 + "\",\n    \"__note_filename__\": \"" + "OrderReciept" + returnId  + "\"\n    }\n";
        var raw = JSON.stringify({
            "__note_file__": img,
            "__note_filename__": `${Date.now()}.png`

        })
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("https://dev.ordo.primesophic.com/uploadFile.php", requestOptions)
            .then(response => response.json())
            .then(res => {
                //console.log("Signature Uploaded", result);
                console.log('product image uploaded', res);
                setImgId(res?.document_id)
                setLoading(false)
            })
            .catch(error => console.log('error', error));

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
                        uploadImage(res)
                        setBase64img(`data:${type};base64,${res}`);
                    });
            })
            .catch((err) => {
                console.log(" img resize error", err)
            });
    }

    const orderItems = async () => {
        if (cartData.length > 0) {
            let productArray = cartData.map((item) => {

                return {
                    product_id: item.product_id? item?.product_id : item?.id,
                    product_status: "Pending",
                    qty: item.qty,
                    ret_product_image: item.base64img
                    // list_price: itemPrices[item.id],
                };
            });
            navigation.navigate("ReturnsCartReview", {
                dealerInfo: userData,
                cartData: cartData,
                total: totalAmt,
                // screenid: screenid

            });
        } else {
            alert("Sorry, no products to order");
        }
    };

    console.log('=================userData.token===================');
    console.log(userData.token);
    console.log('====================================');


const returnOrder = async () => {
  const missingFields = [];

  // Check for missing fields in selectedItem
  selectedItem.forEach((item, index) => {
    // if (!item?.qty) missingFields.push(`Item ${index + 1}: Quantity`);
    // if (!item?.price) missingFields.push(`Item ${index + 1}: Price`);
    // if (!item?.uom) missingFields.push(`Item ${index + 1}: UOM`);
    // if (!item?.total_weight) missingFields.push(`Item ${index + 1}: Total Weight`);
  });

  // If missing fields, show alert and return
  if (missingFields.length > 0) {
    Alert.alert(
      "Warning",
      `Please enter the following details:\n${missingFields.join('\n')}`,
      [{ text: "OK" }]
    );
    return;
  }

  // Show confirmation alert
  Alert.alert(
    "Confirm Return Order Details",
    "Please review and confirm all the details of the return order before submitting. Once submitted, the order cannot be edited. Are you sure you want to proceed?",
    [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel"
      },
      {
        text: "OK",
        onPress: async () => {
          setLoading(true);

          // Transform stock_array items
          const lineItemsArray = selectedItem.map(item => ({
            product_id: item.id,
            stock_array: item.stock_array.map(stockItem => {
              const priceAsNumber = parseFloat(stockItem.price);
              const weightAsNumber = parseFloat(stockItem.total_weight);

              const formattedPrice = isNaN(priceAsNumber)
                ? '0.00'
                : (priceAsNumber).toFixed(2);

              const formattedWeight = isNaN(weightAsNumber)
                ? '0.00'
                : (weightAsNumber).toFixed(2);

              return {
                ...stockItem,
                price: formattedPrice,
                total_weight: formattedWeight,
                batch_code:0
              };
            }),
          }));

          // Define headers correctly
          const myHeaders = new Headers({
            "Content-Type": "application/json",
            "Authorization": `Bearer ${userData.token}`
          });

          // Prepare the request body
          const raw = JSON.stringify({
            types: "RT",
            po_name: "",
            vehicle_no: "NA",
            driver_name: "NA",
            company: selectedCompany.value,
            customer: dealerData.account_id,
            supplier_id: [],
            products: lineItemsArray,
            user: userData.id,
            rfq_flag: "false",
            total_price: "0.00"
          });

          console.log("raw------------>", raw);

          const requestOptions = {
            method: screen === 'edit' ? 'PUT' : 'POST',
            headers: myHeaders, 
            body: raw,
            redirect: 'follow',
          };

          // Perform API call
          try {
            const response = await fetch(
              screen === 'edit'
                ? `https://gsidev.ordosolution.com/api/edit_purchase_order/${ORDERID}/`
                : `https://gsidev.ordosolution.com/api/rfq/`,
              requestOptions
            );
            const result = await response.json();
            console.log("result of rfq", result);

            // Navigate back after success
            navigation.pop(2);
          } catch (error) {
            console.log("error", error);
          }

          setLoading(false);
        }
      }
    ]
  );
};




console.log("added",addedItems)



     useEffect(() => {
    // If there's a search query, filter the cartData
    if (cartSearch) {
      const newData = selectedItem.filter(function (item) {
        const itemData = item.name
          ? item.name?.toUpperCase()
          : "".toUpperCase();
        const queryData = cartSearch.toUpperCase();
        return itemData.indexOf(queryData) > -1;
      });

      setselectedItems(newData);
    } else {
      setselectedItems(filteredCartData);
    }
  }, [cartData, cartSearch]);

console.log("selectedItem",selectedItem);



    return (
        <PaperProvider theme={DefaultTheme}>
        <LinearGradient colors={Colors.linearColors}
            start={Colors.start} end={Colors.end}
            locations={Colors.location}
            style={{ backgroundColor: Colors.primary, borderColor: Colors.primary, justifyContent: 'center', alignItems: 'center', flex: 1 }}
        >

            {/* Modal */}
      
         


            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', height: '10%', alignItems: 'center', alignContent: 'center', textAlign: 'center', paddingHorizontal: '2%' }}>
                <TouchableOpacity onPress={() => { navigation.goBack() }} >
                    <Image source={require('../../assets/images/Refund_back.png')} style={{ height: 30, width: 30 }} />
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>

                    <Text style={{ fontFamily: 'AvenirNextCyr-Medium', fontSize: 19, marginLeft: 8, color: 'white', marginTop: '2%' }}>Returns Cart</Text>
                    <TouchableOpacity 
                     >
                    </TouchableOpacity>
                </View>
                <View>

                    <TouchableOpacity
                        style={{ alignItems: 'center' }}
                        onPress={() => { navigation.navigate('ReturnsHistory') }}
                    >
                        <MaterialCommunityIcons name="history" size={27} color="white" />

                        {/* <Text style={{ color: 'white', fontFamily: 'AvenirNextCyr-Thin' }}>History</Text> */}
                    </TouchableOpacity>
                </View>
            </View>

            <View style={{ height: '88%', backgroundColor: '#f2f2f2', width: '100%', borderTopEndRadius: 20, borderTopStartRadius: 20, paddingVertical: 10, paddingHorizontal: 20 }}>
                {cartData.length > 0 && (
                    <>
                        {/* <View style={{ justifyContent: 'space-between', flexDirection: 'row', borderRadius: 10, paddingVertical: '2%', paddingHorizontal: '1%', marginVertical: '0%' }}>
                            <Text style={{ color: Colors.primary, fontFamily: 'AvenirNextCyr-Medium', fontSize: 18 }}>My Orders </Text>
                            <TouchableOpacity
                                style={{ backgroundColor: Colors.primary, paddingVertical: 4, paddingHorizontal: 10, borderRadius: 5, elevation: 5, ...globalStyles.border }}
                                onPress={clearCartData}
                            >
                                <Text style={{ color: 'white', fontFamily: 'AvenirNextCyr-Thin' }}>Remove All</Text>
                            </TouchableOpacity>
                        </View> */}
                        <View style={{ flexDirection: 'row', marginTop: 1, gap: 10 }}>

                            {/* <View style={{ width: '100%' }}> */}
                            <Searchbar
                                style={{ marginHorizontal: '1%', marginVertical: '3%', backgroundColor: 'white', borderRadius: 4, width: '70%', height: '60%' }}
                                inputStyle={{
                                    minHeight: 0 // Add this
                                }}
                                placeholder="Search Product"
                                onChangeText={(val) => searchProductInCart(val)}
                                value={search}

                            //   clearIcon={() => (
                            //     <Searchbar.Icon
                            //       icon="close"
                            //       onPress={clearSearch}
                            //       color="#000" // Customize the clear icon color
                            //     />
                            //   )}
                            />
                            {/* </View> */}
                            <LinearGradient colors={Colors.linearColors}
                                start={Colors.start} end={Colors.end}
                                locations={Colors.ButtonsLocation}
                                style={{ marginBottom: '5%', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.primary, width: '25%', borderRadius: 4, marginTop: '3%' }}

                            >
                                <TouchableOpacity
                                    // style={{ marginVertical: '3%', alignItems: 'center', justifyContent: 'center' ,backgroundColor:Colors.primary,width:'20%',borderRadius:4}}
                                    onPress={handlePress}
                                >
                                    <Text style={{ fontFamily: 'AvenirNextCyr-Medium', color: 'white', fontSize: 16 }}>Add</Text>
                                </TouchableOpacity>
                            </LinearGradient>
                        </View>
                    </>
                )}

                {/* Modal */}
                <Portal>

     <Modal1
        visible={modalVisible}
        animationType="slide"
        contentContainerStyle={{ height:'88%', backgroundColor: 'white', borderRadius: 8, marginTop: '25%' }}
        onRequestClose={() => setModalVisible(false)}
        transparent>
                  

    {/* <View style={{    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    paddingHorizontal: 1,}}> */}
 {/* <View style={styles.modalContent2}> */}
   <View style={styles.modalHeader2}>
      
    {selectedCategory ? (
  <TouchableOpacity
   onPress={handleBackToCategory}    

  >
    <Ionicons name="arrow-back" size={24} color="grey" />
  </TouchableOpacity>
) : <Text> </Text>}

          <Text style={styles.modalTitle2}>Add Products</Text>
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
      {/* </View> */}
      {/* </View> */}
                </Modal1>
                </Portal>

 <Portal>
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
            }}>Select a company for return
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
</Portal>



                <Modal visible={detailsModal} transparent={true} >
                <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                    <View style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", flex: 1, justifyContent: 'center', paddingHorizontal: '4%' }}>

                        <View style={{ backgroundColor: 'white', borderRadius: 4, paddingHorizontal: '4%', paddingVertical: '3%' }}>

                        
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: '4%' }}>
                                <Text style={{ fontFamily: 'AvenirNextCyr-Bold', fontSize: 17, alignItems: 'center', color:Colors.black }}>Add Product Details</Text>
                                <TouchableOpacity onPress={() => { handleClose() }}>
                                    <AntDesign name={'closecircleo'} color={'black'} size={20} />

                                </TouchableOpacity>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    {/* <Image source={ {uri:productData[0].product_image}}/> */}
                                    {selectedItem.product_image && selectedItem.product_image.length > 0 ? (
                                        <Image
                                            source={{ uri: selectedItem.product_image[0] }} // Use the first image
                                            style={styles.imageView}
                                        />
                                    ) : (
                                        <Image
                                            source={require("../../assets/images/noImagee.png")} // Use default image
                                            style={styles.imageView}
                                        />
                                    )}
                                </View>

                                <View style={{ flexWrap: 'wrap',}}>
                                    <Text style={{ ...styles.text, fontFamily: 'AvenirNextCyr-Medium', color: Colors.primary,width:'90%' }}>{selectedItem?.name}</Text>
                                    <Text style={styles.text}>#{selectedItem?.brand?.brand_name}</Text>
                                    {/* <Text style={styles.text}>{item.manufacturer}</Text> */}
                                    <Text style={styles.text}>INR  {Number(selectedItem?.product_price)}</Text>
                                    {/* <Text style={styles.text}>SKU Price : 4567</Text> */}
                                </View>
                            </View>

                            <View >
                                <Text style={styles.modalTitle}>Quantity</Text>
                                <TextInput style={styles.cNameTextInput} placeholder='Quantity'
                                    onChangeText={text => setQty(text)}
                                    autoCapitalize='none'
                                    keyboardType='numeric'
                                    value={qty}
                                    returnKeyType="done"
                                    placeholderTextColor={'gray'}
                                />

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
                                <View style={{ flexDirection: 'row' }}>
                                    {base64img && <Image source={{ uri: base64img }} style={styles.imgStyle} />}
                                    {base64img && <TouchableOpacity style={{ marginLeft: 5, marginBottom: 5, alignSelf: 'flex-end' }} onPress={() => {
                                        setBase64img('')
                                    }}>
                                        <AntDesign name='delete' size={20} color={`black`} />
                                    </TouchableOpacity>}
                                </View>
                                <Text style={styles.label}>Remarks</Text>
                                <TextInput
                                    // multiline={true}
                                    // numberOfLines={5}
                                    placeholder="Enter Text..."
                                    placeholderTextColor={'gray'}
                                    style={styles.textarea}
                                    onChangeText={(val) => { setRemarks(val) }}
                                    value={remarks}
                                    onSubmit={Keyboard.dismiss}
                                    returnKeyType="done"
                                />


                            </View>


                            <LinearGradient
                                colors={Colors.linearColors}
                                start={Colors.start}
                                end={Colors.end}
                                locations={Colors.ButtonsLocation}
                                style={{ borderRadius: 20, }}

                            >
                                <TouchableOpacity
                                    style={{ width: '100%', paddingVertical: '3%', alignItems: 'center', justifyContent: 'center' }}
                                    onPress={() => { addProduct(selectedItem) }}
                                >
                                    <Text style={{ fontFamily: 'AvenirNextCyr-Bold', color: 'white', fontSize: 16 }}>Add</Text>
                                </TouchableOpacity>

                            </LinearGradient>
                        </View>
                    </View>
                    </ScrollView>
      </KeyboardAvoidingView>
                </Modal>

                {/* Modal */}
                {/* <View style={{ marginLeft: 10 }}>
                <Text style={[styles.textColor, {textAlign:'center'}]}>OrderTotals</Text>
            </View> */}
                {/* <View style={{ justifyContent: 'space-around', flexDirection: 'row', borderRadius: 10, paddingVertical: '2%', paddingHorizontal: '2%', backgroundColor: '#E4E4E4', marginVertical: '2%' }}>
                <Text style={styles.textColor}>Products:<Text style={styles.textValue}> {cartData.length}</Text> </Text>
                <Text style={styles.textColor}>Qty:<Text style={styles.textValue}>{totalQty}</Text> </Text>
                <Text style={styles.textColor}>Price: INR <Text style={styles.textValue}> {totalAmt ? totalAmt : 0}</Text></Text>
            </View> */}
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
                  inputStyle={{ minHeight: 0 }}
                  ref={searchbarRef}
                  placeholder="Search Product"
                  placeholderTextColor={{color:'lightgray'}}
                  onChangeText={(val) => { setCartSearch(val)}}
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
                {selectedItem.length === 0 ? (
                    <>
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
                        <View>

                            <Text style={{ textAlign: 'center', fontFamily: 'AvenirNextCyr-Medium', fontSize: 23,  color: "#571A9B",  marginBottom:'2%' }}>Your Cart is Empty</Text>
                            <Text style={{ textAlign: 'center', fontFamily: 'AvenirNextCyr-Medium', fontSize: 14,  color: "#7A4AB0", }}>Looks like you haven’t  added {'\n'} anything to your cart yet </Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: '4%' }}>
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
                                            style={{ color: "white", fontFamily: "AvenirNextCyr-Medium" }}
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
                    </>
                ) : (
                  
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={selectedItem}
                        keyboardShouldPersistTaps='handled'

                        renderItem={({ item, index }) =>
                          
                             <TouchableOpacity 
  style={styles.elementsView}
  onPress={() => {
    setModalVisible1(true);
    setSelectedItemName(item?.name);
     setSelectedItemId(item?.id);
     setBaseUOM(item?.unit_of_measure);
     setSelectedItemUOM(item?.uom_list)
  }}
>
{/* 
      // ORDO GSI APP_832 | 09-Apr-2025 | Sahana 
      // Fixed an issue  based on the product you select, it fetches the UOM (Unit of Measurement) options specific to that product from API and displays in the dropdown option*/}
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
                        onPress={() => deleteProduct(item?.id)}
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

                        }
                        keyExtractor={(item) => item.id.toString()}
                    />
                )}
             {selectedItem.length > 0 && selectedItem.every(item => item.stock_array && item.stock_array.length > 0) && (
  <LinearGradient 
    colors={Colors.linearColors}
    start={Colors.start}
    end={Colors.end}
    locations={Colors.ButtonsLocation}
    style={{ 
      backgroundColor: Colors.primary, 
      borderColor: Colors.primary, 
      borderRadius: 50, 
      justifyContent: 'center', 
      alignItems: 'center', 
      flexDirection: 'row', 
      paddingVertical: '4%', 
      marginTop: '3%' 
    }}
  >
    <TouchableOpacity 
      style={styles.button} 
      onPress={returnOrder} 
      activeOpacity={0.8}
    >
      <Text style={styles.btnText}>Place Return</Text>
    </TouchableOpacity>
  </LinearGradient>
)}


            </View>





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
                  {/* <Text style={{ flex:1.9, fontSize: 13, fontWeight: 'bold', textAlign: 'center',color:'black' }}>Batch Code</Text> */}
                </>
              ) : (item.uom === 2 || item.uom === 6 ) ? (
                <>
                  <Text style={{ flex: 1, fontSize: 13, fontWeight: 'bold', textAlign: 'center',color:'black' }}>Qty</Text>
                  <Text style={{ flex: 1.5, fontSize: 13, fontWeight: 'bold', textAlign: 'center',color:'black' }}>UOM</Text>
                  <Text style={{ flex: 2.3, fontSize: 13, fontWeight: 'bold', textAlign: 'center',color:'black' }}>Price</Text>
                  <Text style={{ flex: 1, fontSize: 13, fontWeight: 'bold', textAlign: 'center',color:'black' }}>Weight</Text>
                  <Text style={{ flex: 1.8, fontSize: 13, fontWeight: 'bold', textAlign: 'center' ,color:'black'}}>Pieces</Text>
                  {/* <Text style={{ flex: 2.5, fontSize: 13, fontWeight: 'bold', textAlign: 'center',color:'black' }}>Batch Code</Text> */}
                </>
              ) : (item.uom === 1) && (
                <>
                  <Text style={{ flex: 1, fontSize: 13, fontWeight: 'bold', textAlign: 'center',color:'black' }}>Qty</Text>
                  <Text style={{ flex: 2, fontSize: 13, fontWeight: 'bold', textAlign: 'center',color:'black' }}>UOM</Text>
                  <Text style={{ flex: 2, fontSize: 13, fontWeight: 'bold', textAlign: 'center' ,color:'black'}}>Price</Text>
                  <Text style={{ flex: 1.8, fontSize: 13, fontWeight: 'bold', textAlign: 'center',color:'black' }}>Weight</Text>
                  {/* <Text style={{ flex: 2.5, fontSize: 13, fontWeight: 'bold', textAlign: 'center',color:'black' }}>Batch Code</Text> */}
                </>
              )}
            </View>
          ) : null}

          {/* Data Row */}
          <View style={{ flexDirection: 'row', marginBottom: 10, alignItems: 'center', gap: 1 }}>
            <TextInput
              style={{ flex:1, borderWidth: 1, borderColor: '#ccc', padding: 5, backgroundColor: '#fff', color: 'black', marginHorizontal: 3 ,height:38}}
              placeholder="Qty"
              placeholderTextColor={'gray'}
              keyboardType="numeric"
              value={item.qty}
              onChangeText={(text) => {
                const newRows = [...rows];
                newRows[index].qty = text;
                setRows(newRows);
              }}
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
            <MaskedTextInput
              type="currency"
              options={{ decimalSeparator: '.', groupSeparator: ',', precision: 2 }}
              value={item.price}
              onChangeText={(text, rawText) => {
                const newRows = [...rows];
                newRows[index].price = rawText;
                setRows(newRows);
              }}
              style={{ flex: 1.6, borderWidth: 1, borderColor: '#ccc', padding: 5, backgroundColor: '#fff', color: 'black', marginHorizontal: 3 ,height:38}}
              keyboardType="numeric"
            />

          
            <MaskedTextInput
              type="currency"
              options={{ decimalSeparator: '.', groupSeparator: ',', precision: 2 }}
              value={item.total_weight}
              onChangeText={(text, rawText) => {
                const newRows = [...rows];
                newRows[index].total_weight = rawText;
                setRows(newRows);
              }}
              style={{ flex: 1.2, borderWidth: 1, borderColor: '#ccc', padding: 5, backgroundColor: '#fff', color: 'black', marginHorizontal: 3 ,height:38}}
              keyboardType="numeric"
            />



{item.uom === 2 || item.uom === 6 ? (
              <TextInput
                style={{ flex: 1.5, borderWidth: 1, borderColor: '#ccc', padding: 5, backgroundColor: '#fff', color: 'black', marginHorizontal: 3 ,height:38}}
                placeholder="Pieces"
                placeholderTextColor={'gray'}
                keyboardType="numeric"
                value={item.pieces}
                onChangeText={(text) => {
                  const newRows = [...rows];
                  newRows[index].pieces = text;
                  setRows(newRows);
                }}
                returnKeyType="done"
              />
            ) : null}
             {/* <TextInput
                style={{ flex: 2, borderWidth: 1, borderColor: '#ccc', padding: 5, backgroundColor: '#fff', color: 'black', marginHorizontal: 3 }}
                placeholder="Batch Code"
                placeholderTextColor={'gray'}
                value={item.batch_code}
                onChangeText={(text) => {
                  const newRows = [...rows];
                  newRows[index].batch_code = text;
                  setRows(newRows);
                }}
                returnKeyType="done"
              /> */}
                <TouchableOpacity
                      style={styles.deleteIconContainer}
                      onPress={() => deleteRow(index)}
                    >
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
                saveRowsToSelectedItem(); // Save the rows to the selected item
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

        

             <LoadingView visible={loading} message="Please Wait ..." />

        </LinearGradient>
        </PaperProvider>
    )





    return (
        <View style={styles.container}>
            {/* Modal */}

      
            <Modal visible={isModalVisible} transparent>
                <TouchableOpacity
                    style={styles.modalContainer1}
                    activeOpacity={1}
                // onPressOut={closeModal}
                >
                    <View style={styles.modalContent1}>
                        <TouchableOpacity style={styles.closeIcon} onPress={() => setIsModalVisible(false)}>
                            <Icon name="times" size={20} color="#000" />
                        </TouchableOpacity>
                        <View style={styles.modalInnerContent}>
                            <View style={styles.container1}>
                                <Text style={styles.ModalText1}>Instructions:</Text>

                                <Text style={styles.step}>1. Select the product you wish to add to your return order.</Text>
                                <Text style={styles.step}>2. Enter the details of the Product.</Text>
                                <Text style={styles.step}>3. Click on Place Return option to Send the Return Order request for approval.</Text>

                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </Modal>
            {/* Modal */}



            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View>
                    <TouchableOpacity onPress={() => navigation.goBack()} >
                        <AntDesign name='arrowleft' size={25} color={Colors.black} />
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1, alignItems: 'center' }}>
                    <Text style={{ fontSize: 20, color: Colors.primary, fontFamily: 'AvenirNextCyr-Medium', marginVertical: 6 }}>Returns Cart</Text>
                </View>
                <View>
                    <TouchableOpacity
                     >
                    </TouchableOpacity>
                </View>
                <View />
                {/* <TouchableOpacity style={styles.saveButtonView} >
                    <Text style={styles.sendButton}>Return</Text>
                </TouchableOpacity> */}
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 10 }}>
                <TouchableOpacity
                    style={{ backgroundColor: 'white', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 5, elevation: 5, width: '25%' }}
                    onPress={handlePress}
                >
                    <Text style={{ color: Colors.primary, fontFamily: 'AvenirNextCyr-Thin', textTransform: 'uppercase', textAlign: 'center' }}>ADD</Text>
                </TouchableOpacity>

                {cartData.length > 0 && (
                    <TouchableOpacity
                        style={{ backgroundColor: 'white', paddingVertical: 5, paddingHorizontal: 2, borderRadius: 5, elevation: 5, width: '40%' }}
                        onPress={AlertForOrder}
                    >
                        <Text style={{ color: 'green', fontFamily: 'AvenirNextCyr-Thin', textTransform: 'uppercase', textAlign: 'center' }}>Place Return</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity
                    style={{ backgroundColor: 'white', paddingVertical: 5, paddingHorizontal: 20, marginLeft: 10, borderRadius: 5, elevation: 5 }}
                    onPress={clearCartData}
                >

                    <Text style={{ color: 'red', fontFamily: 'AvenirNextCyr-Thin', textAlign: 'center' }}>DELETE</Text>
                </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', marginTop: 10 }}>
                {/* <TouchableOpacity
                //onPress={checkPermission}
                >
                    <Image style={{ height: 50, width: 50, marginRight: 5 }} source={require('../../assets/images/scannerImage.jpeg')} />
                </TouchableOpacity> */}
                {/* <TouchableOpacity style={styles.modalSearchContainer} onPress={handlePress}> */}
                <View style={styles.modalSearchContainer} >
                    <TextInput
                        keyboardShouldPersistTaps='always'
                        style={styles.input}
                        value={search}
                        placeholder="Search products"
                        placeholderTextColor="gray"
                        onChangeText={(val) => searchProductInCart(val)}

                    />
                    <View style={styles.searchButton}>
                        <AntDesign name="search1" size={20} color="black" />
                    </View>
                </View>
                {/* </TouchableOpacity> */}
                {/* <TouchableOpacity
                    style={{ height: 45, marginTop: 2, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', borderRadius: 8, paddingHorizontal: 10, elevation: 5, flex: 0.2, marginLeft: 5 }}
                    onPress={() => {
                        setSearch('');
                        setFilteredData(masterData)
                        Keyboard.dismiss();
                    }
                    }
                >
                    <Text style={{ color: 'blue', fontFamily: 'AvenirNextCyr-Thin', fontSize: 14 }}>+ Add</Text>

                </TouchableOpacity> */}
                {/* Modal */}
                <Modal visible={modalVisible} transparent>
                    {/* <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalText}>Hello</Text>
                            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
                                <Text style={styles.closeButtonText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View> */}
                    <View style={{ flex: 1, backgroundColor: 'grey', justifyContent: 'center', paddingHorizontal: 10 }}>

                        <View style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: 5, borderRadius: 8 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <View>

                                </View>
                                <Text style={{ alignSelf: 'center', fontSize: 20, color: 'black', fontFamily: 'AvenirNextCyr-Thin', marginVertical: 10 }}>Search Products</Text>
                                <TouchableOpacity style={{ marginRight: 10 }} onPress={() => {
                                    setSearch('');
                                    setModalVisible(false)
                                }}>
                                    <AntDesign name='close' size={20} color={`black`} />
                                </TouchableOpacity>
                            </View>
                            {/* <View style={{height: 40}} /> */}

                            <View style={{ flexDirection: 'row' }}>
                                <View style={styles.modalSearchContainer}>
                                    <TextInput
                                        keyboardShouldPersistTaps='always'
                                        style={styles.input}
                                        value={search}
                                        placeholder="Search product"
                                        placeholderTextColor="gray"
                                        onChangeText={(val) => searchProduct(val)}

                                    />
                                    <TouchableOpacity style={styles.searchButton} >
                                        <AntDesign name="search1" size={20} color="black" />
                                    </TouchableOpacity>
                                </View>
                                <TouchableOpacity
                                    style={{ height: 45, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', borderRadius: 8, paddingHorizontal: 16, elevation: 5, flex: 0.2, marginLeft: 10 }}
                                    onPress={() => {
                                        setSearch('');
                                        setFilteredData(masterData)
                                        Keyboard.dismiss();
                                    }
                                    }
                                >
                                    <Text style={{ color: '#6B1594', fontFamily: 'AvenirNextCyr-Thin', fontSize: 14 }}>Clear</Text>

                                </TouchableOpacity>
                            </View>

                            <FlatList
                                showsVerticalScrollIndicator={false}
                                data={filteredData}
                                keyboardShouldPersistTaps='handled'
                                renderItem={({ item }) =>
                                    <Pressable style={styles.elementsView} onPress={() => {
                                        //setModalVisible(false);
                                        //navigation.navigate('ProductDetails', { item: item })
                                    }
                                    }
                                    >

                                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                            <Image

                                                source={{ uri: item.imgsrc }}
                                                style={{
                                                    ...styles.imageView,
                                                }}
                                            />
                                            <View style={{
                                                flex: 1,
                                                borderLeftWidth: 1.5,
                                                paddingLeft: 15,
                                                marginLeft: 10,
                                                borderStyle: 'dotted',
                                                borderColor: 'grey',
                                            }}>

                                                <Text style={{ fontSize: 12, color: 'red', fontFamily: 'AvenirNextCyr-Medium', marginBottom: 2 }} > {item.itemid}</Text>
                                                <Text style={{ color: Colors.primary, fontSize: 12, fontFamily: 'AvenirNextCyr-Medium', marginTop: 4, }}>{item.description}</Text>
                                                {/* <Text style={{ color: 'green', fontSize: 12, fontFamily: 'AvenirNextCyr-Thin' }}>{Number(item.stock) > 0 ? `Current Stock - ${item.stock}` : <Text style={{ color: 'red', fontSize: 12, fontFamily: 'AvenirNextCyr-Thin' }} >Out of stock</Text>}</Text> */}
                                                <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Thin' }}>{item.material_type} </Text>
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                    <Text style={{ color: 'grey', fontSize: 12, fontFamily: 'AvenirNextCyr-Thin', borderBottomColor: 'grey', borderBottomWidth: 0.5, }}>Net wt: {item.net_weight} Kg</Text>
                                                    {/* <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}>AED {Number(item.price)}</Text> */}

                                                </View>

                                            </View>

                                        </View>


                                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 3 }}>
                                            <TouchableOpacity
                                                style={{ justifyContent: 'center', alignItems: 'center', padding: 10, paddingHorizontal: 16, borderRadius: 5, backgroundColor: '#fff', elevation: 5 }}
                                                onPress={() => {
                                                    //checking product exists in the cart
                                                    //setModalVisible(false);
                                                    let productExist = false
                                                    cartData.forEach((itm) => {
                                                        if (itm.id == item.id) {
                                                            console.log("product already exist return cart")
                                                            Alert.alert('Product Exists', 'Product already exists in your cart')
                                                            productExist = true;
                                                        }
                                                    })
                                                    if (!productExist) {
                                                        setModalVisible(false);
                                                        navigation.navigate("ReturnAddProduct", { item: item });
                                                    }
                                                }}
                                            >
                                                <Text style={{ color: Colors.primary, fontSize: 12, fontFamily: 'AvenirNextCyr-Thin' }}>+Add</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </Pressable>
                                }
                                keyExtractor={(item) => item.id.toString()}
                            />
                        </View>
                    </View>
                </Modal>
                {/* Modal */}


                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible2}
                >
                    <View style={styles.modalContainer}>

                        <View style={styles.modalContent}>
                            <TouchableOpacity style={styles.closeIcon} onPress={() => setModalVisible2(false)}>
                                <Icon name="times" size={20} color="#000" />
                            </TouchableOpacity>
                            <View style={styles.modalInnerContent}>
                                <Text style={styles.modalText}>{totalCount}</Text>
                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity style={styles.button} onPress={returnOrder}>
                                        <Text style={styles.buttonText1}>Yes</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.button} onPress={cancelReturn}>
                                        <Text style={styles.buttonText1}>No</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>


            </View>


            <View style={{ marginLeft: 10 }}>
                <Text style={styles.textColor}>Order Totals:</Text>
            </View>
            <View style={{ justifyContent: 'space-between', flexDirection: 'row', marginHorizontal: 10 }}>
                <Text style={styles.textColor}>Products: {cartData.length}</Text>
                {/* <Text style={styles.textColor}>Qty: {totalQty}</Text> */}
                {/* <Text style={styles.textColor}>Price: <Text style={{ fontFamily: 'AvenirNextCyr-Medium' }}>AED {totalAmt}</Text></Text> */}
            </View>
            <FlatList
                showsVerticalScrollIndicator={false}
                data={filteredCartData}
                keyboardShouldPersistTaps='handled'
                // renderItem={({ item, index, array }) =>
                //     <View style={styles.elementsView}>
                //         <View style={{ flexDirection: 'row', }}>
                //             <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                //                 <Image
                //                     source={{ uri: item.imageSource }}
                //                     style={styles.imageView}
                //                 />
                //                 <Text style={styles.imageText} >{item.imageNumber}</Text>
                //             </View>
                //             <View style={{ marginLeft: 10, marginTop: 20 }}>
                //                 <View style={{ borderBottomColor: 'grey', borderBottomWidth: 0.5 }}>
                //                     <Text>Net wt: {item.netWt}</Text>
                //                 </View>
                //                 <TouchableOpacity >
                //                     <Text style={styles.elementText} >{item.name}</Text>
                //                 </TouchableOpacity>
                //             </View>
                //             <View>
                //                 <View style={{ alignSelf: 'flex-end', marginRight: 16 }}>
                //                     <Image source={require('../../assets/images/orderClose.png')} style={styles.orderCloseView} />
                //                     {/* </View>
                //                 <View style={styles.rupeesView}> */}
                //                     <Text style={styles.textColor}>{item.rupees}</Text>
                //                 </View>
                //                 <View style={{ flexDirection: 'row' }}>
                //                     <View>
                //                         <TouchableOpacity
                //                             style={styles.minusButton}
                //                         >
                //                             <Text style={{ color: 'black' }}>-</Text>
                //                         </TouchableOpacity>
                //                     </View>
                //                     <View style={styles.quantityCount}>
                //                         <Text style={{ color: 'black' }}>{item.quantity}</Text>
                //                     </View>
                //                     <View>
                //                         <TouchableOpacity
                //                             style={styles.quantityCount}
                //                         >
                //                             <Text style={{ color: 'black' }}>+</Text>
                //                         </TouchableOpacity>
                //                     </View>
                //                 </View>
                //             </View>
                //         </View>

                //     </View>
                // }
                renderItem={({ item, index }) =>
                    <Pressable style={styles.elementsView} >
                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                            <Image
                                source={{ uri: item?.imgsrc }}
                                style={{ width: 60, height: 60 }}
                            />
                            <View style={{ flex: 1, marginLeft: 8 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={{ color: 'red', fontSize: 14, fontFamily: 'AvenirNextCyr-Medium' }}>{item?.itemid}</Text>
                                    <TouchableOpacity onPress={() => deleteProduct(index)}>
                                        <Image source={require('../../assets/images/orderClose.png')} style={styles.orderCloseView} />
                                    </TouchableOpacity>
                                </View>
                                <View style={{ flexDirection: 'row', marginTop: 5, flex: 1, }}>
                                    <Text ellipsizeMode="tail" style={{ color: Colors.primary, fontSize: 14, fontFamily: 'AvenirNextCyr-Medium', flex: 1 }}>{item?.description}</Text>
                                    {/* <Text style={{ color: 'black', fontSize: 14, fontFamily: 'AvenirNextCyr-Medium',flex:0.2 }}>AED {Number(item?.price)}</Text> */}

                                </View>
                                <Text style={{ color: 'grey', fontSize: 14, fontFamily: 'AvenirNextCyr-Thin', borderBottomColor: 'grey', borderBottomWidth: 0.5 }}>Net wt: {item?.net_weight}</Text>
                                <Text numberOfLines={1} style={{ color: Colors.black, fontSize: 14, fontFamily: 'AvenirNextCyr-Thin' }}>Quantity: {item?.qty}</Text>




                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5, paddingLeft: 5 }}>
                            <Text style={{ fontSize: 14, color: 'black', fontFamily: 'AvenirNextCyr-Thin', }}>{item?.hsn}</Text>
                            {/* <View style={{ flexDirection: 'row', }}>
                        <TouchableOpacity style={{ width: 40, height: 30, borderRadius: 5, borderColor: 'grey', borderWidth: 1, justifyContent: 'center', alignItems: 'center', marginRight: 10 }}
                            onPress={() => updateQuantity(item, 'minus', index)} >
                            <Text style={{ color: 'black', fontSize: 14, fontFamily: 'AvenirNextCyr-Medium' }}>-</Text>
                        </TouchableOpacity>
                        <View style={{ width: 45, height: 30, borderRadius: 5, borderColor: 'grey', borderWidth: 1, justifyContent: 'center', alignItems: 'center', marginRight: 10 }}>
                            <Text style={{ color: 'black', fontSize: 14, fontFamily: 'AvenirNextCyr-Medium' }}>{Number(item.qty)}</Text>
                        </View>
                        <TouchableOpacity style={{ width: 40, height: 30, borderRadius: 5, borderColor: 'grey', borderWidth: 1, justifyContent: 'center', alignItems: 'center' }}
                            onPress={() => updateQuantity(item, 'add', index)}
                        >
                            <Text style={{ color: 'black', fontSize: 14, fontFamily: 'AvenirNextCyr-Medium' }}>+</Text>
                        </TouchableOpacity>

                    </View> */}
                        </View>
                    </Pressable>


                }
                keyExtractor={(item) => item.id.toString()}

            />

            
             <LoadingView visible={loading} message="Please Wait ..." />
        
        </View>

    )
}

export default SalesReturn

const styles = StyleSheet.create({

    container: {
        flex: 1,
        padding: 24,
        backgroundColor: 'white'
    },
    elementsView: {
        backgroundColor: "white",
        margin: 5,
        //borderColor: 'black',
        //flexDirection: 'row',
        //justifyContent: 'space-between',
        //alignItems: 'center',
        marginBottom: 16,
        borderRadius: 8,
        elevation: 5,
        padding: 16
        //borderColor: '#fff',
        //borderWidth: 0.5
    },
    imageView: {
        width: 70,
        height: 70,
        // resizeMode:'cover'
        borderRadius: 10,
        // marginTop: 20,
        // marginBottom: 10
    },
    elementText: {
        fontSize: 15,
        fontFamily: 'AvenirNextCyr-Medium',
        color: 'black'
    },
    minusButton: {
        width: 45,
        height: 30,
        borderColor: 'grey',
        borderWidth: 0.5,
        borderRadius: 5,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
        marginTop: 30,
        marginLeft: 10
    },
    modalMinusButton: {
        width: 35,
        height: 20,
        borderColor: 'grey',
        borderWidth: 0.5,
        borderRadius: 5,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
        marginTop: 40,
        marginLeft: 10
    },
    quantityCount: {
        width: 45,
        height: 30,
        borderColor: 'grey',
        borderWidth: 0.5,
        borderRadius: 5,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
        marginTop: 30,
        marginLeft: 1
    },
    modalQuantityCount: {
        width: 35,
        height: 20,
        borderColor: 'grey',
        borderWidth: 0.5,
        borderRadius: 5,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
        marginTop: 40,
        marginLeft: 1
    },
    orderCloseView: {
        height: 15,
        width: 15,
        //marginTop: 30
    },
    imageText: {
        fontSize: 15,
        fontFamily: 'AvenirNextCyr-Thin',
        color: 'black',
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'lightgray',
        borderRadius: 5,

        //paddingVertical: 5,
        paddingHorizontal: 10,
        marginLeft: 10
    },
    input: {
        flex: 1,
        fontSize: 16,
        marginRight: 10,
        fontFamily: 'AvenirNextCyr-Thin'
    },
    searchButton: {
        padding: 5,
    },
    sendButtonView: {
        borderRadius: 5,
        // borderWidth: 1,
        // borderColor: 'grey',
        backgroundColor: 'green',
        paddingVertical: 10,
        paddingHorizontal: 20,

        height: 40,
        marginLeft: 10
    },
    saveButtonView: {
        borderRadius: 5,
        // borderWidth: 1,
        // borderColor: 'grey',
        backgroundColor: Colors.primary,
        paddingVertical: 10,
        paddingHorizontal: 20,
        height: 40,
        marginLeft: 10
    },
    deleteButtonView: {
        borderRadius: 5,
        // borderWidth: 1,
        // borderColor: 'grey',
        backgroundColor: 'red',
        paddingVertical: 10,
        paddingHorizontal: 20,
        height: 40,
        marginLeft: 10
    },
    addButtonView: {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'grey',
        backgroundColor: 'white',
        paddingVertical: 10,
        paddingHorizontal: 20,
        height: 40,
        marginLeft: 10,
        alignSelf: 'center'
    },
    modalAddButtonView: {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'grey',
        backgroundColor: 'white',
        paddingVertical: 5,
        paddingHorizontal: 15,
        height: 35,
        //alignSelf: 'flex-end',
        //marginLeft: 30,
        //marginTop: 60
    },
    buttonText: {
        color: 'blue',
        fontFamily: 'AvenirNextCyr-Thin'
    },
    sendButton: {
        color: 'white',
        fontFamily: 'AvenirNextCyr-Thin'
    },
    deleteButton: {
        color: 'red'
    },
    saveButton: {
        color: 'purple'
    },
    textColor: {
        color: 'black',
        fontFamily: 'AvenirNextCyr-Thin',

    },
    searchModal: {
        backgroundColor: 'white',
        padding: 20,
        width: '90%',
        marginHorizontal: 10,
        borderRadius: 10,
        elevation: 5,
        //borderColor: 'black',
        //borderWidth: 1,
        marginVertical: 100
        // flexDirection:'row'
    },
    modalSearchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'lightgray',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
        flex: 1
    },
    modalTitle: {
        fontSize: 16,
        color: 'black',
        fontFamily: 'AvenirNextCyr-Medium'
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
    },
    modalText: {
        fontSize: 18,
        marginBottom: 10,
    },
    closeButton: {
        backgroundColor: 'blue',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignSelf: 'flex-end',
    },
    closeButtonText: {
        color: 'white',
        fontSize: 16,
    },

    modalContainer1: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent1: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 8,
        width: '90%', // Adjust the width as needed, for example '90%'
        alignSelf: 'center', // Center the modal content horizontally
    },

    closeIcon: {
        position: 'absolute',
        top: 0, // Set the top offset to 0 (right above the modal content)
        right: 5,
        padding: 5,
    },
    modalInnerContent: {
        marginTop: 1, // Add a margin to separate the icon from the modal content
    },
  
    container1: {
        backgroundColor: 'white',
        padding: 10,
        width: '100%', // Adjust the width as needed, for example '90%'
        alignSelf: 'center', // Center the container horizontally within the modal
    },
    //   instructionText: {
    //     textAlign: 'left',
    //     color: 'gray',
    //     fontSize: 15,
    //     fontFamily: 'AvenirNextCyr-Thin',
    //   },
    step: {
        textAlign: 'left',
        color: 'gray',
        fontSize: 15,
        fontFamily: 'AvenirNextCyr-Thin',
        marginBottom: 2,

    },
   
    button: {
        // height: "20%",
        justifyContent: 'center',
        alignItems: 'center',
        // borderRadius: 5,
        // backgroundColor: Colors.primary,
        // marginBottom: '3%',
        // marginTop: '3%',
        borderRadius: 50,
        width: '100%'
    },
    btnText: {
        fontFamily: 'AvenirNextCyr-Medium',
        color: '#fff',
        fontSize: 16,
    },
    buttonText1: {
        color: 'white',
        fontSize: 16,
    },


    //modal styles


    photosContainer: {
        height: 40,
        padding: 10,
        borderRadius: 10,
    },
    buttonText: {
        fontFamily: 'AvenirNextCyr-Medium',
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
        fontFamily: 'AvenirNextCyr-Medium',
        marginTop: 5


    },
    text: {
        fontFamily: 'AvenirNextCyr-Medium',
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

    cNameTextInput: {
        height: 40,
        borderWidth: 1,
        borderColor: '#B3B6B7',
        padding: 5,
        fontFamily: 'AvenirNextCyr-Medium',
        marginBottom: 10,
        marginTop: 4,
        color:'black'
    },
    buttonview: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: '1%'
    },
    label: {
        fontSize: 16,
        color: 'black',
        fontFamily: 'AvenirNextCyr-Medium',
    },
     modalContent2: {
    backgroundColor: 'white',
    paddingHorizontal: 10,
    borderRadius: 8,
    marginTop: '16%',
     backgroundColor:'green'
  },
   modalHeader2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height:'7%',
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
    modalTitle2: {
    alignSelf: 'center',
    fontSize: 20,
    color: Colors.primary,
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
})