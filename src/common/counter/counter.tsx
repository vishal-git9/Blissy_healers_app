import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { actuatedNormalize } from '../../constants/PixelScaling';
import colors from '../../constants/colors';
import { fonts } from '../../constants/fonts';

const AnimatedCounter = ({ seconds }: { seconds: number }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial opacity for animation

  useEffect(() => {
    // Trigger fade-in animation whenever seconds change
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 0.5, duration: 500, useNativeDriver: true }),
    ]).start();
  }, [seconds]);

  // Format time to MM:SS
  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.timerText, { opacity: fadeAnim }]}>
        {formatTime(seconds)}
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: actuatedNormalize(10),
  },
  timerText: {
    fontSize: actuatedNormalize(24),
    color: colors.white,
    fontFamily: fonts.NexaBold,
  },
});

export default AnimatedCounter;
