import React from 'react'
import { Dimensions, StyleSheet, TextInput } from 'react-native'
import { color } from 'utils'
import { SafeAreaView } from 'react-native-safe-area-context'

const { width } = Dimensions.get('screen')

const CommentField = () => {
  return (
    <SafeAreaView style={styles.content} edges={['bottom']}>
      <TextInput
        style={styles.input}
        placeholder='Write Comment'
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  content: {
    backgroundColor: color.darkGray,
    padding: 20,
  },
  input: {
    backgroundColor: color.white,
    width: width - 40,
    height: 40,
    borderRadius: 32,
    paddingHorizontal: 16
  }
})

export default CommentField