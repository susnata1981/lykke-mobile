import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { addBusinessToRoute, removeBusinessFromRoute,  createCheckin } from '../../actions/index';
import ModifyRouteScreen from '../ModifyRouteScreen';
import { connect } from 'react-redux';

class ModifyRouteContainer extends Component {
  render() {
    return (
      <View>
        <ModifyRouteScreen />
      </View>
    )
  }
};

function mapStateToProps(state, ownProps) {
  return {
    user: state.user,
    businesses: state.businesses,
    routes: state.routes,
    session: state.session,
    selectedRoute: state.selectedRoute,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    _addBusinessToRoute: (user, businessName) => dispatch(addBusinessToRoute(user, businessName)),
    _removeBusinessFromRoute: (user, businessName) => dispatch(removeBusinessFromRoute(user, businessName)),
    _createCheckin: (businessKey, userKey, timeCreated) => dispatch(createCheckin(businessKey, userKey, timeCreated)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModifyRouteScreen);