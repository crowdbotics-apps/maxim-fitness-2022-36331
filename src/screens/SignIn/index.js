import React, {useEffect} from "react"
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
} from "react-native"
import LinearGradient from "react-native-linear-gradient"
import {
  GoogleSignin,
  statusCodes
} from "@react-native-google-signin/google-signin"
import {AccessToken, LoginManager} from "react-native-fbsdk"
import {Images} from "src/theme"
import {connect} from "react-redux"
import useForm from "../../utils/useForm"
import validator from "../../utils/validation"
//actions
import {
  loginUser,
  googleLoginUser,
  facebookLoginUser
} from "../../ScreenRedux/loginRedux"

const {
  backIcon,
  orumIcon,
  facebookButton,
  googleIcon,
  smallGoogleIcon,
  faceBookIcon
} = Images
const SignIn = props => {
  const {navigation} = props

  const stateSchema = {
    email: {
      value: "",
      error: ""
    },
    password: {
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
      required: true
      // validator: validator.password
    }
  }

  const {state, handleOnChange, disable} = useForm(
    stateSchema,
    validationStateSchema
  )

  const OnLogInPress = () => {
    let loginData = {
      username: state.email.value,
      password: state.password.value
    }
    props.loginUser(loginData)
  }

  useEffect(() => {
    GoogleSignin.configure({
      scopes: ["https://www.googleapis.com/auth/userinfo.profile"], // what API you want to access on behalf of the user, default is email and profile
      forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
      // iosClientId: '<FROM DEVELOPER CONSOLE>', // [iOS] if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
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
      let apiData = {access_token: myToken}
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
            let data = {access_token: token}
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

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: "#FFFFFF"}}>
      <ScrollView
        contentContainerStyle={{flexGrow: 1, paddingBottom: 60}}
        showsVerticalScrollIndicator={false}
      >
        <Image source={backIcon} style={styles.backIconStyle} />
        <View style={{marginHorizontal: 22}}>
          <View style={{alignItems: "center"}}>
            <Image source={orumIcon} style={styles.orumIcon} />
            <Text style={styles.mainTextStyle}>
              Create or login your account to start
            </Text>
            <Text style={styles.mainTextStyle}>training</Text>
          </View>
          <Text style={styles.getStarted}>Get Started With</Text>
          <TouchableOpacity
            style={[
              styles.fbCardcard,
              {
                marginTop: 9,
                height: 49,
                borderRadius: 10,
                paddingHorizontal: 15,
                flexDirection: "row"
              }
            ]}
            onPress={() => facebooksignUp()}
          >
            <View style={{justifyContent: "center", flex: 1}}>
              <Image source={faceBookIcon} style={{height: 19, width: 9}} />
            </View>
            {props.faceBookRequesting ? (
              <ActivityIndicator
                style={{flex: 6, marginRight: 30}}
                color="black"
              />
            ) : (
              <View style={{justifyContent: "center", flex: 2}}>
                <Text
                  style={{color: "white", fontSize: 14, fontWeight: "700"}}
                >
                  Login via Facebook
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.card,
              {
                marginTop: 16,
                height: 49,
                borderRadius: 10,
                paddingHorizontal: 15,
                flexDirection: "row"
              }
            ]}
            onPress={() => signInGoogle()}
          >
            <View style={{justifyContent: "center", flex: 1}}>
              <Image source={smallGoogleIcon} style={{}} />
            </View>
            {props.googleRequesting ? (
              <ActivityIndicator
                style={{flex: 6, marginRight: 30}}
                color="black"
              />
            ) : (
              <View style={{justifyContent: "center", flex: 2}}>
                <Text
                  style={{color: "#303042", fontSize: 14, fontWeight: "700"}}
                >
                  Login via Google
                </Text>
              </View>
            )}
          </TouchableOpacity>
          <Text style={styles.loginTextStyle}>Or Login with</Text>
          <View style={{marginHorizontal: 3}}>
            <TextInput
              keyboardType="email-address"
              onChangeText={value => handleOnChange("email", value)}
              style={[styles.inputStyle, {marginTop: 9}]}
              placeholder="Email"
            />
            <Text style={{color: "red"}}>{state.email.error}</Text>
            <TextInput
              secureTextEntry={true}
              onChangeText={value => handleOnChange("password", value)}
              style={[styles.inputStyle, {marginTop: 18}]}
              placeholder="Password"
            />
            <Text style={{color: "red"}}>{state.password.error}</Text>
            <Text
              style={{
                color: "#0460BB",
                fontWeight: "700",
                fontSize: 14,
                textAlign: "right",
                marginTop: 12
              }}
            >
              Forgot Password ?
            </Text>
            <TouchableOpacity onPress={() => OnLogInPress()} disabled={disable} style={{marginTop: 53,}}>
              <LinearGradient
                style={styles.logInButton}
                colors={["#048ECC", "#0460BB", "#0480C6"]}
              >
                {props.requesting ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.loginText}>Log in</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
            <View
              style={{
                marginTop: 23,
                flexDirection: "row",
                justifyContent: "center"
              }}
            >
              <Text>Don’t have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
                <Text style={{fontWeight: "700"}}>Sign Up </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  backIconStyle: {
    height: 16,
    width: 8,
    marginTop: 46,
    marginLeft: 22
  },
  orumIcon: {
    height: 80,
    width: 260,
    marginTop: 47,
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
  faceBookIcon: {width: "100%", height: 49, marginTop: 9},
  googleIcon: {width: "100%", height: 49},
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
    paddingHorizontal: 10
  },
  logInButton: {
    height: 53,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
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

  loginText: {fontSize: 16, color: "white", fontWeight: "700"}
})

const mapStateToProps = state => ({
  requesting: state.login.requesting,
  googleRequesting: state.login.googleRequesting,
  faceBookRequesting: state.login.faceBookRequesting
  // user: state.login.userDetail
})

const mapDispatchToProps = dispatch => ({
  loginUser: data => dispatch(loginUser(data)),
  googleLoginUser: data => dispatch(googleLoginUser(data)),
  facebookLoginUser: data => dispatch(facebookLoginUser(data))
})
export default connect(mapStateToProps, mapDispatchToProps)(SignIn)
