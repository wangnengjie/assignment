import React from "react";

function SearchArea(props) {
  const { handleInput, handleSearch, addText } = props;
  return (
    <div>
      <input value={addText} onChange={handleInput} />
      <button onClick={handleSearch}>Add One</button>
    </div>
  );
}

export default SearchArea;
