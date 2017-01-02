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
      chartHeight,
    } = this.state

    const width = chartWidth
    const height = chartHeight

    const xAccessor = (d) => d.time
    const yAccessor = (d) => d.value

    const prevLinePath = createLine({
      data: dataQueue,
      width,
      height,
      xAccessor,
      yAccessor,
    })

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

    const sec = Math.floor(Math.random() * 5) + 1
    dataQueue.push({
      time: +moment(lastTimestamp).add(sec, "s"),
      value,
    })

    let linePath = createLine({
      data: dataQueue,
      width,
      height,
      xAccessor,
      yAccessor,
    })

    console.log("PREV LINE PATH: ", prevLinePath)
    console.log("LINE PATH: ", linePath)

    // M0,0L10,10L30,30L40.07,92.4L50.07,81.8

    if (dataQueue.length > 10) {
      const last2Ticks = linePath.match(/L([^,]+),([^,L]+)L([^,]+),([^,]+)$/)
      const prelastTickX = last2Ticks[1]
      const lastTickX = last2Ticks[3]
      const distanceBetweenLast2Ticks = lastTickX - prelastTickX
      console.log("distanceBetweenLast2Ticks", distanceBetweenLast2Ticks)

      linePath = createLine({
        data: dataQueue,
        width: width + distanceBetweenLast2Ticks,
        height,
        xAccessor,
        yAccessor,
      })

      linePath = linePath
        .replace(/([ML])([^,]+)/g, (match, cmd, x) => (
          `${cmd}${(x - distanceBetweenLast2Ticks)}`
        ))
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
    const viewportWidth = Math.max(
      document.documentElement.clientWidth,
      window.innerWidth || 0)
    const viewportHeight = Math.max(
      document.documentElement.clientHeight,
      window.innerHeight || 0)

    this.setState({
      chartWidth: viewportWidth / 2,
      chartHeight: viewportHeight > 300
        ? viewportHeight / 2
        : viewportHeight * 0.8,
    })
  }

  render() {
    const {
      areaPath,
      linePath,
      circlePath,
      chartWidth,
      chartHeight,
    } = this.state

    const graphProps = {
      areaPath,
      linePath,
      circlePath,
      width: chartWidth,
      height: chartHeight,
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
