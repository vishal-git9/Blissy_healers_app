import React, { Dispatch, SetStateAction, forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  BackHandler,
  AppStateStatus,
  AppState,
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
import { usePostUserRatingMutation } from '../../api/rewardservice';
import { usePostCallInfoMutation, useUpdateCallInfoMutation, useUpdatePrivateCallInfoMutation } from '../../api/callService';

interface IconContainerProps {
  navigation: NativeStackNavigationProp<RootStackParamList>;
  leave: () => void;
  toggleMic: () => void;
  toggleSpeaker: () => void;
  ConnectedUserData: UserInterface | null;
  speakerEnabled: boolean;
  muteEnabled: boolean;
  socketId: string | null;
  seconds: number;
  handleEndcall?: () => void;
  setSeconds: Dispatch<SetStateAction<number>>;
  callType?: string;
  callerme?: boolean;
}

interface CallingScreenProps extends IconContainerProps {
  socket: Socket;
}

const IconContainer: React.FC<IconContainerProps> = ({ handleEndcall, socketId, ConnectedUserData, navigation, leave, toggleMic, toggleSpeaker, speakerEnabled, muteEnabled }) => {

  return (
    <View style={styles.iconContainer}>
      <TouchableOpacity style={[styles.icon, styles.leftIcon, { backgroundColor: muteEnabled ? colors.primary : colors.white }]} onPress={toggleMic}>
        {/* Add your left icon here */}
        <Entypo name="sound-mute" color={muteEnabled ? colors.white : colors.black} size={30} />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.icon, styles.middleIcon]}
        onPress={handleEndcall}>
        {/* Add your middle icon here */}
        <MaterialIcons name="call-end" color={'white'} size={30} />
      </TouchableOpacity>

      <TouchableOpacity style={[styles.icon, styles.rightIcon, { backgroundColor: speakerEnabled ? colors.primary : colors.white }]} onPress={toggleSpeaker}>
        {/* Add your right icon here */}
        <Entypo name="sound" color={speakerEnabled ? colors.white : colors.black} size={30} />
      </TouchableOpacity>
    </View>
  );
};

