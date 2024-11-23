import React, { Dispatch, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import AvatarSelector from './AvatarSelector';
import { actuatedNormalize } from '../../constants/PixelScaling';
import { Text } from 'react-native';
import { LabelWithDesc } from '../labels/label1';
import { Action } from '../../container/Registration/Registration';
import FastImage from 'react-native-fast-image';

interface AvatarComponentProps {
  avatarData: string[];
  selectedAvatar:string | null;
  setSelectedAvatar:(avatar:string)=>void;
  dispatch: Dispatch<Action>;
}



const AvatarComponent: React.FC<AvatarComponentProps> = ({ avatarData, selectedAvatar, setSelectedAvatar,dispatch}) => {

  const handleSelectAvatar = (avatar: string) => {
    setSelectedAvatar(avatar);
    dispatch({type:"profilePic",payload:avatar})
  };

  // useEffect(()=>{
  //   FastImage.preload(avatarData.map((uri)=>{
  //     return {uri:uri, headers:{Authorization: uri}}
  //   }))
  // },[avatarData])

  return (
    <View style={styles.container}>
                    <LabelWithDesc label="Choose Your Avatar" sublabel='avatar makes you unique'/>

      <AvatarSelector
        avatarData={avatarData}
        selectedAvatar={selectedAvatar}
        onSelectAvatar={handleSelectAvatar}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop:actuatedNormalize(20),
    rowGap:actuatedNormalize(20)
  },
});

export default AvatarComponent;
