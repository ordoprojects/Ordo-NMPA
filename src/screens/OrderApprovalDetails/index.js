import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../Context/AuthContext';
import { View, Dimensions, Text, ScrollView, StyleSheet, TouchableOpacity, Modal, TextInput, Alert, FlatList, Pressable, Linking  ,KeyboardAvoidingView,ActivityIndicator} from 'react-native'
import Colors from '../../constants/Colors';
import { Image } from 'react-native-animatable';
import { TextInput as TextInput1 } from "react-native-paper";
import globalStyles from '../../styles/globalStyles';
import ConvertDateTime from '../../utils/ConvertDateTime';
import { ProgressDialog } from 'react-native-simple-dialogs';
import Toast from "react-native-simple-toast";
import { MaskedTextInput } from "react-native-mask-text";
import AntDesign from "react-native-vector-icons/AntDesign";
import LinearGradient from "react-native-linear-gradient";
import Comments from '../../components/Comments';
import { WebView } from 'react-native-webview';
import RNFetchBlob from 'rn-fetch-blob';


const OrderApprovalDetails = ({ navigation, route }) => {

    const orderDetail = route.params?.orderDetails;
    const [orderDetails, setOrderDetails] = useState(orderDetail);
    const screen = route.params?.screen;
    const [products, setProducts] = useState([]);
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0); 
    const { userData } = useContext(AuthContext);
    const [visible, setVisible] = useState(false)
    const [remarks, setRemarks] = useState("");
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState('');
    const [isCommentsModalVisible, setIsCommentsModalVisible] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [modalVisibleBill, setModalVisibleBill] = useState(false);
    const { width: windowWidth } = Dimensions.get('window');
    const [dimensionData, setDimensionData] = useState('');
    const [menuVisible1, setMenuVisible1] = useState(false);

