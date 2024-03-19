import React, { useEffect, useState } from "react"
import { connect } from "react-redux"
// components
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  FlatList
} from "react-native"
import { CreditCardInput } from "react-native-input-credit-card"
import {
  getCustomerIdRequest,
  postSubscriptionRequest,
  deleteCardRequest,
  getCardRequest,
  paymentSubscriptionRequest
} from "../../ScreenRedux/subscriptionRedux"
import CreditCardDisplay from "react-native-credit-card-display"
import { Images } from "../../theme"
import { Loader } from "../../components"
import { profileData } from "../../ScreenRedux/profileRedux"
const CreditCard = props => {
  const {
    navigation,
    getCustomerIdRequest,
    deleteCardRequest,
    getCardRequest,
    getCardData,
    paymentSubscriptionRequest,
    cardRequesting,
    cardPlanData,
    profile,
  } = props
  const { plan_id, product, is_premium } = cardPlanData

  const [selected, setSelected] = useState("")

  useEffect(() => {
    getCustomerIdRequest()
    getCardRequest()
  }, [])

  // const creditCardData = form => {
  //   setData(form)
  // }

  const getDataFromCard = () => {
    const newData = {
      plan_id: plan_id,
      premium_user: is_premium,
      profile: profile
    }
    paymentSubscriptionRequest(newData)

  }

  const deleteCard = (id) => {
    deleteCardRequest({ card_id: id })
  }
  return (
    <>

      <TouchableOpacity
        style={styles.leftArrow}
        onPress={() => navigation.goBack()}
      >
        <Image source={Images.backArrow} style={styles.backArrowStyle} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.addCard} onPress={() => navigation.navigate('PaymentScreen')}>
        <Text style={{ fontSize: 17, fontWeight: "bold" }}>Add Card</Text>

      </TouchableOpacity>
      <Loader isLoading={!cardRequesting} />


      {getCardData.length ? (
        <FlatList
          data={getCardData}
          keyExtractor={item => item?.id}
          renderItem={({ item }) => {
            const { exp_month, exp_year } = item;
            const formattedMonth = exp_month < 10 ? `0${exp_month}` : exp_month;
            const formattedDate = `${formattedMonth}/${exp_year}`;

            return (

              <View style={{ alignSelf: "center", marginTop: 40 }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-evenly",
                    width: "100%"
                  }}
                >
                  <TouchableOpacity
                    onPress={() => setSelected(item?.id)}
                  >
                    <View
                      style={{
                        height: 20,
                        width: 20,
                        borderRadius: 30,
                        borderWidth: 2,
                        borderColor: "grey",
                        backgroundColor:
                          selected == item?.id ? "#A020F0" : "white"
                      }}
                    />
                  </TouchableOpacity>
                  <CreditCardDisplay
                    number={`**** **** **** ${item?.last4}`}
                    cvc={item?.cvc}
                    expiration={formattedDate}
                    name={item?.name}
                    flipped={false}
                  />
                </View>
                {selected == item?.id ? (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-evenly",
                      marginTop: 20,
                      marginBottom: 10
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => getDataFromCard(item)}
                      style={{
                        height: 40,
                        width: "30%",
                        backgroundColor: "white",
                        elevation: 6,
                        borderRadius: 10,
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <Text style={{ fontSize: 17, fontWeight: "bold" }}>
                        Pay
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        height: 40,
                        width: "30%",
                        backgroundColor: "white",
                        elevation: 6,
                        borderRadius: 10,
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                      onPress={() => deleteCard(item?.id)}
                    >
                      <Text
                        style={{ fontSize: 17, fontWeight: "bold", color: "red" }}
                      >
                        Delete
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : null}
              </View>
            )
          }}
        />
      ) : (
        <View style={{ flex: 1, justifyContent: 'center' }}>

          <Text style={{ fontSize: 17, fontWeight: "bold", textAlign: 'center' }}>
            No Cards Available
          </Text>
        </View>
      )}

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
  addCard: {
    height: 50,
    width: "60%",
    backgroundColor: "white",
    borderRadius: 15,
    borderColor: "lightgrey",
    borderWidth: 1,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    elevation: 5
  }
})

const mapStateToProps = state => ({
  customerId: state.subscriptionReducer.getCISuccess,
  getPlans: state.subscriptionReducer.getPlanSuccess,
  getCardData: state.subscriptionReducer.getCardData,
  cardRequesting: state.subscriptionReducer.cardRequesting,
  cardPlanData: state.subscriptionReducer.cardPlanData,
  profile: state.login.userDetail,
})

const mapDispatchToProps = dispatch => ({
  paymentSubscriptionRequest: data => dispatch(paymentSubscriptionRequest(data)),
  getCustomerIdRequest: () => dispatch(getCustomerIdRequest()),
  postSubscriptionRequest: data => dispatch(postSubscriptionRequest(data)),
  deleteCardRequest: data => dispatch(deleteCardRequest(data)),
  getCardRequest: data => dispatch(getCardRequest(data)),
  profileData: () => dispatch(profileData()),
})

export default connect(mapStateToProps, mapDispatchToProps)(CreditCard)
