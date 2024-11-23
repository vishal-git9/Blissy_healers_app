import { StyleSheet } from 'react-native';
import colors from '../../constants/colors';

export const defaultStyles = StyleSheet.create({
  block: {
    backgroundColor: colors.dark,
    // borderRadius: 10,
    marginHorizontal: 14,
    // marginTop: 20,
    width:"100%",
    alignSelf:"center"
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    gap: 10,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.lightGray,
    // marginLeft: 50,
  },
});