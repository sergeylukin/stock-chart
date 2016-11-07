import React, {
  Component,
  PropTypes,
} from 'react';

import * as graphUtils from './chart-util';

const PaddingSize = 20;

export default class AreaChart extends Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    xAccessor: PropTypes.func.isRequired,
    yAccessor: PropTypes.func.isRequired,
  }

  static defaultProps = {
    width: Math.round(window.innerWidth * 0.9),
    height: Math.round(window.innerHeight * 0.5),
  };

  state = {
    graphWidth: 0,
    graphHeight: 0,
    linePath: '',
  };

  componentWillMount() {
    this.computeNextState(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.computeNextState(nextProps);
  }

  computeNextState(nextProps) {
    const {
      data,
      width,
      height,
      xAccessor,
      yAccessor,
    } = nextProps;

    const graphWidth = width - PaddingSize * 2;
    const graphHeight = height - PaddingSize * 2;

    const lineGraph = graphUtils.createLineGraph({
      data,
      xAccessor,
      yAccessor,
      width: graphWidth,
      height: graphHeight,
    });
    console.log(data);
    console.log(lineGraph);

    this.setState({
      graphWidth,
      graphHeight,
      linePath: lineGraph.path,
    });
  }

  render() {
    const {
      graphWidth,
      graphHeight,
      linePath,
    } = this.state;

    return (
      <svg width={graphWidth} height={graphHeight}>
        <g x={0} y={0}>
          <path
            d={linePath}
            fill={ "rgba(0, 0, 0, .3)" }
            strokeWidth={1}
          />
        </g>
      </svg>
    );
  }
}
