import React, { useState, useEffect, useRef, useContext, useCallback } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Dimensions, ScrollView, FlatList, Pressable, Alert, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DatePicker from 'react-native-date-picker'
import { Image } from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import Colors from '../../constants/Colors';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { AuthContext } from '../../Context/AuthContext';
import { DatePickerModal } from 'react-native-paper-dates';


const CreatePlanMulti = ({ navigation }) => {
  // new
  const { token, userData } = useContext(AuthContext);
  const [planName, setPlanName] = useState('');
  const [masterData, setMasterData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentView, setCurrentView] = useState("Initial");

  const [dates, setDates] = React.useState();
  const [open, setOpen] = React.useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);

  const handleCalendarPress = (customer) => {
    setSelectedCustomerId(customer.id);
    setDates(customer.chosenDates || []);
    setOpen(true);
  };


  const onDismiss = React.useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const onConfirm = useCallback((params) => {
    setOpen(false);
    setDates(params.dates);
    setFilteredData((prevData) => prevData.map((customer) => {
      if (customer.id === selectedCustomerId) {
        return { ...customer, chosenDates: params.dates };
      }
      return customer;
    }));
  }, [selectedCustomerId]);

  console.log("filteredData", filteredData)




  useEffect(() => {
    //getting active dealer list for the particular user
    getActiveDealerList();
  }, [])

  const getActiveDealerList = async () => {
    setLoading(true)
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
      .then(async result => {
        console.log('active dealer api  res', result);
        setMasterData(result)
        setFilteredData(result);
        setLoading(false);

      })
      .catch(error => {
        setLoading(false);
        console.log('error in api get_accounts_visit', error)
      });

  }




  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity style={styles.elementsView} activeOpacity={0.8}
      // onPress={() => { handleCheckboxChange(item) }}
      >
        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
          <View disabled={item?.account_profile_pic ? true : false}>
            {item.account_profile_pic ? (
              <Image
                source={{ uri: item.account_profile_pic }}
                style={{ ...styles.avatar }}
              />
            ) : (
              <Image
                source={require('../../assets/images/doctor.jpg')}
                style={{ ...styles.avatar }}
              />
            )}
          </View>
          <View style={{
            flex: 1
          }}>
            <Text style={{ color: Colors.primary, fontSize: 12, fontFamily: 'AvenirNextCyr-Medium', borderBottomColor: 'grey' }}>{item?.name}</Text>
            <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}>12345</Text>

          </View>
          <TouchableOpacity
            onPress={() => handleCalendarPress(item)}
            style={{ backgroundColor: Colors.primary, width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' }}>
            {/* <Text>Choose Date</Text> */}
            <FontAwesome name="calendar-plus-o" size={20} color="white" />
          </TouchableOpacity>
        </View>

      </TouchableOpacity>
    )

  }



  const onPressContinue = () => {

    if (planName) {
      navigation.navigate('SelectCustomer')
    }
    else {
      Alert.alert('Warning', 'Please enter Plan name')
    }

  }


  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={{ ...styles.headercontainer }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <AntDesign name='arrowleft' size={25} color={Colors.black} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create</Text>
          <Text></Text>
        </View>
        <View style={styles.cardContainer1}>
          <View style={styles.buttonContainer}>

            <TouchableOpacity
              style={
                currentView === "Initial"
                  ? [styles.tabButton, styles.activeTabButton]
                  : styles.tabButton
              }
              onPress={() =>
                setCurrentView("Initial") && styles.activeTabButton
              }
            >
              {/* <Text style={styles.tabButtonText}>Supplier Details</Text> */}
            </TouchableOpacity>

            <TouchableOpacity
              style={
                currentView === "Second"
                  ? [styles.tabButton, styles.activeTabButton]
                  : styles.tabButton
              }
              onPress={() =>
                setCurrentView("Second") && styles.activeTabButton
              }
            >
        
            </TouchableOpacity>

            
          </View>
          <View>
            <Text style={styles.labelText}>Plan</Text>
            <View style={styles.inputContainer} >
              <TextInput
                style={styles.input2}
                placeholder={`Enter plan name`}
                onChangeText={(val) => setPlanName(val)}
                value={planName}
                keyboardShouldPersistTaps='always'
              />
            </View>
          </View>





          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: 'AvenirNextCyr-Medium', marginTop: '3%' }}>Choose customers</Text>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={filteredData}
              keyboardShouldPersistTaps='handled'
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
            />
          </View>


          {/* <View style={{ flex: 1, justifyContent: 'flex-end' }}>
            <LinearGradient
              colors={Colors.linearColors}
              start={Colors.start}
              end={Colors.end}
              locations={Colors.ButtonsLocation}
              style={{ borderRadius: 30 }}
            >
              <TouchableOpacity style={styles.button}
                // onPress={checkActivePlanExist}
                onPress={onPressContinue}
                activeOpacity={0.8}>
                <Text style={styles.btnText}>Continue</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View> */}
        </View>


        <DatePickerModal
          locale="en"
          mode="multiple"
          visible={open}
          onDismiss={onDismiss}
          dates={dates}
          onConfirm={onConfirm}
        />

      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    paddingHorizontal: 16
  },
  dropdown: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
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
    fontFamily: 'AvenirNextCyr-Medium'
  },
  inputView: {
    width: "100%",
    backgroundColor: "#ffffff",
    height: 40,
    borderWidth: 0.5,
    borderColor: 'grey',
    flexDirection: 'row',
    justifyContent: "center",
    alignItems: 'center',
    marginTop: 5

  },
  textinputView: {
    width: "20%",
    //backgroundColor: "red",
    height: 20,
    borderWidth: 0.5,
    borderColor: 'grey',
    flexDirection: 'row',
    justifyContent: "center",
    alignItems: 'center',
    marginTop: 5

  },
  planinputView: {
    width: "100%",
    backgroundColor: "#ffffff",
    height: 40,
    borderWidth: 0.5,
    borderColor: 'grey',
    flexDirection: 'row',
    justifyContent: "flex-start",
    marginTop: 5

  },
  placeholderStyle: {
    fontSize: 16,
    fontFamily: 'AvenirNextCyr-Medium'

  },

  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },

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
  labelText: {
    fontFamily: 'AvenirNextCyr-Medium',
    color: Colors.black,
    fontSize: 16,
    marginTop: 5,
  },


  input2: {
    fontFamily: 'AvenirNextCyr-Medium',
    padding: 8,
    flex: 1,

  },
  inputContainer: {
    marginVertical: 3,
    borderColor: 'grey',
    color: 'black',
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  input: {
    marginVertical: 3,
    padding: 8,
    borderColor: 'grey',
    color: 'black',
    borderWidth: 1,
    fontFamily: 'AvenirNextCyr-Medium'
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 3,
    padding: 10,
    borderColor: 'grey',
    borderWidth: 1,
  },
  dateText: {
    color: 'black',
    fontFamily: 'AvenirNextCyr-Medium'
  },
  button: {
    height: 50,
    //marginTop: 20,
    // backgroundColor:'red',
    justifyContent: 'center',
    alignItems: 'center',
    // borderRadius: 8,
    // backgroundColor: Colors.primary,
    borderRadius: 30
  },
  btnText: {
    fontFamily: 'AvenirNextCyr-Medium',
    color: '#fff',
    fontSize: 16
  },
  button1: {
    height: 45,
    //marginTop: 20,
    // backgroundColor:'red',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: Colors.primary,
    paddingLeft: 5,
    paddingRight: 5,
  },
  btnText1: {
    fontFamily: 'AvenirNextCyr-Medium',
    color: Colors.primary,
    fontSize: 11,
  },
  cardContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    // borderWidth: 1,
    // borderColor: Colors.primary, // You can replace this with the desired border color
    padding: 10,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flex: 0.8
  },
  cardContainer1: {
    backgroundColor: 'white',
    borderRadius: 10,
    // borderWidth: 1,
    // borderColor: Colors.primary, // You can replace this with the desired border color
    padding: 12,
    // marginVertical: 15,

    flex: 1
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
  ColabButton: {
    backgroundColor: Colors.primary,
    paddingVertical: '1%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderRadius: 20,
    width: '33%',
    paddingHorizontal: '2%'
  },
  elementsView: {
    paddingVertical: 15,
    // paddingHorizontal: 10,
    borderBottomColor: 'grey',
    borderBottomWidth: 0.7,
    backgroundColor: "white",
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

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
    // backgroundColor: "lightgray",
    paddingVertical: "2%",
    borderRadius: 5,
    height: 0.5
  },
  tabButton: {
    paddingHorizontal: "2%",
    // paddingVertical: "2%",
    borderRadius: 5,
    fontSize: 10,
    backgroundColor: "lightgray",
    height: 10,
    width: '48%'

  },
  tabButtonText: {
    color: "white",
    fontFamily: "AvenirNextCyr-Medium",
  },
  activeTabButton: {
    backgroundColor: Colors.primary,
    height: 10,

    // paddingVertical: '2%',
    borderRadius: 5,
    // fontSize: 10,
    width: '48%'

  },

});

export default CreatePlanMulti;