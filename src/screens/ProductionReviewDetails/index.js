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
  KeyboardAvoidingView,
  Dimensions,
  PermissionsAndroid, Platform
} from "react-native";
import Colors from "../../constants/Colors";
import { Image } from "react-native-animatable";
import globalStyles from "../../styles/globalStyles";
import AntDesign from "react-native-vector-icons/AntDesign";
import ConvertDateTime from "../../utils/ConvertDateTime";
import LinearGradient from "react-native-linear-gradient";
import { Checkbox } from "react-native-paper";
import { TextInput as TextInput1,Modal as PaperModal ,Portal ,PaperProvider ,DefaultTheme} from "react-native-paper";
import Toast from "react-native-simple-toast";
import { SegmentedButtons } from "react-native-paper";
import { LoadingView } from "../../components/LoadingView";
import Comments from '../../components/Comments';
import { WebView } from 'react-native-webview';
import Share from 'react-native-share';
import RNFS, { DocumentDirectoryPath, DownloadDirectoryPath } from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';

const ProductionReviewDetails = ({ navigation, route }) => {
  const orderDetail = route.params?.orderDetails;
  const [orderDetails, setOrderDetails] = useState(orderDetail);
  const screen = route.params?.screen;
  const [products1, setProducts1] = useState(route?.params?.orderDetails?.product_list );
  const [visible, setVisible] = useState(false);
  const [visible4, setVisible4] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [proRemarks, setProdRemarks] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAnyProductUnavailable, setIsAnyProductUnavailable] = useState(false);
  const [error, setError] = useState("");
  const [value, setValue] = useState("1");
  const [conRemarks, setConRemarks] = useState("");
  const [selectedItem, setselectedItems] = useState([]);
  const [modalVisible1, setModalVisible1] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [modalVisible3, setModalVisible3] = useState(false);
  const [rows, setRows] = useState([{ input1: '', input2: '', input3: '' }]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState(null); 
  const [isCommentsModalVisible, setIsCommentsModalVisible] = useState(false);
  const [modalVisibleBill, setModalVisibleBill] = useState(false);
  const [DispatchRemarks, setDispatchRemarks] = useState("");
  const [visible1, setVisible1] = useState(false);
  const [selectedItemName, setSelectedItemName] = useState('');
  const [totalFeet, setTotalFeet] = useState(0);
  const [totalNo, setTotalNo] = useState(0);
  const {userData } = useContext(AuthContext);
  const [visible3, setVisible3] = useState(false);
  const [visible5, setVisible5] = useState(false);
  const [productionViewData, setProductionViewData] = useState([]);
  const [productionViewDataStock, setProductionViewDataStock] = useState([]);
  const [productionViewDataStockWeight, setProductionViewDataStockWeight] = useState('');
  const [stockDeductData, setStockDeductData] = useState('');
  const [stockDeductBaseData, setStockDeductBaseData] = useState('');
  const [stockSelectionId, setStockSelectionId] = useState('');
  const [products, setProducts] = useState([]);
  const [userInputs, setUserInputs] = useState({});
  const [weightData, setWeightData] = useState({});
  const [finalStructure, setFinalStructure] = useState([]);
  const { width: windowWidth } = Dimensions.get('window');
  const containerStyle = {flex:1 ,height:'100%',width:'100%'};
  const hideModal11 = () => setVisible3(false);

  console.log('===============productionViewData=====================');
  console.log(JSON.stringify(productionViewData,null,2));
  console.log('====================================');

  const getRandomColorForStock = (stockId) => {
    const colors = [
      '#FFA07A',
      '#9df2ee', 
      '#b9d2eb', 
      '#FFD700', 
      '#70ffc8',
      '#FF4500',
      '#EEE8AA', 
      '#B0E0E6', 
      '#FFB6C1',
      '#F5FFFA',
      '#E6E6FA',
      '#FFDAB9',
      '#ADD8E6',
      '#8A2BE2',
      '#7FFF00',
      '#D2691E',
      '#6495ED',
      '#DC143C',
      '#00FFFF',
      '#F0E68C',
      '#90EE90',
    ];
     
    const colorIndex = stockId % colors.length; 
    return colors[colorIndex];
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



  const handleInputChange = (stockId, field, value) => {
    setUserInputs((prevInputs) => ({
      ...prevInputs,
      [stockId]: {
        ...prevInputs[stockId],
        [field]: value,
      },
    }));
  };

  const handleUpdateClick = (item) => {

    setStockDeductBaseData(item?.production_data);
    setModalVisible3(true);
    setSelectedItemName(item?.name);
    setStockSelectionId(item?.product_id);
  
    setFinalStructure((prevStructure) => {
      const existingProduct = prevStructure.find((p) => p.product_id === item?.product_id);
      if (existingProduct) {
        return prevStructure;
      } else {
        return [
          ...prevStructure,
          {
            product_id: item?.product_id,
            production_dimension: [] 
          }
        ];
      }
    });
  };

  // useEffect(() => {
  //   setModalVisible3(false);
  // }, [finalStructure]);

  // Function to handle weight changes
  const handleWeightChange = (production_id, weight) => {
    setWeightData((prevState) => ({
      ...prevState,
      [production_id]: weight
    }));
  };
  
  // Function to save the data
  const handleSavee = () => {
    console.log("clicked hereeee")
    const production_dimension = stockDeductBaseData?.map((item) => ({
      dimension: item.production_id,
      weight: parseFloat(weightData[item.production_id]) || 0
    }));

    // Check if any weight is 0 or null
      const invalidWeight = production_dimension.some(
        (item) => item.weight === 0 || isNaN(item.weight)
      );

      if (invalidWeight) {
        Alert.alert(
          "Invalid Input",
          "Weight cannot be 0 or empty. Please enter valid weights.",
          [{ text: "OK", onPress: () => console.log("OK Pressed") }]
        );
        return; // Stop execution if invalid weight found
     }
  
    setFinalStructure((prevStructure) =>
      prevStructure.map((product) =>
        product.product_id === stockSelectionId
          ? { ...product, production_dimension }
          : product
      )
    );
  
    // This log will show the state before the update due to React's async nature
    console.log("Final Payload (Before State Update):------------>", finalStructure);
    setModalVisible3(false);

  };
  
  const handleSave = () => {

    const isMissingValues = stockDeductData?.some((item) => {
      const consumedQty = userInputs[item.stock_id]?.consumed_qty;
      const consumedWeight = userInputs[item.stock_id]?.consumed_weight;
      return !consumedQty || !consumedWeight;
    });
  
    if (isMissingValues) {
      Alert.alert(
        "Invalid Input",
        "Please enter both quantity and weight.",
        [{ text: "OK", onPress: () => console.log("OK Pressed") }]
      );
      return; // Exit the function if validation fails
    }

    const productionStockDeduction = stockDeductData?.map((item) => ({
      stock_id: item?.stock_id,
      qty: userInputs[item.stock_id]?.consumed_qty || 0,
      weight: userInputs[item.stock_id]?.consumed_weight || 0,
    }));
  
    // Update the production_stock_deduction for the selected product
    const newProduct = {
      product_id: stockSelectionId,
      production_stock_deduction: productionStockDeduction,
    };
  
    // Check if the product already exists in the state
    const existingProductIndex = products.findIndex(
      (product) => product?.product_id === stockSelectionId
    );
  
    if (existingProductIndex !== -1) {
      // If product exists, update it
      const updatedProducts = [...products];
      updatedProducts[existingProductIndex] = newProduct;
      setProducts(updatedProducts);
    } else {
      // If product doesn't exist, add a new product with stock_deduction
      setProducts([...products, newProduct]);
    }

    setModalVisible2(false);
    console.log("Saving products data:", products);

  };
  

  const handleUpdate = (id ,stock) => {

    if (!id) {
      // Handle the case where stockSelectionId is null or invalid
      console.log("Invalid product ID");
      return;
    }
  
    const productionStockDeduction = stock?.map((item) => ({
      stock_id: item?.stock_id,
      qty: userInputs[item.stock_id]?.consumed_qty || 0,
      weight: userInputs[item.stock_id]?.consumed_weight || 0,
    }));
  
    const newProduct = {
      product_id: id,
      production_stock_deduction: productionStockDeduction,
    };
  
    // Check if the product already exists in the state
    const existingProductIndex = products.findIndex(
      (product) => product?.product_id === id
    );
  
    if (existingProductIndex !== -1) {
      // If product exists, update it
      const updatedProducts = [...products];
      updatedProducts[existingProductIndex] = newProduct;
      setProducts(updatedProducts);
    } else {
      // If product doesn't exist, add a new product with stock_deduction
      setProducts([...products, newProduct]);
    }
      // Open the modal after updating the products array
      setModalVisible2(true);
 
  };
  
  const handleCheckboxToggle = (production_id) => {
    // Toggle the production_done status for the selected item
    const updatedData = productionViewData?.map((item) =>
      item.production_id === production_id
        ? { ...item, production_done: !item.production_done }
        : item
    );
    setProductionViewData(updatedData);
  };

  // Check Box All
  const toggleCheckAll = () => {
    const allChecked = productionViewData?.every((item) => item?.production_done);
    const updatedData = productionViewData?.map((item) => ({
      ...item,
      production_done: !allChecked,
    }));
    setProductionViewData(updatedData);
  };


  const ModelVisible = (name) => {
     setModalVisible1(true);
     setSelectedItemName(name)
  };

  const addRow = () => {
    setRows([...rows, { input1: '', input2: '', input3: '' }]);
  };

  // Function to delete a specific row by index
  const deleteRow = (index) => {
    const updatedRows = rows.filter((_, i) => i !== index);
   setRows(updatedRows);
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


console.log("Products",products1)

const renderStockData = ({ item }) => (
  <View style={[styles.stockItem, styles.stockCard]}>
    <Text style={styles.stockLabel}>Quantity: <Text style={styles.stockValue}>{item.qty} {item.stock_uom}</Text></Text>
    <Text style={styles.stockLabel}>Batch Code: <Text style={styles.stockValue}>{item.batch_code || 'N/A'}</Text></Text>
  </View>
);


// Chnage the status to In Production 
const changeStatus = () => {
  // Display a confirmation dialog
  Alert.alert("Start Production", "Are you sure you want to Start the Production?", [
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
          status: "In Production",
        });

        var requestOptions = {
          method: "PUT",
          headers: myHeaders,
          body: raw,
          redirect: "follow",
        };

        fetch(
          `https://gsidev.ordosolution.com/api/production_status_changes/${orderDetails?.id}/`,
          requestOptions
        )
          .then((response) => {
            if (response.status === 200) {
              Toast.show("Production Started successfully", Toast.LONG);
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

const CompeleteProduction =()=> {

  if (orderDetails?.is_production === true && orderDetails?.product_list[0]?.name ==='BASE PLATE' ){
    // Base Plate Complete
    BasePlateCompleteProduction();
  }else{
    // PPGL Coil Complete
    CompaleteProductionAPI();
  }

}


// Compeleting the Production API For PPGL Coil
const CompaleteProductionAPI = () => {
  // Display a confirmation dialog
  // if (!products || products.length === 0) {
  //   Alert.alert("Error", "Please enter the consumed weight and try again.");
  //   return;
  // }

  const hasEmptyValues = products.some((product) =>
    product.production_stock_deduction.some(
      (deduction) => !deduction.qty || !deduction.weight
    )
  );
  
  if (hasEmptyValues) {
    Alert.alert("Error", "Please enter the consumed quantity and weight for all items.");
    return;
  }
  
  
  Alert.alert("Warning", "Please mark all items as completed before finalizing the production.", [
    {
      text: "Cancel",
      onPress: () => console.log("Cancel Pressed"),
      style: "cancel",
    },
    {
      text: "Yes",
      onPress: () => {
        setIsUpdating(true);
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${userData.token}`);

        var raw = JSON.stringify({
          status: "Production Completed",
          production_remarks: proRemarks,
          stock_deduction: products
        });

        console.log('<==================> Raw <=======================>');
        console.log(raw);
        console.log('<================================================>');

        var requestOptions = {
          method: "PUT",
          headers: myHeaders,
          body: raw,
          redirect: "follow",
        };

        fetch(
          `https://gsidev.ordosolution.com/api/production_completion/${orderDetails?.id}/`,
          requestOptions
        )
          .then((response) => {

            if (response.status === 200) {
              console.log("error",error)
              Toast.show("Production Completed successfully", Toast.LONG);
              navigation.goBack();
              setIsUpdating(false);

            } else {

              setIsUpdating(false);
              Toast.show("Please mark production Completed for all the dimensions", Toast.LONG);
            }
          })

          .catch((error) =>{ console.log("api error", error);  setIsUpdating(false);});
      },
    },
  ]);
};


// Save the Checked Dimention Checklist
const SaveDimentionChecklist = () => {
  // Display a confirmation dialog

  Alert.alert("Mark as Completed", "Are you sure you want to mark it as Production Completed", [
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
          production_updates: productionViewData.map((item) => ({
            id: item?.production_id,
            production_done: item?.production_done,
          })),
        });
        
        var requestOptions = {
          method: "PUT",
          headers: myHeaders,
          body: raw,
          redirect: "follow",
        };

        fetch(
          `https://gsidev.ordosolution.com/api/production_done/bulk_update/`,
          requestOptions
        )
          .then((response) => {
            if (response.status === 200) {
              Toast.show("Production Record Saved", Toast.LONG);
              hideModal11();
            }else{
              Toast.show("Something went wrong, Please try again", Toast.LONG);
            }
          })
          .catch((error) => console.log("api error", error));
      },
    },
  ]);
};


const FetchDimentionData = async (id) => {

  console.log("🚀 ~ FetchDimentionData ~ id:", id);
  setProductionViewData([]);
  setProductionViewDataStock([]);
      
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", `Bearer ${userData.token}`);

  const raw = "";

  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  fetch(`https://gsidev.ordosolution.com/api/product_dimension_list/?productlist_id=${id}`, requestOptions)
    .then((response) => {
      return response.json()
    })
    
    .then(async (result) => {

        console.log(JSON.stringify(result, null, 2));
        console.log("🚀 ~ .then ~ result:------------------------>", result);

      if (result.error) {
        Alert.alert("Sorry", "No Products Available");
        setVisible3(true);
      } else {
        setProductionViewData(result[0].product_list[0].production_data);
        setProductionViewDataStock(result[0].product_list[0].roofing_stock_deduct_data);
        setProductionViewDataStockWeight(result[0].product_list[0].roofing_production_weight)
        setVisible3(true);
      }
    })
    .catch((error) => {
      Alert.alert("Sorry", "No Products Available");
      console.log("error", error);
    });
};


// Comaplete base Plate Production API 

const BasePlateCompleteProduction = () => {

  if (!finalStructure || finalStructure?.length === 0 || finalStructure?.some(item => !item?.production_dimension || item?.production_dimension?.length === 0)) {
    Alert.alert("Error", "Please enter the consumed weight and try again.");
    return;
  }

  // Display a confirmation dialog
  Alert.alert("Complete Production", "Are you sure you want to Complete the Production?", [
    {
      text: "Cancel",
      onPress: () => console.log("Cancel Pressed"),
      style: "cancel",
    },
    {
      text: "Yes",
      onPress: () => {
        setIsUpdating(true);
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${userData.token}`);

        var raw = JSON.stringify({
          status: "Production Completed",
          production_remarks:proRemarks, 
          stock_deduction: finalStructure
        });

        var requestOptions = {
          method: "PUT",
          headers: myHeaders,
          body: raw,
          redirect: "follow",
        };

        fetch(`https://gsidev.ordosolution.com/api/base_completion/${orderDetails?.id}/`,requestOptions )
          .then((response) => {
            if (response.status === 200) {
              Toast.show("Production Completed successfully", Toast.LONG);
              setIsUpdating(false);
              navigation.goBack();
            } else {
              setIsUpdating(false);
              Toast.show("Please mark production Completed for all the dimensions", Toast.LONG);
            }
          })

          .catch((error) => {console.log("api error", error); setIsUpdating(false);});
      },
    },
  ]);
};


  return (
    <PaperProvider theme={DefaultTheme} >
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
        style={[styles.card1, { marginBottom: "10%", paddingHorizontal: "3%" }]}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: "5%",
            paddingVertical: "3%",
            borderBottomWidth: 1,
            borderBottomColor: "grey",
          }}
        >
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
         {orderDetails.status === "Stock Approved" || orderDetails.status === "Missing Product"  ?

        <FlatList
          showsVerticalScrollIndicator={false}
          data={selectedItem}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <View style={styles.elementsView}>
              <View
                style={{ flexDirection: "row", justifyContent: "center" }}
              >
             <Pressable style={{}}>
         
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
                <View
                  style={{
                    flex: 1,
                    paddingLeft: 15,
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
                        width: "56%",
                      }}
                    >
                      {item.name}
                    </Text>

                    { orderDetails?.status === 'In Production' &&
                    <View style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      gap:5
                    }} >
                     <TouchableOpacity 
                        style={{ height: 32,
                          paddingHorizontal: 5,
                          borderRadius: 10,
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: item?.availableStock ? 'rgba(0, 128, 0, 0.6)':Colors.primary ,
                          flexDirection:'row',
                          gap:3 }}
                          onPress={()=>{ setSelectedItemName(item?.name); FetchDimentionData(item?.product_id);}}>
                        <Text style={{color:'white', fontSize:11, fontFamily: "AvenirNextCyr-Bold"}}>View</Text>
                     </TouchableOpacity>

                 { orderDetails?.is_production === true && item?.name !=='BASE PLATE' && (
                     <TouchableOpacity 
                        style={{ height: 32,
                          paddingHorizontal: 5,
                          borderRadius: 10,
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: item?.availableStock ? 'rgba(0, 128, 0, 0.6)':Colors.primary ,
                          flexDirection:'row',
                          gap:3 }}
                          onPress={()=>{setStockDeductData(item?.stock_deduct_data); setModalVisible2(true); setSelectedItemName(item?.name); setStockSelectionId(item?.product_id); handleUpdate(item?.product_id ,item?.stock_deduct_data);}}>
                        <Text style={{color:'white', fontSize:11, fontFamily: "AvenirNextCyr-Bold"}}>Update</Text>
                     </TouchableOpacity>
                 )}

                { orderDetails?.is_production === true && item?.name==='BASE PLATE' && (

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
                )}

                     </View>
                    }
                      
                  {(orderDetails.status === "Production Completed" || orderDetails.status === "Pending Production") && (
                  <TouchableOpacity 
                        style={{ height: 32,
                          paddingHorizontal: 5,
                          borderRadius: 10,
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: item?.availableStock ? 'rgba(0, 128, 0, 0.6)':Colors.primary ,
                          flexDirection:'row',
                          gap:3 }}
                          onPress={()=>{ setSelectedItemName(item?.name); FetchDimentionData(item?.product_id);}}>
                        <Text style={{color:'white', fontSize:11, fontFamily: "AvenirNextCyr-Bold"}}>View</Text>
                     </TouchableOpacity>
                   )}

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

                  {item?.stock_comments && item?.stock_comments !="None" && (
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

      {orderDetails.status == "Pending Production" && (
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            onPress={() => {
              changeStatus();
            }}
            style={{
              backgroundColor: "green",
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              paddingVertical: "3%",
              borderRadius: 20,
            }}
            disabled={isAnyProductUnavailable}
          >
            <Text style={styles.Btext}>Start Production</Text>
          </TouchableOpacity>
        </View>
      )}

{orderDetails.status == "In Production" && (
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            onPress={() => {
              setVisible4(true);
            }}
            style={{
              backgroundColor: "green",
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              paddingVertical: "3%",
              borderRadius: 20,
            }}
            disabled={isAnyProductUnavailable}
          >
            <Text style={styles.Btext}>Complete Production</Text>
          </TouchableOpacity>
        </View>
      )}

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
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: "3%",
              }}
            >
              <Text></Text>
              <TouchableOpacity
                onPress={() => {
                  setVisible(false), setRemarks(" "), setError("");
                }}
              >
                <AntDesign name="close" color="black" size={20} />
              </TouchableOpacity>
            </View>
            <SegmentedButtons
              value={value}
              onValueChange={setValue}
              buttons={[
                {
                  value: "1",
                  label: "Reject Remarks",
                  style: value === "1" ? styles.selectedButton : styles.button,
                  labelStyle:
                    value === "1" ? styles.selectedLabel : styles.label,
                },
                {
                  value: "2",
                  label: "Stock Remarks",
                  style: value === "2" ? styles.selectedButton : styles.button,
                  labelStyle:
                    value === "2" ? styles.selectedLabel : styles.label,
                },
              ]}
            />

            <View style={{ marginVertical: "4%" }}>
              <TextInput1
                mode="outlined"
                label="Remarks"
                value={value === "1" ? remarks : conRemarks}
                theme={{ colors: { onSurfaceVariant: "#4b0482" } }}
                activeOutlineColor="#4b0482"
                outlineColor="#B6B4B4"
                textColor="#4b0482"
                multiline={true}
                numberOfLines={4}
                onChangeText={(text) => {
                  value === "1" ? setRemarks(text) : setConRemarks(text);
                }}
                returnKeyType="next"
                blurOnSubmit={false}
                outlineStyle={{ borderRadius: 10 }}
              />
              {error ? <Text style={{ color: "red" }}>{error}</Text> : null}
              <Text style={styles.description}>
                {value === "1"
                  ? "( Please provide detailed remarks for rejecting the product.)"
                  : "( Please provide detailed remarks about the product.)"}
              </Text>
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
                style={{
                  paddingVertical: "4%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ fontFamily: "AvenirNextCyr-Bold", color: "white" }}
                >
                  Submit
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>
      </Modal>

  <Modal visible={modalVisible1} transparent
  >
   <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  >
 
  <View style={styles.modalContainer1}>
    <View style={styles.modalContent1}>

    <TouchableOpacity
    style={styles.closeIcon}
    onPress={() => setModalVisible1(false)}
  >
    <AntDesign name="close" color="black" size={25} />
  </TouchableOpacity>

<View style={{ marginHorizontal: '1%', marginTop: '3%', gap: 1 }}>
<View>

    <View  style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      <Text style={[styles.ModalText1]}>{selectedItemName}</Text>

      <TouchableOpacity onPress={addRow} style={{ padding: 10, backgroundColor: 'green', marginVertical: 10, alignItems: 'center', borderRadius: 10 }}>
      <Text style={{ color: 'white' }}>Add Row</Text>
    </TouchableOpacity>
      </View>
      <View style={{
          alignItems: 'center',
          borderBottomWidth: 1,
          borderBottomColor: '#D3D3D3',
          marginTop: '3%',
        }}>
      </View>
     </View>

         <ScrollView
           horizontal
           showsHorizontalScrollIndicator={false}
           contentContainerStyle={{ width:400}} >

        <View style={{ marginHorizontal: '1%', marginTop: '3%', gap: 1 }}>
          <View style={{ flexDirection: 'row', marginBottom: 10, alignItems: 'center', width: '100%', gap: 1}}>
          <View style={{ marginHorizontal: '1%', gap: 1 }}>
            <View style={{ flexDirection: 'row', marginBottom: 1, alignItems: 'center',gap: 5}}>
            <Text style={{ fontSize: 14, fontWeight: 'bold', textAlign: 'center', color: 'black',width:"18%" }}>FEET</Text>
            <Text style={{ fontSize: 14, fontWeight: 'bold', textAlign: 'center', color: 'black',width:"49%"}}>INCHES</Text>
            <Text style={{ fontSize: 14, fontWeight: 'bold', textAlign: 'center', color: 'black',width:"15%"}}>NOS</Text>
          </View>
              <View style={{ flexDirection: 'row', marginBottom: 10, alignItems: 'center', width: '100%', gap: 1 }}>
                <FlatList
                  data={rows}
                  renderItem={({ item, index }) => (
                    <View key={index} style={{ flexDirection: 'row', marginBottom: 10, alignItems: 'center', width: '100%', gap: 10 }}>
                      
                      <TextInput
                        style={{ borderWidth: 1, padding: 5,width: 100 }}
                        value={item.input1}
                        placeholder="0.00"
                        onChangeText={(text) => handleInputChange(index, 'input1', text)}
                      />

                      <TextInput
                        style={{ borderWidth: 1, padding: 5,width: 100}}
                        value={item.input2}
                        placeholder="0.00"
                        onChangeText={(text) => handleInputChange(index, 'input2', text)}
                      />

                      <TextInput
                        style={{ borderWidth: 1, padding: 5, width: 100 }}
                        value={item.input3}
                        placeholder="0.00"
                        onChangeText={(text) => handleInputChange(index, 'input3', text)}
                      />

                       <TouchableOpacity onPress={() => deleteRow(index)} style={{ padding: 5 }}>
                          <AntDesign name="delete" size={20} color="tomato" />
                        </TouchableOpacity>

                    </View>
                  )}
                />
              </View>
            </View>
            </View>
        </View>
         </ScrollView> 

         <View style={{ alignItems: 'center', marginTop: 5 }}>
            <Text style={{ fontSize: 16, fontFamily: "AvenirNextCyr-Bold", color: 'black' }}>Total Feet: {totalFeet}</Text>
            <Text style={{ fontSize: 16, fontFamily: "AvenirNextCyr-Bold", color: 'black' }}>Total NOS: {totalNo}</Text>
         </View>

      <LinearGradient
            colors={Colors.linearColors}
            start={Colors.start}
            end={Colors.end}
            locations={Colors.ButtonsLocation}
            style={{
              borderRadius: 20,
              marginTop: "3%",
            }} >
            <TouchableOpacity
              onPress={() => {

                }}
                style={{ paddingVertical: "4%", justifyContent: "center", alignItems: "center" }}>
              <Text style={{ fontFamily: "AvenirNextCyr-Bold", color: "white" }}>Submit</Text>
            </TouchableOpacity>
          </LinearGradient>
       </View>
     </View>
   </View>
  </KeyboardAvoidingView>
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


      <Modal visible={visible1} transparent={true}>
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
                style={{ fontFamily: "AvenirNextCyr-Medium", fontSize: 16 ,color:Colors.black}}
              >
                Add Remarks
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setVisible1(false);
                }}
              >
                <AntDesign name="close" color="black" size={20} />
              </TouchableOpacity>
            </View>
            <View style={{ marginVertical: "4%" }}>
              <TextInput1
                mode="outlined"
                label="Remarks"
                value={DispatchRemarks}
                theme={{ colors: { onSurfaceVariant: "#4b0482" } }}
                activeOutlineColor="#4b0482"
                outlineColor="#B6B4B4"
                textColor="#4b0482"
                multiline={true}
                numberOfLines={4}
                onChangeText={(text) => setDispatchRemarks(text)}
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
                onPress={()=>moveToCollection()}
                style={{
                  paddingVertical: "4%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                  <Text style={{ fontFamily: "AvenirNextCyr-Bold", color: "white" }} >
                    Submit
                  </Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>
      </Modal>

<Portal>
  <PaperModal visible={visible3} onDismiss={hideModal11} contentContainerStyle={containerStyle}>
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.modalContainer2}>
        <View style={styles.modalContent2}>

          <TouchableOpacity
            style={styles.closeIcon}
            onPress={() => {
              hideModal11();
            }}
          >
            <AntDesign name="close" color="black" size={25} />
          </TouchableOpacity>

          <View style={{ marginHorizontal: '1%', marginTop: '3%', gap: 1 }}>
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 5,
                }}
              >
                <Text style={[styles.ModalText2,{width:'60%'}]} >
                  {selectedItemName}
                </Text>
                
                {orderDetails.status === "In Production" && (
                  <TouchableOpacity
                    onPress={toggleCheckAll}
                    style={{
                      padding: 8,
                      backgroundColor: Colors.primary,
                      borderRadius: 5,
                    }}
                  >
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>
                      {productionViewData?.every((item) => item?.production_done) ? 'Uncheck All' : 'Check All'}
                    </Text>
                  </TouchableOpacity>
                )}
                {
                  orderDetails?.product_list[0]?.name !=='BASE PLATE' &&
                <TouchableOpacity
                    onPress={()=>{setVisible5(true)}}
                    style={{
                      padding: 5,
                      backgroundColor: 'green',
                      borderRadius: 5,
                      paddingVertical:8
                    }}
                  >
                   <Text style={{ color: 'white', fontWeight: 'bold' }}>
                     Stock
                    </Text>
                  </TouchableOpacity>
                }

              </View>
              {(orderDetails.status === 'Production Completed' && orderDetails?.product_list[0]?.name !== 'BASE PLATE' ) && (
              <Text style={{fontSize: 15, fontFamily: 'AvenirNextCyr-Bold', paddingBottom: 5,color:Colors.black}} >
                  CONSUMED WEIGHT: {productionViewDataStockWeight}Kg
                </Text>
              )}
              <View
                style={{
                  alignItems: 'center',
                  borderBottomWidth: 1,
                  borderBottomColor: '#D3D3D3',
                  marginTop: '3%',
                }}
              />
            </View>


            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ width: 550 }}>
                  <View style={{ marginHorizontal: '1%', marginTop: '3%', flexDirection: 'row', justifyContent: 'center' }}>
        <View style={{ marginHorizontal: '1%', gap: 1 }}>
          <View style={{ flexDirection: 'row', marginBottom: 1, alignItems: 'center', gap: 5 }}>
          <Text style={{ fontSize: 14, fontWeight: 'bold', textAlign: 'center', color: 'black', width: 100 }}>
                       {orderDetails?.product_list[0]?.name ==='BASE PLATE' ? 'LENGTH' : 'FEET'}
                      </Text>


