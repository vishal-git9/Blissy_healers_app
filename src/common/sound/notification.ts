import Sound from 'react-native-sound';

export const playNotificationSound = (): void => {
  // Define a new Sound object
  Sound.setCategory('Playback');

  const notificationSound = new Sound("level_up.mp3", Sound.MAIN_BUNDLE,(error?: Error) => {
    if (error) {
      console.log('Failed to load the sound', error);
      return;
    }else{
      console.log("sound played")
      notificationSound.play()
    }  
  });

  // Play the notification sound
};

export const playSendMsgSound = (): void => {
  // Define a new Sound object
  Sound.setCategory('Playback');

  const MessageSendSound = new Sound("notification.mp3", Sound.MAIN_BUNDLE,(error?: Error) => {
    if (error) {
      console.log('Failed to load the sound', error);
      return;
    }else{
      console.log("send msg sound played")
      MessageSendSound.play()
    }  
  });

  MessageSendSound.release()

  // Play the notification sound
};

