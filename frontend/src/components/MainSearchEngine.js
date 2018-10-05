import React, { Component } from 'react';
import axios from 'axios';
import Loader from './Loader';
import { SliderRangeLine, SliderLine } from './Slider';
import moment from 'moment';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';

import DatePicker from './DatePicker';
import SearchStop from './SearchStop';

import { connect } from 'react-redux';
import { addLinks, removeLinks } from '../actions/ticketActions';

import ENV from '../.env';

const backend = ENV.BACKEND;

class MainSearchEngine extends Component {
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
        this.setState({ loading: false });
        this.props.removeLinks();
        this.props.addLinks(res.data);
        this.props.history.push('/results');
      })
      .catch(err => {
        console.log(err);
        this.setState({ loading: false });
      });
  };

  handleChekbox = () => {
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

const mapStateToProps = state => ({
  tickets: state.tickets,
});

const mapDispatchToProps = dispatch => ({
  addLinks: links => dispatch(addLinks(links)),
  removeLinks: () => dispatch(removeLinks()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MainSearchEngine);
