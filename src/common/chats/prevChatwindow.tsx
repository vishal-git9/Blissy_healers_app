import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
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
import Ionicons from 'react-native-vector-icons/Ionicons';
import { actuatedNormalize } from '../../constants/PixelScaling';
import colors from '../../constants/colors';
import { fonts } from '../../constants/fonts';
import { RouteBackButton2 } from '../../common/button/BackButton';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { RootStackParamList } from '../../AppNavigation/navigatorType';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ActiveUserList, ActiveUserListSelector, ChatList, Message, MessageSelector, addMessage, chatListSelector, chatScreenActiveSelector, getActiveUserList, pushChatlist, resetMessageCount, setChatScreenActive } from '../../redux/messageSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AuthSelector } from '../../redux/uiSlice';
import moment from 'moment';
import { useGetChatlistQuery, useMarkReadMessageMutation, useSendMessageMutation } from '../../api/chatService';
import generateRandomId from '../../utils/randomIdGenerator';
import Animated, { SharedTransition, withSpring } from 'react-native-reanimated';
import { FlashList } from '@shopify/flash-list';


const debounce = <F extends (...args: any[]) => any>(func: F, wait: number): (...args: Parameters<F>) => void => {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<F>): void => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), wait);
  };
};

const customTransition = SharedTransition.custom((values) => {
  'worklet';
  return {
    height: withSpring(values.targetHeight),
    width: withSpring(values.targetWidth),
  };
});

import { formatDateTime, getFormattedDate } from '../../utils/formatedateTime';
import { playSendMsgSound } from '../../common/sound/notification';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

type ProfileScreenRouteProp = RouteProp<RootStackParamList, 'ChatWindow'>;
type HeaderItem = { type: 'header'; title: string };
type MessageItem = { type: 'message'; message: Message };
type ListItem = HeaderItem | MessageItem;

interface ProfileScreenProps {
  navigation: NativeStackNavigationProp<RootStackParamList>;
  route: ProfileScreenRouteProp;
}

