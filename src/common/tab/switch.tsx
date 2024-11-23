import colors from '../../constants/colors';
import React, { Dispatch, SetStateAction, useState, useRef, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, Animated } from 'react-native';
import {actuatedNormalize} from '../../constants/PixelScaling';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import {Text} from 'react-native';
import {fonts} from '../../constants/fonts';

export const ToggleButton = ({
  value,
  setValue,
}: {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
}) => {
  const indicatorPosition = useRef(new Animated.Value(value === 'healers' ? 0 : 1)).current;

  useEffect(() => {
    Animated.timing(indicatorPosition, {
      toValue: value === 'healers' ? 0 : 1,
      duration: 300,
      useNativeDriver: false, // 'true' if you're animating opacity or translation; 'false' for layout props
    }).start();
  }, [value]);

  const indicatorStyle = {
    ...styles.indicator,
    backgroundColor: value === 'healers' ? colors.primary : colors.primary,
    transform: [{
      translateX: indicatorPosition.interpolate({
        inputRange: [0, 1],
        outputRange: [0, actuatedNormalize(150)], // Adjust based on your button width and container padding
      }),
    }],
  };

  return (
    <View style={styles.container}>
      <Animated.View style={indicatorStyle} />
      {/* Your existing TouchableOpacity for "healers" */}
      <TouchableOpacity
        onPress={() => setValue('healers')}
        style={[
          styles.button,
        ]}>
        {/* Existing content */}
        <Feather
            name="smile"
            size={24}
            color={value === 'healers' ? colors.white : colors.black}
          />
          <Text
            style={{
              color: value === 'healers' ? colors.white : colors.black,
              fontFamily: fonts.NexaBold,
            }}>
            Healers
          </Text>
      </TouchableOpacity>
      {/* Your existing TouchableOpacity for "random" */}
      <TouchableOpacity
        onPress={() => setValue('random')}
        style={[
          styles.button
        ]}>
        <AntDesign
          name="API"
          size={24}
          color={value === 'random' ? colors.white : colors.black}
        />
        <Text
          style={{
            color: value === 'random' ? colors.white : colors.black,
            fontFamily: fonts.NexaBold,
          }}>
          People
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.lightGray,
    width: '85%',
    height: actuatedNormalize(60),
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: actuatedNormalize(10),
    padding: actuatedNormalize(5),
    marginTop: actuatedNormalize(40),
  },
  button: {
    backgroundColor: colors.transparent,
    height: actuatedNormalize(50),
    width: actuatedNormalize(150),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: actuatedNormalize(10),
    columnGap: actuatedNormalize(10),
  },
  indicator: {
    position: 'absolute',
    left:actuatedNormalize(10),
    width: actuatedNormalize(150), // Match your button width
    height: actuatedNormalize(50), // Match your button height
    borderRadius: actuatedNormalize(10), // Match your button border radius
    // Additional styling for the indicator as needed
  },
});
