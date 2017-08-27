import React, { Component } from 'react';
import { View, Text, StyleSheet, DatePickerIOS } from 'react-native';

import Container from '../components/container';

export default class Welcome extends Component {

  static defaultProps = {
    date: new Date(),
  }

  state = {
    date: this.props.date,
  }

  onDateChange = (date) => {
    this.setState({ date });
  }

  render() {
    return (
      <Container>
        <View style={s.host}>
          <DatePickerIOS
            date={this.state.date}
            mode="date"
            onDateChange={this.onDateChange}
          />
        </View>
      </Container>
    );
  }
}

const s = StyleSheet.create({
  host: {
    flex: 1,
    justifyContent: 'center',
  },
});