const ChatWindowScreen: React.FC<ProfileScreenProps> = ({ navigation, route }) => {
  const { userDetails, Chats, senderUserId } = route.params;
  const currentTime = moment();
  const isKeyboardVisible = useRef(false);

  const messageTimestamp = currentTime.format();
  const { socket, user } = useSelector(AuthSelector);
  const [inputText, setInputText] = useState('');
  const flashListRef = useRef<FlashList<ListItem>>(null);
  const { activeUserList } = useSelector(ActiveUserListSelector);
  const chatlistdata = useSelector(chatListSelector);
  const [markRead] = useMarkReadMessageMutation();
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [istyping, setIsTyping] = useState<boolean>(false);
  const [isScrollingToEnd, setIsScrollingToEnd] = useState(false);
  const [userScrolling, setUserScrolling] = useState<boolean>(false);
  const [messageHeights, setMessageHeights] = useState<number[]>([]);

  const [UserSocketId, SetUserSocketId] = useState<string | undefined>();
  const timerRef = useRef<NodeJS.Timeout>();
  const yValue = useRef(new NativeAnimated.Value(0)).current;
  const [sendMsg, { isError, isLoading, isSuccess, reset, data }] = useSendMessageMutation();
  const { refetch, isError: chatlisterror, isLoading: chatlistloading, data: newchatlistdata } = useGetChatlistQuery(user?._id);

  const messages = useSelector(MessageSelector);

  const dispatch = useDispatch();

  const addMyMessage = useCallback(
    (message: Message, newChatlistdata: ChatList[]) => {
      try {
        const newChatlist: ChatList[] = newChatlistdata.map((chatItem) => {
          const myMessage = message.receiverId === chatItem.chatPartner._id;
          if (myMessage) {
            return { ...chatItem, allMessages: [...chatItem.allMessages, message] };
          }
          return chatItem;
        });
        const newMessage = { ...message, sender: 'them' };
        dispatch(pushChatlist(newChatlist));
      } catch (error) {
        console.error('An error occurred---->', error);
      }
    },
    [dispatch, chatlistdata?.length]
  );

  const MarkMessageRead = useCallback(
    async (newMessages: Message[] | undefined) => {
      const newMessageIds: any[] = [];
      newMessages?.forEach((el) => {
        if (el.receiverId === user?._id && el.isRead === false) {
          newMessageIds.push(el.messageId);
          return;
        }
        return;
      });
      if (newMessageIds.length > 0) {
        await markRead({ messageIds: newMessageIds, updateType: 'isRead' });
        console.log(UserSocketId, "socket--id")
        UserSocketId && socket?.emit('messageSeen', { userId: Chats?.chatPartner?._id || senderUserId, socketId: UserSocketId });
        refetch()
          .then((res) => dispatch(pushChatlist(res.data.chatList)))
          .catch((err) => console.log(err));
      }
    },
    [dispatch, chatlistdata, UserSocketId]
  );

  const sendMessage = async () => {
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
      yValue.setValue(0);
      Chats || senderUserId ? addMyMessage(newMessage, chatlistdata) : dispatch(addMessage(newMessage));

      if (UserSocketId) {
        try {
          setInputText('');
          playSendMsgSound();
          await sendMsg(newMessage);
          socket?.emit('privateMessageSendSuccessful', { messageId: newMessage.messageId, senderId: user?._id, receiverId: Chats?.chatPartner?._id || senderUserId, socketId: UserSocketId, mysocketId: socket.id });
          socket?.emit('private_typing_state', { socketId: UserSocketId, typingState: false });
          flashListRef.current?.scrollToEnd({ animated: true });
          NativeAnimated.timing(yValue, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }).start();
        } catch (error) {
          console.log('Error while sending message', error);
        }
      } else {
        try {
          setInputText('');
          playSendMsgSound();
          await sendMsg(newMessage);
          flashListRef.current?.scrollToEnd({ animated: true });
          NativeAnimated.timing(yValue, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }).start();
        } catch (error) {
          console.log('Error while sending message', error);
        }
      }
      setInputText('');
      flashListRef.current?.scrollToEnd({ animated: true });
      NativeAnimated.timing(yValue, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  };

  useEffect(() => {
    const socketId = Chats ? activeUserList?.find((el) => el?.userId?._id === Chats?.chatPartner?._id) : activeUserList?.find((el) => el?.userId?._id === senderUserId)

    SetUserSocketId(socketId?.socketId)
  }, [activeUserList?.length])

  useEffect(() => {
    if (Chats) {
      const newMessages = chatlistdata.find((el) => el.chatPartner._id === Chats.chatPartner._id)?.newMessages;
      if (newMessages && newMessages?.length > 0) {
        timerRef.current = setTimeout(() => {
          MarkMessageRead(newMessages);
        }, 1000);
      }
    } else if (senderUserId) {
      const newMessages = chatlistdata.find((el) => el.chatPartner._id === senderUserId)?.newMessages;
      if (newMessages && newMessages?.length > 0) {
        timerRef.current = setTimeout(() => {
          MarkMessageRead(newMessages);
        }, 1000);
      }
    }


    socket?.on('notify_typing_state', (data) => {
      // {
      //   socketId:
      //   userData:
      //   typingState
      // }
      setIsTyping(data.typingState);
    });



    return () => {
      socket?.off('notify_typing_state');
      clearTimeout(timerRef.current);
    };
  }, [chatlistdata, UserSocketId]);



  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      dispatch(resetMessageCount());
      return false;
    });
    return () => backHandler.remove();
  }, []);

  const MessageChatlistData = useMemo(
    () =>
      Chats
        ? chatlistdata.find((el) => el?.chatPartner?._id === Chats?.chatPartner?._id)?.allMessages
        : senderUserId
          ? chatlistdata.find((el) => el?.chatPartner?._id === senderUserId)?.allMessages || null
          : messages,
    [chatlistdata, senderUserId]
  );
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      flashListRef.current?.scrollToEnd({ animated: true });
    });
  
    return () => {
      keyboardDidShowListener.remove();
    };
  }, []);
  
  const isFirstMessageFromSender = (message: Message, index: number): boolean => {
    if (index === 0) return true;
    const prevMessage = MessageChatlistData?.[index - 1];
    console.log(prevMessage, message, index, "avatarsend---->")
    return prevMessage?.senderId !== message.senderId;
  };

  // console.log(MessageChatlistData,"MessageChatlistData----->")


  let scrollTimeout = null;

  const handleTyping = useCallback(
    (text: string) => {
      console.log("socketId---->", UserSocketId)
      const TypingUserData = {
        socketId: UserSocketId,
        userData: user,
        typingState: true
      }
      socket?.emit('private_typing_state', TypingUserData);
      setInputText(text);
      // You can also dispatch typing state to the redux store or perform other actions here
    },
    [activeUserList.length, dispatch, senderUserId, inputText]
  );

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const contentHeight = event.nativeEvent.contentSize.height;
    const layoutHeight = event.nativeEvent.layoutMeasurement.height;

    if (offsetY + layoutHeight >= contentHeight - 10) {
      setIsAtBottom(true);
    } else {
      setIsAtBottom(false);
    }
  };

  const scrollToEnd = () => {
    if (flashListRef.current && !isScrollingToEnd) {
      console.log("gettingcalled------>")

      setIsScrollingToEnd(true);
      flashListRef.current.scrollToEnd({ animated: true });
      setTimeout(() => setIsScrollingToEnd(false), 500); // Give enough time for the scroll to complete
    }
  };
  useEffect(() => {
    if (isAtBottom && MessageChatlistData && MessageChatlistData.length > 0) {
      scrollToEnd();
    }
  }, [isMounted, MessageChatlistData]);


  useEffect(() => {
    if (isMounted && isAtBottom && flashListRef.current) {
      flashListRef.current.scrollToEnd({ animated: true });
    }
  }, [isMounted, MessageChatlistData, isAtBottom]);


  const MessageItem = useCallback(
    ({ item, index }: { item: Message; index: number }) => {
      const isLastMessage = index === MessageChatlistData?.length;
      console.log(index, "index---->")
      const messageStyle = isLastMessage
        ? {
          transform: [
            {
              translateY: yValue.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            },
          ],
          opacity: yValue.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0, 0.5, 1],
          }),
        }
        : {};
      const showAvatar = isFirstMessageFromSender(item, index);

      return (
        <View
          onLayout={(event) => {
            const { height } = event.nativeEvent.layout;
            setMessageHeights((prevHeights) => [...prevHeights, height]);
          }}
        >

          <Animated.View

            style={[
              styles.messageView,
              item.senderId === user?._id ? { alignSelf: 'flex-end' } : { alignSelf: 'flex-start' },
            ]}
          >

            {item?.showAvatar && item.senderId !== user?._id ? (
              <View style={{ flexDirection: "row" }}>
                <Image
                  source={{ uri: userDetails?.profilePic }}
                  style={styles.avatarSmall}
                />

                <View style={[styles.messageBubble, item.senderId === user?._id ? styles.myMessage : styles.theirMessage]}>
                  <Text style={styles.messageText}>{item.message}</Text>
                </View>

              </View>

            ) : (<View style={{ flexDirection: "row" }}>
              <View
                style={styles.avatarSmall}
              />

              <View style={[styles.messageBubble, item.senderId === user?._id ? styles.myMessage : styles.theirMessage]}>
                <Text style={styles.messageText}>{item.message}</Text>
              </View>

            </View>
            )}

            <View
              style={[
                styles.messageStatus,
                item.senderId === user?._id ? { marginRight: actuatedNormalize(20) } : { marginLeft: actuatedNormalize(50) },
              ]}
            >
              <Text style={[styles.messageText, { color: colors.gray, fontSize: actuatedNormalize(10) }]}>
                {formatDateTime(item.createdAt, "")}
              </Text>
              {item.senderId === user?._id ? (
                item.isDelivered && item.isRead ? (
                  <Ionicons name='checkmark-done' size={actuatedNormalize(20)} color={colors.primary} />
                ) : !item.isDelivered && !item.isRead ? (
                  <Ionicons name='checkmark' size={actuatedNormalize(20)} color={colors.lightGray} />
                ) : (
                  <Ionicons name='checkmark-done' size={actuatedNormalize(20)} color={colors.lightGray} />
                )
              ) : null}
            </View>
          </Animated.View>
        </View>
      );
    },
    [MessageChatlistData?.length, yValue, user?._id]
  );


  const averageItemSize = useMemo(() => {
    if (messageHeights.length === 0) return 70; // Default value if no heights measured
    const totalHeight = messageHeights.reduce((sum, height) => sum + height, 0);
    return totalHeight / messageHeights.length;
  }, [messageHeights]);

  const lastMessageIndex = useMemo(
    () => (Chats ? chatlistdata?.filter((el) => el?.chatPartner?._id === Chats?.chatPartner?._id)[0].allMessages?.length - 1 : messages.length),
    [chatlistdata, messages.length]
  );
  const initialScrollIndex = useMemo(() => {
    return MessageChatlistData && MessageChatlistData.length >= 9 ? lastMessageIndex : null;
  }, [MessageChatlistData?.length]);

  const sections = useMemo(() => {
    if (MessageChatlistData && MessageChatlistData.length > 0) {
      const grouped = MessageChatlistData.reduce((acc, message, index) => {
        const messageDate = getFormattedDate(message.createdAt);
        const prevMessage = MessageChatlistData[index - 1];
        const showAvatar = index === 0 || (prevMessage && prevMessage.senderId !== message.senderId);
        const messageWithAvatar = { ...message, showAvatar };

        if (!acc[messageDate]) {
          acc[messageDate] = { title: messageDate, data: [] };
        }

        acc[messageDate].data.push(messageWithAvatar);
        return acc;
      }, {} as Record<string, { title: string; data: typeof MessageChatlistData }>);

      return Object.entries(grouped).flatMap(([date, { title, data }]) => [
        { type: 'header', title },
        ...data.map(message => ({ type: 'message', message })),
      ]) as ListItem[];
    }
  }, [MessageChatlistData]);


  const stickyHeaderIndices = sections?.map((item, index) => {
    if (item.type === "header") {
      return index;
    } else {
      return null;
    }
  })
    .filter((item) => item !== null) as number[];

  const onLayout = () => {
    setIsMounted(true);
    if (MessageChatlistData && MessageChatlistData.length > 0 && flashListRef.current) {
      console.log("Iamhere------>")
      flashListRef.current.scrollToIndex({ index: MessageChatlistData.length - 1, animated: true });
    }
  };

  console.log(sections,"sections----->")

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <RouteBackButton2
          onPress={async () => {
            socket?.emit('private_typing_state', { socketId: UserSocketId, typingState: false });
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
      </View>

        <FlashList
          ref={flashListRef}
          data={sections}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => (item.type === 'header' ? `header-${index}` : `message-${index}`)}
          renderItem={({ item }) => {
            if (item.type === 'header') {
              return (
                <View style={styles.dateHeader}>
                  <Text style={styles.dateHeaderText}>{item.title}</Text>
                </View>
              )
            } else {
              return <MessageItem index={parseInt(item.message.messageId)} item={item.message} />
            }
          }}
          getItemType={(item) => {
            // To achieve better performance, specify the type based on the item
            return item.type === "header" ? "sectionHeader" : "row";
          }}
          stickyHeaderIndices={stickyHeaderIndices}
          contentContainerStyle={{ paddingTop: actuatedNormalize(10), paddingBottom: actuatedNormalize(10) }}
          initialScrollIndex={initialScrollIndex}
          estimatedItemSize={averageItemSize} // Estimated item size for optimization
          // onLayout={() => {
          //   if (isMounted && MessageChatlistData && MessageChatlistData.length > 0) {
          //     flashListRef.current?.scrollToIndex({ index: lastMessageIndex, animated: true });
          //   }
          // }}

          onScrollBeginDrag={() => setUserScrolling(true)}
          onMomentumScrollBegin={() => setUserScrolling(true)}
          onScrollEndDrag={() => setUserScrolling(false)}
          onMomentumScrollEnd={() => setUserScrolling(false)}
          onScroll={handleScroll}
          onLayout={onLayout}
          onContentSizeChange={() => {
            if (isAtBottom && MessageChatlistData && MessageChatlistData.length > 0) {
              scrollToEnd();
            }
          }}
          bounces={false}
          
          alwaysBounceHorizontal={false}
          alwaysBounceVertical={false}
          bouncesZoom={false}
          stickyHeaderHiddenOnScroll={true}
          viewabilityConfig={{
            itemVisiblePercentThreshold: 50,
          }}

        //  initialNumToRender={20}
        // maxToRenderPerBatch={20}
        removeClippedSubviews={true}
        />
        <View style={styles.inputContainer}>
          <TextInput
            value={inputText}
            onChangeText={(text) => {
              handleTyping(text)
            }}
            multiline={true}
            scrollEnabled={true}

            // onFocus={() => {
            //   if (isKeyboardVisible.current) {
            //     flashListRef.current?.scrollToEnd({ animated: true });
            //   }
            // }}           
             placeholder='Type here...'
            style={styles.input}
            placeholderTextColor={colors.gray}
          />
          <TouchableOpacity style={styles.iconContainer} onPress={sendMessage}>
            <MaterialCommunityIcons style={styles.sendIcon} name='send-circle' size={40} />
          </TouchableOpacity>
        </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  messageView: {
    maxWidth: '80%',
    flexDirection: "column",
    rowGap: actuatedNormalize(5),
    marginVertical: actuatedNormalize(5)
  },
  messageBubble: {
    padding: actuatedNormalize(10),
    borderRadius: actuatedNormalize(20),
    // width: '80%',
  },
  messageStatus: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    columnGap: actuatedNormalize(2)
  },
  myMessage: {
    backgroundColor: colors.primary,
    alignSelf: 'flex-end',
    marginRight: actuatedNormalize(20),
  },
  theirMessage: {
    backgroundColor: colors.dark,
    marginLeft: actuatedNormalize(10),
  },
  messageText: {
    fontSize: actuatedNormalize(16),
    color: colors.white,
    fontFamily: fonts.NexaRegular
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
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 15,
    color: colors.white,
    paddingRight:actuatedNormalize(50),
    borderRadius: 20, // Updated for rounded corners
    backgroundColor: colors.dark, // Updated for the input background color
    // Remove borderWidth and borderColor if previously set
  },

  iconContainer: {
    position: 'absolute',
    right: 10,
    height: '100%',
    justifyContent: 'center',
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
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: "center",
    columnGap: actuatedNormalize(10),
    padding: actuatedNormalize(5)
  },
  backButton: {
    fontSize: 18,
    color: '#fff',
    padding: 8,
    marginLeft: 10,
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
  avatarSmall: {
    width: actuatedNormalize(30),
    height: actuatedNormalize(30),
    borderRadius: actuatedNormalize(15),
    marginLeft:actuatedNormalize(10)
    // marginRight: actuatedNormalize(10),
  },
  messageContainer: {
    width: "65%",
    marginVertical: 3,
    marginHorizontal: 16,
    paddingVertical: 10,
    flexDirection: "row",
    borderRadius: 5,
  },
  leftMessageArrow: {
    height: 0,
    width: 0,
    borderLeftWidth: 10,
    borderLeftColor: "transparent",
    borderTopColor: colors.lightGray,
    borderTopWidth: 10,
    alignSelf: "flex-start",
    borderRightColor: "black",
    right: 10,
    bottom: 10,
  },

  timeAndReadContainer: {
    flexDirection: "row",
  },
  timeText: {
    fontSize: 12,
    color: colors.gray,
  },
  rightMsgArrow: {
    height: 0,
    width: 0,
    borderRightWidth: 10,
    borderRightColor: "transparent",
    borderTopColor: colors.green2,
    borderTopWidth: 10,
    alignSelf: "flex-start",
    left: 6,
    bottom: 10,
  },
  dateHeader: {
    backgroundColor: colors.primary,
    width: actuatedNormalize(100),
    padding: actuatedNormalize(10),
    borderRadius: actuatedNormalize(20),
    alignSelf: "center",
    alignItems: 'center',
    marginVertical: actuatedNormalize(10),
  },
  dateHeaderText: {
    fontSize: actuatedNormalize(12),
    color: colors.white,
    fontFamily: fonts.NexaItalic
  },
});

export default ChatWindowScreen;
