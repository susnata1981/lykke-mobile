import React, { Component } from 'react';
import { View, Container, Content, Header, List, ListItem, Text, Icon, Button, H3 } from 'native-base';
import PropTypes from 'prop-types';
import { NavigationActions } from 'react-navigation';
import { ToolbarAndroid, StyleSheet, ListView } from 'react-native';
import cs, { primaryColorLight, leftMargin, primaryTextColor } from './styles';
import Toolbar from './Toolbar';
import { mapIndexToDay } from '../common/constants';
import moment from 'moment';

export default class RouteListScreen extends Component {

  constructor(props) {
    super(props);
    this.handleMenuClick = this.handleMenuClick.bind(this);
  }

  componentDidMount() {
    this.props._getRoutes(this.props.user);
    this.props._getBusinesses();
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.user.email) {
      const resetAction = NavigationActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({ routeName: 'Login' })
        ]
      });
      this.props.navigation.dispatch(resetAction);
    }
  }

  showRouteDetails = (item) => {
    this.props._selectRoute(item);
    this.props.navigation.dispatch(
      NavigationActions.navigate(
        {
          routeName: 'RouteDetails',
          params: { routeName: item }
        })
    );
  }

  handleMenuClick() {
    this.props.navigation.dispatch(
      NavigationActions.navigate(
        { routeName: 'DrawerToggle' }
      ));
  }

  onNavigationBackButtonPress = () => {
    this.props.navigation.dispatch(NavigationActions.navigate({ routeName: 'DrawerToggle' }));
  }

  render() {
    const routeNames = Object.keys(this.props.routes).map(key => {
      return {
        name: key,
        businessCount: this.props.routes[key].businesses ? Object.keys(this.props.routes[key].businesses).length : 0,
        dayOfWeek: this.props.routes[key].assignment.dayOfWeek,
      }
    });

    const today = mapIndexToDay(moment().day()).name;
    console.log('-today =' + today);

    return (
      <View style={[cs.container, {backgroundColor: '#fff'}]}>
        <Toolbar backButtonTitle="Routes"
          title="Your Routes"
          onBackButtonPress={() => this.onNavigationBackButtonPress()}
          androidNavButtonIcon="md-menu"
          iosNavButtonIcon="menu"
          dispatch={this.props.navigation.dispatch} />

        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <List>
              <ListItem onPress={() => this.showRouteDetails(item.name)}
                style={styles.routesContainer}>
                <Text style={[cs.h3, { flex: 1, textAlign: 'center', padding: 4 }]}>
                  Day
              </Text>
                <Text style={[cs.h3, { flex: 1, textAlign: 'center', padding: 4 }]}>
                  Route Name
              </Text>
              </ListItem>
            </List>
          </View>

          {routeNames.length === 0 && <Text style={[cs.error, {margin: cs.defaultMargin/2}]}>No routes are created for you.</Text>}

          {routeNames.length > 0 && <List dataArray={routeNames}
            renderRow={(item) => {
              const bgColor = today === item.dayOfWeek.toUpperCase() ? primaryColorLight : '#fff';
              const textColor = today === item.dayOfWeek.toUpperCase() ? '#fff' : primaryTextColor;
              return (
              <ListItem onPress={() => this.showRouteDetails(item.name)}
                style={[styles.routesContainer, {backgroundColor: bgColor}]}>
                  <Text style={[cs.h4, { flex: 1, textAlign: 'center', marginLeft: leftMargin,  color:textColor }]}>
                    {item.dayOfWeek.toUpperCase()}
                  </Text>
                  <Text style={[cs.h4, { flex: 1, textAlign: 'center', color:textColor }]}>
                    {item.name} ({item.businessCount})
              </Text>
              </ListItem>
              )
            }}>
          </List>
          }
        </View>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#bbb',
    padding: 4,
  },
  routesContainer: {
    flex: 1,
    marginLeft: 0,
    padding: 0,
    flexDirection: 'row',
  },
  item1: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  item2: {
    flex: 1,
    justifyContent: 'flex-start',
  },
})

