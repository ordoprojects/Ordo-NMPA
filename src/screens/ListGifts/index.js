import { StyleSheet, Text, View, Image, FlatList, ActivityIndicator, TouchableOpacity, Keyboard, TextInput, Modal, Pressable } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign';
import Colors from '../../constants/Colors';
import { useFocusEffect } from "@react-navigation/native";
import { getAcessToken } from '../../utils/Helper';
import { AuthContext } from '../../Context/AuthContext';
import globalStyles from '../../styles/globalStyles';

const ListGifts = ({ navigation, route }) => {
    const screen = route.params?.screen;
    const action = route.params?.action;
    const { token } = useContext(AuthContext);
    const [masterData, setMasterData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState('');
    useEffect(() => {
        loadAllProduct()

    }, [])

    console.log("gfjg", token)
    // useFocusEffect(
    //     React.useCallback(() => {
    //         loadAllProduct()


    //     }, [])
    // );


    const [cartData, setCartData] = useState([]);

    const loadAllProduct = async () => {
        setLoading(true);
        console.log("loading all product");
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "__id__": token
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("https://dev.ordo.primesophic.com/get_merchandiser_products.php", requestOptions)
            .then(response => response.json())
            .then(async result => {
                //console.log('all product data fetched');
                tempArray = await result?.map(object => {
                    console.log("og values", object.name_value_list)
                    return {
                        'itemid': object.part_number.value,
                        'description': object.name.value,
                        'ldescription': object.description.value,
                        "date_entered": object.date_entered.value,
                        "date_modified": object.date_modified.value,
                        "modified_user_id": object.modified_user_id.value,
                        "created_by": object.created_by.value,
                        "deleted": object.deleted.value,
                        "assigned_user_id": object.assigned_user_id.value,
                        "maincode": object.maincode.value,
                        "type": object.type.value,
                        "cost": object.cost.value,
                        "cost_usdollar": object.cost_usdollar.value,
                        "currency_id": object.currency_id.value,
                        'price': object.price.value,
                        'price_usdollar': object.price_usdollar.value,
                        "url": object.url.value,
                        "contact_id": object.contact_id.value,
                        'aos_product_category_id': object.aos_product_category_id,
                        'category': object.category.value,
                        'retail_price': object.retail_price.value,
                        'no_of_days_remaining': object.no_of_days_remaining.value,
                        'net_weight': object.net_weight.value,
                        'manufacturer_c': object.manufacturer_c.value,
                        'alternative_unit': object.alternative_unit.value,
                        "expired": object.expired.value,
                        "tax": object.tax.value,
                        "hsn": object.hsn.value,
                        "expiry_date": object.expiry_date.value,
                        "po_vendor_id_c": object.po_vendor_id_c.value,
                        "is_returnable": object.is_returnable.value,
                        "batch": object.batch.value,
                        "max_refill_days": object.max_refill_days.value,
                        "po_warehouse_id_c": object.po_warehouse_id_c.value,
                        'weight': object.weight_c.value,
                        'material_type': object.material_type.value,
                        'gross_weight': object.gross_weight.value,
                        'weight_unit': object.weight_unit.value,
                        'volume': object.volume.value,
                        'volume_unit': object.volume_unit.value,
                        'imgsrc': object.product_image.value,
                        "stock": object.stock_c.value,
                        "id": object.id.value,
                        "noofdays": object.no_of_days.value,
                        "unit_of_dimention": object.unit_of_dimention.value,
                        "length": object.length.value,
                        "width": object.width.value,
                        "height": object.height.value,
                        "number_of_pieces": object.number_of_pieces.value,
                        "ean_category": object.ean_category.value,
                        "capacity_usage": object.capacity_usage.value,
                        "denominator": object.denominator.value,
                        "temp_condition": object.temp_condition.value,
                        "initiated_by": object.initiated_by.value,
                        "brand_name": object.brand_name.value,
                    }


                });
                console.log("product data", tempArray);
                setMasterData(tempArray)
                setFilteredData(tempArray);
                setLoading(false);
                console.log("afsdfkshkjsdhguk", brand_name)


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
                    const itemData = item?.description && item?.itemid
                        ? item?.description.toUpperCase() + item?.itemid.toUpperCase()
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



    return (
        <View style={styles.container}>

            <View style={{ ...styles.headercontainer }}>

                <TouchableOpacity onPress={() => navigation.goBack()} >
                    <AntDesign name='arrowleft' size={25} color={Colors.black} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Gifts</Text>

                {!action && <TouchableOpacity onPress={() => navigation.navigate('MerchAddProduct')} >
                    <AntDesign name='plus' size={25} color={Colors.primary} />
                    <Text style={{ fontSize: 10, color: Colors.primary, fontFamily: 'AvenirNextCyr-Thin' }}>Add</Text>

                </TouchableOpacity>}
                {action && screen == 'MIListDetail' && <TouchableOpacity style={{ marginRight: 10 }} onPress={() => navigation.navigate('SKUHistoryList')} >
                    <Image source={require('../../assets/images/returns.png')} style={{ height: 20, width: 20, tintColor: Colors.primary, resizeMode: 'contain' }} />
                    <Text style={{ fontSize: 10, color: Colors.primary, fontFamily: 'AvenirNextCyr-Thin', marginLeft: -5 }}>History</Text>

                </TouchableOpacity>}
                {action && screen == 'CompetitorIntelligence' && <View />}


            </View>
            {/* <Text style={{ alignSelf: 'center', fontSize: 20, color: Colors.primary, fontFamily: 'AvenirNextCyr-Medium', marginVertical: 5 }}>SKU History</Text> */}
            {/* <View style={{

                height: 40

            }} /> */}

            <ActivityIndicator
                animating={loading}
                color={Colors.primary}
                size="large"
                style={styles.activityIndicator}

            />


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
                    style={{ height: 40, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', borderRadius: 8, paddingHorizontal: 16, elevation: 5, flex: 0.2, marginLeft: 10, ...globalStyles.border, }}
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
            {action && <Text style={{ color: '#000', fontFamily: 'AvenirNextCyr-Thin', fontSize: 13 }}>Choose your product</Text>}
            <FlatList
                showsVerticalScrollIndicator={false}
                data={filteredData}
                keyboardShouldPersistTaps='handled'
                renderItem={({ item }) =>

                    <Pressable style={styles.elementsView}
                        // onPress={() => navigation.navigate('ProductDetails', { item: item })}
                        onPress={() => action ? navigation.navigate(screen, { item: item }) : navigation.navigate('ProductDetails', { item: item })}
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
                                <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Thin' }}>{item.brand_name} </Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={{ color: 'grey', fontSize: 12, fontFamily: 'AvenirNextCyr-Thin', borderBottomColor: 'grey', borderBottomWidth: 0.5, }}>Net wt: {item.net_weight} Kg</Text>
                                    {/* <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}>INR {Number(item.price)}</Text> */}

                                </View>

                            </View>

                        </View>
                    </Pressable>


                }
                keyExtractor={(item) => item.id.toString()}
            />

        </View>



    )
}

export default ListGifts

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        paddingBottom: 0,
        backgroundColor: 'white'
    },
    headercontainer: {
        paddingVertical: 5,
        //backgroundColor:'red',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'


    },
    headerTitle: {
        fontSize: 18,
        fontFamily: 'AvenirNextCyr-Medium',
        color: Colors.primary,
        //marginLeft: 10,
        //marginTop: 3,

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
        marginRight: 10,
        height: 40
    },
    modalTitle: {
        fontSize: 16,
        color: 'black',
        fontFamily: 'AvenirNextCyr-Medium'
    },
})