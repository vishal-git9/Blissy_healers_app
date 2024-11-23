import { Socket } from "socket.io-client";
import { ProfileData } from "../mockdata/healerData";
import { UserInterface } from "../redux/uiSlice";
import { Dispatch, SetStateAction } from "react";
import { ChatList, Message } from "../redux/messageSlice";
import { IncomingCallInterface } from "../common/interface/interface";

export type RootStackParamList = {
  Onboarding: undefined;
  Home: undefined;
  Login: undefined;
  Registration: { UserData: UserInterface | null };
  Healerdetails: { item: ProfileData };
  Healerlist: undefined;
  Drawer: undefined;
  Connection: undefined;
  ChatWindow: { userDetails: UserInterface | null, socketId: string | undefined, Chats: ChatList | null,senderUserId:string | null };
  Chatlist: undefined;
  Calllist: undefined;
  Wallet: undefined;
  CouponsScreen: undefined;
  ReviewScreen: { user: UserInterface | null, socketId: string | null };
  AudioCallScreen: { user: UserInterface | null };
  ComingsoonScreen: { screenName: string }
  ChatPartnerDetails:{chatPartner:UserInterface | null}
  IncomingCall:{ConnectedUserData:IncomingCallInterface | undefined}
  Bugreport:{}
  Userreview:{}
  Outgoing:{ConnectedUserData:UserInterface | undefined,socketId:string | undefined}
  appUpdate:undefined;
  privateCall:{user:UserInterface | null ,IncomingCallData:IncomingCallInterface | undefined,OutgoingCallData:UserInterface | null,callstate:string}
};
