import React, { useRef, useState, useContext, useEffect, useCallback } from 'react';
import { View, Text, Image, StyleSheet, Alert, FlatList, Button, TouchableWithoutFeedback, TouchableOpacity } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import Entypo from "react-native-vector-icons/Entypo";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Colors from "../../constants/Colors";
import { BottomSheetModal, BottomSheetScrollView, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView, PanGestureHandler, State } from 'react-native-gesture-handler';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Menu, MenuItem, MenuDivider } from 'react-native-material-menu';
import { AuthContext } from '../../Context/AuthContext';
import GradientText from '../../styles/GradientText';
import Octicons from "react-native-vector-icons/Octicons";
import CustomFloating from '../../components/CustomFloating';
// import { FloatingMenu } from 'react-native-floating-action-menu';
import { useFocusEffect } from "@react-navigation/native";
import { hs, vs, ms } from '../../utils/Metrics';
import FormatPrice from '../../utils/FormatPrice';
import BottomSheetComponent from '../BottomSheetComponent';
// import { searchItem } from "../../utils/Search";
import { debounce } from "../../utils/Search";
import VersionModel from '../../components/versionModel';


const OrderMangHome = ({ navigation, route }) => {

  const queryParams = useRef({ limit: 10, offset: 0 });

  const { token, userData, changeDealerData, logout, setOrdersLoading,
    totalSales,
    totalOrders,
    totalReturns, salesManager,setToken } = useContext(AuthContext);
  // console.log("dsfsdfsdf", userData)
  const [transitOrders, setTransitOrders] = useState([]);
  const [actionMenu, setActionMenu] = useState(false);
  const [salesData, setSalesData] = useState();
  const [modalVisible, setModalVisible] = useState(false);

  const handlePress = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const [visible, setVisible] = useState(false);
  const hideMenu = () => setVisible(false);
  const bottomSheetModalRef = useRef(null);

  const openBottomSheet = () => {
    bottomSheetModalRef.current?.present();
  };

  const closeBottomSheet = () => {
    bottomSheetModalRef.current?.dismiss();
  };

  // useEffect(() => {
  //   if (userData?.token) {
  //     getSalesDetails();
  //   }
  // }, [userData])

useFocusEffect(
  React.useCallback(() => {
    getSalesDetails();
  }, [])
);

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
          console.log("------>>>>>>>>>>>",res)
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }
  

  const getTransitOrders = async (limit, offset) => {
    console.log("getting",limit,offset,userData.id);

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${userData.token}`);

    console.log("result", userData.id)


    await fetch(`https://gsidev.ordosolution.com/api/locate_orders/?limit=${limit}&offset=${offset}&user=${userData?.id}`, {
      method: 'GET',
      headers: myHeaders,

    })
      .then(response => response.json())
      .then(res => {

     
        setTransitOrders(res)
console.log("res",res)
      })
      .catch((error) => {
        // Handle any errors that occurred during the request
        console.error(error);
      });
  }

 useEffect(() => {
    getTransitOrders(queryParams.current.limit, queryParams.current.offset);
  }, [userData]);




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

  const ContactItem = ({ item }) => (
    <TouchableOpacity style={styles.itemContainer} onPress={() => { navigation.navigate('LiveLocation', { orderDetails: item }) }}>
      <Image source={require("../../assets/images/mapImg.png")} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={{
          flexWrap: 'wrap', fontFamily: "AvenirNextCyr-Medium",
          fontSize: 14,
          color: Colors.black,
        }} numberOfLines={3}>
          {item.name} ({item.assignee_name}-{item.assigne_to})
        </Text>
        {/* <Text style={styles.text2}>{item.location}</Text>
        <Text style={styles.text2}>{item.phone}</Text> */}
      </View>
    </TouchableOpacity>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1,backgroundColor:'white'  }}>

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
                gap: 15,
                justifyContent: 'space-between',
              }}
            >
    <View
      style={{
        flexDirection: "column", 
        flex: 0.8,
        alignItems: 'center'
      }}
    >
      {/* Image and Name in the same row */}
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Image
          source={require("../../assets/images/box11.png")}
          style={{ ...styles.imageView1 }}
        />
        <Text style={{ fontSize: 12, fontFamily: 'AvenirNextCyr-Bold', color: "white", marginLeft: 1 }}>
          Sales
        </Text>
      </View>

      {/* Value in the next row */}
      <Text style={{ fontSize: 12, color: "white", fontFamily: 'AvenirNextCyr-Medium', marginBottom: 5 }}>
      {salesData?.order_management?.total_sales ? 
         new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(salesData.order_management.total_sales) : 
         new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(0)
       }
     </Text>

    </View>
              <View
                style={{
                  height: "70%",
                  width: 1,
                  backgroundColor: "white",
                  alignItems: 'center',
                  marginHorizontal: 5

                }}
              />
    <View
      style={{
        flexDirection: "column", 
        flex: 0.4,
        alignItems: 'center'
      }}
    >
      {/* Image and Name in the same row */}
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Image
          source={require("../../assets/images/delivery11.png")}
          style={{ ...styles.imageView1 }}
        />
        <Text style={{ fontSize: 12, fontFamily: 'AvenirNextCyr-Bold', color: "white", marginLeft: 1 }}>
          Orders
        </Text>
      </View>

      {/* Value in the next row */}
      <Text style={{ fontSize: 12, color: "white", fontFamily: 'AvenirNextCyr-Medium', marginBottom: 5 }}>
        {salesData?.order_management?.total_orders ? salesData?.order_management?.total_orders : 0}
      </Text>
    </View>

              {/* Vertical Separator */}
              <View
                style={{
                  height: "70%", // Take full height
                  width: 1, // Width of the vertical line
                  backgroundColor: "white", // White color for the line
                  marginHorizontal: 2,

                }}
              />

              {/* Returns */}
              
    <View
      style={{
        flexDirection: "column", 
        flex: 0.4,
        alignItems: 'center'
      }}
    >
      {/* Image and Name in the same row */}
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Image
          source={require("../../assets/images/box122.png")}
          style={{ ...styles.imageView1 }}
        />
        <Text style={{ fontSize: 12, fontFamily: 'AvenirNextCyr-Bold', color: "white", marginLeft: 1 }}>
          Returns
        </Text>
      </View>

      {/* Value in the next row */}
      <Text style={{ fontSize: 12, color: "white", fontFamily: 'AvenirNextCyr-Medium', marginBottom: 5 }}>
        {salesData?.order_management?.total_returns ? salesData?.order_management?.total_returns : 0}
      </Text>
    </View>
            </View>
          </View>

          {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}> */}
          <GradientText style={{ fontSize: 22, fontFamily: 'AvenirNextCyr-Bold', marginHorizontal: '5%', marginVertical: '1%' }}>Order Management</GradientText>

          <View
            style={{
              flexDirection: "row",
              gap: 13,
              flex: 10,
              marginHorizontal: "5%",
            }}
          >
            <View style={styles.row1}>
              <TouchableOpacity
                style={{
                  backgroundColor: "#FEE4F1",
                  flex: 1.3,
                  borderRadius: 9,
                  position: "relative",
                }}
                onPress={() => {
                  navigation.navigate("CustomerList", { screen: "OrdoCustomerDetails", screenId: 1 });

                }}
              >
                <Text
                  style={{
                    // backgroundColor: "#FEE4F1",
                    // borderRadius: 9,
                    position: "absolute",
                    color: '#D22471',
                    fontFamily: 'AvenirNextCyr-Medium',
                    padding: '5%',
                    fontSize: 18

                  }}>Create {'\n'}<Text style={{ fontFamily: 'AvenirNextCyr-Bold', fontSize: 25, }}>Order</Text></Text>

                <Image
                  source={require("../../assets/images/Rectangle2.png")}
                  style={{ ...styles.pinkshape2 }}
                />
                <Image
                  source={require("../../assets/images/Rectangle1.png")}
                  style={{ ...styles.pinkshape }}
                />

                <View
                  style={{
                    justifyContent: "flex-end",
                    alignItems: "center",
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <Image
                    source={require("../../assets/images/createorder.png")}
                    style={{
                      width: "95%",
                      height: "65%",
                      resizeMode: "contain"

                      // marginLeft: "5%",
                    }}
                  />
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => {
                // navigation.navigate("CustomerList", { screen: "AdminOrders",screenId :4 });
                navigation.navigate("SalesOrderHistory",{ screen: "order"});
              }} style={{ backgroundColor: "#FFECD9", flex: 1, borderRadius: 9 }}>
                <Text
                  style={{
                    // backgroundColor: "#FEE4F1",
                    // borderRadius: 9,
                    position: "absolute",
                    color: '#E27600',
                    fontFamily: 'AvenirNextCyr-Medium',
                    padding: '5%',
                    zIndex: 1,
                    fontSize: 14,
                    justifyContent: 'flex-end',
                    // right:0


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


              {salesManager && <TouchableOpacity
                onPress={() => {
                  navigation.navigate("OrderApproval");

                }}
                style={{ backgroundColor: "#D9D9D9", flex: 1, borderRadius: 9 }}
              >
                <Text
                  style={{
                    // backgroundColor: "#FEE4F1",
                    // borderRadius: 9,
                    position: "absolute",
                    color: '#5A5555',
                    fontFamily: 'AvenirNextCyr-Medium',
                    paddingTop: '5%',
                    paddingLeft: '5%',
                    fontSize: 16,
                    justifyContent: 'flex-start',
                    left: 0,
                    zIndex: 1


                  }}>Order {'\n'}<Text style={{ fontFamily: 'AvenirNextCyr-Bold', fontSize: 20 }}>Approval</Text>
                </Text>
                <Image
                  source={require("../../assets/images/Rectangle-4271.png")}
                  style={{ ...styles.purpleshape }}
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
                    source={require("../../assets/images/PurchaseReq.png")}
                    style={{
                      width: "80%",
                      height: "65%",
                      marginRight: "3%",

                      resizeMode: "contain",
                    }}
                  />
                </View>
              </TouchableOpacity>}


              {/* {salesManager &&
                <TouchableOpacity onPress={() => {
                  // navigation.navigate("CustomerList", { screen: "AdminOrders",screenId :4 });
                  navigation.navigate("OrderApproval");
                }} style={{ backgroundColor: "#FFECD9", flex: 1, borderRadius: 9 }}>
                  <Text
                    style={{
                      // backgroundColor: "#FEE4F1",
                      // borderRadius: 9,
                      position: "absolute",
                      color: '#E27600',
                      fontFamily: 'AvenirNextCyr-Medium',
                      padding: '5%',
                      zIndex: 1,
                      fontSize: 14,
                      justifyContent: 'flex-end',
                      // right:0
                    }}>Order {'\n'}<Text style={{ fontFamily: 'AvenirNextCyr-Bold', fontSize: 20, }}>Approval</Text>
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
                </TouchableOpacity>} */}


            </View>

            <View style={styles.row2}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("ViewQuotations");

                }}
                style={{ backgroundColor: "#EAE3FE", flex: 1, borderRadius: 9 }}
              >
                <Text
                  style={{
                    // backgroundColor: "#FEE4F1",
                    // borderRadius: 9,
                    position: "absolute",
                    color: '#261361',
                    fontFamily: 'AvenirNextCyr-Medium',
                    paddingTop: '5%',
                    paddingLeft: '5%',
                    fontSize: 14,
                    justifyContent: 'flex-start',
                  }}>Manage {'\n'}<Text style={{ fontFamily: 'AvenirNextCyr-Bold', fontSize: 20, }}>Quotation</Text>
                </Text>
                <Image
                  source={require("../../assets/images/Rectangle3.png")}
                  style={{ ...styles.purpleshape }}
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
                    source={require("../../assets/images/Quotation.png")}
                    style={{
                      width: "70%",
                      height: "75%",
                      // marginRight: "0%",

                      resizeMode: "contain",
                    }}
                  />
                </View>
              </TouchableOpacity>


              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("CustomerList", { screen: "SalesReturn", screenId: 3 });

                }}
                style={{ backgroundColor: "#D9D9D9", flex: 1, borderRadius: 9 }}
              >
                <Text
                  style={{
                    // backgroundColor: "#FEE4F1",
                    // borderRadius: 9,
                    position: "absolute",
                    color: '#5C4B4B',
                    fontFamily: 'AvenirNextCyr-Medium',
                    padding: '5%',
                    fontSize: 14,
                    justifyContent: 'flex-end',
                    right: 0


                  }}>Create {'\n'}<Text style={{ fontFamily: 'AvenirNextCyr-Bold', fontSize: 20, }}>Return</Text>
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
                  }}
                >
                  <Image
                    source={require("../../assets/images/createReturn.png")}
                    style={{
                      width: "85%",
                      height: "75%",
                      marginLeft: "0%",
                      resizeMode: 'contain'
                    }}
                  />
                </View>
              </TouchableOpacity>



              <TouchableOpacity onPress={() => {
                // navigation.navigate("CustomerList", { screen: "ReturnsHistory", screenId: 5 });
                navigation.navigate("ReturnsHistory");

              }}
                style={{ backgroundColor: "#D8F9FF", flex: 0.9, borderRadius: 9 }}>
                <Text
                  style={{
                    // backgroundColor: "#FEE4F1",
                    // borderRadius: 9,
                    position: "absolute",
                    color: '#008499',
                    fontFamily: 'AvenirNextCyr-Medium',
                    padding: '5%',
                    zIndex: 1,
                    fontSize: 14,
                    justifyContent: 'flex-end',
                    // right:0


                  }}>Return {'\n'}<Text style={{ fontFamily: 'AvenirNextCyr-Bold', fontSize: 20, }}>History</Text>
                </Text>
                <Image
                  source={require("../../assets/images/Rectangle5.png")}
                  style={{ ...styles.blueShape }}
                />
                <View
                  style={{
                    justifyContent: "flex-end",
                    alignItems: "flex-end",
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    // marginTop: "10.8%",        

                  }}
                >
                  <Image
                    source={require("../../assets/images/returnHistory.png")}
                    style={{
                      width: "85%",
                      height: "85%",

                      resizeMode: 'contain'
                    }}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>


          {transitOrders.length>0?<Text style={styles.title}>Locate Orders</Text>:""}

          <FlatList
            data={transitOrders}
            renderItem={ContactItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
          <View>

            <TouchableOpacity activeOpacity={1} onPress={openBottomSheet} style={{ backgroundColor: Colors.primary, paddingTop: '3.5%', paddingBottom: '1%', alignItems: 'center', borderTopEndRadius: 20, borderTopStartRadius: 20, }}>
              <Text style={{ fontFamily: 'AvenirNextCyr-Medium', fontSize: 12, color: 'white' }}> Change Service</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={1} onPress={openBottomSheet} style={{ borderRadius: 50, backgroundColor: Colors.primary, position: 'absolute', left: '47%', bottom: '50%', padding: 5 }}>
              {/* <Text style={{ color: 'white', backgroundColor: '#4b0482', borderRadius: 50, paddingVertical: '1%', paddingLeft: '1%', paddingRight: '1.3%' }}> */}
              <MaterialCommunityIcons
                name="dots-grid"
                size={25}
                color="white"
              />
            </TouchableOpacity>
            <BottomSheetComponent navigation={navigation} closeBottomSheet={closeBottomSheet} bottomSheetModalRef={bottomSheetModalRef} />
    <CustomFloating
              navigation={navigation}
              reports="OrderReports"
              screen="Order"
            />
          </View>

        </View>

      </BottomSheetModalProvider>
      <VersionModel modalVisible={modalVisible} closeModal={closeModal} />
    </GestureHandlerRootView>
  );
};

