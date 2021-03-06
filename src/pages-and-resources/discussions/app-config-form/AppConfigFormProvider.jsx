import React from 'react';
import PropTypes from 'prop-types';

export const AppConfigFormContext = React.createContext({});

export default function AppConfigFormProvider({ children }) {
  const formRef = React.createRef();

  return (
    <AppConfigFormContext.Provider
      value={{
        formRef,
      }}
    >
      {children}
    </AppConfigFormContext.Provider>
  );
}

AppConfigFormProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
