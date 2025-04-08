import React, { useState, useEffect, useContext } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    FlatList,
    ScrollView,
    Modal,
    Button,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { AuthContext } from "../../Context/AuthContext";
import DatePicker from "react-native-date-picker";
import Foundation from "react-native-vector-icons/Foundation";
import Colors from "../../constants/Colors";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import DarkLoading from "../../styles/DarkLoading";
import { AnimatedFAB } from "react-native-paper";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useFocusEffect } from "@react-navigation/native";



const FuelHistory = ({ navigation }) => {
    const [selectedSegment, setSelectedSegment] = useState("Maintenance");
    const [maintenanceData, setMaintenanceData] = useState([]);
    const [fuelData, setFuelData] = useState([]);
    const { userData } = useContext(AuthContext);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [originalMaintenanceData, setOriginalMaintenanceData] = useState([]);
    const [originalFuelData, setOriginalFuelData] = useState([]);
    const [isFiltered, setIsFiltered] = useState(false);
    const [loading, setLoading] = useState(true);

  

    useFocusEffect(
        React.useCallback(() => {
        FetchFuelData();

        }, [userData])
      );
    

    const FetchFuelData = async () => {
        setLoading(true);
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${userData.token}`);

        var raw = "";
        var requestOptions = {
            method: "GET",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
        };

        fetch("https://gsidev.ordosolution.com/api/fuelusage/", requestOptions)
            .then((response) => response.json())
            .then(async (result) => {
                setFuelData(result);
                setOriginalFuelData(result);
                // console.log(result)
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
                console.log("error", error);
            });
    };

    const FetchMaintanaData = async () => {
        setLoading(true);
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${userData.token}`);

        var raw = "";
        var requestOptions = {
            method: "GET",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
        };

        fetch("https://gsidev.ordosolution.com/api/maintainance/", requestOptions)
            .then((response) => response.json())
            .then(async (result) => {
                setMaintenanceData(result);
                setOriginalMaintenanceData(result);
                // console.log(result)
            })
            .catch((error) => {
                setLoading(false);
                console.log("error", error);
            });
    };

    const handleSegmentChange = (segment) => {
        setSelectedSegment(segment);
    };

    const handleCellPress = (item) => {
        navigation.navigate("MaintenanceDetails", { item });
    };

    const filterByDate = () => {
        setIsModalVisible(true);
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

                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: 'center' }}>
                    <Text
                        style={{ fontSize: 18, fontFamily: "AvenirNextCyr-Bold", color: Colors.primary }}
                    >
                        {item.fuel_type}
                    </Text>
                    <Text
                        style={{ fontSize: 16, fontFamily: "AvenirNextCyr-Medium", color: Colors.primary }}
                    >
                        {item.fuel_date}
                    </Text>
                </View>
                <Text
                    style={{ fontSize: 16, fontFamily: "AvenirNextCyr-Medium", color: Colors.primary }}
                >
                    {item.vehicle_registration_no}
                </Text>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: 'center' }}>
                    <Text
                        style={{
                            fontSize: 18,
                            color: "green",
                            fontFamily: "AvenirNextCyr-Bold",
                        }}
                    >
                        {item.total_cost}
                    </Text>
                    <View style={styles.itemDetails}>
                        <MaterialIcons
                            name="navigate-next"
                            size={35}
                            color={Colors.primary}
                        />
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

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
                        fontSize: 19,
                        marginLeft: 8,
                        color: "white",
                    }}
                >
                    Fuel History
                </Text>
                <TouchableOpacity onPress={filterByDate}>
                    <Foundation name="filter" size={26} color="white" />
                </TouchableOpacity>
            </View>

            {/* <View style={styles.segmentView}>
        <TouchableOpacity
          style={[
            styles.segmentButton,
            selectedSegment === "Maintenance" && styles.selectedSegment,
          ]}
          onPress={() => {
            handleSegmentChange("Maintenance");
            resetFilter();
          }}
        >
          <Text
            style={[
              styles.segmentButtonText,
              selectedSegment === "Maintenance" && styles.selectedText,
            ]}
          >
            Maintenance
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.segmentButton,
            selectedSegment === "Fuel" && styles.selectedSegment,
          ]}
          onPress={() => {
            handleSegmentChange("Fuel");
            resetFilter();
          }}
        >
          <Text
            style={[
              styles.segmentButtonText,
              selectedSegment === "Fuel" && styles.selectedText,
            ]}
          >
            Fuel
          </Text>
        </TouchableOpacity>
      </View> */}

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
                        data={
                            fuelData
                        }
                        renderItem={renderItem}
                        keyExtractor={(index) => index.toString()}
                        style={{ marginTop: "3%" }}
                    />
                )}
            </View>

            <AnimatedFAB
                label={'Add Record'}
                icon={() => <AntDesign name="addfile" size={24} color="white" />}
                color={"white"}
                style={styles.fabStyle}
                // borderWidth={50}
                borderRadius={60}

                fontFamily={'AvenirNextCyr-Medium'}
                extended={true}

                // onPress={() => console˝.log('Pressed')}
                visible={true}
                animateFrom={'right'}
                // iconMode={'static'}
                onPress={() => {
                    navigation.navigate("FuelUsage");
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

export default FuelHistory;

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
        height: 60,
        paddingHorizontal: "4%",
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
        padding: "4%",
        marginVertical: "2%",
        marginHorizontal: "4%",
        borderTopEndRadius: 13,
        borderBottomLeftRadius: 13,
        elevation: 5,
        gap: 3
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
        // marginBottom: 35,
        right: '4%',
        bottom: '5%',
        backgroundColor: Colors.primary,
        borderRadius: 30,
        // marginRight:'3%'

    },
});
