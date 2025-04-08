import { StyleSheet, Text, View, Image, FlatList, Keyboard, TouchableOpacity, ToastAndroid, TextInput, Modal, Pressable, Alert, SafeAreaView } from 'react-native'
import React, { useState, useEffect, useRef, useContext } from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign';
import Colors from '../../constants/Colors';
import { cameraPermission } from '../../utils/Helper';
import { AuthContext } from '../../Context/AuthContext';
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient'
import globalStyles from '../../styles/globalStyles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import { Searchbar, Checkbox, RadioButton } from 'react-native-paper';

const ReturnsCart = ({ navigation, route }) => {

    const { token, userData, dealerData } = useContext(AuthContext);
    // const { dealerInfo } = route.params;
    //bacr code permission
    //check permssiosaon 
    const checkPermission = async () => {
        let PermissionDenied = await cameraPermission();
        if (PermissionDenied) {
            console.log("camera permssion granted");
            navigation.navigate('Scanner');
        }
        else {
            console.log("camera permssion denied");
            //requestStoragePermission();
        }
    }
    useEffect(() => {
        setIsModalVisible(true); // Show the modal when the component mounts
    }, []);

    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisible2, setModalVisible2] = useState(false);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalVisible1, setIsModalVisible1] = useState(false);
    const [totalCount, setTotalCount] = useState('');
    const [cartCount, setCartCount] = useState(0);
    const [addedItems, setAddedItems] = useState([]);

    const [response, setResponse] = useState('');




    const handlePress = () => {
        setFilteredData(masterData);
        setModalVisible(true);
    };
    const handleClose = () => {
        setModalVisible(false);
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


    const openModal = () => {
        setIsModalVisible(true);
    };


    const productsArray = [];

    //console.log("prodcuts array", productsArray)
    // const [masterData, setMasterData] = useState([]);
    // const [filteredData, setFilteredData] = useState([]);
    // const [search, setSearch] = useState('');
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
        setFilteredCartData(cartData)
    }, [cartData])

    const addProduct = (item) => {
        console.log("item ", item);
        let tempData = cartData;
        tempData.push({ ...item });
        console.log("updated temp array", tempData)
        setCartData(tempData);
        calOrderStat(tempData);
        // let productExist = false
        // if (tempData.length > 0) {
        //     cartData.map((itm) => {
        //         if (itm.id == item.id) {
        //             console.log("product already exist in the cart")
        //             productExist = true;
        //             //inscreasing  quantity of the product
        //             ++itm.qty;
        //         }
        //     })
        //     //product not present adding item in cart
        //     if (!productExist) {
        //         tempData.push({ ...item, qty: 1 });
        //     }
        //     setCartData(tempData);


        // }
        // else {
        //     //cart is empty adding product
        //     console.log("cart is  empty")
        //     tempData.push({ ...item, qty: 1 });
        //     setCartData(tempData);
        // }
        //adding item
    }

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

    const deleteProduct = (index) => {
        console.log('ggg');
        let tempCart = [...cartData];
        tempCart.splice(index, 1);
        //remove returns porduct data
        setCartData(tempCart);
        calOrderStat(tempCart);
    }

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

    //     fetch("https://gsi.ordosolution.com/set_return_order.php", requestOptions)
    //         .then(response => response.json())
    //         .then(result => {
    //             console.log("returen order res", result);

    //         })
    //         .catch(error => console.log('error', error));

    // }


    //Modal Hooks
    const [masterData, setMasterData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState('');
    useEffect(() => {
        loadAllProduct()

    }, [])

    // useFocusEffect(
    //     React.useCallback(() => {
    //         loadAllProduct()


    //     }, [])
    // );




    const loadAllProduct = async () => {
        setLoading(true);
        console.log("loading all product");
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        console.log("isddd", userData.id)
        var raw = JSON.stringify({
            __user_id__: userData.id,
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        console.log("user id", userData.id)

        fetch("https://dev.ordo.primesophic.com/get_products.php", requestOptions)
            .then(response => response.json())
            .then(async result => {
                console.log('all product data fetched', result);

                tempArray = await result?.product_list.map(object => {
                    // console.log("ogs", object.
                    return {
                        'itemid': object.part_number,
                        'description': object.name,
                        'ldescription': object.description,
                        'price': object.price,
                        'price_usdollar': object.paddingVerticalrice_usdollar,
                        'aos_product_category_id': object.aos_product_category_id,
                        'category': object.category,
                        'retail_price': object.retail_price,
                        'no_of_days_remaining': object.no_of_days_remaining,
                        'net_weight': object.net_weight,
                        'manufacturer_c': object.manufacturer_c,
                        'alternative_unit': object.alternative_unit,
                        "tax": object.tax,
                        "hsn": object.hsn,
                        'weight': object.weight_c,
                        'material_type': object.material_type,
                        'gross_weight': object.gross_weight,
                        'weight_unit': object.weight_unit,
                        'volume': object.volume,
                        'volume_unit': object.volume_unit,
                        'imgsrc': object.product_image,
                        "stock": object.stock_c,
                        "id": object.id,
                        "noofdays": object.no_of_days,
                        "unit_of_dimention": object.unit_of_dimention,
                        "length": object.length,
                        "width": object.width,
                        "height": object.height,
                        "number_of_pieces": object.number_of_pieces,
                        "ean_category": object.ean_category,
                        "capacity_usage": object.capacity_usage,
                        "denominator": object.denominator,
                        "temp_condition": object.temp_condition,
                    }


                });
                // console.log("product data", tempArray);
                setMasterData(tempArray)
                setFilteredData(tempArray);
                setLoading(false);


            })
            .catch(error => {
                setLoading(false);
                console.log('error', error)
            });
    }

    const searchProduct = (text) => {
        // Check if searched text is not blank
        if (text) {
            // Inserted text is not blank
            // Filter the masterDataSource
            // Update FilteredDataSource
            const newData = masterData.filter(
                function (item) {
                    const itemData = item.description
                        ? item.description.toUpperCase() + item.itemid.toUpperCase()
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
            const newData = cartData.filter(
                function (item) {
                    const itemData = item.description
                        ? item.description.toUpperCase() + item.itemid.toUpperCase()
                        : ''.toUpperCase();
                    const textData = text.toUpperCase();
                    return itemData.indexOf(textData) > -1;
                });
            setFilteredCartData(newData);
            setSearch(text);
        } else {
            // Inserted text is blank
            // Update FilteredDataSource with masterDataSource
            setFilteredCartData(cartData);
            setSearch(text);
        }
    };

    const clearCartData = () => {
        setCartData([]);
        calOrderStat([]);
        setAddedItems([]);

    }

    const orderItems = async () => {
        if (cartData.length > 0) {
            let productArray = cartData.map((item) => {
                return {
                    id: item.id,
                    qty: item.qty
                }
            })
            console.log("return array", productArray);
            navigation.navigate('AdminOrderReview', { productsArray: productArray, dealerInfo: dealerInfo, cartData: cartData, total: totalAmt })
        }
        else {
            alert('Sorry, no items to order')
        }

    }

    //add return product previous  screen data
    useEffect(() => {
        if (route.params?.returnItem) {
            let item = route.params?.returnItem;
            console.log("return item data ", item)
            //adding product to cart
            addProduct(item)
        }
    }, [route.params?.returnItem]);

    const AlertForOrder = () => {
        // Fetch total count before showing the modal
        if (cartData.length > 0) {
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            var raw = JSON.stringify({
                __user_id__: token,
                __account_id__: dealerData.id
                // __return_array__: returnArray

            }
            );
            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };
            fetch("https://dev.ordo.primesophic.com/get_returnorder_count.php", requestOptions)
                .then(response => response.json())
                .then(res => {
                    console.log("count", res.message)
                    setTotalCount(res.message);
                    setModalVisible2(true);
                })
                .catch(error => console.log('error', error));
        } else {
            Alert.alert('Add Product', 'Please add product to return')
        }
    }
    console.log("user idddddddddddddd", token)

    const returnOrder = () => {
        setModalVisible2(false);
        if (cartData.length > 0) {
            let returnArray = cartData.map((item) => {
                return {
                    product_id: item.product_id,
                    document_id: item.document_id,
                    remarks: item.remarks,
                    product_name: item.product_name,
                    quantity: item.qty
                }
            })
            console.log("return array", returnArray);
            // count from api


            // message from api
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            var raw = JSON.stringify({
                __user_id__: token,
                __return_array__: returnArray,
                __account_id__: dealerData.id

            }
            );
            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            fetch("https://dev.ordo.primesophic.com/set_returnorder.php", requestOptions)
                .then(response => response.json())
                .then(res => {
                    console.log("return order res", res);
                    if (res && res.message) {
                        Alert.alert('Alert', res.message, [
                            { text: 'OK', onPress: () => navigation.goBack() },
                        ]);
                    } else {
                        console.log('Unexpected response:', res);
                    }


                })
                .catch(error => console.log('error', error));
        }
        else {
            Alert.alert('Add Product', 'Please add product to return')
        }
    }

    return (
        <LinearGradient colors={Colors.linearColors}
            start={Colors.start}end={Colors.end}
            locations={Colors.location}
            style={{ backgroundColor: Colors.primary, borderColor: Colors.primary, justifyContent: 'center', alignItems: 'center', flex: 1 }}
        >

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


            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', height: '10%', alignItems: 'center', alignContent: 'center', textAlign: 'center' }}>
                <TouchableOpacity onPress={() => { navigation.goBack() }} style={{ paddingLeft: '5%' }}>
                    <Image source={require('../../assets/images/Refund_back.png')} style={{ height: 30, width: 30 }} />
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                    <Text style={{ fontFamily: 'AvenirNextCyr-Medium', fontSize: 19, marginLeft: 8, color: 'white', marginTop: '2%' }}>  Returns Cart   </Text>
                    <TouchableOpacity onPress={openModal} >
                        <AntDesign name='infocirlceo' size={18} color={'white'} />
                    </TouchableOpacity>
                </View>
                <View>

                    <TouchableOpacity
                        style={{ flexDirection: 'row', backgroundColor: 'white', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 5, elevation: 5, ...globalStyles.border, marginRight: 7 }}
                        onPress={handlePress}
                    >
                        <MaterialCommunityIcons name="cart-variant" size={20} color="#50001D" />

                        <Text style={{ color: Colors.primary, fontFamily: 'AvenirNextCyr-Medium' }}> Add</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={{ height: '88%', backgroundColor: 'white', width: '100%', borderTopEndRadius: 50, borderTopStartRadius: 50, paddingVertical: 10, paddingHorizontal: 20 }}>
                {cartData.length > 0 && (
                    <>
                        <View style={{ justifyContent: 'space-between', flexDirection: 'row', borderRadius: 10, paddingVertical: '2%', paddingHorizontal: '1%', marginVertical: '0%' }}>
                            <Text style={{ color: Colors.primary, fontFamily: 'AvenirNextCyr-Medium', fontSize: 18 }}>My Orders </Text>
                            <TouchableOpacity
                                style={{ backgroundColor: Colors.primary, paddingVertical: 4, paddingHorizontal: 10, borderRadius: 5, elevation: 5, ...globalStyles.border }}
                                onPress={clearCartData}
                            >
                                <Text style={{ color: 'white', fontFamily: 'AvenirNextCyr-Thin' }}>Remove All</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: 1 }}>

                            <View style={{ width: '100%' }}>
                                <Searchbar
                                    style={{ marginBottom: '2%', marginVertical: '1%', backgroundColor: '#F3F3F3' }}
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
                            </View>
                        </View>
                    </>
                )}

                {/* Modal */}
                <Modal
                    visible={modalVisible}
                    animationType="slide"
                    transparent>
 
                    <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', paddingHorizontal: 1 }}>

                        <View style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: 10, borderRadius: 8, marginTop: '16%' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <View>
                                    <TouchableOpacity onPress={() => {
                                        // setSearch('');
                                        setModalVisible(false)
                                    }}
                                        style={{ backgroundColor: Colors.primary, paddingVertical: 5, paddingHorizontal: 4, borderRadius: 5, elevation: 5, ...globalStyles.border, flex: 0.5 }}>
                                        <MaterialCommunityIcons name="cart-variant" size={25} color="white" />

                                        {cartCount > 0 && <View style={styles.cartCountContainer}>
                                            <Text style={styles.cartCountText}>{cartCount}</Text>
                                        </View>}
                                    </TouchableOpacity>

                                </View>
                                <Text style={{ alignSelf: 'center', fontSize: 20, color: Colors.primary, fontFamily: 'AvenirNextCyr-Medium', marginVertical: 10 }}>Add Products</Text>
                                <TouchableOpacity style={{ marginRight: 10, backgroundColor: '#f1f1f1', paddingVertical: 2, paddingLeft: 3, borderRadius: 30, flex: 0.1, }} onPress={() => {
                                    setSearch('');
                                    setModalVisible(false)

                                }}

                                >
                                    <Entypo name='cross' size={16} color='grey' />
                                </TouchableOpacity>
                            </View>
                            {/* <View style={{height: 40}} /> */}

                            <View style={{ width: '100%' }}>

                                <Searchbar
                                    style={{ marginHorizontal: '1%', marginVertical: '3%', backgroundColor: '#F3F3F3' }}
                                    placeholder="Search Product"
                                    onChangeText={(val) => searchProduct(val)}
                                    value={search}

                                //   clearIcon={() => (
                                //     <Searchbar.Icon
                                //       icon="close"
                                //       onPress={clearSearch}
                                //       color="#000" // Customize the clear icon color
                                //     />
                                //   )}
                                />

                                {/* <TouchableOpacity
                                    style={{ height: 45, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', borderRadius: 8, paddingHorizontal: 16, elevation: 5, flex: 0.2, marginLeft: 10, ...globalStyles.border, }}
                                    onPress={() => {
                                        setSearch('');
                                        setFilteredData(masterData)
                                        Keyboard.dismiss();
                                    }
                                    }
                                >
                                    <Text style={{ color: '#6B1594', fontFamily: 'AvenirNextCyr-Thin', fontSize: 14 }}>Clear</Text>

                                </TouchableOpacity> */}
                            </View>

                            <FlatList
                                showsVerticalScrollIndicator={false}
                                data={filteredData}
                                keyboardShouldPersistTaps='handled'
                                renderItem={({ item }) =>
                                    <View style={{
                                        backgroundColor: addedItems.includes(item.id) ? "#50001D" : "#f2f2f2",
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
                                            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                                <View style={{ backgroundColor: 'white', elevation: 5, ...globalStyles.border, borderRadius: 20, padding: '3%' }}>
                                                    <Image

                                                        source={{ uri: item.imgsrc }}
                                                        style={{
                                                            ...styles.imageView,
                                                        }}
                                                    />
                                                </View>
                                                <View style={{
                                                    flex: 1,
                                                    paddingLeft: 15,
                                                    marginLeft: 10,

                                                }}>

                                                    <Text style={{ fontSize: 12, color: addedItems.includes(item.id) ? 'white' : Colors.primary, fontFamily: 'AvenirNextCyr-Medium', marginBottom: 2 }} > {item.itemid}</Text>
                                                    <Text style={{ color: addedItems.includes(item.id) ? 'white' : "gray", fontSize: 12, fontFamily: 'AvenirNextCyr-Thin', marginTop: 1, }}>{item.description}</Text>
                                                    {/* <Text style={{ color: 'green', fontSize: 12, fontFamily: 'AvenirNextCyr-Thin' }}>{Number(item.stock) > 0 ? `Current Stock - ${item.stock}` : <Text style={{ color: 'red', fontSize: 12, fontFamily: 'AvenirNextCyr-Thin' }} >Out of stock</Text>}</Text> */}
                                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <Text style={{ color: addedItems.includes(item.id) ? 'white' : Colors.primary, fontSize: 12, fontFamily: 'AvenirNextCyr-Medium', }}>Net wt: {item.net_weight} Kg</Text>


                                                        {/* <TouchableOpacity
                                                style={{ justifyContent: 'center', alignItems: 'center', padding: 10, paddingHorizontal: 16, borderRadius: 5, backgroundColor: '#fff', elevation: 5, ...globalStyles.border }}
                                                onPress={() => addProduct(item)}
                                            >
                                                <Text style={{ color: Colors.primary, fontSize: 12, fontFamily: 'AvenirNextCyr-Thin' ,marginLeft:5}}>+Add</Text>
                                            </TouchableOpacity> */}

                                                    </View>

                                                </View>

                                            </View>

                                        </Pressable>
                                        <View style={{ width: '100%', justifyContent: 'flex-end', flexDirection: 'row', position: 'absolute', bottom: 0, }}>

                                            {/* <TouchableOpacity
                                                style={{ width:'24%', padding: 10, paddingHorizontal: 10, borderBottomRightRadius: 20,  backgroundColor: item.added ? "gray" : "#50001D", elevation: 5, ...globalStyles.border ,borderTopLeftRadius:10,flexDirection:'row'}}
                                                onPress={() => addProduct(item)
                                                }
                                                disabled={item.added}
                                            >
                             <MaterialCommunityIcons  name="cart-variant" size={20} color="white"/>

                                                <Text style={{ color: 'white', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium'}}>  {item.added ? 'Added ' : 'Add'}</Text>
                                            </TouchableOpacity> */}
                                            <TouchableOpacity
                                                style={{
                                                    width: '24%',
                                                    padding: 10,
                                                    paddingHorizontal: 10,
                                                    borderBottomRightRadius: 20,
                                                    backgroundColor: addedItems.includes(item.id) ? "#f2f2f2" : "#50001D",
                                                    elevation: 5,
                                                    borderTopLeftRadius: 10,
                                                    flexDirection: 'row'
                                                }}
                                                onPress={() => {
                                                    //checking product exists in the cart
                                                    //setModalVisible(false);
                                                    let productExist = false
                                                    cartData.forEach((itm) => {
                                                        if (itm.id == item.id) {
                                                            console.log("product already exist return cart")
                                                            Alert.alert('Product Exists', 'Product already exists in your cart')
                                                            productExist = true;
                                                            setAddedItems((prevAddedItems) => [...prevAddedItems, item.id]);
                                                        }
                                                    })
                                                    if (!productExist) {
                                                        setModalVisible(false);
                                                        navigation.navigate("ReturnAddProduct", { item: item });
                                                    }
                                                }}
                                                disabled={addedItems.includes(item.id)}
                                            >
                                                <MaterialCommunityIcons name="cart-variant" size={20} color={addedItems.includes(item.id) ? "#50001D" : 'white'} />
                                                <Text style={{ color: addedItems.includes(item.id) ? "#50001D" : 'white', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}>
                                                    {addedItems.includes(item.id) ? 'Added ' : ' Add'}
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                }
                                keyExtractor={(item) => item.id.toString()}
                            />
                        </View>
                    </SafeAreaView>
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
                {filteredCartData.length === 0 ? (
                    <>
                        <Image
                            source={require('../../assets/images/CartEmpty.png')} // Replace with the actual path to your image
                            style={{ width: '100%', height: '40%', resizeMode: 'contain', marginTop: '25%' }}
                        />
                        <View>

                            <Text style={{ textAlign: 'center', fontFamily: 'AvenirNextCyr-Medium', fontSize: 23, color: 'rgba(101, 2, 49, 0.25)' }}>Your Cart is Empty</Text>
                            <Text style={{ textAlign: 'center', fontFamily: 'AvenirNextCyr-Medium', fontSize: 14, color: 'rgba(101, 2, 49, 0.45)' }}>Looks like you haven’t  added {'\n'} anything to your cart yet </Text>
                            <View style={{ height: '53%', flexDirection: 'row', justifyContent: 'center', marginTop: '4%' }}>
                                <TouchableOpacity
                                    style={{ backgroundColor: 'rgba(101, 2, 49, 0.6)', paddingVertical: 5, paddingHorizontal: 1, borderRadius: 30, elevation: 5, ...globalStyles.border, width: '15%', height: '23%' }}
                                    onPress={handlePress}
                                >

                                    <MaterialCommunityIcons style={{ color: 'white', fontFamily: 'AvenirNextCyr-Thin', textAlign: 'center', marginTop: '15%' }} name="cart-variant" size={30} color="black" />
                                </TouchableOpacity>

                            </View>
                        </View>
                    </>
                ) : (
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={filteredCartData}
                        keyboardShouldPersistTaps='handled'

                        renderItem={({ item, index }) =>
                            <View style={{
                                backgroundColor: "#50001D",
                                //   marginHorizontal: "4%",
                                marginTop: 5,
                                marginBottom: 5,
                                elevation: 5,
                                ...globalStyles.border,
                                borderRadius: 5
                            }}>
                                <Pressable style={{ padding: 10 }}
                                // onPress={() => navigation.navigate('ProductDetails', { item: item })}
                                // onPress={() => action ? navigation.navigate(screen, { item: item }) : navigation.navigate('ProductDetails', { item: item })}
                                >
                                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                        <View style={{ backgroundColor: 'white', elevation: 5, ...globalStyles.border, borderRadius: 5, padding: '1%' }}>
                                            <Image

                                                source={{ uri: item.imgsrc }}
                                                style={{
                                                    ...styles.imageView,
                                                }}
                                            />
                                        </View>
                                        <View style={{
                                            flex: 1,
                                            paddingLeft: 15,
                                            marginLeft: 10,

                                        }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                                                <Text style={{ fontSize: 12, color: 'white', fontFamily: 'AvenirNextCyr-Medium' }} > {item.itemid}</Text>
                                                <TouchableOpacity onPress={() => deleteProduct(index)} >
                                                    <MaterialCommunityIcons name='delete' size={20} color={'white'} />
                                                </TouchableOpacity>
                                            </View>
                                            <Text style={{ color: 'white', fontSize: 12, fontFamily: 'AvenirNextCyr-Thin', marginTop: 1, }}>{item.description}</Text>
                                            {/* <Text style={{ color: 'green', fontSize: 12, fontFamily: 'AvenirNextCyr-Thin' }}>{Number(item.stock) > 0 ? `Current Stock - ${item.stock}` : <Text style={{ color: 'red', fontSize: 12, fontFamily: 'AvenirNextCyr-Thin' }} >Out of stock</Text>}</Text> */}
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: '2%' }}>
                                                <View>
                                                    <Text style={{ color: 'white', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium', marginTop: '0%' }}>Net wt: {item.net_weight} Kg</Text>
                                                </View>
                                                <View>
                                                    <Text style={{ color: 'white', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium', marginTop: '0%' }}>Quantity: {item.qty}</Text>
                                                </View>
                                            </View>

                                        </View>

                                    </View>

                                </Pressable>

                            </View>

                        }
                        keyExtractor={(item) => item.id.toString()}

                    />
                )}
                <LinearGradient colors={Colors.linearColors}
                    start={Colors.start}end={Colors.end}
                    locations={Colors.location}
                    style={{ backgroundColor: Colors.primary, borderColor: Colors.primary, borderRadius: 50, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', paddingVertical: '4%', marginTop: '3%' }}
                >
                    <TouchableOpacity style={styles.button} onPress={AlertForOrder} activeOpacity={0.8}>
                        <Text style={styles.btnText}>Place Return</Text>
                    </TouchableOpacity>
                </LinearGradient>

            </View>


        </LinearGradient>
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
                    <TouchableOpacity onPress={openModal} >
                        <AntDesign name='infocirlceo' size={18} color={Colors.primary} />
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
        </View>
    )
}

export default ReturnsCart

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
        padding: 10,
    },
    modalInnerContent: {
        marginTop: 10, // Add a margin to separate the icon from the modal content
    },
    ModalText1: {
        color: '#000000',
        textAlign: 'center',
        fontSize: 18,
        fontFamily: 'AvenirNextCyr-Medium',
        paddingBottom: 3,

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
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
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

})