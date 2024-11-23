import {AnimationObject} from 'lottie-react-native';
import colors from '../constants/colors';

export interface OnboardingData {
  id: number;
  animation: AnimationObject;
  text: string;
  desc:string;
  textColor: string;
  backgroundColor: string;
}

const data: OnboardingData[] = [
  {
    id: 1,
    animation: require('../../assets/animation/lottie1.json'),
    text: 'Welcome to Blissy',
    desc:"Connect with people facing similar life challenges and mental health concerns",
    textColor: '#ffffff',
    backgroundColor: colors.secondary,
  },
  {
    id: 2,
    animation: require('../../assets/animation/lottie2.json'),
    text: 'Discover Your Tribe!',
    desc:"We carefully match you with individuals who understand your struggles",
    textColor: '#ffffff',
    backgroundColor:colors.primary,
  },
  {
    id: 3,
    animation: require('../../assets/animation/lottie3.json'),
    text: 'Empower Yourself Through Connection',
    desc:"Tap Get Started to embark on a journey of healing and support!",
    textColor: '#ffffff',
    backgroundColor: colors.dark,
  },
];

export default data;
