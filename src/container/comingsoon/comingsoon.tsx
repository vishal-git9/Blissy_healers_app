import LottieView from "lottie-react-native"
import React from "react"
import { StyleSheet, Text, View } from "react-native"
import { actuatedNormalize } from "../../constants/PixelScaling"
import { RouteBackButton } from "../../common/button/BackButton"
import { RootStackParamList } from "../../AppNavigation/navigatorType"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { RouteProp } from "@react-navigation/native"
import colors from "../../constants/colors"
import { fonts } from "../../constants/fonts"
import useBackHandler from "../../hooks/usebackhandler"

interface AppProps {
    navigation: NativeStackNavigationProp<RootStackParamList>;
    route: RouteProp<RootStackParamList, "ComingsoonScreen">;
    screenName?:string;
}
interface AppProps2 {
    navigation: NativeStackNavigationProp<RootStackParamList>;
    screenName?:string;
}
export const ComingSoon:React.FC<AppProps> = ({navigation,route}) => {
    const {screenName} = route.params

  // calling use backhandler
  useBackHandler()
    return (
        <View style={styles.container}>
            <RouteBackButton  onPress={()=>navigation.goBack()}/>
            <LottieView autoPlay
              loop source={require("../../../assets/animation/comingsoon.json")} style={{ width: actuatedNormalize(300), height: actuatedNormalize(300),alignSelf:"center" }} />
              <Text style={styles.description}>
                {screenName} Feature will soon be available for you
              </Text>
        </View>
    )
}

export const ComingSoonComponent:React.FC<AppProps2> = ({navigation,screenName}) => {
    return (
        <View style={styles.container}>
            {/* <RouteBackButton  onPress={()=>navigation.goBack()}/> */}
            <LottieView autoPlay
              loop source={require("../../../assets/animation/comingsoon.json")} style={{ width: actuatedNormalize(300), height: actuatedNormalize(300),alignSelf:"center" }} />
              <Text style={styles.description}>
                {screenName} Feature will soon be available for you
              </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    description:{
        color:colors.white,
        fontFamily:fonts.NexaBold,
        fontSize:actuatedNormalize(20),
        textAlign:"center",
        width:"80%",
        alignSelf:"center",
        marginTop:actuatedNormalize(20)
    }
})