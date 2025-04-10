import React, { useContext, useEffect, useState,useRef, useCallback,
  useMemo, } from "react";
import { AuthContext } from "../../Context/AuthContext";
import {
  View,
  Dimensions,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  FlatList,
  Pressable,
  SafeAreaView,
  ActivityIndicator,
  KeyboardAvoidingView,
  PermissionsAndroid, Platform 
} from "react-native";
import Colors from "../../constants/Colors";
import { useFocusEffect } from "@react-navigation/native";
import { Image } from "react-native-animatable";
import globalStyles from "../../styles/globalStyles";
import AntDesign from "react-native-vector-icons/AntDesign";
import Entypo from "react-native-vector-icons/Entypo";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import ConvertDateTime from "../../utils/ConvertDateTime";
import LinearGradient from "react-native-linear-gradient";
import { Checkbox,Searchbar } from "react-native-paper";
import { TextInput as TextInput1 ,Modal as PaperModal ,Portal ,PaperProvider ,DefaultTheme} from "react-native-paper";
import Toast from "react-native-simple-toast";
import { SegmentedButtons } from "react-native-paper";
import { searchItem } from "../../utils/Search";
import { debounce } from "../../utils/Search";
import  Ionicons  from 'react-native-vector-icons/Ionicons';
import { LoadingView } from "../../components/LoadingView";
import Comments from '../../components/Comments';
import { WebView } from 'react-native-webview';
import { Dropdown } from 'react-native-element-dropdown';
import RNFetchBlob from 'rn-fetch-blob';

const OrderRevStockDetails = ({ navigation, route }) => {

  const orderDetail = route.params?.orderDetails;
  const [orderDetails, setOrderDetails] = useState(orderDetail);
  const screen = route.params?.screen;
  const [products1, setProducts1] = useState(
    route?.params?.orderDetails?.product_list
  );
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0); 
  const { userData } = useContext(AuthContext);
  const [visible, setVisible] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAnyProductUnavailable, setIsAnyProductUnavailable] = useState(false);
  const [error, setError] = useState("");
  const [value, setValue] = useState("2");
  const [value1, setValue1] = useState("1");
  const [conRemarks, setConRemarks] = useState("");
  const [addedItems, setAddedItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setselectedItems] = useState([]);
  const queryParams = useRef({ limit: 10, offset: 0 });
  const [searching, setSearching] = useState(false);
  const [expandedSubCategory, setExpandedSubCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [originalCategories, setOriginalCategories] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [rowData1, setRowData1] = useState([]);
  const [productSearch, setProductSearch] = useState("");
  const [productsBySubCategory, setProductsBySubCategory] = useState({});
  const [search, setSearch] = useState("");
  const [selectedUOM, setSelectedUOM] = useState("");
  const [products, setProducts] = useState([]);
  const [dropdownItems, setDropdownItems] = useState([]);
  const [dropdownItemsAdd, setDropdownItemsAdd] = useState([]);
  const [modalVisible1, setModalVisible1] = useState(false);
  const [modalVisible3, setModalVisible3] = useState(false);
  const [modalVisible4, setModalVisible4] = useState(false);
  const [rows, setRows] = useState([{ input1: '', input2: '', input3: '' }]); 
  const [rows1, setRows1] = useState([
    {dimension_id: "", width_ft: "", height_inch: "", thickness: "", nos: "",stock_deduct_data: [] }
  ]);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [selectedItemName, setSelectedItemName] = useState('');
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUpdating1, setIsUpdating1] = useState(false);
  const [isUpdating11, setIsUpdating11] = useState(false);
  const [selectedItemRemain, setSelectedItemRemain] = useState('');
  const [isCommentsModalVisible, setIsCommentsModalVisible] = useState(false);
  const [modalVisibleBill, setModalVisibleBill] = useState(false);
  const { width: windowWidth } = Dimensions.get('window');
  const [totalFeet, setTotalFeet] = useState(0);
  const [totalNo, setTotalNo] = useState(0);
  const [totalkg, setTotalKg] = useState(0);
  const [visible1, setVisible1] = React.useState(false);
  const [visible2, setVisible2] = React.useState(false);
  const [visible3, setVisible3] = React.useState(false);
  const [OrderRawData, setOrderRawData] = useState();
  const [companyOptions, setCompanyOptions] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedParentId, setSelectedParentId] = useState(null);
  const [selectedProductIds, setSelectedProductIds] = useState(null);
  const [productionViewData, setProductionViewData] = useState([]);
  const [stockId, setStockId] = useState('');
  const [rowMM, setRowMM] = useState('');
  const [productWeight, setProductWeight] = useState('');
  const [allDimensionsAdded, setAllDimensionsAdded] = useState(false);
  const [visible5, setVisible5] = useState(false);
  const [productionViewDataStock, setProductionViewDataStock] = useState('');
  const [isSelectStock, setIsSelectStock] = useState(false); 
  const [checkedRows, setCheckedRows] = useState([]);
  const [rowMMs, setRowMMs] = useState('');
  const [stockDeductDataPresent, setStockDeductDataPresent] = useState(false);
  const [stockDeductDataPresentID, setStockDeductDataPresentID] = useState('');
  const [productionData, setProductionData] = useState({
    is_production: 1,
    production_list: [],
  });

  console.log('===============OrderRawData=========================');
  console.log(JSON.stringify(OrderRawData,null,2));
  console.log('====================================================');

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

  useEffect(() => {
    let stockDeductDataFound = false;
  
    // Iterate through production_list
    if (OrderRawData && OrderRawData?.production_list) {
      for (const production of OrderRawData?.production_list) {
        if (production?.dimensions) {
          for (const dimension of production?.dimensions) {
            // Check if stock_deduct_data exists and is not empty
            if (dimension?.stock_deduct_data && dimension?.stock_deduct_data?.length > 0) {
              stockDeductDataFound = true;
              break; // No need to continue the loop once found
            }
          }
        }
        if (stockDeductDataFound) break; 
      }
    }
  
    setStockDeductDataPresent(stockDeductDataFound);
  
  }, [OrderRawData]);


  useEffect(()=>{

    const { production_list } = productionData;

    // Check if any product in the production_list has stock_deduct_data
    const hasStockDeductData = production_list.some(prod => 
      prod?.stock_deduct_data && prod?.stock_deduct_data?.length > 0
    );
    
    // Set the flag based on whether any product has stock_deduct_data
    if (hasStockDeductData) {
      setStockDeductDataPresentID(true);
      console.log("At least one product has stock_deduct_data.");
    } else {
      setStockDeductDataPresentID(false);
      console.log("No product has stock_deduct_data.");
    }

  },[productionData])


  useEffect(() => {
    if (companyOptions && companyOptions?.length > 0 && selectedParentId) {

      const selectedProduct = companyOptions.find(option => option.id === selectedParentId);
  
      if (selectedProduct) {
        handleCompanySelect(selectedProduct);
      } else {
        console.log('selectedParentId not found in companyOptions');
      }
    }
  }, [companyOptions, selectedParentId]);
  

  const handleSelectStock = () => {
    setIsSelectStock(!isSelectStock); 
  };

  const handleSelectStockModel = () => {
    setRowMM(rowMMs);
    getDropdownProductBasePlate(rowMMs);
  };

  const handleCheckboxPress = (index) => {

    const selectedThickness = rows1[index].thickness;
    
    // Check if there are any rows already selected
    if (checkedRows.length > 0) {
      const firstSelectedRowIndex = checkedRows[0]; 
      const firstSelectedRowThickness = rows1[firstSelectedRowIndex].thickness;
      setRowMMs(firstSelectedRowThickness)
  
      // Check if the thickness of the currently selected row is the same as the first selected row
      if (selectedThickness !== firstSelectedRowThickness) {
        Alert.alert('Selection Error', 'The thickness of selected rows must be the same.');
        return; // Do not allow selection if thickness is different
      }
    }
  
    // If thickness is the same, proceed with selection logic
    if (checkedRows.includes(index)) {
      setCheckedRows(checkedRows.filter((i) => i !== index)); // Deselect if already selected
    } else {
      setCheckedRows([...checkedRows, index]); // Add to selected rows if not selected
    }
  };
  
  const window = Dimensions.get('window');
  const WINDOW_HEIGHT = window.height;

  //Base Plate
  useEffect(()=>{
    // Update the production list based on the updated rows
   const productionData = orderDetails?.product_list?.[0]?.production_data || [];

   if (productionData.length > 0) {
     // Update the production list based on the updated rows
     const updatedOrderRawData = {
       production_list: [
         {
           product_id: orderDetails?.product_list[0]?.product_id,
           stock_comment: selectedItem.find(product => product.idd === orderDetails?.product_list[0]?.product_id)?.remarks || '',
           dimensions: productionData.map(row => ({
            dimension_id: row.production_id || '',
             width_ft: row.width_ft || '',
             height_inch: row.height_inch || '',
             thickness: row.thickness || '',
             nos: row.nos || '',
             stock_deduct_data: (row.stock_data || []).map(stock => ({
              qty: stock.qty,
              stock_id: stock?.production_stock === true ? stock?.parent_stock_id : stock?.stock_id,
              production_stock: stock.production_stock,
              base_identifier:stock.base_identifier,
              parent_stock_id:stock?.production_stock === true ? stock?.stock_id : stock?.parent_stock_id,
            }))
           })),
         },
       ],
     };
 
     setOrderRawData(updatedOrderRawData);
   }
  },[orderDetails])


  //PPGL Coil 
  useEffect(()=>{
    const productionList = [];

    // Loop over all products in the product list
    orderDetails?.product_list?.forEach(product => {
      const productionData = product.production_data || [];

      if (productionData.length > 0) {
        // Construct the production list for each product that has production_data
        productionList.push({
          product_id: product.product_id,
          stock_comment: product.stock_comments || '',
          dimensions: productionData.map(row => ({
            width_ft: row.width_ft || '',
            height_inch: row.height_inch || '',
            thickness: row.thickness || 0,
            nos: parseInt(row.nos, 10) || '',
            dimension_id: row.production_id || '',
          })),
          stock_deduct_data: (product.stock_deduct_data || []).map(stock => ({
            qty: stock.qty,
            stock_id: stock.stock_id,
            production_stock: "False",
          }))
        });
      }
    });

    if (productionList.length > 0) {
      // Construct the final structure with is_production set to 1 if any product has production_data
      const updatedOrderRawData = {
        is_production: 1,
        production_list: productionList,
      };

      // Update the state with the transformed data
      setProductionData(updatedOrderRawData);
    }
  },[orderDetails])
  
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
  
  
  const checkDimensionsAdded = () => {
    if (!OrderRawData?.production_list || OrderRawData.production_list.length === 0) {
      setAllDimensionsAdded(false);
      return;
    }
  
    const allDimensionsComplete = OrderRawData.production_list.every(product =>
      product.dimensions.every(dimension => {
        // Ensure all required fields are non-empty
        const hasValidFields = dimension.width_ft && dimension.height_inch && dimension.thickness && dimension.nos;
  
        // Ensure stock_deduct_data is not empty and has valid entries
        const hasValidStockData = dimension.stock_deduct_data.length > 0 && dimension.stock_deduct_data.every(stock => stock.qty && parseInt(stock.qty) > 0);
  
        return hasValidFields && hasValidStockData;
      })
    );
  
    setAllDimensionsAdded(allDimensionsComplete);
  };

  
  useEffect(() => {
    checkDimensionsAdded();
  }, [OrderRawData]);

  const showModal = () => setVisible1(true);
  const hideModal = () => setVisible1(false);
  const hideModal1 = () => setVisible2(false);
  const hideModal11 = () => setVisible3(false);

  const containerStyle = { flex:1, height:'100%', width:'100%' };

  const ProdModelVisible = ( name ,id ,stock ,weight ) => {

    if(name === 'BASE PLATE'){
      setSelectedItemName(name);
      setSelectedItemId(stock);
      setSelectedProductIds(id);
      showModal();
      setProductWeight(weight);

    } else {

   // Fetch dimensions for the selected product
    const selectedProduct = productionData?.production_list.find(
      (item) => item.product_id === id
    );
  
  // If dimensions exist for the selected product, set them to rows
    if (selectedProduct?.dimensions) {
      setRows(selectedProduct.dimensions.map(dim => ({
       input1: dim.width_ft?.toString() || '',
       input2: dim.height_inch?.toString() || '',
       input3: dim.nos?.toString() || '',
       input4: dim.dimension_id?.toString() || ''
      })));
     } else {
      setRows([{ input1: '', input2: '', input3: '', input4: '' }]);
     }
      setVisible2(true);
      setSelectedItemId(stock);
      setSelectedItemName(name);
      setSelectedProductIds(id);
      setStockId(stock);
      setProductWeight(weight);
    }
  };

  const ProdModelSizeVisible = (name ,data ,stock) => {

    if(name === 'BASE PLATE'){
      setSelectedItemName(name);
      setVisible3(true);
      setProductionViewData(data);
    }else{
      setVisible3(true);
      setSelectedItemName(name);
      setProductionViewData(data);
      setProductionViewDataStock(stock)
    }
  };

  useEffect(() => {
    if (OrderRawData?.production_list && OrderRawData?.production_list[0]?.dimensions) {
      // Update rows1 based on the updated orderRawData
      setRows1(
        OrderRawData?.production_list[0]?.dimensions.map(dim => ({
          width_ft: dim.width_ft?.toString() || '',
          height_inch: dim.height_inch?.toString() || '',
          thickness: dim.thickness?.toString() || '',
          nos: dim.nos?.toString() || '',
          dimension_id:dim.dimension_id?.toString() || '',
          stock_deduct_data: dim.stock_deduct_data || ''
        }))
      );
    }
  }, [OrderRawData]);


  const saveRowsForPPGLDimention = () => {

    // Validate rows: Check for partially filled rows
    const isAnyRowPartiallyFilled = rows.some(
      (row) =>
        (row.input1 || row.input2 || row.input3) &&
        !(row.input1 && row.input2 && row.input3)
     );
  
    if (isAnyRowPartiallyFilled) {
      Alert.alert(
        "Validation Error",
        "Please fill all fields for the rows where one or more fields are entered."
      );
      return;
    }
  
    // Validate rows: Check if at least one row is completely filled
    const isAnyRowCompletelyFilled = rows.some(
      (row) => row.input1 && row.input2 && row.input3
    );
  
    if (!isAnyRowCompletelyFilled) {
      Alert.alert(
        "Validation Error",
        "Please enter at least one complete row to save."
      );
      return;
    }
  
    // Check stock_deduct_data before updating or adding a new product
    const existingProduct = productionData?.production_list.find(
      (item) => item.product_id === selectedProductIds
    );
  
    if (existingProduct) {
      if (existingProduct?.stock_deduct_data.length === 0) {
        Alert.alert(
          "Error",
          "Stock data is empty. Please add stock data before saving."
        );
        return;
      }
    } else {
      // Validation for new products
      const isStockDataEmpty = rows.length === 0;
      if (isStockDataEmpty) {
        Alert.alert(
          "Error",
          "Stock data is empty. Please add stock data before saving."
        );
        return;
      }
    }
  
    // Save the Modal
    saveStockDataPPGL('Submit');
  };

  
  const saveStockDeductPPGL = () => {
    // Filter and map stock deduction data, ensuring qty is greater than 0
    const stock_deduct_data = rowData1
      .filter((row) => parseFloat(row.qtys || 0) > 0) // Filter rows where qty is greater than 0
      .map((row) => ({
        stock_id: row?.stock_id,  // Keep the stock ID
        qty: parseFloat(row.qtys),  // Parse and store the quantity
        production_stock: 'False',  // Set production stock status to False
        parent_stock_id: row?.stock_id
      }));
  
    // Save the stock deduction data to the production list for the selected product
    setProductionData((prevData) => ({
      ...prevData,
      production_list: prevData?.production_list.map((item) =>
        item.product_id === selectedProductIds  // Find the selected product
          ? { ...item, stock_deduct_data }  // Update its stock deduction data
          : item  // Keep other products unchanged
      ),
    }));
  
    // Close the modal
    setModalVisible4(false);
  };
  
  const addRow = () => {
    setRows([...rows, { input1: '', input2: '', input3: '',input4: ''}]);
  };

  const addRow1 = () => {
    setRows1([...rows1, { width_ft: '', height_inch: '', thickness: '' , nos: '',dimension_id:'',stock_deduct_data:[]}]);
  };

   // Delete dimensions for the PPGL Coil 
  const deleteRow = (index) => {
    // Remove the row from rows state
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
  
    // Dynamically update the dimensions after row deletion
    const dimensions = updatedRows.map((row) => ({
      width_ft: parseFloat(row?.input1 || ''),
      height_inch: parseFloat(row?.input2 || ''),
      thickness: 0,
      nos: parseInt(row?.input3 || 0, 10),
      dimension_id: row?.input4 || '',
    }));

    Toast.show("Dimension deleted successfully", Toast.LONG);

    // Update production data by modifying the dimensions for the selected product
    setProductionData((prevData) => {
      return {
        ...prevData,
        production_list: prevData.production_list.map((item) =>
          item.product_id === selectedProductIds
            ? { ...item, dimensions }
            : item
        ),
      };
    });
  };


  // Delete dimensions for the BASE PLATE
  const deleteRow1 = (index) => {

    // Filter out the row at the given index
    const updatedRows = rows1.filter((_, i) => i !== index);
  
    // Check if OrderRawData.production_list exists and has at least one item
    const productionList = OrderRawData.production_list && OrderRawData.production_list.length > 0 
      ? OrderRawData.production_list[0] 
      : { dimensions: [] };
  
    // Update the production list dimensions by removing the corresponding index
    const updatedOrderRawData = {
      ...OrderRawData,
      production_list: [
        {
          ...productionList,
          dimensions: updatedRows
            .filter(row => row) 
            .map(row => ({
              width_ft: row.width_ft || '',
              height_inch: row.height_inch || '',
              thickness: row.thickness || '',
              nos: row.nos || '',
              stock_deduct_data: row.stock_deduct_data || [],
              dimension_id: row.dimension_id || ''
            })),
        },
      ],
    };
  
    // Update states
    setRows1(updatedRows);
    setOrderRawData(updatedOrderRawData);
    Toast.show("Dimension deleted successfully", Toast.LONG);
  };
  
  
