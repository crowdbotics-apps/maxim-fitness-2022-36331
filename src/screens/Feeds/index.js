import React, {useState, useEffect, useRef} from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Dimensions,
  RefreshControl,
  ActivityIndicator
} from "react-native";
import {Text, Header, FeedCard} from 'src/components';
import {Images} from 'src/theme';
import {getFeedsRequest} from '../Feeds/redux';
import {connect} from "react-redux";
import {useNetInfo} from '@react-native-community/netinfo';

const Feeds = (props) => {
  const {feeds, requesting} = props
  const [feedsState, setFeedsState] = useState([])
  const [page, setPage] = useState(1);
  console.log('feeds: ', feeds);

  let netInfo = useNetInfo();
  useEffect(() => {
    props.getFeedsRequest(page)
  }, [])
  const flatList = useRef();
  const moveToTop = () => {
    props.getFeedsRequest(1);
    flatList?.current?.scrollToIndex({index: 0, animated: true});
  };

  useEffect(() => {
    if (feeds?.results?.length) {
      if (feedsState.length && page > 1) {
        setFeedsState([...feedsState, ...feeds.results]);
      } else {
        setFeedsState(feeds?.results);
      }
    }
  }, [feeds]);


  let deviceWidth = Dimensions.get('window').width;
  let deviceHeight = Dimensions.get('window').height;


  const renderItem = ({item, index}) => {
    return (
      <FeedCard
        item={item}
        index={index}
        feeds={feeds}
      />
    );
  };


  const onPullToRefresh = () => {
    setPage(1);
    props.getFeedsRequest(page);
    moveToTop();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header imageUrl={Images.profile} />
      <Text style={styles.content} text="Latest..." />

      {netInfo?.isConnected ? (
        requesting ? (
          <ActivityIndicator size="large" color="#000" style={{margin: 65}} />
        ) :
          feedsState.length > 0 ?
            (
              <FlatList
                ref={flatList}
                refreshControl={
                  <RefreshControl
                    colors={['#9Bd35A', '#689F38']}
                    refreshing={requesting}
                    onRefresh={() => onPullToRefresh()}
                    progressViewOffset={20}
                  />
                }
                data={feedsState}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                extraData={feedsState}
                // onEndReached={onEnd}
                windowSize={250}
                // onViewableItemsChanged={onViewRef.current}
                // viewabilityConfig={viewConfigRef.current}
                keyboardShouldPersistTaps={'handled'}
              />
            ) : (
              <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={styles.comingSoon} text="No post are available!" bold />
              </View>
            )) : (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={styles.emptyListLabel}>{'Network error!'}</Text>
        </View>
      )
      }
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    fontSize: 15,
    color: 'gray',
    paddingHorizontal: 15,
    marginTop: 10
  }
})

const mapStateToProps = state => ({
  requesting: state.feedsReducer.requesting,
  feeds: state.feedsReducer.feeds
})

const mapDispatchToProps = dispatch => ({
  getFeedsRequest: data => dispatch(getFeedsRequest(data)),

})
export default connect(mapStateToProps, mapDispatchToProps)(Feeds)