import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Colors from '../../constants/Colors';

const CustomerDetail = ({ navigation, route }) => {
    const { item } = route.params;
console.log("cust",item)
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <AntDesign name="arrowleft" size={25} color={Colors.black} />
                </TouchableOpacity>
                <Text style={styles.title}>Customer Details</Text>
                <Text style={styles.title}>   </Text>

            </View>
            <View style={styles.profileContainer}>
            {item?.profile_picture ? (
        <Image
          //source={require('../../assets/images/account.png')}
          source={{ uri: item?.profile_picture }}
          style={{ ...styles.profileImage }}
        />) : (
        <Image
          source={require('../../assets/images/doctor.jpg')}
          style={{ ...styles.profileImage }}
        />
      )}
                <Text style={styles.profileText}>{item.name}</Text>
            </View>
            <View style={styles.detailContainer}>
                <Text style={styles.label}>Name:</Text>
                <Text style={styles.text}>{item.name}</Text>
            </View>
            <View style={styles.detailContainer}>
                <Text style={styles.label}>Phone:</Text>
                <Text style={styles.text}>{item.phone}</Text>
            </View>
            <View style={styles.detailContainer}>
                <Text style={styles.label}>Email:</Text>
                <Text style={styles.text}>{item.email}</Text>
            </View>

            <View style={styles.detailContainer}>
                <Text style={styles.label}>Street :</Text>
                <Text style={styles.text}>{item.client_address}</Text>
            </View>

            <View style={styles.detailContainer}>
                <Text style={styles.label}>State:</Text>
                <Text style={styles.text}>{item.state}</Text>
            </View>

            <View style={styles.detailContainer}>
                <Text style={styles.label}>Postal Code:</Text>
                <Text style={styles.text}>{item.postal_code}</Text>
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
        color: Colors.primary
    },
    profileContainer: {
        alignItems: 'center',
        marginTop: '3%',
    },
    profileImage: {
        width: 110,
        height: 110,
        borderRadius: 60,
        backgroundColor: 'lightgray',
        paddingHorizontal: '3%',
        paddingVertical: '3%',
        borderWidth:1,
        borderColor:'gray',
        resizeMode:'contain'
    },
    profileText: {
        marginTop: '3%',
        fontSize: 23,
        fontWeight: 'bold',
        marginVertical: "3%", 
        color: Colors.primary
    },
    detailContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: "6%",
        paddingVertical: '3%',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
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

export default CustomerDetail;
