import React, { useEffect, useState } from "react"
import {
  Text,
  View,
  FlatList,
  Image,
  ActivityIndicator,
  RefreshControl
} from "react-native"
import options from "./options"
import { fetchNotifications } from "./api"
import { getNotificationCountSuccess } from "../../src/ScreenRedux/nutritionRedux"
import moment from "moment"
import { Images } from "../../src/theme"

const Notifications = props => {
  const { navigation } = props
  const { styles } = options
  // Contains the messages recieved from backend
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [nextPage, setNextPage] = useState("")

  const getNotifications = async page => {
    setLoading(true)
    const res = await fetchNotifications(page)
    setNotifications(prevNotifications => [
      ...prevNotifications,
      ...res?.results
    ])

    setLoading(false)
    if (res?.count) {
      getNotificationCountSuccess(0)
    }

    setNextPage(res?.next ? res?.next?.split("?page=")[1] : res?.next)
  }

  useEffect(() => {
    getNotifications(1)
  }, [])

  const onEndReached = () => {
    nextPage !== null && getNotifications(nextPage)
  }

  /**
   * Notification component that will be rendered in Flatlist
   * @param  {Object} item Object containing Notification details
   * @return {React.ReactNode}
   */
  const renderItem = ({ item }) => {
    const date = item?.created

    const timeFormate = item?.created.toLocaleString()
    const arr = date.split("T")
    const time = moment(timeFormate).format("hh:mm A")

    return (
      <View style={styles.walletCard}>
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
      </View>
    )
  }

  return (
    <View style={{ flex: 1 }}>
      {loading && !nextPage ? (
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
            setNextPage("")
            getNotifications(1)
          }}
          removeClippedSubviews={true}
          initialNumToRender={5}
          numColumns={1}
          refreshing={loading}
          onEndReachedThreshold={0.5}
          onEndReached={onEndReached}
          windowSize={250}
          ListEmptyComponent={() => (
            <View style={styles.loaderStyle}>
              <Text style={{ fontSize: 18 }}>No record found</Text>
            </View>
          )}
        />
      )}
    </View>
  )
}

export default Notifications
