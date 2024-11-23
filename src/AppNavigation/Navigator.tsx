import React, { PropsWithChildren, useEffect, useState } from 'react'
import MainNavigator from './MainNavigator'
import { useDispatch, useSelector } from 'react-redux'
import { AuthSelector, logoutUser, setSessionStatus } from '../redux/uiSlice'
import { UserApi, useGetUserQuery } from '../api/userService'
import { NavigationStackProps } from '../container/Prelogin/onboarding'
import { AuthApi } from '../api/authService'
import { ChatApi } from '../api/chatService'
import { navigate } from '../utils/RootNavigation'
import { SessionError } from '../container/InfoModal/SessionError'

export const Navigator:React.FC = () => {
    // handle is registered logic if user left the registration form after loggin in
   
    const {isNewUser,isAuthenticated} = useSelector(AuthSelector)

    console.log(isNewUser,"isnewuser",isAuthenticated,"isauthenticated")

  return <MainNavigator isLoggedIn={isAuthenticated} isNewUser={isNewUser}/>
   
  
}
