import { StyleSheet, Text, View, Image, FlatList, ActivityIndicator, TouchableOpacity, Keyboard, TextInput, Modal, Pressable, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign';
import Colors from '../../constants/Colors';
import { useFocusEffect } from "@react-navigation/native";

const ReturnDetails = ({ navigation, route }) => {
    const { id } = route.params;
    const [masterData, setMasterData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState('');
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    useFocusEffect(
        React.useCallback(() => {
            getReturnDetails()


        }, [])
    );
    
    const getReturnDetails = async () => {
        setLoading(true);
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "__id__": id
        })

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("https://dev.ordo.primesophic.com/get_return_detail.php", requestOptions)
            .then(response => response.json())
            .then(async res => {
                //console.log('all product data fetched');
                console.log("product details", res);
                let tempArray = res?.return_array.return_products;
                if (Array.isArray(tempArray) && tempArray.length > 0) {
                    setMasterData(tempArray)
                    setFilteredData(tempArray);
                    setLoading(false);
                }



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



    return (
        <View style={styles.container}>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <AntDesign name='arrowleft' size={25} color={Colors.black} />
                </TouchableOpacity>
                <Text style={{ marginLeft: 10, fontSize: 20, color: Colors.black, fontFamily: 'AvenirNextCyr-Medium', marginVertical: 5 }}>Return Details</Text>

            </View>
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
                    style={{ height: 45, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', borderRadius: 8, paddingHorizontal: 16, elevation: 5, flex: 0.2 }}
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
                        setSelectedItem(item)
                        setModalVisible(true)
                    }
                    }
                    >
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <Image

                                source={{uri: item.product_image.startsWith("http")
          ? item.product_image
          : `https://gsidev.ordosolution.com${item.product_image}`,
      }}
                                style={{
                                    ...styles.imageView,
                                }}
                            />
                            <View style={{
                                flex: 1,
                                //borderLeftWidth: 1.5,
                                //paddingLeft: 10,
                                marginLeft: 5,
                                //borderStyle: 'dotted',
                                //borderColor: 'grey',
                            }}>
                                {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={{ color: 'grey', fontSize: 12, fontFamily: 'AvenirNextCyr-Thin', borderBottomColor: 'grey', borderBottomWidth: 0.5, }}>Net wt: {item.weight}</Text>
                                    <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}>INR {Number(item.price)}</Text>

                                </View> */}
                                <Text style={{ color: Colors.primary, fontSize: 14, fontFamily: 'AvenirNextCyr-Medium' }}>{item.name}</Text>
                                <Text style={{ color: item.status == 'Approved' ? 'green' : item.status == 'Pending' ? 'orange' : 'red', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}>{item.status}</Text>

                                {/* <Text style={{ color: 'green', fontSize: 12, fontFamily: 'AvenirNextCyr-Thin' }}>{Number(item.stock) > 0 ? `Current Stock - ${item.stock}` : <Text style={{ color: 'red', fontSize: 12, fontFamily: 'AvenirNextCyr-Thin' }} >Out of stock</Text>}</Text> */}
                                {/* <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Thin' }}>{item.noofdays} days older</Text> */}


                            </View>







                        </View>
                        {/* <Text style={{ fontSize: 12, color: 'black', fontFamily: 'AvenirNextCyr-Thin', paddingLeft: 16 }}>{item.itemid}</Text> */}
                    </Pressable>


                }
                keyExtractor={(item) => item.id.toString()}
            />


            <Modal visible={isModalVisible} transparent>


                {/* Modal content */}
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'grey', paddingHorizontal: 10 }}>
                    <View style={{ backgroundColor: 'white', padding: 20, width: '90%', marginHorizontal: 10, borderRadius: 10, elevation: 5 }}>
                        {/* new */}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                            <Text style={styles.modalTitle}>Product Details</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <AntDesign name='close' size={20} color={`black`} />
                            </TouchableOpacity>

                        </View>
                        <View>
                            <Text style={styles.label}>Product Image</Text>
                            <Image
                                style={{ height: 100, width: 100, resizeMode: 'contain' }}
                                source={{ uri: selectedItem?.uploaded_product_image }}
                            />
                            <Text style={{ ...styles.label, marginTop: 5 }}>Quantity</Text>
                            <Text style={{ fontSize: 12, color: Colors.black, fontFamily: 'AvenirNextCyr-Thin' }}>{selectedItem?.quantity}</Text>
                            <Text style={{ ...styles.label, marginTop: 5 }}>Remarks</Text>
                            <ScrollView style={{ maxHeight: 100 }}>
                                <Text style={{ fontSize: 12, color: Colors.black, fontFamily: 'AvenirNextCyr-Thin' }}>
                                    {selectedItem?.description}
                                </Text>
                            </ScrollView>


                        </View>

                    </View>

                </View >

            </Modal>

        </View>




    )
}

export default ReturnDetails

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 24,
        paddingBottom: 0,
        backgroundColor: 'white'
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
        marginBottom: 10,
        borderRadius: 8,
        elevation: 5,
        padding: 10
    },
    imageView: {
        width: 80,
        height: 60,
        resizeMode: 'contain'

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
        marginRight: 10
    },
    modalTitle: {
        fontSize: 16,
        color: Colors.primary,
        fontFamily: 'AvenirNextCyr-Medium'
    },
    label: {
        fontSize: 15,
        color: 'black',
        fontFamily: 'AvenirNextCyr-Medium'
    }
})