import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Keyboard,
  TextInput,
  Modal,
  Pressable,
  Alert,
  SafeAreaView,

} from "react-native";
import React, { useState, useEffect, useContext, useRef, useCallback, useMemo} from "react";
import Colors from "../../constants/Colors";
import { Dropdown } from "react-native-element-dropdown";
import Icon from "react-native-vector-icons/FontAwesome";
import globalStyles from "../../styles/globalStyles";
import { AuthContext } from "../../Context/AuthContext";
import { Searchbar, Checkbox, RadioButton, Snackbar } from "react-native-paper";
import LinearGradient from 'react-native-linear-gradient';
import { searchItem } from "../../utils/Search";
import { debounce } from "../../utils/Search";
import { LoadingView } from "../../components/LoadingView";
import Entypo from "react-native-vector-icons/Entypo";
import  Ionicons  from 'react-native-vector-icons/Ionicons';


const Inventory = ({ navigation, visible, extended, label, animateFrom }) => {
  const { token, userData } = useContext(AuthContext);
  const [masterData, setMasterData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searching, setSearching] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const [brandData, setBrandData] = useState([]);
  const [addedItems, setAddedItems] = useState([]);

  const [brandResponse, setBrandResponse] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSubSelectedCategory] = useState("");
  const [isFocus3, setIsFocus3] = useState(false);
  const [isExtended, setIsExtended] = useState(true);
  const [SnackBarVisible, setSnackBarVisible] = useState(false);

  const [expandedSubCategory, setExpandedSubCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [originalCategories, setOriginalCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [productSearch, setProductSearch] = useState("");
  const [productDetails, setProductDetails] = useState("");
  const [productsBySubCategory, setProductsBySubCategory] = useState({});
  const [modalVisible, setModalVisible] = useState(false);

  const onToggleSnackBar = () => setSnackBarVisible(!SnackBarVisible);
  const onDismissSnackBar = () => setSnackBarVisible(false);
  const queryParams = useRef({ limit: 10, offset: 0 });


  useEffect(() => {
    getBrand();
  }, []);

  useEffect(() => {
    getCategory();
  }, []);

  useEffect(() => {
    loadAllProduct1();
  }, [search]);


  const loadAllProduct1 = async () => {
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
        `https://gsidev.ordosolution.com/api/test_product/?limit=10&offset=0&&search_name=${search}`,
        requestOptions
      );
      const result = await response.json();

        setMasterData(result.products);
        setFilteredData(result.products);

    } catch (error) {
      console.log("error", error);
    }
  };



  const getBrand = async (userId) => {
    // Fetch category list API
    var myHeaders = new Headers();

    myHeaders.append("Authorization", `Bearer ${userData.token}`);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    try {
      const response = await fetch(
        "https://gsidev.ordosolution.com/api/product/",
        requestOptions
      );
      const result = await response.json();
      // console.log("brand---------------->", result);
      setBrandResponse(result);

      // Transform and filter data to get unique brand names
      const transformedData = result
        .map((item) => ({
          label: item?.brand?.brand_name,
          value: item?.brand?.id,
        }))
        .filter((item) => item.label && item.value);


      // Get unique brand names
      const uniqueData = transformedData.filter((item, index, array) => {
        return array.findIndex((i) => i.label === item.label) === index;
      });

      setBrandData(uniqueData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };


  const getCategory = async (brandId) => {
    // Fetch category list API
    // console.log("get category", brandId);

    let apiUrl;
    let requestData;

    if (userData && userData.dealer_name === "Nikai FMCG") {
      // Use the new API and payload for 'Nikai Fmcg'
      apiUrl = "https://dev.ordo.primesophic.com/get_category.php";
      requestData = {
        __user_id__: userData.id, // Use the userId from userData
      };
    } else {
      // Use the regular API and payload
      apiUrl = "https://dev.ordo.primesophic.com/get_category_from_brand.php";
      requestData = {
        __brand_id__: brandId,
      };
    }

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });
      const jsonData = await response.json();

      const transformedData = jsonData.category_list.map((item) => ({
        label: item.name,
        value: item.id,
      }));

      setCategoryData(transformedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };


  const handleSubmit = async () => {
    try {

      // Filtering the objects based on the selected brand
      const filteredObjects = brandResponse.filter(
        (obj) => obj.brand && obj.brand.brand_name === selectedBrand
      );

      setFilteredData(filteredObjects);
    } catch (error) {
      console.error("Error in handleSubmit:", error);
    }
    // setSelectedBrand("");
    toggleModal();
  };


  // console.log("selected", selectedCategory);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
    // setSelectedBrand("");
    setSelectedCategory("");
    setSubSelectedCategory("");
  };

  const handleDelete = (id) => {
    // Ask for confirmation
    // console.log("supp id", id);
    // console.log("tokennn", userData.token);
    Alert.alert(
      "Confirmation",
      "Are you sure you want to delete this Product?",
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => {
            setLoading(false);
          },
        },
        {
          text: "OK",
          onPress: () => {
            setLoading(true);

            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", `Bearer ${userData.token}`);

            var requestOptions = {
              method: "DELETE",
              headers: myHeaders,
              redirect: "follow",
            };

            fetch(
              `https://gsidev.ordosolution.com/api/product/${id}/`,
              requestOptions
            )
              .then((response) => {
                if (response.status === 204) {
                  // Successful deletion
                  setLoading(false);
                  onToggleSnackBar();
                  loadAllProduct();
                  // You can perform additional actions here if needed
                } else if (!response.ok) {
                  throw new Error(`HTTP error! Status: ${response.status}`);
                } else {
                  return response.json();
                }
              })
              .then(async (result) => {
                if (result) {
                  // console.log("testttttt", result);
                }
              })
              .catch((error) => {
                setLoading(false);
                console.error("Error in delete product", error);
              });
          },
        },
      ],
      { cancelable: false }
    );
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
  loadProducts(selectedCategory, expandedSubCategory); // Ensure loading state is false
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

