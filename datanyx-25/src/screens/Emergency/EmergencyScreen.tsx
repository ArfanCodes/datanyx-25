import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../utils/colors';

export const EmergencyScreen = () => (
  <View style={styles.container}>
    <Text>Emergency Screen</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.background, 
    justifyContent: 'center', 
    alignItems: 'center',
    paddingBottom: 75,
  },
});

