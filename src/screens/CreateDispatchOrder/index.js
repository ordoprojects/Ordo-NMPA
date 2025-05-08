import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Modal,
  Button,
  Animated,
  TextInput,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { AuthContext } from "../../Context/AuthContext";
import Colors from "../../constants/Colors";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import globalStyles from "../../styles/globalStyles";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Entypo from "react-native-vector-icons/Entypo";
import { Searchbar } from "react-native-paper";

const CreateDispatchOrder = ({ navigation, route }) => {
  // const { selectedItem } = route.params;

  const [orderData, setOrderData] = useState([]);
  const [expandedOrders, setExpandedOrders] = useState({});
  const { userData } = useContext(AuthContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalAnimation] = useState(new Animated.Value(0));
  const [cartCount, setCartCount] = useState(0);
  const [selectedProductsForDispatch, setSelectedProductsForDispatch] =
    useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredOrderData, setFilteredOrderData] = useState([]);
  const [dispatchedOrders, setDispatchedOrders] = useState([]);
  const [productsSelected, setProductsSelected] = useState(false);

  useEffect(() => {
    FetchVehicleList();
  }, []);

  useEffect(() => {
    // Filter order data whenever search query changes
    const filteredData = orderData.filter((order) => {
      return order.name.toLowerCase().includes(searchQuery.toLowerCase());
    });
    setFilteredOrderData(filteredData);
  }, [searchQuery, orderData]);

  const FetchVehicleList = async () => {
    try {
      const response = await fetch(
        "https://gsidev.ordosolution.com/api/sales_order/",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );
      const result = await response.json();
      setOrderData(result);
      console.log("Vehicle data:", result);
    } catch (error) {
      console.log("Error fetching vehicle data:", error);
    }
  };

  const addToCart = (order) => {
    const index = selectedProductsForDispatch.findIndex(
      (item) => item.id === order.id
    );

    if (index !== -1) {
      const updatedDispatchList = [...selectedProductsForDispatch];
      updatedDispatchList.splice(index, 1);
      setSelectedProductsForDispatch(updatedDispatchList);

      const updatedDispatchedOrders = dispatchedOrders.filter(
        (orderId) => orderId !== order.id
      );
      setDispatchedOrders(updatedDispatchedOrders);
      setCartCount(cartCount - 1);
      setProductsSelected(updatedDispatchList.length > 0);
    } else {
      setSelectedProductsForDispatch([...selectedProductsForDispatch, order]);
      setDispatchedOrders([...dispatchedOrders, order.id]);
      setCartCount(cartCount + 1);
      setProductsSelected(true);
    }
  };

  const removeProduct = (orderId) => {
    const index = selectedProductsForDispatch.findIndex(
      (item) => item.id === orderId
    );

    if (index !== -1) {
      const updatedDispatchList = [...selectedProductsForDispatch];
      updatedDispatchList.splice(index, 1);
      setSelectedProductsForDispatch(updatedDispatchList);

      setCartCount(cartCount - 1);
      setProductsSelected(updatedDispatchList.length > 0);
    }
  };

  const openModal = () => {
    setModalVisible(true);
    Animated.spring(modalAnimation, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(modalAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  const toggleOrder = (orderId) => {
    setExpandedOrders((prevExpandedOrders) => ({
      ...prevExpandedOrders,
      [orderId]: !prevExpandedOrders[orderId],
    }));
  };

  const modalTranslateY = modalAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [600, 0],
  });

  const handleDispatchOrder = () => {};

  return (
    <LinearGradient
      colors={Colors.linearColors}
      start={Colors.start}
      end={{ x: 1, y: 0.5 }}
      locations={Colors.location}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <View style={styles.headerView}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ paddingHorizontal: 10 }}
          >
            <MaterialIcons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Create Dispatch Order</Text>

          <TouchableOpacity
            onPress={openModal}
            style={{
              backgroundColor: Colors.primary,
              paddingVertical: 5,
              paddingHorizontal: 4,
              borderRadius: 5,
              elevation: 5,
              ...globalStyles.border,
              borderColor: "white",
              borderWidth: 0.7,
            }}
          >
            <MaterialCommunityIcons
              name="cart-variant"
              size={25}
              color="white"
            />
          </TouchableOpacity>
        </View>

        <Image
          style={styles.truckImage}
          source={require("../../assets/images/box_truck.png")}
        />

        <View style={{ alignItems: "center", marginBottom: "3%" }}>
          <Text style={{ color: "#C3B3C3", fontSize: 17, textAlign: "center" }}>
            Start & End Location
          </Text>
          <Text style={[styles.filteredText, { textAlign: "center" }]}>
            {/* {selectedItem.start_location} - {selectedItem.end_location} */}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <View style={{ alignItems: "center" }}>
            <Text style={{ color: "#C3B3C3", fontSize: 16, textAlign: "center" }} >
              Vehicle Name
            </Text>
            <Text style={[styles.filteredText, { textAlign: "center" }]}>
              {/* {selectedItem.vehicle.name} */}
            </Text>
          </View>

          <View style={{ alignItems: "center" }}>
            <Text style={{ color: "#C3B3C3", fontSize: 16, textAlign: "center" }} >
              Driver Name
            </Text>
            <Text style={[styles.filteredText, { textAlign: "center" }]}>
              {/* {selectedItem.driver.name} */}
            </Text>
          </View>
        </View>

        <View style={{ alignItems: "center", marginTop: "3%" }}>
          <View
            style={{
              width: "100%",
              height: 1,
              backgroundColor: "#C3B3C3",
              marginBottom: "2%",
            }}
          />
        </View>

        <ScrollView style={styles.scrollView1}>
          {selectedProductsForDispatch.length === 0 ? (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                marginTop: 20,
              }}
            >
              <Text
                style={{
                  color: Colors.primary,
                  fontSize: 18,
                  marginBottom: 10,
                  fontWeight: "500",
                }}
              >
                Click here to add product for dispatch
              </Text>
              <TouchableOpacity
                onPress={openModal}
                style={{
                  backgroundColor: Colors.primary,
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  borderRadius: 8,
                  elevation: 4,
                }}
              >
                <MaterialCommunityIcons
                  name="cart-variant"
                  size={25}
                  color="white"
                />
              </TouchableOpacity>
            </View>
          ) : (
            selectedProductsForDispatch.map((order) => (
              <View key={order.id} style={styles.orderContainer}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={styles.orderTitle}>
                    Order Name : {order.name}
                  </Text>
                  <TouchableOpacity
                    style={{
                      backgroundColor: "#f1f1f1",
                      paddingVertical: 2,
                      paddingHorizontal: 2,
                      borderRadius: 30,
                    }}
                    onPress={() => removeProduct(order.id)}
                  >
                    <Entypo name="cross" size={20} color="grey" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </ScrollView>

        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [{ translateY: modalTranslateY }],
            },
          ]}
        >
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={closeModal}
          >
            <View style={styles.modalContainer}>
              <View style={styles.scrollView}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-evenly",
                  }}
                >
                  <View>
                    <TouchableOpacity
                      onPress={closeModal}
                      style={{
                        backgroundColor: Colors.primary,
                        paddingVertical: 5,
                        paddingHorizontal: 4,
                        borderRadius: 5,
                        elevation: 5,
                        ...globalStyles.border,
                      }}
                    >
                      <MaterialCommunityIcons
                        name="cart-variant"
                        size={25}
                        color="white"
                      />

                      {cartCount > 0 && (
                        <View style={styles.cartCountContainer}>
                          <Text style={styles.cartCountText}>{cartCount}</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  </View>
                  <Text
                    style={{
                      alignSelf: "center",
                      fontSize: 20,
                      color: Colors.primary,
                      fontFamily: "AvenirNextCyr-Medium",
                      marginVertical: 10,
                    }}
                  >
                    Add Products for Dispatch
                  </Text>
                  <TouchableOpacity
                    style={{
                      marginRight: 10,
                      backgroundColor: "#f1f1f1",
                      paddingVertical: 2,
                      paddingHorizontal: 2,
                      borderRadius: 30,
                    }}
                    onPress={closeModal}
                  >
                    <Entypo name="cross" size={16} color="grey" />
                  </TouchableOpacity>
                </View>
                <View style={{ flexDirection: "row", marginTop: 1 }}>
                  <View style={{ width: "100%" }}>
                    <Searchbar
                      style={{
                        marginBottom: "5%",
                        marginVertical: "1%",
                        marginHorizontal: "3%",
                        backgroundColor: "#F3F3F3",
                      }}
                      placeholder="Search Order"
                      onChangeText={(text) => setSearchQuery(text)}
                      value={searchQuery}
                    />
                  </View>
                </View>
                <ScrollView>
                  {filteredOrderData.map((order) => (
                    <View
                      key={order.id}
                      style={[
                        styles.orderContainer,
                        selectedProductsForDispatch.some(
                          (item) => item.id === order.id
                        ) && { backgroundColor: "#FFF0F5" },
                      ]}
                    >
                      <TouchableOpacity
                        onPress={() => toggleOrder(order.id)}
                        style={styles.orderHeader}
                      >
                        <Text style={styles.orderTitle}>
                          Order Name: {order.name}
                        </Text>
                        <MaterialIcons
                          name={
                            expandedOrders[order.id]
                              ? "keyboard-arrow-up"
                              : "keyboard-arrow-down"
                          }
                          size={24}
                          color="black"
                        />
                      </TouchableOpacity>
                      {expandedOrders[order.id] && (
                        <View>
                          <Text style={styles.orderTitle}>
                            Order Address : {order.assigne_to_address.address}{" "}
                            {order.assigne_to_address.state}{" "}
                            {order.assigne_to_address.postal_code}{" "}
                          </Text>
                          <FlatList
                            data={order.product_list}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                              <View style={styles.productItem}>
                                <Image
                                  source={{uri: item.product_image.startsWith("http")
          ? item.product_image
          : `https://gsidev.ordosolution.com${item.product_image}`,
      }}
                                  style={styles.productImage}
                                />
                                <View style={styles.productInfo}>
                                  <Text style={styles.productName}>
                                    {item.name}
                                  </Text>
                                  <Text style={styles.productPrice}>
                                    Price: ${item.price}
                                  </Text>
                                  <Text style={styles.productQty}>
                                    Quantity: {item.qty}
                                  </Text>
                                </View>
                              </View>
                            )}
                          />
                        </View>
                      )}
                      <TouchableOpacity
                        style={[
                          styles.addButton,
                          expandedOrders[order.id]
                            ? { marginBottom: 20 }
                            : { marginTop: 20 },
                        ]}
                        onPress={() => addToCart(order)}
                      >
                        <Text style={styles.addButtonText}>
                          {selectedProductsForDispatch.some(
                            (item) => item.id === order.id
                          )
                            ? "Added to Dispatch"
                            : "Add to Dispatch"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </ScrollView>
              </View>
            </View>
          </Modal>
        </Animated.View>
        {productsSelected && (
          <TouchableOpacity
            style={{
              backgroundColor: Colors.primary,
              borderRadius: 10,
              width: "100%",
              height: 55,
              alignItems: "center",
              justifyContent: "center",
              elevation: 5,
              borderWidth: 0.5,
              borderColor: "white",
              flexDirection: "row",
              gap: 9,
              marginTop: "1%",
            }}
            onPress={handleDispatchOrder}
          >
            <Text
              style={{ fontSize: 17, fontWeight: "500", color: Colors.white }}
            >
              Dispatch Order
            </Text>
            <MaterialIcons name="send" size={20} color={Colors.white} />
          </TouchableOpacity>
        )}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: "4%",
    paddingTop: "4%",
  },
  headerView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  headerText: {
    fontFamily: "AvenirNextCyr-Medium",
    fontSize: 20,
    color: "white",
    marginHorizontal: "6%",
  },
  truckImage: {
    height: 150,
    width: "100%",
    resizeMode: "contain",
    marginBottom: "1%",
  },
  orderContainer: {
    backgroundColor: "#E6E6E6",
    padding: 20,
    marginBottom: "4%",
    borderRadius: 10,
    marginHorizontal: "4%",
    elevation: 5,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1%",
  },
  orderTitle: {
    fontFamily: "AvenirNextCyr-Medium",
    fontSize: 16,
  },
  productItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: "1%",
  },
  productImage: {
    width: 80,
    height: 80,
    resizeMode: "cover",
    borderRadius: 8,
    marginRight: "4%",
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontFamily: "AvenirNextCyr-Thin",
    fontSize: 16,
  },
  productPrice: {
    fontFamily: "AvenirNextCyr-Thin",
    fontSize: 14,
    color: "#888",
  },
  productQty: {
    fontFamily: "AvenirNextCyr-Thin",
    fontSize: 14,
    color: "#888",
  },
  addButton: {
    backgroundColor: Colors.primary,
    paddingVertical: "4%",
    borderRadius: 8,
    alignItems: "center",
    marginTop: "4%",
  },
  addButtonText: {
    fontFamily: "AvenirNextCyr-Medium",
    fontSize: 16,
    color: "white",
    gap: 5,
    alignContent: "center",
    alignSelf: "center",
  },
  filteredText: {
    fontSize: 18,
    color: Colors.white,
    fontWeight: "500",
  },
  whiteView: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: "4%",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  scrollView: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingHorizontal: "2%",
    maxHeight: "85%",
  },
  cartCountContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    backgroundColor: "red",
    borderRadius: 10,
    width: "70%",
    height: "70%",
  },
  cartCountText: {
    marginLeft: 7,
    color: "white",
    fontSize: 10,
    fontFamily: "AvenirNextCyr-Medium",
    fontWeight: "500",
  },
  scrollView1: {
    // flex: 1,
    marginTop: "2%",
    backgroundColor: "white",
    paddingVertical: "4%",
    borderRadius: 12,
    height: "50%",
  },
});

export default CreateDispatchOrder;
