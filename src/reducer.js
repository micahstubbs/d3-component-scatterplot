/* eslint-disable */

function reducer(state, action) {
  state = state || {
    width: 960,
    height: 500 - 88,
    loading: true,
    margin: { top: 12, right: 12, bottom: 40, left: 50 },
    x: 'horsepower',
    y: 'mpg',
    color: 'cylinders',
    radius: 'year',
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
