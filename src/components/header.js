import React, { useState } from "react"
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
  Image
} from "react-native"
import { Images } from "src/theme"
import Tooltip from "react-native-walkthrough-tooltip"
const {
  Logo,
  Incognito,
  Bell,
  Check_in,
  ForYou,
  DotIcon,
  Follow,
  ForYouOff,
  IncognitoOff,
  FollowOff
} = Images

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen"

export const Header = ({ isShow, onPress }) => {
  const [showTip, setTip] = useState(false)
  const [showImage, setShowImage] = useState("For You")

  const data = [
    { image: ForYouOff, title: "For You", heightY: 22, widthY: 17, leftY: 16 },
    { image: Follow, title: "Following", heightY: 18, widthY: 22, leftY: 12 },
    {
      image: IncognitoOff,
      title: "Incognito",
      heightY: 13,
      widthY: 22,
      leftY: 12
    }
  ]

  return (
    <View style={styles.mainHeader}>
      <View style={styles.logoStye}>
        <Image source={Check_in} style={{ height: 25, width: 25 }} />

        <View style={styles.subMain}>
          <Image source={Logo} style={{ height: 32.84, width: 100 }} />

          <Tooltip
            isVisible={showTip}
            showTip={true}
            animated={true}
            arrowSize={{ width: 16, height: 8 }}
            backgroundColor="rgba(0,0,0,0)"
            tooltipStyle={{
              marginTop: wp("11%"),
              marginLeft: wp("15%")
            }}
            contentStyle={{ backgroundColor: "#636971", width: wp("35%") }}
            content={
              <View>
                {data.map((item, index) => (
                  <TouchableOpacity
                    onPress={() => {
                      setShowImage(item.title), setTip(false)
                    }}
                    style={styles.tooltipContentStyle}
                  >
                    <Image
                      source={item.image}
                      style={{ height: item.heightY, width: item.widthY }}
                    />
                    <Text
                      style={[styles.textStyle, { marginLeft: item.leftY }]}
                    >
                      {item.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            }
            placement="top"
            onClose={() => setTip(false)}
            useInteractionManager={true}
            topAdjustment={
              Platform.OS === "android" ? -StatusBar.currentHeight : 10
            }
          ></Tooltip>

          <TouchableOpacity onPress={() => setTip(true)}>
            <Image
              source={
                showImage === "Following"
                  ? FollowOff
                  : showImage === "Incognito"
                  ? Incognito
                  : ForYou
              }
              style={{
                height:
                  showImage === "Following"
                    ? 22
                    : showImage === "Incognito"
                    ? 13.69
                    : 22,
                width:
                  showImage === "Following"
                    ? 22
                    : showImage === "Incognito"
                    ? 22
                    : 19
              }}
            />
          </TouchableOpacity>

          <TouchableOpacity style={{ flexDirection: "row" }}>
            <Image source={Bell} style={{ height: 22, width: 19 }} />
            <View style={styles.dotStyle}>
              <Image source={DotIcon} style={{ height: 12, width: 12 }} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  mainHeader: {
    marginVertical: 20,
    marginHorizontal: 20,
    //  backgroundColor:'none'
  },
  logoStye: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center"
  },
  subMain: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "65%"
  },
  dotStyle: {
    position: "absolute",
    marginLeft: 10
  },
  tooltipContentStyle: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "white"
  },
  textStyle: {
    fontSize: 14,
    lineHeight: 20,
    color: "#FFFFFF",
    fontWeight: "400"
  }
})
