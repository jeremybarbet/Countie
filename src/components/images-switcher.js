import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Image, Animated } from 'react-native';
import { decorate } from 'react-mixin';
import { observable, action } from 'mobx';
import { inject, observer } from 'mobx-react/native';
import TimerMixin from 'react-native-timer-mixin';
import { range } from 'lodash';

const TEN_MINUTES = 600000;

const backgrounds = [
  { key: 0, src: require('../images/backgrounds/bg-1.png') },
  { key: 1, src: require('../images/backgrounds/bg-2.png') },
  { key: 2, src: require('../images/backgrounds/bg-3.png') },
  { key: 3, src: require('../images/backgrounds/bg-4.png') },
  { key: 4, src: require('../images/backgrounds/bg-5.png') },
  { key: 5, src: require('../images/backgrounds/bg-6.png') },
  { key: 6, src: require('../images/backgrounds/bg-7.png') },
  { key: 7, src: require('../images/backgrounds/bg-8.png') },
  { key: 8, src: require('../images/backgrounds/bg-9.png') },
];

@inject('ui')
@observer
@decorate(TimerMixin)
export default class ImagesSwitcher extends Component {

  static propTypes = {
    ui: PropTypes.object.isRequired,
    reload: PropTypes.bool.isRequired,
  }

  fade = new Animated.Value(1); // eslint-disable-line
  arr = [];

  @observable
  selected = {
    current: backgrounds[this.random].src,
    next: backgrounds[this.random].src,
  }

  componentDidMount() {
    this.background = this.setInterval(() =>
      this.switcher(),
    TEN_MINUTES);
  }

  @action
  componentWillReceiveProps(nextProps) {
    if (nextProps.reload) {
      this.switcher();
      this.props.ui.reload = false;
    }
  }

  refill() {
    this.arr = range(backgrounds.length);
  }

  get random() {
    if (this.arr.length === 0) {
      this.refill();
    }

    return this.arr.splice(Math.random() * this.arr.length - 1, 1)[0]; // eslint-disable-line
  }

  @action
  switcher() {
    const isActive = this.value === 1;

    if (isActive) {
      this.selected.next = backgrounds[this.random].src;
    } else {
      this.selected.current = backgrounds[this.random].src;
    }

    Animated.timing(this.fade, {
      toValue: isActive ? 0 : 1,
      duration: 600,
    }).start();
  }

  get value() {
    return this.fade._value + this.fade._offset; // eslint-disable-line
  }

  get fading() {
    return {
      opacity: this.fade,
    };
  }

  render() {
    return (
      <View style={s.fader}>
        <Animated.Image
          style={[s.fader__image, s.fader__active, this.fading]}
          source={this.selected.current}
          resizeMode="stretch"
        />

        <Image
          style={s.fader__image}
          source={this.selected.next}
          resizeMode="stretch"
        />
      </View>
    );
  }
}

const s = StyleSheet.create({
  fader: {
    flex: 1,

    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  fader__image: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,

    width: '100%',
    height: '100%',
  },

  fader__active: {
    zIndex: 2,
  },
});
