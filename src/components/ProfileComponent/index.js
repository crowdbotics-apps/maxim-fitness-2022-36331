import React from "react"
import { View, Platform, StyleSheet, TouchableOpacity } from "react-native"
import Text from "../Text"
import Icon from "react-native-vector-icons/FontAwesome5"

import { Layout, Gutters, Colors, Images } from "../../theme"
import ProfileHeaderFeed from "../ProfileHeaderFeed"
import { useNavigation } from '@react-navigation/native';


const ProfileComponent = ({
  currentTab,
  setCurrentTab,
  onPressNotify,
  onPressMsg,
  onPressSocial,
  unreadCount,
  profile,
  countUnread
}) => {
  const {
    row,
    fill,
    center,
    alignItemsStart,
    alignItemsCenter,
    justifyContentEnd,
    justifyContentCenter,
    justifyContentStart,
    justifyContentBetween
  } = Layout
  const { regularLMargin, smallVPadding, regularHMargin } = Gutters
  const navigation = useNavigation()
  return (
    <View
      style={[
        row,
        smallVPadding,
        regularHMargin,
        alignItemsCenter,
        justifyContentBetween
      ]}
    >
      <ProfileHeaderFeed
        imageUrl={
          profile && profile?.profile_picture
            ? { uri: profile?.profile_picture }
            : Images.profile
        }
        onAvatarChange={() => navigation.navigate("SettingScreen")}
        style={[fill, justifyContentStart, alignItemsStart]}
      />
      <View style={[row, justifyContentCenter, styles.currentTabStyle]}>
        <TouchableOpacity
          style={[
            fill,
            center,
            Platform.OS === "ios" && currentTab === 0
              ? {
                borderBottomWidth: 2,
                borderBottomColor: Colors.azureradiance
              }
              : { borderBottomWidth: 2, borderBottomColor: "white" }
          ]}
          onPress={() => setCurrentTab(0)}
        >
          <Text
            style={[
              currentTab === 0
                ? styles.bottomBorderStyle
                : styles.bottomBorderStyleActive,
              styles.currentTabText
            ]}
            text="My Stats"
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            fill,
            center,
            Platform.OS === "ios" && currentTab === 1
              ? {
                borderBottomWidth: 2,
                borderBottomColor: Colors.azureradiance
              }
              : { borderBottomWidth: 2, borderBottomColor: "white" }
          ]}
          onPress={onPressSocial}
        >
          <Text
            style={[
              currentTab === 1
                ? styles.bottomBorderStyle
                : styles.bottomBorderStyleActive,
              styles.currentTabText
            ]}
            text="Social"
          />
        </TouchableOpacity>
      </View>
      <View style={[row, fill, alignItemsCenter, justifyContentEnd]}>
        <TouchableOpacity onPress={onPressNotify}>
          <Icon type="FontAwesome5" name="bell" size={25} color="#626262" />
          {true && unreadCount && (
            <View
              style={[
                styles.notificationStyle,
                {
                  width: unreadCount > 99 ? 25 : 21,
                  height: unreadCount > 99 ? 23 : 21
                }
              ]}
            >
              <Text
                text={unreadCount > 99 ? "+99" : unreadCount}
                style={styles.notificationStyleText}
              />
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity style={regularLMargin} onPress={onPressMsg}>
          <Icon
            type="FontAwesome5"
            name="comment-alt"
            // style={{ fontSize: 25, color: "black" }}
            size={25}
            color="#626262"
          />
          {countUnread ? (
            <View style={styles.messageStyle}>
              <Text text={countUnread} style={styles.messageStyleText} />
            </View>
          ) : null}
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  currentTabStyle: {
    width: 140,
    height: 30
  },
  currentTabText: {
    fontSize: 15,
    lineHeight: 15,
    paddingVertical: 5
  },
  bottomBorderStyle: {
    color: Colors.black,
    borderBottomWidth: 2,
    borderBottomColor: Colors.azureradiance,
    fontWeight: "bold"
  },
  bottomBorderStyleActive: {
    color: Colors.alto,
    borderBottomWidth: 2,
    borderBottomColor: Colors.white
  },
  messageStyle: {
    top: -10,
    width: 23,
    right: -10,
    height: 23,
    borderRadius: 100,
    position: "absolute",
    backgroundColor: "red"
  },
  messageStyleText: {
    fontSize: 12,
    marginTop: 3,
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  notificationStyle: {
    borderRadius: 100,
    backgroundColor: "red",
    position: "absolute",
    top: -10,
    right: -10
  },
  notificationStyleText: {
    textAlign: "center",
    fontSize: 12,
    fontWeight: "bold",
    color: "white",
    marginTop: 3
  }
})

export default ProfileComponent
