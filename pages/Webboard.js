import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Webboard() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to the Web board</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EACEBE',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
