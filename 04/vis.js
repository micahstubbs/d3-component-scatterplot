/* global d3 Redux wheel spinner axis scatterplot tooltip */

// This component manages an svg element, and
// either displays a spinner or text,
// depending on the value of the `loading` state.
const svg = d3.component('svg')
  .render(function (d) {
    const svgSelection = d3.select(this)
      .attr('width', d.width)
      .attr('height', d.height)
      .call(spinner, !d.loading ? [] : {
        x: d.width / 2,
        y: d.height / 2,
        speed: 0.2,
      });
    const tipCallbacks = tooltip(svgSelection, d);
    svgSelection
        .call(scatterplot, d.loading ? [] : d, tipCallbacks);
  });

const label = d3.component('label', 'col-sm-2 col-form-label')
  .render(function (d) {
    d3.select(this).text(d);
  });

const option = d3.component('option')
  .render(function (d) {
    d3.select(this).text(d);
  });

const select = d3.component('select', 'form-control')
  .render(function (d) {
    d3.select(this)
        .call(option, d.columns)
        .property('value', d.value)
        .on('change', function () {
          d.action(this.value);
        });
  });

const rowComponent = d3.component('div', 'row');
const colSm10 = d3.component('div', 'col-sm-10');
const menu = d3.component('div', 'col-sm-4')
  .render(function (d) {
    const row = rowComponent(d3.select(this)).call(label, d.label);
    colSm10(row).call(select, d);
  });

const menus = d3.component('div', 'container-fluid')
  .create(function () {
    d3.select(this).style('opacity', 0);
  })
  .render(function (d) {
    const selection = d3.select(this);
    rowComponent(selection).call(menu, [
      {
        label: 'X',
        value: d.x,
        action: d.setX,
        columns: d.numericColumns,
      },
      {
        label: 'Y',
        value: d.y,
        action: d.setY,
        columns: d.numericColumns,
      },
      {
        label: 'Color',
        value: d.color,
        action: d.setColor,
        columns: d.ordinalColumns,
      },
      {
        label: 'Radius',
        value: d.radius,
        action: d.setRadius,
        columns: d.numericColumns,
      },
    ], d);
    if (!d.loading && selection.style('opacity') === '0') {
      selection.transition().duration(2000)
          .style('opacity', 1);
    }
  });

const app = d3.component('div')
  .render(function (d) {
    d3.select(this).call(svg, d).call(menus, d);
  });

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
