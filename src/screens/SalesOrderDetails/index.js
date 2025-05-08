import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../Context/AuthContext';
import { View, Dimensions, Text, ScrollView, StyleSheet, TouchableOpacity, Modal, TextInput, Alert, FlatList, Pressable, Linking,Button } from 'react-native'
import Colors from '../../constants/Colors';
import { useFocusEffect } from '@react-navigation/native';
import { Image } from 'react-native-animatable';
import globalStyles from '../../styles/globalStyles';//
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import ConvertDateTime from '../../utils/ConvertDateTime';
import LinearGradient from 'react-native-linear-gradient';
import { Checkbox } from "react-native-paper";
import { ProgressDialog } from 'react-native-simple-dialogs';
import Comments from '../../components/Comments';
import { WebView } from 'react-native-webview';
import RNFetchBlob from 'rn-fetch-blob';

const SalesOrderDetails = ({ navigation, route }) => {

    const orderDetail = route.params?.orderDetails;
    const [orderDetails, setOrderDetails] = useState(orderDetail);
    const {screen ,screen2} = route.params;
    const [products, setProducts] = useState([]);
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0); 
    const { userData } = useContext(AuthContext);
    const [visible, setVisible] = useState(false)
    const [loading, setLoading] = useState(false)
    const [selectedItems, setSelectedItems] = useState([]);
    const [rows, setRows] = useState([{ dropdownValue: null, textInputValue: '00.00' }]);
    const [isCommentsModalVisible, setIsCommentsModalVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const { width: windowWidth } = Dimensions.get('window');
    const [dimensionData, setDimensionData] = useState('');
    const [menuVisible1, setMenuVisible1] = useState(false);

    console.log('================ OrderDetail ====================');
    console.log(JSON.stringify(orderDetail ,null,2));
    console.log('=================================================');

    const addRow = () => {
      setRows([...rows, { dropdownValue: null, textInputValue: '' }]);
    };

    const downloadImage = async (imageUri) => {
        // Define the path where you want to save the file
        const { config, fs } = RNFetchBlob;
        const downloads = fs.dirs.DownloadDir;
        const path = `${downloads}/image_${Date.now()}.jpg`;
      
        // Start downloading the image
        config({
          fileCache: true,
          addAndroidDownloads: {
            useDownloadManager: true,
            notification: true,
            path: path,
            description: "Downloading image",
          },
        })
          .fetch("GET", imageUri)
          .then((res) => {
            console.log("The file is saved to:", res.path());
            Alert.alert('Completed',`Image downloaded successfully`);
          })
          .catch((error) => {
            console.error("Error downloading image:", error);
            Alert.alert(`Failed to download image due to: ${error}`);
          });
      };

    const OpenDimention = (data) => {
       console.log("🚀 ~ OpenDimention ~ data:", data)
       setDimensionData(data);
       setMenuVisible1(true)
    };
    
      const renderItems = ({ item }) => (
        <View style={styles.card11}>
           {orderDetails?.product_list[0]?.name === "BASE PLATE" ? <Text style={{color:Colors.primary ,fontFamily: "AvenirNextCyr-Bold",
           fontSize: 17}}>{item.height_inch} X {item.width_ft} X {item.thickness} </Text>  :
           <Text style={{color:Colors.primary ,fontFamily: "AvenirNextCyr-Bold",
           fontSize: 17}}>Dimensions: {item.width_ft}' {item.height_inch}"</Text> }
           <Text style={{color:Colors.black ,fontFamily: "AvenirNextCyr-Medium",
           fontSize: 15}}>Remaining Qty: {item.remaining_nos} NOS</Text>
           <Text style={{color:Colors.black ,fontFamily: "AvenirNextCyr-Medium",
           fontSize: 15}}>Loaded Qty: {item.loaded_qty} NOS</Text>
           {orderDetails?.product_list[0]?.name === "BASE PLATE" &&
           <Text style={{color:Colors.black ,fontFamily: "AvenirNextCyr-Medium",
           fontSize: 15}}>Loaded Weight: {item.base_loaded_weight} Kg</Text> }
        </View>
      );

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

    const toggleSelectedProduct = (item) => {
        const productId = item.id;
        const updatedProducts = products.map(product => {
            if (product.id === productId) {
                return { ...product, checked: !product.checked, stockError: false, returnQty: 1 };
            }
            return product;
        });
        setProducts(updatedProducts);

        const isSelected = selectedItems.some(selectedItem => selectedItem.id === productId);

        if (isSelected && !updatedProducts.find(product => product.id === productId)?.checked) {
            const updatedSelectedItems = selectedItems.filter(selectedItem => selectedItem.id !== productId);
            setSelectedItems(updatedSelectedItems);
        } else if (!isSelected && updatedProducts.find(product => product.id === productId)?.checked) {
            const selectedItem = updatedProducts.find(product => product.id === productId);
            setSelectedItems([...selectedItems, selectedItem]);
        }
    }

    const handleQuantityChange = (item, action) => {

        let orderedQty = parseInt(item.qty);
        let returnQty = parseInt(item.returnQty);

        console.log("ordered Qty", orderedQty);
        console.log("return qty", returnQty);

        if (isNaN(returnQty) || returnQty < 1) {
            const updatedProducts = products.map((product) =>
                product.id === item.id
                    ? { ...product, returnQty: 1, stockError: false }
                    : product
            );
            setProducts(updatedProducts);
        }

        if (action === "increment") {
            // Increment returnQty by 1
            const updatedProducts = products.map((product) =>
                product.id === item.id
                    ? { ...product, returnQty: returnQty + 1, stockError: false }
                    : product
            );
            setProducts(updatedProducts);
        } else if (action === "decrement" && returnQty > 0) {
            // Decrement returnQty by 1
            const updatedProducts = products.map((product) =>
                product.id === item.id
                    ? { ...product, returnQty: returnQty - 1, stockError: false }
                    : product
            );
            setProducts(updatedProducts);
        } else if (!isNaN(action) && action >= 0) {
            // Set returnQty to the entered value
            const updatedProducts = products.map((product) =>
                product.id === item.id
                    ? { ...product, returnQty: parseInt(action), stockError: false }
                    : product
            );
            setProducts(updatedProducts);
        }
    };


    const handleReturn = () => {

        if (selectedItems.length > 0) {

            const updatedProducts = products.map(product => {
                if (product.returnQty > product.qty) {
                    return {
                        ...product,
                        stockError: true,
                        errorMessage: "Return quantity cannot exceed ordered quantity"
                    };
                } else if (product.returnQty === 0 || isNaN(product.returnQty)) {
                    return {
                        ...product,
                        stockError: true,
                        errorMessage: "Return quantity must be greater than 0"
                    };
                } else {
                    // Reset stockError and errorMessage if returnQty is valid
                    return {
                        ...product,
                        stockError: false,
                        errorMessage: ""
                    };
                }
            });

            setProducts(updatedProducts);

            // Check if there are any products with stock errors
            const hasStockErrors = updatedProducts.some(product => product.stockError);

            // Navigate to the next page
            if (!hasStockErrors) {
                setVisible(false);
                const checkedItems = updatedProducts.filter(product => product.checked);
                navigation.navigate('OrderReturn', { checkedItems: checkedItems, orderId: orderDetails.id ,editDetails:orderDetails});
            }

        } else {
            // Show an alert or message indicating that no items are selected
            Alert.alert("Please select at least one item.");
        }
    };


    const renderItem = ({ item }) => {

        return (
            <TouchableOpacity style={styles.elementsView} onPress={() => { toggleSelectedProduct(item) }}>

                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <Checkbox.Android
                        color={Colors.primary}
                        status={item.checked ? 'checked' : 'unchecked'}
                    />
                    <View >
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

                    </View>
                    <View style={{
                        flex: 1,
                        paddingLeft: 15,
                        marginLeft: 10,
                    }}>

                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text style={{ color: Colors.primary, fontSize: 14, fontFamily: 'AvenirNextCyr-Medium', marginTop: 5, }}>{item.name}</Text>

                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}>Price :  </Text>
                                <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}>{parseFloat(item.price).toFixed(2)} </Text>
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: '3%', justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}>Qty :  </Text>
                                <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}>{item.qty}</Text>
                            </View>
                        </View>
                        
                        {item?.checked && <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', marginTop: '2%' }}>
                            <Text style={{ color: 'black', fontSize: 14, fontFamily: 'AvenirNextCyr-Medium' }}>Return Qty</Text>

                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: 10}} >
                                <TouchableOpacity
                                    onPress={() =>
                                        handleQuantityChange(item, "decrement")
                                    }
                                    style={{}}>
                                    <Entypo
                                        name="squared-minus"
                                        size={20}
                                        color="black"
                                    />
                                </TouchableOpacity>
                                <TextInput
                                    style={{
                                        fontSize: 14,
                                        borderWidth: 1,
                                        borderColor: "black",
                                        fontFamily: "AvenirNextCyr-Medium",
                                        width: 40,
                                        textAlign: "center",
                                        height: 26,
                                        justifyContent: "center",
                                        padding: 1,
                                        color: "black",
                                    }}
                                    value={item.returnQty > 0 ? item.returnQty.toString() : 1}
                                    onChangeText={(text) =>
                                        handleQuantityChange(item, text)
                                    }
                                    keyboardType="numeric"/>
                                <TouchableOpacity
                                    onPress={() => handleQuantityChange(item, "increment") }
                                    style={{ justifyContent: "center", alignItems: "center" }} >
                                    <Entypo
                                        name="squared-plus"
                                        size={20}
                                        color="black" />
                                </TouchableOpacity>
                            </View>
                        </View>}
                    </View>
                </View>
                {item.stockError && <View style={{ marginTop: '2%' }}>
                    <Text style={{ textAlign: 'center', fontFamily: 'AvenirNextCyr-Medium', color: 'red' }}>{item.errorMessage}</Text>
                </View>}
            </TouchableOpacity>
        )
    }

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


    return (
        <View style={{ flex: 1, padding: 24, backgroundColor: 'white' }}>

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    {/* <AntDesign name='arrowleft' size={25} color={Colors.primary} /> */}
                    <Image
                        source={require("../../assets/images/Refund_back.png")}
                        style={{ height: 30, width: 30, tintColor: Colors.primary }}
                    />
                </TouchableOpacity>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                {screen === "PO" ? (<Text style={{ fontSize: 20, color: Colors.primary, fontFamily: 'AvenirNextCyr-Medium' }} numberOfLines={2} >{orderDetails?.name} ({orderDetails.supplier_name}-{orderDetails.supplier_id})</Text>) : screen ==='invoice'?  (<Text style={{ fontSize: 20, color: Colors.primary, fontFamily: 'AvenirNextCyr-Medium' }}>{orderDetails?.invoice_name} ({orderDetails?.customer_name}-{orderDetails?.customer})</Text>):
                    (<Text style={{ fontSize: 20, color: Colors.primary, fontFamily: 'AvenirNextCyr-Medium' }} numberOfLines={2}>{orderDetails?.name} ({orderDetails.assignee_name}-{orderDetails.assigne_to})</Text>)
                }
                </View>

               {(orderDetails?.status === "Pending" || 
                 orderDetails?.status === "Missing Product" || 
                 orderDetails?.status === "Manager Reject") &&
                 screen !== 'Returns' &&
                 screen2 === 'order' &&
                 orderDetails?.is_production !== true && (
                   <TouchableOpacity 
                     style={{
                       backgroundColor: Colors.primary,
                       borderRadius: 5,
                       padding: 5,
                       elevation: 4,
                       height: 34,
                       width: 35
                     }}
                     onPress={() => 
                       navigation.navigate("EditSalesOrder", {
                         screen: 'edit',
                         routeId: orderDetails?.id,
                         cartData: orderDetail.product_list,
                         ORDERID: orderDetails?.id,
                         editDetails: orderDetails
                       })
                     }
                   >
                     <AntDesign name="edit" size={22} color="white" />
                   </TouchableOpacity>
                  )}
             </View>

            <View style={styles.card}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: '5%', paddingTop: '5%', alignItems: 'center' }}>
                    <Text style={styles.cardTitle}>Order Details</Text>
                    { screen !== 'invoice' && (
                    <View style={{
                        paddingHorizontal: '4%',
                        paddingVertical: '2%',
                        backgroundColor: orderDetails?.status === 'Cancel' || orderDetails?.status === 'Cancelled' || orderDetails?.status === 'Pending Balance' || orderDetails.status === 'Missing Product' || orderDetails.status === 'Manager Reject'
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
                )}
                </View>

                <View style={styles.expandedContent}>
                    <View style={{ paddingHorizontal: '5%', paddingBottom: '2%' }}>
                      <View style={styles.row}>
                        <Text style={styles.title}>
                          Bill To
                        </Text>
                        <Text style={[styles.value,{textAlign:'right',width:'72%',fontWeight:'700'}]}>
                         {orderDetails?.company_name}
                        </Text>
                      </View>
                        <View style={styles.row}>
                            <Text style={styles.title}>Order ID</Text>
                            <Text style={styles.value}>{ screen ==='invoice' ?orderDetails?.invoice_name :orderDetails?.name}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.title}>{screen === "PO" ? 'Supplier' : 'Customer'}</Text>
                            <Text style={[styles.value, { textAlign: 'right', width: '72%' }]}>{screen === "PO" ? orderDetails?.supplier_name : screen ==='invoice' ? orderDetails?.customer_name :orderDetails?.assignee_name}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.title}>Order Placed</Text>
                            <Text style={styles.value}>{ConvertDateTime(orderDetails?.created_at).formattedDate} {ConvertDateTime(orderDetails?.created_at).formattedTime}</Text>
                        </View>

                        { screen !=='invoice' &&
                          <View style={{...styles.row}}>
                            <Text style={{...styles.title}}>Site Address</Text>
                            <Text style={{...styles.value,flex:1, textAlign: 'right'}} numberOfLines={2}>{orderDetails?.site_address}</Text>
                          </View>
                        }
                          <View style={{...styles.row}}>
                            <Text style={{...styles.title}}>Payment Terms</Text>
                            <Text style={{...styles.value,flex:1, textAlign: 'right'}} numberOfLines={2}>{orderDetails?.payment_term}</Text>
                        </View>
                    {screen !=='invoice' &&

             <View style={{ ...styles.row }}>
                <Text style={{ ...styles.title }}>Order Image</Text>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <Text style={{ ...styles.value,color:'blue' }}> View </Text>
                </TouchableOpacity>
            </View>
}
                        {orderDetails.transportation_type === "Pick-Up" &&
                     <View style={styles.row}>
                         <Text style={styles.title}>Transportation type</Text>
                         <Text style={styles.value}>{orderDetails?.transportation_type}</Text>
                     </View>
                        
                        }

                     <View style={styles.row}>
                         <Text style={styles.title}>Total Price</Text>
                         <Text style={styles.value}>
                         ₹{new Intl.NumberFormat('en-IN', {  currency: 'INR' }).format(orderDetails?.total_price)}
                         </Text>
                     </View>

                        {orderDetails?.remarks && (
                            <View style={styles.row}>
                                <Text style={styles.title}>Remarks</Text>
                                <Text style={[styles.value, { color: 'tomato' }]}>{orderDetails?.remarks}</Text>
                            </View>
                        )}

                        {orderDetails?.collection_remarks && orderDetails?.status == "Pending Balance"  && (
                            <View style={styles.row}>
                                <Text style={styles.title}>Remarks</Text>
                                <Text style={[styles.value, { color: 'tomato' }]}>{orderDetails?.collection_remarks}</Text>
                            </View>
                        )}

                         {orderDetails?.collection_remarks && orderDetails?.status == "Missing Product"  && (
                            <View style={styles.row}>
                                <Text style={styles.title}>Remarks</Text>
                                <Text style={[styles.value, { color: 'tomato' }]}>{orderDetails?.collection_remarks}</Text>
                            </View>
                        )}
                    </View>
                </View>
            </View>


