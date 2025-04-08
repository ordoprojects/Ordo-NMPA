import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Fontisto from 'react-native-vector-icons/Fontisto'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { BottomNavigation, Text } from 'react-native-paper';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import React, { useEffect ,useRef} from 'react';
import Icon,{ Icons } from '../constants/Icons';


import { Image,TouchableWithoutFeedback,View,BackHandler,StyleSheet,TouchableOpacity } from 'react-native';
import Visits from '../screens/Visits';
import UserList from '../screens/UsersList';
import Attendacnce from '../screens/Attendance';
import Insides from '../screens/Insides';
import Colors from '../constants/Colors';
import Inventory from '../screens/Inventory';
import CustomerFinance from '../screens/CustomerFinance';
import AdminHome from '../screens/AdminHome';
import { AuthContext } from '../Context/AuthContext';
import { useContext } from 'react';
import Updates from '../screens/Updates';
import Expense from '../screens/Expense';
import SupplierMgmt from '../screens/SupplierMgmt';
import InventoryMgmt from '../screens/InventoryMgmt';
import CheckIn from '../screens/CheckIn';
import UserMgmt from '../screens/UserMgmt';
import * as Animatable from 'react-native-animatable';
import { inlineStyles } from 'react-native-svg';
import Insights from '../screens/Insides';
import CustomerList from '../screens/CustomerList';
import AllCoustomer from '../screens/AllCoustomer';

const Tab = createBottomTabNavigator();

const TabArr = [
    { route: 'Insights', label: 'Insights', type: Icons.MaterialCommunityIcons, icon: 'finance', component:Insights },
    { route: 'Inventory', label: 'Products', type: Icons.FontAwesome5, icon: 'boxes', component: Inventory },
    { route: 'AdminHome', label: 'Home', type: Icons.Ionicons, icon: 'home', component: AdminHome},
    { route: 'AllCoustomer', label: 'Customer', type: Icons.MaterialIcons, icon: 'store', component: AllCoustomer },
    { route: 'User', label: 'User', type: Icons.Ionicons, icon: 'person', component: UserMgmt },
  ];

// const Tab = createMaterialBottomTabNavigator();

const animate1 = { 0: { scale: .5, translateY: 7 }, .92: { translateY: -34 }, 1: { scale: 1.2, translateY: -24 } }
const animate2 = { 0: { scale: 1.2, translateY: -24 }, 1: { scale: 1, translateY: 7 } }

const circle1 = { 0: { scale: 0 }, 0.3: { scale: .9 }, 0.3: { scale: .2 }, 0.8: { scale: .7 }, 1: { scale: 1 } } //for flicker change to 0.5: {scale: .2}
const circle2 = { 0: { scale: 1 }, 1: { scale: 0 } }

const TabButton = (props) => {
  const { item, onPress, accessibilityState } = props;
  const focused = accessibilityState.selected;
  const viewRef = useRef(null);
  const circleRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    if (focused) {
      viewRef.current.animate(animate1);
      circleRef.current.animate(circle1);
      textRef.current.transitionTo({ scale: 1});
    } else {
      viewRef.current.animate(animate2);
      circleRef.current.animate(circle2);
      textRef.current.transitionTo({ scale: 0 });
    }
  }, [focused])

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={1}
      style={styles.container}>
      <Animatable.View
        ref={viewRef}
        duration={600}
        style={styles.container}>
        <View style={styles.btn}>
          <Animatable.View
            ref={circleRef}
            style={styles.circle} />
          <Icon type={item.type} name={item.icon} color={focused ? Colors.white : Colors.primary} />
        </View>
        <Animatable.Text
          ref={textRef}
          style={styles.text}>
          {item.label}
        </Animatable.Text>
      </Animatable.View>
    </TouchableOpacity>
  )
}


