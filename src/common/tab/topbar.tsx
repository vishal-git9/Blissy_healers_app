import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { DrawerActions } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { NavigationStackProps } from '../../container/Prelogin/onboarding';
import colors from '../../constants/colors';
import { actuatedNormalize } from '../../constants/PixelScaling';

const TopBar:React.FC<NavigationStackProps> = ({ navigation }) => {
  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={openDrawer}>
        <MaterialIcons name="segment" size={actuatedNormalize(30)} color={colors.white} style={styles.icon} />
      </TouchableOpacity>
      <View style={styles.spacer} />
      <TouchableOpacity onPress={()=>navigation.navigate("ComingsoonScreen",{screenName:"Wallet"})}>
        <AntDesign name="wallet" size={24} color={colors.white} style={styles.icon} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignSelf:"flex-start",
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop:actuatedNormalize(20)
    // backgroundColor: '#fff', // Change as needed
  },
  icon: {
    marginHorizontal: 10,
  },
  spacer: {
    flex: 1,
  },
});

export default TopBar;
