import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IRootState } from ".";

export interface Coupon{
    _id: string;
    coinName:string;
    coins:number;
    createdAt:string;
    userId:string;
}

export interface TotalCoins{
    userId:string;
    coins:number
}

interface rewardState{
    coupons:Coupon[];
    prevCoins:number;
    totalCoins:number;
}

const initialState:rewardState = {
    coupons:[],
    prevCoins:0,
    totalCoins:0
}

const RewardSlice = createSlice({
    name:'rewards',
    initialState,
    reducers:{
        setAllCoupons: (state, action: PayloadAction<Coupon[]>) => {
            state.coupons = action.payload;
        },
        setTotalCoins:(state, action:PayloadAction<number>)=>{
            state.totalCoins = action.payload;
        },
        setPrevCoins:(state, action:PayloadAction<number>)=>{
            state.prevCoins = action.payload;
        },
        resetrewardsState : ()=>initialState
    }
})

export const {setAllCoupons,setTotalCoins,setPrevCoins,resetrewardsState} = RewardSlice.actions;

export const CouponsSelector = (state: IRootState)=> state.Rewards

export default RewardSlice;