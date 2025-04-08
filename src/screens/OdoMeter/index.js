import React, { useState, useCallback, useContext, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    FlatList,
    ScrollView,
    Modal,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { AuthContext } from "../../Context/AuthContext";
import Colors from "../../constants/Colors";
import DarkLoading from "../../styles/DarkLoading";
import { AnimatedFAB, Searchbar, Button, ActivityIndicator } from "react-native-paper";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useFocusEffect } from "@react-navigation/native";
import DashedLine from 'react-native-dashed-line';
import Toast from "react-native-simple-toast";
import globalStyles from "../../styles/globalStyles";
import placeholderImage from "../../assets/images/noImagee.png"; 

const OdoMeter = ({ navigation }) => {
    const [maintenanceData, setMaintenanceData] = useState([]);
    const [fuelData, setFuelData] = useState([]);
    const { userData } = useContext(AuthContext);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [originalMaintenanceData, setOriginalMaintenanceData] = useState([]);
    const [originalFuelData, setOriginalFuelData] = useState([]);
    const [isFiltered, setIsFiltered] = useState(false);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [offset, setOffset] = useState(0);
    const [loadingMore, setLoadingMore] = useState(false);
    const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [loadingEndImage, setLoadingEndImage] = useState(true);
    const [loadingEndImage1, setLoadingEndImage1] = useState(true);
    const [loadingEndImage3, setLoadingEndImage3] = useState(true);
    const [isFullScreenVisible, setIsFullScreenVisible] = useState(false);
    const [fullScreenImageUri, setFullScreenImageUri] = useState(null);

    // States to handle image load errors
    const [startImageError, setStartImageError] = useState(false);
    const [endImageError, setEndImageError] = useState(false);
    const [fullScreenImageError, setFullScreenImageError] = useState(false);

    const openFullScreenImage = (uri) => {
        setFullScreenImageUri(uri);
        setIsFullScreenVisible(true);
        setIsDetailsModalVisible(false);
    };

    const closeFullScreenImage = () => {
        setIsFullScreenVisible(false);
        if (selectedItem) {
            setIsDetailsModalVisible(true);
        }
    };
    

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
        }, [offset ,userData])
    );


    useEffect(()=>{
        searchData();
    },[search])

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

        fetch(`https://gsidev.ordosolution.com/api/odometer_list/?limit=10&offset=${offset}&search=${search}`, requestOptions)
            .then((response) => response.json())
            .then(async (result) => {
                if (result.length > 0) {
                    if (offset === 0) {
                        setFuelData(result);
                        setOriginalFuelData(result);
                    } else {
                        setFuelData((prevData) => [...prevData, ...result]);
                        setOriginalFuelData((prevData) => [...prevData, ...result]);
                    }
                    setLoading(false);
                    setLoadingMore(false);
                } else {
                    setLoading(false);
                    Toast.show("Reached End", Toast.LONG);
                    setLoadingMore(false);
                }
            })
            .catch((error) => {
                setLoading(false);
                setLoadingMore(false);
                console.log("error", error);
            });
    };

    const searchData = async () => {
        setLoading(true);
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${userData.token}`);

        var requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow",
        };

        fetch(`https://gsidev.ordosolution.com/api/odometer_list/?limit=10&offset=0&search=${search}`, requestOptions)
            .then((response) => response.json())
            .then(async (result) => {
                    setFuelData(result);
                    setOriginalFuelData(result);
                    setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
                console.log("error", error);
            });
    };

    const handleCellPress = (item) => {
        setSelectedItem(item);
        setIsDetailsModalVisible(true);
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

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: '4%' }}>
                <View style={{ alignItems: 'center', justifyContent: 'center',width:'25%'}}>
                    <Text
                        style={{ fontSize: 15, fontFamily: "AvenirNextCyr-Medium", color: Colors.black, }}
                    >
                        No. {item?.id}
                    </Text>
                    </View>
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
    <Text
        style={{ 
            fontSize: 17, 
            fontFamily: "AvenirNextCyr-Bold", 
            color: Colors.primary, 
            textAlign: 'center' 
        }}
    >
        {item?.registration_no}
    </Text>
