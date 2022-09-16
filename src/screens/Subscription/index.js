import React, { useEffect, useState } from 'react'

// components
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native'
import { Content, Icon } from 'native-base'
import { Text, Button, Loader } from '../../components'
import Card from './component/Card'
import Card1 from './component/Card1'
import Card2 from './component/Card2'
import { connect } from 'react-redux'
import {
  // getSubscriptionRequest,
  getPlanRequest,
  getCustomerIdRequest,
} from '../../ScreenRedux/subscriptionRedux';

import { Gutters, Layout, Global, Images } from '../../theme'
import Modal from 'react-native-modal'

const SubscriptionScreen = props => {
  const { navigation, getPlans } = props;
  const [curentTab, setCurentTab] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [active, setActive] = useState(true);

  useEffect(() => {
    props.getPlanRequest();
    props.getCustomerIdRequest();
  }, []);

  const card = () => {
    let plan_id = getPlans.length > 0 && getPlans[0].id;
    let product = getPlans.length > 0 && getPlans[0].product;
    navigation.navigate('CreditCard', { plan_id, product });
  };
  const card1 = () => {
    let plan_id = getPlans.length > 0 && getPlans[1].id;
    let product = getPlans.length > 0 && getPlans[1].product;
    navigation.navigate('CreditCard', { plan_id, product });
  };

  const card2 = () => {
    let plan_id = getPlans.length > 0 && getPlans[2].id;
    let product = getPlans.length > 0 && getPlans[2].product;
    navigation.navigate('CreditCard', { plan_id, product });
  };

  const { largeHMargin, mediumTMargin } = Gutters;
  const { row, fill, center, alignItemsCenter, justifyContentBetween } = Layout;
  const { border } = Global;
  const { leftArrow, iconWrapper } = styles;

  const setData = item => {
    if (item === 'No') {
      navigation.navigate('CreditCard');
      setIsVisible(false);
    } else if (item === 'Yes') {
      setActive(!active);
    }
  };
  return (
    <>
      <TouchableOpacity style={styles.leftArrow} onPress={() => goBack()}>
        <Image source={Images.backArrow} style={styles.backArrowStyle} />
      </TouchableOpacity>
      <View style={[row, largeHMargin, justifyContentBetween]}>
        <Loader isLoading={props.requesting} />

        <TouchableOpacity onPress={() => setCurentTab(0)} style={[center, alignItemsCenter, fill]}>
          <Text text="Diet" style={curentTab === 0 && { fontWeight: 'bold' }} smallTitle />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCurentTab(1)} style={[center, alignItemsCenter, fill]}>
          <Text text="Exercise" style={curentTab === 1 && { fontWeight: 'bold' }} smallTitle />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCurentTab(2)} style={[center, alignItemsCenter, fill]}>
          <Text text="Pro" style={curentTab === 2 && { fontWeight: 'bold' }} smallTitle />
        </TouchableOpacity>
      </View>
      <Content>
        {curentTab === 0 && (
          <Card
            onPress={card}
            setIsVisible={setIsVisible}
            navigation={navigation}
            getPlans={getPlans}
          />
        )}
        {curentTab === 1 && (
          <Card1
            onPress={card1}
            setIsVisible={setIsVisible}
            navigation={navigation}
            getPlans={getPlans}
          />
        )}
        {curentTab === 2 && (
          <Card2
            onPress={card2}
            setIsVisible={setIsVisible}
            navigation={navigation}
            getPlans={getPlans}
          />
        )}
      </Content>
      <Modal
        isVisible={isVisible}
        animationOutTiming={1}
        onBackButtonPress={() => setIsVisible(false)}
      >
        <View style={center}>
          <Text text="Do you have an Access Code?" color="secondary" smallTitle />
          <>
            {active ? (
              <View style={center}>
                <Button
                  color="primary"
                  text={'Yes'}
                  style={[
                    border,
                    center,
                    mediumTMargin,
                    {
                      height: 40,
                      width: 100,
                      backgroundColor: 'transparent',
                      borderColor: 'white'
                    },
                  ]}
                  onPress={() => setData('Yes')}
                />
                <Button
                  color="primary"
                  text={'No'}
                  style={[
                    border,
                    center,
                    mediumTMargin,
                    {
                      height: 40,
                      width: 100,
                      backgroundColor: 'transparent',
                      borderColor: 'white'
                    },
                  ]}
                  onPress={() => setData('No')}
                />
              </View>
            ) : (
              <View style={alignItemsCenter}>
                <View>
                  <Button
                    color="secondary"
                    text={'Orum 50 off'}
                    style={[border, center, mediumTMargin, { height: 40, width: 150 }]}
                    onPress={() => setIsVisible(false)}
                    center
                  />
                </View>
                <View>
                  <Button
                    color="primary"
                    text={'Enter'}
                    style={[
                      border,
                      center,
                      mediumTMargin,
                      {
                        height: 40,
                        width: 100,
                        backgroundColor: 'transparent',
                        borderColor: 'white'
                      },
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
  );
};
const styles = StyleSheet.create({
  leftArrow: {
    marginTop: 20,
    zIndex: 22,
    left: 10,
    width: 50,
    height: 50,
  },
  iconWrapper: {
    fontSize: 50,
    lineHeight: 50,
  },
  gradientWrapper: {
    borderRadius: 40,
  },
});
const mapStateToProps = state => ({
  getPlans: state.subscriptionReducer.getPlanSuccess,
  customerId: state.subscriptionReducer.getCISuccess,
  requesting: state.subscriptionReducer.requesting,
  // subscription: state.subscription.subscription,
});

const mapDispatchToProps = dispatch => ({
  getPlanRequest: () => dispatch(getPlanRequest()),
  // getSubscriptionRequest: plan_id => dispatch(getSubscriptionRequest(plan_id)),
  getCustomerIdRequest: () => dispatch(getCustomerIdRequest()),
});

export default connect(mapStateToProps, mapDispatchToProps)(SubscriptionScreen);
