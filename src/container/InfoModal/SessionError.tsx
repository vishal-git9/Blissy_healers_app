import React, { useEffect, useState } from "react";
import { ModalComponent } from "../../common/modals/modalcomponent";
import { StyleSheet, View } from "react-native";
import colors from "../../constants/colors";
import { actuatedNormalize } from "../../constants/PixelScaling";
import LottieView from "lottie-react-native";
import { Text } from "react-native";
import { PrimaryButton } from "../../common/button/PrimaryButton";
import { fonts } from "../../constants/fonts";
import { useDispatch, useSelector } from "react-redux";
import { AuthSelector, logoutUser, setSessionStatus } from "../../redux/uiSlice";
import { UserApi, useGetUserQuery, useLazyGetUserQuery } from "../../api/userService";
import { AuthApi, useLogoutUserSessionMutation } from "../../api/authService";
import { ChatApi } from "../../api/chatService";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { navigate } from "../../utils/RootNavigation";
import { RootStackParamList } from "../../AppNavigation/navigatorType";
import { chatListSelector } from "../../redux/messageSlice";
import notifee, {EventType } from '@notifee/react-native';

interface SessionError {
    title: string;
    description: string;
    // onPressPrimaryButton: () => void
}

export const SessionError: React.FC<SessionError> = ({ title, description }) => {
    const {user, fcmToken, isAuthenticated,token, isRegisterd, isNewUser, sessionStatus } = useSelector(AuthSelector)
    const [modalVisible, setModalVisible] = useState(false)
    const [logoutUserSession,{}] = useLogoutUserSessionMutation()
    const navigation = useNavigation<NavigationProp<RootStackParamList>>()
    const [ refetchUser,{data: userData, isLoading: userLoading }]= useLazyGetUserQuery()
    const dispatch = useDispatch()
    console.log(isNewUser, "----user----", sessionStatus,user)
    useEffect(() => {
        if (token) {
            console.log("hi from-----")
            refetchUser().then(res => {
                if (res.isError) {
                    setModalVisible(true)
                    dispatch(setSessionStatus(true))
                    console.log("tokenError2------->")
                    dispatch(logoutUser())
                    //logoutUserSession({}) // logout user session
                    dispatch(AuthApi.util.resetApiState())
                    dispatch(UserApi.util.resetApiState())
                    dispatch(ChatApi.util.resetApiState())
                    notifee.cancelDisplayedNotifications()
                    // navigate("Login")

                    // navigate to token expire screen or modal
                }
            }).catch(err => {
                console.log("tokenError------->")
                dispatch(setSessionStatus(true))
                dispatch(logoutUser())
                setModalVisible(true)

            } )
        }
        console.log(userData, "--userdata--", user)
    }, [token])
    const renderItem = (
        <View style={styles.centeredView}>
            <View style={styles.modalView}>
                <LottieView style={{ width: actuatedNormalize(150), height: actuatedNormalize(150) }} source={require("../../../assets/animation/SessionError.json")} autoPlay loop />
                <View>
                    <Text style={[styles.modalTitle]}>{title}</Text>
                    <Text style={styles.modalDescription}>{description}</Text>
                </View>
                <PrimaryButton styles={{ width: "70%" }} textStyles={{ fontSize: actuatedNormalize(16) }} handleFunc={() => {
                    setModalVisible(false)
                   // navigate("Login")
                   navigation.reset({
                    index: 0,
                    routes: [{ name: 'Login' }],
                    })
                 }
                } label="Login" />
            </View>
        </View>
    )

    return (
        <ModalComponent modalVisible={modalVisible}
            setModalVisible={() => console.log("hi")}
            children={renderItem} />
    )
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        backgroundColor: colors.white,
        borderRadius: actuatedNormalize(10),
        padding: actuatedNormalize(20),
        width: "80%",
        rowGap: actuatedNormalize(10),
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: actuatedNormalize(25),
        marginTop: actuatedNormalize(10),
        fontFamily: fonts.NexaXBold,
        textAlign: 'center',
        color: colors.dark
    },
    modalDescription: {
        fontSize: 16,
        textAlign: 'center',
        fontFamily: fonts.NexaRegular,
        color: colors.gray
    },
});
