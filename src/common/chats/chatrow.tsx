import React, { useRef } from 'react';
import { Text, View, Image, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import Animated, { Extrapolation, FadeInUp, FadeOutUp, SharedValue, interpolate, useAnimatedStyle } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import { Badge } from 'react-native-paper';
import { actuatedNormalize } from '../../constants/PixelScaling';
import colors from '../../constants/colors'; // Ensure this path is correct
import { ActiveUserList, ChatList } from '../../redux/messageSlice';
import { UserInterface } from '../../redux/uiSlice';
import AppleStyleSwipeableRow from '../animation/swipeable';
import { defaultStyles } from '../styles/defaultstyles';
import { StyleProp } from 'react-native';
import { fonts } from '../../constants/fonts';
import { formatDateTime } from '../../utils/formatedateTime';
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../AppNavigation/navigatorType';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Swipeable } from 'react-native-gesture-handler';


const ITEM_SIZE = 80
interface ChatRowProps {
  item: ChatList;
  index: number;
  user: UserInterface | null;
  animatedRowStyles:StyleProp<ViewStyle>;
  typingUser: { userData: {_id:string}, typingState: boolean }[] | undefined;
  activeUserList: ActiveUserList[];
  navigation: NativeStackNavigationProp<RootStackParamList>;
  scrollY:SharedValue<number>;
  handleRightActions: (text: string, item: ChatList) => void;
}

const ChatRow: React.FC<ChatRowProps> = ({ scrollY,item, index, user, typingUser, activeUserList, navigation,animatedRowStyles, handleRightActions }) => {
  const newMessageIds: any[] = [];
  const swipeableRow = useRef<Swipeable>(null);

  const listanimatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(scrollY.value, [-1, 0, ITEM_SIZE * index, ITEM_SIZE * (index + 2)], [1, 1, 1, 0], Extrapolation.CLAMP);
    const opacity = interpolate(scrollY.value, [-1, 0, ITEM_SIZE * index, ITEM_SIZE * (index + 1)], [1, 1, 1, 0], Extrapolation.CLAMP);
    console.log("hey------>",scale,opacity)

    return {
      transform: [{ scale }],
      opacity,
    };
  });
  
  const FindSender = () => {
    item.allMessages.forEach((el) => {
      if (el?.receiverId === user?._id && el?.isRead === false) {
        newMessageIds.push(el?._id);
      }
    });
  };

  FindSender();

  const meTypingornot = typingUser?.find((el)=>el.userData._id === item.chatPartner._id)?.typingState || false

  const userActions = item.isBlockedBy.includes(user?._id as string) && item.isBlocked
    ? [{ name: "Delete", text: "Delete", color: colors.red, width: 192 }, { name: item.isBlocked ? "Unblock" : "Block", text: item.isBlocked ? "Unblock" : "Block", color: colors.bag9Bg, width: 128 }]
    : item.isBlockedBy.length === 0
    ? [{ name: "Delete", text: "Delete", color: colors.red, width: 192 }, { name: "Block", text: "Block", color: colors.bag9Bg, width: 128 }]
    : [{ name: "Delete", text: "Delete", color: colors.red, width: 192 }];

  const socketId = activeUserList?.find((el) => el?.userId?._id === item?.chatPartner?._id);

  const handleLongPress = ()=>{
    swipeableRow.current?.openRight()
  }
  return (
    <AppleStyleSwipeableRow swipeableRow={swipeableRow} item={item} actions={userActions} pressHandler={handleRightActions}>
      <Animated.View
      
        entering={FadeInUp.delay(index * 20)}
        exiting={FadeOutUp}
        style={[listanimatedStyle,{ flexDirection: 'row', alignItems: 'center' }]}
      >
        <Animated.View
          style={[defaultStyles.item, { paddingLeft: 20 }, animatedRowStyles]}
        >
          <TouchableOpacity onLongPress={handleLongPress} style={{
            flexDirection: "row", paddingLeft: 20, alignItems: 'center'
          }} onPress={() => {
            navigation.navigate('ChatWindow', {
              socketId: socketId?.socketId,
              userDetails: item.chatPartner,
              Chats: item,
              senderUserId: null
            });
          }}>
            <Image source={{ uri: item?.chatPartner?.profilePic }} style={styles.avatar} />
            <View style={styles.chatDetails}>
              <Text style={styles.chatName}>{item?.chatPartner?.name}</Text>
              {
                meTypingornot
                  ? <Text style={[styles.chatName, { color: colors.darkprimary, fontSize: actuatedNormalize(12) }]}>Typing...</Text>
                  : <View style={{ flexDirection: 'row', columnGap: actuatedNormalize(10), alignItems: 'center', marginTop: actuatedNormalize(5) }}>
                    <Text numberOfLines={1} style={[styles.lastMessage,{fontFamily:item?.ChatHistorydeletedby?.includes(user?._id as string) ? fonts.NexaItalic:fonts.NexaRegular}]}>{item?.ChatHistorydeletedby?.includes(user?._id as string) ? "Messages deleted" : item?.allMessages[item.allMessages?.length - 1]?.message || ""}</Text>
                    {newMessageIds?.length > 0 && (
                      <Badge size={20} style={{ backgroundColor: colors.primary, color: colors.white, fontFamily: fonts.NexaXBold }}>
                        {newMessageIds?.length}
                      </Badge>
                    )}
                  </View>
              }
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.timestamp}>{item?.ChatHistorydeletedby?.includes(user?._id as string) ? "" : item?.allMessages[item?.allMessages?.length - 1]?.createdAt ? formatDateTime(item?.allMessages[item?.allMessages?.length - 1]?.createdAt, 'Date_time') : "" }</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </AppleStyleSwipeableRow>
  );
};

const styles = StyleSheet.create({
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
     maxWidth: "75%"
  },
  timestamp: {
    color: colors.gray,
    fontSize: actuatedNormalize(12),
    fontFamily:fonts.NexaRegular
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
  // add defaultStyles and animatedRowStyles if needed
});

export default React.memo(ChatRow);
