import React, { useEffect, useState } from "react"

// components
import { View, Image, StyleSheet, TouchableOpacity, SafeAreaView, Platform, Alert } from "react-native"
// import { Icon } from "native-base"
import { Text, Button, Loader } from "../../components"
// import Card from "./component/Card"
import PremiumCard from "./component/PremiumCard"
import { connect } from "react-redux"
import {
  // getSubscriptionRequest,
  // getCustomerIdRequest,
  // setPlanCardData,
  // paymentSubscriptionRequest,
  getPlanRequest,
  // postSubscriptionRequest,
  updateCustomerSource
} from "../../ScreenRedux/subscriptionRedux"

import { usePlatformPay } from '@stripe/stripe-react-native';
import { Gutters, Layout, Global, Images } from "../../theme"
import Modal from "react-native-modal"
import { ScrollView } from "react-native-gesture-handler"
import { profileData } from "../../ScreenRedux/profileRedux"
import { APP_SKU, S_SECRET, GPAY_TEST } from "@env"
import { showMessage } from "react-native-flash-message"
import axios from "axios"

const SubscriptionScreen = props => {
  const { navigation,
    getPlans,
    subscriptionData,
    // setPlanCardData,
    profileData,
    profile,
    // postSubscriptionRequest,
    // paymentSubscriptionRequest,
    updateCustomerSource
  } = props
  const development = GPAY_TEST === 'true';
  let purchaseUpdateSubscription = null;
  let purchaseErrorSubscription = null;
  const subscriptionSkus = [APP_SKU]

  // const [curentTab, setCurentTab] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [active, setActive] = useState(true)

  useEffect(() => {
    profileData()
    props.getPlanRequest()
    // props.getCustomerIdRequest()
  }, [])

  // <======google pay=  start==>
  const {
    isPlatformPaySupported,
    confirmPlatformPayPayment
  } = usePlatformPay();

  useEffect(() => {
    (async function () {
      if (!(await isPlatformPaySupported({ googlePay: { testEnv: development } }))) {
        Alert.alert('Google Pay is not supported.');
        return;
      }
    })();
  }, []);

  const fetchPaymentIntent = async () => {
    try {
      const params = new URLSearchParams();
      // params.append('payment_method_types[]', 'card');
      params.append('amount', `${getPlans?.length && getPlans[0]?.unit_amount}`);
      params.append('automatic_payment_methods[enabled]', 'false');
      params.append('currency', 'usd');
      params.append('setup_future_usage', 'on_session');
      // params.append('use_stripe_sdk', 'true');


      const requestData = params.toString();
      const response = await axios.post('https://api.stripe.com/v1/payment_intents', requestData, {
        headers: {
          'Authorization': `Bearer ${S_SECRET}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };


  const payWithGoogle = async () => {
    try {
      const intentData = await fetchPaymentIntent();
      if (intentData) {
        const response = await confirmPlatformPayPayment(
          intentData?.client_secret,
          {
            googlePay: {
              testEnv: development,
              merchantName: 'My merchant name',
              merchantCountryCode: 'US',
              currencyCode: 'USD',
              billingAddressConfig: {
                format: 'FULL',
                isPhoneNumberRequired: true,
                isRequired: true,
              },
            },
          }
        );
        if (response?.paymentIntent?.status === 'Succeeded') {
          await updateCustomerSource({ payment_method_id: response?.paymentIntent.paymentMethod.id, plan_id: getPlans?.[0]?.id, profile: profile })
        }
      }
    } catch (error) {
      showMessage({ message: "Payment failed", description: error.message, type: "danger" });
    }
  };

  // <======google pay== end=>


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
  // }
  const premiumCardData = () => {
    // let plan_id = getPlans?.length > 0 && getPlans && getPlans?.[0]?.id
    // let product = getPlans?.length > 0 && getPlans && getPlans?.[0]?.product
    // setPlanCardData({ plan_id, product, is_premium: true })
    if (Platform.OS === "ios") {
      // purchasePlan(productsList?.[0]?.id)
    }
    else if (Platform.OS === 'android') {
      payWithGoogle()
      // navigation.navigate("CreditCard", { plan_id, product, is_premium: true })
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
          <View

            style={[center, alignItemsCenter, fill]}
          >
            <Text
              text="Premium"
              style={{ fontWeight: "bold", fontSize: 23, color: 'black' }}
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
            // getPlans={getPlans}
            amount={getPlans?.length && getPlans[0]?.unit_amount / 100}
          // subsucriptionId={subscriptionData?.plan?.id}
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
  subscriptionData: state.subscriptionReducer.subscriptionData,
  requesting: state.subscriptionReducer.subRequesting,
  profile: state.login.userDetail
  // customerId: state.subscriptionReducer.getCISuccess,
  // subscription: state.subscription.subscription,
})

const mapDispatchToProps = dispatch => ({
  // setPlanCardData: data => dispatch(setPlanCardData(data)),
  // getSubscriptionRequest: plan_id => dispatch(getSubscriptionRequest(plan_id)),
  // getCustomerIdRequest: () => dispatch(getCustomerIdRequest()),
  // postSubscriptionRequest: data => dispatch(postSubscriptionRequest(data)),
  // paymentSubscriptionRequest: data =>
  profileData: () => dispatch(profileData()),
  getPlanRequest: () => dispatch(getPlanRequest()),
  //   dispatch(paymentSubscriptionRequest(data)),
  updateCustomerSource: data =>
    dispatch(updateCustomerSource(data)),



})

export default connect(mapStateToProps, mapDispatchToProps)(SubscriptionScreen)
