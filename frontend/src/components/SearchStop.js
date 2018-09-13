import React, { Component } from 'react';

import axios from 'axios';
import AsyncSelect from 'react-select/lib/Async';

export default class WithPromises extends Component {
  state = { inputValue: '' };

  onChange = selectedStop => this.props.onStopChange(this.props.direction, selectedStop);

  promiseOptions = async () => {
    try {
      const allStopList = await axios.get(
        `https://cors-anywhere.herokuapp.com/https://ticket.luxexpress.eu/ru/Stops/FindBy?stopName=${
          this.state.inputValue
        }`
      );

      return allStopList.data.map(stop => {
        return { value: stop.Slug, label: stop.StopName };
      });
    } catch (e) {
      console.log(e);
    }
  };

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
