import { Alert, BackHandler, Image, Keyboard } from 'react-native';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Animated as NativeAnimated,
} from 'react-native';
import Animated, { SharedTransition, withSpring } from 'react-native-reanimated';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { useDispatch, useSelector } from 'react-redux';
import { GiftedChat, Bubble, InputToolbar, Send, SystemMessage, IMessage, Composer, Day, Time } from 'react-native-gifted-chat';
import { Swipeable } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ActiveUserListSelector, chatListSelector, addMessage, pushChatlist, resetMessageCount, Message, ChatList, MessageSelector, UsertypingSelector, resettypingState } from '../../redux/messageSlice';
import { AuthSelector, UserInterface } from '../../redux/uiSlice';
import { useGetChatlistQuery, useSendMessageMutation, useMarkReadMessageMutation, useDeleteChatHistoryMutation, useLazyGetChatlistQuery } from '../../api/chatService';
import generateRandomId from '../../utils/randomIdGenerator';
import { formatDateTime, getFormattedDate } from '../../utils/formatedateTime';
import { playSendMsgSound } from '../../common/sound/notification';
import { RootStackParamList } from '../../AppNavigation/navigatorType';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import moment from 'moment';
import Ionicons from "react-native-vector-icons/Ionicons"
import colors from '../../constants/colors';
import ReplyMessageBar from '../../common/chats/ReplyMessageBar';
import ChatMessageBox from '../../common/chats/ChatMessageBox';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import React from 'react';
import { actuatedNormalize } from '../../constants/PixelScaling';
import { RouteBackButton2 } from '../../common/button/BackButton';
import { fonts } from '../../constants/fonts';
import ChatIntialInfo from '../../common/chats/Intialscreen';
import { Button, Divider, Menu } from 'react-native-paper';
import { displayCallNotificationAndroid } from '../../common/call/incoming';
import { BlissyLoader } from '../../common/loader/blissy';
import { findNewMessage } from '../../utils/sortmessagebyData';
import useBackHandler from '../../hooks/usebackhandler';
import { useCreatePrivateCallMutation } from '../../api/callService';
type ProfileScreenRouteProp = RouteProp<RootStackParamList, 'ChatWindow'>;
interface ProfileScreenProps {
  navigation: NativeStackNavigationProp<RootStackParamList>;
  route: ProfileScreenRouteProp;
}

