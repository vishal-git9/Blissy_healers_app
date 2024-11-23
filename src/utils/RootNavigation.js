// RootNavigation.js

import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

export function navigate(name, params) {
  console.log("Navigating----->",navigationRef.isReady(),navigationRef.current.getRootState())
  if (navigationRef.isReady()) {
    console.log("NavigatingYaar----->")

    navigationRef.navigate(name);
  }else {
    const unsubscribe = navigationRef.addListener('state', () => {
      console.log("Listener----->",navigationRef.isReady())
      if (navigationRef.isReady()) {
        unsubscribe();  // Remove the listener after navigation is performed
        // navigationRef.navigate("Chatlist");
      }
    });
  }
}

// add other navigation functions that you need and export them