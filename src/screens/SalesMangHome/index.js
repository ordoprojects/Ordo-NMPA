import React, { useRef, useState, useContext } from 'react';
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
import BottomSheetComponent from '../BottomSheetComponent';

const contacts = [
  {
    id: "1",
    name: "Amul",
    address: "8",
    phone: "10-5-2024",
    imageSource: "https://m.media-amazon.com/images/I/51SUyCOGdZL._SY300_SX300_QL70_FMwebp_.jpg",
  },
  {
    id: "2",
    name: "KitKat",
    address: "15",
    phone: "20-5-2024",
    imageSource: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=1080/app/assets/products/sliding_images/jpeg/b33cfe6a-4fee-41a6-93be-3a271b06fd97.jpg?ts=1708594226",
  },
  {
    id: "3",
    name: "Mars",
    address: "25",
    phone: "10-5-2024",
    imageSource: "https://www.bigbasket.com/media/uploads/p/xxl/251211-2_7-mars-nougat-caramel-filled-chocolate-bar.jpg",
  },
];



const SalesMangHome = ({ navigation, route }) => {

  const { token, userData, changeDealerData, logout } = useContext(AuthContext);
  const [visible, setVisible] = useState(false);
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
    <TouchableOpacity style={styles.itemContainer} >
      <Image source={{ uri: item.imageSource }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.text}>{item.name}</Text>
        <Text style={styles.text2}>Stock : {item.address}</Text>
        <Text style={styles.text2}>Mfg. Date :{item.phone}</Text>
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

  return (
    <GestureHandlerRootView style={{ flex: 1,backgroundColor:'white' }}>

      <BottomSheetModalProvider>
        <View style={{ flex: 1, }}>
          <View style={styles.topview}>
            <View
              style={{
                flexDirection: "row",
                gap: 5,
                
              }}
            >
              <Image
                source={require("../../assets/images/GSILogo.png")}
                style={{ ...styles.imageView }}
              />
              <View style={{ flexDirection: "column" }}>
                <Text style={{ fontSize: 19, fontFamily: 'AvenirNextCyr-Bold' }}>Welcome</Text>
                <Text style={{ color: "gray", fontFamily: 'AvenirNextCyr-Medium' }}>{userData?.name}</Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                gap: 15,
              }}
            >
              {/* <Feather name="shopping-cart" color={`black`} size={30} /> */}
              <Menu
                visible={visible}
                anchor={<TouchableOpacity onPress={showMenu}><Image source={require('../../assets/images/UserMgmt.png')} style={{ height: 40, width: 40, tintColor: Colors.primary, marginRight: 10 }} />
                  {/* <Text style={{ fontSize: 10, color: Colors.primary, fontFamily: 'AvenirNextCyr-Thin' }}>{userData?.name}</Text> */}
                </TouchableOpacity>}
                onRequestClose={hideMenu}
                tyle={{ paddingBottom: 10, marginRight: 10 }}
              >

                <MenuItem style={{ fontSize: 14 }}><MaterialCommunityIcons
                  name="account-edit-outline"
                  size={23}
                  color="black"

                /> <Text style={{ fontFamily: 'AvenirNextCyr-Medium', fontSize: 13.5 }}>Edit Profile</Text></MenuItem>
                <MenuDivider color='gray' />
                <MenuItem style={{ fontSize: 12 }}><MaterialCommunityIcons
                  name="shield-check-outline"
                  size={18}
                  color="black"

                /> <Text style={{ fontFamily: 'AvenirNextCyr-Medium', fontSize: 13.5 }}>Change Password</Text></MenuItem>
                <MenuDivider color='gray' />

                <MenuItem onPress={logoutAlert} style={{ fontSize: 14 }}><MaterialCommunityIcons
                  name="logout"
                  size={17}
                  color="black"
                /> <Text style={{ fontFamily: 'AvenirNextCyr-Medium', fontSize: 13.5 }}>Log Out</Text></MenuItem>


                {/* {!clockedOut && <MenuDivider />} */}
                {/* {!clockedOut && <MenuItem onPress={clockoutAlert}>Clock Out</MenuItem>} */}
              </Menu>
              {/* <Entypo name="menu" size={30} color="black" /> */}
            </View>
          </View>

          <View style={styles.row}>
            <View
              style={{
                flexDirection: "row",
                gap: 20,
                justifyContent: 'space-between'
              }}
            >
              <View
                style={{
                  flexDirection: "row",

                }}
              >
                <Image
                  source={require("../../assets/images/box122.png")}
                  style={{ ...styles.imageView1 }}
                />
                <View style={{ flexDirection: "column" }}>
                  <Text style={{ fontSize: 11, fontFamily: 'AvenirNextCyr-Bold', color: "white" }}>
                    Products
                  </Text>
                  <Text style={{ fontSize: 12, color: "white" }}>58</Text>
                </View>
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

              <View
                style={{
                  flexDirection: "row",
                }}
              >
                <Image
                  source={require("../../assets/images/Vector.png")}
                  style={{ ...styles.imageView1, width: 20, height: 20, marginTop: 8, marginRight: 8 }}
                />
                <View style={{ flexDirection: "column" }}>
                  <Text style={{ fontSize: 11, fontFamily: 'AvenirNextCyr-Bold', color: "white" }}>
                    Warehouses
                  </Text>
                  <Text style={{ fontSize: 12, color: "white" }}>29</Text>
                </View>
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
              <View
                style={{
                  flexDirection: "row",
                }}
              >
                <Image
                  source={require("../../assets/images/box11.png")}
                  style={{ ...styles.imageView1 }}
                />
                <View style={{ flexDirection: "column" }}>
                  <Text style={{ fontSize: 11, fontFamily: 'AvenirNextCyr-Bold', color: "white" }}>
                    Categories
                  </Text>
                  <Text style={{ fontSize: 12, color: "white" }}>10</Text>
                </View>
              </View>
            </View>
          </View>

          <GradientText style={{ fontSize: 22, fontFamily: 'AvenirNextCyr-Bold', paddingHorizontal: '5%', marginVertical: '3%' }}>Inventory Management</GradientText>

          <View style={{ flexDirection: 'row', height: '53%', gap: 15 }}>
            <View style={styles.row2}>



              <TouchableOpacity onPress={() => {
                // navigation.navigate("CustomerList", { screen: "AdminOrders",screenId :4 });
                navigation.navigate("Inventory");


              }} style={{ backgroundColor: "#EAE3FE", flex: 0.4, borderRadius: 9 }}>
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
                    justifyContent: 'flex-start',
                    left: 0,
                    textAlign: 'left'


                  }}>Manage {'\n'}<Text style={{ fontFamily: 'AvenirNextCyr-Bold', fontSize: 18 }}>Products</Text>
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
                      width: "73%",
                      height: "85%",
                      marginRight: '22%'

                      // resizeMode: "stretch",
                    }}
                  />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  backgroundColor: "#D8F9FF",
                  flex: 0.6,
                  position: "relative",
                  borderRadius: 9
                }}
                onPress={() => {
                  navigation.navigate("InvtryReg");

                }}
              >
                <Text
                  style={{
                    // backgroundColor: "#FEE4F1",
                    // borderRadius: 10,
                    position: "absolute",
                    color: '#008499',
                    fontFamily: 'AvenirNextCyr-Medium',
                    padding: '5%',
                    fontSize: 18,
                    textAlign: 'right',
                    right: 0,
                    zIndex: 1

                  }}>Inventory {'\n'}<Text style={{ fontFamily: 'AvenirNextCyr-Bold', fontSize: 23, }}>Tracking</Text></Text>


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
                      width: "90%",
                      height: "80%",
                      // marginTop: "30%",
                      // resizeMode: "stretch",
                    }}
                  />
                </View>
              </TouchableOpacity>


            </View>

            <View style={styles.row1}>


              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("ListWarehouse");

                }}
                style={{ backgroundColor: "#F3FEE4", flex: 0.6, borderRadius: 9 }}
              >
                <Text
                  style={{
                    // backgroundColor: "#FEE4F1",
                    // borderRadius: 9,
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



                  }}>Manage {'\n'}<Text style={{ fontFamily: 'AvenirNextCyr-Bold', fontSize: 20 }}>Warehouse</Text>
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
                      width: "95%",
                      height: "75%",
                      // marginRight: "25%",

                      // resizeMode: "stretch",
                    }}
                  />
                </View>
              </TouchableOpacity>




              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("InventoryAging");

                }}
                style={{ backgroundColor: "#D9D9D9", flex: 0.4, borderRadius: 9 }}
              >
                <Text
                  style={{
                    // backgroundColor: "#FEE4F1",
                    // borderRadius: 9,
                    position: "absolute",
                    color: '#5C4B4B',
                    fontFamily: 'AvenirNextCyr-Medium',
                    padding: '5%',
                    fontSize: 16,
                    justifyContent: 'flex-start',
                    right: 0,
                    zIndex: 1,
                    textAlign: 'right'


                  }}><Text style={{ fontFamily: 'AvenirNextCyr-Bold', fontSize: 17 }}>Analysis</Text> &{'\n'}<Text style={{ fontFamily: 'AvenirNextCyr-Bold', fontSize: 17 }}>Reporting</Text>
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
                    // transform: [{ scaleX: -1 }],

                    // marginTop: "5%",

                  }}
                >
                  <Image
                    source={require("../../assets/images/Analysis.png")}
                    style={{
                      width: "80%",
                      height: "65%",
                      // resizeMode: "stretch",
                    }}
                  />
                </View>
              </TouchableOpacity>




            </View>
          </View>
          <Text style={styles.title}>Suggested Orders</Text>



          <FlatList
            data={contacts}
            renderItem={ContactItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
          <View>
            
            <TouchableOpacity activeOpacity={1} onPress={openBottomSheet} style={{ backgroundColor: Colors.primary, paddingTop: '3.5%', paddingBottom: '1%', alignItems: 'center', borderTopEndRadius: 20, borderTopStartRadius: 20 }}>
              <Text style={{ fontFamily: 'AvenirNextCyr-Medium', fontSize: 12, color: 'white' }}>Change Service</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={1} onPress={openBottomSheet} style={{ borderRadius: 50, backgroundColor: Colors.primary, position: 'absolute', left: '45%', bottom: '50%', padding: 5 }}>
              {/* <Text style={{ color: 'white', backgroundColor: '#4b0482', borderRadius: 50, paddingVertical: '1%', paddingLeft: '1%', paddingRight: '1.3%' }}> */}
              <MaterialCommunityIcons
                name="dots-grid"
                size={25}
                color="white"
              />
              {/* </Text> */}
            </TouchableOpacity>
            <BottomSheetComponent navigation={navigation} closeBottomSheet={closeBottomSheet} bottomSheetModalRef={bottomSheetModalRef}/>

          </View>
        </View>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export default SalesMangHome;

const styles = StyleSheet.create({
  imageView: {
    width: 60,
    height: 50,
  },
  imageView1: {
    width: 40,
    height: 40,
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
    marginVertical: "5%",
    
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
    // height: "53%",
    gap: 15,
    // marginBottom: "2%",
    justifyContent: "center",
    marginRight: "5%",
    // marginTop:'4%'
  },
  row2: {
    flexDirection: "column",
    // height: "53%",
    gap: 15,
    flex: 1,
    // gap: 15,
    justifyContent: "center",
    marginLeft: "5%",
  },
  pinkshape: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: "stretch",
    marginRight: "10%",
    // marginTop: "20%",

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
    marginRight: 10,
    flex: 1,
    marginLeft: 11,
    height: '75%'
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 25,
    marginLeft: 10
  },
  textContainer: {
    padding: 5,

  }, text: {
    fontFamily: 'AvenirNextCyr-Bold',
    fontSize: 14,
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
    justifyContent: 'space-between',
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
