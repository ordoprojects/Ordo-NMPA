import React, { useRef, useState, useContext, useEffect } from "react";
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


const contacts = [
  {
    id: "1",
    name: "Amelia Cassin",
    address: "102nd St Ports, New York",
    phone: "458-419-7182",
    imageSource: require("../../assets/images/mapImg.png"),
  },
  {
    id: "2",
    name: "John Doe",
    address: "500th Ave, New York",
    phone: "123-456-7890",
    imageSource: require("../../assets/images/mapImg.png"),
  },
  {
    id: "3",
    name: "Jane Smith",
    address: "250th St, New York",
    phone: "987-654-3210",
    imageSource: require("../../assets/images/mapImg.png"),
  },
];

const FinMangHome = ({ navigation, route }) => {
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

  const showMenu = () => setVisible(true);

  const bottomSheetModalRef = useRef(null);

  const openBottomSheet = () => {
    bottomSheetModalRef.current?.present();
  };

  const closeBottomSheet = () => {
    bottomSheetModalRef.current?.dismiss();
  };
  const ContactItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() =>
        navigation.navigate("InvoiceDetails", {
          details: item,
          screen: item.type,
        })
      }
      // onPress={() => { console.log("tyoeeee", item.type) }}
    >
      <Image
        source={require("../../assets/images/unpaidInv.png")}
        style={styles.image}
      />
      <View style={styles.textContainer}>
        <Text style={styles.text}>INVOICE {item?.invoice}</Text>
        <Text style={styles.text2}>
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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      var myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${userData.token}`);
      var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      try {
        // Fetch purchase invoices
        const purchaseResponse = await fetch(
          "https://gsidev.ordosolution.com/api/acc_purchase/",
          requestOptions
        );
        const purchaseResult = await purchaseResponse.json();

        // Fetch sales invoices
        const salesResponse = await fetch(
          "https://gsidev.ordosolution.com/api/acc_sales/",
          requestOptions
        );
        const salesResult = await salesResponse.json();

        // Add type field to each purchase invoice object
        const purchaseInvoicesWithType = purchaseResult.map((invoice) => ({
          ...invoice,
          type: "PO",
        }));

        // Add type field to each sales invoice object
        const salesInvoicesWithType = salesResult.map((invoice) => ({
          ...invoice,
          type: "SO",
        }));

        // Combine both sets of invoices into a single array
        const allInvoices = [
          ...purchaseInvoicesWithType,
          ...salesInvoicesWithType,
        ];

        // Filter unpaid invoices
        const unpaidInvoices = allInvoices.filter(
          (invoice) => invoice.status !== "Paid"
        );
        setFilteredInvoices(unpaidInvoices);
        setLoading(false);
      } catch (error) {
        console.log("Error", error);
        setLoading(false);
      }
    };

    fetchData();
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
                gap: 2,
                // backgroundColor:'red'
                paddingHorizontal: "7%",
              }}
            >
               {/* Transactions */}
    <View
      style={{
        flexDirection: "column", 
        flex: 0.3,
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

              {/* Vertical Separator */}
              <View
                style={{
                  height: "70%", // Take full height
                  width: 1, // Width of the vertical line
                  backgroundColor: "white", // White color for the line
                  alignItems: "center",
                  marginHorizontal: 5,
                }}
              />

              {/* Acc. Sales */}
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
          source={require("../../assets/images/box11.png")}
          style={{ ...styles.imageView1 }}
        />
        <Text style={{ fontSize: 10, fontFamily: 'AvenirNextCyr-Bold', color: "white", marginLeft: 1 }}>
          Acc. Sales
        </Text>
      </View>

      {/* Value in the next row */}
      <Text style={{ fontSize: 12, color: "white", fontFamily: 'AvenirNextCyr-Bold', marginBottom: 5 }}>
        ₹ {salesData?.finance_management?.total_acc_sales ? salesData?.finance_management?.total_acc_sales : 0}
      </Text>
    </View>


              {/* Vertical Separator */}
              <View
                style={{
                  height: "70%", // Take full height
                  width: 1, // Width of the vertical line
                  backgroundColor: "white", // White color for the line
                  marginHorizontal: 5,
                }}
              />
 {/* Acc. Purchases */}
    <View
      style={{
        flexDirection: "column", 
        flex: 0.3,
        alignItems: 'center',
      }}
    >
      {/* Image and Name in the same row */}
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Image
          source={require("../../assets/images/box122.png")}
          style={{ ...styles.imageView1 }}
        />
        <Text style={{ fontSize: 10, fontFamily: 'AvenirNextCyr-Bold', color: "white", marginLeft: 1 }}>
          Acc. Purchases
        </Text>
      </View>

      {/* Value in the next row */}
      <Text style={{ fontSize: 12, color: "white", fontFamily: 'AvenirNextCyr-Bold', marginBottom: 5 }}>
        ₹ {salesData?.finance_management?.total_acc_purchase ? salesData?.finance_management?.total_acc_purchase : 0}
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
            Financial Management
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
              {/* <TouchableOpacity
                onPress={() => {
                  navigation.navigate("CustomersAndVendors", {
                    screen: "CreateRFQ",
                    screenId: 1,
                  });
                }}
                style={{
                  backgroundColor: "#EAE3FE",
                  flex: 1,
                  borderRadius: 9,
                  paddingTop: "3%",
                  paddingLeft: "3%",
                }}
              >
                <Text
                  style={{
                    position: "relative",
                    color: "#261361",
                    fontFamily: "AvenirNextCyr-Medium",
                    fontSize: 17,
                  }}
                  
                >
                  Manage{"\n"}
                  <Text
                    style={{ fontFamily: "AvenirNextCyr-Bold", fontSize: 20 }}
                  >
                    Stakeholder
                  </Text>
                </Text>
                <Image
                  source={require("../../assets/images/FMOnboard.png")}
                  style={{ ...styles.blueShape }}
                />


<View
                style={{
                  justifyContent: "flex-end",
                  alignItems: "flex-end",
                  flex:1
                  // position: "absolute",
                  // width: "100%",
                  // height: "100%",
                }}
              >
                <Image
                  source={require("../../assets/images/StakeHold.png")}
                  style={{
                    position: "absolute",
                    width: "80%",
                    height: "95%",
                    resizeMode: "contain",
                    // marginRight: "10%",
                    right:5
                  }}
                />
                </View>
              </TouchableOpacity> */}

              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("ManageInvoices");
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

              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("CashFlowReports");
                }}
                style={{
                  backgroundColor: "#B8D3FC",
                  flex: 1,
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
                    right: 0,
                  }}
                >
                  Cashflow{"\n"}
                  <Text
                    style={{ fontFamily: "AvenirNextCyr-Bold", fontSize: 20 }}
                  >
                    Reports
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
                    width: 110,
                    height: 110,
                    bottom: 5,
                    left: 5,
                    resizeMode: "contain",
                  }}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.row1}>
              <TouchableOpacity
                style={{
                  backgroundColor: "#FEE4F1",
                  flex: 1.3,
                  borderRadius: 9,
                  position: "relative",
                }}
                onPress={() => {
                  navigation.navigate("ManageAccounts");
                }}
              >
                <Text
                  style={{
                    // backgroundColor: "#FEE4F1",
                    // borderRadius: 9,
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

              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("GeneralLegder");
                }}
                style={{
                  backgroundColor: "#D6B3B3",
                  flex: 1,
                  borderRadius: 9,
                  position: "relative",
                }}
              >
                <Text
                  style={{
                    position: "absolute",
                    color: "#821919",
                    fontFamily: "AvenirNextCyr-Medium",
                    padding: "3%",
                    fontSize: 14,
                    zIndex: 1,
                    textAlign: "right",
                    right: 0,
                  }}
                >
                  General{"\n"}
                  <Text
                    style={{ fontFamily: "AvenirNextCyr-Bold", fontSize: 20 }}
                  >
                    Ledger
                  </Text>
                </Text>
                <Image
                  source={require("../../assets/images/generalledger.png")}
                  style={{
                    position: "absolute",
                    bottom: 0,
                    // left: 5,
                    resizeMode: "stretch",
                  }}
                />

                <Image
                  source={require("../../assets/images/ledger.png")}
                  style={{
                    position: "absolute",
                    bottom: 4,
                    right: 0,
                    resizeMode: "stretch",
                    width: 150,
                    height: 150,
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>

          {filteredInvoices.length>0?<Text style={styles.title}>Unpaid Invoices</Text>:""}

          <FlatList
            data={filteredInvoices}
            renderItem={ContactItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
          <View>

            <TouchableOpacity
              activeOpacity={1}
              onPress={openBottomSheet}
              style={{
                backgroundColor: Colors.primary,
                paddingTop: "3.5%",
                paddingBottom: "1%",
                alignItems: "center",
                borderTopEndRadius: 20,
                borderTopStartRadius: 20,
              }}
            >
              <Text
                style={{
                  fontFamily: "AvenirNextCyr-Medium",
                  fontSize: 12,
                  color: "white",
                }}
              >
                Change Service
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={1}
              onPress={openBottomSheet}
              style={{
                borderRadius: 50,
                backgroundColor: Colors.primary,
                position: "absolute",
                left: "47%",
                bottom: "50%",
                padding: 5,
              }}
            >
              {/* <Text style={{ color: 'white', backgroundColor: '#4b0482', borderRadius: 50, paddingVertical: '1%', paddingLeft: '1%', paddingRight: '1.3%' }}>  */}
              <MaterialCommunityIcons
                name="dots-grid"
                size={25}
                color="white"
              />
              {/* </Text> */}
            </TouchableOpacity>
            <BottomSheetComponent navigation={navigation} closeBottomSheet={closeBottomSheet} bottomSheetModalRef={bottomSheetModalRef}/>
            <CustomFloating
              navigation={navigation}
              reports="FinReports"
              screen="Finance"
            />
          </View>
        </View>
      </BottomSheetModalProvider>
      <VersionModel modalVisible={modalVisible} closeModal={closeModal} />
    </GestureHandlerRootView>
  );
};

export default FinMangHome;

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
    // fontWeight: "600",
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
    flex: 1.1,
    // height: "17%",
    gap: 15,
    // justifyContent: "center",
    // marginHorizontal: "5%",
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
    // flex: 1,
    position: "absolute",
    resizeMode: "contain",
    bottom: 0,
    // marginTop: "30%",
    // marginRight: "20%",
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
    height: "70%",
    width: 250,
    // marginHorizontal:'2%'
  },
  image: {
    width: 60,
    height: 60,
    // borderRadius: 25,
    marginLeft: 10,
  },
  textContainer: {
    padding: 5,
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
  },
  row1View: {
    //marginHorizontal: 50,
    // paddingHorizontal: 30,
    // marginLeft:30,
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
