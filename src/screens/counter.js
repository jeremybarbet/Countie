import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text, Image, Animated, Dimensions, Easing, AppState, Alert } from 'react-native';
import { decorate } from 'react-mixin';
import { autobind } from 'core-decorators';
import { inject, observer } from 'mobx-react/native';
import { observable, action } from 'mobx';
import LinearGradient from 'react-native-linear-gradient';
import TimerMixin from 'react-native-timer-mixin';
import Swiper from 'react-native-swiper';
import moment from 'moment';
import { isNaN, omit } from 'lodash';

import Container from 'components/container';
import ImagesSwitcher from 'components/images-switcher';
import Icon from 'components/icon';
import { datify, isOver } from 'utils/date';
import storage, { prefix } from 'utils/storage';
import { navigatorTypes } from 'utils/types';
import { isIphoneX, isIpad } from 'utils/utils';

const { width } = Dimensions.get('window');
const KEYS = ['counters', 'last_closed', 'time_remaining'];
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

    const { counters, currentCounter } = props.ui;

    this.rotation = new Animated.Value(0);
    this.progress = new Animated.Value(counters[currentCounter].status.total);
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

  @autobind
  onPressAdd() {
    this.props.navigator.dismissModal();
  }

  @autobind
  onPressClose() {
    const { text } = this.props;

    Alert.alert(
      'Delete this counter',
      `Are you sure you want to delete « ${text} »?`,
      [
        {
          text: 'Cancel',
        },
        {
          text: 'Yes',
          onPress: this.deleteCounter,
          style: 'destructive',
        },
      ],
    );
  }

  @autobind
  @action
  onPressReload() {
    this.props.ui.reload = true;

    Animated.timing(this.rotation, {
      toValue: 1,
      duration: 500,
    }).start(() => this.rotation.setValue(0));
  }

  get width() {
    const { counters, currentCounter } = this.props.ui;

    if (Object.keys(counters).length === 0) {
      return { width: 0 };
    }

    const t = counters[currentCounter].to - counters[currentCounter].from;

    if (counters[currentCounter].status.total <= 0 || t <= 0 || isNaN(t)) {
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

  @autobind
  @action
  async handleStateChange(state) {
    const { counters, updateDate } = this.props.ui;

    if (state === 'inactive') {
      const obj = {};

      this.lastClosed = new Date();
      storage.set(prefix('last_closed'), this.lastClosed);

      Object.keys(counters).map(c => obj[c] = counters[c].status.total); // eslint-disable-line
      storage.update(prefix('time_remaining'), obj);
    }

    if (state === 'active') {
      const { lastClosed } = this;
      const lastOpened = new Date();

      try {
        const remaining = await storage.get(prefix('time_remaining'));

        // eslint-disable-next-line
        Object.keys(counters).map(c =>
          counters[c].status = updateDate(c, { lastClosed, lastOpened, remaining: remaining[c] }),
        );

      } catch (error) {
        console.error(error);
      }
    }
  }

  @autobind
  @action
  counter() {
    const { counters, currentCounter } = this.props.ui;

    Object.keys(counters).forEach((c) => {
      const val = counters[c].status.total - ONE_SECOND;

      counters[c].status = datify(val);
      this.setState({ val }); // Worst trick ever to make re-render again
    });

    if (isOver(counters[currentCounter].status)) {
      clearInterval(this.countdown);
    }

    Animated.timing(this.progress, {
      toValue: counters[currentCounter].status.total,
      duration: ONE_SECOND,
      easing: Easing.linear,
    }).start();
  }

  @autobind
  @action
  deleteCounter() {
    const { currentCounter, counters } = this.props.ui;
    const newObj = omit(counters, currentCounter);

    if (Object.keys(counters).length === 1) {
      this.props.ui.counters = newObj;
      this.props.ui.currentCounter = undefined;
      this.props.ui.activeCounter = false;
      this.props.navigator.dismissModal();

      storage.multiRemove(KEYS);
    } else {
      this.props.ui.currentCounter = Object.keys(newObj)[0]; // eslint-disable-line
      this.props.ui.counters = newObj;

      storage.update(prefix('counters'), newObj);
    }
  }

  @autobind
  renderCounter(c) {
    const { counters } = this.props.ui;
    const { days, hours, minutes, seconds } = counters[c].status;
    const f = (v, p) => v.toString().length > 1 ? `${v}${p}` : `0${v}${p}`; // eslint-disable-line

    if (isNaN(counters[c].status.total)) {
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

  @autobind
  @action
  handleChange(index) {
    const { counters } = this.props.ui;
    const newCurrent = Object.keys(counters)[index];

    this.props.ui.currentCounter = newCurrent;
    this.progress = new Animated.Value(counters[newCurrent].status.total);
  }

  @autobind
  counters() {
    const { counters } = this.props.ui;

    return (
      <Swiper
        style={s.counter__swiper}
        showsButtons={false}
        paginationStyle={s.counter__pagination}
        dotStyle={s.counter__dot}
        activeDotStyle={s.counter__dotActive}
        onIndexChanged={this.handleChange}
        index={0}
        bounces
      >
        {Object.keys(counters).map(c => (
          <View key={c} style={s.counter__slide}>
            <Text style={s.counter__title}>{counters[c].text}</Text>

            {isOver(counters[c].status)
              ? <Text style={s.counter__countdown}>Make the most of it!</Text>
              : this.renderCounter(c)
            }

            <Text style={s.counter__date}>{moment(counters[c].to).format('MMMM Do, YYYY')}</Text>
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
            source={require('../images/reload.png')}
          />
        </Icon>

        <Icon onPress={this.onPressAdd} style={s.counter__add}>
          <Image style={s.counter__image} source={require('../images/add.png')} />
        </Icon>

        <Icon onPress={this.onPressClose} style={s.counter__close}>
          <Image style={s.counter__image} source={require('../images/close.png')} />
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
    paddingHorizontal: 25,
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
