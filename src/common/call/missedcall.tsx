import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';

import colors from '../../constants/colors';
import {actuatedNormalize} from '../../constants/PixelScaling';
import {fonts} from '../../constants/fonts';
import { RootStackParamList } from '../../AppNavigation/navigatorType';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import useBackHandler from '../../hooks/usebackhandler';

type ProfileScreenRouteProp = RouteProp<RootStackParamList, 'privateCall'>;

interface CallingScreenProps {
  navigation: NativeStackNavigationProp<RootStackParamList>;
  route: ProfileScreenRouteProp;
  handleleave:()=>void;
  isCalleeOffline:boolean;
  isCallMissed:boolean;
  isDeclined:boolean;
  
}

interface IconContainerProps extends CallingScreenProps   {
  leave:()=>void;
}

const IconContainer: React.FC<IconContainerProps> = ({navigation,leave}) => {
  return (
    <View style={styles.iconContainer}>

      <TouchableOpacity
        style={[styles.icon, styles.middleIcon]}
        onPress={() =>{
          leave()
          navigation.navigate('Drawer')
        }
        }>
        <Entypo name="cross" color={'white'} size={40} />
      </TouchableOpacity>

    </View>
  );
};

const MissedCallScreen: React.FC<CallingScreenProps> = ({navigation,route,handleleave,isCallMissed,isDeclined,isCalleeOffline}) => {
  const {IncomingCallData,OutgoingCallData} = route.params 



 



  useBackHandler()



  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.userSection}>

        <View style={styles.avatarContainer}>


        <View style={styles.avatarContainer}>
          <Image
            // blurRadius={10}
            source={{ uri: OutgoingCallData?.profilePic }} // Replace with actual image path
            style={styles.avatar}
          />
        </View>
        </View>

        <View style={styles.infoContainer}>

        <Feather name={isCallMissed ? "phone-missed" : "wifi-off"} color={isCallMissed ? colors.red : colors.white} size={30}/>
        {
            isCallMissed &&  <Text style={[styles.knowText,{fontSize:actuatedNormalize(20),marginTop:actuatedNormalize(20)}]}>User Didn't pick up your call. Please try again later</Text> 

        }

        {
          isCalleeOffline &&  <Text style={[styles.knowText,{fontSize:actuatedNormalize(20),marginTop:actuatedNormalize(20)}]}>User Offline try later </Text> 
        }

{
          isDeclined &&  <Text style={[styles.knowText,{fontSize:actuatedNormalize(20),marginTop:actuatedNormalize(20)}]}>User Declined your audio call. Please try again later </Text> 
        }
        </View>

      </View>

      {/* Action buttons */}
      <IconContainer isDeclined={isDeclined} isCallMissed={isCallMissed} isCalleeOffline={isCalleeOffline} leave={handleleave}  route={route} handleleave={handleleave} navigation={navigation}  />
      

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black, 
    paddingVertical:actuatedNormalize(10)
  },
  userSection: {
    flex: 1,
    marginTop:actuatedNormalize(50),
    alignItems: 'center',
    rowGap: actuatedNormalize(20),
  },
  connectedText: {
    fontSize: actuatedNormalize(22),
    fontFamily: fonts.NexaBold,
    color: colors.white,
    textAlign:"center"
  },
  timeText: {
    fontSize: actuatedNormalize(16),
    color: colors.gray,
    fontFamily: fonts.NexaRegular,
  },
  avatar: {
    width: actuatedNormalize(110),
    height: actuatedNormalize(110),
    borderRadius: actuatedNormalize(60),
    alignSelf: 'center',
  },
  avatarContainer: {
    width: actuatedNormalize(120),
    height: actuatedNormalize(120),
    borderRadius: actuatedNormalize(60),
    borderWidth: 3,
    justifyContent: 'center',
    borderColor: colors.primary,
  },
  knowText: {
    fontSize: actuatedNormalize(16),
    color: colors.lightGray,
    textAlign: 'center',
    width:"80%",
    lineHeight:actuatedNormalize(20),
    fontFamily: fonts.NexaRegular,
    marginBottom: actuatedNormalize(16),
  },
  readReceiptsButton: {
    backgroundColor: '#fff',
    borderRadius: actuatedNormalize(10),
    paddingHorizontal: actuatedNormalize(16),
    paddingVertical: actuatedNormalize(10),
  },
  readReceiptsText: {
    color: colors.black,
    fontSize: actuatedNormalize(16),
    fontFamily: fonts.NexaBold,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 40,
  },
  micIcon: {
    fontSize: 36,
    color: '#fff',
  },
  messageIcon: {
    fontSize: 36,
    color: '#fff',
  },
  iconContainer: {
    flexDirection: 'row',
    backgroundColor: colors.black,
    width: '90%',
    alignSelf: 'center',
    borderRadius: 50,
    justifyContent: 'space-around',
  },
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftIcon: {
    backgroundColor: '#fff',
    borderRadius: 30,
    width: 50,
    height: 50,
  },
  middleIcon: {
    position: 'relative',
    top: -30,
    backgroundColor: colors.red,
    borderRadius: 50,
    alignSelf: 'center',
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: {width: 0, height: 2},
    elevation: 5,
  },
  rightIcon: {
    backgroundColor: '#fff',
    borderRadius: 30,
    width: 50,
    height: 50,
  },

  infoContainer:{
    flex:1,
    width:"90%",
    marginTop:actuatedNormalize(50),
    alignItems:"center",
    flexDirection:"column"
  },

  SecondaryButton: {
    borderRadius: actuatedNormalize(10),
    paddingHorizontal: actuatedNormalize(16),
    paddingVertical: actuatedNormalize(10),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    marginTop:actuatedNormalize(10),
    borderColor: colors.lightGray,
    columnGap: actuatedNormalize(10),
  },
});

export default MissedCallScreen;
