import { createDrawerNavigator } from '@react-navigation/drawer';
import React from 'react';
import UserProfile from '../container/DrawerScreens/Userprofile';
import { Help } from '../container/DrawerScreens/help';
import { HomeScreen } from '../container/Home/HomeScreen';
import colors from '../constants/colors';
import CustomDrawer from '../common/drawer/customdrawer';
import { fonts } from '../constants/fonts';
import { actuatedNormalize } from '../constants/PixelScaling';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CallHistory from '../container/DrawerScreens/callhistory';
import ChatHistory from '../container/DrawerScreens/chathistory';
import { Pressable } from 'react-native';
import { Text } from 'react-native';
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
export const Drawer = createDrawerNavigator();

export const DrawerNavigator: React.FC = () => {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawer {...props} />}
      screenOptions={({ navigation }) => ({
        headerShown: false,
        drawerStyle: { backgroundColor: colors.black },
        sceneContainerStyle: { backgroundColor: colors.black },
        drawerType: 'slide',
        swipeEnabled: true,
        drawerActiveBackgroundColor: colors.primary,
        drawerActiveTintColor: colors.white,
        drawerItemStyle: {
          borderRadius: actuatedNormalize(10),
          paddingHorizontal: actuatedNormalize(5),
        },
        headerLeft: ({ }) => (
          <Pressable onPress={navigation.toggleDrawer} style={{marginLeft:10}}>
              {/* <Ionicons name="arrow-back" size={24} color={colors.white} /> */}
              <MaterialIcons name="segment" size={actuatedNormalize(30)} color={colors.white} />
          </Pressable >
        ),
        drawerInactiveTintColor: colors.gray,
        drawerLabelStyle: {
          fontFamily: fonts.NexaBold,
          marginLeft: actuatedNormalize(-15),
          fontSize: actuatedNormalize(16),
        },
        drawerAllowFontScaling: true,
      })}
      initialRouteName="Home">
      <Drawer.Screen
        name="Home"
        options={{
          drawerIcon: ({ }) => (
            <Ionicons name="home" size={24} color={colors.white} />
          ),
        }}
        component={HomeScreen}
      />
      <Drawer.Screen

        options={{
          drawerIcon: ({ }) => (
            <AntDesign name="user" size={24} color={colors.white} />
          ),
          headerShown: true,
          headerTitle: '',
          headerTintColor: colors.white,
          headerTitleStyle: { color: colors.white, fontFamily: fonts.NexaRegular, fontSize: actuatedNormalize(20) },
          headerTransparent: true,
          headerStyle: {
            backgroundColor: colors.transparent,
          },
        }}
        name="Profile"
        component={UserProfile}
      />
      <Drawer.Screen
        options={{
          drawerIcon: ({ }) => (
            <Octicons name="stack" size={24} color={colors.white} />
          ),
          headerShown: true,
          headerTitle: '',
          headerTintColor: colors.white,
          headerTitleStyle: { color: colors.white, fontFamily: fonts.NexaRegular, fontSize: actuatedNormalize(20) },
          headerTransparent: true,
          headerStyle: {
            backgroundColor: colors.transparent,
          },
          title: "Call History"
        }}
        name="Callhistory"
        component={CallHistory}
      />
      <Drawer.Screen
        options={{
          
          drawerIcon: ({ }) => (
            <Ionicons name="chatbox" size={24} color={colors.white} />
          ),
          headerShown: true,
          headerTitle: '',
          headerTintColor: colors.white,
          headerTitleStyle: { color: colors.white, fontFamily: fonts.NexaRegular, fontSize: actuatedNormalize(20) },
          headerTransparent: true,
          headerStyle: {
            backgroundColor: colors.transparent,
          },
          title: "Chat History"
        }}

        name="Chatroom"
        component={ChatHistory}
      />
    </Drawer.Navigator>
  );
};
