// UserProfileScreen.tsx
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import { RouteBackButton } from '../../common/button/BackButton';
import { actuatedNormalize } from '../../constants/PixelScaling';
import { fonts } from '../../constants/fonts';
import colors from '../../constants/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LabelWithIcon } from '../../common/drawer/iconlabel';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../AppNavigation/navigatorType';
import { RouteProp } from '@react-navigation/native';
import Animated, { BounceIn, Easing, FadeIn, FadeInDown, FadeInLeft, FadeInUp, FadeOut, FadeOutDown, FadeOutLeft, SharedTransition, withSpring } from 'react-native-reanimated';

type ProfileScreenRouteProp = RouteProp<RootStackParamList, 'ChatPartnerDetails'>;

interface ChatPartnerProps {
    navigation: NativeStackNavigationProp<RootStackParamList>;
    route: ProfileScreenRouteProp;
  }

const ChatPartnerDetails: React.FC<ChatPartnerProps> = ({ navigation, route }) => {
  // Sample user data - replace with real data as needed
   const {chatPartner} = route.params


  //  useEffect(()=>{

  //  })

//   const { user } = useSelector(AuthSelector)

  console.log(chatPartner, "useroftoday=======")
  const userData = {
    mobileNumber: '123-456-7890',
    role: 'Adventurer',
    name: 'Rebecca',
    username: 'rebecca23',
    age: 23,
    gender: 'male',
    interest: ['Vegan', 'Foodie', 'Gaming'],
    language: ['English', 'Spanish'],
    profilePic: 'https://randomuser.me/api/portraits/men/1.jpg', // Replace with actual image URL
    coins: '150',
    userQuote: "It takes courage to grow up and become who you really are",
    bio: "I'm an adventurous professional looking to connect with others. Love hiking and the great outdoors.",
    mentalHealthIssues: ['Anxiety', 'Breakup'],
    callStatus: {
      totalCalls: 240,
      successfulCalls: 210,
      rating: 4.5
    }
  };

  const RenderInterestItem = ({ item }: { item: String }) => (
    <View style={styles.interestItem}>
      <Text style={styles.interestText}>{item}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      
      <RouteBackButton onPress={() => navigation.goBack()} />
      <View style={[styles.avatarContainer, styles.avatar]}>
        <Animated.Image sharedTransitionTag='profile' source={{uri:chatPartner?.profilePic}} style={[styles.avatar,{width:150, height:150}]} />
      </View>
      <Animated.View style={styles.TitleContainer} entering={FadeIn.duration(1200).easing(Easing.ease)} exiting={FadeOutDown.duration(1500).easing(Easing.ease)}>
        <View
          style={{
              flexDirection: 'row',
              alignItems: 'center',
              columnGap: actuatedNormalize(10),
            }}>
        <Animated.Text allowFontScaling={true} style={styles.nameText} >{`${chatPartner?.name}`}</Animated.Text>
          <Icon
            name={chatPartner?.gender === 'male' ? 'gender-male' : 'gender-female'}
            size={22}
            color={chatPartner?.gender === 'male' ? colors.skyBlue : colors.pink}
          />
        </View>
        <Text style={styles.detailText}>Age: {chatPartner?.age.toString()}</Text>
        <Text style={[styles.detailText, { marginTop: actuatedNormalize(10) }]}>{`${chatPartner?.mentalIssues.join(",")}`}</Text>
      </Animated.View>

      <Animated.View entering={FadeInLeft.duration(700).easing(Easing.ease)} exiting={FadeOutDown.duration(1500).easing(Easing.ease)}  style={styles.userPerformaceContainer}>
        <View style={styles.userPerformaceContainer2}>
          <Text style={styles.title}>Total Calls</Text>
          <Text style={styles.number}>{chatPartner?.UserCallsInfoList.length}</Text>
        </View>
        <View style={styles.userPerformaceContainer2}>
          <Text style={styles.title}>Successful Calls</Text>
          <Text style={styles.number}>{chatPartner?.UserCallsInfoList.filter((el) => el.isSuccessful === true).length}</Text>
        </View>
        <View style={styles.userPerformaceContainer2}>
          <Text style={styles.title}>Rating</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.number}>{chatPartner?.UserRating[0]?.rating || 0}</Text>
            <Icon name='star' size={actuatedNormalize(20)} color={colors.yellow} />
          </View>
        </View>
      </Animated.View>
      <Animated.ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.infoContainer} scrollEventThrottle={16}>

        {/* details Container */}
        <View style={styles.descContainer}>
          <LabelWithIcon iconName="person" label={`${chatPartner?.name} Story`} />
          <Text style={styles.bioText}>{userData.bio}</Text>
        </View>
        <View style={styles.descContainer}>
          <LabelWithIcon iconName="tennisball" label="Interest" />
          <View style={styles.interestsContainer}>
            {/* {user?.interest.map((el, _) => (
            <RenderInterestItem item={el} key={_} />
          ))} */}
            <FlatList data={chatPartner?.interest}
              renderItem={({ item }) => <RenderInterestItem item={item} />}
              keyExtractor={(item, index) => index.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>
        </View>
        <View style={styles.descContainer}>
          <LabelWithIcon iconName="text" label="Languages They speak" />
          <View style={styles.interestsContainer}>

            {/* {user?.language.map((el, _) => (
              <RenderInterestItem item={el} key={_} />
            ))} */}
            <FlatList data={userData?.language}
              renderItem={({ item }) => <RenderInterestItem item={item} />}
              keyExtractor={(item, index) => index.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>
        </View>
        {/* <Text style={styles.mentalHealthText}>
          {userData.mentalHealthIssues}
        </Text> */}
        {/* <FlatList
          data={userData.interest}
          renderItem={renderInterestItem}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
        /> */}
        <Text style={styles.quote}>
          {`'${userData.userQuote}'`}
        </Text>
      </Animated.ScrollView>

      {/* <PrimaryButton styles={{ backgroundColor: colors.transparent, borderWidth: 1, borderColor: colors.gray }} label='Edit Profile' handleFunc={() => navigation?.navigate("Registration", { UserData: user })} /> */}

      {/* Additional user info like language, coins, etc. can be added here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    // paddingTop: 50,
  },
  avatar:{
    borderBottomLeftRadius:actuatedNormalize(30),
    borderBottomRightRadius:actuatedNormalize(30)
  },
  avatarContainer: {
    // position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    marginTop:actuatedNormalize(50)
  },
  userPerformaceContainer: {
    flexDirection: "row",
    paddingHorizontal: actuatedNormalize(10),
    marginTop: actuatedNormalize(20),
    justifyContent: "space-between",
    borderRadius: actuatedNormalize(10),
    alignSelf: "center",
    width: "90%",
    // paddingBottom:actuatedNormalize(15)

  },
  userPerformaceContainer2: {
    justifyContent: "center",
    alignItems: "center",
    rowGap: actuatedNormalize(5),

  },
  avatarStyles: {
    borderRadius: 50
  },
  interestsContainer: {
    flexDirection: 'row',
  },
  interestItem: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    flexWrap: "wrap"
  },
  interestText: {
    color: colors.white,
    fontFamily: fonts.NexaRegular,
    fontSize: actuatedNormalize(14)
  },
  TitleContainer: {
    marginTop: actuatedNormalize(30),
    alignItems:'center'
  },
  nameText: {
    fontFamily: fonts.NexaBold,
    fontSize: actuatedNormalize(20),
    color: colors.white,
  },
  detailText: {
    fontFamily: fonts.NexaRegular,
    fontSize: actuatedNormalize(16),
    color: colors.gray,
    alignSelf: 'center',
  },
  bioText: {
    fontFamily: fonts.NexaRegular,
    fontSize: actuatedNormalize(16),
    color: colors.gray,
  },
  mentalHealthText: {},
  descContainer: {
    rowGap: actuatedNormalize(10)
  },
  infoContainer: {
    // flex: 1,
    marginTop: actuatedNormalize(30),
    rowGap: actuatedNormalize(20),
    width:"90%",
    paddingBottom:actuatedNormalize(60)
  },
  number: {
    fontFamily: fonts.NexaBold,
    fontSize: actuatedNormalize(20),
    color: colors.white
  },
  title: {
    fontFamily: fonts.NexaRegular,
    fontSize: actuatedNormalize(14),
    color: colors.gray
  },
  quote: {
    fontFamily: fonts.NexaItalic,
    color: colors.gray,
    fontSize: actuatedNormalize(16),
    textAlign: "center"
  }
  // Add more styles as needed for your UI elements
});

export default ChatPartnerDetails;
