import { StyleSheet } from 'react-native';

export const primaryColor = '#9c27b0';
export const primaryColorDark = '#6a0080';
export const primaryColorLight = '#d05ce3';
export const accentColor = '#388E3C';
export const secondaryColor = '#4CAF50';
export const primaryTextColor = '#333';
export const secondaryTextColor = '#575757';
export const whiteTextColor = '#fff';
export const solidTextColor = whiteTextColor;
export const toolbarNavButtonColor = primaryTextColor;
export const toolbarTitleColor = '#fff';
export const toolbarTitleFontSize = 24;
export const toolbarHeight = 56;
export const defaultMargin = 12;


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerWithPadding: {
    flex: 1,
    flexDirection: 'column',
    padding: 12,
  },
  row: {
    flexDirection: 'row',
  },
  rowItem: {
    flex: 1,
    margin: defaultMargin,
  },
  contentCenter: {
    textAlign: 'center',
    alignSelf: 'center',
  },
  defaultMargin: {
    margin: defaultMargin,
  },
  nextBtn: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    elevation: 10,
  },
  iconBtn: {
    position: 'absolute',
    flexDirection: 'row',
    left: 4,
    top: 0,
    padding: 12,
  },
  bold: {
    fontWeight: 'bold',
  },
  h1: {
    fontSize: 28,
    color: primaryTextColor,
  },
  h2: {
    fontSize: 24,
    color: primaryTextColor,
  },
  h3: {
    fontSize: 20,
    color: primaryTextColor,
  },
  h4: {
    fontSize: 18,
    color: primaryTextColor,
  },
  h5: {
    fontSize: 16,
    color: primaryTextColor,
  },
  underline: {
    textDecorationLine: 'underline',
  },
  title: {
    color: primaryTextColor,
  },
  mapIcon: {
    fontSize: 30,
    color: '#0277BD',
  },
  fabBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: primaryColor,
  },
  primaryBtn: {
    backgroundColor: primaryColorDark,
  },
  textWhite: {
    color: '#fff',
  },
  button: {
    backgroundColor: accentColor,
  }
})

export default styles;