const CallingScreen = forwardRef<{
  stopTimer: () => void;
}, CallingScreenProps>(({ seconds, callerme, setSeconds, navigation, leave, toggleMic, ConnectedUserData, toggleSpeaker, socketId, socket, callType }, ref) => {

  const [mute, setMute] = useState<boolean>(false);
  const [otherUserMute, setotherUserMute] = useState<boolean>(true)
  const [speaker, setSpeaker] = useState<boolean>(false)
  const [profileModal, setProfileModal] = useState<boolean>(false)
  const [errorSnackbar, setErrorSnackbar] = useState<boolean>(false)
  const isChatStateActive = useSelector(chatScreenActiveSelector)
  const backgroundTimeRef = useRef<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null); // Ref for the timer
  const appState = useRef(AppState.currentState);
  const [postcallInfo, { isLoading, isError, isSuccess }] = usePostCallInfoMutation()
  const [postPrivatecallInfo, { }] = useUpdatePrivateCallInfoMutation()

  const { user } = useSelector(AuthSelector)
  // const messageCount = useSelector(MessageCountSelector)
  // const dispatch = useDispatch()
  const handleToggleMic = () => {
    toggleMic()
    setMute(!mute)
    socket.emit("private_mute_state", { socketId, muteState: !mute })
  }
  const handleToggleSpeaker = () => {
    toggleSpeaker()
    setSpeaker(!speaker)
  }

  useImperativeHandle(ref, () => ({
    stopTimer: () => {
      if (timerRef.current) {
        clearInterval(timerRef.current); // Stop the timer
      }
    },
  }));

  const handleProfileUsermodal = () => {
    setProfileModal(true)
  }
  // switch (userChannel) {
  //   case "Chat" :
  //     return <ChatWindowScreen navigation={navigation} />
  //   case "Profile" :
  //     return <UserProfile navigation={navigation}/>
  // }


  const postCallInfotoDB = async () => {

    if (seconds >= 120) {
      const callInfobody = {
        callType: "Random", // individual  or random
        callerId: user?._id, // caller Id
        calleeId: ConnectedUserData?._id, // calleeId
        callDuration: seconds, // duration
        isMissed: false,
        isRejected: false,
        isSuccessful: true,
      }
      postcallInfo(callInfobody)
    } else {
      const callInfobody = {
        callType: "Random", // individual  or random
        callerId: user?._id, // caller Id
        calleeId: ConnectedUserData?._id, // calleeId
        callDuration: seconds, // duration
        isMissed: false,
        isRejected: false,
        isSuccessful: false,
      }
      postcallInfo(callInfobody)

    }

  }

  const handleEndCall = async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current); // Clear the timer
    }
    backgroundTimeRef.current = null; // Clear the background time
    if (callType === "private") {
      if (callerme) {
        await postPrivatecallInfo({ callDuration: seconds, callerId: user?._id })

      } else {
        await postPrivatecallInfo({ callDuration: seconds, callerId: ConnectedUserData?._id })
      }
    } else {
       postCallInfotoDB();
    }
    leave(); // Clean up resources
    navigation.navigate('ReviewScreen', { user: ConnectedUserData, socketId: socketId });
  };



  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        return true; // Return true to prevent default behavior (going back)
      }
    );
    return () => backHandler.remove();
  })




  useEffect(() => {

    // socket.on('privateMessageSuccessfulAdd', (messageObject) => {
    //   const newMessage = {...messageObject.message,sender:"them"}

    //   console.log(messageObject,"messageobject------>")
    //   dispatch(addMessage(newMessage));
    //   playNotificationSound()
    // });
    socket.on("notify_mute_state", (muteState) => {
      console.log(muteState, "mutestte of the user")
      setotherUserMute(muteState)
      setErrorSnackbar(true)
    })
    // Cleanup on component unmount
    return () => {
      socket.off("notify_mute_state");
    };
  }, [isChatStateActive]);


  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        if (backgroundTimeRef.current) {
          const backgroundDuration = Date.now() - backgroundTimeRef.current;
          setSeconds(prevSeconds => prevSeconds + Math.floor(backgroundDuration / 1000));
          backgroundTimeRef.current = null;
        }
      } else if (nextAppState.match(/inactive|background/)) {
        backgroundTimeRef.current = Date.now();
      }
      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, []);


  useEffect(() => {
    // Start the timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setSeconds(prevSeconds => prevSeconds + 1);
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current); // Clear timer on unmount or cleanup
      }
    };

  }, []);


  console.log(otherUserMute, "otherusermate")


  return (
    <SafeAreaView style={styles.container}>
      {/* User section */}
      <ProfileScreenModal onClose={() => setProfileModal(false)} visible={profileModal} userdata={ConnectedUserData} />
      <View style={styles.userSection}>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Text style={styles.connectedText}>You connected with {ConnectedUserData?.name}</Text>
          <Text style={styles.timeText}>
            {Math.floor(seconds / 60)
              .toString()
              .padStart(2, '0')}{' '}
            mins ago
          </Text>
        </View>
        <View style={styles.avatarContainer}>
          <Image
            // blurRadius={10}
            source={{ uri: ConnectedUserData?.profilePic }} // Replace with actual image path
            style={styles.avatar}
          />
        </View>
        <View style={{ justifyContent: 'center', alignItems: 'center', width: "100%" }}>
          <Text style={styles.knowText}>
            Know What {ConnectedUserData?.name} and You have common
          </Text>
          <TouchableOpacity style={styles.readReceiptsButton} onPress={handleProfileUsermodal}>
            <Text style={styles.readReceiptsText}>View Profile</Text>
          </TouchableOpacity>

          {/* <IconButton
            IsBadge={ messageCount > 0 ? true : false}
            BadgeCount={messageCount}
            IconProvider={MaterialIcons}
            iconame="chat"
            label="Chat"
            iconcolor={colors.white}
            onpress={() =>{
              dispatch(setChatScreenActive(true))
              navigation.navigate("ChatWindow",{userDetails:ConnectedUserData,socketId:socketId || undefined})
            }}   
               size={18}
            styles={styles.SecondaryButton}
            textSize={actuatedNormalize(18)}
            textcolor={colors.white}
          /> */}
          {/* <TouchableOpacity style={styles.readReceiptsButton}>
            <Text style={styles.readReceiptsText}>View Profile</Text>
          </TouchableOpacity> */}
        </View>
        <AnimatedCounter seconds={seconds} />
      </View>

      {/* Action buttons */}
      <IconContainer callType={callType} handleEndcall={handleEndCall} seconds={seconds} setSeconds={setSeconds} speakerEnabled={speaker} muteEnabled={mute} ConnectedUserData={ConnectedUserData} navigation={navigation} leave={leave} socketId={socketId} toggleMic={handleToggleMic} toggleSpeaker={handleToggleSpeaker} />
      <Snackbar
        duration={otherUserMute ? 10000 : 2000}
        visible={errorSnackbar}
        style={{ backgroundColor: colors.black }}
        onDismiss={() => setErrorSnackbar(false)}
        action={{
          theme: {
            fonts: {
              regular: { fontFamily: fonts.NexaRegular },
              medium: { fontFamily: fonts.NexaBold },
              light: { fontFamily: fonts.NexaBold },
              thin: { fontFamily: fonts.NexaRegular },
            },
          },
          label: 'Okay',
          labelStyle: { fontFamily: fonts.NexaBold },
          onPress: () => {
            // Do something
            setErrorSnackbar(false);
          },
        }}>
        {otherUserMute ? `${ConnectedUserData?.name} is on mute` : `${ConnectedUserData?.name} has unmute`}
      </Snackbar>
    </SafeAreaView>
  );
});

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

export default CallingScreen;
