import React from 'react';
import PropTypes from 'prop-types';

import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { Form } from '@edx/paragon';

import messages from './messages';

/**
 * Lets break this regex down.
 *
 * The goal is to accept arrays of dates like the following:
 *
 * [["2015-09-15", "2015-09-21"], ["2015-10-01T11:45", "2015-10-08"]]
 *
 * Any date can be YYYY-MM-DDTHH:MM or just YYYY-MM-DD like the above.
 * The hours and minutes are optional, as illustrated.
 *
 * The regex errs on the side of being too loose, so you'll see things that are not perfect.  It's
 * better to be too liberal than to accidentally reject something that should be fine.
 *
 * So let multi-line this regex and explain the parts:
 *
 * Beginning of the string:
 *     ^
 * The outer square brackets:
 *     \[
 * Start of a group for a pair of dates with their square brackets:
 *     (\[
 * A group for the first date (YYYY-MM-DDTHH:MM) with its opening double quote:
 *     ("
 * Any four digits for the YYYY year, and a dash:
 *     [0-9]{4}-
 * MM Months 00 - 12 with either a 0 followed by a digit, 1-9, OR a 1 followed by a digit 0-2
 * Then a dash:
 *     (0[1-9]|1[0-2])-
 * Finally, for days, accepts any digit 0-3 followed by any digit 0-9.  Not a very exact regex.
 *     [0-3][0-9]
 * A sub-group for the hours and minutes.  T is just part of it:
 *     (T
 * The hours HH are a 0 or 1 followed by 0-9, OR a 2 followed by 0-3.  Captures digits 00-23:
 *     ([0-1][0-9]|2[0-3])
 * Then a colon!
 *     :
 * The minutes MM are any digit 0-5 followed by any digit 0-9, capturing 00-59:
 *     ([0-5][0-9])
 * The THH:MM is optional, so end the group by allowing it to repeat 0 or 1 times
 *     ){0,1}
 * Now end the first date group with its closing double quote, the group parenthesis, and a comma.
 * The comma is a necessary separator between the first and second dates:
 *     "),
 * Now start the second date of the pair:
 *     ("
 * The second date is identical to the first, so here it is in all its glory:
 *     [0-9]{4}-(0[1-9]|1[0-2])-[0-3][0-9] // YYYY-MM-DD, identical to above
 *     (T([0-1][0-9]|2[0-3]):([0-5][0-9])){0,1}  // THH:MM, identical to above
 * Close out the second date with its closing double quotes:
 *     ")
 * Close out the pair of dates with its closing square bracket:
 *     \]
 * An optional comma after the pair of dates, in case there's another pair.  If there isn't another
 * date, there shouldn't be another comma, but this regex errors on the side of looseness.
 *     (,){0,1}
 * This entire group, ["YYYY-MM-DDTHH:MM", "YYYY-MM-DDTHH:MM"], can be repeated zero or more times.
 *     )*
 * Close out the last square bracket around all the groups:
 *    \]
 * End of string:
 *    $
 */
export const blackoutDatesRegex = /^\[(\[("[0-9]{4}-(0[1-9]|1[0-2])-[0-3][0-9](T([0-1][0-9]|2[0-3]):([0-5][0-9])){0,1}"),("[0-9]{4}-(0[1-9]|1[0-2])-[0-3][0-9](T([0-1][0-9]|2[0-3]):([0-5][0-9])){0,1}")\](,){0,1})*\]$/;

function BlackoutDatesField({
  onBlur,
  onChange,
  intl,
  values,
  errors,
}) {
  return (
    <>
      <h5 className="my-4 text-gray-500">{intl.formatMessage(messages.blackoutDates)}</h5>
      <Form.Group
        controlId="blackoutDates"
      >
        <Form.Control
          value={values.blackoutDates}
          onChange={onChange}
          onBlur={onBlur}
          className="mb-3"
          floatingLabel={intl.formatMessage(messages.blackoutDatesLabel)}
        />
        {errors.blackoutDates && (
          <Form.Control.Feedback type="invalid">
            {errors.blackoutDates}
          </Form.Control.Feedback>
        )}
        <Form.Text muted>
          {intl.formatMessage(messages.blackoutDatesHelp)}
        </Form.Text>
      </Form.Group>
    </>
  );
}

BlackoutDatesField.propTypes = {
  onBlur: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
  values: PropTypes.shape({
    blackoutDates: PropTypes.string,
  }).isRequired,
  errors: PropTypes.shape({
    blackoutDates: PropTypes.string,
  }).isRequired,
};

export default injectIntl(BlackoutDatesField);
