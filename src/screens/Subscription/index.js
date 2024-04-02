import React, { useEffect, useState } from "react"

// components
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Platform
} from "react-native"
import { Icon } from "native-base"
import { Text, Button, Loader } from "../../components"
import Card from "./component/Card"
import PremiumCard from "./component/PremiumCard"
import { connect } from "react-redux"
import {
  // getSubscriptionRequest,
  getPlanRequest,
  getCustomerIdRequest,
  setPlanCardData,
  paymentSubscriptionRequest
} from "../../ScreenRedux/subscriptionRedux"

import {
  initConnection,
  getSubscriptions,
  getProducts,
  requestPurchase,
  endConnection,
} from "react-native-iap"
import { Gutters, Layout, Global, Images } from "../../theme"
import Modal from "react-native-modal"
import { ScrollView } from "react-native-gesture-handler"
import { profileData } from "../../ScreenRedux/profileRedux"
import { APP_SKU } from "@env"
import { showMessage } from "react-native-flash-message"

const SubscriptionScreen = props => {
  const {
    navigation,
    getPlans,
    subscriptionData,
    setPlanCardData,
    profileData,
    profile,
    // paymentSubscriptionRequest
  } = props

  const skus = Platform.select({
    ios: [APP_SKU]
  })
  // const [curentTab, setCurentTab] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [active, setActive] = useState(true)

  useEffect(() => {
    profileData()
    props.getPlanRequest()
    props.getCustomerIdRequest()
    Platform.OS === "ios" && connect()
  }, [])
  // <===============ios apple pay ======start==========>
  const [subscriptionId, setSubscriptionId] = useState([])
  const [productsList, setProductsList] = useState([])

  const connect = async () => {
    await initConnection()
    const productsData = await getProducts({ skus })
    console.log(productsData, "Products")
    setProductsList(productsData)
    await handleGetSubscriptions()
    console.log(productsData, "productsData")
    await endConnection()
  }
  const handleGetSubscriptions = async () => {
    try {
      const res = await getSubscriptions({ skus })
      setSubscriptionId(res)
    } catch (error) {
      showMessage({ message: "handleGetSubscriptions", error })
    }
  }
  const purchasePlan = async (sku, newData) => {
    try {
      const purchasedResponse = await requestPurchase({
        sku
      })
      if (purchasedResponse.transactionReceipt) {
        const payload = {
          ...newData,
          token: purchasedResponse.transactionReceipt
        }
        // paymentSubscriptionRequest(payload) //send data to BE
      }
    } catch (error) {
      console.log("requestSubscription", error.message)
      const message = error?.message
        ? error.message
        : "Failed to request subscription"
      showMessage({ type: "danger", message })
    } finally {
    }
  }
  // <===============ios apple pay ====end============>
  // const card = () => {
  //   let plan_id =
  //     getPlans?.length > 0 && getPlans && getPlans?.[getPlans.length - 1]?.id
  //   let product =
  //     getPlans?.length > 0 &&
  //     getPlans &&
  //     getPlans?.[getPlans.length - 1]?.product
  //   setPlanCardData({ plan_id, product, is_premium: false })
  //   if (Platform.OS === "ios") {
  //     navigation.navigate("ApplePay", { plan_id, product, is_premium: false })

  //   }else{
  //     navigation.navigate("GooglePay", { plan_id, product, is_premium: true })

  //   // navigation.navigate("CreditCard", { plan_id, product, is_premium: false })
  // }
  const premiumCardData = () => {
    let plan_id = getPlans?.length > 0 && getPlans && getPlans?.[0]?.id
    let product = getPlans?.length > 0 && getPlans && getPlans?.[0]?.product
    setPlanCardData({ plan_id, product, is_premium: true })
    const newData = {
      plan_id: plan_id,
      premium_user: true,
      profile: profile
    }
    if (Platform.OS === "ios") {
      purchasePlan(productsList?.[0]?.productId, newData)
    } else if (Platform.OS === "android") {
      navigation.navigate("CreditCard", { plan_id, product, is_premium: true })
    }
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
      <SafeAreaView>
        <View style={[row]}>
          <TouchableOpacity
            style={styles.leftArrow}
            onPress={() => navigation.goBack()}
          >
            <Image source={Images.backImage} style={styles.backArrowStyle} />
          </TouchableOpacity>
          <View style={[center, alignItemsCenter, fill]}>
            <Text
              text="Premium"
              style={{ fontWeight: "bold", fontSize: 23, color: "black" }}
              smallTitle
            />
          </View>
        </View>
        <View style={[row, largeHMargin, justifyContentBetween]}>
          <Loader isLoading={props.requesting} />

          {/* <TouchableOpacity
            onPress={() => setCurentTab(0)}
            style={[center, alignItemsCenter, fill]}
          >
            <Text
              text="Free"
              style={{ fontWeight: curentTab === 0 ? "bold" : 'normal', color: 'black' }}

              smallTitle
            />
          </TouchableOpacity> */}
        </View>
        <ScrollView>
          {/* {curentTab === 0 && (
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
          )} */}
          {/* {curentTab === 1 && ( */}
          <PremiumCard
            onPress={premiumCardData}
            setIsVisible={setIsVisible}
            navigation={navigation}
            getPlans={getPlans}
            amount={getPlans?.length && getPlans[0]?.unit_amount / 100}
            subsucriptionId={subscriptionData?.plan?.id}
          />
          {/* )} */}
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
      </SafeAreaView>
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
  paymentSubscriptionRequest: data =>
    dispatch(paymentSubscriptionRequest(data)),
  profileData: () => dispatch(profileData()),
  getPlanRequest: () => dispatch(getPlanRequest()),
  setPlanCardData: data => dispatch(setPlanCardData(data)),
  // getSubscriptionRequest: plan_id => dispatch(getSubscriptionRequest(plan_id)),
  getCustomerIdRequest: () => dispatch(getCustomerIdRequest())
})

export default connect(mapStateToProps, mapDispatchToProps)(SubscriptionScreen)
