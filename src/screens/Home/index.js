import React from "react"
import {StyleSheet, SafeAreaView, FlatList} from "react-native"
import FeedCard from "../../components/FeedCard"
import {Text} from 'src/components';

const Home = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.content} text="Ltest..." />
      <FlatList
        data={[1]}
        renderItem={(item, i) => {
          return <FeedCard />
        }}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    fontSize: 15,
    // backgroundColor: 'red',
    color: 'gray',
    paddingHorizontal: 15,
  }
})

export default Home
