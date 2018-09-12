import React, { Component } from 'react';
import axios from 'axios';
import Loader from './components/Loader';
import { SliderRangeLine, SliderLine } from './components/Slider';
import moment from 'moment';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';

import DatePicker from './components/DatePicker';
import SearchStop from './components/SearchStop';

const backend = 'http://localhost:5000';
// const backend = 'http://192.168.1.54:5000';

class App extends Component {
  state = {
    departure: 'riga-coach-station',
    destination: 'vilnius-coach-station',
    maxPricePerTrip: 5,
    isReturning: true,
    start_date: '01.10.2018',
    end_date: '11.10.2018',
    returningDayRangeMin: 2,
    returningDayRangeMax: 4,
    loading: false,
  };

  dateChange = (startDate, endDate) =>
    this.setState({
      start_date: moment(startDate).format('DD.MM.YYYY'),
      end_date: moment(endDate).format('DD.MM.YYYY'),
    });

  maxPricePerTripChange = price => this.setState({ maxPricePerTrip: price });
  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.setState({ loading: true });
    axios
      .post(`${backend}/findtickets`, {
        departure: this.state.departure,
        destination: this.state.destination,
        maxPricePerTrip: this.state.maxPricePerTrip,
        isReturning: this.state.isReturning,
        start_date: this.state.start_date,
        end_date: this.state.end_date,
        returningDayRange: {
          min: this.state.returningDayRangeMin,
          max: this.state.returningDayRangeMax,
        },
      })
      .then(res => {
        console.log(res.data);
        this.setState({ loading: false });
      })
      .catch(err => {
        console.log(err);
        this.setState({ loading: false });
      });
  };

  handleChekbox = e => {
    this.setState({ isReturning: !this.state.isReturning });
  };

  onSliderChange = value => {
    this.setState({ returningDayRangeMin: value[0], returningDayRangeMax: value[1] });
  };

  onStopChange = (direction, stop) => this.setState({ [direction]: stop.value });

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">LuxExpress</h1>
          <SearchStop placeholder={'From'} direction={'departure'} onStopChange={this.onStopChange} />
          <SearchStop placeholder={'To'} direction={'destination'} onStopChange={this.onStopChange} />
          <DatePicker onDateChange={this.dateChange} />
          <form onSubmit={this.handleSubmit}>
            <SliderLine
              maxPricePerTrip={this.state.maxPricePerTrip}
              maxPricePerTripChange={this.maxPricePerTripChange}
            />

            <div>
              <label>
                Return?
                <input
                  name="isReturning"
                  type="checkbox"
                  checked={this.state.isReturning}
                  onChange={this.handleChekbox}
                />
              </label>
            </div>

            <SliderRangeLine
              isReturning={this.state.isReturning}
              onSliderChange={this.onSliderChange}
              returningDayRangeMin={this.state.returningDayRangeMin}
              returningDayRangeMax={this.state.returningDayRangeMax}
            />

            <div>
              <button type="submit" disabled={this.state.loading}>
                Submit
                <Loader loading={this.state.loading} />
              </button>
            </div>
          </form>
        </header>
      </div>
    );
  }
}

export default App;
