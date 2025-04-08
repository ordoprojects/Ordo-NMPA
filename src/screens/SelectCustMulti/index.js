import React, { useState, useEffect, useContext, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, TouchableOpacity, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Colors from '../../constants/Colors';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { AuthContext } from '../../Context/AuthContext';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { DatePickerModal } from 'react-native-paper-dates';
import DateTags from './DateTags';
import OverlapCircles from './OverlapCircles';



const SelectCustMulti = ({ navigation, route }) => {
  const { planName, startDate, endDate, name } = route.params;
  console.log("qwerty", startDate, endDate)
  const { token, userData } = useContext(AuthContext);
  const [masterData, setMasterData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dates, setDates] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedCustomers, setSelectedCustomers] = useState([]);

  const handleCalendarPress = (customer) => {
    setSelectedCustomerId(customer.id);
    setDates(customer.chosenDates || []);
    setOpen(true);
  };

  const onDismiss = useCallback(() => {
    setOpen(false);
  }, []);

  // const onConfirm = useCallback((params) => {
  //   setOpen(false);
  //   setDates(params.dates);
  //   setFilteredData((prevData) => prevData.map((customer) => {
  //     if (customer.id === selectedCustomerId) {
  //       return { ...customer, chosenDates: params.dates };
  //     }
  //     return customer;
  //   }));
  // }, [selectedCustomerId]);

  const onConfirm = useCallback((params) => {
    setOpen(false);
    setDates(params.dates);

    if (selectMode) {
      // Update all selected customers with the chosen dates
      setFilteredData((prevData) => prevData.map((customer) => {
        if (selectedCustomers.some(selectedCustomer => selectedCustomer.id === customer.id)) {
          return { ...customer, chosenDates: params.dates };
        }
        return customer;
      }));
      setSelectedCustomers((prevSelected) => prevSelected.map(customer => ({
        ...customer, chosenDates: params.dates
      })));
    } else {
      // Update only the single selected customer
      setFilteredData((prevData) => prevData.map((customer) => {
        if (customer.id === selectedCustomerId) {
          return { ...customer, chosenDates: params.dates };
        }
        return customer;
      }));
    }
  }, [selectedCustomerId, selectMode, selectedCustomers]);

  useEffect(() => {
    // Getting active dealer list for the particular user
    getActiveDealerList();
  }, []);

  const getActiveDealerList = async () => {
    setLoading(true);
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${userData.token}`);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    await fetch("https://gsidev.ordosolution.com/api/assigned-customers/", requestOptions)
      .then(response => response.json())
      .then(result => {
        setMasterData(result);
        setFilteredData(result);
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
        console.log('error in api get_accounts_visit', error);
      });
  };

  const handleLongPress = (item) => {
    setSelectMode(true);
    setSelectedCustomers([item]);
  };

  const handlePress = (item) => {
    if (selectMode) {
      setSelectedCustomers((prevSelected) => {
        const isSelected = prevSelected.some(cust => cust.id === item.id);
        if (isSelected) {
          const newSelectedCustomers = prevSelected.filter(cust => cust.id !== item.id);
          if (newSelectedCustomers.length === 0) {
            setSelectMode(false);
          }
          return newSelectedCustomers;
        } else {
          return [...prevSelected, item];
        }
      });
    }
  };

  const renderItem = ({ item }) => {
    const isSelected = selectedCustomers.some(cust => cust.id === item.id);
    return (
      <TouchableOpacity
        style={[styles.elementsView, isSelected && { backgroundColor: '#e0e0e0' }]}
        activeOpacity={0.8}
        onLongPress={() => handleLongPress(item)}
        onPress={() => handlePress(item)}
      >
        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
          <View disabled={item?.account_profile_pic ? true : false}>
            {item.account_profile_pic ? (
              <Image
                source={{ uri: item.account_profile_pic }}
                style={styles.avatar}
              />
            ) : (
              <Image
                source={require('../../assets/images/doctor.jpg')}
                style={styles.avatar}
              />
            )}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: Colors.primary, fontSize: 16, fontFamily: 'AvenirNextCyr-Bold', borderBottomColor: 'grey' }}>{item?.name}-{item?.account_id}</Text>
            <Text style={{ color: 'black', fontSize: 14, fontFamily: 'AvenirNextCyr-Medium' }}>{item?.client_address}</Text>
            <DateTags dates={item.chosenDates} />
          </View>
          {!selectMode && <TouchableOpacity
            onPress={() => handleCalendarPress(item)}
            style={{ backgroundColor: Colors.primary, width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' }}>
            <FontAwesome name="calendar-plus-o" size={20} color="white" />
          </TouchableOpacity>}
        </View>
      </TouchableOpacity>
    );
  };



  const openCalendarForSelected = () => {
    setDates([]); // Reset dates to ensure a fresh start
    setOpen(true);
  };


  const handleCloseSelectMode = () => {
    setSelectMode(false);
    setSelectedCustomers([]);
  };



  const handleReviewPress = () => {
    const customersWithChosenDates = filteredData.filter(customer => customer.chosenDates && customer.chosenDates.length > 0);
    console.log()
    if (customersWithChosenDates.length > 0) {
      navigation.navigate('ReviewPlan', { chosenCustomers: customersWithChosenDates });
    } else {
      Alert.alert('No Dates Selected', 'Please select at least one date for a customer before proceeding.');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={styles.headercontainer}>
        <TouchableOpacity onPress={() => {
          if (selectMode) {
            handleCloseSelectMode();
          } else {
            Alert.alert(
              'Confirm',
              'Are you sure you want to go back? Please note that data will be lost if you proceed.',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'OK', onPress: () => navigation.goBack() },
              ],
              { cancelable: false }
            );
          }
        }}>
          <AntDesign name='arrowleft' size={25} color={Colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {selectMode ? `${selectedCustomers.length} Selected` : 'Select Customers'}
        </Text>


        <View>
          {selectMode && (
            <TouchableOpacity
              onPress={openCalendarForSelected}
              style={{ backgroundColor: Colors.primary, width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' }}>
              <FontAwesome name="calendar-plus-o" size={20} color="white" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={{ flex: 1 }}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={filteredData}
          keyboardShouldPersistTaps='handled'
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>

      <View style={{ justifyContent: 'flex-end' }}>
        <LinearGradient
          colors={Colors.linearColors}
          start={Colors.start}
          end={Colors.end}
          locations={Colors.ButtonsLocation}
          style={{
            paddingVertical: '3%',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 8,
            margin: '5%',
            borderRadius: 30
          }}
        >
          <TouchableOpacity
            style={styles.button}
            onPress={handleReviewPress}
            activeOpacity={0.8}
          >
            <Text style={styles.btnText}>
              Review
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>

      <DatePickerModal
        locale="en"
        mode="multiple"
        visible={open}
        onDismiss={onDismiss}
        dates={dates}
        onConfirm={onConfirm}
      />
    </View>
  );
};

const styles = StyleSheet.create({




  headercontainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    //backgroundColor:'red',
    flexDirection: 'row',
    alignItems: 'center',
    //backgroundColor:'red'
    justifyContent: 'space-between',
    // marginTop: 5,

  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'AvenirNextCyr-Medium',
    color: Colors.black,
    // marginLeft: 10,
    marginTop: 3
  },

  customerMainContainer: {
    // marginHorizontal: '5%',
    flex: 1
  },

  elementsView: {
    paddingVertical: 15,
    // paddingHorizontal: 10,
    borderBottomColor: 'grey',
    borderBottomWidth: 0.7,
    backgroundColor: "white",
    paddingHorizontal: '4%'
  },
  imageView: {
    width: 70,
    height: 70,

  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'gray',
  },
  avatar1: {
    width: 40,
    height: 40,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'gray',
  },

  button: {
    width: '100%',
    // paddingVertical: '3%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    // backgroundColor: Colors.primary,
    // margin: '5%',
    borderRadius: 30,
  },
  btnText: {
    fontFamily: 'AvenirNextCyr-Medium',
    color: '#fff',
    fontSize: 16
  },
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
  modalTitle: {
    fontSize: 17,
    color: 'black',
    fontFamily: 'AvenirNextCyr-Medium'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 8,
    width: '90%', // Adjust the width as needed, for example '90%'
    alignSelf: 'center', // Center the modal content horizontally
  },

  closeIcon: {
    position: 'absolute',
    top: 0,
    right: 5,
    padding: 10,
  },
  modalInnerContent: {
    marginTop: 8, // Add a margin to separate the icon from the modal content
  },
  ModalText1: {
    color: '#000000',
    textAlign: 'left',
    fontSize: 15,
    fontFamily: 'AvenirNextCyr-Medium',
    marginLeft: 1,

  },
  container1: {
    backgroundColor: 'white',
    paddingTop: 5,
    width: '100%', // Adjust the width as needed, for example '90%'
    alignSelf: 'center', // Center the container horizontally within the modal
  },

  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    width: '100%', // Set the desired width for the dropdown, for example '100%' to match the parent container
  },

  icon1: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
    fontFamily: 'AvenirNextCyr-Medium',

  },
  selectedTextStyle: {
    fontSize: 16,
    fontFamily: 'AvenirNextCyr-Medium',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    fontFamily: 'AvenirNextCyr-Medium',

  },
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
    marginLeft: 15,
    marginRight: 15,
  },
  submitButtonText: {
    color: 'grey',
    fontSize: 14,
    fontFamily: 'AvenirNextCyr-Medium'
  },
  filterButton: {
    flexDirection: 'column',
    alignItems: 'center',
    //marginTop:3
  },
  submitButton1: {
    // backgroundColor: Colors.primary,
    borderRadius: 8,
    // paddingVertical: 12,
    alignContent: 'center',
    marginBottom: '5%',
    marginLeft: 7,
    width: '90%'
  },
  ProductListContainer: {

    // flex: 1,
    // marginVertical: '4%',
  },
  noProductsContainer: {

    justifyContent: 'center',
    alignItems: 'center',
    // padding: 10,
  },
  noProductsText: {
    fontSize: 16,
    color: 'gray',
    fontFamily: 'AvenirNextCyr-Medium',
    textAlign: 'center',
    marginTop: 20,
  },
  elementsView1: {
    backgroundColor: "white",
    margin: 5,
    //borderColor: 'black',
    //flexDirection: 'row',
    //justifyContent: 'space-between',
    //alignItems: 'center',
    marginBottom: 10,
    // borderRadius: 8,
    // elevation: 5,
    // ...globalStyles.border,
    padding: 12,
    width: '95%',
    borderBottomColor: '#dfdfdf',
    borderBottomWidth: 1,

    //borderColor: '#fff',
    //borderWidth: 0.5
  },
  selectedStyle: {
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center'
  },
  selectedTextStyle: {
    fontSize: 14,
    color: 'white',
    fontFamily: 'AvenirNextCyr-Medium'
  },

  selectedCollaboratorsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  


});

export default SelectCustMulti;