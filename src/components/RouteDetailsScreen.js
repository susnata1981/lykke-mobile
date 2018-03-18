import React, { Component } from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  View,
  ToolbarAndroid,
  ScrollView,
  Linking,
  Platform,
  PanResponder,
  TouchableNativeFeedback,
  ListView,
  Alert
} from 'react-native';

import { Container, Header, Content, H1, Text, Icon, Button, Title, List, ListItem, StyleProvider, getTheme } from 'native-base';
import { NavigationActions } from 'react-navigation';
import Toolbar from './Toolbar';
import cs, { accentColor, primaryColorDark, secondaryColor, defaultMargin, leftMargin } from './styles';
import MapView, { Marker, LatLng } from 'react-native-maps';
import { getDateObject, isToday } from '../util';
import TabView from './common/TabView';
import { CHECKIN_STATUS, mapStatus } from '../model/status';
import { mapIndexToDay, getCurrentDay } from '../common/constants'
import moment from 'moment';

export default class RouteDetailsScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      businesses: props.businesses || {},
      checkins: props.checkins || {},
      isMapVisible: true,
    }
    this.next = this.next.bind(this);
    this.back = this.back.bind(this);
    this.openMap = this.openMap.bind(this);
    this.routeName = _.get(this.props.navigation.state.params, 'routeName', undefined) || this.props.selectedRoute;
    this.mapHeight = new Animated.Value(340);
    this.translateY = new Animated.Value(0);
    this.translationY = new Animated.Value(0);
    this.containerTranslationY = this.translationY.interpolate({
      inputRange: [-400, -200, 0, 150, 300],
      outputRange: [-200, -200, 0, 150, 150]
    });

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderGrant: (evt, gestureState) => {
      },
      onPanResponderMove: (evt, gestureState) => {
        Animated.event([
          null, {
            dy: this.translationY
          }
        ])(evt, gestureState);
      },
      onPanResponderRelease: () => {
        this.translationY.flattenOffset();
      }
    });
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
  }

  componentWillReceiveProps(nextProps) {
    if (Object.keys(nextProps.checkins).length > 0) {
      this.setState(
        {
          businesses: nextProps.businesses,
          checkins: nextProps.checkins
        });
    }
  }

  componentDidMount() {
    this.props._getBusinesses();
    this.props._getCheckins(this.props.user.key);
    this.props._getSession(this.props.user);
  }

  next(name) {
    const route = this.props.routes[this.routeName];
    const currDay = getCurrentDay();

    if (currDay.name !== route.assignment.dayOfWeek) {
      const route = this.props.routes[this.routeName];
      const currDay = getCurrentDay();

      Alert.alert(
        `You cannot start route for ${route.assignment.dayOfWeek}!`,
        `You can only checkin to businesses on ${currDay.name}'s route`,
        [
          {
            text: 'OK', onPress: () => {
              this.props.navigation.dispatch(NavigationActions.navigate(
                { routeName: 'Routes' }
              ));
            }
          },
        ],
        { cancelable: false }
      )
      return;
    }

    this.props.navigation.dispatch(NavigationActions.navigate(
      { routeName: 'BusinessDetails', params: { businessName: name } }
    ));

    this.props._createCheckin(
      name,
      this.props.user.key,
      new Date(),
    );
  }

  back() {
    this.props.navigation.dispatch(NavigationActions.back());
  }

  openMap = (lat, lng) => {
    const scheme = Platform.OS === 'ios' ? 'maps:0,0?q=' : 'geo:0,0?q=';
    const latLng = `${lat},${lng}`;
    const label = 'Custom Label';
    const url = Platform.OS === 'ios' ? `${scheme}${label}@${latLng}` : `${scheme}${latLng}(${label})`;
    Linking.openURL(url);
  }

  getCheckinStatus = (businessKey) => {
    let checkinKeys = Object.keys(this.state.checkins);
    if (checkinKeys.length > 0) {
      let filteredCheckinKeys = checkinKeys.filter(
        key => this.state.checkins[key].businessKey === businessKey
          && isToday(this.state.checkins[key].timeCreated));
      if (filteredCheckinKeys.length == 0) {
        return CHECKIN_STATUS.NOT_STARTED;
      }

      // In case we have multiple checkins.
      let filteredCheckins = filteredCheckinKeys.map(item => this.state.checkins[item]);
      filteredCheckins.sort(function (c1, c2) {
        return c2.timeCreated - c1.timeCreated
      });
      return mapStatus(filteredCheckins[0].status);
    }
    return CHECKIN_STATUS.NOT_STARTED;
  }

  toggleMap = () => {
    Animated.timing(
      this.mapHeight, {
        toValue: this.state.isMapVisible ? 0 : 460,
        duration: 600,
      }
    ).start(() => {
      this.setState({ isMapVisible: !this.state.isMapVisible });
    });
  }

  getTabTitle = (title, count) => {
    return `${title}(${count})`;
  }

  modifyRoute = () => {
    this.props.navigation.dispatch(NavigationActions.navigate({
      routeName: 'ModifyRoute', params: {
        routeName: this.routeName
      }
    }));
  }

  getStatusCount = (businesses) => {
    let completedCount = 0, incompleteCount = 0, notStartedCount = 0;

    businesses.forEach(item => {
      let status = this.getCheckinStatus(item.name);

      switch (status) {
        case CHECKIN_STATUS.COMPLETE:
          completedCount += 1;
          break;
        case CHECKIN_STATUS.INCOMPLETE:
          incompleteCount += 1;
          break;
        default:
          notStartedCount += 1;
      }
    });

    return {
      completedCount,
      incompleteCount,
      notStartedCount
    }
  }

  getCheckinsSinceYesterday = () => {
    _.filter(this.props.checkins, (v, k) => {
      let date = moment(v.timeCreated).valueOf();
      let yesterday = moment(v.timeCreated).subtract(1, 'days').valueOf();
      let today = moment().valueOf();
      return (date > yesterday && date < today) && v.status === 'INCOMPLETE';
    });
  }

  getAllBusinesses = () => {
    let businesses = [];
    const route = this.props.routes[this.routeName];

    _.map(route.businesses, (v, k) => {
      businesses.push(this.state.businesses[k]);
    });

    const userAddedBusinesses = _.get(this.props.session, 'route.businesses', {});
    _.forEach(userAddedBusinesses, (v, k) => {
      businesses.push(this.state.businesses[k]);
    });
    return businesses;
  }

  createStatusToBusinessMap = (businesses) => {
    let statusToBusinessMap = {};
    _.map(CHECKIN_STATUS, (v, k) => {
      statusToBusinessMap[v] = statusToBusinessMap[v] || [];
    });

    businesses.forEach(item => {
      let status = this.getCheckinStatus(item.name);
      statusToBusinessMap[status].push(item);
    });

    return statusToBusinessMap;
  }

  render() {
    if (_.isEmpty(this.state.businesses) || _.isEmpty(this.state.checkins)) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={cs.h3}>Loading...</Text>
        </View>
      )
    }

    const mapHeight = this.mapHeight;
    let businesses = this.getAllBusinesses();

    const statusToBusinessMap = this.createStatusToBusinessMap(businesses);
    const newCheckins = this.getCheckinsSinceYesterday();
    let { completedCount, incompleteCount, notStartedCount } = this.getStatusCount(businesses);

    return (
      <View style={cs.container}>
        <Toolbar backButtonTitle="Routes"
          title={this.routeName}
          dispatch={this.props.navigation.dispatch} />

        <View style={[styles.mapContainer, { height: Dimensions.get('window').height }]}>
          <MapView
            initialRegion={{
              latitude: 22.534599691801127,
              longitude: 88.36452757939696,
              latitudeDelta: 0.12508503188433195,
              longitudeDelta: 0.13547468930481443,
            }}
            onRegionChange={this.onRegionChange}
            style={styles.map}>
            {businesses.map(item => (
              <Marker
                key={item.name}
                coordinate={{ latitude: item.lat, longitude: item.lng }}
                title={item.name}
                description={item.address}
              />
            ))}
          </MapView>
        </View>

        {(incompleteCount + notStartedCount === 0) &&
          <View style={{ flex: 1, marginLeft: 6 }}>
            <Text style={styles.statusHeader}>Great! You've completed all checkins for the day.</Text>
          </View>
        }

        <Animated.View
          style={{
            flex: 1, position: 'absolute', left: 0, right: 0, top: 300, backgroundColor: '#fff',
            transform: [{ translateY: this.containerTranslationY }], minHeight: 560, paddingTop: 16, elevation: 10,
          }}
          {...this.panResponder.panHandlers}>
          <TabView style={{ flex: 1, backgroundColor: '#fff', }} tabs={[
            {
              title: this.getTabTitle(CHECKIN_STATUS.COMPLETE, completedCount),
              component: this.createRouteListComponent(),
              args: {
                businesses: statusToBusinessMap[CHECKIN_STATUS.COMPLETE],
                openMap: this.openMap,
                next: this.next
              }
            },
            {
              title: this.getTabTitle(CHECKIN_STATUS.INCOMPLETE, incompleteCount),
              component: this.createRouteListComponent(),
              args: {
                businesses: statusToBusinessMap[CHECKIN_STATUS.INCOMPLETE],
                openMap: this.openMap,
                next: this.next
              }
            },
            {
              title: this.getTabTitle(CHECKIN_STATUS.NOT_STARTED, notStartedCount),
              component: this.createRouteListComponent(),
              args: {
                businesses: statusToBusinessMap[CHECKIN_STATUS.NOT_STARTED],
                openMap: this.openMap,
                next: this.next
              }
            }
          ]}
          />
        </Animated.View>

        <Button onPress={this.modifyRoute} style={{
          elevation: 100, position: 'absolute', bottom: 0, right: 0,
          margin: leftMargin, backgroundColor: accentColor
        }}>
          <Text>Modify Route</Text>
        </Button>
      </View>
    );
  }

  createRouteListComponent = () => {
    return ({ businesses, next, openMap }) => {
      let hasData = businesses.length > 0;
      if (hasData) {
        return (
          <ListView
            dataSource={this.ds.cloneWithRows(businesses)}
            renderRow={(item, sectionId, rowId) => {
              const bgColor = rowId % 2 === 0 ? '#fff' : '#f2f2f2';

              return (
                <TouchableNativeFeedback
                  style={styles.itemRow}
                  onPress={() => next(item.name)}>
                  <View style={[styles.item, { backgroundColor: bgColor }]}>
                    <StyleProvider style={getTheme({ iconFamily: "MaterialCommunityIcons" })}>
                      <View style={{ flexDirection: 'row' }}>
                        <Icon name="google-maps" onPress={() => openMap(item.lat, item.lng)} style={styles.mapIcon} />
                      </View>
                    </StyleProvider>
                    <Text style={cs.h3}>
                      {item.name}
                    </Text>
                  </View>
                </TouchableNativeFeedback>)
            }}>
          </ListView>
        )
      } else {
        return (
          <View style={{ margin: 12 }}>
            <Text style={{ fontSize: 20 }}>No business under this status</Text>
          </View>
        )
      }
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'red',
  },
  mapContainer: {
    top: 0,
    width: 400,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  itemRow: {
    marginLeft: 0,
    marginRight: 0,
    margin: 4,
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: 8,
    marginLeft: defaultMargin,
    alignItems: 'center',
  },
  mapIcon: {
    fontSize: 32,
    color: '#666',
  },
  statusRow: {
    flexDirection: 'row',
    height: 70,
    marginBottom: 16,
    padding: 4,
  },
  statusHeader: {
    fontSize: 20,
    textAlign: 'center',
    borderBottomColor: '#bbb',
    borderBottomWidth: 2,
    marginRight: 8,
  },
  statusValue: {
    fontSize: 26,
    textAlign: 'center',
    color: primaryColorDark,
    fontWeight: 'bold',
  }
});
