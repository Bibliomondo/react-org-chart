const { createElement, PureComponent, Fragment } = require('react')
const { createPortal } = require('react-dom')
const { init } = require('../chart')

class OrgChart extends PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      portals: {},
    };
  }

  render() {
    const { id } = this.props

    return createElement(Fragment, null, Object.values(this.state.portals).concat([
      createElement('div', {
        key: 'rendering',
        id
      })
    ]))
  }

  static defaultProps = {
    id: 'react-org-chart'
  }

  renderFn(d, action) {
    if(action === "enter") {
      const div = document.createElement('div');
      const portal = createPortal(this.props.renderFn(d), div);
      this.setState((state) => ({ portals: Object.assign({}, state.portals, { [d.id]: portal }) }));
      return div;
    } if(action === "update") {
      const div = this.state.portals[d.id].containerInfo;
      const portal = createPortal(this.props.renderFn(d), div);
      this.setState((state) => ({ portals: Object.assign({}, state.portals, { [d.id]: portal }) }));
    } else if (action === "exit") {
      this.setState((state) => {
        const portals = Object.assign({}, state.portals);
        delete portals[d.id];
        return { portals };
      });
    }
  }

  componentDidMount() {
    const { id, tree, renderFn, ...options } = this.props

    init({ id: `#${id}`, data: tree, renderFn: renderFn ? this.renderFn.bind(this) : undefined, ...options })
  }
}

module.exports = OrgChart
