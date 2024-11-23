import LottieView from "lottie-react-native"
import { Linking, Platform, StyleSheet, View } from "react-native"
import { actuatedNormalize } from "../../constants/PixelScaling"
import { Text } from "react-native"
import colors from "../../constants/colors"
import { PrimaryButton } from "../../common/button/PrimaryButton";
import { fonts } from "../../constants/fonts"
import React, { useEffect, useState } from "react"
import { ModalComponent } from "./modalcomponent"
import VersionCheck from 'react-native-version-check';

export const AppUpdateModal : React.FC = ()=>{
    const [modalVisible, setModalVisible] = useState(false)
    const [storeUrl, setStoreUrl] = useState('');
  
    const handleClick = ()=>{
        setModalVisible(false)
        if(storeUrl.trim()){
            Linking.openURL(storeUrl);
        }
    }

    useEffect(() => {
        const checkForUpdate = async () => {
          try {
            // const updateInfo = await VersionCheck.needUpdate({
            //     currentVersion:VersionCheck.getCurrentVersion(),
            //     latestVersion:"1.2.0"
            // });
             const updateInfo = await VersionCheck.needUpdate()
            console.log(updateInfo,"updateInfo-------->")
            if (updateInfo && updateInfo?.isNeeded) {
              setStoreUrl(updateInfo?.storeUrl);
              setModalVisible(true);
            }
          } catch (error) {
            console.error('Error checking for app update:', error);
          }
        };
    
        checkForUpdate();
      }, []);
    

    const renderItem = (
        <View style={styles.centeredView}>
            <View style={styles.modalView}>
                <LottieView style={{width: actuatedNormalize(250), height: actuatedNormalize(250) }} source={require("../../../assets/animation/update.json")} autoPlay loop />
                <View style={{marginTop:actuatedNormalize(-60)}}>
                    <Text style={[styles.modalTitle]}>Update Available</Text>
                    <Text style={styles.modalDescription}>A new version of the app is available. Please update to the latest version.</Text>
                </View>
                <PrimaryButton styles={{ width: "70%" }} textStyles={{ fontSize: actuatedNormalize(16) }} handleFunc={handleClick} label="Update now" />
            </View>
        </View>
    )


    return(
        <ModalComponent modalVisible={modalVisible}
        setModalVisible={() => console.log("hi")}
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