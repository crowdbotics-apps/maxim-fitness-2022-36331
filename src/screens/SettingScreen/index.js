import React, { useEffect, useState } from "react"
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  Image,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Dimensions
} from "react-native"
import { Images } from "src/theme"
import { connect } from "react-redux"
import { Text, Button } from "../../components"
import Modal from "react-native-modal"
import {
  GoogleSignin,
  statusCodes
} from "@react-native-google-signin/google-signin"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { deleteAccount } from "../../ScreenRedux/settingScreenRedux"
import { setAccessToken, logOutActiveUser } from "../../ScreenRedux/loginRedux"
import { resetQuestions } from "../Questions/Redux"

const { backImage } = Images
const SettingScreen = props => {
  const { navigation, profileUserData, requesting } = props
  const [showModal, setShowModal] = useState(false)
  const { width } = Dimensions.get("window")

  const logOut = async () => {
    if (await GoogleSignin.isSignedIn()) {
      try {
        await GoogleSignin.signOut()
        await AsyncStorage.clear()
        props.resetQuestions()
        props.setAccessToken(false)
      } catch (e) {
        navigation.goBack()
      }
    } else {
      const token = await AsyncStorage.getItem("authToken")
      props.logOutActiveUser(token)
      await AsyncStorage.clear()
      props.resetQuestions()
      props.setAccessToken(false)
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{ paddingHorizontal: 20, flexDirection: "row", marginTop: 20 }}
        >
          <TouchableOpacity
            style={{ flex: 1, justifyContent: "center" }}
            onPress={() => navigation.goBack()}
          >
            <Image source={backImage} style={{ height: 20, width: 30 }} />
          </TouchableOpacity>
          <View style={{ flex: 1.5 }}>
            <Text
              text="Settings"
              style={{ fontSize: 22, color: "#0D5565" }}
              bold
            />
          </View>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate("SubscriptionScreen")}
          style={[styles.mainHeading]}
        >
          <Text text="Subscription Plan" style={styles.mainText} bold />
          <Image source={Images.forwordIcon} style={styles.IconStyles} />
        </TouchableOpacity>
        {/* <TouchableOpacity  onPress={()=>console.log('ggggg')} style={[styles.mainHeading]}>
          <Text text="Payment Plan" style={styles.mainText} bold />
          <Image source={Images.forwordIcon} style={styles.IconStyles} />
        </TouchableOpacity> */}
        <TouchableOpacity
          style={[styles.mainHeading]}
          onPress={() => setShowModal(true)}
        >
          <Text text="Delete Account" style={styles.mainText} bold />
          <Image source={Images.forwordIcon} style={styles.IconStyles} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.mainHeading]} onPress={() => logOut()}>
          <Text text="Log Out" style={styles.mainText} bold />
          <Image source={Images.forwordIcon} style={styles.IconStyles} />
        </TouchableOpacity>
      </ScrollView>
      <Modal
        isVisible={showModal}
        animationIn="zoomIn"
        animationOut={"zoomOut"}
        onBackdropPress={() => setShowModal(false)}
      >
        <View
          style={{
            height: 250,
            marginHorizontal: 20,
            backgroundColor: "#fff",
            borderRadius: 10,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Text
            style={{ fontSize: 24, fontWeight: "700", textAlign: "center" }}
          >
            Are you sure you want to delete this set?
          </Text>
          <View style={{ flexDirection: "row", marginTop: 20 }}>
            <TouchableOpacity
              style={[styles.delBtnStyles, { backgroundColor: "#74CCFF" }]}
              onPress={() => [
                setShowModal(!showModal),
                props.deleteAccount(props.userDetail.id),
                logOut()
              ]}
            >
              <Text style={{ fontWeight: "700", color: "#000" }}>Yes</Text>
            </TouchableOpacity>
            <View style={{ marginHorizontal: 20 }} />
            <TouchableOpacity
              style={[styles.delBtnStyles, { backgroundColor: "#F3F1F4" }]}
              onPress={() => setShowModal(!showModal)}
            >
              <Text style={{ fontWeight: "700", color: "#000" }}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  delBtnStyles: {
    width: 100,
    height: 50,
    backgroundColor: "red",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center"
  },
  mainHeading: {
    marginHorizontal: 20,
    borderBottomColor: "gray",
    borderBottomWidth: 1,
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  mainText: { fontSize: 18, color: "#0D5565", paddingBottom: 15 },
  IconStyles: { height: 20, width: 10, marginRight: 10 }
})

const mapStateToProps = state => ({
  // requesting: state.userProfileReducer.requesting,
  userDetail: state.login.userDetail
})

const mapDispatchToProps = dispatch => ({
  deleteAccount: data => dispatch(deleteAccount(data)),
  setAccessToken: data => dispatch(setAccessToken(data)),
  resetQuestions: () => dispatch(resetQuestions()),
  logOutActiveUser: token => dispatch(logOutActiveUser(token))
})
export default connect(mapStateToProps, mapDispatchToProps)(SettingScreen)
