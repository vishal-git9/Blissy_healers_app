import React from 'react';
import { TouchableOpacity, Text, TouchableOpacityProps, StyleProp, ViewStyle } from 'react-native';
import { Icon } from 'react-native-vector-icons/Icon'; // Replace with the actual icon provider you are using
import { fonts } from '../../constants/fonts';
import { Badge } from 'react-native-paper';
import colors from '../../constants/colors';
import { actuatedNormalize } from '../../constants/PixelScaling';

interface IconButtonInterface extends TouchableOpacityProps {
  onpress: () => void;
  styles?: StyleProp<ViewStyle>; // Assuming 'styles' is meant to apply to the TouchableOpacity
  IconProvider: typeof React.Component; // Replace with the actual icon provider type you are using
  iconame: string; // Correct this name if needed, based on how you pass the icon name
  size: number;
  iconcolor: string;
  textcolor: string;
  label: string;
  textSize:number;
  IsBadge?:boolean;
  BadgeCount?:number;
}

export const IconButton: React.FC<IconButtonInterface> = ({
  onpress,
  styles,
  IconProvider,
  iconame,
  size,
  iconcolor,
  textcolor,
  label,
  textSize,
  IsBadge,
  BadgeCount
}) => {
  return (
    <TouchableOpacity onPress={onpress} style={styles}>
      {/* IconProvider is a component so it should start with an uppercase letter */}
      <IconProvider name={iconame} size={size} color={iconcolor} />
      <Text style={{ color: textcolor, fontFamily: fonts.NexaBold,fontSize:textSize }}>
        {label}
      </Text>
      {IsBadge &&       <Badge style={{backgroundColor:colors.primary,position:"absolute",top:actuatedNormalize(0),right:actuatedNormalize(1)}}>{BadgeCount}</Badge>}
    </TouchableOpacity>
  );
};
