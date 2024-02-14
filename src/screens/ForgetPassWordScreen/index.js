import React, { useState } from "react"
import { connect } from "react-redux"

// components
import {
  View,
  Image,
  Platform,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  Text,
  TextInput
} from "react-native"

import LinearGradient from "react-native-linear-gradient"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"

// redux
import { forgetPassWord } from "../../ScreenRedux/loginRedux"
import { Gutters, Layout, Global, Colors, Fonts, Images } from "../../theme"

const ForgetPassWordScreen = props => {
  const {
    requesting,
    navigation: { goBack }
  } = props

  const [email, setEmail] = useState("")
  const { small2xHPadding } = Gutters
  const {
    row,
    fill,
    center,
    fullWidth,
    alignItemsEnd,
    alignItemsCenter,
    justifyContentEnd,
    justifyContentStart,
    justifyContentBetween
  } = Layout
  const { leftArrow } = styles

  const SendEmail = async () => {
    props.forgetPassWord({ email: email })
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity
          style={[
            leftArrow,
            {
              ...Platform.select({
                ios: { top: 50 },
                android: { top: 20 }
              })
            }
          ]}
          onPress={() => goBack()}
        >
          <Image
            source={Images.backImage}
            style={{ width: 30, height: 20, resizeMode: "contain" }}
          />
        </TouchableOpacity>

        <View style={[fill, center]}>
          <View style={[center, fullWidth, { flex: 0.3 }]}>
            <View style={[fill, justifyContentEnd, alignItemsEnd]}>
              <Image source={Images.orumIcon} style={styles.logo} />
            </View>
          </View>
          <View style={[fill, justifyContentEnd, alignItemsCenter, fullWidth]}>
            <View
              style={[
                fullWidth,
                justifyContentBetween,
                alignItemsCenter,
                { flex: 0.3 }
              ]}
            >
              <View style={[justifyContentStart, fullWidth, small2xHPadding]}>
                <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                  <View style={[fullWidth]}>
                    <TextInput
                      keyboardType="email-address"
                      value={email}
                      onChangeText={value => setEmail(value)}
                      style={[styles.inputStyle, { marginTop: 9 }]}
                      placeholder={"Enter your email"}
                      placeholderTextColor={"#626262"}
                    />
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </View>
            <View style={[row, center, { flex: 0.4 }]}>
              <TouchableOpacity
                onPress={() => SendEmail()}
                disabled={!email || requesting}
                style={{ flex: 0.6 }}
              >
                <LinearGradient
                  style={styles.sendEmailButton}
                  colors={["#048ECC", "#0460BB", "#0480C6"]}
                >
                  {props.requesting ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text style={styles.sendEmailText}>Send Email</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  inputWrapper: {
    borderBottomWidth: 1,
    borderColor: "gray"
  },
  leftArrow: {
    zIndex: 22,
    left: 10,
    width: 50,
    height: 50,
    position: "absolute"
  },
  iconWrapper: {
    fontSize: 50
  },
  logo: {
    width: 300,
    height: 100,
    resizeMode: "contain"
  },
  letsStartButton: {
    width: 250,
    height: 40,
    borderColor: "white",
    borderRadius: 10
  },
  orText: {
    fontSize: 17,
    color: Colors.black,
    fontWeight: "500"
  },
  buttonLoginTextStyle: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: "500"
  },
  sendEmailButton: {
    height: 53,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center"
  },
  inputStyle: {
    height: 53,
    borderRadius: 8,
    borderColor: "#C4C4C4",
    borderWidth: 1,
    paddingHorizontal: 10,
    color: "black"
  },
  sendEmailText: { fontSize: 16, color: "white", fontWeight: "700" }
})

const mapStateToProps = state => ({
  requesting: state.login.forgotRequest
})

const mapDispatchToProps = dispatch => ({
  forgetPassWord: data => dispatch(forgetPassWord(data))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ForgetPassWordScreen)
