import React from "react"

// components
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Linking,
  Platform
} from "react-native"
import { Text, Loader } from "../../../components"
import Button from "../../../components/Button"
import LinearGradient from "react-native-linear-gradient"

import { Gutters, Layout, Global } from "../../../theme"
import { profileData } from "../../../ScreenRedux/profileRedux"
import { connect } from "react-redux"
import {
  // getSubscriptIdRequest,
  subscriptionCancelation
} from "../../../ScreenRedux/subscriptionRedux"
import { API_URL } from "../../../config/app"
const PremiumCard = props => {
  const {
    onPress,
    // getPlans,
    amount,
    // subsucriptionId,
    profile,
    // cardPlanData,
    // getSubscriptIdRequest,
    subscriptionIdData,
    subIdRequesting,
    subscriptionCancelation
  } = props
  const openPrivacyPolicy = () => {
    Linking.openURL(`${API_URL}/privacy-policy/`)
  }

  const {
    regularHMargin,
    regularVPadding,
    regularTMargin,
    mediumHMargin,
    mediumTMargin,
    regularHPadding
  } = Gutters
  const {
    row,
    fill,
    fill3x,
    center,
    alignItemsEnd,
    alignItemsCenter,
    justifyContentCenter,
    justifyContentAround
  } = Layout
  const { border } = Global
  const start = { x: 0, y: 0 }
  const end = { x: 1, y: 1 }
  // useEffect(() => {
  //   getSubscriptIdRequest()
  // }, [])
  const canceledButton = (call) => {
    profile?.user_subscription?.is_subscription_canceled
    profile?.user_subscription?.is_subscription_days_remaining
    profile?.is_premium_user

    if (profile?.is_premium_user &&
      profile?.user_subscription?.is_subscription_days_remaining &&
      profile?.user_subscription?.is_subscription_canceled
    ) {
      call &&
        Alert.alert(
          `Hi ${profile.first_name + " " + profile.last_name || "User"}`,
          "Are you sure you want to reactivate your current  subscription?",
          [
            {
              text: "NO",
              style: "cancel"
            },
            {
              text: "YES",
              onPress: () => {
                subscriptionIdData &&
                  subscriptionCancelation({
                    subscription_id: subscriptionIdData?.id,
                    reactivate_subscription: true
                  })
              }
            }
          ],
          { cancelable: false }
        )

      return { text: "Reactivate Subscription", show: true }
    } else
      if (profile?.is_premium_user) {
        call && Alert.alert(
          `Hi ${profile.first_name + ' ' + profile.last_name || 'User'}`,
          "Are you sure you want to cancel the subscription?",
          [
            {
              text: "NO",
              style: "cancel"
            },
            {
              text: "YES",
              onPress: () => {
                Platform.OS != "ios" ?
                  subscriptionIdData &&
                  subscriptionCancelation({
                    subscription_id: subscriptionIdData?.id
                  })
                  : Linking.openURL('https://apps.apple.com/account/subscriptions');
              }
            }
          ],
          { cancelable: false }
        )
        return { text: "Cancel", show: true }
      } else {
        return { text: "Cancel", show: false }
      }
  }
  return (
    <>
      <LinearGradient
        start={start}
        end={end}
        colors={["#ffd329", "#f81fe1"]}
        style={[
          fill,
          mediumHMargin,
          regularVPadding,
          regularTMargin,
          styles.gradientWrapper
        ]}
      >
        <View style={[fill, mediumHMargin, justifyContentCenter]}>
          <View style={[row, alignItemsCenter]}>
            <Text text={"⚪"} style={{ fontSize: 8, marginRight: 5 }} />
            <Text
              text={"User will receive a nutrition plan."}
              color="secondary"
              style={{ fontSize: 16 }}
            />
          </View>
          <View style={[row]}>
            <Text
              text={"⚪"}
              style={{ fontSize: 8, marginRight: 5, marginTop: 5 }}
            />
            <Text
              text={"User will have option to custom the Nutrition plan."}
              color="secondary"
              style={{ fontSize: 16 }}
            />
          </View>
          {/* <View style={[row, alignItemsCenter]}>
            <Text text={'⚪'} style={{ fontSize: 8, marginRight: 5 }} />
            <Text text={'Synergistic diet and exercise strategy'} color="secondary" />
          </View>
          <View style={[row, alignItemsCenter]}>
            <Text text={'⚪'} style={{ fontSize: 8, marginRight: 5 }} />
            <Text text={'Dynamic social feed'} color="secondary" />
          </View>
          <View style={[row, alignItemsCenter]}>
            <Text text={'⚪'} style={{ fontSize: 8, marginRight: 5 }} />
            <Text text={'Data and analytics'} color="secondary" />
          </View> */}
        </View>
        <Loader isLoading={!amount || subIdRequesting} />
        <View style={[row, center, fill, mediumTMargin]}>
          <Text
            text={`$ ${amount || "0"}`}
            regularTitle
            color="secondary"
            bold
          />
          <Text text={" / month"} large color="secondary" />
        </View>
        {/* {  canceledButton().show ? (
          <TouchableOpacity
            onPress={() => {
              canceledButton(true)
            }}
            style={styles.cancelButton}
          >
            <Text style={styles.text}>{canceledButton().text}</Text>
          </TouchableOpacity>
        ) : null} */}
        <View
          style={[
            row,
            fill,
            justifyContentCenter,
            regularHMargin,
            alignItemsEnd,
            regularVPadding
          ]}
        >
          <Text color="secondary" center style={{ fontSize: 14 }}>
            By subscribing to Orum Training, you agree to our {""}
            <TouchableOpacity onPress={openPrivacyPolicy}>
              <Text
                text={"\nPrivacy Policy"}
                color="secondary"
                regular
                center
                underlined
              />
            </TouchableOpacity>
            {""} and {""}
            <TouchableOpacity onPress={openPrivacyPolicy}>
              <Text
                text={"Terms of Services"}
                color="secondary"
                regular
                center
                underlined
              />
            </TouchableOpacity>
          </Text>
        </View>
      </LinearGradient>
      <View
        style={[
          center,
          row,
          { paddingBottom: 20, marginTop: -20, backgroundColor: "transparent" }
        ]}
      >
        <Button
          color="secondary"
          text={
            profile?.is_premium_user ? "Already Bought" : "Buy Now"
          }
          style={[
            border,
            center,
            regularHPadding,
            { height: 43, borderRadius: 30 }
          ]}
          disabled={profile?.is_premium_user}
          onPress={!profile?.is_premium_user ? onPress : null}

        />
      </View>
    </>
  )
}
const styles = StyleSheet.create({
  leftArrow: {
    zIndex: 22,
    left: 10,
    width: 50,
    height: 50
  },
  iconWrapper: {
    fontSize: 50,
    lineHeight: 50
  },
  gradientWrapper: {
    borderRadius: 40,
    height: 540
  },
  cancelButton: {
    height: 40,
    padding: 10,
    width: "auto",
    minWidth: "50%",
    backgroundColor: "white",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "red",
    marginTop: 80
  },
  text: {
    fontSize: 15,
    fontWeight: "bold",
    color: "red"
  }
})



const mapStateToProps = state => ({
  profile: state.login.userDetail,
  subscriptionIdData: state.subscriptionReducer.subscriptionIdData,
  subIdRequesting: state.subscriptionReducer.subIdRequesting,
})

const mapDispatchToProps = dispatch => ({
  profileData: () => dispatch(profileData()),
  // getSubscriptIdRequest: () => dispatch(getSubscriptIdRequest()),
  subscriptionCancelation: (data) => dispatch(subscriptionCancelation(data))


})
export default connect(mapStateToProps, mapDispatchToProps)(PremiumCard)
