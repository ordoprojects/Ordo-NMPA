import { StyleSheet, Text, View, Image, FlatList, ActivityIndicator, TouchableOpacity, Keyboard, TextInput, Modal, Pressable, Alert } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign';
import Colors from '../../constants/Colors';
import { useFocusEffect } from "@react-navigation/native";
import { Dropdown } from 'react-native-element-dropdown';
import Icon from 'react-native-vector-icons/FontAwesome';
import globalStyles from '../../styles/globalStyles';
import { AuthContext } from '../../Context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FAB } from 'react-native-paper';
import { Checkbox } from 'react-native-paper';



const ChooseProducts = ({ navigation,route }) => {
    const { token, userData } = useContext(AuthContext);
    const { supplierName,id } = route.params;

    console.log("supp id",id)


    const [masterData, setMasterData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState('');
    const [isModalVisible, setModalVisible] = useState(false);
    const [categoryData, setCategoryData] = useState([]);
    const [subcategoryData, setSubCategoryData] = useState([]);
    const [brandData, setBrandData] = useState([]);

    const [selectedBrand, setSelectedBrand] = useState('');

    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSubCategory, setSubSelectedCategory] = useState('');
    const [selectedItem, setselectedItems] = useState([]);

    const [value, setValue] = useState(null);
    const [isFocus, setIsFocus] = useState(false);
    const [isFocus2, setIsFocus2] = useState(false);
    const [isFocus3, setIsFocus3] = useState(false);


    const [categoryWiseData, setCategoryWiseData] = useState([]);
    const [productCount, setProductCount] = useState("");

    useEffect(() => {
        loadAllProduct()

    }, [])

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


    // useFocusEffect(
    //     React.useCallback(() => {
    //         loadAllProduct()


    //     }, [])
    // );
    console.log("userdata", userData.id)
    // setIds(impId);

    const [cartData, setCartData] = useState([]);

    // const loadAllProduct = async (id) => {
    //     console.log("SAasf", userData.id)
    //     setLoading(true);
    //     console.log("loading all product");
    //     var myHeaders = new Headers();
    //     myHeaders.append("Content-Type", "application/json");

    //     var raw = JSON.stringify({
    //         "__user_id__": userData.id
    //     });

    //     var requestOptions = {
    //         method: 'POST',
    //         headers: myHeaders,
    //         body: raw,
    //         redirect: 'follow'
    //     };



    //     fetch("https://dev.ordo.primesophic.com/get_products.php", requestOptions)
    //         .then(response => response.json())
    //         .then(async result => {
    //             console.log('all product data fetched', result);

    //             tempArray = await result?.product_list.map(object => {
    //                 // console.log("og values", object.name_value_list)
    //                 return {
    //                     'itemid': object.part_number,
    //                     'description': object.name,
    //                     'ldescription': object.description,
    //                     'price': object.price,
    //                     'price_usdollar': object.paddingVerticalrice_usdollar,
    //                     'aos_product_category_id': object.aos_product_category_id,
    //                     'category': object.category,
    //                     'retail_price': object.retail_price,
    //                     'no_of_days_remaining': object.no_of_days_remaining,
    //                     'net_weight': object.net_weight,
    //                     'manufacturer_c': object.manufacturer_c,
    //                     'alternative_unit': object.alternative_unit,
    //                     "tax": object.tax,
    //                     "hsn": object.hsn,
    //                     'weight': object.weight_c,
    //                     'material_type': object.material_type,
    //                     'gross_weight': object.gross_weight,
    //                     'weight_unit': object.weight_unit,
    //                     'volume': object.volume,
    //                     'volume_unit': object.volume_unit,
    //                     'imgsrc': object.product_image,
    //                     "stock": object.stock_c,
    //                     "id": object.id,
    //                     "noofdays": object.no_of_days,
    //                     "unit_of_dimention": object.unit_of_dimention,
    //                     "length": object.pack,
    //                     "width": object.width,
    //                     "height": object.height,
    //                     "number_of_pieces": object.number_of_pieces,
    //                     "ean_category": object.ean_category,
    //                     "capacity_usage": object.capacity_usage,
    //                     "denominator": object.denominator,
    //                     "temp_condition": object.temp_condition,
    //                     "pack": object.pack_c,

    //                 }


    //             });
    //             // console.log("product data", tempArray);


    //             const pc = result.product_list.length;
    //             setProductCount(pc);
    //             // console.log("Product Count:", productCount);
    //             await AsyncStorage.setItem('productData', JSON.stringify(tempArray));
    //             setMasterData(tempArray)
    //             setFilteredData(tempArray);
    //             setLoading(false);


    //         })
    //         .catch(error => {
    //             setLoading(false);
    //             console.log('error', error)
    //         });
    // }


    const loadAllProduct = async () => {
        setLoading(true);
        console.log("Loading all products");

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            "__id__": id
        });

        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("https://dev.ordo.primesophic.com/get_products_for_vendors.php", requestOptions)
            .then((response) => response.json())
            .then(async (result) => {
                // console.log('All product data fetched', result);

                // Slice the result.product_list to get the first 10 products
                // const first10Products = result?.product_list.slice(0, 10);
                console.log("first 10mproducts", result)

                // Map and transform the first 10 products as needed
                // const tempArray = first10Products.map((object) => {
                //     return {
                //         'itemid': object.part_number,
                //         'description': object.name,
                //         'ldescription': object.description,
                //         'price': object.price,
                //         'price_usdollar': object.paddingVerticalrice_usdollar,
                //         'aos_product_category_id': object.aos_product_category_id,
                //         'category': object.category,
                //         'retail_price': object.retail_price,
                //         'no_of_days_remaining': object.no_of_days_remaining,
                //         'net_weight': object.net_weight,
                //         'manufacturer_c': object.manufacturer_c,
                //         'alternative_unit': object.alternative_unit,
                //         "tax": object.tax,
                //         "hsn": object.hsn,
                //         'weight': object.weight_c,
                //         'material_type': object.material_type,
                //         'gross_weight': object.gross_weight,
                //         'weight_unit': object.weight_unit,
                //         'volume': object.volume,
                //         'volume_unit': object.volume_unit,
                //         'imgsrc': object.product_image,
                //         "stock": object.stock_c,
                //         "id": object.id,
                //         "noofdays": object.no_of_days,
                //         "unit_of_dimention": object.unit_of_dimention,
                //         "length": object.pack,
                //         "width": object.width,
                //         "height": object.height,
                //         "number_of_pieces": object.number_of_pieces,
                //         "ean_category": object.ean_category,
                //         "capacity_usage": object.capacity_usage,
                //         "denominator": object.denominator,
                //         "temp_condition": object.temp_condition,
                //         "pack": object.pack_c,
                //     };
                // });

                const pc = result.length;
                setProductCount(pc);
                await AsyncStorage.setItem('productData', JSON.stringify(result));
                setMasterData(result);
                setFilteredData(result);
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
                console.log('Error', error);
            });
    };


    const searchProduct = (text) => {
        // Check if searched text is not blank
        if (text) {
            // Inserted text is not blank
            // Filter the masterDataSource
            // Update FilteredDataSource
            const newData = masterData.filter(
                function (item) {
                    const itemData = item?.product_name && item?.id
                        ? item?.product_name.toUpperCase() + item?.id.toUpperCase()
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
        const apiUrl = 'https://dev.ordo.primesophic.com/get_brand.php';
        const requestData = {
            __user_id__: userId,
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

            // const allOption = { label: 'All', value: 'all' };
            const transformedData = jsonData.brand_list.map((item) => ({
                label: item.name,
                value: item.id,
            }));

            setBrandData(transformedData);

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // console.log("fgdfdsf", brandData)


    const getCategory = async (brandId) => {
        // Fetch category list API
        console.log('get category', brandId);

        let apiUrl;
        let requestData;

        if (userData && userData.dealer_name === 'Nikai FMCG') {
            // Use the new API and payload for 'Nikai Fmcg'
            apiUrl = 'https://dev.ordo.primesophic.com/get_category.php';
            requestData = {
                __user_id__: userData.id, // Use the userId from userData
            };
        } else {
            // Use the regular API and payload
            apiUrl = 'https://dev.ordo.primesophic.com/get_category_from_brand.php';
            requestData = {
                __brand_id__: brandId,
            };
        }

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


    console.log('checkkk', categoryData)

    const getSubCategory = async (id) => {
        // Fetch category list API
        // const apiUrl = 'https://dev.ordo.primesophic.com/get_category.php';

        const apiUrl = 'https://dev.ordo.primesophic.com/get_subcategory_from_category_v2.php';
        const requestData = {
            __category_id__: id,
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

    // const handleBrandChange = async (brandId) => {
    //   console.log("handle",brandId)
    //   setSelectedBrand(brandId);
    //   setSelectedCategory('');
    //   setSubSelectedCategory('');

    //   try {
    //     const apiUrl = 'https://dev.ordo.primesophic.com/get_category_from_brand.php';
    //     const requestData = {
    //       __brand_id__: brandId,
    //     };

    //     const response = await fetch(apiUrl, {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json'
    //       },
    //       body: JSON.stringify(requestData)
    //     });

    //     if (!response.ok) {
    //       throw new Error('Network response was not ok');
    //     }

    //     const jsonData = await response.json();
    //     const transformedCategoryData = jsonData.category_list.map((item) => ({
    //       label: item.name,
    //       value: item.id,
    //     }));

    //     setCategoryData(transformedCategoryData);
    //   } catch (error) {
    //     console.error('Error fetching category data:', error);
    //   }
    // };

    // console.log("category data",categoryData)

    // const handleBrandChange = async (brandId) => {

    // // Fetch categories based on the selected brand
    // getCategory(selectedBrandId);
    // // setSelectedCategory(value);
    // console.log("valuee", selectedBrand);

    // if (selectedBrand === 'all') {
    //   // If "All" is selected, show all the products
    //   setFilteredData(masterData);
    // } else {
    //   try {
    //     const apiUrl = 'https://dev.ordo.primesophic.com/get_category_from_brand.php';
    //     const requestData = {
    //       __brand_id__: "53c3a9e9-18be-8be2-ffd3-64d5e1812d02",
    //     };

    //     const response = await fetch(apiUrl, {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json'
    //       },
    //       body: JSON.stringify(requestData)
    //     });

    //     if (!response.ok) {
    //       throw new Error('Network response was not ok');
    //     }

    //     const jsonData = await response.json();

    //     console.log("category product ", jsonData)

    //     const tempArray = jsonData?.products.map((object) => {
    //       return {
    //         itemid: object.part_number,
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
    //       };
    //     });

    // console.log("cateogry res", jsonData)
    // Assuming jsonData contains the products for the selected category
    //     setCategoryWiseData(tempArray);
    //     setFilteredData(tempArray);
    //   } catch (error) {
    //     console.error('Error fetching category-wise data:', error);
    //   }
    // }
    // };



    // const handleCategoryChange = async () => {
    //   // setSelectedCategory(value);
    //   // console.log("valuee", selectedCategory)

    //   if (selectedCategory === 'all') {
    //     // If "All" is selected, show all the products
    //     setFilteredData(masterData);
    //   } else {
    //     try {
    //       const apiUrl = 'https://dev.ordo.primesophic.com/get_category_wise_product.php';
    //       const requestData = {
    //         __id__: selectedCategory,
    //       };

    //       const response = await fetch(apiUrl, {
    //         method: 'POST',
    //         headers: {
    //           'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify(requestData)
    //       });

    //       if (!response.ok) {
    //         throw new Error('Network response was not ok');
    //       }

    //       const jsonData = await response.json();

    //       console.log("category product ", jsonData)

    //       const tempArray = jsonData?.products.map((object) => {
    //         return {
    //           itemid: object.part_number,
    //           description: object.name,
    //           ldescription: object.description,
    //           price: object.price,
    //           price_usdollar: object.paddingVerticalrice_usdollar,
    //           aos_product_category_id: object.aos_product_category_id,
    //           category: object.category,
    //           retail_price:object.retail_price,
    //           no_of_days_remaining: object.no_of_days_remaining,
    //           net_weight: object.net_weight,
    //           manufacturer_c: object.manufacturer_c,
    //           alternative_unit: object.alternative_unit,
    //           tax: object.tax,
    //           hsn: object.hsn,
    //           weight: object.weight_c,
    //           material_type: object.material_type,
    //           gross_weight: object.gross_weight,
    //           weight_unit: object.weight_unit,
    //           volume: object.volume,
    //           volume_unit: object.volume_unit,
    //           imgsrc: object.product_image,
    //           stock: object.stock_c,
    //           id: object.id,
    //           noofdays: object.no_of_days,
    //           unit_of_dimention: object.unit_of_dimention,
    //           length: object.length,
    //           width: object.width,
    //           height: object.height,
    //           number_of_pieces: object.number_of_pieces,
    //           ean_category: object.ean_category,
    //           capacity_usage: object.capacity_usage,
    //           denominator: object.denominator,
    //           temp_condition: object.temp_condition,
    //         };
    //       });

    //       // console.log("cateogry res", jsonData)
    //       // Assuming jsonData contains the products for the selected category
    //       setCategoryWiseData(tempArray);
    //       setFilteredData(tempArray);
    //     } catch (error) {
    //       console.error('Error fetching category-wise data:', error);
    //     }
    //   }
    // };

    const handleSubCategoryChange = async (setSelectedCategory) => {
        // setSelectedCategory(value);
        console.log("check valuee", selectedSubCategory)

        // if (selectedCategory === 'all') {
        //   // If "All" is selected, show all the products
        //   setFilteredData(masterData);
        // } else {
        const apiUrl = 'https://dev.ordo.primesophic.com/get_products_from_subcategory.php';
        const requestData = {
            __sub_category_id__: setSelectedCategory,
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
        if (userData && userData.dealer_name === 'Nikai FMCG') {
            // For Nikai Fmcg, both category and subcategory should be selected
            if (!selectedCategory || !selectedSubCategory) {
                Alert.alert('Warning', 'Please select both category and subcategory');
                return;
            }

            // Use the new category API
            handleSubCategoryChange(selectedSubCategory);

            // Clear only selected values, not the entire category data
            setSelectedCategory('');
            setSubSelectedCategory('');
            setSubCategoryData([]);


        } else {
            // For other dealers, brand, category, and subcategory should be selected
            if (!selectedBrand || !selectedCategory || !selectedSubCategory) {
                Alert.alert('Warning', 'Please select all dropdown values');
                return;
            }

            // Use the regular category API
            handleSubCategoryChange(selectedSubCategory);

            // Clear all selected values
            setSelectedBrand('');
            setSelectedCategory('');
            setSubSelectedCategory('');
            setCategoryData([]);
            setSubCategoryData([]);
        }

        // Clear the filtered data array
        setCategoryWiseData([]);
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
        const maxLengthPerLine = 8; // Adjust this value as needed

        if (text.length <= maxLengthPerLine) {
            return text;
        }

        let splitText = '';
        for (let i = 0; i < text.length; i += maxLengthPerLine) {
            splitText += text.substr(i, maxLengthPerLine) + '\n';
        }

        return splitText;
    };


    const handleCheckboxChange = (item) => {
        if (selectedItem.find((customer) => customer.id === item.id)) {
            // Remove the customer from selectedItem
            setselectedItems((prevselectedItems) =>
                prevselectedItems.filter((customer) => customer.id !== item.id)
            );
        } else {
            // Add the customer to selectedItem
            setselectedItems((prevselectedItems) => [
                ...prevselectedItems,
                {
                    name: item.name,
                    id: item.id,
                    // quantity: 1,
                    product_image: item.product_image

                },
            ]);
        }

        console.log("selectedbnbj", selectedItem)

    };




    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <AntDesign name='arrowleft' size={25} color={Colors.black} />
                </TouchableOpacity>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

                    <Text style={{ fontSize: 20, color: Colors.primary, fontFamily: 'AvenirNextCyr-Medium' }}>Choose Products</Text>
                </View>
                {/* <TouchableOpacity style={styles.filterButton} onPress={() => {
        

          toggleModal();
        }
        }>
          <Icon name="filter" size={20} color="#6B1594" />
          <Text style={{ fontSize: 10, color: Colors.primary, fontFamily: 'AvenirNextCyr-Thin', marginLeft: 5 }}>Filter</Text>
        </TouchableOpacity> */}
            </View>

            {/* <View style={{

                height: 40

            }} /> */}
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
                            {userData && userData.dealer_name === 'Nikai Electronics' && (
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
                                            setSelectedBrand(item.value);
                                            getCategory(item.value)
                                            setIsFocus3(false);
                                        }}
                                    />
                                </View>
                            )}
                            <View style={styles.container1}>
                                <Text style={styles.ModalText1}>Select Category</Text>

                                {/* {renderLabel()} */}
                                <Dropdown
                                    style={[styles.dropdown, isFocus && { borderColor: Colors.primary }]}
                                    placeholderStyle={styles.placeholderStyle}
                                    selectedTextStyle={styles.selectedTextStyle}
                                    inputSearchStyle={styles.inputSearchStyle}
                                    itemTextStyle={styles.selectedTextStyle}
                                    iconStyle={styles.iconStyle}
                                    data={categoryData}
                                    search
                                    maxHeight={400}
                                    labelField="label"
                                    valueField="value"
                                    placeholder={!isFocus ? 'Select item' : '...'}
                                    searchPlaceholder="Search..."
                                    value={selectedCategory}
                                    onFocus={() => setIsFocus(true)}
                                    onBlur={() => setIsFocus(false)}
                                    onChange={(item) => {
                                        setSelectedCategory(item.value)
                                        getSubCategory(item.value)
                                        setIsFocus(false)
                                    }}
                                />
                            </View>
                            <View style={styles.container1}>
                                <Text style={styles.ModalText1}>Select Sub Category</Text>

                                {/* {renderLabel()} */}
                                <Dropdown
                                    style={[styles.dropdown, isFocus2 && { borderColor: Colors.primary }]}
                                    placeholderStyle={styles.placeholderStyle}
                                    selectedTextStyle={styles.selectedTextStyle}
                                    inputSearchStyle={styles.inputSearchStyle}
                                    itemTextStyle={styles.selectedTextStyle}
                                    iconStyle={styles.iconStyle}
                                    data={subcategoryData}
                                    search
                                    maxHeight={400}
                                    labelField="label"
                                    valueField="value"
                                    placeholder={!isFocus2 ? 'Select item' : '...'}
                                    searchPlaceholder="Search..."
                                    value={selectedSubCategory}
                                    onFocus={() => setIsFocus2(true)}
                                    onBlur={() => setIsFocus2(false)}
                                    onChange={(item) => {
                                        setSubSelectedCategory(item.value)
                                        setIsFocus2(false)
                                    }}
                                />
                            </View>
                            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                                <Text style={styles.submitButtonText}>Apply Filter</Text>
                            </TouchableOpacity>
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


            <View style={{ flexDirection: 'row' }}>
                <View style={styles.modalSearchContainer}>
                    <TextInput
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
                    style={{ height: 50, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', borderRadius: 8, paddingHorizontal: 16, elevation: 5, ...globalStyles.border, flex: 0.2 }}
                    onPress={() => {
                        setSearch('');
                        setFilteredData(masterData)
                        Keyboard.dismiss();
                    }
                    }
                >
                    <Text style={{ color: Colors.primary, fontFamily: 'AvenirNextCyr-Thin', fontSize: 14 }}>Clear</Text>

                </TouchableOpacity>

            </View>
            <Text style={{ color: '#000', fontFamily: 'AvenirNextCyr-Thin', fontSize: 13, marginLeft: 3 }}>Products {productCount}</Text>

            <FlatList
                showsVerticalScrollIndicator={false}
                data={filteredData}
                keyboardShouldPersistTaps='handled'
                renderItem={({ item }) =>

                    <Pressable style={styles.elementsView}
                        onPress={() => {

                            handleCheckboxChange(item)

                        }
                        }
                    >
                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        {item.product_image ? (
                                                    <Image
                                                        source={{ uri: item.product_image }}
                                                        style={{ ...styles.imageView }}
                                                    // onLoadStart={()=>{setLoading3(true)}}
                                                    // onLoad={()=>{setLoading3(false)}}
                                                    />
                                                ) : (
                                                    <Image
                                                        source={require('../../assets/images/noImagee.png')}
                                                        style={{ ...styles.imageView }}
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
                                    <Text style={{ color: 'red', fontSize: 12, fontFamily: 'AvenirNextCyr-Thin', borderBottomColor: 'grey', borderBottomWidth: 0.5, }}>{item.product_name}</Text>
                                    {/* <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}>INR {Number(item.price)}</Text> */}
                  <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}>INR {Number(item.price)}</Text>
                                   

                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',marginTop:15 }}>

                                <Text style={{ color: Colors.primary, fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}>{item.vendor_name}</Text>
                                <Checkbox.Android
                                        color={Colors.primary}
                                        status={
                                            selectedItem.some((customer) => customer.id === item.id) ? 'checked' : 'unchecked'
                                        }
                                    />


                                </View>


                            </View>

                        </View>

                    </Pressable>


                }
                keyExtractor={(item) => item.id.toString()}
                ListEmptyComponent={() => (
                    <View style={styles.noProductsContainer}>
                        <Text style={styles.noProductsText}>No Products Available</Text>
                    </View>
                )}
            />

            {/* <View >  */}
            <TouchableOpacity

                onPress={() => {
                    // console.log("Pressed")
                    if(selectedItem.length > 0){
                    navigation.navigate('SupplierCart', { supplierName: "testName", selectedProducts: selectedItem })
                    }else{
                        Alert.alert("Warning","Please choose one or more products")
                    }

                }
                }

                style={{ backgroundColor: Colors.primary, paddingVertical: '4%', justifyContent: 'center', alignItems: 'center', marginVertical: '5%', borderRadius: 20 }}>
                <Text style={{ fontFamily: 'AvenirNextCyr-Medium', fontSize: 16, color: 'white' }}>Proceed</Text>
            </TouchableOpacity>
            {/* </View> */}


        </View>



    )
}

export default ChooseProducts

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        paddingBottom: 0,
        backgroundColor: 'white'
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between', // To position the elements at the ends of the row
        paddingHorizontal: 5, // Adjust padding as needed
        // Add other styles for the header container if required
        marginBottom: 7
    },

    filterButton: {
        flexDirection: 'column',
        alignItems: 'center',
        //marginTop:3
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
        fontFamily: 'AvenirNextCyr-Thin',
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
        fontFamily: 'AvenirNextCyr-Medium',
        marginLeft: 1,

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
        fontFamily: 'AvenirNextCyr-Thin',

    },
    selectedTextStyle: {
        fontSize: 16,
        fontFamily: 'AvenirNextCyr-Thin',
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
        fontFamily: 'AvenirNextCyr-Thin',

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
        fontFamily: 'AvenirNextCyr-Thin',
        textAlign: 'center',
        marginTop: 80,
    },
    fab: {
        position: 'absolute',
        margin: 20,
        right: 0,
        bottom: 0,
        backgroundColor: Colors.primary,
        fontFamily: 'AvenirNextCyr-Thin',
    },

})