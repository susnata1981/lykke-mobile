import React, { Component } from 'react';
import { View, Text } from 'react-native';
import PropTypes from 'prop-types';
import BusinessDetailsScreen from '../BusinessDetailsScreen';
import { connect } from 'react-redux';

class BusinessDetailsContainer extends Component {
  render() {
    return (
      <View>
        <BusinessDetailsScreen />
      </View>
    )
  }
};

function mapStateToProps(state, ownProps) {
  return { 
    businesses: state.businesses,
    checkins: state.checkins,
    selectedCheckinKey: state.selectedCheckinKey,
  };
}

export default connect(mapStateToProps)(BusinessDetailsScreen);