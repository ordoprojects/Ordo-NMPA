import React, { useState, useEffect, useRef, useContext } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Dimensions, ScrollView, FlatList, Pressable, Alert, TouchableOpacity } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import DatePicker from 'react-native-date-picker'
import { Image } from 'react-native-animatable';

import LinearGradient from 'react-native-linear-gradient';
import Colors from '../../constants/Colors';
import AntDesign from 'react-native-vector-icons/AntDesign';
// import { RadioButton } from 'react-native-paper';
import RadioButton from 'react-native-radio-button'
import moment from 'moment';
import { format, lastDayOfMonth, getDay, addDays, toDate } from 'date-fns';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../../Context/AuthContext';
import globalStyles from '../../styles/globalStyles';
import { Dropdown } from 'react-native-element-dropdown';

const MerchCreatePlan = ({ navigation }) => {
  // new

  // const [checked, setChecked] = React.useState('first');
  // const [currentDate, setCurrentDate] = useState('');
  // const [lastDateOfMonth, setLastDateOfMonth] = useState('');

  // useEffect(() => {
  //   const currentDateFormatted = moment().format('YYYY-MM-DD');
  //   setCurrentDate(currentDateFormatted);

  //   const lastDateOfMonthFormatted = moment().endOf('month').format('YYYY-MM-DD');
  //   setLastDateOfMonth(lastDateOfMonthFormatted);
  // }, []);

  // const [radioValue, setRadioValue] = useState('monthly');

  const { token,userData } = useContext(AuthContext);

  // const handleRadioButtonChange = (value) => {
  //   setRadioValue(value);

  //   if (value === 'monthly') {
  //     setDateText2(format(lastDayOfMonth(new Date()), 'yyyy-MM-dd'));
  //   } else if (value === 'weekly') {
  //     const currentDate = new Date();
  //     let fridayDate = currentDate;

  //     while (getDay(fridayDate) !== 5) {
  //       fridayDate = addDays(fridayDate, 1);
  //     }

  //     setDateText2(format(fridayDate, 'yyyy-MM-dd'));
  //   }
  // };
  // const [rSelected, setRSelected] = useState(false)
  // const handleRadioButtonChange = (value) => {
  //   setRadioValue(value);

  //   if (value === 'monthly') {
  //     setDateText2(format(lastDayOfMonth(new Date()), 'yyyy-MM-dd'));
  //   } else if (value === 'weekly') {
  //     const currentDate = new Date();
  //     let fridayDate = currentDate;

  //     while (getDay(fridayDate) !== 5) {
  //       fridayDate = addDays(fridayDate, 1);
  //     }

  //     setDateText2(format(fridayDate, 'yyyy-MM-dd'));
  //   }
  // };
  // new
  const width = Dimensions.get('window').width


  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  // const [isSelected, setSelection] = useState(false);
  const [accountsarray, setAccountsArray] = useState([]);
  const [planName, setPlanName] = useState('');
  const dealerChoosen = useRef(false);


  //radrio val hooks 
  const [mSelected, setMSelected] = useState(true)
  const [wSelected, setWSelected] = useState(false)






  useEffect(() => {

    const loadAcccounts = async () => {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${userData.token}`);
  
  
      // var raw = JSON.stringify({
      //   __user_id__: "2bb36b96-2bcb--2ee1-64a54b69ddcf",
      // });
  
      var requestOptions = {
        method: "GET",
        headers: myHeaders,
        // body: raw,
        redirect: "follow",
      };
  
      fetch("https://gsidev.ordosolution.com/api/customer/", requestOptions)
        .then((response) => response.json())
        .then(async (result) => {
console.log("mbmbmnbm",result)
          // for (var i = 0; i < result.length; i++) {
          //   result[i].checked = false;
          //   //result.entry_list[i].visitcount = ""
          // }


          let tempArray = await result.map((item) => {

            return {
              ...item,
              checked: false,
              from: null,
              to: null
            }
          })
          setAccountsArray(tempArray);
          console.log('tmp Array', tempArray)

        })
        .catch(error => console.log('error', error));
    }
    loadAcccounts();
  }, []);


  // const updateVisitCount = (text, index) => {
  //   var myarray = [...accountsarray];
  //   myarray[index].visitcount = ""
  //   myarray[index].visitcount = text
  //   myarray[index].checked = true
  //   setAccountsArray(myarray);

  // }
  const handleCheckboxChange = (index) => {

    var myarray = [...accountsarray];
    myarray[index].checked = !accountsarray[index].checked;
    setAccountsArray(myarray);

  }
  const [startDate, setStartDate] = useState("")
  const [stopDate, setStopDate] = useState("")

  //date hooks
  //selected item hooks
  const [selectedId, setSelectedId] = useState('');
  const [fromopen, setFromOpen] = useState(false)
  const [toopen, setToOpen] = useState(false)

  const [fromDate, setFromDate] = useState(new Date())
  const [todate, setToDate] = useState(new Date())



  //handle from date change
  const handleDateChange = (date, type) => {

    console.log("from date", date, type);
    let validDate = true;
    // Update the "From" and "To" dates for the selected item in the data array
    let tempArray = accountsarray.map((item) => {
      // if (date < item.from || date < item.to) {
      //   console.log("invalod date")
      //   Alert.alert('Invalid Date', 'Please Select less date');
      //   validDate = false
      // }
      let editObject = {};
      if (type == 'from') {
        editObject = { ...item, from: validDate ? date : null, checked: true }
      }
      else {
        editObject = { ...item, to: validDate ? date : null, checked: true }
      }
      return item.id === selectedId
        ? editObject : item
    })
    setAccountsArray(tempArray)




  };



  // {renderLabel()}
  // <Dropdown
  //   style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
  //   placeholderStyle={styles.placeholderStyle}
  //   selectedTextStyle={styles.selectedTextStyle}
  //   inputSearchStyle={styles.inputSearchStyle}
  //   iconStyle={styles.iconStyle}
  //   data={data}
  //   search
  //   maxHeight={400}
  //   labelField="label"
  //   valueField="value"
  //   placeholder={!isFocus ? 'Choose Purpose' : '...'}
  //   searchPlaceholder="Search..."
  //   value={value}
  //   onFocus={() => setIsFocus(true)}
  //   onBlur={() => setIsFocus(false)}
  //   onChange={item => {
  //     setValue(item.value);
  //     setIsFocus(false);
  //   }}
  // />
  const renderLabel = () => {
    if (value || isFocus) {
      return (
        <Text style={[styles.label, isFocus && { color: 'blue' }]}>
          Purpose of Visit
        </Text>
      );
    }
    return null;
  }

  const createPlanPressed = () => {
    if (planName) {
      //console.log("dealer array",accountsarray)
      let dealerArray = []
      accountsarray.forEach((item) => {
        //push only if no of visit count > 0 
        if (item.from && item.to && item?.checked) {
          dealerChoosen.current = true;
          dealerArray.push({
            account_id_c: item?.id,
            start_date: moment(item.from).format('YYYY-MM-DD'),
            end_date: moment(item.to).format('YYYY-MM-DD'),
          })
        }
        console.log("id", item.id)
        console.log("count", item.visit)
      })
      console.log("final dealer array", dealerArray)
      if (dealerChoosen.current) {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "text/plain");



        var raw = JSON.stringify({
          "__name__": planName,
          "__po_ordousers_id_c__": token,
          "records": dealerArray,
        });
        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'follow'
        };

        fetch("https://dev.ordo.primesophic.com/set_merchandisertourplan.php", requestOptions)
          .then(response => response.json())
          .then(result => {
            console.log(result.status);
            Alert.alert('Create Plan', 'Plan created successfully', [
              { text: 'OK', onPress: () => navigation.goBack() }
            ])
          })
          .catch(error => console.log('error', error));

      }
      else {
        Alert.alert('Warning', 'Please choose atleast one dealer or Enter both from and to date')
      }
    }
    else {
      Alert.alert('Warning', 'Please enter all the details')
    }

  }


  const RenderItems = ({ item, index }) => (
    <View style={{ marginHorizontal: 5, padding: 10, borderColor: Colors.black, elevation: 5, ...globalStyles.border, backgroundColor: '#fff', marginVertical: 5, borderRadius: 5 }} >
      {/* */}
      <View style={{ flexDirection: "row", alignItems: 'center', }}>
        <Pressable
          style={{
            color: "#F5904B",
            width: 20,
            height: 20,
            marginTop: 5,
            borderRadius: 4,
            borderWidth: 2,
            borderColor: 'grey',
            alignItems: 'center',
            justifyContent: 'center',
            //marginRight: 8,
            backgroundColor: item.checked ? 'white' : 'transparent',
          }}
          onPress={() => handleCheckboxChange(index)}
        >
          {item.checked && <Text style={{ color: '#F5904B', fontSize: 12, fontWeight: 'bold' }}>✓</Text>}
        </Pressable>
        {/* <Image style={{ width: 20, height: 20, marginLeft: 10, marginTop: 5 }} source={{ uri: `https://dev.ordo.primesophic.com/upload/${item?.id}_img_src_c` }}></Image> */}
        <Text style={{ marginLeft: 10, color: '#000', borderBottomColor: '#7A7F85', justifyContent: 'center', textAlign: 'left', fontSize: 14, height: 30, textAlignVertical: 'center', alignSelf: 'center', marginTop: 10, fontFamily: 'AvenirNextCyr-Medium' }}>{item?.name}</Text>
      </View>
      <TouchableOpacity
        style={{ flexDirection: "row", alignItems: 'center', marginTop: 5 }}
        onPress={() => {
          setSelectedId(item.id)
          setFromOpen(true)
        }}
      >
        <Text style={{ fontSize: 14, color: Colors.black, fontFamily: 'AvenirNextCyr-Medium' }}>From</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginLeft: 10, borderColor: 'grey', borderWidth: 0.5, height: 30, width: 200 }}>
          <Text style={{ marginLeft: 5, fontSize: 12, color: Colors.black, fontFamily: 'AvenirNextCyr-Medium' }}>{item.from ? moment(item.from).format('DD-MM-YYYY') : 'Select from date'}</Text>
          <Image style={{ width: 20, height: 20, marginRight: 15 }} source={require("../../assets/images/calendar.png")}></Image>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={{ flexDirection: "row", alignItems: 'center', marginTop: 5 }}
        onPress={() => {
          setSelectedId(item.id)
          setToOpen(true)
        }}
      >
        <Text style={{ fontSize: 14, color: Colors.black, fontFamily: 'AvenirNextCyr-Medium' }}>To</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginLeft: 30, borderColor: 'grey', borderWidth: 0.5, height: 30, width: 200 }}>
          <Text style={{ marginLeft: 5, fontSize: 12, color: Colors.black, fontFamily: 'AvenirNextCyr-Medium' }}>{item.to ? moment(item.to).format('DD-MM-YYYY') : 'Select to date'}</Text>
          <Image style={{ width: 20, height: 20, marginRight: 15 }} source={require("../../assets/images/calendar.png")}></Image>
        </View>
      </TouchableOpacity>

    </View>



  )

  const InputWithLabel = ({ title, value, onPress }) => {
    return (
      <View>
        <Text style={styles.labelText}>{title}</Text>
        {/* <Pressable style={{ ...styles.inputContainer }} onPress={onPress} >
          <Text style={styles.input2}>{value ? value : 'Select date'}</Text>
          <Image style={{ width: 20, height: 20, marginRight: 15 }} source={require("../../assets/images/calendar.png")}></Image>
        </Pressable> */}
      </View>
    )

  }

  // //checking user has active plan or not
  const checkActivePlanExist = () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "text/plain");


    var raw = JSON.stringify({
      "__start_date__": moment(startDate).format('YYYY-MM-DD'),
      "__end_date__": moment(stopDate).format('YYYY-MM-DD'),
      "__user_id__": token,
      // "account_id_c": "2713663b-6639-d590-23a2-62fce7997e49"
    });

    console.log(raw)
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("https://dev.ordo.primesophic.com/get_check_merchandiser_plan_already.php", requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result);
        if (result?.is_already) {
          //user have active plan
          Alert.alert('Plan Exists', 'You already have active plan', [
            { text: 'OK', onPress: () => navigation.goBack() },
          ]);
        }
        else {
          //user dont have active plan
          //createPlanPressed();

        }

      })
      .catch(error => console.log('error', error));

  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      {/* <View style={{ flex: 0.1, backgroundColor: 'white', alignContent: 'center', justifyContent: 'center', width: width, flexDirection: 'row', height: 30 }}>
        <TouchableOpacity style={{ width: 30, height: 30, marginTop: 20,marginLeft:10 }} onPress={() => {navigation.goBack() }}>
          <Image source={require('../../assets/images/arrow-left.png')} style={{ width: 30, height: 30, resizeMode: 'contain' }}></Image>
        </TouchableOpacity>
        <Text style={{ alignSelf: 'center', fontSize: 20, fontWeight: "500", width: width - 40, marginHorizontal: 0, height: 30, textAlign: 'center',fontFamily:'AvenirNextCyr-Medium' ,color:'#000'}}>Create Plan</Text>
      </View> */}
      <View style={{ ...styles.headercontainer }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name='arrowleft' size={25} color={Colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Plan</Text>
        <Text style={styles.headerTitle}>  </Text>

      </View>
      <View style={{ paddingHorizontal: 16 }}>
        <View>
          <Text style={styles.labelText}>Start Plan</Text>
          <View style={styles.inputContainer} >
            <TextInput
              style={styles.input2}
              placeholder={`Enter plan name`}
              onChangeText={(val) => setPlanName(val)}
              value={planName}
            />
          </View>
        </View>

        {/* <View>
          <Text style={styles.labelText}>Start Date</Text>
          <View style={styles.inputContainer} >
            <Text style={styles.input2}>{moment(dateText1).format('DD-MM-YY')}</Text>
          </View>
        </View>

        <View>
          <Text style={styles.labelText}>End Date</Text>
          <View style={styles.inputContainer} >
            <Text style={styles.input2}>{moment(dateText2).format('DD-MM-YY')}</Text>
          </View>
        </View> */}

        <View style={{ flexDirection: 'row', marginTop: 10 }}>
          {/* <RadioButton.Group
            onValueChange={handleRadioButtonChange}
            value={radioValue}
          >
            <View style={{flexDirection:'row'}}>
              <RadioButton.Item label="Monthly" value="monthly" />
              <RadioButton.Item label="Weekly" value="weekly" />
            </View>
          </RadioButton.Group> */}
          {/* <View style={{ flexDirection: 'row', }}>
            <RadioButton
              animation={'bounceIn'}
              isSelected={mSelected}
              size={14}
              innerColor={Colors.primary}
              outerColor={Colors.primary}
              onPress={() => {
                setMSelected(true)
                setWSelected(false)
                setDateText2(format(lastDayOfMonth(new Date()), 'yyyy-MM-dd'));
              }}
            />
            <Text style={{ ...styles.labelText, marginLeft: 5, fontSize: 14 }}>Monthly</Text>
          </View>
          <View style={{ flexDirection: 'row', marginLeft: 10 }}>
            <RadioButton
              animation={'bounceIn'}
              size={14}
              isSelected={wSelected}
              innerColor={Colors.primary}
              outerColor={Colors.primary}
              onPress={() => {
                setMSelected(false)
                setWSelected(true)
                const currentDate = new Date();
                let fridayDate = currentDate;

                while (getDay(fridayDate) !== 5) {
                  fridayDate = addDays(fridayDate, 1);
                }

                setDateText2(format(fridayDate, 'yyyy-MM-dd'));
              }}
            />
            <Text style={{ ...styles.labelText, marginLeft: 5, fontSize: 14 }}>Weekly</Text>
          </View> */}
        </View>
        {/* <InputWithLabel
          title='Start Date'
          value={currentDate} 
          // value={startDate}
          // onPress={() => setOpen(true)}
        />
        <InputWithLabel
          title='End Date'
          value={lastDateOfMonth} 
          // value={StopDate}
          // onPress={() => setStopOpen(true)}
        /> */}

      </View>
      <View style={styles.container}>


        {/* <FloatingLabelInput
          label="Plan Name"
          value={planName}
          onChangeText={setPlanName}
        /> */}


        {/* <View style={styles.inputView}>
          <Text style={{ width: width - 50, flex: 0.9 }}>{startDate}</Text>
          <TouchableOpacity onPress={() => setOpen(true)}><Image style={{ width: 20, height: 20 }} source={require("../../assets/images/calendar.png")}></Image></TouchableOpacity> */}
        {fromopen == true ?
          <DatePicker
            modal
            theme='light'
            mode={'date'}
            open={fromopen}
            date={fromDate}
            format="YYYY-MM-DD"
            minDate="2022-01-01"
            maxDate="2200-12-31"
            onConfirm={(date) => {
              setStartDate(date)
              setFromOpen(false)
              handleDateChange(date, 'from')
            }}
            onCancel={() => {
              setFromOpen(false)
            }}
          /> : null}
        {/* </View>
        <View style={styles.inputView}>
          <Text style={{ width: width - 50, flex: 0.9 }}>{StopDate}</Text>
          <TouchableOpacity onPress={() => setStopOpen(true)}><Image style={{ width: 20, height: 20 }} source={require("../../assets/images/calendar.png")}></Image></TouchableOpacity> */}
        {toopen == true ?
          <DatePicker
            modal
            theme='light'
            mode={'date'}
            open={toopen}
            date={todate}
            format="YYYY-MM-DD"
            minDate="2022-01-01"
            maxDate="2200-12-31"
            onConfirm={(date) => {
              setStopDate(date)
              setToOpen(false)
              handleDateChange(date, 'to')
            }}
            onCancel={() => {
              setToOpen(false)
            }}
          /> : null}
        {/* </View> */}
        <Text style={{ paddingLeft: 0, fontWeight: '500', color: '#000', fontFamily: 'AvenirNextCyr-Medium' }}>Choose your customer from the list</Text>
        {/* <ScrollView style={{ backgroundColor: '#FFFFFF', marginTop: 10 }}
          scrollEnabled={false}
        > */}
        {/* <View style={{ width: width }}>
          <View style={{ flexDirection: "row", backgroundColor: '#F1F2F1', height: 30, borderColor: 'grey', borderBottomWidth: 1, width: width - 20, alignItems: 'center' }} >
            <View style={{ flex: 0.5 }}>
              <Text style={{ fontFamily: 'AvenirNextCyr-Medium', color: '#000', fontSize: 12, textAlign: 'center' }}>Dealer Name</Text>
            </View>
            <View style={{ flex: 0.5 }}>
              <Text style={{ fontFamily: 'AvenirNextCyr-Medium', color: '#000', fontSize: 12, paddingLeft: 60 }}>From.</Text>
            </View>

            <View style={{ flex: 0.5 }}>
              <Text style={{ fontFamily: 'AvenirNextCyr-Medium', color: '#000', fontSize: 12, paddingLeft: 60 }}>To.</Text>
            </View>
          </View>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={accountsarray}
            extraData={true}
            style={{ height: 150 }}
            renderItem={RenderItems}
          />
        </View> */}
<View  style={{ height: '85%' }}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={accountsarray}
          extraData={true}
          // style={{ height: '70%' }}
          renderItem={RenderItems}
        />
        </View>
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
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
            margin: '2%',
            borderRadius: 30
          }}
        >
          <TouchableOpacity style={styles.button}
            onPress={createPlanPressed}
            activeOpacity={0.8}>
            <Text style={styles.btnText}>Create Plan</Text>
          </TouchableOpacity>
          </LinearGradient>
        </View>


      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    paddingHorizontal: 16
  },
  dropdown: {
    height: 50,
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
  },
  selectedTextStyle: {
    fontSize: 16,
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
    paddingHorizontal: 16,
    paddingVertical: 5,
    //backgroundColor:'red',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'space-between',
    marginTop:'2%'
    //backgroundColor:'red'
  },
  headerTitle: {
    fontSize: 19,
    fontFamily: 'AvenirNextCyr-Medium',
    color: Colors.black,
    marginLeft: 10,
    marginTop: 3
  },
  labelText: {
    fontFamily: 'AvenirNextCyr-Medium',
    color: Colors.black,
    fontSize: 16,
    marginTop: '2%',
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
  }

});

export default MerchCreatePlan;