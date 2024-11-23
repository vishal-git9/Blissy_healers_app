import React, { useEffect, useRef, useState } from 'react';
import { Animated, TouchableOpacity, Text, StyleSheet } from 'react-native';
import colors from '../../constants/colors';
import { fonts } from '../../constants/fonts';
import { actuatedNormalize } from '../../constants/PixelScaling';

const AnimatedBorderButton: React.FC<{func:()=>void,label:string}> = ({func,label}) => {
  const borderColorAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(borderColorAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(borderColorAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [borderColorAnim]);

  const borderColor = borderColorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.lightGray, colors.primary],
  });

  return (
    <TouchableOpacity onPress={func} style={[styles.button, { borderColor: borderColor as any}]}>
      <Text style={styles.text}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderWidth: actuatedNormalize(2),
    borderColor: colors.lightGray, // Default color, animation will override this
    padding: actuatedNormalize(10),
    borderRadius: actuatedNormalize(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: colors.white,
    fontFamily:fonts.NexaBold,
    fontSize:actuatedNormalize(18)
  },
});

export default AnimatedBorderButton;
