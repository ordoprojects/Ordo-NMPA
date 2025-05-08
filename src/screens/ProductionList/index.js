import React, { useState, useCallback, useContext } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    FlatList,
    Modal,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { AuthContext } from "../../Context/AuthContext";
import DatePicker from "react-native-date-picker";
import Colors from "../../constants/Colors";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import DarkLoading from "../../styles/DarkLoading";
import { AnimatedFAB,Searchbar,Button,ActivityIndicator} from "react-native-paper";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useFocusEffect } from "@react-navigation/native";
import DashedLine from 'react-native-dashed-line';
import Toast from "react-native-simple-toast";
import globalStyles from "../../styles/globalStyles";

const ProductionList = ({ navigation }) => {
    const [maintenanceData, setMaintenanceData] = useState([]);
    const [fuelData, setFuelData] = useState([]);
    const { userData } = useContext(AuthContext);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [originalMaintenanceData, setOriginalMaintenanceData] = useState([]);
    const [originalFuelData, setOriginalFuelData] = useState([]);
    const [isFiltered, setIsFiltered] = useState(false);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [offset, setOffset] = useState(0);
    const [loadingMore, setLoadingMore] = useState(false);
    const [activeTab, setActiveTab] = useState('Delivery');
    const [deliveryData, setDeliveryData] = useState('');

    const formatDate = (timestamp) => {
        if (!timestamp) {
            return '';
        }
        const date = new Date(timestamp);
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const day = String(date.getUTCDate()).padStart(2, '0');
        return `${day}/${month}/${year}`;
    };

    useFocusEffect(
        useCallback(() => {
            FetchFuelData();
        }, [userData, offset, search])
    );
    
    const FetchFuelData = async () => {
        offset > 0 ? setLoadingMore(true) : setLoading(true);
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${userData.token}`);
    
        var requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow",
        };
    
        fetch(
            `https://gsidev.ordosolution.com/api/production_route_filter/?limit=10&offset=${offset}&search_name=${search}`,
            requestOptions
        )
            .then((response) => response.json())
            .then(async (result) => {
                console.log("🚀 ~ .then ~ result:-------------->", result)
                if (result.length > 0) {

                    // Store the full list in setOriginalFuelData for the initial load or pagination
                    if (offset === 0) {
                        setOriginalFuelData(result); // Store full fetched data
                    } else {
                        setOriginalFuelData((prevData) => [...prevData, ...result]);
                    }
    
                    // Store everything in setDeliveryData, without filtering by transportation type
                    if (offset === 0) {
                        setDeliveryData(result);
                    } else {
                        setDeliveryData((prevData) => [...prevData, ...result]);
                    }

                    setLoading(false);
                    setLoadingMore(false);
                } else {
                    Toast.show("Reached End", Toast.LONG);
                    setLoadingMore(false);
                    setLoading(false);
                }
            })
            .catch((error) => {
                setLoading(false);
                setLoadingMore(false);
                console.log("error", error);
            });
    };
    


const filteredFuelData = fuelData.filter(item => item.transportation_type === activeTab);

    const handleCellPress = (item) => {
        navigation.navigate("ProductionRouteDetails", { routeDetails: item });
    };
    
    const resetFilter = () => {
        setSelectedDate(new Date());
        setMaintenanceData(originalMaintenanceData);
        setFuelData(originalFuelData);
        setIsFiltered(false);
    };

    const applyFilter = () => {
        setIsModalVisible(false);
        setIsFiltered(true);

        const formattedSelectedDate = selectedDate.toISOString().split("T")[0];
        const filteredMaintenanceData = originalMaintenanceData.filter(
            (item) => item.maintainance_date === formattedSelectedDate
        );
        const filteredFuelData = originalFuelData.filter(
            (item) => item.fuel_date === formattedSelectedDate
        );

        setMaintenanceData(filteredMaintenanceData);
        setFuelData(filteredFuelData);
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => handleCellPress(item)}>
            <View style={styles.item}>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: '4%', alignItems: 'center' }}>
            <View style={{ width: '20%'}}>
   
    <Text
        style={{ fontSize: 14, fontFamily: "AvenirNextCyr-Bold", color: Colors.black }}
    >
        No. {item?.id}
    </Text>
    </View>

    <View style={{ width: '60%', alignItems: 'center' }}>
        <Text
            style={{ fontSize: 16, fontFamily: "AvenirNextCyr-Bold", color: Colors.primary, textAlign: 'center' }}
        >
            {item?.transportation_type === 'Pick-Up' ? item?.pickup_vehicle_no : item?.vehicle_details?.registration_no}
        </Text>
    </View>

    <View style={{ width: '20%',alignItems:'flex-end'}}>

    <Text
        style={{ fontSize: 14, fontFamily: "AvenirNextCyr-Bold", color: Colors.black }}
    >
        {item?.transportation_type === 'Pick-Up' ? item?.pickup_driver_name : item?.driver_details?.first_name}
    </Text>
    </View>
