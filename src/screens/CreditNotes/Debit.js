import React from 'react'
import { FlatList, Text, View, ActivityIndicator } from 'react-native'
import Colors from '../../constants/Colors'

const Debit = ({ debitNotes, renderItem, loading }) => {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {loading ? (
                <ActivityIndicator size="large" color={Colors.primary} />
            ) : (
                <FlatList
                    data={debitNotes}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={() => (
                        <View style={{ padding: 20, alignItems: 'center' }}>
                            <Text>No Debit Notes</Text>
                        </View>
                    )}
                />
            )}
        </View>
    )
}

export default Debit
