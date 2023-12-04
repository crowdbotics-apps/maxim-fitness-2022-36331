import React from 'react';
import Modal from 'react-native-modal';

const RNModal = ({ children }) => {
  return <Modal {...props}>{children}</Modal>;
};

export default RNModal;
