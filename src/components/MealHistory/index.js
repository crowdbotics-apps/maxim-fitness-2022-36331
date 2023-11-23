import React from 'react';
import { View, StyleSheet, Platform, Image } from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';
// components
import Text from '../Text';
import { Gutters, Layout, Global, Colors } from '../../theme';
import { Content } from 'native-base';

const MealHistory = ({ mealsByDate, activeTab }) => {
  const getCarbs = data => {
    let carbs = 0;
    data?.map(food => {
      food?.food_items?.map(f => {
        carbs += f.carbohydrate;
      });
    });

    return carbs;
  };

  const getPortien = data => {
    let portien = 0;
    data?.map(food => {
      food?.food_items?.map(f => {
        portien += f.protein;
      });
    });
    return portien;
  };
  const getFat = data => {
    let fat = 0;
    data?.map(food => {
      food?.food_items?.map(f => {
        fat += f.fat;
      });
    });
    return fat;
  };
  const {
    smallBMargin,
    smallVPadding,
    regularHMargin,
    smallRMargin,
    smallHMargin,
    regularLPadding,
    regularHPadding,
    regularVPadding,
  } = Gutters;
  const {
    row,
    fill,
    column,
    center,
    alignItemsCenter,
    justifyContentCenter,
    justifyContentBetween,
  } = Layout;
  const { secondaryBg, border } = Global;

  return (
    <>
      {mealsByDate.length > 0 ? (
        <View style={fill}>
          <Content>
            {mealsByDate.length > 0 &&
              mealsByDate.map((item, index) => {
                return (
                  <>
                    <View key={index}>
                      <View style={[smallVPadding, styles.titleContainerStyle]}>
                        <Text style={styles.mealText} text={`Meal ${index + 1}`} />
                      </View>
                      <View
                        style={[
                          border,
                          secondaryBg,
                          smallBMargin,
                          smallHMargin,
                          regularVPadding,
                          styles.itemContainer,
                        ]}
                      >
                        <View style={[fill, column, justifyContentCenter, regularLPadding]}>
                          <Text
                            style={styles.clockContainer}
                            text={moment(item && item.date_time).format('h:mm a')}
                          />
                        </View>
                        <View style={[row, alignItemsCenter]}>
                          <View style={[regularHMargin, smallVPadding]}>
                            <View style={row}>
                              <Text
                                style={[styles.textWrapper, { color: '#00a1ff' }]}
                                text={`${Math.ceil(getPortien([item])) || '0'} g`}
                              />
                              <Text
                                style={[styles.textWrapper, { color: '#fbe232' }]}
                                text={`${Math.ceil(getCarbs([item])) || '0'} g`}
                              />
                              <Text
                                style={[styles.textWrapper, { color: '#ee230d' }]}
                                text={`${Math.ceil(getFat([item])) || '0'} g`}
                              />
                            </View>
                            <View style={row}>
                              <Text style={styles.textWrapper} text="Protein" />
                              <Text style={styles.textWrapper} text="Carb" />
                              <Text style={styles.textWrapper} text="Fat" />
                            </View>
                          </View>
                        </View>
                        {item.food_items
                          ? item.food_items.map((c, i) => {
                              return (
                                <View
                                  key={i}
                                  style={[
                                    row,
                                    regularHPadding,
                                    smallVPadding,
                                    alignItemsCenter,
                                    styles.innerContainer,
                                  ]}
                                >
                                  <Image
                                    style={[smallRMargin, styles.imageWrapper]}
                                    source={{ uri: c && c.food.thumb }}
                                  />
                                  <View style={[row, fill, justifyContentBetween]}>
                                    <Text text={c.food && c.food.name} bold />
                                    <Text text={c.unit && c.unit.name} bold />
                                  </View>
                                </View>
                              );
                            })
                          : null}
                      </View>
                    </View>
                  </>
                );
              })}
          </Content>
        </View>
      ) : (
        <View style={[fill, center]}>
          <Text
            text={`Meals not found for ${moment(activeTab).format('MM/DD/YY')} day`}
            bold
            style={{ color: 'black' }}
          />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  imageAddIcon: {
    width: 35,
    height: 35,
  },
  mealText: {
    fontSize: 22,
    paddingLeft: 10,
    color: Colors.black,
    fontWeight: 'bold',
  },
  itemContainer: {
    borderRadius: 10,
    borderColor: 'rgb(214,213,213);',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.2,
      },
      android: {
        shadowRadius: 1,
        shadowOpacity: 1,
        elevation: 3,
      },
    }),
  },
  innerContainer: {
    borderTopColor: 'rgb(214,213,213);',
    borderTopWidth: 1,
  },
  clockContainer: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  textWrapper: {
    width: 70,
  },
  imageWrapper: {
    width: 45,
    height: 45,
    resizeMode: 'contain',
  },
});

MealHistory.defaultProps = {
  clock: '',
  mealItems: [],
  numberOfProtein: 0,
  numberOfCarbs: 0,
  numberOfFat: 0,
  index: 0,
};

MealHistory.propTypes = {
  clock: PropTypes.string,
  mealItems: PropTypes.arrayOf(PropTypes.shape({})),
  numberOfProtein: PropTypes.number,
  numberOfCarbs: PropTypes.number,
  numberOfFat: PropTypes.number,
  index: PropTypes.number,
};

export default MealHistory;