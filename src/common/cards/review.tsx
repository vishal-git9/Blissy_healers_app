// Import necessary components and hooks from React Native and React
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, View, StyleSheet } from 'react-native';
import ReviewCard from './reviewCard';
import colors from '../../constants/colors';
import { UserInterface } from '../../redux/uiSlice';

// Sample reviews array

// export const reviewsArray: ReviewCardProps[] = [
//   {
//     id: 1,
//     userName: 'Vishal',
//     userDesc: 'This product is amazing! Highly recommend to everyone.',
//     rating: 5,
//   },
//   {
//     id: 2,
//     userName: 'Aman',
//     userDesc: 'Good quality, but took longer to connect than expected.',
//     rating: 4,
//   },
//   {
//     id: 3,
//     userName: 'Amit',
//     userDesc: 'This App is well developed talked with 20 people without any issue',
//     rating: 5,
//   },
//   {
//     id: 4,
//     userName: 'Shivam',
//     userDesc: 'Amazing App, been using it for couple of weeks.',
//     rating: 4,
//   },
//   {
//     id: 5,
//     userName: 'kunal',
//     userDesc: 'Some features are unavailabe I hope they develop it soon.',
//     rating: 4,
//   },
//   {
//     id: 6,
//     userName: 'rakhi',
//     userDesc: 'Great Calling experience, talked with 30 people so far.',
//     rating: 5,
//   },
//   // Add more reviews as needed
// ];

// Define the Carousel component with props for the reviews array
interface AutoLoopCarouselProps {
  reviews: Review[];
}
const windowWidth = Dimensions.get('window').width;

// Assuming the Review type and ReviewCard component exist
export interface Review {
  _id: number;
  username: string;
  review: string;
  rating: number;
}

const AutoLoopCarousel: React.FC<AutoLoopCarouselProps> = ({reviews}) => {
  const scrollX = useRef(new Animated.Value(0)).current; // Animated value to control scroll position

  useEffect(() => {
    // Function to start the animation
    const startAnimation = () => {
      // Reset animation to starting position
      scrollX.setValue(0);

      // Animate from 0 to -width * (reviews.length) to slide all items to the left
      Animated.timing(scrollX, {
        toValue: -windowWidth * reviews?.length,
        duration: 3000 * reviews?.length, // Duration based on number of items to ensure smooth flow
        useNativeDriver: true,
      }).start(() => startAnimation()); // Loop the animation by calling startAnimation again
    };

    startAnimation(); // Start the animation when the component mounts
  }, []);




  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.scrollView,
          {
            // Creating a seamless flow by translating X based on scrollX value
            transform: [{ translateX: scrollX }],
          },
        ]}
      >
        {reviews?.length > 0 && reviews?.map((review, index) => (
          <View key={review?._id} style={styles.card}>
            {/* Replace with your ReviewCard or custom content */}
            <ReviewCard {...review}/>
          </View>
        ))}
        {/* Duplicate reviews for a seamless looping effect */}
        {reviews?.length > 0 && reviews?.map((review, index) => (
          <View key={`duplicate-${review?._id}`} style={styles.card}>
            <ReviewCard {...review}/>
          </View>
        ))}
      </Animated.View>
    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden', // Hide the overflowing content
  },
  scrollView: {
    flexDirection: 'row', // Arrange cards in a row
  },
  card: {
    width: windowWidth, // Each card takes full width of the screen
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
    padding: 20, // Add some padding around the content
  },
});

export default AutoLoopCarousel;
