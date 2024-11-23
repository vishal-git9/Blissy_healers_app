import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated as NativeAnimated,
  UIManager,
  Platform,
} from 'react-native';
import {NavigationStackProps} from '../Prelogin/onboarding';
import {RouteBackButton} from '../../common/button/BackButton';
import colors from '../../constants/colors';
import {fonts} from '../../constants/fonts';
import {actuatedNormalize} from '../../constants/PixelScaling';
import {AuthSelector} from '../../redux/uiSlice';
import {useDispatch, useSelector} from 'react-redux';
import LottieView from 'lottie-react-native';
import RewardCard from '../../common/cards/rewardCard';
import {Empty} from '../../common/Empty/Empty';
import CouponCard from './CouponCard';
import Typewriter from '../../common/animation/Typewritter';
import Animated, {
  CurvedTransition,
  runOnJS,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import PullToRefresh from '../../common/refresh/pull';
import { useGetallUserCoinsQuery,useClaimUsercoinsMutation, useGetallUserTotalCoinsQuery } from '../../api/rewardservice';
import { CouponsSelector, setAllCoupons, setPrevCoins, setTotalCoins, } from '../../redux/rewardSlice';
import { Snackbar } from 'react-native-paper';
import { BlissyLoader } from '../../common/loader/blissy';
import useBackHandler from '../../hooks/usebackhandler';


const HEADER_MAX_HEIGHT = 240;
const HEADER_MIN_HEIGHT = 84;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const transition = CurvedTransition.delay(100);

interface AlertMessage {
  show: boolean;
  message: string;
}

export const Coupons: React.FC<NavigationStackProps> = ({navigation}) => {
  const {user} = useSelector(AuthSelector);
  const dispatch = useDispatch();
  const {coupons,prevCoins,totalCoins} = useSelector(CouponsSelector);
  const [points, setPoints] = useState(0);
  const [isScrollable, setIsScrollable] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const [AlertMessage, setAlertMessage] = useState<AlertMessage>({ show: false, message: "" })
  const flashListRef = useAnimatedRef<Animated.FlatList<any>>();
  const scrollY = useSharedValue(0);
  const editing = useSharedValue(-30);
  const prevCoinsref = useRef<number>(totalCoins)
  const { data, refetch, isSuccess, isFetching } = useGetallUserCoinsQuery({});
  const { data: totalCoinsData, refetch: refetchTotalCoins, isSuccess: isTotalCoinsSuccess, isFetching:isFetchingTotalCoins } = useGetallUserTotalCoinsQuery({});
  const [claimUsercoins] = useClaimUsercoinsMutation();
  console.log(coupons, "coupons--->")
  console.log(totalCoinsData, "coupons--->")



  // calling use backhandler
  useBackHandler()


  useEffect(() => {
    if (isSuccess && data) {
      // data.forEach((coupon: Coupon) => {
        // });
          dispatch(setAllCoupons(data));
    }
  }, [isSuccess, data, dispatch]);
  console.log(prevCoinsref,"totalCoinsref--->")

  useEffect(() => {
    if (totalCoinsData===null) {
      dispatch(setTotalCoins(0));
    }else{
      dispatch(setTotalCoins(totalCoinsData?.coins));
    }
    // console.log(totalCoinsData, "total from api")
    console.log(totalCoinsData, "Total coins--->")
  }, [isTotalCoinsSuccess, totalCoinsData]);



  // const addPoints = (rewardAmount: number) => {
  //   setPoints(points + rewardAmount); // Add 100 points for example
  // };

  const handleClaimCoupon = async(id: string, rewardPoints: number) => {
    // addPoints(rewardPoints);
    // dispatch(getPrevCoins(totalCoins))
    prevCoinsref.current = totalCoins
    await claimUsercoins(id);
    setAlertMessage({show:true, message:`${rewardPoints} has been successfully added..`})
    const {data} = await refetch();
    const {data:coinsRes} = await refetchTotalCoins();
    console.log(coinsRes, "after claim coins total")
    dispatch(setTotalCoins(coinsRes.coins))
    //dispatch(setPrevCoins(coinsRes.coins))
    dispatch(setAllCoupons(data));
  };

  const RefreshCoupons = async () => {
    const {data} = await refetch();
    const {data:coinsRes} = await refetchTotalCoins();

    // console.log(coinsRes, "after claim coins total")
    dispatch(setTotalCoins(coinsRes?.coins))
    dispatch(setAllCoupons(data));
    console.log(coinsRes, 'coupons refreshed....');

  };

  const updatePanState = (offset: number) => {
    'worklet';
    if (offset > 0) {
      runOnJS(setIsScrollable)(true);
    } else {
      runOnJS(setIsScrollable)(false);
    }
  };

  const handleOnScroll = useAnimatedScrollHandler({
    onScroll({contentOffset}) {
      console.log(contentOffset.y, 'contentOffset.y----->');
      updatePanState(contentOffset.y);
      scrollY.value = contentOffset.y;
    },
  });

  return (
    <View style={styles.container}>
      <RouteBackButton onPress={() => navigation.goBack()} />
      <View style={styles.header}>
        <View style={styles.titleBar}>
          <Text style={styles.username}>Hi , {user?.name?.split(' ')[0]}</Text>
        </View>
        <LottieView
          autoPlay
          loop
          source={require('../../../assets/animation/hey.json')}
          style={{
            width: actuatedNormalize(300),
            height: actuatedNormalize(300),
            alignSelf: 'center',
          }}
        />
      </View>
      <View style={styles.cardContainer}>
        <RewardCard prevCoins={prevCoinsref.current} coins={totalCoins || prevCoinsref.current} shouldAnimate={false} />
      </View>
      <View style={styles.badge}>
        {/* <Text style={styles.text}>Healers will soon be available for you.</Text> */}
        <Typewriter
          loop={false}
          customtextstyle={{textAlign:"center",color:colors.white}}
          text="You can use reward points once the healers get listed"
          speed={50}
        />
      </View>
      {(isFetching || isFetchingTotalCoins) && <BlissyLoader/> }
      <View style={{flex: 1}}>
        <PullToRefresh
          handleOnscroll={handleOnScroll}
          isScrollable={isScrollable}
          scrollRef={flashListRef}
          setIsScrollable={setIsScrollable}
          updatePanState={updatePanState}
          refreshing={false}
          onRefresh={RefreshCoupons}>
          <Animated.FlatList
            skipEnteringExitingAnimations
            itemLayoutAnimation={transition}
            ref={flashListRef}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
            onScroll={handleOnScroll}
            data={coupons}
            contentContainerStyle={[styles.listContainer,{minHeight:contentHeight}]}
            onContentSizeChange={(w, h) => setContentHeight(h)}
            onMomentumScrollEnd={e =>
              updatePanState(e.nativeEvent.contentOffset.y)
            }
            keyExtractor={item => item._id.toString()}
            // ItemSeparatorComponent={() => (
            //   <View style={[defaultStyles.separator, { marginLeft: 90 }]} />
            // )}
            renderItem={({item, index}) => {
              return (
                // <Swipable>
                <CouponCard
                  key={item._id}
                  id={item._id}
                  earnedAt = {item.createdAt}
                  name={item.coinName}
                  index={index}
                  scrollY={scrollY}
                  rewardPoints={item.coins}
                  onPressClaim={() =>
                    handleClaimCoupon(item._id, item.coins)
                  }
                />
                // </Swipable>
              );
            }}
            // estimatedItemSize={100}
            scrollEnabled={true}
            ListEmptyComponent={
              <Empty
                head="You Don't have enough Coupons"
                description="Get on calls to get more"
              />
            }
          />
        </PullToRefresh>
      </View>
      <Snackbar
        duration={2000}
        visible={AlertMessage.show}
        style={{ backgroundColor: colors.dark }}
        onDismiss={() => setAlertMessage({ show: false, message: "" })}
        action={{
          theme: {
            fonts: {
              regular: { fontFamily: fonts.NexaRegular },
              medium: { fontFamily: fonts.NexaBold },
              light: { fontFamily: fonts.NexaBold },
              thin: { fontFamily: fonts.NexaRegular },
            },
            colors: { inversePrimary: colors.white, surface: colors.white, accent: colors.white }
          },

          label: 'Okay',
          textColor: "red",
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
  },
  username: {
    color: colors.white,
    fontFamily: fonts.NexaBold,
    fontSize: actuatedNormalize(30),
  },
  titleBar: {
    backgroundColor: 'transparent',
    marginTop: actuatedNormalize(40),
    height: actuatedNormalize(40),
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  cardContainer: {
    // width:'90%',
    marginTop: actuatedNormalize(-45),
    alignItems: 'center',
  },
  header: {
    // position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.primary,
    overflow: 'hidden',
    height: actuatedNormalize(HEADER_MAX_HEIGHT),
    borderBottomRightRadius: actuatedNormalize(40),
    borderBottomLeftRadius: actuatedNormalize(40),
  },
  listContainer: {
    padding: actuatedNormalize(5),
    marginTop:5
  },
  badge: {
    // backgroundColor: colors.primary,
    // padding:actuatedNormalize(5)
    // marginHorizontal:actuatedNormalize(8),
    // alignSelf:"center",
  width:"90%",
  alignSelf:"center",
    borderRadius: actuatedNormalize(5),
    paddingHorizontal: actuatedNormalize(16),
    paddingVertical: actuatedNormalize(8),
  },
});
