import React, {  useState,
  useEffect,
  useContext,
  useCallback,
  useMemo,
  useRef } from "react";
import Toast from "react-native-simple-toast";
import { AuthContext } from "../../Context/AuthContext";
import {
  View,
  Dimensions,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
  SafeAreaView,
  FlatList,
  Pressable,
  TextInput as TextInput1,
  Keyboard,
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
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { TextInput, RadioButton, Searchbar } from "react-native-paper";
import { Checkbox } from "react-native-paper";
import LinearGradient from "react-native-linear-gradient";
import { hs, vs, ms } from "../../utils/Metrics";
import { searchItem } from "../../utils/Search";
import { debounce } from "../../utils/Search";
import { LoadingView } from "../../components/LoadingView";
import Entypo from "react-native-vector-icons/Entypo";
import  Ionicons  from 'react-native-vector-icons/Ionicons';


const AddSupplier = ({ navigation, route }) => {
  const { userData } = useContext(AuthContext);

  const { params } = route;
  const screen = params?.screen;
  const supplierId = params?.supplierId;
  console.log("Screeen", supplierId, screen)

  const [showSecondModal, setShowSecondModal] = useState(false);
  const [checked, setChecked] = useState("Individual");
  const [resetpass, setResetPass] = useState("");
  const [confirmpass, setConfirmpass] = useState("");
  const [products, setProducts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [base64img, setBase64img] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [expanded1, setExpanded1] = useState(false);
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [website, setWebsite] = useState("");
  const [masterData, setMasterData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedItem, setselectedItems] = useState([]);
  const [price, setPrice] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
 const [selectedCategory, setSelectedCategory] = useState(null);
  const [expandedSubCategory, setExpandedSubCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [originalCategories, setOriginalCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState(null);
  const [searching, setSearching] = useState(false);
  const [searching1, setSearching1] = useState(false);
  const [productSearch, setProductSearch] = useState("");
  const [addedItems, setAddedItems] = useState([]);
  const [productsBySubCategory, setProductsBySubCategory] = useState({});


  const queryParams = useRef({ limit: 10, offset: 0 });

  useEffect(() => {
    console.log("sele", selectedItem)

  }, [selectedItem])

  useEffect(() => {
    if (supplierId) {
      console.log("supplier there, ", supplierId);
      getSupplierDetails();
      getSupplierProducts();
    }
  }, [supplierId]);

  const getSupplierDetails = () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${userData.token}`);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `https://gsidev.ordosolution.com/api/suppliers/${supplierId}/`,
      requestOptions
    )
      .then((response) => response.json())
      .then(async (result) => {
        if (result) {
          console.log("supp details", result);
          setName(result.full_name);
          setAddress(result.address);
          setChecked(result.supplier_type);
          setEmail(result.email);
          setPhone(result.phone);
          setWebsite(result.website);
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error in get supplier", error);
      });
  };

  const getSupplierProducts = () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${userData.token}`);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `https://gsidev.ordosolution.com/api/supplier-products/?supplier_id=${supplierId}`,
      requestOptions
    )
      .then((response) => response.json())
      .then(async (result) => {
        if (result) {
          console.log("supp prod details", result);
          setselectedItems(result);
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error in get supplier", error);
      });
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





console.log("prod",products)

const renderProductItem = useCallback(({ item }) => {
  return (
   
                      <Pressable style={styles.elementsView}
                        onPress={() => {

                          handleCheckboxChange(item)

                        }
                        }
                      >
                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
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
                          <View style={{
                            flex: 1,
                            borderLeftWidth: 1.5,
                            paddingLeft: 15,
                            marginLeft: 10,
                            borderStyle: 'dotted',
                            borderColor: 'grey',
                          }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                              <Text style={{ color: Colors.primary, fontSize: 12, fontFamily: 'AvenirNextCyr-Bold', borderBottomColor: 'grey', borderBottomWidth: 0.5 ,flex:1}} numberOfLines={2}>{item.name}</Text>

                              <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}>{item.currency} {Number(item.product_price)}</Text>


                            </View>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15 }}>


                              <Text style={{ color: Colors.primary, fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}>Stock: {item.stock < 1 ? <Text style={{ color: 'red' }}>Out of Stock</Text> : item.stock}</Text>
                              <Checkbox.Android
                                color={Colors.primary}
                                status={
                                  selectedItem.some((customer) => customer.product_id === item.id) ? 'checked' : 'unchecked'
                                }
                              />


                            </View>


                          </View>

                        </View>
                      </Pressable>
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

  const handleCheckboxChange = (item) => {
    if (selectedItem.find((customer) => customer.product_id === item.id)) {
      // Remove the customer from selectedItem
      setselectedItems((prevselectedItems) =>
        prevselectedItems.filter((customer) => customer.product_id !== item.id)
      );
    } else {
      // Add the customer to selectedItem
      setselectedItems((prevselectedItems) => [
        ...prevselectedItems,
        {
          name: item.name,
          product_id: item.id,
          product_image: item.product_image

        },
      ]);
    }

  };

  const removeProductFromCart = (item) => {
    // Filter out the item to remove it from the array
    const updatedProducts = selectedItem.filter((product) => product.product_id !== item.product_id);
    console.log("cjsnx k", updatedProducts)
    setselectedItems(updatedProducts); // Update the state with the new array
  };

  const updatePrice = (itemId, newPrice) => {
    const updatedItems = selectedItem.map((item) =>
      item.product_id === itemId ? { ...item, price: newPrice } : item
    );
    setselectedItems(updatedItems);
  };

  const handleGallery = async () => {
    // setModalVisible1(false);
    const res = await launchImageLibrary({
      mediaType: "photo",
    });
    imageResize(res.assets[0].uri, res.assets[0].type);
    // if (base64img) {
    //     await saveProfilePictureToApi(base64img);
    //     console.log("Profile picture saved ");
    // }
    setShowSecondModal(false);
  };

  const checkPermissionCam = async () => {
    let PermissionDenied = await cameraPermission();
    if (PermissionDenied) {
      console.log("camera permssion granted");
      handleCamera();
    } else {
      console.log("camera permssion denied");
      //requestStoragePermission();
    }
  };

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const handleCamera = async () => {
    const res = await launchCamera({
      mediaType: "photo",
    });
    imageResize(res.assets[0].uri, res.assets[0].type);
    setShowSecondModal(false);
  };

  const imageResize = async (img, type) => {
    try {
      const res = await ImageResizer.createResizedImage(
        img,
        300,
        300,
        "JPEG",
        50
      );

      const base64Data = await RNFS.readFile(res.path, "base64");

      const base64img1 = `data:${type};base64,${base64Data}`;

      setBase64img(base64img1);
      // console.log("base64img1111", base64img);

      // uploadImage(loginResponse.current.id, base64img1);
      //onPressLogin(base64img1);
      // Now you can use base64img as needed (e.g., uploadImage)
    } catch (error) {
      console.log("img resize error", error);
    }
  };

  //auth token value
  const { token, dealerData, logout } = useContext(AuthContext);

  //Bar Graph data logic

  const toggleExpansion = () => {
    setExpanded(!expanded);
  };

  const toggleExpansion1 = () => {
    setExpanded1(!expanded1);
  };

  const isValidEmail = (email) => {
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.(com|org|net|edu|gov|in)$/;
    return emailRegex.test(email);
  };

  const saveSupplierDetails = () => {
    if (name && email && address && phone && base64img) {

      if (!isValidEmail(email)) {
        Alert.alert("Error", "Invalid email address", [
          { text: "OK", onPress: () => console.log("OK Pressed") },
        ]);
        return;
      }

      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${userData.token}`);

      var raw = JSON.stringify({
        address: address,
        company: company,
        email: email,
        full_name: name,
        phone: phone,
        supplier_type: checked,
        website: website,
        supplier_image:base64img
      });

      console.log("raw1", raw)

      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      fetch("https://gsidev.ordosolution.com/api/suppliers/", requestOptions)
        .then((response) => response.json())
        .then(async (result) => {
          console.log("result of save supplier", result);

          if (result) {
            const selectedIds = selectedItem.map(item => item.product_id);
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", `Bearer ${userData.token}`);

            var raw = JSON.stringify({
              "supplier_id": result.id,
              "product_id": selectedIds

            });

            var requestOptions = {
              method: 'POST',
              headers: myHeaders,
              body: raw,
              redirect: 'follow'
            };

            console.log("raw supplier", raw)

            fetch("https://gsidev.ordosolution.com/api/supplier-products/", requestOptions)
              .then(response => response.json())
              .then(async result => {
                console.log("result of second fetch", result)
              })
              .catch(error => console.log('error', error));
            setName("");
            setEmail("");
            setAddress("");
            setPhone("");
            setWebsite("");
            setselectedItems([]);
            Alert.alert("Success", "Supplier Details added Succesfully", [
              { text: "OK", onPress: () => navigation.goBack() },
            ]);
          }
        })
        .catch((error) => console.log("error", error));
    } else {
      Alert.alert(
        "Warning",
        "Please Complete your Supplier details before Submitting"
      );
    }
  };

  const editSupplierDetails = () => {
    setLoading(true);

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${userData.token}`);

    var raw = JSON.stringify({
      address: address,
      company: company,
      email: email,
      full_name: name,
      phone: phone,
      supplier_type: checked,
      website: website,
    });

    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(
      `https://gsidev.ordosolution.com/api/suppliers/${supplierId}/`,
      requestOptions
    )
      .then((response) => {
        if (response.status === 200) {
          const selectedIds = selectedItem.map(item => item.product_id);
          var myHeaders = new Headers();
          myHeaders.append("Content-Type", "application/json");
          myHeaders.append("Authorization", `Bearer ${userData.token}`);

          var raw = JSON.stringify({
            "supplier_id": supplierId,
            "product_id": selectedIds

          });

          var requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
          };

          console.log("raw2", raw)

          fetch(`https://gsidev.ordosolution.com/api/supplier-products/`, requestOptions)
            .then(response => response.json())
            .then(async result => {
              console.log("result of second fetch", result)
            })
            .catch(error => console.log('error', error));
          // Successful deletion
          setLoading(false);
          // console.log('Supplier edited successfully');
          // onToggleSnackBar();
          getSupplierDetails();
          // You can perform additional actions here if needed
          Toast.show("Supplier edited successfully", Toast.LONG);
          navigation.goBack()
        } else if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        } else {
          return response.json();
        }
      })
      // .then(async (result) => {
      //   if (result) {
      //     console.log('testttttt', result);
      //   }
      // })
      .catch((error) => {
        setLoading(false);

        console.error("Error in delete supplier", error);
      });
  };


  const handlePhoneNumberChange = (text) => {
    // Remove non-digit characters from input
    const formattedPhoneNumber = text.replace(/[^\d]/g, '');

    // Limit the length of the phone number to 10 digits
    if (formattedPhoneNumber.length <= 10) {
      setPhone(formattedPhoneNumber);
    }
  };

  const renderSupplierSection = () => {
    return (
      <>
        {/* <View>
      {screen === "add" ? (
        <Text
          style={{
            fontSize: 18,
            fontFamily: "AvenirNextCyr-Medium",
            marginRight: "15%",
          }}
        >
          {" "}
          Add Supplier
        </Text>
      ) : (
        <Text
          style={{
            fontSize: 18,
            fontFamily: "AvenirNextCyr-Medium",
            marginRight: "15%",
          }}
        >
          {" "}
          Edit Supplier
        </Text>
      )}

      <View>
        <Text></Text>
      </View> */}
        {/* </View> */}

        <View
          style={{ marginTop: 5, paddingHorizontal: "1%", flex: 1 }}
        // onPress={toggleExpansion}
        >
          <View style={styles.card}>
<View style={{ alignItems: 'center', marginTop: 6 }}>
    <View style={styles.circleContainer}>
        <TouchableOpacity
            onPress={() => setShowSecondModal(true)}
            style={styles.avatarImageContainer}
        >
            <Image
                source={
                    base64img || dealerData.profile_image
                        ? { uri: base64img || dealerData.profile_image }
                        : require('../../assets/images/UserAvatar.png')
                }
                style={styles.avatarImage}
            />
            <View style={styles.addImageIndicator}>
                <Text style={styles.addImageText}>+</Text>
            </View>
        </TouchableOpacity>
    </View>
</View>

            {
              // expanded &&

              <ScrollView style={styles.expandedContent}>
                <View style={styles.inputView}>
                  <TextInput
                    style={styles.inputText}
                    // placeholder="Full Name"
                    value={name}
                    autoCapitalize="none"
                    placeholderTextColor="#003f5c"
                    mode="outlined"
                    label="Full Name"
                    onChangeText={(val) => {
                      setName(val);
                    }}
                  // onChangeText={text => updateName(text)}
                  />
                </View>

                <View style={styles.inputView1}>
                  <TextInput
                    style={[styles.inputText, styles.addressInput]}
                    // placeholder="Address"
                    multiline={true}
                    value={address}
                    mode="outlined"
                    label="Address"
                    numberOfLines={4} // You can adjust the number of lines as needed
                    // placeholderTextColor="#003f5c"
                    onChangeText={(val) => {
                      setAddress(val);
                    }}
                  // onChangeText={text => updateAddress(text)}
                  />
                </View>

                <Text
                  style={{
                    marginLeft: 10,
                    marginTop: 10,
                    fontFamily: "AvenirNextCyr-Bold",
                    fontSize: 16,
                    color:'black'
                  }}
                >
                  Supplier Type :{" "}
                </Text>

                <View
                  style={{ flexDirection: "row", justifyContent: "flex-start" }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <RadioButton.Android
                      value="Individual"
                      status={checked === "Individual" ? "checked" : "unchecked"}
                      onPress={() => setChecked("Individual")}
                    />

                    <Text style={{ fontFamily: "AvenirNextCyr-Medium", fontSize: 14,color:'black' }}>
                      Individual
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      alignContent: "center",
                      alignItems: "center",
                      marginLeft: 15,
                    }}
                  >
                    <RadioButton.Android
                      value="Company"
                      status={checked === "Company" ? "checked" : "unchecked"}
                      onPress={() => setChecked("Company")}
                    />
                    <Text style={{ fontFamily: "AvenirNextCyr-Medium", fontSize: 14 ,color:'black'}}>
                      Company
                    </Text>
                  </View>
                </View>

                {checked === "Company" && (
                  <View style={styles.inputView}>
                    <TextInput
                      style={styles.inputText}
                      // placeholder="Full Name"
                      value={company}
                      autoCapitalize="none"
                      placeholderTextColor="#003f5c"
                      mode="outlined"
                      label="Company Name"
                      onChangeText={(val) => {
                        setCompany(val);
                      }}
                    // onChangeText={text => updateName(text)}
                    />
                  </View>
                )}

                <View style={styles.inputView}>
                  <TextInput
                    style={styles.inputText}
                    // placeholder="Full Name"
                    value={email}
                    autoCapitalize="none"
                    placeholderTextColor="#003f5c"
                    mode="outlined"
                    label="Email"
                    onChangeText={(val) => {
                      setEmail(val);
                    }}
                  // onChangeText={text => updateName(text)}
                  />
                </View>

                <View style={styles.inputView}>
                  <TextInput
                    style={styles.inputText}
                    // placeholder="Full Name"
                    value={phone}
                    autoCapitalize="none"
                    placeholderTextColor="#003f5c"
                    keyboardType="numeric"
                    mode="outlined"
                    label="Phone Number"
                    onChangeText={handlePhoneNumberChange}

                  // onChangeText={text => updateName(text)}
                  />
                </View>

                <View style={styles.inputView}>
                  <TextInput
                    style={styles.inputText}
                    // placeholder="Full Name"
                    value={website}
                    autoCapitalize="none"
                    placeholderTextColor="#003f5c"
                    mode="outlined"
                    label="Website"
                    onChangeText={(val) => {
                      setWebsite(val);
                    }}
                  // onChangeText={text => updateName(text)}
                  />
                </View>





                {/* <TouchableOpacity style={{ ...styles.submitButton1, marginTop: 15 }} onPress={EditData}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity> */}
              </ScrollView>
            }
          </View>


          <View style={[styles.rowContainer, { justifyContent: "flex-end" }]}>
            <LinearGradient
              colors={Colors.linearColors}
              start={Colors.start}
              end={Colors.end}
              locations={Colors.ButtonsLocation}
              style={{
                // padding: 5,
                borderRadius: 5,
                // backgroundColor: Colors.primary,
                paddingHorizontal: "3%",
                paddingVertical: "2%",



              }}
            >
              <TouchableOpacity
                style={styles.NextPrevBtn}
                onPress={() => setCurrentView("Product")}
              >
                <Text style={styles.tabButtonText}>
                  <AntDesign name="right" size={20} color={`white`} />

                </Text>
              </TouchableOpacity>
            </LinearGradient>
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
                  onPress={checkPermissionCam}
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
      </>
    )
  };

  const renderProductSection = () => {
    return (
      <View style={{ marginTop: 5, paddingHorizontal: '1%', flex: 1 }} >
        <View style={styles.card}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={styles.cardTitle}><AntDesign name='shoppingcart' size={22} color={`black`} />   Product</Text>
            <LinearGradient
              colors={Colors.linearColors}
              start={Colors.start}
              end={Colors.end}
              locations={Colors.ButtonsLocation}
              style={{
                borderRadius: 8,
                paddingVertical: 10,
                alignItems: "center",
                padding: '4%'

              }}
            >
              <TouchableOpacity style={{ ...styles.submitButton1 }} onPress={toggleModal}>
                <Text style={styles.submitButtonText}>Add</Text>
              </TouchableOpacity>
            </LinearGradient>
            {/* <FontAwesome name='angle-down' size={20} color={`black`} /> */}
          </View>
          {/* {expanded1 && ( */}
          <View style={styles.expandedContent}>

            <View style={styles.ProductListContainer}>
              <FlatList
                showsVerticalScrollIndicator={false}
                data={selectedItem}
                keyboardShouldPersistTaps='handled'
                renderItem={({ item }) =>

                  <View style={styles.elementsView} >

                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                      <Pressable >
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

                      </Pressable>
                      <View style={{
                        flex: 1,
                        // borderLeftWidth: 1.5,
                        paddingLeft: 15,
                        marginLeft: 10,
                        // borderStyle: 'dotted',
                        // borderColor: 'grey',
                      }}>

                        <Text style={{ color: Colors.primary, fontSize: 14, fontFamily: 'AvenirNextCyr-Medium', marginTop: 5, }}>{item.name}</Text>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: '3%' }}>

                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>

                            <TextInput
                              placeholder='Price'
                              style={{ height: 40, width: 80 }}
                              keyboardType='number-pad'
                              onChangeText={(newPrice) => updatePrice(item.product_id, newPrice)}
                              value={item.price ? item.price.toString() : ''}
                              keyboardShouldPersistTaps='always'
                            />
                            <Text style={{ color: 'black', fontSize: 14, fontFamily: 'AvenirNextCyr-Medium', marginTop: 5, }}>{item.description}</Text>

                          </View>


                          <TouchableOpacity onPress={() => removeProductFromCart(item)}>
                            <FontAwesome name='trash' size={20} color={Colors.black} />
                          </TouchableOpacity>

                        </View>
                      </View>

                    </View>
                    <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', marginTop: '2%' }}>


                    </View>
                  </View>

                }
                // keyExtractor={(item) => item.id.toString()}
                ListEmptyComponent={() => (
                  <View style={styles.noProductsContainer}>
                    <Text style={styles.noProductsText}>No Products</Text>
                  </View>
                )}
              />
            </View>
            {/* 
            <TouchableOpacity style={{ ...styles.submitButton1, marginTop: 5 }} onPress={toggleModal}>
              <Text style={styles.submitButtonText}>Add Product</Text>
            </TouchableOpacity> */}




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



          </View>
          {/* )} */}
        </View>
        <View style={styles.rowContainer}>
          <LinearGradient
            colors={Colors.linearColors}
            start={Colors.start}
            end={Colors.end}
            locations={Colors.ButtonsLocation}
            style={{
              // padding: 5,
              borderRadius: 5,
              // backgroundColor: Colors.primary,
              paddingHorizontal: "3%",
              paddingVertical: "2%",

            }}
          >
            <TouchableOpacity
              style={styles.NextPrevBtn}
              onPress={() => setCurrentView("Supplier")}
            >
              <Text style={styles.tabButtonText}>
                <AntDesign name="left" size={20} color={`white`} />

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
            height: 50,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 5,
            backgroundColor: Colors.primary,
            marginBottom: 10,

          }}
        >

          <TouchableOpacity
            style={styles.button}
            onPress={screen === "add" ? saveSupplierDetails : editSupplierDetails}
          >
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    )
  }

  const [currentView, setCurrentView] = useState("Supplier");

  return (
    <View style={styles.container}>
      <View style={styles.headercontainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={25} color={Colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Suppliers</Text>
        <Text> </Text>
      </View>

      <View style={styles.buttonContainer}>

        <TouchableOpacity
          style={
            currentView === "Supplier"
              ? [styles.tabButton, styles.activeTabButton]
              : styles.tabButton
          }
          onPress={() =>
            setCurrentView("Supplier") && styles.activeTabButton
          }
        >
          {/* <Text style={styles.tabButtonText}>Supplier Details</Text> */}
        </TouchableOpacity>

        <TouchableOpacity
          style={
            currentView === "Product"
              ? [styles.tabButton, styles.activeTabButton]
              : styles.tabButton
          }
          onPress={() =>
            setCurrentView("Product") && styles.activeTabButton
          }
        >
          {/* <Text style={styles.tabButtonText}>Choose Product</Text> */}
        </TouchableOpacity>

        {/* <TouchableOpacity
      style={
        currentView === "Additional Details"
          ? [styles.tabButton, styles.activeTabButton]
          : styles.tabButton
      }
      onPress={() =>
        setCurrentView("Additional Details") && styles.activeTabButton
      }
    >
      <Text style={styles.tabButtonText}>Additional Info</Text>
    </TouchableOpacity> */}
      </View>
      <Text style={styles.pageIndicator}>
        {currentView === "Supplier" ? "Page 1 of 2" : "Page 2 of 2"}
      </Text>

      <View style={{ alignItems: "center", marginTop: 6 }}></View>
      <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >

      {currentView === "Supplier" && renderSupplierSection()}
      {currentView === "Product" && renderProductSection()}
      {/* {currentView === "Additional Details" && renderAdditionalDetails()} */}
      </KeyboardAvoidingView>
 <LoadingView visible={loading} message="Please Wait ..." />

    </View>
  )



};

export default AddSupplier;
const styles = StyleSheet.create({
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

  checkOutView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: "2%",
    paddingHorizontal: "3%",

    // flex:1
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
    padding: 16,
    marginBottom: 16,
    flex: 1
  },
  cardTitle: {
    fontSize: 15,
    fontFamily: "AvenirNextCyr-Medium",
    color:Colors.black
  },
  expandedContent: {
    // marginTop: 10,
    flex: 1
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
    width: 70,
    height: 70,
    borderRadius: 40, // Half of the width/height to make it circular
    // borderWidth: 1,   // Border styles
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
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalContent: {
    backgroundColor: "white",
    width: 350,
    // flex:1,
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
    width: '100%'
    // backgroundColor: Colors.primary,
    // borderRadius: 8,
    // paddingVertical: 10,
    // alignItems: "center",
    // marginTop: 5,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 12,
    fontFamily: "AvenirNextCyr-Medium",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
  },
  inputView: {
    // width: "100%",
    // borderWidth: 1,
    backgroundColor: "white",
    // borderRadius: 8,
    // height: '2%',
    // marginBottom: 20,
    // justifyContent: "center",
    padding: 5,
    paddingLeft: 5,
  },
  inputView1: {
    width: "100%",
    // borderWidth: 1,
    // backgroundColor: "white",
    // borderRadius: 8,
    // height: 100,
    // marginBottom: 20,
    // justifyContent: "center",
    padding: 5,
    paddingLeft: 5,
  },
  inputText: {
    backgroundColor: "white",
    // height: 50,
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
  userContainer: {
    // flexDirection:'row',
    backgroundColor: "white",
    borderRadius: 5,
    // borderWidth: 1,
    // borderColor: Colors.primary, // You can replace this with the desired border color
    padding: 10,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    // flex: 1
  },
  elementsView: {
    backgroundColor: "white",
    margin: 5,
    //borderColor: 'black',
    //flexDirection: 'row',
    //justifyContent: 'space-between',
    //alignItems: 'center',
    marginBottom: 10,
    borderRadius: 8,
    elevation: 5,
    ...globalStyles.border,
    padding: 16,
    //borderColor: '#fff',
    //borderWidth: 0.5
  },
  ProductListContainer: {
    // flex: 1,
    // marginBottom: "4%",
  },
  imageView: {
    width: 80,
    height: 80,
    // borderRadius: 40,
    // marginTop: 20,
    // marginBottom: 10
  },
  noProductsContainer: {
    justifyContent: "center",
    alignItems: "center",
    // padding: 10,
  },
  noProductsText: {
    fontSize: 16,
    color: "gray",
    fontFamily: "AvenirNextCyr-Medium",
    textAlign: "center",
    marginTop: 20,
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
    // height: 50,
    // justifyContent: "center",
    alignItems: "center",
    // borderRadius: 5,
    // backgroundColor: Colors.primary,
    // marginBottom: 10,
    width: '100%'
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
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    //borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 14,
    fontFamily: "AvenirNextCyr-Medium",
    color: "grey",
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
    borderColor: "grey",
    borderWidth: 1,
    backgroundColor: "white",
    height: 40,
    marginBottom: 5,
    //padding:5,
    fontFamily: "AvenirNextCyr-Medium",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  input2: {
    fontFamily: "AvenirNextCyr-Medium",
    padding: 8,
    flex: 1,
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
    height: 0.5
  },
  tabButton: {
    paddingHorizontal: "2%",
    // paddingVertical: "2%",
    borderRadius: 5,
    fontSize: 10,
    backgroundColor: "lightgray",
    height: 10,
    width: '48%'

  },
  tabButtonText: {
    color: "white",
    fontFamily: "AvenirNextCyr-Medium",
  },
  activeTabButton: {
    backgroundColor: Colors.primary,
    height: 10,

    // paddingVertical: '2%',
    borderRadius: 5,
    // fontSize: 10,
    width: '48%'

  },
  NextPrevBtn: {
    // padding: 3,
    // borderRadius: 5,
    width: '100%'
    // backgroundColor: Colors.primary,
    // paddingHorizontal: "6%",
  },
  progress1: {
    height: 7,
    borderRadius: 9,
    backgroundColor: Colors.primary,
    width: '20%',
    marginRight: '2%',
    marginTop: '5%'
  },
  progress2: {
    height: 7,
    borderRadius: 9,
    backgroundColor: Colors.lightGrey,
    width: '20%',
    marginRight: '2%',
    marginTop: '5%'
  },
  progress3: {
    height: 7,
    borderRadius: 9,
    backgroundColor: 'lightgrey',
    width: '20%',
    marginRight: '2%',
    marginTop: '5%'
  },
  pageIndicator: {
    // textAlign: 'flex-end',
    marginBottom: 1,
    fontSize: 14,
    fontFamily: "AvenirNextCyr-Medium",
    textAlign: 'right',
    paddingRight: 5
  },addImageIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.primary,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
},addImageText: {
    color: 'white',
    fontSize: 16,
    lineHeight: 24,
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
    backgroundColor: "lightgray",
    paddingVertical: 5,
    paddingHorizontal: 10,
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
});
