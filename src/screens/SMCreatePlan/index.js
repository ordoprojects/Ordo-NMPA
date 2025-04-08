import React, { useState, useEffect, useRef, useContext } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Dimensions, ScrollView, FlatList, Pressable, Alert , TouchableOpacity} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import DatePicker from 'react-native-date-picker'
import { Image } from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
// import FloatingLabelInput from './FloatingLabelInput';
import Colors from '../../constants/Colors';
import AntDesign from 'react-native-vector-icons/AntDesign';
// import { RadioButton } from 'react-native-paper';
import RadioButton from 'react-native-radio-button'
import moment from 'moment';
import { format, lastDayOfMonth, getDay, addDays } from 'date-fns';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../../Context/AuthContext';
import { Dropdown } from 'react-native-element-dropdown';

const SMCreatePlan = ({ navigation }) => {
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
    //yyyy-MM-dd
    // const [radioValue, setRadioValue] = useState('monthly');
    const [dateText1, setDateText1] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [dateText2, setDateText2] = useState(format(lastDayOfMonth(new Date()), 'yyyy-MM-dd'));
    const { token } = useContext(AuthContext);

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



    const [salesmanId, setSalesmanId] = useState(null);
    const [isFocus, setIsFocus] = useState(false);
    const [date, setDate] = useState(new Date())
    const [enddate, setEndDate] = useState(new Date())
    // const [isSelected, setSelection] = useState(false);
    const [accountsarray, setAccountsArray] = useState([]);
    const [planName, setPlanName] = useState('');
    const dealerChoosen = useRef(false);


    //radrio val hooks 
    const [mSelected, setMSelected] = useState(true)
    const [wSelected, setWSelected] = useState(false)
    const [selfSelected, setSelfSelected] = useState(true)
    const [smSelected, setSMSelected] = useState(false)
    const renderItem = item => {
        return (
            <View style={styles.item}>
                <Text style={styles.textItem}>{item.label}</Text>
                {item.value === value && (
                    <AntDesign
                        style={styles.icon}
                        color="black"
                        name="Safety"
                        size={20}
                    />
                )}
            </View>
        );
    };

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

    const [salesmanList, setSalesmanList] = useState([]);

    const getSalesManList = async () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "__user_id__": token
        });


        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("https://dev.ordo.primesophic.com/get_sales_man_for_manager.php", requestOptions)
            .then(response => response.json())
            .then(async result => {
                console.log('sales man list', result);
                if (result.length > 0) {
                    let tmpArray = await result.map((item) => {
                        return {
                            label: item?.name,
                            value: item?.id
                        }

                    })
                    console.log("sales man list", tmpArray)
                    setSalesmanList(tmpArray);
                }

            })
            .catch(error => console.log('api error', error));
    }




    useEffect(() => {

        const loadAcccounts = async () => {
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "text/plain");

            var raw = JSON.stringify(
                {
                    "__user_id__": token
                }
            )

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            fetch("https://dev.ordo.primesophic.com/get_accounts_for_dealer.php", requestOptions)
                .then(response => response.json())
                .then(async result => {

                    // for (var i = 0; i < result.length; i++) {
                    //   result[i].checked = false;
                    //   //result.entry_list[i].visitcount = ""
                    // }


                    let tempArray = await result.map((item) => {
                        if (item.visit > 0) {  //checking if visiit is zero
                            let wVisit = 1;  //default weekly visit value
                            //checking company visit is > 4
                            if (item?.visit > 4) {
                                wVisit = Math.floor(item?.visit / 4) //integer division
                            }
                            return {
                                ...item,
                                checked: false,
                                monthlyVisit: item?.visit,
                                weeklyVisit: wVisit.toString()
                            }
                        }
                    })
                    setAccountsArray(tempArray);
                    console.log('tmp Array', tempArray)

        //   Visit value if it's null
                    // let tempArray = await result.map((item) => {
                    //     if (item.visit !== null && item.visit > 0) {
                    //       // ... calculate wVisit and return
                    //     }
                    //     // Handle the case where item.visit is null or not greater than 0
                    //     return {
                    //       ...item,
                    //       // Set default values or other properties as needed
                    //     };
                    //   });
                      
                    //   setAccountsArray(tempArray);
                    //   console.log('tmp Array', tempArray);

                })
                .catch(error => console.log('error', error));
        }
        loadAcccounts();
        getSalesManList();
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
        myarray[index].check = !accountsarray[index].check;
        setAccountsArray(myarray);

    }
    const [startDate, setStartDate] = useState("")
    const [StopDate, setStopDate] = useState("")
    const handleDateChange = (value, index) => {
        if (index == 1)
            setStartDate(value);
        else
            setStopDate(value)
    }

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
    // const renderLabel = () => {
    //     if (value || isFocus) {
    //         return (
    //             <Text style={[styles.label, isFocus && { color: 'blue' }]}>
    //                 Purpose of Visit
    //             </Text>
    //         );
    //     }
    //     return null;
    // }

    const createPlanPressed = () => {
        if (planName) {
            //console.log("dealer array",accountsarray)
            let dealerArray = []
            accountsarray.forEach((item) => {
                //push only if no of visit count > 0 
                if (item?.visit > 0 && item?.check) {
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
                    "__start_date__": dateText1,
                    "__end_date__": dateText2,
                    "__user_id__": selfSelected ? token : salesmanId,
                    "__dealer_array__": dealerArray,
                    "__type__": type,
                    "__manager_id__": token
                });
                var requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    body: raw,
                    redirect: 'follow'
                };

                fetch("https://dev.ordo.primesophic.com/set_tour_plan.php", requestOptions)
                    .then(response => response.json())
                    .then(result => {
                        console.log(result.status);
                        if (result.status == '203') {
                            Alert.alert('Warning', 'Plan name already exists', [
                                { text: 'OK', onPress: () => { } }

                            ])
                        }
                        else {
                            Alert.alert('Create plan', 'Plan created successfully', [
                                { text: 'OK', onPress: () => navigation.goBack() }
                            ])
                        }
                    })
                    .catch(error => console.log('error', error));

            }
            else {
                Alert.alert('Warning', 'Please choose atleast one dealer or Enter no of visit value')
            }
        }
        else {
            Alert.alert('Warning', 'Please enter all the details')
        }

    }

    //checking user has active plan or not
    const checkActivePlanExist = () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "text/plain");


        var raw = JSON.stringify({
            "__start_date__": dateText1,
            "__end_date__": dateText2,
            "__user_id__": selfSelected ? token : salesmanId,
        });
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("https://dev.ordo.primesophic.com/get_check_plan_already.php", requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log(result);
                if (result?.is_already) {
                    //user have active plan
                    Alert.alert('Plan Exists', 'User already have an active plan', [
                        { text: 'OK', onPress: () => navigation.goBack() },
                    ]);
                }
                else {
                    //user dont have active plan
                    createPlanPressed();

                }

            })
            .catch(error => console.log('error', error));

    }
    const RenderItems = ({ item, index }) => (

        <View style={styles.flatliststyle}>

            <View style={{ flexDirection: "row", width: width - 10, alignSelf: 'center', height: 30, width: width, paddingLeft: 10, }} >
                {/* <Image style={{ width: 20, height: 20, marginTop: 5 }} source={{ uri: `https://dev.ordo.primesophic.com/upload/${item?.id}_img_src_c` }}></Image> */}
        <Image style={{ width: 20, height: 20, marginTop: 5 }}  source={require('../../assets/images/account.png')}/>

                <Text style={{ paddingLeft: 10, color: '#000', borderBottomColor: '#7A7F85', justifyContent: 'center', textAlign: 'left', fontSize: 12, height: 30, textAlignVertical: 'center', width: (width - 10) / 2, alignSelf: 'center', marginTop: 10, fontFamily: 'AvenirNextCyr-Medium' }}>{item?.name}</Text>

                <TextInput
                    style={{ fontSize: 12, width: 50, color: 'black', padding: 5, fontFamily: 'AvenirNextCyr-Thin' }}
                    value={mSelected ? item?.monthlyVisit : item?.weeklyVisit}
                    editable={false}
                />
                <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
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
                            backgroundColor: item.check ? 'white' : 'transparent',
                        }}
                        onPress={() => handleCheckboxChange(index)}
                    >
                        {item.check && <Text style={{ color: '#F5904B', fontSize: 14, fontWeight: 'bold' }}>✓</Text>}
                    </Pressable>
                </View>
            </View>

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

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>

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
            </View>

            <View style={{ paddingHorizontal: 16 }}>
                <View style={{ flexDirection: 'row' }}>
                    {/* <RadioButton.Group
            onValueChange={handleRadioButtonChange}
            value={radioValue}
          >
            <View style={{flexDirection:'row'}}>
              <RadioButton.Item label="Monthly" value="monthly" />
              <RadioButton.Item label="Weekly" value="weekly" />
            </View>
          </RadioButton.Group> */}
                    <View style={{ flexDirection: 'row', }}>
                        <RadioButton
                            animation={'bounceIn'}
                            isSelected={selfSelected}
                            size={14}
                            innerColor={Colors.primary}
                            outerColor={Colors.primary}
                            onPress={() => {
                                setSelfSelected(true)
                                setSMSelected(false)
                                // setDateText2(format(lastDayOfMonth(new Date()), 'yyyy-MM-dd'));
                            }}
                        />
                        <Text style={{ ...styles.labelText, marginLeft: 5, fontSize: 14 }}>Myself</Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginLeft: 10 }}>
                        <RadioButton
                            animation={'bounceIn'}
                            size={14}
                            isSelected={smSelected}
                            innerColor={Colors.primary}
                            outerColor={Colors.primary}
                            onPress={() => {
                                setSelfSelected(false)
                                setSMSelected(true)
                                // const currentDate = new Date();
                                // let fridayDate = currentDate;

                                // while (getDay(fridayDate) !== 5) {
                                //   fridayDate = addDays(fridayDate, 1);
                                // }

                                // setDateText2(format(fridayDate, 'yyyy-MM-dd'));
                            }}
                        />
                        <Text style={{ ...styles.labelText, marginLeft: 5, fontSize: 14 }}>Sales Man</Text>
                    </View>
                </View>
                {smSelected && salesmanList.length > 0 && <View style={styles.dropDownContainer}>
                    <Dropdown
                        style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
                        placeholderStyle={styles.placeholderStyle}
                        itemTextStyle={styles.selectedTextStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        iconStyle={styles.iconStyle}
                        data={salesmanList}
                        labelField="label"
                        valueField="value"
                        //search
                        maxHeight={400}
                        placeholder={!isFocus ? 'Select item' : '...'}
                        //searchPlaceholder="Search..."
                        value={salesmanId}
                        onFocus={() => setIsFocus(true)}
                        onBlur={() => setIsFocus(false)}
                        onChange={item => {
                            setSalesmanId(item.value);
                            console.log("selected sales man id", item.value)
                            setIsFocus(false);
                        }}
                    // renderLeftIcon={() => (
                    //   <AntDesign
                    //     style={styles.icon}
                    //     color={isFocus ? 'blue' : 'black'}
                    //     name="Safety"
                    //     size={20}
                    //   />
                    // )}
                    />
                </View>}
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

                <View>
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
                </View>

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
                    <View style={{ flexDirection: 'row', }}>
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
                    </View>
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
                {open == true ?
                    <DatePicker
                        modal
                        mode={'date'}
                        open={open}
                        date={date}
                        format="yyyy-MM-dd"
                        minDate="2022-01-01"
                        maxDate="2200-12-31"
                        onConfirm={(date) => {
                            const dateString = date.toLocaleDateString();
                            console.log(dateString);
                            setOpen(false)
                            setDate(date)
                            handleDateChange(dateString, 1)
                        }}
                        onCancel={() => {
                            setOpen(false)
                        }}
                    /> : null}
                {/* </View>
        <View style={styles.inputView}>
          <Text style={{ width: width - 50, flex: 0.9 }}>{StopDate}</Text>
          <TouchableOpacity onPress={() => setStopOpen(true)}><Image style={{ width: 20, height: 20 }} source={require("../../assets/images/calendar.png")}></Image></TouchableOpacity> */}
                {stopopen == true ?
                    <DatePicker
                        modal
                        mode={'date'}
                        open={stopopen}
                        date={enddate}
                        format="yyyy-MM-dd"
                        minDate="2022-01-01"
                        maxDate="2200-12-31"
                        onConfirm={(date) => {
                            const dateString = date.toLocaleDateString();
                            console.log(dateString);
                            setStopOpen(false)
                            setEndDate(date)
                            handleDateChange(dateString, 2)
                        }}
                        onCancel={() => {
                            setStopOpen(false)
                        }}
                    /> : null}
                {/* </View> */}

                <Text style={{ paddingLeft: 0, fontWeight: '500', marginTop: 10, color: '#000', fontFamily: 'AvenirNextCyr-Medium' }}>Choose your dealer from the list</Text>
                {/* <ScrollView style={{ backgroundColor: '#FFFFFF', marginTop: 10 }}
          scrollEnabled={false}
        > */}
                <View style={{ width: width }}>
                    <View style={{ flexDirection: "row", backgroundColor: '#F1F2F1', height: 30, borderColor: 'grey', borderBottomWidth: 1, width: width - 20, alignItems: 'center' }} >
                        <View style={{ flex: 0.5 }}>
                            <Text style={{ fontFamily: 'AvenirNextCyr-Medium', color: '#000', fontSize: 12, textAlign: 'center' }}>Dealer Name</Text>
                        </View>
                        <View style={{ flex: 0.5 }}>
                            <Text style={{ fontFamily: 'AvenirNextCyr-Medium', color: '#000', fontSize: 12, paddingLeft: 10 }}>Freq of Visit</Text>
                        </View>
                    </View>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={accountsarray}
                        extraData={true}
                        style={{ height: 150, }}
                        renderItem={RenderItems}

                    />
                </View>
                <View style={{ flex: 1, justifyContent: 'flex-end', marginBottom: 20 }}>
                    <TouchableOpacity style={styles.button} onPress={checkActivePlanExist} activeOpacity={0.8}>
                        <Text style={styles.btnText}>Create Plan</Text>
                    </TouchableOpacity>
                </View>



            </View>

        </View>
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
        marginTop: 5,

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
        fontFamily: 'AvenirNextCyr-Thin'
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
        fontSize: 14,
        fontFamily: 'AvenirNextCyr-Thin'

    },
    selectedTextStyle: {
        fontSize: 14,
        fontFamily: 'AvenirNextCyr-Thin'
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
        fontFamily: 'AvenirNextCyr-Thin',
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
        fontFamily: 'AvenirNextCyr-Thin'
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
        fontFamily: 'AvenirNextCyr-Thin'
    },
    button: {
        height: 50,
        //marginTop: 20,
        // backgroundColor:'red',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        backgroundColor: Colors.primary,
    },
    btnText: {
        fontFamily: 'AvenirNextCyr-Medium',
        color: '#fff',
        fontSize: 16
    },
    // dropDownContainer: {
    //     backgroundColor: 'white',
    //     marginBottom: 10,
    //     //padding: 16,
    //     //backgroundColor:'red'
    //   },

});

export default SMCreatePlan;
