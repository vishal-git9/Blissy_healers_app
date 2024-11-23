import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { actuatedNormalize } from '../../constants/PixelScaling';
import { Text } from 'react-native';
import { fonts } from '../../constants/fonts';
import colors from '../../constants/colors';
interface ImageSource {
    uri: string;
  }

const imageSources: ImageSource[] = [
  { uri: 'https://images.unsplash.com/photo-1498746607408-1e56960e3bdd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGdpcmxzfGVufDB8fDB8fHww' },
  { uri: 'https://images.unsplash.com/photo-1586907835000-f692bbd4c9e0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGdpcmxzfGVufDB8fDB8fHww' },
  { uri: 'https://images.unsplash.com/photo-1597586124394-fbd6ef244026?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGdpcmxzfGVufDB8fDB8fHww' },
  { uri: 'https://images.unsplash.com/photo-1568739253582-afa48fbcea47?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzJ8fGdpcmxzfGVufDB8fDB8fHww' },
  { uri: 'https://images.unsplash.com/photo-1601288496920-b6154fe3626a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzB8fGdpcmxzfGVufDB8fDB8fHww' },
];

const shuffleArray = <T,>(array: T[]): T[] => {
    let currentIndex = array.length, randomIndex;
  
    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  };

const CircularImageReveal = () => {
  const delay = 100; // Delay in milliseconds between each image reveal
  const shuffledImages = shuffleArray([...imageSources]); // Shuffle images to ensure uniqueness

  return (
    <View style={styles.container}>
      {shuffledImages.map((source, index) => (
        <Animatable.View
          key={index}
          animation="fadeIn"
          duration={1000}
          delay={(index+1 )* delay * 50}
          style={styles.imageWrapper}
        >
          <Image source={source} style={styles.image} blurRadius={20} />
        </Animatable.View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: actuatedNormalize(20), // Adjust for the desired overlap

  },
  imageWrapper: {
    height: actuatedNormalize(50), // Adjust size as needed
    width: actuatedNormalize(50),
    borderRadius: actuatedNormalize(50),
    overflow: 'hidden',
    marginLeft: actuatedNormalize(-20), // Adjust for the desired overlap
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
  }
});

export default CircularImageReveal;
