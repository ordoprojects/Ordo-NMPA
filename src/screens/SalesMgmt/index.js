import React, { useState, useEffect, useContext } from 'react';
import { View,Text,TouchableOpacity, StyleSheet ,TextInput,FlatList,Image} from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import { lineString as makeLineString } from '@turf/helpers';
import { AuthContext } from '../../Context/AuthContext';
const accessToken = 'sk.eyJ1IjoibmlzaGFudGh1amlyZSIsImEiOiJjbGliY3dxN2MwOG9qM2N1azg2dTBsMHQ1In0.ROqFtNqa1Qecr4ZpmT0b2Q';
MapboxGL.setWellKnownTileServer('Mapbox');
MapboxGL.setAccessToken(accessToken);
import { Callout } from '@rnmapbox/maps';
import AntDesign from 'react-native-vector-icons/AntDesign'
import Colors from '../../constants/Colors'
import globalStyles from '../../styles/globalStyles';



const SalesMgmt = ({navigation}) => {
    const [salesmanData, setSalesmanData] = useState([]);
    const { token } = useContext(AuthContext);
    const [search, setSearch] = useState('');
    

    useEffect(() => {
        // Fetch salesman data from your API

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "text/plain");
        var raw = JSON.stringify({
            "__user_id__": 'af60708c-bb21-e382-25d9-64a3f3a35048',

        })
        console.log(raw)
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
        fetch("https://dev.ordo.primesophic.com/get_check_in_location.php", requestOptions)
            .then(response => response.json())
            .then(res => {
                console.log("Signature Uploaded", res);
                console.log('location res', res.type3);
                //saving all the sales man data
                let tempArray = [];
                if (Array.isArray(res?.type3)) {

                    res?.type3.forEach((item) => {
                        //checking lat & login and battery percentage is not null 
                        if (item?.latitude_c && item?.longitude_c && item?.battery_percentage_c) {
                            tempArray.push(item)
                        }
                    })
                    console.log("temp Array", tempArray);
                    setSalesmanData(res?.type3);
                }


            })
            .catch(error => console.log('live location error', error));

    }, []);
    // const locdata= [parseFloat(salesmanData[0]?.latitude_c),parseFloat(salesmanData[0]?.longitude_c)];
    const locdata=[Number(salesmanData[0]?.longitude_c), Number(salesmanData[0]?.latitude_c)];

    console.log("checkk please 1", locdata)

    console.log("Latitude type:",  parseFloat(salesmanData[0]?.latitude_c));
    console.log("Longitude type:",  salesmanData[0]?.longitude_c);




    return (
        <View style={{flex:1,padding:16,backgroundColor: 'white'}}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
            <AntDesign name='arrowleft' size={25} color={Colors.black} />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, color: Colors.primary, fontFamily: 'AvenirNextCyr-Medium', marginVertical: 5 }}>Customers</Text>
        <Text />

    </View>
    <View style={{ flexDirection: 'row' }}>
                <View style={styles.modalSearchContainer}>
                    <TextInput
                        style={styles.input}
                        value={search}
                        placeholder="Search dealer"
                        placeholderTextColor="gray"
                        onChangeText={(val) => searchProduct(val)}

                    />
                    <TouchableOpacity style={styles.searchButton} >
                        <AntDesign name="search1" size={20} color="black" />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    style={{ height: 50, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', borderRadius: 10, paddingHorizontal: 16, elevation: 5, ...globalStyles.border, flex: 0.2 }}
                    onPress={() => {
                        setSearch('');
                        setFilteredData(masterData)
                        Keyboard.dismiss();
                       }
                    }
                >
                    <Text style={{ color: Colors.primary, fontFamily: 'AvenirNextCyr-Thin', fontSize: 14 }}>Clear</Text>

                </TouchableOpacity>
            </View>
            <Text style={{ color: '#000', fontFamily: 'AvenirNextCyr-Medium',marginLeft:5, marginVertical:5, fontSize: 15 , }}>All Customers List</Text>


            <FlatList
                showsVerticalScrollIndicator={false}
                data={salesmanData}
                keyboardShouldPersistTaps='handled'
                renderItem={({ item }) =>

                    <View style={styles.elementsView}  
                    
                    >
                              
                    <TouchableOpacity onPress={()=>{navigation.navigate('Activities', { userId: item?.id, userName: item?.name })}}
                    >
                        <View style={{ flexDirection: 'row', justifyContent: 'center',alignItems:'center' }}>
                          <TouchableOpacity
                              disabled={item?.account_profile_pic ? true : false}
                            //   onPress={() => handleImagePress(item.id)}
                            >
                              <Image
                                  //source={require('../../assets/images/account.png')}
                                  source={{ uri: 'https://cdn-icons-png.flaticon.com/512/21/21104.png' }}
                                  style={{ ...styles.avatar }}
                              />
                          </TouchableOpacity>
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
                              <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Thin' }}>{item?.username}</Text>
                              <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                              <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Thin' }}>{item?.account_type}</Text>
                              {/* <TouchableOpacity onPress={()=>{navigation.navigate('CustomerDetail',{ item: item })}}>
                              <Text style={{ color: 'orange', fontSize: 13, fontFamily: 'AvenirNextCyr-Thin' }}>See details</Text>
                              </TouchableOpacity> */}
                              </View>


                              {/* <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Thin' }}>{item?.street} {item?.city} {item?.shipping_address_state}</Text> */}
                              {/* <Text style={{ color: 'black', fontSize: 12, fontFamily: 'AvenirNextCyr-Thin' }}>{item?.country} - {item?.postal_code}</Text> */}
                          </View>
                      </View>
                        {/* <Text style={{ fontSize: 12, color: 'black', fontFamily: 'AvenirNextCyr-Thin', marginTop: 5, paddingLeft: 16 }}>{item?.storeid_c}</Text> */}
</TouchableOpacity>
                    </View>


                }

            />
        


        </View>
    );
};

export default SalesMgmt;

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
    elementsView: {
        paddingVertical:15,
        paddingHorizontal:15,
  
        backgroundColor: "white",
        margin: 5,
        //borderColor: 'black',
        //flexDirection: 'row',
        //justifyContent: 'space-between',
        //alignItems: 'center',
        marginBottom: 15,
        borderRadius: 15,
        elevation: 5,
  
        padding: 8
        //borderColor: '#fff',
        //borderWidth: 0.5
    },
    input: {
        flex: 1,
        fontSize: 16,
        marginRight: 10,
    },
    searchButton: {
        padding: 5,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 50,
        borderWidth:1,
        borderColor:'gray',
      },
})