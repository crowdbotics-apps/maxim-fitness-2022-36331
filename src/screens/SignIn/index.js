import React from "react"
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  Image,
  StatusBar,
  Text
} from "react-native"
import LinearGradient from "react-native-linear-gradient"
import { Images } from "src/theme"
const { backIcon, orumIcon, facebookButton, googleIcon } = Images
const SignIn = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#E5E5E5" }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 60 }}>
        <Image source={backIcon} style={styles.backIconStyle} />
        <View style={{ marginHorizontal: 22 }}>
          <View style={{ alignItems: "center" }}>
            <Image source={orumIcon} style={styles.orumIcon} />
            <Text style={styles.mainTextStyle}>
              Create or login your account to start
            </Text>
            <Text style={styles.mainTextStyle}>training</Text>
          </View>
          <Text style={styles.getStarted}>Get Started With</Text>
          <Image source={facebookButton} style={styles.faceBookIcon} />
          <Image source={googleIcon} style={styles.googleIcon} />
          <Text style={styles.loginTextStyle}>Or Login with</Text>
          <View style={{ marginHorizontal: 3 }}>
            <TextInput
              keyboardType="email-address"
              style={[styles.inputStyle, { marginTop: 9 }]}
              placeholder="Email"
            />
            <TextInput
              secureTextEntry={true}
              style={[styles.inputStyle, { marginTop: 18 }]}
              placeholder="Password"
            />
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
            <LinearGradient
              style={styles.logInButton}
              colors={["#048ECC", "#0460BB", "#0480C6"]}
            >
              <Text style={styles.loginText}>Log in</Text>
            </LinearGradient>
            <View
              style={{
                marginTop: 23,
                flexDirection: "row",
                justifyContent: "center"
              }}
            >
              <Text>Don’t have an account? </Text>
              <Text style={{ fontWeight: "700" }}>Sign Up </Text>
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
    paddingHorizontal: 10
  },
  logInButton: {
    height: 53,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 53
  },
  loginText: { fontSize: 16, color: "white", fontWeight: "700" }
})
export default SignIn
