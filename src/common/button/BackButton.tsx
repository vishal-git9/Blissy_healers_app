import React from 'react';
import { TouchableOpacity, View, StyleSheet, Button, StyleProp, ViewStyle } from 'react-native';
import FontAwesome5  from 'react-native-vector-icons/FontAwesome5';
import colors from '../../constants/colors';
import { actuatedNormalize } from '../../constants/PixelScaling';

interface RouteBackButtonProps {
  onPress: () => void;
  containerstyle?:StyleProp<ViewStyle>
}

const RouteBackButton: React.FC<RouteBackButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity onPressIn={onPress} style={styles.container}>
      {/* <View style={styles.button}> */}
        <FontAwesome5 name="arrow-left" size={actuatedNormalize(18)} color="white" />
      {/* </View> */}
    </TouchableOpacity>
  );
};
const RouteBackButton2: React.FC<RouteBackButtonProps> = ({ onPress,containerstyle }) => {
  return (
    <TouchableOpacity onPressIn={onPress} style={[styles.container2,containerstyle]}>
        <FontAwesome5 name="arrow-left" size={actuatedNormalize(18)} color="white" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 20,
    // backgroundColor:"red",
    height:actuatedNormalize(35),
    width:actuatedNormalize(35),
    left: 20,
    zIndex: 100,
  },
  button: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 30, 
    padding: actuatedNormalize(10),
    borderWidth:1,
    borderColor:colors.white,
    justifyContent:"center",
    alignItems:"center"
  },
  container2:{
    // backgroundColor:"red",
  }
});

export  {RouteBackButton,RouteBackButton2};
