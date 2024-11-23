// Form2.tsx
import React, {Dispatch, useEffect, useRef, useState} from 'react';
import {View, TextInput, StyleSheet, Text} from 'react-native';
import InterestSelect from '../selectable/interestSelectable';
import * as Animatable from 'react-native-animatable';
import colors from '../../constants/colors';
import {fonts} from '../../constants/fonts';
import {mentalIssues} from "../../mockdata/mentalissue"
import {actuatedNormalize} from '../../constants/PixelScaling';
import {LabelWithDesc} from '../labels/label1';
import { Action } from '../../container/Registration/Registration';
interface Form2Props {
  state: {
    mentalIssues: string[];
  };
  dispatch: Dispatch<Action>;
}
const SelectMentalissue: React.FC<Form2Props> = ({state,dispatch}) => {
  const animatableRef = useRef<Animatable.View>(null);
  const [selectedMentalIssues,setselectedMentalIssues] = useState<string[]>(state.mentalIssues || ['Anxiety','Breakup'])
  const handlelanguageSelect = (language:string)=>{
    if (selectedMentalIssues.includes(language)) {
      setselectedMentalIssues(selectedMentalIssues.filter(item => item !== language));
    } else {
      setselectedMentalIssues([...selectedMentalIssues, language]);
    }
  }
  useEffect(()=>{
    dispatch({type:"mentalIssues",payload:selectedMentalIssues})
  },[selectedMentalIssues])
  return (
    <Animatable.View
      ref={animatableRef}
      easing={'ease-in-cubic'}
      animation="slideInLeft"
      duration={500}>
      <View style={{rowGap: actuatedNormalize(25)}}>
        <LabelWithDesc
          label="Select Your Mental Issue"
          sublabel="Mental Issue helps in finding same matches"
        />
        <InterestSelect
          selectedInterests={state.mentalIssues || ['Anxiety','Breakup']}
          interestCardStyle={{}}
          interests={mentalIssues}
          onSelectInterest={interest => handlelanguageSelect(interest)}
        />
      </View>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({});

export default SelectMentalissue;
