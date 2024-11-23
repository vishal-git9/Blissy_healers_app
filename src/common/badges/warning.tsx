import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Banner, Button, Text } from 'react-native-paper';

const ConnectionWarningBanner: React.FC<{visible:boolean,setVisible:(a:boolean)=>void}> = ({visible,setVisible}) => {

  return (
    <Banner
      visible={visible}
      actions={[
        {
          label: 'Got it',
          onPress: () => setVisible(false),
        },
      ]}
      style={{backgroundColor:"red"}}
      icon="wifi-off"
    >
      <Text style={styles.text}>
        Please make sure your internet connection is stable for the best call experience.
      </Text>
    </Banner>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    color: 'white',
  },
});

export default ConnectionWarningBanner;
