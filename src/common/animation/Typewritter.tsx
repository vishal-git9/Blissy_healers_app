// Typewriter.tsx
import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, StyleProp, TextStyle } from 'react-native';
import Animated, { Easing, useSharedValue, withTiming, withRepeat } from 'react-native-reanimated';
import colors from '../../constants/colors';
import { actuatedNormalize } from '../../constants/PixelScaling';
import { fonts } from '../../constants/fonts';

interface TypewriterProps {
  text: string;
  speed?: number;
  loop?: boolean;
  customtextstyle?:StyleProp<TextStyle>;
}

const Typewriter: React.FC<TypewriterProps> = ({customtextstyle, text, speed = 100, loop = false }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prevIndex) => {
        const newIndex = prevIndex + 1;
        setDisplayedText(text.substring(0, newIndex));
        return newIndex;
      });
    }, speed);

    if (textIndex >= text.length) {
      clearInterval(interval);
      if (loop) {
        setTimeout(() => {
          setTextIndex(0);
          setDisplayedText('');
        }, 1000);
      } else {
        opacity.value = withTiming(1, { duration: 500, easing: Easing.ease },(finished)=>{
          // if(finished){
          //   opacity.value = withTiming(0,{duration:500})
          //   console.log("finished animating")
          // }
        });
      }
    }

    return () => clearInterval(interval);
  }, [textIndex, text, speed, loop, opacity]);

  return (
    <View style={styles.container}>
      <Text style={[styles.text,customtextstyle]}>{displayedText}</Text>
      {/* <Animated.View style={[styles.cursor, { opacity }]} /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    color: colors.white,
    fontSize: actuatedNormalize(15), 
    fontFamily:fonts.NexaRegular
  },
  cursor: {
    width: 10,
    height: 24,
    backgroundColor: colors.white,
    marginLeft: 2,
  },
});

export default Typewriter;
