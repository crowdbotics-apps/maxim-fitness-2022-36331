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
import moment from "moment"
import { launchImageLibrary } from "react-native-image-picker"
import ImageView from "react-native-image-viewing"

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

const { width } = Dimensions.get("window")

const { backImage, sendMessage, profile, uploadMedia, messageImage } = Images
const ChatScreen = props => {
  const { navigation, profileUserData, requesting, userProfile, route } = props

  const pubnub = usePubNub()

  const { state, dispatch } = useStore()
  const { item } = route.params
  const [messages, setMessages] = useState([])
  const channel = state.channels[route.params.item.id]
  const [visible, setIsVisible] = useState(false)
  const [imageUrl, setImageUrl] = useState("")

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
          if (response?.channels) {
            const messages =
              response?.channels && response?.channels[item.id]?.map(obj => obj)
            state.messages[item.id] = loadHistory(messages)
            setLoading(false)
            setMessages(messages)
            dispatch({ messages: state.messages })
          }
          setLoading(false)
        }
      )
    } catch (err) {
      setLoading(false)
    }
  }, [channel])

  const handleMessage = event => {
    const message = event
    if (messages) {
      setMessages(messages => [...messages, message])
    } else {
      setMessages([message])
    }
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
      const payload = {
        sender: userProfile?.id,
        receiver: item?.id && item?.id?.split("-")[1],
        senderProfile: {
          image_url: userProfile?.profile_picture
            ? userProfile?.profile_picture
            : ""
        },
        receiverProfile: {
          image_url: ""
        },
        message: textInput,
        timestamp: moment().unix()
      }
      const channel = item.id
      sendMessages(pubnub, channel, payload).then(res => setTextInput(""))
    }
  }

  const pickImage = () => {
    launchImageLibrary({ mediaType: "photo" }).then(res => {
      if (res?.didCancel) {
        return
      }

      if (res.assets[0].fileSize > 4900000) {
        alert("File size must be less then 5mb.")
        return
      }
      const data = {
        channel: item.id,
        message: {
          message: {
            createdAt: new Date(),
            type: "image",
            sender: userProfile?.id,
            receiver: item?.id && item?.id?.split("-")[1],
            senderProfile: {
              image_url: userProfile?.profile_picture
            },
            receiverProfile: {
              image_url: ""
            },
            timestamp: moment().unix()
          },
          file: {
            name: res.assets[0].fileName,
            image: res.assets[0].uri
          }
        }
      }

      const tmpMessages = cloneArray(messages)
      tmpMessages.push(data)
      setMessages(tmpMessages)

      pubnub.sendFile({
        channel: item.id,
        message: {
          createdAt: new Date(),
          type: "image",
          sender: userProfile?.id,
          receiver: item?.id && item?.id?.split("-")[1],
          senderProfile: {
            image_url: userProfile?.profile_picture
          },
          receiverProfile: {
            image_url: ""
          },
          timestamp: moment().unix()
        },
        file: {
          uri: res.assets[0].uri,
          name: res.assets[0].fileName,
          mimeType: res.assets[0].type
        }
      })
    })
  }

  const renderMessageImage = props => {
    let result = ""
    try {
      result = props?.id
        ? pubnub.getFileUrl({
            channel: item.id,
            id: props?.id,
            name: "name" in props ? props?.name : props?.image
          })
        : props?.image
    } catch (error) {
      result = props.image
    }

    return (
      <TouchableOpacity
        style={styles.P5}
        onPress={() => {
          setImageUrl(result)
          setIsVisible(true)
        }}
      >
        <Image
          style={styles.ImageContainer}
          resizeMode="cover"
          source={{ uri: result }}
        />
      </TouchableOpacity>
    )
  }

  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 10 }}
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
            {/* <Text text={timeSince(item?.timeToken)} style={{ color: "#D3D3D3", fontSize: 12 }} /> */}
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
              messages &&
              messages?.map(item => (
                <View style={{ flexDirection: "row", marginBottom: 10 }}>
                  {(item?.message?.sender || item?.message?.message?.sender) ===
                  userProfile.id ? (
                    <>
                      <View style={styles.senderStyle}>
                        {item?.message?.file ? (
                          renderMessageImage(item?.message?.file)
                        ) : (
                          <Text
                            text={item?.message?.message}
                            bold
                            style={{ fontSize: 14 }}
                          />
                        )}
                      </View>
                      <Image
                        source={
                          userProfile?.profile_picture
                            ? { uri: userProfile?.profile_picture }
                            : profile
                        }
                        style={styles.imageStyle}
                      />
                    </>
                  ) : (
                    <>
                      <Image
                        source={
                          item?.receiverProfile?.image_url
                            ? { uri: item?.receiverProfile?.image_url }
                            : profile
                        }
                        style={styles.imageStyle}
                      />
                      <View style={styles.receiverStyle}>
                        {item?.message?.file ? (
                          renderMessageImage(item?.message?.file)
                        ) : (
                          <Text
                            text={item?.message?.message}
                            bold
                            style={{ fontSize: 14 }}
                          />
                        )}
                      </View>
                    </>
                  )}
                </View>
              ))
            )}
          </View>
        </ScrollView>

        <View
          style={{
            backgroundColor: "#FFF",
            paddingVertical: 5,
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
            <TouchableOpacity onPress={pickImage}>
              <Image
                source={uploadMedia}
                style={{
                  height: (35 / 375) * width,
                  width: (35 / 375) * width,
                  marginLeft: 10
                }}
              />
            </TouchableOpacity>
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
        {imageUrl && (
          <ImageView
            images={[{ uri: imageUrl }]}
            imageIndex={0}
            visible={visible}
            onRequestClose={() => {
              setImageUrl("")
              setIsVisible(false)
            }}
          />
        )}
      </SafeAreaView>
    </>
  )
}
const styles = StyleSheet.create({
  backIconStyle: {
    height: 16,
    width: 8,
    marginTop: 46,
    marginLeft: 22
  },
  senderStyle: {
    backgroundColor: "#add8e6",
    paddingVertical: 20,
    paddingHorizontal: 10,
    width: "85%",
    marginRight: 10,
    borderRadius: 10
  },
  imageStyle: {
    height: (40 / 375) * width,
    width: (40 / 375) * width,
    borderRadius: (20 / 375) * width
  },
  receiverStyle: {
    backgroundColor: "#D3D3D3",
    paddingVertical: 20,
    paddingHorizontal: 10,
    width: "85%",
    marginLeft: 10,
    borderRadius: 10
  },
  P5: {
    padding: 5
  },
  ImageContainer: {
    width: "100%",
    height: 150
  }
})

const mapStateToProps = state => ({
  userProfile: state.login.userDetail
})

export default connect(mapStateToProps, null)(ChatScreen)
