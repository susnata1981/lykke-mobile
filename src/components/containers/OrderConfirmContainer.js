import React, { Component } from 'react';
import { View, Text } from 'react-native';
import PropTypes from 'prop-types';
import { fetchBuisnessList, logout } from '../../actions/index';
import OrderConfirmScreen from '../OrderConfirmScreen';
import { connect } from 'react-redux';

class OrderConfirmContainer extends Component {
  render() {
    return (
      <View>
        <OrderConfirmScreen />
      </View>
    )
  }
};

function mapStateToProps(state, ownProps) {
  return { state };
}

function mapDispatchToProps(dispatch) {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderConfirmScreen);