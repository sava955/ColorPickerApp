import React from 'react';
import { StyleSheet, View } from 'react-native';

import ColorPickerScreen from './components/ColorPickerScreen';

export default function App() {
  return (
    <View style={styles.container}>
      <ColorPickerScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
