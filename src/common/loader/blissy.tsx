import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Lottie from 'lottie-react-native';
import { actuatedNormalize } from "../../constants/PixelScaling";
import colors from "../../constants/colors";
const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

export const BlissyLoader: React.FC = () => {
    return (
        <View style={styles.loaderContainer}>
            <Lottie
                source={require('../../../assets/animation/loader2.json')}
                style={styles.lottieView}
                autoPlay
            />
        </View>
    )
}

const styles = StyleSheet.create({
    loaderContainer: {
        position: 'absolute',
        zIndex: 1000,
        flex: 1,
        height: screenHeight,
        width: screenWidth,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.darkOverlayColor2,
    },

    lottieView: {
        width: actuatedNormalize(200),
        height: actuatedNormalize(200),
        backgroundColor: 'transparent',
    },

})