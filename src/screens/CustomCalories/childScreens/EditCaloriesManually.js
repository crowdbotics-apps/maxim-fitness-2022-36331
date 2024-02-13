import React, { useState, useEffect } from "react"
import {
  View,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView
} from "react-native"
import { Text, Button } from "../../../components"
import { Layout, Gutters, Colors, Global, Images } from "../../../theme"
import { connect } from "react-redux"
import { postRequiredCalRequest } from "../../../ScreenRedux/customCalRedux"

const EditCaloriesManually = props => {
  const { profile, consumeCalories, route } = props
  const [param, setParam] = useState(false)

  useEffect(() => {
    route && route.params && setParam(route.params)
  }, [route])

  const postEditCal = () => {
    props.postRequiredCalRequest(consumeCalories[0]?.goals_values?.id, param)
  }

  const {
    row,
    fill,
    center,
    alignItemsStart,
    alignItemsCenter,
    justifyContentStart,
    justifyContentBetween
  } = Layout
  const {
    regularHPadding,
    smallVPadding,
    regularHMargin,
    regularVMargin,
    regularVPadding,
    smallTMargin
  } = Gutters
  const fontSize15TextCenter = {
    fontSize: 14,
    textAlign: "center",
    flexWrap: "wrap",
    color: "#626262"
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.mainContainer}>
        <ScrollView contentContainerStyle={Layout.fillGrow}>
          <View
            style={[
              row,
              regularHPadding,
              alignItemsCenter,
              justifyContentBetween,
              { backgroundColor: Colors.primary, height: 70 }
            ]}
          >
            <TouchableOpacity onPress={() => props.navigation.goBack()}>
              <Image
                source={Images.whiteBackArrow}
                style={{ width: 30, height: 20, resizeMode: "contain" }}
              />
            </TouchableOpacity>
            <Text
              text="Manually Edit Calories"
              style={{ fontSize: 18, color: Colors.white }}
            />
            <View />
          </View>

          <View
            style={[
              regularHMargin,
              regularHPadding,
              styles.cardStyle,
              { marginTop: 40 }
            ]}
          >
            <View style={[row, justifyContentStart, alignItemsStart]}>
              <Text
                style={{ color: "#626262" }}
                text="Calories"
                bold
                smallTitle
              />
              <Text
                text={"Specific"}
                style={[fontSize15TextCenter, Gutters.smallLMargin]}
              />
            </View>
            <Text
              style={{ color: "gray", marginTop: 5 }}
              text="For fat loss, keep carb rich meals structured before and directly following your workout"
            />
            <View style={[row, center, regularVMargin]}>
              <Text
                text={Number(param?.calories).toLocaleString() || 0}
                style={{ color: "black", fontSize: 28 }}
              />
              <Text
                text={"Calories per day"}
                style={[
                  Gutters.regularHMargin,
                  { fontSize: 18, color: "#626262" }
                ]}
              />
            </View>
          </View>
          <View style={[styles.cardStyle, regularVPadding]}>
            <View style={regularHMargin}>
              <View style={[row, justifyContentStart, alignItemsStart]}>
                <Text
                  style={{ color: "#626262" }}
                  text="Macronutrient"
                  bold
                  smallTitle
                />
                <Text
                  text={"Specific"}
                  style={[fontSize15TextCenter, Gutters.smallLMargin]}
                />
              </View>
              <Text
                style={{ color: "gray", marginTop: 5 }}
                text="For fat loss, keep carb rich meals structured before and directly following your workout"
              />
            </View>

            <View
              style={[
                row,
                regularHMargin,
                justifyContentBetween,
                alignItemsCenter,
                smallVPadding,
                smallTMargin,
                Global.borderB,
                Global.borderAlto
              ]}
            >
              <Text text="Protein" bold style={{ color: "#626262" }} />
              <View style={[row, regularHMargin]}>
                <View style={[row, justifyContentStart, alignItemsStart]}>
                  <Text
                    text={Math.round(param?.protein / 4)}
                    color="nonary"
                    bold
                    medium
                  />
                  <Text
                    text={"grams per day"}
                    style={[fontSize15TextCenter, Gutters.tinyLMargin]}
                  />
                </View>
                <View
                  style={[
                    row,
                    justifyContentStart,
                    alignItemsStart,
                    Gutters.regularLMargin
                  ]}
                >
                  <Text
                    text={Number(param?.protein)}
                    color="nonary"
                    bold
                    medium
                  />
                  <Text
                    text={"calories"}
                    style={[fontSize15TextCenter, Gutters.tinyLMargin]}
                  />
                </View>
              </View>
            </View>

            <View
              style={[
                row,
                regularHMargin,
                justifyContentBetween,
                alignItemsCenter,
                smallVPadding,
                smallTMargin,
                Global.borderB,
                Global.borderAlto
              ]}
            >
              <Text text="Carbs" bold style={{ color: "#626262" }} />
              <View style={[row, regularHMargin]}>
                <View style={[row, justifyContentStart, alignItemsStart]}>
                  <Text
                    text={Math.round(param?.carbs / 4)}
                    style={{ color: "#f0bc40" }}
                    bold
                    medium
                  />
                  <Text
                    text={"grams per day"}
                    style={[fontSize15TextCenter, Gutters.tinyLMargin]}
                  />
                </View>
                <View
                  style={[
                    row,
                    justifyContentStart,
                    alignItemsStart,
                    Gutters.regularLMargin
                  ]}
                >
                  <Text
                    text={Number(param?.carbs)}
                    style={{ color: "#f0bc40" }}
                    bold
                    medium
                  />
                  <Text
                    text={"calories"}
                    style={[fontSize15TextCenter, Gutters.tinyLMargin]}
                  />
                </View>
              </View>
            </View>

            <View
              style={[
                row,
                regularHMargin,
                justifyContentBetween,
                alignItemsCenter,
                smallVPadding,
                smallTMargin
              ]}
            >
              <Text text="Fats" bold style={{ color: "#626262" }} />
              <View style={[row, regularHMargin]}>
                <View style={[row, justifyContentStart, alignItemsStart]}>
                  <Text
                    text={Math.round(param?.fat / 9)}
                    style={{ color: "#ed6d57" }}
                    bold
                    medium
                  />
                  <Text
                    text={"grams per day"}
                    style={[fontSize15TextCenter, Gutters.tinyLMargin]}
                  />
                </View>
                <View
                  style={[
                    row,
                    justifyContentStart,
                    alignItemsStart,
                    Gutters.regularLMargin
                  ]}
                >
                  <Text
                    text={Number(param?.fat)}
                    style={{ color: "#ed6d57" }}
                    bold
                    medium
                  />
                  <Text
                    text={"calories"}
                    style={[fontSize15TextCenter, Gutters.tinyLMargin]}
                  />
                </View>
              </View>
            </View>
          </View>
          <View
            style={[
              fill,
              regularVMargin,
              {
                alignSelf: "center",
                justifyContent: "flex-end"
              }
            ]}
          >
            <Button
              color="primary"
              text="Save"
              style={[
                regularHMargin,
                Gutters.mediumHPadding,
                {
                  backgroundColor: "red",
                  width: 100
                }
              ]}
              loaderColor="#FFFF"
              onPress={postEditCal}
              loading={props.rCalRequest}
            />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  mainContainer: { flex: 1 },

  cardStyle: {
    backgroundColor: "white",
    marginHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 20,
    marginTop: 30,
    borderRadius: 8,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0
    },
    shadowOpacity: 0.34,
    shadowRadius: 0.27,

    elevation: 15
  },

  thumb: {
    width: 30,
    height: 30,
    borderRadius: 100,
    backgroundColor: Colors.secondary,
    borderWidth: 1,
    borderColor: Colors.azureradiance
  },
  track: {
    width: 200,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.alto
  }
})

const mapStateToProps = state => ({
  consumeCalories: state.customCalReducer.getCalories,
  meals: state.customCalReducer.meals,
  profile: state.login.userDetail,
  rCalRequest: state.customCalReducer.rCalRequest
})

const mapDispatchToProps = dispatch => ({
  postRequiredCalRequest: (id, data) =>
    dispatch(postRequiredCalRequest(id, data))
  // getMealsRequest: () => dispatch(getMealsRequest()),
})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditCaloriesManually)