{/* 
      //  03-Apr-2025 | Sahana 
      // Function to open the modal with data of dimentions fetched from API*/}

    const OpenDimention = (data) => {
      console.log("🚀 ~ OpenDimention ~ data:", data)
      setDimensionData(data);
      setMenuVisible1(true)
   };

  // ORDO GSI APP B_420 | 08-Apr-2025 | Sahana 
   // Fixed issues by adding extra text for NOS

   const renderItems = ({ item }) => (
           <View style={styles.card11}>
            
              {orderDetails?.product_list[0]?.name === "BASE PLATE" ? <Text style={{color:Colors.primary ,fontFamily: "AvenirNextCyr-Bold",
              fontSize: 17}}>Dimensions: {item.height_inch} X {item.width_ft} X {item.thickness} </Text>  :
              <Text style={{color:Colors.primary ,fontFamily: "AvenirNextCyr-Bold",
              fontSize: 17}}>Dimensions: {item.width_ft}' {item.height_inch}"</Text> }
<Text style={{color:Colors.black ,fontFamily: "AvenirNextCyr-Medium",
      fontSize: 15}}>Qty: {item.remaining_nos} NOS</Text>
           </View>
         );


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

    useEffect(() => {
        // Initialize products when the component mounts
        if (route.params && route.params.orderDetails && route.params.orderDetails.product_list) {
            const initializedProducts = route.params.orderDetails.product_list.map(product => ({
                ...product,
                checked: false,
                returnQty: 1,
                stockError: false,
                errorMessage: "",
                display_price: (product.price) * 100
            }));
            setProducts(initializedProducts);
            console.log(initializedProducts)
        }
    }, []);


    const changeStatus = async (status) => {
      console.log("status",status)
        // Display a confirmation dialog
        Alert.alert(
            status === 'Manager Reject' ? 'Reject Order' : 'Move to Collection',
            status === 'Manager Reject' ? 'Are you sure you want to Reject this order?' : 'Do you wish to send this order to collection team?',
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel",
                },
                {
                    text: "Yes",
                    onPress: async () => {
                        let url = status === "Manager Reject" ? `https://gsidev.ordosolution.com/api/sales_order/${orderDetails.id}/` : `https://gsidev.ordosolution.com/api/update_so_order_product_price/`
                        setLoading(true);
                        setIsUpdating(true);
                        var myHeaders = new Headers();

                        myHeaders.append("Content-Type", "application/json");
                        myHeaders.append("Authorization", `Bearer ${userData.token}`);

                    if (status != "Manager Reject") {
                        const formattedProducts = products.map((item) => {
                            const rawPrice = parseFloat(item?.price.replace(/[^0-9.-]+/g, ""));
                            return {
                                id: item.product_id,
                                price: rawPrice,
                            };
                        });

                        var raw = JSON.stringify({
                            so_order_id: orderDetails?.id,
                            products: formattedProducts,
                            manager_remarks:remarks,
                            manager_approve_by: userData?.id
                        })
                    } else {
                        var raw = JSON.stringify({
                            status: "Manager Reject",
                            stages: "Sales Order Placed",
                            manager_remarks:remarks
                        });
                    }7

                    var requestOptions = {
                        method: status === "Manager Reject" ? "PUT" : "POST",
                        headers: myHeaders,
                        body: raw,
                        redirect: "follow",
                    }

                    console.log("manager raw",raw,userData?.token)

                    await fetch( url, requestOptions )
                        .then((response) => {

                            if (response.status === 200) {
                                Toast.show("Order updated successfully", Toast.LONG);
                                setIsUpdating(false);
                                setVisible(false)
                                setLoading(false);
                                navigation.goBack();
                            } else {
                                setLoading(false)
                                setVisible(false)
                                setIsUpdating(false);
                                Toast.show("Something went wrong", Toast.LONG);
                            }
                        })
                        .catch((error) => console.log("api error", error));
                        setLoading(false);
                        setIsUpdating(false);
                    },
                },
            ]);
         };


    const handleReject = () => {
        if (!remarks.trim()) {
          // If remarks are not present, show alert asking to fill the remarks
          Alert.alert(
            "Missing Remarks",
            "Please fill in the Remarks ",
            [{ text: "OK" }]
          );
        } else {
          changeStatus(status);
        }
      };
    

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


    const updatePrice = async (itemId, newPrice) => {
        // console.log("newPrice", newPrice);
        // Calculate the new price based on the quantity
        const adjustedPrice = newPrice || 0; // If newPrice is falsy, set it to 0

        // Update cartData with the new price for the particular itemId
        setProducts((prevData) =>
            prevData.map((item) =>
                item.id === itemId
                    ? { ...item, price: adjustedPrice } // Ensure list_price is updated correctly
                    : item
            )
        );
    };


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
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    {screen === "PO" ? (<Text style={{ fontSize: 20, color: Colors.primary, fontFamily: 'AvenirNextCyr-Medium' }}>{orderDetails.name} ({orderDetails.supplier_name}-{orderDetails.supplier_id})</Text>) :
                        (<Text style={{ fontSize: 20, color: Colors.primary, fontFamily: 'AvenirNextCyr-Medium' }}>{orderDetails.name} ({orderDetails.assignee_name}-{orderDetails.assigne_to})</Text>)}
                </View>
               <View>
            </View>
       </View>

            <View style={styles.card}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: '5%', paddingTop: '5%', alignItems: 'center' }}>
                    <Text style={styles.cardTitle}>Order Details</Text>
                    <View style={{
                        paddingHorizontal: '4%',
                        paddingVertical: '2%',
                        backgroundColor: orderDetails.status ==='Manager Reject'
                            ? '#d11a2a'
                            : (orderDetails.status === 'Manager Approve'
                                ? 'orange'
                                : 'green'
                            )
                        ,
                        borderRadius: 20
                    }}>
                        <Text style={{ fontFamily: 'AvenirNextCyr-Medium', fontSize: 14, color: 'white' }}>
                            {orderDetails.status === 'Cancel' ? 'Canceled' : (orderDetails.status === 'Pending' ? 'Approved' : orderDetails.status)}
                        </Text>
                    </View>
                </View>

                <View style={styles.expandedContent}>
                    <View style={{ paddingHorizontal: '5%', paddingBottom: '2%' }}>
                    <View style={styles.row}>
                            <Text style={styles.title}>Bill To</Text>
                            <Text style={[styles.value,{width:'75%',textAlign:'right'}]}>{orderDetails?.company_name}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.title}>Order ID</Text>
                            <Text style={styles.value}>{orderDetails.name}</Text>
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.title}>{screen === "PO" ? 'Supplier' : 'Customer'}</Text>
                            <Text style={[styles.value,{width:'65%',textAlign:'right'}]}>{screen === "PO" ? orderDetails.supplier_name : orderDetails.assignee_name}</Text>
                        </View>
                        <View style={styles.row}>
              <Text style={styles.title}>Payment Terms</Text>
              <Text style={styles.value}>
                {orderDetails?.payment_term}
              </Text>
            </View>
            <View style={{ ...styles.row }}>
                <Text style={{ ...styles.title }}>Order Image</Text>
                <TouchableOpacity onPress={() => setModalVisibleBill(true)}>
                    <Text style={{ ...styles.value,color:'blue' }}>
                        View
                    </Text>
                    </TouchableOpacity>
                    </View>
                        <View style={styles.row}>
                            <Text style={styles.title}>Order Placed</Text>
                            <Text style={styles.value}>{ConvertDateTime(orderDetails?.created_at).formattedDate} {ConvertDateTime(orderDetails?.created_at).formattedTime}</Text>
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.title}>Total Price</Text>
                            <Text style={styles.value}>
                              {orderDetails?.total_price? 
         new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(orderDetails?.total_price)) : 
         new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(0)
       }</Text>
                        </View>

                        {orderDetails.status == "Cancel" || orderDetails.status == "Pending" &&
                            <View style={styles.row}>
                            <Text style={styles.title}>Approved By</Text>
                            <Text style={styles.value}>{orderDetails?.manager_approve_name}</Text>
                        </View>
             }
            {orderDetails.status == "Cancel" || orderDetails.status == "Pending" &&
              orderDetails.manager_remarks && (
                <View style={styles.row}>
                  <Text style={styles.title}>Remark :</Text>
                  <Text
                    style={[
                      styles.value,
                      { color: "red", width: "80%", textAlign: "right" },
                    ]}
                  >
                    {orderDetails.manager_remarks}
                  </Text>
                </View>
                )}
                </View>
                </View>
            </View>


            <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    // keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0} // Adjust this value as needed
    >

            <ScrollView style={[styles.card1, { marginBottom: '10%', paddingHorizontal: '3%' }]}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: '3%', paddingVertical: '3%', borderBottomWidth: 1, borderBottomColor: 'grey',alignItems:'center' }}>
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

                            <View style={{ ...styles.elementsView, backgroundColor: (!item.is_available ? "#fbd9d3" : " ") }} >
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
                                        paddingLeft: 15,
                                        marginLeft: 10,
                                    }}>
                                      <View style={{flexDirection:'row',justifyContent:'space-between'}}>

                                      <View style={{flexDirection:'column',flex:1}}>
                                        <Text style={{ color: Colors.primary, fontSize: 14, fontFamily: 'AvenirNextCyr-Medium', marginTop: 5 }}>{item.name}</Text>
                                        <Text style={{ color: Colors.primary, fontSize: 12, fontFamily: 'AvenirNextCyr-Medium', marginTop: 5, }}>Cap price: {item?.lower_price_cap}</Text>
                                        </View>



