import React, { Component } from 'react';
import moment from 'moment';
import 'moment/locale/ru';
import { connect } from 'react-redux';

import { DateRangePicker } from 'react-dates';

class DatePicker extends Component {
  payedAccount = this.props.user.payedUntil > Date.now();
  state = {
    startDate: null,
    endDate: null,
    focusedInput: null,
  };
  handleDateChange = async ({ startDate, endDate }) => {
    if (!this.payedAccount && this.state.endDate) {
      this.setState({ startDate, endDate: null });
    } else {
      this.setState({ startDate, endDate });
    }
    this.props.onDateChange(startDate, endDate);
  };

  render() {
    moment.updateLocale();
    return (
      <div>
        <DateRangePicker
          startDate={this.state.startDate} // momentPropTypes.momentObj or null,
          startDateId="your_unique_start_date_id" // PropTypes.string.isRequired,
          endDate={this.state.endDate} // momentPropTypes.momentObj or null,
          endDateId="your_unique_end_date_id" // PropTypes.string.isRequired,
          onDatesChange={this.handleDateChange} // PropTypes.func.isRequired,
          focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
          onFocusChange={focusedInput => this.setState({ focusedInput })} // PropTypes.func.isRequired,
          displayFormat={'DD.MM.YYYY'}
          startDatePlaceholderText={'Начало'}
          endDatePlaceholderText={'Конец'}
          isOutsideRange={day => {
            if (!this.payedAccount && this.state.startDate && !this.state.endDate) {
              return day.diff(moment()) <= 0 || day.diff(moment(this.state.startDate).add(7, 'd')) > 0;
            } else {
              return day.diff(moment()) <= 0 || day.diff(moment().add(6, 'M')) >= 0;
            }
          }}
          // isOutsideRange={day => day.diff(moment()) <= 0 || day.diff(moment().add(6, 'M')) >= 0}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
});

export default connect(mapStateToProps)(DatePicker);
