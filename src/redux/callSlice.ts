// messageSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IRootState } from '.';
import { UserInterface } from './uiSlice';
import { CallApi } from '../api/callService';

export interface Calls extends Document {
    _id: string;
    callType: string;
    callerId: string;
    calleeId: string;
    callDuration: number;
    isSuccessful: Boolean;
    isMissed: Boolean;
    isRejected: Boolean;
    createdAt: string;
    UserCallerInfoList: UserInterface[];
    UserCalleeInfoList:UserInterface[] ;
}


export interface PrivateCallerData extends Document {

    matchedUser: UserInterface | null,
    callerId: string | null
}
interface CallState {
    Calls: Calls[],
    totalCalls: Calls[],
    missedCalls: Calls[],
    declinedCalls: Calls[],
    rejectedCalls: Calls[],
    privateCallerData: PrivateCallerData
}
const initialState: CallState = {
    Calls: [],
    totalCalls: [],
    missedCalls: [],
    declinedCalls: [],
    rejectedCalls: [],
    privateCallerData: {
        callerId: null,
        matchedUser: null
    }
};

const CallSlice = createSlice({
    name: 'message',
    initialState,
    reducers: {

        pushCalllist: (state, action: PayloadAction<Calls[]>) => {
            state.Calls = action.payload
            state.missedCalls = action.payload.filter((el: Calls) => el.isMissed)
        },

        pushPrivateCalldata: (state, action: PayloadAction<PrivateCallerData>) => {
            state.privateCallerData = action.payload
        },
        resetCallState: () => initialState

    },
    extraReducers: (builder) => {
        builder.addMatcher(CallApi.endpoints.getmyCallInfo.matchFulfilled, (state, { payload }) => {
            state.Calls = payload
            state.missedCalls = payload.filter((el: Calls) => el.isMissed)
        })
        // builder.addMatcher(ChatApi.endpoints.getChatlist.matchFulfilled, (state, { payload }) => {
        //     console.log(payload, "chatlistpayload------>")
        // })
        // builder.addMatcher(ChatApi.endpoints.sendMessage.matchFulfilled, (state, { payload }) => {

        // })
    }
});

export const { pushCalllist, resetCallState, pushPrivateCalldata } = CallSlice.actions;
export const CallInfoSelector = (state: IRootState) => state.Calls
// export const MissedCallInfoSelector = (state: IRootState) => state.Calls.missedCalls

export default CallSlice;
