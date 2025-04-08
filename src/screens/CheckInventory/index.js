import { StyleSheet, Text, View, Image, FlatList, ActivityIndicator, TouchableOpacity, Keyboard, TextInput, Modal, Pressable, Alert } from 'react-native'
import React, { useState, useEffect, useContext, useRef, useCallback } from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign';
import Colors from '../../constants/Colors';
import { useFocusEffect } from "@react-navigation/native";
import { Dropdown } from 'react-native-element-dropdown';
import Icon from 'react-native-vector-icons/FontAwesome';
import globalStyles from '../../styles/globalStyles';
import { AuthContext } from '../../Context/AuthContext';
import LinearGradient from 'react-native-linear-gradient';
import { Searchbar, Checkbox, RadioButton } from 'react-native-paper';
import { searchItem } from "../../utils/Search";
import { debounce } from "../../utils/Search";




const CheckInInventory = ({ navigation, route }) => {
  const screen = route.params?.screen;
  const { token, userData } = useContext(AuthContext);


  const [masterData, setMasterData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const [subcategoryData, setSubCategoryData] = useState([]);
  const [brandData, setBrandData] = useState([]);
  const [brandResponse, setBrandResponse] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");

  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategory, setSubSelectedCategory] = useState('');

  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [isFocus2, setIsFocus2] = useState(false);
  const [isFocus3, setIsFocus3] = useState(false);
  const [brId, setBrId] = useState(false);

  const [brandLabel, setBrandLabel] = useState('');
  const [categoryLabel, setCategoryLabel] = useState('');
  const [subCategoryLabel, setSubCategoryLabel] = useState('');
  const [searching, setSearching] = useState(false);
  const queryParams = useRef({ limit: 10, offset: 0 });
  const [categoryWiseData, setCategoryWiseData] = useState([]);


  useEffect(() => {
    loadAllProduct(queryParams.current.limit, queryParams.current.offset);
  }, [])

  const onEndReached = () => {
    if (search.trim()) {
      return;
    }
    if (!loading) {
      queryParams.current.offset += queryParams.current.limit;
      setLoading(true);
      loadAllProduct(queryParams.current.limit, queryParams.current.offset);
    }
  };

  const handleSearch = async (val) => {
    const baseUrl = "https://gsidev.ordosolution.com/api/test_product/?limit=5&offset=5";
    setSearching(true)
    const result = await searchItem(baseUrl, val, userData.token);
    setSearching(false)
    if (result) {
      setFilteredData(result.products);
      // setProductCount(result.length);
    }
  };

  const debouncedSearch = useCallback(debounce(handleSearch, 500), [userData.token]);

  useEffect(() => {
    if (search.trim()) {
      debouncedSearch(search);
    } else {
      setFilteredData(masterData);
      // setProductCount(masterData.length);
    }
  }, [search]);

  useEffect(() => {
    getBrand()
  }, [])

  useEffect(() => {
    getCategory()
  }, [])

  useEffect(() => {
    if (userData && userData.id) {
      getBrand(userData.id);
    }
  }, [userData]);

  const [cartData, setCartData] = useState([]);

  const loadAllProduct = async (limit, offset) => {
    setLoading(true);
    console.log("loading all product");
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${userData.token}`);


    var raw = JSON.stringify({
      "__user_id__": userData.id
    });

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      // body: raw,
      redirect: 'follow'
    };

    try {
      const response = await fetch(
        `https://gsidev.ordosolution.com/api/test_product/?limit=${limit}&offset=${offset}`,
        requestOptions
      );
      const result = await response.json();

      // setProductCount(result.total_count);

      // Store the result in AsyncStorage
      // await AsyncStorage.setItem("productData", JSON.stringify(result));

      // Update state variables
      if (offset === 0) {
        setMasterData(result.products);
        setFilteredData(result.products);
      } else {
        setMasterData((prevData) => [...prevData, ...result.products]);
        setFilteredData((prevData) => [...prevData, ...result.products]);
      }
      setLoading(false);
    } catch (error) {
      console.log("error", error);
    }
  }

  const searchProduct = (text) => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource
      // Update FilteredDataSource
      const newData = masterData.filter(
        function (item) {
          const itemData = item.name
            ? item.name.toUpperCase() + item?.brand?.brand_name.toUpperCase()
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
        "https://gsidev.ordosolution.com/api/product/",
        requestOptions
      );
      const result = await response.json();

      console.log("brand", result);
      setBrandResponse(result);
      // const allOption = { label: 'All', value: 'all' };
      const transformedData = result.map((item) => ({
        label: item?.brand.brand_name,
        value: item?.brand.id,
      }));

      const uniqueData = transformedData.filter((item, index, array) => {
        return array.findIndex((i) => i.label === item.label) === index;
      });

      // console.log("dhalfahljfahfaiiq", uniqueData);
      setBrandData(uniqueData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // console.log("fgdfdsf", brandData)


  const getCategory = async (brandId) => {
    // Fetch category list API
    console.log('get category', brandId);
    setBrId(brandId);

    let apiUrl;
    let requestData;

    // if (userData && userData.dealer_name === 'Nikai FMCG') {
    //   // Use the new API and payload for 'Nikai Fmcg'
    //   apiUrl = 'https://gsi.ordosolution.com/get_category.php';
    //   requestData = {
    //     __user_id__: userData.id, // Use the userId from userData
    //   };
    // } else {
    // Use the regular API and payload
    apiUrl = 'https://gsi.ordosolution.com/get_category_from_brand.php';
    requestData = {
      __brand_id__: brandId,
    };
    // }

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
      console.error('Error fetching data:', error);
    }
  };

  console.log('checkkk', categoryData);


  //   console.log('checkkk',categoryData)

  const getSubCategory = async (id) => {
    // Fetch category list API
    // const apiUrl = 'https://gsi.ordosolution.com/get_category.php';

    const apiUrl = 'https://gsi.ordosolution.com/get_subcategory_from_category_v2.php';
    const requestData = {
      __category_id__: id,
      __user_id__: userData.id,
      __brand_id__: brId,
    };
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });
      const jsonData = await response.json();
      console.log("dataa", jsonData)

      // const allOption = { label: 'All', value: 'all' };
      const transformedData = jsonData.sub_category_list.map((item) => ({
        label: item.name,
        value: item.id,
      }));

      setSubCategoryData(transformedData);

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // const handleBrandChange = async () => {
  //     // setSelectedCategory(value);
  //     // console.log("valuee", selectedCategory)

  //     if (selectedBrand === 'all') {
  //       // If "All" is selected, show all the products
  //       setFilteredData(masterData);
  //     } else {
  //       try {
  //         const apiUrl = 'https://gsi.ordosolution.com/get_category_wise_product.php';
  //         const requestData = {
  //           __id__: selectedCategory,
  //         };

  //         const response = await fetch(apiUrl, {
  //           method: 'POST',
  //           headers: {
  //             'Content-Type': 'application/json'
  //           },
  //           body: JSON.stringify(requestData)
  //         });

  //         if (!response.ok) {
  //           throw new Error('Network response was not ok');
  //         }

  //         const jsonData = await response.json();

  //         console.log("category product ", jsonData)

  //         const tempArray = jsonData?.products.map((object) => {
  //           return {
  //             itemid: object.part_number,
  //             description: object.name,
  //             ldescription: object.description,
  //             price: object.price,
  //             price_usdollar: object.paddingVerticalrice_usdollar,
  //             aos_product_category_id: object.aos_product_category_id,
  //             category: object.category,
  //             retail_price:object.retail_price,
  //             no_of_days_remaining: object.no_of_days_remaining,
  //             net_weight: object.net_weight,
  //             manufacturer_c: object.manufacturer_c,
  //             alternative_unit: object.alternative_unit,
  //             tax: object.tax,
  //             hsn: object.hsn,
  //             weight: object.weight_c,
  //             material_type: object.material_type,
  //             gross_weight: object.gross_weight,
  //             weight_unit: object.weight_unit,
  //             volume: object.volume,
  //             volume_unit: object.volume_unit,
  //             imgsrc: object.product_image,
  //             stock: object.stock_c,
  //             id: object.id,
  //             noofdays: object.no_of_days,
  //             unit_of_dimention: object.unit_of_dimention,
  //             length: object.length,
  //             width: object.width,
  //             height: object.height,
  //             number_of_pieces: object.number_of_pieces,
  //             ean_category: object.ean_category,
  //             capacity_usage: object.capacity_usage,
  //             denominator: object.denominator,
  //             temp_condition: object.temp_condition,
  //           };
  //         });

  //         // console.log("cateogry res", jsonData)
  //         // Assuming jsonData contains the products for the selected category
  //         setCategoryWiseData(tempArray);
  //         setFilteredData(tempArray);
  //       } catch (error) {
  //         console.error('Error fetching category-wise data:', error);
  //       }
  //     }
  //   };

  // const handleCategoryChange = async () => {
  //     // setSelectedCategory(value);
  //     // console.log("valuee", selectedCategory)

  //     if (selectedCategory === 'all') {
  //         // If "All" is selected, show all the products
  //         setFilteredData(masterData);
  //     } else {
  //         try {
  //             const apiUrl = 'https://gsi.ordosolution.com/get_category_wise_product.php';
  //             const requestData = {
  //                 __id__: selectedCategory,
  //             };

  //             const response = await fetch(apiUrl, {
  //                 method: 'POST',
  //                 headers: {
  //                     'Content-Type': 'application/json'
  //                 },
  //                 body: JSON.stringify(requestData)
  //             });

  //             if (!response.ok) {
  //                 throw new Error('Network response was not ok');
  //             }

  //             const jsonData = await response.json();

  //             console.log("category product ", jsonData)

  //             const tempArray = jsonData?.products.map((object) => {
  //                 return {
  //                     itemid: object.part_number,
  //         description: object.name,
  //         ldescription: object.description,
  //         price: object.price,
  //         price_usdollar: object.paddingVerticalrice_usdollar,
  //         aos_product_category_id: object.aos_product_category_id,
  //         category: object.category,
  //         retail_price:object.retail_price,
  //         no_of_days_remaining: object.no_of_days_remaining,
  //         net_weight: object.net_weight,
  //         manufacturer_c: object.manufacturer_c,
  //         alternative_unit: object.alternative_unit,
  //         tax: object.tax,
  //         hsn: object.hsn,
  //         weight: object.weight_c,
  //         material_type: object.material_type,
  //         gross_weight: object.gross_weight,
  //         weight_unit: object.weight_unit,
  //         volume: object.volume,
  //         volume_unit: object.volume_unit,
  //         imgsrc: object.product_image,
  //         stock: object.stock_c,
  //         id: object.id,
  //         noofdays: object.no_of_days,
  //         unit_of_dimention: object.unit_of_dimention,
  //         length: object.length,
  //         width: object.width,
  //         height: object.height,
  //         number_of_pieces: object.number_of_pieces,
  //         ean_category: object.ean_category,
  //         capacity_usage: object.capacity_usage,
  //         denominator: object.denominator,
  //         temp_condition: object.temp_condition,
  //                 };
  //             });

  //             // console.log("cateogry res", jsonData)
  //             // Assuming jsonData contains the products for the selected category
  //             setCategoryWiseData(tempArray);
  //             setFilteredData(tempArray);
  //         } catch (error) {
  //             console.error('Error fetching category-wise data:', error);
  //         }
  //     }
  // };


  const handleSubCategoryChange = async (setSelectedCategory) => {
    // setSelectedCategory(value);
    console.log("check valuee", selectedSubCategory)

    // if (selectedCategory === 'all') {
    //   // If "All" is selected, show all the products
    //   setFilteredData(masterData);
    // } else {
    const apiUrl = 'https://gsi.ordosolution.com/get_products_from_subcategory.php';
    const requestData = {
      __sub_category_id__: setSelectedCategory,
      __user_id__: userData.id,
      __brand_id__: brId,
    };
    try {

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const jsonData = await response.json();

      console.log("sub category product ", jsonData)


      const tempArray = jsonData?.products.map((object) => {
        return {
          itemid: object.part_number,
          description: object.name,
          ldescription: object.description,
          price: object.price,
          price_usdollar: object.paddingVerticalrice_usdollar,
          aos_product_category_id: object.aos_product_category_id,
          category: object.category,
          retail_price: object.retail_price,
          no_of_days_remaining: object.no_of_days_remaining,
          net_weight: object.net_weight,
          manufacturer_c: object.manufacturer_c,
          alternative_unit: object.alternative_unit,
          tax: object.tax,
          hsn: object.hsn,
          weight: object.weight_c,
          material_type: object.material_type,
          gross_weight: object.gross_weight,
          weight_unit: object.weight_unit,
          volume: object.volume,
          volume_unit: object.volume_unit,
          imgsrc: object.product_image,
          stock: object.stock_c,
          id: object.id,
          noofdays: object.no_of_days,
          unit_of_dimention: object.unit_of_dimention,
          length: object.length,
          width: object.width,
          height: object.height,
          number_of_pieces: object.number_of_pieces,
          ean_category: object.ean_category,
          capacity_usage: object.capacity_usage,
          denominator: object.denominator,
          temp_condition: object.temp_condition,
          brand_name: object.brand_name,
        };
      });

      // console.log("cateogry res", jsonData)
      // Assuming jsonData contains the products for the selected category
      setCategoryWiseData(tempArray);
      setFilteredData(tempArray);
    } catch (error) {
      console.error('Error fetching category-wise data:', error);
    }
    // }
  };


  const handleSubmit = async () => {
    try {
      // Your asynchronous code here
      const filteredObjects = brandResponse.filter(
        (obj) => obj.brand.id === selectedBrand
      );
      console.log("filtered response:", filteredObjects);
      setFilteredData(filteredObjects);
    } catch (error) {
      console.error("Error in handleSubmit:", error);
    }
    setSelectedBrand("");
    toggleModal();
  };


  console.log("selected", selectedCategory)

  const renderLabel = () => {
    if (value || isFocus) {
      return (
        <Text style={[styles.label, isFocus && { color: Colors.primary }]}>
          Product List
        </Text>
      );
    }
    return null;
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
    setSelectedBrand('');
    setSelectedCategory('');
    setSubSelectedCategory('');

  };

  const splitLongText = (text) => {
    const maxLengthPerLine = 8; 

    if (text.length <= maxLengthPerLine) {
      return text;
    }

    let splitText = '';
    for (let i = 0; i < text.length; i += maxLengthPerLine) {
      splitText += text.substr(i, maxLengthPerLine) + '\n';
    }

    return splitText;
  };



  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => navigation.goBack()} >
            <AntDesign name='arrowleft' size={25} color={Colors.black} />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerTitle}>Products</Text>

        <View style={{ flexDirection: 'row' }}>
          {screen == 'MIListDetail' && <TouchableOpacity style={{ marginRight: 10 }} onPress={() => navigation.navigate('SKUHistoryList')} >
            <Image source={require('../../assets/images/returns.png')} style={{ height: 20, width: 20, tintColor: Colors.primary, resizeMode: 'contain' }} />
            <Text style={{ fontSize: 10, color: Colors.primary, fontFamily: 'AvenirNextCyr-Medium', marginLeft: -5 }}>History</Text>
          </TouchableOpacity>}

          <TouchableOpacity style={styles.filterButton} onPress={() => {

            toggleModal();
          }
          }>

            <Icon name="filter" size={20} color="#6B1594" />
            <Text style={{ fontSize: 10, color: Colors.primary, fontFamily: 'AvenirNextCyr-Medium', marginLeft: 5 }}>Filter</Text>
          </TouchableOpacity>
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
        // onPressOut={closeModal}
        >
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeIcon} onPress={toggleModal}>
              <Icon name="times" size={20} color="#000" />
            </TouchableOpacity>
            <View style={styles.modalInnerContent}>
              {/* {userData && userData.dealer_name === 'Nikai Electronics' && ( */}
              <View style={styles.container1}>
                <Text style={styles.ModalText1}>Select Brand</Text>
                <Dropdown
                  style={[styles.dropdown, isFocus3 && { borderColor: Colors.primary }]}
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
                  placeholder={!isFocus3 ? 'Select item' : '...'}
                  searchPlaceholder="Search..."
                  value={selectedBrand}
                  onFocus={() => setIsFocus3(true)}
                  onBlur={() => setIsFocus3(false)}
                  onChange={(item) => {
                    setBrandLabel(item.label);
                    setSelectedBrand(item.value);
                    getCategory(item.value)
                    setIsFocus3(false);
                  }}
                />
              </View>
              {/* )} */}


              <LinearGradient
                colors={Colors.linearColors}
                start={Colors.start}
                end={Colors.end}
                locations={Colors.ButtonsLocation}
                style={{ borderRadius: 8, marginHorizontal: '5%' }}
              >

                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                  <Text style={styles.submitButtonText}>Apply Filter</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>



      <ActivityIndicator
        animating={loading}
        color={Colors.primary}
        size="large"
        style={styles.activityIndicator}

      />


      <View style={{ width: '100%' }}>
        <Searchbar
          style={{ marginHorizontal: '1%', marginVertical: '3%', backgroundColor: '#F3F3F3' }}
          placeholder="Search Product"
          onChangeText={(val) => setSearch(val)}
          value={search}
          loading={searching}
        //   clearIcon={() => (
        //     <Searchbar.Icon
        //       icon="close"
        //       onPress={clearSearch}
        //       color="#000" // Customize the clear icon color
        //     />
        //   )}
        />
      </View>

      {brandLabel && categoryLabel && subCategoryLabel && (

        <View style={styles.capsuleContainer}>
          <View style={styles.capsule}>
            <Text style={styles.valueText}>{brandLabel}</Text>
          </View>
          <View style={styles.capsule}>
            <Text style={styles.valueText}>{categoryLabel}</Text>
          </View>
          <View style={styles.capsule}>
            <Text style={styles.valueText}>{subCategoryLabel}</Text>
          </View>
        </View>
      )}
      <Text style={{ color: '#000', fontFamily: 'AvenirNextCyr-Medium', fontSize: 13, marginBottom: '3%' }}>Choose your product</Text>

      <FlatList
        showsVerticalScrollIndicator={false}
        data={filteredData}
        onEndReached={onEndReached}
        keyboardShouldPersistTaps='handled'
        renderItem={({ item }) => (

          <Pressable style={styles.elementsView} onPress={() => {
            navigation.navigate(screen, { item: item })
             }}>

            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
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
              <View style={{
                flex: 1,
                borderLeftWidth: 1.5,
                paddingLeft: 15,
                marginLeft: 10,
                borderStyle: 'dotted',
                borderColor: 'grey',
              }}>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{
                    fontSize: 14, color: Colors.primary, fontFamily: 'AvenirNextCyr-Bold', marginBottom: 2, borderBottomColor: "grey",
                    borderBottomWidth: 0.5,
                    flex:2
                  }} >{item.name}</Text>
                  <Text style={{ fontSize: 12, color: 'black', fontFamily: 'AvenirNextCyr-Medium', marginBottom: 2 }} > {item.product_price}</Text>


                </View>
                <Text style={{ color: Colors.primary, fontSize: 12, fontFamily: 'AvenirNextCyr-Medium', marginTop: 4, }}>{item.brand?.brand_name}</Text>
                {/* <Text style={{ color: 'green', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}>{Number(item.stock) > 0 ? `Current Stock - ${item.stock}` : <Text style={{ color: 'red', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }} >Out of stock</Text>}</Text> */}
                <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}>{item.supplier?.supplier_name} </Text>
                {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                   <Text style={{ color: 'grey', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium', borderBottomColor: 'grey', borderBottomWidth: 0.5, }}>Net wt: {item.net_weight} Kg</Text> 
                  <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}>AED {Number(item.price)}</Text>
                </View> */}
              </View>
            </View>
          </Pressable>
        )}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={() => (
          <View style={styles.noProductsContainer}>
            <Text style={styles.noProductsText}>No Products Available</Text>
          </View>
        )}
      />
      {filteredData.length > 0 && loading && <View style={{ flexDirection: 'row', gap: 10, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontFamily: "AvenirNextCyr-Medium" }}>Loading more products</Text>
        <ActivityIndicator
          animating={loading}
          color={Colors.primary}
          size="small"
        />
      </View>}
    </View>
  )
}

