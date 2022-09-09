import React, { useEffect, useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { Icon } from 'native-base';
import { Gutters, Layout, Global, Colors } from '../../theme';
import moment from 'moment';
import { useIsFocused } from '@react-navigation/native';
import { Card, WorkoutComponent, Text } from '../../components';
import { useNetInfo } from '@react-native-community/netinfo';
import { getAllSessionRequest } from '../../ScreenRedux/programServices';
import { connect } from 'react-redux';

const ProgramScreen = props => {
  const {
    navigation,
    getAllSessions,
    loadingAllSession,
  } = props;
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeButton, setActiveButton] = useState(false);

  const [weekDate, setWeekDate] = useState('');

  const { tinyLMargin, tinyRMargin } = Gutters;
  const { row, fill, alignItemsCenter, justifyContentEnd, justifyContentBetween } = Layout;
  const { secondaryBg, turtiaryBg } = Global;

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      const newDate = moment(new Date()).format('YYYY-MM-DD');
      setWeekDate(newDate);
      props.getAllSessionRequest(newDate);
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <SafeAreaView style={[fill, secondaryBg]}>
      <ScrollView showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
        <View style={[fill, row, justifyContentBetween, alignItemsCenter, styles.preview]}>
          <TouchableOpacity
            style={[alignItemsCenter, fill, row, styles.buttonWrapper]}
            disabled={true}
          >
            {false && (
              <>
                <Icon type="FontAwesome5" name="caret-left" />
                <Text
                  color="primary"
                  text={`Week ${2}`}
                  style={[tinyLMargin, { fontSize: 15, lineHeight: 18 }]}
                />
              </>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[justifyContentEnd, alignItemsCenter, fill, row, styles.buttonWrapper]}
            disabled={true}
          >
            {false && (
              <>
                <Text
                  color="primary"
                  text={`Week ${2}`}
                  style={[tinyRMargin, { fontSize: 15, lineHeight: 18 }]}
                />
                <Icon type="FontAwesome5" name="caret-right" />
              </>
            )}
          </TouchableOpacity>
        </View>
        <View style={fill}>
          <View style={fill}>
            <WorkoutComponent
              onPress={() => {
                navigation.navigate('ExerciseScreen')
              }}
              isVisible={isVisible}
              setIsVisible={setIsVisible}
              activeButton={activeButton}
              setActiveButton={setActiveButton}
              navigation={navigation}
              weekDate={weekDate}
              setWeekDate={setWeekDate}
            />
          </View>
          <View>
            <Card
              style={

                {
                  backgroundColor: Colors.alto,
                }
              }
              text={'No WorkOut'}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 400,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainInnerWrapper: {
    height: 60,
  },
  tabButtonsContainer: {
    width: 110,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '500',
    color: 'black',
    paddingVertical: 5,
    borderBottomWidth: 2,
  },
  leftArrowStyle: {
    width: 30,
    height: 30,
  },
  preview: {
    paddingHorizontal: 20,
    backgroundColor: '#f9f9f9',
    paddingVertical: 10,
  },
  buttonWrapper: {
    height: 30,
  },
  noProgramWrapper: { height: 500 },
  noProgramWrapperText: { color: 'black', fontSize: 30 },
});

const mapStateToProps = state => ({
  getAllSessions: state.programReducer.getAllSessions,
  // exerciseSwapped: state.sessions && state.sessions.exerciseSwapped,
  // loadingAllSession: state.sessions && state.sessions.loadingAllSession,
  // saveSwipeState: state.sessions && state.sessions.saveSwipeState,
  // resetSwipeAction: state.sessions && state.sessions.resetSwipeAction,
});

const mapDispatchToProps = dispatch => ({
  getAllSessionRequest: (data) => dispatch(getAllSessionRequest(data)),
  // pickSessionAction: (data) => dispatch(pickSession(data)),
  // saveSwipeDateAction: () => dispatch(saveSwipeDateAction()),
  // resetSwipeDateAction: () => dispatch(resetSwipeDateAction()),
  // getAllSwapExercise: () => dispatch(allSwapExercise()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProgramScreen);

