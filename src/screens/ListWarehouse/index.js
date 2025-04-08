import {
    StyleSheet,
    Text,
    View,
    Image,
    FlatList,
    ActivityIndicator,
    TouchableOpacity,
    Keyboard,
    TextInput,
    Modal,
    Pressable,
    Alert,
  } from "react-native";
  import React, { useState, useEffect, useContext } from "react";
  import AntDesign from "react-native-vector-icons/AntDesign";
  import Colors from "../../constants/Colors";
  import { useFocusEffect } from "@react-navigation/native";
  import { Dropdown } from "react-native-element-dropdown";
  import Icon from "react-native-vector-icons/FontAwesome";
  import globalStyles from "../../styles/globalStyles";
  import { AuthContext } from "../../Context/AuthContext";
  import AsyncStorage from "@react-native-async-storage/async-storage";
  import { FAB } from "react-native-paper";
  import { AnimatedFAB } from "react-native-paper";
  import { Searchbar, Checkbox, RadioButton, Snackbar } from "react-native-paper";
  import { navigate } from "../../navigation/RootNavigation";
  import Animated from "react-native-reanimated";

  
  const ListWarehouse = ({ navigation, visible, extended, label, animateFrom }) => {
    const { token, userData } = useContext(AuthContext);
  
    const [masterData, setMasterData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [isModalVisible, setModalVisible] = useState(false);
    const [categoryData, setCategoryData] = useState([]);
    const [brandData, setBrandData] = useState([]);
  
    const [brandResponse, setBrandResponse] = useState([]);
    const [selectedBrand, setSelectedBrand] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedSubCategory, setSubSelectedCategory] = useState("");
  
    const [isFocus3, setIsFocus3] = useState(false);
    const [productCount, setProductCount] = useState("");
  
    const [isExtended, setIsExtended] = useState(true);
    const [SnackBarVisible, setSnackBarVisible] = useState(false);
    const onToggleSnackBar = () => setSnackBarVisible(!SnackBarVisible);
    const onDismissSnackBar = () => setSnackBarVisible(false);
  
    const isIOS = Platform.OS === "ios";
  
    const onScroll = ({ nativeEvent }) => {
      const currentScrollPosition =
        Math.floor(nativeEvent?.contentOffset?.y) ?? 0;
  
      setIsExtended(currentScrollPosition <= 0);
    };
  
    const fabStyle = { [animateFrom]: 16 };
  
    useFocusEffect(
      React.useCallback(() => {
        loadAllProduct();
      }, [])
    );
  
    useEffect(() => {
      getBrand();
    }, []);
  
    useEffect(() => {
      getCategory();
    }, []);
  
    const loadAllProduct = async (id) => {
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
          "https://gsidev.ordosolution.com/api/warehouse/",
          requestOptions
        );
        const result = await response.json();
  
        // Update the product count
        const pc = result.length;
        setProductCount(pc);

        console.log("jfsvdnd",result)
  
        // Store the result in AsyncStorage
        await AsyncStorage.setItem("productData", JSON.stringify(result));
  
        // Update state variables
        setMasterData(result);
        setFilteredData(result);
        setLoading(false);
      } catch (error) {
        console.log("error", error);
      }
    };
  
    const searchProduct = (text) => {
      // Check if searched text is not blank
      if (text) {
        const newData = masterData.filter(function (item) {
          const itemData =
            item?.name 
              ? item?.name.toUpperCase()
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
  
    const getBrand = async (userId) => {
      // Fetch category list API
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
          "https://gsidev.ordosolution.com/api/product/",
          requestOptions
        );
        const result = await response.json();
  
        console.log("brand", result);
        setBrandResponse(result);
        // const allOption = { label: 'All', value: 'all' };
        const transformedData = result.map((item) => ({
          label: item.brand.brand_name,
          value: item.brand.id,
        }));
  
        const uniqueData = transformedData.filter((item, index, array) => {
          return array.findIndex((i) => i.label === item.label) === index;
        });
  
        // console.log("dhalfahljfahfaiiq", uniqueData);
        setBrandData(uniqueData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    // console.log("fgdfdsf", brandData)
  
    const getCategory = async (brandId) => {
      // Fetch category list API
      console.log("get category", brandId);
  
      let apiUrl;
      let requestData;
  
      if (userData && userData.dealer_name === "Nikai FMCG") {
        // Use the new API and payload for 'Nikai Fmcg'
        apiUrl = "https://dev.ordo.primesophic.com/get_category.php";
        requestData = {
          __user_id__: userData.id, // Use the userId from userData
        };
      } else {
        // Use the regular API and payload
        apiUrl = "https://dev.ordo.primesophic.com/get_category_from_brand.php";
        requestData = {
          __brand_id__: brandId,
        };
      }
  
      try {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        });
        const jsonData = await response.json();
  
        const transformedData = jsonData.category_list.map((item) => ({
          label: item.name,
          value: item.id,
        }));
  
        setCategoryData(transformedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    console.log("select brand", selectedBrand);
  
    const handleSubmit = async () => {
      try {
        // Your asynchronous code here
        const filteredObjects = brandResponse.filter(
          (obj) => obj.brand.id === selectedBrand
        );
        console.log("filtered response:", filteredObjects);
        setFilteredData(filteredObjects);
      } catch (error) {
        console.error("Error in handleSubmit:", error);
      }
      setSelectedBrand("");
      toggleModal();
    };
  
    console.log("selected", selectedCategory);
  
    const toggleModal = () => {
      setModalVisible(!isModalVisible);
      setSelectedBrand("");
      setSelectedCategory("");
      setSubSelectedCategory("");
    };
  
    const handleDelete = (id) => {
      // Ask for confirmation
      console.log("supp id", id);
      console.log("tokennn", userData.token);
      Alert.alert(
        "Confirmation",
        "Are you sure you want to delete this Product?",
        [
          {
            text: "Cancel",
            style: "cancel",
            onPress: () => {
              setLoading(false);
            },
          },
          {
            text: "OK",
            onPress: () => {
              setLoading(true);
  
              var myHeaders = new Headers();
              myHeaders.append("Content-Type", "application/json");
              myHeaders.append("Authorization", `Bearer ${userData.token}`);
  
              var requestOptions = {
                method: "DELETE",
                headers: myHeaders,
                redirect: "follow",
              };
  
              fetch(
                `https://gsidev.ordosolution.com/api/product/${id}/`,
                requestOptions
              )
                .then((response) => {
                  if (response.status === 204) {
                    // Successful deletion
                    setLoading(false);
                    console.log("Product deleted successfully");
                    onToggleSnackBar();
                    loadAllProduct();
                    // You can perform additional actions here if needed
                  } else if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                  } else {
                    return response.json();
                  }
                })
                .then(async (result) => {
                  if (result) {
                    console.log("testttttt", result);
                  }
                })
                .catch((error) => {
                  setLoading(false);
                  console.error("Error in delete product", error);
                });
            },
          },
        ],
        { cancelable: false }
      );
    };
  
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <AntDesign name="arrowleft" size={25} color={Colors.black} />
          </TouchableOpacity>
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text
              style={{
                fontSize: 20,
                color: Colors.primary,
                fontFamily: "AvenirNextCyr-Bold",
              }}
            >
              Warehouses
            </Text>
          </View>
          {/* <TouchableOpacity
            style={styles.filterButton}
            onPress={() => {
              toggleModal();
            }}
          >
            <Icon name="filter" size={20} color={Colors.primary} />
            <Text
              style={{
                fontSize: 10,
                color: Colors.primary,
                fontFamily: "AvenirNextCyr-Medium",
                marginLeft: 5,
              }}
            >
              Filter
            </Text>
          </TouchableOpacity> */}
        </View>
        <Modal
          visible={isModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={toggleModal}
        >
          <TouchableOpacity
            style={styles.modalContainer}
            activeOpacity={1}
            // onPressOut={closeModal}
          >
            <View style={styles.modalContent}>
              <TouchableOpacity style={styles.closeIcon} onPress={toggleModal}>
                <Icon name="times" size={20} color="#000" />
              </TouchableOpacity>
              <View style={styles.modalInnerContent}>
                {/* {userData && userData.dealer_name === 'Nikai Electronics' && ( */}
                <View style={styles.container1}>
                  <Text style={styles.ModalText1}>Select Brand</Text>
                  <Dropdown
                    style={[
                      styles.dropdown,
                      isFocus3 && { borderColor: Colors.primary },
                    ]}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    itemTextStyle={styles.selectedTextStyle}
                    iconStyle={styles.iconStyle}
                    data={brandData}
                    search
                    maxHeight={400}
                    labelField="label"
                    valueField="value"
                    placeholder={!isFocus3 ? "Select item" : "..."}
                    searchPlaceholder="Search..."
                    value={selectedBrand}
                    onFocus={() => setIsFocus3(true)}
                    onBlur={() => setIsFocus3(false)}
                    onChange={(item) => {
                      setSelectedBrand(item.value);
                      // getCategory(item.value)
                      setIsFocus3(false);
                    }}
                  />
                </View>
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleSubmit}
                >
                  <Text style={styles.submitButtonText}>Apply Filter</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
  
        <ActivityIndicator
          animating={loading}
          color={Colors.primary}
          size="large"
          style={styles.activityIndicator}
        />
  
        <View style={{ flexDirection: "row" }}>
          <View style={styles.modalSearchContainer}>
            <TextInput
              style={styles.input}
              value={search}
              placeholder="Search Warehouse"
              placeholderTextColor="gray"
              onChangeText={(val) => searchProduct(val)}
            />
            <TouchableOpacity style={styles.searchButton}>
              <AntDesign name="search1" size={20} color="black" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={{
              height: 50,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#fff",
              borderRadius: 8,
              paddingHorizontal: 16,
              elevation: 5,
              ...globalStyles.border,
              flex: 0.2,
            }}
            onPress={() => {
              setSearch("");
              setFilteredData(masterData);
              Keyboard.dismiss();
            }}
          >
            <Text
              style={{
                color: Colors.primary,
                fontFamily: "AvenirNextCyr-Medium",
                fontSize: 14,
              }}
            >
              Clear
            </Text>
          </TouchableOpacity>
        </View>
        {/* <Text
          style={{
            color: "#000",
            fontFamily: "AvenirNextCyr-Medium",
            fontSize: 13,
            marginLeft: 3,
          }}
        >
          Products {productCount}
        </Text> */}
  
        <FlatList
          showsVerticalScrollIndicator={false}
          data={filteredData}
          keyboardShouldPersistTaps="handled"
          onScroll={onScroll}
          renderItem={({ item }) => (
            <Pressable
              style={styles.elementsView}
              onPress={() => {
                navigation.navigate("WareDetail", { item: item });
              }}
            >
              <View style={{ flexDirection: "row", justifyContent: "center" }}>
                <View style={{ alignItems: "center" }}>
                  {item.product_image ? (
                    <Animated.Image
                      sharedTransitionTag={`${item.id}`}
                      source={{ uri: item.product_image[0] }}
                      style={styles.imageView}
                    />
                  ) : (
                    <Animated.Image
                      sharedTransitionTag="shared"
                      source={require("../../assets/images/WareImg.png")}
                      style={styles.imageView}
                    />
                  )}
                  {item.stock <= 0 && (
                    <View style={styles.watermarkContainer}>
                      <Text style={styles.watermarkText}>Out of Stock</Text>
                    </View>
                  )}
                </View>
  
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
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text
                      style={{
                        color: "red",
                        fontSize: 14,
                        fontFamily: "AvenirNextCyr-Medium",
                        borderBottomColor: "grey",
                        borderBottomWidth: 0.5,
                      }}
                    >
                      {item.name}
                    </Text>
                    {/* <Text
                      style={{
                        color: "black",
                        fontSize: 12,
                        fontFamily: "AvenirNextCyr-Bold",
                      }}
                    >
                      INR {Number(item.product_price)}
                    </Text> */}
                  </View>
                  <Text
                    style={{
                      color: Colors.primary,
                      fontSize: 13,
                      fontFamily: "AvenirNextCyr-Medium",
                      marginTop: 7,
                    }}
                  >
                    {item.location}
                  </Text>
                  {/* <Text style={{ color: 'green', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}>{Number(item.stock) > 0 ? `Current Stock - ${item.stock}` : <Text style={{ color: 'red', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }} >Out of stock</Text>}</Text> */}
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    {item.stock <= 0 ? (
                      <Text
                        style={{
                          color: "red",
                          fontSize: 12,
                          fontFamily: "AvenirNextCyr-Medium",
                        }}
                      >
                        Out of stock
                      </Text>
                    ) : (
                      <Text
                        style={{
                          color: "black",
                          fontSize: 12,
                          fontFamily: "AvenirNextCyr-Medium",
                        }}
                      >
                        <Text style={{ fontFamily: "AvenirNextCyr-Medium" }}>
                          Incharge:
                        </Text>
                        {item.manager_id}
                      </Text>
                    )}
{/*   
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <AntDesign
                        name={"edit"}
                        size={18}
                        onPress={() =>
                          navigation.navigate("Warehouse", { item: item })
                        }
                      />
                      <AntDesign
                        name={"delete"}
                        size={18}
                        onPress={() => {
                          handleDelete(item.id);
                        }}
                      />
                    </View> */}
                  </View>
                </View>
              </View>
            </Pressable>
          )}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={() => (
            <View style={styles.noProductsContainer}>
              <Text style={styles.noProductsText}>No Products Available</Text>
            </View>
          )}
        />
        <AnimatedFAB
          label={"Warehouse  "}
          icon={(name = "plus")}
          color={"white"}
          style={styles.fabStyle}
          fontFamily={"AvenirNextCyr-Medium"}
          extended={isExtended}
          // onPress={() => console.log('Pressed')}
          visible={visible}
          animateFrom={"right"}
          iconMode={"static"}
          onPress={() => navigation.navigate("Warehouse")}
        />
        <Snackbar
          visible={SnackBarVisible}
          onDismiss={onDismissSnackBar}
          style={{ backgroundColor: "white" }}
          duration={3000}
        >
          <Text style={{ fontFamily: "AvenirNextCyr-Medium" }}>
            Product Deleted successfully !
          </Text>
        </Snackbar>
      </View>
    );
  };
  
  export default ListWarehouse;
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 24,
      paddingBottom: 0,
      backgroundColor: "white",
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 5,
      marginBottom: 7,
    },
  
    filterButton: {
      flexDirection: "column",
      alignItems: "center",
    },
    activityIndicator: {
      flex: 1,
      alignSelf: "center",
      height: 100,
      position: "absolute",
      top: "30%",
    },
    elementsView: {
      backgroundColor: "white",
      margin: 5,
      marginBottom: 16,
      borderRadius: 8,
      elevation: 5,
      ...globalStyles.border,
      padding: 16,
    },
    imageView: {
      width: 80,
      height: 80,
      resizeMode: "contain",
    },
    elementText: {
      fontSize: 15,
      fontFamily: "AvenirNextCyr-Bold",
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
    },
    imageText: {
      fontSize: 15,
      fontFamily: "AvenirNextCyr-Medium",
      color: "black",
    },
    searchContainer: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderColor: "lightgray",
      borderRadius: 5,
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
      backgroundColor: "green",
      paddingVertical: 10,
      paddingHorizontal: 20,
  
      height: 40,
      marginLeft: 10,
    },
    saveButtonView: {
      borderRadius: 5,
      backgroundColor: Colors.primary,
      paddingVertical: 10,
      paddingHorizontal: 20,
      height: 40,
      marginLeft: 10,
    },
    deleteButtonView: {
      borderRadius: 5,
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
    },
    buttonText: {
      color: "blue",
      fontFamily: "AvenirNextCyr-Medium",
    },
    sendButton: {
      color: "white",
      fontFamily: "AvenirNextCyr-Medium",
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
    searchModal: {
      backgroundColor: "white",
      padding: 20,
      width: "90%",
      marginHorizontal: 10,
      borderRadius: 10,
      elevation: 5,
      ...globalStyles.border,
      marginVertical: 100,
    },
    modalSearchContainer: {
      flex: 0.8,
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderColor: "lightgray",
      borderRadius: 5,
      paddingHorizontal: 10,
      marginBottom: 10,
      marginRight: 10,
    },
    modalTitle: {
      fontSize: 16,
      color: "black",
      fontFamily: "AvenirNextCyr-Bold",
    },
    label: {
      position: "absolute",
      backgroundColor: "white",
      left: 22,
      top: 8,
      zIndex: 999,
      paddingHorizontal: 8,
      fontSize: 6,
      fontFamily: "AvenirNextCyr-Medium",
    },
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
      backgroundColor: "#fff",
      padding: 20,
      borderRadius: 8,
      width: "90%", // Adjust the width as needed, for example '90%'
      alignSelf: "center", // Center the modal content horizontally
    },
  
    closeIcon: {
      position: "absolute",
      top: 0, // Set the top offset to 0 (right above the modal content)
      right: 5,
      padding: 10,
    },
    modalInnerContent: {
      marginTop: 15, // Add a margin to separate the icon from the modal content
    },
    ModalText1: {
      color: "#000000",
      textAlign: "left",
      fontSize: 15,
      fontFamily: "AvenirNextCyr-Bold",
      marginLeft: 1,
    },
    container1: {
      backgroundColor: "white",
      padding: 16,
      width: "100%", // Adjust the width as needed, for example '90%'
      alignSelf: "center", // Center the container horizontally within the modal
    },
  
    dropdown: {
      height: 50,
      borderColor: "gray",
      borderWidth: 0.5,
      borderRadius: 8,
      paddingHorizontal: 8,
      width: "100%", // Set the desired width for the dropdown, for example '100%' to match the parent container
    },
  
    icon1: {
      marginRight: 5,
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
      fontFamily: "AvenirNextCyr-Medium",
    },
    selectedTextStyle: {
      fontSize: 16,
      fontFamily: "AvenirNextCyr-Medium",
    },
    iconStyle: {
      width: 20,
      height: 20,
    },
    inputSearchStyle: {
      height: 40,
      fontSize: 16,
      fontFamily: "AvenirNextCyr-Medium",
    },
    submitButton: {
      backgroundColor: Colors.primary,
      borderRadius: 8,
      paddingVertical: 12,
      alignItems: "center",
      marginTop: 8,
      marginLeft: 15,
      marginRight: 15,
    },
    submitButtonText: {
      color: "#fff",
      fontSize: 16,
      fontFamily: "AvenirNextCyr-Bold",
    },
    noProductsContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    noProductsText: {
      fontSize: 16,
      color: "gray",
      fontFamily: "AvenirNextCyr-Medium",
      textAlign: "center",
      marginTop: 80,
    },
    fab: {
      position: "absolute",
      margin: 20,
      right: 0,
      bottom: 0,
      backgroundColor: Colors.primary,
      fontFamily: "AvenirNextCyr-Medium",
    },
    fabStyle: {
      borderRadius: 50,
      position: "absolute",
      margin: 10,
      right: 0,
      bottom: 0,
      backgroundColor:Colors.primary,
    },
    watermarkContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(255, 255, 255, 0.7)",
    },
    watermarkText: {
      fontSize: 20,
      color: "#9B5B79",
      fontFamily: "AvenirNextCyr-Bold",
    },
  });
  