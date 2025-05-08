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
import BottomSheetComponent from '../BottomSheetComponent';
import VersionModel from '../../components/versionModel';


const SuppMangHome = ({ navigation, route }) => {
   const queryParams = useRef({ limit: 10, offset: 0 });

  const { userData, changeDealerData, logout,
    totalQuotationRequested,
    purchaseOrderCreated,
    totalSupplier,
    token  ,setToken} = useContext(AuthContext);
  const [visible, setVisible] = useState(false);
  const [transitOrders, setTransitOrders] = useState([]);
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
  const ContactItem = ({ item }) => (
    <TouchableOpacity style={styles.itemContainer} onPress={() => { navigation.navigate('LiveLocation', { orderDetails: item }) }}>
      <Image source={require("../../assets/images/mapImg.png")} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.text}>{item.name} ({item.supplier_name}-{item.supplier_id})</Text>
      </View>
    </TouchableOpacity>
  );


  useEffect(() => {
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


   const getTransitOrders = async (limit, offset) => {
    console.log("getting",limit,offset,userData.id);

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${userData.token}`);

    console.log("result", userData.id)


    await fetch(`https://gsidev.ordosolution.com/api/rfq/rfq_purchase_order_details/?limit=${limit}&offset=${offset}&search_name=&user=${userData?.id}`, {
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
                gap: 3,
              }}
            >

         {/* Quotations */}
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
          style={{ ...styles.imageView1 }}
        />
        <Text style={{ fontSize: 10, fontFamily: 'AvenirNextCyr-Bold', color: "white", marginLeft: 1 }}>
          Quotations
        </Text>
      </View>

      {/* Value in the next row */}
      <Text style={{ fontSize: 12, color: "white", fontFamily: 'AvenirNextCyr-Bold', marginBottom: 5 }}>
        {salesData?.supplier_management?.total_quotation_requested ? salesData?.supplier_management?.total_quotation_requested : 0}
      </Text>
    </View>


              {/* Vertical Separator */}
              <View
                style={{
                  height: "70%", // Take full height
                  width: 1, // Width of the vertical line
                  backgroundColor: "white", // White color for the line
                  alignItems: 'center',
                  marginHorizontal: 5

                }}
              />

               {/* Purchase */}
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
          source={require("../../assets/images/delivery11.png")}
          style={{ ...styles.imageView1 }}
        />
        <Text style={{ fontSize: 10, fontFamily: 'AvenirNextCyr-Bold', color: "white", marginLeft: 1 }}>
          Purchase
        </Text>
      </View>

      {/* Value in the next row */}
      <Text style={{ fontSize: 12, color: "white", fontFamily: 'AvenirNextCyr-Bold', marginBottom: 5 }}>
        {salesData?.supplier_management?.purchase_order_created ? salesData?.supplier_management?.purchase_order_created : 0}
      </Text>
    </View>


              {/* Vertical Separator */}
              <View
                style={{
                  height: "70%", // Take full height
                  width: 1, // Width of the vertical line
                  backgroundColor: "white", // White color for the line
                  marginHorizontal: 5
                }}
              />

              
              {/* Suppliers */}
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
          style={{ ...styles.imageView1 }}
        />
        <Text style={{ fontSize: 10, fontFamily: 'AvenirNextCyr-Bold', color: "white", marginLeft: 1 }}>
          Suppliers
        </Text>
      </View>

      {/* Value in the next row */}
      <Text style={{ fontSize: 12, color: "white", fontFamily: 'AvenirNextCyr-Bold', marginBottom: 5 }}>
        {salesData?.supplier_management?.total_supplier ? salesData?.supplier_management?.total_supplier : 0}
      </Text>
    </View>
            </View>
          </View>

          <GradientText style={{ fontSize: 22, fontFamily: 'AvenirNextCyr-Bold', marginHorizontal: '5%', marginVertical: '1.5%' }}>Supplier Management</GradientText>

          <View
            style={{
              flexDirection: "row",
              gap: 13,
              flex: 10,
              marginHorizontal: "5%",
            }}
          >
            <View style={styles.row2}>

              <TouchableOpacity
                style={{
                  backgroundColor: "#F3FEE4",
                  flex: 1,
                  borderRadius: 9,
                  position: "relative",
                }}
                onPress={() => { navigation.navigate('AddSupplier', { screen: 'add' }) }}
              >
                <Text
                  style={{
                    // backgroundColor: "#FEE4F1",
                    // borderRadius: 9,
                    position: "absolute",
                    color: '#5EA966',
                    fontFamily: 'AvenirNextCyr-Medium',
                    padding: '5%',
                    fontSize: 16,
                    left: 0,
                    textAlign: 'left'

                  }}>Onboarding {'\n'}<Text style={{ fontFamily: 'AvenirNextCyr-Bold', fontSize: 20 }}>Suppliers</Text></Text>

                {/* <Image
                source={require("../../assets/images/Rectangle2.png")}
                style={{ ...styles.pinkshape2 }}
              /> */}
                <Image
                  source={require("../../assets/images/Rectangle-4275.png")}
                  style={{ ...styles.pinkshape }}
                />

                <View
                  style={{
                    justifyContent: "flex-end",
                    alignItems: "flex-end",
                    position: "absolute",
                    width: "100%",
                    height: "85%",
                    bottom:0
                  }}
                >
                  <Image
                    source={require("../../assets/images/onboardSup.png")}
                    style={{
                      width: "100%",
                      height: "55%",
                      // marginTop: "65%",
                      resizeMode: "contain",

                      // transform: [{ scaleX: -1 }],
                    }}
                  />
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => {
                userData?.client_config?.purchase_entry==="yes" ?
                navigation.navigate("ViewSupplier", { screen: "CreateRFQ", screenId: 1 }):
                navigation.navigate("ViewSupplier", { screen: "CreatePO", screenId: 1 });


              }}
                style={{ backgroundColor: "#FFD9D9", flex: 1, borderRadius: 9 }}>
                <Text
                  style={{
                    // backgroundColor: "#FEE4F1",
                    // borderRadius: 9,
                    position: "absolute",
                    color: '#D22471',
                    fontFamily: 'AvenirNextCyr-Medium',
                    padding: '5%',
                    zIndex: 1,
                    fontSize: 16,
                    justifyContent: 'flex-end',
                    // right:0


                  }}>Create {'\n'}<Text style={{ fontFamily: 'AvenirNextCyr-Bold', fontSize: 20 }}>{userData?.client_config?.purchase_entry==="yes" ? "RFQ" : "PO"}</Text>
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
                    height: "83%",
                    marginRight: "20%",
                    bottom:0

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
              </TouchableOpacity>

           {userData?.client_config?.purchase_entry==="yes" &&
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("RFQHistory");
                }}
                style={{ backgroundColor: "#D9D9D9", flex: 1, borderRadius: 9 }}
              >
                <Text
                  style={{
                    position: "absolute",
                    color: '#5A5555',
                    fontFamily: 'AvenirNextCyr-Medium',
                    paddingTop: '5%',
                    paddingLeft: '5%',
                    fontSize: 16,
                    justifyContent: 'flex-start',
                    left: 0,
                    zIndex: 1

                  }}>Purchase {'\n'}<Text style={{ fontFamily: 'AvenirNextCyr-Bold', fontSize: 20 }}>Request</Text>
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
              </TouchableOpacity>

}

            </View>

            <View style={styles.row1}>
              <TouchableOpacity onPress={() => {
                // navigation.navigate("CustomerList", { screen: "AdminOrders",screenId :4 });
                navigation.navigate("SupplierList");


              }} style={{ backgroundColor: "#EAE3FE", flex: 0.8, borderRadius: 9 }}>
                <Text
                  style={{
                    // backgroundColor: "#FEE4F1",
                    // borderRadius: 9,
                    position: "absolute",
                    color: '#7258C7',
                    fontFamily: 'AvenirNextCyr-Medium',
                    padding: '5%',
                    zIndex: 1,
                    fontSize: 16,
                    justifyContent: 'flex-end',
                    right: 0,
                    textAlign: 'right'


                  }}>View {'\n'}<Text style={{ fontFamily: 'AvenirNextCyr-Bold', fontSize: 20 }}>Suppliers</Text>
                </Text>
                <Image
                  source={require("../../assets/images/Rectangle-4267.png")}
                  style={{ ...styles.orangeShape }}
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
                    source={require("../../assets/images/viewSup.png")}
                    style={{
                      width: "90%",
                      height: "66%",
                      marginRight: '0%',
                      resizeMode: "contain",


                      // resizeMode: "stretch",
                    }}
                  />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("PurchaseOrder", { types: "PO" });

                }}
                style={{ backgroundColor: "#D8F9FF", flex: 1, borderRadius: 9 }}
              >
                <Text
                  style={{
                    // backgroundColor: "#FEE4F1",
                    // borderRadius: 9,
                    position: "absolute",
                    color: '#008499',
                    fontFamily: 'AvenirNextCyr-Medium',
                    padding: '5%',
                    fontSize: 16,
                    justifyContent: 'flex-start',
                    // right: 0,
                    zIndex: 1


                  }}>Purchase {'\n'}<Text style={{ fontFamily: 'AvenirNextCyr-Bold', fontSize: 20 }}>Order</Text>
                </Text>
                <Image
                  source={require("../../assets/images/Rectangle-4270.png")}
                  style={{ ...styles.grayShape }}
                />
                <View
                  style={{
                    justifyContent: "flex-end",
                    alignItems: "flex-end",
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    // marginTop: "5%",

                  }}
                >
                  <Image
                    source={require("../../assets/images/PurOrder.png")}
                    style={{
                      width: "95%",
                      height: "65%",
                      resizeMode: "contain",

                    }}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {transitOrders.length>0?<Text style={styles.title}>In Transit Orders</Text>:""}

          <FlatList
            data={transitOrders}
            renderItem={ContactItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
          <View>
           
            <TouchableOpacity activeOpacity={1} onPress={openBottomSheet} style={{ backgroundColor: Colors.primary, paddingTop: '3.5%', paddingBottom: '1%', alignItems: 'center', borderTopEndRadius: 20, borderTopStartRadius: 20 }}>
              <Text style={{ fontFamily: 'AvenirNextCyr-Medium', fontSize: 12, color: 'white' }}>Change Service</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={1} onPress={openBottomSheet} style={{ borderRadius: 50, backgroundColor: Colors.primary, position: 'absolute', left: '47%', bottom: '50%', padding: 5 }}>
              {/* <Text style={{ color: 'white', backgroundColor: '#4b0482', borderRadius: 50, paddingVertical: '1%', paddingLeft: '1%', paddingRight: '1.3%' }}> */}
              <MaterialCommunityIcons
                name="dots-grid"
                size={25}
                color="white"
              />
              {/* </Text> */}
            </TouchableOpacity>
            <BottomSheetComponent navigation={navigation} closeBottomSheet={closeBottomSheet} bottomSheetModalRef={bottomSheetModalRef} />

          </View>
        </View>
      </BottomSheetModalProvider>
      <VersionModel modalVisible={modalVisible} closeModal={closeModal} />
    </GestureHandlerRootView>
  );
};

export default SuppMangHome;

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
    marginTop: "1%",
    marginLeft: "5%",
    marginBottom: "2%",
    fontFamily: 'AvenirNextCyr-Medium'
  },
  row: {
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    elevation: 9,
    padding: '2%'
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
    marginLeft: "15%",
    marginTop: "60%",

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
    marginTop: "10%",
    marginLeft: "18%",
  },
  grayShape: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: "stretch",
    marginTop: "15%",
    marginRight: "20%",
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
    flex:1

  }, text: {
    fontFamily: 'AvenirNextCyr-Medium',
    fontSize: 12,
    color: Colors.black
  }, text2: {
    fontFamily: 'AvenirNextCyr-Medium',
    fontSize: 14,
    color: 'gray'
  },
  row1View: {
    //marginHorizontal: 50,
    // paddingHorizontal: 30,
    // marginLeft:30,
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
