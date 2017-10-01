import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { decorate } from 'react-mixin';
import { inject, observer } from 'mobx-react/native';
import { StyleSheet, Text, Image, Animated, Dimensions, Easing, AppState, TouchableOpacity, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import TimerMixin from 'react-native-timer-mixin';
import moment from 'moment';
import get from 'lodash/get';

import Container from '../components/container';
import { datify, isOver } from '../utils/date';
import storage, { prefix } from '../utils/storage';

const { width } = Dimensions.get('window');
const ONE_SECOND = 1000;

@inject('ui')
@observer
@decorate(TimerMixin)
export default class Counter extends Component {

  static propTypes = {
    navigator: PropTypes.shape({
      push: PropTypes.func.isRequired,
      pop: PropTypes.func.isRequired,
    }).isRequired,
    ui: PropTypes.object.isRequired,
    from: PropTypes.object.isRequired,
    to: PropTypes.object.isRequired,
    text: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props);

    console.log(':::::::::::::', props.initialFrom)

    const initialTime = props.to - props.from;
    const t = get(props.remaining, 'total') || initialTime;
    // console.log('==============', t)

    // const get = v => datify(props.progress || t)[v];
    const value = v => datify(t)[v];

    // console.log('----------props', props.ui)

    // this.progress = new Animated.Value(props.progress || t);
    this.progress = new Animated.Value(t);

    if (!props.remaining) {
      props.ui.date = { // eslint-disable-line
        total: value('total'),
        days: value('days'),
        hours: value('hours'),
        minutes: value('minutes'),
        seconds: value('seconds'),
      };
    }
  }

  componentWillMount() {
    AppState.addEventListener('change', this.handleStateChange);
  }

  componentDidMount() {
    // this.switchBackground();

    // console.log('-------------- ui.date.total', this.props.ui.date.total)
    // console.log('--------', isOver(this.props.ui.date))

    this.countdown = this.setInterval(() =>
      this.counter(this.props.ui.date.total),
    ONE_SECOND);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleStateChange);
  }

  onPress = () => {
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

  get width() {
    const { initialFrom, from, to } = this.props;
    const t = to - (initialFrom || from);
    // console.log('---------- initialFrom', initialFrom)
    // console.log('---------- from', from)
    // console.log('---------- to', to)

    if (t < 0) return;

    // console.log('--------- get width t', t)

    return {
      width: this.progress.interpolate({
        inputRange: [ONE_SECOND, t],
        outputRange: [0, width],
      }),
    };
  }

  handleStateChange = (state) => {
    // console.log('---- state', state)

    const { ui, from, to, text } = this.props;

    if (state === 'inactive') {

      this.lastClosed = new Date();
      this.timeRemaining = ui.date;
      // ui.timeRemaining = ui.date.total;

      // ui.counter.from = from;
      //   from,
      //   // to,
      //   // text,
      // };

      console.log('inactive this.lastClosed', this.lastClosed);


      storage.set(prefix('appClosed'), this.lastClosed);
      // storage.set(prefix('progress'), this.progress);
      storage.set(prefix('remaining'), this.timeRemaining);
    }

    if (state === 'active') {
      console.log('active this.lastClosed', this.lastClosed);
      // this.switchBackground();
      ui.timeDifference(this.lastClosed, new Date());
    }
  }

  counter(t) {
    const { ui } = this.props;
    const sub = t - ONE_SECOND;
    const date = datify(sub);
    console.log('-******** sub', sub)
    console.log('-******** date', date)

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

  deleteCounter = () => {
    storage.clear();

    this.props.navigator.pop();
    this.props.ui.showDate = false;

    this.props.ui.counter = {
      from: undefined,
      to: new Date(),
      text: undefined,
    };
  }

  renderCounter = () => {
    console.log('*********', this.props.ui.date)
    const { days, hours, minutes, seconds } = this.props.ui.date;
    const f = (v, p) => v.toString().length > 1 ? `${v}${p}` : `0${v}${p}`;

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
          style={s.counter__close}
          onPress={this.onPress}
          activeOpacity={0.8}
        >
          <Image source={require('../images/close.png')} />
        </TouchableOpacity>

        <Image source={require('../images/bg.png')} />

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
  counter__close: {
    position: 'absolute',
    top: 30,
    right: 30,
    zIndex: 10,
    opacity: 0.8,
  },

  counter__gradient: {
    justifyContent: 'flex-end',

    position: 'absolute',
    left: 0,
    bottom: 0,
    right: 0,

    paddingHorizontal: 30,
    paddingBottom: 40,

    height: 280,
  },

  counter__title: {
    fontFamily: 'Avenir-Medium',
    fontSize: 32,
    color: '#fff',

    backgroundColor: 'transparent',
  },

  counter__countdown: {
    opacity: 0.8,

    fontFamily: 'Avenir-Medium',
    fontSize: 26,
    color: '#fff',
    lineHeight: 42,

    backgroundColor: 'transparent',
  },

  counter__date: {
    opacity: 0.6,

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
