// Import necessary components and libraries
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import StarRating from 'react-native-star-rating'; // Assume this is the library you're using
import colors from '../../constants/colors';
import { fonts } from '../../constants/fonts';
import { actuatedNormalize } from '../../constants/PixelScaling';
import { Review } from './review';


const ReviewCard: React.FC<Review> = ({
  _id,
  username,
  review,
  rating,
}) => {
  return (
    <View style={styles.cardContainer}>
      <Text style={styles.userName}>{username}</Text>
      <Text numberOfLines={2} style={styles.userDesc}>{review}</Text>
      <StarRating
        disabled={false}
        maxStars={5}
        rating={rating}
        fullStarColor={'gold'} // Customize as needed
        emptyStarColor={'#ccc'} // Customize as needed
        starSize={20}
      />
    </View>
  );
};

// Styling for the card
const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: colors.black,
    borderRadius: actuatedNormalize(8),
    padding: actuatedNormalize(16),
    height:actuatedNormalize(150),
    justifyContent:"center",
    alignItems:"center",
    shadowColor: '#000',
    width:"100%",
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    rowGap:actuatedNormalize(5)
  },
  userName: {
    fontSize: actuatedNormalize(18),
    color:colors.white,
    fontFamily:fonts.NexaBold,
  },
  userDesc: {
    fontSize: actuatedNormalize(14),
    color:colors.gray,
    textAlign:'center',
    fontFamily:fonts.NexaRegular,
  },
});

export default ReviewCard;
