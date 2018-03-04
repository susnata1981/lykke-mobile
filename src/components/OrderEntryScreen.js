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
  ScrollView,
  TouchableHighlight
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import { StyleProvider, getTheme } from 'native-base';
import cs, { defaultMargin, primaryColor, primaryColorDark, primaryColorLight, solidTextColor, accentColor } from './styles';
import { getDateObject, isInteger, isInt, formatCurrency, isToday } from '../util';
import Toolbar from './Toolbar';
import OrderItem from './OrderItem';
import {
  H1,
  H2,
  H3,
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
import { CHECKIN_COMPLETE } from '../common/constants';


export default class OrderEntryScreen extends Component {

  constructor(props) {
    super(props);
    let currOrder = this.props.checkins[this.props.selectedCheckinKey].order;
    let currBusinessName = this.props.navigation.state.params.businessName;
    if (!currOrder) {
      currOrder = {
        items: {},
        gross: 0,
        total: 0,
      }
    }
    this.state = {
      itemmaster: this.props.itemmaster || {},
      currentOrder: currOrder,
      lastCheckin: this.retrieveLastCheckinInfo(currBusinessName),
      gross: 0,
      total: 0,
    }

    this.next = this.next.bind(this);
    this.back = this.back.bind(this);
    this.openMap = this.openMap.bind(this);
    this.business = this.props.businesses[currBusinessName];
    this.keyboardHeight = new Animated.Value(0);
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    // TODO: Read this from config.
    this.GAT = .09;
  }

  retrieveLastCheckinInfo = (businessName) => {
    let allCheckins = Object.keys(this.props.checkins).map(key => this.props.checkins[key]);
    let filteredCheckins = allCheckins.filter(item => item.businessKey === businessName
      && !isToday(item.timeCreated) && item.status === CHECKIN_COMPLETE);
    if (filteredCheckins.length > 0) {
      filteredCheckins.sort((c1, c2) => c2.timeCreated - c1.timeCreated);
      return filteredCheckins[0]
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
    this.props._getItemMaster();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.itemmaster) {
      this.setState({ itemmaster: nextProps.itemmaster });
    }
  }

  componentWillMount() {
    this.keyboardWillShowStub = Keyboard.addListener('keyboardDidShow', this.keyboardWillShow);
    this.keyboardWillHideStub = Keyboard.addListener('keyboardDidHide', this.keyboardWillHide);
  }

  componentWillUnmount() {
    this.keyboardWillShowStub.remove();
    this.keyboardWillHideStub.remove();
  }

  keyboardWillShow = event => {
    this.setState({
      isEditing: true
    });
  }

  keyboardWillHide = event => {
    this.setState({
      isEditing: false
    });
  }

  computeGross = (order) => {
    if (Object.keys(this.state.itemmaster).length == 0) {
      return 0;
    }

    let sum = 0;
    Object.keys(order.items).map(key => {
      let price = parseFloat(this.state.itemmaster[key].price);
      let quantity = parseInt(order.items[key]);
      sum = sum + parseFloat(this.state.itemmaster[key].price) * parseInt(order.items[key]);
    });
    return sum;
  }

  computeTotal = (gross) => {
    if (gross < 0) {
      throw `Invalid gross amount ${gross}`;
    }

    return (1 + this.GAT) * gross;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.itemmaster) {
      this.setState({
        itemmaster: nextProps.itemmaster
      });
    }
  }

  calculateTax = (gross) => {
    return this.GAT * gross;
  }

  next() {
    Object.keys(this.state.itemmaster).forEach(item => {
      if (!this.state.currentOrder.items[item]) {
        this.state.currentOrder.items[item] = 0;
      }
    });

    let checkin = this.props.checkins[this.props.selectedCheckinKey];
    if (checkin.order && Object.keys(checkin.order).length > 0) {
      let newItemCounts = {};
      Object.keys(this.props.itemmaster).map(key => {
        let delta = parseInt(checkin.order.items[key]) - parseInt(this.state.currentOrder.items[key]);
        if (delta != 0) {
          newItemCounts[key] = {
            quantity: this.props.itemmaster[key].quantity + delta,
          }
        }
      });
      this.props._saveOrder(this.props.selectedCheckinKey, this.state.currentOrder, newItemCounts);
    } else {
      let newItemCounts = {};
      Object.keys(this.props.itemmaster).map(key => {
        newItemCounts[key] = {
          quantity: this.props.itemmaster[key].quantity - parseInt(this.state.currentOrder.items[key]),
        }
      });
      this.props._saveOrder(this.props.selectedCheckinKey, this.state.currentOrder, newItemCounts);
    }

    this.props.navigation.dispatch(NavigationActions.navigate({
      routeName: 'Payment',
      params: { businessName: this.business.name }
    }));
  }

  back() {
    this.props.navigation.dispatch(NavigationActions.back());
  }

  openMap = (lat, lng) => {
    const scheme = Platform.OS === 'ios' ? 'maps:0,0?q=' : 'geo:0,0?q=';
    const latLng = `${lat},${lng}`;
    const label = 'Custom Label';
    const url = Platform.OS === 'ios' ? `${scheme}${label}@${latLng}` : `${scheme}${latLng}(${label})`;
    Linking.openURL(url);
  }

  updateOrder = (item, quantity) => {
    if (!isInt(quantity)) {
      throw `Invalid quantity - ${quantity}`;
    }
    this.setState((prevState) => {
      let co = { ...prevState.currentOrder };
      co.items[item] = quantity;
      co.gross = this.computeGross(co);
      console.log(co);
      co.total = this.computeTotal(this.computeGross(co));

      return {
        itemmaster: prevState.itemmaster,
        currentOrder: co,
      }
    });
  }

  render() {
    const inventoryItems = Object.keys(this.state.itemmaster).map(item => {
      return {
        name: item,
        quantity: this.props.itemmaster[item].quantity,
        price: this.props.itemmaster[item].price,
      };
    });

    return (
      <KeyboardAvoidingView style={{ flex: 1 }}>
        <ScrollView>
        <Toolbar backButtonTitle="Routes"
            title="Order Entry"
            backButtonTitle="Details"
            dispatch={this.props.navigation.dispatch} />
          <View style={{ flex: 1}}>
            <ListView dataSource={this.ds.cloneWithRows(inventoryItems)}
              renderHeader={() =>
                <View style={[cs.row, { margin: defaultMargin }]}>
                  <Text style={styles.header}>
                    Name
                      </Text>
                  <Text style={styles.header}>
                    Remaining
                      </Text>
                  <Text style={styles.header}>
                    Order
                      </Text>
                </View>
              }

              renderRow={item =>
                <OrderItem
                  item={item}
                  updateOrder={this.updateOrder}
                  remainingQuantity={item.quantity}
                  quantity={this.state.currentOrder.items[item.name] || '0'} />}
              enableEmptySections={true} />

            <View style={{margin: defaultMargin, marginTop: 24, borderTopColor: '#bbb', borderTopWidth: 1}}>
              <Text style={{ alignSelf: 'flex-end', fontSize: 20 }}>Gross: {formatCurrency(this.state.currentOrder.gross)} </Text>
              <Text style={{alignSelf: 'flex-end', fontSize: 20}}>Tax: {formatCurrency(this.calculateTax(this.state.currentOrder.gross))} </Text>
              <Text style={{ alignSelf: 'flex-end', fontSize: 20 }}>Total: {formatCurrency(this.state.currentOrder.total)} </Text>
          </View>
          </View>
        </ScrollView>
      <View>
        {!this.state.isEditing && <Button onPress={() => this.next()} 
        style={[cs.button, { position: 'absolute', right: 12, bottom: 12 }]}>
          <Text>Next</Text>
        </Button>}
      </View>
      </KeyboardAvoidingView >
    );
  }
}

const styles = StyleSheet.create({
  businessInfo: {
    alignItems: 'center',
  },
  rightAlignedBox: {
    flex: 1,
    alignSelf: 'flex-end',
    marginRight: defaultMargin,
  },
  header: {
    flex: 1,
    alignSelf: 'center',
    borderBottomColor: accentColor,
    borderBottomWidth: 2,
    marginRight: defaultMargin,
    textAlign: 'center',
    fontSize: 20,
    padding: 4,
  }
});
