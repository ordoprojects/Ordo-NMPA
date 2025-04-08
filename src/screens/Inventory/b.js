import React, { Component } from 'react';
import { Text, TextInput,ImageBackground, Dimensions, Keyboard, View, StyleSheet, Image, TouchableOpacity, Alert, SafeAreaView, FlatList, ScrollView, ActivityIndicator } from 'react-native';

import { withNavigation } from "react-navigation";
import CommonDataManager from './CommonDataManager';
import { Card } from 'native-base'
var warehouselist = [{ value: 'All' }];

// import  {Dropdown}  from 'react-native-material-dropdown';
// import { Dropdown } from 'react-native-material-dropdown-v2';

import { Dropdown } from 'react-native-material-dropdown-no-proptypes';
import globalStyles from '../../styles/globalStyles';


const GET_DATAURL = Constants.GET_URL;
var ItemArrayAdded = []
var badgecount = 0
let commonData = CommonDataManager.getInstance();
var ItemArray = []
const { height } = Dimensions.get("window");
const { width } = Dimensions.get("screen")

class Inventory extends Component {
    imgloc = require('../components1/images/barcode.png')
    constructor(props) {
        super(props);
        this.state = {
            JSONResult: [],
            data: ItemArray,
            items: [{ label: 'A', value: 'a' }, { label: 'B', value: 'b' }, { label: 'C', value: 'c' }],
            open: false,
            value: null,
            qty: 0,
            dataList: [],
            refresh: false,
            loading: false,
            searchmsg: '',
            screenheight: height,
            itemArrayPricing: [],
            showfilter: false,
            warehouse: "",
            warehousedate: [],
            open: false,
            rack: "",
            room: "",
            list: [
                {
                    id: 1,
                    title: 'Getting Started',
                    body: 'React native Accordion/Collapse component, very good to use in toggles & show/hide content'
                },
                {
                    id: 2,
                    title: 'Components',
                    body: 'AccordionList,Collapse,CollapseHeader & CollapseBody'
                }
            ],
        }
        this.arrayholder = [];
    }

    ArrowForwardClick = () => {
        Alert.alert("Loading soon")
    }
    loadInventoryItems() {

        var that = this;
        that.setState({ loading: true, showfilter: false });
        if (that.state.warehouse == "All") {
            var tempinvarray = commonData.getSkuArray();
            this.setState({ JSONResult: tempinvarray });
            that.setState({ loading: false });
            this.forceUpdate();
            return;
        }
        const warehousedetails = that.state.warehousedate.filter(item => item.name == that.state.warehouse);
        const id = warehousedetails[0].id;
        console.log(id, "warehousedetails.id;", that.state.warehouse)
        if (id == undefined)
            return;
        var raw = "{\n    \"__id__\":\"" + id + "\"\n}";

        var requestOptions = {
            method: 'POST',
            body: raw,
            redirect: 'follow'
        };

        fetch("http://143.110.178.47/OrdoCRM7126/getrecods.php", requestOptions)
            .then(response => response.json())
            .then(result => {
                var invskuArray = result[0].products;
                console.log("The sku data which come from the server here")
                console.log(invskuArray);

                // write the file

                var json = JSON.stringify(invskuArray);
                console.log(json, "this is invskuArray order array list array")
                RNFS.writeFile(inventorypath, json, 'utf8')
                    .then((success) => {
                        console.log('FILE WRITTEN!');
                    })
                    .catch((err) => {
                        console.log(err.message);
                    });
                that.setState({
                    loading: false,
                    refreshing: false
                });
                that.readInventory();
            })
            .catch(error => console.log('error', error));
        that.setState({
            loading: false,
            refreshing: false
        });


    }

