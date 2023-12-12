import React, { useState, useRef, useEffect, useLayoutEffect } from "react"
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated,
  ActivityIndicator
} from "react-native"
import { connect } from "react-redux"

import { Images } from "src/theme"
import { Text, Header } from "../../components"
import { usePubNub } from "pubnub-react"
import {
  useStore,
  loadHistory,
  cloneArray,
  sendMessages,
  pubnubTimeTokenToDatetime
} from "../../utils/chat"

const { backImage, sendMessage, profile, uploadMedia, messageImage } = Images
const ChatScreen = props => {
  const { navigation, profileUserData, requesting, userProfile, route } = props
  const { width } = Dimensions.get("window")
  const pubnub = usePubNub()

  const { state, dispatch } = useStore()
  const { item } = route.params
  const [messages, setMessages] = useState([])
  const channel = state.channels[route.params.item.id]

  const [loading, setLoading] = useState(false)

  const [textInput, setTextInput] = useState("")

  useEffect(() => {
    setLoading(true)
    try {
      pubnub.fetchMessages(
        {
          channels: [item.id],
          count: 100
        },
        (_, response) => {
          if (response) {
            const messages = response.channels[item.id].map(obj => obj)
            state.messages[item.id] = loadHistory(messages)
            setLoading(false)
            setMessages(messages)
            dispatch({ messages: state.messages })
          }
        }
      )
    } catch (err) {
      setLoading(false)
    }
  }, [channel])

  const handleMessage = event => {
    const message = event
    setMessages(messages => [...messages, message])
  }

  useEffect(() => {
    subscribePubNub()

    return () => {
      pubnub.unsubscribe({ channels: [`${channel?.id}`] })
    }
  }, [pubnub, channel])

  const subscribePubNub = () => {
    if (channel && channel?.id) {
      pubnub.addListener({ message: handleMessage })
      pubnub.subscribe({ channels: [`${channel?.id}`] })
    }
  }

  let scrollOffsetY = useRef(new Animated.Value(100)).current

  const onSend = () => {
    if (textInput) {
      sendMessages(pubnub, item.id, textInput).then(res => setTextInput(""))
      setTextInput("")
    }
  }

  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 60 }}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollOffsetY } } }],
            {
              useNativeDriver: false
            }
          )}
        >
          <View
            style={{
              paddingHorizontal: 20,
              flexDirection: "row",
              marginTop: 20
            }}
          >
            <TouchableOpacity
              style={{ justifyContent: "center", flex: 1 }}
              onPress={() => navigation.goBack()}
            >
              <Image source={backImage} style={{ height: 20, width: 30 }} />
            </TouchableOpacity>
            <View style={{ flex: 1.5 }}>
              <Image
                source={
                  item?.custom?.otherUserImage
                    ? { uri: item?.custom?.otherUserImage }
                    : profile
                }
                style={{
                  height: (61 / 375) * width,
                  width: (61 / 375) * width,
                  borderRadius: (31 / 375) * width
                }}
              />
            </View>
          </View>
          <View style={{ alignItems: "center", marginTop: 10 }}>
            <Text
              text={item?.name?.split("-")[1]}
              bold
              style={{ fontSize: 20 }}
            />
            {/* <Text text="THE ROCK" style={{ color: "#D3D3D3", fontSize: 12 }} /> */}
            {item?.updated && (
              <Text
                text={pubnubTimeTokenToDatetime(item?.updated)}
                style={{ color: "#D3D3D3", fontSize: 14, marginTop: 20 }}
              />
            )}
          </View>
          <View style={{ paddingHorizontal: 10, marginTop: 20 }}>
            {loading ? (
              <View
                style={{
                  marginTop: 30
                }}
              >
                <ActivityIndicator size={"large"} color={"black"} />
              </View>
            ) : (
              messages.map(item => (
                <View style={{ flexDirection: "row", marginBottom: 10 }}>
                  <Image
                    source={profile}
                    style={{
                      height: (40 / 375) * width,
                      width: (40 / 375) * width,
                      borderRadius: (20 / 375) * width
                    }}
                  />
                  <View
                    style={{
                      backgroundColor: "#D3D3D3",
                      paddingVertical: 20,
                      paddingHorizontal: 10,
                      width: "85%",
                      marginLeft: 10,
                      borderRadius: 10
                    }}
                  >
                    <Text text={item?.message} bold style={{ fontSize: 14 }} />
                  </View>
                </View>
              ))
            )}

            {/* <View style={{ flexDirection: "row" }}>
              <Image
                source={profile}
                style={{
                  height: (40 / 375) * width,
                  width: (40 / 375) * width,
                  borderRadius: (20 / 375) * width
                }}
              />
              <View
                style={{
                  backgroundColor: "#D3D3D3",
                  paddingVertical: 20,
                  paddingHorizontal: 10,
                  width: "85%",
                  marginLeft: 10,
                  borderRadius: 10
                }}
              >
                <Text
                  text="hy orum hope you are doing well this is our first conversation on orum app"
                  bold
                  style={{ fontSize: 14 }}
                />
              </View>
            </View>
           
           
            <View style={{ flexDirection: "row", marginTop: 20 }}>
              <View
                style={{
                  backgroundColor: "#add8e6",
                  paddingVertical: 20,
                  paddingHorizontal: 10,
                  width: "85%",
                  marginRight: 10,
                  borderRadius: 10
                }}
              >
                <Text
                  text="hy orum hope you are doing well this is our first conversation on orum app"
                  style={{ fontSize: 16, color: "white" }}
                />
              </View>
              <Image
                source={profile}
                style={{
                  height: (40 / 375) * width,
                  width: (40 / 375) * width,
                  borderRadius: (20 / 375) * width
                }}
              />
            </View> */}
          </View>
        </ScrollView>
      </SafeAreaView>
      <View
        style={{
          backgroundColor: "white",
          paddingBottom: 15,
          paddingHorizontal: 10,
          flexDirection: "row",
          justifyContent: "space-between"
        }}
      >
        <TextInput
          style={{
            borderWidth: 1,
            width: "70%",
            borderRadius: 20,
            borderColor: "gray",
            paddingLeft: 30,
            height: 40
          }}
          placeholder="Write Message"
          onChangeText={val => setTextInput(val)}
          value={textInput}
        />
        <View
          style={{
            flexDirection: "row",
            flex: 1,
            justifyContent: "space-between"
          }}
        >
          <Image
            source={uploadMedia}
            style={{
              height: (35 / 375) * width,
              width: (35 / 375) * width,
              marginLeft: 10
            }}
          />
          <TouchableOpacity onPress={onSend}>
            <Image
              source={sendMessage}
              style={{
                height: (35 / 375) * width,
                width: (35 / 375) * width
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </>
  )
}
const styles = StyleSheet.create({
  backIconStyle: {
    height: 16,
    width: 8,
    marginTop: 46,
    marginLeft: 22
  }
})

const mapStateToProps = state => ({
  userProfile: state.login.userDetail
})

export default connect(mapStateToProps, null)(ChatScreen)
