import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../../constants/colors';
import { actuatedNormalize } from '../../constants/PixelScaling';
import { fonts } from '../../constants/fonts';
import Typewriter from '../animation/Typewritter';

const OfferBadge: React.FC<{text:string}> = ({text}) => {
  return (
    <View style={styles.container}>
      {/* <Text style={styles.text}>Healers will soon be available for you.</Text> */}
      <Typewriter loop={false} text={text || 'Healers will soon be available for you.'} speed={50} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    borderRadius: actuatedNormalize(5), 
    paddingHorizontal: actuatedNormalize(16),
    paddingVertical: actuatedNormalize(8),
  },
  text: {
    color: colors.white,
    fontSize: actuatedNormalize(15), 
    fontFamily:fonts.NexaRegular
  },
});

export default OfferBadge;
