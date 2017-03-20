/* global d3 Redux wheel spinner axis scatterplot tooltip app */

function loadData(actions) {
  const numericColumns = [
    'acceleration',
    'cylinders',
    'displacement',
    'horsepower',
    'weight',
    'year',
    'mpg',
  ];

  const ordinalColumns = [
    'cylinders',
    'origin',
    'year',
  ];

  setTimeout(() => { // Show off the spinner for a few seconds ;)
    d3.csv('auto-mpg.csv', type, (data) => {
      actions.ingestData(data, numericColumns, ordinalColumns);
    });
  }, 2000);

  function type(d) {
    return numericColumns.reduce((d, column) => {
      d[column] = +d[column];
      return d;
    }, d);
  }
}

function reducer(state, action) {
  state = state || {
    width: 960,
    height: 500 - 38,
    loading: true,
    margin: { top: 12, right: 12, bottom: 40, left: 50 },
    x: 'acceleration',
    y: 'horsepower',
    color: 'cylinders',
    radius: 'weight',
  };
  switch (action.type) {
    case 'INGEST_DATA':
      return Object.assign({}, state, {
        loading: false,
        data: action.data,
        numericColumns: action.numericColumns,
        ordinalColumns: action.ordinalColumns,
      });
    case 'SET_X':
      return Object.assign({}, state, { x: action.column });
    case 'SET_Y':
      return Object.assign({}, state, { y: action.column });
    case 'SET_COLOR':
      return Object.assign({}, state, { color: action.column });
    case 'SET_RADIUS':
      return Object.assign({}, state, { radius: action.column });
    default:
      return state;
  }
}

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
