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
    setRadius(column) {
      dispatch({ type: 'SET_RADIUS', column });
    },
  };
}
