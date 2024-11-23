import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {actuatedNormalize} from '../../constants/PixelScaling';
import colors from '../../constants/colors';
import {fonts} from '../../constants/fonts';
import { ViewStyle } from 'react-native';

interface Interest {
  iconName?: string;
  text: string;
}

interface InterestSelectProps {
  interests: Interest[];
  selectedInterests: string[];
  onSelectInterest: (interest: string) => void;
  interestCardStyle?:ViewStyle
}

const InterestSelect: React.FC<InterestSelectProps> = ({
  interests,
  selectedInterests,
  onSelectInterest,
  interestCardStyle
}) => {
  const [selected, setSelected] = useState<string[]>(selectedInterests);

  const handleToggleInterest = (interest: string) => {
    if (selected.includes(interest)) {
      setSelected(selected.filter(item => item !== interest));
    } else {
      setSelected([...selected, interest]);
    }
    onSelectInterest(interest);
  };

  const isInterestSelected = (interest: string) => selected.includes(interest);

  return (
    <View style={styles.container}>
      {interests.map((interest, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.interestCard,
            interestCardStyle,
            isInterestSelected(interest.text) && styles.selected,
          ]}
          onPress={() => handleToggleInterest(interest.text)}>
          {interest.iconName && (
            <MaterialIcons
              name={interest.iconName}
              size={16}
              color={
                isInterestSelected(interest.text) ? colors.white : colors.dark
              }
            />
          )}
          <Text
            style={[
              styles.interestText,
              {
                color: isInterestSelected(interest.text)
                  ? colors.white
                  : colors.dark,
              },
            ]}>
            {interest.text}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    gap: actuatedNormalize(10),
  },
  interestCard: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: colors.lightGray,
    borderRadius: actuatedNormalize(30), // Small border radius
    padding: actuatedNormalize(10),
    columnGap: actuatedNormalize(7),
    overflow: 'hidden',
    flexWrap: 'wrap',
  },
  interestText: {
    fontSize: actuatedNormalize(12),
    fontFamily: fonts.NexaBold,
  },
  selected: {
    backgroundColor: colors.primary, // Customize the selected background color as needed
  },
});

export default InterestSelect;
