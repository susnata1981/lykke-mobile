import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Container, Header, Content, H1, Button, Text } from 'native-base';
import { NavigationActions } from 'react-navigation';

export default class OrderConfirmScreen extends Component {
  
  next() {
    this.props.navigation.dispatch(NavigationActions.navigate({ routeName: 'Payment' }));
  }

  render() {
    return (
      <Container>
        <Content>
          <View style={styles.container}>
          <H1>Order Confirm</H1>
          <Button primary onPress={() => this.next()}>
            <Text>Next</Text>
          </Button>
          </View>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#aaa',
    flexDirection: 'column',
    height: 500,
    flex: 1,
    justifyContent: 'flex-end',
  }
});