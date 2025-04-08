import React, { useState, useContext, useRef, useEffect } from "react";
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Pressable,
    Text,
    Image,
    ScrollView,
    Modal,
    Alert,
    Keyboard
} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import globalStyles from "../../styles/globalStyles";
import Toast from "react-native-simple-toast";
import { ProgressBar } from "react-native-paper";
import Colors from "../../constants/Colors";
import { AuthContext } from "../../Context/AuthContext";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { Dropdown } from "react-native-element-dropdown";
import moment from "moment";
import LinearGradient from "react-native-linear-gradient";
import { ms, hs, vs } from "../../utils/Metrics";
import { Switch, Button, TextInput as FloatingInput } from "react-native-paper";
import { DatePickerModal, DatePickerInput } from "react-native-paper-dates";
import { LoadingView } from "../../components/LoadingView";

const AddAccount = ({ navigation, route }) => {
    const { screen, details } = route?.params
    const { userData } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [accountNo, setAccountNo] = useState(details?.acc_number);
    const [holderName, setHolderName] = useState(details?.account_holder_name);
    const [accountType, setAccountType] = useState(details?.account_type);
    const [ifsc, setIFSC] = useState(details?.ifsc_code);
    const [micr, setMICR] = useState(details?.micr_code);
    const [branch, setBranch] = useState(details?.branch_name);

    const typeData = [
        { label: "Savings", value: "Savings" },
        { label: "Current", value: "Current" },
    ];

    const handleSubmit = async () => {

        if (!accountNo || accountNo.trim().length === 0) {
            Alert.alert("Warning", "Please enter the account number.");
            return;
        }

        if (!holderName || holderName.trim().length === 0) {
            Alert.alert("Warning", "Please enter the account holder name.");
            return;
        }

        if (!accountType) {
            Alert.alert("Warning", "Please select the account type.");
            return;
        }

        if (!ifsc || ifsc.trim().length === 0) {
            Alert.alert("Warning", "Please enter the IFSC code.");
            return;
        }

        if (!micr || micr.trim().length === 0) {
            Alert.alert("Warning", "Please enter the MICR code.");
            return;
        }

        if (!branch || branch.trim().length === 0) {
            Alert.alert("Warning", "Please enter the branch name.");
            return;
        }

        setLoading(true);

        let url = screen === "add" ? 'https://gsidev.ordosolution.com/api/bank_account/' : `https://gsidev.ordosolution.com/api/bank_account/${details.id}/`

        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${userData.token}`);
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            account_holder_name: holderName,
            account_type: accountType,
            ifsc_code: ifsc,
            micr_code: micr,
            acc_number: accountNo,
            branch_name: branch,
        });

        console.log("Raw-------------------->", raw);

        var requestOptions = {
            method: screen === "add" ? "POST" : "PUT",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
        };

        try {
            const response = await fetch( url, requestOptions );

            const result = await response.json();
            if (response.status === 201 || response.status === 200) {
                if (screen === "add") {
                    Toast.show("Account added successfully", Toast.LONG);
                    navigation.goBack();
                } else {
                    Toast.show("Details updated successfully", Toast.LONG);
                    navigation.goBack();
                }
            }
            else {
                const errorMessage = result?.error || "An unexpected error occurred.";
                Alert.alert("Error", errorMessage);
            }

        } catch (error) {
            console.log("error", error);
        }
        setLoading(false);

    };


    return (
        <View style={styles.rootContainer}>
            <View >
                <LinearGradient
                    colors={Colors.linearColors}
                    start={Colors.start}
                    end={Colors.end}
                    locations={Colors.ButtonsLocation}
                    style={{
                        borderBottomRightRadius: ms(20),
                        borderBottomLeftRadius: ms(20),
                        paddingHorizontal: "5%",
                        paddingTop: "5%",

                    }}
                >
                    <View
                        style={{ flexDirection: "row", justifyContent: "space-between" }}
                    >
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

                        <View>
                            <Text
                                style={{
                                    color: "white",
                                    fontSize: ms(20),
                                    fontFamily: "AvenirNextCyr-Bold",
                                }}
                            >
                                {screen === "add" ? "Add" : 'Edit'} Account
                            </Text>
                            <Text
                                style={{
                                    color: "white",
                                    fontSize: ms(12),
                                    fontFamily: "AvenirNextCyr-Medium",
                                }}
                            >
                            </Text>
                        </View>

                        <View>
                            <Text>{"  "}</Text>
                        </View>
                    </View>

                </LinearGradient>
            </View>

            <View style={{ padding: 20, flex: 1 }}>
                <ScrollView style={{}}>
                    <FloatingInput
                        mode="outlined"
                        label="Account Number"
                        theme={{ colors: { onSurfaceVariant: "#4b0482" } }}
                        style={{ backgroundColor: "white", marginBottom: '4%' }}
                        activeOutlineColor="#4b0482"
                        outlineColor="#B6B4B4"
                        textColor="#4b0482"
                        onChangeText={(text) => setAccountNo(text)}
                        autoCapitalize="none"
                        blurOnSubmit={false}
                        keyboardType="number-pad"
                        returnKeyType="done"
                        onSubmitEditing={() => Keyboard.dismiss()} 
                        value={accountNo}
                        maxLength={16}
                    />

                    {/* <Text style={styles.label}>Vehicle Type</Text> */}
                    <Dropdown
                        style={[styles.dropdown]}
                        containerStyle={styles.dropdownContainer}
                        placeholderStyle={styles.placeholderStyle}
                        searchPlaceholder="Search"
                        selectedTextStyle={styles.selectedTextStyle}
                        itemTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        iconStyle={styles.iconStyle}
                        data={typeData}
                        maxHeight={400}
                        labelField="label"
                        valueField="value"
                        placeholder={"Please select your account type"}
                        value={accountType}
                        onChange={(item) => {
                            setAccountType(item.value);
                        }}
                    />

                    {/* <Text style={styles.label}>Driver</Text> */}


                    <FloatingInput
                        mode="outlined"
                        label="Account holder name"
                        theme={{ colors: { onSurfaceVariant: "#4b0482" } }}
                        style={{ backgroundColor: "white", marginBottom: '4%' }}
                        activeOutlineColor="#4b0482"
                        outlineColor="#B6B4B4"
                        textColor="#4b0482"
                        onChangeText={(text) => setHolderName(text)}
                        autoCapitalize="none"
                        blurOnSubmit={false}
                        // keyboardType="number-pad"
                        returnKeyType="done"
                        onSubmitEditing={() => Keyboard.dismiss()} 
                        value={holderName}
                    />

                    <FloatingInput
                        mode="outlined"
                        label="IFSC Code"
                        theme={{ colors: { onSurfaceVariant: "#4b0482" } }}
                        style={{ backgroundColor: "white", marginBottom: '4%' }}
                        activeOutlineColor="#4b0482"
                        outlineColor="#B6B4B4"
                        textColor="#4b0482"
                        onChangeText={(text) => setIFSC(text)}
                        autoCapitalize="none"
                        blurOnSubmit={false}
                        onSubmitEditing={() => Keyboard.dismiss()} 
                        // keyboardType="number-pad"
                        returnKeyType="done"
                        value={ifsc}
                    />


                    <FloatingInput
                        mode="outlined"
                        label="MICR Code"
                        theme={{ colors: { onSurfaceVariant: "#4b0482" } }}
                        style={{ backgroundColor: "white", marginBottom: '4%' }}
                        activeOutlineColor="#4b0482"
                        outlineColor="#B6B4B4"
                        textColor="#4b0482"
                        onChangeText={(text) => setMICR(text)}
                        autoCapitalize="none"
                        blurOnSubmit={false}
                        // keyboardType="number-pad"
                        onSubmitEditing={() => Keyboard.dismiss()} 
                        returnKeyType="done"
                        value={micr}
                    />

                    <FloatingInput
                        mode="outlined"
                        label="Branch"
                        theme={{ colors: { onSurfaceVariant: "#4b0482" } }}
                        style={{ backgroundColor: "white", marginBottom: '4%' }}
                        activeOutlineColor="#4b0482"
                        outlineColor="#B6B4B4"
                        textColor="#4b0482"
                        onChangeText={(text) => setBranch(text)}
                        autoCapitalize="none"
                        blurOnSubmit={false}
                        // keyboardType="number-pad"
                        onSubmitEditing={() => Keyboard.dismiss()} 
                        returnKeyType="done"
                        value={branch}
                    />


                </ScrollView>

                <LinearGradient
                    colors={Colors.linearColors}
                    start={Colors.start}
                    end={Colors.end}
                    locations={Colors.ButtonsLocation}
                    style={{
                        backgroundColor: Colors.primary,
                        borderColor: Colors.primary,
                        borderRadius: ms(25),
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "row",
                        marginTop: "8%",
                    }}
                >
                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleSubmit}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.btnText}>Submit</Text>
                    </TouchableOpacity>
                </LinearGradient>
            </View>

            <LoadingView visible={loading} message="Please wait..." />




        </View>
    );
};

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        backgroundColor: "#F2EFEF",
    },
    container: {
        paddingHorizontal: "5%",
        paddingTop: 10,
        backgroundColor: "white",
        flex: 1,
    },
    textInput: {
        borderColor: "#dedede",
        borderWidth: 1,
        backgroundColor: "white",
        height: 50,
        marginBottom: "5%",
        padding: 5,
        paddingLeft: 8,
        fontFamily: "AvenirNextCyr-Medium",
        borderRadius: 10,
    },
    button: {
        height: vs(30),
        justifyContent: "center",
        alignItems: "center",
        borderRadius: ms(5),
        marginBottom: "3%",
        marginTop: "3%",
        borderRadius: 50,
        width: "100%",
    },
    btnText: {
        fontFamily: "AvenirNextCyr-Bold",
        color: "#fff",
        fontSize: 16,
    },
    buttonview: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 16,
        color: "black",
        fontFamily: "AvenirNextCyr-Bold",
    },
    buttonText: {
        fontFamily: "AvenirNextCyr-Medium",
        color: "white",
    },
    label: {
        fontSize: 16,
        color: Colors.primary,
        fontFamily: "AvenirNextCyr-Bold",
    },
    dropdown: {
        height: 50,
        borderColor: "#dedede",
        borderWidth: 1,
        paddingHorizontal: 8,
        marginBottom: "5%",
        borderRadius: 10,
        backgroundColor: "white",
    },
    icon: {
        marginRight: 5,
    },

    placeholderStyle: {
        fontSize: 14,
        fontFamily: "AvenirNextCyr-Medium",
        color: Colors.primary
    },
    dropdownContainer: {
        backgroundColor: "white",
    },
    selectedTextStyle: {
        fontSize: 16,
        fontFamily: "AvenirNextCyr-Medium",
        color: Colors.primary
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
    labelText: {
        fontFamily: "AvenirNextCyr-Bold",
        color: Colors.primary,
        fontSize: 16,
    },
    inputContainer: {
        borderColor: "#cecece",
        borderWidth: 1,
        backgroundColor: "white",
        marginBottom: 5,
        fontFamily: "AvenirNextCyr-Medium",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderRadius: 10,
        height: "60%",
        width: "100%",
    },
    input2: {
        fontFamily: "AvenirNextCyr-Medium",
        padding: 8,
        flex: 1,
    },
    graphContainer: {
        borderRadius: 30,
        paddingVertical: "2%",
        paddingHorizontal: "2%",
        position: "relative",
        bottom: "23%",
        ...globalStyles.border,
        alignItems: "center",
    },

    header: {
        paddingVertical: 15,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 10,
    },
    iocnView: {
        backgroundColor: "#FAF7F9",
        borderWidth: 1,
        borderColor: "lightgray",
        borderRadius: 6,
        paddingHorizontal: "2%",
        paddingVertical: "2%",
    },
    ContainerBox4: {
        paddingHorizontal: "4%",
        paddingVertical: "3%",
        borderColor: "lightgray",
        flexDirection: "row",
        backgroundColor: "white",
        borderRadius: 9,
        borderWidth: 1,
        gap: 10,
    },
    DocsImg: {
        height: 55,
        width: 45,
        paddingVertical: "7%",
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        backgroundColor: "white",
        borderRadius: 10,
        padding: 20,
        width: "80%",
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 19,
        fontWeight: "bold",
        marginBottom: "8%",
    },
    modalButton: {
        backgroundColor: Colors.primary,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginBottom: 10,
        width: "90%",
        elevation: 8,
    },
    modalButtonText: {
        color: "white",
        fontSize: 16,
        textAlign: "center",
    },
    modalCancelButton: {
        backgroundColor: "red",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: "4%",
        elevation: 8,
    },
    modalCancelButtonText: {
        color: "white",
        fontSize: 16,
    },
    texts: {
        color: Colors.primary,
        marginTop: "4%",
        fontFamily: "AvenirNextCyr-Medium",
    },
});

export default AddAccount;
