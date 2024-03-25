import React from "react"
import { View, StyleSheet, TouchableOpacity } from "react-native"
import { Text, Button } from "../../components"
import Modal from "react-native-modal"

const CustomModal = props => {
  const { navigation, setShowModal, showModal, text, action } = props

  return (
    <Modal
      isVisible={showModal}
      animationIn="zoomIn"
      animationOut={"zoomOut"}
      onBackdropPress={() => setShowModal(false)}
    >
      <View style={styles.main}>
        <Text style={styles.headerText}>{text}</Text>
        <View style={{ flexDirection: "row", marginTop: 20 }}>
          <TouchableOpacity
            style={[styles.delBtnStyles, { backgroundColor: "#74CCFF" }]}
            onPress={() => [setShowModal(!showModal), action()]}
          >
            <Text style={{ fontWeight: "700", color: "#000" }}>Yes</Text>
          </TouchableOpacity>
          <View style={{ marginHorizontal: 20 }} />
          <TouchableOpacity
            style={[styles.delBtnStyles, { backgroundColor: "#F3F1F4" }]}
            onPress={() => setShowModal(!showModal)}
          >
            <Text style={{ fontWeight: "700", color: "#000" }}>No</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}
const styles = StyleSheet.create({
  delBtnStyles: {
    width: 100,
    height: 50,
    backgroundColor: "red",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center"
  },
  main: {
    height: 250,
    marginHorizontal: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center"
  },
  headerText: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center"
  }
})

export default CustomModal
