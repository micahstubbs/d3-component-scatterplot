import * as d3 from 'd3';
import Redux from 'redux';

import loadData from './loadData';
import app from './page';
import reducer from './reducer';
import actionsFromDispatch from './actionsFromDispatch';

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
