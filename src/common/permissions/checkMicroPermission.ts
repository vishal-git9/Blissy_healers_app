import { Platform } from 'react-native';
import { check, PERMISSIONS, RESULTS, checkMultiple } from 'react-native-permissions';

const checkMicrophonePermission = () => {
  return new Promise((resolve, reject) => {
    check(Platform.OS === 'android' ? PERMISSIONS.ANDROID.RECORD_AUDIO : PERMISSIONS.IOS.MICROPHONE)
      .then((result) => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            console.log('This feature is not available (on this device / in this context)');
            resolve(RESULTS.UNAVAILABLE);
            break;
          case RESULTS.DENIED:
            console.log('The permission has not been requested / is denied but requestable');
            resolve(RESULTS.DENIED);
            break;
          case RESULTS.LIMITED:
            console.log('The permission is limited: some actions are possible');
            resolve(RESULTS.LIMITED);
            break;
          case RESULTS.GRANTED:
            console.log('The permission is granted');
            resolve(RESULTS.GRANTED);
            break;
          case RESULTS.BLOCKED:
            console.log('The permission is denied and not requestable anymore');
            resolve(RESULTS.BLOCKED);
            break;
        }
      })
      .catch((error) => {
        console.log("Error while checking microphone permission", error);
        reject(error);
      });
  });
}

export default checkMicrophonePermission;
