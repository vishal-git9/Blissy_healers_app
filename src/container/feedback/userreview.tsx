import React, { useEffect, useRef, useState } from 'react';
import { View, TextInput, StyleSheet, KeyboardAvoidingView, Pressable, Dimensions } from 'react-native';
import { Button, Snackbar } from 'react-native-paper';
import { PrimaryButton } from '../../common/button/PrimaryButton';
import { RouteBackButton } from '../../common/button/BackButton';
import { Text } from 'react-native';
import colors from '../../constants/colors';
import { fonts } from '../../constants/fonts';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../AppNavigation/navigatorType';
import { actuatedNormalize } from '../../constants/PixelScaling';
import LiveItUpComponent from '../../common/drawer/liveitup';
import * as Animatable from 'react-native-animatable';
import StarRating from 'react-native-star-rating';
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import { useGetAppreviewQuery, usePostAppreviewMutation } from '../../api/feedbackservice';
import { useSelector } from 'react-redux';
import { AuthSelector } from '../../redux/uiSlice';
import { BlissyLoader } from '../../common/loader/blissy';
import useBackHandler from '../../hooks/usebackhandler';


const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const ratingColors: { [key: number]: string } = {
  1: colors.red,
  1.5: colors.red,
  2: colors.red,
  2.5: colors.red,
  3: colors.lightGray,
  3.5: colors.lightGray,
  4: colors.gold,
  5: colors.yellow,
};
interface UserreviewProps {
  navigation: NativeStackNavigationProp<RootStackParamList>;

}

