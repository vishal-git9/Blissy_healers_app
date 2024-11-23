import React, { useState } from 'react';
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  Dimensions,
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import messaging from '@react-native-firebase/messaging';
import notifee, {EventType } from '@notifee/react-native';

import Entypo from 'react-native-vector-icons/Entypo';
import colors from '../../constants/colors';
import { SCREEN_HEIGHT, actuatedNormalize } from '../../constants/PixelScaling';
import { fonts } from '../../constants/fonts';
import * as Animatable from 'react-native-animatable';
import Styles from '../../constants/styles';
import { ModalComponent } from '../modals/modalcomponent';
import { LabelWithIcon } from './iconlabel';
import { ProfileBox } from './profilebox';
import { useDispatch, useSelector } from 'react-redux';
import { AuthSelector, logoutUser } from '../../redux/uiSlice';
import { AuthApi, useLogoutUserSessionMutation } from '../../api/authService';
import { UserApi, useDeleteFcmTokenMutation } from '../../api/userService';
import { ChatApi } from '../../api/chatService';
import { BlissyLoader } from '../loader/blissy';
import { resetCallState } from '../../redux/callSlice';
import { resetMsgState } from '../../redux/messageSlice';
import { resetrewardsState } from '../../redux/rewardSlice';
const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const CustomDrawer: React.FC<any> = props => {
  const [ConfirmModal, setConfirmModal] = useState<boolean>(false);
  const { user } = useSelector(AuthSelector)
  const dispatch = useDispatch()
  const [deleteFcmToken, { isLoading, isError, isSuccess }] = useDeleteFcmTokenMutation()
  const [logoutUserSession, { isLoading: islogoutLoading }] = useLogoutUserSessionMutation()

  console.log(props, "props of drawer----->", user)


  const confirmModalBody = (
    <Animatable.View
      animation={'bounceIn'}
      duration={500}
      easing={'ease-in'}
      style={styles.modalCardCont}>
      <View style={styles.modalChildContainer}>
        <View style={[styles.cardStyle]}>
          <Animatable.Text
            animation="bounceIn"
            duration={500}
            delay={500}
            style={styles.textStyle}
            iterationCount={2}>
            Really want to Log Out ?
          </Animatable.Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              width: '100%',
            }}>
            <TouchableOpacity
              onPress={() => {
                setConfirmModal(false);
              }}>
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Animatable.View
                  style={[
                    Styles.neuoMorphism,
                    { borderRadius: 50, backgroundColor: 'white', padding: 5 },
                  ]}
                  animation="rotate"
                  delay={500}
                  iterationCount={1}>
                  <Entypo name={'emoji-happy'} color={colors.primary} size={35} />
                </Animatable.View>
                <Text style={[styles.textStyle, { marginTop: actuatedNormalize(5) }]}>No</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={async () => {
                setConfirmModal(false);
                await deleteFcmToken({}) // delete the fcm token
                // await logoutUserSession({}) // logout user session
                dispatch(AuthApi.util.resetApiState())
                dispatch(UserApi.util.resetApiState())
                dispatch(ChatApi.util.resetApiState())
                dispatch(logoutUser());
                dispatch(resetCallState())
                dispatch(resetMsgState())
                dispatch(resetrewardsState())
                notifee.cancelDisplayedNotifications()
                props.navigation.closeDrawer()
                // props.navigation.popToTop()
                // deleting fcm token from the backend for this user so that notification are disabled for this user
                // props.navigation.replace('Login');
                props.navigation.reset({
                  index: 0,
                  routes: [{ name: 'Login' }],
                  })
                // console.log('Yes');
              }}>
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Animatable.View
                  animation="rotate"
                  delay={600}
                  style={[
                    Styles.neuoMorphism,
                    { borderRadius: 50, backgroundColor: 'white', padding: 5 },
                  ]}
                  iterationCount={1}>
                  <Entypo name={'emoji-sad'} color={colors.red} size={35} />
                </Animatable.View>
                <Text style={[styles.textStyle, { marginTop: actuatedNormalize(5) }]}>Yes</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Animatable.View>
  );

  return (
    <View style={{ flex: 1, marginTop: actuatedNormalize(15) }}>
      {isLoading || islogoutLoading && <View style={styles.loaderContainer}>
        <BlissyLoader /></View>}
      <DrawerContentScrollView {...props}>
        <ProfileBox {...user} />
        <View style={{ flex: 1, marginTop: actuatedNormalize(15) }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: '90%',
              alignSelf: 'center',
              columnGap: actuatedNormalize(10),
            }}>
            <Text
              style={{
                color: colors.gray,
                fontSize: actuatedNormalize(16),
                fontFamily: fonts.NexaRegular,
              }}>
              For You
            </Text>
            <View
              style={{
                flex: 1,
                borderTopWidth: 0.5,
                borderTopColor: colors.gray,
              }}
            />
          </View>

          {/* Drawer item list */}
          <View style={{ marginTop: actuatedNormalize(10) }}>
            <DrawerItemList {...props} />
          </View>

          {/* communication */}
          <View style={{ width: '90%', alignSelf: 'center' }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                columnGap: actuatedNormalize(10),
                marginTop: actuatedNormalize(10),
              }}>
              <Text
                style={{
                  color: colors.gray,
                  fontSize: actuatedNormalize(16),
                  fontFamily: fonts.NexaRegular,
                }}>
                Communication
              </Text>
              <View
                style={{
                  flex: 1,
                  borderTopWidth: 0.5,
                  borderTopColor: colors.gray,
                }}
              />
            </View>
            <View
              style={{
                rowGap: actuatedNormalize(20),
                marginTop: actuatedNormalize(20),
              }}>
              <LabelWithIcon onPress={() => props.navigation.navigate("Bugreport")} iconName="bug" label="Report a Problem" />
              <LabelWithIcon onPress={() => props.navigation.navigate("Userreview")} iconName="pencil" label="Write a Review" />
            </View>
          </View>
        </View>
      </DrawerContentScrollView>
      <View
        style={{
          padding: actuatedNormalize(20),
          borderTopWidth: 0.5,
          borderTopColor: colors.gray,
        }}>
        <View style={{ rowGap: actuatedNormalize(20) }}>
          <LabelWithIcon onPress={() => props.navigation.navigate("ComingsoonScreen", { screenName: "Tell a Friend" })} iconName="share-social-outline" label="Tell a Friend" />
          <LabelWithIcon
            onPress={() => setConfirmModal(true)}
            iconName="exit-outline"
            label="Sign Out"
          />
        </View>

      </View>
      <ModalComponent
        children={confirmModalBody}
        modalVisible={ConfirmModal}
        setModalVisible={setConfirmModal}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  shadowBox: {
    backgroundColor: '#444',
    borderRadius: 10,
    padding: 10,
    width: '90%',
    alignSelf: 'center',
    elevation: 5, // Add elevation for shadow
  },
  cardStyle: {
    backgroundColor: colors.black,
    padding: 22,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: '100%',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  textStyle: {
    color: colors.lightGray,
    fontSize: actuatedNormalize(18),
    marginBottom: actuatedNormalize(12),
    fontFamily: fonts.NexaBold,
  },
  iconStyle: {
    marginBottom: actuatedNormalize(12),
  },
  Modalview: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalCardCont: {
    flex: 1,
    width: '100%',
    bottom: actuatedNormalize(-20),
    alignSelf: 'center',
    justifyContent: 'flex-end',
  },
  modalChildContainer: {
    height: SCREEN_HEIGHT / 4,
  },
  loaderContainer: {
    position: 'absolute',
    zIndex: 2,
    flex: 1,
    height: screenHeight,
    width: screenWidth,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.darkOverlayColor2,
  },
});

export default CustomDrawer;
