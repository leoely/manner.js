import React from 'react';
import style from './index.module.css';
import WebApp from '~/component/WebApp';
import location from '~/obj/location';
import Emitter from '~/class/Emitter';

const emitter = new Emitter();

class Router extends WebApp {
  constructor(props) {
    super(props);
    this.route =  {};
    this.component = {};
    this.state = {
      loading: true,
      location: '/',
    };
  }

  async componentDidMount() {
    await this.bindEvent();
    emitter.send('page' + window.location.pathname);
  }

  bindEvent() {
    location.onChange((location) => {
      this.setState({
        location,
        loading: true,
      });
    });
    const { bindOwnRoutes, } = this;
    if (typeof bindOwnRoutes === 'function') {
      this.addRemoteRoutes();
    }
  }

  addRoute(path, component) {
    const { route, } = this;
    if (route[path] === undefined) {
      route[path] = component;
    }
    return route[path];
  }

  async getPage(path) {
    const { component, } = this;
    if (component[path] === undefined) {
      const Page = this.route[path];
      if (Page !== undefined) {
        component[path] = <Page />;
      } else {
        this.setState({ loading: true, });
        const { NotFound, } = this.props;
        if (NotFound === undefined) {
          this.props.NotFound = await import('~/client/page/NotFound');
        }
        this.setState({ loading: false, });
        return <NotFound />;
      }
    }
    return component[path];
  }

  render() {
    const { location, minize, update, loading, } = this.state;
    let router;
    if (loading === true) {
      const { Loading, } = this.props;
      if (Loading) {
        router = <Loading />;
      } else {
        router = null;
      }
    } else {
      const { UpdateConfirm, } = this.props;
      const Page = this.getPage(location);
      router =
        <div id="page" className={style.page}>
          <Page />
          {update && <UpdateConfirm />}
        </div>;
    }
    return router;
  }
}

export default Router;
