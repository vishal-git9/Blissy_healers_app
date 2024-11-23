import {
    FlatList,
    StyleSheet,
    TouchableWithoutFeedback,
    useWindowDimensions,
  } from 'react-native';
  import React from 'react';
  import Animated, {
    AnimatedRef,
    SharedTransition,
    SharedValue,
    interpolateColor,
    useAnimatedStyle,
    withSpring,
    withTiming,
  } from 'react-native-reanimated';
  import {OnboardingData} from '../../mockdata/preloginData';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../AppNavigation/navigatorType';
  
  type Props = {
    dataLength: number;
    flatListIndex: SharedValue<number>;
    flatListRef: AnimatedRef<FlatList<OnboardingData>>;
    x: SharedValue<number>;
    navigation:NativeStackNavigationProp<RootStackParamList>
  };
  
  const CustomButton = ({flatListRef, flatListIndex, dataLength, x,navigation}: Props) => {
    const {width: SCREEN_WIDTH} = useWindowDimensions();
    const buttonAnimationStyle = useAnimatedStyle(() => {
      return {
        width:
          flatListIndex.value === dataLength - 1
            ? withSpring(140)
            : withSpring(60),
        height: 60,
      };
    });
  
    const arrowAnimationStyle = useAnimatedStyle(() => {
      return {
        width: 20,
        height: 20,
        opacity:
          flatListIndex.value === dataLength - 1 ? withTiming(0) : withTiming(1),
        transform: [
          {
            translateX:
              flatListIndex.value === dataLength - 1
                ? withTiming(100)
                : withTiming(0),
          },
        ],
      };
    });
  
    const textAnimationStyle = useAnimatedStyle(() => {
      return {
        opacity:
          flatListIndex.value === dataLength - 1 ? withTiming(1) : withTiming(0),
        transform: [
          {
            translateX:
              flatListIndex.value === dataLength - 1
                ? withTiming(0)
                : withTiming(-100),
          },
        ],
      };
    });
    const animatedColor = useAnimatedStyle(() => {
      const backgroundColor = interpolateColor(
        x.value,
        [0, SCREEN_WIDTH, 2 * SCREEN_WIDTH],
        // ['#005b4f', '#1e2169', '#F15937'],
        ['#ffffff', '#ffffff', '#ffffff'],
      );
  
      return {
        backgroundColor: backgroundColor,
      };
    });
  
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          if (flatListIndex.value < dataLength - 1) {
            flatListRef.current?.scrollToIndex({index: flatListIndex.value + 1});
          } else {
            navigation.navigate('Login');
          }
        }}>
        <Animated.View sharedTransitionTag='getStarted'
          style={[styles.container, buttonAnimationStyle, animatedColor]}>
          <Animated.Text style={[styles.textButton, textAnimationStyle]}>
            Get Started
          </Animated.Text>
           <Animated.Image
            source={require('../../../assets/right-arrow.png')}
            style={[styles.arrow, arrowAnimationStyle]}
          /> 

        </Animated.View>
      </TouchableWithoutFeedback>
    );
  };
  
  export default CustomButton;
  
  const styles = StyleSheet.create({
    container: {
      backgroundColor: 'white',
      padding: 10,
      borderRadius: 100,
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
    },
    arrow: {
      position: 'absolute',
    },
    textButton: {color: 'black', fontSize: 16, position: 'absolute'},
  });