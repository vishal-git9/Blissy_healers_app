import React from 'react';
import { TouchableOpacity, View, Image, Text, StyleSheet } from 'react-native';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

const ChatItemSkeleton:React.FC = () => {
  return (
    <SkeletonPlaceholder highlightColor="#444444" backgroundColor="#333333">
      <View style={styles.chatItem}>
        <View style={styles.avatar} />
        <View style={styles.chatDetails}>
          <View style={styles.chatNameSkeleton} />
          <View style={styles.lastMessageContainer}>
            <View style={styles.lastMessageSkeleton} />
            <View style={styles.badgeSkeleton} />
          </View>
        </View>
        <View style={styles.timestampSkeleton} />
      </View>
    </SkeletonPlaceholder>
  );
};

export default ChatItemSkeleton;

const styles = StyleSheet.create({
  chatItem: {
    flexDirection: 'row',
    padding: 15,
    borderRadius: 10,
    borderBottomColor: '#ececec',
    backgroundColor: '#333333', // Assuming a dark background for each chat item
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
    backgroundColor: '#cccccc', // Placeholder color for avatar
  },
  chatDetails: {
    flex: 1,
  },
  chatNameSkeleton: {
    width: '80%',
    height: 18,
    borderRadius: 5,
    backgroundColor: '#cccccc', // Placeholder color for chat name
    marginBottom: 5,
  },
  lastMessageContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  lastMessageSkeleton: {
    width: '70%',
    height: 14,
    borderRadius: 5,
    backgroundColor: '#cccccc', // Placeholder color for last message
    marginRight: 10,
  },
  badgeSkeleton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#cccccc', // Placeholder color for badge
  },
  timestampSkeleton: {
    width: 60,
    height: 12,
    borderRadius: 5,
    backgroundColor: '#cccccc', // Placeholder color for timestamp
  },
});