//Rendering the Stock in the approved Section after adding the dimension 
  const renderStockData = ({ item }) => (
    <View style={[styles.stockItem, styles.stockCard]}>
      <Text style={styles.stockLabel}>Quantity: <Text style={styles.stockValue}>{item.qty} {item.uom}</Text></Text>
      <Text style={styles.stockLabel}>Batch Code: <Text style={styles.stockValue}>{item.batch_code || 'N/A'}</Text></Text>
    </View>
  );
  

// Function to handle input change in a specific row and input field
const handleInputChange = (index, field, value) => {
  // Update the rows state
  const updatedRows = [...rows];
  updatedRows[index][field] = value;
  setRows(updatedRows);

  // Dynamically update the dimensions
  const dimensions = updatedRows.map((row) => ({
    width_ft: parseFloat(row?.input1 || 0),
    height_inch: parseFloat(row?.input2 || 0),
    thickness: 0,
    nos: parseInt(row?.input3 || 0, 10),
    dimension_id: row?.input4 || '',
  }));

  // Get stock_comment from selectedItems based on selectedProductIds
  const stockComment = selectedItem.find(
    (product) => product.id === selectedProductIds
  )?.remarks || '';

  setProductionData((prevData) => {
    const existingProduct = prevData?.production_list.find(
      (item) => item.product_id === selectedProductIds
    );

    if (existingProduct) {
      // Update the dimensions and stock_comment for the existing product
      return {
        ...prevData,
        production_list: prevData.production_list.map((item) =>
          item.product_id === selectedProductIds
            ? { ...item, dimensions, stock_comment: stockComment }
            : item
        ),
      };
    } else {
      // Add a new product if it doesn't exist
      return {
        ...prevData,
        production_list: [
          ...prevData.production_list,
          {
            product_id: selectedProductIds,
            dimensions,
            stock_comment: stockComment,
            stock_deduct_data: [],
          },
        ],
      };
    }
  });
};

  
  const handleInputChange1 = (index, field, value) => {

    // Update the row data
    const updatedRows = [...rows1];
    updatedRows[index][field] = value;
  
    // Update the production list based on the updated rows
    const updatedOrderRawData = {
      production_list: [
        {
          product_id: selectedProductIds,
          stock_comment: selectedItem.find(product => product.idd === selectedProductIds)?.remarks || '',
          dimensions: updatedRows.map(row => ({
            width_ft: row.width_ft,
            height_inch: row.height_inch,
            thickness: row.thickness,
            nos: row.nos,
            dimension_id: row.dimension_id || '',
            stock_deduct_data: row.stock_deduct_data || [],
          })),
        },
      ],
    };
  
    // Update states
    setRows1(updatedRows);
    setOrderRawData(updatedOrderRawData);
  };
  

  useEffect(() => {
    let total = 0;
    let totalWeight = 0;
  
    rows.forEach(item => {
      const feet = parseFloat(item.input1) || 0;  
      const inches = parseFloat(item.input2) || 0; 
      const pieces = parseFloat(item.input3) || 1; 
  
      const feetTotal = (feet + inches / 12);  
  
      const rowTotal = feetTotal * pieces;  
      total += rowTotal;  
      totalWeight += rowTotal * productWeight;
    });
  
    setTotalFeet(total.toFixed(2)); 
    setTotalKg(totalWeight.toFixed(2)); 
  }, [rows]);
  

  useEffect(() => {
    let total = 0;
    rows.forEach(item => {
      const pieces = parseFloat(item.input3) || 0;
      total += pieces;
    });
    setTotalNo(total.toFixed(2));
  }, [rows]);


  const updateQty = (index, text) => {
    setRowData1((prevData) =>
      prevData.map((item, i) => {
        if (i === index) {
          if (parseFloat(text) > parseFloat(item.qty)) {
            Alert.alert(
              "Validation Error",
              "Entered quantity cannot exceed available stock.",
              [{ text: "OK" }]
            );
            return { ...item }; 
          }
          return { ...item, qtys: text };
        }
        return item;
      })
    );
  };
  

  //Production Stock Selection API for BASE PLATE
  const FetchDataforBasePlate = async (id) => {
console.log("idddddddddddddd ",id)
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${userData.token}`);
  
    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
  
    fetch(`https://gsidev.ordosolution.com/api/production_base_stock/?production_id=${id}`, requestOptions)
      .then((response) => {
        return response.json()
      })
      
      .then(async (result) => {
        if (result.error) {
          Alert.alert("Sorry", "No Products Available");
        } else {

          console.log('================Result====================');
          console.log(result);
          console.log('==========================================');

          if (isSelectStock) {
            checkedRows.forEach((rowIndex) => {
              // Get the production data for each selected row index
              const selectedProductionData = OrderRawData.production_list[0]?.dimensions[rowIndex];

              console.log("🚀 ~ checkedRows.forEach ~ selectedProductionData:", selectedProductionData)

              // If production data exists, proceed
              if (selectedProductionData?.stock_deduct_data) {
                selectedProductionData.stock_deduct_data.forEach((stockData) => {
                  // Check if stock_id matches in the fetched rowData1 (result)
                  result.forEach((row) => {
                    if (row.stock_id === stockData.stock_id) {

                      // If stock_id matches, add the qty from OrderRawData to the fetched result
                      row.qtys = stockData.qty; // Add the new qty field to the rowData1 object
                    }
                  });
                });
              }
            });
          } else {
      
            const selectedProductionData = OrderRawData.production_list[0]?.dimensions[selectedRowIndex];
            console.log("🚀 ~ .then ~ selectedProductionData:", selectedProductionData);
      
            selectedProductionData?.stock_deduct_data.forEach((stockData) => {
              // Check if stock_id matches in the fetched rowData1 (result)
              result.forEach((row) => {
                if (row.stock_id === stockData.stock_id) {

                  // If stock_id matches, add the qty from OrderRawData to the fetched result
                  row.qtys = stockData.qty; // Add the new qty field to the rowData1 object
                }
              });
            });
          }
      
          setModalVisible3(true);
          setRowData1(result);
        }
      })
            console.log("🚀 ~ .then ~ selectedProductionData:", selectedProductionData)
      .catch((error) => {
        Alert.alert("Sorry", "No Products Available");
        console.log("error", error);
      });
  };

   //Production Stock Selection API for BASE PLATE
  const FetchDataforPPGLCoile = async (id) => {
  
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${userData.token}`);
  
    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
  
    try {
      const response = await fetch(
        `https://gsidev.ordosolution.com/api/production_stock/?product_id=${id}`,
        requestOptions
      );
      const result = await response.json();
  
      console.log("🚀 ~ .then ~ result:------------------------>", result);
  
      if (result.error) {
        Alert.alert("Sorry", "No Products Available");
        return;
      }
  
      if (isSelectStock) {
        checkedRows.forEach((rowIndex) => {
          // Get the production data for each selected row index
          const selectedProductionData = OrderRawData.production_list[0]?.dimensions[rowIndex];
  
          // If production data exists, proceed
          if (selectedProductionData?.stock_deduct_data) {
            selectedProductionData.stock_deduct_data.forEach((stockData) => {
              // Check if stock_id matches in the fetched rowData1 (result)
              result.forEach((row) => {
                if (row.stock_id === stockData.parent_stock_id) {
                  // If stock_id matches, add the qty from OrderRawData to the fetched result
                  row.qtys = stockData.qty; // Add the new qty field to the rowData1 object
                }
              });
            });
          }
        });
      } else {
  
        const selectedProductionData = OrderRawData.production_list[0]?.dimensions[selectedRowIndex];
  
        selectedProductionData?.stock_deduct_data.forEach((stockData) => {
          // Check if stock_id matches in the fetched rowData1 (result)
          result.forEach((row) => {
            if (row.stock_id === stockData.parent_stock_id) {
              // If stock_id matches, add the qty from OrderRawData to the fetched result
              row.qtys = stockData.qty; // Add the new qty field to the rowData1 object
            }
          });
        });
      }
  
      setModalVisible3(true);
      setRowData1(result);
  
    } catch (error) {
      Alert.alert("Sorry", "No Products Available");
      console.log("error", error);
    }
  };
  

    //Production Stock Selection API for PPGL Coil
    const FetchDataforMsPlate = async (id) => {

      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${userData.token}`);
    
      var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };
    
      fetch(`https://gsidev.ordosolution.com/api/production_stock/?product_id=${id}`, requestOptions)
        .then((response) => {
          return response.json();
        })
        
        .then(async (result) => {
            console.log("🚀 ~ .then ~ result:------------------------>", result)
          if (result.error) {
            Alert.alert("Sorry", "No Products Available");
          } else {
            const updatedResult = result.map(item => {

              // Assuming productionData and selectedProductIds are available in the scope
              const currentProduct = productionData?.production_list.find(product => product?.product_id === selectedProductIds);
              const matchingStock = currentProduct?.stock_deduct_data.find(stock => stock?.stock_id === item?.stock_id);
              const qtys = matchingStock ? matchingStock?.qty.toString() : item?.qtys?.toString() || '';

              // Adding the new "qtys" key to each item
              return {
                  ...item,
                  qtys: qtys || ''
              };
          });

          // Set updated data with qtys
          setModalVisible4(true);
          setRowData1(updatedResult);
          }
        })
        .catch((error) => {
          Alert.alert("Sorry", "No Products Available");
          console.log("error", error);
        });
    };


  const getDropdownProduct = async (MM) => {

    setValue1('2');
    if (!MM) return;

    setCompanyOptions([]);
    setRowData1([{ input1: '', input2: '', input3: '' }]);

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${userData.token}`);

    const raw = "";

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(
      `https://gsidev.ordosolution.com/api/production_dropdown/?product_mm=${MM}`,
      requestOptions
    )
      .then((response) => response.json())
      .then(async (result) => {
        if (result.error) {
          Alert.alert("Sorry", "No Products Available");
        } else {
          setCompanyOptions(Array.isArray(result) ? result : []);
          setModalVisible3(true);
        }
      })
      .catch((error) => {
        console.log("🚀 ~ getDropdownProduct ~ error:", error)
      });
  };


  const getDropdownProductBasePlate = async (MM) => {

    setValue1('1');
    if (!MM) return;

    setCompanyOptions([]);
    setRowData1([]);

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${userData.token}`);

    const raw = "";

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(
      `https://gsidev.ordosolution.com/api/production_base_dropdown_v2/?base_mm=${MM}&so_id=${orderDetails?.id}`,
      requestOptions
    )
      .then((response) => response.json())
      .then(async (result) => {

        if (result.error) {
          getDropdownProduct(MM);
        } else {
          setCompanyOptions(Array.isArray(result) ? result : []);
          setModalVisible3(true);
        }

      })
      .catch((error) => {
        console.log("🚀 ~ getDropdownProduct ~ error:", error)
      });
  };


  // Stock Selection for the Base Plate 
