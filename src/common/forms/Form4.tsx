// Form4.tsx
import React, {Dispatch, useEffect, useRef, useState} from 'react';
import {Text} from 'react-native';
import {View, TextInput, StyleSheet} from 'react-native';
import colors from '../../constants/colors';
import {fonts} from '../../constants/fonts';
import {actuatedNormalize} from '../../constants/PixelScaling';
import LabelInputComponent from '../inputs/labelInput';
import {Action} from '../../container/Registration/Registration';
import GenderSelect from '../selectable/genderSelectable';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Modal from 'react-native-modal';
import Slider from '@react-native-community/slider';
import * as Animatable from "react-native-animatable"
import { LabelWithDesc } from '../labels/label1';
import AvatarComponent from './SetAvatar';
import { mensAvatarData, womensAvatarData } from '../../mockdata/avatardata';
import FastImage from 'react-native-fast-image';
interface Form2Props {
  state: {
    gender: string;
    profilePic:string;
  };
  dispatch: Dispatch<Action>;
}
const Form4: React.FC<Form2Props> = ({state,dispatch}) => {
  const animatableRef = useRef<Animatable.View>(null);
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(state.profilePic);

  
  return (
      <Animatable.View
        ref={animatableRef}
        easing={'ease-in-cubic'}
        animation="slideInLeft"
        duration={500}>
          <View style={[styles.inputForm]}>
            <LabelWithDesc label="What's Your Gender?" sublabel='gender let us find your type'/>
        <GenderSelect
          selectedGender={state.gender}
          onSelectGender={gender => dispatch({type:"gender",payload:gender})}
        />
      </View>

      {
        state.gender === "male" ? <AvatarComponent dispatch={dispatch} avatarData={mensAvatarData} selectedAvatar={selectedAvatar} setSelectedAvatar={setSelectedAvatar}/> : <AvatarComponent dispatch={dispatch} selectedAvatar={selectedAvatar} setSelectedAvatar={setSelectedAvatar} avatarData={womensAvatarData}/>
      }
      </Animatable.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '80%',
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  inputForm: {
    rowGap: actuatedNormalize(25),
    marginTop: actuatedNormalize(20),
  },
});

export default Form4;