</View>
<View style={{ alignItems: 'center', justifyContent: 'center' ,width:'25%'}}>
                    <Text
                        style={{ fontSize: 15, fontFamily: "AvenirNextCyr-Bold", color: Colors.black, }}
                    >
                        {item?.driver_name}
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
                    <View style={{ flex: 0.2, justifyContent: 'center', alignItems: 'center' }}>
                        <MaterialCommunityIcons name="truck-fast" size={24} color="black" />
                    </View>
                    <View style={{ flexDirection: 'row-reverse', flex: 0.3, alignItems: 'flex-end' }}>

                        <Image
                            style={{ height: "110%", resizeMode: "contain", right: 20 }}
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
                <>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: '1%', backgroundColor: 'rgba(111, 64, 172, 0.1)', paddingVertical: '1%' }}>
                        <Text
                            style={{ fontSize: 14, fontFamily: "AvenirNextCyr-Medium", color: Colors.black, paddingHorizontal: '4%' }}>
                            STARTED
                        </Text>

                        <Text
                            style={{ fontSize: 14, fontFamily: "AvenirNextCyr-Medium", color: Colors.black, paddingHorizontal: '4%' }}>
                            { item?.start_odometer_date ? formatDate(item?.start_odometer_date) : '---'}
                        </Text>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: '1%', backgroundColor: 'rgba(193, 71, 97, 0.1)', paddingVertical: '1%' }}>
                        <Text
                            style={{ fontSize: 14, fontFamily: "AvenirNextCyr-Medium", color: Colors.black, paddingHorizontal: '4%' }}
                        >
                            ENDED
                        </Text>

                        <Text
                            style={{ fontSize: 14, fontFamily: "AvenirNextCyr-Medium", color: Colors.black, paddingHorizontal: '4%' }}>
                            { item?.end_odometer_date ? formatDate(item?.end_odometer_date): '---' }
                        </Text>
                    </View>
                </>
            </View>
        </TouchableOpacity>
    );

    const handleLoadMore = async () => {
        setOffset((prevOffset) => prevOffset + 10);
    };

    return (
        <LinearGradient
            colors={Colors.linearColors}
            start={Colors.start}
            end={Colors.end}
            locations={Colors.location}
            style={{
                flex: 1,
            }}
        >
            <View style={styles.headerView}>
                <TouchableOpacity
                    onPress={() => {
                        navigation.goBack();
                    }}
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
                    Odo Meter Tracking
                </Text>
                <View />
            </View>

            <Searchbar
                style={{
                    marginHorizontal: "3%",
                    backgroundColor: "white",
                    height: 50
                }}
                placeholder="Search Routes"
                onChangeText={(val) => { setSearch(val) }}
                value={search}
            />

            <View style={styles.whiteView}>
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
                    <FlatList
                    data={fuelData}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    style={{ marginTop: "2%" }}
                    ListFooterComponent={
                        fuelData?.length > 0 && fuelData.length >= 10 ? (
                            loadingMore ? (
                                <ActivityIndicator style={{ paddingVertical: 5 }} />
                            ) : (
                                <Button onPress={handleLoadMore}>Load More</Button>
                            )
                        ) : null
                    }
                    ListEmptyComponent={
                        !loading && (
                            <View style={styles.emptyComponent}>
                                <Text style={styles.emptyText}>No data found</Text>
                            </View>
                        )
                    }
                />

                )}
            </View>

            {/* Details Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isDetailsModalVisible}
                onRequestClose={() => setIsDetailsModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity
                            onPress={() => {
                                setIsDetailsModalVisible(false);
                            }}
                            style={styles.closeButton}
                        >
                            <AntDesign name="close" size={30} color="black" />
                        </TouchableOpacity>
                        {selectedItem && (
                            <ScrollView contentContainerStyle={styles.modalDetails}>
                                <Text style={styles.modalTitle}>Odometer Details</Text>

                                <Text style={styles.modalText}>Start Odometer: {selectedItem?.start_odometer}</Text>
                                {/* {loadingEndImage1 && <ActivityIndicator size="small" color="#0000ff" />} */}

                                <TouchableOpacity onPress={() => openFullScreenImage(selectedItem?.start_odometer_img_url)}>
                                    <Image
                                        source={
                                            startImageError || !selectedItem?.start_odometer_img_url
                                                ? placeholderImage
                                                : { uri: selectedItem?.start_odometer_img_url }
                                        }
                                        style={styles.modalImage}
                                        onLoadStart={() => {
                                            setLoadingEndImage1(true);
                                            setStartImageError(false);
                                        }}
                                        onLoadEnd={() => setLoadingEndImage1(false)}
                                        onError={() => setStartImageError(true)}
                                    />
                                </TouchableOpacity>

                                <Text style={styles.modalText}>End Odometer: {selectedItem?.end_odometer}</Text>
                                {/* {loadingEndImage && <ActivityIndicator size="small" color="#0000ff" />} */}
                                <TouchableOpacity onPress={() => openFullScreenImage(selectedItem?.end_odometer_img_url)}>
                                    <Image
                                        source={
                                            endImageError || !selectedItem?.end_odometer_img_url
                                                ? placeholderImage
                                                : { uri: selectedItem?.end_odometer_img_url }
                                        }
                                        style={styles.modalImage}
                                        onLoadStart={() => {
                                            setLoadingEndImage(true);
                                            setEndImageError(false);
                                        }}
                                        onLoadEnd={() => setLoadingEndImage(false)}
                                        onError={() => setEndImageError(true)}
                                    />
                                </TouchableOpacity>
                            </ScrollView>
                        )}
                    </View>
                </View>
            </Modal>

            {/* Full-Screen Image Modal */}
            <Modal
                visible={isFullScreenVisible}
                transparent={true}
                onRequestClose={closeFullScreenImage}
            >
                <View style={styles.fullScreenContainer}>
                    {fullScreenImageUri && (
                        <Image
                            source={
                                fullScreenImageError || !fullScreenImageUri
                                    ? placeholderImage
                                    : { uri: fullScreenImageUri }
                            }
                            style={styles.fullScreenImage}
                            resizeMode="contain"
                            onLoadStart={() => {
                                setLoadingEndImage3(true);
                                setFullScreenImageError(false);
                            }}
                            onLoadEnd={() => setLoadingEndImage3(false)}
                            onError={() => setFullScreenImageError(true)}
                        />
                    )}
                    <TouchableOpacity
                        style={styles.fullScreenCloseButton}
                        onPress={closeFullScreenImage} 
                    >
                        <AntDesign name="close" size={30} color="white" />
                    </TouchableOpacity>
                </View>
            </Modal>
        </LinearGradient>
    );
};

export default OdoMeter;

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
        width: "90%",
        alignItems: "center",
        borderRadius: 10,
        padding: 20,
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
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalDetails: {
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
        color: "black",
    },
    modalText: {
        fontSize: 16,
        marginBottom: 10,
        color: "black",
    },
    modalImage: {
        width: 200,
        height: 200,
        resizeMode: "cover", // Changed to 'cover' for better placeholder handling
        marginBottom: 20,
        borderRadius: 10, // Optional: Adds rounded corners to images
        backgroundColor: "#e0e0e0", // Optional: Adds a background color while loading
    },
    closeButton: {
        position: "absolute",
        top: 10,
        right: 10,
        zIndex: 1,
    },
    fullScreenContainer: {
        flex: 1,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullScreenImage: {
        width: '100%',
        height: '100%',
    },
    fullScreenCloseButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        backgroundColor: Colors.primary,
        borderRadius: 20,
        padding: 3,
    },
    activityIndicator: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },emptyComponent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    emptyText: {
        fontSize: 18,
        color: 'gray',
    },
});
