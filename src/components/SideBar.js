import React, { Component } from 'react';
import { View, TouchableHighlight, StyleSheet } from 'react-native';
import {
  Drawer,
  Button,
  Title,
  Container, Header, Content, List, Left, Right, ListItem, Thumbnail, Text, Body, Icon
} from 'native-base';
import { NavigationActions } from 'react-navigation';
import * as Types from '../actions/types';
import { primaryColor } from './styles';
import store from '../store'
import { logout } from '../actions';

const ROUTE_ITEMS = [
  {
    id: 1,
    title: 'Today\'s Route',
    icon: 'home',
    onPress: (dispatch) => dispatch(NavigationActions.navigate({ routeName: 'RouteStart' }))
  }, {
    id: 2,
    title: 'All Routes',
    icon: 'home',
    onPress: (dispatch) => dispatch(NavigationActions.navigate({ routeName: 'Routes' }))
  }, {
    id: 3,
    title: 'Stats',
    icon: 'md-stats',
    onPress: (dispatch) => dispatch(NavigationActions.navigate(
      { routeName: 'Stats' }
    ))
  }, {
    id: 4,
    title: 'Logout',
    icon: 'md-log-out',
    onPress: (dispatch) => {
      // dispatch({
      //   type: Types.SIGN_OUT,
      // });
      const state = store.getState();
      console.log('-logout-');
      console.log(state)
      dispatch(logout(state.user));
      // TODO: Check if we need to reset it here.
      const resetAction = NavigationActions.reset({
        index: 0,
        key: null,
        actions: [
          NavigationActions.navigate({ routeName: 'LoginStack' })
        ]
      });
      dispatch(resetAction);
      // dispatch(NavigationActions.navigate({ routeName: 'LoginStack' }));
    }
  },
];

class SideItem extends Component {

  _onButtonPress = () => {
    this.props.item.onPress(this.props.dispatch);
  }

  getRoute() {
    return ROUTE_ITEMS.filter(item => item.title === this.props.title)[0];
  }

  render() {
    return (
      <ListItem icon onPress={this._onButtonPress}>
        <Left>
          <Icon name={this.props.item.icon} style={styles.navIcon} />
        </Left>
        <Body>
            <Text>{this.props.item.title}</Text>
        </Body>
        <Right />
      </ListItem>
    );
  }
}

const styles = StyleSheet.create({
  navIcon: {
    color: primaryColor
  },
});

export default class SideBar extends Component {

  handleClick = (item) => {
    this.props.navigation.dispatch(NavigationActions.navigate({ routeName: item.title }));
  }

  render() {
    return (
      <Container style={{padding: 4}}>
        <Content>
          <List dataArray={ROUTE_ITEMS} renderRow={(item) =>
            (
              <SideItem
                key={item.id}
                dispatch={this.props.navigation.dispatch}
                handleClick={() => this.handleClick(item)}
                item={item}
              />)
          } />
        </Content>
      </Container>
    );
  }
};