<Text style={{ fontSize: 14, fontWeight: 'bold', textAlign: 'center', color: 'black', width: 100 }}>
                         {orderDetails?.product_list[0]?.name ==='BASE PLATE' ? 'WIDTH' : 'INCH'}
                      </Text>


                      {orderDetails?.product_list[0]?.name == 'BASE PLATE' && (
                     <Text style={{ fontSize: 14, fontWeight: 'bold', textAlign: 'center', color: 'black', width: 120 }}>
                           THICKNESS
                         </Text>
                       )}
                  <Text style={{ fontSize: 14, fontWeight: 'bold', textAlign: 'center', color: 'black', width: 90 }}>
                        NOS
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginBottom: 10,
                        alignItems: 'center',
                        width: '100%',
                        gap: 1,
                      }}
                    >
                      
<FlatList
  data={productionViewData}
  renderItem={({ item, index }) => {

    const duplicateStockIds = productionViewData
          .flatMap((data) =>
            data.base_production_stock.map((stock) => stock.stock_id)
          )
          .filter(
            (value, i, self) => self.indexOf(value) !== i
          );
    return (

    <View
      key={index}
      style={{
        flexDirection: 'column', 
        marginBottom: 10,
        alignItems: 'flex-start',
        width: '100%',
        gap: 10
      }}
    >
      {/* Main Dimensions Row */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10 }}>
      {orderDetails?.product_list[0]?.name === 'BASE PLATE' ? (
          <>
            <TextInput
              style={{
                borderWidth: 1,
                padding: 5,
                width: 100,
                color: 'black',
                fontSize: 18,
              }}
              value={String(item?.height_inch || '0.00')}
              placeholder="0.00"
              editable={false}
            />
            <TextInput
              style={{ borderWidth: 1, padding: 5, width: 100, color: 'black', fontSize: 18 }}
              value={String(item?.width_ft || '0.00')}
              placeholder="0.00"
              editable={false}
            />
          </>
        ) : (
          <>
            <TextInput
              style={{
                borderWidth: 1,
                padding: 5,
                width: 100,
                color: 'black',
                fontSize: 18,
              }}
              value={String(item?.width_ft || '0.00')}
              placeholder="0.00"
              editable={false}
            />
          <TextInput
              style={{
                borderWidth: 1,
                padding: 5,
                width: 100,
                color: 'black',
                fontSize: 18,
              }}
              value={String(item?.height_inch || '0.00')}
              placeholder="0.00"
              editable={false}
            />
          </>
        )}

        {orderDetails?.product_list[0]?.name === 'BASE PLATE' && (
          <TextInput
            style={{
              borderWidth: 1,
              padding: 5,
              width: 100,
              color: 'black',
              fontSize: 18,
            }}
            value={String(item?.thickness || '0.00')}
            placeholder="0.00"
            editable={false}
          />
          
        )}
        <TextInput
          style={{
            borderWidth: 1,
            padding: 5,
            width: 90,
            color: 'black',
            fontSize: 18,
          }}
          value={String(item?.nos || '0.00')}
          placeholder="0.00"
          editable={false}
        />
        {orderDetails.status === 'In Production' && (
          <Checkbox.Android
            color={Colors.primary}
            status={item.production_done ? 'checked' : 'unchecked'}
            onPress={() => handleCheckboxToggle(item?.production_id)}
          />
        )}
      </View>

      {(orderDetails.status === 'Production Completed' && orderDetails?.product_list[0]?.name === 'BASE PLATE' ) && (
      <Text style={{ fontFamily: 'AvenirNextCyr-Medium',color: 'black' }} > CONSUMED WEIGHT :{item?.base_production_weight} Kg</Text>
      )}
             {/* Base Production Stock Row */}
                 {item?.base_production_stock?.length > 0 ? (
                  item.base_production_stock.map((stock, stockIndex) => (
                   <View
                     key={stockIndex}
                     style={{ flexDirection: 'row', gap: 10, justifyContent:'space-between'}}>
                       <View key={stockIndex}
                              style={{
                              backgroundColor: duplicateStockIds.includes(stock.stock_id)
                              ? getRandomColorForStock(stock.stock_id)
                              : 'transparent',
                              height:13,
                              width:13,
                              borderRadius:10
                              }}></View>
                       <Text style={{ fontFamily: 'AvenirNextCyr-Medium', color: Colors.primary, fontSize: 12, }} > {stock?.product_name} </Text>
                       <Text style={{ fontFamily: 'AvenirNextCyr-Medium', color: 'black', fontSize: 12, }} >QTY :{stock?.qty} {stock?.stock_uom}</Text>
                       <Text style={{ fontFamily: 'AvenirNextCyr-Medium',color: 'black', fontSize: 12,  overflow: 'hidden',textOverflow: 'ellipsis'  }} >BATCH :{stock?.batch_code ? stock?.batch_code : 'N/A' }</Text>
                   </View>
                    ))
                     ) : (
                     null
                    )}
                   </View>
                    );
                  }}
                 />
                    </View>
                  </View>
              </View>
            </ScrollView>

            {orderDetails.status === "In Production" && (
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
                onPress={() => {
                  SaveDimentionChecklist();
                }}
                style={{
                  paddingVertical: '4%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    fontFamily: 'AvenirNextCyr-Bold',
                    color: 'white',
                  }}
                >
                  Save Records
                </Text>
              </TouchableOpacity>
            </LinearGradient>
            )}
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  </PaperModal>
</Portal>

