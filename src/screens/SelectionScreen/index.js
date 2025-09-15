import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { RadioButton } from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Colors from '../../constants/Colors';
import { useNavigation } from '@react-navigation/native';
import { useRole } from '../../Context/RoleContext';
import { BASE_URL } from '../../navigation/Config';
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next'; // Add this import
import { SafeAreaView } from 'react-native-safe-area-context';

const SelectionScreen = ({ route }) => {
  const [selectedOption, setSelectedOption] = useState('user');
  const [isLoading, setIsLoading] = useState(false);
  const { setRole } = useRole();
  const { tempToken, email } = route.params;
  const navigation = useNavigation();
  const { t } = useTranslation(); // Add this hook

  console.log("tempToken", tempToken);

  const handleRoleSelection = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/auth/select-role/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          temp_token: tempToken,
          selected_role: selectedOption
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || t('role_selection_failed'));
      }

      // JWT Decoding function
      const decodeJWT = (token) => {
        try {
          const [, payload] = token.split('.');
          if (!payload) throw new Error('Invalid token format');
          const decoded = Buffer.from(payload, 'base64').toString('utf-8');
          return JSON.parse(decoded);
        } catch (error) {
          console.error('JWT decode error:', error);
          throw new Error('Failed to process user data');
        }
      };

      const userData = decodeJWT(data.token);
      console.log('Decoded user data:', userData);

      if (!userData?.user_id) {
        throw new Error('Invalid user data in token');
      }

      // Prepare and store auth data
      const authData = {
        token: data.token,
        user: {
          id: userData.user_id,
          firstName: userData.first_name,
          lastName: userData.last_name,
          role: selectedOption,
          email: email
        },
        expiresAt: userData.exp * 1000
      };

      // Save to AsyncStorage
      await AsyncStorage.setItem('authData', JSON.stringify(authData));
      
      // Update role context
      setRole(selectedOption);
      
      // Translated success message with role interpolation
      Toast.show(t('logged_in_as', { role: t(selectedOption) }), Toast.LONG);
      
      // Navigate to Main screen and reset stack
      navigation.reset({
        index: 0,
        routes: [{ name: 'Main' }]
      });

    } catch (error) {
      console.error('Role selection error:', error);
      Toast.show(error.message || t('failed_to_select_role'), Toast.LONG);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name='arrowleft' size={25} color={Colors.black} />
        </TouchableOpacity>
        <Text style={styles.title}>{t('select_role')}</Text>
      </View>

      {/* Main Content */}
      <ScrollView contentContainerStyle={styles.content}>
        {/* User Option */}
        <TouchableOpacity 
          style={[
            styles.optionContainer,
            selectedOption === 'user' && styles.optionContainerSelected
          ]}
          onPress={() => setSelectedOption('user')}
        >
          <RadioButton
            value="user"
            status={selectedOption === 'user' ? 'checked' : 'unchecked'}
            onPress={() => setSelectedOption('user')}
            color="#111418"
          />
          <Text style={styles.optionText}>{t('user')}</Text>
        </TouchableOpacity>
        
        {/* Doctor Option */}
        <TouchableOpacity 
          style={[
            styles.optionContainer,
            selectedOption === 'doctor' && styles.optionContainerSelected
          ]}
          onPress={() => setSelectedOption('doctor')}
        >
          <RadioButton
            value="doctor"
            status={selectedOption === 'doctor' ? 'checked' : 'unchecked'}
            onPress={() => setSelectedOption('doctor')}
            color="#111418"
          />
          <Text style={styles.optionText}>{t('doctor')}</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Footer with Continue Button */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.continueButton}
          onPress={handleRoleSelection}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.continueButtonText}>{t('continue')}</Text>
          )}
        </TouchableOpacity>
        <View style={styles.footerSpacer} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',

  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: '10%',
    paddingTop: 16,
    paddingHorizontal: 16,

  },
  backButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    color: '#0d141c',
    fontSize: 24,
  },
  title: {
    flex: 1,
    color: '#0d141c',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginRight: '10%',
  },
  headerSpacer: {
    width: 48,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 20,

  },
  loginTitle: {
    color: '#111418',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,

  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#dbe0e6',
    padding: 15,
    marginBottom: 12,
    
  },
  optionContainerSelected: {
    borderColor: '#111418',
  },
  optionText: {
    color: '#111418',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 16,
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  continueButton: {
    backgroundColor: Colors.darkBlue,
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 84,
    maxWidth: 480,
    width: '100%',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footerSpacer: {
    height: 20,
    backgroundColor: '#fff',
  },
});

export default SelectionScreen;