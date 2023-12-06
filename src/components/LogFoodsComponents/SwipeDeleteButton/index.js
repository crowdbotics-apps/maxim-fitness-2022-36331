import React from "react"
import Icon from "react-native-vector-icons/MaterialIcons"
import { View, TouchableOpacity, StyleSheet } from "react-native"

const SwipeDeleteButton = ({ onDeleteClicked }) => {
  return (
    <TouchableOpacity
      style={styles.hiddenButton}
      onPress={() => {
        onDeleteClicked()
      }}
    >
      <View style={styles.iconStyle}>
        <Icon
          type="MaterialIcons"
          name="close"
          style={{ color: "white", fontSize: 40 }}
        />
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
    width: 75,
    height: 65,
    borderRadius: 10,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center"
  }
})

export default SwipeDeleteButton
