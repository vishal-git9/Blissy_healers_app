import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../../constants/colors';
import { actuatedNormalize } from '../../constants/PixelScaling';
import { fonts } from '../../constants/fonts';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';

interface Props {
  initialValue: number;
  finalValue: number;
  duration?: number;
}

const AnimatedNumber: React.FC<Props> = ({ initialValue, finalValue, duration = 1000 }) => {
  const [currentValue, setCurrentValue] = useState(initialValue);
  const animatedValue = useSharedValue(initialValue);
  const scale = useSharedValue(1.5);
  console.log(initialValue, finalValue, "from animated number ")

  useEffect(() => {
    animatedValue.value = withTiming(finalValue, {
      duration: duration,
      easing: Easing.bounce,
    });

    scale.value = withSpring(1.3, {
      damping: 10,
      stiffness: 100,
      mass: 0.4,
    });

    const timeout = setTimeout(() => {
      scale.value = withSpring(1, {
        damping: 10,
        stiffness: 100,
        mass: 0.4,
      });
    }, duration / 2);

    return () => clearTimeout(timeout);
  }, [finalValue, duration]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  useEffect(() => {
    if (initialValue !== finalValue) {
      const step = finalValue > initialValue ? 1 : -1;
      const difference = Math.abs(finalValue - initialValue);
      const steps = Math.ceil(difference / step);
      const stepDuration = duration / steps;

      const interval = setInterval(() => {
        setCurrentValue((prevValue) => {
          const nextValue = prevValue + step;
          return step > 0 ? Math.min(nextValue, finalValue) : Math.max(nextValue, finalValue);
        });
      }, stepDuration);

      return () => clearInterval(interval);
    }
  }, [initialValue, finalValue, duration]);

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.number, animatedStyle]}>{currentValue}</Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  number: {
    color: colors.white,
    fontFamily: fonts.NexaBold,
    fontSize: actuatedNormalize(30),
    fontWeight:'600'
  },
  text: {
    fontSize: actuatedNormalize(24),
    color: colors.white,
  },
});

export default AnimatedNumber;
