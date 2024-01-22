import React from "react"
import { View, StyleSheet } from "react-native"
import BarcodeScanner from "../../components/BarcodeScanner/index"

const BarCodeScreen = ({ navigation }) => (
  <View style={styles.container}>
    <BarcodeScanner navigation={navigation} />
  </View>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column"
  }
})

export default BarCodeScreen