export default OrderMangHome;

const styles = StyleSheet.create({
  imageView: {
    width: 90,
    height: 45,
    resizeMode: 'contain'
  },
  imageView1: {
    width: 25,
    height: 25,
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
    color: "black",
    marginTop: "2%",
    marginLeft: "5%",
    marginBottom: "2%",
    fontFamily: 'AvenirNextCyr-Medium'
  },
  row: {
    backgroundColor: Colors.primary,
    alignItems: "center",
    elevation: 9,
    padding: '2%',
  },
  row1: {
    flexDirection: "column",
    // height: "33%",
    flex: 1,
    gap: 15,
    // marginBottom: "2%",
    // justifyContent: "center",
    // marginHorizontal: "5%",
    // marginTop: '4%'
  },
  row2: {
    flexDirection: "column",
    flex: 1,
    // height: "17%",
    gap: 15,
    // justifyContent: "center",
    // marginHorizontal: "5%",
  },
  pinkshape: {
    flex: 0.5,
    width: null,
    height: null,
    resizeMode: "stretch",
    marginRight: "8%",
  },
  pinkshape2: {
    flex: 0.5,
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
    marginTop: "30%",
    marginRight: "15%",
  },
  grayShape: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: "stretch",
    marginTop: "25%",
    marginLeft: "30%",
  },
  blueShape: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: "stretch",
    marginTop: "25%",
    marginRight: "10%",
  },
  orangeShape: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: "stretch",
    marginBottom: "20%",
    marginRight: "15%",
  },
  itemContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 7,
    elevation: 3,
    alignItems: "center",
    marginRight: 5,
    marginLeft: 15,
    height: '75%',
    width: 250
    // marginHorizontal:'2%'

  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 25,
    marginLeft: 10
  },
  textContainer: {
    padding: 5,
    width: '70%',

  }, text: {
    fontSize: 13,
    color: Colors.black,
    fontFamily: 'AvenirNextCyr-Medium'
  }, text2: {
    fontWeight: "500",
    fontSize: 14,
    color: 'gray',
    fontFamily: 'AvenirNextCyr-Medium'
  },
  row1View: {
    //marginHorizontal: 50,
    // paddingHorizontal: 30,
    // marginLeft:30,
    marginTop: 10,
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
    // shadowRadius: 2,
    // elevation: 5,
    height: 90,
    width: 110,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10
  },

});
