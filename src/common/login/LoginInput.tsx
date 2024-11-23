import React, { Dispatch } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  useWindowDimensions,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { actuatedNormalize } from '../../constants/PixelScaling';
import Modal from 'react-native-modal';
import Entypo from 'react-native-vector-icons/Entypo';
import { fonts } from '../../constants/fonts';
import LottieView from 'lottie-react-native';
import colors from '../../constants/colors';
import { PrimaryButton } from '../button/PrimaryButton';
import { RouteBackButton } from '../button/BackButton';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../AppNavigation/navigatorType';
import LabelInputComponent from '../inputs/labelInput';
import { Action } from '../../container/Registration/Registration';
import { Loader } from '../loader/loader';
import { Snackbar } from 'react-native-paper';
import { BlissyLoader } from '../loader/blissy';
const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
interface LoginScreenProps {
  handleOtp: () => void;
  state: {
    email: string;
  };
  dispatch: Dispatch<Action>;
  navigation: NativeStackNavigationProp<RootStackParamList>;
  modalState: boolean;
  isLoading: boolean;
  invalidEmail: boolean;
  AlreadyloggedinCase: boolean;
  setAlreadyloggedinCase: (val: boolean) => void;
}

export const validateEmail = (email: string) => {
  const EmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  console.log(EmailRegex.test(email), "from regex", email)
  return EmailRegex.test(email);
};

const MobileInput: React.FC<LoginScreenProps> = ({
  handleOtp,
  navigation,
  dispatch,
  state,
  modalState,
  isLoading,
  invalidEmail,
  AlreadyloggedinCase,
  setAlreadyloggedinCase
}) => {
  const { width: SCREEN_WIDTH } = useWindowDimensions();

  return (
    <>
      <Modal
        isVisible={modalState}
        style={styles.modal}
        backdropColor="transparent"
        animationInTiming={700}
        animationIn="slideInUp"
        hasBackdrop={false}
        // statusBarTranslucent={true}
        animationOut="slideOutDown">
        {!isLoading && <RouteBackButton onPress={() => navigation.canGoBack() ? navigation.goBack() : null} />}
        {isLoading ? (
          <View style={styles.loaderContainer}>
            <BlissyLoader/>
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
                  color: colors.white,
                  fontSize: actuatedNormalize(26),
                  alignSelf: 'center',
                }}>
                {'Enter Your Email'}
              </Text>
              <Text
                style={{
                  fontFamily: fonts.NexaBold,
                  color: '#868787',
                  textAlign: 'center',
                  fontSize: actuatedNormalize(12),
                  alignSelf: 'center',
                  lineHeight: actuatedNormalize(20),
                }}>
                {"let's keep it simple by email"}
              </Text>
            </View>
            <View style={styles.modalContent}>
              <View style={styles.inputContainer}>
                <LabelInputComponent
                  value={state.email}
                  type={'email'}
                  labelStyle={{ width: '100%' }}
                  name={'name'}
                  // maxLength={10}
                  placeholder="@"
                  validate={invalidEmail || AlreadyloggedinCase}
                  keyboardType={'email-address'}
                  errorText={invalidEmail ? 'Please Enter valid Email' : AlreadyloggedinCase ? "Email already logged in on another device." : ""}
                  onChangeText={dispatch}
                  IconProvider={Entypo}
                  IconName={'mail'}
                />
                <PrimaryButton
                  // disabled={state.email.length < 10}
                  styles={{
                    backgroundColor:
                      colors.primary,
                  }}
                  handleFunc={() => handleOtp()}
                  label="GET OTP"
                />
              </View>
            </View>
            {/* <Snackbar
        duration={2000}
        visible={AlreadyloggedinCase}
        style={{ backgroundColor: colors.black }}
        onDismiss={() => setAlreadyloggedinCase(false)}
        action={{
          theme: {
            fonts: {
              regular: { fontFamily: fonts.NexaRegular },
              medium: { fontFamily: fonts.NexaBold },
              light: { fontFamily: fonts.NexaBold },
              thin: { fontFamily: fonts.NexaRegular },
              
            },
            colors:{
              primary:colors.white,
              secondary:colors.white,

            }
          },
          label: 'Okay',
          textColor:colors.white,
          labelStyle: { fontFamily: fonts.NexaBold,color:colors.white },
          onPress: () => {
            // Do something
            setAlreadyloggedinCase(false);
          },
        }}>
        {"Email is already logged in to other device"}
      </Snackbar> */}
          </>
        )}
      </Modal>
     
    </>
  );
};

export default MobileInput;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    width: screenWidth,
    paddingHorizontal: actuatedNormalize(20),
    paddingVertical: actuatedNormalize(20),
  },
  inputContainer: {
    flex: 1,
    width: '100%',
    gap: actuatedNormalize(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    fontFamily: fonts.NexaXBold,
    backgroundColor: 'black',
    borderBottomWidth: 0,
    elevation: 3,
    borderTopRightRadius: actuatedNormalize(10),
    borderTopLeftRadius: actuatedNormalize(10),
    borderBottomRightRadius: actuatedNormalize(10),
    borderBottomLeftRadius: actuatedNormalize(10),
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
    position: 'relative',
    zIndex: 1,
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
    zIndex: 5,
    flex: 1,
    height: screenHeight,
    width: screenWidth,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.darkOverlayColor2,
  },
});
