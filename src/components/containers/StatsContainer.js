import React, { Component } from 'react';
import { View, Text } from 'react-native';
import PropTypes from 'prop-types';
import { fetchBuisnessList, logout } from '../../actions/index';
import StatsScreen from '../StatsScreen';
import { connect } from 'react-redux';

class StatsContainer extends Component {
  render() {
    return (
      <View>
        <StatsScreen />
      </View>
    )
  }
};

function mapStateToProps(state, ownProps) {
  return { user: state.user };
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(StatsScreen);