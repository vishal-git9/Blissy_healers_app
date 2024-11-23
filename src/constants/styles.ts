import React from 'react';
import { StyleSheet } from "react-native";
import colors from '../constants/colors';
const Styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    rowView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    separator: {
        height: 0.3,
        width: '100%',
        backgroundColor: colors.gray,
        opacity: 0.8,
    },
    boldText: {
        fontWeight: 'bold',
    },
    contentContainerStyle: {
        paddingBottom: 200,
    },
    contentContainerStyle2: {
        paddingBottom: 100,
    },
    neuoMorphism:{
        shadowColor: "#000",
        alignSelf: "center",
        shadowOffset: {
          width: 2,
          height: 2,
        },
        shadowOpacity: 0.1,
        borderColor: colors.lightGray,
    },
    topshadow:{
        shadowOffset:{
            width:-6,
            height:-6,
        },
        shadowOpacity:1,
        shadowRadius:6,
        shadowColor:colors.primary
    },
    bottomshadow:{
        shadowOffset:{
            width:6,
            height:6,
        },
        shadowOpacity:2,
        shadowRadius:10,
        shadowColor:colors.primary
    },
    inner:{
        backgroundColor:"#DEE9F7",
        alignItems:"center",
        justifyContent:"center",
        borderColor:"#E2ECFD",
        borderWidth:1
    }
})

export default Styles;