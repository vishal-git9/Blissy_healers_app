/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PersistGate } from "redux-persist/integration/react"
import { Colors } from 'react-native/Libraries/NewAppScreen';
import colors from './src/constants/colors';
import { Provider } from 'react-redux';
import * as RootNavigation from './src/utils/RootNavigation.js';
import { store, persistor } from './src/redux';
import { Navigator } from './src/AppNavigation/Navigator';
import { SplashScreenAnimated } from './src/common/splashscreen.tsx/splash';
import setupNotificationListener from './src/utils/notificationService';
import notifee, { EventType, AndroidImportance, AndroidVisibility } from '@notifee/react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from 'react-native-paper';


const theme = {
  ...DefaultTheme,
  
  // Specify custom property
  myOwnProperty: true,
  // Specify custom property in nested object
  colors: {
    primary: colors.primary,
      secondary: colors.secondary,
      background: colors.dark,
      surface: colors.white,
      inverseSurface:colors.white,
      elevation: {
        level0: 'transparent',
        // Note: Color values with transparency cause RN to transfer shadows to children nodes
        // instead of View component in Surface. Providing solid background fixes the issue.
        // Opaque color values generated with `palette.primary99` used as background
        level1: 'rgb(247, 243, 249)', // palette.primary40, alpha 0.05
        level2: 'rgb(243, 237, 246)', // palette.primary40, alpha 0.08
        level3: 'rgb(238, 232, 244)', // palette.primary40, alpha 0.11
        level4: 'rgb(236, 230, 243)', // palette.primary40, alpha 0.12
        level5: 'rgb(233, 227, 241)', // palette.primary40, alpha 0.14
      },
  },
};

const App: React.FC = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [hasSplash, setHasSplash] = useState<boolean>(true)
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const setupNotificationChannel = async () => {
    await notifee.createChannel({
      id: 'blissy1',
      name: 'Blissy Channel 1',
      importance: AndroidImportance.HIGH,
      badge: true,
      sound: "level_up",
      visibility: AndroidVisibility.PUBLIC,

    });
    await notifee.createChannel({
      id: 'nuggets-call2',
      name: 'nuggets call 2',
      sound: "level_up",
      importance: AndroidImportance.HIGH,
      visibility: AndroidVisibility.PUBLIC,
    });
  };

  useEffect(() => {
    // const timer = setTimeout(() => {
    //   setHasSplash(false)
    // }, 4200);
    setupNotificationChannel()
    setupNotificationListener()
    // return ()=> clearTimeout(timer)
  }, []);





  console.log(store.getState(), "---hassplash---")

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SafeAreaProvider style={backgroundStyle}>
            <View style={[styles.AppContainer, backgroundStyle]}>
              <StatusBar
                barStyle={'light-content'}
                animated={true}
                backgroundColor={colors.black}
              />
              <PaperProvider theme={theme}>
                <Navigator />
              </PaperProvider>
            </View>
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  AppContainer: {
    flex: 1,
  },
});

export default App;
