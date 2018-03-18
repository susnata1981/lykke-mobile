import React, { Component } from 'react';
import { Alert, View, StyleSheet, TextInput, ToastAndroid } from 'react-native';
import PropTypes from 'prop-types';
import { isInt, formatCurrency } from '../util';
import cs from './styles';

import {
  List,
  ListItem,
  Text,
  Item,
  InputGroup,
  Input,
  Icon,
} from 'native-base';

export default class OrderItem extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    quantity: PropTypes.string.isRequired,
  }

  handleInput = () => {
    try {
      let input = this.quantityInput._lastNativeText;
      if (input === undefined) {
        Alert.alert('Quantity must be provided');
        return;
      }

      let val = parseInt(input);
      if (val.toString() != input || !isInt(val) || val < 0) {
        Alert.alert(`Quantity (${val}) must be a valid number`);
        this.quantityInput.setNativeProps({text: '0'});
        return;
      }

      if (val > this.props.remainingQuantity) {
        Alert.alert(`Quantity ${val} is more than remaining quantity ${this.props.remainingQuantity}`);
      }
      this.props.updateOrder(this.props.item.name, val);
      this.quantityInput.setNativeProps({text: input});
    } catch (err) {
      console.log(err);
      Alert.alert(`Must provide a valid quantity ${this.quantityInput._lastNativeText}`);
    }
  }

  render() {
    const bgColor = this.props.index % 2 === 0? '#fff' : '#f2f2f2';
    
    return (
      <View style={[cs.row, {backgroundColor: bgColor}]}>
        <Text style={[cs.rowItem, cs.h3, cs.contentCenter, {flex:2}]}>
          {this.props.item.name}
          <Text style={cs.h5}> @ {formatCurrency(this.props.item.price)}</Text>
        </Text>

        <Text style={[cs.rowItem, cs.h3, cs.contentCenter, {flex:1}]}>
          {this.props.remainingQuantity}
        </Text>

        <TextInput
          ref={elem => (this.quantityInput = elem)}
          style={[cs.rowItem, cs.h1, cs.contentCenter, {flex:1}]}
          keyboardType="numeric"
          placeholder='quantity'
          defaultValue={this.props.quantity ? this.props.quantity.toString() : '0'}
          onBlur={this.handleInput} />

      </View>
    )
  }
};
