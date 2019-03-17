import React from "react";

function Good(props) {
  const index = props.index;
  const good = props.good;
  return (
    <div>
      <span>{`${index + 1}.`}</span>
      <input
        type="checkbox"
        onChange={props.handleSelect.bind(this,index)}
        checked={good.checked}
      />
      <span>{good.name}</span>
      <button onClick={props.handleMinus.bind(this,index)}> - </button>
      <input
        type="number"
        value={good.amount}
        onChange={e => props.handleChange(e, index)}
      />
      <button onClick={props.handlePlus.bind(this,index)}> + </button>
      <button onClick={props.handleDelete.bind(this,index)}>Delete</button>
    </div>
  );
}

export default Good;
