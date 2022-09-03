import React from "react"
import {StyleSheet, SafeAreaView, FlatList} from "react-native"
import FeedCard from "../../components/FeedCard"
import {Text} from 'src/components';
import Header from "../../components/Header";

const Home = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <Text style={styles.content} text="Latest..." />
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
    color: 'gray',
    paddingHorizontal: 15,
    marginTop: 10
  }
})

export default Home
