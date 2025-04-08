import React, { useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    ScrollView,
    Image,
    Modal,
    FlatList
} from 'react-native';
import { useState, useRef, useContext } from 'react';
import Colors from '../../constants/Colors';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import { Table, TableWrapper, Row, Cell } from 'react-native-reanimated-table';
import RBSheet from 'react-native-raw-bottom-sheet';
import { Searchbar, Checkbox, RadioButton } from "react-native-paper";
import { AuthContext } from "../../Context/AuthContext";
import Icon from "react-native-vector-icons/FontAwesome";
import { Dropdown } from "react-native-element-dropdown";

const GeneralLegder = ({ navigation }) => {
    const { token, userData, changeDealerData } = useContext(AuthContext);
    const [isFocus3, setIsFocus3] = useState(false);
    const [isFocus, setIsFocus] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [videoModal, setVideoModal] = useState(false);
    const [selectedValue1, setSelectedValue1] = useState(null);
    const [total, setTotal] = useState('');
    const [selectedRowData, setSelectedRowData] = useState(null);
    const [tableHeight, setTableHeight] = useState(0);
    const [masterData, setMasterData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState([]);
    var [balance, setBalance] = useState("0.00");
    const [brandData, setBrandData] = useState([]);
    const [selectedBrand, setSelectedBrand] = useState("");
    const [brandResponse, setBrandResponse] = useState([]);
    const [isModalVisible1, setModalVisible1] = useState(false);
    const [selectedYear, setSelectedYear] = useState('');
    const [offset, setOffset] = useState(0);
    const [loadingMore, setLoadingMore] = useState(false);

    // Function to filter data based on selected year range
    const filterDataByYear = (selectedYear) => {
      const [startYear, endYear] = selectedYear.value.split("-");
      const startDate = `${startYear}-04-01`;
      const endDate = `${endYear}-03-31`;

      const filteredDate = masterData.filter(item => {
      const paymentDate = new Date(item.payment_date);
      return paymentDate >= new Date(startDate) && paymentDate <= new Date(endDate);

      });

      setFilteredData(filteredDate);
      setMasterData(filteredData);
    }
    
    // Handle dropdown selection change
    const handleDropdownChange = (value) => {
      setSelectedYear(value);
      filterDataByYear(value);
    }
  
    const widthArr = [160, 180, 220, 140, 120, 140];
    const widthArr1 = [50];
    const refRBSheet1 = useRef();
    const refRBSheet2 = useRef();

    const onTableLayout = event => {
        const { height } = event.nativeEvent.layout;
        setTableHeight(height);
    };

    const handleSelect1 = value => {
        setSelectedValue1(value);
        refRBSheet1.current.close();
    };

    const element1 = (data, index) => {
        const { name, ReferalDate, Status, commission, paiddate } = data;
        return (
            <TouchableOpacity onPress={() => openModal(data)}>
                <Feather name="external-link" size={23} color="black" />
            </TouchableOpacity>
        );
    };

    const openModal = rowData => {
        setSelectedRowData(rowData);
        setModalVisible(true);
    };

    //Drop Downdata
    const data = [
        { label: 'All', value: '1' },
        { label: 'Just Started', value: '2' },
        { label: 'Client Invoice Paid', value: '3' },
        { label: 'Client Invoice Past Due', value: '4' },
    ];


    useEffect(() => {
        getLedger();
        // getBrand();
    }, []);

    useEffect(() => {
        searchLedger();
    }, [searchQuery]);

    const searchLedger = async () => {
        setLoading(true);
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${userData.token}`);

        var requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow",
        };

        await fetch(`https://gsidev.ordosolution.com/api/gl/?limit=10&offset=0&search_name=${searchQuery}`, requestOptions)
            .then((response) => response.json())
            .then(async (result) => {
                setMasterData(result.results);
                setFilteredData(result.results);
                setTotal(result?.total_price)
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
                console.log("error", error);
            });

        setLoading(false);
    };


    const getLedger = async (newOffset = 0) => {
        setLoading(true);
        setLoadingMore(newOffset !== 0); 
        
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${userData.token}`);
    
        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow",
        };
    
        try {
            const response = await fetch(`https://gsidev.ordosolution.com/api/gl/?limit=10&offset=${newOffset}&search_name=`, requestOptions);
            const result = await response.json();
            if (newOffset === 0) {
                // Initial fetch or reset
                setMasterData(result.results);
                setFilteredData(result.results);
            } else {
                // Append new data
                setMasterData(prevData => [...prevData, ...result.results]);
                setFilteredData(prevData => [...prevData, ...result.results]);
            }
            setTotal(result?.total_price);
        } catch (error) {
            console.log("error", error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };
    

    const formatDate1 = (dateString) => {
        if (!dateString) return "Invalid Date"; // Handle null or undefined values
        
        const datePattern = /^\d{4}-\d{2}-\d{2}$/;
        if (!datePattern.test(dateString)) return "Invalid Date"; // Handle invalid format
    
        const [year, month, day] = dateString.split('-');
        return `${day}-${month}-${year}`;
    };
    

    const toggleModal = () => {
        setModalVisible1(!isModalVisible1);
  
      };


      const handleSubmit = async () => {
        try {
            let filteredObjects;
    
            if (selectedBrand === "all") {
                // Show all data if "All" option is selected
                filteredObjects = brandResponse;
            } else {
                // Filter data based on selected brand
                filteredObjects = brandResponse.filter(
                    (obj) => obj.payee_id === selectedBrand
                );
            }
    
            // Set filtered data state
            setFilteredData(filteredObjects);
        } catch (error) {
            console.error("Error in handleSubmit:", error);
        }
        toggleModal();
    };
    

    const getCurrentYear = () => {
        const currentDate = new Date();
        return currentDate.getFullYear();
      };
      
      const generateYearOptions = () => {
        const currentYear = getCurrentYear();
        const years = [];
        for (let i = currentYear; i >= currentYear - 5; i--) {
          years.push({ label: `${i}-${i + 1}`, value: `${i}-${i + 1}` });
        }
        return years;
      };
      
      // Usage example
      const yearOptions = generateYearOptions();

      const handleScroll = ({ nativeEvent }) => {
        const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
        const isBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
        
        if (isBottom && !loadingMore) {
            // Update the offset and fetch more data
            setOffset(prevOffset => prevOffset + 10);
        }
    };
    
    useEffect(() => {
        if (offset > 0) {
            getLedger(offset);
        }
    }, [offset]);
    
    

    return (
        <LinearGradient
            colors={Colors.linearColors}
            start={Colors.start}
            end={Colors.end}
            locations={Colors.location}
            style={{ flex: 1 }}
        >
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: "100%",
                    height: "10%",
                    alignItems: "center",
                    alignContent: "center",
                    textAlign: "center",
                    paddingHorizontal: "4%",
                }}
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
                <Text
                    style={{
                        fontFamily: "AvenirNextCyr-Medium",
                        fontSize: 19,
                        marginLeft: 8,
                        color: "white",
                    }}
                >General Ledger</Text>
                <TouchableOpacity
                    onPress={() => {
                    }}
                >
                </TouchableOpacity>
            </View>

            {/* <ScrollView> */}
            <View style={{ flex: 1, borderTopLeftRadius: 20, borderTopRightRadius: 20, backgroundColor: '#F5F5F5' }}>
                <Searchbar
                    style={{
                        marginHorizontal: "4%",
                        marginVertical: "3%",
                        backgroundColor: "white",
                    }}
                    placeholder="Search "
                    onChangeText={(val) => { setSearchQuery(val) }}
                    value={searchQuery}
                />
     
          <ScrollView onScroll={handleScroll} scrollEventThrottle={16}>
                    <View style={{ flexDirection: 'row', marginBottom: '5%', marginTop: '2%',flex:1}}>
                        <ScrollView horizontal={true}>
                            <View style={styles.container6} onLayout={onTableLayout}>
                                <ScrollView style={styles.dataWrapper} onScroll={handleScroll} scrollEventThrottle={16}>
                                    <Table style={{width:1000}}>
                                        <Row
                                            data={[
                                                'Payment date',
                                                'Payee',
                                                'Description',
                                                'Credit',
                                                'Debit',
                                                'Balance',
                                            ]}
                                            widthArr={widthArr}
                                            style={styles.tableHeader}
                                            textStyle={styles.headerText2}
                                        />
                                        <Row
                                            data={[
                                                'Opening Balance',
                                                '',
                                                '',
                                                '',
                                                '',
                                                '    0.00',
                                            ]}
                                            widthArr={widthArr}
                                            style={styles.row}
                                            textStyle={{...styles.headerText2,fontWeight:'bold'}}
                                        />
                                        {filteredData.map((rowData, index) => (
                                            <TableWrapper key={index} style={styles.row}>
                                                <Cell
                                                    data={formatDate1(rowData.payment_date)}
                                                    width={widthArr[0]}
                                                    textStyle={styles.text2}
                                                /> 
                                                  <Cell
                                                    data={rowData.payee_name}
                                                    width={widthArr[1]}
                                                    textStyle={styles.text}
                                                />

                                                <Cell
                                                    data={rowData.description}
                                                    width={widthArr[2]}
                                                    textStyle={styles.text}
                                                />

                                                <Cell
                                                    data={rowData.credit_amount}
                                                    width={widthArr[3]}
                                                    textStyle={styles.text}
                                                />
                                                <Cell
                                                    data={rowData.debit_amount}
                                                    width={widthArr[4]}
                                                    textStyle={styles.text}
                                                />
                                                   <Cell
                                                    data={(balance = (Number(balance) + Number(rowData.credit_amount) - Number(rowData.debit_amount)).toFixed(2))}
                                                    width={widthArr[5]}
                                                    textStyle={styles.text}
                                                />
                                            </TableWrapper>
                                        ))}
                                    </Table>
                                </ScrollView>
                            </View>
                        </ScrollView>
                        <View
                            style={{
                                backgroundColor: Colors.white,
                                // height: tableHeight,
                                width: 50,
                                borderRadius: 9,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                            <Table borderStyle={{}}>
                                <Row
                                    data={[
                                        <TouchableOpacity
                                            >

                                        </TouchableOpacity>,
                                    ]}
                                    widthArr={widthArr1}
                                    style={styles.tableHeader1}
                                />
                                <Row
                                    data={[
                                        <TouchableOpacity
                                            >
                                        
                                        </TouchableOpacity>,
                                    ]}
                                    style={styles.row2}
                                />
                                {filteredData.map((rowData, index) => (
                                    <TableWrapper key={index} style={styles.row2}>
                                        <Cell
                                            data={element1(rowData, index)}
                                            width={widthArr1[0]}
                                        />
                                    </TableWrapper>
                                ))}
                            </Table>
                        </View>
                    </View>
                </ScrollView>

            </View>
<View style={{flex:0.1,backgroundColor:'#f3f3f3',paddingTop:'2%'}}>
<View  style={{...styles.row,justifyContent:'space-between',alignItems:'center'}}>
<Text style={{     fontSize: 17,
        color: Colors.black,
        fontFamily: "AvenirNextCyr-Bold",}}>Total Balance:</Text>
<Text style={{marginRight:'8%', fontSize: 16,
        color: Colors.black,
        fontFamily: "AvenirNextCyr-Medium"}}>{total}</Text>

</View>
</View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={videoModal}
                onRequestClose={() => {
                    setVideoModal(false);
                }}>
                <View style={styles.centeredView}>
                    <View
                        style={[
                            styles.whiteBackg,
                            { marginHorizontal: '8%', paddingHorizontal: '3%' },
                        ]}>
                        <View style={{ flexDirection: 'row', gap: 6 }}>
                            <LinearGradient
                                colors={['#A4BDFE', '#7A9CF5']}
                                style={[styles.closeButton2]}>
                                <FontAwesome name="youtube-play" size={22} color="white" />
                            </LinearGradient>
                            <View style={{ flexDirection: 'column', width: '60%' }}>
                                <Text style={styles.headerText}>Step 1</Text>
                                <Text style={styles.title5}>How it works?</Text>
                            </View>
                            <TouchableOpacity
                                style={{ alignItems: 'center', justifyContent: 'center' }}
                                onPress={() => setVideoModal(false)}>
                                <Text
                                    style={{
                                        color: Colors.primary,
                                        fontWeight: '600',
                                        fontSize: 15,
                                        marginLeft: '19%',
                                    }}>
                                    Skip
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.VideoBackg}>
                    </View>
                </View>
            </Modal>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)', }}>
                    <View style={styles.modalView}>
                        <TouchableOpacity
                            style={styles.graycircle1}
                            onPress={() => {
                                setModalVisible(!modalVisible);
                            }}>
                            <AntDesign name="close" size={22} color={Colors.black} />
                        </TouchableOpacity>
                        {selectedRowData && (
                            <>
                                <View style={{ flexDirection: 'row', gap: 3 }}>
                                    <Text style={styles.lightText}>TRANSACTION ID : </Text>
                                    <Text style={styles.dataText}>
                                        {selectedRowData.account_code}
                                    </Text>
                                </View>

                                <View style={{ flexDirection: 'row', gap: 3 }}>
                                    <Text style={styles.lightText}>PAYEE NAME : </Text>
                                    <Text style={styles.dataText}>
                                        {selectedRowData.payee_name}
                                    </Text>
                                </View>

                                <View style={{ flexDirection: 'row', gap: 3 }}>
                                    <Text style={styles.lightText}>DEBIT AMT. :</Text>
                                    <Text style={styles.dataText}>
                                        {selectedRowData.debit_amount}
                                    </Text>
                                </View>

                                <View style={{ flexDirection: 'row', gap: 3 }}>
                                    <Text style={styles.lightText}>CREDIT AMT :</Text>
                                    <Text style={styles.dataText}>
                                        {selectedRowData.credit_amount}
                                    </Text>
                                </View>

                                <View style={{ flexDirection: 'row', gap: 3 }}>
                                    <Text style={styles.lightText}>PAYMENT DATE :</Text>
                                    <Text style={styles.dataText}>{selectedRowData.payment_date}</Text>
                                </View>

                                <View style={{ flexDirection: 'row', gap: 3 }}>
                                    <Text style={styles.lightText}>DESCRIPTION :</Text>
                                    <Text style={[styles.dataText, { flexWrap: 'wrap', maxWidth: '90%' }]}>
                                        {selectedRowData.description}
                                    </Text>
                                </View>
                            </>
                        )}
                    </View>
                </View>
            </Modal>


            <RBSheet
                ref={refRBSheet1}
                useNativeDriver={false}
                customStyles={{
                    wrapper: {
                        backgroundColor: 'rgba(0,0,0,0.5)',
                    },
                    draggableIcon: {
                        backgroundColor: 'gray',
                    },
                    container: {
                        backgroundColor: '#F3F5F8',
                        borderTopLeftRadius: 29,
                        borderTopRightRadius: 29,
                        height: '32%',
                    },
                }}
                customModalProps={{
                    animationType: 'slide',
                    statusBarTranslucent: true,
                }}
                customAvoidingViewProps={{
                    enabled: false,
                }}>
                <View style={styles.dowpDownView}></View>
                <Text style={styles.dropdownHead}>Sort by Client Status</Text>
                {data.map(item => (
                    <TouchableOpacity
                        key={item.value}
                        onPress={() => handleSelect1(item.value)}
                        style={styles.dropdownBox}>
                        <Text style={styles.dowpDownText}>{item.label}</Text>
                    </TouchableOpacity>
                ))}
            </RBSheet>

            <RBSheet
                ref={refRBSheet2}
                useNativeDriver={false}
                customStyles={{
                    wrapper: {
                        backgroundColor: 'rgba(0,0,0,0.5)',
                    },
                    draggableIcon: {
                        backgroundColor: 'gray',
                    },
                    container: {
                        backgroundColor: '#F3F5F8',
                        borderTopLeftRadius: 29,
                        borderTopRightRadius: 29,
                        height: '32%',
                    },
                }}
                customModalProps={{
                    animationType: 'slide',
                    statusBarTranslucent: true,
                }}
                customAvoidingViewProps={{
                    enabled: false,
                }}>
                <View style={styles.dowpDownView}></View>
                <Text style={styles.dropdownHead}>Customize Table</Text>
            </RBSheet>

            <Modal
        visible={isModalVisible1}
        transparent={true}
        animationType="fade"
        onRequestClose={toggleModal}
      >
        <TouchableOpacity
          style={styles.modalContainer}
          activeOpacity={1}
        // onPressOut={closeModal}
        >
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeIcon} onPress={toggleModal}>
              <Icon name="times" size={20} color="#000" />
            </TouchableOpacity>
            <View style={styles.modalInnerContent}>
              {/* {userData && userData.dealer_name === 'Nikai Electronics' && ( */}
              <View style={styles.container1}>
                <Text style={styles.ModalText1}>Select Payee</Text>
                <Dropdown
                  style={[
                    styles.dropdown,
                    isFocus3 && { borderColor: Colors.primary },
                  ]}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  itemTextStyle={styles.selectedTextStyle}
                  iconStyle={styles.iconStyle}
                  data={brandData}
                  search
                  maxHeight={400}
                  labelField="label"
                  valueField="value"
                  placeholder={!isFocus3 ? "Select" : "..."}
                  searchPlaceholder="Search..."
                  value={selectedBrand}
                  onFocus={() => setIsFocus3(true)}
                  onBlur={() => setIsFocus3(false)}
                  onChange={(item) => {
                    setSelectedBrand(item.value);
                    // getCategory(item.value)
                    setIsFocus3(false);
                  }}
                />
              </View>


              <View style={styles.container1}>
                <Text style={styles.ModalText1}>Select Year</Text>
              <Dropdown
                  style={[
                    styles.dropdown,
                    isFocus && { borderColor: Colors.primary },
                  ]}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  itemTextStyle={styles.selectedTextStyle}
                  iconStyle={styles.iconStyle}
                  data={yearOptions}
                  search
                  maxHeight={400}
                  labelField="label"
                  valueField="value"
                  placeholder={!isFocus ? "Select Year" : "..."}
                  searchPlaceholder="Search..."
                  value={selectedYear}
                  onFocus={() => setIsFocus(true)}
                  onBlur={() => setIsFocus(false)}
                  onChange={handleDropdownChange}
                />
                </View>

              <LinearGradient
                    colors={Colors.linearColors}
                    start={Colors.start}
                    end={Colors.end}
                    locations={Colors.ButtonsLocation}
                    style={{
                      height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginBottom: 10,
    marginHorizontal:15,

                    }}
                >
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
              >
                <Text style={styles.submitButtonText}>Apply Filter</Text>
              </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
        </LinearGradient>
    );
};

