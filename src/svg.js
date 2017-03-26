/* eslint-disable import/prefer-default-export */

import * as d3 from 'd3';

// This component manages an svg element, and
// either displays a spinner or text,
// depending on the value of the `loading` state.
export const svg = d3.component('svg')
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
