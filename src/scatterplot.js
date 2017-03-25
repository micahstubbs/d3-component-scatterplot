/* eslint-disable */
/* global d3 axis mobileScreen */

// This component displays the visualization.
const scatterplot = ((() => {
  const xScale = d3.scaleLinear();
  const yScale = d3.scaleLinear();

  const colorScale = d3.scaleOrdinal()
    .range(d3.schemeCategory10);

  // scale for the circle size
  const radiusScale = d3.scaleSqrt();
  const fillOpacityScale = d3.scaleThreshold();

  function render(d) {
    const x = d.x;
    const y = d.y;
    const color = d.color;
    const radius = d.radius;
    const margin = d.margin;
    const innerWidth = d.width - margin.left - margin.right;
    const innerHeight = d.height - margin.top - margin.bottom;
    const minRadius = 1;
    const maxRadius = 12;

    xScale
      .domain(d3.extent(d.data, d => d[x]))
      .range([0, innerWidth]);
    yScale
      .domain(d3.extent(d.data, d => d[y]))
      .range([innerHeight, 0]);
    colorScale
      .domain(d3.extent(d.data, d => d[color]));
    radiusScale
      .range([mobileScreen ? 1 : 2, mobileScreen ? 10 : 16])
      .domain(d3.extent(d.data, d => d[radius]));

    // set the fill opacity
    // based on the cardinality of the data
    fillOpacityScale
      .domain([200, 300, 500])
      .range([0.7, 0.5, 0.3, 0.2]);

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

    const renderData = d.data;
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
        .attr('r', d => radiusScale(d[radius]))
        .attr('cx', d => xScale(d[x]))
        .attr('cy', d => yScale(d[y]))
        .attr('color', d => colorScale(d[color]))
        .style('fill-opacity', fillOpacityScale(renderData.length));
  }
  return d3.component('g')
    .render(render);
})());
