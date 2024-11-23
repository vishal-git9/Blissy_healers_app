import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { UserInterface } from '../../redux/uiSlice';
import Modal from "react-native-modal"
import colors from '../../constants/colors';
import { fonts } from '../../constants/fonts';
import { actuatedNormalize } from '../../constants/PixelScaling';
import { LabelWithIcon } from '../drawer/iconlabel';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from "react-native-vector-icons/Ionicons"
import * as Animatable from "react-native-animatable"
import { FlatList } from 'react-native';
interface Props {
    visible: boolean;
    onClose: () => void;
    userdata: UserInterface | null
}

const RenderInterestItem = ({ item }: { item: String }) => (
    <View style={styles.interestItem}>
        <Text style={styles.interestText}>{item}</Text>
    </View>
);

const userData = {
    mobileNumber: '123-456-7890',
    role: 'Adventurer',
    name: 'Rebecca',
    username: 'rebecca23',
    age: 23,
    gender: 'male',
    interest: ['Vegan', 'Foodie', 'Gaming'],
    language: ['English', 'Spanish'],
    profilePic: 'https://randomuser.me/api/portraits/men/1.jpg', // Replace with actual image URL
    coins: '150',
    userQuote: "It takes courage to grow up and become who you really are",
    bio: "I'm an adventurous professional looking to connect with others. Love hiking and the great outdoors.",
    mentalHealthIssues: ['Anxiety', 'Breakup'],
    callStatus: {
        totalCalls: 240,
        successfulCalls: 210,
        rating: 4.5
    }
};

