import React, { Component } from 'react';
import { Container, Content, Title } from 'native-base';
import SideBar from './SideBar';

export default class StatsScreen extends Component {
  render() {
    return (
      <Container>
        <Content>
          <Title>Personal Statistics</Title>
        </Content>
      </Container>
    );
  }
}