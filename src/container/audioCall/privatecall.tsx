import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  StyleSheet, Text, Vibration
} from 'react-native';
import {
  mediaDevices,
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  MediaStream,
} from 'react-native-webrtc';
import InCallManager from 'react-native-incall-manager';
import CallingScreen from '../Connection/callingscreen';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../AppNavigation/navigatorType';
import { AuthSelector, UserInterface } from '../../redux/uiSlice';
import colors from '../../constants/colors';
import { View } from 'react-native';
import { SCREEN_HEIGHT, SCREEN_WIDTH, actuatedNormalize } from '../../constants/PixelScaling';
import AutoScrollCarousel from '../../common/cards/autoScrollCarousel';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import AnimatedBorderButton from '../../common/button/borderButton';
import CircularImageReveal from '../../common/cards/waitingUser';
import { fonts } from '../../constants/fonts';
import { useDispatch, useSelector } from 'react-redux';
import { resetMessages } from '../../redux/messageSlice';
import { useAnswerPrivateCallMutation, useCancelPrivateCallMutation, useDeclinePrivateCallMutation, usePostCallInfoMutation, useUpdateCallInfoMutation, useUpdatePrivateCallInfoMutation } from '../../api/callService';
import OutgoingCallScreen from '../Home/outgoing';
import IncomingCallScreen from '../../common/call/incomingcallMain';
import { CallInfoSelector, pushPrivateCalldata } from '../../redux/callSlice';

interface AppProps {
  navigation: NativeStackNavigationProp<RootStackParamList>;
  route: RouteProp<RootStackParamList, "privateCall">;

}

interface RTCIceMessage {
  label: number;
  id: string;
  candidate: string;
}

