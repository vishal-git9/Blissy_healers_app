import React from 'react';
import {StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Assuming you're using Expo
import colors from '../../constants/colors';
import {actuatedNormalize} from '../../constants/PixelScaling';
import {fonts} from '../../constants/fonts';
import { Badge } from 'react-native-paper';

export const RoundedIconContainer: React.FC<{
  iconName: string;
  label?: string | undefined;
  onpress:()=>void;
  isBadge?:boolean;
  size?:number;
  badgeText?:number;
  iconStyles?:StyleProp<ViewStyle>
}> = ({iconName, label,onpress,iconStyles,size,isBadge,badgeText}) => {
  return (
    <TouchableOpacity onPress={onpress} style={{justifyContent: 'center', alignItems: 'center',rowGap:actuatedNormalize(5)}}>
      <View style={[styles.iconContainer,iconStyles]}>
        <Ionicons name={iconName} size={size || 32} color={colors.white} />
      </View>
      {label && <Text style={styles.icontext}>{label}</Text>}
      {isBadge && badgeText && badgeText > 0 ?  <Badge size={20} style={{color:colors.white,backgroundColor:colors.darkRed,fontFamily:fonts.NexaBold,position:"absolute",top:actuatedNormalize(5)}}>{badgeText}</Badge> : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icontext: {
    fontSize: actuatedNormalize(16),
    color: colors.white,
    fontFamily: fonts.NexaBold,
  },
});
