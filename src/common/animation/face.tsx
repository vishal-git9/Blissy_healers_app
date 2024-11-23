import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import Svg, { Circle, Path } from 'react-native-svg';
import colors from '../../constants/colors';

const FaceComponent: React.FC<{ rating: number }> = ({ rating }) => {
  const [expression, setExpression] = useState('neutral');
  const [backgroundColor, setBackgroundColor] = useState('lightgrey');

  useEffect(() => {
    let newExpression = 'neutral';
    let newBackgroundColor = colors.lightGray; // Default color
    if (rating < 3) {
      newExpression = 'sad';
      newBackgroundColor = colors.red;
    } else if (rating >= 4) {
      newExpression = 'happy';
      newBackgroundColor = colors.gold;
    }

    setExpression(newExpression);
    setBackgroundColor(newBackgroundColor);
  }, [rating]);

  const getMouthPath = () => {
    switch (expression) {
      case 'happy':
        return 'M5 13 Q 12 18, 19 13';
      case 'sad':
        return 'M5 18 Q 12 13, 19 18';
      default:
        return 'M5 15.5 Q 12 15.5, 19 15.5';
    }
  };

  return (
    <Animatable.View
      animation="fadeIn"
      duration={1000}
      easing="ease-in"
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: backgroundColor,
        borderRadius: 100, // Making the View circular
        width: 150,
        height: 150,
      }}>
      <Svg height="150" width="150" viewBox="0 0 24 24">
        <Circle cx="7" cy="10" r="1" fill="black" />
        <Circle cx="17" cy="10" r="1" fill="black" />
        <Path d={getMouthPath()} fill="none" stroke="black" strokeWidth="1.5" />
      </Svg>
    </Animatable.View>
  );
};

export default FaceComponent;