<Modal visible={modalVisible2} transparent>
        <View style={styles.modalContainer1}>
          <View style={styles.modalContent11}>
            <View style={{flexDirection:'row',alignItems:'center'}}>
            <Text style={{fontSize: 14,
              fontFamily: 'AvenirNextCyr-Bold',width:'90%',
              color:Colors.primary,}} numberOfLines={2}>{selectedItemName}</Text>
            <TouchableOpacity
              style={{
                padding: 5,}}
              onPress={() => setModalVisible2(false)}>
              <AntDesign name="close" color="black" size={25} />
            </TouchableOpacity>
        
              </View>
              <View style={{marginHorizontal: '1%', marginTop: '3%',gap:10}}>
          <FlatList
            data={stockDeductData}
            keyExtractor={(item) => item.stock_id.toString()}
            style={{ maxHeight: '87%'}} 
            renderItem={({ item }) => (
          <View style={styles.container}>

          {/* Product Name and Quantity */}
          <View style={styles.row1}>
            <Text style={styles.label}>
              <Text style={styles.boldText}>Product Name: </Text>
              {item.product_name}
            </Text>
          </View>

          <View style={styles.row1}>
            <Text style={styles.label}>
              <Text style={styles.boldText}>Selected Qty: </Text>
              {item.qty} {item.uom}
            </Text>
          </View>

          {/* Consumed Quantity Input */}
          <View style={styles.row1}>
            <Text style={styles.label}>
              <Text style={styles.boldText}>Consumed Qty: </Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="00.00"
              placeholderTextColor="gray"
              keyboardType="decimal-pad"
              returnKeyType="done"
              value={userInputs[item.stock_id]?.consumed_qty || ''}
              onChangeText={(text) => handleInputChange(item.stock_id, 'consumed_qty', text)}
            />
          </View>

          {/* Weight Used */}
          <View style={styles.row1}>
            <Text style={styles.label}>
              <Text style={styles.boldText}>Consumed Weight(KG's): </Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="00.00"
              placeholderTextColor="gray"
              keyboardType="decimal-pad"
              returnKeyType="done"
              value={userInputs[item.stock_id]?.consumed_weight || ''}
              onChangeText={(text) => handleInputChange(item.stock_id, 'consumed_weight', text)}
            />
          </View>
        </View>
      )}
    />

      <LinearGradient
              colors={Colors.linearColors}
              start={Colors.start}
              end={Colors.end}
              locations={Colors.ButtonsLocation}
              style={{
                borderRadius: 20,
                marginTop: "4%",
              }}
            >
              <TouchableOpacity
                onPress={handleSave}
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
        </View>
      </Modal>


<Modal visible={modalVisible3} transparent>
  <View style={styles.modalContainer1}>
    <View style={styles.modalContent11}>

      <TouchableOpacity
        style={{ 
          position:'absolute',
          top: 20,
          right: 10,
          padding: 5,}}
        onPress={() => setModalVisible3(false)}
      >
        <AntDesign name="close" color="black" size={25} />
      </TouchableOpacity>

      <Text style={styles.ModalText1}>{selectedItemName}</Text>

      <View style={{ marginHorizontal: '1%', marginTop: '3%', gap: 10 }}>
        <FlatList
          data={stockDeductBaseData|| []}
          keyExtractor={(item, index) => item?.production_id?.toString() || index.toString()}
          style={{ maxHeight: '87%' }}
          renderItem={({ item }) => (
            <View style={styles.container}>

<View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '98%', alignItems: 'center',marginBottom:10 }}>
  <Text style={[styles.boldText1, { flex: 1, textAlign: 'center' }]}>LENGTH</Text>
  <Text style={[styles.boldText1, { flex: 1, textAlign: 'center' }]}>WIDTH</Text>
  <Text style={[styles.boldText1, { flex: 1, textAlign: 'center' }]}>THICKNESS</Text>
  <Text style={[styles.boldText1, { flex: 1, textAlign: 'center' }]}>NOS</Text>
</View>

<View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '98%', alignItems: 'center',marginBottom:10 }}>
  <Text style={[styles.boldText, { flex: 1, textAlign: 'center' }]}>{item?.height_inch}</Text>
  <Text style={[styles.boldText, { flex: 1, textAlign: 'center' }]}>{item?.width_ft}</Text>
  <Text style={[styles.boldText, { flex: 1, textAlign: 'center' }]}>{item?.thickness}</Text>
  <Text style={[styles.boldText, { flex: 1, textAlign: 'center' }]}>{item?.nos}</Text>