export default function BottomTab({navigation}) {

    // const navigation = useNavigation();
    const { admin } = useContext(AuthContext);
    return (
        <Tab.Navigator
        initialRouteName='AdminHome'
        backBehavior='initialRoute'
          screenOptions={{
            headerShown: false,
            tabBarStyle: styles.tabBar,
            
          }}
        >
          {TabArr.map((item, index) => {
            return (
              <Tab.Screen key={index} name={item.route} component={item.component}
                options={{
                  tabBarShowLabel: false,
                  tabBarButton: (props) => <TabButton {...props} item={item} />
                }}
              />
            )
          })}
        </Tab.Navigator>
      )
    



 
   


//     return (

//         <Tab.Navigator
//         initialRouteName="AdminHome"
//         backBehavior='initialRoute'
//     //   sceneAnimationEnabled={false}
//       shifting={true}
//       activeColor="#50001D"
//   inactiveColor="grey"
//   barStyle={{ backgroundColor: 'transparent' }}
// //   renderTouchable={<TouchableWithoutFeedback />}
  
  


//             screenOptions={({ route }) => ({
//                 // tabBarStyle: { height: 50 },
//                 headerShown: false,    
//                 tabBarColor: 'green',
//                 barStyle: { backgroundColor: '#f69b31' },  

            

//                 tabBarIcon: ({ focused, color, size }) => {
//                     let iconName;

//                     if (route.name === 'Supplier') {
//                         iconName = focused ? 'file-document-edit' : 'file-document-edit-outline';
//                         size = 23;
//                         return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
                        
//                     }
//                     else if (route.name === 'AdminHome') {
//                         iconName = focused ? 'home' : 'home-outline';
//                         size = 23;
//                         return (

//                         <Ionicons name={iconName} size={size} color={color} />

//                         )
//                     }
//                     else if (route.name === 'Inventory') {
//                         iconName = focused ? 'cart' : 'cart-outline';
//                         size = 25;
//                         return <Ionicons name={iconName} size={size} color={color} />;
//                     } else if (route.name === 'User') {
//                         iconName = focused ? 'person' : 'person-outline';

//                         size = 23;
//                         return <Ionicons name={iconName} size={size} color={color} />;
//                     }
//                     else if (route.name === 'Fleet') {
//                         iconName = focused ? 'truck' : 'truck-outline';

//                         size = 25;
//                         return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
//                     }
//                     else if (route.name === 'Visits') {
//                         return <Image source={require('../assets/images/tourplan.png')}
//                             style={{ height: 20, width: 20, tintColor: focused ? Colors.primary : 'grey' }}
//                         />;
//                     }



//                     // Default icon rendering if no matching route name is found
//                     return null;
//                 },
//                 // tabBarActiveTintColor: Colors.primary,
//                 // tabBarInactiveTintColor: 'grey',
//                 // tabBarLabelStyle: { fontFamily: 'AvenirNextCyr-Thin' },
               
//                 // Other options...
//             })}
//         >
//             {/* admin user will have admin dashboard */}
    
//             <Tab.Screen name="Supplier" component={SupplierMgmt} />
//             <Tab.Screen name="Inventory" component={InventoryMgmt} />

//             {admin ? (<Tab.Screen options={{ title: 'Home' }} name="AdminHome" component={AdminHome} />) : 
//                 <Tab.Screen options={{ title: 'Tour Plan' }} name="Visits" component={Visits} />}
//             <Tab.Screen name="Fleet" component={CheckIn} />
//             <Tab.Screen name="User" component={UserMgmt} />
//         </Tab.Navigator>

//     );


}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    tabBar: {
      height: 65,
      position: 'absolute',
      bottom: 0,
      right: 0,
      left: 0,
      borderRadius: 0,
    },
    btn: {
      width: 50,
      height: 50,
      borderRadius: 25,
      borderWidth: 4,
      borderColor: Colors.white,
      backgroundColor: Colors.white,
      justifyContent: 'center',
      alignItems: 'center'
    },
    circle: {
      ...StyleSheet.absoluteFillObject,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors.primary,
      borderRadius: 25,
    },
    text: {
      fontSize: 10,
      textAlign: 'center',
      color: Colors.primary,
      fontWeight:'500'
    }
  })