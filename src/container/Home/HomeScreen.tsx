import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, View, BackHandler, Alert, PermissionsAndroid, Linking, Platform, Dimensions } from 'react-native';
import colors from '../../constants/colors';
import { NavigationStackProps } from '../Prelogin/onboarding';
import TopBar from '../../common/tab/topbar';
import { ToggleButton } from '../../common/tab/switch';
import { FlatList } from 'react-native';
import ProfileCard from '../../common/cards/healercard';
import { HealerMockData } from '../../mockdata/healerData';
import {
  actuatedNormalize,
} from '../../constants/PixelScaling';
import notifee, { EventType, AndroidImportance, AndroidVisibility } from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import OfferBadge from '../../common/badges/badge';
import * as Animatable from 'react-native-animatable';
import { RoundedIconContainer } from '../../common/button/rounded';
import AutoLoopCarousel from '../../common/cards/review';
import io from 'socket.io-client';
import { ApiEndPoint } from '../../config';
import { useDispatch, useSelector } from 'react-redux';
import { AuthSelector, UserInterface, setFcmToken, setSocket } from '../../redux/uiSlice';
import { requestMultplePermissions } from '../../utils/permission';
import checkMicrophonePermission from '../../common/permissions/checkMicroPermission';
import checkLocationPermission from '../../common/permissions/checkLocationPermission';
import { ActiveUserList, ActiveUserListSelector, ChatList, addMessage, chatListSelector, getActiveUserList, pushChatlist, resetMessageCount, resetMessages } from '../../redux/messageSlice';
import { SwipeButtonComponent } from '../../common/button/swipebutton';
import { fonts } from '../../constants/fonts';
import PermissionDenied from '../../common/permissions/permissiondenied';
import { PermissionStatus } from 'react-native-permissions';
import { useGetChatlistQuery, useLazyGetChatlistQuery, useMarkReadMessageMutation } from '../../api/chatService';
import checkNotificationPermission from '../../common/permissions/checkNotificationPermission';
import { eventEmitter } from '../../..';
import { useAddFcmTokenMutation, useGetUserQuery, useLazyGetHealersQuery, usePostUserDevieInfoMutation } from '../../api/userService';
import DeviceInfo from 'react-native-device-info';
import { getDeviceUniqueId } from '../../utils/getDeviceUniqueId';
import { playNotificationSound } from '../../common/sound/notification';
import { useAddmyquotesMutation, useGetTenAppreviewQuery,useLazyGetTenAppreviewQuery,useLazyGetAppreviewQuery,useLazyGetmyTodayquotesQuery, useGetmyTodayquotesQuery } from '../../api/feedbackservice';
import { Animated } from 'react-native';
import { useGetmyCallInfoQuery, useLazyGetmyCallInfoQuery } from '../../api/callService';
import { BlissyLoader } from '../../common/loader/blissy';
import { Appbackground } from '../../common/animation/appbackground';
import moment from 'moment';
import { findNewMessage } from '../../utils/sortmessagebyData';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IncomingCallInterface } from '../../common/interface/interface';
import { pushPrivateCalldata } from '../../redux/callSlice';
const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

