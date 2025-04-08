import {
    StyleSheet, Text, View, Image, TextInput,
    ActivityIndicator, TouchableOpacity, FlatList, Modal, Pressable
} from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import Colors from '../../constants/Colors';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer, useIsFocused, useRoute } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { AuthContext } from '../../Context/AuthContext';
import globalStyles from '../../styles/globalStyles';
import LinearGradient from 'react-native-linear-gradient';
import { Searchbar, RadioButton } from 'react-native-paper';
import moment from 'moment'
import DatePicker from 'react-native-date-picker'
import Icon from 'react-native-vector-icons/FontAwesome';
import { Dropdown } from 'react-native-element-dropdown';





const RFQDetails = ({ navigation ,route}) => {
    const { ordersLoading, setOrdersLoading,userData,token } = useContext(AuthContext);



    const [search, setSearch] = useState('');
    const onChangeSearch = query => setSearchQuery(query);
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedOption, setSelectedOption] = useState('all');
    const [searchQuery, setSearchQuery] = React.useState('');
    const [isDatePickerVisible, setDatePickerVisible] = useState(false);
    const [date, setDate] = useState(new Date())
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(false);
    const [isFocus, setIsFocus] = useState(false);
    const [selectedLabelValue, setSelectedLabelValue] = useState(null);
    const [LabelValue, setLabelValue] = useState(null);
    const [data, setData] = useState(false);
  
    const { rfq } = route.params;

console.log("rfqqq",rfq);


    const toggleModal = () => {
        setModalVisible(!isModalVisible);
      };
    


      useEffect(() => {
        getHistory();
    }, [])

    const renderItem = ({ item, index }) => {



        let color = item.status == 'Approved' ? 'green' : item.status == 'Pending' ? '#4169E1' :item.status == 'Partially Approved' ? 'orange': 'red';
        // let status = item.status == 'Approved' ? 'Approved' : item.status == 'Pending' ? 'Partially Approval' : 'Rejected';
        let order = item;
        return (
    
          <TouchableOpacity
            style={styles.itemContainer}
            onPress={() => navigation.navigate('RFQProducts', { item: order,id:rfq.id})}
            activeOpacity={0.5}
          >
           <View style={styles.tagContainer}>
        <Text style={styles.tagText}>Completed</Text>
      </View>
            <View style={styles.orderDataContainer}>
           
              <View style={{
                flexDirection: 'row',
                alignItems: 'center'
              }}>
           
                <Image
                  style={{ marginRight: 10, height: 15, width: 15, resizeMode: 'contain' }}
                  source={require('../../assets/images/document2.png')} />
                <Text style={styles.title}>{order?.supplier_name}</Text>
              </View>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 3,
              }}>
                <Image
                  style={{ marginRight: 10, height: 15, width: 15, resizeMode: 'contain' }}
                  source={require('../../assets/images/tick.png')} />
                <Text style={{ ...styles.text, color: color, fontFamily: 'AvenirNextCyr-Medium' }}>{order.status}</Text>
              </View>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 3,
              }}>
                <Image
                  style={{ marginRight: 10, height: 15, width: 15, resizeMode: 'contain' }}
                  source={require('../../assets/images/duration.png')} />
                <Text style={{ ...styles.text, fontWeight: '500' }}>{moment(order.date_entered).format('DD-MM-YYYY')}</Text>
              </View>
            </View>
          </TouchableOpacity>
        );
    
    
    
      }
    
      //no data found
      const noDataFound = () => {
        return (
          <View style={styles.noReport}>
            <Text style={styles.noReportText}>No returns found</Text>
          </View>
        )
      }
    
      const getHistory = () =>{
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${userData.token}`);
      // myHeaders.append("Cookie", "csrftoken=RK01uE9J0xQQMWCjMG7ZfcSnMMQJI9Yl");
      
      var raw = "";
      
      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };
      
      fetch(`https://gsidev.ordosolution.com/api/rfq/${rfq.id}/`, requestOptions)
        .then(response => response.json())
           .then(result => {
              console.log("rfq details", result)
              setData(result);
          
            })
            .catch(error => console.log('get tour plan error', error));
        
      
        }

    return (
        // <View style={{ flex: 1, backgroundColor: 'red' }}>
        <LinearGradient colors={['white','white']}
            start={Colors.start}end={Colors.end}
            locations={Colors.location}
            style={{ flex: 1 }}
        >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', height: '10%', alignItems: 'center', alignContent: 'center', textAlign: 'center', paddingHorizontal: '4%',  borderBottomWidth:1,
      borderBottomColor:'white',
      elevation: 2,
      ...globalStyles.border, }}>
                <TouchableOpacity onPress={() => { navigation.goBack() }}>
                    {/* <Image source={require('../../assets/images/Refund_back.png')} style={{ height: 30, width: 30 }} /> */}
                    <AntDesign name="arrowleft" size={24} color={Colors.primary} />
                </TouchableOpacity>
                <Text style={{ fontFamily: 'AvenirNextCyr-Medium', fontSize: 19, marginLeft: 8, color: Colors.primary}}>{rfq.name}</Text>
                <View><Text>    </Text></View>
                {/* <TouchableOpacity
                    onPress={() => {
                        setModalVisible(true)
                    }}
                ><AntDesign name="filter" size={22} color="white" /></TouchableOpacity> */}
            </View>

            {/* <Searchbar
                style={{ marginHorizontal: '4%', marginBottom: '4%', backgroundColor: '#F3F3F3', fontFamily: 'AvenirNextCyr-Thin' }}
                placeholder="Search "
                placeholderTextColor='grey'
                onChangeText={(val) => setSearch(val)}
                value={search}
            /> */}
                            <View style={{ height: '90%', backgroundColor: '#f5f5f5', width: '100%',  paddingHorizontal: '2%',paddingVertical:'2%' }}>
                            
                            {/* {noData && noDataFound()} */}
      <FlatList
         data={data}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        
      />

      {/* <View style={styles.cardContainer}>
      <Text>Your Card Content Here</Text>

      <View style={styles.tagContainer}>
        <Text style={styles.tagText}>Offer</Text>
      </View>
    </View> */}

    
