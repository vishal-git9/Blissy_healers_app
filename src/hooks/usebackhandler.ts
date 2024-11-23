import { useEffect } from 'react';
import { BackHandler } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const useBackHandler = (customHandler?: () => void) => {
  const navigation = useNavigation();

  useEffect(() => {
    const onBackPress = () => {
      if (customHandler) {
        customHandler();
        return true;
      }

      if (navigation.canGoBack()) {
        navigation.goBack();
        return true;
      }
      return false;
    };

    BackHandler.addEventListener('hardwareBackPress', onBackPress);

    return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
  }, [customHandler, navigation]);
};

export default useBackHandler;
