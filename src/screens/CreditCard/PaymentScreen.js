//import liraries
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View, TouchableOpacity, Text, Image } from 'react-native';
import { CardField, createToken } from '@stripe/stripe-react-native';
import { connect } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { Images } from '../../theme';
import { postSubscriptionRequest } from '../../ScreenRedux/subscriptionRedux';
import { showMessage } from 'react-native-flash-message';

const PaymentScreen = props => {
    const { postSubscriptionRequest } = props;
    const navigation = useNavigation();
    const [cardInfo, setCardInfo] = useState(null);

    const fetchCardDetail = cardDetail => {
        if (cardDetail?.complete) {
            setCardInfo(cardDetail);
        } else {
            setCardInfo(null);
        }
    };

    const saveData = async () => {
        if (!!cardInfo) {
            try {
                const res = await createToken({ ...cardInfo, type: 'Card' });
                if (res?.token) {
                    await postSubscriptionRequest({ card_token: res?.token?.id });
                    navigation.navigate('CreditCard');
                }
            } catch (error) {
                showMessage(message = 'something went wrong during card creation', type = 'danger')
            }
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity
                style={styles.leftArrow}
                onPress={() => navigation.goBack()}
            >
                <Image source={Images.backArrow} style={styles.backArrowStyle} />
            </TouchableOpacity>
            <View style={styles.content}>
                <Text style={styles.title}>
                    Please Add Your Card Details
                </Text>
                <CardField
                    postalCodeEnabled={false}
                    placeholders={{
                        number: '4242 4242 4242 4242',
                    }}
                    cardStyle={{
                        backgroundColor: '#FFFFFF',
                        textColor: '#000000',
                    }}
                    style={styles.cardField}
                    onCardChange={fetchCardDetail}

                />
                <TouchableOpacity
                    disabled={!cardInfo?.complete}
                    onPress={saveData}
                    style={[styles.button, !cardInfo?.complete && styles.disabledButton]}
                >
                    <Text style={styles.buttonText}>Confirm</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    leftArrow: {
        marginTop: 20,
        zIndex: 22,
        left: 10,
        width: 50,
        height: 50,
    },
    content: {
        padding: 16,
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        alignSelf: 'center',
        marginTop: 50,
    },
    cardField: {
        width: '100%',
        height: 50,
        marginVertical: 30,
    },
    button: {
        height: 40,
        width: '100%',
        backgroundColor: 'white',
        elevation: 5,
        borderRadius: 10,
        marginTop: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    disabledButton: {
        backgroundColor: 'lightgrey',
    },
    buttonText: {
        fontSize: 17,
        fontWeight: 'bold',
    },
});

const mapStateToProps = state => ({
    customerId: state.subscriptionReducer.getCISuccess,
    getPlans: state.subscriptionReducer.getPlanSuccess,
    getCardData: state.subscriptionReducer.getCardData,
    cardRequesting: state.subscriptionReducer.cardRequesting,
    cardPlanData: state.subscriptionReducer.cardPlanData,

});

const mapDispatchToProps = dispatch => ({
    postSubscriptionRequest: data => dispatch(postSubscriptionRequest(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PaymentScreen);
