import React from "react"
import { View, Text, StyleSheet } from "react-native"
import Fonts from "../../assets/images/fonts"
import { Layout } from "../../theme"

const TableColumn = ({ name, value }) => {
  const { row, fill, center } = Layout

  return (
    <View style={[fill, row, center]}>
      <View
        style={[
          styles.innerContainer,
          { flex: 1, justifyContent: "center", alignItems: "center" }
        ]}
      >
        <Text
          style={styles.tableHeadRightText}
          numberOfLines={1}
        >{`${value} g`}</Text>
      </View>
      <View style={styles.innerContainer}>
        <Text style={styles.columnType} numberOfLines={1}>
          {name}
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  spinner: {
    width: 30,
    height: 20
  },
  innerContainer: {
    paddingHorizontal: 2,
    paddingVertical: 10
  },
  tableHeadRightText: {
    color: "rgb(70,162,248)",
    fontSize: 16,
    lineHeight: 16,
    fontWeight: "bold",
    fontFamily: Fonts.HELVETICA_BOLD
    // textAlign: 'center',
  },
  columnType: {
    fontSize: 16,
    lineHeight: 16,
    fontWeight: "bold",
    color: "black",
    fontFamily: Fonts.HELVETICA_BOLD
  }
})

export default TableColumn
