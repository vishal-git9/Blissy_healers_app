import { UserState } from '../container/Registration/Registration';
import { UserInterface } from '../redux/uiSlice';
import {API} from './Api';




export const UserApi = API.injectEndpoints({
  // overrideExisting:true,
  endpoints: builder => ({
    getUser: builder.query<any, void>({
      query: () => ({
        url: 'user/get-user',
        method: 'GET',
      }),
    
      keepUnusedDataFor: 0,
    }),
    getHealers: builder.query<any, any>({
      query: () => ({
        url: 'user/our-experts',
        method: 'GET',
      }),
    
      keepUnusedDataFor: 0,
    }),
    postUser: builder.mutation<any, Partial<UserState>>({
      query: (body) => ({
        url: 'user/update-user',
        method: 'PUT',
        body
      }),
    }),
    postUserDevieInfo: builder.mutation<any, any>({
      query: (body) => ({
        url: 'user/user-device-info',
        method: 'PUT',
        body
      }),
    }),
    addFcmToken: builder.mutation<any, any>({
      query: (body) => ({
        url: 'notification/add-fcm-token',
        method: 'POST',
        body
      }),
    }),
    deleteFcmToken: builder.mutation<any, any>({
      query: (body) => ({
        url: 'notification/delete-fcm-token',
        method: 'DELETE',
      }),
    }),
  }),
});

export const {useGetUserQuery,useLazyGetUserQuery,usePostUserMutation,usePostUserDevieInfoMutation,useDeleteFcmTokenMutation,useAddFcmTokenMutation,useLazyGetHealersQuery} = UserApi;
