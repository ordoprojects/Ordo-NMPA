import React, { useContext, useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
    FlatList,
    Alert,
    Modal,
    SafeAreaView,
    ActivityIndicator
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Colors from "../../constants/Colors";
import AntDesign from "react-native-vector-icons/AntDesign"
import { LoadingView } from "../../components/LoadingView";
import globalStyles from "../../styles/globalStyles";
import { AuthContext } from "../../Context/AuthContext";
import Toast from "react-native-simple-toast";

const RouteDetails = ({ navigation, route }) => {
    const [routeDetails, setRouteDetails] = useState(route?.params.routeDetails)
    const { userData } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [groupedOrders, setGroupedOrders] = useState([]);
    const [selectedCustomerOrders, setSelectedCustomerOrders] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [expandedOrderId, setExpandedOrderId] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);

    const toggleExpand = (orderId) => {
        setExpandedOrderId(prevOrderId => prevOrderId === orderId ? null : orderId);
    };

    useEffect(() => {
        const orders = routeDetails?.sales_order_details;

        // Function to group sales orders by assignee_name
        const groupSalesOrdersByAssignee = () => {
            const groupedSalesOrders = {};

            orders.forEach(order => {
                const assignee = order.assignee_name;

                if (!groupedSalesOrders[assignee]) {
                    groupedSalesOrders[assignee] = [];
                }

                groupedSalesOrders[assignee].push(order);
            });

            return groupedSalesOrders;
        };

        const groupedOrdersArray = Object.entries(groupSalesOrdersByAssignee()).map(([assignee, orders]) => ({
            [assignee]: orders
        }));

        setGroupedOrders(groupedOrdersArray);
    }, [routeDetails]);

    
    const formatDate = (dateString) => {
        if (!dateString) {
          return ''; 
        }
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
          return '';
        }
        const day = date.getUTCDate().toString().padStart(2, '0');
        const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
        const year = date.getUTCFullYear();
        return `${day}-${month}-${year}`;
      };

    const handleCustomerSelect = (orders) => {
        setSelectedCustomerOrders(orders);
        console.log("product lists", orders);
        setModalVisible(true);
    };

    const UpdateRoutStatus = () => {

        Alert.alert(
            "Transit Route",
            "Are you sure you want to Transit this Route",
            [
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
              },
              {
                text: "Yes",
                onPress: () => {
        setIsUpdating(true);
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${userData?.token}`);
    
        var raw = JSON.stringify({
          id: routeDetails?.id,
          route_status: "In Transit",
        });
    
        var requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow",
        };
    
        fetch(
          "https://gsidev.ordosolution.com/api/route_manifest/update_route_details/",
          requestOptions
        )
          .then((response) => response.json())
          .then((result) => {
            if (result.error) {
              setIsUpdating(false);
              Toast.show("Please try again", Toast.LONG);
            } else {
              Toast.show("Routes is In Transit", Toast.LONG);
              navigation.goBack();
              setIsUpdating(false);
            }
          })
          .catch((error) => {console.error(error); Toast.show("Please try again", Toast.LONG);  setIsUpdating(false);});
        
         }
        }
       ]
      );
    };


    const transformData = (data) => {
        // Extract route_id from id
        const transformedData = {
          list_of_so: data?.sales_order_details.map((order) => ({
            so_id: order.id,
            product_ids: order?.product_list.map((product) => product.product_id)
          }))
        };
        return transformedData;
      };

      console.log("routeDetails?.sales_order_details", routeDetails?.sales_order_details.map((order) => ({
        so_id: order.id,
        product_ids: order?.product_list.map((product) => JSON.stringify(product,null,2))
      })))

    const DeliveryRoutStatus = () => {

        Alert.alert(
            "Complete Route",
            "Are you sure you want to Complete this Route",
            [
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
              },
              {
                text: "Yes",
                onPress: () => {
        setIsUpdating(true);
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${userData?.token}`);
    
        var raw = JSON.stringify({
            route_id: routeDetails?.id,
            list_of_so: routeDetails?.sales_order_details.map((order) => ({
                so_id: order.id,
                product_ids: order?.product_list.map((product) => product.product_id)
              }))
        });

        console.log('==============raw=============raw=========');
        console.log(raw);
        console.log('===============raw===============raw======');
    
        var requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow",
        };

        fetch(
          "https://gsidev.ordosolution.com/api/multiple_order_update/",
          requestOptions
        )
          .then((response) => response.json())
          .then((result) => {
            if (result.error) {
              setIsUpdating(false);
              Toast.show("Please try again", Toast.LONG);
            } else {
              Toast.show("Routes Completed", Toast.LONG);
              navigation.goBack();
              setIsUpdating(false);
            }
          })
          .catch((error) => {console.error(error); Toast.show("Please try again", Toast.LONG);  setIsUpdating(false);});
        
         }
        }
       ]
      );
    };


    const renderItem = ({ item }) => (
      
        <TouchableOpacity
            onPress={() => handleCustomerSelect(item)}
        >
            <View style={styles.item}>

                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: 'center' }}>
                    <Text
                        style={{ fontSize: 18, fontFamily: "AvenirNextCyr-Bold", color: Colors.primary }}
                    >
                        {item[0]?.assignee_name} ({item[0]?.assigne_to})
                     </Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={{ flex: 1, backgroundColor: "white" }}>


            <LinearGradient
                colors={Colors.linearColors}
                start={Colors.start} end={Colors.end}
                locations={Colors.ButtonsLocation}
                style={{
                    borderBottomLeftRadius: 40,
                    borderBottomRightRadius: 40,
                }}
            >
                <View style={styles.headerView}>
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
                            fontSize: 22,
                            marginLeft: 8,
                            color: "white",
                        }}
                    > Route Details           
                     </Text>
                    <View>
                        {routeDetails?.route_status == "Pending" && <TouchableOpacity style={styles.historyBtn}
                        >
                        </TouchableOpacity>}
                    </View>
                </View>

                <Image
                    style={{
                        height: "29%",
                        width: "80%",
                        resizeMode: "contain",
                        alignSelf: "center",
                        marginBottom:'3%'
                    }}
                    source={require("../../assets/images/RouteDetails.png")}
                />

                <View style={styles.rowView}>
                    <View style={styles.column}>
                        <Text style={styles.label}>Source</Text>
                        <Text style={styles.value}>{routeDetails?.source}</Text>
                    </View>
                    <View style={styles.column}>
                        <Text style={styles.label}>Destination</Text>
                        <Text style={styles.value}>{routeDetails?.destination}</Text>
                    </View>

                    <View style={styles.column}>
                        <Text style={styles.label}>Vehicle</Text>
                        <Text style={styles.value}>{ routeDetails?.transportation_type === 'Pick-Up' ? routeDetails?.pickup_vehicle_no: routeDetails?.vehicle_details?.registration_no}</Text>
                    </View>
                </View>

                <View style={styles.rowView}>
                    <View style={styles.column}>
                        <Text style={styles.label}>Driver</Text>
                        <Text style={styles.value}>{routeDetails?.transportation_type === 'Pick-Up' ? routeDetails?.pickup_driver_name : routeDetails?.driver_details?.first_name}</Text>
                    </View>
                    <View style={styles.column}>
                        <Text style={styles.label}>Estimated Departure</Text>
                        <Text style={styles.value}>{formatDate(routeDetails?.estimated_departure)}</Text>
                    </View>
                    <View style={styles.column}>
                        <Text style={styles.label}>Estimated Arrival</Text>
                        <Text style={styles.value}>{formatDate(routeDetails?.estimated_arrival)}</Text>
                    </View>
                </View>

                <View style={styles.rowView}>
                    <View style={styles.column}>
                        <Text style={styles.label}>Loaded by</Text>
                        <Text style={styles.value}>{routeDetails?.loaded_by} {routeDetails?.driver?.last_name}</Text>
                    </View>
                    <View style={styles.column}>
                        <Text style={styles.label}>Prepared by</Text>
                        <Text style={styles.value}>{routeDetails?.prepared_by}</Text>
                    </View>
                    <View style={styles.column}>
                        <Text style={styles.label}>Checked by</Text>
                        <Text style={styles.value}>{routeDetails?.checked_by}</Text>
                    </View>
                </View>
            </LinearGradient>

            <View style={{ marginTop: '3%', backgroundColor: 'white', flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: "space-between", marginHorizontal: '5%', }}>
                    <Text style={{ fontFamily: 'AvenirNextCyr-Medium', fontSize: 20 }}>Customers</Text>
                </View>

                <FlatList
                    data={groupedOrders.map(group => Object.values(group)[0])}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()} 
                    style={{ marginTop: "3%" }}
                />

