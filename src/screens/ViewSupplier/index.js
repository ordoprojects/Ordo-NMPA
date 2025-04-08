import React, { useState, useEffect, useRef, useContext, PureComponent } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Dimensions, ScrollView, FlatList, Pressable, Alert, TouchableOpacity ,ActivityIndicator} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DatePicker from 'react-native-date-picker'
import { Image } from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import Colors from '../../constants/Colors';
import AntDesign from 'react-native-vector-icons/AntDesign';
// import { RadioButton } from 'react-native-paper';
import moment from 'moment';
import { format, lastDayOfMonth, getDay, addDays } from 'date-fns';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../../Context/AuthContext';
import SwitchSelector from 'react-native-switch-selector';
import { Searchbar, Checkbox, RadioButton, Snackbar } from 'react-native-paper';
import { FAB } from 'react-native-paper';
import globalStyles from '../../styles/globalStyles';
import { AnimatedFAB } from 'react-native-paper';


const ViewSupplier = ({ navigation, route, visible,
    extended,
    label,
    animateFrom, }) => {
        const Screen = route.params?.screen;

    const { token, userData } = useContext(AuthContext);

    const [searchQuery, setSearchQuery] = React.useState('');
    const [masterData, setMasterData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [checked, setChecked] = React.useState(false);
    const [selectedCustomer, setSelectedCustomers] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [search, setSearch] = useState('');

    const [selectedItems, setSelectedItems] = useState([]);
    const [isSelectMode, setIsSelectMode] = useState(false);
    const [offset, setOffset] = useState(0);
    const [limit, setLimit] = useState(10); 
    const [isLoading, setIsLoading] = useState(false); 
    const [totalCount, setTotalCount] = useState(0);


    useEffect(() => {
        if (selectedItems.length === 0) {
            setIsSelectMode(false)
        }
    }, [selectedItems])



    const onItemLongPress = (item) => {
        if (!isSelectMode) {
            setIsSelectMode(true);
            //   setHeaderSelectMode();
            toggleItemSelection(item);
        }
    };



    const toggleItemSelection = (item) => {
        const isSelected = selectedItems.some((selectedItem) => selectedItem.id === item.id);

        if (isSelected) {
            // Item is selected, remove it from the selectedItems array
            const updatedSelection = selectedItems.filter((selectedItem) => selectedItem.id !== item.id);
            setSelectedItems(updatedSelection);
        } else {
            // Item is not selected, add it to the selectedItems array
            setSelectedItems([...selectedItems, item]);
        }
    };

    //   const setHeaderSelectMode = () => {
    //     navigation.setOptions({
    //       headerTitle: (
    //         <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    //           <Text style={styles.headerTitle}>Select Suppliers</Text>
    //           <View style={{ marginLeft: 'auto', flexDirection: 'row', alignItems: 'center' }}>
    //             <TouchableOpacity onPress={onClearSelection}>
    //               <AntDesign name="close" size={25} color="white" style={{ marginRight: 15 }} />
    //             </TouchableOpacity>
    //             <Text style={{ color: 'white' }}>{selectedItems.length}</Text>
    //             <TouchableOpacity onPress={onDeleteSelected}>
    //               <AntDesign name="delete" size={25} color="white" style={{ marginLeft: 15 }} />
    //             </TouchableOpacity>
    //           </View>
    //         </View>
    //       ),
    //     });
    //   };

    const onClearSelection = () => {
        setIsSelectMode(false);
        setSelectedItems([]);
    };

    const onDeleteSelected = () => {
        // Perform deletion logic for selected items
        // For example, you can call handleDelete for each selected item
        selectedItems.forEach((item) => handleDelete(item.id));
        onClearSelection();
    };

    const resetHeader = () => {
        navigation.setOptions({
            headerTitle: <Text style={styles.headerTitle}>Select Suppliers</Text>,
        });
    };


    const onScroll = ({ nativeEvent }) => {
        const currentScrollPosition =
            Math.floor(nativeEvent?.contentOffset?.y) ?? 0;

        setIsExtended(currentScrollPosition <= 0);
    };

    const [isExtended, setIsExtended] = useState(true);

    const [SnackBarVisible, setSnackBarVisible] = useState(false);
    const onToggleSnackBar = () => setSnackBarVisible(!SnackBarVisible);
    const onDismissSnackBar = () => setSnackBarVisible(false);



    const onChangeSearch = query => setSearchQuery(query);


    useEffect(() => {
        getSuppliers();
    }, [searchQuery]);

    const getSuppliers = async () => {
        setLoading(true);
        const myHeaders = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userData.token}`
        };

        try {
            const response = await fetch(`https://gsidev.ordosolution.com/api/suppliers/?search_name=${searchQuery}`, {
                method: 'GET',
                headers: myHeaders
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();

            setMasterData(result.results);
            setFilteredData(result.results);
        } catch (error) {
            console.error('Error in get suppliers', error);
        } finally {
            setLoading(false);
        }
    };

    
    const handleLoadMore = () => {
          setOffset(offset + limit);
      };

      const EmptyListMessage = () => {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 20 }}>
                <Text style={styles.emptyMessageStyle}>No Supplier found</Text>
            </View>
        );
    };



    const LoadingIndicator = () => {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 20 }}>
                <ActivityIndicator size="small" color={Colors.primary} />
            </View>
        );
    };

    const handleDelete = () => {
        Alert.alert(
            'Confirmation',
            'Are you sure you want to delete selected suppliers?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                    onPress: () => {
                        setLoading(false);
                    },
                },
                {
                    text: 'OK',
                    onPress: async () => {
                        setLoading(true);

                        const successfulDeletes = [];
                        const failedDeletes = [];

                        // Use Promise.all to perform parallel deletion requests
                        await Promise.all(
                            selectedItems.map(async (item) => {
                                const deleteUrl = `https://gsidev.ordosolution.com/api/suppliers/${item.id}/`;

                                try {
                                    const response = await fetch(deleteUrl, {
                                        method: 'DELETE',
                                        headers: {
                                            'Content-Type': 'application/json',
                                            Authorization: `Bearer ${userData.token}`,
                                        },
                                        redirect: 'follow',
                                    });

                                    if (response.status === 204) {
                                        // Successful deletion
                                        successfulDeletes.push(item.id);
                                    } else {
                                        throw new Error(`HTTP error! Status: ${response.status}`);
                                    }
                                } catch (error) {
                                    // Error in deletion
                                    console.error('Error in delete supplier', error);
                                    failedDeletes.push(item.id);
                                }
                            })
                        );

                        setLoading(false);

                        if (failedDeletes.length > 0) {
                            // Some deletions failed
                            Alert.alert(
                                'Error',
                                'One or more deletions failed. Please try again.',
                                [{ text: 'OK', onPress: () => { onClearSelection(); } }]
                            );
                        } else {
                            // All deletions were successful
                            onToggleSnackBar();
                            getSuppliers();
                            onClearSelection();
                        }
                    },
                },
            ],
            { cancelable: false }
        );

    };



    const handleEdit = () => {
        if (selectedItems.length === 1) {
            selectedItems.forEach((item) => {
                navigation.navigate('AddSupplier', { screen: 'edit', supplierId: item.id })
            })
        }
    }


    const renderItem = ({ item, index }) => {

        const isSelected = selectedItems.some((selectedItem) => selectedItem.id === item.id);
        // console.log("jfeh",item)
        return (
            <TouchableOpacity

                style={{
                    ...styles.elementsView,
                    backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.3)' : 'white',
                }}

                activeOpacity={0.8}
                onPress={() => {
                    // Handle regular item press (navigate to details, etc.)
                    navigation.navigate(Screen, { item: item });
                }}
            >
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <View
                        style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end' }}
                    >
                        <Image
                            // source={require('../../assets/images/account.png')}
                            // source={{ uri: filteredData.account_profile_pic }}
                            source={{ uri: item?.supplier_image }}
                            style={{ ...styles.avatar }}
                        />
                        {isSelected && <View style={{ position: 'absolute', right: 0 }}>
                            <AntDesign name='checkcircle' size={23} color='white' />
                        </View>}
                    </View>
                    <View style={{
                        flex: 1,
                        // marginLeft: 8,
                        // borderLeftWidth: 1.5,
                        // paddingLeft: 20,
                        marginLeft: 20,
                    }}>
                        {/* <View style={{ flexDirection: 'row' }}> */}
                        <Text style={{ color: Colors.primary, fontSize: 14, fontFamily: 'AvenirNextCyr-Medium', borderBottomColor: 'grey' }}>{item.full_name}</Text>
                        {/* </View> */}
                        <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}>{item.phone}</Text>
                        <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}>{item.address}</Text>

                        {/* <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}>{item?.street} {item?.city} {item?.shipping_address_state}</Text> */}
                        {/* <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}>{item?.country} - {item?.postal_code}</Text> */}
                    </View>
                </View>
                {/* <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: '2%', gap: 20 }}>


                    <TouchableOpacity onPress={() => { navigation.navigate('AddSupplier', { screen: 'edit', supplierId: item.id }) }}>
                        <AntDesign name='edit' size={25} color='white' />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => { handleDelete(item.id) }}>
                        <AntDesign name='delete' size={25} color='white' />
                    </TouchableOpacity>

                </View> */}
                {/* <Text style={{ fontSize: 12, color: 'black', fontFamily: 'AvenirNextCyr-Medium', marginTop: 5, paddingLeft: 16 }}>{item?.storeid_c}</Text> */}

            </TouchableOpacity>
        )

    }

    const searchProduct = (text) => {
        // Check if searched text is not blank
        if (text) {
            // Inserted text is not blank
            // Filter the masterDataSource
            // Update FilteredDataSource
            const newData = masterData.filter(
                function (item) {
                    const itemData = item?.name && item?.id
                        ? item?.name.toUpperCase() + item?.id.toUpperCase()
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

    // console.log("filtered data",filteredData)

    const searchCustomer = (text) => {
        if (text) {
            // Inserted text is not blank
            // Filter the masterDataSource
            // Update FilteredDataSource
            const newData = masterData.filter(function (item) {
                const itemData = item.full_name
                    ? item.full_name.toUpperCase()
                    : "".toUpperCase();
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
            });
            setFilteredData(newData);
            setSearchQuery(text);
        } else {
            // Inserted text is blank
            // Update FilteredDataSource with masterDataSource
            setFilteredData(masterData);
            setSearchQuery(text);
        }
    }




    return (
        <LinearGradient
            colors={Colors.linearColors}
            start={Colors.start} end={Colors.end}
            locations={Colors.location}
            style={{ flex: 1, }}
        >

            {isSelectMode ? (
                <View style={{ ...styles.headercontainer }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity onPress={onClearSelection} style={{ paddingLeft: 10 }}>
                            <AntDesign name="close" size={25} color="white" style={{ marginRight: 15 }} />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>{selectedItems.length}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
                        {selectedItems.length == 1 && <TouchableOpacity onPress={handleEdit}>
                            <AntDesign name='edit' size={25} color='white' />
                        </TouchableOpacity>}
                        <TouchableOpacity onPress={handleDelete}>
                            <AntDesign name='delete' size={25} color='white' />
                        </TouchableOpacity>
                    </View>
                </View>
            ) : (<View style={{ ...styles.headercontainer }}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingLeft: 10 }}>
                    <Image source={require('../../assets/images/Refund_back.png')} style={{ height: 30, width: 30 }} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Select Suppliers</Text>
                <Text>   </Text>
            </View>)
            }
            <Searchbar
                style={{
                    marginHorizontal: "4%",
                    marginVertical: "3%",
                    borderRadius: 8,
                    backgroundColor: "white",
                }}
                placeholder="Search Suppliers"
                onChangeText={(val) => { searchCustomer(val) }}
                value={searchQuery}
            />

            <View style={{ flex: 1, borderTopLeftRadius: 20, borderTopRightRadius: 20, backgroundColor: '#F1F1F1' }}>
                <View style={styles.customerMainContainer}>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={filteredData}
                    keyboardShouldPersistTaps='handled'
                    ListEmptyComponent={EmptyListMessage}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    ListFooterComponent={loading ? <ActivityIndicator size='large' color={Colors.primary} /> : null}
                />


                </View>
            </View>

            {/* <View style={{  justifyContent: 'flex-end' }}>
            <TouchableOpacity style={styles.button}
                //  onPress={checkActivePlanExist} 
                onPress={createPlanPressed}
                activeOpacity={0.8}>
                <Text style={styles.btnText}>Create Plan</Text>
            </TouchableOpacity>
        </View> */}
            {/* <AnimatedFAB
                label={'Add Supplier '}
                icon={name = "plus"}
                color={"#50001D"}
                style={styles.fabStyle}
                // borderWidth={50}
                // borderRadius={50}

                fontFamily={'AvenirNextCyr-Thin'}
                extended={isExtended}

                // onPress={() => console.log('Pressed')}
                visible={visible}
                animateFrom={'right'}
                iconMode={'static'}
                onPress={() => { navigation.navigate('AddSupplier', { screen: 'add' }) }}
            /> */}

            <Snackbar
                visible={SnackBarVisible}
                onDismiss={onDismissSnackBar}
                style={{ backgroundColor: 'white' }}
                duration={3000}
            >
                <Text style={{ fontFamily: 'AvenirNextCyr-Medium' }}>
                    Supplier Deleted successfully !
                </Text>
            </Snackbar>


        </LinearGradient>

    );
};

const styles = StyleSheet.create({



    headerTitle: {
        fontSize: 18,
        fontFamily: 'AvenirNextCyr-Medium',
        color: 'white',
        // marginLeft: 10,
        marginTop: 3
    },

    customerMainContainer: {
        margin: "4%",
        flex: 1,
    },

    elementsView: {
        paddingVertical: 15,
        // backgroundColor: "rgba(158, 78, 126, 0.61)",
        backgroundColor: "white",
        marginVertical: "2%",
        ...globalStyles.border,
        borderRadius: 20,
        paddingHorizontal: "1%",
    },
    imageView: {
        width: 70,
        height: 70,

    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: 'gray',
    },

    button: {
        paddingVertical: '3%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        backgroundColor: Colors.primary,
        margin: '5%',
        borderRadius: 30
    },
    btnText: {
        fontFamily: 'AvenirNextCyr-Medium',
        color: '#fff',
        fontSize: 16
    },
    fab: {
        position: 'absolute',
        margin: 20,
        right: 0,
        bottom: 0,
        backgroundColor: Colors.primary,
        fontFamily: 'AvenirNextCyr-Medium',
    },
    headercontainer: {
        paddingHorizontal: 10,
        paddingVertical: 10,
        //backgroundColor:'red',
        flexDirection: 'row',
        alignItems: 'center',
        //backgroundColor:'red'
        justifyContent: 'space-between',
        marginTop: 5,

    },
    fabStyle: {
        position: 'absolute',
        margin: 20,
        right: '0%',
        bottom: '1%',
        backgroundColor: Colors.primary,



        // fontFamily: 'AvenirNextCyr-Medium',
    },


});

export default ViewSupplier;