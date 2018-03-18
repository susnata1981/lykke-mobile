import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { getRoutes, selectRoute } from '../../actions/index';
import RouteStartScreen from '../RouteStartScreen';
import { connect } from 'react-redux';

class StartRouteContainer extends Component {
  render() {
    return (
      <View>
        <RouteStartScreen />
      </View>
    )
  }
};

function mapStateToProps(state, ownProps) {
  return {
    user: state.user,
    routes: state.routes,
    selectedRoute: state.selectedRoute,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    _getRoutes: user => dispatch(getRoutes(user)),
    _selectRoute: routeName => dispatch(selectRoute(routeName)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RouteStartScreen);