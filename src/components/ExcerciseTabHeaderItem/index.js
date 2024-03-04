import React, { useRef, useEffect, useState } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  StyleSheet
} from "react-native"
import { Images } from "../../theme"

const width = Dimensions.get("screen").width / 3.1

const ExcerciseTabHeaderItem = ({
  goToPage,
  activeTab,
  index,
  item
  // setElemetForParent,
  // pickSessionAction,
  // selectedSession,
  // individualSetsDetails,
  // setStartRest,
  // setShowBar,
}) => {
  const viewRef = useRef(null)
  // const [element, setElement] = useState(null);

  // useEffect(() => {
  //   if (activeTab === index) {
  //     // item.sets.map((item, i) => {
  //     item.sets.length > 0 && individualSetsDetails(item.sets[0].id);
  //     // });
  //   }
  //   if (element) {
  //     setElemetForParent(element);
  //   }
  // }, [element]);

  // function onLayoutHelper({ nativeEvent: { layout } }) {
  //   const { x, y } = layout;
  //   setElement({
  //     x,
  //     y,
  //     index,
  //     item,
  //     done: item?.done,
  //   });
  // }

  return (
    <View
      ref={viewRef}
      // onLayout={onLayoutHelper}
      style={{
        backgroundColor: "white",
        marginTop: activeTab !== index ? 5 : 0,
        borderTopLeftRadius: activeTab === index ? 7 : 0,
        borderTopRightRadius: activeTab === index ? 7 : 0
      }}
    >
      <TouchableOpacity
        // onPress={() => {
        //   pickSessionAction(selectedSession[index], selectedSession);
        //   goToPage(index);
        //   setStartRest(false);
        //   setShowBar(false);
        // }}
        style={[
          styles.touchButtonContainer,
          {
            marginTop: activeTab !== index ? 5 : 0,
            height: activeTab === index ? 70 : 60,
            backgroundColor:
              activeTab === index ? "white" : "rgb(242, 242, 242)"
          }
        ]}
      >
        <View style={styles.buttonContainer}>
          {item?.done ? (
            <View style={styles.doneWrapper}>
              <Image source={Images.iconDone} style={styles.imageWrapper} />
            </View>
          ) : null}
          <View
            style={{
              flex: item?.done ? 2 : 1,
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
              paddingLeft: item?.done ? 0 : 10,
              paddingRight: 10
            }}
          >
            <Text
              style={{
                color: "black",
                fontSize: 15,
                textAlign: "center"
              }}
              ellipsizeMode="tail"
              numberOfLines={3}
            >
              {`${index + 1}. ${item?.exercise?.name}`}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  touchButtonContainer: {
    marginBottom: -10,
    width,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginHorizontal: 2.5
  },
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: 60,
    flexDirection: "row"
  },
  doneWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  imageWrapper: {
    width: 20,
    height: 20
  }
})

export default ExcerciseTabHeaderItem
