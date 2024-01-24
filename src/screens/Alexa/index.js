import React, { useState } from "react"
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Alert
} from "react-native"
import Modal from "react-native-modal"
import { Button, Text } from "../../components"
import { Colors, Global, Gutters, Layout, Images } from "../../theme"
import { WebView } from "react-native-webview"

const Alexa = props => {
  const { navigation } = props
  const [isVisible, setIsVisible] = useState(false)
  const [currentTab, setCurrentTab] = useState(true)

  const [openWebView, setOpenWebView] = useState(false)
  const [webViewUrls, setWebViewUrls] = useState("")

  const {
    row,
    fill,
    justifyContentCenter,
    alignItemsCenter,
    justifyContentBetween,
    justifyContentAround
  } = Layout
  const { secondaryBg, topLRBorderRadius20, halfOpacityBg } = Global
  const {
    regularVMargin,
    zeroMargin,
    zeroPadding,
    mediumTMargin,
    smallVMargin,
    largeTPadding,
    largeBPadding
  } = Gutters

  return (
    <View style={{ backgroundColor: "white", flex: 1 }}>
      {!openWebView ? (
        <View>
          {currentTab ? (
            <ScrollView
              contentContainerStyle={{ flexGrow: 1 }}
              showsVerticalScrollIndicator={false}
            >
              <View
                style={[
                  fill,
                  alignItemsCenter,
                  secondaryBg,
                  zeroMargin,
                  zeroPadding
                ]}
              >
                <View
                  style={[
                    fill,
                    justifyContentAround,
                    largeTPadding,
                    largeBPadding
                  ]}
                >
                  <View style={[row, fill, justifyContentBetween]}>
                    <Image
                      source={Images.avatarIcon}
                      style={{ width: 90, height: 90, resizeMode: "contain" }}
                    />
                    <Image
                      source={Images.loading}
                      style={{ width: 140, height: 100, resizeMode: "contain" }}
                    />
                    <Image
                      source={Images.alexa3}
                      style={{ width: 120, height: 120, resizeMode: "contain" }}
                    />
                  </View>
                  <Text
                    style={styles.topTextStyle4}
                    bold
                    center
                    text={"Link Orum Training\n" + "With Alexa"}
                  />
                </View>
                <View
                  center
                  style={[fill, justifyContentBetween, alignItemsCenter]}
                >
                  <View style={[fill, justifyContentBetween]}>
                    <Text
                      style={[mediumTMargin, styles.topTextStyle]}
                      bold
                      center
                      text={
                        "Enable the Orum Training skill\n and link your account with Alexa"
                      }
                    />
                  </View>
                  <View style={[fill, justifyContentBetween]}>
                    <Text
                      style={[smallVMargin, styles.topTextStyle3]}
                      center
                      text={
                        "To unlink your account at anytime,\n" +
                        "disable the Orum Training skill\n" +
                        "in the Alexa app"
                      }
                    />
                  </View>
                  <View
                    style={[
                      fill,
                      row,
                      alignItemsCenter,
                      justifyContentBetween,
                      { marginHorizontal: 15, marginTop: "30%" }
                    ]}
                  >
                    <Button
                      border
                      block
                      style={[
                        fill,
                        {
                          height: 60,
                          // marginHorizontal: 20,
                          backgroundColor: "#d5d5d5",
                          borderColor: "#d5d5d5"
                        }
                      ]}
                      text={"Cancel"}
                      textStyle={{
                        fontSize: 20,
                        lineHeight: 22,
                        color: "#000"
                      }}
                      onPress={() => navigation.goBack()}
                    />
                    <View style={{ width: 15 }} />
                    <Button
                      border
                      block
                      style={[
                        fill,
                        {
                          height: 60,
                          // marginHorizontal: 20,
                          backgroundColor: "#56c1ff",
                          borderColor: "#56c1ff"
                        }
                      ]}
                      textStyle={{
                        fontSize: 20,
                        lineHeight: 22,
                        color: "white"
                      }}
                      text={"Link"}
                      onPress={() => setIsVisible(true)}
                    />
                  </View>
                </View>
              </View>
            </ScrollView>
          ) : (
            <ScrollView
              contentContainerStyle={{ flexGrow: 1, paddingBottom: 30 }}
              showsVerticalScrollIndicator={false}
            >
              <View
                style={[
                  fill,
                  alignItemsCenter,
                  secondaryBg,
                  zeroMargin,
                  zeroPadding
                ]}
              >
                <View
                  style={[
                    fill,
                    justifyContentCenter,
                    largeTPadding,
                    largeBPadding
                  ]}
                >
                  <Text
                    style={styles.topTextStyle5}
                    bold
                    center
                    text={"Congratulations!"}
                  />
                  <Text
                    style={[largeTPadding, styles.topTextStyle3]}
                    center
                    text={
                      "To unlink your account at anytime,\n" +
                      "disable the Orum Training skill\n" +
                      "in the Alexa app"
                    }
                  />
                </View>
                <View
                  center
                  style={[fill, justifyContentBetween, alignItemsCenter]}
                >
                  <View
                    style={[
                      fill,
                      largeBPadding,
                      largeTPadding,
                      justifyContentBetween
                    ]}
                  >
                    <Text
                      style={[mediumTMargin, styles.topTextStyle]}
                      bold
                      center
                      text={
                        "Enable the Orum Training skill\n and link your account with Alexa"
                      }
                    />
                  </View>
                  <View style={[row, fill, justifyContentBetween]}>
                    <Image
                      source={Images.alexa3}
                      style={{ width: 120, height: 120, resizeMode: "contain" }}
                    />
                  </View>
                  <View
                    style={[
                      fill,
                      largeBPadding,
                      largeTPadding,
                      justifyContentBetween
                    ]}
                  >
                    <Text
                      style={[smallVMargin, styles.topTextStyle3]}
                      center
                      text={
                        "Start by saying: “Alexa, log my\n" +
                        "first meal on the Orum Training app"
                      }
                    />
                  </View>
                  <View
                    style={[fill, row, alignItemsCenter, justifyContentBetween]}
                  >
                    <Button
                      border
                      block
                      style={[
                        fill,
                        {
                          height: 60,
                          marginHorizontal: 20,
                          backgroundColor: "#d5d5d5",
                          borderColor: "#d5d5d5"
                        }
                      ]}
                      text={"Close"}
                      textStyle={{
                        fontSize: 20,
                        color: "#000",
                        lineHeight: 22
                      }}
                      onPress={() => {
                        setCurrentTab(!currentTab)
                        navigation.navigate("Profile")
                      }}
                    />
                  </View>
                </View>
              </View>
            </ScrollView>
          )}
          <Modal
            transparent={true}
            animationType="false"
            visible={isVisible}
            onRequestClose={() => {
              setIsVisible(!isVisible)
            }}
            style={[zeroMargin, zeroPadding, halfOpacityBg]}
          >
            <ScrollView
              contentContainerStyle={{ flexGrow: 1, paddingBottom: 90 }}
              showsVerticalScrollIndicator={false}
            >
              <TouchableOpacity
                style={{ height: "12%" }}
                onPress={() => setIsVisible(!isVisible)}
              />
              <View
                style={[
                  fill,
                  alignItemsCenter,
                  secondaryBg,
                  zeroMargin,
                  zeroPadding,
                  topLRBorderRadius20
                ]}
              >
                <Text
                  style={[mediumTMargin, styles.topTextStyle]}
                  bold
                  center
                  text={"Tracking your diet\n is now easier"}
                />
                <Image source={Images.alexa} />
                <Image source={Images.alexa2} />
                <Text
                  style={[smallVMargin, styles.topTextStyle2]}
                  center
                  text={"amazon alexa"}
                />
                <Text
                  style={[mediumTMargin, styles.topTextStyle]}
                  bold
                  center
                  text={"Want to connect to Alexa?"}
                />
                <Text center style={mediumTMargin}>
                  <Text
                    style={[smallVMargin, styles.topTextStyle3]}
                    center
                    text={"Click "}
                  />
                  <Text
                    style={[smallVMargin, styles.topTextStyle3]}
                    center
                    bold
                    text={"Allow "}
                  />
                  <Text
                    style={[smallVMargin, styles.topTextStyle3]}
                    center
                    text={" to link\n" + "Orum Training to Alexa"}
                  />
                </Text>
                <Button
                  full
                  border
                  style={[
                    mediumTMargin,
                    {
                      height: 60,
                      marginHorizontal: 30,
                      backgroundColor: "#56c1ff",
                      borderColor: "#56c1ff"
                    }
                  ]}
                  textStyle={{ fontSize: 20, lineHeight: 22, color: "white" }}
                  text={"Allow"}
                  onPress={() => {
                    setOpenWebView(true)
                    setIsVisible(!isVisible)
                    // Linking.openURL('https://orumtraining-23610.botics.co/o/authorize/?response_type=code&client_id=cOfn7YQGjnKboiTSIYXzkssbuNqyHwz7whNuJdxc&redirect_uri=https://orumtraining-23610.botics.co/')
                    // <WebView source={{ uri: 'https://orumtraining-23610.botics.co/o/authorize/?response_type=code&client_id=cOfn7YQGjnKboiTSIYXzkssbuNqyHwz7whNuJdxc&redirect_uri=https://orumtraining-23610.botics.co/' }} />
                  }}
                />
                <Button
                  full
                  border
                  style={[
                    regularVMargin,
                    {
                      height: 60,
                      marginHorizontal: 30,
                      backgroundColor: "#fff",
                      borderColor: "#ff654f"
                    }
                  ]}
                  text={"Don't Allow"}
                  textStyle={{ fontSize: 20, lineHeight: 22, color: "#ff654f" }}
                  onPress={() => setIsVisible(false)}
                />
              </View>
            </ScrollView>
          </Modal>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <WebView
            source={{
              uri: "https://orumtraining-23610.botics.co/o/authorize/?response_type=code&client_id=cOfn7YQGjnKboiTSIYXzkssbuNqyHwz7whNuJdxc&redirect_uri=https://orumtraining-23610.botics.co/"
            }}
            onNavigationStateChange={navState => {
              setWebViewUrls(navState.url)
            }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={false}
          />
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  topTextStyle: {
    fontSize: 24,
    lineHeight: 26,
    color: "rgba(0,0,0,0.8)"
  },
  topTextStyle2: {
    fontSize: 24,
    lineHeight: 26,
    color: "rgba(0,0,0,0.8)"
  },
  topTextStyle3: {
    fontSize: 24,
    lineHeight: 26,
    color: "rgba(0,0,0,0.8)"
  },
  topTextStyle4: {
    fontSize: 28,
    lineHeight: 30,
    color: "rgba(0,0,0,0.8)"
  },
  topTextStyle5: {
    fontSize: 38,
    lineHeight: 42,
    color: "#000"
  },
  doneWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  imageWrapper: {
    width: 20,
    height: 20
  },
  mainImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover"
  },
  lineStyle: { borderWidth: 1, width: 40, height: 1 },
  inputModalStyle: {
    paddingHorizontal: 8,
    borderRadius: 6,
    borderColor: Colors.nobel
  },
  modalButton: { height: 50 },
  inputStyle: { height: 50, backgroundColor: "#f5f5f5" },
  modalCrossIcon: { margin: 10 },
  buttonWrapper: {
    marginTop: 2
  },
  modalImageStyle: {
    borderRadius: 20,
    width: 170,
    height: 170,
    resizeMode: "contain"
  },
  leftIconStyle: {
    left: 20,
    zIndex: 22,
    top: 0
  },
  leftImageStyle: { width: 30, height: 30, resizeMode: "contain" },
  timerStyle: { height: 30 }
})

export default Alexa
