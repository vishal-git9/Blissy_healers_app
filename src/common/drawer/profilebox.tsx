import React from 'react';
import {Image} from 'react-native';
import {StyleSheet, View} from 'react-native';
import {actuatedNormalize} from '../../constants/PixelScaling';
import {Text} from 'react-native';
import colors from '../../constants/colors';
import {fonts} from '../../constants/fonts';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { UserInterface } from '../../redux/uiSlice';
import FastImage from 'react-native-fast-image';
// export interface DrawerUserInterface {
//   mobileNumber: string;
//   role: string;
//   name: String;
//   username: string;
//   age: Number;
//   gender: string;
//   interest: string[];
//   language: string[];
//   profilePic: string;
// }

export const ProfileBox: React.FC<UserInterface | any> = ({
  gender,
  email,
  name,
  profilePic,
}) => {
  return (
    <View style={styles.shadowBox}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between', overflow:'hidden' }}>
        {/* <Image
          source={{uri: profilePic}}
          style={{
            height: actuatedNormalize(80),
            width: actuatedNormalize(80),
            borderRadius: actuatedNormalize(40),
            marginBottom: actuatedNormalize(10),
          }}
        /> */}
       <FastImage source={{uri:profilePic}} style={styles.avatarStyle} resizeMode={FastImage.resizeMode.contain} />
        {/* <View style={{flexDirection: 'column', rowGap: actuatedNormalize(5)}}>
          <View style={{flexDirection: 'row', columnGap: actuatedNormalize(5)}}>
            <Text
              style={{
                color: colors.white,
                fontSize: actuatedNormalize(14),
                fontFamily: fonts.NexaRegular,
                marginRight: actuatedNormalize(5),
              }}>
              {100}
            </Text>
            <FontAwesome5 name="coins" size={14} color={colors.yellow} />
          </View>
        </View> */}
      </View>
      <View
        style={{
          flexDirection: 'row',
          columnGap: actuatedNormalize(8),
          alignItems: 'center',
        }}>
        <Text
          style={{
            color: colors.white,
            fontSize: actuatedNormalize(18),
            fontFamily: fonts.NexaRegular,
            marginBottom: actuatedNormalize(5),
          }}>
          {name}
        </Text>
        <Icon
          name={gender === 'male' ? 'gender-male' : 'gender-female'}
          size={22}
          color={gender === 'male' ? colors.skyBlue : colors.pink}
        />
      </View>
      <View style={{flexDirection: 'row'}}>
        <Text
          style={{
            color: colors.gray,
            fontSize: actuatedNormalize(14),
            fontFamily: fonts.NexaRegular,
            marginRight: actuatedNormalize(5),
          }}>
          {email}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  shadowBox: {
    // backgroundColor: '#444',
    borderRadius: 10,
    padding: 10,
    width: '90%',
    alignSelf: 'center',
    elevation: 5, // Add elevation for shadow
  },
  avatarStyle:{
    height: actuatedNormalize(80),
    width: actuatedNormalize(80),
    borderRadius: actuatedNormalize(40),
    marginBottom: actuatedNormalize(10),
    //  transform:[{ translateY:55},{scale:2}]
  }
});
