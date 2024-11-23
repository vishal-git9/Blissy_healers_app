import React from 'react';
import {Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {HealerMockData} from '../../mockdata/healerData';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../AppNavigation/navigatorType';
import { Image } from 'react-native';
import colors from '../../constants/colors';
import { actuatedNormalize } from '../../constants/PixelScaling';


const {width,height} = Dimensions.get('screen')
interface HealerList {
    navigation: NativeStackNavigationProp<RootStackParamList>;
}
export const HealerList:React.FC<HealerList> = ({navigation}) => {

    const renderItem = ({ item }: { item: any }) => {
        return (
          <TouchableOpacity
            onPress={() => navigation.navigate('Healerdetails', { item })}
            activeOpacity={0.8}
            style={styles.itemContainer}>
              <Image source={{ uri: item.imageUrl }} style={styles.image} resizeMode="cover" />
            <View style={styles.textContainer}>
              <Text style={styles.title}>{item.name}</Text>
              <Text style={styles.bio}>{item.bio}</Text>
            </View>
          </TouchableOpacity>
        );
      };
  return (
    <View>
      
      <FlatList
      data={HealerMockData}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.container}
    />
      {/* <View style={styles.bg}/> */}
    </View>
  );
};


const styles = StyleSheet.create({
    bg:{
        position:'absolute',
        width,
        height,
        backgroundColor:"red",
        transform:[{translateY:height}],
        borderRadius:actuatedNormalize(32)
    },
    container: {
        padding: 16,
      },
      itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
      },
      image: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: 16,
      },
      textContainer: {
        flex: 1,
      },
      title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
      },
      bio: {
        fontSize: 14,
      },
})