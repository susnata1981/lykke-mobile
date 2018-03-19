import React, { Component } from 'react';
import { Alert, StyleSheet, View, TextInput, ToastAndroid, ScrollView, ListView } from 'react-native';
import { Container, Header, Content, H1, Button, Text, ListItem } from 'native-base';
import { NavigationActions } from 'react-navigation';
import cs, { defaultMargin, secondaryTextColor, primaryTextColor, leftMargin } from './styles';
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
      `You finished checkin into ${this.props.navigation.state.params.businessName}.`,
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
      <View style={[cs.container, {backgroundColor: '#fff'}]}>
        <Toolbar backButtonTitle="Payment"
          title="Summary"
          onBackButtonPress={this.onBackButtonPress.bind(this)}
          dispatch={this.props.navigation.dispatch} />

        <ScrollView>
          <Text style={[cs.h2, cs.underline, { margin: leftMargin, marginBottom: 2*defaultMargin, fontSize: 24}]}>
            {this.props.navigation.state.params.businessName}
          </Text>
          <View style={styles.group}>
            <Text style={[cs.h4, { flex:1, color: secondaryTextColor}]}>Checkin time</Text>
            <Text style={[cs.h4, { flex:1, color: primaryTextColor}]}>
              { moment(this.state.checkin.timeCreated).format("DD/MM/YYYY HH:MM") }
            </Text>
          </View>
          <View style={styles.group}>
            <Text style={[cs.h4, {flex:1, color: secondaryTextColor}]}>Checkout time</Text>
            <Text style={[cs.h4, {flex:1, color: primaryTextColor}]}>
            { moment(this.state.checkin.timeCompleted).format("DD/MM/YYYY HH:MM") }
            </Text>
          </View>
          <View style={styles.group}>
            <Text style={[cs.h4, { flex:1, color: secondaryTextColor}]}>Payment Received</Text>
            <Text style={[cs.h4, { flex:1, color: primaryTextColor}]}>{formatCurrency(paymentAmount)}</Text>
          </View>

          <Text style={[cs.h4, { margin:leftMargin, color: secondaryTextColor, marginTop: 24, flex:1, textAlign: 'left' }]}>Current Order Details</Text>

          <ListView dataSource={this.ds.cloneWithRows(inventoryItems)}
            renderRow={(item, sectionId, rowId) => {
              const bgColor = rowId %2 === 0? '#fff': '#f2f2f2';
              return (
                <View style={[styles.row, {flex:1, height: 70, justifyContent: 'center', alignItems: 'center', backgroundColor: bgColor, marginBottom: 4, padding: 12}]}>
                  <Text style={[cs.h4, { flex: 2 }]}>{item.name} x {item.quantity} </Text>
                  <Text style={[cs.h5, { flex: 2 }]}>@ {formatCurrency(item.price)} </Text>
                  <Text style={[cs.h4, { flex: 2 , textAlign: 'right'}]}>{formatCurrency(item.price * item.quantity)} </Text>
                </View>
              
              )
            }}
            renderHeader={
              () => 
                <View style={[styles.row, {flex:1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', margin: leftMargin, 
                borderBottomColor: '#bbb', borderBottomWidth:2}]}>
                  <Text style={[cs.h3, { flex: 1, }]}>Item (price/quantity)</Text>
                  <Text style={[cs.h3, { flex: 1, textAlign: 'right'}]}>Total Price</Text>
                </View>
            }
            enableEmptySections={true} />

          <View style={{borderBottomColor: '#bbb', borderBottomWidth: 2, flex:1, marginLeft: defaultMargin, marginRight: defaultMargin}}></View>
          <View style={{marginBottom: 84, marginTop: 24}}>
          <View style={[cs.row, {justifyContent: 'flex-end', marginRight: defaultMargin, marginTop: defaultMargin}] }>
            <Text style={[cs.h4]}>Gross:&nbsp;&nbsp;</Text>
            <Text style={[cs.h3, cs.bold]}>{ formatCurrency(this.state.checkin.order.gross) }</Text>
          </View>

          <View style={[cs.row, {justifyContent: 'flex-end', marginRight: defaultMargin, marginTop: defaultMargin}] }>
            <Text style={[cs.h4]}>Tax:&nbsp;&nbsp;</Text>
            <Text style={[cs.h3, cs.bold]}>{ formatCurrency(this.state.checkin.order.total - this.state.checkin.order.gross) }</Text>
          </View>

          <View style={[cs.row, {justifyContent: 'flex-end', marginRight: defaultMargin, marginTop: defaultMargin}] }>
            <Text style={[cs.h4]}>Total:&nbsp;&nbsp;</Text>
            <Text style={[cs.h3, cs.bold]}>{ formatCurrency(this.state.checkin.order.total) }</Text>
          </View> 
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
  group: {
    flexDirection: 'row',
    marginLeft: leftMargin,
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