const saveRowsToSelectedItemBasePlate = () => {

  let hasIncompleteRow = false;
  let hasAtLeastOneCompleteRow = false;
  let hasRowWithoutStockDeductData = false;

  // Check each row for incomplete and complete data
  rows1.forEach(row => {
    const fields = [row.width_ft, row.height_inch, row.thickness, row.nos];
    const isRowPartiallyFilled = fields.some(field => field) && fields.some(field => !field);
    const isRowComplete = fields.every(field => field);

    if (isRowPartiallyFilled) {
      hasIncompleteRow = true;
    }

    if (isRowComplete) {
      hasAtLeastOneCompleteRow = true;

      // Check if stock_deduct_data is empty for a complete row
      if (!row.stock_deduct_data || row.stock_deduct_data.length === 0) {
        hasRowWithoutStockDeductData = true;
      }
    }
  });

  // Alert if there are incomplete rows
  if (hasIncompleteRow) {
    Alert.alert("Error","Please fill in all fields for each row.");
    return; 
  }

  // Alert if no complete row is entered
  if (!hasAtLeastOneCompleteRow) {
    Alert.alert("Error","Please enter at least one complete row to save.");
    return; 
  }

  // Alert if any row has empty stock_deduct_data
  if (hasRowWithoutStockDeductData) {
    Alert.alert("Error","Please add stock deduction data for all complete rows.");
    return; 
  }

  saveStockData('Submit')

};


// Save Stock data for the Base Plate - Multiple Values
const saveStockDeductDataMulti = () => {

  const updatedRows = [...rows1];

  if (checkedRows.length > 0) {  // Ensure there are selected rows
    // Map rowData1 to include only stock_id, qty, and production_stock
    const formattedData = rowData1
      .filter(item => parseFloat(item.qtys) > 0)
      .map(item => ({
        stock_id: item.stock_id,
        qty: item.qtys,
        production_stock: value1 === "1" ? "True" : "False",
        base_identifier:'True',
        parent_stock_id: item.stock_id,
      }));

    // Loop through all checkedRows and update each row
    checkedRows.forEach(index => {
      if (updatedRows[index]) {
        updatedRows[index].stock_deduct_data = formattedData;
      }
    });

    // Update rows1 state
    setRows1(updatedRows);

    // Regenerate productionData
    const updatedOrderRawData = {
      production_list: [
        {
          product_id: selectedProductIds,
          stock_comment: selectedItem.find(product => product.idd === selectedProductIds)?.remarks || '',
          dimensions: updatedRows.map(row => ({
            width_ft: row.width_ft,
            height_inch: row.height_inch,
            thickness: row.thickness,
            nos: row.nos,
            stock_deduct_data: row.stock_deduct_data || [],
            dimension_id: row.dimension_id
          })),
        },
      ],
    };

    // Update order raw data state
    setOrderRawData(updatedOrderRawData);

    // Close the modal
    setModalVisible3(false);

    // Close the CheckBox
    setIsSelectStock(false)

    // Empty the CheckBox Selection
    setCheckedRows([])

  } else {
    console.error("No rows selected!");
  }
};


// save Stock data for the Base Plate - Single Value 
const saveStockDeductData = () => {

  const updatedRows = [...rows1];
  if (selectedRowIndex !== null) {
    // Map rowData1 to include only stock_id, qty, and production_stock
    const formattedData = rowData1
      .filter(item => parseFloat(item.qtys) > 0) 
      .map(item => ({
        stock_id: item.stock_id,
        qty: item.qtys,
        production_stock: value1 === "1" ? "True" : "False", 
        base_identifier: 'False',
        parent_stock_id: item.stock_id,
      }));

    updatedRows[selectedRowIndex].stock_deduct_data = formattedData;

    // Update rows1 state
    setRows1(updatedRows);

    // Regenerate productionData
    const updatedOrderRawData = {
      production_list: [
        {
          product_id: selectedProductIds, 
          stock_comment: selectedItem.find(product => product.idd === selectedProductIds)?.remarks || '',
          dimensions: updatedRows.map(row => ({
            width_ft: row.width_ft,
            height_inch: row.height_inch,
            thickness: row.thickness,
            nos: row.nos,
            stock_deduct_data: row.stock_deduct_data || [],
            dimension_id:row.dimension_id
          })),  
        },
      ],
    };

    // Update order raw data state
    setOrderRawData(updatedOrderRawData);

    // Close the modal
    setModalVisible3(false);
  } else {
    console.error("No row selected!");
  }
};


  useEffect(() => {
    if (selectedRowIndex !== null) {
      setRowData1(rows1[selectedRowIndex].stock_deduct_data || []);
    }
  }, [selectedRowIndex]);


const saveRowsToSelectedItem = () => {
  // Check if selectedItem exists and is properly initialized as an array selectedItemRemain
  if (selectedItemRemain > rowData?.latest_qty) {
        Alert.alert("Warning", "Available quantity is less than ordered quantity.");
      }
  if (Array.isArray(selectedItem)) {
      const updatedProductList = selectedItem.map(product => {
      if (product.id === selectedItemId) {
        // Add availableStock only to the product that matches the selectedItemId
        return {
          ...product,
          availableStock: true,
        };
      }
      // Return the product as is if it doesn't match the selectedItemId
      return product;
    });

    // Update the selectedItem state with the modified array
    setselectedItems(updatedProductList);
  } else {
    console.error("Selected item is not an array.");
  }

  // Close the modal if no warning is triggered
  setModalVisible1(false);
};

const checkAllProductsHaveAvailableStock = () => {
  // Check if all products have availableStock set to true
  if (selectedItem.every(product => product.availableStock)) {
    return true;
  } else {
    Alert.alert("Stock Not available", "All products must have available before confirming.");
    return false;
  }
};

//Stock Approve for Normal orders
const stockApprove = () => {

  if (!checkAllProductsHaveAvailableStock()) {
    return; 
  }

  // Display a confirmation dialog
  Alert.alert("Stock Approve", "Are you sure you want to Approve this order?", [
      {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
      },
      {
          text: "Yes",
          onPress: () => {
            setIsUpdating1(true);
              var myHeaders = new Headers();
              myHeaders.append("Content-Type", "application/json");
              myHeaders.append("Authorization", `Bearer ${userData.token}`);

              var raw = JSON.stringify({
                status: "Stock Approved",
                stock_approve_by: userData.id,
                company: orderDetails?.company,
                product_status: selectedItem.map(product => ({
                    id: product.idd ? product.id : product.idd,
                    stock_comments: product?.remarks,
                })) 
            }); 

              console.log('==============raw========================');
              console.log(raw);
              console.log('==============raw========================');

              var requestOptions = {
                  method: "PUT",
                  headers: myHeaders,
                  body: raw,
                  redirect: "follow"
              };

              fetch(
                  `https://gsidev.ordosolution.com/api/sales_order/${orderDetails?.id}/`,
                  requestOptions
              )
                  .then((response) => {
                      if (response.status === 200) {
                          Toast.show("Order Approved successfully", Toast.LONG);
                          setIsUpdating1(false);
                          navigation.goBack();
                      } else {
                          setIsUpdating1(false);
                      }
                  })

                  .catch((error) => {console.log("api error", error);  setIsUpdating1(false);});
          },
      },
  ]);
};


//Stock Approve for Production - PPGL Coil 
const stockApproveForPPGL = () => {

  const orderProducts = orderDetails?.product_list || [];
  const productionList = productionData?.production_list || [];
  
  // Check if productionData is valid and if it contains the same products as orderDetail
  if (!productionData || productionList.length === 0) {
    Alert.alert("Error", "Production data is missing or incomplete. Please check and try again.");
    return;
  }
  
  // Loop through each product in the orderDetail to validate against productionData
  for (const orderProduct of orderProducts) {
    const matchingProduction = productionList.find(prod => prod.product_id === orderProduct.product_id);
  
    // If no matching product found in productionData, raise an alert
    if (!matchingProduction) {
      Alert.alert("Error", `Product ${orderProduct.name} is missing in production data. Please check and try again.`);
      return;
    }
  
    // Check if production details (dimensions, stock) are complete for the matching product
    const hasValidDimensions = matchingProduction?.dimensions?.length > 0;
    const hasStockData = matchingProduction?.stock_deduct_data?.length > 0;
  
    if (!hasValidDimensions || !hasStockData) {
      Alert.alert("Error", `Product ${orderProduct.name} has incomplete production details. Please check and try again.`);
      return;
    }
  }

  // Display a confirmation dialog
  Alert.alert("Stock Approve", "Are you sure you want to Approve this order for Production?", [
      {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
      },
      {
          text: "Yes",
          onPress: () => {
            setIsUpdating1(true);
              var myHeaders = new Headers();
              myHeaders.append("Content-Type", "application/json");
              myHeaders.append("Authorization", `Bearer ${userData.token}`);

              const updatedProductionList = productionData?.production_list.map((item) => {
                const selectedProduct = selectedItem.find((product) => product?.product_id === item?.product_id);
      
                if (selectedProduct) {
                  item.stock_comment = selectedProduct?.remarks || '';
                }
      
                // Loop through dimensions and remove dimension_id key if it's empty
                item.dimensions = item.dimensions.map((dimension) => {
                  if (dimension?.dimension_id === "") {
                    const { dimension_id, ...rest } = dimension; // Remove dimension_id from the object
                    return rest;
                  }
                  return dimension;
                });
      
                return item;
              });

              var raw = JSON.stringify({
                  is_production:1,
                  production_list:updatedProductionList
              });

              console.log('==============raw========================');
              console.log(raw);
              console.log('==============raw========================');

              var requestOptions = {
                  method: "PUT",
                  headers: myHeaders,
                  body: raw,
                  redirect: "follow"
              };

              fetch(`https://gsidev.ordosolution.com/api/production_wise_version2/${orderDetails?.id}/`,
                  requestOptions )
                  .then((response) => {
                      if (response.status === 200) {
                          Toast.show("Order Approved successfully", Toast.LONG);
                          setIsUpdating1(false);
                          navigation.goBack();
                      }else{
                          setIsUpdating1(false);
                      }
                  })
                  .catch((error) => {console.log("api error", error);  setIsUpdating1(false);});
          },
      },
  ]);
};


//Stock Approve for Production - Base Plate 
const stockApproveForBase = () => {

  if (!OrderRawData || !Array.isArray(OrderRawData.production_list)) {
    Alert.alert("Error", "Production data is missing or incomplete. Please check and try again.");
    return;
  }

  // Check if stock_deduct_data is empty for any dimension in production_list
  const isStockDeductDataEmpty = OrderRawData?.production_list.some(item => {
    return item.dimensions.some(dimension => {
      return dimension.stock_deduct_data && dimension.stock_deduct_data.length === 0;
    });
  });

  if (isStockDeductDataEmpty) {
    Alert.alert("Error", "Stock data is missing for dimensions.");
    return;
  }

   // Display a confirmation dialog
   Alert.alert("Stock Approve", "Are you sure you want to Approve this order for Production?", [
      {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
      },
      {
          text: "Yes",
          onPress: () => {
            setIsUpdating1(true);
              var myHeaders = new Headers();
              myHeaders.append("Content-Type", "application/json");
              myHeaders.append("Authorization", `Bearer ${userData.token}`);

                 // Update stock_comment in production_list with remarks from selectedItem
                 const updatedProductionList = OrderRawData?.production_list.map((item) => {
                   if (item.product_id === selectedItem[0]?.product_id) {
                     return {
                       ...item,
                       stock_comment: selectedItem[0]?.remarks || "",
                       dimensions: item.dimensions.map((dimension) => {
                         return {
                           ...dimension,
                           stock_deduct_data: dimension.stock_deduct_data.map((stock) => {
                             // Remove parent_stock_id from each stock object
                             const { parent_stock_id, ...restStock } = stock;
                             return restStock;
                           })
                         };
                       }),
                     };
                   }
                   return item;
                 });
              
                const raw = JSON.stringify({
                  is_production: 1,
                  production_list: updatedProductionList, 
                });

              console.log('==============raw========================');
              console.log(raw);
              console.log('========================================');

              var requestOptions = {
                  method: "PUT",
                  headers: myHeaders,
                  body: raw,
                  redirect: "follow"
              };

              fetch(`https://gsidev.ordosolution.com/api/production_wise_version2/${orderDetails?.id}/`,
                  requestOptions )
                  .then((response) => {
                      if (response.status === 200) {
                          Toast.show("Order Approved successfully", Toast.LONG);
                          setIsUpdating1(false);
                          navigation.goBack();
                      }else{
                          setIsUpdating1(false);
                      }
                  })
                  .catch((error) => {console.log("api error", error);  setIsUpdating1(false);});
          },
      },
  ]);
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


  useEffect(()=>{
    getDropdown();
  },[])


  const getDropdown = async () => {
    setLoading(true);
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${userData.token}`);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `https://gsidev.ordosolution.com/api/uom_list/`,
      requestOptions
    )
      .then((response) => response.json())
      .then(async (result) => {
        if (result.error) {
        } else {
          setDropdownItems(result || []);
          setDropdownItemsAdd(result || [])
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  };


// Delete the dimension for the BASE PLATE
  const handleDelete = (index,ids) => {
    // Ask for confirmation
    Alert.alert(
      "Confirmation",
      "Are you sure you want to delete this Dimension?",
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => {
          },
        },
        {
          text: "OK",
          onPress: () => {
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", `Bearer ${userData.token}`);

            var raw = JSON.stringify({
              order_id: orderDetails?.id,
              dimension_id: ids
            });
    
            console.log('================raw==========================');
            console.log(raw);
            console.log('=============================================');
    
            var requestOptions = {
              method: "DELETE",
              headers: myHeaders,
              body: raw,
              redirect: "follow",
            };

            fetch(
              `https://gsidev.ordosolution.com/api/delete_dimension/`,
              requestOptions
            )
              .then((response) => {
                if (response.status === 204) {
                  // You can perform additional actions here if needed
                } else if (!response.ok) {
                  Toast.show("Error in delete Dimension", Toast.LONG);
                  throw new Error(`HTTP error! Status: ${response.status}`);
                } else {
                  return response.json();
                }
              })
              .then(async (result) => {
                if (result) {
                 // Filter out the row at the given index
                 const updatedRows = rows1.filter((_, i) => i !== index);
  
                 // Check if OrderRawData.production_list exists and has at least one item
                 const productionList = OrderRawData.production_list && OrderRawData.production_list.length > 0 
                   ? OrderRawData.production_list[0] 
                   : { dimensions: [] };
               
                 // Update the production list dimensions by removing the corresponding index
                 const updatedOrderRawData = {
                   ...OrderRawData,
                   production_list: [
                     {
                       ...productionList,
                       dimensions: updatedRows
                         .filter(row => row) 
                         .map(row => ({
                           width_ft: row.width_ft || '',
                           height_inch: row.height_inch || '',
                           thickness: row.thickness || '',
                           nos: row.nos || '',
                           stock_deduct_data: row.stock_deduct_data || [],
                           dimension_id: row.dimension_id || ''
                         })),
                     },
                   ],
                 };
               
                 // Update states
                 setRows1(updatedRows);
                 setOrderRawData(updatedOrderRawData);
                Toast.show("Dimension deleted successfully", Toast.LONG);
                }
              })
              .catch((error) => {
                console.error("Error in delete Dimension", error);
              });
          },
        },
      ],
      { cancelable: false }
    );
  };


  // Delete the dimension for the PPGL Coil
  const handleDeletePPGL = (index,ids) => {
    // Ask for confirmation
    Alert.alert(
      "Confirmation",
      "Are you sure you want to delete this Dimension?",
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => {
          },
        },
        {
          text: "OK",
          onPress: () => {
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", `Bearer ${userData.token}`);

            var raw = JSON.stringify({
              order_id: orderDetails?.id,
              dimension_id: ids
            });
    
            console.log('================raw==========================');
            console.log(raw);
            console.log('=============================================');
    
            var requestOptions = {
              method: "DELETE",
              headers: myHeaders,
              body: raw,
              redirect: "follow",
            };

            fetch(
              `https://gsidev.ordosolution.com/api/delete_dimension/`,
              requestOptions
            )
              .then((response) => {
                if (response.status === 204) {

                  // You can perform additional actions here if needed
                } else if (!response.ok) {
                  Toast.show("Error in delete Dimension", Toast.LONG);
                  throw new Error(`HTTP error! Status: ${response.status}`);
                } else {
                  return response.json();
                }
              })
              .then(async (result) => {
                if (result) {
                  const updatedRows = rows.filter((_, i) => i !== index);
                  setRows(updatedRows);
                
                  // Dynamically update the dimensions after row deletion
                  const dimensions = updatedRows.map((row) => ({
                    width_ft: parseFloat(row?.input1 || ''),
                    height_inch: parseFloat(row?.input2 || ''),
                    thickness: 0,
                    nos: parseInt(row?.input3 || 0),
                    dimension_id: row?.input4 || '',
                  }));
              
                  Toast.show("Dimension deleted successfully", Toast.LONG);
              
                  // Update production data by modifying the dimensions for the selected product
                  setProductionData((prevData) => {
                    return {
                      ...prevData,
                      production_list: prevData.production_list.map((item) =>
                        item.product_id === selectedProductIds
                          ? { ...item, dimensions }
                          : item
                      ),
                    };
                  });
                }
              })
              .catch((error) => {
                console.error("Error in delete Dimension", error);
              });
          },
        },
      ],
      { cancelable: false }
    );
  };


  const ModelVisible = (uom, id,name,remain ,prod_id) => {

    setSelectedItemName(name);
    setSelectedItemRemain(remain);
    setSelectedUOM(uom);
    setSelectedItemId(id); 
    FetchData(prod_id,uom);
  };


  const FetchData = async (id, uom) => {
   setIsUpdating(prevState => ({ ...prevState, [id]: true }));

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${userData.token}`);

   const raw = "" ;
   var requestOptions = {
     method: "GET",
     headers: myHeaders,
     redirect: "follow",
   };

  console.log("🚀 ~ FetchData ~ requestOptions:", requestOptions)

  fetch(`https://gsidev.ordosolution.com/api/stock_approved/?product_id=${id}&loaded_uom=${uom}`, requestOptions)
    .then((response) => {
      return response.json()
    })
    
    .then(async (result) => {
        console.log("🚀 ~ .then ~ result:------------------------>", result);

      if (result.error) {
        Alert.alert("Sorry", "No Products Available");
        setIsUpdating(prevState => ({ ...prevState, [id]: false }));
      } else {
        setModalVisible1(true);
        setIsUpdating(prevState => ({ ...prevState, [id]: false }));
        setRowData(result[0]);
      }
    })
    .catch((error) => {
      setIsUpdating(prevState => ({ ...prevState, [id]: false }));
      Alert.alert("Sorry", "No Products Available");
      console.log("error", error);
    });
};

    
   useEffect(() => {
    const checkIfAnyProductUnavailable = () => {
      setIsAnyProductUnavailable(
        selectedItem.some((product) => !product?.is_available)
      );
    };
    checkIfAnyProductUnavailable();
  }, [selectedItem]);

  const [availableCount, setAvailableCount] = useState(0);
  const [unavailableCount, setUnavailableCount] = useState(0);

  useFocusEffect(
    React.useCallback(() => {
      const availableProducts = selectedItem.filter(
        (product) => product.is_available
      ).length;
      const unavailableProducts = selectedItem.filter(
        (product) => !product.is_available
      ).length;

      setAvailableCount(availableProducts);
      setUnavailableCount(unavailableProducts);
    }, [selectedItem])
  );


