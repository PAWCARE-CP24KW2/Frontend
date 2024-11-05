import React from 'react';
import { View } from 'react-native';
import Calendar from './pages/Calendar';
import Webboard from './pages/Webboard';
import Settings from './pages/Settings';
import Home from './pages/Home';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import { toastConfig } from './composable/toastConfig';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            
            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Calendar') {
              iconName = focused ? 'calendar' : 'calendar-outline';
            } else if (route.name === 'Webboard') {
              iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
            } else if (route.name === 'Settings') {
              iconName = focused ? 'settings' : 'settings-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'black', // Active tab color
          tabBarInactiveTintColor: '#493628',   // Inactive tab color
          tabBarStyle: {
            backgroundColor: '#B6917B',      // Tab bar background color
            height: 60,
            paddingBottom: 5,
          },
          headerShown: false,
        })}
      >
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Calendar" component={Calendar} />
        <Tab.Screen name="Webboard" component={Webboard} />
        <Tab.Screen name="Settings" component={Settings} />
      </Tab.Navigator>
      <Toast config={toastConfig}/>
    </NavigationContainer>    
  );
}
