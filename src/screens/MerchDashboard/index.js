import { StyleSheet, Text, View, TouchableOpacity, Image, Modal, FlatList, Alert } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign';
import Colors from '../../constants/Colors';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { AuthContext } from '../../Context/AuthContext';
import { useFocusEffect } from '@react-navigation/native';
import moment from 'moment';
import { Dropdown } from 'react-native-element-dropdown';
import Feather from 'react-native-vector-icons/Feather';
import ActionButton from 'react-native-action-button';
import Ionicons from 'react-native-vector-icons/Ionicons';
import globalStyles from '../../styles/globalStyles';
import Toast from 'react-native-simple-toast';
import OrdersSkeleton from '../Skeleton/OrdersSkeleton';
import LinearGradient from 'react-native-linear-gradient';
import { Searchbar, RadioButton } from 'react-native-paper';
import isDate from 'date-fns/isDate/index.js';
import { hs, vs, ms } from "../../utils/Metrics";

const Approved = ({ navigation, approvedArray, renderItem }) => {

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <FlatList
        data={approvedArray}
        renderItem={renderItem}
      />
    </View>
  );
}

const Pending = ({ navigation, pendingArray, renderItem }) => {

  // const ApprovePlan = (id) => {

  //   var myHeaders = new Headers();
  //   myHeaders.append("Authorization", `Bearer ${userData.token}`);
  //   myHeaders.append("Content-Type", "application/json");

  //   var raw = JSON.stringify({

  //     "status": "Approved",
  //     "is_status_update": "False"

  //   });

  //   var requestOptions = {
  //     method: 'PATCH',
  //     headers: myHeaders,
  //     body: raw,
  //     redirect: 'follow',
  //   };

  //   console.log("rawwwwww", raw, id);

  //   fetch(`https://gsidev.ordosolution.com/api/tourplans/${id}/`, requestOptions)
  //     .then(response => response.json())
  //     .then(result => {
  //       // console.log(result)
  //       // console.log("Edit detail", result.data.id);
  //       if (result) {
  //         // Alert.alert('Approved Plan', 'Plan Approved successfully', [
  //         //   // { text: 'OK', onPress: () => navigation.navigate('Visits') }
  //         // ]);
  //         Toast.show('Plan Approved successfully', Toast.LONG);
  //         setModalVisible(false);
  //         navigation.goBack();
  //       }
  //     })
  //     .catch(error => console.log('error', error));
  // };

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <FlatList
        data={pendingArray}
        renderItem={renderItem}
      />
      {/* <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>

            <Text style={{ fontSize: 16, fontFamily: 'AvenirNextCyr-Bold', marginBottom: '5%' }}>Plan Details</Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                borderBottomColor: "#D9D9D9",
                borderBottomWidth: 1,
                paddingBottom: "5%",
              }}
            >
              <Text style={styles.text}>Plan Name</Text>

              <Text style={styles.text}>
                {selectedItemIds?.name}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                borderBottomColor: "#D9D9D9",
                borderBottomWidth: 1,
                paddingBottom: "5%",
                paddingVertical: "3%",
              }}
            >
              <Text style={styles.text}>User Name</Text>

              <Text style={styles.text}>
                {selectedItemIds?.username}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                borderBottomColor: "#D9D9D9",
                borderBottomWidth: 1,
                paddingBottom: "5%",
                paddingVertical: "3%",
              }}
            >
              <Text style={styles.text}>Duration Time</Text>

              <Text style={styles.text}>
                {moment(selectedItemIds?.start_date).format('DD-MM-YY')} To {moment(selectedItemIds?.end_date).format('DD-MM-YY')}
              </Text>
            </View>

            <View style={{ marginBottom: '1%', marginTop: '5%' }}>
            
              {selectedItemIds?.status === 'Pending' &&
                <LinearGradient
                  colors={Colors.linearColors}
                  start={Colors.start}
                  end={Colors.end}
                  locations={Colors.ButtonsLocation}
                  style={{ borderRadius: 30, marginHorizontal: "5%" }}
                >
                  <TouchableOpacity style={{ borderRadius: 30, paddingVertical: 14, width: '100%' }} onPress={() => ApprovePlan(selectedItemIds.id)}>
                    <Text style={{ color: 'white', fontSize: 14, fontFamily: 'AvenirNextCyr-Medium', textAlign: 'center' }}>Approve</Text>
                  </TouchableOpacity>
                </LinearGradient>
              }
            </View>

            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
              }}
              style={[styles.closeButton, styles.circleButton]}
            >
              <AntDesign name="close" size={20} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal> */}
    </View>
  );
}


const Tab = createMaterialTopTabNavigator();

