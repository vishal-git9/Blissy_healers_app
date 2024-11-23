import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet, Image } from 'react-native';
import colors from '../../constants/colors';
import FastImage from 'react-native-fast-image';

const AvatarRingsAnimation: React.FC<{source:string | undefined,width:number,height:number}> = ({height,source,width}) => {
  const fadeAnim1 = useRef(new Animated.Value(0)).current;
  const fadeAnim2 = useRef(new Animated.Value(0)).current;
  const fadeAnim3 = useRef(new Animated.Value(0)).current;

  const animateRing = (ring: Animated.Value) => (
    Animated.sequence([
      Animated.timing(ring, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(ring, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ])
  );

  useEffect(() => {
    const loopAnimation = () => {
      Animated.sequence([
        animateRing(fadeAnim1),
        animateRing(fadeAnim2),
        // animateRing(fadeAnim3),
      ]).start(() => loopAnimation()); // Recursively restart the animation sequence
    };
  
    loopAnimation();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        {/* <Image source={{uri:source}} width={width} height={height} style={{borderRadius:50}}/> */}
        <FastImage source={{uri:source}} style={{width:width, height:height, overflow:'hidden'}} resizeMode={FastImage.resizeMode.contain} />
      </View>
      <Animated.View style={[styles.ring, styles.ring1, { opacity: fadeAnim1 }]} />
      <Animated.View style={[styles.ring, styles.ring2, { opacity: fadeAnim2 }]} />
      {/* <Animated.View style={[styles.ring, styles.ring3, { opacity: fadeAnim3 }]} /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  avatarContainer: {
    // Avatar style
    // width:200,
    // height:200,
    // overflow:'hidden'
  },
  ring: {
    position: 'absolute',
    borderRadius: 100,
    borderWidth: 2,
    borderColor: colors.gray,
  },
  ring1: {
    width: 175,
    height: 175,
  },
  ring2: {
    width: 185,
    height: 185,
  },
  ring3: {
    width: 210,
    height: 210,
  },
});

export default AvatarRingsAnimation;
