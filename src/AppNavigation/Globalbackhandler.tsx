import { useEffect } from 'react';
import { BackHandler, Alert } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from './navigatorType';

const GlobalBackHandler: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    const onBackPress = () => {
      console.log('Back button pressed');
      
      if (navigation.isFocused()) {
        if (navigation.canGoBack()) {
          navigation.goBack();
          return true; // Prevent default behavior (app exit)
        } else {
          Alert.alert(
            "Exit App",
            "Are you sure you want to exit?",
            [
              { text: "Cancel", style: "cancel" },
              { text: "OK", onPress: () => BackHandler.exitApp() }
            ],
            { cancelable: false }
          );
          return true; // Prevent default behavior (app exit)
        }
      }

      return false; // Let the default behavior happen if not focused
    };

    const backHandlerListener = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    const focusListener = navigation.addListener('focus', () => {
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
    });
    const blurListener = navigation.addListener('blur', () => {
      BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    });

    return () => {
      backHandlerListener.remove();
      focusListener();
      blurListener();
    };
  }, [navigation]);

  return null; // This component doesn't render anything
};

export default GlobalBackHandler;
