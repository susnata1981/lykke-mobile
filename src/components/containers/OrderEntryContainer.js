import React, { Component } from 'react';
import { View, Text } from 'react-native';
import PropTypes from 'prop-types';
import { confirmOrder, checkin, saveOrder } from '../../actions/index';
import OrderEntryScreen from '../OrderEntryScreen';
import { connect } from 'react-redux';

class OrderEntryContainer extends Component {
  render() {
    return (
      <View>
        <OrderEntryScreen />
      </View>
    )
  }
};

function mapStateToProps(state, ownProps) {
  return { 
    businesses: state.businesses,
    itemmaster: state.itemmaster,
    checkins: state.checkins,
    selectedCheckinKey: state.selectedCheckinKey,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    _confirmOrder: (order) => dispatch(confirmOrder(order)),
    _saveOrder: (checkinKey, order, updatedItemCounts) => dispatch(saveOrder(checkinKey, order, updatedItemCounts)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderEntryScreen);