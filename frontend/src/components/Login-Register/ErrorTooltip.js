import React, { Fragment } from 'react';
import { RegisterErrorTooltipStyle } from './style';
import { UncontrolledTooltip } from 'reactstrap';
import { UID } from 'react-uid';

export default props => {
  return (
    <UID name={id => `unique-${id}`}>
      {id => (
        <Fragment>
          <RegisterErrorTooltipStyle id={id} visible={!!props.content} />
          <UncontrolledTooltip placement="right" target={id}>
            {props.content}
          </UncontrolledTooltip>
        </Fragment>
      )}
    </UID>
  );
};
