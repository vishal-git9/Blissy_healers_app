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
import { RootStackParamList } from '../../AppNavigation/navigatorType';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { UserInterface } from '../../redux/uiSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Snackbar } from 'react-native-paper';
import { RouteProp } from '@react-navigation/native';
import ShockwavePulseButton from '../button/callnow';
import { IncomingCallInterface } from '../interface/interface';
type ProfileScreenRouteProp = RouteProp<RootStackParamList, 'privateCall'>;

interface CallingScreenProps {
  navigation: NativeStackNavigationProp<RootStackParamList>;
  route: ProfileScreenRouteProp;
  acceptCall: () => void;
  cancelCall: () => void;
}

interface IconContainerProps extends CallingScreenProps {
  acceptCall: () => void;
  cancelCall: () => void;
  ConnectedUserData: IncomingCallInterface | undefined
}

const IconContainer: React.FC<IconContainerProps> = ({ navigation, cancelCall, acceptCall }) => {
  return (
    <View style={styles.iconContainer}>
      {/* Reject Call */}
      <TouchableOpacity
        style={[styles.icon, styles.rejectIcon]}
        onPress={cancelCall}>
        <MaterialIcons name="call-end" color={'white'} size={30} />
      </TouchableOpacity>

      {/* Accept Call */}
      <TouchableOpacity
        style={[styles.icon, styles.acceptIcon]}
        onPress={acceptCall}>
        <MaterialIcons name="call" color={'white'} size={30} />
      </TouchableOpacity>
    </View>
  );
};

const IncomingCallScreen: React.FC<CallingScreenProps> = ({ navigation, route, acceptCall, cancelCall }) => {
  const { IncomingCallData } = route.params;
  const [errorSnackbar, setErrorSnackbar] = useState<boolean>(false);


  const [connecting, setConnecting] = useState<boolean>(false)
  const dispatch = useDispatch();

  // const handleCallAcceptNotification = () => {
  //   setConnecting(true)
  //   const timeoutId = setTimeout(() => {
  //     console.log("Call accepted after 3 seconds");
  //     acceptCall();
  //   }, 3000); 
  
  //   clearTimeout(timeoutId);
  // };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true
    );
    return () => backHandler.remove();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* User Information */}
      <View style={styles.userSection}>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          {
            connecting ? <Text style={styles.incomingText}>Connecting with {IncomingCallData?.callerName}...</Text> : <Text style={styles.incomingText}>Incoming Call from {IncomingCallData?.callerName}</Text>
          }
        </View>
        <View style={styles.ImageContainer}>

        </View>
        <ShockwavePulseButton children={<Image source={{ uri: IncomingCallData?.profilePic }} style={styles.avatar} />} />

      </View>

      {/* Action Buttons */}
      {
        !connecting &&  <IconContainer
        route={route}
        ConnectedUserData={IncomingCallData}
        navigation={navigation}
        cancelCall={cancelCall}
        acceptCall={acceptCall}
      />
      }
     
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
    paddingVertical: actuatedNormalize(10),
  },
  userSection: {
    flex: 1,
    marginTop: actuatedNormalize(50),
    alignItems: 'center',
    rowGap: actuatedNormalize(20),
  },
  incomingText: {
    fontSize: actuatedNormalize(22),
    fontFamily: fonts.NexaBold,
    color: colors.white,
    textAlign: "center",
  },
  avatar: {
    width: actuatedNormalize(110),
    height: actuatedNormalize(110),
    borderRadius: actuatedNormalize(60),
    alignSelf: 'center',
  },
  ImageContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: actuatedNormalize(60)
  },
  iconContainer: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    width: '80%',
    alignSelf: 'center',
    borderRadius: 50,
    justifyContent: 'space-around',
    marginBottom: actuatedNormalize(30)
  },
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  rejectIcon: {
    backgroundColor: colors.red,
    borderRadius: 50,
    width: actuatedNormalize(70),
    height: actuatedNormalize(70),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  acceptIcon: {
    backgroundColor: colors.primary,
    borderRadius: 50,
    width: actuatedNormalize(70),
    height: actuatedNormalize(70),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
});

export default IncomingCallScreen;