    async readInventory() {

        // write the fil
        var tempskuarray = commonData.getSkuArray();
        var tempinvarray = [];
        RNFS.readFile(inventorypath, 'utf8')
            .then((contents) => {
                // log the file contents
                console.log("writting files to orders.....................")
                console.log(contents);
                console.log("Json_parse");
                console.log(JSON.parse(contents));
                console.log("Reading Order array from json and use it throughout app using common data manager")
                let temparray = JSON.parse(contents);

                console.log("temparray", tempskuarray)

                for (var i = 0; i < temparray.length; i++) {
                    for (var j = 0; j < tempskuarray.length; j++) {
                        if (temparray[i].id == tempskuarray[j].id) {


                            tempinvarray.push({
                                'itemid': temparray[i].part_number,
                                'description': temparray[i].name,
                                'price': temparray[i].price,
                                'qty': 0, 'upc': temparray[i].upc_c,
                                'category': temparray[i].category,
                                'subcategory': temparray[i].subcategory_c,
                                'unitofmeasure': temparray[i].unitofmeasure_c,
                                'manufacturer': temparray[i].manufacturer_c,
                                'class': temparray[i].class_c,
                                'pack': "12",
                                'size': "",
                                'weight': temparray[i].weight_c,
                                'extrainfo1': "",
                                'extrainfo2': "",
                                'extrainfo3': "",
                                'extrainfo4': "",
                                'extrainfo5': "",
                                'imgsrc': temparray[i].product_image,
                                'manufactured_date': temparray[i].manufactured_date_c,
                                "stock": temparray[i].stock_c,
                                "id": temparray[i].id,
                                "noofdays": 10

                            })
                        }

                    }
                }
                // commonData.setSkuArray(temparray)
                console.log("temparay array inventory")
                console.log(tempinvarray);
                this.setState({ JSONResult: tempinvarray });
                this.forceUpdate();
            })
            .catch((err) => {
                console.log(err.message, err.code);
            });

    }

    calculaterunningTotals() {

        let Qtyval = 0
        let PriceVal = 0
        let ItemVAl = this.state.dataList.length

        for (var i = 0; i < ItemVAl; i++) {
            Qtyval = Qtyval + Number(this.state.dataList[i].qty)
            if (this.state.dataList[i].price != null)
                PriceVal = PriceVal + (Number(this.state.dataList[i].qty) * Number(this.state.dataList[i].price))
        }
        console.log(PriceVal, Qtyval, ItemVAl, '++++++++++++')
        commonData.setRunningTotals(PriceVal, Qtyval, ItemVAl)

    }
    resignView() {

        ItemArrayAdded = []
        ItemArrayAdded = this.state.dataList
        const filteredData = ItemArrayAdded.filter(item => item.qty !== 0);
        ItemArrayAdded = filteredData
        commonData.setArray(ItemArrayAdded)
    }
    componentDidMount() {
        const { navigation } = this.props;
        // this.loadPricing();
        commonData.setItemArray(commonData.getSkuArray())
        this.focusListener = navigation.addListener("didFocus", () => {
            this.ReloadItems();
        });
        this.focusListener = navigation.addListener("willBlur", () => {
            this.resignView()
        });
    }

