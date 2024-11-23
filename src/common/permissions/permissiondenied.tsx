import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import colors from '../../constants/colors';
import { fonts } from '../../constants/fonts';
import { actuatedNormalize } from '../../constants/PixelScaling';
import Feather from 'react-native-vector-icons/Feather';
import { MICROPHONE_DENIED_MESSAGE, NOTIFICATIONS_DENIED_MESSAGE } from './permissionErrorMessages';
import { PrimaryButton } from '../button/PrimaryButton';
import { Vibration } from 'react-native';
interface PermissionModalProps {
  visible: boolean;
  permissionType: string;
  close: () => void;
  onGo: () => void;
}

const PermissionDenied: React.FC<PermissionModalProps> = ({
  visible,
  permissionType,
  close,
  onGo
}) => {
  return (
    <Modal

      isVisible={visible}
      hasBackdrop={false}
    //  onBackdropPress={close}
      backdropColor={colors.transparent}
      animationInTiming={500}
      // style={{backgroundColor:colors.accent}}
      animationIn="slideInUp"
      animationOut="slideOutDown">
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              rowGap: actuatedNormalize(15),
            }}>

            <Text style={styles.modalText}>
              Hey, wait up!
            </Text>
          </View>
          <Text style={styles.description}>
            {
              permissionType === "Microphone"
                ? "You need to allow access to the microphone to make calls."
                : permissionType === "Notifications"
                  ? "You need to allow access to notifications to receive message alerts."
                  : "You will not receive message notifications until you allow access to notifications."
            }
            {/* You can not use { }  {permissionType} */}
          </Text>
          <Text style={styles.description}>
            You can Allow it manually
          </Text>
          <View style={{ marginTop: actuatedNormalize(25), gap: actuatedNormalize(5) }}>

            <TouchableOpacity
              style={[styles.button, styles.buttonAllow]}
              onPress={onGo}>
              <Text style={styles.textStyle}>Go to Settings</Text>
              <Feather
                name={"settings"}
                color={colors.white}
                size={actuatedNormalize(20)}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.buttonDeny]}
              onPress={close}>
              <Text style={styles.textStyle}>Dismiss</Text>
              {/* <Feather
              name={"settings"}
              color={colors.white}
              size={actuatedNormalize(20)}
            /> */}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.darkOverlayColor,
  },
  modalView: {
    margin: actuatedNormalize(20),
    backgroundColor: colors.dark,
    borderRadius: actuatedNormalize(10),
    padding: actuatedNormalize(30),
    alignItems: 'center',
    gap: actuatedNormalize(20)
  },
  modalText: {
    textAlign: 'center',
    fontFamily: fonts.NexaBold,
    color: colors.white,
    fontSize: actuatedNormalize(18)
  },
  description: {
    textAlign: 'center',
    fontFamily: fonts.NexaBold,
    color: colors.gray,
    fontSize: actuatedNormalize(13)
  },
  button: {
    flexDirection: 'row',
    borderRadius: actuatedNormalize(20),
    paddingVertical: actuatedNormalize(10),
    paddingHorizontal: actuatedNormalize(20),
    width: actuatedNormalize(200),
    borderWidth: actuatedNormalize(1.3),
    borderColor: colors.white,
    gap: actuatedNormalize(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonAllow: {
    backgroundColor: colors.primary, // This is a green color similar to the one in the image
    borderWidth: actuatedNormalize(1.3),
    borderColor: colors.white,
  },
  buttonDeny: {
    backgroundColor: colors.transparent, // This is a red color for the denial button
  },
  textStyle: {
    color: colors.white,
    fontSize: actuatedNormalize(16),
    fontFamily: fonts.NexaBold,
    textAlign: 'center',
  },
});

export default PermissionDenied;
