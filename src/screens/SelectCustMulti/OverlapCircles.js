import React from 'react';
import { Text, View } from 'react-native';
import { format } from 'date-fns'; // Importing date-fns for formatting
import Colors from '../../constants/Colors';

const OverlapCircles = ({ dates = [] }) => {
    // Function to format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return format(date, 'd'); // Formatting date as "04"
    };

    // Limit the number of dates displayed (4 for circles, 1 for overflow)
    const displayDates = dates.slice(0, 4);

    const colorArray = ['#607D8B', '#C6A0D8', '#C289AF', '#2E8B57']; // Array of different colors

    return (
        <View style={{ marginVertical: '2%', flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ position: 'relative', height: 40 }}>
                {displayDates.map((date, index) => {
                    const overlapOffset = index * 25; // Adjust for desired overlap amount

                    return (
                        <View
                            key={index}
                            style={{
                                backgroundColor: colorArray[index % colorArray.length],
                                paddingHorizontal: '2%',
                                borderRadius: 40,
                                position: 'absolute', // Overlap using absolute positioning
                                height: 40,
                                width: 40,
                                justifyContent: 'center',
                                alignItems: 'center',
                                left: overlapOffset, // Apply horizontal overlap offset
                            }}
                        >
                            <Text style={{ color: 'white', fontFamily: 'AvenirNextCyr-Medium' }}>
                                {formatDate(date)}
                            </Text>
                        </View>
                    );
                })}
            </View>
            {dates.length > 4 && (
                <View style={{ marginLeft: 30 * displayDates.length, justifyContent: 'center', height: 40 }}>
                    <Text style={{ color: 'black', fontFamily: 'AvenirNextCyr-Medium' }}>
                        + {dates.length - 4} more...
                    </Text>
                </View>
            )}
        </View>
    );
};

export default OverlapCircles;
