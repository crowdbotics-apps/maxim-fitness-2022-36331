import React, { useEffect, useState, useCallback } from "react"
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  Image,
  TouchableOpacity,
  Dimensions,
  SectionList,
  ActivityIndicator
} from "react-native"
import { connect } from "react-redux"
import { Images } from "src/theme"
import { Text } from "../../components"
import { useFocusEffect } from "@react-navigation/native"
import { usePubNub } from "pubnub-react"
import {
  fetchAndAddTimeTokens,
  fetchChannels,
  getByValue,
  makeChannelsList,
  messageTimeTokene,
  timeSince,
  useStore
} from "../../utils/chat"
import Icon from "react-native-vector-icons/FontAwesome5"

const { backImage, searchImage, profile, followingButton, messageImage } =
  Images
const MessageScreen = props => {
  const pubnub = usePubNub()
  const { navigation, profileUserData, requesting, userProfile } = props
  const { width } = Dimensions.get("window")

  const { state, dispatch } = useStore()
  const [loading, setLoading] = useState(true)
  const [conversationList, setConversationList] = useState([])
  const [search, setSearch] = useState("")
  const [channelCount, setChannelCount] = useState()

  const bootstrap = () => {
    setLoading(true)
    fetchChannels(pubnub, userProfile?.id).then(channels => {
      Object.entries(channels)
        .map(([id, rest]) => ({
          id,
          ...rest
        }))
        .filter(item => {
          return item.name
        })
        .map(obj => {
          obj?.id && pubnub.subscribe({ channels: [obj?.id] })
          return { ...obj }
        })

      fetchAndAddTimeTokens(channels, pubnub)
        .then(updatedData => {
          dispatch({ channels: updatedData })
          setLoading(false)
        })
        .catch(error => {
          setLoading(false)
        })
    })

    unreadMessage()
  }

  useEffect(() => {
    pubnub.addListener({
      message: () => {
        unreadMessage()
      }
    })
  }, [])

  useFocusEffect(
    React.useCallback(() => {
      bootstrap()
    }, [])
  )

  useEffect(() => {
    if (state?.channels) {
      const DATA = makeChannelsList(state.channels)
      setConversationList(DATA)
    }
  }, [state.channels])

  const unreadMessage = () => {
    pubnub.objects
      .getMemberships({
        include: {
          customFields: true
        }
      })
      .then(res => {
        let countData = []
        res?.data?.forEach(item => {
          if (item?.channel?.id && item?.custom?.lastReadTimetoken) {
            pubnub.fetchMessages(
              {
                channels: [item?.channel?.id],
                count: 1
              },
              (_, response) => {
                if (response?.channels) {
                  const lastMessage = response.channels[item.channel.id][0]
                  if (lastMessage?.message?.sender !== userProfile?.id) {
                    pubnub
                      .messageCounts({
                        channels: [item?.channel?.id],
                        channelTimetokens: [item?.custom?.lastReadTimetoken]
                      })
                      .then(resMsg => {
                        Object.entries(resMsg?.channels)
                          .map(([id, rest]) => ({
                            id,
                            rest
                          }))
                          .map(obj => {
                            countData.push({ id: obj?.id, count: obj?.rest })
                          })
                      })
                  }
                }
              }
            )
          }
        })
        setTimeout(() => {
          setChannelCount(countData)
        }, 1000)
      })
  }

  useEffect(() => {
    if (search !== "") {
      const channels = Object.entries(state.channels).map(([id, rest]) => ({
        id,
        ...rest
      }))

      const filterChannels = channels.filter(
        channel =>
          channel?.name
            .split("-")[1]
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          (channel?.custom?.owner === profile.id
            ? channel?.custom?.otherUserName
            : channel?.custom?.ownerName
          )
            .toLowerCase()
            .includes(search.toLowerCase())
      )
      const DATA = makeChannelsList(filterChannels)
      setConversationList(DATA)
    } else {
      const DATA = makeChannelsList(state.channels)
      setConversationList(DATA)
    }
  }, [search])

  const chatNavigate = item => {
    navigation.navigate("ChatScreen", { item: item })
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
        .then(res => {
          unreadMessage()
        })
    )
  }

  const countUnRead = item => {
    const count = channelCount && channelCount?.find(val => val.id === item.id)
    return count && count?.count
  }
  const ListItem = item => {
    return (
      <TouchableOpacity
        onPress={() => chatNavigate(item)}
        style={{
          marginTop: 25,
          paddingHorizontal: 20,
          flexDirection: "row",
          justifyContent: "space-between"
        }}
      >
        <View style={{ flexDirection: "row", flex: 1 }}>
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
          <View
            style={{
              flexDirection: "row",
              flex: 1,
              alignItems: "center"
            }}
          >
            <View
              style={{
                justifyContent: "center",
                marginLeft: 15,
                flex: 1
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between"
                }}
              >
                <Text
                  text={
                    userProfile?.id === item?.custom?.owner
                      ? item?.custom?.otherUserName
                      : item?.custom?.ownerName
                  }
                  bold
                  numberOfLines={1}
                  style={{ fontSize: 12, flex: 1, color: "#626262" }}
                />
                {item?.timeToken && (
                  <Text style={styles.LastSeenText}>
                    {messageTimeTokene(item?.timeToken)}
                  </Text>
                )}
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between"
                }}
              >
                <Text
                  text={
                    item.name?.split("-")[
                    userProfile?.id === item.custom.owner ? 1 : 0
                    ]
                  }
                  style={{ color: "#D3D3D3", fontSize: 12 }}
                />
                {countUnRead(item) ? (
                  <View style={styles.countStyle}>
                    <Text
                      style={{
                        fontSize: 14,
                        color: "white"
                      }}
                    >
                      {countUnRead(item) > 99 ? "99+" : countUnRead(item)}
                    </Text>
                  </View>
                ) : null}
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      {/* <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      > */}
      <View
        style={{
          paddingHorizontal: 20,
          flexDirection: "row",
          marginTop: 20,
          justifyContent: "space-between"
        }}
      >
        <TouchableOpacity
          style={{ justifyContent: "center" }}
          onPress={() => navigation.goBack()}
        >
          <Image source={backImage} style={{ height: 20, width: 30 }} />
        </TouchableOpacity>
        <Text text="Messages" style={{ fontSize: 22, color: "#626262" }} bold />
        <TouchableOpacity
          onPress={() => navigation.navigate("SearchProfile", { isFeed: true })}
        >
          <Image source={messageImage} style={{ height: 30, width: 30 }} />
        </TouchableOpacity>
      </View>
      <View
        style={{ paddingHorizontal: 20, marginTop: 30, flexDirection: "row" }}
      >
        <TextInput
          style={{
            height: 40,
            borderRadius: 20,
            borderColor: "#D3D3D3",
            borderWidth: 1,
            paddingHorizontal: 60,
            width: "100%",
            position: "relative",
            color: "black"
          }}
          placeholder="Search People"
          placeholderTextColor="#525252"
          onChangeText={e => setSearch(e)}
        />
        <View
          style={{
            position: "absolute",
            marginTop: 5,
            paddingLeft: 40,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Icon name="search" size={26} color="gray" />

          {/* <Image source={searchImage} style={{ height: 30, width: 30 }} /> */}
        </View>
      </View>
      {loading ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <ActivityIndicator size={"large"} color={"black"} />
        </View>
      ) : conversationList?.[0]?.data?.length === 0 && !loading ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              marginBottom: 10,
              color: "#626262"
            }}
          >
            No User Found
          </Text>
        </View>
      ) : (
        <SectionList
          keyboardShouldPersistTaps="handled"
          refreshing={loading}
          onRefresh={() => {
            unreadMessage()
            bootstrap()
          }}
          sections={conversationList}
          keyExtractor={(item, index) => item + index}
          renderItem={({ item }) => ListItem(item)}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
      {/* </ScrollView> */}
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  backIconStyle: {
    height: 16,
    width: 8,
    marginTop: 46,
    marginLeft: 22
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  emptyText: {
    fontSize: 20
  },
  countStyle: {
    height: 25,
    width: 25,
    backgroundColor: "red",
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center"
  },
  LastSeenText: {
    alignItems: "flex-end",
    color: "#626262"
  }
})

const mapStateToProps = state => ({
  userProfile: state.login.userDetail
})

export default connect(mapStateToProps, null)(MessageScreen)
