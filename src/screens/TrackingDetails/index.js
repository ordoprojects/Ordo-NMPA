import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../Context/AuthContext';
import { View, Dimensions, Text, ScrollView, StyleSheet, TouchableOpacity, Modal, TextInput, Alert, FlatList, Pressable, Linking, SafeAreaView } from 'react-native'
import Colors from '../../constants/Colors';
import { Image } from 'react-native-animatable';
import globalStyles from '../../styles/globalStyles';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { ProgressDialog } from 'react-native-simple-dialogs';
import ConvertDateTime from '../../utils/ConvertDateTime';
import { RadioButton } from 'react-native-paper';
import { WebView } from 'react-native-webview';


const TrackingDetails = ({ navigation, route }) => {

  const orderDetails = route.params?.orderDetails;
  const screen = route.params?.screen;
  const [expanded, setExpanded] = useState(true);
  const [expanded1, setExpanded1] = useState(true);
  const [products, setProducts] = useState(route.params?.orderDetails.product_list);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const { userData } = useContext(AuthContext);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false)
  const [routeDetails, setRouteDetails] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState("");
  const [modalVisibleBill, setModalVisibleBill] = useState(false);

  const toggleDetails = () => {
    setExpanded(!expanded);
  };

  const toggleExpansion1 = () => {
    setExpanded1(!expanded1);
  };

  useEffect(() => {
    // Calculate the total quantity
    const sumQuantity = products?.reduce((accumulator, item) => {
      // Parse item.quantity as an integer; if it's NaN or less than 1, use 1
      const quantity = parseInt(item.qty);
      const validQuantity = isNaN(quantity) || quantity < 1 ? 1 : quantity;

      return accumulator + validQuantity;
    }, 0);

    // Update the totalQuantity state with the calculated sum
    setTotalQuantity(sumQuantity);

    // Calculate the total price
    const totalPrice = products?.reduce((accumulator, item) => {
      // Parse item.quantity and item.price as floats; if they're NaN or less than 0, use 0
      const quantity = parseFloat(item.qty);
      const price = parseFloat(item.price);
      const validQuantity = isNaN(quantity) || quantity < 1 ? 1 : quantity;
      const validPrice = isNaN(price) || price < 0 ? 0 : price;

      return accumulator + validQuantity * validPrice;
    }, 0);

    // Update the totalPrice state with the calculated sum
    setTotalPrice(totalPrice);
  }, [products]);


  useEffect(() => {
    RouteDropdown();
  }, [])

  const RouteDropdown = async (id) => {
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
        "https://gsidev.ordosolution.com/api/route_manifest/get_route_manifest_details/",
        requestOptions
      );
      const result = await response.json();

      setRouteDetails(result);
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleRouteSelection = (item) => {
    setSelectedRoute(item);
    setModalVisible(false);
  };


  return (
    <View style={{ flex: 1, backgroundColor: 'white', padding: 24, }}>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          {/* <AntDesign name='arrowleft' size={25} color={Colors.primary} /> */}
          <Image
            source={require("../../assets/images/Refund_back.png")}
            style={{ height: 30, width: 30, tintColor: Colors.primary }}
          />
        </TouchableOpacity>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          {screen === "PO" ? (<Text style={{ fontSize: 20, color: Colors.primary, fontFamily: 'AvenirNextCyr-Medium' }}>{orderDetails.name} ({orderDetails.supplier_name}-{orderDetails.supplier_id})</Text>) :
            (<Text style={{ fontSize: 20, color: Colors.primary, fontFamily: 'AvenirNextCyr-Medium' }}>{orderDetails.name} ({orderDetails.assignee_name}-{orderDetails.assigne_to})</Text>)}
        </View>
        <View>
        </View>
      </View>


      <View style={[styles.card, { flex: 0 }]}>
        <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', paddingLeft: '5%', paddingVertical: '5%', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#D3D3D3' }} onPress={toggleDetails}>
          <Text style={styles.cardTitle}>Order Details</Text>

          <View style={{ flexDirection: 'row', gap: 15 }}>
            <View style={{
              paddingHorizontal: '4%',
              backgroundColor: orderDetails.status === 'Cancel' || orderDetails.status === 'Cancelled' ? '#d11a2a' : (orderDetails.status === 'Pending' || orderDetails.status === 'Confirmed' ? 'orange' : (orderDetails.status === 'In Transit' ? '#005000' : 'green')),
              borderRadius: 20,
              paddingVertical: '3%',
              paddingHorizontal: '6%'
            }}>
              <Text style={{ fontFamily: 'AvenirNextCyr-Medium', fontSize: 14, color: 'white' }}>
                {orderDetails.status === 'Cancel' ? 'Canceled' : (orderDetails.status === 'In Transit' ? 'In Transit' : orderDetails.status)}
              </Text>
            </View>
            <AntDesign name="down" color="black" size={20} />
          </View>


        </TouchableOpacity>

        {expanded && <View style={styles.expandedContent}>
          <View style={{ paddingHorizontal: '5%', paddingBottom: '2%' }}>

            <View style={styles.row}>
              <Text style={styles.title}>
                Bill to
              </Text>
              <Text style={[styles.value, { textAlign: 'right', width: '72%', fontWeight: '900' }]}>
                {orderDetails?.company_name}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.title}>Order ID</Text>
              <Text style={styles.value}>{orderDetails.name}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.title}>{screen === "PO" ? 'Supplier' : 'Customer'}</Text>
              <Text style={[styles.value, { textAlign: 'right', width: '72%' }]}>{screen === "PO" ? orderDetails.supplier_name : orderDetails.assignee_name}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.title}>Order Placed</Text>
              <Text style={styles.value}>{ConvertDateTime(orderDetails?.created_at).formattedDate} {ConvertDateTime(orderDetails?.created_at).formattedTime}</Text>

            </View>
            <View style={styles.row}>
              <Text style={styles.title}>Created By</Text>
              <Text style={styles.value}>
                {orderDetails?.created_by}
              </Text>
            </View>

            <View style={{ ...styles.row }}>
              <Text style={{ ...styles.title }}>Site Address</Text>
              <Text style={{ ...styles.value, flex: 1, textAlign: 'right' }} numberOfLines={2}>{orderDetails?.site_address}</Text>
            </View>

            <View style={{ ...styles.row }}>
              <Text style={{ ...styles.title }}>Order Image</Text>
              <TouchableOpacity onPress={() => setModalVisibleBill(true)}>
                <Text style={{ ...styles.value, color: 'blue' }}>
                  View
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.row}>
              <Text style={styles.title}>Total Price</Text>
              <Text style={styles.value}>{parseFloat(orderDetails?.total_price).toFixed(2)}</Text>
            </View>
          </View>
        </View>}
      </View>


      <View style={[styles.card, { marginTop: '1%', flex: expanded1 ? 1 : 0 }]}>
        <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: '5%', paddingVertical: '3%', borderBottomWidth: 1, borderBottomColor: 'grey' }} onPress={toggleExpansion1}>
          <Text style={styles.cardTitle}>Products</Text>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View><Text style={styles.cardTitle}>#{products?.length}</Text></View>
            <AntDesign name="down" color="black" size={20} />
          </View>
        </TouchableOpacity>

        {expanded1 && <View style={styles.ProductListContainer}>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={products}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item, index }) => (
              <View style={styles.elementsView}>
                <View
                  style={{ flexDirection: "row", justifyContent: "center" }}
                >
                  <Pressable>
                    {item.product_image && item.product_image.length > 0 ? (
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
                      paddingLeft: 15,
                      marginLeft: 10,
                    }}
                  >
                    <Text
                      style={{
                        color: Colors.primary,
                        fontSize: 14,
                        fontFamily: "AvenirNextCyr-Medium",
                        marginTop: 5,
                      }}
                    >
                      {item?.name}
                    </Text>
                    <Text
                      style={{
                        color: "gray",
                        fontSize: 11,
                        fontFamily: "AvenirNextCyr-Medium",
                      }}
                    >
                      {item?.product_category}{" "}
                    </Text>

                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginTop: "3%",
                        justifyContent: "space-between",
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <Text
                          style={{
                            color: "black",
                            fontSize: 12,
                            fontFamily: "AvenirNextCyr-Medium",
                          }}
                        >
                          Qty :{" "}
                        </Text>
                        <Text
                          style={{
                            color: "black",
                            fontSize: 12,
                            fontFamily: "AvenirNextCyr-Medium",
                          }}
                        >
                          {item?.qty}{" "}
                          {item?.loaded_uom ? item?.loaded_uom : item?.umo}
                        </Text>
                      </View>

                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <Text
                          style={{
                            color: "black",
                            fontSize: 12,
                            fontFamily: "AvenirNextCyr-Medium",
                          }}
                        >
                          Price :{" "}
                        </Text>
                        <Text
                          style={{
                            color: "black",
                            fontSize: 12,
                            fontFamily: "AvenirNextCyr-Medium",
                          }}
                        >
                          {parseFloat(item?.price).toFixed(2)}{" "}
                        </Text>
                      </View>

                    </View>
                    {orderDetails?.status === "Confirmed" &&
                      orderDetails.transportation_type !== "Delivery" && (
                        <>
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                              alignItems: "center"
                            }}
                          >
                            <View style={{
                              flexDirection: "column",
                              alignItems: "center",

                            }}>
                              <Text
                                style={{
                                  color: "black",
                                  fontSize: 12,
                                  fontFamily: "AvenirNextCyr-Medium",
                                  alignSelf: "flex-start"
                                }}
                              >
                                Actual Weight :{item?.total_weight}kg
                              </Text>
                              <Text
                                style={{
                                  color: "black",
                                  fontSize: 12,
                                  fontFamily: "AvenirNextCyr-Medium",
                                  alignSelf: "flex-start"
                                }}
                              >
                                Loaded Weight (Kg) :
                              </Text>

                            </View>
                            <TextInput
                              style={styles.input}
                              placeholder="Weight"
                              placeholderTextColor={"lightgray"}
                              value={item.loaded_weight}
                              keyboardType="numeric"
                              onChangeText={(text) => {
                                const updatedProducts = [...products];
                                updatedProducts[index].loaded_weight = text;
                                setProducts(updatedProducts);
                              }}
                              onSubmitEditing={() => Keyboard.dismiss()}
                              returnKeyType="done"
                            />
                          </View>
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                              alignItems: "center"
                            }}
                          >
                            <View style={{
                              flexDirection: "column",
                              alignItems: "center",

                            }}>
                              <Text
                                style={{
                                  color: "black",
                                  fontSize: 12,
                                  fontFamily: "AvenirNextCyr-Medium",
                                  alignSelf: "flex-start"
                                }}
                              >
                                Bundle/Packets #
                              </Text>

                            </View>
                            <TextInput
                              style={styles.input}
                              placeholder="Bundle"
                              placeholderTextColor={"lightgray"}
                              value={item.loaded_bundle}
                              keyboardType="numeric"
                              onChangeText={(text) => {
                                const updatedProducts = [...products];
                                updatedProducts[index].loaded_bundle = text;
                                setProducts(updatedProducts);
                              }}
                              onSubmitEditing={() => Keyboard.dismiss()}
                              returnKeyType="done"
                            />
                          </View>
                        </>
                      )}
                    {orderDetails.status !== "Confirmed" && (
                      <View>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >

                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            <Text
                              style={{
                                color: "black",
                                fontSize: 12,
                                fontFamily: "AvenirNextCyr-Medium",
                              }}
                            >
                              Loaded Weight :{" "}
                            </Text>

                            <Text
                              style={{
                                color: "black",
                                fontSize: 12,
                                fontFamily: "AvenirNextCyr-Medium",
                              }}
                            >
                              {/* {orderDetails.transportation_type === "Delivery" ? item?.actual_loaded_weight : item?.pickup_loaded_weight} kg */}
                              {item?.loaded_weight} kg

                            </Text>
                          </View>

                        </View>

                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <Text
                            style={{
                              color: "black",
                              fontSize: 12,
                              fontFamily: "AvenirNextCyr-Medium",
                            }}
                          >
                            Loaded Qty :{" "}
                          </Text>

                          <Text
                            style={{
                              color: "black",
                              fontSize: 12,
                              fontFamily: "AvenirNextCyr-Medium",
                            }}
                          >
                            {item?.loaded_qty} {item?.loaded_uom}
                          </Text>
                        </View>


                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <Text
                            style={{
                              color: "black",
                              fontSize: 12,
                              fontFamily: "AvenirNextCyr-Medium",
                            }}
                          >
                            Remaining Qty:{" "}
                          </Text>
                          <Text
                            style={{
                              color: "black",
                              fontSize: 12,
                              fontFamily: "AvenirNextCyr-Medium",
                            }}
                          >
                            {item?.remaining_qty}
                          </Text>
                        </View>
                      </View>
                    )}

                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <Text style={{ color: "black", fontSize: 12 }}>Bundle/Packets: </Text>
                      <Text style={{ color: "black", fontSize: 12 }}>
                        {String(item.loaded_bundle)}
                      </Text>
                    </View>

                  </View>
                </View>
              </View>
            )}
          // keyExtractor={(item) => item.id.toString()}
          />
        </View>}
      </View>


      {screen == "SO" && <View style={{ flex: 1 }}>

        <Text style={{ fontFamily: 'AvenirNextCyr-Medium', fontSize: 17, marginBottom: '3%' }}>Route</Text>

        {!selectedRoute && <TouchableOpacity
          onPress={() => { setModalVisible(true) }}
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 0.5, borderColor: 'black', padding: '2%', borderRadius: 15 }}>
          <View>
            <Text style={{ fontFamily: 'AvenirNextCyr-Medium' }}>Choose route</Text>
          </View>

          <AntDesign style={styles.icon} color="black" name="doubleright" size={20} />
        </TouchableOpacity>}
        {selectedRoute &&

          <TouchableOpacity
            onPress={() => { setModalVisible(true) }}
            style={{ borderWidth: 0.5, borderColor: 'black', padding: '2%', borderRadius: 15, }}>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ color: Colors.primary, fontSize: 14, fontFamily: 'AvenirNextCyr-Bold', }}>{selectedRoute?.source} - {selectedRoute?.destination} Via {selectedRoute?.via}</Text>
              {/* <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}> {item.via}</Text> */}

            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: '2%', }}>
              <Text style={{ color: Colors.primary, fontSize: 13, fontFamily: 'AvenirNextCyr-Medium' }}>{selectedRoute?.estimated_departure.split('T')[0]} - {selectedRoute?.estimated_arrival.split('T')[0]}</Text>
              <TouchableOpacity onPress={() => { setSelectedRoute(undefined) }}>
                <AntDesign style={styles.icon} color="black" name="close" size={20} />

              </TouchableOpacity>

            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: '2%', }}>
              <Text style={{ color: 'green', fontSize: 14, fontFamily: 'AvenirNextCyr-Bold', }}>{selectedRoute?.vehicle} </Text>
              <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}> {selectedRoute?.driver?.first_name}</Text>
            </View>

          </TouchableOpacity>

        }
      </View>}

      <ProgressDialog
        visible={loading}
        // title="Uploading file"
        dialogStyle={{ width: '50%', alignSelf: 'center' }}
        message="Please wait..."
        titleStyle={{ fontFamily: 'AvenirNextCyr-Medium', fontSize: 16 }}
        messageStyle={{ fontFamily: 'AvenirNextCyr-Medium', fontSize: 14 }}
      />

      <Modal visible={modalVisible} transparent>

        <SafeAreaView style={{ flex: 1, backgroundColor: 'grey', justifyContent: 'center', paddingHorizontal: 10, paddingVertical: 10 }}>

          <View style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: 5, borderRadius: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View>

              </View>
              <Text style={{ alignSelf: 'center', fontSize: 20, color: 'black', fontFamily: 'AvenirNextCyr-Medium', marginVertical: 10 }}>                            <Text style={{ alignSelf: 'center', fontSize: 20, color: 'black', fontFamily: 'AvenirNextCyr-Medium', marginVertical: 10 }}>Routes</Text>
              </Text>
              <TouchableOpacity style={{ marginRight: 10 }} onPress={() => { setModalVisible(false) }}>
                <AntDesign name='close' size={20} color={`black`} />
              </TouchableOpacity>
            </View>

            <FlatList
              showsVerticalScrollIndicator={false}
              data={routeDetails}
              keyboardShouldPersistTaps='handled'
              renderItem={({ item }) =>

                <Pressable
                  style={styles.elementsView}
                  onPress={() => handleRouteSelection(item)}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ color: Colors.primary, fontSize: 14, fontFamily: 'AvenirNextCyr-Bold', }}>{item.source} - {item.destination} Via {item?.via}</Text>
                        {/* <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}> {item.via}</Text> */}
                        <RadioButton.Android
                          onPress={() => handleRouteSelection(item)}
                          color={Colors.primary}
                          status={selectedRoute?.id == item.id ? 'checked' : 'unchecked'} // Determine checkbox status based on selectedOrders
                        // onPress={() => toggleOrderSelection(item.id)} // Toggle order selection on checkbox press
                        />
                      </View>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ color: Colors.primary, fontSize: 13, fontFamily: 'AvenirNextCyr-Medium' }}>{item?.estimated_departure.split('T')[0]} - {item?.estimated_arrival.split('T')[0]}</Text>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: '2%', }}>
                        <Text style={{ color: 'green', fontSize: 14, fontFamily: 'AvenirNextCyr-Bold', }}>{item?.vehicle} </Text>
                        <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}> {item?.driver?.first_name}</Text>
                      </View>

                    </View>
                  </View>
                </Pressable>


              }
              keyExtractor={(item) => item.id.toString()}
              ListEmptyComponent={() => (
                <View style={styles.noProductsContainer}>
                  <Text style={styles.noProductsText}>No Products Available</Text>
                </View>
              )}
            />
          </View>
        </SafeAreaView>
      </Modal>

      <Modal visible={modalVisibleBill} transparent={true}>
        <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', flex: 1, justifyContent: 'center' }}>
          <View style={{ backgroundColor: 'white', padding: '2%', borderRadius: 15, flex: 0.4, marginHorizontal: '3%' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontFamily: 'AvenirNextCyr-Medium', fontSize: 16 }}> </Text>
              <TouchableOpacity onPress={() => { setModalVisibleBill(false) }}>
                <AntDesign name="close" color="black" size={25} />
              </TouchableOpacity>
            </View>

            <View style={{ flex: 1 }}>
              {orderDetails?.bill_img ? (
                <WebView
                  source={{ uri: orderDetails?.bill_img }}
                  style={{ flex: 1, borderRadius: 10 }}
                  scalesPageToFit={true}
                  scrollEnabled={true}
                  javaScriptEnabled={true}
                  domStorageEnabled={true}
                  startInLoadingState={true}
                  automaticallyAdjustContentInsets={false}
                  useWebKit={true}
                  mixedContentMode="compatibility"
                  onLoadStart={() => console.log("Loading image...")}
                  onLoadEnd={() => console.log("Image loaded")}
                  androidHardwareAccelerationDisabled={true}
                  allowFileAccess={true}
                  allowsFullscreenVideo={true}
                  allowsInlineMediaPlayback={true}
                  allowsAirPlayForMediaPlayback={true}
                  allowsBackForwardNavigationGestures={true}
                />
              ) : (
                <Text style={{ fontFamily: 'AvenirNextCyr-Medium', fontSize: 16, marginTop: '30%', color: 'black', textAlign: 'center' }}>No Image</Text>
              )}
            </View>
          </View>
        </View>
      </Modal>


    </View>
  )
}

