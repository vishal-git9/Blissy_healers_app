import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import colors from '../../constants/colors';
import { Svg,Image as SvgImage } from 'react-native-svg';
import { fonts } from '../../constants/fonts';

interface ChatIntialInfo {
    UserImage: string | undefined;
    partnerImage:string | undefined;
    userName:string | undefined;
    partnerName:string | undefined;
}
const ChatIntialInfo:React.FC<ChatIntialInfo> = ({UserImage,partnerImage,partnerName,userName}) => {
  return (
    <View style={styles.container}>
              <View style={styles.avatarsContainer}>

      <View style={styles.avatarWrapper}>
        <Image
          source={{ uri: UserImage}} // Replace with actual avatar URL
          style={styles.avatar}
        />
         <Image
          source={require("../../../assets/grinning.png")} // Replace with actual avatar URL
          style={styles.icon}
        />

      </View>
      <View style={styles.avatarWrapper}>
        <Image
          source={{ uri: partnerImage}} // Replace with actual avatar URL
          style={styles.avatar}
        />
       <Image
          source={require("../../../assets/pleasure.png")} // Replace with actual avatar URL
          style={styles.icon2}
        />
          {/* <Image
            source={{ uri: 'https://ik.imagekit.io/gqdvppqpv/boys/boy2.png?updatedAt=1718276270992' }} // Replace with actual wave icon URL
            style={styles.icon2}
          /> */}
      </View>
      </View>
      <View style={styles.messageContainer}>
        <Text style={styles.username}>{partnerName && userName ? `${partnerName[0]} + ${userName[0]}` : ""}</Text>
        <Text style={styles.messageText}>This could be the beginning of some healing</Text>
        {/* <Text style={styles.timestamp}>12:13 am</Text> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      padding: 10,
      flex:1,
      justifyContent:"center",
      backgroundColor: '#000', // Match the background color
      alignItems: 'center',
    },
    avatarsContainer: {
      flexDirection: 'row',
      marginBottom: 10,
    },
    avatarWrapper: {
      position: 'relative',
      marginHorizontal: -10,
    },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: 25,
    },
    icon: {
      width: 50,
      top:-40,
      height: 50,
      position: 'absolute',
      bottom: -5,
      left: -40,
    },
    icon2: {
        top:-40,

        width: 50,
        height: 50,
        position: 'absolute',
        bottom: -5,
        right: -40,
      },  
    messageContainer: {
      alignItems: 'center',
    },
    username: {
      color: '#fff',
      fontSize: 16,
      fontFamily:fonts.NexaBold,
      marginBottom: 5,
    },
    messageText: {
      color: '#fff',
      fontSize: 14,
      textAlign: 'center',
      fontFamily:fonts.NexaRegular
    },
    timestamp: {
      color: '#888',
      fontSize: 12,
      marginTop: 5,
    },
  });

export default ChatIntialInfo;
