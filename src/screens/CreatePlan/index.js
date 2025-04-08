import React, { useState, useEffect, useRef, useContext } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Dimensions, ScrollView, FlatList, Pressable, Alert, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../../constants/Colors';
import AntDesign from 'react-native-vector-icons/AntDesign';
// import { RadioButton } from 'react-native-paper';
import Initial from './Initial';
import CustomerSelect from './CustomerSelect';
import LinearGradient from 'react-native-linear-gradient';
import { AuthContext } from '../../Context/AuthContext';



const CreatePlan = ({ navigation, route }) => {


  const { screen, planId } = route?.params;


  const [currentView, setCurrentView] = useState("Initial");
  const [loading, setLoading] = useState(false);
  const [masterData, setMasterData] = useState([]);


  const { userData,
    planName, setPlanName,
    date, setDate,
    enddate, setEndDate } = useContext(AuthContext);


  const childRef = useRef();

  const callHandleDateChange = (value, index) => {
    childRef.current.handleDateChange(value, index);
  };


  const handlePress = () => {
    if (!planName || !date || !enddate) {
      Alert.alert("Validation Error", "Please fill in all the required fields.");
    } else {
      setCurrentView("Second");
    }
  };


  useEffect(() => {
    // Getting active dealer list for the particular user
    if (screen == "edit") {
      getPlanDetails();
    }
  }, []);

  const getPlanDetails = async () => {
    setLoading(true);
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${userData.token}`);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };


    // console.log(`https://gsidev.ordosolution.com/api/sales_tourplan/${planId}/?user_id=${userData.id}`)

    await fetch(`https://gsidev.ordosolution.com/api/sales_tourplan/${planId}/?user_id=${userData.id}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log("result", result)
        setMasterData(result);
        populateFields(result);
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
        console.log('error in api get_accounts_visit', error);
      });
  };


  const populateFields = async (result) => {
    // Convert the dates to Date objects
    const startDate = new Date(result?.start_date);
    const endDate = new Date(result?.end_date);

    // Set the state and call the child function
    setPlanName(result?.name);
    setDate(startDate);
    callHandleDateChange(startDate, 1);
    setEndDate(endDate);
    callHandleDateChange(endDate, 2);
  };



  return (


    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>

        <View style={{ ...styles.headercontainer }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <AntDesign name='arrowleft' size={25} color={Colors.black} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{screen == "create" ? 'Create Plan' : 'Edit Plan'}</Text>
          <Text></Text>

        </View>

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
        <Text style={styles.pageIndicator}>
          {currentView === "Initial" ? "Page 1 of 2" : "Page 2 of 2"}
        </Text>

        <View style={{ flex: 1 }}>
          {currentView === "Initial" ? <Initial ref={childRef} /> : <CustomerSelect setCurrentView={setCurrentView} navigation={navigation} activityArray={masterData.activity} screen={screen} planId={planId} />}
        </View>

        {currentView == "Initial" && <View style={{ justifyContent: 'flex-end', margin: '3%', gap: 5 }}>
          <LinearGradient
            colors={Colors.linearColors}
            start={Colors.start}
            end={Colors.end}
            locations={Colors.ButtonsLocation}
            style={{
              // padding: 5,
              borderRadius: 5,
              alignSelf: 'flex-end',
              paddingHorizontal: "3%",
              paddingVertical: "2%",
            }}
          >
            <TouchableOpacity
              style={styles.NextPrevBtn}
              onPress={handlePress}
            >
              <Text style={styles.tabButtonText}>
                <AntDesign name="right" size={20} color={`white`} />

              </Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>}
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
    borderRadius: 8
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
  pageIndicator: {
    // textAlign: 'flex-end',
    fontSize: 14,
    fontFamily: "AvenirNextCyr-Medium",
    textAlign: 'right',
    paddingRight: '3%'
  },

});

export default CreatePlan;