// UserProfileScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, Image } from 'react-native';
import AvatarPulse from '../../common/animation/avatarpulse';
import { RouteBackButton } from '../../common/button/BackButton';
import { NavigationStackProps } from '../Prelogin/onboarding';
import { actuatedNormalize } from '../../constants/PixelScaling';
import { fonts } from '../../constants/fonts';
import colors from '../../constants/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LabelWithIcon } from '../../common/drawer/iconlabel';
import AvatarRingsAnimation from '../../common/animation/avatarpulse';
import { PrimaryButton } from '../../common/button/PrimaryButton';
import { useSelector } from 'react-redux';
import { AuthSelector } from '../../redux/uiSlice';
import PullToRefresh from '../../common/refresh/pull';
import { useGetUserQuery } from '../../api/userService';
import Animated, { runOnJS, useAnimatedRef, useAnimatedScrollHandler } from 'react-native-reanimated';

const UserProfile: React.FC<NavigationStackProps> = ({ navigation }) => {
  // Sample user data - replace with real data as needed

  const { user } = useSelector(AuthSelector)
  const [refreshing, setRefreshing] = useState(false);
  const { data, isLoading: userLoading, refetch } = useGetUserQuery()
  const [isScrollable, setIsScrollable] = useState(false);
  const scrollRef = useAnimatedRef<Animated.ScrollView>();

  const updatePanState = (offset: number) => {
    'worklet';
    if (offset > 0) {
      runOnJS(setIsScrollable)(true);
    } else {
      runOnJS(setIsScrollable)(false);
    }
  };

  const handleOnScroll = useAnimatedScrollHandler({
    onScroll({ contentOffset }) {
      console.log(contentOffset.y, "contentOffset.y----->")
      updatePanState(contentOffset.y);
      // scrollY.value = contentOffset.y;
    },
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate a network request
    await refetch()
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };
  console.log(user, "useroftoday=======")
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
      <Animated.ScrollView           onMomentumScrollEnd={(e) => updatePanState(e.nativeEvent.contentOffset.y)}
 ref={scrollRef} onScroll={handleOnScroll} nestedScrollEnabled={true} showsVerticalScrollIndicator={false} style={styles.container}>
        {/* <RouteBackButton onPress={() => navigation.goBack()} /> */}
        <PullToRefresh handleOnscroll={handleOnScroll} isScrollable={isScrollable} scrollRef={scrollRef} setIsScrollable={setIsScrollable} updatePanState={updatePanState} refreshing={refreshing} onRefresh={handleRefresh}>
        <View style={{width:"100%"}}>
        <View style={styles.avatarContainer}>
          {/* <ShockwavePulseButton>
          <Image source={{uri: userData.profilePic}} width={actuatedNormalize(100)} style={styles.avatarStyles} height={actuatedNormalize(100)}/>
        </ShockwavePulseButton> */}
          <AvatarRingsAnimation source={user?.profilePic} width={150} height={150} />
        </View>
        <View style={styles.TitleContainer}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              columnGap: actuatedNormalize(10),
              alignSelf: "center"
            }}>
            <Text style={styles.nameText}>{`${user?.name}`}</Text>
            <Icon
              name={user?.gender === 'male' ? 'gender-male' : 'gender-female'}
              size={22}
              color={user?.gender === 'male' ? colors.skyBlue : colors.pink}
            />
          </View>
          <Text style={styles.detailText}>Age: {user?.age.toString()}</Text>
          <Text style={[styles.detailText, { marginTop: actuatedNormalize(10), textAlign: "center" }]}>{`${user?.mentalIssues?.join(", ")}`}</Text>
        </View>
        <View style={styles.userPerformaceContainer}>
          <View style={styles.userPerformaceContainer2}>
            <Text style={styles.title}>Total Calls</Text>
            <Text style={styles.number}>{user?.UserCallsInfoList.length}</Text>
          </View>
          <View style={styles.userPerformaceContainer2}>
            <Text style={styles.title}>Successful Calls</Text>
            <Text style={styles.number}>{user?.UserCallsInfoList.filter((el) => el.isSuccessful === true).length}</Text>
          </View>
          <View style={styles.userPerformaceContainer2}>
            <Text style={styles.title}>Rating</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.number}>{user?.UserRating[0]?.rating || 0}</Text>
              <Icon name='star' size={actuatedNormalize(20)} color={colors.yellow} />
            </View>
          </View>
        </View>
        </View>
        </PullToRefresh>


        
        <View style={styles.infoContainer}>

          {/* details Container */}
          <View style={styles.descContainer}>
            <LabelWithIcon iconName="person" label="Your story" />
            <Text style={styles.bioText}>{user?.bio || userData.bio}</Text>
          </View>
          <View style={styles.descContainer}>
            <LabelWithIcon iconName="tennisball" label="Interest" />
            <View style={styles.interestsContainer}>
              {/* {user?.interest.map((el, _) => (
            <RenderInterestItem item={el} key={_} />
          ))} */}
              <FlatList data={user?.interest}
                renderItem={({ item }) => <RenderInterestItem item={item} />}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
              />
            </View>
          </View>

          <View style={styles.descContainer}>
            <LabelWithIcon iconName="text" label="Languages you speak" />
            <View style={styles.interestsContainer}>

              {/* {user?.language.map((el, _) => (
              <RenderInterestItem item={el} key={_} />
            ))} */}
              <FlatList data={user?.language}
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
          <View style={{ rowGap: actuatedNormalize(5) }}>
            <Text style={styles.quote}>
              {`'${userData.userQuote}'`}
            </Text>
            <Text style={[styles.quote, { fontFamily: fonts.NexaBold }]}>
              {`'E.E. Cummings'`}
            </Text>
          </View>

        </View>
        <View style={{ position: "absolute", bottom: 0, width: "100%" }}>
          <PrimaryButton styles={{ backgroundColor: colors.transparent, borderWidth: 1, borderColor: colors.gray }} label='Edit Profile' handleFunc={() => navigation?.navigate("Registration", { UserData: user })} />
        </View>
        {/* Additional user info like language, coins, etc. can be added here */}
      </Animated.ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    //marginTop:50,
    // alignItems: 'center',
    // paddingTop: 50,
     width: "100%",
    // alignSelf: "center"
  },

  avatarContainer: {
    marginTop:50,

  },
  userPerformaceContainer: {
    flexDirection: "row",
    // paddingHorizontal: actuatedNormalize(10),
    marginTop: actuatedNormalize(20),
    justifyContent: "space-between",
    borderRadius: actuatedNormalize(10),
    alignSelf: "center",
    width: "100%",
    // backgroundColor:'red'

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
    width: "100%",
    // backgroundColor:"red"
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
    // backgroundColor:"red"
  },
  nameText: {
    fontFamily: fonts.NexaBold,
    fontSize: actuatedNormalize(30),
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
    rowGap: actuatedNormalize(10),
    width: "100%",
    alignSelf: "flex-start"
  },
  infoContainer: {
    marginTop: actuatedNormalize(30),
    rowGap: actuatedNormalize(20),
    flexGrow: 1,
    alignItems: 'center',
    paddingBottom: 70,
    // backgroundColor:"red",
    paddingHorizontal:actuatedNormalize(20),
    width: "100%",
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

export default UserProfile;
