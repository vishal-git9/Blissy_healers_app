import React from 'react';
import SwipeButton from 'rn-swipe-button';
import { fonts } from '../../constants/fonts';
import colors from '../../constants/colors';
import { View } from 'react-native';
import { actuatedNormalize } from '../../constants/PixelScaling';

export const SwipeButtonComponent: React.FC<{ updateSwipeStatus: () => void }> = ({ updateSwipeStatus }) => {
  return (
    <SwipeButton
      shouldResetAfterSuccess={true}
      containerStyles={{marginTop:actuatedNormalize(20)}}
      resetAfterSuccessAnimDuration={500}
      onSwipeSuccess={updateSwipeStatus}
      railBackgroundColor="transparent"
      railBorderColor={colors.primary}
      railStyles={{ backgroundColor: colors.primary, borderColor: colors.primary }}
      railFillBackgroundColor={colors.primary}
      thumbIconBackgroundColor={colors.white}
      title="Swipe to connect"
      titleStyles={{ fontFamily: fonts.NexaBold, color: colors.white,fontSize:actuatedNormalize(18) }}
    />
  )
}