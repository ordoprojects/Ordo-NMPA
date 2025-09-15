import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Colors from '../../constants/Colors';
import { BASE_URL } from '../../navigation/Config';
import Toast from 'react-native-simple-toast';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../../components/LanguageSelector';
import AntDesign from 'react-native-vector-icons/AntDesign';

const VerifyAadharScreen = () => {
  const [aadharLastFour, setAadharLastFour] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const { t } = useTranslation();

  const handleVerifyAadhar = async () => {
    if (!aadharLastFour || aadharLastFour.length !== 4) {
      Toast.show(t('validation_aadhar_last_four'), Toast.LONG);
      return;
    }

    setIsLoading(true);

    try {
      // In a real app, you would make an API call to verify the Aadhar
      // For demonstration, we'll simulate a successful verification
      // const response = await fetch(`${BASE_URL}/auth/verify-aadhar/`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     aadhar_last_four: aadharLastFour
      //   }),
      // });
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, we'll assume verification is successful
      // In a real app, you would check the response
      navigation.navigate('Reset', { aadharLastFour });
    } catch (error) {
      console.error('Aadhar verification error:', error);
      Toast.show(t('aadhar_verification_failed'), Toast.LONG);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
       <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                      <AntDesign name='arrowleft' size={25} color={Colors.black} />
                    </TouchableOpacity>
          </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.title}>{t('verify_aadhar')}</Text>
          <Text style={styles.subtitle}>{t('enter_last_four_aadhar')}</Text>

          <View style={styles.aadharDisplay}>
            <Text style={styles.aadharMasked}>XXXX XXXX </Text>
            <TextInput
              style={styles.aadharInput}
              placeholder="1234"
              value={aadharLastFour}
              onChangeText={setAadharLastFour}
              keyboardType="numeric"
              maxLength={4}
            />
          </View>

          <TouchableOpacity 
            style={styles.button} 
            onPress={handleVerifyAadhar}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? t('verifying') : t('verify')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  title: {
    color: Colors.darkBlue,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    color: '#607a8a',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  aadharDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  aadharMasked: {
    fontSize: 20,
    color: '#607a8a',
    fontWeight: '500',
  },
  aadharInput: {
    width: 80,
    height: 50,
    borderWidth: 1,
    borderColor: '#dbe2e6',
    borderRadius: 8,
    padding: 15,
    fontSize: 18,
    color: Colors.darkBlue,
    backgroundColor: '#fff',
    textAlign: 'center',
    fontWeight: '500',
  },
  button: {
    width: '100%',
    height: 48,
    backgroundColor: Colors.darkBlue,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  languageSelectorContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1000,
  },
    header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: '10%',
    paddingTop: 16,
    paddingHorizontal: 16,

  },
});

export default VerifyAadharScreen;