import { StyleSheet, Text, View, Image, FlatList, Keyboard, TouchableOpacity, ToastAndroid, TextInput, Modal, Pressable } from 'react-native'
import React, { useState, useEffect } from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign';
import Colors from '../../constants/Colors';
import { cameraPermission } from '../../utils/Helper';
import globalStyles from '../../styles/globalStyles';
const AdminOrderCart = ({ navigation, route }) => {

    const { dealerInfo } = route.params;
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

    const [modalVisible, setModalVisible] = useState(false);
    const handlePress = () => {
        setFilteredData(masterData);
        setModalVisible(true);
    };
    const handleClose = () => {
        setModalVisible(false);
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

    const addProduct = (item) => {
        console.log("item ", item);
        let tempData = cartData;
        console.log("cart data", tempData)
        let productExist = false
        if (tempData.length > 0) {
            cartData.map((itm) => {
                if (itm.id == item.id) {
                    console.log("product already exist in the cart")
                    productExist = true;
                    //inscreasing  quantity of the product
                    ++itm.qty;
                }
            })
            //product not present adding item in cart
            if (!productExist) {
                tempData.push({ ...item, qty: 1 });
            }
            setCartData(tempData);
            ToastAndroid.show(
                'Items Added Successfully to your cart',
                ToastAndroid.SHORT
            );

        }
        else {
            //cart is empty adding product
            console.log("cart is  empty")
            tempData.push({ ...item, qty: 1 });
            setCartData(tempData);
        }
        calOrderStat(tempData);

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

    //     fetch("https://dev.ordo.primesophic.com/set_return_order.php", requestOptions)
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

        var raw = JSON.stringify({
            "__module_code__": "PO_20",
            "__query__": "",
            "__orderby__": "",
            "__offset__": 0,
            "__select _fields__": [
                "id",
                "name"
            ],
            "__max_result__": 500,
            "__delete__": 0
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("https://dev.ordo.primesophic.com/get_data_s.php", requestOptions)
            .then(response => response.json())
            .then(async result => {
                //console.log('all product data fetched');

                tempArray = await result?.entry_list.map(object => {
                    console.log("og values", object.name_value_list)
                    return {
                        'itemid': object.name_value_list.part_number.value,
                        'description': object.name_value_list.name.value,
                        'ldescription': object.name_value_list.description.value,
                        'price': object.name_value_list.price.value,
                        'qty': 0, 'upc': object.name_value_list.upc_c.value,
                        'category': object.name_value_list.category.value,
                        'subcategory': object.name_value_list.subcategory_c.value,
                        'unitofmeasure': object.name_value_list.unitofmeasure_c.value,
                        'manufacturer': object.name_value_list.manufacturer_c.value,
                        'class': object.name_value_list.class_c.value,
                        'pack': object.name_value_list.pack_c.value,
                        'size': object.name_value_list.size_c.value,
                        "tax": object.name_value_list.tax.value,
                        "hsn": object.name_value_list.hsn.value,
                        'weight': object.name_value_list.weight_c.value,
                        'extrainfo1': object.name_value_list.extrainfo1_c.value,
                        'extrainfo2': object.name_value_list.extrainfo2_c.value,
                        'extrainfo3': object.name_value_list.extrainfo3_c.value,
                        'extrainfo4': object.name_value_list.extrainfo4_c.value,
                        'extrainfo5': object.name_value_list.extrainfo5_c.value,
                        'imgsrc': object.name_value_list.product_image.value,
                        'manufactured_date': object.name_value_list.manufactured_date_c.value,
                        "stock": object.name_value_list.stock_c.value,
                        "id": object.name_value_list.id.value,
                        "noofdays": object.name_value_list.no_of_days.value,
                    }


                });
                console.log("product data", tempArray);
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

    const clearCartData = () => {
        setCartData([]);
        calOrderStat([])
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
            navigation.navigate('AdminOrderReview', { productsArray: productArray, dealerInfo: dealerInfo, cartData: cartData,total:totalAmt })
        }
        else {
            alert('Sorry, no items to order')
        }

    }


    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View>
                    <TouchableOpacity onPress={() => navigation.goBack()} >
                        <AntDesign name='arrowleft' size={25} color={Colors.black} />
                    </TouchableOpacity>
                </View>
                <View>
                    <Text style={{ fontSize: 20, color: Colors.primary, fontFamily: 'AvenirNextCyr-Medium', marginVertical: 5 }}>My Cart</Text>
                </View>
                <View />
                {/* <TouchableOpacity style={styles.saveButtonView} >
                    <Text style={styles.sendButton}>Return</Text>
                </TouchableOpacity> */}
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                <TouchableOpacity
                    style={{ backgroundColor: 'white', paddingVertical: 5, paddingHorizontal: 20, borderRadius: 5, elevation: 5,...globalStyles.border }}
                    onPress={orderItems}
                >
                    <Text style={{ color: 'green', fontFamily: 'AvenirNextCyr-Thin' }}>SEND</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{ backgroundColor: 'white', paddingVertical: 5, paddingHorizontal: 20, marginLeft: 10, borderRadius: 5, elevation: 5, ...globalStyles.border, }}
                    onPress={clearCartData}
                >

                    <Text style={{ color: 'red', fontFamily: 'AvenirNextCyr-Thin' }}>DELETE</Text>
                </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', marginTop: 10 }}>
                <TouchableOpacity 
                    //onPress={checkPermission}
                    >
                    <Image style={{ height: 50, width: 50, marginRight: 5 }} source={require('../../assets/images/scannerImage.jpeg')} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalSearchContainer} onPress={handlePress}>
                    <TextInput
                        style={styles.input}
                        value={search}
                        placeholder="Search product"
                        placeholderTextColor="gray"
                        onChangeText={(val) => searchProduct(val)}
                        editable={false}
                    />
                    <View style={styles.searchButton}>
                        <AntDesign name="search1" size={20} color="black" />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{ height: 45, marginTop: 2, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', borderRadius: 8, paddingHorizontal: 10, elevation: 5, flex: 0.2, marginLeft: 5, ...globalStyles.border, }}
                    onPress={() => {
                        setSearch('');
                        setFilteredData(masterData)
                        Keyboard.dismiss();
                    }
                    }
                >
                    <Text style={{ color: 'blue', fontFamily: 'AvenirNextCyr-Thin', fontSize: 14 }}>+ Add</Text>

                </TouchableOpacity>
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

                        <View style={{ height: 350, backgroundColor: 'white', paddingHorizontal: 5, borderRadius: 8 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <View>

                                </View>
                                <Text style={{ alignSelf: 'center', fontSize: 20, color: 'black', fontFamily: 'Poppins-Rehular', marginVertical: 10 }}>Search Items</Text>
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
                                    style={{ height: 45, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', borderRadius: 8, paddingHorizontal: 16, elevation: 5, flex: 0.2, marginLeft: 10, ...globalStyles.border, }}
                                    onPress={() => {
                                        setSearch('');
                                        setFilteredData(masterData)
                                        Keyboard.dismiss();
                                    }
                                    }
                                >
                                    <Text style={{ color: 'blue', fontFamily: 'AvenirNextCyr-Thin', fontSize: 14 }}>Clear</Text>

                                </TouchableOpacity>
                            </View>

                            <FlatList
                                showsVerticalScrollIndicator={false}
                                data={filteredData}
                                keyboardShouldPersistTaps='handled'
                                renderItem={({ item }) =>
                                    <Pressable style={styles.elementsView} onPress={() => {
                                        setModalVisible(false);
                                        navigation.navigate('ProductDetails', { item: item })
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
                                                paddingLeft: 10,
                                                marginLeft: 10,
                                                borderStyle: 'dotted',
                                                borderColor: 'grey',
                                            }}>
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                    <Text style={{ color: 'grey', fontSize: 12, fontFamily: 'AvenirNextCyr-Thin', borderBottomColor: 'grey', borderBottomWidth: 0.5, }}>Net wt: {item.weight}</Text>
                                                    <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}>INR {Number(item.price)}</Text>
                                                </View>
                                                <Text style={{ color: Colors.primary, fontSize: 12, fontFamily: 'AvenirNextCyr-Medium', marginTop: 5, }}>{item.description}</Text>
                                                <Text style={{ color: 'green', fontSize: 12, fontFamily: 'AvenirNextCyr-Thin' }}>{Number(item.stock) > 0 ? `Current Stock - ${item.stock}` : <Text style={{ color: 'red', fontSize: 12, fontFamily: 'AvenirNextCyr-Thin' }} >Out of stock</Text>}</Text>
                                                <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Thin' }}>{item.noofdays} days older</Text>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Text style={{ fontSize: 12, color: 'black', fontFamily: 'AvenirNextCyr-Thin', paddingLeft: 16 }}>{item.itemid}</Text>
                                            <TouchableOpacity
                                                style={{ justifyContent: 'center', alignItems: 'center', padding: 10, paddingHorizontal: 16, borderRadius: 5, backgroundColor: '#fff', elevation: 5, ...globalStyles.border, }}
                                                onPress={() => addProduct(item)}
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
            </View>

            <View style={{ marginLeft: 10 }}>
                <Text style={styles.textColor}>OrderTotals:</Text>
            </View>
            <View style={{ justifyContent: 'space-between', flexDirection: 'row', marginHorizontal: 10 }}>
                <Text style={styles.textColor}>Items: {cartData.length}</Text>
                <Text style={styles.textColor}>Qty: {totalQty}</Text>
                <Text style={styles.textColor}>Price: INR {totalAmt}</Text>
            </View>
            <FlatList
                showsVerticalScrollIndicator={false}
                data={cartData}
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
                                    <Text style={{ color: 'grey', fontSize: 14, fontFamily: 'AvenirNextCyr-Thin', borderBottomColor: 'grey', borderBottomWidth: 0.5 }}>Net wt: {item?.weight}</Text>
                                    <TouchableOpacity onPress={() => deleteProduct(index)}>
                                        <Image source={require('../../assets/images/orderClose.png')} style={styles.orderCloseView} />
                                    </TouchableOpacity>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                                    <Text numberOfLines={1} style={{ color: 'black', fontSize: 14, fontFamily: 'AvenirNextCyr-Thin' }}>{item?.description}</Text>
                                    <Text style={{ color: 'black', fontSize: 14, fontFamily: 'AvenirNextCyr-Medium' }}>INR {Number(item?.price)}</Text>

                                </View>

                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5, paddingLeft: 5 }}>
                            <Text style={{ fontSize: 14, color: 'black', fontFamily: 'AvenirNextCyr-Thin', }}>{item?.hsn}</Text>
                            <View style={{ flexDirection: 'row', }}>
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

                            </View>
                        </View>
                    </Pressable>


                }
                keyExtractor={(item) => item.id.toString()}

            />
        </View >
    )
}

export default AdminOrderCart

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
        ...globalStyles.border,
        padding: 16,
        
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
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'lightgray',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
        flex: 0.8
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
})