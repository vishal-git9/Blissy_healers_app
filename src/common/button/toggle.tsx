import React, { useState, useEffect, useRef } from 'react';
import { View, Animated, TouchableWithoutFeedback, StyleSheet } from 'react-native';

const SlidingToggleButton: React.FC = () => {
  const [isToggled, setIsToggled] = useState<boolean>(false);
  const position = useRef(new Animated.Value(0)).current; // Initial position as a number

  useEffect(() => {
    Animated.timing(position, {
      toValue: isToggled ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isToggled]);

  // Ensure interpolation for translateX is correctly used for a numeric translation
  const buttonSlide = position.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 50], // Assuming the container's width minus the button's width if necessary
  });

  return (
    <TouchableWithoutFeedback onPress={() => setIsToggled(!isToggled)}>
      <View style={styles.container}>
        <Animated.View style={[styles.button, { transform: [{ translateX: buttonSlide }] }]} />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 100, // Adjust as necessary
    height: 50, // Adjust as necessary
    backgroundColor: '#ddd',
    borderRadius: 25,
    overflow: 'hidden',
  },
  button: {
    position: 'absolute',
    width: '50%', // Half of the container's width to allow for sliding
    height: '100%',
    backgroundColor: '#FFF',
  },
});

export default SlidingToggleButton;
