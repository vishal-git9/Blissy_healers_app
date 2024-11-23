import {API} from './Api';




export const CallApi = API.injectEndpoints({
  endpoints: builder => ({
    postCallInfo: builder.mutation<any, any>({
      query: (body) => ({
        url: `/call-record/create-random-call`,
        method: 'POST',
        body
      }),
    }),
    updateCallInfo: builder.mutation<any, any>({
      query: (body) => ({
        url: `/create-random-call/update`,
        method: 'PUT',
        body
      }),
    }),
    getmyCallInfo: builder.query<any, any>({
      query: () => ({
        url: `/call-record/getMyCalls`,
        method: 'GET',
      }),
      keepUnusedDataFor: 0,
    }),
    deleteSingleCallInfo:builder.mutation<any,any>({
      query:(id)=>({
        url:`/call-record/delete`,
        method: 'DELETE',
        body:{id},
        // responseHandler:"text"
      })
    }),
    createPrivateCall:builder.mutation<any,any>({
      query:(callBody)=>({
        url:`/call-record/create-private-call`,
        method: 'POST',
        body:callBody,
        // responseHandler:"text"
      })
    }),

    // cancel private call
    cancelPrivateCall:builder.mutation<any,any>({
      query:(callBody)=>({
        url:`/call-record/cancel-private-call`,
        method: 'POST',
        body:callBody,
        // responseHandler:"text"
      })
    }),

    awakePrivateCall:builder.mutation<any,any>({
      query:(callBody)=>({
        url:`/call-record/awake-private-call`,
        method: 'PUT',
        body:callBody,
        // responseHandler:"text"
      })
    }),

    answerPrivateCall:builder.mutation<any,any>({
      query:(callBody)=>({
        url:`/call-record/pick-incoming-call`,
        method: 'POST',
        body:callBody,
        // responseHandler:"text"
      })
    }),

    declinePrivateCall:builder.mutation<any,any>({
      query:(callBody)=>({
        url:`/call-record/declined-incoming-call`,
        method: 'PUT',
        body:callBody,
        // responseHandler:"text"
      })
    }),
    updatePrivateCallInfo: builder.mutation<any, any>({
      query: (body) => ({
        url: `/call-record/create-private-call/update`,
        method: 'PUT',
        body
      }),
    }),
  })
});

export const {useUpdateCallInfoMutation,useGetmyCallInfoQuery,useLazyGetmyCallInfoQuery,usePostCallInfoMutation,useDeleteSingleCallInfoMutation,useCreatePrivateCallMutation,useAwakePrivateCallMutation,useCancelPrivateCallMutation,useAnswerPrivateCallMutation,useDeclinePrivateCallMutation,useUpdatePrivateCallInfoMutation} = CallApi;