{/* 
      //  03-Apr-2025 | Sahana 
      // Checks here whether the order is a Production order, only then view button is displayed */}
{(() => {
  console.log("production_order:", item.production_order);

  if (orderDetails?.is_production === true && item.production_order.length > 0) {
    return (
      <TouchableOpacity
        style={{
          backgroundColor: Colors.primary,
          padding: 4,
          borderRadius: 4,
          height: 30,
        }}
        onPress={() => OpenDimention(item.production_order)}
      >
        <Text
          style={{
            fontFamily: "AvenirNextCyr-Bold",
            fontSize: 13,
            color: "white",
          }}
        >
          View
        </Text>
      </TouchableOpacity>
    );
  }

  return null;
})()}



                                                                                 </View>
                                        {item.product_remarks && <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', marginTop: '2%' }}>
                                            <Text style={{ fontFamily: 'AvenirNextCyr-Medium', color: 'green',fontSize: 12}}>{item?.product_remarks}</Text>
                                        </View>}

                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: '3%', justifyContent: 'space-between' }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}>Qty :  </Text>
                                                <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}>{item?.qty} {item?.loaded_uom}
                                                </Text>
                                            </View>
                                                

                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                {/* <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}>Price :  </Text> */}
                                                <View
                                                    style={{
                                                        paddingHorizontal: 10,
                                                        borderColor: "#cccccc",
                                                        borderWidth: 1,
                                                        height: 30,
                                                        flexDirection: "row",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                    }}
                                                >
                                                    <MaskedTextInput
                                                        type="currency"
                                                        options={{
                                                            prefix: "₹ ",
                                                            decimalSeparator: ".",
                                                            groupSeparator: ",",
                                                            precision: 2,
                                                        }}
                                                        onChangeText={(text, rawText) => {
                                                            // Log the formatted and raw text for debugging
                                                            console.log(text);
                                                            console.log(rawText);

                                                            // Call updatePrice with the integer part
                                                            updatePrice(item.id, text);
                                                        }}
                                                        // value={((item.price) * 100).toString()}
                                                        value={item?.display_price?.toString()}
                                                        style={{ height: 40,color: 'black', }}
                                                        keyboardType="numeric"
                                                        returnKeyType="done"
                                                    />
                                                </View>
                                            </View>
                                        </View>
                                        
                                        {item.remarks && <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', marginTop: '2%' }}>
                                            <Text style={{ fontFamily: 'AvenirNextCyr-Bold', color: 'tomato' }}>{item?.remarks}</Text>
                                        </View>}
                                    </View>
                                </View>
                            </View>
                        }
                    />
                </View>
            </ScrollView>
            </KeyboardAvoidingView>

            {orderDetails.status === "Manager Approve" && (
                <View style={{ flexDirection: 'row', width: '100%', gap: 15 }}>
                    <TouchableOpacity
                        onPress={() => {   setVisible(true); setStatus('Manager Reject')}}
                        style={{ backgroundColor: 'tomato', width: '49%', justifyContent: 'center', alignItems: 'center', paddingVertical: '3%', borderRadius: 20 }}
                    >
                        <Text style={styles.Btext}>Reject</Text>
                    </TouchableOpacity>


                    <TouchableOpacity
                        onPress={() => {   setVisible(true); setStatus('Pending') }}
                        style={{ backgroundColor: 'green', width: '49%', justifyContent: 'center', alignItems: 'center', paddingVertical: '3%', borderRadius: 20 }}
                    >
                        <Text style={styles.Btext}>Approve</Text>
                    </TouchableOpacity>
                </View>
            )}

            <ProgressDialog
                visible={loading}
                // title="Uploading file"
                dialogStyle={{ width: '50%', alignSelf: 'center' }}
                message="Please wait..."
                titleStyle={{ fontFamily: 'AvenirNextCyr-Medium', fontSize: 16 }}
                messageStyle={{ fontFamily: 'AvenirNextCyr-Medium', fontSize: 14 }}
            />

