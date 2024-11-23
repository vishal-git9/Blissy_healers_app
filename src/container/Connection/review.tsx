import React, {useState, useRef, useEffect} from 'react';
import {View, Text, StyleSheet, BackHandler} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from "react-native-vector-icons/Feather"
import {IconButton} from '../../common/button/iconbutton';
import {fonts} from '../../constants/fonts';
import colors from '../../constants/colors';
import {actuatedNormalize} from '../../constants/PixelScaling';
import * as Animatable from 'react-native-animatable';
const ratingColors: {[key: number]: string} = {
  0.5:colors.red,
  1: colors.red,
  1.5: colors.red,
  2: colors.red,
  2.5: colors.red,
  3: colors.lightGray,
  3.5: colors.lightGray,
  4: colors.gold,
  5: colors.yellow,
};
import StarRating from 'react-native-star-rating';
import {RouteBackButton} from '../../common/button/BackButton';
import FaceComponent from '../../common/animation/face';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../AppNavigation/navigatorType';
import { RouteProp } from '@react-navigation/native';
import { usePostUserRatingMutation } from '../../api/rewardservice';
import generateRandomId from '../../utils/randomIdGenerator';
import useBackHandler from '../../hooks/usebackhandler';

interface ReviewScreenProps {
  navigation: NativeStackNavigationProp<RootStackParamList>;
  route: RouteProp<RootStackParamList, "ReviewScreen">;
}

const ReviewScreen: React.FC<ReviewScreenProps> = ({navigation,route}) => {
  const [rating, setRating] = useState(2);
  const ratingRef = useRef<Animatable.AnimatableComponent<any, any>>(null);  ;
  const color = ratingColors[rating] || colors.yellow;
  const [postRating,{isLoading,isError,isSuccess}] = usePostUserRatingMutation()
  const {user,socketId} = route.params;

  const handleSubmitReview = async()=>{
    await postRating({appId:generateRandomId(24),userId:user?._id,rating})
    navigation.navigate("Drawer")
  }

  const handleGoback = ()=>{
    handleSubmitReview()
    // navigation.navigate("Drawer")
  }

  useBackHandler(handleGoback)
// useEffect(()=>{
//   const backHandler = BackHandler.addEventListener(
//     'hardwareBackPress',
//     () => {
//       navigation.navigate("Drawer")
//       return true;
//     },
//   );
//   return () => backHandler.remove();

// },[])
  return (
    <>
      <RouteBackButton onPress={() => {
        handleSubmitReview()
        // navigation.navigate("Drawer")
      }} />
      <View style={styles.container}>
        {/* <View style={styles.headerContainer} >
        <Text style={styles.headerText}>Your Call has ended!</Text>
        <Text style={styles.headerText2}>Great! You Talked for 12min</Text>
        </View> */}
        <FaceComponent rating={rating}/>
        <Text style={styles.questionText}>How was the call with {user?.name}?</Text>

        <View style={styles.ratingContainer}>
          <Animatable.Text
            animation={'fadeIn'}
            ref={ratingRef}
            style={{
              color: colors.white,
              fontSize: actuatedNormalize(20),
              fontFamily: fonts.NexaBold,
            }}>
            {rating >= 0 && rating <=2.5
              ? 'Bad'
              : rating >=3 && rating < 4
              ? 'Good'
              : rating === 4 || rating===4.5
              ? 'Great' : rating === 5 ? "Amazing"
              : null}
          </Animatable.Text>
          <StarRating
            disabled={false}
            rating={rating}
            halfStarEnabled={true}
            animation="rotate"
            emptyStarColor={colors.gray}
            starSize={50}
            fullStarColor={color}
            activeOpacity={1}
            selectedStar={rating => {
              if (ratingRef.current?.fadeIn) {
                ratingRef.current?.fadeIn(800);
              }

              setRating(rating)
            }}
            containerStyle={{width: '80%'}}
          />
        </View>

        {/* <View style={{width:"100%",flex:1}}>
      <IconButton
          IconProvider={MaterialIcons}
          iconame="chat"
          label="Say Hi!"
          iconcolor={colors.white}
          onpress={() => console.log('first')}
          size={18}
          styles={styles.tertiaryButton}
          textSize={actuatedNormalize(18)}
          textcolor={colors.white}
        />
      </View> */}
        <View style={styles.buttonGroup}>
          {/* <IconButton
            IconProvider={FontAwesome}
            iconame="repeat"
            label="Reconnect"
            iconcolor={colors.gray}
            onpress={() => navigation.pop(2)}
            size={18}
            styles={styles.SecondaryButton}
            textSize={actuatedNormalize(18)}
            textcolor={colors.white}
          /> */}
          <IconButton
            IconProvider={MaterialIcons}
            iconame="chat"
            label="Chat"
            iconcolor={colors.white}
            onpress={() => navigation.navigate('ChatWindow',{Chats:null,socketId:socketId || undefined,userDetails:user,senderUserId:user?._id || null})}
            size={18}
            styles={styles.PrimaryButton}
            textSize={actuatedNormalize(18)}
            textcolor={colors.white}
          />
           <IconButton
            IconProvider={Feather}
            iconame="send"
            label="Submit"
            iconcolor={colors.white}
            onpress={handleSubmitReview}
            size={18}
            styles={styles.PrimaryButton}
            textSize={actuatedNormalize(18)}
            textcolor={colors.white}
          />
                
        </View>
        {/* <IconButton
            IconProvider={MaterialIcons}
            iconame="report"
            label="Report"
            iconcolor={colors.white}
            onpress={() =>navigation.navigate("Drawer")}
            size={18}
            styles={styles.SecondaryButton}
            textSize={actuatedNormalize(18)}
            textcolor={colors.white}
          /> */}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    rowGap: actuatedNormalize(20),
    justifyContent: 'center',
    paddingHorizontal: actuatedNormalize(20),
  },
  buttonGroup: {
    flexDirection: 'row',
    alignSelf: 'center',
    columnGap: actuatedNormalize(10),
    marginTop: actuatedNormalize(20),
  },
  PrimaryButton: {
    backgroundColor: colors.primary,
    height: actuatedNormalize(50),
    width: actuatedNormalize(150),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: actuatedNormalize(10),
    columnGap: actuatedNormalize(10),
  },
  SecondaryButton: {
    height: actuatedNormalize(50),
    width: actuatedNormalize(150),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: actuatedNormalize(10),
    columnGap: actuatedNormalize(10),
  },
  tertiaryButton: {
    height: actuatedNormalize(50),
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: actuatedNormalize(10),
    columnGap: actuatedNormalize(10),
  },
  questionText: {
    color: colors.gray,
    fontSize: actuatedNormalize(20),
    alignSelf: 'center',
    fontFamily: fonts.NexaRegular,
    textAlign:"center",
    width:"80%"
  },
  ratingContainer: {
    width: '100%',
    rowGap: actuatedNormalize(10),
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor:colors.dark,
    borderRadius: 10,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  labelText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default ReviewScreen;
