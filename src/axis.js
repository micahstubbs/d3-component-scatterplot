/* eslint-disable */
/* global d3 */

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
