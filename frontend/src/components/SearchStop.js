// import React from 'react';
// import Select from 'react-select';
// import Async from 'react-select/lib/Async';

// const options = [
//   { value: 'chocolate', label: 'Chocolate' },
//   { value: 'strawberry', label: 'Strawberry' },
//   { value: 'vanilla', label: 'Vanilla' },
// ];

// export default class SearchStop extends React.Component {
//   state = {
//     selectedOption: null,
//   };
//   handleChange = selectedOption => {
//     this.setState({ selectedOption });
//     console.log(`Option selected:`, selectedOption);
//   };
//   render() {
//     const { selectedOption } = this.state;

//     return (
//       <Select
//         value={selectedOption}
//         onChange={this.handleChange}
//         placeholder={'Начальная остановка'}
//         options={options}
//       />
//     );
//   }
// }

import React, { Component } from 'react';

import axios from 'axios';
import AsyncSelect from 'react-select/lib/Async';

export default class WithPromises extends Component {
  state = { inputValue: '' };

  onChange = selectedStop => this.props.onStopChange(this.props.direction, selectedStop);

  promiseOptions = () =>
    axios
      .get(
        `https://cors-anywhere.herokuapp.com/https://ticket.luxexpress.eu/ru/Stops/FindBy?stopName=${
          this.state.inputValue
        }`
      )
      .then(result =>
        result.data.map(stop => {
          return { value: stop.Slug, label: stop.StopName };
        })
      )
      .catch(e => console.log(e));

  handleInputChange = inputValue => this.setState({ inputValue });

  render() {
    return (
      <div>
        <AsyncSelect
          cacheOptions
          defaultOptions
          loadOptions={this.promiseOptions}
          onInputChange={this.handleInputChange}
          placeholder={this.props.placeholder}
          onChange={this.onChange}
        />
      </div>
    );
  }
}
