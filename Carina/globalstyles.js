import {StyleSheet} from 'react-native';
import {COLORS} from './colors.js';

export const globalStyles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontFamily: 'Roboto',
  },
  mainText: {
    fontSize: 18,
    fontFamily: 'Roboto',
    color: COLORS.mainLight,
  },
  coloredTextMedium: {
    fontSize: 14,
    fontFamily: 'Roboto',
    color: COLORS.mainLight,
  },
  smallBold: {
    fontSize: 12,
    fontFamily: 'Roboto-Bold',
  },
  menuRow: {flexDirection: 'row', alignItems: 'center', paddingBottom: 10},
  menuTopRow: {paddingTop: 10},
  menuDivider: {borderBottomWidth: 1, borderBottomColor: COLORS.mainSuperLight},
  menuItemtext: {fontSize: 16, fontFamily: 'Roboto'},
});
