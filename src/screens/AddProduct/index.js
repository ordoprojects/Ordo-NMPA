import {
  Alert,
  Text,
  View,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
  SafeAreaView,
  Pressable,
  FlatList,
  ScrollView
} from "react-native";
import styles from "./style";
import React, { useContext, useState, useEffect } from "react";
import AntDesign from "react-native-vector-icons/AntDesign";
import Colors from "../../constants/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { AuthContext } from "../../Context/AuthContext";
import moment from "moment";
import { ProgressDialog } from "react-native-simple-dialogs";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { cameraPermission } from "../../utils/Helper";
import ImageResizer from "@bam.tech/react-native-image-resizer";
import RNFS from "react-native-fs";
import { Dropdown } from "react-native-element-dropdown";
import globalStyles from "../../styles/globalStyles";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Entypo from "react-native-vector-icons/Entypo";
import { Searchbar, Checkbox, RadioButton ,TextInput as TextInput1,} from "react-native-paper";
import { hs, vs, ms } from "../../utils/Metrics";
import DatePicker from 'react-native-date-picker'

const AddProduct = ({ navigation }) => {
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState({});
  const [cartCount, setCartCount] = useState(0);

  const [masterData, setMasterData] = useState([]);
  const [loading, setLoading] = useState(false);

  const dataa = [
    { label: "Warehouse 1", value: "W1" },
    { label: "Warehouse 2", value: "W2" },
    { label: "Warehouse 3", value: "W3" },
  ];

  const rooms = [
    { label: "Room 1", value: "R1" },
    { label: "Room 2", value: "R2" },
    { label: "Room 3", value: "R3" },
  ];

  const shelf = [
    { label: "Shelf 1", value: "S1" },
    { label: "Shelf 2", value: "S2" },
    { label: "Shelf 3", value: "S3" },
  ];

  const bin = [
    { label: "Bin 1", value: "B1" },
    { label: "Bin 2", value: "B2" },
    { label: "Bin 3", value: "B3" },
  ];

  const transactionTypes = [
    { label: 'Select Transaction Type', value: '' },
    { label: 'Receive', value: 'receive' },
    { label: 'Sell', value: 'sell' },
    { label: 'Return', value: 'return' },
    { label: 'Adjust', value: 'adjust' },
  ];

  const { token, dealerData, tourPlanId } = useContext(AuthContext);
  const [data, setData] = useState(false);
  const [noData, setNoData] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const [value, setValue] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [date, setDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const [modalVisible, setModalVisible] = useState(false);
  const { userData } = useContext(AuthContext);
  const [addedItems, setAddedItems] = useState([]);

  useEffect(() => {
    loadAllProduct();
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
        "https://gsidev.ordosolution.com/api/product/",
        requestOptions
      );
      const result = await response.json();

      // Update the product count
      //   const pc = result.length;
      //   setProductCount(pc);

      // Store the result in AsyncStorage
      await AsyncStorage.setItem("productData", JSON.stringify(result));

      // Update state variables
      setMasterData(result);
      setFilteredData(result);
      setLoading(false);

      //   console.log("Product Count:", productCount);
      console.log("Product Data:", result);
    } catch (error) {
      console.log("error", error);
    }
  };

  const searchProduct = (text) => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource
      // Update FilteredDataSource
      const newData = masterData.filter(function (item) {
        const itemData =
          item?.description && item?.name
            ? item?.description.toUpperCase() + item?.name.toUpperCase()
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

  const handleAddProduct = () => {
    // Perform your "ADD" action here, such as adding the product to a cart or database.

    // Display an alert message when the product is successfully added.
    Alert.alert("Success", "Product added successfully", [
      {
        text: "OK",
        onPress: () => {
          // Add any additional logic you need here after the user dismisses the alert.
        },
      },
    ]);
  };

  const handlePress = () => {
    setFilteredData(masterData);
    setModalVisible(true);
  };

  // console.log("tour plan id", tourPlanId, dealerData?.id, token);

  const getData = () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      __user_id__: token,
      __account_id__: dealerData?.id,
      __tour_plan_id__: tourPlanId,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(
      "https://dev.assure.ordosolution.com/get_miscellaneous.php",
      requestOptions
    )
      .then((response) => response.json())
      .then((res) => {
        // console.log("payment history details", res);
        if (
          Array.isArray(res?.miscellaneous_array) &&
          res?.miscellaneous_array.length > 0
        ) {
          setNoData(false);
          setData(res?.miscellaneous_array);
        } else {
          setNoData(true);
        }
      })
      .catch((error) => console.log("api error", error));
  };

  

  useFocusEffect(
    React.useCallback(() => {
      getData();
    }, [])
  );


  const renderItem = ({ item, index }) => {
    //let color = item.status == 'Approved' ? 'green' : item.status == 'Pending' ? 'orange' : 'red';
    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => navigation.navigate("MiscTaskDetails", { item: item })}
        activeOpacity={0.5}
      >
        <View style={styles.orderDataContainer}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Image
              style={{
                marginRight: 10,
                height: 15,
                width: 15,
                resizeMode: "contain",
              }}
              source={require("../../assets/images/document2.png")}
            />
            <Text style={styles.title}>{item?.name}</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 3,
            }}
          >
            <Image
              style={{
                marginRight: 10,
                height: 15,
                width: 15,
                resizeMode: "contain",
              }}
              source={require("../../assets/images/duration.png")}
            />
            <Text style={{ ...styles.text, fontFamily: "AvenirNextCyr-Medium" }}>
              {item?.purpose_of_visit}
            </Text>
          </View>
          {/* <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 3,
                    }}>
                        <Image
                            style={{ marginRight: 10, height: 15, width: 15, resizeMode: 'contain' }}
                            source={require('../../assets/images/amount.png')} />
                        <Text style={{ ...styles.text, fontFamily: 'AvenirNextCyr-Medium' }}>{Number(item?.amount)} INR</Text>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 3,
                    }}>
                        <Image
                            style={{ marginRight: 10, height: 15, width: 15, resizeMode: 'contain' }}
                            source={require('../../assets/images/duration.png')} />
                        <Text style={{ ...styles.text, fontWeight: '500' }}>{moment(item.sortedarray).format('DD-MM-YYYY')}</Text>
                    </View> */}
        </View>
      </TouchableOpacity>
    );
  };

  //no data found
  const noDataFound = () => {};

  //Add misc Task values
  //miscellaneous task hooks value
  const [mtask, setMTask] = useState("");
  const [mRemarks, setMRemarks] = useState("");
  const [isModalVisible2, setModalVisible2] = useState("");
  const [base64img, setBase64img] = useState("");

  const checkPermission = async () => {
    let PermissionDenied = await cameraPermission();
    if (PermissionDenied) {
      console.log("camera permssion granted");
      handleCamera();
    } else {
      console.log("camera permssion denied");
      //requestStoragePermission();
    }
  };

  const clearModalValue = () => {
    setMTask("");
    setMRemarks("");
    setBase64img("");
  };

  const handleCamera = async () => {
    // setModalVisible1(false);
    const res = await launchCamera({
      mediaType: "photo",
    });
    console.log("response", res.assets[0].uri);
    imageResize(res.assets[0].uri, res.assets[0].type);
  };
  const handleGallery = async () => {
    // setModalVisible1(false);
    const res = await launchImageLibrary({
      mediaType: "photo",
    });
    console.log("response", res.assets[0].uri);
    imageResize(res.assets[0].uri, res.assets[0].type);
  };

  const imageResize = async (img, type) => {
    ImageResizer.createResizedImage(img, 300, 300, "JPEG", 50)
      .then(async (res) => {
        console.log("image resize", res);
        RNFS.readFile(res.path, "base64").then((res) => {
          //console.log('base64', res);
          //uploadImage(res)
          setBase64img(`data:${type};base64,${res}`);
        });
      })
      .catch((err) => {
        console.log(" img resize error", err);
      });
  };

  //Miscellaneous task
  const saveMiscellaneous = () => {
    if (mtask) {
      setModalVisible2(false);
      console.log("data is valid");
      //console.log("m type of task", mtask)
      //console.log("m remarks", mRemarks)
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "text/plain");

      let raw = {
        __user_id__: token,
        __purpose_of_visit__: mtask,
        __remarks__: mRemarks,
        __account_id_c__: dealerData?.id,
        __tour_plan_id__: tourPlanId,
      };

      if (base64img) {
        raw = {
          ...raw,
          __miscellaneous_image__: base64img,
          __image_name__: `${Date.now()}.png`,
        };
      }

      console.log("body", raw);

      console.log(raw);
      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(raw),
        redirect: "follow",
      };
      fetch(
        "https://dev.assure.ordosolution.com/set_miscellaneous.php",
        requestOptions
      )
        .then((response) => response.json())
        .then((res) => {
          console.log("api res 1234", res);
          getData();
          // if (res?.status == 'success') {
          //     Alert.alert('Miscellaneous Task', 'Data saved successfully', [
          //         { text: 'OK', onPress: () => getData() }
          //     ])
          // }
        })
        .catch((error) => console.log("misc task api error", error));
    } else {
      Alert.alert("Warning", "Please fill all the details");
    }
  };

  const deleteProduct = () => {
    setSelectedItem({});
  };

  const InputWithLabel = ({ title, value, onPress }) => {
    return (
      <View>
        <Pressable style={{ ...styles.inputContainer1 }} onPress={onPress} >
          <Image style={{ width: 20, height: 20, marginLeft: 10 }} source={require("../../assets/images/calendar.png")}></Image>
          <Text style={styles.input2}>{value ? moment(value).format('DD-MM-YYYY') : 'Select date'}</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.rowContainer}>
        <View style={{ ...styles.headercontainer }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <AntDesign name="arrowleft" size={25} color={Colors.black} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Choose details</Text>
          </View>
          {/* <TouchableOpacity onPress={() => {
                        clearModalValue();
                        setModalVisible2(true);
                    }} >
                        <AntDesign name='plus' size={20} color={Colors.primary} />

                        <Text style={{ fontSize: 10, fontFamily: 'AvenirNextCyr-Medium', color: Colors.primary }}>Add</Text>
                    </TouchableOpacity> */}

          {/* <TouchableOpacity
                        onPress={() => {
                            clearModalValue();
                            setModalVisible2(true);
                        }}
                        style={{
                            backgroundColor: Colors.primary,
                            borderRadius: 5,
                            paddingVertical: 5,
                            paddingHorizontal: 20,
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                    >
                        <AntDesign name='plus' size={20} color='white' />
                        <Text style={{ fontSize: 14, color: 'white', fontFamily: 'AvenirNextCyr-Medium', marginLeft: 5 }}>
                            Add
                        </Text>
                    </TouchableOpacity> */}

          <TouchableOpacity
            style={{
              backgroundColor: Colors.primary,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 10,
              paddingVertical: "2%",
              paddingHorizontal: "2%",
            }}
            onPress={handlePress}
          >
            <Text style={{ fontFamily: "AvenirNextCyr-Medium", color: "white" }}>
              Choose Product
            </Text>
          </TouchableOpacity>
        </View>

        {Object.keys(selectedItem).length !== 0 && (
          <Pressable style={[styles.elementsView, { marginTop: "5%" }]}>
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
              {selectedItem.product_image ? (
                <Image
                  source={{ uri: selectedItem.product_image }}
                  style={{
                    ...styles.imageView,
                  }}
                />
              ) : (
                <Image
                  source={require("../../assets/images/noImagee.png")}
                  style={{
                    ...styles.imageView,
                  }}
                />
              )}
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
                      fontSize: 12,
                      color: "red",
                      fontFamily: "AvenirNextCyr-Medium",
                      marginBottom: 2,
                    }}
                  >
                    {selectedItem.name}
                  </Text>
                  <TouchableOpacity onPress={() => deleteProduct()}>
                    <MaterialCommunityIcons
                      name="delete"
                      size={18}
                      color={Colors.primary}
                    />
                  </TouchableOpacity>
                </View>
                <Text
                  style={{
                    color: Colors.primary,
                    fontSize: 12,
                    fontFamily: "AvenirNextCyr-Medium",
                    marginTop: 4,
                  }}
                >
                  {selectedItem.description}
                </Text>
                {/* <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}>{selectedItem.brand}</Text> */}
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
                      fontFamily: "AvenirNextCyr-Medium",
                      borderBottomColor: "grey",
                      borderBottomWidth: 0.5,
                    }}
                  >
                    Stock: {selectedItem.stock}
                  </Text>
                </View>
              </View>
            </View>
          </Pressable>
        )}

        <ScrollView>
        <View style={{ marginTop: "5%" }}>
          <Dropdown
            style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={dataa}
            search
            maxHeight={400}
            labelField="label"
            valueField="value"
            placeholder={!isFocus ? "Select Warehouse" : "..."}
            searchPlaceholder="Search..."
            value={value}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={(item) => {
              setValue(item.value);
              setIsFocus(false);
            }}
            renderLeftIcon={() => (
              <AntDesign
                style={styles.icon}
                color={isFocus ? "blue" : "black"}
                name="Safety"
                size={20}
              />
            )}
          />

          <Dropdown
            style={[styles.dropdown, { borderColor: "black" }]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={rooms}
            search
            maxHeight={400}
            labelField="label"
            valueField="value"
            placeholder={!isFocus ? "Select Floor" : "..."}
            searchPlaceholder="Search..."
            value={value}
            onChange={(item) => {
              setValue(item.value);
            }}
            renderLeftIcon={() => (
              <AntDesign style={styles.icon} name="Safety" size={20} />
            )}
          />

      

          <Dropdown
            style={[styles.dropdown, { borderColor: "black" }]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={bin}
            search
            maxHeight={400}
            labelField="label"
            valueField="value"
            placeholder={!isFocus ? "Select bin" : "..."}
            searchPlaceholder="Search..."
            value={value}
            onChange={(item) => {
              setValue(item.value);
            }}
            renderLeftIcon={() => (
              <AntDesign style={styles.icon} name="Safety" size={20} />
            )}
          />

<Dropdown
            style={[styles.dropdown, { borderColor: "black" }]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={transactionTypes}
            search
            maxHeight={400}
            labelField="label"
            valueField="value"
            placeholder={!isFocus ? "Transaction Type" : "..."}
            searchPlaceholder="Search..."
            value={value}
            onChange={(item) => {
              setValue(item.value);
            }}
            renderLeftIcon={() => (
              <AntDesign style={styles.icon} name="Safety" size={20} />
            )}
          />

          {/* <Text style={styles.subTitle}>Login</Text> */}
          <TextInput1
            mode="outlined"
            label="Quantity"
            theme={{ colors: { onSurfaceVariant: "black" } }}
            activeOutlineColor="#4b0482"
            // placeholder="Enter User Name"
            outlineColor="#B6B4B4"
            textColor="black"
            onChangeText={(text) => updateusername(text)}
            autoCapitalize="none"
            blurOnSubmit={false}
            // keyboardType="number-pad"
            returnKeyType="done"
            outlineStyle={{ borderRadius: ms(10) }}
            style={{ marginBottom: "2%", height: 55, backgroundColor: "white"  }}
          />

<TextInput1
            mode="outlined"
            label="Reorder Level"
            theme={{ colors: { onSurfaceVariant: "black" } }}
            activeOutlineColor="#4b0482"
            // placeholder="Enter User Name"
            outlineColor="#B6B4B4"
            textColor="black"
            onChangeText={(text) => updateusername(text)}
            autoCapitalize="none"
            blurOnSubmit={false}
            // keyboardType="number-pad"
            returnKeyType="done"
            outlineStyle={{ borderRadius: ms(10) }}
            style={{ marginBottom: "2%", height: 55, backgroundColor: "white"  }}
          />

          <TextInput1
            mode="outlined"
            label="Reorder Quantity"
            theme={{ colors: { onSurfaceVariant: "black" } }}
            activeOutlineColor="#4b0482"
            // placeholder="Enter User Name"
            outlineColor="#B6B4B4"
            textColor="black"
            onChangeText={(text) => updateusername(text)}
            autoCapitalize="none"
            blurOnSubmit={false}
            // keyboardType="number-pad"
            returnKeyType="done"
            outlineStyle={{ borderRadius: ms(10) }}
            style={{ marginBottom: "2%", height: 55, backgroundColor: "white"  }}
          />


<TextInput1
            mode="outlined"
            label="Cost Price"
            theme={{ colors: { onSurfaceVariant: "black" } }}
            activeOutlineColor="#4b0482"
            // placeholder="Enter User Name"
            outlineColor="#B6B4B4"
            textColor="black"
            onChangeText={(text) => updateusername(text)}
            autoCapitalize="none"
            blurOnSubmit={false}
            // keyboardType="number-pad"
            returnKeyType="done"
            outlineStyle={{ borderRadius: ms(10) }}
            style={{ marginBottom: "2%", height: 55, backgroundColor: "white"  }}
          />

<Dropdown
            style={[styles.dropdown, { borderColor: "black" }]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={transactionTypes}
            search
            maxHeight={400}
            labelField="label"
            valueField="value"
            placeholder={!isFocus ? "Choose Supplier" : "..."}
            searchPlaceholder="Search..."
            value={value}
            onChange={(item) => {
              setValue(item.value);
            }}
            renderLeftIcon={() => (
              <AntDesign style={styles.icon} name="Safety" size={20} />
            )}
          />
<View style={{margin:4}}>
<Text >Expiry Date</Text>

                  <InputWithLabel
                    value={date}
                    onPress={() => {
                      setDatePickerVisible(true);
                    }}

                  />
                  </View>


                {isDatePickerVisible == true ?
                  <DatePicker
                    modal
                    theme='light'
                    mode={'date'}
                    open={isDatePickerVisible}
                    // date={date}
                    format="DD-MM-YYYY"
                    locale='en-GB'
                    // minDate="2022-01-01"
                    // maximumDate={new Date()}
                    onConfirm={(date) => {
                      // const dateString = date.toLocaleDateString();
                      const dateString = moment(date).format('YYYY-MM-DD');
                      setDatePickerVisible(false);
                      // setSelectedDate(dateString);
                      // setDate(date)
                    }}
                    onCancel={() => {
                      setDatePickerVisible(false)
                    }}
                  /> : null}
              {/* </View> */}


          <View>
            <TouchableOpacity
              style={styles.button}
              //  onPress={checkActivePlanExist}
              onPress={handleAddProduct}
              activeOpacity={0.8}
            >
              <Text style={styles.btnText}>ADD</Text>
            </TouchableOpacity>
          </View>
        </View>
        </ScrollView>
      </View>
      {noData && noDataFound()}

      <FlatList
        data={data}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
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
                {/* <TouchableOpacity onPress={() => {
                                    // setSearch('');
                                    setModalVisible(false)
                                }}
                                    style={{ backgroundColor: Colors.primary, paddingVertical: 5, paddingHorizontal: 4, borderRadius: 5, elevation: 5, ...globalStyles.border, flex: 0.5 }}>
                                    <MaterialCommunityIcons name="cart-variant" size={25} color="white" />

                                    {cartCount > 0 && <View style={styles.cartCountContainer}>
                                        <Text style={styles.cartCountText}>{cartCount}</Text>
                                    </View>}
                                </TouchableOpacity> */}
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
            {/* <View style={{height: 40}} /> */}

            <View style={{ width: "100%" }}>
              <Searchbar
                style={{
                  marginHorizontal: "1%",
                  marginVertical: "3%",
                  backgroundColor: "#F3F3F3",
                }}
                placeholder="Search Product"
                onChangeText={(val) => searchProduct(val)}
                value={search}

                //   clearIcon={() => (
                //     <Searchbar.Icon
                //       icon="close"
                //       onPress={clearSearch}
                //       color="#000" // Customize the clear icon color
                //     />
                //   )}
              />

              {/* <TouchableOpacity
                                    style={{ height: 45, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', borderRadius: 8, paddingHorizontal: 16, elevation: 5, flex: 0.2, marginLeft: 10, ...globalStyles.border, }}
                                    onPress={() => {
                                        setSearch('');
                                        setFilteredData(masterData)
                                        Keyboard.dismiss();
                                    }
                                    }
                                >
                                    <Text style={{ color: '#6B1594', fontFamily: 'AvenirNextCyr-Medium', fontSize: 14 }}>Clear</Text>

                                </TouchableOpacity> */}
            </View>

            <FlatList
              showsVerticalScrollIndicator={false}
              data={filteredData}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <View
                  style={{
                    backgroundColor:
                      selectedItem && selectedItem.id === item.id
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
                      style={{ flexDirection: "row", justifyContent: "center" }}
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
                        {item.product_image ? (
                          <Image
                            source={{ uri: item.product_image }}
                            style={{
                              ...styles.imageView,
                            }}
                          />
                        ) : (
                          <Image
                            source={require("../../assets/images/noImagee.png")}
                            style={{
                              ...styles.imageView,
                            }}
                          />
                        )}
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
                            color:
                              selectedItem && selectedItem.id === item.id
                                ? "white"
                                : Colors.primary,
                            fontFamily: "AvenirNextCyr-Medium",
                            marginBottom: 2,
                          }}
                        >
                          {" "}
                          {item.name}
                        </Text>
                        <Text
                          style={{
                            color:
                              selectedItem && selectedItem.id === item.id
                                ? "white"
                                : "gray",
                            fontSize: 12,
                            fontFamily: "AvenirNextCyr-Medium",
                            marginTop: 1,
                          }}
                        >
                          {item.description}
                        </Text>
                        {/* <Text style={{ color: 'green', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}>{Number(item.stock) > 0 ? `Current Stock - ${item.stock}` : <Text style={{ color: 'red', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }} >Out of stock</Text>}</Text> */}
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Text
                            style={{
                              color:
                                selectedItem && selectedItem.id === item.id
                                  ? "white"
                                  : Colors.primary,
                              fontSize: 12,
                              fontFamily: "AvenirNextCyr-Medium",
                            }}
                          >
                            Stock: {item.stock}{" "}
                          </Text>

                          {/* <TouchableOpacity
                                                style={{ justifyContent: 'center', alignItems: 'center', padding: 10, paddingHorizontal: 16, borderRadius: 5, backgroundColor: '#fff', elevation: 5, ...globalStyles.border }}
                                                onPress={() => addProduct(item)}
                                            >
                                                <Text style={{ color: Colors.primary, fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' ,marginLeft:5}}>+Add</Text>
                                            </TouchableOpacity> */}
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
                    {/* <TouchableOpacity
                                                style={{ width:'24%', padding: 10, paddingHorizontal: 10, borderBottomRightRadius: 20,  backgroundColor: item.added ? "gray" : "#50001D", elevation: 5, ...globalStyles.border ,borderTopLeftRadius:10,flexDirection:'row'}}
                                                onPress={() => addProduct(item)
                                                }
                                                disabled={item.added}
                                            >
                             <MaterialCommunityIcons  name="cart-variant" size={20} color="white"/>

                                                <Text style={{ color: 'white', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium'}}>  {item.added ? 'Added ' : 'Add'}</Text>
                                            </TouchableOpacity> */}
                    <TouchableOpacity
                      style={{
                        width: "24%",
                        padding: 10,
                        paddingHorizontal: 10,
                        borderBottomRightRadius: 20,
                        backgroundColor:
                          selectedItem && selectedItem.id === item.id
                            ? "#f2f2f2"
                            : "#50001D",
                        elevation: 5,
                        borderTopLeftRadius: 10,
                        flexDirection: "row",
                      }}
                      onPress={() => {
                        setSelectedItem(item);
                        console.log("selectededded", item);
                      }}
                      disabled={selectedItem && selectedItem.id === item.id}
                    >
                      <MaterialCommunityIcons
                        name="cart-variant"
                        size={20}
                        color={
                          selectedItem && selectedItem.id === item.id
                            ? "#50001D"
                            : "white"
                        }
                      />
                      <Text
                        style={{
                          color:
                            selectedItem && selectedItem.id === item.id
                              ? "#50001D"
                              : "white",
                          fontSize: 12,
                          fontFamily: "AvenirNextCyr-Medium",
                        }}
                      >
                        {selectedItem && selectedItem.id === item.id
                          ? "Added "
                          : "Add"}
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

      <Modal visible={isModalVisible2} animationType="fade" transparent={true}>
        {/* Misc Task Modal */}
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                padding: 20,
                width: "90%",
                marginHorizontal: 10,
                borderRadius: 10,
                elevation: 5,
              }}
            >
              {/* new */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ ...styles.modalTitle, color: Colors.primary }}>
                  Misc. Task
                </Text>
                <TouchableOpacity onPress={() => setModalVisible2(false)}>
                  <AntDesign name="close" size={20} color={`black`} />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 10,
                }}
              ></View>
              <View style={{ flexDirection: "row" }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ ...styles.modalTitle, marginBottom: 5 }}>
                    Type of Task
                  </Text>
                  <TextInput
                    style={styles.cNameTextInput}
                    placeholder="Type of Task"
                    onChangeText={(text) => setMTask(text)}
                    keyboardShouldPersistTaps="always"
                  />
                </View>
              </View>
              <View>
                <Text style={styles.modalTitle}>Upload Image</Text>
                <View style={{ ...styles.buttonview, alignItems: "center" }}>
                  <TouchableOpacity
                    style={{ ...styles.photosContainer, paddingTop: 8 }}
                    onPress={checkPermission}
                  >
                    <AntDesign name="camera" size={25} color={Colors.white} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.photosContainer}
                    onPress={handleGallery}
                  >
                    <Text style={styles.buttonText}>Gallery</Text>
                  </TouchableOpacity>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "flex-end",
                    gap: 15,
                  }}
                >
                  {base64img && (
                    <Image
                      source={{ uri: base64img }}
                      style={styles.imgStyle}
                    />
                  )}
                  {base64img && (
                    <TouchableOpacity
                      style={{ marginRight: 10, marginBottom: 5 }}
                      onPress={() => {
                        setBase64img("");
                      }}
                    >
                      <AntDesign name="delete" size={20} color={`black`} />
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              <Text style={styles.modalTitle}>Remarks</Text>
              {/* new */}
              <TextInput
                multiline={true}
                numberOfLines={10}
                placeholder="Enter Text..."
                style={styles.textarea}
                onChangeText={(val) => {
                  setMRemarks(val);
                }}
                //onChangeText={(text) => this.setState({ text })}
                value={mRemarks}
                keyboardShouldPersistTaps="always"
              />

              <View style={styles.buttonview}>
                <TouchableOpacity
                  style={styles.buttonContainer}
                  onPress={saveMiscellaneous}
                >
                  <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>

              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default AddProduct;
