import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import { SCREEN_HEIGHT, actuatedNormalize } from '../../constants/PixelScaling';
import colors from '../../constants/colors';
import { fonts } from '../../constants/fonts';
import ShockwavePulseButton from '../button/callnow';
import { useSelector } from 'react-redux';
import { AuthSelector } from '../../redux/uiSlice';

const { width: windowWidth } = Dimensions.get('window');

// Define the CarouselItem type if not already defined
type CarouselItem = {
  id: string;
  content: string;
  subContent:string;
};

const AutoScrollCarousel: React.FC<{profilePic:string | undefined}> = ({profilePic}) => {
  // Sample data for the carousel
  const data: CarouselItem[] = [
    {
      id: '1',
      content: 'Listen First',
      subContent:" to understand before being understood. Reflect before you reply"
    },
    {
      id: '2',
      content: 'Stay Calm',
      subContent:" to understand before being understood. Reflect before you reply"
    },
    {
      id: '3',
      content: 'Speak Clearly',
      subContent:'Use "I" statements to express your feelings without blaming'
    },
    {
      id: '4',
      content: 'Stay Present',
      subContent:"Focus on the current issue, avoiding past conflicts"
    },
    {
      id: '5',
      content: 'Find Common Ground',
      subContent:"Look for areas of agreement as a basis for understanding"
    },
    {
      id: '6',
      content: 'Validate Feelings',
      subContent:"Acknowledge both sides. Validation shows empathy"
    },
    {
      id: '7',
      content: 'Agree to Revisit',
      subContent:"It's okay to pause and plan to discuss later if emotions run high"
    },
    // Add more items as needed
  ];

  const { user } = useSelector(AuthSelector)
  const scrollX = useRef(new Animated.Value(0)).current; // Current scroll position
  const [currentIndex, setCurrentIndex] = useState(0); // Current index of the carousel
  const flatListRef = useRef<Animated.FlatList<CarouselItem>>(null); // Ref to the FlatList

  useEffect(() => {
    const interval = setInterval(() => {
      // Calculate the next index
      let nextIndex = currentIndex + 1;
      if (nextIndex >= data.length) {
        nextIndex = 0; // Loop back to the start
      }
      // Scroll to the next item
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    }, 5000); // Change slides every 3 seconds

    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, [currentIndex]);

  return (
    <View>
      <View style={[styles.itemContainer, {height:actuatedNormalize(400)} ]}>
        <ShockwavePulseButton children={<Image source={{ uri:profilePic }} style={styles.image} />}/>
      </View>

      <Animated.FlatList
        ref={flatListRef}
        data={data}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true } // Enable native driver for smooth animation
        )}
        renderItem={({ item, index }) => {
          // Calculate opacity for each item based on scroll position
          const opacity = scrollX.interpolate({
            inputRange: [
              (index - 1) * windowWidth, // Previous item
              index * windowWidth, // Current item
              (index + 1) * windowWidth, // Next item
            ],
            outputRange: [0.3, 1, 0.3], // Fade out the previous and next item
            extrapolate: 'clamp', // Clamp so items don't fade beyond this range
          });

          return (
            <Animated.View style={[styles.itemContainer, { opacity }]}>
              <Text style={styles.content}>{item.content}</Text>
              <Text style={styles.subContent}>{item.subContent}</Text>
            </Animated.View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    width: windowWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: actuatedNormalize(100),
    height: actuatedNormalize(100),
    borderRadius: actuatedNormalize(50)
  },
  content: {
    fontSize:actuatedNormalize(22),
    fontFamily:fonts.NexaBold,
    color:colors.white
  },
  subContent:{
    color:colors.gray,
    textAlign:"center",
    fontFamily:fonts.NexaRegular,
    fontSize:actuatedNormalize(14),
    width:"80%"
  }
});

export default AutoScrollCarousel;
