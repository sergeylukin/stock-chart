// @flow

import React, { Component } from "react"
import moment from "moment"

import "./App.css"
import AreaChart from "../shared/AreaChart"

const str: string = "hello world!"
console.log(str)

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
    this.updateViewportDimensions()

    const render = () => {
      const {
        dataQueue,
        distanceBetweenTwoPointsInChart,
        maxAllowedAreaWidth,
      } =  this.state

      let lastTimestamp
      let lastYValue

      if (dataQueue.length === 0) {
        lastTimestamp = +moment("2016-11-01 05:25:00").format("X")
        lastYValue = 0
      }
      else {
        lastTimestamp = dataQueue[dataQueue.length - 1].time
        lastYValue = dataQueue[dataQueue.length - 1].value
      }

      let value =
          lastYValue
        + (Math.floor(Math.random() * (2 - 1 + 1)) + 1)
        * (Math.random() < 0.5 ? -1 : 1)
      if (value < 10) {
        value = 10
      }

      dataQueue.push({
        time: +moment(lastTimestamp).add(1, "s"),
        value,
      })

      // Shift the queue if we have more items we can show
      const currentAreaWidth =
          dataQueue.length
        * distanceBetweenTwoPointsInChart
        - distanceBetweenTwoPointsInChart
      if (currentAreaWidth > maxAllowedAreaWidth) {
        dataQueue.shift()
      }

      this.setState({
        dataQueue,
      })

      setTimeout(() => {
        window.requestAnimationFrame(render)
      }, 80)
    }
    window.requestAnimationFrame(render)
  }

  componentDidMount() {
    window.addEventListener("resize",
                            this.updateViewportDimensions.bind(this))
    window.addEventListener("orientationchange",
                            this.updateViewportDimensions.bind(this))
  }

  updateViewportDimensions() {
    const chartWidth = Math.max(
      document.documentElement.clientWidth,
      window.innerWidth || 0)
    const chartHeight = Math.max(
      document.documentElement.clientHeight,
      window.innerHeight || 0)

    this.setState({
      chartWidth,
      chartHeight,
      distanceBetweenTwoPointsInChart: 5,
      maxAllowedAreaWidth: chartWidth / 2,
      maxAllowedAreaHeight: chartHeight > 300
        ? chartHeight / 2
        : chartHeight * 0.8,
    })
  }

  render() {
    const {
      dataQueue,
      chartWidth,
      chartHeight,
      distanceBetweenTwoPointsInChart,
      maxAllowedAreaWidth,
      maxAllowedAreaHeight,
    } = this.state

    const graphProps = {
      data: dataQueue,
      width: chartWidth,
      height: chartHeight,
      distanceBetweenTwoPoints: distanceBetweenTwoPointsInChart,
      maxAllowedAreaWidth,
      maxAllowedAreaHeight,
      xAccessor: (d) => d.time,
      yAccessor: (d) => d.value,
    }

    return (
      <div className="App">
        <AreaChart { ...graphProps } />
      </div>
    )
  }
}

export default App