const PrivateVoicecall: React.FC<AppProps> = ({ navigation, route }) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [seconds, setSeconds] = useState<number>(0);
  const callerme = useRef<boolean>(true)
  const { socket, user } = useSelector(AuthSelector)
  // const { privateCallerData } = useSelector(CallInfoSelector)

  const [postcallInfo, { isLoading, isError, isSuccess }] = useUpdatePrivateCallInfoMutation()
  const [answerPrivateCall, { isLoading:answerCallLoading, isError:answerCallError, isSuccess:answerCallSuccess }] = useAnswerPrivateCallMutation()

  const [declinePrivateCall, { isLoading:declineCallLoading, isError:declineCallError, isSuccess:declineCallSuccess }] = useDeclinePrivateCallMutation()


  
  const [speaker, setSpeaker] = useState<boolean>(false)
  const dispatch = useDispatch()

  const [type, setType] = useState<string>(route?.params?.callstate);
  const callingScreenRef = useRef<{ stopTimer: () => void } | null>(null);
  // const [callerId] = useState<string>(
  //   Math.floor(100000 + Math.random() * 900000).toString(),
  // );
  const otherUserData = useRef<UserInterface | null>(null)
  const otherUserScoketId = useRef<string | null>(null);

  const [localMicOn, setLocalMicOn] = useState<boolean>(true);
  // const [localWebcamOn, setLocalWebcamOn] = useState<boolean>(true);

  const peerConnection = useRef<RTCPeerConnection>(
    new RTCPeerConnection({
      iceServers: [
        {
          urls: 'stun:stun.l.google.com:19302',
        },
        {
          urls: 'stun:stun1.l.google.com:19302',
        },
        {
          urls: 'stun:stun2.l.google.com:19302',
        },
      ],
    }),
  );


  let remoteRTCMessage = useRef<RTCSessionDescription | null>(null);


  useEffect(() => {
    const handleCallEnded = () => {
      if (callingScreenRef.current) {
        callingScreenRef.current.stopTimer();
      }
      // peerConnection.current.close();
      // setLocalStream(null);
      // setRemoteStream(null);
      // otherUserScoketId.current = null;
      // InCallManager.stop();
      navigation.navigate("ReviewScreen", { user: otherUserData.current, socketId: otherUserScoketId.current });
      postCallInfotoDB();
    };

    socket?.on("callEnded", handleCallEnded);

    return () => {
      socket?.off("callEnded", handleCallEnded);
    };
  }, [socket, seconds]);


  // useEffect(()=>{

  //   console.log(privateCallerData,"privateCallerData------>")

  // },[privateCallerData])

  useEffect(() => {


    socket?.on(
      'newCall',
      (data: { rtcMessage: RTCSessionDescription; callerId: string, callerData: UserInterface }) => {
        remoteRTCMessage.current = data.rtcMessage;
        console.log("getting call User data", data.callerData)
        otherUserScoketId.current = data.callerId;
        otherUserData.current = data.callerData

        // dispatch(pushPrivateCalldata({callerId:data.callerId,matchedUser:data.callerData}))
        //setType('INCOMING_CALL');
        processAccept()
        // console.log("getting the call")
      },
    );

    socket?.on('initiatePrivateCall', (data: { matchedUser: UserInterface, callerId: string }) => {

      console.log("initiatePrivateCall--------->", data)
      otherUserScoketId.current = data.callerId
      otherUserData.current = data.matchedUser
      callerme.current = false
      // console.log(data, "data of paired user")
      //   processCall()
    })

    // socket?.on("callAccepted",()=>{
    //     processCall()
    // })

    socket?.on("callCancelled", (message: string) => {
      console.log(message, "you cancelled the call")
    })




    socket?.on('callAnswered', (data: { rtcMessage: RTCSessionDescription }) => {
      remoteRTCMessage.current = data.rtcMessage;
      peerConnection.current.setRemoteDescription(
        new RTCSessionDescription(remoteRTCMessage.current),
      );
      setType('AUDIO_ROOM');
      Vibration.vibrate(500);
    });

    socket?.on(
      'ICEcandidate',
      (data: { rtcMessage: { candidate: string; id: string; label: number } }) => {
        let message = data.rtcMessage;
        console.log("getting the message")
        peerConnection.current
          .addIceCandidate(
            new RTCIceCandidate({
              candidate: message.candidate,
              sdpMid: message.id,
              sdpMLineIndex: message.label,
            }),
          )
          .then(() => console.log('SUCCESS'))
          .catch(err => console.log('Error', err));
      },
    );

    // let isFront = false;

    // mediaDevices.enumerateDevices().then(sourceInfos => {
    //   let videoSourceId;
    //   for (let i = 0; i < sourceInfos.length; i++) {
    //     const sourceInfo = sourceInfos[i];
    //     if (sourceInfo.kind == 'videoinput' && sourceInfo.facing == (isFront ? 'user' : 'environment')) {
    //       videoSourceId = sourceInfo.deviceId;
    //     }
    //   }

    mediaDevices
      .getUserMedia({
        audio: true,
        video: false,
      })
      .then(stream => {
        setLocalStream(stream);
        stream.getTracks().forEach(track => {
          peerConnection.current.addTrack(track, stream);
        });
      })
      .catch(error => {
        console.log(error);
      });
    // });

    peerConnection.current.addEventListener('track', event => {
      if (event.streams && event.streams[0]) {
        setRemoteStream(event.streams[0]);
      }
    });
    peerConnection.current.addEventListener(
      'icecandidate',
      (event: { candidate: RTCIceCandidate | null }) => {
        console.log(event.candidate, "event candidate")
        if (event.candidate) {
          sendICEcandidate({
            calleeId: otherUserScoketId.current!, // Assuming otherUserScoketId is always set when this callback is called
            callerId: socket?.id,
            rtcMessage: {
              label: event.candidate.sdpMLineIndex!, // Non-null assertion used, ensure these are indeed non-null
              id: event.candidate.sdpMid!, // Non-null assertion used, ensure these are indeed non-null
              candidate: event.candidate.candidate!, // Non-null assertion used, ensure these are indeed non-null
            },
          });
        } else {
          console.log('can not ice candidate');
        }
      },
    );

    return () => {
      console.log("removed from screen audiocall")
      socket?.off('newCall');
      socket?.off('callAnswered');
      socket?.off('ICEcandidate');
      socket?.off("callCancelled")
      socket?.off("initiatePrivateCall")
    };
  }, [socket]);


  console.log(otherUserScoketId.current, "otherusersocketId-------->", socket?.id)



  useEffect(() => {
    InCallManager.start({ media: 'audio' });
    InCallManager.setKeepScreenOn(true);
    InCallManager.setForceSpeakerphoneOn(false)

    // const checkisWired = async()=>{
    //   const isWired = await InCallManager.getIsWiredHeadsetPluggedIn()

    //   console.log(isWired.isWiredHeadsetPluggedIn,"checkisWiredHeadeset---------->")
    //   if(isWired.isWiredHeadsetPluggedIn){
    //    InCallManager.chooseAudioRoute('BLUETOOTH')
    //   }else{
    //   }
    // }
    // checkisWired()
    return () => {
      InCallManager.stop();
    };
  }, []);

  // useFocusEffect(
  //   useCallback(() => {
  //     return () => {
  //       console.log("Cleanup on screen focus lost");
  //       // Stop the timer
  //       // setSeconds(0);
  //       if (callingScreenRef.current) {
  //         callingScreenRef.current.stopTimer();
  //       } 
  //       // Clean up peer connection
  //       peerConnection.current.close();
  //       setLocalStream(null);
  //       setRemoteStream(null);
  //       otherUserScoketId.current = null;

  //       // Stop InCallManager
  //       InCallManager.stop();

  //       // Reset messages in Redux store
  //       // dispatch(resetMessages());

  //       // Close the socket connections
  //       // socket?.emit("callEnded", otherUserScoketId.current);
  //       socket?.off('newCall');
  //       socket?.off('callAnswered');
  //       socket?.off('ICEcandidate');
  //       socket?.off("callEnded");
  //       socket?.off("initiateCall")
  //       socket?.off("callCancelled")
  //     };
  //   }, [socket])
  // );


  function sendICEcandidate(data: {
    calleeId: string;
    callerId: string | undefined;
    rtcMessage: RTCIceMessage;
  }) {

    socket?.emit('ICEcandidate', data);
  }

  async function processCall() {
    try {
      const sessionDescription = await peerConnection.current.createOffer({});
      await peerConnection.current.setLocalDescription(sessionDescription);
      sendCall({
        calleeId: otherUserScoketId?.current!,
        callerData: user,
        rtcMessage: sessionDescription,
      });
    } catch (error) {
      console.log(error, "error while creating offer")
    }
  }



  async function processAccept() {
    try {
      if (remoteRTCMessage.current) {
        peerConnection.current.setRemoteDescription(
          new RTCSessionDescription(remoteRTCMessage.current!),
        );
        const sessionDescription = await peerConnection.current.createAnswer();
        await peerConnection.current.setLocalDescription(sessionDescription);
        answerCall({
          callerId: otherUserScoketId?.current!,
          // calleeId:socket?.id,
          rtcMessage: sessionDescription,
        });
        console.log("Getting the answer message", otherUserScoketId?.current)
      } else {
        console.log("not getting the answer message")
      }

    } catch (error) {
      console.log(error, "error while creating answer")
    }
  }

  function answerCall(data: {
    callerId: string;
    calleeId?: string | undefined;
    rtcMessage: RTCSessionDescription;
  }) {
    console.log(data.callerId, "calleeId accept")
    socket?.emit('answerCall', data);
    setType("AUDIO_ROOM")
    Vibration.vibrate(500);
  }

  async function sendCall(data: {
    calleeId: string;
    callerData: UserInterface | null;
    rtcMessage: RTCSessionDescription;
  }) {
    console.log("sending call to", data.calleeId)
    socket?.emit('call', data);
    await answerPrivateCall({callerId:otherUserData.current?._id,calleeId:user?._id})
  }


  function toggleMic() {
    localMicOn ? setLocalMicOn(false) : setLocalMicOn(true);
    localStream?.getAudioTracks().forEach(track => {
      localMicOn ? (track.enabled = false) : (track.enabled = true);
    });
  }

  function toggleSpeaker() {
    setSpeaker(!speaker)
    InCallManager.setForceSpeakerphoneOn(!speaker); // false for audio and true for video
  }

  function leave() {
    peerConnection.current.close();
    setLocalStream(null);
    setRemoteStream(null);
    socket?.emit("callEnded", otherUserScoketId?.current)
    otherUserScoketId.current = null;
  }

  async function cancelCall() {
    peerConnection.current.close();
    setLocalStream(null);
    setRemoteStream(null);
    otherUserScoketId.current = null;
    socket?.emit("cancelCall")
    await declinePrivateCall({callerId:otherUserData.current?._id,calleeId:user?._id})
    navigation.navigate("Drawer")
  }


  const postCallInfotoDB = useCallback( async () => {

    if(callerme.current){
      await postcallInfo({callDuration:seconds,callerId:user?._id})

    }else{
      await postcallInfo({callDuration:seconds,callerId:otherUserData.current?._id})
    }
  }, [seconds])
  console.log(seconds, "seconds-------->")



  switch (type) {

    case 'OUTGOING':
      return (
        <OutgoingCallScreen toggleSpeaker={toggleSpeaker}
          toggleMic={toggleMic}
          speakerEnabled={false}
          muteEnabled={false}
          navigation={navigation} route={route} />
      );

    case 'INCOMING':
      return (
        <IncomingCallScreen cancelCall={cancelCall} acceptCall={processCall} navigation={navigation} route={route} />
      )
    case 'AUDIO_ROOM':
      return (
        <CallingScreen
          ref={callingScreenRef}
          socket={socket!}
          seconds={seconds}
          callType='private'
          callerme = {callerme.current}
          setSeconds={setSeconds}
          socketId={otherUserScoketId.current}
          ConnectedUserData={otherUserData?.current}
          leave={leave}
          toggleSpeaker={toggleSpeaker}
          toggleMic={toggleMic}
          navigation={navigation}
          speakerEnabled={false}
          muteEnabled={false}
        />
      );
    default:
      return null;
  }
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH,
  },
  waitText: {
    fontFamily: fonts.NexaRegular,
    fontSize: actuatedNormalize(14),
    alignSelf: "center",
    color: colors.lightGray
  }
})

export default PrivateVoicecall;


