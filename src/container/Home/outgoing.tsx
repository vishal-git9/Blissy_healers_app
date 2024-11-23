import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  BackHandler,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import colors from '../../constants/colors';
import { actuatedNormalize } from '../../constants/PixelScaling';
import { fonts } from '../../constants/fonts';
import AnimatedCounter from '../../common/counter/counter';
import { RootStackParamList } from '../../AppNavigation/navigatorType';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthSelector, UserInterface } from '../../redux/uiSlice';
import { Socket } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { MessageCountSelector, chatScreenActiveSelector } from '../../redux/messageSlice';
import ProfileScreenModal from '../../common/modals/profile';
import { Snackbar } from 'react-native-paper';
import { RouteProp } from '@react-navigation/native';
import useBackHandler from '../../hooks/usebackhandler';
import ShockwavePulseButton from '../../common/button/callnow';
import ConnectionWarningBanner from '../../common/badges/warning';
import OfferBadge from '../../common/badges/badge';
import InCallManager from 'react-native-incall-manager';
import { useCancelPrivateCallMutation } from '../../api/callService';
import generateRandomId from '../../utils/randomIdGenerator';
import MissedCallScreen from '../../common/call/missedcall';

type ProfileScreenRouteProp = RouteProp<RootStackParamList, 'privateCall'>;

interface CallingScreenProps {
  navigation: NativeStackNavigationProp<RootStackParamList>;
  route: ProfileScreenRouteProp;
  toggleMic: () => void;
  toggleSpeaker: () => void;
  muteEnabled: boolean;
  speakerEnabled: boolean;

}

interface IconContainerProps extends CallingScreenProps {
  leave: () => void;
  muteEnabled: boolean;
  speakerEnabled: boolean;
  toggleMic: () => void;
  toggleSpeaker: () => void;
}

const IconContainer: React.FC<IconContainerProps> = ({ navigation, leave, muteEnabled, speakerEnabled, toggleMic, toggleSpeaker }) => {
  return (
    <View style={styles.iconContainer}>
      <TouchableOpacity style={[styles.icon, styles.leftIcon, { backgroundColor: muteEnabled ? colors.primary : colors.white }]} onPress={toggleMic}>
        <Entypo name="sound-mute" color={muteEnabled ? colors.white : colors.black} size={30} />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.icon, styles.middleIcon]}
        onPress={() => {
          leave()
          navigation.navigate('Drawer')
        }
        }>
        <MaterialIcons name="call-end" color={'white'} size={30} />
      </TouchableOpacity>

      <TouchableOpacity style={[styles.icon, styles.rightIcon, { backgroundColor: speakerEnabled ? colors.primary : colors.white }]} onPress={toggleSpeaker}>
        <Entypo name="sound" color={speakerEnabled ? colors.white : colors.black} size={30} />
      </TouchableOpacity>
    </View>
  );
};

