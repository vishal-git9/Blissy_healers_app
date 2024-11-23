/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import notifee, {EventType } from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';

import { name as appName } from './app.json';
import colors from './src/constants/colors';
 var EventEmitter = require('eventemitter3');
 export const eventEmitter = new EventEmitter();

import { handleNotification, MarkCallRejected } from './src/utils/notificationService';
import { persistor, store } from './src/redux';
import { displayCallNotificationAndroid } from './src/common/call/incoming';

let isRehydrated = false;
persistor.subscribe(() => {
  const { bootstrapped } = persistor.getState();
  console.log('Persistor state:', persistor.getState());
  if (bootstrapped) {
    isRehydrated = true;
    console.log('Store rehydrated');
  }
});

console.log("Hi from Index.js-----> ")

const handleNewMessage = (message) => {
  console.log("Hi Iam here insiderehydrateStoreAndHandleMessage3-----> ")

  if (!isRehydrated) {
    console.log('State not yet rehydrated. Skipping message handling.');
    return;
  }

  const currentState = store.getState();
  console.log('Current state:', currentState);
   handleNotification(message);

  // Process the message and update the state if needed
  // store.dispatch(setValue(message.data.value));
};

// Ensure the store is rehydrated before handling messages
const rehydrateStoreAndHandleMessage = async (message) => {

  console.log("Hi Iam here insiderehydrateStoreAndHandleMessage----->",isRehydrated)
  await new Promise((resolve) => {
    const interval = setInterval(() => {
      console.log('Checking rehydration status:', isRehydrated);
      if (isRehydrated) {
        clearInterval(interval);
        resolve();
      }
    }, 1000);
  });
  console.log("Hi Iam here insiderehydrateStoreAndHandleMessage2-----> ")

  handleNewMessage(message);
};
messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('FCM Message received:', remoteMessage);
    
    const RemoteMessage = {
      data:{
        senderData:remoteMessage?.data?.senderData,
        messageDetails:remoteMessage.data?.messageDetails
      }
    }
    const senderData  = JSON.parse(RemoteMessage?.data?.senderData);
    const messageDetails = JSON.parse(RemoteMessage?.data?.messageDetails);
    // await handleNotification(remoteMessage);
    // const callId = 'call-12345';
    // const callerName = 'John Doe';
    // const hasVideo = false;

    // notifee.cancelNotification(id) //cancel the notification
    if(messageDetails?.NotificationType === "call"){

      console.log("IAMRUNIING------>",senderData)
    displayCallNotificationAndroid({ callId:senderData?.id, callerName:senderData?.callerName,senderData:senderData });
    }else if(messageDetails?.NotificationType === "missedcall"){

      await notifee.cancelNotification(messageDetails?.lastCallId)
      console.log("IAMRUNIING2------>",messageDetails?.profilePic,messageDetails)


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
              url: remoteMessage?.data?.profilePictureUrl, 
              thumbnailHidden: false,
              
            },
          ],
        },
      });
    }
    else{

      await notifee.displayNotification({
        title: senderData?.name,
        body: messageDetails?.messageText,
        data:{senderData : senderData},
        android: {
          channelId: "blissy1",
          smallIcon: 'ic_stat_name',
          largeIcon: senderData?.profilePic,
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
              url: remoteMessage?.data?.profilePictureUrl, 
              thumbnailHidden: false,
              
            },
          ],
        },
      });
    }



    // notifee.getInitialNotification().then(notification => {
    //     if (notification) {
    //         console.log('Notification caused app to open from quit state:', notification);
    //         handleNotification(notification);
    //     }
    // });
    await rehydrateStoreAndHandleMessage(remoteMessage)

});
notifee.onForegroundEvent(
    async ({ type, detail, }) => {
      console.log(
        `The type is`,
        type,
        "the detail is----->",
        detail
      );
      switch (type) {
        case EventType.PRESS:
          console.log("event type press tho")
          if (detail?.notification && detail?.notification.android.channelId === "blissy1") {
            eventEmitter.emit('notificationReceived',detail?.notification?.data);
          }else if(detail?.notification && detail?.notification.android.channelId === "nuggets-call2"){
            eventEmitter.emit('callAccepted',detail.notification.data);
          }
          break;
        case EventType.ACTION_PRESS:
          if(detail.pressAction.id === "decline-call"){
            MarkCallRejected(detail?.notification?.data?.senderData?.id)
            await notifee.cancelNotification(detail.notification.id);
          }
          if(detail.pressAction.id === "answer-call"){
            eventEmitter.emit('callAccepted',detail.notification?.data);
          }
          console.log(`It was an ACTION PRESS THO`)
          break;
      }
    }
  );

notifee.onBackgroundEvent(async ({ type, detail }) => {
  console.log(type, "BackgroundType1--->",EventType.PRESS,detail,EventType.ACTION_PRESS)

    const { notification, pressAction } = detail;

    console.log(notification,pressAction,"notifications")
    if (type === EventType.PRESS) {
        console.log(type, "BackgroundTyoe--->",EventType.PRESS)
        if (notification && notification.android.channelId === "blissy1") {
          eventEmitter.emit('notificationReceived',notification?.data);
        }else if(notification && notification.android.channelId === "nuggets-call2"){
          eventEmitter.emit('callAccepted',notification.data);
        }    
        // await notifee.cancelNotification(notification?.id);
      }else if(type === EventType.ACTION_PRESS){
        if(pressAction.id === "decline-call"){
          MarkCallRejected(detail?.notification?.data?.senderData?.id)
          console.log(detail.notification.id,"declinedcallpress action------>")
          await notifee.cancelNotification(detail.notification.id);
          // make an call reject api and cancel the notification
        }
        if(pressAction.id === "answer-call"){
          console.log("Call accepted-------->")
          eventEmitter.emit('callAccepted',notification?.data);
        }
      }

    
});

AppRegistry.registerComponent(appName, () => App);