export default TrackingDetails;
const styles = StyleSheet.create({


  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // marginBottom: 7
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  title: {
    fontFamily: 'AvenirNextCyr-Medium',
    fontSize: 14,
    color: Colors.black
  },

  value: {
    fontFamily: 'AvenirNextCyr-Medium',
    fontSize: 15,
    color: Colors.black
  },

  imageView: {
    width: 80,
    height: 80,
    // borderRadius: 40,
    // marginTop: 20,
    // marginBottom: 10
  },
  elementsView: {

    // ...globalStyles.border,
    padding: '5%',
    borderBottomColor: 'grey',
    borderBottomWidth: 0.5

  },
  ProductListContainer: {
    flex: 1,
    marginVertical: '4%',
  },
  selectedTextStyle: {
    fontSize: 16,
    fontFamily: "AvenirNextCyr-Medium",
  },

  salesContainer: {
    marginHorizontal: 16,
    padding: 10,
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginVertical: 10,
    elevation: 5,
    ...globalStyles.border,
    borderRadius: 5,
    marginTop: 20,



  },
  total: {
    fontSize: 18,
    color: Colors.primary,
    fontFamily: 'AvenirNextCyr-Medium',

  },
  label: {
    fontSize: 16,
    color: Colors.black,
    fontFamily: 'AvenirNextCyr-Medium',
  },
  performanceContainer: {
    marginHorizontal: 16,
    padding: 10,
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    marginVertical: 10,
    elevation: 5,
    ...globalStyles.border,
    borderRadius: 5,
  },
  heading: {
    fontSize: 22,
    color: Colors.primary,
    fontFamily: 'AvenirNextCyr-Medium',
  },
  subHeading: {
    fontSize: 13,
    color: 'grey',
    fontFamily: 'AvenirNextCyr-Medium',
  },
  card: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginVertical: '6%',
    backgroundColor: '#F5F5F5',
    flex: 1

  },
  cardTitle: {
    fontSize: 15,
    fontFamily: 'AvenirNextCyr-Medium',
    color: Colors.black
  },
  expandedContent: {
    marginTop: 10,
  },
  avatarImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderColor: 'grey',
    borderWidth: 1,
    width: 80,
    height: 80,
    borderRadius: 50,
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40, // Half of the width/height to make it circular
    borderWidth: 1,   // Border styles
    borderColor: 'grey',
    overflow: 'hidden',
  },
  modalContainer1: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent1: {
    backgroundColor: 'white',
    width: 300,
    borderRadius: 10,
    padding: 30,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
    marginLeft: 15,
    marginRight: 15,
  },
  submitButton1: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    // marginTop: 2,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'AvenirNextCyr-Medium'
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  inputView: {
    width: "100%",
    borderWidth: 1,
    backgroundColor: "white",
    borderRadius: 8,
    height: '2%',
    marginBottom: 20,
    justifyContent: "center",
    padding: 20,
    paddingLeft: 5,

  },
  inputView1: {
    width: "100%",
    borderWidth: 1,
    backgroundColor: "white",
    borderRadius: 8,
    height: 100,
    // marginBottom: 20,
    // justifyContent: "center",
    // padding: 20,
    paddingLeft: 5,

  },
  inputText: {
    height: 50,
    color: "black",
    fontFamily: 'AvenirNextCyr-Medium',
  },
  inputText1: {
    fontFamily: 'AvenirNextCyr-Medium',
    color: "black",
    // height: 500,
  },
  addressInput: {
    // height: 100, // Adjust the height as needed for your design
  },

  // ProductListContainer: {
  //     flex: 1
  // },
  TwoButtons: {
    width: '48%',
    paddingVertical: '4%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30
  },
  Btext: {
    color: 'white',
    fontFamily: 'AvenirNextCyr-Bold',
    fontSize: 17

  },

  textSelectedStyle: {
    marginRight: 5,
    fontSize: 16,
  },

  item: {
    padding: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdown: {
    height: 50,
    borderColor: "#dedede",
    borderWidth: 1,
    //borderRadius: 8,
    paddingHorizontal: 8,
    // marginBottom: "5%",
    borderRadius: 10,
    backgroundColor: "white",
  },
  placeholderStyle: {
    fontSize: 14,
    fontFamily: "AvenirNextCyr-Medium",
    // backgroundColor:'white'
  },

  selectedStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 14,
    backgroundColor: '#F3F3F9',
    shadowColor: '#000',
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderColor: 'black',
    borderWidth: 0.5


  },
})
