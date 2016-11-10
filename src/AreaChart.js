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
  constructor(props) {
    super(props);
    this.state = { isMouseInside: false};
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
  }

  handleMouseEnter() {
    this.setState({ isMouseInside: true});
  }
  handleMouseLeave() {
    this.setState({ isMouseInside: false});
  }

  static propTypes = {
    data: PropTypes.array.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    distanceBetweenTwoPoints: PropTypes.number.isRequired,
    maxAllowedAreaWidth: PropTypes.number.isRequired,
    xAccessor: PropTypes.func.isRequired,
    yAccessor: PropTypes.func.isRequired,
    className: PropTypes.string,
  }

  static defaultProps = {
    width: 300,
    height: 300,
    distanceBetweenTwoPoints: 50,
    maxAllowedAreaWidth: 150,
  };

  render() {
    const {
      data,
      width,
      height,
      distanceBetweenTwoPoints,
      maxAllowedAreaWidth,
      maxAllowedAreaHeight,
      xAccessor,
      yAccessor,
      className,
    } = this.props;

    if (data.length === 0) {
      return <Surface />
    }

    const areaPath = graphUtils.createArea({
      data,
      width,
      distanceBetweenTwoPoints,
      maxAllowedAreaWidth,
      maxAllowedAreaHeight,
      xAccessor,
      yAccessor,
    });

    const linePath = graphUtils.createLine({
      data,
      width,
      distanceBetweenTwoPoints,
      maxAllowedAreaWidth,
      maxAllowedAreaHeight,
      xAccessor,
      yAccessor,
    });

    const {
      x: circleX,
      y: circleY,
    } = graphUtils.getCoordinatesOfLastItem({
      data,
      width,
      distanceBetweenTwoPoints,
      maxAllowedAreaWidth,
      maxAllowedAreaHeight,
      xAccessor,
      yAccessor,
    });

    const circlePath = graphUtils.createCircle({
      size: 128
    });

    const yOffset = height - maxAllowedAreaHeight;

    const fillColor = this.state.isMouseInside
      ? "rgba(0, 0, 0, .5)"
      : "rgba(34, 92, 127, .8)";

    return (
      <Surface width={ width } height={ height } className={ className }>
        <Group x={ 0 } y={ yOffset }>
          <Shape
            d={ areaPath }
            fill={ fillColor }
            onMouseOver={this.handleMouseEnter}
            onMouseOut={this.handleMouseLeave}
          />
          <Shape
            d={ linePath }
            stroke={ "#fff" }
            strokeWidth={ 2 }
          />
          <Group x={ circleX } y={ circleY }>
            <Shape d={ circlePath } fill={ "orange" } />
          </Group>
        </Group>
      </Surface>
    );
  }
}
