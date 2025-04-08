import {
  StyleSheet, Text, View, Image, TextInput,
  ActivityIndicator, TouchableOpacity, FlatList, Modal, Pressable
} from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import Colors from '../../constants/Colors';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer, useIsFocused, useRoute } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { AuthContext } from '../../Context/AuthContext';
import globalStyles from '../../styles/globalStyles';
import LinearGradient from 'react-native-linear-gradient';
import { Searchbar, RadioButton } from 'react-native-paper';
import moment from 'moment'
import DatePicker from 'react-native-date-picker'
import Icon from 'react-native-vector-icons/FontAwesome';
import { Dropdown } from 'react-native-element-dropdown';
import Entypo from "react-native-vector-icons/Entypo";
import ConvertDateTime from '../../utils/ConvertDateTime';


const RFQHistory = ({ navigation }) => {
  const { ordersLoading, setOrdersLoading, userData, token } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = React.useState("");

  const onChangeSearch = query => setSearchQuery(query);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState('all');
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [date, setDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const [selectedLabelValue, setSelectedLabelValue] = useState(null);
  const [LabelValue, setLabelValue] = useState(null);
  const [data, setData] = useState([]);
  const [masterdata, setMasterData] = useState([]);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(10);
  const [isLoading, setIsLoading] = useState(false); 


  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };



  useEffect(() => {
    getHistory();
  }, [offset,searchQuery])


  const renderItem = ({ item, index }) => {
    let color = item.status == 'Approved' ? 'green' : item.status == 'Pending' ? '#4169E1' : item.status == 'Partially Approved' ? 'orange' : 'red';
    // let status = item.status == 'Approved' ? 'Approved' : item.status == 'Pending' ? 'Partially Approval' : 'Rejected';
    let order = item;
    return (

      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => navigation.navigate('RFQProducts', { item: order })}

        activeOpacity={0.5}
      >


        <View style={{ justifyContent: 'center', alignItems: 'center' ,flex:0.23}}>

          {item.status === "Pending" ? (<Entypo name='back-in-time' size={30} color={Colors.primary} />) :
            (<AntDesign
              name="checkcircleo"
              color='#004600'
              size={25}

            />)}
          <Text style={{ color: Colors.primary, fontFamily: 'AvenirNextCyr-Medium' ,fontSize:13}}>{order?.status}</Text>

        </View>


        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom:5
            }}>
              <Image
                style={{ marginRight: 10, height: 15, width: 15, resizeMode: 'contain' }}
                source={require('../../assets/images/user.png')} />
              <Text style={{ ...styles.title, color: Colors.primary, fontFamily: 'AvenirNextCyr-Bold' }}>{order?.supplier_name}</Text>
            </View>

          </View>



          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom:5

          }}>
            <Image
              style={{ marginRight: 10, height: 15, width: 15, resizeMode: 'contain' }}
              source={require('../../assets/images/document2.png')} />
            <Text style={styles.title}>{order?.name}</Text>
          </View>

          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 3,
            justifyContent: 'space-between'
          }}>

            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <Image
                style={{ marginRight: 10, height: 15, width: 15, resizeMode: 'contain' }}
                source={require('../../assets/images/duration.png')} />
              <Text style={{ ...styles.text, fontFamily: 'AvenirNextCyr-Medium' }}>{ConvertDateTime(order?.created_at).formattedDate} {ConvertDateTime(order?.created_at).formattedTime}</Text>
            </View>

            <Text style={{ ...styles.title, color: 'black', fontFamily: 'AvenirNextCyr-Medium' }}>Total SKU's : {order?.product_list?.length}</Text>

          </View>
        </View>

      </TouchableOpacity>
    );

  }

  //no data found
  const noDataFound = () => {
    return (
      <View style={styles.noReport}>
        <Text style={styles.noReportText}>No returns found</Text>
      </View>
    )
  }

  const getHistory = () => {
    setIsLoading(true);
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${userData.token}`);
    // myHeaders.append("Cookie", "csrftoken=RK01uE9J0xQQMWCjMG7ZfcSnMMQJI9Yl");

    var raw = "";

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch(`https://gsidev.ordosolution.com/api/purchase_without_poc/?limit=${limit}&offset=${offset}&search_name=${searchQuery}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log("rfq history", result)

        const newData = result.results;

        if (offset === 0) {
            setMasterData(newData);
            setData(newData);
        } else {
            setMasterData([...masterData, ...newData]);
            setData([...filteredData, ...newData]);
        }
        setIsLoading(false);

      })
      .catch(error =>{
        setIsLoading(false)

      }
        );

  }

  const handleLoadMore = () => {
    setOffset(offset + limit);
};


