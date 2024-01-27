import React, { useEffect, useState } from "react"
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  Image,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Dimensions
} from "react-native"
import { Images } from "src/theme"
import Modal from "react-native-modal"
import { connect } from "react-redux"
import { Text } from "../../components"
import { usePubNub } from "pubnub-react"
import { createDirectChannel, useStore, ChannelType } from "../../utils/chat"
import { letterCapitalize } from "../../utils/functions"
import { routeData } from "../../ScreenRedux/profileRedux"
import SkeletonPlaceholder from "react-native-skeleton-placeholder"

//action
import { getUserProfile, userChat } from "../../ScreenRedux/searchProfileRedux"
import { followUser, unFollowUser } from "../../ScreenRedux/profileRedux"

const {
  backImage,
  searchImage,
  profileBackGround,
  followButton,
  profile,
  followingButton
} = Images
const SearchProfile = props => {
  const pubnub = usePubNub()
  const { state, dispatch } = useStore()

  const {
    navigation,
    profileUserData,
    requesting,
    userProfile,
    route,
    routeData
  } = props
  const { width } = Dimensions.get("window")
  const [followUser, setFollowUser] = useState([])
  const [loading, setLoading] = useState(false)
  const [nextPage, setNextPage] = useState(1)
  const [searchText, setSearchText] = useState("")
  const [refresh, setRefresh] = useState(false)

  let newArray = []
  useEffect(() => {
    if (profileUserData) {
      let filterData = profileUserData.filter(item => item.follow === true)

      filterData.map(item => {
        newArray.push(item.user_detail.id)
      })
      setFollowUser(newArray)
    }
  }, [profileUserData])

  useEffect(() => {
    props.getUserProfile("", 1, setNextPage)
  }, [])

  const followUnfollowUser = item => {
    if (followUser.length && followUser.includes(item?.user_detail?.id)) {
      let newData = followUser.filter(v => v !== item.user_detail.id)
      setFollowUser(newData)
    } else {
      setFollowUser(
        followUser.length
          ? [...followUser, item.user_detail.id]
          : [item.user_detail.id]
      )
    }
    if (followUser.includes(item?.user_detail?.id)) {
      props.unFollowUser({ id: item.user_detail.id })
    } else {
      props.followUser({ id: item.user_detail.id })
    }
  }

  const createChat = async item => {
    try {
      const firstLastName =
        userProfile.first_name +
        " " +
        userProfile.last_name +
        "/" +
        item?.user_detail?.first_name +
        " " +
        item?.user_detail?.last_name

      const userOne = {
        id: userProfile?.id,
        image: userProfile?.profile_picture || ""
      }
      const userTwo = {
        id: item?.user_detail?.id,
        image: item?.user_detail?.profile_picture || ""
      }

      setLoading(true)
      const res = await createDirectChannel(
        pubnub,
        userProfile?.id,
        item?.user_detail?.id,
        {
          name: userProfile?.username + " - " + item?.user_detail?.username,
          custom: {
            type: 0,
            owner: userProfile?.id,
            otherUserImage: item?.user_detail?.profile_picture,
            otherUserName: item?.user_detail?.username,
            firstLastName: firstLastName,
            userOne: JSON.stringify(userOne),
            userTwo: JSON.stringify(userTwo)
          }
        }
      )
      dispatch({
        channels: {
          ...state.channels,
          [res.channel]: {
            id: res.channel,
            name: userProfile?.username + " - " + item?.user_detail?.username,
            custom: {
              type: ChannelType.Direct,
              owner: userProfile?.id,
              otherUserImage: item?.user_detail?.profile_picture,
              otherUserName: item?.user_detail?.username,
              firstLastName: firstLastName,
              userOne: JSON.stringify(userOne),
              userTwo: JSON.stringify(userTwo)
            }
          }
        }
      })
      setLoading(false)
      navigation.replace("ChatScreen", {
        item: {
          id: res.channel,
          name: userProfile?.username + " - " + item?.user_detail?.username,
          custom: {
            type: ChannelType.Direct,
            owner: userProfile?.id,
            otherUserImage: item?.user_detail?.profile_picture,
            otherUserName: item?.user_detail?.username,
            firstLastName: firstLastName,
            userOne: JSON.stringify(userOne),
            userTwo: JSON.stringify(userTwo)
          }
        }
      })
    } catch (err) {}
  }

  const movetoNextScreen = item => {
    const newData = {
      follow: item.follow,
      user: item.user_detail
    }

    routeData(newData)
    navigation.navigate("ProfileScreen", {
      item: newData,
      backScreenName: "SearchProfile"
    })
  }

  const onEndReached = () => {
    nextPage !== null &&
      props.getUserProfile(searchText ? searchText : "", nextPage, setNextPage)
  }

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => [
          route.params?.isFeed ? createChat(item) : movetoNextScreen(item)
        ]}
        style={{
          marginTop: 20,
          paddingHorizontal: 20,
          flexDirection: "row",
          justifyContent: "space-between"
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <Image
            source={
              item?.user_detail?.profile_picture
                ? { uri: item?.user_detail?.profile_picture }
                : profile
            }
            style={{
              height: (61 / 375) * width,
              width: (61 / 375) * width,
              borderRadius: (31 / 375) * width
            }}
          />
          <View style={{ justifyContent: "center", marginLeft: 15 }}>
            {/* letterCapitalize */}
            <Text
              text={
                item?.user_detail?.first_name
                  ? letterCapitalize(item?.user_detail?.first_name) +
                    " " +
                    letterCapitalize(item?.user_detail?.last_name)
                  : letterCapitalize(item?.user_detail?.username)
              }
              bold
              style={{ fontSize: 12 }}
            />
            {item?.user_detail?.first_name && (
              <Text
                text={item?.user_detail?.username}
                style={{ color: "#D3D3D3", fontSize: 12 }}
              />
            )}
          </View>
        </View>
        <TouchableOpacity onPress={() => [followUnfollowUser(item)]}>
          <Image
            source={
              followUser.includes(item?.user_detail?.id)
                ? followingButton
                : followButton
            }
            style={{
              height: (60 / 375) * width,
              width: (110 / 375) * width
            }}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <View style={{ flex: 1 }}>
        <View
          style={{ paddingHorizontal: 20, flexDirection: "row", marginTop: 20 }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center"
            }}
          >
            <TouchableOpacity
              style={{
                paddingVertical: 5,
                width: "30%"
              }}
              onPress={() => {
                route.params?.isFeed
                  ? navigation.goBack()
                  : navigation.navigate("Feeds")
              }}
            >
              <Image source={backImage} style={{ height: 20, width: 30 }} />
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1.5 }}>
            <Text text="People" style={{ fontSize: 22 }} bold />
          </View>
        </View>
        <View
          style={{
            paddingHorizontal: 20,
            paddingBottom: 8,
            marginTop: 30,
            flexDirection: "row"
          }}
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
            onChangeText={e => {
              setSearchText(e)
              props.getUserProfile(e, 1, setNextPage)
            }}
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
        {requesting && profileUserData?.length === 0 ? (
          <View style={{ marginHorizontal: 25, marginTop: 10 }}>
            {Array(8)
              .fill()
              .map(() => (
                <SkeletonPlaceholder borderRadius={4}>
                  <SkeletonPlaceholder.Item
                    flexDirection="row"
                    alignItems="center"
                    marginTop={10}
                  >
                    <SkeletonPlaceholder.Item
                      width={60}
                      height={60}
                      borderRadius={50}
                    />
                    <SkeletonPlaceholder.Item marginLeft={20}>
                      <SkeletonPlaceholder.Item width={260} height={40} />
                    </SkeletonPlaceholder.Item>
                  </SkeletonPlaceholder.Item>
                </SkeletonPlaceholder>
              ))}
          </View>
        ) : profileUserData?.length ? (
          <FlatList
            nestedScrollEnabled={false}
            data={profileUserData && profileUserData}
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 10 }}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            onRefresh={() => {
              setRefresh(true)
              setNextPage("")
              props.getUserProfile("", 1, setNextPage)
              setRefresh(false)
            }}
            removeClippedSubviews={true}
            // initialNumToRender={10}
            numColumns={1}
            refreshing={refresh}
            onEndReachedThreshold={0.5}
            onEndReached={onEndReached}
            keyboardShouldPersistTaps="handled"
            windowSize={250}
            ListFooterComponent={
              requesting ? (
                <View style={{ height: 50 }}>
                  <ActivityIndicator
                    color="black"
                    size="large"
                    style={{ flex: 1 }}
                  />
                </View>
              ) : null
            }
            ListEmptyComponent={() => (
              <View style={styles.loaderStyle}>
                <Text style={{ fontSize: 18 }}>No record found</Text>
              </View>
            )}
          />
        ) : (
          // </View>
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <Text text="No Record Found" />
          </View>
        )}
      </View>
      <Modal
        coverScreen={true}
        // animationType="slide"
        visible={loading}
        onRequestClose={() => {
          setLoading(!loading)
        }}
        style={{
          padding: 0,
          margin: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)"
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <ActivityIndicator size={"large"} color={"white"} />
        </View>
      </Modal>
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
  requesting: state.userProfileReducer.requesting,
  profileUserData: state.userProfileReducer.profileUserData,
  userProfile: state.login.userDetail
})

const mapDispatchToProps = dispatch => ({
  getUserProfile: (data, nextPage, setNextPage) =>
    dispatch(getUserProfile(data, nextPage, setNextPage)),
  followUser: data => dispatch(followUser(data)),
  unFollowUser: data => dispatch(unFollowUser(data)),
  userChat: data => dispatch(userChat(data)),
  routeData: data => dispatch(routeData(data))
})
export default connect(mapStateToProps, mapDispatchToProps)(SearchProfile)
