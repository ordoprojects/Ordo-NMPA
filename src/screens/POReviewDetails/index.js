import React, {
  useState,
  useContext,
  useRef,
  useEffect,
  useCallback,
  useMemo,

} from "react";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { AuthContext } from '../../Context/AuthContext';
import { View, Dimensions, Text, ScrollView, StyleSheet, TouchableOpacity, Modal, TextInput, Alert, FlatList, Pressable, Linking ,SafeAreaView} from 'react-native'
import { BarChart } from "react-native-gifted-charts";
import Colors from '../../constants/Colors';
import uniqolor from 'uniqolor';
import { useFocusEffect } from '@react-navigation/native';
import { Image } from 'react-native-animatable';
import globalStyles from '../../styles/globalStyles';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ConvertDateTime from '../../utils/ConvertDateTime';
import { Checkbox,Searchbar } from "react-native-paper";
import { ProgressDialog } from 'react-native-simple-dialogs';
import Toast from "react-native-simple-toast";
import { MaskedTextInput } from "react-native-mask-text";
import { searchItem } from "../../utils/Search";
import { debounce } from "../../utils/Search";
import  Ionicons  from 'react-native-vector-icons/Ionicons';
import { LoadingView } from "../../components/LoadingView";
import { AnimatedFAB } from "react-native-paper";
import Comments from '../../components/Comments';

const POReviewDetails = ({ navigation, route }) => {

    const orderDetail = route.params?.orderDetails;
    console.log("🚀 ~ POReviewDetails ~ orderDetail:", orderDetail.product_list[0]?.stock_array[0])
    const [orderDetails, setOrderDetails] = useState(orderDetail);
    const screen = route.params?.screen;
    const status = route.params?.status;

    const [products, setProducts] = useState([]);
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0); 
    const { userData } = useContext(AuthContext);
    const [visible, setVisible] = useState(false)
    const [loading, setLoading] = useState(false)
    const [modalVisible, setModalVisible] = useState(false);
    const [search, setSearch] = useState("");
    const [addedItems, setAddedItems] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);

  const [selectedItem, setselectedItems] = useState([]);
  const queryParams = useRef({ limit: 10, offset: 0 });
  const [searching, setSearching] = useState(false);
  const [expandedSubCategory, setExpandedSubCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [originalCategories, setOriginalCategories] = useState([]);
  const [productSearch, setProductSearch] = useState("");
  const [productsBySubCategory, setProductsBySubCategory] = useState({});
  const [expandedOrder, setExpandedOrder] = useState(null); 
  const [dropdownItems, setDropdownItems] = useState([]);
  const [isCommentsModalVisible, setIsCommentsModalVisible] = useState(false);

  useEffect(()=>{
    getDropdown();
   },[])


  console.log('===============orderDetail=====================');
  console.log(JSON.stringify(orderDetail,null,2));
  console.log('====================================');


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

const getUomLabel = (uomId) => {
  const uom = dropdownItems.find((item) => item.id === uomId);
  return uom ? uom.label : uomId; // Default to uomId if label is not found
};


   const toggleExpand = (orderId) => {
    console.log("ord",orderId)
    setExpandedOrder(orderId === expandedOrder ? null : orderId); // Toggle expanded state
  };

 
    useEffect(() => {
        if (orderDetails && orderDetails.product_list) {
            const transformedItems = orderDetails.product_list.map(item => ({
                ...item,
                quantity: item.qty,       
                cust_price: item.price*100,
                idd:item.id,
                id:item.product_id   
            }));
            setselectedItems(transformedItems);
        }
    }, [orderDetails]);
    

    useEffect(() => {
        // Initialize products when the component mounts
        if (route.params && route.params.orderDetails && route.params.orderDetails.product_list) {
            const initializedProducts = route.params.orderDetails.product_list.map(product => ({
                ...product,
                checked: false,
                returnQty: 1,
                stockError: false,
                errorMessage: ""
            }));
            setProducts(initializedProducts);
        }
    }, []);

    const [availableCount, setAvailableCount] = useState(0);
    const [unavailableCount, setUnavailableCount] = useState(0);


    useFocusEffect(
        React.useCallback(() => {
            const availableProducts = products.filter(product => product.is_available).length;
      const unavailableProducts = products.filter(product => !product.is_available).length;
  
      setAvailableCount(availableProducts);
      setUnavailableCount(unavailableProducts);
        }, [products])
      );
  

// console.log("check available",unavailableCount,availableCount)
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


const renderProductItem = useCallback(({ item }) => {
console.log("prod",selectedItem,item.id)

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
                                  (product) => product.id === item.id
                                )
                                  ? "checked"
                                  : "unchecked"
                              }
                            />
                          </View>
                          <Text
                            style={{
                              color: "grey",
                              fontSize: 12,
                              fontFamily: "AvenirNextCyr-Thin",
                              marginTop: 1,
                            }}
                          >
                            {item.description}
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


const removeProductFromCart = (item) => {
    // Filter out the item to remove it from the array
    const updatedProducts = selectedItem.filter(
        (product) => product.idd !== item.idd
    );
    setselectedItems(updatedProducts); // Update the state with the new array
};



const handleCheckboxChange = (item) => {
    // console.log("itemmmm", item)
    if (selectedItem.find((product) => product.id === item.id)) {
        // Remove the product from selectedItem
        setselectedItems((prevselectedItems) =>
            prevselectedItems.filter((product) => product.id !== item.id)
        );
    } else {
        // Add the product to selectedItem
        setselectedItems((prevselectedItems) => [
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
              bundle_piece:item?.bundle_piece

            },
        ]);
    }
};


