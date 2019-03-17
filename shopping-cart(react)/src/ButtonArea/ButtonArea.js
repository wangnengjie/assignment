import React from "react";

function ButtonArea(props) {
  const { handleSelectAll, handleInvertSelect, handleFilter } = props;
  return (
    <div>
      <button onClick={handleSelectAll}>SelectAll</button>
      <button onClick={handleInvertSelect}>Invert Select</button>
      <button onClick={handleFilter}>Delete All Selected</button>
    </div>
  );
}

export default ButtonArea;