const OutgoingCallScreen: React.FC<CallingScreenProps> = ({ navigation, route,muteEnabled,speakerEnabled,toggleMic,toggleSpeaker }) => {
  const { IncomingCallData,OutgoingCallData } = route.params
  const { socket, user } = useSelector(AuthSelector)
  const [mute, setMute] = useState<boolean>(false);
  const [speaker, setSpeaker] = useState<boolean>(false)
  const [errorSnackbar, setErrorSnackbar] = useState<boolean>(false)
  const [isRinging, setIsRinging] = useState<boolean>(false)
  const [callStatus, setcallStatus] = useState<string>("CALLING")

  const [cancelCall, { isLoading: loadingCancelCall, isSuccess: successCancelCall, isError: errorSuccessCall }] = useCancelPrivateCallMutation()
  const dispatch = useDispatch()


  // calling use backhandler
  useBackHandler()

  const handleToggleMic = () => {
    toggleMic()
    setMute(!mute)
  }
  const handleToggleSpeaker = () => {
    toggleSpeaker()
    setSpeaker(!speaker)
  }

  // switch (userChannel) {
  //   case "Chat" :
  //     return <ChatWindowScreen navigation={navigation} />
  //   case "Profile" :
  //     return <UserProfile navigation={navigation}/>
  // }

  const handleLeave = async () => {

    const callBody = {
      callerId: user?._id,
      calleeId: OutgoingCallData?._id
    }
    socket?.emit("cancelCall")
    await cancelCall(callBody)
    navigation.navigate("Drawer")

  }

  const handleGoback= async () => {
    navigation.navigate("Drawer")
  }



  useEffect(() => {
    socket?.on("Callringing", () => {
      setIsRinging(true)
    })
    socket?.on("UserOffline", () => {
      setcallStatus("OFFLINE")
    })
    socket?.on("CallMissed", () => {
      setcallStatus("MISSED")
    })
    socket?.on("callDeclined", () => {
      socket?.emit("callDeclined") // clearing the interval on backend
      setcallStatus("DECLINED")
    })
    
  }, [])




  switch(callStatus) {

    case  "CALLING" : 
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.userSection}>
  
          <View style={styles.avatarContainer}>
  
  
            <ShockwavePulseButton children={<Image source={{ uri: OutgoingCallData?.profilePic }} style={styles.avatar} />} />
  
          </View>
          {
            isRinging ? <Text style={[styles.knowText, { fontSize: actuatedNormalize(20), marginTop: actuatedNormalize(80) }]}>Call Ringing ... </Text> : <Text style={[styles.knowText, { fontSize: actuatedNormalize(20), marginTop: actuatedNormalize(80) }]}>Calling to {OutgoingCallData?.name} ... </Text>
  
          }
        </View>
  
        {/* Action buttons */}
        <IconContainer toggleMic={handleToggleMic} toggleSpeaker={handleToggleSpeaker} speakerEnabled={speakerEnabled} muteEnabled={muteEnabled} route={route} navigation={navigation} leave={handleLeave} />
  
  
      </SafeAreaView>
    )

    case "OFFLINE" : 
    return <MissedCallScreen isDeclined={false} isCallMissed={false} isCalleeOffline={true} handleleave={handleGoback} navigation={navigation} route={route}/>
    case "MISSED" : 
    return <MissedCallScreen isDeclined={false} isCallMissed={true} isCalleeOffline={false} handleleave={handleGoback} navigation={navigation} route={route}/>
    case "DECLINED" : 
    return <MissedCallScreen isDeclined={true} isCallMissed={false} isCalleeOffline={false} handleleave={handleGoback} navigation={navigation} route={route}/>
    default : 
    return null

    }
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
    paddingVertical: actuatedNormalize(10)
  },
  userSection: {
    flex: 1,
    marginTop: actuatedNormalize(50),
    alignItems: 'center',
    rowGap: actuatedNormalize(20),
  },
  connectedText: {
    fontSize: actuatedNormalize(22),
    fontFamily: fonts.NexaBold,
    color: colors.white,
    textAlign: "center"
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
    // width: actuatedNormalize(120),
    // height: actuatedNormalize(120),
    // borderRadius: actuatedNormalize(60),
    // borderWidth: 3,
    justifyContent: 'center',
    borderColor: colors.primary,
  },
  knowText: {
    fontSize: actuatedNormalize(16),
    color: colors.lightGray,
    textAlign: 'center',
    width: "80%",
    lineHeight: actuatedNormalize(20),
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
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  rightIcon: {
    backgroundColor: '#fff',
    borderRadius: 30,
    width: 50,
    height: 50,
  },

  SecondaryButton: {
    borderRadius: actuatedNormalize(10),
    paddingHorizontal: actuatedNormalize(16),
    paddingVertical: actuatedNormalize(10),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    marginTop: actuatedNormalize(10),
    borderColor: colors.lightGray,
    columnGap: actuatedNormalize(10),
  },
});

export default OutgoingCallScreen;
