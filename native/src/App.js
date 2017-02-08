import React, { Component } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';

import AreaChart from 'VisualTradeNative/shared/AreaChart';
import MessagingTest from "VisualTradeNative/src/MessagingTest"

class App extends Component {
  state = {
    chartWidth: 0,
    chartHeight: 0,
    maxAllowedAreaHeight: 0,
  }

  componentDidMount() {
    let {
      height: chartHeight,
      width: chartWidth
    } = Dimensions.get('window');

    this.setState({
      chartWidth,
      chartHeight,
      maxAllowedAreaHeight: chartHeight * 0.8,
    });
  }

  render() {
    const {
      chartWidth,
      chartHeight,
      maxAllowedAreaHeight,
    } = this.state;

    const graphProps = {
      areaPath: '<svg><defs><mask id="primMask"><path d="M 0 0 L 300 0 300 300 0 300 Z M 100 0 A 50,50 0 0,0 100,100 A 50,50 0 0,0 100,0" fill-rule="evenodd" fill="white" /></mask><mask id="anotherMask"><path d="M 0 0 L 300 0 300 300 0 300 Z M 30 0 A 10,10 0 0,0 30,60 A 10,10 0 0,0 30,0" fill-rule="evenodd" fill="white" /></mask></defs><!-- These are just the circles with same paths as masks to help visualize the masks shape/position --><g><path d="M 100 0 A 50,50 0 0,0 100,100 A 50,50 0 0,0 100,0" class="maskCopy" /><path d="M 30 0 A 10,10 0 0,0 30,60 A 10,10 0 0,0 30,0" class="maskCopy" /></g><!-- This is the main shape with masks --><g mask="url(#primMask)"><g mask="url(#anotherMask)"><path d="M 10 10 L 90 10 70 90 10 90 Z" class="myShape" /></g></g></svg>',
      width: chartWidth,
      height: chartHeight,
      maxAllowedAreaHeight,
    };

    return (
        <MessagingTest />
    );
  }
}

export default App
