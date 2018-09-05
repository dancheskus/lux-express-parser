import React from 'react';
import moment from 'moment';
import 'moment/locale/ru';

import { DateRangePicker } from 'react-dates';

export default class DatePicker extends React.Component {
  state = {
    startDate: null,
    endDate: null,
    focusedInput: null,
  };
  handleDateChange = ({ startDate, endDate }) => {
    this.setState({ startDate, endDate });
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
        />
      </div>
    );
  }
}
