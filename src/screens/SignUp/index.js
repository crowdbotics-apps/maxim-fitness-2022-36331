import React from "react"
import { CheckBox } from 'react-native-elements';
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
  ActivityIndicator
} from "react-native"
import LinearGradient from "react-native-linear-gradient"
import { Images } from "src/theme"
import useForm from "../../utils/useForm"
import validator from "../../utils/validation"
import { connect } from "react-redux"
//actions
import {
  signUpUser,
} from "../../ScreenRedux/signUpRedux"

const { backIcon, orumIcon, facebookButton, googleIcon } = Images
const SignUp = (props) => {

  const stateSchema = {
   
    email: {
      value: "",
      error: ""
    },
    password: {
      value: "",
      error: ""
    },
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
  }

  const { state, handleOnChange, disable } = useForm(
    stateSchema,
    validationStateSchema
  )

  const OnSignUpPress=()=>{
  let signUpData = {
    email: state.email.value,
    password: state.password.value,
  }
  props.signUpUser(signUpData)
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#E5E5E5" }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
        <Image source={backIcon} style={styles.backIconStyle} />
        <View style={{ marginHorizontal: 22 }}>
          <View style={{ alignItems: "center" }}>
            <Image source={orumIcon} style={styles.orumIcon} />
            <Text style={styles.mainTextStyle}>
              Create or login your account to start
            </Text>
            <Text style={styles.mainTextStyle}>training</Text>
          </View>
          <Text style={styles.getStarted}>Get Register With</Text>
          <Image source={facebookButton} style={styles.faceBookIcon} />
          <Image source={googleIcon} style={styles.googleIcon} />
          <Text style={styles.loginTextStyle}>Or Register with</Text>
          <View style={{ marginHorizontal: 3 }}>
            <TextInput
              keyboardType="email-address"
              style={[styles.inputStyle, { marginTop: 9 }]}
              onChangeText={value => handleOnChange("email", value)}
              placeholder="Email"
            />
             <Text style={{ color: "red" }}>{state.email.error}</Text>
            <TextInput
              secureTextEntry={true}
              style={[styles.inputStyle, { marginTop: 18 }]}
              onChangeText={value => handleOnChange("password", value)}
              placeholder="Password"
            />
            <Text style={{ color: "red" }}>{state.password.error}</Text>
            <TouchableOpacity onPress={()=>OnSignUpPress() } disabled={disable}>
            <LinearGradient
              style={styles.logInButton}
              colors={["#048ECC", "#0460BB", "#0480C6"]}
            >
              {props.requesting ? <ActivityIndicator
          color="white"
        /> :<Text style={styles.loginText}>Register</Text>}
            </LinearGradient>
            </TouchableOpacity>
           
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

const mapStateToProps = state => ({
  requesting: state.signUpReducer.requesting,
})

const mapDispatchToProps = dispatch => ({
  signUpUser: data => dispatch(signUpUser(data)),
})
export default connect(mapStateToProps, mapDispatchToProps)(SignUp)
