import React, { useEffect, useState } from "react"
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  Image,
  StatusBar,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Linking
} from "react-native"
import LinearGradient from "react-native-linear-gradient"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import {
  GoogleSignin,
  statusCodes
} from "@react-native-google-signin/google-signin"
import { AccessToken, LoginManager } from "react-native-fbsdk"
import { Images } from "src/theme"
import useForm from "../../utils/useForm"
import validator from "../../utils/validation"
import { connect } from "react-redux"

//actions
import { signUpUser } from "../../ScreenRedux/signUpRedux"

import {
  googleLoginUser,
  facebookLoginUser
} from "../../ScreenRedux/loginRedux"
import { API_URL } from "../../config/app"
import { showMessage } from "react-native-flash-message"

const { backIcon, orumIcon, smallGoogleIcon, faceBookIcon } = Images
const SignUp = props => {
  const [check, setCheck] = useState(false)
  const stateSchema = {
    email: {
      value: "",
      error: ""
    },
    password: {
      value: "",
      error: ""
    },
    firstName: {
      value: "",
      error: ""
    },
    lastName: {
      value: "",
      error: ""
    }
  }

  const validationStateSchema = {
    email: {
      required: true,
      validator: validator.email
    },
    password: {
      required: true,
      validator: validator.password
    },
    firstName: {
      required: true
    },
    lastName: {
      required: true
    }
  }

  const { state, handleOnChange, disable, setState } = useForm(
    stateSchema,
    validationStateSchema
  )

  const OnSignUpPress = () => {
    let signUpData = {
      email: state.email.value,
      password: state.password.value,
      first_name: state.firstName.value,
      last_name: state.lastName.value
    }
    props.signUpUser(signUpData)
  }

  useEffect(() => {
    GoogleSignin.configure({
      scopes: ["https://www.googleapis.com/auth/userinfo.profile"], // what API you want to access on behalf of the user, default is email and profile
      forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
      iosClientId:
        "146444618570-57mrfdva3ths48nhte71f12l7lqbu7t1.apps.googleusercontent.com", // [iOS] if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
      androidClientId:
        "146444618570-j1bm5q05buo6586id5eldmarctlad14e.apps.googleusercontent.com"
    })
  }, [])

  const signInGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices()
      const userInfo = await GoogleSignin.signIn()
      const myToken = await GoogleSignin.getTokens()

        .then(res => {
          return res.accessToken
        })
        .catch(err => console.log("err", err))
      let apiData = { access_token: myToken }
      myToken && props.googleLoginUser(apiData)
      // this.setState({ userInfo });
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  }

  const facebooksignUp = async () => {
    try {
      if (Platform.OS === "android") {
        LoginManager.setLoginBehavior("web_only")
      }
      const result = await LoginManager.logInWithPermissions([
        "email",
        "public_profile"
      ])

      if (result.isCancelled) {
      } else {
        await AccessToken.getCurrentAccessToken()
          .then(async res => {
            const token = res.accessToken.toString()
            let data = { access_token: token }
            props.facebookLoginUser(data)
          })
          .catch(err => {
            err
          })
      }
    } catch (err) {
      err
    }
  }

  const openPrivacyPolicy = () => {
    Linking.openURL(`${API_URL}/privacy-policy/`)
  }

  return (
    <SafeAreaView style={styles.mainContainer}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollViewStyle}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity onPress={() => props.navigation.goBack()}>
          <Image source={backIcon} style={styles.backIconStyle} />
        </TouchableOpacity>
        <View style={{ marginHorizontal: 22 }}>
          <View style={{ alignItems: "center" }}>
            <Image source={orumIcon} style={styles.orumIcon} />
            <Text style={styles.mainTextStyle}>
              Create or login your account to start
            </Text>
            <Text style={styles.mainTextStyle}>training</Text>
          </View>
          <Text style={styles.getStarted}>Get Register With</Text>
          <TouchableOpacity
            style={styles.fbCardcard}
            onPress={() => facebooksignUp()}
          >
            <View style={styles.imageStyle}>
              <Image source={faceBookIcon} style={styles.fbImageStyle} />
            </View>
            {props.faceBookRequesting ? (
              <ActivityIndicator style={styles.loaderStyle} color="black" />
            ) : (
              <View style={styles.loginTextContainer}>
                <Text style={styles.loginTxt}>Login via Facebook</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.card} onPress={() => signInGoogle()}>
            <View style={{ justifyContent: "center", flex: 1 }}>
              <Image source={smallGoogleIcon} />
            </View>
            {props.googleRequesting ? (
              <ActivityIndicator
                style={{ flex: 6, marginRight: 30 }}
                color="black"
              />
            ) : (
              <View style={{ justifyContent: "center", flex: 2 }}>
                <Text
                  style={{ color: "#303042", fontSize: 14, fontWeight: "700" }}
                >
                  Login via Google
                </Text>
              </View>
            )}
          </TouchableOpacity>
          <Text style={styles.loginTextStyle}>Or Register with</Text>
          <View style={{ marginHorizontal: 3 }}>
            <TextInput
              keyboardType="default"
              style={[styles.inputStyle, { marginTop: 9 }]}
              onChangeText={value => handleOnChange("firstName", value)}
              placeholder="First Name"
              placeholderTextColor="#525252"
            />
            <Text style={{ color: "red" }}>{state.firstName.error}</Text>
            <TextInput
              keyboardType="default"
              style={[
                styles.inputStyle,
                { marginTop: state.firstName.error ? 9 : 0 }
              ]}
              onChangeText={value => handleOnChange("lastName", value)}
              placeholder="Last Name"
              placeholderTextColor="#525252"
            />
            <Text style={{ color: "red" }}>{state.lastName.error}</Text>
            <TextInput
              keyboardType="email-address"
              style={[
                styles.inputStyle,
                { marginTop: state.lastName.error ? 9 : 0 }
              ]}
              onChangeText={value => handleOnChange("email", value)}
              placeholder="Email"
              placeholderTextColor="#525252"
            />
            <Text style={{ color: "red" }}>{state.email.error}</Text>
            <TextInput
              secureTextEntry={true}
              style={[
                styles.inputStyle,
                { marginTop: state.email.error ? 9 : 0 }
              ]}
              onChangeText={value => handleOnChange("password", value)}
              placeholder="Password"
              placeholderTextColor="#525252"
            />
            <Text style={{ color: "red" }}>{state.password.error}</Text>
            <View
              style={{
                height: 50,
                marginBottom: 20,
                flexDirection: "row",
                alignItems: "center"
              }}
            >
              <TouchableOpacity
                onPress={() => setCheck(!check)}
                style={{
                  borderWidth: 1,
                  borderColor: "#C4C4C4",
                  height: 20,
                  width: 20,
                  borderRadius: 5,
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                {check ? (
                  <Image
                    source={Images.check}
                    style={{ width: 18, height: 18 }}
                  />
                ) : null}
              </TouchableOpacity>
              <Text
                style={{
                  color: "#0460BB",
                  marginLeft: 10,
                  fontStyle: "italic"
                }}
                onPress={() => openPrivacyPolicy()}
              >
                {"I have accept terms & conditions"}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => OnSignUpPress()}
              disabled={disable || !check}
            >
              <LinearGradient
                style={[styles.logInButton]}
                colors={["#048ECC", "#0460BB", "#0480C6"]}
              >
                {props.requesting ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.loginText}>Register</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
            {/* <TouchableOpacity
              onPress={() => props.navigation.navigate("Subscription")}
              disabled={true}
            >
              <LinearGradient
                style={[styles.logInButton]}
                colors={["#048ECC", "#0460BB", "#0480C6"]}
              >
                {props.requesting ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.loginText}>Continue</Text>
                )} 
                <Text style={styles.loginText}>Continue</Text>
              </LinearGradient>
            </TouchableOpacity> */}
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: "#fff" },
  scrollViewStyle: { flexGrow: 1, paddingBottom: 30 },
  backIconStyle: {
    height: 16,
    width: 8,
    marginTop: 25,
    marginLeft: 22
  },
  orumIcon: {
    height: 80,
    width: 260,
    marginTop: 20,
    marginBottom: 16
  },
  mainTextStyle: {
    color: "#303042",
    fontWeight: "700",
    fontSize: 16
  },
  getStarted: {
    color: "#303042",
    fontWeight: "700",
    fontSize: 14,
    marginTop: 53
  },
  faceBookIcon: { width: "100%", height: 49, marginTop: 9 },
  googleIcon: { width: "100%", height: 49, marginTop: 16 },
  loginTextStyle: {
    color: "#303042",
    fontWeight: "400",
    fontSize: 14,
    marginTop: 53
  },
  inputStyle: {
    height: 53,
    borderRadius: 8,
    borderColor: "#C4C4C4",
    borderWidth: 1,
    paddingHorizontal: 10,
    color: "black"
  },
  logInButton: {
    height: 53,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 11
  },
  loginText: { fontSize: 16, color: "white", fontWeight: "700" },
  card: {
    marginTop: 16,
    height: 49,
    borderRadius: 10,
    paddingHorizontal: 15,
    flexDirection: "row",
    width: "100%",
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,

    elevation: 10
  },

  fbCardcard: {
    marginTop: 9,
    height: 49,
    borderRadius: 10,
    paddingHorizontal: 15,
    flexDirection: "row",
    width: "100%",
    backgroundColor: "#3C5A9A",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,

    elevation: 10
  },
  imageStyle: { justifyContent: "center", flex: 1 },
  fbImageStyle: { height: 19, width: 9 },
  loaderStyle: { flex: 6, marginRight: 30 },
  loginTextContainer: { justifyContent: "center", flex: 2 },
  loginTxt: { color: "white", fontSize: 14, fontWeight: "700" }
})

const mapStateToProps = state => ({
  requesting: state.signUpReducer.requesting,
  googleRequesting: state.login.googleRequesting,
  faceBookRequesting: state.login.faceBookRequesting
})

const mapDispatchToProps = dispatch => ({
  signUpUser: data => dispatch(signUpUser(data)),
  googleLoginUser: data => dispatch(googleLoginUser(data)),
  facebookLoginUser: data => dispatch(facebookLoginUser(data))
})
export default connect(mapStateToProps, mapDispatchToProps)(SignUp)