const MerchDashboard = ({ navigation }) => {

  const { token, userData } = useContext(AuthContext)
  const [isModalVisible1, setModalVisible1] = useState(false);
  // const [filterData, setFilterData] = useState([]);
  const [pendingArray, setPendingArray] = useState([]);
  const [approvedArray, setApprovedArray] = useState([]);
  const [masterdata, setMasterData] = useState([]);
  const [isFocus1, setIsFocus1] = useState(false);
  const [value1, setValue1] = useState(null);
  const [filteredApprove, setFilteredApprove] = useState([]);
  const [filteredPending, setFilteredPending] = useState([]);


  const allOption = { label: 'All', value: 'all' };

  const toggleModal = () => {
    setModalVisible1(!isModalVisible1);
  };

  const applyFilter = () => {
    if (value1 == 'all') {
      // If "All" is selected, show all the products
      setApprovedArray(masterData1);
      setTourPlanArray(masterData2);
    } else
      if (value1) {
        const filteredApproveData = masterData1.filter(item => item.ordo_user_name === value1);
        const filteredPendingData = masterData2.filter(item => item.ordo_user_name === value1);

        setApprovedArray(filteredApproveData);
        setTourPlanArray(filteredPendingData);
      }

    setValue1(null);
    toggleModal();
  };


  const getPlans = async () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${userData.token}`);


    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    await fetch(`https://gsidev.ordosolution.com/api/subordinate_plans/?user_id=${userData.id}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log('get plans data \n', result)
        let approved = [];  //approved plans
        let pending = [];  //reject,pending plans  all are other plans
        result?.forEach((item) => {
          setMasterData(result);
          if (item?.status == 'Approved') {
            approved.push(item);
          }
          //tour plans
          else if (item?.status == 'Pending') {
            pending.push(item)
          }

          //sorting approved plans array
          let sortedarray = approved.sort((a, b) => (a.start_date < b.start_date) ? 1 : -1)
          setApprovedArray(sortedarray)

          //sorting pending  plans array
          let sortedarray2 = pending.sort((a, b) => (a.start_date < b.start_date) ? 1 : -1)
          setPendingArray(sortedarray2);

        })
      })
      .catch(error => console.log('error', error));
  }

  useFocusEffect(
    React.useCallback(() => {
      getPlans();

    }, [userData]))


  const renderItem = ({ item }) => {

    let color = item.status == 'Approved' ? 'green' : item.status == 'PendingApproval' ? 'orange' : 'red';

    return (
      <TouchableOpacity
        style={styles.itemContainer}
        key={item.id}
        onPress={() => {
          navigation.navigate("PlanDetails", {
            planId: item.id, screen: "approve"
          });
        }
        }
      >
        <View style={styles.orderDataContainer}>

          <View>

            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1%'
            }}>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center'
              }}>
                <Image
                  style={{ marginRight: 10, height: 15, width: 15, resizeMode: 'contain' }}
                  source={require('../../assets/images/document2.png')} />
                <Text style={{ ...styles.title, color: Colors.black }}>{item?.name}</Text>
              </View>

            </View>

            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1%'

            }}>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center'
              }}>
                <Image
                  style={{ marginRight: 10, height: 15, width: 15, resizeMode: 'contain' }}
                  source={require('../../assets/images/user.png')} />
                <Text style={{ ...styles.text, fontWeight: '500', color: 'grey' }}>{item.user_name} </Text>
              </View>


            </View>


            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 3,
            }}>
              <Image
                style={{ marginRight: 10, height: 15, width: 15, resizeMode: 'contain' }}
                source={require('../../assets/images/duration.png')} />
              <Text style={{ ...styles.text, fontWeight: '500' }}>{moment(item.start_date).format('DD-MM-YYYY')} To {moment(item.end_date).format('DD-MM-YYYY')}</Text>
            </View>

            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>

            </View>

          </View>
        </View>

      </TouchableOpacity >
    );
  }




  return (
    <LinearGradient colors={Colors.linearColors}
      start={Colors.start} end={Colors.end}
      locations={Colors.location}
      style={{ flex: 1 }}
    >

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', height: '10%', alignItems: 'center', alignContent: 'center', textAlign: 'center', paddingHorizontal: '4%' }}>
        <TouchableOpacity onPress={() => { navigation.goBack() }}>
          <Image source={require('../../assets/images/Refund_back.png')} style={{ height: 30, width: 30 }} />
        </TouchableOpacity>
        <Text style={{ fontFamily: 'AvenirNextCyr-Medium', fontSize: 19, marginLeft: 8, color: 'white' }}>Approve Plans   </Text>
        <TouchableOpacity
          onPress={() => {
            setModalVisible(true)
          }}
        >
          {/* <AntDesign name="filter" size={22} color="white" /> */}
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1 }} >
        <Tab.Navigator
          screenOptions={{
            tabBarIndicatorStyle: { backgroundColor: Colors.primary }
          }
          }
          style={{ borderTopLeftRadius: 20, borderTopRightRadius: 20 }}

        >
          <Tab.Screen
            name="Pending Approval"
            options={{
              title: "Pending Approval",
              tabBarLabelStyle: {
                fontFamily: "AvenirNextCyr-Medium",
                textTransform: "capitalize",
              },
            }}
          >
            {() => (
              <Pending
                pendingArray={pendingArray}
                navigation={navigation}
                renderItem={renderItem}
              />
            )}
          </Tab.Screen>

          <Tab.Screen
            name="Approved"
            options={{
              title: "Approved",
              tabBarLabelStyle: {
                fontFamily: "AvenirNextCyr-Medium",
                textTransform: "capitalize",
              },
            }}
          >
            {() =>
              <Approved
                approvedArray={approvedArray}
                navigation={navigation}
                renderItem={renderItem} />}
          </Tab.Screen>

        </Tab.Navigator>
      </View>


      {/* 
      <Modal
        visible={isModalVisible1}
        animationType="slide"
        transparent={true}

      >

        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 10, }}>
          <View style={{ backgroundColor: 'white', padding: 20, width: '90%', marginHorizontal: 10, borderRadius: 10, elevation: 5 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
              <Text style={styles.modalTitle}>Select User</Text>
              <TouchableOpacity onPress={() => setModalVisible1(false)}>
                <AntDesign name='close' size={20} color={`black`} />
              </TouchableOpacity>

            </View>
            <View style={styles.dropDownContainer}>
              <Dropdown
                style={[styles.dropdown, isFocus1 && { borderColor: 'blue' }]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                itemTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={filterData}
                //search
                maxHeight={400}
                labelField="label"
                valueField="value"
                placeholder={!isFocus1 ? 'Select User type' : '...'}
                //searchPlaceholder="Search..."
                value={value1}
                onFocus={() => setIsFocus1(true)}
                onBlur={() => setIsFocus1(false)}
                onChange={item => {
                  setValue1(item.value);
                  setIsFocus1(false);
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
            </View>
            <View style={styles.buttonview}>
              <TouchableOpacity style={styles.buttonContainer} onPress={applyFilter}>
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>

            </View>
          </View>
        </View>
      </Modal> */}


    </LinearGradient>
  )

}

