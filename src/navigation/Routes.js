import React, { useContext, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './AuthStack';
import AppStack from './AppStack';
import { AuthContext } from '../Context/AuthContext';
import { ActivityIndicator, Text, View } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { navigationRef } from './RootNavigation';
import * as RootNavigation from './RootNavigation.js';
export default function Routes() {
    //context value
    const { isLoading, token, splashScreen } = useContext(AuthContext);

    //activity loader scrren method
    if (isLoading) {
        return (
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
            }} >
                <ActivityIndicator size={'large'} />
            </View>
        );
    }

    // if (splashScreen) {
    //     return (
    //         <View style={{
    //             flex: 1,
    //             justifyContent: 'center',
    //             alignItems: 'center'
    //         }} >
    //             <Text>Loading ! Please wait...</Text>
    //         </View>
    //     );
    // }


    return (
        <NavigationContainer >
            {token == null ? <AuthStack /> : <AppStack />}
        </NavigationContainer>
    );
}