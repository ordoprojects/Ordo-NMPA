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
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Feather from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import { Table, TableWrapper, Row, Cell } from 'react-native-reanimated-table';
import RBSheet from 'react-native-raw-bottom-sheet';
import { Searchbar, Checkbox, RadioButton } from "react-native-paper";
import { AuthContext } from "../../Context/AuthContext";
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { LoadingView } from '../../components/LoadingView';


const InventoryLog = ({ navigation }) => {
  const { token, userData, changeDealerData } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [videoModal, setVideoModal] = useState(false);
  const [selectedValue1, setSelectedValue1] = useState(null);
  const [selectedValue2, setSelectedValue2] = useState(null);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [tableHeight, setTableHeight] = useState(0);
  const [masterData, setMasterData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const recordsPerPage = 10;

  const widthArr = [180, 130, 190, 140, 170, 60];
  const widthArr1 = [50];

  const refRBSheet = useRef();
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

  const element = (data, index) => {
    const { transactiontype } = data;

    if (transactiontype === 'Receive') {
      return (
        <View style={styles.view1}>
          <Text style={styles.statusText}>Receive</Text>
        </View>
      );
    } else if (transactiontype === 'Client Invoice Paid') {
      return (
        <View style={styles.view2}>
          <Text style={styles.statusText}>Client Invoice Paid</Text>
        </View>
      );
    } else if (transactiontype === 'Client Invoice Past Due') {
      return (
        <View style={styles.view3}>
          <Text style={styles.statusText}>Client Invoice Past Due</Text>
        </View>
      );
    }
    return null;
  };

  //Drop Downdata
  const data = [
    { label: 'All', value: '1' },
    { label: 'Just Started', value: '2' },
    { label: 'Client Invoice Paid', value: '3' },
    { label: 'Client Invoice Past Due', value: '4' },
  ];

  const tableData = [
    {
      name: ' Alen John',
      ReferalDate: '2/23/2023, 08:11 PM',
      Status: 'Just Started',
      commission: '$150.00',
      paiddate: '2/22/2024, 11:21 AM',
    },
    {
      name: 'Alison Parker',
      ReferalDate: '2/23/2023, 08:11 PM',
      Status: 'Client Invoice Paid',
      commission: '$250.00',
      paiddate: '2/22/2024, 11:21 AM',
    },
    {
      name: 'James John',
      ReferalDate: '2/23/2023 ,08:11 PM',
      Status: 'Client Invoice Past Due',
      commission: '$503.00',
      paiddate: '2/22/2024, 11:21 AM',
    },
    {
      name: 'Alison Parker',
      ReferalDate: '2/23/2023, 08:11 PM',
      Status: 'Client Invoice Paid',
      commission: '$250.00',
      paiddate: '2/22/2024, 11:21 AM',
    },
    {
      name: 'James John',
      ReferalDate: '2/23/2023 ,08:11 PM',
      Status: 'Client Invoice Past Due',
      commission: '$503.00',
      paiddate: '2/22/2024, 11:21 AM',
    },
  ];

  const searchCustomer = (text) => {
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource
      // Update FilteredDataSource
      const newData = masterData.filter(function (item) {
        const itemData = item.product_name
          ? item.product_name.toUpperCase()
          : "".toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredData(newData);
      setSearchQuery(text);
      setCurrentPage(1); // Reset current page to 1
    } else {
      // Inserted text is blank
      // Update FilteredDataSource with masterDataSource
      setFilteredData(masterData);
      setSearchQuery(text);
      setCurrentPage(1); // Reset current page to 1
    }
  };


  useEffect(() => {
    //getting active dealer list for the particular user
    InventoryLog();
  }, []);

  const InventoryLog = async () => {
    setLoading(true);
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${userData.token}`);


    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch("https://gsidev.ordosolution.com/api/inventory/", requestOptions)
      .then((response) => response.json())
      .then(async (result) => {
        console.log("active dealer api res", result);

        setMasterData(result);
        setFilteredData(result);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.log("error", error);
      });
  };
  const formatDate = (dateTimeString) => {
    const date = new Date(dateTimeString);
    // Format the date and time as desired, excluding seconds
    const formattedDateTime = `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    return formattedDateTime;
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    setCurrentPage(currentPage - 1);
  };




  const Pagination = ({ currentPage, totalPages, onNextPage, onPrevPage }) => {
    return (
      <View style={styles.paginationContainer}>
        <TouchableOpacity onPress={onPrevPage} disabled={currentPage === 1}>
          <Text style={[styles.paginationButton, currentPage === 1 && styles.disabled]}>Previous</Text>
        </TouchableOpacity>
        <Text style={styles.paginationText}>Page {currentPage} of {totalPages}</Text>
        <TouchableOpacity onPress={onNextPage} disabled={currentPage === totalPages}>
          <Text style={[styles.paginationButton, currentPage === totalPages && styles.disabled]}>Next</Text>
        </TouchableOpacity>
      </View>
    );
  };
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
        >Inventory Logs   </Text>
        <TouchableOpacity
          onPress={() => {
            setModalVisible(true);
          }}
        >
          {/* <AntDesign name="filter" size={0} color="white" /> */}
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
          onChangeText={(val) => { searchCustomer(val) }}
          value={searchQuery}
        />

        <ScrollView>
          <View style={{ flexDirection: 'row', marginBottom: '5%', marginTop: '2%' }}>
            <ScrollView horizontal={true}>
              <View style={styles.container6} onLayout={onTableLayout}>
                <ScrollView style={styles.dataWrapper}>
                  <Table borderStyle={{}}>
                    <Row
                      data={[
                        'Transaction Date',
                        'Product',
                        'Transaction Type',
                        'Quantity',
                        'UOM',
                      ]}
                      widthArr={widthArr}
                      style={styles.tableHeader}
                      textStyle={styles.headerText2}
                    />
                    {currentItems.map((rowData, index) => (
                      <TableWrapper key={index} style={styles.row}>
                        <Cell
                          data={formatDate(rowData.transactiondate)}
                          width={widthArr[0]}
                          textStyle={styles.text}
                        />
                        <Cell
                          data={rowData.product_name}
                          width={widthArr[1]}
                          textStyle={styles.text}
                        />
                        <Cell
                          data={rowData.transactiontype}
                          width={widthArr[2]}
                        />
                        <Cell
                          data={rowData.quantity.toFixed(3)}
                          width={widthArr[3]}
                          textStyle={styles.text2}
                        />
                        <Cell
                          data={rowData.uom}
                          width={widthArr[4]}
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
                backgroundColor: Colors.lightGrey2,
                height: tableHeight,
                width: 50,
                borderRadius: 9,
                // justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Table borderStyle={{}}>
                <Row
                  data={[
                    <TouchableOpacity
                      // onPress={() => refRBSheet2.current.open()}
                      >
                      <Feather
                        name="settings"
                        size={23}
                        color="black"
                        style={{ alignSelf: 'center' }}
                      />
                    </TouchableOpacity>,
                  ]}
                  widthArr={widthArr1}
                  style={styles.tableHeader1}
                />
                {filteredData
                  .slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage)
                  .map((rowData, index) => (
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
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredData.length / itemsPerPage)}
          onNextPage={nextPage}
          onPrevPage={prevPage}
        />
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
            {/* <Image
 source={require('../../assets/images/VideoImg.png')}
 style={styles.VideoImage2}
 resizeMode="contain"
 /> */}
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
                <Text style={styles.nameText}>{selectedRowData.product_name}</Text>
                <View style={{ flexDirection: 'row', gap: 3 }}>
                  <Text style={styles.lightText}>TRANSACTION DATE : </Text>
                  <Text style={styles.dataText}>
                    {formatDate(selectedRowData?.transactiondate)}
                  </Text>
                </View>

                <View style={{ flexDirection: 'row', gap: 3 }}>
                  <Text style={styles.lightText}>TRANSACTION TYPE :</Text>
                  <Text style={styles.dataText}>
                    {selectedRowData?.transactiontype}
                  </Text>
                </View>

                <View style={{ flexDirection: 'row', gap: 3 }}>
                  <Text style={styles.lightText}>QUANTITY :</Text>
                  <Text style={styles.dataText}>
                    {selectedRowData?.quantity}
                  </Text>
                </View>

                <View style={{ flexDirection: 'row', gap: 3 }}>
                  <Text style={styles.lightText}>UOM :</Text>
                  <Text style={styles.dataText}>{selectedRowData?.uom}</Text>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      <LoadingView visible={loading} message="Please Wait ..." />

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

      {/* <RBSheet
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
      </RBSheet> */}

    </LinearGradient>
  );
};

export default InventoryLog;

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
    borderRadius: 24,
    borderBottomColor: 'white',
    borderBottomWidth: 10,
    borderBottomLeftRadius: 30,
  },

  tableHeader1: {
    height: 59,
    backgroundColor: '#F3F5F8',
    borderBottomColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
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
    borderRadius: 24,
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
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  paginationText: {
    marginHorizontal: 10,
    fontSize: 16,
    color:'black'
  },
  paginationButton: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'blue', // Customize color as needed
  },
  disabled: {
    color: 'gray', // Customize disabled color as needed
  },
});