export default CheckInInventory

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
    paddingBottom: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // To position the elements at the ends of the row
    // paddingHorizontal: 10, // Adjust padding as needed
    // Add other styles for the header container if required
    marginBottom: '1%'
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'AvenirNextCyr-Medium',
    color: Colors.black,
    marginLeft: 10,
    marginTop: 3,

  },
  filterButton: {
    flexDirection: 'column',
    alignItems: 'center',
    // marginRight:3
  },
  activityIndicator: {
    flex: 1,
    alignSelf: 'center',
    height: 100,
    position: 'absolute',
    top: '30%',

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
    ...globalStyles.border,
    padding: 16
    //borderColor: '#fff',
    //borderWidth: 0.5
  },
  imageView: {
    width: 80,
    height: 80,
    // borderRadius: 40,
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
    fontFamily: 'AvenirNextCyr-Medium',
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
    fontFamily: 'AvenirNextCyr-Medium'
  },
  sendButton: {
    color: 'white',
    fontFamily: 'AvenirNextCyr-Medium'
  },
  deleteButton: {
    color: 'red'
  },
  saveButton: {
    color: 'purple'
  },
  textColor: {
    color: 'black',
    fontFamily: 'AvenirNextCyr-Medium',

  },
  searchModal: {
    backgroundColor: 'white',
    padding: 20,
    width: '90%',
    marginHorizontal: 10,
    borderRadius: 10,
    elevation: 5,

    ...globalStyles.border,
    //borderColor: 'black',
    //borderWidth: 1,
    marginVertical: 100
    // flexDirection:'row'
  },
  modalSearchContainer: {
    flex: 0.8,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    marginRight: 10
  },
  modalTitle: {
    fontSize: 16,
    color: 'black',
    fontFamily: 'AvenirNextCyr-Medium'
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 6,
    fontFamily: 'AvenirNextCyr-Medium',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
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
    padding: 10,
  },
  modalInnerContent: {
    marginTop: 15, // Add a margin to separate the icon from the modal content
  },
  ModalText1: {
    color: '#000000',
    textAlign: 'left',
    fontSize: 15,
    fontFamily: 'AvenirNextCyr-Bold',
    marginBottom: '2%',

  },
  container1: {
    backgroundColor: 'white',
    padding: 16,
    width: '100%', // Adjust the width as needed, for example '90%'
    alignSelf: 'center', // Center the container horizontally within the modal
  },

  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    width: '100%', // Set the desired width for the dropdown, for example '100%' to match the parent container
  },

  icon1: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
    fontFamily: 'AvenirNextCyr-Medium',

  },
  selectedTextStyle: {
    fontSize: 16,
    fontFamily: 'AvenirNextCyr-Medium',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    fontFamily: 'AvenirNextCyr-Medium',

  },
  submitButton: {

    // backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    // marginTop: 8,
    // marginLeft: 15,
    // marginRight: 15,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'AvenirNextCyr-Medium'
  },
  noProductsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noProductsText: {
    fontSize: 16,
    color: 'gray',
    fontFamily: 'AvenirNextCyr-Medium',
    textAlign: 'center',
    marginTop: 80,
  },
  capsuleContainer: {
    flexDirection: 'row', // Arrange capsules horizontally
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexWrap: 'wrap',// Center capsules vertically
    marginBottom: 4
  },
  capsule: {
    backgroundColor: '#ECECEC',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginRight: 10, // Space out the capsules
    marginBottom: 4
  },
  valueText: {
    fontSize: 9,
    fontWeight: 'bold',
  },


})
