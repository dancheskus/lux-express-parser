import React, { Component } from 'react';
import axios from 'axios';
import Select from 'react-select';

export default class BusStopSearch extends Component {
  state = { options: [] };

  onChange = selectedStop => this.props.onStopChange(this.props.direction, selectedStop);

  async componentDidMount() {
    const { data } = await axios.get(process.env.REACT_APP_BACKEND_URL + '/findstops');
    this.setState({ options: data.map(({ StopName, Slug }) => ({ label: StopName, value: Slug })) });
  }

  render() {
    return <Select options={this.state.options} placeholder={this.props.placeholder} onChange={this.onChange} />;
  }
}
