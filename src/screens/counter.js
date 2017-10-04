import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, Image, Animated, Dimensions, Easing, AppState, TouchableOpacity, Alert } from 'react-native';
import { decorate } from 'react-mixin';
import { autobind } from 'core-decorators';
import { inject, observer } from 'mobx-react/native';
import { action } from 'mobx';
import LinearGradient from 'react-native-linear-gradient';
import TimerMixin from 'react-native-timer-mixin';
import moment from 'moment';

import Container from 'components/container';
import ImagesSwitcher from 'components/images-switcher';
import { datify, isOver } from 'utils/date';
import storage, { prefix } from 'utils/storage';
import { navigatorTypes } from 'utils/types';

import { WELCOME } from './';

const { width } = Dimensions.get('window');
const ONE_SECOND = 1000;

@inject('ui')
@observer
@decorate(TimerMixin)
export default class Counter extends Component {

  static propTypes = {
    ...navigatorTypes,
    ui: PropTypes.object.isRequired,
    from: PropTypes.object.isRequired,
    to: PropTypes.object.isRequired,
    text: PropTypes.string.isRequired,
    activeCounter: PropTypes.bool,
    remaining: PropTypes.number,
  }

  static defaultProps = {
    activeCounter: false,
    remaining: undefined,
  }

  static navigatorStyle = {
    navBarHidden: true,
  }

  constructor(props) {
    super(props);

    this.rotation = new Animated.Value(0);

    this.hitIcon = {
      top: 10,
      left: 10,
      bottom: 10,
      right: 10,
    };

    if (props.activeCounter) {
      this.progress = new Animated.Value(props.remaining);
    } else {
      const t = props.to - props.from;
      const get = v => datify(t)[v];

      this.progress = new Animated.Value(t);

      props.ui.date = { // eslint-disable-line
        total: get('total'),
        days: get('days'),
        hours: get('hours'),
        minutes: get('minutes'),
        seconds: get('seconds'),
      };
    }
  }

  componentWillMount() {
    AppState.addEventListener('change', this.handleStateChange);
  }

  componentDidMount() {
    this.countdown = this.setInterval(() =>
      this.counter(this.props.ui.date.total),
    ONE_SECOND);
  }

  componentWillUnmount() {
    clearInterval(this.countdown);

    AppState.removeEventListener('change', this.handleStateChange);
  }

  @autobind
  onPressClose() {
    Alert.alert(
      'Delete counter',
      'Are you sure you want to delete this counter?',
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
    const { from, to } = this.props;
    const t = to - from;

    if (t < 0) {
      return {
        width: 0,
      };
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
      transform: [{
        rotate: this.rotation.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '360deg'],
        }),
      }],
    };
  }

  @autobind
  @action
  handleStateChange(state) {
    const { ui } = this.props;

    if (state === 'inactive') {
      this.lastClosed = new Date();
      this.timeRemaining = ui.date.total;

      storage.set(prefix('last_closed'), this.lastClosed);
      storage.set(prefix('time_remaining'), this.timeRemaining);
    }

    if (state === 'active') {
      ui.timeDifference(this.lastClosed, new Date(), this.timeRemaining);
    }
  }

  @action
  counter(t) {
    const { ui } = this.props;
    const sub = t - ONE_SECOND;
    const date = datify(sub);

    if (isOver(ui.date)) {
      clearInterval(this.countdown);
    }

    Animated.timing(this.progress, {
      toValue: sub,
      duration: ONE_SECOND,
      easing: Easing.linear,
    }).start();

    ui.date = date;
  }

  @autobind
  @action
  deleteCounter() {
    storage.clear();
    clearInterval(this.countdown);

    this.props.ui.showDate = false;
    this.props.ui.activeCounter = false;

    this.props.ui.counter = {
      from: undefined,
      to: new Date(),
      text: undefined,
    };

    this.props.navigator.resetTo({
      screen: WELCOME,
      animationType: 'fade',
    });
  }

  @autobind
  renderCounter() {
    const { days, hours, minutes, seconds } = this.props.ui.date;
    const f = (v, p) => v.toString().length > 1 ? `${v}${p}` : `0${v}${p}`; // eslint-disable-line

    return (
      <Text style={s.counter__countdown}>
        {f(days, 'd')} {f(hours, 'h')} {f(minutes, 'm')} {f(seconds, 's')}
      </Text>
    );
  }

  render() {
    const { ui, to, text } = this.props;

    return (
      <Container>
        <TouchableOpacity
          hitSlop={this.hitIcon}
          style={[s.counter__icon, s.counter__reload]}
          onPress={this.onPressReload}
          activeOpacity={0.4}
        >
          <Animated.Image
            style={this.transform}
            source={require('../images/reload.png')}
          />
        </TouchableOpacity>

        <TouchableOpacity
          hitSlop={this.hitIcon}
          style={[s.counter__icon, s.counter__close]}
          onPress={this.onPressClose}
          activeOpacity={0.4}
        >
          <Image source={require('../images/close.png')} />
        </TouchableOpacity>

        <ImagesSwitcher reload={ui.reload} />

        <LinearGradient
          colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.5)']}
          style={s.counter__gradient}
        >
          <Text style={s.counter__title}>{text}</Text>

          {isOver(ui.date)
            ? <Text style={s.counter__countdown}>Enjoy your time!</Text>
            : this.renderCounter()
          }

          <Text style={s.counter__date}>{moment(to).format('MMMM Do, YYYY')}</Text>
        </LinearGradient>

        <Animated.View style={[s.counter__progress, this.width]} />
      </Container>
    );
  }
}

const s = StyleSheet.create({
  counter__icon: {
    position: 'absolute',
    top: 25,
    zIndex: 10,
  },

  counter__reload: {
    right: 75,
  },

  counter__close: {
    right: 25,
  },

  counter__gradient: {
    justifyContent: 'flex-end',

    position: 'absolute',
    left: 0,
    bottom: 0,
    right: 0,

    paddingHorizontal: 25,
    paddingBottom: 30,

    height: 280,
  },

  counter__title: {
    fontFamily: 'Avenir-Medium',
    fontSize: 32,
    color: '#fff',

    backgroundColor: 'transparent',
  },

  counter__countdown: {
    opacity: 0.85,

    fontFamily: 'Avenir-Medium',
    fontSize: 26,
    color: '#fff',
    lineHeight: 42,

    backgroundColor: 'transparent',
  },

  counter__date: {
    opacity: 0.7,

    marginTop: 4,

    fontFamily: 'Avenir-Medium',
    fontSize: 18,
    color: '#fff',

    backgroundColor: 'transparent',
  },

  counter__progress: {
    position: 'absolute',
    bottom: 0,
    left: 0,

    width,
    height: 4,

    backgroundColor: '#6ef09f',
  },
});
