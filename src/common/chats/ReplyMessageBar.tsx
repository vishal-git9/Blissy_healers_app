import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { IMessage } from 'react-native-gifted-chat';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import colors from '../../constants/colors';
import Ionicons from "react-native-vector-icons/Ionicons"
import { fonts } from '../../constants/fonts';

type ReplyMessageBarProps = {
  clearReply: () => void;
  message: IMessage | null;
};

const ReplyMessageBar = ({ clearReply, message }: ReplyMessageBarProps) => {
  return (
    <>
      {message !== null && (
        <Animated.View
          style={{ height: 50,marginBottom:10,borderBottomLeftRadius:10,borderBottomRightRadius:10, // Updated for rounded corners
            flexDirection: 'row',width:"100%",alignSelf:"flex-start", backgroundColor: '#E4E9EB' }}
          entering={FadeInDown}
          exiting={FadeOutDown}>
          <View style={{ height: 50, width: 6, backgroundColor: colors.primary,borderBottomLeftRadius:10 }}></View>
          <View style={{ flexDirection: 'column' }}>
            <Text
              style={{
                color: colors.primary,
                paddingLeft: 10,
                paddingTop: 5,
                fontFamily:fonts.NexaBold,
                fontSize: 15,
              }}>
              {message?.user.name}
            </Text>
            <Text style={{ color: colors.gray, paddingLeft: 10, paddingTop: 5 ,fontFamily:fonts.NexaRegular}}>
              {message!.text.length > 40 ? message?.text.substring(0, 35) + '...' : message?.text}
            </Text>
          </View>
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end', paddingRight: 10 }}>
            <TouchableOpacity onPress={clearReply}>
              <Ionicons name="close-circle-outline" color={colors.primary} size={28} />
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </>
  );
};

export default ReplyMessageBar;
