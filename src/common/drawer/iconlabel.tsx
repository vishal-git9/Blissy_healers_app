import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { actuatedNormalize } from '../../constants/PixelScaling'
import { fonts } from '../../constants/fonts'
import colors from '../../constants/colors'
import Ionicons from "react-native-vector-icons/Ionicons"

interface LabelWithIcon {
    label:string;
    iconName:string;
    onPress?:()=>void;
}
export const LabelWithIcon:React.FC<LabelWithIcon> = ({iconName,label,onPress}) => {
  return (
    <TouchableOpacity onPress={onPress}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  columnGap: actuatedNormalize(5),
                }}>
                <Ionicons
                  name={iconName}
                  size={22}
                  color={colors.white}
                />
                <Text
                  style={{
                    fontSize: actuatedNormalize(16),
                    fontFamily: fonts.NexaRegular,
                    marginLeft: actuatedNormalize(5),
                    color: colors.gray,
                  }}>
                  {label}
                </Text>
              </View>
            </TouchableOpacity>
  )
}
