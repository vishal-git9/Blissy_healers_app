import { RouteProp } from '@react-navigation/native';
import { useCallback, useEffect, useReducer, useState } from 'react';
import { BackHandler, Dimensions, Text, View, useWindowDimensions } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { RouteBackButton, RouteBackButton2 } from '../../common/button/BackButton';
import StepperFormAnimation from '../../common/forms/StepperFormAnimation';
import { actuatedNormalize } from '../../constants/PixelScaling';
import React from 'react';
import Form1 from '../../common/forms/Form1';
import Form2 from '../../common/forms/Form2';
import Form3 from '../../common/forms/Form3';
import Form4 from '../../common/forms/Form4';
import colors from '../../constants/colors';
import { fonts } from '../../constants/fonts';
import ProgressBar from '../../common/login/ProgressBar';
import { StyleSheet } from 'react-native';
import { PrimaryButton } from '../../common/button/PrimaryButton';
import Form5 from '../../common/forms/Form5';
import HelloModal from '../../common/modals/middleScreen';
import { Snackbar } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../AppNavigation/navigatorType';
import { useGetUserQuery, usePostUserMutation } from '../../api/userService';
import { Loader } from '../../common/loader/loader';
import { Pressable } from 'react-native';
import SelectMentalissue from "../../common/forms/SelectMentalissue"
import InputBio from "../../common/forms/InputBio"
import Ionicons from "react-native-vector-icons/Ionicons"
import { BlissyLoader } from '../../common/loader/blissy';
import useBackHandler from '../../hooks/usebackhandler';
const screenWidth = Dimensions.get('window').width;

// export const reducerAction = (state, action) => {
//   const key = action.type;
//   switch (action.type) {
//     case action.type: {
//       return {
//         ...state,
//         [key]: action.text,
//       };
//     }
//   }
// };

export interface Action {
  type: string;
  payload?: string | string[] | number; // Change the type of text as per your requirement
}

export interface UserState {
  name: string;
  gender: string;
  bio: string;
  language: string[];
  interest: string[];
  mentalIssues: string[];
  age: number;
  profilePic: string
}

interface error1 {
  name?: string;
}
interface error2 {
  interest?: string;
}
interface error3 {
  mentalIssues?: string;
}
interface error4 {
  bio?: string;
}
interface error5 {
  language?: string;
}
interface error6 {
  gender?: string;
}

type RegistrationRouteProp = RouteProp<RootStackParamList, 'Registration'>;

interface RegistrationInterface {
  navigation: NativeStackNavigationProp<RootStackParamList>;
  route: RegistrationRouteProp
}

// interface error5 {
//   age:string;
// }

const initialState: UserState = {
  name: '',
  gender: 'male',
  language: ['English'],
  bio: "I'm an adventurous professional looking to connect with others. Love hiking and the great outdoors.",
  interest: ['Music'],
  mentalIssues: ['Anxiety', 'Breakup'],
  age: 16,
  profilePic: ""
};

