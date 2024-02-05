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
      options={item?.map(val => val?.measure)}
      dropdownStyle={styles.dropdownStyle}
      dropdownTextStyle={styles.dropdownTextStyle}
      onSelect={(value, items) => {
        onSelect(value, items)
        updateNutritions && updateNutritions(items, foodItem, type, index)
      }}
      showsVerticalScrollIndicator={true}
    >
      <View style={styles.modalButtonStyle}>
        <View>
          <Text style={styles.dropdownButtonText} numberOfLines={2}>
            {unitText || "Choose..."}
          </Text>
        </View>
        <View
          style={{ flex: 1, justifyContent: "flex-end", flexDirection: "row" }}
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
    color: "black",
    width: 113
  },
  dropdownImage: {
    width: 30,
    height: 30
  },
  modalButtonStyle: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    width: 140
  },
  dropdownTextStyle: {
    fontSize: 14,
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
    paddingHorizontal: 10
  }
})

export default SubDropDown
