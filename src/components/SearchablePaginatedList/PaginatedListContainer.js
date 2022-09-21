import React from 'react';
import {FlatList, View, Platform} from 'react-native';
import Loading from '../Loading';

const Loader = Platform.select({
  ios: () => (
    <View style={{paddingTop: 10}}>
      <Loading />
    </View>
  ),
  android: () => <Loading />,
});

const PaginatedListContainer = ({
  list,
  refreshing,
  handleRefreshFunc,
  renderItem,
  numColumns,
  hasMore,
  style,
  refreshingTop,
  refreshListToInitial,
  contentContainerStyle,
  ListEmptyComponent,
  keyboardDismissMode,
  keyboardShouldPersistTaps,
  horizontal,
  showsHorizontalScrollIndicator,
  keyExtractor,
}) => (
  <FlatList
    keyboardDismissMode={keyboardDismissMode}
    keyboardShouldPersistTaps={keyboardShouldPersistTaps}
    refreshing={refreshingTop}
    onRefresh={refreshListToInitial}
    data={list.length ? list : []}
    scrollsToTop={false}
    onEndReached={handleRefreshFunc}
    renderItem={renderItem}
    numColumns={numColumns}
    style={style}
    contentContainerStyle={contentContainerStyle}
    keyExtractor={keyExtractor}
    onEndReachedThreshold={0.5}
    ListEmptyComponent={ListEmptyComponent}
    horizontal={horizontal}
    showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
  />
);

export default PaginatedListContainer;
