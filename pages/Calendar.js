import { View } from 'react-native';
import { MyStyles } from '../styles/MyStyle.js';
import MyCalendar from '../components/MyCalendar.js';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback } from 'react';

export default function Calendar({ navigation }) {
  // useFocusEffect(
  //   useCallback(() => {
  //     // Logic to reload calendar data
  //     console.log('Calendar data reloaded');
  //     // You can call a function here to reload your calendar data
  //     // reloadCalendarData();

  //     // Return a cleanup function if necessary
  //     return () => {
  //       // Cleanup if needed
  //     };
  //   }, [])
  // );

  return (
    <View style={MyStyles.background}>
      <MyCalendar navigation={navigation}/>
    </View>
  );
}