import React, { Component } from 'react';
import { View, Container, Content, Header, List, ListItem, Text, Icon, Button, H3 } from 'native-base';
import PropTypes from 'prop-types';
import { NavigationActions } from 'react-navigation';
import { ToolbarAndroid, StyleSheet, ListView } from 'react-native';
import cs from './styles';
import Toolbar from './Toolbar';

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
    console.log(this.props.routes);
    const routeNames = Object.keys(this.props.routes).map(key => {
      return {
        name: key,
        businessCount: this.props.routes[key].businesses ? Object.keys(this.props.routes[key].businesses).length : 0,
        dayOfWeek: this.props.routes[key].assignment.dayOfWeek,
      }
    });

    return (
      <View style={cs.container}>
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

          <List dataArray={routeNames}
            renderRow={(item) =>
              <ListItem onPress={() => this.showRouteDetails(item.name)}
                style={styles.routesContainer}>
                <View style={[styles.item1]}>
                  <Text style={[cs.h4, { flex: 1, textAlign: 'center' }]}>
                    {item.dayOfWeek.toUpperCase()}
                  </Text>
                </View>
                <View style={[styles.item2, { textAlign: 'center' }]}>
                  <Text style={[cs.h4, { flex: 1, textAlign: 'center' }]}>
                    {item.name} ({item.businessCount})
              </Text>
                </View>
              </ListItem>
            }>
          </List>
        </View>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#ddd',
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
    justifyContent: 'flex-end',
  },
})