{/* 
      // ORDO GSI APP B_408 | 03-Apr-2025 | Sahana 
      // Fixed issues where loading is false, so that no data message doesn't appear for frac of sec */}


      {expandedSubCategory === subcategoryId && (
        <View style={styles.productsContainer}>
            <FlatList
      data={productsForSubCategory}
      renderItem={renderProductItem}
      contentContainerStyle={{ paddingBottom: "20%" }}
      keyExtractor={(item) => item.id.toString()}
      onEndReachedThreshold={0.5}
      onEndReached={() => onEndReached(selectedCategory, expandedSubCategory)}
      ListEmptyComponent={
        !loading ? <Text style={styles.noDataText}>No Data Available</Text> : null
      }
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
      <Pressable    onPress={() => {
              navigation.navigate("ProductDetails", { item: item });
            }}
            style={{ padding: 10 }}>
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
                ₹{item.product_price}
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
            {/* <Text
              style={{
                color: itemAdded ? "white" : "gray",
                fontSize: 12,
                fontFamily: "AvenirNextCyr-Medium",
              }}
            >
              UOM : {item.unit_of_measure}
            </Text> */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}>
                     <View>
                          <Text
                            style={{
                              color: item.stock <= 0  ? "tomato" : "#15b315",
                              fontSize: 12.5,
                              fontFamily: "AvenirNextCyr-Bold",
                              marginTop: "0%",
                            }}>
                          Stock :{parseFloat(item?.available_stock).toFixed(2)}
                    </Text>
                  </View>
            </View>
          </View>
        </View>
      </Pressable>
    </View>
  );
}, [addedItems]); 


  const MemoizedFlatList = useMemo(() => {
{/* 
      // ORDO GSI APP B_408 | 03-Apr-2025 | Sahana 
      // Fixed issues where loading is false, so that no data message doesn't appear for frac of sec */}

  return (
    <FlatList
      data={products}
      renderItem={renderProductItem}
      contentContainerStyle={{ paddingBottom: "20%" }}
      keyExtractor={(item) => item.id.toString()}
      onEndReachedThreshold={0.5}
      onEndReached={() => onEndReached(selectedCategory, expandedSubCategory)}
      ListEmptyComponent={
        !loading ? <Text style={styles.noDataText}>No Data Available</Text> : null
      }
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


  return (
    <View style={styles.container}>
      <View style={styles.header}>
           {selectedCategory ? (
  <TouchableOpacity onPress={handleBackToCategory}>
    <Ionicons name="arrow-back" size={26} color="black" />
  </TouchableOpacity>
) : (
  <TouchableOpacity onPress={() => navigation.goBack()}>
    <Ionicons name="arrow-back" size={26} color="black" />
  </TouchableOpacity>
)}

        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text
            style={{
              fontSize: 20,
              color: Colors.primary,
              fontFamily: "AvenirNextCyr-Bold",
            }}
          >
            Products
          </Text>
        </View>
 
      </View>
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={toggleModal}
      >
        <TouchableOpacity
          style={styles.modalContainer}
          activeOpacity={1}
        >
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeIcon} onPress={toggleModal}>
              <Icon name="times" size={20} color="#000" />
            </TouchableOpacity>
            <View style={styles.modalInnerContent}>
              <View style={styles.container1}>
                <Text style={styles.ModalText1}>Select Brand</Text>
                <Dropdown
                  style={[
                    styles.dropdown,
                    isFocus3 && { borderColor: Colors.primary },
                  ]}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  itemTextStyle={styles.selectedTextStyle}
                  iconStyle={styles.iconStyle}
                  data={brandData}
                  search
                  maxHeight={400}
                  labelField="label"
                  valueField="value"
                  placeholder={!isFocus3 ? "Select item" : "..."}
                  searchPlaceholder="Search..."
                  value={selectedBrand}
                  onFocus={() => setIsFocus3(true)}
                  onBlur={() => setIsFocus3(false)}
                  onChange={(item) => {
                    setSelectedBrand(item.label);
                    setIsFocus3(false);
                  }}
                />
              </View>
              <LinearGradient
                colors={Colors.linearColors}
                start={Colors.start}
                end={Colors.end}
                locations={Colors.ButtonsLocation}
                style={{ borderRadius: 8, marginHorizontal: '5%' }}
              >
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleSubmit}
                >
                  <Text style={styles.submitButtonText}>Apply Filter</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>


      <View style={{ }}>
   
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
      </View>

{/* 
      // ORDO GSI APP B_408 | 03-Apr-2025 | Sahana 
      // Fixed issues where loading is false, so that no data message doesn't appear for frac of sec */}

      {selectedCategory ? (
  <FlatList
    data={subCategories}
    renderItem={renderSubCategoryItem}
    keyExtractor={(item) => item.id.toString()}
    ListEmptyComponent={
      !loading && subCategories.length === 0 ? (
        <Text style={styles.noDataText}>No Subcategories Available</Text>
      ) : null
    }
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
    ListEmptyComponent={
      !loading && categories.length === 0 ? (
        <Text style={styles.noDataText}>No Categories Available</Text>
      ) : null
    }
  />
)}



      <Snackbar
        visible={SnackBarVisible}
        onDismiss={onDismissSnackBar}
        style={{ backgroundColor: "white" }}
        duration={3000}
      >
        <Text style={{ fontFamily: "AvenirNextCyr-Medium" }}>
          Product Deleted successfully !
        </Text>

      </Snackbar>

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


{/* 
      // ORDO GSI APP B_408 | 03-Apr-2025 | Sahana 
      // Fixed issues where loading is false, so that no data message doesn't appear for frac of sec */}

        {selectedCategory ? (
          <FlatList
            data={subCategories}
            renderItem={renderSubCategoryItem}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={
              !loading && subCategories.length === 0 ? (
                <Text style={styles.noDataText}>No Subcategories Available</Text>
              ) : null
            }
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
            ListEmptyComponent={
              !loading && categories.length === 0 ? (
                <Text style={styles.noDataText}>No Categories Available</Text>
              ) : null
            }
          />
        )}
      </View>
    </SafeAreaView>
  </Modal>



      <LoadingView visible={loading} message="Please Wait ..." />
    </View>
  );
};

