import React, { useState } from "react";
import { ModalComponent } from "../../common/modals/modalcomponent";
import { BackHandler, Linking, StyleSheet, View } from "react-native";
import colors from "../../constants/colors";
import { actuatedNormalize } from "../../constants/PixelScaling";
import LottieView from "lottie-react-native";
import { Text } from "react-native";
import { PrimaryButton } from "../../common/button/PrimaryButton";
import { fonts } from "../../constants/fonts";
import { useSelector } from "react-redux";
import { AuthSelector, setConnectionStatus } from "../../redux/uiSlice";

interface SessionError {
    title: string;
    description: string;
    onPressPrimaryButton: () => void
}

export const ConnectionModal: React.FC<SessionError> = ({ title, description, onPressPrimaryButton }) => {
    const { isConnected } = useSelector(AuthSelector);
    const openSettings = () => {
        Linking.openSettings();
      };
    
      const exitApp = () => {
        BackHandler.exitApp();
      };
    const renderItem = (
        <View style={styles.centeredView}>
            <View style={styles.modalView}>
                <LottieView style={{ width: actuatedNormalize(150), height: actuatedNormalize(150) }} source={require("../../../assets/animation/SessionError.json")} autoPlay loop />
                <View>
                    <Text style={[styles.modalTitle]}>{title}</Text>
                    <Text style={styles.modalDescription}>{description}</Text>
                </View>
                <PrimaryButton styles={{width:"60%"}} textStyles={{ fontSize: actuatedNormalize(16) }} handleFunc={openSettings} label="Turn on Internet" />
                <PrimaryButton styles={{width:"60%"}} textStyles={{ fontSize: actuatedNormalize(16) }} handleFunc={exitApp} label="Exit App" />
            </View>
        </View>
    )

    return (
        <ModalComponent modalVisible={!isConnected}
            setModalVisible={() => setConnectionStatus(false)}
            children={renderItem} />
    )
}

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
        width: "80%",
        rowGap: actuatedNormalize(10),
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: actuatedNormalize(25),
        marginTop: actuatedNormalize(10),
        fontFamily: fonts.NexaXBold,
        textAlign: 'center',
        color: colors.dark
    },
    modalDescription: {
        fontSize: 16,
        textAlign: 'center',
        fontFamily: fonts.NexaRegular,
        color: colors.gray
    },
});
