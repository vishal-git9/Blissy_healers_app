import React, { useState } from 'react';
import {
  View,
  StatusBar,
  StyleSheet,
  StatusBarStyle,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, runOnJS } from 'react-native-reanimated';
import colors from '../../constants/colors';
import { Searchbar } from 'react-native-paper';
import { fonts } from '../../constants/fonts';
const { height: windowHeight } = Dimensions.get('window');

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  backgroundColor?: string;
  isSearchActive: boolean;
  querytext: string;
  height: number
  setIsSearchActive: (value: boolean) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search...',
  onSearch,
  isSearchActive,
  setIsSearchActive,
  height,
  querytext,
  backgroundColor = '#075E54',
}) => {

  const translateY = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const openSearch = () => {
    translateY.value = withTiming(-windowHeight * 0.050, { duration: 600 });
    runOnJS(setIsSearchActive)(true);
  };

  const closeSearch = () => {
    translateY.value = withTiming(0, { duration: 800 });

    runOnJS(setIsSearchActive)(false);
  };


  return (
    <>
      {/* <View style={{ backgroundColor: backgroundColor, height: StatusBar.currentHeight || 24 }}>
        <StatusBar translucent backgroundColor={backgroundColor} barStyle={barStyle} />
      </View> */}
      <Animated.View style={[styles.searchBarContainer, animatedStyle]}>
        {isSearchActive ? (
          <View style={styles.searchInputContainer}>
            <TouchableOpacity onPress={closeSearch} hitSlop={{top:50,bottom:50,left:50,right:50}}>
            <Ionicons  name="arrow-back" size={24} color={colors.white}  />
            </TouchableOpacity>
            <Searchbar
              value={querytext}
              iconColor={colors.white}
              placeholder={placeholder}
              placeholderTextColor={colors.white}
              inputStyle={{fontFamily:fonts.NexaRegular}}
             selectionColor={colors.white}
            //   placeholderTextColor={colors.white}
              autoFocus={true}
              onChangeText={onSearch}
              style={styles.searchInput}
            />
          </View>
        ) : (
          <Searchbar
            value={querytext}
            placeholderTextColor={colors.white}
            iconColor={colors.white}
            inputStyle={{fontFamily:fonts.NexaRegular}}
            selectionColor={colors.white}
            // placeholderTextColor={colors.white}
          onPressIn={openSearch}
            placeholder={placeholder}
            style={styles.searchBar}
          />
        )}
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  searchBarContainer: {
    width: '100%',
    backgroundColor: colors.transparent,
    paddingVertical: 5,
    position: 'absolute',
    top: StatusBar.currentHeight,
    zIndex: 10,
  },
  searchBar: {
    backgroundColor: colors.dark,
    flex: 1,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.transparent,
    borderRadius: 5,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    tintColor: colors.white,
    color: colors.white,
    backgroundColor: colors.dark
  },
});

export default SearchBar;
