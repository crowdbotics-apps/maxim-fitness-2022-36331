import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
// components
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Icon } from 'native-base';
import { CreditCardInput } from 'react-native-input-credit-card';
import { getCustomerIdRequest, postSubscriptionRequest } from '../../ScreenRedux/subscriptionRedux';

import { Button } from '../../components';
import { Images } from '../../theme'

const CreditCard = props => {
  const {
    navigation,
    route: {
      params: { plan_id, product },
    },
  } = props;
  const [data, setData] = useState([]);

  useEffect(() => {
    props.getCustomerIdRequest();
  }, []);

  const creditCardData = form => {
    setData(form);
  };

  const getDataFromCard = () => {
    const month = data.values.expiry.slice(0, 2);
    const year = data.values.expiry.slice(3, 5);
    props.postSubscriptionRequest({
      card_number: data.values.number,
      card_exp_month: month,
      card_exp_year: year,
      card_cvv: data.values.cvc,
      plan_id: plan_id,
      product: product,
    });
    // navigation.navigate('SurveyScreen');
  };

  return (
    <>
      <TouchableOpacity style={styles.leftArrow} onPress={() => navigation.goBack()}>
        <Image source={Images.backArrow} style={styles.backArrowStyle} />
      </TouchableOpacity>
      <View style={{ marginTop: 30 }}>
        <CreditCardInput onChange={form => creditCardData(form)} />
      </View>
      <View style={{ marginHorizontal: 20, justifyContent: 'center', alignItems: 'center' }}>
        <Button
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
          onPress={() => getDataFromCard()}
          disabled={!data.valid}
        />
      </View>
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
});

const mapStateToProps = state => ({
  customerId: state.subscriptionReducer.getCISuccess,
  getPlans: state.subscriptionReducer.getPlanSuccess,
  // subscription: state.subscription.subscription,
});

const mapDispatchToProps = dispatch => ({
  getCustomerIdRequest: () => dispatch(getCustomerIdRequest()),
  postSubscriptionRequest: data => dispatch(postSubscriptionRequest(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CreditCard);
