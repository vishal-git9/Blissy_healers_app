import React, {useEffect, useState, useRef} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
} from 'react-native';
import {Socket} from 'socket.io-client';
import {
  mediaDevices,
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  MediaStream,
} from 'react-native-webrtc';
import InCallManager from 'react-native-incall-manager';
import TalkNowButton from '../../common/button/Talknow';
import IncomingCallScreen from './incoming';
import {OutgoingCallScreen} from './outgoing';
import {Connection} from '../Connection/connection';
import CallingScreen from '../Connection/callingscreen';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../AppNavigation/navigatorType';
import { UserInterface } from '../../redux/uiSlice';
import colors from '../../constants/colors';
import { View } from 'react-native';
import { Loader } from '../../common/loader/loader';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../../constants/PixelScaling';
import requestBluetoothPermission from '../../utils/permission';

interface AppProps {
  navigation: NativeStackNavigationProp<RootStackParamList>;
  socket: Socket;
}

interface RTCIceMessage {
  label:number;
  id:string;
  candidate:string;
}

const VoiceCall: React.FC<AppProps> = ({navigation, socket}) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [type, setType] = useState<string>('JOIN');
  // const [callerId] = useState<string>(
  //   Math.floor(100000 + Math.random() * 900000).toString(),
  // );
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

  console.log(peerConnection,"peerconnection")

  let remoteRTCMessage = useRef<RTCSessionDescription | null>(null);

  useEffect(() => {
    socket.on(
      'newCall',
      (data: {rtcMessage: RTCSessionDescription; callerId: string}) => {
        remoteRTCMessage.current = data.rtcMessage;
        console.log("getting call from",data.callerId)
        otherUserScoketId.current = data.callerId;
        //setType('INCOMING_CALL');
        processAccept()
        console.log("getting the call")
      },
    );

    socket.on('initiateCall',(data:{matchedUser:UserInterface,callerId:string})=>{
      otherUserScoketId.current = data.callerId
      console.log(data,"data of paired user")
      processCall()
    })

    // if no match is found search again
    // socket.on('matchNotFound',()=>{
    //   console.log("retrying")
    //   setTimeout(() => {
    //     IntitateRandomConnection()
    //   }, 5000);
    // })

    socket.on("callEnded",()=>{
      navigation.navigate("ReviewScreen",{})
    })

    socket.on('callAnswered', (data: {rtcMessage: RTCSessionDescription}) => {
      remoteRTCMessage.current = data.rtcMessage;
      peerConnection.current.setRemoteDescription(
        new RTCSessionDescription(remoteRTCMessage.current),
      );
      setType('WEBRTC_ROOM');
    });

    socket.on(
      'ICEcandidate',
      (data: {rtcMessage: {candidate: string; id: string; label: number}}) => {
        let message = data.rtcMessage;

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
      (event: {candidate: RTCIceCandidate | null}) => {
        console.log(event.candidate,"event candidate")
        if (event.candidate) {
          sendICEcandidate({
            calleeId: otherUserScoketId.current!, // Assuming otherUserScoketId is always set when this callback is called
            callerId:socket.id,
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

    requestBluetoothPermission()

    return () => {
      socket.off('newCall');
      socket.off('callAnswered');
      socket.off('ICEcandidate');
      socket.off("callEnded");
      socket.off("initiateCall")
    };
  }, []);

  useEffect(() => {
    InCallManager.start({media: 'audio'});
    InCallManager.setKeepScreenOn(true);
    InCallManager.setForceSpeakerphoneOn(false); // false for audio and true for video
    return () => {
      InCallManager.stop();
    };
  }, []);

  function sendICEcandidate(data: {
    calleeId: string;
    callerId:string | undefined;
    rtcMessage: RTCIceMessage;
  }) {
    socket.emit('ICEcandidate', data);
  }

  async function processCall() {
    try {
      const sessionDescription = await peerConnection.current.createOffer({});
      await peerConnection.current.setLocalDescription(sessionDescription);
      sendCall({
        calleeId: otherUserScoketId.current!,
        callerId:socket.id,
        rtcMessage: sessionDescription,
      });
    } catch (error) {
      console.log(error,"error while creating offer")
    }
  }

 

  async function processAccept() {
    try {
      peerConnection.current.setRemoteDescription(
        new RTCSessionDescription(remoteRTCMessage.current!),
      );
      const sessionDescription = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(sessionDescription);
      console.log("acceptedd by",otherUserScoketId.current)
  
      answerCall({
        callerId: otherUserScoketId.current!,
        // calleeId:socket.id,
        rtcMessage: sessionDescription,
      });
    } catch (error) {
      console.log(error,"error while creating answer")
    }
  }

  function answerCall(data: {
    callerId: string;
    calleeId?:string | undefined;
    rtcMessage: RTCSessionDescription;
  }) {
    console.log(data.calleeId,"calleeId accept")
    socket.emit('answerCall', data);
    setType("WEBRTC_ROOM")
  }

  function sendCall(data: {
    calleeId: string;
    callerId:string | undefined;
    rtcMessage: RTCSessionDescription;
  }) {
    console.log("sending call to",data.calleeId)
    socket.emit('call', data);
  }

  function toggleMic() {
    localMicOn ? setLocalMicOn(false) : setLocalMicOn(true);
    localStream?.getAudioTracks().forEach(track => {
      localMicOn ? (track.enabled = false) : (track.enabled = true);
    });
  }

  function leave() {
    peerConnection.current.close();
    setLocalStream(null);
    setRemoteStream(null);
    socket.emit("callEnded",otherUserScoketId.current)
    otherUserScoketId.current = null;
  }

  switch (type) {

    case 'LOADING':
      return (
        
        <View style={styles.loaderContainer}>
        <Loader size={50} />
      </View>
      );
    case 'WEBRTC_ROOM':
      return (
        <CallingScreen
          leave={leave}
          toggleMic={toggleMic}
          navigation={navigation}
        />
      );
    default:
      return null;
  }
};

const styles = StyleSheet.create({
  loaderContainer: {
    position: 'absolute',
    zIndex: 2,
    flex: 1,
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.darkOverlayColor2,
  },
})

export default VoiceCall;


