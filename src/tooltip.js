/* global d3 */

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
