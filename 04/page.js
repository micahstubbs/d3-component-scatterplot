/* global d3 spinner scatterplot tooltip */

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
