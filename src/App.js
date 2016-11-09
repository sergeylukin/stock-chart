import React, { Component } from 'react';
import './App.css';

import moment from 'moment';
import AreaChart from './AreaChart';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // Our array of data we're graphing.
      data: [
        {time: +moment("2016-11-01 05:25:00").format("X"), value: 83.24},
        {time: +moment("2016-11-01 05:25:01").format("X"), value: 85.35},
        {time: +moment("2016-11-01 05:25:02").format("X"), value: 98.84},
        {time: +moment("2016-11-01 05:25:03").format("X"), value: 79.92},
        {time: +moment("2016-11-01 05:25:04").format("X"), value: 83.80},
        {time: +moment("2016-11-01 05:25:05").format("X"), value: 88.47},
        {time: +moment("2016-11-01 05:25:06").format("X"), value: 94.47},
      ],
    };
  }

  componentDidMount() {
    let render = () => {
      let data = this.state.data;
      data.push({
        time: +moment(data[data.length - 1].time).add(1, 's'),
        value: (Math.floor(Math.random() * (100 - 80 + 1)) + 80),
      });
      this.setState({
        data
      });
      setTimeout(() => {
        window.requestAnimationFrame(render);
      }, 1000);
    }
    window.requestAnimationFrame(render);
  }

  render() {
    const graphProps = {
      data: this.state.data,
      width: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
      height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
      xAccessor: (d) => d.time,
      yAccessor: (d) => d.value,
    };

    return (
      <div className="App">
        <AreaChart {...graphProps} />
      </div>
    );
  }
}

export default App;
