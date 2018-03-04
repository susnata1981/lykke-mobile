import React, { Component } from 'react';
import { Alert, StyleSheet, View, TextInput, ToastAndroid, ScrollView, ListView } from 'react-native';
import { Container, Header, Content, H1, Button, Text, ListItem } from 'native-base';
import { NavigationActions } from 'react-navigation';
import cs, { defaultMargin, secondaryTextColor, primaryTextColor } from './styles';
import Toolbar from './Toolbar';
import { formatCurrency } from '../util'
import moment from 'moment';

export default class CheckoutScreen extends Component {

  constructor(props) {
    super(props);
    this.business = this.props.businesses[this.props.navigation.state.params.businessName];
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      checkin: this.props.checkins[this.props.selectedCheckinKey],
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      checkin: nextProps.checkins[nextProps.selectedCheckinKey],
    });
  }

  handleFinish() {
    this.props._completeCheckin(this.props.selectedCheckinKey);
    Alert.alert(
      'Nice job!',
      `You finished checkin into ${this.business.name}.`,
      [
        {text: 'Finish', onPress: () => this.finish()},
      ],
      { cancelable: false }
    );
  }

  finish = () => {
    const resetAction = NavigationActions.reset({
      index: 1,
      // key: null,
      actions: [
        NavigationActions.navigate({ routeName: 'Routes' }),
        NavigationActions.navigate({ routeName: 'RouteDetails' }),
      ]
    });
    this.props.navigation.dispatch(resetAction);
  }

  onBackButtonPress() {
    this.props.navigation.dispatch(NavigationActions.back());
    // this.props._refresh()
  }

  render() {
    if (!this.state.checkin.order) {
      return null;
    }

    const orderedItems = this.state.checkin.order.items;
    const inventoryItems = Object.keys(orderedItems).map(itemKey => {
      return {
        name: itemKey,
        quantity: orderedItems[itemKey],
        price: this.props.itemmaster[itemKey].price,
      };
    });

    const paymentAmount = _.get(this.state.checkin, 'payment.amount', 0);
    return (
      <View style={cs.container}>
        <Toolbar backButtonTitle="Payment"
          title="Summary"
          onBackButtonPress={this.onBackButtonPress.bind(this)}
          dispatch={this.props.navigation.dispatch} />

        <ScrollView>
          <Text style={[cs.h2, cs.underline, { margin: defaultMargin, marginBottom: 2*defaultMargin, fontSize: 24 }]}>{this.business.name}</Text>
          <View style={cs.row}>
            <Text style={[cs.h3, { marginLeft: defaultMargin, flex:1, color: secondaryTextColor}]}>Checkin time</Text>
            <Text style={[cs.h3, { marginLeft: defaultMargin, flex:1, color: primaryTextColor}]}>
              { moment(this.state.checkin.timeCreated).format("DD/MM/YYYY HH:MM") }
            </Text>
          </View>
          <View style={cs.row}>
            <Text style={[cs.h4, {marginLeft: defaultMargin, flex:1, color: secondaryTextColor}]}>Checkout time</Text>
            <Text style={[cs.h4, {marginLeft: defaultMargin, flex:1, color: primaryTextColor}]}>
            { moment(this.state.checkin.timeCompleted).format("DD/MM/YYYY HH:MM") }
            </Text>
          </View>
          <View style={cs.row}>
            <Text style={[cs.h4, {marginLeft: defaultMargin, flex:1, color: secondaryTextColor}]}>Payment Received</Text>
            <Text style={[cs.h4, {marginLeft: defaultMargin, flex:1, color: primaryTextColor}]}>{paymentAmount}</Text>
          </View>

          <Text style={[cs.h3, { margin:defaultMargin, marginTop: 24 }, cs.underline]}>Current Order Details</Text>

          <ListView dataSource={this.ds.cloneWithRows(inventoryItems)}
            renderRow={item =>
              (<ListItem>
                <View style={styles.row}>
                  <Text style={[cs.h4, { flex: 2 }]}>{item.name} x {item.quantity} </Text>
                  <Text style={[cs.h5, { flex: 2 }]}>@ {formatCurrency(item.price)} </Text>
                  <Text style={[cs.h4, { flex: 2 , textAlign: 'right'}]}>{formatCurrency(item.price * item.quantity)} </Text>
                </View>
              </ListItem>)}
            enableEmptySections={true} />

          <View style={{borderBottomColor: '#bbb', borderBottomWidth: 2, flex:1, marginLeft: defaultMargin, marginRight: defaultMargin}}></View>
          <View style={[cs.row, {justifyContent: 'flex-end', marginRight: defaultMargin, marginTop: defaultMargin}] }>
            <Text style={[cs.h4]}>Gross:&nbsp;&nbsp;</Text>
            <Text style={[cs.h4]}>{ formatCurrency(this.state.checkin.order.gross) }</Text>
          </View>

          <View style={[cs.row, {justifyContent: 'flex-end', marginRight: defaultMargin, marginTop: defaultMargin}] }>
            <Text style={[cs.h4]}>Tax:&nbsp;&nbsp;</Text>
            <Text style={cs.h4}>{ formatCurrency(this.state.checkin.order.total - this.state.checkin.order.gross) }</Text>
          </View>

          <View style={[cs.row, {justifyContent: 'flex-end', marginRight: defaultMargin, marginTop: defaultMargin}] }>
            <Text style={[cs.h4]}>Total:&nbsp;&nbsp;</Text>
            <Text style={[cs.h4]}>{ formatCurrency(this.state.checkin.order.total) }</Text>
          </View> 
        </ScrollView>
        <View style={{position: 'absolute', bottom: 0, right: 0, margin: defaultMargin}}>
          <Button style={cs.button} onPress={() => this.handleFinish()}>
            <Text>Finish</Text>
          </Button>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputMedium: {
    width: 300,
  },
  row: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between'
  }
});