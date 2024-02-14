import React, { useEffect, useState } from "react"
import {
  Text,
  View,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity
} from "react-native"
import options from "./options"
import { fetchNotifications } from "./api"
import { useDispatch, useSelector } from "react-redux"
//action
import { getPost } from "../../src/ScreenRedux/viewPostRedux"
import { routeData } from "../../src/ScreenRedux/profileRedux"

import { getNotificationCountSuccess } from "../../src/ScreenRedux/nutritionRedux"
import moment from "moment"
import { Images } from "../../src/theme"
import { Loader } from "../../src/components"

const Notifications = props => {
  const {
    navigation: { navigate }
  } = props
  const { styles } = options
  const dispatch = useDispatch()
  const requesting = useSelector(state => state?.postReducer?.requesting)
  // Contains the messages recieved from backend
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [nextPage, setNextPage] = useState(1)
  const [refresh, setRefresh] = useState(false)

  const getNotifications = async page => {
    setLoading(true)
    const res = await fetchNotifications(page)
    if (page === 1) {
      setNotifications(res?.results)
    } else {
      setNotifications(prevNotifications => [
        ...prevNotifications,
        ...res?.results
      ])
    }

    setLoading(false)
    if (res?.count) {
      getNotificationCountSuccess(0)
    }

    setNextPage(res?.next ? res?.next?.split("?page=")[1] : 1)
  }

  useEffect(() => {
    getNotifications(1)
  }, [])

  const onEndReached = () => {
    if (nextPage > 1) {
      getNotifications(nextPage)
    }
  }

  /**
   * Notification component that will be rendered in Flatlist
   * @param  {Object} item Object containing Notification details
   * @return {React.ReactNode}
   */

  const navigateScreen = item => {
    const validTitle = ["Follow", "UnFollow"]
    if (item?.post) {
      dispatch(getPost(item?.post, true))
    } else {
      if (validTitle.includes(item?.title)) {
        const newData = {
          follow: true,
          user: item?.sender_detail
        }
        dispatch(routeData(newData))
        navigate("ProfileScreen", {
          item: newData,
          backScreenName: "NotificationScreen"
        })
      }
    }
  }

  const renderItem = ({ item }) => {
    const date = item?.created
    const timeFormate = item?.created.toLocaleString()
    const arr = date.split("T")
    const time = moment(timeFormate).format("hh:mm A")

    return (
      <TouchableOpacity
        style={styles.walletCard}
        onPress={() => navigateScreen(item)}
      >
        <View style={styles.walletInner}>
          <View style={styles.imgContainer}>
            <Image
              source={
                item?.image
                  ? {
                      uri: item?.image
                    }
                  : Images.profile
              }
              style={styles.image}
            />
          </View>
          <View style={styles.walletCarder}>
            <Text style={styles.eventName}>{item?.title}</Text>
            <Text style={styles.eventType}>{item?.message}</Text>
          </View>
        </View>
        <View style={styles.leftSection}>
          <Text style={styles.view}>Date: {arr[0]}</Text>
          <Text style={styles.reject}>Time: {time}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <View style={{ flex: 1 }}>
      {requesting && <Loader />}

      {loading && !notifications?.length ? (
        <View style={styles.loaderStyle}>
          <ActivityIndicator color={"gray"} size="large" />
        </View>
      ) : (
        <FlatList
          data={notifications && notifications}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 10 }}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          onRefresh={() => {
            setRefresh(true)
            setNextPage(1)
            getNotifications(1)
            setRefresh(false)
          }}
          removeClippedSubviews={true}
          initialNumToRender={5}
          numColumns={1}
          refreshing={refresh}
          onEndReachedThreshold={0.5}
          onEndReached={onEndReached}
          windowSize={250}
          ListFooterComponent={
            loading ? (
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
              <Text style={{ fontSize: 18, color: "#626262" }}>
                No record found
              </Text>
            </View>
          )}
        />
      )}
    </View>
  )
}

export default Notifications
