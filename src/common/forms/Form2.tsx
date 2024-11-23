// Form2.tsx
import React, { Dispatch, useEffect, useRef, useState } from 'react';
import {View, TextInput, StyleSheet, Text} from 'react-native';
import InterestSelect from '../selectable/interestSelectable';
import * as Animatable from 'react-native-animatable';
import { actuatedNormalize } from '../../constants/PixelScaling';
import { LabelWithDesc } from '../labels/label1';
import { Action } from '../../container/Registration/Registration';
interface Form2Props {
  state: {
    interest: string[];
  };
  dispatch: Dispatch<Action>;
}

const Form2: React.FC<Form2Props> = ({state, dispatch}) => {
  const animatableRef = useRef<Animatable.View>(null);
  const [selectedInterest,setSelectedInterest] = useState<string[]>(state.interest || ['Music'])

  const handleInterestSelect = (interest:string)=>{
    if (selectedInterest.includes(interest)) {
      setSelectedInterest(selectedInterest.filter(item => item !== interest));
    } else {
      setSelectedInterest([...selectedInterest, interest]);
    }
  }
  useEffect(()=>{
    dispatch({type:"interest",payload:selectedInterest})
  },[selectedInterest])
  return (
    <Animatable.View
    ref={animatableRef}
    easing={'ease-in-cubic'}
    animation="slideInLeft"
    duration={500}>
      <View style={{rowGap:actuatedNormalize(25)}}>
      {/* <Text
          style={{
            color: colors.white,
            fontFamily: fonts.NexaBold,
            fontSize: actuatedNormalize(30),
            alignSelf: 'flex-start',
          }}>
          Select your Interest
        </Text> */}
        <LabelWithDesc label='Select Your Interest' sublabel='Interest helps in finding better matches'/>
      <InterestSelect
        selectedInterests={state.interest || ["Music"]}
        interests={[
          {iconName: 'school', text: 'Education'},
          {iconName: 'music-note', text: 'Music'},
          {iconName: 'sports-soccer', text: 'Sports'},
          {iconName: 'videogame-asset', text: 'Gaming'},
          {iconName: 'local-cafe', text: 'Coffee'},
          {iconName: 'movie', text: 'Movies'},
          {iconName: 'fitness-center', text: 'Fitness'},
          {iconName: 'book', text: 'Reading'},
          {iconName: 'camera', text: 'Photography'},
          {iconName: 'art-track', text: 'Art'},
          { iconName: 'pets', text: 'Pets' },
          { iconName: 'shopping-cart', text: 'Shopping' },
          { iconName: 'fitness-center', text: 'Exercise' },
          { iconName: 'restaurant', text: 'Cooking' },
          { iconName: 'flight', text: 'Traveling' },
          { iconName: 'beach-access', text: 'Beach' },
          { iconName: 'fastfood', text: 'Food' },
          // Add more interests as needed
        ]}
        onSelectInterest={interest => handleInterestSelect(interest)}
      />
    </View>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: actuatedNormalize(50),
  },
});

export default Form2;
