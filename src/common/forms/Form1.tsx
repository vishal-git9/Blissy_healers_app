// Form1.tsx
import React, {Dispatch, useRef} from 'react';
import {View, StyleSheet} from 'react-native';
import {actuatedNormalize} from '../../constants/PixelScaling';
import LabelInputComponent from '../inputs/labelInput';
import {Action} from '../../container/Registration/Registration';
import * as Animatable from 'react-native-animatable';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { LabelWithDesc } from '../labels/label1';

interface Form1Props {
  state: {
    name: string;
  };
  dispatch: Dispatch<Action>;
}
const Form1: React.FC<Form1Props> = ({state, dispatch}) => {
  const animatableRef = useRef<Animatable.View>(null);
  return (
    <Animatable.View ref={animatableRef}
    easing={'ease-in-cubic'}
    animation="slideInLeft"
    duration={500}>
      <View style={[styles.inputForm, {marginTop: actuatedNormalize(25)}]}>
        <LabelWithDesc label="What's Your Name?" sublabel='it will appear to other user while talking'/>
        <LabelInputComponent
          value={state.name}
          type={'name'}
          name={'name'}
          // errorText={'Name is part of our alogrithm'}
          onChangeText={dispatch}
          IconProvider={AntDesign}
          IconName={'user'}
        />
      </View>
      </Animatable.View>
  );
};

const styles = StyleSheet.create({
  input: {
    width: '80%',
    height: actuatedNormalize(40),
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: actuatedNormalize(5),
    paddingHorizontal: actuatedNormalize(10),
  },
  inputForm: {
    rowGap: actuatedNormalize(20),
    marginTop: actuatedNormalize(20),
  },
});

export default Form1;
