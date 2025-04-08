import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  Modal,
  TextInput,
  PermissionsAndroid,
  FlatList,
} from "react-native";
import React, { useState, useContext, useEffect } from "react";
import AntDesign from "react-native-vector-icons/AntDesign";
import Colors from "../../constants/Colors";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { cameraPermission } from "../../utils/Helper";
import { AuthContext } from "../../Context/AuthContext";
import ImageResizer from "@bam.tech/react-native-image-resizer";
import RNFS from "react-native-fs";
import globalStyles from "../../styles/globalStyles";
import {
  Searchbar,
  RadioButton,
  TextInput as TextInput1,
} from "react-native-paper";
import { Dropdown } from "react-native-element-dropdown";
import { ms, hs, vs } from "../../utils/Metrics";
import Toast from "react-native-simple-toast";
import LinearGradient from "react-native-linear-gradient";

const WareDetail = ({ navigation, route }) => {
  const { item } = route.params;
  //console.log("dealer data", dealerData);
  // console.log("product data", item);

  const { token, dealerData, userData } = useContext(AuthContext);

  const [isModalVisible, setModalVisible] = useState(false);
  const [cmpdata, setCmpData] = useState([]);
  const [modelNo, setModelNo] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [selectedOption, setSelectedOption] = useState("all");
  const [isFocus3, setIsFocus3] = useState(false);
  const [isFocus2, setIsFocus2] = useState(false);
  const [floorName, setFloorName] = useState("");
  const [shelfName, setShelfName] = useState("");
  const [binName, setBinName] = useState("");
  const [shelfDropdown, setShelfDropdown] = useState([]);
  const [floorDropdown, setfloorDropdown] = useState([]);
  const [shelfDropdownOpt, setShelfDropdownOpt] = useState([]);
  const [floorDropdownOpt, setfloorDropdownOpt] = useState([]);
  const [floorCode, setFloorCode] = useState("");
  const [shelfCode, setShelfCode] = useState("");
  const [binCode, setBinCode] = useState("");
  const [shelfCapacity, setShelfCapacity] = useState("");

  const [desc, setDesc] = useState("");
  const [base64img, setBase64img] = useState("");

  const clearModalValue = () => {
    setFloorName("");
    // setPrice('');
    setQuantity("");
    setPacks("");
    setDesc("");
    setBase64img("");
  };

  const handleSelect = (option) => {
    setSelectedOption(option);
  };

  const FloorDrop = async (id) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${userData.token}`);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(`https://gsidev.ordosolution.com/api/floor/`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        const dropdownOptions = result.map((item) => ({
          label: item.name, // Use 'name' as the label
          value: item.id, // Use 'id' as the value
        }));
        setfloorDropdownOpt(dropdownOptions);
      })
      .catch((error) => console.log("error", error));
  };

  console.log("floor drop", floorDropdownOpt);

  useEffect(() => {
    FloorDrop();
  }, [userData]);

  const ShelfDrop = async (id) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${userData.token}`);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(`https://gsidev.ordosolution.com/api/shelf/`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        const dropdownOptions = result.map((item) => ({
          label: item.name, // Use 'name' as the label
          value: item.id, // Use 'id' as the value
        }));
        setShelfDropdownOpt(dropdownOptions);
      })
      .catch((error) => console.log("error", error));
  };

  console.log("shelf drop", shelfDropdownOpt);

  useEffect(() => {
    ShelfDrop();
  }, []);

  // const getProductCmpRecordId = async () => {
  //     console.log("loading cmp product");
  //     var myHeaders = new Headers();
  //     myHeaders.append("Content-Type", "application/json");

  //     var raw = JSON.stringify({
  //         "__userid__": token,
  //         "__account_id__": dealerData?.account_id_c,

  //     });

  //     var requestOptions = {
  //         method: 'POST',
  //         headers: myHeaders,
  //         body: raw,
  //         redirect: 'follow'
  //     };

  //     fetch("https://dev.ordo.primesophic.com/get_competitor_analysis_product_id.php", requestOptions)
  //         .then(response => response.json())
  //         .then(result => {
  //             console.log("get cmp record id res", result);
  //             result.forEach(itm => {
  //                 if (itm.product_id == item?.id) {
  //                     loadCmpProduct(itm.id);
  //                     return;
  //                 }

  //             });

  //         })
  //         .catch(error => console.log('error', error));
  // }

  console.log("idd", item.id);
  const loadCmpProduct = async (id) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${userData.token}`);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `https://gsidev.ordosolution.com/api/warehouse?warehouse_id=${item.id}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log("product cmp res", result);
        setCmpData(result);
      })
      .catch((error) => console.log("error", error));
  };

  useEffect(() => {
    loadCmpProduct();
  }, []);

  const handleAdd = () => {
    // if (companyName && price && quantity && packs && desc) {
    setModalVisible(false);
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${userData.token}`);

    if (selectedOption === "all") {
      // Construct request for floor API
      var raw = JSON.stringify({
        name: floorName,
        barcode: floorCode,
        warehouse: item.id,
      });

      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };
      console.log("floor", raw);

      fetch("https://gsidev.ordosolution.com/api/floor/", requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log("add floor item res", result);
          Toast.show("Floor added successfully", Toast.LONG);
          // clearModalValue();
        })
        .catch((error) => console.log("error", error));
    } else if (selectedOption === "custom") {
      // Construct request for floor API
      var raw = JSON.stringify({
        name: shelfName,
        barcode: shelfCode,
        capacity: shelfCapacity,
        floor: floorDropdown,
      });
      console.log("shelf", raw);

      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      fetch("https://gsidev.ordosolution.com/api/shelf/", requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log("add shelf item res", result);
          Toast.show("Shelf added successfully", Toast.LONG);
          // clearModalValue();
        })
        .catch((error) => console.log("error", error));
    } else if (selectedOption === "bin") {
      // Construct request for floor API
      var raw = JSON.stringify({
        name: binName,
        barcode: binCode,
        shelf: shelfDropdown,
      });

      console.log("bin", raw);
      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      fetch("https://gsidev.ordosolution.com/api/bin/", requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log("add bin item res", result);
          Toast.show("Bin added successfully", Toast.LONG);
          // clearModalValue();
        })
        .catch((error) => console.log("error", error));
    }
    setFloorName("");
    setFloorCode("");
    setShelfName("");
    setShelfCode("");
    setShelfCapacity("");
    setBinCode("");
    setBinName("");
    setShelfDropdown("");
    setfloorDropdown("");
  };

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
          console.log("base64", res);
          setBase64img(`data:${type};base64,${res}`);
        });
      })
      .catch((err) => {
        console.log(" img resize error", err);
      });
  };

  const transactionTypes = [
    { label: "Receive", value: "receive" },
    { label: "Sell", value: "sell" },
    { label: "Return", value: "return" },
    { label: "Adjust", value: "adjust" },
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ ...styles.headercontainer }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={25} color={Colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Warehouse Detail</Text>
        <Text style={styles.headerTitle}> </Text>
      </View>

      <View style={styles.container}>
        <View style={{ flex: 1 }}>
          <View style={styles.elementsView}>
            <View
              style={{
                flex: 0.3,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {/* <Image source={ {uri:productData[0].product_image}}/> */}
              <Image
                source={require("../../assets/images/WareImg.png")}
                style={{ width: 60, height: 80, resizeMode: "contain" }}
              />
            </View>

            <View style={{ flex: 0.6, justifyContent: "center" }}>
              <Text
                style={{
                  fontFamily: "AvenirNextCyr-Medium",
                  color: Colors.primary,
                  fontSize: 14,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: "AvenirNextCyr-Medium",
                    color: "black",
                  }}
                >
                  Name:
                </Text>{" "}
                {item.name}
              </Text>
              <Text style={styles.text}>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: "AvenirNextCyr-Medium",
                    color: "black",
                  }}
                >
                  Location:
                </Text>{" "}
                {item.location}
              </Text>
              <Text style={styles.text}>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: "AvenirNextCyr-Medium",
                    color: "black",
                  }}
                >
                  Incharge:
                </Text>{" "}
                {item.manager_id}
              </Text>
              {/* <Text style={styles.text}>{item.currency}  {Number(item.product_price)}</Text> */}
              {/* <Text style={styles.text}>{item.description}</Text> */}
            </View>
          </View>

          <View style={styles.checkOutView}>
            <LinearGradient
              colors={Colors.linearColors}
              start={Colors.start}
              end={Colors.end}
              locations={Colors.ButtonsLocation}
              style={{
                backgroundColor: Colors.primary,
                borderColor: Colors.primary,
                borderRadius: 10,
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
                paddingVertical: "1%",
              }}
            >
              <TouchableOpacity
                style={styles.createPlanBtn}
                onPress={() => setModalVisible(true)}
              >
                <Text style={styles.buttonTextStyle}>Manage Space</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
          {/* {cmpdata.length > 0 && <Text style={{
                        fontSize: 16,
                        fontFamily: 'AvenirNextCyr-Medium',
                        color: Colors.black,
                    }}>Warehouse Items History</Text>} */}
          <FlatList
            data={cmpdata}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              //repalcing ' and " values
              return (
                <>
                  {item.floors.map((floor, floorIndex) => (
                    <TouchableOpacity
                      key={floorIndex}
                      style={{
                        flex: 1,
                        backgroundColor: "white",
                        margin: 5,
                        flexDirection: "row",
                        marginBottom: 16,
                        borderRadius: 8,
                        elevation: 5,
                        ...globalStyles.border,
                        padding: 8,
                      }}
                      onPress={() =>
                        navigation.navigate("AssignWarehouse", {
                          floorId: floor?.floor_id,
                        })
                      }
                    >
                      <View
                        style={{
                          flex: 0.4,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Image
                          source={require("../../assets/images/floor.png")}
                          style={{
                            width: 60,
                            height: 80,
                            resizeMode: "contain",
                          }}
                        />
                      </View>

                      <View style={{ flex: 0.8 }}>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          <Text
                            style={{
                              ...styles.text,
                              fontFamily: "AvenirNextCyr-Medium",
                              color: Colors.primary,
                            }}
                          >
                            {item.name}
                          </Text>
                        </View>

                        <View>
                          <Text style={styles.text}>
                            Floor Name: {floor?.floor_name}
                          </Text>
                          <Text style={styles.text}>
                            Shelf Count:{" "}
                            {floor?.shelves.length > 0
                              ? floor.shelves.length
                              : 0}
                          </Text>
                          <Text style={styles.text}>
                            Bin Count:{" "}
                            {floor?.shelves.reduce(
                              (acc, shelf) => acc + shelf.bins.length,
                              0
                            )}
                          </Text>
                        </View>

                        <Text
                          style={{
                            ...styles.text,
                            color: "grey",
                            fontFamily: "AvenirNextCyr-Medium",
                          }}
                        >
                          {item.pack_of}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </>
              );
            }}
          />

          <Modal
            visible={isModalVisible}
            animationType="slide"
            transparent={true}
          >
            {/* Modal content */}
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
                    Manage Space
                  </Text>
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <AntDesign name="close" size={20} color={`black`} />
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 20,
                    justifyContent: "center",
                    marginVertical: "4%",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      // paddingHorizontal: '3%',
                      paddingVertical: "1%",
                      backgroundColor:
                        selectedOption === "all" ? Colors.primary : "white",
                      color: selectedOption === "all" ? "white" : "black",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 30,
                      width: "30%",
                    }}
                  >
                    <RadioButton.Android
                      color={"white"}
                      status={
                        selectedOption === "all" ? "checked" : "unchecked"
                      }
                      onPress={() => handleSelect("all")}
                    />
                    <TouchableOpacity onPress={() => handleSelect("all")}>
                      <Text
                        style={{
                          fontFamily: "AvenirNextCyr-Medium",
                          fontSize: 12,
                          color: selectedOption === "all" ? "white" : "black",
                        }}
                      >
                        FLOOR{" "}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      // paddingHorizontal: '3%',
                      width: "30%",
                      paddingVertical: "1%",
                      backgroundColor:
                        selectedOption === "custom" ? Colors.primary : "white",
                      color: selectedOption === "custom" ? "white" : "black",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 30,
                    }}
                  >
                    <RadioButton.Android
                      color={"white"}
                      status={
                        selectedOption === "custom" ? "checked" : "unchecked"
                      }
                      onPress={() => handleSelect("custom")}
                    />
                    <TouchableOpacity onPress={() => handleSelect("custom")}>
                      <Text
                        style={{
                          fontFamily: "AvenirNextCyr-Medium",
                          fontSize: 12,
                          color:
                            selectedOption === "custom" ? "white" : "black",
                        }}
                      >
                        SHELF{" "}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      // paddingHorizontal: '3%',
                      width: "30%",
                      paddingVertical: "1%",
                      backgroundColor:
                        selectedOption === "bin" ? Colors.primary : "white",
                      color: selectedOption === "bin" ? "white" : "black",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 30,
                    }}
                  >
                    <RadioButton.Android
                      color={"white"}
                      status={
                        selectedOption === "bin" ? "checked" : "unchecked"
                      }
                      onPress={() => handleSelect("bin")}
                    />
                    <TouchableOpacity onPress={() => handleSelect("bin")}>
                      <Text
                        style={{
                          fontFamily: "AvenirNextCyr-Medium",
                          fontSize: 12,
                          color: selectedOption === "bin" ? "white" : "black",
                        }}
                      >
                        BIN{" "}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {selectedOption === "all" && (
                  <View style={{ flexDirection: "column", height: 150 }}>
                    <View style={{}}>
                      <TextInput1
                        mode="outlined"
                        label="Floor Name"
                        theme={{ colors: { onSurfaceVariant: "black" } }}
                        activeOutlineColor="#4b0482"
                        // placeholder="Enter User Name"
                        outlineColor="#B6B4B4"
                        textColor="black"
                        onChangeText={(text) => setFloorName(text)}
                        autoCapitalize="none"
                        blurOnSubmit={false}
                        value={floorName}
                        // keyboardType="number-pad"
                        returnKeyType="done"
                        outlineStyle={{ borderRadius: ms(10) }}
                        style={{
                          marginBottom: "5%",
                          height: 45,
                          backgroundColor: "white",
                        }}
                      />
                    </View>
                    <View style={{}}>
                      <TextInput1
                        mode="outlined"
                        label="Floor Code"
                        theme={{ colors: { onSurfaceVariant: "black" } }}
                        activeOutlineColor="#4b0482"
                        // placeholder="Enter User Name"
                        outlineColor="#B6B4B4"
                        textColor="black"
                        onChangeText={(text) => setFloorCode(text)}
                        autoCapitalize="none"
                        blurOnSubmit={false}
                        value={floorCode}
                        // keyboardType="number-pad"
                        returnKeyType="done"
                        outlineStyle={{ borderRadius: ms(10) }}
                        style={{
                          marginBottom: "5%",
                          height: 45,
                          backgroundColor: "white",
                        }}
                      />
                    </View>
                  </View>
                )}
                {selectedOption === "custom" && (
                  <View style={{ flexDirection: "column", height: 300 }}>
                    <View style={{}}>
                      <TextInput1
                        mode="outlined"
                        label="Shelf Name"
                        theme={{ colors: { onSurfaceVariant: "black" } }}
                        activeOutlineColor="#4b0482"
                        // placeholder="Enter User Name"
                        outlineColor="#B6B4B4"
                        textColor="black"
                        onChangeText={(text) => setShelfName(text)}
                        autoCapitalize="none"
                        blurOnSubmit={false}
                        value={shelfName}
                        // keyboardType="number-pad"
                        returnKeyType="done"
                        outlineStyle={{ borderRadius: ms(10) }}
                        style={{
                          marginBottom: "5%",
                          height: 45,
                          backgroundColor: "white",
                        }}
                      />
                    </View>

                    <TextInput1
                      mode="outlined"
                      label="Shelf Code"
                      theme={{ colors: { onSurfaceVariant: "black" } }}
                      activeOutlineColor="#4b0482"
                      // placeholder="Enter User Name"
                      outlineColor="#B6B4B4"
                      textColor="black"
                      onChangeText={(text) => setShelfCode(text)}
                      autoCapitalize="none"
                      blurOnSubmit={false}
                      value={shelfCode}
                      // keyboardType="number-pad"
                      returnKeyType="done"
                      outlineStyle={{ borderRadius: ms(10) }}
                      style={{
                        marginBottom: "5%",
                        height: 45,
                        backgroundColor: "white",
                      }}
                    />

                    <TextInput1
                      mode="outlined"
                      label="Shelf Capacity"
                      theme={{ colors: { onSurfaceVariant: "black" } }}
                      activeOutlineColor="#4b0482"
                      // placeholder="Enter User Name"
                      outlineColor="#B6B4B4"
                      textColor="black"
                      onChangeText={(text) => setShelfCapacity(text)}
                      autoCapitalize="none"
                      blurOnSubmit={false}
                      value={shelfCapacity}
                      // keyboardType="number-pad"
                      returnKeyType="done"
                      outlineStyle={{ borderRadius: ms(10) }}
                      style={{
                        marginBottom: "5%",
                        height: 45,
                        backgroundColor: "white",
                      }}
                    />

                    <View style={{}}>
                      {/* <Text style={{ ...styles.modalTitle, marginBottom: 5 }}>Floor</Text> */}
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
                        data={floorDropdownOpt}
                        search
                        maxHeight={400}
                        labelField="label"
                        valueField="value"
                        placeholder={!isFocus3 ? "Select Floor" : "..."}
                        searchPlaceholder="Search..."
                        value={floorDropdown}
                        onFocus={() => setIsFocus3(true)}
                        onBlur={() => setIsFocus3(false)}
                        onChange={(item) => {
                          setfloorDropdown(item.value);
                          // getCategory(item.value)
                          setIsFocus3(false);
                        }}
                      />
                    </View>
                  </View>
                )}
                {selectedOption === "bin" && (
                  <View style={{ flexDirection: "column", height: 220 }}>
                    <View style={{}}>
                      <TextInput1
                        mode="outlined"
                        label="Bin Name"
                        theme={{ colors: { onSurfaceVariant: "black" } }}
                        activeOutlineColor="#4b0482"
                        // placeholder="Enter User Name"
                        outlineColor="#B6B4B4"
                        textColor="black"
                        onChangeText={(text) => setBinName(text)}
                        autoCapitalize="none"
                        blurOnSubmit={false}
                        value={binName}
                        // keyboardType="number-pad"
                        returnKeyType="done"
                        outlineStyle={{ borderRadius: ms(10) }}
                        style={{
                          marginBottom: "5%",
                          height: 45,
                          backgroundColor: "white",
                        }}
                      />
                    </View>
                    <View style={{}}>
                      <TextInput1
                        mode="outlined"
                        label="Bin Code"
                        theme={{ colors: { onSurfaceVariant: "black" } }}
                        activeOutlineColor="#4b0482"
                        // placeholder="Enter User Name"
                        outlineColor="#B6B4B4"
                        textColor="black"
                        onChangeText={(text) => setBinCode(text)}
                        autoCapitalize="none"
                        blurOnSubmit={false}
                        value={binCode}
                        // keyboardType="number-pad"
                        returnKeyType="done"
                        outlineStyle={{ borderRadius: ms(10) }}
                        style={{
                          marginBottom: "5%",
                          height: 45,
                          backgroundColor: "white",
                        }}
                      />
                    </View>
                    <View style={{}}>
                      <Dropdown
                        style={[
                          styles.dropdown,
                          isFocus2 && { borderColor: Colors.primary },
                        ]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        itemTextStyle={styles.selectedTextStyle}
                        iconStyle={styles.iconStyle}
                        data={shelfDropdownOpt}
                        search
                        maxHeight={400}
                        labelField="label"
                        valueField="value"
                        placeholder={!isFocus2 ? "Select Shelf" : "..."}
                        searchPlaceholder="Search..."
                        value={shelfDropdown}
                        onFocus={() => setIsFocus2(true)}
                        onBlur={() => setIsFocus2(false)}
                        onChange={(item) => {
                          setShelfDropdown(item.value);
                          // getCategory(item.value)
                          setIsFocus2(false);
                        }}
                      />
                    </View>
                  </View>
                )}

                <View style={styles.buttonview}>
                  <LinearGradient
                    colors={Colors.linearColors}
                    start={Colors.start}
                    end={Colors.end}
                    locations={Colors.ButtonsLocation}
                    style={{
                      backgroundColor: Colors.primary,
                      borderColor: Colors.primary,
                      borderRadius: 10,
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "row",
                      paddingVertical: "1%",
                    }}
                  >
                    <TouchableOpacity
                      style={styles.buttonContainer}
                      onPress={() => {
                        handleAdd();
                      }}
                    >
                      <Text style={styles.buttonText}>Submit</Text>
                    </TouchableOpacity>
                  </LinearGradient>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </View>
    </ScrollView>
  );
};

export default WareDetail;

const styles = StyleSheet.create({
  headercontainer: {
    padding: 10,
    //backgroundColor:'red',
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "AvenirNextCyr-Bold",
    color: Colors.black,
    marginLeft: 10,
    marginTop: 3,
  },
  container: {
    backgroundColor: "white",
    padding: 16,
    flex: 0.9,
  },
  text: {
    fontFamily: "AvenirNextCyr-Medium",
    color:'black'
  },
  checkOutView: {
    marginTop: 20,
    alignSelf: "flex-start",
    marginBottom: 20,
  },
  createPlanBtn: {
    // height: 40,
    //width:40,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: Colors.primary,
    borderRadius: 10,
  },
  buttonTextStyle: {
    color: "#fff",
    fontFamily: "AvenirNextCyr-Medium",
  },
  modalTitle: {
    fontSize: 16,
    color: "black",
    fontFamily: "AvenirNextCyr-Medium",
  },
  cNameTextInput: {
    height: 40,
    borderWidth: 1,
    borderColor: "#B3B6B7",
    padding: 5,
    fontFamily: "AvenirNextCyr-Medium",
    marginBottom: 10,
  },
  buttonview: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  buttonContainer: {
    // height: 40,
    padding: 10,
    borderRadius: 10,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    //marginRight: 10,
    // marginVertical: 10,
    // backgroundColor: Colors.primary
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
    fontFamily: "AvenirNextCyr-Medium",
    color: "white",
  },
  textarea: {
    borderWidth: 0.5,
    borderColor: "black",
    marginBottom: 10,
    borderRadius: 5,
    padding: 10,
    //fontSize: 13,
    textAlignVertical: "top",
    color: "#000",
    fontFamily: "AvenirNextCyr-Medium",
  },
  text: {
    fontFamily: "AvenirNextCyr-Medium",
    color:'black'
  },
  elementsView: {
    backgroundColor: "white",
    margin: 5,
    marginBottom: 16,
    borderRadius: 8,
    elevation: 5,
    ...globalStyles.border,
    padding: 10,
    flexDirection: "row",
  },
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.8,
    borderRadius: 10,
    paddingHorizontal: 8,
    marginTop: "2%",
    width: "100%", // Set the desired width for the dropdown, for example '100%' to match the parent container
  },

  //   icon1: {
  //     marginRight: 5,
  //   },
  //   label: {
  //     position: "absolute",
  //     backgroundColor: "white",
  //     left: 22,
  //     top: 8,
  //     zIndex: 999,
  //     paddingHorizontal: 8,
  //     fontSize: 14,
  //   },
  placeholderStyle: {
    fontSize: 16,
    fontFamily: "AvenirNextCyr-Medium",
    color:'black'
  },
  selectedTextStyle: {
    fontSize: 16,
    fontFamily: "AvenirNextCyr-Medium",
    color:'black'
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    fontFamily: "AvenirNextCyr-Medium",
    color:'black'
  },
});
