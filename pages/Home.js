import { View } from 'react-native';
import { MyStyles } from '../styles/MyStyle.js';
import MyCalendar from '../components/MyCalendar.js';

export default function Home() {
  return (
    <View style={MyStyles.background}>
      <MyCalendar/>
    </View>
  );
}