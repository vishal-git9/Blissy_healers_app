import React, { ReactNode, useEffect, useRef } from 'react';
import { View, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Importing Ionicons for the call icon

const ShockwavePulseButton: React.FC<{children:ReactNode}> = ({children}) => {
  const pulseAnims = useRef([new Animated.Value(0), new Animated.Value(0), new Animated.Value(0)]).current;

  useEffect(() => {
    const startPulseAnimation = (anim: Animated.Value, delay: number) => {
      anim.setValue(0); // Reset the animation

      setTimeout(() => {
        Animated.timing(anim, {
          toValue: 1,
          duration: 1300,
          useNativeDriver: true,
        }).start(() => startPulseAnimation(anim, delay)); // Loop the animation
      }, delay);
    };

    pulseAnims.forEach((anim, index) => startPulseAnimation(anim, index * 700));
  }, [pulseAnims]);

  return (
    <View style={styles.container}>
      {pulseAnims.map((anim, index) => (
        <Animated.View
          key={index}
          style={[
            styles.pulse,
            {
              backgroundColor: 'rgba(30, 81, 40, 0.4)', // Modified color with transparency
              transform: [
                {
                  scale: anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [2, 5],
                  }),
                },
              ],
              opacity: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0],
              }),
            },
          ]}
        />
      ))}
      {/* <TouchableOpacity style={styles.button}>
        <Icon name="call" size={30} color="#FFFFFF" />
      </TouchableOpacity> */}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
    height: 200,
    position: 'relative',
  },
  pulse: {
    position: 'absolute',
    width: 80, // Match the button size
    height: 80, // Match the button size
    borderRadius: 50, // Ensure it's a circle
  },
  button: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E5128', // Updated color
    borderRadius: 30,
    position: 'absolute',
  },
  buttonText: {
    color: '#FFFFFF',
  },
});

export default ShockwavePulseButton;
