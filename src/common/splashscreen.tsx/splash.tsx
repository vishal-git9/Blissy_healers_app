import React from "react";
import { Image, StyleSheet } from "react-native";
import { View } from "react-native";
import colors from "../../constants/colors";

export const SplashScreenAnimated:React.FC = ()=>{
   return(
    <View style={styles.container}>
        <Image source={{uri:"https://ik.imagekit.io/gtdegh2lp/blissy.gif?updatedAt=1712429137714"}} width={500} height={500}/>
    </View>
   )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:"center",
        alignItems:"center",
        backgroundColor:colors.black
    }
})