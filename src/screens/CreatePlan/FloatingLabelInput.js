import React, { useState } from 'react';
import { View, TextInput, Animated, StyleSheet } from 'react-native';

const FloatingLabelInput = ({ label, value, onChangeText, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);
  const animatedValue = new Animated.Value(value === '' ? 0 : 1);
  const labelStyle = {
    position: 'absolute',
    left: 30,
    top: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [20, 0],
    }),
    fontSize: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [14, 12],
    }),
    color: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['#aaa', '#000'],
    }),
  };

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const handleTextChange = (text) => {
    onChangeText(text);
    animatedValue.setValue(text === '' ? 0 : 1);
  };

  return (
    <View style={styles.container}>
      <Animated.Text style={labelStyle}>{label}</Animated.Text>
      <TextInput
        {...props}
        style={styles.input}
        value={value}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChangeText={handleTextChange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 18,
  },
  input: {
    height: 40,
    width:'100%',
alignSelf:'center',    fontSize: 14,
    borderWidth: 1,
    // paddingLeft:20,
    // borderBottomColor: '#000',
    borderColor:'grey'
  },
});

export default FloatingLabelInput;