import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import { IMessage, Message, MessageProps } from 'react-native-gifted-chat';
import { isSameDay, isSameUser } from 'react-native-gifted-chat/lib/utils';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import colors from '../../constants/colors';
import { Text } from 'react-native';
import { useSelector } from 'react-redux';
import { AuthSelector } from '../../redux/uiSlice';
type ChatMessageBoxProps = {
  setReplyOnSwipeOpen: (message: IMessage) => void;
  updateRowRef: (ref: any) => void;
} & MessageProps<IMessage>;

const ChatMessageBox = ({ setReplyOnSwipeOpen, updateRowRef, ...props }: ChatMessageBoxProps) => {
  const isNextMyMessage =
    props.currentMessage &&
    props.nextMessage &&
    isSameUser(props.currentMessage, props.nextMessage) &&
    isSameDay(props.currentMessage, props.nextMessage);

    const { socket, user } = useSelector(AuthSelector);


  const renderRightAction = (progressAnimatedValue: Animated.AnimatedInterpolation<any>) => {
    const size = progressAnimatedValue.interpolate({
      inputRange: [0, 1, 100],
      outputRange: [0, 1, 1],
    });
    const trans = progressAnimatedValue.interpolate({
      inputRange: [0, 1, 2],
      outputRange: [0, 12, 20],
    });

    return (
      <Animated.View
        style={[
          styles.container,
          { transform: [{ scale: size }, { translateX: trans }] },
          isNextMyMessage ? styles.defaultBottomOffset : styles.bottomOffsetNext,
          props.position === 'right' && styles.leftOffsetValue,
        ]}>
        <View style={styles.replyImageWrapper}>
          <MaterialCommunityIcons name="reply-circle" size={26} color={colors.gray} />
        </View>
      </Animated.View>
    );
  };

  const onSwipeOpenAction = () => {
    if (props.currentMessage) {
      setReplyOnSwipeOpen({ ...props.currentMessage });
    }
  };

  // const CustomMessageText = props => {
  //   console.log(props,"props----->")
  //   return (
  //     <>
  //       <View style={[[
  //             props?.currentMessage?.isReply?.user?._id === user?._id ? { alignSelf: 'flex-end' } : { alignSelf: 'flex-start' },
  //           ],{ padding: 5 ,borderRadius:10,maxHeight:100,width:"50%",backgroundColor:colors.primary}]}>
  //         <View style={{ backgroundColor: colors.greenAlpha, borderRadius: 15 }}>
  //           <View style={{ flexDirection: 'row' }}>
  //             <View
  //               style={{
  //                 height: '100%',
  //                 width: 10,
  //                 backgroundColor: colors.gray,
  //                 borderTopLeftRadius: 15,
  //                 borderBottomLeftRadius: 15,
  //               }}
  //             />
  //             <View style={{ flexDirection: 'column' }}>
  //               <Text
  //                 style={{
  //                   color: 'white',
  //                   paddingHorizontal: 10,
  //                   paddingTop: 5,
  //                   fontWeight: '700',
  //                 }}>
  //                 {props.currentMessage?.isReply?.user?.name}
  //               </Text>
  //               <Text
  //                 style={{
  //                   color: 'white',
  //                   paddingHorizontal: 10,
  //                   paddingTop: 5,
  //                   marginBottom: 5,
  //                 }}>
  //                 {props.currentMessage?.isReply?.text}
  //               </Text>
  //             </View>
  //           </View>
  //         </View>
  //         <Text style={{color:colors.white}}>Replied text</Text>
  //       </View>

  //       <Message {...props} />
  //     </>
  //   );
  // };


  return (
    <GestureHandlerRootView>
      {/* <Swipeable
        ref={updateRowRef}
        friction={2}
        rightThreshold={40}
        renderLeftActions={renderRightAction}
        onSwipeableWillOpen={onSwipeOpenAction}> */}
        <Message {...props}/>
      {/* </Swipeable> */}
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 40,
  },
  replyImageWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  replyImage: {
    width: 20,
    height: 20,
  },
  defaultBottomOffset: {
    marginBottom: 2,
  },
  bottomOffsetNext: {
    marginBottom: 10,
  },
  leftOffsetValue: {
    marginLeft: 16,
  },
});

export default ChatMessageBox;
