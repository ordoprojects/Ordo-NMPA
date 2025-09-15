import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CustomQRCode = ({ value, size = 70 }) => {
  // This is a placeholder for a real QR code
  // In a production app, you would use a proper QR code generator
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <View style={styles.qrPlaceholder}>
        <Text style={styles.qrText}>QR Code</Text>
        <Text style={styles.valueText}>
          {value ? `${value.substring(0, 15)}...` : 'Loading...'}
        </Text>
      </View>
      <Text style={styles.label}>Scan for details</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
  },
  qrText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333',
  },
  valueText: {
    fontSize: 8,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },
  label: {
    fontSize: 10,
    marginTop: 4,
    color: '#111518',
    fontWeight: '500',
  },
});

export default CustomQRCode;