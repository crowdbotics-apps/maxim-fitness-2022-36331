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

  const bootstrap = () => {
    setLoading(true)
    fetchChannels(pubnub, userProfile?.id).then(channels => {
      dispatch({ channels })
      setLoading(false)
    })
  }

  useEffect(() => {
    if (!dispatch) {
      return
    }
    bootstrap()
  }, [])

  useEffect(() => {
    const DATA = makeChannelsList(state.channels)
    setConversationList(DATA)
  }, [state.channels])

  useEffect(() => {
    if (search !== "") {
      const channels = Object.entries(state.channels).map(([id, rest]) => ({
        id,
        ...rest
      }))
      const filterChannels = channels.filter(channel =>
        channel.name.toLowerCase().includes(search.toLowerCase())
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
      getLastSeen()
    }, [state.channels])
  )

  const getLastSeen = () => {
    if (Object.keys(state.channels).length > 0) {
      const channels = Object.entries(state.channels).map(([id, rest]) => ({
        id,
        ...rest
      }))
      Object.keys(state.channels).forEach(channel => {
        pubnub.hereNow(
          {
            channels: [channel],
            includeUUIDs: true,
            includeState: true
          },
          (status, response) => {
            const tmp = getByValue(channels, channel)
            if (tmp) {
              tmp.last_seen =
                response.channels[channel]?.occupants[0]?.state?.last_seen
              const DATA = [
                {
                  title: "Channels",
                  data: channels
                    .filter(item => {
                      return item.custom.type === 1
                    })
                    .map(obj => ({ ...obj }))
                },
                {
                  title: "Direct Chats",
                  data: channels
                    .filter(item => {
                      return item.custom.type === 0
                    })
                    .map(obj => ({ ...obj }))
                }
              ]
              setConversationList(DATA)
            }
          }
        )
      })
    }
  }

  const ListItem = item => {
    return (
      <TouchableOpacity
        style={{
          marginTop: 25,
          paddingHorizontal: 20,
          flexDirection: "row",
          justifyContent: "space-between"
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <Image
            source={profile}
            style={{
              height: (61 / 375) * width,
              width: (61 / 375) * width,
              borderRadius: (31 / 375) * width
            }}
          />
          <View style={{ justifyContent: "center", marginLeft: 15 }}>
            <Text text={item.name} bold style={{ fontSize: 12 }} />
            <Text text="THE ROCK" style={{ color: "#D3D3D3", fontSize: 12 }} />
          </View>
        </View>
        {item.last_seen && (
          <View style={{ justifyContent: "center" }}>
            <Text
              text={timeSince(new Date(item?.last_seen).getTime())}
              style={{ color: "#D3D3D3", fontSize: 12 }}
            />
          </View>
        )}
      </TouchableOpacity>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >
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
            onPress={() => navigation.navigate("SearchProfile")}
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
            // onChangeText={e => props.getUserProfile(e)}
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
        <SectionList
          refreshing={loading}
          onRefresh={async () => {
            await bootstrap()
          }}
          sections={conversationList}
          keyExtractor={(item, index) => item + index}
          renderItem={({ item }) => ListItem(item)}
        />
      </ScrollView>
    </SafeAreaView>
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

export default connect(mapStateToProps, null)(MessageScreen)