{
  orderDetails?.status === "Delivered" && orderDetails?.charges.length > 0 && (
    <View style={[styles.card, { flex: 0.5 }]}>
      <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'space-between', 
          paddingLeft: '5%', 
          paddingVertical: '3%', 
          alignItems: 'center', 
          borderBottomWidth: 1, 
          borderBottomColor: '#D3D3D3' 
        }}>
        <Text style={styles.cardTitle}>Add Charges</Text>

        {orderDetails.status !== "Delivered" && orderDetails.charges.length <= 0 && (
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={addRow}
          >
            <Text style={styles.buttonText}>Add</Text>
            <Entypo name="plus" color="white" size={20} />
          </TouchableOpacity>
        )}
      </View>

      {/* Scrollable content */}
      <ScrollView contentContainerStyle={{ padding: 20, backgroundColor: '#f8f8f8' }}>
        {/* Render prepopulated charges */}
        {orderDetails.charges.map((charge, index) => (
          <View key={index} style={{ flexDirection: 'row', marginBottom: 10, alignItems: 'center' }}>
            <Text style={{ flex: 1, marginRight: 10, padding: 8, borderWidth: 1, borderColor: '#ccc', backgroundColor: '#f0f0f0', color: 'black' }}>
              {charge.type}
            </Text>
            <Text style={{ flex: 1, borderWidth: 1, borderColor: '#ccc', padding: 10, backgroundColor: '#f0f0f0', color: 'black' }}>
              ₹ {charge.charges.toFixed(2)}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  )
}

            <View style={[styles.card1, { marginBottom: '10%', paddingHorizontal: '3%' }]}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: '2%', paddingVertical: '3%', borderBottomWidth: 1, borderBottomColor: 'grey' }}>
                    <Text style={styles.cardTitle}>Products</Text>
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
                </View>


                <View style={styles.ProductListContainer}>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={products}
                        keyboardShouldPersistTaps='handled'
                        renderItem={({ item }) =>

                            <View style={{ ...styles.elementsView, backgroundColor: ((!item.is_available && screen === "SO") ? "#fbd9d3" : " ") }} >
                                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                    <Pressable >
                                        {item.product_image && item.product_image.length > 0 ? (
                                            <Image
                                                source={{uri: item.product_image.startsWith("http")
          ? item.product_image
          : `https://gsidev.ordosolution.com${item.product_image}`,
      }} 
                                                style={styles.imageView}
                                            />
                                        ) : (
                                            <Image
                                                source={require("../../assets/images/noImagee.png")} 
                                                style={styles.imageView}
                                            />
                                        )}

                                    </Pressable>
                                    <View style={{
                                        flex: 1,
                                        paddingLeft: 5,
                                        marginLeft: 5,
                                    }}>
                                        <View style={{flexDirection:'row',justifyContent:'space-between'}}> 
                                        <Text style={{ color: Colors.primary, fontSize: 14, fontFamily: 'AvenirNextCyr-Medium', marginTop: 5,width:'70%' }}>{item?.name}</Text>
                                    { (orderDetails?.is_production === true && item.production_order.length > 0) &&
                                      <TouchableOpacity style={{
                                        backgroundColor: Colors.primary,
                                        padding:4,
                                        borderRadius:4,
                                        height:30 }}  onPress={() =>
                                        OpenDimention(item.production_order) }>
                                        <Text style={{fontFamily: "AvenirNextCyr-Bold",fontSize: 13,color: "white"}}>View</Text>
                                       </TouchableOpacity>
                                     }
                                         </View>
                                         { ( orderDetails?.product_list[0]?.name !== "BASE PLATE"  && orderDetails?.is_production === true) &&
                                          <View>
                                         <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: '3%', justifyContent: 'space-between',flex:1 }}>
                                            <View style={{ flexDirection: 'row',width:'50%'}}>
                                            <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}>
                                             {orderDetails?.status === "Partially Delivered" || orderDetails?.status === "Delivered" || screen == "invoice"
                                               ? 'Loaded Weight : ' 
                                               : orderDetails?.status === "Production Completed" 
                                                 ? 'Consumed Weight : ' 
                                                 : 'Qty: '}
                                           </Text>

                                           <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}>
                                             {orderDetails?.status === "Partially Delivered" || orderDetails?.status === "Delivered" || screen == "invoice"
                                               ?item?.roofing_production_weight 
                                               : orderDetails?.status === "Production Completed" 
                                                 ? item?.roofing_consumed_weight
                                                 : item?.qty } {orderDetails?.status === "Partially Delivered" || orderDetails?.status === "Delivered" || screen == "invoice"
                                                 ? 'Kg'
                                                 : orderDetails?.status === "Production Completed" 
                                                   ? 'Kg'
                                                   : item?.loaded_uom }
                                           </Text>
                                            </View>

                                          
                                        </View>
                                          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                          <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}>Price :</Text>
                                          <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}>{parseFloat(item?.price).toFixed(2)} </Text>
                                      </View>
                                     </View>
                                      }

                                       { ( orderDetails?.product_list[0]?.name === "BASE PLATE"  && orderDetails?.is_production === true) &&
                                         <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: '3%', justifyContent: 'space-between' }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}>Qty :</Text>
                                                <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}>{item?.qty} {item?.loaded_uom}
                                                </Text>
                                            </View>

                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}>Price :</Text>
                                                <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}>{parseFloat(item?.price).toFixed(2)} </Text>
                                            </View>
                                        </View>
                                        }
                                         { orderDetails?.is_production === true &&
                                         <>
                                        {
                                         item?.product_remarks && (
                                          <View style={{ flexDirection: 'row',justifyContent:'space-between'}}>
                                             <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}>Product Remark :</Text>
                                             <Text style={{ color: 'green', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium',width:'55%'}}>{item?.product_remarks}</Text>
                                          </View>
                                         )
                                        }
                                         </>
                                        }

                                         { orderDetails?.is_production !== true &&
                                         <>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: '3%', justifyContent: 'space-between' }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}>Qty :  </Text>
                                                <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}>{item?.qty} {item?.loaded_uom}
                                                </Text>
                                            </View>

                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}>Price :  </Text>
                                                <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}>{parseFloat(item?.price).toFixed(2)} </Text>
                                            </View>
                                        </View>

                                        {item?.loaded_weight && 
                                          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}>Loaded Weight :  </Text>
                                                <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}>{item?.loaded_weight} </Text>
                                            </View>
                                        }
                                        {
                                         item?.product_remarks && (
                                          <View style={{ flexDirection: 'row',justifyContent:'space-between'}}>
                                             <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}>Product Remark :  </Text>
                                             <Text style={{ color: 'green', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium',width:'55%'}}>{item?.product_remarks}</Text>
                                          </View>
                                         )
                                        }
                                        {
                                          orderDetails.status === 'Missing Product' && item?.remarks && (
                                          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                              <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}>Remark :  </Text>
                                              <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}>{item?.remarks}</Text>
                                          </View>
                                          )
                                        }

                                        {
                                            orderDetails.status === 'Partially Delivered' && (
                                                <>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}>Loaded Qty : </Text>
                                                <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}>{item?.loaded_qty}</Text>
                                            </View>
                                             <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                             <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}>Loaded Weight : </Text>
                                             <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}> {orderDetails.transportation_type === "Delivery" ? item?.actual_loaded_weight : item?.pickup_loaded_weight} kg</Text>
                                           </View>
                                           <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                             <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}>Remaining Qty : </Text>
                                             <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}>{item?.remaining_qty} {item?.loaded_uom}</Text>
                                           </View>
                                         </>
                                            )
                                        }

                                       {
                                          orderDetails.status === 'Delivered' && (
                                            <>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}>Loaded Qty : </Text>
                                                <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}>{item?.loaded_qty}</Text>
                                            </View>
                                             <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                             <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}>Loaded Weight : </Text>
                                             <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}> {orderDetails.transportation_type === "Delivery" ? item?.actual_loaded_weight : item?.pickup_loaded_weight} kg</Text>
                                           </View>
                                         </>
                                            )
                                        }

                                       {
                                          screen === 'invoice' && (
                                            <>
                                       {/* <View style={{ flexDirection: 'row', alignItems: 'center' }}><Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}>Loaded Qty : </Text>
                                             <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}>{item?.total_qty}</Text></View> */}
                                              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                              <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}>Loaded Weight : </Text>
                                              <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}>{item?.total_weight} kg</Text>
                                           </View>
                                         </>
                                            )
                                        }
                                        {!item.is_available && screen == "SO" && <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', marginTop: '2%' }}>
                                            <Text style={{ fontFamily: 'AvenirNextCyr-Bold', color: 'tomato' }}>Unavailable</Text>
                                        </View>}
                                        </> }
                                    </View>
                                </View>
                            </View> } />
                     </View>
               </View>

            <Modal visible={visible} transparent={true}>
                <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', flex: 1, justifyContent: 'center', }}>
                    <View style={{ backgroundColor: 'white', padding: '2%', borderRadius: 15, flex: 1 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ fontFamily: 'AvenirNextCyr-Medium', fontSize: 16 }}>Choose Products</Text>
                            <TouchableOpacity onPress={() => { setVisible(false) }}>
                                <AntDesign name="close" color="black" size={20} />
                            </TouchableOpacity>
                        </View>
                        <View style={{ flex: 1 }}>
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                data={products}
                                keyboardShouldPersistTaps="handled"
                                renderItem={renderItem}
                            />
                        </View>
                        <LinearGradient
                            colors={Colors.linearColors}
                            start={Colors.start}
                            end={Colors.end}
                            locations={Colors.ButtonsLocation}
                            style={{
                                borderRadius: 20,
                            }}
                        >
                            <TouchableOpacity
                                onPress={handleReturn}
                                style={{ paddingVertical: '4%', justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontFamily: 'AvenirNextCyr-Bold', color: 'white' }}>Review</Text>
                            </TouchableOpacity>
                        </LinearGradient>
                    </View>
                </View>
            </Modal>

