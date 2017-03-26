(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('d3'), require('redux')) :
	typeof define === 'function' && define.amd ? define(['d3', 'redux'], factory) :
	(global.d3ComponentScatterplot = factory(global.d3,global.Redux));
}(this, (function (d3,Redux) { 'use strict';

Redux = 'default' in Redux ? Redux['default'] : Redux;

function drawWheel() {
  // This stateless component renders a static "wheel" made of circles,
  // and rotates it depending on the value of props.angle.
  var wheel = d3.component('g').create(function () {
    var minRadius = 4;
    var maxRadius = 10;
    var numDots = 10;
    var wheelRadius = 40;
    var rotation = 0;
    var rotationIncrement = 3;

    var radius = d3.scaleLinear().domain([0, numDots - 1]).range([maxRadius, minRadius]);

    var angle = d3.scaleLinear().domain([0, numDots]).range([0, Math.PI * 2]);

    d3.select(this).selectAll('circle').data(d3.range(numDots)).enter().append('circle').attr('cx', function (d) {
      return Math.sin(angle(d)) * wheelRadius;
    }).attr('cy', function (d) {
      return Math.cos(angle(d)) * wheelRadius;
    }).attr('r', radius);
  }).render(function (d) {
    d3.select(this).attr('transform', 'rotate(' + d + ')');
  });
}

function loadData(actions) {
  var numericColumns = ['acceleration', 'cylinders', 'displacement', 'horsepower', 'weight', 'year', 'mpg'];

  var ordinalColumns = ['cylinders', 'origin', 'year'];

  setTimeout(function () {
    // Show off the spinner for a few seconds ;)
    d3.csv('auto-mpg.csv', type, function (data) {
      actions.ingestData(data, numericColumns, ordinalColumns);
    });
  }, 2000);

  function type(d) {
    return numericColumns.reduce(function (d, column) {
      d[column] = +d[column];
      return d;
    }, d);
  }
}

/* eslint-disable */
/* global d3 spinner scatterplot tooltip window document */

var dV = document;
var gV = dV.getElementsByTagName('body')[0];
// This component manages an svg element, and
// either displays a spinner or text,
// depending on the value of the `loading` state.
var svg = d3.component('svg').render(function (d) {
  var svgSelection = d3.select(this).attr('width', d.width).attr('height', d.height).call(spinner, !d.loading ? [] : {
    x: d.width / 2,
    y: d.height / 2,
    speed: 0.2
  });
  var tipCallbacks = tooltip(svgSelection, d);
  svgSelection.call(scatterplot, d.loading ? [] : d, tipCallbacks);
});

var label = d3.component('label', 'col-sm-2 col-form-label').render(function (d) {
  d3.select(this).text(d);
});

var option = d3.component('option').render(function (d) {
  d3.select(this).text(d);
});

var select$1 = d3.component('select', 'form-control').render(function (d) {
  d3.select(this).call(option, d.columns).property('value', d.value).on('change', function () {
    d.action(this.value);
  });
});

var rowComponent = d3.component('div', 'row');
var colSm10 = d3.component('div', 'col-sm-10');
var menu = d3.component('div', 'col-sm-4').render(function (d) {
  var row = rowComponent(d3.select(this)).call(label, d.label);
  colSm10(row).call(select$1, d);
});

var menus = d3.component('div', 'container-fluid').create(function () {
  d3.select(this).style('opacity', 0);
}).render(function (d) {
  var selection = d3.select(this);
  rowComponent(selection).call(menu, [{
    label: 'X',
    value: d.x,
    action: d.setX,
    columns: d.numericColumns
  }, {
    label: 'Y',
    value: d.y,
    action: d.setY,
    columns: d.numericColumns
  }, {
    label: 'Color',
    value: d.color,
    action: d.setColor,
    columns: d.ordinalColumns
  }, {
    label: 'Radius',
    value: d.radius,
    action: d.setRadius,
    columns: d.numericColumns
  }], d);
  if (!d.loading && selection.style('opacity') === '0') {
    selection.transition().duration(2000).style('opacity', 1);
  }
});

var app = d3.component('div').render(function (d) {
  d3.select(this).call(svg, d).call(menus, d);
});

function reducer(state, action) {
  state = state || {
    width: 960,
    height: 500 - 88,
    loading: true,
    margin: { top: 12, right: 12, bottom: 40, left: 50 },
    x: 'horsepower',
    y: 'mpg',
    color: 'cylinders',
    radius: 'year'
  };
  switch (action.type) {
    case 'INGEST_DATA':
      return Object.assign({}, state, {
        loading: false,
        data: action.data,
        numericColumns: action.numericColumns,
        ordinalColumns: action.ordinalColumns
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
    ingestData: function ingestData(data, numericColumns, ordinalColumns) {
      dispatch({
        type: 'INGEST_DATA',
        data: data,
        numericColumns: numericColumns,
        ordinalColumns: ordinalColumns
      });
    },
    setX: function setX(column) {
      dispatch({ type: 'SET_X', column: column });
    },
    setY: function setY(column) {
      dispatch({ type: 'SET_Y', column: column });
    },
    setColor: function setColor(column) {
      dispatch({ type: 'SET_COLOR', column: column });
    },
    setRadius: function setRadius(column) {
      dispatch({ type: 'SET_RADIUS', column: column });
    }
  };
}

function main(app$$1) {
  var store = Redux.createStore(reducer);
  var actions = actionsFromDispatch(store.dispatch);
  var renderApp = function renderApp() {
    d3.select('body').call(app$$1, store.getState(), actions);
  };
  renderApp();
  store.subscribe(renderApp);
  loadData(actions);
}

// script-tag-globals d3 Redux loadData reducer actionsFromDispatch app
function drawVis() {
  // import * as d3 from 'd3';
  // import Redux from 'redux';
  drawWheel();

  // call main() to run the app
  main();
}

var index = function () {
  drawVis();
};

return index;

})));
