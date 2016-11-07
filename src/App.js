import React, { Component } from 'react';
import './App.css';

import moment from 'moment';
import AreaChart from './AreaChart';

// Our array of data we're graphing.
const data = [
  {time: +moment("2016-11-01 05:25:00").format("X"), value: 83.24},
  {time: +moment("2016-11-01 05:25:01").format("X"), value: 85.35},
  {time: +moment("2016-11-01 05:25:02").format("X"), value: 98.84},
  {time: +moment("2016-11-01 05:25:03").format("X"), value: 79.92},
  {time: +moment("2016-11-01 05:25:04").format("X"), value: 83.80},
  {time: +moment("2016-11-01 05:25:05").format("X"), value: 88.47},
  {time: +moment("2016-11-01 05:25:06").format("X"), value: 94.47},
];

class App extends Component {
  render() {
    const graphProps = {
      data,
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
