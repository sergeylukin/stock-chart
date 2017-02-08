import React, {
  Component,
  PropTypes,
} from "react"
/* eslint-disable
   import/no-extraneous-dependencies,
   import/no-unresolved */
import ReactART from "ReactNativeART"
/* eslint-enable
   import/no-extraneous-dependencies,
   import/no-unresolved */

const {
  Group,
  Shape,
  Surface,
} = ReactART

export default class AreaChart extends Component {

  static propTypes = {
    areaPath: PropTypes.any.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    maxAllowedAreaHeight: PropTypes.number.isRequired,
    className: PropTypes.string,
  }

  static defaultProps = {
    width: 300,
    height: 300,
  }

  state = {
    isMouseInside: false,
    areaPath: "",
  }

  constructor(props) {
    super(props)
    this.handleMouseEnter = this.handleMouseEnter.bind(this)
    this.handleMouseLeave = this.handleMouseLeave.bind(this)
  }

  handleMouseEnter() {
    this.setState({ isMouseInside: true })
  }
  handleMouseLeave() {
    this.setState({ isMouseInside: false })
  }

  render() {
    const {
      width,
      height,
      maxAllowedAreaHeight,
      className,
    } = this.props

    const {
      areaPath,
    } = this.state

    const yOffset = height - maxAllowedAreaHeight

    const fillColor = this.state.isMouseInside
      ? "rgba(0, 0, 0, .5)"
      : "rgba(34, 92, 127, .8)"

    return (
      <Surface
        width={ width }
        height={ height }
        style={{ backgroundColor: "transparent" }}
        className={ className }
      >
        <Group x={ 0 } y={ yOffset }>
          <Shape
            d={ areaPath }
            fill={ fillColor }
            onMouseOver={ this.handleMouseEnter }
            onMouseOut={ this.handleMouseLeave }
          />
        </Group>
      </Surface>
    )
  }
}
