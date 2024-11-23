import React from 'react';
import {StyleSheet, TouchableOpacity, Text} from 'react-native';

export const GlowingButton: React.FC<{onpress: () => void}> = ({onpress}) => {
  return (
    <TouchableOpacity onPress={onpress} style={styles.button}>
      <Text style={styles.buttonText}>Connect Now</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#2196F3', // Button background color
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2196F3', // Glowing color (same as button background)
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5, // Adjust the opacity to control the glow intensity
    shadowRadius: 10, // Adjust the radius to control the spread of the glow
  },
  buttonText: {
    color: '#fff', // Text color
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default GlowingButton;