<Modal visible={visible} transparent={true}>
        <View
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            flex: 1,
            justifyContent: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              padding: "4%",
              borderRadius: 15,
              marginHorizontal: "4%",
            }}
          >
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text
                style={{ fontFamily: "AvenirNextCyr-Medium", fontSize: 16,color:Colors.black }}
              >
                Add Remarks
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setVisible(false);
                }}
              >
                <AntDesign name="close" color="black" size={20} />
              </TouchableOpacity>
            </View>
            <View style={{ marginVertical: "4%" }}>
              <TextInput1
                mode="outlined"
                label="Remarks"
                value={remarks}
                theme={{ colors: { onSurfaceVariant: "#4b0482" } }}
                activeOutlineColor="#4b0482"
                outlineColor="#B6B4B4"
                textColor="#4b0482"
                multiline={true}
                numberOfLines={4}
                onChangeText={(text) => setRemarks(text)}
                returnKeyType="next"
                blurOnSubmit={false}
                outlineStyle={{ borderRadius: 10 }}
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
                onPress={handleReject}
                style={{
                  paddingVertical: "4%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
               {isUpdating ? (
                  <ActivityIndicator size={28} color={Colors.white} />
                ) : (
                  <Text
                    style={{ fontFamily: "AvenirNextCyr-Bold", color: "white" }}
                  >
                    Submit
                  </Text>
                )}
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>
      </Modal>

      <Modal visible={modalVisibleBill} transparent={true}>
  <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', flex: 1, justifyContent: 'center' }}>
    <View style={{ backgroundColor: 'white', padding: '2%', borderRadius: 15, flex: 0.8, marginHorizontal: '3%' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ fontFamily: 'AvenirNextCyr-Medium', fontSize: 16 }}>Order Images</Text>
        <TouchableOpacity onPress={() => setModalVisibleBill(false)}>
          <AntDesign name="close" color="black" size={25} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        horizontal 
        pagingEnabled 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ alignItems: 'center' }}
        style={{ flex: 1 ,alignSelf:'center'}}
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
          <Text 
            style={{
              fontFamily: 'AvenirNextCyr-Medium',
              fontSize: 16,
              color: 'white',
            }}>Download</Text>
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



{/* 
      //  03-Apr-2025 | Sahana 
      // Modal to display the dimension fetched from API*/}

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
        <TouchableOpacity style={{position:'absolute',top:18 ,right:10}} onPress={()=>{setMenuVisible1(false);}}>
          <AntDesign name='close' size={28} color={`black`} />
        </TouchableOpacity>
      </View>
      </View>
    </Modal>

      {isCommentsModalVisible && (
           <Comments
             route={{ params: { orderId: orderDetails?.id } }}
             isModal={true}
             onClose={() => setIsCommentsModalVisible(false)}
           />
          )}
          
        </View>
    )
}

export default OrderApprovalDetails;
const styles = StyleSheet.create({


    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        // marginBottom: 7
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
        width: 80,
        height: 80,
    },
    elementsView: {
        paddingVertical: '4%',
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
        borderRadius: 40, // Half of the width/height to make it circular
        borderWidth: 1,   // Border styles
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
    },
    addressInput: {
    },
    Btext: {
        color: 'white',
        fontFamily: 'AvenirNextCyr-Bold',
        fontSize: 17

    },
    card11: {
      backgroundColor: "#fff",
      borderRadius: 10,
      padding: 12,
      marginBottom: 15,
      borderWidth:0.6,
    },
    modalContainer11: {
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