</View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: '1%', paddingHorizontal: '4%' }}>
                    <View style={{ flexDirection: 'row', flex: 0.4 }}>
                        <Image
                            style={{
                                height: "110%",
                                resizeMode: "contain",
                                right: 20
                            }}
                            source={require("../../assets/images/sourcePin1.png")}
                        />
                        <Text
                            style={{ fontSize: 16, fontFamily: "AvenirNextCyr-Bold", color: Colors.black, right: 30 }}
                        >
                            {item?.source}
                        </Text>
                    </View>
                    <View style={{ flex: 0.2 }}>
                        {
                            item?.route_status === 'Pending' ?
                            <MaterialCommunityIcons name="truck" size={27} color="gray" />
                            :  item?.route_status === 'In Transit' ?
                            <MaterialCommunityIcons name="truck-fast" size={27} color="orange" />
                            :  
                            <MaterialCommunityIcons name="truck-check" size={28} color="green" />
                        }
                       
                    </View>
                    <View style={{ flexDirection: 'row-reverse', flex: 0.3, alignItems: 'flex-end' }}>

                        <Image
                            style={{height: "110%",resizeMode: "contain",right: 20}}
                            source={require("../../assets/images/destPin1.png")}
                        />
                        <Text style={{ fontSize: 16, fontFamily: "AvenirNextCyr-Bold", color: Colors.black, right: 30 }}>
                            {item?.destination}
                        </Text>
                    </View>
                </View>

                <View style={{ paddingHorizontal: '4%' }}>
                    <DashedLine dashLength={10} dashThickness={1} dashGap={5} />
                </View>
                <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                    <View style={{ flexDirection: 'column', justifyContent: 'space-between', marginTop: '1%', backgroundColor: 'rgba(111, 64, 172, 0.1)', paddingVertical: '1%',alignItems:"center",flex:1}}>
                        <Text
                            style={{ fontSize: 14, fontFamily: "AvenirNextCyr-Medium", color: Colors.black, paddingHorizontal: '4%' }}>
                            DEPARTURE
                        </Text>
                        <Text
                            style={{ fontSize: 14, fontFamily: "AvenirNextCyr-Medium", color: Colors.black, paddingHorizontal: '4%' }}>
                           {formatDate(item?.estimated_departure)}
                        </Text>
                    </View>

                    <View style={{ flexDirection: 'column', justifyContent: 'center', marginTop: '1%', backgroundColor: item?.route_status === 'Pending' ? 'rgba(211, 211, 211, 0.1)' : item?.route_status === 'In Transit' ? 'rgba(255, 165, 0, 0.1)' : 'rgba(71, 193, 97, 0.1)' , paddingVertical: '1%',alignItems:"center",flex:1 }}>
                        <Text
                            style={{ fontSize: 14, fontFamily: "AvenirNextCyr-Bold", color: item?.route_status === 'Pending' ? 'gray' : item?.route_status === 'In Transit' ? 'orange' : 'green', paddingHorizontal: '4%' }}>
                            {item?.route_status}
                        </Text>
                    </View> 

                    <View style={{ flexDirection: 'column', justifyContent: 'space-between', marginTop: '1%', backgroundColor: 'rgba(193, 71, 97, 0.1)', paddingVertical: '1%',alignItems:"center" ,flex:1}}>
                        <Text
                            style={{ fontSize: 14, fontFamily: "AvenirNextCyr-Medium", color: Colors.black, paddingHorizontal: '4%' }}
                        >
                            ARRIVAL
                        </Text>
                        <Text
                            style={{ fontSize: 14, fontFamily: "AvenirNextCyr-Medium", color: Colors.black, paddingHorizontal: '4%' }}>
                            {formatDate(item?.estimated_arrival)}
                        </Text>
                    </View>
                </View>
                <View style={{flexDirection:'row',justifyContent:"space-between",marginHorizontal:'3%'}}>
                <Text style={{ fontSize: 13, fontFamily: "AvenirNextCyr-Bold", color: Colors.primary}}>
                           Transportation Type </Text>
                           <Text style={{ fontSize: 13, fontFamily: "AvenirNextCyr-Bold", color: Colors.primary }}>
                           {item?.transportation_type}</Text>
                </View>
              
            </View>
        </TouchableOpacity>
    );
    const handleLoadMore = async ()  =>{
       setOffset((prevOffset)=>prevOffset+15)
    }

    return (
        <LinearGradient
            colors={Colors.linearColors}
            start={Colors.start}
            end={Colors.end}
            locations={Colors.location}
            style={{flex: 1}}
        >
            <View style={styles.headerView}>
                <TouchableOpacity
                    onPress={() => {
                        navigation.goBack();}}
                >
                    <Image
                        source={require("../../assets/images/Refund_back.png")}
                        style={{ height: 30, width: 30 }}
                    />
                </TouchableOpacity>
                <Text
                    style={{
                        fontFamily: "AvenirNextCyr-Medium",
                        fontSize: 20,
                        marginRight: '5%',
                        color: "white",
                    }}
                >
                    Routes
                </Text>
                <View />
            </View>

        <Searchbar
          style={{
            marginHorizontal: "3%",
            backgroundColor: "white",
            height:50
          }}
          placeholder="Search Routes"
          onChangeText={(val) => { setSearch(val)}}
          value={search}
        />

            <View style={styles.whiteView}>
            {/* <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 }}> */}
                  {/* Delivery Tab */}
  {/* <TouchableOpacity onPress={() => setActiveTab('Delivery')}>
    <View
      style={{
        backgroundColor: activeTab === 'Delivery' ? Colors.primary : 'transparent',
        paddingVertical: 8,
        paddingHorizontal: 50,
        borderRadius: 10,
      }}
    >
      <Text
        style={{
          fontSize: 15,
          color: activeTab === 'Delivery' ? 'white' : 'grey',
          fontFamily: 'AvenirNextCyr-Bold',
        }}
      >
        Delivery
      </Text>
    </View>
  </TouchableOpacity> */}

  {/* Pick-Up Tab */}
  {/* <TouchableOpacity onPress={() => setActiveTab('Pick-Up')}>
    <View
      style={{
        backgroundColor: activeTab === 'Pick-Up' ? Colors.primary : 'transparent',
        paddingVertical: 8,
        paddingHorizontal: 50,
        borderRadius: 10,
      }}
    >
      <Text
        style={{
          fontSize: 15,
          color: activeTab === 'Pick-Up' ? 'white' : 'grey',
          fontFamily: 'AvenirNextCyr-Bold',
        }}
      >
        Pick-Up
      </Text>
    </View>
  </TouchableOpacity> */}

{/* </View> */}



      {/* Display the filtered data based on selected tab */}

                {isFiltered && (
                    <View style={styles.filteredTextView}>
                        <Text style={styles.filteredText}>
                            History filtered based on: {selectedDate.toDateString()}
                        </Text>
                        <TouchableOpacity
                            onPress={resetFilter}
                            style={{
                                backgroundColor: Colors.primary,
                                padding: "1%",
                                borderRadius: 5,
                            }}
                        >
                            <Text style={styles.resetText}>Reset</Text>
                        </TouchableOpacity>
                    </View>
                )}
{loading ? (
    <DarkLoading />
) : (
    deliveryData?.length < 1 ? (
        <Text style={{  color: "gray",
        fontSize: 16,
        fontWeight: "600",
        textAlign: "center",flex:1,justifyContent:"center",position:"absolute",top:300,left:130}}>No routes available</Text> 
    ) : (
        <FlatList
            data={deliveryData}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            ListFooterComponent={
                loadingMore ? (
                    <ActivityIndicator style={{ paddingVertical: 5 }} />
                ) : (
                    <Button onPress={handleLoadMore}>Load More</Button>
                )
            }
        />
    )
)}

            </View>
            <AnimatedFAB
                label={'Add Route'}
                icon={() => <AntDesign name="addfile" size={24} color="white" />}
                color={"white"}
                style={styles.fabStyle}
                borderRadius={60}
                fontFamily={'AvenirNextCyr-Medium'}
                extended={true}
                visible={true}
                animateFrom={'right'}
                onPress={() => {
                    navigation.navigate("ProductionDispatch", { screen: 'add' });
                }}
            />

            <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => {
                    setIsModalVisible(false);
                }}
            >
                <View style={styles.modalView}>
                    <View style={styles.datePickerContainer}>
                        <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                            <FontAwesome
                                name="close"
                                size={30}
                                color={Colors.primary}
                                onPress={() => setIsModalVisible(false)}
                                style={{ justifyContent: "flex-end" }}
                            />
                        </View>
                        <DatePicker
                            date={selectedDate}
                            onDateChange={setSelectedDate}
                            mode="date"
                            textColor="#000"
                            style={{
                                backgroundColor: "white",
                                padding: 20,
                                borderRadius: 10,
                            }}
                        />
                        <LinearGradient
                            colors={Colors.linearColors}
                            start={Colors.start}
                            end={Colors.end}
                            locations={Colors.ButtonsLocation}
                            style={{
                                borderRadius: 50,
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <TouchableOpacity
                                style={styles.button}
                                activeOpacity={0.8}
                                onPress={applyFilter}
                            >
                                <Text style={styles.btnText}>Apply Filter</Text>
                            </TouchableOpacity>
                        </LinearGradient>
                    </View>
                </View>
            </Modal>
        </LinearGradient>
    );
};

