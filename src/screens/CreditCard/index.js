import React, { useEffect, useState } from "react"
import { connect } from "react-redux"
// components
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Text,
  FlatList
} from "react-native"
import { CreditCardInput } from "react-native-input-credit-card"
import {
  getCustomerIdRequest,
  postSubscriptionRequest
} from "../../ScreenRedux/subscriptionRedux"
import CreditCardDisplay from "react-native-credit-card-display"
import { Images } from "../../theme"
let cardata = []
const CreditCard = props => {
  const {
    navigation,
    route: {
      params: { plan_id, product, is_premium }
    }
  } = props
  const [data, setData] = useState([])
  const [visible, setVisible] = useState(false)
  const [cardData, setCrdData] = useState([])
  const [selected, setSelected] = useState("")

  useEffect(() => {
    props.getCustomerIdRequest()
  }, [])

  const creditCardData = form => {
    setData(form)
  }

  const getDataFromCard = () => {
    const month = data.values.expiry.slice(0, 2)
    const year = data.values.expiry.slice(3, 5)
    const newData = {
      card_holder_name: data.values.name,
      card_number: data.values.number,
      card_exp_month: month,
      card_exp_year: year,
      card_cvc: data.values.cvc,
      plan_id: plan_id,
      premium_user: is_premium
    }
    props.postSubscriptionRequest(newData)
    // navigation.navigate('SurveyScreen');
  }
  const saveData = () => {
    cardata.push(data)
    setCrdData(cardata)
  }
  return (
    <>
      <TouchableOpacity
        style={styles.leftArrow}
        onPress={() => navigation.goBack()}
      >
        <Image source={Images.backArrow} style={styles.backArrowStyle} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.addCard} onPress={() => setVisible(true)}>
        <Text style={{ fontSize: 17, fontWeight: "bold" }}>Add Card</Text>
      </TouchableOpacity>
      {cardData ? (
        <FlatList
          data={cardData}
          keyExtractor={item => item.values.number}
          renderItem={({ item }) => (
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
                  onPress={() => setSelected(item.values.number)}
                >
                  <View
                    style={{
                      height: 20,
                      width: 20,
                      borderRadius: 30,
                      borderWidth: 2,
                      borderColor: "grey",
                      backgroundColor:
                        selected == item.values.number ? "#A020F0" : "white"
                    }}
                  />
                </TouchableOpacity>
                <CreditCardDisplay
                  number={item.values.number}
                  cvc={item.values.cvc}
                  expiration={item.values.expiry}
                  name={item.values.name}
                  flipped={false}
                />
              </View>
              {selected == item.values.number ? (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    marginTop: 20,
                    marginBottom: 10
                  }}
                >
                  <TouchableOpacity
                    onPress={() => getDataFromCard()}
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
                  <View
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
                    <Text
                      style={{ fontSize: 17, fontWeight: "bold", color: "red" }}
                    >
                      Delete
                    </Text>
                  </View>
                </View>
              ) : null}
            </View>
          )}
        />
      ) : (
        <Text style={{ fontSize: 17, fontWeight: "bold" }}>
          No Cards Available
        </Text>
      )}
      <Modal visible={visible}>
        <View style={{ backgroundColor: "white", flex: 1 }}>
          <TouchableOpacity
            style={styles.leftArrow}
            onPress={() => setVisible(false)}
          >
            <Image source={Images.backArrow} style={styles.backArrowStyle} />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              alignSelf: "center",
              marginTop: 50
            }}
          >
            Please Add Your Card Details
          </Text>
          <View style={{ marginTop: 30 }}>
            <CreditCardInput
              requiresName
              onChange={form => creditCardData(form)}
            />
          </View>
          <View
            style={{
              marginHorizontal: 20,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <TouchableOpacity
              disabled={!data.valid}
              onPress={() => {
                saveData()
                setVisible(false)
              }}
              style={{
                height: 40,
                width: "100%",
                backgroundColor: "white",
                elevation: 5,
                borderRadius: 10,
                marginTop: 50,
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Text style={{ fontSize: 17, fontWeight: "bold" }}>Confirm</Text>
            </TouchableOpacity>
            {/* <Button
          color="primary"
          text={'Add'}
          center
          style={{
            height: 40,
            width: '100%',
            borderWidth: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={()=>saveData()}
          //onPress={() => getDataFromCard()}
          //disabled={!data.valid}
        /> */}
          </View>
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
  getPlans: state.subscriptionReducer.getPlanSuccess
  // subscription: state.subscription.subscription,
})

const mapDispatchToProps = dispatch => ({
  getCustomerIdRequest: () => dispatch(getCustomerIdRequest()),
  postSubscriptionRequest: data => dispatch(postSubscriptionRequest(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(CreditCard)
