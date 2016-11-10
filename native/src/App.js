import React, { Component } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';

import AreaChart from 'VisualTradeNative/shared/AreaChart';

class App extends Component {
  state = {
    // Our Queue of data we're graphing.
    // Why Queue? Because when we have
    // more items than what we can display
    // on the screen - we remove items
    // from the start of the array, i.e. FIFO
    dataQueue: [],
    chartWidth: 0,
    chartHeight: 0,
    distanceBetweenTwoPointsInChart: 0,
    maxAllowedAreaWidth: 0,
    maxAllowedAreaHeight: 0,
  }

  componentWillMount() {
    let render = () => {
      let {
        dataQueue,
        distanceBetweenTwoPointsInChart,
        maxAllowedAreaWidth,
      } =  this.state;

      let lastTimestamp = 0;
      let lastYValue = 0;

      if (dataQueue.length > 0) {
        lastTimestamp = dataQueue[dataQueue.length - 1].time;
        lastYValue = dataQueue[dataQueue.length - 1].value;
      }

      let value =
          lastYValue
        + (Math.floor(Math.random() * (2 - 1 + 1)) + 1)
        * (Math.random() < 0.5 ? -1 : 1);
      if (value < 10) {
        value = 10;
      }

      dataQueue.push({
        time: lastTimestamp + 1,
        value,
      });

      // Shift the queue if we have more items we can show
      let currentAreaWidth =
          dataQueue.length
        * distanceBetweenTwoPointsInChart
        - distanceBetweenTwoPointsInChart;
      if (currentAreaWidth > maxAllowedAreaWidth) {
        dataQueue.shift();
      }

      this.setState({
        dataQueue
      });

      setTimeout(() => {
        requestAnimationFrame(render);
      }, 10);
    }
    requestAnimationFrame(render);
  }

  componentDidMount() {
    let {
      height: chartHeight,
      width: chartWidth
    } = Dimensions.get('window');

    this.setState({
      chartWidth,
      chartHeight,
      distanceBetweenTwoPointsInChart: 5,
      maxAllowedAreaWidth: chartWidth / 2,
      maxAllowedAreaHeight: chartHeight * 0.8,
    });
  }

  render() {
    const {
      dataQueue,
      chartWidth,
      chartHeight,
      distanceBetweenTwoPointsInChart,
      maxAllowedAreaWidth,
      maxAllowedAreaHeight,
    } = this.state;

    const graphProps = {
      data: dataQueue,
      width: chartWidth,
      height: chartHeight,
      distanceBetweenTwoPoints: distanceBetweenTwoPointsInChart,
      maxAllowedAreaWidth,
      maxAllowedAreaHeight,
      xAccessor: (d) => d.time,
      yAccessor: (d) => d.value,
    };

    return (
      <Image source={require('./background.jpg')}>
        <AreaChart {...graphProps} />
      </Image>
    );
  }
}

export default App
