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
  SectionList
} from "react-native"
import { connect } from "react-redux"
import { Images } from "src/theme"
import { Text } from "../../components"
import { useFocusEffect } from "@react-navigation/native"
import { usePubNub } from "pubnub-react"
import {
  fetchChannels,
  getByValue,
  makeChannelsList,
  timeSince,
  useStore
} from "../../utils/chat"

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

      dispatch({ channels })
      setLoading(false)
    })
  }

  useEffect(() => {
    if (!dispatch) {
      return
    }
    bootstrap()

    pubnub.addListener({
      message: () => {
        unreadMessage()
      }
    })
  }, [])

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
        res?.data?.map(item => {
          if (item?.channel?.id && item?.custom?.lastReadTimetoken) {
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
          channel.name
            .split("-")[1]
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          (channel?.custom?.firstLastName &&
            channel?.custom?.firstLastName
              .split("/")[1]
              .toLowerCase()
              .includes(search.toLowerCase()))
      )
      const DATA = makeChannelsList(filterChannels)
      setConversationList(DATA)
    } else {
      const DATA = makeChannelsList(state.channels)
      setConversationList(DATA)
    }
  }, [search])

  useFocusEffect(
    useCallback(() => {
      unreadMessage()
      // getLastSeen()
    }, [state?.channels])
  )

  const chatNavigate = item => {
    navigation.navigate("ChatScreen", { item: item })

    // pubnub.history({ channel: item?.id }).then(res => {
    //   if (res?.endTimeToken) {
    //     pubnub.objects
    //       .setMemberships({
    //         channels: [
    //           {
    //             id: item?.id,
    //             custom: {
    //               lastReadTimetoken: res?.endTimeToken
    //             }
    //           }
    //         ]
    //       })
    //       .then(res => {
    //         unreadMessage()
    //       })
    //   }
    // })
  }

  const userProfileData = item => {
    if (item?.custom?.userOne?.length) {
      const userOne = JSON.parse(item?.custom?.userOne)
      const userTwo = JSON.parse(item?.custom?.userTwo)
      if (item?.custom?.owner === userOne.id) {
        return userTwo
      } else if (item?.custom?.owner === userTwo.id) {
        return userOne
      }
    } else {
      return null
    }
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
              userProfileData(item) && userProfileData(item)?.image
                ? { uri: userProfileData(item)?.image }
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
              justifyContent: "center",
              marginLeft: 15,
              flex: 1
            }}
          >
            <Text
              text={
                item?.custom?.firstLastName?.split("/")[
                  userProfile?.id === item.custom.owner ? 1 : 0
                ]
              }
              bold
              style={{ fontSize: 12 }}
            />
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
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
                <Text style={styles.LastSeenText}>{countUnRead(item)}</Text>
              ) : null}
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
        <Text text="Messages" style={{ fontSize: 22 }} bold />
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
            position: "relative"
          }}
          placeholder="Search People"
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
          <Image source={searchImage} style={{ height: 30, width: 30 }} />
        </View>
      </View>

      {!conversationList?.length && !loading ? (
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
              marginBottom: 10
            }}
          >
            No User Found
          </Text>
        </View>
      ) : (
        <SectionList
          keyboardShouldPersistTaps="handled"
          refreshing={loading}
          onRefresh={async () => {
            await bootstrap()
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
  }
})

const mapStateToProps = state => ({
  userProfile: state.login.userDetail
})

export default connect(mapStateToProps, null)(MessageScreen)
