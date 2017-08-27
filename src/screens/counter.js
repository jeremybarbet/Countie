import React, { PureComponent } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import Container from '../components/container';

export default class Counter extends PureComponent {

  render() {
    return (
      <Container>
        <Image source={require('../images/bg.png')}>
          <LinearGradient
            colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.5)']}
            style={s.counter__gradient}
          >
            <Text style={s.counter__title}>Baby + Iceland ❤️</Text>
            <Text style={s.counter__countdown}>30d 23h 13m 23s</Text>
            <Text style={s.counter__date}>September 29, 2017</Text>
          </LinearGradient>

          <View style={s.counter__progress} />
        </Image>
      </Container>
    );
  }
}

const s = StyleSheet.create({
  counter__gradient: {
    justifyContent: 'flex-end',

    position: 'absolute',
    left: 0,
    bottom: 0,
    right: 0,

    paddingHorizontal: 30,
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
    opacity: 0.8,

    fontFamily: 'Avenir-Medium',
    fontSize: 24,
    color: '#fff',
    lineHeight: 42,

    backgroundColor: 'transparent',
  },

  counter__date: {
    opacity: 0.6,

    marginTop: 2,

    fontFamily: 'Avenir-Medium',
    fontSize: 16,
    color: '#fff',

    backgroundColor: 'transparent',
  },

  counter__progress: {
    position: 'absolute',
    bottom: 0,
    left: 0,

    width: 110,
    height: 4,

    backgroundColor: '#6ef09f',
  },
});
