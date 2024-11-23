import React, { useState, useEffect } from 'react';
import {
  Animated,
  Text,
  View,
  Platform,
  AppState,
  Easing,
  ViewProps,
} from 'react-native';

// https://github.com/watadarkstar/react-native-typing-animation/issues/18

const UpAndDown = ({
  easing = Easing.ease,
  delay,
  transformation,
  children,
}: any) => {
  const [base] = useState(new Animated.Value(0));
  const [stateApp, setAppState] = useState<any>(undefined);
  React.useEffect(() => {
    AppState.addEventListener('change', setAppState);
    return () => AppState.removeEventListener('change', setAppState);
  }, []);
  React.useEffect(() => {
    const anim = Animated.sequence([
      Animated.delay(delay),
      Animated.loop(
        Animated.timing(base, {
          toValue: 1,
          duration: 987,
          easing,
          useNativeDriver: Platform.OS !== 'web',
        })
      ),
    ]);
    anim.start();
    return () => anim.stop();
  }, [stateApp]);
  const translateY = base.interpolate({
    inputRange: [0, 0.45, 0.55, 1],
    outputRange: [5, -5, -5, 5],
  });
  const translateX = base.interpolate({
    inputRange: [0, 0.45, 0.55, 1],
    outputRange: [-3, 0, 0, -3],
  });
  const scale = base.interpolate({
    inputRange: [0, 0.45, 0.55, 1],
    outputRange: [1, 0.6, 0.6, 1],
  });
  const opacity = base.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.6, 1, 0.6],
  });
  const transform: any = [];
  let opacityAnim: boolean = false;
  const trsf = (Array.isArray(transformation)
    ? transformation
    : [transformation]
  ).forEach(trsf => {
    switch (trsf) {
      case 'translateY':
        transform.push({ translateY });
        break;
      case 'scale':
        transform.push({ scale });
        break;
      case 'translateX':
        transform.push({ translateX });
        break;
      case 'opacity':
        opacityAnim = true;
        break;
      default:
        transform.push({ translateY });
    }
  });
  return (
    <Animated.View
      style={[
        {
          justifyContent: 'center',
          alignItems: 'center',
          width: 22,
          transform,
        },
        opacityAnim ? { opacity } : undefined,
      ]}>
      {children}
    </Animated.View>
  );
};

interface DotProps {
  color?: string;
  size?: number;
}
const dotSize = 17;
const dotColor = 'rgba(0, 0, 0, 0.38)';
const Dot = ({ color, size }: DotProps) => (
  <View
    style={{
      width: size,
      height: size,
      borderRadius: (size || 0) / 2,
      backgroundColor: color,
    }}
  />
);
Dot.defaultProps = {
  color: dotColor,
  size: dotSize,
};

const Container = (props: View['props']) => (
  <View
    style={{
      width: 88,
      height: 54,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 13,
      backgroundColor: '#f0f0f0',
    }}
    {...props}
  />
);

const ContainerContent = (props: View['props']) => (
  <View
    style={{
      flexDirection: 'row',
    }}
    {...props}
  />
);

type Transformation = 'scale' | 'translateY' | 'translateX' | 'opacity';

interface TypingProps {
  transformation?: Transformation | Transformation[];
  renderDot?: (props?: DotProps) => React.ReactNode;
  dotProps?: DotProps;
  containerProps?: ViewProps;
  containerContentProps?: ViewProps;
}
const Typing = ({
  transformation,
  renderDot,
  dotProps,
  containerContentProps,
  containerProps,
}: TypingProps) => (
  <Container {...containerProps}>
    <ContainerContent {...containerContentProps}>
      {[0, 329, 658].map((delay: number) => (
        <UpAndDown {...{ transformation, delay }}>
          {renderDot!(dotProps)}
        </UpAndDown>
      ))}
    </ContainerContent>
  </Container>
);
Typing.defaultProps = {
  renderDot: (props: DotProps) => <Dot {...props} />,
  transformation: 'translateY',
};

const Spacer = () => <View style={{ marginBottom: 20 }} />;

export default () => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Text style={{ fontSize: 22, textAlign: 'center', marginHorizontal: 15 }}>
      {'What is it possible with Animation & RNW?'}
    </Text>
    <Text
      style={{
        color: '#0F4C81',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 20,
        fontStyle: 'italic',
      }}>
      {'Typing animation component:'}
    </Text>
    <Typing transformation="translateY" />
    <Spacer />
    <Typing transformation="translateX" />
    <Spacer />
    <Typing transformation="scale" />
    <Spacer />
    <Typing transformation="opacity" />
    <Spacer />
    <Typing transformation={['translateY', 'scale']} />
    <Spacer />
    <Typing transformation={['opacity', 'scale']} />
  </View>
);
