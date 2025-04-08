import {
  StyleSheet, Text, View, Image, TextInput,
  ActivityIndicator, TouchableOpacity, FlatList, Modal, Pressable, Alert
} from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import Colors from '../../constants/Colors';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer, useIsFocused, useRoute } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/AntDesign';

import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import { AuthContext } from '../../Context/AuthContext';
import globalStyles from '../../styles/globalStyles';
import LinearGradient from 'react-native-linear-gradient';
import { Searchbar, RadioButton } from 'react-native-paper';
import moment from 'moment'
import DatePicker from 'react-native-date-picker'
import Toast from 'react-native-simple-toast';
import OrdersSkeleton from '../Skeleton/OrdersSkeleton';



const Tab = createMaterialTopTabNavigator();



const Pending = ({ pendingArray, navigation, fetchData, renderItem }) => {
  const { ordersLoading } = useContext(AuthContext);
  if (ordersLoading) {

    return (

      <OrdersSkeleton />
    );
  }


  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>


      <FlatList
        showsVerticalScrollIndicator={false}
        data={pendingArray}
        keyboardShouldPersistTaps='handled'
        renderItem={renderItem}
        ListEmptyComponent={() => (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: '50%' }}>
            <Text style={{ fontFamily: 'AvenirNextCyr-Medium', color: '#b3b3b3' }}>No data available</Text>
          </View>
        )}
      />
    </View>
  );
}

const Approved = ({ approvedArray, navigation, renderItem }) => {

  const { ordersLoading } = useContext(AuthContext);



  if (ordersLoading) {

    return (

      <OrdersSkeleton />
    );
  }


  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>

      <FlatList
        showsVerticalScrollIndicator={false}
        data={approvedArray}
        keyboardShouldPersistTaps='handled'
        renderItem={renderItem}
        ListEmptyComponent={() => (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: '50%' }}>
            <Text style={{ fontFamily: 'AvenirNextCyr-Medium', color: '#b3b3b3' }}>No data available</Text>
          </View>
        )}
      //keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}

const Completed = ({ completedArray, navigation, renderItem }) => {
  // const { cancelledArray } = useContext(AuthContext);
  const { ordersLoading } = useContext(AuthContext);


  if (ordersLoading) {

    return (

      <OrdersSkeleton />
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>

      <FlatList
        showsVerticalScrollIndicator={false}
        data={completedArray}
        keyboardShouldPersistTaps='handled'
        renderItem={renderItem}
        //keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={() => (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: '50%' }}>
            <Text style={{ fontFamily: 'AvenirNextCyr-Medium', color: '#b3b3b3' }}>No data available</Text>
          </View>
        )}
      />
    </View>
  );
}


