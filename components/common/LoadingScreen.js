import React from 'react';
import { View, ActivityIndicator, StyleSheet, ImageBackground } from 'react-native';

const LoadingScreen = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#493628" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eadfd9',
  },
});

export default LoadingScreen;