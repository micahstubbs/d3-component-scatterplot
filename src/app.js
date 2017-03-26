import * as d3 from 'd3';

export const app = d3.component('div')
  .render(function (d) {
    d3.select(this).call(svg, d).call(menus, d);
  });