const AllPlans = ({ navigation }) => {
  const { ordersLoading, setOrdersLoading, userData, dealerData } = useContext(AuthContext);



  const [search, setSearch] = useState('');
  const onChangeSearch = query => setSearchQuery(query);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState('all');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [date, setDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

  const [pendingArray, setPendingArray] = useState([])
  const [rejectedArray, setRejectedArray] = useState([])
  const [approvedArray, setApprovedArray] = useState([])
  const [partialArray, setPartialArray] = useState([])
  const [completedArray, setCompletedArray] = useState([])




  const [filteredPendingArray, setFilteredPendingArray] = useState([])
  const [filteredApprovedArray, setFilteredApprovedArray] = useState([])
  const [filteredPartialArray, setFilteredPartialArray] = useState([])
  const [filteredRejectedArray, setFilteredRejectedArray] = useState([])
  const [filteredCompletedArray, setFilteredCompletedArray] = useState([])







  useEffect(() => {
    fetchData();
  }, []);


  useEffect(() => {
    const applySearchFilter = (dataArray, setFilteredArray) => {
      // If there's a search query, filter the dataArray
      if (search) {
        const newData = dataArray.filter(item => {
          const itemData = (item.name ? item.name.toUpperCase() : '') + (item.assignee_name ? item.assignee_name.toUpperCase() : '');
          const queryData = search.toUpperCase();
          return itemData.indexOf(queryData) > -1;
        });

        setFilteredArray(newData);
      } else {
        // If there's no search query, setFilteredArray to the full dataArray
        setFilteredArray(dataArray);
      }
    };

    applySearchFilter(pendingArray, setFilteredPendingArray);
    applySearchFilter(approvedArray, setFilteredApprovedArray);
    applySearchFilter(partialArray, setFilteredPartialArray);
    applySearchFilter(rejectedArray, setFilteredRejectedArray);

  }, [pendingArray, approvedArray, partialArray, rejectedArray, search]);


  const fetchData = async () => {
    setOrdersLoading(true);

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${userData.token}`);



    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    await fetch(`https://gsidev.ordosolution.com/api/sales_tourplan/?user_id=${userData.id}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        // setData(data);
        // console.log('check',res)

        let tPendingArray = []
        let tApprovedArray = []
        let tCompletedArray = []


        result?.forEach((tourPlan) => {

          if (tourPlan?.status == 'Pending') {
            tPendingArray.push(tourPlan)

          }

          if (tourPlan?.status == 'Approved') {
            tApprovedArray.push(tourPlan)
          }

          if (tourPlan?.status == 'Completed') {
            tCompletedArray.push(tourPlan)
          }

        })


        setPendingArray(tPendingArray)
        setApprovedArray(tApprovedArray)
        setCompletedArray(tCompletedArray)



        setFilteredPendingArray(tPendingArray)
        setFilteredApprovedArray(tApprovedArray)
        setFilteredCompletedArray(tCompletedArray)

        setOrdersLoading(false);



      })
      .catch(error => {
        // Handle any errors that occurred during the request
        console.error(error);
      });
  };

  // console.log("approved",approvedArray)
  // console.log("pending",pendingArray)

  const handleSelect = (option) => {
    setSelectedOption(option);
  };

  const handleFilter = () => {
    if (selectedOption === "all") {
      // setFilteredCompletedArray(completedArray)
      setFilteredPendingArray(pendingArray)
      setFilteredRejectedArray(rejectedArray)
      setFilteredApprovedArray(approvedArray)
      setFilteredPartialArray(partialArray)
    } else if (selectedOption === "custom") {

      const filteredpendingarray = pendingArray.filter(order => {
        const orderDate = moment(order.created_at).format('YYYY-MM-DD');
        return orderDate === selectedDate;
      });
      setFilteredPendingArray(filteredpendingarray)

      const filterdrejectedarray = rejectedArray.filter(order => {
        const orderDate = moment(order.created_at).format('YYYY-MM-DD');
        return orderDate === selectedDate;
      });
      setFilteredRejectedArray(filterdrejectedarray)

      const filteredapprovedarray = approvedArray.filter(order => {
        const orderDate = moment(order.created_at).format('YYYY-MM-DD');
        return orderDate === selectedDate;
      });

      setFilteredApprovedArray(filteredapprovedarray)

      const filteredpartialarray = partialArray.filter(order => {
        const orderDate = moment(order.created_at).format('YYYY-MM-DD');
        return orderDate === selectedDate;
      });

      setPartialArray(filteredpartialarray)

    }
    setModalVisible(false)
  };


  const clearFilters = () => {
    setSelectedOption('all')
    setFilteredPendingArray(pendingArray)
    setFilteredRejectedArray(rejectedArray)
    setFilteredApprovedArray(approvedArray)
    setFilteredPartialArray(partialArray)
  }



  const InputWithLabel = ({ title, value, onPress }) => {
    return (
      <View>
        <Pressable style={{ ...styles.inputContainer1 }} onPress={onPress} >
          <Image style={{ width: 20, height: 20, marginLeft: 10 }} source={require("../../assets/images/calendar.png")}></Image>
          <Text style={styles.input2}>{value ? moment(value).format('DD-MM-YYYY') : 'Select date'}</Text>
        </Pressable>
      </View>
    );
  }

  const searchCustomer = (text) => {
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource
      // Update FilteredDataSource
      const newData = masterData.filter(function (item) {
        const itemData = item.name
          ? item.name.toUpperCase()
          : "".toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredData(newData);
      setSearch(text);
    } else {
      // Inserted text is blank
      // Update FilteredDataSource with masterDataSource
      setFilteredData(masterData);
      setSearch(text);
    }
  }



  const renderItem = ({ item }) => {


    return (
      <TouchableOpacity style={styles.elementsView} activeOpacity={0.8} onPress={() => { navigation.navigate('PlanDetails', { planId: item.id }) }}>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <View style={{ justifyContent: 'center', alignItems: 'center', paddingRight: '5%', }}>
            {/* <Image
              source={require('../../assets/images/confirmed.png')}
              style={{ ...styles.imageView }}
            /> */}
            <Entypo name='back-in-time' size={40} color={Colors.primary} />

            {/* <Text style={{ fontSize: 12, color: 'black', fontFamily: 'AvenirNextCyr-Medium', marginTop: 5 }}>{item?.type}</Text> */}
          </View>

          <View style={{
            flex: 1,
            // marginLeft: 25,
            paddingHorizontal: '2%',
            // borderLeftWidth: 1.5,
            // paddingLeft: 20,
            // borderStyle: 'dotted',
            borderColor: 'grey',
            // justifyContent: 'space-around'
          }}>
            <View style={{ flexDirection: "row", justifyContent: 'space-between' }}>
              <Text
                style={{
                  color: Colors.primary,
                  fontSize: 16,
                  fontFamily: "AvenirNextCyr-Medium",
                  borderBottomColor: "grey",
                  borderBottomWidth: 0.5,
                }}
              >
                {item?.name}
                {/* ({item?.assignee_name}-{item?.assigne_to}) */}
              </Text>

              {item?.status == "Pending" && <TouchableOpacity
                onPress={() => navigation.navigate('CreatePlan', { screen: 'edit', planId: item?.id })}
              >
                <Feather name="edit" size={15} color='black' />
              </TouchableOpacity>}
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
              <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}>{moment(item.start_date).format('DD-MM-YYYY')} To {moment(item.end_date).format('DD-MM-YYYY')}</Text>

            </View>

            <View style={{ justifyContent: 'space-between', flexDirection: 'row', marginTop: 5 }}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ color: 'black', fontSize: 13, fontFamily: 'AvenirNextCyr-Medium' }}>{item?.username} </Text>
                {/* <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}>{Number(item?.product_list.length)}</Text> */}
              </View>

              {/* <View style={{ flexDirection: 'row' }}>
                <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}>Total Price: </Text>
                <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}>{Number(item?.total_price)}</Text>
              </View> */}
            </View>
          </View>
        </View>
        {/* <Text style={{ fontSize: 12, color: 'black', fontFamily: 'AvenirNextCyr-Medium', marginTop: 5 }}>Confirmed</Text> */}
      </TouchableOpacity>
    )
  }

  return (
    // <View style={{ flex: 1, backgroundColor: 'red' }}>
    <LinearGradient colors={Colors.linearColors}
      start={Colors.start} end={Colors.end}
      locations={Colors.location}
      style={{ flex: 1 }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', height: '10%', alignItems: 'center', alignContent: 'center', textAlign: 'center', paddingHorizontal: '4%' }}>
        <TouchableOpacity onPress={() => { navigation.goBack() }}>
          <Image source={require('../../assets/images/Refund_back.png')} style={{ height: 30, width: 30 }} />
        </TouchableOpacity>
        <Text style={{ fontFamily: 'AvenirNextCyr-Medium', fontSize: 19, marginLeft: 8, color: 'white' }}>Plans   </Text>
        <TouchableOpacity
          onPress={() => {
            setModalVisible(true)
          }}
        >
          {/* <AntDesign name="filter" size={22} color="white" /> */}
        </TouchableOpacity>
      </View>

      <Searchbar
        style={{ marginHorizontal: '4%', marginBottom: '4%', backgroundColor: '#F3F3F3', fontFamily: 'AvenirNextCyr-Medium' }}
        placeholder="Search Plan"
        placeholderTextColor='grey'
        onChangeText={(val) => setSearch(val)}
        value={search}
      />

      {selectedOption === "custom" && <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: '5%', backgroundColor: 'rgba(158, 78, 126, 0.61)', paddingVertical: '2%' }}>

        <Text style={{ color: 'white', fontFamily: 'AvenirNextCyr-Medium', fontSize: 16 }}>
          Filter
        </Text>

        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', }}>
          <Text style={{ color: 'white', fontFamily: 'AvenirNextCyr-Medium', borderWidth: 1, borderColor: 'white', paddingHorizontal: '2%', borderRadius: 20, paddingVertical: '1%', }}>
            {selectedDate}
          </Text>

          <TouchableOpacity onPress={clearFilters}>
            <AntDesign name='close' size={20} color={`white`} />

          </TouchableOpacity>
        </View>

      </View>}
      {/* <Text style={{ marginLeft: 50 }}> {topBarData?.count} Results</Text> */}
      <Tab.Navigator
        screenOptions={{
          tabBarIndicatorStyle: { backgroundColor: Colors.primary }
        }}
        style={{ borderTopLeftRadius: 20, borderTopRightRadius: 20 }}

      >
        {/* Pass 'pendingArray' as a prop to the Pending component */}
        <Tab.Screen
          name="Pending"
          options={{ title: 'Pending', tabBarLabelStyle: { fontFamily: 'AvenirNextCyr-Medium', textTransform: 'capitalize', fontWeight: 'bold' } }}
        >
          {() => <Pending pendingArray={filteredPendingArray} navigation={navigation} renderItem={renderItem} />}
        </Tab.Screen>

        {/* Pass 'completedArray' as a prop to the Delivered component */}
        <Tab.Screen
          name="Approved"
          options={{ title: 'Approved', tabBarLabelStyle: { fontFamily: 'AvenirNextCyr-Medium', textTransform: 'capitalize', fontWeight: 'bold' } }}
        >
          {() => <Approved approvedArray={filteredApprovedArray} navigation={navigation} renderItem={renderItem} />}
        </Tab.Screen>


        <Tab.Screen
          name="Completed"
          options={{ title: 'Completed', tabBarLabelStyle: { fontFamily: 'AvenirNextCyr-Medium', textTransform: 'capitalize', fontWeight: 'bold' } }}
        >
          {() => <Completed completedArray={filteredCompletedArray} navigation={navigation} renderItem={renderItem} />}
        </Tab.Screen>

      </Tab.Navigator>

      <Modal
        visible={modalVisible}
        transparent={true}>

        <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', paddingHorizontal: 10 }}>

          <View style={{ backgroundColor: 'white', paddingHorizontal: 5, borderRadius: 8, paddingVertical: '4%' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: '4%' }}>
              {/* <View>
  
                            </View> */}
              <Text style={{ fontSize: 20, color: 'black', fontFamily: 'AvenirNextCyr-Medium' }}>Filter Orders</Text>
              {/* <TouchableOpacity onPress={() => {
                                setSearch('');
                                setModalVisible(false)
                            }}>
                                <AntDesign name='close' size={20} color={`black`} />
                            </TouchableOpacity> */}
            </View>


            <View style={{ flexDirection: 'row', gap: 20, justifyContent: 'center', marginVertical: '4%' }}>
              <View
                style={{
                  flexDirection: 'row',
                  // paddingHorizontal: '3%',
                  paddingVertical: '1%',
                  backgroundColor: selectedOption === 'all' ? Colors.primary : 'white',
                  color: selectedOption === 'all' ? 'white' : 'black',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 30,
                  width: '40%'
                }}
              >

                <RadioButton.Android color={'white'} status={selectedOption === 'all' ? 'checked' : 'unchecked'} onPress={() => handleSelect('all')} />
                <TouchableOpacity onPress={() => handleSelect('all')}>
                  <Text style={{ fontFamily: 'AvenirNextCyr-Medium', fontSize: 12, color: selectedOption === 'all' ? 'white' : 'black' }}>ALL </Text>
                </TouchableOpacity>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  // paddingHorizontal: '3%',
                  width: '40%',
                  paddingVertical: '1%',
                  backgroundColor: selectedOption === 'custom' ? Colors.primary : 'white',
                  color: selectedOption === 'custom' ? 'white' : 'black',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 30,
                }}
              >

                <RadioButton.Android color={'white'} status={selectedOption === 'custom' ? 'checked' : 'unchecked'} onPress={() => handleSelect('custom')} />
                <TouchableOpacity onPress={() => handleSelect('custom')}>
                  <Text style={{ fontFamily: 'AvenirNextCyr-Medium', fontSize: 12, color: selectedOption === 'custom' ? 'white' : 'black' }}>CUSTOM </Text>
                </TouchableOpacity>
              </View>
            </View>


            {selectedOption === 'custom' &&
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F4F4F4', paddingVertical: '3%', paddingHorizontal: '6%' }}>


                <View><Text style={{ fontFamily: 'AvenirNextCyr-Medium', fontSize: 18, color: 'black' }}>Select Date</Text></View>

                <View>
                  <InputWithLabel
                    value={date}
                    onPress={() => {
                      setDatePickerVisible(true);
                    }}

                  /></View>
                {isDatePickerVisible == true ?
                  <DatePicker
                    modal
                    theme='light'
                    mode={'date'}
                    open={isDatePickerVisible}
                    date={date}
                    format="DD-MM-YYYY"
                    locale='en-GB'
                    // minDate="2022-01-01"
                    // maximumDate={new Date()}
                    onConfirm={(date) => {
                      // const dateString = date.toLocaleDateString();
                      const dateString = moment(date).format('YYYY-MM-DD');
                      setDatePickerVisible(false);
                      setSelectedDate(dateString);
                      setDate(date)
                    }}
                    onCancel={() => {
                      setDatePickerVisible(false)
                    }}
                  /> : null}
              </View>
            }

            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <LinearGradient colors={Colors.linearColors}
                start={Colors.start} end={Colors.end}
                locations={Colors.location}
                style={{ borderRadius: 50, alignItems: 'center', marginTop: '3%', width: '70%', height: 50 }}
              >
                <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={handleFilter}>
                  <Text style={styles.btnText}>Apply</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>

  )
}

export default AllPlans

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
    borderBottomColor: 'black',
    borderBottomWidth: 0.5,
    // elevation: 5,
    // ...globalStyles.border,
    padding: 20,

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
})