import React from "react";
import ButtonArea from "./ButtonArea/ButtonArea.js";
import Good from "./Good/Good.js";
import SearchArea from "./SearchArea/SearchArea.js";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addText: "",
      goods: []
    };
    this.handleInput = this.handleInput.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handlePlus = this.handlePlus.bind(this);
    this.handleMinus = this.handleMinus.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
    this.handleInvertSelect = this.handleInvertSelect.bind(this);
    this.handleSelectAll = this.handleSelectAll.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleInput(e) {
    this.setState({ addText: e.target.value });
  }

  handleSearch() {
    const goods = this.state.goods;
    const addText = this.state.addText;
    if (addText === "") return;
    if (goods.length === 0) {
      this.setState({
        goods: goods.concat([{ name: addText, amount: 0, checked: false }]),
        addText: ""
      });
      return;
    }

    for (let [key, { name, amount }] of goods.entries()) {
      if (name === addText) {
        goods[key].amount = amount + 1;
        this.setState({ goods, addText: "" });
        break;
      } else if (key === goods.length - 1) {
        this.setState({
          goods: goods.concat([{ name: addText, amount: 0, checked: false }]),
          addText: ""
        });
        break;
      }
    }
  }

  handleDelete(i) {
    const goods = this.state.goods;
    goods.splice(i, 1);
    this.setState({ goods });
  }

  handlePlus(i) {
    const goods = this.state.goods;
    goods[i].amount++;
    this.setState({ goods });
  }

  handleMinus(i) {
    const goods = this.state.goods;
    const amount = goods[i].amount;
    if (amount === 0) return;
    goods[i].amount--;
    this.setState({ goods });
  }

  handleSelect(i) {
    const goods = this.state.goods;
    goods[i].checked = !goods[i].checked;
    this.setState({ goods });
  }

  handleSelectAll() {
    const goods = this.state.goods;
    this.setState({ goods: goods.map(good => ({ ...good, checked: true })) });
  }

  handleInvertSelect() {
    const goods = this.state.goods;
    const invertSelect = goods.map(good => {
      return { ...good, checked: !good.checked };
    });
    this.setState({ goods: invertSelect });
  }

  handleFilter() {
    const goods = this.state.goods;
    const afFilter = goods.filter(good => !good.checked);
    this.setState({ goods: afFilter });
  }

  handleChange(e, i) {
    const value = e.target.value;
    const goods = this.state.goods;
    goods[i].amount = value;
    this.setState({ goods });
  }

  render() {
    const goods = this.state.goods;
    return (
      <React.Fragment>
        {goods.map((good, index) => (
          <Good
            good={good}
            key={good.name}
            index={index}
            handleChange={this.handleChange}
            handleDelete={this.handleDelete}
            handleMinus={this.handleMinus}
            handlePlus={this.handlePlus}
            handleSelect={this.handleSelect}
          />
        ))}
        <ButtonArea
          handleSelectAll={this.handleSelectAll}
          handleInvertSelect={this.handleInvertSelect}
          handleFilter={this.handleFilter}
        />
        <SearchArea
          handleInput={this.handleInput}
          handleSearch={this.handleSearch}
          addText={this.state.addText}
        />
      </React.Fragment>
    );
  }
}

export default App;
