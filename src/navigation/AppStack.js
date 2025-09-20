// src/navigation/AppStack.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import MedicineRequestScreen from '../screens/MedicineRequestScreen';
import ReferralRequestScreen from '../screens/ReferralRequestScreen';
import ReferralReview from '../screens/ReferralReview';
import MedicineReview from '../screens/MedicineReview';
import ReferralList from '../screens/ReferralList';
import MedicineRequestList from '../screens/MedicineRequestList';
import MedicineDetails from '../screens/MedicineDetails';
import ReferralDetails from '../screens/ReferralDetails';

const Stack = createStackNavigator();
const AppStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="MedicineRequest" component={MedicineRequestScreen} />
      <Stack.Screen name="ReferralRequest" component={ReferralRequestScreen} />
      <Stack.Screen name="ReferralReview" component={ReferralReview} />
      <Stack.Screen name="MedicineReview" component={MedicineReview} />
      <Stack.Screen name="ReferralList" component={ReferralList} />
      <Stack.Screen name="MedicineRequestList" component={MedicineRequestList} />
      <Stack.Screen name="MedicineDetails" component={MedicineDetails} />
      <Stack.Screen name="ReferralDetails" component={ReferralDetails} />










    </Stack.Navigator>
  );
};

export default AppStack;