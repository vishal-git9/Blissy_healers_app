import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react'
import { Image, StyleSheet, View } from 'react-native'
import { RootStackParamList } from '../../AppNavigation/navigatorType';
import { RouteProp } from '@react-navigation/native';
import { SharedElement } from 'react-native-shared-element';
import { Text } from 'react-native';


interface Healerdetails {
    navigation: NativeStackNavigationProp<RootStackParamList>;
    route: RouteProp<RootStackParamList, 'Healerdetails'>;
}
export const Healerdetails: React.FC<Healerdetails> = ({ navigation, route }) => {
    const { item } = route.params;
  
    return (
      <View style={styles.container}>
      
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      padding: 16,
    },
    image: {
      width: '100%',
      height: 200,
      borderRadius: 8,
      marginBottom: 16,
    },
    textContainer: {
      flex: 1,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    bio: {
      fontSize: 16,
    },
  });
