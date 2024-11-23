import messaging from '@react-native-firebase/messaging';
import axios from 'axios';
import notifee from '@notifee/react-native';
import colors from '../constants/colors';
import { serverBaseUrl, serverLocalUrl } from './globalVariable';
import { AuthSelector, UserInterface } from '../redux/uiSlice';
import { AppState } from 'react-native';
import { store } from '../redux';
import { displayCallNotificationAndroid } from '../common/call/incoming';


// data: {
//   senderData: JSON.stringify(getNotificationSenderData[0]),
//   messageDetails:JSON.stringify({messageId,messageText})
// },

export const MarkMessageDelivered = async (messageId: string) => {
  const {token} = AuthSelector(store.getState()); //active in foreground
  console.log(messageId,"messageId----->",AppState.currentState,token) // not receiving token in killed state of the app

    try {
      const response = await axios.put(`${serverBaseUrl}chat/markRead`,{messageIds:[messageId],updateType:"isDelivered"}, {
        headers: {
          Authorization: `Bearer ${token}`
        }});
      console.log(response.data,"delivery reponse------>")
      return response.data;
    } catch (error) {
      console.error('Error Marking Message Delivered:', error);
      throw error;
    }
};

export const MarkCallDelivered = async (callId: string,senderId:string) => {
  const {token} = AuthSelector(store.getState()); //active in foreground
  console.log(callId,"callId----->",AppState.currentState,token) // not receiving token in killed state of the app

    try {
      const response = await axios.put(`${serverBaseUrl}call-record/awake-private-call`,{callId,senderId}, {
        headers: {
          Authorization: `Bearer ${token}`
        }});
      console.log(response.data,"call delivery reponse------>")
      return response.data;
    } catch (error) {
      console.error('Error Marking call Delivered:', error);
      throw error;
    }
};



export const MarkCallRejected = async (callerId: string) => {
  const {token} = AuthSelector(store.getState()); //active in foreground
  console.log(callerId,"callId----->",AppState.currentState,token) // not receiving token in killed state of the app

    try {
      const response = await axios.put(`${serverBaseUrl}call-record/declined-incoming-call`,{callerId}, {
        headers: {
          Authorization: `Bearer ${token}`
        }});
      console.log(response.data,"call delivery reponse------>")
      return response.data;
    } catch (error) {
      console.error('Error Marking call Delivered:', error);
      throw error;
    }
};

export const handleNotification = async (remoteMessage: any) => {
  console.log(remoteMessage,"BackgroundremoteMessage------>")
  const senderData = JSON.parse(remoteMessage.data?.senderData);
  const messageDetails = JSON.parse(remoteMessage.data?.messageDetails);

  if(messageDetails?.NotificationType === "call"){
    MarkCallDelivered(messageDetails?.callId,senderData?.id)
  }else if(messageDetails?.NotificationType === "chat"){
    MarkMessageDelivered(messageDetails?.messageId)
  }

  // const chatList = store.getState().Message.chatList
  // console.log(chatList,"Chatlist----->",AppState.currentState)
      // navigationRef?.current?.navigate('Chatlist');

  if (!messageDetails) {
    console.warn('No messageDetails in the notification payload');
    return;
  }

  // if (AppState.currentState === 'active' || AppState.currentState === 'background') {
  //   console.log('ForegroundBackgroundClick------->');
  //   // Do not fetch data; rely on Socket.io updates
  //   if (senderData && navigationRef.current) {
  //     navigationRef.current.navigate('Chatlist', { senderData });
  //   }
  // } else if (AppState.currentState === 'inactive') {
  //   console.log('App is in quit state, fetching updated data');
  //   try {
  //     // const updatedData = await fetchUpdatedData(dataKey);
  //     // console.log('Fetched updated data:', updatedData);
  //     // Handle the fetched data, e.g., update the state or local storage
  //     // store.dispatch(pushChatlist(updatedData))
  //     if (senderData && navigationRef.current) {
  //       navigationRef.current.navigate('Chatlist', { senderData });
  //     }
  //   } catch (error) {
  //     console.error('Error fetching data in quit state:', error);
  //   }
  // }

  // console.log(remoteMessage)
};

interface RemoteMessageI {
  data: {
    senderData: any;
    messageDetails?: any;
  };
}



const setupNotificationListener = () => {
  messaging().onMessage(async remoteMessage => {
    console.log('FCM Message received:', remoteMessage);
    const RemoteMessage:RemoteMessageI = {
      data:{
        senderData:remoteMessage?.data?.senderData,
        messageDetails:remoteMessage.data?.messageDetails
      }
    }
    const senderData : any = JSON.parse(RemoteMessage?.data?.senderData);
    const messageDetails = JSON.parse(RemoteMessage?.data?.messageDetails);
    await handleNotification(remoteMessage);
    if(messageDetails?.NotificationType === "call"){

      console.log("IAMRUNIING------>",senderData)
    displayCallNotificationAndroid({hasVideo:false, callId:senderData?.id, callerName:senderData?.callerName,senderData:senderData });
    }else if(messageDetails?.NotificationType === "missedcall"){

      await notifee.cancelNotification(messageDetails?.lastCallId)
      console.log("IAMRUNIING------>",messageDetails?.profilePic,messageDetails)


      await notifee.displayNotification({
        title: senderData?.callerName,
        // id:messageDetails?.lastCallId,
        body: `📞 missed audio call from ${senderData?.callerName}`,
        data:{senderData : senderData},
        android: {
          channelId: "blissy1",
          smallIcon: 'ic_stat_name',
          largeIcon: messageDetails?.profilePic,
          color:colors.primary,
          circularLargeIcon:true,
          // alarmManager: {
          //   allowWhileIdle: true,
          // },
          pressAction: {
            id: 'default',
          },
        },
        ios: {
          categoryId: 'blissy1',
          
          attachments: [
            {
              url: remoteMessage?.data?.profilePictureUrl as string, 
              thumbnailHidden: false,
              
            },
          ],
        },
      });
    }else{

      await notifee.displayNotification({
        title: senderData?.name,
        body: messageDetails?.messageText,
        data:{senderData : senderData},
        android: {
          channelId: "blissy1",
          smallIcon: 'ic_stat_name', // ensure this icon is in your drawable folder
          largeIcon: senderData?.profilePic, // URL of the sender's profile picture
          color:colors.primary,
          circularLargeIcon:true,
          
          pressAction: {
            id: 'default',
          },
        },
        ios: {
          categoryId: 'blissy1',
          attachments: [
            {
              url: senderData?.profilePic as string, // URL of the sender's profile picture
              thumbnailHidden: false,
              
            },
          ],
        },
      });
    }
  
  });
  
};

export default setupNotificationListener;

