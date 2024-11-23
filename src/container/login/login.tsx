import React, { useEffect, useReducer, useRef, useState } from 'react';
import { AppState, AppStateStatus, Keyboard, StyleSheet, View } from 'react-native';
import { Action } from '../Registration/Registration';
import MobileInput from '../../common/login/LoginInput';
import OTPInput from '../../common/login/otpInput';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { NavigationStackProps } from '../Prelogin/onboarding';
import { useGetOtpMutation, useVerifyOtpMutation } from '../../api/authService';
import { useDispatch, useSelector } from 'react-redux';
import { AuthSelector, setNewlyInstalled, setSessionStatus, setUserState } from '../../redux/uiSlice';
import { useGetUserQuery, useLazyGetUserQuery } from '../../api/userService';
import { actuatedNormalize } from '../../constants/PixelScaling';
import HelloModal from '../../common/modals/middleScreen';

interface LoginInterface {
  email: string;
  OTP: string;
}
const intialState: LoginInterface = {
  email: '',
  OTP: '',
};

export const validateEmail = (email: string) => {
  const EmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  console.log(EmailRegex.test(email), "from regex", email)
  return EmailRegex.test(email);
};

export const reducerAction = (state: LoginInterface, action: Action) => {
  const key = action.type;
  switch (action.type) {
    case action.type: {
      // Note: This should be case key:
      return {
        ...state,
        [key]: action.payload,
      };
    }
    case "RESET":
      return intialState

    default:
      return state;
  }
};
export const LoginScreen: React.FC<NavigationStackProps> = ({ navigation }) => {
  const [state, dispatch] = useReducer(reducerAction, intialState);
  const [isOtpSent, setIsOtpSent] = useState<boolean>(false);
  const [resendOtp, setResendOtp] = useState<boolean>(false)
  const [modalState, setModalState] = useState<boolean>(true)
  const [AlreadyloggedinCase, setAlreadyloggedinCase] = useState<boolean>(false)
  const [progressDuration, setProgressDuration] = useState(60);
  const [otpAlreadySentCase, SetotpAlreadySentCase] = useState(false)
  const [invalidEmail, setEnvalidEmail] = useState<boolean>(false);
  const [welcomeModal, setwelcomeModal] = useState<{ visible: boolean, isNew: boolean }>({ visible: false, isNew: false });
  const timerRef = useRef<NodeJS.Timeout>();
  const appState = useRef(AppState.currentState);
  const backgroundTimeRef = useRef<number | null>(null);
  const [getOtp, { error, data, isLoading, reset: resetMobile }] = useGetOtpMutation();
  const { token, isAuthenticated, user, isRegisterd,isNewlyInstalled } = useSelector(AuthSelector)
  const [ refetchUser,{data: userData, isLoading: userLoading }]= useLazyGetUserQuery()
  const [OtpVerify, { error: verifyOtpErr, data: verifyOtpData, isLoading: verifyOtpLoading, reset }] = useVerifyOtpMutation()

  const reduxDispatch = useDispatch()
  // console.log(user, isNewUser, isRegisterd, "------user--------")
  const handleSubmitMobileNumber = async () => {
    if (validateEmail(state?.email)) {
      const loginEmail = state?.email?.toLowerCase()
      console.log(loginEmail,"loginemail-------->")
      const res = await getOtp({ email: loginEmail });
      console.log(res, "---res-----", error)
      if ('data' in res) {
        console.log(data, "data of MobileNumber")
        setIsOtpSent(true);
      } else if ('error' in res) {
        if (res.error?.data?.message === "OTP already sent") {
          setIsOtpSent(true);
          SetotpAlreadySentCase(true)
        } else if (res.error?.data?.code === "GEN_800") {
            setAlreadyloggedinCase(true)
        }
        console.log(error)
      }
    } else {
      setEnvalidEmail(true)
    }
  };

  const handleOtpSubmit = async () => {
    const loginEmail = state?.email?.toLowerCase()
    const res = await OtpVerify({ email: loginEmail, otp: parseInt(state.OTP) });

    if ('data' in res) {
      console.log(res, "OTP VERIFIED------>")
      const isNewuser =  (await refetchUser()).data
      // fetch user details
      // use   .unwrap()
      // console.log(isNewUser, "newUser from login---")
      setModalState(false)
      console.log(isNewuser, "---user isnewuser")
      if (isNewuser?.data?.user?.isNewUser) {
        console.log(isNewuser?.data?.user, "---user here isnewuser")
        reduxDispatch(setSessionStatus(false))
        reduxDispatch(setNewlyInstalled(false))
        setwelcomeModal({ visible: true, isNew: true })
      } else {
        console.log(isNewuser?.data?.user, "---user here2 isnewuser")
        setwelcomeModal({ visible: true, isNew: false })
        reduxDispatch(setSessionStatus(false))
        reduxDispatch(setUserState(false))
      }
    } else if ('error' in res) {
      console.log(res, "res of otp")
      console.log(verifyOtpErr, "error of otp")
    }
  };
  useEffect(() => {
    if (isOtpSent || resendOtp) {
      timerRef.current = setInterval(() => {
        setProgressDuration(prevDuration => {
          if (prevDuration === 0) {
            clearInterval(timerRef.current);
          }
          return prevDuration > 0 ? prevDuration - 1 : 0;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () =>{
      clearInterval(timerRef.current);
      backgroundTimeRef.current = null
    } 
  }, [isOtpSent, resendOtp]);

  console.log(progressDuration,"progress")

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        if (backgroundTimeRef.current) {
          const backgroundDuration = Date.now() - backgroundTimeRef.current;
          const newProgressDuration = progressDuration - Math.floor(backgroundDuration / 1000);
          
          // Ensure the duration doesn't go below zero
          if (progressDuration > 0) {
            setProgressDuration(prevDuration => Math.max(prevDuration - Math.floor(backgroundDuration / 1000), 0));
          }
          backgroundTimeRef.current = null;
        }
      } else if (nextAppState.match(/inactive|background/)) {
        backgroundTimeRef.current = Date.now();
      }
      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, [progressDuration]);

  useEffect(() => {
    if (state.OTP.length === 4) {
      // Call OTP verification function here
      Keyboard.dismiss();
      if(timerRef.current){
        clearInterval(timerRef.current);
      }
      handleOtpSubmit()
    }


    return ()=>{
      clearInterval(timerRef.current);
    }
  }, [state.OTP]);



  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      resetScrollToCoords={{ x: 0, y: 0 }}
      scrollEnabled={true}
      style={styles.container}>

      {
        welcomeModal.visible ? welcomeModal.isNew ? <HelloModal
          modalTitleStyle={{ marginTop: actuatedNormalize(-20) }}
          onPressPrimaryButton={() => {
            setwelcomeModal({ visible: false, isNew: false })
            navigation.navigate('Registration', { UserData: null });
          }}
          showLottie={true}
          lottieAnimationPath={require('../../../assets/animation/hello.json')}
          title={`Hello Healer`}
          description="there is lot to discover out there but let's set you up first"
          visible={welcomeModal.visible}
          onClose={() => console.log("closed")}
        /> : <HelloModal
          modalTitleStyle={{ marginTop: actuatedNormalize(-20) }}
          onPressPrimaryButton={() => {
            setwelcomeModal({ visible: false, isNew: false })
            navigation.navigate('Drawer');
          }}
          showLottie={true}
          lottieAnimationPath={require('../../../assets/animation/hello.json')}
          title={`Welcome Back`}
          description={`${user?.name} We're glad to have you with us again`}
          visible={welcomeModal.visible}
          onClose={() => console.log("closed")}
        /> : null
      }
      {!isOtpSent ? (
        <MobileInput
          AlreadyloggedinCase={AlreadyloggedinCase}
          setAlreadyloggedinCase={setAlreadyloggedinCase}
          invalidEmail={invalidEmail}
          isLoading={isLoading}
          modalState={modalState}
          state={state}
          dispatch={dispatch}
          navigation={navigation}
          handleOtp={handleSubmitMobileNumber}
        />
      ) : (
        <OTPInput
          otpAlreadySent={otpAlreadySentCase}
          setAlreadyOtpSent={SetotpAlreadySentCase}
          setIsOtpSent={setIsOtpSent}
          setResendOtp={setResendOtp}
          isError={verifyOtpErr}
          handleSubmitMobileNumber={handleSubmitMobileNumber}
          isLoading={verifyOtpLoading}
          modalState={modalState}
          state={state}
          changeMobileNumber={() => {
            dispatch({ type: "OTP", payload: "" })
            setIsOtpSent(false)
            reset()
            clearInterval(timerRef.current)
            setProgressDuration(60)
          }}
          retry={reset}
          resendOtp={resendOtp}
          dispatch={dispatch}
          progressDuration={progressDuration}
          setProgressDuration={setProgressDuration}
        />
      )}
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative'
  },
  loaderContainer: {
    position: "absolute",
    backgroundColor: "red",
    zIndex: 200,
    top: actuatedNormalize(250),
    left: actuatedNormalize(150),
  }
});