<Modal visible={modalVisible} transparent={true}>
  <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', flex: 1, justifyContent: 'center' }}>
    <View style={{ backgroundColor: 'white', padding: '2%', borderRadius: 15, flex: 0.8, marginHorizontal: '3%' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ fontFamily: 'AvenirNextCyr-Medium', fontSize: 16 }}>Order Images</Text>
        <TouchableOpacity onPress={() => setModalVisible(false)}>
          <AntDesign name="close" color="black" size={25} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        horizontal 
        pagingEnabled 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ alignItems: 'center' }}
        style={{ flex: 1 }}
      >
        {orderDetails?.order_images?.length > 0 ? (
          orderDetails.order_images.map((imageUri, index) => (
            <View>
            <View key={index} style={{ width: windowWidth -40, height: '100%', paddingHorizontal: 10 }}>
              <WebView
                source={{ uri: imageUri }}
                style={{ flex: 1}}
                scalesPageToFit={true}
                scrollEnabled={true}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                startInLoadingState={true}
                automaticallyAdjustContentInsets={false}
                useWebKit={true}
                mixedContentMode="compatibility"
                onLoadStart={() => console.log("Loading image...")}
                onLoadEnd={() => console.log("Image loaded")}
                androidHardwareAccelerationDisabled={true}
                allowFileAccess={true}
                allowsFullscreenVideo={true}
                allowsInlineMediaPlayback={true}
                allowsAirPlayForMediaPlayback={true}
                allowsBackForwardNavigationGestures={true}
              />
            </View>
            <TouchableOpacity onPress={() => downloadImage(imageUri)}  style={{
              backgroundColor: "#0077c0",
              padding: "3%",
              borderRadius: 10,
              marginHorizontal: "3%",
              flexDirection:'row',
              marginTop:'2%',
              alignItems:'center',
              justifyContent:'center',
              gap:9,
              marginBottom:'20%'
            }}>
          <AntDesign name="download" color="white" size={20} />
          <Text style={{ fontFamily: 'AvenirNextCyr-Medium', fontSize: 16,color: 'white'}}>Download</Text>
           </TouchableOpacity>
        </View>
          ))
        ) : (
          <Text style={{ fontFamily: 'AvenirNextCyr-Medium', fontSize: 16, marginTop: '30%', color: 'black', textAlign: 'center' }}>
            No Images
          </Text>
        )}
      </ScrollView>
    </View>
  </View>
