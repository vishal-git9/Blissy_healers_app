import React, { useEffect, useState } from 'react';
import { View, TextInput, StyleSheet, KeyboardAvoidingView, Pressable, Dimensions } from 'react-native';
import { Button, Card, Snackbar } from 'react-native-paper';
import { PrimaryButton } from '../../common/button/PrimaryButton';
import { RouteBackButton } from '../../common/button/BackButton';
import { Text } from 'react-native';
import colors from '../../constants/colors';
import { fonts } from '../../constants/fonts';
import { actuatedNormalize } from '../../constants/PixelScaling';
import ReportCard from '../../common/cards/reportcard';
import { ScrollView } from 'react-native';
import LiveItUpComponent from '../../common/drawer/liveitup';
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootStackParamList } from '../../AppNavigation/navigatorType';
import { useGetmyBugReportsQuery, usePostBugReportsMutation } from '../../api/feedbackservice';
import { useSelector } from 'react-redux';
import { AuthSelector } from '../../redux/uiSlice';
import { BlissyLoader } from '../../common/loader/blissy';
import { Empty } from '../../common/Empty/Empty';
import useBackHandler from '../../hooks/usebackhandler';
import PullToRefresh from '../../common/refresh/pull';
import Animated, { runOnJS, useAnimatedRef, useAnimatedScrollHandler } from 'react-native-reanimated';

interface BugreportProps {
    navigation: DrawerNavigationProp<RootStackParamList>;

}
const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;


