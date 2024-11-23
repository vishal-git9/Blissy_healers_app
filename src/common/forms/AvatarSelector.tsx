import React, {useEffect, useState} from 'react';
import {
  View,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import colors from '../../constants/colors';
import {actuatedNormalize} from '../../constants/PixelScaling';
import FastImage from 'react-native-fast-image';

interface AvatarSelectorProps {
  avatarData: string[];
  selectedAvatar: string | null;
  onSelectAvatar: (avatar: string) => void;
}

const AvatarSelector: React.FC<AvatarSelectorProps> = ({
  avatarData,
  selectedAvatar,
  onSelectAvatar,
}) => {
  
  console.log(avatarData, 'avatardata');
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {avatarData.map((avatar, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.avatarContainer,
            avatar === selectedAvatar && styles.selectedAvatar,
          ]}
          onPress={() => onSelectAvatar(avatar)}>
          {/* <Image source={{ uri: avatar }} style={styles.avatar} /> */}
          <FastImage
            source={{
              uri: avatar,
              headers: {Authorization: 'someAuthToken2'},
              priority: FastImage.priority.high,
            }}
            style={[styles.avatar]}
            resizeMode={FastImage.resizeMode.contain}
            onLoad={(e)=>console.log("loading done")}
            // style={styles.avatar}
          />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  avatarContainer: {
    marginRight: actuatedNormalize(10),
    borderRadius: actuatedNormalize(50),
    borderWidth: actuatedNormalize(4),
    borderColor: 'transparent',
  },
  selectedAvatar: {
    borderColor: colors.primary, // Change to your desired border color for selected avatar
  },
  avatar: {
    width: actuatedNormalize(100),
    height: actuatedNormalize(100),
    borderRadius: actuatedNormalize(50),
    objectFit: 'contain',
  },
});

export default AvatarSelector;
