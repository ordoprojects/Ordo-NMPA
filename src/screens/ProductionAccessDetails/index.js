import React, { useContext, useEffect, useState,useRef, useCallback,
  useMemo, } from "react";
import { AuthContext } from "../../Context/AuthContext";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  FlatList,
  Pressable,
  ActivityIndicator,
  Dimensions
} from "react-native";
import Colors from "../../constants/Colors";
import { Image } from "react-native-animatable";
import globalStyles from "../../styles/globalStyles";
import AntDesign from "react-native-vector-icons/AntDesign";
import ConvertDateTime from "../../utils/ConvertDateTime";
import LinearGradient from "react-native-linear-gradient";
import { TextInput as TextInput1,Modal as PaperModal ,Portal ,PaperProvider } from "react-native-paper";
import Toast from "react-native-simple-toast";
import { LoadingView } from "../../components/LoadingView";
import Comments from '../../components/Comments';
import { WebView } from 'react-native-webview';
import RNFetchBlob from 'rn-fetch-blob';


const ProductionAccessDetails = ({ navigation, route }) => {

  const orderDetail = route.params?.orderDetails;
  const [orderDetails, setOrderDetails] = useState(orderDetail);
  const screen = route.params?.screen;
  const [products1, setProducts1] = useState(route?.params?.orderDetails?.product_list );
  const [loading, setLoading] = useState(false);
  const [productionData, setProductionData] = useState('');
  const [selectedItem, setselectedItems] = useState([]);
  const [modalVisible1, setModalVisible1] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [modalVisible3, setModalVisible3] = useState(false);
  const [rows, setRows] = useState([{ input1: '', input2: '', input3: '' }]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState(null); 
  const [isCommentsModalVisible, setIsCommentsModalVisible] = useState(false);
  const [selectedItemName, setSelectedItemName] = useState('');
  const {userData } = useContext(AuthContext);
  const [stockDeductBaseData, setStockDeductBaseData] = useState('');
  const [finalStructure, setFinalStructure] = useState([]);
  const { width: windowWidth } = Dimensions.get('window');
  const [modalVisibleBill, setModalVisibleBill] = useState(false);

  console.log('===============orderDetail=====================');
  console.log(JSON.stringify(stockDeductBaseData,null,2));
  console.log('===============================================');

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

   const generateStructure = () => {
    const result = stockDeductBaseData.map((stockItem) => {
      // Extract stock_id from the first stock_data element
      const stockId = stockItem?.stock_data?.[0]?.stock_id;
      const prodId = stockItem?.production_id;
  
      // Get the rows for this production_id
      const excessRows = rows[stockItem.production_id] || [];
  
      // Map the rows to the desired structure
      const excessDimension = excessRows.map((row) => ({
        dimension: row.input1,
        weight: row.input2,  
        qty: row.input3,   
      }));
  
      // Return the structured object if stock_id exists and rows are non-empty
      return {
        stock_id: stockId,
        production_id: prodId,
        excess_dimension: excessDimension,
      };
    });
  
    // Filter out entries where stock_id is missing or excess_dimension is empty
    const filteredResult = result.filter(
      (item) => item.stock_id && item.excess_dimension.length > 0
    );
    setFinalStructure(filteredResult);
    setModalVisible3(false);
  };

  const handleUpdateClick = (item) => {
    setStockDeductBaseData(item?.production_data);
    setModalVisible3(true);
    setSelectedItemName(item?.name);
  };

  const ModelVisible = (name) => {
     setModalVisible1(true);
     setSelectedItemName(name)
  };

  const ModelVisible1 = (name ,data) => {
    setModalVisible2(true);
    setSelectedItemName(name);
    setProductionData(data);
 };

  const addRow = (productionId) => {
    setRows((prevRows) => ({
      ...prevRows,
      [productionId]: [...(prevRows[productionId] || []), { input1: '', input2: '', input3: '' }],
    }));
  };

  
  const deleteRow = (productionId, index) => {
    setRows((prevRows) => {
      const rowsForProduction = prevRows[productionId] || [];
      if (rowsForProduction.length === 1) {
        // Reset the single row instead of deleting
        return {
          ...prevRows,
          [productionId]: [{ input1: '', input2: '', input3: '' }],
        };
      }
  
      // Remove the row if there are multiple
      return {
        ...prevRows,
        [productionId]: rowsForProduction.filter((_, i) => i !== index),
      };
    });
  };


  const deleteItem = (productionId) => {
    // Filter out the item with the matching production_id
    const updatedData = stockDeductBaseData.filter(item => item.production_id !== productionId);
    setStockDeductBaseData(updatedData);
  };
  
  useEffect(() => {
    if (products1) {
        const transformedItems = products1.map(item => ({
            ...item,
            quantity: item.qty,        
            cust_price: item.price*100,
            id:item.product_id,
            idd:item.id
        }));
        setselectedItems(transformedItems);
    }
}, [products1]);


useEffect(() => {
  if (modalVisible3) {
    const updatedRows = { ...rows };
    (stockDeductBaseData || []).forEach((item) => {
      if (!updatedRows[item.production_id]) {
        updatedRows[item.production_id] = [
          { input1: '', input2: '', input3: '', error: false, errorMessage: '' },
        ];
      }
    });
    setRows(updatedRows);
  }
}, [modalVisible3, stockDeductBaseData]);

console.log('===================finalStructure=================');
console.log(finalStructure);
console.log('====================================');


// Compeleting the Production Update Stock for Base Plate
const CompaleteProductionAPI = () => { 

  if (finalStructure.length === 0) {
    Alert.alert("Validation Error", "Please fill in the necessary data.");
    return;
  }

  // Display a confirmation dialog
  const isEmptyDimension = finalStructure.some((item) =>
  item.excess_dimension.some(
    (dim) => dim.dimension === "" || dim.weight === "" || dim.qty === ""
  )
);

if (isEmptyDimension) {
  Alert.alert("Validation Error", "Please fill in all dimension fields before proceeding.");
  return;
}
  
  Alert.alert("Update Stock", "Are you sure you want to add this Stock to Inventory?", [
    {
      text: "Cancel",
      onPress: () => console.log("Cancel Pressed"),
      style: "cancel",
    },
    {
      text: "Yes",
      onPress: () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${userData.token}`);

        var raw = JSON.stringify({
          order_id: orderDetails?.id,
          dimensions:finalStructure
        });

        console.log('================raw==========================');
        console.log(raw);
        console.log('=============================================');

        var requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow",
        };

        fetch(
          `https://gsidev.ordosolution.com/api/base_production_v1/`,
          requestOptions
        )
          .then((response) => {
            console.log("🚀 ~ .then ~ response:", response)
            if (response.status === 200 || response.status === 201) {
              Toast.show("Stock Updated successfully", Toast.LONG);
              navigation.goBack();
            }else{
              Toast.show("Something went wrong, Please try again", Toast.LONG);
            }
          })

          .catch((error) => console.log("api error", error));
      },
    },
  ]);
};


  return (
    <PaperProvider>
    <View style={{ flex: 1, padding: 24, backgroundColor: "white" }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require("../../assets/images/Refund_back.png")}
            style={{ height: 30, width: 30, tintColor: Colors.primary }}
          />
        </TouchableOpacity>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center"}}
        >
          {screen === "PO" ? (
            <Text
              style={{
                fontSize: 20,
                color: Colors.primary,
                fontFamily: "AvenirNextCyr-Medium",
                flex:1,
                textAlign:'center'
              }}
              numberOfLines={2}
            >
              {orderDetails?.name} ({orderDetails?.supplier_name}-
              {orderDetails?.supplier_id})
            </Text>
          ) : (
            <View
          style={{ flexDirection:'row' }}
        >
            <Text
              style={{
                fontSize: 20,
                color: Colors.primary,
                fontFamily: "AvenirNextCyr-Medium",
                flex:1,
                textAlign:'center'
              }}
              numberOfLines={2}
            >
              {orderDetails?.name} ({orderDetails?.assignee_name}-
              {orderDetails?.assigne_to})
            </Text>
            </View>
          )}
        </View>
        <View></View>
      </View>

      <View style={styles.card}>         
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: "5%",
            paddingTop: "5%",
            alignItems: "center",
          }}
        >
          <Text style={styles.cardTitle}>Order Details</Text>
          <View
            style={{
              paddingHorizontal: "4%",
              paddingVertical: "2%",
              backgroundColor:
                orderDetails?.status === "Stock Approved"
                  ? "orange"
                  : orderDetails?.status === "Missing Product"
                  ? "tomato"
                  : "green",
              borderRadius: 20,
            }}
          >
            <Text
              style={{
                fontFamily: "AvenirNextCyr-Medium",
                fontSize: 14,
                color: "white",
              }}
            >
              {orderDetails?.status === "Cancel"
                ? "Canceled"
                : orderDetails?.status === "In Transit"
                ? "In Transit"
                : orderDetails?.status}
            </Text>
          </View>
        </View>

        <View style={styles.expandedContent}>
          <View style={{ paddingHorizontal: "5%", paddingBottom: "2%" }}>
          <View style={styles.row}>
              <Text style={styles.title}>
                Bill to
              </Text>
              <Text style={[styles.value,{textAlign:'right',width:'72%'}]}>
                {orderDetails?.company_name}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.title}>Order ID</Text>
              <Text style={styles.value}>{orderDetails?.name}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.title}>
                {screen === "PO" ? "Supplier" : "Customer"}
              </Text>
              <Text style={[styles.value,{textAlign:'right',width:'72%'}]}>
                {screen === "PO"
                  ? orderDetails?.supplier_name
                  : orderDetails.assignee_name}
              </Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.title}>Order Placed</Text>
              <Text style={styles.value}>
                {ConvertDateTime(orderDetails?.created_at).formattedDate}{" "}
                {ConvertDateTime(orderDetails?.created_at).formattedTime}
              </Text>
            </View>

                 <View style={{...styles.row}}>
                   <Text style={{...styles.title}}>Site Address</Text>
                   <Text style={{...styles.value,flex:1, textAlign: 'right'}} numberOfLines={2}>{orderDetails?.site_address}</Text>
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
             <Text style={styles.title}>Transportation type</Text>
             <Text style={styles.value}>{orderDetails?.transportation_type}</Text>
             </View>

            {orderDetails.status == "Confirmed" &&
            <View style={styles.row}>
              <Text style={styles.title}>Approved By</Text>
               <Text style={styles.value}>{orderDetails?.stock_approve_name}</Text> 
            </View>
           }

        <View style={styles.row}>
              <Text style={styles.title}>Total Price</Text>
               <Text style={styles.value}>{orderDetails?.total_price?
         new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(orderDetails?.total_price)) :
         new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(0)
       }</Text> 
            </View>

            {orderDetails.status == "Missing Product" && orderDetails?.remarks &&(
              <View style={styles.row}>
                <Text style={styles.title}>Remark :</Text>
                <Text
                  style={[
                    styles.value,
                    { color: "red", width: "80%", textAlign: "right" },
                  ]}
                >
                  {orderDetails.remarks}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>

      <View
        style={[styles.card1, { marginBottom: "10%", paddingHorizontal: "3%" }]}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: "5%",
            paddingVertical: "3%",
            borderBottomWidth: 1,
            borderBottomColor: "grey",
          }} >
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
              }} >
                <Text style={{ color: "white", fontFamily: "AvenirNextCyr-Bold" }}>
                    Comments
                </Text>
            </TouchableOpacity>
            </View>

        <View style={styles.ProductListContainer}>

        {orderDetails.status === "Stock Approved" || orderDetails.status === "Missing Product"  ?

        <FlatList
          showsVerticalScrollIndicator={false}
          data={selectedItem}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <View style={styles.elementsView}>
              <View style={{ flexDirection: "row", justifyContent: "center" }} >
              <Pressable style={{}}>
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

      </Pressable>
                <View
                  style={{
                    flex: 1,
                    paddingLeft: 15,
                  }} >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text
                      style={{
                        color: Colors.primary,
                        fontSize: 14,
                        fontFamily: "AvenirNextCyr-Medium",
                        marginTop: 5,
                        width: "80%",
                      }}
                    >
                      {item.name}
                    </Text>
                
                  </View>

                    {
                      item?.product_remarks && (
                      <View style={{ flexDirection: 'row',justifyContent:'space-between'}}>
                      <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}>Product Remark :  </Text>
                      <Text style={{ color: 'green', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium',width:'55%'}}>{item?.product_remarks}</Text>
                       </View>
                     )
                    }

                  {orderDetails.status == "Confirmed" && item.stock_comments && (
                     <View style={{ marginTop: "1%" }}>
                     <Text
                       style={{
                         color: "black",
                         fontSize: 13,
                         fontFamily: "AvenirNextCyr-Medium",
                       }}
                     >
                       Remarks: {item.stock_comments}
                     </Text>
                   </View>
                    )}
                  {item.remarks &&
                    <View style={{ marginTop: "1%" }}>
                      <Text
                        style={{
                          color: "black",
                          fontSize: 13,
                          fontFamily: "AvenirNextCyr-Medium",
                        }}
                      >
                        Remarks: {item.remarks}
                      </Text>
                    </View>
                 }
                </View>
              </View>
              <View
                           style={{
                               flexDirection: "row",
                               justifyContent: "space-between",
                               alignItems: "center",
                           }}
                       >
                           <View  style={{
                          flexDirection: "row",
                          alignItems:"center",
                          gap: 2,
                      }}>
  
                      <Text style={{color: "black", fontSize: 14,}}>Required Qty:</Text>
                      <TextInput
                          style={{
                              fontSize: 14,
                              fontFamily: "AvenirNextCyr-Medium",
                              textAlign: "center",
                              height: 26,
                              justifyContent: "center",
                              padding: 1,
                              color: "black",
                          }}
                          value={item.quantity !== '' ? item.quantity.toString() : "0"}
                          onChangeText={(text) =>
                              handleQuantityChange(item, text)
                          }
                          keyboardType="numeric"
                          editable={false}
                        />
                     <Text
                      style={{
                        color: 'black',
                        fontSize: 12,
                        fontFamily: "AvenirNextCyr-Medium",
                      }}
                    >
                     {item?.loaded_uom}
                    </Text>

                            </View>
                              <TouchableOpacity style={{ height: 32,
                                paddingHorizontal: 5,
                                borderRadius: 10,
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor: item?.product_array?.length > 0 ? 'rgba(0, 128, 0, 0.6)'  :Colors.primary ,
                                flexDirection:'row',
                                gap:3}}  onPress={()=>{ModelVisible(item?.loaded_uom ,item?.product_id,item?.name,item?.quantity)}}  disabled={isUpdating[item?.product_id]}>
                                 {isUpdating[item.product_id] ? (
                                   <ActivityIndicator size="small" color="#fff" />
                                 ) : (
                                  <Text style={{color:'white', fontSize:11, fontFamily: "AvenirNextCyr-Bold"}}>{item?.product_array?.length > 0 ? 'Stock Added' :'Add Stock'}</Text>
                                 )}
                               </TouchableOpacity>
                             </View>

                             {item?.product_array && item?.product_array?.some(items => items?.isSelected) &&                              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' ,marginTop:2}}>
                <Text style={{ color: Colors.black, fontSize: 14, fontFamily: 'AvenirNextCyr-Bold',width:'85%' ,fontStyle: 'italic'}}>Products</Text>
                    {/* Ant Design arrow down icon */}
                    <Pressable onPress={() => toggleExpand(item.id)}>
                      <AntDesign name={expandedOrder === item.id ? 'up' : 'down'} size={20} color='black' />
                    </Pressable>
                  </View>
}


{ expandedOrder === item.id && (
  <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
  <View style={{ width: 500 }}>
    <View style={{ marginTop: 8 }}>
      {/* Heading Row */}
      <View style={{ ...styles.productContainer, borderBottomWidth: 0.7, borderColor: 'black', paddingVertical: 8 }}>
        <Text style={styles.productHeading}>Qty</Text>
        <Text style={styles.productHeading}>UOM</Text>
        <Text style={styles.productHeading}>Price</Text>
        <Text style={styles.productHeading}>Pieces</Text>
        <Text style={styles.productHeading}>Batch Code</Text>
      </View>

      {/* Product Rows */}
      {item?.product_array
          .filter(items => items?.isSelected) 
          .map((itemm, index) => (
            <View key={item.stock_id}>
          <View style={styles.productContainer}>
            <Text style={styles.productName}>{itemm?.qty}</Text>
            <Text style={styles.productName}>{getLabelById(itemm?.uom)}</Text>
            <Text style={styles.productName}>{itemm?.price}</Text>
            {/* <Text style={styles.productName}>{itemm?.total_weight}</Text> */}
            <Text style={styles.productName}>{itemm?.pieces}</Text>
            <Text style={styles.productName}>{itemm?.batch_code}</Text>
          </View>

          {/* Line between products except the last one */}
              {index < item?.product_array?.filter(itemm => itemm.isSelected).length - 1 && (
                <View style={styles.separator} />
              )}
        </View>
      ))}
    </View>
  </View>
</ScrollView>
                  )}
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
        />
          :
          <FlatList
          showsVerticalScrollIndicator={false}
          data={products1}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <View style={styles.elementsView}>
              <View
                style={{ flexDirection: "row", justifyContent: "center" }}
              >
                <Pressable>
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
                </Pressable>
                <View
                  style={{
                    flex: 1,
                    paddingLeft: 15,
                    marginLeft: 10,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text
                      style={{
                        color: Colors.primary,
                        fontSize: 14,
                        fontFamily: "AvenirNextCyr-Medium",
                        marginTop: 5,
                        width: "60%",
                      }}
                    >
                      {item.name}
                    </Text>
                    {
                      orderDetails.excess_stock_add === false &&
                    <TouchableOpacity 
                        style={{ height: 32,
                          paddingHorizontal: 5,
                          borderRadius: 10,
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: item?.availableStock ? 'rgba(0, 128, 0, 0.6)':Colors.primary ,
                          flexDirection:'row',
                          gap:3 }}
                          onPress={()=>{handleUpdateClick(item)}}>
                        <Text style={{color:'white', fontSize:11, fontFamily: "AvenirNextCyr-Bold"}}>Update</Text>
                     </TouchableOpacity>
                    }
                      {
                      orderDetails.excess_stock_add === true &&
                    <TouchableOpacity 
                        style={{ height: 32,
                          paddingHorizontal: 5,
                          borderRadius: 10,
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: item?.availableStock ? 'rgba(0, 128, 0, 0.6)':Colors.primary ,
                          flexDirection:'row',
                          gap:3 }}
                          onPress={()=>{ModelVisible1(item?.name,item?.production_data)}}>
                        <Text style={{color:'white', fontSize:11, fontFamily: "AvenirNextCyr-Bold"}}>View</Text>
                     </TouchableOpacity>
                    }

                  </View>
                      <Text
                        style={{
                          color: "gray",
                          fontSize: 11,
                          fontFamily: "AvenirNextCyr-Medium",
                          marginTop:2
                        }}
                      >
                        {item?.product_category} 
                      </Text>
                   <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: "3%",
                      justifyContent: "space-between",
                    }}
                  >
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Text
                        style={{
                          color: "black",
                          fontSize: 12,
                          fontFamily: "AvenirNextCyr-Medium",
                        }}
                      >
                        Qty :{" "}
                      </Text>
                      <Text
                        style={{
                          color: "black",
                          fontSize: 12,
                          fontFamily: "AvenirNextCyr-Medium",
                        }}
                      >
                        {item?.qty} {item?.loaded_uom}
                      </Text>
                    </View>

                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}>
                      <Text
                        style={{
                          color: "black",
                          fontSize: 12,
                          fontFamily: "AvenirNextCyr-Medium"
                          }}>
                        Price :{" "}
                      </Text>
                      <Text
                        style={{
                          color: "black",
                          fontSize: 12,
                          fontFamily: "AvenirNextCyr-Medium"
                          }}>
                        {item.price}
                      </Text>
                    </View>
                  </View>
                  {
                      item?.product_remarks && (
                      <View style={{ flexDirection: 'row',justifyContent:'space-between'}}>
                      <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}>Product Remark :</Text>
                      <Text style={{ color: 'green', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium',width:'55%'}}>{item?.product_remarks}</Text>
                      </View>
                      )
                  }
                  {orderDetails.status == "Confirmed" && item?.stock_comments && (
                     <View style={{ marginTop: "1%" }}>
                     <Text
                       style={{
                         color: "black",
                         fontSize: 13,
                         fontFamily: "AvenirNextCyr-Medium",
                       }}
                     >
                       Stock Remarks: {item?.stock_comments}
                     </Text>
                   </View>
                    )}
                </View>
              </View>
            </View>
          )}
          // keyExtractor={(item) => item.id.toString()}
        /> 
        }
        </View>
      </View>

      {orderDetails.excess_stock_add === false && (
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            onPress={() => {
              CompaleteProductionAPI();
            }}
            style={{
              backgroundColor: "green",
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              paddingVertical: "3%",
              borderRadius: 20,
            }}
          >
            <Text style={styles.Btext}>Update Excess Stock</Text>
          </TouchableOpacity>
        </View>
      )}


  <Modal visible={modalVisible3} transparent>
    <View style={styles.modalContainer1}>
      <View style={styles.modalContent11}>
        <TouchableOpacity style={styles.closeIcon} onPress={() => setModalVisible3(false)}>
          <AntDesign name="close" color="black" size={25} />
        </TouchableOpacity>

        <Text style={styles.ModalText1}>{selectedItemName}</Text>

        <View style={{ marginHorizontal: '1%', marginTop: '3%', gap: 10 }}>
          <FlatList
            data={stockDeductBaseData || []}
            keyExtractor={(item, index) => item?.production_id?.toString() || index.toString()}
            style={{ maxHeight: '87%' }}
            renderItem={({ item }) => {
              // Check if the stock_data contains items with the same stock_id and base_identifier is true
              const isSameStock = item.stock_data.some(
                (stockItem) => stockItem.base_identifier && stockItem.stock_id === item.stock_data[0]?.stock_id
              );

              const stockId = item.stock_data[0]?.stock_id;
          
              return (
              <View style={styles.container}>

               <View style={{flexDirection:'row',justifyContent:"space-between",alignItems:"center"}}>
               {isSameStock ? (
  <Text style={{ fontSize: 14, color: 'green', fontFamily: 'AvenirNextCyr-Bold' }}>
    Same Stock - {stockId}
  </Text>
) : (
  <Text></Text>
)}

                  {stockDeductBaseData?.length > 1 && (
                    <TouchableOpacity
                      onPress={() => deleteItem(item.production_id)}
                      style={{ padding: 5, backgroundColor: 'red', borderRadius: 5 }}
                    >
                      <Text style={{ color: 'white', fontFamily: 'AvenirNextCyr-Medium' }}>Delete</Text>
                    </TouchableOpacity>
                  )}
                  </View>
                <View style={[styles.row1, {justifyContent: 'space-between', width: '98%' }]}>
                  <Text style={styles.boldText1}>LENGTH</Text>
                  <Text style={styles.boldText1}>WIDTH </Text>
                  <Text style={styles.boldText1}>THICKNESS</Text>
                  <Text style={styles.boldText1}>NOS</Text>
                </View>

                <View style={[styles.row1, {justifyContent: 'space-between', width: '98%' }]}>
                  <Text style={styles.boldText}>{item?.height_inch}</Text>
                  <Text style={styles.boldText}>{item?.width_ft}</Text>
                  <Text style={styles.boldText}>{item?.thickness}</Text>
                  <Text style={styles.boldText}>{item?.nos}</Text>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ fontSize: 16, color: Colors.black, fontFamily: 'AvenirNextCyr-Medium' }}>
                    Add Excess Stock
                  </Text>
                  <TouchableOpacity
                    onPress={() => addRow(item.production_id)}
                    style={{ padding: 5, backgroundColor: 'green', marginVertical: 6, alignItems: 'center', borderRadius: 5 }}
                  >
                    <Text style={{ color: 'white' }}>Add Row</Text>
                  </TouchableOpacity>
                </View>

                
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ width:440}} >
                <View style={{flexDirection:'column'}}>
                <View style={[styles.row1, { justifyContent: 'space-between',}]}>
                  <Text style={[styles.boldText1,{marginRight:'27%'}]}>DIMENSION</Text>
                  <Text style={[styles.boldText1,{marginRight:'9%'}]}>WEIGHT(KG)</Text>
                  <Text style={[styles.boldText1,{marginRight:'18%'}]}>QTY</Text>
                </View>
                <FlatList
                  data={rows[item.production_id] || []}
                  keyExtractor={(row, index) => index.toString()}
                  renderItem={({ item: rowItem, index }) => (
                    <View key={index} style={{ flexDirection: 'row', marginBottom: 10, alignItems: 'center', width: '100%', gap: 10 }}>
                       <TextInput
                       style={{
                         borderWidth: 1,
                         padding: 5,
                         width: 180,
                         borderColor: rowItem.error ? 'red' : 'black',
                       }}
                       value={rowItem.input1}
                       placeholder="Length x Width x Thickness"
                       onChangeText={(text) => {
                       const dimensionRegex = /^\d+(\.\d+)?\s*[xX]\s*\d+(\.\d+)?\s*[xX]\s*\d+(\.\d+)?$/;
               
                         // Validate input
                         if (!dimensionRegex.test(text)) {
                           rowItem.error = true;
                           rowItem.errorMessage = 'Invalid format. Use: 1250 x 2300 x 0.5';
                         } else {
                           rowItem.error = false;
                           rowItem.errorMessage = '';
                         }

                        // Update value
                         rowItem.input1 = text;
                         // Trigger re-render for FlatList
                         const updatedRows = { ...rows };
                         updatedRows[item.production_id] = [...updatedRows[item.production_id]];
                         setRows(updatedRows);
                       }}
                     />
                     
                     <TextInput
                         style={{
                           borderWidth: 1,
                           padding: 5,
                           width: 97,
                           borderColor: rowItem.error ? 'red' : 'black',
                         }}
                         value={rowItem.input2}
                         placeholder="0.00"
                         keyboardType="numeric" // Ensures numeric input
                         onChangeText={(text) => {
                           // Update weight in rows
                           const updatedRows = { ...rows };
                           updatedRows[item.production_id][index].input2 = text;
                           setRows(updatedRows);
                         }}
                       />

                       <TextInput
                         style={{
                           borderWidth: 1,
                           padding: 5,
                           width: 80,
                           borderColor: rowItem.error ? 'red' : 'black',
                         }}
                         value={rowItem.input3}
                         placeholder="0.00"
                         keyboardType="numeric" // Ensures numeric input
                         onChangeText={(text) => {
                           // Update quantity in rows
                           const updatedRows = { ...rows };
                           updatedRows[item.production_id][index].input3 = text;
                           setRows(updatedRows);
                         }}
                       />

                      <TouchableOpacity
                        onPress={() => deleteRow(item.production_id, index)}
                        style={{ padding: 5 }}
                      >
                        <AntDesign name="delete" size={20} color="tomato" />
                      </TouchableOpacity>
                    </View>
                 )}
                 />
               </View>
             </ScrollView>
           </View>
         );
       }}
     />
        </View>

        <LinearGradient
          colors={Colors.linearColors}
          start={Colors.start}
          end={Colors.end} 
          locations={Colors.ButtonsLocation}
          style={{
            borderRadius: 20,
            marginTop: '4%',
          }}
        >
          <TouchableOpacity
            onPress={generateStructure}
            style={{
              paddingVertical: '4%',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {isUpdating ? (
              <ActivityIndicator size={28} color={Colors.white} />
            ) : (
              <Text style={{ fontFamily: 'AvenirNextCyr-Bold', color: 'white' }}>Submit</Text>
            )}
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </View>
  </Modal>

  <Modal visible={modalVisible2} transparent>
  <View style={styles.modalContainer1}>
    <View style={[styles.modalContent11, { width: '95%' }]}>
      <TouchableOpacity style={styles.closeIcon} onPress={() => setModalVisible2(false)}>
        <AntDesign name="close" color="black" size={25} />
      </TouchableOpacity>

      <Text style={styles.ModalText1}>{selectedItemName}</Text>
      
      <FlatList
        showsVerticalScrollIndicator={false}
        data={productionData}
        keyExtractor={(item) => item.production_id.toString()}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
          
             {item.production_excess_stock.length > 0 && (
              <>
            <Text style={[styles.boldText1,{fontSize :18}]}>{item.height_inch} X {item.width_ft} X  {item.thickness} MM - {item.nos}</Text>

               <Text style={styles.sectionHeader}>Stock Data:</Text>
               {item.stock_data.map((stock, index) => (
                <View key={index} style={styles.stockItem}>
                <Text style={styles.itemText}>Batch Code: {stock.batch_code || "N/A"}</Text>
                <Text style={styles.itemText}>Qty: {stock.qty} {stock.uom}</Text>
               </View>
               ))}
                <Text style={styles.sectionHeader}>Excess Stock:</Text>
                {item.production_excess_stock.map((stock, index) => (
                  <View key={index} style={styles.stockItem}>
                    <Text style={styles.itemText}>Dimension: {stock.dimension}</Text>
                    <Text style={styles.itemText}>Weight: {stock.og_weight} Kg</Text>
                    <Text style={styles.itemText}>Qty: {stock.og_qty} NOS</Text>
                  </View>
                ))}
                <View style={{  borderBottomWidth: 1, borderColor: '#ccc',marginTop:'3%'}}></View>
              </>
            )}
          </View>
        )}
      />
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
        style={{ flex: 1 }} >
        {orderDetails?.order_images?.length > 0 ? (
          orderDetails?.order_images.map((imageUri, index) => (
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
          <View style={{alignSelf:'center',}}>
          <Text 
            style={{
              fontFamily: 'AvenirNextCyr-Medium',
              fontSize: 16,
              color: 'black',
            }}>                                  No Image</Text>
        </View>
        
        )}
      </ScrollView>
    </View>
  </View>
</Modal>

    <LoadingView visible={loading} message="Please Wait ..." />

          {isCommentsModalVisible && (
           <Comments
             route={{ params: { orderId: orderDetails?.id } }}
             isModal={true}
             onClose={() => setIsCommentsModalVisible(false)}
           />
          )}
    </View>
    </PaperProvider>
  );
};

