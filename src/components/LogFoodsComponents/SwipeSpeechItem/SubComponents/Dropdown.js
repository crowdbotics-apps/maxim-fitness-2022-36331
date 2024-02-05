import React from "react"
import { View, Text, Image, StyleSheet } from "react-native"
import ModalDropdown from "react-native-modal-dropdown"
import { Images } from "../../../../theme"
const SubDropDown = ({
  item,
  onSelect,
  unitText,
  foodItem,
  updateNutritions,
  type,
  index
}) => {
  return (
    <ModalDropdown
      style={styles.dropdownContainer}
      options={item?.map(val => val.measure)}
      dropdownStyle={styles.dropdownStyle}
      dropdownTextStyle={styles.dropdownTextStyle}
      onSelect={(value, items) => {
        onSelect(value, items)
        updateNutritions && updateNutritions(items, foodItem, type, index)
      }}
    >
      <View style={styles.modalButtonStyle}>
        <View style={{ flex: 2 }}>
          <Text style={styles.dropdownButtonText} numberOfLines={1}>
            {unitText || "Choose..."}
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            alignItems: "center",
            flexDirection: "row",
            paddingBottom: 3
          }}
        >
          <Image source={Images.dropDownIcon} style={styles.dropdownImage} />
        </View>
      </View>
    </ModalDropdown>
  )
}

const styles = StyleSheet.create({
  dropdownButtonText: {
    fontSize: 14,
    lineHeight: 14,
    color: "black"
  },
  dropdownImage: {
    width: 20,
    height: 20
  },
  modalButtonStyle: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row"
  },
  dropdownTextStyle: {
    fontSize: 14,
    lineHeight: 14,
    color: "black"
  },
  dropdownStyle: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    width: 130,
    paddingHorizontal: 10
  },
  dropdownContainer: {
    width: 140,
    maxWidth: 140,
    paddingHorizontal: 6
  }
})

export default SubDropDown
