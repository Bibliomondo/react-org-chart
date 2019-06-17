const { createElement, PureComponent } = require('react')
const { render } = require('react-dom')
const { init } = require('../chart')

class OrgChart extends PureComponent {
  render() {
    const { id } = this.props

    return createElement('div', {
      id
    })
  }

  static defaultProps = {
    id: 'react-org-chart'
  }

  renderFn(d) {
    const div = document.createElement('div');
    render(this.props.renderFn(d), div);
    return div;
  }

  componentDidMount() {
    const { id, tree, renderFn, ...options } = this.props

    init({ id: `#${id}`, data: tree, renderFn: renderFn ? this.renderFn.bind(this) : undefined, ...options })
  }
}

module.exports = OrgChart