export default ProductionAccessDetails;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    fontFamily: "AvenirNextCyr-Medium",
    fontSize: 14,
    color:"black"
  },
  value: {
    fontFamily: "AvenirNextCyr-Medium",
    fontSize: 15,
    color:"black"
  },
  imageView: {
    width: 70,
    height: 70,
    color:"black"
  },
  elementsView: {
    paddingVertical: "3%",
    borderBottomColor: "grey",
    borderBottomWidth: 0.5,
  },
  ProductListContainer: {
    flex: 1,
    marginVertical: "4%",
  },
  salesContainer: {
    marginHorizontal: 16,
    padding: 10,
    backgroundColor: Colors.white,
    flexDirection: "row",
    alignItems: "center",
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
    fontFamily: "AvenirNextCyr-Medium",
  },
  label: {
    fontSize: 16,
    color: Colors.black,
    fontFamily: "AvenirNextCyr-Medium",
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
    fontFamily: "AvenirNextCyr-Medium",
  },
  subHeading: {
    fontSize: 13,
    color: "grey",
    fontFamily: "AvenirNextCyr-Medium",
  },
  card: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginVertical: "5%",
    backgroundColor: "#F5F5F5",
  },
  card1: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#F5F5F5",
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontFamily: "AvenirNextCyr-Bold",
    color:"black"
  },
  expandedContent: {
    marginTop: 20,
  },
  avatarImageContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderColor: "grey",
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
    borderColor: "grey",
    overflow: "hidden",
  },
  modalContainer1: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent1: {
    backgroundColor: "white",
    borderRadius: 10,
    paddingVertical: 30,
    paddingHorizontal: 10,
    flex:1,
    marginHorizontal:'3%',
    marginVertical:'5%'

  },itButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 8,
    marginLeft: 15,
    marginRight: 15,
  },
  submitButton1: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "AvenirNextCyr-Medium",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
  },
  inputView: {
    width: "100%",
    borderWidth: 1,
    backgroundColor: "white",
    borderRadius: 8,
    height: "2%",
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
    fontFamily: "AvenirNextCyr-Medium",
  },
  inputText1: {
    fontFamily: "AvenirNextCyr-Medium",
    color: "black",
  },
  addressInput: {
  },
  TwoButtons: {
    paddingVertical: "4%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
  },
  Btext: {
    color: "white",
    fontFamily: "AvenirNextCyr-Bold",
    fontSize: 17,
  },
  button: {
    backgroundColor: "transparent",
  },
  selectedButton: {
    backgroundColor: Colors.primary,
  },
  label: {
    fontSize: 13,
    color: Colors.black,
    fontFamily: "AvenirNextCyr-Medium",
  },
  selectedLabel: {
    fontSize: 13,
    color: "white",
    fontFamily: "AvenirNextCyr-Medium",
  },
  description: {
    marginTop: 10,
    color: "#6C757D",
    fontSize: 14,
    marginHorizontal: "1%",
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
  },
  productsContainer: {
    paddingHorizontal: 10,
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
    marginTop:'3%'
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
  },
    noDataText: {
    textAlign: "center",
    marginTop: 20,
    color: "grey",
    fontSize: 16,
  },
    modalSearchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "lightgray",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    flex: 1,
    height: 45,
  },
    modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    paddingHorizontal: 1,
  },
  modalContent: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 10,
    borderRadius: 8,
    marginTop: '16%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalTitle: {
    alignSelf: 'center',
    fontSize: 20,
    color: Colors.primary,
    marginVertical: 10,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: "blue",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: "flex-end",
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
  },
    ModalText1: {
    fontSize: 14,
    fontFamily: 'AvenirNextCyr-Bold',
    paddingBottom: 5,
    color:Colors.primary,
    width:'70%'
  },
    closeIcon: {
    position: 'absolute',
    top: 5,
    right: 10,
    padding: 5,
  },
       buttonContainer: {
        height: 40,
        padding: 10,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor:'#65A765',
        marginRight:'5%',
        width:'30%',
        flexDirection:'row',
        gap:3
      },
      buttonText: {
        fontFamily: "AvenirNextCyr-Bold",
        color: "white",
      },  rowBack: {
        alignItems: 'center',
        flex: 1,
        // flexDirection: 'row',
        // justifyContent: 'space-between',
        // paddingLeft: 15,
      },
      backRightBtn: {
        alignItems: 'center',
        bottom: 10,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        // width: 75,
        right: 40,
      },backRightBtn1: {
        alignItems: 'center',
        bottom: 10,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        // width: 75,
        right: 0,
      }, closeIcon: {
        position: 'absolute',
        top: 5,
        right: 10,
        padding: 5,
      },checkboxContainer: {
        justifyContent: 'center', 
        alignItems: 'center', 
        flex: 1, 
      },
        productName: {
    color: Colors.black,
    fontSize: 13,
    fontFamily: 'AvenirNextCyr-Medium',
    flex: 1,
    flexWrap: 'wrap'
  },
  productQty: {
      flex: 1,
    textAlign: 'center',
    color: Colors.black,
    fontSize: 13,
    fontFamily: 'AvenirNextCyr-Medium',
    marginRight:10
  },
    productSeparator: {
    borderBottomWidth: 0.7,
    borderBottomColor: '#A9A9A9',
    marginVertical:'3%'
  },
   productValue: {
    flex: 1,
    textAlign: 'center',
     color: Colors.black,
    fontSize: 13,
    fontFamily: 'AvenirNextCyr-Medium',
    flexWrap: 'wrap'

  },
    productContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  productHeading: {
    color: Colors.black,
    fontSize: 13,
    fontFamily: 'AvenirNextCyr-Bold',
    flex:1
  }, fabStyle: {
    position: "absolute",
    right: "5%",
    bottom: "10%",
    backgroundColor: Colors.primary,
  },modalContainer2: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent2: {
    backgroundColor: "white",
    borderRadius: 10,
    paddingVertical: 30,
    paddingHorizontal: 10,
    flex:1,
    marginHorizontal:'3%',
    marginVertical:'5%'
  },
  ModalText2: {
    fontSize: 15,
    fontFamily: 'AvenirNextCyr-Bold',
    paddingBottom: 5,
    color:Colors.primary,
  },modalContent11: {
    backgroundColor: "white",
    borderRadius: 10,
    paddingVertical: 30,
    paddingHorizontal: 10,
    flex:1,
    marginHorizontal:'3%',
    marginVertical:'5%',
    
}, container: {
  padding: 10,
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 5,
  backgroundColor: '#fff',
  marginBottom:'3%'
},
row1: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 10,
},
label: {
  fontSize: 14,
  color: '#000',
},
boldText: {
  fontFamily: 'AvenirNextCyr-Bold',
  fontWeight: 'bold',
  color:'black'
},
boldText1: {
  fontFamily: 'AvenirNextCyr-Bold',
  fontWeight: 'bold',
  color:Colors?.primary
},
input: {
  borderWidth: 1,
  borderColor: '#ccc',
  padding: 6,
  backgroundColor: '#fff',
  color: 'black',
  width: 80,
  textAlign: 'center',
}, ModalText1: {
  fontSize: 18,
  fontWeight: 'bold',
  marginBottom: 10,
},
itemContainer: {
  marginBottom: 20,
  // borderBottomWidth: 1,
  // borderColor: '#ccc',
  paddingBottom: 10,
},
itemText: {
  fontSize: 14,
  color: '#333',
},
sectionHeader: {
  fontSize: 16,
  fontWeight: 'bold',
  marginTop: 10,
},
stockItem: {
  marginLeft: 10,
},
});
