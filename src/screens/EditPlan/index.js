import React, { useState, useEffect, useRef, useContext } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Dimensions, ScrollView, FlatList, Pressable, Alert,TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DatePicker from 'react-native-date-picker'
// import { TouchableOpacity } from 'react-native-gesture-handler';
import { Image } from 'react-native-animatable';
import { List } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import Colors from '../../constants/Colors';
import AntDesign from 'react-native-vector-icons/AntDesign';
// import { RadioButton } from 'react-native-paper';
import RadioButton from 'react-native-radio-button'
import moment from 'moment';
import { format, lastDayOfMonth, getDay,addDays,startOfWeek  } from 'date-fns';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../../Context/AuthContext';
import SwitchSelector from 'react-native-switch-selector';

const EditPlan = ({ navigation, route }) => {





    const { id ,po_ordousers_id_c} = route.params;
    const manager = route.params?.manager;
    console.log("tour plan id", id);

    const [dateText1, setDateText1] = useState('');
    const [dateText2, setDateText2] = useState('');
    const { token } = useContext(AuthContext);
    const [planData, setPlanData] = useState('');
    const [dataa, setData] = useState([]);

    const [dealerArray, setDealerArray] = useState([]);
  const [selectedDay1, setSelectedDay1] = useState(moment(new Date()).format('dddd'));
  const [selectedDay2, setSelectedDay2] = useState('Sunday');

    
    const [mSelected, setMSelected] = useState(false)
    const [wSelected, setWSelected] = useState(false)
    const [planName, setPlanName] = useState('');
    const [formattedDate, setFormattedDate] = useState('');
    const [originalStartDate, setOriginalStartDate] = useState(new Date());
    const [originalEndDate, setOriginalEndDate] = useState(new Date());
    const [loading, setLoading] = useState(false);

    const { userData } = useContext(AuthContext)


    const getPlanDetails1 = () => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${userData.token}`);

        var raw = "";

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch(`https://gsidev.ordosolution.com/api/tourplans/${id}/`, requestOptions)
      .then(response => response.json())
      .then(result => {
                console.log('plan details data 123 ', result)
            

                setOriginalStartDate(moment(result.start_date).format('YYYY-MM-DD'));
                setOriginalEndDate(moment(result.end_date).format('YYYY-MM-DD'))
                setSelectedDay1(moment(result.start_date).format('dddd'))
                // setDate(moment(result.status[0].start_date).format('YYYY-MM-DD'))
                setDate(new Date(result.start_date))
                // setEndDate(moment(result.status[0].end_date).format('YYYY-MM-DD'))
                setEndDate(new Date(result.end_date))
                // console.log("original start Date", new Date(originalStartDate))


                setDateText1(moment(result.start_date).format('DD/MM/YYYY'));
                setDateText2(moment(result.end_date).format('DD/MM/YYYY'));
                setPlanName(result.name)
                //setData(result?.status[0]);
                // console.log('gg', data);



                let sQuote = result?.name.replaceAll('&#039;', `'`)
                let dQuote = sQuote.replaceAll('&quot;', `"`)
                console.log("dhvdszkvsdbvk", planName,startDate,enddate)

                // setquote(dQuote);
                // console.log('region', region);


                //dealer array
                // result?.status[0].dealer_array.map(item => {
                //     console.log("item", item)
                // });
                // console.log("testttttt", result?.status[0].dealer_array);
                setDealerArray(result?.activity);
                // const days = Object.keys(dealerArray);

                //external visit
                // result?.status[0].external_visits_array.map(item => {
                //     console.log("external visit item", item)
                // });

                // if (Array.isArray(result?.status[0].external_visits_array) && result?.status[0].external_visits_array.length > 0) {
                //     console.log("setting")
                //     setExternalVisit(result?.status[0].external_visits_array)
                // }
            })


            .catch(error => console.log('api error', error));
    }

    // console.log("keyss",dealerArray)


    // const getPlanDetails = async () => {
    //     setLoading(true)
    //     var myHeaders = new Headers();
    //     myHeaders.append("Content-Type", "application/json");

    //     var raw = JSON.stringify({
    //         "__user_id__": token,
    //         "__id__": id
    //     });

    //     var requestOptions = {
    //         method: 'POST',
    //         headers: myHeaders,
    //         body: raw,
    //         redirect: 'follow'
    //     };

    //     await fetch("https://als.ordosolution.com/get_tour_plan_detail.php", requestOptions)
    //         .then(response => response.json())
    //         .then(result => {
    //             console.log('plan details data 123 ', result.status[0])
    //             setPlanData(result.status[0]);
    //             //setting tour plan
    //             if (result.status[0].type == "Monthly") {
    //                 setMSelected(true)
    //                 console.log("set M true")
    //             }
    //             else {
    //                 setWSelected(true)
    //                 console.log("set W true")
    //             }
    //             setOriginalStartDate(moment(result.status[0].start_date).format('YYYY-MM-DD'));
    //             setOriginalEndDate(moment(result.status[0].end_date).format('YYYY-MM-DD'))
    //             // setDate(moment(result.status[0].start_date).format('YYYY-MM-DD'))
    //             setDate(new Date(result.status[0].start_date))
    //             // setEndDate(moment(result.status[0].end_date).format('YYYY-MM-DD'))
    //             setEndDate(new Date(result.status[0].end_date))
    //             console.log("original start Date", new Date(originalStartDate))


    //             setDateText1(moment(result.status[0].start_date).format('DD/MM/YYYY'));
    //             setDateText2(moment(result.status[0].end_date).format('DD/MM/YYYY'));
    //             setPlanName(result.status[0].name)
    //             //setData(result?.status[0]);
    //             console.log('gg', data);
    //             // result?.status[0].dealer_array.forEach(item => {
    //             //     console.log("item", item)
    //             // });
    //             setDealerArray(result?.status[0].dealer_array)
    //             //getting accounts
    //             loadAcccounts(result?.status[0].dealer_array)
    //             setLoading(false)
    //         })
    //         .catch(error => console.log('api error', error));
    //     setLoading(false)

    // }


    useFocusEffect(
        React.useCallback(() => {
            getPlanDetails1();

        }, [])
    );

    
    // useEffect(() => {
    //     getPlanDetails();
    // }, [])

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
    // 
    const width = Dimensions.get('window').width

    const data = [
        { label: 'Product presentation', value: '1' },
        { label: 'Product training', value: '2' },
        { label: 'Sales pitch', value: '3' },
        { label: 'Negotiation', value: '4' },
        { label: 'Follow-up', value: '5' },
        { label: 'Market analysis', value: '6' },
        { label: 'Relationship building', value: '7' },
        { label: 'Inventory management', value: '8' },
    ];

    const [value, setValue] = useState(null);
    const [isFocus, setIsFocus] = useState(false);
    const [date, setDate] = useState(new Date())
    const [enddate, setEndDate] = useState(new Date())
    // const [isSelected, setSelection] = useState(false);
    const [accountsarray, setAccountsArray] = useState([]);

    const dealerChoosen = useRef(false);


    //radrio val hooks





    const loadAcccounts = async (dealer_array) => {
        console.log('ttt', dealer_array)
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "text/plain");

        var raw = JSON.stringify(
            {
                "__user_id__": po_ordousers_id_c
            }
        )

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("https://als.ordosolution.com/get_accounts_visit.php", requestOptions)
            .then(response => response.json())
            .then(async result => {

                console.log("resulttt",result)

                // for (var i = 0; i < result.length; i++) {
                //   result[i].checked = false;
                //   //result.entry_list[i].visitcount = ""
                // }


                let tempArray = await result.map((item) => {
                    console.log("item og", item)
                    if (item.visit > 0) {  //checking if visiit is zero
                        let wVisit = 1;  //default weekly visit value
                        //checking company visit is > 4
                        if (item?.visit > 4) {
                            wVisit = Math.floor(item?.visit / 4) //integer division
                        }
                        let checked = false;
                        //auto ticking  user selected dealer option

                        dealer_array.map((element) => {
                            console.log("eneterd")
                            if (item.id == element.account_id_c) {
                                console.log("selected account", item.id)
                                checked = true;
                            }
                        })
                        return {
                            ...item,
                            checked: checked,
                            monthlyVisit: item?.visit,
                            weeklyVisit: wVisit.toString()
                        }
                    }
                })
                setAccountsArray(tempArray);


                // console.log('tmp Array', tempArray)

            })
            .catch(error => console.log('error', error));
    }



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
    const [StopDate, setStopDate] = useState("")


    const handleDateChange = (value, index) => {
        if (index == 1) {
          const formattedDate = moment(value).format('DD/MM/YYYY');
          setDateText1(formattedDate);
          setSelectedDay1(moment(value).format('dddd'));
    
        } else if (index == 2) {
          const formattedDate = moment(value).format('DD/MM/YYYY');
          setDateText2(formattedDate);
        //   setSelectedDay2(moment(value).format('dddd'));
    
        }
      }
    const handleSwitchChange = (value) => {
        if (value === 'monthly') {
            setMSelected(true);
            setWSelected(false);
            const currentDate = new Date();
            const newDate = addDays(date, 30); // Add 30 days for monthly
            setDateText2(format(newDate, 'dd/MM/yyyy'));
            setEndDate(newDate);
        } else if (value === 'weekly') {
            setMSelected(false);
            setWSelected(true);
            const currentDate = new Date();
            const newDate = addDays(date, 7);
            setDateText2(format(newDate, 'dd/MM/yyyy'));
            setEndDate(newDate);
        }
    };


    const [open, setOpen] = useState(false)
    const [stopopen, setStopOpen] = useState(false)
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


