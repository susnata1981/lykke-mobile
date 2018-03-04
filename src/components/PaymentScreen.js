import React, { Component } from 'react';
import { Alert, StyleSheet, View, TextInput, ToastAndroid, KeyboardAvoidingView, Keyboard } from 'react-native';
import { Container, Header, Content, H3, Button, Text } from 'native-base';
import { NavigationActions } from 'react-navigation';
import cs, { defaultMargin, primaryColorDark, secondaryTextColor } from './styles';
import { isFloat, isInteger, formatCurrency } from '../util';
import Toolbar from './Toolbar';
import { CHECKIN_COMPLETE, CHECKIN_INCOMPLETE } from '../common/constants';
import { isNumber } from '../util'

export default class PaymentScreen extends Component {

  constructor(props) {
    super(props);
    this.businessName = this.props.navigation.state.params.businessName;
    this.business = this.props.businesses[this.businessName];
    let checkin = this.props.checkins[this.props.selectedCheckinKey];
    this.state = {
      paymentAmount: checkin.payment ? checkin.payment.amount : 0,
      checkin: checkin,
      lastCheckin: this.retrieveLastCheckinInfo(),
      isEditing: false,
    };
  }

  componentWillMount() {
    this.keyboardWillShowStub = Keyboard.addListener('keyboardDidShow', this.keyboardWillShow);
    this.keyboardWillHideStub = Keyboard.addListener('keyboardDidHide', this.keyboardWillHide);
  }

  componentWillUnmount() {
    this.keyboardWillShowStub.remove();
    this.keyboardWillHideStub.remove();
  }

  keyboardWillShow = () => {
    this.setState({
      isEditing: true
    });
  }
  
  keyboardWillHide = () => {
    this.setState({
      isEditing: false
    });
  }

  retrieveLastCheckinInfo = () => {
    let allCheckins = Object.keys(this.props.checkins).map(key => this.props.checkins[key]);
    let filteredCheckins = allCheckins.filter(item => item.businessKey == this.businessName);
    if (filteredCheckins.length > 0) {
      filteredCheckins.sort((c1, c2) => c2.timeCreated - c1.timeCreated);
      return filteredCheckins[0]
    }
    return null;
  }

  next = () => {
    this.props._updatePayment(this.props.selectedCheckinKey, this.state.paymentAmount);
    this.props.navigation.dispatch(NavigationActions.navigate(
      { routeName: 'Checkout', params: { businessName: this.businessName } })
    );
  }

  componentWillReceiveProps(nextProps) {
    let newCheckin = nextProps.checkins[nextProps.selectedCheckinKey];

    this.setState({
      paymentAmount: newCheckin.payment ? newCheckin.payment.amount : 0,
      checkin: newCheckin,
    });
    this.paymentInput.setNativeProps({ text: newCheckin.payment ? newCheckin.payment.amount.toString() : '0' });
  }


  handleConfirmPayment = () => {
    let amount = parseFloat(this.state.paymentAmount);
    if (!isNumber(amount)) {
      ToastAndroid.show(`Payment ${amount} must be a number`, ToastAndroid.SHORT);
      return;
    }

    this.props._updatePayment(this.props.selectedCheckinKey, parseFloat(this.state.paymentAmount));
    this.paymentInput.clear();
    ToastAndroid.show('Payment has been updated', ToastAndroid.SHORT);
    setImmediate(() => {
      this.props.navigation.dispatch(NavigationActions.navigate(
        { routeName: 'Checkout', params: { businessName: this.businessName } })
      );
    });
  }

  handlePayment = () => {
    try {
      let input = this.paymentInput._lastNativeText;
      if (input === undefined) {
        Alert.alert('Payment must be provided');
        return;
      }

      let val = parseFloat(input);
      if (val.toString() != input || !isNumber(val) || val < 0) {
        Alert.alert(`Payment amount (${val}) must be a valid number`);
        this.setState({paymentAmount: '0'});
        return;
      }

      this.setState({paymentAmount: val});
    } catch (err) {
      Alert.alert(`Must provide a valid amount ${this.paymentInput._lastNativeText}`);
    }
  }

  render() {
    return (
      <KeyboardAvoidingView style={{flex:1}}>
        <View>
          <Toolbar 
            backButtonTitle="Order"
            title="Payment"
            dispatch={this.props.navigation.dispatch} />

          <View style={cs.row}>
            <Text style={{flex:1, fontSize: 18, margin: 6, marginLeft: 12, color: secondaryTextColor}}>Outstanding Balance</Text>
            <Text style={{flex:1, fontSize: 20, margin: 6, marginLeft: 12}}>{formatCurrency(this.business.outstandingBalance)}</Text>
          </View>

          <View style={cs.row}>
            <Text style={{flex:1, fontSize: 18, margin: 6, marginLeft: 12, color: secondaryTextColor}}>Last Payment</Text>
            <Text style={{flex:1, fontSize: 20, margin: 6, marginLeft: 12}}>{this.state.lastCheckin ? formatCurrency(this.state.lastCheckin.order.total) : 'NA'}</Text>
          </View>

          <View style={cs.row}>
            <Text style={{flex:1, fontSize: 18, margin: 6, marginLeft: 12, color: secondaryTextColor}}>Last Payment Received</Text>
            <Text style={{flex:1, fontSize: 20, margin: 6, marginLeft: 12,}}>{this.state.lastCheckin ? new Date(this.state.lastCheckin.timeCreated).toDateString() : 'NA'}</Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: defaultMargin, marginTop: 36}}>
            <Text style={{flex: 1, fontSize: 18}}>Enter Payment Amount</Text>
            <TextInput
              ref={ref => this.paymentInput = ref}
              onChangeText={(amount) => {
                this.setState({ paymentAmount: amount })
              }}
              value={this.state.paymentAmount.toString()}
              onBlur={this.handlePayment}
              keyboardType="numeric"
              placeholder="amount"
              defaultValue={this.state.paymentAmount.toString()}
              style={{flex: 1, fontSize: 28, margin: 12, textAlign: 'center'}}
              underlineColorAndroid={primaryColorDark}
            />
          </View>
        </View>
        <View style={{position: 'absolute', right: 0, bottom: 0, margin: 12}}>
        {!this.state.isEditing && <Button style={cs.button} onPress={() => this.handleConfirmPayment()}>
          <Text>Next</Text>
        </Button>}
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee',
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'flex-start',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 16,
    marginTop: 16,
  },
  rowItem: {
    marginBottom: 24,
  },
  fabBtn: {
    alignSelf: 'flex-end',
    marginRight: 24,
  }
});