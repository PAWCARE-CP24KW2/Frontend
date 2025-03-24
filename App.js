import React from 'react';
import { ActivityIndicator } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { MenuProvider } from 'react-native-popup-menu';
import Toast from 'react-native-toast-message';
import { toastConfig } from './services/toastConfig';
import { useFonts } from "expo-font";

import Home from './pages/Home';
import FirstPage from './pages/FirstPage';
import Login from './pages/Login';
import NewAccount from './pages/NewAccount';
import Addpet from './pages/Addpet';
import ViewPet from './pages/ViewPet';
import UpdatePetData from './pages/UpdatePetData';
import Calendar from './pages/Calendar';
import Webboard from './pages/Webboard';
import Settings from './pages/Settings';
import Documents from './pages/Documents';
import AddPost from './pages/AddPost';
import EditUserProfile from './pages/EditUserProfile';
import EditPost from './pages/EditPost';
import PostDetails from './pages/PostDetails';
import GalleryPage from './pages/GalleryPage';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeScreen" component={Home} />
      <Stack.Screen name="AddPet" component={Addpet} />
      <Stack.Screen name="ViewPet" component={ViewPet} />
      <Stack.Screen name="UpdatePetData" component={UpdatePetData} />
      <Stack.Screen name="Documents" component={Documents} />
      <Stack.Screen name="EditUserProfile" component={EditUserProfile} />
      <Stack.Screen name="Gallery" component={GalleryPage} />
    </Stack.Navigator>
  );
}

function WebboardStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="WebboardMain" component={Webboard} />
      <Stack.Screen name="AddPost" component={AddPost} />
      <Stack.Screen name="EditPost" component={EditPost} /> 
      <Stack.Screen name="PostDetails" component={PostDetails} />
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
  const [fontsLoaded] = useFonts({
    Comfortaa: require("./assets/fonts/Comfortaa-Regular.ttf"),
    ComfortaaBold: require("./assets/fonts/Comfortaa-Bold.ttf"),
  });

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#000" />;
  }

  return (
    <MenuProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Auth">
          <Stack.Screen name="Auth" component={AuthStack} />
          <Stack.Screen name="Main" component={MainTabs} />
        </Stack.Navigator>
        <Toast config={toastConfig}/>
      </NavigationContainer>
    </MenuProvider>
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
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'white',
        tabBarStyle: {
          backgroundColor: '#493628',
          height: 60,
        },
        tabBarLabelStyle: {
          fontFamily: 'ComfortaaBold',
          fontSize: 12,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Calendar" component={Calendar} />
      <Tab.Screen name="Webboard" component={WebboardStack} />
      <Tab.Screen name="Settings" component={SettingsStack} />
    </Tab.Navigator>
  );
}

function SettingsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SettingsMain" component={Settings} />
      <Stack.Screen name="EditUserProfile" component={EditUserProfile} />
    </Stack.Navigator>
  );
}
