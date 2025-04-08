import moment from 'moment';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import AntDesign from "react-native-vector-icons/AntDesign";
import Entypo from "react-native-vector-icons/Entypo";
import Colors from '../../constants/Colors';
import ConvertDateTime from '../../utils/ConvertDateTime';



export const renderPaymentItem = ({ item }) => {
    let paymentImage, backgroundColor, borderColor, textColor;
    switch (item?.mode_of_payment) {
        case "Cash":
            paymentImage = require("../../assets/images/CashPay.png");
            backgroundColor = "#EDFDF0";
            break;
        case "Wire Transfer/ Bank Transfer":
            paymentImage = require("../../assets/images/onlinePay.png");
            backgroundColor = "#FFF9E5";
            break;
        case "Cheque":
            paymentImage = require("../../assets/images/ChequePay.png");
            backgroundColor = "#E3EDFC";
            break;
        default:
            paymentImage = require("../../assets/images/CashPay.png");
            backgroundColor = "#EDFDF0";
            break;
    }

    return (
        <TouchableOpacity
            style={{ ...styles.dataContainer, borderColor: borderColor }}
            // onPress={() => {
            //     setSelectedPayment(item);
            //     setModalVisible(true);
            // }}
            activeOpacity={0.5}
        >
            <View style={{ flexDirection: "row", gap: 20, alignItems: "center" }}>
                <View
                    style={{
                        backgroundColor: backgroundColor,
                        borderRadius: 10,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Image source={paymentImage} style={{ height: 45, width: 45 }} />
                </View>
                <View style={{ flex: 1 }}>
                    <View
                        style={{ flexDirection: "row", justifyContent: "space-between" }}
                    >
                        <Text style={styles.title}>PY-{item?.id}</Text>
                        <Text
                            style={{
                                ...styles.text,
                                fontFamily: "AvenirNextCyr-Medium",
                                color: "green",
                                fontSize: 18,
                            }}
                        >
                            ₹ {Number(item?.amount)}
                        </Text>
                    </View>
                    <Text style={{ ...styles.text, fontSize: 14 }}>
                        {item?.mode_of_payment}
                    </Text>
                    <Text style={{ ...styles.text }}>
                        {moment(item?.payment_date).format("DD-MM-YYYY HH:mm:ss")}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export const renderShelfDisplayItem = ({ item }) => {
    return (
        <View style={{ flex: 1 }}>
            <TouchableOpacity
                style={{ ...styles.itemContainer }}
                activeOpacity={0.8}
            // onPress={() => openModal(item)}
            >
                <View
                    style={{
                        alignItems: "center",
                        flex: 1,
                    }}
                >
                    <Image
                        source={{ uri: item?.shelf_image }}
                        style={{
                            resizeMode: "contain",
                            height: 100,
                            width: 150,
                            borderRadius: 8,
                        }}
                    />
                </View>

                <View
                    style={{ flexDirection: "row", justifyContent: "space-between" }}
                >
                    <View>
                        <Text
                            numberOfLines={1}
                            style={{
                                fontSize: 14,
                                color: "black",
                                fontWeight: "500",
                                fontFamily: "AvenirNextCyr-Medium",
                                flexDirection: "row",
                                textAlign: "left",
                                paddingLeft: 8,
                                marginTop: 3,
                            }}
                        >
                            {item.category}
                        </Text>
                        <Text
                            style={{
                                fontSize: 11,
                                fontWeight: "500",
                                color: "gray",
                                fontFamily: "Poppins-Italic",
                                flexDirection: "row",
                                textAlign: "left",
                                paddingLeft: 8,
                                marginTop: 1,
                            }}
                            numberOfLines={1}
                        >
                            {item.remarks}
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={{
                            backgroundColor: "#D3B2CF",
                            justifyContent: "flex-end",
                            borderRadius: 50,
                            marginTop: "10%",
                            padding: 5,
                        }}
                        onPress={() => openModal(item)}
                    >
                        <AntDesign name="right" size={15} color={`white`} />
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </View>
    );
};

export const renderMiscTaskItem = ({ item }) => {
    return (
        <TouchableOpacity
            style={styles.itemContainer}
            // onPress={() => {
            //     setSelectedTask(item);
            //     setModalVisible(true);
            // }}
            activeOpacity={0.5}
        >
            <View style={{
                flexDirection: 'row',
                flex: 1,
                gap: 20
            }}>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        // marginRight: "3%",
                        // flex: 0.25,
                    }}
                >
                    <View
                        style={{
                            height: 70,
                            width: 75,
                            backgroundColor: "#F0EFF4",
                            borderRadius: 10,
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Image
                            source={require("../../assets/images/MiscTask.png")}
                            style={{ height: 30, width: 30 }}
                        />
                    </View>
                </View>

                <View
                    style={{
                        flexDirection: "column",
                        // alignItems: "center",
                        marginTop: "1%",
                        flex: 0.7,
                    }}
                >
                    <Text
                        style={{
                            fontSize: 18,
                            fontFamily: "AvenirNextCyr-Medium",
                            color: "black",
                            // textAlign: "left",
                        }}
                    >
                        {item?.name}
                    </Text>

                    <Text
                        style={{
                            fontSize: 15,
                            fontFamily: "AvenirNextCyr-Medium",
                            color: "gray",
                            flexWrap: "wrap",

                            // textAlign: "left",
                        }}
                        numberOfLines={2}
                    >
                        {item?.purpose_of_visit}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};




export const renderSalesOrderItem = ({ item }) => {


    return (
        <TouchableOpacity
            style={styles.dataContainer}
            activeOpacity={0.8}
            onPress={() => {
                // navigation.navigate("SalesOrderDetails", { orderDetails: item, screen: 'SO' });
            }}
        >
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
                <View style={{ justifyContent: "center", alignItems: "center", paddingRight: '5%', }}>
                    {(item?.status === "Pending" || item?.status === "Confirmed") ? (<Entypo name='back-in-time' size={40} color={Colors.primary} />) : (item.status === "Delivered" ? (<AntDesign name='checkcircleo' size={40} color='green' />) : (<AntDesign name='closecircleo' size={40} color='tomato' />))}
                </View>

                <View
                    style={{
                        flex: 1,
                        paddingHorizontal: '2%',
                        borderColor: 'grey',
                    }}
                >
                    <View style={{ flexDirection: "row", justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text
                            style={{
                                color: Colors.primary,
                                fontSize: 16,
                                fontFamily: "AvenirNextCyr-Bold",
                                // borderBottomColor: "grey",
                                // borderBottomWidth: 0.5,
                                flex: 2,
                                flexWrap: 'wrap',
                            }}
                        >
                            {item?.name} ({item?.assignee_name}-{item?.assigne_to})
                        </Text>

                        {/* {(item?.status === 'Pending' || item?.status === 'Confirmed') && <TouchableOpacity
                            style={{ borderColor: 'tomato', borderWidth: 1, borderRadius: 20, paddingHorizontal: '4%', paddingVertical: '1%' }}
                            onPress={() => {
                                changeStatus(item.id);
                            }}
                        >
                            <Text
                                style={{
                                    color: 'tomato',
                                    fontSize: 12,
                                    fontFamily: "AvenirNextCyr-Medium",
                                }}
                            >
                                Cancel
                            </Text>
                        </TouchableOpacity>} */}
                    </View>


                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            marginTop: 5,
                        }}
                    >
                        <Text
                            style={{
                                color: "black",
                                fontSize: 12,
                                fontFamily: "AvenirNextCyr-Medium",
                            }}
                        >
                            {ConvertDateTime(item?.created_at).formattedDate} {ConvertDateTime(item?.created_at).formattedTime}
                        </Text>

                    </View>

                    <View
                        style={{
                            justifyContent: "space-between",
                            flexDirection: "row",
                            marginTop: 5,
                        }}
                    >
                        <View style={{ flexDirection: "row" }}>
                            <Text
                                style={{
                                    color: "black",
                                    fontSize: 12,
                                    fontFamily: "AvenirNextCyr-Medium",
                                }}
                            >
                                Total SKUs:{" "}
                            </Text>
                            <Text
                                style={{
                                    color: "black",
                                    fontSize: 12,
                                    fontFamily: "AvenirNextCyr-Medium",
                                }}
                            >
                                {Number(item?.product_list?.length)}
                            </Text>
                        </View>

                        <View style={{ flexDirection: "row" }}>
                            <Text
                                style={{
                                    color: "black",
                                    fontSize: 12,
                                    fontFamily: "AvenirNextCyr-Medium",
                                }}
                            >
                                Total Price:{" "}
                            </Text>
                            <Text
                                style={{
                                    color: "black",
                                    fontSize: 12,
                                    fontFamily: "AvenirNextCyr-Medium",
                                }}
                            >
                                {Number(item?.total_price)}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
};



export const renderCompAnalysisItem = ({ item }) => {

    return (
        <View style={{ flex: 1 }}>
            <TouchableOpacity
                style={{ ...styles.itemContainer }}
                activeOpacity={0.8}
            // onPress={() => openModal(item)}
            >
                <View
                    style={{
                        alignItems: "center",
                        flex: 1,
                    }}
                >
                    <Image
                        source={{ uri: item?.comp_image }}
                        style={{
                            resizeMode: "contain",
                            height: 100,
                            width: 150,
                            borderRadius: 8,
                        }}
                    />
                </View>

                <View
                    style={{ flexDirection: "row", justifyContent: "space-between" }}
                >
                    <View>
                        <Text
                            numberOfLines={1}
                            style={{
                                fontSize: 14,
                                color: "black",
                                fontWeight: "500",
                                fontFamily: "AvenirNextCyr-Medium",
                                flexDirection: "row",
                                textAlign: "left",
                                paddingLeft: 8,
                                marginTop: 3,
                            }}
                        >
                            {item.name}
                        </Text>
                        <Text
                            style={{
                                fontSize: 11,
                                fontWeight: "500",
                                color: "gray",
                                fontFamily: "Poppins-Italic",
                                flexDirection: "row",
                                textAlign: "left",
                                paddingLeft: 8,
                                marginTop: 1,
                            }}
                            numberOfLines={1}
                        >
                            {item.remarks}
                        </Text>

                        <Text
                            style={{
                                fontSize: 11,
                                fontWeight: "500",
                                color: "gray",
                                fontFamily: "Poppins-Italic",
                                flexDirection: "row",
                                textAlign: "left",
                                paddingLeft: 8,
                                marginTop: 1,
                            }}
                            numberOfLines={1}
                        >
                            Pack of : {item.pack_of}
                        </Text>
                    </View>


                    <View>
                        <Text
                            numberOfLines={1}
                            style={{
                                fontSize: 14,
                                color: "black",
                                fontWeight: "500",
                                fontFamily: "AvenirNextCyr-Medium",
                                flexDirection: "row",
                                textAlign: "left",
                                paddingLeft: 8,
                                marginTop: 3,
                            }}
                        >
                            Qty Sold : {item.quantity_sold}
                        </Text>
                        <Text
                            style={{
                                fontSize: 14,
                                fontWeight: "500",
                                color: "black",
                                fontFamily: "AvenirNextCyr-Medium",
                                flexDirection: "row",
                                textAlign: "left",
                                paddingLeft: 8,
                                marginTop: 1,
                            }}
                            numberOfLines={1}
                        >
                            Price : {item.price}
                        </Text>


                    </View>
                    {/* <TouchableOpacity
                        style={{
                            backgroundColor: "#D3B2CF",
                            justifyContent: "flex-end",
                            borderRadius: 50,
                            marginTop: "10%",
                            padding: 5,
                        }}
                        onPress={() => openModal(item)}
                    >
                        <AntDesign name="right" size={15} color={`white`} />
                    </TouchableOpacity> */}
                </View>
            </TouchableOpacity>
        </View>
    );
};


const styles = StyleSheet.create({
    dataContainer: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 15,
        // margin: '4%',
        marginHorizontal: "4%",
        marginVertical: "2%",

    },
    text: {
        fontSize: 15,
        color: "#837D7D",
    },

    itemContainer: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 15,
        marginHorizontal: '4%',
        marginVertical: '2%',
    }
});