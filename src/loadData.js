import * as d3 from 'd3';

export default function loadData(actions) {
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
