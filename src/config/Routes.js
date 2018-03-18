import React from 'react';
import { StackNavigator, DrawerNavigator, TabNavigator } from 'react-navigation';
import { StyleSheet } from 'react-native';
import RouteListContainer from '../components/containers/RouteListContainer';
import LoginContainer from '../components/containers/LoginContainer'
import StatsContainer from '../components/containers/StatsContainer';
import RouteDetailsContainer from '../components/containers/RouteDetailsContainer';
import MoidfyRouteContainer from '../components/containers/ModifyRouteContainer';
import RouteStartContainer from '../components/containers/RouteStartContainer';
import BusinessDetailsContainer from '../components/containers/BusinessDetailsContainer';
import OrderEntryContainer from '../components/containers/OrderEntryContainer';
import OrderConfirmContainer from '../components/containers/OrderConfirmContainer';
import PaymentContainer from '../components/containers/PaymentContainer';
import CheckoutContainer from '../components/containers/CheckoutContainer';
import PastOrderDetails from '../components/PastOrderDetails';

import SideBar from '../components/SideBar';
import { Text, Title, Button, Icon } from 'native-base';
import {
  primaryColor
} from '../components/styles';

const DrawerStack = StackNavigator({
  Routes: {
    screen: RouteListContainer,
    navigationOptions: {
      title: 'Route List',
    }
  },
  RouteStart: {
    screen: RouteStartContainer,
    navigationOptions: {
      title: 'Start',
    }
  },
  RouteDetails: {
    screen: RouteDetailsContainer,
    navigationOptions: {
      title: 'Route Details',
    }
  },
  ModifyRoute: {
    screen: MoidfyRouteContainer,
    navigationOptions: {
      title: 'Modify Route',
    }
  },
  BusinessDetails: {
    screen: BusinessDetailsContainer,
    navigationOptions: {
      title: 'Business Details',
    }
  },
  OrderEntry: {
    screen: OrderEntryContainer,
    navigationOptions: {
      title: 'Order Entry',
    }
  },
  OrderConfirm: {
    screen: OrderConfirmContainer,
    navigationOptions: {
      title: 'Order Confirm',
    }
  },
  Payment: {
    screen: PaymentContainer,
    navigationOptions: {
      title: 'Payment',
    }
  },
  Checkout: {
    screen: CheckoutContainer,
    navigationOptions: {
      title: 'Checkout',
    }
  },
  Stats: {
    screen: StatsContainer,
    navigationOptions: {
      title: 'Personal Stats',
    }
  },
},
  {
    headerMode: 'none',
    initialRouteName: 'RouteStart',
  }
);

const PastOrderDetailsStack = StackNavigator({
  PastOrderDetails: {
    screen: PastOrderDetails,
    navigationOptions: {
      title: 'Order Details',
    }
  }
},
{
  headerMode: 'none',
  initialRouteName: 'PastOrderDetails',
});

const DrawerNavigation = DrawerNavigator({
  DrawerStack: { screen: DrawerStack },
},
  {
    headerMode: 'float',
    drawerWidth: 300,
    contentOptions: {
      activeTintColor: "#e91e63"
    },
    navigationOptions: ({ navigation }) => ({
      headerStyle: { backgroundColor: primaryColor },
      gesturesEnabled: false,
      headerLeft:
        <Icon name='menu' style={styles.navButton} onPress={() => {
          navigation.navigate('DrawerToggle');
        }} />
    }),
    contentComponent: props => <SideBar {...props} />
  }
);

const styles = StyleSheet.create({
  navButton: {
    padding: 8,
  }
})

const LoginNavigation = StackNavigator({
  Login: {
    screen: LoginContainer,
  }
},
  {
    headerMode: 'none',
  }
);

export const AppNavigator = StackNavigator(
  {
    LoginStack: { screen: LoginNavigation },
    DrawerStack: { screen: DrawerNavigation },
    PastOrderDetailsStack: { screen: PastOrderDetailsStack }
  },
  {
    initialRouteName: "LoginStack",
    headerMode: "none",
  }
);

// const defaultGetStateForAction = AppNavigator.router.getStateForAction;
// AppNavigator.router.getStateForAction = (action, state) => {            
//   console.log(action);
//   console.log(state)
//   if (state && action.type === 'GoToRoute') {           
//       let index = state.routes.findIndex((item) => {
//           return item.routeName === action.routeName
//       });
//       const routes = state.routes.slice(0, index+1);
//       return {
//           routes,
//           index
//       };    
//   }       
//   return defaultGetStateForAction(action, state);
// };