const [currentProduct, setCurrentProduct] = useState(null);

const loadAllCategory = async (limit, offset) => {
  setLoading(true);
  var myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${userData.token}`);
  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  try {
    const response = await fetch(`https://gsidev.ordosolution.com/api/product_categories/?limit=${limit}&offset=${offset}`, requestOptions);

    // Check if the response is OK and log it
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json(); 

    if (offset === 0) {
      setCategories(result);
      setOriginalCategories(result); 
    } else {
      setCategories((prevData) => [...prevData, ...result]);
      setOriginalCategories((prevData) => [...prevData, ...result]); 
    }

    setLoading(false);
  } catch (error) {
    console.log("Error", error);
    setLoading(false);
  }
};

// Initial load
useEffect(() => {
  loadAllCategory(queryParams.current.limit, queryParams.current.offset);
}, []);

// Function to filter categories based on search input
const filterCategories = (val) => {
  const filtered = originalCategories.filter(category =>
    category?.name?.toLowerCase().includes(val.toLowerCase())
  );
  setCategories(filtered);
};

const handleCategorySearch = (val) => {
  setSearch(val);
  filterCategories(val);
};

 useEffect(() => {
    loadAllCategory(queryParams.current.limit, queryParams.current.offset);
  }, [userData]);

 const handleModalClose = () => {
   setModalVisible(false);
   // loadAllCategory();
 };

  const handleCategorySelect = async (categoryId) => {
    setSearch("");
    setProductSearch("");
    setSelectedCategory(categoryId);
    await loadSubCategories(categoryId);
  };

  const loadSubCategories = async (categoryId) => {
    setLoading(true);
    const response = await fetch(`https://gsidev.ordosolution.com/api/product_categories/?limit=10&offset=0&cate_id=${categoryId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userData.token}`,
      },
    });
    const result = await response.json();
    setSubCategories(result);
    setLoading(false);
  };

  const loadProducts = async (categoryId, subCategoryId) => {
    setLoading(true);
    const response = await fetch(`https://gsidev.ordosolution.com/api/test_product/?limit=10&offset=0&cate_id=${categoryId}&sub_cate_id=${subCategoryId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userData.token}`,
      },
    });
    const result = await response.json();
    setProducts(result.products);
      // Update productsBySubCategory based on fetched products
    const updatedProductsBySubCategory = {};
    result.products.forEach(product => {
      const subcategoryId = product.sub_category_id.id;
      if (!updatedProductsBySubCategory[subcategoryId]) {
        updatedProductsBySubCategory[subcategoryId] = [];
      }
      updatedProductsBySubCategory[subcategoryId].push(product);
    });

    setProductsBySubCategory(updatedProductsBySubCategory);
    setLoading(false);
  };

const handleSearch = async (val) => {
  const baseUrl = "https://gsidev.ordosolution.com/api/test_product/?limit=5&offset=0";
  setSearching(true);
  const result = await searchItem(baseUrl, val, userData.token);
  setSearching(false);

  if (result) {
    const updatedProductsBySubCategory = {};

    result.products.forEach(product => {
      const subcategoryId = product?.sub_category_id.id;
      if (!updatedProductsBySubCategory[subcategoryId]) {
        updatedProductsBySubCategory[subcategoryId] = [];
      }
      updatedProductsBySubCategory[subcategoryId].push(product);
    });

    setProductsBySubCategory(updatedProductsBySubCategory);
  }
};


const debouncedSearch = useCallback(debounce(handleSearch, 500), [userData.token]);

  useEffect(() => {
    if (search.trim()) {
      debouncedSearch(search);
    console.log("!3");

    } else {
      if (expandedSubCategory) {
        loadProducts(selectedCategory, expandedSubCategory);
      }
    }
  }, [search, expandedSubCategory]);


const handleProductSearch = (val) => {
  setProductSearch(val);
  debouncedProductSearch(val);
};

// Clear search function
const handleSearchClear = () => {
  if (expandedSubCategory) {
    setProductSearch('');
    loadProducts(selectedCategory, expandedSubCategory);
  } else {
    setSearch('');
    setCategories(originalCategories);
  }
};

// Define debounced product search function
const debouncedProductSearch = useCallback(debounce(async (val) => {
  const baseUrl = `https://gsidev.ordosolution.com/api/product_categories/?limit=10&offset=0&cate_id=${selectedCategory}&search=${val}`;
  setSearching(true);
  const result = await searchItem(baseUrl, val, userData.token);
  setSearching(false);

  if (result) {
    setSubCategories(result);
  }
}, 500), [userData.token, selectedCategory]);


const handleBackToCategory = () => {
  setSelectedCategory(null);
  setSearch("");
  setProductSearch("");
  setCategories(originalCategories);
  loadSubCategories(selectedCategory);
  loadProducts(selectedCategory, expandedSubCategory);
};

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity key={item.id} style={styles.categoryItem} onPress={() => handleCategorySelect(item.id)}>
          {item.category_image ? (
                <Image
                  source={{ uri: item.category_image }}
                  style={styles.categoryImage}
                />
              ) : (
                <Image
                  source={require("../../assets/images/noImagee.png")} 
                  style={styles.categoryImage}
                />
              )}
      <Text style={styles.categoryTitle}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderSubCategoryItem = ({ item }) => {
  const subcategoryId = item.id;
  const productsForSubCategory = productsBySubCategory[subcategoryId] || [];

  return (
    <View key={subcategoryId} style={styles.subCategoryContainer}>
      <TouchableOpacity
        style={styles.subCategoryHeader}
        onPress={() => setExpandedSubCategory(expandedSubCategory === subcategoryId ? null : subcategoryId)}
      >
        <Text style={styles.subCategoryTitle}>{item.name}</Text>
        <Entypo name={expandedSubCategory === subcategoryId ? 'chevron-up' : 'chevron-down'} size={20} color='black' />
      </TouchableOpacity>
      {expandedSubCategory === subcategoryId && (
        <View style={styles.productsContainer}>
            <FlatList
              data={productsForSubCategory}
              renderItem={renderProductItem}
              contentContainerStyle={{ paddingBottom: "20%" }}
              keyExtractor={(item) => item.id.toString()}
              onEndReachedThreshold={0.5}
              onEndReached={() => onEndReached(selectedCategory, expandedSubCategory)}
              ListEmptyComponent={<Text style={styles.noDataText}>No Data Available</Text>}
            />
        </View>
      )}
    </View>
  );
};

//APi to get the Order Details using the order ID 
const getSoDetails = async () => {

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", `Bearer ${userData.token}`);

  const raw = "";

  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch(
    `https://gsidev.ordosolution.com/api/stock_order_detail/${orderDetails?.id}/`,
    requestOptions
  )
    .then((response) => response.json())
    .then(async (result) => {
      setOrderDetails(result);
      hideModal1();
      hideModal();
    })
    .catch((error) => {
      console.log("🚀 ~ getDropdownProduct ~ error:", error)
    });
};


const renderProductItem = useCallback(({ item }) => {
    return (
        <View
            style={{
                backgroundColor: "#f2f2f2",
                marginHorizontal: "1%",
                marginTop: 5,
                marginBottom: "3%",
                elevation: 5,
                ...globalStyles.border,
                borderTopLeftRadius: 20,
                borderBottomRightRadius: 20,
            }}
        >
            <Pressable
                style={{ padding: 10 }}
                onPress={() => handleCheckboxChange(item)}
            >
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "center",
                    }}
                >
                    <View
                        style={{
                            backgroundColor: "white",
                            elevation: 5,
                            ...globalStyles.border,
                            borderRadius: 20,
                            padding: "3%",
                        }}
                    >
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
                    </View>
                    <View
                        style={{
                            flex: 1,
                            marginLeft: 10,
                        }}>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}>
                            <Text
                                style={{
                                    fontSize: 12,
                                    color: Colors.primary,
                                    fontFamily: "AvenirNextCyr-Bold",
                                    flexWrap: "wrap",
                                    flex: 2,
                                }}
                            >
                                {item.name}
                            </Text>
                            <Checkbox.Android
                                color={Colors.primary}
                                status={
                                    selectedItem.some(
                                        (product) => product.id === item.id
                                    ) ? "checked" : "unchecked" }
                            />
                        </View>
                        <Text
                            style={{
                                color: "black",
                                fontSize: 12,
                                fontFamily: "AvenirNextCyr-Medium",
                                marginTop: 1,
                            }}
                        >
                            UOM : {item.unit_of_measure}
                        </Text>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <Text
                                style={{
                                    color: Colors.primary,
                                    fontSize: 12,
                                    fontFamily: "AvenirNextCyr-Medium",
                                }}
                            >
                                Stock: {item.stock}{" "}
                            </Text>
                        </View>
                    </View>
                </View>
            </Pressable>
        </View>
    );
}, [selectedItem]);


const MemoizedFlatList = useMemo(() => {
  return (
    <FlatList
      data={products}
      renderItem={renderProductItem}
      contentContainerStyle={{ paddingBottom: "20%" }}
      keyExtractor={(item) => item.id.toString()}
      onEndReachedThreshold={0.5}
      onEndReached={() => onEndReached(selectedCategory, expandedSubCategory)}
      ListEmptyComponent={<Text style={styles.noDataText}>No Data Available</Text>}
    />
  );
}, [products, loading,addedItems]);


const onEndReached = (categoryId, subCategoryId) => {
  if (search.trim()) {
    return;
  }
  if (!loading) {
    queryParams.current.offset += queryParams.current.limit;
    setLoading(true);

    if (selectedCategory) {
      loadProducts(categoryId, subCategoryId);
    } else {
      loadAllCategory(queryParams.current.limit, queryParams.current.offset);
    }
  }
};