    loadwarehouse = () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "text/plain");

        var raw = "{\n    \"__module_code__\": \"PO_22\", \"__session_id__\":\"" + commonData.getsessionId() + "\",\n    \"__query__\": \"\",\n    \"__orderby__\": \"\",\n    \"__offset__\": 0,\n    \"__select _fields__\": [\"\"],\n    \"__max_result__\": 100,\n    \"__delete__\": 0\n    }\n";

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("http://143.110.178.47/OrdoCRM7126/get_data_s.php", requestOptions)
            .then(response => response.json())
            .then(result => {
                var tempwarehouse = result.entry_list;
                warehouselist = [];
                warehouselist.push({ value: "All" })
                var tempwarehousedata = []
                for (var i = 0; i < tempwarehouse.length; i++) {
                    warehouselist.push({ value: tempwarehouse[i].name_value_list.name.value });
                    tempwarehousedata.push({ "id": tempwarehouse[i].name_value_list.id.value, "name": tempwarehouse[i].name_value_list.name.value })
                }
                this.state.warehousedate = [...tempwarehousedata];
                this.forceUpdate();
            })
            .catch(error => console.log('error', error));
    }
    componentWillMount() {
        this.loadwarehouse();

    }
    componentWillUnmount() {
        // Remove the event listener
        // this.focusListener.remove();
    }


    makeRemoteRequest = () => {
        this.setState({ loading: true });
        this.setState({
            loading: false,
        });

    };
    async readSku() {


        // write the fil

        RNFS.readFile(skupath, 'utf8')
            .then((contents) => {
                // log the file contents
                console.log("writting files to orders.....................")
                console.log(contents);
                console.log("Json_parse");
                console.log(JSON.parse(contents));
                console.log("Reading Order array from json and use it throughout app using common data manager")
                let tempArray = commonData.gettypeArray(contents, 'PO_06')
                commonData.setSkuArray(tempArray)
                console.log("temparay array")
                console.log(tempArray);
            })
            .catch((err) => {
                console.log(err.message, err.code);
            });

    }

    ReloadItems() {

        this.state.value = '';
        this.state.searchmsg = ''
        ItemArrayAdded = commonData.getCurrentArray()
        this.readSku();

        ItemArray = commonData.getSkuArray()
        currentArray = commonData.getCurrentArray()
        console.log('m here ', ItemArray)

        if (commonData.isOrderOpen && (ItemArrayAdded.length > 0 || currentArray.length > 0)) {
            for (var i = 0; i < this.state.itemArrayPricing.length; i++) {
                for (var j = 0; j < ItemArray.length; j++) {
                    if (ItemArray[j].itemid == this.state.itemArrayPricing[i].name_value_list.itemkey.value) {
                        ItemArray[j].price = this.state.itemArrayPricing[i].name_value_list.pack_value_c.value;
                    }

                }
            }
            var temparray = [...ItemArray]
            var skuarray = [...temparray]
            ItemArray = commonData.getCurrentArray()
            // for(var i=0;i<temparray.length;i++){
            for (var j = 0; j < ItemArray.length; j++) {
                // if(temparray[i].itemid==ItemArray[j].itemid)
                var index = temparray.findIndex(obj => obj.itemid === ItemArray[j].itemid);
                temparray.splice(index, 1)
            }
            // }

            const mergedarray = [...ItemArray, ...temparray];
            console.log(mergedarray, '+++++++++merged array')
            ItemArray = mergedarray;
        }

        this.state.dataList = ItemArray;
        this.state.JSONResult = ItemArray;
        ItemArrayAdded = this.state.dataList
        this.forceUpdate();
        //Sort in Descending Order
        this.state.dataList.sort((a, b) => (a.itemid > b.itemid) ? 1 : -1)
        // ItemArrayAdded=this.state.dataList
        this.state.searchmsg = this.state.JSONResult.length + ' Results'
        this.forceUpdate();

    }

    searchFilterFunction = (text) => {

        this.setState({
            value: text,
        });
        if (text.length <= 0) {
            this.ReloadItems();
            Keyboard.dismiss()
            return
        }
        const newData = this.state.dataList.filter(item => {
            const itemData = `${item.itemid.toUpperCase()} ${item.description.toUpperCase()}`;
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });
        this.setState({ JSONResult: newData });

        this.forceUpdate()
    };

    loadsku() {

        var that = this;
        this.setState({ loading: true });
        // fetch("http://192.168.9.14:8080/get_data_s.php", {
        fetch(GET_DATAURL, {
            method: "POST",
            body: JSON.stringify({
                "__module_code__": "PO_20",

                "__query__": "aos_products.deleted=0",
                "__session_id__": commonData.getsessionId(),

                "__orderby__": "",
                "__offset__": 0,
                "__select _fields__": [""],
                "__max_result__": 1,
                "__delete__": 0,
            })
        }).then(function (response) {
            return response.json();
        }).then(function (result) {
            skuArray = result.entry_list;
            console.log("The sku data which come from the server here")
            console.log(skuArray);

            // write the file

            var json = JSON.stringify(skuArray);
            console.log(json, "this is sku order array list array")
            RNFS.writeFile(skupath, json, 'utf8')
                .then((success) => {
                    console.log('FILE WRITTEN!');
                })
                .catch((err) => {
                    console.log(err.message);
                });
            that.setState({
                loading: false,
                refreshing: false
            });
        }).catch(function (error) {
            console.log("-------- error ------- " + error);
        });
    }
    loadPricing = () => {

        var that = this;

        that.setState({ loading: true });

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        var raw = "{\n\"__module_code__\":\"PO_13\", \"__session_id__\":\"" + commonData.getsessionId() + "\",\n\"__query__\": \"\",\n\"__orderby__\": \"\",\n\"__offset__\": 0,\n\"__select _fields__\": [\"\"],\n\"__max_result__\": 1,\n\"__delete__\": 0\n}\n";

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("http://143.110.178.47/OrdoCRM7126/get_data_ordo.php", requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log(result.entry_list);
                that.setState({ loading: false });
                that.setState({ itemArrayPricing: result.entry_list })

                // ItemArray=[...resultArray];
                that.forceUpdate();
            })
            .catch(error => console.log('error', error));


    }
    readSku() {
        RNFS.readFile(skupath, 'utf8')
            .then((contents) => {
                // log the file contents
                console.log("writting files to orders.....................")
                console.log(contents);
                console.log("Json_parse");
                console.log(JSON.parse(contents));
                console.log("Reading Order array from json and use it throughout app using common data manager")
                let tempArray = commonData.gettypeArray(contents, 'PO_06')
                commonData.setSkuArray(tempArray)
                console.log("temparay array")
                console.log(tempArray);
            })
            .catch((err) => {
                console.log(err.message, err.code);
            });
    }
    sycnCall = () => {
        this.loadsku();
        this.readSku();
    }
    onContentSizeChange = (contentwidth, contentheight) => {
        this.setState({ screenheight: contentheight })
    }
    changewarehouse = (value) => {
        this.state.warehouse = value;
        this.loadInventoryItems();
        this.forceUpdate();
    }
    setValue = (callback) => {
        this.setState({ value: callback() })
    }

    setOpen = (open) => this.setState({ open })

    setItems = (items) => this.setState({ items })


    render() {
        const { open, value, items } = this.state

        let Title = "Warehouse Management"
        const scrollEnabled = this.state.screenheight > height;
        this.state.searchmsg = this.state.JSONResult.length + ' Results'

        if (this.state.loading == true) {
            return (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(52, 52, 52, 0.8)' }}>
                    <ActivityIndicator />
                    <Text style={{ color: 'black' }}>Loading Item , Please wait</Text>
                </View>
            );
        }
        if (this.state.showfilter == true) {
            return (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(52, 52, 52, 0.4)' }}>
                    <View style={{ width: width - 100, height: 190, alignSelf: 'center', backgroundColor: "white" }}>
                        <TouchableOpacity onPress={() => this.setState({ showfilter: false, warehouse: "", room: "", rack: "" })}><Image style={{ width: 30, height: 30, marginStart: width - 100 - 30 }} source={require('../components1/images/close_btn.png')}></Image></TouchableOpacity>
                        <View style={{ width: width - 150, height: 100, alignSelf: 'center', backgroundColor: "white" }}>
                            <Text style={{ width: width - 160, alignSelf: 'center', color: 'black' }}>Choose Warehouse</Text>
                            <Dropdown
                                label='Choose Warehouse'
                                containerStyle={{
                                    width: (width - 40) / 2 - 20
                                }}
                                onChangeText={value => this.changewarehouse(value)}
                                value={this.state.warehouse}
                                // onChangeText={value=>this.setState({warehouse:value})}
                                data={warehouselist}


                            />

                            <TouchableOpacity style={{ backgroundColor: '#6B1594', width: width - 250, alignSelf: "center", marginTop: 20, height: 30 }} onPress={() => this.loadInventoryItems()}><Text style={{ backgroundColor: '#6B1594', color: 'white', textAlign: 'center', width: width - 250, textAlignVertical: 'center', alignSelf: "center", height: 30 }}>Apply Filter</Text></TouchableOpacity>
                        </View>
                    </View>
                </View>
            );
        }
        return (


            <View style={{ backgroundColor: '#FFFFFF', flex: 1 }}>

                <View style={{ flexDirection: 'row', marginTop: 30 }}>
                    <TouchableOpacity style={{ borderRadius: 20, height: 60, width: width / 3 - 10, justifyContent: 'center', alignItems: 'center' }} onPress={() => this.props.navigation.goBack()}>
                        <Image transition={false} source={require('../components1/images/arrow.png')} style={{ height: 35, width: 35, resizeMode: "contain", alignSelf: 'center' }} />
                    </TouchableOpacity>
                    <Text style={{ marginTop: 10, color: '#6B1594', backgroundColor: ' #FFFFFF', width: width / 3 + 70, height: 50, fontFamily: 'Lato-Regular', fontWeight: 'bold', fontSize: 17, alignSelf: 'center', textAlign: "center", justifyContent: 'center' }}>{Title}</Text>

                </View>
                {(commonData.getusername() == "admin") ?
                    <View style={{ flexDirection: 'row', backgroundColor: '#FFFFFF', alignContent: 'center', justifyContent: 'center', width: '100%' }}>

                        <Card onPress={() => { commonData.setinventoryItemsArray(""); this.props.navigation.navigate('AddProduct', { "warehouse": this.state.warehousedate }) }}
                            style={[styles.signInplus, styles.shadowProp]}>
                            <Text onPress={() => { commonData.setinventoryItemsArray(""); this.props.navigation.navigate('AddProduct') }} style={styles.textSignplus}>+</Text>
                        </Card>
                        <TextInput placeholder="Enter Product # or Name"
                            onChangeText={text => this.searchFilterFunction(text)}
                            autoCorrect={false}
                            autoCompleteType='off'
                            value={this.state.value}
                            style={{
                                marginHorizontal: 10,
                                // width: 250,
                                width: width - 170,
                                height: 50,
                                color: '#534F64',
                                borderWidth: 1,
                                // alignSelf:"center",
                                // Set border Hex Color Code Here.
                                borderColor: '#CAD0D6',
                                fontFamily: 'Lato-Regular',
                                borderRadius: 10,
                                // alignSelf:"center",
                                marginTop: 10,
                                textAlign: 'center'
                            }}></TextInput>
                        <TouchableOpacity style={{
                            alignSelf: 'center', width: 90, height: 40, backgroundColor: '#ffffff', shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.5, marginHorizontal: 5,
                            shadowRadius: 2, borderRadius: 10,
                            elevation: 4,
                            ...globalStyles.border,
                        }} onPress={() => this.searchFilterFunction('')}>
                            <Text style={styles.textSign}>Clear</Text>
                            {/* <MaterialIcons name="navigate-next" color="#fff" size={20} /> */}

                        </TouchableOpacity>
                    </View> : <View style={{ flexDirection: 'row', backgroundColor: '#FFFFFF', alignContent: 'center', justifyContent: 'center', width: '100%' }}>

                        <TextInput placeholder="Enter Product # or Name"
                            onChangeText={text => this.searchFilterFunction(text)}
                            // onChangeText={(value) => this.setState({ value })}
                            autoCorrect={false}
                            autoCompleteType='off'
                            value={this.state.value}
                            style={{
                                marginHorizontal: 10,
                                // width: 250,
                                width: width - 130,
                                height: 50,
                                color: '#534F64',
                                borderWidth: 1,
                                // alignSelf:"center",
                                // Set border Hex Color Code Here.
                                borderColor: '#CAD0D6',
                                fontFamily: 'Lato-Regular',
                                borderRadius: 10,
                                // alignSelf:"center",
                                marginTop: 10,
                                textAlign: 'center'
                            }}></TextInput>
                        <TouchableOpacity style={{
                            alignSelf: 'center', width: 90, height: 40, backgroundColor: '#ffffff', shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.5, marginHorizontal: 5,
                            shadowRadius: 2, borderRadius: 10,
                            elevation: 4,
                            ...globalStyles.border,
                        }} onPress={() => this.searchFilterFunction('')}>

                            <Text style={styles.textSign}>Clear</Text>

                        </TouchableOpacity>
                    </View>}
                <View style={{ backgroundColor: '#ffffff', height: 60, width: width - 20, alignSelf: 'center', flexDirection: "row" }}>
                    <Text style={{ color: '#34495A', fontFamily: 'Lato-Regular', marginTop: 5, marginHorizontal: 20, width: width - width / 2, fontWeight: "500" }}>{this.state.searchmsg} </Text>
                    <Dropdown
                        label='Choose Warehouse'
                        containerStyle={{
                            width: (width - 40) / 2 - 10, marginHorizontal: -20
                        }}
                        onChangeText={value => this.changewarehouse(value)}
                        value={this.state.warehouse}
                        data={warehouselist}
                    />


                </View>
                <View style={{ flexGrow: 1, marginTop: -10, height: 900 }}>
                    <ScrollView style={{ backgroundColor: '#FFFFFF', }}
                        contentContainerStyle={styles.scrollview}
                        scrollEnabled={scrollEnabled}
                        onContentSizeChange={this.onContentSizeChange}>
                        <View style={{ flexGrow: 1, justifyContent: "space-between", padding: 10, backgroundColor: '#FFFFFF', marginTop: 0, height: height - 240 }}>
                            <FlatList
                                data={this.state.JSONResult}
                                renderItem={this.sampleRenderItem}
                                extraData={this.state.refresh}
                                keyExtractor={(item, index) => toString(index, item)}
                                ItemSeparatorComponent={this.renderSeparator}
                            />
                        </View>
                    </ScrollView>
                </View>

            </View>
        );
    }
    AddItemToInventory = () => {
        Alert.alert('Alert', 'You do not have an open order to add items.')
    }
    refreshDAta() {
        this.setState({ refresh: !this.state.refresh })
        ItemArrayAdded = []
        ItemArrayAdded = this.state.dataList
        const filteredData = ItemArrayAdded.filter(item => item.qty !== 0);
        ItemArrayAdded = filteredData
        //Write Data To file
        commonData.writedata(currentpath, ItemArrayAdded)
        this.forceUpdate();
    }
    AddItem = (Qty, index, type) => {

        if (commonData.isOrderOpen == true) {
            if (commonData.context == "OG" && Qty == 0) {
                Alert.alert('Warning', 'Items cannot be added to the packaged orders')
                Keyboard.dismiss()
                return;
            }
            let qtyval = Number(Qty)

            if (type == '+')
                qtyval = qtyval + 1;
            else if (type == '-') {
                //Qty value cannot be less than 0
                if (qtyval > 0)
                    qtyval = qtyval - 1;
                else
                    qtyval = 0
            }
            if (this.state.dataList[index].stock < qtyval) {
                Alert.alert("Warning", "Qty has exceeded the on hand quantity.It will be set to maximum available quantity.")
                qtyval = this.state.dataList[index].stock;
            }
            this.state.dataList[index].qty = qtyval
            this.state.JSONResult[index].qty = qtyval
            //Updates issue fix in Home Tab
            this.calculaterunningTotals();
            this.refreshDAta();
        } else {
            Alert.alert('Alert', 'You do not have an open order to add items.')
            Keyboard.dismiss()
        }
    }

    sampleRenderItem = ({ item, index }) => (

        <View style={styles.flatliststyle}>
            <ImageBackground source={require('./images/itembg.png')} style={styles.flatrecord}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flexDirection: "row", backgroundColor: '#ffffff', width: 100 }}>
                        <TouchableOpacity style={{ height: 80, width: 80, marginHorizontal: 19, marginTop: 27 }} onPress={() => this.props.navigation.navigate('Itemdetails',
                            { storeID: item.itemid, desc: item.description, onHand: item.stock, itemImage: item.imgsrc, qty: item.qty, from: 'Inventory', price: item.price, upc: item.upc, weight: item.weight, items: item })}>
                            <Image source={{ uri: item.imgsrc }} style={{ height: 80, width: 80, marginTop: 10, marginHorizontal: 10, resizeMode: 'contain' }} />
                        </TouchableOpacity>
                        <Text style={{ color: '#34495A', fontFamily: 'Lato-Regular', marginTop: 120, marginHorizontal: -80, fontWeight: "500" }}>{item.itemid}</Text>
                        {/* <Image source={require('./images/line.png')} style={{ height: 100, width: 80, marginTop: 33,marginHorizontal:63, resizeMode: 'contain' }} /> */}
                    </View>
                    <View style={{ marginHorizontal: 20, flexDirection: 'column' }}>
                        <Text style={{ color: '#7A7F85', borderBottomColor: '#7A7F85', fontFamily: 'Lato-Regular', marginTop: 23 }}>Net wt: {Number(item.weight)} {item.unitofmeasure}</Text>
                        <Image source={require('./images/dash.png')} style={{ height: 10, width: 80, resizeMode: 'contain' }} />
                        <Text style={{ color: '#34495A', fontWeight: "500", fontFamily: 'Lato-Bold', fontSize: 14, marginTop: 0, width: 190, height: 30 }}>{item.description}</Text>
                        {(Number(item.stock) > 0) ? <Text style={{ color: '#1D8815', fontFamily: 'Lato-Regular', fontSize: 12, marginTop: 0 }}>{item.stock} - Current Stock</Text> : <Text style={{ color: 'red', fontFamily: 'Lato-Regular', fontSize: 12, marginTop: 10 }}>Out of stock!!</Text>}
                        <Text style={{ color: 'grey', fontFamily: 'Lato-Bold', fontSize: 12, marginTop: 0 }}>{item.noofdays} days Older</Text>
                    </View>
                    <View style={{ height: 20, width: 60, marginHorizontal: -10, flexDirection: 'column', alignItems: 'center', marginTop: 30 }}>

                        <Text style={{ color: '#000000', borderBottomColor: '#000000', fontWeight: '100', textAlign: 'center', fontFamily: 'Lato-Bold', width: 60 }}>INR {Number(item.price)}</Text>

                    </View>

                </View>
            </ImageBackground>
        </View>


    )
}

