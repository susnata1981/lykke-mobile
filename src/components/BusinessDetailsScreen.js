import React, { Component } from 'react';
import {
  Alert,
  Platform,
  Linking,
  Animated,
  Keyboard,
  StyleSheet,
  View,
  KeyboardAvoidingView,
  ListView,
  FlatList,
  ScrollView,
  TouchableHighlight
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import { StyleProvider, getTheme } from 'native-base';
import cs, { fabButtonMargin, secondaryTextColor, defaultMargin, primaryColor, primaryColorDark, primaryColorLight, solidTextColor, whiteTextColor, accentColor } from './styles';
import Toolbar from './Toolbar';
import {
  Button,
  Text,
  Title,
  Icon,
  List,
  ListItem,
  Input,
  Card,
  CardItem,
  Body,
  Item,
} from 'native-base';
import { formatCurrency, isToday } from '../util';
import { CHECKIN_COMPLETE } from '../common/constants';
import moment from 'moment';
import _ from 'lodash';

export default class BusinessDetailsScreen extends Component {

  constructor(props) {
    super(props);
    let currOrder = this.props.checkins[this.props.selectedCheckinKey].order;
    let currBusinessName = this.props.navigation.state.params.businessName;

    this.state = {
      lastCheckin: this.retrieveLastCheckinInfo(currBusinessName),
      checkins: this.initState(this.props.checkins),
      gross: 0,
      total: 0,
    }
    this.openMap = this.openMap.bind(this);
    this.business = this.props.businesses[currBusinessName];
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
  }

  componentWillReceiveProps(nextProps) {
    this.initState(nextProps.checkins);
  }

  initState(currCheckins) {
    let checkins = Object.keys(currCheckins)
      .map(key => currCheckins[key])
      .filter(item => item.businessKey === this.props.navigation.state.params.businessName);

    if (checkins.length > 0) {
      checkins.sort((c1, c2) => c2.timeCreated - c1.timeCreated);
    }

    return checkins;
  }

  retrieveLastCheckinInfo = (businessKey) => {
    let checkins = Object.keys(this.props.checkins)
      .map(key => this.props.checkins[key])
      .filter(item => item.businessKey === businessKey);

    if (checkins.length > 0) {
      checkins.sort((c1, c2) => c2.timeCreated - c1.timeCreated);
      return checkins[0];
    }

    return null;
  }

  componentDidMount() {
    this.checkin = this.props.checkins[this.props.selectedCheckinKey];
    if (this.checkin.status === CHECKIN_COMPLETE) {
      Alert.alert(
        'You have already checked into this place',
        'Are you sure you want to proceed again?',
        [
          { text: 'No', onPress: () => this.props.navigation.dispatch(NavigationActions.back()) },
          { text: 'Yes', onPress: () => { } },
        ],
        { cancelable: true }
      )
    }
  }

  next = () => {
    this.props.navigation.dispatch(NavigationActions.navigate({
      routeName: 'OrderEntry',
      params: { businessName: this.business.name }
    }));
  }

  openMap = (lat, lng) => {
    const scheme = Platform.OS === 'ios' ? 'maps:0,0?q=' : 'geo:0,0?q=';
    const latLng = `${lat},${lng}`;
    const label = 'Custom Label';
    const url = Platform.OS === 'ios' ? `${scheme}${label}@${latLng}` : `${scheme}${latLng}(${label})`;
    Linking.openURL(url);
  }

  getOrderItem = () => {
    let items = [];
    _.map(this.state.currentCheckin.order.items, (v, k) => {
      items.push({
        name: k,
        quantity: v
      });
    });

    return items;
  }

  showDetails = (checkin) => {
    this.props.navigation.dispatch(NavigationActions.navigate({
      routeName: 'PastOrderDetailsStack',
      params: { checkin: checkin }
    }));
  }

  render() {
    let checkins = Object.keys(this.props.checkins)
      .map(key => this.props.checkins[key])
      .filter(item => item.businessKey === this.business.name && item.key !== this.props.selectedCheckinKey);

    if (checkins.length > 0) {
      checkins.sort((c1, c2) => c2.timeCreated - c1.timeCreated);
    }

    return (
      <View style={cs.container}>
        <ScrollView>
          <Toolbar backButtonTitle="Routes"
            title="Business Details"
            backButtonTitle="Route"
            dispatch={this.props.navigation.dispatch} />

          <View style={[cs.row, { justifyContent: 'center', alignItems: 'center', marginTop: defaultMargin }]}>
            <Text style={[{ color: accentColor }, cs.h1]}>{this.business.name}</Text>
            <TouchableHighlight onPress={() => this.openMap(this.business.lat, this.business.lng)}>
              <StyleProvider style={getTheme({ iconFamily: "MaterialCommunityIcons" })}>
                <Icon name="google-maps" onPress={() => this.openMap(this.business.lat, this.business.lng)} style={styles.mapIcon} />
              </StyleProvider>
            </TouchableHighlight>
          </View>

          <View style={{ marginLeft: 4 }}>
            <View style={cs.row}>
              <Text style={[cs.rowItem, cs.h4, { flex: 1, color: secondaryTextColor }]}>Outstanding Balance</Text>
              <Text style={[cs.rowItem, cs.h3, { flex: 2 }]}>{formatCurrency(_.get(this.business, 'outstandingBalance', 0))}</Text>
            </View>

            <Text style={[cs.h4, {color: secondaryTextColor }]}>Past checkins</Text>
            {checkins.length === 0 && <Text style={cs.h3}>You have not checked into this store before</Text>}

            {checkins.length > 0 && <ListView
              style={[cs.container, { padding: 12 }]}
              dataSource={this.ds.cloneWithRows(checkins)}
              renderRow={item => {
                return (
                  <TouchableHighlight onPress={() => this.showDetails(item)}>
                    <View style={[cs.row, { flex: 1, justifyContent: 'space-around', marginBottom: 8, padding: 8 }]}>
                      <Text style={[styles.col, { flex: 1 }]}>{moment(item.timeCreated).format('DD/MM/YYYY')}</Text>
                      <Text style={[styles.col, { flex: 1 }]}>{formatCurrency(_.get(item, 'order.total', 0))}</Text>
                      <Text style={[styles.col, { flex: 1 }]}>{formatCurrency(_.get(item, 'payment.amount', 0))}</Text>
                    </View>
                  </TouchableHighlight>
                )
              }}

              renderHeader={() => (
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around' }}>
                  <Text style={[styles.headerCol, { flex: 1 }]}>Date</Text>
                  <Text style={[styles.headerCol, { flex: 1 }]}>Order</Text>
                  <Text style={[styles.headerCol, { flex: 1 }]}>Payment</Text>
                </View>
              )}
            />
            }
          </View>
        </ScrollView>
        <Button onPress={() => this.next()} style={styles.submitButton}>
          <Text>Next</Text>
        </Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: defaultMargin,
  },
  businessInfo: {
    alignItems: 'center',
  },
  rightAlignedBox: {
    flex: 1,
    alignSelf: 'flex-end',
    marginRight: defaultMargin,
  },
  col: {
    flex: 1,
    fontSize: 18,
    fontFamily: 'Roboto',
    textAlign: 'center',
  },
  headerCol: {
    flex: 1,
    fontFamily: 'Roboto',
    fontSize: 20,
    borderBottomColor: accentColor,
    borderBottomWidth: 1,
    marginRight: 8,
    padding: 4,
    textAlign: 'center',
  },
  submitButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    margin: fabButtonMargin,
    backgroundColor: accentColor,
  },
  mapIcon: {
    marginLeft: 8,
    fontSize: 24,
    color: primaryColor,
  }
});