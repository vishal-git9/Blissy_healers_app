import React, { ReactNode, useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, Dimensions } from 'react-native';
import { actuatedNormalize } from '../../constants/PixelScaling';

interface AvatarProps {
  source: any; // Image source, can be a local or network resource
  children:ReactNode
}

const screen = Dimensions.get('window');

const AnimatedBackground: React.FC<AvatarProps> = ({ source,children }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial opacity for fade in/out
  const scaleAnim = useRef(new Animated.Value(0)).current; // Initial scale for pulsing effect

  
  // Calculate random position as a number (percentage of screen dimensions)
  const randomTop = useRef(Math.random() * screen.height);
  const randomLeft = useRef(Math.random() * screen.width);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
      {
        iterations: -1,
      }
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
      {
        iterations: -1,
      }
    ).start();
  }, [fadeAnim, scaleAnim]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Update randomTop and randomLeft with new random values
      randomTop.current = Math.random() * screen.height;
      randomLeft.current = Math.random() * screen.width;
    }, 3000); // Update position every 3 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);


  return (
    <>
    <Animated.View
      style={[
        styles.container,
        {
          top: randomTop.current, // Use numeric value for top position
          left: randomLeft.current, // Use numeric value for left position
          opacity: fadeAnim, // Bind opacity to animated value
          transform: [{ scale: scaleAnim }], // Bind scale to animated value for pulsing
        },
      ]}
    >
      <Image source={source} style={styles.avatar} />
    </Animated.View>
    {children}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: actuatedNormalize(40), // Adjust based on your need
    height: actuatedNormalize(40),
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.3)', // Customize as needed
  },
  avatar: {
    width: actuatedNormalize(25), // Adjust based on your need
    height: actuatedNormalize(25),
    borderRadius: actuatedNormalize(25),
  },
});

export default AnimatedBackground;
