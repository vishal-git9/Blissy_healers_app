import React, { useState, useEffect, SetStateAction, Dispatch } from 'react';
import {
  Text,
  SafeAreaView,
  StyleSheet,
  View,
  ScrollViewProps,
} from 'react-native';
import { GestureHandlerRootView, Gesture, ScrollView, GestureDetector } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import Lottie from 'lottie-react-native';
import Animated, {
  AnimatedRef,
  Extrapolate,
  ScrollHandlerProcessed,
  interpolate,
  runOnJS,
  scrollTo,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { actuatedNormalize } from '../../constants/PixelScaling';
import { fonts } from '../../constants/fonts';
import colors from '../../constants/colors';
type ScrollRef = AnimatedRef<Animated.FlatList<any>> | AnimatedRef<Animated.ScrollView>;

interface PullToRefreshProps {
  children: React.ReactElement<ScrollViewProps>;
  onRefresh: () => void;
  refreshing: boolean;
  handleOnscroll:ScrollHandlerProcessed<Record<string, unknown>>;
  updatePanState:(offset: number)=>void;
  setIsScrollable:Dispatch<SetStateAction<boolean>>;
  isScrollable:boolean;
  scrollRef:ScrollRef;
}

const REFRESH_AREA_HEIGHT = 130;

const PullToRefresh: React.FC<PullToRefreshProps> = ({scrollRef,handleOnscroll,isScrollable,setIsScrollable,updatePanState, children, refreshing, onRefresh }) => {
  const [toggleLottie, setToggleLottie] = useState(false);
  const [gestureActive, setGestureActive] = useState(false);
  // const [isScrollable, setIsScrollable] = useState(false);


  const translationY = useSharedValue(0);
  const startY = useSharedValue(0);
  const pullUpTranslate = useSharedValue(0);
  console.log(startY,"startY---->")

  // const updatePanState = (offset: number) => {
  //   'worklet';
  //   if (offset > 0) {
  //     runOnJS(setIsScrollable)(true);
  //   } else {
  //     runOnJS(setIsScrollable)(false);
  //   }
  // };

  const fetchData = async () => {
    onRefresh();
    setTimeout(() => {
      translationY.value = withTiming(0, { duration: 200 }, () => {
        pullUpTranslate.value = 0;
        runOnJS(setToggleLottie)(false);
      });
    }, 2000);
  };

  useEffect(() => {
    if (!refreshing) {
      translationY.value = withTiming(0, { duration: 200 }, () => {
        pullUpTranslate.value = 0;
        runOnJS(setToggleLottie)(false);
      });
    }
  }, [refreshing]);

  const pullUpAnimation = () => {
    pullUpTranslate.value = withDelay(
      0,
      withTiming(
        pullUpTranslate.value === 0 ? -100 : 0,
        { duration: 200 },
        () => {
          runOnJS(setToggleLottie)(true);
          runOnJS(fetchData)();
        }
      )
    );
  };

  const gestureHandler = Gesture.Pan()
    .onStart(() => {
      startY.value = translationY.value;
      runOnJS(setGestureActive)(true);
    })
    .onUpdate((event) => {
      if (translationY.value >= 0 && !gestureActive) {
        startY.value = translationY.value;
        runOnJS(setGestureActive)(true);
      }
      const total = startY.value + event.translationY;

      if (total < REFRESH_AREA_HEIGHT) {
        translationY.value = total;
      } else {
        translationY.value = REFRESH_AREA_HEIGHT;
      }

      if (total < 0) {
        translationY.value = 0;
        scrollTo(scrollRef, 0, -total, false);
      }
    })
    .onEnd(() => {
      runOnJS(setGestureActive)(false);
      if (translationY.value <= REFRESH_AREA_HEIGHT - 1) {
        translationY.value = withTiming(0, { duration: 200 });
      } else {
        runOnJS(pullUpAnimation)();
      }
    }).enabled(!isScrollable);

  const handleOnScroll = useAnimatedScrollHandler({
    onScroll({ contentOffset }) {
      updatePanState(contentOffset.y);
    },
  });

  const animatedSpace = useAnimatedStyle(() => ({
    height: translationY.value,
  }));

  const pullDownIconSection = useAnimatedStyle(() => {
    const rotate = interpolate(translationY.value, [0, REFRESH_AREA_HEIGHT], [0, 180]);
    return {
      transform: [{ rotate: `${rotate}deg` }],
    };
  });

  const pullUpTranslateStyle = useAnimatedStyle(() => {
    const opacity = interpolate(translationY.value, [58, REFRESH_AREA_HEIGHT], [0, 1]);
    return {
      opacity,
      transform: [{ translateY: pullUpTranslate.value }],
    };
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.contentContainer}>
          <Animated.View style={[styles.pullToRefreshArea, animatedSpace]}>
            <Animated.View style={[styles.center, pullUpTranslateStyle]}>
              <Animated.View style={pullDownIconSection}>
                <Icon name="arrow-down-circle" color="white" size={35} />
              </Animated.View>
              <Text style={{fontFamily:fonts.NexaRegular,color:colors.white}}>Pull Down to Refresh</Text>
            </Animated.View>
            {toggleLottie && (
              <Lottie
                source={require('../../../assets/animation/loader2.json')}
                style={styles.lottieView}
                autoPlay
              />
            )}
          </Animated.View>

          <GestureDetector gesture={gestureHandler}>
            {/* <Animated.ScrollView
              ref={scrollRef}              
              scrollEventThrottle={16}
              onScroll={handleOnScroll}
              nestedScrollEnabled={true}
              
              showsVerticalScrollIndicator={false}
            > */}
              {children}
            {/* </Animated.ScrollView> */}
          </GestureDetector>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  lottieView: {
    width: actuatedNormalize(200),
    height: actuatedNormalize(200),
    backgroundColor: 'transparent',
    marginTop: -15,
  },
  pullToRefreshArea: {
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    overflow: 'hidden',
  },
  contentContainer: { flex: 1, marginHorizontal: 15, marginVertical: 15 },
  center: { justifyContent: 'center', alignItems: 'center' },
});

export default PullToRefresh;
