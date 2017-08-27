import React, { Component } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

export default class Container extends Component {

  static propTypes = {
    children: PropTypes.node.isRequired,
    scrollable: PropTypes.bool,
  }

  static defaultProps = {
    scrollable: false,
  }

  render() {
    const { children, scrollable } = this.props;

    return (
      <ScrollView
        contentContainerStyle={[
          s.container,
          scrollable ? s.containerPadding : '',
        ]}
        scrollEnabled={scrollable}
      >
        {children}
      </ScrollView>
    );
  }
}

const s = StyleSheet.create({
  container__content: {
    minHeight: '100%',

    backgroundColor: '#fff',
  },

  containerPadding: {
    paddingBottom: 18,
  },
});
