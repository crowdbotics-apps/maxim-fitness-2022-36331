import React from "react"
import {
  View,
  Image,
  Dimensions,
  StyleSheet,
  TouchableOpacity
} from "react-native"
import { useNavigation } from "@react-navigation/native"
//Libraries
import ProgressBar from "react-native-progress/Bar"
//Themes
import { Images, Gutters, Layout } from "../../../theme"

const HeaderTitle = props => {
  const { percentage, showBackButton, isHome } = props
  const navigation = useNavigation()
  const deviceWidth = Dimensions.get("window").width

  return (
    <>
      <View
        style={[
          Layout.row,
          Gutters.small2xHMargin,
          Layout.alignItemsCenter,
          !showBackButton
            ? Layout.justifyContentCenter
            : Layout.justifyContentBetween
        ]}
      >
        {showBackButton ? (
          <TouchableOpacity
            style={Layout.fill}
            onPress={() => navigation.goBack()}
          >
            <Image source={Images.backIcon} style={styles.leftArrowStyle} />
          </TouchableOpacity>
        ) : (
          <View style={Layout.fill} />
        )}
        <Image
          source={Images.orumIcon}
          style={[Gutters.regularVMargin, styles.logoStyle]}
        />

        <View style={Layout.fill} />
      </View>
      {!isHome && (
        <View style={[Layout.justifyContentCenter, Layout.alignItemsCenter]}>
          <ProgressBar
            height={15}
            borderRadius={0}
            color={"#317fbd"}
            progress={percentage}
            width={deviceWidth - 40}
            unfilledColor={"#d3d3d3"}
            borderColor={"#f2f2f2"}
          />
        </View>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  leftArrowStyle: {
    height: 20,
    width: 10,
    resizeMode: "contain"
  },
  logoStyle: {
    height: 40,
    width: 165,
    resizeMode: "contain"
  }
})

export default HeaderTitle
