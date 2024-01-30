import React, { useCallback, useMemo, useRef } from "react"
import { Pressable, StyleSheet } from "react-native"
// import BottomSheet from '@gorhom/bottom-sheet';
import { color } from "src/utils"

import CommentField from "./CommentField"

const Comment = () => {
  const bottomSheetRef = useRef(null)
  const snapPoints = useMemo(() => ["75%"], [])

  const handleSheetChanges = useCallback(index => {}, [])

  return (
    <View>
      <Text>dfs</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 15
  },
  content: {
    borderRadius: 15,
    backgroundColor: color.black,
    flex: 1
  },
  header: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 14,
    flexDirection: "row"
  },
  button: {
    position: "absolute",
    right: 14
  },
  body: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
})

export default Comment