export interface IAppReview extends Document {
  userId: string;
  appId: string;
  review: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

const UserreviewScreen: React.FC<UserreviewProps> = ({ navigation }) => {
  const [text, setText] = useState<string>('');
  const [rating, setRating] = useState(4);
  const [isreviewAdded, setisreviewAdded] = useState(false)
  const ratingRef = useRef<Animatable.AnimatableComponent<any, any>>(null);;
  const color = ratingColors[rating] || colors.yellow;
  const { user } = useSelector(AuthSelector)
  const [myappreview, setmyappreview] = useState<IAppReview[]>([])
  const [postappreview, { isLoading, isError, isSuccess }] = usePostAppreviewMutation()
  const { refetch, isLoading: isappreviewloading, isError: isappreviewerror, isSuccess: isappreviewsuccess } = useGetAppreviewQuery({})


  // calling use backhandler
  useBackHandler()

  React.useLayoutEffect(() => {
    navigation.setOptions(({
      headerShown: true,
      headerTitle: '',
      headerTintColor: colors.white,
      headerTitleStyle: { color: colors.white, fontFamily: fonts.NexaRegular, fontSize: actuatedNormalize(20) },
      headerTransparent: true,
      headerLeft: ({ }) => (
        <Pressable onPress={navigation.goBack} style={{ marginRight: 10 }}>
          {/* <Ionicons name="arrow-back" size={24} color={colors.white} /> */}
          <MaterialIcons name="segment" size={actuatedNormalize(30)} color={colors.white} />
        </Pressable >
      ),
      headerStyle: {
        backgroundColor: colors.transparent,
      },
    }))
  }, [navigation])

  const handlePress = async () => {

    setText("")
    if (text.trim()) {
      const res = await postappreview({
        userId: user?._id,
        username:user?.name,
        review: text,
        appId: user?._id,
        rating: rating,
      })

      if ('data' in res) {
        console.log(res, "data of reports")
        // fetch user details
        setisreviewAdded(true)
        refetch().then((res) => setmyappreview(res.data)).catch((err) => console.log(err))
      } else if ('error' in res) {
        console.log(res, "data of reports")
      }
      // setReports([...reports, { name: reportName, status: 'pending' }]);
      // setReportName('');
      // setView('view');
    }
    console.log('Button Pressed with Text:', text);
    // Add your desired action here
  };

  useEffect(() => {
    refetch().then((res) => setmyappreview(res.data)).catch((err) => console.log(err))
  }, [])

  console.log(myappreview, "myappreview----->")

  const Rendermyreview = () => {


    return (
      <View style={{flex:1,alignSelf:"center",width:"100%",justifyContent:"center",alignItems:"center",marginTop:50,rowGap:10 }}>
        <Text style={{ color: colors.lightGray, fontFamily: fonts.NexaItalic ,fontSize:actuatedNormalize(18),textAlign:"center"}}>'{myappreview[0]?.review}'</Text>
        <StarRating
                disabled={true}
                rating={myappreview[0]?.rating}
                halfStarEnabled={true}
                animation="rotate"
                emptyStarColor={colors.gray}
                starSize={15}
                fullStarColor={color}
                activeOpacity={1}

                selectedStar={rating => {
                  if (ratingRef.current?.fadeIn) {
                    ratingRef.current?.fadeIn(800);
                  }

                  setRating(rating)
                }}
                containerStyle={{ width: '40%',alignSelf:"center" }}
              />
        <Text style={{ color: colors.white, fontFamily: fonts.NexaRegular }}>{user?.name}</Text>
      </View>
    )
  }

  return (
    <>
      <KeyboardAvoidingView style={styles.container}>
        {(isLoading || isappreviewloading) && <View style={styles.loaderContainer}>
          <BlissyLoader />
        </View>}



        {/* <RouteBackButton onPress={() => navigation.goBack()} /> */}
        {/* <Text style={{ color: colors.white, alignSelf: "center", fontFamily: fonts.NexaBold, fontSize: actuatedNormalize(23), marginTop: actuatedNormalize(5) }}>App Review</Text> */}
        {
          myappreview.length > 0 ? <Rendermyreview /> : (<>
            <TextInput
              style={styles.textarea}
              multiline={true}
              numberOfLines={6}
              onChangeText={setText}
              value={text}
              placeholder="Write your App review here..."
            />

            <View style={styles.ratingContainer}>
              {/* <Animatable.Text
                      animation={'fadeIn'}
                      ref={ratingRef}
                      style={{
                        color: colors.white,
                        fontSize: actuatedNormalize(20),
                        fontFamily: fonts.NexaBold,
                      }}>
                      {rating >= 1 && rating <=2.5
                        ? 'Bad'
                        : rating >=3 && rating < 4
                        ? 'Good'
                        : rating === 4 || rating===4.5
                        ? 'Great' : rating === 5 ? "Amazing"
                        : null}
                    </Animatable.Text> */}
              <StarRating
                disabled={false}
                rating={rating}
                halfStarEnabled={true}
                animation="rotate"
                emptyStarColor={colors.gray}
                starSize={20}
                fullStarColor={color}
                activeOpacity={1}
                selectedStar={rating => {
                  if (ratingRef.current?.fadeIn) {
                    ratingRef.current?.fadeIn(800);
                  }

                  setRating(rating)
                }}
                containerStyle={{ width: '50%' }}
              />
            </View>
            <PrimaryButton styles={{ width: "100%", marginTop: actuatedNormalize(40) }} label='Send' handleFunc={handlePress} />
          </>
          )}
          <View style={{flex:1,justifyContent:"flex-end",width:"100%"}}>
          <LiveItUpComponent />

          </View>
      </KeyboardAvoidingView>
      <Snackbar
        duration={5000}
        visible={isreviewAdded}
        style={{ backgroundColor: colors.dark }}
        onDismiss={() => setisreviewAdded(false)}
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
            setisreviewAdded(false);
          },
        }}>
        Thanks for submitting the review !
      </Snackbar>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: actuatedNormalize(20),

  },
  loaderContainer: {
    position: 'absolute',
    zIndex: 2,
    flex: 1,
    height: screenHeight,
    width: screenWidth,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.darkOverlayColor2,
  },
  ratingContainer: {
    width: '100%',
    rowGap: actuatedNormalize(10),
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    // backgroundColor:colors.dark,
  },
  textarea: {
    height: actuatedNormalize(200),
    padding: actuatedNormalize(10),
    marginBottom: actuatedNormalize(20),
    marginTop: actuatedNormalize(50),
    paddingHorizontal: actuatedNormalize(15),
    paddingVertical: actuatedNormalize(15),
    fontFamily: fonts.NexaRegular,
    color: colors.white,
    borderRadius: actuatedNormalize(20), // Updated for rounded corners
    backgroundColor: colors.dark, // Updated for the input background color
    textAlignVertical: 'top', // Ensures the text starts at the top
  },
  button: {
    paddingVertical: actuatedNormalize(10),
  },
});

export default UserreviewScreen;
