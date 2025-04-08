import React, { useState, useEffect ,useContext} from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView,
} from "react-native";
import { Searchbar, Menu, Provider, Checkbox, List ,DefaultTheme} from "react-native-paper";
import Colors from "../../constants/Colors";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Feather from "react-native-vector-icons/Feather";
import Entypo from "react-native-vector-icons/Entypo";
import LinearGradient from "react-native-linear-gradient";
import AntDesign from 'react-native-vector-icons/AntDesign';
import { AuthContext } from "../../Context/AuthContext";

const DriverOrderDetails = ({ route, navigation }) => {
  const [search, setSearch] = useState("");
  const { order, id } = route.params;
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [remarksData, setRemarksData] = useState({});
  const [menuVisible, setMenuVisible] = useState(null);
  const [menuVisible1, setMenuVisible1] = useState(false);
  const [remark, setRemark] = useState("None");
  const [checkboxes, setCheckboxes] = useState({});
  const [dimensionData, setDimensionData] = useState('');

  console.log('======================order===========================');
  console.log((JSON.stringify(order[0]?.product_list[0]?.name,null,2)));
  console.log('======================================================');

  useEffect(() => {
    
    const initialRemarksData = {};
    const initialCheckboxes = {};

    order.forEach((orderItem) => {
      orderItem.product_list.forEach((product) => {
        initialRemarksData[product.id] = {
          product_id: product.id,
          remarks: "None",
          route_product_status: "Completed",
        };
        initialCheckboxes[product.id] = true;
      });
    });

    setRemarksData(initialRemarksData);
    setCheckboxes(initialCheckboxes);
    
  }, [order]);

  useEffect(() => {
    const filtered = order.flatMap((orderItem) =>
      orderItem.product_list.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
      )
    );
    setFilteredProducts(filtered);
  }, [search, order]);

  const openMenu = (productId) => setMenuVisible(productId);

     const closeMenu = () => {
       setMenuVisible(null);
     };

    const OpenDimention = (data) => {
      console.log("🚀 ~ OpenDimention ~ data:", data)
      setDimensionData(data);
      setMenuVisible1(true)
    };

   const renderItem = ({ item }) => (
     <View style={styles.card}>
       { order[0]?.product_list[0]?.name === "BASE PLATE" ? <Text style={{color:Colors.primary ,fontFamily: "AvenirNextCyr-Bold",
       fontSize: 17}}>{item.height_inch} X {item.width_ft} X {item.thickness} </Text>  :
       <Text style={{color:Colors.primary ,fontFamily: "AvenirNextCyr-Bold",
       fontSize: 17}}>{item.width_ft}' {item.height_inch}" </Text> }
       <Text style={{color:Colors.black ,fontFamily: "AvenirNextCyr-Medium",
       fontSize: 15}}>Loaded Qty: {item.loaded_nos} NOS </Text> 
       { order[0]?.product_list[0]?.name === "BASE PLATE" &&
       <Text style={{color:Colors.black ,fontFamily: "AvenirNextCyr-Medium",
        fontSize: 15}}>Weight Qty: {item.base_production_weight} Kg</Text>}
     </View>
   );


  const setStatusAndRemark = (productId, status, remark) => {
    if (status !== "Completed" || remark !== "") {
      setRemarksData((prevRemarksData) => ({
        ...prevRemarksData,
        [productId]: {
          product_id: productId,
          remarks: remark,
          route_product_status: status,
        },
      }));
    } else {
      setRemarksData((prevRemarksData) => {
        const { [productId]: _, ...rest } = prevRemarksData;
        return rest;
      });
    }
    closeMenu();
  };

  const handleReviewNavigation = () => {
    const remarksDataArray = Object.values(remarksData);
    navigation.navigate("DriverOrdersReview", {
      Details: order,
      remarks: remarksDataArray,
      id,
    });
  };

  return (
    <Provider theme={DefaultTheme}>
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
          <Text style={styles.headerText}>Delivery Details</Text>
          <View style={{ width: "15%" }} />
        </View>
        <Searchbar
          style={styles.searchbar}
          placeholder="Search Order"
          placeholderTextColor="grey"
          onChangeText={(val) => setSearch(val)}
          value={search}
        />
        <View style={styles.DetailView}>
          <View style={styles.view1}>
            <MaterialCommunityIcons
              name="office-building-marker"
              size={23}
              color={Colors.white}
            />
            <Text style={styles.NameText}>{order[0]?.assignee_name}</Text>
          </View>

          <View style={styles.view1}>
            <Entypo name="location-pin" size={23} color={Colors.white} />
            <Text style={styles.selectAllText}>
              {order[0]?.assigne_to_address?.address}{" "}
              {order[0]?.assigne_to_address?.state}{" "}
              {order[0]?.assigne_to_address?.postal_code}
            </Text>
          </View>
        </View>
        <View style={styles.whiteView}>
          <View style={styles.container}>
            <ScrollView>
              {order.map((orderItem, index) => (
                <List.Section>
                  <List.Accordion
                    key={orderItem.id}
                    title={orderItem?.name}
                    titleStyle={{ fontSize: 19, tintColor: Colors.primary }}
                    description={`Total Products: ${orderItem?.product_list.length}`}
                    style={styles.accordionItem}
                  >
                    <FlatList
                      data={orderItem.product_list.filter((product) =>
                        product.name
                          .toLowerCase()
                          .includes(search.toLowerCase())
                      )}
                      renderItem={({ item }) => (
                        <View style={styles.order}>
                          {item.product_image ? (
                            <Image
                              source={{ uri: item?.product_image }}
                              style={styles.productImage}
                            />
                          ) : (
                            <Image
                              source={require("../../assets/images/noImagee.png")}
                              style={styles.productImage}
                            />
                          )}
                          <View style={{ flex: 1 }}>
                            <View
                              style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom:'1%'
                              }}
                            >
                              <Text style={styles.orderName}>
                                {item?.name} ({item?.product_id})
                              </Text>
                              { order[0]?.is_production === true &&
                              
                              <TouchableOpacity style={{
                                backgroundColor: Colors.primary,
                                padding:4,
                                borderRadius:4
                              }}  onPress={() =>
                                OpenDimention(item.production_data)
                              }>
                                <Text style={{fontFamily: "AvenirNextCyr-Bold",fontSize: 13,color: "white"}}>View</Text>
                              </TouchableOpacity>
                              }
                            </View>

                            <View
                              style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                marginTop: "1%",
                                alignItems: "center",
                              }}
                            >
                              <View
                                style={{
                                  flexDirection: "row",
                                  gap: 2,
                                  alignItems: "center",
                                  width: "45%",
                                }}
                              >
                                <Feather name="layers" size={15} color="gray" />
                                <Text style={styles.InvoiName}>
                                  {item?.product_category}
                                </Text>
                              </View>
                              { order[0]?.is_production !== true ?
                              <View
                                style={{
                                  flexDirection: "row",
                                  gap: 2,
                                  alignItems: "center",
                                  width: "45%",
                                  justifyContent: "flex-end",
                                }}
                              >
                                <Feather
                                  name="database"
                                  size={15}
                                  color="gray"
                                />
                                <Text style={styles.orderQty}>{item?.actual_loaded_qty} {item?.loaded_uom}</Text>
                              </View>
                              :  <View
                              style={{
                                flexDirection: "row",
                                gap: 2,
                                alignItems: "center",
                                width: "45%",
                                justifyContent: "flex-end",
                              }}
                            >
                            </View>}
                            </View>

                            <View
                              style={{
                                flexDirection: "row",
                                gap: 5,
                                justifyContent: "space-between",
                                marginTop: 2,
                                alignItems: "center",
                              }}
                            >
                              <View
                                style={{
                                  flexDirection: "row",
                                  gap: 5,
                                  width: "45%",
                                  alignItems: "center",
                                }}
                              >
                                <MaterialCommunityIcons
                                  name="weight"
                                  size={18}
                                  color="gray"
                                />
                                <Text style={styles.orderStatus}>
                                {order[0]?.is_production === true ? item?.route_production_loaded_weight : item?.actual_loaded_weight}
                                   Kg
                                </Text>
                              </View>

                              <Text
                                style={{
                                  ...styles.orderStatus,
                                  color:
                                    remarksData[item.id]
                                      ?.route_product_status === "Completed"
                                      ? "green"
                                      : "red",
                                      }}
                                    >
                                {remarksData[item?.id]?.route_product_status ===
                                "Completed"
                                  ? "Selected"
                                  : remarksData[item?.id]?.route_product_status}
                              </Text>
                            </View>
                          </View>

                          <Menu
                            visible={menuVisible === item.id}
                            onDismiss={closeMenu}
                            anchor={
                              <TouchableOpacity
                                onPress={() => openMenu(item.id)}
                              >
                                <Entypo
                                  name="dots-three-vertical"
                                  size={1}
                                  color="white"
                                />
                              </TouchableOpacity>
                            }
                          >
                            <Menu.Item
                              onPress={() =>
                                setStatusAndRemark(item.id, "Damaged", remark)
                              }
                              title="Damaged"
                            />
                            <Menu.Item
                              onPress={() =>
                                setStatusAndRemark(
                                  item.id,
                                  "Unavailable",
                                  remark
                                )
                              }
                              title="Unavailable"
                            />
                            <Menu.Item
                              onPress={() =>
                                setStatusAndRemark(item.id, "Pending", remark)
                              }
                              title="Pending"
                            />
                            <Menu.Item
                              onPress={() =>
                                setStatusAndRemark(item.id, "Completed", remark)
                              }
                              title="Select"
                            />
                          </Menu>
                        </View>
                      )}
                      keyExtractor={(item) => item.id.toString()}
                      style={{ marginTop: "3%" }}
                    />
                  </List.Accordion>
                </List.Section>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.reviewButton}
              onPress={handleReviewNavigation}
            >
              <Text style={styles.reviewButtonText}>
                Review Selected Orders
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      <Modal visible={menuVisible1} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
      <View style={styles.modalContainer1}>
        <Text style={{fontSize: 20,color: Colors.black,fontFamily: "AvenirNextCyr-Medium",marginBottom:'2%'}}>Dimensions</Text>
          <FlatList
            data={dimensionData}
            renderItem={renderItem}
            keyExtractor={(item) => item.production_id.toString()}
          />
        <TouchableOpacity style={{position:'absolute',top:10 ,right:10}} onPress={()=>{setMenuVisible1(false);}}>
          <AntDesign name='close' size={28} color={`black`} />
        </TouchableOpacity>
      </View>
      </View>
    </Modal>
    </Provider>
  );
};