const handleCheckboxChange = (item) => {

    setselectedItems((prevselectedItems) => {
        const isSelected = prevselectedItems.some((product) => product.id === item.id);
        if (isSelected) {
            // Remove the product from selectedItem
            return prevselectedItems.filter((product) => product.id !== item.id);
        } else {
            // Add the product to selectedItem
            return [
                ...prevselectedItems,
                {
                    brand: item.brand,
                    cust_price: '',
                    hsc_code: item.hsc_code,
                    id: item.id,
                    is_available: true,
                    loaded_qty: 1,
                    lower_price_cap: item.lower_price_cap,
                    mfd: item.mfd,
                    name: item.name,
                    cust_price: item.product_price * 100,
                    price: item.product_price,
                    product_category: item.product_category,
                    product_id: item.id,
                    product_image: item.product_image,
                    product_tax: item.product_tax,
                    product_weight: item.product_weight,
                    remaining_qty: '',
                    remarks: '',
                    route_product_status: "Pending",
                    stock: item.stock,
                    stock_comments: '',
                    quantity:1,
                    total_weight:0,
                    loaded_uom:item?.unit_of_measure,
                    thickness:item?.thickness,
                    weight:item?.weight,
                    width:item?.width,
                    bundle_piece:item?.bundle_piece,
                    length:item?.length
                },
            ];
        }
    });
};


const handleQuantityChange = (item, action) => {

    let numericValue = parseInt(item.quantity);

    if (action === 'increment') {
        // Increment quantity by 1 and reset stockError
        item.quantity = numericValue + 1;
        item.stockError = false;
        setselectedItems([...selectedItem]);
    } else if (action === 'decrement' && numericValue > 1) {
        // Decrement quantity by 1 and reset stockError
        item.quantity = numericValue - 1;
        item.stockError = false;
        setselectedItems([...selectedItem]);
    } else if (action === '') {
        // Handle the case when the input field is cleared
        item.quantity = '';
        setselectedItems([...selectedItem]); 
    } else if (!isNaN(action) && action >= 0) {
        // Update quantity to the entered value and reset stockError
        item.quantity = parseInt(action);
        item.stockError = false;
        setselectedItems([...selectedItem]);
    } else if (isNaN(numericValue) || numericValue < 1) {
        // Set quantity to 1 and reset stockError
        item.quantity = 1;
        item.stockError = false;
        setselectedItems([...selectedItem]);
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


  const handleToggleCheckbox = (item) => {

     console.log("🚀 ~ handleToggleCheckbox ~ item:------------>", item);
     
    if (item.is_available && orderDetails?.status === "Collection Approved") {
      setVisible(true);
      setCurrentProduct(item);
    } else if (item.is_available && orderDetails?.status === "Missing Product"){
      updateProductAvailability(item, false, "");
    }else {
      updateProductAvailability(item, true, "");
    }
  };

  const updateProductAvailability = (item, isAvailable, remarks) => {
  if(orderDetails?.status === "Collection Approved"){
       setselectedItems((prevProducts) => {
      return prevProducts.map((product) =>
        product.id === item.id
          ? { ...product, is_available: isAvailable, remarks: remarks }
          : product
      );
    });
     }else{
      setselectedItems((prevProducts) => {
        return prevProducts.map((product) =>
          product.id === item.id
            ? { ...product, is_available: isAvailable, remarks: remarks }
            : product
        );
    });
     }
  };


  const checkEmpty = () => {

    if(orderDetails?.is_production === true && orderDetails?.product_list[0]?.name ==='BASE PLATE'){
      stockApproveForBase();
    } else if (orderDetails?.is_production === true ){
      stockApproveForPPGL();
    } else {
     stockApprove();
    }
  };
  
  const changeStatus = async (status) => {
    // Display a confirmation dialog
    Alert.alert(
      status === "Missing Product" ? "Confirm Rejection" : "Approve",
      status === "Missing Product"
        ? `You have marked ${unavailableCount} products missing. Confirming would notify sales team. Do you wish to proceed?`
        : "Confirming this order would move to dispatch. Please note order cannot be edited further",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            let url = `https://gsidev.ordosolution.com/api/sales_order/${orderDetails?.id}/`;
            setLoading(true);
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", `Bearer ${userData.token}`);
          
            if (status === "Missing Product") {
              so_raw = JSON.stringify({
                status: status,
                company:orderDetails?.company,
                product_status: selectedItem.map((product) => ({
                  id: product.id,
                  is_available: product.is_available,
                  remarks: product.is_available ? "" : product.remarks,
                })),
              });
            } else {
                so_raw = JSON.stringify({
                status: status,
                stock_approve_by :userData.id,
                company:orderDetails?.company,
                product_status: selectedItem.map(product => ({
                  id: product.idd ? product.idd : product.id,
                  stock_comments: product?.remarks,
                  stock_array: product?.product_array
                    ? product?.product_array
                        .filter(item => item?.isSelected) 
                        .map(item => ({
                          id: item?.stock_id, 
                          qty: parseInt(item?.qty)
                        }))
                    : []
                })),
              });
            }

            var requestOptions = {
              method: "PUT",
              headers: myHeaders,
              body: so_raw,
              redirect: "follow",
            };

            console.log("Rawwww------------------->",so_raw)

            await fetch(url, requestOptions)
              .then((response) => {
                if (response.status === 200) {
                  Toast.show("Order updated successfully", Toast.LONG);
                  setVisible(false);
                  getOrderDetails();
                  navigation.goBack();
                }
              })

              .catch((error) => console.log("api error", error));
            setLoading(false);
          },
        },
      ]
    );

  };

  //API to save the Dimension Data Base Plate
const saveStockData = (status) => {

  // Remove stock_comment from OrderRawData
  const cleanedOrderRawData = {
    ...OrderRawData,
    production_list: Array.isArray(OrderRawData.production_list)
      ? OrderRawData.production_list.map(item => {
          const { stock_comment, ...cleanedItem } = item;
          return {
            ...cleanedItem,
            dimensions: item.dimensions.map(dimension => {
              const { dimension_id, stock_comment, ...cleanedDimension } = dimension;
              return {
                ...cleanedDimension,
                stock_deduct_data: dimension.stock_deduct_data.map(stock => {
                  const { parent_stock_id, ...cleanedStock } = stock; // Remove parent_stock_id
                  return cleanedStock;
                }),
                dimension_id: dimension.dimension_id === "" ? undefined : dimension.dimension_id // If dimension_id is empty, exclude it
              };
            })
          };
        })
      : [] // If production_list is undefined or not an array, default to an empty array
  };
  

  // Display a confirmation dialog
  Alert.alert("Save Dimension", "Are you sure you want to Save Dimensions ?", [
      {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
      },
      {
          text: "Yes",
          onPress: () => {
            {status === 'Submit' ? setIsUpdating11(true) : setIsUpdating1(true)  }
              var myHeaders = new Headers();
              myHeaders.append("Content-Type", "application/json");
              myHeaders.append("Authorization", `Bearer ${userData.token}`);

              var raw = JSON.stringify({
                  order_id: orderDetails?.id,
                  production_list: cleanedOrderRawData?.production_list
              });

              console.log('==================== Save Base ==================');
              console.log(raw);
              console.log('==================== ========= ==================');

              var requestOptions = {
                  method: "POST",
                  headers: myHeaders,
                  body: raw,
                  redirect: "follow"
              };

              fetch(`https://gsidev.ordosolution.com/api/production/dimension_save_version2/`,
                  requestOptions )
                  .then((response) => {
                      console.log("🚀 ~ .then ~ response:", response)
                      if (response.status === 200) {
                          Toast.show("Dimensions Saved successfully", Toast.LONG);
                          {status === 'Submit' ? getSoDetails() : navigation.goBack() }
                          {status === 'Submit' ? setIsUpdating11(false) : setIsUpdating1(false)}
                      }else{
                          Toast.show("Something went wrong", Toast.LONG);
                          {status === 'Submit' ? setIsUpdating11(false) : setIsUpdating1(false)}
                      }
                  })
                  .catch((error) => {console.log("api error", error); {status === 'Submit' ? setIsUpdating11(false) : setIsUpdating1(false)}});
          },
      },
  ]);
};


  //API to save the Dimension Data PPGL
  const saveStockDataPPGL = (status) => {

    // Remove stock_comment from OrderRawData
    const cleanedOrderRawData = {
      ...productionData,
      production_list: Array.isArray(productionData.production_list)
        ? productionData.production_list.map(item => {
            const { stock_comment, ...cleanedItem } = item;
            return {
              ...cleanedItem,
              dimensions: item.dimensions.map(dimension => {
                const { dimension_id, stock_comment, ...cleanedDimension } = dimension;
                return dimension.dimension_id === ""
                  ? cleanedDimension // If dimension_id is empty, exclude it
                  : { ...cleanedDimension, dimension_id }; // If not empty, keep it
              })
            };
          })
        : [] // If production_list is undefined or not an array, default to an empty array
    };
  
  
    // Display a confirmation dialog
    Alert.alert("Save Dimension", "Are you sure you want to Save Dimensions ?", [
        {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
        },
        {
            text: "Yes",
            onPress: () => {
              {status === 'Submit' ? setIsUpdating11(true) : setIsUpdating1(true)  }
              
                var myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");
                myHeaders.append("Authorization", `Bearer ${userData.token}`);
  
                var raw = JSON.stringify({
                    order_id: orderDetails?.id,
                    production_list: cleanedOrderRawData?.production_list
                });
  
                console.log('==============raw========================');
                console.log(raw);
                console.log('==============raw========================');
  
                var requestOptions = {
                    method: "POST",
                    headers: myHeaders,
                    body: raw,
                    redirect: "follow"
                };
  
                fetch(`https://gsidev.ordosolution.com/api/production/dimension_save_version2/`,
                    requestOptions )
                    .then((response) => {
                        console.log("🚀 ~ .then ~ response:", response)
                        if (response.status === 200) {
                            Toast.show("Dimensions Saved successfully", Toast.LONG);
                            {status === 'Submit' ? getSoDetails() : navigation.goBack() }
                            {status === 'Submit' ? setIsUpdating11(false) : setIsUpdating1(false)  }
                        }else{
                            Toast.show("Something went wrong", Toast.LONG);
                            {status === 'Submit' ? setIsUpdating11(false) : setIsUpdating1(false)  }
                        }
                    })
                    .catch((error) => {console.log("api error", error);   {status === 'Submit' ? setIsUpdating11(false) : setIsUpdating1(false) }});
            },
        },
    ]);
  };
  

  const getOrderDetails = async () => {
    setLoading(true);
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "text/plain");
    myHeaders.append("Authorization", `Bearer ${userData.token}`);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    await fetch(
      `https://gsidev.ordosolution.com/api/sales_order/${orderDetails?.id}/`,
      requestOptions
    )
      .then((response) => response.json())
      .then(async (result) => {
        console.log("🚀 ~ .then ~ result:--------------->", result)
        setOrderDetails(result);
      })
      .catch((error) => console.log("getOrderDetails api error", error));
    setLoading(false);
  };

  const handleReject = () => {
    changeStatus("Missing Product");
  };

  const handleSubmit = () => {
    if (value === "1" && remarks.trim() === "") {
      setError("Please enter remarks");
    } else if (value === "2" && conRemarks.trim() === "") {
      setError("Please enter remarks");
    } else if (currentProduct) {
      if (value === "1") {
        updateProductAvailability(currentProduct, false, remarks);
        setRemarks("");
      } else if (value === "2") {
        updateProductAvailability(currentProduct, true, conRemarks);
        setConRemarks("");
      }
      setVisible(false);
      setError("");
    }
  };

  const handleCompanySelect = (item) => {

    console.log('===============item=====================');
    console.log(item);
    console.log('=================item===================');
    
    setSelectedProductId(item?.key);

    if (item?.key !== null && item?.key !== undefined) {
      if (value1 === "1") {
        FetchDataforBasePlate(item?.key);

      } else if (value1 === "2") {
        FetchDataforPPGLCoile(item?.key);
      }
    }
};

console.log('=============value1=======================');
console.log(value1);
console.log('====================================');


