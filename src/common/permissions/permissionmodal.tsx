import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Modal from 'react-native-modal';
import colors from '../../constants/colors';
import {fonts} from '../../constants/fonts';
import {actuatedNormalize} from '../../constants/PixelScaling';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
interface PermissionModalProps {
  visible: boolean;
  permissionType: string; // e.g., "Notifications", "Microphone", "Photo Library"
  onAllow: () => void;
  onDeny: () => void;
  iconName:string;
}

const PermissionModal: React.FC<PermissionModalProps> = ({
  visible,
  onAllow,
  onDeny,
  permissionType,
  iconName
}) => {
  return (
    <Modal
      isVisible={visible}
      hasBackdrop={false}
      backdropColor="transparent"
      animationInTiming={1000}
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
            <FontAwesome5Icon
              name={iconName}
              color={colors.white}
              size={actuatedNormalize(30)}
            />
            <Text style={styles.modalText}>
              Allow Blissy to access your {permissionType}?
            </Text>
          </View>
          <View style={{marginTop:actuatedNormalize(15)}}>
            <TouchableOpacity
              style={[styles.button, styles.buttonAllow]}
              onPress={onAllow}>
              <Text style={styles.textStyle}>Allow</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.buttonDeny]}
              onPress={onDeny}>
              <Text style={styles.textStyle}>Don't allow</Text>
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
    borderRadius: actuatedNormalize(8),
    padding: actuatedNormalize(35),
    alignItems: 'center',
  },
  modalText: {
    textAlign: 'center',
    fontFamily: fonts.NexaBold,
    color: colors.gray,
  },
  button: {
    borderRadius: actuatedNormalize(8),
    paddingVertical: actuatedNormalize(10),
    paddingHorizontal: actuatedNormalize(20),
    width: actuatedNormalize(250),
  },
  buttonAllow: {
    backgroundColor: colors.primary, // This is a green color similar to the one in the image
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

export default PermissionModal;
