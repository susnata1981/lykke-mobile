import React, { Component } from 'react';
import { View, Text } from 'react-native';
import PropTypes from 'prop-types';
import { completeCheckin, refresh } from '../../actions/index';
import CheckoutScreen from '../CheckoutScreen';
import { connect } from 'react-redux';

class CheckoutContainer extends Component {
  render() {
    return (
      <View>
        <CheckoutScreen />
      </View>
    )
  }
};

function mapStateToProps(state, ownProps) {
  return { 
    businesses: state.businesses,
    checkins: state.checkins,
    selectedRoute: state.selectedRoute,
    selectedCheckinKey: state.selectedCheckinKey,
    itemmaster: state.itemmaster,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    _completeCheckin: (checkinKey) => dispatch(completeCheckin(checkinKey)),
    _refresh: () => dispatch(refresh()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckoutScreen);