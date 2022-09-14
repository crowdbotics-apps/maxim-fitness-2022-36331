import React from 'react';
import { View, StyleSheet } from 'react-native';
import Video from 'react-native-video';

const VideoExercise = ({ videoUrl, containterStyle, paused, onLoad, onLoadStart }) => (
  <View style={[styles.videoContainer, containterStyle]}>
    <Video
      source={videoUrl}
      autoplay={true}
      onLoad={onLoad}
      paused={paused}
      repeat={true}
      muted={true}
      style={styles.videoStyle}
      playInBackground={true}
      playWhenInactive={true}
      ignoreSilentSwitch="ignore"
      disableFocus={true}
      mixWithOthers={'mix'}
      onLoadStart={onLoadStart}
    />
  </View>
);

const styles = StyleSheet.create({
  videoContainer: {
    width: '100%',
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  videoStyle: { height: 200, width: '100%' },
});

export default VideoExercise;
