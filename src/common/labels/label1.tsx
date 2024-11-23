import React from 'react';
import {StyleSheet, Text, ViewStyle} from 'react-native';
import {View} from 'react-native';
import colors from '../../constants/colors';
import {fonts} from '../../constants/fonts';
import {actuatedNormalize} from '../../constants/PixelScaling';

interface LabelWithDescProps {
  label: string;
  sublabel: string;
  labelStyle?: ViewStyle;
}

export const LabelWithDesc: React.FC<LabelWithDescProps> = ({
  label,
  sublabel,
  labelStyle,
}) => {
  return (
    <View style={[styles.labelContainer, labelStyle]}>
      <Text
        style={{
          color: colors.white,
          fontFamily: fonts.NexaBold,
          fontSize: actuatedNormalize(30),
          alignSelf: 'flex-start',
        }}>
        {label}
      </Text>
      <Text
        style={{
          color: colors.gray,
          fontFamily: fonts.NexaBold,
          fontSize: actuatedNormalize(13),
          alignSelf: 'flex-start',
        }}>
        {sublabel}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  labelContainer: {
    rowGap:actuatedNormalize(5),
  },
});