export default ProductionList;

const styles = StyleSheet.create({
    segmentView: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderRadius: 20,
        borderColor: "#fff",
        marginHorizontal: "9%",
    },
    segmentButton: {
        flex: 1,
        paddingVertical: "3%",
        borderRadius: 19,
        backgroundColor: "transparent",
    },
    selectedSegment: {
        backgroundColor: "#fff",
    },
    segmentButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
        textAlign: "center",
    },
    selectedText: {
        color: Colors.primary,
    },
    headerView: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        height: 50,
        paddingHorizontal: "4%",
        marginTop: '2%'
    },
    whiteView: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        marginTop: "4%",
    },
    item: {
        backgroundColor: "white",
        paddingVertical: "3%",
        marginVertical: "2%",
        marginHorizontal: "4%",
        borderTopEndRadius: 13,
        borderBottomLeftRadius: 13,
        elevation: 5,
        gap: 3,
        ...globalStyles.border,
    },
    modalView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        backgroundColor: "#fff",
        width: "80%",
        alignItems: "center",
    },
    datePickerContainer: {
        backgroundColor: "white",
        padding: "5%",
        borderRadius: 10,
    },
    button: {
        justifyContent: "center",
        borderRadius: 50,
        height: 50,
    },
    btnText: {
        fontFamily: "AvenirNextCyr-Medium",
        color: "#fff",
        fontSize: 16,
    },
    filteredTextView: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: "2%",
        backgroundColor: "#fff",
        elevation: 5,
        gap: 10,
        flexDirection: "row",
    },
    filteredText: {
        fontFamily: "AvenirNextCyr-Thin",
        fontSize: 16,
        color: Colors.primary,
    },
    resetText: {
        fontSize: 16,
        color: Colors.white,
        fontWeight: "500",
    },
    moreDetailsButton: {
        backgroundColor: Colors.primary,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 5,
    },
    moreDetailsButtonText: {
        color: "white",
        fontSize: 14,
        fontWeight: "bold",
    },
    itemDetails: {
        flexDirection: "row",
        justifyContent: "flex-end",
    },
    fabStyle: {
        position: 'absolute',
        right: '4%',
        bottom: '5%',
        backgroundColor: Colors.primary,
        borderRadius: 30,
    },
    dottedLine: {
        borderBottomWidth: 1,
        borderColor: 'black',
        borderStyle: 'dashed',
    },
    dashedLineContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    dash: {
        width: 10,
        height: 1, 
        backgroundColor: 'black',
        marginRight: 5, 
    },
});
