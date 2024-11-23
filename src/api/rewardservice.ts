import {API} from './Api';




export const RewaredApi = API.injectEndpoints({
  endpoints: builder => ({
    postUserRating: builder.mutation<any, any>({
      query: (body) => ({
        url: `/ratings/setrating`,
        method: 'PUT',
        body
      }),
    }),
    claimUsercoins: builder.mutation<any, any>({
      query: (userId) => ({
        url: `/user-app-coins/claim`,
        method: 'POST',
        body:{
          id:userId
        }
      }),
    }),
    getallUserCoins: builder.query<any, any>({
      query: () => ({
        url: `/user-app-coins/getAlluserCoins`,
        method: 'GET',
      }),
      keepUnusedDataFor: 0,
    }),
    getallUserTotalCoins: builder.query<any, any>({
      query: () => ({
        url: `/user-app-coins/userCoins`,
        method: 'GET',
      }),
      keepUnusedDataFor: 0,
    }),
  })
});

export const {useClaimUsercoinsMutation,useGetallUserCoinsQuery,usePostUserRatingMutation,
useGetallUserTotalCoinsQuery} = RewaredApi;
