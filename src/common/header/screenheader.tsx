import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { View } from "react-native";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { actuatedNormalize } from "../../constants/PixelScaling";
import colors from "../../constants/colors";
import { Text } from "react-native";
import { fonts } from "../../constants/fonts";

export const HeaderComponent: React.FC<{
    title: string, onPress: () => void;
}> = ({ title, onPress }) => {

    return (
        <View style={styles.mainContainer}>
            <TouchableOpacity onPressIn={onPress} style={styles.container}>
                <View style={styles.button}>
                    <FontAwesome5 name="angle-left" size={15} color="white" />
                </View>
            </TouchableOpacity>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPressIn={onPress} style={styles.container}>
                {/* <View style={styles.button}> */}
                    {/* <FontAwesome5 name="angle-left" size={15} color="white" /> */}
                {/* </View> */}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"space-between",
        columnGap:10,
        padding: actuatedNormalize(16),
    },
    container: {
        height: actuatedNormalize(35),
        width: actuatedNormalize(35),
    },
    button: {
        backgroundColor: 'rgba(0, 0, 0, 0.3)', // Transparent background
        borderRadius: 30, // Rounded border
        padding: actuatedNormalize(10),
        borderWidth: 1,
        borderColor: colors.white,
        justifyContent: "center",
        alignItems: "center"
    },
    title: {
        color: colors.white,
        alignSelf: 'center',
        fontFamily: fonts.NexaBold,
        fontSize: actuatedNormalize(23),
    }
});