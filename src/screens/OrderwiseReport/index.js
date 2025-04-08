

import React, { Component } from 'react';

import { Text, View,SafeAreaView, Dimensions, FlatList, ActivityIndicator, Modal, TextInput, StyleSheet, Button, AppRegistry, ScrollView, Linking, Alert, TouchableOpacity, Image, TouchableNativeFeedbackBase } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { ItemArrayAdded } from './SKU'
// import CommonDataManager from './CommonDataManager';

const { height } = Dimensions.get("window");

// let commonData = CommonDataManager.getInstance();
// import HSNZ from "react-native-marquee";
//FB#24
let screenwidth = Dimensions.get('window').width;
let screenheight = Dimensions.get('window').height;
const BannerWidth = screenwidth - 20;
const BannerHeight = screenheight / 4 - 20;
const { width } = Dimensions.get("screen")
const connection_error = 'Could not Sync With the Server.Try again later'
let connnctionFailed = false
// const Constants = require('./Constants');
if (screenwidth > 375) {
    screenwidth = 120;
} else {
    screenwidth = 110;
}
;
class OrderwiseReport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrayHolder: [{ target: "40", from: "29/06/2022", to: "22/07/2022", status: "COMPLETED", Achieved: "34", bgcolor: "#FFC0CB" }, { target: "40", from: "29/06/2022", to: "22/07/2022", status: "COMPLETED", Achieved: "40", bgcolor: '#C3FDB8' }, { target: "90", from: "29/06/2022", to: "22/07/2022", status: "COMPLETED", Achieved: "34", bgcolor: '#43C6DB' }],
            refresh: true,
            loading: false,
            pendingorders: 0,
            orderLoading: false,
            pendingdeliveries: 0,
            completeddeliveries: 0,
            compltedorders: 0,
            scheduleddeliveries: 0,
            ontransit: 0,
            credit: 0,
        }
    }
    async reset() {
        await AsyncStorage.removeItem('isLogin')
        await AsyncStorage.removeItem('Username')

    }
    getcolorcode = (value) => {
        let PINK = "#CD1422";
        let BLUE = "#2514CD";
        let GREEN = "#1E8449";
        let ORANGE = "#FF5733";
        let colorcode = PINK;
        if (value > 100)
            colorcode = BLUE;
        else if (value == 100)
            colorcode = GREEN;
        else if (value > 50 && value < 100)
            colorcode = ORANGE;
        return colorcode;
    }
    componentWillMount() {
        this.setState({ orderLoading: true });
        this.getSalesDetails();
        const { route } = this.props;
        const { sales } = route.params;

        var sales_result = sales;
        console.log(sales_result.products_array["1"]);
        this.state.data = [];
        let keys = Object.keys(sales_result.products_array);
        keys.forEach(key => {
            this.state.data.push(sales_result.products_array[key])
        });

        this.setState({ orderLoading: false });

        this.forceUpdate();
    }
    logout = () => {
        this.reset();
        //commonData.setusername('')
        this.forceUpdate();

        this.props.navigation.navigate("LoginScreen")
    }
    getstatusfor = (value, statusval) => {


        value = value * 100;
        let status = "Follow up"
        if (statusval == "Closed")
            status = "Not Achieved";
        else {
            if (value > 100)
                status = "Excellent";
            else if (value == 100)
                status = "Achieved";
            else if (value > 50 && value < 100)
                status = "Not Achieved"
        }
        return status;
    }
    SignItemsView = ({ item, index }) => (

        <View style={{ flexDirection: "row", backgroundColor: '#fffff', width: width - 60, alignSelf: 'center', height: 30, borderBottomWidth: 1 }} >
            <Text style={{ color: '#34495A', borderBottomColor: '#7A7F85', fontWeight: '500', fontFamily: 'Lato-Bold', textAlign: 'center', fontSize: 12, height: 30, textAlignVertical: 'center', borderRightWidth: 1, width: (width - 10) / 5 }}>{item.name}</Text>
            <Text style={{ color: '#34495A', borderBottomColor: '#7A7F85', fontWeight: '500', fontFamily: 'Lato-Bold', fontSize: 12, width: (width - 10) / 5, textAlignVertical: 'center', height: 40, textAlign: 'center', borderRightWidth: 1 }}>{item.annual_target}</Text>

            <View style={{ flex: 1, flexDirection: 'row' }}>
                <Text style={{ color: '#34495A', borderBottomColor: '#7A7F85', fontWeight: '500', fontFamily: 'Lato-Bold', fontSize: 12, textAlignVertical: 'center', height: 30, textAlign: 'center', borderRightWidth: 1, flex: 0.25 }}>{item.q1_achieved_target}</Text>
                <Text style={{ color: '#34495A', borderBottomColor: '#7A7F85', fontWeight: '500', fontFamily: 'Lato-Bold', fontSize: 12, textAlignVertical: 'center', height: 30, textAlign: 'center', borderRightWidth: 1, flex: 0.25 }}>{item.q2_achieved_target}</Text>
                <Text style={{ color: '#34495A', borderBottomColor: '#7A7F85', fontWeight: '500', fontFamily: 'Lato-Bold', fontSize: 12, textAlignVertical: 'center', height: 30, textAlign: 'center', borderRightWidth: 1, flex: 0.25 }}>{item.q3_achieved_target}</Text>
                <Text style={{ color: '#34495A', borderBottomColor: '#7A7F85', fontWeight: '500', fontFamily: 'Lato-Bold', fontSize: 12, textAlignVertical: 'center', height: 30, textAlign: 'center', borderRightWidth: 0, flex: 0.25 }}>{item.q4_achieved_target}</Text>
            </View>
        </View>
    )
    getmonth = (dateval) => {

        let date = new Date(dateval); // 2020-06-21.
        let longMonth = date.toLocaleString('en-us', { month: 'short' }); /* June */
        let year = dateval.split("-")[0]
        let month = longMonth.split(" ")[1]
        console.log("Date&&**********", longMonth);
        return longMonth + "-" + year;
    }
    getSalesDetails = () => {
        var temparray = [];
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Cookie", "sugar_user_theme=SuiteP");

        var raw = JSON.stringify({
            "__initiated_by__": 'sales1'
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("https://dev.ordo.primesophic.com/delivery_status_count.php", requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log("sales target", result);
                var res = result.order_status
                this.setState({
                    pendingorders: 0,
                    pendingdeliveries: Number(res["Delivery Assigned"]) + Number(res["Confirmed"]),
                    completeddeliveries: res["Delivered"],
                    compltedorders: res["Confirmed"],
                    ontransit: res["In Transit"]
                });
                var resultval = result.sales_target;
                for (let i = 0; i < resultval.entry_list.length && i < 3; i++) {

                    console.log(resultval.entry_list[i].name_value_list.valid_from.value, "result.entry_list[i].name_value_list.valid_from.value");
                    let Achieved = resultval.entry_list[i].name_value_list.achieved.value;
                    let targetscore = resultval.entry_list[i].name_value_list.target_scheduled.value;
                    let score = Achieved / targetscore;
                    temparray.push({ target: resultval.entry_list[i].name_value_list.target_scheduled.value, from: resultval.entry_list[i].name_value_list.valid_from.value, to: resultval.entry_list[i].name_value_list.valid_to.value, status: this.getstatusfor(Number(score), resultval.entry_list[i].name_value_list.status.value), Achieved: resultval.entry_list[i].name_value_list.achieved.value, bgcolor: this.getcolorcode(Number(targetscore) - Number(Achieved)), mothdate: this.getmonth(resultval.entry_list[i].name_value_list.valid_from.value) });
                }
                let sortedarray = [];
                if (temparray.length > 0)
                    sortedarray = temparray.sort((a, b) => (a.valid_from > b.valid_from) ? -1 : 1)

                this.setState({ arrayHolder: sortedarray, loading: false });
                this.forceUpdate();

            })
            .catch(error => console.log('error', error));
    }
    getDashboardDetails = () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        //let uname = commonData.getusername();
        var raw = JSON.stringify({ "__module_code__": "PO_15", "__session_id__": '', "__query__": "", "__order_by__": "valid_to DESC" });
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch('https://dev.ordo.primesophic.com/get_data_s_v2.php', requestOptions)
            .then(response => response.json())
            .then(result => {
                let temparray = [];
                let arrayHolder = [];
                console.log("result.entry_list.length", result.entry_list.length.toString())
                for (let i = 0; i < result.entry_list.length; i++) {
                    if (i == 3) break;
                    console.log(result.entry_list[i].name_value_list.valid_from.value, "result.entry_list[i].name_value_list.valid_from.value");
                    let Achieved = result.entry_list[i].name_value_list.achieved.value;
                    let targetscore = result.entry_list[i].name_value_list.target_scheduled.value;
                    let score = Achieved / targetscore;
                    temparray.push({ target: result.entry_list[i].name_value_list.target_scheduled.value, from: result.entry_list[i].name_value_list.valid_from.value, to: result.entry_list[i].name_value_list.valid_to.value, status: this.getstatusfor(Number(score)), Achieved: result.entry_list[i].name_value_list.achieved.value, bgcolor: this.getcolorcode(Number(targetscore) - Number(Achieved)), mothdate: this.getmonth(result.entry_list[i].name_value_list.valid_from.value) });
                }
                this.setState({ arrayHolder: temparray, loading: false });
                this.forceUpdate();
            })
            .catch(error => console.log('error', error));

    }
    render() {
        let PINK = "#CD1422";
        let BLUE = "#2514CD";
        let GREEN = "#1E8449";
        let ORANGE = "#FF5733";
        const scrollEnabled = this.state.screenheight > 200;
        if (this.state.loading == true) {
            return (<View style={{ flex: 1, justifyContent: 'center', backgroundColor: '#FFFFFF' }}>
                <ActivityIndicator
                    animating={true}
                    color={'#6B1594'}
                    size="large" />

                <Text style={{ alignSelf: 'center', color: '#21283d' }}> Loading,Please wait</Text>
            </View>);
        }

        return (
            <SafeAreaView style={{ backgroundColor: '#ffffff', flex: 1 }}>
                <View style={{ backgroundColor: 'white', height: height - 50 }}>


                    <Image transition={false} source={require('../../assets/images/ordologo-bg.png')} style={{ marginTop: 10, height: 50, width: 100, resizeMode: "cover", alignSelf: 'center' }} ></Image>
                    {/* </View> */}
                    <View style={{ flexDirection: 'row', marginTop: 0, backgroundColor: 'white' }}>
                        <TouchableOpacity style={{ borderRadius: 20, height: 60, width: width / 3 - 20, justifyContent: 'center', alignItems: 'center' }} onPress={() => this.props.navigation.goBack()}>
                            <Image transition={false} source={require('../../assets/images/ordologo.png')} style={{ height: 35, width: 35, resizeMode: "contain", alignSelf: 'center' }} />
                        </TouchableOpacity>
                        <Text style={{ width: width / 2 - 10, alignSelf: 'center', textAlign: 'center', fontFamily: 'Lato-Bold', fontSize: 20 }}>My Insights<Text style={{ fontFamily: "Lato-Bold", fontSize: 12 }}>{"\n"}(Sales Dashboard)</Text></Text>

                    </View>
                    <View style={{
                        marginTop: 0, height: screenheight / 2 + 2, flexDirection: 'column', backgroundColor: '#ffffff', alignSelf: 'center', width: width - 20, alignSelf: 'center', alignItems: 'center'
                    }}>

                        <View style={{ flex: 1, flexDirection: 'row', marginTop: 30 }}>
                            <View style={{
                                flex: 0.2, backgroundColor: 'white', width: 10, height: 60, borderRadius: 4,
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.5, marginHorizontal: 5,
                                shadowRadius: 2,
                                elevation: 4, backgroundColor: 'white',
                                alignSelf: 'center',
                                borderRadius: 15
                            }}>


                                <Text style={{ fontFamily: "Lato-Bold", height: 30, textAlignVertical: 'center', fontSize: 15, color: '#6B1594', textAlignVertical: 'center', width: 10, alignSelf: 'center', textAlign: 'left' }}>{this.state.pendingdeliveries}</Text>
                                <Text style={{ fontFamily: "Lato-Bold", fontSize: 10, color: '#707070', alignSelf: 'center', textAlign: 'left' }}>Pending Deliveries</Text>
                            </View>


                            <View style={{ backgroundColor: 'white', width: 2, height: 60 }}></View>

                            <View style={{
                                flex: 0.2, backgroundColor: 'white', width: 10, height: 60, borderRadius: 4,
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.5, marginHorizontal: 5,
                                shadowRadius: 2,
                                elevation: 4, backgroundColor: 'white',
                                alignSelf: 'center',
                                borderRadius: 15
                            }}>


                                <Text style={{ fontFamily: "Lato-Bold", height: 30, textAlignVertical: 'center', fontSize: 15, color: '#6B1594', textAlignVertical: 'center', width: 10, alignSelf: 'center', textAlign: 'left' }}>{5}</Text>
                                <Text style={{ fontFamily: "Lato-Bold", fontSize: 10, color: '#707070', alignSelf: 'center', textAlign: 'center' }}>Pending Orders</Text>
                            </View>
                            <View style={{ backgroundColor: 'white', width: 2, height: 60 }}></View>

                            <View style={{
                                flex: 0.2, backgroundColor: 'white', width: 10, height: 60, borderRadius: 4,
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.5, marginHorizontal: 5,
                                shadowRadius: 2,
                                elevation: 4, backgroundColor: 'white',
                                alignSelf: 'center',
                                borderRadius: 15
                            }}>


                                <Text style={{ fontFamily: "Lato-Bold", height: 30, textAlignVertical: 'center', fontSize: 15, color: '#6B1594', textAlignVertical: 'center', width: 10, alignSelf: 'center', textAlign: 'left' }}>{this.state.completeddeliveries}</Text>
                                <Text style={{ fontFamily: "Lato-Bold", fontSize: 10, color: '#707070', alignSelf: 'center', textAlign: 'center' }}>Completed Deliveries</Text>
                            </View>
                            <View style={{ backgroundColor: 'white', width: 2, height: 60 }}></View>

                            <View style={{
                                flex: 0.2, backgroundColor: 'white', width: 10, height: 60, borderRadius: 4,
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.5, marginHorizontal: 5,
                                shadowRadius: 2,
                                elevation: 4, backgroundColor: 'white',
                                alignSelf: 'center',
                                borderRadius: 15
                            }}>


                                <Text style={{ fontFamily: "Lato-Bold", height: 30, textAlignVertical: 'center', fontSize: 15, color: '#6B1594', textAlignVertical: 'center', width: 10, alignSelf: 'center', textAlign: 'left' }}>{this.state.ontransit}</Text>
                                <Text style={{ fontFamily: "Lato-Bold", fontSize: 10, color: '#707070', alignSelf: 'center', textAlign: 'left' }}>Deliveries on Transit</Text>
                            </View>
                            <View style={{ backgroundColor: 'white', width: 2, height: 60 }}></View>

                            <View style={{
                                flex: 0.2, backgroundColor: 'white', width: 10, height: 60, borderRadius: 4,
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.5, marginHorizontal: 5,
                                shadowRadius: 2,
                                elevation: 4, backgroundColor: 'white',
                                alignSelf: 'center',
                                borderRadius: 15
                            }}>


                                <Text style={{ fontFamily: "Lato-Bold", height: 30, textAlignVertical: 'center', fontSize: 15, color: '#6B1594', textAlignVertical: 'center', width: 10, alignSelf: 'center', textAlign: 'left' }}>{this.state.credit}</Text>
                                <Text style={{ fontFamily: "Lato-Bold", fontSize: 10, color: '#707070', alignSelf: 'center', textAlign: 'center' }}>Total  Credits</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'column', backgroundColor: '#FFFFFF', alignSelf: 'center', marginTop: 40 }}>
                            <Text style={{ width: width - 60, marginTop: 10, fontWeight: '700', alignSelf: 'center', fontFamily: 'Lato-Bold', paddingBottom: 10 }}>Product Target Achievement</Text>
                            <ScrollView style={{ backgroundColor: '#FFFFFF' }}
                                onContentSizeChange={this.onContentSizeChange}>
                                <View style={{ flexGrow: 1, justifyContent: "space-between", backgroundColor: '#FFFFFF', height: 150 }}>
                                    <View style={{ flexDirection: "row", backgroundColor: '#F1F2F1', width: width - 60, alignSelf: 'center', height: 40 }} >
                                        <Text style={{ color: '#34495A', borderBottomColor: '#7A7F85', fontWeight: '700', fontFamily: 'Lato-Bold', textAlign: 'center', fontSize: 12, height: 40, textAlignVertical: 'center', borderRightWidth: 1, width: (width - 10) / 5 }}>Product Id </Text>
                                        <Text style={{ color: '#34495A', borderBottomColor: '#7A7F85', fontWeight: '700', fontFamily: 'Lato-Bold', fontSize: 12, width: (width - 10) / 5, textAlignVertical: 'center', height: 40, textAlign: 'center', borderRightWidth: 1 }}>Annual Target(Qty)</Text>

                                        <View style={{ flex: 1, flexDirection: 'column' }}>
                                            <View style={{ flex: 0.5, flexDirection: 'row', borderBottomWidth: 1 }}>
                                                <Text style={{ color: '#34495A', borderBottomColor: '#7A7F85', fontWeight: '700', fontFamily: 'Lato-Bold', fontSize: 12, textAlignVertical: 'center', height: 20, textAlign: 'center', flex: 1 }}>Sales Target Achieved</Text>

                                            </View>
                                            <View style={{ flex: 0.5, flexDirection: 'row' }}>
                                                <Text style={{ color: '#34495A', borderBottomColor: '#7A7F85', fontWeight: '500', fontFamily: 'Lato-Bold', fontSize: 12, textAlignVertical: 'center', height: 20, textAlign: 'center', borderRightWidth: 1, flex: 0.25 }}>Q1</Text>
                                                <Text style={{ color: '#34495A', borderBottomColor: '#7A7F85', fontWeight: '500', fontFamily: 'Lato-Bold', fontSize: 12, textAlignVertical: 'center', height: 20, textAlign: 'center', borderRightWidth: 1, flex: 0.25 }}>Q2</Text>
                                                <Text style={{ color: '#34495A', borderBottomColor: '#7A7F85', fontWeight: '500', fontFamily: 'Lato-Bold', fontSize: 12, textAlignVertical: 'center', height: 20, textAlign: 'center', borderRightWidth: 1, flex: 0.25 }}>Q3</Text>
                                                <Text style={{ color: '#34495A', borderBottomColor: '#7A7F85', fontWeight: '500', fontFamily: 'Lato-Bold', fontSize: 12, textAlignVertical: 'center', height: 20, textAlign: 'center', borderRightWidth: 0, flex: 0.25 }}>Q4</Text>
                                            </View>
                                        </View>
                                    </View>
                                    {this.state.orderLoading == false ?

                                        <FlatList

                                            data={this.state.data}
                                            extraData={this.state.refresh}
                                            renderItem={this.SignItemsView}
                                            keyExtractor={(item, index) => toString(index)}
                                        /> : <ActivityIndicator />

                                    }
                                </View>
                            </ScrollView>

                        </View>
                    </View>



                </View>
                <Text style={{ alignSelf: 'center', fontFamily: 'Lato-Bold', color: 'black', marginBottom: 10 }}>©2023 PrimeSophic. All rights reserved.</Text>

            </SafeAreaView>
        );
    }
}
const styles = StyleSheet.create({
    cardContainer: {
        marginTop: 10,
        overflow: 'hidden',
        height: 100,
        width: 150,
        borderRadius: 10,
        backgroundColor: 'red',
        marginHorizontal: 5,
        elevation: 3,
        marginVertical: 10,

        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 2,
        shadowOpacity: 0.4
    },
    DashBoardArrayViewContainer: {
        width: Dimensions.get('window').width / 3,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        margin: 1,
        color: 'red',
        backgroundColor: 'white',
    },
    DashBoardIconView: {
        height: 30,
        width: 30
    },
    DashBoardTextView: {
        fontSize: 12,
        paddingHorizontal: 1,
        marginTop: 5,
        // fontFamily: Fonts.Poppins,
    },
    shadowStyle: {
        marginTop: 10,
        overflow: 'hidden',
        height: 35,
        width: 100,
        borderRadius: 10,
        backgroundColor: 'red',
        marginHorizontal: 5,
        elevation: 3,
        marginVertical: 20,
        shadowColor: 'red',
        shadowOffset: { width: 80, height: 80 },
        shadowRadius: 10,
        shadowOpacity: 0.8,
        alignItems: 'center'
    },
    input: {
        width: 200,
        color: '#534F64',
        alignSelf: "center",
        marginTop: 10,
        fontFamily: 'Lato-Bold'
    },
    submitButton: {
        padding: 10,
        margin: 15,
        height: 60,
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ecf0f1',
        marginTop: 30
    },

    flatliststyle: {
        marginTop: 1,
        overflow: 'hidden',
        borderRadius: 10,
        backgroundColor: '#ffffff',
        marginHorizontal: 5,
        elevation: 3,
        marginVertical: 1,
        shadowColor: '#534F64',
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 2,
        shadowOpacity: 0.4,
        alignContent: 'center',
    },
    modal: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#00ff00',
        padding: 100
    },
    text: {
        color: '#3f2949',
        marginTop: 10,
        fontFamily: 'Lato-Bold'
    },
    textOrder: {
        color: '#00ACEA',
        fontSize: 27,
        marginHorizontal: -25,
        fontWeight: 'bold',
        fontFamily: 'Lato-Bold'
        // fontWeight:'bold'

    },
    textPrime: {
        color: '#34495A',
        fontSize: 27,
        marginHorizontal: 27,
        fontWeight: 'bold',
        fontFamily: 'Lato-Bold',
        fontWeight: "500"
        // fontWeight:'bold'
    },
    RunningText: {
        color: '#DCDCDE',
        fontSize: 17,
        fontWeight: 'bold'
    },
    TextInputStyleClass: {

        // Setting up Hint Align center.
        textAlign: 'center',
        alignSelf: 'center',
        // Setting up TextInput height as 50 pixel.
        height: 40,
        width: 150,
        padding: 10,
        // Set border width.
        borderWidth: 2,
        color: '#DCDCDE',
        // Set border Hex Color Code Here.
        borderColor: '#00ACEA',
        fontFamily: 'Lato-Bold',

        // Set border Radius.
        borderRadius: 25,

        //Set background color of Text Input.
        backgroundColor: "#00ACEA",
        fontFamily: 'Lato-Bold'
    },
    MainContainer: {

        flex: 1,
        paddingTop: 30,
        justifyContent: 'center',
        alignItems: 'center'

    },

    LinearGradientStyle: {
        height: 100,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 5,
        marginBottom: 20,
        borderEndColor: 'black',
        backgroundColor: 'red'
    },
    signIn: {
        width: 300,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        flexDirection: 'row',
        alignSelf: 'center', marginTop: -10,
        borderRadius: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5, marginHorizontal: 5,
        shadowRadius: 2,
        elevation: 4,
        fontFamily: 'Lato-Bold'
    },
    textSign: {
        color: '#6B1594',
        fontFamily: "Lato-Bold",
        fontWeight: 'bold',
        backgroundColor: 'white'

    },
    buttonText: {
        fontSize: 18,
        textAlign: 'center',
        margin: 7,
        color: '#fff',
        backgroundColor: 'transparent'

    },
    badgeStyle: {
        position: 'absolute',
        top: -4,
        right: -4
    },
    button: {
        shadowColor: 'rgba(0,0,0, 1.0)', // IOS
        shadowOffset: { height: 10, width: 0 }, // IOS
        shadowOpacity: 0.53, // IOS
        shadowRadius: 13.97, //IOS
        backgroundColor: '#fff',
        elevation: 21, // Android
        height: 50,
        width: 100,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    recoredbuttonStyle: {
        borderRadius: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5, marginHorizontal: 5,
        shadowRadius: 2,
        elevation: 4,
        height: 60,
        width: 30,
        backgroundColor: 'white',
        alignSelf: 'center',
        //  justifyContent:'center',
        borderRadius: 15
    }, targetviewstyle: {
        //   borderRadius:4, 
        //   shadowColor: '#000',
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.5, marginHorizontal:5,
        // shadowRadius: 2,
        // elevation: 4 ,
        marginTop: 20,
        width: width - 20,
        height: (height / 3) - 40,
        backgroundColor: 'white',
        alignSelf: 'center',
        //  justifyContent:'center',
        borderRadius: 15
    },
    flatliststyle1: {

        height: 50,
        // padding:10,
        alignContent: 'center',
        width: width - 20,
        // backgroundColor: 'red',
        alignSelf: 'center',
        resizeMode: "contain",

    },
});
export default OrderwiseReport;