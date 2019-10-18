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
  };

  renderFn(d, action) {
    if(action === "enter") {
      const div = document.createElement('div');
      const portal = createPortal(this.props.renderFn(d), div);
      this.setState((state) => ({ portals: Object.assign({}, state.portals, { [d.id]: portal }) }));
      return div;
    } else if(action === "update" && this.state.portals[d.id]) {
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

    this._orgChart = init({ id: `#${id}`, data: tree, renderFn: renderFn ? this.renderFn.bind(this) : undefined, ...options })
  }

  componentDidUpdate(oldProps) {
    if(oldProps.tree !== this.props.tree && this.props.renderFn) {
      const updateContent = (d) => {
        if(d.id) {
          this.renderFn(d, 'update');
        }
        if(d.children) {
          d.children.forEach(updateContent);
        }
      };
      updateContent(this.props.tree);
    }
  }

  addZoom(zoom, duration) {
    if(this._orgChart) {
      this._orgChart.zoom.scale(this._orgChart.zoom.scale() + zoom);
      this._orgChart.zoom.event(this._orgChart.svgroot.transition(duration || 400));
    }
  }

  setZoom(zoom, duration) {
    if(this._orgChart) {
      this._orgChart.zoom.scale(zoom);
      this._orgChart.zoom.event(this._orgChart.svgroot.transition(duration || 400));
    }
  }

  resize() {
    if(this._orgChart) {
      this._orgChart.resize();
    }
  }
}

module.exports = OrgChart;