{ routeDetails.route_status === 'Pending' ?

<TouchableOpacity
            onPress={() => {
                UpdateRoutStatus();
            }}
            style={[
              styles.TwoButtons,
              { backgroundColor: "#FFC300", marginBottom: "4%" },
            ]}
          >
            {isUpdating ?
             <ActivityIndicator size="small" color="#fff" />
             :
            <Text style={styles.Btext}>
              Mark as In Transit
            </Text>
}
          </TouchableOpacity>

          : routeDetails.route_status === 'In Transit' ?
          <TouchableOpacity
            onPress={() => {
                DeliveryRoutStatus();
            }}
            style={[
              styles.TwoButtons,
              { backgroundColor: "green", marginBottom: "4%" },
            ]}
          >
              {isUpdating ?
               <ActivityIndicator size="small" color="#fff" /> :
            <Text style={styles.Btext}>
              Dispatch order
            </Text> 
}
          </TouchableOpacity> : null
         }
    </View>


          <Modal visible={modalVisible} transparent>
            <SafeAreaView style={{ flex: 1, backgroundColor: 'grey', justifyContent: 'center', paddingHorizontal: 10, paddingVertical: 10 }}>
                <View style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 8 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View />
                        <Text style={{ alignSelf: 'center', fontSize: 22, color: 'black', fontFamily: 'AvenirNextCyr-Medium', marginVertical: 12 }}>Orders</Text>
                        <TouchableOpacity style={{ marginRight: 10 }} onPress={() => { setModalVisible(false) }}>
                            <AntDesign name='close' size={20} color={`black`} />
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={selectedCustomerOrders}
                        keyboardShouldPersistTaps='handled'
                        renderItem={({ item }) =>
                            <View key={item.id} style={{ marginBottom: 10, backgroundColor: '#f9f9f9', borderRadius: 8, padding: 15 }}>
                                <TouchableOpacity onPress={() => toggleExpand(item.id)} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <View style={{ flex: 1 }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Text style={{ color: Colors.primary, fontSize: 14, fontFamily: 'AvenirNextCyr-Bold', flexWrap: 'wrap', flex: 1 }} numberOfLines={3}>{item.assignee_name} ({item.id})</Text>
                                        </View>
                                        <Text style={{ color: Colors.black, fontSize: 14, fontFamily: 'AvenirNextCyr-Medium', marginTop: '1%' }}>Company : {item?.company?.name}</Text>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: '1%', flex: 1 }}>
                                            <Text style={{ color: Colors.black, fontSize: 14, fontFamily: 'AvenirNextCyr-Medium', marginTop: 0, fontStyle: 'italic' }}>{item?.assigne_to_address?.address}, {item?.assigne_to_address?.state} - {item?.assigne_to_address?.postal_code}</Text>
                                            {item?.route_product_status === "Completed" && <Text style={{ color: "green", fontSize: 14, fontFamily: 'AvenirNextCyr-Bold' }}>{item?.route_product_status}</Text>}
                                        </View>
                                    </View>
                                       <AntDesign name={expandedOrderId === item.id ? 'up' : 'down'} size={20} color={`black`} />
                                </TouchableOpacity>

                                {expandedOrderId === item.id && (
                                    <View style={{ marginTop: 10 }}>
                                        <View style={{ borderBottomWidth: 1, borderBottomColor: Colors.primary, borderBottomStyle: 'dotted', marginBottom: 10 }} />
                                        <Text style={{ color: 'gray', fontSize: 16, fontFamily: 'AvenirNextCyr-Bold', marginBottom: 10 }}>Products:</Text>
                                        {item.product_list.map((product, index) => (
                                            <View key={product.id} style={{ marginBottom: index !== item.product_list.length - 1 ? 10 : 0 }}>
                                                <Text style={{ color: Colors.primary, fontSize: 13, fontFamily: 'AvenirNextCyr-Bold',marginLeft:'1%'}}>{product?.name}</Text>
                                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}> <Text style={{ color: Colors.black, fontSize: 14, fontFamily: 'AvenirNextCyr-Bold' }}>Loaded Qty:</Text> {parseFloat(product?.actual_loaded_qty).toFixed(3)} {product?.loaded_uom}</Text>
                                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}> <Text style={{ color: Colors.black, fontSize: 14, fontFamily: 'AvenirNextCyr-Bold' }}>Remaining Qty:</Text> {parseFloat(product?.remaining_qty).toFixed(3)} {product?.loaded_uom}</Text>
                                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}> <Text style={{ color: Colors.black, fontSize: 14, fontFamily: 'AvenirNextCyr-Bold' }}>Loaded Weight:</Text> {product?.actual_loaded_weight} Kg</Text>
                                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}> <Text style={{ color: Colors.black, fontSize: 14, fontFamily: 'AvenirNextCyr-Bold' }}>Bundle/Packets:</Text> {product?.loaded_bundle}</Text>
                                               {index < item.product_list.length - 1 && <View style={styles.productSeparator} />}
                                            </View>
                                        ))}
                                    </View>
                                )}
                            </View>
                        }
                        keyExtractor={(item) => item.id.toString()}
                        ListEmptyComponent={() => (
                            <View style={{ alignItems: 'center', justifyContent: 'center', height: 100 }}>
                                <Text style={{ color: Colors.black, fontSize: 16, fontFamily: 'AvenirNextCyr-Medium' }}>No Products Available</Text>
                            </View>
                        )}
                    />
                   </View>
               </SafeAreaView>
            </Modal>
            <LoadingView visible={loading} message="Please Wait ..." />

        </View>
    );
};

