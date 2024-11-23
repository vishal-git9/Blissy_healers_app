import { actuatedNormalize } from '../../constants/PixelScaling'
import colors from '../../constants/colors'
import { fonts } from '../../constants/fonts'
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';

interface PrimaryButtonProps {
  handleFunc: () => void;
  styles?: StyleProp<ViewStyle>;
  textStyles? : StyleProp<TextStyle>;
  label?: string;
  disabled?:boolean
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = (props) => {
  return (
    <TouchableOpacity
      style={[styles.loginBtn, props.styles]}
      onPress={props.handleFunc}
      disabled={props.disabled}
    >
      <Text
        style={[styles.loginText, { color: 'white', elevation: 10 },props.textStyles]}
      >
        {props.label}
      </Text>
    </TouchableOpacity>
  );
};


const styles = StyleSheet.create({
    loginBtn: {
        width: '80%',
        backgroundColor: colors.primary, // secondary color fcf3fa // textPrimaryColor - 22172A // 78717d
        borderRadius: actuatedNormalize(25),
        height:actuatedNormalize(50),
        // borderColr: '#1E5128',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        fontFamily: fonts.NexaRegular,
        marginTop: actuatedNormalize(10),
      },
      loginText: {
        color: colors.white,
        fontSize: actuatedNormalize(16),
        fontFamily: fonts.NexaBold,
      },
})