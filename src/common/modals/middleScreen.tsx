import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextStyle } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Modal from "react-native-modal";
import { PrimaryButton } from '../button/PrimaryButton';
import { actuatedNormalize } from '../../constants/PixelScaling';
import { fonts } from '../../constants/fonts';
import colors from '../../constants/colors';
import LottieView from 'lottie-react-native';

interface CustomModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  description: string;
  onPressPrimaryButton: () => void;
  showLottie?: boolean;
  modalTitleStyle?:TextStyle
  lottieAnimationPath?: string; // New prop to specify the Lottie animation path
}

const HelloModal: React.FC<CustomModalProps> = ({
  visible,
  onClose,
  title,
  description,
  onPressPrimaryButton,
  showLottie,
  lottieAnimationPath,
  modalTitleStyle
}) => {
  return (
    <Modal
      isVisible={visible}
      backdropColor="transparent"
      animationInTiming={1000}
      animationIn="slideInUp"
      animationOut="slideOutDown"
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {showLottie ? (
            <LottieView style={{width:actuatedNormalize(150),height:actuatedNormalize(150)}} source={lottieAnimationPath} autoPlay loop />
          ) : (
            <MaterialIcons name="waving-hand" size={50} color={colors.yellow} />
          )}
          <View>
            <Text style={[styles.modalTitle,modalTitleStyle]}>{title}</Text>
            <Text style={styles.modalDescription}>{description}</Text>
          </View>
          <PrimaryButton textStyles={{ fontSize: actuatedNormalize(20) }} handleFunc={onPressPrimaryButton} label="Let's go" />
        </View>
      </View>
    </Modal>
  );
};

export default HelloModal;


const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: colors.white,
    borderRadius: actuatedNormalize(10),
    padding: actuatedNormalize(20),
    width:"100%",
    rowGap:actuatedNormalize(10),
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: actuatedNormalize(25),
    marginTop: actuatedNormalize(10),
    fontFamily:fonts.NexaXBold,
    textAlign: 'center',
    color:colors.dark
  },
  modalDescription: {
    fontSize: 16,
    textAlign: 'center',
    fontFamily:fonts.NexaRegular,
    color:colors.gray
  },
});
