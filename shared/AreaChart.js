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
    linePath: PropTypes.any.isRequired,
    circlePath: PropTypes.any.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    className: PropTypes.string,
  }

  static defaultProps = {
    width: 300,
    height: 300,
  }

  state = {
    isMouseInside: false,
    prevAreaPath: "",
    areaPath: {},
    linePath: {},
    circlePath: {},
  }

  constructor(props) {
    super(props)
    this.handleMouseEnter = this.handleMouseEnter.bind(this)
    this.handleMouseLeave = this.handleMouseLeave.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      areaPath: nextProps.areaPath,
      linePath: nextProps.linePath,
      circlePath: nextProps.circlePath,
    })

    const render = (start = null) => {
      requestAnimationFrame((timestamp) => {
        if (!start) start = timestamp
        const delta = (timestamp - start) / 500
        if (delta > 1) return
        this.state.areaPath.tween(delta)
        this.state.linePath.tween(delta)
        this.state.circlePath.tween(delta)
        this.setState(this.state)
        render(start)
      })
    }
    render()
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
      className,
    } = this.props

    const {
      areaPath,
      linePath,
      circlePath,
    } = this.state

    const yOffset = 0

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
          <Shape
            d={ linePath }
            stroke={ "#fff" }
            strokeWidth={ 2 }
          />
          <Shape d={ circlePath } fill={ "orange" } />
        </Group>
      </Surface>
    )
  }
}
