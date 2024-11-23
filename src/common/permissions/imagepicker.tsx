import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Platform } from 'react-native';
import Modal from 'react-native-modal';
import { check, request, PERMISSIONS, RESULTS, Permission } from 'react-native-permissions';

// Adding a new prop type for the callback
interface Props {
  onPermissionResult: (granted: boolean) => void;
}

const ImagePickerPermissionModal: React.FC<Props> = ({ onPermissionResult }) => {
  const [isVisible, setIsVisible] = useState(false);

  const permission = Platform.select({
    ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
    android: PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
  }) as Permission;

  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = async () => {
    const result = await check(permission);
    if (result === RESULTS.GRANTED) {
      onPermissionResult(true);
    } else {
      setIsVisible(true);
    }
  };

  const requestPermission = async () => {
    const result = await request(permission);
    const granted = result === RESULTS.GRANTED;
    setIsVisible(!granted);
    onPermissionResult(granted);
  };

  return (
    <Modal isVisible={isVisible}>
      <View style={styles.modal}>
        <Text style={styles.text}>We need access to your photo library to upload images.</Text>
        <Button title="Grant Permission" onPress={requestPermission} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  text: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default ImagePickerPermissionModal;
