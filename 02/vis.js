/* global d3 Redux */

// This stateless component renders a static "wheel" made of circles,
// and rotates it depending on the value of props.angle.
const wheel = d3.component('g')
  .create(function () {
    const minRadius = 4;
    const maxRadius = 10;
    const numDots = 10;
    const wheelRadius = 40;
    const rotation = 0;
    const rotationIncrement = 3;

    const radius = d3.scaleLinear()
    .domain([0, numDots - 1])
    .range([maxRadius, minRadius]);

    const angle = d3.scaleLinear()
    .domain([0, numDots])
    .range([0, Math.PI * 2]);

    d3.select(this)
    .selectAll('circle').data(d3.range(numDots))
    .enter().append('circle')
      .attr('cx', d => Math.sin(angle(d)) * wheelRadius)
      .attr('cy', d => Math.cos(angle(d)) * wheelRadius)
      .attr('r', radius);
  })
  .render(function (d) {
    d3.select(this).attr('transform', `rotate(${d})`);
  });

// This component with a local timer makes the wheel spin.
const spinner = ((() => {
  const timer = d3.local();
  return d3.component('g')
    .create(function (d) {
      timer.set(this, d3.timer((elapsed) => {
        d3.select(this).call(wheel, elapsed * d.speed);
      }));
    })
    .render(function (d) {
      d3.select(this).attr('transform', `translate(${d.x},${d.y})`);
    })
    .destroy(function (d) {
      timer.get(this).stop();
      return d3.select(this)
        .attr('fill-opacity', 1)
        .transition().duration(3000)
          .attr('transform', `translate(${d.x},${d.y}) scale(10)`)
          .attr('fill-opacity', 0);
    });
})());

const axis = ((() => {
  const axisLocal = d3.local();
  return d3.component('g')
    .create(function (d) {
      axisLocal.set(this, d3[`axis${d.type}`]());
      d3.select(this)
        .attr('opacity', 0)
        .call(axisLocal.get(this)
          .scale(d.scale)
          .ticks(d.ticks || 10))
          .transition('opacity').duration(2000)
            .attr('opacity', 0.8);
    })
    .render(function (d) {
      d3.select(this)
        .attr('transform', `translate(${[
          d.translateX || 0,
          d.translateY || 0,
        ]})`)
        .transition('ticks').duration(3000)
          .call(axisLocal.get(this));
    });
})());

// This component displays the visualization.
const scatterPlot = ((() => {
  const xScale = d3.scaleLinear();
  const yScale = d3.scaleLinear();

  const colorScale = d3.scaleOrdinal()
    .range(d3.schemeCategory10);


  function render(d) {
    const x = d.x;
    const y = d.y;
    const color = d.color;
    const margin = d.margin;
    const innerWidth = d.width - margin.left - margin.right;
    const innerHeight = d.height - margin.top - margin.bottom;

    xScale
      .domain(d3.extent(d.data, d => d[x]))
      .range([0, innerWidth]);
    yScale
      .domain(d3.extent(d.data, d => d[y]))
      .range([innerHeight, 0]);
    colorScale
      .domain(d3.extent(d.data, d => d[color]));

    d3.select(this)
      .attr('transform', `translate(${margin.left},${margin.top})`)
      .call(axis, [
        {
          type: 'Left',
          scale: yScale,
          translateX: -12,
        },
        {
          type: 'Bottom',
          scale: xScale,
          translateY: innerHeight + 12,
          ticks: 20,
        },
      ]);

    const circles = d3.select(this).selectAll('.point').data(d.data);
    circles.exit().remove();
    circles
      .enter().append('circle')
        .attr('class', 'point')
        .attr('r', 0)
        .attr('cx', (d.width / 2) - margin.left)
        .attr('cy', (d.height / 2) - margin.top)
      .merge(circles)
        .on('mouseover', d.show)
        .on('mouseout', d.hide)
      .transition()
        .duration(2000)
        .delay((d, i) => i * 5)
        .attr('r', 10)
        .attr('cx', d => xScale(d[x]))
        .attr('cy', d => yScale(d[y]))
        .attr('color', d => colorScale(d[color]));
  }
  return d3.component('g')
    .render(render);
})());

// Use the d3-tip library for tooltips.
const tooltip = ((() => {
  const tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0]);
  return (svgSelection, state) => {
    // Wish we could use D3 here for DOM manipulation..
    tip.html(d => [
      `<h4>${d.year} ${d.name}</h4>`,
      `<div><strong>${state.x}: </strong>`,
      `<span>${d[state.x]}</span></div>`,
      `<div><strong>${state.y}: </strong>`,
      `<span>${d[state.y]}</span></div>`,
      `<div><strong>${state.color}: </strong>`,
      `<span>${d[state.color]}</span></div>`,
    ].join(''));
    svgSelection.call(tip);
    return {
      show: tip.show,
      hide: tip.hide,
    };
  };
})());

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
        .call(scatterPlot, d.loading ? [] : d, tipCallbacks);
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
    ], d);
    if (!d.loading && selection.style('opacity') === '0') {
      selection.transition().duration(2000)
          .style('opacity', 1);
    }
  });

const app = d3.component('div')
  .render(function (d) {
    d3.select(this).call(menus, d).call(svg, d);
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
