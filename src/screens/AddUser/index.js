import React, { useContext, useEffect, useState } from 'react'
import Toast from 'react-native-simple-toast';
import { AuthContext } from '../../Context/AuthContext';
import { View, Dimensions, Text, ScrollView, StyleSheet, TouchableOpacity, Modal, Alert, SafeAreaView, FlatList, Pressable, TextInput as TextInput1, Keyboard } from 'react-native'
import { BarChart } from "react-native-gifted-charts";
import Colors from '../../constants/Colors';
import uniqolor from 'uniqolor';
import { useFocusEffect } from '@react-navigation/native';
import { Image } from 'react-native-animatable';
import { MapView } from '@rnmapbox/maps';
import PercentageCircle from 'react-native-percentage-circle';
import { PieChart } from "react-native-gifted-charts";
import globalStyles from '../../styles/globalStyles';
import style from '../AddShelfDisplay/style';
import { cameraPermission } from '../../utils/Helper';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import ImageResizer from '@bam.tech/react-native-image-resizer'
import RNFS from 'react-native-fs';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { TextInput,Checkbox, RadioButton } from 'react-native-paper';
import RNFetchBlob from 'rn-fetch-blob';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import LinearGradient from 'react-native-linear-gradient';



const AddUser = ({ navigation, route }) => {

    const { userData } = useContext(AuthContext);

    const { screen, userId } = route?.params
    // console.log("Screeen", userId)


    const [showSecondModal, setShowSecondModal] = useState(false);
    const [checked, setChecked] = useState('Individual');
    const [resetpass, setResetPass] = useState('');
    const [confirmpass, setConfirmpass] = useState('');
    const [products, setProducts] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [base64img, setBase64img] = useState('');
    const [expanded, setExpanded] = useState(false);
    const [expanded1, setExpanded1] = useState(false);
    const [address, setAddress] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPass, setConfirmPass] = useState([]);
    // const [filteredData, setFilteredData] = useState([]);
    // const [selectedItem, setselectedItems] = useState([]);
    // const [price, setPrice] = useState('');
    // const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [basic, setBasic] = useState([]);
    const [access, setAccess] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [currentView, setCurrentView] = useState("basic");

    const handleCheckboxToggle = (id) => {
        if (selectedItems.includes(id)) {
          setSelectedItems(selectedItems.filter(item => item !== id));
        } else {
          setSelectedItems([...selectedItems, id]);
        }
      };

      console.log("access",selectedItems)

    const data = [
        { id: 1, name: "Supplier Management" },
        { id: 2, name: "Inventory Management" },
        { id: 3, name: "Order Management" },
        { id: 4, name: "Sales Management" },
        { id: 5, name: "Fleet Management" },
        { id: 6, name: "Financial Management" }
      ];

    useEffect(() => {
        if (userId) {
            // console.log("supplier there, ", userId)
            getUserDetails()
        }
    }, [userId])


    const getUserDetails = () => {
        var myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', `Bearer ${userData.token}`);

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow',
        };

        fetch(`https://gsidev.ordosolution.com/api/ordo_users/${userId}/`, requestOptions)
            .then((response) => response.json())
            .then(async (result) => {
                if (result) {
                    console.log('supp details', result);
                    setName(result.name)
                    setUserName(result.username)
                    setPassword(result.password)
                    setEmail(result.email)
                    setAddress(result.location)
                    setBase64img(result.profile_image)
                    // setLoading(false);
                }
            })
            .catch((error) => {
                setLoading(false);
                console.error('Error in get supplier', error);
            });
    }

    // useEffect(() => {
    //   loadAllProduct()

    // }, [])

    // const loadAllProduct = async (id) => {

    //   const myHeaders = new Headers();
    //   myHeaders.append("Content-Type", "application/json");

    //   const raw = JSON.stringify({

    //     "__module_code__": "PO_40",
    //     "__query__": "",
    //     "__orderby__": "",
    //     "__offset__": 0,
    //     "__select _fields__": [
    //       "id",
    //       "name"
    //     ],
    //     "__max_result__": 500,
    //     "__delete__": 0

    //   });

    //   const requestOptions = {
    //     method: 'POST',
    //     headers: myHeaders,
    //     body: raw,
    //     redirect: 'follow'
    //   };

    //   fetch("https://dev.ordo.primesophic.com/get_data_s.php", requestOptions)
    //     .then((response) => response.json())
    //     .then(async result => {
    //       //console.log('all product data fetched');

    //       tempArray = await result?.entry_list.map(object => {
    //         return {
    //           "id": object.name_value_list.id.value,
    //           "name": object.name_value_list.name.value,
    //           'price': object.name_value_list.price.value,
    //           'description': object.name_value_list.description.value,
    //           'product_image': object.name_value_list.product_image.value,
    //           'part_number': object.name_value_list.part_number.value,
    //           'vat': object.name_value_list.vat.value,
    //           'type': 0, 'upc': object.name_value_list.type.value,

    //         }


    //       });
    //       // console.log("product data", tempArray);
    //       setMasterData(tempArray)
    //       setFilteredData(tempArray);
    //     })
    //     .catch((error) => {
    //       setLoading(false);
    //       console.log('Error', error);
    //     });
    // };

    // const searchProduct = (text) => {
    //   // Check if searched text is not blank
    //   if (text) {
    //     // Inserted text is not blank
    //     // Filter the masterDataSource
    //     // Update FilteredDataSource
    //     const newData = masterData.filter(
    //       function (item) {
    //         const itemData = item.name
    //           ? item.name.toUpperCase() + item.id.toUpperCase()
    //           : ''.toUpperCase();
    //         const textData = text.toUpperCase();
    //         return itemData.indexOf(textData) > -1;
    //       });
    //     setFilteredData(newData);
    //     setSearch(text);
    //   } else {
    //     // Inserted text is blank
    //     // Update FilteredDataSource with masterDataSource
    //     setFilteredData(masterData);
    //     setSearch(text);
    //   }
    // };

    // const handleCheckboxChange = (item) => {
    //   if (selectedItem.find((customer) => customer.id === item.id)) {
    //     // Remove the customer from selectedItem
    //     setselectedItems((prevselectedItems) =>
    //       prevselectedItems.filter((customer) => customer.id !== item.id)
    //     );
    //   } else {
    //     // Add the customer to selectedItem
    //     setselectedItems((prevselectedItems) => [
    //       ...prevselectedItems,
    //       {
    //         name: item.name,
    //         id: item.id,
    //         product_image: item.product_image

    //       },
    //     ]);
    //   }


    // };

    // const removeProductFromCart = (item) => {
    //   // Filter out the item to remove it from the array
    //   const updatedProducts = selectedItem.filter((product) => product.id !== item.id);
    //   setselectedItems(updatedProducts); // Update the state with the new array
    // };

    // const updatePrice = (itemId, newPrice) => {
    //   const updatedItems = selectedItem.map((item) =>
    //     item.id === itemId ? { ...item, price: newPrice } : item
    //   );
    //   setselectedItems(updatedItems);
    // };





    const handleGallery = async () => {
        // setModalVisible1(false);
        const res = await launchImageLibrary({
            mediaType: 'photo',

        });
        imageResize(res.assets[0].uri, res.assets[0].type);
        // if (base64img) {
        //     await saveProfilePictureToApi(base64img);
        //     console.log("Profile picture saved ");
        // }
        setShowSecondModal(false);

    }


    const checkPermissionCam = async () => {
        let PermissionDenied = await cameraPermission();
        if (PermissionDenied) {
            console.log("camera permssion granted");
            handleCamera();
        }
        else {
            console.log("camera permssion denied");
            //requestStoragePermission();
        }
    }



    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };






    const handleCamera = async () => {

        const res = await launchCamera({
            mediaType: 'photo',
        });
        imageResize(res.assets[0].uri, res.assets[0].type);
        setShowSecondModal(false);
    }

    const imageResize = async (img, type) => {
        try {
            const res = await ImageResizer.createResizedImage(
                img,
                300,
                300,
                'JPEG',
                50,
            );


            const base64Data = await RNFS.readFile(res.path, 'base64');

            const base64img1 = `data:${type};base64,${base64Data}`;

            setBase64img(base64img1);
            console.log("base64img1111", base64img1);

            // uploadImage(loginResponse.current.id, base64img1);
            //onPressLogin(base64img1);
            // Now you can use base64img as needed (e.g., uploadImage)
        } catch (error) {
            console.log("img resize error", error);
        }
    };

    //auth token value
    const { token, dealerData, logout } = useContext(AuthContext);



    //Bar Graph data logic



    const toggleExpansion = () => {
        setExpanded(!expanded);
    };

    const toggleExpansion1 = () => {
        setExpanded1(!expanded1);
    };


    const saveUserDetails = () => {
        if (!name && !email && !password && !userName && !address) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }


        if (!base64img){
            Alert.alert('Error', 'Please Upload Profile Image');
            return;
          }

            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", `Bearer ${userData.token}`);

            // console.log("GFHJ", userData.token)

            var raw = JSON.stringify({

                "name": name,
                "email": email,
                // "partner_description": "string",
                "password": password,
                "username": userName,
                // "token": "string",
                // "designation": "string",
                "location": address,
                // "modified_by": "string",
                // "sales_target": "84",
                // "descriptions": "string",
                "profile_image": base64img,
                "compare_image": base64img,
                // "daily_allowance": 1000,
                // "travel_allowance": 1000,
                // "status": "string",
                // "device_id": "string",
                // "accounts": "string",
                // "region": "string",
                // "longitude": 0,
                // "latitude": 0,
                // "users": "string",

            });
            console.log("rawwwwww-------->", raw)

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            fetch("https://gsidev.ordosolution.com/api/ordo_users/", requestOptions)
                .then(response => response.json())
                .then(async result => {

                    console.log("result of save supplier", result)

                    if (result) {
                        setName('');
                        setEmail('');
                        setAddress('');
                        setPhone('');
                        setUserName('');
                        setPassword('');
                        setConfirmPass('');

                        Alert.alert('Success', 'User Details sent for approval', [
                            { text: 'OK', onPress: () => navigation.goBack() }
                        ])
                    }

                })
                .catch(error => console.log('error', error));
    }


    const editUserDetails = async () => {

        setLoading(true);

        var myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', `Bearer ${userData.token}`);

        let Photo = ''

        const isFileFormat = base64img && base64img.startsWith("data:");

        // Convert to base64 if in file format
        if (isFileFormat) {
            console.log('base64img is already in base64 format:', base64img);
            // Set convertedBase64img directly, as no need to fetch from URL
        } else {
            console.log('base64img is in file format:', base64img);

            const imageUrlToBase64 = async (base64img) => {
                try {
                    const response = await RNFetchBlob.fetch('GET', base64img);
                    const base64Data = response.base64();
                    // console.log("hello");
                    return base64Data;
                } catch (error) {
                    console.error('Error converting image URL to base64:', error);
                    throw error;
                }
            };

            const base64Data = await imageUrlToBase64(base64img);
            // Add the desired prefix to the base64 data
            const formattedBase64Data = `data:image/jpeg;base64,${base64Data}`;
            // console.log("hello again!!", formattedBase64Data)

            Photo = formattedBase64Data

            // Set the formatted base64Data to your state variable

        }


        var raw = JSON.stringify({
            "name": name,
            "email": email,
            // "partner_description": "string",
            "password": password,
            "username": userName,
            // "token": "string",
            // "designation": "string",
            "location": address,
            // "modified_by": "string",
            // "sales_target": "84",
            // "descriptions": "string",
            "profile_image": Photo? Photo : base64img,
            "compare_image": Photo? Photo : base64img,
            // "daily_allowance": 1000,
            // "travel_allowance": 1000,
            // "status": "string",
            // "device_id": "string",
            // "accounts": "string",
            // "region": "string",
            // "longitude": 0,
            // "latitude": 0,
            // "users": "string"
        });


        console.log("edit rawwww", raw)

        var requestOptions = {
            method: 'PATCH',
            headers: myHeaders,
            body: raw,
            redirect: 'follow',
        };

        fetch(`https://gsidev.ordosolution.com/api/ordo_users/${userId}/`, requestOptions)
            .then((response) => {
            
                if (response.status === 200) {
                    // Successful deletion
                    setLoading(false);
                    Toast.show('User edited successfully', Toast.LONG);
                } else if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                } else {
                    return response.json();
                }
            })
            // .then(async (result) => {
            //   if (result) {
            //     console.log('testttttt', result);
            //   }
            // })
            .catch((error) => {
                setLoading(false);
                console.error('Error in delete supplier', error);
            });

    }

    const renderBasicInformation = () => {
        return (
<View>

<View style={{ alignItems: 'center', marginTop: 6 }}>
    <View style={styles.circleContainer}>
        <TouchableOpacity
            onPress={() => setShowSecondModal(true)}
            style={styles.avatarImageContainer}
        >
            <Image
                source={
                    base64img || dealerData.profile_image
                        ? { uri: base64img || dealerData.profile_image }
                        : require('../../assets/images/UserAvatar.png')
                }
                style={styles.avatarImage}
            />
            <View style={styles.addImageIndicator}>
                <Text style={styles.addImageText}>+</Text>
            </View>
        </TouchableOpacity>
    </View>
</View>

            <View style={{ marginTop: 10, paddingHorizontal: '4%' }} onPress={toggleExpansion}>
                <View style={styles.card}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={styles.cardTitle}><FontAwesome name='user-o' size={20} color={`black`} />   User Details</Text>
                        <FontAwesome name='angle-down' size={20} color={`black`} />
                    </View>
                    {
                        // expanded &&

                        (
                            <View style={styles.expandedContent}>
                                <View style={styles.inputView}>
                                    <TextInput
                                        style={styles.inputText}
                                        // placeholder="Full Name"
                                        value={name}
                                        autoCapitalize='none'
                                        placeholderTextColor="#003f5c"
                                        mode='outlined'
                                        label='Full Name'
                                        onChangeText={(val) => { setName(val) }}
                                    // onChangeText={text => updateName(text)}
                                    />
                                </View>




                                <View style={styles.inputView1}>
                                    <TextInput
                                        style={[styles.inputText, styles.addressInput]}
                                        // placeholder="Address"
                                        multiline={true}
                                        value={address}
                                        mode='outlined'
                                        label='Address'
                                        numberOfLines={4} // You can adjust the number of lines as needed
                                        // placeholderTextColor="#003f5c"
                                        onChangeText={(val) => { setAddress(val) }}
                                    // onChangeText={text => updateAddress(text)}
                                    />
                                </View>

                                <View style={styles.inputView}>
                                    <TextInput
                                        style={styles.inputText}
                                        // placeholder="Full Name"
                                        value={email}
                                        autoCapitalize='none'
                                        placeholderTextColor="#003f5c"
                                        mode='outlined'
                                        label='Email'
                                        onChangeText={(val) => { setEmail(val) }}
                                    // onChangeText={text => updateName(text)}
                                    />
                                </View>

                                {/* <View style={styles.inputView}>
                                    <TextInput
                                        style={styles.inputText}
                                        // placeholder="Full Name"
                                        value={phone}
                                        autoCapitalize='none'
                                        placeholderTextColor="#003f5c"
                                        mode='outlined'
                                        label='Phone Number'
                                        onChangeText={(val) => { setPhone(val) }}
                                    // onChangeText={text => updateName(text)}
                                    />
                                </View> */}


                            </View>

                        )}
                </View>
            </View>

            <View style={{ marginTop: 10, paddingHorizontal: '4%' }} onPress={toggleExpansion}>
                <View style={styles.card}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={styles.cardTitle}><FontAwesome name='lock' size={20} color={`black`} />   User Credentials</Text>
                        <FontAwesome name='angle-down' size={20} color={`black`} />
                    </View>
                    {
                        // expanded &&

                        (
                            <View style={styles.expandedContent}>

                                <View style={styles.inputView}>
                                    <TextInput
                                        style={styles.inputText}
                                        // placeholder="Full Name"
                                        value={userName}
                                        autoCapitalize='none'
                                        placeholderTextColor="#003f5c"
                                        mode='outlined'
                                        label='User name'
                                        onChangeText={(val) => { setUserName(val) }}
                                    // onChangeText={text => updateName(text)}
                                    />
                                </View>


                                <View style={styles.inputView}>
                                    <TextInput
                                        style={styles.inputText}
                                        // placeholder="Full Name"
                                        value={password}
                                        autoCapitalize='none'
                                        placeholderTextColor="#003f5c"
                                        mode='outlined'
                                        label='Password'
                                        onChangeText={(val) => { setPassword(val) }}
                                    // onChangeText={text => updateName(text)}
                                    />
                                </View>


                                {/* <View style={styles.inputView}>
                                    <TextInput
                                        style={styles.inputText}
                                        // placeholder="Full Name"
                                        value={confirmPass}
                                        autoCapitalize='none'
                                        placeholderTextColor="#003f5c"
                                        mode='outlined'
                                        label='Confirm password'
                                        onChangeText={(val) => { setConfirmPass(val) }}
                                    // onChangeText={text => updateName(text)}
                                    />
                                </View> */}


                            </View>

                        )}
                </View>
            </View>

        <View style={{ flexDirection: 'column', justifyContent: 'flex-end', flex: 1, paddingHorizontal: '4%', marginBottom: 5 }}>

            <View style={[styles.rowContainer, { justifyContent: "flex-end" }]}>
            <LinearGradient
              colors={Colors.linearColors}
              start={Colors.start}
              end={Colors.end}
              locations={Colors.ButtonsLocation}
              style={{
                // padding: 5,
                borderRadius: 5,
                // backgroundColor: Colors.primary,
                paddingHorizontal: "3%",
                paddingVertical: "2%",



              }}
            >
              <TouchableOpacity
                style={styles.NextPrevBtn}
                onPress={() => setCurrentView("access")}
              >
                <Text style={styles.tabButtonText}>
                  <AntDesign name="right" size={20} color={`white`} />

                </Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
          </View>

</View>

                    )
    }


    const renderAccess = () => {
        return (
<View>
<Text style={{ fontSize: 18, fontFamily: 'AvenirNextCyr-Bold', marginLeft: '5%',marginBottom:'1%' }}>Access and Permission</Text>

            <View style={{...styles.card,marginHorizontal: '4%',marginTop:'2%',padding:10}}>

                     <FlatList
  data={data}
  renderItem={({ item }) => (
    <Pressable style={{...styles.detailContainer,paddingVertical: '1%',borderBottomWidth:0}}
    onPress={() => handleCheckboxToggle(item.id)}
     >
                <Text style={{...styles.text,fontSize:16}}>{item.name}</Text>
                <Checkbox.Item
          color={Colors.primary}
          key={item.id}
          status={selectedItems.includes(item.id) ? 'checked' : 'unchecked'}
          onPress={() => handleCheckboxToggle(item.id)}
        />
            </Pressable>
  )}
  keyExtractor={item => item.id.toString()}
/>
        </View>

        <View style={{ flexDirection: 'column', justifyContent: 'flex-end', flex: 1, paddingHorizontal: '4%', marginBottom: 5 }}>
        
        <View style={styles.rowContainer}>
          <LinearGradient
            colors={Colors.linearColors}
            start={Colors.start}
            end={Colors.end}
            locations={Colors.ButtonsLocation}
            style={{
              // padding: 5,
              borderRadius: 5,
              // backgroundColor: Colors.primary,
              paddingHorizontal: "3%",
              paddingVertical: "2%",

            }}
          >
            <TouchableOpacity
              style={styles.NextPrevBtn}
              onPress={() => setCurrentView("basic")}
            >
              <Text style={styles.tabButtonText}>
                <AntDesign name="left" size={20} color={`white`} />

              </Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        <LinearGradient
          colors={Colors.linearColors}
          start={Colors.start}
          end={Colors.end}
          locations={Colors.ButtonsLocation}
          style={{
            height: 50,
            justifyContent: "center",
            borderRadius: 5,
            backgroundColor: Colors.primary,
            marginBottom: 10,


          }}
        >
                <TouchableOpacity style={{ ...styles.submitButton1}} onPress={screen === "add" ? saveUserDetails : editUserDetails}>
                    <Text style={styles.submitButtonText}>Submit</Text>
                </TouchableOpacity>
                </LinearGradient>

                </View>


        </View>
        
        )
    }


    return (
        <ScrollView style={{ flex: 1, backgroundColor: 'white', }}>
            <View style={{
                ...styles.checkOutView,

            }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <AntDesign name='arrowleft' size={25} color={Colors.black} />
                </TouchableOpacity>


                {/* <Image style={{ height: 50, width: 60 }} source={require('../../assets/images/ordologo.png')} /> */}

                {screen === 'add' ?
                    <Text style={{ fontSize: 18, fontFamily: 'AvenirNextCyr-Medium', marginRight: '15%' }}>              Add User</Text> :
                    <Text style={{ fontSize: 18, fontFamily: 'AvenirNextCyr-Medium', marginRight: '15%' }}>              Edit User</Text>
                }


                <View>
                <Text></Text>
                </View>

            </View>
            <View style={styles.buttonContainer}>

<TouchableOpacity
  style={
    currentView === "basic"
      ? [styles.tabButton, styles.activeTabButton]
      : styles.tabButton
  }
  onPress={() =>
    setCurrentView("basic") && styles.activeTabButton
  }
>
  {/* <Text style={styles.tabButtonText}>Supplier Details</Text> */}
</TouchableOpacity>

<TouchableOpacity
  style={
    currentView === "access"
      ? [styles.tabButton, styles.activeTabButton]
      : styles.tabButton
  }
  onPress={() =>
    setCurrentView("access") && styles.activeTabButton
  }
>
  {/* <Text style={styles.tabButtonText}>Choose Product</Text> */}
</TouchableOpacity>

{/* <TouchableOpacity
style={
currentView === "Additional Details"
  ? [styles.tabButton, styles.activeTabButton]
  : styles.tabButton
}
onPress={() =>
setCurrentView("Additional Details") && styles.activeTabButton
}
>
<Text style={styles.tabButtonText}>Additional Info</Text>
</TouchableOpacity> */}
</View>
<Text style={styles.pageIndicator}>
{currentView === "basic" ? "Page 1 of 2" : "Page 2 of 2"}
</Text>

{/* <View style={{ alignItems: "center", marginTop: 6 }}></View> */}

{currentView === "basic" && renderBasicInformation()}
{currentView === "access" && renderAccess()}



         




            <Modal
                animationType="fade"
                transparent={true}
                visible={showSecondModal}
                onRequestClose={() => setShowSecondModal(false)}
            >
                <TouchableOpacity
                    style={styles.modalContainer1}
                    activeOpacity={1}
                    onPress={() => setShowSecondModal(false)}
                >
                    <View style={styles.modalContent1}>
                        <TouchableOpacity
                            onPress={() => setShowSecondModal(false)}
                            style={styles.closeButton}
                        >
                            <AntDesign name='close' size={20} color={`black`} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={checkPermissionCam} style={styles.submitButton}>
                            <Text style={styles.submitButtonText}>Take Photo</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleGallery} style={styles.submitButton}>
                            <Text style={styles.submitButtonText}>Choose from Gallery</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </ScrollView>
    )
}


