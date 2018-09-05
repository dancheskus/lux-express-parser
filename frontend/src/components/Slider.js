import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';
import React from 'react';
import Slider from 'rc-slider';

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);

const marks = {
  0: 0,
  5: 5,
  10: 10,
  15: 15,
  20: 20,
  25: 25,
  30: 30,
};

const wrapperStyle = { width: 400, marginBottom: 40, marginTop: 40 };

export default class SliderLine extends React.Component {
  render() {
    return (
      <div>
        <div style={wrapperStyle}>
          <p>В течении скольких дней хотите вернуться?</p>
          <Range
            dots
            step={1}
            min={0}
            max={30}
            defaultValue={[this.props.returningDayRangeMin, this.props.returningDayRangeMax]}
            disabled={!this.props.isReturning}
            onChange={value => this.props.onSliderChange(value)}
            marks={marks}
          />
        </div>
      </div>
    );
  }
}
