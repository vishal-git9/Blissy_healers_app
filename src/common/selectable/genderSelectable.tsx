import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import  Ionicons  from 'react-native-vector-icons/Ionicons';
import colors from '../../constants/colors';
import { fonts } from '../../constants/fonts';

interface GenderSelectProps {
  selectedGender: string;
  onSelectGender: (gender: 'male' | 'female') => void;
}

const GenderSelect: React.FC<GenderSelectProps> = ({ selectedGender, onSelectGender }) => {
  const [maleSelected, setMaleSelected] = useState(selectedGender === 'male');
  const [femaleSelected, setFemaleSelected] = useState(selectedGender === 'female');

  const handleSelectGender = (gender: 'male' | 'female') => {
    onSelectGender(gender);
    setMaleSelected(gender === 'male');
    setFemaleSelected(gender === 'female');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.genderCard, maleSelected && styles.selected]}
        onPress={() => handleSelectGender('male')}
      >
        <Ionicons name="male" size={40} color={maleSelected ? colors.white : colors.dark} />
        <Text style={[styles.genderText,{color:maleSelected ? colors.white : colors.dark}]}>Male</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.genderCard, femaleSelected && styles.selected]}
        onPress={() => handleSelectGender('female')}
      >
        <Ionicons name="female" size={40} color={femaleSelected ? colors.white : colors.dark} />
        <Text style={[styles.genderText,{color:femaleSelected ? colors.white : colors.dark}]}>Female</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  genderCard: {
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'lightgray',
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 10,
    width: '45%',
  },
  genderText: {
    marginTop: 5,
    fontSize: 18,
    fontFamily:fonts.NexaBold
  },
  selected: {
    backgroundColor: colors.primary, // Customize the selected background color as needed
  },
});

export default GenderSelect;
