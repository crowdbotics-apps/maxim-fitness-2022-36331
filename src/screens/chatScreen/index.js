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
  ActivityIndicator,
  BackHandler,
  Platform,
  KeyboardAvoidingView
} from "react-native"
import { connect } from "react-redux"
import moment from "moment"
import { launchImageLibrary } from "react-native-image-picker"
import ImageView from "react-native-image-viewing"
import EmojiPicker from "rn-emoji-keyboard"

import { Images } from "src/theme"
import { Text, Header, Loader } from "../../components"
import { usePubNub } from "pubnub-react"
import {
  useStore,
  loadHistory,
  cloneArray,
  sendMessages,
  pubnubTimeTokenToDatetime,
  messageTimeTokene,
  getPubNubTimetoken
} from "../../utils/chat"

const { width } = Dimensions.get("window")

const { backImage, sendMessage, profile, uploadMedia, messageImage } = Images
const ChatScreen = props => {
  const { navigation, profileUserData, requesting, userProfile, route } = props
  const pubnub = usePubNub()

  const { state, dispatch } = useStore()
  const { item } = route.params
  const scrollViewRef = useRef()
  const [messages, setMessages] = useState([])
  const channel = state.channels[route.params.item.id]
  const [visible, setIsVisible] = useState(false)
  const [imageUrl, setImageUrl] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [isUpload, setIsUpload] = useState(false)
  const [currentlySelected, setCurrentlySelected] = useState([])

  const [loading, setLoading] = useState(false)

  const [textInput, setTextInput] = useState("")

  function handleBackButtonClick() {
    handleBack()
    return true
  }

  const handleBack = () => {
    if (messages?.length) {
      pubnub.time()?.then(res =>
        pubnub.objects
          .setMemberships({
            channels: [
              {
                id: item?.id,
                custom: {
                  lastReadTimetoken: res?.timetoken
                }
              }
            ]
          })
          .then(res => {})
      )
    }
  }

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick)
    return () => {
      BackHandler.removeEventListener(
        "hardwareBackPress",
        handleBackButtonClick
      )
    }
  }, [])

  useEffect(() => {
    setLoading(true)
    try {
      pubnub.fetchMessages(
        {
          channels: [item.id],
          count: 1000
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

  const handleFileMessage = event => {
    const message = event
    if (messages) {
      const combinedData = {
        channel: message.channel,
        subscription: message.subscription,
        timetoken: message.timetoken,
        publisher: message.publisher,
        message: {
          message: message?.message,
          file: message.file
        }
      }
      setMessages(messages => [...messages, combinedData])
    } else {
      setMessages([message])
    }
  }

  const handleMessage = event => {
    const message = event
    setMessages(messagesData => [...messagesData, message])
  }

  useEffect(() => {
    subscribePubNub()

    return () => {
      pubnub.unsubscribe({ channels: [`${channel?.id}`] })
    }
  }, [pubnub, channel])

  const subscribePubNub = () => {
    if (channel && channel?.id) {
      pubnub.addListener({
        message: handleMessage,
        file: handleFileMessage
      })
      pubnub.subscribe({ channels: [`${channel?.id}`], withPresence: true })
    }
  }

  const onSend = () => {
    if (textInput.trim()) {
      const payload = {
        sender: userProfile?.id,
        receiver: item?.id && item?.id?.split("-")[1],
        senderProfile: userProfile?.profile_picture
          ? userProfile?.profile_picture
          : "",
        receiverProfile: item?.custom?.otherUserImage || "",
        message: textInput.trim(),
        timestamp: getPubNubTimetoken()
      }
      const channel = item.id
      sendMessages(pubnub, channel, payload).then(res => {
        memberships(res)
        setTextInput("")
      })
    } else {
    }
  }

  const memberships = res => {
    pubnub.objects
      .setMemberships({
        channels: [
          {
            id: item?.id,
            custom: {
              lastReadTimetoken: res?.response?.timetoken
            }
          }
        ]
      })
      .then(res => {})
  }
  const fileUpload = async (item, res) => {
    try {
      const data = await pubnub.sendFile({
        channel: item.id,
        message: {
          createdAt: new Date(),
          type: "image",
          sender: userProfile?.id,
          receiver: item?.id && item?.id?.split("-")[1],
          senderProfile: userProfile?.profile_picture
            ? userProfile?.profile_picture
            : "",
          receiverProfile: item?.custom?.otherUserImage || "",
          timestamp: moment().unix()
        },
        file: {
          uri: res.assets[0].uri,
          name: res.assets[0].fileName,
          mimeType: res.assets[0].type
        }
      })

      setIsUpload(false)
      if (data?.timetoken) {
        pubnub.objects.setMemberships({
          channels: [
            {
              id: item?.id,
              custom: {
                lastReadTimetoken: parseInt(data?.timetoken)
              }
            }
          ]
        })
      }
    } catch (e) {}
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

      setIsUpload(true)
      fileUpload(item, res)
    })
  }

  const handleOnEmojiSelected = emoji => {
    setTextInput(prev => prev + emoji.emoji)
    if (emoji.alreadySelected)
      setCurrentlySelected(prev => prev.filter(a => a !== emoji.name))
    else setCurrentlySelected(prev => [...prev, emoji.name])
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
          // resizeMode="cover"
          source={{ uri: result }}
        />
      </TouchableOpacity>
    )
  }

  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
        {isUpload && <Loader />}
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : null}
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
              onPress={() => {
                handleBack()
                setTimeout(() => {
                  navigation.goBack()
                }, 300)
              }}
            >
              <Image source={backImage} style={{ height: 20, width: 30 }} />
            </TouchableOpacity>
            <View style={{ flex: 1.5 }}>
              <Image
                source={
                  userProfile?.id === item?.custom?.owner &&
                  item?.custom?.otherUserImage
                    ? { uri: item?.custom?.otherUserImage }
                    : userProfile?.id !== item?.custom?.owner &&
                      item?.custom?.ownerImage
                    ? { uri: item?.custom?.ownerImage }
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
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={{ paddingBottom: 10, flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() =>
              scrollViewRef?.current?.scrollToEnd({ animated: true })
            }
          >
            <View style={{ alignItems: "center", marginTop: 10 }}>
              <Text
                text={
                  userProfile?.id === item?.custom?.owner
                    ? item?.custom?.otherUserName
                    : item?.custom?.ownerName
                }
                bold
                style={{ fontSize: 20, color: "#626262" }}
              />

              <Text
                text={
                  item?.name?.split("-")[
                    userProfile?.id === item.custom.owner ? 1 : 0
                  ]
                }
                style={{
                  fontSize: 16,
                  opacity: 0.5,
                  marginTop: 5,
                  color: "#626262"
                }}
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
                messages?.map(items => (
                  <View style={{ flexDirection: "row", marginBottom: 10 }}>
                    {(items?.message?.sender ||
                      items?.message?.message?.sender) === userProfile.id ? (
                      <>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "flex-end",
                            flex: 1
                          }}
                        >
                          <View style={[styles.senderStyle]}>
                            {items?.message?.file ? (
                              <>
                                {renderMessageImage(items?.message?.file)}
                                <View
                                  style={{
                                    alignItems: "flex-end"
                                  }}
                                >
                                  <Text
                                    text={`${messageTimeTokene(
                                      items?.timetoken
                                    )}`}
                                    bold
                                    style={{
                                      fontSize: 12,
                                      opacity: 0.6,
                                      color: "#626262"
                                    }}
                                  />
                                </View>
                              </>
                            ) : (
                              <View
                                style={{
                                  alignItems: "flex-end"
                                }}
                              >
                                <Text
                                  text={items?.message?.message}
                                  bold
                                  style={{ fontSize: 14, color: "#626262" }}
                                />
                                <Text
                                  text={`${messageTimeTokene(
                                    items?.timetoken
                                  )}`}
                                  bold
                                  style={{
                                    fontSize: 12,
                                    opacity: 0.6,
                                    color: "#626262"
                                  }}
                                />
                              </View>
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
                        </View>
                      </>
                    ) : (
                      <View
                        style={{
                          flexDirection: "row"
                        }}
                      >
                        <Image
                          source={
                            userProfile?.id === item?.custom?.owner &&
                            item?.custom?.otherUserImage
                              ? { uri: item?.custom?.otherUserImage }
                              : userProfile?.id !== item?.custom?.owner &&
                                item?.custom?.ownerImage
                              ? { uri: item?.custom?.ownerImage }
                              : profile
                          }
                          style={styles.imageStyle}
                        />
                        <View style={styles.receiverStyle}>
                          {items?.message?.file ? (
                            <>
                              {renderMessageImage(items?.message?.file)}
                              <Text
                                text={`${messageTimeTokene(items?.timetoken)}`}
                                bold
                                style={{
                                  fontSize: 12,
                                  opacity: 0.6,
                                  color: "#626262"
                                }}
                              />
                            </>
                          ) : (
                            <View>
                              <Text
                                text={items?.message?.message}
                                bold
                                style={{ fontSize: 14, color: "#626262" }}
                              />
                              <Text
                                text={`${messageTimeTokene(items?.timetoken)}`}
                                bold
                                style={{
                                  fontSize: 12,
                                  opacity: 0.6,
                                  color: "#626262"
                                }}
                              />
                            </View>
                          )}
                        </View>
                      </View>
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
                width: "74%",
                borderRadius: 20,
                borderColor: "gray",
                paddingHorizontal: 20,
                height: 40,
                color: "black"
              }}
              placeholder="Write Message"
              placeholderTextColor="#525252"
              onChangeText={val => setTextInput(val)}
              value={textInput}
            />

            <View
              style={{
                flexDirection: "row",
                flex: 1,
                justifyContent: "space-between",
                alignItems: "center",
                marginHorizontal: 5
              }}
            >
              <TouchableOpacity onPress={() => setIsOpen(true)}>
                <Image
                  source={Images.emoji}
                  style={{
                    height: (25 / 375) * width,
                    width: (25 / 375) * width
                  }}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={pickImage}>
                <Image
                  source={uploadMedia}
                  style={{
                    height: (25 / 375) * width,
                    width: (25 / 375) * width
                  }}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={onSend}>
                <Image
                  source={sendMessage}
                  style={{
                    height: (25 / 375) * width,
                    width: (25 / 375) * width
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
              HeaderComponent={() => (
                <View style={styles.closeBtn}>
                  <TouchableOpacity onPress={() => setIsVisible(false)}>
                    <Image
                      source={Images.closeBtn}
                      style={{ width: 35, height: 35 }}
                    />
                  </TouchableOpacity>
                </View>
              )}
            />
          )}
          <EmojiPicker
            onEmojiSelected={handleOnEmojiSelected}
            open={isOpen}
            onClose={() => {
              setIsOpen(false), setCurrentlySelected([])
            }}
            enableSearchBar
            enableRecentlyUsed={false}
            allowMultipleSelections={true}
            selectedEmojis={currentlySelected}
          />
        </KeyboardAvoidingView>
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
    paddingVertical: 15,
    paddingHorizontal: 10,
    maxWidth: "85%",
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
    paddingVertical: 15,
    paddingHorizontal: 10,
    maxWidth: "85%",
    marginLeft: 10,
    borderRadius: 10
  },
  P5: {
    padding: 5
  },
  ImageContainer: {
    width: (270 / 375) * width,
    height: 150
  },
  closeBtn: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 10,
    marginTop: Platform.OS === "android" ? 0 : 30
  }
})

const mapStateToProps = state => ({
  userProfile: state.login.userDetail
})

export default connect(mapStateToProps, null)(ChatScreen)
