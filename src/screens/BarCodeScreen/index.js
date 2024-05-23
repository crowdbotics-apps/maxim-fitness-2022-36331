import React, { useState, useEffect } from "react"
import {
  Platform,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  View,
  SafeAreaView,
  Linking
} from "react-native"
import { connect } from "react-redux"
import { Loader, Text } from "../../components"
import {
  Camera,
  useCodeScanner,
  useCameraDevice
} from "react-native-vision-camera"

// components
import { Gutters, Images } from "../../theme"
import { getScanFoodsRequest } from "../../ScreenRedux/nutritionRedux"

const BarCodeScreen = props => {
  const device = useCameraDevice("back")
  const [hasPermission, setHasPermission] = useState(false)
  const { navigation, requestingScan } = props

  const codeScanner = useCodeScanner({
    codeTypes: ["qr", "ean-13"],
    onCodeScanned: codes => {
      if (!requestingScan) {
        props.getScanFoodsRequest(codes[0].value)
      }
    }
  })

  useEffect(() => {
    ; (async () => {
      const status = await Camera.requestCameraPermission()
      if (status === "authorized" || status === "granted") {
        setHasPermission(status === "authorized" || status === "granted")
      } else {
        showSettingsAlert()
      }
    })()
  }, [])

  const showSettingsAlert = () => {
    Alert.alert(
      "Camera Permission Denied",
      "To use this feature, you need to grant camera permission. Do you want to go to app settings?",
      [
        {
          text: "Cancel",
          onPress: () => navigation.goBack(),
          style: "cancel"
        },
        {
          text: "OK",
          onPress: () => openAppSettings()
        }
      ],
      { cancelable: false }
    )
  }

  const openAppSettings = () => {
    Linking.openSettings()
  }

  const BarcodeFinder = props => {
    return (
      <View style={[styles.container]}>
        <View
          style={[styles.finder, { height: props.height, width: props.width }]}
        >
          <View
            style={[
              { borderColor: props.borderColor },
              styles.topLeftEdge,
              {
                borderLeftWidth: props.borderWidth,
                borderTopWidth: props.borderWidth
              }
            ]}
          />
          <View
            style={[
              { borderColor: props.borderColor },
              styles.topRightEdge,
              {
                borderRightWidth: props.borderWidth,
                borderTopWidth: props.borderWidth
              }
            ]}
          />
          <View
            style={[
              { borderColor: props.borderColor },
              styles.bottomLeftEdge,
              {
                borderLeftWidth: props.borderWidth,
                borderBottomWidth: props.borderWidth
              }
            ]}
          />
          <View
            style={[
              { borderColor: props.borderColor },
              styles.bottomRightEdge,
              {
                borderRightWidth: props.borderWidth,
                borderBottomWidth: props.borderWidth
              }
            ]}
          />
        </View>
      </View>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {requestingScan && <Loader color="white" />}
      <View
        style={{
          paddingHorizontal: 20,
          flexDirection: "row",
          marginTop: 20,
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <TouchableOpacity style={{}} onPress={() => navigation.goBack()}>
          <Image source={Images.backImage} style={{ height: 20, width: 30 }} />
        </TouchableOpacity>
        <View style={{}}>
          <Text text="Scan" style={{ fontSize: 22, color: "#0D5565" }} bold />
        </View>
        <View />
      </View>
      <View style={{ flex: 1, justifyContent: "center" }}>
        {hasPermission && device && (
          <>
            <View style={{ height: 400 }}>
              <Camera
                device={device}
                isActive={!requestingScan}
                style={{ flex: 1 }}
                codeScanner={codeScanner}
              />
            </View>
            <BarcodeFinder
              width={"80%"}
              height={"35%"}
              borderColor="red"
              borderWidth={2}
            />
          </>
        )}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  },
  finder: {
    alignItems: "center",
    justifyContent: "center"
  },
  topLeftEdge: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 40,
    height: 20
  },
  topRightEdge: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 40,
    height: 20
  },
  bottomLeftEdge: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: 40,
    height: 20
  },
  bottomRightEdge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 40,
    height: 20
  }
})

const mapStateToProps = state => ({
  requestingScan: state.nutritionReducer.requestingScan
})

const mapDispatchToProps = dispatch => ({
  getScanFoodsRequest: data => dispatch(getScanFoodsRequest(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(BarCodeScreen)
