import React, { useEffect, useState } from "react"
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  SafeAreaView,
  Pressable,
  Image
} from "react-native"
import { Text } from "../../../components"
import { Layout, Gutters, Colors, Images } from "../../../theme"
import Slider from "react-native-slider"
import { connect } from "react-redux"
import { postRequiredCalRequest } from "../../../ScreenRedux/customCalRedux"
import { showMessage } from "react-native-flash-message"

const EditCustomCal = props => {
  const { profile, consumeCalories } = props
  const [protein, setProtein] = useState(0)
  const [carbs, setCarbs] = useState(0)
  const [fat, setFat] = useState(0)
  const [calories, setCalories] = useState(0.5)

  const {
    row,
    fill,
    center,
    alignItemsStart,
    alignItemsCenter,
    justifyContentStart,
    justifyContentBetween
  } = Layout
  const { regularHPadding, smallVPadding, regularHMargin, regularVMargin } =
    Gutters
  const fontSize15TextCenter = {
    fontSize: 14,
    lineHeight: 16,
    textAlign: "center",
    flexWrap: "wrap",
    color: "#626262"
  }
  const data = consumeCalories[0]?.goals_values?.protein / 100

  useEffect(() => {
    if (consumeCalories[0]?.goals_values) {
      consumeCalories[0]?.goals_values?.protein &&
        setProtein(consumeCalories[0]?.goals_values?.protein / 100 / 40)
      consumeCalories[0]?.goals_values?.carbs &&
        setCarbs(consumeCalories[0]?.goals_values?.carbs / 40 / 100)
      consumeCalories[0]?.goals_values?.fat &&
        setFat(consumeCalories[0]?.goals_values?.fat / 90 / 100)
      consumeCalories[0]?.goals_values?.calories &&
        setCalories(consumeCalories[0]?.goals_values?.calories)
    }
  }, [])

  const postEditCal = () => {
    if (Number(countCalories()).toFixed(0) < 10) {
      showMessage({
        message: "Calories value should be greater then 9",
        type: "danger"
      })
    } else if (Number(protein?.toFixed(3) * 100 * 40)?.toFixed(0) <= 0) {
      showMessage({
        message: "Protein value should be greater then 0",
        type: "danger"
      })
    } else if (
      Number((carbs.toFixed(3) * 100 * 40).toFixed(2)).toFixed(0) <= 0
    ) {
      showMessage({
        message: "Carbs value should be greater then 0",
        type: "danger"
      })
    } else if (Number((fat.toFixed(3) * 100 * 90).toFixed(2)).toFixed(0) <= 0) {
      showMessage({
        message: "Fat value should be greater then 0",
        type: "danger"
      })
    } else {
      const data = {
        calories: countCalories(),
        // Number(calories).toFixed(0).length > 1
        //   ? Number(calories).toFixed(0)
        //   : Number(consumeCalories[0]?.goals_values?.calories),
        protein: Math.round(protein.toFixed(3) * 100 * 40),
        carbs: Math.round(carbs.toFixed(3) * 100 * 40),
        fat: Math.round(fat.toFixed(3) * 100 * 90)
      }
      props.navigation.navigate("EditCaloriesManually", data)
    }
  }

  const calculateCalories = (val, type) => {
    const persentage = val?.toFixed(3) * 100
    const dd = persentage * (type === "fats" ? 90 : 40)
    return Math.round(dd)
  }

  const countCalories = () => {
    const proteins = protein && calculateCalories(protein)
    const carbes = carbs && calculateCalories(carbs)
    const fates = fat && calculateCalories(fat, "fats")
    return parseFloat(proteins) + parseFloat(carbes) + parseFloat(fates)
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.mainContainer}>
        <ScrollView contentContainerStyle={Layout.fillGrow}>
          <View style={[regularHPadding, regularVMargin]}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <Pressable onPress={() => props.navigation.goBack()}>
                <Image
                  source={Images.backImage}
                  style={{ width: 30, height: 20, resizeMode: "contain" }}
                />
              </Pressable>
              <Pressable onPress={postEditCal}>
                <Text
                  text="Done"
                  style={{
                    paddingHorizontal: 30,
                    paddingVertical: 8,
                    backgroundColor: Colors.alto,
                    color: "#626262"
                  }}
                  bold
                />
              </Pressable>
            </View>

            <Text
              text="Manually edit the amount of calories to consume"
              style={{
                alignSelf: "flex-start",
                fontSize: 16,
                marginVertical: 10,
                color: "#626262"
              }}
            />
          </View>
          <View style={[regularHMargin, regularVMargin]}>
            <Text
              style={{ color: "#626262" }}
              text="Calories"
              bold
              smallTitle
            />
            <View
              style={[
                row,
                justifyContentStart,
                Layout.alignItemsEnd,
                regularVMargin
              ]}
            >
              <View
                style={{ borderBottomWidth: 1, borderBottomColor: "#929292" }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    lineHeight: 25,
                    fontWeight: "600",
                    paddingVertical: 5,
                    color: "#626262"
                    // margin: 0
                  }}
                >
                  {countCalories()}
                </Text>
                {/* <TextInput
                  value={`${calories}`}
                  placeholderTextColor={"#000"}
                  autoFocus={false}
                  editable={false}
                  // placeholder={Number(consumeCalories[0]?.goals_values?.calories).toLocaleString()}
                  style={{
                    fontSize: 20,
                    lineHeight: 25,
                    fontWeight: "600",
                    paddingVertical: 5
                    // margin: 0
                  }}
                  onChangeText={val => setCalories(val)}
                /> */}
              </View>
              {/* <Text text={(consumeCalories[0]?.goals_values?.calories).toLocaleString() || 0} color="nonary" bold large underlined /> */}
              <Text
                text={"Calories per day"}
                style={[fontSize15TextCenter, Gutters.regularHMargin]}
              />
            </View>
          </View>

          <View
            style={[row, regularHMargin, justifyContentBetween, smallVPadding]}
          >
            <View>
              <Text text="Protein" bold style={{ color: "#626262" }} />
              <View
                style={[
                  row,
                  center,
                  Gutters.tinyTMargin,
                  { width: 50, height: 25, backgroundColor: Colors.alto }
                ]}
              >
                <Text
                  // text={`${(protein * 100).toFixed(0)}/%`}
                  text={`40 %`}
                  style={fontSize15TextCenter}
                  bold
                />
              </View>
            </View>
            <View>
              <Slider
                style={{ width: 250, height: 30 }}
                value={protein}
                onValueChange={val => setProtein(val)}
                thumbStyle={{
                  width: 30,
                  height: 30,
                  borderRadius: 100,
                  backgroundColor: Colors.secondary,
                  borderWidth: 1,
                  borderColor: Colors.azureradiance
                }}
                trackStyle={{
                  width: 250,
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: "gray"
                }}
                minimumTrackTintColor={"#45a1f8"}
              />
              <View style={[row, regularHMargin, Gutters.smallTMargin]}>
                <View style={[row, fill, justifyContentStart, alignItemsStart]}>
                  <Text
                    text={calculateCalories(protein)}
                    color="nonary"
                    bold
                    medium
                  />
                  <Text
                    text={"calories"}
                    style={[fontSize15TextCenter, Gutters.tinyLMargin]}
                  />
                </View>
                <View
                  style={[
                    row,
                    fill,
                    justifyContentStart,
                    alignItemsStart,
                    Gutters.regularLMargin
                  ]}
                >
                  <Text
                    text={Math.round(calculateCalories(protein) / 4)}
                    color="nonary"
                    bold
                    medium
                  />
                  <Text
                    text={"g per day"}
                    style={[fontSize15TextCenter, Gutters.tinyLMargin]}
                  />
                </View>
              </View>
            </View>
          </View>

          <View
            style={[row, regularHMargin, justifyContentBetween, smallVPadding]}
          >
            <View>
              <Text text="Carbs" bold style={{ color: "#626262" }} />
              <View
                style={[
                  row,
                  center,
                  Gutters.tinyTMargin,
                  { width: 50, height: 25, backgroundColor: Colors.alto }
                ]}
              >
                <Text
                  // text={`${(carbs * 100).toFixed(0)}/%`}
                  text={`40%`}
                  style={fontSize15TextCenter}
                  bold
                />
              </View>
            </View>
            <View>
              <Slider
                style={{ width: 250, height: 30 }}
                value={carbs}
                onValueChange={val => setCarbs(val)}
                thumbStyle={{
                  width: 30,
                  height: 30,
                  borderRadius: 100,
                  backgroundColor: Colors.secondary,
                  borderWidth: 1,
                  borderColor: "#f0bc40"
                }}
                trackStyle={{
                  width: 250,
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: "gray"
                }}
                minimumTrackTintColor={"#f0bc40"}
              />
              <View style={[row, regularHMargin, Gutters.smallTMargin]}>
                <View style={[row, fill, justifyContentStart, alignItemsStart]}>
                  <Text
                    text={calculateCalories(carbs)}
                    style={{ color: "#f0bc40" }}
                    bold
                    medium
                  />
                  <Text
                    text={"calories"}
                    style={[fontSize15TextCenter, Gutters.tinyLMargin]}
                  />
                </View>
                <View
                  style={[
                    row,
                    fill,
                    justifyContentStart,
                    alignItemsStart,
                    Gutters.regularLMargin
                  ]}
                >
                  <Text
                    text={Math.round(calculateCalories(carbs) / 4)}
                    style={{ color: "#f0bc40" }}
                    bold
                    medium
                  />
                  <Text
                    text={"g per day"}
                    style={[fontSize15TextCenter, Gutters.tinyLMargin]}
                  />
                </View>
              </View>
            </View>
          </View>

          <View
            style={[row, regularHMargin, justifyContentBetween, smallVPadding]}
          >
            <View>
              <Text text="Fats" bold style={{ color: "#626262" }} />
              <View
                style={[
                  row,
                  center,
                  Gutters.smallTMargin,
                  { width: 50, height: 25, backgroundColor: Colors.alto }
                ]}
              >
                <Text
                  // text={`${(fat * 100).toFixed(0)}/%`}
                  text={`20 %`}
                  style={fontSize15TextCenter}
                  bold
                />
              </View>
            </View>
            <View>
              <Slider
                style={{ width: 250, height: 30 }}
                value={fat}
                onValueChange={val => setFat(val)}
                thumbStyle={{
                  width: 30,
                  height: 30,
                  borderRadius: 100,
                  backgroundColor: Colors.secondary,
                  borderWidth: 1,
                  borderColor: "#ed6d57"
                }}
                trackStyle={{
                  width: 250,
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: "gray"
                }}
                minimumTrackTintColor={"#ed6d57"}
              />
              <View style={[row, regularHMargin, Gutters.smallTMargin]}>
                <View style={[row, fill, justifyContentStart, alignItemsStart]}>
                  <Text
                    text={calculateCalories(fat, "fats")}
                    style={{ color: "#ed6d57" }}
                    bold
                    medium
                  />
                  <Text
                    text={"calories"}
                    style={[fontSize15TextCenter, Gutters.tinyLMargin]}
                  />
                </View>
                <View
                  style={[
                    row,
                    fill,
                    justifyContentStart,
                    alignItemsStart,
                    Gutters.regularLMargin
                  ]}
                >
                  <Text
                    text={Math.round(calculateCalories(fat, "fats") / 9)}
                    style={{ color: "#ed6d57" }}
                    bold
                    medium
                  />
                  <Text
                    text={"g per day"}
                    style={[fontSize15TextCenter, Gutters.tinyLMargin]}
                  />
                </View>
              </View>
            </View>
          </View>

          <View
            style={[
              fill,
              regularHPadding,
              justifyContentBetween,
              styles.cardStyle
            ]}
          >
            <View style={[fill]}>
              <View style={[row, { marginRight: 20 }]}>
                <Text
                  text="Based on "
                  style={{
                    fontSize: 18,
                    opacity: 0.7,
                    textAlign: "center",
                    color: "black",
                    marginTop: 10
                  }}
                  bold
                />
                <Text
                  text={profile?.number_of_meal || 0}
                  style={{
                    fontSize: 30,
                    opacity: 0.7,
                    textAlign: "center",
                    color: Colors.primary
                  }}
                  bold
                />
                <Text
                  text={" meals per day, aim for "}
                  style={{
                    fontSize: 18,
                    opacity: 0.7,
                    textAlign: "center",
                    color: "black",
                    marginTop: 10
                  }}
                  bold
                />
              </View>

              <Text
                text={"the Following values in each meals"}
                style={{
                  fontSize: 18,
                  opacity: 0.7,
                  textAlign: "center",
                  color: "black",
                  textAlign: "left"
                }}
                bold
              />
            </View>

            <View style={Gutters.regularTMargin}>
              <View style={[row, alignItemsCenter, Gutters.tinyTMargin]}>
                <Text
                  text="Protein: "
                  style={{
                    fontSize: 18,
                    opacity: 0.7,
                    textAlign: "center",
                    color: "black"
                  }}
                />
                <Text
                  text={Math.round(calculateCalories(protein) / 4)}
                  style={{
                    fontSize: 20,
                    opacity: 0.7,
                    textAlign: "center",
                    color: Colors.primary
                  }}
                  bold
                />
                <Text
                  text={" grams per meal"}
                  style={{
                    fontSize: 18,
                    opacity: 0.7,
                    textAlign: "center",
                    color: "black"
                  }}
                />
              </View>
              <View style={[row, alignItemsCenter]}>
                <Text
                  text="Carbs: "
                  style={{
                    fontSize: 18,
                    opacity: 0.7,
                    textAlign: "center",
                    color: "black"
                  }}
                />
                <Text
                  text={Math.round(calculateCalories(carbs) / 4)}
                  style={{
                    fontSize: 20,
                    opacity: 0.7,
                    textAlign: "center",
                    color: "#f0bc40"
                  }}
                  bold
                />
                <Text
                  text={" grams per meal"}
                  style={{
                    fontSize: 18,
                    opacity: 0.7,
                    textAlign: "center",
                    color: "black"
                  }}
                />
              </View>
              <View style={[row, alignItemsCenter, Gutters.tinyTMargin]}>
                <Text
                  text="Fats: "
                  style={{
                    fontSize: 18,
                    opacity: 0.7,
                    textAlign: "center",
                    color: "black"
                  }}
                />

                <Text
                  text={Math.round(calculateCalories(fat, "fats") / 9)}
                  style={{
                    fontSize: 20,
                    opacity: 0.7,
                    textAlign: "center",
                    color: "#ed6d57"
                  }}
                  bold
                />
                <Text
                  text={" grams per meal"}
                  style={{
                    fontSize: 18,
                    opacity: 0.7,
                    textAlign: "center",
                    color: "black"
                  }}
                />
              </View>
            </View>
            <View style={[fill, row, Layout.alignItemsEnd]}>
              <Text
                style={{ color: "gray" }}
                text="*for fat loss, keep carb rich meals structured before and directly following your workout"
              />
            </View>
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
    marginTop: 10,
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

// export default EditCustomCal;

const mapStateToProps = state => ({
  consumeCalories: state.customCalReducer.getCalories,
  meals: state.customCalReducer.meals,
  profile: state.login.userDetail
})

const mapDispatchToProps = dispatch => ({
  postRequiredCalRequest: (id, data) =>
    dispatch(postRequiredCalRequest(id, data))
  // getMealsRequest: () => dispatch(getMealsRequest()),
})
export default connect(mapStateToProps, mapDispatchToProps)(EditCustomCal)