export default Inventory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    paddingBottom: 0,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 5,
    marginBottom: 7,
  },

  filterButton: {
    flexDirection: "column",
    alignItems: "center",
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
  imageView: {
    width: 80,
    height: 80,
    resizeMode: "contain",
  },
  elementText: {
    fontSize: 15,
    fontFamily: "AvenirNextCyr-Bold",
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
    paddingHorizontal: 10,
    marginLeft: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    marginRight: 10,
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
    marginRight: 10,
    height: 50,
    width: '80%'
  },
  modalTitle: {
    fontSize: 16,
    color: "black",
    fontFamily: "AvenirNextCyr-Bold",
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 6,
    fontFamily: "AvenirNextCyr-Medium",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    width: "90%", // Adjust the width as needed, for example '90%'
    alignSelf: "center", // Center the modal content horizontally
  },

  closeIcon: {
    position: "absolute",
    top: 0, // Set the top offset to 0 (right above the modal content)
    right: 5,
    padding: 10,
  },
  modalInnerContent: {
    marginTop: 15, // Add a margin to separate the icon from the modal content
  },
  ModalText1: {
    color: "#000000",
    textAlign: "left",
    fontSize: 15,
    fontFamily: "AvenirNextCyr-Bold",
    marginLeft: 1,
  },
  container1: {
    backgroundColor: "white",
    padding: 16,
    width: "100%", // Adjust the width as needed, for example '90%'
    alignSelf: "center", // Center the container horizontally within the modal
  },

  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    width: "100%", // Set the desired width for the dropdown, for example '100%' to match the parent container
  },

  icon1: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
    fontFamily: "AvenirNextCyr-Medium",
    color:'gray'
  },
  selectedTextStyle: {
    fontSize: 16,
    fontFamily: "AvenirNextCyr-Medium",
    color:Colors.black
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    fontFamily: "AvenirNextCyr-Medium",
    color:Colors.black
  },
  submitButton: {
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "AvenirNextCyr-Bold",
  },
  noProductsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  noProductsText: {
    fontSize: 16,
    color: "gray",
    fontFamily: "AvenirNextCyr-Medium",
    textAlign: "center",
    marginTop: 80,
  },
  fab: {
    position: "absolute",
    margin: 20,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.primary,
    fontFamily: "AvenirNextCyr-Medium",
  },
  fabStyle: {
    borderRadius: 50,
    position: "absolute",
    margin: 10,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.primary,
  },
  watermarkContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
  },
  watermarkText: {
    fontSize: 20,
    color: "#9B5B79",
    fontFamily: "AvenirNextCyr-Bold",
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
    paddingHorizontal: 0,
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
    marginTop:'3%',
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

