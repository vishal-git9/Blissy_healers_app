import React, { Dispatch } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  useWindowDimensions,
  Dimensions,
} from 'react-native';
import Modal from 'react-native-modal';
import LottieView from 'lottie-react-native';
import { actuatedNormalize } from '../../constants/PixelScaling';
import { fonts } from '../../constants/fonts';
import colors from '../../constants/colors';
import ProgressBar from './ProgressBar';
import OTPTextInput from 'react-native-otp-textinput';
import { RouteBackButton } from '../button/BackButton';
import { Action } from '../../container/Registration/Registration';
import { Loader } from '../loader/loader';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';
import { PrimaryButton } from '../button/PrimaryButton';
import { Snackbar } from 'react-native-paper';
import { BlissyLoader } from '../loader/blissy';
const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

interface OTPInputProps {
  progressDuration: number;
  changeMobileNumber: () => void;
  retry: () => void;
  handleSubmitMobileNumber:()=>void;
  setProgressDuration: (a: number) => void;
  dispatch: Dispatch<Action>;
  modalState: boolean;
  resendOtp:boolean;
  setIsOtpSent:(a:boolean) => void;
  setResendOtp:(a:boolean) => void;
  isLoading: boolean;
  setAlreadyOtpSent:(a:boolean)=>void;
  otpAlreadySent:boolean;
  state: {
    email: string;
  };
  isError: FetchBaseQueryError | SerializedError | undefined;
}