export type ViewToken = {
  item: any,
  // The key of this item
  key: string,
  index?: number,
  // indicated whether this item is viewable or not
  isViewable: boolean,
  section?: any
};
const ChatWindowScreen: React.FC<ProfileScreenProps> = ({ navigation, route }) => {
  const { userDetails, Chats, senderUserId } = route.params;
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const currentTime = moment();
  // const isKeyboardVisible = useRef(false);
  const [inputText, setInputText] = useState('');
  const messageTimestamp = currentTime.format();
  const { socket, user } = useSelector(AuthSelector);
  const { activeUserList } = useSelector(ActiveUserListSelector);
  const chatlistdata = useSelector(chatListSelector);
  const messages = useSelector(MessageSelector);
  const [markRead] = useMarkReadMessageMutation();
  const [menuVisible, setMenuVisible] = useState<boolean>(false)
  const [sendMsg] = useSendMessageMutation();
  const [stickyHeaderDate, setStickyHeaderDate] = useState(null);
  const [istyping, setIsTyping] = useState<boolean>(false);
  const [refetch,{ isError, isLoading, isSuccess }] = useLazyGetChatlistQuery()
  const [deleteChathistory, { isLoading: isDeleteChatloading, isError: isDeleteChatError, isSuccess: isDeleteChatSuccess }] = useDeleteChatHistoryMutation()
  const [createPrivateCall,{isLoading:iscreatePrivateCallloading,isError:iscreatePrivateCallError,isSuccess:iscreatePrivateCallSuccess}] = useCreatePrivateCallMutation()
  const [replyMessage, setReplyMessage] = useState<IMessage | null>(null);
  const swipeableRowRef = useRef<Swipeable | null>(null);
  const yValue = useRef(new NativeAnimated.Value(0)).current;
  const timerRef = useRef<NodeJS.Timeout>();
  const [text, setText] = useState('');
  const [UserSocketId, SetUserSocketId] = useState<string | undefined>();
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const TYPING_DELAY = 2000; // 2 seconds delay

  // calling use backhandler
  useBackHandler()

  useEffect(() => {
    const socketId = Chats ? activeUserList?.find(el => el?.userId?._id === Chats?.chatPartner?._id) : activeUserList?.find(el => el?.userId?._id === senderUserId);
    SetUserSocketId(socketId?.socketId);
  }, [activeUserList?.length]);

  useEffect(() => {
    if (Chats) {
      const newMessages = chatlistdata.find(el => el.chatPartner._id === Chats.chatPartner._id)?.newMessages;
      if (newMessages && newMessages?.length > 0) {
        timerRef.current = setTimeout(() => {
          MarkMessageRead(newMessages);
        }, 1000);
      }
    } else if (senderUserId) {
      const newMessages = chatlistdata.find(el => el.chatPartner._id === senderUserId)?.newMessages;
      if (newMessages && newMessages?.length > 0) {
        timerRef.current = setTimeout(() => {
          MarkMessageRead(newMessages);
        }, 1000);
      }
    }

    socket?.on('notify_typing_state', data => {

      console.log(data,"typingstatedatainsidewindow------>")
      if(data?.userData?._id === Chats?.chatPartner?._id && data?.typingState){
        setIsTyping(true);
      }else{
        setIsTyping(false);
      }
    });

    return () => {
      clearTimeout(timerRef.current);
      console.log("user out of chatwindow------>")
      socket?.off('notify_typing_state')
    };
  }, [chatlistdata, UserSocketId]);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);


  // const addMyMessage = useCallback(
  //   (message: Message, newChatlistdata: ChatList[]) => {
  //     try {
  //       const newChatlist: ChatList[] = newChatlistdata.map((chatItem) => {
  //         const myMessage = message?.receiverId === chatItem?.chatPartner?._id;
  //         if (myMessage) {
  //           return { ...chatItem, allMessages: [...chatItem.allMessages, message] };
  //         }
  //         return chatItem;
  //       });
  //       // const newMessage = { ...message, sender: 'them' };
  //       const sortedMsg = findNewMessage(newChatlist)
  //       dispatch(pushChatlist(sortedMsg));
  //     } catch (error) {
  //       console.error('An error occurred---->', error);
  //     }
  //   },
  //   [dispatch, chatlistdata]
  // );


  const addMyMessage = useCallback(
    (message: Message, newChatlistdata: ChatList[]) => {
      try {
        let isReceiverPresent = false;
  
        const newChatlist: ChatList[] = newChatlistdata.map((chatItem) => {
          const isMyMessage = message?.receiverId === chatItem?.chatPartner?._id;
          if (isMyMessage) {
            isReceiverPresent = true;
            return { ...chatItem, allMessages: [...chatItem.allMessages, message] };
          }
          return chatItem;
        });
  
        if (!isReceiverPresent) {
          const newChatItem: ChatList = {
            _id: generateRandomId(24),
            chatPartner: {
              ...userDetails as UserInterface
             },
            allMessages: [message],
            allMessagesId: generateRandomId(24),
            ChatHistorydeletedby: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            newMessages: [message], 
            newMessagesId: generateRandomId(24), 
            isBlocked: false,
            isBlockedBy: [],
            isDeleted: false,
            socketId: UserSocketId,
            userId: user?._id as string, 
          };
          newChatlist.push(newChatItem);
        }
  
        // Process and sort the new chat list
        const sortedMsg = findNewMessage(newChatlist);
        dispatch(pushChatlist(sortedMsg));
      } catch (error) {
        console.error('An error occurred---->', error);
      }
    },
    [dispatch, chatlistdata]
  );
  


  const sendMessage = async () => {
    console.log(inputText, "inputText------>")
    if (inputText.trim()) {
      const newMessage: Message = {
        messageId: generateRandomId(24),
        senderId: user?._id,
        receiverId: userDetails?._id,
        isRead: false,
        isDelivered: false,
        message: inputText.trim(),
        createdAt: messageTimestamp,
      };
      // yValue.setValue(0);
      Chats || senderUserId ? addMyMessage(newMessage, chatlistdata) : dispatch(addMessage(newMessage));

      if (UserSocketId) {
        try {
          setInputText('');
          playSendMsgSound();
          await sendMsg(newMessage);
          console.log(UserSocketId,"insidepostmessage--------->")
          // socket?.emit('privateMessageSendSuccessful', { messageId: newMessage.messageId, senderId: user?._id, receiverId: Chats?.chatPartner?._id || senderUserId, socketId: UserSocketId, mysocketId: socket.id });
          // socket?.emit('private_typing_state', {
          //   socketId: UserSocketId,
          //   receiverId:Chats?.chatPartner._id,
          //   userData: {_id:user?._id},
          //   typingState: false
          // });
        } catch (error) {
          console.log('Error while sending message', error);
        }
      } else {
        try {
          setInputText('');
          playSendMsgSound();
          await sendMsg(newMessage);
        } catch (error) {
          console.log('Error while sending message', error);
        }
      }
      setInputText('');
    }
  };

  const handleTyping = useCallback((text: string) => {
    console.log(text, "text", istyping)
    if (!istyping) {
      console.log(text, "text", istyping,UserSocketId)
      const TypingUserData = {
        socketId: UserSocketId,
        receiverId:Chats?.chatPartner._id,
        userData: {_id:user?._id},
        typingState: true
      }

      socket?.emit('private_typing_state', TypingUserData);
    }

    setInputText(text)

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      // setIsTyping(false);
      const TypingUserData = {
        socketId: UserSocketId,
        receiverId:Chats?.chatPartner._id,
        userData: {_id:user?._id},
        typingState: false
      }

      socket?.emit('private_typing_state', TypingUserData);
    }, TYPING_DELAY);
  }, [istyping,activeUserList,UserSocketId]);



  const MarkMessageRead = useCallback(async (newMessages: Message[] | undefined) => {
    const newMessageIds: any[] = [];
    newMessages?.forEach(el => {
      if (el.receiverId === user?._id && el.isRead === false) {
        newMessageIds.push(el.messageId);
      }
    });
    if (newMessageIds.length > 0) {
      await markRead({ messageIds: newMessageIds, updateType: 'isRead' });
      // UserSocketId && socket?.emit('messageSeen', { userId: Chats?.chatPartner?._id || senderUserId, socketId: UserSocketId });
      refetch({},false)
    }
  }, [dispatch, chatlistdata, UserSocketId]);

  const handleMenuVisible = () => {
    setMenuVisible(true)
  }

  const handleMenuClose = () => {
    setMenuVisible(false)
  }

  const handleDeleteChatHistory = async () => {
    console.log("chat history deleted-------->")
    setMenuVisible(false)
   await deleteChathistory(Chats?.newMessagesId)
   await refetch({},false)
  }


  const onViewableItemsChanged = useCallback((info: {
    viewableItems: Array<ViewToken>,
    changed: Array<ViewToken>,
  }) => {
    console.log("lastItems------>")

    if (info.viewableItems && info.viewableItems.length > 0) {
      const lastItem = info.viewableItems.pop();
      console.log(lastItem, "lastItemsinside------>")
      if (lastItem && lastItem.item) {
        setStickyHeaderDate(lastItem.item?.createdAt);
      }
    }
  }, []);

  // updateStickyDate = ({ viewableItems, changed }) => {

  // };

  const viewabilityConfigCallbackPairs = useRef([{
    viewabilityConfig: {
      itemVisiblePercentThreshold: 15,
    },
    onViewableItemsChanged
  }]);

  const updateRowRef = useCallback(
    (ref: any) => {
      if (ref && replyMessage && ref.props.children.props.currentMessage?._id === replyMessage._id) {
        swipeableRowRef.current = ref;
      }
    },
    [replyMessage]
  );

  useEffect(() => {
    if (replyMessage && swipeableRowRef.current) {
      swipeableRowRef.current.close();
      swipeableRowRef.current = null;
    }
  }, [replyMessage]);

  const MessageChatlistData = useMemo(
    () =>
      Chats
        ? chatlistdata?.find((el) => el?.chatPartner?._id === Chats?.chatPartner?._id)?.allMessages
        : senderUserId
          ? chatlistdata?.find((el) => el?.chatPartner?._id === senderUserId)?.allMessages || null
          : messages,
    [chatlistdata, senderUserId]
  );
  // console.log(MessageChatlistData, "MessageChatlistData-------->")
  // const formattedMessages: IMessage[] = MessageChatlistData?.map(message => ({
  //   _id: message._id || message.messageId,
  //   text: message.message,
  //   createdAt: message.createdAt,
  //   sent: message.isDelivered,
  //   received: message.isRead,
  //   user: {
  //     _id: message.senderId,
  //     name: message.senderId === user?._id ? 'You' : userDetails?.name,
  //     avatar: message.senderId === user?._id ? user?.profilePic : userDetails?.profilePic,

  //   },
  // })).reverse();

  const formattedMessages: IMessage[] = useMemo(() => {
    const MessageData = MessageChatlistData?.filter((el) => {
      if (el.isDeletedBy && el.isDeletedBy.length > 0) {
        return !el.isDeletedBy.includes(user?._id as string);
      } else {
        return true; // Include messages that do not have isDeletedBy field or isDeletedBy is empty
      }
    });

    // console.log(MessageChatlistData, "MessageChatlistData------>")
    if (!MessageData || !MessageData.length) return []; // Early return if MessageData is empty

    // console.log(MessageData, "MessageData----->")
    return MessageData.map(message => ({
      _id: message._id || message.messageId,
      text: message.message,
      createdAt: message.createdAt,
      //  pending:false,
      sent: true,
      received: message.isDelivered,
      seen: message.isRead,
      user: {
        _id: message.senderId,
        name: message.senderId === user?._id ? 'You' : userDetails?.name,
        avatar: message.senderId === user?._id ? user?.profilePic : userDetails?.profilePic,
      },
      // isReply: { 
      //    _id: message._id || message.messageId,
      //   text: 'This is a sample replied message',
      //   createdAt: new Date(),
      //   user: {
      //     _id: message.senderId,
      //     name: 'John Doe',
      //     avatar: 'https://via.placeholder.com/150',
      //   }}
    })).reverse();
  }, [chatlistdata, senderUserId]);

  const startCall = useCallback(async ()=>{
    const callInfobody = {
      callType: "individual", // individual  or random
      callerId: user?._id, // caller Id
      calleeId:Chats ?  Chats?.chatPartner?._id : userDetails?._id, // calleeId
      callDuration: 0, // duration
      isMissed: false,
      isRejected: false,
      isSuccessful: false,
    }
    // displayCallNotificationAndroid({ callId, callerName, hasVideo });
    socket?.emit('newPrivateCall',{socketId: UserSocketId,userData:user,otherUserId:Chats ? Chats?.chatPartner._id : userDetails?._id})
    navigation.navigate('privateCall', { user:null,OutgoingCallData:Chats ? Chats?.chatPartner : userDetails,IncomingCallData:undefined,callstate:"OUTGOING" })
    await createPrivateCall(callInfobody)
    console.log('Calling...',callInfobody);
  },[socket])
    // const callId = 'call-12345';
    // const callerName = 'John Doe';
    // const hasVideo = false;

   

  // console.log(inputText, "inputText------>")
  console.log(UserSocketId, "UserSocketId------>")
  // console.log(istyping, "istyping------>")

  // console.log(chatlistdata, "MessageChatlistData------>")


  const renderInputToolbar = (props: any) => (
    <InputToolbar
      {...props}
      renderComposer={props => <Composer {...props} textInputStyle={{color:colors.white,fontFamily:fonts.NexaRegular}} placeholderTextColor={colors.white}/>}
      // renderComposer={() => <Composer
      //   multiline={true}
      //   composerHeight={actuatedNormalize(50)}
      //   placeholder={Chats?.isBlocked ? "Messaging disabled for this user" : "Type message here..."}
      //   disableComposer={Chats?.isBlocked as boolean}
      //   // composerHeight={140}

      // />}
      containerStyle={{
        borderTopLeftRadius: actuatedNormalize(10),
        borderTopRightRadius: actuatedNormalize(10),
        padding: actuatedNormalize(5),
        borderTopColor: colors.transparent, borderWidth: 0, backgroundColor: colors.dark,
      }}
    // renderActions={() => (
    //   <View style={{ height: 44, justifyContent: 'center', alignItems: 'center', left: 5 }}>
    //     <Ionicons name="add" color={colors.primary} size={28} />
    //   </View>
    // )}
    >

    </InputToolbar>
  );


  return (
    <SafeAreaView style={styles.container}>
      {isDeleteChatloading && <BlissyLoader />}
      <View style={styles.header}>
        <RouteBackButton2
          onPress={() => {
            // socket?.emit('private_typing_state', {
            //   socketId: UserSocketId,
            //   receiverId:Chats?.chatPartner._id,
            //   userData: {_id:user?._id},
            //   typingState: false
            // });
            // socket?.emit('private_typing_state', { socketId: UserSocketId, typingState: false });
            navigation.goBack();
          }}
        />
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.headerContent}
            onPress={() => navigation.navigate('ChatPartnerDetails', { chatPartner: userDetails })}
          >
            <Animated.Image style={styles.avatar} source={{ uri: userDetails?.profilePic }} sharedTransitionTag='profile' />
            <View>
              <Animated.Text style={styles.userName} sharedTransitionTag='ChatPartnerName'>
                {userDetails?.name}
              </Animated.Text>
              <Text style={styles.userStatus}>{istyping ? 'Typing...' : UserSocketId ? 'online' : 'offline'}</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.callMoreIconCotainer}>
          <TouchableOpacity
            onPress={startCall}
          >
            <Ionicons name='call' size={25} color={colors.white} />
          </TouchableOpacity>
          <TouchableOpacity
          // onPress={() => navigation.navigate('ChatPartnerDetails', { chatPartner: userDetails })}
          >
            <Menu
              visible={menuVisible}
              onDismiss={handleMenuClose}
              contentStyle={{backgroundColor:colors.dark}}
              anchor={<Ionicons name='ellipsis-vertical' onPress={handleMenuVisible} size={25} color={colors.white} />}>

              <Menu.Item titleStyle={{color:colors.white,fontFamily:fonts.NexaRegular}} onPress={handleDeleteChatHistory} title="Delete Chat History" />
              {/* <Menu.Item onPress={() => { }} title="Item 2" /> */}
              {/* <Menu.Item onPress={() => { }} title="Item 3" /> */}
            </Menu>

          </TouchableOpacity>
        </View>
      </View>
      {formattedMessages.length <= 3 && <ChatIntialInfo UserImage={user?.profilePic} partnerImage={userDetails?.profilePic} partnerName={Chats?.chatPartner.name} userName={user?.name} />}
      {stickyHeaderDate && (
        <View style={styles.stickyHeader}>
          <Text style={styles.stickyHeaderText}>{getFormattedDate(stickyHeaderDate)}</Text>
        </View>
      )}

      {Chats?.isBlocked && (
        <View style={[styles.stickyHeader, { top: "15%", backgroundColor: colors.primary, width: "60%" }]}>
          <Text style={[styles.stickyHeaderText, { color: colors.white, textAlign: "center" }]}>{Chats.isBlockedBy.some((el) => el === user?._id) ? "Messaging disabled for this user as the user is blocked by you" : "Messaging disabled for this user as the user has blocked you"}</Text>
        </View>
      )}
      <GiftedChat
        messages={formattedMessages}
        onSend={sendMessage}
        text={inputText}
        onInputTextChanged={(text)=>handleTyping(text)}
        user={{
          _id: user?._id || 1,
          avatar: user?.profilePic
        }}
        keyboardShouldPersistTaps="never"
        isTyping={istyping}
        showUserAvatar={false}
        alwaysShowSend={true}
        
        shouldUpdateMessage={() => true}
        renderSystemMessage={props => <SystemMessage {...props} textStyle={{ color: colors.gray }} />}
        bottomOffset={insets.bottom}
        renderAvatarOnTop={true}
        listViewProps={{
          renderToHardwareTextureAndroid:true,
          keyboardDismissMode: 'on-drag',
          contentContainerStyle: { paddingTop: stickyHeaderDate ? 10 : 0 },
          showsVerticalScrollIndicator: false, viewabilityConfigCallbackPairs: viewabilityConfigCallbackPairs.current
        }}
        textInputProps={styles.input}

        renderDay={props=>(
          <Day             {...props}
          textStyle={{fontFamily:fonts.NexaRegular}}/>
        )}

        renderTime={props=>(
          <Time              {...props}
           timeTextStyle={{left:{fontFamily:fonts.NexaRegular},right:{fontFamily:fonts.NexaRegular}}}/>
        )}

        renderBubble={props => (
          <View shouldRasterizeIOS renderToHardwareTextureAndroid> 
          <Bubble
            {...props}
            textStyle={{
              left: { color: colors.white,fontFamily:fonts.NexaRegular },
              right: { color: colors.white,fontFamily:fonts.NexaRegular },
              
            }}
            
            tickStyle={{ color: !props.currentMessage?.seen ? colors.white : colors.skyBlue }}
            wrapperStyle={{
              left: { backgroundColor: colors.dark, borderTopLeftRadius: 15 },
              right: { backgroundColor: colors.primary, borderTopRightRadius: 15 },
            }}
            containerToPreviousStyle={{
              right: { borderTopRightRadius: 15 },
              left: { borderTopLeftRadius: 15 },
            }}
            containerToNextStyle={{
              right: { borderTopRightRadius: 15 },
              left: { borderTopLeftRadius: 15 },
            }}
            containerStyle={{
              right: { borderTopRightRadius: 15 },
              left: { borderTopLeftRadius: 15 },
            }}


          >



            {/* {props?.currentMessage?.repliedMessage && (
              <View style={styles.repliedMessageContainer}>
                <Text style={styles.repliedMessageText}>
                  {props.currentMessage?.repliedMessage?.sender}: {props.currentMessage?.repliedMessage?.text}
                </Text>
              </View>
            )} */}
          </Bubble>
          </View>  
        )}

        // renderDay={props => (
        //   <Day {...props} dateFormat='ll'/>
        // )}
        renderSend={props => (
          <View
            // onPress={sendMessage}
            style={{
              height: "100%",
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 14,
              // backgroundColor:"white",
              paddingHorizontal: 5,
            }}>
            <Send
              {...props}
              alwaysShowSend={true}
              containerStyle={{
                justifyContent: 'center',
                alignSelf: "flex-end",
                //  backgroundColor:"red"
              }}>
              <MaterialCommunityIcons style={styles.sendIcon} name='send-circle' size={40} />
            </Send>
          </View>
        )}
        // minComposerHeight={30}
        // forceGetKeyboardHeight={true}
        disableComposer={Chats?.isBlocked as boolean}
        renderInputToolbar={renderInputToolbar}
        renderChatFooter={() => <ReplyMessageBar clearReply={() => setReplyMessage(null)} message={replyMessage} />}
        // onLongPress={(context, message) => setReplyMessage(message)}
        renderMessage={props => <ChatMessageBox {...props} setReplyOnSwipeOpen={setReplyMessage} updateRowRef={updateRowRef} />}
      />


    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  sendIcon: {
    color: colors.lightGray, // Example color for the icon
    // Rest of the styles remain unchanged
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: actuatedNormalize(20),
    marginLeft: actuatedNormalize(20),
    columnGap: actuatedNormalize(15)
    // backgroundColor:colors.dark,
    // marginHorizontal:actuatedNormalize(10),borderRadius:actuatedNormalize(10)
  },
  stickyHeader: {
    position: 'absolute',
    top: 80,
    width: '30%',
    borderRadius: 10,
    alignSelf: "center",
    alignItems: 'center',
    backgroundColor: colors.dark,
    paddingVertical: 5,
    zIndex: 1,
  },
  stickyHeaderText: {
    fontSize: 12,
    fontFamily: fonts.NexaRegular,
    color: colors.white,
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: "center",
    columnGap: actuatedNormalize(10),
    padding: actuatedNormalize(5)
  },
  callMoreIconCotainer: {
    flexDirection: 'row',
    columnGap: actuatedNormalize(25),
    alignItems: "center",
    justifyContent: "flex-end",
    marginRight: 10,
    flex: 1,
  },
  composer: {
    backgroundColor: colors.dark,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.lightGray,
    paddingHorizontal: 10,
    padding: 30,
    paddingTop: 8,
    fontSize: 16,
    marginVertical: 4,
  },
  userName: {
    fontSize: actuatedNormalize(16),
    color: colors.white,
    fontFamily: fonts.NexaRegular,
  },
  userStatus: {
    fontSize: actuatedNormalize(14),
    color: colors.white,
    fontFamily: fonts.NexaRegular,
  },
  avatar: {
    width: actuatedNormalize(45),
    height: actuatedNormalize(45),
    borderRadius: actuatedNormalize(30), // Makes it circular
  },

  inputContainer: {
    flexDirection: 'row',
    // backgroundColor: '#ffffff',
    alignItems: 'center',
    borderRadius: 20, // Updated to make the container rounded
    margin: 10,
    color: colors.black,
    position: "relative",
  },

  input: {
    paddingHorizontal: 5,
    fontSize: 16,
    marginVertical: 4,
    width: "80%",
    // Remove borderWidth and borderColor if previously set
  },

  iconContainer: {
    position: 'absolute',
    right: 10,
    height: '100%',
    justifyContent: 'center',
  },

  repliedMessageContainer: {
    padding: 5,
    backgroundColor: colors.lightGray,
    borderRadius: 5,
    marginBottom: 5,
  },
  repliedMessageText: {
    fontSize: 12,
    color: colors.gray,
  },
});

export default ChatWindowScreen;
