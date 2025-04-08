import React, { useState, useEffect, useRef, useContext, forwardRef, useImperativeHandle } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Dimensions, ScrollView, FlatList, Pressable, Alert, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from 'react-native';
import { TextInput as TextInput1 } from "react-native-paper";

import { SafeAreaView } from 'react-native-safe-area-context';
import DatePicker from 'react-native-date-picker'
import { Image } from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import FloatingLabelInput from './FloatingLabelInput';
import Colors from '../../constants/Colors';
import AntDesign from 'react-native-vector-icons/AntDesign';
// import { RadioButton } from 'react-native-paper';
import { Searchbar, Checkbox, RadioButton } from 'react-native-paper';
import moment from 'moment';
import { format, lastDayOfMonth, getDay, addDays, startOfWeek } from 'date-fns';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../../Context/AuthContext';
import SwitchSelector from 'react-native-switch-selector';
import { types } from 'react-native-document-picker';
import { MultiSelect } from 'react-native-element-dropdown';

const data = [
  { label: 'Item 1', value: '1' },
  { label: 'Item 2', value: '2' },
  { label: 'Item 3', value: '3' },
  { label: 'Item 4', value: '4' },
  { label: 'Item 5', value: '5' },
  { label: 'Item 6', value: '6' },
  { label: 'Item 7', value: '7' },
  { label: 'Item 8', value: '8' },
];

const Initial = forwardRef(({ navigation }, ref) => {



  useImperativeHandle(ref, () => ({
    handleDateChange
  }));

  const { token, userData, planName, setPlanName,
    date, setDate,
    enddate, setEndDate } = useContext(AuthContext);
  // const [date, setDate] = useState(new Date())
  // const [enddate, setEndDate] = useState(new Date())
  const [dateText1, setDateText1] = useState('');
  const [dateText2, setDateText2] = useState('');
  // const [planName, setPlanName] = useState('');
  const [formattedDate, setFormattedDate] = useState('');
  const [open, setOpen] = useState(false)
  const [stopopen, setStopOpen] = useState(false)








  const handleDateChange = (value, index) => {
    console.log("Valueeeeee", value)
    if (index == 1) {
      const formattedDate = moment(value).format('DD/MM/YYYY');
      setDateText1(formattedDate);
      console.log('if part')
    } else if (index == 2) {
      const formattedDate = moment(value).format('DD/MM/YYYY');
      setDateText2(formattedDate);
      console.log('else part')
    }
  }






  // const InputWithLabel = ({ title, value, onPress }) => {
  //   return (
  //     <View>
  //       <Text style={styles.labelText}>{title}</Text>
  //       <Pressable style={{ ...styles.inputContainer }} onPress={onPress} >
  //         <Text style={styles.input2}>{value ? value : 'Select date'}</Text>
  //         <Image style={{ width: 20, height: 20, marginRight: 15 }} source={require("../../assets/images/calendar.png")}></Image>
  //       </Pressable>
  //     </View>
  //   )

  // }

  const InputWithLabel = ({ title, value, onPress }) => {
    return (


      <TextInput1
        // style={styles.input2}
        // placeholder={`Enter plan name`}
        value={value}
        mode="outlined"
        onPressIn={onPress}
        // disabled={true}
        label={title}
      // keyboardShouldPersistTaps='always'

      />

    )

  }



  return (

    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>

        <View style={styles.cardContainer1}>
          <View>
            {/* <Text style={styles.labelText}>Plan</Text> */}
            {/* <View style={styles.inputContainer} > */}
            <TextInput1
              // style={styles.input2}
              // placeholder={`Enter plan name`}
              onChangeText={(val) => setPlanName(val)}
              value={planName}
              mode="outlined"
              label={"Plan"}
              keyboardShouldPersistTaps='always'
            />
            {/* </View> */}
          </View>

          <View style={{ marginVertical: '4%' }}>
            <InputWithLabel

              title='Start Date'
              value={dateText1}
              onPress={() => setOpen(true)}
            />
          </View>



          <View >
            <InputWithLabel
              // flex='0.5'
              title='End Date'
              value={dateText2}
              onPress={() => setStopOpen(true)}
            />
            {/* <View style={{ flex: 0.4, alignItems: 'center', borderWidth: 1, borderColor: 'grey', borderRadius: 5, height: '52%', marginBottom: '1%', backgroundColor: '#f5f5f5' }}>
              <Text style={{ marginTop: '5%', fontFamily: 'AvenirNextCyr-Medium' }}>{selectedDay2}</Text>

            </View> */}
          </View>

          <View style={{ flex: 1, marginTop: '4%' }}>
            <TextInput1
              style={[styles.inputText, styles.addressInput]}
              // placeholder="Address"
              multiline={true}
              // value={address}
              mode="outlined"
              label="Remarks"
              numberOfLines={6}
              placeholderTextColor="grey"
            // onChangeText={(val) => {
            //   setAddress(val);
            // }}
            // onChangeText={text => updateAddress(text)}
            />
          </View>


          {open == true ?
            <DatePicker
              modal
              theme='light'
              mode={'date'}
              open={open}
              date={new Date()} // Set to current date
              format="DD-MM-YYYY"
              minimumDate={new Date()} // Set minimum date to current date
              onConfirm={(date) => {
                const dateString = date.toLocaleDateString();
                const isoString = date.toISOString();
                const formatedDate = isoString.split('T')[0];
                setFormattedDate(formatedDate);
                setDate(date);
                setOpen(false);
                handleDateChange(date, 1);
              }}
              onCancel={() => {
                setOpen(false);
              }}
            />

            : null}


          {stopopen == true ?
            <DatePicker
              modal
              theme='light'
              mode={'date'}
              open={stopopen}
              date={enddate}
              format="DD-MM-YYYY"
              // minimumDate={new Date(formattedDate)}  // Use startDate + 1 day if available, otherwise use current date
              // maximumDate={new Date()}
              // maximumDate={maximumDate} // Set minimum date to current date

              onConfirm={(date1) => {
                const dateString = date1.toLocaleDateString();
                console.log("end", dateString);
                // setStopOpen(false);
                // setEndDate(date);
                // handleDateChange(date, 2);
                // Check if the start date is less than or equal to the selected end date
                if (date.setHours(0, 0, 0, 0) <= date1.setHours(0, 0, 0, 0)) { // Assuming `date` is your start date
                  setEndDate(date1);
                  handleDateChange(date1, 2);
                  setStopOpen(false);
                } else {
                  Alert.alert('Warning', 'End date cannot be earlier than start date', [
                    { text: 'OK', onPress: () => { } } // Do nothing when OK is pressed
                  ]);
                  console.log("'Warning', 'End date cannot be earlier than start date")
                  setStopOpen(false);

                }
              }}
              onCancel={() => {
                setStopOpen(false);
              }}
            /> : null}


        </View>


      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
});

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

export default Initial;