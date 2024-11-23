import moment from "moment";
import { ChatList } from "../redux/messageSlice";

const getLatestMessageTimestamp = (item: ChatList) => {
    if (item?.allMessages?.length === 0) return null;
    return item.allMessages.reduce((latest, message) => {
      return moment(latest.createdAt).isAfter(moment(message.createdAt)) ? latest : message;
    }).createdAt;
  };

  

  export const findNewMessage = (chatlistdata:ChatList[])=>{
    const dataWithTimestamps = chatlistdata?.map(item => ({
        ...item,
        latestMessageTimestamp: getLatestMessageTimestamp(item)
      }));
    
  const sortedData = dataWithTimestamps.sort((a, b) => {
    if (a.latestMessageTimestamp === null) return 1;
    if (b.latestMessageTimestamp === null) return -1;
    return moment(b.latestMessageTimestamp).diff(moment(a.latestMessageTimestamp));
  });

  return sortedData
  }