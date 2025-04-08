import React, { useRef, useState, useContext, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Alert, FlatList, Button, TouchableWithoutFeedback, TouchableOpacity } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import Entypo from "react-native-vector-icons/Entypo";
import Colors from "../../constants/Colors";
import { BottomSheetModal, BottomSheetScrollView, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView, PanGestureHandler, State } from 'react-native-gesture-handler';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Menu, MenuItem, MenuDivider } from 'react-native-material-menu';
import { AuthContext } from '../../Context/AuthContext';
import GradientText from '../../styles/GradientText';
import CustomFloating from '../../components/CustomFloating';
import FormatPrice from '../../utils/FormatPrice';
import BottomSheetComponent from '../BottomSheetComponent';
import VersionModel from '../../components/versionModel';


const InvtryMangHome = ({ navigation, route }) => {

  const { token, userData, changeDealerData, logout,
    totalProducts,
    totalCategories,
    totalWarehouses,setToken } = useContext(AuthContext);
  const [visible, setVisible] = useState(false);
  const [suggestedOrders, setSuggestedOrders] = useState([]);
  const [salesData, setSalesData] = useState();
  const [modalVisible, setModalVisible] = useState(false);

  const handlePress = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const hideMenu = () => setVisible(false);

  const showMenu = () => setVisible(true);

  const bottomSheetModalRef = useRef(null);

  const openBottomSheet = () => {
    bottomSheetModalRef.current?.present();
  };

  const closeBottomSheet = () => {
    bottomSheetModalRef.current?.dismiss();
  };

  const placeholderImage = require('../../assets/images/Product-inside.png');
 
  const ContactItem = ({ item }) => (
    <TouchableOpacity style={styles.itemContainer} onPress={() => { navigation.navigate("ProductDetails", { item: item }); }}>
      <View style={styles.imageContainer}>
        <Image
          source={item.product_image ? { uri: item.product_image } : placeholderImage}
          style={styles.image}
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.productDetails}>
          Price: ${item.product_price} | Stock: {item.stock}
        </Text>
        <Text style={styles.productCategory}>
          Category: {item.product_category?.product_category_name}
        </Text>
      </View>
    </TouchableOpacity>
  );


  const logoutAlert = () => {
    hideMenu();

    Alert.alert("Confirmation", "Are you sure, You want to logout?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => {
          logout();
        },
      },
    ]);
  };

  useEffect(() => {
    getSuggestedOrders();
    if (userData?.token) {
      getSalesDetails();
    }
  }, [userData])

  const getSalesDetails = async () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${userData?.token}`);

    await fetch(`https://gsidev.ordosolution.com/api/dashboard_report/?user_id=${userData?.id}`, {
      method: 'GET',
      headers: myHeaders,

    })
      .then(response => response.json())
      .then(res => {
        if (res.detail === 'Token not given.' || res.detail === 'Invalid token.' || res.detail === 'Token has expired.') {
          Alert.alert("Sorry", "Your session is expired. You will be automatically signed out", [
            {
              text: "OK",
              onPress: () => {
                setToken(null)
              },
            },
          ]);
        }else{
          setSalesData(res)
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }


  const getSuggestedOrders = async () => {

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${userData.token}`);

    await fetch(`https://gsidev.ordosolution.com/api/test_product/?limit=5&offset=0&&search_name=`, {
      method: 'GET',
      headers: myHeaders,

    })
      .then(response => response.json())
      .then(res => {
        setSuggestedOrders(res.products)
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <GestureHandlerRootView style={{ flex: 1,backgroundColor:'white' ,backgroundColor:'white' }}>

      <BottomSheetModalProvider>
        <View style={{ flex: 1 }}>
          <View style={styles.topview}>
          <View
              style={{
                flexDirection: "row",
                gap: 5,
              }}
            >
              <View style={{ flexDirection: "column" }}>
              <TouchableOpacity  onPress={handlePress}>
              <Image
                source={require("../../assets/images/fullLogo.png")}
                style={{ ...styles.imageView }}
              />
              </TouchableOpacity>
                {/* <Text style={{ fontSize: 19, fontFamily: 'AvenirNextCyr-Bold', color: Colors.primary }}>Welcome</Text> */}
                <Text style={{ color: Colors.primary, fontFamily: 'AvenirNextCyr-Bold',fontSize: 17 }}>{userData?.name}</Text>
              </View>
            </View>
         
            <TouchableOpacity
              style={{
                flexDirection: "row",
                gap: 15,
              }}
              onPress={logoutAlert}
            >

            <MaterialCommunityIcons
                  name="logout"
                  size={30}
                  color={Colors.primary}
                /> 
              
            </TouchableOpacity>
          </View>

          <View style={styles.row}>
         <View
  style={{
    flexDirection: "row",
    gap: 5,
    justifyContent: 'space-between'
  }}
>
  {/* Products */}
  <View
    style={{
      flexDirection: "column", 
      flex: 0.3,
      alignItems: "center"
    }}
  >
    {/* Image and Name in the same row */}
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Image
        source={require("../../assets/images/box122.png")}
               style={{ ...styles.imageView1, width: 25, height: 18, marginRight: 8 }}

      />
      <Text style={{ fontSize: 11, fontFamily: 'AvenirNextCyr-Bold', color: "white", marginLeft: 1 }}>
        Products
      </Text>
    </View>
    
    {/* Value in the next row */}
    <Text style={{ fontSize: 12, color: "white",marginBottom:5}}>
      {salesData?.inventory_management?.total_products ? salesData?.inventory_management?.total_products : 0}
    </Text>
  </View>


              <View
                style={{
                  height: "70%",
                  width: 1, 
                  backgroundColor: "white", 
                  alignItems: 'center',
                  marginHorizontal: 5,
                  marginTop:5

                }}
              />

           <View
    style={{
      flexDirection: "column",
      flex: 0.3,
      alignItems: "center"
    }}
  >
    {/* Image and Name in the same row */}
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Image
        source={require("../../assets/images/Vector.png")}
        style={{ ...styles.imageView1, width: 18, height: 18, marginRight: 8 }}
      />
      <Text style={{ fontSize: 11, fontFamily: 'AvenirNextCyr-Bold', color: "white", marginLeft: 1 }}>
        Sub Categories
      </Text>
    </View>

    {/* Value in the next row */}
    <Text style={{ fontSize: 12, color: "white", marginBottom: 5 }}>
      {salesData?.inventory_management?.total_categories ? salesData?.inventory_management?.total_categories : 0}
    </Text>
  </View>


              <View
                style={{
                  height: "70%",
                  width: 1,
                  backgroundColor: "white",
                  marginHorizontal: 5,
                  marginTop:5

                }}
              />

           <View
    style={{
      flexDirection: "column",
      flex: 0.3,
      alignItems: "center"
    }}
  >
    {/* Image and Name in the same row */}
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Image
        source={require("../../assets/images/box11.png")}
        style={{ ...styles.imageView1, width: 30, height: 18, marginRight: 8 }}

      />
      <Text style={{ fontSize: 11, fontFamily: 'AvenirNextCyr-Bold', color: "white", marginLeft: 1 }}>
        Categories
      </Text>
    </View>

    {/* Value in the next row */}
    <Text style={{ fontSize: 12, color: "white", marginBottom: 5 }}>
      {salesData?.inventory_management?.total_warehouses ? salesData?.inventory_management?.total_warehouses : 0}
    </Text>
  </View>
            </View>
          </View>

          <GradientText style={{ fontSize: 22, fontFamily: 'AvenirNextCyr-Bold', marginHorizontal: '5%', marginVertical: '2%' }}>{userData?.user_type === "Stock Team" ? "Stock Managements" : "Inventory Management"}</GradientText>

          <View
            style={{
              flexDirection: "row",
              gap: 13,
              flex: 10,
              marginHorizontal: "5%",
            }}
          >
            <View style={styles.row2}>

              <TouchableOpacity onPress={() => {
                navigation.navigate("Inventory");

              }} style={{ backgroundColor: "#EAE3FE", flex: 1, borderRadius: 9 }}>
                <Text
                  style={{
                    position: "absolute",
                    color: '#7258C7',
                    fontFamily: 'AvenirNextCyr-Medium',
                    padding: '5%',
                    zIndex: 1,
                    fontSize: 16,
                    justifyContent: 'flex-start',
                    left: 0,
                    textAlign: 'left'
                    
                  }}>{userData?.user_type === "Stock Team" ? "View" : "Manage"} {'\n'}<Text style={{ fontFamily: 'AvenirNextCyr-Bold', fontSize: 18 }}>Products</Text>
                </Text>
                <Image
                  source={require("../../assets/images/Rectangle-4276.png")}
                  style={{ ...styles.orangeShape }}
                />
                <View
                  style={{
                    justifyContent: "flex-end",
                    alignItems: "flex-end",
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    transform: [{ scaleX: -1 }],
                  }}
                >
                  <Image
                    source={require("../../assets/images/MngProduct.png")}
                    style={{
                      width: "75%",
                      height: "60%",
                      marginRight: '20%',

                      resizeMode: "contain",
                    }}
                  />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  backgroundColor: "#D8F9FF",
                  flex: 1,
                  position: "relative",
                  borderRadius: 9
                }}
                onPress={() => {
                  
                  {userData?.user_type === "Stock Team" ? navigation.navigate("POReview"):
                    navigation.navigate("InvtryReg");}
                }}
              >
                <Text
                  style={{
                    position: "absolute",
                    color: '#008499',
                    fontFamily: 'AvenirNextCyr-Medium',
                    padding: '5%',
                    fontSize: 18,
                    textAlign: 'right',
                    right: 0,
                    zIndex: 1

                  }}>{userData?.user_type === "Stock Team" ? "Purchase":"Inventory"} {'\n'}<Text style={{ fontFamily: 'AvenirNextCyr-Bold', fontSize: 23, }}>{userData?.user_type === "Stock Team" ? "Order":"Tracking"}</Text></Text>

                <Image
                  source={require("../../assets/images/Rectangle-4272.png")}
                  style={{ ...styles.pinkshape2 }}
                />
                <Image
                  source={require("../../assets/images/Rectangle-4269.png")}
                  style={{ ...styles.pinkshape }}
                />

                <View
                  style={{
                    justifyContent: "flex-end",
                    alignItems: "flex-end",
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    transform: [{ scaleX: -1 }],
                    marginLeft: '5%'

                  }}
                >
                  <Image
                    source={require("../../assets/images/InvtryTrack.png")}
                    style={{
                      width: "95%",
                      height: "63%",
                      // marginTop: "30%",
                      resizeMode: "contain",
                    }}
                  />
                </View>
              </TouchableOpacity>

{userData?.user_type === "Stock Team" &&
               <TouchableOpacity onPress={() => {
     
                navigation.navigate("InventoryLog");


              }}
                style={{ backgroundColor: "#FFD9D9", flex: 1, borderRadius: 9 }}>
                <Text
                  style={{
                    position: "absolute",
                    color: '#D22471',
                    fontFamily: 'AvenirNextCyr-Medium',
                    padding: '5%',
                    zIndex: 1,
                    fontSize: 16,
                    justifyContent: 'flex-end',
                  }}>Inventory {'\n'}<Text style={{ fontFamily: 'AvenirNextCyr-Bold', fontSize: 20 }}>Log</Text>
                </Text>
                <Image
                  source={require("../../assets/images/Rectangle-4274.png")}
                  style={{ ...styles.blueShape }}
                />
                <View
                  style={{
                    justifyContent: "flex-end",
                    alignItems: "flex-end",
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    marginRight: "20%",

                  }}
                >
                  <Image
                    source={require("../../assets/images/CreateRFQ.png")}
                    style={{
                      width: "70%",
                      height: "75%",

                      resizeMode: "contain",
                    }}
                  />
                </View>
              </TouchableOpacity>}
            </View>

            <View style={styles.row1}>
              <TouchableOpacity
                onPress={() => {
                  {userData?.user_type === "Stock Team" ? navigation.navigate("OrderReviewStock"):
                    navigation.navigate("ListWarehouse")}

                }}
                style={{ backgroundColor: "#F3FEE4", flex: 0.6, borderRadius: 9 }}
              >
                <Text
                  style={{
                    position: "absolute",
                    color: '#5EA966',
                    fontFamily: 'AvenirNextCyr-Medium',
                    paddingTop: '5%',
                    paddingRight: '4%',
                    fontSize: 16,
                    justifyContent: 'flex-start',
                    right: 0,
                    zIndex: 1,
                    textAlign: 'right'
                  }}>{userData?.user_type === "Stock Team" ? "Sales":"Manage"}{'\n'}<Text style={{ fontFamily: 'AvenirNextCyr-Bold', fontSize: 20 }}>{userData?.user_type === "Stock Team" ? "Order":"Warehouse"}</Text>
                </Text>
                <Image
                  source={require("../../assets/images/Rectangle-4275.png")}
                  style={{ ...styles.purpleshape }}
                />
                <View
                  style={{
                    justifyContent: "flex-end",
                    alignItems: "flex-start",
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <Image
                    source={require("../../assets/images/Warehs.png")}
                    style={{
                      width: "100%",
                      height: "65%",

                    }}
                  />
                </View>
              </TouchableOpacity>

              {userData?.user_type === "Stock Team" &&
<>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("ManageDeliveries",{ Screen: "Stock",screenNameP : 'Confirmed',typeP :'Delivery' ,type1P :'Delivered',type2P : 'Delivery' });

                }}
                style={{ backgroundColor: "#D9D9D9", flex: 0.5, borderRadius: 9 }}
              >
                <Text
                  style={{
                    position: "absolute",
                    color: '#5C4B4B',
                    fontFamily: 'AvenirNextCyr-Medium',
                    padding: '5%',
                    fontSize: 16,
                    justifyContent: 'flex-start',
                    right: 0,
                    zIndex: 1,
                    textAlign: 'right'
                  }}><Text style={{ fontFamily: 'AvenirNextCyr-Medium', fontSize: 18 }}>Dispatch</Text>{'\n'}<Text style={{ fontFamily: 'AvenirNextCyr-Bold', fontSize: 17 }}>Details</Text>
                </Text>
                <Image
                  source={require("../../assets/images/Rectangle4.png")}
                  style={{ ...styles.grayShape }}
                />
                <View
                  style={{
                    justifyContent: "flex-end",
                    alignItems: "flex-start",
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    bottom: 0
                  }}
                >
                  <Image
                    source={require("../../assets/images/FMManage.png")}
                    style={{
                      position: "absolute",
                      resizeMode: "contain",
                      width: "100%",
                      height: "50%",
                      paddingHorizontal: "4%",
                      bottom: 10,
                    }}
                  />
                </View>
              </TouchableOpacity>


              <TouchableOpacity onPress={() => {
                  navigation.navigate("SalesOrderHistory",{screen:'other'});
              }} style={{ backgroundColor: "#FFECD9", flex: 0.5, borderRadius: 9 }}>
                <Text
                  style={{
                    position: "absolute",
                    color: '#E27600',
                    fontFamily: 'AvenirNextCyr-Medium',
                    padding: '5%',
                    zIndex: 1,
                    fontSize: 14,
                    justifyContent: 'flex-end',

                  }}>Order {'\n'}<Text style={{ fontFamily: 'AvenirNextCyr-Bold', fontSize: 20, }}>History</Text>
                </Text>
                <Image
                  source={require("../../assets/images/Rectangle6.png")}
                  style={{ ...styles.orangeShape }}
                />
                <View
                  style={{
                    justifyContent: "flex-end",
                    alignItems: "flex-end",
                    position: "absolute",
                    width: "100%",
                    height: "100%",

                  }}
                >
                  <Image
                    source={require("../../assets/images/orderHistory.png")}
                    style={{
                      width: "70%",
                      height: "80%",
                      marginRight: '5%',

                      resizeMode: "contain",
                    }}
                  />
                </View>
              </TouchableOpacity>
              </>
                  }

            </View>
          </View>
          {userData?.user_type != "Stock Team" ? <Text style={styles.title}>Recently Added</Text>: <Text style={styles.title}>   </Text>}

          {userData?.user_type != "Stock Team" &&
         <FlatList
         data={suggestedOrders}
         renderItem={ContactItem}
         keyExtractor={(item) => item.id.toString()}
         horizontal
         showsHorizontalScrollIndicator={false}
         contentContainerStyle={styles.flatListContentContainer}
       />
          }

          {userData?.user_type != "Stock Team" &&
          <View>
            <TouchableOpacity activeOpacity={1} onPress={openBottomSheet} style={{ backgroundColor: Colors.primary, paddingTop: '3.5%', paddingBottom: '1%', alignItems: 'center', borderTopEndRadius: 20, borderTopStartRadius: 20 }}>
              <Text style={{ fontFamily: 'AvenirNextCyr-Medium', fontSize: 12, color: 'white' }}>Change Service</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={1} onPress={openBottomSheet} style={{ borderRadius: 50, backgroundColor: Colors.primary, position: 'absolute', left: '47%', bottom: '50%', padding: 5 }}>
              <MaterialCommunityIcons
                name="dots-grid"
                size={25}
                color="white"
              />
            </TouchableOpacity>

            <BottomSheetComponent navigation={navigation} closeBottomSheet={closeBottomSheet} bottomSheetModalRef={bottomSheetModalRef} />
            <CustomFloating navigation={navigation} reports="InventoryReports" />
          </View>
          }
        </View>
      </BottomSheetModalProvider>
      <VersionModel modalVisible={modalVisible} closeModal={closeModal} />
    </GestureHandlerRootView>
  );
};

