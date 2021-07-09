import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';

import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import {
  Card, Form,
} from '@edx/paragon';

import {
  updateValidationStatus,
} from '../../../data/slice';
import AppExternalLinks from '../shared/AppExternalLinks';
import messages from './messages';

function LtiConfigForm({
  appConfig, app, onSubmit, intl, formRef, title,
}) {
  const dispatch = useDispatch();
  const { externalLinks } = app;
  const {
    handleSubmit,
    handleChange,
    handleBlur,
    values,
    touched,
    errors,
  } = useFormik({
    initialValues: appConfig,
    validationSchema: Yup.object().shape({
      consumerKey: Yup.string().required(intl.formatMessage(messages.consumerKeyRequired)),
      consumerSecret: Yup.string().required(intl.formatMessage(messages.consumerSecretRequired)),
      launchUrl: Yup.string().required(intl.formatMessage(messages.launchUrlRequired)),
    }),
    onSubmit,
  });

  const isInvalidConsumerKey = touched.consumerKey && errors.consumerKey;
  const isInvalidConsumerSecret = touched.consumerSecret && errors.consumerSecret;
  const isInvalidLaunchUrl = touched.launchUrl && errors.launchUrl;

  useEffect(() => {
    dispatch(updateValidationStatus({ hasError: Object.keys(errors).length > 0 }));
  }, [errors]);

  return (
    <Card className="mb-5 p-5" data-testid="ltiConfigForm">
      <Form ref={formRef} onSubmit={handleSubmit}>
        <h3 className="mb-3">{title}</h3>
        <p>{intl.formatMessage(messages.formInstructions)}</p>
        <Form.Group controlId="consumerKey" isInvalid={isInvalidConsumerKey} className="mb-4">
          <Form.Control
            floatingLabel={intl.formatMessage(messages.consumerKey)}
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.consumerKey}
          />
          {isInvalidConsumerKey && (
          <Form.Control.Feedback type="invalid" hasIcon={false}>
            <span className="x-small">{errors.consumerKey}</span>
          </Form.Control.Feedback>
          )}
        </Form.Group>
        <Form.Group controlId="consumerSecret" isInvalid={isInvalidConsumerSecret} className="mb-4">
          <Form.Control
            floatingLabel={intl.formatMessage(messages.consumerSecret)}
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.consumerSecret}
          />
          {isInvalidConsumerSecret && (
          <Form.Control.Feedback type="invalid" hasIcon={false}>
            <span className="x-small">{errors.consumerSecret}</span>
          </Form.Control.Feedback>
          )}
        </Form.Group>
        <Form.Group controlId="launchUrl" isInvalid={isInvalidLaunchUrl}>
          <Form.Control
            floatingLabel={intl.formatMessage(messages.launchUrl)}
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.launchUrl}
          />
          {isInvalidLaunchUrl && (
          <Form.Control.Feedback type="invalid" hasIcon={false}>
            <span className="x-small">{errors.launchUrl}</span>
          </Form.Control.Feedback>
          )}
        </Form.Group>
      </Form>
      <AppExternalLinks externalLinks={externalLinks} title={title} />
    </Card>
  );
}

LtiConfigForm.propTypes = {
  app: PropTypes.shape({
    id: PropTypes.string.isRequired,
    externalLinks: PropTypes.shape({
      learnMore: PropTypes.string,
      configuration: PropTypes.string,
      general: PropTypes.string,
      accessibility: PropTypes.string,
      contactEmail: PropTypes.string,
    }).isRequired,
  }).isRequired,
  appConfig: PropTypes.shape({
    consumerKey: PropTypes.string.isRequired,
    consumerSecret: PropTypes.string.isRequired,
    launchUrl: PropTypes.string.isRequired,
  }),
  intl: intlShape.isRequired,
  onSubmit: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  formRef: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
};

LtiConfigForm.defaultProps = {
  appConfig: {
    consumerKey: '',
    consumerSecret: '',
    launchUrl: '',
  },
};

export default injectIntl(LtiConfigForm);
