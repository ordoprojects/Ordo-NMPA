// src/navigation/BottomTabNavigator.js
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import RequestsScreen from '../screens/RequestHistoryScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Colors from '../constants/Colors';
import DoctorRequestHistory from '../screens/DoctorRequestHistory';
import { useRole } from '../Context/RoleContext';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  const { role } = useRole();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  console.log('Bottom inset:', insets.bottom);
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'History') {
            iconName = 'history';
          } else if (route.name === 'Profile') {
            iconName = 'person';
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: Colors.darkBlue,
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          paddingBottom: insets.bottom > 0 ? insets.bottom : 10,
height: 60 + (insets.bottom > 0 ? insets.bottom : 10),
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: t('home') }}
      />
      <Tab.Screen 
        name="History" 
        component={role === 'doctor' ? DoctorRequestHistory : DoctorRequestHistory} 
        options={{ title: t('request_history') }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ title: t('profile') }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;