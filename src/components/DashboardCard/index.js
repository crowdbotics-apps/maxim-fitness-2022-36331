import React from 'react';
import { View, StyleSheet } from 'react-native';

const DashboardCard = ({ children, style }) => {
  return <View style={[styles.shadowWrapper, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  shadowWrapper: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.24,
    shadowRadius: 6.27,

    elevation: 10,
  },
});

export default DashboardCard;
