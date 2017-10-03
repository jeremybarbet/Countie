/* eslint-disable max-len */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, TouchableOpacity, Image, Linking } from 'react-native';
import { inject, observer } from 'mobx-react/native';

import Container from 'components/container';
import storage, { prefix } from 'utils/storage';

@inject('ui')
@observer
export default class Permission extends Component {

  static propTypes = {
    navigator: PropTypes.shape({
      push: PropTypes.func.isRequired,
      pop: PropTypes.func.isRequired,
    }).isRequired,
    ui: PropTypes.object.isRequired,
  }

  static navigatorStyle = {
    navBarHidden: true,
  }

  onPressNotify = () => {

  }

  onPressNo = () => {

  }

  render() {
    return (
      <Container>
        <Text style={s.permission__title}>Don’t miss the big day!</Text>
        <Text style={s.permission__description}>We’ll notify you know when it’s coming, some days and hours before.</Text>

        <TouchableOpacity
          onPress={this.onPressNotify}
          activeOpacity={0.75}
          style={s.permission__submit}
        >
          <Image
            style={s.permission__icon}
            source={require('../images/submit.png')}
          />
        </TouchableOpacity>

        <Text
          style={s.permission__footer}
          onPress={this.onPressNo}
        >
          No thanks
        </Text>
      </Container>
    );
  }
}

const s = StyleSheet.create({
  permission__title: {
    paddingHorizontal: 40,
    marginTop: 200,
    marginBottom: 15,

    fontFamily: 'Avenir-Medium',
    fontSize: 32,
    color: '#FFFFFF',
    lineHeight: 42,
  },

  permission__description: {
    paddingHorizontal: 40,

    fontFamily: 'Avenir-Medium',
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 25,
  },

  permission__submit: {
    paddingHorizontal: 40,
    marginTop: 60,
  },

  permission__icon: {
    tintColor: '#FFFFFF',
  },

  permission__footer: {
    paddingHorizontal: 40,
    marginTop: 'auto',
    marginBottom: 30,

    fontFamily: 'Avenir-Medium',
    fontSize: 14,
    color: '#FFFFFF',
    letterSpacing: 0.4,
  },
});
