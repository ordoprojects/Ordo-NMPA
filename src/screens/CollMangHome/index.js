import React, { useRef, useState, useContext, useEffect ,useCallback} from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Alert,
  FlatList,
  Button,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import Entypo from "react-native-vector-icons/Entypo";
import Colors from "../../constants/Colors";
import {
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import {
  GestureHandlerRootView,
  PanGestureHandler,
  State,
} from "react-native-gesture-handler";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Menu, MenuItem, MenuDivider } from "react-native-material-menu";
import { AuthContext } from "../../Context/AuthContext";
import GradientText from "../../styles/GradientText";
import CustomFloating from "../../components/CustomFloating";
import FormatPrice from "../../utils/FormatPrice";
import BottomSheetComponent from '../BottomSheetComponent';
import VersionModel from '../../components/versionModel';
import BottomSkeleton from "../Skeleton/BottomSkeleton";
import { useFocusEffect } from '@react-navigation/native';

const CollMangHome = ({ navigation, route }) => {
  const {
    token,
    userData,
    changeDealerData,
    logout,
    totalQuotationRequested,
    purchaseOrderCreated,
    totalSupplier,
    totalAccSales,
    totalPurchase,
    totalTransactions,
    setToken
  } = useContext(AuthContext);

  const [visible, setVisible] = useState(false);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [salesData, setSalesData] = useState();
  const [modalVisible, setModalVisible] = useState(false);

  const handlePress = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const hideMenu = () => setVisible(false);

  const bottomSheetModalRef = useRef(null);

     useFocusEffect(
        React.useCallback(() => {
               getSalesUnpaid();
        }, [userData?.token])
    );

  const ContactItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() =>
        navigation.navigate("CollInvoiceDetails", {
          details: item,
          screen: item.type,
        })
      }
    >
      <Image
        source={require("../../assets/images/unpaidInv.png")}
        style={styles.image}
      />
      <View style={styles.textContainer}>
        <Text style={styles.text}>INVOICE {item?.invoice}</Text>
        <Text style={[styles.text2]}>
          {item?.supplier_name || item?.customer_name}
        </Text>
        <Text
          style={[
            styles.text2,
            { color: "tomato", fontFamily: "AvenirNextCyr-Bold" },
          ]}
        >
          {item.amount}
        </Text>
      </View>
    </TouchableOpacity>
  );

  useEffect(() => {
    if (userData?.token) {
      getSalesDetails();
    }
  }, [userData]);


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

  const getSalesUnpaid = async () => {
    setLoading(true);
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${userData?.token}`);

    await fetch(`https://gsidev.ordosolution.com/api/acc_sales_v2/?limit=10&offset=0&search_name=&status=UnPaid`, {
      method: 'GET',
      headers: myHeaders,

    })
      .then(response => response.json())
      .then(res => {
          setFilteredInvoices(res)
          setLoading(false);   
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }


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
                gap: 2,
                paddingHorizontal: "7%",
              }}
            >
    <View
      style={{
        flexDirection: "column", 
        flex: 0.4,
        alignItems: 'center',
      }}
    >
      {/* Image and Name in the same row */}
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Image
          source={require("../../assets/images/delivery11.png")}
          style={{ ...styles.imageView1 }}
        />
        <Text style={{ fontSize: 10, fontFamily: 'AvenirNextCyr-Bold', color: "white", marginLeft: 1 }}>
          Transactions
        </Text>
      </View>
      {/* Value in the next row */}
      <Text style={{ fontSize: 12, color: "white", fontFamily: 'AvenirNextCyr-Bold', marginBottom: 5 }}>
        {salesData?.finance_management?.total_general_transactions ? salesData?.finance_management?.total_general_transactions : 0}
      </Text>
    </View>
              <View
                style={{
                  height: "70%", 
                  width: 1, 
                  backgroundColor: "white",
                  alignItems: "center",
                  marginHorizontal: 5,
                }}
              />
    <View
      style={{
        flexDirection: "column", 
        flex: 0.8,
        alignItems: 'center',
      }}
    >
      {/* Image and Name in the same row */}
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Image
          source={require("../../assets/images/box11.png")}
          style={{ ...styles.imageView1 }}
        />
        <Text style={{ fontSize: 10, fontFamily: 'AvenirNextCyr-Bold', color: "white", marginLeft: 1 }}>
          Acc. Sales
        </Text>
      </View>

      <Text style={{ fontSize: 12, color: "white", fontFamily: 'AvenirNextCyr-Bold', marginBottom: 5 }}>
   {salesData?.finance_management?.total_acc_sales ? 
      new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(salesData?.finance_management?.total_acc_sales) : 
      new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(0)
    }
