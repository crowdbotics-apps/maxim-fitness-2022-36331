import React from "react"
import { View, StyleSheet, Image } from "react-native"
import Text from "../Text"
import { Gutters, Layout, Global, Colors } from "../../theme"

const ExerciseCard = ({ route }) => {
  const {
    regularHMargin,
    tinyBMargin,
    regularVMargin,
    regularHPadding,
    regularVPadding,
    tinyVPadding,
    smallHPadding,
    smallLMargin
  } = Gutters
  const { row, fill, fill2x, center, justifyContentBetween } = Layout
  const { secondaryBg, border, borderR30, borderAlto } = Global

  return (
    <>
      {route && route.params.item
        ? route.params.item.map((item, i) => {
            if (item.done === true) {
              return (
                <>
                  <View
                    style={[
                      row,
                      border,
                      borderR30,
                      regularHMargin,
                      regularVMargin,
                      regularVPadding,
                      smallHPadding,
                      borderAlto,
                      styles.mainWrapper
                    ]}
                  >
                    <View
                      style={[
                        fill,
                        center,
                        secondaryBg,
                        styles.mainInnerWrapper
                      ]}
                    >
                      <Image
                        source={{
                          uri: item.exercise.pictures[0]?.image
                            .split("?", 1)
                            .toString()
                        }}
                        style={styles.imageWrapper}
                      />
                    </View>
                    <View style={[fill2x, smallLMargin]}>
                      <Text
                        text={item.exercise.name}
                        style={[regularHPadding, { color: "#626262" }]}
                        large
                        bold
                      />
                      <View
                        style={[
                          row,
                          justifyContentBetween,
                          regularHPadding,
                          tinyVPadding
                        ]}
                      >
                        <View style={[fill, center]}>
                          <Text text="Set" color="senary" />
                        </View>
                        <View style={[fill2x, center]}>
                          <Text text="Reps" color="senary" />
                        </View>
                        <View style={[fill2x, center]}>
                          <Text text="Weight" color="senary" />
                        </View>
                      </View>
                      {item.sets.map(item => (
                        <View
                          style={[
                            row,
                            justifyContentBetween,
                            smallHPadding,
                            tinyVPadding,
                            secondaryBg,
                            tinyBMargin,
                            styles.borderR10
                          ]}
                        >
                          <View style={[fill, center]}>
                            <Text text={item.set_no} color="quinary" />
                          </View>
                          <View style={[fill2x, center]}>
                            <Text text={item.reps} color="quinary" />
                          </View>
                          <View style={[fill2x, center]}>
                            <Text
                              text={item.weight === 0 ? "0" : item.weight}
                              color="quinary"
                            />
                          </View>
                        </View>
                      ))}
                    </View>
                  </View>
                </>
              )
            }
          })
        : route.params.summary.map((item, i) => {
            return (
              <>
              {item?.exercises.length &&
              item?.exercises?.map((exercise, i) => {
                return(
                  <View
                style={[
                  row,
                  border,
                  borderR30,
                  regularHMargin,
                  regularVMargin,
                  regularVPadding,
                  smallHPadding,
                  borderAlto,
                  styles.mainWrapper
                ]}
              >
                <View
                  style={[fill, center, secondaryBg, styles.mainInnerWrapper]}
                >
                  <Image
                    source={{
                      uri: exercise?.video_thumbnail
                    }}
                    style={styles.imageWrapper}
                  />
                </View>
                <View style={[fill2x, smallLMargin]}>
                  <Text
                    text={exercise?.name}
                    style={[regularHPadding, { color: "#626262" }]}
                    large
                    bold
                  />
                  <View
                    style={[
                      row,
                      justifyContentBetween,
                      regularHPadding,
                      tinyVPadding
                    ]}
                  >
                    <View style={[fill, center]}>
                      <Text text="Set" color="senary" />
                    </View>
                    <View style={[fill2x, center]}>
                      <Text text="Reps" color="senary" />
                    </View>
                    <View style={[fill2x, center]}>
                      <Text text="Weight" color="senary" />
                    </View>
                  </View>
                  {exercise?.sets?.map(item => (
                    <View
                      style={[
                        row,
                        justifyContentBetween,
                        smallHPadding,
                        tinyVPadding,
                        secondaryBg,
                        tinyBMargin,
                        styles.borderR10
                      ]}
                    >
                      <View style={[fill, center]}>
                        <Text text={item.set_no} color="quinary" />
                      </View>
                      <View style={[fill2x, center]}>
                        <Text text={item.reps} color="quinary" />
                      </View>
                      <View style={[fill2x, center]}>
                        <Text
                          text={item.weight === 0 ? 0 : item.weight}
                          color="quinary"
                        />
                      </View>
                    </View>
                  ))}
                </View>
              </View>
                )
              })}
               
              </>
            )
          })}
    </>
  )
}

const styles = StyleSheet.create({
  mainWrapper: {
    backgroundColor: Colors.athensgraySecond
  },
  mainInnerWrapper: {
    height: 100,
    width: 100,
    overflow: "hidden",
    borderRadius: 20
  },
  imageWrapper: {
    height: 100,
    width: 110,
    borderRadius: 10
    // resizeMode: "stretch"
  },
  borderR10: {
    borderRadius: 10
  }
})
export default ExerciseCard