export default MerchDashboard

const styles = StyleSheet.create({
  itemContainer: {
    // marginTop: 10,
    margin: 12,
    // marginRight: 16,
    borderRadius: 8,
    backgroundColor: Colors.white,
    borderWidth: 1,
    paddingVertical: '5%',
    paddingHorizontal: '2%',
    borderColor: Colors.white,
    elevation: 3,
    ...globalStyles.border,
    marginBottom: 5,
  },
  heading: {
    color: '#000',
    fontFamily: 'AvenirNextCyr-Medium',
    fontSize: 14,
  },
  value: {
    color: 'black',
    fontFamily: 'AvenirNextCyr-Medium'
  },
  buttonTextStyle: {
    fontSize: 18,
    fontFamily: 'AvenirNextCyr-Medium',
  },

  modalTitle: {
    fontSize: 16,
    color: 'black',
    fontFamily: 'AvenirNextCyr-Medium'
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
  },
  placeholderStyle: {
    fontSize: 14,
    fontFamily: 'AvenirNextCyr-Medium'
  },
  selectedTextStyle: {
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
  // title: {
  //     marginVertical: 10,
  //     paddingHorizontal: 36,
  //     fontSize: 18,
  //     fontFamily: 'AvenirNextCyr-Medium',
  //     color: 'black'
  // },
  contentView: {
    color: 'black',
    fontSize: 12,
    fontFamily: 'AvenirNextCyr-Medium',
    //fontStyle:'italic'
  },
  checkOutButton: {
    height: 50,
    margin: 10,
    // backgroundColor:'red',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    backgroundColor: Colors.primary,
  },
  checkOutText: {
    fontFamily: 'AvenirNextCyr-Medium',
    color: '#fff',
    fontSize: 16
  },
  modalTitle: {
    fontSize: 16,
    color: 'black',
    fontFamily: 'AvenirNextCyr-Medium'
  },
  cNameTextInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#B3B6B7',
    padding: 5,
    fontFamily: 'AvenirNextCyr-Medium',
    marginBottom: 10
  },
  buttonview: {
    flexDirection: 'row'
  },
  buttonContainer: {
    heigh: 40,
    padding: 10,
    borderRadius: 10,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    //marginRight: 10,
    marginVertical: 10,
    backgroundColor: Colors.primary
  },
  buttonText: {
    fontFamily: 'AvenirNextCyr-Medium',
    color: 'white'
  },
  orderDataContainer: {
    paddingHorizontal: 10
  },
  title: {
    fontSize: 14,
    color: Colors.primary,
    fontFamily: 'AvenirNextCyr-Medium',
    textTransform: 'capitalize'

  },
  text: {
    fontSize: 14,
    color: Colors.black,
    fontFamily: 'AvenirNextCyr-Medium',
  },
  planHeading: {
    color: 'black',
    fontSize: 16,
    fontFamily: 'AvenirNextCyr-Medium',
    marginVertical: 3
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: "5%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    justifyContent: "center",
    width: "90%",

  },

  MPriceText: {
    fontSize: 29,
    fontFamily: "AvenirNextCyr-Medium",
    color: Colors.black,
    marginVertical: "3%",
    alignSelf: "center",
  },
  imgStyle: {
    height: 100,
    width: 220,
    marginVertical: "3%",
    alignSelf: "center",
  },
  closeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "lightgray",
    borderRadius: 20,
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#EFF1F5",
  },
  textStyle: {
    marginLeft: 10,
  },
  circleButton: {
    width: 30,
    height: 30,
  },
  circle: {
    width: 50,
    height: 50,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },


})