import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { View, ScrollView, Text, Image, TextInput, Button, StyleSheet, Modal, TouchableOpacity, FlatList, RefreshControl, Alert} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign'
import Colors from '../../constants/Colors'
import { FAB } from 'react-native-paper';
import { AnimatedFAB, Snackbar } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import { hs, vs, ms } from '../../utils/Metrics';
import { AuthContext } from '../../Context/AuthContext';
import Toast from 'react-native-simple-toast';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { useIsFocused } from '@react-navigation/native';


const dummyUsers = [
  {
    id: 1,
    name: 'John Doe',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCg3ECfhNnwn30E2r5J-Sb2UphwWfflyqgeA&usqp=CAU',
    address: '123 Main St, City, Country',
    dob: 'January 1, 1990',
  },
  {
    id: 2,
    name: 'Jane Smith',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCg3ECfhNnwn30E2r5J-Sb2UphwWfflyqgeA&usqp=CAU',
    address: '456 Elm St, Town, Country',
    dob: 'February 15, 1985',
  },
  {
    id: 3,
    name: 'Alice Johnson',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCg3ECfhNnwn30E2r5J-Sb2UphwWfflyqgeA&usqp=CAU',
    address: '789 Oak St, Village, Country',
    dob: 'March 10, 1995',
  },
  {
    id: 4,
    name: 'Bob Wilson',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCg3ECfhNnwn30E2r5J-Sb2UphwWfflyqgeA&usqp=CAU',
    address: '101 Pine St, Hamlet, Country',
    dob: 'April 20, 1982',
  },
  {
    id: 5,
    name: 'Eva Davis',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCg3ECfhNnwn30E2r5J-Sb2UphwWfflyqgeA&usqp=CAU',
    address: '555 Cedar St, Town, Country',
    dob: 'May 5, 1998',
  },
  {
    id: 6,
    name: 'Lexi Rivera',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCg3ECfhNnwn30E2r5J-Sb2UphwWfflyqgeA&usqp=CAU',
    address: '555 Cedar St, Town, Country',
    dob: 'March 5, 2000',
  },

];