</Modal>

<Modal visible={menuVisible1} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
      <View style={[styles.modalContainer11,{ paddingTop:50}]}>
      {dimensionData && dimensionData.length < 0 ? (
        <Text style={{fontSize: 20,color: Colors.black,fontFamily: "AvenirNextCyr-Medium",marginBottom:'2%'}}>Dimensions</Text>
      ):(null)}
        {dimensionData && dimensionData.length > 0 ? (
        <FlatList
          data={dimensionData}
          renderItem={renderItems}
          // keyExtractor={(item, index) => item.production_id.toString()}
        />
      ) : (
        <Text
          style={{
            fontSize: 16,
            color: Colors.gray,
            fontFamily: "AvenirNextCyr-Medium",
            textAlign: 'center',
            marginTop: 20,
          }}
        >
          No dimension added
        </Text>
      )}
        <TouchableOpacity style={{position:'absolute',top:20 ,right:10}} onPress={()=>{setMenuVisible1(false);}}>
          <AntDesign name='close' size={28} color={`black`} />
        </TouchableOpacity>
      </View>
      </View>
    </Modal>

            <ProgressDialog
                visible={loading}
                dialogStyle={{ width: '50%', alignSelf: 'center' }}
                message="Please wait..."
                titleStyle={{ fontFamily: 'AvenirNextCyr-Medium', fontSize: 16 }}
                messageStyle={{ fontFamily: 'AvenirNextCyr-Medium', fontSize: 14 }}
            />

          {isCommentsModalVisible && (
           <Comments
             route={{ params: { orderId: screen ==='invoice'? orderDetails?.invoice: orderDetails?.id } }}
             isModal={true}
             onClose={() => setIsCommentsModalVisible(false)}
           />
          )}
        </View>
    )
}

