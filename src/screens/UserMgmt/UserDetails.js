import {React,useState} from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity,FlatList ,Pressable} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Colors from '../../constants/Colors';
import { Searchbar, Checkbox, RadioButton } from "react-native-paper";

const UserDetails = ({ navigation, route }) => {
    const { item } = route.params;
    console.log("user detail",item)
    const [selectedItems, setSelectedItems] = useState([]);

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
      

    return (
        <View style={styles.container}>
        <View>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <AntDesign name="arrowleft" size={25} color={Colors.black} />
                </TouchableOpacity>
                <Text style={styles.title}>User Details</Text>
                <Text style={styles.title}>          </Text>

            </View>
            <View style={styles.profileContainer}>
                <Image
                    source={item.profile_image ? { uri: item.profile_image } : require('../../assets/images/UserAvatar.png')}
                    style={styles.profileImage}
                />

                <Text style={styles.profileText}>{item.name}</Text> 
            </View>
            <View style={styles.detailContainer}>
                <Text style={styles.label}>Designation:</Text>
                <Text style={styles.text}>{item.designation}</Text>
            </View>

            <View style={styles.detailContainer}>
                <Text style={styles.label}>Region:</Text>
                <Text style={styles.text}>{item.region}</Text>
            </View>
            <View style={styles.detailContainer}>
                <Text style={styles.label}>Email:</Text>
                <Text style={styles.text}>{item.email}</Text>
            </View>
            </View>

            <View>
            <Text style={{ color: 'black', fontFamily: 'AvenirNextCyr-Bold', fontSize: 20,marginVertical:'2%',marginHorizontal:'3%' }}>Access and Permission</Text>
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
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: '4%',
        paddingHorizontal: '4%',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        justifyContent:'space-between'
    },
    backButton: {
        marginRight: '3%',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black'
        // color: Colors.primary
    },
    profileContainer: {
        alignItems: 'center',
        marginTop: '2%',
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 60,
        backgroundColor: 'lightgray',
        paddingHorizontal: '3%',
        paddingVertical: '3%'
    },
    profileText: {
        marginTop: '1%',
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: "3%",
        color: Colors.primary
    },
    detailContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: "2%",
        paddingVertical: '2%',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginHorizontal: "2%",

    },
    label: {
        flex: 1,
        fontWeight: 'bold',
        color: Colors.primary
    },
    text: {
        flex: 2,
        fontSize: 16,
    },
});

export default UserDetails;
