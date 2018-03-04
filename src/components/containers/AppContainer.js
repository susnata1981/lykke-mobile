import React, { Component } from 'react';
import { View, Text } from 'react-native';
import PropTypes from 'prop-types';
import { fetchBuisnessList, logout } from '../actions/index';
import BusinessList from '../components/BusinessList';
import { connect } from 'react-redux';

class AppContainer extends Component {
  render() {
    return (
      <View>
        <BusinessList />
      </View>
    )
  }
};

function mapStateToProps(state, ownProps) {
  return state;
}

function mapDispatchToProps(dispatch) {
  return {
    fetchBuisnessList: () => dispatch(fetchBuisnessList()),
    logout: () => dispatch(logout()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BusinessList);