import {
  View,
  Text,
  ScrollView,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Vibration,
  ViewToken,
} from 'react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Animated, {
  CurvedTransition,
  Extrapolate,
  FadeInUp,
  FadeOutUp,
  interpolate,
  runOnJS,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import React from 'react';
import SwipeableRow from '../../common/animation/swipetodelete';
import { SegmentedControl } from '../../common/tab/segmented';
import { defaultStyles } from '../../common/styles/defaultstyles';
import { formatDateTime, getFormattedDate } from '../../utils/formatedateTime';
import colors from '../../constants/colors';
// import { CallInfoData as calls } from '../../mockdata/call';
import { actuatedNormalize } from '../../constants/PixelScaling';
import { fonts } from '../../constants/fonts';
import { HeaderComponent } from '../../common/header/screenheader';
import { useDeleteSingleCallInfoMutation, useGetmyCallInfoQuery, useLazyGetmyCallInfoQuery } from '../../api/callService';
import PullToRefresh from '../../common/refresh/pull';
import { NavigationStackProps } from '../Prelogin/onboarding';
import SearchBar from '../../common/header/searchbar';
import CallinforRow from '../../common/call/callinforow';
import { useDispatch, useSelector } from 'react-redux';
import { CallInfoSelector, Calls, pushCalllist } from '../../redux/callSlice';
import { Snackbar } from 'react-native-paper';
import { Empty } from '../../common/Empty/Empty';
import { AuthSelector } from '../../redux/uiSlice';
import useBackHandler from '../../hooks/usebackhandler';

const transition = CurvedTransition.delay(100);


