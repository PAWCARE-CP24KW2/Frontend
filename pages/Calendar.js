import { View } from 'react-native';
import { MyStyles } from '../styles/MyStyle.js';
import MyCalendar from '../components/common/MyCalendar.js'; 
import React from 'react';

export default function Calendar({ navigation }) {
  return (
    <View style={MyStyles.background}>
      <MyCalendar navigation={navigation}/>
    </View>
  );
}