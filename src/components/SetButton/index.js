import React from "react"
import { TouchableOpacity, View, Text, Image, StyleSheet } from "react-native"
import { Images } from "../../theme"

const SetButton = ({ onPress, disabled, mainContainer, item, index, bg }) => (
  <View style={[styles.scrollContainer, mainContainer]}>
    <TouchableOpacity
      style={[styles.buttonContainer, { backgroundColor: bg ? bg : "#F2F2F2" }]}
      onPress={onPress}
      disabled={disabled}
    >
      {item?.done && (
        <View style={styles.iconContainer}>
          <Image source={Images.iconDoneProgram} style={styles.iconStyle} />
        </View>
      )}
      <View style={styles.buttonText}>
        <Text style={{ color: "#626262" }}>{`Set ${index + 1}`}</Text>
      </View>
    </TouchableOpacity>
  </View>
)

const styles = StyleSheet.create({
  scrollContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: 100
    // paddingHorizontal: 10,
  },
  buttonContainer: {
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: "rgb(242, 242, 242)",
    borderRadius: 10
  },
  iconContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  iconStyle: { width: 20, height: 20 },
  buttonText: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center"
  }
})

export default SetButton