export default GeneralLegder;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 12,
    },
    whiteBackg: {
        paddingHorizontal: '5%',
        paddingVertical: '2%',
        backgroundColor: Colors.white,
        borderRadius: 20,
        alignSelf: 'center',
    },
    LogoImage: {
        height: 40,
        width: 80,
    },
    UkImage: {
        height: 20,
        width: 30,
        borderRadius: 48,
    },
    loginBtn: {
        backgroundColor: Colors.primary,
        borderRadius: 20,
        justifyContent: 'center',
        paddingHorizontal: '3%',
        marginLeft: '4%',
        height: 30,
    },
    line2: {
        borderBottomWidth: 1,
        borderColor: Colors.lightGrey,
        height: 1,
        marginTop: '3%',
    },
    modalView: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: '5%',
        shadowColor: '#000',
        marginVertical: '5%',
        marginHorizontal: '5%',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        marginHorizontal:'3%'
    },
    centeredView: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
    },
    headerText2: {
        fontSize: 17,
        color: Colors.black,
        fontFamily: "AvenirNextCyr-Medium",
    },
    textStyle: {
        fontSize: 17,
        fontWeight: '500',
        color: Colors.black,
    },
    graycircle1: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-end',
    },
    modelBtn: {
        backgroundColor: Colors.lightgreen,
        padding: 6,
        borderRadius: 15,
        elevation: 2,
    },
    container6: {
        flexDirection: 'column',
        borderColor: '#000',
        borderTopLeftRadius: 20, borderTopRightRadius: 20
    },
    weltext1: {
        fontSize: 28,
        fontFamily: "AvenirNextCyr-Medium",
    },
    weltext2: {
        color: Colors.black,
        fontSize: 28,
        fontFamily: "AvenirNextCyr-Medium",
    },
    weltext22: {
        color: Colors.black,
        fontSize: 19,
        fontFamily: "AvenirNextCyr-Medium",
        textAlign: 'center',
    },
    tableRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#c3c3c3',
        paddingVertical: '2%',
    },
    headerCell: {
        flex: 1,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingHorizontal: 30,
        color: 'gray',
    },
    centeredView: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        flex: 1,
        justifyContent: 'center',
    },
    cell: {
        flex: 1,
        textAlign: 'center',
        paddingVertical: '1%',
        color: 'gray',
    },
    tableHeader: {
        height: 60,
        paddingHorizontal: 20,
        backgroundColor: '#e5e5e5',
        // borderRadius: 24,
        borderBottomColor: 'white',
        // borderBottomWidth: 10,
        // borderBottomLeftRadius: 30,
    },
    tableSubHeader: {
        height: 60,
        paddingHorizontal: 20,
        backgroundColor: '#F3F5F8',
        // borderRadius: 24,
        borderBottomColor: 'white',
        // borderBottomWidth: 10,
        // borderBottomLeftRadius: 30,
    },

    tableHeader1: {
        height: 59,
        backgroundColor: 'white',
        borderBottomColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        width: 70,
        borderBottomWidth: 10,
    },
    tableSubHeader1: {
        height: 59,
        // backgroundColor: '#F3F5F8',
        borderBottomColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        // width: 70,
        borderBottomWidth: 10,
    },
    text: { fontFamily: "AvenirNextCyr-Medium", color: 'black', fontSize: 15 },
    text2: { fontFamily: "AvenirNextCyr-Medium", color: 'black', fontSize: 16 },
    dataWrapper: { marginTop: -1 },
    paddingHorizontal: 10,
    row: {
        height: 60,
        borderBottomColor: 'white',
        borderBottomWidth: 5,
        paddingHorizontal: 20,
        flexDirection: 'row',
        // borderRadius: 24,
        backgroundColor: '#FBFBFB',
    },
    row2: {
        height: 60,
        borderBottomColor: 'white',
        borderBottomWidth: 5,
        paddingHorizontal: 20,
        flexDirection: 'row',
        backgroundColor: '#FBFBFB',
        borderLeftWidth: 4,
        borderLeftColor: Colors.lightGrey,
    },
    inCommingLeadBox: {
        flexDirection: 'column',
        backgroundColor: 'white',
        borderTopLeftRadius: 29,
        borderTopRightRadius: 29,
        paddingHorizontal: '1%',
    },
    searchBox: {
        paddingHorizontal: '2%',
        marginVertical: '5%',
        flexDirection: 'column',
        height: 60,
        borderColor: Colors.lightGrey,
        borderWidth: 1,
        borderRadius: 15,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
        color: 'gray',
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
    headerText: {
        fontSize: 13,
        color: Colors.darkgrey,
        width: '60%',
        fontFamily: "AvenirNextCyr-Medium",
    },
    title5: {
        fontSize: 16,
        color: Colors.black,
        fontFamily: "AvenirNextCyr-Medium",
    },
    dropdown: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 15,
        paddingHorizontal: '6%',
        marginBottom: '5%',
    },

    bellIconContainer: {
        backgroundColor: Colors.white,
        borderRadius: 17,
        paddingHorizontal: 18,
        paddingVertical: 15,
    },
    loginBtn: {
        backgroundColor: Colors.primary,
        borderRadius: 20,
        width: '50%',
        height: 240,
    },
    closeButton2: {
        backgroundColor: Colors.lightgreen,
        borderRadius: 11,
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    VideoImage2: {
        height: 200,
        width: '100%',
    },
    VideoBackg: {
        paddingHorizontal: '5%',
        paddingVertical: '4%',
        backgroundColor: Colors.white,
        borderRadius: 20,
        marginTop: '2%',
        marginHorizontal: '5%',
    },
    dropdownHead: {
        fontFamily: "AvenirNextCyr-Medium",
        color: Colors.black,
        fontSize: 20,
        textAlign: 'center',
        fontFamily: "AvenirNextCyr-Medium",
    },
    dowpDownView: {
        height: 5,
        width: '17%',
        backgroundColor: Colors.darkgrey,
        marginVertical: '3%',
        borderRadius: 10,
        alignSelf: 'center',
    },
    sortBtn: {
        backgroundColor: '#DBE4FB',
        alignItems: 'flex-end',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: '4%',
        borderRadius: 15,
        height: 60,
    },
    dowpDownText: {
        color: Colors.black,
        fontFamily: "AvenirNextCyr-Medium",
        fontSize: 17,
    },
    dropdownBox: {
        padding: 10,
        marginBottom: '1%',
        marginHorizontal: '5%',
    },
    nameText: {
        fontSize: 23,
        color: Colors.black,
        fontFamily: "AvenirNextCyr-Medium",
        marginBottom: '5%',
    },
    dataText: {
        fontSize: 15,
        marginBottom: 10,
        color: Colors.black,
        fontFamily: "AvenirNextCyr-Medium",
    },
    lightText: {
        color: Colors.darkgrey,
        fontFamily: "AvenirNextCyr-Medium",
        fontSize: 15,
    },
    statusText: {
        fontSize: 14,
        color: 'black',
        fontFamily: "AvenirNextCyr-Medium",
        marginHorizontal: '2%',
    },
    statusText1: {
        fontSize: 15,
        color: 'black',
        fontFamily: "AvenirNextCyr-Medium",
        marginHorizontal: '2%',
    },
    view1: {
        paddingVertical: '3%',
        backgroundColor: '#d3def8',
        borderRadius: 8,
        alignItems: 'center',
        width: '50%',
    },
    view2: {
        paddingVertical: '3%',
        backgroundColor: '#e6f8af',
        borderRadius: 8,
        alignItems: 'center',
        width: '70%',
    },
    view3: {
        paddingVertical: '3%',
        backgroundColor: '#fcd8d6',
        borderRadius: 8,
        alignItems: 'center',
        width: '83%',
    },
    view11: {
        paddingVertical: '2%',
        backgroundColor: '#d3def8',
        borderRadius: 8,
        alignItems: 'center',
        width: '36%',
    },
    view12: {
        paddingVertical: '2%',
        backgroundColor: '#e6f8af',
        borderRadius: 8,
        alignItems: 'center',
        width: '45%',
    },
    view13: {
        paddingVertical: '2%',
        backgroundColor: '#fcd8d6',
        borderRadius: 8,
        alignItems: 'center',
        width: '50%',
    },
    scrollableContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 65,
        marginRight: 5,
    },
    box: {
        width: 250,
        height: 45,
        borderRadius: 25,
        padding: 10,
        backgroundColor: Colors.white,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    box1: {
        width: 200,
        height: 45,
        backgroundColor: '#95B1FB',
        borderRadius: 25,
        padding: 9,
        flexDirection: 'row',
        fontWeight: '500',
        justifyContent: 'center',
        alignItems: 'center',
    },
    boxTxt2: {
        color: Colors.black,
        fontSize: 15,
        fontFamily: "AvenirNextCyr-Medium",
    },
    boxTxt1: {
        color: Colors.white,
        fontSize: 15,
        fontFamily: "AvenirNextCyr-Medium",
    },
    title: {
        fontSize: 23,
        color: Colors.black,
        marginTop: '4%',
        marginHorizontal: '2%',
        fontFamily: "AvenirNextCyr-Medium",
    },
    rowView3: {
        flexDirection: 'row',
        marginRight: '7%',
        marginVertical: '4%',
        marginHorizontal: '5%',
        marginRight: '9%',
    },
    graycircle: {
        width: 40,
        height: 40,
        borderRadius: 19,
        backgroundColor: Colors.white,
        justifyContent: 'center',
        alignItems: 'center',
    },
    view4: {
        alignContent: 'center',
        backgroundColor: Colors.white,
        borderRadius: 15,
        marginVertical: '2%',
        padding: '3%',
        marginHorizontal: '2%',
    },
    title343: {
        color: Colors.primary,
        fontSize: 15,
        fontFamily: "AvenirNextCyr-Medium",
    },
    clickableText: {
        fontSize: 15,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
        color: Colors.primary,

    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      },
      modalContent: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 8,
        width: "90%", // Adjust the width as needed, for example '90%'
        alignSelf: "center", // Center the modal content horizontally
      },
    
      closeIcon: {
        position: "absolute",
        top: 0, // Set the top offset to 0 (right above the modal content)
        right: 5,
        padding: 10,
      },
      modalInnerContent: {
        marginTop: 15, // Add a margin to separate the icon from the modal content
      },
      ModalText1: {
        color: "#000000",
        textAlign: "left",
        fontSize: 16,
        fontFamily: "AvenirNextCyr-Bold",
        marginLeft: 1,
        marginBottom:'2%'
      },
      container1: {
        backgroundColor: "white",
        padding: 16,
        width: "100%", // Adjust the width as needed, for example '90%'
        alignSelf: "center", // Center the container horizontally within the modal
      },
    
      dropdown: {
        height: 50,
        borderColor: "gray",
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
        width: "100%", // Set the desired width for the dropdown, for example '100%' to match the parent container
      },
    
      icon1: {
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
        fontFamily: "AvenirNextCyr-Medium",
      },
      submitButton: {
        // backgroundColor: Colors.primary,
        borderRadius: 8,
        width:'100%',
        // paddingVertical: 12,
        alignItems: "center",
        // marginTop: 8,
        // marginLeft: 15,
        // marginRight: 15,
      },
      submitButtonText: {
        color: "#fff",
        fontSize: 16,
        fontFamily: "AvenirNextCyr-Bold",
      },
      noProductsContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      },
      noProductsText: {
        fontSize: 16,
        color: "gray",
        fontFamily: "AvenirNextCyr-Medium",
        textAlign: "center",
        marginTop: 80,
      },
});