interface iconsLabelI {
  id: number;
  label: string;
  iconName: string;
  navigate: any;
}
[];
const iconsLabel: iconsLabelI[] = [
  {
    id: 1,
    label: 'chats',
    iconName: 'chatbox-ellipses',
    navigate: 'Chatlist',
  },
  {
    id: 2,
    label: 'calls',
    iconName: 'call',
    navigate: 'Calllist',
  },
  {
    id: 3,
    label: 'coupons',
    iconName: 'gift',
    navigate: 'CouponsScreen',
  },
];
export const HomeScreen: React.FC<NavigationStackProps> = ({ navigation }) => {
  const [data, setData] = useState(HealerMockData); // Initial data for first 10 cards
  const [value, setValue] = useState<string>('random');
  const initialNotificationHandled = useRef(false); // useRef to persist the value across renders

  const { user, fcmToken, isAuthenticated } = useSelector(AuthSelector)
  const { activeUserList } = useSelector(ActiveUserListSelector)
  const dispatch = useDispatch()
  const chatlistdata = useSelector(chatListSelector);
  const { todayquotes } = useSelector(AuthSelector)
  const [refetch,{isError, isFetching: isChatlistloading,isSuccess:ischatlistsuccess  }] = useLazyGetChatlistQuery({})
  const [ refetchQuote, {isFetching: isquotesLoading, isSuccess: isquotesSuccess, isError: isquotesError }] = useLazyGetmyTodayquotesQuery({})
  const { refetch: refetchUser, isError: isErrorUser, isFetching: isLoadingUser, isSuccess: isSuccessUser } = useGetUserQuery()
  const [postDeviceinfo, { isError: isPostDeviceinfoError, isLoading: isPostDeviceinfoLoading, data: postDeviceinfoData }] = usePostUserDevieInfoMutation()
  const [ getCallinfo, {isFetching: isCallinfoloading, isError: isCallinfoerror, isSuccess: isCallinfoloadingisCallinfosuccess }] = useLazyGetmyCallInfoQuery({})
  const [refetchNewReviews,{ data: appreviewdata, isError: isAppreviewerror, isLoading: isAppreviewLoading }] = useLazyGetTenAppreviewQuery({})
  const [refetchHealers,{ data: healersData, isError: ishealerserror, isLoading: ishealersLoading}] = useLazyGetHealersQuery({})
  // const [postrandomequote, { }] = useAddmyquotesMutation()

  const [postFcmToken, { isLoading: isPostfcmtokenLoading, isError: isPostfcmtokeError, isSuccess: isPostfcmtokeSuccess }] = useAddFcmTokenMutation()
  const [newChatMessages, setnewChatMessages] = useState<number>(0)
  // const {refetch:fetchNewMsg,isError:newMsgerr,isLoading:newMsgLoading,isSuccess:newMsgsuccess} = useGetNewMessageQuery({userId:user?._id})
  const [healerAnimate, sethealerAnimate] = useState(true);
  const [PeopleAnimate, setPeopleAnimate] = useState(true);
  const [permission, setpermission] = useState(false);
  const [markRead, { }] = useMarkReadMessageMutation()
  const [permissionType, setpermissionType] = useState('');
  const otherUserScoketId = useRef<string | null>(null);

  const scrollY = useRef(new Animated.Value(0)).current
  const socket = useMemo(
    () =>
      io(ApiEndPoint, {
        secure: true,
        transports: ['websocket'],
        query: {
          userId: user?._id
        },
        reconnectionAttempts: 5,    // Number of reconnection attempts
        reconnectionDelay: 1000,    // Delay between reconnection attempts in milliseconds
        reconnectionDelayMax: 5000, // Maximum delay between reconnection attempts
        timeout: 2000,              // Connection timeout in milliseconds
      }),
    [user?._id],
  ); // Empty dependency array means this runs once on mount
  // Function to load more cards
  const loadMoreData = () => {
    setData(prevData => {
      const nextIndex = prevData.length;
      const newData = HealerMockData.slice(nextIndex, nextIndex + 10); // Load next 10 cards
      return [...prevData, ...newData];
    });
  };

  const handlePermissions = (response: any) => {
    for (const permissionKey in response) {
      const permissionResult: PermissionStatus = response[permissionKey];
      switch (permissionResult) {
        case 'granted':
          // Handle logic for granted permission
          // setpermission(false);
          break;
        case 'denied':
          // Handle logic for denied permission
          break;
        case 'blocked':
          // showBlockedModal(permissionKey);
          setpermission(true)
          if (permissionKey === "android.permission.ACCESS_FINE_LOCATION") {
            setpermissionType('Location')
          } else if (permissionKey === "android.permission.RECORD_AUDIO") {
            setpermissionType("Microphone")
          } else if (permissionKey === "android.permission.POST_NOTIFICATIONS") {
            setpermissionType("Notifications")
          }
          // Handle logic for blocked permission
          break;
        default:
          // Handle logic for unknown status
          break;
      }
    }
  };

  const intiateRandomConnection = () => {
    navigation.navigate("AudioCallScreen", { user: user })
    socket.emit('connectRandom')
  }

  const handleNotificationReceived = useCallback((Chatdata: any) => {
    // console.log("I am here Yarr------>", chatlistdata, Chatdata, activeUserList, isAuthenticated);
    if (Chatdata?.senderData) {
      // Dispatch actions to refetch the latest data when a new notification is received


      const ChatPartnerData = chatlistdata?.find((el) => el?.chatPartner?._id === Chatdata?.senderData?._id);
      const socketId = activeUserList?.find((el) => el?.userId?._id === Chatdata?.senderData?._id)?.socketId;

      console.log(ChatPartnerData, "ChatPartnerData------>")
      if (!ChatPartnerData) {

        // navigation.navigate("ChatWindow", {
        //   userDetails: ChatPartnerData?.chatPartner || Chatdata?.senderData,
        //   Chats: null,
        //   socketId: socketId,
        //   senderUserId: Chatdata?.senderData._id
        // });
        navigation.navigate("Chatlist");

      } else {
        navigation.navigate("ChatWindow", {
          userDetails: ChatPartnerData?.chatPartner,
          Chats: ChatPartnerData,
          socketId: socketId,
          senderUserId: Chatdata?.senderData?._id
        });
      }
    }

  }, [chatlistdata, activeUserList])

  const handleCallAcceptNotification = useCallback((calldata:any)=>{

    console.log("call accepted---->",calldata)
    // navigate directly since it is foreground and background mode navigate it to directly audio call screen
    navigation.navigate('privateCall',{IncomingCallData:{callerName:calldata?.callerName,profilePic:calldata?.profilePic},OutgoingCallData:undefined,user:null,callstate:"INCOMING"})
  },[])

  useEffect(() => {

   
    // verifyMicroPhonePermissions()
    // verifyLocationPermissions()
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        BackHandler.exitApp(); // Close the app when back button is pressed
        return true; // Return true to prevent default behavior (going back)
      },
    );
    return () => backHandler.remove();
  }, []);

  const verifyLocationPermissions = async () => {
    try {
      const locationRes = await checkLocationPermission();
      const microphoneRes = await checkMicrophonePermission();
      const notifyRes = await checkNotificationPermission();
      if (microphoneRes === 'granted' && notifyRes==='granted') {
        // Permission is granted
      } else {
        // Handle other permission states accordingly
        // requestBluetoothPermission()
        const response = await requestMultplePermissions();
        handlePermissions(response);
        console.log(response, "location permission not granted ");
        console.log(microphoneRes, "permissions from home check else")
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getFCMToken = async () => {
    try {
      await messaging().registerDeviceForRemoteMessages();
      const token = await messaging().getToken();
      console.log("I am here----->",fcmToken,token)
      if (fcmToken && fcmToken === token) {
        console.log("OLD FCM_TOKEN FOUND", fcmToken)
      } else {
        // const token = await messaging().getToken();
        //inserting device token to db
        let platform = Platform.OS === "ios" ? "IOSMOBILE" : "ANDROIDMOBILE";
        // let platform = 'HUAWEIMOBILE'

        let devName = await DeviceInfo.getDeviceName()

        let devType = DeviceInfo.getDeviceType() == 'Handset' ? 'MOBILE' : DeviceInfo.getDeviceType() == 'Tablet' ? 'TABLET' : 'MOBILE'

        let getApplicationName = DeviceInfo.getApplicationName()

        let getBuildId = await DeviceInfo.getBuildId()

        let getBrand = DeviceInfo.getBrand()

        let getBundleId = DeviceInfo.getBundleId()

        let getBuildNumber = DeviceInfo.getBuildNumber()

        let getDeviceId = DeviceInfo.getDeviceId()

        let getIpAddress = await DeviceInfo.getIpAddress()

        let getMacAddress = await DeviceInfo.getMacAddress()

        let getManufacturer = await DeviceInfo.getManufacturer()

        let getSystemName = DeviceInfo.getSystemName()

        let getUniqueId = await getDeviceUniqueId()

        let getUserAgent = await DeviceInfo.getUserAgent()

        const deviceInfo =
        {
          appVersion: DeviceInfo.getVersion(),
          platform: platform,
          deviceType: devType,
          platformVersion: DeviceInfo.getSystemVersion(),
          deviceModel: DeviceInfo.getModel(),
          deviceName: devName,
          mpinEnabled: "N",
          faceIdEnabled: "N",
          bioMetricEnabled: "N",
          applicationName: getApplicationName,
          buildId: getBuildId,
          brand: getBrand,
          bundleId: getBundleId,
          buildNumber: getBuildNumber,
          deviceId: getDeviceId,
          ipAddress: getIpAddress,
          macAddress: getMacAddress,
          manufacturer: getManufacturer,
          systemName: getSystemName,
          uniqueId: getUniqueId,
          userAgent: getUserAgent
        }

        try {
          await postDeviceinfo({
            deviceData: {
              ...deviceInfo
            },
            uniqueDeviceId: deviceInfo.uniqueId
          })
        } catch (error) {
          console.log(error, "error while posting device info ------>")
        }


        try {
          await postFcmToken({
            fcmToken: token
          })
        } catch (error) {
          console.log(error, "error while posting device token ------>")
        }

        try {
          await refetchUser()

        } catch (error) {
          console.log(error, "error while refetching user ------>")
        }

        //dispatch(setFcmToken(token)) // currently saving into local mobile state later on will save in db
        console.log("NEW FCM_TOKEN", token)
      }
    } catch (error) {
      console.log("error during generating token", error)
    }
  }

  async function requestUserPermission() {

    if (Platform.OS == 'android' && Platform.Version >= 33) {
      const res = await checkNotificationPermission()
      console.log(res, "notifyPermission----->")
      if (res === "granted") {
        getFCMToken()
      } else {

        console.log(res, "notification permission denied")
      }
    } else {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Authorization status:', authStatus);
        getFCMToken()
      }
    }
  }

  useEffect(() => {
    const getInitialNotificationDetail = async () => {
      const getInitialNotification = await notifee.getInitialNotification()
      const channelId = getInitialNotification?.notification.android?.channelId
      const notificationData = getInitialNotification?.notification?.data

      console.log(getInitialNotification,"getInitialNotification------>",initialNotificationHandled.current)
      if (getInitialNotification) {
        initialNotificationHandled.current = true;
        if (isAuthenticated && channelId === "blissy1") {
          navigation.navigate("Chatlist");
        }else if(isAuthenticated && channelId === "nuggets-call2" && notificationData?.senderData && getInitialNotification.pressAction.id !== "decline-call" ){
          navigation.navigate('privateCall',{IncomingCallData:{callerName:(notificationData?.senderData as {callerName:string})?.callerName,profilePic:(notificationData?.senderData as {profilePic:string})?.profilePic},OutgoingCallData:undefined,user:null,callstate:"INCOMING"});
        }
         else if(!isAuthenticated) {
          navigation.navigate("Login")
        }
      }
    }

    // event listens for background and foreground mode
    eventEmitter.on('notificationReceived', handleNotificationReceived);
    eventEmitter.on("callAccepted",(notificationData:any)=>handleCallAcceptNotification(notificationData?.senderData))
    getInitialNotificationDetail()
    return () => {
      eventEmitter.off('notificationReceived');
      eventEmitter.off('callAccepted');
    };
  }, []);

  useEffect(() => {

    verifyLocationPermissions().then(() => requestUserPermission()).catch((err) => console.log(err));
    // calling off the animation after first render
    const timingAnim = setTimeout(() => {
      sethealerAnimate(false);
    }, 5000);
    return () => {
      sethealerAnimate(false);
      clearTimeout(timingAnim);
    };
  }, []);

  useEffect(() => {
    socket?.on("privateMessageSuccessfulAdd", async (data) => {
      console.log("newMessage----->", data);
      // findMyMessage(newMessages, chatlistdata);
      const sortedMsg = findNewMessage(data.chatList)
      dispatch(pushChatlist(sortedMsg));
      console.log("newMessage2----->", data);
      // playNotificationSound();
      // await markRead({messageIds:[data.messageId],updateType:"isDelivered"}) // this needs to be called when message is delivered via notification
      // socket.emit("messageReceived", { userId: data.senderId, socketId: data.otherEndsocketId })
    });
    // socket?.on('newActiveUser', (user) => {
    //   dispatch(getActiveUserList(user))
    //   console.log(user, "activeUserList new-------->")
    // })

    socket?.on("messageDelivered", (data) => {
      console.log(data, "Deliveredupdateddata------>")
      const sortedMsg = findNewMessage(data.chatList)
      dispatch(pushChatlist(sortedMsg));
    })

    socket?.on("messageSeen", (data) => {
      console.log(data, "Seenupdateddata------>")
      const sortedMsg = findNewMessage(data.chatList)
      dispatch(pushChatlist(sortedMsg));
    })

  //   socket?.on('initiatePrivateCall', (data: { matchedUser: UserInterface, callerId: string }) => {
  //     console.log("initiateCalll--------->",data)
  //     dispatch(pushPrivateCalldata(data))
  //   // console.log(data, "data of paired user")
  // //   processCall()
  // })

    return () => {
      socket?.off("privateMessageSuccessfulAdd")
      socket?.off("messageDelivered")
      socket?.off("messageSeen")
      // socket?.off("initiatePrivateCall")
    }

  }, [chatlistdata, socket]);

  useEffect(() => {
    refetch({},false)
    refetchQuote({},false)
    getCallinfo({},false)
    refetchNewReviews({},false)
    refetchHealers({},false)
    dispatch(resetMessages())
    socket.on("connect", () => {
      socket.emit("getActiveUserList")
      dispatch(setSocket(socket))
      // fetchNewMsg().then((res)=>dispatch(pushCurrentMessage(res.data.chat))).catch((err)=>console.log(err))

    })

    socket.on('initiateCall', (data: { matchedUser: UserInterface, callerId: string }) => {
      otherUserScoketId.current = data.callerId
      // console.log(data, "data of paired user")
    })
    socket.on('activeUserList', (activeUserListres: ActiveUserList[]) => {
      dispatch(getActiveUserList(activeUserListres))
      console.log(activeUserListres, "activeUserList from home =")
    })

    socket.on('newActiveUser', (user) => {
      dispatch(getActiveUserList(user))
      console.log(user, "activeUserList new-------->")
    })
    socket.on('reconnect', function () {
      console.log('reconnect fired!');
      socket.emit("reconnected", { userId: user?._id })
    });

    socket.on('reconnect_attempt', () => {
      console.log('Reconnecting...');
    });

    socket.on('reconnect_error', (error) => {
      console.log('Reconnection error:', error);
    });

    socket.on('reconnect_failed', () => {
      console.log('Reconnection failed');
    })

    socket.on('disconnect', () => {
      dispatch(resetMessageCount())
      dispatch(resetMessages())
      socket.emit("callEnded", otherUserScoketId.current)
      console.log('user disconnected from socket');
    })

    return () => {
      socket.off("initiateCall")
      socket.off('activeUserList')
      socket.off("newActiveUser")
      socket.off('connect');
      socket.off('reconnect_attempt');
      socket.off('reconnect_error');
      socket.off('reconnect_failed');
      socket.off("disconnect");
      console.log("user out of app")
    }
  }, []);

  console.log(isAuthenticated, "Store------->")
  const getCardHeight = () => {
    const cardMarginBottom = actuatedNormalize(20);
    const cardPaddingHorizontal = actuatedNormalize(5);
    const avatarSize = 48;
    const detailsMarginLeft = 10;
    const rowSpacing = actuatedNormalize(5);
    const textSizeLarge = actuatedNormalize(16);
    const textSizeMedium = actuatedNormalize(14);
    const textSizeSmall = actuatedNormalize(14);
    const additionalSpacing = 15; // Additional spacing for margin and padding between elements

    // Calculate total height
    const cardHeight =
      cardMarginBottom +
      cardPaddingHorizontal * 2 +
      avatarSize +
      detailsMarginLeft +
      rowSpacing * 3 +
      textSizeLarge +
      textSizeMedium +
      textSizeSmall * 2 +
      additionalSpacing;

    return cardHeight;
  };
  const ITEM_SIZE = getCardHeight() + 40
  // console.log(isError, isCallinfoerror, isPostDeviceinfoError, isPostfcmtokeError, isErrorUser, "isCallinfoloading || isLoadingUser || isquotesLoading || isPostDeviceinfoLoading || isPostfcmtokenLoading")
  return (
    <>
      {(isCallinfoloading || isLoadingUser || isquotesLoading || isChatlistloading || isPostDeviceinfoLoading || isPostfcmtokenLoading || ishealersLoading) && <BlissyLoader />}
      <Appbackground>
        {/* // <AnimatedBackground source={{uri:"https://images.unsplash.com/photo-1710563138874-4bac91c14e51?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxOXx8fGVufDB8fHx8fA%3D%3D"}}> */}
        <View style={styles.container}>
          <TopBar navigation={navigation} />
          <ToggleButton value={value} setValue={setValue} />
          {value === 'healers' ? (
            <View style={styles.healerContainer}>
              {/* <OfferBadge /> */}
              <Animated.FlatList
                onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
                data={healersData?.data}
                showsVerticalScrollIndicator={false}
                renderItem={({ item, index }) => {

                  const inputRange = [-1, 0, ITEM_SIZE * index, ITEM_SIZE * (index + 2)]
                  const opacityInputRange = [-1, 0, ITEM_SIZE * index, ITEM_SIZE * (index + 1)]
                  const scale = scrollY.interpolate({
                    inputRange,
                    outputRange: [1, 1, 1, 0]
                  })
                  const opacity = scrollY.interpolate({
                    inputRange: opacityInputRange,
                    outputRange: [1, 1, 1, 0]
                  })

                  return (<Animated.View style={{ transform: [{ scale }], opacity: opacity }}>
                    <ProfileCard navigation={navigation} item={item} />
                  </Animated.View>)

                }}
                keyExtractor={(item, index) => index.toString()}
                onEndReached={loadMoreData} // Load more data when user reaches the end
                onEndReachedThreshold={0.1} // Load more when 90% of the list is scrolled
              />
            </View>
          ) : (
            <View style={styles.peopleContainer}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                {iconsLabel.map((item, id) => (
                  <Animatable.View
                    onAnimationEnd={() =>
                      setTimeout(() => {
                        setPeopleAnimate(false);
                      }, 2000)
                    }
                    animation={PeopleAnimate ? 'bounceIn' : undefined}
                    key={item.id}
                    delay={id * 500}>
                    <RoundedIconContainer
                      isBadge={true}
                      badgeText={item.label === "chats" ? newChatMessages : item.label === "calls" ? 0 : 0}
                      size={25}
                      onpress={() => {
                        navigation.navigate(item.navigate, { screenName: item.label })
                        setnewChatMessages(0)
                      }}
                      label={item.label}
                      iconName={item.iconName}
                    />
                  </Animatable.View>
                ))}
              </View>
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  width: '90%',
                  alignSelf: 'center',
                  rowGap: actuatedNormalize(5)
                }}>
                <Text style={{ color: colors.white, textAlign: "center", fontFamily: fonts.NexaItalic }}>
                  {`'${todayquotes?.text}'`}
                </Text>
                <Text style={{ color: colors.white, textAlign: "center", fontFamily: fonts.NexaBold }}>
                  {todayquotes?.author}.
                </Text>
                {/* <TalkNowButton
              label="Connect Now"
              onPress={intiateRandomConnection}
            /> */}
              </View>
              <SwipeButtonComponent updateSwipeStatus={intiateRandomConnection} />
              <Text style={styles.infoText}>Swipe to connect to random listener</Text>
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  width: '90%',
                }}>
                {appreviewdata?.length > 0 && <AutoLoopCarousel reviews={appreviewdata} />
                }
              </View>
            </View>
          )}
          {/* <PermissionDenied visible={permission} permissionType={permissionType} close={() => { Linking.openSettings(); setpermission(false); }} /> */}
        </View>
    
      <PermissionDenied visible={permission} permissionType={permissionType} close={()=>setpermission(false)} onGo={() => { Linking.openSettings(); setpermission(false); }} />
    {/* </View> */}
    </Appbackground>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  healerContainer: {
    marginTop: actuatedNormalize(30),
    width: '90%',
    rowGap: actuatedNormalize(20),
    paddingBottom: actuatedNormalize(200),
  },
  peopleContainer: {
    flex: 1,
    marginTop: actuatedNormalize(40),
    width: '90%',
  },

  infoText: {
    fontFamily: fonts.NexaRegular,
    color: colors.darkGray,
    alignSelf: "center",
    fontSize: actuatedNormalize(12),
    marginTop: actuatedNormalize(5)
  },
  loaderContainer: {
    position: 'absolute',
    zIndex: 2,
    flex: 1,
    height: screenHeight,
    width: screenWidth,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.darkOverlayColor2,
  },
});