useEffect(()=>{

  if (value1 === "1") {
    getDropdownProductBasePlate(rowMM);
  } else if (value1 === "2") {
    getDropdownProduct(rowMM);
  }

},[value1 ])


  return (
    <PaperProvider theme={DefaultTheme}>
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
              numberOfLines={4}
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
                numberOfLines={4}
               >
              {orderDetails?.name} ({orderDetails?.assignee_name}-
              {orderDetails?.assigne_to})
            </Text>
            {orderDetails?.is_production !== true &&
               (orderDetails?.status === "Collection Approved" || orderDetails?.status === "Missing Product") && (
                 <TouchableOpacity
                   onPress={() => {
                     navigation.navigate("OrderRevStockDetailsEdit", { orderDetails: orderDetails, screen: "SO" });
                   }}
                   style={{
                     backgroundColor: Colors.primary,
                     borderRadius: 5,
                     padding: 5,
                     elevation: 4,
                     height: 34,
                     width: 35,
                   }} >
                   <AntDesign name="edit" size={22} color={Colors.white} />
                 </TouchableOpacity>
               )}
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
                orderDetails?.status === "Collection Approved"
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
                  : orderDetails?.assignee_name}
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
                  <Text style={{...styles.value,flex:1, textAlign: 'right'}} numberOfLines={4}>{orderDetails?.site_address}</Text>
              </View>
                         
              <View style={{ ...styles.row }}>
                <Text style={{ ...styles.title }}>Order Image</Text>
                <TouchableOpacity onPress={() => setModalVisibleBill(true)}>
                    <Text style={{ ...styles.value,color:'blue' }}>
                        View
                    </Text>
                </TouchableOpacity>
            </View>

           {orderDetails?.status == "Stock Approved" &&
            <View style={styles.row}>
              <Text style={styles.title}>Approved By</Text>
               <Text style={styles.value}>{orderDetails?.stock_approve_name}</Text> 
            </View>
           }
            <View style={styles.row}>
                <Text style={styles.title}>Transportation type</Text>
                <Text style={styles.value}>{orderDetails?.transportation_type}</Text>
            </View>

           <View style={styles.row}>
              <Text style={styles.title}>Total Price</Text>
               <Text style={styles.value}>
                 { parseFloat(orderDetails?.total_price).toFixed(2)? 
                   new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(parseFloat(orderDetails?.total_price).toFixed(2)) : 
                   new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(0)
                 }
              </Text> 
            </View>

            {orderDetails?.status == "Missing Product" && orderDetails?.remarks &&(
              <View style={styles.row}>
                <Text style={styles.title}>Remark :</Text>
                <Text
                  style={[
                    styles.value,
                    { color: "red", width: "80%", textAlign: "right" },
                  ]}
                >
                  {orderDetails?.remarks}
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
         {orderDetails?.status === "Collection Approved" || orderDetails?.status === "Missing Product"  ?

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
                    {orderDetails?.status !== "Confirmed" && (
                      <Checkbox.Android
                        color={Colors.primary}
                        status={item.is_available ? "checked" : "unchecked"}
                        onPress={() => {handleToggleCheckbox(item)}}
                      />
                    )}
                  </View>
                    {item?.product_remarks && item?.product_remarks != "" &&(
                      <View style={{ flexDirection: 'row',justifyContent:'space-between'}}>
                      <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}>Product Remark :  </Text>
                      <Text style={{ color: 'green', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium',width:'55%'}}>{item?.product_remarks}</Text>
                       </View> )
                    }

                  {orderDetails?.status == "Confirmed" && item.stock_comments && item?.stock_comments != "" && (
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
                  {item.remarks && item?.remarks != "" && 
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
                            { !orderDetails?.is_production &&
                              <TouchableOpacity style={{ height: 32,
                                paddingHorizontal: 5,
                                borderRadius: 10,
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor: item?.availableStock ? 'rgba(0, 128, 0, 0.6)'  :Colors.primary ,
                                flexDirection:'row',
                                gap:3}}  onPress={()=>{ModelVisible(item?.loaded_uom ,item?.product_id ,item?.name,item?.quantity ,item?.idd)}}  disabled={isUpdating[item?.idd]}>
                                 {isUpdating[item.idd] ? (
                                   <ActivityIndicator size="small" color="#fff" />
                                 ) : (
                                  <Text style={{color:'white', fontSize:11, fontFamily: "AvenirNextCyr-Bold"}}>{item?.availableStock> 0 ?'Stock Available' :'Check Stock'}</Text>
                                 )}
                               </TouchableOpacity>
                               }



{/* 
      //  03-Apr-2025 | Sahana 
      // We check whether it's a production order, when a button is clicked, modal opens where data is prepopulated from productionData */}

                          { orderDetails?.is_production && orderDetails?.product_list[0]?.name !=='BASE PLATE' &&
                               <TouchableOpacity 
                                  style={{ height: 32,
                                    paddingHorizontal: 5,
                                    borderRadius: 10,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    backgroundColor: 
                                    productionData?.production_list.some(
                                      (prod) =>
                                      prod?.product_id === item?.id &&
                                      prod?.stock_deduct_data?.length > 0 && 
                                      prod?.dimensions &&
                                      prod?.dimensions.every(
                                        (dim) =>
                                          dim?.width_ft !== ""&&
                                          dim?.height_inch !== ""&&
                                          dim?.nos !== ""
                                      )
                                    )
                                    ? 'rgba(0, 128, 0, 0.8)'
                                    : Colors.primary, 
                                    gap:3 }}
                                    onPress={()=>{ProdModelVisible(item?.name ,item?.id, item?.idd , item?.weight , item?.production_data)}}>
                                  <Text style={{color:'white', fontSize:11, fontFamily: "AvenirNextCyr-Bold"}}>{productionData?.production_list.some(
                                    (prod) =>
                                      prod?.product_id === item?.id &&
                                      prod?.stock_deduct_data?.length > 0 && 
                                      prod?.dimensions &&
                                      prod?.dimensions.every(
                                        (dim) =>
                                          dim?.width_ft !== "" && 
                                          dim?.height_inch !== "" && 
                                          dim?.nos !== ""
                                      )
                                   )
                                    ? 'Dimensions Added'
                                    : 'Add Dimensions'}</Text>
                               </TouchableOpacity>
                            }

                         { orderDetails?.is_production &&
                           orderDetails?.product_list?.[0]?.name === 'BASE PLATE' && (
                             <TouchableOpacity
                             style={{
                               height: 32,
                               paddingHorizontal: 5,
                               borderRadius: 10,
                               justifyContent: 'center',
                               alignItems: 'center',
                               backgroundColor: allDimensionsAdded ? 'green' : Colors.primary,
                             }}
                             onPress={()=>{ProdModelVisible(item?.name ,item?.id, item?.idd ,item?.weight)}}
                           >
                             <Text
                               style={{
                                 color: 'white',
                                 fontSize: 11,
                                 fontFamily: 'AvenirNextCyr-Bold',
                               }}
                             >
                               {allDimensionsAdded ? 'Dimensions Added' : 'Add Dimensions'}
                             </Text>
                           </TouchableOpacity>
                         )}
                     </View>
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
                    }}>
                    <Text
                      style={{
                        color: Colors.primary,
                        fontSize: 14,
                        fontFamily: "AvenirNextCyr-Medium",
                        marginTop: 5,
                        width: "80%",
                      }}>
                      {item.name}
                    </Text>
                      
                    {(orderDetails?.status !== "Stock Approved" && orderDetails?.status !== 'Pending Production' )&& (
                      <Checkbox.Android
                        color={Colors.primary}
                        status={item.is_available ? "checked" : "unchecked"}
                        onPress={() => handleToggleCheckbox(item)}
                      />
                    )}

                    { orderDetails?.status === 'Pending Production' &&
                     <TouchableOpacity 
                        style={{ height: 32,
                          paddingHorizontal: 5,
                          borderRadius: 10,
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: item?.availableStock ? 'rgba(0, 128, 0, 0.6)':Colors.primary ,
                          flexDirection:'row',
                          gap:3 }}
                          onPress={()=>{ProdModelSizeVisible(item?.name ,item?.production_data,item?.stock_deduct_data)}}>
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
                        }}>
                        {item?.product_category} 
                      </Text>
                   <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: "3%",
                      justifyContent: "space-between",
                    }}>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}>
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
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Text
                        style={{
                          color: "black",
                          fontSize: 12,
                          fontFamily: "AvenirNextCyr-Medium",
                        }}
                      >
                        Price :{" "}
                      </Text>
                      <Text
                        style={{
                          color: "black",
                          fontSize: 12,
                          fontFamily: "AvenirNextCyr-Medium",
                        }}
                      >
                        {item.price}
                      </Text>
                    </View>
                  </View>

                  {orderDetails?.status == "Pending Production" &&  item?.stock_comments && item?.stock_comments!="" &&(
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
                

                  {orderDetails?.status == "Confirmed" && item?.stock_comments && item?.stock_comments !="" && (
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

      {orderDetails?.status == "Collection Approved" && (
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <TouchableOpacity
            onPress={() => {
              if (isAnyProductUnavailable) handleReject();
            }}

            style={[
              styles.TwoButtons,
              { backgroundColor: isAnyProductUnavailable ? "tomato" : "grey" },
            ]}
            disabled={!isAnyProductUnavailable}
          >
            <Text style={styles.Btext}>Reject</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              if (!isAnyProductUnavailable) checkEmpty();
            }}
            style={[
              styles.TwoButtons,
              { backgroundColor: !isAnyProductUnavailable ? "green" : "grey" },
            ]}
            disabled={isAnyProductUnavailable}
          >
            {isUpdating1 ?
               <ActivityIndicator size="small" color="#fff" />
           :
            <Text style={styles.Btext}>Confirm Order</Text>
          }
          </TouchableOpacity>
        </View>
      )}

      {orderDetails?.status == "Missing Product" && (
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            onPress={() => {
              if (!isAnyProductUnavailable) checkEmpty();
            }}
            style={{
              backgroundColor: !isAnyProductUnavailable ? "green" : "grey",
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              paddingVertical: "3%",
              borderRadius: 20,
            }}
            disabled={isAnyProductUnavailable} >
             {isUpdating1 ?
              <ActivityIndicator size="small" color="#fff" />
               :
              <Text style={styles.Btext}>Approve</Text>
             }
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

             {stockDeductDataPresentID || stockDeductDataPresent ? (
              <Text style={{color: 'tomato', fontSize: 15 ,fontFamily: "AvenirNextCyr-Medium",marginTop:'2%'}}>Once the stock is added, you cannot reject the order</Text>
              ) : (
              null
              )}

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
                  disabled: stockDeductDataPresentID || stockDeductDataPresent, 
                  style:
                    value === "1" && !(stockDeductDataPresentID || stockDeductDataPresent)
                      ? styles.selectedButton
                      : styles.button,
                  labelStyle:
                    value === "1" && !(stockDeductDataPresentID || stockDeductDataPresent)
                      ? styles.selectedLabel
                      : styles.label,
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
                // onPress={() => { navigation.navigate('OrderReturn', { orderDetails: orderDetails }) }}
                onPress={handleSubmit}
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

  <Modal visible={modalVisible} onRequestClose={handleModalClose} animationType="slide" transparent>
    <SafeAreaView style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
         {selectedCategory ? (
         <TouchableOpacity
          onPress={handleBackToCategory}    
         >
         <Ionicons name="arrow-back" size={24} color="grey" />
     </TouchableOpacity>
      ) : <Text> </Text>}

          <Text style={styles.modalTitle}>Add Products</Text>
          <TouchableOpacity
            style={{
              marginRight: 10,
              backgroundColor: "#F1F1F1",
              paddingVertical: 5,
              paddingHorizontal: 5,
              borderRadius: 30,
            }}
            onPress={handleModalClose}>
            <Entypo name="cross" size={16} color="grey" />
          </TouchableOpacity>
        </View>

{selectedCategory ? (
  <>
    {expandedSubCategory ? (
      <Searchbar
        placeholder="Search Products"
        onChangeText={(val) => setSearch(val)}
        value={search}
        loading={searching}
        onIconPress={handleSearchClear}
      />
    ) : (
      <Searchbar
        placeholder="Search Subcategory Products"
        onChangeText={handleProductSearch}
        value={productSearch}
        loading={searching}
        onIconPress={handleSearchClear}
      />
    )}
  </>
) : (
  <Searchbar
    placeholder="Search Categories"
    onChangeText={handleCategorySearch}
    value={search}
    loading={searching}
    onIconPress={handleSearchClear}
  />
)}
        {selectedCategory ? (
          <FlatList
            data={subCategories}
            renderItem={renderSubCategoryItem}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={<Text style={styles.noDataText}>No Subcategories Available</Text>}
          />
        ) : (
          <FlatList
            data={categories}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            key={'_'}
            columnWrapperStyle={{ justifyContent: 'space-around' }}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.5}
            ListEmptyComponent={<Text style={styles.noDataText}>No Categories Available</Text>}
          />
        )}
      </View>
    </SafeAreaView>
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

      <Text style={styles.ModalText1} numberOfLines={4}>{selectedItemName}</Text>
      <Text style={{color: 'green', fontSize: 14, fontWeight: '600'}}>Required Qty: {selectedItemRemain} {selectedUOM}</Text>

  <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ marginHorizontal: 5, marginTop: '3%', height: 200 }} vertical>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottomWidth: 1,
          borderBottomColor: '#D3D3D3',
          marginTop: '2%',
        }}>
        </View>
        <View style={{marginTop:'5%'}}>
        <Text style={{color: 'black', fontSize: 18 ,fontFamily: "AvenirNextCyr-Medium",marginTop:'2%'}}>Locked Qty: {parseFloat(rowData?.locked_qty_sum).toFixed(3)} {selectedUOM}</Text>
        <Text style={{color: 'black', fontSize: 18 ,fontFamily: "AvenirNextCyr-Medium",marginTop:'2%'}}>Total Qty: {parseFloat(rowData?.total_uom_qty_sum).toFixed(3)} {selectedUOM}</Text>
        <Text style={{color: 'black', fontSize: 18 ,fontFamily: "AvenirNextCyr-Medium",marginTop:'2%'}}>Available Qty: {parseFloat(rowData?.latest_qty).toFixed(3)} {selectedUOM}</Text>
        </View>

      </ScrollView>
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
              onPress={() => {
                saveRowsToSelectedItem();
              }}
              style={{ paddingVertical: "4%", justifyContent: "center", alignItems: "center" }}
            >
              <Text style={{ fontFamily: "AvenirNextCyr-Bold", color: "white" }}>Submit</Text>
            </TouchableOpacity>
          </LinearGradient>
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

<Portal>
<PaperModal visible={visible2} onDismiss={hideModal1} contentContainerStyle={containerStyle} avoidKeyboard={true}>
<KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} >
 
  <View style={styles.modalContainer2}>
    <View style={styles.modalContent2}>

    <TouchableOpacity
      style={{...styles.closeIcon,marginTop:'2%'}}
      onPress={() => {hideModal1()}}
     >
    <AntDesign name="close" color="black" size={25} />
  </TouchableOpacity>

  <View style={{ marginHorizontal: '1%', marginTop: '3%', gap: 1 }}>
  <View>
    <View  style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap:5
    }}>
      
    <Text style={styles.ModalText2} numberOfLines={4}>{selectedItemName}</Text>

    <TouchableOpacity onPress={()=>{FetchDataforMsPlate(stockId)}}  style={{ 
    padding: 8, 
    backgroundColor: productionData?.production_list?.find(item => item.product_id === selectedProductIds)?.stock_deduct_data?.length > 0 ? 'green' : 'tomato', 
    marginVertical: 10, 
    alignItems: 'center', 
    borderRadius: 10, 
    marginVertical: 11 
  }}
>
  <Text style={{ color: 'white' }}>
    {productionData?.production_list?.find(item => item.product_id === selectedProductIds)?.stock_deduct_data?.length > 0 ? 'Stock Added' : 'Add Stock'}
  </Text>
