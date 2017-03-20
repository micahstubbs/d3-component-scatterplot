/* global d3 Redux wheel spinner axis scatterplot tooltip app loadData reducer */

function actionsFromDispatch(dispatch) {
  return {
    ingestData(data, numericColumns, ordinalColumns) {
      dispatch({
        type: 'INGEST_DATA',
        data,
        numericColumns,
        ordinalColumns,
      });
    },
    setX(column) {
      dispatch({ type: 'SET_X', column });
    },
    setY(column) {
      dispatch({ type: 'SET_Y', column });
    },
    setColor(column) {
      dispatch({ type: 'SET_COLOR', column });
    },
    setRadius(column) {
      dispatch({ type: 'SET_RADIUS', column });
    },
  };
}

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
