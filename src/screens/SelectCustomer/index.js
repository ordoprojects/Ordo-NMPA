import React, { useState, useEffect, useRef, useContext, PureComponent } from 'react';
import { View,BackHandler, TextInput, Button, Text, StyleSheet, Dimensions, ScrollView, FlatList, Pressable, Alert, Modal, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import globalStyles from '../../styles/globalStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import DatePicker from 'react-native-date-picker'
// import { Image } from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import Colors from '../../constants/Colors';
import linearColors from '../../constants/Colors';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
// import { RadioButton } from 'react-native-paper';
import moment, { unix } from 'moment';
import { format, lastDayOfMonth, getDay, addDays } from 'date-fns';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../../Context/AuthContext';
import SwitchSelector from 'react-native-switch-selector';
import { Searchbar, Checkbox, RadioButton} from 'react-native-paper';
import { Dropdown } from 'react-native-element-dropdown';
import { List, Switch } from 'react-native-paper';
import { MultiSelect } from 'react-native-element-dropdown';
import { v4 as uuidv4 } from 'uuid';
import { customAnimatedText } from 'react-native-paper/lib/typescript/components/Typography/AnimatedText';

const data = [
  { label: 'ABM', value: '62524ae1-a280-e0fa-7f38-6524fe034a64' },
  { label: 'RBM', value: '2bb36b96-2bcb-3c52-2ee1-64a54b69ddcf' },


];


const SelectCustomer = ({ navigation, route }) => {

  const [selected, setSelected] = useState([]);
  const { planName, startDate, endDate, type, name, userId, dealer_array, id, daysbtwn, collaborated } = route.params;

  // console.log("days",daysbtwn)

  const { token, userData } = useContext(AuthContext);

  const [searchQuery, setSearchQuery] = React.useState('');
  const [masterData, setMasterData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = React.useState(false);
  const [expandedDay, setExpandedDay] = useState(null);
  const [selectedCustomers, setSelectedCustomers] = useState({
    'MO': [],
    'TU': [],
    'WE': [],
    'TH': [],
    'FR': [],
    'SA': [],
    'SU': [],

  });
  const [selectedDay, setSelectedDay] = useState(null);

  const [selectAll, setSelectAll] = useState(false);
  const [expanded, setExpanded] = React.useState(true);

  const handleclicked = () => setExpanded(!expanded);
  // const [isModalVisible, setIsModalVisible] = useState(false);

  const [selectedRegion, setSelectedRegion] = useState(null);
  const [isFocus3, setIsFocus3] = useState(false);


  const onChangeSearch = query => setSearchQuery(query);
  const [modalVisible, setModalVisible] = useState(false);
  const [availableColabs, setAvailableColabs] = useState([]);
  const [collaborateModal, setCollaborateModal] = useState(false);
  const [selectedCollaborators, setSelectedCollaborators] = useState({});
  const [uniqueId, setUniqueId] = useState("");
  const [isSwitchOn, setIsSwitchOn] = React.useState(false);

  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);

  useEffect(() => {
    const uniqueID = uuidv4();
    setUniqueId(uniqueID);
    console.log('Generated Unique ID:', uniqueID);
  }, []);

  useEffect(() => {
  const backHandler = BackHandler.addEventListener(
    'hardwareBackPress',
    () => {
    Alert.alert(
      'Confirm',
      'Are you sure you want to go back? Please note that data will be lost if you proceed.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK', onPress: () => navigation.goBack() },
      ],
      { cancelable: false }
    );
    // Returning true prevents default behavior (i.e., navigating back)
    return true;
  }
  );

  // Clean up event listener when component unmounts
  return () => backHandler.remove();
}, []);
  // useEffect(() => {
  //   var myHeaders = new Headers();
  //   myHeaders.append("Content-Type", "application/json");

  //   var raw = JSON.stringify({
  //     "__user_id__": token
  //   });

  //   var requestOptions = {
  //     method: 'POST',
  //     headers: myHeaders,
  //     body: raw,
  //     redirect: 'follow'
  //   };

  //   fetch("https://gsidev.ordosolution.com/get_my_collabrators.php", requestOptions)
  //     .then(response => response.json())
  //     .then(async result => {


  //       // Modify the response here to change 'id' to 'value' and 'name' to 'label'
  //       const modifiedResult = result.map(({ id, name, type }) => ({ value: id, label: name, type }));

  //       setAvailableColabs(modifiedResult);
  //     })
  //     .catch(error => {
  //       setLoading(false);
  //       console.log('error in api get_accounts_visit', error);
  //     });
  // }, []);



  const handleCollaboratorsChange = (day, collaborators) => {
    console.log(collaborators)
    setSelectedCollaborators({
      ...selectedCollaborators,
      [day]: collaborators.map((item) => item),
    });
  };

  useEffect(() => {
    console.log("testtt", selectedCollaborators)
  }, [selectedCollaborators])




  //   const dealer_array={
  //   MO: [
  //         {
  //             "__account_id__": "8c8e82ed-5233-0645-1393-6561c904b69a",
  //             "__no_of_visit__": "1",
  //             "__status__": "Pending",
  //             "account_id_c": "8c8e82ed-5233-0645-1393-6561c904b69a",
  //             "name": "DR ABHINAV DAVID",
  //             "city": "ANPURNA HOSPITAL MEERUT CANTT",
  //             "region": "MEERUT",
  //             "status": "Pending",
  //             "no_of_visit": "1",
  //             "account_profile_pic": "https://gsidev.ordosolution.com/index.php?preview=yes&entryPoint=downloadquote&id=8c8e82ed-5233-0645-1393-6561c904b69a_img_src_c&type=Accounts"
  //         },
  //         {
  //             "__account_id__": "487781ea-aaf9-da84-b44b-656034d8bf5a",
  //             "__no_of_visit__": "1",
  //             "__status__": "Pending",
  //             "account_id_c": "487781ea-aaf9-da84-b44b-656034d8bf5a",
  //             "name": "AMIT PHARMA (AMRITSAR)",
  //             "city": "S.NO , 107 KATRA SHER SINGH AMIRITSAR PUNJAB",
  //             "region": "AMRITSAR",
  //             "status": "Pending",
  //             "no_of_visit": "1",
  //             "account_profile_pic": "https://gsidev.ordosolution.com/index.php?preview=yes&entryPoint=downloadquote&id=487781ea-aaf9-da84-b44b-656034d8bf5a_img_src_c&type=Accounts"
  //         }
  //     ],
  //     TU: [
  //         {
  //             "__account_id__": "4456439f-59fc-b67c-a4dc-655f4b4dbd4f",
  //             "__no_of_visit__": "1",
  //             "__status__": "Pending",
  //             "account_id_c": "4456439f-59fc-b67c-a4dc-655f4b4dbd4f",
  //             "name": "AMARJEET MEDICAL HALL",
  //             "city": "C-109,SECTOR-10, NOIDA,GAUTAM BUDDHA NAGAR",
  //             "region": "noida",
  //             "status": "Pending",
  //             "no_of_visit": "1",
  //             "account_profile_pic": "https://gsidev.ordosolution.com/index.php?preview=yes&entryPoint=downloadquote&id=4456439f-59fc-b67c-a4dc-655f4b4dbd4f_img_src_c&type=Accounts"
  //         },
  //         {
  //             "__account_id__": "3780cdbe-472b-fa95-a8d0-65439aca4bf2",
  //             "__no_of_visit__": "1",
  //             "__status__": "Pending",
  //             "account_id_c": "3780cdbe-472b-fa95-a8d0-65439aca4bf2",
  //             "name": "Dr Abhiraj Thakur",
  //             "city": "15 A Near Bank of Baroda Block",
  //             "region": "EAST DELHI",
  //             "status": "Pending",
  //             "no_of_visit": "1",
  //             "account_profile_pic": "https://gsidev.ordosolution.com/index.php?preview=yes&entryPoint=downloadquote&id=3780cdbe-472b-fa95-a8d0-65439aca4bf2_img_src_c&type=Accounts"
  //         }
  //     ],
  //     WE: [],
  //     TH: [],
  //     FR: [],
  //     SA: [],
  //     SU: []
  // }
  const getDayAbbreviation = (dayNumber) => {
    const daysAbbreviations = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];

    // Ensure dayNumber is within valid range (1 to 7)
    const normalizedDayNumber = (dayNumber % 7 + 7) % 7;

    return daysAbbreviations[normalizedDayNumber];
  };

  // Your existing useEffect code
  useEffect(() => {
    if (name === "Edit" && dealer_array) {
      // Iterate over the days (1, 2, 3, etc.)
      Object.keys(dealer_array).forEach((day) => {
        const dayAbbreviation = getDayAbbreviation(parseInt(day, 10));

        // Check if dealerArray has customers for the current day
        if (dealer_array[day] && dealer_array[day].length > 0) {
          // Extract relevant details and update the selectedCustomers state
          const selectedCustomersDetails = dealer_array[day].map((item) => ({
            id: item.account_id,
            name: item.name,
            weeklyVisit: item.weeklyVisit,
            monthlyVisit: item.__no_of_visit__, // Adjust this according to your data structure
          }));

          setSelectedCustomers((prevSelectedCustomers) => ({
            ...prevSelectedCustomers,
            [dayAbbreviation]: selectedCustomersDetails,
          }));
        }
      });
    }
  }, [name, dealer_array]);





  const EditPlanPressed = () => {
    if (planName) {
      console.log("dealer array", selectedCustomers);

      const dealerArray = Object.keys(selectedCustomers).map((day, index) => ({
        [index + 1]: selectedCustomers[day]?.map((item) => ({
          "account_id": item.id,
          "no_of_visit": item.weeklyVisit || 1,
          "status": 'Pending',
          "name": item.name,
        })) || [],
      }));

      console.log("final dealer array", dealerArray);

      var myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${userData.token}`);
      myHeaders.append("Content-Type", "application/json");
      
      var raw = JSON.stringify({
        "name": planName,
        "start_date": moment(startDate).format('YYYY-MM-DD'),
        "end_date": moment(endDate).format('YYYY-MM-DD'),
        "user": userData.id,
        "status": "Pending",
        "activity": Object.assign({}, ...dealerArray),
        "type": "Weekly",
      });

      var requestOptions = {
        method: 'PATCH',
        headers: myHeaders,
        body: raw,
        redirect: 'follow',
      };

      console.log("rawwwwww", raw, id);

      fetch(`https://gsidev.ordosolution.com/api/tourplans/${id}/`, requestOptions)
        .then(response => response.json())
        .then(result => {
          console.log(result)
          console.log("Edit detail", result.data.id);
          if (result.data.id) {
            Alert.alert('Edit Plan', 'Edited Plan successfully', [
              { text: 'OK', onPress: () => navigation.navigate('Visits') }
            ]);
          }
        })
        .catch(error => console.log('error', error));

    } else {
      Alert.alert('Warning', 'Please enter all the details');
    }
  };


  const createActivityArray = (selectedCustomers) => {
    const activity = [];

    // Map days to their respective indices
    const daysMap = { "MO": 1, "TU": 2, "WE": 3, "TH": 4, "FR": 5, "SA": 6, "SU": 7, };

    // Iterate through each day and selected customer
    Object.keys(selectedCustomers).forEach(day => {
      // console.log("day",day)
      const dayIndex = daysMap[day];
      // console.log("dfvf", dayIndex)

      selectedCustomers[day].forEach(customer => {
        const entry = {
          "account_id": customer.id,
          "no_of_visit": customer.weeklyVisit || 1,
          "status": "Pending",
          "day": dayIndex   // Adding 1 to make Monday as 1, Tuesday as 2, and so on
        };

        activity.push(entry);
      });
    });

    return activity;
  };



  const createPlanPressed = () => {

    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${userData.token}`);
    myHeaders.append("Content-Type", "application/json");
    // myHeaders.append("Cookie", "csrftoken=RK01uE9J0xQQMWCjMG7ZfcSnMMQJI9Yl");

    const activityArray = createActivityArray(selectedCustomers);
    console.log("required format", activityArray);


    var raw = JSON.stringify({
      "name": planName,
      "start_date": moment(startDate).format('YYYY-MM-DD'),
      "end_date": moment(endDate).format('YYYY-MM-DD'),
      "user": userData.id,
      "status": "Pending",
      "activity": activityArray,
      "type": "Weekly"
    });

    console.log("rawwwww", raw)

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("https://gsidev.ordosolution.com/api/tourplans/", requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result)
        console.log("tour detail", result.data.id);
        if (result.data.id) {
          Alert.alert('Create Plan', 'Plan created successfully', [
            { text: 'OK', onPress: () => navigation.navigate('Visits') }
          ]);
        }
      })
      .catch(error => console.log('error', error));
  }


  // const createPlanPressed = () => {
  //   if (planName && Object.keys(selectedCustomers).some((key) => selectedCustomers[key]?.length > 0)) {
  //     let dealerArray = { "__dealer_array__": {} };
  //     // console.log("check", Object.keys(selectedCustomers).length > 0)
  //     // Loop through each day (MO, TU, WE, etc.)
  //     days.forEach((day) => {
  //       const dayAbbreviation = day.abbreviation;

  //       // Check if customers are selected for the current day
  //       if (selectedCustomers[dayAbbreviation] && selectedCustomers[dayAbbreviation].length > 0) {
  //         // Create a copy of the selected customers for the current day
  //         const customersForDay = selectedCustomers[dayAbbreviation].map((item) => ({
  //           "__account_id__": item?.id,
  //           "__no_of_visit__": item?.weeklyVisit,
  //           "__status__": 'Pending',
  //           // Change the keys as needed
  //           // Example: "__custom_id__": item?.id,
  //           // "__custom_nae__": item?.name,
  //         }));

  //         // Add the array to dealerArray for the current day
  //         dealerArray["__dealer_array__"][dayAbbreviation] = customersForDay;
  //       } else {
  //         // If no customers are selected for the current day, add an empty array
  //         dealerArray["__dealer_array__"][dayAbbreviation] = [];
  //       }
  //     });

  //     var myHeaders = new Headers();
  //     myHeaders.append("Content-Type", "text/plain");

  //     var raw = JSON.stringify({
  //       "__name__": planName,
  //       "__start_date__": moment(startDate).format('YYYY-MM-DD'),
  //       "__end_date__": moment(endDate).format('YYYY-MM-DD'),
  //       "__collaborated__": collaborated === "yes" ? 1 : 0,
  //       "__user_id__": token,
  //       ...dealerArray,
  //       "__type__": "Weekly",
  //       "__collaborate_id__":uniqueId
  //     });

  //     console.log("raww check",raw)

  //     var requestOptions = {
  //       method: 'POST',
  //       headers: myHeaders,
  //       body: raw,
  //       redirect: 'follow',
  //     };

  //     console.log("rawwww", raw)

  //     fetch("https://gsidev.ordosolution.com/create_tour_plan.php", requestOptions)
  //       .then(response => response.json())
  //       .then(result => {
  //         console.log("tour detail", result);
  //         if (result.status == '203') {
  //           Alert.alert('Warning', 'Plan name already exists', [
  //             { text: 'OK', onPress: () => { } }
  //           ]);
  //         } else {
  //           if (collaborated === "yes") {

  //             createPlanForCollaborators();

  //           }
  //           else {
  //             Alert.alert('Create Plan', 'Plan created successfully', [
  //               { text: 'OK', onPress: () => navigation.navigate('Visits') }
  //             ]);
  //           }
  //           //----------------------------------------------------------------
  //         }
  //       })
  //       .catch(error => console.log('error', error));
  //   } 
  //   else {
  //     Alert.alert('Warning', 'Please select one or more customers');
  //   }
  // };





  function transformCollaborators(selectedCollaborators) {
    let transformedArray = [];

    // Iterate through the days
    Object.keys(selectedCollaborators).forEach((dayKey) => {
      // Iterate through the collaborators for the current day
      selectedCollaborators[dayKey].forEach((collaborator) => {
        // Check if there's an entry for the collaborator in the transformed array
        const collaboratorEntry = transformedArray.find(entry => entry[collaborator]);

        if (collaboratorEntry) {
          // If an entry for the collaborator exists, add the day to the existing array
          collaboratorEntry[collaborator].push(dayKey);
        } else {
          // If no entry for the collaborator exists, create a new entry with the day
          transformedArray.push({ [collaborator]: [dayKey] });
        }
      });
    });

    return transformedArray;
  }

  const createPlanForCollaborators = () => {

    const transformedCollaborators = transformCollaborators(selectedCollaborators)
    // console.log(transformedCollaborators)

    transformedCollaborators.forEach((collaboratorEntry) => {
      let CollaboratorsDealerArray = { "__dealer_array__": {} };
      const userId = Object.keys(collaboratorEntry)[0];

      // Get the associated array of days (value)
      const daysArray = collaboratorEntry[userId];
      daysArray.forEach((day) => {
        // Check if customers are selected for the current day
        if (selectedCustomers[day] && selectedCustomers[day].length > 0) {
          // Create a copy of the selected customers for the current day
          const customersForDay = selectedCustomers[day].map((item) => ({
            "__account_id__": item?.id,
            "__no_of_visit__": item?.weeklyVisit,
            "__status__": 'Pending',

          }));

          // Add the array to dealerArray for the current day
          CollaboratorsDealerArray["__dealer_array__"][day] = customersForDay;
        } else {
          // If no customers are selected for the current day, add an empty array
          CollaboratorsDealerArray["__dealer_array__"][day] = [];
        }
      });


      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "text/plain");

      var raw = JSON.stringify({
        "__name__": planName,
        "__start_date__": moment(startDate).format('YYYY-MM-DD'),
        "__end_date__": moment(endDate).format('YYYY-MM-DD'),
        "__user_id__": userId,
        ...CollaboratorsDealerArray,
        "__type__": "Weekly",
        "__collaborate_id__": uniqueId
      });

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow',
      };

      console.log("rawwww", raw)

      // fetch("https://gsidev.ordosolution.com/create_tour_plan.php", requestOptions)
      //   .then(response => response.json())
      //   .then(result => {
      //     console.log("tour detail", result);
      //     if (result.status == '203') {
      //       Alert.alert('Warning', 'Plan name already exists', [
      //         { text: 'OK', onPress: () => { } }
      //       ]);
      //     } else {
      //       Alert.alert('Create Plan', 'Plan created successfully', [
      //         { text: 'OK', onPress: () => navigation.navigate('Visits') }
      //       ]);
      //     }
      //   })
        // .catch(error => console.log('error', error));



    });
  }

  const handlePress = (day) => {
    setModalVisible(true);
    setSelectedDay(day);
    console.log("clicked for day:", day);
  };


  const handleClose = () => {
    setModalVisible(false);
    console.log("clicked to close")
  };



  useEffect(() => {
    //getting active dealer list for the particular user
    console.log("Plan Name:", planName);
    console.log("Start Date:", startDate);
    console.log("End Date:", endDate);
    console.log("Type:", type);
  }, []);



  useEffect(() => {
    //getting active dealer list for the particular user
    getActiveDealerList();
  }, [])

  const getActiveDealerList = async () => {
    setLoading(true)
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${userData.token}`);
    // myHeaders.append("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJ1c2VybmFtZSI6ImV4YW1wbGVfdXNlciIsImV4cCI6MTcwNjI0ODEwM30.FUADZMlEwssOLlZSAB17Q34wcFXYTQQBbCr37_sky-c");
    // myHeaders.append("Cookie", "csrftoken=RK01uE9J0xQQMWCjMG7ZfcSnMMQJI9Yl");
    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch("https://gsidev.ordosolution.com/api/assigned-customers/", requestOptions)
      .then(response => response.json())
      .then(async result => {
        console.log('active dealer api  res', result);


        // let tempArray = await result.map((item) => {
        //   // setAccountsArray1(item);
        //   if (item.visit > 0) {  //checking if visiit is zero
        //     let wVisit = 1;  //default weekly visit value
        //     //checking company visit is > 4
        //     if (item?.visit > 4) {
        //       wVisit = Math.floor(item?.visit / 4) //integer division
        //     }
        //     return {
        //       ...item,
        //       // checked: false,
        //       monthlyVisit: item?.visit,
        //       weeklyVisit: wVisit.toString()
        //     }
        //   }
        // })
        setMasterData(result)
        setFilteredData(result);
        setLoading(false);

      })
      .catch(error => {
        setLoading(false);
        console.log('error in api get_accounts_visit', error)
      });

  }



  useEffect(() => {
    // Initialize with all customers selected when the component mounts
    console.log("selected customer", selectedCustomers)
  }, [selectedCustomers]);


  const handleSelectAll = () => {
    const selectedCustomersDetails = masterData.map((item) => ({
      id: item.id,
      name: item.name,
      weeklyVisit: item.weeklyVisit,
      monthlyVisit: item.monthlyVisit,
    }));

    if (isAllCustomersSelected(selectedDay)) {
      // Unselect all
      setSelectedCustomers((prevSelectedCustomers) => ({
        ...prevSelectedCustomers,
        [selectedDay]: [],
      }));
      setSelectAll(false);
    } else {
      // Select all
      setSelectedCustomers((prevSelectedCustomers) => ({
        ...prevSelectedCustomers,
        [selectedDay]: selectedCustomersDetails,
      }));
      setSelectAll(true);
    }
  };


  const isAllCustomersSelected = (day) => {
    // console.log("sel cust len", selectedCustomers[day]?.length)
    // console.log("dsg", masterData.length)
    return selectedCustomers[day]?.length === masterData.length;
  };



  const handleCheckboxChange = (item) => {
    if (selectedCustomers[selectedDay]?.find((customer) => customer.id === item.id)) {
      // Remove the customer from selectedCustomers[selectedDay]

      setSelectedCustomers((prevSelectedCustomers) => ({
        ...prevSelectedCustomers,
        [selectedDay]: prevSelectedCustomers[selectedDay].filter((customer) => customer.id !== item.id),
      }));
    } else {
      // Add the customer to selectedCustomers[selectedDay]
      setSelectedCustomers((prevSelectedCustomers) => ({
        ...prevSelectedCustomers,
        [selectedDay]: [
          ...(prevSelectedCustomers[selectedDay] || []),
          {
            name: item.name,
            id: item.id,
            weeklyVisit: item.weeklyVisit,
            monthlyVisit: item.monthlyVisit,
          },
        ],
      }));
    }
  };

  const removeProductFromCart = (item, dayAbbreviation) => {

    console.log("gjda", dayAbbreviation)
    // if (!dayAbbreviation) {
    //   console.error('Invalid dayAbbreviation:', dayAbbreviation);
    //   return;
    // }

    // Create a copy of the selectedCustomers state
    const updatedSelectedCustomers = { ...selectedCustomers };

    // Ensure that the dayAbbreviation is always defined
    updatedSelectedCustomers[dayAbbreviation] = updatedSelectedCustomers[dayAbbreviation]?.filter((customer) => {
      if (customer.id === item.id) {
        console.log(`Removing customer with ID ${item.id} from ${dayAbbreviation}`);
      }
      return customer.id !== item.id;
    });

    // Update the selectedCustomers state with the modified array
    setSelectedCustomers(updatedSelectedCustomers);
  };


  // const hasData = Object.keys(selectedCustomers).some((key) => selectedCustomers[key]?.length);
  // console.log("Does selectedCustomers have data?", hasData);








  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity style={styles.elementsView} activeOpacity={0.8} onPress={() => {

        handleCheckboxChange(item)

      }
      }
      >
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <View
            disabled={item?.account_profile_pic ? true : false}
            // onPress={() => handleImagePress(item.id)}
            >
            {/* <Image
                            //source={require('../../assets/images/account.png')}
                            source={{ uri: item?.account_profile_pic }}
                            style={{ ...styles.avatar }}
                        /> */}
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
            flex: 1,
            marginLeft: 8,
            // borderLeftWidth: 1.5,
            paddingLeft: 10,
            marginLeft: 20,
            // borderStyle: 'dotted',
            // borderColor: 'grey',
            justifyContent: 'space-around'
          }}>
            {/* <View style={{ flexDirection: 'row' }}> */}
            <Text style={{ color: Colors.primary, fontSize: 12, fontFamily: 'AvenirNextCyr-Medium', borderBottomColor: 'grey' }}>{item?.name}</Text>
            {/* </View> */}
            <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}>{item?.industry}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}>{item?.account_type}</Text>


              <Checkbox.Android
                color={Colors.primary}
                status={
                  selectedCustomers[selectedDay]?.some((customer) => customer.id === item.id) ? 'checked' : 'unchecked'
                }
                onPress={() => handleCheckboxChange(item)}
              />

            </View>


            {/* <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}>{item?.street} {item?.city} {item?.shipping_address_state}</Text> */}
            {/* <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Medium' }}>{item?.country} - {item?.postal_code}</Text> */}
          </View>
        </View>
        {/* <Text style={{ fontSize: 12, color: 'black', fontFamily: 'AvenirNextCyr-Medium', marginTop: 5, paddingLeft: 16 }}>{item?.storeid_c}</Text> */}

      </TouchableOpacity>
    )

  }

  const searchProduct = (text) => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource
      // Update FilteredDataSource
      const newData = masterData.filter(
        function (item) {
          const itemData = item.name
            ? item.name.toUpperCase()
            : ''.toUpperCase();
          const textData = text.toUpperCase();

          const regionData = item.region
            ? item.region.toUpperCase()
            : ''.toUpperCase();
          const regionText = text.toUpperCase();

          return (
            itemData.indexOf(textData) > -1 ||
            regionData.indexOf(regionText) > -1
          );
        }
      );
      setFilteredData(newData);
      setSearchQuery(text);
    } else {
      // Both inserted text and region are blank
      // Update FilteredDataSource with masterDataSource
      setFilteredData(masterData);
      setSearchQuery(text);
    }
  };

  const [categoryOption, setCategoryOption] = useState([]);
  const getDropDown = () => {
    fetch('https://gsidev.ordosolution.com/get_dropdownfields.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "__module_name__": "Accounts"
      }),
    })
      .then(response => response.json())
      .then(async res => {
        // console.log("drop down api res", res);
        //Category dropdown
        const categoryArray = Object.keys(res?.region_array).map((key) => ({
          label: res?.region_array[key],
          value: key,
        }));
        // console.log("category option", categoryArray);
        setCategoryOption(categoryArray);


      })
      .catch(error => {
        // Handle the error here
        console.log("errrroer", error);
      });

  }

  const clearSearch = () => {
    setSearchQuery('');
    setFilteredData(masterData);
  };

  // useEffect(() => {
  //   //getting all predefined drop down values
  //   getDropDown();

  // }, [])



  const CustomerListItem = ({ item, day }) => (
    <View style={styles.elementsView1}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Pressable>
          {item.account_profile_image ? (
            <Image source={{ uri: item.account_profile_image }} style={styles.avatar1} />
          ) : (
            <Image source={require('../../assets/images/noImagee.png')} style={styles.avatar1} />
          )}
        </Pressable>
        <Text style={{ color: Colors.primary, fontSize: 12, fontFamily: 'AvenirNextCyr-Medium', marginTop: 5 }}>
          {item.name}
        </Text>
        <TouchableOpacity onPress={() => removeProductFromCart(item, day)}>
          <AntDesign name='close' size={18} color={Colors.black} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const days = [
    { title: 'Monday', abbreviation: 'MO' },
    { title: 'Tuesday', abbreviation: 'TU' },
    { title: 'Wednesday', abbreviation: 'WE' },
    { title: 'Thursday', abbreviation: 'TH' },
    { title: 'Friday', abbreviation: 'FR' },
    { title: 'Saturday', abbreviation: 'SA' },
    { title: 'Sunday', abbreviation: 'SU' },
  ];

  //  const onAccordionPress = (day) => {
  //   console.log("chddhkc",day)
  //   setExpandedDay((prevDay) => (prevDay === day ? null : day));

  //     setSelectedDay(day);
  //   };

  const onAccordionPress = (day) => {
    if (daysbtwn.includes(day)) {
      setExpandedDay((prevDay) => (prevDay === day ? null : day));
      setSelectedDay(day);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>

      <View style={{ ...styles.headercontainer }}>
        <TouchableOpacity onPress={() => {  Alert.alert(
      'Confirm',
      'Are you sure you want to go back? Please note that data will be lost if you proceed.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK', onPress: () => navigation.goBack() },
      ],
      { cancelable: false }
    );}}>
          <AntDesign name='arrowleft' size={25} color={Colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Customers</Text>

        <Text></Text>
      </View>
      <ScrollView>
        <List.Section>
          {days.map((day) => (
            <List.Accordion
              key={day.title}
              title={day.title}
              left={(props) => <List.Icon {...props} icon="calendar" color={daysbtwn.includes(day.abbreviation) ? 'black' : '#cecece'} />}
              right={(props) => <List.Icon {...props} icon="chevron-down" color={daysbtwn.includes(day.abbreviation) ? 'black' : '#cecece'} />}
              titleStyle={{ color: daysbtwn.includes(day.abbreviation) ? 'black' : '#cecece' }}
              expanded={expandedDay === day.abbreviation}
              onPress={() => onAccordionPress(day.abbreviation)}
            >

              <View style={styles.expandedContent}>
                <FlatList
                  showsVerticalScrollIndicator={false}
                  data={selectedCustomers[day.abbreviation]}
                  keyboardShouldPersistTaps='handled'
                  renderItem={({ item }) => <CustomerListItem item={item} day={day.abbreviation} />}
                  keyExtractor={(item) => item.__account_id__}
                />
                {/* Add Customer Button */}
                <TouchableOpacity
                  style={{ ...styles.submitButton1, marginTop: 5 }}
                  onPress={() => handlePress(selectedDay)}>
                  <Text style={styles.submitButtonText}>
                    <AntDesign name='plus' size={18} color={`grey`} /> Add Customer
                  </Text>
                </TouchableOpacity>

                {collaborated === "yes" && <TouchableOpacity
                  style={{ ...styles.submitButton1, marginTop: 5 }}
                  onPress={() => { setCollaborateModal(true) }}
                >
                  <Text style={styles.submitButtonText}>
                    <AntDesign name='addusergroup' size={18} color={`grey`} />  Collaborate
                  </Text>
                </TouchableOpacity>}


                {selectedCollaborators[selectedDay] && selectedCollaborators[selectedDay].length > 0 && (
                  <View style={styles.selectedCollaboratorsContainer}>
                    {selectedCollaborators[selectedDay].map((selectedItem, index) => {
                      // Find the corresponding item in availableColabs based on the value field
                      const correspondingItem = availableColabs.find(item => item.value === selectedItem);

                      return (
                        <View key={index} style={{ backgroundColor: Colors.primary, paddingHorizontal: '3%', paddingVertical: '1%', borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}>
                          <Text style={{ color: 'white', fontFamily: 'AvenirNextCyr-Medium' }}>
                            {correspondingItem ? correspondingItem.label : ''}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                )}



              </View>
            </List.Accordion>
          ))}
        </List.Section>

      </ScrollView>






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
            onPress={name === "Edit" ? EditPlanPressed : createPlanPressed}
            activeOpacity={0.8}
          >
            <Text style={styles.btnText}>
              {name === "Edit" ? "Edit Plan" : "Create Plan"}
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>



      {/* **************************  modal ********************/}

      <Modal
        visible={modalVisible}
      // Enable swipe down to close the modal
      >

        {/* Modal content */}
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)', }}>
          <SafeAreaView style={{ backgroundColor: 'white', padding: 20, width: '100%', marginHorizontal: 10, borderRadius: 10, elevation: 5, height: '90%' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
              <Text>     </Text>
              <Text style={styles.modalTitle}>Customers</Text>
              <TouchableOpacity onPress={() => { setModalVisible(false); clearSearch(); }}>
                <AntDesign name='close' size={20} color={`black`} />
              </TouchableOpacity>
            </View>
            <Searchbar
              style={{ marginHorizontal: '4%', marginVertical: '3%', backgroundColor: '#F3F3F3' }}
              placeholder="Search Customer"
              onChangeText={(val) => searchProduct(val)}
              value={searchQuery}
            />

            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginHorizontal: '5%', alignItems: 'center' }}>

              <View style={{ flexDirection: 'row', paddingLeft: '3%', paddingVertical: '1%', backgroundColor: isAllCustomersSelected(selectedDay) ? Colors.primary : 'white', alignItems: 'center', justifyContent: 'center', borderRadius: 30 }}>
                <TouchableOpacity
                  onPress={handleSelectAll}

                >
                  <Text style={{ fontFamily: 'AvenirNextCyr-Medium', fontSize: 12, color: isAllCustomersSelected(selectedDay) ? 'white' : 'black' }}>SELECT ALL</Text>
                </TouchableOpacity>
                <RadioButton.Android
                  color={isAllCustomersSelected(selectedDay) ? 'white' : 'black'}
                  status={isAllCustomersSelected(selectedDay) ? 'checked' : 'unchecked'}
                  onPress={handleSelectAll}
                />
              </View>
            </View>

            <View style={styles.customerMainContainer}>
              <FlatList
                showsVerticalScrollIndicator={false}
                data={filteredData}
                keyboardShouldPersistTaps='handled'
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
              />

            </View>
          </SafeAreaView>
        </SafeAreaView>
      </Modal>


      <Modal
        visible={collaborateModal}
        transparent={true}
      // Enable swipe down to close the modal
      >
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)', paddingHorizontal: 30, }}>
          <SafeAreaView style={{ backgroundColor: 'white', paddingHorizontal: 20, paddingVertical: 20, borderRadius: 10, elevation: 5, width: '100%' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
              <Text>     </Text>
              <Text style={styles.modalTitle}>Collaborate</Text>
              <TouchableOpacity onPress={() => setCollaborateModal(false)}>
                <AntDesign name='close' size={20} color={`black`} />
              </TouchableOpacity>
            </View>

            <View style={{ marginTop: '2%' }}>
              <MultiSelect
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                // search
                data={availableColabs}
                labelField="label"
                valueField="value"
                placeholder="Select Manager"
                searchPlaceholder="Search..."
                // value={selected}
                value={selectedCollaborators[selectedDay] || []}
                // onChange={item => {
                //   setSelected(item);
                // }}
                onChange={(items) => {
                  handleCollaboratorsChange(selectedDay, items);
                  // console.log("selectedday", selectedDay)
                  // console.log("selectedItem", items)
                }}
                renderLeftIcon={() => (
                  <AntDesign
                    style={styles.icon}
                    color="black"
                    name="user"
                    size={20}
                  />
                )}
                selectedStyle={styles.selectedStyle}
              />

            </View>


          </SafeAreaView>
        </SafeAreaView>


      </Modal>



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

export default SelectCustomer;