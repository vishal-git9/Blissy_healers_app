import { UserState } from '../container/Registration/Registration';
import { Message } from '../redux/messageSlice';
import { UserInterface } from '../redux/uiSlice';
import {API} from './Api';




export const ChatApi = API.injectEndpoints({
  endpoints: builder => ({
    getChatlist: builder.query<any, any>({
      query: () => ({
        url: `chat/get-chat-list/`,
        method: 'GET',
      }),
      // serializeQueryArgs: ({ endpointName }) => {
      //   return endpointName
      //  },
      //  // Always merge incoming data to the cache entry
      //  merge: (currentCache, newItems) => {
      //    currentCache.push(...newItems)
      //  },
      keepUnusedDataFor: 0,
      // forceRefetch({ currentArg, previousArg }) {
      //   return currentArg !== previousArg
      // },
    }),
    getChatwindowList:builder.query<any,any>({
      query: (query) => ({
        url: `chat/get-chat/${query.userId}/${query.receiverId}`,
        method: 'GET',
      }),
      keepUnusedDataFor: 0,
    }),
    addNewUserToList:builder.mutation<any, Partial<Message>>({
      query: (body) => ({
        url: 'chat/add-chatlist',
        method: 'PUT',
        body
      }),
    }),
    sendMessage: builder.mutation<any, Partial<Message>>({
      query: (body) => ({
        url: 'chat/post-message',
        method: 'PUT',
        body
      }),
    }),
    markReadMessage: builder.mutation<any, any>({
      query: (body) => ({
        url: 'chat/markRead',
        method: 'PUT',
        body
      }),
    }),

    getNewMessage: builder.query<any, any>({
        query: (query) => ({
          url: `chat/get-new-chat/${query.userId}`,
          method: 'GET',
        }),
        keepUnusedDataFor: 0,
      }),
      blockUser: builder.mutation<any, any>({
        query: (blockerId) => ({
          url: `chat/blockuser`,
          method: 'POST',
          body:{blockerId}
        }),
      }),
     unblockUser: builder.mutation<any, any>({
        query: (blockerId) => ({
          url: `chat/unblockUser`,
          method: 'POST',
          body:{blockerId}
        }),
      }),
      deleteUser: builder.mutation<any, any>({
        query: (deleteUserId) => ({
          url: `chat/delete-chatuser`,
          method: 'DELETE',
          body:{deleteUserId}
        }),
      }),
      deleteChatHistory: builder.mutation<any, any>({
        query: (chatId) => ({
          url: `chat/delete-chathistory`,
          method: 'DELETE',
          body:{chatId}
        }),
      }),
  })
  
});

export const {useGetChatlistQuery,useLazyGetChatlistQuery,useSendMessageMutation,useGetNewMessageQuery,useAddNewUserToListMutation,useGetChatwindowListQuery,useMarkReadMessageMutation,useDeleteChatHistoryMutation,useBlockUserMutation,useDeleteUserMutation,useUnblockUserMutation} = ChatApi;
