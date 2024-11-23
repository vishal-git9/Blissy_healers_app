import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, GestureResponderEvent, StyleProp, ViewStyle } from 'react-native';
import colors from '../../constants/colors';
import { actuatedNormalize } from '../../constants/PixelScaling';
import { fonts } from '../../constants/fonts';
import TalkNowButton from '../../common/button/Talknow';
import Animated, { Extrapolate, FadeInUp, FadeOutLeft, FadeOutUp, SharedValue, SlideInLeft, interpolate, useAnimatedStyle } from 'react-native-reanimated';
import { defaultStyles } from '../../common/styles/defaultstyles';
import { Image } from 'react-native';
import { formatDateTime } from '../../utils/formatedateTime';

const ITEM_SIZE =  120
interface CouponCardProps {
  name: string;
  rewardPoints: number;
  id:string;
  earnedAt:string;
  scrollY:SharedValue<number>;
  index:number;
  onPressClaim: (id:string,rewardAmount:number) => void;
}

const CouponCard: React.FC<CouponCardProps> = ({earnedAt, name, rewardPoints, onPressClaim , id,index, scrollY}) => {
    // const [swipeAnimation] = useState(new Animated.Value(0));
    // const [opacityAnimation] = useState(new Animated.Value(1));

    const listanimatedStyle = useAnimatedStyle(() => {
      const scale = interpolate(scrollY.value, [-1, 0, ITEM_SIZE * index, ITEM_SIZE * (index + 2)], [1, 1, 1, 0], Extrapolate.CLAMP);
      const opacity = interpolate(scrollY.value, [-1, 0, ITEM_SIZE * index, ITEM_SIZE * (index + 1)], [1, 1, 1, 0], Extrapolate.CLAMP);
      console.log("hey------>",scale,opacity)
  
      return {
        transform: [{ scale }],
        opacity,
      };
    });

    const handlePressClaim = () => {
        onPressClaim(id, rewardPoints); // Execute the claim 
    };

  return (
    <Animated.View
      entering={FadeInUp.delay(index * 20)}
      exiting={FadeOutUp.delay(index * 20 )}
      style={[listanimatedStyle,styles.card]}
      >
      <Animated.View style={[styles.content]}>
        <View style={styles.leftContainer}>
      <Image source={ require('./wallet.png') } style={styles.avatar} />
        <View style={styles.nameContainer}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.rewardPoints}>{rewardPoints} points</Text>
        <Text style={[{fontSize:10,color:colors.gray}]}>{formatDateTime(earnedAt,"Date_time")}</Text>
        </View>
        </View>
        <View style={styles.buttonContainer}>
        {/* <TouchableOpacity style={styles.claimButton} onPress={handlePressClaim}>
          <Text style={styles.buttonText}>Claim Now</Text>
        </TouchableOpacity> */}
        <TalkNowButton label='Claim' onPress={handlePressClaim} />

        </View>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    // borderWidth:2,
    // borderColor:colors.red,
    backgroundColor: colors.dark,
    padding:actuatedNormalize(20),
    margin: actuatedNormalize(10),
    borderRadius: actuatedNormalize(10),
    // margin
    // justifyContent:'center'
    // width:'100%'
    // overflow: 'hidden', // Ensures rounded corners are respected

  },
  header: {
    backgroundColor: '#007bff',
    paddingVertical: actuatedNormalize(10),
    alignItems: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    // padding: actuatedNormalize(20),
    flexDirection:'row',
    justifyContent:"space-between",
  },
  name: {
    fontSize: actuatedNormalize(18),
    // marginBottom: actuatedNormalize(10),
    // textAlign: 'center',
    fontFamily:fonts.NexaBold,
    color:colors.white
  },
  rewardPoints: {
    fontSize: actuatedNormalize(16),
    // marginBottom: actuatedNormalize(15),
    textAlign: 'center',
    fontFamily:fonts.NexaBold,
    color:colors.white
  },
  claimButton: {
    backgroundColor: colors.darkRed,
    // paddingVertical: actuatedNormalize(10),
    // paddingHorizontal: actuatedNormalize(15),
    borderRadius: actuatedNormalize(5),
    alignSelf: 'center',
  },
  buttonContainer:{
    paddingLeft:actuatedNormalize(15),
    alignItems:'center',
    justifyContent:'center',
    // borderWidth:1,
    // borderLeftWidth:actuatedNormalize(2),
    // borderLeftColor:colors.white,
    // borderStyle:'dashed',
  },
  buttonText: {
    fontSize: actuatedNormalize(16),
    textAlign: 'center',
    fontFamily:fonts.NexaBold,
    color:colors.white
  },
  nameContainer:{
    // borderRightWidth:actuatedNormalize(2),
    // borderRightColor:colors.white,
    // backgroundColor:"red",
    alignItems:"flex-start",
    rowGap:actuatedNormalize(5),
    // width:'65%',
    // borderStyle:'dashed',
  },
  avatar:{
    height:actuatedNormalize(40),
    width:actuatedNormalize(40)
  },
  leftContainer:{
    flexDirection:'row',
    gap:actuatedNormalize(15),
    justifyContent:'center',
    // borderWidth:1
    // paddingRight:actuatedNormalize(10)

  }

});

export default CouponCard;