export default SalesOrderDetails;
const styles = StyleSheet.create({

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
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
        width: 75,
        height: 75,
    },
    elementsView: {
        paddingVertical: '3%',
        borderBottomColor: 'grey',
        borderBottomWidth: 0.5,
        paddingHorizontal: '2%'
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
        marginVertical: '4%',
        backgroundColor: '#F5F5F5',
        flex: 1
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
        borderRadius: 40, 
        borderWidth: 1, 
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
        // marginBottom: 20,
        // justifyContent: "center",
        // padding: 20,
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
        // height: 100, // Adjust the height as needed for your design
    },
    Btext: {
        color: 'white',
        fontFamily: 'AvenirNextCyr-Bold',
        fontSize: 17,
        textAlign:'center'

    },
    historyBtn: {
        paddingVertical: 5,
        paddingHorizontal: "1%",
        borderRadius: 5,
        marginRight: 7,
    },
     buttonContainer: {
        height: 40,
        padding: 10,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor:'#65A765',
        marginRight:'5%',
        width:'20%',
        flexDirection:'row',
        gap:3
      },  fabStyle: {
        position: "absolute",
        right: "5%",
        bottom: "7%",
        backgroundColor: Colors.primary,
      }, card11: {
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 12,
        marginBottom: 15,
        borderWidth:0.6,
      }, stockDataContainer: {
        marginTop: 10,
        padding: 10,
        backgroundColor: "#f9f9f9",
        borderRadius: 5,
      },
      closeButton: {
        backgroundColor: "#007BFF",
        padding: 15,
        borderRadius: 5,
        alignItems: "center",
        marginTop: 20,
      },
      closeButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
      }, modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      },
      modalContent: {
        backgroundColor: "white",
        padding: "4%",
        borderRadius: 10,
        width: "90%",
        height: "40%",
      },
      modalTitle: {
        fontSize: 20,
        fontFamily: "AvenirNextCyr-Medium",
        marginBottom: "3%",
        color: Colors.primary,
      },modalContainer11: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: "center",
        padding: 20,
        marginVertical:'5%',
        borderRadius:10,
        width:'90%',
        paddingTop:20
      }, modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      },

})