/* eslint-disable */
/* global d3 wheel */

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
