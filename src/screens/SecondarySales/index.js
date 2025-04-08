import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  Keyboard,
  TouchableOpacity,
  ToastAndroid,
  TextInput,
  Modal,
  Pressable,
  SafeAreaView,
} from "react-native";
import React, { useState, useEffect, useContext, useCallback } from "react";
import AntDesign from "react-native-vector-icons/AntDesign";
import Colors from "../../constants/Colors";
import { cameraPermission } from "../../utils/Helper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Entypo from "react-native-vector-icons/Entypo";
import { Searchbar, Checkbox, RadioButton } from "react-native-paper";

import { AuthContext } from "../../Context/AuthContext";

import globalStyles from "../../styles/globalStyles";
import LinearGradient from "react-native-linear-gradient";
import { Dimensions } from "react-native";

// Get the screen height
const screenHeight = Dimensions.get("window").height;

// Calculate the card height dynamically
const cardHeight = screenHeight * 0.13;

const SecondarySales = ({ navigation, route }) => {
  const { data } = route.params;
  const [price, setPrice] = useState("");
  // const { dealerInfo } = route.params;
  // console.log("screen",screen)
  const [itemPrices, setItemPrices] = useState({});
  const [cartCount, setCartCount] = useState(0);
  const [addedItems, setAddedItems] = useState([]);

  const onChangeSearch = (query) => setSearch(query);

  const clearSearch = () => setSearch("");

  // Function to update price for an item
  // const updatePrice = (itemId, newPrice, qty) => {
  //     setItemPrices((prevPrices) => ({
  //         ...prevPrices,
  //         [itemId]: newPrice,
  //     }));
  // };
  const updatePrice = (itemId, newPrice) => {
    // console.log("cartData", cartData);
    // Calculate the new price based on the quantity
    const adjustedPrice = newPrice;

    setItemPrices((prevPrices) => ({
      ...prevPrices,
      [itemId]: adjustedPrice,
    }));
  };

  // Calculate total price by summing up item prices
  useEffect(() => {
    const totalPrice = Object.values(itemPrices).reduce(
      (total, price) => total + parseFloat(price || 0),
      0
    );
    setTotalAmt(totalPrice.toFixed(2));
  }, [itemPrices, cartData]);

  //bacr code permission
  //check permssiosaon
  const checkPermission = async () => {
    let PermissionDenied = await cameraPermission();
    if (PermissionDenied) {
      navigation.navigate("Scanner");
    } else {
      //requestStoragePermission();
    }
  };

  const [modalVisible, setModalVisible] = useState(false);
  const handlePress = () => {
    setFilteredData(masterData);
    setModalVisible(true);
  };
  const handleClose = () => {
    setModalVisible(false);
  };
  const productsArray = [];

  //console.log("prodcuts array", productsArray)
  // const [masterData, setMasterData] = useState([]);
  // const [filteredData, setFilteredData] = useState([]);
  // const [search, setSearch] = useState('');
  const [totalAmt, setTotalAmt] = useState(0);
  const [totalQty, setTotalQty] = useState(0);
  const [cartData, setCartData] = useState([]);

  const calOrderStat = (array) => {
    let tempTotalAmt = 0;
    let tempQty = 0;
    //calculating total price and total quantity
    array.forEach((item) => {
      let amt = Number(itemPrices[item?.id]) * Number(item?.qty);
      tempTotalAmt = tempTotalAmt + amt;
      tempQty = tempQty + Number(item?.qty);
    });
    setTotalAmt(tempTotalAmt);
    setTotalQty(tempQty);
  };
  const clearCartData = () => {
    setCartData([]);
    calOrderStat([]);
    setCartCount("");
    setAddedItems([]);
  };

  const addProduct = (item) => {
    let tempData = [...cartData]; // Create a copy of cartData
    let productExist = false;

    // Check if the item is already in the cart
    const existingItem = tempData.find((itm) => itm.id === item.id);

    if (existingItem) {
      // Item already exists, increase quantity
      existingItem.qty += 1;
      productExist = true;
    } else {
      // Item not present, add it to the cart
      tempData.push({ ...item, qty: 1 });
    }

    setCartData(tempData);

    // Check if the item was added to the cart for the first time
    if (!productExist) {
      setCartCount((prevCount) => (prevCount || 0) + 1);

      // Disable the button after adding the item
      item.added = true;
      setAddedItems((prevAddedItems) => [...prevAddedItems, item.id]);
    }

    ToastAndroid.show(
      "Product Added Successfully to your cart",
      ToastAndroid.SHORT
    );

    calOrderStat(tempData);
  };

  const updateQuantity = (item, type, index) => {
    let tempCart = [];
    tempCart = [...cartData];
    tempCart.map((itm) => {
      if (itm.id == item.id) {
        //increment
        if (type == "add") {
          //checking sales man cannot ordered quantity valu
          ++itm.qty;
          setCartData(tempCart);
          calOrderStat(tempCart);
        }
        //decrement
        else {
          if (itm.qty > 1) {
            --itm.qty;
            setCartData(tempCart);
            calOrderStat(tempCart);
          } else {
            deleteProduct(index);
          }
        }
      }
    });
  };

  useEffect(() => {
    setFilteredCartData(cartData);
  }, [cartData]);

  const deleteProduct = (index) => {
    let tempCart = [...cartData];
    tempCart.splice(index, 1);
    setCartData(tempCart);
    calOrderStat(tempCart);
  };

  //Modal Hooks
  const [masterData, setMasterData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  useEffect(() => {
    loadAllProduct();
  }, []);

  // useFocusEffect(
  //     React.useCallback(() => {
  //         loadAllProduct()

  //     }, [])
  // );

  const { token, dealerData, userData } = useContext(AuthContext);

  const loadAllProduct = async () => {
    setLoading(true);
    // console.log("loading all product");
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      __user_id__: userData.id,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    fetch("https://dev.ordo.primesophic.com/get_products.php", requestOptions)
      .then((response) => response.json())
      .then(async (result) => {
        //   console.log('all product data fetched',result);
        tempArray = await result?.product_list.map((object) => {
          // console.log("log values", object.name_value_list)
          return {
            itemid: object.part_number,
            description: object.name,
            ldescription: object.description,
            price: object.price,
            price_usdollar: object.paddingVerticalrice_usdollar,
            aos_product_category_id: object.aos_product_category_id,
            category: object.category,
            retail_price: object.retail_price,
            no_of_days_remaining: object.no_of_days_remaining,
            net_weight: object.net_weight,
            manufacturer_c: object.manufacturer_c,
            alternative_unit: object.alternative_unit,
            tax: object.tax,
            hsn: object.hsn,
            weight: object.weight_c,
            material_type: object.material_type,
            gross_weight: object.gross_weight,
            weight_unit: object.weight_unit,
            volume: object.volume,
            volume_unit: object.volume_unit,
            imgsrc: object.product_image,
            stock: object.stock_c,
            id: object.id,
            noofdays: object.no_of_days,
            unit_of_dimention: object.unit_of_dimention,
            length: object.length,
            width: object.width,
            height: object.height,
            number_of_pieces: object.number_of_pieces,
            ean_category: object.ean_category,
            capacity_usage: object.capacity_usage,
            denominator: object.denominator,
            temp_condition: object.temp_condition,
          };
        });
        setMasterData(tempArray);
        setFilteredData(tempArray);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  const searchProduct = (text) => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource
      // Update FilteredDataSource
      const newData = masterData.filter(function (item) {
        const itemData = item.description
          ? item.description.toUpperCase() + item.itemid.toUpperCase()
          : "".toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredData(newData);
      setSearch(text);
    } else {
      // Inserted text is blank
      // Update FilteredDataSource with masterDataSource
      setFilteredData(masterData);
      setSearch(text);
    }
  };

  const [filteredCartData, setFilteredCartData] = useState([]);

  const searchProductInCart = (text) => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource
      // Update FilteredDataSource
      const newData = cartData.filter(function (item) {
        const itemData = item.description
          ? item.description.toUpperCase() + item.itemid.toUpperCase()
          : "".toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredCartData(newData);
      setSearch(text);
    } else {
      // Inserted text is blank
      // Update FilteredDataSource with masterDataSource
      setFilteredCartData(cartData);
      setSearch(text);
    }
  };

  // console.log("dealer infooooo", dealerData)

  const orderItems = async () => {
    // console.log("dealer infooooo", dealerData)

    if (cartData.length > 0) {
      let productArray = cartData.map((item) => {
        return {
          productid: item.id,
          qty: item.qty,
          list_price: itemPrices[item.id],
        };
      });
      navigation.navigate("AdminOrderReview", {
        productsArray: productArray,
        dealerInfo: userData,
        cartData: cartData,
        total: totalAmt,
        price: itemPrices,
      });
    } else {
      alert("Sorry, no products to order");
    }
  };

  // console.log("cart dataa",cartData)

  return (
    <LinearGradient
      colors={Colors.linearColors}
      start={Colors.start}
 end={Colors.end}
      locations={Colors.location}
      style={{
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
          height: "10%",
          alignItems: "center",
          alignContent: "center",
          textAlign: "center",
        }}
      >
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          style={{ paddingLeft: "5%" }}
        >
          <Image
            source={require("../../assets/images/Refund_back.png")}
            style={{ height: 30, width: 30 }}
          />
        </TouchableOpacity>
        <Text
          style={{
            fontFamily: "AvenirNextCyr-Medium",
            fontSize: 19,
            marginLeft: 8,
            color: "white",
          }}
        >
          {" "}
          My Carts
        </Text>
      
        <View>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              backgroundColor: "white",
              paddingVertical: 5,
              paddingHorizontal: 10,
              borderRadius: 5,
              elevation: 5,
              ...globalStyles.border,
              marginRight: 7,
            }}
            onPress={handlePress}
          >
            <MaterialCommunityIcons
              name="cart-variant"
              size={20}
              color="#50001D"
            />

            <Text
              style={{ color: Colors.primary, fontFamily: "AvenirNextCyr-Medium" }}
            >
              {" "}
              Add
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View
        style={{
          height: "88%",
          backgroundColor: "white",
          width: "100%",
          borderTopEndRadius: 50,
          borderTopStartRadius: 50,
          paddingVertical: 10,
          paddingHorizontal: 20,
        }}
      >
        {cartData.length > 0 && (
          <>
            <View
              style={{
                justifyContent: "space-between",
                flexDirection: "row",
                borderRadius: 10,
                paddingVertical: "2%",
                paddingHorizontal: "1%",
                marginVertical: "0%",
              }}
            >
              <Text
                style={{
                  color: Colors.primary,
                  fontFamily: "AvenirNextCyr-Medium",
                  fontSize: 18,
                }}
              >
                My Orders{" "}
              </Text>
              <TouchableOpacity
                style={{
                  backgroundColor: Colors.primary,
                  paddingVertical: 4,
                  paddingHorizontal: 10,
                  borderRadius: 5,
                  elevation: 5,
                  ...globalStyles.border,
                }}
                onPress={clearCartData}
              >
                <Text style={{ color: "white", fontFamily: "AvenirNextCyr-Thin" }}>
                  Remove All
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: "row", marginTop: 1 }}>
              <View style={{ width: "100%" }}>
                <Searchbar
                  style={{
                    marginBottom: "2%",
                    marginVertical: "1%",
                    backgroundColor: "#F3F3F3",
                  }}
                  placeholder="Search Product"
                  onChangeText={(val) => searchProductInCart(val)}
                  value={search}

                />
              </View>
            </View>
          </>
        )}

        {/* Modal */}
        <Modal visible={modalVisible} animationType="slide" transparent>
          {/* <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalText}>Hello</Text>
                            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
                                <Text style={styles.closeButtonText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View> */}
          <SafeAreaView
            style={{
              flex: 1,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              justifyContent: "center",
              paddingHorizontal: 1,
            }}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: "white",
                paddingHorizontal: 10,
                borderRadius: 8,
                marginTop: "16%",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View>
                  <TouchableOpacity
                    onPress={() => {
                      // setSearch('');
                      setModalVisible(false);
                    }}
                    style={{
                      backgroundColor: Colors.primary,
                      paddingVertical: 5,
                      paddingHorizontal: 4,
                      borderRadius: 5,
                      elevation: 5,
                      ...globalStyles.border,
                      flex: 0.5,
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
                  Add Products
                </Text>
                <TouchableOpacity
                  style={{
                    marginRight: 10,
                    backgroundColor: "#f1f1f1",
                    paddingVertical: 2,
                    paddingLeft: 3,
                    borderRadius: 30,
                    flex: 0.1,
                  }}
                  onPress={() => {
                    setSearch("");
                    setModalVisible(false);
                  }}
                >
                  <Entypo name="cross" size={16} color="grey" />
                </TouchableOpacity>
              </View>

              <View style={{ width: "100%" }}>
                <Searchbar
                  style={{
                    marginHorizontal: "1%",
                    marginVertical: "3%",
                    backgroundColor: "#F3F3F3",
                  }}
                  placeholder="Search Products"
                  onChangeText={(val) => searchProduct(val)}
                  value={search}
                />
              </View>

              <FlatList
                showsVerticalScrollIndicator={false}
                data={filteredData}
                keyboardShouldPersistTaps="handled"
                renderItem={({ item }) => (
                  <View
                    style={{
                      backgroundColor: addedItems.includes(item.id)
                        ? "#50001D"
                        : "#f2f2f2",
                      marginHorizontal: "1%",
                      marginTop: 5,
                      marginBottom: 8,
                      elevation: 5,
                      ...globalStyles.border,
                      borderTopLeftRadius: 20,
                      borderBottomRightRadius: 20,
                    }}
                  >
                    <Pressable
                      style={{ padding: 10 }}
                      // onPress={() => navigation.navigate('ProductDetails', { item: item })}
                      // onPress={() => action ? navigation.navigate(screen, { item: item }) : navigation.navigate('ProductDetails', { item: item })}
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
                          <Image
                            source={{ uri: item.imgsrc }}
                            style={{
                              ...styles.imageView,
                            }}
                          />
                        </View>
                        <View
                          style={{
                            flex: 1,
                            paddingLeft: 15,
                            marginLeft: 10,
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 12,
                              color: addedItems.includes(item.id)
                                ? "white"
                                : Colors.primary,
                              fontFamily: "AvenirNextCyr-Medium",
                              marginBottom: 2,
                            }}
                          >
                            {" "}
                            {item.itemid}
                          </Text>
                          <Text
                            style={{
                              color: addedItems.includes(item.id)
                                ? "white"
                                : "gray",
                              fontSize: 12,
                              fontFamily: "AvenirNextCyr-Thin",
                              marginTop: 1,
                            }}
                          >
                            {item.description}
                          </Text>
                          {/* <Text style={{ color: 'green', fontSize: 12, fontFamily: 'AvenirNextCyr-Thin' }}>{Number(item.stock) > 0 ? `Current Stock - ${item.stock}` : <Text style={{ color: 'red', fontSize: 12, fontFamily: 'AvenirNextCyr-Thin' }} >Out of stock</Text>}</Text> */}
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Text
                              style={{
                                color: addedItems.includes(item.id)
                                  ? "white"
                                  : Colors.primary,
                                fontSize: 12,
                                fontFamily: "AvenirNextCyr-Medium",
                              }}
                            >
                              Net wt: {item.net_weight} Kg
                            </Text>
                          </View>
                        </View>
                      </View>
                    </Pressable>
                    <View
                      style={{
                        width: "100%",
                        justifyContent: "flex-end",
                        flexDirection: "row",
                        position: "absolute",
                        bottom: 0,
                      }}
                    >
                      <TouchableOpacity
                        style={{
                          width: "24%",
                          padding: 10,
                          paddingHorizontal: 10,
                          borderBottomRightRadius: 20,
                          backgroundColor: addedItems.includes(item.id)
                            ? "#f2f2f2"
                            : "#50001D",
                          elevation: 5,
                          borderTopLeftRadius: 10,
                          flexDirection: "row",
                        }}
                        onPress={() => addProduct(item)}
                        disabled={addedItems.includes(item.id)}
                      >
                        <MaterialCommunityIcons
                          name="cart-variant"
                          size={20}
                          color={
                            addedItems.includes(item.id) ? "#50001D" : "white"
                          }
                        />
                        <Text
                          style={{
                            color: addedItems.includes(item.id)
                              ? "#50001D"
                              : "white",
                            fontSize: 12,
                            fontFamily: "AvenirNextCyr-Medium",
                          }}
                        >
                          {addedItems.includes(item.id) ? "Added " : "Add"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
                keyExtractor={(item) => item.id.toString()}
              />
            </View>
          </SafeAreaView>
        </Modal>

        {filteredCartData.length === 0 ? (
          <>
            <Image
              source={require("../../assets/images/CartEmpty.png")} // Replace with the actual path to your image
              style={{
                width: "100%",
                height: "40%",
                resizeMode: "contain",
                marginTop: "25%",
              }}
            />
            <View>
              <Text
                style={{
                  textAlign: "center",
                  fontFamily: "AvenirNextCyr-Medium",
                  fontSize: 23,
                  color: "rgba(101, 2, 49, 0.25)",
                }}
              >
                Your Cart is Empty
              </Text>
              <Text
                style={{
                  textAlign: "center",
                  fontFamily: "AvenirNextCyr-Medium",
                  fontSize: 14,
                  color: "rgba(101, 2, 49, 0.45)",
                }}
              >
                Looks like you haven’t added {"\n"} anything to your cart yet{" "}
              </Text>
              <View
                style={{
                  height: "53%",
                  flexDirection: "row",
                  justifyContent: "center",
                  marginTop: "4%",
                }}
              >
                <TouchableOpacity
                  style={{
                    backgroundColor: "rgba(101, 2, 49, 0.6)",
                    paddingVertical: 5,
                    paddingHorizontal: 1,
                    borderRadius: 30,
                    elevation: 5,
                    ...globalStyles.border,
                    width: "15%",
                    height: "23%",
                  }}
                  onPress={handlePress}
                >
                  <MaterialCommunityIcons
                    style={{
                      color: "white",
                      fontFamily: "AvenirNextCyr-Thin",
                      textAlign: "center",
                      marginTop: "15%",
                    }}
                    name="cart-variant"
                    size={30}
                    color="black"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </>
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={filteredCartData}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item, index }) => (
              <View
                style={{
                  backgroundColor: "#50001D",
                  //   marginHorizontal: "4%",
                  marginTop: 5,
                  marginBottom: 5,
                  elevation: 5,
                  ...globalStyles.border,
                  borderRadius: 5,
                }}
              >
                <Pressable
                  style={{ padding: 10 }}
                  // onPress={() => navigation.navigate('ProductDetails', { item: item })}
                  // onPress={() => action ? navigation.navigate(screen, { item: item }) : navigation.navigate('ProductDetails', { item: item })}
                >
                  <View
                    style={{ flexDirection: "row", justifyContent: "center" }}
                  >
                    <View
                      style={{
                        backgroundColor: "white",
                        elevation: 5,
                        ...globalStyles.border,
                        borderRadius: 5,
                        padding: "1%",
                      }}
                    >
                      <Image
                        source={{ uri: item.imgsrc }}
                        style={{
                          ...styles.imageView,
                        }}
                      />
                    </View>
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
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: 2,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 12,
                            color: "white",
                            fontFamily: "AvenirNextCyr-Medium",
                          }}
                        >
                          {" "}
                          {item.itemid}
                        </Text>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                          <MaterialCommunityIcons
                            name="delete"
                            size={20}
                            color={"white"}
                          />
                        </TouchableOpacity>
                      </View>
                      <Text
                        style={{
                          color: "white",
                          fontSize: 12,
                          fontFamily: "AvenirNextCyr-Thin",
                          marginTop: 1,
                        }}
                      >
                        {item.description}
                      </Text>
                      {/* <Text style={{ color: 'green', fontSize: 12, fontFamily: 'AvenirNextCyr-Thin' }}>{Number(item.stock) > 0 ? `Current Stock - ${item.stock}` : <Text style={{ color: 'red', fontSize: 12, fontFamily: 'AvenirNextCyr-Thin' }} >Out of stock</Text>}</Text> */}
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginTop: "2%",
                        }}
                      >
                        <View>
                          <Text
                            style={{
                              color: "white",
                              fontSize: 12,
                              fontFamily: "AvenirNextCyr-Medium",
                              marginTop: "2%",
                            }}
                          >
                            Net wt: {item.net_weight} Kg
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <TouchableOpacity
                          // onPress={() => handleQuantityChange(item, 'decrement')} style={{}}
                          >
                            {/* <Text style={{ fontSize: 30 }}>-</Text> */}
                            <Entypo
                              name="squared-minus"
                              size={20}
                              color="white"
                            />
                          </TouchableOpacity>
                          <TextInput
                            style={{
                              fontSize: 14,
                              borderWidth: 1,
                              borderColor: "white",
                              fontFamily: "AvenirNextCyr-Thin",
                              width: 40,
                              textAlign: "center",
                              height: 26,
                              justifyContent: "center",
                              padding: 1,
                              color: "white",
                            }}
                            // value={item.quantity > 0 ? item.quantity.toString() : 1}
                            // onChangeText={(text) => handleQuantityChange(item, text)}
                            keyboardType="numeric"
                          />
                          <TouchableOpacity
                          // onPress={() => handleQuantityChange(item, 'increment')} style={{ justifyContent: 'center', alignItems: 'center' }}
                          >
                            {/* <Text style={{ fontSize: 20, textAlign: 'center' }}>+</Text> */}
                            <Entypo
                              name="squared-plus"
                              size={20}
                              color="white"
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>
                </Pressable>
              </View>
            )}
            keyExtractor={(item) => item.id.toString()}
          />
        )}
        <LinearGradient
          colors={Colors.linearColors}
          start={{ x: 1, y: 1 }}
         end={Colors.end}
          locations={Colors.location}
          style={{
            backgroundColor: Colors.primary,
            borderColor: Colors.primary,
            borderRadius: 50,
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            paddingVertical: "4%",
            marginTop: "3%",
          }}
        >
          <TouchableOpacity
            style={styles.button}
            onPress={orderItems}
            activeOpacity={0.8}
          >
            <Text style={styles.btnText}>Check Out</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </LinearGradient>
  );

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <AntDesign name="arrowleft" size={25} color={Colors.black} />
          </TouchableOpacity>
        </View>
        <View>
          <Text
            style={{
              fontSize: 20,
              color: Colors.primary,
              fontFamily: "AvenirNextCyr-Medium",
              marginVertical: 5,
            }}
          >
            My Cart
          </Text>
        </View>
        <View>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          marginTop: 5,
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: "white",
            paddingVertical: 5,
            paddingHorizontal: 20,
            borderRadius: 5,
            elevation: 5,
            ...globalStyles.border,
          }}
          onPress={handlePress}
        >
          <Text
            style={{ color: Colors.primary, fontFamily: "AvenirNextCyr-Thin" }}
          >
            ADD
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor: "white",
            paddingVertical: 5,
            paddingHorizontal: 20,
            borderRadius: 5,
            elevation: 5,
            ...globalStyles.border,
          }}
          onPress={orderItems}
        >
          <Text style={{ color: "green", fontFamily: "AvenirNextCyr-Thin" }}>
            SEND
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor: "white",
            paddingVertical: 5,
            paddingHorizontal: 20,
            marginLeft: 10,
            borderRadius: 5,
            elevation: 5,
            ...globalStyles.border,
          }}
          onPress={clearCartData}
        >
          <Text style={{ color: "red", fontFamily: "AvenirNextCyr-Thin" }}>
            DELETE
          </Text>
        </TouchableOpacity>
      </View>
      <View>
        <Text
          style={{
            fontSize: 14,
            color: Colors.black,
            fontFamily: "AvenirNextCyr-Medium",
            marginTop: 10,
            marginLeft: 3,
          }}
        >
          Customer Name :{" "}
          <Text style={{ fontFamily: "AvenirNextCyr-Thin" }}>{data.name}</Text>
        </Text>
      </View>
      <View style={{ flexDirection: "row", marginTop: 10 }}>
        <View style={styles.modalSearchContainer}>
          <TextInput
            style={styles.input}
            value={search}
            placeholder="Search product"
            placeholderTextColor="gray"
            onChangeText={(val) => searchProductInCart(val)}
            keyboardShouldPersistTaps="always"
            // editable={false}
          />
          <View style={styles.searchButton}>
            <AntDesign name="search1" size={20} color="black" />
          </View>
        </View>

        <Modal visible={modalVisible} transparent>
          <SafeAreaView
            style={{
              flex: 1,
              backgroundColor: "grey",
              justifyContent: "center",
              paddingHorizontal: 10,
            }}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: "white",
                paddingHorizontal: 5,
                borderRadius: 8,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View></View>
                <Text
                  style={{
                    alignSelf: "center",
                    fontSize: 20,
                    color: "black",
                    fontFamily: "AvenirNextCyr-Thin",
                    marginVertical: 10,
                  }}
                >
                  Search Products
                </Text>
                <TouchableOpacity
                  style={{ marginRight: 10 }}
                  onPress={() => {
                    setSearch("");
                    setModalVisible(false);
                  }}
                >
                  <AntDesign name="close" size={20} color={`black`} />
                </TouchableOpacity>
              </View>
              {/* <View style={{height: 40}} /> */}

              <View style={{ flexDirection: "row" }}>
                <View style={styles.modalSearchContainer}>
                  <TextInput
                    style={styles.input}
                    value={search}
                    placeholder="Search product"
                    placeholderTextColor="gray"
                    onChangeText={(val) => searchProduct(val)}
                    keyboardShouldPersistTaps="always"
                  />
                  <TouchableOpacity style={styles.searchButton}>
                    <AntDesign name="search1" size={20} color="black" />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={{
                    height: 45,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#fff",
                    borderRadius: 8,
                    paddingHorizontal: 16,
                    elevation: 5,
                    flex: 0.2,
                    marginLeft: 10,
                    ...globalStyles.border,
                  }}
                  onPress={() => {
                    setSearch("");
                    setFilteredData(masterData);
                    Keyboard.dismiss();
                  }}
                >
                  <Text
                    style={{
                      color: "#6B1594",
                      fontFamily: "AvenirNextCyr-Thin",
                      fontSize: 14,
                    }}
                  >
                    Clear
                  </Text>
                </TouchableOpacity>
              </View>

              <FlatList
                showsVerticalScrollIndicator={false}
                data={filteredData}
                keyboardShouldPersistTaps="handled"
                renderItem={({ item }) => (
                  <Pressable
                    style={styles.elementsView}
                    // onPress={() => navigation.navigate('ProductDetails', { item: item })}
                    // onPress={() => action ? navigation.navigate(screen, { item: item }) : navigation.navigate('ProductDetails', { item: item })}
                  >
                    <View
                      style={{ flexDirection: "row", justifyContent: "center" }}
                    >
                      <Image
                        source={{ uri: item.imgsrc }}
                        style={{
                          ...styles.imageView,
                        }}
                      />
                      <View
                        style={{
                          flex: 1,
                          borderLeftWidth: 1.5,
                          paddingLeft: 15,
                          marginLeft: 10,
                          borderStyle: "dotted",
                          borderColor: "grey",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 12,
                            color: "red",
                            fontFamily: "AvenirNextCyr-Medium",
                            marginBottom: 2,
                          }}
                        >
                          {" "}
                          {item.itemid}
                        </Text>
                        <Text
                          style={{
                            color: Colors.primary,
                            fontSize: 12,
                            fontFamily: "AvenirNextCyr-Medium",
                            marginTop: 4,
                          }}
                        >
                          {item.description}
                        </Text>
                        {/* <Text style={{ color: 'green', fontSize: 12, fontFamily: 'AvenirNextCyr-Thin' }}>{Number(item.stock) > 0 ? `Current Stock - ${item.stock}` : <Text style={{ color: 'red', fontSize: 12, fontFamily: 'AvenirNextCyr-Thin' }} >Out of stock</Text>}</Text> */}
                        <Text
                          style={{
                            color: "black",
                            fontSize: 12,
                            fontFamily: "AvenirNextCyr-Thin",
                          }}
                        >
                          {item.brand_name}{" "}
                        </Text>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          <Text
                            style={{
                              color: "grey",
                              fontSize: 12,
                              fontFamily: "AvenirNextCyr-Thin",
                              borderBottomColor: "grey",
                              borderBottomWidth: 0.5,
                            }}
                          >
                            Net wt: {item.net_weight} Kg
                          </Text>
                          {/* <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}>INR {Number(item.price)}</Text> */}
                        </View>
                      </View>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          color: "black",
                          fontFamily: "AvenirNextCyr-Thin",
                          paddingLeft: 16,
                        }}
                      ></Text>
                      <TouchableOpacity
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                          padding: 10,
                          paddingHorizontal: 16,
                          borderRadius: 5,
                          backgroundColor: "#fff",
                          elevation: 5,
                          ...globalStyles.border,
                        }}
                        onPress={() => addProduct(item)}
                      >
                        <Text
                          style={{
                            color: Colors.primary,
                            fontSize: 12,
                            fontFamily: "AvenirNextCyr-Thin",
                          }}
                        >
                          +Add
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </Pressable>
                )}
                keyExtractor={(item) => item.id.toString()}
              />
            </View>
          </SafeAreaView>
        </Modal>
        {/* Modal */}
      </View>

      {/* <View style={{ marginLeft: 10 }}>
                <Text style={[styles.textColor, {textAlign:'center'}]}>OrderTotals</Text>
            </View> */}
      <View
        style={{
          justifyContent: "space-around",
          flexDirection: "row",
          borderRadius: 10,
          paddingVertical: "2%",
          paddingHorizontal: "2%",
          backgroundColor: "#E4E4E4",
          marginVertical: "2%",
        }}
      >
        <Text style={styles.textColor}>
          Products:<Text style={styles.textValue}> {cartData.length}</Text>{" "}
        </Text>
        <Text style={styles.textColor}>
          Qty:<Text style={styles.textValue}>{totalQty}</Text>{" "}
        </Text>
        <Text style={styles.textColor}>
          Price: INR{" "}
          <Text style={styles.textValue}> {totalAmt ? totalAmt : 0}</Text>
        </Text>
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={filteredCartData}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item, index }) => (
          <Pressable style={styles.elementsView}>
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
              <Image
                source={{ uri: item.imgsrc }}
                style={{
                  ...styles.imageView,
                }}
              />
              <View
                style={{
                  flex: 1,
                  borderLeftWidth: 1.5,
                  paddingLeft: 15,
                  marginLeft: 10,
                  borderStyle: "dotted",
                  borderColor: "grey",
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    color: "red",
                    fontFamily: "AvenirNextCyr-Medium",
                    marginBottom: 2,
                  }}
                >
                  {" "}
                  {item.itemid}
                </Text>
                <Text
                  style={{
                    color: Colors.primary,
                    fontSize: 12,
                    fontFamily: "AvenirNextCyr-Medium",
                    marginTop: 4,
                  }}
                >
                  {item.description}
                </Text>
                {/* <Text style={{ color: 'green', fontSize: 12, fontFamily: 'AvenirNextCyr-Thin' }}>{Number(item.stock) > 0 ? `Current Stock - ${item.stock}` : <Text style={{ color: 'red', fontSize: 12, fontFamily: 'AvenirNextCyr-Thin' }} >Out of stock</Text>}</Text> */}
                <Text
                  style={{
                    color: "black",
                    fontSize: 12,
                    fontFamily: "AvenirNextCyr-Thin",
                  }}
                >
                  {item.brand_name}{" "}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      color: "grey",
                      fontSize: 12,
                      fontFamily: "AvenirNextCyr-Thin",
                      borderBottomColor: "grey",
                      borderBottomWidth: 0.5,
                    }}
                  >
                    Net wt: {item.net_weight} Kg
                  </Text>
                  {/* <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}>INR {Number(item.price)}</Text> */}
                </View>
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 8,
                paddingLeft: 5,
                alignItems: "center",
              }}
            >
              {/* <Text style={{ fontSize: 14, color: 'black', fontFamily: 'AvenirNextCyr-Thin', }}></Text> */}
              <View
                style={{
                  paddingHorizontal: 10,
                  borderColor: "#cccccc",
                  borderWidth: 1,
                  height: 30,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <TextInput
                  placeholder="Price"
                  style={{ height: 40 }}
                  keyboardType="number-pad"
                  onChangeText={(newPrice) =>
                    updatePrice(item.id, newPrice, item.qty)
                  } // Update price state
                  value={itemPrices[item.id]}
                  keyboardShouldPersistTaps="always"
                />
              </View>

              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                  style={{
                    width: 40,
                    height: 30,
                    borderRadius: 5,
                    borderColor: "grey",
                    borderWidth: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 10,
                  }}
                  onPress={() => {
                    updateQuantity(item, "minus", index);
                  }}
                >
                  <Text
                    style={{
                      color: "black",
                      fontSize: 14,
                      fontFamily: "AvenirNextCyr-Medium",
                    }}
                  >
                    -
                  </Text>
                </TouchableOpacity>
                <View
                  style={{
                    width: 45,
                    height: 30,
                    borderRadius: 5,
                    borderColor: "grey",
                    borderWidth: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 10,
                  }}
                >
                  <Text
                    style={{
                      color: "black",
                      fontSize: 14,
                      fontFamily: "AvenirNextCyr-Medium",
                    }}
                  >
                    {Number(item.qty)}
                  </Text>
                </View>
                <TouchableOpacity
                  style={{
                    width: 40,
                    height: 30,
                    borderRadius: 5,
                    borderColor: "grey",
                    borderWidth: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={() => {
                    updateQuantity(item, "add", index);
                  }}
                >
                  <Text
                    style={{
                      color: "black",
                      fontSize: 14,
                      fontFamily: "AvenirNextCyr-Medium",
                    }}
                  >
                    +
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Pressable>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

export default SecondarySales;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "white",
  },
  elementsView: {
    backgroundColor: "#f2f2f2",
    marginHorizontal: "2%",
    marginTop: 5,
    //flexDirection: 'row',
    //justifyContent: 'space-between',
    //alignItems: 'center',
    marginBottom: 16,
    elevation: 5,
    ...globalStyles.border,
    // padding: 16,
    borderTopLeftRadius: 20,
    borderBottomRightRadius: 20,

    //borderColor: '#fff',
    //borderWidth: 0.5
  },
  imageView: {
    width: 70,
    height: 70,
    // backgroundColor:'white',

    // padding:,

    // borderRadius: 20,
    // marginTop: 20,
    // marginBottom: 10
  },
  elementText: {
    fontSize: 15,
    fontFamily: "AvenirNextCyr-Medium",
    color: "black",
  },
  minusButton: {
    width: 45,
    height: 30,
    borderColor: "grey",
    borderWidth: 0.5,
    borderRadius: 5,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
    marginTop: 30,
    marginLeft: 10,
  },
  modalMinusButton: {
    width: 35,
    height: 20,
    borderColor: "grey",
    borderWidth: 0.5,
    borderRadius: 5,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
    marginTop: 40,
    marginLeft: 10,
  },
  quantityCount: {
    width: 45,
    height: 30,
    borderColor: "grey",
    borderWidth: 0.5,
    borderRadius: 5,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
    marginTop: 30,
    marginLeft: 1,
  },
  modalQuantityCount: {
    width: 35,
    height: 20,
    borderColor: "grey",
    borderWidth: 0.5,
    borderRadius: 5,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
    marginTop: 40,
    marginLeft: 1,
  },
  orderCloseView: {
    height: 15,
    width: 15,
    //marginTop: 30
  },
  imageText: {
    fontSize: 15,
    fontFamily: "AvenirNextCyr-Thin",
    color: "black",
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "lightgray",
    borderRadius: 5,

    //paddingVertical: 5,
    paddingHorizontal: 10,
    marginLeft: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    marginRight: 10,
  },
  searchButton: {
    padding: 5,
  },
  sendButtonView: {
    borderRadius: 5,
    // borderWidth: 1,
    // borderColor: 'grey',
    backgroundColor: "green",
    paddingVertical: 10,
    paddingHorizontal: 20,

    height: 40,
    marginLeft: 10,
  },
  saveButtonView: {
    borderRadius: 5,
    // borderWidth: 1,
    // borderColor: 'grey',
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    height: 40,
    marginLeft: 10,
  },
  deleteButtonView: {
    borderRadius: 5,
    // borderWidth: 1,
    // borderColor: 'grey',
    backgroundColor: "red",
    paddingVertical: 10,
    paddingHorizontal: 20,
    height: 40,
    marginLeft: 10,
  },
  addButtonView: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "grey",
    backgroundColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 20,
    height: 40,
    marginLeft: 10,
    alignSelf: "center",
  },
  modalAddButtonView: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "grey",
    backgroundColor: "white",
    paddingVertical: 5,
    paddingHorizontal: 15,
    height: 35,
    //alignSelf: 'flex-end',
    //marginLeft: 30,
    //marginTop: 60
  },
  buttonText: {
    color: "blue",
    fontFamily: "AvenirNextCyr-Thin",
  },
  sendButton: {
    color: "white",
    fontFamily: "AvenirNextCyr-Thin",
  },
  deleteButton: {
    color: "red",
  },
  saveButton: {
    color: "purple",
  },
  textColor: {
    color: "black",
    fontFamily: "AvenirNextCyr-Medium",
  },
  textValue: {
    color: "black",
    fontFamily: "AvenirNextCyr-Thin",
  },
  searchModal: {
    backgroundColor: "white",
    padding: 20,
    width: "90%",
    marginHorizontal: 10,
    borderRadius: 10,
    elevation: 5,
    ...globalStyles.border,
    //borderColor: 'black',
    //borderWidth: 1,
    marginVertical: 100,
    // flexDirection:'row'
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
  modalTitle: {
    fontSize: 16,
    color: "black",
    fontFamily: "AvenirNextCyr-Medium",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
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
    marginLeft: 6,
    color: "white",
    fontSize: 10,
    fontFamily: "AvenirNextCyr-Medium",
  },
  button: {
    // height: "20%",
    justifyContent: "center",
    alignItems: "center",
    // borderRadius: 5,
    // backgroundColor: Colors.primary,
    // marginBottom: '3%',
    // marginTop: '3%',
    borderRadius: 50,
    width: "100%",
  },
  btnText: {
    fontFamily: "AvenirNextCyr-Medium",
    color: "#fff",
    fontSize: 16,
  },
});
