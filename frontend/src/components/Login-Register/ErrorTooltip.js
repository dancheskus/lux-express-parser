import React, { Fragment } from 'react';
import { RegisterErrorTooltipStyle } from './style';
import { UncontrolledTooltip } from 'reactstrap';

export default props => {
  const uuid = 'id-' + Date.now();
  return (
    <Fragment>
      <RegisterErrorTooltipStyle id={uuid} visible={!!props.content} />
      <UncontrolledTooltip placement="right" target={uuid}>
        {props.content}
      </UncontrolledTooltip>
    </Fragment>
  );
};
