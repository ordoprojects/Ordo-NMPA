import React, { useContext, useState, useEffect ,useCallback} from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    FlatList
} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useFocusEffect } from "@react-navigation/native";
import { AuthContext } from "../../Context/AuthContext";
import moment from "moment";
import { ProgressDialog } from "react-native-simple-dialogs";
import LinearGradient from "react-native-linear-gradient";
import Colors from "../../constants/Colors";
import { ms, hs, vs } from "../../utils/Metrics";
import { AnimatedFAB,Button,ActivityIndicator} from "react-native-paper";
import {Searchbar} from "react-native-paper";
import Toast from "react-native-simple-toast";
import { LoadingView } from "../../components/LoadingView";
import OrdersSkeleton from "../Skeleton/OrdersSkeleton";

const ViewQuotations = ({ navigation }) => {
    const {userData } = useContext(AuthContext);
    const [data, setData] = useState(false);
    const [search, setSearch] = useState("");
    const [offset, setOffset] = useState(0);
    const [loading, setLoading] = useState(false)
    const [loadingMore, setLoadingMore] = useState(false);

    const getReturnHistory = async (offset) => {
        if (loading) return;
        console.log("----CALLED------------>")
        offset > 0 ? setLoadingMore(true) : setLoading(true);
        //setLoading(true);
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${userData.token}`);

        var requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow",
        };

        try {
            const response = await fetch(
                `https://gsidev.ordosolution.com/api/sales_quotation/?limit=10&offset=${offset}&search_name=${search}&user=${userData.id}`,
                requestOptions
            );
            const result = await response.json();
            // console.log("RESPONSE=============+++>>>>>",result)
            console.log("SEARCH=========>>>",search)
            console.log("LENGTH=============+++>>>>>",result.length)
           
            if(result.length===0){
                if(data.length>0 && search===""){
                Toast.show("Reached End",Toast.LONG);
                setLoadingMore(false);
                }
            }
            else{
                setData(prevData => [...prevData, ...result]);
                setLoading(false);
                setLoadingMore(false)
            }

            setLoading(false)
        } catch (error) {
            console.log("get return history error", error);
            setLoading(false);
        }
    };


    useFocusEffect(
        useCallback(() => {
            setData([]); 
            setOffset(0);
            getReturnHistory(0);
        }, [search])
    );

    useEffect(() => {
        if (offset > 0) {
            getReturnHistory(offset);
        }
    }, [offset]);

    const loadMoreData = () => {
        setOffset(prevOffset => prevOffset + 10);
        
    };


    const renderItem = ({ item, index }) => {
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
                paymentImage = require("../../assets/images/ChequePay.png");
                backgroundColor = "#EDFDF0";
                break;
        }


        return (
            <TouchableOpacity
                style={{ ...styles.itemContainer, borderColor: borderColor }}
                onPress={() => {
                    navigation.navigate('QuotationDetails', { orderDetails: item })
                }}
                activeOpacity={0.5}
            >
                <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
                    <View
                        style={{
                            height: 70,
                            width: 75,
                            backgroundColor: backgroundColor,
                            borderRadius: 10,
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Image source={paymentImage} style={{ height: 45, width: 45 }} />
                    </View>
                    <View style={styles.orderDataContainer}>
                        <View
                            style={{ flexDirection: "row", justifyContent: "space-between" }}
                        >
                            <Text style={styles.title}>{item?.name}</Text>
                            <Text
                                style={{
                                  ...styles.text,
                                  fontFamily: "AvenirNextCyr-Medium",
                                  color: "green",
                                  fontSize: 18,
                                }}
                              >
                                {item?.total_price ? 
                                  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(item.total_price) : 
                                  '₹0'}
                              </Text>

                        </View>
                        <Text style={{ ...styles.text, fontSize: 13 }}>
                            {item?.assignee_name}
                        </Text>
                        <Text style={{ ...styles.text }}>
                            {moment(item?.created_at).format("DD-MM-YYYY HH:mm")}
                        </Text>
                        <Text style={{ color: 'black', fontSize: 13, fontFamily: "AvenirNextCyr-Medium" }}>Created :{item?.created_by}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    const noDataFound = () => {
        return (
            <View style={styles.noReport}>
                <Text style={styles.noReportText}>No data found</Text>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={Colors.linearColors}
                start={Colors.start}
                end={Colors.end}
                locations={Colors.location}
                style={{ flex: 1 }}
            >
                <View style={styles.rowContainer}>
                    <View style={{ ...styles.headercontainer }}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Image
                                source={require("../../assets/images/Refund_back.png")}
                                style={{ height: 30, width: 30 }}
                            />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Quotations</Text>
                        <Text style={styles.headerTitle}>   </Text>
                    </View>
                </View>
                <Searchbar
          style={{
            marginHorizontal: "3%",
            marginVertical: "1%",
            backgroundColor: "white",
          }}
          placeholder="Search Quotations"
          onChangeText={(val) => { setSearch(val)}}
          value={search}
         
        />
                <View
                    style={{
                        backgroundColor: "#F3F5F8",
                        borderTopLeftRadius: 30,
                        borderTopRightRadius: 30,
                        flex: 1,
                        padding: 10,
                        elevation: 5,
                        marginTop: vs(10),
                    }}
                >
          {loading?<OrdersSkeleton/> : (data.length === 0 ? noDataFound() : (
                        <FlatList
                            data={data}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.id.toString()}
                            onEndReachedThreshold={0.5}
                            showsVerticalScrollIndicator={false}
                            //
                            ListFooterComponent={data?.length<10?null:(loadingMore?<ActivityIndicator style={{paddingVertical:5}}/>:<Button onPress={loadMoreData}>Load More</Button>)}
                        />
                    ))}

                </View>

            </LinearGradient>
     
            <AnimatedFAB
                label={"Add User    "}
                icon={(name = "plus")}
                color={"white"}
                style={styles.fabStyle}
                fontFamily={"AvenirNextCyr-Thin"}
                extended={false}
                visible={true}
                animateFrom={"right"}
                iconMode={"static"}
                onPress={() => { navigation.navigate("CustomerList", { screen: "SalesOrder", screenId: 2 }) }}
            />
            {/* <LoadingView visible={loading} message="Please wait..." /> */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    rowContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
        marginHorizontal: "5%",
        marginVertical: "4%",
    },
    headercontainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "400",
        color: Colors.white,
        fontFamily: "AvenirNextCyr-Medium",
        marginLeft: "18%",
    },
    itemContainer: {
        backgroundColor: Colors.white,
        borderRadius: 15,
        padding: 15,
        marginBottom: 10,
        marginHorizontal: "2%",
    },
    title: {
        fontSize: 18,
        fontFamily: "AvenirNextCyr-Medium",
        alignSelf: "center",
        color:"black"
    },
    text: {
        fontSize: 14,
        color: "#837D7D",
    },
    noReport: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    noReportText: {
        fontSize: 18,
        color: Colors.black,
    },
    orderDataContainer: {
        width: "73%",
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
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

    MPriceText: {
        fontSize: 25,
        fontFamily: "AvenirNextCyr-Medium",
        color: Colors.black,
        marginVertical: "2%",
        alignSelf: "center",
    },
    imgStyle: {
        width: 90,
        height: 90,
        resizeMode: "cover",
        borderRadius: 8,
        marginTop: 5,
        marginBottom: 5,
    },
    closeButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "lightgray",
        borderRadius: 20,
        position: "absolute",
        top: 10,
        right: 10,
        backgroundColor: "#EFF1F5",
    },
    textStyle: {
        marginLeft: 10,
    },
    circleButton: {
        width: 35,
        height: 35,
    },
    circle: {
        width: 50,
        height: 50,
        borderRadius: 35,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white",
    },
    fabStyle: {
        borderRadius: 50,
        position: "absolute",
        margin: 10,
        right: 10,
        bottom: 10,
        backgroundColor: Colors.primary,
    },
    icon: {
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
    },
    dropDownContainer: {
        backgroundColor: "white",
        marginBottom: 10,
        marginTop: 5,
    },
    dropdown: {
        height: 50,
        borderColor: "gray",
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
    },
    buttonview: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 6,
        marginTop: '2%'
    },
    buttonContainer: {
        height: 50,
        padding: 10,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    buttonText: {
        fontFamily: "AvenirNextCyr-Medium",
        color: "white",
        fontSize: 16,
    }, photosContainer: {
        height: 40,
        padding: 10,
        borderRadius: 10,
        // marginVertical: 10,
        // backgroundColor: Colors.primary,
        // marginRight: 10,
    },
});

export default ViewQuotations;
