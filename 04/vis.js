/* global d3 Redux wheel spinner axis scatterplot tooltip app loadData reducer actionsFromDispatch */


function main() {
  const store = Redux.createStore(reducer);
  const actions = actionsFromDispatch(store.dispatch);
  const renderApp = () => {
    d3.select('body').call(app, store.getState(), actions);
  };
  renderApp();
  store.subscribe(renderApp);
  loadData(actions);
}

// call main() to run the app
main();
