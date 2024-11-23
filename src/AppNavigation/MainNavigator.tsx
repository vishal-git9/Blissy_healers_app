import * as React from 'react';
import { LinkingOptions, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnboardingScreen from '../container/Prelogin/onboarding';
import { Registration } from '../container/Registration/Registration';
import { RootStackParamList } from './navigatorType';
import { LoginScreen } from '../container/login/login';
import { HealerList } from '../common/healerList/healerlist';
import { Healerdetails } from '../common/healerList/healerdetails';
import { DrawerNavigator } from './Drawer';
import NetInfo from '@react-native-community/netinfo';
import ChatListScreen from '../container/Connection/chatlist';
import ChatWindowScreen from '../container/Connection/chatwindow';
import ReviewScreen from '../container/Connection/review';
import GlobalBackHandler from './Globalbackhandler';
import VoiceCall from '../container/audioCall/audiocall';
import { ComingSoon } from '../container/comingsoon/comingsoon';
import { Coupons } from '../container/coupons/coupons';
import ChatPartnerDetails from '../container/Connection/chatPartnerDetails';
import { navigationRef } from '../utils/RootNavigation';
import { SessionError } from '../container/InfoModal/SessionError';
import { useDispatch } from 'react-redux';
import { setConnectionStatus } from '../redux/uiSlice';
import { ConnectionModal } from '../container/InfoModal/ConnectionModal';
import BugReportScreen from '../container/feedback/bugreport';
import UserreviewScreen from '../container/feedback/userreview';
import OutgoingCallScreen from '../container/Home/outgoing';
import colors from '../constants/colors';
import { TouchableOpacity } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons"
import CalllistData from '../container/Connection/callinfo';
import { fonts } from '../constants/fonts';
import { actuatedNormalize } from '../constants/PixelScaling';
import withPermissions from '../hooks/permissionsHoc';
import { AppUpdateModal } from '../common/modals/Appupdate';
import IncomingCallScreen from '../common/call/incomingcallMain';
import PrivateVoicecall from '../container/audioCall/privatecall';
// import { navigationRef } from '../utils/notificationService';

const deepLinksConf = {
  screens: {
    HomeRoutes: {
      screens: {
        Chatlist: 'Chatlist',
        Chatwindow: 'Chatwindow',
      },
    },
  },
};

const linking = {
  prefixes: ['myapp://', 'https://app.myapp.com'],
  config: deepLinksConf,
  // async getInitialURL() {
  //   // Check if app was opened from a deep link
  //   const url = await Linking.getInitialURL();

  //   if (url != null) {
  //     return url;
  //   }

  //   // Check if there is an initial firebase notification
  //   const message = await messaging().getInitialNotification();

  //   // Get deep link from data
  //   // if this is undefined, the app will open the default/home page
  //   return message?.data?.link;
  // },
  // subscribe(listener) {
  //   const onReceiveURL = ({url}: {url: string}) => listener(url);

  //   // Listen to incoming links from deep linking
  //   Linking.addEventListener('url', onReceiveURL);

  //   // Listen to firebase push notifications
  //   const unsubscribeNotification = messaging().onNotificationOpenedApp(
  //     (message) => {
  //       const url = message?.data?.link;

  //       if (url) {
  //         // Any custom logic to check whether the URL needs to be handled

  //         // Call the listener to let React Navigation handle the URL
  //         listener(url);
  //       }
  //     },
  //   );

  //   return () => {
  //     // Clean up the event listeners
  //     Linking.removeEventListener('url', onReceiveURL);
  //     unsubscribeNotification();
  //   };
  // },
}


const Stack = createNativeStackNavigator<RootStackParamList>();

interface MainNavigatorProps {
  isLoggedIn: Boolean;
  isNewUser: Boolean;
}
const MainNavigator: React.FC<MainNavigatorProps> = ({
  isLoggedIn,
  isNewUser,
}) => {

  const dispatch = useDispatch();

  React.useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      dispatch(setConnectionStatus(state.isConnected));
    });

    return () => unsubscribe();
  }, [dispatch]);


  console.log(isLoggedIn, isNewUser, "isLoggedin")
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName={
          isLoggedIn
            ? isNewUser
              ? 'Registration' // If the user is logged in and is a new user, navigate to the 'Registration' screen.
              : 'Drawer' // If the user is logged in but is not a new user, navigate to the 'Home' screen.
            : 'Onboarding' // If the user is not logged in, navigate to the 'Onboarding' screen.
        }
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          animationTypeForReplace: 'push',
          animation: 'slide_from_left',
          animationDuration: 2000,
          contentStyle: { backgroundColor: 'rgb(0, 0, 0)' },
        }}>
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Registration" component={Registration} />
        <Stack.Screen name="Healerlist" component={HealerList} />
        <Stack.Screen name="Healerdetails" component={Healerdetails} />
        <Stack.Screen name="Drawer" component={DrawerNavigator} />
        <Stack.Screen name="Chatlist" options={{
          headerShown: true,
          headerTitle: 'Chats',
          gestureEnabled: true,
          headerTintColor: colors.white,
          headerTitleStyle: { color: colors.white, fontFamily: fonts.NexaRegular, fontSize: actuatedNormalize(20) },
          headerLargeTitle: true,
          headerTransparent: true,
          headerBlurEffect: 'regular',
          headerStyle: {
            backgroundColor: colors.transparent,
          },
        }} component={withPermissions('chatList')(ChatListScreen)} />
        <Stack.Screen options={{
          headerShown: true,
          headerTitle: 'Calls',
          gestureEnabled: true,
          headerTintColor: colors.white,
          headerTitleStyle: { color: colors.white, fontFamily: fonts.NexaRegular, fontSize: actuatedNormalize(20) },
          headerLargeTitle: true,
          headerTransparent: true,
          headerBlurEffect: 'regular',
          headerStyle: {
            backgroundColor: colors.transparent,
          },
          // headerSearchBarOptions: {
          //   placeholder: 'Search Calls..',
          //   hideWhenScrolling: true,
          //   obscureBackground: true,
          //   shouldShowHintSearchIcon: true,
          //   tintColor: colors.white,
          //   headerIconColor: colors.white,

          // },

          // headerRight: () => (
          //   <TouchableOpacity>
          //     <Ionicons name="call-outline" color={colors.white} size={30} />
          //   </TouchableOpacity>
          // ),
        }} name="Calllist" component={CalllistData} />
        <Stack.Screen name="ChatWindow" component={ChatWindowScreen} />
        <Stack.Screen name="ReviewScreen" component={ReviewScreen} />
        <Stack.Screen name="AudioCallScreen" component={VoiceCall} />
        <Stack.Screen name="CouponsScreen" component={Coupons} />
        <Stack.Screen name="ComingsoonScreen" component={ComingSoon} />
        <Stack.Screen name='ChatPartnerDetails' component={ChatPartnerDetails} />
        <Stack.Screen name="Bugreport" component={BugReportScreen} />
        <Stack.Screen name="Userreview" component={UserreviewScreen} />
        {/* <Stack.Screen name="Outgoing" component={OutgoingCallScreen} />
        <Stack.Screen name="IncomingCall" component={IncomingCallScreen} /> */}
        <Stack.Screen name="privateCall" component={PrivateVoicecall} />
        {/* <Stack.Screen name="appUpdate" component={AppUpdateModal}  options={{headerShown:false,presentation:"modal"}}/> */}

      </Stack.Navigator>
      {/* <GlobalBackHandler /> */}
      <AppUpdateModal/>
      <SessionError title='Session Expired!' description='Your session has expired please login again' />
      <ConnectionModal title='OFFLINE!' description='Please check your internet connection' onPressPrimaryButton={() => console.log("networkhi--->")} />
    </NavigationContainer>
  );
};

export default MainNavigator;
