import { View } from 'react-native';
import { MyStyles } from '../styles/MyStyle.js';
import MyCalendar from '../components/common/MyCalendar.js'; 
import React from 'react';
import { StatusBar } from "expo-status-bar";

export default function Calendar({ navigation }) {
  return (
    <View style={MyStyles.background}>
      <StatusBar backgroundColor="transparent" style="dark" />
      <MyCalendar navigation={navigation}/>
    </View>
  );
}