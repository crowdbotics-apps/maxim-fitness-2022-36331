import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// translation
import { useTranslation } from 'react-i18next';
import Fonts from '../../assets/images/fonts';

const TouchableDeleteAll = ({ onPress, clear }) => {
  const { t } = useTranslation();
  return (
    <>
      {clear ? (
        <View style={styles.mainContainer}>
          <TouchableOpacity onPress={onPress}>
            <Text style={styles.buttonText}>Clear Items</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.mainContainer}>
          <TouchableOpacity onPress={onPress}>
            <Text style={styles.buttonText}>{t('todayScreen.deleteAllItems')}</Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  buttonText: {
    color: 'red',
    fontSize: 15,
    fontFamily: Fonts.HELVETICA_MEDIUM,
  },
  mainContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
  },
});

export default TouchableDeleteAll;
