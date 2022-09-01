import React, { useCallback, useMemo, useRef } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { color } from 'utils';
import { Box, Text } from 'components';
import CommentField from './CommentField';

const Comment = () => {
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['75%'], []);

  const handleSheetChanges = useCallback((index) => {
    console.log('handleSheetChanges', index);
  }, []);

  return (
    <Box flex={1} backgroundColor='primary'>
      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        handleComponent={null}
        style={styles.container}
      >
        <Box style={styles.content}>
          <Box style={styles.header}>
            <Text color='white' variant='strong'>0 Comments</Text>
            <Pressable style={styles.button}>
              <Ionicons name='close' color={color.white} size={24} />
            </Pressable>
          </Box>
          <Box style={styles.body}>
            <Text color='white'>Be the first to comment!</Text>
          </Box>
          <Box>
            <CommentField />
          </Box>
        </Box>
      </BottomSheet>
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 15
  },
  content: {
    borderRadius: 15,
    backgroundColor: color.black,
    flex: 1
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    flexDirection: 'row'
  },
  button: {
    position: 'absolute',
    right: 14,
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default Comment