const UserMgmt = ({ navigation, animatedValue,
  visible,
  extended,
  label,
  animateFrom,
  style,
  iconMode, }) => {
  const [isAddingUser, setAddingUser] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserAddress, setNewUserAddress] = useState('');
  const [newUserDob, setNewUserDob] = useState('');
  const [isModalVisible2, setModalVisible2] = useState('');
  const [masterData, setMasterData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isExtended, setIsExtended] = useState(true);
  const { token, userData } = useContext(AuthContext);

  const [selectedItems, setSelectedItems] = useState([]);
  const [isSelectMode, setIsSelectMode] = useState(false);

  const [refreshing, setRefreshing] = React.useState(false);
  const [loading, setLoading] = useState(false);

  const [purchase, setPurchase] = useState([]);
  const [filteredPurchase, setFilteredPurchase] = useState([]);

  const [SnackBarVisible, setSnackBarVisible] = useState(false);
  const onToggleSnackBar = () => setSnackBarVisible(!SnackBarVisible);
  const onDismissSnackBar = () => setSnackBarVisible(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    // Clear selected items and exit selection mode when the screen gains focus
    if (isFocused) {
        if (isSelectMode) {
            setIsSelectMode(false);
            setSelectedItems([]); // Clear selected items array
        }
    }
}, [isFocused]);

  useEffect(() => {
    if (selectedItems.length === 0) {
      setIsSelectMode(false)
    }
  }, [selectedItems])

  // console.log("selected",selectedItems)

  const onItemLongPress = (item) => {
    if (!isSelectMode) {
      setIsSelectMode(true);
      //   setHeaderSelectMode();
      toggleItemSelection(item);
    }
  };

  const toggleItemSelection = (item) => {
    const isSelected = selectedItems.some((selectedItem) => selectedItem.id === item.id);

    if (isSelected) {
      // Item is selected, remove it from the selectedItems array
      const updatedSelection = selectedItems.filter((selectedItem) => selectedItem.id !== item.id);
      setSelectedItems(updatedSelection);
    } else {
      // Item is not selected, add it to the selectedItems array
      setSelectedItems([...selectedItems, item]);
    }
  };


  const onClearSelection = () => {
    setIsSelectMode(false);
    setSelectedItems([]);
  };


  // variables
  const snapPoints = useMemo(() => ['25%', '50%'], []);

  const onScroll = ({ nativeEvent }) => {
    const currentScrollPosition =
      Math.floor(nativeEvent?.contentOffset?.y) ?? 0;

    setIsExtended(currentScrollPosition <= 0);
  };

  const fabStyle = { [animateFrom]: 16 };


  const addUser = () => {
    // Handle adding a new user to the dummyUsers array with the input values.
    dummyUsers.push({
      id: dummyUsers.length + 1,
      name: newUserName,
      image: 'https://t4.ftcdn.net/jpg/02/29/75/83/360_F_229758328_7x8jwCwjtBMmC6rgFzLFhZoEpLobB6L8.jpg', // Example image
      address: newUserAddress,
      dob: newUserDob,
    });

    // Clear the input fields and close the modal
    setNewUserName('');
    setNewUserAddress('');
    setNewUserDob('');
    setAddingUser(false);
  }


  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getUsers();
    setRefreshing(false);

  }, []);


  useEffect(() => {
    getUsers();
  }, [])

  const getUsers = async () => {

    // setLoading(true);
    console.log("loading all product");
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${userData.token}`);

    console.log("dfsddfdsfds", userData.token)

    var raw = JSON.stringify();

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      // body: raw,
      redirect: 'follow'
    };


    // console.log("rawwwwww", raw)

    fetch("https://gsidev.ordosolution.com/api/ordo_users/", requestOptions)
      .then(response => response.json())
      .then(async result => {

        // console.log("testttttt", result)
        setMasterData(result)
        setFilteredData(result);
        // setLoading(false);

      })
      .catch(error => {
        // setLoading(false);
        console.log('error in get suppliers', error)
      });

  }

  const handleEdit = () => {
    if (selectedItems.length === 1) {
      // setIsSelectMode(false)
      selectedItems.forEach((item) => {
        navigation.navigate('AddUser', { screen: 'edit', userId: item.id })
      })
    }
  }

  const handleDelete = () => {
    Alert.alert(
      'Confirmation',
      'Are you sure you want to delete selected users?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => {
            setLoading(false);
          },
        },
        {
          text: 'OK',
          onPress: async () => {
            setLoading(true);

            const successfulDeletes = [];
            const failedDeletes = [];

            // Use Promise.all to perform parallel deletion requests
            await Promise.all(
              selectedItems.map(async (item) => {
                const deleteUrl = `https://gsidev.ordosolution.com/api/ordo_users/${item.id}/`;

                try {
                 
                  const response = await fetch(deleteUrl, {
                    method: 'DELETE',
                    headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${userData.token}`,
                    },
                    redirect: 'follow',
                  });

                  if (response.status === 204) {
                    // Successful deletion
                    successfulDeletes.push(item.id);
                  } else {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                  }
                } catch (error) {
                  // Error in deletion
                  console.error('Error in delete supplier', error);
                  failedDeletes.push(item.id);
                }
              })
            );

            setLoading(false);

            if (failedDeletes.length > 0) {
              // Some deletions failed
              Alert.alert(
                'Error',
                'One or more deletions failed. Please try again.',
                [{ text: 'OK', onPress: () => { onClearSelection(); } }]
              );
            } else {
              // All deletions were successful
              Toast.show('User edited successfully', Toast.LONG);
              getUsers();
              onClearSelection();
            }
          },
        },
      ],
      { cancelable: false }
    );

  };


  const renderItem = ({ item }) => {
    const isSelected = selectedItems.some((selectedItem) => selectedItem.id === item.id);

    return (
      <TouchableOpacity style={[styles.userContainer, { backgroundColor: isSelected ? 'rgba(158, 78, 126, 0.61)' : 'white' }]} key={item.id}

        onPress={() => {
          // Handle regular item press
          if (isSelectMode) {
            // If in select mode, toggle selection
            toggleItemSelection(item);
          } else {
            // Handle regular item press (navigate to details, etc.)
            // navigation.navigate('ChooseProducts', { supplierName: item.name, id: item.id });
            navigation.navigate('UserDetails', { item });
            // console.log(item)
          }
        }}
        onLongPress={() => onItemLongPress(item)}

      >
        {/* <View>
          <Image source={{ uri: item.profile_image }} style={styles.image} />
        </View> */}

        <View
          style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end' }}
        >
         {item?.profile_image ? (
                  <Image
                    //source={require('../../assets/images/account.png')}
                    source={{ uri: item?.profile_image }}
                    style={{ ...styles.image }}
                  />
                ) : (
                  <Image
                    source={require("../../assets/images/UserMgmt.png")}
                    style={{ ...styles.image }}
                  />
                )}
          {isSelected && <View style={{ position: 'absolute', right: 0 }}>
            <AntDesign name='checkcircle' size={23} color='white' />
          </View>}
        </View>

        <View style={styles.userInfo}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.detail}><Text style={{ fontFamily: 'AvenirNextCyr-Medium' }}></Text>{item.username}</Text>
          <Text style={styles.detail}><Text style={{ fontFamily: 'AvenirNextCyr-Medium' }}></Text>{item.location}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient colors={Colors.linearColors}
      start={Colors.start}end={Colors.end}
      locations={Colors.location}
      style={{ backgroundColor: Colors.primary, borderColor: Colors.primary, justifyContent: 'center', alignItems: 'center', flex: 1 }}
    >
      {isSelectMode ? (
        <View style={[styles.headercontainer, { justifyContent: 'space-between' }]}>


          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={onClearSelection} style={{ paddingLeft: 10 }}>
              <AntDesign name="close" size={25} color="white" style={{ marginRight: 15 }} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{selectedItems.length}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
            {selectedItems.length == 1 && <TouchableOpacity onPress={handleEdit}>
              <AntDesign name='edit' size={25} color='white' />
            </TouchableOpacity>}
            <TouchableOpacity onPress={handleDelete}>
              <AntDesign name='delete' size={25} color='white' />
            </TouchableOpacity>

          </View>
        </View>

      ) : (<View style={{ ...styles.headercontainer,  justifyContent: 'space-between'  }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingLeft: 10 }}>
                    <Image source={require('../../assets/images/Refund_back.png')} style={{ height: 30, width: 30 }} />
                </TouchableOpacity>
        <Text style={styles.headerTitle}>User Management</Text>
        <Text style={styles.headerTitle}>    </Text>
       
      </View>)
      }


      <View style={{ height: '90%', backgroundColor: '#f5f5f5', width: '100%', borderTopEndRadius: 50, borderTopStartRadius: 50, padding: 20 }} >

        <FlatList
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          data={filteredData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          onScroll={onScroll}
        />
      </View>


      <Modal
        visible={isModalVisible2}
        animationType="fade"
        transparent={true}

      >
        {/* Misc Task Modal */}
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)', }}>
          <View style={{ backgroundColor: 'white', padding: 20, width: '90%', marginHorizontal: 10, borderRadius: 10, elevation: 5 }}>
            {/* new */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
              <Text style={{ ...styles.modalTitle, color: Colors.primary }}>Add User</Text>
              <TouchableOpacity
                onPress={() => setModalVisible2(false)}>
                <AntDesign name='close' size={20} color={`black`} />
              </TouchableOpacity>
            </View>


            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 1 }}>
                <Text style={{ ...styles.modalTitle, marginBottom: 5 }}>Name</Text>
                <TextInput style={styles.cNameTextInput} placeholder='Name'
                // onChangeText={text => setMTask(text)}
                />
              </View>


            </View>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 1 }}>
                <Text style={{ ...styles.modalTitle, marginBottom: 5 }}>Email</Text>
                <TextInput style={styles.cNameTextInput} placeholder='Email'
                // onChangeText={text => setMTask(text)}
                />
              </View>

            </View>
            <View>
              <Text style={styles.modalTitle}>Upload Image</Text>
              <View style={{ ...styles.buttonview, alignItems: 'center' }}>
                <TouchableOpacity style={{ ...styles.photosContainer, paddingTop: 8 }}
                // onPress={checkPermission}
                >
                  <AntDesign name='camera' size={25} color={Colors.white} />

                </TouchableOpacity>
                <TouchableOpacity style={styles.photosContainer}
                // onPress={handleGallery}
                >
                  <Text style={styles.buttonText}>Gallery</Text>
                </TouchableOpacity>
              </View>

            </View>

            <Text style={styles.modalTitle}>Address</Text>
            {/* new */}
            <TextInput
              multiline={true}
              numberOfLines={10}
              placeholder="Enter Address..."
              style={styles.textarea}
            // onChangeText={(val) => { setMRemarks(val) }}
            //onChangeText={(text) => this.setState({ text })}
            // value={mRemarks}
            />

            <View>
              <Text style={{ ...styles.modalTitle, marginBottom: 5, marginTop: 10 }}>Date Of Birth</Text>
              <TextInput style={styles.cNameTextInput} placeholder='DOB'
              // onChangeText={text => setMTask(text)}
              />
            </View>


            <View style={styles.buttonview}>
              <TouchableOpacity style={styles.buttonContainer} o>
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
              {/* <TouchableOpacity style={styles.buttonContainer} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity> */}
            </View>
          </View>
        </View>
      </Modal>


      <AnimatedFAB
        label={'Add User    '}
        icon={name = "plus"}
        color={"white"}
        style={styles.fabStyle}
        // borderWidth={50}
        // borderRadius={50}

        fontFamily={'AvenirNextCyr-Thin'}
        extended={isExtended}

        // onPress={() => console.log('Pressed')}
        visible={visible}
        animateFrom={'right'}
        iconMode={'static'}
        onPress={() => {
          navigation.navigate('AddUser', { screen: 'add' })

        }}
      />


      <Snackbar
        visible={SnackBarVisible}
        onDismiss={onDismissSnackBar}
        style={{ backgroundColor: 'white' }}
        duration={3000}
      >
        <Text style={{ fontFamily: 'AvenirNextCyr-Thin' }}>
          User Deleted successfully !
        </Text>
      </Snackbar>

    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    // backgroundColor:'white'

  },

  userContainer: {
    flexDirection: 'row',
    // backgroundColor: 'red',
    borderRadius: 20,
    // width:'95%',
    justifyContent: 'center',
    alignItems: 'center',
    // borderWidth: 1,
    // borderColor: Colors.primary, // You can replace this with the desired border color
    padding: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // elevation: 5,
    // flex: 1
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 50,
    // marginRight: 16,
  },
  userInfo: {
    flex: 1,
    marginTop: 5,
    marginLeft: 15
  },
  name: {
    color: Colors.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  detail: {
    fontSize: 14,
  },
  button: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: Colors.primary,
    // marginBottom: 10,
    marginTop: 5
  },
  btnText: {
    fontFamily: 'AvenirNextCyr-Medium',
    color: '#fff',
    fontSize: 18,
  },
  cNameTextInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#B3B6B7',
    padding: 5,
    fontFamily: 'AvenirNextCyr-Thin',
    marginBottom: 10
  },
  modalTitle: {
    fontSize: 16,
    color: 'black',
    fontFamily: 'AvenirNextCyr-Medium'
  },
  buttonview: {
    flexDirection: 'row'
  },
  buttonContainer: {
    height: 40,
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
    fontFamily: 'AvenirNextCyr-Thin',
    color: 'white'
  },
  textarea: {
    borderWidth: 0.5,
    borderColor: 'black',
    //margin: 15,
    marginTop: 8,
    borderRadius: 5,
    padding: 10,
    fontSize: 14,
    fontFamily: 'AvenirNextCyr-Thin',
    textAlignVertical: 'top',
    color: '#000'
  },
  imgStyle: {
    width: 90,
    height: 90,
    resizeMode: 'cover',
    borderRadius: 8,
    //marginRight: 8, muliplr img style
    marginTop: 5,
    marginBottom: 5

  },
  photosContainer: {
    height: 40,
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
    backgroundColor: Colors.primary,
    marginRight: 10
  },
  fab: {
    borderRadius: 50,

    position: 'absolute',
    margin: 20,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.primary,
    fontFamily: 'AvenirNextCyr-Thin',
  },
  fabStyle: {
    position: 'absolute',
    margin: 20,
    right: '0%',
    bottom: 10,
    backgroundColor: Colors.primary,

    // fontFamily: 'AvenirNextCyr-Thin',
  },

  headercontainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    //backgroundColor:'red',
    flexDirection: 'row',
    alignItems: 'center',
    height:'10%',
    //backgroundColor:'red'
    justifyContent: 'center',
    width: '100%'

  },

  headerTitle: {
    fontSize: 18,
    fontFamily: 'AvenirNextCyr-Medium',
    color: 'white',
    // marginLeft: 10,
  },
});

export default UserMgmt;
