import React, { useEffect, useState } from 'react';
import { check, requestMultiple, PERMISSIONS, RESULTS, PermissionStatus, Permission } from 'react-native-permissions';
import { Platform, View, Text, Modal, Button, Linking } from 'react-native';
import PermissionDenied from '../common/permissions/permissiondenied';

const checkPermissions = async (screenType: string): Promise<Record<string, PermissionStatus>> => {
  let permissions: Permission[] = [];

  if (Platform.OS === 'android') {
    if (screenType === 'chatList') {
      permissions = [PERMISSIONS.ANDROID.POST_NOTIFICATIONS];
    } else if (screenType === 'callingScreen') {
      permissions = [PERMISSIONS.ANDROID.RECORD_AUDIO];
    }
  } else if (Platform.OS === 'ios') {
    if (screenType === 'chatList') {
      permissions = [];
    } else if (screenType === 'callingScreen') {
      permissions = [PERMISSIONS.IOS.MICROPHONE];
    }
  } else {
    console.error("Unsupported platform");
    return {};
  }

  const statuses = await requestMultiple(permissions);
  return statuses;
};

const withPermissions = (screenType: string) => <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  const ComponentWithPermissions = (props: P) => {
    const [permission, setPermission] = useState(false);
    const [permissionType, setPermissionType] = useState('');

    const verifyPermissions = async () => {
      const response = await checkPermissions(screenType);
      console.log(response, "From HOC VerifyPerm", screenType)
      handlePermissions(response);
    };
    useEffect(() => {

      verifyPermissions();
    }, [screenType]);

    const handlePermissions = (response: Record<string, PermissionStatus>) => {
      for (const permissionKey in response) {
        const permissionResult = response[permissionKey];
        switch (permissionResult) {
          case RESULTS.GRANTED:
            console.log(`${permissionKey} permission granted.`);
            break;
          case RESULTS.DENIED:
            console.log(`${permissionKey} permission denied.`);
            break;
          case RESULTS.BLOCKED:
            console.log(`${permissionKey} permission blocked.`);
            setPermission(true);
            if (permissionKey === PERMISSIONS.ANDROID.RECORD_AUDIO || permissionKey === PERMISSIONS.IOS.MICROPHONE) {
              setPermissionType('Microphone');
            } else if (permissionKey === PERMISSIONS.ANDROID.POST_NOTIFICATIONS) {
              setPermissionType('Notifications');
            }
            break;
          default:
            console.log(`${permissionKey} permission unknown status.`);
            break;
        }
      }
    };

    const closeModal = () => {
      setPermission(false);
      setPermissionType('');
    };

    return (
      <View style={{ flex: 1, backgroundColor:'rgb(0, 0, 0)' }}>
        <WrappedComponent {...props} />
        <PermissionDenied close={closeModal} onGo={() => { Linking.openSettings(); setPermission(false); }} permissionType={permissionType} visible={permission} />
      </View>
    );
  };

  return ComponentWithPermissions;
};

export default withPermissions;
