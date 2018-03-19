import React, { Component } from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  View,
  ToolbarAndroid,
  Image,
} from 'react-native';
import { Container, Header, Content, H1, Text, Icon, Button, Title, List, ListItem, StyleProvider, getTheme } from 'native-base';
import { NavigationActions } from 'react-navigation';
import Toolbar from './Toolbar';
import cs, { accentColor, primaryColorDark, secondaryColor, defaultMargin, leftMargin } from './styles';
import { getDateObject, isToday } from '../util';
import moment from 'moment';
import { DAYS, getCurrentDay } from '../common/constants';
import { HOLIDAY } from '../images';
import _ from 'lodash';

export default class RouteStartScreen extends Component {

  // componentDidMount() {
  //   this.props._getRoutes(this.props.user);
  // }

  next = () => {
    this.props._selectRoute(Object.keys(this.route)[0]);
    this.props.navigation.dispatch(NavigationActions.navigate(
      { routeName: 'RouteDetails' }
    ));
  }

  onNavigationBackButtonPress = () => {
    this.props.navigation.dispatch(NavigationActions.navigate({ routeName: 'DrawerToggle' }));
  }

  render() {
    if (_.isEmpty(this.props.routes)) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={cs.h3}>Loading...</Text>
        </View>
      )
    }

    const currDay = getCurrentDay();
    
    const dayToRouteMap = {};
    _.map(this.props.routes, (v, k) => {
      dayToRouteMap[v.assignment.dayOfWeek] = {[k] : v}
    });

    this.route = dayToRouteMap[currDay.name]
    const businesses = [];
    const routeValue = this.route[Object.keys(this.route)[0]];
    _.map(_.get(routeValue, 'businesses', []), (v, k) => {
      if (v) {
        businesses.push(k);
      }
    });

    return (
      <View style={cs.container}>
        <Toolbar backButtonTitle="Routes"
          title="Today's Route"
          onBackButtonPress={() => this.onNavigationBackButtonPress()}
          androidNavButtonIcon="md-menu"
          iosNavButtonIcon="menu"
          dispatch={this.props.navigation.dispatch} />

        {currDay.holiday &&
          <View>
            <Image source={HOLIDAY} style={{ width: '100%', height: 300, resizeMode: 'cover' }} />
            <Text style={[cs.h3, { margin: leftMargin, color: primaryColorDark, textAlign: 'center' }]}>{currDay.name} is a holiday, have fun today!</Text>
          </View>
        }

        {!currDay.holiday &&
          <View style={[cs.container, { justifyContent: 'center', alignItems: 'center' }]}>
            <Text style={cs.h3}>{currDay.name}</Text>
            <View style={[cs.row, { alignItems: 'center' }]}>
              <Text style={cs.h3}>Today's route is&nbsp;</Text>
              <Text style={[cs.h2, cs.bold]}>{this.route.name}</Text>
            </View>
            <View style={[cs.row, { alignItems: 'center' }]}>
              <Text style={cs.h3}>Businesses to visit&nbsp;</Text>
              <Text style={[cs.h2, cs.bold]}>{businesses.length}</Text>
            </View>
            <Button block onPress={this.next} style={styles.btn}>
              <Text>Start Now</Text>
            </Button>
          </View>
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  btn: {
    margin: 12,
    marginTop: 24,
    backgroundColor: accentColor,
  }
});
