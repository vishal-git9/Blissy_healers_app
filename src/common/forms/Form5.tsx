// Form4.tsx
import React, {Dispatch, useRef, useState} from 'react';
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
import * as Animatable from 'react-native-animatable';
import {LabelWithDesc} from '../labels/label1';
interface Form2Props {
  state: {
    age: number;
  };
  dispatch: Dispatch<Action>;
}
const Form5: React.FC<Form2Props> = ({state, dispatch}) => {
  const animatableRef = useRef<Animatable.View>(null);
  return (
    <Animatable.View
      ref={animatableRef}
      easing={'ease-in-cubic'}
      animation="slideInLeft"
      duration={500}>
      <View style={[styles.inputForm]}>
        <LabelWithDesc
          label="What's Your Age?"
          sublabel="age let us find your age circle"
        />
        <Text
          style={{
            color: colors.white,
            fontFamily: fonts.NexaBold,
            fontSize: actuatedNormalize(25),
            alignSelf: 'flex-start',
          }}>
          {state.age}
        </Text>
        <Slider
          style={{width: '100%', height: actuatedNormalize(40)}}
          minimumValue={16}
          maximumValue={50}
          value={state.age}
          thumbTintColor={colors.primary}
          minimumTrackTintColor={colors.primary}
          maximumTrackTintColor={colors.lightGray}
          onValueChange={val =>
            dispatch({type: 'age', payload: Math.round(val)})
          }
        />
      </View>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  inputForm: {
    rowGap: actuatedNormalize(15),
  },
});

export default Form5;
