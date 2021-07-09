import React from 'react';
import PropTypes from 'prop-types';

import { Form, SwitchControl } from '@edx/paragon';

export default function FormSwitchGroup({
  id,
  name,
  label,
  helpText,
  className,
  onChange,
  onBlur,
  checked,
}) {
  const helpTextId = `${id}HelpText`;

  // Note that we use controlId here _and_ set some IDs and aria-describedby attributes manually.
  // controlId doesn't cover Form.Switch properly, so controlId is just helping to attach
  // a 'for' attribute to the Label.
  return (
    <Form.Group
      controlId={id}
      className={className}
    >
      <div className="d-flex flex-column">
        <div className="d-flex flex-row justify-content-between align-items-baseline pb-2">
          <Form.Label className="h4 text-primary-500 p-0 m-0">
            {label}
          </Form.Label>
          <SwitchControl
            id={id}
            name={name}
            aria-describedby={helpTextId}
            onChange={onChange}
            onBlur={onBlur}
            checked={checked}
          />
        </div>
        <Form.Text
          className="mt-0 pr-3"
          id={helpTextId}
          muted
        >
          {helpText}
        </Form.Text>
      </div>

    </Form.Group>
  );
}
FormSwitchGroup.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.node.isRequired,
  name: PropTypes.string,
  helpText: PropTypes.node.isRequired,
  className: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  checked: PropTypes.bool.isRequired,
};
FormSwitchGroup.defaultProps = {
  className: null,
  onBlur: null,
  name: null,
};
