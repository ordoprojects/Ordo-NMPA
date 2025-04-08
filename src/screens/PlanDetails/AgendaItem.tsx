import isEmpty from 'lodash/isEmpty';
import React, { useCallback } from 'react';
import { StyleSheet, Alert, View, Text, TouchableOpacity, Button, Image } from 'react-native';
import testIDs from './testIDs';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';



interface ItemProps {
    item: any;
    navigation: any;
}

const AgendaItem = (props: ItemProps) => {
    const { item, navigation } = props;

    const handleAccountPress = useCallback(() => {

        if (item?.status == "Pending") {
            return;
        }
        navigation.navigate('VisitSummary', { item })
    }, []);



    if (isEmpty(item)) {
        return (
            <View style={styles.emptyItem}>
                <Text style={styles.emptyItemText}>No Events Planned Today</Text>
            </View>
        );
    }


    const CustomColor = item.status == "Pending" ? 'orange' : 'green';

    return (
        <TouchableOpacity onPress={handleAccountPress} style={styles.item} testID={testIDs.agenda.ITEM}>
            <View>
                <Image style={{ height: 50, width: 50, resizeMode: 'contain', borderRadius: 50, borderWidth: 1, borderColor: 'gray', }} source={{ uri: item?.account_profile_pic }} />
            </View>

            <View style={{ flex: 1 }}>
                <Text style={styles.itemTitleText}>{item.account_name}-{item.account_id}</Text>
                <Text style={[styles.itemStatusText, { fontSize: 14, color: 'grey' }]}>{item.client_address}</Text>
            </View>


            <View style={styles.itemButtonContainer}>
                <Text style={[styles.itemStatusText, { color: CustomColor, fontSize: 13 }]}>{item.status}</Text>
                {item.status == "Pending" ? (<MaterialCommunityIcons name="timer-sand" size={23} color={CustomColor} />) : (<Feather name="check-circle" size={23} color={CustomColor} />)}
            </View>
        </TouchableOpacity>
    );
};

export default React.memo(AgendaItem);


const styles = StyleSheet.create({
    item: {
        padding: '4%',
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: 'lightgrey',
        flexDirection: 'row'
    },
    itemTitleText: {
        color: 'black',
        marginLeft: 16,
        fontSize: 16,
        fontFamily: 'AvenirNextCyr-Bold'
    },

    itemStatusText: {
        color: 'black',
        marginLeft: 16,
        fontSize: 16,
        fontFamily: 'AvenirNextCyr-Medium'
    },
    itemButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2
    },
    emptyItem: {
        paddingLeft: 20,
        height: 52,
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'lightgrey'
    },
    emptyItemText: {
        color: 'lightgrey',
        fontSize: 14
    }
});