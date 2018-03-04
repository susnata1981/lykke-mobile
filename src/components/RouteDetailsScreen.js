import React, { Component } from 'react';
import { Animated, StyleSheet, View, ToolbarAndroid, ScrollView, Linking, Platform } from 'react-native';
import { Container, Header, Content, H1, Text, Icon, Button, Title, List, ListItem, StyleProvider, getTheme } from 'native-base';
import { NavigationActions } from 'react-navigation';
import Toolbar from './Toolbar';
import cs, { accentColor, primaryColorDark, secondaryColor, defaultMargin } from './styles';
import MapView, { Marker, LatLng } from 'react-native-maps';
import { getDateObject, isToday } from '../util';
import TabView from './common/TabView';
import { CHECKIN_STATUS, mapStatus } from '../model/status';

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
    this.routeName = this.props.selectedRoute;
    this.route = this.props.routes[this.routeName];
    this.mapHeight = new Animated.Value(340);
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
    this.props._getCheckins(this.props.user.key);
  }

  next(name) {
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
    return CHECKIN_STATUS.NA;
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

  getStatusColor = (status) => {
    switch (status) {
      case CHECKIN_STATUS.COMPLETE:
        return '#388E3C';
      case CHECKIN_STATUS.INCOMPLETE:
        return '#FF9800';
      default:
        return '#F44336';
    }
  }

  //   render() {
  //     const mapHeight = this.mapHeight

  //     let businesses = Object.keys(this.state.businesses).map(item => {
  //       return this.state.businesses[item]
  //     });

  //     let notStartedCount = 0;
  //     let incompleteCount = 0;
  //     let completedCount = 0;
  //     statusToBusinessMap = {};

  //     businesses.forEach(item => {
  //       let status = this.getCheckinStatus(item.name);
  //       statusToBusinessMap[status] = statusToBusinessMap[status] || [];
  //       statusToBusinessMap[status].push(item);

  //       switch (status) {
  //         case 'COMPLETE':
  //           completedCount += 1;
  //           break;
  //         case 'INCOMPLETE':
  //           incompleteCount += 1;
  //           break;
  //         default:
  //           notStartedCount += 1;
  //       }
  //     });

  //     _.map(statusToBusinessMap, (v, k) => {
  //       if (v.length === 0) {
  //         delete statusToBusinessMap[k];
  //       }
  //     });

  //     statusBusinessArray = [];
  //     _.map(statusToBusinessMap, (v, k) => {
  //       statusBusinessArray.push({
  //         divider: true,
  //         key: k
  //       });
  //       v.forEach(i => statusBusinessArray.push(i));
  //     });
  //     console.log(statusBusinessArray);

  //     return (
  //       <ScrollView class={styles.container}>
  //         <Toolbar backButtonTitle="Routes"
  //           title={this.routeName}
  //           dispatch={this.props.navigation.dispatch} />

  //         <Animated.View style={[styles.mapContainer, { height: mapHeight }]}>
  //           <MapView
  //             initialRegion={{
  //               latitude: 22.534599691801127,
  //               longitude: 88.36452757939696,
  //               latitudeDelta: 0.12508503188433195,
  //               longitudeDelta: 0.13547468930481443,
  //             }}
  //             onRegionChange={this.onRegionChange}
  //             style={styles.map}>
  //             {businesses.map(item => (
  //               <Marker
  //                 key={item.name}
  //                 coordinate={{ latitude: item.lat, longitude: item.lng }}
  //                 title={item.name}
  //                 description={item.address}
  //               />
  //             ))}
  //           </MapView>
  //         </Animated.View>
  //         <Button small bordered onPress={this.toggleMap} style={{ alignSelf: 'flex-end', padding: 0, margin: 0 }}>
  //           <Text>Toggle Map</Text>
  //         </Button>

  //         {(incompleteCount + notStartedCount > 0) &&
  //           <View style={styles.statusRow}>
  //             <View style={{ flex: 1, marginLeft: 6 }}>
  //               <Text style={styles.statusHeader}>Completed</Text>
  //               <Text style={styles.statusValue}>{completedCount}</Text>
  //             </View>
  //             <View style={{ flex: 1, marginLeft: 6 }}>
  //               <Text style={styles.statusHeader}>Incomplete</Text>
  //               <Text style={styles.statusValue}>{incompleteCount}</Text>
  //             </View>
  //             <View style={{ flex: 1, marginLeft: 6 }}>
  //               <Text style={styles.statusHeader}>Not Started</Text>
  //               <Text style={styles.statusValue}>{notStartedCount}</Text>
  //             </View>
  //           </View>
  //         }

  //         {(incompleteCount + notStartedCount === 0) &&
  //           <View style={{ flex: 1, marginLeft: 6 }}>
  //             <Text style={styles.statusHeader}>Great! You've completed all checkins for the day.</Text>
  //           </View>
  //         }

  //         <View>
  //          <TabView tabs={[
  //           {title:'Tab A', component: createComponent('Component A', '#0ff')}, 
  //           {title:'Tab B', component: createComponent('Component B', '#f0f')}, 
  //           {title:'Tab C', component: createComponent('Component C', '#ff0')}]} />    
  //         </View>

  //         <List dataArray={statusBusinessArray}
  //           renderRow={(item) => {
  //             if (item.divider) {
  //               return (
  //                 <ListItem itemDivider style={{ backgroundColor: this.getStatusColor(item.key) }}>
  //                   <Text style={{ color: '#fff', fontSize: 18 }}>{item.key}</Text>
  //                 </ListItem>
  //               )
  //             }
  //             return (
  //               <ListItem onPress={() => this.showBusinessDetails(item.name)}
  //                 style={styles.itemRow}
  //                 onPress={() => this.next(item.name)}>
  //                 <View style={styles.item}>
  //                   <StyleProvider style={getTheme({ iconFamily: "MaterialCommunityIcons" })}>
  //                     <View style={{ flexDirection: 'row' }}>
  //                       <Icon name="google-maps" onPress={() => this.openMap(item.lat, item.lng)} style={styles.mapIcon} />
  //                     </View>
  //                   </StyleProvider>
  //                   <Text style={cs.h4}>
  //                     {item.name}
  //                   </Text>
  //                 </View>
  //                 <View style={styles.item}>
  //                   <Text style={cs.h4}>
  //                     {this.getCheckinStatus(item.name)}
  //                   </Text>
  //                 </View>
  //               </ListItem>)
  //           }}>
  //         </List>
  //       </ScrollView>
  //     );
  //   }
  // }

  getTitle = (title, count) => {
    return `${title}(${count})`;
  }

  render() {
    const mapHeight = this.mapHeight

    let businesses = Object.keys(this.state.businesses).map(item => {
      return this.state.businesses[item]
    });

    let notStartedCount = 0;
    let incompleteCount = 0;
    let completedCount = 0;
    statusToBusinessMap = {};

    _.map(CHECKIN_STATUS, (v, k) => {
      statusToBusinessMap[v] = statusToBusinessMap[v] || [];
    });

    businesses.forEach(item => {
      let status = this.getCheckinStatus(item.name);
      statusToBusinessMap[status].push(item);

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
    console.log('busienss map');
    console.log(businesses);
    console.log(statusToBusinessMap);
    console.log(statusToBusinessMap[CHECKIN_STATUS.NOT_STARTED]);

    return (
      <ScrollView class={styles.container}>
        <Toolbar backButtonTitle="Routes"
          title={this.routeName}
          dispatch={this.props.navigation.dispatch} />

        <Animated.View style={[styles.mapContainer, { height: mapHeight }]}>
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
        </Animated.View>
        <Button small bordered onPress={this.toggleMap} style={{ alignSelf: 'flex-end', padding: 0, margin: 0 }}>
          <Text>Toggle Map</Text>
        </Button>

        {/* {(incompleteCount + notStartedCount > 0) &&
          <View style={styles.statusRow}>
            <View style={{ flex: 1, marginLeft: 6 }}>
              <Text style={styles.statusHeader}>Completed</Text>
              <Text style={styles.statusValue}>{completedCount}</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 6 }}>
              <Text style={styles.statusHeader}>Incomplete</Text>
              <Text style={styles.statusValue}>{incompleteCount}</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 6 }}>
              <Text style={styles.statusHeader}>Not Started</Text>
              <Text style={styles.statusValue}>{notStartedCount}</Text>
            </View>
          </View>
        } */}

        {(incompleteCount + notStartedCount === 0) &&
          <View style={{ flex: 1, marginLeft: 6 }}>
            <Text style={styles.statusHeader}>Great! You've completed all checkins for the day.</Text>
          </View>
        }

        <View style={{ backgroundColor: '#fff' }}>
          <TabView tabs={[
            {
              title: this.getTitle(CHECKIN_STATUS.COMPLETE, completedCount),
              component: this.createRouteListComponent(),
              args: {
                businesses: statusToBusinessMap[CHECKIN_STATUS.COMPLETE],
                showBusinessDetails: this.showBusinessDetails,
                openMap: this.openMap,
                next: this.next
              }
            },
            {
              title: this.getTitle(CHECKIN_STATUS.INCOMPLETE, incompleteCount),
              component: this.createRouteListComponent(),
              args: {
                businesses: statusToBusinessMap[CHECKIN_STATUS.INCOMPLETE],
                showBusinessDetails: this.showBusinessDetails,
                openMap: this.openMap,
                next: this.next
              }
            },
            {
              title: this.getTitle(CHECKIN_STATUS.NOT_STARTED, notStartedCount),
              component: this.createRouteListComponent(),
              args: {
                businesses: statusToBusinessMap[CHECKIN_STATUS.NOT_STARTED],
                showBusinessDetails: this.showBusinessDetails,
                openMap: this.openMap,
                next: this.next
              }
            }
          ]}
          />
        </View>
      </ScrollView>
    );
  }

  createRouteListComponent = () => {
    return ({ businesses, showBusinessDetails, next, openMap }) => {
      let hasData = businesses.length > 0;
      if (hasData) {
        return (
          <List
            dataArray={businesses}
            renderRow={(item) => {
              return (
                <ListItem onPress={() => showBusinessDetails(item.name)}
                  style={styles.itemRow}
                  onPress={() => next(item.name)}>
                  <View style={styles.item}>
                    <StyleProvider style={getTheme({ iconFamily: "MaterialCommunityIcons" })}>
                      <View style={{ flexDirection: 'row' }}>
                        <Icon name="google-maps" onPress={() => openMap(item.lat, item.lng)} style={styles.mapIcon} />
                      </View>
                    </StyleProvider>
                    <Text style={cs.h3}>
                      {item.name}
                    </Text>
                  </View>
                </ListItem>)
            }}>
          </List>
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
    justifyContent: 'flex-start',
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
    padding: 4,
    marginLeft: defaultMargin,
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