const changeStatus = async (orderId) => {
    // Display a confirmation dialog
    Alert.alert("Cancel Order", "Are you sure you want to cancel this order?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "Yes",
        onPress: async () => {
          var myHeaders = new Headers();
          myHeaders.append("Content-Type", "application/json");
          myHeaders.append("Authorization", `Bearer ${userData.token}`);

          var raw = JSON.stringify({
            "id": orderId,
            "stages": "POC",
            "status": "CL"
          });

          var requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
          };

          await fetch(
            `https://gsidev.ordosolution.com/api/rfq/update_rfq_details/`,
            requestOptions
          )
            .then((response) => {
              if (response.status === 200) {
                Toast.show("Order cancelled successfully", Toast.LONG);
               navigation.goBack();
              }
            })

            .catch((error) => console.log("api error", error));
        },
      },
    ]);
  };


  const returnStatus = async (orderId) => {
    // Display a confirmation dialog
    Alert.alert("Approve Return Order", "Are you sure you want to aprrove this order?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "Yes",
        onPress: async () => {
          var myHeaders = new Headers();
          myHeaders.append("Content-Type", "application/json");
          myHeaders.append("Authorization", `Bearer ${userData.token}`);

          var raw = JSON.stringify({
            "status":"Confirmed"
          });

          console.log('==============raw======================');
          console.log(raw);
          console.log('====================================');

          var requestOptions = {
            method: "PUT",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
          };

          await fetch(
            `https://gsidev.ordosolution.com/api/return_update/${orderId}/`,
            requestOptions
          )
            .then((response) => {
              if (response.status === 200) {
                Toast.show("Order Approved successfully", Toast.LONG);
               navigation.goBack();
              }
            })

            .catch((error) => console.log("api error", error));
        },
      },
    ]);
  };


  const handleSubmit = async () => {
        setLoading(true);
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${userData.token}`);

        let transformedData = [];
        let flag = false

        selectedItem.forEach((item) => {
            if (item?.price) {
                transformedData.push({
                    product_id: item?.idd ? item?.idd :item?.id ,
                    qty: item.quantity,
                    price: isNaN(item?.price) ? parseFloat(item?.price.replace(/[^0-9.-]+/g, "")).toFixed(2) : parseFloat(item?.price).toFixed(2) 

                });
            } else {
                flag = true
            }
        });

        var raw = JSON.stringify({
            products: transformedData,
            total_price:orderDetails?.total_price,
            po_id: orderDetails.id,
        });

        console.log("Raw--------------->:", raw);

        var requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
        };

        await fetch("https://gsidev.ordosolution.com/api/update_purchase_order/", requestOptions)
            .then((response) => response.json())
            .then(async (result) => {
                console.log("result of rfq", result);
                Alert.alert("Success", "PO Approved successfully", [
                    { text: "OK", onPress: () => navigation.goBack() },
                ]);
            })
            .catch((error) => console.log("error", error));
        setLoading(false);
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
        console.log("newPrice", newPrice,itemId);
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


    console.log('============screen========================');
    console.log(screen);
    console.log('=============status=======================');
    console.log(status);

    return (
        <View style={{ flex: 1, padding: 24, backgroundColor: 'white' }}>

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image
                        source={require("../../assets/images/Refund_back.png")}
                        style={{ height: 30, width: 30, tintColor: Colors.primary }}
                    />
                </TouchableOpacity>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    {screen === "PO" && status!=='RT'?
                     (<Text style={{ fontSize: 20, color: Colors.primary, fontFamily: 'AvenirNextCyr-Medium' }}>{orderDetails.name} ({orderDetails.supplier_name}-{orderDetails.supplier_id})</Text>) :
                    (<Text style={{ fontSize: 20, color: Colors.primary, fontFamily: 'AvenirNextCyr-Medium' }}> {orderDetails.name} ({screen === 'Returns' ||  status=='RT' ? orderDetails.customer_name : orderDetails.assignee_name}-{ screen === 'Returns' ||  status=='RT' ? orderDetails.customer_id :  orderDetails.assigne_to})</Text>)}
                </View>
                <View>
                {orderDetails?.status==="Pending" && !orderDetails.name.startsWith("RT") &&
                <TouchableOpacity style={{backgroundColor:Colors.primary ,borderRadius:5,padding:5,elevation:4 ,height:34,width:35}}
                    onPress={() => navigation.navigate("CreatePO", { screen: 'edit', routeId: orderDetails?.id, cartData: orderDetail.product_list, ORDERID: orderDetails?.id ,item:orderDetails})}
                >
                    <AntDesign name="edit" size={22} color="white" />
                </TouchableOpacity>
              }
              </View>
            </View>

            <View style={styles.card}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: '5%', paddingTop: '5%', alignItems: 'center' }}>
                    <Text style={styles.cardTitle}>Order Details</Text>
                    <View style={{
                        paddingHorizontal: '4%',
                        paddingVertical: '2%',
                        backgroundColor: orderDetails.status === 'Cancel' || orderDetails.status === 'Cancelled' || orderDetails.status === 'Pending Balance' || orderDetails.status === 'Missing Product' 
    ? '#d11a2a' 
    : (orderDetails.status === 'Pending' 
        ? 'orange' 
        : (orderDetails.status === 'In Transit' 
            ? '#005000' 
            : (orderDetails.status === 'On Hold' 
                ? 'rgba(255, 165, 0, 0.8)' 
                : 'green'
            )
        )
    )
,
                        borderRadius: 20
                    }}>
                        <Text style={{ fontFamily: 'AvenirNextCyr-Medium', fontSize: 14, color: 'white' }}>
                            {orderDetails.status === 'Cancel' ? 'Canceled' : (orderDetails.status === 'In Transit' ? 'In Transit' : orderDetails.status)}
                        </Text>
                    </View>
                </View>

                <View style={styles.expandedContent}>
                    <View style={{ paddingHorizontal: '5%', paddingBottom: '2%' }}>
                    <View style={{...styles.row,gap:10}}>
                            <Text style={styles.title}>{ screen === 'Returns' ||  status=='RT' ? 'Return To' : 'Bill To'}</Text>
                            <Text style={{...styles.value,flex:1,textAlign:'right'}} numberOfLines={2}>{orderDetails?.company_name}</Text>
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.title}>Order ID</Text>
                            <Text style={styles.value}>{orderDetails.name}</Text>
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.title}>{screen === "PO" && status!=='RT' ? 'Supplier' :  status=='RT' ? 'Customer': 'Customer'}</Text>
                            <Text style={[styles.value,{textAlign:'right',width:'70%'}]}>{screen === "PO" && status!=='RT' ? orderDetails.supplier_name : screen === 'Returns' || status==='RT'? orderDetails.customer_name : orderDetails.assignee_name}</Text>
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.title}>Order Placed</Text>
                            <Text style={styles.value}>{ConvertDateTime(orderDetails?.created_at).formattedDate} {ConvertDateTime(orderDetails?.created_at).formattedTime}</Text>
                        </View>

                        {/* <View style={styles.row}>
                            <Text style={styles.title}>Total Qty</Text>
                            <Text style={styles.value}>{totalQuantity}</Text>
                        </View> */}
{
  screen === 'Returns' ||  status=='RT'? 
                       
                      null :  <View style={styles.row}>
                        <Text style={styles.title}>Total Price</Text>
                        <Text style={styles.value}>
                                                           {Number(orderDetails?.total_price)? 
         new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(orderDetails?.total_price) : 
         new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(0)
       }
                      </Text>
                    </View>
}
                    </View>
                </View>
            </View>


            <View style={[styles.card1, { marginBottom: '10%', paddingHorizontal: '3%' }]}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: '3%', paddingVertical: '3%', borderBottomWidth: 1, borderBottomColor: 'grey',alignItems:'center' }}>
                    <Text style={styles.cardTitle}>Products</Text>
                {/* {
                  screen === 'Returns' ||  status=='RT'? 
                   null : 
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
} */}
                </View>

                <View style={styles.ProductListContainer}>
                {orderDetails.status==="Pending" ? 
                <FlatList
                        showsVerticalScrollIndicator={false}
                        data={selectedItem}
                        keyboardShouldPersistTaps="handled"
                        key={(item) => { item.id.toString() }}
                        renderItem={({ item }) => (
                            <View style={styles.elementsView}>
                                <View
                                    style={{ flexDirection: "row", justifyContent: "center" }}
                                >
                                    <Pressable>
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
                                    </Pressable>
                                    <View
                                        style={{
                                            flex: 1,
                                            marginLeft: 10,
                                        }}
                                    >
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Text
                                                style={{
                                                    color: Colors.primary,
                                                    fontSize: 14,
                                                    fontFamily: "AvenirNextCyr-Medium",
                                                    marginTop: 5,
                                                    flex: 2,
                                                    flexWrap: 'wrap'
                                                }}
                                            >
                                                {item.name}
                                            </Text>

                                        
                                        </View>
   <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' ,marginTop:2}}>
                <Text style={{ color: Colors.black, fontSize: 14, fontFamily: 'AvenirNextCyr-Bold',width:'85%' ,fontStyle: 'italic'}}>Products</Text>
                    {/* Ant Design arrow down icon */}
                    <Pressable onPress={() => toggleExpand(item.id)}>
                      <AntDesign name={expandedOrder === item.id ? 'up' : 'down'} size={20} color='black' />
                    </Pressable>
                  </View>
                
               </View>
                 </View>
                    { expandedOrder === item.id && (
                      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
  <View style={{ width: 500 }}>
    <View style={{ marginTop: 8 }}>
      {/* Heading Row */}
      <View style={{ ...styles.productContainer, borderBottomWidth: 0.7, borderColor: 'black', paddingVertical: 8 }}>
        <Text style={styles.productHeading}>Qty</Text>
        <Text style={styles.productHeading}>UOM</Text>
        <Text style={styles.productHeading}>Price</Text>
        <Text style={styles.productHeading}>Weight</Text>
        <Text style={styles.productHeading}>Pieces</Text>
        {
  screen === 'Returns' ||  status=='RT'? 
                       
                      null : 
        <Text style={styles.productHeading}>Batch Code</Text>
                        }
      </View>

      {/* Product Rows */}
      {item?.stock_array.map((product, index) => (
        <View key={product.id}>
          <View style={styles.productContainer}>
            <Text style={styles.productName}>{product.qty}</Text>
            <Text style={styles.productName}>{getUomLabel(product.uom)}</Text>
            <Text style={styles.productName}>{product.price}</Text>
            <Text style={styles.productName}>{product.total_weight}</Text>
            <Text style={styles.productName}>{product.pieces}</Text>
            {
  screen === 'Returns' ||  status=='RT'? 
                       
                      null : 
            <Text style={styles.productName}>{product.batch_code}</Text>
                        }
          </View>

          {/* Line between products except the last one */}
          {index < item?.stock_array.length - 1 && <View style={styles.productSeparator} />}
        </View>
      ))}
    </View>
  </View>
</ScrollView>
                  )}
                                <View
                                    style={{
                                        justifyContent: "space-between",
                                        flexDirection: "row",
                                        alignItems: "center",
                                        marginTop: "2%",
                                    }}
                                ></View>
                            </View>
                        )}
                        keyExtractor={(item) => item.id?.toString()}
                        ListEmptyComponent={() => (
                            <View style={styles.noProductsContainer}>
                                <Text style={styles.noProductsText}>No Products</Text>
                            </View>
                        )}
                    />
                    :
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={products}
                        keyboardShouldPersistTaps='handled'
                        renderItem={({ item }) =>
                        <View style={styles.elementsView}>
                                <View
                                    style={{ flexDirection: "row", justifyContent: "center" }}
                                >
                                    <Pressable>
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
                                    </Pressable>
                                    <View
                                        style={{
                                            flex: 1,
                                            marginLeft: 10,
                                        }}
                                    >
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Text
                                                style={{
                                                    color: Colors.primary,
                                                    fontSize: 14,
                                                    fontFamily: "AvenirNextCyr-Medium",
                                                    marginTop: 5,
                                                    flex: 2,
                                                    flexWrap: 'wrap'
                                                }}
                                            >
                                                {item.name}
                                            </Text>
                                         
                                        </View>
   <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' ,marginTop:2}}>
                <Text style={{ color: Colors.black, fontSize: 14, fontFamily: 'AvenirNextCyr-Bold',width:'85%' ,fontStyle: 'italic'}}>Products</Text>
                    {/* Ant Design arrow down icon */}
                    <Pressable onPress={() => toggleExpand(item.product_id)}>
                      <AntDesign name={expandedOrder === item.product_id ? 'up' : 'down'} size={20} color='black' />
                    </Pressable>
                  </View>
                

                                       
                   </View>
              </View>
     {expandedOrder === item.product_id && (
    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
    <View style={{ width: 500 }}>
      <View style={{ marginTop: 8 }}>
        {/* Heading Row */}
        <View style={{ ...styles.productContainer, borderBottomWidth: 0.7, borderColor: 'black', paddingVertical: 8 }}>
          <Text style={styles.productHeading}>Qty</Text>
          <Text style={styles.productHeading}>UOM</Text>
          <Text style={styles.productHeading}>Price</Text>
          <Text style={styles.productHeading}>Weight</Text>
          <Text style={styles.productHeading}>Pieces</Text>
          {
  screen === 'Returns' ||  status=='RT'? 
                       
                      null : 
          <Text style={styles.productHeading}>Batch Code</Text>
                        }
        </View>
  
        {/* Product Rows */}
        {item?.stock_array.map((product, index) => (
          <View key={product.id}>
            <View style={styles.productContainer}>
              <Text style={styles.productName}>{product.qty}</Text>
              <Text style={styles.productName}>{getUomLabel(product.uom)}</Text>
              <Text style={styles.productName}>{product.price}</Text>
              <Text style={styles.productName}>{product.total_weight}</Text>
              <Text style={styles.productName}>{product.pieces}</Text>
              {
  screen === 'Returns' ||  status=='RT'? 
                       
                      null : 
              <Text style={styles.productName}>{product.batch_code}</Text>
                        }
            </View>
  
            {/* Line between products except the last one */}
            {index < item?.stock_array.length - 1 && <View style={styles.productSeparator} />}
          </View>
        ))}
      </View>
    </View>
  </ScrollView>
                  )}
                                <View
                                    style={{
                                        justifyContent: "space-between",
                                        flexDirection: "row",
                                        alignItems: "center",
                                        marginTop: "2%",
                                    }}
                                ></View>
                            </View>
                        }
                    />
                }
                </View>
            </View>
      
                  {screen !== 'Returns' && orderDetails.status === "Pending" &&  orderDetails.name.startsWith("RT") &&(
    <View style={{}}>
        <TouchableOpacity
            onPress={() => returnStatus(orderDetails.id) }
            style={{ backgroundColor: 'green', justifyContent: 'center', alignItems: 'center', paddingVertical: '3%', borderRadius: 20 }}
        >
            <Text style={styles.Btext}>Approve</Text>
        </TouchableOpacity>
   
    </View>
)}

            {orderDetails.status === "Pending" &&  !orderDetails.name.startsWith("RT")  &&(
    <View style={{ flexDirection: 'row', width: '100%', gap: 15 }}>
        <TouchableOpacity
            onPress={() => handleSubmit() }
            style={{ backgroundColor: 'green', width: '49%', justifyContent: 'center', alignItems: 'center', paddingVertical: '3%', borderRadius: 20 }}
        >
            <Text style={styles.Btext}>Approve</Text>
        </TouchableOpacity>
        
      
        <TouchableOpacity
            onPress={() => {  changeStatus(orderDetails.id) }}
            style={{ backgroundColor: 'tomato', width: '49%', justifyContent: 'center', alignItems: 'center', paddingVertical: '3%', borderRadius: 20 }}
        >
            <Text style={styles.Btext}>Cancel</Text>
        </TouchableOpacity>
    </View>
)}




            <ProgressDialog
                visible={loading}
                // title="Uploading file"
                dialogStyle={{ width: '50%', alignSelf: 'center' }}
                message="Please wait..."
                titleStyle={{ fontFamily: 'AvenirNextCyr-Medium', fontSize: 16 }}
                messageStyle={{ fontFamily: 'AvenirNextCyr-Medium', fontSize: 14 }}
            />

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
 <LoadingView visible={loading} message="Please Wait ..." />

    {isCommentsModalVisible && (
     <Comments
       route={{ params: { orderId: orderDetails?.id } }}
       isModal={true}
       onClose={() => setIsCommentsModalVisible(false)}
     />
    )}


        </View>
    )
}

export default POReviewDetails;
const styles = StyleSheet.create({


    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        // marginBottom: 7
    },

    row: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    title: {
        fontFamily: 'AvenirNextCyr-Medium',
        fontSize: 14,
        color:Colors.black
    },

    value: {
        fontFamily: 'AvenirNextCyr-Medium',
        fontSize: 15,
        color:Colors.black
    },

    imageView: {
        width: 80,
        height: 80,
    },
    elementsView: {
        paddingVertical: '4%',
        borderBottomColor: 'grey',
        borderBottomWidth: 0.5,
        paddingHorizontal:'2%'

    },
    ProductListContainer: {
        flex: 1,
        marginVertical: '4%',
    },

    salesContainer: {
        marginHorizontal: 16,
        padding: 10,
        backgroundColor: Colors.white,
        flexDirection: 'row',
        alignItems: 'center',
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
        fontFamily: 'AvenirNextCyr-Medium',

    },
    label: {
        fontSize: 16,
        color: Colors.black,
        fontFamily: 'AvenirNextCyr-Medium',
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
        fontFamily: 'AvenirNextCyr-Medium',
    },
    subHeading: {
        fontSize: 13,
        color: 'grey',
        fontFamily: 'AvenirNextCyr-Medium',
    },
    card: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginVertical: '5%',
        backgroundColor: '#F5F5F5',
    },

    card1: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: '#F5F5F5',
        flex: 1

    },
    cardTitle: {
        fontSize: 15,
        fontFamily: 'AvenirNextCyr-Bold',
        color:Colors.black
    },
    expandedContent: {
        marginTop: 20,
    },
    avatarImageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        borderColor: 'grey',
        borderWidth: 1,
        width: 80,
        height: 80,
        borderRadius: 50,
    },
    avatarImage: {
        width: 80,
        height: 80,
        borderRadius: 40, // Half of the width/height to make it circular
        borderWidth: 1,   // Border styles
        borderColor: 'grey',
        overflow: 'hidden',
    },
    modalContainer1: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent1: {
        backgroundColor: 'white',
        width: 300,
        borderRadius: 10,
        padding: 30,
    },
    submitButton: {
        backgroundColor: Colors.primary,
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
        marginTop: 8,
        marginLeft: 15,
        marginRight: 15,
    },
    submitButton1: {
        backgroundColor: Colors.primary,
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
        // marginTop: 2,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'AvenirNextCyr-Medium'
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 1,
    },
    inputView: {
        width: "100%",
        borderWidth: 1,
        backgroundColor: "white",
        borderRadius: 8,
        height: '2%',
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
        paddingLeft: 5,
    },
    inputText: {
        height: 50,
        color: "black",
        fontFamily: 'AvenirNextCyr-Medium',
    },
    inputText1: {
        fontFamily: 'AvenirNextCyr-Medium',
        color: "black",
        // height: 500,
    },
    addressInput: {
    },
    Btext: {
        color: 'white',
        fontFamily: 'AvenirNextCyr-Bold',
        fontSize: 17

    },
    noProductsContainer: {
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
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
  },fabStyle: {
    position: "absolute",
    right: "5%",
    bottom: "9%",
    backgroundColor: Colors.primary,
  }, productContainer1: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12, // Adjust vertical padding
    paddingHorizontal: 8, // Adjust horizontal padding
    marginVertical: 4, // Add margin between rows
  },
  productHeading1: {
    fontWeight: 'bold',
    fontSize: 14, // Adjust font size
    textAlign: 'center',
    paddingHorizontal: 10, // Add padding to headings
  },
  productName1: {
    fontSize: 14, // Adjust font size
    paddingHorizontal: 10, // Add padding to values
    marginVertical: 4, // Add margin to text values
  },
  productSeparator1: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 4, // Space between separator and content
  },

})