export default DriverOrderDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: "4%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: "3%",
  },
  headerView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 60,
    paddingHorizontal: "4%",
  },
  headerText: {
    fontFamily: "AvenirNextCyr-Bold",
    fontSize: 19,
    color: "white",
  },
  searchbar: {
    marginHorizontal: "4%",
    backgroundColor: "#F3F3F3",
    fontFamily: "AvenirNextCyr-Thin",
    height: 50,
  },
  whiteView: {
    flex: 1,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: "1%",
  },
  selectAllContainer: {
    marginRight: "8%",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 7,
    marginVertical: "2%",
  },
  selectAllText: {
    fontSize: 15,
    color: "#FAF9F6",
    fontFamily: "AvenirNextCyr-Medium",
  },
  NameText: {
    fontSize: 15,
    color: Colors.white,
    fontFamily: "AvenirNextCyr-Bold",
  },
  order: {
    flexDirection: "row",
    alignItems: "center",
    padding: "3%",
    backgroundColor: "white",
    marginVertical: 5,
    backgroundColor: "#f2f3f9",
    borderRadius: 8,
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: "3%",
  },
  orderName: {
    fontSize: 16,
    fontFamily: "AvenirNextCyr-Bold",
    color: Colors.primary,
    width: "85%",
  },
  InvoiName: {
    fontSize: 14,
    fontFamily: "AvenirNextCyr-Medium",
    color: Colors.black,
  },
  orderQty: {
    fontSize: 15,
    color: Colors.black,
    fontFamily: "AvenirNextCyr-Medium",
  },
  reviewButton: {
    backgroundColor: Colors.primary,
    borderRadius: 13,
    alignItems: "center",
    marginVertical: "5%",
    height: 50,
    justifyContent: "center",
  },
  reviewButtonText: {
    color: "white",
    fontSize: 18,
    fontFamily: "AvenirNextCyr-Bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: "4%",
    borderRadius: 10,
    width: "90%",
    height: "40%",
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: "AvenirNextCyr-Medium",
    marginBottom: "3%",
    color: Colors.primary,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: "3%",
    marginBottom: "3%",
  },
  dropdown: {
    height: "19%",
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: "3%",
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
    color: "lightgray",
  },
  selectedTextStyle: {
    fontSize: 16,
    color: Colors.black,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  textDesInput: {
    height: "40%",
    borderColor: Colors.lightGrey,
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 18,
    color: "#333",
    textAlignVertical: "top",
    marginVertical: "4%",
    paddingLeft: "5%",
    padding: "1%",
    paddingTop: "3%",
  },
  closeButton: {
    width: 35,
    height: 35,
    borderRadius: 19,
    backgroundColor: "#F3F5F8",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",
  },
  DetailView: {
    borderColor: Colors.white,
    borderWidth: 1,
    borderRadius: 10,
    marginHorizontal: "3%",
    padding: "2%",
    marginVertical: "3%",
  },
  view1: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    alignItems: "center",
    width: "96%",
  },
  remarkInput: {
    margin: 10,
    borderWidth: 1,
    borderColor: Colors.grey,
    borderRadius: 5,
    padding: "2%",
  },
  orderStatus: {
    color: Colors.black,
    marginTop: "2%",
    fontFamily: "AvenirNextCyr-Medium",
  },
  stockComt: {
    fontSize: 15,
    color: "red",
    fontFamily: "AvenirNextCyr-Medium",
  },
  accordionItem: {
    backgroundColor: "#f2f3f9",
    borderRadius: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "lightgray",
  }, modalContainer1: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: "center",
    padding: 20,
    marginVertical:'5%',
    borderRadius:10,
    width:'90%',
    paddingTop:20
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    borderWidth:0.6,
  },
  stockDataContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
  },
  closeButton: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
