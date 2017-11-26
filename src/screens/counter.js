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
import { isNaN, get } from 'lodash';

import Container from 'components/container';
import ImagesSwitcher from 'components/images-switcher';
import Icon from 'components/icon';
import { datify, isOver } from 'utils/date';
import storage, { prefix } from 'utils/storage';
import { navigatorTypes } from 'utils/types';
import isIphoneX from 'utils/utils';

import { WELCOME } from './';

const { width } = Dimensions.get('window');
const keys = ['from', 'to', 'text', 'last_closed', 'time_remaining'];
const ONE_SECOND = 1000;

@inject('ui')
@observer
@decorate(TimerMixin)
export default class Counter extends Component {

  @observable
  remaining = {};

  @observable
  lastClosed;

  @observable
  currentCouter = 0;

  static propTypes = {
    ...navigatorTypes,
    ui: PropTypes.object.isRequired,
  }

  static navigatorStyle = {
    navBarHidden: true,
  }

  constructor(props) {
    super(props);

    this.rotation = new Animated.Value(0);

    if (props.ui.activeCounter) {
      // this.remaining[props.name] = props.ui.date[props.name].total;
      // this.progress = new Animated.Value(props.remaining);
    } else {
      const { counters, currentCounter } = props.ui;

      console.log('-props.ui', props.ui);

      const t = counters[currentCounter].to - counters[currentCounter].from;
      const date = v => datify(t)[v];

      this.remaining[currentCounter] = t;
      this.progress = new Animated.Value(t);

      counters[currentCounter].status = { // eslint-disable-line
        total: date('total'),
        days: date('days'),
        hours: date('hours'),
        minutes: date('minutes'),
        seconds: date('seconds'),
      };
    }
  }

  componentWillMount() {
    AppState.addEventListener('change', this.handleStateChange);
  }

  componentDidMount() {
    // if (isNaN(this.remaining)) return;

    // this.countdown = this.setInterval(() =>
    //   this.counter(),
    // ONE_SECOND);
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
    const { from, to } = this.props;
    const t = to - from;

    return {
      width: 200,
    };

    // if (this.remaining <= 0 || t <= 0 || isNaN(t)) {
    //   return {
    //     width: 0,
    //   };
    // }

    // return {
    //   width: this.progress.interpolate({
    //     inputRange: [ONE_SECOND, t],
    //     outputRange: [0, width],
    //   }),
    // };
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
  handleStateChange(state) {
    const { ui } = this.props;

    if (state === 'inactive') {
      this.lastClosed = new Date();

      storage.set(prefix('last_closed'), this.lastClosed);
      storage.set(prefix('time_remaining'), this.remaining);
    }

    if (state === 'active') {
      const { lastClosed, remaining } = this;
      const lastOpened = new Date();

      Object.keys(ui.counters).map((c) => {
        // ui.counters[c] = {
        //   ...ui.counters[c],
        //   status: ui.updateDate(c, { lastClosed, lastOpened, remaining }),
        // }

      //   ui.counters[c] = {
      //     ...ui.counters[c],
      //     status: ui.updateDate(c, { lastClosed, lastOpened, remaining })
      //   }

      //   this.remaining[c] = ui.counters[c].status.total;
      });

      // ui.updateDate({ lastClosed, lastOpened, remaining });
      // this.remaining = ui.date.total;
    }
  }

  @action
  counter() {
    this.remaining = this.remaining - ONE_SECOND;

    const { ui } = this.props;
    const { counters, currentCounter } = ui;

    const date = datify(this.remaining[currentCounter].status);

    if (isOver(counters[currentCounter].status)) {
      clearInterval(this.countdown);
    }

    Animated.timing(this.progress, {
      toValue: this.remaining[currentCounter],
      duration: ONE_SECOND,
      easing: Easing.linear,
    }).start();

    counters[currentCounter].status = date;
  }

  @autobind
  @action
  deleteCounter() {
    keys.map(k => storage.delete(prefix(k)));

    clearInterval(this.countdown);

    this.props.ui.showDate = false;
    this.props.ui.activeCounter = false;

    // Close popup if last counter otherwise, just move currentCounter slide
    this.props.navigator.resetTo({
      screen: WELCOME,
      animationType: 'fade',
    });
  }

  @autobind
  renderCounter(c) {
    const { counters, currentCounter } = this.props.ui;
    // console.log('-----renderCounter', counters[c]);

    // if (!get(counters[c], 'status')) {
    //   return;
    // }

    const { days, hours, minutes, seconds } = counters[c].status;
    const f = (v, p) => v.toString().length > 1 ? `${v}${p}` : `0${v}${p}`; // eslint-disable-line

    return (
      <Text style={s.counter__countdown}>
        {f(days, 'd')} {f(hours, 'h')} {f(minutes, 'm')} {f(seconds, 's')}
      </Text>
    );
  }

  handleChange(index) {
    // console.log('-index', index)
  }

  get counters() {
    const { counters } = this.props.ui;

    return (
      <Swiper
        style={s.counter__swiper}
        showsButtons={false}
        paginationStyle={s.counter__pagination}
        dotStyle={s.counter__dot}
        activeDotStyle={s.counter__dotActive}
        onIndexChanged={this.handleChange}
      >
        {Object.keys(counters).map((c) => (
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
          {this.counters}

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
    ...positions(),
    left: 0,

    width,
    height: 4,

    backgroundColor: '#6ef09f',
  },
});