const ProfileScreenModal: React.FC<Props> = ({ visible, onClose, userdata }) => {
    return (
        <Modal hasBackdrop={false}
            backdropColor="transparent"
            animationInTiming={1000}
            animationIn="slideInUp"
            animationOut="slideOutDown"
            animationOutTiming={1000}
            isVisible={visible}
            style={{width:"100%",alignSelf:"center"}}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    {/* Close button */}
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        {/* <Text style={styles.closeButtonText}>X</Text> */}
                        <Animatable.View
                            animation="rotate"
                            delay={600}>
                            <Ionicons name='close' size={25} color={colors.black} />
                        </Animatable.View>
                    </TouchableOpacity>
                    {/* Modal content */}
                    <View style={styles.content}>
                        <View style={styles.TitleContainer}>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    columnGap: actuatedNormalize(10),
                                    alignSelf: "center"
                                }}>
                                <Text style={styles.nameText}>{`${userdata?.name}`}</Text>
                                <Icon
                                    name={userdata?.gender === 'male' ? 'gender-male' : 'gender-female'}
                                    size={22}
                                    color={userdata?.gender === 'male' ? colors.skyBlue : colors.pink}
                                />
                            </View>
                            <Text style={[styles.detailText, { marginTop: actuatedNormalize(10) }]}>Age: {userdata?.age.toString()}</Text>
                            <Text style={[styles.detailText, { marginTop: actuatedNormalize(10) }]}>{`${userdata?.mentalIssues.join(",")}`}</Text>
                        </View>
                    </View>
                    <View style={styles.userPerformaceContainer}>
                        <View style={styles.userPerformaceContainer2}>
                            <Text style={styles.title}>Total Calls</Text>
                            <Text style={styles.number}>{userdata?.UserCallsInfoList.length}</Text>
                        </View>
                        <View style={styles.userPerformaceContainer2}>
                            <Text style={styles.title}>Successful Calls</Text>
                            <Text style={styles.number}>{userdata?.UserCallsInfoList.filter((el) => el.isSuccessful === true).length}</Text>
                        </View>
                        <View style={styles.userPerformaceContainer2}>
                            <Text style={styles.title}>Rating</Text>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Text style={styles.number}>{userdata?.UserRating[0]?.rating || 0}</Text>
                                <Icon name='star' size={actuatedNormalize(20)} color={colors.yellow} />
                            </View>
                        </View>
                    </View>
                    <View style={styles.descContainer}>
                        <LabelWithIcon iconName="person" label={`${userdata?.name.split(" ")[0]} story`} />
                        <Text style={styles.bioText}>{userdata?.bio || userData.bio}</Text>
                    </View>
                    <View style={styles.descContainer}>
                        <LabelWithIcon iconName="tennisball" label="Interest" />
                        <View style={styles.interestsContainer}>
                        <FlatList data={userdata?.interest}
                                renderItem={({ item }) => <RenderInterestItem item={item} />}
                                keyExtractor={(item, index) => index.toString()}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                            />
                        </View>
                    </View>
                    <View style={styles.descContainer}>
                        <LabelWithIcon iconName="text" label={`Languages ${userdata?.name.split(" ")[0]} speak`} />
                        <View style={styles.interestsContainer}>
                        <FlatList data={userdata?.language}
                                renderItem={({ item }) => <RenderInterestItem item={item} />}
                                keyExtractor={(item, index) => index.toString()}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                            />
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        width:"100%",
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent background
    },
    modalContent: {
        backgroundColor: colors.black,
        borderTopLeftRadius: actuatedNormalize(20),
        borderTopRightRadius: actuatedNormalize(20),
        padding: actuatedNormalize(20),
        borderTopColor: colors.white,
        borderWidth: 1,
        rowGap: actuatedNormalize(20)
    },
    closeButton: {
        position: 'absolute',
        top: actuatedNormalize(-50),
        borderRadius: actuatedNormalize(20),
        padding: actuatedNormalize(5),
        backgroundColor: colors.white,
        alignSelf: 'center',
        zIndex: 1,
    },
    // closeButtonText: {
    //     fontSize: 20,
    //     fontWeight: 'bold',
    // },
    content: {
        alignItems: 'center',
        // paddingVertical: 20,
    },
    userPerformaceContainer: {
        flexDirection: "row",
        width: "90%",
        // paddingHorizontal:actuatedNormalize(10),
        // marginTop: actuatedNormalize(20),
        justifyContent: "space-between",
        borderRadius: actuatedNormalize(10),
        alignSelf: "center"
    },
    userPerformaceContainer2: {
        justifyContent: "center",
        alignItems: "center",
        rowGap: actuatedNormalize(5)
    },
    avatarStyles: {
        borderRadius: 50
    },
    interestsContainer: {
        flexDirection: 'row',
    },
    interestItem: {
        backgroundColor: colors.primary,
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginRight: 8,
    },
    interestText: {
        color: colors.white,
        fontFamily: fonts.NexaRegular,
        fontSize: actuatedNormalize(14)
    },
    TitleContainer: {
        marginTop: actuatedNormalize(20),
    },
    nameText: {
        fontFamily: fonts.NexaBold,
        fontSize: actuatedNormalize(26),
        color: colors.white,
    },
    detailText: {
        fontFamily: fonts.NexaRegular,
        fontSize: actuatedNormalize(16),
        color: colors.gray,
        alignSelf: 'center',
    },
    bioText: {
        fontFamily: fonts.NexaRegular,
        fontSize: actuatedNormalize(16),
        color: colors.gray,
    },
    mentalHealthText: {},
    descContainer: {
        rowGap: actuatedNormalize(10)
    },
    infoContainer: {
        flex: 1,
        marginTop: actuatedNormalize(30),
        rowGap: actuatedNormalize(20),
        width: "90%",
    },
    number: {
        fontFamily: fonts.NexaBold,
        fontSize: actuatedNormalize(20),
        color: colors.white
    },
    title: {
        fontFamily: fonts.NexaRegular,
        fontSize: actuatedNormalize(14),
        color: colors.gray
    },
    quote: {
        fontFamily: fonts.NexaItalic,
        color: colors.gray,
        fontSize: actuatedNormalize(16),
        textAlign: "center"
    }
});

export default ProfileScreenModal;
