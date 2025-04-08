import { createStackNavigator } from '@react-navigation/stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../screens/Login';
import Launch from '../screens/Launch';
const Stack = createNativeStackNavigator();

function AuthStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Launch" component={Launch} />
            <Stack.Screen name="Login" component={Login} />
        </Stack.Navigator>
    );
}

export default AuthStack