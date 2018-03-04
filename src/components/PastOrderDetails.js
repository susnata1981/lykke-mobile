import React, { Component } from 'react';
import {
  ListView,
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Toolbar from './Toolbar';
import PropTypes from 'prop-types';
import cs, { primaryColor, whiteTextColor, primaryColorDark, primaryColorLight, primaryTextColor } from './styles';
import { formatCurrency } from '../util';

export default class PastOrderDetails extends Component {
  static propTypes = {
    checkin: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    console.log(this.props);
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

    this.checkin = this.props.navigation.state.params.checkin;
    this.items = [];
    _.map(this.checkin.order.items, (v, k) => {
      this.items.push({
        name: k,
        quantity: v
      });
    });
  }

  render() {
    return (
      <ScrollView style={cs.container}>
        <Toolbar
          title="Order Details"
          backButtonTitle="Business"
          dispatch={this.props.navigation.dispatch} />

        <View style={cs.row}>
          <Text style={[cs.rowItem, cs.h3]}>Visited On</Text>
          <Text style={[cs.rowItem, cs.h3, cs.bold, { flex: 2 }]}>
            {new Date(this.checkin.timeCreated).toDateString()}
          </Text>
        </View>

        <View style={cs.row}>
          <Text style={[cs.rowItem, cs.h3]}>Last Order</Text>
          <Text style={[cs.rowItem, cs.h3, cs.bold, { flex: 2 }]}>
            {formatCurrency(this.checkin.order.total)}
          </Text>
        </View>

        <View style={styles.container}>
          <ListView
            dataSource={this.ds.cloneWithRows(this.items)}
            renderRow={item => {
              return (
                <View style={styles.container}>
                  <Text style={styles.col}>{item.name}</Text>
                  <Text style={styles.col}>{item.quantity}</Text>
                </View>
              )
            }}
            renderHeader={() => (
              <View style={styles.headerContainer}>
                <Text style={styles.colHeader}>Name</Text>
                <Text style={styles.colHeader}>Quantity</Text>
              </View>
            )}
          />
        </View>
      </ScrollView>
    )
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    margin: 12,
    justifyContent: 'center',
  },
  headerContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    backgroundColor: primaryColorLight,
    padding: 8,
  },
  colHeader: {
    flex: 1,
    marginLeft: 12,
    fontWeight: 'bold',
    fontSize: 22,
    color: whiteTextColor,
    textAlign: 'center',
  },
  col: {
    flex: 1,
    fontSize: 22,
    textAlign: 'center', 
    color: primaryTextColor,
    backgroundColor: '#ddd',
    margin: 8,
  }
})