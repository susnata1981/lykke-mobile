import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { fetchBuisnessList, logout, createCheckin } from '../../actions/index';
import RouteDetailsScreen from '../RouteDetailsScreen';
import { connect } from 'react-redux';

class RouteDetailsContainer extends Component {
  render() {
    return (
      <View>
        <RouteDetailsScreen />
      </View>
    )
  }
};

function mapStateToProps(state, ownProps) {
  return {
    user: state.user,
    businesses: state.businesses,
    routes: state.routes,
    checkins: state.checkins,
    selectedRoute: state.selectedRoute,
    session: state.session,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    // _getBusinesses: () => dispatch(getBusinesses()),
    // _getCheckins: (userKey) => dispatch(getCheckins(userKey)),
    _createCheckin: (businessKey, userKey, timeCreated) => dispatch(createCheckin(businessKey, userKey, timeCreated)),
    // _getSession: (user) => dispatch(getSession(user)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RouteDetailsScreen);