</TouchableOpacity>

    <TouchableOpacity onPress={addRow} style={{ padding: 10, backgroundColor: 'green', marginVertical: 5, alignItems: 'center', borderRadius: 10 }}>
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
       </View>
       <ScrollView 
    style={{ flex: 1 }} 
    contentContainerStyle={{ flexGrow: 1 }} 
    keyboardShouldPersistTaps="handled"
  >
    <ScrollView 
      horizontal 
      contentContainerStyle={{ minWidth: 520 }}
      keyboardShouldPersistTaps="handled"
    >
       <View style={{ marginHorizontal: '1%', gap: 1 }}>
         <View style={{
            flexDirection: 'row',
            marginBottom: 1,
            alignItems: 'center',
            gap: 5
            }}>
       
          <View style={{ marginHorizontal: '1%', marginTop: '3%', gap: 1}}>
          <View style={{ flexDirection: 'row', marginBottom: 10, alignItems: 'center', width: '100%', gap: 1}}>
  
        
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
                        keyboardType="number-pad"
                        returnKeyType="done"
                      />

                      <TextInput
                        style={{ borderWidth: 1, padding: 5,width: 100}}
                        value={item.input2}
                        placeholder="0.00"
                        onChangeText={(text) => handleInputChange(index, 'input2', text)}
                        keyboardType="number-pad"
                        returnKeyType="done"
                      />

                      <TextInput
                        style={{ borderWidth: 1, padding: 5, width: 90 }}
                        value={item.input3}
                        placeholder="0.00"
                        onChangeText={(text) => handleInputChange(index, 'input3', text)}
                        keyboardType="number-pad"
                        returnKeyType="done"
                      />

                        <TouchableOpacity onPress={() => item?.input4 === '' ? deleteRow(index): handleDeletePPGL(index,item?.input4 ) } style={{ padding: 5 }}>
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
         </ScrollView> 
         <View style={{ alignItems: 'center', marginTop: 9 }}>
            <Text style={{ fontSize: 15, fontFamily: "AvenirNextCyr-Bold", color: 'black' }}>Total Feet: {totalFeet}</Text>
            <Text style={{ fontSize: 15, fontFamily: "AvenirNextCyr-Bold", color: 'black' }}>Total NOS: {totalNo}</Text>
            <Text style={{ fontSize: 15, fontFamily: "AvenirNextCyr-Bold", color: 'black' }}>Total Weight: {totalkg} Kg</Text>
         </View>
         
      <View style={{ alignItems: 'center', marginTop: 9 ,flexDirection:'row',justifyContent:'space-between',gap:5}}>

          <LinearGradient
            colors={Colors.linearColors}
            start={Colors.start}
            end={Colors.end}
            locations={Colors.ButtonsLocation}
            style={{
              borderRadius: 20,
              width:'50%',
              height:55
            }} >
            <TouchableOpacity
              onPress={() => {saveStockDataPPGL('Save')}}
                style={{ paddingVertical: "9%", justifyContent: "center", alignItems: "center" }}>
                {isUpdating1 ?
                 <ActivityIndicator size="small" color="#fff" /> :
                 <Text style={{ fontFamily: "AvenirNextCyr-Bold", color: "white" ,alignItems: "center" , fontSize: 15}}>Save</Text>
                }
            </TouchableOpacity>
          </LinearGradient>
          
          <LinearGradient
            colors={Colors.linearColors}
            start={Colors.start}
            end={Colors.end}
            locations={Colors.ButtonsLocation}
            style={{
              borderRadius: 20,
              width:'50%',
              height:55
            }} >
            <TouchableOpacity
              onPress={() => {
                saveRowsForPPGLDimention();}}
                style={{ paddingVertical: "9%", justifyContent: "center", alignItems: "center" }}>
                  {isUpdating11 ?
                 <ActivityIndicator size="small" color="#fff" /> :
                 <Text style={{ fontFamily: "AvenirNextCyr-Bold", color: "white" ,alignItems: "center" , fontSize: 15}}>Submit</Text>
                 }
            </TouchableOpacity>
          </LinearGradient>
       </View>

        </View>
      </View>
    {/* </View> */}
  </KeyboardAvoidingView>
</PaperModal>
</Portal>

<Modal visible={modalVisible3} transparent>
<KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'} >
    <View style={styles.modalContainer11}>
      <View style={styles.modalContent3}>
        <Text style={[styles.ModalText1,{ marginBottom:'3%' }]} numberOfLines={4}>{selectedItemName}</Text>

        <SegmentedButtons
          value={value1}
          onValueChange={setValue1}
          buttons={[
            {
              value: "1",
              label: "BASE PLATE",
              style: value1 === "1" ? styles.selectedButton : styles.button,
              labelStyle: value1 === "1" ? styles.selectedLabel : styles.label,
            },
            {
              value: "2",
              label: "PLATES / SHEETS",
              style: value1 === "2" ? styles.selectedButton : styles.button,
              labelStyle: value1 === "2" ? styles.selectedLabel : styles.label,
            }
          ]}
        />
        
         <Dropdown
          style={{
            width: '100%',
            height: 50,
            borderColor: '#ccc',
            borderWidth: 1,
            borderRadius: 8,
            paddingHorizontal: 10,
            color: "black",
            marginTop:'3%'
          }}
            data={companyOptions}
            labelField="value"
            valueField="key"
            placeholder="Select a Product"
            placeholderStyle={{ fontSize: 15, color: '#888' }}
            selectedTextStyle={{ fontSize: 15 ,color:'black'}}
            itemTextStyle={{ fontSize: 15 ,color:'black'}}
            inputSearchStyle={{ height: 30, fontSize: 14 ,color:'black'}}
            value={selectedProductId}
            onChange={handleCompanySelect}
        />

        <View style={{ marginHorizontal: 5, marginTop: '3%', height: 200 }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ width: 500  }}
          >
            <View style={{ marginHorizontal: '1%', marginTop: '3%', gap: 1 }}>
              <View style={{
                flexDirection: 'row',
                marginBottom: 1,
                alignItems: 'center',
                gap: 5,
              }}>
                <Text style={{ fontSize: 13, fontWeight: 'bold', textAlign: 'center', color: 'black', width: "17%" }}>Enter Qty</Text>
                <Text style={{ fontSize: 13, fontWeight: 'bold', textAlign: 'center', color: 'black',  width: value1 === "1" ? "15%" : "15%" }}>Stock</Text>
                {value1 === "2" && (
                <Text style={{ fontSize: 13, fontWeight: 'bold', textAlign: 'center', color: 'black', width: "14%" }}>UOM</Text>
                )}
                 {value1 === "2" && (
                <Text style={{ fontSize: 13, fontWeight: 'bold', textAlign: 'center', color: 'black', width: "15%" }}>Pieces</Text>
                )}
                <Text style={{ fontSize: 13, fontWeight: 'bold', textAlign: 'center', color: 'black', width: "22%" }}>Batch code</Text>
                {value1 === "1" && (
                <Text style={{ fontSize: 13, fontWeight: 'bold', textAlign: 'center', color: 'black', width: "25%" }}>Weight</Text>
                )}
                </View>

              <View style={{ flexDirection: 'row', marginBottom: 10, alignItems: 'center', width: '100%', gap: 1 }}>
                <FlatList
                  data={rowData1}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item, index }) => {
                    return (
                    <View key={index} style={{ flexDirection: 'row', marginBottom: 10, alignItems: 'center', width: '100%', gap: 1 }}>
                      <TextInput
                        style={{ width: 70, borderWidth: 1, borderColor: '#ccc', padding: 5, backgroundColor: '#fff', color: 'black', marginHorizontal: 3 }}
                        placeholder="Qty"
                        placeholderTextColor={'gray'}
                        keyboardType="numeric"
                        value={ item?.qtys?.toString() || ''} // Prepopulate if available
                        onChangeText={(text) => updateQty(index, text)}
                        returnKeyType="done"
                      />

                      <TextInput
                        style={{ width: 60, borderWidth: 1, borderColor: '#ccc', padding: 5, backgroundColor: '#fff', color: 'black', marginHorizontal: 3 }}
                        placeholder="Stock"
                        placeholderTextColor={'gray'}
                        keyboardType="numeric"
                        value={item?.qty?.toString() || ''}
                        editable={false}
                      />
                       {value1 === "2" && (
                      <TextInput
                        style={{ width: 67, borderWidth: 1, borderColor: '#ccc', padding: 5, backgroundColor: '#fff', color: 'black', marginHorizontal: 3 }}
                        placeholder="Uom"
                        placeholderTextColor={'gray'}
                        value={item?.uom_name}
                        editable={false}
                      />
                      )}
                      {value1 === "2" && (
                      <TextInput
                        style={{ width: 63, borderWidth: 1, borderColor: '#ccc', padding: 5, backgroundColor: '#fff', color: 'black', marginHorizontal: 3 }}
                        placeholder="Pieces"
                        placeholderTextColor={'gray'}
                        keyboardType="numeric"
                        value={item?.pieces?.toString() || ''}
                        editable={false}
                      />
                      )}
                      <TextInput
                        style={{ width: 90, borderWidth: 1, borderColor: '#ccc', padding: 5, backgroundColor: '#fff', color: 'black', marginHorizontal: 3 }}
                        placeholder="batch_code"
                        placeholderTextColor={'gray'}
                        keyboardType="numeric"
                        value={item?.batch_code?.toString() || ''}
                        editable={false}
                      />
                       {value1 === "1" && (
                      <TextInput
                        style={{ width: 90, borderWidth: 1, borderColor: '#ccc', padding: 5, backgroundColor: '#fff', color: 'black', marginHorizontal: 3 }}
                        placeholder="Weight"
                        placeholderTextColor={'gray'}
                        keyboardType="numeric"
                        value={item?.weight?.toString() || ''}
                        editable={false}
                      />
                      )}
                    </View>
                  );}}
                />
              </View>
            </View>
          </ScrollView>
        </View>

        <LinearGradient
          colors={Colors.linearColors}
          start={Colors.start}
          end={Colors.end}
          locations={Colors.ButtonsLocation}
          style={{ borderRadius: 20, marginTop: "4%" }}>
          <TouchableOpacity
            onPress={ !isSelectStock ? saveStockDeductData : saveStockDeductDataMulti}
            style={{ paddingVertical: "4%", justifyContent: "center", alignItems: "center" }}
          >
            <Text style={{ fontFamily: "AvenirNextCyr-Bold", color: "white" }}>Submit</Text>
          </TouchableOpacity>
        </LinearGradient>

        <TouchableOpacity
          style={styles.closeIcon}
          onPress={() => setModalVisible3(false)} >
          <AntDesign name="close" color="black" size={25} />
        </TouchableOpacity>

      </View>
    </View>
  </KeyboardAvoidingView>
</Modal>

<Modal visible={modalVisible4} transparent>
<KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'} >
    <View style={styles.modalContainer11}>
      <View style={styles.modalContent3}>
        <Text style={[styles.ModalText1,{width:'90%'}]} numberOfLines={3}>{selectedItemName}</Text>
        <Text style={{ fontSize: 13, fontFamily: "AvenirNextCyr-Bold", color: 'black' }}>Total Feet: {totalFeet}</Text>
        <Text style={{ fontSize: 13, fontFamily: "AvenirNextCyr-Bold", color: 'black' }}>Total Weight: {totalkg} Kg</Text>

        <View style={{ marginHorizontal: 5, marginTop: '3%', height: 200 }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ width: 500 }}
          >
            <View style={{ marginHorizontal: '1%', marginTop: '3%', gap: 1 }}>

              <View style={{
                flexDirection: 'row',
                marginBottom: 1,
                alignItems: 'center',
                gap: 5,
              }}>
                <Text style={{ fontSize: 13, fontWeight: 'bold', textAlign: 'center', color: 'black', width: "17%" }}>Enter Qty</Text>
                <Text style={{ fontSize: 13, fontWeight: 'bold', textAlign: 'center', color: 'black', width: "15%" }}>Stock</Text>
                <Text style={{ fontSize: 13, fontWeight: 'bold', textAlign: 'center', color: 'black', width: "14%" }}>UOM</Text>
                <Text style={{ fontSize: 13, fontWeight: 'bold', textAlign: 'center', color: 'black', width: "15%" }}>Pieces</Text>
                <Text style={{ fontSize: 13, fontWeight: 'bold', textAlign: 'center', color: 'black', width: "22%" }}>Batch code</Text>
              </View>

              <View style={{ flexDirection: 'row', marginBottom: 10, alignItems: 'center', width: '100%', gap: 1 }}>
                <FlatList
                  data={rowData1}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item, index }) => {
                    
                  return (
                    <View key={index} style={{ flexDirection: 'row', marginBottom: 10, alignItems: 'center', width: '100%', gap: 1 }}>

                      <TextInput
                        style={{ width: 70, borderWidth: 1, borderColor: '#ccc', padding: 5, backgroundColor: '#fff', color: 'black', marginHorizontal: 3 }}
                        placeholder="Qty"
                        placeholderTextColor={'gray'}
                        keyboardType="numeric"
                        // Set the value from matchingStock.qty if stock_id matches
                        value={item.qtys?.toString()}
                        onChangeText={(text) => updateQty(index, text)}
                        returnKeyType="done"
                      />

                      <TextInput
                        style={{ width: 60, borderWidth: 1, borderColor: '#ccc', padding: 5, backgroundColor: '#fff', color: 'black', marginHorizontal: 3 }}
                        placeholder="Stock"
                        placeholderTextColor={'gray'}
                        keyboardType="numeric"
                        value={item?.qty?.toString() || ''}
                        editable={false}
                      />

                      <TextInput
                        style={{ width: 67, borderWidth: 1, borderColor: '#ccc', padding: 5, backgroundColor: '#fff', color: 'black', marginHorizontal: 3 }}
                        placeholder="Uom"
                        placeholderTextColor={'gray'}
                        value={item?.uom_name}
                        editable={false}
                      />
                      
                      <TextInput
                        style={{ width: 63, borderWidth: 1, borderColor: '#ccc', padding: 5, backgroundColor: '#fff', color: 'black', marginHorizontal: 3 }}
                        placeholder="Pieces"
                        placeholderTextColor={'gray'}
                        keyboardType="numeric"
                        value={item?.pieces?.toString() || ''}
                        editable={false}
                      />

                      <TextInput
                        style={{ width: 90, borderWidth: 1, borderColor: '#ccc', padding: 5, backgroundColor: '#fff', color: 'black', marginHorizontal: 3 }}
                        placeholder="batch_code"
                        placeholderTextColor={'gray'}
                        keyboardType="numeric"
                        value={item?.batch_code?.toString() || ''}
                        editable={false}
                      />

                    </View>
                  );
                  }}
                />
              </View>
            </View>
          </ScrollView>
        </View>

        <LinearGradient
          colors={Colors.linearColors}
          start={Colors.start}
          end={Colors.end}
          locations={Colors.ButtonsLocation}
          style={{ borderRadius: 20, marginTop: "4%" }}>
          <TouchableOpacity
            onPress={saveStockDeductPPGL}
            style={{ paddingVertical: "4%", justifyContent: "center", alignItems: "center" }}
          >
            <Text style={{ fontFamily: "AvenirNextCyr-Bold", color: "white" }}>Submit</Text>
          </TouchableOpacity>
        </LinearGradient>
        <TouchableOpacity
          style={styles.closeIcon}
          onPress={() => setModalVisible4(false)}>
          <AntDesign name="close" color="black" size={25} />
        </TouchableOpacity>
      </View>
    </View>
  </KeyboardAvoidingView>
</Modal>

<Portal>
<PaperModal visible={visible1} onDismiss={hideModal} contentContainerStyle={containerStyle}>
<KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
  <View style={styles.modalContainer2}>
  <View style={styles.modalContent2}>

    <TouchableOpacity
    style={{...styles.closeIcon,marginTop:'2%'}}
    onPress={hideModal} >
    <AntDesign name="close" color="black" size={25} />
  </TouchableOpacity>