const OTPInput: React.FC<OTPInputProps> = ({
  progressDuration,
  otpAlreadySent,
  setAlreadyOtpSent,
  setProgressDuration,
  dispatch,
  resendOtp,
  setResendOtp,
  handleSubmitMobileNumber,
  changeMobileNumber,
  modalState,
  setIsOtpSent,
  isLoading,
  isError,
  state,
  retry,
}) => {
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  console.log('at the otp screen',progressDuration);
  return (
    <>
      <Modal
        isVisible={modalState}
        style={styles.modal}
        hasBackdrop={false}
        backdropColor="transparent"
        animationInTiming={1000}
        animationIn="slideInUp"
        animationOut="slideOutDown">
        <RouteBackButton onPress={changeMobileNumber} />
        {isLoading && (
          <View style={styles.loaderContainer}>
            <BlissyLoader/>
          </View>
        )}
        {isError ? (
          <View style={styles.loaderContainer}>
            <LottieView
              source={require('../../../assets/animation/wrong.json')}
              style={{
                width: SCREEN_WIDTH * 0.9,
                height: SCREEN_WIDTH * 0.9,
                alignSelf: 'center',
              }}
              autoPlay
              loop
            />
            <Text
              style={{
                color: colors.white,
                fontFamily: fonts.NexaXBold,
                fontSize: actuatedNormalize(20),
                marginTop: actuatedNormalize(-50),
              }}>
                {progressDuration === 0 ? "OTP Expired" : "Wrong OTP"}
            </Text>
            <PrimaryButton
              label={progressDuration === 0 ? "Resend" :"Try again"}
              styles={{
                width: '50%',
                backgroundColor: colors.transparent,
                borderWidth: 1,
                borderColor: colors.bag1Bg,
                marginTop: actuatedNormalize(20),
              }}
              handleFunc={retry}
            />
          </View>
        ) : (
          <>
            <LottieView
              source={require('../../../assets/animation/AnimationMobile.json')}
              style={{
                width: SCREEN_WIDTH * 0.9,
                height: SCREEN_WIDTH * 0.9,
                alignSelf: 'center',
              }}
              autoPlay
              loop
            />
            <View
              style={{
                alignSelf: 'center',
                paddingHorizontal: actuatedNormalize(20),
                gap: actuatedNormalize(5),
                marginBottom: actuatedNormalize(20),
              }}>
              <Text
                style={{
                  fontFamily: fonts.NexaBold,
                  // color: '#868787',
                  color: 'white',
                  fontSize: actuatedNormalize(26),
                  alignSelf: 'center',
                }}>
                {'Enter Your OTP'}
              </Text>
              <View></View>
              <Text
                style={{
                  fontFamily: fonts.NexaBold,
                  color: '#868787',
                  textAlign: 'center',
                  fontSize: actuatedNormalize(12),
                  alignSelf: 'center',
                  lineHeight: actuatedNormalize(20),
                }}>
                {`Enter OTP we sent to ${state.email} This code will expire in ${progressDuration}s`}
              </Text>

              <ProgressBar duration={60} progressDuration={progressDuration} />
            </View>
            <View
              style={[
                styles.modalContent,
                {
                  justifyContent: 'center',
                  alignItems: 'center',
                  rowGap: actuatedNormalize(15),
                  position:"relative"
                },
              ]}>
                 {/* <Text
                      style={{ color: colors.white, fontFamily: fonts.NexaXBold,position:"absolute",top:actuatedNormalize(25),right:actuatedNormalize(25)}}>
                      OTP: 4321
                    </Text> */}
              <OTPTextInput
                containerStyle={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  columnGap: actuatedNormalize(5),
                }}
                inputCount={4}
                autoFocus
                handleTextChange={text =>
                  dispatch({ type: 'OTP', payload: text })
                }
                 
                textInputStyle={styles.otpStyles}
              />
              {/* <PrimaryButton
          handleFunc={() => {
            clearInterval(timer);
          }}
          label="Verify"
        /> */}
              {progressDuration === 0 && (
                <View
                  style={{
                    flexDirection: 'row',
                    alignSelf: 'center',
                    columnGap: actuatedNormalize(10),
                  }}>
                  <Text
                    style={{ color: '#868787', fontFamily: fonts.NexaRegular }}>
                    Didn't receive the code?
                  </Text>
                  <TouchableWithoutFeedback
                    onPress={() => {
                      retry()
                      handleSubmitMobileNumber()
                      // setIsOtpSent(false)
                      setResendOtp(!resendOtp)
                      setProgressDuration(60)
                    }}>
                    <Text
                      style={{ color: '#1E5128', fontFamily: fonts.NexaXBold }}>
                      Resend OTP
                    </Text>
                  </TouchableWithoutFeedback>
                </View>
              )}
            </View>

            <Snackbar
            duration={2000}
            visible={otpAlreadySent}
            style={{backgroundColor: colors.black}}
            onDismiss={() => setAlreadyOtpSent(false)}
            theme={{
              colors: {
                inverseOnSurface: colors.white,
                surface: colors.white
              },
            }}
            action={{
              theme: {
                fonts: {
                  regular: {fontFamily: fonts.NexaRegular},
                  medium: {fontFamily: fonts.NexaBold},
                  light: {fontFamily: fonts.NexaBold},
                  thin: {fontFamily: fonts.NexaRegular},
                },
              },
              label: 'Okay',
              labelStyle: {fontFamily: fonts.NexaBold},
              onPress: () => {
                // Do something
                setAlreadyOtpSent(false);
              },
            }}>
            {"OTP Already sent to your mail"}
          </Snackbar>
          </>
        )}
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  otpStyles: {
    backgroundColor: 'black',
    elevation: 2,
    borderWidth: 0,
    color: 'white',
    height: actuatedNormalize(60),
    width: actuatedNormalize(60),
    padding: actuatedNormalize(5),
    borderTopRightRadius: actuatedNormalize(10),
    borderTopLeftRadius: actuatedNormalize(10),
    borderBottomRightRadius: actuatedNormalize(10),
    borderBottomLeftRadius: actuatedNormalize(10),
    borderColor: 'white',
    borderBottomWidth: 0,
  },
  img: {
    height: screenHeight,
    width: screenWidth,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: colors.dark,
    height: screenHeight / 3,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: actuatedNormalize(20),
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
});

export default OTPInput;
