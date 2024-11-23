import React from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons"; // Assuming you're using Expo. Adjust import if using react-native-vector-icons directly.

interface IncomingCallScreenProps {
  otherUserId: string; // Assuming otherUserId is a string. Adjust if it's a different type.
  processAccept: () => void;
  setType: (type: string) => void;
}

const IncomingCallScreen: React.FC<IncomingCallScreenProps> = ({ otherUserId, processAccept, setType }) => {
  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.callingText}>
          {otherUserId} is calling..
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => {
            processAccept();
            setType('WEBRTC_ROOM');
          }}
          style={styles.acceptButton}>
          <Ionicons name="call" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    backgroundColor: '#050A0E',
  },
  innerContainer: {
    padding: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
  },
  callingText: {
    fontSize: 36,
    marginTop: 12,
    color: '#ffff',
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: 'green',
    borderRadius: 30,
    height: 60,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default IncomingCallScreen;
