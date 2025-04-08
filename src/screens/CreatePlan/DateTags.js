import React from 'react';
import { Text, View } from 'react-native';
import { format } from 'date-fns'; // Importing date-fns for formatting
import Colors from '../../constants/Colors';

const DateTags = ({ dates = [] }) => { // Defaulting dates to an empty array
    console.log("testttttt", dates);

    // Function to format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return format(date, 'd MMM yy'); // Formatting date as "4 Jun 2024"
    };

    // Limit the number of dates displayed
    const displayDates = dates.slice(0, 4);

    return (
        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginTop: '2%' }}>
            {displayDates.map((date, index) => (
                <View key={index} style={{ backgroundColor: 'rgba(142, 67, 144, 0.7)', paddingHorizontal: '2%', borderRadius: 20 }}>
                    <Text style={{ color: 'white', fontFamily: 'AvenirNextCyr-Medium' }}>
                        {formatDate(date)}
                    </Text>
                </View>
            ))}
            {dates.length > 4 && (
                <View style={{ backgroundColor: 'rgba(142, 67, 144, 0.7)', paddingHorizontal: '3%', borderRadius: 20 }}>
                    <Text style={{ color: 'white', fontFamily: 'AvenirNextCyr-Medium' }}>
                        ...
                    </Text>
                </View>
            )}
        </View>
    );
}

export default DateTags;
