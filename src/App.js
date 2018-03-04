import { Provider, connect } from 'react-redux';
import React, { Component } from 'react';
import { Platform, BackHandler } from 'react-native';
import store from './store/index';
import { StackNavigator, addNavigationHelpers, NavigationActions } from 'react-navigation';
import { AppNavigator } from './config/Routes'
import PropTypes from 'prop-types';
import * as Types from './actions/types';
import { Root } from "native-base";


// const navReducer = (state, action) => {
//   let newState = AppNavigator.router.getStateForAction(action, state);
//   return newState || state;
// }


class AppWithNavigationState extends Component {
  componentWillMount = () => {
    if (Platform.OS !== 'android') return;
    BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
  }

  componentWillUnmount = () => {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
  }

  onBackPress = () => {
    let { dispatch, nav } = this.props;
    console.log('handling back');
    console.log(this.props);

    dispatch(NavigationActions.back());
    return true;
  }

  render() {
    return (
      <Root>
        <AppNavigator
          ref={nav => { this.navigator = nav }}
          navigation={addNavigationHelpers({
            dispatch: this.props.dispatch,
            state: this.props.nav,
          })}
        />
      </Root>
    )
  }
}

AppWithNavigationState.propTypes = {
  dispatch: PropTypes.func.isRequired,
  nav: PropTypes.object.isRequired,
};

mapStateToProps = (state) => ({
  nav: state.navigationState,
})
const AppWithState = connect(mapStateToProps)(AppWithNavigationState);
// export const store = configureStore(navReducer);

console.disableYellowBox = true;

export default class App extends Component {
  render() {
    console.ignoredYellowBox = [
      'Setting a timer'
  ]
  
    return (
      <Provider store={store}>
        <AppWithState />
      </Provider>
    )
  }
}
