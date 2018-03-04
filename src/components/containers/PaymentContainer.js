import React, { Component } from 'react';
import { View, Text } from 'react-native';
import PropTypes from 'prop-types';
import { updatePayment, refresh } from '../../actions/index';
import PaymentScreen from '../PaymentScreen';
import { connect } from 'react-redux';

class PaymentContainer extends Component {
  render() {
    return (
      <View>
        <PaymentScreen />
      </View>
    )
  }
};

function mapStateToProps(state, ownProps) {
  return { 
    businesses: state.businesses,
    checkins: state.checkins, 
    selectedCheckinKey: state.selectedCheckinKey,
    refresh: state.refresh,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    _updatePayment: (checkinKey, amount) => dispatch(updatePayment(checkinKey, amount)),
    _refresh: () => dispatch(refresh()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PaymentScreen);