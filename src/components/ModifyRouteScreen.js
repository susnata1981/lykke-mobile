import React, { Component } from 'react';
import { 
  Alert, 
  StyleSheet, 
  View, 
  ScrollView, 
  TextInput, 
  ToastAndroid, 
  ListView,
} from 'react-native';

import { Button, Text } from 'native-base';
import { NavigationActions } from 'react-navigation';
import Toolbar from './Toolbar';
import cs, { leftMargin } from './styles';
import _ from 'lodash';

export default class ModifyRouteScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      searchInput : ''
    }
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
  }

  back = () => {
    this.props.navigation.dispatch(NavigationActions.back());
  }

  addBusiness = (businessName) => {
    this.props._addBusinessToRoute(this.props.user, businessName);
  }

  removeBusiness = (businessName) => {
    this.props._removeBusinessFromRoute(this.props.user, businessName);
  }

  onSearchInputChange = (input) => {
    this.setState({
      searchInput: input
    });
  }

  render() {
    const route = this.props.routes[this.props.navigation.state.params.routeName];
    let allBusinesses = [];
    _.map(this.props.businesses, (v, k) => {
      allBusinesses.push(k);
    });

    if (this.state.searchInput && this.state.searchInput.length > 0) {
      allBusinesses = allBusinesses.filter(item => {
        const re = new RegExp(this.state.searchInput, 'i');
        return item.match(re)
      });
    }

    const businessesInRoute = [];
    _.map(route.businesses, (v, k) => businessesInRoute.push(k));

    const businessesNotInRoute = allBusinesses.filter(item => businessesInRoute.indexOf(item) === -1);
    const businessesInSession = [];

    _.map(_.get(this.props.session, 'route.businesses', []), (v, k) => {
      businessesInSession.push(k);
    });

    return (
      <ScrollView style={[cs.container, { backgroundColor: '#fff' }]}>
        <Toolbar backButtonTitle="Route"
          title="Modify Route"
          dispatch={this.props.navigation.dispatch} />

        <TextInput 
          ref={el => this.searchInput = el } 
          style={{ margin: leftMargin }} 
          placeholder='Search business...' 
          onChangeText={input => this.onSearchInputChange(input)}
        />

        <ListView
          dataSource={this.ds.cloneWithRows(allBusinesses)}
          renderHeader={() =>
            <View style={{marginBottom: 12}}>
              <Text style={[cs.h3, { margin: leftMargin, textAlign: 'center' }]}>Existing businesses in</Text>
              <Text style={[cs.h2, { fontWeight: 'bold', textAlign: 'center' }]}>{route.name}</Text>
            </View>
          }
          renderRow={(item, sectionId, rowId) => {
            const bgColor = rowId % 2 === 0 ? '#fff' : '#f2f2f2';
            const addBusinessEnabled = businessesInRoute.indexOf(item) > 0 ? false : businessesInSession.indexOf(item) > -1 ? false: true;
            const removeBusinessEnabled = businessesInRoute.indexOf(item) > 0 ? false : businessesInSession.indexOf(item) > -1 ? true: false;

            return (
              <View style={{ flexDirection: 'row', backgroundColor: bgColor, padding: 2, 
              marginLeft: leftMargin, alignItems: 'center'}}>
                <Text style={[cs.h3, {flex: 1}]}>{item}</Text>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
                  <Button onPress={() => this.addBusiness(item)} style={{ marginRight: 12 }} disabled={!addBusinessEnabled}>
                    <Text>Add</Text>
                  </Button>
                  <Button onPress={() => this.removeBusiness(item)} disabled={!removeBusinessEnabled}>
                    <Text>Remove</Text>
                  </Button>
                </View>
              </View>
            )
          }}
          style={{ flex: 1, marginBottom: 84}}
        />

        <Button onPress={this.back} style={cs.fabBtn}>
          <Text>Done</Text>
        </Button>
      </ScrollView>
    )
  }
}
