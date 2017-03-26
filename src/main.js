import loadData from './loadData';
import app from './app';

import * as d3 from 'd3';

export default function main(app) {
  const store = Redux.createStore(reducer);
  const actions = actionsFromDispatch(store.dispatch);
  const renderApp = () => {
    d3.select('body').call(app, store.getState(), actions);
  };
  renderApp();
  store.subscribe(renderApp);
  loadData(actions);
}