export const reducerAction = (state: UserState, action: Action) => {
  const key = action.type;
  switch (action.type) {
    case action.type: {
      // Note: This should be case key:
      return {
        ...state,
        [key]: action.payload,
      };
    }
    default:
      return state;
  }
};
export const Registration: React.FC<RegistrationInterface> = ({ navigation, route }) => {
  const UserData = route?.params?.UserData
  //handle error params of undefined
  // handle undefined is not a function
  const RegistrationState = UserData || initialState
  const [state, dispatch] = useReducer(reducerAction, RegistrationState);
  const [error, setError] = useState<(error1 | error2 | error3 | error4 | error5 | error6)[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [UsernameModal, setUsernameModal] = useState<boolean>(false);
  const [errorSnackbar, setErrorSnackbar] = useState<boolean>(false);
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const [steps, setSteps] = useState<number>(1);
  const [postUser, { isLoading, isError, data }] = usePostUserMutation()
  const { data: userData, isLoading: userLoading, refetch } = useGetUserQuery()
  const [completeModal, setCompleteModal] = useState<boolean>(false);


  React.useLayoutEffect(() => {
    navigation.setOptions(({
      headerShown: UserData && steps === 1 ? true : false,
      headerTitle: '',
      headerTintColor: colors.white,
      headerTitleStyle: { color: colors.white, fontFamily: fonts.NexaRegular, fontSize: actuatedNormalize(20) },
      headerTransparent: true,
      headerLeft: ({ }) => (
        <Pressable onPress={navigation.goBack} style={{ marginRight: 10 }}>
          {/* <Ionicons name="arrow-back" size={24} color={colors.white} /> */}
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </Pressable >
      ),
      headerStyle: {
        backgroundColor: colors.transparent,
      },
    }))
  }, [navigation, steps])


  const handleBackhandler = useCallback(() => {

    if (UserData) {
      if (steps === 1) {
        if (navigation.canGoBack()) {
          navigation.goBack()
        }
      } else {
        setSteps(steps => steps - 1)
      }
    } else {
      if (steps > 1) {
        console.log("Calling------->")
        setSteps(steps => steps - 1)

      } else {
        return true
      }
    }
  }, [steps])


  useBackHandler(handleBackhandler)




  const handleUserName = () => {
    const errorPostion = error[steps - 1];
    console.log(errorPostion, 'error positon');
    setErrorMessage(Object.values(errorPostion)[0]);
    if (Object.keys(errorPostion).length !== 0) {
      setErrorSnackbar(true);
      return;
    } else {
      setUsernameModal(true);
    }
  };

  const handleCompleteModal = async () => {
    await handleSubmitUserProfile()
    setCompleteModal(true);
  };

  const handleSubmitUserProfile = async () => {
    //call api here
    console.log(state, "state of the user")

    const res = await postUser(state)

    console.log(res, "resof===")
    if ('data' in res) {
      console.log(res, "data of user")
      await refetch()
    } else if ('error' in res) {
      console.log(error)
    }
  };

  const validateForm = (state: UserState) => {
    const errors: error1 = {};
    const errors2: error2 = {};
    const errors3: error3 = {};
    const errors4: error4 = {};
    const errors5: error5 = {};
    const errors6: error6 = {};

    if (state?.name?.trim() === '') {
      errors.name = 'your name defines you c write';
    }
    if (state?.interest?.length < 3) {
      errors2.interest = 'please select at least 3 Interest';
    }

    if (state?.language?.length === 0) {
      errors5.language = 'please select at least one Language';
    }
    if (state?.gender?.trim() === '') {
      errors6.gender = 'please select your gender';
    }
    if (state?.bio?.trim()?.length && state?.bio?.trim()?.length <= 80) {
      errors4.bio = 'bio should be at least 80 words';
    }
    if (state?.mentalIssues?.length < 1) {
      errors3.mentalIssues = 'please select at least one mental issues';
    }
    if (state?.mentalIssues?.length > 6) {
      errors3.mentalIssues = 'you can select up to 6 mental issues';
    }
    return [errors, errors2, errors3, errors4, errors5, errors6];
  };

  const validateStepsForm = () => {
    const errorPostion = error[steps - 1];
    console.log(steps, "steps------->")
    console.log(errorPostion, 'error positon');
    setErrorMessage(Object.values(errorPostion)[0]);
    if (Object.keys(errorPostion).length !== 0) {
      setErrorSnackbar(true);
      return;
    } else {
      setSteps(prev => prev + 1);
    }
  };

  useEffect(() => {
    const res = validateForm(state);
    console.log(res, 'Res');
    setError(res);
    // ToastAndroid.show('Added Successfully !', ToastAndroid.SHORT);
  }, [state]);

  // useEffect(() => {
  //   const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true)
  //   return () => backHandler.remove()
  // }, [])

  // console.log(state, '--registration state---');
  // console.log(isLoading, userLoading, "===loadingstate===")
  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      resetScrollToCoords={{ x: 0, y: 0 }}
      scrollEnabled={true}>
      {steps !== 1 && (
        <RouteBackButton2 containerstyle={{
          alignSelf: "flex-start",
          // backgroundColor:"red",
        }} onPress={() => setSteps(steps => steps - 1)} />
      )}
      {(isLoading || userLoading) && <BlissyLoader />}
      <HelloModal
        modalTitleStyle={{ marginTop: actuatedNormalize(-20) }}
        onPressPrimaryButton={() => {
          setUsernameModal(false);
          setSteps(steps => steps + 1);
        }}
        showLottie={true}
        lottieAnimationPath={require('../../../assets/animation/hello.json')}
        title={`Hello ${state.name}`}
        description="You're almost there! Just six more steps to go"
        visible={UsernameModal}
        onClose={() => setUsernameModal(false)}
      />
      <HelloModal
        onPressPrimaryButton={() => {
          setCompleteModal(false);
          setSteps(1)
          navigation.navigate('Drawer')
        }}
        title={`You're all set`}
        description={UserData ? "Your account has been updated now let's start healing" : "Your account set up is completed now let's start healing"}
        visible={completeModal}
        lottieAnimationPath={require('../../../assets/animation/verified.json')}
        showLottie={true}
        onClose={() => setCompleteModal(false)}
      />
      <View
        style={{
          flex: 3,
          width: SCREEN_WIDTH,
          paddingHorizontal: actuatedNormalize(20),
          paddingVertical: actuatedNormalize(20),
          rowGap: actuatedNormalize(20),
        }}>
        <StepperFormAnimation currentStep={steps} onNext={validateStepsForm}>
          <Form1 state={state} dispatch={dispatch} />
          <Form2 state={state} dispatch={dispatch} />
          <SelectMentalissue state={state} dispatch={dispatch} />
          <InputBio state={state} dispatch={dispatch} />
          <Form3 state={state} dispatch={dispatch} />
          <Form4 state={state} dispatch={dispatch} />
          <Form5 state={state} dispatch={dispatch} />
        </StepperFormAnimation>
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            margin: 0,
          }}>
          <View
            style={{
              flexDirection: 'row',
              columnGap: actuatedNormalize(5),
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <View
              style={{
                width: '30%',
                flexDirection: 'row',
                columnGap: actuatedNormalize(5),
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: colors.primary,
                  fontFamily: fonts.NexaXBold,
                  fontSize: actuatedNormalize(20),
                }}>
                {steps}
              </Text>
              <Text
                style={{
                  color: steps === 7 ? colors.primary : colors.white,
                  fontFamily: fonts.NexaRegular,
                  fontSize: actuatedNormalize(16),
                }}>
                /7
              </Text>
            </View>
            <View style={{ width: '50%' }}>
              <PrimaryButton
                label={steps === 7 ? UserData ? "Let's Update" : "Let's Heal" : 'Next'}
                handleFunc={
                  steps === 1
                    ? handleUserName
                    : steps === 7
                      ? handleCompleteModal
                      : validateStepsForm
                }
              />
            </View>
          </View>
          <ProgressBar duration={7} progressDuration={steps} />
          <Snackbar
            duration={2000}
            visible={errorSnackbar}
            style={{ backgroundColor: colors.black }}
            onDismiss={() => setErrorSnackbar(false)}
            // theme={{
            //   fonts: {
            //     regular: { fontFamily: fonts.NexaRegular },
            //     medium: { fontFamily: fonts.NexaBold },
            //     light: { fontFamily: fonts.NexaBold },
            //     thin: { fontFamily: fonts.NexaRegular },
            //     bodyMedium:{fontFamily:fonts.NexaItalic}
            //   },
            // }}
            theme={{
              colors: {
                inverseOnSurface: colors.white,
                surface: colors.white
              },
            }}
            action={{
              label: 'Okay',

              labelStyle: { fontFamily: fonts.NexaBold, color: colors.white },
              onPress: () => {
                // Do something
                setErrorSnackbar(false);
              },
            }}>
            {errorMessage}
          </Snackbar>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    width: screenWidth,
    paddingHorizontal: actuatedNormalize(20),
    paddingVertical: actuatedNormalize(20),
  },
});
