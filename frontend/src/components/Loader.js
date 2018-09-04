import React from 'react';
import { css } from 'react-emotion';
import { BounceLoader } from 'react-spinners';

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

export default class AwesomeComponent extends React.Component {
  // state = {
  //   loading: true,
  // };

  render() {
    return (
      <div className="sweet-loading">
        <BounceLoader className={override} sizeUnit={'px'} size={20} color={'#123abc'} loading={this.props.loading} />
      </div>
    );
  }
}
