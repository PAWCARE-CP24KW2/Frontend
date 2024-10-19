import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { MyStyles } from './styles/MyStyle';
import MyCalendar from './components/MyCalendar.js';

export default function App() {
  return (
    <View style={MyStyles.background}>
      <MyCalendar/>
    </View>
  );
}