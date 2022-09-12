import React from 'react';
import { View } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
const BottomSheet = ({ children, reff, h }) => {
  return (
    <RBSheet
      ref={reff}
      closeOnDragDown={true}
      closeOnPressMask={true}
      customStyles={{
        draggableIcon: {
          backgroundColor: 'lightgrey',
        },
        container: {
          alignItems: 'flex-start',
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          backgroundColor: '#F3F5F6',
        },
      }}
      height={h ? h : 250}
      openDuration={1000}
    >
      {children}
    </RBSheet>
  );
};
export default BottomSheet;
