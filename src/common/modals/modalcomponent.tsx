import React, { Dispatch, ReactNode, SetStateAction } from "react";
import { View, ViewStyle } from "react-native";
import Modal from "react-native-modal";

interface ModalComponent {
    children:ReactNode;
    modalVisible:boolean;
    styles?:ViewStyle;
    setModalVisible:Dispatch<SetStateAction<boolean>>
}

export const ModalComponent:React.FC<ModalComponent> = ({ children, modalVisible, styles,setModalVisible }) => {
  return (
    <>
      <Modal
        style={{
          width: "100%",
          alignSelf: "center",
        }}
        // onBackdropPress={()=>setModalVisible(false)}
        backdropTransitionOutTiming={100}
        animationInTiming={500}
        useNativeDriver={true}
        animationOutTiming={1000}
        animationIn={"slideInUp"}
        animationOut={"slideOutDown"}
        isVisible={modalVisible}
        
      >
        {children}
      </Modal>
    </>
  );
};
