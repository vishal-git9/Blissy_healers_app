import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import * as Progress from 'react-native-progress';
import { actuatedNormalize } from '../../constants/PixelScaling';
import colors from '../../constants/colors';

interface ProgressBarProps {
  duration: number; // Duration of the timer in seconds
  progressDuration: number; // Callback function when the timer completes
}

const ProgressBar: React.FC<ProgressBarProps> = ({ duration, progressDuration }) => {

  return (
    <View style={styles.container}>
      <Progress.Bar
        progress={progressDuration/duration}
        animationType='timing'
        useNativeDriver= {true}
        width={null} // Set to null for auto width
        height={10}
        color={colors.primary}
        unfilledColor={colors.white}
        borderWidth={0}
        borderRadius={actuatedNormalize(5)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
});

export default ProgressBar;
