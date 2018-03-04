import React, { Component } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { login, isLogin } from '../../actions/';
import LoginScreen from '../LoginScreen';
import { connect } from 'react-redux';

class LoginContainer extends Component {
  render() {
    return (
      <View>
        <LoginScreen testTitle="Login Screen"/>
      </View>
    )
  }
};

function mapStateToProps(state, ownProps) {
  return  { user: state.user };
}

function mapDispatchToProps(dispatch) {
  return {
    _login: () => dispatch(login()),
    _isLogin: (state) => dispatch(isLogin(state)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);