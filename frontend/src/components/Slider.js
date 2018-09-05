import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';
import React from 'react';
import Slider from 'rc-slider';
import Tooltip from 'rc-tooltip';
const Handle = Slider.Handle;

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);

const wrapperStyle = { width: 400, marginBottom: 40, marginTop: 40 };

const handle = props => {
  const { value, dragging, index, ...restProps } = props;
  return (
    <Tooltip
      prefixCls="rc-slider-tooltip"
      overlay={value}
      visible={dragging}
      placement="top"
      key={index}
    >
      <Handle value={value} {...restProps} />
    </Tooltip>
  );
};

export class SliderRangeLine extends React.Component {
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
            onAfterChange={value => this.props.onSliderChange(value)}
            allowCross={false}
            marks={{
              0: 0,
              5: 5,
              10: 10,
              15: 15,
              20: 20,
              25: 25,
              30: 30,
            }}
          />
        </div>
      </div>
    );
  }
}
export class SliderLine extends React.Component {
  render() {
    return (
      <div>
        <div style={wrapperStyle}>
          <p>Максимальная цена поездки:</p>
          <Slider
            dots
            marks={{
              5: {
                style: {
                  color: 'red',
                },
                label: <strong>5</strong>,
              },
              10: 10,
              15: 15,
              20: 20,
              25: 25,
              30: 30,
            }}
            step={1}
            min={5}
            max={30}
            defaultValue={this.props.maxPricePerTrip}
            onAfterChange={value => this.props.maxPricePerTripChange(value)}
            handle={handle}
          />
        </div>
      </div>
    );
  }
}
