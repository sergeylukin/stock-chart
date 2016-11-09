import React, {
  Component,
  PropTypes,
} from 'react';

import ReactART from 'react-art';
const {
  Group,
  Shape,
  Surface,
} = ReactART;

import * as graphUtils from './chart-util';

export default class AreaChart extends Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    xAccessor: PropTypes.func.isRequired,
    yAccessor: PropTypes.func.isRequired,
  }

  static defaultProps = {
    width: 300,
    height: 300,
  };

  render() {
    const {
      data,
      width,
      height,
      xAccessor,
      yAccessor,
    } = this.props;

    const lineGraph = graphUtils.createLineGraph({
      data,
      width,
      height,
      xAccessor,
      yAccessor,
    });

    return (
      <Surface width={width} height={height}>
        <Group x={0} y={0}>
          <Shape
            d={lineGraph.path}
            fill={ "rgba(0, 0, 0, .3)" }
            strokeWidth={1}
          />
        </Group>
      </Surface>
    );
  }
}
