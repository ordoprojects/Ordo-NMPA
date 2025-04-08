/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image
} from 'react-native';
import Timeline from 'react-native-timeline-flatlist'
import Colors from '../../constants/Colors';

const SMApprovedPlanDetails = () => {
    const [data, setData] = useState([
        {
            time: '07-07-23',
            title: 'Walmart',
            purpose: 'Secondary Offtake',
            description: 'The Beginner Archery and Beginner Crossbow course does not require you to bring any equipment, since everything you need will be provided for the course. ',
        },
        {
            time: '07-08-23',
            title: 'EG',
            purpose: 'Secondary Offtake',
            description: 'Badminton is a racquet sport played using racquets to hit a shuttlecock across a net.',

        },
        {
            time: '07-09-23',
            title: 'Fanatasy Book Store',
            purpose: 'Secondary Offtake',
            description: 'Badminton is a racquet sport played using racquets to hit a shuttlecock across a net.',
        },
        {
            time: '07-12-23',
            title: 'Watch Soccer',
            purpose: 'Secondary Offtake',
            description: 'Team sport played between two teams of eleven players with a spherical ball. ',

        },

    ])

    const  renderDetail = (rowData, sectionID, rowID) => {
        let title = <Text style={[styles.title]}>{rowData.title}</Text>
        var desc = null
        if (rowData.description)
            desc = (
                <View style={styles.descriptionContainer}>
                    <Text style={{ fontSize: 13, fontFamily: 'AvenirNextCyr-Thin' }}>{rowData.purpose}</Text>
                    <Text style={{ fontSize: 12, fontFamily: 'Poppins-Italic', color: 'grey' }}>{rowData.description}</Text>
                </View>
            )

        return (
            <View style={{ flex: 1 }}>
                {title}
                {desc}
            </View>
        )
    }
    
    return (
        <View style={styles.container}>
        <Timeline
            style={styles.list}
            data={data}
            circleSize={20}
            circleColor='rgba(0,0,0,0)'
            lineColor={Colors.primary}
            timeContainerStyle={{ minWidth: 80, }}
            timeStyle={{ textAlign: 'center', backgroundColor: Colors.primary, color: 'white', padding: 5, borderRadius: 4 }}
            options={{
                style: { paddingTop: 5 }
            }}
            innerCircle={'icon'}
            renderDetail={renderDetail}
            iconDefault={require('../../assets/images/ordologo.png')}
        />
    </View>

    )
}

export default SMApprovedPlanDetails

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 65,
        backgroundColor: 'white'
    },
    list: {
        flex: 1,
        marginTop: 20,
    },
    title: {
        marginTop: -10,
        fontSize: 14,
        fontFamily: 'AvenirNextCyr-Medium',
        color: 'black'
        //fontWeight:'500'
    },
    descriptionContainer: {
        //flexDirection: 'row',
        //paddingRight: 50
        //marginTop:5
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 25
    },
    textDescription: {
        marginLeft: 10,
        color: 'gray'
    }
});