<View style={{ marginHorizontal: '1%', marginTop: '3%', gap: 1}}>
<View>

    <View  style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap:5 }}>
      <Text style={styles.ModalText2} numberOfLines={4}>{selectedItemName}</Text>
      { isSelectStock && checkedRows.length >= 1 &&
        <TouchableOpacity onPress={handleSelectStockModel} style={{ padding: 10, backgroundColor: 'tomato', marginVertical: 10, alignItems: 'center', borderRadius: 10 }}>
        <Text style={{ color: 'white' }}>Stock</Text>
        </TouchableOpacity> }
     
      <TouchableOpacity onPress={addRow1} style={{ padding: 10, backgroundColor: 'green', marginVertical: 10, alignItems: 'center', borderRadius: 10 }}>
      <Text style={{ color: 'white' }}>Add Row</Text>
      </TouchableOpacity>

      </View>
      <View style={{
          alignItems: 'center',
          borderBottomWidth: 1,
          borderBottomColor: '#D3D3D3',
          marginTop: '3%'}}>
        </View>
     </View>

     <ScrollView 
    style={{ flex: 1 }} 
    contentContainerStyle={{ flexGrow: 1 }} 
    keyboardShouldPersistTaps="handled"
  >

    <ScrollView 
      horizontal 
      contentContainerStyle={{ minWidth: 520 }}
      keyboardShouldPersistTaps="handled"
    >

          <View style={{ marginHorizontal: '1%', marginTop: '3%', gap: 1}}>
          <View style={{ flexDirection: 'row', marginBottom: 10, alignItems: 'center', width: '100%', gap: 1}}>
  
          <View style={{ marginHorizontal: '1%', gap: 1 }}>
            <View style={{
              flexDirection: 'row',
              marginBottom: 10,
              alignItems: 'center',
              gap: 5 }}>
             <TouchableOpacity onPress={handleSelectStock} style={{ marginHorizontal: '1%'}}>
                {
                  !isSelectStock ?
                    <MaterialCommunityIcons name="checkbox-multiple-blank-outline" size={33} color="black" />
                  : <MaterialCommunityIcons name="checkbox-multiple-marked" size={33} color="black" />
                }
             </TouchableOpacity>
            <Text style={{ fontSize: 14, fontWeight: 'bold', textAlign: 'center', color: 'black',width:"20%"}}>LENGTH</Text>
            <Text style={{ fontSize: 14, fontWeight: 'bold', textAlign: 'center', color: 'black',width:"18%"}}>WIDTH</Text>
            <Text style={{ fontSize: 14, fontWeight: 'bold', textAlign: 'center', color: 'black',width:"23%"}}>THICKNESS</Text>
            <Text style={{ fontSize: 14, fontWeight: 'bold', textAlign: 'center', color: 'black',width:"15%"}}>NOS</Text>
          </View>
              <View style={{ flexDirection: 'row', marginBottom: 10, alignItems: 'center', width: '100%', gap: 1, }}>
                <FlatList
                  data={rows1}
                  renderItem={({ item, index }) => (
                    <View key={index} style={{ flexDirection: 'row', marginBottom: 10, alignItems: 'center', width: '100%', gap: 10 }}>
               
                        {isSelectStock ? (
                          <Checkbox.Android
                              color={Colors.primary}
                              status={checkedRows.includes(index) ? "checked" : "unchecked"}
                              onPress={() => {
                                handleCheckboxPress(index);
                             }}
                          />
                            ) : (
                          <TouchableOpacity
                            onPress={() => {
                             if (!rows1[index].thickness || rows1[index].thickness.trim() === '') {
                               Alert.alert('Validation Error', 'Please enter the thickness before proceeding.');
                              } else {
                               setRowMM(rows1[index].thickness);
                               getDropdownProductBasePlate(rows1[index].thickness);
                               setSelectedRowIndex(index);
                               setSelectedParentId(item?.stock_deduct_data[0]?.parent_stock_id);
                              }
                             }}
                              style={{ padding: 5 }} >
                            {rows1[index]?.stock_deduct_data?.length > 0 ? (
                             <AntDesign name="checkcircle" size={25} color="green" />
                            ) : (
                             <AntDesign name="pluscircle" size={25} color="tomato" />
                            )}
                          </TouchableOpacity>
                        )}

                    <TextInput
                        style={{ borderWidth: 1, padding: 5,width: 100}}
                        value={item?.height_inch}
                        placeholder="0.00"
                        onChangeText={(text) => handleInputChange1(index, 'height_inch', text)}
                        keyboardType="number-pad"
                        returnKeyType="done"
                      />

                      <TextInput
                        style={{ borderWidth: 1, padding: 5,width: 100 }}
                        value={item?.width_ft}
                        placeholder="0.00"
                        onChangeText={(text) => handleInputChange1(index, 'width_ft', text)}
                        keyboardType="number-pad"
                        returnKeyType="done"
                      />

                      <TextInput
                        style={{ borderWidth: 1, padding: 5, width: 100 }}
                        value={item?.thickness}
                        placeholder="0.00"
                        onChangeText={(text) => handleInputChange1(index, 'thickness', text)}
                        keyboardType="number-pad"
                        returnKeyType="done"
                      />

                      <TextInput
                        style={{ borderWidth: 1, padding: 5, width: 90 }}
                        value={item?.nos}
                        placeholder="0.00"
                        onChangeText={(text) => handleInputChange1(index, 'nos', text)}
                        keyboardType="number-pad"
                        returnKeyType="done"
                      />
                      
                      {(item?.dimension_id ==='' && item?.stock_deduct_data.length === 0) && (
                        <TouchableOpacity onPress={() => deleteRow1(index)} style={{ padding: 5 }}>
                          <AntDesign name="delete" size={20} color="tomato" />
                        </TouchableOpacity>
                      )}

                       {(item?.dimension_id !=='' && item?.stock_deduct_data.length === 0) && (
                        <TouchableOpacity onPress={() => handleDelete(index,item?.dimension_id)} style={{ padding: 5 }}>
                          <AntDesign name="delete" size={20} color="tomato" />
                        </TouchableOpacity>
                      )}

                    </View>
                  )}
                />
              </View>
             </View>
            </View>
           </View>
         </ScrollView> 
        </ScrollView> 
         <View style={{ alignItems: 'center', marginTop: 9 ,flexDirection:'row',justifyContent:'space-between',gap:5}}>

         <LinearGradient
            colors={Colors.linearColors}
            start={Colors.start}
            end={Colors.end}
            locations={Colors.ButtonsLocation}
            style={{
              borderRadius: 20,
              width:'50%',
              height:45
            }} >
            <TouchableOpacity
              onPress={() => {saveStockData('Save')}}
                style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                 {isUpdating1 ?
                 <ActivityIndicator size="small" color="#fff"/>
                 :
                 <Text style={{ fontFamily: "AvenirNextCyr-Bold", color: "white" ,alignItems: "center", fontSize: 16 }}>Save</Text>
                 }
            </TouchableOpacity>
          </LinearGradient>
          
  <LinearGradient
  colors={Colors.linearColors}
  start={Colors.start}
  end={Colors.end}
  locations={Colors.ButtonsLocation}
  style={{
    borderRadius: 20,
    width: '50%',
    height: 45,
  }}
>
  <TouchableOpacity
    onPress={() => {
      saveRowsToSelectedItemBasePlate();
    }}
    style={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    {isUpdating11 ?
       <ActivityIndicator size="small" color="#fff"/>
       :
      <Text style={{ fontFamily: "AvenirNextCyr-Bold", color: "white" ,alignItems: "center", fontSize: 16 }}>Submit</Text>
    }

  </TouchableOpacity>
</LinearGradient>
     </View>
    </View>
  </View>
  </View>
  </KeyboardAvoidingView>
  </PaperModal>
  </Portal>


  <Portal>

    
  <PaperModal
    visible={visible3}
    onDismiss={hideModal11}
    contentContainerStyle={containerStyle}
  >
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
                <Text style={styles.ModalText2} numberOfLines={4}>
                  {selectedItemName}
                </Text>

                {orderDetails?.product_list[0]?.name !== 'BASE PLATE' &&
                  orderDetails?.status === 'Pending Production' && (
                    <TouchableOpacity
                      onPress={() => {
                        setVisible5(true);
                      }}
                      style={{
                        padding: 5,
                        backgroundColor: 'green',
                        borderRadius: 5,
                        paddingVertical: 8,
                      }}
                    >
                      <Text
                        style={{
                          color: 'white',
                          fontWeight: 'bold',
                        }}
                      >
                        Stock
                      </Text>
                    </TouchableOpacity>
                  )}
              </View>
              <View
                style={{
                  alignItems: 'center',
                  borderBottomWidth: 1,
                  borderBottomColor: '#D3D3D3',
                  marginTop: '3%',
                }}
              ></View>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ width: 550 }}
            >
              <View style={{ marginHorizontal: '1%', marginTop: '3%', gap: 1 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    marginBottom: 10,
                    alignItems: 'center',
                    width: '100%',
                    gap: 1,
                  }}
                >
                  <View style={{ marginHorizontal: '1%', gap: 1 }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginBottom: 1,
                        alignItems: 'center',
                        gap: 5,
                      }}
                    >
                      <Text style={{ fontSize: 14, fontWeight: 'bold', textAlign: 'center', color: 'black', width: 100 }}>
                        {orderDetails?.product_list[0]?.name === 'BASE PLATE'
                          ? 'LENGTH'
                          : 'FEET'}
                      </Text>
                 <Text style={{ fontSize: 14, fontWeight: 'bold', textAlign: 'center', color: 'black', width: 100 }}>
                        {orderDetails?.product_list[0]?.name === 'BASE PLATE'
                          ? 'WIDTH'
                          : 'INCHES'}
                      </Text>
                      {orderDetails?.product_list[0]?.name == 'BASE PLATE' && (
                     <Text style={{ fontSize: 14, fontWeight: 'bold', textAlign: 'center', color: 'black', width: 120 }}>
                          THICKNESS
                        </Text>
                      )}
                   <Text style={{ fontSize: 14, fontWeight: 'bold', textAlign: 'center', color: 'black', width: 80 }}>
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
                                  data.stock_data.map((stock) => stock.stock_id)
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
                                gap: 10,
                              }}
                            >
                              <View
                                key={index}
                                style={{
                                  flexDirection: 'row',
                                  marginBottom: 0,
                                  alignItems: 'center',
                                  width: '100%',
                                  gap: 10,
                                }}
                              >
                                {orderDetails?.product_list[0]?.name ===
                                'BASE PLATE' ? (
                                  <>
                                    <TextInput
                                      style={{
                                        borderWidth: 1,
                                        padding: 5,
                                        width: 100,
                                        color: 'black',
                                        fontSize: 18,
                                      }}
                                      value={String(
                                        item?.height_inch || '0.00'
                                      )}
                                      placeholder="0.00"
                                      editable={false}
                                      keyboardType="number-pad"
                                      returnKeyType="done"
                                    />
                                    <TextInput
                                      style={{
                                        borderWidth: 1,
                                        padding: 5,
                                        width: 100,
                                        color: 'black',
                                        fontSize: 18,
                                      }}
                                      placeholder="0.00"
                                      value={String(
                                        item?.width_ft || '0.00'
                                      )}
                                      editable={false}
                                      keyboardType="number-pad"
                                      returnKeyType="done"
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
                                      value={String(
                                        item?.width_ft || '0.00'
                                      )}
                                      placeholder="0.00"
                                      editable={false}
                                      keyboardType="number-pad"
                                      returnKeyType="done"
                                    />
                                    <TextInput
                                      style={{
                                        borderWidth: 1,
                                        padding: 5,
                                        width: 100,
                                        color: 'black',
                                        fontSize: 18,
                                      }}
                                      placeholder="0.00"
                                      value={String(
                                        item?.height_inch || '0.00'
                                      )}
                                      editable={false}
                                      keyboardType="number-pad"
                                      returnKeyType="done"
                                    />
                                  </>
                                )}
                                {orderDetails?.product_list[0]?.name ==
                                  'BASE PLATE' && (
                                  <TextInput
                                    style={{
                                      borderWidth: 1,
                                      padding: 5,
                                      width: 100,
                                      color: 'black',
                                      fontSize: 18,
                                    }}
                                    value={String(
                                      item?.thickness || '0.00'
                                    )}
                                    placeholder="0.00"
                                    editable={false}
                                    keyboardType="number-pad"
                                    returnKeyType="done"
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
                                  keyboardType="number-pad"
                                  returnKeyType="done"
                                />
                              </View>
                              {item?.stock_data?.length > 0 ? (
                                item?.stock_data.map(
                                  (stock, stockIndex) => (
                                 <View
                                        key={stockIndex}
                                        style={{
                                          flexDirection: 'row',
                                          gap: 10,
                                          justifyContent: 'space-between',
                                          alignItems:'center'
                                        }}
                                      >
                                        <View key={stockIndex}
                                        style={{
                                          backgroundColor: duplicateStockIds.includes(stock.stock_id)
                                            ? getRandomColorForStock(stock.stock_id)
                                            : 'transparent',
                                            height:13,
                                            width:13,
                                            borderRadius:10
                                        }}></View>
                                      <Text
                                        style={{
                                          fontFamily:
                                            'AvenirNextCyr-Medium',
                                          color: Colors.primary,
                                          fontSize: 12,
                                        }}
                                      >
                                        {stock?.product_name}
                                      </Text>
                                      <Text
                                        style={{
                                          fontFamily:
                                            'AvenirNextCyr-Medium',
                                          color: 'black',
                                          fontSize: 12,
                                        }}
                                      >
                                        QTY :{stock?.qty} {stock.uom}
                                      </Text>
                                      <Text
                                        style={{
                                          fontFamily:
                                            'AvenirNextCyr-Medium',
                                          color: 'black',
                                          fontSize: 12,
                                        }}
                                      >
                                        BATCH :
                                        {stock?.batch_code
                                          ? stock?.batch_code
                                          : 'N/A'}
                                      </Text>
                                    </View>
                                  )
                                )
                              ) : null}
                            </View>
                          );
                        }}
                      />
                    </View>
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  </PaperModal>
</Portal>


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

export default OrderRevStockDetails;

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
  modalContainer11: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding:'2%'
  },
  modalContent1: {
    width:'95%',
    backgroundColor: "white",
    borderRadius: 10,
    paddingVertical: 30,
    paddingHorizontal: 10,

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
    // marginTop: 2,
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
    width: "48%",
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
      },rowBack: {
        alignItems: 'center',
        flex: 1,
      },
      backRightBtn: {
        alignItems: 'center',
        bottom: 10,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        right: 40,
      },backRightBtn1: {
        alignItems: 'center',
        bottom: 10,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
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
  },
  fabStyle: {
    position: "absolute",
    right: "5%",
    bottom: "10%",
    backgroundColor: Colors.primary,
  },
  ModalText2: {
    fontSize: 14,
    fontFamily: 'AvenirNextCyr-Bold',
    paddingBottom: 5,
    color:Colors.primary,
    width:'50%'
  },
  modalContainer2: {
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
    marginVertical:'5%',
  },
  modalContent3: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    width:'95%'
  },
  modalContent13: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 30,
    width:'90%'
},stockCard: {
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
}, stockItem: {
  paddingVertical: 10,
  paddingHorizontal: 15,
  backgroundColor: "#f9f9f9",
  borderRadius: 10,
},
});
