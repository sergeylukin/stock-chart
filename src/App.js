// @flow

import React, { Component } from "react"
import moment from "moment"
import Morph from "art/morph/path"

import {
  createCircle,
  createLine,
} from "../shared/chart-util"
import "./App.css"
import AreaChart from "../shared/AreaChart"

const str: string = "hello world!"
console.log(str)

class App extends Component {

  state = {
    areaPath: () => {},
    linePath: () => {},
    circlePath: () => {},
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

  constructor(props: Object) {
    super(props)
    this.handleAddPointButtonClick = this.handleAddPointButtonClick.bind(this)
  }

  componentWillMount() {
    this.updateViewportDimensions()
  }

  componentDidMount() {
    window.addEventListener("resize",
                            this.updateViewportDimensions.bind(this))
    window.addEventListener("orientationchange",
                            this.updateViewportDimensions.bind(this))
  }

  handleAddPointButtonClick() {
    const {
      dataQueue,
      chartWidth,
      distanceBetweenTwoPointsInChart,
      maxAllowedAreaWidth,
      maxAllowedAreaHeight,
    } = this.state

    const width = chartWidth
    const distanceBetweenTwoPoints = distanceBetweenTwoPointsInChart

    const xAccessor = (d) => d.time
    const yAccessor = (d) => d.value

    const prevDataQueue = [ ...dataQueue ]

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

    const prevLinePath = createLine({
      data: prevDataQueue,
      width,
      distanceBetweenTwoPoints,
      maxAllowedAreaWidth,
      maxAllowedAreaHeight,
      xAccessor,
      yAccessor,
    })

    let linePath = createLine({
      data: dataQueue,
      width,
      distanceBetweenTwoPoints,
      maxAllowedAreaWidth,
      maxAllowedAreaHeight,
      xAccessor,
      yAccessor,
    })

    // const prevLinePath = linePath.replace(/L[^,]+,[^,]+$/, "")

    const currentAreaWidth =
        dataQueue.length
      * distanceBetweenTwoPointsInChart
      - distanceBetweenTwoPointsInChart
    if (currentAreaWidth > maxAllowedAreaWidth) {
      linePath = linePath
        .replace(/([ML])([^,]+)/g, (match, cmd, x) => `${cmd}${(x - 50)}`)
      dataQueue.shift()
    }

    let prevAreaPath
    if (dataQueue.length > 2) {
      let lastTickXCoordinate = 0
      let lastTickYCoordinate = 0

      const lastTickCoordinates = prevLinePath.match(/L([^,]+),([^,]+)$/)
      if (lastTickCoordinates) {
        lastTickXCoordinate = lastTickCoordinates[1]
        lastTickYCoordinate = lastTickCoordinates[2]
      }

      prevAreaPath =
          `M${lastTickXCoordinate},${lastTickYCoordinate}
           L${lastTickXCoordinate},1000
           L0,1000
           L${prevLinePath.substr(1)}`
    }
    else {
      prevAreaPath = prevLinePath
    }

    let areaPath
    if (dataQueue.length > 1) {
      let lastTickXCoordinate = 0
      let lastTickYCoordinate = 0

      const lastTickCoordinates = linePath.match(/L([^,]+),([^,]+)$/)
      if (lastTickCoordinates) {
        lastTickXCoordinate = lastTickCoordinates[1]
        lastTickYCoordinate = lastTickCoordinates[2]
      }

      areaPath =
          `M${lastTickXCoordinate},${lastTickYCoordinate}
           L${lastTickXCoordinate},1000
           L0,1000
           L${linePath.substr(1)}`
    }
    else {
      areaPath = linePath
    }

    const prevLastCoordinate = prevLinePath.match(/[ML]([^,]+),([^,]+)$/)
    let prevCircleX = 0
    let prevCircleY = 0
    if (prevLastCoordinate) {
      prevCircleX = parseInt(prevLastCoordinate[1], 10)
      prevCircleY = parseInt(prevLastCoordinate[2], 10)
    }
    const lastCoordinate = linePath.match(/[ML]([^,]+),([^,]+)$/)
    let circleX = 0
    let circleY = 0
    if (lastCoordinate) {
      circleX = parseInt(lastCoordinate[1], 10)
      circleY = parseInt(lastCoordinate[2], 10)
    }

    const prevCirclePath = createCircle({
      x: prevCircleX,
      y: prevCircleY,
      size: 5,
    })

    const circlePath = createCircle({
      x: circleX,
      y: circleY,
      size: 5,
    })

    this.setState({
      dataQueue,
      areaPath: Morph.Tween(prevAreaPath, areaPath),
      linePath: Morph.Tween(prevLinePath, linePath),
      circlePath: Morph.Tween(prevCirclePath, circlePath),
    })
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
      distanceBetweenTwoPointsInChart: 50,
      maxAllowedAreaWidth: chartWidth / 2,
      maxAllowedAreaHeight: chartHeight > 300
        ? chartHeight / 2
        : chartHeight * 0.8,
    })
  }

  render() {
    const {
      areaPath,
      linePath,
      circlePath,
      chartWidth,
      chartHeight,
      distanceBetweenTwoPointsInChart,
      maxAllowedAreaWidth,
      maxAllowedAreaHeight,
    } = this.state

    const graphProps = {
      areaPath,
      linePath,
      circlePath,
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
        <button onClick={ this.handleAddPointButtonClick }>
          { "Add point" }
        </button>

        <AreaChart { ...graphProps } />

      </div>
    )
  }
}

export default App
