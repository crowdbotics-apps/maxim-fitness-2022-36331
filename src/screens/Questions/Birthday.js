import React, { useEffect, useState } from "react"
import {
  View,
  Modal,
  StyleSheet,
  Dimensions,
  ScrollView,
  SafeAreaView,
  TouchableOpacity
} from "react-native"
import moment from "moment"
import { connect } from "react-redux"

//Components
import { Text, Button } from "../../components"
import HeaderTitle from "./Components/HeaderTitle"
import { Global, Layout, Gutters, Fonts } from "../../theme"

//Libraries
import DatePicker from "react-native-date-picker"
import LinearGradient from "react-native-linear-gradient"
import { updateAnswer } from "./Redux"

// Must be outside of any component LifeCycle (such as `componentDidMount`).

const Birthday = props => {
  const {
    profile,
    navigation: { navigate }
  } = props
  const deviceWidth = Dimensions.get("window").width

  const [dateModal, setDateModal] = useState(false)
  const [date, setDate] = useState(new Date())
  const [navState, setNavState] = useState(false)

  const onNext = () => {
    const tempData = props.answers
    tempData.dob = navState
    navigate("Gender")
  }

  return (
    <SafeAreaView style={[Global.secondaryBg, Layout.fill]}>
      <HeaderTitle percentage={0.02} showBackButton={false} />
      <ScrollView
        contentContainerStyle={[
          Layout.fillGrow,
          Gutters.small2xHPadding,
          Layout.justifyContentBetween
        ]}
      >
        <View style={Gutters.mediumTMargin}>
          <Text
            color="commonCol"
            style={Fonts.titleRegular}
            text={"When were you born?"}
          />
          <TouchableOpacity
            style={[
              Global.borderB,
              Global.height60,
              Global.borderNewCol,
              Gutters.regularTMargin,
              Layout.justifyContentCenter
            ]}
            onPress={() => setDateModal(true)}
          >
            <Text
              style={Fonts.titleRegular}
              color={navState ? "quinary" : "altoCol"}
              text={navState ? navState : "Birthday"}
            />
          </TouchableOpacity>
        </View>
        <View style={Layout.justifyContentEnd}>
          <Button
            text={"Next"}
            color="primary"
            style={Gutters.regularBMargin}
            onPress={onNext}
            block
            disabled={!navState}
          />
        </View>
      </ScrollView>
      <Modal
        visible={dateModal}
        style={Layout.fill}
        animationType="slide"
        transparent={true}
      >
        <View
          style={[
            Global.halfTransparentBg,
            Layout.fill,
            Layout.alignItemsCenter,
            Layout.justifyContentCenter
          ]}
        >
          <DatePicker
            date={date}
            mode="date"
            is24Hour={true}
            onDateChange={val => {
              const dob = moment(val).format("YYYY-MM-DD")
              setNavState(dob)
            }}
            textColor="black"
            androidVariant="iosClone"
            style={Global.secondaryBg}
            // maximumDate={new Date()}
          />

          <TouchableOpacity
            style={[Gutters.small2xVMargin, { width: deviceWidth - 100 }]}
            onPress={() => {
              setDateModal(false)
              !navState && setNavState(moment(date).format("YYYY-MM-DD"))
            }}
          >
            <LinearGradient
              style={styles.gradientStyle}
              colors={["#048ECC", "#0460BB", "#0480C6"]}
            >
              <Text style={styles.loginText}>Select Date of Birth</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ width: deviceWidth - 100 }}
            onPress={() => setDateModal(false)}
          >
            <LinearGradient
              style={styles.gradientStyle}
              colors={["#e52b39", "#ef3d49", "#fb5a60"]}
            >
              <Text style={styles.loginText}>Cancel</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  gradientStyle: {
    height: 53,
    borderRadius: 0,
    alignItems: "center",
    justifyContent: "center"
  },
  loginText: {
    fontSize: 20,
    color: "white",
    fontWeight: "700"
  }
})

const mapStateToProps = state => ({
  answers: state.questionReducer.answers,
  profile: state.login.userDetail
})

const mapDispatchToProps = dispatch => ({
  updateAnswers: data => dispatch(updateAnswer(data))
})
export default connect(mapStateToProps, mapDispatchToProps)(Birthday)