// export default SKU;
export default withNavigation(Inventory);

const styles = StyleSheet.create({
    scrollview: {
        // flexGrow:1,
        // height:height-480
        // justifyContent: "space-between",
        // padding: 10,
    },
    flatliststyle: {
        marginTop: -12,
        height: 200,
        width: width + 50,
        backgroundColor: '#FFFFFF',
        alignSelf: 'center',
        marginVertical: -40,
        resizeMode: "contain"
    },
    flatrecord: {
        height: 180,
        width: width + 50,
        backgroundColor: '#FFFFFF',
        alignSelf: 'center',
        resizeMode: "stretch"
    },
    image: {
        height: 30,
        width: 30,
        marginHorizontal: 30,
        marginTop: 30,
        resizeMode: 'contain'

    },
    heading: {

    },
    MainContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F5F5'
    },

    TouchableOpacityStyle: {

        height: 40, width: 40, marginTop: 15
    },
    signIn: {
        width: 90,
        height: 48,
        // borderColor:'#6B1594',
        borderRadius: 8,
        // borderWidth:1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        flexDirection: 'row',
        alignSelf: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5, marginHorizontal: 5,
        shadowRadius: 2,
        elevation: 4,
        ...globalStyles.border,

    },
    textSign: {
        color: '#6B1594',
        fontWeight: 'bold',
        fontFamily: 'Lato-Bold',
        alignSelf: 'center',
        marginTop: 10
    },
    signInplus: {
        width: 40,
        height: 40,
        // borderColor:'#6B1594',
        borderRadius: 8,
        // borderWidth:1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        flexDirection: 'row',
        alignSelf: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5, marginHorizontal: 5,
        shadowRadius: 2,
        elevation: 4,
        ...globalStyles.border,

    }, shadowProp: {
        shadowColor: '#171717',
        shadowOffset: { width: -2, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    textSignplus: {
        color: '#6B1594',
        fontWeight: 'bold',
        fontSize: 27,
        fontFamily: 'Lato-Regular'
    },
    FloatingButtonStyle: {

        resizeMode: 'contain',
        width: 40,
        height: 40,
    }
})