</View>



        
        </LinearGradient>

    )
}

export default RFQDetails

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
        margin: 5,
        //borderColor: 'black',
        //flexDirection: 'row',
        //justifyContent: 'space-between',
        //alignItems: 'center',
        marginBottom: 16,
        borderRadius: 8,
        elevation: 5,
        ...globalStyles.border,
        padding: 20
        //borderColor: '#fff',
        //borderWidth: 0.5
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
        fontFamily: 'AvenirNextCyr-Thin',
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
    itemContainer: {
      marginTop: '2%',
      borderRadius: 5,
      backgroundColor: Colors.white,
      borderWidth: 1,
      borderColor: Colors.white,
      elevation: 5,
      ...globalStyles.border,
      marginBottom: '2%',
      marginHorizontal:'2%',
      flex:1,
      paddingTop: '8%',
      paddingBottom: '4%',
      paddingLeft: '9%',
      overflow: 'hidden',

  },
  orderDataContainer: {
    
  },


  cardContainer: {
    position: 'relative',
    padding: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden', // Ensure the tag is clipped within the card
  },
  tagContainer: {
    position: 'absolute',
    top: '6%',
    left: '-8%',
    backgroundColor: 'green', // Tag background color
    paddingVertical: '2%',
    paddingLeft: '17%',
    paddingRight: '16%',
    borderRadius: 4,
    transform: [{ rotate: '-30deg' }], // Rotate by 45 degrees for diagonal effect
  },
  tagText: {
    color: 'white', // Tag text color
    fontWeight: 'bold',
  },
})