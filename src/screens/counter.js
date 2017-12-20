import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text, Image, Animated, Dimensions, Easing, AppState, Alert, Platform } from 'react-native';
import PushNotification from 'react-native-push-notification';
import { decorate } from 'react-mixin';
import TimerMixin from 'react-native-timer-mixin';
import { inject, observer } from 'mobx-react/native';
import { observable, action, toJS } from 'mobx';
import LinearGradient from 'react-native-linear-gradient';
import Swiper from 'react-native-swiper';
import moment from 'moment';
import { isNaN } from 'lodash';

import Container from 'components/container';
import ImagesSwitcher from 'components/images-switcher';
import Icon from 'components/icon';
import { datify, isOver } from 'utils/date';
import storage, { prefix } from 'utils/storage';
import { navigatorTypes } from 'utils/types';
import { isIphoneX, isIpad } from 'utils/utils';

const { width } = Dimensions.get('window');
const ONE_SECOND = 1000;

@inject('ui')
@observer
@decorate(TimerMixin)
export default class Counter extends Component {

  @observable
  lastClosed;

  static propTypes = {
    ...navigatorTypes,
    ui: PropTypes.object.isRequired,
  }

  static navigatorStyle = {
    navBarHidden: true,
    screenBackgroundColor: 'transparent',
  }

  constructor(props) {
    super(props);

    const { getCounter, currentCounter } = props.ui;

    this.rotation = new Animated.Value(0);
    this.progress = new Animated.Value(getCounter(currentCounter).status.total);
  }

  @action
  componentWillMount() {
    AppState.addEventListener('change', this.handleStateChange);

    // Reset inputs
    this.props.ui.showDate = false;
    this.props.ui.counterTo = new Date();
    this.props.ui.counterText = undefined;
    this.props.ui.firstPickDate = false;
    this.props.ui.firstPickText = false;
  }

  componentDidMount() {
    this.countdown = this.setInterval(() =>
      this.counter(),
    ONE_SECOND);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleStateChange);
  }

  onPressAdd = () => {
    this.props.navigator.dismissModal();
  }

  onPressClose = () => {
    const { getCounter, currentCounter } = this.props.ui;

    Alert.alert(
      'Delete this counter',
      `Are you sure you want to delete « ${getCounter(currentCounter).text} »?`,
      [
        {
          text: 'Cancel',
        },
        {
          text: 'Yes',
          onPress: () => this.deleteCounter(currentCounter),
          style: 'destructive',
        },
      ],
    );
  }

  @action
  onPressReload = () => {
    this.props.ui.reload = true;

    Animated.timing(this.rotation, {
      toValue: 1,
      duration: 500,
    }).start(() => this.rotation.setValue(0));
  }

  get width() {
    const { counters, getCounter, currentCounter } = this.props.ui;

    if (counters.size === 0) {
      return { width: 0 };
    }

    const t = getCounter(currentCounter).to - getCounter(currentCounter).from;

    if (getCounter(currentCounter).status.total <= 0 || t <= 0 || isNaN(t)) {
      return { width: 0 };
    }

    return {
      width: this.progress.interpolate({
        inputRange: [ONE_SECOND, t],
        outputRange: [0, width],
      }),
    };
  }

  get transform() {
    return {
      transform: [
        { scale: 0.85 },
        {
          rotate: this.rotation.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg'],
          }),
        },
      ],
    };
  }

  @action
  handleStateChange = async (state) => {
    const { counters } = this.props.ui;

    if (state === 'inactive' || state === 'background') {
      const obj = {};

      this.lastClosed = new Date();

      storage.set(prefix('last_closed'), this.lastClosed);
      counters.forEach((c, k) => obj[k] = c.status.total); // eslint-disable-line
      storage.update(prefix('time_remaining'), obj);
    }

    if (state === 'active') {
      const { lastClosed } = this;
      const lastOpened = new Date();

      try {
        const remaining = await storage.get(prefix('time_remaining'));

        counters.forEach((_, k) =>
          this.props.ui.updateStatus(k, { lastClosed, lastOpened, remaining: remaining[k] }),
        );
      } catch (error) {
        console.error(error);
      }
    }
  }

  @action
  counter = () => {
    const { counters, getCounter, currentCounter } = this.props.ui;

    if (counters.size === 0) {
      return;
    }

    counters.forEach(c => c.status = datify(c.status.total - ONE_SECOND)); // eslint-disable-line

    if (isOver(getCounter(currentCounter).status)) {
      clearInterval(this.countdown);
    }

    Animated.timing(this.progress, {
      toValue: getCounter(currentCounter).status.total,
      duration: ONE_SECOND,
      easing: Easing.linear,
    }).start();
  }

  @action
  deleteCounter = (id) => {
    const { counters } = this.props.ui;

    if (counters.size > 1) {
      counters.delete(id);
      this.props.ui.currentCounter = counters.keys()[0]; // eslint-disable-line

      PushNotification.cancelLocalNotifications({ id });
      storage.set(prefix('counters'), toJS(counters));
    } else {
      this.props.ui.counters.clear();
      this.props.ui.currentCounter = undefined;
      this.props.ui.activeCounter = false;
      this.props.navigator.dismissModal();

      PushNotification.cancelAllLocalNotifications();
      storage.delete(prefix('counters'));
      storage.delete(prefix('last_closed'));
      storage.delete(prefix('time_remaining'));
    }
  }

  renderCounter = ({ total, days, hours, minutes, seconds }) => {
    const f = (v, p) => v.toString().length > 1 ? `${v}${p}` : `0${v}${p}`; // eslint-disable-line

    if (isNaN(total)) {
      return (
        <Text style={s.counter__countdown}>
          Loading...
        </Text>
      );
    }

    return (
      <Text style={s.counter__countdown}>
        {f(days, 'd')} {f(hours, 'h')} {f(minutes, 'm')} {f(seconds, 's')}
      </Text>
    );
  }

  @action
  handleChange = (index) => {
    const { counters, getCounter } = this.props.ui;
    const newCurrent = counters.keys()[index];

    this.props.ui.currentCounter = newCurrent;
    this.progress = new Animated.Value(getCounter(newCurrent).status.total);
  }

  counters = () => {
    const { all } = this.props.ui;

    return (
      <Swiper
        style={s.counter__swiper}
        showsButtons={false}
        paginationStyle={s.counter__pagination}
        dotStyle={s.counter__dot}
        activeDotStyle={s.counter__dotActive}
        onIndexChanged={this.handleChange}
        loop={false}
        bounces
      >
        {all.map(c => (
          <View key={c.from} style={s.counter__slide}>
            <Text style={s.counter__title}>{c.text}</Text>

            {isOver(c.status)
              ? <Text style={s.counter__countdown}>Make the most of it!</Text>
              : this.renderCounter(c.status)
            }

            <Text style={s.counter__date}>{moment(c.to).format('MMMM Do, YYYY')}</Text>
          </View>
        ))}
      </Swiper>
    );
  }

  render() {
    const { ui } = this.props;

    return (
      <Container>
        <Icon onPress={this.onPressReload} style={s.counter__reload}>
          <Animated.Image
            style={[s.counter__image, this.transform]}
            source={require('../assets/images/reload.png')}
          />
        </Icon>

        <Icon onPress={this.onPressAdd} style={s.counter__add}>
          <Image style={s.counter__image} source={require('../assets/images/add.png')} />
        </Icon>

        <Icon onPress={this.onPressClose} style={s.counter__close}>
          <Image style={s.counter__image} source={require('../assets/images/close.png')} />
        </Icon>

        <ImagesSwitcher reload={ui.reload} />

        <LinearGradient
          colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.5)']}
          style={s.counter__gradient}
        >
          {this.counters()}

          <Animated.View style={[s.counter__progress, this.width]} />
        </LinearGradient>
      </Container>
    );
  }
}

