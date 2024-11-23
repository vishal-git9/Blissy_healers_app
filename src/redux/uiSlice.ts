import { createSlice } from "@reduxjs/toolkit";
import { AuthApi } from "../api/authService";
import { IRootState } from ".";
import { UserApi } from "../api/userService";
import { Socket } from "socket.io-client";
import { FeebackApi } from "../api/feedbackservice";

export interface Calllist extends Document {
    callType:String;
    callerId: String;
    calleeId:String;
    callDuration:String;
    isSuccessful: Boolean;
    isMissed:Boolean;
    isRejected:Boolean
  }
  export interface IQoutes extends Document {
    // mobileNumber: string;
    text:string;
    author:string
  }
  export interface IRating extends Document {
    userId: string;
    appId: string;
    rating: number;
    createdAt: Date;
}
export interface UserInterface {
    _id: string;
    mobileNumber: string;
    role: string;
    name: string;
    isNewUser: Boolean;
    username: string;
    age: number;
    gender: string;
    bio:string;
    interest: [string];
    mentalIssues:[string];
    language: [string];
    profilePic: string;
    isActive: Boolean;
    UserCallsInfoList:Calllist[];
    UserRating:IRating[]

}
export interface IsUIState {
    token: string;
    user: null | UserInterface;
    isAuthenticated: boolean
    isRegisterd: boolean;
    sessionStatus: boolean;
    isNewUser: boolean;
    socket: Socket | null
    fcmToken: string;
    isConnected: boolean;
    todayquotes:IQoutes;
    isNewlyInstalled:boolean;
}

const initialState: IsUIState = {
    token: '',
    user: null,
    isAuthenticated: false,
    sessionStatus: false,
    isRegisterd: false,
    isNewUser: true,
    socket: null,
    fcmToken: '',
    isConnected: true,
    isNewlyInstalled:true,
    todayquotes:{text:'',author:''}
}


export const AuthSlice = createSlice({
    name: "Auth",
    initialState,
    reducers: {
        setUsertoken: (state, action) => {
            state.token = action.payload
        },
        setUserState: (state, action) => {
            state.isNewUser = action.payload
        },
        setNewlyInstalled: (state, action) => {
            state.isNewlyInstalled = action.payload
        },
        setSocket: (state, action) => {
            state.socket = action.payload
        },
        setFcmToken: (state, action) => {
            state.fcmToken = action.payload
        },
        setConnectionStatus: (state, action) => {
            state.isConnected = action.payload;
        },
        setSessionStatus: (state, action) => {
            state.sessionStatus = action.payload;
        },
        logoutUser: () => initialState
    },
    extraReducers: (builder) => {
        builder.addMatcher(AuthApi.endpoints.verifyOtp.matchFulfilled, (state, { payload }) => {
            console.log("Callingverifyapi------->")
            const { token } = payload.data
            state.token = token
            state.isAuthenticated = true
        })
        builder.addMatcher(UserApi.endpoints.getUser.matchFulfilled, (state, { payload }) => {

            console.log(payload, "payload---->")
            state.user = payload?.data?.user
            state.fcmToken = payload?.data?.user?.DeviceFcmtoken?.fcmToken
            // state.isNewUser =payload.data.user.isNewUser
        })
        builder.addMatcher(FeebackApi.endpoints.getmyTodayquotes.matchFulfilled,(state,{payload})=>{
            console.log(payload,"payload of quotes--->")
            state.todayquotes = payload.quote
        })
        builder.addMatcher(UserApi.endpoints.postUser.matchFulfilled, (state, { payload }) => {
            state.isRegisterd = true
            state.isNewUser = false
        })
    }
})

export const { setUsertoken, logoutUser, setUserState, setSocket, setFcmToken, setConnectionStatus, setSessionStatus,setNewlyInstalled } = AuthSlice.actions
export const AuthSelector = (state: IRootState) => state.Auth
export default AuthSlice.reducer