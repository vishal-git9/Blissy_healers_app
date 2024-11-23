import React, { useRef, ReactNode } from 'react';
import { Animated, StyleSheet, Text, View, I18nManager, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RectButton } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import colors from '../../constants/colors';
import { fonts } from '../../constants/fonts';
import { ChatList } from '../../redux/messageSlice';

interface actionType {
  name:string;
  text:string;
  color:string;
  width:number;
}

interface AppleStyleSwipeableRowProps {
  children: ReactNode;
  pressHandler: (action: string,item:ChatList) => void;
  actions:actionType[];
  item:ChatList;
  swipeableRow:React.RefObject<Swipeable>
}

const AppleStyleSwipeableRow: React.FC<AppleStyleSwipeableRowProps> = ({swipeableRow, children,item, pressHandler,actions }) => {

  const renderRightAction = (
    text: string,
    color: string,
    x: number,
    item:ChatList,
    progress: Animated.AnimatedInterpolation<number>
  ) => {
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [x, 0],
    });

    return (
      <Animated.View key={color} style={{ flex: 1, transform: [{ translateX: trans }] }}>
        <RectButton style={[styles.rightAction, { backgroundColor: color, }]} onPress={() => {
          close()
          pressHandler(text,item)}
      }>
          <Ionicons
            name={text === 'Delete' ? 'trash' : 'ban'}
            size={30}
            color={colors.white}
            style={{ paddingTop: 10 }}
          />
          <Text style={styles.actionText}>{text}</Text>
        </RectButton>
      </Animated.View>
    );
  };

  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    _dragAnimatedValue: Animated.AnimatedInterpolation<number>
  ) => (
    <View
      style={{
        width: 192,
        flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
      }}
    >
      {actions.map((el)=> {
        return renderRightAction(el.name, el.color, el.width,item, progress)
      })}
      {}
      {/* {renderRightAction(actions[1].name, colors.bag9Bg, 128,item, progress)} */}
    </View>                // props.navigation.popToTop()

  );

  const close = () => {
    swipeableRow.current?.close();
  };

  return (
    <Swipeable
      ref={swipeableRow}
      friction={2}
      overshootRight={false}
      enableTrackpadTwoFingerGesture
      rightThreshold={40}
      renderRightActions={renderRightActions}
      onSwipeableOpen={(direction) => {
        console.log(`Opening swipeable from the ${direction}`);
      }}
      onSwipeableClose={(direction) => {
        console.log(`Closing swipeable to the ${direction}`);
      }}
    >
      {/* <TouchableOpacity onLongPress={()=>console.log("longpressed")}> */}
        {children}
      {/* </TouchableOpacity> */}
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  leftAction: {
    flex: 1,
    backgroundColor: '#497AFC',
    justifyContent: 'center',
  },
  actionText: {
    color: 'white',
    fontSize: 16,
    backgroundColor: 'transparent',
    padding: 10,
    fontFamily: fonts.NexaRegular,
  },
  rightAction: {
    alignItems: 'center',
    flex: 1,
    // borderRadius:30,
    justifyContent: 'center',
  },
});

export default AppleStyleSwipeableRow;