function positions() {
  if (isIphoneX()) {
    return { top: 0 };
  }

  if (Platform.OS === 'android') {
    return { bottom: 4 };
  }

  return { bottom: 0 };
}

const s = StyleSheet.create({
  counter__icon: {
    position: 'absolute',
    top: 25,
    zIndex: 10,
  },

  counter__image: {
    transform: [{ scale: 0.8 }],

    tintColor: '#fff',
  },

  counter__reload: {
    right: 145,
  },

  counter__add: {
    right: 85,
  },

  counter__close: {
    right: 25,
  },

  counter__gradient: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    right: 0,

    height: 300,
  },

  counter__swiper: {
    marginHorizontal: 25,
    paddingBottom: 30,
  },

  counter__slide: {
    flex: 1,
    justifyContent: 'flex-end',

    paddingBottom: 55,
  },

  counter__pagination: {
    justifyContent: 'flex-start',

    marginLeft: 25,
  },

  counter__dot: {
    marginRight: 6,

    width: 6,
    height: 6,

    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 3,
  },

  counter__dotActive: {
    marginRight: 6,

    width: 6,
    height: 6,

    backgroundColor: '#fff',
    borderRadius: 3,
  },

  counter__title: {
    fontFamily: 'Avenir-Medium',
    fontSize: isIpad() ? 48 : 32,
    color: '#fff',

    paddingRight: 50,

    backgroundColor: 'transparent',
  },

  counter__countdown: {
    opacity: 0.85,

    fontFamily: 'Avenir-Medium',
    fontSize: isIpad() ? 32 : 26,
    color: '#fff',
    lineHeight: isIpad() ? 48 : 42,

    backgroundColor: 'transparent',
  },

  counter__date: {
    opacity: 0.7,

    marginTop: 4,

    fontFamily: 'Avenir-Medium',
    fontSize: isIpad() ? 24 : 18,
    color: '#fff',

    backgroundColor: 'transparent',
  },

  counter__progress: {
    position: 'absolute',
    ...positions(),
    left: 0,

    width,
    height: 4,

    backgroundColor: '#6ef09f',
  },
});
