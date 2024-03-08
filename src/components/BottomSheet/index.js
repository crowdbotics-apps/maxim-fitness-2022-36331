import React from "react"
import { View } from "react-native"
import RBSheet from "react-native-raw-bottom-sheet"
const BottomSheet = ({ children, reff, h, Iconbg, bg, isDrage, onClose }) => {
  return (
    <RBSheet
      ref={reff}
      closeOnDragDown={!isDrage}
      closeOnPressMask={true}
      customStyles={{
        draggableIcon: {
          backgroundColor: Iconbg ? Iconbg : "lightgrey"
        },
        container: {
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          backgroundColor: bg ? bg : "#F3F5F6"
        }
      }}
      height={h ? h : 250}
      openDuration={250}
      onClose={onClose}
    >
      {children}
    </RBSheet>
  )
}
export default BottomSheet
