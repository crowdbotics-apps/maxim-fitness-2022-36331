import React, { useEffect, useState } from "react"

// components
import { View, Image, StyleSheet, TouchableOpacity } from "react-native"
import { Icon } from "native-base"
import { Text, Button, Loader } from "../../components"
import Card from "./component/Card"
import PremiumCard from "./component/PremiumCard"
import { connect } from "react-redux"
import {
  // getSubscriptionRequest,
  getPlanRequest,
  getCustomerIdRequest,
  setPlanCardData
} from "../../ScreenRedux/subscriptionRedux"

import { Gutters, Layout, Global, Images } from "../../theme"
import Modal from "react-native-modal"
import { ScrollView } from "react-native-gesture-handler"
import { profileData } from "../../ScreenRedux/profileRedux"

const SubscriptionScreen = props => {
  const { navigation, getPlans, subscriptionData, setPlanCardData, profileData, profile } = props


  const [curentTab, setCurentTab] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [active, setActive] = useState(true)

  useEffect(() => {
    profileData()
    props.getPlanRequest()
    props.getCustomerIdRequest()
  }, [])

  const card = () => {
    let plan_id =
      getPlans?.length > 0 && getPlans && getPlans?.[getPlans.length - 1]?.id
    let product =
      getPlans?.length > 0 &&
      getPlans &&
      getPlans?.[getPlans.length - 1]?.product
    setPlanCardData({ plan_id, product, is_premium: false })
    navigation.navigate("CreditCard", { plan_id, product, is_premium: false })
  }
  const premiumCardData = () => {
    let plan_id = getPlans?.length > 0 && getPlans && getPlans?.[0]?.id
    let product = getPlans?.length > 0 && getPlans && getPlans?.[0]?.product
    setPlanCardData({ plan_id, product, is_premium: true })
    navigation.navigate("CreditCard", { plan_id, product, is_premium: true })
  }

  const { largeHMargin, mediumTMargin } = Gutters
  const { row, fill, center, alignItemsCenter, justifyContentBetween } = Layout
  const { border } = Global
  const { leftArrow, iconWrapper } = styles

  const setData = item => {
    if (item === "No") {
      navigation.navigate("CreditCard")
      setIsVisible(false)
    } else if (item === "Yes") {
      setActive(!active)
    }
  }
  return (
    <>
      <TouchableOpacity
        style={styles.leftArrow}
        onPress={() => {
          !profile?.is_survey ? navigation.navigate("Birthday") : navigation.goBack()
        }}
      >
        <Image source={Images.backImage} style={styles.backArrowStyle} />
      </TouchableOpacity>
      <View style={[row, largeHMargin, justifyContentBetween]}>
        <Loader isLoading={props.requesting} />

        <TouchableOpacity
          onPress={() => setCurentTab(0)}
          style={[center, alignItemsCenter, fill]}
        >
          <Text
            text="Free"
            style={curentTab === 0 && { fontWeight: "bold" }}
            smallTitle
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setCurentTab(1)}
          style={[center, alignItemsCenter, fill]}
        >
          <Text
            text="Premium"
            style={curentTab === 1 && { fontWeight: "bold" }}
            smallTitle
          />
        </TouchableOpacity>
      </View>
      <ScrollView>
        {curentTab === 0 && (
          <Card
            onPress={card}
            setIsVisible={setIsVisible}
            navigation={navigation}
            getPlans={getPlans}
            amount={
              getPlans?.length &&
              getPlans[getPlans?.length - 1]?.unit_amount
            }
            subsucriptionId={subscriptionData?.plan?.id}
          />
        )}
        {curentTab === 1 && (
          <PremiumCard
            onPress={premiumCardData}
            setIsVisible={setIsVisible}
            navigation={navigation}
            getPlans={getPlans}
            amount={getPlans?.length && getPlans[0]?.unit_amount / 100}
            subsucriptionId={subscriptionData?.plan?.id}
          />
        )}
      </ScrollView>
      <Modal
        isVisible={isVisible}
        animationOutTiming={1}
        onBackButtonPress={() => setIsVisible(false)}
      >
        <View style={center}>
          <Text
            text="Do you have an Access Code?"
            color="secondary"
            smallTitle
          />
          <>
            {active ? (
              <View style={center}>
                <Button
                  color="primary"
                  text={"Yes"}
                  style={[
                    border,
                    center,
                    mediumTMargin,
                    {
                      height: 40,
                      width: 100,
                      backgroundColor: "transparent",
                      borderColor: "white"
                    }
                  ]}
                  onPress={() => setData("Yes")}
                />
                <Button
                  color="primary"
                  text={"No"}
                  style={[
                    border,
                    center,
                    mediumTMargin,
                    {
                      height: 40,
                      width: 100,
                      backgroundColor: "transparent",
                      borderColor: "white"
                    }
                  ]}
                  onPress={() => setData("No")}
                />
              </View>
            ) : (
              <View style={alignItemsCenter}>
                <View>
                  <Button
                    color="secondary"
                    text={"Orum 50 off"}
                    style={[
                      border,
                      center,
                      mediumTMargin,
                      { height: 40, width: 150 }
                    ]}
                    onPress={() => setIsVisible(false)}
                    center
                  />
                </View>
                <View>
                  <Button
                    color="primary"
                    text={"Enter"}
                    style={[
                      border,
                      center,
                      mediumTMargin,
                      {
                        height: 40,
                        width: 100,
                        backgroundColor: "transparent",
                        borderColor: "white"
                      }
                    ]}
                    onPress={() => setIsVisible(false)}
                    center
                  />
                </View>
              </View>
            )}
          </>
        </View>
      </Modal>
    </>
  )

}
const styles = StyleSheet.create({
  leftArrow: {
    marginTop: 20,
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
    borderRadius: 40
  },
  backArrowStyle: {
    height: 20,
    width: 30,
    marginLeft: 10
  }
})
const mapStateToProps = state => ({
  getPlans: state.subscriptionReducer.getPlanSuccess,
  customerId: state.subscriptionReducer.getCISuccess,
  subscriptionData: state.subscriptionReducer.subscriptionData,
  requesting: state.subscriptionReducer.subRequesting,
  profile: state.login.userDetail
  // subscription: state.subscription.subscription,
})

const mapDispatchToProps = dispatch => ({
  profileData: () => dispatch(profileData()),
  getPlanRequest: () => dispatch(getPlanRequest()),
  setPlanCardData: data => dispatch(setPlanCardData(data)),
  // getSubscriptionRequest: plan_id => dispatch(getSubscriptionRequest(plan_id)),
  getCustomerIdRequest: () => dispatch(getCustomerIdRequest())
})

export default connect(mapStateToProps, mapDispatchToProps)(SubscriptionScreen)
