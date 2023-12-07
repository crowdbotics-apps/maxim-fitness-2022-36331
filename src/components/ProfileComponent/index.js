import React from "react"
import { View, Platform, StyleSheet, TouchableOpacity } from "react-native"
import Text from "../Text"
import Icon from "react-native-vector-icons/FontAwesome5"

import { Layout, Gutters, Colors, Images } from "../../theme"
import ProfileHeaderFeed from "../ProfileHeaderFeed"

const ProfileComponent = ({
  currentTab,
  setCurrentTab,
  onPressNotify,
  onPressMsg,
  onPressSocial,
  unreadCount,
  profile
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
          <Icon type="FontAwesome5" name="bell" style={{ fontSize: 25 }} />
          {true && unreadCount && (
            <View style={true ? styles.notificationStyle : ""}>
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
            color="#000"
          />
          {true && (
            <View style={styles.messageStyle}>
              <Text text={"2"} style={styles.messageStyleText} />
            </View>
          )}
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
    width: 21,
    right: -10,
    height: 21,
    borderRadius: 100,
    position: "absolute",
    backgroundColor: "red"
  },
  messageStyleText: {
    fontSize: 12,
    marginTop: 2,
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  notificationStyle: {
    width: 21,
    height: 21,
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
    marginTop: 2
  }
})

export default ProfileComponent