</Text>

    </View>

            </View>
          </View>
          <GradientText
            style={{
              fontSize: 22,
              fontFamily: "AvenirNextCyr-Bold",
              paddingHorizontal: "5%",
              marginVertical: "3%",
            }}
          >
            Collection Management
          </GradientText>

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
                onPress={() => {
                  navigation.navigate("CollInvoice");
                }}
                style={{
                  backgroundColor: "#FEFFBA",
                  flex: 1,
                  borderRadius: 9,
                  position: "relative",
                }}
              >
                <Text
                  style={{
                    position: "absolute",
                    right: 0,
                    color: "#B3B623",
                    fontFamily: "AvenirNextCyr-Medium",
                    paddingTop: "5%",
                    paddingRight: "5%",
                    fontSize: 14,
                    zIndex: 1,
                    textAlign: "right",
                  }}
                >
                  Manage{"\n"}
                  <Text
                    style={{ fontFamily: "AvenirNextCyr-Bold", fontSize: 20 }}
                  >
                    Invoices
                  </Text>
                </Text>
                <Image
                  source={require("../../assets/images/ManageInvoices.png")}
                  style={{ ...styles.greyShape }}
                />

                <Image
                  source={require("../../assets/images/INV.png")}
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: -10,
                    width: 140,
                    height: 140,
                    resizeMode: "contain",
                    transform: [{ rotate: "-10deg" }],
                    // backgroundColor:'red'
                  }}
                />
              </TouchableOpacity>


              <TouchableOpacity onPress={() => {
                  navigation.navigate("SalesOrderHistory",{screen:'other'});
              }} style={{ backgroundColor: "#FFECD9", flex: 1.2, borderRadius: 9 }}>
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


             
            </View>

            <View style={styles.row1}>
            <TouchableOpacity
                onPress={() => {
                  navigation.navigate("OrderReview");
                }}
                style={{
                  backgroundColor: "#B8D3FC",
                  flex: 2.8,
                  borderRadius: 9,
                  position: "relative",
                }}
              >
                <Text
                  style={{
                    position: "absolute",
                    color: "#134FA9",
                    fontFamily: "AvenirNextCyr-Medium",
                    padding: "3%",
                    fontSize: 16,
                    zIndex: 1,
                    textAlign: "right",
                    right: 9,
                    top:20
                  }}
                >
                  Sales{"\n"}
                  <Text
                    style={{ fontFamily: "AvenirNextCyr-Bold", fontSize: 20 }}
                  >
                    Orders
                  </Text>
                </Text>
                <Image
                  source={require("../../assets/images/ReportsComp.png")}
                  style={{ ...styles.orangeShape }}
                />

                <Image
                  source={require("../../assets/images/reportsImg.png")}
                  style={{
                    position: "absolute",
                    width: 100,
                    height: 100,
                    bottom: 15,
                    left: 9,
                    resizeMode: "contain",
                  }}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  backgroundColor: "#FEE4F1",
                  flex:2.5,
                  borderRadius: 9,
                  position: "relative",
                }}
                onPress={() => {
                  navigation.navigate("ManageAccounts");
                }}
              >
                <Text
                  style={{
                    position: "absolute",
                    color: "#D22471",
                    fontFamily: "AvenirNextCyr-Medium",
                    padding: "5%",
                    fontSize: 18,
                    right: 0,
                    textAlign: "right",
                    zIndex: 1,
                  }}
                >
                  Manage{"\n"}
                  <Text
                    style={{ fontFamily: "AvenirNextCyr-Bold", fontSize: 25 }}
                  >
                    Accounts
                  </Text>
                </Text>

                <Image
                  source={require("../../assets/images/FMCOMP2.png")}
                  style={{ position: "absolute", right: 0 }}
                />

                <Image
                  source={require("../../assets/images/FMManageComp.png")}
                  style={{ ...styles.pinkshape }}
                />

                <Image
                  source={require("../../assets/images/manageAccount.png")}
                  style={{
                    position: "absolute",
                    resizeMode: "contain",
                    width: 250,
                    height: 250,
                    bottom: -40,
                    left: -40,
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>

             {
             !loading ?  <Text style={{...styles.title,fontWeight:'bold'}}>Unpaid Invoices</Text> : null
             }
             
          <FlatList
            data={filteredInvoices}
            renderItem={ContactItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
          <View>
          </View>
        </View>
      <VersionModel modalVisible={modalVisible} closeModal={closeModal} />
       {
       loading ?  <Text style={{...styles.title,fontWeight:'bold'}}>Unpaid Invoices</Text> : null
       }

       {
       loading ? <BottomSkeleton/> : null
       }
      
    </GestureHandlerRootView>
  );
};

export default CollMangHome;

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
    fontFamily: "AvenirNextCyr-Medium",
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
    position: "absolute",
    resizeMode: "contain",
    bottom: 0,
  },
  pinkshape2: {
    flex: 0.5,
    width: null,
    height: null,
    resizeMode: "stretch",
    marginLeft: "60%",
  },
  greyShape: {
    resizeMode: "contain",
    position: "absolute",
    bottom: 0,
    right: 0,
  },
  orangeShape: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: "stretch",
    marginTop: "15%",
    marginRight: "20%",
  },
  blueShape: {
    position: "absolute",
    resizeMode: "contain",
    bottom: 0,
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
    height: "60%",
    width: 250,

  },
  image: {
    width: 60,
    height: 60,
    marginLeft: 10,
  },
  textContainer: {
    padding: 5,
    flex:1
  },
  text: {
    fontFamily: "AvenirNextCyr-Medium",
    fontSize: 14,
    color: Colors.black,
  },
  text2: {
    fontFamily: "AvenirNextCyr-Medium",
    fontSize: 14,
    color: "gray",
    width:'80%'
  },
  row1View: {
    marginTop: 3,
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "space-around",
    gap: 10,
  },
  recoredbuttonStyle: {
    borderRadius: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    marginHorizontal: 5,
    // shadowRadius: 2,
    // elevation: 5,
    height: 90,
    width: 110,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
});