</View>


                  <View style={styles.row1}>
                    <Text style={styles.label}>
                      <Text style={styles.boldText}>Consumed Weight(KG's): </Text>
                    </Text>
                    <TextInput
                      style={styles.input}
                      placeholder="00.00"
                      placeholderTextColor="gray"
                      keyboardType="decimal-pad"
                      returnKeyType="done"
                      onChangeText={text => handleWeightChange(item.production_id, text)}
                      value={weightData[item.production_id] || ''}
                    />
                  </View>
            </View>
          )}
        />
      </View>

      <LinearGradient
        colors={Colors.linearColors}
        start={Colors.start}
        end={Colors.end}
        locations={Colors.ButtonsLocation}
        style={{
          borderRadius: 20,
          marginTop: "4%",
        }}
      >
        <TouchableOpacity
          onPress={handleSavee}
          style={{
            paddingVertical: "4%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {isUpdating ? (
            <ActivityIndicator size={28} color={Colors.white} />
          ) : (
            <Text style={{ fontFamily: "AvenirNextCyr-Bold", color: "white" }}>
              Submit
            </Text>
          )}
        </TouchableOpacity>
      </LinearGradient>
    </View>
  </View>
</Modal>

<Modal visible={visible4} transparent={true}>
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
                style={{ fontFamily: "AvenirNextCyr-Medium", fontSize: 16 ,color:Colors.black}}
              >
                Add Remarks
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setVisible4(false);
                }}
              >
                <AntDesign name="close" color="black" size={20} />
              </TouchableOpacity>
            </View>
            <View style={{ marginVertical: "4%" }}>
              <TextInput1
                mode="outlined"
                label="Remarks"
                value={proRemarks}
                theme={{ colors: { onSurfaceVariant: "#4b0482" } }}
                activeOutlineColor="#4b0482"
                outlineColor="#B6B4B4"
                textColor="#4b0482"
                multiline={true}
                numberOfLines={4}
                onChangeText={(text) => setProdRemarks(text)}
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
                onPress={CompeleteProduction}
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

      <Modal visible={visible5} transparent={true}>
        <View
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            flex: 1,
            justifyContent: "center" }}
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
              style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text
                style={{ fontFamily: "AvenirNextCyr-Medium", fontSize: 16 ,color:Colors.black}}>
                Stock Details
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setVisible5(false);
                }}
              >
                <AntDesign name="close" color="black" size={20} />
              </TouchableOpacity>
            </View>
            <View style={{ marginVertical: "4%" }}>
            <FlatList
                data={productionViewDataStock}
                keyExtractor={(item) => item?.stock_id.toString()}
                renderItem={renderStockData}
              />
            </View>
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

export default ProductionReviewDetails;

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
    width:'70%',
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
  color:'black',
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
  textAlign: 'left',
},  stockItem: {
  paddingVertical: 10,
  paddingHorizontal: 15,
  backgroundColor: "#f9f9f9",
  borderRadius: 10,
},
stockCard: {
  borderWidth: 1,
  borderColor: "#ddd",
  marginVertical: 5,
},
stockLabel: {
  fontSize: 14,
  color: "#555",
  fontWeight: "600",
  marginBottom: 5,
},
stockValue: {
  fontSize: 14,
  color: "#222",
  fontWeight: "bold",
},
divider: {
  height: 1,
  backgroundColor: "#ddd",
  marginVertical: 8,
},
});
