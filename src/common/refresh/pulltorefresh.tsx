import {Text, SafeAreaView, StyleSheet, StatusBar, View} from 'react-native';
import React, {useState, useEffect} from 'react';
import {FlatList, PanGestureHandler} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import Lottie from 'lottie-react-native';
import Animated, {
  Extrapolate,
  interpolate,
  runOnJS,
  scrollTo,
  useAnimatedGestureHandler,
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { actuatedNormalize } from '../../constants/PixelScaling';

interface PullToRefreshProps {
  children: React.ReactNode;
  onRefresh: () => void;
  refreshing:boolean;
}

const REFRESH_AREA_HEIGHT = 130;

const PullToRefresh:React.FC<PullToRefreshProps> = ({children, refreshing, onRefresh}) => {
  const [toggleLottie, setToggleLottie] = useState(false);
  const [toggleGesture, setToggleGesture] = useState(true);
  const [gestureActive, setGestureActive] = useState(false);

  const flatlistRef = useAnimatedRef();

  const translationY = useSharedValue(0);
  const pullUpTranslate = useSharedValue(0);

  const fetchData = async () => {
    // setTimeout(() => {
    //   setRecipes([fDAta, ...recipes]);
    // }, 2000);
    onRefresh()
    setTimeout(() => {
      translationY.value = withTiming(0, {duration: 200}, finished => {
        pullUpTranslate.value = 0;
        runOnJS(setToggleLottie)(false);
      });
     }, 2000);
  };
  useEffect(() => {
    if (!refreshing) {
      translationY.value = withTiming(0, {duration: 200}, finished => {
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
        {duration: 200},
        finished => {
          if (finished) {
            runOnJS(setToggleLottie)(true);
            runOnJS(fetchData)();

          }
        },
      ),
    );
  };

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startY = translationY.value;
      runOnJS(setGestureActive)(true);
    },
    onActive: (event, ctx) => {
      const total = ctx?.startY as any + event.translationY;

      if (total < REFRESH_AREA_HEIGHT) {
        translationY.value = total;
      } else {
        translationY.value = REFRESH_AREA_HEIGHT;
      }

      if (total < 0) {
        translationY.value = 0;
        scrollTo(flatlistRef, 0, total * -1, false);
      }
    },
    onEnd: () => {
      runOnJS(setGestureActive)(false);
      if (translationY.value <= REFRESH_AREA_HEIGHT - 1) {
        translationY.value = withTiming(0, {duration: 200});
      } else {
        runOnJS(pullUpAnimation)();
      }
      if (!(translationY.value > 0)) {
        console.log("I ran---->")
        // runOnJS(setToggleGesture)(false);
      }
    },
  });

  const handleOnScroll = (event: { nativeEvent: { contentOffset: { y: any; }; }; }) => {
    const position = event.nativeEvent.contentOffset.y;
    if (position === 0) {
      setToggleGesture(true);
    } else if (position > 0 && toggleGesture && !gestureActive) {
      setToggleGesture(false);
    }
  };

  const animatedSpace = useAnimatedStyle(() => {
    return {
      height: translationY.value,
    };
  });

  const pullDownIconSection = useAnimatedStyle(() => {
    const rotate = interpolate(
      translationY.value,
      [0, REFRESH_AREA_HEIGHT],
      [0, 180],
    );
    return {
      transform: [{rotate: `${rotate}deg`}],
    };
  });

  const pullUpTranslateStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translationY.value,
      [58, REFRESH_AREA_HEIGHT],
      [0, 1],
    );

    return {
      opacity,
      transform: [
        {
          translateY: pullUpTranslate.value,
        },
      ],
    };
  });

  const statusBarStyle = useAnimatedStyle(() => {
    const translate = interpolate(
      translationY.value,
      [80, REFRESH_AREA_HEIGHT],
      [0, -40],
      {extrapolateLeft: Extrapolate.CLAMP, extrapolateRight: Extrapolate.CLAMP},
    );

    return {
      transform: [
        {
          translateY: translate,
        },
      ],
    };
  });

  return (
    <>

      <SafeAreaView style={{flex: 1}}>
        <View style={styles.contentContainer}>
          <Animated.View style={[styles.pullToRefreshArea, animatedSpace]}>
            <Animated.View style={[styles.center, pullUpTranslateStyle]}>
              <Animated.View style={pullDownIconSection}>
                <Icon name="arrow-down-circle" color="white" size={35} />
              </Animated.View>

              <Text>Pull Down to Refresh</Text>
            </Animated.View>
            {toggleLottie && (
              <Lottie
                source={require('../../../assets/animation/loader2.json')}
                style={styles.lottieView}
                autoPlay
              />
            )}
          </Animated.View>

          <FlatList
            {...children?.props}
            ref={flatlistRef}
            onScroll={handleOnScroll}
            showsVerticalScrollIndicator={false}
          />

          {toggleGesture && (
            <PanGestureHandler onGestureEvent={gestureHandler}>
              <Animated.View style={styles.gesture} />
            </PanGestureHandler>
          )}
        </View>
      </SafeAreaView>
      {/* <SafeAreaView style={{backgroundColor: 'white'}} /> */}
    </>
  );
};

const styles = StyleSheet.create({
  gesture: {
    position: 'absolute',
    top: -60,
    left: 0,
    //  backgroundColor:"green",
    height: 100,
    width: '100%',
    zIndex: 2,
  },
  lottieView: {
    width: actuatedNormalize(200),
    height: actuatedNormalize(200),
    backgroundColor: 'transparent',
    marginTop: -15,
  },
  pullToRefreshArea: {
    height: 140,
    // backgroundColor:"red",
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    overflow: 'hidden',
  },
  contentContainer: {flex: 1, marginHorizontal: 15, marginVertical: 15},
  center: {justifyContent: 'center', alignItems: 'center'},
});

export default PullToRefresh;
