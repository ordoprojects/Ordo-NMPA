// @@ -0,0 +1,51 @@
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Colors from '../../constants/Colors';


const ActivityDetails = ({ route, navigation }) => {
    const { activity } = route.params;

    return (
        <View style={styles.container}>
            <View style={{flexDirection:'row', gap:10}}>

                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <AntDesign name='arrowleft' size={25} color={Colors.black} />
                </TouchableOpacity>
                <Text style={styles.title}>Activity Details</Text>
            </View>

            <Text style={styles.text}><Text style={{fontFamily:'AvenirNextCyr-Medium', color:'black'}}>Customer Name :</Text>  {activity.account_name}</Text>
            <Text style={styles.text}><Text style={{fontFamily:'AvenirNextCyr-Medium', color:'black'}}>Product Name :</Text> {activity.name}</Text> 
            <Text style={styles.text}><Text style={{fontFamily:'AvenirNextCyr-Medium', color:'black'}}>Module:</Text> {activity.module}</Text>
            <Text style={styles.text}><Text style={{fontFamily:'AvenirNextCyr-Medium', color:'black'}}>Date Entered:</Text> {activity.date_entered}</Text>
            <Text style={styles.text}><Text style={{fontFamily:'AvenirNextCyr-Medium', color:'black'}}>Sold quantity:</Text> {activity.sold_qty}</Text>
            <Text style={styles.text}><Text style={{fontFamily:'AvenirNextCyr-Medium', color:'black'}}>Price: </Text>{activity.retail_price}</Text>
            <Text style={styles.text}><Text style={{fontFamily:'AvenirNextCyr-Medium', color:'black'}}>Stock on hand:</Text> {activity.stock_on_hand}</Text>
            <Text style={styles.text}><Text style={{fontFamily:'AvenirNextCyr-Medium', color:'black'}}>Summary of Visit:</Text>{activity.summary_of_visit}</Text>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    title: {
        fontSize: 18,
        fontFamily: 'AvenirNextCyr-Medium',
        color: 'black',
        marginBottom: 10,
    },
    text: {
        fontSize: 16,
        fontFamily: 'AvenirNextCyr-Thin',
        color: '#696969',
        marginBottom: 10,
    },
});

export default ActivityDetails;