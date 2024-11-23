import LottieView from "lottie-react-native";
import React, { ReactNode } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { actuatedNormalize } from "../../constants/PixelScaling";
import colors from "../../constants/colors";
const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

export const Appbackground: React.FC<{ children: ReactNode }> = ({ children }) => {

    return (
        <>
            <View style={styles.loaderContainer}>
                <LottieView
                    source={require('../../../assets/animation/stars.json')}
                    style={styles.lottieView}
                    autoPlay
                    speed={2}
                    resizeMode="cover"
                />
            </View>
            {children}
        </>
    )
}

export const styles = StyleSheet.create({
    lottieView: {
        width: actuatedNormalize(500),
        height: actuatedNormalize(500),
        backgroundColor: 'transparent',
    },
    loaderContainer: {
        position: 'absolute',
        zIndex: -1,
        flex: 1,
        height: screenHeight,
        width: screenWidth,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.transparent,
    },
})