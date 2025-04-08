import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  FlatList,
  Pressable,
} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import Feather from "react-native-vector-icons/Feather";
import globalStyles from "../../styles/globalStyles";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { AuthContext } from "../../Context/AuthContext";
import { useFocusEffect } from "@react-navigation/native";
import ConvertDateTime from "../../utils/ConvertDateTime";
import Entypo from "react-native-vector-icons/Entypo";

import Colors from "../../constants/Colors";

const SupplierDetails = ({ navigation, route }) => {
  const { item } = route.params;
  const [tabIndex, setTabIndex] = React.useState(0);

  const [isModalVisible2, setModalVisible2] = useState("");
  const [products, setProducts] = useState(route.params?.item.products);

  const [purchase, setPurchase] = useState([]);
  const [filteredPurchase, setFilteredPurchase] = useState([]);

  const [rfq, setRFQ] = useState([]);
  const [filteredRFQ, setFilteredRFQ] = useState([]);
  const [loading, setLoading] = useState(false);


  console.log("item", item?.id);

  const { userData } = useContext(AuthContext);

  const openModal = (itemId) => {
    setModalVisible2(true);
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [userData])
  );

  const fetchData = async () => {
    // SetIsOrderLoading(true);

    setLoading(true);

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${userData.token}`);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    await fetch(
      `https://gsidev.ordosolution.com/api/suppliers/get_supplier_details/?supplier_id=${item?.id}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        setPurchase(result.PO);
        setFilteredPurchase(result.PO);

        setFilteredRFQ(result.RFQ);
        setRFQ(result.RFQ);
      })
      // setData(data);

      .catch((error) => {
        // Handle any errors that occurred during the request
        console.error(error);
      });

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <AntDesign name="arrowleft" size={25} color={Colors.black} />
        </TouchableOpacity>
        <Text style={styles.title}>Supplier Details</Text>

        <TouchableOpacity
          style={{
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => openModal()}
        >
          <Feather name="box" size={25} color={Colors.black} />
          <Text style={{ fontSize: 12 }}>Product</Text>
        </TouchableOpacity>
      </View>
      <View style={{}}>
        <View style={styles.profileContainer}>
          {item.supplier_image ? (
            <Image
              source={{ uri: item.supplier_image }}
              style={{ ...styles.profileImage }}
            />
          ) : (
            <Image
              source={require("../../assets/images/UserAvatar.png")}
              style={{ ...styles.profileImage }}
            />
          )}
          {/* <Image source={require('../../assets/images/UserAvatar.png')} style={styles.profileImage} /> */}
          <Text style={styles.profileText}>{item.full_name}</Text>
        </View>
        <View style={styles.detailContainer}>
          <Text style={styles.label}>Phone:</Text>
          <Text style={styles.text}>{item.phone}</Text>
        </View>
        <View style={styles.detailContainer}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.text}>{item.email}</Text>
        </View>

        <View style={styles.detailContainer}>
          <Text style={styles.label}>Company :</Text>
          <Text style={styles.text}>{item.company}</Text>
        </View>

        <View style={styles.detailContainer}>
          <Text style={styles.label}>Supplier Type:</Text>
          <Text style={styles.text}>{item.supplier_type}</Text>
        </View>

        <View style={styles.detailContainer}>
          <Text style={styles.label}>Website:</Text>
          <Text style={styles.text}>{item.website}</Text>
        </View>
      </View>
      <View style={{ flex: 1 }}>
        <View style={{ marginTop: "2%" }}>
          <SegmentedControl
            values={["Purchase Orders", "RFQ"]}
            selectedIndex={tabIndex}
            onChange={(event) => {
              setTabIndex(event.nativeEvent.selectedSegmentIndex);
            }}
            // onValueChange={(value) => { console.log("testing", value) }}
            segmentedControlBackgroundColor="black"
            tintColor={Colors.primary}
            activeSegmentBackgroundColor={Colors.primary}
            appearance="light"
            activeTextColor="white"
            textColor="black"
            paddingVertical={20}
            style={{ marginHorizontal: "4%", marginVertical: "1%" }}
            fontStyle={{ fontFamily: "AvenirNextCyr-Medium", color: "black" }}
            activeFontStyle={{
              fontFamily: "AvenirNextCyr-Medium",
              color: "white",
            }}
          />
        </View>

        <View>
          {tabIndex === 0 && (
            <FlatList
              data={purchase}
              renderItem={
                (renderItem = ({ item, index }) => {
                  let color =
                    item.status == "Approved"
                      ? "green"
                      : item.status == "Pending"
                      ? "#4169E1"
                      : item.status == "Partially Approved"
                      ? "orange"
                      : "red";
                  // let status = item.status == 'Approved' ? 'Approved' : item.status == 'Pending' ? 'Partially Approval' : 'Rejected';
                  let order = item;
                  return (
                    <TouchableOpacity
                      style={styles.itemContainer}
                      onPress={() =>
                        navigation.navigate("RFQProducts", { item: order })
                      }
                      activeOpacity={0.5}
                    >
                      <View
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                          flex: 0.28,
                        }}
                      >
                        {item.status === "Pending" ? (
                          <Entypo
                            name="back-in-time"
                            size={20}
                            color={Colors.primary}
                          />
                        ) : (
                          <AntDesign
                            name="checkcircleo"
                            color="#004600"
                            size={30}
                          />
                        )}
                        <Text
                          style={{
                            color: Colors.primary,
                            fontFamily: "AvenirNextCyr-Medium",
                          }}
                        >
                          {order?.status}
                        </Text>
                      </View>

                      <View style={{ flex: 1 }}>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              marginBottom: 5,
                            }}
                          >
                            <Image
                              style={{
                                marginRight: 10,
                                height: 15,
                                width: 15,
                                resizeMode: "contain",
                              }}
                              source={require("../../assets/images/user.png")}
                            />
                            <Text
                              style={{
                                fontSize: 14,
                                color: Colors.primary,
                                fontFamily: "AvenirNextCyr-Bold",
                              }}
                            >
                              {order?.supplier_name}
                            </Text>
                          </View>
                        </View>

                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginBottom: 5,
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
                          <Text
                            style={{
                              fontSize: 14,
                              fontFamily: "AvenirNextCyr-Medium",
                            }}
                          >
                            {order?.name}
                          </Text>
                        </View>

                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginTop: 3,
                            justifyContent: "space-between",
                          }}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "space-between",
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
                            <Text
                              style={{
                                fontSize: 14,
                                fontFamily: "AvenirNextCyr-Medium",
                              }}
                            >
                              {ConvertDateTime(order?.created_at).formattedDate}{" "}
                              {ConvertDateTime(order?.created_at).formattedTime}
                            </Text>
                          </View>

                          <Text
                            style={{
                              fontSize: 14,
                              color: "black",
                              fontFamily: "AvenirNextCyr-Medium",
                            }}
                          >
                            Total SKU's : {order?.product_list?.length}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })
              }
              showsVerticalScrollIndicator={false}
            />
          )}
          {tabIndex === 1 && (
            <FlatList
              data={rfq}
              renderItem={
                (renderItem = ({ item, index }) => {
                  let color =
                    item.status == "Approved"
                      ? "green"
                      : item.status == "Pending"
                      ? "#4169E1"
                      : item.status == "Partially Approved"
                      ? "orange"
                      : "red";
                  // let status = item.status == 'Approved' ? 'Approved' : item.status == 'Pending' ? 'Partially Approval' : 'Rejected';
                  let order = item;
                  return (
                    <TouchableOpacity
                      style={styles.itemContainer}
                      onPress={() =>
                        navigation.navigate("RFQProducts", { item: order })
                      }
                      activeOpacity={0.5}
                    >
                      <View
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                          flex: 0.28,
                        }}
                      >
                        {item.status === "Pending" ? (
                          <Entypo
                            name="back-in-time"
                            size={20}
                            color={Colors.primary}
                          />
                        ) : (
                          <AntDesign
                            name="checkcircleo"
                            color="#004600"
                            size={30}
                          />
                        )}
                        <Text
                          style={{
                            color: Colors.primary,
                            fontFamily: "AvenirNextCyr-Medium",
                          }}
                        >
                          {order?.status}
                        </Text>
                      </View>

                      <View style={{ flex: 1 }}>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              marginBottom: 5,
                            }}
                          >
                            <Image
                              style={{
                                marginRight: 10,
                                height: 15,
                                width: 15,
                                resizeMode: "contain",
                              }}
                              source={require("../../assets/images/user.png")}
                            />
                            <Text
                              style={{
                                fontSize: 14,
                                color: Colors.primary,
                                fontFamily: "AvenirNextCyr-Bold",
                              }}
                            >
                              {order?.supplier_name}
                            </Text>
                          </View>
                        </View>

                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginBottom: 5,
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
                          <Text
                            style={{
                              fontSize: 14,
                              fontFamily: "AvenirNextCyr-Medium",
                            }}
                          >
                            {order?.name}
                          </Text>
                        </View>

                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginTop: 3,
                            justifyContent: "space-between",
                          }}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "space-between",
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
                            <Text
                              style={{
                                fontSize: 14,
                                fontFamily: "AvenirNextCyr-Medium",
                              }}
                            >
                              {ConvertDateTime(order?.created_at).formattedDate}{" "}
                              {ConvertDateTime(order?.created_at).formattedTime}
                            </Text>
                          </View>

                          <Text
                            style={{
                              fontSize: 14,
                              color: "black",
                              fontFamily: "AvenirNextCyr-Medium",
                            }}
                          >
                            Total SKU's : {order?.product_list?.length}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })
              }
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </View>

      <Modal visible={isModalVisible2} animationType="fade" transparent={true}>
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
              paddingHorizontal: "3%",
              width: "90%",
              marginHorizontal: "5%",
              borderRadius: 10,
              elevation: 5,
              marginVertical: "10%",
              paddingVertical: "6%",
              maxHeight: "85%",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                marginBottom: 3,
                backgroundColor: "#D3B2CF",
                alignContent: "flex-end",
                borderRadius: 50,
                position: "absolute",
                zIndex: 1,
                right: 10,
                top: 5,
                borderWidth: 5,
                borderColor: "white",
                padding: 2,
              }}
            >
              <TouchableOpacity onPress={() => setModalVisible2(false)}>
                <AntDesign name="close" size={20} color={`white`} />
              </TouchableOpacity>
            </View>
            <View style={[styles.card, { marginBottom: "10%" }]}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingHorizontal: "5%",
                  paddingVertical: "3%",
                  borderBottomWidth: 1,
                  borderBottomColor: "grey",
                }}
              >
                <Text style={styles.cardTitle}>Products</Text>
                <View>
                  <Text style={styles.cardTitle}>#{products.length}</Text>
                </View>
              </View>

              {/* <View style={styles.ProductListContainer}> */}
                <FlatList
                  showsVerticalScrollIndicator={false}
                  data={products}
                  keyboardShouldPersistTaps="handled"
                  // style={{marginBottom:'12%'}}
                  renderItem={({ item }) => (
                    <View style={styles.elementsView}>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "center",
                        }}
                      >
                        <Pressable>
                          {item.product_image &&
                          item.product_image.length > 0 ? (
                            <Image
                              source={{ uri: item.product_image[0] }}
                              style={styles.imageView}
                            />
                          ) : (
                            <Image
                              source={require("../../assets/images/noImagee.png")}
                              style={styles.imageView}
                            />
                          )}
                        </Pressable>
                        <View
                          style={{
                            flex: 1,
                            // borderLeftWidth: 1.5,
                            paddingLeft: 15,
                            marginLeft: 10,
                            // borderStyle: 'dotted',
                            // borderColor: 'grey',
                          }}
                        >
                          {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Text style={{ color: 'red', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium', borderBottomColor: 'grey', borderBottomWidth: 0.5, }}>{item.part_number}</Text>


                                        </View> */}
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                              marginBottom: "1%",
                            }}
                          >
                            <Text
                              style={{
                                color: Colors.primary,
                                fontSize: 14,
                                fontFamily: "AvenirNextCyr-Bold",
                                marginTop: 5,
                              }}
                            >
                              {item?.name}
                            </Text>
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                              }}
                            >
                              {/* <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}>Price :  </Text> */}
                              <Text
                                style={{
                                  color: "black",
                                  fontSize: 14,
                                  fontFamily: "AvenirNextCyr-Bold",
                                }}
                              >
                                INR {parseFloat(item.product_price).toFixed(2)}{" "}
                              </Text>
                            </View>
                          </View>
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              marginTop: "1%",
                            }}
                          >
                            <Text
                              style={{
                                color: "black",
                                fontSize: 12,
                                fontFamily: "AvenirNextCyr-Medium",
                              }}
                            >
                              {item.brand.brand_name}
                            </Text>
                          </View>

                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              marginTop: "1%",
                            }}
                          >
                            <Text
                              style={{
                                color: "black",
                                fontSize: 12,
                                fontFamily: "AvenirNextCyr-Medium",
                              }}
                            >
                              Stock :{" "}
                            </Text>
                            <Text
                              style={{
                                color: "black",
                                fontSize: 12,
                                fontFamily: "AvenirNextCyr-Medium",
                              }}
                            >
                              {item.stock}{" "}
                            </Text>
                          </View>
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
                  keyExtractor={(item) => item.id.toString()}
                  ListEmptyComponent={() => (
                    <View style={styles.emptyListComponent}>
                      <Text
                        style={{
                          fontFamily: "AvenirNextCyr-Medium",
                          fontSize: 16,
                          color: "#bcbcbc",
                        }}
                      >
                        No Products Available.
                      </Text>
                    </View>
                  )}
                />
              {/* </View> */}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: "4%",
    paddingHorizontal: "4%",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    justifyContent: "space-between",
  },
  backButton: {
    marginRight: "3%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.primary,
  },
  profileContainer: {
    alignItems: "center",
    marginTop: "3%",
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 60,
    backgroundColor: "lightgray",
    paddingHorizontal: "3%",
    paddingVertical: "3%",
  },
  profileText: {
    marginTop: "1%",
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: "3%",
    color: Colors.primary,
  },
  detailContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: "6%",
    paddingVertical: "3%",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  label: {
    flex: 1,
    fontWeight: "bold",
    color: Colors.primary,
  },
  text: {
    flex: 2,
    fontSize: 16,
    color: Colors.black,
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: "5%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    justifyContent: "center",
    width: "90%",
  },
  card: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginVertical: "5%",
    backgroundColor: "#F5F5F5",
    // flex:1
  },
  cardTitle: {
    fontSize: 15,
    fontFamily: "AvenirNextCyr-Medium",
    color:Colors.black
  },
  ProductListContainer: {
    // marginVertical: "10%",
    // height:'50%'
  },
  elementsView: {
    ...globalStyles.border,
    padding: "2%",
    borderBottomColor: "grey",
    borderBottomWidth: 0.5,
    flex: 1,
  },
  imageView: {
    width: 80,
    height: 80,
    // borderRadius: 40,
    // marginTop: 20,
    // marginBottom: 10
  },
  emptyListComponent: {
    padding: '5%',
    alignItems: "center",
    justifyContent:"center"
  },
  itemContainer: {
    // marginTop: '1%',
    // borderRadius: 5,
    // backgroundColor: 'red',
    borderBottomWidth: 0.5,
    padding: 10,
    borderbottomColor: "gray",
    // elevation: 5,
    // ...globalStyles.border,
    paddingVertical: "5%",
    paddingHorizontal: "5%",
    flexDirection: "row",
    gap: 20,
  },
});

export default SupplierDetails;