// console.log("uuudhsdvbkshvdksv",dealerArray)

    const onPressContinue = () => {

        if (planName) {
          navigation.navigate('SelectCustomer', { planName: planName, startDate: date, endDate: enddate, type: mSelected ? 'Monthly' : "Weekly" ,name:'Edit',userId:po_ordousers_id_c,dealer_array:dealerArray,id:id,daysbtwn:daysArray})
        }
        else {
          Alert.alert('Warning', 'Please enter Plan name')
        }
    
    
      }

    const EditPlanPressed = () => {
        if (planName) {
            //console.log("dealer array",accountsarray)
            let dealerArray = []
            accountsarray.forEach((item) => {
                //push only if no of visit count > 0
                if (item?.visit > 0 && item?.checked) {
                    dealerChoosen.current = true;
                    dealerArray.push({
                        __account_id__: item?.id,
                        __no_of_visit__: mSelected ? item?.monthlyVisit : item?.weeklyVisit
                    })
                }
                console.log("id", item.id)
                console.log("count", item.visit)
            })
            console.log("final dealer array", dealerArray)
            if (dealerChoosen.current) {
                var myHeaders = new Headers();
                myHeaders.append("Content-Type", "text/plain");

                let type = mSelected ? 'Monthly' : 'Weekly';

                var raw = JSON.stringify({
                    "__name__": planName,
                    "__start_date__": moment(date).format('YYYY-MM-DD'),
                    "__end_date__": moment(enddate).format('YYYY-MM-DD'),
                    "__user_id__": token,
                    "__dealer_array__": dealerArray,
                    "__type__": type,
                    "__tourplan_id__": id


                });

                console.log(raw)
                var requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    body: raw,
                    redirect: 'follow'
                };

                console.log("cheeckkkkk", raw)

                // fetch("https://als.ordosolution.com/set_tour_plan.php", requestOptions)
                //     .then(response => response.json())
                //     .then(result => {
                //         console.log(result.status);




                //         Alert.alert('Edit Plan', 'Plan edited successfully', [
                //             { text: 'OK', onPress: () => navigation.goBack() }
                //         ])


                //     })
                //     .catch(error => console.log('error', error));

            }
            else {
                Alert.alert('Warning', 'Please choose atleast one customer or Enter no of visit value')
            }
        }
        else {
            Alert.alert('Warning', 'Please enter all the details')
        }



    }
    const [pressedIndex, setPressedIndex] = useState(null);

    const handlePress = (index) => {
        setPressedIndex(index);
    };

    const RenderItems = ({ item, index, isPressed, handlePress }) => (

        <View style={styles.flatliststyle}>
            <ScrollView>
                <TouchableOpacity style={{ backgroundColor: isPressed ? '#D5D5D5' : 'transparent' }}
                    onPress={() => {
                        handleCheckboxChange(index)
                        handlePress(index)
                    }}
                >

                    <View style={{ flexDirection: 'row', }}>
                        <View style={{ flex: 2.4,marginTop:5 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                {/* <Image source={{ uri: item?.account_profile_pic }} style={{ height: 20, width: 20, marginVertical: 5, marginLeft: 10 }} /> */}
                                {item?.account_profile_pic?(
                              <Image
                                  //source={require('../../assets/images/account.png')}
                                  source={{ uri: item?.account_profile_pic }}
                                  style={{ height: 30, width: 30, borderRadius: 30 / 2, resizeMode: 'contain', marginRight: 10,borderWidth: 1 , borderColor: 'gray', }}
                              /> ):(
                               <Image
                                  source={require('../../assets/images/doctor.jpg')}
                                  style={{ height: 30, width: 30, borderRadius: 30 / 2, resizeMode: 'contain', marginRight: 10,borderWidth: 1 , borderColor: 'gray', }}
                              />
                              )}
                                <View style={{ flex: 0.8, marginLeft: 14 }}>

                                    <Text style={{ fontFamily: 'AvenirNextCyr-Medium', fontSize: 12, color: '#000', flexWrap: 'wrap' }}>{item.name}</Text>
                                </View>
                            </View>
                        </View>
                        <TextInput
                            style={{ fontSize: 12, color: 'black', padding: 5, fontFamily: 'AvenirNextCyr-Medium', flex: 1, alignItems: 'flex-start', marginTop: 2 }}
                            value={mSelected ? item?.monthlyVisit : item?.weeklyVisit}
                            editable={false}
                            keyboardShouldPersistTaps='always'
                        />
                        {/* <Text style={{ fontFamily: 'AvenirNextCyr-Medium', fontSize: 12, color: '#000' }}>{item.frequencyNumber}</Text> */}

                        {/* </View> */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 0.5 }}>
                            <Pressable
                                style={{
                                    color: "#F5904B",
                                    width: 24,
                                    height: 24,
                                    borderRadius: 4,
                                    borderWidth: 2,
                                    borderColor: 'grey',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginRight: 8,
                                    // backgroundColor: item.checked ? 'white' : 'transparent',
                                }}
                                onPress={() => handleCheckboxChange(index)}
                            >
                                {item.checked && <Text style={{ color: '#F5904B', fontSize: 14, fontWeight: 'bold' }}>✓</Text>}
                            </Pressable>
                        </View>
                    </View>
                </TouchableOpacity>
            </ScrollView>
        </View>

    )

    const InputWithLabel = ({ title, value, onPress }) => {
        return (
            <View>
                <Text style={styles.labelText}>{title}</Text>
                <Pressable style={{ ...styles.inputContainer }} onPress={onPress} >
                    <Text style={styles.input2}>{value ? value : 'Select date'}</Text>
                    <Image style={{ width: 20, height: 20, marginRight: 15 }} source={require("../../assets/images/calendar.png")}></Image>
                </Pressable>
            </View>
        )

    }

    console.log("date text1",dateText1)

    useEffect(() => {

        // if (mSelected) {
        //   const newDate = addDays(date, 1); // Add 30 days for monthly
        //   setDateText2(format(newDate, 'dd/MM/yyyy'));
        //   setEndDate(newDate);
        // }
        // else {
          const startOfNextWeek = startOfWeek(date, { weekStartsOn: 1 }); // Sunday is the start of the week
          const nextSunday = addDays(startOfNextWeek, 6); // Adding 6 days to get to Sunday
          setDateText2(format(nextSunday, 'dd/MM/yyyy'));
          setEndDate(nextSunday);
          // setEndDate(format(newDate, 'dd/MM/yyyy'));
        // }
      }, [date])

      const generateDaysArray = (selectedDay1, selectedDay2) => {
        const daysArray = [];
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      
        const startDateIndex = daysOfWeek.indexOf(selectedDay1);
        const endDateIndex = daysOfWeek.indexOf(selectedDay2);
      
        if (startDateIndex === -1 || endDateIndex === -1) {
          // Handle invalid day names
          return [];
        }
      
        for (let i = startDateIndex; i !== endDateIndex; i = (i + 1) % 7) {
          daysArray.push(daysOfWeek[i].substring(0, 2).toUpperCase());
        }
        daysArray.push(daysOfWeek[endDateIndex].substring(0, 2).toUpperCase()); // Include the endDate as well
      
        return daysArray;
      };
    
      const daysArray = generateDaysArray(selectedDay1, selectedDay2);


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
                <Text style={styles.headerTitle}>Edit Plan</Text>
            </View>
            <View style={styles.cardContainer1}>
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
                <View style={{flexDirection:'row',alignItems:'flex-end',justifyContent:'space-between'}}>
          <View style={{flex:0.55}}>
        <InputWithLabel
        flex='0.5'
          title='Start Date'
          value={dateText1}
          onPress={() => setOpen(true)}
        />
        </View>
        <View style={{flex:0.4,alignItems:'center',borderWidth:1,borderColor:'grey',borderRadius:5,height:'52%',marginBottom:'1%',backgroundColor:'#f5f5f5'}}>
        <Text style={{marginTop:'5%',fontFamily:'AvenirNextCyr-Medium'}}>{selectedDay1}</Text>

        </View>

      </View>

    

<View style={{flexDirection:'row',alignItems:'flex-end',justifyContent:'space-between'}}>
          <View style={{flex:0.55}}>
        <InputWithLabel
        flex='0.5'
          title='End Date'
          value={dateText2}
          // onPress={() => setOpen(true)}
        />
        </View>
        <View style={{flex:0.4,alignItems:'center',borderWidth:1,borderColor:'grey',borderRadius:5,height:'52%',marginBottom:'1%',backgroundColor:'#f5f5f5'}}>
        <Text style={{marginTop:'5%',fontFamily:'AvenirNextCyr-Medium'}}>{selectedDay2}</Text>

        </View>

      </View>


                {/* <View style={{ marginTop: 20 }}>


                    {!loading && <SwitchSelector
                        initial={mSelected ? 1 : 0}
                        onPress={(value) => { handleSwitchChange(value) }}
                        textColor={Colors.primary} //'#7a44cf'  
                        selectedColor={"white"}
                        buttonColor={Colors.primary}
                        borderColor={Colors.primary}
                        hasPadding
                        options={[
                            { label: "Weekly", value: "weekly" },
                            //images.feminino = require('./path_to/assets/img/feminino.png')  
                            { label: "Monthly", value: "monthly" }
                            //images.masculino = require('./path_to/assets/img/masculino.png')
                        ]} />}

                </View> */}
            </View>
            <View style={styles.container}>






                {open == true ?

                    <DatePicker
                        modal
                        theme='light'
                        mode={'date'}
                        open={open}
                        date={new Date(originalStartDate)} // Set to current date
                        // format="YYYY-MM-DD"
                        // minimumDate={new Date()}
                        minimumDate={new Date(originalStartDate)} // Set minimum date to current date
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
                    /> : null}

                {stopopen == true ?
                    <DatePicker
                        modal
                        theme='light'
                        mode={'date'}
                        open={false}
                        date={new Date(originalEndDate)}
                        format="DD-MM-YYYY"
                        // minimumDate={date}   // Use startDate + 1 day if available, otherwise use current date
                        // maximumDate={new Date()}
                        onConfirm={(date) => {
                            const dateString = date.toLocaleDateString();
                            console.log("end", dateString);
                            setStopOpen(false);
                            setEndDate(date);
                            handleDateChange(date, 2);
                        }}
                        onCancel={() => {
                            setStopOpen(false);
                        }}
                    /> : null}
                {/* </View> */}

                {/* <View style={{ flex: 0.1 }}>
                    <Text style={{ paddingLeft: 0, fontWeight: '500', marginTop: 5, color: '#000', fontFamily: 'AvenirNextCyr-Medium', marginBottom: 4 }}>Choose your Customer from the list</Text>
                </View> */}
                {/* <ScrollView style={{ backgroundColor: '#FFFFFF', marginTop: 10 }}
          scrollEnabled={false}
        > */}
                {/* <View style={{ ...styles.cardContainer }}>
                    <View style={{ flexDirection: "row", height: 30, borderColor: Colors.primary, borderBottomWidth: 1, alignItems: 'center' }} >
                        <View style={{ flex: 0.5 }}>
                            <Text style={{ fontFamily: 'AvenirNextCyr-Medium', color: Colors.primary, fontSize: 12, textAlign: 'center' }}>Customer Name</Text>
                        </View>
                        <View style={{ flex: 0.5 }}>
                            <Text style={{ fontFamily: 'AvenirNextCyr-Medium', color: Colors.primary, fontSize: 12, paddingLeft: 32 }}>Freq.</Text>
                        </View>
                    </View>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={accountsarray}
                        extraData={true}
                        // style={{ height: 160 }}
                        renderItem={({ item, index }) => (
                            <RenderItems
                                item={item}
                                index={index}
                                isPressed={pressedIndex === index}
                                handlePress={handlePress}
                            />
                        )}
                    />
                </View> */}
                <View style={{ flex: 1, justifyContent: 'flex-end', marginBottom: 20 }}>
                <LinearGradient
                  colors={Colors.linearColors}
          start={Colors.start}
          end={Colors.end}
          locations={Colors.ButtonsLocation}
                style={{    borderRadius: 30}}
            >
                    <TouchableOpacity style={styles.button} onPress={onPressContinue} activeOpacity={0.8}>
                        <Text style={styles.btnText}>View Customers</Text>
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
        //backgroundColor:'red'
        flex: 0.1

    },
    headerTitle: {
        fontSize: 18,
        fontFamily: 'AvenirNextCyr-Medium',
        color: Colors.black,
        marginLeft: 10,
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
        color: Colors.black

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
        borderRadius: 8,
        // backgroundColor: Colors.primary,
    },
    btnText: {
        fontFamily: 'AvenirNextCyr-Medium',
        color: '#fff',
        fontSize: 16
    },
    cardContainer: {
        backgroundColor: 'white',
        borderRadius: 10,
        // borderWidth: 1,
        // borderColor: Colors.primary, // You can replace this with the desired border color
        padding: 10,
        // marginVertical: 10,
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
        // marginHorizontal:'3%',
        // borderColor: Colors.primary, // You can replace this with the desired border color
        padding: 12,
        // marginVertical: 15,
        // shadowColor: '#000',
        // shadowOffset: {
        //     width: 0,
        //     height: 2,
        // },
        // shadowOpacity: 0.25,
        // shadowRadius: 3.84,
        // elevation: 5,
        // flex: 0.5,
    },

});

export default EditPlan;