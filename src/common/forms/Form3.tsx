// Form2.tsx
import React, {Dispatch, useEffect, useRef, useState} from 'react';
import {View, TextInput, StyleSheet, Text} from 'react-native';
import InterestSelect from '../selectable/interestSelectable';
import * as Animatable from 'react-native-animatable';
import colors from '../../constants/colors';
import {fonts} from '../../constants/fonts';
import {actuatedNormalize} from '../../constants/PixelScaling';
import {LabelWithDesc} from '../labels/label1';
import { Action } from '../../container/Registration/Registration';
interface Form2Props {
  state: {
    language: string[];
  };
  dispatch: Dispatch<Action>;
}
const Form3: React.FC<Form2Props> = ({state,dispatch}) => {
  const animatableRef = useRef<Animatable.View>(null);
  const [selectedlanguage,setSelectedlanguage] = useState<string[]>(state.language || ['English'])
  const handlelanguageSelect = (language:string)=>{
    if (selectedlanguage.includes(language)) {
      setSelectedlanguage(selectedlanguage.filter(item => item !== language));
    } else {
      setSelectedlanguage([...selectedlanguage, language]);
    }
  }
  useEffect(()=>{
    dispatch({type:"language",payload:selectedlanguage})
  },[selectedlanguage])
  return (
    <Animatable.View
      ref={animatableRef}
      easing={'ease-in-cubic'}
      animation="slideInLeft"
      duration={500}>
      <View style={{rowGap: actuatedNormalize(25)}}>
        <LabelWithDesc
          label="Select Your Language"
          sublabel="language helps in finding regional matches"
        />
        <InterestSelect
          selectedInterests={state.language || ['English']}
          interestCardStyle={{}}
          interests={[
            {text: 'English'},
            {text: 'Hindi'},
            {text: 'Tamil'},
            {text: 'Teleugu'},
            {text: 'Marathi'},
            {text: 'Bhojpuri'},
            {text: 'Arabic'},
            {text: 'Kannada'},
            {text: 'Punjabi'},
            {text: 'Gujrati'},
            {text: 'Bengali'},
            {text: 'Urdu'},
            // Add more interests as needed
          ]}
          onSelectInterest={interest => handlelanguageSelect(interest)}
        />
      </View>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({});

export default Form3;
