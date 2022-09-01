import React, { useCallback, useMemo, useRef } from "react"
import { View, StyleSheet, SafeAreaView, ImageBackground , ScrollView} from "react-native"


import { color } from "src/utils"
import { Images } from "src/theme"

// import { Header } from "components/header"
const { HomeImage } = Images

const Home = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* <Header />/ */}
      <ScrollView contentContainerStyle={{flex:1}}>
        <ImageBackground
          source={HomeImage}
          resizeMode="cover"
          style={styles.image}
        />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 15
  },

  image: {
    height: "100%"
  }
})

export default Home
