import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { actuatedNormalize } from '../../constants/PixelScaling';
import colors from '../../constants/colors';
import { fonts } from '../../constants/fonts';

const TalkNowButton:React.FC<{label:string,onPress:()=>void}> = ({label,onPress}) => {
  return (
    <TouchableOpacity style={styles.buttonContainer} onPress={onPress}>
      <Text style={styles.buttonText}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    borderWidth: 2,
    borderColor: colors.primary, // Initial border color (green)
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    // Glowing effect
    shadowColor: colors.primary, // Green shadow color
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  buttonText: {
    fontSize: actuatedNormalize(16),
    color:colors.white,
    fontFamily:fonts.NexaBold
  },
});

export default TalkNowButton;
