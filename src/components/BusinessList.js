import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Container, Header, Left, Right, Title, Content, Button, Text, Body } from 'native-base';
import PropTypes from 'prop-types';
import firebase from '../firebase';

export default class BusinessList extends Component {
  state = {
    businesses: {},
  }

  static propTypes = {
    // businesses: PropTypes.object.isRequired,
    fetchBuisnessList: PropTypes.func.isRequired,
    // logout: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    console.log('BusinessList ' + JSON.stringify(this.props));
    // firebase.auth()
    // .createUserWithEmailAndPassword('susnata@gmail.com', '11111111')
    // .catch(error => {
    //   console.log('Error creating user '+JSON.stringify(error));
    // });
  }

  componentDidMount = () => {
    console.log('business list component mounted');
    this.setState({
      businesses: this.props.businesses
    });
    this.props.fetchBuisnessList();
  }

  componentWillReceiveProps = (nextProps) => {
    console.log('will receive props ' + JSON.stringify(nextProps));
    this.setState({
      businesses: nextProps.businesses
    }, () => {
      // console.log('SetState finished ' + JSON.stringify(this.state));
    });
  }

  render() {
    return (
      <Container>
        <Header>
          <Left>
            <Title>Header</Title>
          </Left>
          <Body>
          </Body>
          <Right />
        </Header>
        <Content>
          {this.props.user.email &&
            <Text style={styles.header}>Account {this.props.user.email} </Text>
          }
          <Text style={styles.header}>Rendering Business List</Text>
          {this.state.businesses && Object.keys(this.state.businesses).map(key => {
            return (
              <View key={key} style={styles.item}>
                <Text>{key}</Text>
                <Text>{this.state.businesses[key].address}</Text>
              </View>
            )
          })
          }

          <Button bordered light onPress={this.props.logout}><Text>Logout</Text></Button>
        </Content>
      </Container>
    )
  }
};

const styles = StyleSheet.create({
  header: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  item: {
    padding: 8,
    backgroundColor: '#ddd',
  }
});