import React, { Component } from 'react';
import axios from 'axios';
import Loader from './components/Loader';

class App extends Component {
  state = {
    departure: 'vilnius-coach-station',
    destination: 'riga-coach-station',
    maxPricePerTrip: 5,
    isReturning: true,
    start_date: '01.10.2018',
    end_date: '11.10.2018',
    returningDayRangeMin: 1,
    returningDayRangeMax: 6,
    loading: false,
  };
  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.setState({ loading: true });
    axios
      .post('http://localhost:5000/findtickets', {
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

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">LuxExpress</h1>
          <form onSubmit={this.handleSubmit}>
            <div>
              <label>
                From:
                <input
                  placeholder="From"
                  name="departure"
                  type="text"
                  value={this.state.departure}
                  onChange={this.handleChange}
                />
              </label>
            </div>

            <div>
              <label>
                To:
                <input
                  placeholder="To"
                  name="destination"
                  type="text"
                  value={this.state.destination}
                  onChange={this.handleChange}
                />
              </label>
            </div>

            <div>
              <label>
                Maximium price per trip:
                <input
                  placeholder="Price"
                  name="maxPricePerTrip"
                  type="text"
                  value={this.state.maxPricePerTrip}
                  onChange={this.handleChange}
                />
              </label>
            </div>

            <div>
              <label>
                Returning?
                <input
                  name="isReturning"
                  type="checkbox"
                  checked={this.state.isReturning}
                  onChange={this.handleChekbox}
                />
              </label>
            </div>

            <div>
              <label>
                Start date:
                <input
                  placeholder="Date"
                  name="start_date"
                  type="text"
                  value={this.state.start_date}
                  onChange={this.handleChange}
                />
              </label>
            </div>

            <div>
              <label>
                End date:
                <input
                  placeholder="Date"
                  name="end_date"
                  type="text"
                  value={this.state.end_date}
                  onChange={this.handleChange}
                />
              </label>
            </div>

            <div>
              <div> Returning day range</div>
              <label>
                From:
                <input
                  name="returningDayRangeMin"
                  type="text"
                  value={this.state.returningDayRangeMin}
                  onChange={this.handleChange}
                />
              </label>

              <label>
                destination:
                <input
                  name="returningDayRangeMax"
                  type="text"
                  value={this.state.returningDayRangeMax}
                  onChange={this.handleChange}
                />
              </label>
            </div>

            <div>
              <button type="submit">
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