export default RouteDetails;

const styles = StyleSheet.create({

    bottomBtnTxt: {
        color: "white",
        fontSize: 19,
        fontWeight: "600",
    },
    headerView: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        height: "10%",
        alignItems: "center",
        alignContent: "center",
        textAlign: "center",
        marginTop: "4%",
    },
    historyBtn: {
        paddingVertical: 5,
        paddingHorizontal: "3%",
        borderRadius: 5,
        marginRight: 7,
    },
    rowView: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        marginTop: "1%",
        flex: 1
    },
    column: {
        // flex: 1,
        flexDirection: "column",
        alignItems: "center",
    },
    label: {
        color: "#C3B3C3",
        textAlign: "center",
        fontWeight: "500",
    },
    value: {
        color: "white",
        fontWeight: "600",
        fontSize: 15,
        textAlign: "center",
    },
    item: {
        backgroundColor: "white",
        padding: "4%",
        marginVertical: "2%",
        marginHorizontal: '5%',
        borderTopEndRadius: 13,
        borderBottomLeftRadius: 13,
        elevation: 5,
        gap: 3,
        ...globalStyles.border,
    },
    TwoButtons: {
        paddingVertical: '4%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
        marginHorizontal:"5%",
        elevation: 5,
    },
    Btext: {
        color: 'white',
        fontFamily: 'AvenirNextCyr-Bold',
        fontSize: 17
    },
    elementsView: {
        backgroundColor: "white",
        margin: 5,
        marginBottom: 10,
        borderRadius: 8,
        elevation: 5,
        ...globalStyles.border,
        padding: 16,
    },
      productSeparator: {
    borderBottomWidth: 0.7,
    borderBottomColor: '#A9A9A9',
    marginVertical:'3%'
  },
});
