import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Avatar, Card, Title, Paragraph } from 'react-native-paper';
import colors from '../../constants/colors';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { actuatedNormalize } from '../../constants/PixelScaling';
import * as Animatable from 'react-native-animatable';
import { fonts } from '../../constants/fonts';
import TalkNowButton from '../button/Talknow';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../AppNavigation/navigatorType';
import { UserInterface } from '../../redux/uiSlice';

interface Props {
  item:UserInterface
  navigation: NativeStackNavigationProp<RootStackParamList>;
}

const ProfileCard: React.FC<Props> = ({
item,
  navigation
}) => {

  
  return (
    <>
    {/* // <Animatable.View
    //   style={{}}
    //   animation={shouldAnimate ? 'bounceInLeft' : undefined}
    //   useNativeDriver={true}
    //   iterationCount={1}
    //   delay={id * 500}
    // > */}
      <Card style={styles.card} elevation={5} 
         onPress={() => {
          navigation.navigate('ChatWindow', {
            Chats:null,socketId:undefined,userDetails:item,senderUserId:item._id || null});
          }}>
        <Card.Content>
          <View style={styles.header}>
            <Image width={50} height={50} style={{borderRadius:30}}   source={{ uri: item.profilePic }} />
            <View style={styles.details}>
              <Title style={{ color: colors.white, fontFamily: fonts.NexaBold }}>
                {item.name}
              </Title>
              <View style={styles.genderContainer}>
                <Icon
                  name={item.gender === 'male' ? 'gender-male' : 'gender-female'}
                  size={24}
                  color={item.gender === 'male' ? 'blue' : 'pink'}
                />
                <Text style={styles.age}>{item.age}</Text>
              </View>
            </View>
          </View>
          <View style={[styles.row,{}]}>
            <AntDesign
              style={styles.icon}
              name="user"
              size={16}
              color={colors.white}
            />
            <Paragraph numberOfLines={2} style={styles.bio}>
              {item.bio || "healer has not updated his bio"}
            </Paragraph>
          </View>
          <View style={styles.rowBetween}>
            <View style={styles.column}>
              <View style={styles.row}>
                <Ionicons name="call" size={14} color={colors.white} />
                <Paragraph style={styles.hours}>
                  <Text style={styles.callsCount}>{item.UserCallsInfoList.length} </Text>
                  Calls completed
                </Paragraph>
              </View>
              <View style={styles.row}>
                <AntDesign name="star" size={14} color={colors.yellow} />
                <Text style={styles.rating}>
                  {item?.UserRating[0]?.rating || 0} ({item.UserCallsInfoList.length})
                </Text>
              </View>
            </View>
          </View>
        </Card.Content>

      </Card>
      {/* <BlurView
        style={styles.absolute}
        blurType="ultraThinMaterialLight"
        blurAmount={3}
      /> */}
      {/* <View style={styles.overlay}>
        <TalkNowButton label='Coming Soon..' onPress={() => console.log("first")} />
      </View> */}
    {/* // </Animatable.View> */}
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: actuatedNormalize(20),
    paddingHorizontal: actuatedNormalize(5),
    backgroundColor: colors.dark,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  details: {
    marginLeft: 10,
    flex: 1,
  },
  genderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: actuatedNormalize(5),
  },
  age: {
    fontSize: actuatedNormalize(16),
    color: colors.gray,
  },
  bio: {
    fontSize: actuatedNormalize(14),
    fontFamily: fonts.NexaRegular,
    color: colors.gray,
  },
  hours: {
    fontSize: actuatedNormalize(14),
    color: colors.gray,
  },
  rating: {
    fontSize: actuatedNormalize(14),
    fontFamily: fonts.NexaRegular,
    color: colors.gray,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: actuatedNormalize(5),
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  column: {
    rowGap: actuatedNormalize(5),
  },
  icon: {
    // marginBottom: actuatedNormalize(15),
  },
  callsCount: {
    color: colors.white,
    fontFamily: fonts.NexaBold,
    fontSize: actuatedNormalize(16),
  },
  absolute: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: actuatedNormalize(20)
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    backgroundColor:colors.darkOverlayColor2,
    alignItems: 'center',
  }
});

export default ProfileCard;
