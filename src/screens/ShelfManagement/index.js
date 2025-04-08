import React, { useState } from 'react';
import { View, FlatList, Text, TouchableOpacity } from 'react-native';
import styles from './style'
import AntDesign from 'react-native-vector-icons/AntDesign';
import Colors from '../../constants/Colors';
import { navigate } from '../../navigation/RootNavigation';

const ShelfManagement = ({navigation}) => {
    const [products, setProducts] = useState([
        { id: 1, name: 'Product 1' },
        { id: 2, name: 'Product 2' },
        { id: 3, name: 'Product 3' },
        // Add more products here
    ]);

    const renderItem = ({ item }) => {
        return (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10, borderBottomColor: 'black', borderBottomWidth: 0.5, alignItems:'center' }}>
                <Text style={{ color: 'black', fontFamily: 'AvenirNextCyr-Medium' }}>{item.name}</Text>


                <TouchableOpacity style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }} onPress={()=>{navigation.navigate('AddProduct')}}>
                    <View
                        style={{ padding: 10, borderRadius: 5 }}
                    >
                        <Text style={{ color: 'black', fontFamily: 'AvenirNextCyr-Thin' }}>Choose</Text>
                    </View>
                    <AntDesign name='arrowright' size={25} color={Colors.black} />
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={{ flex: 1 }}>


            <View style={{ ...styles.headercontainer }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <AntDesign name='arrowleft' size={25} color={Colors.black} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Choose Product</Text>
                </View>



            </View>

            <View style={{ marginHorizontal: '5%', marginTop: '5%' }}>

                {/* <View style={{ marginBottom: '5%' }}><Text style={{ color: 'black', fontFamily:'AvenirNextCyr-Medium' , fontSize:18}}>Choose the product </Text></View> */}
                <FlatList
                    data={products}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                />
            </View>
        </View>
    );
};

export default ShelfManagement;