export default InvtryMangHome;

const styles = StyleSheet.create({
  imageView: {
    width: 90,
    height: 45,
    resizeMode: 'contain'
  },
  imageView1: {
    width: 30,
    height: 30,
  },
  tile: {
    flex: 1,
    height: 30,
    margin: 2,
  },
  topview: {
    flexDirection: "row",
    gap: 5,
    justifyContent: "space-between",
    marginHorizontal: "3%",
    marginVertical: "3%",
  },
  title: {
    fontSize: 19,
    // fontWeight: "600",
    color: "black",
    marginTop: "2%",
    marginLeft: "5%",
    marginBottom: "2%",
    fontFamily: 'AvenirNextCyr-Medium'
  },
  row: {
    backgroundColor: Colors.primary,
    height: "7%",
    justifyContent: "center",
    alignItems: "center",
    elevation: 9,
  },
  row1: {
    flexDirection: "column",
    flex: 1,
    gap: 15,
  },
  row2: {
    flexDirection: "column",
    flex: 1,
    gap: 15,
  },
  pinkshape: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: "stretch",
    marginRight: "10%",
  },
  pinkshape2: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: "stretch",
    marginLeft: "60%",
  },
  purpleshape: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: "stretch",
    marginTop: "15%",
    marginLeft: "18%",
  },
  grayShape: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: "stretch",
    marginTop: "18%",
    marginLeft: "20%",
  },
  blueShape: {
    flex: 0.8,
    width: null,
    height: null,
    resizeMode: "stretch",
    marginTop: "0%",
    marginRight: "20%",
  },
  orangeShape: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: "stretch",
    marginTop: "15%",
    marginRight: "15%",
  },
  itemContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 7,
    elevation: 3,
    alignItems: "center",
    marginRight: 5,
    height:'80%',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 5,
    marginLeft: 10,
    marginRight:10
  },
 text: {
    fontFamily: 'AvenirNextCyr-Bold',
    fontSize: 14,
    color: Colors.black
  }, text2: {
    fontFamily: 'AvenirNextCyr-Medium',
    fontSize: 14,
    color: 'gray'
  },
  row1View: {
    marginTop: 3,
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'space-around',
    gap: 10
  },
  recoredbuttonStyle: {
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    marginHorizontal: 5,
    height: 90,
    width: 110,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10
  },
  flatListContentContainer: {
    paddingHorizontal: '5%',
    paddingBottom: 10,
  },
  floatingButton: {
    borderRadius: 50,
    backgroundColor: Colors.primary,
    zIndex: 1,
    position: 'absolute',
    left: '47%',
    bottom: '50%',
    padding: 5,
  },
  changeServiceButton: {
    backgroundColor: Colors.primary,
    paddingTop: '3.5%',
    paddingBottom: '1%',
    alignItems: 'center',
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
  },
  changeServiceText: {
    fontFamily: 'AvenirNextCyr-Medium',
    fontSize: 12,
    color: 'white',
  },productName:{
    fontFamily: 'AvenirNextCyr-Medium',
    fontSize: 15,
    color: 'black',
    width:'90%'
  },productDetails:{
    fontFamily: 'AvenirNextCyr-Medium',
    fontSize: 13,
    color: 'gray'

  },productCategory:{
    fontFamily: 'AvenirNextCyr-Medium',
    fontSize: 13,
    color: 'gray'

  }
});
