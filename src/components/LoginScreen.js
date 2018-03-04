import React, { Component } from 'react';
import { Spinner } from 'native-base';
import { View, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import { NavigationActions } from 'react-navigation';
// const FBSDK = require('react-native-fbsdk');
import FBSDK, { LoginButton } from 'react-native-fbsdk';
import { FB_LOGIN } from '../images';
import Toolbar from '../components/Toolbar';
import { primaryColor } from './styles';

export default class LoginScreen extends Component {

  static propTypes = {
    _login: PropTypes.func.isRequired,
    _isLogin: PropTypes.func.isRequired,
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user.email) {
      // const resetAction = NavigationActions.navigate({
      //   routeName: 'DrawerStack'
      // });
      const resetAction = NavigationActions.reset({
        index: 0,
        key: null,
        actions: [
          NavigationActions.navigate({ routeName: 'DrawerStack' })
        ]
      });
      nextProps.navigation.dispatch(resetAction);
    }
  }

  login = () => {
    this.props._login();
  }

  render() {
    if (this.props.user.isLogin) {
      return (
        <View style={styles.secondaryContainer}>
          <ActivityIndicator size='large' color={primaryColor} />
        </View>
      )
    }

    return (
      <View style={styles.container}>
        <Toolbar backButtonTitle="Routes"
          title='Login'
          hideBackButton={true}
          dispatch={this.props.navigation.dispatch} />

        <View style={styles.secondaryContainer}>
          <TouchableOpacity onPress={() => this.login()} style={styles.buttonContainer}>
            <Image style={styles.loginBtnImage} source={FB_LOGIN} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignContent: 'center',
  },
  secondaryContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginBtnImage: {
    width: 300,
    height: 160,
    resizeMode: 'contain',
    alignItems: 'center',
  }
});
