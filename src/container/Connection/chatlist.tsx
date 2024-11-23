// ChatListScreen.tsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationStackProps } from '../Prelogin/onboarding';
import colors from '../../constants/colors';
import { RouteBackButton } from '../../common/button/BackButton';
import { Image } from 'react-native';
import { actuatedNormalize } from '../../constants/PixelScaling';
import { fonts } from '../../constants/fonts';
import { Badge, Searchbar, Snackbar, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import Animated, {
  CurvedTransition,
  FadeInUp,
  FadeOutUp,
  SlideInUp,
  SlideOutLeft,
  runOnJS,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Ionicons from "react-native-vector-icons/Ionicons"
import {
  ActiveUserListSelector,
  ActiveUserSelector,
  BlockedUserSelector,
  ChatList,
  Message,
  MessageSelector,
  addMessage,
  chatListSelector,
  getActiveUserList,
  newMessagesSelector,
  pushChatlist
} from '../../redux/messageSlice';
import { AuthSelector, UserInterface } from '../../redux/uiSlice';
import { formatDateTime } from '../../utils/formatedateTime';
import ChatItemSkeleton from '../../common/loader/skeleton';
import { Empty } from '../../common/Empty/Empty';
import moment from 'moment';
import AppleStyleSwipeableRow from '../../common/animation/swipeable';
import { useBlockUserMutation, useDeleteUserMutation, useGetChatlistQuery, useLazyGetChatlistQuery, useUnblockUserMutation } from '../../api/chatService';
import { BlissyLoader } from '../../common/loader/blissy';
import PullToRefresh from '../../common/refresh/pull';
import { SegmentedControl } from '../../common/tab/segmented';
import { ScrollView } from 'react-native';
import { defaultStyles } from '../../common/styles/defaultstyles';
import SearchBar from '../../common/header/searchbar';
import Chatrow from '../../common/chats/chatrow';
import { findNewMessage } from '../../utils/sortmessagebyData';
import useBackHandler from '../../hooks/usebackhandler';
interface AlertMessage {
  show: boolean;
  message: string;
}

const transition = CurvedTransition.delay(100)

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const ChatListScreen: React.FC<NavigationStackProps> = ({ navigation }) => {
  const newMessages = useSelector(MessageSelector);
  const chatlistdata = useSelector(chatListSelector);
  const BlockedUsers = useSelector(BlockedUserSelector)
  const ActiveUsers = useSelector(ActiveUserSelector)
  const { socket, user } = useSelector(AuthSelector);
  const loadItems = useRef<any[]>(new Array(5).fill(0));
  const [chatData, setChatData] = useState<ChatList[]>(ActiveUsers)
  const [searchQueryData, setsearchQueryData] = useState<ChatList[]>(chatlistdata)
  const [searchQuerytext, SetsearchQuerytext] = useState<string>("")
  const [selectedOption, setSelectedOption] = useState('Active');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isScrollable, setIsScrollable] = useState(false);
  const [containerHeight, setContainerHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);

  const [AlertMessage, setAlertMessage] = useState<AlertMessage>({ show: false, message: "" })
  const [refetch,{ isError, isLoading, isSuccess }] = useLazyGetChatlistQuery()
  const [deleteUser, { isLoading: isdeleteloading, isError: isdeleteerror, isSuccess: isdeletesccuess }] = useDeleteUserMutation()
  const [typingUser, setTypingUser] = useState<{ userData: UserInterface, typingState: boolean }[]>([])
  const [blockUser, { isLoading: isblockloading, isError: isblockerror, isSuccess: isblocksccuess }] = useBlockUserMutation()
  const [UnblockUser, { isLoading: isunblockloading, isError: isunblockerror, isSuccess: isunblocksccuess }] = useUnblockUserMutation()
  const { activeUserList } = useSelector(ActiveUserListSelector);
  const editing = useSharedValue(-30);
  const height = useSharedValue(100);
  const scrollRef = useAnimatedRef<Animated.FlatList<any>>();
  const scrollY = useSharedValue(0);
  const ITEM_HEIGHT = 40; // Example item height
  const dispatch = useDispatch();
  const theme = useTheme()


  // calling use backhandler
  useBackHandler()


  const updatePanState = (offset: number) => {
    'worklet';
    if (offset > 0) {
      runOnJS(setIsScrollable)(true);
    } else {
      runOnJS(setIsScrollable)(false);
    }
  };



  const handleOnScroll = useAnimatedScrollHandler({
    onScroll({ contentOffset }) {
      console.log(contentOffset.y, "contentOffset.y----->")
      updatePanState(contentOffset.y);
      scrollY.value = contentOffset.y;
    },
  });


  React.useEffect(() => {
    console.log("hi-->", isSearchActive)
    if (isSearchActive) {
      navigation.setOptions({
        headerShown: false,
        // headerRight:()=><Searchbar value='bar'/>
      });
    } else {
      navigation.setOptions({
        headerShown: true,

        // headerRight:()=><Searchbar value='bar'/>
      });
    }
  }, [navigation, isSearchActive]);

  console.log("isSearchActive-->", isSearchActive)

  const onSegmentChange = (option: string) => {
    setSelectedOption(option);
  };

  const handleSearchFriendsQuery = useCallback((text: string) => {
    console.log(text, 'text---->')
    SetsearchQuerytext(text)
    const Searchfiltered = chatlistdata.filter(user =>
      user.chatPartner.name.toLowerCase().startsWith(text.toLowerCase())
    );
    setsearchQueryData(Searchfiltered)
  }, [selectedOption, searchQuerytext])

  const animatedRowStyles = useAnimatedStyle(() => ({
    transform: [{ translateX: withTiming(editing.value) }],
  }));

  const animatedPosition = useAnimatedStyle(() => ({
    transform: [{ translateX: withTiming(editing.value) }],
  }));


  const onLayout = (event: { nativeEvent: { layout: { height: any; }; }; }) => {
    console.log(event.nativeEvent.layout.height, "height------>")
    const { height } = event.nativeEvent.layout;
    setContainerHeight(Math.ceil(height));
  };

  // const checkIfScrollable = useCallback(() => {
  //   const totalItemsHeight = chatlistdata.length * ITEM_HEIGHT;
  //   console.log(totalItemsHeight,containerHeight,"totalItemsHeight----->")
  //   setIsScrollable(totalItemsHeight > containerHeight);
  // },[containerHeight]);

  useEffect(() => {
    height.value = withTiming(isSearchActive ? 50 : 100, { duration: 500 }, (finished) => {
      if (finished) {
        // runOnJS(setHeightIncreased)(true);
      }
    });
  }, [isSearchActive]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: height.value,
    };
  });

  const RefreshNewMessages = async () => {
    await refetch({},false) // after getting refreshed chatlist
    // findNewMessage() // sort by new messages
  }


  //   const getnewChatlistData = useMemo(() => {
  //     const MessageData = chatlistdata?.filter((el) => {
  //       if (el.ChatHistorydeletedby && el.ChatHistorydeletedby?.length > 0) {
  //         el.ChatHistorydeletedby[0] !== user?._id || el.ChatHistorydeletedby[1] !== user._id
  //       } else {
  //         return el
  //       }
  //       // if(el.)
  //     })
  // },[chatlistdata])






  // handling swipe right actions on chatlist

  const handleRightActions = useCallback(async (text: string, item: ChatList) => {
    if (text === "Delete") {
      // make delete api call
      try {
        await deleteUser(item.chatPartner._id);
        await refetch({},false)
        setAlertMessage({ show: true, message: "User Deleted" });
      } catch (error) {
        console.log(error);
      }
    } else if (text === "Block") {
      // make block api call
      try {
        await blockUser(item.chatPartner._id);
        await refetch({},false)
        setAlertMessage({ show: true, message: "User Blocked" });
      } catch (error) {
        console.log(error);
      }
    } else if (text === "Unblock") {
      // make unblock api call
      try {
        await UnblockUser(item.chatPartner._id);
        await refetch({},false)
        setAlertMessage({ show: true, message: "User Unblocked" });
        // const filteredData = chatlistdata.filter((el)=>el.isBlocked === true)
        // setChatData(filteredData)  
      } catch (error) {
        console.log(error);
      }
    }
  }, [chatlistdata, selectedOption, setAlertMessage]);

  const renderChatlistData = useCallback(() => {

    if (!isSearchActive) {
      if (selectedOption === "Active") {
        return ActiveUsers
      } else {
        return BlockedUsers
      }
    } else {
      return searchQueryData
    }

  }, [isSearchActive, chatlistdata, selectedOption, searchQueryData])

  const handleTypingUserStates = useCallback((data: { userData: UserInterface, typingState: boolean }) => {
    setTypingUser(prevTypingUser => {
      const userIndex = prevTypingUser.findIndex(el => el.userData._id === data.userData._id);
      if (userIndex !== -1) {
        // If the user is already in the list
        if (prevTypingUser[userIndex].typingState !== data.typingState) {
          // If typing state has changed, update the user's typing state
          const updatedTypingUser = [...prevTypingUser];
          updatedTypingUser[userIndex] = data;
          return updatedTypingUser;
        } else {
          // If typing state hasn't changed, return the original array
          return prevTypingUser;
        }
      } else {
        // If the user is not in the list, add the new data
        return [...prevTypingUser, data];
      }
    });
  }, [activeUserList, typingUser]);



  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      console.log("I am focussed----->")
      socket?.on('notify_typing_state', data => {
        console.log(data, "Dataof typing user")
        handleTypingUserStates(data)
      });
    });
    return ()=> {
      socket?.off("notify_typing_state")
      unsubscribe()
    }
  }, [navigation]);


  // console.log(typingUser, "typinguser------->")


  // const AvatarWithBanIcon = ({ item }: { item: ChatList }) => (
  //   <View style={styles.avatarContainer}>
  //     <Image source={{ uri: item.chatPartner.profilePic }} style={styles.avatar} />
  //     {item.isBlocked && (
  //       <Ionicons
  //         name={'ban'}
  //         size={50}
  //         color={colors.darkRed}
  //         style={styles.banIcon}
  //       />
  //     )}
  //   </View>
  // );


  // const renderCell = React.useCallback(
  //   (props: any) => (
  //     <Animated.View
  //       {...props}
  //       layout={transition}
  //       entering={FadeInUp}
  //       exiting={FadeOutUp} />
  //   ),
  //   [],
  // );

  // const renderChatItem = ({ item, index }: { item: ChatList, index: number }) => {
  //   const newMessageIds: any[] = [];
  //   const FindSender = () => {
  //     item.allMessages.forEach((el) => {
  //       if (el?.receiverId === user?._id && el?.isRead === false) {
  //         newMessageIds.push(el?._id);
  //         return;
  //       }
  //       return;
  //     });
  //   };

  //   FindSender();

  //   const userActions = item.isBlockedBy.includes(user?._id as string) && item.isBlocked ? [{ name: "Delete", text: "Delete", color: colors.red, width: 192 }, { name: item.isBlocked ? "Unblock" : "Block", text: item.isBlocked ? "Unblock" : "Block", color: colors.bag9Bg, width: 128 }] : item.isBlockedBy.length === 0 ? [{ name: "Delete", text: "Delete", color: colors.red, width: 192 }, { name: "Block", text: "Block", color: colors.bag9Bg, width: 128 }] : [{ name: "Delete", text: "Delete", color: colors.red, width: 192 }]


  //   const socketId = activeUserList?.find((el) => el?.userId?._id === item?.chatPartner?._id);

  //   return (
  //     <AppleStyleSwipeableRow item={item} actions={userActions} pressHandler={handleRightActions}>
  //       <Animated.View
  //         entering={FadeInUp.delay(index * 20)}
  //         exiting={FadeOutUp}
  //         style={{ flexDirection: 'row', alignItems: 'center' }}
  //       >
  //         {/* <AnimatedTouchableOpacity
  //                         style={[animatedPosition, { paddingLeft: 8 }]}
  //                         onPress={() => removeCall(item)}
  //                       >
  //                         <Ionicons name="remove-circle" size={24} color={colors.red} />
  //                       </AnimatedTouchableOpacity> */}
  //         <Animated.View
  //           style={[defaultStyles.item, { paddingLeft: 20 }, animatedRowStyles]}
  //         >
  //           <AnimatedTouchableOpacity style={{
  //             flexDirection: "row", paddingLeft: 20, alignItems: 'center'
  //           }} onPress={() => {
  //             navigation.navigate('ChatWindow', {
  //               socketId: socketId?.socketId,
  //               userDetails: item.chatPartner,
  //               Chats: item,
  //               senderUserId: null
  //             });
  //           }}>
  //             <Image source={{ uri: item.chatPartner.profilePic }} style={styles.avatar} />
  //             <View style={styles.chatDetails}>
  //               <Text style={styles.chatName}>{item.chatPartner.name}</Text>

  //               {/* isusertyping or not */}
  //               {
  //                 (typingUser?.typingState && typingUser?.userData._id === item.chatPartner._id) ? <Text style={[styles.chatName, { color: colors.darkprimary, fontSize: actuatedNormalize(12) }]}>Typing...</Text> : <View style={{ flexDirection: 'row', columnGap: actuatedNormalize(10), alignItems: 'center', marginTop: actuatedNormalize(5) }}>
  //                   <Text numberOfLines={1} style={styles.lastMessage}>{item.allMessages[item.allMessages?.length - 1]?.message || ""}</Text>
  //                   {newMessageIds?.length > 0 && (
  //                     <Badge size={20} style={{ backgroundColor: colors.primary, color: colors.white, fontFamily: fonts.NexaXBold }}>
  //                       {newMessageIds?.length}
  //                     </Badge>
  //                   )}
  //                 </View>
  //               }
  //             </View>
  //             <View style={{ flexDirection: 'row', alignItems: 'center' }}>
  //               <Text style={styles.timestamp}>{item?.allMessages[item?.allMessages?.length - 1]?.createdAt ? formatDateTime(item?.allMessages[item?.allMessages?.length - 1]?.createdAt, 'Date_time') : ""}</Text>
  //               {/* <Ionicons name="information-circle-outline" size={24} color={colors.primary} /> */}
  //             </View>
  //           </AnimatedTouchableOpacity>
  //         </Animated.View>
  //       </Animated.View>
  //       {/* <TouchableOpacity
  //         style={[styles.chatItem, { borderLeftColor: item.isBlocked ? colors.red : colors.darkprimary, borderLeftWidth: 2 }]}
  //         onPress={() => {
  //           navigation.navigate('ChatWindow', {
  //             socketId: socketId?.socketId,
  //             userDetails: item.chatPartner,
  //             Chats: item,
  //             senderUserId: null
  //           });
  //         }}
  //       >
  //         {item.isBlocked ? <AvatarWithBanIcon item={item} /> : <Image source={{ uri: item.chatPartner.profilePic }} style={styles.avatar} />
  //         }
  //         <View style={styles.chatDetails}>
  //           <Text style={styles.chatName}>{item.chatPartner.name}</Text>
  //           {
  //             (typingUser?.typingState && typingUser?.userData._id === item.chatPartner._id) ? <Text style={[styles.chatName, { color: colors.darkprimary, fontSize: actuatedNormalize(12) }]}>Typing...</Text> : <View style={{ flexDirection: 'row', columnGap: actuatedNormalize(10), alignItems: 'center', marginTop: actuatedNormalize(5) }}>
  //               <Text numberOfLines={1} style={styles.lastMessage}>{item.allMessages[item.allMessages?.length - 1]?.message || ""}</Text>
  //               {newMessageIds?.length > 0 && (
  //                 <Badge size={20} style={{ backgroundColor: colors.primary, color: colors.white, fontFamily: fonts.NexaXBold }}>
  //                   {newMessageIds?.length}
  //                 </Badge>
  //               )}
  //             </View>
  //           }
  //         </View>
  //         <Text style={styles.timestamp}>{item?.allMessages[item?.allMessages?.length - 1]?.createdAt ? formatDateTime(item?.allMessages[item?.allMessages?.length - 1]?.createdAt, 'Date_time') : ""}</Text>
  //       </TouchableOpacity> */}
  //     </AppleStyleSwipeableRow>
  //   );
  // };

  console.log(height.value, "isScrollable-----")

  return (
    <View style={styles.container}>
      {/* <RouteBackButton onPress={() => navigation.goBack()} />
      <Text style={{ color: colors.white, alignSelf: 'center', fontFamily: fonts.NexaBold, fontSize: actuatedNormalize(23), marginTop: actuatedNormalize(20) }}>
        Chats
      </Text> */}
      <View style={[styles.header]}>
        <Animated.View style={[animatedStyle]}>
          <SearchBar height={height.value} querytext={searchQuerytext} isSearchActive={isSearchActive} setIsSearchActive={setIsSearchActive} onSearch={handleSearchFriendsQuery} />
        </Animated.View>
        {
          !isSearchActive && <SegmentedControl
            options={['Active', 'Blocked']}
            selectedOption={selectedOption}
            onOptionPress={onSegmentChange}
          />
        }

        {/* <TouchableOpacity onPress={onEdit}>
          <Text style={{ color: colors.white, fontSize: actuatedNormalize(18),fontFamily:fonts.NexaRegular }}>
            {isEditing ? 'Done' : 'Edit'}
          </Text>
        </TouchableOpacity> */}
      </View>
      {/* Icons can be added here */}
      {/* <SearchBar onSearch={handleSearchFriendsQuery} /> */}
      {
        <PullToRefresh handleOnscroll={handleOnScroll} isScrollable={isScrollable} scrollRef={scrollRef} setIsScrollable={setIsScrollable} updatePanState={updatePanState} refreshing={false} onRefresh={RefreshNewMessages}>
            {/* <ScrollView
              contentInsetAdjustmentBehavior="automatic"
              contentContainerStyle={{marginTop:isSearchActive ? actuatedNormalize(20) : actuatedNormalize(5)}} nestedScrollEnabled={true}>
              <Animated.View onLayout={onLayout}
                style={[defaultStyles.block, { borderTopColor: colors.lightGray, borderWidth: 2, width: "100%", alignSelf: "center" }]} layout={transition}> */}
            <Animated.FlatList
              skipEnteringExitingAnimations
              itemLayoutAnimation={transition}
              ref={scrollRef}
              scrollEventThrottle={16}
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled={true}
              onScroll={handleOnScroll}
              scrollEnabled={true}
              data={renderChatlistData()}
              contentContainerStyle={{ minHeight: contentHeight, marginTop: isSearchActive ? actuatedNormalize(10) : actuatedNormalize(0) }}
              onContentSizeChange={(w, h) => setContentHeight(h)}
              onMomentumScrollEnd={(e) => updatePanState(e.nativeEvent.contentOffset.y)}
              // onContentSizeChange={checkIfScrollable}
              renderItem={({ item, index }) => <Chatrow activeUserList={activeUserList} animatedRowStyles={animatedRowStyles} handleRightActions={handleRightActions} index={index} item={item} navigation={navigation} scrollY={scrollY} typingUser={typingUser} user={user} />}
              keyExtractor={(item, index) => item?._id}
              ItemSeparatorComponent={() => (
                <View style={[defaultStyles.separator, { marginLeft: 90 }]} />
              )}
              ListEmptyComponent={ActiveUsers.length === 0 ? <Empty head='Active Users' description='You have no active users' /> : BlockedUsers.length === 0 ? <Empty head='Blocked Users' description='You have no blocked users' /> : <Empty head='Search Users' description='User not found' />}
            // CellRendererComponent={renderCell}
            />
            {/* </Animated.View>
            </ScrollView> */}
          </PullToRefresh>  
        //   : (
        //   <Empty head='Make Friends' description='You have no friends make new friends after every call' />
        // )
      }

      <Snackbar
        duration={2000}
        visible={AlertMessage.show}
        style={{ backgroundColor: colors.dark }}
        onDismiss={() => setAlertMessage({ show: false, message: "" })}
        action={{
          // theme: {
          //   fonts: {
          //     regular: { fontFamily: fonts.NexaRegular },
          //     medium: { fontFamily: fonts.NexaBold },
          //     light: { fontFamily: fonts.NexaBold },
          //     thin: { fontFamily: fonts.NexaRegular },
          //   },
          //   // colors: { inversePrimary: theme.colors.surface, surface: theme.colors.surface, accent: theme.colors.surface }
          // },



          label: 'Okay',
          // textColor: theme.colors.surface,
          labelStyle: { fontFamily: fonts.NexaBold, color: colors.white },
          onPress: () => {
            // Do something
            setAlertMessage({ show: false, message: "" });
          },
        }}
        theme={{
          colors: {
            inverseOnSurface: colors.white,
            surface: colors.white
          },
          fonts: {
                regular: { fontFamily: fonts.NexaRegular },
                medium: { fontFamily: fonts.NexaBold },
                light: { fontFamily: fonts.NexaBold },
                thin: { fontFamily: fonts.NexaRegular },
              },
        }}
      >
        {AlertMessage.message}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: actuatedNormalize(20)
  },
  chatItem: {
    flexDirection: 'row',
    padding: actuatedNormalize(15),
    borderRadius: actuatedNormalize(10),
    borderBottomColor: '#ececec',
    backgroundColor: colors.dark, // Assuming a dark background for each chat item
    alignItems: 'center',
  },
  avatar: {
    width: actuatedNormalize(60),
    height: actuatedNormalize(60),
    borderRadius: actuatedNormalize(30), // Makes it circular
    marginRight: actuatedNormalize(15),
  },
  avatarContainer: {
    position: 'relative',
    width: 60, // adjust to your needs
    height: 60, // adjust to your needs
    marginRight: actuatedNormalize(15),
    justifyContent: "center",
    alignItems: "center"

  },
  // avatar: {
  //   width: '100%',
  //   height: '100%',
  //   borderRadius: 25, // adjust to make it a circle
  // },
  banIcon: {
    position: 'absolute',
    right: "20%"
    // right: -10,
  },
  chatDetails: {
    flex: 1,
    rowGap: actuatedNormalize(5),
  },
  chatName: {
    fontSize: actuatedNormalize(18),
    color: colors.white,
    fontFamily: fonts.NexaBold,
  },
  lastMessage: {
    color: colors.gray,
    fontSize: actuatedNormalize(14),
    width: "75%"
  },
  timestamp: {
    color: colors.gray,
    fontSize: actuatedNormalize(12),
  },
  header: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    // padding: actuatedNormalize(16),
    rowGap: 10,
    alignItems: "flex-start",
    marginTop: actuatedNormalize(20),
    marginHorizontal: 16,
    // backgroundColor: colors.red,
  },
});

export default ChatListScreen;
