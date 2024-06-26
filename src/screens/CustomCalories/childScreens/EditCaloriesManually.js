import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Button } from '../../../components';
import { Layout, Gutters, Colors, Global, Images } from '../../../theme';
import { connect } from 'react-redux';
import { postRequiredCalRequest } from '../../../ScreenRedux/customCalRedux'

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
    justifyContentBetween,
  } = Layout;
  const { regularHPadding, smallVPadding, regularHMargin, regularVMargin, regularVPadding } =
    Gutters;
  const fontSize15TextCenter = { fontSize: 14, textAlign: 'center', flexWrap: 'wrap' };

  return (
    <View style={styles.mainContainer}>
      <ScrollView contentContainerStyle={Layout.fillGrow}>
        <View
          style={[
            row,
            regularHPadding,
            alignItemsCenter,
            justifyContentBetween,
            { backgroundColor: Colors.primary, height: 70 },
          ]}
        >
          <TouchableOpacity onPress={() => props.navigation.goBack()}>
            <Image
              source={Images.whiteBackArrow}
              style={{ width: 30, height: 20, resizeMode: 'contain' }}
            />
          </TouchableOpacity>
          <Text text="Manually Edit Calories" style={{ fontSize: 18, color: Colors.white }} />
          <View />
        </View>

        <View style={[regularHMargin, regularHPadding, styles.cardStyle, { marginTop: 40 }]}>
          <View style={[row, justifyContentStart, alignItemsStart]}>
            <Text color="commonCol" text="Calories" bold smallTitle />
            <Text text={'Specific'} style={[fontSize15TextCenter, Gutters.smallLMargin]} />
          </View>
          <Text
            style={{ color: 'gray', marginTop: 5 }}
            text="For fat loss, keep carb rich meals structured before and directly following your workout"
          />
          <View style={[row, center, regularVMargin]}>
            <Text text={Number(param?.calories).toLocaleString() || 0} style={{ color: 'black', fontSize: 28 }} />
            <Text text={'Calories per day'} style={[Gutters.regularHMargin, { fontSize: 18 }]} />
          </View>
        </View>
        <View style={[styles.cardStyle, regularVPadding]}>
          <View style={regularHMargin}>
            <View style={[row, justifyContentStart, alignItemsStart]}>
              <Text color="commonCol" text="Macronutrient" bold smallTitle />
              <Text text={'Specific'} style={[fontSize15TextCenter, Gutters.smallLMargin]} />
            </View>
            <Text
              style={{ color: 'gray', marginTop: 5 }}
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
              Global.borderB,
              Global.borderAlto,
            ]}
          >
            <Text text="Protein" bold />
            <View style={[row, regularHMargin, Gutters.smallTMargin]}>
              <View style={[row, justifyContentStart, alignItemsStart]}>
                <Text text={Number(param?.protein).toFixed(2)} color="nonary" bold medium />
                <Text text={'calories'} style={[fontSize15TextCenter, Gutters.tinyLMargin]} />
              </View>
              <View style={[row, justifyContentStart, alignItemsStart, Gutters.regularLMargin]}>
                <Text text={(param?.protein / profile?.number_of_meal).toFixed(2)} color="nonary" bold medium />
                <Text text={'g per day'} style={[fontSize15TextCenter, Gutters.tinyLMargin]} />
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
              Global.borderB,
              Global.borderAlto,
            ]}
          >
            <Text text="Carbs" bold />
            <View style={[row, regularHMargin, Gutters.smallTMargin]}>
              <View style={[row, justifyContentStart, alignItemsStart]}>
                <Text text={Number(param?.carbs).toFixed(2)} style={{ color: '#f0bc40' }} bold medium />
                <Text text={'calories'} style={[fontSize15TextCenter, Gutters.tinyLMargin]} />
              </View>
              <View style={[row, justifyContentStart, alignItemsStart, Gutters.regularLMargin]}>
                <Text text={((param?.carbs / profile?.number_of_meal)).toFixed(2)} style={{ color: '#f0bc40' }} bold medium />
                <Text text={'g per day'} style={[fontSize15TextCenter, Gutters.tinyLMargin]} />
              </View>
            </View>
          </View>

          <View
            style={[row, regularHMargin, justifyContentBetween, alignItemsCenter, smallVPadding]}
          >
            <Text text="Fats" bold />
            <View style={[row, regularHMargin, Gutters.smallTMargin]}>
              <View style={[row, justifyContentStart, alignItemsStart]}>
                <Text text={Number(param?.fat).toFixed(2)} style={{ color: '#ed6d57' }} bold medium />
                <Text text={'calories'} style={[fontSize15TextCenter, Gutters.tinyLMargin]} />
              </View>
              <View style={[row, justifyContentStart, alignItemsStart, Gutters.regularLMargin]}>
                <Text text={((param?.fat / profile?.number_of_meal)).toFixed(2)} style={{ color: '#ed6d57' }} bold medium />
                <Text text={'g per day'} style={[fontSize15TextCenter, Gutters.tinyLMargin]} />
              </View>
            </View>
          </View>
        </View>
        <View style={[fill, regularVMargin, { alignSelf: 'center', justifyContent: 'flex-end' }]}>
          <Button
            color="primary"
            text="Share"
            style={[regularHMargin, Gutters.mediumHPadding]}
            onPress={postEditCal}
            loading={props.rCalRequest}
          />
        </View>
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  mainContainer: { flex: 1 },

  cardStyle: {
    backgroundColor: 'white',
    marginHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 20,
    marginTop: 30,
    borderRadius: 8,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.34,
    shadowRadius: 0.27,

    elevation: 15,
  },

  thumb: {
    width: 30,
    height: 30,
    borderRadius: 100,
    backgroundColor: Colors.secondary,
    borderWidth: 1,
    borderColor: Colors.azureradiance,
  },
  track: { width: 200, height: 20, borderRadius: 10, backgroundColor: Colors.alto }
});

const mapStateToProps = state => ({
  consumeCalories: state.customCalReducer.getCalories,
  meals: state.customCalReducer.meals,
  profile: state.login.userDetail,
  rCalRequest: state.customCalReducer.rCalRequest
});

const mapDispatchToProps = dispatch => ({
  postRequiredCalRequest: (id, data) => dispatch(postRequiredCalRequest(id, data)),
  // getMealsRequest: () => dispatch(getMealsRequest()),
});
export default connect(mapStateToProps, mapDispatchToProps)(EditCaloriesManually);
