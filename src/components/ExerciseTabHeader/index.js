import React, { useRef, useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import ExcerciseTabHeaderItem from '../ExcerciseTabHeaderItem';

const ExerciseTabHeader = ({
  tabs,
  goToPage,
  activeTab,
  pickSessionAction,
  selectedSession,
  exerciseObjId,
  freeToGoToNext,
  setFreeToGoToNext,
  individualSetsDetails,
  setStartRest,
  setShowBar,
}) => {
  const scrollViewRef = useRef(null);

  // const [scrolled, setScrolled] = useState(false);
  // const [elementsFromScrollView, setElementsFromScrollView] = useState([]);

  // const setElementForScrollHelp = element => {
  //   const scrollViewRemoveCurrent = elementsFromScrollView.filter(
  //     elementItem => elementItem?.item?.id !== element?.item?.id
  //   );
  //   const sortedElements = [...scrollViewRemoveCurrent, element].sort((a, b) =>
  //     a.index > b.index ? 1 : -1
  //   );
  //   setElementsFromScrollView(sortedElements);
  // };

  // useEffect(() => {
  //   if (freeToGoToNext === true) {
  //     goToPage(activeTab + 1);
  //   }
  //   const [findFirstUndone, nextWorkout] = selectedSession?.filter(item => !item?.done);
  //   if (freeToGoToNext) {
  //     if (findFirstUndone) {
  //       pickSessionAction(findFirstUndone, selectedSession, nextWorkout);
  //       setFreeToGoToNext(false);
  //     }
  //   }
  // }, []);

  // useEffect(() => {
  //   if (exerciseObjId && !scrolled) {
  //     const [getPicked] = elementsFromScrollView.filter(
  //       exerciseItem => exerciseItem?.item?.id === exerciseObjId
  //     );
  //     if (getPicked && !scrolled) {
  //       goToPage(getPicked.index);
  //       setScrolled(true);
  //     }
  //   }
  // }, [exerciseObjId, elementsFromScrollView, scrolled]);

  // useEffect(() => {
  //   const [findFirstUndone] = elementsFromScrollView.filter(item => !item?.done);
  //   if (
  //     elementsFromScrollView.length === tabs.length &&
  //     !exerciseObjId &&
  //     !scrolled &&
  //     findFirstUndone
  //   ) {
  //     scrollViewRef.current.scrollTo({
  //       x: findFirstUndone.x,
  //       y: findFirstUndone.y,
  //     });
  //     setScrolled(true);
  //   }
  // }, [elementsFromScrollView, exerciseObjId, scrolled, tabs.length]);
  return (
    <View style={styles.mainWrapper}>
      <ScrollView
        horizontal
        ref={scrollViewRef}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        directionalLockEnabled
        bounces={false}
        scrollsToTop={false}
        contentContainerStyle={styles.contentContainerStyle}
      >
        {tabs.map((item, index) => (
          <ExcerciseTabHeaderItem
            key={index}
            // setElemetForParent={setElementForScrollHelp}
            item={item}
            index={index}
            goToPage={goToPage}
            activeTab={activeTab}
            // pickSessionAction={pickSessionAction}
            // selectedSession={selectedSession}
            // individualSetsDetails={individualSetsDetails}
            // setStartRest={setStartRest}
            // setShowBar={setShowBar}
          />
        ))}
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  mainWrapper: {
    backgroundColor: 'rgb(214,214,214)',
    height: 76,
  },
  timeWrapper: {
    textAlign: 'center',
    fontWeight: 'bold',
    paddingVertical: 10,
    fontSize: 18,
    color: 'black',
  },
  contentContainerStyle: {
    flexDirection: 'row',
    backgroundColor: 'rgb(214,214,214)',
    height: 75,
  },
});
export default ExerciseTabHeader;
