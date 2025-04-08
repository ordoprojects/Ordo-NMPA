import React from 'react'
import { FlatList, Text, View, ActivityIndicator } from 'react-native'
import Colors from '../../constants/Colors'


const Credit = ({ creditNotes, renderItem, loading }) => {
    data = []
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {loading ? (
                <ActivityIndicator size="large" color={Colors.primary} />
            ) : (
                <FlatList
                    data={creditNotes}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={() => (
                        <View>
                            <Text>No Credit Notes</Text>
                        </View>
                    )}
                />
            )}
        </View>
    )
}

export default Credit
