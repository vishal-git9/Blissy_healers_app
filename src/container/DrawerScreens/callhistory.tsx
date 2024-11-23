// ChatListScreen.tsx
import React from 'react';
import {View, FlatList, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {NavigationStackProps} from '../Prelogin/onboarding';
import colors from '../../constants/colors';
import {RouteBackButton} from '../../common/button/BackButton';
import {Image} from 'react-native';
import {actuatedNormalize} from '../../constants/PixelScaling';
import {fonts} from '../../constants/fonts';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {RoundedIconContainer} from '../../common/button/rounded';
import TalkNowButton from '../../common/button/Talknow';
import { ComingSoonComponent } from '../comingsoon/comingsoon';

interface Chat {
  id: string;
  name: string;
  avatar: string; // URL or local source of the avatar image
  lastCall: string;
  timestamp: string;
}

const chats: Chat[] = [
  {
    id: '1',
    name: 'Den Shearer',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg', // Replace with actual avatar image URL
    lastCall: '2 Feb',
    timestamp: '14:30',
  },
  {
    id: '2',
    name: 'Sonu Hwang',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg', // Replace with actual avatar image URL
    lastCall: '5 Feb',
    timestamp: '14:10',
  },
  // ... add more chat objects as needed
];

const CallHistory: React.FC<NavigationStackProps> = ({navigation}) => {
  const renderChatItem = ({item}: {item: Chat}) => (
    <TouchableOpacity
      style={styles.chatItem}>
      <Image source={{uri: item.avatar}} style={styles.avatar} />
      <View style={styles.chatDetails}>
        <Text style={styles.chatName}>{item.name}</Text>
        <View
          style={{
            flexDirection: 'row',
            columnGap: actuatedNormalize(5),
            alignItems: 'center',
          }}>
          <Text style={styles.lastMessage}>{item.lastCall}</Text>
          <Text style={styles.lastMessage}>{item.timestamp}</Text>
        </View>
      </View>
      <View style={{flexDirection: 'row', columnGap: actuatedNormalize(10)}}>
        <TalkNowButton label='Call Again' onPress={() => navigation.navigate("Connection")}/>
      </View>
    </TouchableOpacity>
  );

  return (
    <ComingSoonComponent navigation={navigation} screenName='Call History'/>
    // <View style={styles.container}>
    //   <RouteBackButton onPress={() => navigation.goBack()} />
    //   <Text
    //     style={{
    //       color: colors.white,
    //       alignSelf: 'center',
    //       fontFamily: fonts.NexaBold,
    //       fontSize: actuatedNormalize(23),
    //       marginTop: actuatedNormalize(20),
    //     }}>
    //     Call History
    //   </Text>
    //   {/* Icons can be added here */}
    //   <FlatList
    //     data={chats}
    //     contentContainerStyle={{
    //       rowGap: actuatedNormalize(10),
    //       marginHorizontal: actuatedNormalize(10),
    //       marginTop: actuatedNormalize(40),
    //     }}
    //     keyExtractor={item => item.id}
    //     renderItem={renderChatItem}
    //   />
    // </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: actuatedNormalize(20),
  },
  //   headerTitle: {
  //     fontSize: 24,
  //     fontWeight: 'bold',
  //   },
  chatItem: {
    flexDirection: 'row',
    padding: actuatedNormalize(15),
    borderRadius: actuatedNormalize(10),
    borderBottomColor: '#ececec',
    backgroundColor: colors.dark, // Assuming a white background for each chat item
    alignItems: 'center',
  },
  avatar: {
    width: actuatedNormalize(60),
    height: actuatedNormalize(60),
    borderRadius: actuatedNormalize(30), // Makes it circular
    marginRight: actuatedNormalize(15),
  },
  chatDetails: {
    flex: 1,
    rowGap: actuatedNormalize(5),
  },
  chatName: {
    fontSize: actuatedNormalize(18),
    color: colors.white,
    fontFamily: fonts.NexaBold,
  },
  lastMessage: {
    color: colors.gray,
    fontSize: actuatedNormalize(14),
  },
  timestamp: {
    color: colors.gray,
    fontSize: actuatedNormalize(12),
  },
});

export default CallHistory;
