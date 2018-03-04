import React, { Component } from 'react';
import { View, Text } from 'react-native';
import PropTypes from 'prop-types';
import RouteListScreen from '../RouteListScreen';
import { connect } from 'react-redux';
import { getRoutes, getBusinesses, selectRoute } from '../../actions'

class RouteListContainer extends Component {
  render() {
    return (
      <View>
        <RouteListScreen />
      </View>
    )
  }
};

function mapStateToProps(state, ownProps) {
  return {
    user: state.user,
    routes: state.routes,
    businesses: state.businesses,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    _getRoutes: user => dispatch(getRoutes(user)),
    _getBusinesses: () => dispatch(getBusinesses()),
    _selectRoute: routeName => dispatch(selectRoute(routeName)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RouteListScreen);