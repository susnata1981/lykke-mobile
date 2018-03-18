import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Dimensions, View, Text, StyleSheet, Button,
  Animated,
  Easing,
  TouchableNativeFeedback,
  ViewPagerAndroid,
  ScrollView,
} from 'react-native';
import _ from 'lodash';
import { accentColor } from '../styles';

class TabItem extends Component {
  render() {
    const borderWidth = this.props.selected ? 4 : 0
    return (
      <View style={[styles.tabItem, { borderBottomWidth: borderWidth }]}>
        <TouchableNativeFeedback
          onPress={this.props.handleClick}
          background={TouchableNativeFeedback.SelectableBackground()}>
          <Text style={styles.tabHeader} numberOfLines={1}>
            {this.props.title}
          </Text>
        </TouchableNativeFeedback>
      </View>
    );
  }
}

export default class TabView extends Component {
  state = {
    tabIndex: 0
  }

  constructor(props) {
    super(props);
    this.deviceWidth = Dimensions.get('window').width
    this.offset = new Animated.Value(0);
    this.tabViews = [];
    _.map(this.props.tabs, (v, k) => {
      this.tabViews.push(v.component);
    });
  }

  handleClick = (index) => {
    this.pager.setPage(index);
    this.setState({
      tabIndex: index
    });
  }

  render() {
    const TabView = this.tabViews[this.state.tabIndex];

    const content = this.props.tabs.map((item, index) => {
      let Component = item.component;
      return (
        <View>
          <Component key={index} {...item.args} style={{ flex: 1 }} />
        </View>
      )
    });

    return (
      <View style={{flex: 1}}>
        <View style={styles.row}>
          {this.props.tabs.map((tab, i) =>
            <TabItem key={i} title={tab.title} handleClick={() => this.handleClick(i)} selected={this.state.tabIndex === i} />)}
        </View>

        <ViewPagerAndroid style={{flex: 1}} ref={elem => this.pager = elem}>
          {
            this.props.tabs.map((item, index) => {
              let Component = item.component;
              return (
                <View key={index}>
                  <Component key={index} {...item.args} />
                </View>
              )
            })
          }
        </ViewPagerAndroid>
      </View >
    )
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 8,
    marginBottom: 8,
    borderBottomColor: '#0ff',
  },
  tabHeader: {
    fontSize: 18,
    fontWeight: 'bold',
  }
});