const BugReportScreen: React.FC<BugreportProps> = (props) => {
    const [text, setText] = useState<string>('');
    const [postbug, { isLoading, isError, isSuccess }] = usePostBugReportsMutation()
    const [isreportAdded, setisreportAdded] = useState(false)
    const [isScrollable, setIsScrollable] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [view, setView] = useState<'create' | 'view'>('create');
    const [reportName, setReportName] = useState<string>('');
    const [reports, setReports] = useState<Array<{ name: string; status: 'pending' | 'resolved'; updatedAt?: string }>>([]);
    const { refetch, isLoading: isgetreportloading, isError: isgetreporterror } = useGetmyBugReportsQuery({})
    const scrollRef = useAnimatedRef<Animated.ScrollView>();

    const { user } = useSelector(AuthSelector)


  // calling use backhandler
  useBackHandler()
  
    React.useLayoutEffect(() => {
        props.navigation.setOptions(({
            headerShown: true,
            headerTitle: '',
            headerTintColor: colors.white,
            headerTitleStyle: { color: colors.white, fontFamily: fonts.NexaRegular, fontSize: actuatedNormalize(20) },
            headerTransparent: true,
            headerLeft: ({ }) => (
                <Pressable onPress={props.navigation.goBack} style={{ marginRight: 10 }}>
                    {/* <Ionicons name="arrow-back" size={24} color={colors.white} /> */}
                    <MaterialIcons name="segment" size={actuatedNormalize(30)} color={colors.white} />
                </Pressable >
            ),
            headerStyle: {
                backgroundColor: colors.transparent,
            },
        }))
    }, [props.navigation])


    const handlePress = () => {
        console.log('Button Pressed with Text:', text);
        // Add your desired action here
    };

    const handleCreateReport = async () => {
        setReportName("")
        if (reportName.trim()) {
            const res = await postbug({
                userId: user?._id,
                name: reportName,
                appId: user?._id,
                description: reportName,
                status: "pending",
            })

            if ('data' in res) {
                console.log(res, "data of reports")
                // fetch user details
                setisreportAdded(true)
                refetch().then((res) => setReports(res.data)).catch((err) => console.log(err))
            } else if ('error' in res) {
                console.log(res, "data of reports")
            }
            // setReports([...reports, { name: reportName, status: 'pending' }]);
            // setReportName('');
            // setView('view');
        }
    };


  
    const updatePanState = (offset: number) => {
      'worklet';
      if (offset > 0) {
        runOnJS(setIsScrollable)(true);
      } else {
        runOnJS(setIsScrollable)(false);
      }
    };
  
    const handleOnScroll = useAnimatedScrollHandler({
      onScroll({ contentOffset }) {
        console.log(contentOffset.y, "contentOffset.y----->")
        updatePanState(contentOffset.y);
        // scrollY.value = contentOffset.y;
      },
    });
  
    const handleRefresh = async () => {
      setRefreshing(true);
      // Simulate a network request
      await refetch().then((res) => setReports(res.data)).catch((err) => console.log(err))
      setTimeout(() => {
        setRefreshing(false);
      }, 2000);
    };


    useEffect(() => {
        refetch().then((res) => setReports(res.data)).catch((err) => console.log(err))
    }, [])

    console.log(isLoading, isgetreportloading, "isgetreportloading------->")
    return (
        <>
            <View style={styles.container}>
                {/* <RouteBackButton onPress={() => navigation.goBack()} /> */}
                {/* <Text style={{ color: colors.white, alignSelf: "center", fontFamily: fonts.NexaBold, fontSize: actuatedNormalize(23), marginTop: actuatedNormalize(5) }}>Bug Report</Text> */}
                {(isLoading || isgetreportloading) && <View style={styles.loaderContainer}>
                    <BlissyLoader />
                </View>}
                <View style={styles.buttonContainer}>
                    <Button buttonColor={view === "create" ? colors.primary : "transparent"} labelStyle={{ fontFamily: fonts.NexaRegular }} mode={view === "create" ? "contained" : "outlined"} textColor={colors.white} onPress={() => setView('create')} style={styles.button}>
                        New Report
                    </Button>
                    <Button buttonColor={view === "view" ? colors.primary : "transparent"} labelStyle={{ fontFamily: fonts.NexaRegular }} mode={view === "view" ? "contained" : "outlined"} textColor={colors.white} onPress={() => setView('view')} style={styles.button}>
                        Previous Reports
                    </Button>
                </View>

                {view === 'create' ? (
                    <KeyboardAvoidingView style={{ flex: 1 }}>
                        <TextInput
                            style={styles.textarea}
                            multiline={true}
                            numberOfLines={4}
                            placeholderTextColor={colors.white}
                            onChangeText={setReportName}
                            value={reportName}
                            placeholder="Write your report here..."
                        />
                        <PrimaryButton styles={{ width: "100%" }} label='Submit' handleFunc={handleCreateReport} />
                        <View style={{ flex: 1, justifyContent: "flex-end", width: "100%" }}>
                            <LiveItUpComponent />
                        </View>              
                  </KeyboardAvoidingView>
                ) : (
                    <PullToRefresh scrollRef={scrollRef} handleOnscroll={handleOnScroll} isScrollable={isScrollable} refreshing setIsScrollable={setIsScrollable} updatePanState={updatePanState} onRefresh={handleRefresh}>
                    <Animated.ScrollView             scrollEnabled={true}
  onMomentumScrollEnd={(e) => updatePanState(e.nativeEvent.contentOffset.y)}
 ref={scrollRef} onScroll={handleOnScroll} nestedScrollEnabled={true} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollView}>
                        {reports.length === 0 &&   <Empty head='Bug reports' description='You have not raised any bug reports related to app' />
                        }
                        {reports.map((report, index) => (
                            <ReportCard
                                key={index}
                                reportName={report.name}
                                status={report.status}
                                resolvedTime={report.updatedAt}
                            />
                        ))}
                    </Animated.ScrollView>
                    </PullToRefresh>
                )}


            </View>
            <Snackbar
                duration={2000}
                visible={isreportAdded}
                style={{ backgroundColor: colors.dark }}
                onDismiss={() => setisreportAdded(false)}
                theme={{
                    colors: {
                      inverseOnSurface: colors.white,
                      surface: colors.white
                    },
                  }}
                action={{
                    theme: {
                        fonts: {
                            regular: { fontFamily: fonts.NexaRegular },
                            medium: { fontFamily: fonts.NexaBold },
                            light: { fontFamily: fonts.NexaBold },
                            thin: { fontFamily: fonts.NexaRegular },
                        },
                        colors: { inversePrimary: colors.white, surface: colors.white, accent: colors.white }
                    },

                    label: 'Okay',
                    textColor: "red",
                    labelStyle: { fontFamily: fonts.NexaBold, color: colors.white },
                    onPress: () => {
                        // Do something
                        setisreportAdded(false);
                    },
                }}>
                Your report Submitted to our team!
            </Snackbar>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: actuatedNormalize(20),
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: actuatedNormalize(20),
        marginTop: actuatedNormalize(50)
    },
    button: {
        flex: 1,
        marginHorizontal: actuatedNormalize(5),
        borderColor: colors.primary,
        color: colors.white,
        fontFamily: fonts.NexaRegular
    },
    card: {
        padding: actuatedNormalize(10),
    },
    textarea: {
        height: actuatedNormalize(150),
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
    createButton: {
        paddingVertical: actuatedNormalize(10),
    },
    scrollView: {
        paddingBottom: actuatedNormalize(20),
    },
    loaderContainer: {
        position: 'absolute',
        zIndex: 2,
        flex: 1,
        height: screenHeight,
        width: screenWidth,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.darkOverlayColor2,
    },
});


export default BugReportScreen;
