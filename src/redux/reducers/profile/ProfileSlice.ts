import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { RootState } from "../..";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiEndPoint } from "../../../config";

interface sendProfileData {

}
interface ErrorResponse {
    msg: string;
  }
export const CreateProfile = createAsyncThunk(
  "user/create",
  async (_insertData: any, thunkAPI) => {
    try {
      const  Token = await AsyncStorage.getItem("loggedUser");
      const response = await axios.put(
        `${ApiEndPoint}/user/${_insertData.id}`,
        _insertData,
        {
          headers: {
            Authorization: Token,
          },
        }
      );
      return response.data;
    } catch (e) {
        if (axios.isAxiosError(e) && e.response) {
            return thunkAPI.rejectWithValue(e.response.data as ErrorResponse);
          } else {
            return thunkAPI.rejectWithValue({ msg: 'An error occurred' } as ErrorResponse);
          }     
        }
  }
);

interface ProfileState {
  isCreatingProfile: boolean;
  isCreateProfileSuccess: boolean;
  isCreateProfileError: boolean;
  isCreateProfileErrorMessage: string;
  sendProfileData: sendProfileData[]; // Adjust the type based on your actual data structure
}

export const ProfileSlice = createSlice({
  name: "profile",
  initialState: <ProfileState>{
    isCreatingProfile: false,
    isCreateProfileSuccess: false,
    isCreateProfileError: false,
    isCreateProfileErrorMessage: "",
    sendProfileData: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(CreateProfile.pending, (state) => {
        state.isCreatingProfile = true;
      })
      .addCase(CreateProfile.fulfilled, (state, action) => {
        state.isCreateProfileSuccess = true;
        state.isCreatingProfile = false;
        state.sendProfileData = action.payload.saveProfileCheckObj || action.payload.newData;
      })
      .addCase(CreateProfile.rejected, (state, action) => {
        state.isCreateProfileError = true;
        state.isCreateProfileErrorMessage = action.payload?.error || "An error occurred";
      });
  },
});

export const {} = ProfileSlice.actions;

export const profileSelector = (state: RootState) => state.profile;
