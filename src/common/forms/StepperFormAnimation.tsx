import React, {useRef} from 'react';
import {View, StyleSheet} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { actuatedNormalize } from '../../constants/PixelScaling';
interface StepperFormAnimationProps {
  children: React.ReactNode[];
  currentStep: number;
  onNext: () => void;
}

const StepperFormAnimation: React.FC<StepperFormAnimationProps> = ({
  children,
  currentStep,
  onNext,
}) => {
  //   React.useEffect(() => {
  //     translateY.value = withTiming(-currentStep * 100);
  //   }, [currentStep]);

  //   const animatedStyle = useAnimatedStyle(() => {
  //     return {
  //       transform: [{ translateY: translateY.value }],
  //     };
  //   });

  const animatableRef = useRef<Animatable.View>(null);
  return (
    <>
        {children.map((child, index) => (
          <View
            key={index} style={[styles.container,index + 1 === currentStep ? {} : { display: 'none' }]}>
            {index + 1 === currentStep && child}
          </View>
        ))}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop:actuatedNormalize(40),
  }
});

export default StepperFormAnimation;
