import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { View, Button, Icon, Title, Text, H2, H3 } from 'native-base';
import cs from './styles';
import {
  primaryColor,
  primaryTextColor,
  toolbarNavButtonColor,
  toolbarHeight,
  toolbarTitleFontSize,
  toolbarTitleColor,
  whiteTextColor,
} from './styles';
import PropTypes from 'prop-types'

export default class Toolbar extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    backButtonTitle: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props);
    if (this.props.onBackButtonPress) {
      this.onBackButtonPress = this.props.onBackButtonPress.bind(this);
    } else {
      this.onBackButtonPress = () => {
        this.props.dispatch(NavigationActions.back());
      }
    }
    this.androidNavButtonIcon = this.props.androidNavButtonIcon || "md-arrow-back";
    this.iosNavButtonIcon = this.props.androidNavButtonIcon || "arrow-back";
  }

  render() {
    return (
      <View style={styles.toolbar}>
        <Text style={[cs.h3, cs.textWhite]}>{this.props.title}</Text>
        { !this.props.hideBackButton &&
        <Button transparent iconLeft style={styles.navBtn} onPress={() => this.onBackButtonPress()}>
          <Icon android={this.androidNavButtonIcon} ios={this.iosNavButtonIcon} style={cs.textWhite} />
          <Text style={cs.textWhite}>{this.props.backButtonTitle}</Text>
        </Button>
        }
      </View>
    );
  }
};

const styles = StyleSheet.create({
  toolbar: {
    height: toolbarHeight,
    backgroundColor: primaryColor,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navBtn: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: toolbarHeight,
  },
});