import React, { useState, useContext, useRef, useEffect, useCallback } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Keyboard,
  Pressable,
  TouchableOpacity,
  Text,
  Image,
  Alert,
  TouchableNativeFeedback,
  Modal,
  SafeAreaView,
  FlatList,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Colors from "../../constants/Colors";
import { AuthContext } from "../../Context/AuthContext";
import ImageResizer from "@bam.tech/react-native-image-resizer";
import RNFS from "react-native-fs";
import { cameraPermission } from "../../utils/Helper";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Dropdown } from "react-native-element-dropdown";
import DatePicker from "react-native-date-picker";
import moment from "moment";
import AsyncStorage from "@react-native-async-storage/async-storage";
import globalStyles from "../../styles/globalStyles";
import Entypo from "react-native-vector-icons/Entypo";
import { Searchbar, Checkbox, RadioButton } from "react-native-paper";
import { MultiSelect } from "react-native-element-dropdown";
import LinearGradient from "react-native-linear-gradient";
import { Fold, Wave } from 'react-native-animated-spinkit';
import { searchItem } from "../../utils/Search";
import { debounce } from "../../utils/Search";


const CreateRFQ = ({ navigation, route }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { userData, token } = useContext(AuthContext);
  const [selectedItem, setselectedItems] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [masterData, setMasterData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [search, setSearch] = useState("");
  const queryParams = useRef({ limit: 10, offset: 0 });
  const [searching, setSearching] = useState(false);
 


  const { item } = route.params;
  console.log("products present", item)

  useEffect(() => {
    // If item.Products is available, set it in a variable or state
    if (item && item.Products) {
      // console.log("products present", item.id)
      setselectedItems(item.Products); // Assuming you want to set it in the selectedItem state
    }
  }, [item]);

  useEffect(() => {
    if (search.trim()) {
      debouncedSearch(search);
    } else {
      setFilteredData(masterData);
      // setProductCount(masterData.length);
    }
  }, [search]);

  const handleSearch = async (val) => {
    const baseUrl = "https://gsidev.ordosolution.com/api/test_product/?limit=5&offset=5";
    setSearching(true)
    const result = await searchItem(baseUrl, val, userData.token);
    setSearching(false)
    if (result) {
      setFilteredData(result.products);
      // setProductCount(result.length);
    }
  };

  const debouncedSearch = useCallback(debounce(handleSearch, 500), [userData.token]);

  // console.log("item",item)

  useEffect(() => {
    getSuppliers();
  }, []);

  const getSuppliers = async () => {
    setLoading(true);
    console.log("loading all product");
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${userData.token}`);

    // console.log("dfsddfdsfds", userData.token)

    var raw = JSON.stringify();

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch("https://gsidev.ordosolution.com/api/suppliers/", requestOptions)
      .then((response) => response.json())
      .then(async (result) => {
        const supplier = result.map((supplier) => {
          return {
            label: supplier.full_name,
            value: supplier.id,
          };
        });
        setSuppliers(supplier);
        // console.log("supp",suppliers)

        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.log("error in get suppliers", error);
      });
  };

  useEffect(() => {
    loadAllProduct(queryParams.current.limit, queryParams.current.offset);
  }, []);


  const loadAllProduct = async (limit, offset) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${userData.token}`);

    var raw = "";

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    try {
      const response = await fetch(
        `https://gsidev.ordosolution.com/api/test_product/?limit=${limit}&offset=${offset}`,
        requestOptions
      );
      const result = await response.json();

      // setProductCount(result.total_count);

      if (offset === 0) {
        setMasterData(result.products);
        setFilteredData(result.products);
      } else {
        setMasterData((prevData) => [...prevData, ...result.products]);
        setFilteredData((prevData) => [...prevData, ...result.products]);
      }
      setLoading(false);

    } catch (error) {
      console.log("error", error);
    }
  };

  const removeProductFromCart = (item) => {
    // Filter out the item to remove it from the array
    const updatedProducts = selectedItem.filter(
      (product) => product.id !== item.id
    );
    setselectedItems(updatedProducts); // Update the state with the new array
  };

  const handleCheckboxChange = (item) => {
    // console.log("itemmmm", item)
    if (selectedItem.find((product) => product.id === item.id)) {
      // Remove the product from selectedItem
      setselectedItems((prevselectedItems) =>
        prevselectedItems.filter((product) => product.id !== item.id)
      );
    } else {
      // Add the product to selectedItem
      setselectedItems((prevselectedItems) => [
        ...prevselectedItems,
        {
          name: item.name,
          id: item.id,
          quantity: 1,
          product_image: item.product_image,
          description: item.description,
          stock: item.stock

        },
      ]);
    }
  };

  // console.log("selee",selectedItem)

  const handleQuantityChange = (item, action) => {
    let numericValue = parseInt(item.quantity);

    if (isNaN(numericValue) || numericValue < 1) {
      // Set quantity to 1 and reset stockError
      item.quantity = 1;
      item.stockError = false;
      setselectedItems([...selectedItem]); // Trigger state update by creating a new reference
    } else if (action === 'increment') {
      // Increment quantity by 1 and reset stockError
      item.quantity = numericValue + 1;
      // item.stockError = false;
      setselectedItems([...selectedItem]); // Trigger state update by creating a new reference
    } else if (action === 'decrement' && numericValue > 1) {
      // Decrement quantity by 1 and reset stockError
      item.quantity = numericValue - 1;
      // item.stockError = false;
      setselectedItems([...selectedItem]); // Trigger state update by creating a new reference
    } else if (!isNaN(action) && action >= 0) {
      // Update quantity to the entered value and reset stockError
      item.quantity = parseInt(action);
      // item.stockError = false;
      setselectedItems([...selectedItem]); // Trigger state update by creating a new reference
    }

    // Check if entered quantity is greater than stock_c, set stockError to true
  };


  console.log("selec", selectedItem)

  const searchProduct = (text) => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource
      // Update FilteredDataSource
      const newData = masterData.filter(function (item) {
        const itemData = item.description
          ? item.description.toUpperCase() + item.name.toUpperCase()
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
  // console.log("selelele",selectedSupplier)
  const onEndReached = () => {
    if (search.trim()) {
      return;
    }
    if (!loading) {
      queryParams.current.offset += queryParams.current.limit;
      setLoading(true);
      loadAllProduct(queryParams.current.limit, queryParams.current.offset);
    }
  };


  const handleSubmit = async () => {
    if (item) {
      setLoading(true);
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${userData.token}`);

      const transformedData = selectedItem.map((item) => ({
        product_id: item.id,
        qty: item.quantity,
      }));

      // console.log("jcksjc",item)
      const Supp = [];
      Supp.push(item.id || item.supplier_id);

      var raw = JSON.stringify({
        supplier_id: Supp,
        products: transformedData,
        user: userData.id,
        rfq_flag: "true"

        // token:token
      });

      console.log("raw:", raw);

      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      await fetch("https://gsidev.ordosolution.com/api/rfq/", requestOptions)
        .then((response) => response.json())
        .then(async (result) => {
          console.log("result of rfq", result);

          // if (result.id) {
          Alert.alert("Success", "RFQ sent for approval", [
            { text: "OK", onPress: () => navigation.goBack() },
          ]);
          // }
        })
        .catch((error) => console.log("error", error));
      setLoading(false);
    } else {
      Alert.alert("Warning", "Please select the supplier before submitting");
    }

  };

  // const handleSubmit = () => {
  //     console.log("pressed")
  // }
  const renderItemm = (item) => {
    // console.log("jbhdskjfjksdhfgkjsdh",item)
    return (
      <View style={styles.item}>
        <Text style={styles.selectedTextStyle}>{item.label}</Text>
        <AntDesign
          style={styles.icon}
          color={
            selectedSupplier.some((id) => id === item.value) ? "green" : "black"
          }
          name="Safety"
          size={20}
        />
      </View>
    );
  };

  //   console.log("jgafahkgrhkrhksh",selectedItem)

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View style={styles.container}>
        <View style={styles.headercontainer}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <AntDesign name="arrowleft" size={25} color={Colors.black} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Create RFQ</Text>
          </View>
        </View>

        <View style={styles.recoredbuttonStyle}>
          {/* <Text style={styles.content}>{dealerInfo?.name}</Text>
                    <Text style={styles.content}>{dealerInfo?.shipping_address_street} {dealerInfo?.billing_address_city} {dealerInfo?.shipping_address_state}</Text>
                    <Text style={styles.content}>{dealerInfo?.shipping_address_country} - {dealerInfo?.shipping_address_postalcode}</Text> */}
          <Text style={{ color: Colors.primary, fontFamily: 'AvenirNextCyr-Bold', fontSize: 16, marginBottom: 3 }}>{item.full_name} - {item.id}</Text>
          <Text style={{ color: 'black', fontFamily: 'AvenirNextCyr-Medium', fontSize: 13, marginBottom: 3 }}>{item?.address}</Text>
          {/* <Text style={{color:'rgba(101, 2, 49, 0.63)',fontFamily:'AvenirNextCyr-Medium',fontSize:13}}>59834-2056, Mangaluru</Text> */}
          <Text style={{ color: 'black', fontFamily: 'AvenirNextCyr-Medium', fontSize: 13, fontWeight: 700 }}>{item?.phone}</Text>


        </View>


        {/* <Dropdown
          style={[styles.dropdown]}
          placeholderStyle={styles.placeholderStyle}
          searchPlaceholder="Search"
          selectedTextStyle={styles.selectedTextStyle}
          itemTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={suppliers}
          maxHeight={400}
          labelField="label"
          valueField="value"
          placeholder="Supplier"
          value={selectedSupplier}
          onChange={(item) => {
            setSelectedSupplier(item.value);
            // console.log(item)
          }}
        /> */}

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontFamily: "AvenirNextCyr-Medium",
              color: "black",
              fontSize: 17,
            }}
          >
            Products
          </Text>
          {/* {selectedSupplier && ( */}
          <TouchableOpacity
            onPress={() => {
              setModalVisible(true);
            }}
            style={{
              paddingVertical: "2%",
              paddingHorizontal: "5%",
              backgroundColor: Colors.primary,
              borderRadius: 10,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "white", fontFamily: "AvenirNextCyr-Medium" }}>
              ADD +
            </Text>
          </TouchableOpacity>
          {/* )} */}
        </View>

        <View style={styles.ProductListContainer}>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={selectedItem}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <View style={styles.elementsView}>
                <View
                  style={{ flexDirection: "row", justifyContent: "center" }}
                >
                  <Pressable>
                    {item.product_image && item.product_image.length > 0 ? (
                      <Image
                        source={{ uri: item.product_image[0] }} // Use the first image
                        style={styles.imageView}
                      />
                    ) : (
                      <Image
                        source={require("../../assets/images/noImagee.png")} // Use default image
                        style={styles.imageView}
                      />
                    )}
                  </Pressable>
                  <View
                    style={{
                      flex: 1,
                      paddingLeft: 15,
                      marginLeft: 10,
                    }}
                  >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text
                        style={{
                          color: Colors.primary,
                          fontSize: 14,
                          fontFamily: "AvenirNextCyr-Medium",
                          marginTop: 5,
                        }}
                      >
                        {item.name}
                      </Text>
                      <TouchableOpacity
                        onPress={() => removeProductFromCart(item)}
                      >
                        <FontAwesome5
                          name="trash-alt"
                          size={20}
                          color={'tomato'}
                        />
                      </TouchableOpacity>
                    </View>
                    <Text
                      style={{
                        color: "black",
                        fontSize: 12,
                        fontFamily: "AvenirNextCyr-Medium",
                        marginTop: 1,
                      }}
                    >
                      {item.description}
                    </Text>

                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        // marginTop: "2%",
                      }}
                    >
                      <View>
                        {/* <Text
                            style={{
                              color: "black",
                              fontSize: 12,
                              fontFamily: "AvenirNextCyr-Medium",
                              marginTop: "2%",
                            }}
                          >
                            UOM: {item.unit_of_measure}
                          </Text> */}
                        <Text
                          style={{
                            color: "black",
                            fontSize: 12,
                            fontFamily: "AvenirNextCyr-Medium",
                            marginTop: "2%",
                          }}
                        >
                          Stock: {item.stock}
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
                          onPress={() => handleQuantityChange(item, 'decrement')} style={{}}
                        >
                          <Entypo name="squared-minus" size={20} color="tomato" />
                        </TouchableOpacity>
                        <TextInput
                          style={{
                            fontSize: 14,
                            borderWidth: 1,
                            borderColor: "black",
                            fontFamily: "AvenirNextCyr-Thin",
                            width: 40,
                            textAlign: "center",
                            height: 26,
                            justifyContent: "center",
                            padding: 1,
                            color: "black",
                          }}
                          value={item.quantity > 0 ? item.quantity.toString() : 1}
                          onChangeText={(text) =>
                            handleQuantityChange(item, text)
                          }
                          keyboardType="numeric"
                        />
                        <TouchableOpacity
                          onPress={() => handleQuantityChange(item, 'increment')} style={{ justifyContent: 'center', alignItems: 'center' }}
                        >
                          <Entypo name="squared-plus" size={20} color="green" />
                        </TouchableOpacity>
                      </View>
                    </View>

                    {/* <TouchableOpacity
                        onPress={() => removeProductFromCart(item)}
                      >
                        <FontAwesome5
                          name="trash-alt"
                          size={20}
                          color={Colors.black}
                        />
                      </TouchableOpacity> */}
                    {/* </View> */}
                  </View>
                </View>
                <View
                  style={{
                    justifyContent: "space-between",
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: "2%",
                  }}
                ></View>
              </View>
            )}
            keyExtractor={(item) => item.product_id?.toString()}
            ListEmptyComponent={() => (
              <View style={styles.noProductsContainer}>
                <Text style={styles.noProductsText}>No Products</Text>
              </View>
            )}
          />
        </View>

        {selectedItem.length > 0 && (
          <LinearGradient
            colors={Colors.linearColors}
            start={Colors.start}
            end={Colors.end}
            locations={Colors.ButtonsLocation}
            style={{
              backgroundColor: Colors.primary,
              borderColor: Colors.primary,
              borderRadius: 50,
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
              marginVertical: "3%",
            }}
          >
            <TouchableOpacity
              style={{
                paddingVertical: "4%", width: '100%', justifyContent: "center",
                alignItems: "center",
              }}
              // style={styles.button}
              onPress={handleSubmit}
              activeOpacity={0.8}
            >
              {loading ? (<Wave size={30} color={"white"} />) : (<Text style={styles.btnText}>Request Approval</Text>)}
            </TouchableOpacity>
          </LinearGradient>
        )}

        <Modal visible={modalVisible} animationType="slide" transparent>
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
                  Choose Product
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
                  placeholder="Search Product"
                  onChangeText={(val) => setSearch(val)}
                  value={search}
                  loading={searching}
                />
              </View>

              <FlatList
                showsVerticalScrollIndicator={false}
                data={filteredData}
                keyboardShouldPersistTaps="handled"
                onEndReached={onEndReached}
                onEndReachedThreshold={0.5}
                renderItem={({ item }) => (
                  <View
                    style={{
                      backgroundColor: "#f2f2f2",
                      marginHorizontal: "1%",
                      marginTop: 5,
                      marginBottom: "3%",
                      elevation: 5,
                      ...globalStyles.border,
                      borderTopLeftRadius: 20,
                      borderBottomRightRadius: 20,
                    }}
                  >
                    <Pressable
                      style={{ padding: 10 }}
                      onPress={() => {
                        handleCheckboxChange(item);
                      }}
                    // onPress={() => navigation.navigate('ProductDetails', { item: item })}
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
                          {item.product_image && item.product_image.length > 0 ? (
                            <Image
                              source={{ uri: item.product_image[0] }} // Use the first image
                              style={styles.imageView}
                            />
                          ) : (
                            <Image
                              source={require("../../assets/images/noImagee.png")} // Use default image
                              style={styles.imageView}
                            />
                          )}
                        </View>
                        <View
                          style={{
                            flex: 1,
                            paddingLeft: 15,
                            // marginLeft: 10,
                          }}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 12,
                                color: Colors.primary,
                                fontFamily: "AvenirNextCyr-Medium",
                                marginBottom: 2,
                                flexWrap: 'wrap',
                                flex: 2
                              }}
                            >
                              {/* {" "} */}
                              {item.name}
                            </Text>
                            <Checkbox.Android
                              color={Colors.primary}
                              status={
                                selectedItem.some(
                                  (product) => product.id === item.id
                                )
                                  ? "checked"
                                  : "unchecked"
                              }
                            />
                          </View>
                          <Text
                            style={{
                              color: "grey",
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
                                color: Colors.primary,
                                fontSize: 12,
                                fontFamily: "AvenirNextCyr-Medium",
                              }}
                            >
                              Stock: {item.stock}{" "}
                            </Text>

                          </View>
                        </View>
                      </View>
                    </Pressable>
                  </View>
                )}
                keyExtractor={(item) => item.product_id?.toString()}
              />
              {filteredData.length > 0 && loading && <View style={{ flexDirection: 'row', gap: 10, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontFamily: "AvenirNextCyr-Medium" }}>Loading more products</Text>
                <ActivityIndicator
                  animating={loading}
                  color={Colors.primary}
                  size="small"
                // style={styles.activityIndicator}
                />
              </View>}
            </View>
          </SafeAreaView>
        </Modal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: "5%",
    paddingTop: 10,
    backgroundColor: "white",
    flex: 1,
  },
  textInput: {
    borderColor: "grey",
    borderWidth: 1,
    backgroundColor: "white",
    height: 50,
    marginBottom: "5%",
    padding: 5,
    paddingLeft: 8,

    fontFamily: "AvenirNextCyr-Thin",
    borderRadius: 10,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  halfTextInput: {
    flex: 1,
  },
  headercontainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "AvenirNextCyr-Medium",
    color: Colors.black,
    marginLeft: 10,
    marginTop: 3,
  },
  button: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    backgroundColor: Colors.primary,
    marginBottom: 10,
    marginTop: "5%",
    borderRadius: 20,
  },
  btnText: {
    fontFamily: "AvenirNextCyr-Medium",
    color: "#fff",
    fontSize: 16,
  },
  buttonview: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 16,
    color: "black",
    fontFamily: "AvenirNextCyr-Medium",
  },
  photosContainer: {
    height: 40,
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
    backgroundColor: Colors.primary,
    marginRight: 10,
  },
  buttonText: {
    fontFamily: "AvenirNextCyr-Thin",
    color: "white",
  },
  label: {
    fontSize: 16,
    color: Colors.black,
    fontFamily: "AvenirNextCyr-Medium",
    //marginTop:5
  },
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    //borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: "5%",
    borderRadius: 10,
  },
  icon: {
    marginRight: 5,
  },
  // label: {
  //   position: 'absolute',
  //   backgroundColor: 'white',
  //   left: 22,
  //   top: 8,
  //   zIndex: 999,
  //   paddingHorizontal: 8,
  //   fontSize: 14,
  // },
  placeholderStyle: {
    fontSize: 14,
    fontFamily: "AvenirNextCyr-Thin",
    color: "grey",
  },
  selectedTextStyle: {
    fontSize: 16,
    fontFamily: "AvenirNextCyr-Thin",
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  labelText: {
    fontFamily: "AvenirNextCyr-Medium",
    color: Colors.black,
    fontSize: 16,
  },
  inputContainer: {
    borderColor: "grey",
    borderWidth: 1,
    backgroundColor: "white",
    height: 40,
    marginBottom: 5,
    //padding:5,
    fontFamily: "AvenirNextCyr-Thin",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  input2: {
    fontFamily: "AvenirNextCyr-Thin",
    padding: 8,
    flex: 1,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "AvenirNextCyr-Medium",
  },
  submitButton1: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    // marginTop: 2,
  },
  elementsView: {
    backgroundColor: "white",
    margin: 5,
    //borderColor: 'black',
    //flexDirection: 'row',
    //justifyContent: 'space-between',
    //alignItems: 'center',
    marginBottom: 16,
    borderRadius: 8,
    elevation: 5,
    ...globalStyles.border,
    padding: 16,
    //borderColor: '#fff',
    //borderWidth: 0.5
  },
  ProductListContainer: {
    flex: 1,
    marginVertical: "4%",
  },
  imageView: {
    width: 70,
    height: 70,
    // borderRadius: 40,
    // marginTop: 20,
    // marginBottom: 10
  },
  noProductsContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  noProductsText: {
    fontSize: 16,
    color: "gray",
    fontFamily: "AvenirNextCyr-Thin",
    textAlign: "center",
    marginTop: 80,
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
  input: {
    flex: 1,
    fontSize: 16,
    marginRight: 10,
  },
  searchButton: {
    padding: 5,
  },
  selectedStyle: {
    marginBottom: "5%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 14,
    backgroundColor: "white",
    shadowColor: "#000",
    marginTop: "2%",
    marginRight: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  textSelectedStyle: {
    marginRight: 5,
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  item: {
    padding: 17,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  recoredbuttonStyle: {
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    marginHorizontal: 5,
    shadowRadius: 2,
    elevation: 5,
    ...globalStyles.border,
    backgroundColor: 'white',
    justifyContent: 'space-between',
    borderRadius: 20,
    marginBottom: 10,
    marginTop: 8,
    padding: '4%'

  },
});

export default CreateRFQ;
