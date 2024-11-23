

// Form1.tsx
import React, { Dispatch, useRef } from 'react';
import { View, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { actuatedNormalize } from '../../constants/PixelScaling';
import LabelInputComponent from '../inputs/labelInput';
import { Action } from '../../container/Registration/Registration';
import * as Animatable from 'react-native-animatable';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { LabelWithDesc } from '../labels/label1';
import { TextInput } from 'react-native-paper';
import { fonts } from '../../constants/fonts';
import colors from '../../constants/colors';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

interface Form1Props {
    state: {
        bio: string;
    };
    dispatch: Dispatch<Action>;
}
const InputBio: React.FC<Form1Props> = ({ state, dispatch }) => {
    const animatableRef = useRef<Animatable.View>(null);
    return (
        <KeyboardAvoidingView contentContainerStyle={styles.container}>
            <Animatable.View
                ref={animatableRef}
                easing={'ease-in-cubic'}
                animation="slideInLeft"
                duration={500}>
                <View style={[styles.inputForm, { marginTop: actuatedNormalize(15) }]}>
                    <LabelWithDesc label="Write Your bio?" sublabel='it will appear to other user while talking' />
                    {/* <LabelInputComponent
          value={state.name}
          type={'name'}
          name={'name'}
          // errorText={'Name is part of our alogrithm'}
          onChangeText={dispatch}
          IconProvider={AntDesign}
          IconName={'user'}
        /> */}
                    <LabelInputComponent
                        value={state.bio}
                        type={'bio'}
                        name={'bio'}
                        multiline={true}
                        // errorText={'Name is part of our alogrithm'}
                        onChangeText={dispatch}
                        IconProvider={AntDesign}
                        IconName={'edit'}
                    />
                </View>
            </Animatable.View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    inputForm: {
        rowGap: actuatedNormalize(20),
        marginTop: actuatedNormalize(20),
    },
    container: {
        flex: 1,
        position: 'relative'
    },
    textarea: {
        height: actuatedNormalize(200),
        padding: actuatedNormalize(10),
        marginBottom: actuatedNormalize(20),
        marginTop: actuatedNormalize(20),
        paddingHorizontal: actuatedNormalize(15),
        paddingVertical: actuatedNormalize(15),
        fontFamily: fonts.NexaRegular,
        color: colors.white,
        borderRadius: actuatedNormalize(20), // Updated for rounded corners
        backgroundColor: colors.dark, // Updated for the input background color
        textAlignVertical: 'top', // Ensures the text starts at the top
    },
});

export default InputBio;
