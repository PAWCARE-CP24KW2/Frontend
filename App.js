import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import Home from './pages/Home';
import FirstPage from './pages/FirstPage';
import Login from './pages/Login';
import NewAccount from './pages/NewAccount';
import Addpet from './pages/Addpet';
import ViewPet from './pages/ViewPet';
import ImportPet from './pages/ImportPet';
import UpdatePetData from './components/UpdatePetData';
import Calendar from './pages/Calendar';
import Webboard from './pages/Webboard';
import Settings from './pages/Settings';
import Documents from './pages/Documents';
import Toast from 'react-native-toast-message';
import { toastConfig } from './composable/toastConfig';
import NewPet from './pages/NewPet';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeScreen" component={Home} />
      <Stack.Screen name="AddPet" component={Addpet} />
      <Stack.Screen name="ImportPet" component={ImportPet} />
      <Stack.Screen name="NewPet" component={NewPet} />
      <Stack.Screen name="ViewPet" component={ViewPet} />
      <Stack.Screen name="UpdatePetData" component={UpdatePetData} />
      <Stack.Screen name="Documents" component={Documents} />
    </Stack.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="FirstPage">
      <Stack.Screen name="FirstPage" component={FirstPage} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="NewAccount" component={NewAccount} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Auth">
        <Stack.Screen name="Auth" component={AuthStack} />
        <Stack.Screen name="Main" component={MainTabs} />
      </Stack.Navigator>
      <Toast config={toastConfig}/>
    </NavigationContainer>
  );
}

function MainTabs() {
  return (
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
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Calendar" component={Calendar} />
      <Tab.Screen name="Webboard" component={Webboard} />
      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>
  );
}