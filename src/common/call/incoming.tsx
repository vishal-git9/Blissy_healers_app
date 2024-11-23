// src/notifications.ts
import notifee, { AndroidImportance, AndroidCategory, AndroidVisibility } from '@notifee/react-native';

interface DisplayCallNotificationAndroidProps {
  callId: string;
  callerName: string;
  hasVideo: boolean;
  senderData:{name:string,profilePic:string}
}

export const displayCallNotificationAndroid = async ({
  callId,
  callerName,
  senderData
}: DisplayCallNotificationAndroidProps): Promise<void> => {
  console.log('📞 📥  displayCallNotificationAndroid: ', callId);

  // const channelId = await notifee.createChannel({
  //   id: 'nugget-calls',
  //   name: 'nugget-calls',
  //   importance: AndroidImportance.HIGH,
  // });

  const dnr = await notifee.displayNotification({
    title: callerName,
    body: `${callerName} is calling you`,
    id: callId,
    data:{senderData : senderData},
    android: {
      channelId:"nuggets-call2",
      smallIcon: 'ic_stat_name',
      color: '#dedede',
      loopSound:true,
      ongoing:true,
      timeoutAfter:60000,
      largeIcon:senderData?.profilePic,
      category: AndroidCategory.CALL,
      visibility: AndroidVisibility.PUBLIC,
      importance: AndroidImportance.HIGH,
      lightUpScreen: true,
      colorized: true,

      pressAction: {
        id: "default",
        // launchActivity: 'com.blissy.CustomActivity',
        // mainComponent:"custom"
        launchActivity: 'default',
    },
      fullScreenAction: {
        id: 'default',
        // launchActivity: 'com.blissy.CustomActivity',
        // mainComponent:"custom"
        launchActivity: 'default',

    },
      actions: [
        {
          title: 'Decline',
          pressAction: {
            id: 'decline-call',
          },
        },
        {
          title: 'Answer',
          pressAction: {
            id: 'answer-call',
            launchActivity: 'default',
          },
        },
      ],
    },
  });
  console.log('🔭 displayNotification result: ', dnr);
};
