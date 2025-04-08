import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Colors from "../../constants/Colors";
import AntDesign from "react-native-vector-icons/AntDesign";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { AuthContext } from "../../Context/AuthContext";
import DarkLoading from "../../styles/DarkLoading";
import { useFocusEffect } from "@react-navigation/native";
import DatePicker from "react-native-date-picker";
import { Searchbar ,ActivityIndicator,Modal as PaperModal ,Portal ,PaperProvider ,DefaultTheme } from "react-native-paper";
import { cameraPermission } from "../../utils/Helper";
import { launchCamera } from "react-native-image-picker";
import RNFS from 'react-native-fs';

const DriverDeliveryHistory = ({ route, navigation }) => {
  const { userData } = useContext(AuthContext);
  const { DriverID } = route.params;
  const [vehicleData, setVehicleData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [showProductsModal, setShowProductsModal] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showSingnature, setShowSingnature] = useState(false);
  const [SelectedSign, setSelectedSign] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loadingEndImage, setLoadingEndImage] = useState(false);
  const [image, setImage] = useState(null);
  const [image1, setImage1] = useState(null);
  const [textOdo, setTextOdo] = useState('');
  const [ordoId, setOrdoId] = useState('');
  let forceResetLastButton = null;
  const containerStyle = {flex:1 ,height:'100%',width:'100%'};
  const hideModal1 = () => setShowProductsModal(false);
  const [dimensionData, setDimensionData] = useState('');
  const [isProduction, setIsProduction] = useState([]);
  const [menuVisible1, setMenuVisible1] = useState(false);


  console.log('================isProduction====================');
  console.log(JSON.stringify(isProduction,null,2));
  console.log('================================================');

  useFocusEffect(
    React.useCallback(() => {
      GetDriverDetails();
    }, [])
  );

  const OpenDimention = (data) => {
    setDimensionData(data);
    setMenuVisible1(true)
  };

 const renderItems = ({ item }) => (
   <View style={styles.card}>
     {filteredProducts[0]?.name === "BASE PLATE" ? <Text style={{color:Colors.primary ,fontFamily: "AvenirNextCyr-Bold",
     fontSize: 17}}>{item?.height_inch} X {item?.width_ft} X  {item?.thickness} </Text>  :
     <Text style={{color:Colors.primary ,fontFamily: "AvenirNextCyr-Bold",
     fontSize: 17}}>Dimensions: {item?.width_ft}' {item.height_inch}"</Text> }
     <Text style={{color:Colors.black ,fontFamily: "AvenirNextCyr-Medium",
    fontSize: 15}}>Loaded Qty: {item?.loaded_nos} NOS</Text>
     {filteredProducts[0]?.name === "BASE PLATE" &&
     <Text style={{color:Colors.black ,fontFamily: "AvenirNextCyr-Medium",
    fontSize: 15}}>Weight Qty: {item?.base_production_weight} Kg</Text>
     }
   </View>
 );

  const parseAndFormatDate = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    };
    return date.toLocaleString("en-US", options);
  };

  const parseAndFormatDate1 = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleString("en-US", options);
  };


  const GetDriverDetails = async () => {
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
      `https://gsidev.ordosolution.com/api/completed_routes/?driver_id=${DriverID}`,
      requestOptions
    )
      .then((response) => {
        console.log("🚀 ~ GetDriverDetails ~ response:", response);
        return response.json()
      })
      .then(async (result) => {
        if (result.error) {
          console.log("Error getting History");
        } else {
          const sortedData = result.sort((a, b) => {
            const dateA = new Date(a.updated_at);
            const dateB = new Date(b.updated_at);
            return dateB - dateA;
          });
          setVehicleData(result);
          setFilteredData(sortedData);
        }
        setLoading(false);
        setIsSearching(false);
      })
      .catch((error) => {
        setLoading(false);
        console.log("Error getting History", error);
      });
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleConfirm = () => {
    setShowDatePicker(false);
    filterData(vehicleData, selectedDate);
    setIsSearching(true);
  };

  const filterData = (data, date) => {
    if (data.length === 0) return;

    const filteredData = data.filter((item) => {
      const itemDate = new Date(item.updated_at).toISOString().split("T")[0];
      const selectedDateStr = date.toISOString().split("T")[0];
      return itemDate === selectedDateStr;
    });
    setFilteredData(filteredData);
  };

  const clearFilter = () => {
    setFilteredData(vehicleData);
    setIsSearching(false);
  };

  const handleSearchChange = (val) => {
    setSearch(val);
    if (val) {
      const filtered = selectedProducts.filter((item) =>
        item.name.toLowerCase().includes(val.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(selectedProducts);
    }
  };


  const showModal = () => {
    setIsModalVisible(true);
  };

  const checkCamPermission = async () => {
    let PermissionDenied = await cameraPermission();
    if (PermissionDenied) {
      console.log("camera permssion granted");
      handleCamera();
    } else {
      console.log("camera permssion denied");
      //requestStoragePermission();
    }
  };

  const handleCamera = async () => {
    try {
      const res = await launchCamera({
        mediaType: "photo",
      });
      
      if (res.assets && res.assets.length > 0) {
        const { uri, type } = res.assets[0];
        
        // Convert image to Base64
        const base64Image = await RNFS.readFile(uri, 'base64');
        setImage1(`data:${type};base64,${base64Image}`)
        setImage({ uri, type});
      }
    } catch (error) {
      console.error("Error capturing image: ", error);
    }
  };

  const handleSave = () => {
    if (image && textOdo) {
      UploadOdoMeter();
    } else {
      alert('Please capture an image and enter the text before saving.');
    }
  };

  const handleDeleteImage = () => {
    setImage(null);
    setImage1(null);
  };

  const UploadOdoMeter = () => {
    setLoadingEndImage(true)
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${userData?.token}`);

    var raw = JSON.stringify({
     route_id: ordoId,
     end_odometer: textOdo,
     end_odometer_img: image1,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(
      "https://gsidev.ordosolution.com/api/end_odometer/",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        if (result.error) {
          Toast.show("Please try again", Toast.LONG);
          setLoadingEndImage(false)
        } else {
          setLoadingEndImage(false)
          setIsModalVisible(false);
          GetDriverDetails();
          setImage(null);
          setImage1(null);
          setTextOdo('')
          Toast.show("Image Saved", Toast.LONG);
        }
      })
      .catch((error) => {
        setLoadingEndImage(false)
        Toast.show("Please try again", Toast.LONG);
      });
  };

  const renderItem = ({ item }) => {
    return (
      <View
        style={{
          marginHorizontal: "4%",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "1%",
          }}
        >
          <View
            style={{ height: 1, backgroundColor: "lightgray", flex: 1 }}
          ></View>
          <Text style={[styles.customerLoc1]}>
            {parseAndFormatDate1(item?.updated_at)}
          </Text>
          <View
            style={{ height: 1, backgroundColor: "lightgray", flex: 1 }}
          ></View>
        </View>

        <View style={[styles.item]}>
          <Image
            source={require("../../assets/images/Union.png")}
            style={{ position: "absolute", left: 0, bottom: 0 }}
            resizeMode="contain"
          />
          <Image
            source={require("../../assets/images/Union3.png")}
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              opacity: 0.7,
            }}
            resizeMode="contain"
          />
          <View style={{ flexDirection: "row", gap: 5, marginBottom: "1%" }}>
            <Text style={[styles.customerName]}>
              Vehicle: {item?.vehicle_details?.vehicle_type}{" "}
              {item?.vehicle_details?.model}
            </Text>
          </View>

          <Text style={[styles.customerLoc]}>From: {item?.source}</Text>
          <Text style={[styles.customerLoc]}>To: {item?.destination}</Text>
          <Text style={[styles.customerLoc]}>
            Delivery Date: {parseAndFormatDate(item?.updated_at)}
          </Text>

          {item?.sales_order_details?.map((productDetail, index) => (
            <View key={index}>
              <TouchableOpacity
                style={styles.detailsBox}
                onPress={() => {
                  setSelectedProducts(productDetail.product_list);
                  setFilteredProducts(productDetail.product_list);
                  setShowProductsModal(true);
                  setIsProduction(productDetail?.is_production)
                }}
              >
                <View
                  style={{
                    flexDirection: "column",
                    width: "90%",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 5,
                      marginBottom: "1%",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={[styles.customerName]}>
                      {productDetail?.name}: {productDetail?.assignee_name}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedSign(productDetail?.customer_sign);
                        setShowSingnature(true);
                      }}
                    >
                      <FontAwesome
                        name="pencil-square-o"
                        size={20}
                        color={"#396CF0"}
                      />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.location12}>Total Products</Text>
                  <Text style={styles.location11}>
                    {productDetail.product_list?.length || 0}
                  </Text>
                </View>
                <AntDesign name="right" size={16} color="gray" />
              </TouchableOpacity>
            </View>
          ))}
          {
            item?.end_odometer_img_url === null && 
         
          <TouchableOpacity
              style={{
                backgroundColor: 'tomato',
                alignItems: "center",
                justifyContent: "center",
                padding: 5,
                borderRadius: 6,
                marginTop:'1%'
              }}
              onPress={() => {
                showModal();
                setOrdoId(item?.id)
              }}
            >
         <Text style={{color:'white',fontSize:17,fontFamily: "AvenirNextCyr-Medium",}}>End Route OdoMeter</Text>
            </TouchableOpacity>
             }
        </View>
      </View>
    );
  };

  const renderProductItem = ({ item }) => (
    <View style={styles.productItem}>
      
      <View>
        {item.product_image ? (
          <Image
            source={{ uri: item.product_image }}
            style={styles.productImage}
          />
        ) : (
          <Image
            source={require("../../assets/images/noImagee.png")}
            style={styles.productImage}
          />
        )}
      </View>
      <View>
        <View style={{flexDirection:'row' ,justifyContent:'space-between'}}>
        <Text style={styles.productName}>
          {item.name}
        </Text>
        {
          isProduction &&
          <TouchableOpacity style={{ backgroundColor: Colors.primary, padding:4, borderRadius:4,height:30,alignItems:'center'}}
           onPress={() => OpenDimention(item.production_data)}>
          <Text style={{fontFamily: "AvenirNextCyr-Bold",fontSize: 13,color: "white"}}>View</Text>
         </TouchableOpacity>
           }
        </View>
        <Text style={styles.productDetails}>
          Category: {item.product_category}
        </Text>
        {
          !isProduction &&
         <Text style={styles.productDetails}>Qty: {item?.actual_loaded_qty} {item?.loaded_uom}</Text>
        }
         <View>
         </View>
        <Text style={styles.productDetails}>Weight: { isProduction ? item?.sum_of_roofing_base_production_weight : item?.actual_loaded_weight } Kg</Text>
      </View>
    </View>
  );

  return (
    <PaperProvider theme={DefaultTheme}>
     <LinearGradient
      colors={Colors.linearColors}
      start={Colors.start}
      end={Colors.end}
      locations={Colors.location}
      style={{ flex: 1 }}
    >
      <View style={styles.headerView}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ paddingLeft: "4%" }}
        >
          <Image
            source={require("../../assets/images/Refund_back.png")}
            style={{ height: 30, width: 30 }}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>Delivery History</Text>

        <View style={{ flexDirection: "row", gap: 10, marginTop: "2%" }}>
          {!isSearching ? (
            <TouchableOpacity
              style={styles.styleBtn}
              onPress={() => {
                setShowDatePicker(true);
              }}
            >
              <Ionicons name="search" size={25} color={Colors.primary} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.styleBtn}
              onPress={() => {
                clearFilter();
              }}
            >
              <AntDesign name="close" size={25} color={Colors.primary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.whiteView}>
        <View></View>
        {loading ? (
          <DarkLoading />
        ) : filteredData.length === 0 ? (
          <View
            style={{
              flex: 1,
              resizeMode: "contain",
              justifyContent: "center",
              alignItems: "center",
              alignSelf: "center",
            }}
          >
            <Image
              source={require("../../assets/images/EmptyHistory.png")}
              style={styles.placeholderImage}
            />
            <Text
              style={{
                fontFamily: "AvenirNextCyr-Bold",
                fontSize: 19,
                color: Colors.primary,
                marginVertical: "1%",
              }}
            >
              No History
            </Text>
            <Text
              style={{
                fontFamily: "AvenirNextCyr-Medium",
                fontSize: 19,
                color: Colors.primary,
              }}
            >
              There is no history to show you right now
            </Text>
          </View>
        ) : (
          <>
            <FlatList
              data={filteredData}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
              style={{ marginTop: "3%" }}
            />
          </>
        )}
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showDatePicker}
        onRequestClose={() => setShowDatePicker(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent1}>
            <TouchableOpacity
              style={{ alignSelf: "flex-end" }}
              onPress={() => {
                setShowDatePicker(false);
              }}
            >
              <AntDesign name="close" size={26} color="black" />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Search by Date</Text>
            <DatePicker
              date={selectedDate}
              onDateChange={handleDateChange}
              mode="date"
              textColor={Colors.primary}
              onConfirm={handleConfirm} />
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={handleConfirm} >
              <Text style={styles.modalCancelButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Portal>
        <PaperModal visible={showProductsModal} onDismiss={hideModal1} contentContainerStyle={containerStyle}>
         <View style={styles.modalContainer11}>
          <View style={styles.modalContent11}>
            <TouchableOpacity
              style={styles.modalCloseButton1}
              onPress={() => setShowProductsModal(false)}
            >
              <AntDesign name="close" size={24} color="gray" />
            </TouchableOpacity>
            <Text style={styles.modalHeader}>Products</Text>
            <Searchbar
              style={styles.searchbar}
              placeholder="Search Products"
              placeholderTextColor="grey"
              onChangeText={handleSearchChange}
              value={search}
            />
            <FlatList
              data={filteredProducts}
              renderItem={renderProductItem}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={styles.modalContentContainer}
            />
          </View>
          </View>
        </PaperModal>
      </Portal>

      <Modal visible={showSingnature} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent1}>
            <TouchableOpacity
              style={styles.modalCloseButton1}
              onPress={() => setShowSingnature(false)}
            >
              <AntDesign name="close" size={24} color="gray" />
            </TouchableOpacity>
            <Text style={styles.modalHeader}>Customer Signature</Text>
            <View
              style={{
                flex: 1,
                borderWidth: 3,
                borderStyle: "dotted",
                borderColor: "#F2F2F2",
                margin: 3,
                borderRadius: 5}} >
              <Image source={{ uri: SelectedSign }} style={{ flex: 1 }} />
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
          <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() =>{setIsModalVisible(false); forceResetLastButton && forceResetLastButton()}}>
              <AntDesign name="close" size={24} color="gray" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Capture Image and Enter Value</Text>

            {!image && (
              <TouchableOpacity onPress={checkCamPermission} style={styles.captureButton}>
                <Text style={styles.captureButtonText}>Capture Image</Text>
              </TouchableOpacity>
            )}

            {image && (
              <>
               <Image source={{ uri: image?.uri }} style={styles.imagePreview} />
                <TouchableOpacity onPress={handleDeleteImage} style={styles.deleteButton}>
                  <Text style={{ color:'white'}}>Delete Image</Text>
                </TouchableOpacity>
              </>
            )}

            <TextInput
              style={styles.textInput}
              placeholder="Enter Mileage on Odometer"
              value={textOdo}
              onChangeText={setTextOdo}
                keyboardType="number-pad"
                returnKeyType="done"
            />

            <TouchableOpacity onPress={handleSave} style={{backgroundColor:Colors.primary,height:40,alignItems:'center',justifyContent:"center",width:"50%",borderRadius:5}}>
               {loadingEndImage ? <ActivityIndicator size="small" color="white" />
                : <Text style={{ color:'white',fontSize:17}}>Save</Text> }  
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={menuVisible1} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
      <View style={styles.modalContainer1}>
        <Text style={{fontSize: 20,color: Colors.black,fontFamily: "AvenirNextCyr-Medium",marginBottom:'2%'}}>Dimensions</Text>
          <FlatList
            data={dimensionData}
            renderItem={renderItems}
            // keyExtractor={(item ,index) => item.production_id.toString()}
          />
        <TouchableOpacity style={{position:'absolute',top:10 ,right:10}} onPress={()=>{setMenuVisible1(false);}}>
          <AntDesign name='close' size={28} color={`black`} />
        </TouchableOpacity>
      </View>
      </View>
    </Modal>
     </LinearGradient>
    </PaperProvider>
  );
};

export default DriverDeliveryHistory;

const styles = StyleSheet.create({
  headerView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 60,
    paddingHorizontal: "4%",
  },
  whiteView: {
    flex: 1,
    backgroundColor: "#f2f3f9",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: "4%",
  },
  item: {
    backgroundColor: "white",
    padding: "4%",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 9,
    flex: 1,
    marginBottom: "4%",
  },
  customerName: {
    fontSize: 16,
    fontFamily: "AvenirNextCyr-Bold",
    color: Colors.primary,
  },
  customerName1: {
    fontSize: 16,
    fontFamily: "AvenirNextCyr-Bold",
    color: Colors.primary,
  },
  customerLoc: {
    fontSize: 14,
    color: Colors.black,
    fontFamily: "AvenirNextCyr-Medium",
  },
  customerLoc1: {
    fontSize: 14,
    color: "gray",
    fontFamily: "AvenirNextCyr-Medium",
    marginHorizontal: 10,
  },
  location: {
    fontSize: 14,
    color: Colors.white,
    textAlign: "left",
    fontFamily: "AvenirNextCyr-Bold",
  },
  location1: {
    fontSize: 13,
    color: Colors.white,
    textAlign: "left",
    fontFamily: "AvenirNextCyr-Medium",
  },
  location11: {
    fontSize: 14,
    color: Colors.black,
    textAlign: "left",
    fontFamily: "AvenirNextCyr-Medium",
    marginLeft: "2%",
  },
  location12: {
    fontSize: 13,
    color: Colors.black,
    textAlign: "left",
  },
  order: {
    flexDirection: "row",
    marginTop: "3%",
  },
  image: {
    width: "20%",
    height: "100%",
    borderRadius: 5,
    marginRight: "3%",
  },
  orderDetails: {
    justifyContent: "center",
  },
  filteredTextView: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: "2%",
    backgroundColor: "#fff",
    elevation: 5,
    gap: 10,
    flexDirection: "row",
  },
  filteredText: {
    fontFamily: "AvenirNextCyr-Thin",
    fontSize: 16,
    color: Colors.primary,
  },
  resetText: {
    fontSize: 16,
    color: Colors.white,
    fontWeight: "500",
  },
  detailsBox: {
    backgroundColor: "#f8f8f8",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
    marginVertical: "1%",
    padding: "2%",
    borderRadius: 10,
    justifyContent: "space-between",
    flex: 1,
  },
  box: {
    backgroundColor: "#6e6e6e",
    padding: 5,
    borderRadius: 5,
  },
  box1: {
    backgroundColor: "#ebe5fd",
    padding: 5,
    borderRadius: 5,
  },
  headerText: {
    fontFamily: "AvenirNextCyr-Bold",
    fontSize: 19,
    color: "white",
  },
  sortButton: {
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: "4%",
    marginTop: "2%",
  },
  sortButtonText: {
    color: "white",
    fontFamily: "AvenirNextCyr-Bold",
    fontSize: 16,
  },
  modalContent1: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: "5%",
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 22,
    fontFamily: "AvenirNextCyr-Medium",
    marginTop: "-5%",
    color: Colors.primary,
    alignItems: "center",
    marginBottom: "3%",
  },
  modalButtonText: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
    alignItems: "center",
  },
  modalCancelButton: {
    backgroundColor: Colors.primary,
    paddingVertical: "4%",
    paddingHorizontal: "14%",
    borderRadius: 5,
    marginTop: "4%",
    elevation: 8,
  },
  modalCancelButtonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "AvenirNextCyr-Bold",
  },
  modalContainer11: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  styleBtn: {
    height: 30,
    width: 30,
    backgroundColor: Colors.white,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderImage: {
    height: 130,
    width: 160,
    resizeMode: "contain",
  },
  modalContent11: {
    width: "94%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: "2%",
    elevation: 10,
    flex: 1,
    marginVertical: "10%",
  },
  modalContent1: {
    width: "90%",
    height: "50%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: "2%",
    elevation: 10,
    marginVertical: "5%",
  },
  modalCloseButton1: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
    backgroundColor: "#F2F2F2",
    padding: 3,
    borderRadius: 20,
  },
  modalHeader: {
    fontSize: 20,
    fontFamily: "AvenirNextCyr-Bold",
    marginBottom: "2%",
    textAlign: "center",
    color: Colors.primary,
  },
  modalContentContainer: {
    paddingBottom: "5%",
  },
  productItem: {
    padding: "2%",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    flexDirection: "row",
  },
  productImage: {
    width: 70,
    height: 55,
    marginRight: "2%",
  },
  productName: {
    fontSize: 16,
    fontFamily: "AvenirNextCyr-Bold",
    color: Colors.primary,
    width: "65%",
  },
  productDetails: {
    fontSize: 14,
    color: "#555",
    fontFamily: "AvenirNextCyr-Medium",
  },
  searchbar: {
    marginHorizontal: "4%",
    backgroundColor: "#F3F3F3",
    fontFamily: "AvenirNextCyr-Thin",
    height: 50,
  }, 
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  captureButton: {
    backgroundColor: '#FF6347',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  captureButtonText: {
    color: 'white',
  },
  imagePreview: {
    width: 150,
    height: 150,
    marginBottom: 10,
  },
  textInput: {
    width: '100%',
    borderColor: '#CCC',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  deleteButton:{
    backgroundColor:'tomato',
    padding:'2%',
    borderRadius:10,
    marginBottom:'3%',
  },
  modalCloseButton:{
    position:'absolute',
    right:10,
    top:10
  }
  ,modalContainer1: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: "center",
    padding: 20,
    marginVertical:'5%',
    borderRadius:10,
    width:'90%',
    paddingTop:20
  },card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    borderWidth:0.6,
  },
});
