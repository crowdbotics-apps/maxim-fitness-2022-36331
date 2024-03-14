import React from "react"
import { View, StyleSheet, TouchableOpacity } from "react-native"
import { Layout, Gutters, Colors } from "../../theme"
import LinearGradient from "react-native-linear-gradient"
import { useNavigation } from "@react-navigation/native"
import { Text } from "../../components"

const SubscriptionCard = props => {
  const navigation = useNavigation()
  const {
    cardHeading = "",
    cardDescription = "",
    buttonText = "Buy Subscription"
  } = props
  const {  fill, center} = Layout
  const {  regularVMargin } = Gutters
  const start = { x: 0, y: 0 }
  const end = { x: 1, y: 0 }
  return (
    <View style={[center, styles.cardView2]}>
      <Text text={cardHeading} style={styles.heading3} />
      <View style={{ marginHorizontal: 10, marginTop: 10 }}>
        <Text text={cardDescription} style={styles.praText} />
      </View>
      <View style={[fill, center, regularVMargin]}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Subscription")
          }}
        >
          <LinearGradient
            start={start}
            end={end}
            colors={["#00a2ff", "#00a2ff"]}
            style={[
              fill,
              Gutters.small2xHPadding,
              Gutters.regularVPadding,
              styles.gradientWrapper
            ]}
          >
            <Text
              text={buttonText}
              style={{
                fontSize: 16,
                lineHeight: 18,
                fontWeight: "bold",
                color: "#fff"
              }}
            />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  gradientWrapper: {
    borderRadius: 16,
    borderColor: Colors.azureradiance
  },
  cardView2: {
    borderWidth: 2,
    padding: 13,
    marginTop: 40,
    width: "100%",
    borderRadius: 10,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,

    elevation: 10,
    borderColor: Colors.primary
  },
  heading3: {
    fontSize: 15,
    lineHeight: 20,
    color: "black",
    fontWeight: "bold"
  },
  praText: {
    fontSize: 12,
    lineHeight: 16,
    color: "gray",
    fontWeight: "500",
    textAlign: "left"
  },
})
export default SubscriptionCard