export default AddUser;

const styles = StyleSheet.create({
    salesContainer: {
        marginHorizontal: 16,
        padding: 10,
        backgroundColor: Colors.white,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginVertical: 10,
        elevation: 5,
        ...globalStyles.border,
        borderRadius: 5,
        marginTop: 20,



    },
    total: {
        fontSize: 18,
        color: Colors.primary,
        fontFamily: 'AvenirNextCyr-Medium',

    },

    checkOutView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: '2%',
        paddingHorizontal: '3%'

        // flex:1
    },
    label: {
        fontSize: 16,
        color: Colors.black,
        fontFamily: 'AvenirNextCyr-Medium',
    },
    performanceContainer: {
        marginHorizontal: 16,
        padding: 10,
        backgroundColor: Colors.white,
        paddingHorizontal: 16,
        marginVertical: 10,
        elevation: 5,
        ...globalStyles.border,
        borderRadius: 5,
    },
    heading: {
        fontSize: 22,
        color: Colors.primary,
        fontFamily: 'AvenirNextCyr-Medium',
    },
    subHeading: {
        fontSize: 13,
        color: 'grey',
        fontFamily: 'AvenirNextCyr-Medium',
    },
    card: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
      },
    cardTitle: {
        fontSize: 15,
        fontFamily: 'AvenirNextCyr-Medium',
        color:Colors.black
    },
    expandedContent: {
        marginTop: 10,
    },
    avatarImageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        borderColor: 'grey',
        borderWidth: 1,
        width: 80,
        height: 80,
        borderRadius: 50,
    },
    avatarImage: {
        width: 70,
        height: 70,
        borderRadius: 40, // Half of the width/height to make it circular
        // borderWidth: 1,   // Border styles
        borderColor: 'grey',
        overflow: 'hidden',
    },
    modalContainer1: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent1: {
        backgroundColor: 'white',
        width: 300,
        borderRadius: 10,
        padding: 30,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    modalContent: {
        backgroundColor: 'white',
        width: 350,
        // flex:1,
        borderRadius: 10,
        padding: 30,
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
    submitButton1: {
        //   height: 40,
    // justifyContent: "center",
    // alignItems: "center",
    // borderRadius: 5,
    // backgroundColor: Colors.primary,
    // marginBottom: 10,
    alignItems: "center",
    width: '100%'
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'AvenirNextCyr-Medium'
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 1,
    },
    inputView: {
        // width: "100%",
        // borderWidth: 1,
        backgroundColor: "white",
        // borderRadius: 8,
        // height: '2%',
        // marginBottom: 20,
        // justifyContent: "center",
        padding: 5,
        paddingLeft: 5,

    },
    inputView1: {
        width: "100%",
        // borderWidth: 1,
        // backgroundColor: "white",
        // borderRadius: 8,
        // height: 100,
        // marginBottom: 20,
        // justifyContent: "center",
        padding: 5,
        paddingLeft: 5,

    },
    inputText: {
        backgroundColor: 'white',
        // height: 50,
        color: "black",
        fontFamily: 'AvenirNextCyr-Medium',
    },
    inputText1: {
        fontFamily: 'AvenirNextCyr-Medium',
        color: "black",
        // height: 500,
    },
    addressInput: {
        // height: 100, // Adjust the height as needed for your design
    },
    userContainer: {
        // flexDirection:'row',
        backgroundColor: 'white',
        borderRadius: 5,
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
        // flex: 1
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
        padding: 16
        //borderColor: '#fff',
        //borderWidth: 0.5
    },
    ProductListContainer: {
        flex: 1,
        marginVertical: '4%',
    },
    imageView: {
        width: 80,
        height: 80,
        // borderRadius: 40,
        // marginTop: 20,
        // marginBottom: 10
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
    modalSearchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'lightgray',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
        flex: 1,
        height: 45
    },
    input: {
        flex: 1,
        fontSize: 16,
        marginRight: 10,
    },
    searchButton: {
        padding: 5,
    },
    detailContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: "2%",
        paddingVertical: '2%',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginHorizontal: "2%",
        justifyContent:'space-between',
      

    },
    pageIndicator: {
        // textAlign: 'flex-end',
        marginBottom: 1,
        fontSize: 14,
        fontFamily: "AvenirNextCyr-Medium",
        textAlign: 'right',
        paddingRight: '3%'
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
      NextPrevBtn: {
        // padding: 3,
        // borderRadius: 5,
        width: '100%'
        // backgroundColor: Colors.primary,
        // paddingHorizontal: "6%",
      },
      rowContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "2%",
      },addImageIndicator: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: Colors.primary,
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },addImageText: {
        color: 'white',
        fontSize: 16,
        lineHeight: 24,
    },
     
})