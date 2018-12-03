import React, { Fragment } from 'react';
import { RegisterErrorTooltipStyle } from './style';
import { UncontrolledTooltip } from 'reactstrap';
import uuidv4 from 'uuid/v4';

export default props => {
  const uuid = 'id-' + uuidv4();
  return (
    <Fragment>
      <RegisterErrorTooltipStyle id={uuid} visible={!!props.content} />
      <UncontrolledTooltip placement="right" target={uuid}>
        {props.content}
      </UncontrolledTooltip>
    </Fragment>
  );
};
