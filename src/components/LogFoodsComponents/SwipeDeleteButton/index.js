import React from "react"
import Icon from "react-native-vector-icons/MaterialIcons"
import { View, TouchableOpacity, StyleSheet, Image } from "react-native"
import { Images } from "../../../theme"

const SwipeDeleteButton = ({ onDeleteClicked }) => {
  return (
    <TouchableOpacity
      style={styles.hiddenButton}
      onPress={() => {
        onDeleteClicked()
      }}
    >
      <View style={styles.iconStyle}>
        <Image source={Images.close} style={{ width: 75, height: 65 }} />
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  hiddenButton: {
    // marginVertical: 10,
    top: 5,
    height: 120,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end"
  },
  iconStyle: {
    justifyContent: "center",
    alignItems: "center"
  }
})

export default SwipeDeleteButton
