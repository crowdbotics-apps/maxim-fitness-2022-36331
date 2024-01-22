import React, { useState, useEffect } from "react"
import {
  Platform,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  View,
  SafeAreaView
} from "react-native"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import {
  Camera,
  useCodeScanner,
  useCameraDevice,
  useCameraDevices
} from "react-native-vision-camera"
// components
import { Gutters, Images } from "../../theme"

// import {getProductWithBarcodeAction} from '@/redux/modules/nutritionReducer';

const BarcodeScanner = props => {
  const device = useCameraDevice("back")
  const [hasPermission, setHasPermission] = useState(false)
  const {
    navigation: { navigate, goBack }
  } = props

  const codeScanner = useCodeScanner({
    codeTypes: ["qr", "ean-13"],
    onCodeScanned: codes => {
      console.log(`Scanned ${codes.length} codes!`)
    }
  })

  const { regularVPadding } = Gutters

  useEffect(() => {
    ;(async () => {
      const status = await Camera.requestCameraPermission()
      setHasPermission(status === "authorized" || status === "granted")
    })()
  }, [])

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        {hasPermission && device && (
          <View style={{ height: 400, width: 600 }}>
            <Camera device={device} />
          </View>
        )}
      </View>
    </SafeAreaView>

    // device != null &&

    // <QRCodeScanner  onRead={onBarCodeRead}
    //   topContent={
    //     <TouchableOpacity
    //       onPress={() => goBack()}
    //       style={styles.leftArrowStyle}
    //     >
    //       <Image style={styles.leftArrowImageStyle} source={Images.leftArrow} />
    //     </TouchableOpacity>
    //   }
    //   bottomContent={<TouchableOpacity style={regularVPadding} />}
    // />
  )
}

const styles = StyleSheet.create({
  leftArrowStyle: {
    position: "absolute",
    left: 20,
    zIndex: 22,
    ...Platform.select({
      ios: { top: 50 },
      android: { top: 20 }
    })
  },
  leftArrowImageStyle: {
    width: 30,
    height: 30,
    resizeMode: "contain"
  }
})

export default BarcodeScanner