const LoadingIndicator = () => {
  return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 20 }}>
          <ActivityIndicator size="small" color={Colors.primary} />
      </View>
  );
};


const EmptyListMessage = () => {
  return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 20 }}>
          <Text style={styles.emptyMessageStyle}>No data found</Text>
      </View>
  );
};


  const searchOrder = (text) => {
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource
      // Update FilteredDataSource
      const newData = masterdata.filter(function (item) {
        const itemData = item.name
          ? item.name.toUpperCase()
          : "".toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setData(newData);
      setSearchQuery(text);
    } else {
      // Inserted text is blank
      // Update FilteredDataSource with masterDataSource
      setData(masterdata);
      setSearchQuery(text);
    }
  }


  return (
    <LinearGradient colors={Colors.linearColors}
      start={Colors.start}end={Colors.end}
      locations={Colors.location}
      style={{ flex: 1 }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', height: '10%', alignItems: 'center', alignContent: 'center', textAlign: 'center', paddingHorizontal: '4%' }}>
        <TouchableOpacity onPress={() => { navigation.goBack() }}>
          <Image source={require('../../assets/images/Refund_back.png')} style={{ height: 30, width: 30 }} />
        </TouchableOpacity>
        <Text style={{ fontFamily: 'AvenirNextCyr-Medium', fontSize: 19, marginLeft: 8, color: 'white' }}>Purchase Request  </Text>
        <TouchableOpacity
          onPress={() => {
            setModalVisible(true)
          }}
        ><AntDesign name="filter" size={0} color="white" /></TouchableOpacity>
      </View>
      <View style={{ paddingHorizontal: '4%', marginBottom: '3%' }}>
        <Searchbar
          style={{
            backgroundColor: "white",
            borderRadius: 30,
            fontFamily: "AvenirNextCyr-Medium",
          }}

          placeholder="Search RFQ"
          onChangeText={(val) => { searchOrder(val) }}
          value={searchQuery}
        />

      </View>

      <View style={{ backgroundColor: '#f5f5f5', borderTopEndRadius: 20, borderTopStartRadius: 20, flex: 1 }}>

        <FlatList
          data={data}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          onEndReached={handleLoadMore}
          ListEmptyComponent={EmptyListMessage}
          onEndReachedThreshold={0.5}
          ListFooterComponent={isLoading ? LoadingIndicator : null}
        />
      </View>

    </LinearGradient>

  )
}

export default RFQHistory

const styles = StyleSheet.create({
  modalSearchContainer: {
    flex: 0.8,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    marginRight: 10
  },
  input: {
    flex: 1,
    fontSize: 16,
    marginRight: 10,
  },
  searchButton: {
    padding: 5,
  },
  elementsView: {
    backgroundColor: "white",
    margin: 5,
    //borderColor: 'black',
    //flexDirection: 'row',
    //justifyContent: 'space-between',
    //alignItems: 'center',
    marginBottom: 16,
    borderRadius: 8,
    elevation: 5,
    ...globalStyles.border,
    padding: 20
    //borderColor: '#fff',
    //borderWidth: 0.5
  },
  imageView: {
    width: 40,
    height: 40
  },
  activityIndicator: {
    flex: 1,
    alignSelf: 'center',
    height: 100,
    position: 'absolute',
    top: '30%',

  },

  inputContainer1: {
    borderColor: '#b3b3b3',
    color: 'gray',
    borderWidth: 1,
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 8,
    padding: 5,
  },
  input2: {
    fontFamily: 'AvenirNextCyr-Medium',
    padding: 8,
    marginLeft: '4%'
  },

  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    width: '100%',
    height: 50

  },
  btnText: {
    fontFamily: 'AvenirNextCyr-Medium',
    color: '#fff',
    fontSize: 16,
  },
  itemContainer: {
    // marginTop: '1%',
    // borderRadius: 5,
    // backgroundColor: Colors.white,
    borderBottomWidth: 0.5,
    padding: '3%',
    borderbottomColor: 'gray',
    // elevation: 5,
    // ...globalStyles.border,
    paddingVertical: '5%',
    paddingHorizontal: '5%',
    flexDirection: 'row',
    gap: 13
  },
  // orderDataContainer: {
  //   paddingHorizontal: 10,
  // },
})