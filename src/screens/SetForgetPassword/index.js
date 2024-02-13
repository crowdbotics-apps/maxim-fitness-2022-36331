import React, { useEffect, useState } from "react"
import { connect } from "react-redux"

// components
import {
  View,
  Image,
  Platform,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  TextInput
} from "react-native"
import { Text } from "../../components"
// redux
import { forgetPassWordConfirm } from "../../ScreenRedux/loginRedux"
import { Gutters, Layout, Global, Colors, Images } from "../../theme"

import LinearGradient from "react-native-linear-gradient"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"

const SetForgetPassword = props => {
  const {
    requesting,
    navigation: { goBack }
  } = props

  const [token, setToken] = useState(false)
  const [password, setPassword] = useState(false)
  const [passwordError, setPasswordError] = useState(false)

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
  const { secondaryBg } = Global
  const { leftArrow } = styles

  const ResetPassWord = async () => {
    const data = {
      token: token,
      password: password
    }
    props.forgetPassWordConfirm(data)
  }

  let regEx = /(?=^.{8,16}$)(?=.*\d)(?=.*\W+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/

  useEffect(() => {
    if (password) {
      regEx.test(password) ? setPasswordError(false) : setPasswordError(true)
    } else {
      setPasswordError(false)
    }
  }, [password])

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

        <View style={[fill, center, fullWidth]}>
          <SafeAreaView style={secondaryBg} />
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
              <View
                style={[fill, justifyContentStart, fullWidth, small2xHPadding]}
              >
                <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                  <View>
                    <View style={[fullWidth]}>
                      <TextInput
                        keyboardType="numeric"
                        value={token}
                        maxLength={4}
                        onChangeText={value => setToken(value)}
                        style={[styles.inputStyle, { marginTop: 9 }]}
                        placeholder="Token"
                        placeholderTextColor="#525252"
                      />
                    </View>
                    <View style={[fullWidth]}>
                      <TextInput
                        secureTextEntry={true}
                        value={password}
                        onChangeText={value => setPassword(value)}
                        style={[styles.inputStyle, { marginTop: 18 }]}
                        placeholder="Enter new Password"
                        placeholderTextColor="#525252"
                      />
                    </View>
                    <>
                      {passwordError && (
                        <Text style={{ color: "red", marginTop: 10 }}>
                          Password must be minimum length 8 and maximum length
                          16 characters (with at least a lowercase letter and
                          uppercase letter, a number and special character).
                        </Text>
                      )}
                    </>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </View>
            <View style={[row, center, { flex: 0.4 }]}>
              <TouchableOpacity
                onPress={() => ResetPassWord()}
                disabled={passwordError || !password || !token || requesting}
                style={{ flex: 0.6 }}
              >
                <LinearGradient
                  style={styles.sendEmailButton}
                  colors={["#048ECC", "#0460BB", "#0480C6"]}
                >
                  {props.requesting ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text style={styles.sendEmailText}>Set Password</Text>
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
    borderColor: "gray",
    marginBottom: 12
  },
  passwordInput: {
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
    borderColor: "gray",
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
  inputStyle: {
    height: 53,
    borderRadius: 8,
    borderColor: "#C4C4C4",
    borderWidth: 1,
    paddingHorizontal: 10,
    color: "black"
  },
  sendEmailButton: {
    height: 53,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center"
  },
  sendEmailText: { fontSize: 16, color: "white", fontWeight: "700" }
})
const mapStateToProps = state => ({
  requesting: state.login.forgotRequest
})

const mapDispatchToProps = dispatch => ({
  forgetPassWordConfirm: data => dispatch(forgetPassWordConfirm(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(SetForgetPassword)
