import React, { useRef } from "react";
import { Image, StyleSheet, View , Text} from "react-native";
import LottieView from "lottie-react-native";
import { actuatedNormalize } from "../../constants/PixelScaling";
import { fonts } from "../../constants/fonts";
import colors from "../../constants/colors";

interface EmptyProps{
  head:string,
  description:string
}

export const Empty: React.FC<EmptyProps> = ({head, description}) => {
  return (
    <View style={styles.mainContainer}>
      <View style={styles.gifCont}>
        <LottieView
          autoPlay
          style={{
            width: actuatedNormalize(400),
            height: actuatedNormalize(400),
          }}
          source={require("../../../assets/animation/empty.json")}
        />
      </View>
      <View style={styles.textCont}>
      <Text style={styles.upperTextStyle}>{head}</Text>
      <Text style={styles.textStyle}>{description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  gifCont: {
    justifyContent:'center',
    alignItems:'center'
  },
  mainContainer:{
    justifyContent:'center',
    alignItems:'center',
    // height:500
    padding:actuatedNormalize(20)
  },
  textCont:{
    justifyContent:'center',
    alignItems:'center',
    gap:actuatedNormalize(10)
  },
  textStyle: {
    fontFamily: fonts.NexaRegular,
    fontSize: actuatedNormalize(14),
    alignSelf: "center",
    textAlign:"center",
    color: colors.gray
  },
  upperTextStyle: {
    fontFamily: fonts.NexaXBold,
    fontSize: actuatedNormalize(16),
    alignSelf: "center",
    textAlign:"center",
    color: colors.white
  }
});