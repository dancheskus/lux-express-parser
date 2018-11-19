import React, { Component } from 'react';
import axios from 'axios';
import Loader from './Loader';
import { SliderRangeLine, SliderLine } from './Slider';
import moment from 'moment';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { NavLink } from 'react-router-dom';
import { Button } from 'reactstrap';

import DatePicker from './DatePicker';
import SearchStop from './SearchStop';

import { connect } from 'react-redux';
import { addLinks, removeLinks } from '../actions/ticketActions';

import { getJwt } from '../helpers/jwt';

class MainSearchEngine extends Component {
  payedAccount = this.props.user.payedUntil > Date.now();
  state = {
    departure: null,
    destination: null,
    maxPricePerTrip: 5,
    isReturning: this.payedAccount ? true : false,
    start_date: null,
    end_date: null,
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
    const jwt = getJwt();
    this.setState({ loading: true });
    axios
      .post(
        `${process.env.REACT_APP_BACKEND_URL}/findtickets`,
        {
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
        },
        { headers: { 'x-auth': jwt } }
      )

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
      <div className="app">
        <h1 className="app-title">Поиск дешевых билетов</h1>
        <div className="search-stop">
          <SearchStop placeholder={'From'} direction={'departure'} onStopChange={this.onStopChange} />
        </div>
        <div className="search-stop">
          <SearchStop placeholder={'To'} direction={'destination'} onStopChange={this.onStopChange} />
        </div>
        <div className="date-picker">
          <DatePicker onDateChange={this.dateChange} />
        </div>
        <form onSubmit={this.handleSubmit}>
          <SliderLine maxPricePerTrip={this.state.maxPricePerTrip} maxPricePerTripChange={this.maxPricePerTripChange} />

          <div>
            <label>
              Return?
              <input
                name="isReturning"
                type="checkbox"
                disabled={!this.payedAccount}
                checked={this.state.isReturning}
                onChange={this.handleChekbox}
              />
              {!this.payedAccount && '(Платная опция)'}
            </label>
          </div>

          <SliderRangeLine
            isReturning={this.state.isReturning}
            onSliderChange={this.onSliderChange}
            returningDayRangeMin={this.state.returningDayRangeMin}
            returningDayRangeMax={this.state.returningDayRangeMax}
          />
          <div>
            <button
              className="search-button"
              type="submit"
              disabled={
                this.state.loading ||
                !this.state.start_date ||
                !this.state.end_date ||
                !this.state.departure ||
                !this.state.destination
              }
            >
              Поиск
              <Loader loading={this.state.loading} />
            </button>
          </div>
        </form>
        {this.props.user.payedUntil <= Date.now() && (
          <h1 className="full-access">
            <NavLink to="/checkout">полный доступ</NavLink>
          </h1>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  tickets: state.tickets,
  user: state.user,
});

const mapDispatchToProps = dispatch => ({
  addLinks: links => dispatch(addLinks(links)),
  removeLinks: () => dispatch(removeLinks()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MainSearchEngine);
