import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import colors from '../../constants/colors';
import {RouteBackButton} from '../../common/button/BackButton';
import { NavigationStackProps } from '../Prelogin/onboarding';

export const Help:React.FC<NavigationStackProps> = ({navigation}) => {
  return (
    <View style={styles.container}>
        <RouteBackButton onPress={()=>navigation.goBack()}/>
      <Text style={{color: colors.white}}>This is Help</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
