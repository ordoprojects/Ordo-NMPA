import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
// import stripe from 'react-native-stripe-sdk';

const StripePayment = () => {
  const handlePayment = async () => {
    try {
      const token = await stripe.createTokenWithCard({
        number: '4242424242424242',
        expMonth: 12,
        expYear: 25,
        cvc: '123',
      });

      // In a real app, you would send this token to your backend to process the payment.
      // Here, we simulate a successful payment.
      if (token) {
        Alert.alert('Payment Successful', 'Your payment was successful!');
      } else {
        Alert.alert('Payment Failed', 'Something went wrong with your payment.');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={handlePayment}>
        <Text>Make Dummy Payment</Text>
      </TouchableOpacity>
    </View>
  );
};

export default StripePayment;
