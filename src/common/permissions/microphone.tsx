// MicrophonePermissionModal.tsx
import React, { useState, useEffect } from 'react';
import { check, request, PERMISSIONS, RESULTS, Permission } from 'react-native-permissions';
import PermissionModal from './permissionmodal'; // Import the reusable PermissionModal
import { Platform } from 'react-native';

interface Props {
  onPermissionResult: (granted: boolean) => void;
}

const MicrophonePermissionModal: React.FC<Props> = ({ onPermissionResult }) => {
  const [visible, setVisible] = useState(false);
console.log("hi")
  // Platform-specific permission name
  const microphonePermission: Permission = Platform.select({
    ios: PERMISSIONS.IOS.MICROPHONE,
    android: PERMISSIONS.ANDROID.RECORD_AUDIO,
  }) as Permission;


  const handleAllow = async () => {
    const result = await request(microphonePermission);
    setVisible(false);
    onPermissionResult(result === RESULTS.GRANTED);
  };

  const handleDeny = () => {
    setVisible(false);
    onPermissionResult(false);
  };

  return (
    <PermissionModal
      visible={visible}
      permissionType="Microphone"
      onAllow={handleAllow}
      onDeny={handleDeny}
      iconName='microphone'
    />
  );
};

export default MicrophonePermissionModal;