const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const CalllistData: React.FC<NavigationStackProps> = ({ navigation }) => {
  const [selectedOption, setSelectedOption] = useState('All');
  const [searchQuerytext, SetsearchQuerytext] = useState<string>("")
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const editing = useSharedValue(-30);
  const [ refetch, {isLoading, isError, isSuccess} ] = useLazyGetmyCallInfoQuery()
  const [deleteCall, { isLoading: isdeleteloading, isError: isdeleteerror, isSuccess: isdeletesccuess }] = useDeleteSingleCallInfoMutation()
  const [isSearchActive, setIsSearchActive] = useState<boolean>(false);
  const [isCallDeleted, setisCallDeleted] = useState<boolean>(false)
  const [heightIncreased, setHeightIncreased] = useState<boolean>(false)
  const height = useSharedValue(100);
  const scrollY = useSharedValue(0);
  const viewableItems = useSharedValue<ViewToken[]>([]);
  const [isScrollable, setIsScrollable] = useState<boolean>(false);
  const scrollRef = useAnimatedRef<Animated.FlatList<any>>();
  const [contentHeight, setContentHeight] = useState<number>(0);
  const { Calls, missedCalls } = useSelector(CallInfoSelector)
  const [items, setItems] = useState(Calls);
  const [searchQueryData, setsearchQueryData] = useState(Calls)
  const dispatch = useDispatch()
  const { user } = useSelector(AuthSelector)



  // calling use backhandler
  useBackHandler()

  // const getInputRanges = (index:number, ITEM_SIZE:number) => {
  //   const inputRange = [-1, 0, ITEM_SIZE * index, ITEM_SIZE * (index + 2)];
  //   const opacityInputRange = [-1, 0, ITEM_SIZE * index, ITEM_SIZE * (index + 1)];
  //   return { inputRange, opacityInputRange };
  // };
  // console.log(Calls,"UserCallinfo------>")
  // const scrollHandler = useAnimatedScrollHandler({
  //   onScroll: (event) => {
  //     console.log("scrolling------>", event)
  //     scrollY.value = event.contentOffset.y;
  //   },

  // });

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
  // const myHandler = useCallback(({viewableItems, changed}) => {
  //   console.log("Visible items are", viewableItems);
  //   console.log("Changed in this iteration", changed);
  // }, 
  // [])







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

  // React.useEffect(() => {

  //   refetch().then((res) => console.log(res.data,"resofcall-------->")).catch((err) => console.log(err))
  // }, [])

  const onSegmentChange = (option: string) => {
    setSelectedOption(option);
    if (option === 'All') {
      setItems(Calls);
    } else {
      setItems(missedCalls?.filter((el)=>el.calleeId === user?._id));
    }
  };

  const handlerefreshMessage = async () => {
    await refetch({},false)
  }

  const handleSearchFriendsQuery = useCallback((text: string) => {
    console.log(text, 'text---->')
    SetsearchQuerytext(text)
    const Searchfiltered = Calls?.filter(user =>
      user?.UserCallerInfoList[0]?.name.toLowerCase().startsWith(text.toLowerCase()) || user?.UserCalleeInfoList[0]?.name.toLowerCase().startsWith(text.toLowerCase())
    );
    setsearchQueryData(Searchfiltered)
  }, [selectedOption, searchQuerytext])

  const removeCall = async (toDelete: Calls) => {
    // Vibration.vibrate(500);
    console.log(toDelete, "toDelete---->")

    const data = await deleteCall(toDelete._id)
    console.log(toDelete, "toDelete---->")
    if ('data' in data) {
      refetch({},false)
      setisCallDeleted(true)

    } else if ('error' in data) {
      console.log(data, "res of calls")
      // console.log(verifyOtpErr, "error of otp")
    }
    // setItems(items.filter((item) => item.id !== toDelete.id));
  };

  const onEdit = () => {
    let editingNew = !isEditing;
    editing.value = editingNew ? 0 : -30;
    setIsEditing(editingNew);
  };

  const animatedRowStyles = useAnimatedStyle(() => ({
    transform: [{ translateX: withTiming(editing.value) }],
  }));

  const animatedPosition = useAnimatedStyle(() => ({
    transform: [{ translateX: withTiming(editing.value) }],
  }));

  useEffect(() => {
    height.value = withTiming(isSearchActive ? 50 : 100, { duration: 500 }, (finished) => {
      if (finished) {
        runOnJS(setHeightIncreased)(true);
        // scrollY.value = 0
      }
    });
  }, [isSearchActive]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: height.value,
    };
  });

  const renderChatlistData = useCallback(() => {

    if (!isSearchActive) {
      if (selectedOption === "All") {
        return Calls
      } else {
        return missedCalls?.filter((el)=>el.calleeId === user?._id)
      }
    } else {
      return searchQueryData
    }

  }, [isSearchActive, Calls, selectedOption, searchQueryData])


  console.log(missedCalls, "missedCalls----->")
  return (
    <View style={{ flex: 1 }}>
      {/* <HeaderComponent title='Calls' onPress={()=>console.log("back")}/> */}
      <Animated.View style={[animatedStyle, { marginTop: actuatedNormalize(40), marginHorizontal: 16 }]}>
        <SearchBar height={height.value} querytext={searchQuerytext} isSearchActive={isSearchActive} setIsSearchActive={setIsSearchActive} onSearch={handleSearchFriendsQuery} />
      </Animated.View>
      {!isSearchActive && <View style={styles.header}>

        <SegmentedControl
          options={['All', 'Missed']}
          selectedOption={selectedOption}
          onOptionPress={onSegmentChange}
        />
        <TouchableOpacity onPress={onEdit}>
          <Text style={{ color: colors.white, fontSize: actuatedNormalize(18), fontFamily: fonts.NexaRegular }}>
            {isEditing ? 'Done' : 'Edit'}
          </Text>
        </TouchableOpacity>
      </View>}
      {
       <PullToRefresh scrollRef={scrollRef} handleOnscroll={handleOnScroll} isScrollable={isScrollable} setIsScrollable={setIsScrollable} updatePanState={updatePanState} onRefresh={handlerefreshMessage} refreshing>

          {/* <ScrollView  contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ paddingBottom: 40, marginTop: actuatedNormalize(10) }}> */}
          {/* <Animated.View style={[defaultStyles.block, { borderTopColor: colors.lightGray, borderWidth: 2 }]} layout={transition}> */}
          <Animated.FlatList
            onScroll={handleOnScroll}
            ref={scrollRef}
            skipEnteringExitingAnimations
            data={renderChatlistData()}
            scrollEnabled={true}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
            contentContainerStyle={{ minHeight: contentHeight, marginTop: isSearchActive ? actuatedNormalize(10) : actuatedNormalize(0) }}
            onContentSizeChange={(w, h) => setContentHeight(h)}
            ListEmptyComponent={Calls.length === 0 ? <Empty head='Make Calls' description='You have no call records make random calls and improve your connections' /> : (missedCalls?.filter((el)=>el.calleeId === user?._id).length === 0 && !isSearchActive) ? <Empty head='Missed Calls' description='You have no missed calls records' /> : <Empty head='Search Users' description='User not found' />}
            // style={[defaultStyles.block]}
            // onViewableItemsChanged={({ viewableItems: vItems }) => {
            //   viewableItems.value = vItems;
            // }}
            // viewabilityConfig={{
            //   itemVisiblePercentThreshold: 50,
            // }}
            //             showsVerticalScrollIndicator={false}
            // showsHorizontalScrollIndicator={false}
            itemLayoutAnimation={transition}
            onMomentumScrollEnd={(e) => updatePanState(e.nativeEvent.contentOffset.y)}
            keyExtractor={(item) => item._id}
            ItemSeparatorComponent={() => <View style={[defaultStyles.separator, { marginLeft: 90 }]} />}
            renderItem={({ item, index }) => {
              // const { inputRange, opacityInputRange } = getInputRanges(index, ITEM_SIZE)
              // const inputRange = [-1, 0, ITEM_SIZE * index, ITEM_SIZE * (index + 2)]
              // const opacityInputRange = [-1, 0, ITEM_SIZE * index, ITEM_SIZE * (index + 1)]       

              // const scale = scrollY.interpolate({
              //   inputRange,
              //   outputRange: [1, 1, 1, 0]
              // })
              // const opacity = scrollY.interpolate({
              //   inputRange: opacityInputRange,
              //   outputRange: [1, 1, 1, 0]
              // })
              return (
                // <SwipeableRow onDelete={() => removeCall(item)}>
                //   <Animated.View
                //     entering={FadeInUp.delay(index * 20)}
                //     exiting={FadeOutUp}
                //     style={[listanimatedStyle,{ flexDirection: 'row', alignItems: 'center' }]}
                //   >
                //     <AnimatedTouchableOpacity
                //       style={[animatedPosition, { paddingLeft: 8 }]}
                //       onPress={() => removeCall(item)}
                //     >
                //       <Ionicons name="remove-circle" size={24} color={colors.red} />
                //     </AnimatedTouchableOpacity>
                //     <Animated.View
                //       style={[defaultStyles.item, { paddingLeft: 10 }, animatedRowStyles]}
                //     >
                //       <Image source={{ uri: item.img }} style={styles.avatar} />
                //       <View style={{ flex: 1, gap: 2 }}>
                //         <Text style={{ fontFamily: fonts.NexaRegular, fontSize: actuatedNormalize(18), color: item.missed ? colors.lightRed2 : colors.white }}>
                //           {item.name}
                //         </Text>
                //         <View style={{ flexDirection: 'row', gap: actuatedNormalize(6), alignItems: "center" }}>
                //           <Ionicons name={item.video ? 'videocam' : 'call'} size={16} color={colors.gray} />
                //           <Text style={{ fontSize: actuatedNormalize(14), color: colors.gray, flex: 1, fontFamily: fonts.NexaItalic }}>
                //             {item.incoming ? 'Incoming' : 'Outgoing'}
                //           </Text>
                //         </View>
                //       </View>
                //       <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
                //         <Text style={{ fontSize: actuatedNormalize(12), color: colors.gray, fontFamily: fonts.NexaRegular }}>{getFormattedDate(item.date)}</Text>
                //         {/* <Ionicons name="information-circle-outline" size={24} color={colors.primary} /> */}
                //       </View>
                //     </Animated.View>
                //   </Animated.View>
                // </SwipeableRow>
                <CallinforRow user={user} navigation={navigation} viewableItems={viewableItems} animatedPosition={animatedPosition} animatedRowStyles={animatedRowStyles} index={index} item={item} removeCall={removeCall} scrollY={scrollY} key={item._id} />
              )
            }}
          />
           {/* </Animated.View> */}
        </PullToRefresh> 
        //  : <Empty head='Make Calls' description='You have no call records make random calls and improve your connections' />
      }

      <Snackbar
        duration={2000}
        visible={isCallDeleted}
        style={{ backgroundColor: colors.dark }}
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
        onDismiss={() => setisCallDeleted(false)}
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
            setisCallDeleted(false)
          },
        }}>
        Call record is deleted
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: actuatedNormalize(16),
    alignItems: "center",
    marginTop: actuatedNormalize(5)
    // backgroundColor: colors.dark,
  },
  avatar: {
    width: actuatedNormalize(50),
    height: actuatedNormalize(50),
    borderRadius: actuatedNormalize(30),
  },
});
export default CalllistData;